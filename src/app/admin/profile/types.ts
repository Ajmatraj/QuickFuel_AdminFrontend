// Interface for user data
export interface UserData {
    _id: string
    username: string
    email: string
    name: string
    avatar: string
    role: string
    createdAt: string
    updatedAt: string
    orders: any[]
    ratingGiven: any[]
    ratingRecived: any[] // Note: keeping the typo as it's in the API
    status: string
  }
  
  // Helper functions
  export const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }
  
  export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  