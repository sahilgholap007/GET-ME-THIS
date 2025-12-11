"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../utils/axiosInstance"
import {
  User,
  Mail,
  Phone,
  Home,
  Gift,
  Calendar,
  Edit3,
  Save,
  X,
  Wallet,
  CreditCard,
  Plus,
  RefreshCw,
  Search,
  CalendarIcon,
  Download,
  MapPin,
  Star,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Shield,
  Info,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// UI Components
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CustomDateInput = ({ value, onClick, placeholder, className }) => (
  <Button
    variant="outline"
    className={cn(
      "w-full md:w-auto flex-grow justify-start text-left font-sans h-10 sm:h-11 bg-white tracking-wide text-xs sm:text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 border-2",
      !value && "text-muted-foreground",
      className,
    )}
    onClick={onClick}
  >
    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
    {value || <span>{placeholder}</span>}
  </Button>
)

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-12">
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-6xl border border-gray-200 animate-in fade-in duration-500">
      <div className="animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-16 px-4">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6 shadow-inner">
      <Icon className="h-10 w-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wide">{title}</h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">{description}</p>
    {action}
  </div>
)

const StatusBadge = ({ type, children, className }) => {
  const variants = {
    success: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200",
    warning: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200",
    error: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
    info: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200",
    default: "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm transition-all duration-200 hover:shadow-md",
        variants[type] || variants.default,
        className,
      )}
    >
      {children}
    </span>
  )
}

