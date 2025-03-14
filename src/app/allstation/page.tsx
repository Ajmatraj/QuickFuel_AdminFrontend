"use client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import FuelStationCard from "./components/FuelStation"
import { useRouter } from "next/router"

interface FuelType {
  _id: string
  fuelType: {
    name: string
  }
  price: number
  quantity: number
}

interface FuelStation {
  _id: string
  imageurl: string
  name: string
  stock: string
  email: string
  phone: string
  location: string
  fuelTypes: FuelType[]
}

export default function AllStations() {
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFuelStations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/fuelstations/getAllFuelStations")
        const data = await response.json()

        if (data.success && data.data) {
          setFuelStations(data.data)
        } else {
          setError("No fuel stations found or error in the data.")
          console.error("Error fetching fuel stations: ", data.message || "Unknown error")
        }
      } catch (error) {
        setError("Error fetching fuel stations. Please try again later.")
        console.error("Error fetching fuel stations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFuelStations()
  }, [])

 

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 md:px-6">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="border-blue-500 text-blue-500">
                All Fuel Stations
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Browse All Fuel Stations</h1>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find the perfect fuel station for your needs with our comprehensive listing.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading fuel stations...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {fuelStations.map((station) => (
              <FuelStationCard key={station._id} fuelstation={station} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

