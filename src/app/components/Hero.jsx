"use client"

import { ArrowRight, ShoppingBag, Glasses, Footprints } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import ImageCarousel from "./Imagecarousel"
import FloatingVideo from "./FloatingVideo"


const Hero = () => {
  const handleAssistedShopping = () => {
    console.log("Assisted Shopping clicked")
    // Add your assisted shopping logic here
  }

  return (
    <>
      {/* <FloatingVideo /> */}
      <motion.div
        id="hero"
        className="relative z-10 flex flex-col justify-center font-monument-ultralight overflow-hidden py-5 sm:py-5 md:py-5 lg:py-5 bg-cover bg-center"
        style={{
          perspective: "1000px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Icons */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {Array.from({ length: 20 }, (_, i) => {
            const icons = [ShoppingBag, Glasses, Footprints]
            const Icon = icons[i % icons.length]
            const size = 20 + Math.random() * 30
            return (
              <motion.div
                key={i}
                className="absolute text-slate-400 opacity-20 drop-shadow-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                }}
                animate={{
                  y: '120vh',
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 20 + Math.random() * 20,
                  repeat: Infinity,
                  delay: Math.random() * 15,
                  ease: 'linear',
                }}
              >
                <Icon size={size} />
              </motion.div>
            )
          })}
        </div>

        {/* Main Content */}
        <div
          className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 gap-4 sm:gap-6 md:gap-8 pt-16 sm:pt-20 lg:pt-24 relative z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="mx-auto max-w-6xl text-center flex flex-col justify-center items-center">
            <motion.h1
              className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-monument-regular text-black tracking-wide mb-3 sm:mb-4 md:mb-6 uppercase text-center px-2 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block sm:inline">EVERY ONLINE STORE IN THE WORLD,</span>
              <span className="block sm:inline"> NOW AT YOUR DOORSTEP. JUST SAY...</span>
            </motion.h1>

            <motion.div
              className="flex justify-center mb-4 sm:mb-6 md:mb-8"
              style={{
                transform: "translateZ(50px)",
                transformStyle: "preserve-3d",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div
                className="relative hero-float"
                style={{
                  transform: "rotateX(10deg) rotateY(-5deg)",
                }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full"
                  style={{ transform: "translateZ(1px)" }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              style={{ transform: "translateZ(30px)" }}
              className="px-2 pb-5"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <span
                className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl tracking-wide font-monument-ultrabold block"
                style={{
                  transform: "rotateX(2deg)",
                }}
              >
                GET
                <span className="text-white" style={{ WebkitTextStroke: "1px black" }}>
                  ME
                </span>
                THI
                <span className="relative">
                  S
                  <sup className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl align-super">®</sup>
                </span>
              </span>
            </motion.div>

            <motion.div
              className="flex justify-center flex-col items-center w-full px-2 sm:px-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <ImageCarousel
                ariaLabel="Showcase products"
                className="mt-2 w-full"
                slides={[
                  {
                    src: "/images/watch.png",
                    alt: "Popular gadget from Amazon USA",
                    caption: "Gadgets from amazon.com (USA)",
                  },
                  {
                    src: "/images/shoe.png",
                    alt: "Limited edition eyewear from Japan",
                    caption: "eyewear from Japan",
                  },
                  {
                    src: "/images/bag.png",
                    alt: "Luxury Fashion from Italy",
                    caption: "Luxury Fashion from Italy",
                  }
                ]}
              />
            </motion.div>

            <div
              className="flex justify-center mt-4 sm:mt-6 md:mt-8"
              style={{
                transform: "translateZ(80px)",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="relative hero-hand-float"
                style={{
                  transform: "rotateX(-5deg) rotateY(10deg) rotateZ(-2deg)",
                }}
              >
                <div
                  className="absolute top-1/4 left-1/3 w-4 sm:w-6 md:w-8 h-8 sm:h-12 md:h-16 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full blur-sm"
                  style={{ transform: "translateZ(2px) rotateZ(45deg)" }}
                ></div>
                <div
                  className="absolute top-1/2 right-1/3 w-3 sm:w-4 md:w-6 h-6 sm:h-8 md:h-12 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full blur-sm"
                  style={{ transform: "translateZ(2px) rotateZ(-30deg)" }}
                ></div>
              </div>
            </div>
          </div>

          <motion.div
            className="mx-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p
              className="text-xs sm:text-sm md:text-base text-black font-monument-regular leading-relaxed text-center uppercase tracking-wide sm:tracking-widest"
              style={{
                textShadow: "0 1px 2px rgba(0,0,0,0.15)",
              }}
            >
              Paste any product link and relax.
              <br />

            </p>
            <span className="text-xs sm:text-sm text-black  text-center mt-2 sm:mt-3 md:mt-4 font-geist-medium leading-relaxed tracking-normal block">
              We handle the entire process sourcing, shipping, customs, duties and deliver it right to your doorstep.
            </span>
          </motion.div>

          {/* <motion.p
            className="text-xs sm:text-sm text-gray-700 font-monument-ultralight text-center mt-3 sm:mt-4 uppercase leading-relaxed tracking-normal px-4 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <span className="block sm:inline">10+ YEARS OF CROSSBORDER TRADE EXPERIENCE</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">1 MILLION+ ORDERS FULFILLED SUCCESSFULLY</span>
          </motion.p> */}
        </div>

        <style jsx>{`
        .hero-float {
          animation: heroFloat 6s ease-in-out infinite;
        }
        
        .hero-hand-float {
          animation: heroHandFloat 8s ease-in-out infinite;
        }
        
        @keyframes heroFloat {
          0%, 100% { 
            transform: rotateX(10deg) rotateY(-5deg) translateY(0px) translateZ(20px); 
          }
          50% { 
            transform: rotateX(15deg) rotateY(5deg) translateY(-20px) translateZ(30px); 
          }
        }
        
        @keyframes heroHandFloat {
          0%, 100% { 
            transform: rotateX(-5deg) rotateY(10deg) rotateZ(-2deg) translateY(0px) translateZ(40px); 
          }
          33% { 
            transform: rotateX(-2deg) rotateY(15deg) rotateZ(1deg) translateY(-15px) translateZ(50px); 
          }
          66% { 
            transform: rotateX(-8deg) rotateY(5deg) rotateZ(-4deg) translateY(-10px) translateZ(35px); 
          }
        }
      `}</style>
      </motion.div>
    </>
  )
}

export default Hero
