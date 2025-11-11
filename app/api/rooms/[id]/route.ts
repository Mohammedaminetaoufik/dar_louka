import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"


const prisma = new PrismaClient()

// GET — Liste toutes les chambres
export async function GET(request: NextRequest) {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(rooms)
  } catch (error) {
    console.error("[GET /api/rooms] Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

// POST — Crée une nouvelle chambre
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 🔹 Génère un token iCal unique pour chaque chambre
    const icalToken = crypto.randomBytes(16).toString("hex")

    const room = await prisma.room.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        capacity: body.capacity,
        amenities: body.amenities || [],
        image: body.image,
        images: body.images || [],
        icalToken, // 🔹 pour ton export iCal
        icalImportUrls: body.icalImportUrls || [], // 🔹 Booking/TripAdvisor URLs
      },
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error("[POST /api/rooms] Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
