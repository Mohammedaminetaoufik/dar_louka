import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        subject: body.subject,
        message: body.message,
      },
    })
    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error("[v0] Error submitting contact form:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
