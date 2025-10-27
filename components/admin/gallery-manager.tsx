"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface GalleryImage {
  id: number
  title: string
  description: string
  image: string
  category: string
}

export function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<GalleryImage>>({})

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error("[v0] Error fetching gallery:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchImages()
        setFormData({})
        setEditingId(null)
      }
    } catch (error) {
      console.error("[v0] Error saving image:", error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure?")) {
      try {
        await fetch(`/api/gallery/${id}`, { method: "DELETE" })
        fetchImages()
      } catch (error) {
        console.error("[v0] Error deleting image:", error)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-sand-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Image" : "Add New Image"}</h2>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Image title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Image description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Input
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category"
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Image URL"
              />
            </div>
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

      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="border border-sand-200 rounded-lg overflow-hidden">
            <img src={image.image || "/placeholder.svg"} alt={image.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{image.title}</h3>
              <p className="text-sm text-olive-600">{image.category}</p>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => {
                    setEditingId(image.id)
                    setFormData(image)
                  }}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
                <Button onClick={() => handleDelete(image.id)} variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
