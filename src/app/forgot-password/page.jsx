"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../utils/axiosInstance"
import { Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"

const RequestOTP = () => {
    const [email, setEmail] = useState("")
    // Pre-fill email from query param if present
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search)
            const pre = params.get("email")
            if (pre) setEmail(pre)
        } catch (e) {
            // ignore on SSR or unexpected URL
        }
    }, [])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await axiosInstance.post("/api/v1/users/password-reset/request/", { email })
            toast.success("Password reset OTP sent to your email")
            router.push(`/reset-password?email=${encodeURIComponent(email)}`)
        } catch (err) {
            console.error("Request OTP failed:", err)
            if (err.response && err.response.status === 429) {
                setError("Too many requests. Please try again later.")
                toast.error("Too many requests. Please try again later.")
            } else if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail)
                toast.error(err.response.data.detail)
            } else {
                setError("Failed to send OTP. Please try again.")
                toast.error("Failed to send OTP. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28 font-geist-normal relative overflow-hidden">
            {/* Animated Background Icons */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {Array.from({ length: 10 }, (_, i) => {
                    const Icon = Mail
                    const size = 20 + Math.random() * 20
                    return (
                        <motion.div
                            key={i}
                            className="absolute text-slate-500 opacity-20 drop-shadow-lg"
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

            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="mt-4"
                toastClassName="text-sm"
            />

            {/* Main Container */}
            <motion.div
                className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 relative z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-monument-regular text-gray-900 uppercase tracking-wider leading-tight mb-2">
                        Reset Your Password
                    </h1>
                    <p className="text-gray-600 text-sm uppercase tracking-wide font-geist-normal">
                        Enter your email to receive a one time code
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-geist-normal text-gray-600 uppercase tracking-wide mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-lg tracking-wide text-sm sm:text-base focus:ring-2 focus:ring-black outline-none border-none font-geist-normal"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-black text-white font-monument-regular tracking-widest text-xs sm:text-sm hover:bg-gray-800 transition-colors !mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                <span>SENDING...</span>
                            </>
                        ) : (
                            <span>SEND OTP</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm tracking-wide text-gray-600 space-y-2">
                    <p>
                        <a href="/login" className="font-geist-normal text-black hover:underline">Return to Login</a>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default RequestOTP
