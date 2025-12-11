"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { ShoppingBag, Glasses, Footprints } from "lucide-react"

export default function WhatIsGetMeThis() {
  const ref = useRef(null)
  const videoContainerRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const isVideoInView = useInView(videoContainerRef, { once: false, margin: "-50px" })
  const { scrollY } = useScroll()
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on client side
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Video opacity for smooth transitions
  const videoOpacity = useTransform(scrollY, [0, 100], [0, 1])

  return (
    <motion.section
      ref={ref}
      id="what-is-getmethis"
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Icons */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }, (_, i) => {
          const icons = [ShoppingBag, Glasses, Footprints]
          const Icon = icons[i % icons.length]
          const size = 20 + Math.random() * 20
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
                duration: 18 + Math.random() * 15,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: 'linear',
              }}
            >
              <Icon size={size} />
            </motion.div>
          )
        })}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="space-y-6 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-monument-ultrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black uppercase tracking-wider leading-none">
              What is <span className="">GET<span className="bg-white" style={{ WebkitTextStroke: "1px black" }}>ME</span>THIS?</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              ref={videoContainerRef}
              id="video-target-position"
              className="relative flex items-center justify-center mb-12 z-0"
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.5, rotateY: -180 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="relative">
                <div className="relative w-80 h-45 sm:w-96 sm:h-56 md:w-120 md:h-[270px] mx-auto">
                  <iframe
                    src="https://www.youtube.com/embed/5LrE-ULhWrU?autoplay=1&mute=1&loop=1&playlist=5LrE-ULhWrU&controls=1"
                    title="YouTube video - What is GetMeThis"
                    className="w-full h-full relative z-10 rounded-lg shadow-lg border-2 border-white bg-black"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    loading="lazy"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-lg -z-10" />
                </div>
              </div>
            </motion.div>

            <div className="space-y-8 max-w-4xl mx-auto">
              <motion.p
                className="font-monument-regular text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed tracking-wide uppercase"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Your gateway to every online market in the world.
              </motion.p>

              <motion.p
                className="font-geist-normal text-base sm:text-lg md:text-xl text-gray-600 "
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Think of it as a single, trusted bridge between you and any online store in the world. From viral
                must-haves to the rarest global finds, if it's online and legally importable.. we deliver it right to
                your doorstep with all the compliance handled seamlessly.
              </motion.p>

            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .question-float {
          animation: questionFloat 6s ease-in-out infinite;
        }
        
        @keyframes questionFloat {
          0%, 100% { 
            transform: perspective(1000px) rotateX(10deg) rotateY(-15deg) translateY(0px); 
          }
          50% { 
            transform: perspective(1000px) rotateX(10deg) rotateY(-15deg) translateY(-15px); 
          }
        }
      `}</style>
    </motion.section>
  )
}
