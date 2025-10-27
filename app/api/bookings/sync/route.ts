import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { BookingPlatformManager } from "@/lib/booking-platforms"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const platformManager = new BookingPlatformManager({
      bookingCom: {
        apiKey: process.env.BOOKING_COM_API_KEY || "",
        propertyId: process.env.BOOKING_COM_PROPERTY_ID || "",
      },
      airbnb: {
        apiKey: process.env.AIRBNB_API_KEY || "",
        listingId: process.env.AIRBNB_LISTING_ID || "",
      },
      tripadvisor: {
        apiKey: process.env.TRIPADVISOR_API_KEY || "",
        propertyId: process.env.TRIPADVISOR_PROPERTY_ID || "",
      },
    })

    const bookingData = {
      checkIn: booking.checkIn.toISOString().split("T")[0],
      checkOut: booking.checkOut.toISOString().split("T")[0],
      guests: booking.guests,
      name: booking.name,
      email: booking.email,
    }

    // Sync to all platforms
    const [bookingComId, airbnbId, tripadvisorId] = await Promise.all([
      platformManager.syncToBookingCom(bookingData),
      platformManager.syncToAirbnb(bookingData),
      platformManager.syncToTripAdvisor(bookingData),
    ])

    // Update booking with external IDs
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        bookingComId: bookingComId || undefined,
        airbnbId: airbnbId || undefined,
        tripadvisorId: tripadvisorId || undefined,
        externalStatus: "synced",
      },
    })

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      synced: {
        bookingCom: !!bookingComId,
        airbnb: !!airbnbId,
        tripadvisor: !!tripadvisorId,
      },
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
