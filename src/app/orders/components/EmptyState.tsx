"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function EmptyState() {
  const router = useRouter()

  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium mb-2">Order not found</h3>
      <p className="text-muted-foreground mb-6">
        The order you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  )
}

