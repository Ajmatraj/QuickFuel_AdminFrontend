export interface UserProfile {
    _id: string
    username: string
    email: string
    name: string
    avatar: string
    role: "fuelstation" | "rider" | string
    createdAt: string
    updatedAt: string
    orders: any[]
    ratingGiven: any[]
    ratingRecived: any[]
    status: string
    address?: string
    phone?: string
    bio?: string
  }
  
  export interface User {
    _id: string
    name: string
    email: string
    status: "online" | "offline"
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
  }
  
  export interface Message {
    _id: string
    content: string
    senderId: string
    receiverId: string
    timestamp: string
    isRead: boolean
    createdAt: string // Added createdAt property

  }
  