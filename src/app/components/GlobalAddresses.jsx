"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

export default function GlobalAddresses() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.section
      ref={ref}
      className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-black/10 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-black/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-black/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group w-full text-center rounded-lg p-4"
              initial={{ opacity: 0, y: -50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-monument-ultrabold text-black uppercase tracking-wide px-2 group-hover:text-gray-800 transition-colors duration-300">
                  Get your global addresses
                </h2>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-black group-hover:text-gray-800 transition-colors duration-300"
                >
                  <ChevronDown size={32} className="sm:w-10 sm:h-10" />
                </motion.div>
              </div>
            </motion.button>

            <motion.p
              className="font-monument-regular text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed tracking-wide uppercase mt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Get your own virtual addresses in the USA, UK, Japan and more. Shop like a local anywhere in the world.
            </motion.p>
          </div>

          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                className="flex justify-center lg:justify-end order-1 lg:order-1"
                initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                animate={
                  isInView && isExpanded
                    ? { opacity: 1, scale: 1, rotateY: 0 }
                    : { opacity: 0, scale: 0.5, rotateY: -90 }
                }
                transition={{ duration: 1, delay: 0.6 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-black/5 rounded-full blur-3xl scale-110"></div>
                  <img
                    src="/images/pin-globe.png"
                    alt="Global Address Globe"
                    className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 drop-shadow-sm"
                  />
                </div>
              </motion.div>

              <motion.div
                className="order-2 lg:order-2"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView && isExpanded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 mb-8 lg:mb-0">
                  <h3 className="font-monument-regular text-xl sm:text-2xl text-black mb-8 uppercase tracking-wide">
                    Sample addresses
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        label: "USA Address:",
                        address: "123 Main Street, Suite 100, Wilmington, DE 19801 (tax free)",
                        delay: 1,
                      },
                      {
                        label: "UK Address:",
                        address: "45 Oxford Street, London W1D 2DZ, United Kingdom",
                        delay: 1.2,
                      },
                      {
                        label: "Germany Address:",
                        address: "Unter den Linden 10, 10117 Berlin, Germany",
                        delay: 1.4,
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="group p-5 sm:p-6 bg-gray-50 rounded-xl border-l-4 border-black hover:bg-gray-100 transition-all duration-300"
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView && isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.6, delay: item.delay }}
                      >
                        <p className="font-monument-regular text-sm sm:text-base text-black mb-2 uppercase tracking-wide">
                          {item.label}
                        </p>
                        <p className="font-giest text-sm sm:text-base text-gray-600 leading-relaxed">
                          {item.address}
                          {item.highlight && (
                            <span className="ml-2 text-black font-monument-ultrabold">{item.highlight}</span>
                          )}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-center mt-12 sm:mt-16 order-3">
              <motion.button
                className="group bg-black text-white px-8 sm:px-10 py-4 sm:py-5 font-monument-regular text-sm sm:text-base hover:bg-gray-800 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl uppercase tracking-widest relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView && isExpanded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Get my global addresses</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
