// firebase.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {initializeFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-1WyiuMhnO6pix1gupYygUvCqbUc6HYI",
  authDomain: "hotelrezarvasyon.firebaseapp.com",
  projectId: "hotelrezarvasyon",
  storageBucket: "hotelrezarvasyon.appspot.com",
  messagingSenderId: "587101646290",
  appId: "1:587101646290:web:fc43008a25f10765182c0b",
  measurementId: "G-ST3KMDWC66"
};
var app;
if (!firebase.apps.length){
    app = firebase.initializeApp(firebaseConfig);
}
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

export { firebase, db };