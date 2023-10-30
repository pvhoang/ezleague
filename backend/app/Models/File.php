<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory,\Staudenmeir\EloquentJsonRelations\HasJsonRelationships;
    protected $fillable = [
        'display_name',
        'local_name',
        'web_path',
        'local_path',
        'extension',
        'size',
    ];
}
