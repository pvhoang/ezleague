<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SendMessage extends Model
{
    use HasFactory,\Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

    protected $fillable = [
        'season_id',
        'user_id',
        'type',
        'title',
        'content',
        'send_to',  // e.g:{"club_ids" : [1,2,3],  "player_ids": [3,4,5]  , "group_ids": [1, 2, 3], "user_messages": true, "all": true}
        'attachments'
    ];

    protected $casts = [
        'send_to' => 'array',
        'attachments' => 'array'
    ];

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function sendBy()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function attachments()
    {
        return $this->belongsToJson(File::class,  'attachments','id');
    }
}
