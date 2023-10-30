<?php

namespace App\Http\Controllers;

use App\DataTables\RegistrationsDataTableEditor;
use App\Models\Registration;
use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Group;
use App\Models\Payment;
use App\Models\PaymentDetail;
use App\Models\Player;
use App\Models\Season;
use App\Models\Settings;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Yajra\DataTables\DataTables as DataTablesDataTables;
use Yajra\DataTables\Facades\DataTables;

class RegistrationController extends Controller
{
    public function all(Request $request)
    {
        //
        $request->validate([
            'season_id' => 'required',
        ]);
        // $registrations = Registration::with(['player.user', 'player.primaryGuardian.user', 'club'])->where('season_id', $request->season_id)->get();

        $registrations = DB::table('registrations')
            ->join('players', 'players.id', '=', 'registrations.player_id')
            ->join('users', 'users.id', '=', 'players.user_id')
            ->join('clubs', 'clubs.id', '=', 'registrations.club_id')
            ->leftJoin('guardians', function ($join) {
                $join->on('guardians.player_id', '=', 'players.id')
                    ->where('guardians.is_primary', '=', 1);
            })
            ->leftJoin('users as guardian_users', 'guardian_users.id', '=', 'guardians.user_id')
            ->leftJoin('payment_details', function ($join) {
                $join->on('payment_details.product_id', '=', 'registrations.id')
                    ->where('payment_details.in_table', 'LIKE', 'registrations');
            })
            ->select('players.*', 'registrations.*', 'payment_details.status as payment_status', 'users.first_name', 'users.last_name', 'users.email', 'clubs.name as club_name', 'guardian_users.first_name as guardian_first_name', 'guardian_users.last_name as guardian_last_name', 'guardian_users.email as guardian_email')
            ->selectRaw('DATE_FORMAT(registrations.created_at, "%Y-%m-%dT%TZ") as created_at')
            ->selectRaw('DATE_FORMAT(registrations.updated_at, "%Y-%m-%dT%TZ") as updated_at')
            ->selectRaw('DATE_FORMAT(registrations.registered_date, "%Y-%m-%dT%TZ") as registered_date')
            ->selectRaw('DATE_FORMAT(registrations.approved_date, "%Y-%m-%dT%TZ") as approved_date')
            ->where('registrations.season_id', $request->season_id)
            ->get();
        // convert custom fields to array
        foreach ($registrations as $registration) {
            if ($registration->custom_fields) {
                $registration->custom_fields = json_decode($registration->custom_fields);
            }
        }
        return DataTables::of($registrations)->make(true);
    }

    public function editor(RegistrationsDataTableEditor $editor)
    {
        return $editor->process(request());
    }


    // Create a new registration
    public function create(Request $request)
    {
        $request->validate([
            'season_id' => ['required', 'exists:seasons,id'],
            //exist club and check club->is_active = 1
            'club_id' => ['required', 'exists:clubs,id', Rule::exists('clubs', 'id')->where(function ($query) {
                $query->where('is_active', 1);
            })],
            'player_id' => [
                'required', 'exists:players,id',
                Rule::unique('registrations')
                    ->where(function ($query) use ($request) {
                        return $query->where('season_id', $request->season_id)
                            ->where('club_id', $request->club_id)
                            ->where('player_id', $request->player_id);
                    })
            ],
        ]);

        // get season fee 
        $season = Season::find($request->season_id);
        $fee = $season->fee;

        // check dob of player suitablity for group in season
        $player = Player::find($request->player_id);
        $suitable = $this->checkAgeSuitability($player, $request->season_id);
        if (!$suitable) {
            return response()->json([
                'message' => __("Player is not suitable for any group in this season"),
                'error' => 'NOT_SUITABLE'
            ], 400);
        }

        try {
            $registration = Registration::create([
                'season_id' => $request->season_id,
                'club_id' => $request->club_id,
                'player_id' => $request->player_id,
                'registered_date' => Carbon::now(),
                'approval_status' => config('constants.approve_status.registered'),
                'amount' => $fee,
            ]);
            return response()->json([
                'message' => __("You will be notified of the status of the registration by email once the application has been reviewed"),
                'registration' => $registration->load('player.user.role.permissions'),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => __("Something went wrong"),
                'error' => $e,
            ], 506);
        }
    }

