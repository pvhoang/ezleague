<?php

namespace App\DataTables;

use App\Models\Season;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class SeasonsDataTableEditor extends DataTablesEditor
{
    protected $model = Season::class;

    /**
     * Get create action validation rules.
     *
     * @return array
     */
    public function createRules()
    {
        // get cashier currency and upper case
        $currency = strtoupper(config('cashier.currency'));
        // get min amount payment
        $minAmountKey = 'constants.min_amount_payment.stripe.' . $currency;
        $minAmount = config($minAmountKey);
        return [
            // 'project_id' => 'required|string',
            'name' => 'required|string|min:2|max:50',
            'fee' => ['required', 'numeric', 'min:' . $minAmount, 'max:9999999999'],
            'start_date' => ['required', 'date', 'after_or_equal:1000-01-01', 'before_or_equal:9999-12-31'],
            'end_date' => ['required', 'date', 'after:start_date', 'before_or_equal:9999-12-31'],
            'start_register_date' => ['required', 'date', 'before_or_equal:start_date', 'after_or_equal:1000-01-01'],
            'status' => 'nullable|string',
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
            // 'project_id' => 'required|string',
            'name' => 'required|string|min:2|max:50',
            'fee' => 'required|numeric|min:0|max:9999999999',
            'start_date' => ['required', 'date', 'before_or_equal:end_date'],
            'end_date' => ['required', 'date', 'after:start_date', 'before_or_equal:9999-12-31'],
            'start_register_date' => ['required', 'date', 'before_or_equal:start_date', 'after_or_equal:1000-01-01'],
            'status' => 'nullable|string',
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

    // on create
    protected function creating(Model $model, array $data)
    {
        $data['type'] = 'Season';
        $model->fill($data);
        return $data;
    }

    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }
}
