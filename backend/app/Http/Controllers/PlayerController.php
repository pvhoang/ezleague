<?php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Http\Controllers\Controller;
use App\Models\Guardian;
use App\Models\Registration;
use App\Models\Role;
use App\Models\Season;
use App\Models\Settings;
use App\Models\User;
use App\Rules\Rules\Name;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Intervention\Image\Facades\Image;

class PlayerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public static function converCustomFieldsValidator(Request $request, $validator_default, $isUpdate = false)
    {
        $settings = Settings::where('key', 'init_json')->first();
        $custom_fields = $settings->value['custom_fields'];
        //    pluck key from custom_fields
        $custom_fields_keys = array_column($custom_fields, 'key');
        $validator_custom = [];
        $custom_fields_values = [];
        // add custom fields to validator
        foreach ($custom_fields as $custom_field) {
            $key = $custom_field['key'];
            if ($isUpdate && isset($custom_field['props']['required']) && $custom_field['props']['required']) {
                $validator_custom[$key][] = 'sometimes';
            }
            if (isset($custom_field['props']['required']) && $custom_field['props']['required']) {
                $validator_custom[$key] = ['required'];
            } else {
                $validator_custom[$key] = ['nullable'];
            }


            if (isset($custom_field['props']['type'])) {
                switch ($custom_field['props']['type']) {
                    case 'number':
                        $validator_custom[$key][] = 'numeric';
                        break;
                    case 'date':
                        $validator_custom[$key][] = 'date';
                        break;
                    case 'email':
                        $validator_custom[$key][] = 'email';
                        break;
                }
            }

            switch ($custom_field['type']) {
                case 'radio':
                case 'select':
                case 'checkbox':
                    // get value from options
                    $options = array_column($custom_field['props']['options'], 'value');
                    $validator_custom[$key][] = Rule::in($options);
                    break;
                case 'input':
                case 'file':
                    if (!isset($custom_field['props']['type']) || $custom_field['props']['type'] == 'text') {
                        $validator_custom[$key][] = 'string';
                    }
                    break;
            }

            if (isset($custom_field['props']['min'])) {
                $validator_custom[$key][] = 'min:' . $custom_field['props']['min'];
            }
            if (isset($custom_field['props']['max'])) {
                $validator_custom[$key][] = 'max:' . $custom_field['props']['max'];
            }
            if (isset($custom_field['props']['minLength'])) {
                $validator_custom[$key][] = 'min:' . $custom_field['props']['minLength'];
            }
            if (isset($custom_field['props']['maxLength'])) {
                $validator_custom[$key][] = 'max:' . $custom_field['props']['maxLength'];
            }

            // if $validator_default does not have key, add to $custom_fields_values
            if (!isset($validator_default[$key]) && isset($request[$key])) {
                if (($isUpdate && $request[$key]) || !$isUpdate) {
                    $custom_fields_values[$key] = $request[$key];
                }
            }
        }
        $validator = array_merge($validator_custom, $validator_default);
        // Log::info('validator register player: ', $validator);
        // Log::info('custom_fields_values register player: ', $custom_fields_values);
        return [
            'custom_fields_values' => $custom_fields_values,
            'custom_fields_keys' => $custom_fields_keys,
            'validator_custom' => $validator_custom,
            'validator' => $validator
        ];
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createByParent(Request $request)
    {
        //

        $validator_default = [
            // validation for player
            'first_name' => ['required', 'string', new Name()],
            'last_name' => ['required', 'string', new Name()],
            'dob' => ['required'],
            'gender' => ['required', 'string'],
            'photo' => ['required', 'string'],
            'document_type' => ['required', 'string'],
            'document_photo' => ['required', 'string'],
            'document_expiry_date' => ['nullable', 'date'],
            // validation for registration
            'season_id' => ['required', 'exists:seasons,id'],
            'club_id' => ['required', 'exists:clubs,id'],
        ];
        $customFields = $this->converCustomFieldsValidator($request, $validator_default);
        $custom_fields_values = $customFields['custom_fields_values'];
        $validator = $customFields['validator'];

        $request->validate($validator);
        $guardian = Auth::user();

        // check duplicate player
        $exist_player = $this->checkDuplicatePlayer($request);

        if ($exist_player->status() != 200) {
            return response()->json([
                'message' => $exist_player->original['message'],
                'player' => $exist_player,
            ], 422);
        } else {
            //get auto increment id of users table
            $statement = DB::select("SHOW TABLE STATUS LIKE 'users'");
            $user_id = $statement[0]->Auto_increment;
            $email = 'user' . $user_id . '@ezactive.com';
            // get role id by role name 'parent'
            $role_id = config('constants.role_base.player');
            try {
                $user = User::create([
                    // 'project_id' => $request->project_id,
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $email,
                    'password' => Hash::make('12345'),
                    'role_id' => $role_id
                ]);
                // create player
                if ($user) {
                    try {
                        $player = Player::create([
                            'user_id' => $user->id,
                            'dob' => $request->dob,
                            'gender' => $request->gender,
                            'photo' => $request->photo,
                            'document_type' => $request->document_type,
                            'document_photo' => $request->document_photo,
                            'document_expiry_date' => isset($request->document_expiry_date) ? $request->document_expiry_date : null,
                            'validate_status' => config('constants.validate_status.pending'),
                            'custom_fields' => $custom_fields_values
                        ]);

                        $guardian_player = Guardian::create([
                            'user_id' => $guardian->id,
                            'player_id' => $player->id,
                            'relationship' => 'parent',
                            'is_primary' => true
                        ]);
                    } catch (\Exception $e) {
                        return response()->json([
                            'message' => __("Player created failed"),
                            'error' => $e,
                        ], 400);
                    }

                    // add to registration table
                    $registration = new RegistrationController();
                    $request->request->add(['player_id' => $player->id]);
                    $res = $registration->create($request);
                    // Log::info($res->status());
                    if ($res->status() < 500 && $res->status() >= 400) {
                        // remove user and player
                        $user->delete();
                        $player->delete();
                        $guardian_player->delete();
                    }
                    // Log::info($res->original['registration']['id']);
                    // get init_json in Settings table
                    $settings = Settings::where('key', 'init_json')->first();
                    $is_trial_required = isset($settings->value['is_trial_required']) ? $settings->value['is_trial_required'] : false;
                    $is_validate_required = isset($settings->value['is_validate_required']) ? $settings->value['is_validate_required'] : true;
                    if ($is_trial_required && !$is_validate_required) {
                        $registrationCtrl = new RegistrationController();
                        // add registration_id to $request
                        $request->request->add(['registration_id' => $res->original['registration']['id']]);
                        $registrationCtrl->approveRegistration($request);
                    }
                    return $res;
                }
            } catch (\Exception $e) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => $e
                ], 506);
            }
        }
    }

    // get players by parent
    public function getPlayersByParent()
    {
        $user = Auth::user();
        $players = Player::with('user', 'guardians', 'registrations', 'registrations.club', 'registrations.paymentDetails.payment')
            ->whereHas('guardians', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();
        return response()->json(['players' => $players], 200);
    }

    // get players by parent and season
    public function getPlayersByParentSeason($season_id)
    {
        $user = Auth::user();
        $players = Player::with('user', 'guardians', 'registrations', 'registrations.club')
            ->whereHas('guardians', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->whereHas('registrations', function ($query) use ($season_id) {
                $query->where('season_id', $season_id);
            })
            ->get();
        // get players not in season

        $players_not_in_season = Player::with('user', 'guardians', 'registrations', 'registrations.club')
            ->whereHas('guardians', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->whereDoesntHave('registrations', function ($query) use ($season_id) {
                $query->where('season_id', $season_id);
            })
            ->get();
        // merge players and players not in season
        $players = $players->merge($players_not_in_season);
        return response()->json(['players' => $players], 200);
    }

    public function updatePlayerForValidate(Request $request)
    {
        $validator_default = [
            // validation for player
            'player_id' => 'required|integer|exists:players,id',
            'season_id' => 'required|integer|exists:seasons,id',
            'first_name' => ['sometimes', 'required', 'string', new Name()],
            'last_name' => ['sometimes', 'required', 'string', new Name()],
            'dob' => ['sometimes', 'required', 'date'],
            'gender' => ['sometimes', 'required', 'string'],
            'photo' => ['sometimes', 'required'],
            'document_type' => ['sometimes', 'required', 'string'],
            'document_photo' => ['sometimes', 'required'],
            'document_expiry_date' => ['nullable', 'date'],
            'club_id' => ['sometimes', 'required', 'integer', 'exists:clubs,id'],
        ];
        $customFields = $this->converCustomFieldsValidator($request, $validator_default, true);
        $custom_fields_values = $customFields['custom_fields_values'];
        $validator = $customFields['validator'];
        $request->validate($validator);
        $player = Player::find($request->player_id);

        if (!$player) {
            return response()->json(['message' => __('Player not found')], 400);
        }

        $user = $player->user;

        // check duplicate player
        $exist_player = $this->checkDuplicatePlayer($request, $player->id);

        if ($exist_player->status() != 200) {
            return $exist_player;
        }
        // update player
        $player->dob = $request->dob ? $request->dob : $player->dob;
        $player->gender = $request->gender ? $request->gender : $player->gender;
        $player->document_type = $request->document_type ? $request->document_type : $player->document_type;
        $player->document_expiry_date = $request->document_expiry_date ? $request->document_expiry_date : $player->document_expiry_date;
        $player->validate_status = config('constants.validate_status.updated');
        $player->custom_fields = $custom_fields_values;
        // check year of birth suitable for age group in season
        $registration_ctrl = new RegistrationController();
        $suitable = $registration_ctrl->checkAgeSuitability($player, $request->season_id);
        if (!$suitable) {
            return response()->json([
                'message' => __("Player is not suitable for any group in this season"),
            ], 400);
        }

        // update user
        $user->first_name = $request->first_name ? $request->first_name : $user->first_name;
        $user->last_name = $request->last_name ? $request->last_name : $user->last_name;
        $user->save();

        $player->photo = $request->photo ? $request->photo : $player->photo;
        $player->document_photo = $request->document_photo ? $request->document_photo : $player->document_photo;

        $player->save();

        return response()->json(['message' => 'Player updated successfully'], 200);
    }

    public function updatePlayerByAdmin(Request $request)
    {
        $validator_default = [
            // validation for player
            'registration_id' => 'required|integer|exists:registrations,id',
            'first_name' => ['sometimes', 'required', 'string', new Name()],
            'last_name' => ['sometimes', 'required', 'string', new Name()],
            'dob' => ['sometimes', 'required', 'date'],
            'gender' => ['sometimes', 'required', 'string'],
            'document_type' => ['sometimes', 'required', 'string'],
            'document_expiry_date' => ['nullable', 'date'],
        ];
        $customFields = $this->converCustomFieldsValidator($request, $validator_default, true);
        $custom_fields_values = $customFields['custom_fields_values'];
        $validator = $customFields['validator'];

        $request->validate($validator);

        $registration = Registration::find($request->registration_id);
        if (!$registration) {
            return response()->json(['message' => __('Registration not found')], 400);
        }
        $player = $registration->player;
        $user = $player->user;
        // check duplicate player
        $exist_player = $this->checkDuplicatePlayer($request, $player->id);

        if ($exist_player->status() != 200) {
            return $exist_player;
        }
        // update player
        $player->dob = $request->dob ? $request->dob : $player->dob;
        $player->gender = $request->gender ? $request->gender : $player->gender;
        $player->document_type = $request->document_type ? $request->document_type : $player->document_type;
        $player->document_expiry_date = $request->document_expiry_date ? $request->document_expiry_date : $player->document_expiry_date;
        $player->custom_fields = $custom_fields_values ? $custom_fields_values : $player->custom_fields;
        // check year of birth suitable for age group in season
        $registration_ctrl = new RegistrationController();
        $suitable = $registration_ctrl->checkAgeSuitability($player, $registration->season_id);
        if (!$suitable) {
            return response()->json([
                'message' => __("Player is not suitable for any group in this season"),
            ], 400);
        }
        // update user
        $user->first_name = $request->first_name ? $request->first_name : $user->first_name;
        $user->last_name = $request->last_name ? $request->last_name : $user->last_name;
        $user->save();

        $player->save();
        return response()->json(['message' => 'Player updated successfully'], 200);
    }

    // function to validate player
    public function validatePlayer(Request $request)
    {
        /*validate_fields = 
        {
            "field_1": {
                "accepted" => true,
                "message" => "message"
            },
             "field_1": {
                "accepted" => true,
                "message" => "message"
            }
        } */

        $request->validate([
            'registration_id' => 'required|integer|exists:registrations,id',
            'validate_fields' => 'required|json',
        ]);
        $validate_fields = json_decode($request->validate_fields, true);
        // count validate fields
        $count_fields = count($validate_fields);
        // get registration
        $registration = Registration::find($request->registration_id);
        // get player
        $player = $registration->player;
        $season = $registration->season;
        // if validate status is validated or awaiting update then return error
        if ($player->validate_status == config('constants.validate_status.validated') || $player->validate_status == config('constants.validate_status.awaiting_update')) {
            return response()->json(['message' => __('Only pending or updated status can be validated')], 400);
        }
        if ($player) {
            // get fields accepted and not accepted 
            $fields_accepted = [];
            $fields_not_accepted = [];
            foreach ($validate_fields as $key => $value) {
                if ($value['accepted']) {
                    array_push($fields_accepted, $key);
                } else {
                    $field = [
                        'field' => $key,
                        'message' => $value['message'] ? $value['message'] : __('Field not accepted')
                    ];
                    array_push($fields_not_accepted, $field);
                }
            }
            // Log::info($fields_not_accepted);
            // convert fields accepted to string
            $fields_accepted_str = implode('|', $fields_accepted);
            // Log::info($fields_accepted_str);
            // save validate fields
            $player->validated_fields = $fields_accepted_str;

            if ($count_fields == count($fields_accepted)) {
                // update player validate status
                $player->validate_status = config('constants.validate_status.validated');
                $registration_controller = new RegistrationController();
                $request->merge(['validate_status' => $player->validate_status]);
                $res =  $registration_controller->approveRegistration($request);
                if ($res->getStatusCode() == 200) {
                    $player->save();
                    return response()->json(['message' => __('Player validated successfully')], 200);
                } else {
                    return $res;
                }
            } else {
                // update player validate status
                $player->validate_status = config('constants.validate_status.awaiting_update');
                $player->save();
                // send email to player
                $user = $player->user;
                $guardian = $player->primaryGuardian->user;
                $guardian->sendValidateNotificationToGuardian($user, $guardian, $season, $fields_not_accepted);
                return response()->json(['message' => __('Send email to player successfully')], 200);
            }
        }
    }

    // get players registered in season
    public function getPlayersRegisteredInSeason($season_id)
    {
        $players = Player::with('user')
            ->whereHas('registrations', function ($query) use ($season_id) {
                $query->where('season_id', $season_id);
            })->get();
        return response()->json($players, 200);
    }



    /**
     * Check duplicate player by first name, last name, dob and gender 
     * @param mixed $request array(first_name,last_name,dob,gender)
     * @param int $player_id (use for update player. Default is null)
     * @author Luu Hoang Long
     * @since 2023/08/03
     */

    function checkDuplicatePlayer(Request $request, $player_id = null)
    {
        // Log::info($request->all());
        $request->validate([
            // validation for player
            'first_name' => ['string', new Name()],
            'last_name' => ['string', new Name()],
            'dob' => ['date', 'nullable'],
            'gender' => ['string'],
        ]);

        $dob = $request->dob ?  $request->dob : null;
        $gender = $request->gender ? $request->gender : null;
        $first_name = $request->first_name ? $request->first_name : null;
        $last_name = $request->last_name ? $request->last_name : null;
        $ex_player = null;
        if ($player_id) {
            $ex_player = Player::where('id', $player_id)->with('user')->first();
            if (!$ex_player) {
                return response()->json(['message' => __('Player not found')], 400);
            }
        }

        if ($ex_player) {
            $dob = $dob ? $dob : $ex_player->dob;
            $gender = $gender ? $gender : $ex_player->gender;
            $first_name = $request->first_name ? $request->first_name : $ex_player->user->first_name;
            $last_name = $request->last_name ? $request->last_name : $ex_player->user->last_name;
        }

        //   find player by users.first_name,  users.last_name, dob, gender
        $player = Player::whereHas('user', function ($query) use ($request, $first_name, $last_name) {
            $query->where('first_name',  $first_name)
                ->where('last_name', $last_name);
        })
            ->where('dob', $dob)
            ->where('gender', $gender);

        if ($player_id) {
            $player = $player->where('id', '!=', $player_id);
        }
        $player->get();

        if ($player->count() > 0) {
            return response()->json(['message' => __("validation.unique", ['attribute' => 'player'])], 400);
        } else {
            return response()->json(['message' => __('available')], 200);
        }
    }
}
