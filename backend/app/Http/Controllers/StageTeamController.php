<?php

namespace App\Http\Controllers;

use App\DataTables\StageTeamsDataTableEditor;
use App\Models\Stage;
use App\Models\StageTeam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Yajra\DataTables\Facades\DataTables;

class StageTeamController extends Controller
{
    //get all stage teams for a stage
    public function allInStage($stageId)
    {
        $stageTeams = StageTeam::with('team.club')->where('stage_id', $stageId)
            ->orderBy('group', 'asc')
            ->get();
        // group by group
        $stageTeams = $stageTeams->groupBy('group');
        return DataTables::of($stageTeams)->make(true);
    }

    // editor for stage teams
    public function editor(StageTeamsDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    // get teams not in stage
    public function teamsNotInStage(Request $request)
    {
        $stage_id = $request->stage_id;
        $group_id = $request->group_id;
        $teams = StageTeam::where('stage_id', $stage_id)->pluck('team_id');
        $teams = \App\Models\Team::whereNotIn('id', $teams)
            ->where('group_id', $group_id)
            ->get();
        return DataTables::of($teams)->make(true);
    }
    public function teamsInStage(Request $request)
    {
        $request->validate([
            'stage_id' => 'required',
        ]);
        $stage = Stage::where('id', $request->stage_id)->first();
        $teams = $stage->teams;

        return DataTables::of($teams)->make(true);
    }

    // create multiple stage teams
    public function create(Request $request)
    {
        $request->validate([
            'stage_id' => 'required',
            'group' => 'sometimes|max:20',
            'teams' => 'required',
        ]);
        $stage_id = $request->stage_id;
        $group = $request->group;
        $teams = $request->teams;
        // string to array
        $teams = explode(',', $teams);
        $stageTeams = [];
        Log::info($teams);
        foreach ($teams as $team) {
            $stageTeams[] = [
                'stage_id' => $stage_id,
                'group' => $group,
                'team_id' => $team,
            ];
        }
        StageTeam::insert($stageTeams);
        return response()->json(['message' => __('Add teams to stage successfully!')], 200);
    }

    // delete multiple stage teams
    public function destroy(Request $request)
    {
        $request->validate([
            'stage_id' => 'required',
            'group' => 'sometimes',
            'teams' => 'required',
        ]);
        $stage_id = $request->stage_id;
        $group = $request->group;
        $teams = $request->teams;
        $teams = explode(',', $teams);
        StageTeam::where('stage_id', $stage_id)
            ->where('group', $group)
            ->whereIn('team_id', $teams)
            ->delete();
        return response()->json(['message' => __('Delete teams from stage successfully!')], 200);
    }

    /**
     * Update group name for teams in stage
     */
    public function update(Request $request)
    {
        // loop through teams and update group
        $request->validate([
            'stage_id' => 'required',
            'old_group' => 'required|max:20',
            'group' => 'required|max:20',
            'teams' => 'sometimes|required',
            'all_teams_in_groups' => 'sometimes',
        ]);

        $all_teams_in_groups = $request->all_teams_in_groups ? true : false;
        $old_group = $request->old_group ? $request->old_group : null;
        $stage_id = $request->stage_id;

        $teams = $request->teams;
        $group = $request->group;
        if ($all_teams_in_groups && $old_group) {
            // update all teams in stage
            StageTeam::where('stage_id', $stage_id)->where('group', $old_group)
                ->update(['group' => $group]);

            return response()->json(['message' => __('Update teams group successfully!')], 200);
        }
        // convert json string to array
        $teams = json_decode($teams, true);
        Log::info($teams);

        foreach ($teams as $team) {
            // update group for each team by stage_team_id
            StageTeam::where('id', $team['id'])
                ->update(['group' => $group]);
        }

        return response()->json(['message' => __('Update teams group successfully!')], 200);
    }
}
