"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import type { UserProfile } from "@/app/types/user"
import ProfileHeader from "./components/ProfileHeader"
import ProfileInfoTab from "./components/ProfileInfoTab"
import OrdersTab from "./components/OrdersTab"
import RatingsTab from "./components/RatingsTab"
import ServicesTab from "./components/ServicesTab"
import SettingsTab from "./components/SettingsTab"


export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("userDetails")
        if (!storedUser) throw new Error("No user details found")
  
        const parsedUserDetails = JSON.parse(storedUser)
        const userId = parsedUserDetails?._id || parsedUserDetails?.id || null
        const token = parsedUserDetails?.token || localStorage.getItem("accessToken")
  
        if (!userId || !token) {
          throw new Error("Authentication information missing")
        }
  
        return { userId, token }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Auth Error:", error.message)
        } else {
          console.error("Auth Error:", error)
        }
        router.push("/login")
        return null
      }
    }
  
    const fetchUserProfile = async () => {
      const auth = checkAuth()
      if (!auth) return
  
      const { userId, token } = auth
  
      try {
        setLoading(true)
        setError(null)
  
        const response = await fetch(`http://localhost:8000/api/v1/users/userbyid/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
  
        if (!response.ok) throw new Error("Failed to fetch user profile")
  
        const data = await response.json()
        if (data.success) {
          setUser(data.data)
        } else {
          throw new Error(data.message || "User profile fetch error")
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }
  
    fetchUserProfile()
  }, [router])
  

  const updateUserData = (updatedData: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null))

    // Update localStorage if you're storing user details there
    const userDetails = localStorage.getItem("userDetails")
    if (userDetails) {
      try {
        const parsed = JSON.parse(userDetails)
        localStorage.setItem(
          "userDetails",
          JSON.stringify({
            ...parsed,
            ...updatedData,
          }),
        )
      } catch (e) {
        console.error("Error updating localStorage:", e)
      }
    }

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}. Please try again or contact support.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Profile Found</AlertTitle>
          <AlertDescription>We couldn't find your profile information. Please log in again.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <ProfileHeader user={user} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          {user.role === "fuelstation" && <TabsTrigger value="services">Services</TabsTrigger>}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileInfoTab user={user} onUpdateUser={updateUserData} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab user={user} />
        </TabsContent>

        <TabsContent value="ratings">
          <RatingsTab user={user} />
        </TabsContent>

        {user.role === "fuelstation" && (
          <TabsContent value="services">
            <ServicesTab user={user} />
          </TabsContent>
        )}

        <TabsContent value="settings">
          <SettingsTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

