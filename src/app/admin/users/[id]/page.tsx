"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserAvatarUpload } from "../components/UserAvatarUpload"

// Interface for user data
interface UserData {
  _id: string
  username: string
  email: string
  name: string
  avatar: string
  role: string
}

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [avatarError, setAvatarError] = useState<string | undefined>(undefined)

  // Fetch user details
  useEffect(() => {
    const fetchUserData = async () => {
      if (!params.id) {
        setError("User ID not found")
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("accessToken")

        if (!token) {
          setError("Authentication required")
          setLoading(false)
          return
        }

        // Make the API call to fetch the user details
        const response = await axios.get(`http://localhost:8000/api/v1/users/userbyid/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userData = response.data.data
        setUserData(userData)

        // Initialize form data with user data
        setFormData({
          name: userData.name || "",
          username: userData.username || "",
          email: userData.email || "",
          role: userData.role || "",
        })

        setLoading(false)
      } catch (err) {
        console.error("Error fetching user details:", err)
        setError("Error fetching user details")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [params.id])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user makes a selection
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Handle avatar file selection
  const handleAvatarChange = (file: File | null) => {
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png"]
      if (!allowedTypes.includes(file.type)) {
        setAvatarError("Only JPEG and PNG images are allowed")
        return
      }

      // // Validate file size (max 2MB)
      // if (file.size > 2 * 1024 * 1024) {
      //   setAvatarError("Image size should be less than 2MB")
      //   return
      // }

      setAvatarFile(file)
      setAvatarError(undefined)
    }
  }

  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.role) {
      errors.role = "Role is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userData || !validateForm()) return

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        throw new Error("Authentication information missing")
      }

    

      // Prepare data for API call
      const formPayload = new FormData()
      formPayload.append("name", formData.name)
      formPayload.append("username", formData.username)
      formPayload.append("email", formData.email)
      formPayload.append("role", formData.role)
      if (avatarFile) {
        formPayload.append("avatar", avatarFile)
      }

      // Make API call to update user profile
      const response = await axios.put(`http://localhost:8000/api/v1/users/update/${userData._id}`, formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      // Show success message
      toast({
        title: "User Updated",
        description: "User profile has been successfully updated.",
      })

      // Redirect back to user details page
      router.push(`/admin/users/${userData._id}`)
    } catch (err: any) {
      console.error("Error updating user:", err)

      // Handle specific error messages from the backend
      const errorMessage = err.response?.data?.error || "There was a problem updating the user."

      if (errorMessage.includes("Username or email already in use")) {
        if (errorMessage.includes("Username")) {
          setFormErrors((prev) => ({ ...prev, username: "Username is already taken" }))
        }
        if (errorMessage.includes("email")) {
          setFormErrors((prev) => ({ ...prev, email: "Email is already in use" }))
        }
      } else {
        toast({
          title: "Update Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel button click
  const handleCancel = () => {
    router.back()
  }

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Edit User</CardTitle>
            </div>
            <CardDescription>Loading user information...</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Error Loading User</CardTitle>
              </div>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try again or go back to the users list.</p>
            <Button className="mt-4" onClick={() => router.push("/admin/users")}>
              Back to Users
            </Button>
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>User Not Found</CardTitle>
            </div>
            <CardDescription>We couldn't find user information for the requested ID.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin/users")}>Back to Users</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render edit form
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Edit User</CardTitle>
          </div>
          <CardDescription>Update user information and avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="flex flex-col items-center mb-6">
              <UserAvatarUpload
                currentAvatar={userData.avatar}
                name={formData.name || userData.name}
                onFileChange={handleAvatarChange}
                error={avatarError}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                {formErrors.username && <p className="text-sm text-destructive">{formErrors.username}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.role && <p className="text-sm text-destructive">{formErrors.role}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
