<?php

namespace App\Http\Controllers;

use App\DataTables\LocationsDataTableEditor;
use App\Models\Location;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class LocationController extends Controller
{
    public function all(Request $request)
    {
        $clubs = Location::orderBy('name', 'asc')->get();
        return DataTables::of($clubs)->make(true);
    }

    public function editor(LocationsDataTableEditor $editor)
    {
        //use UserDataTableEditor to save data
        return $editor->process(request());
    }
}
