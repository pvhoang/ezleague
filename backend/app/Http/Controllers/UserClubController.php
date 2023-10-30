<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserClub;
use Illuminate\Http\Request;

class UserClubController extends Controller
{
    //create user club
    public function create(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'club_id' => 'required|integer',
        ]);

        // find user by email
        $user = User::where('email', $request->email)->first();
        // check user club exist
        $userClub = UserClub::where('user_id', $user->id)
            ->where('club_id', $request->club_id)
            ->first();
        if ($userClub) {
            return response()->json(['message' => __('validation.unique', ['attribute' => __('validation.attributes.user_id')])], 400);
        }
        $userClub = UserClub::create([
            'user_id' => $user->id,
            'club_id' => $request->club_id,
        ]);

        return response()->json($userClub, 200);
    }

    //delete user club
    public function destroy(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'club_id' => 'required|integer',
        ]);

        $userClub = UserClub::where('user_id', $request->user_id)
            ->where('club_id', $request->club_id)
            ->first();

        if (!$userClub) {
            return response()->json(['message' => __('User club not found')], 400);
        }

        $userClub->delete();

        return response()->json(['message' => __('Delete user club success')], 200);
    }
}
