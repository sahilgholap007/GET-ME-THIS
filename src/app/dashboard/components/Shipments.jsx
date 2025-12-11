"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "../../utils/axiosInstance"
import {
  Package,
  Truck,
  Calendar,
  DollarSign,
  RefreshCw,
  Filter,
  MapPin,
  X,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Shipments = () => {
  const [shipments, setShipments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)

  // Filter states
  const [statusFilter, setStatusFilter] = useState("")
  const [carrierFilter, setCarrierFilter] = useState("")
  const [createdAtGte, setCreatedAtGte] = useState("")
  const [createdAtLte, setCreatedAtLte] = useState("")
  const [shippedAtGte, setShippedAtGte] = useState("")
  const [shippedAtLte, setShippedAtLte] = useState("")

  const [availableCarriers, setAvailableCarriers] = useState([])
  const [availableStatuses, setAvailableStatuses] = useState([])

  const fetchShipments = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      if (carrierFilter) params.carrier = carrierFilter
      if (createdAtGte) params.created_at_gte = createdAtGte
      if (createdAtLte) params.created_at_lte = createdAtLte
      if (shippedAtGte) params.shipped_at_gte = shippedAtGte
      if (shippedAtLte) params.shipped_at_lte = shippedAtLte

      console.log("Fetching shipments with params:", params)

      const response = await axiosInstance.get("/api/v1/shipping/shipments/", { params })
      setShipments(response.data)

      // Extract unique carriers for filter dropdown
      const uniqueCarriers = Array.from(new Set(response.data.map((s) => s.carrier?.id).filter(Boolean))).map((id) => {
        const carrier = response.data.find((s) => s.carrier?.id === id)?.carrier
        return { id: carrier.id, name: carrier.name }
      })
      setAvailableCarriers(uniqueCarriers)

      // Fetch status choices if not already fetched or if needed
      if (availableStatuses.length === 0) {
        const statusResponse = await axiosInstance.get("/api/v1/shipping/status-choices/")
        setAvailableStatuses(statusResponse.data)
      }
    } catch (error) {
      console.error("Error fetching shipments:", error)
      toast.error("Failed to load shipments.")
      setShipments([])
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, carrierFilter, createdAtGte, createdAtLte, shippedAtGte, shippedAtLte, availableStatuses.length])

  useEffect(() => {
    fetchShipments()
  }, [fetchShipments])

  const handleRefresh = () => {
    fetchShipments()
  }

  const handleClearFilters = () => {
    setStatusFilter("")
    setCarrierFilter("")
    setCreatedAtGte("")
    setCreatedAtLte("")
    setShippedAtGte("")
    setShippedAtLte("")
    // fetchShipments will be called via useEffect due to filter state changes
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
      // Legacy status support
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return <DollarSign className="h-4 w-4" />
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
      // Legacy status support
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAddress = (address) => {
    if (!address) return "N/A"
    return `${address.address_line1}${address.address_line2 ? ", " + address.address_line2 : ""}, ${address.city}, ${address.state} ${address.postal_code}, ${address.country}`
  }

  const formatDimensions = (length, width, height) => {
    return `${length || 0} × ${width || 0} × ${height || 0} cm`
  }

  const handleViewDetails = async (shipmentId) => {
    try {
      const response = await axiosInstance.get(`/api/v1/shipping/shipments/${shipmentId}/`)
      setSelectedShipment(response.data)
      setShowDetailModal(true)
    } catch (error) {
      console.error("Error fetching shipment details:", error)
      toast.error("Failed to load shipment details.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-12 font-monument-ultralight">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 font-monument-ultralight">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-monument-regular text-gray-800 tracking-[0.1em] uppercase">Shipments</h1>
                <p className="text-gray-500 text-sm tracking-wider uppercase mt-1">
                  Track and manage your outgoing shipments
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>REFRESH</span>
            </button>
          </div>

          {/* Filters Section */}
          <div className="p-6 bg-gray-50 rounded-xl mb-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2 text-gray-700" />
              <h2 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  {availableStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Carrier
                </label>
                <select
                  value={carrierFilter}
                  onChange={(e) => setCarrierFilter(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">All Carriers</option>
                  {availableCarriers.map((carrier) => (
                    <option key={carrier.id} value={carrier.id}>
                      {carrier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Created After
                </label>
                <input
                  type="date"
                  value={createdAtGte}
                  onChange={(e) => setCreatedAtGte(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Created Before
                </label>
                <input
                  type="date"
                  value={createdAtLte}
                  onChange={(e) => setCreatedAtLte(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Shipped After
                </label>
                <input
                  type="date"
                  value={shippedAtGte}
                  onChange={(e) => setShippedAtGte(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Shipped Before
                </label>
                <input
                  type="date"
                  value={shippedAtLte}
                  onChange={(e) => setShippedAtLte(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={fetchShipments}
                className="flex-1 px-4 py-3 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg"
              >
                APPLY FILTERS
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-3 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg"
              >
                CLEAR FILTERS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">Your Shipments</h2>
          </div>

          {shipments.length === 0 ? (
            <div className="text-center py-16">
              <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-monument-regular text-gray-600 tracking-wider uppercase mb-2">
                No Shipments Found
              </h3>
              <p className="text-sm font-monument-ultralight text-gray-500 tracking-wider">
                There are no shipments matching your criteria.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-monument-regular text-gray-800 tracking-wider">
                          Shipment #{shipment.id}
                        </h3>
                        <p className="text-sm font-monument-ultralight text-gray-600 tracking-wider">
                          Carrier: {shipment.carrier?.name || "N/A"}
                        </p>
                        <p className="text-xs font-monument-ultralight text-blue-600 tracking-wider">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {shipment.shipping_address?.city}, {shipment.shipping_address?.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2 min-w-[180px]">
                      <div
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(shipment.status)}`}
                      >
                        {getStatusIcon(shipment.status)}
                        <span className="text-xs font-monument-regular tracking-wider uppercase">
                          {shipment.status.replace("_", " ")}
                        </span>
                      </div>

                      <button
                        onClick={() => handleViewDetails(shipment.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>VIEW DETAILS</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                    <div>
                      <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                        <Truck className="inline w-3 h-3 mr-1" />
                        Tracking Number
                      </label>
                      <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                        {shipment.outbound_tracking_number || "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                        <DollarSign className="inline w-3 h-3 mr-1" />
                        Total Cost
                      </label>
                      <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                        ${(Number.parseFloat(shipment.total_cost) || 0).toFixed(2)} {shipment.currency}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        Created At
                      </label>
                      <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                        {formatDate(shipment.created_at)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        Shipped At
                      </label>
                      <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                        {shipment.shipped_at ? formatDate(shipment.shipped_at) : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shipment Detail Modal */}
      {showDetailModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                Shipment #{selectedShipment.id} Details
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedShipment(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Status
                  </label>
                  <div
                    className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(selectedShipment.status)}`}
                  >
                    {getStatusIcon(selectedShipment.status)}
                    <span className="text-xs font-monument-regular tracking-wider uppercase">
                      {selectedShipment.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Carrier
                  </label>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    {selectedShipment.carrier?.name || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Outbound Tracking Number
                  </label>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    {selectedShipment.outbound_tracking_number || "N/A"}
                  </div>
                  {selectedShipment.tracking_url && (
                    <a
                      href={selectedShipment.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs font-monument-regular text-blue-600 hover:underline mt-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Track Shipment</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Shipping Address
                  </label>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    {selectedShipment.shipping_address?.name || "N/A"}
                  </div>
                  <div className="text-xs font-monument-ultralight text-gray-600 tracking-wider">
                    {formatAddress(selectedShipment.shipping_address)}
                  </div>
                  <div className="text-xs font-monument-ultralight text-gray-600 tracking-wider">
                    Phone: {selectedShipment.shipping_address?.phone || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Costs
                  </label>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    Shipping: ${selectedShipment.shipping_cost || "0.00"}
                  </div>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    Insurance: ${selectedShipment.insurance_cost || "0.00"}
                  </div>
                  <div className="text-sm font-monument-regular text-gray-800 tracking-wider mt-1">
                    Total: ${selectedShipment.total_cost || "0.00"} {selectedShipment.currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Packages in Shipment */}
            {selectedShipment.packages && selectedShipment.packages.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-3">
                  Packages ({selectedShipment.packages.length})
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedShipment.packages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="text-sm font-monument-regular text-gray-800">Package #{pkg.id}</div>
                          <div className="text-xs font-monument-ultralight text-gray-600">
                            Declared Value: ${pkg.declared_value || "0.00"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-monument-regular text-gray-800">
                          {pkg.weight ? `${pkg.weight} kg` : "N/A"}
                        </div>
                        {pkg.length && pkg.width && pkg.height && (
                          <div className="text-xs font-monument-ultralight text-gray-600">
                            {formatDimensions(pkg.length, pkg.width, pkg.height)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consolidated Package */}
            {selectedShipment.consolidated_package && (
              <div className="mb-6">
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-3">
                  Consolidated Package
                </label>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-sm font-monument-regular text-purple-800">
                        Consolidation #{selectedShipment.consolidated_package.id}
                      </div>
                      <div className="text-xs font-monument-ultralight text-purple-600">
                        Final Weight: {selectedShipment.consolidated_package.final_weight || selectedShipment.consolidated_package.total_weight} kg
                      </div>
                      {(selectedShipment.consolidated_package.final_length && selectedShipment.consolidated_package.final_width && selectedShipment.consolidated_package.final_height) ? (
                        <div className="text-xs font-monument-ultralight text-purple-600">
                          Dimensions:{" "}
                          {formatDimensions(
                            selectedShipment.consolidated_package.final_length,
                            selectedShipment.consolidated_package.final_width,
                            selectedShipment.consolidated_package.final_height,
                          )}
                        </div>
                      ) : selectedShipment.consolidated_package.consolidated_dimensions && (
                        <div className="text-xs font-monument-ultralight text-purple-600">
                          Dimensions:{" "}
                          {formatDimensions(
                            selectedShipment.consolidated_package.consolidated_dimensions.length,
                            selectedShipment.consolidated_package.consolidated_dimensions.width,
                            selectedShipment.consolidated_package.consolidated_dimensions.height,
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                  Created At
                </label>
                <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                  {formatDate(selectedShipment.created_at)}
                </div>
              </div>
              {selectedShipment.shipped_at && (
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Shipped At
                  </label>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    {formatDate(selectedShipment.shipped_at)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Shipments
