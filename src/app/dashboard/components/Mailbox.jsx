"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../utils/axiosInstance"
import { Package, Warehouse, MapPin, Phone, Shield, X, Calendar, Truck, DollarSign, Ruler, Weight, RefreshCw, Settings, AlertCircle, CheckCircle, Clock, Plus, Wallet, ExternalLink, Globe, Archive, Eye, Star, Award } from 'lucide-react'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Mailbox = ({ userId }) => {
  const [packages, setPackages] = useState([])
  const [consolidations, setConsolidations] = useState([])
  // Warehouse functionality removed - single main warehouse now
  // const [availableWarehouses, setAvailableWarehouses] = useState([])
  const [availableServices, setAvailableServices] = useState([])
  // const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedConsolidation, setSelectedConsolidation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPackages, setIsLoadingPackages] = useState(false)
  const [isLoadingConsolidations, setIsLoadingConsolidations] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showConsolidationDetailsModal, setShowConsolidationDetailsModal] = useState(false)

  // Replace the payment-related states with top-up states
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")
  const [topUpPin, setTopUpPin] = useState("")
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false)
  const [topUpError, setTopUpError] = useState(null)

  // Add wallet payment PIN states
  const [showWalletPinModal, setShowWalletPinModal] = useState(false)
  const [walletPin, setWalletPin] = useState("")
  const [walletPinError, setWalletPinError] = useState(null)
  const [isProcessingWalletPayment, setIsProcessingWalletPayment] = useState(false)
  const [pendingPaymentAction, setPendingPaymentAction] = useState(null) // Store the payment action to execute after PIN verification

  // Add address selection states
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [showAddressSelectionModal, setShowAddressSelectionModal] = useState(false)

  // Add courier selection states
  const [showCourierSelectionModal, setShowCourierSelectionModal] = useState(false)
  const [courierOptions, setCourierOptions] = useState([])
  const [selectedCourier, setSelectedCourier] = useState(null)
  const [isLoadingCouriers, setIsLoadingCouriers] = useState(false)
  const [courierError, setCourierError] = useState(null)
  const [isSelectingCourier, setIsSelectingCourier] = useState(false)

  const [serviceRequest, setServiceRequest] = useState({
    service: "",
    notes: "",
  })
  const [walletInfo, setWalletInfo] = useState(null)
  const [invoices, setInvoices] = useState([])
  const effectiveUserId = userId || localStorage.getItem("userId")

  // Add these new state variables after the existing ones
  const [selectedPackages, setSelectedPackages] = useState([])
  const [showConsolidationModal, setShowConsolidationModal] = useState(false)
  const [consolidationNotes, setConsolidationNotes] = useState("")
  const [isCreatingConsolidation, setIsCreatingConsolidation] = useState(false)
  const [consolidationError, setConsolidationError] = useState(null)
  const [activeTab, setActiveTab] = useState("packages") // New state for tab management

  console.log(consolidations)
  // Add "All Warehouses" option
  // Warehouse selection removed - single main warehouse now
  // const ALL_WAREHOUSES_OPTION = {
  //   id: "all",
  //   name: "All Warehouses",
  //   city: "Multiple",
  //   state: "Locations",
  //   phone_number: "Various",
  //   is_tax_free: false,
  // }

  useEffect(() => {
    fetchInitialData()
    fetchAddresses() // Add this line
  }, [effectiveUserId])

  // Warehouse selection removed - always fetch all packages
  // useEffect(() => {
  //   if (selectedWarehouse) {
  //     if (selectedWarehouse.id === "all") {
  //       fetchPackages() // Fetch from all warehouses
  //     } else {
  //       fetchPackages(selectedWarehouse.id) // Fetch from specific warehouse
  //     }
  //   }
  // }, [selectedWarehouse])

  useEffect(() => {
    if (activeTab === "consolidations") {
      fetchConsolidations()
    }
  }, [activeTab])

  const fetchInitialData = async () => {
    try {
      setIsLoading(true)

      // Fetch services, wallet info, and invoices (warehouses removed - single main warehouse)
      const [servicesResponse, walletResponse, invoicesResponse] = await Promise.all([
        axiosInstance.get("/api/v1/warehouse/services/"),
        axiosInstance.get("/api/v1/payments/wallet/"),
        axiosInstance.get("/api/v1/payments/invoices/"),
      ])

      setAvailableServices(servicesResponse.data)
      setWalletInfo(walletResponse.data)
      setInvoices(invoicesResponse.data)

      // Auto-fetch packages since there's only one main warehouse now
      fetchPackages()
    } catch (error) {
      console.error("Error fetching initial data:", error)
      toast.error("Failed to load warehouse information")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPackages = async () => {
    try {
      setIsLoadingPackages(true)
      // Fetch all packages from single main warehouse (warehouse parameter removed)
      const response = await axiosInstance.get(`/api/v1/warehouse/packages/`)
      setPackages(response.data)
    } catch (error) {
      console.error("Error fetching packages:", error)
      toast.error("Failed to load packages")
      setPackages([])
    } finally {
      setIsLoadingPackages(false)
    }
  }

  const fetchConsolidations = async () => {
    try {
      setIsLoadingConsolidations(true)
      const response = await axiosInstance.get("/api/v1/shipping/consolidations/")
      setConsolidations(response.data)
    } catch (error) {
      console.error("Error fetching consolidations:", error)
      toast.error("Failed to load consolidations")
      setConsolidations([])
    } finally {
      setIsLoadingConsolidations(false)
    }
  }

  const fetchWalletInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/payments/wallet/")
      setWalletInfo(response.data)
    } catch (error) {
      console.error("Error fetching wallet info:", error)
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/payments/invoices/")
      setInvoices(response.data)
    } catch (error) {
      console.error("Error fetching invoices:", error)
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

  // New function to fetch courier options
  const fetchCourierOptions = async (packageId) => {
    try {
      setIsLoadingCouriers(true)
      setCourierError(null)
      const response = await axiosInstance.get(`/api/v1/warehouse/packages/${packageId}/shipping-options/`)
      setCourierOptions(response.data.courier_options || [])
    } catch (error) {
      console.error("Error fetching courier options:", error)
      setCourierError(error.response?.data?.detail || "Failed to load courier options")
      setCourierOptions([])
    } finally {
      setIsLoadingCouriers(false)
    }
  }

  // New function to select courier
  const handleCourierSelection = async () => {
    if (!selectedCourier || !pendingPaymentAction) {
      setCourierError("Please select a courier option")
      return
    }

    try {
      setIsSelectingCourier(true)
      setCourierError(null)

      const response = await axiosInstance.post(
        `/api/v1/warehouse/packages/${pendingPaymentAction.id}/select-courier/`,
        {
          courier_partner_id: selectedCourier.id,
          quote_amount: selectedCourier.price,
        }
      )

      toast.success("Courier selected successfully!")

      // Update the pending payment action with new total amount
      setPendingPaymentAction(prev => ({
        ...prev,
        amount: parseFloat(response.data.total_amount_due)
      }))

      // Close courier modal and proceed to address selection
      setShowCourierSelectionModal(false)
      setSelectedCourier(null)
      setCourierOptions([])
      setShowAddressSelectionModal(true)

    } catch (error) {
      console.error("Error selecting courier:", error)
      setCourierError(error.response?.data?.detail || "Failed to select courier")
    } finally {
      setIsSelectingCourier(false)
    }
  }

  // Warehouse selection removed - single main warehouse now
  // const handleWarehouseChange = (warehouse) => {
  //   setSelectedWarehouse(warehouse)
  //   setPackages([])
  //   setSelectedPackages([]) // Clear selected packages when changing warehouse
  // }

  const handleRefresh = () => {
    if (activeTab === "packages") {
      fetchPackages() // Refresh packages from main warehouse
    } else if (activeTab === "consolidations") {
      fetchConsolidations()
    }
  }

  const handleRequestService = async () => {
    if (!serviceRequest.service || !selectedPackage) {
      toast.error("Please select a service")
      return
    }

    try {
      await axiosInstance.post("/api/v1/warehouse/service-requests/", {
        package: selectedPackage.id,
        service: parseInt(serviceRequest.service),
        notes: serviceRequest.notes,
      })

      toast.success("Service request submitted successfully!")
      setShowServiceModal(false)
      setServiceRequest({ service: "", notes: "" })
      setSelectedPackage(null)

      // Refresh packages and invoices to show updated data
      fetchPackages() // Fetch from main warehouse
      fetchInvoices()
    } catch (error) {
      console.error("Error requesting service:", error)
      toast.error("Failed to submit service request")
    }
  }

  const handleWalletTopUp = async () => {
    if (!topUpAmount || !topUpPin) {
      setTopUpError("Please enter both amount and PIN")
      return
    }

    if (parseFloat(topUpAmount) <= 0) {
      setTopUpError("Please enter a valid amount")
      return
    }

    if (topUpPin.length !== 4) {
      setTopUpError("PIN must be 4 digits")
      return
    }

    try {
      setIsProcessingTopUp(true)
      setTopUpError(null)

      const response = await axiosInstance.post("/api/v1/payments/wallet/topup/", {
        topup_amount: parseFloat(topUpAmount),
        pin: topUpPin,
      })

      if (response.data.approval_url) {
        // Store the order ID for reference
        localStorage.setItem("paypalTopUpOrderId", response.data.orderID)
        // Redirect to PayPal approval URL
        window.location.href = response.data.approval_url
      } else {
        setTopUpError("PayPal approval URL not received")
      }
    } catch (error) {
      console.error("Error creating wallet top-up:", error)
      setTopUpError(error.response?.data?.detail || "Failed to initiate wallet top-up")
    } finally {
      setIsProcessingTopUp(false)
    }
  }

  // Modified function to show courier selection first for both Wallet and PayPal
  const initiateWalletPayment = (type, id, amount, packageData = null) => {
    console.log("Wallet payment initiated:", { type, id, amount })
    // Check if wallet has sufficient balance
    if (walletInfo && parseFloat(walletInfo.balance) < amount) {
      toast.error("Insufficient wallet balance")
      return
    }

    if (addresses.length === 0) {
      toast.error("No shipping addresses found. Please add an address first.")
      return
    }

    setPendingPaymentAction({ type, id, amount, paymentMethod: "wallet", packageData })

    // For packages, show courier selection first
    if (type === "package") {
      fetchCourierOptions(id)
      setShowCourierSelectionModal(true)
    } else {
      // For consolidations, go directly to address selection
      setShowAddressSelectionModal(true)
    }
  }

  // New function for PayPal payment initiation
  const initiatePayPalPayment = (type, id, amount, packageData = null) => {
    if (addresses.length === 0) {
      toast.error("No shipping addresses found. Please add an address first.")
      return
    }

    setPendingPaymentAction({ type, id, amount, paymentMethod: "paypal", packageData })

    // For packages, show courier selection first
    if (type === "package") {
      fetchCourierOptions(id)
      setShowCourierSelectionModal(true)
    } else {
      // For consolidations, go directly to address selection
      setShowAddressSelectionModal(true)
    }
  }

  // Updated function to include shipping_address_id for Wallet
  const handleWalletPaymentWithPin = async () => {
    if (!walletPin || walletPin.length !== 4) {
      setWalletPinError("Please enter a valid 4-digit PIN")
      return
    }

    if (!pendingPaymentAction) {
      setWalletPinError("No payment action pending")
      return
    }

    if (!selectedAddress) {
      setWalletPinError("Please select a shipping address")
      return
    }

    try {
      setIsProcessingWalletPayment(true)
      setWalletPinError(null)

      let response
      if (pendingPaymentAction.type === "package") {
        response = await axiosInstance.post(`/api/v1/payments/packages/${pendingPaymentAction.id}/pay-from-wallet/`, {
          pin: walletPin,
          shipping_address_id: selectedAddress.id,
        })
      } else if (pendingPaymentAction.type === "consolidation") {
        response = await axiosInstance.post(
          `/api/v1/payments/consolidations/${pendingPaymentAction.id}/pay-from-wallet/`,
          {
            pin: walletPin,
            shipping_address_id: selectedAddress.id,
          },
        )
      }

      toast.success(response.data.message || response.data.detail || "Wallet payment successful!")

      // Close modal and reset states
      setShowWalletPinModal(false)
      setWalletPin("")
      setPendingPaymentAction(null)
      setSelectedAddress(null) // Clear selected address after payment

      // Refresh data
      fetchWalletInfo()
      if (pendingPaymentAction.type === "package") {
        fetchPackages()
      } else if (pendingPaymentAction.type === "consolidation") {
        fetchConsolidations()
      }
    } catch (error) {
      console.error("Wallet payment error:", error)
      setWalletPinError(error.response?.data?.message || error.response?.data?.detail || "Wallet payment failed")
    } finally {
      setIsProcessingWalletPayment(false)
    }
  }

  // New function to handle PayPal payment after address selection
  const handlePayPalPaymentWithAddress = async () => {
    if (!pendingPaymentAction || !selectedAddress) {
      toast.error("Payment details or address missing.")
      return
    }

    try {
      setIsProcessingTopUp(true) // Reusing this state for PayPal processing
      const payload = {
        shipping_address_id: selectedAddress.id,
      }

      if (pendingPaymentAction.type === "package") {
        payload.package_id = pendingPaymentAction.id
      } else if (pendingPaymentAction.type === "consolidation") {
        payload.consolidation_id = pendingPaymentAction.id
      }

      const response = await axiosInstance.post("/api/v1/payments/orders/create/", payload)

      if (response.data.approval_url && response.data.order_id) {
        // Store relevant ID for later use if needed
        if (pendingPaymentAction.type === "package") {
          localStorage.setItem("paypalPackageId", pendingPaymentAction.id)
        } else if (pendingPaymentAction.type === "consolidation") {
          localStorage.setItem("paypalConsolidationId", pendingPaymentAction.id)
        }
        // Redirect to a local success page with order_id as query param
        window.location.href = `/dashboard/payment-success?order_id=${response.data.order_id}`
      } else if (response.data.approval_url) {
        // fallback: open approval_url if order_id not present
        window.location.href = response.data.approval_url
      } else {
        toast.error("PayPal approval URL not returned.")
      }
    } catch (err) {
      console.error("PayPal payment error:", err)
      toast.error(err.response?.data?.message || "PayPal payment failed.")
    } finally {
      setIsProcessingTopUp(false)
      setPendingPaymentAction(null) // Clear pending action
      setSelectedAddress(null) // Clear selected address
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "in_warehouse":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "awaiting_arrival":
        return "bg-orange-100 text-orange-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "in_warehouse":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "awaiting_arrival":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Settings className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDimensions = (length, width, height) => {
    return `${length || 0} × ${width || 0} × ${height || 0} cm`
  }

  const formatAddress = (address) => {
    return `${address.address_line1}${address.address_line2 ? ", " + address.address_line2 : ""}, ${address.city}, ${address.state_province_region} ${address.zip_postal_code}, ${address.country}`
  }

  // Add these helper functions after the existing ones
  const handlePackageSelection = (packageId, isSelected) => {
    if (isSelected) {
      setSelectedPackages((prev) => [...prev, packageId])
    } else {
      setSelectedPackages((prev) => prev.filter((id) => id !== packageId))
    }
  }

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const eligiblePackages = packages
        .filter((pkg) => pkg.status === "in_warehouse" && !pkg.is_paid)
        .map((pkg) => pkg.id)
      setSelectedPackages(eligiblePackages)
    } else {
      setSelectedPackages([])
    }
  }

  const getSelectedPackagesData = () => {
    return packages.filter((pkg) => selectedPackages.includes(pkg.id))
  }

  const calculateConsolidationCost = (selectedPkgs) => {
    const totalWeight = selectedPkgs.reduce((sum, pkg) => sum + (parseFloat(pkg.weight) || 0), 0)
    const baseFee = 5.0
    const weightFee = Math.max(0, totalWeight - 2) * 1.0
    return baseFee + weightFee
  }

  const handleCreateConsolidation = async () => {
    if (selectedPackages.length < 2) {
      setConsolidationError("Please select at least 2 packages for consolidation")
      return
    }

    try {
      setIsCreatingConsolidation(true)
      setConsolidationError(null)

      const response = await axiosInstance.post("/api/v1/shipping/consolidate/", {
        package_ids: selectedPackages,
        notes: consolidationNotes,
      })

      toast.success("Consolidation request created successfully!")
      setShowConsolidationModal(false)
      setSelectedPackages([])
      setConsolidationNotes("")

      // Refresh packages
      fetchPackages()
    } catch (error) {
      console.error("Error creating consolidation:", error)
      setConsolidationError(error.response?.data?.detail || "Failed to create consolidation request")
    } finally {
      setIsCreatingConsolidation(false)
    }
  }
  console.log("Selected packages:", packages)
  const unpaidInvoices = invoices.filter((invoice) => invoice.status === "unpaid")
  const totalSelectedAmount = 0

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
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-monument-regular text-gray-800 tracking-[0.1em] uppercase">Mailbox</h1>
                <p className="text-gray-500 text-sm tracking-wider uppercase mt-1">
                  Manage your packages and warehouse services
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Wallet Info */}
              {walletInfo && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <Wallet className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-monument-regular text-green-800 tracking-wider">
                    ${(parseFloat(walletInfo.balance) || 0).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Top Up Button - Replace the payment button */}
              {walletInfo && (
                <button
                  onClick={() => setShowTopUpModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-monument-regular tracking-wider text-xs hover:bg-blue-700 transition-colors rounded-lg"
                >
                  <Wallet className="w-4 h-4" />
                  <span>TOP UP WALLET</span>
                </button>
              )}

              <button
                onClick={handleRefresh}
                disabled={isLoadingPackages || isLoadingConsolidations}
                className="flex items-center space-x-2 px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoadingPackages || isLoadingConsolidations ? "animate-spin" : ""}`}
                />
                <span>REFRESH</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("packages")}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-monument-regular tracking-wider text-xs transition-colors ${activeTab === "packages" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-gray-800"
                }`}
            >
              <Package className="w-4 h-4" />
              <span>PACKAGES</span>
            </button>
            <button
              onClick={() => setActiveTab("consolidations")}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-monument-regular tracking-wider text-xs transition-colors ${activeTab === "consolidations" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-gray-800"
                }`}
            >
              <Archive className="w-4 h-4" />
              <span>CONSOLIDATIONS</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeTab === "packages" ? (
          <>


            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white shadow-xl rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                      Total Packages
                    </p>
                    <p className="text-2xl font-monument-regular text-gray-800">{packages.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                      In Warehouse
                    </p>
                    <p className="text-2xl font-monument-regular text-gray-800">
                      {packages.filter((p) => p.status === "in_warehouse").length}
                    </p>
                  </div>
                  <Warehouse className="h-8 w-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                      Total Value
                    </p>
                    <p className="text-2xl font-monument-regular text-gray-800">
                      $
                      {packages
                        .reduce((sum, pkg) => {
                          const value = parseFloat(pkg.total_due) || 0
                          // Add completed service requests' price
                          const completedServicesTotal = (pkg.service_requests || [])
                            .filter((req) => req.status === "completed")
                            .reduce((s, req) => s + (parseFloat(req.service?.price) || 0), 0)
                          return sum + value + completedServicesTotal
                        }, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                      Service Requests
                    </p>
                    <p className="text-2xl font-monument-regular text-gray-800">
                      {packages.reduce((sum, pkg) => sum + (pkg.service_requests?.length || 0), 0)}
                    </p>
                  </div>
                  <Settings className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Packages List */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                    Your Packages
                  </h2>

                  {/* Package Selection Controls */}
                  {packages.length > 0 && (
                    <div className="flex items-center space-x-4">
                      {selectedPackages.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-monument-regular text-gray-600 tracking-wider">
                            {selectedPackages.length} selected
                          </span>
                          <button
                            onClick={() => setShowConsolidationModal(true)}
                            disabled={selectedPackages.length < 2}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white font-monument-regular tracking-wider text-xs hover:bg-purple-700 transition-colors rounded-lg disabled:opacity-50"
                          >
                            <Package className="w-4 h-4" />
                            <span>CONSOLIDATE</span>
                          </button>
                        </div>
                      )}

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            selectedPackages.length ===
                            packages.filter((pkg) => pkg.status === "in_warehouse" && !pkg.is_paid).length &&
                            packages.filter((pkg) => pkg.status === "in_warehouse" && !pkg.is_paid).length > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-sm font-monument-regular text-gray-700 tracking-wider uppercase">
                          Select All
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {isLoadingPackages ? (
                <div className="p-8">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              ) : packages.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-monument-regular text-gray-600 tracking-wider uppercase mb-2">
                    No Packages Found
                  </h3>
                  <p className="text-sm font-monument-ultralight text-gray-500 tracking-wider">
                    No packages are currently stored at the warehouse
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="p-8 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {/* Checkbox - Only show for eligible packages */}
                          {pkg.status === "in_warehouse" && !pkg.is_paid && (
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedPackages.includes(pkg.id)}
                                onChange={(e) => handlePackageSelection(pkg.id, e.target.checked)}
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                              />
                            </label>
                          )}

                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-monument-regular text-gray-800 tracking-wider">
                              Package #{pkg.id}
                            </h3>
                            <p className="text-sm font-monument-ultralight text-gray-600 tracking-wider">
                              From: {pkg.sender_name}
                            </p>
                            {/* Warehouse name removed - single main warehouse */}
                          </div>
                        </div>

                        {/* Rest of the package display remains the same */}
                        <div className="flex flex-col items-end space-y-2 min-w-[180px]">
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(pkg.status)}`}
                          >
                            {getStatusIcon(pkg.status)}
                            <span className="text-xs font-monument-regular tracking-wider uppercase">
                              {pkg.status.replace("_", " ")}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedPackage(pkg)
                              setShowServiceModal(true)
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg"
                          >
                            <Plus className="w-4 h-4" />
                            <span>REQUEST SERVICE</span>
                          </button>

                          {/* Payment buttons for packages with is_payment_pending */}
                          {pkg.is_payment_pending && !pkg.is_paid && (
                            <div className="flex flex-col space-y-2 mt-2 w-full">
                              <button
                                onClick={() =>
                                  initiateWalletPayment("package", pkg.id, parseFloat(pkg.total_due) || 0, pkg)
                                }
                                disabled={
                                  isProcessingWalletPayment ||
                                  (walletInfo && parseFloat(walletInfo.balance) < (pkg.amount || 0))
                                }
                                className="w-full px-4 py-2 bg-green-600 text-white font-monument-regular tracking-wider text-xs rounded-lg hover:bg-green-700 disabled:opacity-50"
                              >
                                {isProcessingWalletPayment ? "Processing..." : "Pay with Wallet"}
                              </button>
                              <button
                                onClick={() =>
                                  initiatePayPalPayment("package", pkg.id, parseFloat(pkg.total_due) || 0, pkg)
                                }
                                disabled={isProcessingTopUp}
                                className="w-full px-4 py-2 bg-yellow-500 text-white font-monument-regular tracking-wider text-xs rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                              >
                                {isProcessingTopUp ? "Processing..." : "Pay with PayPal"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rest of package details remain the same */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                        <div>
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                            <Truck className="inline w-3 h-3 mr-1" />
                            Tracking Number
                          </label>
                          <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                            {pkg.inbound_tracking_number || "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                            <Weight className="inline w-3 h-3 mr-1" />
                            Weight
                          </label>
                          <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                            {pkg.weight ? `${pkg.weight} kg` : "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                            <Ruler className="inline w-3 h-3 mr-1" />
                            Dimensions
                          </label>
                          <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                            {formatDimensions(pkg.length, pkg.width, pkg.height)}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                            <DollarSign className="inline w-3 h-3 mr-1" />
                            Declared Value
                          </label>
                          <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                            ${pkg.declared_value || "0.00"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                            <Calendar className="inline w-3 h-3 mr-1" />
                            Date Arrived
                          </label>
                          <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                            {pkg.date_arrived ? formatDate(pkg.date_arrived) : "N/A"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                            <Calendar className="inline w-3 h-3 mr-1" />
                            Date Processed
                          </label>
                          <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                            {pkg.date_processed ? formatDate(pkg.date_processed) : "Not processed"}
                          </div>
                        </div>
                      </div>

                      {/* Package Images */}
                      {pkg.images && pkg.images.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                            Package Images
                          </label>
                          <div className="flex space-x-2">
                            {pkg.images.map((image) => (
                              <div key={image.id} className="relative group">
                                <img
                                  src={image.image || "/placeholder.svg"}
                                  alt="Package"
                                  className="w-16 h-16 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-110"
                                  onClick={() => setSelectedImage(image.image)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Service Requests */}
                      {pkg.service_requests && pkg.service_requests.length > 0 && (
                        <div>
                          <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                            Service Requests
                          </label>
                          <div className="space-y-2">
                            {pkg.service_requests.map((request) => (
                              <div
                                key={request.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-2 h-2 rounded-full ${request.status === "completed"
                                      ? "bg-green-500"
                                      : request.status === "pending"
                                        ? "bg-yellow-500"
                                        : "bg-gray-500"
                                      }`}
                                  ></div>
                                  <div>
                                    <div className="text-sm font-monument-regular text-gray-800 tracking-wider">
                                      {request.service.name}
                                    </div>
                                    <div className="text-xs font-monument-ultralight text-gray-600 tracking-wider">
                                      {request.notes || "No notes"}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-monument-regular text-gray-800">
                                    ${request.service.price}
                                  </div>
                                  <div className="text-xs font-monument-ultralight text-gray-600 tracking-wider uppercase">
                                    {request.status}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Consolidations Tab */
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                Consolidation Requests
              </h2>
            </div>

            {isLoadingConsolidations ? (
              <div className="p-8">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ) : consolidations.length === 0 ? (
              <div className="text-center py-16">
                <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-monument-regular text-gray-600 tracking-wider uppercase mb-2">
                  No Consolidations Found
                </h3>
                <p className="text-sm font-monument-ultralight text-gray-500 tracking-wider">
                  You haven't created any consolidation requests yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {consolidations.map((consolidation) => (
                  <div key={consolidation.id} className="p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Archive className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-monument-regular text-gray-800 tracking-wider">
                            Consolidation #{consolidation.id}
                          </h3>
                          <p className="text-sm font-monument-ultralight text-gray-600 tracking-wider">
                            {consolidation.warehouse?.name || "Main Warehouse"} - {consolidation.warehouse?.city || "USA"},{" "}
                            {consolidation.warehouse?.state || "Processing Center"}
                          </p>
                          <p className="text-xs font-monument-ultralight text-gray-500 tracking-wider">
                            {consolidation.packages?.length || 0} packages • {consolidation.total_weight || 0} kg
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 min-w-[200px]">
                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(consolidation.status)}`}
                        >
                          {getStatusIcon(consolidation.status)}
                          <span className="text-xs font-monument-regular tracking-wider uppercase">
                            {consolidation.status}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedConsolidation(consolidation)
                              setShowConsolidationDetailsModal(true)
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-700 transition-colors rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                            <span>VIEW DETAILS</span>
                          </button>
                        </div>

                        {/* Payment buttons for consolidations with is_payment_pending */}
                        {consolidation.is_payment_pending && !consolidation.is_paid && (
                          <div className="flex flex-col space-y-2 mt-2 w-full">
                            <button
                              onClick={() =>
                                initiateWalletPayment(
                                  "consolidation",
                                  consolidation.id,
                                  consolidation.total_consolidation_cost,
                                )
                              }
                              disabled={
                                isProcessingWalletPayment ||
                                (walletInfo &&
                                  parseFloat(walletInfo.balance) < consolidation.total_consolidation_cost)
                              }
                              className="w-full px-4 py-2 bg-green-600 text-white font-monument-regular tracking-wider text-xs rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              {isProcessingWalletPayment
                                ? "Processing..."
                                : `Pay $${consolidation.total_consolidation_cost} with Wallet`}
                            </button>
                            <button
                              onClick={() =>
                                initiatePayPalPayment(
                                  "consolidation",
                                  consolidation.id,
                                  consolidation.total_consolidation_cost,
                                )
                              }
                              disabled={isProcessingTopUp}
                              className="w-full px-4 py-2 bg-yellow-500 text-white font-monument-regular tracking-wider text-xs rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                            >
                              {isProcessingTopUp
                                ? "Processing..."
                                : `Pay $${consolidation.total_consolidation_cost} with PayPal`}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Consolidation Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                      <div>
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          <Weight className="inline w-3 h-3 mr-1" />
                          Total Weight
                        </label>
                        <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                          {consolidation.total_weight} kg
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          <Ruler className="inline w-3 h-3 mr-1" />
                          Dimensions
                        </label>
                        <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                          {consolidation.consolidated_dimensions
                            ? formatDimensions(
                              consolidation.consolidated_dimensions.length,
                              consolidation.consolidated_dimensions.width,
                              consolidation.consolidated_dimensions.height,
                            )
                            : "N/A"}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          <DollarSign className="inline w-3 h-3 mr-1" />
                          Consolidation Cost
                        </label>
                        <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                          ${consolidation.total_consolidation_cost}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          <Calendar className="inline w-3 h-3 mr-1" />
                          Created
                        </label>
                        <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                          {formatDate(consolidation.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Package List Preview */}
                    <div>
                      <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                        Packages ({consolidation.packages?.length || 0})
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(consolidation.packages || []).slice(0, 4).map((pkg) => (
                          <div key={pkg.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Package className="h-3 w-3 text-gray-600" />
                              <div>
                                <div className="text-xs font-monument-regular text-gray-800">Package #{pkg.id}</div>
                                <div className="text-xs font-monument-ultralight text-gray-600">{pkg.sender_name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-monument-regular text-gray-800">{pkg.weight} kg</div>
                              <div className="text-xs font-monument-ultralight text-gray-600">
                                ${pkg.declared_value}
                              </div>
                            </div>
                          </div>
                        ))}
                        {(consolidation.packages?.length || 0) > 4 && (
                          <div className="flex items-center justify-center p-2 bg-gray-100 rounded-lg">
                            <span className="text-xs font-monument-regular text-gray-600 tracking-wider">
                              +{(consolidation.packages?.length || 0) - 4} more packages
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {consolidation.notes && (
                      <div className="mt-4">
                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                          Notes
                        </label>
                        <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider bg-gray-50 p-3 rounded-lg">
                          {consolidation.notes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Courier Selection Modal */}
      {showCourierSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                Select Courier Partner
              </h3>
              <button
                onClick={() => {
                  setShowCourierSelectionModal(false)
                  setSelectedCourier(null)
                  setCourierOptions([])
                  setCourierError(null)
                  setPendingPaymentAction(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Payment Summary */}
            {pendingPaymentAction && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-monument-regular text-gray-800 tracking-wider uppercase">
                      Package #{pendingPaymentAction.id} Shipping
                    </span>
                  </div>
                  <span className="text-lg font-monument-regular text-gray-800">
                    Declared Value: ${pendingPaymentAction.packageData?.declared_value || "0.00"}
                  </span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoadingCouriers ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-sm font-monument-regular text-gray-600 tracking-wider uppercase">
                  Loading Courier Options...
                </p>
              </div>
            ) : courierError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h4 className="text-lg font-monument-regular text-red-700 tracking-wider uppercase mb-2">
                  Error Loading Couriers
                </h4>
                <p className="text-sm font-monument-ultralight text-red-600 tracking-wider mb-4">
                  {courierError}
                </p>
                <button
                  onClick={() => fetchCourierOptions(pendingPaymentAction.id)}
                  className="px-4 py-2 bg-red-600 text-white font-monument-regular tracking-wider text-xs hover:bg-red-700 transition-colors rounded-lg"
                >
                  RETRY
                </button>
              </div>
            ) : courierOptions.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-monument-regular text-gray-600 tracking-wider uppercase mb-2">
                  No Courier Options Available
                </h4>
                <p className="text-sm font-monument-ultralight text-gray-500 tracking-wider">
                  No shipping options are currently available for this package.
                </p>
              </div>
            ) : (
              <>
                {/* Courier Options */}
                <div className="mb-6">
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-3">
                    Available Courier Partners
                  </label>
                  <div className="space-y-3">
                    {courierOptions.map((courier) => (
                      <div
                        key={courier.id}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedCourier?.id === courier.id
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        onClick={() => setSelectedCourier(courier)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {/* Courier Logo */}
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {courier.logo ? (
                                <img
                                  src={courier.logo || "/placeholder.svg"}
                                  alt={courier.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Truck className="h-8 w-8 text-gray-400" />
                              )}
                            </div>

                            {/* Courier Details */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-lg font-monument-regular text-gray-800 tracking-wider">
                                  {courier.name}
                                </h4>
                                {courier.badges && courier.badges.length > 0 && (
                                  <div className="flex space-x-1">
                                    {courier.badges.map((badge, index) => (
                                      <span
                                        key={index}
                                        className={`px-2 py-1 text-xs font-monument-regular tracking-wider rounded uppercase ${badge === "Best Value"
                                          ? "bg-green-100 text-green-800"
                                          : badge === "Real-time Tracking"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                          }`}
                                      >
                                        {badge === "Best Value" && <Award className="inline h-3 w-3 mr-1" />}
                                        {badge === "Real-time Tracking" && <Eye className="inline h-3 w-3 mr-1" />}
                                        {badge}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-monument-regular text-gray-700">Service:</span>
                                  <span className="ml-2 font-monument-ultralight text-gray-800">
                                    {courier.service_type}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-monument-regular text-gray-700">Delivery:</span>
                                  <span className="ml-2 font-monument-ultralight text-gray-800">
                                    {courier.estimated_delivery_days} days
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {courier.insurance_available && (
                                    <div className="flex items-center space-x-1">
                                      <Shield className="h-3 w-3 text-green-600" />
                                      <span className="text-xs font-monument-ultralight text-green-700">Insurance</span>
                                    </div>
                                  )}
                                  {courier.tracking_available && (
                                    <div className="flex items-center space-x-1">
                                      <Eye className="h-3 w-3 text-blue-600" />
                                      <span className="text-xs font-monument-ultralight text-blue-700">Tracking</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price and Selection */}
                          <div className="flex flex-col items-end space-y-2">
                            <div className="text-right">
                              <div className="text-2xl font-monument-regular text-gray-800">
                                ${courier.price}
                              </div>
                              <div className="text-xs font-monument-ultralight text-gray-600 tracking-wider uppercase">
                                {courier.currency}
                              </div>
                            </div>
                            {selectedCourier?.id === courier.id && (
                              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {courierError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-monument-ultralight text-red-700 tracking-wider">{courierError}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowCourierSelectionModal(false)
                      setSelectedCourier(null)
                      setCourierOptions([])
                      setCourierError(null)
                      setPendingPaymentAction(null)
                    }}
                    className="flex-1 px-4 py-3 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleCourierSelection}
                    disabled={!selectedCourier || isSelectingCourier}
                    className="flex-1 px-4 py-3 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSelectingCourier ? "SELECTING..." : "CONTINUE TO ADDRESS"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Service Request Modal */}
      {showServiceModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">Request Service</h3>
              <button
                onClick={() => {
                  setShowServiceModal(false)
                  setSelectedPackage(null)
                  setServiceRequest({ service: "", notes: "" })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-monument-ultralight text-gray-600 tracking-wider mb-2">
                Package #{selectedPackage.id} from {selectedPackage.sender_name}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Select Service
                </label>
                <select
                  value={serviceRequest.service}
                  onChange={(e) => setServiceRequest({ ...serviceRequest, service: e.target.value })}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Choose a service...</option>
                  {availableServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={serviceRequest.notes}
                  onChange={(e) => setServiceRequest({ ...serviceRequest, notes: e.target.value })}
                  placeholder="Add any special instructions..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowServiceModal(false)
                  setSelectedPackage(null)
                  setServiceRequest({ service: "", notes: "" })
                }}
                className="flex-1 px-4 py-3 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg"
              >
                CANCEL
              </button>
              <button
                onClick={handleRequestService}
                disabled={!serviceRequest.service}
                className="flex-1 px-4 py-3 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                REQUEST SERVICE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      {showAddressSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                Select Shipping Address
              </h3>
              <button
                onClick={() => {
                  setShowAddressSelectionModal(false)
                  setPendingPaymentAction(null)
                  setSelectedAddress(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Payment Summary */}
            {pendingPaymentAction && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-monument-regular text-gray-800 tracking-wider uppercase">
                      {pendingPaymentAction.type === "package" ? "Package Payment" : "Consolidation Payment"}
                    </span>
                  </div>
                  <span className="text-lg font-monument-regular text-gray-800">
                    ${Number(pendingPaymentAction.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Address Selection */}
            <div className="mb-6">
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
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-monument-regular text-gray-800 tracking-wider">
                              {address.full_name}
                            </h4>
                            {address.is_default && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-monument-regular tracking-wider rounded uppercase">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-xs font-monument-ultralight text-gray-600 tracking-wider mb-1">
                            <MapPin className="h-3 w-3" />
                            <span>{formatAddress(address)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs font-monument-ultralight text-gray-600 tracking-wider">
                            <Phone className="h-3 w-3" />
                            <span>{address.phone_number}</span>
                          </div>
                        </div>
                        {selectedAddress?.id === address.id && (
                          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAddressSelectionModal(false)
                  setPendingPaymentAction(null)
                  setSelectedAddress(null)
                }}
                className="flex-1 px-4 py-3 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  if (!selectedAddress) {
                    toast.error("Please select a shipping address")
                    return
                  }
                  setShowAddressSelectionModal(false)

                  if (pendingPaymentAction.paymentMethod === "wallet") {
                    setShowWalletPinModal(true)
                    setWalletPin("")
                    setWalletPinError(null)
                  } else if (pendingPaymentAction.paymentMethod === "paypal") {
                    handlePayPalPaymentWithAddress()
                  }
                }}
                disabled={!selectedAddress}
                className="flex-1 px-4 py-3 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONTINUE TO PAYMENT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet PIN Modal */}
      {showWalletPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">Wallet Payment</h3>
              <button
                onClick={() => {
                  setShowWalletPinModal(false)
                  setWalletPin("")
                  setWalletPinError(null)
                  setPendingPaymentAction(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Payment Summary */}
            {pendingPaymentAction && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-monument-regular text-gray-800 tracking-wider uppercase">
                      {pendingPaymentAction.type === "package" ? "Package Payment" : "Consolidation Payment"}
                    </span>
                  </div>
                  <span className="text-lg font-monument-regular text-gray-800">
                    ${pendingPaymentAction.amount.toFixed(2)}
                  </span>
                </div>

                {/* Show selected address */}
                {selectedAddress && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                      Shipping To:
                    </div>
                    <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                      {selectedAddress.full_name}
                    </div>
                    <div className="text-xs font-monument-ultralight text-gray-600 tracking-wider">
                      {formatAddress(selectedAddress)}
                    </div>
                  </div>
                )}
              </div>
            )}
            {walletInfo && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-monument-regular text-green-800 tracking-wider uppercase">
                      Current Balance
                    </span>
                  </div>
                  <span className="text-lg font-monument-regular text-green-800">
                    ${(parseFloat(walletInfo.balance) || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* PIN Input */}
            <div className="mb-6">
              <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                Wallet PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={walletPin}
                onChange={(e) => setWalletPin(e.target.value)}
                placeholder="••••"
                className="w-32 h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm text-center focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {walletPinError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-monument-ultralight text-red-700 tracking-wider">{walletPinError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowWalletPinModal(false)
                  setWalletPin("")
                  setWalletPinError(null)
                  setPendingPaymentAction(null)
                }}
                className="flex-1 px-4 py-3 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg"
              >
                CANCEL
              </button>
              <button
                onClick={handleWalletPaymentWithPin}
                disabled={isProcessingWalletPayment || !walletPin || walletPin.length !== 4 || !pendingPaymentAction}
                className="flex-1 px-4 py-3 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingWalletPayment ? "PROCESSING..." : "PAY WITH WALLET"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Wallet Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">Top Up Wallet</h3>
              <button
                onClick={() => {
                  setShowTopUpModal(false)
                  setTopUpAmount("")
                  setTopUpPin("")
                  setTopUpError(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Current Wallet Balance */}
            {walletInfo && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-monument-regular text-green-800 tracking-wider uppercase">
                      Current Balance
                    </span>
                  </div>
                  <span className="text-lg font-monument-regular text-green-800">
                    ${(parseFloat(walletInfo.balance) || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Top Up Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Top Up Amount (USD)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount to add"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Wallet PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={topUpPin}
                  onChange={(e) => setTopUpPin(e.target.value)}
                  placeholder="••••"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm text-center focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* PayPal Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-monument-regular text-blue-800 tracking-wider uppercase">
                    PayPal (Secure)
                  </span>
                </div>
                <p className="text-xs font-monument-ultralight text-blue-700 tracking-wider">
                  You will be redirected to PayPal to complete the secure payment process.
                </p>
              </div>

              {/* Error Message */}
              {topUpError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-monument-ultralight text-red-700 tracking-wider">{topUpError}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowTopUpModal(false)
                  setTopUpAmount("")
                  setTopUpPin("")
                  setTopUpError(null)
                }}
                className="flex-1 px-4 py-3 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg"
              >
                CANCEL
              </button>
              <button
                onClick={handleWalletTopUp}
                disabled={
                  isProcessingTopUp ||
                  !topUpAmount ||
                  !topUpPin ||
                  parseFloat(topUpAmount) <= 0 ||
                  topUpPin.length !== 4
                }
                className="flex-1 px-4 py-3 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingTopUp ? "PROCESSING..." : "TOP UP WITH PAYPAL"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage || "/placeholder.svg"}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              alt="Package"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Consolidation Modal */}
      {showConsolidationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                Package Consolidation
              </h3>
              <button
                onClick={() => {
                  setShowConsolidationModal(false)
                  setConsolidationNotes("")
                  setConsolidationError(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Selected Packages Summary */}
            <div className="mb-6">
              <h4 className="text-sm font-monument-regular text-gray-700 tracking-wider uppercase mb-3">
                Selected Packages ({selectedPackages.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getSelectedPackagesData().map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-monument-regular text-gray-800">Package #{pkg.id}</div>
                        <div className="text-xs font-monument-ultralight text-gray-600">From: {pkg.sender_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-monument-regular text-gray-800">
                        {pkg.weight ? `${pkg.weight} kg` : "N/A"}
                      </div>
                      <div className="text-xs font-monument-ultralight text-gray-600">${pkg.total_due || "0.00"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consolidation Details */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-monument-regular text-blue-800 tracking-wider uppercase mb-3">
                Consolidation Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-monument-regular text-blue-700">Total Weight:</span>
                  <span className="ml-2 font-monument-ultralight text-blue-800">
                    {getSelectedPackagesData()
                      .reduce((sum, pkg) => sum + (parseFloat(pkg.weight) || 0), 0)
                      .toFixed(2)}{" "}
                    kg
                  </span>
                </div>
                <div>
                  <span className="font-monument-regular text-blue-700">Base Fee:</span>
                  <span className="ml-2 font-monument-ultralight text-blue-800">$5.00</span>
                </div>
                <div>
                  <span className="font-monument-regular text-blue-700">Weight Fee:</span>
                  <span className="ml-2 font-monument-ultralight text-blue-800">
                    $
                    {Math.max(
                      0,
                      getSelectedPackagesData().reduce((sum, pkg) => sum + (parseFloat(pkg.weight) || 0), 0) - 2,
                    ).toFixed(2)}{" "}
                    × $1.00/kg
                  </span>
                </div>
                <div>
                  <span className="font-monument-regular text-blue-700">Total Cost:</span>
                  <span className="ml-2 font-monument-regular text-blue-800">
                    ${calculateConsolidationCost(getSelectedPackagesData()).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-xs font-monument-regular text-gray-500 tracking-wider uppercase mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={consolidationNotes}
                onChange={(e) => setConsolidationNotes(e.target.value)}
                placeholder="Add any special packing instructions..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
            </div>

            {/* Error Message */}
            {consolidationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-monument-ultralight text-red-700 tracking-wider">{consolidationError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConsolidationModal(false)
                  setConsolidationNotes("")
                  setConsolidationError(null)
                }}
                className="flex-1 px-4 py-3 bg-gray-500 text-white font-monument-regular tracking-wider text-xs hover:bg-gray-600 transition-colors rounded-lg"
              >
                CANCEL
              </button>
              <button
                onClick={handleCreateConsolidation}
                disabled={isCreatingConsolidation || selectedPackages.length < 2}
                className="flex-1 px-4 py-3 bg-purple-600 text-white font-monument-regular tracking-wider text-xs hover:bg-purple-700 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingConsolidation ? "CREATING..." : "CREATE CONSOLIDATION"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consolidation Details Modal */}
      {showConsolidationDetailsModal && selectedConsolidation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                Consolidation #{selectedConsolidation.id} Details
              </h3>
              <button
                onClick={() => {
                  setShowConsolidationDetailsModal(false)
                  setSelectedConsolidation(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Consolidation Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Warehouse
                  </label>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    {selectedConsolidation.warehouse?.name || "Main Warehouse - USA"}
                  </div>
                  <div className="text-xs font-monument-ultralight text-gray-600 tracking-wider">
                    {selectedConsolidation.warehouse?.address_line1
                      ? `${selectedConsolidation.warehouse.address_line1}, ${selectedConsolidation.warehouse.city}, ${selectedConsolidation.warehouse.state}`
                      : "Processing Center - United States"}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Status
                  </label>
                  <div
                    className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(selectedConsolidation.status)}`}
                  >
                    {getStatusIcon(selectedConsolidation.status)}
                    <span className="text-xs font-monument-regular tracking-wider uppercase">
                      {selectedConsolidation.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Total Weight
                  </label>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    {selectedConsolidation.total_weight} kg
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Consolidation Cost
                  </label>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    ${selectedConsolidation.total_consolidation_cost}
                  </div>
                  <div className="text-xs font-monument-ultralight text-gray-600 tracking-wider">
                    Base: ${selectedConsolidation.base_consolidation_fee} + Weight: $
                    {selectedConsolidation.weight_based_fee}
                  </div>
                </div>
              </div>
            </div>

            {/* Packages */}
            <div className="mb-6">
              <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-3">
                Packages ({selectedConsolidation.packages?.length || 0})
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(selectedConsolidation.packages || []).map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="text-sm font-monument-regular text-gray-800">
                          Package #{pkg.id} - {pkg.package_full_name}
                        </div>
                        <div className="text-xs font-monument-ultralight text-gray-600">From: {pkg.sender_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-monument-regular text-gray-800">{pkg.weight} kg</div>
                      <div className="text-xs font-monument-ultralight text-gray-600">${pkg.declared_value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedConsolidation.notes && (
              <div className="mb-6">
                <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                  Special Instructions
                </label>
                <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider bg-gray-50 p-4 rounded-lg">
                  {selectedConsolidation.notes}
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
                  {formatDate(selectedConsolidation.created_at)}
                </div>
              </div>
              {selectedConsolidation.processed_at && (
                <div>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-1">
                    Processed At
                  </label>
                  <div className="text-sm font-monument-ultralight text-gray-800 tracking-wider">
                    {formatDate(selectedConsolidation.processed_at)}
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

export default Mailbox
