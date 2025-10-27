// External booking platform integration utilities

export interface BookingPlatformConfig {
  bookingCom?: {
    apiKey: string
    propertyId: string
  }
  airbnb?: {
    apiKey: string
    listingId: string
  }
  tripadvisor?: {
    apiKey: string
    propertyId: string
  }
}

export class BookingPlatformManager {
  private config: BookingPlatformConfig

  constructor(config: BookingPlatformConfig) {
    this.config = config
  }

  // Sync booking to Booking.com
  async syncToBookingCom(bookingData: {
    checkIn: string
    checkOut: string
    guests: number
    name: string
    email: string
  }) {
    if (!this.config.bookingCom) return null

    try {
      const response = await fetch("https://api.booking.com/v1/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.bookingCom.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property_id: this.config.bookingCom.propertyId,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          number_of_guests: bookingData.guests,
          guest_name: bookingData.name,
          guest_email: bookingData.email,
        }),
      })

      if (!response.ok) throw new Error("Booking.com sync failed")
      const data = await response.json()
      return data.booking_id
    } catch (error) {
      console.error("Booking.com sync error:", error)
      return null
    }
  }

  // Sync booking to Airbnb
  async syncToAirbnb(bookingData: {
    checkIn: string
    checkOut: string
    guests: number
    name: string
    email: string
  }) {
    if (!this.config.airbnb) return null

    try {
      const response = await fetch("https://api.airbnb.com/v1/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.airbnb.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: this.config.airbnb.listingId,
          check_in_date: bookingData.checkIn,
          check_out_date: bookingData.checkOut,
          number_of_guests: bookingData.guests,
          guest_name: bookingData.name,
          guest_email: bookingData.email,
        }),
      })

      if (!response.ok) throw new Error("Airbnb sync failed")
      const data = await response.json()
      return data.id
    } catch (error) {
      console.error("Airbnb sync error:", error)
      return null
    }
  }

  // Sync booking to TripAdvisor
  async syncToTripAdvisor(bookingData: {
    checkIn: string
    checkOut: string
    guests: number
    name: string
    email: string
  }) {
    if (!this.config.tripadvisor) return null

    try {
      const response = await fetch("https://api.tripadvisor.com/v1/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.tripadvisor.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property_id: this.config.tripadvisor.propertyId,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          guests: bookingData.guests,
          name: bookingData.name,
          email: bookingData.email,
        }),
      })

      if (!response.ok) throw new Error("TripAdvisor sync failed")
      const data = await response.json()
      return data.booking_id
    } catch (error) {
      console.error("TripAdvisor sync error:", error)
      return null
    }
  }

  // Fetch availability from external platforms
  async fetchAvailability(checkIn: string, checkOut: string) {
    const availability: Record<string, boolean> = {}

    if (this.config.bookingCom) {
      try {
        const response = await fetch(
          `https://api.booking.com/v1/availability?property_id=${this.config.bookingCom.propertyId}&check_in=${checkIn}&check_out=${checkOut}`,
          {
            headers: {
              Authorization: `Bearer ${this.config.bookingCom.apiKey}`,
            },
          },
        )
        availability.bookingCom = response.ok
      } catch (error) {
        availability.bookingCom = false
      }
    }

    if (this.config.airbnb) {
      try {
        const response = await fetch(
          `https://api.airbnb.com/v1/availability?listing_id=${this.config.airbnb.listingId}&check_in_date=${checkIn}&check_out_date=${checkOut}`,
          {
            headers: {
              Authorization: `Bearer ${this.config.airbnb.apiKey}`,
            },
          },
        )
        availability.airbnb = response.ok
      } catch (error) {
        availability.airbnb = false
      }
    }

    if (this.config.tripadvisor) {
      try {
        const response = await fetch(
          `https://api.tripadvisor.com/v1/availability?property_id=${this.config.tripadvisor.propertyId}&check_in=${checkIn}&check_out=${checkOut}`,
          {
            headers: {
              Authorization: `Bearer ${this.config.tripadvisor.apiKey}`,
            },
          },
        )
        availability.tripadvisor = response.ok
      } catch (error) {
        availability.tripadvisor = false
      }
    }

    return availability
  }
}
