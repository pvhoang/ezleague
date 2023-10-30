<?php

namespace App\DataTables;

use App\Models\TeamCoach;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;

class TeamCoachesDataTableEditor extends DataTablesEditor
{
    protected $model = TeamCoach::class;

    /**
     * Get create action validation rules.
     *
     * @return array
     */
    public function createRules()
    {
        return [
            'team_id' => ['required', Rule::unique('team_coaches')->where(function ($query) {
                $query->where('user_id', request()->get('data')[0]['user_id'])
                    ->where('team_id', request()->get('data')[0]['team_id']);
            }), 'exists:teams,id'],
            'user_id' => ['required', Rule::unique('team_coaches')->where(function ($query) {
                $query->where('user_id', request()->get('data')[0]['user_id'])
                    ->where('team_id', request()->get('data')[0]['team_id']);
            }), 'exists:users,id'],
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
            'team_id' => ['sometimes', 'required', Rule::unique('team_coaches')->where(function ($query) use ($model, $data) {
                $query->where('user_id', $data['user_id'])
                    ->where('team_id', $data['team_id'])
                    ->where('id', '<>', $model->id);
            }), 'exists:teams,id'],
            'user_id' => ['sometimes', 'required', Rule::unique('team_coaches')->where(function ($query) use ($model, $data) {
                $query->where('user_id', $data['user_id'])
                    ->where('team_id', $data['team_id'])
                    ->where('id', '<>', $model->id);
            }), 'exists:users,id'],
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
        return [];
    }

    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }
}
