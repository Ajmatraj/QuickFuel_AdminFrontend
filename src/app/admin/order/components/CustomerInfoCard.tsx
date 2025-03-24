import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Truck } from "lucide-react"
import type { Order } from "@/app/types/orders"

interface CustomerInfoCardProps {
  order: Order
}

export default function CustomerInfoCard({ order }: CustomerInfoCardProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{order.user.name}</h3>
            <p className="text-sm text-muted-foreground">Customer ID: {order.user._id.slice(-6)}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{order.user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{order.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span>Delivery Address</span>
          </div>
          <div className="pl-6 text-sm">{order.deliveryAddress.address}</div>
        </div>
      </CardContent>
    </Card>
  )
}

