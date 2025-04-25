"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  id: string
  name: string
  email: string
  avatar: string | null
}

interface AuthUser {
  accessToken: string | null
  refreshToken: string | null
  userDetails: UserDetails | null
  role: string | null
}

interface RegisterFuelStationPageProps {
  onSuccess?: () => void
}

export default function RegisterFuelStationPage({ onSuccess }: RegisterFuelStationPageProps) {
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
      const storedUser = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        userDetails: localStorage.getItem("userDetails"),
        role: localStorage.getItem("role"),
      }

      const parsedUserDetails = storedUser.userDetails ? JSON.parse(storedUser.userDetails) : null

      if (storedUser.accessToken && parsedUserDetails) {
        setUser({
          ...storedUser,
          userDetails: parsedUserDetails,
        })
      }

      setIsLoading(false)
    }
  }, [])

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

      if (response.ok && data.success) {
        toast.success("Fuel station registered successfully")
        resetForm()
        if (onSuccess) {
          onSuccess()
        }
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
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="mr-2 h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <Separator className="my-6" />

        <div>
          <Label>Fuel Types</Label>
          {formData.fuelTypes.map((fuelType, index) => (
            <div key={index} className="space-y-4 mt-4">
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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveFuelType(index)}
                  disabled={formData.fuelTypes.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" className="mt-4" onClick={handleAddFuelType}>
            <Plus className="h-4 w-4 mr-2" />
            Add Fuel Type
          </Button>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Register Fuel Station"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
