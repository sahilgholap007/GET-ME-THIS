"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function FloatingVideo() {
    const containerRef = useRef(null)
    const { scrollY } = useScroll()
    const [windowDimensions, setWindowDimensions] = useState({ width: 1200, height: 800 }) // Default values to prevent hydration mismatch
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
    const [isClient, setIsClient] = useState(false)
    const [isVideoStuck, setIsVideoStuck] = useState(false)
    const [hasAnimationCompleted, setHasAnimationCompleted] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Mobile responsiveness
    const isMobile = windowDimensions.width < 768

    // Initial position (right side of screen, middle vertically) - Increased sizes
    const videoWidth = isMobile ? 320 : 480 // w-80 = 320px, w-120 = 480px (increased)
    const videoHeight = isMobile ? 180 : 270 // h-45 = 180px, h-[270px] (increased)
    const initialX = windowDimensions.width - videoWidth - 20 // Account for video width + padding
    const initialY = windowDimensions.height / 2 - videoHeight / 2 // Center vertically

    // Transform values based on scroll with safety bounds - ALWAYS call these hooks
    const x = useTransform(scrollY, [0, 1200], [Math.max(0, initialX), Math.max(0, targetPosition.x)])
    const y = useTransform(scrollY, [0, 1200], [Math.max(0, initialY), Math.max(0, targetPosition.y)])
    const scale = useTransform(scrollY, [0, 800, 1200], [0.7, 0.9, 1])
    // Opacity that fades in and stays visible
    const opacity = useTransform(scrollY, [0, 100, 99999], [0, 1, 1]) // Fade in at 100px and stay visible

    useEffect(() => {
        setIsClient(true)
        setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }, [])

    // Effect to detect when any modal is open
    useEffect(() => {
        if (!isClient) return

        const checkForModals = () => {
            // Check for any elements with fixed positioning and high z-index (likely modals)
            const highZIndexElements = document.querySelectorAll('[class*="z-[8"], [class*="z-[9"], [class*="z-50"], [style*="z-index: 8"], [style*="z-index: 9"], [style*="z-index: 50"]')
            const fixedElements = document.querySelectorAll('[class*="fixed"]')

            // Look for modal indicators - elements that are fixed, cover full screen, and have high z-index
            let modalDetected = false
            fixedElements.forEach(element => {
                const styles = window.getComputedStyle(element)
                const zIndex = parseInt(styles.zIndex) || 0
                // Detect modals with z-index >= 50 (including PersonalShopper modal)
                if (zIndex >= 50 && styles.position === 'fixed') {
                    const rect = element.getBoundingClientRect()
                    // Check if element covers significant portion of screen (likely a modal backdrop)
                    if (rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.5) {
                        modalDetected = true
                    }
                }
            })

            setIsModalOpen(modalDetected)
        }

        // Check initially
        checkForModals()

        // Set up mutation observer to detect DOM changes
        const observer = new MutationObserver(checkForModals)
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        })

        return () => observer.disconnect()
    }, [isClient])

    // Check if video should be stuck at target position
    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            // When scroll reaches the target position for the first time, make video stick permanently
            if (latest >= 1200 && !hasAnimationCompleted) {
                setIsVideoStuck(true)
                setHasAnimationCompleted(true)
            }
        })
        return unsubscribe
    }, [scrollY, hasAnimationCompleted])

    useEffect(() => {
        if (!isClient) return

        const updateTargetPosition = () => {
            try {
                const videoContainer = document.getElementById('video-target-position')

                if (videoContainer) {
                    const rect = videoContainer.getBoundingClientRect()
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

                    const isMobileView = window.innerWidth < 768
                    const videoW = isMobileView ? 320 : 480
                    const videoH = isMobileView ? 180 : 270

                    setTargetPosition({
                        x: Math.max(0, rect.left + rect.width / 2 - videoW / 2), // Center the video with min bounds
                        y: Math.max(0, rect.top + scrollTop + rect.height / 2 - videoH / 2) // Center the video with min bounds
                    })
                }

                setWindowDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight
                })
            } catch (error) {
                console.warn('Error updating video position:', error)
            }
        }

        // Update position on mount and resize with debouncing
        updateTargetPosition()

        let timeoutId
        const debouncedUpdate = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(updateTargetPosition, 16) // ~60fps
        }

        window.addEventListener('resize', debouncedUpdate)

        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('resize', debouncedUpdate)
        }
    }, [isClient])

    // Don't render anything on server-side, before client hydration, on mobile, when modal is open, or when animation is completed
    if (!isClient || isMobile || isModalOpen || hasAnimationCompleted) {
        return null
    }

    return (
        <motion.div
            key="floating-video"
            ref={containerRef}
            className="fixed top-0 left-0 z-50 pointer-events-auto"
            style={{
                x,
                y,
                scale,
                opacity,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 0.7 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <div className="relative pointer-events-auto">
                <iframe
                    src="https://www.youtube.com/embed/5LrE-ULhWrU?autoplay=1&mute=0&loop=1&playlist=5LrE-ULhWrU&controls=1&modestbranding=1&rel=0"
                    title="What is GetMeThis - Floating Video"
                    className={`${isMobile ? 'w-80 h-45' : 'w-120 h-[270px]'} rounded-lg shadow-2xl border-4 border-white bg-black`}
                    allow="autoplay; fullscreen; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="eager"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-lg -z-10" />

                {/* Close button for mobile */}
                {isMobile && (
                    <button
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors shadow-lg"
                        onClick={() => {
                            const videoElement = containerRef.current
                            if (videoElement) {
                                videoElement.style.display = 'none'
                            }
                        }}
                    >
                        ×
                    </button>
                )}

                {/* Drag indicator - only show when animation not completed */}
                {!hasAnimationCompleted && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/50 rounded-full" />
                )}
            </div>
        </motion.div>
    )
}