<?php

namespace App\PushNotifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;
use NotificationChannels\Fcm\Resources\AndroidConfig;
use NotificationChannels\Fcm\Resources\AndroidFcmOptions;
use NotificationChannels\Fcm\Resources\AndroidMessagePriority;
use NotificationChannels\Fcm\Resources\AndroidNotification;
use NotificationChannels\Fcm\Resources\ApnsConfig;
use NotificationChannels\Fcm\Resources\ApnsFcmOptions;
use NotificationChannels\Fcm\Resources\WebpushConfig;
use NotificationChannels\Fcm\Resources\WebpushFcmOptions;

class CancelMatch extends Notification implements ShouldQueue
{
    use Queueable;
    public $match;
    public $homeTeam;
    public $awayTeam;
    public $location;
    public $startTime;
    public function via($notifiable)
    {
        return [FcmChannel::class];
    }

    public function __construct($match)
    {
        $this->match = $match;
        $this->homeTeam = $match->homeTeam ? $match->homeTeam->name : 'TBD';
        $this->awayTeam = $match->awayTeam ? $match->awayTeam->name : 'TBD';
        $this->location = $match->location ? $match->location->name : 'TBD';
        $this->startTime = $match->start_time ? $match->start_time : 'TBD';
    }

    public function toFcm($notifiable)
    {
        $match_details_url = config('constants.match_details_url');
        $match_details_url = str_replace('{match_id}', $this->match->id, $match_details_url);
        return FcmMessage::create()
            ->setData(['go_url' => $match_details_url])
            ->setNotification(\NotificationChannels\Fcm\Resources\Notification::create()
                ->setTitle($this->homeTeam . ' VS ' . $this->awayTeam . ' at ' . $this->location . ' has been cancelled.')
                ->setBody($this->match->description ? $this->match->description : __('You have been notified about this match cancellation')))
            ->setAndroid(
                AndroidConfig::create()
                    ->setFcmOptions(AndroidFcmOptions::create()->setAnalyticsLabel('analytics'))
                    ->setNotification(AndroidNotification::create()->setColor('#0A0A0A'))
                    ->setPriority(AndroidMessagePriority::HIGH)
                    ->setCollapseKey('cancel_match')
            )->setApns(
                ApnsConfig::create()
                    ->setFcmOptions(ApnsFcmOptions::create()->setAnalyticsLabel('analytics_ios'))
            )->setWebpush(
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
}
