import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileEmpty() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>No Profile Data</CardTitle>
          <CardDescription>We couldn't find your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please try logging in again.</p>
        </CardContent>
      </Card>
    </div>
  )
}

