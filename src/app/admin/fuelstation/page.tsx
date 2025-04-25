"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import RegisterFuelStationPage from "./components/FuelStationRegistration"
import FuelStationList from "./components/FuelStationList"

interface AuthUser {
  accessToken: string | null
  refreshToken: string | null
  userDetails: UserDetails | null
  role: string | null
}

interface UserDetails {
  id: string
  name: string
  email: string
  avatar: string | null
}

export default function FuelStationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

  // Load user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const message = new URLSearchParams(window.location.search).get("message")
      if (message) {
        toast.success(message)
      }

      const storedUser = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        userDetails: localStorage.getItem("userDetails"),
        role: localStorage.getItem("role"),
      }

      const parsedUserDetails = storedUser.userDetails ? JSON.parse(storedUser.userDetails) : null

      if (storedUser.accessToken && parsedUserDetails) {
        setUser({
          ...storedUser,
          userDetails: parsedUserDetails,
        })
      } else {
        toast.error("You must be logged in to view fuel stations")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }

      setIsLoading(false)
    }
  }, [router])

  const refreshList = () => {
    setRefreshTrigger((prev) => prev + 1)
    setIsAddDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (!user || !user.userDetails) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to view fuel stations</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              <AlertDescription>Login to access fuel station management</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fuel Station Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Fuel Station
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Register New Fuel Station</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <RegisterFuelStationPage onSuccess={refreshList} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <FuelStationList user={user} refreshTrigger={refreshTrigger} onRefreshNeeded={refreshList} />
    </main>
  )
}
