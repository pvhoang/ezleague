<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TournamentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('tournaments')->truncate();
        $env = env('APP_ENV');
        $created_at = now();
        $updated_at = now();

        if ($env === 'development') {
            $tournaments = [
                ['id' => 1, 'group_id' => 11, 'name' => 'U12 Premiership', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 2, 'group_id' => 19, 'name' => 'U10 Champion', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 3, 'group_id' => 19, 'name' => 'U10 Champ B (Apr 3)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 4, 'group_id' => 19, 'name' => 'U10 Prem B (May 29)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 7, 'group_id' => 28, 'name' => 'U10 Girls Premier', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 10, 'group_id' => 28, 'name' => 'U10 Girls Championship', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 17, 'group_id' => 19, 'name' => 'U10 Prem (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 23, 'group_id' => 36, 'name' => 'U12 Boys Champ (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 24, 'group_id' => 19, 'name' => 'U10 Prem Autumn', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 25, 'group_id' => 25, 'name' => 'U12 Champ B', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 26, 'group_id' => 20, 'name' => 'U11 Champ B', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 29, 'group_id' => 37, 'name' => 'U14 Prem (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 32, 'group_id' => 36, 'name' => 'U12 Boys Prem (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 33, 'group_id' => 35, 'name' => 'U11 Boys Prem (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 34, 'group_id' => 35, 'name' => 'U11 Boys Champ A (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 35, 'group_id' => 35, 'name' => 'U11 Boys Champ B (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 2, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 37, 'group_id' => 34, 'name' => 'U10 Boys Prem (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 3, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 38, 'group_id' => 34, 'name' => 'U10 Boys Champ (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 4, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 39, 'group_id' => 33, 'name' => 'U9 Boys Prem (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 5, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 40, 'group_id' => 33, 'name' => 'U9 Boys Champ A (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 6, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 41, 'group_id' => 33, 'name' => 'U9 Boys Champ B (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 7, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 42, 'group_id' => 32, 'name' => 'U8 Boys Champ A (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 9, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 43, 'group_id' => 32, 'name' => 'U8 Boys Prem (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 8, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 44, 'group_id' => 32, 'name' => 'U8 Boys Champ B (Autumn League)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 10, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 46, 'group_id' => 40, 'name' => 'U12 Girls Prem', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 11, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 47, 'group_id' => 40, 'name' => 'U12 Girls Champ', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 12, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 48, 'group_id' => 41, 'name' => 'U14 Girls Prem', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 13, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 49, 'group_id' => 41, 'name' => 'U14 Girls Champ', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 14, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 53, 'group_id' => 31, 'name' => 'U7 Seeding - Group 3', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 15, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 54, 'group_id' => 31, 'name' => 'U7 Seeding - Group 4', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 16, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 55, 'group_id' => 37, 'name' => 'U14 Boys Champ A (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 17, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 56, 'group_id' => 37, 'name' => 'U14 Boys Champ B (Autumn Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 18, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 57, 'group_id' => 31, 'name' => 'U7 Seeding Round 1', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 19, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 71, 'group_id' => 31, 'name' => 'U7 Champ - Round 1', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 20, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 75, 'group_id' => 31, 'name' => 'U7 Prem (23-Oct)', 'type' => 'Groups + Knockout', 'subtype' => '1v2, 2v1, 3v4, 4v3', 'order' => 21, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 76, 'group_id' => 31, 'name' => 'U7 Prem (20-Nov)', 'type' => 'Groups + Knockout', 'subtype' => '1v2, 2v1, 3v4, 4v3', 'order' => 22, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 77, 'group_id' => 31, 'name' => 'U7 Champ (27-Nov)', 'type' => 'Groups + Knockout', 'subtype' => '1v2, 2v1, 3v4, 4v3', 'order' => 23, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 79, 'group_id' => 39, 'name' => 'U10 Girls Prem (27-Nov)', 'type' => 'Groups + Knockout', 'subtype' => '1v2, 2v1, 3v4, 4v3', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 80, 'group_id' => 39, 'name' => 'U10 Girls Champ (27-Nov)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 85, 'group_id' => 38, 'name' => 'U8 Girls Prem (27-Nov)', 'type' => 'Groups + Knockout', 'subtype' => '1v2, 2v1, 3v4, 4v3', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 88, 'group_id' => 38, 'name' => 'U8 Girls Champ (27-Nov)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 90, 'group_id' => 31, 'name' => 'Test', 'type' => 'Groups + Knockout', 'subtype' => 'Custom Tournament', 'order' => 24, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 91, 'group_id' => 34, 'name' => 'U10 Prem (SpringSeason)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 5, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 92, 'group_id' => 40, 'name' => 'U12 Girls Prem - Spring season', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 13, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 93, 'group_id' => 40, 'name' => 'U12 Girls Champ - Spring Season', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 14, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 94, 'group_id' => 41, 'name' => 'U14 Girls Prem - Spring Season', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 15, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 95, 'group_id' => 41, 'name' => 'U14 Girls Champ - Spring Season', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 16, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 96, 'group_id' => 36, 'name' => 'U12 Boys Champ (Spring Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 97, 'group_id' => 36, 'name' => 'U12 Boys Prem (Spring Season)', 'type' => 'League', 'subtype' => 'Single Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 98, 'group_id' => 51, 'name' => 'U14 PREM', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 99, 'group_id' => 48, 'name' => 'U11 PREM', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 100, 'group_id' => 42, 'name' => 'U7 PREM', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 101, 'group_id' => 42, 'name' => 'U7 CHAMP', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 102, 'group_id' => 43, 'name' => 'U8 PREM', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 103, 'group_id' => 43, 'name' => 'U8 CHAMP A', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 104, 'group_id' => 43, 'name' => 'U8 CHAMP B', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 105, 'group_id' => 45, 'name' => 'U9 PREM', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 106, 'group_id' => 45, 'name' => 'U9 CHAMP A', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 107, 'group_id' => 45, 'name' => 'U9 CHAMP B', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 110, 'group_id' => 48, 'name' => 'U11 CHAMP A', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 111, 'group_id' => 48, 'name' => 'U11 CHAMP B', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 113, 'group_id' => 49, 'name' => 'U12 CHAMP A', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 114, 'group_id' => 49, 'name' => 'U12 CHAMP B', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 115, 'group_id' => 51, 'name' => 'U14 CHAMP A', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 116, 'group_id' => 51, 'name' => 'U14 CHAMP B', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 117, 'group_id' => 50, 'name' => 'U12 GIRLS', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 118, 'group_id' => 52, 'name' => 'U14 GIRLS', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 123, 'group_id' => 47, 'name' => 'U10 Girls Prem', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 124, 'group_id' => 47, 'name' => 'U10 Girls Champ', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 126, 'group_id' => 44, 'name' => 'U8 Girls League', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 127, 'group_id' => 46, 'name' => 'U10 Champ A', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 128, 'group_id' => 46, 'name' => 'U10 Champ B', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 129, 'group_id' => 45, 'name' => 'U9 Prem Summer Season', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 2, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 130, 'group_id' => 45, 'name' => 'U9 Champ A Summer Season', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 3, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 131, 'group_id' => 45, 'name' => 'U9 Champ B Summer Season', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 4, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 132, 'group_id' => 43, 'name' => 'U8 Prem Summer Season', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 2, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 133, 'group_id' => 43, 'name' => 'U8 Champ A Summer Season', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 3, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 134, 'group_id' => 43, 'name' => 'U8 Champ B Summer Season', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 4, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 135, 'group_id' => 46, 'name' => 'U10 Champ A Summer Season', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 2, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 136, 'group_id' => 46, 'name' => 'U10 Champ B Summer Season', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 3, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'testing') {
            $tournaments = [
                ['id' => 100, 'group_id' => 42, 'name' => 'U7 PREM', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'staging') {
            $tournaments = [
                ['id' => 100, 'group_id' => 42, 'name' => 'U7 PREM', 'type' => 'League', 'subtype' => 'Double Round Robin', 'order' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'production') {
            $tournaments = [];
        }

        DB::table('tournaments')->insert($tournaments);
        Schema::enableForeignKeyConstraints();
    }
}
