import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
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
        date: new Date(body.date),
        time: body.time,
        location: body.location,
        category: body.category,
        image: body.image,
        price: body.price,
      },
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
