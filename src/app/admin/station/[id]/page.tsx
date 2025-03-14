"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Phone, Mail, Fuel, ExternalLink, AlertCircle, Check } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface FuelType {
  fuelType: string
  price: number
  quantity: number
  _id?: string
}

interface Station {
  _id: string
  name: string
  imageurl: string
  location: string
  phone: string
  email: string
  stock: string
  fuelTypes: FuelType[]
  user: string
  createdAt: string
  updatedAt: string
}

const FuelStationDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [station, setStation] = useState<Station | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchFuelStationDetails = async () => {
      try {
        if (!id) {
          setError("Station ID not found")
          setLoading(false)
          return
        }

        const response = await axios.get(`http://localhost:8000/api/v1/fuelstations/stationbyid/${id}`)

        if (response.data.success) {
          setStation(response.data.data)
        } else {
          setError("Failed to load fuel station details")
        }
        setLoading(false)
      } catch (err) {
        console.error("Error fetching fuel station details:", err)
        setError("Error fetching fuel station details")
        setLoading(false)
        toast.error("Failed to load fuel station details")
      }
    }

    fetchFuelStationDetails()
  }, [id])

  const handleGoBack = () => router.back()

  const openLocation = (locationUrl: string) => {
    if (locationUrl) {
      window.open(locationUrl, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
        <>
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-red-500 text-center">{error}</p>
              <Button onClick={handleGoBack}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </>
    )
  }

  if (!station) {
    return (
      <>
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-center">Fuel station not found</p>
              <Button onClick={handleGoBack}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </>
    )
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Card */}
            <Card className="lg:col-span-2">
              <div className="relative h-64 w-full">
                <Image
                  src={station.imageurl || "/placeholder.svg?height=300&width=600"}
                  alt={station.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={station.stock === "available" ? "default" : "destructive"} className="px-3 py-1">
                    {station.stock === "available" ? (
                      <div className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        <span>Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Unavailable</span>
                      </div>
                    )}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl">{station.name}</CardTitle>
                <CardDescription>
                  <Button
                    variant="link"
                    className="p-0 h-auto flex items-center gap-1 text-muted-foreground"
                    onClick={() => openLocation(station.location)}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>View on Map</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{station.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{station.email}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Available Fuel Types</h3>
                  <div className="space-y-4">
                    {/* {station.fuelTypes.map((fuelType, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Fuel className="h-5 w-5 text-primary" />
                              <span className="font-medium">Fuel Type ID: {fuelType.fuelType}</span>
                            </div>
                            <Badge variant="outline" className="text-lg font-bold">
                              Rs. {fuelType.price}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              Available Quantity: {fuelType.quantity} liters
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))} */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Station Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Station Information</CardTitle>
                <CardDescription>Additional details about this station</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Station ID</p>
                  <p className="font-medium">{station._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium">{station.user}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">{new Date(station.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{new Date(station.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => openLocation(station.location)}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Open Location
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default FuelStationDetailPage
