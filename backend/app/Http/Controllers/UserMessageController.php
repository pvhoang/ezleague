<?php

namespace App\Http\Controllers;

use App\Models\UserMessage;
use App\Http\Requests\StoreUserMessageRequest;
use App\Http\Requests\UpdateUserMessageRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserMessageController extends Controller
{
    public function getUserMessages($user_id)
    {
        // $take input
        $take = request()->input('take', 10);
        // if take all 

        $userMessages = UserMessage::where('user_id', $user_id)
            ->with('message.attachments' , 'message.sendBy')
            ->whereHas('message', function ($query) {
                $query->where('type', 'like', '%push_noti%');
            })
            ->where('status', 'like', '%sent%')
            ->orderBy('created_at', 'desc')
            ->get();
        $length = count($userMessages);
        
        if ($take != 'all') {
            $userMessages = $userMessages->take($take);
        }

        $data = [
            'messages' => $userMessages,
            'length' => $length,
            'unread' => count($userMessages->where('read', false))
        ];
        return  response()->json($data, 200);
    }

    public function addUserMessages($users, $message)
    {
        $status = null;
        switch ($message->type) {
            case 'push_noti':
                $status = '{ "push_noti": "queued" }';
                break;
            case 'email':
                $status = '{ "email": "queued" }';
                break;
            case 'email_push_noti':
                $status = '{ "email": "queued", "push_noti": "queued" }';
                break;
            default:
                break;
        }
        $userMessages = [];
        foreach ($users as $user) {
            if (!$user->firebase_token) {
                //if message type contains email
                if (strpos($message->type, 'email') !== false) {
                    $status = '{ "email": "queued" }';
                } else {
                    continue;
                }
            }

            $userMessages[] = [
                'message_id' => $message->id,
                'user_id' => $user->id,
                'status' => $status,
                'read' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }
        UserMessage::insert($userMessages);
    }

    // mark a message as read
    public function markAsRead(Request $request)
    {
        $request->validate([
            'user_message_id' => 'required',
        ]);
        $user_message_id = $request->user_message_id;

        $userMessage = UserMessage::find($user_message_id);
        if (!$userMessage) {
            return response()->json(['message' => 'user message not found', 'user_message_id' => $user_message_id], 404);
        }
        $userMessage->read = true;
        $userMessage->save();
        return response()->json(['message' => 'success'], 200);
    }

    // mask all messages as read
    public function markAllAsRead($user_id)
    {
        UserMessage::where('user_id', $user_id)
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'success'], 200);
    }
}
