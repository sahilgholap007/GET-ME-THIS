"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, Package, Truck, Globe, Clock, Shield, MapPin } from "lucide-react"
import { toast } from "react-toastify"
import axiosInstance from "../../utils/axiosInstance"

const CourierPartnersPage = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    from_country: "",
    to_country: "",
    price_per_kg: "",
    estimated_delivery_days: "",
    service_type: "",
    insurance_available: false,
    tracking_available: false,
    volumetric_divisor: "",
    description: "",
    website: "",
    is_active: true,
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Load courier partners
  const loadPartners = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/api/v1/courier/admin/partners/")
      setPartners(response.data)
    } catch (error) {
      console.error("Error loading courier partners:", error)
      toast.error("Failed to load courier partners")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPartners()
  }, [])

  // Filter partners
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.from_country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.to_country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.service_type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && partner.is_active) ||
      (filterActive === "inactive" && !partner.is_active)

    return matchesSearch && matchesFilter
  })

  // Group partners by route
  const groupedPartners = filteredPartners.reduce((groups, partner) => {
    const route = `${partner.from_country} to ${partner.to_country}`
    if (!groups[route]) {
      groups[route] = []
    }
    groups[route].push(partner)
    return groups
  }, {})

  const routes = Object.keys(groupedPartners).sort()

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      from_country: "",
      to_country: "",
      price_per_kg: "",
      estimated_delivery_days: "",
      service_type: "",
      insurance_available: false,
      tracking_available: false,
      volumetric_divisor: "",
      description: "",
      website: "",
      is_active: true,
    })
    setFormErrors({})
  }

  // Handle create
  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormErrors({})

    try {
      const response = await axiosInstance.post("/api/v1/courier/admin/partners/", formData)
      setPartners([...partners, response.data])
      setShowCreateModal(false)
      resetForm()
      toast.success("Courier partner created successfully!")
    } catch (error) {
      console.error("Error creating courier partner:", error)
      if (error.response?.data) {
        setFormErrors(error.response.data)
      } else {
        toast.error("Failed to create courier partner")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormErrors({})

    try {
      const response = await axiosInstance.patch(`/api/v1/courier/admin/partners/${selectedPartner.id}/`, formData)
      setPartners(partners.map((p) => (p.id === selectedPartner.id ? response.data : p)))
      setShowEditModal(false)
      setSelectedPartner(null)
      resetForm()
      toast.success("Courier partner updated successfully!")
    } catch (error) {
      console.error("Error updating courier partner:", error)
      if (error.response?.data) {
        setFormErrors(error.response.data)
      } else {
        toast.error("Failed to update courier partner")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (partner) => {
    if (!window.confirm(`Are you sure you want to delete ${partner.name}?`)) return

    try {
      await axiosInstance.delete(`/api/v1/courier/admin/partners/${partner.id}/`)
      setPartners(partners.filter((p) => p.id !== partner.id))
      toast.success("Courier partner deleted successfully!")
    } catch (error) {
      console.error("Error deleting courier partner:", error)
      toast.error("Failed to delete courier partner")
    }
  }

  // Handle view
  const handleView = async (partner) => {
    try {
      const response = await axiosInstance.get(`/api/v1/courier/admin/partners/${partner.id}/`)
      setSelectedPartner(response.data)
      setShowViewModal(true)
    } catch (error) {
      console.error("Error fetching partner details:", error)
      toast.error("Failed to load partner details")
    }
  }

  // Handle edit
  const handleEdit = (partner) => {
    setSelectedPartner(partner)
    setFormData({
      name: partner.name,
      logo: partner.logo,
      from_country: partner.from_country,
      to_country: partner.to_country,
      price_per_kg: partner.price_per_kg,
      estimated_delivery_days: partner.estimated_delivery_days,
      service_type: partner.service_type,
      insurance_available: partner.insurance_available,
      tracking_available: partner.tracking_available,
      volumetric_divisor: partner.volumetric_divisor,
      description: partner.description,
      website: partner.website,
      is_active: partner.is_active,
    })
    setShowEditModal(true)
  }

  // Service type options
  const serviceTypes = ["Express", "Standard", "Economy", "Overnight", "Ground", "Air", "Sea"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courier partners...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Truck className="w-8 h-8 text-blue-600 mr-3" />
                Courier Partners
              </h1>
              <p className="mt-1 text-sm text-gray-500">Manage shipping and courier partner integrations</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowCreateModal(true)
              }}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search partners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterActive("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterActive === "all"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                All ({partners.length})
              </button>
              <button
                onClick={() => setFilterActive("active")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterActive === "active"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Active ({partners.filter((p) => p.is_active).length})
              </button>
              <button
                onClick={() => setFilterActive("inactive")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterActive === "inactive"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Inactive ({partners.filter((p) => !p.is_active).length})
              </button>
            </div>
          </div>
        </div>

        {/* Route-based Partners Display */}
        {routes.length > 0 ? (
          <div className="space-y-8">
            {routes.map((route) => (
              <div key={route} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                      {route}
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {groupedPartners[route].length} {groupedPartners[route].length === 1 ? "Partner" : "Partners"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedPartners[route].map((partner) => (
                      <div
                        key={partner.id}
                        className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              {partner.logo ? (
                                <img
                                  src={partner.logo || "/placeholder.svg"}
                                  alt={partner.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div className="ml-3">
                                <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                                <p className="text-sm text-gray-500">{partner.service_type}</p>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                partner.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {partner.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {partner.estimated_delivery_days} days delivery
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Package className="w-4 h-4 mr-2" />${partner.price_per_kg}/kg
                            </div>
                          </div>

                          <div className="mt-4 flex items-center space-x-2">
                            {partner.tracking_available && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Globe className="w-3 h-3 mr-1" />
                                Tracking
                              </span>
                            )}
                            {partner.insurance_available && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Insurance
                              </span>
                            )}
                          </div>

                          <div className="mt-6 flex justify-end space-x-2">
                            <button
                              onClick={() => handleView(partner)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(partner)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="Edit Partner"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(partner)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete Partner"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courier partners found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterActive !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first courier partner."}
            </p>
            {!searchTerm && filterActive === "all" && (
              <button
                onClick={() => {
                  resetForm()
                  setShowCreateModal(true)
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Partner
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 overflow-y-auto h-full w-full z-50"
          style={{
            backdropFilter: "blur(8px) saturate(180%)",
            WebkitBackdropFilter: "blur(8px) saturate(180%)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Courier Partner</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.name ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter partner name"
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Country *</label>
                    <input
                      type="text"
                      value={formData.from_country}
                      onChange={(e) => setFormData({ ...formData, from_country: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.from_country ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="USA"
                    />
                    {formErrors.from_country && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.from_country[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Country *</label>
                    <input
                      type="text"
                      value={formData.to_country}
                      onChange={(e) => setFormData({ ...formData, to_country: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.to_country ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="UK"
                    />
                    {formErrors.to_country && <p className="mt-1 text-sm text-red-600">{formErrors.to_country[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per KG ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price_per_kg}
                      onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.price_per_kg ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="18.00"
                    />
                    {formErrors.price_per_kg && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.price_per_kg[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Days *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.estimated_delivery_days}
                      onChange={(e) => setFormData({ ...formData, estimated_delivery_days: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.estimated_delivery_days ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="2"
                    />
                    {formErrors.estimated_delivery_days && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.estimated_delivery_days[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                    <select
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.service_type ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select service type</option>
                      {serviceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {formErrors.service_type && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.service_type[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volumetric Divisor</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.volumetric_divisor}
                      onChange={(e) => setFormData({ ...formData, volumetric_divisor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://www.partner.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter partner description..."
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.insurance_available}
                      onChange={(e) => setFormData({ ...formData, insurance_available: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Insurance Available</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tracking_available}
                      onChange={(e) => setFormData({ ...formData, tracking_available: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tracking Available</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Partner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPartner && (
        <div
          className="fixed inset-0 overflow-y-auto h-full w-full z-50"
          style={{
            backdropFilter: "blur(8px) saturate(180%)",
            WebkitBackdropFilter: "blur(8px) saturate(180%)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Courier Partner</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.name ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter partner name"
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Country *</label>
                    <input
                      type="text"
                      value={formData.from_country}
                      onChange={(e) => setFormData({ ...formData, from_country: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.from_country ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="USA"
                    />
                    {formErrors.from_country && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.from_country[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Country *</label>
                    <input
                      type="text"
                      value={formData.to_country}
                      onChange={(e) => setFormData({ ...formData, to_country: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.to_country ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="UK"
                    />
                    {formErrors.to_country && <p className="mt-1 text-sm text-red-600">{formErrors.to_country[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per KG ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price_per_kg}
                      onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.price_per_kg ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="18.00"
                    />
                    {formErrors.price_per_kg && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.price_per_kg[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Days *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.estimated_delivery_days}
                      onChange={(e) => setFormData({ ...formData, estimated_delivery_days: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.estimated_delivery_days ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="2"
                    />
                    {formErrors.estimated_delivery_days && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.estimated_delivery_days[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                    <select
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.service_type ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select service type</option>
                      {serviceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {formErrors.service_type && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.service_type[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volumetric Divisor</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.volumetric_divisor}
                      onChange={(e) => setFormData({ ...formData, volumetric_divisor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://www.partner.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter partner description..."
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.insurance_available}
                      onChange={(e) => setFormData({ ...formData, insurance_available: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Insurance Available</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tracking_available}
                      onChange={(e) => setFormData({ ...formData, tracking_available: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tracking Available</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedPartner(null)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? "Updating..." : "Update Partner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPartner && (
        <div
          className="fixed inset-0 overflow-y-auto h-full w-full z-50"
          style={{
            backdropFilter: "blur(8px) saturate(180%)",
            WebkitBackdropFilter: "blur(8px) saturate(180%)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Partner Details</h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedPartner.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedPartner.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  {selectedPartner.logo ? (
                    <img
                      src={selectedPartner.logo || "/placeholder.svg"}
                      alt={selectedPartner.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-gray-900">{selectedPartner.name}</h4>
                    <p className="text-gray-500">{selectedPartner.service_type}</p>
                    {selectedPartner.website && (
                      <a
                        href={selectedPartner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Shipping Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Route:</span>
                        <span>
                          {selectedPartner.from_country} → {selectedPartner.to_country}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price per KG:</span>
                        <span>${selectedPartner.price_per_kg}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Delivery Time:</span>
                        <span>{selectedPartner.estimated_delivery_days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Volumetric Divisor:</span>
                        <span>{selectedPartner.volumetric_divisor || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Services</h5>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Shield
                          className={`w-4 h-4 mr-2 ${selectedPartner.insurance_available ? "text-green-500" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-sm ${selectedPartner.insurance_available ? "text-green-700" : "text-gray-500"}`}
                        >
                          Insurance {selectedPartner.insurance_available ? "Available" : "Not Available"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Globe
                          className={`w-4 h-4 mr-2 ${selectedPartner.tracking_available ? "text-blue-500" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-sm ${selectedPartner.tracking_available ? "text-blue-700" : "text-gray-500"}`}
                        >
                          Tracking {selectedPartner.tracking_available ? "Available" : "Not Available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPartner.description && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                    <p className="text-gray-600 text-sm">{selectedPartner.description}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Created: {new Date(selectedPartner.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setSelectedPartner(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    handleEdit(selectedPartner)
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Edit Partner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourierPartnersPage
