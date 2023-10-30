<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('groups')->truncate();
        $env = env('APP_ENV');
        $created_at = now();
        $updated_at = now();

        if ($env === 'development') {
            $groups = [
                ['id' => 1, 'season_id' => 1, 'name' => 'U7 Boys', 'type' => 'Mixed', 'years' => '2013', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 2, 'season_id' => 1, 'name' => 'U8 Boys', 'type' => 'Mixed', 'years' => '2012', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 4, 'season_id' => 1, 'name' => 'U9 Boys', 'type' => 'Mixed', 'years' => '2011', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 7, 'season_id' => 1, 'name' => 'U10 Boys', 'type' => 'Mixed', 'years' => '2010', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 9, 'season_id' => 1, 'name' => 'U11 Boys', 'type' => 'Mixed', 'years' => '2009', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 11, 'season_id' => 1, 'name' => 'U12 Boys', 'type' => 'Mixed', 'years' => '2008', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 13, 'season_id' => 1, 'name' => 'U13/14 Boys', 'type' => 'Mixed', 'years' => '2006-2007', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 15, 'season_id' => 1, 'name' => 'U12 Girls', 'type' => 'Girls', 'years' => '2008-2009', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 16, 'season_id' => 1, 'name' => 'U10 Girls', 'type' => 'Girls', 'years' => '2010-2011', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 17, 'season_id' => 1, 'name' => 'U14 Girls', 'type' => 'Girls', 'years' => '2005-2007', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 18, 'season_id' => 1, 'name' => 'U8 Girls', 'type' => 'Girls', 'years' => '2012-2013', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 19, 'season_id' => 2, 'name' => 'U10 Boys', 'type' => 'Mixed', 'years' => '2011', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 20, 'season_id' => 2, 'name' => 'U11 Boys', 'type' => 'Mixed', 'years' => '2010', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 21, 'season_id' => 2, 'name' => 'U7 Boys', 'type' => 'Mixed', 'years' => '2014', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 22, 'season_id' => 2, 'name' => 'U8 Boys', 'type' => 'Mixed', 'years' => '2013', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 23, 'season_id' => 2, 'name' => 'U9 Boys', 'type' => 'Mixed', 'years' => '2012', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 25, 'season_id' => 2, 'name' => 'U12 Boys', 'type' => 'Mixed', 'years' => '2009', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 26, 'season_id' => 2, 'name' => 'U14 Boys', 'type' => 'Mixed', 'years' => '2007-2008', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 27, 'season_id' => 2, 'name' => 'U8 Girls', 'type' => 'Girls', 'years' => '2013-2014', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 28, 'season_id' => 2, 'name' => 'U10 Girls', 'type' => 'Girls', 'years' => '2011-2012', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 29, 'season_id' => 2, 'name' => 'U12 Girls', 'type' => 'Girls', 'years' => '2009-2010', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 30, 'season_id' => 2, 'name' => 'U14 Girls', 'type' => 'Girls', 'years' => '2007-2008', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 31, 'season_id' => 3, 'name' => 'U7 Boys', 'type' => 'Mixed', 'years' => '2015', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 32, 'season_id' => 3, 'name' => 'U8 Boys', 'type' => 'Mixed', 'years' => '2014', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 33, 'season_id' => 3, 'name' => 'U9 Boys', 'type' => 'Mixed', 'years' => '2013', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 34, 'season_id' => 3, 'name' => 'U10 Boys', 'type' => 'Mixed', 'years' => '2012', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 35, 'season_id' => 3, 'name' => 'U11 Boys', 'type' => 'Mixed', 'years' => '2011', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 36, 'season_id' => 3, 'name' => 'U12 Boys', 'type' => 'Mixed', 'years' => '2010', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 37, 'season_id' => 3, 'name' => 'U14 Boys', 'type' => 'Mixed', 'years' => '2008-2009', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 38, 'season_id' => 3, 'name' => 'U8 Girls', 'type' => 'Girls', 'years' => '2014-2015', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 39, 'season_id' => 3, 'name' => 'U10 Girls', 'type' => 'Girls', 'years' => '2012-2013', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 40, 'season_id' => 3, 'name' => 'U12 Girls', 'type' => 'Girls', 'years' => '2010-2011', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 41, 'season_id' => 3, 'name' => 'U14 Girls', 'type' => 'Girls', 'years' => '2008-2009', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 42, 'season_id' => 4, 'name' => 'U7 Boys', 'type' => 'Mixed', 'years' => '2016-2017', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 43, 'season_id' => 4, 'name' => 'U8 Boys', 'type' => 'Mixed', 'years' => '2015', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 44, 'season_id' => 4, 'name' => 'U8 Girls', 'type' => 'Girls', 'years' => '2015-2016', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 45, 'season_id' => 4, 'name' => 'U9 Boys', 'type' => 'Mixed', 'years' => '2014', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 46, 'season_id' => 4, 'name' => 'U10 Boys', 'type' => 'Mixed', 'years' => '2013', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 47, 'season_id' => 4, 'name' => 'U10 Girls', 'type' => 'Girls', 'years' => '2013-2014', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 48, 'season_id' => 4, 'name' => 'U11 Boys', 'type' => 'Mixed', 'years' => '2012', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 49, 'season_id' => 4, 'name' => 'U12 Boys', 'type' => 'Mixed', 'years' => '2011', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 50, 'season_id' => 4, 'name' => 'U12 Girls', 'type' => 'Girls', 'years' => '2011-2012', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 51, 'season_id' => 4, 'name' => 'U14 Boys', 'type' => 'Mixed', 'years' => '2009-2010', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 52, 'season_id' => 4, 'name' => 'U14 Girls', 'type' => 'Girls', 'years' => '2009-2010', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'testing') {
            $groups = [
                ['season_id' => 1, 'name' => 'U7 Boys', 'type' => 'Mixed', 'years' => '2016-2017', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'staging') {
            $groups = [
                ['season_id' => 1, 'name' => 'U7 Boys', 'type' => 'Mixed', 'years' => '2016-2017', 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'production') {
            $groups = [];
        }

        DB::table('groups')->insert($groups);
        Schema::enableForeignKeyConstraints();
    }
}
