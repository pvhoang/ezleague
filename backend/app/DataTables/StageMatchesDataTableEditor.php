<?php

namespace App\DataTables;

use App\Http\Controllers\StageController;
use App\Models\StageMatch;
use App\Models\User;
use App\Rules\EndTimeAfterStartTime;
use App\Rules\MatchTeamRule;
use App\Rules\Rules\KnockoutScore;
use App\Rules\NotEqualRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;

class StageMatchesDataTableEditor extends DataTablesEditor
{
    protected $model = StageMatch::class;

    /**
     * Get create action validation rules.
     */
    public function createRules(): array
    {
        $data = request()->get('data');
        // get first value of array
        $data = array_values($data)[0];
        return [
            'stage_id' => 'required|integer',
            'home_team_id' => ['required', 'integer', 'nullable', 'exists:teams,id'],
            'away_team_id' => ['required', 'integer', 'nullable', 'exists:teams,id', new NotEqualRule($data, 'home_team_id')],
            'date' => ['sometimes', 'nullable', 'after_or_equal:1970-01-01', 'before_or_equal:2038-01-19'],
            'start_time' => ['sometimes', 'nullable'],
            'end_time' => ['sometimes', 'nullable', new EndTimeAfterStartTime($data['start_time'] ?? null)],
            'start_time_short' => ['sometimes', 'nullable'],
            'end_time_short' => ['sometimes', 'nullable', new EndTimeAfterStartTime($data['start_time_short'] ?? null)],
            'location_id' => 'sometimes|integer|nullable|exists:locations,id',
            'round_name' => 'sometimes|string',
            'round_level' => 'sometimes|string',
            'home_score' => [
                'sometimes',
                'integer',
                'nullable'
                // new KnockoutScore($model,'away_score'),
            ],
            'away_score' => [
                'sometimes',
                'integer',
                'nullable'
                // new KnockoutScore($model,'home_score'),
            ],
            'home_penalty' => 'sometimes|integer|nullable',
            'away_penalty' => 'sometimes|integer|nullable',
            'status' => 'sometimes|string',
            'description' => 'sometimes|string|nullable',
        ];
    }

    /**
     * Get edit action validation rules.
     */
    public function editRules(Model $model): array
    {
        $data = request()->get('data');
        // get first value of array
        $data = array_values($data)[0];

        return [
            'stage_id' => 'sometimes|required|integer',
            'home_team_id' => ['sometimes', 'required', 'integer', 'nullable', 'exists:teams,id', new MatchTeamRule($model, $data)],
            'away_team_id' => ['sometimes', 'required', 'integer', 'nullable', 'exists:teams,id', new NotEqualRule($data, 'home_team_id'), new MatchTeamRule($model, $data)],
            'date' => ['sometimes', 'nullable', 'after_or_equal:1970-01-01', 'before_or_equal:2038-01-19'],
            'start_time' => ['sometimes', 'nullable'],
            'end_time' => ['sometimes', 'nullable', new EndTimeAfterStartTime(isset($data['start_time']) ? $data['start_time'] : null)],
            'start_time_short' => ['sometimes', 'nullable'],
            'end_time_short' => ['sometimes', 'nullable', new EndTimeAfterStartTime($data['start_time_short'] ?? null)],
            'location_id' => 'sometimes|integer|nullable|exists:locations,id',
            'round_name' => 'sometimes|string',
            'round_level' => 'sometimes|string',
            'home_score' => [
                'sometimes',
                'integer',
                'nullable'
                // new KnockoutScore($model,'away_score'),
            ],
            'away_score' => [
                'sometimes',
                'integer',
                'nullable'
                // new KnockoutScore($model,'home_score'),
            ],
            'home_penalty' => 'sometimes|integer|nullable',
            'away_penalty' => 'sometimes|integer|nullable',
            'status' => 'sometimes|string',
            'description' => 'sometimes|string|nullable'
        ];
    }

    // updating
    public function updating(Model $model, array $data): array
    {
        return $data;
    }

    /**
     * Get remove action validation rules.
     */
    public function removeRules(Model $model): array
    {
        return [];
    }

    /**
     * Event hook that is fired after `creating` and `updating` hooks, but before
     * the model is saved to the database.
     */
    public function saving(Model $model, array $data): array
    {
        if (isset($data['start_time_short'])) {
            $data['start_time'] = is_null($data['start_time_short']) ? null : date('Y-m-d H:i:s', strtotime($data['date'] . ' ' . $data['start_time_short']));
        }
        if (isset($data['end_time_short'])) {
            $data['end_time'] = is_null($data['end_time_short']) ? null : date('Y-m-d H:i:s', strtotime($data['date'] . ' ' . $data['end_time_short']));
        }
        return $data;
    }

