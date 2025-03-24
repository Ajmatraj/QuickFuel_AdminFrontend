"use client"

import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { OrderStatusBadge } from "./OrderStatusBadge"

interface OrderHeaderProps {
  orderId: string
  orderDate: string
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"
}

export function OrderHeader({ orderId, orderDate, status }: OrderHeaderProps) {
  const router = useRouter()

  return (
    <>
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order #{orderId.substring(orderId.length - 8)}</h1>
          <p className="text-muted-foreground">Placed on {format(new Date(orderDate), "MMMM d, yyyy 'at' h:mm a")}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>
    </>
  )
}

