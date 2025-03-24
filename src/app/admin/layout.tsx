'use client'
import type React from "react"
import "../globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "../ThemeProvider"
import DashboardSidebar from "./components/DashboardSidebar"
import DashboardHeader from "./components/DashboardHeader"
import { useState } from "react"

// Importing Inter font from Google
const inter = Inter({ subsets: ["latin"] })


// Defining the props type for RootLayout
interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: DashboardLayoutProps) {
  // Dark mode state and handler
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev)

  // Mobile sidebar state and handler
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false)
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar Component */}
        <DashboardSidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header Component */}
        <DashboardHeader
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          toggleMobileSidebar={toggleMobileSidebar}
        />

        {/* ThemeProvider for Dark Mode and System Default Theme */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <main className="flex-1 overflow-auto p-4 md:p-6"> {children}
          </main>
        </ThemeProvider>
        </div>
        </div>
      </body>
    </html>
  )
}
