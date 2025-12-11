"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Package, ArrowRight, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react'
import axiosInstance from "../../utils/axiosInstance"
import { enhancedApiCall, parseApiError } from "../../utils/enhancedApiUtils"
import { getCachedUserLocation, initializeLocationDetection } from "../../utils/geolocation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const SearchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)

export default function CreateRequest() {
    const router = useRouter()

    // Phase tracking
    const [currentPhase, setCurrentPhase] = useState("url_validation") // url_validation, create_request

    // URL Validation (Phase 1 - Step 1)
    const [productUrl, setProductUrl] = useState("")
    const [isValidating, setIsValidating] = useState(false)
    const [validationData, setValidationData] = useState(null)

    // Create Request (Phase 1 - Step 2)
    const [formData, setFormData] = useState({
        product_name: "",
        quantity: 1,
        notes: "",
        override_price: "",
        override_currency: "USD",
        override_description: "",
        override_images: [],
    })
    const [isCreatingRequest, setIsCreatingRequest] = useState(false)

    // General states
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showImagePopup, setShowImagePopup] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [userLocation, setUserLocation] = useState(null)

    // Load initial data
    useEffect(() => {
        // Initialize location detection and get user location
        initializeLocationDetection()

        const getUserLocationData = async () => {
            try {
                const locationData = await getCachedUserLocation()
                setUserLocation(locationData)
                console.log("User location detected in CreateRequest:", locationData)
            } catch (error) {
                console.error("Failed to get user location in CreateRequest:", error)
            }
        }

        getUserLocationData()

        // Check for pending product URL and validation data from landing page
        const storedValidationData = localStorage.getItem("validationData")
        const storedProductUrl = localStorage.getItem("validatedProductUrl")

        if (storedValidationData && storedProductUrl) {
            try {
                const parsedValidationData = JSON.parse(storedValidationData)
                setValidationData(parsedValidationData)
                setProductUrl(storedProductUrl)

                // Pre-fill form with extracted data
                setFormData((prev) => ({
                    ...prev,
                    product_name: parsedValidationData.name || "",
                    override_price: parsedValidationData.price ? parsedValidationData.price.replace(/[^\d.,]/g, '') : "",
                    override_currency: parsedValidationData.price ? parsedValidationData.price.match(/[A-Z₹$€£¥]/g)?.[0] || "USD" : "USD",
                    override_description: parsedValidationData.description ? parsedValidationData.description.join(' ') : "",
                    override_images: parsedValidationData.images || [],
                }))

                // Move to create request phase
                setCurrentPhase("create_request")
                setSuccess("URL validated successfully! Review the extracted data below.")

                // Clear the stored data
                localStorage.removeItem("validationData")
                localStorage.removeItem("validatedProductUrl")
                localStorage.removeItem("pendingProductUrl")

            } catch (error) {
                console.error("Error processing stored validation data:", error)
                // Clear invalid data
                localStorage.removeItem("validationData")
                localStorage.removeItem("validatedProductUrl")
                localStorage.removeItem("pendingProductUrl")
            }
        }
    }, [])

    // Image popup functions
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
        if (showImagePopup) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        } else {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [showImagePopup])

    // Phase 1 - Step 1: URL Validation
    const validateUrl = async () => {
        if (!productUrl.trim()) {
            setError("Please enter a product URL")
            return
        }

        try {
            setIsValidating(true)
            setError("")

            // Prepare validation payload with user location
            const validationPayload = {
                product_url: productUrl
            }

            // Add user location data if available
            if (userLocation) {
                validationPayload.user_location = {
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
                "/api/v1/shopforme/validate-url/",
                validationPayload
            )

            console.log("Validation response:", response.data)
            setValidationData(response.data)

            // Pre-fill form with extracted data
            setFormData((prev) => ({
                ...prev,
                product_name: response.data.name || "",
                override_price: response.data.price ? response.data.price.replace(/[^\d.,]/g, '') : "",
                override_currency: response.data.price ? response.data.price.match(/[A-Z₹$€£¥]/g)?.[0] || "USD" : "USD",
                override_description: response.data.description ? response.data.description.join(' ') : "",
                override_images: response.data.images || [],
            }))

            setSuccess("URL validated successfully! Review the extracted data below.")
            setCurrentPhase("create_request")
        } catch (err) {
            console.error("Validation error:", err)
            const errorMessage = parseApiError(err)
            setError(errorMessage)
        } finally {
            setIsValidating(false)
        }
    }

    // Phase 1 - Step 2: Create Request
    const createRequest = async () => {
        try {
            setIsCreatingRequest(true)
            setError("")

            const requestBody = {
                validation_id: validationData.validation_id,
                product_name: formData.product_name,
                product_url: productUrl,
                quantity: formData.quantity,
                notes: formData.notes,
                ...(formData.override_price && { override_price: Number.parseFloat(formData.override_price) }),
                ...(formData.override_currency && { override_currency: formData.override_currency }),
                ...(formData.override_description && { override_description: formData.override_description }),
                ...(formData.override_images?.length > 0 && { override_images: formData.override_images }),
            }

            // Add user location data if available
            if (userLocation) {
                requestBody.user_location = {
                    country: userLocation.country,
                    country_code: userLocation.countryCode,
                    city: userLocation.city,
                    region: userLocation.region,
                    ip: userLocation.ip,
                    timezone: userLocation.timezone
                }
            }

            console.log("Creating request with:", requestBody)

            const response = await axiosInstance.post("/api/v1/shopforme/create-request/", requestBody)

            console.log("Create response:", response.data)
            toast.success("Request created successfully! Redirecting to My Requests...")

            // Redirect to My Requests page after 2 seconds
            setTimeout(() => {
                router.push("/user-dashboard/personal-shopper")
            }, 2000)
        } catch (err) {
            console.error("Create request error:", err)
            const errorMessage = parseApiError(err)
            setError(errorMessage)
        } finally {
            setIsCreatingRequest(false)
        }
    }

    const resetForm = () => {
        setCurrentPhase("url_validation")
        setProductUrl("")
        setValidationData(null)
        setFormData({
            product_name: "",
            quantity: 1,
            notes: "",
            override_price: "",
            override_currency: "USD",
            override_description: "",
            override_images: [],
        })
        setError("")
        setSuccess("")
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8 sm:py-12 font-geist-normal">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className="max-w-full mx-auto mb-6 sm:mb-8">
                <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-24 h-24 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0">
                                <img src="/images/chrome-link.png" alt="Create Request" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-monument-regular text-black uppercase leading-tight">
                                    Create Shopping Request
                                </h1>
                                <p className="text-black text-xs sm:text-sm font-geist-normal uppercase mt-1 leading-relaxed">
                                    COPY AND PASTE THE LINK OF THE PRODUCT FROM ANY E-COMMERCE WEB SITE.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/user-dashboard/personal-shopper")}
                            className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white font-geist-normal tracking-wider text-xs hover:bg-gray-700 transition-colors rounded-lg"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>VIEW MY REQUESTS</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-full mx-auto">
                {/* Alert Messages */}
                {error && (
                    <div className="mb-4 sm:mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-geist-normal text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 sm:mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-geist-normal text-green-700">{success}</p>
                    </div>
                )}

                {/* Progress Indicator */}
                <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-monument-regular text-black uppercase">
                            REQUEST PROGRESS
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div
                            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-geist-medium ${currentPhase === "url_validation"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                                }`}
                        >
                            <span>1. URL VALIDATION</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                        <div
                            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-geist-medium ${currentPhase === "create_request"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-black"
                                }`}
                        >
                            <span>2. CREATE REQUEST</span>
                        </div>
                    </div>
                </div>

                {/* Phase 1 - Step 1: URL Validation */}
                {currentPhase === "url_validation" && (
                    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                        <div className="flex items-center mb-4 sm:mb-6">
                            <Package className="h-5 w-5 mr-2 text-gray-700" />
                            <h2 className="text-lg sm:text-xl font-monument-regular text-black uppercase">
                                STEP 1: PRODUCT URL VALIDATION
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    type="url"
                                    placeholder="https://www.amazon.com/product-link..."
                                    value={productUrl}
                                    onChange={(e) => setProductUrl(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && productUrl.trim()) {
                                            validateUrl()
                                        }
                                    }}
                                    className="h-12 sm:h-14 pl-4 sm:pl-6 pr-12 sm:pr-14 rounded-full bg-gray-50 border border-gray-200 font-geist-normal text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-5 pointer-events-none">
                                    <SearchIcon />
                                </div>
                            </div>

                            <button
                                onClick={validateUrl}
                                disabled={isValidating || !productUrl.trim()}
                                className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-xs sm:text-sm hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
                            >
                                {isValidating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        VALIDATING URL...
                                    </>
                                ) : (
                                    "VALIDATE URL"
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Phase 1 - Step 2: Create Request */}
                {currentPhase === "create_request" && validationData && (
                    <>
                        {/* Validation Results */}
                        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                                {validationData.is_valid ? (
                                    <Badge className="bg-green-100 text-green-800 mr-0 sm:mr-3 self-start">VALID</Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-800 mr-0 sm:mr-3 self-start">INVALID</Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                        Domain
                                    </label>
                                    <p className="text-sm font-geist-normal text-black">
                                        {validationData.domain_info?.domain || 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                        Provider
                                    </label>
                                    <Badge className="bg-blue-100 text-blue-800">
                                        {validationData.provider_used || 'Unknown'}
                                    </Badge>
                                </div>
                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                        Location
                                    </label>
                                    <p className="text-sm font-geist-normal text-black">
                                        {validationData.user_location?.city}, {validationData.user_location?.country || 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                                        Duration
                                    </label>
                                    <p className="text-sm font-geist-normal text-black">
                                        {validationData.timing?.total_duration ? Math.round(validationData.timing.total_duration) + 's' : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Enhanced Product Information */}
                            {validationData && (
                                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <h3 className="text-sm font-monument-regular text-black tracking-wider uppercase mb-3">
                                        Extracted Product Information
                                    </h3>

                                    {/* Product Images */}
                                    {validationData.images && validationData.images.length > 0 && (
                                        <div className="mb-6">
                                            <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                                Product Images
                                            </label>
                                            <div className="flex flex-wrap gap-3">
                                                {validationData.images.slice(0, 4).map((image, index) => (
                                                    <div key={index} className="relative cursor-pointer group">
                                                        <img
                                                            src={image}
                                                            alt={`Product image ${index + 1}`}
                                                            className="w-30 h-30 rounded-lg border border-gray-300 object-cover transition-transform group-hover:scale-105"
                                                            onClick={() => openImagePopup(index)}
                                                            onError={(e) => {
                                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA2MEM1MC4yIDYwIDU5IDUxLjIgNTkgNDFDNTkgMzAuOCA1MC4yIDIyIDQwIDIyQzI5LjggMjIgMjEgMzAuOCAyMSA0MUMyMSA1MS4yIDI5LjggNjAgNDAgNjBaIiBmaWxsPSIjOTlBM0FGIi8+CjxwYXRoIGQ9Ik0xMCA5MEw1MCA3MEw5MCA5MFY5OUgxMFY5MFoiIGZpbGw9IiM5OUEzQUYiLz48L3N2Zz4=';
                                                                e.target.classList.add('opacity-50');
                                                            }}
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-80 rounded-lg transition-all duration-200 flex items-center justify-center">
                                                            <div className="text-gray-800 opacity-0 group-hover:opacity-100 text-xs font-semibold">
                                                                Click to view
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {validationData.images.length > 4 && (
                                                    <div
                                                        className="w-30 h-30 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                                        onClick={() => openImagePopup(4)}
                                                    >
                                                        <span className="text-sm font-semibold text-gray-600">
                                                            +{validationData.images.length - 4}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Name */}
                                    {validationData.name && (
                                        <div className="mt-4">
                                            <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                                Product Name
                                            </label>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                <p className="text-sm font-geist-normal text-black">
                                                    {validationData.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Description */}
                                    {validationData.description && validationData.description.length > 0 && (
                                        <div className="mt-4">
                                            <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                                Product Description
                                            </label>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                                                <p className="text-sm font-geist-normal text-black leading-relaxed">
                                                    {validationData.description.join(' ')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Product Details Form */}
                        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                                <div className="flex items-center">
                                    <Package className="h-5 w-5 mr-2 text-black-700" />
                                    <h2 className="text-lg sm:text-xl font-monument-regular text-black uppercase">
                                        STEP 2: REVIEW & CREATE REQUEST
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setCurrentPhase("url_validation")}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg self-start sm:self-auto"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>BACK</span>
                                </button>
                            </div>

                            <p className="text-sm font-geist-normal text-black mb-4 sm:mb-6 leading-relaxed">
                                Review and modify the product information before creating your request
                            </p>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                            Product Name *
                                        </label>
                                        <Input
                                            value={formData.product_name}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, product_name: e.target.value }))}
                                            placeholder="Enter product name"
                                            className="h-10 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-geist-normal text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                            Quantity *
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))
                                            }
                                            className="h-10 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-geist-normal text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                            Override Price (Optional)
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.override_price}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, override_price: e.target.value }))}
                                            placeholder="0.00"
                                            className="h-10 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-geist-normal text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Leave empty to use extracted price</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                            Currency
                                        </label>
                                        <Input
                                            value={formData.override_currency}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, override_currency: e.target.value }))}
                                            placeholder="USD"
                                            className="h-10 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-geist-normal text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Description (Optional)
                                    </label>
                                    <Textarea
                                        value={formData.override_description}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, override_description: e.target.value }))}
                                        placeholder="Product description..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-geist-normal text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Special Notes (Optional)
                                    </label>
                                    <Textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Any special instructions or notes..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-geist-normal text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                    />
                                </div>

                                <button
                                    onClick={createRequest}
                                    disabled={isCreatingRequest || !formData.product_name.trim()}
                                    className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-xs sm:text-sm hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
                                >
                                    {isCreatingRequest ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            CREATING REQUEST...
                                        </>
                                    ) : (
                                        "CREATE REQUEST"
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Process Steps */}
                <div className="mt-16 sm:mt-24 grid grid-cols-2 gap-6 sm:gap-8">
                    <div className="text-center">
                        <h3 className="text-sm sm:text-base font-monument-regular text-black tracking-widest">VALIDATION</h3>
                        <p className="mt-1 font-geist-normal text-xs text-gray-500 leading-relaxed">VERIFY PRODUCT URL</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-sm sm:text-base font-monument-regular text-black tracking-widest">REQUEST</h3>
                        <p className="mt-1 font-geist-normal text-xs text-gray-500 leading-relaxed">CREATE YOUR REQUEST</p>
                    </div>
                </div>
            </div>

            {/* Image Popup Modal */}
            {showImagePopup && validationData?.images && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                }}>
                    <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={closeImagePopup}
                            className="absolute top-4 right-4 z-10 rounded-full p-3 transition-all duration-200"
                            style={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Previous Button */}
                        {validationData.images.length > 1 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-4 z-10 rounded-full p-3 transition-all duration-200"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                        )}

                        {/* Next Button */}
                        {validationData.images.length > 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-4 z-10 rounded-full p-3 transition-all duration-200"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        )}

                        {/* Main Image */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div
                                className="relative rounded-2xl overflow-hidden shadow-2xl"
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
                                    className="max-w-[80vw] max-h-[70vh] object-contain rounded-2xl"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Image Counter */}
                        {validationData.images.length > 1 && (
                            <div
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full px-4 py-2"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <span className="text-white text-sm font-semibold">
                                    {currentImageIndex + 1} / {validationData.images.length}
                                </span>
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
        </div>
    )
}
