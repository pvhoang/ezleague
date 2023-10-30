<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Releases extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'version',
        'type',
        'description',
        'changelog',
        'download_link',
        'download_count',
        'towards_version'
    ];
}
