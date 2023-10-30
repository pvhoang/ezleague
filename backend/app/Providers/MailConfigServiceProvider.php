<?php

namespace App\Providers;

use App\Models\Settings;
use Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class MailConfigServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        if (Schema::hasTable('settings') && Schema::hasColumn('settings', 'key') && Schema::hasColumn('settings', 'value')) {
            $mail = DB::table('settings')->where('key', config('constants.settings_keys.smtp'))->first();
            if ($mail) //checking if table is not empty
            {
                $value = json_decode($mail->value, true);
                // Log::info($value);
                if ($value) {
                    $smtp = config('mail.mailers.smtp');
                    $new_smtp = array(
                        'host' => $value['smtp_host'] && $value['smtp_host'] != '' ? $value['smtp_host'] : config('mail.mailers.smtp.host'),
                        'port' => $value['smtp_port'] && $value['smtp_port'] != '' ? $value['smtp_port'] : config('mail.mailers.smtp.port'),
                        'username' => $value['smtp_account'] && $value['smtp_account'] != '' ? $value['smtp_account'] : config('mail.mailers.smtp.username'),
                        'password' => $value['smtp_password'] && $value['smtp_password'] != ''  ? $value['smtp_password'] : config('mail.mailers.smtp.password'),
                    );
                    $from = array(
                        'address' => $value['from_email'] && $value['from_email'] != '' ? $value['from_email'] : config('mail.from.address'),
                        'name' => $value['from_name'] && $value['from_name'] != '' ? $value['from_name'] : config('mail.from.name'),
                    );
                    config()->set('mail.from', $from);
                    $smtp = array_merge($smtp, $new_smtp);
                    config()->set('mail.mailers.smtp', $smtp);
                }
            }
        }
    }
}
