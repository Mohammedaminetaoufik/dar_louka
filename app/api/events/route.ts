import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    })
    return NextResponse.json(events)
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
        title: body.title,
        description: body.description,
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
