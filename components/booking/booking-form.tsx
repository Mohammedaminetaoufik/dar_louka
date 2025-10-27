"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingFormProps {
  selectedRoom?: string
}

export function BookingForm({ selectedRoom }: BookingFormProps) {
  const { t } = useLanguage()
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState("2")
  const [room, setRoom] = useState(selectedRoom || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your booking system
    // For now, we'll show an alert
    alert(
      `Booking request:\nCheck-in: ${checkIn ? format(checkIn, "PPP") : "Not selected"}\nCheck-out: ${checkOut ? format(checkOut, "PPP") : "Not selected"}\nGuests: ${guests}\nRoom: ${room || "Any available"}`,
    )
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Check-in Date */}
            <div className="space-y-2">
              <Label htmlFor="checkin">{t("booking.checkin")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !checkIn && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label htmlFor="checkout">{t("booking.checkout")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !checkOut && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    initialFocus
                    disabled={(date) => date < (checkIn || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label htmlFor="guests">{t("booking.guests")}</Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger>
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                  <SelectItem value="4">4 Guests</SelectItem>
                  <SelectItem value="5">5+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Room Selection */}
            <div className="space-y-2">
              <Label htmlFor="room">{t("booking.room")}</Label>
              <Select value={room} onValueChange={setRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Any available" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Available</SelectItem>
                  <SelectItem value="atlas-suite">Atlas Suite</SelectItem>
                  <SelectItem value="garden-room">Garden Room</SelectItem>
                  <SelectItem value="family-suite">Family Suite</SelectItem>
                  <SelectItem value="deluxe-room">Deluxe Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full md:w-auto bg-terracotta-600 hover:bg-terracotta-700">
            {t("booking.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
