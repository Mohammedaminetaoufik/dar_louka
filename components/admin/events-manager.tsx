"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Edit2, Trash2, Calendar as CalendarIcon } from "lucide-react"

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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const response = await fetch("/api/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload() {
    if (!imageFile) return null

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", imageFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image")
      return null
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.category) {
      alert("Please fill all required fields")
      return
    }

    setSaving(true)
    try {
      let imageUrl = formData.image

      // Upload new image if selected
      if (imageFile) {
        const uploadedUrl = await handleImageUpload()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      if (!imageUrl && !editingId) {
        alert("Please upload an image")
        setSaving(false)
        return
      }

      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/events/${editingId}` : "/api/events"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      })

      if (response.ok) {
        fetchEvents()
        setFormData({})
        setEditingId(null)
        setImageFile(null)
      } else {
        alert("Failed to save event")
      }
    } catch (error) {
      console.error("Error saving event:", error)
      alert("Error saving event")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await fetch(`/api/events/${id}`, { method: "DELETE" })
        fetchEvents()
      } catch (error) {
        console.error("Error deleting event:", error)
      }
    }
  }

  function handleEdit(event: Event) {
    setEditingId(event.id)
    setFormData(event)
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <div className="bg-sand-50 p-6 rounded-lg border-2 border-sand-200">
        <h2 className="text-2xl font-bold mb-6 text-olive-900">
          {editingId ? "Edit Event" : "Add New Event"}
        </h2>
        
        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label>Event Title *</Label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Atlas Mountains Hiking"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description *</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the event..."
              rows={4}
            />
          </div>

          {/* Date, Time, Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Time *</Label>
              <Input
                type="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div>
              <Label>Price (USD)</Label>
              <Input
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || undefined })}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Location and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Location *</Label>
              <Input
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Atlas Mountains"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Input
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Adventure, Cultural"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Event Image *</Label>
            <div className="space-y-3">
              {formData.image && !imageFile && (
                <div className="relative w-40 h-40">
                  <img
                    src={formData.image}
                    alt="Current event"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <p className="text-xs text-olive-600 mt-1">Current image</p>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert("File size must be less than 5MB")
                      return
                    }
                    setImageFile(file)
                  }
                }}
              />
              {imageFile && (
                <p className="text-sm text-green-600">New image selected: {imageFile.name}</p>
              )}
              <p className="text-xs text-olive-600">
                Upload a new image (max 5MB). Supported: JPG, PNG, GIF
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              className="bg-terracotta-600 hover:bg-terracotta-700"
              disabled={saving || uploading}
            >
              {saving || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                editingId ? "Update Event" : "Create Event"
              )}
            </Button>
            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(null)
                  setFormData({})
                  setImageFile(null)
                }}
                variant="outline"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-olive-900">Events List</h2>
        {events.length === 0 ? (
          <p className="text-olive-600 text-center py-8">No events yet. Create your first event above!</p>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white border border-sand-200 rounded-lg p-6 shadow-sm">
                <div className="flex gap-4">
                  {/* Event Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Event Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-olive-900 mb-2">{event.title}</h3>
                    <p className="text-olive-700 text-sm mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-olive-600">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span>Time: {event.time}</span>
                      <span>Location: {event.location}</span>
                      <span className="text-terracotta-600 font-semibold">
                        {event.price ? `$${event.price}` : "Free"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleEdit(event)}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
