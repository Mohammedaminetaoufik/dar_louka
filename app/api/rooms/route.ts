// app/api/rooms/route.ts
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
// 🔹 Helper: Safe JSON parsing (avoids crash on invalid/malformed JSON)
const safeParseJSON = (str: string | null | undefined): unknown[] => {
  if (!str) return []
  try {
    const parsed = JSON.parse(str)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn("[JSON Parse] Invalid JSON string:", str)
    return []
  }
}

// 🔹 Helper: Validate room creation payload
const validateRoomPayload = (body: any) => {
  const errors: string[] = []

  if (typeof body.nameEn !== "string" || !body.nameEn.trim()) {
    errors.push("`nameEn` is required and must be a non-empty string")
  }
  if (typeof body.nameFr !== "string" || !body.nameFr.trim()) {
    errors.push("`nameFr` is required and must be a non-empty string")
  }
  if (typeof body.descriptionEn !== "string" || !body.descriptionEn.trim()) {
    errors.push("`descriptionEn` is required and must be a non-empty string")
  }
  if (typeof body.descriptionFr !== "string" || !body.descriptionFr.trim()) {
    errors.push("`descriptionFr` is required and must be a non-empty string")
  }
  if (typeof body.price !== "number" || body.price < 0) {
    errors.push("`price` is required and must be a non-negative number")
  }
  if (typeof body.capacity !== "number" || body.capacity <= 0) {
    errors.push("`capacity` is required and must be a positive integer")
  }

  return errors
}

// 🔹 Serialize room for public API response (hide sensitive fields like icalToken in list)
const serializeRoom = (room: any, includeToken = false) => {
  const base = {
    id: room.id,
    nameEn: room.nameEn,
    nameFr: room.nameFr,
    descriptionEn: room.descriptionEn ?? null,
    descriptionFr: room.descriptionFr ?? null,
    price: room.price,
    capacity: room.capacity,
    image: room.image ?? null,
    amenities: safeParseJSON(room.amenities),
    images: safeParseJSON(room.images),
    icalImportUrls: safeParseJSON(room.icalImportUrls),
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  }

  if (includeToken) {
    return { ...base, icalToken: room.icalToken }
  }

  return base
}

// GET — List all rooms (hide icalToken for security)
export async function GET() {
  try {
    console.log("[v0] GET /api/rooms - Fetching rooms from database")
    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
    })

    console.log("[v0] Found rooms:", rooms.length)
    const serializedRooms = rooms.map((room) => serializeRoom(room, false))
    return NextResponse.json(serializedRooms)
  } catch (error) {
    console.error("[GET /api/rooms] Error:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

// POST — Create new room with auto-generated iCal token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 🔹 Validate input
    const validationErrors = validateRoomPayload(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 })
    }

    // 🔹 Generate unique iCal token
    const icalToken = crypto.randomBytes(16).toString("hex")

    // 🔹 Prepare data with JSON-stringified fields
    const roomData = {
      nameEn: body.nameEn.trim(),
      nameFr: body.nameFr.trim(),
      descriptionEn: body.descriptionEn?.trim() ?? null,
      descriptionFr: body.descriptionFr?.trim() ?? null,
      price: body.price,
      capacity: Math.floor(body.capacity),
      image: body.image?.trim() ?? null,
      amenities: JSON.stringify(body.amenities || []),
      images: JSON.stringify(body.images || []),
      icalImportUrls: body.icalImportUrls ? JSON.stringify(body.icalImportUrls) : null,
      icalToken,
    }

    const room = await prisma.room.create({ data: roomData })

    // 🔹 Respond with full room (including icalToken — only safe here, on create)
    const serializedRoom = serializeRoom(room, true)
    return NextResponse.json(serializedRoom, { status: 201 })
  } catch (error: any) {
    console.error("[POST /api/rooms] Error:", error)

    // 🔹 Handle Prisma unique constraint error (icalToken collision — extremely rare)
    if (error.code === "P2002" && error.meta?.target?.includes("icalToken")) {
      return NextResponse.json({ error: "Token generation conflict. Please retry." }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
