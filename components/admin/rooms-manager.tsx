"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Edit2, Trash2, X, Upload, Plus, ExternalLink, Copy, Calendar, RefreshCw } from "lucide-react"

interface Room {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  image: string
  images?: string[]
  icalToken?: string
  icalImportUrls?: string[]
}

export function RoomsManager() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Room>>({
    amenities: [],
    icalImportUrls: [],
    images: [],
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newAmenity, setNewAmenity] = useState("")
  const [newIcalUrl, setNewIcalUrl] = useState("")
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [syncing, setSyncing] = useState<number | null>(null)
  const [viewingIcal, setViewingIcal] = useState<{ token: string; roomName: string } | null>(null)
  const [icalContent, setIcalContent] = useState<string>("")
  const [loadingIcal, setLoadingIcal] = useState(false)

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

      if (!response.ok) throw new Error("Upload failed")
      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image")
      return null
    }
  }

  async function handleSave() {
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

    const hasExistingImages = (formData.images || []).length > 0
    const hasNewImages = imageFiles.length > 0

    if (!hasExistingImages && !hasNewImages && !editingId) {
      alert("Please upload at least one image")
      return
    }

    setSaving(true)
    setUploading(true)

    try {
      const uploadedImages: string[] = []

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const url = await handleImageUpload(file)
          if (url) uploadedImages.push(url)
        }
      }

      const existingImages = (formData.images || []).filter((img) => typeof img === "string")
      const allImages = [...existingImages, ...uploadedImages]
      const mainImage = formData.image || allImages[0] || ""

      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/rooms/${editingId}` : "/api/rooms"

      // ✅ Preserve icalToken on update (critical!)
      const roomData = {
        name: formData.name?.trim(),
        description: formData.description?.trim(),
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        image: mainImage,
        images: allImages,
        amenities: formData.amenities || [],
        icalImportUrls: formData.icalImportUrls || [],
        ...(editingId && formData.icalToken && { icalToken: formData.icalToken }), // only if editing & present
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      })

      if (response.ok) {
        alert("Room saved successfully!")
        fetchRooms()
        setFormData({ amenities: [], icalImportUrls: [], images: [] })
        setEditingId(null)
        setImageFiles([])
      } else {
        const errorData = await response.json()
        alert(`Failed to save room: ${errorData.error || "Unknown error"}`)
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
        const response = await fetch(`/api/rooms/${id}`, { method: "DELETE" })
        if (response.ok) {
          alert("Room deleted successfully")
          fetchRooms()
        } else {
          alert("Failed to delete room")
        }
      } catch (error) {
        console.error("Error deleting room:", error)
        alert("Error deleting room")
      }
    }
  }

  // ✅ FIXED: Fetch full room (with icalToken) for editing
  async function handleEdit(room: Room) {
    try {
      const res = await fetch(`/api/rooms/${room.id}`)
      if (!res.ok) throw new Error(`Failed to load room (HTTP ${res.status})`)

      const fullRoom = await res.json()

      setEditingId(fullRoom.id)
      setFormData({
        ...fullRoom,
        // ✅ Safe defaults in case DB returns null/invalid JSON
        amenities: Array.isArray(fullRoom.amenities) ? fullRoom.amenities : [],
        icalImportUrls: Array.isArray(fullRoom.icalImportUrls) ? fullRoom.icalImportUrls : [],
        images: Array.isArray(fullRoom.images) ? fullRoom.images : [],
      })
      setImageFiles([])
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Error loading room for edit:", error)
      alert("Could not load room details. Please try again.")
    }
  }

  function handleImageFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const existingCount = (formData.images || []).length
    const newCount = files.length

    if (existingCount + newCount > 3) {
      alert("Maximum 3 images allowed per room")
      return
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB`)
        return
      }
    }

    setImageFiles((prev) => [...prev, ...files])
  }

  function removeImageFile(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function removeExistingImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }))
  }

  function addAmenity() {
    if (!newAmenity.trim()) return

    setFormData((prev) => ({
      ...prev,
      amenities: [...(prev.amenities || []), newAmenity.trim()],
    }))
    setNewAmenity("")
  }

  function removeAmenity(index: number) {
    setFormData((prev) => ({
      ...prev,
      amenities: (prev.amenities || []).filter((_, i) => i !== index),
    }))
  }

  function addIcalUrl() {
    if (!newIcalUrl.trim()) return

    try {
      new URL(newIcalUrl.trim())
    } catch {
      alert("Please enter a valid URL")
      return
    }

    setFormData((prev) => ({
      ...prev,
      icalImportUrls: [...(prev.icalImportUrls || []), newIcalUrl.trim()],
    }))
    setNewIcalUrl("")
  }

  function removeIcalUrl(index: number) {
    setFormData((prev) => ({
      ...prev,
      icalImportUrls: (prev.icalImportUrls || []).filter((_, i) => i !== index),
    }))
  }

  function copyIcalToken(token: string) {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/api/ical/${token}`)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    }
  }

  async function viewIcalContent(token: string, roomName: string) {
    setViewingIcal({ token, roomName })
    setLoadingIcal(true)
    setIcalContent("")

    try {
      const response = await fetch(`/api/ical/${token}`)
      if (response.ok) {
        const content = await response.text()
        setIcalContent(content)
      } else {
        setIcalContent(`Error: HTTP ${response.status} — unable to load iCal`)
      }
    } catch (error) {
      console.error("Error fetching iCal:", error)
      setIcalContent("Error: Failed to fetch iCal content")
    } finally {
      setLoadingIcal(false)
    }
  }

  function downloadIcal(token: string, roomName: string) {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/api/ical/${token}`
      window.open(url, "_blank")
    }
  }

  async function syncIcalCalendar(roomId: number) {
    setSyncing(roomId)
    try {
      const response = await fetch(`/api/rooms/${roomId}/sync-ical`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ Successfully synced ${data.bookingsImported} bookings from external calendars`)
        fetchRooms()
      } else {
        const error = await response.json().catch(() => ({}))
        alert(`❌ Sync failed: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Sync error:", error)
      alert("❌ Network error during sync. Check console.")
    } finally {
      setSyncing(null)
    }
  }

  async function generateToken() {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    setFormData((prev) => ({ ...prev, icalToken: token }))
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
        <h2 className="text-2xl font-bold mb-6 text-olive-900">{editingId ? "Edit Room" : "Add New Room"}</h2>

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
                min="0"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="150"
              />
            </div>
            <div>
              <Label>Capacity (Guests) *</Label>
              <Input
                type="number"
                min="1"
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
              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="e.g., Free WiFi, Mountain View"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity} variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

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
                        aria-label="Remove amenity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* iCal Import URLs */}
          <div className="border-t pt-6">
            <Label className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Calendar className="h-5 w-5" />
              External Calendar Integration (iCal)
            </Label>
            <p className="text-sm text-olive-600 mb-4">
              Import bookings from Booking.com, Airbnb, TripAdvisor, and other platforms that provide iCal feeds
            </p>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newIcalUrl}
                  onChange={(e) => setNewIcalUrl(e.target.value)}
                  placeholder="https://platform.com/ical/feed/your-property-id"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIcalUrl())}
                />
                <Button type="button" onClick={addIcalUrl} variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {(formData.icalImportUrls || []).length > 0 && (
                <div className="space-y-2">
                  {(formData.icalImportUrls || []).map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-sand-300 rounded-md p-3"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ExternalLink className="h-4 w-4 text-olive-600 flex-shrink-0" />
                        <span className="text-sm text-olive-700 truncate" title={url}>
                          {url}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIcalUrl(index)}
                        className="ml-2 text-red-600 hover:text-red-700"
                        aria-label="Remove URL"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Export URL Section */}
              <div className="mt-6 border-t pt-4">
                <Label className="flex items-center gap-2 text-lg font-semibold mb-3 text-terracotta-700">
                  <Calendar className="h-5 w-5" />
                  Export Calendar (Outgoing iCal)
                </Label>
                <p className="text-sm text-olive-600 mb-4">
                  Share this URL with Booking.com, Airbnb, etc. to sync your DAR LOUKA bookings with them.
                </p>

                {formData.icalToken ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-300 rounded-md p-3 font-mono text-xs text-gray-600 break-all">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/api/ical/${formData.icalToken}`
                        : `.../api/ical/${formData.icalToken}`}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => copyIcalToken(formData.icalToken!)}
                      className="shrink-0"
                    >
                      {copiedToken === formData.icalToken ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => downloadIcal(formData.icalToken!, formData.name || "room")}
                      className="shrink-0"
                      title="Download .ics file"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <span className="text-yellow-800 text-sm">
                      No iCal token generated for this room yet. Save the room to generate one.
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-moroccan-blue-50 border border-moroccan-blue-200 rounded-md p-3 mt-4">
                <p className="text-xs text-moroccan-blue-800">
                  <strong>How to get iCal URLs:</strong>
                  <br />• Booking.com: Extranet → Calendar → Export Calendar
                  <br />• Airbnb: Listings → Calendar → Availability Settings → Export Calendar
                  <br />• TripAdvisor: Calendar → Sync Calendars → Export
                </p>
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div>
            <Label>Room Images * (Max 3 images)</Label>
            <div className="space-y-3">
              {(formData.images || []).length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {(formData.images || []).map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Room ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imageFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {imageFiles.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageFile(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove new image"
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
                    <span className="text-olive-700 font-semibold">Upload Images ({totalImages}/3)</span>
                  </label>
                </div>
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
              ) : editingId ? (
                "Update Room"
              ) : (
                "Create Room"
              )}
            </Button>
            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(null)
                  setFormData({ amenities: [], icalImportUrls: [], images: [] })
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-sand-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                iCal Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-sand-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={room.image || "/placeholder.svg"}
                    alt={room.name}
                    className="h-12 w-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{room.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{room.capacity} Guests</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">${room.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* iCal Status Column with Sync Button */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        room.icalImportUrls && room.icalImportUrls.length > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {room.icalImportUrls && room.icalImportUrls.length > 0
                        ? `${room.icalImportUrls.length} Sources`
                        : "None"}
                    </span>
                    {room.icalImportUrls && room.icalImportUrls.length > 0 && (
                      <button
                        onClick={() => syncIcalCalendar(room.id)}
                        disabled={syncing === room.id}
                        className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${syncing === room.id ? "animate-spin" : ""}`}
                        title="Sync Calendars Now"
                      >
                        <RefreshCw className="h-4 w-4 text-blue-600" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(room)}>
                      <Edit2 className="h-4 w-4 text-olive-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(room.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View iCal Modal */}
      <Dialog open={!!viewingIcal} onOpenChange={() => setViewingIcal(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              iCal Calendar: {viewingIcal?.roomName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                This is your room's calendar in iCal format. Share the URL with booking platforms.
              </p>
              {viewingIcal && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadIcal(viewingIcal.token, viewingIcal.roomName)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>

            <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto max-h-[500px] font-mono text-xs">
              {loadingIcal ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : icalContent ? (
                <pre className="whitespace-pre-wrap">{icalContent}</pre>
              ) : (
                <p className="text-gray-400 italic">No iCal content loaded.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
