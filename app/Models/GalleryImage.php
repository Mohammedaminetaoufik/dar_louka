<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    protected $table = 'gallery_images';

    protected $fillable = [
        'title_en', 'title_fr', 'description_en', 'description_fr',
        'image', 'category',
    ];

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
