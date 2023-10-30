<?php

use App\DataTables\UserDataTableEditor;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\MatchDetailController;
use App\Http\Controllers\PaypalController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ReleasesController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\SendMessageController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StageController;
use App\Http\Controllers\StageMatchController;
use App\Http\Controllers\StageTeamController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\TeamCoachController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamPlayerController;
use App\Http\Controllers\TeamsheetController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\UserClubController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserMessageController;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Cashier\Http\Controllers\WebhookController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['language'])->group(function () {
    // Route::post('/users', [UserController::class, 'index'])->name('users.index');
    // Route::post('editor', function(UserDataTableEditor $editor) {
    //     return $editor->process(request());
    // });

    // AUTH
    Route::group(['prefix' => 'auth'], function () {

        Route::get('verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');  // http://localhost:8000/api/auth/verify-email/1/2

        Route::middleware('guest')->group(function () {
            Route::post('register', [AuthController::class, 'register']);
            Route::post('login', [AuthController::class, 'login']);
            Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
            Route::post('verify-2fa', [AuthController::class, 'verify2fa']);
            Route::post('reset-2fa', [AuthController::class, 'reset2fa']);
        });

        Route::middleware('auth:api')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('send-verification-email', [EmailVerificationController::class, 'resend']);
            Route::get('get-info', [AuthController::class, 'userInfo']);
            Route::post('change-password', [AuthController::class, 'changePassword']);
            Route::get('generate-2fa-secret', [AuthController::class, 'generate2faSecret']);
            Route::post('enable-2fa', [AuthController::class, 'enable2fa']);
            Route::post('disable-2fa', [AuthController::class, 'disable2fa']);
        });
    });

    // USER
    Route::group(['prefix' => 'users'], function () {
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all', [UserController::class, 'all']);
            Route::post('editor', [UserController::class, 'editor']);
            Route::put('update', [UserController::class, 'update']);
            Route::post('update-language', [
                UserController::class, 'updateUserLanguage'
            ]);
            Route::post('role', [UserController::class, 'getUserByRole']);
            Route::get('reset-db', [UserController::class, 'resetDatabase'])->middleware('admin');
            Route::get('send-active', [UserController::class, 'sendNotiActive']);
            Route::get('favourite-clubs', [UserController::class, 'getFavouriteClubs']);
            Route::post('toggle-follow-club', [UserController::class, 'toggleFavouriteClub']);
            Route::get('favourite-teams', [UserController::class, 'getFavouriteTeams']);
            Route::post('toggle-follow-team', [UserController::class, 'toggleFavouriteTeam']);
            Route::get('by-email', [UserController::class, 'getUserByEmail']);
        });
    });

    // SEASON
    Route::group(['prefix' => 'seasons'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all', [SeasonController::class, 'all']);
            Route::get('all-active', [SeasonController::class, 'getSeasonsIsActive']); // http://localhost:8000/api/season/all-active
            Route::post('editor', [SeasonController::class, 'editor']);
            Route::get('current-season', [SeasonController::class, 'getCurrentSeason']); // http://localhost:8000/api/season/current-season
            Route::get('{season_id}', [SeasonController::class, 'getSeasonById']); // http://localhost:8000/api/season/1
            Route::post('{season_id}/matches', [SeasonController::class, 'getSeasonMatches']);
            Route::get('{season_id}/tournament-options/{group_id}', [TournamentController::class, 'optionsTournaments']);
            Route::get('', [SeasonController::class, 'getSeasons']);
            Route::get('{season_id}/manage-teams', [SeasonController::class, 'getTeamsInSeason2Manage']);
            Route::get('{season_id}/teams', [TeamController::class, 'getTeamsBySeasonId']);
            Route::post('{season_id}/teamsheets', [TeamSheetController::class, 'getTeamsheetBySeason']);
            Route::get('{season_id}/groups', [GroupController::class, 'getGroupsBySeasonId']);
        });
    });

    // GROUP
    Route::group(['prefix' => 'groups'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all', [GroupController::class, 'all']);
            Route::post('editor', [GroupController::class, 'editor']);
            Route::get('club/{club_id}', [GroupController::class, 'getGroupByClub']);
            Route::get('{group_id}/teams', [GroupController::class, 'getTeamsByGroupId']);
        });
    });

    // PLAYER
    Route::group(['prefix' => 'players'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            // Route::get('index', [PlayerController::class, 'index']);
            Route::get('of-user', [PlayerController::class, 'getPlayersByParent']);
            Route::get('of-user-season/{season_id}', [PlayerController::class, 'getPlayersByParentSeason']);
            Route::post('update-information', [PlayerController::class, 'updatePlayerForValidate']); // http://localhost:8000/api/player/update-information
            Route::post('update-by-admin', [PlayerController::class, 'updatePlayerByAdmin']);
            Route::get('season/{season_id}', [PlayerController::class, 'getPlayersRegisteredInSeason']);
        });
    });

    // CLUB
    Route::group(['prefix' => 'clubs'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all', [ClubController::class, 'all']);
            Route::post('editor', [ClubController::class, 'editor']);
            Route::get('all-active', [ClubController::class, 'getClubsActive']);
            Route::post('toggle-active', [ClubController::class, 'toggleActive']);
            Route::get('by-user', [ClubController::class, 'getClubByUser']);
            Route::get('{club_id}/users', [ClubController::class, 'getUsersByClub']);
            Route::post('users/create', [UserClubController::class, 'create']);
            Route::post('users/destroy', [UserClubController::class, 'destroy']);
            Route::post('{club_id}/coaches', [ClubController::class, 'getCoachesByClub']);
        });
    });

    // REGISTRATION
    Route::group(['prefix' => 'registrations'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('add-new-player', [PlayerController::class, 'createByParent']);
            Route::post('all', [RegistrationController::class, 'all']);
            Route::post('editor', [RegistrationController::class, 'editor']);
            Route::post('create', [RegistrationController::class, 'create']);
            Route::post('season/{season_id}', [RegistrationController::class, 'getRegistrationsBySeason']); // http://localhost:8000/api/registration/season/1
            Route::post('validate-player', [PlayerController::class, 'validatePlayer']);
            Route::post('club-group-approved', [RegistrationController::class, 'getRegistrationsByClubAndSeason']);
            Route::post('approve', [RegistrationController::class, 'approveRegistration']);
            Route::post('club-group-approved', [RegistrationController::class, 'getPlayersCanAssignToTeam']);
        });
    });

    // TEAM
    Route::group(['prefix' => 'teams'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::get('auth-user', [TeamController::class, 'getTeamManageByAuth']);
            Route::get('{team_id}', [TeamController::class, 'getTeamById']); // http://localhost:8000/api/teams/1
            Route::get('season/{season_id}', [TeamController::class, 'getTeamsByUser']); // http://localhost:8000/api/season/team/1/club/1
            Route::get('season/{season_id}/club/{club_id}', [TeamController::class, 'getTeamsByUser']); // http://localhost:8000/api/season/team/1/club/1
            Route::get('season/{season_id}/club/{club_id}/group/{group_id}', [TeamController::class, 'getTeamsByUser']);
            Route::get('group/{group_id}', [TeamController::class, 'getTeamsByGroupId']);
            Route::get('{team_id}/players', [TeamController::class, 'getPlayersByTeamId']);
            Route::post('assign-player', [TeamController::class, 'assignPlayerToTeam']);
            Route::post('remove-player', [TeamController::class, 'removePlayerFromTeam']);
            Route::post('not-in-stage', [StageTeamController::class, 'teamsNotInStage']);
            Route::post('in-stage', [StageTeamController::class, 'teamsInStage']);
            Route::post('editor', [TeamController::class, 'editor']);
            Route::post('{team_id}/players', [TeamController::class, 'getTeamPlayersById']);
            Route::post('{team_id}/coaches', [TeamController::class, 'getTeamCoachesById']);
        });
    });

    // ROLE
    Route::group(['prefix' => 'roles'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all', [RoleController::class, 'all']);
            // Route::post('editor', [RoleController::class, 'editor']);
            Route::post('create', [RoleController::class, 'store']);
            Route::post('edit', [RoleController::class, 'update']);
            Route::post('delete', [RoleController::class, 'destroy']);
            Route::get('index', [RoleController::class, 'index']);
        });
    });

    // PERMISSION
    Route::group(['prefix' => 'permissions'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            // Route::post('all', [PermissionController::class, 'all']);
            // Route::post('editor', [PermissionController::class, 'editor']);
            Route::get('index', [PermissionController::class, 'index']);
        });
    });

    // TEAM PLAYERS
    Route::group(['prefix' => 'team-players'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('in-team/{team_id}', [TeamPlayerController::class, 'inTeam']);
            Route::post('editor', [TeamPlayerController::class, 'editor']);
            Route::get('{team_id}/players', [TeamPlayerController::class, 'optionsPlayersByTeam']);
        });
    });

    /** Team coaches */
    Route::group(['prefix' => 'team-coaches'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('editor', [TeamCoachController::class, 'editor']);
            Route::post('assign-new', [TeamCoachController::class, 'assignNewCoach']);
        });
    });

    // TEAM SHEETS
    Route::group(['prefix' => 'team-sheets'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all', [TeamSheetController::class, 'all']); // http://localhost:8000/api/team-sheets/all/1
            Route::post('by-season/{season_id}', [TeamSheetController::class, 'getTeamsheetBySeason']);
            Route::post('team/{team_id}', [TeamSheetController::class, 'getTeamsheetByTeamId']);
            Route::post('editor', [TeamSheetController::class, 'editor']);
            Route::post('submit', [TeamsheetController::class, 'submitTeamsheet']);
            Route::get('show/{id}', [TeamSheetController::class, 'show']);
        });
    });

    // TOURNAMENT
    Route::group(['prefix' => 'tournaments'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all-in-group', [TournamentController::class, 'allInGroup']);
            Route::post('editor', [TournamentController::class, 'editor']);
            Route::post('stage/{stage_id}/match', [TournamentController::class, 'getMatchesByStageId']);
            Route::get('{tournament_id}', [TournamentController::class, 'getTournamentById']);
            Route::get('season/{season_id}/matches-user', [TournamentController::class, 'showMatchesInSeasonByUser']);
            Route::get('season/{season_id}/fixtures', [TournamentController::class, 'showFixturesResultsInSeason']);
        });
    });

    // STAGE
    Route::group(['prefix' => 'stages'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all-in-tournament/{tournament_id}', [StageController::class, 'allInTournament']);
            Route::post('editor', [StageController::class, 'editor']);
            Route::get('{stage_id}', [StageController::class, 'getStageById']);
            Route::post('auto-generate', [StageController::class, 'generateMatches']);
            Route::get('{stage_id}/table', [StageController::class, 'getTableByStageId']);
            Route::get('has-matches/{stage_id}', [StageController::class, 'hasMatches']);
        });
    });

    // STAGE TEAM
    Route::group(['prefix' => 'stage-teams'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all-in-stage/{stage_id}', [StageTeamController::class, 'allInStage']);
            Route::post('editor', [StageTeamController::class, 'editor']);
            Route::post('create', [StageTeamController::class, 'create']);
            Route::post('delete', [StageTeamController::class, 'destroy']);
            Route::post('edit-group', [StageTeamController::class, 'update']);
        });
    });

    // STAGE MATCH
    Route::group(['prefix' => 'stage-matches'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::get('live-matches', [StageMatchController::class, 'getLiveMatches']);
            Route::get('streaming/{status?}', [StageMatchController::class, 'getStreamingMatches']);
            Route::post('all-in-stage/{stage_id}', [StageMatchController::class, 'allInStage']);
            Route::post('editor', [StageMatchController::class, 'editor']);
            Route::get('{match_id}', [StageMatchController::class, 'show']);
            Route::get('{match_id}/details', [MatchDetailController::class, 'getMatchDetail']);
            Route::put('{match_id}/details', [MatchDetailController::class, 'update']);
            Route::delete('details/{match_detail_id}', [MatchDetailController::class, 'destroy']);
            Route::get('{match_id}/exist', [StageMatchController::class, 'checkMatchExists']);
            Route::post('update-broadcast', [StageMatchController::class, 'updateBroadcastId']);
        });
    });

    // locations
    Route::group(['prefix' => 'locations'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all', [LocationController::class, 'all']);
            Route::post('editor', [LocationController::class, 'editor']);
        });
    });

    // Send Message
    Route::group(['prefix' => 'send-messages'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::get('{message_id}', [SendMessageController::class, 'getMessage']);
            Route::post('season', [SendMessageController::class, 'bySeason']);
            Route::post('send', [SendMessageController::class, 'sendCustomMessage']);
            Route::post('{message_id}/details', [SendMessageController::class, 'messageDetails']);
        });
    });

    // User messages
    Route::group(['prefix' => 'user-messages'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::get('{user_id}', [UserMessageController::class, 'getUserMessages']);
            Route::get('mark-all-as-read/{user_id}', [UserMessageController::class, 'markAllAsRead']);
            Route::post('mark-as-read', [UserMessageController::class, 'markAsRead']);
        });
    });

    // Files
    Route::group(['prefix' => 'files'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('editor', [FileController::class, 'editor']);
        });
    });

    // Settings
    Route::group(['prefix' => 'settings'], function () {
        Route::get('required-version', [SettingsController::class, 'getRequiredVersion']);
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::get('init-json', [SettingsController::class, 'getInitJson']);
            Route::get('', [SettingsController::class, 'getSettings'])->middleware('admin');
            Route::post('', [SettingsController::class, 'updateSettings'])->middleware('admin');
        });
    });

    // Release
    Route::group(['prefix' => 'releases'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('all', [ReleasesController::class, 'all']);
            Route::post('editor', [ReleasesController::class, 'editor']);
            Route::get('', [ReleasesController::class, 'get']);
        });
        Route::get('towards_version/{towards_version}', [ReleasesController::class, 'getByTowardsVersion']);
    });

    // Invoice
    Route::group(['prefix' => 'invoices'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('create_approve', [RegistrationController::class, 'createInvoiceApproveRegistration']);
        });
    });

    // Stripe
    Route::group(['prefix' => 'stripe'], function () {
        Route::post('webhooks', [WebhookController::class, 'handleWebhook']);
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('create-customer', [StripeController::class, 'createCustomer']);
            Route::get('invoices', [StripeController::class, 'getInvoices']);
            Route::post('checkout', [StripeController::class, 'checkout']);
            Route::post('sync-invoices-registration', [StripeController::class, 'syncPaymentRegistrationStripe'])->middleware('admin');
        });
    });

    // Paypal
    Route::group(['prefix' => 'paypal'], function () {
        // API with Auth
        Route::group(['middleware' => ['auth:api']], function () {
            Route::post('create-invoice', [PaypalController::class, 'createInvoice']);
            Route::post('send-invoice', [PaypalController::class, 'sendInvoice']);
            Route::post('invoice-details', [PaypalController::class, 'getInvoice']);
        });
    });
});
