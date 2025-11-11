// app/api/rooms/[id]/route.ts (Updated)
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Parse JSON fields
    const roomData = {
      ...room,
      amenities: typeof room.amenities === "string" ? JSON.parse(room.amenities) : (room.amenities ?? []),
      images: typeof room.images === "string" ? JSON.parse(room.images) : (room.images ?? []),
      icalImportUrls: typeof (room as any).icalImportUrls === "string" ? JSON.parse((room as any).icalImportUrls) : ((room as any).icalImportUrls ?? []),
    }

    return NextResponse.json(roomData)
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Prepare data with JSON stringified fields
    const updateData: any = {
      name: body.name,
      description: body.description,
      price: body.price,
      capacity: body.capacity,
      image: body.image,
    }

    if (body.amenities) {
      updateData.amenities = JSON.stringify(body.amenities)
    }

    if (body.images) {
      updateData.images = JSON.stringify(body.images)
    }

    if (body.icalImportUrls) {
      updateData.icalImportUrls = JSON.stringify(body.icalImportUrls)
    }

    const room = await prisma.room.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    })

    // Parse JSON fields for response
    const roomData = {
      ...room,
      amenities: typeof room.amenities === "string" ? JSON.parse(room.amenities) : (room.amenities ?? []),
      images: typeof room.images === "string" ? JSON.parse(room.images) : (room.images ?? []),
      icalImportUrls: typeof (room as any).icalImportUrls === "string" ? JSON.parse((room as any).icalImportUrls) : ((room as any).icalImportUrls ?? []),
    }

    return NextResponse.json(roomData)
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.room.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting room:", error)
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}