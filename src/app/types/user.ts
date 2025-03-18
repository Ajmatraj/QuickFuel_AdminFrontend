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
  
  