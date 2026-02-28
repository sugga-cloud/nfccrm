<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id','username','cover_image','profile_image',
        'designation','company_name','company_description',
        'phone','email','whatsapp','google_map_link',
        'website','qr_code_path','is_active', 'address','theme_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function socialLinks()
    {
        return $this->hasMany(SocialLink::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function gallery()
    {
        return $this->hasMany(Gallery::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }

    public function businessHours()
    {
        return $this->hasMany(BusinessHour::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function enquiries()
    {
        return $this->hasMany(Enquiry::class);
    }

    public function analytics()
    {
        return $this->hasOne(ProfileAnalytics::class);
    }
    public function storage(){
        return $this->hasOne(StorageUsage::class);
    }
}

