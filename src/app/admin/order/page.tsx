"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useSearchParams } from "next/navigation"
import { Calendar, Clock, Droplet, MapPin, Phone, User, Mail, DollarSign, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, CheckCircle } from "lucide-react"

// Define the order type based on the provided data structure
interface DeliveryAddress {
  latitude: number
  longitude: number
  address: string
  _id: string
}

interface OrderUser {
  _id: string
  email: string
  name: string
}

interface Order {
  _id: string
  user: OrderUser
  status: string
  station: string
  fuelType: string
  quantity: number
  totalCost: number
  phone: string
  deliveryAddress: DeliveryAddress
  orderDate: string
  createdAt: string
  updatedAt: string
  __v: number
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")

  const searchParams = useSearchParams()
  const stationId = searchParams.get("stationId")

  const fetchOrders = async () => {
    try {
      setLoading(true)
      let url = `http://localhost:8000/api/v1/orders/getFuelStationOrders/${stationId}`

      // Add status filter if selected
      if (statusFilter && statusFilter !== "all") {
        url += `${url.includes("?") ? "&" : "?"}status=${statusFilter}`
      }

      console.log(`Fetching orders from: ${url}`)
      const response = await axios.get(url)

      if (response.data.success) {
        setOrders(response.data.data)
        console.log(`Loaded ${response.data.data.length} orders`)
      } else {
        setError("Failed to load orders")
        toast.error("Failed to load orders")
      }

      setLoading(false)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Error fetching orders")
      setLoading(false)
      toast.error("Failed to load orders")
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const url = `http://localhost:8000/api/v1/orders/updateStatus/${orderId}`

      // Show loading toast
      const toastId = toast.loading("Updating order status...")

      const response = await axios.put(url, { status: newStatus })

      if (response.data.success) {
        // Update the order in the local state
        setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)))

        // Show success toast
        toast.update(toastId, {
          render: "Order status updated successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        })
      } else {
        // Show error toast
        toast.update(toastId, {
          render: "Failed to update order status",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
    } catch (err) {
      console.error("Error updating order status:", err)
      toast.error("Failed to update order status")
    }
  }

  useEffect(() => {
    if (stationId) {
      fetchOrders()
      document.title = `Orders for Station ${stationId}`
    } else {
      document.title = "All Orders"
    }
  }, [stationId, statusFilter])

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error: {error}</p>
          <p className="text-sm mt-1">Please try again or contact support if the issue persists.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">{stationId ? `Orders for Station ${stationId}` : "All Orders"}</h1>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">No orders found with the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${getStatusBadgeColor(order.status)} flex items-center gap-1 px-2 py-1 h-auto font-normal`}
                        >
                          {order.status}
                          <ChevronDown className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={order.status === "PENDING"}
                          onClick={() => updateOrderStatus(order._id, "PENDING")}
                          className="flex items-center gap-2"
                        >
                          {order.status === "PENDING" && <CheckCircle className="h-3.5 w-3.5" />}
                          PENDING
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={order.status === "PROCESSING"}
                          onClick={() => updateOrderStatus(order._id, "PROCESSING")}
                          className="flex items-center gap-2"
                        >
                          {order.status === "PROCESSING" && <CheckCircle className="h-3.5 w-3.5" />}
                          PROCESSING
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={order.status === "COMPLETED"}
                          onClick={() => updateOrderStatus(order._id, "COMPLETED")}
                          className="flex items-center gap-2"
                        >
                          {order.status === "COMPLETED" && <CheckCircle className="h-3.5 w-3.5" />}
                          COMPLETED
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={order.status === "CANCELLED"}
                          onClick={() => updateOrderStatus(order._id, "CANCELLED")}
                          className="flex items-center gap-2"
                        >
                          {order.status === "CANCELLED" && <CheckCircle className="h-3.5 w-3.5" />}
                          CANCELLED
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(order.orderDate)}</span>
                  <Clock className="h-3.5 w-3.5 ml-2" />
                  <span>{formatTime(order.orderDate)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{order.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{order.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{order.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium capitalize">{order.fuelType}</span>
                      <span className="text-sm text-muted-foreground ml-1">({order.quantity} liters)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${order.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm text-muted-foreground">{order.deliveryAddress.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage

