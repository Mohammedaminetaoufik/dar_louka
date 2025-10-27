"use server"

import { fetchRooms, fetchRoomById } from "@/lib/api-client"

export async function getRooms() {
  return await fetchRooms()
}

export async function getRoom(id: number) {
  return await fetchRoomById(id)
}
