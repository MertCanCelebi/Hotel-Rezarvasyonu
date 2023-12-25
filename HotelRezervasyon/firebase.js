import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {

    apiKey: "AIzaSyA-1WyiuMhnO6pix1gupYygUvCqbUc6HYI",
    authDomain: "hotelrezarvasyon.firebaseapp.com",
    projectId: "hotelrezarvasyon",
    storageBucket: "hotelrezarvasyon.appspot.com",
    messagingSenderId: "587101646290",
    appId: "1:587101646290:web:fc43008a25f10765182c0b",
    measurementId: "G-ST3KMDWC66"

};



const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { app, auth, db };