// app/api/rooms/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = parseInt(params.id)
    if (isNaN(roomId)) {
      return NextResponse.json({ error: 'Invalid room ID' }, { status: 400 })
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // ✅ Return full room including icalToken (safe for admin-only use)
    return NextResponse.json(room)
  } catch (error) {
    console.error('[GET /api/rooms/:id] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 })
  }
}

// Optional: Add PUT if you want to update room via API (not required for UI fix)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = parseInt(params.id)
    if (isNaN(roomId)) {
      return NextResponse.json({ error: 'Invalid room ID' }, { status: 400 })
    }

    const body = await req.json()

    // 🔹 Validate input (reuse from your existing validateRoomPayload)
    const errors: string[] = []
    if (typeof body.name !== 'string' || !body.name.trim()) {
      errors.push('`name` is required and must be a non-empty string')
    }
    if (typeof body.price !== 'number' || body.price < 0) {
      errors.push('`price` is required and must be a non-negative number')
    }
    if (typeof body.capacity !== 'number' || body.capacity <= 0) {
      errors.push('`capacity` is required and must be a positive integer')
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 })
    }

    const room = await prisma.room.update({
      where: { id: roomId },
      data: {
        name: body.name?.trim(),
        description: body.description?.trim() ?? null,
        price: body.price,
        capacity: Math.floor(body.capacity),
        image: body.image?.trim() ?? null,
        amenities: JSON.stringify(body.amenities || []),
        images: JSON.stringify(body.images || []),
        icalImportUrls: body.icalImportUrls ? JSON.stringify(body.icalImportUrls) : null,
        // ✅ Preserve icalToken unless explicitly updated
        ...(body.icalToken && { icalToken: body.icalToken }),
      },
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error('[PUT /api/rooms/:id] Error:', error)
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 })
  }
}