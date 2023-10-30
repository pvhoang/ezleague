<?php

namespace App\Http\Controllers;

use App\DataTables\TeamCoachesDataTableEditor;
use App\Models\TeamCoach;
use App\Models\User;
use App\Rules\Rules\Name;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TeamCoachController extends Controller
{
    // editor
    public function editor(TeamCoachesDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    /**
     * Create a new coach and assign to team
     */
    public function assignNewCoach(Request $request)
    {
        $teamId = $request->team_id;

        // validate request
        $request->validate([
            'first_name' => ['required', 'string', new Name()],
            'last_name' => ['required', 'string', new Name()],
            'email' => 'required|email',
            'phone' => 'sometimes|nullable',
            'team_id' => 'required',
        ]);

        // check if user already exists
        $user = User::where('email', $request->input('email'))->first();

        // get user role of team coach from app.php config file

        // create user if not exists
        if (!$user) {
            $password = Str::random(5);

            $user = new User();
            $user->first_name = $request->first_name;
            $user->last_name = $request->last_name;
            $user->email = $request->email;
            $user->role_id = config('app.roles.team_coach');
            $user->password = Hash::make($password);
            // TODO: send email to coach with password
        }

        // check if coach is already assigned to team
        $teamCoach = TeamCoach::where('team_id', $teamId)->where('user_id', $user->id)->first();

        if ($teamCoach) {
            return response()->json([
                'message' => __('Coach is already assigned to team'),
                'errors' => [
                    'email' => [__('Coach is already assigned to team')]
                ],
                'coach' => $user,
                'team_id' => $teamId,
            ], 422);
        } else {
            $user->phone = $request->phone ? $request->phone : $user->phone;
            $user->save();
            $teamCoach = new TeamCoach();
            $teamCoach->team_id = $teamId;
            $teamCoach->user_id = $user->id;
            $teamCoach->save();

            return response()->json([
                'message' => __('Coach created and assigned to team successfully'),
                'coach' => $user,
                'team_id' => $teamId,
            ], 201);
        }
    }
}
