import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC6FlcZ6R656lympHIhanTcTMSIDLaKw8Q",
  authDomain: "otelrezarvasyonsistemi.firebaseapp.com",
  projectId: "otelrezarvasyonsistemi",
  storageBucket: "otelrezarvasyonsistemi.appspot.com",
  messagingSenderId: "470321265379",
  appId: "1:470321265379:web:9d7f3ae5009e0771d7e3d6",
  measurementId: "G-3MSFS3LHML"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db,auth };
