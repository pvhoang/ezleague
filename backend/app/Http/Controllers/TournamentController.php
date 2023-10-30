<?php

namespace App\Http\Controllers;

use App\DataTables\TournamentsDataTableEditor;
use App\Models\Group;
use App\Models\Team;
use App\Models\Tournament;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Yajra\DataTables\Facades\DataTables;

class TournamentController extends Controller
{
    //all tournaments in group by group id
    public function allInGroup(Request $request)
    {
        $tournaments = Tournament::with(['stages'])
            ->where('group_id', $request->group_id)
            ->orderBy('created_at', 'desc')
            ->get();
        return DataTables::of($tournaments)
            ->make(true);
    }

    public function editor(TournamentsDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    // get all matches by stage id
    public function getMatchesByStageId(Request $request)
    {
        $matches = DB::table('stage_matches')
            ->leftjoin('locations', 'stage_matches.location_id', '=', 'locations.id')
            ->where('stage_matches.stage_id', $request->stage_id)
            ->select('stage_matches.*', 'locations.name as location')
            ->get();

        foreach ($matches as $match) {
            // get date from start_time, if start_time is null then return TBD
            $match->date = is_null($match->start_time) ? 'TBD' : date('Y-m-d', strtotime($match->start_time));
            // format start_time, if start_time is null then return TBD
            $match->start_time = is_null($match->start_time) ? 'TBD' : date('H:i', strtotime($match->start_time));
            // format end_time, if end_time is null then return TBD
            $match->end_time = is_null($match->end_time) ? 'TBD' : date('H:i', strtotime($match->end_time));
            // get home_team name by home_team_id, if home_team_id is null then return TBD
            $home_team = DB::table('teams')->where('id', $match->home_team_id)->first();
            $match->home_team_id = is_null($home_team) ? 'TBD' : $home_team->name;
            // get away_team name by away_team_id, if away_team_id is null then return TBD
            $home_team = DB::table('teams')->where('id', $match->away_team_id)->first();
            $match->away_team_id = is_null($home_team) ? 'TBD' : $home_team->name;
            // get user (first_name + last_name) by scores_updated_by, if scores_updated_by is null then return ''
            $user =  DB::table('users')->where('id', '=', $match->scores_updated_by)->first();
            $match->user = is_null($user) ? '' : $user->first_name . ' ' . $user->last_name;
        }

        return DataTables::of($matches)
            ->make(true);
    }

    public function getTournamentById($id)
    {
        $tournament = Tournament::find($id);
        // get group name by group_id
        $group = Group::find($tournament->group_id);
        $tournament->group_name = $group->name;
        // get stages by tournament_id

        return response()->json($tournament, 200);
    }

    public function showMatchesInSeasonByUser($season_id)
    {
        $group_id = request()->input('group_id') ?? null;
        $tournament_id = request()->input('tournament_id') ?? null;
        $team_clubs = Auth::user()->teamsClub;
        $teams_coach = Auth::user()->teamsCoach;
        $teams = $team_clubs->merge($teams_coach);
        if (Auth::user()->isAdmin()) {
            $teams = Team::whereHas('group', function ($query) use ($season_id) {
                $query->where('season_id', $season_id);
            })->get();
        }
        $team_ids = $teams->pluck('id');
        $query = DB::table('stage_matches')
            ->join('stages', 'stage_matches.stage_id', '=', 'stages.id')
            ->join('tournaments', 'stages.tournament_id', '=', 'tournaments.id')
            ->leftjoin('groups', 'tournaments.group_id', '=', 'groups.id')
            ->leftjoin('locations', 'stage_matches.location_id', '=', 'locations.id')
            ->leftjoin('teams as home_team', 'stage_matches.home_team_id', '=', 'home_team.id')
            ->leftjoin('teams as away_team', 'stage_matches.away_team_id', '=', 'away_team.id')
            // club home team
            ->leftJoin('clubs as club_home_team', 'home_team.club_id', '=', 'club_home_team.id')
            // club away team
            ->leftJoin('clubs as club_away_team', 'away_team.club_id', '=', 'club_away_team.id')
            ->where('groups.season_id', $season_id)
            ->where('stages.is_released', 1)
            // if stage.is_display_tbd = 0 then hide TBD matches
            ->where(function ($query) {
                $query->where('stages.is_display_tbd', 1)
                    ->orWhere(function ($query) {
                        $query->where('stages.is_display_tbd', 0)
                            ->whereNotNull('stage_matches.home_team_id')
                            ->whereNotNull('stage_matches.away_team_id')
                            ->whereNotNull('stage_matches.start_time')
                            ->whereNotNull('stage_matches.end_time')
                            ->whereNotNull('stage_matches.location_id');
                    });
            });

        if ($tournament_id) {
            $query->where('tournaments.id', $tournament_id);
        }
        if ($group_id) {
            $query->where('groups.id', $group_id);
        }

        $matches = $query
            ->where(function ($query) use ($team_ids) {
                $query->whereIn('stage_matches.home_team_id', $team_ids)
                    ->orWhereIn('stage_matches.away_team_id', $team_ids);
            })
            ->select(
                'stage_matches.*',
                'locations.name as location',
                'home_team.name as home_team',
                'away_team.name as away_team',
                'groups.name as group_name',
                'groups.id as group_id',
                'club_home_team.name as club_home_team',
                'club_away_team.name as club_away_team',
                'club_home_team.logo as club_home_team_logo',
                'club_away_team.logo as club_away_team_logo',
                'tournaments.name as tournament_name',
                'tournaments.id as tournament_id',
                'stages.name as stage_name',
                'stages.id as stage_id',
                'stages.type as stage_type'
            )
            ->selectRaw('DATE_FORMAT(stage_matches.start_time, "%Y-%m-%dT%TZ") as date')
            ->selectRaw('DATE_FORMAT(stage_matches.start_time, "%Y-%m-%dT%TZ") as start_time')
            ->selectRaw('DATE_FORMAT(stage_matches.end_time, "%Y-%m-%dT%TZ") as end_time')
            ->selectRaw('SUBSTRING_INDEX(stage_matches.round_name, "-", 1) as round')
            ->selectRaw('CONCAT(tournaments.name, "-", tournaments.id) as tournament_group')
            ->orderBy('tournament_id', 'asc')
            ->orderBy('stage_matches.start_time', 'asc')
            ->get();

        // get tournaments have in team_ids
        $tournaments = DB::table('tournaments')
            ->join('stages', 'tournaments.id', '=', 'stages.tournament_id')
            ->join('stage_matches', 'stages.id', '=', 'stage_matches.stage_id')
            ->leftjoin('groups', 'tournaments.group_id', '=', 'groups.id')
            ->where('stage_matches.id', '!=', null)
            ->where(function ($query) use ($team_ids) {
                $query->whereIn('stage_matches.home_team_id', $team_ids)
                    ->orWhereIn('stage_matches.away_team_id', $team_ids);
            })
            ->where('groups.season_id', $season_id)
            ->distinct()
            ->select('tournaments.id', 'tournaments.name')
            ->orderBy('tournaments.name', 'asc')
            ->get();

        // group matches by date and tournament_id
        $matches = $matches->groupBy(['date', 'tournament_id']);

        return response()->json([
            'matches' => $matches,
            'options' => [
                'tournaments' => $tournaments,
            ],
        ], 200);
    }

    // get fixtures matches in season
    public function showFixturesResultsInSeason($season_id)
    {
        $tournament_id = request()->input('tournament_id') ?? null;
        $team_id = request()->input('team_id') ?? null;
        $is_results = request()->input('is_results') ?? null;

        $query = DB::table('stage_matches')
            ->join('stages', 'stage_matches.stage_id', '=', 'stages.id')
            ->join('tournaments', 'stages.tournament_id', '=', 'tournaments.id')
            ->leftjoin('groups', 'tournaments.group_id', '=', 'groups.id')
            ->leftjoin('locations', 'stage_matches.location_id', '=', 'locations.id')
            ->leftjoin('teams as home_team', 'stage_matches.home_team_id', '=', 'home_team.id')
            ->leftjoin('teams as away_team', 'stage_matches.away_team_id', '=', 'away_team.id')
            ->leftJoin('clubs as club_home_team', 'home_team.club_id', '=', 'club_home_team.id')
            ->leftJoin('clubs as club_away_team', 'away_team.club_id', '=', 'club_away_team.id')
            ->where('groups.season_id', $season_id)

            ->where('stages.is_released', 1)
            // if stage.is_display_tbd = 0 then hide TBD matches
            ->where(function ($query) {
                $query->where('stages.is_display_tbd', 1)
                    ->orWhere(function ($query) {
                        $query->where('stages.is_display_tbd', 0)
                            ->whereNotNull('stage_matches.home_team_id')
                            ->whereNotNull('stage_matches.away_team_id')
                            ->whereNotNull('stage_matches.start_time')
                            ->whereNotNull('stage_matches.end_time')
                            ->whereNotNull('stage_matches.location_id');
                    });
            });
        if ($is_results) {
            $query->where(function ($query) {
                $query->where('stage_matches.home_score', '!=', null)
                    ->orWhere('stage_matches.away_score', '!=', null);
            });
        } else {
            $query
                // And home_score is null or away_score is null
                ->where(function ($query) {
                    $query->where('stage_matches.home_score', '=', null)
                        ->orWhere('stage_matches.away_score', '=', null);
                })
                // where start_time is future or now or TBD
                ->where(function ($query) {
                    $query->where('stage_matches.start_time', '>=', Carbon::now())
                        ->orWhere('stage_matches.start_time', '=', null);
                });
        }
        if ($tournament_id) {
            $query->where('tournaments.id', $tournament_id);
        }

        if ($team_id) {
            $query->where(function ($query) use ($team_id) {
                $query->where('stage_matches.home_team_id', $team_id)
                    ->orWhere('stage_matches.away_team_id', $team_id);
            });
        }


        $matches = $query
            ->select(
                'stage_matches.*',
                'locations.name as location',
                'home_team.name as home_team',
                'away_team.name as away_team',
                'groups.name as group_name',
                'groups.id as group_id',
                'club_home_team.name as club_home_team',
                'club_away_team.name as club_away_team',
                'club_home_team.logo as club_home_team_logo',
                'club_away_team.logo as club_away_team_logo',
                'tournaments.name as tournament_name',
                'tournaments.id as tournament_id',
                'stages.name as stage_name',
                'stages.id as stage_id',
                'stages.type as stage_type'
            )
            ->selectRaw('DATE_FORMAT(stage_matches.start_time, "%Y-%m-%dT%TZ") as date')
            ->selectRaw('DATE_FORMAT(stage_matches.start_time, "%Y-%m-%dT%TZ") as start_time')
            ->selectRaw('DATE_FORMAT(stage_matches.end_time, "%Y-%m-%dT%TZ") as end_time')
            ->selectRaw('SUBSTRING_INDEX(stage_matches.round_name, "-", 1) as round')
            ->selectRaw('CONCAT(tournaments.name, "-", tournaments.id) as tournament_group')
            ->orderBy('tournament_id', 'asc')
            ->orderBy('stage_matches.start_time', 'asc')
            ->get();

        // get stage_id group by stage_type, get one
        $stage_id = $matches->groupBy('stage_type')->map(function ($item) {
            return $item->first()->stage_id;
        });



        // group matches by date and tournament_id
        $matches = $matches->groupBy(['tournament_group', 'date', 'stage_type', 'round']);

        $data = [
            'matches' => $matches,
            'stage_id' => $stage_id,
        ];

        return response()->json($data, 200);
    }


    // get select option tournaments in season
    public function optionsTournaments(Request $request, $season_id = 0, $group_id = 0)
    {
        $check_user = $request->check_user ?? 'false';
        $user_id = $request->user()->id ?? 0;

        // get tournaments with teams in season
        $tournaments = DB::table('tournaments')
            ->join('stages', 'tournaments.id', '=', 'stages.tournament_id')
            ->leftjoin('groups', 'tournaments.group_id', '=', 'groups.id')
            ->where('groups.season_id', $season_id)
            ->where('stages.is_released', 1)

            ->distinct()
            ->select('tournaments.id', 'tournaments.name')
            ->orderBy('tournaments.name', 'asc');

        // if group_id = 0 then get tournaments in season
        if ($group_id) {
            $tournaments->where('tournaments.group_id', $group_id);
        }

        // if request check_user is true and user is not admin then get only tournaments in season related to user
        if ($check_user == 'true' && !Auth::user()->isAdmin()) {
            $tournaments->join('stage_teams', 'stages.id', '=', 'stage_teams.stage_id')
                ->join('teams', 'teams.id', '=', 'stage_teams.team_id');
            $temp = clone $tournaments;
            $club_manager = $tournaments->join('user_clubs', function ($join) use ($user_id) {
                $join->on('user_clubs.club_id', '=', 'teams.club_id')
                    ->where('user_clubs.user_id', '=', $user_id);
            })->get();

            $team_coach = $temp->join('team_coaches', function ($join) use ($user_id) {
                $join->on('team_coaches.team_id', '=', 'teams.id')
                    ->where('team_coaches.user_id', '=', $user_id);
            })->get();

            // merge two collection
            $tournaments = $club_manager->merge($team_coach)->unique('id');
        } else {
            $tournaments = $tournaments->get();
        }

        // get teams in tournaments
        foreach ($tournaments as $tournament) {
            $tournament->teams = DB::table('teams')
                ->join('stage_teams', 'teams.id', '=', 'stage_teams.team_id')
                ->join('stages', 'stage_teams.stage_id', '=', 'stages.id')
                ->join('tournaments', 'stages.tournament_id', '=', 'tournaments.id')
                ->where('tournaments.id', $tournament->id)
                ->select('teams.id', 'teams.name')
                ->orderBy('teams.name', 'asc')
                ->distinct()
                ->get();
        }

        // sort bu number in name, eg:  U9 -> Champ U9 -> U10 -> U11
        $tournaments = $tournaments->toArray();
        usort($tournaments, function ($a, $b) {
            $a = preg_replace('/\d+/', '', $a->name);
            $b = preg_replace('/\d+/', '', $b->name);
            return $a <=> $b;
        });

        return response()->json([
            'tournaments' => $tournaments,
        ], 200);
    }
}
