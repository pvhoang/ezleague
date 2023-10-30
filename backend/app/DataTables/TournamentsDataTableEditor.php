<?php

namespace App\DataTables;

use App\Http\Controllers\StageController;
use App\Models\Tournament;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\QueryException;

class TournamentsDataTableEditor extends DataTablesEditor
{
    protected $model = Tournament::class;

    /**
     * Get create action validation rules.
     */
    public function createRules(): array
    {
        return [
            'group_id' => 'required|exists:groups,id',
            'name' => 'required|max:100',
            'type' => 'required|max:50',
        ];
    }

    /**
     * Get edit action validation rules.
     */
    public function editRules(Model $model): array
    {
        return [
            'group_id' => 'required|exists:groups,id',
            'name' => 'required|max:100',
            'type' => 'sometimes|required|max:50',
        ];
    }

    /**
     * Get remove action validation rules.
     */
    public function removeRules(Model $model): array
    {
        return [
            'id' => [
                'required',
                // not has matches
                Rule::notIn($model->matches()->pluck('tournament_id')->toArray()),
            ],
        ];
    }

    protected function messages()
    {
        return [
            'id.not_in' => __('The tournament has matches and cannot be deleted'),
        ];
    }


    public function created(Model $model, array $data): Model
    {
        // do something before creating the model
        // get request data
        $request = request();
        $no_encounters = $request->get('data')[0]['no_encounters'] ?? 1;
        $ranking_criteria = $request->get('data')[0]['ranking_criteria'] ?? config('constants.ranking_criteria.total');

        $StageEditor = new StagesDataTableEditor();
        switch (strtolower($model->type)) {
            case strtolower(config('constants.tournament_types.league')):
                $request = $request->merge(
                    ['data' => [0 =>
                    [
                        'name' => config('constants.tournament_types.league'),
                        'tournament_id' => $model->id,
                        'type' => config('constants.tournament_types.league'),
                        'no_encounters' => $no_encounters,
                        'ranking_criteria' => $ranking_criteria
                    ]]]
                );
                $StageEditor->create($request);
                break;
            case strtolower(config('constants.tournament_types.groups_knockout')):
                $request = $request->merge(
                    ['data' => [0 =>
                    [
                        'name' => config('constants.tournament_types.groups'),
                        'tournament_id' => $model->id,
                        'type' => config('constants.tournament_types.groups'),
                        'no_encounters' => $no_encounters,
                        'ranking_criteria' => $ranking_criteria
                    ]]]
                );
                $StageEditor->create($request);
                $request = $request->merge(['data' => [0 =>
                [
                    'name' => config('constants.tournament_types.knockout'),
                    'tournament_id' => $model->id,
                    'type' => config('constants.tournament_types.knockout'),
                    'no_encounters' => $no_encounters,
                    'ranking_criteria' => $ranking_criteria
                ]]]);
                $StageEditor->create($request);
                break;
        }
        return $model;
    }

    /**
     * Event hook that is fired after `creating` and `updating` hooks, but before
     * the model is saved to the database.
     */
    public function saving(Model $model, array $data): array
    {
        return $data;
    }

    /**
     * Event hook that is fired after `created` and `updated` events.
     */
    public function saved(Model $model, array $data): Model
    {
        // do something after saving the model
        $model->load('stages');
        Log::info($model);
        return $model;
    }

    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }
}
