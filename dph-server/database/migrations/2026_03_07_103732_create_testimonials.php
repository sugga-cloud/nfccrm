<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            // This creates a profile_id column and links it to the 'id' on the 'profiles' table
            $table->foreignId('profile_id')->constrained()->onDelete('cascade');
            
            $table->string('reviewer_name');
            $table->text('content');
            $table->integer('rating')->default(5); // 1-5 stars
            $table->boolean('is_visible')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};