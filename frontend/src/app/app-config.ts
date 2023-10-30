import { CoreConfig } from '@core/types';

/**
 * Default App Config
 *
 * ? TIP:
 *
 * Change app config based on your preferences.
 * You can also change them on each component basis. i.e `app/main/pages/authentication/auth-login-v1/auth-login-v1.component.ts`
 *
 * ! IMPORTANT: If the enableLocalStorage option is true then make sure you clear the browser local storage(https://developers.google.com/web/tools/chrome-devtools/storage/localstorage#delete).
 *  ! Otherwise, it will not take the below config changes and use stored config from local storage.
 *
 */

// prettier-ignore
export const coreConfig: CoreConfig = {
  app: {
    appName     : 'EZ League',// App Name
    appTitle    : 'EZ League - A Sports Management Company', // App Title
    appLogoImage: 'assets/images/logo/ezactive_1024x1024.png',// App Logo
    appLanguage : 'en', // App Default Language (en, fr, de, pt etc..)
  },
  layout: {
    skin  : 'default',                        // default, dark, bordered, semi-dark
    type  : 'vertical',                       // vertical, horizontal
    animation : 'fadeIn',                     // fadeInLeft, zoomIn , fadeIn, none
    menu : {
      hidden               : false,           // Boolean: true, false
      collapsed            : false,           // Boolean: true, false
    },
    // ? For horizontal menu, navbar type will work for navMenu type
    navbar: {
      hidden               : false,           // Boolean: true, false
      type                 : 'floating-nav',  // navbar-static-top, fixed-top, floating-nav, d-none
      background           : 'navbar-light',  // navbar-light. navbar-dark
      customBackgroundColor: true,            // Boolean: true, false
      backgroundColor      : ''               // BS color i.e bg-primary, bg-success
    },
    footer: {
      hidden               : false,           // Boolean: true, false
      type                 : 'footer-static', // footer-static, footer-sticky, d-none
      background           : 'footer-light',  // footer-light. footer-dark
      customBackgroundColor: false,           // Boolean: true, false
      backgroundColor      : ''               // BS color i.e bg-primary, bg-success
    },
    enableLocalStorage: true,
    customizer  : false,                       // Boolean: true, false (Enable theme customizer)
    scrollTop   : true,                       // Boolean: true, false (Enable scroll to top button)
    buyNow      : false                        // Boolean: true, false (Set false in real project, For demo purpose only)
  }
}

export class AppConfig {
  constructor() {}
  public static APP_NAME = 'EZ League';
  public static LANGUAGES = [
    { code: 'en', name: 'English', shortname: 'ENG', flag: 'us' },
    { code: 'zh_HK', name: '繁體中文', shortname: '中文', flag: 'hk' },
    // { code: 'vi', name: 'Tiếng Việt', shortname: 'VN', flag: 'vn' },
  ];

  public static PROJECT_ID: string = 'HKJFL-2021';
  public static Fake_Player_Photo = 'assets/images/example_uploads/avatar.jpg';
  public static Fake_ID_Photo = 'assets/images/example_uploads/hkid.jpg';

  public static GROUP_TYPE = {
    Mixed: 'Mixed',
    Boys: 'Boys',
    Girls: 'Girls',
  };

  public static GENDER = {
    Male: 'Male',
    Female: 'Female',
  };

  public static VALIDATE_STATUS = {
    Pending: 'Pending',
    AwaitingUpdate: 'Awaiting Update',
    Validated: 'Validated',
    Updated: 'Updated',
  };

  public static APPROVE_STATUS = {
    Registered: 'Registered',
    Approved: 'Approved',
    Rejected: 'Rejected',
  };

  public static PERMISSIONS = {
    registration: 11,
    manage_registrations: 12,
    team_management: 21,
    assign_players: 22,
    assign_coaches: 23,
    manage_teamsheets: 24,
    manage_leagues: 31,
    update_score: 32,
    league_reports: 33,
    manage_events: 41,
    manage_groups: 42,
    manage_clubs: 43,
    manage_locations: 44,
    manage_users: 45,
    send_messages: 46,
  };

  public static TOURNAMENT_TYPES = {
    league: 'League',
    knockout: 'Knockout',
    league_knockout: 'League + Knockout',
    groups: 'Groups',
    groups_knockout: 'Groups + Knockout',
  };

  public static USER_ROLES = {
    admin: 2,
    parent: 5,
    player: 6,
  };
  public static RANKING_CRITERIA = {
    total: 'Total',
    direct_matches: 'Head to Head',
  };
  public static KNOCKOUT_MODES = {
    single: {
      value: 1,
      label: 'Single elimination',
    },
    double: {
      value: 2,
      label: 'Double elimination',
    },
  };

  public static MATCH_DETAIL_TYPES = {
    goal: 'Goal',
    yellow_card: 'Yellow Card',
    red_card: 'Red Card',
    substitution: 'Substitution',
    penalty: 'Penalty',
  };

  public static CANCEL_MATCH_TYPES = [
    'Postponed',
    'Cancelled',
    'Abandoned',
    'Rescheduled',
  ];

  // Send Message Type
  public static SEND_MESSAGE_TYPES = {
    email: 'Email',
    push_noti: 'Push Notification',
    email_push_noti: 'Email & Push Notification',
  };

  public static SETTINGS_KEYS = {
    SMTP: 'smtp_account',
    REQUIRED_VERSIONS: 'r_version',
    INIT_JSON: 'init_json',
  };

  // PAYMENT DETAILS TYPE
  public static PAYMENT_DETAIL_TYPES = {
    registration: 'registration',
    other: 'other',
  };

  // PAYMENT_STATUS
  public static PAYMENT_STATUS = {
    open: 'open',
    paid: 'paid',
    failed: 'failed',
    cancelled: 'cancelled',
    succeeded: 'succeeded',
  };

  public static PAYMENT_STATUS_PAID = ['paid', 'succeeded'];
}
