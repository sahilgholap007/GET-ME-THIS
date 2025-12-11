"use client"

import { useEffect, useState } from "react"
import Mailbox from "../../dashboard/components/Mailbox"

export default function MailboxPage() {
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        // Get userId from localStorage when component mounts
        const storedUserId = localStorage.getItem("userId")
        if (storedUserId) {
            setUserId(Number.parseInt(storedUserId))
        }
    }, [])

    if (userId === null) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-8">
            <Mailbox userId={userId} />
        </div>
    )
}