import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Truck, Clock } from "lucide-react"
import type { UserProfile } from "@/app/types/user"

interface ProfileHeaderProps {
  user: UserProfile
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-primary/20">
          <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} alt={user.name} />
          <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        {/* Active status indicator */}
        <div
          className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}`}
        ></div>
      </div>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <Badge
            className={`w-fit capitalize ${user.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            variant={user.status === "Active" ? "default" : "outline"}
          >
            {user.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>@{user.username}</span>
        </div>

        <div className="flex flex-wrap gap-3 mt-3">
          <Badge variant="secondary" className="capitalize flex items-center gap-1">
            {user.role === "fuelstation" ? <MapPin className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
            {user.role}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Joined {formatDate(user.createdAt)}
          </Badge>
        </div>
      </div>
    </div>
  )
}
