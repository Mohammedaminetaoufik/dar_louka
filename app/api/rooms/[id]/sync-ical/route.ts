// app/api/rooms/[id]/sync-ical/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { parseICS } from "node-ical"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const safeParseJSON = (str: string | null | undefined): string[] => {
  if (!str) return []
  try {
    const parsed = JSON.parse(str)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = Number.parseInt(params.id)
    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 })
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    })

    const icalImportUrls = safeParseJSON(room?.icalImportUrls)

    if (!icalImportUrls?.length) {
      return NextResponse.json({ bookingsImported: 0, message: "No iCal URLs configured" })
    }

    let totalImported = 0
    for (const url of icalImportUrls) {
      try {
        const res = await fetch(url)
        if (!res.ok) continue

        const icsText = await res.text()
        const events = await new Promise<any[]>((resolve, reject) => {
          parseICS(icsText, (err, data) => {
            if (err) return reject(err)
            resolve(Object.values(data).filter((e) => e.type === "VEVENT") as any[])
          })
        })

        for (const event of events) {
          // Skip if already imported
          const exists = await prisma.booking.findFirst({
            where: {
              roomId,
              checkIn: new Date(event.start),
              checkOut: new Date(event.end),
              OR: [
                { bookingComId: event.uid?.includes("booking.com") ? event.uid : undefined },
                { airbnbId: event.uid?.includes("airbnb") ? event.uid : undefined },
                { tripadvisorId: event.uid?.includes("tripadvisor") ? event.uid : undefined },
              ],
            },
          })

          if (exists) continue

          const summary = event.summary?.toLowerCase() || ""
          const isRental = /reserv|booking|not available|occupied|closed/i.test(summary) || true // Assume all events in availability calendar are bookings

          if (event.start && event.end) {
            console.log(`[Sync] Importing event: ${event.summary} (${event.start} - ${event.end})`)

            await prisma.booking.create({
              data: {
                roomId,
                checkIn: new Date(event.start),
                checkOut: new Date(event.end),
                guests: 2, // fallback
                name: event.description ? `Imported: ${event.summary}` : "External Guest",
                email: "external@darlouka.com",
                phone: "+212000000000",
                status: "confirmed",
                externalStatus: "imported",
                bookingComId: event.uid?.includes("booking.com") ? event.uid : `ext-${event.uid}`, // Ensure unique ID if not specific platform
                airbnbId: event.uid?.includes("airbnb") ? event.uid : null,
                tripadvisorId: event.uid?.includes("tripadvisor") ? event.uid : null,
                specialRequests: `Imported via iCal from ${url}. Summary: ${event.summary}`,
              },
            })
            totalImported++
          }
        }
      } catch (e) {
        console.warn(`Failed to sync from ${url}:`, e)
      }
    }

    return NextResponse.json({ bookingsImported: totalImported })
  } catch (error) {
    console.error("[Sync iCal] Error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
