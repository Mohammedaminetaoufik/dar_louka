<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_fr');
            $table->text('description_en')->nullable();
            $table->text('description_fr')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('capacity');
            $table->longText('amenities')->nullable(); // JSON stored as text
            $table->string('image')->nullable();
            $table->longText('images')->nullable(); // JSON stored as text
            $table->longText('ical_import_urls')->nullable(); // JSON stored as text
            $table->string('ical_token')->unique()->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
