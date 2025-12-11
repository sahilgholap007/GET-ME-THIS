"use client"

import { useState, useEffect } from "react"

const SimpleCarousel = () => {
  const images = [
    "/images/chrome-game-controller.png",
    "/images/watch.png",
    "/images/specs.png",
    "/images/shoe.png",
    "/images/sneaker.png",
    "/images/headphones.png",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="w-80 h-80 lg:w-96 lg:h-96 max-sm:w-64 max-sm:h-64 relative overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image || "/placeholder.svg"}
            alt={`Product ${index + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  )
}

export default SimpleCarousel
