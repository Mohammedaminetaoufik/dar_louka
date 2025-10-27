"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  image: string
  price?: number
}

export function EventsManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Event>>({})

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("[v0] Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/events/${editingId}` : "/api/events"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchEvents()
        setFormData({})
        setEditingId(null)
      }
    } catch (error) {
      console.error("[v0] Error saving event:", error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure?")) {
      try {
        await fetch(`/api/events/${id}`, { method: "DELETE" })
        fetchEvents()
      } catch (error) {
        console.error("[v0] Error deleting event:", error)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-sand-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Event" : "Add New Event"}</h2>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Event title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Location</Label>
              <Input
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Location"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category"
              />
            </div>
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={formData.image || ""}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Image URL"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-terracotta-600 hover:bg-terracotta-700">
              {editingId ? "Update" : "Create"}
            </Button>
            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(null)
                  setFormData({})
                }}
                variant="outline"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Events List</h2>
        {events.map((event) => (
          <div key={event.id} className="border border-sand-200 rounded-lg p-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-olive-700">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-sm text-olive-600">{event.location}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEditingId(event.id)
                  setFormData(event)
                }}
                variant="outline"
              >
                Edit
              </Button>
              <Button onClick={() => handleDelete(event.id)} variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