const MyAccount = () => {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState({})
  const [errors, setErrors] = useState({})

  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)

  // Wallet states
  const [wallets, setWallets] = useState([])
  const [isLoadingWallets, setIsLoadingWallets] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")
  const [topUpCurrency, setTopUpCurrency] = useState("USD")
  const [topUpPin, setTopUpPin] = useState("")
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinAction, setPinAction] = useState("") // 'setup', 'update', 'reset'
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isProcessingPin, setIsProcessingPin] = useState(false)
  const [hasPinSet, setHasPinSet] = useState(false)

  // Billing states
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [transactions, setTransactions] = useState([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [transactionError, setTransactionError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [itemsPerPage] = useState(20)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [totalWalletBalance, setTotalWalletBalance] = useState(0)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false)
  const [balancePin, setBalancePin] = useState("")
  const [walletBalance, setWalletBalance] = useState(null)
  const [isCheckingBalance, setIsCheckingBalance] = useState(false)
  const [balanceError, setBalanceError] = useState(null)
  const [billingPinAction, setBillingPinAction] = useState("")
  const [walletPin, setWalletPin] = useState("")
  const [isSubmittingPin, setIsSubmittingPin] = useState(false)
  const [pinMessage, setPinMessage] = useState(null)
  const [billingCurrentPin, setBillingCurrentPin] = useState("")
  const [billingNewPin, setBillingNewPin] = useState("")
  const [billingUserEmail, setBillingUserEmail] = useState("")
  const [billingUserPassword, setBillingUserPassword] = useState("")
  console.log(wallets)
  // Address book states
  const [addresses, setAddresses] = useState([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [addressFormData, setAddressFormData] = useState({
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state_province_region: "",
    zip_postal_code: "",
    country: "",
    phone_number: "",
    is_default: false,
  })
  const [addressErrors, setAddressErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [activeTab, setActiveTab] = useState("personal")

  useEffect(() => {
    fetchProfile()
    fetchWallets()
    checkPinStatus()
    fetchWalletTransactions(1)
    fetchTotalBalance()
    fetchAddresses()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/api/v1/users/profile/")
      setProfile(response.data)
      setEditData(response.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile information")
    } finally {
      setIsLoading(false)
    }
  }

  // Wallet functions
  const fetchWallets = async () => {
    try {
      setIsLoadingWallets(true)
      const response = await axiosInstance.get("/api/v1/payments/wallet/")
      setWallets(response.data)
    } catch (error) {
      console.error("Error fetching wallets:", error)
      toast.error("Failed to load wallet information")
    } finally {
      setIsLoadingWallets(false)
    }
  }

  const checkPinStatus = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/payments/wallet/has-pin/")
      setHasPinSet(response.data.has_pin)
    } catch (error) {
      console.error("Error checking PIN status:", error)
    }
  }

  const handleTopUp = async () => {
    if (!topUpAmount || Number.parseFloat(topUpAmount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    if (!topUpPin) {
      toast.error("Please enter your wallet PIN")
      return
    }

    try {
      setIsProcessingTopUp(true)
      const response = await axiosInstance.post("/api/v1/payments/wallet/topup/", {
        topup_amount: topUpAmount,
        currency: topUpCurrency,
        pin: topUpPin,
        payment_method: "paypal",
        success_url: window.location.href,
        cancel_url: window.location.href,
      })

      if (response.data.approval_url) {
        window.location.href = response.data.approval_url
      } else {
        toast.error("Failed to initiate top-up")
      }
    } catch (error) {
      console.error("Error topping up wallet:", error)
      toast.error(error.response?.data?.error || "Failed to top-up wallet")
    } finally {
      setIsProcessingTopUp(false)
    }
  }

  const handleSetPin = async () => {
    if (newPin.length < 4 || newPin.length > 6) {
      toast.error("PIN must be 4-6 digits")
      return
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match")
      return
    }

    try {
      setIsProcessingPin(true)
      await axiosInstance.post("/api/v1/payments/wallet/set-pin/", {
        pin: newPin,
      })
      toast.success("Wallet PIN set successfully")
      setShowPinModal(false)
      setNewPin("")
      setConfirmPin("")
      setHasPinSet(true)
    } catch (error) {
      console.error("Error setting PIN:", error)
      toast.error(error.response?.data?.pin?.[0] || "Failed to set PIN")
    } finally {
      setIsProcessingPin(false)
    }
  }

  const handleUpdatePin = async () => {
    if (newPin.length < 4 || newPin.length > 6) {
      toast.error("New PIN must be 4-6 digits")
      return
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match")
      return
    }

    try {
      setIsProcessingPin(true)
      await axiosInstance.post("/api/v1/payments/wallet/update-pin/", {
        pin: currentPin,
        new_pin: newPin,
      })
      toast.success("Wallet PIN updated successfully")
      setShowPinModal(false)
      setCurrentPin("")
      setNewPin("")
      setConfirmPin("")
    } catch (error) {
      console.error("Error updating PIN:", error)
      toast.error(error.response?.data?.error || "Failed to update PIN")
    } finally {
      setIsProcessingPin(false)
    }
  }

  const handleResetPin = async () => {
    if (newPin.length < 4 || newPin.length > 6) {
      toast.error("New PIN must be 4-6 digits")
      return
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match")
      return
    }
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    try {
      setIsProcessingPin(true)
      await axiosInstance.post("/api/v1/payments/wallet/reset-pin/", {
        email,
        pin: newPin,
        password,
      })
      toast.success("Wallet PIN reset successfully")
      setShowPinModal(false)
      setEmail("")
      setPassword("")
      setNewPin("")
      setConfirmPin("")
    } catch (error) {
      console.error("Error resetting PIN:", error)
      toast.error(error.response?.data?.error || "Failed to reset PIN")
    } finally {
      setIsProcessingPin(false)
    }
  }

  // Billing functions
  const fetchWalletTransactions = async (page = 1) => {
    setIsLoadingTransactions(true)
    setTransactionError(null)

    try {
      const params = new URLSearchParams()

      if (typeFilter !== "all") {
        params.append("type", typeFilter)
      }
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (startDate) {
        params.append("start_date", startDate.toISOString().split("T")[0])
      }
      if (endDate) {
        params.append("end_date", endDate.toISOString().split("T")[0])
      }
      if (page > 1) {
        params.append("page", page.toString())
      }

      const queryString = params.toString()
      const url = `/api/v1/payments/wallet/transactions/${queryString ? `?${queryString}` : ""}`

      const response = await axiosInstance.get(url)
      const responseData = response.data
      const transactionsList = Array.isArray(responseData.results) ? responseData.results : []

      setTransactions(transactionsList)
      setTotalCount(responseData.count || 0)
      setHasNext(!!responseData.next)
      setHasPrevious(!!responseData.previous)
      const calculatedTotalPages = Math.ceil((responseData.count || 0) / itemsPerPage)
      setTotalPages(calculatedTotalPages)
      setCurrentPage(page)
    } catch (error) {
      setTransactionError(error.response?.data?.detail || "Failed to fetch wallet transactions.")
      setTransactions([])
      setTotalCount(0)
      setTotalPages(1)
      setCurrentPage(1)
      console.error("Error fetching wallet transactions:", error)
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  const fetchTotalBalance = async () => {
    setIsLoadingBalance(true)
    try {
      const response = await axiosInstance.get("/api/v1/payments/wallet/transactions/?page_size=1000")
      const allTransactions = Array.isArray(response.data.results) ? response.data.results : []
      const balance = allTransactions.reduce((sum, transaction) => {
        const amount = Number.parseFloat(transaction.amount) || 0
        return transaction.transaction_type === "credit" ? sum + amount : sum - amount
      }, 0)
      setTotalWalletBalance(balance)
    } catch (error) {
      console.error("Error fetching total balance:", error)
      setTotalWalletBalance(0)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const handleClearFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setTypeFilter("all")
    setStatusFilter("all")
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchWalletTransactions(newPage)
    }
  }

  const handleApplyFilters = () => {
    setCurrentPage(1)
    fetchWalletTransactions(1)
  }

  const formatCurrency = (amount) => {
    const numAmount = Number.parseFloat(amount) || 0
    return `USD ${numAmount.toFixed(2)}`
  }

  const formatTransactionType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const getTypeBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case "credit":
        return "success"
      case "debit":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "failed":
        return "error"
      case "refunded":
        return "info"
      default:
        return "default"
    }
  }

  const formatTransactionDate = (timestamp) => {
    if (!timestamp) return "N/A"
    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) return "Invalid Date"
      return format(date, "MMM dd, yyyy HH:mm")
    } catch (error) {
      console.error("Error formatting date:", timestamp, error)
      return "Invalid Date"
    }
  }

  const handleBillingCreatePin = async () => {
    setIsSubmittingPin(true)
    setPinMessage(null)
    try {
      const response = await axiosInstance.post("/api/v1/payments/wallet/set-pin/", { pin: walletPin })
      setPinMessage({ type: "success", text: response.data.detail || "Wallet PIN created successfully." })
      setTimeout(() => {
        setIsBalanceModalOpen(false)
        setWalletPin("")
        setPinMessage(null)
        setBillingPinAction("")
      }, 1500)
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to create PIN."
      setPinMessage({ type: "error", text: msg })
    } finally {
      setIsSubmittingPin(false)
    }
  }

  const handleBillingUpdatePin = async () => {
    setIsSubmittingPin(true)
    setPinMessage(null)
    try {
      const response = await axiosInstance.post("/api/v1/payments/wallet/update-pin/", {
        pin: billingCurrentPin,
        new_pin: billingNewPin,
      })
      setPinMessage({ type: "success", text: response.data.detail || "Wallet PIN updated successfully." })
      setTimeout(() => {
        setIsBalanceModalOpen(false)
        setBillingCurrentPin("")
        setBillingNewPin("")
        setPinMessage(null)
        setBillingPinAction("")
      }, 1500)
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to update PIN."
      setPinMessage({ type: "error", text: msg })
    } finally {
      setIsSubmittingPin(false)
    }
  }

  const handleBillingResetPin = async () => {
    setIsSubmittingPin(true)
    setPinMessage(null)
    try {
      const requestData = {
        pin: walletPin,
        email: billingUserEmail,
      }
      if (billingUserPassword) {
        requestData.password = billingUserPassword
      }
      const response = await axiosInstance.post("/api/v1/payments/wallet/reset-pin/", requestData)
      setPinMessage({ type: "success", text: response.data.detail || "Wallet PIN reset successfully." })
      setTimeout(() => {
        setIsBalanceModalOpen(false)
        setWalletPin("")
        setBillingUserEmail("")
        setBillingUserPassword("")
        setPinMessage(null)
        setBillingPinAction("")
      }, 1500)
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to reset PIN."
      setPinMessage({ type: "error", text: msg })
    } finally {
      setIsSubmittingPin(false)
    }
  }

  const handleCheckWalletBalance = async () => {
    setIsCheckingBalance(true)
    setWalletBalance(null)
    setBalanceError(null)
    try {
      const res = await axiosInstance.get("/api/v1/payments/wallet/balance/")
      const balances = Object.entries(res.data)
        .map(([key, value]) => `${key}: ${value.balance} ${value.currency}`)
        .join(", ")
      setWalletBalance(balances)
    } catch (error) {
      setBalanceError(error.response?.data?.error || "Unable to fetch balance.")
    } finally {
      setIsCheckingBalance(false)
    }
  }

  // Address book functions
  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true)
      const response = await axiosInstance.get("/api/v1/users/address-book/")
      setAddresses(response.data)
    } catch (error) {
      console.error("Error fetching addresses:", error)
      toast.error("Failed to fetch addresses")
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const resetAddressForm = () => {
    setAddressFormData({
      full_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state_province_region: "",
      zip_postal_code: "",
      country: "",
      phone_number: "",
      is_default: false,
    })
    setAddressErrors({})
    setEditingId(null)
  }

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressFormData({
      ...addressFormData,
      [name]: type === "checkbox" ? checked : value,
    })
    if (addressErrors[name]) {
      setAddressErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAddressErrors({})

    try {
      if (editingId) {
        await axiosInstance.put(`/api/v1/users/address-book/${editingId}/`, addressFormData)
        toast.success("Address updated successfully!")
      } else {
        await axiosInstance.post("/api/v1/users/address-book/", addressFormData)
        toast.success("Address added successfully!")
      }
      await fetchAddresses()
      resetAddressForm()
    } catch (error) {
      console.error("Error saving address:", error)
      if (error.response && error.response.data) {
        setAddressErrors(error.response.data)
        toast.error("Please check the form for errors.")
      } else {
        toast.error("Failed to save address. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditAddress = (address) => {
    setAddressFormData({
      full_name: address.full_name,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state_province_region: address.state_province_region,
      zip_postal_code: address.zip_postal_code,
      country: address.country,
      phone_number: address.phone_number,
      is_default: address.is_default,
    })
    setEditingId(address.id)
    setAddressErrors({})
  }

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return
    }
    try {
      await axiosInstance.delete(`/api/v1/users/address-book/${id}/`)
      toast.success("Address deleted successfully!")
      await fetchAddresses()
    } catch (error) {
      console.error("Error deleting address:", error)
      toast.error("Failed to delete address. Please try again.")
    }
  }

  const handleSetDefaultAddress = async (id) => {
    try {
      const addressToUpdate = addresses.find((addr) => addr.id === id)
      if (addressToUpdate) {
        await axiosInstance.put(`/api/v1/users/address-book/${id}/`, {
          ...addressToUpdate,
          is_default: true,
        })
        toast.success("Default address updated!")
        await fetchAddresses()
      }
    } catch (error) {
      console.error("Error setting default address:", error)
      toast.error("Failed to update default address.")
    }
  }

  const addressFormFields = [
    { label: "Full Name", name: "full_name", required: true, placeholder: "Enter full name", type: "text" },
    { label: "Phone Number", name: "phone_number", required: true, placeholder: "Enter phone number", type: "tel" },
    {
      label: "Address Line 1",
      name: "address_line1",
      required: true,
      placeholder: "Enter street address",
      type: "text",
    },
    {
      label: "Address Line 2",
      name: "address_line2",
      required: false,
      placeholder: "Apartment, suite, etc. (optional)",
      type: "text",
    },
    { label: "City", name: "city", required: true, placeholder: "Enter city", type: "text" },
    {
      label: "State/Province/Region",
      name: "state_province_region",
      required: true,
      placeholder: "Enter state/province",
      type: "text",
    },
    {
      label: "ZIP/Postal Code",
      name: "zip_postal_code",
      required: true,
      placeholder: "Enter postal code",
      type: "text",
    },
    { label: "Country", name: "country", required: true, placeholder: "Enter country", type: "text" },
  ]

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...profile })
    setErrors({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ ...profile })
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setErrors({})

      const updateData = {
        email: editData.email,
        first_name: editData.first_name,
        last_name: editData.last_name,
        phone_number: editData.phone_number,
      }

      const response = await axiosInstance.put("/api/v1/users/profile/", updateData)
      setProfile(response.data)
      setEditData(response.data)
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      if (error.response && error.response.data) {
        setErrors(error.response.data)
        toast.error("Please check the form for errors.")
      } else {
        toast.error("Failed to update profile. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white shadow-2xl rounded-2xl p-12 text-center border border-gray-200 max-w-md animate-in zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile Not Found</h2>
          <p className="text-muted-foreground leading-relaxed">
            Unable to load your profile information. Please try refreshing the page or contact support.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-8 sm:py-12">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        className="mt-16"
        toastClassName="shadow-xl border border-gray-200"
      />

      <div className="max-w-7xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-white shadow-2xl rounded-2xl border border-gray-200 p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-full blur-3xl opacity-30 -z-0"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-1">
                  My Account
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>Manage your profile, billing and addresses</span>
                  <Info className="h-3.5 w-3.5" />
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4 text-center min-w-[100px] shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-xs text-green-600 font-medium mb-1">Member Since</div>
                <div className="text-sm font-bold text-green-700">{new Date(profile.date_joined).getFullYear()}</div>
              </div>
              <div className="flex-1 sm:flex-none bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4 text-center min-w-[100px] shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-xs text-blue-600 font-medium mb-1">Addresses</div>
                <div className="text-sm font-bold text-blue-700">{addresses.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-0 bg-gradient-to-r from-gray-50 to-gray-100 rounded-none border-b-2 border-gray-200">
            <TabsTrigger
              value="personal"
              className="flex items-center gap-2 py-4 px-4 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-b-black transition-all duration-300 rounded-none relative group"
            >
              <User className="w-4 h-4 group-data-[state=active]:text-black transition-colors" />
              <span className="hidden sm:inline font-medium">Personal Info</span>
              <span className="sm:hidden font-medium">Personal</span>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="flex items-center gap-2 py-4 px-4 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-b-black transition-all duration-300 rounded-none relative group"
            >
              <CreditCard className="w-4 h-4 group-data-[state=active]:text-black transition-colors" />
              <span className="font-medium">Billing</span>
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="flex items-center gap-2 py-4 px-4 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-b-black transition-all duration-300 rounded-none relative group"
            >
              <MapPin className="w-4 h-4 group-data-[state=active]:text-black transition-colors" />
              <span className="hidden sm:inline font-medium">My Addresses</span>
              <span className="sm:hidden font-medium">Addresses</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="p-0 m-0 animate-in fade-in duration-500">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">Update your personal details and contact information</p>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-black hover:bg-gray-800"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="gap-2 hover:bg-gray-50 transition-all duration-300 bg-transparent"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* First Name */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                        <User className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      First Name
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="text"
                          name="first_name"
                          value={editData.first_name || ""}
                          onChange={handleChange}
                          className="w-full h-12 px-4 bg-white rounded-xl text-sm border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 hover:border-gray-300"
                          placeholder="Enter your first name"
                        />
                        {errors.first_name && (
                          <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.first_name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-12 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex items-center text-sm border-2 border-gray-200 font-medium text-gray-900">
                        {profile.first_name || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                        <User className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      Last Name
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="text"
                          name="last_name"
                          value={editData.last_name || ""}
                          onChange={handleChange}
                          className="w-full h-12 px-4 bg-white rounded-xl text-sm border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 hover:border-gray-300"
                          placeholder="Enter your last name"
                        />
                        {errors.last_name && (
                          <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.last_name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-12 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex items-center text-sm border-2 border-gray-200 font-medium text-gray-900">
                        {profile.last_name || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      Phone Number
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="text"
                          name="phone_number"
                          value={editData.phone_number || ""}
                          onChange={handleChange}
                          className="w-full h-12 px-4 bg-white rounded-xl text-sm border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 hover:border-gray-300"
                          placeholder="Enter your phone number"
                        />
                        {errors.phone_number && (
                          <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.phone_number}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-12 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex items-center text-sm border-2 border-gray-200 font-medium text-gray-900">
                        {profile.phone_number || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Email */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      Email Address
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={editData.email || ""}
                          onChange={handleChange}
                          className="w-full h-12 px-4 bg-white rounded-xl text-sm border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 hover:border-gray-300"
                          placeholder="Enter your email address"
                        />
                        {errors.email && (
                          <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-12 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex items-center text-sm border-2 border-gray-200 font-medium text-gray-900">
                        {profile.email}
                      </div>
                    )}
                  </div>

                  {/* Suite Number (Read-only) */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <Home className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      Suite Number
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        <Lock className="h-3 w-3" />
                        Read-only
                      </span>
                    </label>
                    <div className="w-full h-12 px-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center text-sm border-2 border-gray-300 text-gray-600 cursor-not-allowed">
                      {profile.suite_number || "Not assigned"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Suite number cannot be changed
                    </p>
                  </div>

                  {/* Referral Code (Read-only) */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <Gift className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      Referral Code
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        <Lock className="h-3 w-3" />
                        Read-only
                      </span>
                    </label>
                    <div className="w-full h-12 px-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center text-sm border-2 border-gray-300 text-gray-600 cursor-not-allowed font-mono">
                      {profile.referral_code || "Not provided"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Referral code cannot be changed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t-2 border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                      User ID
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <User className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 font-mono">#{profile.id}</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                      <Calendar className="inline h-3.5 w-3.5 mr-1" />
                      Member Since
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Calendar className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{formatDate(profile.date_joined)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="p-0 m-0 animate-in fade-in duration-500">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <Wallet className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Billing History</h1>
                      <p className="text-sm text-muted-foreground">Track your transactions and manage wallet</p>
                    </div>
                  </div>

                  {!isLoadingBalance && (
                    <div className="mt-4 inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition-all duration-300">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-xs text-green-600 font-medium">Current Balance</div>
                        <div className="text-xl font-bold text-green-700">{formatCurrency(totalWalletBalance)}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setIsBalanceModalOpen(true)}
                    variant="outline"
                    className="gap-2 h-11 shadow-md hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-400"
                  >
                    <Wallet className="h-4 w-4" />
                    <span>View Balance</span>
                  </Button>
                  <Button
                    onClick={() => setBillingPinAction("create")}
                    className="gap-2 h-11 shadow-lg hover:shadow-xl transition-all duration-300 bg-black hover:bg-gray-800"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Manage PIN</span>
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Filter Transactions</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 shadow-sm">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="debit">Debit</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 bg-white border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 shadow-sm">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>

                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start date"
                    dateFormat="MMM dd, yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={10}
                    scrollableYearDropdown
                    maxDate={endDate || new Date()}
                    customInput={<CustomDateInput placeholder="Start date" />}
                    popperClassName="z-50"
                    calendarClassName="shadow-2xl border-2 border-gray-200 rounded-xl"
                  />

                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    maxDate={new Date()}
                    placeholderText="End date"
                    dateFormat="MMM dd, yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={10}
                    scrollableYearDropdown
                    customInput={<CustomDateInput placeholder="End date" />}
                    popperClassName="z-50"
                    calendarClassName="shadow-2xl border-2 border-gray-200 rounded-xl"
                  />

                  <div className="sm:col-span-2 lg:col-span-1 flex gap-2">
                    <Button
                      className="flex-1 h-11 gap-2 shadow-md hover:shadow-lg transition-all duration-300 bg-black hover:bg-gray-800"
                      onClick={handleApplyFilters}
                      disabled={isLoadingTransactions}
                    >
                      <Search className="h-4 w-4" />
                      <span className="hidden sm:inline">Apply</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-11 border-2 hover:bg-gray-50 transition-all duration-300 bg-transparent"
                      onClick={handleClearFilters}
                      disabled={isLoadingTransactions}
                    >
                      <X className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                  </div>
                </div>

                {(startDate || endDate || typeFilter !== "all" || statusFilter !== "all") && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-gray-600">Active filters:</span>
                      {typeFilter !== "all" && <StatusBadge type="info">Type: {typeFilter}</StatusBadge>}
                      {statusFilter !== "all" && <StatusBadge type="info">Status: {statusFilter}</StatusBadge>}
                      {startDate && <StatusBadge type="info">From: {format(startDate, "MMM dd, yyyy")}</StatusBadge>}
                      {endDate && <StatusBadge type="info">To: {format(endDate, "MMM dd, yyyy")}</StatusBadge>}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-1">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-bold text-gray-900">{transactions.length}</span> of{" "}
                  <span className="font-bold text-gray-900">{totalCount}</span> transactions
                </div>
                {totalPages > 1 && (
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                )}
              </div>

              {transactionError && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-2 border-red-200 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Error loading transactions</p>
                      <p className="text-sm">{transactionError}</p>
                    </div>
                  </div>
                </div>
              )}

              {isLoadingTransactions && (
                <div className="mb-6 text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200">
                  <RefreshCw className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-sm text-gray-600 font-medium">Loading wallet transactions...</p>
                  <p className="text-xs text-muted-foreground mt-1">Please wait while we fetch your data</p>
                </div>
              )}

              <div className="overflow-hidden rounded-2xl border-2 border-gray-200 shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-gray-700">
                      <tr>
                        <th className="p-4 text-xs font-bold text-white tracking-wider uppercase text-left">
                          Transaction ID
                        </th>
                        <th className="p-4 text-xs font-bold text-white tracking-wider uppercase text-left">Type</th>
                        <th className="p-4 text-xs font-bold text-white tracking-wider uppercase text-left">Status</th>
                        <th className="p-4 text-xs font-bold text-white tracking-wider uppercase text-left">
                          Date & Time
                        </th>
                        <th className="p-4 text-xs font-bold text-white tracking-wider uppercase text-left">
                          Description
                        </th>
                        <th className="p-4 text-xs font-bold text-white tracking-wider uppercase text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {transactions.length === 0 && !isLoadingTransactions ? (
                        <tr>
                          <td colSpan={6} className="p-0">
                            <EmptyState
                              icon={Wallet}
                              title="No transactions found"
                              description={
                                transactionError
                                  ? "Failed to load transactions. Please try again."
                                  : "No transactions match your current filters. Try adjusting your filter criteria."
                              }
                              action={
                                (startDate || endDate || typeFilter !== "all" || statusFilter !== "all") && (
                                  <Button
                                    onClick={handleClearFilters}
                                    variant="outline"
                                    className="shadow-md hover:shadow-lg transition-all duration-300 bg-transparent"
                                  >
                                    Clear Filters
                                  </Button>
                                )
                              }
                            />
                          </td>
                        </tr>
                      ) : (
                        transactions.map((transaction, index) => (
                          <tr
                            key={transaction.id}
                            className={cn(
                              "hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 group",
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                            )}
                          >
                            <td className="p-4 text-sm font-mono font-medium text-gray-900">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                  <CreditCard className="h-4 w-4 text-gray-600" />
                                </div>
                                #{transaction.id}
                              </div>
                            </td>
                            <td className="p-4">
                              <StatusBadge type={getTypeBadgeColor(transaction.transaction_type)}>
                                {transaction.transaction_type === "credit" ? (
                                  <ArrowUpRight className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3 mr-1" />
                                )}
                                {formatTransactionType(transaction.transaction_type)}
                              </StatusBadge>
                            </td>
                            <td className="p-4">
                              <StatusBadge type={getStatusBadgeColor(transaction.status)}>
                                {transaction.status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {transaction.status === "pending" && <RefreshCw className="h-3 w-3 mr-1" />}
                                {transaction.status === "failed" && <AlertCircle className="h-3 w-3 mr-1" />}
                                {formatTransactionType(transaction.status)}
                              </StatusBadge>
                            </td>
                            <td className="p-4 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                {formatTransactionDate(transaction.timestamp)}
                              </div>
                            </td>
                            <td className="p-4 text-sm text-gray-700">
                              {transaction.description || (
                                <span className="text-muted-foreground italic">No description</span>
                              )}
                            </td>
                            <td
                              className={cn(
                                "p-4 text-sm font-bold text-right tabular-nums",
                                transaction.transaction_type === "credit" ? "text-green-600" : "text-red-600",
                              )}
                            >
                              <div className="flex items-center justify-end gap-2">
                                {transaction.transaction_type === "credit" ? "+" : "-"}
                                {formatCurrency(transaction.amount)}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevious || isLoadingTransactions}
                      className="gap-2 border-2 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                        if (pageNum > totalPages) return null
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoadingTransactions}
                            className={cn(
                              "w-10 h-10 p-0 font-semibold transition-all duration-300",
                              currentPage === pageNum
                                ? "bg-black text-white shadow-lg hover:shadow-xl"
                                : "border-2 hover:bg-gray-50 shadow-sm hover:shadow-md",
                            )}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNext || isLoadingTransactions}
                      className="gap-2 border-2 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground font-medium">
                    Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)}{" "}
                    of {totalCount}
                  </div>
                </div>
              )}

              {transactions.length > 0 && (
                <div className="mt-8 pt-8 border-t-2 border-gray-100 flex justify-center sm:justify-end">
                  <Button
                    variant="outline"
                    className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 border-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export to CSV</span>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="p-0 m-0 animate-in fade-in duration-500">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg">
                        {editingId ? <Edit3 className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {editingId ? "Edit Address" : "Add New Address"}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {editingId ? "Update your address details" : "Fill in the form to add a new address"}
                        </p>
                      </div>
                    </div>
                    {editingId && (
                      <Button
                        onClick={resetAddressForm}
                        variant="ghost"
                        size="sm"
                        className="gap-1 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                      >
                        <X className="h-4 w-4" />
                        <span className="text-xs">Cancel</span>
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleAddressSubmit} className="space-y-5">
                    {addressFormFields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={addressFormData[field.name]}
                          onChange={handleAddressChange}
                          required={field.required}
                          placeholder={field.placeholder}
                          className="w-full h-11 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300 hover:border-gray-300 placeholder:text-gray-400"
                        />
                        {addressErrors[field.name] && (
                          <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {addressErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-all duration-300 cursor-pointer">
                      <button
                        type="button"
                        className="relative w-6 h-6 flex items-center justify-center"
                        onClick={() =>
                          handleAddressChange({
                            target: { name: "is_default", type: "checkbox", checked: !addressFormData.is_default },
                          })
                        }
                      >
                        <div
                          className={cn(
                            "w-6 h-6 border-2 rounded-lg transition-all duration-300 flex items-center justify-center",
                            addressFormData.is_default
                              ? "bg-black border-black shadow-lg"
                              : "border-gray-300 bg-white hover:border-gray-400 shadow-sm",
                          )}
                        >
                          {addressFormData.is_default && <Check className="h-4 w-4 text-white" />}
                        </div>
                      </button>
                      <label
                        className="text-sm font-medium text-gray-800 cursor-pointer flex-1"
                        onClick={() =>
                          handleAddressChange({
                            target: { name: "is_default", type: "checkbox", checked: !addressFormData.is_default },
                          })
                        }
                      >
                        Set as default shipping address
                      </label>
                      <Star
                        className={cn(
                          "h-5 w-5",
                          addressFormData.is_default ? "text-amber-500 fill-amber-500" : "text-gray-400",
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 gap-2 shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold bg-black hover:bg-gray-800"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : editingId ? (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Update Address</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          <span>Save Address</span>
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Your Addresses</h3>
                      <p className="text-xs text-muted-foreground mt-1">Manage your saved shipping addresses</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl shadow-md">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-bold">{addresses.length}</span>
                    </div>
                  </div>

                  {isLoadingAddresses ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-40 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl animate-pulse"
                        ></div>
                      ))}
                    </div>
                  ) : addresses.length === 0 ? (
                    <EmptyState
                      icon={MapPin}
                      title="No addresses yet"
                      description="Add your first shipping address using the form on the left. You can save multiple addresses and set a default one."
                      action={
                        <div className="flex flex-col items-center gap-3">
                          <Button
                            onClick={() => document.querySelector('input[name="full_name"]')?.focus()}
                            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Your First Address</span>
                          </Button>
                        </div>
                      }
                    />
                  ) : (
                    <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {addresses.map((address, index) => (
                        <div
                          key={address.id}
                          className={cn(
                            "p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg group animate-in fade-in slide-in-from-right-4",
                            address.is_default
                              ? "border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-gray-300 shadow-sm",
                          )}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              {address.is_default && (
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1.5 rounded-lg mb-3 shadow-md">
                                  <Star className="h-3.5 w-3.5 fill-current" />
                                  <span className="text-xs font-bold uppercase tracking-wide">Default Address</span>
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                  <p className="text-base font-bold text-gray-900">{address.full_name}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                  <span>{address.phone_number}</span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm text-gray-700">
                                  <p className="font-medium">{address.address_line1}</p>
                                  {address.address_line2 && <p className="text-gray-600">{address.address_line2}</p>}
                                  <p>
                                    {address.city}, {address.state_province_region} {address.zip_postal_code}
                                  </p>
                                  <p className="font-semibold text-gray-900">{address.country}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <Button
                                onClick={() => handleEditAddress(address)}
                                size="sm"
                                variant="outline"
                                className="gap-1.5 h-9 border-2 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Edit</span>
                              </Button>
                              {!address.is_default && (
                                <Button
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                  size="sm"
                                  className="gap-1.5 h-9 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                  <Star className="h-3.5 w-3.5" />
                                  <span className="text-xs font-medium">Default</span>
                                </Button>
                              )}
                              <Button
                                onClick={() => handleDeleteAddress(address.id)}
                                size="sm"
                                variant="outline"
                                className="gap-1.5 h-9 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Top Up Wallet</h3>
                  <p className="text-xs text-muted-foreground">Add funds to your wallet</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTopUpModal(false)
                  setTopUpAmount("")
                  setTopUpCurrency("USD")
                  setTopUpPin("")
                }}
                className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-12 pl-8 pr-4 bg-white border-2 border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                <select
                  value={topUpCurrency}
                  onChange={(e) => setTopUpCurrency(e.target.value)}
                  className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Wallet PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={topUpPin}
                  onChange={(e) => setTopUpPin(e.target.value)}
                  placeholder="Enter your PIN"
                  className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm text-center focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 font-mono tracking-widest"
                />
              </div>

              <Button
                onClick={handleTopUp}
                disabled={isProcessingTopUp || !topUpAmount || !topUpPin}
                className="w-full h-12 gap-2 shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold bg-green-600 hover:bg-green-700"
              >
                {isProcessingTopUp ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Top Up via PayPal</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {hasPinSet ? "Manage Wallet PIN" : "Setup Wallet PIN"}
                  </h3>
                  <p className="text-xs text-muted-foreground">Secure your wallet transactions</p>
                </div>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {!pinAction ? (
                <div className="space-y-3">
                  {!hasPinSet ? (
                    <Button
                      onClick={() => setPinAction("setup")}
                      className="w-full h-12 gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-black hover:bg-gray-800"
                    >
                      <Lock className="h-5 w-5" />
                      <span>Setup PIN</span>
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => setPinAction("update")}
                        className="w-full h-12 gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-black hover:bg-gray-800"
                      >
                        <RefreshCw className="h-5 w-5" />
                        <span>Update PIN</span>
                      </Button>
                      <Button
                        onClick={() => setPinAction("reset")}
                        variant="outline"
                        className="w-full h-12 gap-2 shadow-md hover:shadow-lg transition-all duration-300 border-2"
                      >
                        <AlertCircle className="h-5 w-5" />
                        <span>Reset PIN</span>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {pinAction === "setup" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New PIN (4-6 digits)</label>
                        <input
                          type="password"
                          maxLength={6}
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="Enter PIN"
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm text-center focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 font-mono tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm PIN</label>
                        <input
                          type="password"
                          maxLength={6}
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="Confirm PIN"
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm text-center focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 font-mono tracking-widest"
                        />
                      </div>
                    </div>
                  )}

                  {pinAction === "update" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Current PIN</label>
                        <input
                          type="password"
                          maxLength={6}
                          value={currentPin}
                          onChange={(e) => setCurrentPin(e.target.value)}
                          placeholder="Enter current PIN"
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm text-center focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 font-mono tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New PIN (4-6 digits)</label>
                        <input
                          type="password"
                          maxLength={6}
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="Enter new PIN"
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm text-center focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 font-mono tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New PIN</label>
                        <input
                          type="password"
                          maxLength={6}
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="Confirm new PIN"
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm text-center focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 font-mono tracking-widest"
                        />
                      </div>
                    </div>
                  )}

                  {pinAction === "reset" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New PIN (4-6 digits)</label>
                        <input
                          type="password"
                          maxLength={6}
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="Enter new PIN"
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm text-center focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 font-mono tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New PIN</label>
                        <input
                          type="password"
                          maxLength={6}
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="Confirm new PIN"
                          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm text-center focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all duration-300 font-mono tracking-widest"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        setPinAction("")
                        setCurrentPin("")
                        setNewPin("")
                        setConfirmPin("")
                        setEmail("")
                        setPassword("")
                      }}
                      variant="outline"
                      className="flex-1 h-11 border-2 hover:bg-gray-50 transition-all duration-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        if (pinAction === "setup") handleSetPin()
                        else if (pinAction === "update") handleUpdatePin()
                        else if (pinAction === "reset") handleResetPin()
                      }}
                      disabled={isProcessingPin}
                      className="flex-1 h-11 shadow-lg hover:shadow-xl transition-all duration-300 bg-black hover:bg-gray-800"
                    >
                      {isProcessingPin ? "Processing..." : pinAction.charAt(0).toUpperCase() + pinAction.slice(1)}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isBalanceModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Wallet Balance</h3>
                <p className="text-xs text-muted-foreground">View your current wallet balances</p>
              </div>
            </div>

            {balanceError && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-2 border-red-200 mb-4 animate-in fade-in duration-300">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{balanceError}</p>
                  </div>
                </div>
              </div>
            )}

            {walletBalance && (
              <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-300 mb-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                      Current Balance
                    </p>
                    <p className="text-lg font-bold text-green-800">{walletBalance}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleCheckWalletBalance}
                disabled={isCheckingBalance}
                className="flex-1 h-12 gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-black hover:bg-gray-800"
              >
                {isCheckingBalance ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-5 w-5" />
                    <span>Check Balance</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsBalanceModalOpen(false)
                  setBalanceError(null)
                  setWalletBalance(null)
                }}
                className="flex-1 h-12 border-2 hover:bg-gray-50 transition-all duration-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {billingPinAction && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {billingPinAction === "create"
                    ? "Create Wallet PIN"
                    : billingPinAction === "update"
                      ? "Update Wallet PIN"
                      : "Reset Wallet PIN"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {billingPinAction === "create" && "Create a 4-digit PIN to secure your wallet"}
                  {billingPinAction === "update" && "Enter your current PIN and new PIN"}
                  {billingPinAction === "reset" && "Reset your PIN with email verification"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {billingPinAction === "create" && (
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Enter New PIN</Label>
                  <Input
                    type="password"
                    maxLength={8}
                    value={walletPin}
                    onChange={(e) => setWalletPin(e.target.value)}
                    placeholder="••••"
                    className="h-12 text-center text-lg font-mono tracking-widest border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300"
                  />
                </div>
              )}

              {billingPinAction === "update" && (
                <>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Current PIN</Label>
                    <Input
                      type="password"
                      maxLength={8}
                      value={billingCurrentPin}
                      onChange={(e) => setBillingCurrentPin(e.target.value)}
                      placeholder="••••"
                      className="h-12 text-center text-lg font-mono tracking-widest border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">New PIN</Label>
                    <Input
                      type="password"
                      maxLength={8}
                      value={billingNewPin}
                      onChange={(e) => setBillingNewPin(e.target.value)}
                      placeholder="••••"
                      className="h-12 text-center text-lg font-mono tracking-widest border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300"
                    />
                  </div>
                </>
              )}

              {billingPinAction === "reset" && (
                <>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">New PIN</Label>
                    <Input
                      type="password"
                      maxLength={8}
                      value={walletPin}
                      onChange={(e) => setWalletPin(e.target.value)}
                      placeholder="••••"
                      className="h-12 text-center text-lg font-mono tracking-widest border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</Label>
                    <Input
                      type="email"
                      value={billingUserEmail}
                      onChange={(e) => setBillingUserEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-12 border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Password</Label>
                    <Input
                      type="password"
                      value={billingUserPassword}
                      onChange={(e) => setBillingUserPassword(e.target.value)}
                      placeholder="Your account password"
                      className="h-12 border-2 border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-300"
                    />
                  </div>
                </>
              )}
            </div>

            {pinMessage && (
              <div
                className={cn(
                  "p-4 rounded-xl text-sm mt-4 border-2 animate-in fade-in slide-in-from-top-2 duration-300",
                  pinMessage.type === "success"
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200"
                    : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
                )}
              >
                <div className="flex items-center gap-2">
                  {pinMessage.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span className="font-medium">{pinMessage.text}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setBillingPinAction("")
                  setWalletPin("")
                  setBillingCurrentPin("")
                  setBillingNewPin("")
                  setBillingUserEmail("")
                  setBillingUserPassword("")
                  setPinMessage(null)
                }}
                className="flex-1 h-12 border-2 hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (billingPinAction === "create") handleBillingCreatePin()
                  else if (billingPinAction === "update") handleBillingUpdatePin()
                  else if (billingPinAction === "reset") handleBillingResetPin()
                }}
                disabled={
                  isSubmittingPin ||
                  (billingPinAction === "create" && (walletPin.length < 4 || walletPin.length > 8)) ||
                  (billingPinAction === "update" &&
                    (billingCurrentPin.length < 4 ||
                      billingNewPin.length < 4 ||
                      billingCurrentPin.length > 8 ||
                      billingNewPin.length > 8)) ||
                  (billingPinAction === "reset" && (walletPin.length < 4 || walletPin.length > 8 || !billingUserEmail))
                }
                className="flex-1 h-12 gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-black hover:bg-gray-800"
              >
                {isSubmittingPin ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {billingPinAction === "create"
                      ? "Create PIN"
                      : billingPinAction === "update"
                        ? "Update PIN"
                        : "Reset PIN"}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAccount
