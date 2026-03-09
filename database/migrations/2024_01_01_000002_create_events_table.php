<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_fr');
            $table->text('description_en')->nullable();
            $table->text('description_fr')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->string('type')->default('ONE_DAY'); // ONE_DAY or THREE_DAYS
            $table->json('program_en')->nullable();
            $table->json('program_fr')->nullable();
            $table->integer('max_participants')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
