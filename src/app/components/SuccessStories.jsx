"use client"

import { useState, useEffect } from "react"

export default function SuccessStories() {
  const stories = [
    {
      quote:
        "Got my dream camera from Japan in 10 days. The process was smooth and the team helped me pick the right model.",
      author: "Priya Sharma, Mumbai",
      savings: "Saved ₹25,000 on Sony A7R V",
      rating: 5,
    },
    {
      quote: "Saved ₹15,000 on a laptop from the US. Packaging was perfect and delivery was on time.",
      author: "Rahul Kumar, Delhi",
      savings: "MacBook Pro 16-inch",
      rating: 5,
    },
    {
      quote: "Five orders and every one has been flawless. Great updates and support.",
      author: "Anita Patel, Bengaluru",
      savings: "Nike limited edition shoes",
      rating: 5,
    }
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
    }, 4000)

    return () => clearInterval(interval)
  }, [maxSlides])

  return (
    <></>
  )
}
