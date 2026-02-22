<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = ['name','price','duration','features','limit'];
    protected $casts = [
    'features' => 'array', // Automatically converts JSON to Array and vice-versa
];
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}

