<?php

namespace App\Listeners;

use App\Models\User;
use App\Models\UserMessage;
use Illuminate\Notifications\Events\NotificationFailed;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Exception\Messaging\NotFound;

class NotificationFailedListener
{
    /**
     * Handle the event.
     *
     * @param  NotificationFailed  $event
     * @return void
     */
    public function handle(NotificationFailed $event)
    {
        Log::info('NotificationFailedListener', ['event' => $event]);
        if (empty($event->data['exception'])) {
            return;
        }
        $exception = $event->data['exception'];
        $notifiable = $event->notifiable;
        $channel = $event->channel;
        if ($notifiable instanceof User) {

            if (isset($event->notification)) {
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
                                $user_message->status =  array_merge($user_message->status ?? [], ['email' => 'failed']);
                                break;
                            case  'NotificationChannels\\Fcm\\FcmChannel':
                                if ($notifiable->firebase_token) {
                                    $user_message->status =  array_merge($user_message->status ?? [], ['push_noti' => 'failed']);
                                }
                                break;
                        }
                        $user_message->save();
                    }
                }
            }
            /** @var User */
            $users = User::where('firebase_token', $event->data['token'])->get();
            // Log::info('User: ' . $user);
            if ($exception instanceof NotFound && $users) {
                foreach ($users as $user) {
                    $user->firebase_token = null;
                    $user->save();
                }
            }
        }
    }
}
