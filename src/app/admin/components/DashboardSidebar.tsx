"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  BarChart3,
  FileText,
  FileCog,
  FuelIcon as GasPump,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardSidebarProps {
  isMobileSidebarOpen: boolean
  setIsMobileSidebarOpen: (open: boolean) => void
}

export default function DashboardSidebar({ isMobileSidebarOpen, setIsMobileSidebarOpen }: DashboardSidebarProps) {
  const router = useRouter();

  // Shared sidebar content component to avoid duplication
  const SidebarContent = () => (
    <>
      <div className="p-4 border-b flex items-center gap-2">
        <GasPump className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">QuickFuel</h1>
      </div>
      <nav className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          <Button onClick={()=>{router.push("/admin")}} variant="ghost" className="w-full justify-start gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" onClick={()=>{router.push("/admin/users")}} className="w-full justify-start gap-2">
            <Users className="h-4 w-4" />
            Users
          </Button>
          <Button onClick={()=>{router.push("/admin/fuelstation")}} variant="ghost" className="w-full justify-start gap-2">
            <GasPump className="h-4 w-4" />
            Fuel Stations
          </Button>
          <Button onClick={()=>{router.push("/admin/ordersdetails")}} variant="ghost" className="w-full justify-start gap-2">
            <FileText className="h-4 w-4" />
            Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FileCog className="h-4 w-4" />
            Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@quickfuel.com</p>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

