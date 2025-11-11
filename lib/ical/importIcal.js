import ical from "ical"

export async function importIcal(url) {
  const response = await fetch(url)
  const text = await response.text()
  const events = ical.parseICS(text)

  const reservations = Object.values(events)
    .filter((e) => e.start && e.end)
    .map((e) => ({
      checkIn: new Date(e.start),
      checkOut: new Date(e.end),
      name: e.summary || "External booking",
      email: "external@sync.com",
      phone: "",
      guests: 1,
      specialRequests: "Imported from iCal",
      status: "confirmed",
    }))

  return reservations
}
