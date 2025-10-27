"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function CallToAction() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/moroccan-courtyard-fountain-traditional-tiles-suns.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-olive-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">{t("cta.title")}</h2>
          <p className="text-xl text-sand-100 mb-8 max-w-2xl mx-auto">{t("cta.subtitle")}</p>
          {/* </CHANGE> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/rooms">
              <Button size="lg" className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-6 text-lg">
                {t("hero.cta")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-olive-900 px-8 py-6 text-lg bg-transparent"
              >
                {t("contact.title")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
