"use client"
import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import FuelStationCard from "./components/FuelStationCard"
import { useEffect, useState } from "react"
import Link from "next/link"
import HeroSection from "./components/HeroSection"
import AppFeatures from "./components/AppFeatures"
import HowItWorks from "./components/HowItWorks"
import TestimonialCarousel from "./components/TestimonialCarousel"
import DownloadSection from "./components/DownloadSection"

interface FuelType {
  _id: string
  fuelType: {
    _id: string
    name: string
    price: number
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
export default function HomePage() {
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFuelStations = async () => {
      try {
        // get all fuelStations
        const response = await fetch("http://localhost:8000/api/v1/fuelstations/getAllFuelStations")
        const data = await response.json()

        console.log(data)

        if (data.success && data.data) {
          setFuelStations(data.data) // The fuel stations are in the data array
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

  // Limit to only 6 stations for the home page
  const limitedStations = fuelStations.slice(0, 6)

  return (
    <>
    {/* hero sectioin  */}
    <HeroSection/>

    <AppFeatures/>

    <HowItWorks/>
    
      {/* Fuel Stations Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="border-green-500 text-green-500">
                Fuel Stations
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Find Fuel Stations Near You
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover the best fuel stations with competitive prices in your area. Filter by fuel type, amenities,
                and more.
              </p>
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
              {limitedStations.map((station) => (
                <FuelStationCard key={station._id} fuelstation={station} />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Link href="/allstation">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                View All Stations
                <MapPin className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <TestimonialCarousel/>
      <DownloadSection/>
    </>
  )
}

