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

class UpdateScore extends Notification implements ShouldQueue
{
    use Queueable;
    public $match;
    public $homeTeam;
    public $awayTeam;
    public $location;
    public $startTime;
    public $is_penalty;
    public function via($notifiable)
    {
        return [FcmChannel::class];
    }

    public function __construct($match, $is_penalty)
    {
        $this->match = $match;
        $this->homeTeam = $match->homeTeam ? $match->homeTeam->name : 'TBD';
        $this->awayTeam = $match->awayTeam ? $match->awayTeam->name : 'TBD';
        $this->location = $match->location ? $match->location->name : 'TBD';
        $this->startTime = $match->start_time ? $match->start_time : 'TBD';
        $this->is_penalty = $is_penalty;
    }

    public function toFcm($notifiable)
    {
        $match_details_url = config('constants.match_details_url');
        $match_details_url = str_replace('{match_id}', $this->match->id, $match_details_url);
        $title = $this->homeTeam . ' ' . $this->match->home_score . ' - ' . $this->match->away_score . ' ' . $this->awayTeam;
        if ($this->is_penalty) {
            $title = $this->homeTeam . ' ' . $this->match->home_penalty . ' - ' . $this->match->away_penalty . ' ' . $this->awayTeam . ' (Penalty)';
        }
        return FcmMessage::create()
            ->setData(['go_url' => $match_details_url])
            ->setNotification(\NotificationChannels\Fcm\Resources\Notification::create()
                ->setTitle($title)
                ->setBody($this->match->description ? $this->match->description : __('Score has been updated')))
            ->setAndroid(
                AndroidConfig::create()
                    ->setFcmOptions(AndroidFcmOptions::create()->setAnalyticsLabel('analytics'))
                    ->setNotification(AndroidNotification::create()->setColor('#0A0A0A'))
                    ->setPriority(AndroidMessagePriority::HIGH)
                    ->setCollapseKey('update_score_' . $this->match->id)
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
}
