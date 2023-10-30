<?php

namespace App\Http\Controllers;

use App\DataTables\StageMatchesDataTableEditor;
use App\Models\Location;
use App\Models\Stage;
use App\Models\StageMatch;
use App\Models\StageTeam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Yajra\DataTables\Facades\DataTables;

class StageMatchController extends Controller
{
    //get all matches in a stage by stage id
    public function allInStage($stage_id)
    {
        $teams = Stage::where('id', $stage_id)
            ->get()[0]->teams;
        $teams = $teams->map(function ($team) {
            return [
                'value' => $team->id,
                'label' => $team->name,
            ];
        });

        $matches = StageMatch::with(['homeTeam', 'awayTeam', 'location'])
            ->where('stage_id', $stage_id)
            ->get();
        return DataTables::of($matches)
            ->with(
                'options',
                [
                    'teams' => $teams,
                    'location' => Location::select('id as value', 'name as label')
                        ->orderBy('name', 'asc')
                        ->get(),
                ]
            )
            ->addColumn('start_time_short', function ($match) {
                return is_null($match->start_time) ? 'TBD' : date('H:i', strtotime($match->start_time));
            })
            ->addColumn('end_time_short', function ($match) {
                return is_null($match->end_time) ? 'TBD' : date('H:i', strtotime($match->end_time));
            })
            ->addColumn('location_name', function ($match) {
                return is_null($match->location) ? 'TBD' : $match->location->name;
            })
            ->addColumn('home_team_name', function ($match) {
                return is_null($match->homeTeam) ? 'TBD' : $match->homeTeam->name;
            })
            ->addColumn('away_team_name', function ($match) {
                return is_null($match->awayTeam) ? 'TBD' : $match->awayTeam->name;
            })
            ->editColumn('home_score', function ($match) {
                return is_null($match->home_score) ? '' : $match->home_score;
            })
            ->editColumn('away_score', function ($match) {
                return is_null($match->away_score) ? '' : $match->away_score;
            })
            ->addColumn('date', function ($match) {
                return is_null($match->start_time) ? 'TBD' : date('Y-m-d', strtotime($match->start_time));
            })
            ->addColumn('group_round', function ($match) {
                //split round name by - and get the first part
                $round_name = trim(explode('-', $match->round_name)[0]);
                return $round_name;
            })
            ->make(true);
    }

    public function editor(StageMatchesDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    // get all matches in tournament by tournament id
    public function matchesInTournament($tournament_id)
    {
        $matches = StageMatch::selectRaw('*,DATE_FORMAT(start_time,"%Y-%m-%d") as date')
            ->with(['homeTeam', 'awayTeam', 'location'])
            ->whereHas('stage', function ($query) use ($tournament_id) {
                $query->where('tournament_id', $tournament_id);
            })
            ->get();
        // group matches by stage
        $matches = $matches->groupBy('date');
        return  response()->json($matches);
    }

    // get macth by id
    public function show($match_id)
    {
        $match = StageMatch::with(['homeTeam.club', 'awayTeam.club', 'location', 'stage.tournament'])
            ->where('id', $match_id)
            ->first();
        return response()->json($match, 200);
    }

    // check match exists
    public function checkMatchExists($match_id)
    {
        $match = StageMatch::find($match_id);
        if ($match) {
            return response()->json(true, 200);
        }
        return response()->json(false, 200);
    }

    // get matches available for live stream
    public function getLiveMatches()
    {
        $cancel_types = config('constants.cancel_match_types');
        $matches = StageMatch::with(['homeTeam.club', 'awayTeam.club', 'location', 'tournament'])
            ->whereHas('stage', function ($query) {
                $query->where('is_released', 1);
            })
            ->where(function ($query) use ($cancel_types) {
                $query->whereNotIn('status', $cancel_types)
                    ->orWhereNull('status');
            })
            // home team is not null
            ->whereNotNull('home_team_id')
            // away team is not null
            ->whereNotNull('away_team_id')
            ->where('end_time', '>=', date('Y-m-d H:i:s'))
            ->where('end_time', '<=', date('Y-m-d 23:59:59'))
            ->where('broadcast_status', '=', 'not_started')
            ->get();
        return DataTables::of($matches)->make(true);
    }

    /**
     * Get streaming matches by status
     */
    public function getStreamingMatches($status = null) {
        $matches = StageMatch::with(['homeTeam.club', 'awayTeam.club', 'location', 'tournament']);

        Log::info('status: ' . $status);

        if ($status !== null) {
            $matches->where('broadcast_status', $status);
        }

        $matches = $matches->whereNotNull('broadcast_id')->get();

        return response()->json(['matches' => $matches]);
    }

    // update Broadcast id 
    public function updateBroadcastId(Request $request)
    {
        $request->validate([
            'match_id' => 'required|integer',
            'broadcast_id' => 'required|string',
            'broadcast_status' => 'required|string'
        ]);
        $match = StageMatch::find($request->match_id);
        if ($match) {
            $match->broadcast_id = $request->broadcast_id;
            $match->broadcast_status = $request->broadcast_status;
            $match->save();
            return response()->json(true, 200);
        }
        return response()->json(false, 200);
    }
}
