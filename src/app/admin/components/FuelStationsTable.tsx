"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, AlertCircle, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { getBadgeVariant } from "@/lib/utils"
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

// Define the types based on your API response
interface FuelType {
  fuelType: {
    _id: string
    name: string
    price: number
  }
  price: number
  quantity: number
  _id: string
}

interface FuelStation {
  _id: string
  name: string
  stock: string
  email: string
  phone: string
  location: string
  imageurl: string
  user: string
  fuelTypes: FuelType[]
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
  const [stations, setStations] = useState<FuelStation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stationToDelete, setStationToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchFuelStations()
  }, [])

  const fetchFuelStations = async () => {
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
        throw new Error(data.message || "Failed to fetch fuel stations")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching fuel stations:", err)
    } finally {
      setLoading(false)
    }
  }

  // Map stock to status for badge display
  const mapStockToStatus = (stock: string) => {
    switch (stock.toLowerCase()) {
      case "available":
        return "active"
      case "unavailable":
        return "inactive"
      case "maintenance":
        return "maintenance"
      default:
        return stock.toLowerCase()
    }
  }

  // Format fuel types to display as comma-separated string
  const formatFuelTypes = (fuelTypes: FuelType[]) => {
    return fuelTypes.map((ft) => ft.fuelType.name).join(", ")
  }

  const handleUpdate = (stationId: string) => {
    console.log(`Update station with ID: ${stationId}`)
    // Implement your update logic here
    // Typically this would navigate to an edit form or open a modal
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
        throw new Error(data.message || "Failed to delete fuel station")
      }
    } catch (err) {
      console.error("Error deleting fuel station:", err)
      alert(`Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setStationToDelete(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading fuel stations...</div>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2 h-5 w-5" />
        <span>Error loading fuel stations: {error}</span>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Station Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Fuel Types</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              No fuel stations found
            </TableCell>
          </TableRow>
        ) : (
          stations.map((station) => (
            <TableRow key={station._id}>
              <TableCell className="font-medium">{station.name}</TableCell>
              <TableCell>{station.location}</TableCell>
              <TableCell>
                <Badge
                  variant={getBadgeVariant(mapStockToStatus(station.stock))}
                  className={
                    mapStockToStatus(station.stock) === "active"
                      ? "font-bold bg-green-100 text-green-800 border-green-500 hover:bg-green-200"
                      : "font-medium bg-red-100 text-red-800 border-red-500 hover:bg-red-200"
                  }
                >
                  {mapStockToStatus(station.stock)}
                </Badge>
              </TableCell>
              <TableCell>{formatFuelTypes(station.fuelTypes)}</TableCell>
              <TableCell>{station.phone}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {station.fuelTypes.reduce((total, ft) => total + ft.quantity, 0)}
                  <Activity className="h-4 w-4 ml-1 text-blue-500" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdate(station._id)}
                    className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
                        onClick={() => setStationToDelete(station._id)}
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
                          Are you sure you want to delete the fuel station "{station.name}"? This action cannot be
                          undone.
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

