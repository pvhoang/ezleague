<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use Yajra\DataTables\Facades\DataTables;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::select('id as value', 'name as label', 'description')->get();

        return response()->json($permissions);
    }
}
