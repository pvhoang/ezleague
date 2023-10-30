<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'player_id',
        'relationship',
        'is_primary',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function player()
    {
        return $this->belongsTo(Player::class);
    }
}
