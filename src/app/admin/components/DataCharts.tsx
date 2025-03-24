"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Loader2 } from "lucide-react"

// Types for our API responses
interface FuelType {
  _id: string
  name: string
  price: number
}

interface StationFuelType {
  fuelType: FuelType
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
  fuelTypes: StationFuelType[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface FuelStationResponse {
  statusCode: string
  data: FuelStation[]
}

interface OrderUser {
  _id: string
  email: string
  name: string
}

interface OrderStation {
  _id: string
  name: string
  location: string
}

interface DeliveryAddress {
  latitude: number
  longitude: number
  address: string
  _id: string
}

interface Order {
  _id: string
  user: OrderUser
  status: string
  station: OrderStation
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

interface OrderResponse {
  statusCode: number
  data: Order[]
}

export default function DataCharts() {
  const [orders, setOrders] = useState<Order[]>([])
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch orders data
        const ordersResponse = await fetch("http://localhost:8000/api/v1/orders/getAllOrders")
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders data")
        }
        const ordersData: OrderResponse = await ordersResponse.json()

        // Fetch fuel station data
        const stationsResponse = await fetch("http://localhost:8000/api/v1/fuelstations/getAllFuelStations")
        if (!stationsResponse.ok) {
          throw new Error("Failed to fetch fuel station data")
        }
        const stationsData: FuelStationResponse = await stationsResponse.json()

        setOrders(ordersData.data)
        setFuelStations(stationsData.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Process order data for the line chart - group by date
  const processOrderTrendsData = () => {
    if (!orders.length) return []

    // Group orders by date and count them
    const ordersByDate = orders.reduce(
      (acc, order) => {
        // Format date as "Mar 15" for display
        const date = new Date(order.orderDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Convert to array format for the chart
    return Object.entries(ordersByDate)
      .map(([date, orders]) => ({ date, orders }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
  }

  // Process fuel type data for the pie chart
  const processFuelTypeData = () => {
    if (!orders.length) return []

    // Count orders by fuel type
    const fuelTypeCounts = orders.reduce(
      (acc, order) => {
        // Capitalize first letter for better display
        const fuelType = order.fuelType.charAt(0).toUpperCase() + order.fuelType.slice(1)
        acc[fuelType] = (acc[fuelType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Convert to array format for the chart
    return Object.entries(fuelTypeCounts).map(([name, value]) => ({ name, value }))
  }

  const orderTrendsData = processOrderTrendsData()
  const fuelTypeData = processFuelTypeData()

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"]

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading chart data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="text-destructive">Error loading data: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <OrderTrendsChart data={orderTrendsData} />
      <FuelDistributionChart data={fuelTypeData} colors={COLORS} />
    </div>
  )
}

function OrderTrendsChart({ data }: { data: { date: string; orders: number }[] }) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Order Trends</CardTitle>
        <CardDescription>Daily orders by date</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No order data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} name="Number of Orders" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function FuelDistributionChart({
  data,
  colors,
}: {
  data: { name: string; value: number }[]
  colors: string[]
}) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Fuel Type Distribution</CardTitle>
        <CardDescription>Orders by fuel type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No fuel type data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} orders`, "Quantity"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

