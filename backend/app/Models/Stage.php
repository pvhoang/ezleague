<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'tournament_id',
        'points_win',
        'points_draw',
        'points_loss',
        'no_encounters',
        'ranking_criteria',
        'third_place',
        'is_released',
        'is_display_tbd'
    ];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function matches()
    {
        return $this->hasMany(StageMatch::class);
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'stage_teams')->orderBy('name', 'asc');;
    }

    public function stageTeams()
    {
        return $this->hasMany(StageTeam::class);
    }
}
