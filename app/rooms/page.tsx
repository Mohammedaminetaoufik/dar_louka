"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Wifi, Calendar, Loader2 } from "lucide-react"
import { BookingForm } from "@/components/booking/booking-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ImageCarousel } from "@/components/image-carousel"
import { useLanguage } from "@/components/language-provider"

async function getRooms() {
  const res = await fetch("/api/rooms", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch rooms")
  return res.json()
}

export default function RoomsPage() {
  const { t } = useLanguage()
  const roomsRef = useRef(null)
  const isRoomsInView = useInView(roomsRef, { once: true, margin: "-100px" })
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<{id: string, name: string} | null>(null)

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        setLoading(true)
        const data = await getRooms()
        console.log("Rooms fetched:", data)
        setRooms(data)
        setError(null)
      } catch (err) {
        console.error("[RoomsPage] Error loading rooms:", err)
        setError("Failed to load rooms")
      } finally {
        setLoading(false)
      }
    }

    fetchRoomsData()
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero */}
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
                backgroundImage: `url('/moroccan-luxury-bedroom-traditional-decor-atlas-mo.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-olive-900/70 via-olive-900/50 to-background" />
          </motion.div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">{t("rooms.title")}</h1>
              <p className="text-xl md:text-2xl text-sand-100">{t("rooms.subtitle")}</p>
            </motion.div>
          </div>
        </section>

        {/* Rooms Grid */}
        <section ref={roomsRef} className="py-20 bg-sand-50">
          <div className="container mx-auto px-4">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">{t("common.loading")}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700 font-semibold">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-terracotta-600 hover:bg-terracotta-700"
                >
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && rooms.length > 0 && (
              <div className="space-y-16">
                {rooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isRoomsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                        {/* Images */}
                        <div className={`relative ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                          <ImageCarousel
                            images={room.images && room.images.length > 0 ? room.images : [room.image]}
                            autoScroll
                            autoScrollInterval={5000}
                          />
                        </div>

                        {/* Content */}
                        <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">{room.name}</h2>

                          <div className="flex flex-wrap gap-4 mb-6 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {room.capacity} {t("booking.guests")}
                              </span>
                            </div>
                          </div>

                          <p className="text-muted-foreground leading-relaxed mb-6">{room.description}</p>

                          {/* Amenities */}
                          {room.amenities && room.amenities.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mb-6">
                              {room.amenities.map((amenity: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <Wifi className="h-4 w-4 text-primary" />
                                  <span>{amenity}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Price & Booking */}
                          <div className="flex items-center justify-between pt-6 border-t border-border">
                            <div>
                              <span className="text-sm text-muted-foreground">{t("rooms.from")}</span>
                              <p className="text-3xl font-bold text-primary">
                                ${room.price}
                                <span className="text-base font-normal text-muted-foreground">/{t("rooms.night")}</span>
                              </p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="lg"
                                  className="bg-terracotta-600 hover:bg-terracotta-700"
                                  onClick={() => setSelectedRoomForBooking({ id: room.id.toString(), name: room.name })}
                                >
                                  {t("rooms.book")}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="font-serif text-2xl">
                                    {t("booking.title")}
                                  </DialogTitle>
                                </DialogHeader>
                                <BookingForm 
                                  selectedRoom={selectedRoomForBooking?.id} 
                                  roomName={selectedRoomForBooking?.name}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && rooms.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">{t("common.noData")}</p>
              </div>
            )}
          </div>
        </section>

        {/* External Booking Platforms */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">{t("booking.external")}</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              You can also book your stay through our trusted partner platforms
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="lg" className="border-2 bg-transparent" onClick={() => window.open("https://booking.com", "_blank")}>
                <Calendar className="h-5 w-5 mr-2" /> Booking.com
              </Button>
              <Button variant="outline" size="lg" className="border-2 bg-transparent" onClick={() => window.open("https://airbnb.com", "_blank")}>
                <Calendar className="h-5 w-5 mr-2" /> Airbnb
              </Button>
              <Button variant="outline" size="lg" className="border-2 bg-transparent" onClick={() => window.open("https://tripadvisor.com", "_blank")}>
                <Calendar className="h-5 w-5 mr-2" /> TripAdvisor
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}