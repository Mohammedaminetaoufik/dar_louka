"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface EventBookingDialogProps {
  event: {
    id: number
    titleEn: string
    titleFr: string
    startDate: string
    endDate?: string
    type: "ONE_DAY" | "THREE_DAYS"
    price?: number
  }
  trigger?: React.ReactNode
}

export function EventBookingDialog({ event, trigger }: EventBookingDialogProps) {
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "1",
    specialRequests: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!form.name.trim()) {
      setError(t("booking.form.error.name"))
      return false
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(t("booking.form.error.email"))
      return false
    }
    if (!form.phone.trim()) {
      setError(t("booking.form.error.phone"))
      return false
    }
    const guests = parseInt(form.guests)
    if (isNaN(guests) || guests < 1) {
      setError(t("booking.form.error.guests") || "Invalid number of guests")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          checkIn: event.startDate,
          checkOut: event.endDate || event.startDate, // For 1-day events, checkOut is same as checkIn or handled by backend logic
          guests: parseInt(form.guests),
          name: form.name,
          email: form.email,
          phone: form.phone,
          specialRequests: form.specialRequests || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Booking failed")
      }

      setSuccess(true)
      setForm({
        name: "",
        email: "",
        phone: "",
        guests: "1",
        specialRequests: "",
      })
    } catch (err: any) {
      setError(err.message || t("booking.form.error.title"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{t("rooms.book")}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{language === 'fr' ? event.titleFr : event.titleEn}</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-8 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-olive-900">{t("booking.form.success.title")}</h3>
              <p className="text-olive-700">
                {t("booking.form.success.message").replace("{email}", form.email)}
              </p>
              <Button onClick={() => setOpen(false)} className="mt-4">
                {t("common.close")}
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("booking.form.fullName")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("booking.form.placeholder.name")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("booking.form.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t("booking.form.placeholder.email")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("booking.form.phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t("booking.form.placeholder.phone")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">{t("booking.form.guests")}</Label>
                  <Input
                    id="guests"
                    name="guests"
                    type="number"
                    min="1"
                    max={event.type === "THREE_DAYS" ? "4" : "2"} // Based on user request: 1-4 for 3 days, 1-2 for 1 day
                    value={form.guests}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">{t("booking.form.specialRequests")}</Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleChange}
                    placeholder={t("booking.form.placeholder.requests")}
                    rows={3}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("booking.form.sending")}
                    </>
                  ) : (
                    t("booking.form.submit")
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  {t("booking.form.required")}
                </p>
              </div>
            </form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
