"use server"

export interface Room {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  image: string
  images?: string[]
}

export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  image: string
  price?: number
}

export interface GalleryImage {
  id: number
  title: string
  description: string
  image: string
  category: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Rooms API
export async function fetchRooms(): Promise<Room[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "revalidate",
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch rooms:", response.status)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching rooms:", error)
    return []
  }
}

export async function fetchRoomById(id: number): Promise<Room | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "revalidate",
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching room:", error)
    return null
  }
}

// Events API
export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "revalidate",
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch events:", response.status)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching events:", error)
    return []
  }
}

export async function fetchEventById(id: number): Promise<Event | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "revalidate",
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching event:", error)
    return null
  }
}

// Gallery API
export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "revalidate",
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch gallery:", response.status)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching gallery:", error)
    return []
  }
}

export async function fetchGalleryByCategory(category: string): Promise<GalleryImage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery?category=${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "revalidate",
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching gallery by category:", error)
    return []
  }
}

// Booking API
export async function submitBooking(bookingData: {
  roomId: number
  checkIn: string
  checkOut: string
  guests: number
  name: string
  email: string
  phone: string
  specialRequests?: string
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      throw new Error(`Booking failed: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error submitting booking:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Contact API
export async function submitContactForm(contactData: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    })

    if (!response.ok) {
      throw new Error(`Contact submission failed: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error submitting contact form:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
