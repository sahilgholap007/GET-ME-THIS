"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import axiosInstance from "../utils/axiosInstance"
import { Package, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

function getPlatformName(url) {
  try {
    const { hostname } = new URL(url)
    const domain = hostname.replace('www.', '').split('.')[0]
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  } catch (error) {
    return 'Unknown'
  }
}

export default function WhatCustomersAreGetting() {
  const ref = useRef(null)
  const carouselRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/deals/trending/')
        // Take more products for carousel
        setTrendingProducts(response.data.slice(0, 8))
      } catch (error) {
        console.error('Failed to fetch trending products:', error)
        // Fallback to empty array if API fails
        setTrendingProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingProducts()
  }, [])

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', checkScrollButtons)
      return () => {
        if (carouselRef.current) {
          carouselRef.current.removeEventListener('scroll', checkScrollButtons)
        }
      }
    }
  }, [trendingProducts])

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.offsetWidth || 0
      const gap = 24 // 1.5rem gap
      carouselRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.offsetWidth || 0
      const gap = 24 // 1.5rem gap
      carouselRef.current.scrollBy({
        left: cardWidth + gap,
        behavior: 'smooth'
      })
    }
  }

  return (
    <motion.section
      ref={ref}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-monument-ultrabold text-black uppercase tracking-wide leading-tight">
              Popular Choices
            </h2>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg font-monument-ultralight text-muted-foreground uppercase tracking-wide max-w-3xl mx-auto px-4 mt-4 sm:mt-6 md:mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the most popular Products delivered worldwide
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          {loading ? (
            // Loading skeleton
            <div className="relative">
              <div className="flex space-x-6 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-80 sm:w-96">
                    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 animate-pulse min-h-[300px] sm:min-h-[350px]">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 bg-gray-200 rounded-lg"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : trendingProducts.length === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-monument-regular text-gray-800 tracking-wider mb-2">No Popular Products Available</h3>
              <p className="text-gray-500 font-geist-normal">Check back later for the latest popular products</p>
            </div>
          ) : (
            // Carousel
            <div className="relative max-w-7xl mx-auto">
              {/* Navigation Buttons */}
              {trendingProducts.length > 2 && (
                <>
                  <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200/20 transition-all duration-300 ${canScrollLeft
                        ? 'hover:bg-white hover:shadow-xl text-gray-700 hover:text-black'
                        : 'opacity-50 cursor-not-allowed text-gray-400'
                      }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200/20 transition-all duration-300 ${canScrollRight
                        ? 'hover:bg-white hover:shadow-xl text-gray-700 hover:text-black'
                        : 'opacity-50 cursor-not-allowed text-gray-400'
                      }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {trendingProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="group flex-shrink-0 w-80 sm:w-96"
                    initial={{ opacity: 0, x: 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <motion.a
                      href={product.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-card border border-border rounded-2xl text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-primary/20 relative overflow-hidden h-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* External link indicator */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200/20">
                            <ExternalLink className="h-4 w-4 text-gray-700" />
                          </div>
                        </div>

                        {/* Platform Badge */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-geist-medium bg-black/80 text-white backdrop-blur-sm border border-white/10">
                            {getPlatformName(product.external_link)}
                          </span>
                        </div>

                        {/* Image Section */}
                        <div className="relative z-10 p-4 sm:p-6 flex-1 flex items-center justify-center">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl overflow-hidden">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name || 'Popular Product'}
                                fill
                                className="object-contain p-2"
                              />
                            ) : (
                              <Package className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Text Section */}
                        <div className="relative z-10 p-4 sm:p-6 pt-0 flex-shrink-0">
                          <h3 className="font-monument-ultralight text-sm sm:text-base md:text-lg text-foreground mb-2 sm:mb-3 uppercase tracking-wide leading-tight line-clamp-2">
                            {product.name || 'Trending Product'}
                          </h3>

                          {product.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground font-geist-normal line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}
