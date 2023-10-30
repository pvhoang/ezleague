<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'dob',
        'gender',
        'photo',
        'document_type',
        'document_photo',
        'document_expiry_date',
        'validate_status',
        'validated_fields',
        'custom_fields'
    ];

    protected $casts = [
        'custom_fields' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class)->orderBy('registered_date', 'desc');
    }

    public function clubs()
    {
        return $this->belongsToMany(Club::class, 'registrations');
    }

    public function seasons()
    {
        return $this->belongsToMany(Season::class, 'registrations');
    }

    public function guardians()
    {
        return $this->hasMany(Guardian::class);
    }

    public function guardianUsers()
    {
        return $this->hasManyThrough(
            User::class,
            Guardian::class,
            'player_id',
            'id',
            'id',
            'user_id'
        );
    }

    //get guardian where is_primary = 1
    public function primaryGuardian()
    {
        return $this->hasOne(Guardian::class)->where('is_primary', 1);
    }

    public function teamPlayers()
    {
        return $this->hasMany(TeamPlayer::class);
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_players');
    }
}
