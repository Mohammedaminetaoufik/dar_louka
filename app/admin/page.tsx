"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check", { method: "GET" })
      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        router.push("/admin/login")
      }
    }
    checkAuth()
  }, [router])

  return null
}
