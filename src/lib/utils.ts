import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Helper function for badge variants
export function getBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "success"
    case "inactive":
      return "secondary"
    case "new":
      return "default"
    case "maintenance":
      return "warning"
    default:
      return "outline"
  }
}