<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id','plan_id','start_date',
        'end_date','auto_renew','status','razorpay_order_id', // Added this
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->hasOneThrough(
            SubscriptionPlan::class, 
            Subscription::class, 
            'id', // Foreign key on subscriptions table
            'id', // Foreign key on subscription_plans table
            'subscription_id', // Local key on payments table
            'plan_id' // Local key on subscriptions table
        );
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}

