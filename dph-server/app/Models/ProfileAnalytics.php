<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProfileAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id','visit_count',
        'click_count','enquiry_count',
        'appointment_count'
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
