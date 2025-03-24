"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, User, Settings, LogOut, Home, BarChart3, Truck, Users, FileText, Moon, Sun, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { toast } from "react-toastify"

import React from 'react';

interface DashboardHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleMobileSidebar: () => void;
}


const DashboardHeader = ({ isDarkMode, toggleDarkMode, toggleMobileSidebar }: DashboardHeaderProps) => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [fuelStations, setFuelStations] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      const userDataString = localStorage.getItem("userDetails")

      if (!accessToken || !userDataString) {
        toast.error("You are not authenticated")
        setTimeout(() => router.push("/login"), 500)
        return
      }

      try {
        const userData = JSON.parse(userDataString)
        setUser(userData)

        // Fetch user data from API
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/userbyid/${userData.id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })

          if (response.data?.data) {
            // Update user data with latest from server
            const updatedUserData = response.data.data
            setUser((prevUser) => ({
              ...prevUser,
              name: updatedUserData.name || prevUser.name,
              email: updatedUserData.email || prevUser.email,
              role: updatedUserData.role || prevUser.role,
              avatar: updatedUserData.avatar || prevUser.avatar,
            }))

            // Save updated user data to localStorage
            localStorage.setItem(
              "userDetails",
              JSON.stringify({
                ...userData,
                name: updatedUserData.name || userData.name,
                email: updatedUserData.email || userData.email,
                role: updatedUserData.role || userData.role,
                avatar: updatedUserData.avatar || userData.avatar,
              }),
            )

            // Fetch fuel stations if needed
            if (userData.role === "fuelstation") {
              try {
                const stationsResponse = await axios.get(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/fuelstations/user/${userData.id}`,
                  { headers: { Authorization: `Bearer ${accessToken}` } },
                )

                if (stationsResponse.data?.data) {
                  setFuelStations(stationsResponse.data.data)
                } else {
                  toast.warning("No fuel stations found")
                }
              } catch (error) {
                console.error("Failed to fetch fuel stations:", error)
                toast.error("Failed to fetch fuel stations")
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error)
          toast.error("Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        toast.error("Error parsing user data")
        setTimeout(() => router.push("/login"), 500)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userDetails")
    toast.success("Logged out successfully!")
    router.push("/login")
  }

  const navigateTo = (path) => {
    router.push(path)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-16 border-b bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader className="pb-4">
              <SheetTitle>Dashboard</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start gap-2" onClick={() => navigateTo("/dashboard")}>
                <Home className="h-4 w-4" />
                Home
              </Button>

              {user?.role === "admin" && (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => navigateTo("/dashboard/users")}
                  >
                    <Users className="h-4 w-4" />
                    Users
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => navigateTo("/dashboard/fuel-stations")}
                  >
                    <Truck className="h-4 w-4" />
                    Fuel Stations
                  </Button>
                </>
              )}

              {user?.role === "fuelstation" && (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => navigateTo("/dashboard/my-station")}
                  >
                    <Truck className="h-4 w-4" />
                    My Station
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => navigateTo("/dashboard/orders")}
                  >
                    <FileText className="h-4 w-4" />
                    Orders
                  </Button>
                </>
              )}

              {user?.role === "user" && (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => navigateTo("/dashboard/my-orders")}
                  >
                    <FileText className="h-4 w-4" />
                    My Orders
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => navigateTo("/dashboard/analytics")}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>

              <Separator className="my-2" />

              <Button onClick={()=>{router.push("admin/profile/")}} variant="ghost" className="justify-start gap-2" onClick={() => navigateTo("/dashboard/profile")}>
                <User className="h-4 w-4" />
                Profile
              </Button>

              <Button variant="ghost" className="justify-start gap-2" onClick={() => navigateTo("/dashboard/settings")}>
                <Settings className="h-4 w-4" />
                Settings
              </Button>

              <Button variant="ghost" className="justify-start gap-2" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                className="justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="hidden md:block text-xl font-semibold">Fuel Delivery Dashboard</div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={toggleTheme} className="hidden md:flex">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p>{user?.name || "User"}</p>
                <p className="text-xs font-normal text-muted-foreground">{user?.email || ""}</p>
                {user?.role && (
                  <Badge variant="outline" className="w-fit mt-1">
                    {user.role}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigateTo("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default DashboardHeader

