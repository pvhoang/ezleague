// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  apiUrl: 'http://localhost:8000/api',
  red5: {
    protocol: 'wss',
    port: null,
    host: 'red5pro.ezactive.com',
    app: 'live',
  },
  wowzaApi: 'https://api.video.wowza.com/api/v1.10',
  wowzaToken:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTU3NzEwZS0yYzhlLTQ1MDgtOTEwOS1hZWMxNTEwODAxY2UiLCJqdGkiOiI3Zjc0MzBlMmM5NDVjN2M0MjVmMzVjYTkxNjhjZTExOGFlNDlkZjc3Y2RlZjQzYmViZWQ1NTcyZmMzODA0MWNmMTllMDI4MTAzOWQxNWFkNyIsImlhdCI6MTY4MTI4NDg1MCwibmJmIjoxNjgxMjg0ODUwLCJleHAiOjIzMTI0MzY4NTAsInN1YiI6Ik9VLTQyYjAxOWFlLTQzNTYtNGIzMy1hNjA0LTYyY2Y4MzhmYjZiMyJ9.3rw6FUoj2rs5au4xgORfvnVcJ_3ptvW5xfq70HePemCyVRC75423EIfR5ySYOzaLzgEYJMOZVHJ1XElXPJ6U0MDtPCLcA-VXq-21hfzwV8oCu6iQ--YlIfE64ehn6l-EKBc1-HC66nirjtOV2BUN0xYE-2FkQprTIWoH6YVHShSl23KSvIfZScbzI3uChPuWwgfYwi5NEpzYWFsFYnFnVOlruIy67H-_On93fV4JvWOgJQKPa_xPtQT-zXCyDKHrCXi4hSAmPa_h1KeqX0ALJjr3nRWbnt0n5zMJOpZJyLsK1LghKrnJ0Syw9iVVhvHtYmJyRrGX64jbx1NykjTll7hkAA8aSWHChXVSNjq2_W-EW71bchRWMleK_1e9wpHY8P1yvBoi2ZeWG1PyYCeVGk8e26OsK5IMkY3Qklaav8HY8bsmQURpMq4C_RIQbI1TZ9FiSD0uikv1FAShGVFccqJe5kwgFqf5FTX_W09ODdKYJ4kEnm0ioJ2CFskVf1IAxSvkEOsUtlzNMqxvej8VbNhVdUZ_Vf0pNLsZxBvKt2eDMHYLcgLzhD8ZImHDMLOW1lq2CbmJV6Ym8fDM9ZkF9MP8Elh66yBYwWjploP-U9UTYQbaRGUXyB2IikcDV4Wa2xzs5r28NVtCXR0NVgL5M7f9RafXLffgrT1YiKkqWnA',
  publishingToken:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTU3NzEwZS0yYzhlLTQ1MDgtOTEwOS1hZWMxNTEwODAxY2UiLCJqdGkiOiIyNGFlMjEyZDQ4YTdmOGNlOWU3NmFkMWZiMGZjMWViN2EyY2IzMDhlMGZhODEyYTQxZDMyZTlhY2E4Y2YyNDk0NGNkZTlkMGRkMDI5MDk4YiIsImlhdCI6MTY4MTI5MDM1NCwibmJmIjoxNjgxMjkwMzU0LCJleHAiOjIzMTI0NDIzNTQsInN1YiI6Ik9VLTI4MWU4MDZjLTM0ZjItNGNhYy05ZTIxLTI3NDEzNGQ3ZmI0MCJ9.ulyUS-RkomOcby2giGu56S7EUPgTdkeFQBThoQj4t6nPrvt98J9W1W8hniK58VOHmjGNvCzZAI_QFVrsXGMkUtvpn_7KRye7daD4T8TDWLi33PqUW95p-xggDfRdcTKNVKLHhoP-QqymrIkhtKIEJxJsQWGjtB-Qf8_nW36RASvUxNwkvoJoDyFjh91lvi2T_qdm1q-Ryhkjk9XSEbPsTLc5QBQA4B2v30Db6vFdVC5LEnSDXPf1n3D8_WGH09nGHRgW0z36jHWnzzySEKNp6-dBWglZycI6j53GNLLxLw6sFfZbAIr2_zgSM_klqA_a8EtaowqYkSxT1QTb_YKzTJMbuB7bTZ86p-uF9nmcpq2y5YjT9YBgNTCkKonqHX1GLvH5I8aVaN4DnguXvD8RL5wsmBMHM8bZlcA3ESK_9q37ccBP8tXSH8KO5wh_p0ooxooCX83oqoD2fypKsaP15Akra68-Nb2cAISoOxXw5Vs-b974sAxx4e36dTfItMXKrULiv3iBuEEcZShskdZJaGaOL1wkX3vTnIpxMdi2Umtm1_xMbo7yyAtwxZkx593TbCsgxWBaGYveckKf0e2V_Tu2d2oSEedwk4TVKF6dE3OC3rerYiMpc72ZncUrOD6Rouw6YgOx8z8wriZIF-PvqhVq2kl83pmz1uGnptgb8jQ',
  firebase: {
    apiKey: 'AIzaSyBAmAIHI1yqoT028B6cAMGhuEkxNdepC28',
    authDomain: 'ezactive-ezleague.firebaseapp.com',
    projectId: 'ezactive-ezleague',
    storageBucket: 'ezactive-ezleague.appspot.com',
    messagingSenderId: '976832086948',
    appId: '1:976832086948:web:8f1c0eccb39b4ba265f731',
    measurementId: 'G-BD36ZBQX6V',
    vapidKey:
      'BGa8u09LbZk1S9frZCxi_Wb7rXDe44pQ0KlCUYUdKXePB3XagiTDsAs7QZk0bzeyjINOPCwr3RR1l_zdHCghJSo',
  },
  stripe: {
    publishableKey: "pk_test_51NQ3UmDXDLBGPpQrT99fYhZ3lmv2GrN667trK2Kuyp8Of9z4wqr7n73UWqmIAwlp3pvV0B6wg6Clv3JYmle4bsqV00a7Nb4Lba",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
