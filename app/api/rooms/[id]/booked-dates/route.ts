import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all booked dates for a specific room
export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = parseInt(params.roomId)

    if (!roomId) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 })
    }

    // Get all confirmed and pending bookings for the room
    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: { in: ["confirmed", "pending"] },
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
        name: true,
      },
      orderBy: { checkIn: "asc" },
    })

    // Get room details
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        name: true,
        price: true,
      },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Generate list of booked date ranges
    const bookedDateRanges = bookings.map((booking) => ({
      id: booking.id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: booking.status,
      guestName: booking.name,
    }))

    return NextResponse.json({
      room,
      totalBookings: bookings.length,
      bookedDateRanges,
      message: `${bookings.length} booking(s) found for this room`,
    })
  } catch (error) {
    console.error("[Booked Dates] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch booked dates" },
      { status: 500 }
    )
  }
}
