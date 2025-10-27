"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your email service
    alert(`Thank you for your message! We'll get back to you soon.\n\nName: ${formData.name}\nEmail: ${formData.email}`)
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/tahanaout-morocco-atlas-mountains-village-landscap.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-olive-900/70 via-olive-900/50 to-background" />
          </motion.div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                {t("contact.title")}
              </h1>
              <p className="text-xl md:text-2xl text-sand-100">{t("contact.subtitle")}</p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">{t("contact.info")}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  We're here to help you plan your perfect stay in the Atlas Mountains. Reach out to us with any
                  questions or special requests.
                </p>

                <div className="space-y-6">
                  {/* Address */}
                  <Card className="border-l-4 border-l-terracotta-600">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-terracotta-100 rounded-lg">
                          <MapPin className="h-6 w-6 text-terracotta-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Address</h3>
                          <p className="text-muted-foreground">
                            Douar Ait Souka, Tahanaout
                            <br />
                            Marrakech-Safi, Morocco
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Phone */}
                  <Card className="border-l-4 border-l-moroccan-blue-600">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-moroccan-blue-100 rounded-lg">
                          <Phone className="h-6 w-6 text-moroccan-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                          <p className="text-muted-foreground">
                            +212 524 48 XX XX
                            <br />
                            +212 6XX XX XX XX
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email */}
                  <Card className="border-l-4 border-l-olive-600">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-olive-100 rounded-lg">
                          <Mail className="h-6 w-6 text-olive-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Email</h3>
                          <p className="text-muted-foreground">
                            info@darlouka.com
                            <br />
                            reservations@darlouka.com
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hours */}
                  <Card className="border-l-4 border-l-sand-600">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-sand-100 rounded-lg">
                          <Clock className="h-6 w-6 text-sand-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Reception Hours</h3>
                          <p className="text-muted-foreground">
                            Monday - Sunday: 8:00 AM - 10:00 PM
                            <br />
                            24/7 Emergency Contact Available
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="font-serif text-3xl font-bold text-foreground mb-6">{t("contact.form")}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+212 XXX XXX XXX"
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your inquiry or special requests..."
                          required
                          rows={6}
                          className="resize-none"
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full bg-terracotta-600 hover:bg-terracotta-700 h-12">
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-sand-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("contact.location")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Located in the heart of Tahanaout, just 30 minutes from Marrakech, surrounded by the majestic Atlas
                Mountains
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106489.3!2d-7.9!3d31.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakech%2C%20Morocco!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DAR LOUKA Location"
              />
            </motion.div>

            {/* Directions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-foreground mb-2">From Marrakech Airport</h3>
                  <p className="text-muted-foreground">45 minutes drive (40 km)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-foreground mb-2">From Marrakech Medina</h3>
                  <p className="text-muted-foreground">30 minutes drive (30 km)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-foreground mb-2">To Ourika Valley</h3>
                  <p className="text-muted-foreground">20 minutes drive (15 km)</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
