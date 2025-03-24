import { format } from "date-fns"
import { OrderStatusBadge } from "./OrderStatusBadge"

interface OrderStatusInformationProps {
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"
  orderDate: string
}

export function OrderStatusInformation({ status, orderDate }: OrderStatusInformationProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Order Status</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Status:</span>
          <OrderStatusBadge status={status} />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Date:</span>
          <span className="font-medium">{format(new Date(orderDate), "MMM d, yyyy")}</span>
        </div>
      </div>
    </div>
  )
}

