import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLaJ7toE1488476yjH1rY6Bbb2Q1C6Ysc",
  authDomain: "messaging-app-eb1ee.firebaseapp.com",
  projectId: "messaging-app-eb1ee",
  storageBucket: "messaging-app-eb1ee.appspot.com",
  messagingSenderId: "127008900542",
  appId: "1:127008900542:web:5e16f56df97d05a850e5ef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(app);
export const db = getFirestore(app);