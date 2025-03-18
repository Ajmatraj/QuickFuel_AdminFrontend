"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast, ToastContainer } from "react-toastify"

const profileFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  avatar: z.any().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function UserProfile() {
  const [userId, setUserId] = useState<string | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState<string>("/placeholder.svg?height=100&width=100")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
    },
  })

  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem("userDetails")
        if (!storedUser) return null
        const parsedUser = JSON.parse(storedUser)
        return parsedUser?.id || null
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        return null
      }
    }

    const id = getUserFromStorage()
    if (id) {
      setUserId(id)
      fetchUserData(id)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserData = async (id: string) => {
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/api/v1/users/userbyid/${id}`)
      const data = await response.json()

      if (data.success) {
        const userData = data.data
        form.reset({
          username: userData.username,
          email: userData.email,
          name: userData.name,
        })

        if (userData.avatar) {
          setPreviewAvatar(userData.avatar)
        }
      } else {
        toast.error("Failed to fetch user data")
      }
    } catch (error) {
      toast.error("An error occurred while fetching user data")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileFormValues) => {
    if (!userId) {
      toast.error("User ID not found")
      return
    }

    setIsSubmitting(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      const formData = new FormData()
      formData.append("username", data.username)
      formData.append("email", data.email)
      formData.append("name", data.name)

      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const response = await fetch(`${apiUrl}/api/v1/users/update/${userId}`, {
        method: "PUT",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Profile updated successfully")
      } else {
        toast.error(result.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred while updating profile")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <ToastContainer />
      <div className="container max-w-2xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Update your profile information and avatar</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={previewAvatar} alt="Profile" />
                    <AvatarFallback>{form.watch("name") ? getInitials(form.watch("name")) : "U"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 rounded-md border border-dashed p-4 hover:bg-muted/50 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Upload new avatar</span>
                      </div>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleAvatarChange}
                      />
                    </Label>
                    <p className="text-sm text-muted-foreground mt-2">
                      Recommended: Square JPG, PNG, or GIF, at least 300x300px
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
