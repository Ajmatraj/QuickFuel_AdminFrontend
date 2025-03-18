"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, FuelIcon as GasPump, ArrowRight } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface FuelStation {
  _id: string
  name: string
  location?: string
  address?: string
  fuelTypes?: string[]
}

interface User {
  id: string
  token: string
}

export default function FuelStationsPage() {
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Get user details from localStorage
  const getUserFromStorage = (): User | null => {
    if (typeof window === "undefined") return null

    try {
      const storedUser = localStorage.getItem("userDetails")
      return storedUser ? JSON.parse(storedUser) : null
    } catch (err) {
      console.error("Error parsing user from localStorage:", err)
      return null
    }
  }

  // Fetch fuel stations for the user
  const fetchFuelStations = async () => {
    setLoading(true)
    setError(null)

    try {
      const userDetails = getUserFromStorage()

      if (!userDetails?.id) {
        throw new Error("User ID not found in localStorage")
      }

      const response = await axios.get(`${API_BASE_URL}/fuelstations/${userDetails.id}`, {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
      })

      const stations = response.data.data

      if (!stations || stations.length === 0) {
        throw new Error("No fuel stations found for this user")
      }

      setFuelStations(stations)
    } catch (err: any) {
      setError(err.message || "Failed to fetch fuel stations")
    } finally {
      setLoading(false)
    }
  }

  // Navigate to orders page for selected fuel station
  const viewOrders = (fuelStationId: string) => {
    router.push(`/orders/${fuelStationId}`)
  }

  // Initial data fetch
  useEffect(() => {
    fetchFuelStations()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Fuel Stations</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading fuel stations...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fuelStations.map((station) => (
            <Card key={station._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <GasPump className="h-5 w-5 mr-2 text-primary" />
                  {station.name || `Fuel Station ${station._id.substring(0, 6)}`}
                </CardTitle>
                {station.location && (
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {station.location}
                  </CardDescription>
                )}
                {station.address && !station.location && (
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {station.address}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {station.fuelTypes && station.fuelTypes.length > 0 && (
                  <div className="mt-2 mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Available Fuel Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {station.fuelTypes.map((type) => (
                        <span key={type} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Button onClick={() => viewOrders(station._id)} className="w-full mt-2">
                  View Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

