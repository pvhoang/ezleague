<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    //    get all roles
    public function index()
    {
        // get all role with id as value, name as lable, total user
        $roles = Role::with('permissions')->withCount(['users', 'permissions'])->get();
        return response()->json($roles, 200);
    }

    // create role
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|JSON',
        ]);
        $role = Role::create($request->all());
        // attach permission to role
        $permissions = json_decode($request->permissions);
        foreach ($permissions as $permission) {
            $role->permissions()->attach($permission->id);
        }
        $data = $role->with('permissions')->withCount(['users', 'permissions'])->get();
        return response()->json($data, 200);
    }

    // update role
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:roles,id',
            'name' => 'required|unique:roles,name,' . $request->id,
            'permissions' => 'required|JSON',
        ]);
        $role = Role::find($request->id);
        $role->update($request->all());
        // detach all permission of role
        $role->permissions()->detach();
        // attach permission to role
        $permissions = json_decode($request->permissions);
        foreach ($permissions as $permission) {
            $role->permissions()->attach($permission->id);
        }
        $data = $role->with('permissions')->withCount(['users', 'permissions'])->get();
        return response()->json($data, 200);
    }

    // delete role
    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:roles,id',
        ]);
        $role = Role::find($request->id);
        // count user of role
        $count = $role->users()->count();
        if ($count > 0) {
            return response()->json(['message' => __('This role has :count users. You can not delete this role', ['count' => $count])], 400);
        }
        $role->delete();
        return response()->json($role, 200);
    }
}
