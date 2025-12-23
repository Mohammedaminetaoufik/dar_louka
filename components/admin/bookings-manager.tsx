"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookingConfirmation } from "@/components/admin/booking-confirmation"
import { useLanguage } from "@/components/language-provider"

interface Booking {
  id: string
  roomId: number
  checkIn: string
  checkOut: string
  guests: number
  name: string
  email: string
  phone: string
  status: string
  room: { nameEn: string; nameFr: string }
}

export function BookingsManager() {
  const { t } = useLanguage()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      const response = await fetch("/api/bookings")
      const data = await response.json()
      
      const bookingsList = data.bookings || (Array.isArray(data) ? data : [])
      
      if (!Array.isArray(bookingsList)) {
        console.error("Expected array of bookings but got:", data)
        return
      }

      // Filter for room bookings only
      const roomBookings = bookingsList.filter((booking: any) => booking.roomId !== null)
      setBookings(roomBookings)
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

  if (loading) return <div>{t("admin.loading")}</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t("admin.bookings.title")}</h2>
      {bookings.map((booking) => (
        <div key={booking.id} className="border border-sand-200 rounded-lg p-6 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-olive-600 font-semibold">{t("admin.bookings.room")}</p>
              <p className="font-bold text-lg">{booking.room.nameEn}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600 font-semibold">{t("admin.bookings.guest")}</p>
              <p className="font-bold text-lg">{booking.name}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600 font-semibold">{t("admin.bookings.guests")}</p>
              <p className="font-bold text-lg">{booking.guests}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600 font-semibold">{t("admin.bookings.checkIn")}</p>
              <p className="font-bold">{new Date(booking.checkIn).toLocaleDateString("fr-FR")}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600 font-semibold">{t("admin.bookings.checkOut")}</p>
              <p className="font-bold">{new Date(booking.checkOut).toLocaleDateString("fr-FR")}</p>
            </div>
            <div>
              <p className="text-sm text-olive-600 font-semibold">{t("admin.bookings.status")}</p>
              <p className={`font-bold ${booking.status === "confirmed" ? "text-green-600" : booking.status === "pending" ? "text-yellow-600" : "text-red-600"}`}>
                {booking.status === "confirmed" ? t("admin.bookings.confirmed") : booking.status === "pending" ? t("admin.bookings.pending") : t("admin.bookings.cancelled")}
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div>
              <p className="text-sm font-semibold text-olive-700 mb-2">{t("admin.bookings.contact")}:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-sand-50 p-3 rounded">
                  <span className="font-semibold">{t("admin.bookings.email")}:</span>
                  <span>{booking.email}</span>
                </div>
                <div className="flex items-center gap-2 bg-sand-50 p-3 rounded">
                  <span className="font-semibold">{t("admin.bookings.phone")}:</span>
                  <span>{booking.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-olive-700 mb-3">{t("admin.bookings.sendConfirmation")}:</p>
              <BookingConfirmation
                booking={{
                  id: booking.id,
                  name: booking.name,
                  email: booking.email,
                  phone: booking.phone,
                  checkIn: booking.checkIn,
                  checkOut: booking.checkOut,
                  guests: booking.guests,
                  roomName: booking.room.nameEn,
                }}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6 pt-4 border-t">
            <Button
              onClick={() => updateStatus(booking.id, "confirmed")}
              className={booking.status === "confirmed" ? "bg-green-600 hover:bg-green-700" : "bg-sand-200 hover:bg-sand-300"}
            >
              {t("admin.bookings.confirmAction")}
            </Button>
            <Button
              onClick={() => updateStatus(booking.id, "pending")}
              className={booking.status === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-sand-200 hover:bg-sand-300"}
            >
              {t("admin.bookings.pendingAction")}
            </Button>
            <Button
              onClick={() => updateStatus(booking.id, "cancelled")}
              className={booking.status === "cancelled" ? "bg-red-600 hover:bg-red-700" : "bg-sand-200 hover:bg-sand-300"}
            >
              {t("admin.bookings.cancelAction")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