    // Get all registrations by season id
    public function getRegistrationsBySeason($id)
    {
        // :TODO: get registrations by season id
        $registrations = Registration::with(['player.user', 'player.guardians.user', 'club'])->where('season_id', $id)->get();


        return response()->json([
            'registrations' => $registrations,
        ], 200);
    }

    //function to check dob of player suitablity for group in season
    public function checkAgeSuitability($player, $season_id)
    {
        $dobYear = date('Y', strtotime($player->dob));
        $player_type =  strtolower($player->gender) == strtolower(config('constants.gender.male')) ? config('constants.group_type.boys') : config('constants.group_type.girls');

        // get groups in season with type and year suitable for player
        $groups = Group::where('season_id', $season_id)->where(function ($query) use ($player_type) {
            $query->where('type', config('constants.group_type.mixed'))
                ->orWhere('type', $player_type);
        })->get();
        $suitable = false;

        foreach ($groups as $group) {
            // split year range in group->year
            $yearRange = explode('-', $group->years);
            $startYear = (int)$yearRange[0];
            $endYear = count($yearRange) > 1 ? (int)$yearRange[1] : $startYear;

            if ($dobYear >= $startYear && $dobYear <= $endYear) {
                $suitable = true;
                break;
            }
        }
        if (!$suitable) {
            return false;
        }
        return true;
    }

    // function to Approve registration
    public function approveRegistration(Request $request)
    {
        $request->validate([
            'registration_id' => 'required|exists:registrations,id',
        ]);

        // get is_validate_required in table settings
        $settings = Settings::where('key', 'init_json')->first();
        $is_validate_required = isset($settings->value['is_validate_required']) ? $settings->value['is_validate_required'] : true;
        $is_trial_required = isset($settings->value['is_trial_required']) ? $settings->value['is_trial_required'] : false;
        $registration = Registration::find($request->registration_id);
        $validate_status = isset($request->validate_status) ? $request->validate_status : $registration->player->validate_status;
        // check player is validated 
        if ($validate_status != config('constants.validate_status.validated') && $is_validate_required) {
            return response()->json([
                'message' => __("Player is not validated"),
            ], 400);
        }

        // check approval status
        if ($registration->approval_status != config('constants.approve_status.registered')) {
            return response()->json([
                'message' => __("Registration is already approved"),
            ], 400);
        }

        $registration->approval_status = config('constants.approve_status.approved');
        $registration->approved_date = Carbon::now();


        $player = $registration->player->user;
        $guardian = $registration->player->primaryGuardian->user;
        $season = $registration->season;

        if ($season->fee > 0) {
            $this->createInvoiceAprove($registration, $guardian, $request);
        } else {
            $guardian->sendApproveRegistrationNotification($player, $guardian, $season);
        }
        $registration->save();

        return response()->json([
            'message' => __("Registration approved successfully"),
            'registration' => $registration->load('player.user.role.permissions'),
        ], 200);
    }

    public function createInvoiceAprove(Registration $registration, User $guardian, Request $request, $type = null)
    {
        $payment_method = config('constants.payment_method');
        if ($type) {
            $payment_method = $type;
        }
        switch ($payment_method) {
            case 'stripe':
                return $this->createStripeInvoiceApprove($registration, $guardian);
                break;
            case 'paypal':
                return $this->createPaypalInvoiceApprove($registration, $guardian, $request);
                break;
            default:
                $this->createStripeInvoiceApprove($registration, $guardian);
                break;
        }
    }

