"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

const ResetSuccess = () => {
    const router = useRouter()

    useEffect(() => {
        // Optionally auto-redirect to login after 5 seconds
        const timer = setTimeout(() => {
            router.push("/login")
        }, 5000)
        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28 font-geist-normal relative overflow-hidden">
            {/* Animated Background Icons */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {Array.from({ length: 10 }, (_, i) => {
                    const Icon = CheckCircle
                    const size = 20 + Math.random() * 20
                    return (
                        <motion.div
                            key={i}
                            className="absolute text-green-500 opacity-20 drop-shadow-lg"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-10%`,
                            }}
                            animate={{
                                y: '120vh',
                                rotate: Math.random() * 360,
                            }}
                            transition={{
                                duration: 15 + Math.random() * 10,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 5,
                            }}
                        >
                            <Icon size={size} />
                        </motion.div>
                    )
                })}
            </div>

            {/* Main Container */}
            <motion.div
                className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 relative z-10 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl sm:text-3xl font-monument-regular text-gray-900 uppercase tracking-wider leading-tight mb-4">
                        Password Reset Successful
                    </h2>
                    <p className="text-gray-600 text-sm font-geist-normal">
                        Your password has been updated successfully. You can now log in using your new password.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a href="/login" className="w-full sm:w-auto inline-block px-6 py-3 rounded-xl bg-black text-white font-monument-regular tracking-wider hover:bg-gray-800 transition-colors">
                        Go to Login
                    </a>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full sm:w-auto inline-block px-6 py-3 rounded-xl bg-gray-200 font-geist-normal hover:bg-gray-300 transition-colors"
                    >
                        Continue to Home
                    </button>
                </div>
                <p className="mt-4 text-sm text-gray-500 font-geist-normal">
                    You will be redirected to the login page in 5 seconds.
                </p>
            </motion.div>
        </div>
    )
}

export default ResetSuccess
