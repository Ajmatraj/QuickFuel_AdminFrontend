import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Mail, User } from "lucide-react"
import { type UserData, formatDate, getInitials } from "../types"

interface ProfileDetailsTabProps {
  userData: UserData
}

export function ProfileDetailsTab({ userData }: ProfileDetailsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Email</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>{userData.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Username</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>{userData.username}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Account Created</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>{formatDate(userData.createdAt)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>{formatDate(userData.updatedAt)}</p>
        </CardContent>
      </Card>
    </div>
  )
}

