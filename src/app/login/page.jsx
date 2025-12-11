"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../utils/axiosInstance"
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Glasses, Footprints } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      router.push("/")
    }
  }, [router])

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const response = await axiosInstance.post("/api/v1/users/login/", credentials)
      const { access, refresh, user_id, email, first_name, last_name, suite_number } = response.data
      console.log("Login response:", response.data)
      localStorage.setItem("accessToken", access)
      localStorage.setItem("refreshToken", refresh)
      localStorage.setItem("userEmail", credentials.email)
      localStorage.setItem("userId", user_id)
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userFirstName", first_name || "")
      localStorage.setItem("userLastName", last_name || "")
      localStorage.setItem("userSuiteNumber", suite_number || "")

      toast.success("Login successful! Redirecting...")

      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event('authChange'))

      // Check if there's a pending product URL to process
      const pendingUrl = localStorage.getItem("pendingProductUrl")

      if (pendingUrl) {
        toast.info("Processing your product request...")
        // Validate the pending URL
        try {
          const validationResponse = await axiosInstance.post("/api/v1/shopforme/validate-url/", {
            product_url: pendingUrl,
          })

          // Store validation data for dashboard
          localStorage.setItem("validationData", JSON.stringify(validationResponse.data))
          localStorage.setItem("validatedProductUrl", pendingUrl)

          setTimeout(() => {
            router.push("/")
          }, 1500)
        } catch (validationError) {
          console.error("Validation error after login:", validationError)
          toast.error("Failed to validate your product URL, but you can try again in the dashboard.")
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        }
      } else {
        setTimeout(() => {
          router.push("/")
        }, 1500)
      }
    } catch (error) {
      console.error("Login failed:", error)
      if (error.response && error.response.data) {
        if (error.response.data.error === "Email not verified") {
          toast.error("Please verify your email before logging in.")
          setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(credentials.email)}`)
          }, 2000)
        } else {
          setErrors(error.response.data)
          toast.error("Please check your credentials and try again.")
        }
      } else if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password.")
      } else {
        toast.error("Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-monument-ultralight relative overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="mt-4"
        toastClassName="text-sm"
      />

      {/* Main Container */}
      <motion.div
        className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left Panel - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-12 flex-col justify-center items-center text-white relative overflow-hidden">

          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-monument-regular mb-4">Welcome to <span className="tracking-wider">GETMETHIS</span></h2>
            <p className="text-lg opacity-90">Your global shopping companion</p>
            <div className="mt-8 flex justify-center space-x-4">
              <ShoppingBag size={32} className="text-slate-300" />
              <Glasses size={32} className="text-slate-300" />
              <Footprints size={32} className="text-slate-300" />
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12">
          {/* Header Section */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center">
            <div className="mb-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-monument-regular text-gray-900 uppercase tracking-wider leading-tight">
                Welcome Back
              </h1>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm uppercase tracking-wide font-medium">
              Sign in to your account
            </p>
          </div>

          {/* Form Section */}
          <div className="px-6 sm:px-8 pb-8 sm:pb-10">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-monument-regular text-gray-700 uppercase tracking-widest"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full h-8 sm:h-10 pl-9 sm:pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 font-geist-normal placeholder-gray-400"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs sm:text-sm font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-monument-regular text-gray-700 uppercase tracking-widest"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full h-8 sm:h-10 pl-9 sm:pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 font-geist-normal placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs sm:text-sm font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-8 sm:h-10 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-monument-regular uppercase tracking-widest text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 sm:mt-8 text-center space-y-3">
              <div className="text-xs sm:text-sm text-gray-600 font-geist-normal">
                <span>Don't have an account? </span>
                <a
                  href="/register"
                  className="font-geist-normal text-gray-900 hover:text-gray-700 underline underline-offset-2 transition-colors"
                >
                  Create one here
                </a>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-geist-normal">
                <a
                  href="/forgot-password"
                  className="font-geist-normal hover:text-gray-900 underline underline-offset-2 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
