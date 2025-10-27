import { type NextRequest, NextResponse } from "next/server"

export function withAdminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = req.cookies.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(req)
  }
}
