<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('profile_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->unique()->constrained()->onDelete('cascade');
            $table->integer('visit_count')->default(0);
            $table->integer('click_count')->default(0);
            $table->integer('enquiry_count')->default(0);
            $table->integer('appointment_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_analytics');
    }
};
