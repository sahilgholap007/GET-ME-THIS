"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowRight, Package, CheckCircle, ArrowLeft, X, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import axiosInstance from "../utils/axiosInstance"
import { enhancedApiCall, parseApiError, isValidProductUrl } from "../utils/enhancedApiUtils"
import { getCachedUserLocation, initializeLocationDetection } from "../utils/geolocation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import LoadingScreen from "./LoadingScreen"

const SearchIcon = () => (
    <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
)

export default function PersonalShopperLanding() {
    const [productUrl, setProductUrl] = useState("")
    const [isCreatingRequest, setIsCreatingRequest] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [currentStep, setCurrentStep] = useState("input") // "input", "validation"
    const [validationData, setValidationData] = useState(null)
    const [showImagePopup, setShowImagePopup] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)
    const [formData, setFormData] = useState({
        product_name: "",
        quantity: 1,
        override_price: null,
        override_currency: "",
        override_description: "",
        notes: ""
    })
    const [isClient, setIsClient] = useState(false)
    const [userLocation, setUserLocation] = useState(null)
    const [showLoadingScreen, setShowLoadingScreen] = useState(false)
    const [sessionId, setSessionId] = useState(null)
    const router = useRouter()

    useEffect(() => {
        // Set client-side flag
        setIsClient(true)

        // Initialize location detection in background
        initializeLocationDetection()

        // Get user location
        const getUserLocationData = async () => {
            try {
                const locationData = await getCachedUserLocation()
                setUserLocation(locationData)
                console.log("User location detected:", locationData)
            } catch (error) {
                console.error("Failed to get user location:", error)
            }
        }

        getUserLocationData()

        // Check if there's a stored product URL from localStorage
        const storedUrl = localStorage.getItem("pendingProductUrl")
        if (storedUrl) {
            setProductUrl(storedUrl)
        }
    }, [])

    const processValidationData = (data) => {
        console.log("✅ Validation completed:", data)
        console.log("Product name in response:", data.product_name || data.name)
        console.log("Available fields:", Object.keys(data))
        console.log("Full response:", JSON.stringify(data, null, 2))

        // Store the validation data
        setValidationData(data)

        // Pre-fill form data from validation
        let extractedPrice = null;
        if (data.price) {
            const priceMatch = data.price.match(/[\d,]+\.?\d*/);
            if (priceMatch) {
                extractedPrice = parseFloat(priceMatch[0].replace(/,/g, ''));
            }
        }

        // Ensure we have a valid product name - check multiple possible fields
        const productName = data.product_name || data.name || data.product_title || data.title;
        if (!productName || productName.trim() === '' || productName.trim().toLowerCase() === 'product' || productName.trim().toLowerCase() === 'unknown') {
            console.error('Invalid product name from validation:', productName);
            console.error('Available fields that might contain product name:', Object.keys(data).filter(key =>
                key.toLowerCase().includes('name') || key.toLowerCase().includes('title') || key.toLowerCase().includes('product')
            ));
            setError('Unable to extract product information. Please try a different URL.');
            toast.error('Unable to extract product information. Please try a different URL.');
            return;
        }

        setFormData({
            product_name: productName,
            quantity: 1,
            override_price: data.pricing_breakdown?.extracted_price || data.price ? parseFloat(data.price.replace(/[$,]/g, '')) : null,
            override_currency: data.pricing_breakdown?.currency || data.currency || "USD",
            override_description: data.description ? (Array.isArray(data.description) ? data.description.join(' ') : data.description) : "",
            notes: ""
        })

        console.log("✅ Form data set successfully:", {
            product_name: productName,
            quantity: 1,
            override_price: data.pricing_breakdown?.extracted_price || data.price ? parseFloat(data.price.replace(/[$,]/g, '')) : null,
            override_currency: data.pricing_breakdown?.currency || data.currency || "USD",
            override_description: data.description ? (Array.isArray(data.description) ? data.description.join(' ') : data.description) : "",
            notes: ""
        })

        toast.success("Validation completed successfully!")

        // Move to validation step
        setCurrentStep("validation")
    }

    const handleGetQuote = async () => {
        if (!productUrl.trim()) {
            setError("Please enter a product URL")
            toast.error("Please enter a product URL")
            return
        }

        // Validate URL format before making API call
        if (!isValidProductUrl(productUrl)) {
            setError("Please enter a valid product URL (must start with http:// or https://)")
            toast.error("Please enter a valid product URL")
            return
        }

        // Check if user is logged in first (before showing loading screen)
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            toast.info("Please login to continue with your request")
            router.push("/login")
            return
        }

        // Show loading screen immediately
        setShowLoadingScreen(true)

        try {
            // Store the product URL in localStorage
            localStorage.setItem("pendingProductUrl", productUrl)

            // Reset states
            setError("")

            console.log("🚀 Starting validation flow...")

            // Prepare validation payload (without user_location to avoid auto-creating request)
            const validationPayload = {
                product_url: productUrl,
                quantity: 1
            }

            // Call validate-url endpoint for validation without creating request
            const response = await enhancedApiCall(
                axiosInstance,
                'post',
                "/api/v1/shopforme/validate-url/",
                validationPayload
            )

            console.log("Validation response:", response.data)

            // Process the validation data to populate formData
            processValidationData(response.data)

            // Set validation data and show validation step
            setValidationData(response.data)
            setCurrentStep("validation")
            setShowLoadingScreen(false)
            setSessionId(null)

            toast.success("Product validated successfully!")

        } catch (err) {
            console.error("❌ Validation error:", err)
            const errorMessage = parseApiError(err)
            setError(errorMessage)
            toast.error(errorMessage)
            setShowLoadingScreen(false)
            setSessionId(null)
        }
    }

    const handleProceed = () => {
        createRequest()
    }

    const handleBack = () => {
        if (currentStep === "validation") {
            setCurrentStep("input")
            setValidationData(null)
            setError("")
            setSuccess("")
        }
    }

    const createRequest = async () => {
        console.log('Creating request with validation data');

        // Use formData if available, otherwise fall back to validationData
        const productName = formData.product_name || validationData?.name || validationData?.product_name;

        if (!productName || !productName.trim() || productName.trim().toLowerCase() === 'product' || productName.trim().toLowerCase() === 'unknown') {
            setError("Valid product name is required. Please try validating a different URL.")
            console.log("Invalid product name:", productName)
            toast.error("Valid product name is required. Please try validating a different URL.")
            return
        }

        try {
            setIsCreatingRequest(true)
            setError("")

            const requestData = {
                product_url: productUrl,
                product_name: productName,
                quantity: formData.quantity || 1,
                notes: formData.notes || "",
                override_price: formData.override_price || validationData?.pricing_breakdown?.extracted_price || null,
                override_currency: formData.override_currency || validationData?.pricing_breakdown?.currency || validationData?.currency || "USD",
                override_description: formData.override_description || (validationData?.description ? (Array.isArray(validationData.description) ? validationData.description.join(' ') : validationData.description) : ""),
                override_images: validationData.images || [],
                validation_id: validationData.validation_id || null
            }

            // Add user location data if available
            if (userLocation) {
                requestData.user_location = {
                    country: userLocation.country,
                    country_code: userLocation.countryCode,
                    city: userLocation.city,
                    region: userLocation.region,
                    ip: userLocation.ip,
                    timezone: userLocation.timezone
                }
            }

            const response = await enhancedApiCall(
                axiosInstance,
                'post',
                "/api/v1/shopforme/create/",
                requestData
            )

            console.log("Request created:", response.data)

            // Clear localStorage
            localStorage.removeItem("pendingProductUrl")

            toast.success("ShopForMe request created successfully! Our team will review and provide a quotation soon.")

            // Redirect to personal shopper dashboard (My Requests page) after 1.5 seconds
            setTimeout(() => {
                router.push("/user-dashboard/personal-shopper")
            }, 1500)

        } catch (err) {
            console.error("Create request error:", err)
            const errorMessage = parseApiError(err)
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsCreatingRequest(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleGetQuote()
        }
    }

    const openImagePopup = (index) => {
        setCurrentImageIndex(index)
        setShowImagePopup(true)
    }

    const closeImagePopup = () => {
        setShowImagePopup(false)
    }

    const nextImage = () => {
        if (validationData?.images) {
            setCurrentImageIndex((prev) => (prev + 1) % validationData.images.length)
        }
    }

    const prevImage = () => {
        if (validationData?.images) {
            setCurrentImageIndex((prev) => (prev - 1 + validationData.images.length) % validationData.images.length)
        }
    }

    const handleKeyDown = (e) => {
        if (!showImagePopup) return

        if (e.key === 'Escape') {
            closeImagePopup()
        } else if (e.key === 'ArrowRight') {
            nextImage()
        } else if (e.key === 'ArrowLeft') {
            prevImage()
        }
    }

    useEffect(() => {
        console.log("FormData updated:", formData)
    }, [formData])

    return (
        <div className="w-full">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="mt-16 sm:mt-4"
                toastClassName="text-sm"
            />

            {/* Location Display (for testing) */}
            {userLocation && (
                <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs px-3 py-2 rounded-lg z-50 backdrop-blur-sm">
                    📍 {userLocation.city}, {userLocation.country}
                </div>
            )}

            <motion.div
                className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 relative z-20 px-4 sm:px-6 lg:px-8 py-2 sm:py-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {/* Step 1: URL Input */}
                {currentStep === "input" && (
                    <div className="space-y-3 sm:space-y-4">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg mx-2 sm:mx-0"
                            >
                                <p className="text-xs sm:text-sm font-monument-regular text-red-700 text-center leading-relaxed">{error}</p>
                            </motion.div>
                        )}

                        {/* URL Input and Button Container */}
                        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 w-full">
                            {/* URL Input */}
                            <motion.div
                                className="relative flex-1"
                                whileFocus={{ scale: isClient && window.innerWidth > 640 ? 1.02 : 1 }}
                            >
                                <Input
                                    type="url"
                                    placeholder="Paste your product link here..."
                                    value={productUrl}
                                    onChange={(e) => {
                                        setProductUrl(e.target.value)
                                        if (error) setError("") // Clear error when user types
                                    }}
                                    onKeyPress={handleKeyPress}
                                    className="h-12 sm:h-14 lg:h-16 px-3 sm:px-5 lg:px-7 pr-12 sm:pr-14 rounded-full text-sm sm:text-base font-monument-regular bg-white border-2 border-black text-black placeholder-gray-500 placeholder:text-xs focus:outline-none focus:border-gray-700 focus:shadow-xl transition-all duration-300 w-full"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-5 pointer-events-none">
                                    <SearchIcon />
                                </div>
                            </motion.div>

                            {/* Get Quote Button */}
                            <motion.button
                                onClick={handleGetQuote}
                                disabled={showLoadingScreen}
                                className="group relative inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-black text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-full text-xs sm:text-sm lg:text-base font-monument-regular uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl w-full lg:w-auto lg:min-w-[280px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                whileHover={{ scale: showLoadingScreen ? 1 : (isClient && window.innerWidth > 640 ? 1.05 : 1) }}
                                whileTap={{ scale: showLoadingScreen ? 1 : 0.95 }}
                            >
                                {showLoadingScreen ? (
                                    <>
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Get Your Instant Quote</span>
                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                )}

                {/* Step 2: Validation Results */}
                {currentStep === "validation" && validationData && (
                    <motion.div
                        className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-gray-100 relative z-30"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
                                <h3 className="text-base sm:text-lg font-monument-regular text-gray-800 uppercase tracking-wider">
                                    Product Validated
                                </h3>
                            </div>
                            {validationData.is_valid ? (
                                <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm self-start sm:self-auto">VALID</Badge>
                            ) : (
                                <Badge className="bg-red-100 text-red-800 text-xs sm:text-sm self-start sm:self-auto">INVALID</Badge>
                            )}
                        </div>

                        {/* Validation Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                    Brand
                                </label>
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    {validationData.product_details?.Brand || 'Unknown'}
                                </Badge>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                    Extraction Time
                                </label>
                                <p className="text-xs sm:text-sm font-geist-normal text-gray-800">
                                    {validationData.extraction_time ? Math.round(validationData.extraction_time) + 's' : 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                    Total Time
                                </label>
                                <p className="text-xs sm:text-sm font-geist-normal text-gray-800">
                                    {validationData.total_time ? Math.round(validationData.total_time) + 's' : 'N/A'}
                                </p>
                            </div>
                            {validationData.hsn_code && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                        HSN Code
                                    </label>
                                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                                        {validationData.hsn_code}
                                    </Badge>
                                </div>
                            )}
                        </div>



                        {/* Product Information */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                            <h4 className="text-xs sm:text-sm font-monument-regular text-gray-800 tracking-wider uppercase mb-3">
                                Product Information
                            </h4>

                            {/* Product Images */}
                            {validationData.images && validationData.images.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                                        {validationData.images.slice(0, 3).map((image, index) => (
                                            <div key={index} className="relative cursor-pointer group">
                                                <img
                                                    src={image}
                                                    alt={`Product image ${index + 1}`}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-300 object-cover transition-transform group-hover:scale-105"
                                                    onClick={() => openImagePopup(index)}
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAzNUMzMC41MjI4IDM1IDM1IDMwLjUyMjggMzUgMjVDMzUgMTkuNDc3MiAzMC41MjI4IDE1IDI1IDE1QzE5LjQ3NzIgMTUgMTUgMTkuNDc3MiAxNSAyNUMxNSAzMC41MjI4IDE5LjQ3NzIgMzUgMjUgMzVaIiBmaWxsPSIjOTlBM0FGIi8+CjxwYXRoIGQ9Ik0xMCA1NUw0MCA0MEw3MCA1NVY2NUgxMFY1NVoiIGZpbGw9IiM5OUEzQUYiLz4KPC9zdmc+';
                                                        e.target.classList.add('opacity-50');
                                                    }}
                                                    onLoad={(e) => {
                                                        e.target.classList.remove('opacity-50');
                                                    }}
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                        {validationData.images.length > 3 && (
                                            <div
                                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                                onClick={() => openImagePopup(3)}
                                            >
                                                <span className="text-xs font-semibold text-gray-600">
                                                    +{validationData.images.length - 3}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {validationData.product_details?.Brand && (
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                            Brand
                                        </label>
                                        <p className="text-xs sm:text-sm font-geist-normal text-gray-800">
                                            {validationData.product_details.Brand}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                        Price
                                    </label>
                                    <p className="text-xs sm:text-sm font-geist-normal text-gray-800 font-semibold">
                                        {validationData.price || 'N/A'}
                                    </p>
                                </div>

                                {validationData.pricing_breakdown?.total_cost && (
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                            Total Cost
                                        </label>
                                        <p className="text-sm font-geist-normal text-blue-600 font-bold mb-1">
                                            {validationData.pricing_breakdown.currency} {validationData.pricing_breakdown.total_cost}
                                        </p>
                                        <button
                                            onClick={() => setShowPriceBreakdown(true)}
                                            className="text-xs text-blue-500 hover:text-blue-700 underline"
                                        >
                                            Why this price?
                                        </button>
                                    </div>
                                )}

                                {validationData.product_details?.Color && (
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                            Color
                                        </label>
                                        <p className="text-xs sm:text-sm font-geist-normal text-gray-800">
                                            {validationData.product_details.Color}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Product Name */}
                            {validationData.name && (
                                <div className="mt-3 sm:mt-4">
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Product Name
                                    </label>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <p className="text-xs sm:text-sm font-geist-normal text-gray-800 font-medium leading-relaxed">
                                            {validationData.name}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Quantity Input */}
                            <div className="mt-3 sm:mt-4">
                                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                    Quantity
                                </label>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={formData.quantity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 1;
                                            setFormData(prev => ({
                                                ...prev,
                                                quantity: Math.max(1, Math.min(99, value))
                                            }));
                                        }}
                                        className="w-full text-sm font-geist-normal text-gray-800 border-none p-0 focus:ring-0 focus:outline-none"
                                        placeholder="Enter quantity"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            {validationData.description && validationData.description.length > 0 && (
                                <div className="mt-3 sm:mt-4">
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Description
                                    </label>
                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                        <p className="text-xs sm:text-sm font-geist-normal text-gray-800 leading-relaxed">
                                            {validationData.description.join(' ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={handleBack}
                                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gray-500 text-white font-monument-regular tracking-wider text-xs sm:text-sm hover:bg-gray-600 transition-colors rounded-lg order-2 sm:order-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>BACK</span>
                            </button>
                            <button
                                onClick={handleProceed}
                                className="flex-1 flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-xs sm:text-sm hover:bg-gray-800 transition-colors rounded-lg order-1 sm:order-2"
                            >
                                <span className="hidden sm:inline">CREATE REQUEST</span>
                                <span className="sm:hidden">CREATE REQUEST</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Process Info */}
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs font-monument-regular text-yellow-800 leading-relaxed">
                                <strong>Note:</strong> Your request will be reviewed by our team before final pricing and quotation. You'll be notified once the quotation is ready for payment and shipping selection.
                            </p>
                        </div>
                    </motion.div>
                )}


            </motion.div>

            {/* Loading Screen */}
            {showLoadingScreen && (
                <LoadingScreen
                    isVisible={showLoadingScreen}
                    sessionId={sessionId}
                    onComplete={(data) => {
                        setShowLoadingScreen(false)
                        setSessionId(null)
                        if (data) {
                            processValidationData(data)
                        }
                    }}
                />
            )}

            {/* Image Popup Modal */}
            {showImagePopup && validationData?.images && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                }}>
                    <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4">
                        {/* Close Button */}
                        <button
                            onClick={closeImagePopup}
                            className="absolute top-20 sm:top-24 right-4 z-[70] rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110"
                            style={{
                                background: 'rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 0, 0, 0.6)'
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(0, 0, 0, 0.5)'
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                            }}
                            title="Close image viewer"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" />
                        </button>

                        {/* Previous Button */}
                        {validationData.images.length > 1 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-2 sm:left-4 z-10 rounded-full p-2 sm:p-3 transition-all duration-200"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(0, 0, 0, 0.5)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </button>
                        )}

                        {/* Next Button */}
                        {validationData.images.length > 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-2 sm:right-4 z-10 rounded-full p-2 sm:p-3 transition-all duration-200"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(0, 0, 0, 0.5)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        )}

                        {/* Main Image */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div
                                className="relative rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    backdropFilter: 'blur(15px)',
                                    WebkitBackdropFilter: 'blur(15px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <img
                                    src={validationData.images[currentImageIndex]}
                                    alt={`Product image ${currentImageIndex + 1}`}
                                    className="max-w-[90vw] max-h-[60vh] sm:max-w-[80vw] sm:max-h-[70vh] object-contain rounded-lg sm:rounded-2xl"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDYwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNTAgMjI1QzI3Ny42MTQgMjI1IDMwMCAxOTcuNjE0IDMwMCAxNzBDMzAwIDE0Mi4zODYgMjc3LjYxNCAxMjAgMjUwIDEyMEMyMjIuMzg2IDEyMCAyMDAgMTQyLjM4NiAyMDAgMTcwQzIwMCAxOTcuNjE0IDIyMi4zODYgMjI1IDI1MCAyMjVaIiBmaWxsPSIjOTlBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMzMwTDMwMCAyNzBMNTAwIDMzMFYzODBIMTAwVjMzMFoiIGZpbGw9IiM5OUEzQUYiLz4KPHR4dCB4PSIzMDAiIHk9IjQyMCIgZmlsbD0iIzk5QTNBRiIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90eHQ+Cjwvc3ZnPg==';
                                    }}
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Image Counter */}
                        {validationData.images.length > 1 && (
                            <div
                                className="absolute bottom-4 sm:bottom-4 left-1/2 transform -translate-x-1/2 rounded-full px-3 sm:px-4 py-1 sm:py-2"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <span className="text-white text-xs sm:text-sm font-semibold">
                                    {currentImageIndex + 1} / {validationData.images.length}
                                </span>
                            </div>
                        )}

                        {/* Thumbnail Strip */}
                        {validationData.images.length > 1 && (
                            <div
                                className="absolute bottom-12 sm:bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 max-w-full overflow-x-auto px-3 sm:px-4 py-2 sm:py-3 rounded-xl scrollbar-hidden"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    maxWidth: '95vw'
                                }}
                            >
                                {validationData.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden flex-shrink-0 ${index === currentImageIndex
                                            ? 'ring-2 ring-white scale-110'
                                            : 'hover:scale-105 opacity-70 hover:opacity-100'
                                            }`}
                                        onClick={() => setCurrentImageIndex(index)}
                                        style={{
                                            background: index === currentImageIndex ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                            backdropFilter: 'blur(5px)',
                                            WebkitBackdropFilter: 'blur(5px)',
                                            width: '80px',
                                            height: '60px'
                                        }}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full rounded object-contain"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzNUMzNS41MjI4IDM1IDQwIDMwLjUyMjggNDAgMjVDNDAgMTkuNDc3MiAzNS41MjI4IDE1IDMwIDE1QzI0LjQ3NzIgMTUgMjAgMTkuNDc3MiAyMCAyNUMyMCAzMC41MjI4IDI0LjQ3NzIgMzUgMzAgMzVaIiBmaWxsPSIjOTlBM0FGIi8+CjxwYXRoIGQ9Ik0xMCA0NUw0MCAzNUw3MCA0NVY1MEgxMFY0NVoiIGZpbGw9IiM5OUEzQUYiLz4KPC9zdmc+';
                                            }}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={closeImagePopup}
                    />
                </div>
            )}

            {/* Price Breakdown Modal */}
            {showPriceBreakdown && validationData && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                }}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border-2 border-white/30 shadow-2xl">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-monument-regular text-black tracking-wider uppercase">
                                Why This Price?
                            </h3>
                            <button
                                onClick={() => setShowPriceBreakdown(false)}
                                className="text-gray-400 hover:text-black p-1"
                            >
                                <X className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Product Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-monument-regular text-black tracking-wider uppercase mb-2">
                                    Product: {validationData.name || validationData.product_name}
                                </h4>
                                <div className="text-xs text-black">
                                    Quantity: {formData.quantity}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                                        Original Price ({validationData.pricing_breakdown?.currency || 'USD'})
                                    </span>
                                    <span className="text-sm font-geist-normal text-black">
                                        {validationData.pricing_breakdown?.currency || 'USD'} {validationData.pricing_breakdown?.extracted_price}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                                        Company Cost
                                    </span>
                                    <span className="text-sm font-geist-normal text-black">
                                        {validationData.pricing_breakdown?.currency || 'USD'} {validationData.pricing_breakdown?.company_cost}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                                        Subtotal (Before GST)
                                    </span>
                                    <span className="text-sm font-geist-normal text-black">
                                        {validationData.pricing_breakdown?.currency || 'USD'} {validationData.pricing_breakdown?.subtotal_before_gst}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                                        GST Amount ({validationData.pricing_breakdown?.gst_percentage}%)
                                    </span>
                                    <span className="text-sm font-geist-normal text-black">
                                        {validationData.pricing_breakdown?.currency || 'USD'} {validationData.pricing_breakdown?.gst_amount}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded-lg border-2 border-blue-200">
                                    <span className="text-base font-monument-regular text-blue-800 tracking-wider uppercase">
                                        Total Cost
                                    </span>
                                    <span className="text-lg font-monument-regular text-blue-800">
                                        {validationData.pricing_breakdown?.currency || 'USD'} {validationData.pricing_breakdown?.total_cost}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .scrollbar-hidden {
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* Internet Explorer 10+ */
                }
                .scrollbar-hidden::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                }
            `}</style>
        </div>
    )
}