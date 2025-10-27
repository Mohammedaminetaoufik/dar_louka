"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"

interface ImageUploadProps {
  maxImages?: number
  onImagesChange: (images: string[]) => void
  initialImages?: string[]
}

export function ImageUpload({ maxImages = 3, onImagesChange, initialImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    setError("")

    try {
      const newImages: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Upload failed")
        }

        const data = await response.json()
        newImages.push(data.url)
      }

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onImagesChange(updatedImages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-olive-700">
          Images ({images.length}/{maxImages})
        </label>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-sand-300 rounded-lg p-6 text-center cursor-pointer hover:border-terracotta-500 hover:bg-terracotta-50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
        />

        <Upload className="mx-auto mb-2 text-sand-400" size={32} />
        <p className="text-sm text-olive-700 font-semibold">Click to upload images</p>
        <p className="text-xs text-olive-600">PNG, JPG, GIF up to 5MB</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-olive-600">
          <ImageIcon className="mx-auto mb-2 text-sand-300" size={32} />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}
