<?php

namespace App\Mail;

use App\Models\SendMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\HtmlString;

class CustomMail extends Notification
implements ShouldQueue
{
    use Queueable;

    public $data = [
        'title' => '',
        'greeting' => '',
        'content' => '',
        'attachments' => [],
        'cc' => [],
        'bcc' => [],
        'subject' => '',
        'from' => [
            'address' => '',
            'name' => '',
        ],
        'replyTo' => [
            'address' => '',
            'name' => '',
        ]
    ];
    public SendMessage $send_message;

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
    public function __construct($data, SendMessage $send_message)
    {
        $this->data['from'] = [
            'address' => config('mail.from.address'),
            'name' => config('mail.from.name'),
        ];
        $this->data['replyTo'] = [
            'address' => config('mail.from.address'),
            'name' => config('mail.from.name'),
        ];
        $this->data = array_merge($this->data, $data);
        $this->send_message = $send_message;
        // Log::info('datta', ['data' => $this->data]);
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
            return call_user_func(static::$toMailCallback, $notifiable, $this->data);
        }

        return $this->buildMailMessage($this->data);
    }

    /**
     * Get the reset password notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($data)
    {
        $mailMessage = (new MailMessage)
            ->subject(__(env('APP_NAME') . ' - ' . $data['title']))
            ->greeting(__($data['greeting']))
            ->line(new HtmlString($data['content']))
            ->cc($data['cc'])
            ->bcc($data['bcc'])
            ->from($data['from']['address'], $data['from']['name'])
            ->replyTo($data['replyTo']['address'], $data['replyTo']['name']);
        // for each $data['attachments'] as $attachment
        foreach ($data['attachments'] as $attachment) {
            $mailMessage->attach($attachment['web_path'], ['as' => $attachment['display_name'], 'mime' => 'application/' . $attachment['extension']]);
        }
        return  $mailMessage;
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
