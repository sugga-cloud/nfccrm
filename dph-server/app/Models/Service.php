<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['profile_id','title','description','image'];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
    
}

