<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    use HasFactory;

    protected $fillable = [
        // 'project_id',
        'name',
        'type',
        'fee',
        'start_date',
        'end_date',
        'start_register_date',
        'status'
    ];

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
