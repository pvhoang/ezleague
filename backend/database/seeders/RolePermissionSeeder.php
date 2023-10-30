<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('role_permissions')->truncate();

        $rolePermissions = [
            ['role_id' => 2, 'permission_id' => 12, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 21, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 22, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 23, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 24, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 31, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 32, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 33, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 34, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 41, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 42, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 43, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 44, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 45, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 2, 'permission_id' => 46, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 3, 'permission_id' => 11, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 3, 'permission_id' => 22, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 3, 'permission_id' => 23, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 3, 'permission_id' => 24, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 3, 'permission_id' => 32, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 3, 'permission_id' => 34, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 4, 'permission_id' => 11, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 4, 'permission_id' => 22, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 4, 'permission_id' => 24, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 4, 'permission_id' => 32, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 4, 'permission_id' => 34, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 5, 'permission_id' => 11, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 5, 'permission_id' => 34, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 6, 'permission_id' => 34, 'created_at' => now(), 'updated_at' => now()],
            ['role_id' => 7, 'permission_id' => 34, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('role_permissions')->insert($rolePermissions);
        Schema::enableForeignKeyConstraints();
    }
}
