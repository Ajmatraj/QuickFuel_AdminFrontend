"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "react-toastify"

// Define TypeScript interfaces for our data
interface FuelType {
  name: string
  price: string
  quantity: string
}

interface FuelStationFormData {
  name: string
  email: string
  phone: string
  location: string
  imageUrl: string
  stock: string
  fuelTypes: FuelType[]
}


interface UserDetails {
  id:string;
  name: string;
  email: string;
  avatar: string | null;
}

interface AuthUser {
  accessToken: string | null
  refreshToken: string | null
  userDetails: UserDetails | null
  role: string | null
}

export default function RegisterFuelStationPage() {
  const router = useRouter()

  // Authentication state
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Form state
  const [formData, setFormData] = useState<FuelStationFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    imageUrl: "",
    stock: "available",
    fuelTypes: [{ name: "", price: "", quantity: "" }],
  })

  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Load user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const message = new URLSearchParams(window.location.search).get("message")
      if (message) {
        toast.success(message)
      }

      const storedUser = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        userDetails: localStorage.getItem("userDetails"),
        role: localStorage.getItem("role"),
      }

      console.log(storedUser)
      console.log()

      const parsedUserDetails = storedUser.userDetails ? JSON.parse(storedUser.userDetails) : null

      console.log(parsedUserDetails)

      if (storedUser.accessToken && parsedUserDetails) {
        setUser({
          ...storedUser,
          userDetails: parsedUserDetails,
        })
      } else {
        toast.error("You must be logged in to register a fuel station")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }

      setIsLoading(false)
    }
  }, [router])

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle stock selection change
  const handleStockChange = (value: string) => {
    setFormData({ ...formData, stock: value })
  }

  // Handle fuel type input change
  const handleFuelTypeChange = (index: number, field: string, value: string) => {
    const updatedFuelTypes = [...formData.fuelTypes]
    updatedFuelTypes[index] = { ...updatedFuelTypes[index], [field]: value }
    setFormData({ ...formData, fuelTypes: updatedFuelTypes })
  }

  // Handle adding more fuel types
  const handleAddFuelType = () => {
    setFormData({
      ...formData,
      fuelTypes: [...formData.fuelTypes, { name: "", price: "", quantity: "" }],
    })
  }

  // Handle removing a fuel type
  const handleRemoveFuelType = (index: number) => {
    const updatedFuelTypes = formData.fuelTypes.filter((_, i) => i !== index)
    setFormData({ ...formData, fuelTypes: updatedFuelTypes })
  }

  // Reset the form fields
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      imageUrl: "",
      stock: "available",
      fuelTypes: [{ name: "", price: "", quantity: "" }],
    })
    setError("")
  }

  // Function to validate URL
  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim() === "") return false
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Validate form before submission
  const validateForm = (): boolean => {
    if (!formData.name || !formData.email || !formData.phone || !formData.location) {
      setError("All station fields are required")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (formData.phone.length < 10) {
      setError("Phone number must be at least 10 digits")
      return false
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      setError("Please enter a valid image URL or leave it empty")
      return false
    }

    for (const fuelType of formData.fuelTypes) {
      if (!fuelType.name || !fuelType.price || !fuelType.quantity) {
        setError("All fuel type fields are required")
        return false
      }

      if (Number.parseFloat(fuelType.price) <= 0) {
        setError("Fuel price must be greater than zero")
        return false
      }

      if (Number.parseInt(fuelType.quantity) <= 0) {
        setError("Fuel quantity must be greater than zero")
        return false
      }

      if (isNaN(Number.parseFloat(fuelType.price)) || isNaN(Number.parseInt(fuelType.quantity))) {
        setError("Price and quantity must be valid numbers")
        return false
      }
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!user || !user.userDetails) {
      setError("You must be logged in to register a fuel station")
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create the base payload
      const payload: any = {
        name: formData.name,
        stock: formData.stock,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        userId: user.userDetails?.id,
        fuelTypes: formData.fuelTypes.map((fuel) => ({
          fuelTypeName: fuel.name,
          price: isNaN(Number.parseFloat(fuel.price)) ? 0 : Number.parseFloat(fuel.price),
          quantity: isNaN(Number.parseInt(fuel.quantity)) ? 0 : Number.parseInt(fuel.quantity),
        })),
      }

      console.log(payload)

      // Only add imageurl if it's a valid URL
      if (formData.imageUrl && isValidUrl(formData.imageUrl)) {
        payload.imageurl = formData.imageUrl
      }

      const response = await fetch("http://localhost:8000/api/v1/fuelstations/registerFuelStation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      console.log(data)

      if (response.ok && data.success) {
        toast.success("Fuel station registered successfully")
        resetForm()
      } else {
        setError(data.message || "Something went wrong")
        toast.error(data.message || "Failed to register fuel station")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("An error occurred while registering the fuel station")
      toast.error("An error occurred while registering the fuel station")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (!user || !user.userDetails) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to register a fuel station</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              <AlertDescription>Login to access the registration form</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Register Fuel Station</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="mr-2 h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Station Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter station name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter station email"
                  type="email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter station phone"
                  type="tel"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter station location"
                  required
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL (optional)"
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock Status</Label>
                <Select value={formData.stock} onValueChange={handleStockChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stock status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="outOfStock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-6" />

              <div>
                <Label>Fuel Types</Label>
                {formData.fuelTypes.map((fuelType, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex space-x-4">
                      <Input
                        value={fuelType.name}
                        onChange={(e) => handleFuelTypeChange(index, "name", e.target.value)}
                        placeholder="Fuel Type Name"
                        required
                      />
                      <Input
                        value={fuelType.price}
                        onChange={(e) => handleFuelTypeChange(index, "price", e.target.value)}
                        placeholder="Fuel Price"
                        required
                      />
                      <Input
                        value={fuelType.quantity}
                        onChange={(e) => handleFuelTypeChange(index, "quantity", e.target.value)}
                        placeholder="Fuel Quantity"
                        required
                      />
                      <Button variant="destructive" onClick={() => handleRemoveFuelType(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="mt-4 mb-5" onClick={handleAddFuelType}>
                  <Plus className="h-4 w-4" />
                  Add Fuel Type
                </Button>
              </div>
            </div>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

