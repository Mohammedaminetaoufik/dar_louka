// app/api/ical/[token]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import ical, { ICalEventStatus, ICalEventBusyStatus } from "ical-generator"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    // Find room by iCal token
    const room = await prisma.room.findFirst({
      where: { icalToken: token },
      include: { 
        bookings: {
          where: {
            status: {
              in: ["confirmed", "pending"]
            }
          }
        }
      },
    }) as (typeof prisma.room)['findFirst'] extends (...args: any[]) => Promise<infer T> ? T & { bookings: any[] } : never

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Create iCal calendar
    const calendar = ical({ 
      name: `DAR LOUKA - ${room.name}`,
      description: `Booking calendar for ${room.name} at DAR LOUKA`,
      timezone: 'Africa/Casablanca',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/ical/${token}`,
      prodId: {
        company: 'DAR LOUKA',
        product: 'Booking System',
        language: 'EN'
      }
    })

    // Add bookings as events
    for (const booking of room.bookings) {
      calendar.createEvent({
        start: booking.checkIn,
        end: booking.checkOut,
        summary: `Réservation - ${booking.name}`,
        description: `
Booking Details:
- Guest: ${booking.name}
- Email: ${booking.email}
- Phone: ${booking.phone}
- Number of Guests: ${booking.guests || 1}
- Status: ${booking.status}
${booking.specialRequests ? `- Special Requests: ${booking.specialRequests}` : ''}
        `.trim(),
        location: 'DAR LOUKA, Tahanaout, Marrakech, Morocco',
        status: booking.status === 'confirmed' ? ICalEventStatus.CONFIRMED : ICalEventStatus.TENTATIVE,
        busystatus: ICalEventBusyStatus.BUSY,
        organizer: {
          name: 'DAR LOUKA',
          email: 'reservations@darlouka.com'
        },
        attendees: [
          {
            name: booking.name,
            email: booking.email,
            status: 'ACCEPTED' as any
          }
        ],
        created: booking.createdAt,
        lastModified: booking.updatedAt,
      })
    }

    // Return iCal format
    return new Response(calendar.toString(), {
      headers: { 
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="darlouka-${room.name.toLowerCase().replace(/\s+/g, '-')}.ics"`
      },
    })
  } catch (error) {
    console.error("iCal generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate calendar" },
      { status: 500 }
    )
  }
}
