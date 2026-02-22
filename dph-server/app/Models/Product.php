<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['profile_id','name','description','price','image'];
    protected $casts = [
        'images' => 'array', // Automatically converts JSON to Array
        'price' => 'float',
        'is_active' => 'boolean'
    ];
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}