    public function createPaypalInvoiceApprove(Registration $registration, User $guardian, Request $request)
    {
        $season = $registration->season;
        $season_name = $season->name;
        $fee = $season->fee;
        // decimel to int
        $fee = $fee * 100;

        $player = $registration->player;
        $player_name = $player->user->first_name . ' ' . $player->user->last_name;

        $paypalCtrl = new PaypalController();
        $items = [
            [
                'name' => 'Season Fee',
                'description' => "$player_name pay for Season $season_name",
                'quantity' => 1,
                'amount' => 300,
            ]
        ];
        $recipient = [
            'email' => $guardian->email,
            'first_name' => $guardian->first_name,
            'last_name' => $guardian->last_name,
        ];
        $request->merge([
            'items' => $items,
            'recipient' => $recipient,
        ]);
        // create draft invoice
        $draft_invoice = $paypalCtrl->createInvoice($request);
        if ($draft_invoice) {
            // send invoice to user
            $request->merge([
                'invoice_id' => $draft_invoice['id'],
            ]);
            // Get invoice details after create
            $invoice_details = $paypalCtrl->getInvoice($request);
            $invoice_details = json_decode(json_encode($invoice_details), true);
            if ($invoice_details['status'] == 'DRAFT') {
                $invoice = $paypalCtrl->sendInvoice($request);
                // convert string "{\"href\":\"https://www.sandbox.paypal.com/invoice/p/#INV2-MBPM-9V46-KBCS-BMHA\",\"rel\":\"payer-view\",\"method\":\"GET\"}" to json
                $invoice = json_decode($invoice, true);
                // get invoice href from json
                $invoice['href'] = $invoice['href'] ?? null;

                // Get invoice details after send
                $invoice_details = $paypalCtrl->getInvoice($request);
                $invoice_details = json_decode(json_encode($invoice_details), true);

                // Save payment to database
                if ($invoice && $invoice_details) {
                    $paymentCtrl = new PaymentController();
                    $payment_data = [
                        'invoice_id' => $draft_invoice['id'],
                        'payment_intent' => $draft_invoice['invoice_no'],
                        'payment_status' => $invoice_details['status'],
                        'payment_url' => $invoice['href'], // invoice url
                        'fee' => $fee,
                    ];
                    $payment = $paymentCtrl->storePaymentRegistration($registration, $payment_data);

                    // send notification to user
                    $guardian->sendApproveRegistrationNotification($player->user, $guardian, $season, $payment);
                    return response()->json([
                        'message' => __("Invoice created successfully"),
                        'payment' => $payment,
                    ], 200);
                }
            }
        }
    }

    public function createStripeInvoiceApprove(Registration $registration, User $guardian)
    {
        $season = $registration->season;
        $season_name = $season->name;
        $fee = $season->fee;
        // decimel to int
        $fee = $fee * 100;

        $player = $registration->player;
        $player_name = $player->user->first_name . ' ' . $player->user->last_name;
        $stripeCustomer = $guardian->createOrGetStripeCustomer();

        $payment_intent = null;
        $invoice_status = null;
        $payment_url = null;
        // send invoice to user
        try {
            $invoice = $guardian->invoiceFor("$player_name pay for Season $season_name", $fee, [], [
                'description' => "$player_name pay for Season $season_name",
                'collection_method' => 'send_invoice',
                'days_until_due' => 30,
            ]);
            $payment_intent = $invoice->payment_intent;
            $invoice_status = $invoice->status;
            $payment_url = $invoice->hosted_invoice_url;
            Log::info('invoice created', [$invoice]);
        } catch (IncompletePayment $e) {
            // if e contains 'IncompletePayment'
            if (strpos($e, 'IncompletePayment') !== false) {
                $invoice = $e->payment->invoice;
                $payment_intent = $invoice->payment_intent;
                $invoice_status = $invoice->status;
                $payment_url = $invoice->hosted_invoice_url;
                Log::info('The payment attempt failed because of an invalid payment method', ['payment_intent' => $payment_intent, 'payment_url' => $payment_url]);
            } else {
                Log::info($e);
                // return error
                return response()->json([
                    'message' => $e->getMessage(),
                ], 400);
            }
        }
        if ($payment_intent) {
            // create payment
            $paymentCtrl = new PaymentController();
            $payment_data = [
                'invoice_id' => $invoice->id,
                'payment_intent' => $payment_intent,
                'payment_status' => $invoice_status,
                'payment_url' => $payment_url,
                'fee' => $fee,
            ];
            $payment = $paymentCtrl->storePaymentRegistration($registration, $payment_data);
            $guardian->sendApproveRegistrationNotification($player->user, $guardian, $season, $payment);
            return response()->json([
                'message' => __("Invoice created successfully"),
                'payment_intent' => $payment_intent,
            ], 200);
        } else {
            return response()->json([
                'message' => __("Something went wrong"),
            ], 400);
        }
    }

