"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Calendar, Loader2 } from "lucide-react"

export interface Event {
  id: number
  titleEn: string
  titleFr: string
  descriptionEn: string
  descriptionFr: string
  date: string
  price?: number
  image?: string
}

export default function EventsPage() {
  const { t, language } = useLanguage()
  const activitiesRef = useRef(null)
  const isActivitiesInView = useInView(activitiesRef, { once: true, margin: "-100px" })
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/events")
        if (!response.ok) throw new Error("Failed to fetch events")
        const data: Event[] = await response.json()
        setEvents(data)
        setError(null)
      } catch (err) {
        console.error("[v0] Error loading events:", err)
        setError("Failed to load events")
      } finally {
        setLoading(false)
      }
    }

    fetchEventsData()
  }, [])

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
                backgroundImage: `url('/atlas-mountains-hiking-morocco-adventure.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-olive-900/70 via-olive-900/50 to-background" />
          </motion.div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                {t("events.title")}
              </h1>
              <p className="text-xl md:text-2xl text-sand-100">{t("events.subtitle")}</p>
            </motion.div>
          </div>
        </section>

        {/* Events Section */}
        <section ref={activitiesRef} className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isActivitiesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t("events.activities")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("events.activitiesDesc")}</p>
            </motion.div>

            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">{t("loading.events")}</span>
              </div>
            )}

            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>}

            {!loading && events.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isActivitiesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                      {event.image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={language === 'fr' ? event.titleFr : event.titleEn}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
  {new Date(event.date).toLocaleDateString("fr-FR")}
</span>
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                          {language === 'fr' ? event.titleFr : event.titleEn}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                          {language === 'fr' ? event.descriptionFr : event.descriptionEn}
                        </p>
                        {event.price && <p className="text-primary font-semibold">{event.price.toLocaleString("fr-FR")} DH</p>}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && events.length === 0 && !error && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">{t("common.noData")}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
