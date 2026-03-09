<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Event;
use App\Models\Booking;
use App\Models\GalleryImage;
use App\Models\ContactSubmission;

class DashboardController extends Controller
{
    public function index()
    {
        $rooms = Room::orderBy('created_at', 'desc')->get();
        $events = Event::orderBy('start_date', 'desc')->get();
        $roomBookings = Booking::whereNotNull('room_id')->with('room')->orderBy('created_at', 'desc')->get();
        $eventBookings = Booking::whereNotNull('event_id')->with('event')->orderBy('created_at', 'desc')->get();
        $galleryImages = GalleryImage::orderBy('created_at', 'desc')->get();
        $contacts = ContactSubmission::orderBy('created_at', 'desc')->get();

        // Prepare JSON data for JS
        $roomsJson = $rooms->map(function($r) {
            return [
                'id' => $r->id,
                'name_fr' => $r->name_fr,
                'name_en' => $r->name_en,
                'description_fr' => $r->description_fr,
                'description_en' => $r->description_en,
                'price' => $r->price,
                'capacity' => $r->capacity,
                'amenities' => $r->amenities,
                'image' => $r->image,
                'images' => $r->images,
                'ical_token' => $r->ical_token,
                'ical_import_urls' => $r->ical_import_urls_array,
                'last_ical_sync' => $r->last_ical_sync ? $r->last_ical_sync->format('d/m/Y H:i') : null,
                'export_url' => $r->ical_token ? url('/ical/' . $r->ical_token) : null,
            ];
        });

        $eventsJson = $events->map(function($e) {
            return [
                'id' => $e->id,
                'title_fr' => $e->title_fr,
                'title_en' => $e->title_en,
                'description_fr' => $e->description_fr,
                'description_en' => $e->description_en,
                'start_date' => $e->start_date ? $e->start_date->format('Y-m-d') : null,
                'end_date' => $e->end_date ? $e->end_date->format('Y-m-d') : null,
                'type' => $e->type,
                'price' => $e->price,
                'max_participants' => $e->max_participants,
                'program_fr' => $e->program_fr,
                'program_en' => $e->program_en,
                'image' => $e->image,
            ];
        });

        $galleryJson = $galleryImages->map(function($g) {
            return [
                'id' => $g->id,
                'title_fr' => $g->title_fr,
                'title_en' => $g->title_en,
                'description_fr' => $g->description_fr,
                'description_en' => $g->description_en,
                'category' => $g->category,
                'image' => $g->image,
            ];
        });

        $bookingsJson = $roomBookings->map(function($b) {
            return [
                'id' => $b->id,
                'name' => $b->name,
                'email' => $b->email,
                'phone' => $b->phone,
                'room_name' => $b->room ? ($b->room->name_fr ?: $b->room->name_en) : '',
                'check_in' => $b->check_in,
                'check_out' => $b->check_out,
                'guests' => $b->guests,
                'special_requests' => $b->special_requests,
                'status' => $b->status,
            ];
        });

        $eventBookingsJson = $eventBookings->map(function($b) {
            return [
                'id' => $b->id,
                'name' => $b->name,
                'email' => $b->email,
                'phone' => $b->phone,
                'event_name' => $b->event ? ($b->event->title_fr ?: $b->event->title_en) : '',
                'check_in' => $b->check_in,
                'check_out' => $b->check_out,
                'guests' => $b->guests,
                'special_requests' => $b->special_requests,
                'status' => $b->status,
            ];
        });

        return view('admin.dashboard', compact(
            'rooms', 'events', 'roomBookings', 'eventBookings', 'galleryImages', 'contacts',
            'roomsJson', 'eventsJson', 'galleryJson', 'bookingsJson', 'eventBookingsJson'
        ));
    }
}
