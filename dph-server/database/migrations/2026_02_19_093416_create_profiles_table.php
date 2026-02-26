<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('username')->unique();
            $table->string('cover_image')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('designation')->nullable();
            $table->string('company_name')->nullable();
            $table->text('company_description')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('whatsapp')->nullable();
            $table->text('google_map_link')->nullable();
            $table->text('address')->nullable();
            $table->string('website')->nullable();
            $table->string('qr_code_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
