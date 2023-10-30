<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\HtmlString;

class ApproveRegistration extends Notification implements ShouldQueue
{
    use Queueable;
    public $player;
    public $guardian;
    public $season;
    public $payment;

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
    public function __construct($player, $guardian, $season,$payment = null)
    {
        $this->player = $player;
        $this->guardian = $guardian;
        $this->season = $season;
        $this->payment = $payment;
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
            return call_user_func(static::$toMailCallback, $notifiable, $this->player, $this->guardian, $this->season ,$this->payment);
        }

        return $this->buildMailMessage($this->player, $this->guardian, $this->season,$this->payment);
    }

    /**
     * Get the reset password notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($player, $guardian, $season,$payment)
    {
        $player_name = $player->first_name . ' ' . $player->last_name;
        $guardian_name = $guardian->first_name . ' ' . $guardian->last_name;
        $payment_content = '';
        if($payment){
            $payment_content = __("A new invoice with the amount of <b>$:fee</b> has been generated for you. Please click on the link below to make the payment." , ['fee' => $payment->amount]);
        }
        $subject = env('APP_NAME') . ' - ' . __('Registration for Season :season has been approved.', ['season' => $season->name]);
        return (new MailMessage)
            ->subject($subject)
            ->greeting(__('Dear') . ' ' . $guardian_name . ',')
            ->line(__('Your registration for :player_name has  been approved.', ['player_name' => $player_name]))
            ->lineIf($payment,new HtmlString($payment_content))
            ->action(__('Pay Now'), $payment->payment_url)
            ->line(__('You can now login to the app and view your player\'s information.'));
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
