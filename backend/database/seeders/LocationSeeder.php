<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('locations')->truncate();
        $env = env('APP_ENV');
        $created_at = now();
        $updated_at = now();

        if ($env === 'development') {
            $locations = [
                ['id' => 1, 'name' => 'Jockey Club Football Training Centre - Pitch 5 (FTC)', 'address' => 'Wan Po Road, Tseung Kwan O', 'latitude' => 22.30008900, 'longitude' => 114.26530900, 'surface' => 'Artificial turf', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 4, 'name' => 'King George V School - Main Pitch (KGV)', 'address' => '2 Tin Kwong Rd, Ho Man Tin', 'latitude' => 22.32188600, 'longitude' => 114.18379600, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 5, 'name' => 'Sun Yat Sen (SYS) ', 'address' => '16 Eastern St North, Sai Ying Pun', 'latitude' => 22.29016600, 'longitude' => 114.14515100, 'surface' => 'Artificial turf', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 6, 'name' => 'King George V School - Hockey Pitch (KGV)', 'address' => '2 Tin Kwong Rd, Ho Man Tin', 'latitude' => 22.32188600, 'longitude' => 114.18379600, 'surface' => 'Astro (no studs)', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 7, 'name' => 'Quarry Bay Park 1 (QBP 1)', 'address' => 'Hoi Tai Street, Quarry Bay', 'latitude' => 22.28808900, 'longitude' => 114.21437700, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 8, 'name' => 'Quarry Bay Park 2 (QBP 2)', 'address' => 'Hoi Chak Street, Quarry Bay', 'latitude' => 22.29031500, 'longitude' => 114.21091700, 'surface' => 'Artificial turf', 'parking' => 'street meters', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 9, 'name' => 'Happy Valley Recreation Ground (Pitch 8)', 'address' => '1 Sports Road, Happy Valley', 'latitude' => 22.27375300, 'longitude' => 114.18253500, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 10, 'name' => 'Kowloon Tsai Park Pitch 1', 'address' => '13 Inverness Road, Kowloon City', 'latitude' => 22.33256500, 'longitude' => 114.18291300, 'surface' => 'Artificial turf', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 11, 'name' => 'Kowloon Tsai Park Pitch 3', 'address' => '13 Inverness Road, Kowloon City', 'latitude' => 22.33256500, 'longitude' => 114.18291300, 'surface' => 'Grass', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 12, 'name' => 'Kowloon Bay Park (KBP)', 'address' => '11 Kai Lai Road, Kowloon Bay', 'latitude' => 22.32701600, 'longitude' => 114.20792700, 'surface' => 'Artificial turf', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 13, 'name' => 'Kwun Tong Recreation Ground	', 'address' => '6 Tsui Ping Road, Kwun Tong', 'latitude' => 22.31161400, 'longitude' => 114.22998400, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 14, 'name' => 'Shun Lee Tsuen Park (SLT)', 'address' => '33 Shun Lee Tsuen Road, Kwun Tong', 'latitude' => 22.33030900, 'longitude' => 114.22499900, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 15, 'name' => 'Wai Lok Street', 'address' => 'Wai Yip Street and Wai Lok Street', 'latitude' => 22.30416600, 'longitude' => 114.22600200, 'surface' => 'Grass', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 16, 'name' => 'Shek Kip Mei Park', 'address' => '270 Nam Cheong Street, Sham Shui Po', 'latitude' => 22.33460400, 'longitude' => 114.17031300, 'surface' => 'Artificial turf', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 17, 'name' => 'Tai Hung Tung Recreation Ground - Pitch 1 (THT)', 'address' => '63 Boundary St, Sham Shui Po', 'latitude' => 22.32782800, 'longitude' => 114.17119200, 'surface' => 'Grass', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 18, 'name' => 'Morse Park 3 - Pitch 1 (MP3)', 'address' => 'Fung Mo Street, Wong Tai Sin', 'latitude' => 22.33855400, 'longitude' => 114.19108600, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 19, 'name' => 'Morse Park 3 - Pitch 2 (MP3)', 'address' => 'Fung Mo Street, Wong Tai Sin', 'latitude' => 22.33826300, 'longitude' => 114.19150200, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 20, 'name' => 'Morse Park 3 - Pitch 4 (MP3)', 'address' => 'Fung Mo Street, Wong Tai Sin', 'latitude' => 22.33917700, 'longitude' => 114.18967000, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 21, 'name' => 'Cherry Street Park (CS)', 'address' => '9 Hoi Ting Road, Mong Kok', 'latitude' => 22.31279100, 'longitude' => 114.16596800, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 22, 'name' => 'Hong Kong International School (HKIS)', 'address' => '700 Tai Tam Reservoir Road Tai Tam', 'latitude' => 22.23799600, 'longitude' => 114.22256400, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 23, 'name' => 'Kellett School Kowloon Bay (KS)', 'address' => '7 Lam Hing St, Kowloon Bay', 'latitude' => 22.32434200, 'longitude' => 114.20665600, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 24, 'name' => 'YMCA College Tung Chung', 'address' => '2 Chung Yat Street, Tung Chung', 'latitude' => 22.27629500, 'longitude' => 113.93159500, 'surface' => 'Artificial turf', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 25, 'name' => 'Kowloon Cricket Club (KCC)', 'address' => '10 Cox\'s Rd, Jordan', 'latitude' => 22.30508100, 'longitude' => 114.17356300, 'surface' => 'Grass (no studs)', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 26, 'name' => 'Jockey Club Football Training Centre - Pitch 6 (FTC)', 'address' => 'Wan Po Road, Tseung Kwan O', 'latitude' => 22.30008900, 'longitude' => 114.26530900, 'surface' => 'Artificial turf', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 27, 'name' => 'Hong Kong Football Club (HKFC) Main Pitch', 'address' => '3 Sports Road, Happy Valley', 'latitude' => 22.27557000, 'longitude' => 114.18192300, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 28, 'name' => 'Hong Kong Football Club (HKFC) Hockey Pitch', 'address' => '3 Sports Road, Happy Valley', 'latitude' => 22.27557000, 'longitude' => 114.18192300, 'surface' => 'Astro (no studs)', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 29, 'name' => 'Happy Valley Recreation Ground (Pitch 4)', 'address' => '1 Sports Road, Happy Valley', 'latitude' => 22.27375300, 'longitude' => 114.18335500, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 30, 'name' => 'Jockey Club Football Training Centre - Pitch 4 (FTC)', 'address' => 'Wan Po Road, Tseung Kwan O', 'latitude' => 22.30008900, 'longitude' => 114.26530900, 'surface' => 'Artificial turf', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 31, 'name' => 'TBD', 'address' => NULL, 'latitude' => NULL, 'longitude' => NULL, 'surface' => NULL, 'parking' => NULL, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 32, 'name' => 'Morse Park 3 - Pitch 3 (MP3)', 'address' => 'Fung Mo Street, Wong Tai Sin', 'latitude' => 22.33826300, 'longitude' => 114.19150200, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 33, 'name' => 'Stanley Ho Sports Centre (Pitch 2)', 'address' => '10 Sha Wan Drive, Sandy Bay', 'latitude' => 22.26587200, 'longitude' => 114.12596300, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 34, 'name' => 'Aberdeen Sports Ground', 'address' => '108 Wong Chuk Hang Road, Hong Kong', 'latitude' => 22.24935200, 'longitude' => 114.17190800, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 35, 'name' => 'Happy Valley Recreation Ground (Pitch 2)', 'address' => '1 Sports Road, Happy Valley', 'latitude' => 22.27375300, 'longitude' => 114.18335500, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 36, 'name' => 'King\'s Park Sports Ground (KP3)', 'address' => '11 Wylie Path, Ho Man Tin', 'latitude' => 22.30892200, 'longitude' => 114.17739600, 'surface' => 'Artificial turf', 'parking' => 'fee-charging car park', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 37, 'name' => 'Happy Valley Recreation Ground (Pitch 7)', 'address' => '1 Sports Road, Happy Valley', 'latitude' => 22.27375300, 'longitude' => 114.18335500, 'surface' => 'Grass', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 38, 'name' => 'Boundary Street Playground (BS)', 'address' => '200 Sai Yee Street, Mong Kok', 'latitude' => 22.32619700, 'longitude' => 114.17115600, 'surface' => 'Artificial turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 39, 'name' => 'Lok Fu Recreation Ground', 'address' => '1 Heng Lam Street, Lok Fu', 'latitude' => 22.33671200, 'longitude' => 114.18861700, 'surface' => 'Artificial turf', 'parking' => 'Lok Fu Place Zone B', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 40, 'name' => 'Australian International School (AIS)', 'address' => '3A Norfolk Road Kowloon Tong', 'latitude' => 22.33535540, 'longitude' => 114.17801180, 'surface' => 'Artificial Turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 42, 'name' => 'On Sau Road Park', 'address' => 'On Sau Road, Kwun Tong', 'latitude' => 22.32360900, 'longitude' => 114.23189000, 'surface' => 'Artificial Turf', 'parking' => 'N/A', 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 43, 'name' => 'other', 'address' => NULL, 'latitude' => NULL, 'longitude' => NULL, 'surface' => NULL, 'parking' => NULL, 'created_at' => $created_at, 'updated_at' => $updated_at],
                ['id' => 44, 'name' => 'Happy Valley Recreation Ground (Pitch 3)', 'address' => NULL, 'latitude' => NULL, 'longitude' => NULL, 'surface' => NULL, 'parking' => NULL, 'created_at' => $created_at, 'updated_at' => $updated_at],
            ];
        } elseif ($env === 'testing') {
            $locations = [];
        } elseif ($env === 'staging') {
            $locations = [];
        } elseif ($env === 'production') {
            $locations = [];
        }

        DB::table('locations')->insert($locations);
        Schema::enableForeignKeyConstraints();
    }
}
