<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UserClubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('user_clubs')->truncate();
        $env = env('APP_ENV');
        $created_at = now();
        $updated_at = now();

        if ($env === 'development') {
            $user_clubs = [
                ['user_id' => 11769, 'club_id' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11770, 'club_id' => 2, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 14128, 'club_id' => 2, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 10515, 'club_id' => 3, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11792, 'club_id' => 3, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11787, 'club_id' => 4, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11788, 'club_id' => 4, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11466, 'club_id' => 5, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11797, 'club_id' => 5, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11781, 'club_id' => 7, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11782, 'club_id' => 7, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11776, 'club_id' => 8, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11777, 'club_id' => 8, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11789, 'club_id' => 10, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11790, 'club_id' => 10, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11801, 'club_id' => 12, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11802, 'club_id' => 12, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11793, 'club_id' => 13, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11794, 'club_id' => 13, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11918, 'club_id' => 18, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11919, 'club_id' => 18, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11820, 'club_id' => 19, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11821, 'club_id' => 19, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11774, 'club_id' => 20, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 10044, 'club_id' => 21, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11817, 'club_id' => 22, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11778, 'club_id' => 24, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11779, 'club_id' => 24, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11780, 'club_id' => 25, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 11799, 'club_id' => 28, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 12528, 'club_id' => 30, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 13539, 'club_id' => 32, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 14098, 'club_id' => 32, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['user_id' => 14877, 'club_id' => 36, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'testing') {
            $user_clubs = [
                ['user_id' => 1, 'club_id' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'staging') {
            $user_clubs = [
                ['user_id' => 1, 'club_id' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'production') {
            $user_clubs = [];
        }

        DB::table('user_clubs')->insert($user_clubs);
        Schema::enableForeignKeyConstraints();
    }
}
