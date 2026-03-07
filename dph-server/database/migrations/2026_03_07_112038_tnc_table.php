<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::create('legal_documents', function (Blueprint $table) {
        $table->id();
        $table->foreignId('profile_id')->constrained()->onDelete('cascade');
        $table->string('type')->default('terms'); // e.g., 'terms', 'privacy'
        $table->string('title')->nullable();
        $table->longText('content');
        $table->boolean('is_active')->default(true);
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('legal_documents');
}
};
