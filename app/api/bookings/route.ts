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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const booking = await prisma.booking.create({
      data: {
        roomId: body.roomId,
        checkIn: new Date(body.checkIn),
        checkOut: new Date(body.checkOut),
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
