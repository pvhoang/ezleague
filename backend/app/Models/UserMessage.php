<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'user_id',
        'status', // { "email": "queued|sent|failed", "push_noti": "queued|sent|failed" }
        'read',
    ];

    protected $casts = [
        'status' => 'array',
    ];

    public function message()
    {
        return $this->belongsTo(SendMessage::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
