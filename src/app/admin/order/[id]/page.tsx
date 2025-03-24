"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"
import type { Order } from "@/app/types/orders"
import OrderDetailsCard from "../components/OrderDetailsCard"
import OrderTimeline from "../components/OrderTimeline"
import OrderUpdateCard from "../components/OrderUpdateCard"
import CustomerInfoCard from "../components/CustomerInfoCard"

const OrderDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const url = `http://localhost:8000/api/v1/orders/getOrderByOrderId/${orderId}`

      console.log(`Fetching order details from: ${url}`)
      const response = await axios.get(url)

      if (response.data.success) {
        const orderData = response.data.data
        setOrder(orderData)
        console.log("Order details loaded:", orderData)
      } else {
        setError("Failed to load order details")
        toast.error("Failed to load order details")
      }

      setLoading(false)
    } catch (err) {
      console.error("Error fetching order details:", err)
      setError("Failed to load order details")
      setLoading(false)
      toast.error("Failed to load order details")
    }
  }

  const updateOrderStatus = async (orderStatus: string, paymentStatus: string) => {
    try {
      setUpdating(true)

      // Update order status
      const orderStatusUrl = `http://localhost:8000/api/v1/orders/updateOrderStatus/${orderId}`
      const orderStatusResponse = await axios.put(orderStatusUrl, {
        status: orderStatus,
      })

      // Update payment status
      const paymentStatusUrl = `http://localhost:8000/api/v1/orders/updatePaymentStatus/${orderId}`
      const paymentStatusResponse = await axios
        .put(paymentStatusUrl, {
          paymentStatus: paymentStatus,
        })
        .catch((err) => {
          console.warn("Payment status update failed or endpoint not available:", err)
          return { data: { success: false } }
        })

      if (orderStatusResponse.data.success) {
        // Refresh order data
        fetchOrderDetails()
        toast.success("Order status updated successfully")
      } else {
        toast.error("Failed to update order status")
      }

      setUpdating(false)
    } catch (err) {
      console.error("Error updating order status:", err)
      toast.error("Failed to update order status")
      setUpdating(false)
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Button variant="outline" size="icon" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Order not found"}. Please try again or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-6)}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <OrderDetailsCard order={order} />
          <OrderTimeline order={order} />
        </div>

        <div>
          <OrderUpdateCard order={order} onUpdateStatus={updateOrderStatus} isUpdating={updating} />
          <CustomerInfoCard order={order} />
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsPage

