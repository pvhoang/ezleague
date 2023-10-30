<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([RoleSeeder::class]);
        $this->call([PermissionSeeder::class]);
        $this->call([RolePermissionSeeder::class]);
        $this->call([UserSeeder::class]);
        $this->call([SeasonSeeder::class]);
        $this->call([GroupSeeder::class]);
        $this->call([ClubSeeder::class]);
        $this->call([TeamSeeder::class]);
        $this->call([PlayerSeeder::class]);
        $this->call([GuardianSeeder::class]);
        $this->call([RegistrationSeeder::class]);
        $this->call([UserClubSeeder::class]);
        $this->call([TeamPlayerSeeder::class]);
        $this->call([TeamsheetSeeder::class]);
        $this->call([TournamentSeeder::class]);
        $this->call([StageSeeder::class]);
        $this->call([StageTeamSeeder::class]);
        $this->call([LocationSeeder::class]);
        $this->call([StageMatchSeeder::class]);
        $this->call([MatchDetailSeeder::class]);
        $this->call([TeamCoachSeeder::class]);
        $this->call([SettingsSeeder::class]);
    }
}
