<?php

namespace App\Http\Controllers;

use App\DataTables\FilesDataTableEditor;
use Illuminate\Http\Request;

class FileController extends Controller
{
    //
    public function editor(FilesDataTableEditor $editor)
    {
        //use UserDataTableEditor to save data
        return $editor->process(request());
    }
}
