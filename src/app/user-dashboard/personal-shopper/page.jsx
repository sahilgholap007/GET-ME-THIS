"use client"

import { Suspense } from "react"
import MyRequests from "../../dashboard/components/MyRequests"

export default function PersonalShopperPage() {
    return (
        <Suspense fallback={<div className="pt-8 flex items-center justify-center">Loading...</div>}>
            <div className="pt-8">
                <MyRequests />
            </div>
        </Suspense>
    )
}