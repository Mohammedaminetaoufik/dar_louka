<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'room_id', 'event_id', 'check_in', 'check_out', 'guests',
        'name', 'email', 'phone', 'special_requests', 'status',
        'booking_com_id', 'airbnb_id', 'tripadvisor_id', 'external_status',
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'guests' => 'integer',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
