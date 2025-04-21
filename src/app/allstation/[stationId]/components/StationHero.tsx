"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { MapPin, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface StationHeroProps {
  id: string
  name: string
  imageUrl?: string
  stock: string
  location: string
  onOpenChat: () => void
}

export default function StationHero({ id, name, imageUrl, stock, location, onOpenChat }: StationHeroProps) {
  const router = useRouter()

  const openMapLink = (location: string) => {
    if (location.startsWith("http")) {
      window.open(location, "_blank")
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden mb-8">
      <div className="absolute inset-0">
        <Image
          src={imageUrl || "/placeholder.svg?height=400&width=1200"}
          alt={name}
          fill
          className="object-cover brightness-[0.7]"
          priority
        />
      </div>
      <div className="relative z-10 p-8 md:p-12 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant={stock === "available" ? "default" : "secondary"}
                className={stock === "available" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}
              >
                {stock === "available" ? "Open Now" : "Closed"}
              </Badge>
              <span className="text-sm opacity-80">ID: {id}</span>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:underline"
              onClick={() => openMapLink(location)}
            >
              <MapPin className="h-5 w-5" />
              <span>View on Map</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push(`/order/${id}`)}
              disabled={stock !== "available"}
              size="lg"
            >
              {stock === "available" ? "Place Order" : "Currently Unavailable"}
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/20"
              onClick={onOpenChat}
              size="lg"
            >
              Chat with Station
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
