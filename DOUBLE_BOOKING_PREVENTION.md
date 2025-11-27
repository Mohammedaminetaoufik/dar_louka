# Double Booking Prevention System

## Overview
This document describes the double booking prevention system implemented for Dar Louka's booking system. The system ensures that when multiple guests attempt to book the same room for overlapping dates, only one booking is confirmed while others receive a clear error message about the conflict.

---

## How It Works

### 1. Booking Conflict Detection Logic

When a guest submits a booking request, the system checks if there are any existing bookings that overlap with the requested dates.

**Conflict Detection Algorithm:**
```
A booking conflict occurs if:
- The new booking's check-in date is BEFORE the existing booking's check-out date AND
- The new booking's check-out date is AFTER the existing booking's check-in date

Example scenarios:
✗ CONFLICT: Guest 1 books Sept 1-5, Guest 2 tries Sept 3-8 (overlap Sept 3-5)
✗ CONFLICT: Guest 1 books Sept 1-5, Guest 2 tries Aug 30-Sept 2 (overlap Sept 1-2)
✗ CONFLICT: Guest 1 books Sept 1-5, Guest 2 tries Sept 2-4 (completely overlaps)
✓ NO CONFLICT: Guest 1 books Sept 1-5, Guest 2 books Sept 5-8 (Sept 5 is checkout day)
✓ NO CONFLICT: Guest 1 books Sept 1-5, Guest 2 books Aug 28-Sept 1 (Aug 28-Sept 1, Sept 1 is checkin)
```

**Note:** Checkout day is not counted as a conflict with the next day's check-in, allowing for same-day turnover.

---

## API Endpoints

### 1. Create Booking
**Endpoint:** `POST /api/bookings`

**Request:**
```json
{
  "roomId": 1,
  "checkIn": "2025-12-01",
  "checkOut": "2025-12-05",
  "guests": 2,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+212612345678",
  "specialRequests": "Late checkout if possible"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "roomId": 1,
  "checkIn": "2025-12-01T00:00:00Z",
  "checkOut": "2025-12-05T00:00:00Z",
  "guests": 2,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+212612345678",
  "specialRequests": "Late checkout if possible",
  "status": "pending",
  "room": { /* room details */ }
}
```

**Conflict Error Response (409):**
```json
{
  "error": "Room is not available for the selected dates",
  "conflictDates": {
    "checkIn": "2025-12-02T00:00:00Z",
    "checkOut": "2025-12-06T00:00:00Z"
  },
  "availableAlternatives": "Please select different dates or try another room"
}
```

**Validation Error Response (400):**
```json
{
  "error": "Check-out date must be after check-in date"
}
```

---

### 2. Check Availability
**Endpoint:** `GET /api/bookings/availability`

**Query Parameters:**
- `roomId` (required): Room ID to check
- `checkIn` (required): Check-in date (YYYY-MM-DD format)
- `checkOut` (required): Check-out date (YYYY-MM-DD format)

**Example Request:**
```
GET /api/bookings/availability?roomId=1&checkIn=2025-12-01&checkOut=2025-12-05
```

**Available Response:**
```json
{
  "available": true,
  "message": "Room is available for selected dates",
  "nextBooking": {
    "checkIn": "2025-12-10T00:00:00Z",
    "checkOut": "2025-12-15T00:00:00Z"
  }
}
```

**Not Available Response:**
```json
{
  "available": false,
  "message": "Room is not available for selected dates",
  "conflictDates": {
    "checkIn": "2025-12-02T00:00:00Z",
    "checkOut": "2025-12-06T00:00:00Z"
  }
}
```

---

### 3. Get Booked Dates for Room
**Endpoint:** `GET /api/rooms/:roomId/booked-dates`

**Example Request:**
```
GET /api/rooms/1/booked-dates
```

**Response:**
```json
{
  "room": {
    "id": 1,
    "name": "Atlas Suite",
    "price": 150
  },
  "totalBookings": 3,
  "bookedDateRanges": [
    {
      "id": 1,
      "checkIn": "2025-12-01T00:00:00Z",
      "checkOut": "2025-12-05T00:00:00Z",
      "status": "pending",
      "guestName": "John Doe"
    },
    {
      "id": 2,
      "checkIn": "2025-12-10T00:00:00Z",
      "checkOut": "2025-12-15T00:00:00Z",
      "status": "confirmed",
      "guestName": "Jane Smith"
    }
  ],
  "message": "3 booking(s) found for this room"
}
```

---

## Frontend Integration

### Using the Availability Hook

```tsx
import { useAvailabilityCheck } from "@/lib/hooks/useAvailabilityCheck"

function MyBookingComponent() {
  const { isChecking, availabilityResult, checkAvailability, getBookedDates } = useAvailabilityCheck()

  const handleDatesChange = async (roomId, checkIn, checkOut) => {
    const result = await checkAvailability(roomId, checkIn, checkOut)
    
    if (result?.available) {
      console.log("Room is available!")
    } else {
      console.log("Room is not available for these dates")
    }
  }

  const loadBookedDates = async (roomId) => {
    const bookedDates = await getBookedDates(roomId)
    console.log("Booked dates:", bookedDates.bookedDateRanges)
  }

  return (
    // Your component JSX
  )
}
```

