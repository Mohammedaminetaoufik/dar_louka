<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class ICalController extends Controller
{
    /**
     * Export iCal feed for a room (public endpoint - accessed by Booking.com / Airbnb / etc.)
     * GET /ical/{token}
     */
    public function export($token)
    {
        $room = Room::where('ical_token', $token)->first();

        if (!$room) {
            abort(404, 'Calendar not found');
        }

        // Get all non-cancelled bookings for this room
        $bookings = Booking::where('room_id', $room->id)
            ->where('status', '!=', 'cancelled')
            ->orderBy('check_in')
            ->get();

        $calendarName = 'Dar Louka - ' . ($room->name_fr ?: $room->name_en);

        $ical  = "BEGIN:VCALENDAR\r\n";
        $ical .= "VERSION:2.0\r\n";
        $ical .= "PRODID:-//Dar Louka//Room Calendar//FR\r\n";
        $ical .= "CALSCALE:GREGORIAN\r\n";
        $ical .= "METHOD:PUBLISH\r\n";
        $ical .= "X-WR-CALNAME:" . $this->escapeIcal($calendarName) . "\r\n";
        $ical .= "X-WR-TIMEZONE:Africa/Casablanca\r\n";

        foreach ($bookings as $booking) {
            $uid = 'darlouka-booking-' . $booking->id . '@darlouka.com';
            $dtStart = Carbon::parse($booking->check_in)->format('Ymd');
            $dtEnd = Carbon::parse($booking->check_out)->format('Ymd');
            $created = Carbon::parse($booking->created_at)->format('Ymd\THis\Z');
            $summary = 'Réservé - ' . ($booking->name ?: 'Client');
            $description = 'Chambre: ' . ($room->name_fr ?: $room->name_en);
            $description .= '\\nClient: ' . ($booking->name ?: 'N/A');
            $description .= '\\nVoyageurs: ' . $booking->guests;
            if ($booking->special_requests) {
                $description .= '\\nDemandes: ' . str_replace("\n", '\\n', $booking->special_requests);
            }
            $description .= '\\nStatut: ' . $booking->status;

            $ical .= "BEGIN:VEVENT\r\n";
            $ical .= "UID:" . $uid . "\r\n";
            $ical .= "DTSTART;VALUE=DATE:" . $dtStart . "\r\n";
            $ical .= "DTEND;VALUE=DATE:" . $dtEnd . "\r\n";
            $ical .= "DTSTAMP:" . $created . "\r\n";
            $ical .= "SUMMARY:" . $this->escapeIcal($summary) . "\r\n";
            $ical .= "DESCRIPTION:" . $this->escapeIcal($description) . "\r\n";
            $ical .= "STATUS:CONFIRMED\r\n";
            $ical .= "TRANSP:OPAQUE\r\n";
            $ical .= "END:VEVENT\r\n";
        }

        $ical .= "END:VCALENDAR\r\n";

        return response($ical, 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'inline; filename="' . Str::slug($calendarName) . '.ics"',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
        ]);
    }

    /**
     * Import/sync bookings from external iCal URLs for a specific room
     * POST /api/rooms/{id}/sync-ical (admin only)
     */
    public function syncRoom(Request $request, $id)
    {
        $room = Room::findOrFail($id);
        $urls = $room->ical_import_urls_array;

        if (empty($urls)) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune URL iCal configurée pour cette chambre.',
            ]);
        }

        $results = [];
        $totalImported = 0;
        $totalUpdated = 0;
        $totalSkipped = 0;

        foreach ($urls as $urlEntry) {
            $url = is_array($urlEntry) ? ($urlEntry['url'] ?? '') : $urlEntry;
            $platform = is_array($urlEntry) ? ($urlEntry['platform'] ?? 'other') : 'other';

            if (empty($url)) continue;

            try {
                $icalContent = $this->fetchIcalContent($url);
                $events = $this->parseIcal($icalContent);

                foreach ($events as $event) {
                    $result = $this->processExternalEvent($room, $event, $platform);
                    if ($result === 'imported') $totalImported++;
                    elseif ($result === 'updated') $totalUpdated++;
                    else $totalSkipped++;
                }

                $results[] = [
                    'url' => $url,
                    'platform' => $platform,
                    'status' => 'success',
                    'events_found' => count($events),
                ];

            } catch (\Exception $e) {
                $results[] = [
                    'url' => $url,
                    'platform' => $platform,
                    'status' => 'error',
                    'error' => $e->getMessage(),
                ];
            }
        }

        // Update last sync timestamp
        $room->update(['last_ical_sync' => now()]);

        return response()->json([
            'success' => true,
            'message' => "Synchronisation terminée : {$totalImported} importé(s), {$totalUpdated} mis à jour, {$totalSkipped} ignoré(s).",
            'imported' => $totalImported,
            'updated' => $totalUpdated,
            'skipped' => $totalSkipped,
            'details' => $results,
        ]);
    }

    /**
     * Sync all rooms at once (admin only, or artisan command)
     * POST /api/sync-ical-all
     */
    public function syncAll()
    {
        $rooms = Room::whereNotNull('ical_import_urls')->get();
        $allResults = [];

        foreach ($rooms as $room) {
            $urls = $room->ical_import_urls_array;
            if (empty($urls)) continue;

            $roomResult = [
                'room_id' => $room->id,
                'room_name' => $room->name_fr ?: $room->name_en,
                'synced' => 0,
                'errors' => 0,
            ];

            foreach ($urls as $urlEntry) {
                $url = is_array($urlEntry) ? ($urlEntry['url'] ?? '') : $urlEntry;
                $platform = is_array($urlEntry) ? ($urlEntry['platform'] ?? 'other') : 'other';

                if (empty($url)) continue;

                try {
                    $icalContent = $this->fetchIcalContent($url);
                    $events = $this->parseIcal($icalContent);

                    foreach ($events as $event) {
                        $this->processExternalEvent($room, $event, $platform);
                    }

                    $roomResult['synced'] += count($events);
                } catch (\Exception $e) {
                    $roomResult['errors']++;
                }
            }

            $room->update(['last_ical_sync' => now()]);
            $allResults[] = $roomResult;
        }

        return response()->json([
            'success' => true,
            'message' => 'Synchronisation globale terminée.',
            'results' => $allResults,
        ]);
    }

    /**
     * Update iCal import URLs for a room
     * PUT /api/rooms/{id}/ical-urls
     */
    public function updateIcalUrls(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $request->validate([
            'ical_import_urls' => 'required|array',
            'ical_import_urls.*.url' => 'required|url',
            'ical_import_urls.*.platform' => 'required|string|in:booking,airbnb,tripadvisor,vrbo,other',
        ]);

        $room->update([
            'ical_import_urls' => json_encode($request->input('ical_import_urls')),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'URLs iCal mises à jour.',
            'ical_import_urls' => $room->fresh()->ical_import_urls_array,
        ]);
    }

    /**
     * Regenerate iCal token for a room
     * POST /api/rooms/{id}/regenerate-ical-token
     */
    public function regenerateToken($id)
    {
        $room = Room::findOrFail($id);
        $room->update(['ical_token' => Str::random(32)]);

        return response()->json([
            'success' => true,
            'ical_token' => $room->fresh()->ical_token,
            'export_url' => url('/ical/' . $room->fresh()->ical_token),
        ]);
    }

    /* ================================================
     * PRIVATE HELPER METHODS
     * ================================================ */

    /**
     * Fetch iCal content from a remote URL
     */
    private function fetchIcalContent($url)
    {
        $context = stream_context_create([
            'http' => [
                'timeout' => 30,
                'header' => "User-Agent: DarLouka-CalSync/1.0\r\n",
            ],
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
            ],
        ]);

        $content = @file_get_contents($url, false, $context);

        if ($content === false) {
            throw new \Exception("Impossible de récupérer le calendrier depuis: {$url}");
        }

        return $content;
    }

    /**
     * Parse iCal content into an array of events
     */
    private function parseIcal($content)
    {
        $events = [];
        $lines = preg_split('/\r\n|\n|\r/', $content);

        // Unfold long lines (RFC 5545: lines starting with space/tab are continuations)
        $unfolded = [];
        foreach ($lines as $line) {
            if (preg_match('/^[ \t]/', $line) && count($unfolded) > 0) {
                $unfolded[count($unfolded) - 1] .= ltrim($line);
            } else {
                $unfolded[] = $line;
            }
        }

        $inEvent = false;
        $currentEvent = [];

        foreach ($unfolded as $line) {
            $line = trim($line);

            if ($line === 'BEGIN:VEVENT') {
                $inEvent = true;
                $currentEvent = [];
                continue;
            }

            if ($line === 'END:VEVENT') {
                $inEvent = false;
                if (!empty($currentEvent)) {
                    $events[] = $currentEvent;
                }
                continue;
            }

            if ($inEvent && strpos($line, ':') !== false) {
                // Handle properties with parameters (e.g., DTSTART;VALUE=DATE:20240101)
                $colonPos = strpos($line, ':');
                $key = substr($line, 0, $colonPos);
                $value = substr($line, $colonPos + 1);

                // Extract base property name (before any parameters)
                $semiPos = strpos($key, ';');
                $baseName = $semiPos !== false ? substr($key, 0, $semiPos) : $key;

                $currentEvent[strtoupper($baseName)] = $value;
            }
        }

        return $events;
    }

    /**
     * Process a single external iCal event and create/update booking
     */
    private function processExternalEvent($room, $event, $platform)
    {
        $uid = $event['UID'] ?? null;
        if (!$uid) return 'skipped';

        $checkIn = $this->parseIcalDate($event['DTSTART'] ?? null);
        $checkOut = $this->parseIcalDate($event['DTEND'] ?? null);

        if (!$checkIn || !$checkOut) return 'skipped';

        // Skip past events
        if ($checkOut < now()) return 'skipped';

        $summary = $this->unescapeIcal($event['SUMMARY'] ?? 'Réservation externe');
        $description = $this->unescapeIcal($event['DESCRIPTION'] ?? '');

        // Determine the external ID field based on platform
        $externalIdField = match ($platform) {
            'booking' => 'booking_com_id',
            'airbnb' => 'airbnb_id',
            'tripadvisor' => 'tripadvisor_id',
            default => 'booking_com_id',
        };

        // Check if this external booking already exists
        $existing = Booking::where('room_id', $room->id)
            ->where($externalIdField, $uid)
            ->first();

        if ($existing) {
            // Update dates if changed
            $updated = false;
            if ($existing->check_in->format('Y-m-d') !== $checkIn->format('Y-m-d') ||
                $existing->check_out->format('Y-m-d') !== $checkOut->format('Y-m-d')) {
                $existing->update([
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'external_status' => $event['STATUS'] ?? 'CONFIRMED',
                ]);
                $updated = true;
            }
            return $updated ? 'updated' : 'skipped';
        }

        // Check for date conflicts with existing bookings
        $conflict = Booking::where('room_id', $room->id)
            ->where('status', '!=', 'cancelled')
            ->where('check_in', '<', $checkOut)
            ->where('check_out', '>', $checkIn)
            ->first();

        if ($conflict) {
            // If conflict exists with a local booking, skip (manual resolution needed)
            return 'skipped';
        }

        // Create new booking from external source
        Booking::create([
            'room_id' => $room->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guests' => 1,
            'name' => $summary ?: "Réservation {$platform}",
            'email' => "{$platform}@external.darlouka.com",
            'phone' => '-',
            'special_requests' => $description ?: null,
            'status' => 'confirmed',
            $externalIdField => $uid,
            'external_status' => $event['STATUS'] ?? 'CONFIRMED',
        ]);

        return 'imported';
    }

    /**
     * Parse an iCal date string to Carbon
     */
    private function parseIcalDate($dateStr)
    {
        if (!$dateStr) return null;

        try {
            // Format: 20240115 (DATE only)
            if (preg_match('/^\d{8}$/', $dateStr)) {
                return Carbon::createFromFormat('Ymd', $dateStr)->startOfDay();
            }

            // Format: 20240115T120000 (local datetime)
            if (preg_match('/^\d{8}T\d{6}$/', $dateStr)) {
                return Carbon::createFromFormat('Ymd\THis', $dateStr);
            }

            // Format: 20240115T120000Z (UTC datetime)
            if (preg_match('/^\d{8}T\d{6}Z$/', $dateStr)) {
                return Carbon::createFromFormat('Ymd\THis\Z', $dateStr, 'UTC');
            }

            // Try generic parse
            return Carbon::parse($dateStr);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Escape text for iCal output
     */
    private function escapeIcal($text)
    {
        $text = str_replace('\\', '\\\\', $text);
        $text = str_replace(',', '\\,', $text);
        $text = str_replace(';', '\\;', $text);
        return $text;
    }

    /**
     * Unescape iCal text
     */
    private function unescapeIcal($text)
    {
        $text = str_replace('\\n', "\n", $text);
        $text = str_replace('\\,', ',', $text);
        $text = str_replace('\\;', ';', $text);
        $text = str_replace('\\\\', '\\', $text);
        return $text;
    }
}
