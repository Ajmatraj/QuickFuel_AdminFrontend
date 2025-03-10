/** @format */
"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authChecker";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
 
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);


  return (
    <div className="flex w-full h-screen bg-gray-100">
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="mt-4">{children}</div>
        </div>
      </main>
    </div>
  </div>
  );
}