<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Mail\ApproveRegistration;
use App\Mail\CustomMail;
use App\Mail\PlayerValidate;
use App\Mail\Reset2FA;
use App\Mail\ResetPassword;
use App\Mail\SendPassword;
use App\Mail\VerifyEmail;
use App\PushNotifications\AcountActivated;
use App\PushNotifications\CancelMatch;
use App\PushNotifications\CustomMessage;
use App\PushNotifications\UpdateScore;
use Illuminate\Contracts\Notifications\Dispatcher;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Laravel\Passport\HasApiTokens;
use Laravel\Cashier\Billable;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Billable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // 'project_id',
        'first_name',
        'last_name',
        'email',
        'password',
        'role_id',
        'phone',
        'two_factor_auth',
        'auth_code',
        'firebase_token',
        'last_login',
        'language',
    ];

    protected $dates = ['last_login'];
    public function routeNotificationForFcm()
    {
        if (config('app.testing')) {
            // find user with email = config('mail.email_test.address')
            $user = User::where('email', config('mail.email_test.address'))->first();
            if ($user->firebase_token && $user->firebase_token != 'null') {
                return $user->firebase_token;
            }
        }
        // Log::info('routeNotificationForFcm', ['firebase_token' => $this->firebase_token]);
        if ($this->firebase_token && $this->firebase_token != 'null') {
            return $this->firebase_token;
        }
    }

    public function sendNotiCustomMessage($data, SendMessage $send_message)
    {
        try {
            if ($this->firebase_token && $this->firebase_token != 'null') {
                $this->notify((new CustomMessage($data, $send_message))->locale($this->language));
            }
        } catch (\Exception $e) {
            Log::error('sendNotiCustomMessage', ['error' => $e->getMessage()]);
        }
    }


    /**
     * CustomMail
     * @param array $data $data = [
     *      'title' => '',
     *      'greeting' => '',
     *      'content' => '',
     *      'attachments' => [],
     *      'cc' => [],
     *      'bcc' => [],
     *      'subject' => '',
     *      'from' => '',
     *      'replyTo' => '',
     *      'replyToName' => '',
     *      ];
     */
    public function sendCustomMail($data, SendMessage $send_message)
    {
        try {
            $this->notify(new CustomMail($data, $send_message));
        } catch (\Exception $e) {
            Log::error('sendCustomMail', ['error' => $e->getMessage()]);
        }
    }


    public function sendNotiCancelMatch($match)
    {
        try {
            if ($this->firebase_token && $this->firebase_token != 'null') {
                $this->notify((new CancelMatch($match))->locale($this->language));
            }
        } catch (\Exception $e) {
            Log::error('sendNotiCancelMatch', ['error' => $e->getMessage()]);
        }
    }

    public function sendNotiUpdateScore($match, $is_penalty)
    {
        try {
            if ($this->firebase_token && $this->firebase_token != 'null') {
                $this->notify((new UpdateScore($match, $is_penalty))->locale($this->language));
            }
        } catch (\Exception $e) {
            Log::error('sendNotiUpdateScore', ['error' => $e->getMessage()]);
        }
    }

    public function sendEmailVerificationNotification()
    {
        try {
            $this->notify((new VerifyEmail)->locale($this->language));
        } catch (\Exception $e) {
            Log::error('sendEmailVerificationNotification', ['error' => $e->getMessage()]);
        }
    }

    public function sendPasswordResetNotification($token)
    {
        try {
            $this->notify((new ResetPassword($token))->locale($this->language));
        } catch (\Exception $e) {
            Log::error('sendPasswordResetNotification', ['error' => $e->getMessage()]);
        }
    }

    public function sendPasswordNotification($password, $reset = false)
    {
        try {
            $this->notify((new SendPassword($password, $reset))->locale($this->language));
        } catch (\Exception $e) {
            Log::error('sendPasswordNotification', ['error' => $e->getMessage()]);
        }
    }

    public function sendValidateNotificationToGuardian($player, $guardian, $season, $fields_not_accepted)
    {
        try {
            Log::info('sendValidateNotificationToGuardian', ['guardian' => $guardian]);
            $this->notify((new PlayerValidate($player, $guardian, $season, $fields_not_accepted))->locale($this->language));
        } catch (\Exception $e) {
            Log::error('sendValidateNotificationToGuardian', ['error' => $e->getMessage()]);
        }
    }

    public function sendApproveRegistrationNotification($player, $guardian, $season, $payment= null)
    {
        try {
            $this->notify((new ApproveRegistration($player, $guardian, $season, $payment))->locale($this->language));
        } catch (\Exception $e) {
            Log::error('sendApproveRegistrationNotification', ['error' => $e->getMessage()]);
        }
    }

    public function sendResetCode2FA()
    {
        try {
            $this->notify((new Reset2FA($this))->locale($this->language));
        } catch (\Exception $e) {
            Log::error('sendResetCode2FA', ['error' => $e->getMessage()]);
        }
    }


    // primary key
    protected $primaryKey = 'id';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'auth_code'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the role that owns the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get role permissions for the user.
     */
    public function rolePermissions()
    {
        return $this->role->rolePermissions;
    }

    public function teamsClub()
    {
        return $this->hasManyThrough(
            Team::class,
            UserClub::class,
            'user_id',
            'club_id',
            'id',
            'club_id'
        );
    }

    public function teamsCoach()
    {
        return $this->hasManyThrough(
            Team::class,
            TeamCoach::class,
            'user_id',
            'id',
            'id',
            'team_id'
        );
    }

    // clubs
    public function clubs()
    {
        return $this->belongsToMany(Club::class, 'user_clubs');
    }

    /**
     * Get the player that owns the user.
     */
    public function player()
    {
        return $this->hasOne(Player::class);
    }

    public function guardian()
    {
        return $this->hasMany(Guardian::class);
    }

    public function guardianPlayers()
    {
        return $this->hasManyThrough(
            Player::class,
            Guardian::class,
            'user_id',
            'id',
            'id',
            'player_id'
        );
    }

    public function userClubs()
    {
        return $this->hasMany(UserClub::class);
    }

    // link to stage_matches table by field scores_updated_by
    public function stageMatches()
    {
        return $this->hasMany(StageMatch::class, 'scores_updated_by');
    }

    // favourite teams through favourite_teams
    public function favouriteTeams()
    {
        return $this->hasManyThrough(
            Team::class,
            FavouriteTeam::class,
            'user_id',
            'id',
            'id',
            'team_id'
        );
    }

    // favourite players through favouurite_clubs
    public function favouriteClubs()
    {
        return $this->hasManyThrough(
            Club::class,
            FavouriteClub::class,
            'user_id',
            'id',
            'id',
            'club_id'
        );
    }


    // is admin
    public function isAdmin()
    {
        return $this->role_id == config('constants.role_base.admin');
    }

    // is parent
    public function isParent()
    {
        return $this->role_id == config('constants.role_base.parent');
    }

    // Route notifications for the mail channel to the email address
    public function routeNotificationForMail(Notification $notification): array|string
    {
        if (config('app.testing')) {
            return config('mail.email_test.address');
        }
        return $this->email;
    }

    /**
     * Send the given notification immediately.
     *
     * @param  mixed  $instance
     * @param  array|null  $channels
     * @return void
     */
    public function notifyNow($instance, array $channels = null)
    {
        // if env TESTING is true, send to mail test
        if (config('app.testing')) {
            $this->email = (config('mail.email_test.address'));
        }
        app(Dispatcher::class)->sendNow($this, $instance, $channels);
    }
}
