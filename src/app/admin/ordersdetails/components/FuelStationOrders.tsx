"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Calendar,
  DollarSign,
  Droplet,
} from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export function FuelStationOrders({ orders }) {
  const [sortField, setSortField] = useState("orderDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const ordersPerPage = 5

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === "orderDate") {
      return sortDirection === "asc"
        ? new Date(a.orderDate) - new Date(b.orderDate)
        : new Date(b.orderDate) - new Date(a.orderDate)
    }

    if (sortField === "totalCost") {
      return sortDirection === "asc" ? a.totalCost - b.totalCost : b.totalCost - a.totalCost
    }

    if (sortField === "quantity") {
      return sortDirection === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity
    }

    // Default string comparison for other fields
    const aValue = a[sortField]?.toString().toLowerCase() || ""
    const bValue = b[sortField]?.toString().toLowerCase() || ""

    return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
  })

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage)

  const renderSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="mr-1 h-3 w-3" /> Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Station Orders</CardTitle>
        <CardDescription>Manage and track all your fuel delivery orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or order ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-[180px]">
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium flex items-center"
                    onClick={() => handleSort("_id")}
                  >
                    Order ID {renderSortIcon("_id")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium flex items-center"
                    onClick={() => handleSort("user.name")}
                  >
                    Customer {renderSortIcon("user.name")}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium flex items-center"
                    onClick={() => handleSort("fuelType")}
                  >
                    Fuel Type {renderSortIcon("fuelType")}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium flex items-center"
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity {renderSortIcon("quantity")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium flex items-center"
                    onClick={() => handleSort("totalCost")}
                  >
                    Total {renderSortIcon("totalCost")}
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium flex items-center"
                    onClick={() => handleSort("orderDate")}
                  >
                    Date {renderSortIcon("orderDate")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                currentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.user.name}</div>
                        <div className="text-sm text-muted-foreground hidden md:block">{order.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.fuelType}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.quantity}L</TableCell>
                    <TableCell>${order.totalCost.toFixed(2)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8" onClick={() => viewOrderDetails(order)}>
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                              Complete information about order #{order._id.substring(0, 8)}...
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid gap-6 py-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold">Order Information</h3>
                              {getStatusBadge(order.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Order ID</p>
                                <p className="font-medium">{order._id}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Order Date</p>
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <p className="font-medium">{new Date(order.orderDate).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{order.user.name}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{order.user.email}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{order.phone}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Delivery Address</p>
                                  <div className="flex items-start">
                                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                                    <p>{order.deliveryAddress.address}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="text-lg font-semibold mb-3">Order Details</h3>
                              <div className="rounded-md border p-4">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex items-center">
                                    <Droplet className="mr-2 h-5 w-5 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">{order.fuelType}</p>
                                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{order.quantity}L</p>
                                    <p className="text-sm text-muted-foreground">Quantity</p>
                                  </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="flex justify-between items-center">
                                  <p className="font-medium">Total Cost</p>
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-xl font-bold">{order.totalCost.toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {order.notes && (
                              <>
                                <Separator />
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                                  <p className="text-muted-foreground">{order.notes}</p>
                                </div>
                              </>
                            )}
                          </div>

                          <DialogFooter>
                            {order.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Order
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700">
                                  <Truck className="mr-2 h-4 w-4" />
                                  Mark as Delivered
                                </Button>
                              </div>
                            )}
                            {order.status === "completed" && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200 px-3 py-1"
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Order Completed
                              </Badge>
                            )}
                            {order.status === "cancelled" && (
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 px-3 py-1">
                                <XCircle className="mr-2 h-4 w-4" /> Order Cancelled
                              </Badge>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, sortedOrders.length)} of {sortedOrders.length}{" "}
              orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

