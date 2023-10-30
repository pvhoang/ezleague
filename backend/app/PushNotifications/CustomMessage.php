<?php

namespace App\PushNotifications;

use App\Models\SendMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;
use NotificationChannels\Fcm\Resources\AndroidConfig;
use NotificationChannels\Fcm\Resources\AndroidFcmOptions;
use NotificationChannels\Fcm\Resources\AndroidMessagePriority;
use NotificationChannels\Fcm\Resources\AndroidNotification;
use NotificationChannels\Fcm\Resources\ApnsConfig;
use NotificationChannels\Fcm\Resources\ApnsFcmOptions;
use Illuminate\Support\Str;
use NotificationChannels\Fcm\Resources\WebpushConfig;
use NotificationChannels\Fcm\Resources\WebpushFcmOptions;
use Throwable;

class CustomMessage extends Notification
implements ShouldQueue
{
    use Queueable;
    public $data = [
        'key' => '',
        'title' => '',
        'content' => '',
        'go_url' => '',
        'image_url' => '',
    ];
    public SendMessage $send_message;

    public function via($notifiable)
    {
        return [FcmChannel::class];
    }

    public function __construct($data, SendMessage $send_message)
    {
        $data['key'] = Str::random(5);
        $data = array_merge($this->data, $data);
        $this->data = $data;
        $this->send_message = $send_message;
        // Log::info('CustomMessage', $data);
    }

    public function toFcm($notifiable)
    {
        $fcm = FcmMessage::create();
        if ($this->data['go_url']) {
            $fcm->setData(['go_url' => $this->data['go_url']]);
        }
        $this->data['content'] = strip_tags($this->data['content']);
        // replace /<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g with space
        $this->data['content'] = preg_replace('/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/u', ' ', $this->data['content']);
        return
            $fcm->setNotification(\NotificationChannels\Fcm\Resources\Notification::create()
                ->setTitle($this->data['title'])
                ->setBody($this->data['content'])
                ->setImage($this->data['image_url']))
            ->setAndroid(
                AndroidConfig::create()
                    ->setFcmOptions(AndroidFcmOptions::create()->setAnalyticsLabel('analytics'))
                    ->setNotification(AndroidNotification::create()->setColor('#0A0A0A'))
                    ->setPriority(AndroidMessagePriority::HIGH)
                    ->setCollapseKey($this->data['key'])
            )->setApns(
                ApnsConfig::create()
                    ->setFcmOptions(ApnsFcmOptions::create()->setAnalyticsLabel('analytics_ios'))
            )
            ->setWebpush(
                WebpushConfig::create()
                    ->setFcmOptions(WebpushFcmOptions::create()->setAnalyticsLabel('analytics_web')
                        ->setLink(config('app.client_url')))
            );
    }

    // optional method when using kreait/laravel-firebase:^3.0, this method can be omitted, defaults to the default project
    public function fcmProject($notifiable, $message)
    {
        // $message is what is returned by `toFcm`
        return 'app'; // name of the firebase project to use
    }

    public function failed(Throwable $exception): void
    {
        // Send user notification of failure, etc...
    }
}
