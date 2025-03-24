"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/app/types/orders"

interface OrderUpdateCardProps {
  order: Order
  onUpdateStatus: (orderStatus: string, paymentStatus: string) => Promise<void>
  isUpdating: boolean
}

export default function OrderUpdateCard({ order, onUpdateStatus, isUpdating }: OrderUpdateCardProps) {
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("")

  useEffect(() => {
    setSelectedOrderStatus(order.status)
    setSelectedPaymentStatus(order.paymentStatus || "PENDING")
  }, [order])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Order</CardTitle>
        <CardDescription>Manage order and payment status</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="order">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="order">Order Status</TabsTrigger>
            <TabsTrigger value="payment">Payment Status</TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-4 pt-4">
            <div className="space-y-4">
              <RadioGroup value={selectedOrderStatus} onValueChange={setSelectedOrderStatus} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PENDING" id="pending" />
                  <Label htmlFor="pending" className="flex items-center gap-2">
                    <Badge variant="secondary">PENDING</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PROCESSING" id="processing" />
                  <Label htmlFor="processing" className="flex items-center gap-2">
                    <Badge>PROCESSING</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="COMPLETED" id="completed" />
                  <Label htmlFor="completed" className="flex items-center gap-2">
                    <Badge variant="default">COMPLETED</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CANCELLED" id="cancelled" />
                  <Label htmlFor="cancelled" className="flex items-center gap-2">
                    <Badge variant="destructive">CANCELLED</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 pt-4">
            <div className="space-y-4">
              <RadioGroup value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PENDING" id="payment-pending" />
                  <Label htmlFor="payment-pending" className="flex items-center gap-2">
                    <Badge variant="secondary">PENDING</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PAID" id="payment-paid" />
                  <Label htmlFor="payment-paid" className="flex items-center gap-2">
                    <Badge variant="default">PAID</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onUpdateStatus(selectedOrderStatus, selectedPaymentStatus)}
          disabled={
            isUpdating || (selectedOrderStatus === order.status && selectedPaymentStatus === order.paymentStatus)
          }
        >
          {isUpdating ? "Updating..." : "Update Status"}
        </Button>
      </CardFooter>
    </Card>
  )
}

