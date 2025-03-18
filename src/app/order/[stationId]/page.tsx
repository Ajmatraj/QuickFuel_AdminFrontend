"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, MapPin, ShoppingCart, AlertCircle } from "lucide-react"
import Link from "next/link"

interface FuelType {
  _id: string
  fuelType: { _id: string; name: string; price: number }
  price: number
  quantity: number
}

interface FuelStation {
  _id: string
  name: string
  location: string
  fuelTypes: FuelType[]
}

interface DeliveryAddress {
  latitude: number
  longitude: number
  address: string
}

export default function OrderPage() {
  const { stationId } = useParams()
  const router = useRouter()

  const [fuelStation, setFuelStation] = useState<FuelStation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFuelId, setSelectedFuelId] = useState<string>("")
  const [orderQuantity, setOrderQuantity] = useState<number>(1)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  // Updated delivery address to match required structure
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    latitude: 0,
    longitude: 0,
    address: "",
  })

  const [phone, setPhone] = useState<string>("")
  const [deliveryDate, setDeliveryDate] = useState<string>("")

  // Fetch fuel station data
  useEffect(() => {
    if (!stationId) {
      setError("Invalid fuel station ID.")
      setLoading(false)
      return
    }

    const fetchFuelStation = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/fuelstations/stationbyid/${stationId}`)
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        if (!data.success || !data.data) {
          throw new Error(data.message || "Failed to load fuel station details.")
        }

        setFuelStation(data.data)

        // Set the first fuel type as default if available
        if (data.data.fuelTypes.length > 0) {
          setSelectedFuelId(data.data.fuelTypes[0]._id)
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Something went wrong. Please try again.")
        } else {
          setError("Something went wrong. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchFuelStation()
  }, [stationId])

  // Update total price based on selected fuel and quantity
  useEffect(() => {
    if (fuelStation && selectedFuelId) {
      const selectedFuel = fuelStation.fuelTypes.find((fuel) => fuel._id === selectedFuelId)
      if (selectedFuel) {
        setTotalPrice(selectedFuel.price * orderQuantity)
      }
    }
  }, [selectedFuelId, orderQuantity, fuelStation])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      const selectedFuel = fuelStation?.fuelTypes.find((fuel) => fuel._id === selectedFuelId)
      if (selectedFuel && value <= selectedFuel.quantity) {
        setOrderQuantity(value)
      }
    }
  }

  // Handle address field changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryAddress({
      ...deliveryAddress,
      address: e.target.value,
    })
  }

  // Handle latitude change
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      setDeliveryAddress({
        ...deliveryAddress,
        latitude: value,
      })
    }
  }

  // Handle longitude change
  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      setDeliveryAddress({
        ...deliveryAddress,
        longitude: value,
      })
    }
  }

  const handleSubmitOrder = async () => {
    if (loading) return
    setLoading(true)

    const storedUser = localStorage.getItem("userDetails")
    const parsedUserDetails = storedUser ? JSON.parse(storedUser) : null
    const userId = parsedUserDetails?.id
    const token = parsedUserDetails?.token

    if (!userId) {
      alert("Authentication information missing. Please log in.")
      setLoading(false)
      return
    }

    if (!fuelStation || !selectedFuelId || orderQuantity <= 0 || !deliveryAddress.address || !phone || !deliveryDate) {
      alert("Please fill in all fields and select valid values.")
      setLoading(false)
      return
    }

    // Basic phone validation (adjust regex as needed)
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number.")
      setLoading(false)
      return
    }

    // Basic date validation (check if it's a future date)
    const currentDate = new Date()
    const selectedDate = new Date(deliveryDate)
    if (selectedDate <= currentDate) {
      alert("Please select a valid delivery date in the future.")
      setLoading(false)
      return
    }

    // Get the selected fuel type name
    const selectedFuelTypeName = fuelStation.fuelTypes.find((fuel) => fuel._id === selectedFuelId)?.fuelType.name || ""

    // Prepare the order data with the necessary details
    const orderData = {
      userId, // User ID from local storage or session
      fuelStationId: fuelStation._id, // Fuel station ID
      fuelType: selectedFuelTypeName, // Selected fuel type name (e.g., "Petrol")
      quantity: orderQuantity, // Quantity of fuel ordered
      totalCost: totalPrice, // Total cost of the order
      phone, // User's phone number
      deliveryAddress: {
        latitude: deliveryAddress.latitude, // Delivery address latitude
        longitude: deliveryAddress.longitude, // Delivery address longitude
        address: deliveryAddress.address, // Address text
      },
      status: "PENDING", // Default status of the order
      deliveryDate, // Delivery date for the order
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to place order")
      }

      alert(`Order placed successfully! Total: ₹${totalPrice.toFixed(2)}`)
      // Reset form or redirect after order is placed successfully
      setOrderQuantity(1) // Reset quantity field
      setDeliveryAddress({ latitude: 0, longitude: 0, address: "" }) // Clear delivery address field
      setPhone("") // Clear phone number field
      setDeliveryDate("") // Clear delivery date field
      router.push("/orders")
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || "Something went wrong. Please try again.")
      } else {
        alert("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="h-8 w-32 bg-gray-200 rounded mx-auto"></div>
          </div>
          <p className="text-lg">Loading order page...</p>
        </div>
      </div>
    )
  }

  if (error || !fuelStation) {
    return (
      <div className="container mx-auto flex flex-col items-center min-h-[60vh] p-4">
        <div className="flex items-center gap-2 text-red-500 mb-4">
          <AlertCircle className="h-5 w-5" />
          <p className="text-lg">{error || "Fuel station not found."}</p>
        </div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const selectedFuel = fuelStation.fuelTypes.find((fuel) => fuel._id === selectedFuelId)

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <Link href={`/fuel-station/${stationId}`}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Station Details
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Place Your Fuel Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">{fuelStation.name}</p>
                  <p className="text-sm text-gray-600">{fuelStation.location}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Select Fuel Type</h3>
                <RadioGroup
                  value={selectedFuelId}
                  onValueChange={setSelectedFuelId}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {fuelStation.fuelTypes.map((fuel) => (
                    <div key={fuel._id} className="relative">
                      <RadioGroupItem value={fuel._id} id={fuel._id} className="peer sr-only" />
                      <Label
                        htmlFor={fuel._id}
                        className="border rounded-xl p-4 w-full bg-white border-gray-300 hover:bg-blue-100 cursor-pointer flex justify-between items-center peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50"
                      >
                        <div>
                          <p className="font-medium">{fuel.fuelType.name}</p>
                          <p className="text-sm text-gray-600">₹ {fuel.price} /litre</p>
                        </div>
                        <div className="text-sm text-gray-500">{fuel.quantity} litres available</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="orderQuantity">Order Quantity (litres)</Label>
                <Input
                  id="orderQuantity"
                  type="number"
                  min="1"
                  max={selectedFuel?.quantity || 0}
                  value={orderQuantity}
                  onChange={handleQuantityChange}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-between">
                <div className="font-semibold">Total Price</div>
                <div className="font-semibold text-lg text-green-600">₹ {totalPrice.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Input
                  id="deliveryAddress"
                  type="text"
                  value={deliveryAddress.address}
                  onChange={handleAddressChange}
                  placeholder="Enter your full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={deliveryAddress.latitude || ""}
                    onChange={handleLatitudeChange}
                    placeholder="e.g. 27.700769"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={deliveryAddress.longitude || ""}
                    onChange={handleLongitudeChange}
                    placeholder="e.g. 85.300140"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number"
                />
              </div>

              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleSubmitOrder} className="w-full" disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

