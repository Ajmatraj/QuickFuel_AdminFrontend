"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Calendar, Clock, Droplet, MapPin, Phone, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const FuelStationOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem("userDetails")
        const parsedUserDetails = storedUser ? JSON.parse(storedUser) : null
        const userId = parsedUserDetails?.id
        const token = parsedUserDetails?.token

        if (!userId) throw new Error("User ID not found in localStorage")

        // Fetch Fuel Station details by User ID
        const fuelStationRes = await axios.get(`http://localhost:8000/api/v1/fuelstations/${userId}`)
        const fuelStations = fuelStationRes.data.data

        if (!fuelStations || fuelStations.length === 0) throw new Error("Fuel Station not found for this user")

        const fuelStationId = fuelStations[0]._id // Extract the ID of the first fuel station
        console.log("Fuel Station ID:", fuelStationId)

        // Fetch orders for the fuel station
        const ordersRes = await axios.get(`http://localhost:8000/api/v1/orders/getFuelStationOrders/${fuelStationId}`)
        setOrders(ordersRes.data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "COMPLETED":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "CANCELLED":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Fuel Station Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Error Loading Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fuel Station Orders</h1>
          <p className="text-muted-foreground">Manage and track all your fuel delivery orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Refresh</Button>
          <Button>New Order</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({orders.filter((order) => order.status === "PENDING").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({orders.filter((order) => order.status === "COMPLETED").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} statusColor={getStatusColor} formatDate={formatDate} />
            ))}
          </div>

          {orders.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-muted-foreground">You don't have any orders yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders
              .filter((order) => order.status === "PENDING")
              .map((order) => (
                <OrderCard key={order._id} order={order} statusColor={getStatusColor} formatDate={formatDate} />
              ))}
          </div>

          {orders.filter((order) => order.status === "PENDING").length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No pending orders</h3>
              <p className="text-muted-foreground">You don't have any pending orders at the moment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders
              .filter((order) => order.status === "COMPLETED")
              .map((order) => (
                <OrderCard key={order._id} order={order} statusColor={getStatusColor} formatDate={formatDate} />
              ))}
          </div>

          {orders.filter((order) => order.status === "COMPLETED").length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No completed orders</h3>
              <p className="text-muted-foreground">You don't have any completed orders yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

const OrderCard = ({ order, statusColor, formatDate }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {new Date(order.orderDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge className={statusColor(order.status)}>{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
            <p className="font-medium">{order.user.name}</p>
            <p className="text-sm text-muted-foreground">{order.user.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <p>{order.phone}</p>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <p>{order.deliveryAddress.address}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Fuel Type</p>
            <div className="flex items-center">
              <Droplet className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="font-medium capitalize">{order.fuelType}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Quantity</p>
            <p className="font-medium">{order.quantity} liters</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="font-medium">Rs. {order.totalCost}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ordered</p>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="font-medium">{formatDate(order.orderDate)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
        {order.status === "PENDING" && <Button className="w-full">Process Order</Button>}
      </CardFooter>
    </Card>
  )
}

export default FuelStationOrders

