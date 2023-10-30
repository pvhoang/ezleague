<?php

namespace App\DataTables;

use App\Models\Location;
use App\Rules\LatitudeRule;
use App\Rules\LongitudeRule;
use App\Rules\RemoveRule\RemoveLocationRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;

class LocationsDataTableEditor extends DataTablesEditor
{
    protected $model = Location::class;

    /**
     * Get create action validation rules.
     */
    public function createRules(): array
    {
        return [
            'name' => 'required|max:100|unique:' . $this->resolveModel()->getTable(),
            'address' => 'required|max:191',
            'latitude' => ['numeric', new LatitudeRule],
            'longitude' => ['numeric', new LongitudeRule],
            'surface' => 'max:100',
            'parking' => 'max:100',
        ];
    }

    /**
     * Get edit action validation rules.
     */
    public function editRules(Model $model): array
    {
        return [
            'name' => 'required|max:100|' . Rule::unique($model->getTable())->ignore($model->getKey()),
            'address' => 'required|max:191',
            'latitude' => ['numeric', new LatitudeRule],
            'longitude' => ['numeric', new LongitudeRule],
            'surface' => 'max:100',
            'parking' => 'max:100',
        ];
    }

    /**
     * Get remove action validation rules.
     */
    public function removeRules(Model $model): array
    {
        return [
            'address' => [new RemoveLocationRule($model)],
        ];
    }

    /**
     * Event hook that is fired after `creating` and `updating` hooks, but before
     * the model is saved to the database.
     */
    public function saving(Model $model, array $data): array
    {
        // set default values
        if (!isset($data['latitude'])) {
            $data['latitude'] = null;
        }
        if (!isset($data['longitude'])) {
            $data['longitude'] = null;
        }
        if (!isset($data['surface'])) {
            $data['surface'] = null;
        }
        if (!isset($data['parking'])) {
            $data['parking'] = null;
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
}
