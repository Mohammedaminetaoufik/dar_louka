<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('room_id')->nullable();
            $table->unsignedBigInteger('event_id')->nullable();
            $table->dateTime('check_in');
            $table->dateTime('check_out');
            $table->integer('guests');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->text('special_requests')->nullable();
            $table->string('status')->default('pending');
            $table->string('booking_com_id')->nullable();
            $table->string('airbnb_id')->nullable();
            $table->string('tripadvisor_id')->nullable();
            $table->string('external_status')->nullable();
            $table->timestamps();

            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
