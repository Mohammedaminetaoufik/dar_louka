import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category")

    const images = await prisma.galleryImage.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(images)
  } catch (error) {
    console.error("[v0] Error fetching gallery:", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const image = await prisma.galleryImage.create({
      data: {
        titleEn: body.titleEn,
        titleFr: body.titleFr,
        descriptionEn: body.descriptionEn,
        descriptionFr: body.descriptionFr,
        image: body.image,
        category: body.category,
      },
    })
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating gallery image:", error)
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 })
  }
}
