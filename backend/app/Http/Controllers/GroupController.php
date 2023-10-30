<?php

namespace App\Http\Controllers;

use App\DataTables\GroupsDataTableEditor;
use App\Models\Group;
use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Team;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    // Get all groups by season id
    public function getGroupsBySeasonId($season_id)
    {
        $groups = Group::where('season_id', $season_id)
            // order by number in name, e.g. "U9" will be ordered before "U10"
            ->orderByRaw('CAST(SUBSTRING(name, 2) AS UNSIGNED)')
            ->get();

        return response()->json($groups, 200);
    }

    public function all(Request $request)
    {
        // Get all groups
        $groups = Group::where('season_id', $request->season_id)->get();

        // Add an index column to the data table
        return DataTables::of($groups)->addIndexColumn()

            // Make the changes
            ->make(true);
    }

    public function editor(GroupsDataTableEditor $editor)
    {
        //use UserDataTableEditor to save data
        return $editor->process(request());
    }

    // get Group by club id
    public function getGroupByClub($club_id)
    {
        $data = Group::whereHas('teams', function ($query) use ($club_id) {
            $query->where('club_id', $club_id);
        })->get();
        return DataTables::of($data)->make(true);
    }

    /**
     * Get all teams by group id
     * @param $group_id
     */
    public function getTeamsByGroupId($group_id)
    {
        $data = Team::with(['club', 'group'])
            ->whereHas('group', function ($query) use ($group_id) {
                $query->where('id', $group_id);
            })
            // ->withCount('teamPlayers')
            ->get();
        return DataTables::of($data)
            ->with('options', [
                'club' => Club::with('userClubs')->withCount(['teams', 'userClubs'])->orderBy('name', 'asc')->get()
            ])
            ->make(true);
    }
}
