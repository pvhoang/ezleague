<?php

namespace App\DataTables;

use App\Models\TeamPlayer;
use App\Rules\RemoveRule\RemoveTeamPlayerRule;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class TeamPlayersDataTableEditor extends DataTablesEditor
{
    protected $model = TeamPlayer::class;

    /**
     * Get create action validation rules.
     *
     * @return array
     */
    public function createRules()
    {
        return [
            'team_id' => ['required', Rule::unique('team_players')->where(function ($query) {
                $query->where('player_id', request()->get('data')[0]['player_id'])
                    ->where('team_id', request()->get('data')[0]['team_id']);
            }), 'exists:teams,id'],
            'player_id' => ['required', Rule::unique('team_players')->where(function ($query) {
                $query->where('player_id', request()->get('data')[0]['player_id'])
                    ->where('team_id', request()->get('data')[0]['team_id']);
            }), 'exists:players,id'],
        ];
    }

    /**
     * Get edit action validation rules.
     *
     * @param Model $model
     * @return array
     */
    public function editRules(Model $model)
    {
        $data = array_values(request()->get('data'))[0];
        return [
            'team_id' => ['sometimes', 'required', Rule::unique('team_players')->where(function ($query) use ($model, $data) {
                $query->where('player_id', $data['player_id'])
                    ->where('team_id', $data['team_id'])
                    ->where('id', '<>', $model->id);
            }), 'exists:teams,id'],
            'player_id' => ['sometimes', 'required', Rule::unique('team_players')->where(function ($query) use ($model, $data) {
                $query->where('player_id', $data['player_id'])
                    ->where('team_id', $data['team_id'])
                    ->where('id', '<>', $model->id);
            }), 'exists:players,id'],
        ];
    }

    /**
     * Get remove action validation rules.
     *
     * @param Model $model
     * @return array
     */
    public function removeRules(Model $model)
    {
        return [
            'player_id' => ['required', new RemoveTeamPlayerRule($model)],
        ];
    }
}
