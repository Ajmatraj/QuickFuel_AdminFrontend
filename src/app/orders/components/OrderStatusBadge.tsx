import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OrderStatusBadgeProps {
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return <Badge className={cn(getStatusColor(status))}>{status}</Badge>
}

