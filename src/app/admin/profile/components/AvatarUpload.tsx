"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload } from "lucide-react"
import { getInitials } from "../types"

interface AvatarUploadProps {
  currentAvatar: string
  name: string
  previewUrl: string | null
  error: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  size?: number
}

export function AvatarUpload({ currentAvatar, name, previewUrl, error, onChange, size = 24 }: AvatarUploadProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className={`h-${size} w-${size} border-4 border-background`}>
        <AvatarImage src={previewUrl || currentAvatar} alt={name} />
        <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="relative">
        <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={onChange} />
        <Label htmlFor="avatar" className="flex items-center gap-1 cursor-pointer text-sm text-primary hover:underline">
          <Upload className="h-3 w-3" />
          Change Photo
        </Label>
      </div>
      {error && (
        <div className="text-destructive text-sm flex items-center gap-1 mt-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      <div className="text-xs text-muted-foreground mt-1">Supported formats: JPEG, PNG, GIF, WEBP (max 5MB)</div>
    </div>
  )
}

