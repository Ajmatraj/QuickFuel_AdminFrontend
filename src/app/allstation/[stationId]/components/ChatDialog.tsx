"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { fetchMessages, sendMessage } from "@/lib/api"
import socket from "@/lib/socket"
import type { Message, User } from "@/app/types/user"

interface ChatDialogProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User
  stationUser: {
    _id: string
    name: string
    imageUrl?: string
  }
}

export default function ChatDialog({ isOpen, onClose, currentUser, stationUser }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && currentUser._id && stationUser._id) {
      loadMessages()

      // Socket event listeners
      socket.on("connect", () => {
        console.log("Socket connected")
      })

      socket.on("receiveMessage", (message: Message) => {
        if (
          (message.senderId === currentUser._id && message.receiverId === stationUser._id) ||
          (message.senderId === stationUser._id && message.receiverId === currentUser._id)
        ) {
          setMessages((prev) => [...prev, message])
        }
      })

      return () => {
        socket.off("receiveMessage")
      }
    }
  }, [isOpen, currentUser._id, stationUser._id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      // Fetch messages between current user and station user
      const fetchedMessages = await fetchMessages(currentUser._id)

      // Filter messages between these two users
      const relevantMessages = fetchedMessages.filter(
        (msg) =>
          (msg.senderId === currentUser._id && msg.receiverId === stationUser._id) ||
          (msg.senderId === stationUser._id && msg.receiverId === currentUser._id),
      )

      setMessages(relevantMessages)
    } catch (error) {
      console.error("Failed to load messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)
    try {
      const messageData: Message = {
        _id: "", // Temporary placeholder, replace with actual ID if available
        senderId: currentUser._id,
        receiverId: stationUser._id,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(), // Add current timestamp
        isRead: false, // Default to false
        createdAt: new Date().toISOString(), // Add createdAt property
      }

      const sentMessage = await sendMessage(messageData)
      if (sentMessage) {
        // Socket will handle adding the message to the chat
        socket.emit("sendMessage", sentMessage)
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="border-b p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={stationUser.imageUrl || "/placeholder.svg"} />
              <AvatarFallback>{stationUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{stationUser.name}</h3>
              <p className="text-xs text-gray-500">Fuel Station</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(600px-132px)]">
            <div className="p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isCurrentUser = message.senderId === currentUser._id
                  return (
                    <div
                      key={message._id || index}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isCurrentUser
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-3">
          <div className="flex w-full gap-2">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
