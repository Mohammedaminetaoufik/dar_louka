<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
                    'message' => 'Cette chambre n\'est malheureusement plus disponible pour les dates selectionnees. Merci de choisir d\'autres dates ou une autre chambre.',
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

        $this->sendReservationNotification($booking);

        return response()->json($booking, 201);
    }

    private function sendReservationNotification(Booking $booking): void
    {
        // Notify admin on every client reservation without blocking booking creation.
        $booking->loadMissing(['room', 'event']);

        $subject = 'Nouvelle reservation recue - Dar Louka';
        $bodyLines = [
            'Bonjour,',
            '',
            'Une nouvelle reservation a ete soumise via le site Dar Louka.',
            '',
            'Reference: #' . $booking->id,
            $this->buildReservationTargetLabel($booking),
            'Arrivee: ' . optional($booking->check_in)->format('d/m/Y'),
            'Depart: ' . optional($booking->check_out)->format('d/m/Y'),
            'Nombre de voyageurs: ' . $booking->guests,
            '',
            'Coordonnees du client:',
            'Nom complet: ' . $booking->name,
            'Email: ' . $booking->email,
            'Telephone: ' . $booking->phone,
            'Demandes speciales: ' . ($booking->special_requests ?: 'Aucune'),
            '',
            'Statut actuel: ' . $this->formatStatusLabel($booking->status),
            '',
            'Cordialement,',
            'Systeme de reservation Dar Louka',
        ];

        try {
            $adminRecipient = config('mail.admin_notification_address', 'ataoufik031@gmail.com');
            Mail::raw(implode("\n", $bodyLines), function ($message) use ($adminRecipient, $subject) {
                $message->to($adminRecipient)->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::warning('Echec envoi email notification reservation', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function buildReservationTargetLabel(Booking $booking): string
    {
        if ($booking->room) {
            $roomName = $booking->room->name_fr ?: $booking->room->name_en ?: ('#' . $booking->room_id);
            return 'Chambre: ' . $roomName;
        }

        if ($booking->event) {
            $eventName = $booking->event->title_fr ?: $booking->event->title_en ?: ('#' . $booking->event_id);
            return 'Forfait: ' . $eventName;
        }

        return 'Type: Reservation';
    }

    private function formatStatusLabel(string $status): string
    {
        if ($status === 'confirmed') {
            return 'Confirmee';
        }

        if ($status === 'cancelled') {
            return 'Annulee';
        }

        return 'En attente';
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
