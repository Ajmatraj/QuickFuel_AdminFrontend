"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import type { UserProfile } from "@/app/types/user"
import { format } from "date-fns"
import clsx from "clsx"

// Define message and user types
interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  timestamp: string
  isRead: boolean
}

interface ChatUser {
  id: string
  name: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  role: string
}

export default function ChatTab({ user }: { user: UserProfile }) {
  const [users, setUsers] = useState<ChatUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const currentUserId = user._id || user.id

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true)
      setError(null)

      try {
        const storedUser = localStorage.getItem("userDetails")
        if (!storedUser) throw new Error("No user details found")

        const parsedUserDetails = JSON.parse(storedUser)
        const userId = parsedUserDetails?._id || parsedUserDetails?.id || null
        const token = parsedUserDetails?.token || localStorage.getItem("accessToken")

        const response = await fetch("http://localhost:8000/api/v1/users/allUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()

        // Filter out current user and transform to ChatUser format
        const chatUsers: ChatUser[] = data
          .filter((u: any) => u._id !== currentUserId)
          .map((u: any) => ({
            id: u._id,
            name: u.fullName || u.name || u.stationName || "Unknown User",
            avatar: u.avatar || u.logo,
            unreadCount: 0,
            role: u.role || "user",
          }))

        setUsers(chatUsers)

        // Select first user by default if none selected
        if (!selectedUser && chatUsers.length > 0) {
          setSelectedUser(chatUsers[0])
        }
      } catch (err) {
        console.error("Error fetching users:", err)
        setError(err instanceof Error ? err.message : "Failed to load users")
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [currentUserId, user.token])

  // Fetch messages when selected user changes
  useEffect(() => {
    if (!selectedUser) return

    const fetchMessages = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = user.token || localStorage.getItem("accessToken")

        // Fetch messages between current user and selected user
        const response = await fetch(
          `http://localhost:8000/api/v1/messages/between/${currentUserId}/${selectedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) {
          // If the specific endpoint doesn't exist, fall back to all messages
          const fallbackResponse = await fetch(`http://localhost:8000/api/v1/messages/${currentUserId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!fallbackResponse.ok) {
            throw new Error("Failed to fetch messages")
          }

          const allMessages = await fallbackResponse.json()

          // Filter messages between current user and selected user
          const filteredMessages = allMessages.filter(
            (msg: Message) =>
              (msg.senderId === currentUserId && msg.receiverId === selectedUser.id) ||
              (msg.senderId === selectedUser.id && msg.receiverId === currentUserId),
          )

          setMessages(filteredMessages)
          return
        }

        const data = await response.json()
        setMessages(data)

        // Mark messages as read
        if (selectedUser.unreadCount > 0) {
          markMessagesAsRead(selectedUser.id)
        }
      } catch (err) {
        console.error("Error fetching messages:", err)
        setError(err instanceof Error ? err.message : "Failed to load messages")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [selectedUser, currentUserId, user.token])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Set up socket connection for real-time messaging
  useEffect(() => {
    // This is a placeholder for socket connection
    // In a real implementation, you would connect to your WebSocket server here

    const connectSocket = () => {
      // Example socket connection code:
      // const socket = io("http://localhost:8000")
      // socket.on("connect", () => {
      //   console.log("Connected to socket server")
      //   socket.emit("join", { userId: currentUserId })
      // })
      // socket.on("new_message", (message: Message) => {
      //   // Handle incoming message
      //   if (selectedUser &&
      //     ((message.senderId === currentUserId && message.receiverId === selectedUser.id) ||
      //     (message.senderId === selectedUser.id && message.receiverId === currentUserId))) {
      //     setMessages(prev => [...prev, message])
      //   }
      //   // Update unread count for users
      //   setUsers(prevUsers =>
      //     prevUsers.map(user =>
      //       user.id === message.senderId && message.receiverId === currentUserId
      //         ? { ...user, lastMessage: message.content, lastMessageTime: new Date().toISOString(), unreadCount: user.unreadCount + 1 }
      //         : user
      //     )
      //   )
      // })
      // return socket
    }

    // const socket = connectSocket()

    // return () => {
    //   socket?.disconnect()
    // }
  }, [currentUserId])

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUserId,
      receiverId: selectedUser.id,
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    // Optimistically update UI
    setMessages((prev) => [...prev, message])
    setNewMessage("")

    try {
      const token = user.token || localStorage.getItem("accessToken")

      const response = await fetch("http://localhost:8000/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      // Update last message for selected user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                lastMessage: message.content,
                lastMessageTime: new Date().toISOString(),
              }
            : user,
        ),
      )

      // In a real implementation, you would emit the message to the socket server here
      // socket.emit("send_message", message)
    } catch (err) {
      console.error("Error sending message:", err)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })

      // Remove the optimistically added message
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id))
    }
  }

  const markMessagesAsRead = async (userId: string) => {
    try {
      const token = user.token || localStorage.getItem("accessToken")

      await fetch(`http://localhost:8000/api/v1/messages/markAsRead/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Update unread count for the user
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, unreadCount: 0 } : user)))
    } catch (err) {
      console.error("Error marking messages as read:", err)
    }
  }

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user)
  }

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-[70vh]">
          {/* User list sidebar */}
          <div className="w-full md:w-1/3 border-r border-gray-200">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 focus-visible:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loadingUsers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ScrollArea className="h-[calc(70vh-100px)]">
                  <div className="space-y-1 p-1">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No users found</p>
                      </div>
                    ) : (
                      filteredUsers.map((chatUser) => (
                        <div
                          key={chatUser.id}
                          className={clsx(
                            "p-3 rounded-md cursor-pointer transition-all duration-200",
                            selectedUser?.id === chatUser.id
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "hover:bg-gray-50 border-l-4 border-transparent",
                          )}
                          onClick={() => handleUserSelect(chatUser)}
                        >
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <div className="rounded-full bg-gray-200 h-full w-full flex items-center justify-center text-gray-600 font-medium">
                                {chatUser.name.charAt(0).toUpperCase()}
                              </div>
                            </Avatar>

                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{chatUser.name}</div>
                                {chatUser.unreadCount > 0 && (
                                  <Badge variant="default" className="ml-auto bg-blue-500">
                                    {chatUser.unreadCount}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center text-xs text-gray-500">
                                <Badge variant="outline" className="mr-2 text-xs font-normal">
                                  {chatUser.role}
                                </Badge>
                                {chatUser.lastMessage && (
                                  <p className="truncate max-w-[120px]">{chatUser.lastMessage}</p>
                                )}
                              </div>

                              {chatUser.lastMessageTime && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {format(new Date(chatUser.lastMessageTime), "hh:mm a")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="w-full md:w-2/3 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <div className="rounded-full bg-gray-200 h-full w-full flex items-center justify-center text-gray-600 font-medium">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-blue-700">{selectedUser.name}</h3>
                      <p className="text-xs text-gray-500">{selectedUser.role}</p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-grow p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <MessageSquare className="h-12 w-12 mb-2 text-gray-300" />
                      <p>No messages yet</p>
                      <p className="text-xs mt-1">Start the conversation by sending a message</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isSentByCurrentUser = message.senderId === currentUserId

                        return (
                          <div
                            key={message.id}
                            className={clsx("flex", isSentByCurrentUser ? "justify-end" : "justify-start")}
                          >
                            <div
                              className={clsx(
                                "flex items-end max-w-[80%]",
                                isSentByCurrentUser ? "flex-row-reverse" : "flex-row",
                              )}
                            >
                              <Avatar
                                className={clsx(
                                  "h-8 w-8 mx-2 shadow-sm",
                                  isSentByCurrentUser ? "bg-blue-600" : "bg-gray-400",
                                )}
                              >
                                <div className="rounded-full w-full h-full flex items-center justify-center text-white font-medium">
                                  {isSentByCurrentUser
                                    ? user.fullName?.charAt(0) || user.name?.charAt(0) || "Y"
                                    : selectedUser.name.charAt(0)}
                                </div>
                              </Avatar>

                              <div>
                                <div
                                  className={clsx(
                                    "px-4 py-2 rounded-lg break-words shadow-sm",
                                    isSentByCurrentUser
                                      ? "bg-blue-600 text-white rounded-br-none"
                                      : "bg-white text-gray-800 rounded-bl-none border",
                                  )}
                                >
                                  <p>{message.content}</p>
                                </div>
                                <p
                                  className={clsx(
                                    "text-xs text-gray-500 mt-1",
                                    isSentByCurrentUser ? "text-right" : "text-left",
                                  )}
                                >
                                  {format(new Date(message.timestamp), "h:mm a")}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow mr-2 focus-visible:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-blue-50 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-gray-500">Select a user to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
