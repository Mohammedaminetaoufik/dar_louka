"use server"

import { fetchGalleryImages, fetchGalleryByCategory } from "@/lib/api-client"

export async function getGalleryImages() {
  return await fetchGalleryImages()
}

export async function getGalleryByCategory(category: string) {
  return await fetchGalleryByCategory(category)
}
