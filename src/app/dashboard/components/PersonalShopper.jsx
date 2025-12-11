"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ShoppingCart, Package, CreditCard, ExternalLink, RefreshCw, MapPin, Phone, CheckCircle, Clock, AlertCircle, Wallet, ArrowRight, ArrowLeft, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react'
import axiosInstance from "../../utils/axiosInstance"
import { enhancedApiCall, parseApiError, formatCurrency } from "../../utils/enhancedApiUtils"
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0z" />
  </svg>
)

const getStatusColor = (status) => {
  switch (status) {
    case "url_validated":
      return "bg-blue-100 text-blue-800"
    case "pending_review":
      return "bg-yellow-100 text-yellow-800"
    case "quotation_ready":
      return "bg-blue-100 text-blue-800"
    case "awaiting_payment":
      return "bg-orange-100 text-orange-800"
    case "order_placed":
      return "bg-green-100 text-green-800"
    case "arrived_at_warehouse":
      return "bg-purple-100 text-purple-800"
    case "paid":
      return "bg-green-100 text-green-800"
    case "processing":
      return "bg-purple-100 text-purple-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-black"
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case "url_validated":
      return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
    case "pending_review":
      return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
    case "quotation_ready":
      return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
    case "awaiting_payment":
      return <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
    case "order_placed":
      return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
    case "arrived_at_warehouse":
      return <Package className="h-3 w-3 sm:h-4 sm:w-4" />
    case "paid":
      return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
    case "processing":
      return <Package className="h-3 w-3 sm:h-4 sm:w-4" />
    case "completed":
      return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
    default:
      return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
  }
}

