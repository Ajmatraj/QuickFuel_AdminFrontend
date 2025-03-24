"use client"

import { useState } from "react"
import DashboardLayout from "./components/DashboardLayout"
import OverviewCards from "./components/OverviewCards"
import DataCharts from "./components/DataCharts"
import DataTables from "./components/DataTables"
import DashboardWidgets from "./components/DashboardWidgets"

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <DashboardLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
        <div className="space-y-4">
          <OverviewCards />
          <DataCharts />
          <DataTables />
          <DashboardWidgets/>
        </div>
      </DashboardLayout>
    </div>
  )
}

