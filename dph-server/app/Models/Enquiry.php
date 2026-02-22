<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Enquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id','name','email','phone','message'
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}

