<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;
    protected $fillable = [
        'season_id',
        'name',
        'years',
        'type',
    ];

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }
    
}
