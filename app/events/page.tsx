"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Calendar, Loader2, Users, Clock } from "lucide-react"
import { EventBookingDialog } from "@/components/booking/event-booking-dialog"

export interface Event {
  id: number
  titleEn: string
  titleFr: string
  descriptionEn: string
  descriptionFr: string
  startDate: string
  endDate?: string
  type: "ONE_DAY" | "THREE_DAYS"
  programEn?: string
  programFr?: string
  maxParticipants?: number
  price?: number
  image: string
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
        const response = await fetch("/api/events", { 
          cache: "default"
        })
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isActivitiesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                      {event.image && (
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={language === 'fr' ? event.titleFr : event.titleEn}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-olive-900">
                            {event.type === "THREE_DAYS" ? (language === 'fr' ? "3 Nuits" : "3 Nights") : (language === 'fr' ? "1 Jour" : "1 Day")}
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString(language === 'fr' ? "fr-FR" : "en-US")}
                              {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString(language === 'fr' ? "fr-FR" : "en-US")}`}
                            </span>
                          </div>
                          {event.maxParticipants && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{event.maxParticipants} {language === 'fr' ? "pers max" : "max pers"}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
                          {language === 'fr' ? event.titleFr : event.titleEn}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {language === 'fr' ? event.descriptionFr : event.descriptionEn}
                        </p>

                        {(language === 'fr' ? event.programFr : event.programEn) && (
                          <div className="mt-auto bg-sand-50 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2 text-olive-900 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {language === 'fr' ? "Programme" : "Itinerary"}
                            </h4>
                            <div className="text-sm text-olive-800 whitespace-pre-line">
                              {language === 'fr' ? event.programFr : event.programEn}
                            </div>
                          </div>
                        )}

                        <div className="mt-auto pt-4 border-t border-sand-200 flex justify-between items-center">
                          {event.price && (
                            <div className="text-2xl font-bold text-primary">
                              {event.price.toLocaleString(language === 'fr' ? "fr-FR" : "en-US")} {language === 'fr' ? "DH/pers" : "MAD/pers"}
                            </div>
                          )}
                          <EventBookingDialog event={event} />
                        </div>
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
