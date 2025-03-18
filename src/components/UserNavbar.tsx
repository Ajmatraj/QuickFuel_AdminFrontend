"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Search,
  Menu,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react"
import { DarkModeToggle } from "./DarkModeToggle"
import { useRouter } from "next/navigation" // Use next/navigation for Next.js 13+
import Image from "next/image"

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState("Home")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const router = useRouter()
  const [userDetails, setUserDetails] = useState<any>(null)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  // Check login status on component mount
  useEffect(() => {
    // Only run on client side
    const checkLoginStatus = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken")
        console.log(token)
        setIsLoggedIn(!!token)

        // Get user details if logged in
        if (token) {
          const userDetailsString = localStorage.getItem("userDetails")
          if (userDetailsString) {
            try {
              setUserDetails(JSON.parse(userDetailsString))
            } catch (error) {
              console.error("Error parsing user details:", error)
            }
          }
        } else {
          setUserDetails(null)
        }
      }
    }

    checkLoginStatus()

    // Listen for storage changes
    window.addEventListener("storage", checkLoginStatus)
    return () => window.removeEventListener("storage", checkLoginStatus)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const navLinks = ["Home", "Services", "About", "Projects", "Skills", "Contacts"]

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("role")
    localStorage.removeItem("userDetails")
    setIsLoggedIn(false)
    router.push("/login") // Redirect user after logout
  }

  return (
    <nav
      className={`transition-all duration-300 ${
        isScrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-bold dark:text-white">QuickFuel</span>
            </Link>
          </div>

          {/* Desktop Navigation - Now visible from md breakpoint */}
          <div className="hidden md:flex items-center justify-center flex-1 ml-10">
            <div className="flex items-center space-x-6 lg:space-x-8">
              <Link
                key="home"
                href="/"
                className={`text-sm lg:text-base font-medium transition-all duration-200 relative group ${
                  activePage === "home"
                    ? "text-black dark:text-white"
                    : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                }`}
                onClick={() => setActivePage("home")}
              >
                Home
                <span
                  className={`absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 transform origin-left transition-transform duration-200 ${
                    activePage === "home" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>

              <Link
                key="about"
                href="about"
                className={`text-sm lg:text-base font-medium transition-all duration-200 relative group ${
                  activePage === "about"
                    ? "text-black dark:text-white"
                    : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                }`}
                onClick={() => setActivePage("about")}
              >
                About
                <span
                  className={`absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 transform origin-left transition-transform duration-200 ${
                    activePage === "about" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>

              <Link
                key="fuelstation"
                href="fuel"
                className={`text-sm lg:text-base font-medium transition-all duration-200 relative group ${
                  activePage === "fuelstation"
                    ? "text-black dark:text-white"
                    : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                }`}
                onClick={() => setActivePage("fuelstation")}
              >
                fuelstation
                <span
                  className={`absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 transform origin-left transition-transform duration-200 ${
                    activePage === "fuelstation" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>

              <div className="relative group">
                <button className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center transition-colors duration-200">
                  Pages
                  <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Social Icons */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {[Twitter, Facebook, Linkedin, Instagram].map((Icon, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200 hover:scale-110 transform"
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Search Icon */}
            <button className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200">
              <Search className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {/* Contact Button */}
            <Link
              href="/contact"
              className="bg-black dark:bg-white text-white dark:text-black px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 hover:scale-105 transform"
            >
              Contact Me
            </Link>

            {/* Conditionally Render Login or Profile */}
            {isLoggedIn === null ? null : isLoggedIn ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-yellow-400">
                    {userDetails?.profileImage ? (
                      <Image
                        src={userDetails.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium dark:text-white hidden lg:inline-block">
                    {userDetails?.name || userDetails?.email || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 dark:text-white" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {userDetails?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userDetails?.email || ""}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsProfileDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-black dark:bg-white text-white dark:text-black px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 hover:scale-105 transform"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <DarkModeToggle />
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed w-96 inset-y-0 right-0 bg-white dark:bg-gray-900 z-40 transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <span className="text-lg font-bold dark:text-white">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="px-4 py-6 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="space-y-4">
            <Link
              key="home"
              href="/"
              className={`block py-3 text-lg font-medium transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 ${
                activePage === "home"
                  ? "text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              }`}
              onClick={() => {
                setActivePage("home")
                setIsMenuOpen(false)
              }}
            >
              Home
            </Link>
          </div>
          {isLoggedIn && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400">
                  {userDetails?.profileImage ? (
                    <Image
                      src={userDetails.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userDetails?.name || "User"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    {userDetails?.email || ""}
                  </p>
                </div>
              </div>

              <Link
                href="/profile"
                className="block py-3 text-base font-medium transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5 mr-3" />
                My Profile
              </Link>
              <Link
                href="/settings"
                className="block py-3 text-base font-medium transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left py-3 text-base font-medium transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  )
}

export default UserNavbar

