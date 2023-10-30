<?php

namespace App\Http\Controllers;

use App\Models\MatchDetail;
use App\Models\StageMatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MatchDetailController extends Controller
{
    //get match detail
    public function getMatchDetail($match_id)
    {
        $match = StageMatch::find($match_id);
        if (!$match) {
            return response()->json(['message' => __('validation.exists', ['attribute' => 'validation.attributes.match_id'])], 422);
        }
        $match_detail = MatchDetail::where('match_id', $match_id)
            ->with(['player.user', 'team'])
            ->get();
        // group by home team and away team
        $match_detail = $match_detail->groupBy('team.id');

        $new_data = [
            'home_team' => [],
            'away_team' => [],
            'home_red_card' => 0,
            'home_yellow_card' => 0,
            'away_red_card' => 0,
            'away_yellow_card' => 0,
        ];

        foreach ($match_detail as $key => $value) {
            if ($key == $match->home_team_id) {
                $new_data['home_team'] = $value;

                foreach ($value as $item) {
                    switch ($item->type) {
                        case config('constants.match_detail_types.red_card'):
                            $new_data['home_red_card']++;
                            break;
                        case config('constants.match_detail_types.yellow_card'):
                            $new_data['home_yellow_card']++;
                            break;
                    }
                }
            } else {
                $new_data['away_team'] = $value;
                foreach ($value as $item) {
                    switch ($item->type) {
                        case config('constants.match_detail_types.red_card'):
                            $new_data['away_red_card']++;
                            break;
                        case config('constants.match_detail_types.yellow_card'):
                            $new_data['away_yellow_card']++;
                            break;
                    }
                }
            }
        }

        return response()->json($new_data);
    }

    // update match detail
    public function update(Request $request)
    {
        $request->validate([
            'match_id' => 'required|exists:stage_matches,id',
            'type' => 'required|string',
            'team_player_id' => 'required',
            'time' => 'required',
            'note' => 'sometimes|nullable|string',
        ]);

        $match_detail = MatchDetail::create([
            'match_id' => $request->match_id,
            'type' => $request->type,
            'team_player_id' => $request->team_player_id,
            'time' => $request->time,
            'note' => $request->note ?? null,
            'user_id' => Auth::user()->id,
        ]);
        $match = StageMatch::find($request->match_id);
        if ($match_detail->type == config('constants.match_detail_types.goal')) {

            if ($match->home_team_id == $match_detail->teamPlayer->team_id) {
                (int)$match->home_score += 1;
            } else {
                (int)$match->away_score += 1;
            }
            $match->home_score ?? 0;
            $match->away_score ?? 0;
            $match->save();
        }

        return response()->json(
            [
                'data' => $match,
                'match_detail' => $match_detail,
                'message' => __('validation.custom.match_detail.created'),
            ]
        );
    }

    // delete match detail
    public function destroy($match_detail_id)
    {
        $match_detail = MatchDetail::find($match_detail_id);
        if ($match_detail) {
            $match = StageMatch::find($match_detail->match_id);
            if ($match_detail->type == config('constants.match_detail_types.goal')) {
                if ($match->home_team_id == $match_detail->teamPlayer->team_id) {
                    (int)$match->home_score -= 1;
                } else {
                    (int)$match->away_score -= 1;
                }
                $match->home_score ?? 0;
                $match->away_score ?? 0;
                $match->save();
            }

            $match_detail->delete();

            return response()->json(
                [
                    'data' => $match,
                    'message' => __('validation.custom.match_detail.deleted'),
                ],
                200
            );
        }
    }
}
