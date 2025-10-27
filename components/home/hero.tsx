"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/moroccan-guesthouse-tahanaout-atlas-mountains-trad.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-olive-900/60 via-olive-900/40 to-background" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 text-balance">
            {t("hero.title")}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-sand-100 mb-4 font-serif">{t("hero.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-base md:text-lg text-sand-200 mb-8 max-w-2xl mx-auto text-pretty">
            {t("hero.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/rooms">
            <Button size="lg" className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-6 text-lg">
              {t("hero.cta")}
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-olive-900 px-8 py-6 text-lg bg-transparent"
            >
              {t("hero.explore")}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="cursor-pointer"
          onClick={() => {
            document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          <ChevronDown className="h-8 w-8 text-white" />
        </motion.div>
      </motion.div>
    </section>
  )
}
