"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BookingFormProps {
  selectedRoom?: string
  roomName?: string
}

export function BookingForm({ selectedRoom, roomName }: BookingFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "1",
    checkIn: "",
    checkOut: "",
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
      setError("Please enter your name")
      return false
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!form.phone.trim()) {
      setError("Please enter your phone number")
      return false
    }
    if (!form.checkIn) {
      setError("Please select check-in date")
      return false
    }
    if (!form.checkOut) {
      setError("Please select check-out date")
      return false
    }
    if (new Date(form.checkIn) >= new Date(form.checkOut)) {
      setError("Check-out date must be after check-in date")
      return false
    }
    if (new Date(form.checkIn) < new Date()) {
      setError("Check-in date cannot be in the past")
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
          roomId: parseInt(selectedRoom || "1"),
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: parseInt(form.guests),
          name: form.name,
          email: form.email,
          phone: form.phone,
          specialRequests: form.specialRequests || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking")
      }

      setSuccess(true)
      setForm({
        name: "",
        email: "",
        phone: "",
        guests: "1",
        checkIn: "",
        checkOut: "",
        specialRequests: "",
      })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error("Booking error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const minCheckout = form.checkIn 
    ? new Date(new Date(form.checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : today

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {roomName && (
        <div className="bg-sand-50 p-4 rounded-lg border border-sand-200">
          <p className="text-sm text-olive-700 font-semibold">Booking for:</p>
          <p className="text-lg font-serif text-olive-900">{roomName}</p>
        </div>
      )}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
          >
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Booking Request Sent!</p>
              <p className="text-sm text-green-700 mt-1">
                Thank you! We'll contact you shortly at {form.email} to confirm.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            disabled={loading}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            disabled={loading}
            className="h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+212 XXX XXX XXX"
            required
            disabled={loading}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Number of Guests *</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            max="10"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            required
            disabled={loading}
            className="h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="checkIn">Check-In Date *</Label>
          <Input
            id="checkIn"
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            min={today}
            required
            disabled={loading}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkOut">Check-Out Date *</Label>
          <Input
            id="checkOut"
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            min={minCheckout}
            required
            disabled={loading}
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
        <Textarea
          id="specialRequests"
          name="specialRequests"
          value={form.specialRequests}
          onChange={handleChange}
          placeholder="Any special requirements or requests..."
          disabled={loading}
          rows={4}
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-terracotta-600 hover:bg-terracotta-700 h-12 text-base font-semibold"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Sending Request...
          </>
        ) : (
          "Submit Booking Request"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        * Required fields. By submitting, you agree to our booking terms.
      </p>
    </form>
  )
}