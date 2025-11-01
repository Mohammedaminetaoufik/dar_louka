"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Edit2, Trash2, X, Upload, Image as ImageIcon } from "lucide-react"

interface Room {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  image: string
  images?: string[]
}

export function RoomsManager() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Room>>({ amenities: [] })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newAmenity, setNewAmenity] = useState("")

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    try {
      const response = await fetch("/api/rooms")
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error("Error fetching rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(file: File): Promise<string | null> {
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

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
    }
  }

  async function handleSave() {
    // Validate required fields
    if (!formData.name?.trim()) {
      alert("Please enter room name")
      return
    }
    
    if (!formData.description?.trim()) {
      alert("Please enter room description")
      return
    }
    
    if (!formData.price || formData.price <= 0) {
      alert("Please enter a valid price")
      return
    }
    
    if (!formData.capacity || formData.capacity <= 0) {
      alert("Please enter a valid capacity")
      return
    }

    // Check if at least one image exists (existing or new)
    const hasExistingImages = (formData.images || []).length > 0
    const hasNewImages = imageFiles.length > 0
    
    if (!hasExistingImages && !hasNewImages && !editingId) {
      alert("Please upload at least one image")
      return
    }

    setSaving(true)
    setUploading(true)

    try {
      let uploadedImages: string[] = []

      // Upload new images if selected
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const url = await handleImageUpload(file)
          if (url) uploadedImages.push(url)
        }
      }

      // Combine existing images with new uploads
      const existingImages = (formData.images || []).filter(img => typeof img === 'string')
      const allImages = [...existingImages, ...uploadedImages]

      // Use first image as main image if no main image exists
      const mainImage = formData.image || allImages[0] || ""

      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/rooms/${editingId}` : "/api/rooms"

      // Prepare data to send
      const roomData = {
        name: formData.name?.trim(),
        description: formData.description?.trim(),
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        image: mainImage,
        images: allImages,
        amenities: formData.amenities || [],
      }

      console.log("Sending room data:", roomData) // Debug log

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      })

      if (response.ok) {
        alert("Room saved successfully!")
        fetchRooms()
        setFormData({ amenities: [] })
        setEditingId(null)
        setImageFiles([])
      } else {
        const errorData = await response.json()
        console.error("Save error:", errorData)
        alert(`Failed to save room: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error saving room:", error)
      alert("Error saving room")
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await fetch(`/api/rooms/${id}`, { method: "DELETE" })
        fetchRooms()
      } catch (error) {
        console.error("Error deleting room:", error)
      }
    }
  }

  function handleEdit(room: Room) {
    setEditingId(room.id)
    setFormData(room)
    setImageFiles([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleImageFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const existingCount = (formData.images || []).length
    const newCount = files.length
    
    if (existingCount + newCount > 3) {
      alert("Maximum 3 images allowed per room")
      return
    }

    // Validate file sizes
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB`)
        return
      }
    }

    setImageFiles(prev => [...prev, ...files])
  }

  function removeImageFile(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  function removeExistingImage(index: number) {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }))
  }

  function addAmenity() {
    if (!newAmenity.trim()) return
    
    setFormData(prev => ({
      ...prev,
      amenities: [...(prev.amenities || []), newAmenity.trim()]
    }))
    setNewAmenity("")
  }

  function removeAmenity(index: number) {
    setFormData(prev => ({
      ...prev,
      amenities: (prev.amenities || []).filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalImages = (formData.images || []).length + imageFiles.length

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <div className="bg-sand-50 p-6 rounded-lg border-2 border-sand-200">
        <h2 className="text-2xl font-bold mb-6 text-olive-900">
          {editingId ? "Edit Room" : "Add New Room"}
        </h2>
        
        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label>Room Name *</Label>
            <Input
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Deluxe Suite"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description *</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the room..."
              rows={4}
            />
          </div>

          {/* Price and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Price per Night (USD) *</Label>
              <Input
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="150"
              />
            </div>
            <div>
              <Label>Capacity (Guests) *</Label>
              <Input
                type="number"
                value={formData.capacity || ""}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                placeholder="2"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label>Amenities</Label>
            <div className="space-y-3">
              {/* Add new amenity */}
              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="e.g., Free WiFi, Mountain View"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity} variant="outline">
                  Add
                </Button>
              </div>

              {/* Display amenities */}
              {(formData.amenities || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(formData.amenities || []).map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-terracotta-100 text-terracotta-700 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="hover:text-terracotta-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Images Upload (Max 3) */}
          <div>
            <Label>Room Images * (Max 3 images)</Label>
            <div className="space-y-3">
              {/* Existing Images */}
              {(formData.images || []).length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {(formData.images || []).map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Room ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Image Previews */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageFile(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {totalImages < 3 && (
                <div>
                  <input
                    type="file"
                    id="room-images"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="room-images"
                    className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-sand-300 rounded-lg p-6 cursor-pointer hover:border-terracotta-500 hover:bg-terracotta-50 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-sand-400" />
                    <span className="text-olive-700 font-semibold">
                      Upload Images ({totalImages}/3)
                    </span>
                  </label>
                  <p className="text-xs text-olive-600 mt-2">
                    Upload up to 3 images (max 5MB each). Supported: JPG, PNG, GIF
                  </p>
                </div>
              )}

              {totalImages === 0 && !editingId && (
                <p className="text-red-600 text-sm">At least one image is required</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              className="bg-terracotta-600 hover:bg-terracotta-700"
              disabled={saving || uploading || totalImages === 0}
            >
              {saving || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                editingId ? "Update Room" : "Create Room"
              )}
            </Button>
            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(null)
                  setFormData({ amenities: [] })
                  setImageFiles([])
                }}
                variant="outline"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Rooms List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-olive-900">Rooms List</h2>
        {rooms.length === 0 ? (
          <div className="text-center py-12 bg-sand-50 rounded-lg">
            <ImageIcon className="h-16 w-16 mx-auto text-sand-300 mb-3" />
            <p className="text-olive-600">No rooms yet. Create your first room above!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white border border-sand-200 rounded-lg p-6 shadow-sm">
                <div className="flex gap-4">
                  {/* Room Images */}
                  <div className="w-48 flex-shrink-0">
                    {room.images && room.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {room.images.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${room.name} ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={room.image || "/placeholder.svg"}
                        alt={room.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  
                  {/* Room Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-olive-900 mb-2">{room.name}</h3>
                    <p className="text-olive-700 text-sm mb-3 line-clamp-2">{room.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <span className="text-olive-600">
                        <strong>Price:</strong> ${room.price}/night
                      </span>
                      <span className="text-olive-600">
                        <strong>Capacity:</strong> {room.capacity} guests
                      </span>
                    </div>
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {room.amenities.slice(0, 5).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-sand-100 px-2 py-1 rounded-full text-olive-700"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 5 && (
                          <span className="text-xs bg-sand-100 px-2 py-1 rounded-full text-olive-700">
                            +{room.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleEdit(room)}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(room.id)}
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