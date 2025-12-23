import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
    })
    
    const response = NextResponse.json(events)
    response.headers.set('Cache-Control', 'public, max-age=30, s-maxage=30, stale-while-revalidate=60')
    return response
  } catch (error) {
    console.error("[v0] Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = await prisma.event.create({
      data: {
        titleEn: body.titleEn,
        titleFr: body.titleFr,
        descriptionEn: body.descriptionEn,
        descriptionFr: body.descriptionFr,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        type: body.type,
        programEn: body.programEn,
        programFr: body.programFr,
        maxParticipants: body.maxParticipants ? Number(body.maxParticipants) : null,
        image: body.image,
        price: body.price ? Number(body.price) : null,
      },
    })

    // If it's a 3-day event (Forfait), block all rooms for the duration
    if (body.type === "THREE_DAYS") {
      const rooms = await prisma.room.findMany()
      const checkIn = new Date(body.startDate)
      const checkOut = body.endDate 
        ? new Date(body.endDate) 
        : new Date(checkIn.getTime() + 3 * 24 * 60 * 60 * 1000) // Default to 3 days if not specified

      const blockingBookings = rooms.map(room => ({
        roomId: room.id,
        eventId: event.id, // Link to the event so deleting the event removes the blocks
        checkIn,
        checkOut,
        guests: 1,
        name: `Event Block: ${body.titleEn}`,
        email: "admin@darlouka.com",
        phone: "0000000000",
        status: "confirmed",
        specialRequests: "Automatically blocked for event"
      }))

      if (blockingBookings.length > 0) {
        await prisma.booking.createMany({
          data: blockingBookings
        })
      }
    }

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
