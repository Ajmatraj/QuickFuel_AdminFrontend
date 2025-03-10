import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./ThemeProvider";
import UserNavbar from "@/components/UserNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KhatraEvents - Amazing Events in Nepal",
  description: "Discover and book amazing events in Nepal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        {/* <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" /> */}
      <body className={inter.className}>
       {/* Wrap both ThemeProvider and AuthProvider to ensure both context and theme are applied globally */}
         <ThemeProvider attribute="class">
           <UserNavbar />
            {/* Navbar component that will be displayed on all pages */}
           <main className="container mx-auto">
             {children} {/* The content of each page will be injected here */}
           </main>
   </ThemeProvider>
      </body>
      {/* <script src="https://unpkg.com/aos@next/dist/aos.js"></script> */}
    </html>
  );
}