<?php

namespace App\DataTables;

use App\Models\Registration;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\QueryException;

class RegistrationsDataTableEditor extends DataTablesEditor
{
    protected $model = Registration::class;

    /**
     * Get create action validation rules.
     *
     * @return array
     */
    public function createRules()
    {
        return [];
    }

    /**
     * Get edit action validation rules.
     *
     * @param Model $model
     * @return array
     */
    public function editRules(Model $model)
    {
        return [];
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

    public function saved(Model $model, array $data)
    {
        Log::info('saved');
        return $model;
    }

    /**
     * Display success data in dataTables editor format.
     *
     * @param  array  $data
     * @param  array  $errors
     * @param  string  $error
     * @return JsonResponse
     */
    protected function toJson(array $data, array $errors = [], $error = '')
    {
        $code = 200;
        // foreach $data as $row
        foreach ($data as $key => $row) {
            $row = DB::table('registrations')
                ->join('players', 'players.id', '=', 'registrations.player_id')
                ->join('users', 'users.id', '=', 'players.user_id')
                ->join('clubs', 'clubs.id', '=', 'registrations.club_id')
                ->leftJoin('guardians', function ($join) {
                    $join->on('guardians.player_id', '=', 'players.id')
                        ->where('guardians.is_primary', '=', 1);
                })
                ->leftJoin('users as guardian_users', 'guardian_users.id', '=', 'guardians.user_id')
                ->leftJoin('payment_details', function ($join) {
                    $join->on('payment_details.product_id', '=', 'registrations.id')
                        ->where('payment_details.in_table', 'LIKE', 'registrations');
                })
                ->select('players.*', 'registrations.*',  'users.first_name', 'users.last_name', 'users.email', 'clubs.name as club_name', 'guardian_users.first_name as guardian_first_name', 'guardian_users.last_name as guardian_last_name', 'guardian_users.email as guardian_email')
                ->selectRaw('DATE_FORMAT(registrations.created_at, "%Y-%m-%dT%TZ") as created_at')
                ->selectRaw('DATE_FORMAT(registrations.updated_at, "%Y-%m-%dT%TZ") as updated_at')
                ->selectRaw('DATE_FORMAT(registrations.registered_date, "%Y-%m-%dT%TZ") as registered_date')
                ->selectRaw('DATE_FORMAT(registrations.approved_date, "%Y-%m-%dT%TZ") as approved_date')
                ->where('registrations.id', $row['id'])
                ->first();

            $row->custom_fields = json_decode($row->custom_fields);
            $data[$key] = $row;
        }

        $response = [
            'action' => $this->action,
            'data'   => $data,
        ];

        if ($error) {
            $code              = 422;
            $response['error'] = $error;
        }

        if ($errors) {
            $code                    = 422;
            $response['fieldErrors'] = $errors;
        }

        return new JsonResponse($response, $code);
    }

    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }
}
