import { useState, useCallback } from "react"

interface AvailabilityCheckResult {
  available: boolean
  message: string
  conflictDates?: {
    checkIn: Date
    checkOut: Date
  }
  nextBooking?: {
    checkIn: Date
    checkOut: Date
  }
}

export function useAvailabilityCheck() {
  const [isChecking, setIsChecking] = useState(false)
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityCheckResult | null>(null)

  const checkAvailability = useCallback(
    async (roomId: number, checkIn: string, checkOut: string) => {
      if (!roomId || !checkIn || !checkOut) {
        setAvailabilityResult(null)
        return null
      }

      setIsChecking(true)

      try {
        const response = await fetch(
          `/api/bookings/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`
        )

        const data = await response.json()

        if (!response.ok) {
          console.error("Availability check error:", data)
          setAvailabilityResult(null)
          return null
        }

        setAvailabilityResult(data as AvailabilityCheckResult)
        return data as AvailabilityCheckResult
      } catch (error) {
        console.error("Error checking availability:", error)
        setAvailabilityResult(null)
        return null
      } finally {
        setIsChecking(false)
      }
    },
    []
  )

  const getBookedDates = useCallback(async (roomId: number) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/booked-dates`)
      const data = await response.json()

      if (!response.ok) {
        console.error("Error fetching booked dates:", data)
        return null
      }

      return data
    } catch (error) {
      console.error("Error fetching booked dates:", error)
      return null
    }
  }, [])

  return {
    isChecking,
    availabilityResult,
    checkAvailability,
    getBookedDates,
  }
}
