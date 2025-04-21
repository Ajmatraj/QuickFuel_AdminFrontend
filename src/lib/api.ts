// import axios from "axios"
// import type { Message, User } from "@/app/types/user"

// // ✅ Use environment variable for the API base URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

// // ✅ Utility function to handle API requests (GET and POST)
// const apiRequest = async (method: "get" | "post", url: string, data?: any) => {
//   try {
//     const response = await axios({ method, url, data })

//     if (response && response.data) {
//       return response.data
//     } else {
//       console.error("Unexpected response format:", response)
//       return null
//     }
//   } catch (error: any) {
//     console.error("API request failed:", error)
//     return error?.response?.data || null
//   }
// }

// // ✅ Fetch all users
// export async function fetchUsers(): Promise<User[]> {
//   try {
//     const data = await apiRequest("get", `${API_BASE_URL}/users/allUsers`)

//     if (data && Array.isArray(data)) {
//       return data
//     } else if (data && data.data && Array.isArray(data.data)) {
//       return data.data
//     } else {
//       console.error("Unexpected response format for users:", data)
//       return []
//     }
//   } catch (error) {
//     console.error("Failed to fetch users:", error)
//     return []
//   }
// }

// // ✅ Fetch messages for a specific user
// export async function fetchMessages(userId: string): Promise<Message[]> {
//   if (!userId) {
//     console.error("User ID is required to fetch messages")
//     return []
//   }

//   try {
//     const data = await apiRequest("get", `${API_BASE_URL}/messages/${userId}`)

//     if (data) {
//       return data
//     } else {
//       console.error("Failed to fetch messages for user:", userId)
//       return []
//     }
//   } catch (error) {
//     console.error(`Failed to fetch messages for user ${userId}:`, error)
//     return []
//   }
// }

// // ✅ Send a new message
// export async function sendMessage(message: Message): Promise<Message | null> {
//   // Important: message must have senderId, receiverId, and content
//   if (!message.senderId || !message.receiverId || !message.content) {
//     console.error("senderId, receiverId, and content are required in message")
//     return null
//   }

//   try {
//     const data = await apiRequest("post", `${API_BASE_URL}/messages`, message)

//     if (data) {
//       return data
//     } else {
//       console.error("Failed to send message")
//       return null
//     }
//   } catch (error) {
//     console.error("Failed to send message:", error)
//     return null
//   }
// }

// // ✅ Mark messages as read for a user
// export async function markMessagesAsRead(userId: string): Promise<boolean> {
//   try {
//     const data = await apiRequest("post", `${API_BASE_URL}/messages/markAsRead/${userId}`)
//     return !!data
//   } catch (error) {
//     console.error("Failed to mark messages as read:", error)
//     return false
//   }
// }





import axios from "axios"
import type { Message, User } from "@/app/types/user"

// ✅ Use environment variable for the API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

// ✅ Utility function to handle API requests (GET and POST)
const apiRequest = async (method: "get" | "post", url: string, data?: any) => {
  try {
    const response = await axios({ method, url, data })

    if (response && response.data) {
      return response.data
    } else {
      console.error("Unexpected response format:", response)
      return null
    }
  } catch (error: any) {
    console.error("API request failed:", error)
    return error?.response?.data || null
  }
}

// ✅ Fetch all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const data = await apiRequest("get", `${API_BASE_URL}/users/allUsers`)

    if (data && Array.isArray(data)) {
      return data
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data
    } else {
      console.error("Unexpected response format for users:", data)
      return []
    }
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
}

// ✅ Fetch messages for a specific user
export async function fetchMessages(userId: string): Promise<Message[]> {
  if (!userId) {
    console.error("User ID is required to fetch messages")
    return []
  }

  try {
    const data = await apiRequest("get", `${API_BASE_URL}/messages/${userId}`)

    if (data) {
      return data
    } else {
      console.error("Failed to fetch messages for user:", userId)
      return []
    }
  } catch (error) {
    console.error(`Failed to fetch messages for user ${userId}:`, error)
    return []
  }
}

// ✅ Send a new message
export async function sendMessage(message: Message): Promise<Message | null> {
  // Important: message must have senderId, receiverId, and content
  if (!message.senderId || !message.receiverId || !message.content) {
    console.error("senderId, receiverId, and content are required in message")
    return null
  }

  try {
    const data = await apiRequest("post", `${API_BASE_URL}/messages`, message)

    if (data) {
      return data
    } else {
      console.error("Failed to send message")
      return null
    }
  } catch (error) {
    console.error("Failed to send message:", error)
    return null
  }
}

// ✅ Mark messages as read for a user
export async function markMessagesAsRead(userId: string): Promise<boolean> {
  try {
    const data = await apiRequest("post", `${API_BASE_URL}/messages/markAsRead/${userId}`)
    return !!data
  } catch (error) {
    console.error("Failed to mark messages as read:", error)
    return false
  }
}
