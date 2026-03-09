<?php

namespace App\Console\Commands;

use App\Models\Room;
use App\Models\Booking;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SyncIcalCalendars extends Command
{
    protected $signature = 'ical:sync {--room= : Sync a specific room by ID}';
    protected $description = 'Synchronise les calendriers iCal externes pour toutes les chambres (ou une chambre spécifique)';

    public function handle()
    {
        $roomId = $this->option('room');

        if ($roomId) {
            $rooms = Room::where('id', $roomId)->whereNotNull('ical_import_urls')->get();
        } else {
            $rooms = Room::whereNotNull('ical_import_urls')->get();
        }

        if ($rooms->isEmpty()) {
            $this->info('Aucune chambre avec des URLs iCal configurées.');
            return 0;
        }

        $this->info("Synchronisation de {$rooms->count()} chambre(s)...");

        foreach ($rooms as $room) {
            $this->syncRoom($room);
        }

        $this->info('Synchronisation terminée !');
        return 0;
    }

    private function syncRoom(Room $room)
    {
        $urls = $room->ical_import_urls_array;
        if (empty($urls)) return;

        $roomName = $room->name_fr ?: $room->name_en;
        $this->line("  → Chambre: {$roomName}");

        foreach ($urls as $urlEntry) {
            $url = is_array($urlEntry) ? ($urlEntry['url'] ?? '') : $urlEntry;
            $platform = is_array($urlEntry) ? ($urlEntry['platform'] ?? 'other') : 'other';

            if (empty($url)) continue;

            try {
                $content = $this->fetchIcal($url);
                $events = $this->parseIcal($content);
                $imported = 0;
                $updated = 0;
                $skipped = 0;

                foreach ($events as $event) {
                    $result = $this->processEvent($room, $event, $platform);
                    if ($result === 'imported') $imported++;
                    elseif ($result === 'updated') $updated++;
                    else $skipped++;
                }

                $this->info("    [{$platform}] {$imported} importé(s), {$updated} mis à jour, {$skipped} ignoré(s)");
            } catch (\Exception $e) {
                $this->error("    [{$platform}] Erreur: {$e->getMessage()}");
            }
        }

        $room->update(['last_ical_sync' => now()]);
    }

    private function fetchIcal($url)
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
            throw new \Exception("Impossible de récupérer: {$url}");
        }
        return $content;
    }

    private function parseIcal($content)
    {
        $events = [];
        $lines = preg_split('/\r\n|\n|\r/', $content);

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
                if (!empty($currentEvent)) $events[] = $currentEvent;
                continue;
            }
            if ($inEvent && strpos($line, ':') !== false) {
                $colonPos = strpos($line, ':');
                $key = substr($line, 0, $colonPos);
                $value = substr($line, $colonPos + 1);
                $semiPos = strpos($key, ';');
                $baseName = $semiPos !== false ? substr($key, 0, $semiPos) : $key;
                $currentEvent[strtoupper($baseName)] = $value;
            }
        }

        return $events;
    }

    private function processEvent($room, $event, $platform)
    {
        $uid = $event['UID'] ?? null;
        if (!$uid) return 'skipped';

        $checkIn = $this->parseDate($event['DTSTART'] ?? null);
        $checkOut = $this->parseDate($event['DTEND'] ?? null);
        if (!$checkIn || !$checkOut) return 'skipped';
        if ($checkOut < now()) return 'skipped';

        $summary = $this->unescape($event['SUMMARY'] ?? 'Réservation externe');
        $description = $this->unescape($event['DESCRIPTION'] ?? '');

        $externalIdField = match ($platform) {
            'booking' => 'booking_com_id',
            'airbnb' => 'airbnb_id',
            'tripadvisor' => 'tripadvisor_id',
            default => 'booking_com_id',
        };

        $existing = Booking::where('room_id', $room->id)->where($externalIdField, $uid)->first();

        if ($existing) {
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

        $conflict = Booking::where('room_id', $room->id)
            ->where('status', '!=', 'cancelled')
            ->where('check_in', '<', $checkOut)
            ->where('check_out', '>', $checkIn)
            ->first();

        if ($conflict) return 'skipped';

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

    private function parseDate($dateStr)
    {
        if (!$dateStr) return null;
        try {
            if (preg_match('/^\d{8}$/', $dateStr)) return Carbon::createFromFormat('Ymd', $dateStr)->startOfDay();
            if (preg_match('/^\d{8}T\d{6}$/', $dateStr)) return Carbon::createFromFormat('Ymd\THis', $dateStr);
            if (preg_match('/^\d{8}T\d{6}Z$/', $dateStr)) return Carbon::createFromFormat('Ymd\THis\Z', $dateStr, 'UTC');
            return Carbon::parse($dateStr);
        } catch (\Exception $e) {
            return null;
        }
    }

    private function unescape($text)
    {
        $text = str_replace('\\n', "\n", $text);
        $text = str_replace('\\,', ',', $text);
        $text = str_replace('\\;', ';', $text);
        $text = str_replace('\\\\', '\\', $text);
        return $text;
    }
}
