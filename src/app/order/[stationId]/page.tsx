"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, MapPin, Droplet, ShoppingCart, Check, AlertCircle, Truck, CreditCard } from "lucide-react"
import Link from "next/link"

interface FuelType {
  _id: string
  fuelType: { _id: string; name: string; price: number }
  price: number
  quantity: number
}

interface FuelStation {
  _id: string
  imageurl?: string
  name: string
  stock: string
  email?: string
  phone?: string
  location: string
  fuelTypes: FuelType[]
  createdAt: string
  updatedAt: string
  user: string
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
        if (data.data.fuelTypes && data.data.fuelTypes.length > 0) {
          setSelectedFuelId(data.data.fuelTypes[0]._id)
          setTotalPrice(data.data.fuelTypes[0].price * orderQuantity)
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

  // Update total price when fuel type or quantity changes
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

  const handleSubmitOrder = () => {
    // Here you would implement the actual order submission logic
    // For now, we'll just show an alert and redirect
    alert(`Order placed successfully! Total: ₹${totalPrice.toFixed(2)}`)
    router.push(`/`)
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
        {/* Main Order Form */}
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
                        className="flex flex-col gap-1 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{fuel.fuelType.name}</span>
                          {selectedFuelId === fuel._id && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <span className="text-2xl font-bold text-blue-600">₹{fuel.price}</span>
                        <span className="text-xs text-gray-500">per liter • {fuel.quantity} liters available</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">Quantity</h3>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Liters</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedFuel?.quantity || 1}
                      value={orderQuantity}
                      onChange={handleQuantityChange}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-500">Max: {selectedFuel?.quantity || 0} liters</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">Delivery Information</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input id="address" placeholder="Enter your full address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Your contact number" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Delivery Date</Label>
                      <Input id="date" type="date" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedFuel && (
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-blue-600" />
                      <span className="font-medium capitalize">{selectedFuel.fuelType.name}</span>
                    </div>
                    <span>₹{selectedFuel.price} / liter</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Quantity</span>
                    <span>{orderQuantity} liters</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span>₹{(selectedFuel.price * orderQuantity).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Delivery Fee</span>
                    <span>₹50.00</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>₹{(selectedFuel.price * orderQuantity + 50).toFixed(2)}</span>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={!selectedFuelId || orderQuantity <= 0}
              >
                Place Order
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <CreditCard className="h-4 w-4" />
                <span>Secure payment processing</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Truck className="h-4 w-4" />
                <span>Fast delivery within 24 hours</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

