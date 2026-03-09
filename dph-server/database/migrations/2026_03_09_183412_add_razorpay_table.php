<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('razorpay_settings', function (Blueprint $table) {
            $table->id();
            // Live Credentials
            $table->string('live_key_id')->nullable();
            $table->text('live_key_secret')->nullable();
            
            // Test Credentials
            $table->string('test_key_id')->nullable();
            $table->text('test_key_secret')->nullable();
        
            // Common Settings
            $table->string('webhook_url')->nullable();
            $table->text('webhook_secret')->nullable(); 
            $table->boolean('is_live')->default(false); // The Switch
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('razorpay_settings');
    }
};
