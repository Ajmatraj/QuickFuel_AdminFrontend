"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Phone, Mail, MapPin, Droplet } from "lucide-react"
import Image from "next/image"

// Define TypeScript interfaces for our data
// Update the FuelType interface to match the table component
interface FuelTypeDetail {
  _id: string
  name: string
  price: number
}

interface FuelInventoryItem {
  _id: string
  fuelType: FuelTypeDetail
  price: number
  quantity: number
}

// Update the Station interface
interface Station {
  _id: string
  name: string
  stock: string
  email: string
  phone: string
  location: string
  imageurl: string
  user: string
  fuelTypes: FuelInventoryItem[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface ApiResponse {
  data: Station
  message: string
  success: boolean
}

// Format date to a more readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function StationDetailsPage() {
  const params = useParams()
  const stationId = params?.stationId as string

  const [station, setStation] = useState<Station | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch station data
  useEffect(() => {
    const fetchStation = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/v1/fuelstations/stationbyid/${stationId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        if (data.success) {
          setStation(data.data)
        } else {
          throw new Error(data.message || "Failed to fetch station details")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching station:", err)
      } finally {
        setLoading(false)
      }
    }

    if (stationId) {
      fetchStation()
    }
  }, [stationId])

  if (loading) {
    return <StationSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="text-red-500 text-xl font-semibold mb-2">Error</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="text-xl font-semibold mb-2">No Station Found</div>
        <p className="text-gray-600">The requested station could not be found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Station Image */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-t-lg">
              <div className="relative w-full h-[300px]">
                <Image
                  src={station.imageurl || "/placeholder.svg?height=300&width=400"}
                  alt={station.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
            <div className="p-4">
              <Badge
                variant={station.stock === "available" ? "success" : "destructive"}
                className={
                  station.stock.toLowerCase() === "available"
                    ? "font-bold bg-green-100 text-green-800 border-green-500 hover:bg-green-200"
                    : "font-medium bg-red-100 text-red-800 border-red-500 hover:bg-red-200"
                }
              >
                {station.stock}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Station Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{station.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{station.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{station.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{station.email}</span>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Available Fuel Types</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {station.fuelTypes.map((fuel) => (
                    <Card key={fuel._id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplet className="h-5 w-5 text-primary" />
                          <span className="font-medium capitalize">{fuel.fuelType.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Price:</p>
                            <p className="font-semibold">${fuel.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Quantity:</p>
                            <p className="font-semibold">{fuel.quantity} L</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Base Price:</p>
                            <p className="font-semibold">${fuel.fuelType.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Added on: {formatDate(station.createdAt)}</p>
      </div>
    </div>
  )
}

// Loading skeleton component
function StationSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0">
              <Skeleton className="w-full h-[300px] rounded-t-lg" />
            </CardContent>
            <div className="p-4">
              <Skeleton className="h-6 w-24" />
            </div>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />

              <div className="mt-6">
                <Skeleton className="h-7 w-48 mb-3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
