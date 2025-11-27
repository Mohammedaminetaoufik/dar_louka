import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const roomId = parseInt(searchParams.get("roomId") || "0")
    const checkInStr = searchParams.get("checkIn")
    const checkOutStr = searchParams.get("checkOut")

    if (!roomId || !checkInStr || !checkOutStr) {
      return NextResponse.json(
        { error: "Missing required parameters: roomId, checkIn, checkOut" },
        { status: 400 }
      )
    }

    const checkIn = new Date(checkInStr)
    const checkOut = new Date(checkOutStr)

    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      )
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { in: ["confirmed", "pending"] },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
      },
    })

    if (conflictingBooking) {
      return NextResponse.json({
        available: false,
        message: "Room is not available for selected dates",
        conflictDates: {
          checkIn: conflictingBooking.checkIn,
          checkOut: conflictingBooking.checkOut,
        },
      })
    }

    // Get next available dates for the room
    const upcomingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { in: ["confirmed", "pending"] },
        checkIn: { gte: checkOut },
      },
      orderBy: { checkIn: "asc" },
      select: {
        checkIn: true,
        checkOut: true,
      },
    })

    return NextResponse.json({
      available: true,
      message: "Room is available for selected dates",
      nextBooking: upcomingBooking,
    })
  } catch (error) {
    console.error("[Availability Check] Error:", error)
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    )
  }
}
