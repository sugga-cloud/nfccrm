<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Contracts\Encryption\DecryptException;

class RazorpaySetting extends Model
{
    protected $fillable = [
        'live_key_id',
        'live_key_secret',
        'test_key_id',
        'test_key_secret',
        'webhook_url',
        'webhook_secret',
        'is_live',
        'currency'
    ];

    /**
     * Fix: Apply the Attribute cast to the specific columns.
     * Your previous version named the method 'keySecret', which didn't match a column name.
     */
    protected function liveKeySecret(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->safeDecrypt($value),
            set: fn ($value) => $value ? Crypt::encryptString($value) : null,
        );
    }

    protected function testKeySecret(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->safeDecrypt($value),
            set: fn ($value) => $value ? Crypt::encryptString($value) : null,
        );
    }

    protected function webhookSecret(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->safeDecrypt($value),
            set: fn ($value) => $value ? Crypt::encryptString($value) : null,
        );
    }

    /**
     * Helper to prevent the app from crashing if APP_KEY changes
     */
    private function safeDecrypt($value)
    {
        if (!$value) return null;
        try {
            return Crypt::decryptString($value);
        } catch (DecryptException $e) {
            return null; // Return null instead of 405/500 error
        }
    }

    /**
     * Simplified Accessors
     * Since the Attributes above already handle decryption, we just return the value.
     */
    public function getActiveKeyIdAttribute()
    {
        return $this->is_live ? $this->live_key_id : $this->test_key_id;
    }

    public function getActiveKeySecretAttribute()
    {
        // No Crypt::decryptString here! The Attribute cast already did it.
        return $this->is_live ? $this->live_key_secret : $this->test_key_secret;
    }

    public static function getConfig()
    {
        return self::first();
    }
}