"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentMethods } from "./PaymentMethods"
import PaymentEsewa from "./PaymentEsewa"

interface PaymentSectionProps {
  orderId: string
  totalCost: number
}

export function PaymentSection({ orderId, totalCost }: PaymentSectionProps) {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<string>("esewa")
  const [processingPayment, setProcessingPayment] = useState(false)

  const handlePayment = async () => {
    try {
      setProcessingPayment(true)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Here you would normally make an API call to process the payment
      // const response = await fetch(`https://rc-epay.esewa.com.np/api/epay/main/v2/form`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     orderId,
      //     paymentMethod,
      //     amount: totalCost
      //   })
      // })

      // Success message and redirect
      alert("Payment processed successfully!")
      router.push("/orders/confirmation")
    } catch (err) {
      console.error("Payment error:", err)
      alert(err instanceof Error ? err.message : "Payment processing failed")
    } finally {
      setProcessingPayment(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Select a payment method to complete your order</CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentMethods value={paymentMethod} onValueChange={setPaymentMethod} />
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handlePayment} disabled={processingPayment}>
          {processingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Pay ₹{totalCost.toFixed(2)}
        </Button>
      </CardFooter>

    <PaymentEsewa/>

    </Card>
  )
}

