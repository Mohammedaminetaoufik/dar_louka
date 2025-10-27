import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number.parseInt(params.id) },
    })
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }
    return NextResponse.json(room)
  } catch (error) {
    console.error("[v0] Error fetching room:", error)
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const room = await prisma.room.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        capacity: body.capacity,
        amenities: body.amenities,
        image: body.image,
        images: body.images,
      },
    })
    return NextResponse.json(room)
  } catch (error) {
    console.error("[v0] Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.room.delete({
      where: { id: Number.parseInt(params.id) },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting room:", error)
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}
