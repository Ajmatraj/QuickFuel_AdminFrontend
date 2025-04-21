"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet } from "lucide-react"

interface FuelType {
  _id: string
  fuelType: { _id: string; name: string; price: number }
  price: number
  quantity: number
}

interface FuelsTabProps {
  stationId: string
  stationName: string
  stock: string
  fuelTypes: FuelType[]
}

export default function FuelsTab({ stationId, stationName, stock, fuelTypes }: FuelsTabProps) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5" />
          Available Fuel Types
        </CardTitle>
        <CardDescription>Detailed information about all fuel types available at {stationName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fuelTypes.map((fuel) => (
            <Card key={fuel._id} className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <h3 className="text-xl font-bold text-white capitalize">{fuel.fuelType.name}</h3>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold text-blue-600">₹{fuel.price}</p>
                    <p className="text-xs text-gray-500">per liter</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Quantity</p>
                    <p className="text-2xl font-bold">{fuel.quantity.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">liters</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Base Price</p>
                  <p className="font-medium">₹{fuel.fuelType.price}</p>
                </div>

                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push(`/order/${stationId}`)}
                  disabled={stock !== "available"}
                >
                  {stock === "available" ? "Order This Fuel" : "Currently Unavailable"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
