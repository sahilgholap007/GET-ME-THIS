"use client";

import Image from "next/image";

// Reusable Select Field Component
const ThemedSelect = ({ value, onChange, placeholder, children, className }) => (
    <select
        value={value}
        onChange={onChange}
        className={`w-full h-14 bg-white font-monument-ultralight tracking-wider text-sm pl-4 pr-10 rounded-full shadow-md focus:ring-2 focus:ring-gray-400 focus:outline-none appearance-none ${!value ? 'text-gray-400' : ''} ${className}`}
    >
        <option value="" disabled selected>{placeholder}</option>
        {children}
    </select>
);

export default function GlobalShopping() {
    return (
        <div className="bg-gray-100 py-24 sm:py-32">
            <div className="max-w-screen mx-auto text-center">
                {/* Main Title */}
                <h1 className="font-monument-regular text-4xl text-gray-700 tracking-[0.2em] uppercase">
                    GLOBAL SHOPPING SITES ?
                </h1>
                <p className="mt-4 font-monument-ultralight text-sm text-gray-500 tracking-wider uppercase">
                    FIND YOUR FAVOURITES PRODUCTS FROM TOP NOTCH WEBSITE WORLDWIDE
                </p>

                {/* Dropdowns and Hand Image */}
                <div className="mt-16 relative flex justify-center items-center">
                    <div className="flex flex-col sm:flex-row items-center gap-8 z-10">
                        <ThemedSelect placeholder="SELECT A COUNTRY" className="w-64">
                            <option value="us">United States</option>
                            <option value="uk">United Kingdom</option>
                            <option value="ca">Canada</option>
                        </ThemedSelect>
                        <ThemedSelect placeholder="CATEGORY" className="w-64">
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home">Home Goods</option>
                        </ThemedSelect>
                    </div>
                </div>

                {/* Brand Logos */}
                <div className="mt-20 pt-12 border-t border-gray-200">
                    <div className="flex flex-wrap justify-center items-center gap-x-12 sm:gap-x-16 gap-y-8">
                        <Image src="/placeholder/amazon-logo.svg" alt="Amazon" width={120} height={40} className="object-contain filter grayscale hover:grayscale-0 transition duration-300" />
                        <Image src="/placeholder/walmart-logo.svg" alt="Walmart" width={130} height={40} className="object-contain filter grayscale hover:grayscale-0 transition duration-300" />
                        <Image src="/placeholder/ebay-logo.svg" alt="eBay" width={90} height={40} className="object-contain filter grayscale hover:grayscale-0 transition duration-300" />
                        <Image src="/placeholder/macys-logo.svg" alt="Macy's" width={120} height={40} className="object-contain filter grayscale hover:grayscale-0 transition duration-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}