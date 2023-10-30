<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\HtmlString;

class SendPassword extends Notification
{
    /**
     * The password reset token.
     *
     * @var string
     */
    public $password;
    public $reset = false;

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
    public function __construct($password, $reset = false)
    {
        $this->password = $password;
        $this->reset = $reset;
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
            return call_user_func(static::$toMailCallback, $notifiable, $this->password, $this->reset);
        }

        return $this->buildMailMessage($this->password, $this->reset);
    }

    /**
     * Get the reset password notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($password, $reset = false)
    {
        $subject = env('APP_NAME') . ' - ' . __('New user account for you');
        $content = __('A new user account with password <b>:password</b> has been created for you. Please login to the :app_name app and go to User Profile to change your password.', ['password' => $password, 'app_name' => env('APP_NAME')]);
        if ($reset) {
            $subject = env('APP_NAME') . ' - ' . __('Your password has been reset');
            $content = __('Your password has been reset to <b>:password</b>. Please login and go to User Profile to change your password.', ['password' => $password]);
        }
        return (new MailMessage)
            ->subject($subject)
            ->line(new HtmlString($content));
    }

    /**
     * Set a callback that should be used when creating the reset password button URL.
     *
     * @param  \Closure(mixed, string): string  $callback
     * @return void
     */
    public static function createUrlUsing($callback)
    {
        static::$createUrlCallback = $callback;
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
