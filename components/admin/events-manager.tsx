"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Edit2, Trash2, Calendar as CalendarIcon } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface Event {
  id: number
  titleEn: string
  titleFr: string
  descriptionEn: string
  descriptionFr: string
  startDate: string
  endDate?: string
  type: "ONE_DAY" | "THREE_DAYS"
  programEn?: string
  programFr?: string
  maxParticipants?: number
  price?: number
  image: string
}

export function EventsManager() {
  const { t } = useLanguage()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Event>>({ type: "ONE_DAY" })
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
      setEvents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching events:", error)
      setEvents([])
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
    if (!formData.titleEn || !formData.titleFr || !formData.descriptionEn || !formData.descriptionFr || !formData.startDate || !formData.type) {
      alert(t("admin.events.fillRequired"))
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
        alert(t("admin.events.uploadRequired"))
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
          // Ensure numbers are sent as numbers
          price: formData.price ? Number(formData.price) : null,
          maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : null,
        }),
      })

      if (response.ok) {
        fetchEvents()
        setFormData({ type: "ONE_DAY" })
        setEditingId(null)
        setImageFile(null)
      } else {
        alert(t("admin.events.saveFailed"))
      }
    } catch (error) {
      console.error("Error saving event:", error)
      alert(t("admin.events.error"))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (confirm(t("admin.events.confirmDelete"))) {
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
    setFormData({
      ...event,
      startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
    })
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
          {editingId ? t("admin.events.edit") : t("admin.events.add")}
        </h2>
        
        <div className="space-y-6">
          {/* Type Selection */}
          <div>
            <Label>Type *</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.type || "ONE_DAY"}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as "ONE_DAY" | "THREE_DAYS" })}
            >
              <option value="ONE_DAY">Forfait 1 Jour</option>
              <option value="THREE_DAYS">Forfait 3 Nuits</option>
            </select>
          </div>

          {/* Title - English and French */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("admin.events.title")} (English) *</Label>
              <Input
                value={formData.titleEn || ""}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="e.g. 3-Night Package"
              />
            </div>
            <div>
              <Label>{t("admin.events.title")} (Français) *</Label>
              <Input
                value={formData.titleFr || ""}
                onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                placeholder="e.g. Forfait 3 Nuits"
              />
            </div>
          </div>

          {/* Description - English and French */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("admin.events.description")} (English) *</Label>
              <Textarea
                value={formData.descriptionEn || ""}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                placeholder="Package description..."
                rows={4}
              />
            </div>
            <div>
              <Label>{t("admin.events.description")} (Français) *</Label>
              <Textarea
                value={formData.descriptionFr || ""}
                onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                placeholder="Description du forfait..."
                rows={4}
              />
            </div>
          </div>

          {/* Program / Itinerary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Program / Itinerary (English)</Label>
              <Textarea
                value={formData.programEn || ""}
                onChange={(e) => setFormData({ ...formData, programEn: e.target.value })}
                placeholder="Day 1: ... Day 2: ..."
                rows={6}
              />
            </div>
            <div>
              <Label>Programme / Itinéraire (Français)</Label>
              <Textarea
                value={formData.programFr || ""}
                onChange={(e) => setFormData({ ...formData, programFr: e.target.value })}
                placeholder="Jour 1: ... Jour 2: ..."
                rows={6}
              />
            </div>
          </div>

          {/* Date, Price, Participants */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>{t("admin.events.date")} (Start) *</Label>
              <Input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            {formData.type === "THREE_DAYS" && (
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            )}
            <div>
              <Label>{t("admin.events.price")} (MAD/EUR)</Label>
              <Input
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || undefined })}
              />
            </div>
            <div>
              <Label>Max Participants</Label>
              <Input
                type="number"
                value={formData.maxParticipants || ""}
                onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) || undefined })}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>{t("admin.events.image")} *</Label>
            <div className="space-y-3">
              {formData.image && !imageFile && (
                <div className="relative w-40 h-40">
                  <img
                    src={formData.image}
                    alt="Current event"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <p className="text-xs text-olive-600 mt-1">{t("admin.events.currentImage")}</p>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert(t("admin.events.fileTooLarge"))
                      return
                    }
                    setImageFile(file)
                  }
                }}
              />
              {imageFile && (
                <p className="text-sm text-green-600">{t("admin.events.newImageSelected")}: {imageFile.name}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              className="bg-primary hover:bg-primary/90"
              disabled={saving || uploading}
            >
              {saving || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploading ? t("admin.events.uploading") : t("admin.events.saving")}
                </>
              ) : (
                editingId ? t("admin.events.update") : t("admin.events.create")
              )}
            </Button>
            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(null)
                  setFormData({ type: "ONE_DAY" })
                  setImageFile(null)
                }}
                variant="outline"
              >
                {t("admin.rooms.cancel")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-olive-900">{t("admin.events.list")}</h2>
        {events.length === 0 ? (
          <p className="text-olive-600 text-center py-8">{t("admin.events.noEvents")}</p>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white border border-sand-200 rounded-lg p-6 shadow-sm">
                <div className="flex gap-4">
                  {/* Event Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.titleEn}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-olive-900">{event.titleEn}</h3>
                        <p className="text-sm text-gray-600">{event.titleFr}</p>
                      </div>
                      <span className="px-2 py-1 bg-sand-100 text-olive-800 text-xs rounded-full">
                        {event.type === "THREE_DAYS" ? "3 Days" : "1 Day"}
                      </span>
                    </div>
                    <p className="text-olive-700 text-sm mb-2 line-clamp-2">{event.descriptionEn}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-olive-600">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(event.startDate).toLocaleDateString("fr-FR")}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString("fr-FR")}`}
                      </span>
                      <span className="text-primary font-semibold">
                        {event.price ? `${event.price.toLocaleString("fr-FR")} €` : t("admin.events.free")}
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
                      {t("admin.rooms.edit")}
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t("admin.rooms.delete")}
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
