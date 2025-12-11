"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ImageCarousel({ slides, autoPlay = true, interval = 4500 }) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)
  const isHoveringRef = useRef(false)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const touchEndRef = useRef({ x: 0, y: 0 })
  const isSwiping = useRef(false)

  const next = () => setIndex((i) => (i + 1) % slides.length)
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const goTo = (i) => setIndex(i)

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    isSwiping.current = false
    // Pause auto-play during touch
    isHoveringRef.current = true
  }

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return
    const touch = e.touches[0]
    touchEndRef.current = { x: touch.clientX, y: touch.clientY }

    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)

    // If horizontal swipe is more significant than vertical, prevent scroll
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault()
      isSwiping.current = true
    }
  }

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || !isSwiping.current) {
      // Resume auto-play
      isHoveringRef.current = false
      return
    }

    const deltaX = touchEndRef.current.x - touchStartRef.current.x
    const deltaY = Math.abs(touchEndRef.current.y - touchStartRef.current.y)

    // Minimum swipe distance and ensure horizontal swipe
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        prev() // Swipe right - go to previous
      } else {
        next() // Swipe left - go to next
      }
    }

    // Reset touch state and resume auto-play
    touchStartRef.current = { x: 0, y: 0 }
    touchEndRef.current = { x: 0, y: 0 }
    isSwiping.current = false
    isHoveringRef.current = false
  }

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return
    const tick = () => {
      if (!isHoveringRef.current) next()
    }
    timerRef.current = window.setInterval(tick, interval)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [autoPlay, interval, slides.length])

  if (!slides || slides.length === 0) return null

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Product gallery"
      className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto px-4 sm:px-6 md:px-8"
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-card h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[460px] flex flex-col touch-pan-y select-none">
        <AnimatePresence initial={false} mode="wait">
          <motion.figure
            key={index}
            className="flex flex-col items-center justify-center flex-1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Image wrapper with responsive height */}
            <div className="h-[200px] sm:h-[240px] md:h-[300px] lg:h-[340px] xl:h-[380px] w-full flex items-center justify-center p-2 sm:p-4">
              <img
                src={slides[index].src || "/placeholder.svg"}
                alt={slides[index].alt}
                className="max-h-full max-w-full object-contain rounded-md"
              />
            </div>

            {/* Caption with responsive text */}
            {slides[index].caption ? (
              <figcaption
                className="px-2 sm:px-4 pb-2 sm:pb-4 pt-1 sm:pt-2 text-center text-xs sm:text-sm md:text-base text-muted-foreground"
                aria-live="polite"
              >
                {slides[index].caption}
              </figcaption>
            ) : null}
          </motion.figure>
        </AnimatePresence>

        {/* Controls - Always visible and responsive */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              className="absolute left-2 sm:left-4 md:-left-12 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-background/90 hover:bg-background px-2 sm:px-3 py-2 sm:py-3 border border-border shadow-lg z-10"
              onClick={prev}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-foreground" />
            </button>

            <button
              type="button"
              aria-label="Next slide"
              className="absolute right-2 sm:right-4 md:-right-12 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-background/90 hover:bg-background px-2 sm:px-3 py-2 sm:py-3 border border-border shadow-lg z-10"
              onClick={next}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-foreground" />
            </button>


            {/* Dots - Responsive sizing */}
            <div className="absolute bottom-2 sm:bottom-[-1px] left-0 right-0 flex items-center justify-center gap-1 sm:gap-2">
              {slides.map((_, i) => {
                const dotClass =
                  "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border border-border transition " +
                  (i === index ? "bg-foreground" : "bg-muted hover:bg-accent")
                return (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index ? "true" : "false"}
                    className={dotClass}
                    onClick={() => goTo(i)}
                  />
                )
              })}
            </div>

            {/* Swipe indicator for mobile - subtle hint */}
            <div className="absolute top-2 right-2 sm:hidden">
              <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full">
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="w-2 h-0.5 bg-white/60 rounded-full"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              </div>
            </div>
          </>
        )}
      </div>

    </section>
  )
}
