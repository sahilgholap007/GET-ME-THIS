"use client"

import { Suspense } from "react"
import CreateRequest from "../../../dashboard/components/CreateRequest"

export default function CreateRequestPage() {
    return (
        <Suspense fallback={<div className="pt-8 flex items-center justify-center">Loading...</div>}>
            <div className="pt-8">
                <CreateRequest />
            </div>
        </Suspense>
    )
}
