<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TeamsheetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('teamsheets')->truncate();
        $env = env('APP_ENV');
        $updated_at = now();

        if ($env === 'development') {
            $teamsheets = [
                ['team_id' => 350, 'document' => 'Team Sheet - 2020-2021 - U10 Girls - Hogwarts (15-Oct-2020).pdf', 'is_locked' => 0, 'created_at' => '2020-10-15 06:37:58', 'updated_at' => $updated_at],
                ['team_id' => 283, 'document' => 'Team Sheet - 2019-2020 - U10 Boys - Hogwarts (16-Oct-2020).pdf', 'is_locked' => 0, 'created_at' => '2020-10-16 11:50:54', 'updated_at' => $updated_at],
                ['team_id' => 279, 'document' => 'Team Sheet - 2019-2020 - U10 Girls - HKFC 1 (17-Oct-2020).pdf', 'is_locked' => 0, 'created_at' => '2020-10-17 06:05:58', 'updated_at' => $updated_at],
                ['team_id' => 352, 'document' => 'Team Sheet - 2020-2021 - U10 Boys - HKFC1 (25-Oct-2020).pdf', 'is_locked' => 0, 'created_at' => '2020-10-25 12:27:01', 'updated_at' => $updated_at],
                ['team_id' => 352, 'document' => 'Team Sheet - 2020-2021 - U10 Boys - HKFC1 (25-Oct-2020).pdf', 'is_locked' => 0, 'created_at' => '2020-10-25 15:50:12', 'updated_at' => $updated_at],
                ['team_id' => 352, 'document' => 'Team Sheet - 2020-2021 - U10 Boys - HKFC1 (25-Oct-2020).pdf', 'is_locked' => 0, 'created_at' => '2020-10-25 15:52:19', 'updated_at' => $updated_at],
                ['team_id' => 353, 'document' => 'Team Sheet - 2020-2021 - U10 Boys - HKFC2 (27-Oct-2020).pdf', 'is_locked' => 0, 'created_at' => '2020-10-27 08:03:27', 'updated_at' => $updated_at],
                ['team_id' => 352, 'document' => 'Team Sheet - 2020-2021 - U10 Boys - HKFC1 (13-Nov-2020).pdf', 'is_locked' => 0, 'created_at' => '2020-11-13 04:55:08', 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'testing') {
            $teamsheets = [];
        } elseif ($env === 'staging') {
            $teamsheets = [];
        } elseif ($env === 'production') {
            $teamsheets = [];
        }

        DB::table('teamsheets')->insert($teamsheets);
        Schema::enableForeignKeyConstraints();
    }
}
