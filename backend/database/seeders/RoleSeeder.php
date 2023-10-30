<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RoleSeeder extends Seeder
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
        DB::table('roles')->truncate();
        $roles = [
            // ['id' => config('app.roles.super_admin'), 'name' => 'Super Administrator', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => config('app.roles.league_administrator'), 'name' => 'League Administrator', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => config('app.roles.club_manager'), 'name' => 'Club Manager', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => config('app.roles.team_coach'), 'name' => 'Team Coach', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => config('app.roles.parent'), 'name' => 'Parent', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => config('app.roles.player'), 'name' => 'Player', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ['id' => config('app.roles.guest'), 'name' => 'Guest', 'created_at' => $created_at, 'updated_at' => $updated_at],
        ];
        DB::table('roles')->insert($roles);
        Schema::enableForeignKeyConstraints();
    }
}
