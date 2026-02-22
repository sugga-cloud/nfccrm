<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id','customer_name','customer_email',
        'customer_phone','appointment_date',
        'appointment_time','status'
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}

