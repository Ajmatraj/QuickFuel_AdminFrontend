import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { UserProfile } from "@/app/types/user"

interface RatingsTabProps {
  user: UserProfile
}

export default function RatingsTab({ user }: RatingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ratings & Reviews</CardTitle>
        <CardDescription>
          {user.role === "fuelstation"
            ? "See what riders are saying about your station"
            : "See your ratings and reviews for fuel stations"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              Ratings Received
            </h3>
            {user.ratingRecived && user.ratingRecived.length > 0 ? (
              <div className="space-y-4">
                {/* Ratings received would go here */}
                <p>Ratings you've received will be displayed here.</p>
              </div>
            ) : (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">You haven't received any ratings yet.</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              Ratings Given
            </h3>
            {user.ratingGiven && user.ratingGiven.length > 0 ? (
              <div className="space-y-4">
                {/* Ratings given would go here */}
                <p>Ratings you've given will be displayed here.</p>
              </div>
            ) : (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">You haven't given any ratings yet.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

