<?php

namespace App\DataTables;

use App\Models\Club;
use Illuminate\Validation\Rule;
use Yajra\DataTables\DataTablesEditor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Image\Image;
use Spatie\Image\Manipulations;
use Illuminate\Http\Request;

class DataTablesUploadEditor extends DataTablesEditor
{
    protected $model = Club::class;
    protected $uploadDir = '/storage/upload/';
    protected $imageWidth = 500;
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

    // creating a new club. if has logo, upload it
    protected function creating(Model $model, array $data)
    {
        Log::info('creating club', $data);
        if (isset($data['logo'])) {
           Log::info('has logo');
            //    rename the file
            $filename = $data['logo']->getClientOriginalName();
            $filename = time() . '_' . $filename;
            try {
                $data['logo']->move(public_path('clubs'), $filename);
                // get public path
                $public_path = config('app.url') . '/storage/clubs/' . $filename;
                // save the path to the database
                $model->logo = $public_path;
                $data['logo'] = $public_path;
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
        }
        return $data;
    }

    public function upload(Request $request)
    {
        try {
            $request->validate($this->uploadRules());

            $type = $request->input('uploadField');
            $dir  = $this->uploadDir . $type;

            $uploadedFile = $request->file('upload');
            $filename     = time() . '_' . $uploadedFile->getClientOriginalName();

            $uploadedFile->move(public_path($dir), $filename);

            $method = 'optimize' . Str::title($type);
            if (method_exists($this, $method)) {
                $id = $this->{$method}($dir, $filename);
            } else {
                $id = $this->optimize($dir, $filename);
            }

            return response()->json([
                'data'   => [],
                'upload' => [
                    'id' => $id,
                ],
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'data'        => [],
                'fieldErrors' => [
                    [
                        'name'   => $request->get('uploadField'),
                        'status' => $exception->getMessage(),
                    ],
                ],
            ]);
        }
    }

    public function uploadRules()
    {
        return [
            'upload' => 'required|image',
        ];
    }

    protected function optimize($dir, $filename)
    {
        // $path = public_path($dir . '/' . $filename);

        // Image::load($path)
        //      ->width($this->imageWidth)
        //      ->format(Manipulations::FORMAT_PNG)
        //      ->optimize()
        //      ->save();

        return config('app.url') . $dir . '/' . $filename;
    }
}
