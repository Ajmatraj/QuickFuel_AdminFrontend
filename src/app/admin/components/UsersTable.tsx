"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBadgeVariant } from "@/lib/utils"
import { AlertCircle, AlertTriangle, Eye, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

// Define the types based on your API response
interface User {
  _id: string
  username: string
  email: string
  name: string
  avatar: string
  role: string
  createdAt: string
  updatedAt: string
  __v: number
  orders: any[] // You might want to define a more specific type for orders
  ratingGiven: any[]
  ratingRecived: any[]
  status: string
}

interface ApiResponse {
  data: User[]
  message: string
  success: boolean
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/v1/users/allUsers")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.success) {
        setUsers(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch users")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get user's first initial for avatar fallback
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U"
  }

  // Format status to match expected format (lowercase)
  const formatStatus = (status: string) => {
    return status ? status.toLowerCase() : "unknown"
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
  }

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/deleteUserById/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Remove the deleted user from the state
        setUsers(users.filter((user) => user._id !== userId))
        console.log(`Successfully deleted user with ID: ${userId}`)
      } else {
        throw new Error(data.message || "Failed to delete user")
      }
    } catch (err) {
      console.error("Error deleting user:", err)
      alert(`Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading users...</div>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2 h-5 w-5" />
        <span>Error loading users: {error}</span>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || `/placeholder.svg?height=32&width=32`} alt={user.name} />
                    <AvatarFallback>{getInitial(user.name)}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Badge
                  variant={getBadgeVariant(formatStatus(user.status))}
                  className={
                    formatStatus(user.status) === "active"
                      ? "font-bold bg-green-100 text-green-800 border-green-500 hover:bg-green-200"
                      : "font-medium bg-red-100 text-red-800 border-red-500 hover:bg-red-200"
                  }
                >
                  {formatStatus(user.status)}
                </Badge>
              </TableCell>
              <TableCell>{user.orders ? user.orders.length : 0}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(user)}
                        className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">View</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>User Details</SheetTitle>
                        <SheetDescription>Detailed information about {user.name}</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        <div className="flex justify-center mb-6">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={user.avatar || `/placeholder.svg?height=96&width=96`} alt={user.name} />
                            <AvatarFallback className="text-3xl">{getInitial(user.name)}</AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="grid gap-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                            <p className="text-base">{user.name}</p>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Username</h4>
                            <p className="text-base">{user.username}</p>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                            <p className="text-base">{user.email}</p>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                            <p className="text-base capitalize">{user.role}</p>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                            <Badge
                              variant={getBadgeVariant(formatStatus(user.status))}
                              className={
                                formatStatus(user.status) === "active"
                                  ? "font-bold bg-green-100 text-green-800 border-green-500 hover:bg-green-200"
                                  : "font-medium bg-red-100 text-red-800 border-red-500 hover:bg-red-200"
                              }
                            >
                              {formatStatus(user.status)}
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
                            <p className="text-base">{formatDate(user.createdAt)}</p>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                            <p className="text-base">{formatDate(user.updatedAt)}</p>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Orders</h4>
                            <p className="text-base">{user.orders ? user.orders.length : 0} orders</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <SheetClose asChild>
                          <Button className="w-full">Close</Button>
                        </SheetClose>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Confirm Deletion
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the user "{user.name}"? This action cannot be undone and will
                          remove all associated data.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={() => handleDelete(user._id)}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

