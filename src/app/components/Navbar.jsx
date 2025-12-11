"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { User, ChevronDown, LogOut, TrendingUp, FileCheck, CreditCard, UserCheck, MapPin, PlusCircle, List } from "lucide-react"

const Navbar = ({ logout }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const profileRef = useRef(null)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const checkUserAuth = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken")

                if (accessToken) {
                    // Check if token is valid by making an API call or decode JWT
                    // For now, just check if token exists
                    setUser({
                        loggedIn: true,
                        email: localStorage.getItem("userEmail") || "",
                        firstName: localStorage.getItem("userFirstName") || "",
                        lastName: localStorage.getItem("userLastName") || "",
                        username: localStorage.getItem("userUsername") || "",
                        uniqueId: localStorage.getItem("userSuiteNumber") || "",
                        userId: localStorage.getItem("userId") || null,
                    })
                } else {
                    setUser({ loggedIn: false })
                }
            } catch (error) {
                console.error("Error checking user auth:", error)
                setUser({ loggedIn: false })
            } finally {
                setIsLoading(false)
            }
        }

        checkUserAuth()

        // Listen for storage changes
        window.addEventListener("storage", checkUserAuth)
        // Listen for auth changes
        window.addEventListener("authChange", checkUserAuth)

        return () => {
            window.removeEventListener("storage", checkUserAuth)
            window.removeEventListener("authChange", checkUserAuth)
        }
    }, [])
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleProfile = () => {
        setIsProfileOpen((prev) => !prev)
    }

    const handleLogout = async () => {
        try {
            // Clear localStorage
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("userEmail")

            setUser({ loggedIn: false })
            setIsProfileOpen(false)

            if (logout) logout()

            alert("Logged out successfully!")

            // Dispatch custom event to update navbar
            window.dispatchEvent(new Event('authChange'))

            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = "/login"
            }, 1000)
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const profileMenuItems = [
        // Features Section
        { label: "What's Trending Worldwide", href: "/user-dashboard/trending", icon: TrendingUp, section: "Features" },
        { label: "My Requests", href: "/user-dashboard/personal-shopper", icon: List, section: "Features" },
        { label: "Create Request", href: "/user-dashboard/personal-shopper/create-request", icon: PlusCircle, section: "Features" },

        { label: "Compliance", href: "/user-dashboard/compliance", icon: FileCheck, section: "Features" },

        // Account Section  
        { label: "My Account", href: "/user-dashboard/my-account", icon: UserCheck, section: "My Account" },
    ]

    if (isLoading) return null // Loading state

    return (
        <nav
            className={`fixed w-full top-0 z-[60] transition-all duration-300 ${scrolled
                ? "bg-black/80 backdrop-blur-md shadow-sm border-b border-white/20 py-3"
                : "bg-white/80 backdrop-blur-md border-b border-black/10 py-4"
                }`}
        >
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: Logo */}
                <div className="flex justify-start flex-1">
                    <a href="/" className="transition-opacity duration-300 hover:opacity-80">
                        <span
                            className={`text-base sm:text-lg md:text-xl lg:text-2xl tracking-wide font-monument-ultrabold transition-all duration-300 hover:scale-105 ${scrolled ? "text-white" : "text-black"}`}
                        >
                            GET
                            <span className={`${scrolled ? "text-black" : "text-white"}`} style={{ WebkitTextStroke: scrolled ? "1px white" : "1px black" }}>
                                ME
                            </span>
                            THI
                            <span className="relative">
                                S
                            </span>
                        </span>
                    </a>
                </div>

                {/* Right: Profile/Auth Section */}
                <div className="flex justify-end items-center space-x-4 flex-1">
                    {user?.loggedIn ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={toggleProfile}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${scrolled ? "text-white hover:bg-white/10" : "text-black hover:bg-black/10"
                                    }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${scrolled ? "border-white" : "border-black"
                                        }`}
                                >
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="hidden sm:block text-sm font-medium">{user.firstName}</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-white/20 overflow-hidden">
                                    {/* Profile Header */}
                                    <div className="px-4 py-3 border-b border-gray-100/50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center">
                                                <User className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-black">
                                                    {user.firstName} {user.lastName} {user.uniqueId && `(${user.uniqueId})`}
                                                </div>
                                                <div className="text-sm text-gray-600">{user.email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-1 max-h-80 overflow-y-auto">
                                        {["Features", "My Account", "Track Order"].map((section) => {
                                            const sectionItems = profileMenuItems.filter(item => item.section === section)
                                            return (
                                                <div key={section}>
                                                    <div className="px-4 py-2">
                                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            {section}
                                                        </h3>
                                                    </div>
                                                    {sectionItems.map((item) => (
                                                        <button
                                                            key={item.href}
                                                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-black/5 w-full text-left transition-colors duration-200"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                setIsProfileOpen(false)
                                                                window.location.href = item.href
                                                            }}
                                                        >
                                                            <item.icon className="w-4 h-4" />
                                                            <span className="text-sm">{item.label}</span>
                                                        </button>
                                                    ))}
                                                    {section !== "Track Order" && (
                                                        <div className="border-b border-gray-100/50 my-1"></div>
                                                    )}
                                                </div>
                                            )
                                        })}

                                        <div className="border-t border-gray-100/50 mt-1 pt-1">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    handleLogout()
                                                }}
                                                className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50/50 w-full text-left transition-colors duration-200"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="text-sm">Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Auth Buttons */}
                            <div className="hidden sm:flex items-center space-x-3">
                                <a
                                    href="/login"
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${scrolled
                                        ? "text-white border border-white/30 hover:bg-white/10 hover:border-white"
                                        : "text-black border border-black/30 hover:bg-black/10 hover:border-black"
                                        }`}
                                >
                                    LOGIN
                                </a>
                                <a
                                    href="/register"
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${scrolled
                                        ? "bg-white/90 text-black hover:bg-white backdrop-blur-sm"
                                        : "bg-black/90 text-white hover:bg-black backdrop-blur-sm"
                                        }`}
                                >
                                    SIGN UP
                                </a>
                            </div>

                            {/* Mobile Auth Button */}
                            <a href="/login" className="sm:hidden">
                                <div
                                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors duration-300 ${scrolled
                                        ? "border-white/30 text-white hover:bg-white/10 hover:border-white"
                                        : "border-black/30 text-black hover:bg-black/10 hover:border-black"
                                        }`}
                                >
                                    <User className="w-4 h-4" />
                                </div>
                            </a>
                        </>
                    )}
                </div>
            </div>

        </nav>
    )
}

export default Navbar
