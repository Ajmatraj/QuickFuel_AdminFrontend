import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Truck } from "lucide-react"
import type { UserProfile } from "@/app/types/user"

interface ServicesTabProps {
  user: UserProfile
}

export default function ServicesTab({ user }: ServicesTabProps) {
  if (user.role !== "fuelstation") {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Station Services</CardTitle>
        <CardDescription>Manage your fuel station services and availability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Station Details
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add information about your fuel station to help riders find you.
            </p>
            <Button>Update Station Details</Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Operating Hours
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set your station's operating hours so riders know when you're available.
            </p>
            <Button>Set Operating Hours</Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Fuel Types & Pricing
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage the types of fuel you offer and their current prices.
            </p>
            <Button>Manage Fuel Options</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

