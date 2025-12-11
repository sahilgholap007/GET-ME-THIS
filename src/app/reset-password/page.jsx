"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../utils/axiosInstance"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"

const ResetPassword = () => {
    const searchParams = useSearchParams()
    const prefillEmail = searchParams?.get("email") || ""
    const [email, setEmail] = useState(prefillEmail)
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [step, setStep] = useState(1)
    const router = useRouter()

    useEffect(() => {
        if (prefillEmail) {
            setEmail(prefillEmail)
        }
    }, [prefillEmail])

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            if (nextInput) nextInput.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            if (prevInput) prevInput.focus()
        }
    }







    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        if (step === 1) {
            // Validate email and OTP
            if (!email) return setErrors({ email: "Enter your email" })
            const otpString = otp.join("")
            if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) return setErrors({ otp: "Enter a valid 6-digit OTP" })
            setStep(2)
        } else {
            // Step 2: Reset password
            if (!newPassword) return setErrors({ newPassword: "Enter a new password" })
            if (newPassword !== confirmPassword) return setErrors({ confirmPassword: "Passwords do not match" })

            setIsLoading(true)
            try {
                await axiosInstance.post("/api/v1/users/password-reset/confirm/", {
                    email,
                    otp: otp.join(""),
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                })

                toast.success("Password reset successfully! Redirecting to login...")
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            } catch (error) {
                console.error("Reset failed:", error)
                if (error.response?.data?.message) {
                    toast.error(error.response.data.message)
                } else if (error.response?.data?.error) {
                    toast.error(error.response.data.error)
                } else if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors)
                } else {
                    toast.error("Password reset failed. Please try again.")
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28 font-geist-normal relative overflow-hidden">
            {/* Animated Background Icons */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {Array.from({ length: 10 }, (_, i) => {
                    const icons = [Mail, Lock]
                    const Icon = icons[i % icons.length]
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
                        {step === 1 ? "Verify OTP" : "Set New Password"}
                    </h1>
                    <p className="text-gray-600 text-sm uppercase tracking-wide font-geist-normal">
                        {step === 1 ? "Enter your email and the OTP sent to your email" : "Enter your new password"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 ? (
                        <>
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
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-geist-normal text-gray-600 uppercase tracking-wide mb-2">
                                    One Time Password (OTP)
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-12 h-12 text-center bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none font-geist-normal text-lg shadow-sm"
                                            maxLength="1"
                                            required
                                        />
                                    ))}
                                </div>
                                {errors.otp && <p className="text-red-500 text-xs mt-1 text-center">{errors.otp}</p>}
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-geist-normal text-gray-600 uppercase tracking-wide mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full h-12 p-3 bg-gray-50 rounded-lg tracking-wide text-sm sm:text-base focus:ring-2 focus:ring-black outline-none border-none font-geist-normal"
                                    placeholder="Enter new password"
                                    required
                                />
                                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-geist-normal text-gray-600 uppercase tracking-wide mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-12 p-3 bg-gray-50 rounded-lg tracking-wide text-sm sm:text-base focus:ring-2 focus:ring-black outline-none border-none font-geist-normal"
                                    placeholder="Confirm new password"
                                    required
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-black text-white font-monument-regular tracking-wider text-sm hover:bg-gray-800 transition-colors !mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                <span>{step === 1 ? "VERIFYING..." : "RESETTING..."}</span>
                            </>
                        ) : (
                            <span>{step === 1 ? "NEXT" : "RESET PASSWORD"}</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm tracking-wide text-gray-600 space-y-2">
                    <p>
                        <a href="/login" className="font-geist-normal text-black hover:underline">Return to Login</a>
                    </p>
                    <p>
                        <a href={`/forgot-password?email=${encodeURIComponent(email)}`} className="font-geist-normal text-black hover:underline">Didn't get an OTP? Request again</a>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default ResetPassword