    function storePaymentStripeRegistration(Request $request)
    {
        $user =  Auth::user();
        $request->validate([
            'invoice_id' => 'required',
            'payment_intent' => 'required',
            'payment_status' => 'required|string',
            'payment_url' => 'sometimes|nullable|string|url',
            'fee' => 'required',
            'registration_id' => 'required|exists:registrations,id',
        ]);

        $registration = Registration::find($request->registration_id);
        // create payment
        $paymentCtrl = new PaymentController();
        $payment_data = [
            'invoice_id' => $request->invoice_id,
            'payment_intent' => $request->payment_intent,
            'payment_status' => $request->payment_status,
            'payment_url' => $request->payment_url ?? null,
            'fee' => $request->fee,
        ];
        $payment = $paymentCtrl->storePaymentRegistration($registration, $payment_data);
        if ($payment) {
            return response()->json([
                'message' => __("Payment created successfully"),
                'payment' => $payment,
            ], 200);
        } else {
            return response()->json([
                'message' => __("Something went wrong"),
            ], 400);
        }
    }


    // get player registrations by club id and season id suitable for group
    public function getRegistrationsByClubAndSeason(Request $request)
    {
        $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'season_id' => 'required|exists:seasons,id',
            'group_id' => 'required|exists:groups,id',
        ]);

        $club = Club::find($request->club_id);
        $group = Group::find($request->group_id);

        $registrations = Registration::with(['player.user', 'player.guardians.user', 'club'])
            ->where('club_id', $request->club_id)
            ->where('season_id', $request->season_id)
            ->where('approval_status', config('constants.approve_status.approved'))
            ->whereDoesntHave('player.teamPlayers.team', function ($query) use ($request) {
                $query->where('group_id', $request->group_id)
                    ->where('club_id', $request->club_id);
            })
            ->get();

        //    get players suitable for group
        $players = $this->getPlayersSuitableForGroup($request->group_id, $registrations);

        return DataTables::of($players)->make(true);
    }

    /**
     * Get players can assign to team
     * @param $team_id
     */
    public function getPlayersCanAssignToTeam(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:teams,id',
        ]);

        // get team
        $team = Team::find($request->team_id);
        $club_id = $team->club_id;
        $group_id = $team->group_id;

        // get season id of group
        $season_id = $team->group->season_id;

        $registrations = Registration::with(['player.user', 'player.guardians.user', 'club'])
            ->where('club_id', $club_id)
            ->where('season_id', $season_id)
            ->where('approval_status', config('constants.approve_status.approved'))
            ->whereDoesntHave('player.teamPlayers.team', function ($query) use ($club_id, $group_id) {
                $query->where('group_id', $group_id)
                    ->where('club_id', $club_id);
            })
            ->get();

        // get players suitable for group
        $players = $this->getPlayersSuitableForGroup($group_id, $registrations);

        return DataTables::of($players)->make(true);
    }

    function getPlayersSuitableForGroup($group_id, $registrations)
    {
        $group = Group::find($group_id);
        $players = [];
        foreach ($registrations as $registration) {
            $player = $registration->player;
            $player_type =  strtolower($player->gender) == strtolower(config('constants.gender.male')) ? config('constants.group_type.boys') : config('constants.group_type.girls');
            $dobYear = date('Y', strtotime($player->dob));

            // split year range in group->year
            $yearRange = explode('-', $group->years);
            $startYear = (int)$yearRange[0];
            $endYear = count($yearRange) > 1 ? (int)$yearRange[1] : $startYear;

            if ($dobYear >= $startYear && $dobYear <= $endYear) {
                if ($group->type == config('constants.group_type.mixed') || $group->type == $player_type) {
                    $players[] = $player;
                }
            }
        }
        return $players;
    }
}
