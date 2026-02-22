<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Str;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */

public function created(User $user): void
{
    // 1. Get the prefix of the email (e.g., 'sazid' from 'sazid@example.com')
    $emailPrefix = explode('@', $user->email)[0];

    // 2. Generate username: use full_name if available, otherwise use email prefix
    // We strip spaces and special characters to keep the URL clean
    $baseName = $user->full_name 
                ? str_replace(' ', '', $user->full_name) 
                : $emailPrefix;

    // 3. Format: @name + UserID (Guarantees uniqueness)
    $finalUsername = '@' . strtolower($baseName) . $user->id;

    // 4. Create the profile
    $user->profile()->create([
        'username' => $finalUsername,
        'email'    => $user->email, // Pre-filling profile email with account email
        'is_active' => true,
    ]);
}

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
