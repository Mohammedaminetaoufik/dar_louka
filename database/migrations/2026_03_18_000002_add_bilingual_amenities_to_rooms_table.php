<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->longText('amenities_fr')->nullable()->after('amenities');
            $table->longText('amenities_en')->nullable()->after('amenities_fr');
        });
    }

    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn(['amenities_fr', 'amenities_en']);
        });
    }
};