### In Booking Form

The booking form now includes:
1. **Real-time validation** of dates
2. **Conflict detection** on submit
3. **User-friendly error messages** explaining why a booking failed
4. **Suggestions** for available alternatives

**Error Message Examples:**
- ✗ "The room is already booked from Dec 2, 2025 to Dec 6, 2025. Please select different dates or try another room."
- ✓ "Booking Request Sent! Thank you! We'll contact you shortly at john@example.com to confirm."

---

## Database Queries

### Query: Find Conflicting Bookings
```sql
SELECT * FROM bookings 
WHERE roomId = ? 
  AND status IN ('confirmed', 'pending')
  AND checkIn < ?
  AND checkOut > ?
LIMIT 1;
```

This query finds any booking that:
- Belongs to the same room
- Is confirmed or pending (not cancelled)
- Starts before our checkout
- Ends after our checkin

---

## Booking Status Handling

The system only prevents double bookings for:
- **"confirmed"** bookings (guest has paid)
- **"pending"** bookings (booking request submitted)

The system allows double bookings for:
- **"cancelled"** bookings (user cancelled)
- **"rejected"** bookings (admin rejected)

**Current Status Values:**
```
- "pending": Initial state after submission
- "confirmed": After payment/admin approval
- "cancelled": User or admin cancelled
- "rejected": Admin rejected the booking
```

---

## Best Practices

### 1. For Administrators
- Review pending bookings promptly
- Confirm valid bookings to prevent overbooking
- Reject invalid bookings immediately

### 2. For Frontend Developers
- Always check availability before showing the booking form
- Refresh availability list when dates change
- Show booking calendar with blocked dates

### 3. For Performance
- Cache availability results for 5 minutes
- Use debouncing when checking availability on every date change
- Load booked dates once per room, not per date change

### 4. For Data Integrity
- Ensure all bookings have valid dates (checkOut > checkIn)
- Set default status to "pending" for new bookings
- Archive old bookings after a certain period

---

## Transaction Safety

The booking creation includes proper error handling:
1. Date validation happens BEFORE database query
2. Conflict check happens BEFORE creating the booking
3. If conflict detected, NO booking is created
4. Only after passing all checks, booking is created and returned

---

## Future Enhancements

1. **Booking Calendar Widget**
   - Visual calendar showing booked/available dates
   - Click to select date ranges
   - Real-time availability display

2. **Waitlist Feature**
   - Allow guests to join waitlist if room is booked
   - Auto-notify when dates become available

3. **Price Adjustments**
   - Different pricing for different seasons
   - Discount for longer stays
   - Peak/off-season pricing

4. **Multi-Room Logic**
   - Find alternative rooms when primary is booked
   - Room type availability (Suite vs Standard)

5. **Integration with External Platforms**
   - Sync bookings with Booking.com, Airbnb
   - Prevent conflicts across platforms

6. **Email Notifications**
   - Send confirmation email to guest
   - Send booking alert to admin
   - Send reminder before check-in

---

## Troubleshooting

### Issue: "Room is not available" even though it appears available

**Solution:**
1. Check if there are any "pending" bookings (not just "confirmed")
2. Verify check-in/out dates are in correct format
3. Ensure timezone handling is consistent

### Issue: Adjacent bookings are being rejected

**Expected Behavior:**
- Checkout on Sept 5 + Checkin on Sept 5 = ALLOWED (same-day turnover)
- If this is not working, check the conflict detection logic

### Issue: Cancelled bookings are still blocking dates

**Solution:**
1. Verify booking status was updated to "cancelled"
2. Check that the API query filters for "pending" and "confirmed" only

---

## Testing Checklist

- [x] Two bookings for same dates on same room → 2nd booking rejected
- [x] Two bookings with overlap → 2nd booking rejected
- [x] Two bookings adjacent dates (checkout/checkin same day) → Both allowed
- [x] Error message displays conflicting dates clearly
- [x] Availability endpoint returns correct results
- [x] Booked dates endpoint shows all bookings for room
- [x] Form validation triggers before API call
- [x] Success message shows confirmation
- [ ] Calendar shows blocked dates
- [ ] Email notification sent to admin
- [ ] Email confirmation sent to guest

---

## Implementation Timeline

- ✅ **Phase 1:** Conflict detection logic (COMPLETED)
- ✅ **Phase 2:** API endpoints (COMPLETED)
- ✅ **Phase 3:** Frontend integration (COMPLETED)
- ⏳ **Phase 4:** Calendar widget (TODO)
- ⏳ **Phase 5:** Email notifications (TODO)
- ⏳ **Phase 6:** External platform sync (TODO)

---

## Support & Questions

For questions about the double booking prevention system:
- Check the API endpoint documentation above
- Review the hook usage examples
- Test with the provided scenarios

For bug reports:
- Include the error message
- Provide the dates and room ID
- Describe the expected behavior
