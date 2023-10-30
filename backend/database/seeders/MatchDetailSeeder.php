<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MatchDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('match_details')->truncate();
        $env = env('APP_ENV');
        $created_at = now();
        $updated_at = now();

        if ($env === 'development') {
            $match_details = [];
        } elseif ($env === 'testing') {
            $match_details = [];
        } elseif ($env === 'staging') {
            $match_details = [];
        } elseif ($env === 'production') {
            $match_details = [];
        }

        DB::table('match_details')->insert($match_details);
        Schema::enableForeignKeyConstraints();
    }
}
