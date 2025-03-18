import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Star } from "lucide-react"
import { type UserData, getInitials } from "../types"

interface ProfileActivityTabProps {
  userData: UserData
}

export function ProfileActivityTab({ userData }: ProfileActivityTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent orders and ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Orders</h3>
            <Separator className="my-2" />
            {userData.orders.length > 0 ? (
              <div className="space-y-2">
                {userData.orders.map((order, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    <p>Order #{index + 1}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No orders yet</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium">Ratings Given</h3>
            <Separator className="my-2" />
            {userData.ratingGiven.length > 0 ? (
              <div className="space-y-2">
                {userData.ratingGiven.map((rating, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <p>Rating #{index + 1}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No ratings given yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

