"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import Navbar from "./components/Navbar"
import FooterComponent from "./components/FooterComponent"
import { initializeLocationDetection } from "./utils/geolocation"

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  // Initialize location detection when app loads
  useEffect(() => {
    initializeLocationDetection()
  }, [])

  return (
    <>
      <Navbar />
      {children}
      <FooterComponent />
    </>
  )
}
