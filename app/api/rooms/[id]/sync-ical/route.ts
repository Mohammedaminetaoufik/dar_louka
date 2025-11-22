// app/api/rooms/[id]/sync-ical/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { parseICS } from 'node-ical'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = parseInt(params.id)
    if (isNaN(roomId)) {
      return NextResponse.json({ error: 'Invalid room ID' }, { status: 400 })
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    })

    const icalImportUrls = (room as any)?.icalImportUrls as string[] | undefined

    if (!icalImportUrls?.length) {
      return NextResponse.json({ bookingsImported: 0 })
    }

    let totalImported = 0
    for (const url of icalImportUrls) {
      try {
        const res = await fetch(url)
        if (!res.ok) continue
        if (!res.ok) continue

        const icsText = await res.text()
        const events = await new Promise<any[]>((resolve, reject) => {
          parseICS(icsText, (err, data) => {
            if (err) return reject(err)
            resolve(Object.values(data).filter(e => e.type === 'VEVENT') as any[])
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
                { bookingComId: event.uid?.includes('booking.com') ? event.uid : undefined },
                { airbnbId: event.uid?.includes('airbnb') ? event.uid : undefined },
              ]
            }
          })

          if (exists) continue

          const summary = event.summary?.toLowerCase() || ''
          const isRental = /reserv|booking|booking\.com|airbnb|tripadvisor/i.test(summary)

          if (isRental && event.start && event.end) {
            await prisma.booking.create({
              data: {
                roomId,
                checkIn: new Date(event.start),
                checkOut: new Date(event.end),
                guests: 2, // fallback — or parse from description
                name: event.description ? 'External Guest' : 'External Guest',
                email: 'external@darlouka.com',
                phone: '+212XXXXXXXX',
                status: 'confirmed',
                externalStatus: 'imported',
                bookingComId: event.uid?.includes('booking.com') ? event.uid : null,
                airbnbId: event.uid?.includes('airbnb') ? event.uid : null,
                tripadvisorId: event.uid?.includes('tripadvisor') ? event.uid : null,
                specialRequests: event.description || null,
              }
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
    console.error('[Sync iCal] Error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}