<?php

namespace App\Listeners;

use App\Models\UserMessage;
use Illuminate\Notifications\Events\NotificationSent;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Messaging\MessageTarget;
use Kreait\Firebase\Messaging\SendReport;
use NotificationChannels\Fcm\FcmChannel;

class NotificationSentListener
{
    /**
     * Removes bad device tokens from the user.
     *
     * @param \Illuminate\Notifications\Events\NotificationSent $event
     * @return void
     */
    public function handle(NotificationSent $event): void
    {
        Log::info('NotificationSentListener', ['event' => $event]);
        $notifiable = $event->notifiable;
        $channel = $event->channel;
        $response = $event->response;
        if (isset($event->notification)) {
            // Log::info('NotificationSentListener', ['Chanel' => $channel]);
            $notification =  $event->notification;
            // to json 
            $notification = json_decode(json_encode($notification), true);
            if (isset($notification['send_message'])) {
                $user_message = UserMessage::where('message_id', $notification['send_message']['id'])
                    ->where('user_id', $notifiable->id)
                    ->first();
                if ($user_message) {
                    switch ($channel) {
                        case 'mail':
                            $user_message->status =  array_merge($user_message->status ?? [], ['email' => 'sent']);
                            break;
                        case  'NotificationChannels\\Fcm\\FcmChannel':
                            if ($notifiable->firebase_token) {
                                $user_message->status =  array_merge($user_message->status ?? [], ['push_noti' => 'sent']);
                            }
                            break;
                    }
                    $user_message->save();
                }
            }
        }
    }
}
