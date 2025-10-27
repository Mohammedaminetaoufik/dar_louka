"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Heart, Users, Leaf, Award } from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()
  const storyRef = useRef(null)
  const valuesRef = useRef(null)
  const locationRef = useRef(null)
  const isStoryInView = useInView(storyRef, { once: true, margin: "-100px" })
  const isValuesInView = useInView(valuesRef, { once: true, margin: "-100px" })
  const isLocationInView = useInView(locationRef, { once: true, margin: "-100px" })

  const values = [
    {
      icon: Heart,
      titleKey: "about.values.hospitality.title",
      descKey: "about.values.hospitality.desc",
    },
    {
      icon: Users,
      titleKey: "about.values.community.title",
      descKey: "about.values.community.desc",
    },
    {
      icon: Leaf,
      titleKey: "about.values.sustainable.title",
      descKey: "about.values.sustainable.desc",
    },
    {
      icon: Award,
      titleKey: "about.values.quality.title",
      descKey: "about.values.quality.desc",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/moroccan-riad-courtyard-traditional-architecture.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-olive-900/70 via-olive-900/50 to-background" />
          </motion.div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                {t("about.title")}
              </h1>
              <p className="text-xl md:text-2xl text-sand-100">{t("about.subtitle")}</p>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">{t("about.description")}</p>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section ref={storyRef} className="py-20 bg-sand-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">{t("about.story")}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">{t("about.story.text")}</p>
                <p className="text-lg text-muted-foreground leading-relaxed">{t("about.location.text")}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative h-[500px] rounded-lg overflow-hidden shadow-xl"
              >
                <img
                  src="/moroccan-traditional-architecture-zellige-tiles-co.jpg"
                  alt="DAR LOUKA Architecture"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section ref={valuesRef} className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{t("about.values")}</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("about.values.text")}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{t(value.titleKey)}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t(value.descKey)}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section ref={locationRef} className="py-20 bg-sand-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isLocationInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
              >
                <img
                  src="/tahanaout-morocco-atlas-mountains-village-landscap.jpg"
                  alt="Tahanaout Location"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isLocationInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {t("about.location.discover")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">{t("about.location.tahanaout")}</p>
                <p className="text-lg text-muted-foreground leading-relaxed">{t("about.location.activities")}</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
