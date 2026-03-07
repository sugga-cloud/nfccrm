<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegalDocument extends Model
{
    protected $fillable = ['profile_id', 'type', 'title', 'content', 'is_active'];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}