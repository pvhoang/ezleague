<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use App\Http\Requests\StoreSettingsRequest;
use App\Http\Requests\UpdateSettingsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SettingsController extends Controller
{
    function getInitJson()
    {
        $settings = Settings::where('key', config('constants.settings_keys.init_json'))->first();
        $initJson = $settings->value;
        return response()->json($initJson);
    }

    function getSettings()
    {
        $settings = Settings::all();
        return response()->json($settings);
    }

    function updateSettings(Request $request)
    {
        // validate
        $request->validate([
            'key' => 'required',
            'value' => 'required',
        ]);

        $settings = Settings::where('key', $request['key'])->first();
        // value json to array
        $value = json_decode($request['value'], true);
        $settings->value = $value;
        $settings->save();

        return response()->json(Settings::all());
    }

    function getRequiredVersion()
    {
        $settings = Settings::where('key', config('constants.settings_keys.required_versions'))->first();
        if (!$settings) {
            return response()->json(['error' => 'Not found'], 404);
        }
        $requiredVersion = $settings->value;
        return response()->json($requiredVersion);
    }
}
