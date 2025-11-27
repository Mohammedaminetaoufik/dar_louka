"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500) // Wait for fade out animation
    }, 8000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 7.5 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-olive-900 via-sand-50 to-terracotta-100 flex items-center justify-center overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-10 left-10 w-96 h-96 bg-terracotta-600 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-olive-900 rounded-full blur-3xl"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut", type: "spring", stiffness: 100 }}
          className="relative w-32 h-32 md:w-48 md:h-48"
        >
          <Image
            src="/dar-louka-logo.svg"
            alt="Dar Louka"
            width={200}
            height={200}
            priority
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Text Animation */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-olive-900">
              DAR LOUKA
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className="font-serif text-xl md:text-2xl text-terracotta-600 italic">
              Atlas Retreat en Terre Berbère
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <p className="text-sm md:text-base text-olive-800">
              Authentic Moroccan Hospitality
            </p>
          </motion.div>
        </div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="flex items-center space-x-2 mt-8"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-terracotta-600 rounded-full"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-20 right-20 text-sand-900 opacity-20"
      >
        <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,10 90,90 10,90" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-20 left-20 text-olive-900 opacity-20"
      >
        <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
