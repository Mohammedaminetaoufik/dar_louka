"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Users, Wifi, Loader2 } from "lucide-react"
import { ImageCarousel } from "@/components/image-carousel"

export interface Room {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  images?: string[] // multiple images
  image: string // fallback single image
}

export function RoomPreview() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const response = await fetch("/api/rooms")
        if (!response.ok) throw new Error("Failed to fetch rooms")
        const data: Room[] = await response.json()
        setRooms(data.slice(0, 3)) // show only first 3
      } catch (err) {
        console.error("[v0] Error loading rooms:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoomsData()
  }, [])

  return (
    <section ref={ref} className="py-20 md:py-32 bg-sand-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            {t("rooms.title")}
          </h2>
          <p className="text-xl text-muted-foreground">{t("rooms.subtitle")}</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                    <div className="relative h-64 overflow-hidden">
                      <ImageCarousel
                        images={room.images && room.images.length > 0 ? room.images : [room.image]}
                        autoScroll={true}
                        autoScrollInterval={5000}
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">{room.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <Users className="h-4 w-4" />
                        <span>
                          {room.capacity} {t("booking.guests")}
                        </span>
                      </div>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="text-xs bg-muted px-3 py-1 rounded-full flex items-center gap-1">
                              <Wifi className="h-3 w-3" />
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">{t("rooms.from")}</span>
                          <p className="text-2xl font-bold text-primary">
                            ${room.price}
                            <span className="text-sm font-normal text-muted-foreground">/{t("rooms.night")}</span>
                          </p>
                        </div>
                        <Link href="/rooms">
                          <Button className="bg-primary hover:bg-primary/90">{t("rooms.book")}</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <Link href="/rooms">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  {t("rooms.availability")}
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
