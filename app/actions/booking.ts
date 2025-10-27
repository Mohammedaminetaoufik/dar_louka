"use server"

import { submitBooking, submitContactForm } from "@/lib/api-client"

export async function createBooking(bookingData: {
  roomId: number
  checkIn: string
  checkOut: string
  guests: number
  name: string
  email: string
  phone: string
  specialRequests?: string
}) {
  return await submitBooking(bookingData)
}

export async function sendContactMessage(contactData: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  return await submitContactForm(contactData)
}
