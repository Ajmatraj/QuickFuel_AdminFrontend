"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useSearchParams, useRouter } from "next/navigation"
import { Calendar, Clock, Droplet, MapPin, Phone, Mail, DollarSign, Filter, ArrowUpDown, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

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
  paymentStatus?: string
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState<string>("orderDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const searchParams = useSearchParams()
  const router = useRouter()
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
        // Add mock payment status for demonstration
        const ordersWithPayment = response.data.data.map((order: Order) => ({
          ...order,
          paymentStatus: Math.random() > 0.3 ? "PAID" : "PENDING",
        }))
        setOrders(ordersWithPayment)
        console.log(`Loaded ${ordersWithPayment.length} orders`)
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

  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/admin/order/${orderId}`)
  }

  useEffect(() => {
    if (stationId) {
      fetchOrders()
      document.title = `Orders for Station ${stationId}`
    } else {
      document.title = "All Orders"
    }
  }, [stationId, statusFilter])

  useEffect(() => {
    // Sort orders when sort parameters change
    const sortedOrders = [...orders].sort((a, b) => {
      let aValue, bValue

      // Handle nested properties
      if (sortField === "user.name") {
        aValue = a.user.name
        bValue = b.user.name
      } else if (sortField === "deliveryAddress.address") {
        aValue = a.deliveryAddress.address
        bValue = b.deliveryAddress.address
      } else {
        aValue = (a as any)[sortField]
        bValue = (b as any)[sortField]
      }

      // Handle date fields
      if (sortField === "orderDate" || sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setOrders(sortedOrders)
  }, [sortField, sortDirection])

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to descending
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "secondary"
      case "PROCESSING":
        return "default"
      case "COMPLETED":
        return "default"
      case "CANCELLED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "default"
      case "PENDING":
        return "outline"
      default:
        return "secondary"
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
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
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
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No orders found with the selected filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("_id")}>
                    <div className="flex items-center">
                      Order ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("user.name")}>
                    <div className="flex items-center">
                      Customer
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("orderDate")}>
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("fuelType")}>
                    <div className="flex items-center">
                      Fuel Details
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("totalCost")}>
                    <div className="flex items-center">
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("paymentStatus")}>
                    <div className="flex items-center">
                      Payment
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={order._id} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.user.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {order.phone}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{order.user.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{order.deliveryAddress.address}</span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(order.orderDate)}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(order.orderDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Droplet className="h-3.5 w-3.5" />
                          <span className="capitalize">{order.fuelType}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">{order.quantity} liters</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-3.5 w-3.5" />
                        {order.totalCost.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus || "PENDING")}>
                        {order.paymentStatus || "PENDING"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleViewOrderDetails(order._id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage

