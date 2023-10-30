<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Closure;
use Illuminate\Http\Request;

class ProjectMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Check header for project id
        $project_id = $request->hasHeader('X-project-id') ? $request->header('X-project-id') : null;
        // if project id is not set, return error
        if (!$project_id) {
            return response()->json(['message' => 'Project id not set'], 400);
        } else {
            // if project id is set, check if project exists
            $project = Project::find($project_id);
            if (!$project) {
                return response()->json(['message' => 'Project not found'], 404);
            } else {
                // if project exists, check if project is active
                // if ($project->status != 'active') {
                //     return response()->json(['message' => 'Project is not active'], 400);
                // } else {
                    // if project is active, add project id to request
                    $request->merge(['project_id' => $project_id]);
                    return $next($request);
                // }
            }
        }
    }
}
