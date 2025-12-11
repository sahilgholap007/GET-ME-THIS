"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ShoppingCartGame from "./ShoppingCartGame"

// Typewriter component for typing effect
const TypewriterText = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
  }, [text])

  return (
    <span>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

let messageIndex = 0

export default function LoadingScreen({ isVisible, onComplete, forceComplete = false, sessionId = null }) {
  const [progress, setProgress] = useState(0.0)
  const [currentMessage, setCurrentMessage] = useState("Connecting to the Web")
  const [showVideo, setShowVideo] = useState(true)
  const [isVideoSkipped, setIsVideoSkipped] = useState(false)
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const fallbackTimerRef = useRef(null)

  // Progress animation effect
  useEffect(() => {
    if (!isVisible) {
      // Reset states when component is hidden
      setProgress(0.0)
      setCurrentMessage("Connecting to the Web")
      setShowVideo(true)
      setIsVideoSkipped(false)
      setIsTypingComplete(false)
      setIsWaiting(false)
      messageIndex = 0
      return
    }

    startFallbackProgress()

    // Cleanup on unmount
    return () => {
      if (fallbackTimerRef.current) {
        clearInterval(fallbackTimerRef.current)
      }
    }
  }, [isVisible])

  // Fallback progress animation if WebSocket is not available or fails
  const startFallbackProgress = () => {
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current)
    }

    const messages = [
      "Connecting to the Web",
      "Processing your URL",
      "Fetching product details",
      "Analyzing product information",
      "Almost done...",
      "Finalizing results...",
    ]

    fallbackTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        let newProgress = prev + 100 / (90 * 10) // 90 seconds total
        if (newProgress >= 100) {
          // Stay at 100% until forceComplete is called
          newProgress = 100.0
          setIsWaiting(true)
        }

        // Update message every 20%
        const newMessageIndex = Math.floor(newProgress / 20)
        if (newMessageIndex !== messageIndex && newMessageIndex < messages.length) {
          messageIndex = newMessageIndex
          setCurrentMessage(messages[messageIndex])
        }

        return newProgress
      })
    }, 100)
  }

  // Effect to handle force completion when API finishes (for non-WebSocket scenarios)
  useEffect(() => {
    if (forceComplete && isVisible) {
      // Clear any running timer
      if (fallbackTimerRef.current) {
        clearInterval(fallbackTimerRef.current)
        fallbackTimerRef.current = null
      }
      setIsWaiting(false)
      // Jump directly to 100% and complete
      setProgress(100.0)
      setCurrentMessage("Validation completed!")
      setTimeout(() => onComplete?.(), 300)
    }
  }, [forceComplete, isVisible, onComplete])

  const handleSkipVideo = () => {
    setShowVideo(false)
    setIsVideoSkipped(true)
  }

  const handleWatchFullVideo = () => {
    // Keep the video playing, maybe expand it or give it focus
    // For now, we'll just ensure it stays visible
    setShowVideo(true)
  }

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center relative min-h-screen flex flex-col justify-center py-8 sm:py-0">
        {/* Video Section */}
        <AnimatePresence mode="wait">
          {showVideo && (
            <motion.div
              className="mb-6 sm:mb-8 flex justify-center px-4 sm:px-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full max-w-2xl">
                {/* Responsive video container with aspect ratio */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border-2 sm:border-4 border-white bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/5LrE-ULhWrU?autoplay=1&mute=0&loop=1&playlist=5LrE-ULhWrU&controls=1&modestbranding=1&rel=0"
                    title="What is GetMeThis - Loading Video"
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="eager"
                  />
                </div>

                {/* Video Controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 justify-center">
                  <motion.button
                    onClick={handleSkipVideo}
                    className="px-4 sm:px-6 py-2 sm:py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-monument-regular text-xs sm:text-sm uppercase tracking-wider hover:bg-white/30 transition-all duration-300 border border-white/30 w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Skip & Play Game
                  </motion.button>
                  <motion.button
                    onClick={handleWatchFullVideo}
                    className="px-4 sm:px-6 py-2 sm:py-2 bg-white text-black rounded-full font-monument-regular text-xs sm:text-sm uppercase tracking-wider hover:bg-gray-200 transition-all duration-300 w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Watch Full Video
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Section - Shows after skipping video */}
        <AnimatePresence mode="wait">
          {isVideoSkipped && (
            <motion.div
              className="mb-6 sm:mb-8 flex justify-center px-4 sm:px-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingCartGame />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Section - Always visible or visible after video skip */}
        <motion.div
          className="space-y-6 sm:space-y-8"
          initial={{ opacity: isVideoSkipped ? 0 : 1, y: isVideoSkipped ? 20 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Typographic Animation with Typewriter Effect */}
          <div className="h-12 sm:h-16 flex items-center justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentMessage}
                className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-monument-ultrabold text-white uppercase tracking-wide text-center leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <TypewriterText text={currentMessage} speed={80} onComplete={() => setIsTypingComplete(true)} />
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-white font-monument-regular text-xs sm:text-sm uppercase tracking-wider">
                  Progress
                </span>
                {isWaiting && (
                  <motion.span
                    className="text-green-400 text-xs flex items-center gap-1"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Finalizing
                  </motion.span>
                )}
              </div>
              <span className="text-white font-monument-ultrabold text-base sm:text-lg">{progress.toFixed(2)}%</span>
            </div>

            <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 overflow-hidden backdrop-blur-sm border border-white/30">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
                style={{ width: `${progress}%` }}
                animate={
                  isWaiting
                    ? {
                        scale: [1, 1.02, 1],
                        opacity: [1, 0.9, 1],
                      }
                    : {}
                }
                transition={
                  isWaiting
                    ? {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : { duration: 0.3, ease: "easeOut" }
                }
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer" />
              </motion.div>
            </div>

            {/* Additional Loading Info */}
            <motion.p
              className="text-white/70 font-monument-ultralight text-xs sm:text-sm text-center mt-4 sm:mt-6 uppercase tracking-wider px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span className="hidden sm:inline">
                {isWaiting
                  ? "Almost there! • Finalizing your personalized quote • Just a moment..."
                  : "Analyzing your request • Preparing your quote • Please wait..."}
              </span>
              <span className="sm:hidden">
                {isWaiting ? "Almost there! • Please wait..." : "Analyzing request • Please wait..."}
              </span>
            </motion.p>

            {/* Minigame Info */}
            {isWaiting && (
              <motion.p
                className="text-white/60 font-monument-ultralight text-xs text-center mt-2 uppercase tracking-wider px-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                This may take a few minutes • Enjoy a minigame while you wait!
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-16 sm:w-32 h-16 sm:h-32 bg-blue-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-12 sm:w-24 h-12 sm:h-24 bg-purple-500/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-8 sm:w-16 h-8 sm:h-16 bg-pink-500/10 rounded-full blur-lg"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      </div>

      <style jsx>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%) skewX(-12deg);
                    }
                    100% {
                        transform: translateX(200%) skewX(-12deg);
                    }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
    </motion.div>
  )
}
