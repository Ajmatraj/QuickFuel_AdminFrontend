import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FuelInformation } from "./FuelInformation"
import { StationInformation } from "./StationInformation"
import { DeliveryInformation } from "./DeliveryInformation"
import { OrderStatusInformation } from "./OrderStatusInformation"

interface OrderDetailsCardProps {
  order: {
    fuelType: string
    quantity: number
    totalCost: number
    station: {
      name: string
      location: string
    }
    deliveryAddress: {
      address: string
    }
    phone: string
    status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"
    orderDate: string
  }
}

export function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
        <CardDescription>Details about your fuel order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FuelInformation fuelType={order.fuelType} quantity={order.quantity} totalCost={order.totalCost} />
          <StationInformation name={order.station.name} location={order.station.location} />
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DeliveryInformation address={order.deliveryAddress.address} phone={order.phone} />
          <OrderStatusInformation status={order.status} orderDate={order.orderDate} />
        </div>
      </CardContent>
    </Card>
  )
}

