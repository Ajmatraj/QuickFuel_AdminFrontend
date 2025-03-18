"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { type UserData, getInitials } from "../types"

interface EditProfileDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userData: UserData
  formData: {
    name: string
    username: string
    email: string
    avatar: string
  }
  isSubmitting: boolean
  avatarPreview: string | null
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
}

export function EditProfileDialog({
  isOpen,
  onOpenChange,
  userData,
  formData,
  isSubmitting,
  avatarPreview,
  onInputChange,
  onAvatarChange,
  onSubmit,
}: EditProfileDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your profile information here.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-2 mb-2">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={avatarPreview || userData.avatar} alt={userData.name} />
                <AvatarFallback className="text-2xl">{getInitials(userData.name)}</AvatarFallback>
              </Avatar>
              <div className="relative">
                <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                <Label
                  htmlFor="avatar"
                  className="flex items-center gap-1 cursor-pointer text-sm text-primary hover:underline"
                >
                  <Upload className="h-3 w-3" />
                  Change Photo
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={onInputChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={onInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

