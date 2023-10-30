<?php

namespace App\DataTables;

use App\Models\Teamsheet;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\QueryException;

class TeamSheetsDataTableEditor extends DataTablesEditor
{
    protected $model = Teamsheet::class;

    /**
     * Get create action validation rules.
     */
    public function createRules(): array
    {
        return [
            'team_id' => 'required|exists:teams,id',
        ];
    }

    /**
     * Get edit action validation rules.
     */
    public function editRules(Model $model): array
    {
        return [
            'team_id' => 'required|exists:teams,id',
            'is_locked' => 'required',
        ];
    }

    public function updating(Model $model, array $data): array
    {
        Log::info($data);
        return $data;
    }
    /**
     * Get remove action validation rules.
     */
    public function removeRules(Model $model): array
    {
        return [];
    }

    public function saved(Model $model)
    {
        return $model->load(['team.club', 'team.group.season']);
    }

    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }
}
