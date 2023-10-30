<?php

namespace App\DataTables;

use App\Models\Club;
use App\Models\File;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ClubsDataTableEditor extends DataTablesEditor
{
    protected $model = Club::class;

    /**
     * Get create action validation rules.
     *
     * @return array
     */
    public function createRules()
    {
        return [
            'logo'  => 'required|string',
            'name'  => 'required|string|min:2|max:50|unique:' . $this->resolveModel()->getTable(),
            'code'  => 'required|string|min:2|max:10|unique:' . $this->resolveModel()->getTable(),
            'is_active' => 'sometimes|boolean',
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
            'logo'  => 'required|string',
            'name'  => 'required|string|min:2|max:50|unique:' . $model->getTable() . ',name,' . $model->getKey(),
            'code'  => 'required|string|min:2|max:10|unique:' . $model->getTable() . ',code,' . $model->getKey(),
            'is_active' => 'sometimes|boolean',
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

    public function creating(Model $model, array $data)
    {
        $data['is_active'] = $data['is_active'] ?? true;
        $model->fill($data);
        return $data;
    }

    // upload rules
    public function uploadRules()
    {
        return [
            'logo' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,svg',
                'max:2048',
                'dimensions:ratio=1/1',
            ]
        ];
    }

    /**
     * @param  string  $field
     * @param  UploadedFile  $uploadedFile
     * @return string
     */
    protected function getUploadedFilename($field, UploadedFile $uploadedFile)
    {
        return date('Ymd_His') . '_upload' . Str::random(5) . '.' . $uploadedFile->getClientOriginalExtension();
    }

    function save2DB($file)
    {
    }


    /**
     * Get remove query exception message.
     *
     * @param  QueryException  $exception
     * @param  Model  $model
     * @return string
     */
    protected function removeExceptionMessage(QueryException $exception, Model $model)
    {
        return __("This record is protected and cannot be deleted!");
    }

    /**
     * Handle uploading of file.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        $field   = $request->input('uploadField');
        $storage = $this->getDisk();

        try {
            $rules      = $this->uploadRules();
            $fieldRules = ['upload' => $rules[$field] ?? []];

            $this->validate($request, $fieldRules, $this->messages(), $this->attributes());

            $uploadedFile = $request->file('upload');
            $id           = $this->storeUploadedFile($field, $uploadedFile);

            $file         = File::create([
                'display_name' => $uploadedFile->getClientOriginalName(),
                'local_name'  => str_replace($this->uploadDir.'/', '', $id),
                'web_path'   => $storage->url($id),
                'local_path' => 'storage/' . $id,
                'extension' => $uploadedFile->getClientOriginalExtension(),
                'size'     => $uploadedFile->getSize(),
            ]);
            $file->save();


            if (method_exists($this, 'uploaded')) {
                $id = $this->uploaded($id);
            }

            return response()->json([
                'action' => $this->action,
                'data'   => [],
                'files'  => [
                    'files' => [
                        $id => [
                            'filename'      => $id,
                            'original_name' => $file->display_name,
                            'size'          => $file->size,
                            'directory'     => $this->getUploadDirectory(),
                            'disk'          => $this->disk,
                            'url'           => $file->web_path,
                        ],
                    ],
                ],
                'upload' => [
                    'id' => $id,
                ],
            ]);
        } catch (ValidationException $exception) {
            return response()->json([
                'action'      => $this->action,
                'data'        => [],
                'fieldErrors' => [
                    [
                        'name'   => $field,
                        'status' => str_replace('upload', $field, $exception->errors()['upload'][0]),
                    ],
                ],
            ]);
        }
    }
}
