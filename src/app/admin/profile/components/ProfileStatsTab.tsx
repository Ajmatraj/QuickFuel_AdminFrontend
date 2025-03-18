import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type UserData, formatDate, getInitials } from "../types"

interface ProfileStatsTabProps {
  userData: UserData
}

export function ProfileStatsTab({ userData }: ProfileStatsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
        <CardDescription>Overview of your account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-muted rounded-lg p-4 text-center">
            <h3 className="text-3xl font-bold">{userData.orders.length}</h3>
            <p className="text-muted-foreground">Orders</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <h3 className="text-3xl font-bold">{userData.ratingGiven.length}</h3>
            <p className="text-muted-foreground">Ratings Given</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <h3 className="text-3xl font-bold">{userData.ratingRecived.length}</h3>
            <p className="text-muted-foreground">Ratings Received</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Account active since {formatDate(userData.createdAt)}</p>
      </CardFooter>
    </Card>
  )
}

