<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Notifications\Events\NotificationSending;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Exception\Messaging\NotFound;

class NotificationSendingListener
{
    /**
     * Handle the event.
     *
     * @param  NotificationSending   $event
     * @return void
     */
    public function handle(NotificationSending  $event)
    {
        Log::info('NotificationSendingListener', ['event' => $event]);
    }
}
