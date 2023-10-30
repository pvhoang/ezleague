<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavouriteClub extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'club_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function scopeForUser($query, $user)
    {
        return $query->where('user_id', $user->id);
    }

    public function scopeForClub($query, $club)
    {
        return $query->where('club_id', $club->id);
    }

    public function scopeForUserAndClub($query, $user, $club)
    {
        return $query->forUser($user)->forClub($club);
    }
}
