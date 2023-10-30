<?php

namespace App\DataTables;

use App\Models\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class FilesDataTableEditor extends DataTablesEditor
{
    protected $model = User::class;
    /**
     * Upload directory relative to storage path.
     *
     * @var string
     */
    protected $uploadDir = 'uploads';
    /**
     * Get create action validation rules.
     */
    public function createRules(): array
    {
        return [];
    }

    /**
     * Get edit action validation rules.
     */
    public function editRules(Model $model): array
    {
        return [];
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

    public function uploadRules()
    {
        return [
            'logo' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,svg',
                'max:2048',
                'dimensions:ratio=1/1',
            ],

            'photo' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,svg',
                'max:2048',
            ],

            'document_photo' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,svg',
                'max:2048',
            ],
        ];
    }

    /**
     * @param  string  $field
     * @param  UploadedFile  $uploadedFile
     * @return string
     */
    protected function getUploadedFilename($field, UploadedFile $uploadedFile)
    {
        Log::info('field uploads: ' . $field);
        $folder_players = ['photo', 'document_photo'];
        if (in_array($field, $folder_players)) {
            $this->setUploadDir('players');
            return  time() . '_' . $field . '_' . Str::random(3) . '.' . $uploadedFile->getClientOriginalExtension();
        }

        if ($field == 'logo') {
            $this->setUploadDir('clubs');
            return  time() . '_' . $field . '_' . Str::random(3) . '.' . $uploadedFile->getClientOriginalExtension();
        }

        return  time() . $field . '_' . Str::random(3) . '.' . $uploadedFile->getClientOriginalExtension();
    }

    function setUploadDir($uploadDir)
    {
        $this->uploadDir = $uploadDir;
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
                'local_name'  => str_replace($this->uploadDir . '/', '', $id),
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
