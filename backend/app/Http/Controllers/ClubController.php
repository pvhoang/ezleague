<?php

namespace App\Http\Controllers;

use App\DataTables\ClubsDataTableEditor;
use App\Models\Club;
use App\Http\Controllers\Controller;
use App\Models\TeamCoach;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Yajra\DataTables\Facades\DataTables;

class ClubController extends Controller
{
    public function all(Request $request)
    {
        $clubs = Club::orderBy('name', 'asc')->get();
        return DataTables::of($clubs)->make(true);
    }

    public function editor(ClubsDataTableEditor $editor)
    {
        //use UserDataTableEditor to save data
        return $editor->process(request());
    }

    // Get all clubs is_active = 1
    public function getClubsActive(Request $request)
    {
        $clubs = Club::where('is_active', 1)
            ->orderBy('name', 'asc')
            ->get();
        return response()->json($clubs, 200);
    }

    public function toggleActive(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:clubs,id',
        ]);

        $club = Club::find($request->id);

        $club->is_active = !$club->is_active;
        $club->save();
        return response()->json($club, 200);
    }

    public function getClubByUser()
    {
        $data = Club::whereHas('userClubs', function ($query) {
            $query->where('user_id', Auth::user()->id);
        })
            ->where('is_active', 1)
            ->get();
        return DataTables::of($data)->make(true);
    }

    // get user in club
    public function getUsersByClub($club_id)
    {

        $club = Club::find($club_id);
        if (!$club) {
            return response()->json(['message' => __('validation.exists', ['attribute' => __('validation.attributes.club_id')])], 400);
        }
        $data = $club->users()->get();
        return DataTables::of($data)->make(true);
    }

    /**
     * Get all coaches by club id
     * @param $club_id
     */
    public function getCoachesByClub($club_id, Request $request)
    {
        $team_id = $request->team_id;
        $coaches = TeamCoach::select('users.*')
            ->join('teams', 'team_coaches.team_id', '=', 'teams.id')
            ->join('users', 'team_coaches.user_id', '=', 'users.id')
            ->where('teams.club_id', $club_id)
            ->distinct();

        // remove coach in team
        if ($team_id) {
            $coaches->whereNotIn('users.id', function ($query) use ($team_id) {
                $query->select('user_id')
                    ->from('team_coaches')
                    ->where('team_id', $team_id);
            });
        }

        $coaches = $coaches->get();

        return DataTables::of($coaches)->make(true);
    }
}
