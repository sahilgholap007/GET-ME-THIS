"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardRedirectPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to trending page as default dashboard view
        router.replace("/user-dashboard/trending")
    }, [router])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to your dashboard...</p>
            </div>
        </div>
    )
}
