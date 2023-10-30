importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({
    apiKey: "AIzaSyBAmAIHI1yqoT028B6cAMGhuEkxNdepC28",
    authDomain: "ezactive-ezleague.firebaseapp.com",
    projectId: "ezactive-ezleague",
    storageBucket: "ezactive-ezleague.appspot.com",
    messagingSenderId: "976832086948",
    appId: "1:976832086948:web:8f1c0eccb39b4ba265f731",
    measurementId: "G-BD36ZBQX6V",
    vapidKey: 'BGa8u09LbZk1S9frZCxi_Wb7rXDe44pQ0KlCUYUdKXePB3XagiTDsAs7QZk0bzeyjINOPCwr3RR1l_zdHCghJSo'
}); 

// Initialize Firebase
const messaging = firebase.messaging();

console.log(messaging)
messaging.onBackgroundMessage((payload) => {
    // console.log('Message received. ', payload);
    // ...
});