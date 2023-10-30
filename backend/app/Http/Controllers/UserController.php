<?php

namespace App\Http\Controllers;

use App\DataTables\DataTablesUploadEditor;
use App\DataTables\UserDataTableEditor;
use App\DataTables\UsersDataTable;
use App\Mail\CustomMail;
use App\Models\FavouriteClub;
use App\Models\FavouriteTeam;
use App\Models\Player;
use App\Models\Role;
use App\Models\SendMessage;
use App\Models\Team;
use App\Models\User;
use App\Models\UserMessage;
use App\PushNotifications\CustomMessage;
use App\Rules\Rules\Name;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Yajra\DataTables\DataTables;

class UserController extends Controller
{
    public function all(Request $request)
    {
        // return datatable user with project_id = $request->project_id 
        // $users = User::where('project_id', $request->project_id)->get();
        $users = User::with(['role'])->get();
        return DataTables::of($users)->with(
            'options',
            // return role with value and label
            [
                'role' => Role::with('permissions')->withCount(['users', 'permissions'])->get()
            ]
        )
            ->rawColumns(['first_name', 'last_name'])
            ->make(true);
    }

    public function editor(UserDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    public function update(Request $request)
    {
        $request->validate([
            'first_name' => ['sometimes', 'required', new Name()],
            'last_name' => ['sometimes', 'required', new Name()],
            'email' => 'sometimes|required|email|unique:users,email,' . Auth::user()->id,
            'phone' => 'sometimes',
            'role_id' => 'sometimes|required',
            'firebase_token' => 'sometimes',
        ]);
        $user = Auth::user();
        $user->first_name = isset($request->first_name) ? $request->first_name : $user->first_name;
        $user->last_name = isset($request->last_name) ? $request->last_name : $user->last_name;
        $user->email = isset($request->email) ? $request->email : $user->email;
        $user->phone = isset($request->phone) ? $request->phone : $user->phone;
        $user->role_id = isset($request->role_id) ? $request->role_id : $user->role_id;
        $user->firebase_token = $request->firebase_token ?? null;
        $user->save();
        return response()->json(['message' => __('Profile updated successfully'), 'user' => $user], 200);
    }

    public function updateUserLanguage(Request $request)
    {
        try {
            $user = Auth::user();
            if ($user) {
                $user = User::find($user->id);
                $user->language = $request->language;
                $user->save();
            }
        } catch (\Exception $e) {
            error_log(print_r($e->getMessage(), true));
            return response()->json(['message' => trans('user.change_language_fail')], 501);
        }

        // response with success message
        return response()->json(['message' => trans('user.change_language_done'), 'lang' => $user->language], 200);
    }

    public function upload(DataTablesUploadEditor $editor)
    {
        return $editor->process(request());
    }

    // get user by role
    public function getUserByRole(Request $request)
    {
        $users = User::with('role')->whereHas('role', function ($query) use ($request) {
            if ($request->role_id == 0)
                return $query;
            else
                $query->where('id', $request->role_id);
        })->get();
        return DataTables::of($users)
            ->with(
                'options',
                // return role with value and label
                [
                    'role' => Role::with('permissions')->withCount(['users', 'permissions'])->get()
                ]
            )
            ->rawColumns(['first_name', 'last_name'])->make(true);
    }

    public function sendNotiActive()
    {
        $user = Auth::user();
        $user->sendNotiActive();
        return response()->json(['message' => 'Send noti success']);
    }


    public function resetDatabase()
    {
        Artisan::call('migrate:fresh --seed');
        Artisan::call('passport:install');
        return response()->json(['message' => 'Database reset successfully']);
    }

    // get favourite club
    public function getFavouriteClubs(Request $request)
    {
        $user = Auth::user();
        $favouriteClubs = $user->favouriteClubs()->get();
        return DataTables::of($favouriteClubs)
            ->make(true);
    }

    // toggle favourite club
    public function toggleFavouriteClub(Request $request)
    {
        $request->validate([
            'club_id' => 'required'
        ]);
        $user = Auth::user();
        $favClub = FavouriteClub::where('user_id', $user->id)->where('club_id', $request->club_id)->first();
        if ($favClub) {
            $favClub->delete();
            return response()->json(['message' => 'Remove favourite club success', 'data' => $favClub, 'action' => 'remove']);
        } else {
            $favClub = new FavouriteClub();
            $favClub->user_id = $user->id;
            $favClub->club_id = $request->club_id;
            $favClub->save();
            return response()->json(['message' => 'Add favourite club success', 'data' => $favClub, 'action' => 'create']);
        }
    }

    // get favourite teams
    public function getFavouriteTeams(Request $request)
    {
        $season_id = $request->input('season_id') ?? 0;
        $user = Auth::user();
        $favouriteTeams = $user->favouriteTeams()
            ->whereHas('group', function ($query) use ($season_id) {
                if ($season_id == 0)
                    return $query;
                else
                    $query->where('season_id', $season_id);
            })->get();
        return DataTables::of($favouriteTeams)
            ->addColumn('logo', function ($favouriteTeam) {
                return $favouriteTeam->club->logo;
            })
            ->make(true);
    }

    // toggle favourite team
    public function toggleFavouriteTeam(Request $request)
    {
        $request->validate([
            'team_id' => 'required'
        ]);
        $user = Auth::user();
        $favTeam = FavouriteTeam::where('user_id', $user->id)->where('team_id', $request->team_id)->first();
        if ($favTeam) {
            $favTeam->delete();
            return response()->json(['message' => 'Remove favourite team success']);
        } else {
            $favTeam = new FavouriteTeam();
            $favTeam->user_id = $user->id;
            $favTeam->team_id = $request->team_id;
            $favTeam->save();
            return response()->json(['message' => 'Add favourite team success']);
        }
    }

    function getguardianUsersTeam()
    {
        $club_ids = [11, 12];
        $season_id = 4;
        $group_ids = [42];
        $guardianUsers = User::whereHas('guardianPlayers', function ($query) use ($group_ids, $season_id) {
            $query->whereHas('teams', function ($query) use ($group_ids) {
                $query->whereIn('teams.group_id', $group_ids);
            });
        })->get();
        // get players have year of birth in group years where group_id in 2,4
        $guardianUsers1 = User::whereHas('guardianPlayers', function ($query) use ($club_ids, $season_id) {
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

        $guardianUsers = $guardianUsers->merge($guardianUsers1);

        return response()->json([
            'message' => 'Get guardian users success',
            'count' => count($guardianUsers),
            'data' => $guardianUsers
        ], 200);
    }

    function getUserByEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);
        $user = User::where('email', $request->email)->first();
        if ($user) {
            return response()->json([
                'message' => 'Get user success',
                'data' => $user
            ], 200);
        } else {
            return response()->json([
                'message' => 'User not found',
                'data' => null
            ], 400);
        }
    }
}
