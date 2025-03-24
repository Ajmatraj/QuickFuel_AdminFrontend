// "use client"

// import { type ReactNode, useState } from "react"
// import DashboardSidebar from "./DashboardSidebar"
// import DashboardHeader from "./DashboardHeader"

// interface DashboardLayoutProps {
//   children: ReactNode
//   isDarkMode: boolean
//   toggleDarkMode: () => void
// }

// export default function DashboardLayout({ children, isDarkMode, toggleDarkMode }: DashboardLayoutProps) {
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

//   const toggleMobileSidebar = () => {
//     setIsMobileSidebarOpen(!isMobileSidebarOpen)
//   }

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* <DashboardSidebar isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} /> */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* <DashboardHeader
//           isDarkMode={isDarkMode}
//           toggleDarkMode={toggleDarkMode}
//           toggleMobileSidebar={toggleMobileSidebar}
//         /> */}
//         <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
//       </div>
//     </div>
//   )
// }

