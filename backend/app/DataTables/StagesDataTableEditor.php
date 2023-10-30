<?php

namespace App\DataTables;

use App\Models\Stage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\QueryException;

class StagesDataTableEditor extends DataTablesEditor
{
    protected $model = Stage::class;

    /**
     * Get create action validation rules.
     */
    public function createRules(): array
    {
        return [
            'type' => 'sometimes|max:50',
            'name' => 'required|max:191',
            'tournament_id' => 'required|exists:tournaments,id',
            'points_win' => 'sometimes|numeric',
            'points_draw' => 'sometimes|numeric',
            'points_loss' => 'sometimes|numeric',
            'no_encounters' => 'sometimes|numeric',
            'ranking_criteria' => 'sometimes|max:191',
        ];
    }

    /**
     * Get edit action validation rules.
     */
    public function editRules(Model $model): array
    {
        return [
            'type' => 'required|max:50',
            'name' => 'required|max:191',
            'tournament_id' => 'required|exists:tournaments,id',
            'points_win' => 'required|numeric',
            'points_draw' => 'required|numeric',
            'points_loss' => 'required|numeric',
            'no_encounters' => 'required|numeric',
            'ranking_criteria' => 'required|max:191',
        ];
    }

    /**
     * Get remove action validation rules.
     */
    public function removeRules(Model $model): array
    {
        return [];
    }

    public function creating(Model $model, array $data): array
    {
        // do something before creating the model

        return $data;
    }

    public function updating(Model $model, array $data)
    {
        // do something before updating the model
        return $data;
    }

    /**
     * Event hook that is fired after `creating` and `updating` hooks, but before
     * the model is saved to the database.
     */
    public function saving(Model $model, array $data): array
    {
        if (isset($data['is_released'])) {
            if ($data['is_released'] == 'true' || $data['is_released'] == '1' || $data['is_released'] == 1) {
                $data['is_released'] = true;
            } else {
                $data['is_released'] = false;
            }
        }
        if (isset($data['is_display_tbd'])) {
            if ($data['is_display_tbd'] == 'true' || $data['is_display_tbd'] == '1' || $data['is_display_tbd'] == 1) {
                $data['is_display_tbd'] = true;
            } else {
                $data['is_display_tbd'] = false;
            }
        }

        if (isset($data['third_place'])) {
            if ($data['third_place'] == 'true' || $data['third_place'] == '1' || $data['third_place'] == 1) {
                $data['third_place'] = true;
            } else {
                $data['third_place'] = false;
            }
        }

        return $data;
    }

    /**
     * Event hook that is fired after `created` and `updated` events.
     */
    public function saved(Model $model, array $data): Model
    {
        // do something after saving the model

        return $model;
    }

    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }
}
