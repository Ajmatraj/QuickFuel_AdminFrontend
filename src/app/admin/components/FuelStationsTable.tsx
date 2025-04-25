"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBadgeVariant } from "@/lib/utils"
import { AlertCircle, AlertTriangle, Eye, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

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

// Define the types based on your API response
interface FuelStation {
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
  data: FuelStation[]
  message: string
  success: boolean
}

export function FuelStationsTable() {
  const router = useRouter()
  const [stations, setStations] = useState<FuelStation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStations()
  }, [])

  const fetchStations = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/v1/fuelstations/getAllFuelStations")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.success) {
        setStations(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch stations")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching stations:", err)
    } finally {
      setLoading(false)
    }
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

  // Get station's first initial for avatar fallback
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "S"
  }

  // Get fuel type names from the fuelTypes array
  const getFuelTypeNames = (fuelTypes: FuelInventoryItem[]) => {
    return fuelTypes.map((item) => item.fuelType.name)
  }

  const handleViewDetails = (stationId: string) => {
    router.push(`/admin/station-details/${stationId}`)
  }

  const handleDelete = async (stationId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/fuelstations/deletelFuelStatinById/${stationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Remove the deleted station from the state
        setStations(stations.filter((station) => station._id !== stationId))
        console.log(`Successfully deleted station with ID: ${stationId}`)
      } else {
        throw new Error(data.message || "Failed to delete station")
      }
    } catch (err) {
      console.error("Error deleting station:", err)
      alert(`Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading stations...</div>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2 h-5 w-5" />
        <span>Error loading stations: {error}</span>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Station</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Fuel Types</TableHead>
          <TableHead>Added</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              No stations found
            </TableCell>
          </TableRow>
        ) : (
          stations.map((station) => (
            <TableRow key={station._id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={station.imageurl || `/placeholder.svg?height=32&width=32`} alt={station.name} />
                    <AvatarFallback>{getInitial(station.name)}</AvatarFallback>
                  </Avatar>
                  {station.name}
                </div>
              </TableCell>
              <TableCell>{station.location}</TableCell>
              <TableCell>{station.phone}</TableCell>
              <TableCell>
                <Badge
                  variant={getBadgeVariant(station.stock.toLowerCase())}
                  className={
                    station.stock.toLowerCase() === "available"
                      ? "font-bold bg-green-100 text-green-800 border-green-500 hover:bg-green-200"
                      : "font-medium bg-red-100 text-red-800 border-red-500 hover:bg-red-200"
                  }
                >
                  {station.stock}
                </Badge>
              </TableCell>
              <TableCell>
                {station.fuelTypes && station.fuelTypes.length > 0
                  ? getFuelTypeNames(station.fuelTypes).join(", ")
                  : "None"}
              </TableCell>
              <TableCell>{formatDate(station.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(station._id)}
                    className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">View</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/station-edit/${station._id}`)}
                    className="h-8 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Confirm Deletion
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the station "{station.name}"? This action cannot be undone and
                          will remove all associated data.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={() => handleDelete(station._id)}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
