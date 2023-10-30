<?php

namespace App\Http\Controllers;

use App\DataTables\SeasonsDataTableEditor;
use App\Models\Season;
use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Yajra\DataTables\Facades\DataTables;

class SeasonController extends Controller
{
    public function all(Request $request)
    {
        //Get seasons by project id
        // $seasons = Season::where('project_id', $request->project_id)->get();

        $seasons = Season::all();
        // format start_date and end_date and start_register_date
        return DataTables::of($seasons)->editColumn('start_date', function ($season) {
            return date('Y-m-d', strtotime($season->start_date));
        })
            ->editColumn('end_date', function ($season) {
                return date('Y-m-d', strtotime($season->end_date));
            })
            ->editColumn('start_register_date', function ($season) {
                return date('Y-m-d', strtotime($season->start_register_date));
            })
            ->make(true);
    }

    public function editor(SeasonsDataTableEditor $editor)
    {
        //use UserDataTableEditor to save data
        return $editor->process(request());
    }

    // Get current season by project id
    public function getCurrentSeason()
    {
        $seasons = Season::where('start_register_date', '<=', date('Y-m-d'))
            // ->where('project_id', $request->project_id)        
            ->where('end_date', '>=', date('Y-m-d'))
            ->where('status', config('constants.season_status.active'))
            ->orderBy('start_date', 'desc')->get();
        if ($seasons) {
            return response()->json($seasons->load('groups'), 200);
        } else {
            return response()->json(['message' => 'No season found'], 400);
        }
    }

    // Get season by id
    public function getSeasonById($id)
    {
        $season = Season::find($id);
        if ($season) {
            return response()->json($season, 200);
        } else {
            return response()->json(['message' => 'No season found'], 400);
        }
    }

    // Get seasons is active
    public function getSeasonsIsActive()
    {
        $seasons = Season::where('status', config('constants.season_status.active'))
            ->orderBy('start_date', 'desc')->get();
        if ($seasons) {
            return response()->json($seasons, 200);
        } else {
            return response()->json(['message' => 'No season found'], 400);
        }
    }

    // get all matches by season id
    public function getSeasonMatches(Request $request)
    {
        $matches = DB::table('stage_matches')
            ->leftJoin('locations', 'stage_matches.location_id', '=', 'locations.id')
            ->leftJoin('users', 'stage_matches.scores_updated_by', '=', 'users.id')
            ->leftJoin('teams as home_team', 'stage_matches.home_team_id', '=', 'home_team.id')
            ->leftJoin('teams as away_team', 'stage_matches.away_team_id', '=', 'away_team.id')
            ->join('stages', 'stage_matches.stage_id', '=', 'stages.id')
            ->join('tournaments', 'stages.tournament_id', '=', 'tournaments.id')
            ->join('groups', 'tournaments.group_id', '=', 'groups.id')
            ->where('groups.season_id', $request->season_id)
            ->select(
                'stage_matches.*',
                'home_team.name AS home_team_name',
                'away_team.name AS away_team_name',
                'home_team.club_id AS home_club_id',
                'away_team.club_id AS away_club_id',
                'tournaments.name',
                'locations.name as location',
                'users.first_name',
                'users.last_name'
            )
            ->get();

        if (!empty($request->club_id)) {
            // filter by club id
            $matches = $matches->filter(function ($match) use ($request) {
                return $match->home_club_id == $request->club_id || $match->away_club_id == $request->club_id;
            });
        }

        foreach ($matches as $match) {
            // get date from start_time, if start_time is null then return TBD
            $match->date = is_null($match->start_time) ? 'TBD' : date('Y-m-d', strtotime($match->start_time));
            // format start_time to ISO, if start_time is null then return TBD
            $match->start_time = is_null($match->start_time) ? 'TBD' : date('c', strtotime($match->start_time));
            // format end_time, if end_time is null then return TBD
            $match->end_time = is_null($match->end_time) ? 'TBD' : date('c', strtotime($match->end_time));
            // get user (first_name + last_name) by scores_updated_by, if scores_updated_by is null then return ''
            $match->user = is_null($match->scores_updated_by) ? '' : $match->first_name . ' ' . $match->last_name;
        }

        return DataTables::of($matches)
            ->make(true);
    }

    /**
     * Get seasons by status
     * @param Request $request
     */
    public function getSeasons(Request $request)
    {
        $status = $request->input('status');
        $query = Season::query();

        if ($status === 'active') {
            $query->where('status', 'active');
        } else if ($status === 'archived') {
            $query->where('status', 'archived');
        }

        $seasons = $query->orderBy('start_date', 'desc')->get();

        return response()->json($seasons, 200);
    }

    /**
     * Get teams by season id and user role
     * @param $season_id
     * 
     */
    public function getTeamsInSeason2Manage($season_id, $club_id = 0, $group_id = 0)
    {
        $data = Team::with(['club', 'group'])->whereHas('group', function ($query) use ($group_id, $season_id) {
            if ($group_id != 0) {
                $query->where('id', $group_id);
            }
            $query->where('groups.season_id', $season_id);
        });
        if (!Auth::user()->isAdmin()) {
            // get teams for Club Manager
            $data->whereHas('club.userClubs', function ($query) {
                $query->where('user_id', Auth::id());
            });
            // get teams for Team Coach
            $data->orWhereHas('teamCoaches', function ($query) {
                $query->where('user_id', Auth::id());
            });
        }

        $data->whereHas('club', function ($query) use ($club_id) {
            if ($club_id != 0) {
                $query->where('id', $club_id);
            }
        })
            ->withCount('teamPlayers')
            ->withCount('teamCoaches')
            ->get();
        return DataTables::of($data)->make(true);
    }
}
