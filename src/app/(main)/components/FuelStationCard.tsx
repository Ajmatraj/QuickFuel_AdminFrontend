"use client"

import Image from "next/image"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Station } from "@/hooks/useFuelStations"
import { MapPin, Phone, Mail } from "lucide-react"

interface FuelStationCardProps {
  station: Station
}

export function FuelStationCard({ station }: FuelStationCardProps) {
  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="relative h-48">
        <Image 
          src={station.imageurl || "/placeholder.jpg"} 
          alt={station.name} 
          layout="fill" 
          objectFit="cover"
          className="rounded-t-xl"
        />
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{station.name}</h3>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin size={16} className="text-primary" />
          <span>{station.location}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
          <Phone size={16} className="text-primary" />
          <span>{station.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
          <Mail size={16} className="text-primary" />
          <span>{station.email}</span>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Available Fuel Types:</h4>
          <div className="flex flex-wrap gap-2">
            {station.fuelTypes.map((fuel) => (
              <span key={fuel._id} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                {fuel.fuelType} - ${fuel.price} per L
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t">
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  )
}
