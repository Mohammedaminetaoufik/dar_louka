"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Room {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  image: string
}

export function RoomsManager() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Room>>({})

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    try {
      const response = await fetch("/api/rooms")
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error("[v0] Error fetching rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/rooms/${editingId}` : "/api/rooms"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchRooms()
        setFormData({})
        setEditingId(null)
      }
    } catch (error) {
      console.error("[v0] Error saving room:", error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure?")) {
      try {
        await fetch(`/api/rooms/${id}`, { method: "DELETE" })
        fetchRooms()
      } catch (error) {
        console.error("[v0] Error deleting room:", error)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-sand-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Room" : "Add New Room"}</h2>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Room name"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Room description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="Price"
              />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={formData.capacity || ""}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                placeholder="Capacity"
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
        <h2 className="text-2xl font-bold">Rooms List</h2>
        {rooms.map((room) => (
          <div key={room.id} className="border border-sand-200 rounded-lg p-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{room.name}</h3>
              <p className="text-olive-700">${room.price} per night</p>
              <p className="text-sm text-olive-600">Capacity: {room.capacity} guests</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEditingId(room.id)
                  setFormData(room)
                }}
                variant="outline"
              >
                Edit
              </Button>
              <Button onClick={() => handleDelete(room.id)} variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}