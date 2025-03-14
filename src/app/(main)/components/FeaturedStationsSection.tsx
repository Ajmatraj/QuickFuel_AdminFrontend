"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FeaturedStationCarousel } from "./FeaturedStationCarousel"

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

export function FeaturedStationsSection() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFeaturedStations = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/fuelstations/getAllFuelStations")

        if (response.data.success) {
          setStations(response.data.data.slice(0, 6)) // Get only the first 6 stations
        } else {
          setError("Failed to load featured stations")
        }
      } catch (err) {
        console.error("Error fetching featured stations:", err)
        setError("Error fetching featured stations")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedStations()
  }, [])

  if (loading || error || stations.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <Badge className="mb-4">Featured Stations</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Popular Fuel Stations</h2>
          </div>
          <Button variant="outline">
            View All Stations
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <FeaturedStationCarousel stations={stations} />
      </div>
    </section>
  )
}

