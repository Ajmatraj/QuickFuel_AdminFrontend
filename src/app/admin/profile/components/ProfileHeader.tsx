"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import { type UserData, getInitials } from "../types"

interface ProfileHeaderProps {
  userData: UserData
  onEditClick: () => void
}

export function ProfileHeader({ userData, onEditClick }: ProfileHeaderProps) {
  return (
    <CardHeader className="pb-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-24 w-24 border-4 border-background">
          <AvatarImage src={userData.avatar} alt={userData.name} />
          <AvatarFallback className="text-2xl">{getInitials(userData.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <CardTitle className="text-2xl">{userData.name}</CardTitle>
            <Badge className="w-fit" variant={userData.status === "active" ? "default" : "secondary"}>
              {userData.status}
            </Badge>
          </div>
          <CardDescription className="mt-1">@{userData.username}</CardDescription>
          <Badge variant="outline" className="mt-2">
            {userData.role}
          </Badge>
        </div>

        {/* Edit Profile Button */}
        <Button variant="outline" size="sm" className="gap-1" onClick={onEditClick}>
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </CardHeader>
  )
}

