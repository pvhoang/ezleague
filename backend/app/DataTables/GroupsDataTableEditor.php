<?php

namespace App\DataTables;

use App\Models\Group;
use App\Rules\RemoveRule\RemoveGroupRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;

class GroupsDataTableEditor extends DataTablesEditor
{
    protected $model = Group::class;

    /**
     * Get create action validation rules.
     *
     * @return array
     */
    public function createRules()
    {
        return [
            'season_id' => 'required|integer',
            'name' => 'required|string|max:20',
            'years' => [
                'required', 'string', 'max:9', 'regex:/^\d{4}(-\d{4})?$/',
                //    validation rule for start year must be less than end year
                function ($attribute, $value, $fail) {
                    $years = explode('-', $value);
                    Log::info($years);
                    if (count($years) > 1) {
                        if ($years[0] > $years[1]) {
                            return $fail(__("Start year must be less than end year"));
                        }
                    }
                }
            ],
            'type' => 'required|string'
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
        return [
            'season_id' => 'required|integer',
            'name' => 'required|string|max:20',
            'years' => [
                'required', 'string', 'max:9', 'regex:/^\d{4}(-\d{4})?$/',
                //    validation rule for start year must be less than end year
                function ($attribute, $value, $fail) use ($model) {
                    $years = explode('-', $value);
                    Log::info($years);
                    if (count($years) > 1) {
                        if ($years[0] > $years[1]) {
                            return $fail(__("Start year must be less than end year"));
                        }
                    }
                }
            ],
            'type' => 'required|string'
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
            'season_id' => [new RemoveGroupRule($model)]
        ];
    }
}
