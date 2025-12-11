"use client"

import { useState } from "react"
import axiosInstance from "../../utils/axiosInstance"
import { Package, Search, ExternalLink, MapPin, Calendar, Truck, CheckCircle, Clock, AlertCircle, X } from "lucide-react"
import { toast } from "react-toastify"

const PublicTracker = () => {
    const [trackingNumber, setTrackingNumber] = useState("")
    const [trackingResult, setTrackingResult] = useState(null)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState(null)

    const handleTrack = async () => {
        if (!trackingNumber.trim()) {
            toast.error("Please enter a tracking number")
            return
        }

        setIsSearching(true)
        setError(null)
        setTrackingResult(null)

        try {
            const response = await axiosInstance.get(`/api/v1/shipping/track/${trackingNumber.trim()}/`)
            setTrackingResult(response.data)
        } catch (error) {
            console.error("Error tracking package:", error)

            if (error.response?.status === 404) {
                setError("Tracking number not found. Please check the number and try again.")
            } else {
                setError("Unable to track package. Please try again later.")
            }

            setTrackingResult(null)
        } finally {
            setIsSearching(false)
        }
    }

    const handleKeyPres = (e) => {
        if (e.key === 'Enter') {
            handleTrack()
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING_PAYMENT":
                return "bg-yellow-100 text-yellow-800"
            case "PROCESSING":
                return "bg-blue-100 text-blue-800"
            case "IN_TRANSIT":
                return "bg-purple-100 text-purple-800"
            case "DELIVERED":
                return "bg-green-100 text-green-800"
            case "EXCEPTION":
                return "bg-orange-100 text-orange-800"
            case "CANCELLED":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "PENDING_PAYMENT":
                return <Clock className="h-4 w-4" />
            case "PROCESSING":
                return <Package className="h-4 w-4" />
            case "IN_TRANSIT":
                return <Truck className="h-4 w-4" />
            case "DELIVERED":
                return <CheckCircle className="h-4 w-4" />
            case "EXCEPTION":
                return <AlertCircle className="h-4 w-4" />
            case "CANCELLED":
                return <X className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const getTrackingStatusIcon = (trackingStatus) => {
        switch (trackingStatus) {
            case "LABEL_CREATED":
                return <Package className="h-4 w-4 text-blue-600" />
            case "PICKED_UP":
                return <Truck className="h-4 w-4 text-purple-600" />
            case "IN_TRANSIT":
                return <Truck className="h-4 w-4 text-purple-600" />
            case "OUT_FOR_DELIVERY":
                return <MapPin className="h-4 w-4 text-orange-600" />
            case "DELIVERED":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "EXCEPTION":
                return <AlertCircle className="h-4 w-4 text-red-600" />
            case "RETURNED":
                return <X className="h-4 w-4 text-red-600" />
            default:
                return <Clock className="h-4 w-4 text-gray-600" />
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString()
    }

    const formatStatusText = (status) => {
        return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-monument-regular text-gray-800 tracking-[0.1em] uppercase mb-2">
                        Track Your Package
                    </h1>
                    <p className="text-gray-500 text-sm tracking-wider uppercase">
                        Enter your tracking number to get real-time updates
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                onKeyPress={handleKeyPres}
                                placeholder="Enter tracking number (e.g., TRK123456789)"
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleTrack}
                            disabled={isSearching}
                            className="flex items-center justify-center space-x-2 px-8 py-3 bg-black text-white font-monument-regular tracking-wider text-sm hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
                        >
                            <Search className="h-4 w-4" />
                            <span>{isSearching ? "Tracking..." : "Track"}</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <p className="text-sm font-monument-regular text-red-800 tracking-wider">{error}</p>
                        </div>
                    </div>
                )}

                {/* Tracking Results */}
                {trackingResult && (
                    <div className="space-y-8">
                        {/* Shipment Overview */}
                        <div className="bg-white shadow-xl rounded-2xl p-8">
                            <h2 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase mb-6">
                                Shipment Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Tracking Number
                                    </label>
                                    <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                                        {trackingResult.outbound_tracking_number}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Status
                                    </label>
                                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(trackingResult.status)}`}>
                                        {getStatusIcon(trackingResult.status)}
                                        <span className="text-xs font-monument-regular tracking-wider uppercase">
                                            {formatStatusText(trackingResult.status)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Carrier
                                    </label>
                                    <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                                        {trackingResult.carrier_name}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Total Cost
                                    </label>
                                    <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                                        {trackingResult.currency ?
                                            new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: trackingResult.currency
                                            }).format(trackingResult.total_cost) :
                                            `$${trackingResult.total_cost}`
                                        }
                                    </div>
                                </div>

                                {trackingResult.shipped_at && (
                                    <div>
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                            Shipped Date
                                        </label>
                                        <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                                            {formatDate(trackingResult.shipped_at)}
                                        </div>
                                    </div>
                                )}

                                {(trackingResult.tracking_url || trackingResult.outbound_tracking_number) && (
                                    <div>
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                            Carrier Tracking
                                        </label>
                                        {trackingResult.tracking_url ? (
                                            <a
                                                href={trackingResult.tracking_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-1 text-sm font-monument-regular text-blue-600 hover:underline"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                <span>Track on {trackingResult.carrier_name}</span>
                                            </a>
                                        ) : (
                                            <div className="text-sm font-monument-ultralight text-gray-600 tracking-wider">
                                                Tracking URL will be available once shipment is processed
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tracking History */}
                        {trackingResult.tracking_history && trackingResult.tracking_history.length > 0 && (
                            <div className="bg-white shadow-xl rounded-2xl p-8">
                                <h2 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase mb-6">
                                    Tracking History
                                </h2>

                                <div className="space-y-4">
                                    {trackingResult.tracking_history.map((tracking, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-start space-x-4 p-4 rounded-lg ${tracking.is_current ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                {getTrackingStatusIcon(tracking.status)}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="text-sm font-monument-regular text-gray-800 tracking-wider">
                                                        {formatStatusText(tracking.status)}
                                                    </h3>
                                                    <span className="text-xs font-monument-ultralight text-gray-600 tracking-wider">
                                                        {formatDate(tracking.timestamp)}
                                                    </span>
                                                </div>

                                                {tracking.description && (
                                                    <p className="text-xs font-monument-ultralight text-gray-600 tracking-wider mb-1">
                                                        {tracking.description}
                                                    </p>
                                                )}

                                                {tracking.location && (
                                                    <div className="flex items-center space-x-1 text-xs font-monument-ultralight text-gray-500 tracking-wider">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{tracking.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Packages */}
                        {trackingResult.packages && trackingResult.packages.length > 0 && (
                            <div className="bg-white shadow-xl rounded-2xl p-8">
                                <h2 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase mb-6">
                                    Package Contents ({trackingResult.packages.length})
                                </h2>

                                <div className="grid gap-4">
                                    {trackingResult.packages.map((pkg, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <Package className="h-5 w-5 text-gray-600" />
                                                <div>
                                                    <div className="text-sm font-monument-regular text-gray-800">
                                                        Package #{pkg.id}
                                                    </div>
                                                    <div className="text-xs font-monument-ultralight text-gray-600">
                                                        From: {pkg.sender_name}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-sm font-monument-regular text-gray-800">
                                                    {pkg.weight} kg
                                                </div>
                                                {pkg.length && pkg.width && pkg.height && (
                                                    <div className="text-xs font-monument-ultralight text-gray-600">
                                                        {pkg.length}×{pkg.width}×{pkg.height} cm
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Help Section */}
                <div className="bg-white shadow-xl rounded-2xl p-8 mt-8">
                    <h2 className="text-lg font-monument-regular text-gray-800 tracking-wider uppercase mb-4">
                        Need Help?
                    </h2>
                    <div className="text-sm font-monument-ultralight text-gray-600 tracking-wider space-y-2">
                        <p>• Tracking numbers are usually provided after your shipment is created</p>
                        <p>• It may take 24-48 hours for tracking information to appear</p>
                        <p>• Contact customer support if you're having trouble tracking your package</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicTracker