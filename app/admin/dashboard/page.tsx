"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {RoomsManager}  from "@/components/admin/rooms-manager"
import { EventsManager } from "@/components/admin/events-manager"
import { GalleryManager } from "@/components/admin/gallery-manager"
import { BookingsManager } from "@/components/admin/bookings-manager"
import { LogOut } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"rooms" | "events" | "gallery" | "bookings">("rooms")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check", { method: "GET" })
      if (!response.ok) {
        router.push("/admin/login")
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    setLoading(true)
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-white border-b border-sand-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-terracotta-600">DAR LOUKA Admin</h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
          >
            <LogOut size={18} />
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-sand-200 overflow-x-auto">
          {["rooms", "events", "gallery", "bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "text-terracotta-600 border-b-2 border-terracotta-600"
                  : "text-olive-700 hover:text-terracotta-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === "rooms" && <RoomsManager />}
          {activeTab === "events" && <EventsManager />}
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "bookings" && <BookingsManager />}
        </div>
      </main>
    </div>
  )
}
