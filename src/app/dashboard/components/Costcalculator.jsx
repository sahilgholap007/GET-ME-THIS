"use client";

import React, { useState } from "react";
import axios from "axios";
import { PiRulerDuotone, PiScalesDuotone } from "react-icons/pi";

const countries = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "UAE", name: "United Arab Emirates" },
];

// Reusable Input Field Component for consistency
const ThemedInput = ({ value, onChange, placeholder, type = "text", icon: Icon }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-12 sm:h-14 bg-white font-geist-normal tracking-wide text-sm sm:text-base pl-10 sm:pl-12 pr-4 rounded-lg shadow-md focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all"
    />
    {Icon && <Icon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />}
  </div>
);

// Reusable Select Field Component
const ThemedSelect = ({ value, onChange, placeholder, children }) => (
    <select
      value={value}
      onChange={onChange}
      className={`w-full h-12 sm:h-14 bg-white font-geist-normal tracking-wide text-sm sm:text-base pl-4 pr-4 rounded-lg shadow-md focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all ${!value ? 'text-gray-400' : 'text-gray-800'}`}
    >
      <option value="" disabled>{placeholder}</option>
      {children}
    </select>
);

export default function Costcalculator() {
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [shipperZip, setShipperZip] = useState("");
  const [receiverZip, setReceiverZip] = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");

  const [shippingPrice, setShippingPrice] = useState(null);
  const [error, setError] = useState("");

  const calculate = async () => {
    if (!length || !breadth || !height || !weight || !shipperZip || !receiverZip || !fromCountry || !toCountry) {
      setError("Please fill all fields.");
      setShippingPrice(null);
      return;
    }
    setError("");
    setShippingPrice(null);
    try {
      const res = await axios.post(
        "https://acetech2024.pythonanywhere.com/api/auth/shipping/price-by-weight/",
        {
          length, width: breadth, height, final_weight: weight,
          shipper_zip: shipperZip, receiver_zip: receiverZip,
          from_country: fromCountry, to_country: toCountry
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" } }
      );
      setShippingPrice(res.data.shipping_price);
    } catch (err) {
      console.error("❌", err);
      setError(err?.response?.data?.detail || "Failed to fetch shipping price.");
    }
  };

  return (
    <div className="bg-gray-100 py-16 sm:py-24 lg:py-32 font-geist-normal">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-monument-regular text-3xl sm:text-4xl lg:text-5xl text-gray-700 tracking-[0.2em] uppercase mb-12 sm:mb-16 leading-tight">
          Cost Calculator
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <ThemedSelect value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} placeholder="FROM COUNTRY">
            {countries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
          </ThemedSelect>
          
          <ThemedSelect value={toCountry} onChange={(e) => setToCountry(e.target.value)} placeholder="TO COUNTRY">
            {countries.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
          </ThemedSelect>

          <ThemedInput value={shipperZip} onChange={(e) => setShipperZip(e.target.value)} placeholder="SHIPPER ZIP" />
          <ThemedInput value={receiverZip} onChange={(e) => setReceiverZip(e.target.value)} placeholder="RECEIVER ZIP" />
          <ThemedInput value={length} onChange={(e) => setLength(e.target.value)} placeholder="LENGTH (INCHES)" type="number" icon={PiRulerDuotone} />
          <ThemedInput value={breadth} onChange={(e) => setBreadth(e.target.value)} placeholder="BREADTH (INCHES)" type="number" icon={PiRulerDuotone} />
          <ThemedInput value={height} onChange={(e) => setHeight(e.target.value)} placeholder="HEIGHT (INCHES)" type="number" icon={PiRulerDuotone} />
          <ThemedInput value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="WEIGHT (LBS)" type="number" icon={PiScalesDuotone} />
        </div>

        {error && (
          <p className="text-red-600 font-geist-normal text-sm sm:text-base text-center mb-6 sm:mb-8 tracking-wide leading-relaxed">
            {error}
          </p>
        )}

        <div className="text-center mb-8 sm:mb-12">
          <button 
            onClick={calculate} 
            className="bg-black text-white font-monument-regular tracking-widest text-sm sm:text-base py-3 sm:py-4 px-8 sm:px-12 hover:bg-gray-800 transition-colors rounded-lg uppercase"
          >
            CALCULATE
          </button>
        </div>

        {shippingPrice !== null && (
          <div className="mt-12 sm:mt-16 text-center border-t border-gray-300 pt-8 sm:pt-12">
            <h2 className="font-monument-regular text-gray-600 text-lg sm:text-xl lg:text-2xl tracking-wider uppercase mb-4">
              Estimated Shipping Price
            </h2>
            <p className="font-monument-regular text-3xl sm:text-4xl lg:text-5xl text-gray-800 mt-2 mb-4 sm:mb-6">
              ${shippingPrice}
            </p>
            <p className="font-geist-normal text-xs sm:text-sm text-gray-500 mt-4 tracking-wide leading-relaxed max-w-md mx-auto">
              This is an estimated price; the actual price may vary based on additional factors and carrier policies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
