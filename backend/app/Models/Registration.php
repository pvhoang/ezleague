<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'season_id',
        'club_id',
        'player_id',
        'registered_date',
        'approved_date',
        'approval_status',
        'amount',
    ];

    protected $dates = ['registered_date', 'approved_date'];

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    public function player()
    {
        return $this->belongsTo(Player::class);
    }

    public function paymentDetails()
    {
        return $this->hasMany(PaymentDetail::class, 'product_id')->where('in_table', 'registrations');
    }
}
