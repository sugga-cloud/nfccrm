<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'profile_id',
        'reviewer_name',
        'content',
        'rating',
        'is_visible',
    ];

    /**
     * Get the profile that owns the testimonial.
     */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}