export default function PersonalShopper({ initialTab = "create" }) {
  // Phase tracking
  const [currentPhase, setCurrentPhase] = useState("url_validation") // url_validation, create_request, payment_preparation, payment_processing

  // URL Validation (Phase 1 - Step 1)
  const [productUrl, setProductUrl] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationData, setValidationData] = useState(null)
  console.log(validationData)
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
  const [createdRequest, setCreatedRequest] = useState(null)

  // Address Book & Payment Preparation (Phase 3)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false)
  const [paymentPreparation, setPaymentPreparation] = useState(null)

  // Payment Processing (Phase 4)
  const [paymentMethod, setPaymentMethod] = useState("") // paypal or wallet
  const [walletPin, setWalletPin] = useState("")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [walletInfo, setWalletInfo] = useState(null)

  // General states
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)
  const [selectedRequestForBreakdown, setSelectedRequestForBreakdown] = useState(null)
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [userLocation, setUserLocation] = useState(null)
  console.log(requests)
  // Load initial data
  useEffect(() => {
    fetchRequests()
    fetchWalletInfo()

    // Set the active tab based on initialTab prop
    setActiveTab(initialTab)

    // Initialize location detection and get user location
    initializeLocationDetection()

    const getUserLocationData = async () => {
      try {
        const locationData = await getCachedUserLocation()
        setUserLocation(locationData)
        console.log("User location detected in PersonalShopper:", locationData)
      } catch (error) {
        console.error("Failed to get user location in PersonalShopper:", error)
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

        // Move to create request phase only if not forced to requests tab
        setCurrentPhase("create_request")
        if (initialTab !== "requests") {
          setActiveTab("create")
          setSuccess("URL validated successfully! Review the extracted data below.")
        }

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
  }, [initialTab])
  console.log("Validation data:", requests)
  // Fetch addresses when needed
  useEffect(() => {
    if (currentPhase === "payment_preparation") {
      fetchAddresses()
    }
  }, [currentPhase])

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

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/api/v1/shopforme/requests/")
      setRequests(response.data)
    } catch (err) {
      console.error("Failed to load requests:", err)
      setError("Failed to load requests")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true)
      const response = await axiosInstance.get("/api/v1/users/address-book/")
      setAddresses(response.data)
      // Auto-select default address if available
      const defaultAddress = response.data.find((addr) => addr.is_default)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress)
      }
    } catch (err) {
      console.error("Failed to load addresses:", err)
      toast.error("Failed to load shipping addresses")
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const fetchWalletInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/payments/wallet/")
      setWalletInfo(response.data)
    } catch (err) {
      console.error("Failed to load wallet info:", err)
    }
  }
  console.log(selectedRequestDetails)
  const fetchRequestDetails = async (requestId) => {
    try {
      const response = await axiosInstance.get(`/api/v1/shopforme/requests/${requestId}/`)
      setSelectedRequestDetails(response.data)
      setShowRequestModal(true)
    } catch (err) {
      console.error("Failed to load request details:", err)
      toast.error("Failed to load request details")
    }
  }

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
        product_name: formData.product_name,  // <-- required
        product_url: productUrl,              // <-- required
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
      setCreatedRequest(response.data)
      setSuccess("Request created successfully! Admin will review and provide quotation.")

      // Reset form and go back to requests tab
      setTimeout(() => {
        resetForm()
        fetchRequests()
        setActiveTab("requests")
      }, 2000)
    } catch (err) {
      console.error("Create request error:", err)
      const errorMessage = parseApiError(err)
      setError(errorMessage)
    } finally {
      setIsCreatingRequest(false)
    }
  }

  // Phase 3: Payment Preparation
  const prepareForPayment = async (requestId) => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address")
      return
    }

    try {
      setIsPreparing(true)
      const response = await axiosInstance.post(`/api/v1/shopforme/requests/${requestId}/pay_for_request/`, {
        shipping_address_id: selectedAddress.id,
      })
      console.log(selectedAddress)
      setPaymentPreparation(response.data)
      setCurrentPhase("payment_processing")
      toast.success("Ready for payment!")
    } catch (err) {
      console.error("Payment preparation error:", err)
      toast.error("Failed to prepare payment")
    } finally {
      setIsPreparing(false)
    }
  }

  // Phase 4A: PayPal Payment
  const processPayPalPayment = async () => {
    try {
      setIsProcessingPayment(true)
      const response = await axiosInstance.post(`/api/v1/shopforme/requests/${paymentPreparation.shop_for_me_request_id}/pay/`, {
        payment_method: "paypal",
        shipping_address_id: selectedAddress.id,
      })
      console.log("PayPal createOrder response", response.data)
      if (response.data.approval_url) {
        // Redirect to PayPal
        window.location.href = response.data.approval_url
      } else {
        toast.error("PayPal payment URL not received")
      }
    } catch (err) {
      console.error("PayPal payment error:", err)
      toast.error("Failed to process PayPal payment")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Phase 4B: Wallet Payment
  const processWalletPayment = async () => {
    if (!walletPin || walletPin.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN")
      return
    }

    try {
      setIsProcessingPayment(true)
      const response = await axiosInstance.post(`/api/v1/shopforme/requests/${paymentPreparation.shop_for_me_request_id}/pay/`, {
        payment_method: "wallet",
        shipping_address_id: selectedAddress.id,
        pin: walletPin,
      })

      toast.success("Payment successful!")
      setSuccess(`Payment completed! Transaction ID: ${response.data.transaction_id}`)

      // Reset and refresh
      setTimeout(() => {
        resetForm()
        fetchRequests()
        fetchWalletInfo()
        setActiveTab("requests")
      }, 2000)
    } catch (err) {
      console.error("Wallet payment error:", err)
      toast.error(err.response?.data?.message || "Wallet payment failed")
    } finally {
      setIsProcessingPayment(false)
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
    setCreatedRequest(null)
    setSelectedAddress(null)
    setPaymentPreparation(null)
    setPaymentMethod("")
    setWalletPin("")
    setError("")
    setSuccess("")
  }

  const handleRefresh = () => {
    fetchRequests()
  }

  const formatAddress = (address) => {
    // Handle both old and new API formats
    return `${address.street || address.address_line1}${address.street2 || address.address_line2 ? ", " + (address.street2 || address.address_line2) : ""}, ${address.city}, ${address.state || address.state_province_region} ${address.postal_code || address.zip_postal_code}, ${address.country}`
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:py-12 font-geist-normal">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="max-w-full mx-auto mb-6 sm:mb-8">
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-24 h-24 sm:w-16 sm:h-16  rounded-full flex items-center justify-center flex-shrink-0">
                <img src="/images/chrome-link.png" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-monument-regular text-black uppercase leading-tight">
                  Assisted Shopping
                </h1>
                <p className="text-black text-xs sm:text-sm font-geist-normal uppercase mt-1 leading-relaxed">
                  COPY AND PASTE THE LINK OF THE PRODUCT FROM ANY E-COMMERCE WEB SITE.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Wallet Info */}
              {walletInfo && (
                <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <Wallet className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-monument-regular text-green-800 tracking-wider">
                    ${(Number.parseFloat(walletInfo.balance) || 0).toFixed(2)}
                  </span>
                </div>
              )}

              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-black text-white font-geist-normal tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span>REFRESH</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-geist-medium transition-colors ${activeTab === "create" ? "bg-white text-black shadow-sm" : "text-black hover:text-black"
                }`}
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">CREATE REQUEST</span>
              <span className="sm:hidden">CREATE</span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-geist-medium transition-colors ${activeTab === "requests" ? "bg-white text-black shadow-sm" : "text-black hover:text-black"
                }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">MY REQUESTS ({requests.length})</span>
              <span className="sm:hidden">REQUESTS ({requests.length})</span>
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

        {activeTab === "create" ? (
          <>
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
                    : ["create_request", "payment_preparation", "payment_processing"].includes(currentPhase)
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-black"
                    }`}
                >
                  <span>1. URL VALIDATION</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                <div
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-geist-medium ${currentPhase === "create_request"
                    ? "bg-blue-100 text-blue-800"
                    : ["payment_preparation", "payment_processing"].includes(currentPhase)
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-black"
                    }`}
                >
                  <span>2. CREATE REQUEST</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                <div
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-geist-medium ${currentPhase === "payment_preparation"
                    ? "bg-blue-100 text-blue-800"
                    : currentPhase === "payment_processing"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-black"
                    }`}
                >
                  <span>3. PAYMENT</span>
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
                                  onLoad={(e) => {
                                    e.target.classList.remove('opacity-50');
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

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {validationData.product_details?.Brand && (
                          <div>
                            <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                              Brand
                            </label>
                            <p className="text-sm font-geist-normal text-black">
                              {validationData.product_details.Brand}
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                            Price
                          </label>
                          <p className="text-sm font-geist-normal text-black">
                            {validationData.price || 'N/A'}
                          </p>
                        </div>

                        {validationData.product_details?.Color && (
                          <div>
                            <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                              Color
                            </label>
                            <p className="text-sm font-geist-normal text-black">
                              {validationData.product_details.Color}
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                            Status
                          </label>
                          <Badge className={validationData.is_valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {validationData.is_valid ? "Valid" : "Invalid"}
                          </Badge>
                        </div>

                        {validationData.product_details?.Category && (
                          <div>
                            <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                              Category
                            </label>
                            <p className="text-sm font-geist-normal text-black">
                              {validationData.product_details.Category || 'Not specified'}
                            </p>
                          </div>
                        )}

                        {validationData.extraction_time && (
                          <div>
                            <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                              Extraction Time
                            </label>
                            <p className="text-sm font-geist-normal text-black">
                              {Math.round(validationData.extraction_time)}s
                            </p>
                          </div>
                        )}
                      </div>

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

                      {/* Price Conversion Information */}
                      {validationData.price_conversion && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="text-xs font-monument-regular text-blue-700 tracking-widest uppercase mb-2">
                            Price Conversion
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <span className="text-xs font-monument-regular text-blue-600 tracking-widest uppercase">
                                Original:
                              </span>
                              <span className="ml-2 text-sm font-geist-normal text-blue-800">
                                {validationData.price_conversion.original_price} {validationData.price_conversion.original_currency}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-monument-regular text-blue-600 tracking-widest uppercase">
                                User Currency:
                              </span>
                              <span className="ml-2 text-sm font-geist-normal text-blue-800">
                                {validationData.price_conversion.user_currency}
                              </span>
                            </div>
                            {validationData.price_conversion.converted_price && (
                              <div>
                                <span className="text-xs font-monument-regular text-blue-600 tracking-widest uppercase">
                                  Converted:
                                </span>
                                <span className="ml-2 text-sm font-geist-normal text-blue-800">
                                  {validationData.price_conversion.converted_price} {validationData.price_conversion.user_currency}
                                </span>
                              </div>
                            )}
                            {validationData.price_conversion.exchange_rate !== 1 && (
                              <div>
                                <span className="text-xs font-monument-regular text-blue-600 tracking-widest uppercase">
                                  Exchange Rate:
                                </span>
                                <span className="ml-2 text-sm font-geist-normal text-blue-800">
                                  {validationData.price_conversion.exchange_rate}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Concurrency and Performance Info */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {validationData.concurrency_info && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="text-xs font-monument-regular text-green-700 tracking-widest uppercase mb-2">
                              System Status
                            </h4>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-green-600">Apify Slots:</span>
                                <span className="text-green-800">{validationData.concurrency_info.apify_slots_used}/{validationData.concurrency_info.apify_max_slots}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-green-600">Available:</span>
                                <span className="text-green-800">{validationData.concurrency_info.apify_slots_available}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-green-600">Redis:</span>
                                <Badge className={validationData.concurrency_info.redis_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {validationData.concurrency_info.redis_available ? "Online" : "Offline"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="text-xs font-monument-regular text-purple-700 tracking-widest uppercase mb-2">
                            Performance Metrics
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-purple-600">Provider:</span>
                              <Badge className="bg-purple-100 text-purple-800">
                                {validationData.provider_used || 'Unknown'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-600">Total Duration:</span>
                              <span className="text-purple-800">{Math.round(validationData.timing?.total_duration || 0)}s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-600">Extraction:</span>
                              <span className="text-purple-800">{Math.round(validationData.timing?.extraction_duration || 0)}s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-600">Location Detection:</span>
                              <span className="text-purple-800">{Math.round(validationData.timing?.location_duration || 0)}s</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Validation Notes */}
                      {validationData.validation_notes && (
                        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                          <h4 className="text-xs font-monument-regular text-gray-700 tracking-widest uppercase mb-1">
                            Validation Notes
                          </h4>
                          <p className="text-xs text-black">
                            {validationData.validation_notes}
                          </p>
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

            {/* Success Message */}
            {createdRequest && (
              <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-monument-regular text-black tracking-wider uppercase mb-2">
                    Request Created Successfully!
                  </h3>
                  <p className="text-sm font-geist-normal text-black mb-4 leading-relaxed">
                    Your request has been submitted for admin review. You will be notified when a quotation is ready.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                      Request ID
                    </p>
                    <p className="text-lg font-monument-regular text-black tracking-wider">#{createdRequest.id}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Requests Tab */
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-monument-regular text-black tracking-wider uppercase">
                MY SHOP FOR ME REQUESTS
              </h2>
            </div>

            {isLoading ? (
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-monument-regular text-black tracking-wider uppercase mb-2">
                  No requests yet
                </h3>
                <p className="text-sm font-geist-normal text-gray-500 mb-4 leading-relaxed">
                  Create your first Shop For Me request to get started.
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-4 sm:px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-xs sm:text-sm hover:bg-gray-800 transition-colors rounded-lg"
                >
                  CREATE REQUEST
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <div key={request.id} className="p-4 sm:p-6 lg:p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 space-y-4 lg:space-y-0">
                      <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-monument-regular text-black mb-1 truncate">
                            {request.product_name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <a
                              href={request.product_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-geist-normal text-blue-600 hover:underline truncate"
                            >
                              {request.product_url}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 lg:min-w-[200px] lg:items-end">
                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full self-start lg:self-end ${getStatusColor(request.status)}`}
                        >
                          {getStatusIcon(request.status)}
                          <span className="text-xs font-monument-regular tracking-wider uppercase">
                            {request.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2 xl:space-y-0 xl:space-x-2">
                          <button
                            onClick={() => fetchRequestDetails(request.id)}
                            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 text-white text-xs hover:bg-gray-700 transition-colors rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                            <span>VIEW DETAILS</span>
                          </button>

                          {/* Payment button for quotation_ready status */}
                          {request.status === "quotation_ready" && (
                            <button
                              onClick={() => {
                                setSelectedRequestDetails(request)
                                setCurrentPhase("payment_preparation")
                                setActiveTab("create")
                              }}
                              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors rounded-lg"
                            >
                              PROCEED TO PAYMENT
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4">
                      <div>
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          Quantity
                        </label>
                        <div className="text-sm font-geist-normal text-black">
                          {request.quantity}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          Unit Price ({request.extracted_currency})
                        </label>
                        <div className="text-sm font-geist-normal text-black">
                          {request.extracted_price ? `${request.extracted_price} ${request.extracted_currency}` : "TBD"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          Local Price ({request.user_currency})
                        </label>
                        <div className="text-sm font-geist-normal text-black">
                          {request.extracted_price_local ? `${request.extracted_price_local} ${request.user_currency}` : "TBD"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          Final Cost ({request.user_currency})
                        </label>
                        <div className="text-lg font-monument-regular text-black flex items-center space-x-2">
                          <span>{request.total_cost_local ? `${request.total_cost_local} ${request.user_currency}` : "TBD"}</span>
                          {request.total_cost_local && (
                            <button
                              onClick={() => {
                                setSelectedRequestForBreakdown(request)
                                setShowPriceBreakdown(true)
                              }}
                              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-md transition-colors"
                              title="See price breakdown"
                            >
                              Why is Cost?
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price Summary Section
                    {request.total_cost_local && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-monument-regular text-green-700 tracking-widest uppercase">
                            Price Summary
                          </label>
                          <button
                            onClick={() => {
                              setSelectedRequestForBreakdown(request)
                              setShowPriceBreakdown(true)
                            }}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors font-monument-regular tracking-wider uppercase"
                          >
                            Why This Price?
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-xs font-monument-regular text-green-600 tracking-widest uppercase">
                              Subtotal:
                            </span>
                            <span className="ml-2 font-geist-normal text-green-800">
                              {request.subtotal_before_gst} {request.user_currency}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-monument-regular text-green-600 tracking-widest uppercase">
                              GST:
                            </span>
                            <span className="ml-2 font-geist-normal text-green-800">
                              {request.gst_amount} {request.user_currency}
                            </span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-sm font-monument-regular text-green-700 tracking-widest uppercase">
                              Total:
                            </span>
                            <span className="ml-2 text-lg font-monument-regular text-green-800">
                              {request.total_cost_local} {request.user_currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {request.notes && (
                      <div className="mb-4">
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          Notes
                        </label>
                        <div className="text-sm font-geist-normal text-black bg-gray-50 p-3 rounded-lg leading-relaxed">
                          {request.notes}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs font-geist-normal text-gray-500">
                      <span>Created: {new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payment Preparation Phase */}
        {currentPhase === "payment_preparation" && selectedRequestDetails && (
          <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gray-700" />
                <h2 className="text-lg sm:text-xl font-monument-regular text-black tracking-wider uppercase">
                  STEP 3: PAYMENT PREPARATION
                </h2>
              </div>
              <button
                onClick={() => {
                  setCurrentPhase("url_validation")
                  setSelectedRequestDetails(null)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>
            </div>

            {/* Request Summary */}
            <div className="mb-4 sm:mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-monument-regular text-black tracking-wider uppercase mb-2">
                Request Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                    Product:
                  </span>
                  <span className="ml-2 text-sm font-geist-normal text-black">
                    {selectedRequestDetails.product_name}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                    Total Cost:
                  </span>
                  <span className="ml-2 text-lg font-monument-regular text-black">
                    {selectedRequestDetails.total_cost}
                  </span>
                </div>

              </div>
            </div>

            {/* Address Selection */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-3">
                Select Shipping Address
              </label>

              {isLoadingAddresses ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAddress?.id === address.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                            <h4 className="text-sm font-monument-regular text-black tracking-wider">
                              {address.name || address.full_name}
                            </h4>
                            {address.is_default && <Badge className="bg-blue-100 text-blue-800 text-xs self-start">DEFAULT</Badge>}
                          </div>
                          <div className="flex items-start space-x-1 text-xs font-geist-normal text-black mb-1">
                            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{formatAddress(address)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs font-geist-normal text-black">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{address.phone || address.phone_number}</span>
                          </div>
                        </div>
                        {selectedAddress?.id === address.id && (
                          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => prepareForPayment(selectedRequestDetails.id)}
              disabled={isPreparing || !selectedAddress}
              className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-xs sm:text-sm hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
            >
              {isPreparing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  PREPARING...
                </>
              ) : (
                "PREPARE FOR PAYMENT"
              )}
            </button>
          </div>
        )}

        {/* Payment Processing Phase */}
        {currentPhase === "payment_processing" && paymentPreparation && (
          <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gray-700" />
                <h2 className="text-lg sm:text-xl font-monument-regular text-black tracking-wider uppercase">
                  STEP 4: PAYMENT PROCESSING
                </h2>
              </div>
              <button
                onClick={() => setCurrentPhase("payment_preparation")}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>
            </div>

            {/* Payment Summary */}
            <div className="mb-4 sm:mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-monument-regular text-black tracking-wider uppercase mb-3">
                Payment Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">Amount:</span>
                  <span className="ml-2 text-lg font-monument-regular text-black">
                    ${paymentPreparation.total_cost}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                    Request ID:
                  </span>
                  <span className="ml-2 text-sm font-geist-normal text-black">
                    #{paymentPreparation.shop_for_me_request_id}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-3">
                Select Payment Method
              </label>

              <div className="space-y-3">
                {/* PayPal Option */}
                <div
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "paypal"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-black flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-monument-regular text-black tracking-wider">PayPal</h4>
                        <p className="text-xs font-geist-normal text-black">
                          Pay securely with PayPal
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "paypal" && (
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Wallet Option */}
                <div
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "wallet"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  onClick={() => setPaymentMethod("wallet")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wallet className="h-5 w-5 text-black flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-monument-regular text-black tracking-wider">Wallet</h4>
                        <p className="text-xs font-geist-normal text-black">
                          Balance: ${walletInfo ? (Number.parseFloat(walletInfo.balance) || 0).toFixed(2) : "0.00"}
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "wallet" && (
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet PIN Input */}
            {paymentMethod === "wallet" && (
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Wallet PIN
                </label>
                <Input
                  type="password"
                  maxLength={4}
                  value={walletPin}
                  onChange={(e) => setWalletPin(e.target.value)}
                  placeholder="••••"
                  className="w-32 h-10 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-geist-normal text-sm text-center focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={paymentMethod === "paypal" ? processPayPalPayment : processWalletPayment}
              disabled={
                isProcessingPayment ||
                !paymentMethod ||
                (paymentMethod === "wallet" && (!walletPin || walletPin.length !== 4))
              }
              className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-xs sm:text-sm hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  PROCESSING PAYMENT...
                </>
              ) : (
                <>
                  {paymentMethod === "paypal" ? <CreditCard className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                  <span>PAY ${paymentPreparation.total_cost}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Process Steps */}
        <div className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-monument-regular text-black tracking-widest">VALIDATION</h3>
            <p className="mt-1 font-geist-normal text-xs text-gray-500 leading-relaxed">VERIFY PRODUCT URL</p>
          </div>
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-monument-regular text-black tracking-widest">REQUEST</h3>
            <p className="mt-1 font-geist-normal text-xs text-gray-500 leading-relaxed">CREATE YOUR REQUEST</p>
          </div>
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-monument-regular text-black tracking-widest">REVIEW</h3>
            <p className="mt-1 font-geist-normal text-xs text-gray-500 leading-relaxed">ADMIN QUOTATION</p>
          </div>
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-monument-regular text-black tracking-widest">PAYMENT</h3>
            <p className="mt-1 font-geist-normal text-xs text-gray-500 leading-relaxed">COMPLETE ORDER</p>
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      {showRequestModal && selectedRequestDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-monument-regular text-black tracking-wider uppercase">
                Request #{selectedRequestDetails.id} Details
              </h3>
              <button
                onClick={() => {
                  setShowRequestModal(false)
                  setSelectedRequestDetails(null)
                }}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Status */}
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Status
                </label>
                <div
                  className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(selectedRequestDetails.status)}`}
                >
                  {getStatusIcon(selectedRequestDetails.status)}
                  <span className="text-xs font-monument-regular tracking-wider uppercase">
                    {selectedRequestDetails.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Product Name
                  </label>
                  <div className="text-sm font-geist-normal text-black">
                    {selectedRequestDetails.product_name}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Quantity
                  </label>
                  <div className="text-sm font-geist-normal text-black">
                    {selectedRequestDetails.quantity}
                  </div>
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                  Product URL
                </label>
                <a
                  href={selectedRequestDetails.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-geist-normal text-blue-600 hover:underline break-all leading-relaxed"
                >
                  {selectedRequestDetails.product_url}
                </a>
              </div>

              {/* Pricing */}
              {selectedRequestDetails.admin_quoted_price && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="block text-xs font-monument-regular text-blue-700 tracking-widest uppercase mb-2">
                    Admin Quotation
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-monument-regular text-blue-600 tracking-widest uppercase">
                        Quoted Price:
                      </span>
                      <span className="ml-2 text-sm font-geist-normal text-blue-800">
                        ${selectedRequestDetails.admin_quoted_price}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-monument-regular text-blue-600 tracking-widest uppercase">
                        Total Cost:
                      </span>
                      <span className="ml-2 text-lg font-monument-regular text-blue-800">
                        {selectedRequestDetails.total_cost}
                      </span>
                    </div>
                  </div>
                  {selectedRequestDetails.admin_notes && (
                    <div className="mt-2">
                      <span className="text-xs font-monument-regular text-blue-600 tracking-widest uppercase">
                        Notes:
                      </span>
                      <div className="text-sm font-geist-normal text-blue-700 mt-1 leading-relaxed">
                        {selectedRequestDetails.admin_notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedRequestDetails.notes && (
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Your Notes
                  </label>
                  <div className="text-sm font-geist-normal text-black bg-gray-50 p-3 rounded-lg leading-relaxed">
                    {selectedRequestDetails.notes}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Created At
                  </label>
                  <div className="text-sm font-geist-normal text-black">
                    {new Date(selectedRequestDetails.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Updated At
                  </label>
                  <div className="text-sm font-geist-normal text-black">
                    {new Date(selectedRequestDetails.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Breakdown Modal */}
      {showPriceBreakdown && selectedRequestForBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-monument-regular text-black tracking-wider uppercase">
                Price Breakdown
              </h3>
              <button
                onClick={() => {
                  setShowPriceBreakdown(false)
                  setSelectedRequestForBreakdown(null)
                }}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Product Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-monument-regular text-black tracking-wider uppercase mb-2">
                  Product: {selectedRequestForBreakdown.product_name}
                </h4>
                <div className="text-xs text-black">
                  Quantity: {selectedRequestForBreakdown.quantity}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                    Original Price ({selectedRequestForBreakdown.extracted_currency})
                  </span>
                  <span className="text-sm font-geist-normal text-black">
                    {selectedRequestForBreakdown.extracted_price} {selectedRequestForBreakdown.extracted_currency}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                    Local Price ({selectedRequestForBreakdown.user_currency})
                  </span>
                  <span className="text-sm font-geist-normal text-black">
                    {selectedRequestForBreakdown.extracted_price_local} {selectedRequestForBreakdown.user_currency}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                    Subtotal (Before GST)
                  </span>
                  <span className="text-sm font-geist-normal text-black">
                    {selectedRequestForBreakdown.subtotal_before_gst} {selectedRequestForBreakdown.user_currency}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                    Company Cost
                  </span>
                  <span className="text-sm font-geist-normal text-black">
                    {selectedRequestForBreakdown.company_cost} {selectedRequestForBreakdown.user_currency}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                    GST Amount
                  </span>
                  <span className="text-sm font-geist-normal text-black">
                    {selectedRequestForBreakdown.gst_amount} {selectedRequestForBreakdown.user_currency}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded-lg border-2 border-blue-200">
                  <span className="text-base font-monument-regular text-blue-800 tracking-wider uppercase">
                    Total Cost
                  </span>
                  <span className="text-lg font-monument-regular text-blue-800">
                    {selectedRequestForBreakdown.total_cost_local} {selectedRequestForBreakdown.user_currency}
                  </span>
                </div>

                {/* Conversion Info */}
                {selectedRequestForBreakdown.conversion_date && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <div className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                      Exchange Rate Applied
                    </div>
                    <div className="text-xs text-black">
                      Converted on: {new Date(selectedRequestForBreakdown.conversion_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.3)'
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
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.3)'
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

            {/* Thumbnail Strip */}
            {validationData.images.length > 1 && (
              <div
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2 rounded-xl"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {validationData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${index === currentImageIndex
                      ? 'ring-2 ring-white scale-110'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      background: index === currentImageIndex ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      backdropFilter: 'blur(5px)',
                      WebkitBackdropFilter: 'blur(5px)'
                    }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-15 h-15 rounded object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMEMyNS41MjI4IDMwIDMwIDI1LjUyMjggMzAgMjBDMzAgMTQuNDc3MiAyNS41MjI4IDEwIDIwIDEwQzE0LjQ3NzIgMTAgMTAgMTQuNDc3MiAxMCAyMEMxMCAyNS41MjI4IDE0LjQ3NzIgMzAgMjAgMzBaIiBmaWxsPSIjOTlBM0FGIi8+CjxwYXRoIGQ9Ik01IDQ1TDI1IDM1TDQ1IDQ1VjUwSDVWNDVaIiBmaWxsPSIjOTlBM0FGIi8+Cjwvc3ZnPg==';
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
    </div>
  )
}
