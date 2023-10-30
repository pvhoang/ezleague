<?php

namespace App\Http\Controllers;

use App\DataTables\TeamSheetsDataTableEditor;
use App\Models\Team;
use App\Models\TeamPlayer;
use App\Models\Teamsheet;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Yajra\DataTables\Facades\DataTables;
use MPDF;

class TeamsheetController extends Controller
{
    //get all teamsheets
    public function all()
    {
        $teamsheets = Teamsheet::with(['team.club','team.group.season'])
        ->whereHas('team.club.userClubs', function ($query) {
            // if user is admin, get all teams
            if (Auth::user()->isAdmin()) {
                return;
            }
            $query->where('user_id', Auth::user()->id);
        })
        ->orderBy('created_at', 'desc')->get();
        
        
        return DataTables::of($teamsheets)->make(true);
    }

    public function getTeamsheetBySeason($season_id)
    {
        $data = Teamsheet::with(['team.club', 'team.group.season']);
        $data->whereHas('team.group', function ($query) use ($season_id) {
            $query->where('season_id', $season_id);
        });

        if (!Auth::user()->isAdmin()) {
            $team_coach_query = clone $data;
            // get teams for Club Manager
            $club_manager_data = $data->whereHas('team.club.userClubs', function ($query) {
                $query->where('user_id', Auth::id());
            })->orderBy('created_at', 'desc')->get();

            // get teams for Team Coach
            $team_coach_data = $team_coach_query->whereHas('team.teamCoaches', function ($query) {
                $query->where('user_id', Auth::id());
            })->orderBy('created_at', 'desc')->get();

            $teamsheets = $club_manager_data->merge($team_coach_data);
        } else {
            $teamsheets = $data->orderBy('created_at', 'desc')->get();
        }

        return DataTables::of($teamsheets)->make(true);
    }


    public function editor(TeamSheetsDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    // get teamsheet by team id
    public function getTeamsheetByTeamId($team_id)
    {
        $teamsheet = Teamsheet::with(['team.club','team.group.season'])->where('team_id', $team_id)->orderBy('created_at', 'desc')->get();
        return DataTables::of($teamsheet)->make(true);
    }

    // submit teamsheet
    public function submitTeamsheet(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:teams,id',
        ]);

        // find team sheet by team id status LOCKED
        $teamsheet = Teamsheet::where('team_id', $request->team_id)->where('is_locked', 1)->first();
        if ($teamsheet) {
            return response()->json(['message' => 'Teamsheet is locked'], 400);
        }

        // get team players by team id
        $data_team = Team::with(['teamPlayers.player.user', 'group.season'])->where('id', $request->team_id)->first();

        $data = [
            'team' => $data_team,
            'team_players' => $data_team->teamPlayers->sortBy('player.user.first_name'),
            'club' => $data_team->club,
            'group' => $data_team->group,
            'season' => $data_team->group->season,
            'app_name' => config('app.name'),
        ];

        // create teamsheet pdf file and save to storage
        $pdf = Pdf::loadView('pdf.teamsheet', $data);
        $file_name = 'teamsheet_' . $request->team_id . '_' . time() . '.pdf';
        $path_pdf = "storage/teamsheets/" . $file_name;
        $pdf->save(public_path($path_pdf));
        $url_pdf = config('app.url') . '/' . $path_pdf;

        // save teamsheet to database
        $teamsheet = Teamsheet::create([
            'team_id' => $request->team_id,
            'document' => $url_pdf,
            'is_locked' => 0,
        ]);
        $response_data = [
            'teamsheet' => $teamsheet,
            'file_url' => $url_pdf,
            'file_path' => $path_pdf,
            'file_name' => $file_name,
        ];
        return  response()->json($response_data, 200);
    }

    // show teamsheet
    public function show($id)
    {
        $data_team = Team::with(['teamPlayers.player.user', 'group.season'])->where('id', $id)->first();
        $data = [
            'team' => $data_team,
            'team_players' => $data_team->teamPlayers->sortBy('player.user.first_name'),
            'club' => $data_team->club,
            'group' => $data_team->group,
            'season' => $data_team->group->season,
            'app_name' => config('app.name'),
        ];
        return response()->json($data, 200);
    }
}
