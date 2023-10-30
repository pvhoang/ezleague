<?php

namespace App\DataTables;

use App\Models\File;
use App\Models\Releases;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Support\Str;


class ReleasesDataTableEditor extends DataTablesEditor
{
    protected $model = Releases::class;
    protected $uploadDir = 'releases';
    /**
     * Get create action validation rules.
     */
    public function createRules(): array
    {
        return [
            'name' => 'required|max:255',
            'version' => 'required|max:255',
            'type' => [
                'required',
                'max:255',
                Rule::unique('releases')->where(function ($query) {
                    Log::info('input:', [request()->input()]);
                    $query->where('version', request()->get('data')[0]['version'])
                        ->where('type', request()->get('data')[0]['type']);
                })
            ],
            'description' => 'nullable|max:255',
            'changelog' => 'nullable|max:255',
            'download_link' => 'nullable|url',
        ];
    }

    /**
     * Get edit action validation rules.
     */
    public function editRules(Model $model): array
    {
        return [
            'name' => 'sometimes|required|max:255',
            'version' => 'sometimes|required|max:255',
            'type' => 'sometimes|required|max:255',
            'description' => 'nullable|max:255',
            'changelog' => 'nullable|max:255',
            'download_link' => 'nullable|url',
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
     * Event hook that is fired after `creating` and `updating` hooks, but before
     * the model is saved to the database.
     */
    public function saving(Model $model, array $data): array
    {
        $data['changelog'] = isset($data['changelog']) ? $data['changelog'] : null;
        $data['description'] = isset($data['description']) ? $data['description'] : null;
        $data['download_link'] = isset($data['download_link']) ? $data['download_link'] : null;
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
        // get version in request
        $release_id = request()->input('release_id');
        $release = Releases::find($release_id);
        $version = $release->version;
        $type = $release->type;
        Log::info('version: ' . $version);
        return  $type . '_' . $version . '_build' . '.' . $uploadedFile->getClientOriginalExtension();
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
            $fieldRules = ['upload' => $rules[$field] ?? [], 'release_id' => 'required|exists:releases,id'];
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
                        'status' => isset($exception->errors()['upload']) ? str_replace('upload', $field, $exception->errors()['upload'][0]) : '',
                        'message' =>  $exception->getMessage(),
                    ],
                ],
            ]);
        }
    }
}