    /**
     * Event hook that is fired after `created` and `updated` events.
     */
    public function saved(Model $model, array $data): Model
    { //    get team in match

        $home_team = $model->homeTeam;
        $away_team = $model->awayTeam;
        if ($home_team != null) {
            //get club manager of team
            $home_club_manager = $home_team->club->users;
            // get user favoutite team
            $home_team_favourite = $home_team->usersFavoriteTeams;
            // get user favoutite club
            $home_club_favourite = $home_team->club->usersFavoriteClubs;
            // merge and unique user
            $home_users = $home_club_manager->merge($home_team_favourite)->merge($home_club_favourite)->unique('id');
        }
        if ($away_team != null) {
            $away_club_manager = $away_team->club->users;
            $away_team_favourite = $away_team->usersFavoriteTeams;
            $away_club_favourite = $away_team->club->usersFavoriteClubs;
            $away_users = $away_club_manager->merge($away_team_favourite)->merge($away_club_favourite)->unique('id');
        }

        if (isset($data['status']) && in_array($model->status, config('constants.cancel_match_types'))) {
            if (isset($home_users)) {
                foreach ($home_users as $user) {
                    // Log::info('home: ', [$user->firebase_token]);
                    if ($user->firebase_token) {
                        $user->sendNotiCancelMatch($model);
                    }
                }
            }

            if (isset($away_team)) {
                foreach ($away_users as $user) {
                    // Log::info('away: ', [$user->firebase_token]);
                    if ($user->firebase_token) {
                        $user->sendNotiCancelMatch($model);
                    }
                }
            }
        }

        // if update score
        if (isset($data['home_score']) || isset($data['away_score']) || isset($data['home_penalty']) || isset($data['away_penalty'])) {
            // if match is finished
            $is_penalty = false;
            if (!in_array($model->status, config('constants.cancel_match_types')) || $model->status == 'null' || $model->status == null) {
                if (isset($data['home_penalty']) || isset($data['away_penalty'])) {
                    $is_penalty = true;
                }

                if (isset($home_users)) {
                    foreach ($home_users as $user) {
                        // Log::info($user->firebase_token);
                        if ($user->firebase_token) {
                            $user->sendNotiUpdateScore($model, $is_penalty);
                        }
                    }
                }

                if (isset($away_team)) {
                    foreach ($away_users as $user) {
                        // Log::info($user->firebase_token);
                        if ($user->firebase_token) {
                            $user->sendNotiUpdateScore($model, $is_penalty);
                        }
                    }
                }
            }
        }
        return $model;
    }

    protected function toJson($data, array $errors = [], $error = '')
    {
        // fo
        $code = 200;
        $stageCtrl = new StageController();
        // for each data
        $count = count($data);
        for ($key = 0; $key < $count; $key++) {
            $first_data = $data[$key]->with(['homeTeam', 'awayTeam', 'location'])->where('id', $data[$key]->id)->first();

            if ((isset($first_data['home_score']) && isset($first_data['away_score'])) || (isset($first_data['home_penalty']) && isset($first_data['away_penalty']))) {
                $match_result = $stageCtrl->calculateNextMatchKnockOut($first_data);
                $winner_matches = isset($match_result['winner_matches']) ? $match_result['winner_matches'] : null;
                $loser_matches = isset($match_result['loser_matches']) ? $match_result['loser_matches'] : null;
                // add winner match to the last of the data
                if ($winner_matches) {
                    foreach ($winner_matches as $winner_match) {
                        $data[] = $winner_match;
                        $count++;
                    }
                }
                // add loser match to the last of the data
                if ($loser_matches) {
                    foreach ($loser_matches as $loser_match) {
                        $data[] = $loser_match;
                        $count++;
                    }
                }
            }
            $first_data = $first_data ? $first_data :  $data[$key];
            // Log::info($first_data);
            // add date column
            if (is_null($first_data->start_time)) {
                $first_data->date = 'TBD';
            } else {
                $first_data->date = date('Y-m-d', strtotime($first_data->start_time));
            }
            if (is_null($first_data->start_time)) {
                $first_data->start_time_short = 'TBD';
            } else {
                $first_data->start_time_short = date('H:i', strtotime($first_data->start_time));
            }
            // edit end_time column
            if (is_null($first_data->end_time)) {
                $first_data->end_time_short = 'TBD';
            } else {
                $first_data->end_time_short = date('H:i', strtotime($first_data->end_time));
            }
            // edit location name column
            if (is_null($first_data->location)) {
                $first_data->location_name = 'TBD';
            } else {
                $first_data->location_name = $first_data->location->name;
            }
            // // edit home_team name column
            if (is_null($first_data->homeTeam)) {
                $first_data->home_team_name = 'TBD';
            } else {
                $first_data->home_team_name = $first_data->homeTeam->name;
            }
            // edit away_team name column
            if (is_null($first_data->awayTeam)) {
                $first_data->away_team_name = 'TBD';
            } else {
                $first_data->away_team_name = $first_data->awayTeam->name;
            }
            // edit home_score column
            $first_data->home_score = is_null($first_data->home_score) ? '' : $first_data->home_score;
            // edit away_score column
            $first_data->away_score = is_null($first_data->away_score) ? '' : $first_data->away_score;
            // add group_round column
            $first_data->group_round = trim(explode('-', $first_data->round_name)[0]);

            $data[$key] = $first_data;
            // Log::info('data', [$data]);
        }


        $response = [
            'action' => $this->action,
            'data'   => $data,
        ];


        if ($error) {
            $code              = 422;
            $response['error'] = $error;
        }

        if ($errors) {

            $code                    = 422;
            $response['fieldErrors'] = $errors;
        }
        return new JsonResponse($response, $code);
    }

    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }
}
