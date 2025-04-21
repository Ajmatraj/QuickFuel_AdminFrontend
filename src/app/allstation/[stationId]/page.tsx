"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User } from "@/app/types/user"
import StationDetailsTab from "./components/StationDetailsTab"
import FuelsTab from "./components/FuelsTab"
import ChatDialog from "./components/ChatDialog"
import StationHero from "./components/StationHero"


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
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Mock current user - in a real app, this would come from your auth system
  const [currentUser, setCurrentUser] = useState<User>()

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

  // Load debug user IDs from localStorage if available
  useEffect(() => {
    const savedCurrentUserId = localStorage.getItem("debug_current_user_id")
    if (savedCurrentUserId) {
      setCurrentUser((prev) => ({ ...prev, _id: savedCurrentUserId }))
    }
  }, [])

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

  // Create station user object for chat
  const stationUser = {
    _id: localStorage.getItem("debug_station_user_id") || fuelStation.user,
    name: fuelStation.name,
    imageUrl: fuelStation.imageurl,
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
      <StationHero
        id={fuelStation._id}
        name={fuelStation.name}
        imageUrl={fuelStation.imageurl}
        stock={fuelStation.stock}
        location={fuelStation.location}
        onOpenChat={() => setIsChatOpen(true)}
      />

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
        <StationDetailsTab
          id={fuelStation._id}
          location={fuelStation.location}
          phone={fuelStation.phone}
          email={fuelStation.email}
          stock={fuelStation.stock}
          user={fuelStation.user}
          createdAt={fuelStation.createdAt}
          updatedAt={fuelStation.updatedAt}
          fuelTypes={fuelStation.fuelTypes}
          onViewAllFuels={() => setActiveTab("fuels")}
        />
      ) : (
        <FuelsTab
          stationId={fuelStation._id}
          stationName={fuelStation.name}
          stock={fuelStation.stock}
          fuelTypes={fuelStation.fuelTypes}
        />
      )}

      {/* Chat Dialog */}
      {isChatOpen && (
        <ChatDialog
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          currentUser={currentUser}
          stationUser={stationUser}
        />
      )}
    </div>
  )
}
