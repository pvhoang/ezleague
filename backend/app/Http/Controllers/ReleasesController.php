<?php

namespace App\Http\Controllers;

use App\DataTables\ReleasesDataTableEditor;
use App\Models\Releases;
use App\Http\Requests\StoreReleasesRequest;
use App\Http\Requests\UpdateReleasesRequest;
use Yajra\DataTables\Facades\DataTables;

class ReleasesController extends Controller
{
    function all()
    {
        $releases = Releases::all();
        return DataTables::of($releases)->make(true);
    }

    function editor(ReleasesDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    // get release by status
    function get()
    {
        $status = request()->input('status') ?? 'available';
        $releases = Releases::where('status', $status)->get();
        return response()->json($releases);
    }

    function getByTowardsVersion($towards_version)
    {
        $status = request()->input('status') ?? 'available';
        $releases = Releases::where('towards_version', $towards_version)
            ->orWhere('towards_version', '0')
            ->where('download_link', '!=', null)
            ->where('status', $status)
            ->orderBy('id', 'desc')
            ->get();
        return response()->json($releases);
    }
}
