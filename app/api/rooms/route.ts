import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(rooms)
  } catch (error) {
    console.error("[v0] Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const room = await prisma.room.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        capacity: body.capacity,
        amenities: body.amenities || [],
        image: body.image,
        images: body.images || [],
      },
    })
    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
