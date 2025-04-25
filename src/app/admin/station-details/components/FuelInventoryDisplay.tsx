"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FuelTypeDetail {
  _id: string
  name: string
  price: number
}

interface FuelInventoryItem {
  _id: string
  fuelType: FuelTypeDetail
  price: number
  quantity: number
}

interface FuelInventoryDisplayProps {
  fuelTypes: FuelInventoryItem[]
}

export function FuelInventoryDisplay({ fuelTypes }: FuelInventoryDisplayProps) {
  if (!fuelTypes || fuelTypes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuel Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No inventory data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Station Price</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fuelTypes.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium capitalize">{item.fuelType.name}</TableCell>
                <TableCell>${item.fuelType.price.toFixed(2)}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity} liters</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
