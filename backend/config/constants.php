<?php

use Illuminate\Support\Facades\Facade;

return [
    // USER ROLE
    'role_base' => [
        'admin' => env('ADMIN_ROLE', 2),
        'parent' => env('PARENT_ROLE', 5),
        'player' => env('PLAYER_ROLE', 6),
    ],

    // GROUP TYPE
    'group_type' => [
        'mixed' => 'Mixed',
        'boys' => 'Boys',
        'girls' => 'Girls'
    ],

    // 
    'gender' => [
        'male' => 'Male',
        'female' => 'Female'
    ],

    // Send Message Type
    'send_message_type' => [
        'email' => 'Email',
        'push_noti' => 'Push Notification',
        'email_push_noti' => 'Email & Push Notification'
    ],

    //VALIDATE STATUS
    'validate_status' => [
        'pending' => 'Pending',
        'awaiting_update' => 'Awaiting Update',
        'validated' => 'Validated',
        'updated' => 'Updated',
    ],

    // APPROVE STATUS
    'approve_status' => [
        'registered' => 'Registered',
        'approved' => 'Approved',
        'rejected' => 'Rejected'
    ],

    // SEASON STATUS
    'season_status' => [
        'active' => 'Active',
        'archived' => 'Archived'
    ],

    // TYPE OF TOURNAMENT
    'tournament_types' => [
        'league' => 'League',
        'groups_knockout' => 'Groups + Knockout',
        'league_knockout' => 'League + Knockout',
        'knockout' => 'Knockout',
        'groups' => 'Groups'
    ],

    // RANKING_CRITERIA
    'ranking_criteria' => [
        'total' => 'Total',
        'direct_matches' => 'Direct matches',
    ],

    // KNOCKOUT_MODES
    'knockout_modes' => [
        'single' => [
            'value' => 1,
            'label' => 'Single elimination',
        ],
        'double' => [
            'value' => 2,
            'label' => 'Double elimination',
        ],
    ],

    // MATCH_DETAIL_TYPES
    'match_detail_types' => [
        'goal' => 'Goal',
        'yellow_card' => 'Yellow Card',
        'red_card' => 'Red Card',
        'substitution' => 'Substitution',
        'penalty' => 'Penalty',
        'own_goal' => 'Own goal',
        'injury' => 'Injury',
        'other' => 'Other',
    ],

    'cancel_match_types' => [
        'Postponed',
        'Cancelled',
        'Abandoned',
        'Rescheduled',
    ],

    'settings_keys' => [
        'smtp' => 'smtp_account',
        'required_versions' => 'r_version',
        'init_json' => 'init_json',
    ],

    'match_details_url' => env('MATCH_DETAILS_URL', '/leagues/matches/{match_id}/details'),

    // PAYMENT METHOD
    'payment_method' => env('PAYMENT_METHOD', 'stripe'),

    'payment_currency' => env('CASHIER_CURRENCY', 'USD'),

    // PAYMENT DETAILS TYPE
    'payment_details_type' => [
        'registration' => 'registration',
        'other' => 'other'
    ],

    // PAYMENT STATUS
    'payment_status' => [
        'open' => 'open',
        'paid' => 'paid',
        'failed' => 'failed',
        'cancelled' => 'cancelled',
        'succeeded' => 'succeeded',
    ],

    'payment_status_paid' => ['paid', 'succeeded'],

    // Minimum amount of payment
    'min_amount_payment' => [
        'stripe' => [
            'USD' => 0.5,
            'AED' => 2.0,
            'AUD' => 0.5,
            'BGN' => 1.0,
            'BRL' => 0.5,
            'CAD' => 0.5,
            'CHF' => 0.5,
            'CZK' => 15.0,
            'DKK' => 2.5,
            'EUR' => 0.5,
            'GBP' => 0.3,
            'HKD' => 4.0,
            'HRK' => 0.5,
            'HUF' => 175.0,
            'INR' => 0.5,
            'JPY' => 50.0,
            'MXN' => 10.0,
            'MYR' => 2.0,
            'NOK' => 3.0,
            'NZD' => 0.5,
            'PLN' => 2.0,
            'RON' => 2.0,
            'SEK' => 3.0,
            'SGD' => 0.5,
            'THB' => 10.0,
        ]
    ],
];
