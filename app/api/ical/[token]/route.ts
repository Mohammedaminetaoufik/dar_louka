import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import ical from "ical-generator"

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const { token } = params

  const room = await prisma.room.findFirst({
    where: { icalToken: token },
    include: { bookings: true },
  })

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 })
  }

  const calendar = ical({ name: `Darlouka - ${room.name}` })

  for (const booking of room.bookings) {
    calendar.createEvent({
      start: booking.checkIn,
      end: booking.checkOut,
      summary: `Réservation - ${booking.name}`,
      description: `Clients: ${booking.guests || 1}`,
    })
  }

  return new Response(calendar.toString(), {
    headers: { "Content-Type": "text/calendar" },
  })
}
