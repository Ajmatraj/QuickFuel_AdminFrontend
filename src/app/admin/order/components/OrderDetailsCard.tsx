import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Droplet, DollarSign, MapPin, Phone, Mail } from "lucide-react"
import type { Order } from "@/app/types/orders"

interface OrderDetailsCardProps {
  order: Order
}

export default function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const getStatusBadgeVariant = (status: string): "secondary" | "default" | "destructive" | "outline" | undefined => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "secondary"
      case "PROCESSING":
        return "default"
      case "COMPLETED":
        return "outline"
      case "CANCELLED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusBadgeVariant = (status: string): "secondary" | "default" | "destructive" | "outline" | undefined => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "default"
      case "PENDING":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Order Details
          <div className="flex gap-2">
            <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
            <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus || "PENDING")}>
              Payment: {order.paymentStatus || "PENDING"}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Placed on {formatDate(order.orderDate)} at {formatTime(order.orderDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Fuel Details</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-primary" />
                <span className="capitalize font-medium">{order.fuelType}</span>
              </div>
              <div className="text-sm text-muted-foreground">Quantity: {order.quantity} liters</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Payment Information</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium">${order.totalCost.toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground">Payment Method: Credit Card</div>
            </div>
          </div>
        </div>

        {order.paymentStatus === "PAID" && (
          <>
            <Separator className="my-4" />

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Payment Details</h3>
              <div className="space-y-3 p-3 bg-muted/20 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm">Transaction ID:</span>
                  <span className="text-sm font-medium">
                    TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Payment Date:</span>
                  <span className="text-sm font-medium">{formatDate(order.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Payment Method:</span>
                  <span className="text-sm font-medium">Credit Card (•••• 4242)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal:</span>
                  <span className="text-sm">${(order.totalCost * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tax:</span>
                  <span className="text-sm">${(order.totalCost * 0.1).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium">${order.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator className="my-4" />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Delivery Address</h3>
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>{order.deliveryAddress.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Contact Information</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{order.user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

