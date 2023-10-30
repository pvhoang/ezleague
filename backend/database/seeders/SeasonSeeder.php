<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SeasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('seasons')->truncate();
        $env = env('APP_ENV');
        $created_at = now();
        $updated_at = now();

        if ($env === 'development') {
            $seasons = [
                ['id' => 1, 'name' => '2019-2020', 'type' => 'Season', 'fee' => 150.00, 'start_date' => '2019-08-31 00:00:00', 'end_date' => '2020-11-12 00:00:00', 'start_register_date' => '2019-05-31 00:00:00', 'status' => 'Archived', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 2, 'name' => '2020-2021', 'type' => 'Season', 'fee' => 200.00, 'start_date' => '2020-09-01 00:00:00', 'end_date' => '2021-08-26 00:00:00', 'start_register_date' => '2020-08-23 00:00:00', 'status' => 'Active', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 3, 'name' => '2021-2022', 'type' => 'Season', 'fee' => 300.00, 'start_date' => '2021-09-04 00:00:00', 'end_date' => '2022-06-29 00:00:00', 'start_register_date' => '2021-08-30 00:00:00', 'status' => 'Active', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 4, 'name' => '2022-2023', 'type' => 'Season', 'fee' => 300.00, 'start_date' => '2022-09-24 00:00:00', 'end_date' => '2024-05-27 00:00:00', 'start_register_date' => '2022-09-05 00:00:00', 'status' => 'Active', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'testing') {
            $seasons = [
                ['name' => '2022/2023', 'type' => 'Season', 'fee' => 300, 'start_date' => '2022-09-24 00:00:00', 'end_date' => '2024-05-27 00:00:00', 'start_register_date' => '2022-09-05 00:00:00', 'status' => 'Active', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'staging') {
            $seasons = [
                ['name' => '2022/2023', 'type' => 'Season', 'fee' => 300, 'start_date' => '2022-09-24 00:00:00', 'end_date' => '2023-05-27 00:00:00', 'start_register_date' => '2022-09-05 00:00:00', 'status' => 'Active', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'production') {
            $seasons = [];
        }

        DB::table('seasons')->insert($seasons);
        Schema::enableForeignKeyConstraints();
    }
}
