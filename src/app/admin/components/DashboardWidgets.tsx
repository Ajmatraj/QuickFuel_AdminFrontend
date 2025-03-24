"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Users, ShoppingCart, DollarSign, TrendingUp, RefreshCw, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Define types for our API responses
interface User {
  _id: string
  username: string
  email: string
  name: string
  avatar: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

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
}

// API endpoints
const API_ENDPOINTS = {
  users: "http://localhost:8000/api/v1/users/allUsers",
  orders: "http://localhost:8000/api/v1/orders/getAllOrders",
  stations: "http://localhost:8000/api/v1/fuelstations/getAllFuelStations",
}

const DashboardWidgets = () => {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stations, setStations] = useState<FuelStation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Function to fetch data from an API endpoint
  const fetchFromAPI = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}: ${response.statusText}`)
    }
    return await response.json()
  }

  // Main function to fetch all data
  const fetchData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      // Fetch all data in parallel
      const [usersData, ordersData, stationsData] = await Promise.all([
        fetchFromAPI(API_ENDPOINTS.users),
        fetchFromAPI(API_ENDPOINTS.orders),
        fetchFromAPI(API_ENDPOINTS.stations),
      ])

      setUsers(usersData.data || [])
      setOrders(ordersData.data || [])
      setStations(stationsData.data || [])
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle manual refresh
  const handleRefresh = () => {
    fetchData(true)
  }

  // Memoized calculations to prevent recalculating on every render
  const totalOrders = orders.length;
  const { totalUsers, totalRevenue, growthPercentage, activeUsers, pendingOrders, avgOrderValue } =
    useMemo(() => {
      // Calculate total revenue from all orders
      const revenue = orders.reduce((total, order) => total + order.totalCost, 0)

      // Count pending orders
      const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length

      // Calculate average order value
      const avgValue = totalOrders ? revenue / orders.length : 0

      // Calculate growth percentage (comparing current month orders to previous month)
      const growth = (() => {
        if (orders.length === 0) return 0

        const now = new Date()
        const currentMonth = now.getMonth()
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const currentYear = now.getFullYear()
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

        // Filter orders for current month and previous month
        const currentMonthOrders = orders.filter((order) => {
          const orderDate = new Date(order.orderDate)
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
        })

        const previousMonthOrders = orders.filter((order) => {
          const orderDate = new Date(order.orderDate)
          return orderDate.getMonth() === previousMonth && orderDate.getFullYear() === previousYear
        })

        const currentMonthTotal = currentMonthOrders.length
        const previousMonthTotal = previousMonthOrders.length

        // Calculate growth percentage
        if (previousMonthTotal === 0) return currentMonthTotal > 0 ? 100 : 0

        return ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
      })()

      // Count active users
      const activeUserCount = users.filter((user) => user.status === "Active").length

      return {
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        growthPercentage: growth,
        activeUsers: activeUserCount,
        pendingOrders: pendingOrdersCount,
        avgOrderValue: avgValue,
      }
    }, [users, orders])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format date for last updated timestamp
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const growthIsPositive = growthPercentage >= 0

  // Render loading skeletons
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="ml-4 space-y-2 w-full">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <div>
          <h3 className="text-red-800 font-medium">Error loading dashboard data</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-auto">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Dashboard Overview</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Widget */}
        <div className="bg-white p-4 rounded-lg shadow transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-800">{totalUsers}</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">User details</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-2">
                  <h4 className="font-medium">User Details</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active users:</span>
                    <span className="font-medium">{activeUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inactive users:</span>
                    <span className="font-medium">{totalUsers - activeUsers}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Total Orders Widget */}
        <div className="bg-white p-4 rounded-lg shadow transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-full">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-800">{totalOrders}</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Order details</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-2">
                  <h4 className="font-medium">Order Details</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending orders:</span>
                    <span className="font-medium">{pendingOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed orders:</span>
                    <span className="font-medium">{totalOrders - pendingOrders}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Total Revenue Widget */}
        <div className="bg-white p-4 rounded-lg shadow transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-800">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Revenue details</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-2">
                  <h4 className="font-medium">Revenue Details</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average order value:</span>
                    <span className="font-medium">{formatCurrency(avgOrderValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Orders processed:</span>
                    <span className="font-medium">{totalOrders}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Monthly Growth Widget */}
        <div className="bg-white p-4 rounded-lg shadow transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Monthly Growth</p>
                <p className={`text-2xl font-semibold ${growthIsPositive ? "text-green-600" : "text-red-600"}`}>
                  {growthIsPositive ? "+" : ""}
                  {growthPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Growth details</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-2">
                  <h4 className="font-medium">Growth Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Calculated based on the change in order count compared to the previous month.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {growthIsPositive
                      ? "Your business is growing! Keep up the good work."
                      : "Consider running promotions to increase orders."}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardWidgets

