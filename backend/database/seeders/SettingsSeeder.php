<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SettingsSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    //
    Schema::disableForeignKeyConstraints();
    DB::table('stage_matches')->truncate();
    $env = env('APP_ENV');
    $created_at = now();
    $updated_at = now();

    $settings = [
      ['id' => 1, 'name' => 'Require version', 'key' => 'r_version',  'value' => '{"i_version":"0.7.0","a_version":"0.7.0"}', 'type' => 'Version', 'description' => 'Require version', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
      ['id' => 2, 'name' => 'SMTP', 'key' => 'smtp_account',  'value' => '{"smtp_account":"ezleague@ezactive.com","smtp_password":"JMqZz8i&Q^tr","smtp_host":"mail.ezactive.com","smtp_port":465,"from_email":"ezleague@ezactive.com","from_name":"EZ league test "}', 'type' => 'SMTP', 'description' => 'SMTP Account', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at],
      [
        'id' => 3,
        'name' => 'Initialize settings json', 'key' => 'init_json',
        'value' => '{"custom_fields":[]}', 'type' => 'Json', 'description' => 'Initialize settings json', 'is_active' => 1, 'created_at' => $created_at, 'updated_at' => $updated_at
      ],
    ];

    DB::table('settings')->insert($settings);

    Schema::enableForeignKeyConstraints();
  }
}
