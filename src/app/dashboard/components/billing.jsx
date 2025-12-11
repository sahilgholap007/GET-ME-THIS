"use client"

import { useState, useEffect } from "react"
import { Search, CalendarIcon, Download, Wallet, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axiosInstance from "../../utils/axiosInstance"

// UI Components
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Custom DatePicker Input Component
const CustomDateInput = ({ value, onClick, placeholder, className }) => (
  <Button
    variant="outline"
    className={cn(
      "w-full md:w-auto flex-grow justify-start text-left font-geist-normal h-10 sm:h-12 bg-gray-50 tracking-wide text-xs sm:text-sm",
      !value && "text-gray-500",
      className,
    )}
    onClick={onClick}
  >
    <CalendarIcon className="mr-2 h-4 w-4" />
    {value || <span>{placeholder}</span>}
  </Button>
)

export default function Billing() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // PIN functionality states
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [walletPin, setWalletPin] = useState("")
  const [isSubmittingPin, setIsSubmittingPin] = useState(false)
  const [pinMessage, setPinMessage] = useState(null)
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false)
  const [balancePin, setBalancePin] = useState("")
  const [walletBalance, setWalletBalance] = useState(null)
  const [isCheckingBalance, setIsCheckingBalance] = useState(false)
  const [balanceError, setBalanceError] = useState(null)

  // Add these new states after the existing PIN states
  const [hasPinSet, setHasPinSet] = useState(false)
  const [isCheckingPinStatus, setIsCheckingPinStatus] = useState(false)
  const [pinAction, setPinAction] = useState("") // "create", "update", "reset"
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")

  // API transactions states
  const [transactions, setTransactions] = useState([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [transactionError, setTransactionError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [itemsPerPage] = useState(20) // Assuming 20 items per page
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  // Balance calculation states
  const [totalWalletBalance, setTotalWalletBalance] = useState(0)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const fetchWalletTransactions = async (page = 1) => {
    setIsLoadingTransactions(true)
    setTransactionError(null)

    try {
      const params = new URLSearchParams()

      // Add filters to API call
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

      // Handle the paginated response structure
      const responseData = response.data
      const transactionsList = Array.isArray(responseData.results) ? responseData.results : []

      setTransactions(transactionsList)
      setTotalCount(responseData.count || 0)
      setHasNext(!!responseData.next)
      setHasPrevious(!!responseData.previous)

      // Calculate total pages
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

  // Fetch total wallet balance (all transactions for balance calculation)
  const fetchTotalBalance = async () => {
    setIsLoadingBalance(true)
    try {
      // Fetch all transactions without filters to calculate total balance
      const response = await axiosInstance.get("/api/v1/payments/wallet/transactions/?page_size=1000")
      const allTransactions = Array.isArray(response.data.results) ? response.data.results : []

      // Calculate total balance from all transactions
      const balance = allTransactions.reduce((sum, transaction) => {
        const amount = Number.parseFloat(transaction.amount) || 0
        // Credit adds to balance, debit subtracts from balance
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

  // Load transactions and balance on component mount
  useEffect(() => {
    fetchWalletTransactions(1)
    fetchTotalBalance()
  }, [])

  // Reload transactions when filters change (but keep current page if possible)
  useEffect(() => {
    fetchWalletTransactions(1) // Reset to page 1 when filters change
  }, [typeFilter, statusFilter, startDate, endDate])

  // Check PIN status on component mount
  useEffect(() => {
    checkPinStatus()
  }, [])

  const checkPinStatus = async () => {
    setIsCheckingPinStatus(true)
    try {
      const response = await axiosInstance.get("/api/v1/payments/wallet/has-pin/")
      setHasPinSet(response.data.has_pin)
    } catch (error) {
      console.error("Error checking PIN status:", error)
      setHasPinSet(false)
    } finally {
      setIsCheckingPinStatus(false)
    }
  }

  const handleClearFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setTypeFilter("all")
    setStatusFilter("all")
    // fetchWalletTransactions will be called automatically due to useEffect
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchWalletTransactions(newPage)
    }
  }

  const handleApplyFilters = () => {
    setCurrentPage(1) // Reset to first page
    fetchWalletTransactions(1)
    console.log("Filters applied:", {
      typeFilter: typeFilter !== "all" ? typeFilter : null,
      statusFilter: statusFilter !== "all" ? statusFilter : null,
      startDate: startDate ? startDate.toISOString().split("T")[0] : null,
      endDate: endDate ? endDate.toISOString().split("T")[0] : null,
    })
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
        return "bg-green-100 text-green-800"
      case "debit":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Generate page numbers for pagination
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

  const handleCreatePin = async () => {
    setIsSubmittingPin(true)
    setPinMessage(null)
    try {
      const response = await axiosInstance.post("/api/v1/payments/wallet/set-pin/", { pin: walletPin })
      setPinMessage({ type: "success", text: response.data.detail || "Wallet PIN created successfully." })
      setHasPinSet(true)
      setTimeout(() => {
        setIsPinModalOpen(false)
        setWalletPin("")
        setPinMessage(null)
        setPinAction("")
      }, 1500)
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to create PIN."
      setPinMessage({ type: "error", text: msg })
    } finally {
      setIsSubmittingPin(false)
    }
  }

  const handleUpdatePin = async () => {
    setIsSubmittingPin(true)
    setPinMessage(null)
    try {
      const response = await axiosInstance.post("/api/v1/payments/wallet/update-pin/", {
        pin: currentPin,
        new_pin: newPin,
      })
      setPinMessage({ type: "success", text: response.data.detail || "Wallet PIN updated successfully." })
      setTimeout(() => {
        setIsPinModalOpen(false)
        setCurrentPin("")
        setNewPin("")
        setPinMessage(null)
        setPinAction("")
      }, 1500)
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to update PIN."
      setPinMessage({ type: "error", text: msg })
    } finally {
      setIsSubmittingPin(false)
    }
  }

  const handleResetPin = async () => {
    setIsSubmittingPin(true)
    setPinMessage(null)
    try {
      const requestData = {
        pin: walletPin,
        email: userEmail,
      }
      if (userPassword) {
        requestData.password = userPassword
      }

      const response = await axiosInstance.post("/api/v1/payments/wallet/reset-pin/", requestData)
      setPinMessage({ type: "success", text: response.data.detail || "Wallet PIN reset successfully." })
      setTimeout(() => {
        setIsPinModalOpen(false)
        setWalletPin("")
        setUserEmail("")
        setUserPassword("")
        setPinMessage(null)
        setPinAction("")
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
      // Assuming it returns an object with currency keys
      const balances = Object.entries(res.data).map(([key, value]) => `${key}: ${value.balance} ${value.currency}`).join(", ")
      setWalletBalance(balances)
    } catch (error) {
      setBalanceError(error.response?.data?.error || "Unable to fetch balance.")
    } finally {
      setIsCheckingBalance(false)
    }
  }

  return (
    <div className="bg-gray-100 py-12 sm:py-16 lg:py-24 font-geist-normal">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Section Header --- */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="font-monument-regular text-2xl sm:text-3xl lg:text-4xl text-gray-800 tracking-wider uppercase leading-tight">
              Billing History
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 tracking-wider font-geist-normal mt-1 sm:mt-2">
              Dashboard &gt; Billing History
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={() => setIsBalanceModalOpen(true)}
              variant="outline"
              className="font-monument-regular tracking-widest text-xs sm:text-sm h-10 sm:h-12 hover:bg-gray-50 transition-colors px-4 sm:px-6"
            >
              <Wallet className="mr-2 h-4 w-4" />
              VIEW BALANCE
            </Button>
            <Button
              onClick={() => setIsPinModalOpen(true)}
              className="bg-black text-white font-monument-regular tracking-widest text-xs sm:text-sm h-10 sm:h-12 hover:bg-gray-800 transition-colors px-4 sm:px-6"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isCheckingPinStatus ? "LOADING..." : hasPinSet ? "MANAGE PIN" : "CREATE PIN"}
            </Button>
          </div>
        </div>

        {/* --- Main Content Card --- */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
          {/* Filter Bar */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48 h-10 sm:h-12 bg-gray-50 font-geist-normal tracking-wide text-xs sm:text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 h-10 sm:h-12 bg-gray-50 font-geist-normal tracking-wide text-xs sm:text-sm">
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

            {/* --- Start Date Picker --- */}
            <div className="w-full lg:flex-grow">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Pick a start date"
                dateFormat="MMM dd, yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                yearDropdownItemNumber={10}
                scrollableYearDropdown
                maxDate={endDate || new Date()}
                customInput={<CustomDateInput placeholder="Pick a start date" className="w-full" />}
                popperClassName="z-50"
                calendarClassName="shadow-lg border border-gray-200 rounded-lg"
              />
            </div>
            {/* --- End Date Picker --- */}
            <div className="w-full lg:flex-grow">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                placeholderText="Pick an end date"
                dateFormat="MMM dd, yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                yearDropdownItemNumber={10}
                scrollableYearDropdown
                customInput={<CustomDateInput placeholder="Pick an end date" className="w-full" />}
                popperClassName="z-50"
                calendarClassName="shadow-lg border border-gray-200 rounded-lg"
              />
            </div>
            <Button
              className="w-full lg:w-auto h-10 sm:h-12 bg-black text-white font-monument-regular tracking-widest text-xs sm:text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 px-4 sm:px-6"
              onClick={handleApplyFilters}
              disabled={isLoadingTransactions}
            >
              <Search className="h-4 w-4" />
              APPLY FILTERS
            </Button>
            <Button
              variant="outline"
              className="w-full lg:w-auto h-10 sm:h-12 font-monument-regular tracking-widest text-xs sm:text-sm bg-transparent px-4 sm:px-6"
              onClick={handleClearFilters}
              disabled={isLoadingTransactions}
            >
              CLEAR FILTERS
            </Button>
          </div>

          {/* --- Results Summary --- */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-600 font-geist-normal">
              Showing {transactions.length} of {totalCount} transactions
              {(startDate || endDate || typeFilter !== "all" || statusFilter !== "all") && (
                <span className="ml-2 text-gray-500">
                  (filtered
                  {typeFilter !== "all" && ` • type: ${typeFilter}`}
                  {statusFilter !== "all" && ` • status: ${statusFilter}`}
                  {startDate && ` • from: ${format(startDate, "MMM dd, yyyy")}`}
                  {endDate && ` • to: ${format(endDate, "MMM dd, yyyy")}`})
                </span>
              )}
            </div>
            {totalPages > 1 && (
              <div className="text-xs sm:text-sm text-gray-600 font-geist-normal">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

          {/* --- Error Display --- */}
          {transactionError && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
              <p className="text-xs sm:text-sm font-geist-normal tracking-wide">{transactionError}</p>
            </div>
          )}

          {/* --- Loading State --- */}
          {isLoadingTransactions && (
            <div className="mb-4 sm:mb-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600 font-geist-normal tracking-wide">
                Loading wallet transactions...
              </p>
            </div>
          )}

          {/* --- Billing Table --- */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-2 sm:p-3 text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                    Transaction ID
                  </th>
                  <th className="p-2 sm:p-3 text-xs font-monument-regular text-gray-500 tracking-widest uppercase">Type</th>
                  <th className="p-2 sm:p-3 text-xs font-monument-regular text-gray-500 tracking-widest uppercase">Status</th>
                  <th className="p-2 sm:p-3 text-xs font-monument-regular text-gray-500 tracking-widest uppercase">Date</th>
                  <th className="p-2 sm:p-3 text-xs font-monument-regular text-gray-500 tracking-widest uppercase">
                    Description
                  </th>
                  <th className="p-2 sm:p-3 text-xs font-monument-regular text-gray-500 tracking-widest uppercase text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && !isLoadingTransactions ? (
                  <tr>
                    <td colSpan={6} className="text-center p-12 sm:p-16 text-gray-500 tracking-wide font-geist-normal">
                      {transactionError
                        ? "Failed to load transactions."
                        : "No transactions found for the selected filters."}
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-2 sm:p-3 text-xs sm:text-sm font-geist-normal tracking-wide">#{transaction.id}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm font-geist-normal tracking-wide">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-geist-normal tracking-wide",
                            getTypeBadgeColor(transaction.transaction_type),
                          )}
                        >
                          {formatTransactionType(transaction.transaction_type)}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm font-geist-normal tracking-wide">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-geist-normal tracking-wide",
                            getStatusBadgeColor(transaction.status),
                          )}
                        >
                          {formatTransactionType(transaction.status)}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm font-geist-normal tracking-wide">
                        {formatTransactionDate(transaction.timestamp)}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm font-geist-normal tracking-wide">
                        {transaction.description || "-"}
                      </td>
                      <td
                        className={cn(
                          "p-2 sm:p-3 text-xs sm:text-sm font-monument-regular tracking-wide text-right",
                          transaction.transaction_type === "credit" ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {transaction.transaction_type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --- Pagination --- */}
          {totalPages > 1 && (
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevious || isLoadingTransactions}
                  className="font-monument-regular tracking-wider text-xs sm:text-sm px-3 sm:px-4"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoadingTransactions}
                      className={cn(
                        "font-monument-regular tracking-wider text-xs sm:text-sm w-8 h-8 sm:w-10 sm:h-10",
                        currentPage === pageNum && "bg-black text-white",
                      )}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNext || isLoadingTransactions}
                  className="font-monument-regular tracking-wider text-xs sm:text-sm px-3 sm:px-4"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 font-geist-normal tracking-wide">
                {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                {totalCount}
              </div>
            </div>
          )}

          {/* --- Export Options --- */}
          {transactions.length > 0 && (
            <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
              <Button variant="outline" className="font-monument-regular tracking-widest text-xs sm:text-sm bg-transparent px-4 sm:px-6">
                <Download className="h-4 w-4 mr-2" />
                EXPORT CSV
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced PIN Management Modal */}
        {isPinModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm shadow-xl">
              {!pinAction ? (
                // PIN Action Selection
                <>
                  <h3 className="text-lg sm:text-xl font-monument-regular text-gray-900 tracking-wider mb-2 uppercase">
                    {hasPinSet ? "Manage Wallet PIN" : "Create Wallet PIN"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-geist-normal tracking-wide mb-4 sm:mb-6 leading-relaxed">
                    {hasPinSet ? "Choose an action for your wallet PIN" : "Create a 4-digit PIN to secure your wallet"}
                  </p>

                  <div className="space-y-3">
                    {!hasPinSet ? (
                      <Button
                        onClick={() => setPinAction("create")}
                        className="w-full h-10 sm:h-11 bg-black text-white font-monument-regular tracking-widest text-xs sm:text-sm hover:bg-gray-800"
                      >
                        CREATE PIN
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => setPinAction("update")}
                          className="w-full h-10 sm:h-11 bg-black text-white font-monument-regular tracking-widest text-xs sm:text-sm hover:bg-gray-800"
                        >
                          UPDATE PIN
                        </Button>
                        <Button
                          onClick={() => setPinAction("reset")}
                          variant="outline"
                          className="w-full h-10 sm:h-11 font-monument-regular tracking-widest text-xs sm:text-sm"
                        >
                          RESET PIN
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsPinModalOpen(false)
                        setPinAction("")
                        setPinMessage(null)
                      }}
                      className="w-full h-10 sm:h-11 font-monument-regular tracking-widest text-xs sm:text-sm"
                    >
                      CANCEL
                    </Button>
                  </div>
                </>
              ) : (
                // PIN Action Forms
                <>
                  <h3 className="text-lg sm:text-xl font-monument-regular text-gray-900 tracking-wider mb-2 uppercase">
                    {pinAction === "create" && "Create Wallet PIN"}
                    {pinAction === "update" && "Update Wallet PIN"}
                    {pinAction === "reset" && "Reset Wallet PIN"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-geist-normal tracking-wide mb-4 leading-relaxed">
                    {pinAction === "create" && "Create a 4-digit PIN to secure your wallet"}
                    {pinAction === "update" && "Enter your current PIN and new PIN"}
                    {pinAction === "reset" && "Reset your PIN with email verification"}
                  </p>

                  <div className="space-y-4">
                    {pinAction === "create" && (
                      <div>
                        <Label htmlFor="pin" className="text-xs sm:text-sm font-monument-regular tracking-wider text-gray-700 uppercase">
                          Enter New PIN
                        </Label>
                        <Input
                          id="pin"
                          type="password"
                          maxLength={8}
                          value={walletPin}
                          onChange={(e) => setWalletPin(e.target.value)}
                          placeholder="••••"
                          className="mt-1 h-10 sm:h-11 text-center text-base sm:text-lg tracking-widest font-monument-regular"
                        />
                      </div>
                    )}

                    {pinAction === "update" && (
                      <>
                        <div>
                          <Label
                            htmlFor="current-pin"
                            className="text-xs sm:text-sm font-monument-regular tracking-wider text-gray-700 uppercase"
                          >
                            Current PIN
                          </Label>
                          <Input
                            id="current-pin"
                            type="password"
                            maxLength={8}
                            value={currentPin}
                            onChange={(e) => setCurrentPin(e.target.value)}
                            placeholder="••••"
                            className="mt-1 h-10 sm:h-11 text-center text-base sm:text-lg tracking-widest font-monument-regular"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="new-pin"
                            className="text-xs sm:text-sm font-monument-regular tracking-wider text-gray-700 uppercase"
                          >
                            New PIN
                          </Label>
                          <Input
                            id="new-pin"
                            type="password"
                            maxLength={8}
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value)}
                            placeholder="••••"
                            className="mt-1 h-10 sm:h-11 text-center text-base sm:text-lg tracking-widest font-monument-regular"
                          />
                        </div>
                      </>
                    )}

                    {pinAction === "reset" && (
                      <>
                        <div>
                          <Label
                            htmlFor="reset-pin"
                            className="text-xs sm:text-sm font-monument-regular tracking-wider text-gray-700 uppercase"
                          >
                            New PIN
                          </Label>
                          <Input
                            id="reset-pin"
                            type="password"
                            maxLength={8}
                            value={walletPin}
                            onChange={(e) => setWalletPin(e.target.value)}
                            placeholder="••••"
                            className="mt-1 h-10 sm:h-11 text-center text-base sm:text-lg tracking-widest font-monument-regular"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-xs sm:text-sm font-monument-regular tracking-wider text-gray-700 uppercase"
                          >
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="mt-1 h-10 sm:h-11 text-xs sm:text-sm tracking-wide font-geist-normal"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="password"
                            className="text-xs sm:text-sm font-monument-regular tracking-wider text-gray-700 uppercase"
                          >
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            placeholder="Your account password"
                            className="mt-1 h-10 sm:h-11 text-xs sm:text-sm tracking-wide font-geist-normal"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {pinMessage && (
                    <div
                      className={cn(
                        "p-3 rounded-lg text-xs sm:text-sm font-geist-normal tracking-wide mt-4",
                        pinMessage.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200",
                      )}
                    >
                      {pinMessage.text}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPinAction("")
                        setWalletPin("")
                        setCurrentPin("")
                        setNewPin("")
                        setUserEmail("")
                        setUserPassword("")
                        setPinMessage(null)
                      }}
                      className="flex-1 h-10 sm:h-11 font-monument-regular tracking-widest text-xs sm:text-sm"
                    >
                      BACK
                    </Button>
                    <Button
                      onClick={() => {
                        if (pinAction === "create") handleCreatePin()
                        else if (pinAction === "update") handleUpdatePin()
                        else if (pinAction === "reset") handleResetPin()
                      }}
                      disabled={
                        isSubmittingPin ||
                        (pinAction === "create" && (walletPin.length < 4 || walletPin.length > 8)) ||
                        (pinAction === "update" &&
                          (currentPin.length < 4 || newPin.length < 4 || currentPin.length > 8 || newPin.length > 8)) ||
                        (pinAction === "reset" && (walletPin.length < 4 || walletPin.length > 8 || !userEmail))
                      }
                      className="flex-1 h-10 sm:h-11 bg-black text-white font-monument-regular tracking-widest text-xs sm:text-sm hover:bg-gray-800"
                    >
                      {isSubmittingPin
                        ? "PROCESSING..."
                        : pinAction === "create"
                          ? "CREATE PIN"
                          : pinAction === "update"
                            ? "UPDATE PIN"
                            : "RESET PIN"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Balance Check Modal */}
        {isBalanceModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm shadow-xl">
              <h3 className="text-lg sm:text-xl font-monument-regular text-gray-900 tracking-wider mb-2 uppercase">
                Wallet Balance
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-geist-normal tracking-wide mb-4 leading-relaxed">
                View your current wallet balances
              </p>

              {balanceError && (
                <div className="p-3 rounded-lg text-xs sm:text-sm font-geist-normal tracking-wide mb-4 bg-red-50 text-red-700 border border-red-200">
                  {balanceError}
                </div>
              )}

              {walletBalance && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-green-700 font-monument-regular tracking-wider uppercase">Current Balances</p>
                      <p className="text-sm sm:text-base font-monument-regular text-green-800 tracking-wider">{walletBalance}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleCheckWalletBalance}
                  disabled={isCheckingBalance}
                  className="flex-1 h-10 sm:h-11 font-monument-regular tracking-widest text-xs sm:text-sm"
                >
                  {isCheckingBalance ? "CHECKING..." : "CHECK BALANCE"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsBalanceModalOpen(false)
                    setBalanceError(null)
                    setWalletBalance(null)
                  }}
                  className="flex-1 h-10 sm:h-11 font-monument-regular tracking-widest text-xs sm:text-sm"
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
