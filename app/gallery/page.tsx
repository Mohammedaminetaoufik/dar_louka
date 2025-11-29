"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2, X } from "lucide-react"

export interface GalleryImage {
  id: number
  titleEn: string
  titleFr: string
  descriptionEn: string
  descriptionFr: string
  category: string
  image: string
}

export default function GalleryPage() {
  const { t, language } = useLanguage()
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Fetch gallery data
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/gallery")
        if (!res.ok) throw new Error("Failed to fetch gallery")
        const data: GalleryImage[] = await res.json()
        setGalleryImages(data)
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Failed to load gallery")
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

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
            style={{ backgroundImage: `url('/moroccan-courtyard-fountain-traditional-tiles-suns.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-olive-900/70 via-olive-900/50 to-background" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
              {t("gallery.title")}
            </h1>
            <p className="text-xl md:text-2xl text-sand-100">{t("gallery.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">{t("loading.gallery")}</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">{t("common.noData")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => setSelectedImage(image.image)}
                >
                  <img
                    src={image.image}
                    alt={language === 'fr' ? image.titleFr : image.titleEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-olive-900/80 via-olive-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-semibold text-lg">
                        {language === 'fr' ? image.titleFr : image.titleEn}
                      </p>
                      <p className="text-sand-200 text-sm">{image.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-0">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-sand-200 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Gallery Image"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
