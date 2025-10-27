"use server"

import { fetchEvents, fetchEventById } from "@/lib/api-client"

export async function getEvents() {
  return await fetchEvents()
}

export async function getEvent(id: number) {
  return await fetchEventById(id)
}
