<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title_en', 'title_fr', 'description_en', 'description_fr',
        'start_date', 'end_date', 'type', 'program_en', 'program_fr',
        'max_participants', 'price', 'image',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'program_en' => 'array',
        'program_fr' => 'array',
        'max_participants' => 'integer',
        'price' => 'decimal:2',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function getTitleAttribute()
    {
        $lang = app()->getLocale();
        return $lang === 'fr' ? $this->title_fr : $this->title_en;
    }

    public function getTranslatedTitleAttribute()
    {
        return $this->getTitleAttribute();
    }

    public function getDescriptionAttribute()
    {
        $lang = app()->getLocale();
        return $lang === 'fr' ? $this->description_fr : $this->description_en;
    }

    public function getTranslatedDescriptionAttribute()
    {
        return $this->getDescriptionAttribute();
    }
}
