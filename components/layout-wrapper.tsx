"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [showSplash, setShowSplash] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user has visited before
    const hasVisited = localStorage.getItem('dar-louka-visited')
    if (!hasVisited) {
      // First visit - show splash screen
      setShowSplash(true)
      localStorage.setItem('dar-louka-visited', 'true')
    }
  }, [])

  // Prevent hydration mismatch
  if (!isClient) {
    return <>{children}</>
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {children}
    </>
  )
}
