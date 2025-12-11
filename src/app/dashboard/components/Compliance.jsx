'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Shield, Search, RefreshCw, AlertTriangle, Info } from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import { motion } from 'framer-motion'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function CompliancePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(null)
  const controllerRef = useRef(null)

  async function loadItems() {
    if (controllerRef.current) controllerRef.current.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setLoading(true)
    setError('')

    try {
      const res = await axiosInstance.get('/api/v1/compliance/prohibited-items/', {
        signal: controller.signal,
      })
      const data = Array.isArray(res.data) ? res.data : []
      setItems(data)
      setLastUpdated(new Date())
    } catch (err) {
      // Ignore cancellation errors
      if (err && (err.name === 'CanceledError' || err.code === 'ERR_CANCELED')) {
        return
      }
      setError('Unable to load prohibited items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
    return () => {
      if (controllerRef.current) controllerRef.current.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const categories = useMemo(() => {
    const set = new Set()
    for (const it of items) {
      if (it?.category) set.add(it.category)
    }
    return Array.from(set).sort()
  }, [items])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((it) => {
      const matchesQuery =
        !q ||
        it?.name?.toLowerCase().includes(q) ||
        it?.description?.toLowerCase().includes(q) ||
        it?.category?.toLowerCase().includes(q)

      const matchesCategory = category === 'all' || it?.category === category

      return matchesQuery && matchesCategory
    })
  }, [items, search, category])

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:py-12 font-geist-normal">
      <div className="max-w-full mx-auto mb-6 sm:mb-8">
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-24 h-24 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-monument-regular text-black uppercase leading-tight">
                  Prohibited Items
                </h1>
                <p className="text-black text-xs sm:text-sm font-geist-normal uppercase mt-1 leading-relaxed">
                  Active compliance restrictions for shipping and handling
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4 text-center min-w-[100px] shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-xs text-blue-600 font-monument-regular tracking-widest uppercase mb-1">Total Items</div>
                <div className="text-sm font-geist-normal text-black">{items.length}</div>
              </div>
              <div className="flex-1 sm:flex-none bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3 sm:p-4 text-center min-w-[100px] shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-xs text-purple-600 font-monument-regular tracking-widest uppercase mb-1">Categories</div>
                <div className="text-sm font-geist-normal text-black">{categories.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">

        {/* Controls */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, description, or category..."
                className="h-12 sm:h-14 pl-4 sm:pl-6 pr-12 sm:pr-14 rounded-full bg-gray-50 border border-gray-200 font-geist-normal text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                aria-label="Search prohibited items"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-64 h-12 sm:h-14 bg-gray-50 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="font-geist-normal">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(search || category !== 'all') && (
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('all')
                }}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-black text-white font-monument-regular tracking-wider text-xs sm:text-sm hover:bg-gray-800 transition-colors rounded-lg"
              >
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-geist-normal text-red-700">{error}</p>
              <button
                onClick={loadItems}
                className="mt-4 flex items-center space-x-2 px-4 py-2 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
            </div>
          </motion.div>
        ) : loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="overflow-hidden bg-white shadow-xl rounded-2xl border border-gray-200">
                  <CardHeader className="space-y-2 pb-3 border-b border-gray-200">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-1/2"></div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-4">
                    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-full"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-5/6"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-4/6"></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="text-center py-16 px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 shadow-inner">
              <Shield className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-monument-regular text-black uppercase mb-2 tracking-wide">No Prohibited Items Found</h3>
            <p className="text-sm font-geist-normal text-black mb-6 max-w-md mx-auto leading-relaxed">
              {search || category !== 'all'
                ? 'Try adjusting your search terms or clearing the filters to see all items.'
                : 'There are currently no active compliance restrictions.'}
            </p>
            {(search || category !== 'all') && (
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('all')
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-black text-white font-monument-regular tracking-wider text-xs hover:bg-gray-800 transition-colors rounded-lg"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div
              className="text-sm font-geist-normal text-black mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Showing {filtered.length} of {items.length} item{items.length === 1 ? '' : 's'}
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-lg font-monument-regular text-black uppercase leading-tight">
                          {item.name}
                        </CardTitle>
                        {item.category && (
                          <Badge className="bg-blue-100 text-blue-800">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm font-geist-normal text-black leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
