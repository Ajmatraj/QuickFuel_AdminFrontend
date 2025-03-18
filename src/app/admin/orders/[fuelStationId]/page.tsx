"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface OrderUser {
  name: string
  email: string
}

interface DeliveryAddress {
  address: string
}

interface Order {
  _id: string
  user: OrderUser
  status: string
  fuelType: string
  quantity: number
  totalCost: number
  phone: string
  deliveryAddress: DeliveryAddress
  orderDate: string
}

interface FuelStation {
  _id: string
  name: string
  location?: string
}

export default function OrdersPage() {
  const params = useParams()
  const router = useRouter()
  const fuelStationId = params.fuelStationId as string

  const [orders, setOrders] = useState<Order[]>([])
  const [fuelStation, setFuelStation] = useState<FuelStation | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Get user token from localStorage
  const getUserToken = (): string | null => {
    if (typeof window === "undefined") return null

    try {
      const storedUser = localStorage.getItem("userDetails")
      const parsedUser = storedUser ? JSON.parse(storedUser) : null
      return parsedUser?.token || null
    } catch (err) {
      console.error("Error parsing user from localStorage:", err)
      return null
    }
  }

  // Fetch fuel station details
  const fetchFuelStationDetails = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fuelstations/station/${fuelStationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setFuelStation(response.data.data)
    } catch (err: any) {
      console.error("Error fetching fuel station details:", err)
    }
  }

  // Fetch orders for the fuel station
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = getUserToken()

      if (!token) {
        throw new Error("Authentication token not found")
      }

      if (!fuelStationId) {
        throw new Error("Fuel station ID is required")
      }

      // Fetch fuel station details
      await fetchFuelStationDetails(token)

      // Fetch orders
      const response = await axios.get(`${API_BASE_URL}/orders/getFuelStationOrders/${fuelStationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setOrders(response.data.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (fuelStationId) {
      fetchOrders()
    }
  }, [fuelStationId])

  // Get status badge color based on order status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Processing
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Go back to fuel stations list
  const goBack = () => {
    router.push("/fuel-stations")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={goBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Fuel Stations
      </Button>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{fuelStation?.name ? `Orders for ${fuelStation.name}` : "Fuel Station Orders"}</CardTitle>
          <CardDescription>
            {fuelStation?.location
              ? `Location: ${fuelStation.location}`
              : "View and manage orders for this fuel station"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading orders...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-md">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No orders found for this fuel station.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead>Order Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        <div>{order.user.name}</div>
                        <div className="text-xs text-muted-foreground">{order.user.email}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.fuelType}</TableCell>
                      <TableCell>{order.quantity}L</TableCell>
                      <TableCell>${order.totalCost.toFixed(2)}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.deliveryAddress.address}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

