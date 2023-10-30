<?php

namespace App\Http\Controllers;

use App\DataTables\StagesDataTableEditor;
use App\Models\Stage;
use App\Models\StageMatch;
use App\Models\Team;
use App\Models\StageTeam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Str;

class StageController extends Controller
{
    //all stages in tournament by tournament id
    public function allInTournament($tournament_id)
    {
        $stages = Stage::where('tournament_id', $tournament_id)->get();
        return DataTables::of($stages)
            ->make(true);
    }

    public function editor(StagesDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    public function getStageById($id)
    {
        $stage = Stage::find($id);
        return response()->json($stage, 200);
    }

    //auto generate matches for a stage based on the teams and no_encounters 
    public function generateLeaugeMatches(Request $request)
    {
        $request->validate([
            'stage_id' => 'required',
        ]);
        $stage = Stage::find($request->stage_id);
        $teams = $stage->teams->pluck('id')->toArray();
        $no_encounters = $stage->no_encounters;
        $list_matches = [];
        $schedule = $this->createRoundRobinSchedule($teams);
        for ($i = 0; $i < $no_encounters; $i++) {
            foreach ($schedule as $round => $matches) {
                foreach ($matches as $match) {
                    if ($match[0] == $match[1] ||  !$match[1] || !$match[0]) continue;
                    // Log::info($match[0] . ' vs ' . $match[1]);
                    $match = [
                        'stage_id' => $stage->id,
                        'home_team_id' => $match[0],
                        'away_team_id' => $match[1],
                        'round_level' => $round + 1,
                        'round_name' => 'Round ' . ($round + 1),
                        'home_score' => null,
                        'away_score' => null,
                        'created_by' => Auth::user()->id,
                        'created_at' => now(),
                    ];
                    array_push($list_matches, $match);
                }
            }
            // swap teams in schedule
            $schedule = $this->swapTeamsInSchedule($schedule);
        }
        // create matches
        StageMatch::insert($list_matches);
        // return matches created
        $list_matches = StageMatch::with('homeTeam', 'awayTeam', 'location')
            ->where('stage_id', $stage->id)->get();

        return DataTables::of($list_matches)->make(true);
    }

    public function generateGroupsMatches(Request $request)
    {
        $request->validate([
            'stage_id' => 'required',
        ]);

        $stage = Stage::find($request->stage_id);
        $list_matches = [];
        $no_encounters = $stage->no_encounters;
        $groups = $stage->stageTeams->groupBy('group');

        //generate matches for each team with each other team in each group
        foreach ($groups as $key => $group) {
            // Log::info('Key: ' . $key);
            $teams = $group->pluck('team_id')->toArray();
            $schedule = $this->createRoundRobinSchedule($teams);
            // Log::info($match[0] . ' vs ' . $match[1]);
            $key_round_level = $key;
            // get 2 chars of key if key length > 2
            if (strlen($key) > 2) {
                $key_round_level = substr($key, 0, 1) . Str::random(2);
            }
            for ($i = 0; $i < $no_encounters; $i++) {
                foreach ($schedule as $round => $matches) {
                    foreach ($matches as $match) {
                        if ($match[0] == $match[1] ||  !$match[1] || !$match[0]) continue;

                        $match = [
                            'stage_id' => $stage->id,
                            'home_team_id' => $match[0],
                            'away_team_id' => $match[1],
                            'round_level' => $key_round_level . '-' . $round + 1,
                            'round_name' => 'Round ' . ($round + 1),
                            'round_name' => 'Group ' . $key . ' - Round ' .  $round + 1,
                            'home_score' => null,
                            'away_score' => null,
                            'created_by' => Auth::user()->id,
                            'created_at' => now(),
                        ];
                        array_push($list_matches, $match);
                    }
                }
                // swap teams in schedule
                $schedule = $this->swapTeamsInSchedule($schedule);
            }
        }

        // create matches
        StageMatch::insert($list_matches);
        // return matches created
        $list_matches = StageMatch::with('homeTeam', 'awayTeam', 'location')
            ->where('stage_id', $stage->id)->get();

        return DataTables::of($list_matches)
            ->make(true);
    }

    public function createRoundRobinSchedule($teams)
    {
        $schedule = array();
        $schedule =  $this->roundRobinSchedule($teams);
        return $schedule;
    }

    public function roundRobinSchedule($teams)
    {
        if (count($teams) % 2 != 0) {
            // add null to head of array
            array_unshift($teams, null);
        }
        $numRounds = count($teams) - 1;

        $schedule = array();
        $count_fist_team = 0;
        for ($i = 0; $i < $numRounds; $i++) {
            for ($j = 0; $j < count($teams) / 2; $j++) {
                $home_team = $teams[$j];
                $away_team = $teams[count($teams) - $j - 1];
                if ($j == 0) {
                    $count_fist_team++;
                }
                if ($home_team == null || $away_team == null || $home_team == $away_team) continue;
                // if the number of teams is odd, swap home team and away team
                if ($count_fist_team % 2 == 0 && $j == 0 && $home_team != null && $away_team != null) {
                    $match = array($away_team, $home_team);
                } else {
                    $match = array($home_team, $away_team);
                }

                $schedule[$i][$j] = $match;
            }
            // rotate teams
            array_splice($teams, 1, 0, array_pop($teams));
        }
        return $schedule;
    }

    public function swapTeamsInSchedule($schedule)
    {
        $new_schedule = [];
        foreach ($schedule as $round => $matches) {
            foreach ($matches as $match) {
                $new_schedule[$round][] = array($match[1], $match[0]);
            }
        }
        return $new_schedule;
    }

    public function generateKnockOutSchedule($stage_id, array $teams, $third_place = false, $auto = false, $match_each_layer =1)
    {
        $count_team = count($teams);
        $total_levels = ceil(log($count_team, 2));
        $count_team_needed = pow(2, $total_levels);
        $total_matches = $count_team_needed - 1;
        $matches = [];
        $schedule = [];
        // add bye team
        for ($i = 0; $i < $count_team_needed - $count_team; $i++) {
            array_push($teams, null);
        }

        // calculate the number of matches will pass to the next round if the total teams is not a power of 2
        $pass_layers = $count_team_needed - $count_team;
        $next_matches = [];
        $order = 1;
        // generate matches for each round, with round having round*2 matches
        $round_of = $count_team_needed * 2;
        for ($i = $total_levels - 1; $i >= 0; $i--) {
            $level = $i + 1;
            $layers = pow(2, $i);

            switch ($level) {
                case 1:
                    $round_name = 'Final';
                    break;
                case 2:
                    $round_name = 'Semi Final';
                    break;
                case 3:
                    $round_name = 'Quarter Final';
                    break;
                default:
                    $round_of = $round_of / 2;
                    $round_name = 'Round of ' . $round_of;
                    break;
            }

            for ($layer = 1; $layer <= $layers; $layer++) {
                // code_id have 4 digits, first 2 digits is the level, last 2 digits is the layer
                $code_id = $level * 100 + $layer;
                if ($pass_layers > 0) {
                    // shift, and pop the first and last team
                    $home_team = array_shift($teams) ?? null;
                    $away_team = array_pop($teams) ?? null;
                    //calculate pass code
                    $next_level = $level - 1;
                    if ($layer % 2 == 0) {
                        $next_layer = $layer / 2;
                    } else {
                        $next_layer = ($layer + 1) / 2;
                    }
                    $pass_code = $next_level * 100 + $next_layer;
                    $next_matches[$pass_code][$layer % 2 == 0 ? 'away' : 'home'] = $home_team ?? $away_team;
                    $pass_layers--;
                } else {
                    $home_team = array_shift($teams) ?? null;
                    $away_team = array_pop($teams) ?? null;
                    // error_log("code_id: $code_id");
                    if (isset($next_matches[$code_id])) {
                        // error_log("next_matches[$code_id]". json_encode($next_matches[$code_id]));
                        if (isset($next_matches[$code_id]['home'])) {
                            $home_team = $next_matches[$code_id]['home'];
                        }
                        if (isset($next_matches[$code_id]['away'])) {
                            $away_team = $next_matches[$code_id]['away'];
                        }
                    }
                }

                // create matches
                for ($k = 0; $k < $match_each_layer; $k++) {
                    // if k is odd, swap home and away team
                    // if ($k % 2 != 0) {
                    $temp = $home_team;
                    $home_team = $away_team;
                    $away_team = $temp;
                    // }
                    // $match = array(
                    //     'home_team_id' => $home_team,
                    //     'away_team_id' => $away_team,
                    //     'round_name' =>$level==1?$round_name: "$round_name - $layer",
                    //     'level' => $code_id
                    // );
                    $match = [
                        'stage_id' => $stage_id,
                        'home_team_id' => $home_team && $auto ? $home_team : null,
                        'away_team_id' => $away_team && $auto ? $away_team : null,
                        'round_level' => $code_id,
                        'round_name' => $level == 1 ? $round_name : "$round_name - $layer",
                        'home_score' => null,
                        'away_score' => null,
                        'created_by' => Auth::user()->id,
                        'created_at' => now(),
                        'status' => isset($next_matches[$code_id]) ? 'pass' : null,
                        'order' => $order,
                    ];
                    array_push($matches, $match);
                }
                $order++;
            }
        }

        for ($k = 0; $k < $match_each_layer; $k++) {
            // if k is odd, swap home and away team
            // if ($k % 2 != 0) {
            if ($third_place) {
                //generate third place match
                // $match = array(
                //     'home_team_id' => null,
                //     'away_team_id' => null,
                //     'round_name' => 'Third Place',
                //     'level' => -101,
                //     'status' => null
                // );
                $match = [
                    'stage_id' => $stage_id,
                    'home_team_id' => null,
                    'away_team_id' => null,
                    'round_level' => -101,
                    'round_name' => 'Third Place',
                    'home_score' => null,
                    'away_score' => null,
                    'created_by' => Auth::user()->id,
                    'created_at' => now(),
                    'status' => isset($next_matches[$code_id]) ? 'pass' : null,
                    'order' => $order - 2,
                ];
                array_push($matches, $match);
            }
        }

        $data = [
            'next_round_matches' => $count_team_needed - $count_team,
            'total_needs' => $count_team_needed,
            'total_teams' => $count_team,
            'total_round' => $total_levels,
            'total_matches' => $total_matches,
            'matches' => $matches,
            'teams' => $teams,
        ];

        return $data;
    }

    public function generateKnockOutMatches($teams, $stage_id, $third_place, $auto = false)
    {
        // get 8 teams
        // $teams = Team::inRandomOrder()->take(9)->get();
        $matches = [];
        $match = [];
        $total_teams = count($teams);
        $total_round = ceil(log($total_teams, 2));
        $total_needs = pow(2, $total_round);
        $total_matches = $total_needs - 1;

        // $dataLog = [
        //     'total_teams' => $total_teams,
        //     'total_round' => $total_round,
        //     'total_needs' => $total_needs,
        //     'total_matches' => $total_matches,
        // ];
        // Log::info($dataLog);
        for ($i = 0; $i < $total_needs - $total_teams; $i++) {
            $teams->push(new Team(['name' => 'Bye', 'id' => null]));
        }
        //duplicate the teams array
        $teams2 = $teams->toArray();

        // calculate the number of matches will pass to the next round if the total teams is not a power of 2
        $next_round_matches = $total_needs - $total_teams;
        $round_of = $total_needs * 2;
        $order = 0;
        // generate matches for each round, with round having round*2 matches
        for ($i = $total_round - 1; $i >= 0; $i--) {
            $round = $i + 1;
            $round_matches = pow(2, $i);
            $round_of = $round_of / 2;
            switch ($round) {
                case 1:
                    $round_name = 'Final';
                    break;
                case 2:
                    $round_name = 'Semi Final';
                    break;
                case 3:
                    $round_name = 'Quarter Final';
                    break;
                default:
                    $round_name = 'Round of ' . $round_of;
                    break;
            }

            for ($j = 0; $j < $round_matches; $j++) {
                $status = null;
                // check next_round_matches to know if the match will pass to the next round set the away team is bye
                if ($auto) {
                    if ($next_round_matches > 0) {
                        $home_team = $teams->shift();
                        $away_team = $teams->pop();
                        $status = 'Passed';
                        $next_round_matches--;
                    } else {
                        $home_team = $teams->shift();
                        $away_team = $teams->pop();
                    }
                } else {
                    $home_team = null;
                    $away_team = null;
                }

                $match = [
                    'stage_id' => $stage_id,
                    'home_team_id' => $home_team ? $home_team->id : null,
                    'away_team_id' => $away_team ? $away_team->id : null,
                    'round_level' => $round . '-' . ($j + 1),
                    'round_name' => $round != 1 ? $round_name . ' - ' . ($j + 1) : $round_name,
                    'home_score' => null,
                    'away_score' => null,
                    'status' => $status,
                    'created_by' => Auth::user()->id,
                    'created_at' => now(),
                    'order' => $order,
                ];
                array_push($matches, $match);
                $order++;
            }
        }

        if ($third_place) {
            $match = [
                'stage_id' => $stage_id,
                'home_team_id' => null,
                'away_team_id' => null,
                'round_level' => '1-2',
                'round_name' => 'Third Place',
                'home_score' => null,
                'away_score' => null,
                'status' => null,
                'created_by' => Auth::user()->id,
                'created_at' => now(),
                'order' => $order - 2,
            ];
            array_push($matches, $match);
        }


        $data = [
            'next_round_matches' => $total_needs - $total_teams,
            'total_needs' => $total_needs,
            'total_teams' => $total_teams,
            'total_round' => $total_round,
            'total_matches' => $total_matches,
            'matches' => $matches,
            'teams' => $teams2
        ];
        // dd($data);
        return $data;
    }

    public function generateKnockOut(Request $request)
    {
        $request->validate([
            'stage_id' => 'required',
        ]);

        $stage = Stage::find($request->stage_id);

        $teams = $stage->teams;
        // $data = $this->generateKnockOutMatches($teams, $stage->id, $stage->third_place);

        // conver to array id
        $teams = $teams->map(function ($team) {
            return $team->id;
        });
        // Log::info($teams);
        $data = $this->generateKnockOutSchedule($stage->id, $teams->toArray(),  $stage->third_place);


        // create matches

        $matches = StageMatch::insert($data['matches']);
        // return matches created
        $matches = StageMatch::with('homeTeam', 'awayTeam', 'location')
            ->where('stage_id', $stage->id)->get();

        return DataTables::of($matches)->make(true);
    }


    public function generateMatches(Request $request)
    {
        $request->validate([
            'stage_id' => 'required',
        ]);

        $stage = Stage::find($request->stage_id);
        if ($stage->stageTeams->count() == 0) {
            return response()->json(['message' => __('Please add teams to this stage')], 400);
        }
        if ($stage->matches->count() > 0) {
            return response()->json(['message' => __('Matches already generated')], 400);
        }
        switch ($stage->type) {
            case config('constants.tournament_types.league'):
                return $this->generateLeaugeMatches($request);
                break;
            case config('constants.tournament_types.groups'):
                return $this->generateGroupsMatches($request);
                break;
            case config('constants.tournament_types.knockout'):
                return $this->generateKnockOut($request);
                break;
            default:
                return response()->json(['message' => 'Invalid stage type'], 400);
                break;
        }
    }

    // calculate next match in knockout stage
    public function calculateNextMatch(StageMatch $match)
    {
        
        // Log::info('calculateNextMatch', [$match]);
        $res_data = [
            'next_match' => null,
            'third_match' => null,
        ];
        
        $stage = $match->stage;
        if ($stage->type != config('constants.tournament_types.knockout')) {
            return $res_data;
        }
        $round = $match->round_level;
        $round_level = explode('-', $round);
        $round_floor = $round_level[0];
        $round_place = $round_level[1];
        $next_round_floor = $round_floor - 1;

        if ($round_place % 2 == 0) {
            $next_round_place = $round_place / 2;
        } else {
            $next_round_place = ($round_place + 1) / 2;
        }

        $next_round = $next_round_floor . '-' . $next_round_place;
        // Log::info('next_round', [$next_round]);

        //calculate team winner by score and penalty
        if ($match->home_score > $match->away_score) {
            $match->winner_team_id = $match->home_team_id;
            $match->loser_team_id = $match->away_team_id;
        } elseif ($match->home_score < $match->away_score) {
            $match->winner_team_id = $match->away_team_id;
            $match->loser_team_id = $match->home_team_id;
        } else {
            if ($match->home_penalty > $match->away_penalty) {
                $match->winner_team_id = $match->home_team_id;
                $match->loser_team_id = $match->away_team_id;
            } elseif ($match->home_penalty < $match->away_penalty) {
                $match->winner_team_id = $match->away_team_id;
                $match->loser_team_id = $match->home_team_id;
            } else {
                $match->winner_team_id = null;
                $match->loser_team_id = null;
            }
        }

        $cancel_types = config('constants.cancel_match_types');
        $next_match_for_win = StageMatch::where('stage_id', $stage->id)
            ->where('round_level', $next_round)
            ->where(function ($query) use ($cancel_types) {
                $query->whereNotIn('status', $cancel_types)
                    ->orWhereNull('status');
            })
            ->first();


        // third place
        if ($round_floor == 2 && $stage->third_place) {
            $next_round_floor_loser = 1;
            $next_round_place_loser = 2;
            $next_round_third_place = $next_round_floor_loser . '-' . $next_round_place_loser;
            $next_match_third_place = StageMatch::where('stage_id', $stage->id)
                ->where('round_level', $next_round_third_place)
                ->where(function ($query) use ($cancel_types) {
                    $query->whereNotIn('status', $cancel_types)
                        ->orWhereNull('status');
                })
                ->first();
            if ($next_match_third_place) {
                if ($round_place % 2 == 0) {
                    $next_match_third_place->home_team_id = $match->loser_team_id;
                } else {
                    $next_match_third_place->away_team_id = $match->loser_team_id;
                }
                $next_match_third_place->save();
                $res_data['third_match'] = $next_match_third_place;
            }
        }
        // if match is cancelled
        if (in_array($match->status, $cancel_types)) {
            $match->winner_team_id = null;
        }
        // Log::info('next_match_for_win', [$next_match_for_win]);
        if ($next_match_for_win) {
            if ($round_place % 2 == 0) {
                $next_match_for_win->home_team_id = $match->winner_team_id;
            } else {
                $next_match_for_win->away_team_id = $match->winner_team_id;
            }
            $next_match_for_win->save();
            $res_data['next_match'] = $next_match_for_win;
        }
        return $res_data;
    }

    public function calculateNextMatchKnockOut(StageMatch $match)
    {
        // Log::info('calculateNextMatch', [$match]);
        $res_data = [
            'winner_matches' => null,
            'loser_matches' => null,
        ];
        $stage = $match->stage;
        if ($stage->type != config('constants.tournament_types.knockout')) {
            return $res_data;
        }

        $level = $match->round_level;
        //level is int, 2 first number of level is round, 2 last number of level is layer
        $round = intval($level / 100);
        $layer = intval($level % 100);
        if ($layer % 2 == 0) {
            $next_layer = $layer / 2;
        } else {
            $next_layer = ($layer + 1) / 2;
        }
        $next_level = ($round - 1) * 100 + $next_layer;

        // get matches have round_level = next_level, stage_id = match->stage_id and status not in cancel_types or null
        $cancel_types = config('constants.cancel_match_types');
        $match_result = $this->getWinnerInLayerMatchKnockOut($level, $stage);
        $winner_id = $match_result['winner'];
        $loser_id = $match_result['loser'];

        Log::info('match_result', [$match_result]);

        $next_matches_for_win = StageMatch::where('stage_id', $stage->id)
            ->where('round_level', $next_level)
            ->where(function ($query) use ($cancel_types) {
                $query->whereNotIn('status', $cancel_types)
                    ->orWhereNull('status');
            })
            ->get();

        foreach ($next_matches_for_win as $index => $match) {
            if ($layer % 2 != 0) {
                if ($index % 2 != 0) {
                    $match->away_team_id = $winner_id;
                } else {
                    $match->home_team_id = $winner_id;
                }
            } else {
                if ($index % 2 != 0) {
                    $match->home_team_id = $winner_id;
                } else {
                    $match->away_team_id = $winner_id;
                }
            }
            $match->save();
        }

        $res_data['winner_matches'] = $next_matches_for_win;

        // next match for loser ($next_level*-1)
        $next_matches_for_lose = StageMatch::where('stage_id', $stage->id)
            ->where('round_level', $next_level * -1)
            ->where(function ($query) use ($cancel_types) {
                $query->whereNotIn('status', $cancel_types)
                    ->orWhereNull('status');
            })
            ->get();

        foreach ($next_matches_for_lose as $index => $match) {
            if ($layer % 2 != 0) {
                if ($index % 2 != 0) {
                    $match->away_team_id = $loser_id;
                } else {
                    $match->home_team_id = $loser_id;
                }
            } else {
                if ($index % 2 != 0) {
                    $match->home_team_id = $loser_id;
                } else {
                    $match->away_team_id = $loser_id;
                }
            }
            $match->save();
        }

        $res_data['loser_matches'] = $next_matches_for_lose;

        return $res_data;
    }

    function getWinnerInLayerMatchKnockOut($level, Stage $stage)
    {
        $cancel_types = config('constants.cancel_match_types');
        $matches_in_layer = StageMatch::where('stage_id', $stage->id)
            ->where('round_level', $level)
            ->where(function ($query) use ($cancel_types) {
                $query->whereNotIn('status', $cancel_types)
                    ->orWhereNull('status');
            })
            ->get();
        $matches_in_layer_count = $matches_in_layer->count();
        $winner_in_layer = null;
        $loser_in_layer = null;
        $count_team_win = [];
        // Log::info('matches_in_layer', [$matches_in_layer]);
        if ($matches_in_layer->count() > 0) {

            foreach ($matches_in_layer as $match) {
                $home_team_id = $match->home_team_id;
                $away_team_id = $match->away_team_id;
                $home_score = $match->home_score;
                $away_score = $match->away_score;
                $home_penalty = $match->home_penalty;
                $away_penalty = $match->away_penalty;
                $winner_in_match = null;
                //calculate team winner by score and penalty
                if ($match->home_score > $match->away_score || ($match->home_score == $match->away_score && $match->home_penalty > $match->away_penalty)) {
                    $winner_in_match = $home_team_id;
                } elseif ($match->home_score < $match->away_score || ($match->home_score == $match->away_score && $match->home_penalty < $match->away_penalty)) {
                    $winner_in_match = $away_team_id;
                }

                if ($winner_in_match) {
                    if (array_key_exists($winner_in_match, $count_team_win)) {
                        $count_team_win[$winner_in_match]++;
                    } else {
                        $count_team_win[$winner_in_match] = 1;
                    }

                    if ($count_team_win[$winner_in_match] >= $matches_in_layer_count / 2) {
                        $winner_in_layer = $winner_in_match;
                        $loser_in_layer = $winner_in_match == $home_team_id ? $away_team_id : $home_team_id;
                        break;
                    }
                }
            }
        }

        return [
            'winner' => $winner_in_layer,
            'loser' => $loser_in_layer
        ];
    }

    /**
     * Get Stage Table (team standings) for a stage by stage id
     * @param int $stage_id
     */
    public function getTableByStageId($stage_id)
    {
        // get stage by id
        $stage = Stage::find($stage_id);

        // get points for win, draw, lose and ranking criteria for the stage
        $points_win = $stage->points_win;
        $points_draw = $stage->points_draw;
        $points_loss = $stage->points_loss;

        // get all teams in stage with their team info and club info
        // join stage_teams table with teams table, then join teams table with clubs table
        $stage_teams = StageTeam::with(['team', 'team.club'])
            ->where('stage_id', $stage_id)
            ->get();
        $cancel_types = config('constants.cancel_match_types');
        // get all matches in stage
        $stage_matches = StageMatch::where('stage_id', $stage_id)
            ->where(function ($query) use ($cancel_types) {
                $query->whereNotIn('status', $cancel_types)
                    ->orWhereNull('status');
            })
            ->get()->toArray();

        // remove matches that have not been played (home_score and away_score are null)
        $stage_matches = array_filter($stage_matches, function ($match) {
            return ($match['home_score'] !== null);
        });

        // reset array keys
        $stage_matches = array_values($stage_matches);

        // create an array to hold the groups data
        $groups = [];

        // get all teams by group in stage
        $groups = $stage_teams->groupBy('group')->toArray();

        // loop through all groups
        foreach ($groups as $key => $group) {
            // get all teams in group
            $id_teams = array_map(function ($stage_team) {
                return $stage_team['team_id'];
            }, $group);

            // get all matches in group
            $group_matches = array_filter($stage_matches, function ($match) use ($id_teams) {
                return (in_array($match['home_team_id'], $id_teams) && in_array($match['away_team_id'], $id_teams));
            });

            // reset array keys
            $group_matches = array_values($group_matches);

            // get name of group (if stage is league, then group name is 'League')
            // (if group is null and stage is groups, then group name is 'Group A', 'Group B', etc.)
            $group_name = ($stage->type == 'League') ? 'League' : 'Group ' . $key;

            // add group data to groups array
            $groups[$key] = [
                'name' => $group_name,
                'teams' => $group,
                'matches' => $group_matches
            ];
        }

        // sort groups by name
        usort($groups, function ($a, $b) {
            return strcmp($a['name'], $b['name']);
        });

        // reset array keys
        $groups = array_values($groups);

        // loop through all groups
        foreach ($groups as $key => $group) {
            // get all teams in group
            $group_teams = $group['teams'];

            // get all matches in group
            $group_matches = $group['matches'];
            // loop through all teams in group
            foreach ($group_teams as $team_key => $team) {
                // get all matches the team has played
                $team_matches = array_filter($group_matches, function ($match) use ($team) {
                    return ($match['home_team_id'] == $team['team_id'] || $match['away_team_id'] == $team['team_id']);
                });
                // reset array keys
                $team_matches = array_values($team_matches);

                // get the number of matches the team has played
                $no_matches = count($team_matches);
                // get the number of wins the team has
                $no_wins = count(array_filter($team_matches, function ($match) use ($team) {
                    return ($match['home_team_id'] == $team['team_id'] && $match['home_score'] > $match['away_score']) || ($match['away_team_id'] == $team['team_id'] && $match['away_score'] > $match['home_score']);
                }));
                // get the number of draws the team has
                $no_draws = count(array_filter($team_matches, function ($match) use ($team) {
                    return ($match['home_team_id'] == $team['team_id'] && $match['home_score'] == $match['away_score']) || ($match['away_team_id'] == $team['team_id'] && $match['away_score'] == $match['home_score']);
                }));
                // get the number of losses the team has
                $no_losses = count(array_filter($team_matches, function ($match) use ($team) {
                    return ($match['home_team_id'] == $team['team_id'] && $match['home_score'] < $match['away_score']) || ($match['away_team_id'] == $team['team_id'] && $match['away_score'] < $match['home_score']);
                }));
                // get the number of goals scored by the team
                $goals_for = array_sum(array_map(function ($match) use ($team) {
                    return ($match['home_team_id'] == $team['team_id']) ? $match['home_score'] : $match['away_score'];
                }, $team_matches));

                // get the number of goals conceded by the team
                $goals_against = array_sum(array_map(function ($match) use ($team) {
                    return ($match['home_team_id'] == $team['team_id']) ? $match['away_score'] : $match['home_score'];
                }, $team_matches));

                // get the number of goals difference
                $goals_difference = $goals_for - $goals_against;

                // get the number of points the team has
                $points = ($no_wins * $points_win) + ($no_draws * $points_draw) + ($no_losses * $points_loss);

                // add team data to group teams array
                $group_teams[$team_key] = array_merge($team, [
                    'no_matches' => $no_matches,
                    'no_wins' => $no_wins,
                    'no_draws' => $no_draws,
                    'no_losses' => $no_losses,
                    'goals_for' => $goals_for,
                    'goals_against' => $goals_against,
                    'goals_difference' => $goals_difference,
                    'points' => $points
                ]);
            }

            // sort group teams by points then goal difference then goals for
            usort($group_teams, function ($a, $b) {
                if ($a['points'] == $b['points']) {
                    if ($a['goals_difference'] == $b['goals_difference']) {
                        if ($a['goals_for'] == $b['goals_for']) {
                            return 0;
                        }
                        return ($a['goals_for'] > $b['goals_for']) ? -1 : 1;
                    }
                    return ($a['goals_difference'] > $b['goals_difference']) ? -1 : 1;
                }
                return ($a['points'] > $b['points']) ? -1 : 1;
            });

            // add group teams to groups array
            $groups[$key]['teams'] = $group_teams;
        }

        // return the table array
        return $groups;
    }

    // check stage has matches
    public function hasMatches($stage_id)
    {
        $stage = Stage::find($stage_id);
        if ($stage->matches->count() > 0) {
            return response()->json(['hasMatches' => true]);
        } else {
            return response()->json(['hasMatches' => false]);
        }
    }
}
