"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ShoppingBag, Glasses, Footprints } from "lucide-react"

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      ref={ref}
      className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Icons */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 12 }, (_, i) => {
          const icons = [ShoppingBag, Glasses, Footprints]
          const Icon = icons[i % icons.length]
          const size = 18 + Math.random() * 18
          return (
            <motion.div
              key={i}
              className="absolute text-slate-400 opacity-15 drop-shadow-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
              }}
              animate={{
                y: '120vh',
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 16 + Math.random() * 12,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: 'linear',
              }}
            >
              <Icon size={size} />
            </motion.div>
          )
        })}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <motion.div
          className="flex items-center justify-center mb-1 sm:mb-1 md:mb-1 lg:mb-1"
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-monument-ultrabold text-black uppercase tracking-wider text-center leading-tight px-2">
            How it works
          </h2>
        </motion.div>
        <motion.div
          className="mt-1 sm:mt-1 md:mt-1 lg:mt-1 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-5xl mx-auto font-geist-regular uppercase tracking-wide px-4 text-center">
            zero effort, guaranteed authenticity checks, <br/> and an all-inclusive quote before you
            pay.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 max-w-7xl mx-auto">
            {/* Assisted Shopping */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <img
                  src="/images/chrome-link.png"
                  alt="Chrome Shopping Cart"
                  className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 drop-shadow-2xl"
                />
              </motion.div>

              <motion.h3
                className="font-monument-regular uppercase text-xl sm:text-2xl md:text-3xl text-black mb-8 sm:mb-10 md:mb-12 text-center tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Assisted Shopping
              </motion.h3>

              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {[
                  {
                    number: "1",
                    title: "Paste link",
                    description: "Paste your product link from any site.",
                    delay: 1,
                  },
                  {
                    number: "2",
                    title: "We handle everything",
                    description:
                      "We purchase, verify, handle compliance and customs, deliver to your doorstep with tracking.",
                    delay: 1.2,
                  },
                  {
                    number: "3",
                    title: "DOOR sTEP delivery",
                    description:
                      "We purchase, verify, handle compliance and customs, deliver to your doorstep with tracking.",
                    delay: 1.4,
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-100 shadow-xl rounded-xl p-4 sm:p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex items-center"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.6, delay: step.delay }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4 md:gap-6 w-full">
                      <span className="bg-black text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-monument-regular text-sm sm:text-base font-bold flex-shrink-0">
                        {step.number}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-monument-regular uppercase text-base sm:text-lg md:text-xl text-black mb-2 sm:mb-3 tracking-wide">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg font-geist-normal">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <p className="text-black text-base sm:text-lg md:text-xl leading-relaxed max-w-4xl mx-auto font-monument-regular uppercase tracking-wide px-4 text-center">
                  Best when you want zero effort, guaranteed authenticity checks, and an all-inclusive quote before you
                  pay.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
