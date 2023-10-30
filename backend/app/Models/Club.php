<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo',
        'code',
        'is_active',
    ];

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function userClubs()
    {
        return $this->hasMany(UserClub::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_clubs');
    }

    // get users favourite clubs throught favourite club table
    public function usersFavoriteClubs()
    {
        return $this->hasManyThrough(
            User::class,
            FavouriteClub::class,
            'club_id',
            'id',
            'id',
            'user_id',
        );
    }
}
