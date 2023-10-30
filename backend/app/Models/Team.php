<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'group_id',
        'club_id',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function teamPlayers()
    {
        return $this->hasMany(TeamPlayer::class);
    }

    public function teamCoaches()
    {
        return $this->hasMany(TeamCoach::class);
    }

    public function teamsheets()
    {
        return $this->hasMany(Teamsheet::class)->orderBy('created_at', 'desc');
    }

    public function players()
    {
        return $this->hasManyThrough(
            Player::class,
            TeamPlayer::class,
            'team_id',
            'id',
            'id',
            'player_id',
        );
    }

    // stages in stage teams table
    public function stages()
    {
        return $this->hasManyThrough(
            StageTeam::class,
            Stage::class,
            'tournament_id',
            'stage_id',
        );
    }

    // get users favourite teams throught favourite team table
    public function usersFavoriteTeams()
    {
        return $this->hasManyThrough(
            User::class,
            FavouriteTeam::class,
            'team_id',
            'id',
            'id',
            'user_id',
        );
    }
}
