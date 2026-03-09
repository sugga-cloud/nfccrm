<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            // We update the enum to include 'pending'
            // We also set 'pending' as the default for new records
            $table->enum('status', ['pending', 'active', 'cancelled', 'expired'])
                  ->default('pending')
                  ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            // Revert back to original (remove pending)
            // Note: This may fail if you have 'pending' records in the DB
            $table->enum('status', ['active', 'cancelled', 'expired'])
                  ->default('active')
                  ->change();
        });
    }
};
