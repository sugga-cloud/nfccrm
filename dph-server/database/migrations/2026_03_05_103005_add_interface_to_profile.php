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
    Schema::table('profiles', function (Blueprint $table) {
        // Use string if your IDs are like "midnight" or "1"
        // Use integer if they are strictly numbers
        $table->string('interface_id')->default('1')->after('username'); 
    });
}

public function down(): void
{
    Schema::table('profiles', function (Blueprint $table) {
        $table->dropColumn('interface_id');
    });
}
};
