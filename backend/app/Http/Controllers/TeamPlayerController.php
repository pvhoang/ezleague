<?php

namespace App\Http\Controllers;

use App\DataTables\TeamPlayersDataTableEditor;
use App\Models\TeamPlayer;
use App\Models\Player;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class TeamPlayerController extends Controller
{
    //all
    public function all()
    {
        $data = TeamPlayer::with(['player.user', 'player.primaryGuardian.user'])
            ->get();
        return DataTables::of($data)->make(true);
    }

    // in team
    public function inTeam($team_id)
    {
        $data = TeamPlayer::with(['player.user', 'player.primaryGuardian.user'])
            ->where('team_id', $team_id)
            ->get();
        return DataTables::of($data)->make(true);
    }

    // editor
    public function editor(TeamPlayersDataTableEditor $editor)
    {
        return $editor->process(request());
    }

    // options players by team
    public function optionsPlayersByTeam($team_id)
    {
        $data = TeamPlayer::with(['player.user'])
            ->where('team_id', $team_id)
            ->get();

        // select id as value, concat(first_name, ' ', last_name) as label
        $data = $data->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->player->user->first_name . ' ' . $item->player->user->last_name,
            ];
        });
        return response()->json($data);
    }
}
