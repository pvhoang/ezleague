<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teamsheet extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'document',
        'is_locked',
    ];
    
    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
