"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Star, ChevronDown, ChevronUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface FuelType {
    _id: string
    fuelType: {
      name: string
    }
    price: number
    quantity: number
  }
  
  interface FuelStation {
    _id: string
    imageurl: string
    name: string
    stock: string
    email: string
    phone: string
    location: string
    fuelTypes: FuelType[]
  }
  
  interface FuelStationCardProps {
    fuelstation: FuelStation
  }

export default function FuelStationCard({ fuelstation }: FuelStationCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Extract data from the fuelstation object
  const { name, location: address, stock, imageurl, fuelTypes } = fuelstation

  // Derived values
  const isOpen = stock === "available"
  const fuelTypeNames = fuelTypes.map((ft) => ft.fuelType.name)
  const price = fuelTypes.length > 0 ? `₹${fuelTypes[0].price}` : "N/A"

  // These would ideally come from your API in the future
  const distance = "2.5 km"
  const rating = 4.5
  const amenities = ["ATM", "Car Wash", "Convenience Store"]

  const router = useRouter();
  // Handle navigation to the fuel station details page
  const handleNavigate = () => {
    router.push(`/allstation/${fuelstation._id}`)
  }
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48">
        <Image src={imageurl || "/placeholder.svg?height=200&width=400"} alt={name} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant={isOpen ? "default" : "secondary"} className={isOpen ? "bg-green-500" : "bg-gray-500"}>
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{name}</CardTitle>
          <div className="flex items-center text-yellow-500">
            <Star className="fill-yellow-500 h-4 w-4" />
            <span className="ml-1 text-sm font-medium">{rating}</span>
          </div>
        </div>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
          {address} • {distance}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Regular from</p>
            <p className="text-2xl font-bold text-blue-600">{price}</p>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleNavigate}>
            Navigate
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {fuelTypeNames.slice(0, 3).map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
          {fuelTypeNames.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{fuelTypeNames.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <span className="flex items-center">
              Less info <ChevronUp className="ml-1 h-4 w-4" />
            </span>
          ) : (
            <span className="flex items-center">
              More info <ChevronDown className="ml-1 h-4 w-4" />
            </span>
          )}
        </Button>

        {expanded && (
          <div className="mt-2 w-full space-y-2 animate-in fade-in-50 duration-200">
            <div>
              <p className="text-sm font-medium">Amenities:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">All Fuel Types:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {fuelTypeNames.map((type) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <Button size="sm" className="w-full">
                View Details
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

