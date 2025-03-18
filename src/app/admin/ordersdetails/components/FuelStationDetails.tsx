"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Droplet, DollarSign, Edit } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function FuelStationDetails({ fuelStation }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedStation, setEditedStation] = useState({ ...fuelStation })

  // Mock function for updating station details
  const handleUpdateStation = () => {
    // In a real app, you would make an API call here
    console.log("Updated station details:", editedStation)
    setIsEditDialogOpen(false)
    // You would then refetch the station details or update the state
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Station Information</CardTitle>
          <CardDescription>Details about your fuel station</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <MapPin className="mr-2 h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{fuelStation.address}</p>
              {fuelStation.city && fuelStation.state && (
                <p className="text-sm text-muted-foreground">
                  {fuelStation.city}, {fuelStation.state}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Contact Number</p>
              <p className="text-sm text-muted-foreground">{fuelStation.phone || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Email Address</p>
              <p className="text-sm text-muted-foreground">{fuelStation.email || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Operating Hours</p>
              <p className="text-sm text-muted-foreground">{fuelStation.operatingHours || "24/7"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" /> Edit Station Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Station Details</DialogTitle>
                <DialogDescription>Make changes to your fuel station information here.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={editedStation.address || ""}
                    onChange={(e) => setEditedStation({ ...editedStation, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editedStation.city || ""}
                      onChange={(e) => setEditedStation({ ...editedStation, city: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editedStation.state || ""}
                      onChange={(e) => setEditedStation({ ...editedStation, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedStation.phone || ""}
                    onChange={(e) => setEditedStation({ ...editedStation, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={editedStation.email || ""}
                    onChange={(e) => setEditedStation({ ...editedStation, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Input
                    id="hours"
                    value={editedStation.operatingHours || ""}
                    onChange={(e) => setEditedStation({ ...editedStation, operatingHours: e.target.value })}
                    placeholder="e.g. 8:00 AM - 8:00 PM"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStation}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fuel Inventory</CardTitle>
          <CardDescription>Available fuel types and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fuelStation.fuelTypes ? (
            fuelStation.fuelTypes.map((fuel, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <Droplet className="mr-2 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{fuel.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {fuel.stock || "Available"}
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                        Active
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-bold">{fuel.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">/liter</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No fuel types available. Add fuel types to your inventory.
            </div>
          )}

          {!fuelStation.fuelTypes || fuelStation.fuelTypes.length === 0 ? null : (
            <>
              <Separator />
              <div className="flex justify-between items-center">
                <p className="font-medium">Total Fuel Types</p>
                <p className="font-bold">{fuelStation.fuelTypes?.length || 0}</p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Edit className="mr-2 h-4 w-4" /> Manage Inventory
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

