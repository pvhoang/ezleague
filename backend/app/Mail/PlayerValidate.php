<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\HtmlString;

class PlayerValidate extends Notification implements ShouldQueue
{
    use Queueable;
    public $player;
    public $guardian;
    public $fields_not_accepted;
    public $season;


    /**
     * The callback that should be used to create the reset password URL.
     *
     * @var (\Closure(mixed, string): string)|null
     */
    public static $createUrlCallback;

    /**
     * The callback that should be used to build the mail message.
     *
     * @var (\Closure(mixed, string): \Illuminate\Notifications\Messages\MailMessage)|null
     */
    public static $toMailCallback;

    /**
     * Create a notification instance.
     *
     * @param  string  $token
     * @return void
     */
    public function __construct($player, $guardian, $season, $fields_not_accepted)
    {
        $this->player = $player;
        $this->guardian = $guardian;
        $this->season = $season;
        $this->fields_not_accepted = $fields_not_accepted;
    }

    /**
     * Get the notification's channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $this->player, $this->guardian, $this->season, $this->fields_not_accepted);
        }

        return $this->buildMailMessage($this->player, $this->guardian, $this->season, $this->fields_not_accepted);
    }

    /**
     * Get the reset password notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($player, $guardian, $season, $fields_not_accepted)
    {
        $subject = env('APP_NAME') . ' ' . __('player registration incomplete: information required');
        $fields_str = '';
        $guardian_name = $guardian->first_name . ' ' . $guardian->last_name;
        $player_name = $player->first_name . ' ' . $player->last_name;
        foreach ($fields_not_accepted as $key => $field) {
            $field_name = __('validation.attributes.' . $field['field']);
            // uppercase first letter
            $field_name = mb_strtoupper(mb_substr($field_name, 0, 1)) . mb_substr($field_name, 1);
            $fields_str .=  '<p>&emsp;' . $field_name . ': ' . __($field['message']) . '</p>';
        }
        // Log::info('PlayerValidate: ' . print_r($fields_not_accepted, true));
        return (new MailMessage)
            ->subject($subject)
            ->greeting(__('Dear') . ' ' . $guardian_name)
            ->line(new HtmlString(__('The following information is required to complete the registration of <b>:player_name</b> for the season <b>:season_name</b>.', ['player_name' => $player_name, 'season_name' => $season->name])))
            ->line(__('Please login to your account and complete the registration.'))
            ->line(__('The following information is missing:'))
            ->line(new HtmlString($fields_str));
    }

    /**
     * Set a callback that should be used when building the notification mail message.
     *
     * @param  \Closure(mixed, string): \Illuminate\Notifications\Messages\MailMessage  $callback
     * @return void
     */
    public static function toMailUsing($callback)
    {
        static::$toMailCallback = $callback;
    }
}
