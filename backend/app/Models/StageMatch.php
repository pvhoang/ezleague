<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class StageMatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'stage_id',
        'home_team_id',
        'away_team_id',
        'start_time',
        'end_time',
        'location_id',
        'round_name',
        'round_level',
        'home_score',
        'away_score',
        'home_penalty',
        'away_penalty',
        'status',
        'description',
        'created_by',
        'broadcast_id',
        'broadcast_status',
        'scores_updated_by',
        'order'
    ];
    protected $dates = ['start_time', 'end_time'];
    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    // link to users table by field scores_updated_by
    public function user()
    {
        return $this->belongsTo(User::class, 'scores_updated_by');
    }

    public function tournament()
    {
        return $this->hasOneThrough(Tournament::class, Stage::class, 'id', 'id', 'stage_id', 'tournament_id');
    }

    public function setAttribute($key, $value)
    {
        // check if string has format Y-m-d H:i:s but not ISO 8601
        if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $value) && !preg_match('/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/', $value)) {
            $timezone = request()->hasHeader('X-time-zone') ? request()->header('X-time-zone') : config('app.timezone');
            // convert to UTC
            $value = Carbon::parse($value, $timezone)->setTimezone(config('app.timezone'));
        }

        return parent::setAttribute($key, $value);
    }

    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);
        // check if string has format Y-m-d H:i:s
        if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $value)) {
            $timezone = request()->hasHeader('X-time-zone') ? request()->header('X-time-zone') : config('app.timezone');
            // Convert to timezone
            $value = Carbon::parse($value)->setTimezone($timezone);
        } else {
            $value = parent::getAttribute($key);
        }

        return $value;
    }
}
