"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axiosInstance from "../utils/axiosInstance"
import { Mail, ArrowLeft } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import { ShoppingBag, Glasses, Footprints } from "lucide-react"

const VerifyEmail = () => {
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    useEffect(() => {
        if (!email) {
            router.push("/register")
            return
        }

        // Start countdown for resend
        setCountdown(60)
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [email, router])

    const handleVerify = async (e) => {
        e.preventDefault()
        if (!otp.trim() || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP")
            return
        }

        setIsLoading(true)
        try {
            const response = await axiosInstance.post("/api/auth/verify-email", {
                email,
                otp: otp.trim(),
            })

            toast.success("Email verified successfully! Logging you in...")

            // Store tokens
            const { token, refreshToken } = response.data.data
            localStorage.setItem("accessToken", token)
            localStorage.setItem("refreshToken", refreshToken)

            // Store user data
            const user = response.data.data.user
            localStorage.setItem("userEmail", user.email)
            localStorage.setItem("userId", user.id)
            localStorage.setItem("userFirstName", user.firstName || "")
            localStorage.setItem("userLastName", user.lastName || "")

            // Dispatch auth change event
            window.dispatchEvent(new Event('authChange'))

            // Redirect to dashboard
            setTimeout(() => {
                router.push("/dashboard")
            }, 1500)
        } catch (error) {
            console.error("Verification failed:", error)
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Verification failed. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        if (countdown > 0) return

        setResendLoading(true)
        try {
            await axiosInstance.post("/api/auth/resend-verification", {
                email,
            })

            toast.success("Verification code sent successfully")
            setCountdown(60)
        } catch (error) {
            console.error("Resend failed:", error)
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed to resend verification code")
            }
        } finally {
            setResendLoading(false)
        }
    }

    const handleBack = () => {
        router.push("/register")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28 font-monument-ultralight relative overflow-hidden">
            {/* Animated Background Icons */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {Array.from({ length: 15 }, (_, i) => {
                    const icons = [ShoppingBag, Glasses, Footprints]
                    const Icon = icons[i % icons.length]
                    const size = 20 + Math.random() * 20
                    return (
                        <motion.div
                            key={i}
                            className="absolute text-slate-500 opacity-30 drop-shadow-lg"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-10%`,
                            }}
                            animate={{
                                y: '120vh',
                                rotate: Math.random() * 360,
                            }}
                            transition={{
                                duration: 15 + Math.random() * 15,
                                repeat: Infinity,
                                delay: Math.random() * 10,
                                ease: 'linear',
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
                className="mt-4 z-20"
                toastClassName="text-sm"
            />

            {/* Main Container */}
            <motion.div
                className="w-full max-w-sm lg:max-w-md xl:max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden z-10 relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Form Container */}
                <div className="p-6 sm:p-8 lg:p-12">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Register
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-gray-600" />
                            </div>
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-monument-regular text-gray-900 uppercase tracking-wider leading-tight">
                            Verify Your Email
                        </h1>
                        <p className="text-gray-600 text-xs sm:text-sm uppercase tracking-wide font-medium mt-2">
                            We've sent a 6-digit code to {email}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* OTP Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="otp"
                                className="block text-xs sm:text-sm font-monument-regular text-gray-700 uppercase tracking-widest text-center"
                            >
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                    setOtp(value)
                                }}
                                className="w-full h-12 text-center text-2xl font-mono bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 font-geist-normal placeholder-gray-400"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="w-full h-12 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-monument-regular uppercase tracking-widest text-sm rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Verifying...</span>
                                    </div>
                                ) : (
                                    "Verify Email"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Resend Section */}
                    <div className="mt-8 text-center">
                        <p className="text-xs sm:text-sm text-gray-600 font-geist-normal mb-4">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={countdown > 0 || resendLoading}
                            className="text-gray-900 hover:text-gray-700 font-geist-normal underline underline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendLoading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default VerifyEmail