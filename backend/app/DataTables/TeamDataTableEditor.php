<?php

namespace App\DataTables;

use App\Models\Team;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\QueryException;

class TeamDataTableEditor extends DataTablesEditor
{
    protected $model = Team::class;

    /**
     * Get create action validation rules.
     */
    public function createRules(): array
    {
        return [
            'name' => 'required|string|max:50',
            'group_id' => 'required|integer',
            'club_id' => 'required|integer',
        ];
    }

    /**
     * Get edit action validation rules.
     */
    public function editRules(Model $model): array
    {
        return [
            'name' => 'required|string|max:50',
            'group_id' => 'required|integer',
            'club_id' => 'sometimes|integer',
        ];
    }

    /**
     * Get remove action validation rules.
     */
    public function removeRules(Model $model): array
    {
        return [];
    }

    /**
     * Handle after data is saved
     */
    public function saved(Model $model, array $values)
    {
        $model->load(['group', 'club']);
        // convert club_id to int
        $model->club_id = (int)$model->club->id;
        return $model;
    }

    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }
}
