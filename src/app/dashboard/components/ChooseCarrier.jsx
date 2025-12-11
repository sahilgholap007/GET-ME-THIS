"use client"

import { useState } from "react"
import { ChevronRight, Info, Check, X, Loader2 } from 'lucide-react'
import Image from "next/image"
import axiosInstance from "../../utils/axiosInstance"
import { toast } from "react-toastify"

// NOTE: Assumes shadcn components are available
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SG", name: "Singapore" },
]

export default function ChooseCarrier() {
  const [origin, setOrigin] = useState("United States")
  const [destination, setDestination] = useState("Canada")
  const [weight, setWeight] = useState("2.5")
  const [dimensions, setDimensions] = useState({
    length: "30.0",
    width: "20.0",
    height: "10.0",
  })
  const [declaredValue, setDeclaredValue] = useState("100.0")

  const [carriers, setCarriers] = useState([])
  const [expandedCarrier, setExpandedCarrier] = useState(null)
  const [selectedCarriers, setSelectedCarriers] = useState([])
  const [showCarriers, setShowCarriers] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGetCarriers = async () => {
    // Validation
    if (!origin || !destination) {
      toast.error("Please select both origin and destination countries")
      return
    }

    if (!weight || Number.parseFloat(weight) <= 0) {
      toast.error("Please enter a valid weight")
      return
    }

    if (
      !dimensions.length ||
      !dimensions.width ||
      !dimensions.height ||
      Number.parseFloat(dimensions.length) <= 0 ||
      Number.parseFloat(dimensions.width) <= 0 ||
      Number.parseFloat(dimensions.height) <= 0
    ) {
      toast.error("Please enter valid dimensions")
      return
    }

    if (!declaredValue || Number.parseFloat(declaredValue) <= 0) {
      toast.error("Please enter a valid declared value")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const requestBody = {
        from_address: origin,
        to_address: destination,
        weight: Number.parseFloat(weight),
        dimensions: {
          length: Number.parseFloat(dimensions.length),
          width: Number.parseFloat(dimensions.width),
          height: Number.parseFloat(dimensions.height),
        },
        declared_value: Number.parseFloat(declaredValue),
      }

      const response = await axiosInstance.get("api/v1/courier/partners/", requestBody)

      const apiCarriers = response.data
      setCarriers(apiCarriers)
      setShowCarriers(true)
      setSelectedCarriers([])

      toast.success(`Found ${apiCarriers.length} carrier options`)
    } catch (err) {
      let errorMessage = "Failed to fetch carrier rates. Please try again."

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Error fetching carriers:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleCarrierExpansion = (carrierId) => setExpandedCarrier(expandedCarrier === carrierId ? null : carrierId)

  const handleCarrierSelection = (carrierId, checked) => {
    if (checked) {
      if (selectedCarriers.length < 3) setSelectedCarriers([...selectedCarriers, carrierId])
    } else {
      setSelectedCarriers(selectedCarriers.filter((id) => id !== carrierId))
    }
  }

  // Combined list of features for the new accordion design
  const comparisonFeatures = [
    "Price",
    "Transit Time",
    "Door-to-door delivery",
    "Real-time tracking",
    "Insurance included",
    "Express delivery",
  ]

  return (
    <div className="bg-gray-100 py-16 sm:py-24 lg:py-32 font-geist-normal">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-monument-regular text-center text-3xl sm:text-4xl lg:text-5xl text-gray-700 tracking-[0.2em] uppercase mb-8 sm:mb-12 leading-tight">
          Choose Carrier & Services
        </h1>

        {/* --- Top Selection Form --- */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-monument-regular tracking-widest text-gray-700 mb-2 uppercase">
                From Country
              </label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger className="w-full h-12 sm:h-14 bg-gray-50 font-geist-normal tracking-wide text-sm sm:text-base">
                  <SelectValue placeholder="Select origin country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-monument-regular tracking-widest text-gray-700 mb-2 uppercase">
                To Country
              </label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="w-full h-12 sm:h-14 bg-gray-50 font-geist-normal tracking-wide text-sm sm:text-base">
                  <SelectValue placeholder="Select destination country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-monument-regular tracking-widest text-gray-700 mb-2 uppercase">
                Weight (KG)
              </label>
              <Input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full h-12 sm:h-14 bg-gray-50 font-geist-normal tracking-wide text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-monument-regular tracking-widest text-gray-700 mb-2 uppercase">
                Length (CM)
              </label>
              <Input
                type="number"
                step="0.1"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                className="w-full h-12 sm:h-14 bg-gray-50 font-geist-normal tracking-wide text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-monument-regular tracking-widest text-gray-700 mb-2 uppercase">
                Width (CM)
              </label>
              <Input
                type="number"
                step="0.1"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                className="w-full h-12 sm:h-14 bg-gray-50 font-geist-normal tracking-wide text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-monument-regular tracking-widest text-gray-700 mb-2 uppercase">
                Height (CM)
              </label>
              <Input
                type="number"
                step="0.1"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                className="w-full h-12 sm:h-14 bg-gray-50 font-geist-normal tracking-wide text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-monument-regular tracking-widest text-gray-700 mb-2 uppercase">
                Value ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(e.target.value)}
                className="w-full h-12 sm:h-14 bg-gray-50 font-geist-normal tracking-wide text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleGetCarriers}
              disabled={loading}
              className="w-full md:w-auto h-12 sm:h-14 bg-black text-white font-monument-regular tracking-widest text-sm sm:text-base hover:bg-gray-800 transition-colors px-8 sm:px-12 uppercase"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Rates...
                </>
              ) : (
                "Get Carriers"
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-6 text-gray-500 text-xs sm:text-sm tracking-wide font-geist-normal">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>Why dimensions matter? Learn more about "Volumetric" weight</span>
          </div>

          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700 font-geist-normal text-sm tracking-wide">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* --- Carriers List --- */}
        {showCarriers && carriers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCompareModal(true)}
                disabled={selectedCarriers.length === 0}
                className="font-monument-regular tracking-widest border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:bg-transparent disabled:text-gray-400 text-xs sm:text-sm px-4 sm:px-6"
              >
                COMPARE ({selectedCarriers.length})
              </Button>
              <span className="text-xs sm:text-sm text-gray-600 tracking-wide font-geist-normal">You can select up to 3 services</span>
            </div>
            <div className="divide-y divide-gray-200">
              {carriers.map((carrier, index) => (
                <div key={index}>
                  <div
                    className="flex items-center p-4 sm:p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleCarrierExpansion(index)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <Checkbox
                        checked={selectedCarriers.includes(index)}
                        onCheckedChange={(checked) => handleCarrierSelection(index, checked)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={!selectedCarriers.includes(index) && selectedCarriers.length >= 3}
                      />
                      <ChevronRight
                        className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform ${expandedCarrier === index ? "rotate-90" : ""}`}
                      />
                      <Image
                        src={carrier.logo || "/placeholder.svg"}
                        alt={`${carrier.name} logo`}
                        width={80}
                        height={24}
                        className="object-contain"
                      />
                      <span className="font-monument-regular text-gray-800 tracking-wider text-sm sm:text-base">
                        {carrier.name} {carrier.service_type}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm text-gray-500 tracking-wide font-geist-normal">
                        Transit time {carrier.estimated_delivery_days} days
                      </span>
                    </div>
                  </div>
                  {expandedCarrier === index && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 bg-gray-50 border-t">
                      <Card className="p-4 sm:p-6 mt-4 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                          <div>
                            <h4 className="font-monument-regular text-gray-800 mb-3 tracking-widest text-sm sm:text-base uppercase">
                              Service Details
                            </h4>
                            <p className="text-gray-600 text-xs sm:text-sm mb-4 tracking-wide font-geist-normal leading-relaxed">
                              {carrier.description || `${carrier.service_type} shipping service by ${carrier.name}`}
                            </p>
                            <ul className="space-y-2">
                              {carrier.badges?.map((badge, index) => (
                                <li key={index} className="text-xs sm:text-sm text-gray-700 flex items-center gap-3 tracking-wide font-geist-normal">
                                  <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0"></div>
                                  {badge}
                                </li>
                              ))}
                              {carrier.insurance_available && (
                                <li className="text-xs sm:text-sm text-gray-700 flex items-center gap-3 tracking-wide font-geist-normal">
                                  <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0"></div>
                                  Insurance Available
                                </li>
                              )}
                              {carrier.tracking_available && (
                                <li className="text-xs sm:text-sm text-gray-700 flex items-center gap-3 tracking-wide font-geist-normal">
                                  <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0"></div>
                                  Tracking Available
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="text-left md:text-right">
                            <h4 className="font-monument-regular text-gray-800 mb-2 tracking-widest text-sm sm:text-base uppercase">Pricing</h4>
                            <div className="text-2xl sm:text-3xl font-monument-regular text-gray-900 mb-2">
                              ${carrier.total_price}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 tracking-wide font-geist-normal mb-4">Estimated shipping cost</p>
                            <Button className="mt-4 w-full md:w-auto bg-black text-white font-monument-regular tracking-widest text-xs sm:text-sm py-3 px-6 sm:px-10 hover:bg-gray-800 transition-colors uppercase">
                              Select
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showCarriers && carriers.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <p className="text-gray-600 tracking-wide font-geist-normal text-sm sm:text-base">
              No carriers found for the specified route and package details.
            </p>
          </div>
        )}

        {/* --- Compare Dialog with NEW Accordion Design --- */}
        <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
          <DialogContent className="w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto bg-white font-geist-normal p-4 sm:p-6 lg:p-8">
            <DialogHeader>
              <DialogTitle className="font-monument-regular text-center text-xl sm:text-2xl lg:text-3xl text-gray-700 tracking-[0.2em] uppercase">
                Compare Services
              </DialogTitle>
            </DialogHeader>

            {selectedCarriers.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <Accordion type="single" collapsible className="w-full">
                  {comparisonFeatures.map((featureName) => (
                    <AccordionItem value={featureName} key={featureName}>
                      <AccordionTrigger className="font-monument-regular text-sm sm:text-base tracking-wider text-gray-800 uppercase">
                        {featureName}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {selectedCarriers.map((index) => {
                            const carrier = carriers[index]
                            let featureValue

                            if (featureName === "Price") {
                              featureValue = (
                                <span className="font-monument-regular text-base sm:text-lg text-gray-900">
                                  ${carrier.total_price}
                                </span>
                              )
                            } else if (featureName === "Transit Time") {
                              featureValue = (
                                <Badge className="bg-gray-200 text-gray-800 tracking-wide font-geist-normal text-xs sm:text-sm">
                                  {carrier.estimated_delivery_days} days
                                </Badge>
                              )
                            } else {
                              let hasFeature = false
                              if (featureName === "Insurance included") {
                                hasFeature = carrier.insurance_available
                              } else if (featureName === "Real-time tracking") {
                                hasFeature = carrier.tracking_available
                              } else if (featureName === "Express delivery") {
                                hasFeature = carrier.estimated_delivery_days <= 3
                              } else {
                                hasFeature = carrier.badges?.some((badge) =>
                                  badge.toLowerCase().includes(featureName.split(" ")[0].toLowerCase()),
                                )
                              }

                              featureValue = (
                                <span
                                  className={`inline-flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full ${hasFeature ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-500"}`}
                                >
                                  {hasFeature ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <X className="h-3 w-3 sm:h-4 sm:w-4" />}
                                </span>
                              )
                            }

                            return (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={carrier.logo || "/placeholder.svg"}
                                    alt={carrier.name}
                                    width={60}
                                    height={20}
                                    className="object-contain"
                                  />
                                  <span className="text-gray-600 tracking-wide font-geist-normal text-xs sm:text-sm">
                                    {carrier.name} {carrier.service_type}
                                  </span>
                                </div>
                                {featureValue}
                              </div>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            <DialogFooter className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCompareModal(false)}
                className="font-monument-regular tracking-widest text-xs sm:text-sm px-4 sm:px-6"
              >
                CLOSE
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
