"use client"
import { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function WhyCustomersLoveIt() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  const stories = [
    {
      quote:
        "I never thought I’d own the latest Dyson Airwrap from the US, but TheGlobalGenie made it happen — customs, delivery, everything handled smoothly. Super impressed!",
      author: "Shruti Mehra, Mumbai",
      savings: "Dyson Airwrap",
      rating: 5,
    },
    {
      quote:
        "I saw a Japanese ceramic tea set on Instagram and couldn’t find it anywhere in India. Shared a screenshot with TheGlobalGenie, and boom — it was at my doorstep in 3 weeks.",
      author: "Akshay Rao, Bangalore",
      savings: "Japanese Ceramic Tea Set",
      rating: 5,
    },
    {
      quote:
        "The best thing about GET ME THIS? No customs headache! They handled everything — all I did was pay and wait. Smoothest luxury purchase ever.",
      author: "Karan Bhatia, Frequent Buyer",
      savings: "Luxury purchase (all-inclusive)",
      rating: 5,
    },
    {
      quote:
        "I found a smart home gadget on BestBuy.com, but it wasn’t available here. I just sent the link on WhatsApp — TheGlobalGenie handled shipping, customs, everything.",
      author: "Harsh Goenka, Hyderabad",
      savings: "Smart Home Gadget (BestBuy USA)",
      rating: 5,
    },
    {
      quote:
        "Tried to order a skincare set from Sephora UK, but my card kept getting declined and they didn’t ship internationally. These guys sourced it, cleared customs, and sent it to me with tracking.",
      author: "Neha Lamba, Chandigarh",
      savings: "Sephora UK Skincare Set",
      rating: 5,
    },
    {
      quote:
        "I was looking for a designer jacket from Farfetch, but the duties were too confusing. TheGlobalGenie gave me an all-inclusive price and no hidden charges. Smooth delivery.",
      author: "Rohit Nair, Kochi",
      savings: "Farfetch Designer Jacket",
      rating: 5,
    },
    {
      quote:
        "Saw a cool gadget on B&H Photo Video (USA) — they don’t ship to India. I thought it was impossible, but TheGlobalGenie made it happen. I’m impressed.",
      author: "Kunal Mehta, Tech Enthusiast",
      savings: "Gadget from B&H Photo Video",
      rating: 5,
    },
    {
      quote:
        "Needed a custom keyboard from a niche website called Drop.com. No shipping to India. But these guys got it for me — same price, plus duties, no hassle.",
      author: "Aayushi S., UI/UX Designer",
      savings: "Drop.com Custom Keyboard",
      rating: 5,
    },
    {
      quote:
        "I was dying to buy a pair of boots from Nordstrom USA, but they don’t ship to India. I shared the link with TheGlobalGenie, and they delivered it to my home in 12 days. Unreal.",
      author: "Ananya Tyagi, Fashion Blogger",
      savings: "Nordstrom USA Boots",
      rating: 5,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const itemsPerSlide = isMobile ? 1 : 2
  const maxSlides = Math.ceil(stories.length / itemsPerSlide)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % maxSlides)
    }, 4500) // Increased to 4.5 seconds for better reading time

    return () => clearInterval(interval)
  }, [maxSlides])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + maxSlides) % maxSlides)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % maxSlides)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <motion.section
      ref={ref}
      className="bg-white relative overflow-hidden py-20"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white to-gray-100/30" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]">
        <div className="absolute top-20 right-20 w-96 h-96 bg-black rounded-full blur-3xl opacity-5" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gray-600 rounded-full blur-3xl opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-monument-ultrabold text-black mb-6 sm:mb-8 uppercase tracking-wide px-2"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Testimonials
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg font-monument-ultralight text-muted-foreground uppercase tracking-wide max-w-4xl mx-auto px-4 mt-4 sm:mt-6 md:mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            What our customers feel, straight from the heart
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -10 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.4 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <img src="/images/heart.png" alt="Chrome Shopping Cart" className="w-64 h-64 drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>

      <motion.section
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="container mx-auto px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <motion.button
                onClick={goToPrevious}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white group hover:scale-110"
                aria-label="Previous testimonials"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-black transition-colors" />
              </motion.button>

              <motion.button
                onClick={goToNext}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white group hover:scale-110"
                aria-label="Next testimonials"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-black transition-colors" />
              </motion.button>

              <div className="relative overflow-hidden py-6 sm:py-8 md:py-10">
                <motion.div
                  className="flex"
                  animate={{ x: -currentIndex * (100 / itemsPerSlide) + "%" }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                  {stories.map((story, index) => (
                    <motion.div
                      key={index}
                      className="w-full md:w-1/2 flex-shrink-0 px-2 sm:px-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="relative group h-full"
                        whileHover={{ y: -4, scale: 1.005 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {/* Modern glassmorphism card with improved mobile design */}
                        <div className="relative bg-gradient-to-br from-white via-white/95 to-gray-50/90 backdrop-blur-xl border border-gray-200/20 rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-transparent to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Accent border on hover */}
                          <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent transition-all duration-500" />

                          <div className="relative p-4 sm:p-6 md:p-8 h-full flex flex-col min-h-[240px] sm:min-h-[280px]">
                            {/* Rating stars with improved mobile design */}
                            <motion.div
                              className="flex mb-4 sm:mb-6 relative z-10"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.1 }}
                            >
                              {[...Array(story.rating)].map((_, i) => (
                                <motion.span
                                  key={i}
                                  className="text-black text-base sm:text-lg mr-0.5 sm:mr-1 drop-shadow-sm"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: i * 0.05,
                                    type: "spring",
                                    bounce: 0.4
                                  }}
                                >
                                  ★
                                </motion.span>
                              ))}
                            </motion.div>

                            {/* Quote with better mobile typography */}
                            <motion.div
                              className="relative mb-4 sm:mb-6 md:mb-8 flex-1"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
                              {/* Quote mark */}
                              <div className="absolute -top-1 sm:-top-2 -left-0.5 sm:-left-1 text-2xl sm:text-3xl md:text-4xl text-gray-300 font-serif leading-none">"</div>

                              <p className="text-gray-700 text-sm sm:text-base leading-relaxed relative z-10 font-normal pl-4 sm:pl-6">
                                {story.quote}
                              </p>

                              {/* Closing quote mark */}
                              <div className="absolute -bottom-2 sm:-bottom-4 right-0 text-2xl sm:text-3xl md:text-4xl text-gray-300 font-serif leading-none">"</div>
                            </motion.div>

                            {/* Author section with improved mobile design */}
                            <motion.div
                              className="relative z-10 mt-auto"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              {/* Subtle divider */}
                              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gray-300 to-transparent mb-3 sm:mb-4"></div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                                    {story.author}
                                  </p>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium leading-tight">
                                    {story.savings}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            <motion.div
              className="flex justify-center mt-8 sm:mt-10 md:mt-12 space-x-2 sm:space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {Array.from({ length: maxSlides }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 border-2 cursor-pointer ${index === currentIndex
                    ? "bg-black border-black scale-110"
                    : "bg-transparent border-gray-300 hover:border-gray-600"
                    }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={index === currentIndex ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.section>
  )
}
