"use client"

import { useState, useEffect } from "react"
import { Loader2, Pencil, Trash2, AlertCircle, Eye, Search, Filter, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import { Badge } from "@/components/ui/badge"
import EditFuelStationForm from "./EditFuelStationForm"

interface FuelTypeDetail {
  _id: string
  name: string
  price: number
}

interface FuelTypeItem {
  fuelType: FuelTypeDetail
  price: number
  quantity: number
  _id: string
}

interface FuelStation {
  _id: string
  name: string
  email: string
  phone: string
  location: string
  imageurl?: string
  stock: string
  user: string
  fuelTypes: FuelTypeItem[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface AuthUser {
  accessToken: string | null
  refreshToken: string | null
  userDetails: UserDetails | null
  role: string | null
}

interface UserDetails {
  id: string
  name: string
  email: string
  avatar: string | null
}

interface FuelStationListProps {
  user: AuthUser
  refreshTrigger: number
  onRefreshNeeded: () => void
}

export default function FuelStationList({ user, refreshTrigger, onRefreshNeeded }: FuelStationListProps) {
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([])
  const [filteredStations, setFilteredStations] = useState<FuelStation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedFuelType, setSelectedFuelType] = useState<string>("")
  const [availableFuelTypes, setAvailableFuelTypes] = useState<FuelTypeDetail[]>([])
  const [isLoadingFuelTypes, setIsLoadingFuelTypes] = useState<boolean>(false)

  useEffect(() => {
    fetchFuelStations()
    fetchAvailableFuelTypes()
  }, [refreshTrigger, user])

  // Apply filters whenever search term, selected fuel type, or fuel stations change
  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedFuelType, fuelStations])

  const fetchFuelStations = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8000/api/v1/fuelstations/getAllFuelStations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        console.log("Fuel stations data:", data.data)
        setFuelStations(data.data || [])
      } else {
        setError(data.message || "Failed to fetch fuel stations")
        toast.error(data.message || "Failed to fetch fuel stations")
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setError("An error occurred while fetching fuel stations")
      toast.error("An error occurred while fetching fuel stations")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableFuelTypes = async () => {
    setIsLoadingFuelTypes(true)
    try {
      const response = await fetch("http://localhost:8000/api/v1/fuelTypes/getAllFuelTypes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAvailableFuelTypes(data.data || [])
      } else {
        console.error("Failed to fetch fuel types:", data.message)
      }
    } catch (error) {
      console.error("Error fetching fuel types:", error)
    } finally {
      setIsLoadingFuelTypes(false)
    }
  }

  // Apply search and filter criteria
  const applyFilters = () => {
    let result = [...fuelStations]

    // Apply text search (case insensitive)
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (station) =>
          station.name.toLowerCase().includes(searchLower) || station.location.toLowerCase().includes(searchLower),
      )
    }

    // Apply fuel type filter
    if (selectedFuelType !== "") {
      result = result.filter((station) =>
        station.fuelTypes.some((fuelType) => {
          if (fuelType.fuelType && typeof fuelType.fuelType === "object") {
            return fuelType.fuelType._id === selectedFuelType
          }
          return fuelType.fuelType === selectedFuelType
        }),
      )
    }

    setFilteredStations(result)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedFuelType("")
  }

  const handleEdit = (station: FuelStation) => {
    setSelectedStation(station)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (station: FuelStation) => {
    setSelectedStation(station)
    setIsDeleteDialogOpen(true)
  }

  const handleView = (station: FuelStation) => {
    setSelectedStation(station)
    setIsViewDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedStation) return

    setIsDeleting(true)
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/fuelstations/deletelFuelStatinById/${selectedStation._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      )

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Fuel station deleted successfully")
        setIsDeleteDialogOpen(false)
        onRefreshNeeded()
      } else {
        toast.error(data.message || "Failed to delete fuel station")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("An error occurred while deleting the fuel station")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading && fuelStations.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading fuel stations...</span>
      </div>
    )
  }

  if (error && fuelStations.length === 0) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="mr-2 h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (fuelStations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground text-lg">No fuel stations found. Add your first station!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="w-full md:w-64">
            <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by fuel type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fuel Types</SelectItem>
                {isLoadingFuelTypes ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  availableFuelTypes.map((fuelType) => (
                    <SelectItem key={fuelType._id} value={fuelType._id}>
                      {fuelType.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || selectedFuelType) && (
            <Button variant="outline" onClick={resetFilters} className="shrink-0">
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredStations.length} of {fuelStations.length} fuel stations
          {(searchTerm || selectedFuelType) && " (filtered)"}
        </div>
      </div>

      {/* No results message */}
      {filteredStations.length === 0 && fuelStations.length > 0 && (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1">No matching fuel stations</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          <Button variant="outline" onClick={resetFilters} className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Fuel Stations Grid */}
      {filteredStations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <Card key={station._id} className="overflow-hidden">
              <div className="h-48 relative bg-gray-100">
                {station.imageurl ? (
                  <Image
                    src={station.imageurl || "/placeholder.svg"}
                    alt={station.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl truncate">{station.name}</h3>
                  <Badge variant={station.stock === "available" ? "success" : "destructive"}>
                    {station.stock === "available" ? "Available" : "Out of Stock"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-1 truncate">{station.location}</p>
                <p className="text-sm mb-1 truncate">Email: {station.email}</p>
                <p className="text-sm mb-3 truncate">Phone: {station.phone}</p>
                <p className="text-xs text-muted-foreground mb-3">Added: {formatDate(station.createdAt)}</p>

                <div className="mt-2">
                  <p className="font-medium mb-1">Fuel Types:</p>
                  <div className="space-y-1">
                    {station.fuelTypes && station.fuelTypes.length > 0 ? (
                      <>
                        {station.fuelTypes.slice(0, 2).map((fuel) => (
                          <div key={fuel._id} className="flex justify-between text-sm">
                            <span>
                              {fuel.fuelType && typeof fuel.fuelType === "object"
                                ? fuel.fuelType.name
                                : "Unknown Fuel Type"}
                            </span>
                            <span className="font-medium">${fuel.price.toFixed(2)}</span>
                          </div>
                        ))}
                        {station.fuelTypes.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{station.fuelTypes.length - 2} more fuel types
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No fuel types available</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleView(station)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(station)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(station)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Fuel Station Details</DialogTitle>
          </DialogHeader>
          {selectedStation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-64 relative bg-gray-100 mb-4 rounded-md overflow-hidden">
                  {selectedStation.imageurl ? (
                    <Image
                      src={selectedStation.imageurl || "/placeholder.svg"}
                      alt={selectedStation.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-xl mb-2">{selectedStation.name}</h3>
                <Badge className="mb-4" variant={selectedStation.stock === "available" ? "success" : "destructive"}>
                  {selectedStation.stock === "available" ? "Available" : "Out of Stock"}
                </Badge>
                <p className="mb-2">
                  <span className="font-medium">Location:</span> {selectedStation.location}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Email:</span> {selectedStation.email}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Phone:</span> {selectedStation.phone}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Created:</span> {formatDate(selectedStation.createdAt)}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Last Updated:</span> {formatDate(selectedStation.updatedAt)}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-3">Fuel Types</h4>
                {selectedStation.fuelTypes && selectedStation.fuelTypes.length > 0 ? (
                  <div className="space-y-4">
                    {selectedStation.fuelTypes.map((fuel) => (
                      <div key={fuel._id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">
                            {fuel.fuelType && typeof fuel.fuelType === "object"
                              ? fuel.fuelType.name
                              : "Unknown Fuel Type"}
                          </span>
                          <Badge variant="outline">${fuel.price.toFixed(2)}</Badge>
                        </div>
                        {fuel.fuelType && typeof fuel.fuelType === "object" && (
                          <p className="text-sm text-muted-foreground">Base Price: ${fuel.fuelType.price.toFixed(2)}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Quantity: {fuel.quantity.toLocaleString()} units
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No fuel types available for this station</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Fuel Station</DialogTitle>
          </DialogHeader>
          {selectedStation && (
            <EditFuelStationForm
              station={selectedStation}
              user={user}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                onRefreshNeeded()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the fuel station "{selectedStation?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
