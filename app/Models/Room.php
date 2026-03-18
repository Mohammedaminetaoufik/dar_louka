<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'name_en', 'name_fr', 'description_en', 'description_fr',
        'price', 'capacity', 'surface', 'amenities', 'amenities_fr', 'amenities_en', 'image', 'images',
        'ical_import_urls', 'ical_token', 'last_ical_sync',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'capacity' => 'integer',
        'surface' => 'integer',
        'last_ical_sync' => 'datetime',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function getAmenitiesArrayAttribute()
    {
        if (empty($this->amenities)) {
            return [];
        }

        $decoded = json_decode($this->amenities, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function getAmenitiesFrArrayAttribute()
    {
        if (empty($this->amenities_fr)) {
            return [];
        }

        $decoded = json_decode($this->amenities_fr, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function getAmenitiesEnArrayAttribute()
    {
        if (empty($this->amenities_en)) {
            return [];
        }

        $decoded = json_decode($this->amenities_en, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function getImagesArrayAttribute()
    {
        if (empty($this->images)) {
            return [];
        }

        $decoded = json_decode($this->images, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function getIcalImportUrlsArrayAttribute()
    {
        if (empty($this->ical_import_urls)) {
            return [];
        }

        $decoded = json_decode($this->ical_import_urls, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function getNameAttribute()
    {
        $lang = app()->getLocale();
        return $lang === 'fr' ? $this->name_fr : $this->name_en;
    }

    public function getTranslatedNameAttribute()
    {
        return $this->getNameAttribute();
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

    public function getTranslatedAmenitiesAttribute()
    {
        $lang = app()->getLocale();
        $primary = $lang === 'fr' ? $this->amenities_fr_array : $this->amenities_en_array;
        $secondary = $lang === 'fr' ? $this->amenities_en_array : $this->amenities_fr_array;

        if (!empty($primary)) {
            return $primary;
        }

        if (!empty($secondary)) {
            return $secondary;
        }

        return $this->amenities_array;
    }
}
