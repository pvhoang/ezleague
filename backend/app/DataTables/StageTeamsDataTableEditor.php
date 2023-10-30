<?php

namespace App\DataTables;

use App\Models\StageTeam;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\QueryException;

class StageTeamsDataTableEditor extends DataTablesEditor
{
    protected $model = StageTeam::class;

    /**
     * Get create action validation rules.
     */
    public function createRules(): array
    {
        return [
            'stage_id' => 'required|integer',
            'team_id' => 'required|integer',
            'group' => 'required|max:20',
        ];
    }

    /**
     * Get edit action validation rules.
     */
    public function editRules(Model $model): array
    {
        return [
            'stage_id' => 'required|integer',
            'team_id' => 'required|integer',
            'group' => 'sometimes|required|max:20',
        ];
    }

    public function updating(Model $model, array $data): array
    {
        if (isset($data['team_id']) && $data['stage_id']) {
            // find matches in this stage with this team
            $matches = $model->stage->matches()->where('home_team_id', $model->team_id)->orWhere('away_team_id', $model->team_id)->get();
            if ($matches->count() > 0) {
                // replace team in matches
                foreach ($matches as $match) {
                    if ($match->home_team_id == $model->team_id) {
                        $match->home_team_id = $data['team_id'];
                    }
                    if ($match->away_team_id == $model->team_id) {
                        $match->away_team_id = $data['team_id'];
                    }
                    $match->save();
                }
            }
        }
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
        // Before saving the model, hash the password.

        return $data;
    }

    /**
     * Event hook that is fired after `created` and `updated` events.
     */
    public function saved(Model $model, array $data): Model
    {
        // do something after saving the model

        return $model->load('team.club');
    }

    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }
}
