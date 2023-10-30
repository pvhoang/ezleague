<?php

namespace App\DataTables;

use App\Models\Role;
use App\Models\User;
use App\Rules\EditUserPlayerRule;
use App\Rules\Rules\Name;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;

class UserDataTableEditor extends DataTablesEditor
{
    protected $model = User::class;

    /**
     * Get create action validation rules.
     *
     * @return array
     */
    public function createRules()
    {
        return [
            'email' => 'required|email|unique:' . $this->resolveModel()->getTable(),
            'first_name' => ['required', 'string', new Name()],
            'last_name' => ['required', 'string', new Name()],
            'role_id' => 'required',
            'phone' => 'sometimes|required',
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
            'email' => 'sometimes|required|email|' . Rule::unique($model->getTable())->ignore($model->getKey()),
            'first_name' => ['sometimes', 'required', 'string', new Name()],
            'last_name' => ['sometimes', 'required', 'string', new Name(), new EditUserPlayerRule(request())],
            'role_id' => 'sometimes|required',
            'phone' => 'sometimes|required',
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

    // saving a new user
    public function saving(Model $model, array $values)
    {
        if (isset($values['password']) && $values['password']) {
            Log::info('password changed');
            $model->password = Hash::make($values['password']);
            $values['password'] = $model->password;
        } else {
            unset($values['password']);
        }
        return $values;
    }

    // saved
    public function saved(Model $model, array $values)
    {
        $model->load(['role']);
        // role to int
        $model->role_id = (int)$model->role->id;
        $model->last_login = $model->last_login ?? null;
        return $model;
    }
    // return datatables with options
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

        $response = [
            'action' => $this->action,
            'data'   => $data,
            'options' => [
                'role' => Role::with('permissions')->withCount(['users', 'permissions'])->get(),
            ],
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
