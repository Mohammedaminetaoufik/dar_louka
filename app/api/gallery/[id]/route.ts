import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const image = await prisma.galleryImage.findUnique({
      where: { id: Number.parseInt(params.id) },
    })
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }
    return NextResponse.json(image)
  } catch (error) {
    console.error("[v0] Error fetching gallery image:", error)
    return NextResponse.json({ error: "Failed to fetch gallery image" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const image = await prisma.galleryImage.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        titleEn: body.titleEn,
        titleFr: body.titleFr,
        descriptionEn: body.descriptionEn,
        descriptionFr: body.descriptionFr,
        image: body.image,
        category: body.category,
      },
    })
    return NextResponse.json(image)
  } catch (error) {
    console.error("[v0] Error updating gallery image:", error)
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.galleryImage.delete({
      where: { id: Number.parseInt(params.id) },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting gallery image:", error)
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 })
  }
}
