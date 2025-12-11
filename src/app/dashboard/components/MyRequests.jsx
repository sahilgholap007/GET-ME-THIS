"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, ExternalLink, Eye, RefreshCw, Wallet, X, CheckCircle, Clock, AlertCircle, CreditCard, MapPin, Phone, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import axiosInstance from "../../utils/axiosInstance"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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

const getStatusMessage = (status) => {
    switch (status) {
        case "pending_review":
            return "Your request is under review. It may take 1-2 hours to approve."
        case "url_validated":
            return "URL validated successfully. Waiting for quotation."
        case "quotation_ready":
            return "Quotation is ready! Review and proceed to payment."
        case "awaiting_payment":
            return "Awaiting payment to proceed with your order."
        case "order_placed":
            return "Order placed successfully! Your item will arrive in 7-14 days."
        case "paid":
            return "Payment received. Your order is being processed."
        case "processing":
            return "Your order is being processed and will ship soon."
        case "arrived_at_warehouse":
            return "Your item has arrived at our warehouse."
        case "completed":
            return "Order completed and delivered successfully!"
        case "cancelled":
            return "This request has been cancelled."
        default:
            return null
    }
}

export default function MyRequests() {
    const router = useRouter()

    const [requests, setRequests] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedRequestDetails, setSelectedRequestDetails] = useState(null)
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)
    const [selectedRequestForBreakdown, setSelectedRequestForBreakdown] = useState(null)
    const [walletInfo, setWalletInfo] = useState(null)
    console.log(requests)
    // Image popup states
    const [showImagePopup, setShowImagePopup] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [currentRequestImages, setCurrentRequestImages] = useState([])
    // Payment states
    const [showPaymentFlow, setShowPaymentFlow] = useState(false)
    const [currentPaymentPhase, setCurrentPaymentPhase] = useState("preparation") // preparation, processing
    const [addresses, setAddresses] = useState([])
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
    const [isPreparing, setIsPreparing] = useState(false)
    const [paymentPreparation, setPaymentPreparation] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("")
    const [walletPin, setWalletPin] = useState("")
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)
    // Carrier selection states
    const [shippingOptions, setShippingOptions] = useState([])
    const [selectedCarrier, setSelectedCarrier] = useState(null)
    const [selectedShippingRate, setSelectedShippingRate] = useState(null)
    const [isLoadingShippingOptions, setIsLoadingShippingOptions] = useState(false)

    useEffect(() => {
        fetchRequests()
        fetchWalletInfo()
    }, [])

    const handleKeyDown = (e) => {
        if (!showImagePopup) return

        if (e.key === 'Escape') {
            closeImagePopup()
        }
        // Navigation will be handled in the modal
    }

    useEffect(() => {
        if (showImagePopup) {
            document.addEventListener('keydown', handleKeyDown)
            return () => document.removeEventListener('keydown', handleKeyDown)
        }
    }, [showImagePopup])

    const fetchRequests = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get("/api/v1/shopforme/requests/")
            setRequests(response.data)
        } catch (err) {
            console.error("Failed to load requests:", err)
            toast.error("Failed to load requests")
        } finally {
            setIsLoading(false)
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

    const fetchAddresses = async () => {
        try {
            setIsLoadingAddresses(true)
            const response = await axiosInstance.get("/api/v1/users/address-book/")
            setAddresses(response.data)
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

    const fetchShippingOptions = async (requestId, requestData = null) => {
        try {
            setIsLoadingShippingOptions(true)
            // First try the ShopForMe shipping options endpoint
            const response = await axiosInstance.get(`/api/v1/shopforme/requests/${requestId}/shipping-options/`)
            console.log("Shipping options response:", response.data)

            // Normalize options so the UI always receives a predictable shape
            const normalize = (raw) => {
                // If item is already in nested shape (carrier: {name,...}) keep it but fill missing fields
                if (raw?.carrier && typeof raw.carrier === "object" && raw.carrier.name) {
                    return {
                        carrier: {
                            id: raw.carrier.id || raw.carrier_id || null,
                            name: raw.carrier.name,
                            tracking_url_template: raw.carrier.tracking_url_template || null
                        },
                        shipping_rate: {
                            id: raw.shipping_rate?.id || raw.rate_id || raw.shipping_rate_id || null,
                            rate_per_kg: raw.shipping_rate?.rate_per_kg || null,
                            base_rate: raw.shipping_rate?.base_rate || raw.base_cost_usd || null
                        },
                        service_type: raw.service_type || raw.service || raw.service_name || "Standard",
                        estimated_days: raw.estimated_days || raw.estimated_time || null,
                        estimated_cost_usd: raw.estimated_cost_usd || raw.estimated_cost || raw.base_cost_usd || null,
                        estimated_cost_local: raw.estimated_cost_local || raw.estimated_cost || null,
                        user_currency: raw.user_currency || raw.currency || null,
                        currency: raw.currency || raw.user_currency || null,
                        raw: raw
                    }
                }

                // If item is a flat ShopForMe style object, transform into nested shape
                if (raw?.carrier && typeof raw.carrier === "string") {
                    return {
                        carrier: {
                            id: raw.carrier_id || raw.carrierId || null,
                            name: raw.carrier,
                            tracking_url_template: null
                        },
                        shipping_rate: {
                            id: raw.rate_id || raw.rateId || null,
                            rate_per_kg: raw.estimated_cost ? (raw.estimated_cost / (raw.weight_kg || 1)) : null,
                            base_rate: raw.base_cost_usd || raw.estimated_cost || null
                        },
                        service_type: raw.service_type || raw.service || "Standard",
                        estimated_days: raw.estimated_days || null,
                        estimated_cost_usd: raw.estimated_cost || raw.base_cost_usd || null,
                        estimated_cost_local: raw.estimated_cost_local || raw.estimated_cost || null,
                        user_currency: raw.currency || raw.user_currency || null,
                        currency: raw.currency || raw.user_currency || null,
                        raw: raw
                    }
                }

                // Fallback - keep original if unexpected shape
                return raw
            }

            if (Array.isArray(response.data)) {
                const normalizedOptions = response.data.map(normalize)
                setShippingOptions(normalizedOptions)
            } else {
                setShippingOptions(response.data)
            }
        } catch (err) {
            console.error("ShopForMe shipping options failed:", err)
            // If ShopForMe endpoint fails, try general shipping calculation
            try {
                const request = requestData || selectedRequestDetails || await axiosInstance.get(`/api/v1/shopforme/requests/${requestId}/`).then(r => r.data)
                const destination = request.user_location?.country_code || 'US'
                const estimatedWeight = 1.5 // Default estimated weight in kg
                const currency = request.user_currency || 'USD'

                const shippingResponse = await axiosInstance.post('/api/v1/shipping/calculate-rates/', {
                    weight_kg: estimatedWeight,
                    destination_country: destination,
                    currency: currency
                })

                // Transform the response to match the expected format
                const transformedOptions = shippingResponse.data.map((option, index) => ({
                    carrier: {
                        id: option.carrier_id,
                        name: option.carrier,
                        tracking_url_template: null
                    },
                    shipping_rate: {
                        id: option.carrier_id,
                        rate_per_kg: option.estimated_cost / estimatedWeight,
                        base_rate: option.base_cost_usd || option.estimated_cost
                    },
                    service_type: option.carrier.split(' ')[1] || 'Standard',
                    estimated_days: option.estimated_days,
                    estimated_cost_usd: option.estimated_cost,
                    estimated_cost_local: option.estimated_cost, // Assuming same currency for now
                    user_currency: currency,
                    currency: option.currency
                }))

                setShippingOptions(transformedOptions)
                toast.info("Using estimated shipping rates. Actual rates may vary.")
            } catch (shippingErr) {
                console.error("General shipping calculation also failed:", shippingErr)
                setShippingOptions([])
                toast.error("Unable to load shipping options. Please contact support.")
            }
        } finally {
            setIsLoadingShippingOptions(false)
        }
    }

    const handleProceedToPayment = (request) => {
        setSelectedRequestDetails(request)
        setShowPaymentFlow(true)
        setCurrentPaymentPhase("preparation")
        fetchAddresses()
        fetchShippingOptions(request.id, request)
    }

    const prepareForPayment = async (requestId) => {
        if (!selectedAddress) {
            toast.error("Please select a shipping address")
            return
        }

        if (!selectedCarrier || !selectedShippingRate) {
            toast.error("Please select a shipping carrier and rate")
            return
        }

        // Prepare payment: try server-side prepare, otherwise set a local preparation object
        setIsPreparing(true)
        try {
            const payload = {
                shipping_address_id: selectedAddress.id,
                carrier_id: selectedCarrier?.carrier?.id || selectedCarrier?.carrier_id || selectedCarrier?.shipping_rate?.id || selectedCarrier?.carrier,
                shipping_rate_id: selectedShippingRate?.id,
            }

            // Try to call server prepare endpoint (if exists); fallback to local prepare on failure
            const response = await axiosInstance.post(`/api/v1/shopforme/requests/${requestId}/prepare-payment/`, payload)
            setPaymentPreparation(response.data)
            setCurrentPaymentPhase("processing")
            toast.success("Ready for payment!")
        } catch (err) {
            console.warn("No server-side payment prepare endpoint or it failed:", err)
            // Local basic preparation so UI can progress
            setPaymentPreparation({
                request_id: requestId,
                shipping_address_id: selectedAddress.id,
                carrier_id: selectedCarrier?.carrier?.id || selectedCarrier?.carrier_id || selectedCarrier?.shipping_rate?.id || selectedCarrier?.carrier,
                shipping_rate_id: selectedShippingRate?.id,
                amount: (parseFloat(selectedRequestDetails?.total_cost_local || 0) + parseFloat(selectedCarrier?.estimated_cost_local || selectedCarrier?.estimated_cost_usd || 0)).toFixed(2),
            })
            setCurrentPaymentPhase("processing")
            toast.info("Ready for payment (local preparation).")
        } finally {
            setIsPreparing(false)
        }
    }

    const processPayPalPayment = async () => {
        try {
            setIsProcessingPayment(true)
            const response = await axiosInstance.post(`/api/v1/shopforme/requests/${selectedRequestDetails.id}/pay/`, {
                payment_method: "paypal",
                shipping_address_id: selectedAddress.id,
                carrier_id: selectedCarrier.carrier.id,
                shipping_rate_id: selectedShippingRate.id,
            })
            if (response.data.approval_url) {
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

    const processWalletPayment = async () => {
        if (!walletPin || walletPin.length !== 4) {
            toast.error("Please enter a valid 4-digit PIN")
            return
        }

        try {
            setIsProcessingPayment(true)
            const response = await axiosInstance.post(`/api/v1/shopforme/requests/${selectedRequestDetails.id}/pay/`, {
                payment_method: "wallet",
                shipping_address_id: selectedAddress.id,
                carrier_id: selectedCarrier.carrier.id,
                shipping_rate_id: selectedShippingRate.id,
                pin: walletPin,
            })

            toast.success("Payment successful!")

            setTimeout(() => {
                setShowPaymentFlow(false)
                setCurrentPaymentPhase("preparation")
                setSelectedAddress(null)
                setSelectedCarrier(null)
                setSelectedShippingRate(null)
                setPaymentPreparation(null)
                setPaymentMethod("")
                setWalletPin("")
                fetchRequests()
                fetchWalletInfo()
            }, 2000)
        } catch (err) {
            console.error("Wallet payment error:", err)
            toast.error(err.response?.data?.message || "Wallet payment failed")
        } finally {
            setIsProcessingPayment(false)
        }
    }

    const formatAddress = (address) => {
        return `${address.street || address.address_line1}${address.street2 || address.address_line2 ? ", " + (address.street2 || address.address_line2) : ""}, ${address.city}, ${address.state || address.state_province_region} ${address.postal_code || address.zip_postal_code}, ${address.country}`
    }

    const handleRefresh = () => {
        fetchRequests()
    }

    const openImagePopup = (images, index) => {
        setCurrentRequestImages(images)
        setCurrentImageIndex(index)
        setShowImagePopup(true)
    }

    const closeImagePopup = () => {
        setShowImagePopup(false)
        setCurrentRequestImages([])
        setCurrentImageIndex(0)
    }

    const nextImage = () => {
        // This will be handled in the modal with the current request's images
    }

    const prevImage = () => {
        // This will be handled in the modal with the current request's images
    }

    const cancelRequest = async (requestId) => {
        try {
            await axiosInstance.post(`/api/v1/shopforme/requests/${requestId}/cancel/`)
            toast.success("Request cancelled successfully")
            fetchRequests() // Refresh the list
        } catch (err) {
            console.error("Failed to cancel request:", err)
            toast.error(err.response?.data?.message || "Failed to cancel request")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:py-12 font-geist-normal">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
                <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl border-2 border-gray-100 p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-monument-regular text-gray-800 uppercase leading-tight tracking-wider">
                                    My Shopping Requests
                                </h1>
                                <p className="text-gray-600 text-xs sm:text-sm font-geist-normal mt-1 leading-relaxed">
                                    Track and manage your orders
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            {/* Wallet Info */}
                            {walletInfo && (
                                <div className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
                                    <Wallet className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span className="text-sm font-monument-regular text-green-800 tracking-wider">
                                        ${(Number.parseFloat(walletInfo.balance) || 0).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={() => router.push("/user-dashboard/personal-shopper/create-request")}
                                className="group relative inline-flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 rounded-full text-xs font-giest uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <Package className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                                <span>Create Request</span>
                            </button>

                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="flex items-center space-x-2 px-5 py-3 bg-gray-800 text-white font-giest tracking-wider text-xs hover:bg-gray-700 transition-all duration-300 rounded-full shadow-md disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Payment Flow */}
                {showPaymentFlow && selectedRequestDetails && (
                    <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl border-2 border-gray-100 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                            <div className="flex items-center">
                                <CreditCard className="h-5 w-5 mr-2 text-gray-700" />
                                <h2 className="text-lg sm:text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                                    {currentPaymentPhase === "preparation" ? "PAYMENT PREPARATION" : "PAYMENT PROCESSING"}
                                </h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPaymentFlow(false)
                                    setCurrentPaymentPhase("preparation")
                                    setSelectedAddress(null)
                                    setSelectedCarrier(null)
                                    setSelectedShippingRate(null)
                                    setPaymentPreparation(null)
                                    setPaymentMethod("")
                                    setWalletPin("")
                                }}
                                className="flex items-center space-x-2 px-5 py-2.5 bg-gray-800 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-700 transition-all duration-300 rounded-full shadow-md self-start sm:self-auto"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>BACK TO REQUESTS</span>
                            </button>
                        </div>

                        {currentPaymentPhase === "preparation" && (
                            <>
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
                                                {selectedRequestDetails.total_cost} {selectedRequestDetails.extracted_currency} =  {selectedRequestDetails.total_cost_local} {selectedRequestDetails.user_currency}
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

                                {/* Carrier Selection */}
                                <div className="mb-4 sm:mb-6">
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-3">
                                        Select Shipping Carrier & Rate
                                    </label>

                                    {isLoadingShippingOptions ? (
                                        <div className="animate-pulse space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                                            ))}
                                        </div>
                                    ) : shippingOptions.length === 0 ? (
                                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-sm text-gray-600 font-geist-normal tracking-wide">
                                                No shipping options available for this request
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {shippingOptions.map((option, index) => (
                                                <div
                                                    key={option?.shipping_rate?.id || option?.carrier?.id || index}
                                                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedCarrier?.shipping_rate?.id === option?.shipping_rate?.id
                                                        ? "border-black bg-gray-50"
                                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                                        }`}
                                                    onClick={() => {
                                                        setSelectedCarrier(option)
                                                        setSelectedShippingRate(option.shipping_rate)
                                                    }}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <h4 className="text-sm font-monument-regular text-black tracking-wider">
                                                                    {option.carrier?.name || option.carrier} - {option.service_type}
                                                                </h4>
                                                                <Badge className="bg-green-100 text-green-800 text-xs">
                                                                    {option.estimated_days ?? "-"} days
                                                                </Badge>
                                                            </div>
                                                            <div className="text-xs text-gray-600 font-geist-normal mb-2">
                                                                {option.carrier?.tracking_url_template ? "Tracking available" : "No tracking"}
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-sm font-monument-regular text-black">
                                                                    Shipping Cost: {option.user_currency || option.currency} {Number(option.estimated_cost_local || option.estimated_cost_usd || 0).toFixed(2)}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    Base: {option.currency || option.user_currency} {Number(option.estimated_cost_usd || option.estimated_cost_local || 0).toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {selectedCarrier?.shipping_rate?.id === option?.shipping_rate?.id && (
                                                            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0 ml-4">
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
                                    disabled={isPreparing || !selectedAddress || !selectedCarrier}
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
                            </>
                        )}

                        {currentPaymentPhase === "processing" && paymentPreparation && (
                            <>
                                {/* Payment Summary */}
                                <div className="mb-4 sm:mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <h3 className="text-sm font-monument-regular text-black tracking-wider uppercase mb-3">
                                        Payment Summary
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">Amount:</span>
                                            <span className="ml-2 text-lg font-monument-regular text-black">
                                                {selectedRequestDetails.total_cost} {selectedRequestDetails.extracted_currency} =  {selectedRequestDetails.total_cost_local} {selectedRequestDetails.user_currency}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                                                Shipping:
                                            </span>
                                            <span className="ml-2 text-sm font-geist-normal text-black">
                                                {selectedCarrier?.carrier?.name || selectedCarrier?.carrier} - {selectedCarrier?.service_type} ({selectedCarrier?.user_currency || selectedCarrier?.currency} {Number(selectedCarrier?.estimated_cost_local || selectedCarrier?.estimated_cost_usd || 0).toFixed(2)})
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                                                Request ID:
                                            </span>
                                            <span className="ml-2 text-sm font-geist-normal text-black">
                                                #{selectedRequestDetails.id}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                                                Total:
                                            </span>
                                            <span className="ml-2 text-lg font-monument-regular text-black">
                                                {(parseFloat(selectedRequestDetails.total_cost_local) + parseFloat(selectedCarrier?.estimated_cost_local || 0)).toFixed(2)} {selectedRequestDetails.user_currency}
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
                                            <span>PAY {(parseFloat(selectedRequestDetails.total_cost_local) + parseFloat(selectedCarrier?.estimated_cost_local || 0)).toFixed(2)} {selectedRequestDetails.user_currency}</span>
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Requests List */}
                {!showPaymentFlow && (
                    <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl border-2 border-gray-100 overflow-hidden">
                        <div className="p-4 sm:p-6 lg:p-8 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <h2 className="text-lg sm:text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                                    All Requests ({requests.length})
                                </h2>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="p-4 sm:p-6 lg:p-8">
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-24 sm:h-28 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl"></div>
                                    ))}
                                </div>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-16 sm:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-monument-regular text-gray-800 tracking-wider uppercase mb-3">
                                    No requests yet
                                </h3>
                                <p className="text-sm sm:text-base font-geist-normal text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
                                    Create your first Shop For Me request to get started
                                </p>
                                <button
                                    onClick={() => router.push("/user-dashboard/personal-shopper/create-request")}
                                    className="group relative inline-flex items-center justify-center space-x-2 bg-black text-white px-8 py-4 rounded-full text-sm font-monument-regular uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <Package className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                    <span>Create Request</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:p-8">
                                {requests.map((request) => (
                                    <div key={request.id} className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        <div className="flex flex-col lg:flex-row">
                                            {/* Left side - Product Image */}
                                            <div className="lg:w-48 h-48 lg:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 relative overflow-hidden cursor-pointer group"
                                                onClick={() => request.extracted_images && request.extracted_images.length > 0 && openImagePopup(request.extracted_images, 0)}>
                                                {request.primary_image ? (
                                                    <img
                                                        src={request.primary_image}
                                                        alt={request.product_name}
                                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-2xl"
                                                        style={{
                                                            transformStyle: 'preserve-3d',
                                                            transform: 'perspective(1000px)'
                                                        }}
                                                    />
                                                ) : (
                                                    <Package className="h-20 w-20 text-gray-400 transition-all duration-300 group-hover:scale-110" />
                                                )}

                                            </div>

                                            {/* Middle - Product Details */}
                                            <div className="flex-1 p-6">
                                                {/* Product Title */}
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    {request.product_name}
                                                </h3>

                                                {/* Product Meta */}
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                    <span>Request ID: #{request.id}</span>
                                                    <span>•</span>
                                                    <span className="capitalize bg-yellow-50 border border-yellow-200 px-2 rounded-full text-yellow-700">{request.status.replace("_", " ")}</span>
                                                    {request.platform && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{request.platform}</span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Short Description */}
                                                {request.short_description && (
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        {request.short_description}
                                                    </p>
                                                )}

                                                {/* Status Message */}
                                                {getStatusMessage(request.status) && (
                                                    <div className={`flex items-start gap-2 p-3 rounded-lg mb-4 ${request.status === "pending_review" ? "bg-yellow-50 border border-yellow-200" :
                                                        request.status === "quotation_ready" ? "bg-blue-50 border border-blue-200" :
                                                            request.status === "order_placed" || request.status === "completed" ? "bg-green-50 border border-green-200" :
                                                                request.status === "cancelled" ? "bg-red-50 border border-red-200" :
                                                                    "bg-gray-50 border border-gray-200"
                                                        }`}>
                                                        <Clock className={`h-4 w-4 mt-0.5 flex-shrink-0 ${request.status === "pending_review" ? "text-yellow-600" :
                                                            request.status === "quotation_ready" ? "text-blue-600" :
                                                                request.status === "order_placed" || request.status === "completed" ? "text-green-600" :
                                                                    request.status === "cancelled" ? "text-red-600" :
                                                                        "text-gray-600"
                                                            }`} />
                                                        <span className={`text-xs font-medium ${request.status === "pending_review" ? "text-yellow-700" :
                                                            request.status === "quotation_ready" ? "text-blue-700" :
                                                                request.status === "order_placed" || request.status === "completed" ? "text-green-700" :
                                                                    request.status === "cancelled" ? "text-red-700" :
                                                                        "text-gray-700"
                                                            }`}>
                                                            {getStatusMessage(request.status)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Product URL */}
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                                                    <a
                                                        href={request.product_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-blue-600 hover:underline truncate"
                                                    >
                                                        View product page
                                                    </a>
                                                </div>

                                                {/* Badge tags */}
                                                <div className="flex gap-2 mb-4">
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                                                        Qty: {request.quantity}
                                                    </span>
                                                    {request.extracted_currency && (
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                            {request.extracted_currency}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Info Grid */}
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                                    <div className="flex items-start gap-2">
                                                        <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <div className="text-xs text-gray-500">Merchant</div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {request.platform || "Shop For Me"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <div className="text-xs text-gray-500">Base price</div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {request.extracted_price && parseFloat(request.extracted_price) > 0
                                                                    ? `${request.extracted_currency}${request.extracted_price}`
                                                                    : "TBD"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <div className="text-xs text-gray-500">ETA</div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {request.status === "order_placed" ? "7-14 days" : "Pending"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <div className="text-xs text-gray-500">Currency</div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {request.user_currency}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                {request.notes && (
                                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                        <div className="text-xs text-gray-500 mb-1">Notes</div>
                                                        <div className="text-sm text-gray-700">{request.notes}</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right side - Price and Action */}
                                            <div className="lg:w-80 bg-gray-50 p-6 flex flex-col">
                                                <div className="mb-4">
                                                    <div className="text-sm text-gray-600 mb-1">Delivered Price</div>
                                                    <div className="text-4xl font-bold text-gray-900">
                                                        {request.total_cost_local && parseFloat(request.total_cost_local) > 0 ? (
                                                            <>
                                                                <span className="text-2xl align-top">{request.user_currency}</span>
                                                                {request.total_cost_local}
                                                            </>
                                                        ) : (
                                                            <span className="text-2xl">TBD</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {request.total_cost_local && parseFloat(request.total_cost_local) > 0 && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRequestForBreakdown(request)
                                                            setShowPriceBreakdown(true)
                                                        }}
                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 text-left"
                                                    >
                                                        Why this price?
                                                    </button>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="space-y-3 mt-auto">
                                                    {request.status === "quotation_ready" && (
                                                        <button
                                                            onClick={() => handleProceedToPayment(request)}
                                                            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                                        >
                                                            Accept & Pay Now
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => fetchRequestDetails(request.id)}
                                                        className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                                                    >
                                                        View Full Details
                                                    </button>
                                                    <button
                                                        onClick={() => cancelRequest(request.id)}
                                                        className="w-full border-2 border-red-300 hover:border-red-400 text-red-700 py-3 px-4 rounded-lg font-medium transition-colors"
                                                    >
                                                        Cancel Request
                                                    </button>
                                                </div>

                                                {/* Created Date */}
                                                <div className="text-xs text-gray-500 mt-4 text-center">
                                                    Created {new Date(request.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>            {/* Request Details Modal */}
            {showRequestModal && selectedRequestDetails && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                }}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-white/30 shadow-2xl">
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
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                }}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border-2 border-white/30 shadow-2xl">
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
                                        Company Cost
                                    </span>
                                    <span className="text-sm font-geist-normal text-black">
                                        {selectedRequestForBreakdown.company_cost_local} {selectedRequestForBreakdown.user_currency}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                                        Subtotal (Before GST)
                                    </span>
                                    <span className="text-sm font-geist-normal text-black">
                                        {selectedRequestForBreakdown.subtotal_before_gst_local} {selectedRequestForBreakdown.user_currency}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-sm font-monument-regular text-black tracking-wider uppercase">
                                        GST Amount
                                    </span>
                                    <span className="text-sm font-geist-normal text-black">
                                        {selectedRequestForBreakdown.gst_amount_local} {selectedRequestForBreakdown.user_currency}
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
            {showImagePopup && (
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
                        {currentRequestImages.length > 1 && (
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + currentRequestImages.length) % currentRequestImages.length)}
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
                        {currentRequestImages.length > 1 && (
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % currentRequestImages.length)}
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
                                {currentRequestImages.length > 0 && (
                                    <img
                                        src={currentRequestImages[currentImageIndex]}
                                        alt={`Product image ${currentImageIndex + 1}`}
                                        className="max-w-[90vw] max-h-[60vh] sm:max-w-[80vw] sm:max-h-[70vh] object-contain rounded-lg sm:rounded-2xl"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDYwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNTAgMjI1QzI3Ny42MTQgMjI1IDMwMCAxOTcuNjE0IDMwMCAxNzBDMzAwIDE0Mi4zODYgMjc3LjYxNCAxMjAgMjUwIDEyMEMyMjIuMzg2IDEyMCAyMDAgMTQyLjM4NiAyMDAgMTcwQzIwMCAxOTcuNjE0IDIyMi4zODYgMjI1IDI1MCAyMjVaIiBmaWxsPSIjOTlBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMzMwTDMwMCAyNzBMNTAwIDMzMFYzODBIMTAwVjMzMFoiIGZpbGw9IiM5OUEzQUYiLz4KPHR4dCB4PSIzMDAiIHk9IjQyMCIgZmlsbD0iIzk5QTNBRiIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90eHQ+Cjwvc3ZnPg==';
                                        }}
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Image Counter */}
                        {currentRequestImages.length > 1 && (
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
                                    {currentImageIndex + 1} / {currentRequestImages.length}
                                </span>
                            </div>
                        )}

                        {/* Thumbnail Strip */}
                        {currentRequestImages.length > 1 && (
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
                                {currentRequestImages.map((image, index) => (
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
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgODAgNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI0YzRjRGRSIvPgo8cGF0aCBkPSJNMzAgMzVDMzUuNTIyOCAzNSA0MCAzMC41MjI4IDQwIDI1QzQwIDE5LjQ3NzIgMzUuNTIyOCAxNSAzMCAxNUMyNC40NzcyIDE1IDIwIDE5LjQ3NzIgMjAgMjVDMjAgMzAuNTIyOCAyNC40NzcyIDM1IDMwIDM1WiIgZmlsbD0iIzk5QTNBRiIvPgo8cGF0aCBkPSJNMTEgNDVMNDAgNDBMNjkgNDVWNTBIMTFWNDVaIiBmaWxsPSIjOTlBM0FGIi8+Cjwvc3ZnPg==';
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
