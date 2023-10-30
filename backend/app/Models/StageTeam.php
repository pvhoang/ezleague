<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StageTeam extends Model
{
    use HasFactory;

    protected $fillable = [
        'stage_id',
        'team_id',
        'group',
    ];

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
