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
  date: string
  time: string
  location: string
  category: string
  image: string
  price?: number
}

export function EventsManager() {
  const { t } = useLanguage()
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
    if (!formData.titleEn || !formData.titleFr || !formData.descriptionEn || !formData.descriptionFr || !formData.date || !formData.time || !formData.location || !formData.category) {
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
          titleEn: formData.titleEn,
          titleFr: formData.titleFr,
          descriptionEn: formData.descriptionEn,
          descriptionFr: formData.descriptionFr,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          category: formData.category,
          image: imageUrl,
          price: formData.price,
        }),
      })

      if (response.ok) {
        fetchEvents()
        setFormData({})
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
          {editingId ? t("admin.events.edit") : t("admin.events.add")}
        </h2>
        
        <div className="space-y-6">
          {/* Title - English and French */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("admin.events.title")} (English) *</Label>
              <Input
                value={formData.titleEn || ""}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder={t("admin.events.placeholder.title")}
              />
            </div>
            <div>
              <Label>{t("admin.events.title")} (Français) *</Label>
              <Input
                value={formData.titleFr || ""}
                onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                placeholder="Ex: Randonnée dans l'Atlas"
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
                placeholder={t("admin.events.placeholder.description")}
                rows={4}
              />
            </div>
            <div>
              <Label>{t("admin.events.description")} (Français) *</Label>
              <Textarea
                value={formData.descriptionFr || ""}
                onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                placeholder="Décrivez l'événement..."
                rows={4}
              />
            </div>
          </div>

          {/* Date, Time, Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>{t("admin.events.date")} *</Label>
              <Input
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label>{t("admin.events.time")} *</Label>
              <Input
                type="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div>
              <Label>{t("admin.events.price")} (MAD)</Label>
              <Input
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || undefined })}
                placeholder={t("admin.events.placeholder.price")}
              />
            </div>
          </div>

          {/* Location and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("admin.events.location")} *</Label>
              <Input
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t("admin.events.placeholder.location")}
              />
            </div>
            <div>
              <Label>{t("admin.events.category")} *</Label>
              <Input
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder={t("admin.events.placeholder.category")}
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
              <p className="text-xs text-olive-600">
                {t("admin.events.imageInstructions")}
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
                  setFormData({})
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
                    <div>
                      <h3 className="font-bold text-lg text-olive-900">{event.titleEn}</h3>
                      <p className="text-sm text-gray-600">{event.titleFr}</p>
                    </div>
                    <p className="text-olive-700 text-sm mb-2 line-clamp-2">{event.descriptionEn}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-olive-600">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString("fr-FR")}
                      </span>
                      <span>{t("admin.events.time")}: {event.time}</span>
                      <span>{t("admin.events.location")}: {event.location}</span>
                      <span className="text-terracotta-600 font-semibold">
                        {event.price ? `${event.price} DH` : t("admin.events.free")}
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
