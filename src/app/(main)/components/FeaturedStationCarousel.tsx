"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Check, MapPin, Fuel, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface FuelType {
  fuelType: string
  price: number
  quantity: number
  _id?: string
}

interface Station {
  _id: string
  name: string
  imageurl: string
  location: string
  phone: string
  email: string
  stock: string
  fuelTypes: FuelType[]
  user: string
  createdAt: string
  updatedAt: string
}

interface FeaturedStationCarouselProps {
  stations: Station[]
}

export function FeaturedStationCarousel({ stations }: FeaturedStationCarouselProps) {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const handleViewDetails = (stationId: string) => {
    router.push(`/fuel-station/${stationId}`)
  }

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current === stations.length - 1 ? 0 : current + 1))
  }, [stations.length])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoplay) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoplay, nextSlide])

  return (
    <Carousel
      className="w-full"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
      opts={{
        align: "start",
      }}
    >
      <CarouselContent>
        {stations.map((station, index) => (
          <CarouselItem key={station._id} className="md:basis-1/2 lg:basis-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={station.imageurl || "/placeholder.svg?height=200&width=400"}
                    alt={station.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={station.stock === "available" ? "default" : "destructive"}>
                      {station.stock === "available" ? (
                        <div className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span>Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>Unavailable</span>
                        </div>
                      )}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 flex-grow flex flex-col">
                  <div className="mb-2">
                    <h3 className="font-bold text-lg truncate">{station.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">Location available</span>
                    </div>
                  </div>

                  <div className="mt-2 mb-4 flex-grow">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fuel Types:</span>
                      <span className="font-medium">{station.fuelTypes.length}</span>
                    </div>

                    {station.fuelTypes.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {station.fuelTypes.slice(0, 2).map((fuel, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                              <Fuel className="h-3 w-3 text-primary mr-1" />
                              <span className="truncate max-w-[100px]">{fuel.fuelType}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Rs. {fuel.price}
                            </Badge>
                          </div>
                        ))}
                        {station.fuelTypes.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center mt-1">
                            +{station.fuelTypes.length - 2} more types
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button className="w-full mt-auto" onClick={() => handleViewDetails(station._id)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-8 gap-2">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}

