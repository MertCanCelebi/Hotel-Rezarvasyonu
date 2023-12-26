// firebase.js

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

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

// AsyncStorage kullanarak Auth'ı başlatın
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore();

export { app, auth, db };
