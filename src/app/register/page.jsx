"use client"

import { useState } from "react"
import axiosInstance from "../utils/axiosInstance"
import { Eye, EyeOff, CheckCircle, XCircle, Mail, Lock, User, Phone, ShoppingBag, Glasses, Footprints } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    password: "",
    referral_code: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

  const passwordChecks = {
    length: formData.password.length >= 5,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*#?&]/.test(formData.password),
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = { ...formData }
      if (!submitData.referral_code.trim()) delete submitData.referral_code

      const response = await axiosInstance.post("/api/auth/register", submitData)
      toast.success("Registration successful! Please verify your email.")

      // Check if email verification is required
      if (response.data.data.emailVerificationRequired) {
        // Redirect to verification page with email
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
        }, 2000)
      } else {
        // If no verification required, redirect to login
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data)
        toast.error("Please check the form for errors.")
      } else {
        toast.error("An error occurred during registration.")
      }
      console.error(error)
    }
  }

  const PasswordRule = ({ label, passed }) => (
    <div className={`flex items-center gap-2 ${passed ? "text-green-600" : "text-gray-400"}`}>
      {passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
      <span className="text-xs font-geist-normal">{label}</span>
    </div>
  )

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
        className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden z-10 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Form Container */}
        <div className="p-4 sm:p-6 lg:p-12">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-monument-regular text-gray-900 uppercase tracking-wider leading-tight">
              Create Account
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm uppercase tracking-wide font-medium mt-2">
              Fill in your details to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label htmlFor="first_name" className="block text-xs sm:text-sm font-monument-regular text-gray-700 uppercase tracking-widest">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full h-8 sm:h-10 pl-9 sm:pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 font-geist-normal placeholder-gray-400"
                      placeholder="Enter your first name"
                    />
                  </div>
                  {errors.first_name && <p className="text-red-600 text-xs sm:text-sm font-medium">{errors.first_name}</p>}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label htmlFor="last_name" className="block text-xs sm:text-sm font-monument-regular text-gray-700 uppercase tracking-widest">
                    Last Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full h-8 sm:h-10 pl-9 sm:pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 font-geist-normal placeholder-gray-400"
                      placeholder="Enter your last name"
                    />
                  </div>
                  {errors.last_name && <p className="text-red-600 text-xs sm:text-sm font-medium">{errors.last_name}</p>}
                </div>

                {/* Referral Code */}
                <div className="space-y-2">
                  <label htmlFor="referral_code" className="block text-xs sm:text-sm font-monument-regular text-gray-700 uppercase tracking-widest">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    id="referral_code"
                    value={formData.referral_code}
                    onChange={handleChange}
                    className="w-full h-8 sm:h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 font-geist-normal placeholder-gray-400"
                    placeholder="Enter referral code"
                  />
                  {errors.referral_code && <p className="text-red-600 text-xs sm:text-sm font-medium">{errors.referral_code}</p>}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-monument-regular text-gray-700 uppercase tracking-widest">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-8 sm:h-10 pl-9 sm:pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 font-geist-normal placeholder-gray-400"
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && <p className="text-red-600 text-xs sm:text-sm font-medium">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone_number" className="block text-xs sm:text-sm font-monument-regular text-gray-700 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 sm:h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full h-8 sm:h-10 pl-9 sm:pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 font-geist-normal placeholder-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone_number && <p className="text-red-600 text-xs sm:text-sm font-medium">{errors.phone_number}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-monument-regular text-gray-700 uppercase tracking-widest">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-8 sm:h-10 pl-9 sm:pl-10 pr-9 sm:pr-10 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 font-geist-normal placeholder-gray-400"
                      placeholder="Enter your password"
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
                  {errors.password && <p className="text-red-600 text-xs sm:text-sm font-medium">{errors.password}</p>}

                  {/* Password Rules */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    <PasswordRule label="5+ characters" passed={passwordChecks.length} />
                    <PasswordRule label="Uppercase" passed={passwordChecks.upper} />
                    <PasswordRule label="Lowercase" passed={passwordChecks.lower} />
                    <PasswordRule label="Number" passed={passwordChecks.number} />
                    <PasswordRule label="Special" passed={passwordChecks.special} />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-8 sm:h-10 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-monument-regular uppercase tracking-widest text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                REGISTER
              </button>
            </div>
          </form>

          {/* Redirect to Login */}
          <div className="mt-6 sm:mt-8 text-center">
            <div className="text-xs sm:text-sm text-gray-600 font-geist-normal">
              Already have an account?{" "}
              <a href="/login" className="font-geist-normal text-gray-900 hover:text-gray-700 underline underline-offset-2 transition-colors">
                Login here
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
