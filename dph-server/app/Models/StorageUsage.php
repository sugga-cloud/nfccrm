<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StorageUsage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id','used_space_mb'
    ];
    protected $table = 'storage_usage';
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

