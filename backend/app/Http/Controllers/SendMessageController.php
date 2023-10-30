<?php

namespace App\Http\Controllers;

use App\Models\SendMessage;
use App\Http\Requests\StoreSendMessageRequest;
use App\Http\Requests\UpdateSendMessageRequest;
use App\Mail\CustomMail;
use App\Models\Club;
use App\Models\File;
use App\Models\Group;
use App\Models\User;
use App\Models\UserMessage;
use App\PushNotifications\CustomMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Yajra\DataTables\Facades\DataTables;

class SendMessageController extends Controller
{
    public function all(Request $request)
    {
        $sendMessages = SendMessage::all();
        return DataTables::of($sendMessages)->make(true);
    }

    public function bySeason(Request $request)
    {
        if (!isset($request->season_id) || !$request->season_id) {
            return DataTables::of([])->make(true);
        }
        $sendMessages = SendMessage::with('sendBy')->where('season_id', $request->season_id)->get();
        return DataTables::of($sendMessages)
            ->editColumn('send_to', function ($sendMessage) {
                //    send_to is array. get value of keys group_ids, club_ids
                $send_to = $sendMessage->send_to;
                $group_ids = $send_to['group_ids'];
                $club_ids = $send_to['club_ids'];
                $player_ids = $send_to['player_ids'] ?? [];
                $user_messages = $send_to['user_messages'];
                $all = $send_to['all'];

                $str_send_to = '';
                // get group by group_ids
                if ($group_ids) {
                    $groups = Group::select('name')->whereIn('id', $group_ids)->get();
                    // implode array to string
                    $str_send_to .= '<b>Groups:</b> ';
                    $str_send_to .= implode(', ', $groups->pluck('name')->toArray());
                    $str_send_to .= '<br>';
                }
                // get club by club_ids
                if ($club_ids) {
                    $clubs = Club::select('code')->whereIn('id', $club_ids)->get();
                    // implode array to string
                    $str_send_to .= '<b>Clubs:</b> ';
                    $str_send_to .= implode(', ', $clubs->pluck('code')->toArray());
                }

                if ($player_ids) {
                    $players = User::selectRaw('CONCAT(first_name, " ", last_name) as full_name')->whereHas('player', function ($q) use ($player_ids) {
                        $q->whereIn('players.id', $player_ids);
                    })->get();
                    // implode array to string
                    $str_send_to .= '<b>Players:</b> ';
                    $str_send_to .= implode(', ', $players->pluck('full_name')->toArray());
                }

                if ($user_messages) {
                    $str_send_to .= 'Users';
                }

                if ($all) {
                    $str_send_to .= 'All';
                }

                return $str_send_to;
            })
            ->rawColumns(['content', 'send_to'])
            ->make(true);
    }


