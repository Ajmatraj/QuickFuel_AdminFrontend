"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentConfirmationPage() {
  const router = useRouter()

  useEffect(() => {
    // You could fetch the latest order details here if needed
  }, [])

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your payment has been processed successfully. Your fuel will be delivered according to the estimated
            delivery time.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="font-medium">Order Confirmation #</p>
            <p className="text-muted-foreground">{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => router.push("/")}>
            Return to Home
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/profile")}>
            View My Orders
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

