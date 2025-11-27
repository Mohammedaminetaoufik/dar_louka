import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const bookings = await prisma.booking.findMany({
      include: { room: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

// Helper function to check for booking conflicts
async function checkBookingConflict(
  roomId: number,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: number
) {
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      roomId,
      status: { in: ["confirmed", "pending"] },
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      AND: [
        { checkIn: { lt: checkOut } }, // Booking starts before our checkout
        { checkOut: { gt: checkIn } }, // Booking ends after our checkin
      ],
    },
  })
  return conflictingBooking
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const checkIn = new Date(body.checkIn)
    const checkOut = new Date(body.checkOut)

    // Validate dates
    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      )
    }

    // Check for booking conflicts
    const conflict = await checkBookingConflict(body.roomId, checkIn, checkOut)

    if (conflict) {
      return NextResponse.json(
        {
          error: "Room is not available for the selected dates",
          conflictDates: {
            checkIn: conflict.checkIn,
            checkOut: conflict.checkOut,
          },
          availableAlternatives: "Please select different dates or try another room",
        },
        { status: 409 } // 409 Conflict status code
      )
    }

    // Create the booking if no conflicts
    const booking = await prisma.booking.create({
      data: {
        roomId: body.roomId,
        checkIn,
        checkOut,
        guests: body.guests,
        name: body.name,
        email: body.email,
        phone: body.phone,
        specialRequests: body.specialRequests,
        status: "pending",
      },
      include: { room: true },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
