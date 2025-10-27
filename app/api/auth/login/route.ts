import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { verifyPassword } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin || password !== admin.password) {
  return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
}


    const response = NextResponse.json(
      { success: true, admin: { id: admin.id, email: admin.email, name: admin.name } },
      { status: 200 },
    )

    response.cookies.set("admin_token", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
