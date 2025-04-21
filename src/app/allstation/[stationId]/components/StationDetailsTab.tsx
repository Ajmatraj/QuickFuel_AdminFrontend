"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, User, Calendar, Clock, Share2, Info, Droplet } from "lucide-react"

interface FuelType {
  _id: string
  fuelType: { _id: string; name: string; price: number }
  price: number
  quantity: number
}

interface StationDetailsTabProps {
  id: string
  location: string
  phone?: string
  email?: string
  stock: string
  user: string
  createdAt: string
  updatedAt: string
  fuelTypes: FuelType[]
  onViewAllFuels: () => void
}

export default function StationDetailsTab({
  id,
  location,
  phone,
  email,
  stock,
  user,
  createdAt,
  updatedAt,
  fuelTypes,
  onViewAllFuels,
}: StationDetailsTabProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const openMapLink = (location: string) => {
    if (location.startsWith("http")) {
      window.open(location, "_blank")
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Main Details */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Station Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 shrink-0" />
                  <p className="text-gray-700 break-words">{location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                {phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500 shrink-0" />
                    <a href={`tel:${phone}`} className="text-gray-700 hover:text-blue-600">
                      {phone}
                    </a>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500 shrink-0" />
                    <a href={`mailto:${email}`} className="text-gray-700 hover:text-blue-600 break-words">
                      {email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={stock === "available" ? "default" : "secondary"}
                    className={stock === "available" ? "bg-green-500" : "bg-gray-500"}
                  >
                    {stock === "available" ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">ID: {user}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">{formatDate(createdAt)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">{formatDate(updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => openMapLink(location)}
              >
                <MapPin className="h-4 w-4" />
                Directions
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Info */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5" />
              Fuel Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fuelTypes.map((fuel) => (
                <div key={fuel._id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium capitalize">{fuel.fuelType.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">₹{fuel.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button className="w-full" variant="outline" onClick={onViewAllFuels}>
              View All Fuel Details
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Having trouble with your order or have questions about this fuel station?
              </p>
              {phone && (
                <Button variant="outline" className="w-full mb-2" asChild>
                  <a href={`tel:${phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Station
                  </a>
                </Button>
              )}
              {email && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={`mailto:${email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Station
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
