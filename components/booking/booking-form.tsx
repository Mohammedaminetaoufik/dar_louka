"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export function BookingForm({ selectedRoom }: { selectedRoom?: string }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    checkIn: "",
    checkOut: "",
    specialRequests: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          roomId: selectedRoom,
        }),
      })

      if (!res.ok) throw new Error("Failed to create booking")

      setSuccess("Your booking request has been sent successfully!")
      setForm({
        name: "",
        email: "",
        phone: "",
        guests: 1,
        checkIn: "",
        checkOut: "",
        specialRequests: "",
      })
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && <div className="text-green-600">{success}</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="checkIn">Check-In</Label>
          <Input id="checkIn" type="date" name="checkIn" value={form.checkIn} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="checkOut">Check-Out</Label>
          <Input id="checkOut" type="date" name="checkOut" value={form.checkOut} onChange={handleChange} required />
        </div>
      </div>

      <div>
        <Label htmlFor="guests">Guests</Label>
        <Input id="guests" type="number" min="1" name="guests" value={form.guests} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea id="specialRequests" name="specialRequests" value={form.specialRequests} onChange={handleChange} />
      </div>

      <Button type="submit" className="w-full bg-terracotta-600 hover:bg-terracotta-700" disabled={loading}>
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Book Now"}
      </Button>
    </form>
  )
}
