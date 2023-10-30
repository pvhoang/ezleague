<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavouriteTeam extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'team_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function scopeForUser($query, $user)
    {
        return $query->where('user_id', $user->id);
    }

    public function scopeForTeam($query, $team)
    {
        return $query->where('team_id', $team->id);
    }

    public function scopeForUserAndTeam($query, $user, $team)
    {
        return $query->forUser($user)->forTeam($team);
    }
}
