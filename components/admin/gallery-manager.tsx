"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Edit2, Trash2, Image as ImageIcon } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface GalleryImage {
  id: number
  titleEn: string
  titleFr: string
  descriptionEn: string
  descriptionFr: string
  image: string
  category: string
}

export function GalleryManager() {
  const { t } = useLanguage()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<GalleryImage>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setImages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching gallery:", error)
      setImages([])
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
    if (!formData.titleEn || !formData.titleFr || !formData.descriptionEn || !formData.descriptionFr || !formData.category) {
      alert(t("admin.gallery.fillRequired"))
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
        alert(t("admin.gallery.uploadRequired"))
        setSaving(false)
        return
      }

      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn: formData.titleEn,
          titleFr: formData.titleFr,
          descriptionEn: formData.descriptionEn,
          descriptionFr: formData.descriptionFr,
          image: imageUrl,
          category: formData.category,
        }),
      })

      if (response.ok) {
        fetchImages()
        setFormData({})
        setEditingId(null)
        setImageFile(null)
      } else {
        alert(t("admin.gallery.saveFailed"))
      }
    } catch (error) {
      console.error("Error saving image:", error)
      alert(t("admin.gallery.error"))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (confirm(t("admin.gallery.confirmDelete"))) {
      try {
        await fetch(`/api/gallery/${id}`, { method: "DELETE" })
        fetchImages()
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }
  }

  function handleEdit(image: GalleryImage) {
    setEditingId(image.id)
    setFormData(image)
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
          {editingId ? t("admin.gallery.edit") : t("admin.gallery.add")}
        </h2>
        
        <div className="space-y-6">
          {/* Title - English and French */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("admin.gallery.imageTitle")} (English) *</Label>
              <Input
                value={formData.titleEn || ""}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder={t("admin.gallery.placeholder.title")}
              />
            </div>
            <div>
              <Label>{t("admin.gallery.imageTitle")} (Français) *</Label>
              <Input
                value={formData.titleFr || ""}
                onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                placeholder="Ex: Cour Marocaine"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <Label>{t("admin.gallery.category")} *</Label>
            <Input
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder={t("admin.gallery.placeholder.category")}
            />
          </div>

          {/* Description - English and French */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("admin.gallery.description")} (English) *</Label>
              <Textarea
                value={formData.descriptionEn || ""}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                placeholder={t("admin.gallery.placeholder.description")}
                rows={3}
              />
            </div>
            <div>
              <Label>{t("admin.gallery.description")} (Français) *</Label>
              <Textarea
                value={formData.descriptionFr || ""}
                onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                placeholder="Décrivez l'image..."
                rows={3}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>{t("admin.gallery.uploadImage")} *</Label>
            <div className="space-y-3">
              {formData.image && !imageFile && (
                <div className="relative w-48 h-48">
                  <img
                    src={formData.image}
                    alt="Current"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <p className="text-xs text-olive-600 mt-1">{t("admin.gallery.currentImage")}</p>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert(t("admin.gallery.fileTooLarge"))
                      return
                    }
                    setImageFile(file)
                  }
                }}
              />
              {imageFile && (
                <p className="text-sm text-green-600">{t("admin.gallery.newImageSelected")}: {imageFile.name}</p>
              )}
              <p className="text-xs text-olive-600">
                {t("admin.gallery.imageInstructions")}
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
                  {uploading ? t("admin.gallery.uploading") : t("admin.gallery.saving")}
                </>
              ) : (
                editingId ? t("admin.gallery.update") : t("admin.gallery.addImage")
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

      {/* Gallery Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-olive-900">{t("admin.gallery.list")}</h2>
        {images.length === 0 ? (
          <div className="text-center py-12 bg-sand-50 rounded-lg">
            <ImageIcon className="h-16 w-16 mx-auto text-sand-300 mb-3" />
            <p className="text-olive-600">{t("admin.gallery.noImages")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative bg-white border border-sand-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.image || "/placeholder.svg"}
                    alt={image.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-olive-900 text-sm mb-1 line-clamp-1">{image.titleEn}</h3>
                  <p className="text-xs text-gray-500 mb-1">{image.titleFr}</p>
                  <p className="text-xs text-olive-600 mb-2">{image.category}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(image)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      {t("admin.rooms.edit")}
                    </Button>
                    <Button
                      onClick={() => handleDelete(image.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
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
