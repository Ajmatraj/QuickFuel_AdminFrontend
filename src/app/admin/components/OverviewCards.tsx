"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, FileText, FuelIcon as GasPump, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Define types for our API responses
interface User {
  _id: string
  username: string
  email: string
  name: string
  role: string
  status: string
  createdAt: string
}

interface FuelStation {
  _id: string
  name: string
  stock: string
  email: string
  location: string
  createdAt: string
  fuelTypes: Array<{
    fuelType: {
      _id: string
      name: string
      price: number
    }
    price: number
    quantity: number
  }>
}

interface Order {
  _id: string
  status: string
  fuelType: string
  quantity: number
  totalCost: number
  orderDate: string
  createdAt: string
}

// API endpoints
const API_ENDPOINTS = {
  users: "http://localhost:8000/api/v1/users/allUsers",
  orders: "http://localhost:8000/api/v1/orders/getAllOrders",
  stations: "http://localhost:8000/api/v1/fuelstations/getAllFuelStations",
}

export default function OverviewCards() {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stations, setStations] = useState<FuelStation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [usersResponse, ordersResponse, stationsResponse] = await Promise.all([
          fetch(API_ENDPOINTS.users),
          fetch(API_ENDPOINTS.orders),
          fetch(API_ENDPOINTS.stations),
        ])

        // Check for errors
        if (!usersResponse.ok) throw new Error("Failed to fetch users data")
        if (!ordersResponse.ok) throw new Error("Failed to fetch orders data")
        if (!stationsResponse.ok) throw new Error("Failed to fetch stations data")

        // Parse JSON responses
        const usersData = await usersResponse.json()
        const ordersData = await ordersResponse.json()
        const stationsData = await stationsResponse.json()

        // Update state with fetched data
        setUsers(usersData.data || [])
        setOrders(ordersData.data || [])
        setStations(stationsData.data || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate metrics and growth percentages
  const metrics = useMemo(() => {
    // Get current date and previous month
    const now = new Date()
    const currentMonth = now.getMonth()
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const currentYear = now.getFullYear()
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Filter data for current month and previous month
    const filterByMonth = <T extends { createdAt: string }>(items: T[], month: number, year: number) => {
      return items.filter((item) => {
        const date = new Date(item.createdAt)
        return date.getMonth() === month && date.getFullYear() === year
      })
    }

    // Current month data
    const currentMonthUsers = filterByMonth(users, currentMonth, currentYear)
    const currentMonthStations = filterByMonth(stations, currentMonth, currentYear)
    const currentMonthOrders = filterByMonth(orders, currentMonth, currentYear)

    // Previous month data
    const previousMonthUsers = filterByMonth(users, previousMonth, previousYear)
    const previousMonthStations = filterByMonth(stations, previousMonth, previousYear)
    const previousMonthOrders = filterByMonth(orders, previousMonth, previousYear)

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    // Calculate total revenue and growth
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.totalCost, 0)
    const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + order.totalCost, 0)

    return {
      totalUsers: users.length,
      userGrowth: calculateGrowth(currentMonthUsers.length, previousMonthUsers.length),

      totalStations: stations.length,
      stationGrowth: calculateGrowth(currentMonthStations.length, previousMonthStations.length),

      totalOrders: orders.length,
      orderGrowth: calculateGrowth(currentMonthOrders.length, previousMonthOrders.length),

      totalRevenue: orders.reduce((sum, order) => sum + order.totalCost, 0),
      revenueGrowth: calculateGrowth(currentMonthRevenue, previousMonthRevenue),
    }
  }, [users, stations, orders])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
        <div>
          <h3 className="text-red-800 font-medium">Error loading overview data</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className={metrics.userGrowth >= 0 ? "text-emerald-500" : "text-red-500"}>
              {metrics.userGrowth >= 0 ? "+" : ""}
              {metrics.userGrowth.toFixed(1)}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Fuel Stations</CardTitle>
          <GasPump className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalStations.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className={metrics.stationGrowth >= 0 ? "text-emerald-500" : "text-red-500"}>
              {metrics.stationGrowth >= 0 ? "+" : ""}
              {metrics.stationGrowth.toFixed(1)}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalOrders.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className={metrics.orderGrowth >= 0 ? "text-emerald-500" : "text-red-500"}>
              {metrics.orderGrowth >= 0 ? "+" : ""}
              {metrics.orderGrowth.toFixed(1)}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            <span className={metrics.revenueGrowth >= 0 ? "text-emerald-500" : "text-red-500"}>
              {metrics.revenueGrowth >= 0 ? "+" : ""}
              {metrics.revenueGrowth.toFixed(1)}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

