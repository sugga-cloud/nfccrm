<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('social_links', function (Blueprint $table) {
        $table->id();
        // Use this specific syntax if the standard constrained() fails
        $table->string('platform');
        $table->text('url');
        $table->timestamps();
        $table->foreignId('profile_id')->constrained()->onDelete('cascade');

    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_links');
    }
};
