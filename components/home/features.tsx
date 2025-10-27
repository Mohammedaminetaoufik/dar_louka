"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Home, Mountain, Sparkles, MapPin } from "lucide-react"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function Features() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Home,
      titleKey: "features.authentic.title",
      descKey: "features.authentic.desc",
      color: "terracotta",
    },
    {
      icon: Mountain,
      titleKey: "features.nature.title",
      descKey: "features.nature.desc",
      color: "olive",
    },
    {
      icon: Sparkles,
      titleKey: "features.comfort.title",
      descKey: "features.comfort.desc",
      color: "moroccan-blue",
    },
    {
      icon: MapPin,
      titleKey: "features.location.title",
      descKey: "features.location.desc",
      color: "sand",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="features" ref={ref} className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            {t("features.title")}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div key={index} variants={itemVariants} className="group">
                <div className="bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-border hover:border-primary">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">{t(feature.titleKey)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
