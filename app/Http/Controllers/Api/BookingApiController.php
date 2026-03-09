<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingApiController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['room', 'event'])->orderBy('created_at', 'desc')->get();
        return response()->json(['bookings' => $bookings]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date|after_or_equal:check_in',
            'guests' => 'required|integer|min:1',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
        ]);

        // Check for conflicts if room booking
        if ($request->room_id) {
            $conflict = Booking::where('room_id', $request->room_id)
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        $q->where('check_in', '<', $request->check_out)
                            ->where('check_out', '>', $request->check_in);
                    });
                })
                ->first();

            if ($conflict) {
                return response()->json([
                    'error' => 'Room is already booked for the selected dates',
                    'conflictDates' => [
                        'checkIn' => $conflict->check_in,
                        'checkOut' => $conflict->check_out,
                    ],
                ], 409);
            }
        }

        $booking = Booking::create([
            'room_id' => $request->room_id,
            'event_id' => $request->event_id,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'guests' => $request->guests,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'special_requests' => $request->special_requests,
            'status' => 'pending',
        ]);

        return response()->json($booking, 201);
    }

    public function show($id)
    {
        $booking = Booking::with(['room', 'event'])->findOrFail($id);
        return response()->json($booking);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update($request->only([
            'status', 'check_in', 'check_out', 'guests', 'name',
            'email', 'phone', 'special_requests',
        ]));

        return response()->json($booking);
    }

    public function destroy($id)
    {
        Booking::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function availability(Request $request)
    {
        $roomId = $request->query('roomId');
        $checkIn = $request->query('checkIn');
        $checkOut = $request->query('checkOut');

        if (!$roomId || !$checkIn || !$checkOut) {
            return response()->json(['error' => 'Missing parameters'], 400);
        }

        $conflict = Booking::where('room_id', $roomId)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->exists();

        return response()->json(['available' => !$conflict]);
    }
}
