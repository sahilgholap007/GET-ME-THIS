"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../utils/axiosInstance"
import { toast, ToastContainer } from "react-toastify"
import { MapPin, Plus, Star, Check, Edit3, Trash2, X } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"

const Addressbook = () => {
  const [addresses, setAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/api/v1/users/address-book/")
      setAddresses(response.data)
    } catch (error) {
      console.error("Error fetching addresses:", error)
      toast.error("Failed to fetch addresses")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
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
    setErrors({})
    setEditingId(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      if (editingId) {
        // Update existing address
        const response = await axiosInstance.put(`/api/v1/users/address-book/${editingId}/`, formData)
        toast.success("Address updated successfully!")
      } else {
        // Create new address
        const response = await axiosInstance.post("/api/v1/users/address-book/", formData)
        toast.success("Address added successfully!")
      }

      await fetchAddresses()
      resetForm()
    } catch (error) {
      console.error("Error saving address:", error)
      if (error.response && error.response.data) {
        setErrors(error.response.data)
        toast.error("Please check the form for errors.")
      } else {
        toast.error("Failed to save address. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (address) => {
    setFormData({
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
    setErrors({})
  }

  const handleDelete = async (id) => {
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

  const handleSetDefault = async (id) => {
    try {
      // Update the address to set it as default
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

  const formFields = [
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

  if (isLoading) {
    return (
      <div className="bg-gray-100 py-16 sm:py-24 font-monument-ultralight min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-8 space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="bg-white rounded-lg p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 py-16 sm:py-24 font-monument-ultralight min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 mr-3 text-gray-700" />
            <h1 className="font-monument-regular text-3xl text-gray-800 tracking-wider">My Addresses</h1>
          </div>
          <p className="text-sm text-gray-500 tracking-wider">Manage your shipping addresses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Edit Address Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Plus className="h-5 w-5 mr-2 text-gray-700" />
                <h2 className="font-monument-regular text-xl text-gray-800 tracking-wider">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h2>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={16} />
                  <span className="text-xs tracking-wider">CANCEL</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                  {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                </div>
              ))}

              {/* Default Address Checkbox */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="sr-only"
                    id="is_default"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded transition-all duration-200 cursor-pointer ${formData.is_default ? "bg-black border-black" : "border-gray-300 bg-white"
                      }`}
                    onClick={() =>
                      handleChange({
                        target: { name: "is_default", type: "checkbox", checked: !formData.is_default },
                      })
                    }
                  >
                    {formData.is_default && <Check className="h-3 w-3 text-white m-0.5" />}
                  </div>
                </div>
                <label
                  htmlFor="is_default"
                  className="text-sm font-monument-ultralight tracking-wider text-gray-700 cursor-pointer"
                >
                  Set as default address
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-black text-white font-monument-regular tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                {isSubmitting ? "SAVING..." : editingId ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
              </button>
            </form>
          </div>

          {/* Address List */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="font-monument-regular text-lg text-gray-800 tracking-wider mb-6">
              Your Addresses ({addresses.length})
            </h3>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-monument-ultralight tracking-wider">No addresses saved yet</p>
                <p className="text-xs text-gray-400 tracking-wider mt-1">Add your first address using the form</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${address.is_default ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {address.is_default && (
                            <div className="flex items-center mr-3">
                              <Star className="h-4 w-4 text-black fill-current" />
                              <span className="text-xs font-monument-regular tracking-wider text-black ml-1">
                                DEFAULT
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="font-monument-ultralight tracking-wider text-sm text-gray-800">
                          <p className="font-monument-regular text-base mb-1">{address.full_name}</p>
                          <p className="text-gray-600 text-xs mb-2">{address.phone_number}</p>
                          <p>{address.address_line1}</p>
                          {address.address_line2 && <p>{address.address_line2}</p>}
                          <p>
                            {address.city}, {address.state_province_region} {address.zip_postal_code}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleEdit(address)}
                          className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Edit3 size={12} />
                          <span>EDIT</span>
                        </button>
                        {!address.is_default && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                          >
                            <Star size={12} />
                            <span>DEFAULT</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="flex items-center space-x-1 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                        >
                          <Trash2 size={12} />
                          <span>DELETE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Addressbook
