import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching bookings...")
    const bookings = await prisma.booking.findMany({
      include: { 
        room: true,
        event: true 
      },
      orderBy: { createdAt: "desc" },
    })
    console.log("Bookings fetched:", bookings.length)
    return NextResponse.json({ bookings })
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
    console.log("[API] Received booking request:", body)

    if (!body.checkIn || !body.checkOut) {
      return NextResponse.json(
        { error: "Check-in and check-out dates are required" },
        { status: 400 }
      )
    }

    const checkIn = new Date(body.checkIn)
    const checkOut = new Date(body.checkOut)

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      )
    }

    // Validate dates
    if (body.roomId) {
      if (checkIn >= checkOut) {
        return NextResponse.json(
          { error: "Check-out date must be after check-in date" },
          { status: 400 }
        )
      }
    } else if (body.eventId) {
      // For events, checkOut can be same as checkIn (1 day event)
      if (checkIn > checkOut) {
        return NextResponse.json(
          { error: "End date cannot be before start date" },
          { status: 400 }
        )
      }
    }

    // Validate that either roomId or eventId is present
    if (!body.roomId && !body.eventId) {
      return NextResponse.json(
        { error: "Either roomId or eventId must be provided" },
        { status: 400 }
      )
    }

    // Check for booking conflicts only for room bookings
    if (body.roomId) {
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
    }

    // Validate guests
    const guests = Number(body.guests)
    if (isNaN(guests) || guests < 1) {
      return NextResponse.json(
        { error: "Invalid number of guests" },
        { status: 400 }
      )
    }

    // Create the booking
    console.log("Creating booking with data:", {
      roomId: body.roomId ? Number(body.roomId) : null,
      eventId: body.eventId ? Number(body.eventId) : null,
      checkIn,
      checkOut,
      guests,
      name: body.name,
      email: body.email,
      phone: body.phone,
      specialRequests: body.specialRequests,
      status: "pending",
    })

    const booking = await prisma.booking.create({
      data: {
        roomId: body.roomId ? Number(body.roomId) : null,
        eventId: body.eventId ? Number(body.eventId) : null,
        checkIn,
        checkOut,
        guests,
        name: body.name,
        email: body.email,
        phone: body.phone,
        specialRequests: body.specialRequests,
        status: "pending",
      },
      include: { 
        room: true,
        event: true
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking: " + (error as Error).message }, { status: 500 })
  }
}
