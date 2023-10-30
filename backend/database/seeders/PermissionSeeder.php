<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $created_at = now();
        $updated_at = now();

        Schema::disableForeignKeyConstraints();
        DB::table('permissions')->truncate();
        $roles = [
            ['id' => 11, 'name' => 'Registration', 'description' => 'Registration', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 12, 'name' => 'Manage Registrations', 'description' => 'Admin Registrations', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 21, 'name' => 'Team Management', 'description' => 'Teams > Team Management', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 22, 'name' => 'Assign Players', 'description' => 'Teams > Assign Player', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 23, 'name' => 'Assign Coaches', 'description' => 'Teams > Assign Coaches', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 24, 'name' => 'Manage Teamsheets', 'description' => 'Teams > Teamsheets', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 31, 'name' => 'Manage Leagues', 'description' => 'Leagues > Manage Leagues', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 32, 'name' => 'Update Score', 'description' => 'Leagues > Update Score', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 33, 'name' => 'League Reports', 'description' => 'Leagues > League Reports', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 34, 'name' => 'Fixtures & Results', 'description' => 'Fixtures & Results', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 41, 'name' => 'Manage Events', 'description' => 'Table > Events', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 42, 'name' => 'Manage Groups', 'description' => 'Table > Events', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 43, 'name' => 'Manage Clubs', 'description' => 'Table > Clubs', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 44, 'name' => 'Manage Location', 'description' => 'Tables > Locations', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 45, 'name' => 'Manage Users', 'description' => 'Table > Users', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => 46, 'name' => 'Send Messages', 'description' => 'Messages', 'created_at' => $created_at, 'updated_at' => $updated_at],
        ];
        DB::table('permissions')->insert($roles);
        Schema::enableForeignKeyConstraints();
    }
}
