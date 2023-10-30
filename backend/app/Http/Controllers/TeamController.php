<?php

namespace App\Http\Controllers;

use App\DataTables\TeamDataTableEditor;
use App\Models\Club;
use App\Models\Team;
use App\Models\TeamCoach;
use App\Models\TeamPlayer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Log;

class TeamController extends Controller
{
    //get all team followed by user
    public function getTeamsByUser($season_id, $club_id = 0, $group_id = 0)
    {
        $data = Team::with(['club', 'group']);
        if (!Auth::user()->isAdmin()) {
            $data->whereHas('club.userClubs', function ($query) {
                $query->where('user_id', Auth::id());
            });
        }
        $data->whereHas('group.season', function ($query) use ($season_id) {
            $query->where('id', $season_id);
        })
            ->whereHas('group', function ($query) use ($group_id) {
                if ($group_id != 0) {
                    $query->where('id', $group_id);
                }
            })
            ->whereHas('club', function ($query) use ($club_id) {
                if ($club_id != 0) {
                    $query->where('id', $club_id);
                }
            })
            ->withCount('teamPlayers')
            ->get();
        return DataTables::of($data)->make(true);
    }

    // get all teams in season
    public function getTeamsBySeasonId($season_id)
    {
        $data = Team::with(['club', 'group'])
            ->whereHas('group.season', function ($query) use ($season_id) {
                $query->where('id', $season_id);
            })
            ->orderBy('name', 'asc')
            ->get();

        return DataTables::of($data)
            ->addColumn('logo', function ($data) {
                return $data->club->logo;
            })
            ->make(true);
    }

    // get all teams by group id
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

    public function editor(TeamDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    // getTeamById
    public function getTeamById($id)
    {
        $data = Team::with(['club', 'group'])->find($id);
        return response()->json($data);
    }

    // get player by team id
    public function getPlayersByTeamId($team_id)
    {
        if ($team_id) {
            $data = TeamPlayer::with(['player.user', 'player.primaryGuardian.user'])
                ->where('team_id', $team_id)
                ->get();
            return DataTables::of($data)->make(true);
        } else {
            return DataTables::of([])->make(true);
        }
    }

    // assign player to team
    public function assignPlayerToTeam(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:teams,id',
            'player_id' => 'required|exists:players,id',
        ]);
        $teamPlayer = TeamPlayer::where('team_id', $request->team_id)
            ->where('player_id', $request->player_id)
            ->first();
        if ($teamPlayer) {
            return response()->json(['message' => 'Player already assigned to this team'], 400);
        }
        $teamPlayer = new TeamPlayer();
        $teamPlayer->team_id = $request->team_id;
        $teamPlayer->player_id = $request->player_id;
        $teamPlayer->save();
        $teamPlayer->load(['player.user', 'player.primaryGuardian.user']);
        $count =  TeamPlayer::where('team_id', $request->team_id)->count();
        $data = [
            'team_player' => $teamPlayer,
            'count_player' => $count,
        ];

        return response()->json($data);
    }

    // remove player from team
    public function removePlayerFromTeam(Request $request)
    {
        $request->validate([
            'team_player_id' => 'required|exists:team_players,id',
        ]);
        $teamPlayer = TeamPlayer::find($request->team_player_id);
        $teamPlayer->delete();
        $count =  TeamPlayer::where('team_id', $teamPlayer->team_id)->count();
        $data = [
            'message' => __('Successfull'),
            'count_player' => $count,
        ];
        return response()->json($data);
    }

    // get team manage by user
    public function getTeamManageByAuth()
    {
        // get input from link

        // DB::enableQueryLog();
        $teams = Auth::user()->with(['teams.stages.stage.matches', 'teams' => function ($query) {
            if (request()->input('group_id')) {
                $query->where('group_id', request()->input('group_id'));
            }
        }])->first();

        $data = [
            'teams' => $teams,
        ];
        // Log::info(DB::getQueryLog());
        return DataTables::of($data)->make(true);
    }

    /**
     * Get team coaches by team id
     * @param int $id
     */
    public function getTeamCoachesById($id)
    {
        $coaches = TeamCoach::with(['user'])
            ->where('team_id', $id)
            ->get();
        return DataTables::of($coaches)->make(true);
    }

    /**
     * Get team players by team id
     * @param int $id
     */
    public function getTeamPlayersById($team_id)
    {
        $data = TeamPlayer::with(['player.user', 'player.primaryGuardian.user'])
            ->where('team_id', $team_id)
            ->get();
        return DataTables::of($data)->make(true);
    }
}
