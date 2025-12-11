"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const faqs = [
    {
      question: "How does Assisted Shopping work?",
      answer:
        "Paste the link, get a quote, confirm payment, and we purchase, inspect, clear customs, and deliver. You track everything online.",
    },
    {
      question: "What countries can I shop from?",
      answer: "USA, UK, Germany, Japan, and more. If a store ships to our address, we can forward it to you.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Express is 3 to 7 days. Standard is 7 to 14 days. Some items need extra time due to stock or export checks.",
    },
    {
      question: "Are there any restrictions?",
      answer:
        "We do not ship prohibited items like hazardous materials, weapons, flammables, certain batteries, or restricted pharmaceuticals. We follow Indian import laws and origin-country rules.",
    },
    {
      question: "How much does it cost?",
      answer: "You see product cost, shipping, duties, insurance, and service fees upfront before paying.",
    },
    {
      question: "What if my package is damaged or lost?",
      answer: "All shipments are insured. We assist with claims and replacements based on carrier terms.",
    },
    {
      question: "Can I track my order?",
      answer: "Yes. Real-time tracking from purchase to delivery.",
    },
    {
      question: "Do you handle customs clearance?",
      answer: "Yes. We manage documentation, declarations, and duties. You get a clear invoice for records.",
    },
  ]

  return (
    <motion.section
      ref={ref}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-20 left-4 sm:left-20 w-32 h-32 sm:w-40 sm:h-40 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-4 sm:right-20 w-24 h-24 sm:w-32 sm:h-32 bg-accent/5 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-monument-ultrabold text-foreground mb-4 sm:mb-6 uppercase tracking-wide px-2"
            initial={{ opacity: 0, y: -50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            F.A.Q
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl font-monument-ultralight text-muted-foreground uppercase tracking-wide max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Everything you need to know about our services
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <motion.div
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="w-full p-4 sm:p-6 md:p-8 text-left font-monument-regular text-foreground hover:bg-muted/50 transition-colors flex justify-between items-center uppercase tracking-wide group-hover:text-primary"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-sm sm:text-base md:text-lg pr-4">{faq.question}</span>
                  <motion.span
                    className={`text-2xl sm:text-3xl transition-transform duration-300 flex-shrink-0 ${openIndex === index ? "rotate-45 text-primary" : "text-muted-foreground group-hover:text-primary"}`}
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    +
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 text-muted-foreground font-giest leading-relaxed border-t border-border bg-muted/20"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="pt-4 sm:pt-6 text-sm sm:text-base"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {faq.answer}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
