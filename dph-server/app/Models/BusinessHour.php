<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BusinessHour extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id','day','open_time','close_time','is_closed'
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}

