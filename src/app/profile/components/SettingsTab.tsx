import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, User, Truck, AlertCircle } from "lucide-react"
import type { UserProfile } from "@/app/types/user"

interface SettingsTabProps {
  user: UserProfile
}

export default function SettingsTab({ user }: SettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2" />
              Security
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Update your password and security settings.</p>
            <Button>Change Password</Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Picture
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Update your profile picture.</p>
            <Button>Upload New Picture</Button>
          </div>

          {user.role === "rider" && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Vehicle Information
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add or update your vehicle information to get better fuel recommendations.
              </p>
              <Button>Manage Vehicles</Button>
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Actions here can't be undone. Be careful!</p>
            <Button variant="destructive">Deactivate Account</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

