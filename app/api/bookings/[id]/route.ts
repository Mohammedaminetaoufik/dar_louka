import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: { room: true },
    })
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }
    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const booking = await prisma.booking.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        status: body.status,
        specialRequests: body.specialRequests,
      },
      include: { room: true },
    })
    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.booking.delete({
      where: { id: Number.parseInt(params.id) },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting booking:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
