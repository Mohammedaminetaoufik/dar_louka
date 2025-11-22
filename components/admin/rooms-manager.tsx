"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Edit2, Trash2, X, Upload, Plus, ExternalLink, Copy, Calendar, Eye } from "lucide-react"

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
      let uploadedImages: string[] = []

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const url = await handleImageUpload(file)
          if (url) uploadedImages.push(url)
        }
      }

      const existingImages = (formData.images || []).filter(img => typeof img === 'string')
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
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

  function addIcalUrl() {
    if (!newIcalUrl.trim()) return
    
    try {
      new URL(newIcalUrl.trim())
    } catch {
      alert("Please enter a valid URL")
      return
    }

    setFormData(prev => ({
      ...prev,
      icalImportUrls: [...(prev.icalImportUrls || []), newIcalUrl.trim()]
    }))
    setNewIcalUrl("")
  }

  function removeIcalUrl(index: number) {
    setFormData(prev => ({
      ...prev,
      icalImportUrls: (prev.icalImportUrls || []).filter((_, i) => i !== index)
    }))
  }

  function copyIcalToken(token: string) {
    if (typeof window !== 'undefined') {
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
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/api/ical/${token}`
      window.open(url, '_blank')
    }
  }

  async function syncIcalCalendar(roomId: number) {
    setSyncing(roomId)
    try {
      const response = await fetch(`/api/rooms/${roomId}/sync-ical`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(`✅ Successfully synced ${data.bookingsImported} bookings from external calendars`)
        fetchRooms()
      } else {
        const error = await response.json().catch(() => ({}))
        alert(`❌ Sync failed: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Sync error:', error)
      alert('❌ Network error during sync. Check console.')
    } finally {
      setSyncing(null)
    }
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
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
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
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIcalUrl())}
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
                        <span className="text-sm text-olive-700 truncate">{url}</span>
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

              <div className="bg-moroccan-blue-50 border border-moroccan-blue-200 rounded-md p-3">
                <p className="text-xs text-moroccan-blue-800">
                  <strong>How to get iCal URLs:</strong><br/>
                  • Booking.com: Extranet → Calendar → Export Calendar<br/>
                  • Airbnb: Listings → Calendar → Availability Settings → Export Calendar<br/>
                  • TripAdvisor: Calendar → Sync Calendars → Export
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
                        src={image}
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
                        src={URL.createObjectURL(file)}
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
                    <span className="text-olive-700 font-semibold">
                      Upload Images ({totalImages}/3)
                    </span>
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
              ) : (
                editingId ? "Update Room" : "Create Room"
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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-olive-900">Rooms List</h2>
        {rooms.length === 0 ? (
          <div className="text-center py-12 bg-sand-50 rounded-lg">
            <p className="text-olive-600">No rooms yet. Create your first room above!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white border border-sand-200 rounded-lg p-6 shadow-sm">
                <div className="flex gap-4">
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

                    {room.icalToken && typeof window !== 'undefined' && (
                      <div className="mb-3 bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-xs font-semibold text-green-800 mb-2">iCal Export URL (Share with booking platforms):</p>
                        <div className="flex items-center gap-2 mb-2">
                          <code className="flex-1 text-xs bg-white px-2 py-1 rounded border border-green-300 truncate">
                            {window.location.origin}/api/ical/{room.icalToken}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyIcalToken(room.icalToken!)}
                            className="flex-shrink-0"
                          >
                            {copiedToken === room.icalToken ? (
                              <>✓ Copied</>
                            ) : (
                              <><Copy className="h-3 w-3 mr-1" /> Copy</>
                            )}
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewIcalContent(room.icalToken!, room.name)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View iCal
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadIcal(room.icalToken!, room.name)}
                            className="text-xs"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            Download .ics
                          </Button>
                        </div>
                      </div>
                    )}

                    {room.icalImportUrls && room.icalImportUrls.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-moroccan-blue-800 mb-1">
                          Syncing from {room.icalImportUrls.length} external calendar(s)
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => syncIcalCalendar(room.id)}
                          disabled={syncing === room.id}
                          className="text-xs"
                        >
                          {syncing === room.id ? (
                            <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Syncing...</>
                          ) : (
                            <><Calendar className="h-3 w-3 mr-1" /> Sync Now</>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

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