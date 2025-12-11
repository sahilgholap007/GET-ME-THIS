"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import LoadingScreen from "./LoadingScreen"

const AssistedShopping = () => {
  const [productLink, setProductLink] = useState("")
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [forceCompleteLoading, setForceCompleteLoading] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!productLink.trim()) {
      console.log("No product link provided")
      return
    }

    try {
      // Show loading screen and start processing immediately
      setShowLoadingScreen(true)
      console.log("Product link submitted:", productLink)

      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 3000)) // 3 second delay for demo

      console.log("Processing completed successfully!")
      // Add your success logic here (e.g., navigate to results, show success message, etc.)

      // Force complete the loading screen immediately
      setForceCompleteLoading(true)

    } catch (error) {
      console.error("Error processing:", error)
      // Add your error handling here
      setForceCompleteLoading(true) // Still complete the loading screen
    }
  }

  const handleLoadingComplete = () => {
    // Called when loading screen completes (either by API completion or manual skip)
    setShowLoadingScreen(false)
    setForceCompleteLoading(false)
    console.log("Loading screen completed!")
  }

  return (
    <motion.div
      ref={ref}
      className="relative bg-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-monument-ultrabold text-black mb-6 sm:mb-8 uppercase tracking-wide px-2"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Assisted Shopping
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-700 font-giest leading-relaxed max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Paste any product link and relax. We handle the entire process sourcing, shipping, customs, duties and deliver it right to your doorstep.
          </motion.p>
          <motion.div
            className="flex justify-center mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.3, rotateY: 180 }}
            animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.3, rotateY: 180 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", bounce: 0.4 }}
          >
            <img
              src="/images/chrome-link.png"
              alt="Chrome Shopping Cart"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 drop-shadow-2xl"
            />
          </motion.div>



          <motion.form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.input
                type="url"
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
                placeholder="Paste your product link here (Amazon, eBay, Nike, Apple, etc.)"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 rounded-full font-monument-ultralight text-xs sm:text-sm focus:border-black focus:outline-none"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <motion.button
                type="submit"
                className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-monument-regular text-xs sm:text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors whitespace-nowrap w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Instant Quote
              </motion.button>
            </div>
          </motion.form>

          {/* <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <button className="flex items-center gap-2 bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-monument-ultralight text-xs sm:text-sm hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center">
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              Get instant quote
            </button>
            <button className="flex items-center gap-2 bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-monument-ultralight text-xs sm:text-sm hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              Talk to our AI chatbot
            </button>
          </div> */}
        </div>
      </div>

      {/* Loading Screen */}
      <LoadingScreen
        isVisible={showLoadingScreen}
        onComplete={handleLoadingComplete}
        forceComplete={forceCompleteLoading}
      />
    </motion.div>
  )
}

export default AssistedShopping
