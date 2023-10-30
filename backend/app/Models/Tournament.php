<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'name',
        'type',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function stages()
    {
        return $this->hasMany(Stage::class);
    }

    // teams in satge teams table
    public function teams()
    {
        return $this->hasManyThrough(
            StageTeam::class,
            Stage::class,
            'tournament_id',
            'stage_id',
        );
    }

    // stage matches in stages table
    public function matches()
    {
        return $this->hasManyThrough(
            StageMatch::class,
            Stage::class,
            'tournament_id',
            'stage_id',
        );
    }
}
