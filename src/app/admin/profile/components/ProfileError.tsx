import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ProfileErrorProps {
  error: string
}

export function ProfileError({ error }: ProfileErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Error Loading Profile</CardTitle>
          </div>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please try refreshing the page or logging in again.</p>
        </CardContent>
      </Card>
    </div>
  )
}

