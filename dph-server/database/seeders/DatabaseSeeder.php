<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
{
    // Use firstOrCreate to prevent "Duplicate Entry" errors on redeploy
    User::firstOrCreate(
        ['email' => 'admin@example.com'], // The unique field to check
        [
            'full_name' => 'admin',
            'role_id' => 1, // Fixed spelling from rold_id
            'password' => bcrypt('password123'), // Encrypt the password
        ]
    );
}
}
