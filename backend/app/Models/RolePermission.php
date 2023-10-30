<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'role_id',
        'permission_id',
    ];
    
    /**
     * Get the role that owns the role permission.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the permission that owns the role permission.
     */
    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }
}
