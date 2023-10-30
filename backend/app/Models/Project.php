<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
        'type',
        'logo',
        'status',
    ];

    /**
     * Get users for the project.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
