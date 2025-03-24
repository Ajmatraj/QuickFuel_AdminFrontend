import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle } from "lucide-react"
import type { Order } from "@/app/types/orders"

interface OrderTimelineProps {
  order: Order
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l space-y-6">
          <div className="relative">
            <div className="absolute -left-[25px] p-1 rounded-full bg-primary">
              <CheckCircle className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-medium">Order Placed</h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
              </p>
            </div>
          </div>

          {order.status !== "PENDING" && (
            <div className="relative">
              <div className="absolute -left-[25px] p-1 rounded-full bg-primary">
                <CheckCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Processing Started</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.updatedAt)} at {formatTime(order.updatedAt)}
                </p>
              </div>
            </div>
          )}

          {order.status === "COMPLETED" && (
            <div className="relative">
              <div className="absolute -left-[25px] p-1 rounded-full bg-primary">
                <CheckCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Order Completed</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.updatedAt)} at {formatTime(order.updatedAt)}
                </p>
              </div>
            </div>
          )}

          {order.status === "CANCELLED" && (
            <div className="relative">
              <div className="absolute -left-[25px] p-1 rounded-full bg-destructive">
                <AlertTriangle className="h-4 w-4 text-destructive-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Order Cancelled</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.updatedAt)} at {formatTime(order.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

