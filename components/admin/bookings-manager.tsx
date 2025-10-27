"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Booking {
  id: number
  roomId: number
  checkIn: string
  checkOut: string
  guests: number
  name: string
  email: string
  phone: string
  status: string
  room: { name: string }
}

export function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      const response = await fetch("/api/bookings")
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error("[v0] Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      fetchBookings()
    } catch (error) {
      console.error("[v0] Error updating booking:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bookings</h2>
      {bookings.map((booking) => (
        <div key={booking.id} className="border border-sand-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-olive-600">Room</p>
              <p className="font-bold">{booking.room.name}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600">Guest</p>
              <p className="font-bold">{booking.name}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600">Check-in</p>
              <p className="font-bold">{new Date(booking.checkIn).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600">Check-out</p>
              <p className="font-bold">{new Date(booking.checkOut).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600">Email</p>
              <p className="font-bold">{booking.email}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600">Phone</p>
              <p className="font-bold">{booking.phone}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => updateStatus(booking.id, "confirmed")}
              className={booking.status === "confirmed" ? "bg-green-600" : "bg-sand-200"}
            >
              Confirm
            </Button>
            <Button
              onClick={() => updateStatus(booking.id, "pending")}
              className={booking.status === "pending" ? "bg-yellow-600" : "bg-sand-200"}
            >
              Pending
            </Button>
            <Button
              onClick={() => updateStatus(booking.id, "cancelled")}
              className={booking.status === "cancelled" ? "bg-red-600" : "bg-sand-200"}
            >
              Cancel
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
