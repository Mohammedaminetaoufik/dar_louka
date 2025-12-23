"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mail, MessageCircle, Phone, CheckCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"

interface BookingConfirmationProps {
  booking: {
    id: string
    name: string
    email: string
    phone: string
    checkIn: string
    checkOut: string
    guests: number
    roomName?: string
    eventName?: string
  }
}

type ConfirmationMethod = "email" | "whatsapp" | "phone"
type Language = "en" | "fr"

const confirmationTemplates = {
  en: {
    email: {
      subject: "Booking Confirmation - Dar Louka",
      greeting: "Dear {name},",
      body: `We are delighted to confirm your booking at Dar Louka, our authentic guesthouse in Tahanaout, Marrakech.`,
      bookingDetails: "Booking Details:",
      room: "Room:",
      checkIn: "Check-In Date:",
      checkOut: "Check-Out Date:",
      guests: "Number of Guests:",
      checkInTime: "Check-in Time: 2:00 PM",
      checkOutTime: "Check-out Time: 11:00 AM",
      specialInfo: "Special Information:",
      directions: "Directions from Marrakech Airport: 45 minutes drive (40 km)",
      contactInfo: "If you have any questions, please don't hesitate to contact us:",
      phone: "Phone:",
      location: "Location: Douar Ait Souka, Tahanaout, Marrakech-Safi, Morocco",
      looking: "We look forward to welcoming you to Dar Louka - Atlas Retreat en Terre Berbère.",
      closing: "Best regards,",
      team: "Dar Louka Team",
    },
    whatsapp: {
      message: `Hello {name}! 👋\n\nWe're thrilled to confirm your booking at Dar Louka! 🏠\n\n📅 Check-In: {checkIn}\n📅 Check-Out: {checkOut}\n👥 Guests: {guests}\n🏨 Room: {roomName}\n\nCheck-in time: 2:00 PM\nCheck-out time: 11:00 AM\n\nWe can't wait to welcome you to our authentic Moroccan guesthouse! If you have any questions, feel free to reach out.\n\nWarm regards,\nDar Louka Team 🌿`,
    },
    phone: {
      message: `Hello {name}, this is a confirmation call from Dar Louka guesthouse in Tahanaout, Marrakech. We're calling to confirm your booking from {checkIn} to {checkOut} for {guests} guests in the {roomName}. Please confirm if you received your booking details via email. Thank you!`,
    },
  },
  fr: {
    email: {
      subject: "Confirmation de Réservation - Dar Louka",
      greeting: "Chère {name},",
      body: `Nous sommes ravis de confirmer votre réservation à Dar Louka, notre authentique maison d'hôte à Tahanaout, Marrakech.`,
      bookingDetails: "Détails de la Réservation:",
      room: "Chambre:",
      checkIn: "Date d'Arrivée:",
      checkOut: "Date de Départ:",
      guests: "Nombre d'Invités:",
      checkInTime: "Heure d'Arrivée: 14:00",
      checkOutTime: "Heure de Départ: 11:00",
      specialInfo: "Informations Spéciales:",
      directions: "Directions depuis l'aéroport de Marrakech: 45 minutes de route (40 km)",
      contactInfo: "Si vous avez des questions, n'hésitez pas à nous contacter:",
      phone: "Téléphone:",
      location: "Adresse: Douar Ait Souka, Tahanaout, Marrakech-Safi, Maroc",
      looking: "Nous avons hâte de vous accueillir à Dar Louka - Atlas Retreat en Terre Berbère.",
      closing: "Cordialement,",
      team: "Équipe Dar Louka",
    },
    whatsapp: {
      message: `Bonjour {name}! 👋\n\nNous sommes ravis de confirmer votre réservation à Dar Louka! 🏠\n\n📅 Arrivée: {checkIn}\n📅 Départ: {checkOut}\n👥 Invités: {guests}\n🏨 Chambre: {roomName}\n\nHeure d'arrivée: 14:00\nHeure de départ: 11:00\n\nNous avons hâte de vous accueillir dans notre authentique maison d'hôte marocaine! Si vous avez des questions, n'hésitez pas à nous contacter.\n\nCordialement,\nÉquipe Dar Louka 🌿`,
    },
    phone: {
      message: `Bonjour {name}, c'est un appel de confirmation de la maison d'hôte Dar Louka à Tahanaout, Marrakech. Nous appelons pour confirmer votre réservation du {checkIn} au {checkOut} pour {guests} invités dans la {roomName}. Veuillez confirmer si vous avez reçu vos détails de réservation par email. Merci!`,
    },
  },
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const { t } = useLanguage()
  const [language, setLanguage] = useState<Language>("fr")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<ConfirmationMethod | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEmailContent = () => {
    const template = confirmationTemplates[language].email
    const checkInDate = formatDate(booking.checkIn)
    const checkOutDate = formatDate(booking.checkOut)
    
    const itemLabel = booking.eventName ? (language === 'fr' ? "Événement:" : "Event:") : template.room
    const itemName = booking.eventName || booking.roomName || "Standard Room"

    return {
      subject: template.subject,
      html: `
        <!DOCTYPE html>
        <html dir="${language === "fr" ? "ltr" : "ltr"}">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f9f7f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #C9A176 0%, #D4AF9A 100%); padding: 40px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 32px; font-weight: bold; }
            .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 40px; }
            .greeting { font-size: 18px; margin-bottom: 20px; color: #333; }
            .body-text { color: #555; margin-bottom: 20px; }
            .details-box { background-color: #f5f3f0; border-left: 4px solid #D4AF9A; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0d7d0; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { font-weight: bold; color: #333; }
            .detail-value { color: #666; }
            .info-box { background-color: #f0f5f0; border-left: 4px solid #1F7B3A; padding: 15px; margin: 20px 0; border-radius: 8px; }
            .info-box p { margin: 5px 0; font-size: 14px; }
            .contact-info { background-color: #f9f7f4; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .footer { background-color: #f5f3f0; padding: 30px 20px; text-align: center; border-top: 1px solid #e0d7d0; }
            .footer p { margin: 5px 0; font-size: 13px; color: #666; }
            .logo-text { font-size: 24px; font-weight: bold; color: #D4AF9A; margin-top: 10px; }
            .cta-button { display: inline-block; background-color: #D4AF9A; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Dar Louka</h1>
              <p>Atlas Retreat en Terre Berbère</p>
            </div>
            <div class="content">
              <p class="greeting">${template.greeting.replace("{name}", booking.name)}</p>
              <p class="body-text">${template.body}</p>
              
              <div class="details-box">
                <p style="font-weight: bold; margin-top: 0; color: #333;">${template.bookingDetails}</p>
                <div class="detail-row">
                  <span class="detail-label">${itemLabel}</span>
                  <span class="detail-value">${itemName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">${template.checkIn}</span>
                  <span class="detail-value">${checkInDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">${template.checkOut}</span>
                  <span class="detail-value">${checkOutDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">${template.guests}</span>
                  <span class="detail-value">${booking.guests}</span>
                </div>
              </div>

              <div class="info-box">
                <p style="font-weight: bold; color: #1F7B3A;">${template.specialInfo}</p>
                <p>${template.checkInTime}</p>
                <p>${template.checkOutTime}</p>
                <p>${template.directions}</p>
              </div>

              <div class="contact-info">
                <p style="font-weight: bold; color: #333;">${template.contactInfo}</p>
                <p>${template.phone} +212 5XX XXX XXX</p>
                <p>${template.location}</p>
              </div>

              <p class="body-text">${template.looking}</p>
              <p class="body-text">${template.closing}<br><strong>${template.team}</strong></p>
            </div>
            <div class="footer">
              <div class="logo-text">Dar Louka</div>
              <p>Tahanaout, Marrakech, Morocco</p>
              <p style="margin-top: 15px; font-size: 12px;">© 2025 Dar Louka. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }
  }

  const getWhatsAppMessage = () => {
    const template = confirmationTemplates[language].whatsapp.message
    return template
      .replace("{name}", booking.name)
      .replace("{checkIn}", formatDate(booking.checkIn))
      .replace("{checkOut}", formatDate(booking.checkOut))
      .replace("{guests}", booking.guests.toString())
      .replace("{roomName}", booking.eventName || booking.roomName || "Standard Room")
  }

  const getPhoneMessage = () => {
    const template = confirmationTemplates[language].phone.message
    return template
      .replace("{name}", booking.name)
      .replace("{checkIn}", formatDate(booking.checkIn))
      .replace("{checkOut}", formatDate(booking.checkOut))
      .replace("{guests}", booking.guests.toString())
      .replace("{roomName}", booking.eventName || booking.roomName || "Standard Room")
  }

  const handleSendConfirmation = async (method: ConfirmationMethod) => {
    setLoading(true)
    setSelectedMethod(method)

    try {
      const payload =
        method === "email"
          ? getEmailContent()
          : method === "whatsapp"
            ? { message: getWhatsAppMessage(), phone: booking.phone }
            : { message: getPhoneMessage(), phone: booking.phone }

      const response = await fetch(`/api/bookings/${booking.id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          language,
          ...payload,
        }),
      })

      if (!response.ok) throw new Error("Failed to send confirmation")

      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch (error) {
      console.error("Confirmation error:", error)
      alert(t("admin.confirmation.error"))
    } finally {
      setLoading(false)
      setSelectedMethod(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setLanguage("en")}
          className={`px-3 py-1 rounded text-sm ${language === "en" ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("fr")}
          className={`px-3 py-1 rounded text-sm ${language === "fr" ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          FR
        </button>
      </div>

      {sent && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-50 border border-green-200 rounded p-3 flex items-center gap-2 text-sm text-green-700"
        >
          <CheckCircle className="h-4 w-4" />
          {t("admin.confirmation.success")}
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Email Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              disabled={loading}
            >
              <Mail className="h-4 w-4" />
              {t("admin.confirmation.emailBtn")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {t("admin.confirmation.emailPreview")}
              </DialogTitle>
            </DialogHeader>
            <div
              className="border rounded p-4 bg-white h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: getEmailContent().html }}
            />
            <Button
              onClick={() => handleSendConfirmation("email")}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading && selectedMethod === "email" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("admin.confirmation.sending")}
                </>
              ) : (
                t("admin.confirmation.sendEmailBtn")
              )}
            </Button>
          </DialogContent>
        </Dialog>

        {/* WhatsApp Button */}
        <Button
          onClick={() => {
            const message = getWhatsAppMessage()
            window.open(`https://wa.me/${booking.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank")
          }}
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          disabled={loading}
        >
          <MessageCircle className="h-4 w-4" />
          {t("admin.confirmation.whatsappBtn")}
        </Button>

        {/* Phone Button */}
        <Button
          onClick={() => {
            const message = getPhoneMessage()
            alert(
              `${language === "en" ? "Call message to read:" : "Message à lire lors de l'appel:"}\n\n${message}`
            )
            window.open(`tel:${booking.phone}`, "_blank")
          }}
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          disabled={loading}
        >
          <Phone className="h-4 w-4" />
          {t("admin.confirmation.callBtn")}
        </Button>
      </div>
    </div>
  )
}
