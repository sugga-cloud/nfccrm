<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id','plan_id','start_date',
        'end_date','auto_renew','status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
{
    return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
}

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}

