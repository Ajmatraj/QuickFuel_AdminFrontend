"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/authChecker"
import { useRouter } from "next/navigation"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Fuel, Phone, Mail, Check, AlertCircle, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface FuelStation {
  _id: string;
  imageurl?: string;
  name: string;
  stock: string;
  fuelTypes: string[];
}

const DashboardPage = () => {
  // Define allowed roles
  const allowedRoles = ["admin", "user", "fuelstation"]
  const { user, loading } = useAuth(allowedRoles)
  const router = useRouter()
  const [userDetails, setUserDetails] = useState(null)
  const [fuelStations, setFuelStations] = useState([])
  const [loadingFuelStations, setLoadingFuelStations] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      // Save user details in local storage
      localStorage.setItem("userDetails", JSON.stringify(user))
      setUserDetails(user)
    } else {
      // Retrieve from local storage if available
      const storedUser = localStorage.getItem("userDetails")
      if (storedUser) {
        setUserDetails(JSON.parse(storedUser))
      }
    }
  }, [user])

  useEffect(() => {
    // Fetch fuel station details if user is authenticated
    if (userDetails && userDetails.id) {
      const fetchFuelStations = async () => {
        try {
          // API call to get fuel station details
          const response = await axios.get(`http://localhost:8000/api/v1/fuelstations/${userDetails.id}`)
          setFuelStations(response.data.data)
          setLoadingFuelStations(false)
        } catch (err) {
          setError("Error fetching fuel stations")
          setLoadingFuelStations(false)
        }
      }

      fetchFuelStations()
    }
  }, [userDetails])

  const handleSelectFuelStation = (stationId) => {
    router.push(`/admin/station/${stationId}`)
  }

  if (loading) {
    return <LoadingState />
  }

  // If the user is not authenticated, redirect to login
  if (!user && !userDetails) {
    router.push("/login")
    return null
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* User Profile Card */}
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{userDetails?.Username}</p>
                    <p className="text-sm text-muted-foreground capitalize">{userDetails?.role}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userDetails?.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fuel Stations Section */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Fuel Stations</h2>
                <Button onClick={() => router.push("/admin/fuelstation")}>Add New Station</Button>
              </div>

              {loadingFuelStations ? (
                <FuelStationsLoadingState />
              ) : error ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <p className="text-red-500">{error}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {fuelStations.length > 0 ? (
                    fuelStations.map((station) => (
                      <Card
                        key={station._id}
                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleSelectFuelStation(station._id)}
                      >
                        <div className="relative h-48 w-full">
                          <Image
                            src={station.imageurl || "/placeholder.svg?height=200&width=400"}
                            alt={station.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium flex items-center">
                            {station.stock === "available" ? (
                              <>
                                <Check className="h-3 w-3 text-green-500 mr-1" />
                                <span className="text-green-500">Available</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                                <span className="text-red-500">Unavailable</span>
                              </>
                            )}
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle>{station.name}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">Location available</span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Fuel className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {station.fuelTypes.length} fuel type{station.fuelTypes.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{station.phone}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">View Orders</Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <Card className="col-span-full">
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <Fuel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No fuel stations found</h3>
                          <p className="text-muted-foreground">You don't have any fuel stations registered yet.</p>
                          <Button className="mt-4" onClick={() => router.push("/admin/add-station")}>
                            Add Your First Station
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Loading state component
const LoadingState = () => (
  <div className="min-h-screen flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
)

// Fuel stations loading state
const FuelStationsLoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2].map((item) => (
      <Card key={item} className="overflow-hidden">
        <div className="h-48 w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    ))}
  </div>
)

export default DashboardPage

