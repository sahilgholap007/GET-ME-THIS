"use client"

import { useState } from "react"
import axiosInstance from "../../utils/axiosInstance"
import { Package, DollarSign, Calculator, Truck, RefreshCw } from "lucide-react"
import { toast } from "react-toastify"

const ShippingCalculator = () => {
    const [calculatorData, setCalculatorData] = useState({
        weight: "",
        length: "",
        width: "",
        height: "",
        destination_country: "US",
        insurance: false
    })

    const [rates, setRates] = useState([])
    const [isCalculating, setIsCalculating] = useState(false)
    const [availableCarriers, setAvailableCarriers] = useState([])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setCalculatorData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const calculateRates = async () => {
        if (!calculatorData.weight || !calculatorData.length || !calculatorData.width || !calculatorData.height) {
            toast.error("Please fill in all package dimensions and weight")
            return
        }

        setIsCalculating(true)
        try {
            // Try the calculate-rates endpoint first, fall back to cost-calculator if needed
            const response = await axiosInstance.post("/api/v1/shipping/calculate-rates/", {
                weight: parseFloat(calculatorData.weight),
                length: parseFloat(calculatorData.length),
                width: parseFloat(calculatorData.width),
                height: parseFloat(calculatorData.height),
                destination_country: calculatorData.destination_country,
                insurance: calculatorData.insurance
            })

            setRates(response.data.rates || [])
            setAvailableCarriers(response.data.carriers || [])

            if (response.data.rates?.length === 0) {
                toast.info("No shipping rates available for these specifications")
            }
        } catch (error) {
            console.error("Error calculating rates:", error)

            // Try alternative cost-calculator endpoint as fallback
            try {
                const fallbackResponse = await axiosInstance.post("/api/v1/shipping/cost-calculator/", {
                    weight: parseFloat(calculatorData.weight),
                    dimensions: {
                        length: parseFloat(calculatorData.length),
                        width: parseFloat(calculatorData.width),
                        height: parseFloat(calculatorData.height)
                    },
                    destination_country: calculatorData.destination_country,
                    insurance: calculatorData.insurance
                })

                setRates(fallbackResponse.data.rates || [])
                setAvailableCarriers(fallbackResponse.data.carriers || [])

                if (fallbackResponse.data.rates?.length === 0) {
                    toast.info("No shipping rates available for these specifications")
                }
            } catch (fallbackError) {
                console.error("Error with fallback cost calculator:", fallbackError)
                toast.error("Failed to calculate shipping rates")
                setRates([])
            }
        } finally {
            setIsCalculating(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    const calculateDimensionalWeight = (length, width, height) => {
        // Standard dimensional weight factor (varies by carrier, using 139 for calculation)
        return (length * width * height) / 139
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-monument-regular text-gray-800 tracking-[0.1em] uppercase">
                        Shipping Calculator
                    </h1>
                    <p className="text-gray-500 text-sm tracking-wider uppercase mt-1">
                        Calculate shipping costs for your packages
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calculator Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-xl rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <Calculator className="h-5 w-5 mr-2 text-gray-700" />
                                <h2 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                                    Package Details
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {/* Weight */}
                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={calculatorData.weight}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                </div>

                                {/* Dimensions */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                            Length (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name="length"
                                            value={calculatorData.length}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                            Width (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name="width"
                                            value={calculatorData.width}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                            Height (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name="height"
                                            value={calculatorData.height}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Destination Country */}
                                <div>
                                    <label className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2">
                                        Destination Country
                                    </label>
                                    <select
                                        name="destination_country"
                                        value={calculatorData.destination_country}
                                        onChange={handleInputChange}
                                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg font-monument-ultralight tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    >
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="AU">Australia</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                        <option value="JP">Japan</option>
                                        <option value="CN">China</option>
                                    </select>
                                </div>

                                {/* Insurance */}
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        name="insurance"
                                        checked={calculatorData.insurance}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                    />
                                    <label className="text-sm font-monument-regular text-gray-700 tracking-wider">
                                        Add shipping insurance
                                    </label>
                                </div>

                                {/* Calculate Button */}
                                <button
                                    onClick={calculateRates}
                                    disabled={isCalculating}
                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-sm hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
                                >
                                    {isCalculating ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Calculator className="h-4 w-4" />
                                    )}
                                    <span>{isCalculating ? "Calculating..." : "Calculate Rates"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow-xl rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <DollarSign className="h-5 w-5 mr-2 text-gray-700" />
                                <h2 className="text-xl font-monument-regular text-gray-800 tracking-wider uppercase">
                                    Shipping Rates
                                </h2>
                            </div>

                            {rates.length > 0 ? (
                                <div className="space-y-4">
                                    {rates.map((rate, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <Truck className="h-4 w-4 text-gray-600" />
                                                    <span className="text-sm font-monument-regular text-gray-800">
                                                        {rate.carrier_name}
                                                    </span>
                                                </div>
                                                <span className="text-lg font-monument-regular text-gray-800">
                                                    {formatCurrency(rate.total_cost)}
                                                </span>
                                            </div>

                                            <div className="text-xs font-monument-ultralight text-gray-600 space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Base Rate:</span>
                                                    <span>{formatCurrency(rate.base_rate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Weight Fee:</span>
                                                    <span>{formatCurrency(rate.weight_cost)}</span>
                                                </div>
                                                {rate.insurance_cost > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Insurance:</span>
                                                        <span>{formatCurrency(rate.insurance_cost)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span>Weight Range:</span>
                                                    <span>{rate.weight_from_kg}kg - {rate.weight_to_kg}kg</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-sm font-monument-ultralight text-gray-500 tracking-wider">
                                        Enter package details to calculate shipping rates
                                    </p>
                                </div>
                            )}

                            {/* Dimensional Weight Info */}
                            {calculatorData.length && calculatorData.width && calculatorData.height && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="text-xs font-monument-regular text-blue-800 tracking-wider uppercase mb-2">
                                        Dimensional Weight
                                    </h3>
                                    <p className="text-xs font-monument-ultralight text-blue-700 tracking-wider">
                                        {calculateDimensionalWeight(
                                            parseFloat(calculatorData.length),
                                            parseFloat(calculatorData.width),
                                            parseFloat(calculatorData.height)
                                        ).toFixed(2)} kg
                                    </p>
                                    <p className="text-xs font-monument-ultralight text-blue-600 tracking-wider mt-1">
                                        Carriers may use dimensional weight if it exceeds actual weight
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShippingCalculator