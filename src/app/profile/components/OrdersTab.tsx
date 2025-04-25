"use client"

import { useState, useEffect } from "react"
import { Loader2, ExternalLink, RefreshCw, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import type { UserProfile } from "@/app/types/user"
import { useRouter } from "next/navigation"
import { ToastContainer } from "react-toastify"

interface Order {
  _id: string
  user: string
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"
  station: {
    _id: string
    name: string
    location: string
  }
  fuelType: string
  quantity: number
  totalCost: number
  phone: string
  deliveryAddress: {
    latitude: number
    longitude: string
    address: string
  }
  orderDate: string
  createdAt: string
  updatedAt: string
}

export default function OrdersTab({ user }: { user: UserProfile }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeView, setActiveView] = useState("all")

  const router = useRouter()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const token =
        localStorage.getItem("accessToken") ||
        (localStorage.getItem("userDetails") && JSON.parse(localStorage.getItem("userDetails") || "{}").token)

      if (!token) {
        throw new Error("Authentication token not found")
      }

      const userId = user._id

      const response = await fetch(`http://localhost:8000/api/v1/orders/getuserOrders/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()

      if (data.success) {
        setOrders(data.data || [])
      } else {
        throw new Error(data.message || "Error fetching orders")
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [user])

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true
    return order.status.toLowerCase() === statusFilter.toLowerCase()
  })

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const handleViewDetails = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }

  const handleCanceled = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
  
      // Token extraction logic
      const accessToken = localStorage.getItem("accessToken");
      const userDetails = localStorage.getItem("userDetails");
      const parsedUser = userDetails ? JSON.parse(userDetails) : null;
      const token = accessToken || parsedUser?.token;
  
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      const response = await fetch(
        `http://localhost:8000/api/v1/orders/cancelOrder/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error("JSON parsing error:", jsonErr);
        throw new Error("Invalid JSON response from server");
      }
  
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to cancel order");
      }
  
      console.log("Order cancelled:", data.data); // optional debug log
      fetchOrders(); // Refresh the order list
    } catch (err) {
      console.error("❌ Error cancelling order:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleDelete = async (orderId: string) => {
    try {
      setLoading(true)
      setError(null)
  
      const token =
        localStorage.getItem("accessToken") ||
        (localStorage.getItem("userDetails") && JSON.parse(localStorage.getItem("userDetails") || "{}").token)
  
      if (!token) {
        throw new Error("Authentication token not found")
      }
  
      const response = await fetch(`http://localhost:8000/api/v1/orders/deleteOrder/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
  
      if (!response.ok) {
        throw new Error("Failed to delete order")
      }
  
      const data = await response.json()
  
      if (data.success) {
        fetchOrders()
      } else {
        throw new Error(data.message || "Error deleting order")
      }
    } catch (err) {
      console.error("Error deleting order:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }
  

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-6">You haven't placed any fuel orders yet.</p>
        <Button onClick={() => (window.location.href = "/")}>Order Fuel Now</Button>
      </div>
    )
  }

  return (
    <>
    <ToastContainer />

    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Your Orders</h2>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={fetchOrders} title="Refresh orders">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="recent">Recent Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No orders match your filter criteria</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {order.fuelType} - {order.quantity} Liters
                      </CardTitle>
                      <CardDescription>Order #{order._id.substring(order._id.length - 8)}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Fuel Station</h4>
                      <p className="font-medium">{order.station ? order.station.name : "No station assigned"}</p>
                      {order.station ? (
                        <a
                          href={order.station.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary flex items-center gap-1 mt-1"
                        >
                          View on Maps <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Delivery Address</h4>
                      <p className="font-medium">{order.deliveryAddress.address}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Order Date</h4>
                      <p className="font-medium">{format(new Date(order.orderDate), "MMM d, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(order.orderDate), "h:mm a")}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact</h4>
                      <p className="font-medium">{order.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Cost</h4>
                      <p className="font-medium">Rs. {order.totalCost.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2">
                  <Button onClick={() => handleViewDetails(order._id)}>View Details</Button>
                  <div className="flex gap-2">
                    {order.status !== "CANCELLED" && (
                      <Button variant="destructive" onClick={() => handleCanceled(order._id)}>
                        Cancel
                      </Button>
                    )}

                    {order.status === "CANCELLED" && (
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(order._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-muted-foreground text-center py-8">
            <p>Recent order filtering not implemented yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </>
  )
}
