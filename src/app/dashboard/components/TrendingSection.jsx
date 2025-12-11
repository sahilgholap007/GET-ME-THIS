"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import axiosInstance from '../../utils/axiosInstance'
import { TrendingUp, ExternalLink, Package, Star } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'

function getPlatformName(url) {
  try {
    const { hostname } = new URL(url)
    const domain = hostname.replace('www.', '').split('.')[0]
    return domain.charAt(0).toUpperCase() + domain.slice(1) // Capitalize
  } catch (error) {
    return 'Unknown'
  }
}

export default function TrendingSection() {
  const [trendingDeals, setTrendingDeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingDeals = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/deals/trending/')
        setTrendingDeals(response.data)
      } catch (error) {
        console.error('Failed to fetch trending deals:', error)
        toast.error('Failed to load trending deals')
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingDeals()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-100 py-16 sm:py-24 min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex justify-between pt-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 py-16 sm:py-24 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 mr-3 text-gray-700" />
            <h1 className="font-monument-regular text-3xl text-gray-800 tracking-wider">What's Trending Worldwide</h1>
          </div>
          <p className="text-sm text-gray-500 font-geist-normal">Discover the hottest deals and products from around the globe</p>
        </div>

        {trendingDeals.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-monument-regular text-gray-800 tracking-wider mb-2">No Trending Deals Available</h3>
            <p className="text-gray-500 font-geist-normal">Check back later for the latest trending products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trendingDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <a
                  href={deal.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {/* Modern glassmorphism card */}
                  <div className="relative bg-gradient-to-br from-white via-white/95 to-gray-50/90 backdrop-blur-xl border border-gray-200/20 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-transparent to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Accent border on hover */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-black/5 transition-all duration-500" />

                    {/* Image Container */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden">
                      {deal.image ? (
                        <Image
                          src={deal.image}
                          alt={deal.name || 'Trending Deal'}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                          <Package className="h-12 w-12" />
                        </div>
                      )}

                      {/* Platform Badge with glassmorphism */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-geist-medium bg-black/80 text-white backdrop-blur-sm border border-white/10">
                          {getPlatformName(deal.external_link)}
                        </span>
                      </div>

                      {/* External link indicator */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200/20">
                          <ExternalLink className="h-4 w-4 text-gray-700" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative p-6 h-full flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-monument-regular text-sm text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-black transition-colors duration-300">
                          {deal.name || 'No Title'}
                        </h3>

                        <p className="text-xs text-gray-600 font-geist-normal line-clamp-3 mb-4 leading-relaxed">
                          {deal.description || 'No description available.'}
                        </p>
                      </div>

                      
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
