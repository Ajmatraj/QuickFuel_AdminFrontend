"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "react-toastify"

interface FuelTypeDetail {
  _id: string
  name: string
  price: number
}

interface FuelTypeItem {
  fuelType: FuelTypeDetail
  price: number
  quantity: number
  _id: string
}

interface FuelStation {
  _id: string
  name: string
  email: string
  phone: string
  location: string
  imageurl?: string
  stock: string
  user: string
  fuelTypes: FuelTypeItem[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface AuthUser {
  accessToken: string | null
  refreshToken: string | null
  userDetails: UserDetails | null
  role: string | null
}

interface UserDetails {
  id: string
  name: string
  email: string
  avatar: string | null
}

interface EditFuelStationFormProps {
  station: FuelStation
  user: AuthUser
  onSuccess: () => void
}

export default function EditFuelStationForm({ station, user, onSuccess }: EditFuelStationFormProps) {
  const [availableFuelTypes, setAvailableFuelTypes] = useState<FuelTypeDetail[]>([])
  const [isLoadingFuelTypes, setIsLoadingFuelTypes] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    name: station.name,
    email: station.email,
    phone: station.phone,
    location: station.location,
    imageUrl: station.imageurl || "",
    stock: station.stock,
    fuelTypes: station.fuelTypes.map((ft) => ({
      id: ft._id,
      fuelTypeId: ft.fuelType._id,
      price: ft.price.toString(),
      quantity: ft.quantity.toString(),
    })),
  })

  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    fetchAvailableFuelTypes()

    // Log the station data to debug
    console.log("Station data for editing:", station)

    // Initialize form data with proper structure
    setFormData({
      name: station.name,
      email: station.email,
      phone: station.phone,
      location: station.location,
      imageUrl: station.imageurl || "",
      stock: station.stock,
      fuelTypes: station.fuelTypes.map((ft) => {
        // Handle different possible structures of fuelType
        const fuelTypeId =
          ft.fuelType && typeof ft.fuelType === "object"
            ? ft.fuelType._id
            : typeof ft.fuelType === "string"
              ? ft.fuelType
              : ""

        return {
          id: ft._id,
          fuelTypeId: fuelTypeId,
          price: ft.price.toString(),
          quantity: ft.quantity.toString(),
        }
      }),
    })
  }, [station])

  const fetchAvailableFuelTypes = async () => {
    setIsLoadingFuelTypes(true)
    try {
      const response = await fetch("http://localhost:8000/api/v1/fuelTypes/getAllFuelTypes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAvailableFuelTypes(data.data || [])
      } else {
        console.error("Failed to fetch fuel types:", data.message)
      }
    } catch (error) {
      console.error("Error fetching fuel types:", error)
    } finally {
      setIsLoadingFuelTypes(false)
    }
  }

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
      if (!fuelType.fuelTypeId || !fuelType.price || !fuelType.quantity) {
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

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Form data before submission:", formData)

      // Create the base payload
      const payload: any = {
        name: formData.name,
        stock: formData.stock,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        fuelTypes: formData.fuelTypes.map((fuel) => ({
          fuelType: fuel.fuelTypeId,
          price: isNaN(Number.parseFloat(fuel.price)) ? 0 : Number.parseFloat(fuel.price),
          quantity: isNaN(Number.parseInt(fuel.quantity)) ? 0 : Number.parseInt(fuel.quantity),
        })),
      }

      // Only add imageurl if it's a valid URL
      if (formData.imageUrl && isValidUrl(formData.imageUrl)) {
        payload.imageurl = formData.imageUrl
      }

      console.log("Payload for update:", payload)

      const response = await fetch(`http://localhost:8000/api/v1/fuelstations/updateFuelStation/${station._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("Update response:", data)

      if (response.ok && data.success) {
        toast.success("Fuel station updated successfully")
        onSuccess()
      } else {
        setError(data.message || "Something went wrong")
        toast.error(data.message || "Failed to update fuel station")
      }
    } catch (error) {
      console.error("Update error:", error)
      setError("An error occurred while updating the fuel station")
      toast.error("An error occurred while updating the fuel station")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get fuel type name by ID
  const getFuelTypeName = (id: string) => {
    if (!id) return "Unknown Fuel Type"

    const fuelType = availableFuelTypes.find((ft) => ft._id === id)
    return fuelType ? fuelType.name : "Unknown Fuel Type"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="mr-2 h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
        {isLoadingFuelTypes ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Loading fuel types...</span>
          </div>
        ) : (
          formData.fuelTypes.map((fuelType, index) => (
            <div key={index} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Fuel Type</Label>
                  <div className="p-2 border rounded-md bg-muted">{getFuelTypeName(fuelType.fuelTypeId)}</div>
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    value={fuelType.price}
                    onChange={(e) => handleFuelTypeChange(index, "price", e.target.value)}
                    placeholder="Fuel Price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    value={fuelType.quantity}
                    onChange={(e) => handleFuelTypeChange(index, "quantity", e.target.value)}
                    placeholder="Fuel Quantity"
                    type="number"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </>
          ) : (
            "Update Fuel Station"
          )}
        </Button>
      </div>
    </form>
  )
}