    /**
     * Send noti to user
     * @param array data = [
     *      'title' => 'Test title',
     *      'content' => 'Test content',
     *      'image_url' => 'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg',
     *      'go_url' => 'https://ezactive.com'
     *     ];
     * @return \Illuminate\Http\Response
     */
    function sendCustomPushNotiMessage($data, $users, $message)
    {
        try {
            Notification::send($users, new CustomMessage($data, $message));
            return response()->json(['message' => 'Send notification success'], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Send notification fail'], 501);
        }
    }

    /**
     * CustomMail
     * @param array $data $data = [
     *      'title' => '',
     *      'greeting' => '',
     *      'content' => '',
     *      'attachments' => [public_path('images/logo/icon-72x72.png')],
     *      'form' => [
     *         'address' => '',
     *         'name' => ''
     *      ],
     *      'cc' => [email1, email2],
     *      'bcc' => [email1, email2],
     *      'replyTo' => [
     *          'address' => '',
     *          'name' => '',
     *      ]
     *   ];
     */
    function sendCustomEMail($data, $users, $message)
    {
        try {
            Notification::send($users, new CustomMail($data, $message));
            return response()->json(['message' => 'Send email success'], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Send email fail'], 501);
        }
    }

    function sendCustomMessage(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255|min:1',
            'content' => 'required|string',
            'greeting' => 'sometimes',
            'attachments' => 'sometimes|string',
            'cc' => 'sometimes',
            'bcc' => 'sometimes',
            'replyToAddress' => 'sometimes',
            'replyToName' => 'sometimes',
            'formAddress' => 'sometimes',
            'formName' => 'sometimes',
            'user_ids' => 'sometimes|string',
            'group_ids' => 'sometimes|string',
            'club_ids' => 'sometimes|string',
            'player_ids' => 'sometimes|string',
            'all_users' => 'sometimes|boolean',
            'season_id' => 'required',
            'type' => 'required|string|in:push_noti,email,email_push_noti',
        ]);

        $message = new SendMessage();
        $message->title = $request->title;
        $message->content = $request->content;
        $message->type = $request->type;
        $message->season_id = $request->season_id;
        $message->user_id = Auth::id();

        $data = [
            'title' => $request->title,
            'content' => $request->content,
            'greeting' => $request->greeting ?? '',
            'attachments' => $request->attachments ?? [],
            'cc' => $request->cc ?? [],
            'bcc' => $request->bcc ?? [],
        ];

        if ($request->replyToAddress && $request->replyToName) {
            $data['replyTo'] = [
                'address' => $request->replyToAddress,
                'name' => $request->replyToName,
            ];
        }
        if ($request->formAddress && $request->formName) {
            $data['form'] = [
                'address' => $request->formAddress,
                'name' => $request->formName,
            ];
        }

        $season_id = $request->season_id;

        if ($request->all_users) {
            $users = User::all();
        }

        if (isset($request->user_ids)) {
            $user_ids = explode(',', $request->user_ids);
            $users = User::whereIn('id', $user_ids)->get();
        }

        if (isset($request->player_ids)) {
            $player_ids = explode(',', $request->player_ids);
            $users = User::whereHas('guardianPlayers', function ($query) use ($player_ids, $season_id) {
                $query->whereIn('players.id', $player_ids);
            })->get();
        }

        // get users parent by group through player
        if (isset($request->group_ids)) {
            $group_ids = explode(',', $request->group_ids);
            $users = (User::whereHas('guardianPlayers', function ($query) use ($group_ids) {
                $query->whereHas('teams', function ($query) use ($group_ids) {
                    $query->whereIn('teams.group_id', $group_ids);
                });
            })->get());
        }

        // get users parent by club through player
        if (isset($request->club_ids)) {
            $club_ids = explode(',', $request->club_ids);
            $list_users = User::whereHas('guardianPlayers', function ($query) use ($club_ids, $season_id) {
                // where has registrations
                $query->whereHas('registrations', function ($query) use ($season_id) {
                    $query->where('approval_status', config('constants.approve_status.approved'));
                    $query->where('season_id', $season_id);
                });
                //  where has club 
                $query->whereHas('clubs', function ($query) use ($club_ids) {
                    $query->whereIn('clubs.id', $club_ids);
                });
            })->get();

            if (isset($users) && $users->count() > 0) {
                $users = $users->merge($list_users);
            } else {
                $users = $list_users;
            }
        }



        if (isset($request->attachments)) {
            $data['attachments'] = explode('|', $request->attachments);
            // find attachments in files table
            $attachment = File::select('id', 'display_name', 'web_path','extension')->whereIn('web_path', $data['attachments'])->get();
            $data['attachments'] = $attachment->toArray();
            $message->attachments =  $attachment->pluck('id')->toArray();
        }

        if (empty($users)) {
            return response()->json(['message' => 'No user found'], 404);
        }

        $message->send_to = [
            'player_ids' => $player_ids ?? [],
            'group_ids' => $group_ids ?? [],
            'club_ids' => $club_ids ?? [],
            'user_messages' => isset($request->user_ids) ? true : false,
            'all' => $request->all_users ?? false,
        ];
        $message->save();

        switch ($request->type) {
            case 'push_noti':
                // get users have firebase_token
                $users = $users->filter(function ($user) {
                    return $user->firebase_token != null;
                });
                $response =  $this->sendCustomPushNotiMessage($data, $users, $message);
                break;
            case 'email':
                $response =  $this->sendCustomEMail($data, $users, $message);
                break;
            case 'email_push_noti':
                $users_noti = $users->filter(function ($user) {
                    return $user->firebase_token != null;
                });
                $this->sendCustomPushNotiMessage($data, $users_noti, $message);
                $this->sendCustomEMail($data, $users, $message);
                $response = response()->json(['message' => 'Send notification and email success'], 200);
                break;
            default:
                $this->sendCustomEMail($data, $users, $message);
                $response = response()->json(['message' => 'Send email success'], 200);
                break;
        }

        // if status is 200, save message to database
        if ($response->status() == 200) {
            $userMessageCtrl = new UserMessageController();
            $userMessageCtrl->addUserMessages($users, $message);
        } else {
            // delete message if send fail
            $message->delete();
        }

        return $response;
    }

    public function messageDetails(Request $request, $message_id)
    {
        // where status has key 'push_noti' or 'email'
        $userMessages = UserMessage::where('message_id', $message_id)->with('user');
        if (isset($request->type)) {
            $userMessages = $userMessages->whereNotNull('status->' . $request->type);
        }
        $userMessages->get();
        return DataTables::of($userMessages)
            ->make(true);
    }

    // get message by id
    public function getMessage($message_id)
    {
        $message = SendMessage::where('id', $message_id)->first();
        return response()->json($message, 200);
    }

    function ckEditorUploadImage()
    {
    }
}
