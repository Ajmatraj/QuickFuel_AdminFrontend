"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div className="container mx-auto px-6 py-8">
              <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
              <div className="mt-4">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </body>
  );
}
