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
    Schema::table('users', function (Blueprint $table) {
        // This adds the default value to the existing column
        $table->foreignId('role_id')->default(2)->change();
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        // Removes the default if rolled back
        $table->foreignId('role_id')->default(null)->change();
    });
}
};
