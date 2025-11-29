"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { key: "nav.home", href: "/" },
    { key: "nav.about", href: "/about" },
    { key: "nav.rooms", href: "/rooms" },
    { key: "nav.events", href: "/events" },
    { key: "nav.gallery", href: "/gallery" },
    { key: "nav.contact", href: "/contact" },
  ]

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
  ]

  const handleNavClick = () => {
    setIsSidebarOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/98 backdrop-blur-xl shadow-2xl border-b border-primary/10" 
            : "bg-gradient-to-b from-black/40 to-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div whileHover={{ scale: 1.08 }} className="w-14 h-14 md:w-16 md:h-16 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src="/dar-louka-logo.svg"
                  alt="Dar Louka Logo"
                  width={64}
                  height={64}
                  className="w-full h-full relative z-10"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="font-serif text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent hidden sm:block tracking-wide">
                DAR LOUKA
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="relative px-4 py-2 text-foreground font-medium text-sm uppercase tracking-widest transition-all duration-300 group"
                >
                  <span className="relative z-10">{t(item.key)}</span>
                  <motion.div 
                    className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
            </nav>

            {/* Language Switcher & Sidebar Toggle */}
            <div className="flex items-center space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative hover:bg-primary/10 rounded-full transition-colors"
                  >
                    <Globe className="h-5 w-5 text-primary" />
                    <span className="absolute inset-0 rounded-full border border-primary/20" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-primary/20">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`font-medium transition-all ${
                        language === lang.code ? "bg-primary/20 text-primary" : ""
                      }`}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sidebar Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden relative hover:bg-primary/10 rounded-full transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6 text-primary" />
                ) : (
                  <Menu className="h-6 w-6 text-primary" />
                )}
                <span className="absolute inset-0 rounded-full border border-primary/20" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />

            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-background/98 to-background/95 backdrop-blur-xl border-r border-primary/10 z-30 lg:hidden overflow-y-auto pt-28"
            >
              <nav className="px-6 py-8 flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={handleNavClick}
                    className="relative text-lg text-foreground hover:text-primary transition-colors duration-200 font-medium py-3 px-4 rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 group overflow-hidden"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">{t(item.key)}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
