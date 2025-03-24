"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { LoadingState } from "../components/LoadingState"
import { ErrorState } from "../components/ErrorState"
import { EmptyState } from "../components/EmptyState"
import { OrderHeader } from "../components/OrderHeader"
import { OrderDetailsCard } from "../components/OrderDetailsCard"
import { PaymentSection } from "../components/PaymentSection"


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
    longitude: number
    address: string
  }
  orderDate: string
  createdAt: string
  updatedAt: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const token =
          localStorage.getItem("accessToken") ||
          (localStorage.getItem("userDetails") && JSON.parse(localStorage.getItem("userDetails") || "{}").token)

        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await fetch(`http://localhost:8000/api/v1/orders/getOrderByOrderId/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()

        if (data.success) {
          setOrder(data.data)
        } else {
          throw new Error(data.message || "Error fetching order details")
        }
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!order) {
    return <EmptyState />
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <OrderHeader orderId={order._id} orderDate={order.orderDate} status={order.status} />

      <div className="flex flex-col gap-6">
        <OrderDetailsCard order={order} />

        {order.status === "PENDING" && <PaymentSection orderId={order._id} totalCost={order.totalCost} />}
      </div>
    </div>
  )
}

