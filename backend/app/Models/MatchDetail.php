<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'team_player_id',
        'type',
        'time',
        'user_id',
        'note',
    ];

    public function match()
    {
        return $this->belongsTo(StageMatch::class);
    }

    public function teamPlayer()
    {
        return $this->belongsTo(TeamPlayer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function team()
    {
        // through teamPlayer
        return $this->hasOneThrough(Team::class, TeamPlayer::class, 'id', 'id', 'team_player_id', 'team_id');
    }

    public function player()
    {
        // through teamPlayer
        return $this->hasOneThrough(Player::class, TeamPlayer::class, 'id', 'id', 'team_player_id', 'player_id');
    }
}
