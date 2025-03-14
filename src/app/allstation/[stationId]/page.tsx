"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Calendar,
  Clock,
  ExternalLink,
  Share2,
  Info,
  Droplet,
  User,
} from "lucide-react"
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

export default function FuelStationDetails() {
  const { stationId } = useParams()
  const router = useRouter()

  const [fuelStation, setFuelStation] = useState<FuelStation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"details" | "fuels">("details")

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const openMapLink = (location: string) => {
    if (location.startsWith("http")) {
      window.open(location, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="h-8 w-32 bg-gray-200 rounded mx-auto"></div>
          </div>
          <p className="text-lg">Loading fuel station details...</p>
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

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0">
          <Image
            src={fuelStation.imageurl || "/placeholder.svg?height=400&width=1200"}
            alt={fuelStation.name}
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>
        <div className="relative z-10 p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{fuelStation.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant={fuelStation.stock === "available" ? "default" : "secondary"}
                  className={
                    fuelStation.stock === "available"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }
                >
                  {fuelStation.stock === "available" ? "Open Now" : "Closed"}
                </Badge>
                <span className="text-sm opacity-80">ID: {fuelStation._id}</span>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:underline"
                onClick={() => openMapLink(fuelStation.location)}
              >
                <MapPin className="h-5 w-5" />
                <span>View on Map</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push(`/order/${fuelStation._id}`)}
                disabled={fuelStation.stock !== "available"}
                size="lg"
              >
                {fuelStation.stock === "available" ? "Place Order" : "Currently Unavailable"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          onClick={() => setActiveTab("details")}
        >
          Station Details
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "fuels" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          onClick={() => setActiveTab("fuels")}
        >
          Available Fuels
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "details" ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Station Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 shrink-0" />
                      <p className="text-gray-700 break-words">{fuelStation.location}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                    {fuelStation.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-gray-500 shrink-0" />
                        <a href={`tel:${fuelStation.phone}`} className="text-gray-700 hover:text-blue-600">
                          {fuelStation.phone}
                        </a>
                      </div>
                    )}
                    {fuelStation.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-gray-500 shrink-0" />
                        <a
                          href={`mailto:${fuelStation.email}`}
                          className="text-gray-700 hover:text-blue-600 break-words"
                        >
                          {fuelStation.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={fuelStation.stock === "available" ? "default" : "secondary"}
                        className={fuelStation.stock === "available" ? "bg-green-500" : "bg-gray-500"}
                      >
                        {fuelStation.stock === "available" ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <p className="text-gray-700">ID: {fuelStation.user}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <p className="text-gray-700">{formatDate(fuelStation.createdAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <p className="text-gray-700">{formatDate(fuelStation.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => openMapLink(fuelStation.location)}
                  >
                    <MapPin className="h-4 w-4" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Quick Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5" />
                  Fuel Overview
                </CardTitle>
                <CardDescription>Available fuel types at this station</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fuelStation.fuelTypes.map((fuel) => (
                    <div key={fuel._id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium capitalize">{fuel.fuelType.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">₹{fuel.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full" variant="outline" onClick={() => setActiveTab("fuels")}>
                  View All Fuel Details
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Having trouble with your order or have questions about this fuel station?
                  </p>
                  {fuelStation.phone && (
                    <Button variant="outline" className="w-full mb-2" asChild>
                      <a href={`tel:${fuelStation.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call Station
                      </a>
                    </Button>
                  )}
                  {fuelStation.email && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`mailto:${fuelStation.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Station
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5" />
              Available Fuel Types
            </CardTitle>
            <CardDescription>Detailed information about all fuel types available at {fuelStation.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fuelStation.fuelTypes.map((fuel) => (
                <Card key={fuel._id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                    <h3 className="text-xl font-bold text-white capitalize">{fuel.fuelType.name}</h3>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-2xl font-bold text-blue-600">₹{fuel.price}</p>
                        <p className="text-xs text-gray-500">per liter</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Available Quantity</p>
                        <p className="text-2xl font-bold">{fuel.quantity.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">liters</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500">Base Price</p>
                      <p className="font-medium">₹{fuel.fuelType.price}</p>
                    </div>

                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push(`/order/${fuelStation._id}`)}
                      disabled={fuelStation.stock !== "available"}
                      size="lg"
                    >
                      {fuelStation.stock === "available" ? "Order This Fuel" : "Currently Unavailable"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

