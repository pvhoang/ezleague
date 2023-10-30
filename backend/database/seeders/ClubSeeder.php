<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ClubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('clubs')->truncate();
        $env = env('APP_ENV');
        $created_at = now();
        $updated_at = now();

        if ($env === 'development') {
            $clubs = [
                ['id' => 1, 'name' => 'Hong Kong Football Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-HKFC.jpg', 'code' => 'HKFC', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 2, 'name' => 'Asia Pacific Soccer School', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-APSS.jpg', 'code' => 'APSS', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 3, 'name' => 'Brazilian Football Academy', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-BFA.jpg', 'code' => 'BFA', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 4, 'name' => 'Adventure Sports Academy', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-ASA.jpg', 'code' => 'ASA', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 5, 'name' => 'Brasil Top Skills', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-BTS.jpg', 'code' => 'BTS', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 6, 'name' => 'Chara Football Academy', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-CFA.jpg', 'code' => 'CFA', 'is_active' => 0, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 7, 'name' => 'Chelsea Soccer School', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-CSS.jpg', 'code' => 'CSS', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 8, 'name' => 'ESF Lions', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-ESF.jpg', 'code' => 'ESF', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 10, 'name' => 'HK Dragons ', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-HKD.jpg', 'code' => 'HKD', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 11, 'name' => 'HK Football Academy', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-HKFA.jpg', 'code' => 'HKFA', 'is_active' => 0, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 12, 'name' => 'Kowloon Cricket Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-KCC.jpg', 'code' => 'KCC', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 13, 'name' => 'Major League Football Academy', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-MLFA.jpg', 'code' => 'MLFA', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 15, 'name' => 'South China Athletic Association', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-SCAA.jpg', 'code' => 'SCAA', 'is_active' => 0, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 18, 'name' => 'Sun Dream Football Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Screenshot 2021-09-04 at 4.49.45 PM.png', 'code' => 'SDFC', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 19, 'name' => 'Tai Tam Tigers', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/taitam_jfc_logos_rgb.v3-02.jpg', 'code' => 'TTT', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 20, 'name' => 'Asian International Football Academy', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-AIFA.jpg', 'code' => 'AIFA', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 21, 'name' => 'Yuen Long Football Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-YLFC.jpg', 'code' => 'YLFC', 'is_active' => 0, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 22, 'name' => 'Japanese Junior Football Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-JFC.jpg', 'code' => 'JFC', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 23, 'name' => 'Tai Po Football Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-TPFC.jpg', 'code' => 'TPFC', 'is_active' => 0, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 24, 'name' => 'UK Football Academy', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-UKFA.jpg', 'code' => 'UKFA', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 25, 'name' => 'Liverpool FC International Academy', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-LFC.jpg', 'code' => 'LFC', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 26, 'name' => 'DB Angels FC', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-DBA.jpg', 'code' => 'DBA', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 28, 'name' => 'The Citizen Athletic Association', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-TCAA.jpg', 'code' => 'TCAA', 'is_active' => 0, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 29, 'name' => 'Kong City Football Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/image0.jpg', 'code' => 'KCFC', 'is_active' => 0, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 30, 'name' => 'Hogwarts', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-HGW.jpg', 'code' => 'HGW', 'is_active' => 0, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 32, 'name' => 'Tekkerz', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Tekkerz - HKJFL.png', 'code' => 'TKK', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 34, 'name' => 'Junior &amp; Youth Sports Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Screenshot 2021-08-24 at 9.42.09 AM.png', 'code' => 'JYSC', 'is_active' => 0, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 35, 'name' => 'Young Talent Football Team', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/36063299_265352864236316_564683189191599 copy.png', 'code' => 'YTFT', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 36, 'name' => 'Ultimate Starz Football Academy', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/305075367_459190449563704_2520868824784498977_n.jpg', 'code' => 'USFA', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'testing') {
            $clubs = [
                ['name' => 'Hong Kong Football Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-HKFC.jpg', 'code' => 'HKFC', 'is_active' => true, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'staging') {
            $clubs = [
                ['name' => 'Hong Kong Football Club', 'logo' => 'https://app.hkjfl.com/hkjfl/images/product/Club-HKFC.jpg', 'code' => 'HKFC', 'is_active' => true, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'production') {
            $clubs = [];
        }

        DB::table('clubs')->insert($clubs);
        Schema::enableForeignKeyConstraints();
    }
}
