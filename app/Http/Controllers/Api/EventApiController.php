<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;

class EventApiController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('start_date', 'asc')->get();
        return response()->json($events);
    }

    public function show($id)
    {
        $event = Event::findOrFail($id);
        return response()->json($event);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title_en' => 'required|string|max:255',
            'title_fr' => 'required|string|max:255',
            'start_date' => 'required|date',
            'type' => 'required|in:ONE_DAY,THREE_DAYS',
        ]);

        // Auto-calculate end_date based on type
        $startDate = new \DateTime($request->start_date);
        if ($request->type === 'THREE_DAYS') {
            $endDate = $request->end_date
                ? new \DateTime($request->end_date)
                : (clone $startDate)->modify('+3 days');
            $maxAllowed = 4;
        } else {
            $endDate = $request->end_date
                ? new \DateTime($request->end_date)
                : clone $startDate;
            $maxAllowed = 2;
        }

        // Enforce max participants limits
        $maxParticipants = $request->max_participants ? min((int) $request->max_participants, $maxAllowed) : $maxAllowed;

        $event = Event::create([
            'title_en' => $request->title_en,
            'title_fr' => $request->title_fr,
            'description_en' => $request->description_en,
            'description_fr' => $request->description_fr,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'type' => $request->type,
            'program_en' => $request->program_en,
            'program_fr' => $request->program_fr,
            'max_participants' => $maxParticipants,
            'image' => $request->image,
            'price' => $request->price ? (float) $request->price : null,
        ]);

        // If THREE_DAYS forfait, block all rooms for those dates
        if ($request->type === 'THREE_DAYS') {
            $rooms = Room::all();

            foreach ($rooms as $room) {
                Booking::create([
                    'room_id' => $room->id,
                    'event_id' => $event->id,
                    'check_in' => $startDate,
                    'check_out' => $endDate,
                    'guests' => 1,
                    'name' => 'Forfait: ' . $request->title_fr,
                    'email' => 'admin@darlouka.com',
                    'phone' => '0000000000',
                    'status' => 'confirmed',
                    'special_requests' => 'Réservation bloquée automatiquement pour le forfait 3 nuits',
                ]);
            }
        }

        return response()->json($event, 201);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        // Auto-calculate end_date based on type
        $startDate = $request->start_date ? new \DateTime($request->start_date) : $event->start_date;
        $type = $request->type ?? $event->type;

        if ($type === 'THREE_DAYS') {
            $endDate = $request->end_date
                ? new \DateTime($request->end_date)
                : (clone $startDate)->modify('+3 days');
            $maxAllowed = 4;
        } else {
            $endDate = $request->end_date
                ? new \DateTime($request->end_date)
                : clone $startDate;
            $maxAllowed = 2;
        }

        $maxParticipants = $request->max_participants ? min((int) $request->max_participants, $maxAllowed) : $maxAllowed;

        $event->update([
            'title_en' => $request->title_en ?? $event->title_en,
            'title_fr' => $request->title_fr ?? $event->title_fr,
            'description_en' => $request->description_en,
            'description_fr' => $request->description_fr,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'type' => $type,
            'program_en' => $request->program_en,
            'program_fr' => $request->program_fr,
            'max_participants' => $maxParticipants,
            'image' => $request->image,
            'price' => $request->price ? (float) $request->price : null,
        ]);

        // Remove old blocking bookings for this forfait
        Booking::where('event_id', $event->id)
            ->where('email', 'admin@darlouka.com')
            ->where('special_requests', 'like', '%bloquée automatiquement%')
            ->delete();

        // Also remove old-style blocks
        Booking::where('event_id', $event->id)
            ->where('email', 'admin@darlouka.com')
            ->where('special_requests', 'like', '%Automatically blocked%')
            ->delete();

        // If THREE_DAYS, re-create room blocks
        if ($type === 'THREE_DAYS') {
            $rooms = Room::all();
            foreach ($rooms as $room) {
                Booking::create([
                    'room_id' => $room->id,
                    'event_id' => $event->id,
                    'check_in' => $startDate,
                    'check_out' => $endDate,
                    'guests' => 1,
                    'name' => 'Forfait: ' . ($request->title_fr ?? $event->title_fr),
                    'email' => 'admin@darlouka.com',
                    'phone' => '0000000000',
                    'status' => 'confirmed',
                    'special_requests' => 'Réservation bloquée automatiquement pour le forfait 3 nuits',
                ]);
            }
        }

        return response()->json($event);
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        // Remove associated blocking bookings
        Booking::where('event_id', $id)->where('email', 'admin@darlouka.com')->delete();
        $event->delete();
        return response()->json(['success' => true]);
    }
}
