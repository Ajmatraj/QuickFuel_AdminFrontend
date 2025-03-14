"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CalendarDays, Mail, User, ShoppingBag, Star, AlertCircle, Pencil, Upload } from "lucide-react"

// Interface for user data
interface UserData {
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

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    avatar: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { toast } = useToast()

  // Retrieve user details from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails")
    const parsedUserDetails = storedUser ? JSON.parse(storedUser) : null
    const userId = parsedUserDetails?.id

    const fetchUserData = async () => {
      if (!userId) {
        setError("User ID not found")
        setLoading(false)
        return
      }

      try {
        // Make the API call to fetch the logged-in user's details
        const response = await axios.get(`http://localhost:8000/api/v1/users/userbyid/${userId}`)
        const userData = response.data.data
        setUserData(userData)

        // Initialize form data with user data
        setFormData({
          name: userData.name || "",
          username: userData.username || "",
          email: userData.email || "",
          avatar: userData.avatar || "",
        })

        setLoading(false)
      } catch (err) {
        setError("Error fetching user details")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userData) return

    setIsSubmitting(true)

    try {
      const storedUser = localStorage.getItem("userDetails")
      const parsedUserDetails = storedUser ? JSON.parse(storedUser) : null
      const userId = parsedUserDetails?.id
      const token = parsedUserDetails?.token

      if (!userId || !token) {
        throw new Error("Authentication information missing")
      }

      // Create form data for submission (including file if present)
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("username", formData.username)
      submitData.append("email", formData.email)

      if (avatarFile) {
        submitData.append("avatar", avatarFile)
      }

      // Make API call to update user profile
      const response = await axios.put(`http://localhost:8000/api/v1/users/update/${userId}`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      // Update local user data with response
      const updatedUser = response.data.data
      setUserData(updatedUser)

      // Close dialog and show success message
      setIsDialogOpen(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })

      // Clean up avatar preview
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
        setAvatarPreview(null)
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-6">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </TabsList>
              <div className="mt-4 space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} className="h-12 w-full" />
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Error Loading Profile</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try refreshing the page or logging in again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If no user data
  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>No Profile Data</CardTitle>
            <CardDescription>We couldn't find your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try logging in again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render user profile
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="text-2xl">{getInitials(userData.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <Badge className="w-fit" variant={userData.status === "active" ? "default" : "secondary"}>
                  {userData.status}
                </Badge>
              </div>
              <CardDescription className="mt-1">@{userData.username}</CardDescription>
              <Badge variant="outline" className="mt-2">
                {userData.role}
              </Badge>
            </div>

            {/* Edit Profile Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Make changes to your profile information here.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center gap-2 mb-2">
                      <Avatar className="h-24 w-24 border-4 border-background">
                        <AvatarImage src={avatarPreview || userData.avatar} alt={userData.name} />
                        <AvatarFallback className="text-2xl">{getInitials(userData.name)}</AvatarFallback>
                      </Avatar>
                      <div className="relative">
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                        <Label
                          htmlFor="avatar"
                          className="flex items-center gap-1 cursor-pointer text-sm text-primary hover:underline"
                        >
                          <Upload className="h-3 w-3" />
                          Change Photo
                        </Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="mt-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Personal Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">Email</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{userData.email}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">Username</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{userData.username}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">Account Created</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{formatDate(userData.createdAt)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{formatDate(userData.updatedAt)}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent orders and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Orders</h3>
                      <Separator className="my-2" />
                      {userData.orders.length > 0 ? (
                        <div className="space-y-2">
                          {userData.orders.map((order, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4" />
                              <p>Order #{index + 1}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No orders yet</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Ratings Given</h3>
                      <Separator className="my-2" />
                      {userData.ratingGiven.length > 0 ? (
                        <div className="space-y-2">
                          {userData.ratingGiven.map((rating, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              <p>Rating #{index + 1}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No ratings given yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                  <CardDescription>Overview of your account activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold">{userData.orders.length}</h3>
                      <p className="text-muted-foreground">Orders</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold">{userData.ratingGiven.length}</h3>
                      <p className="text-muted-foreground">Ratings Given</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <h3 className="text-3xl font-bold">{userData.ratingRecived.length}</h3>
                      <p className="text-muted-foreground">Ratings Received</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">Account active since {formatDate(userData.createdAt)}</p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

