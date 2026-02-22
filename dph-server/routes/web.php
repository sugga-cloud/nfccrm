<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

Route::get('/create-admin', function () {

    // Check if admin role exists
    $role = Role::firstOrCreate(
        ['name' => 'admin']
    );

    // Create admin user
    $admin = User::firstOrCreate(
        ['email' => 'admin@example.com'],
        [
            'full_name' => 'Super Admin',
            'role_id' => $role->id,
            'password' => Hash::make('password123'),
            'is_active' => true,
        ]
    );

    return response()->json([
        'message' => 'Admin created successfully',
        'email' => 'admin@example.com',
        'password' => 'password123'
    ]);
});

Route::get('/', function () {
    return response()->json([
        'message' => 'API Server Running'
    ]);
});
