// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth} from "firebase/auth";
import {getDatabase} from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABI5Gef7a58dBLYFk8Y-Zh4XhGKVUU9jI",
  authDomain: "pw-firebase-11226.firebaseapp.com",
  projectId: "pw-firebase-11226",
  storageBucket: "pw-firebase-11226.appspot.com",
  messagingSenderId: "689466721722",
  appId: "1:689466721722:web:dbd7b42c6ec2d259480983",
  databaseURL: "https://pw-firebase-11226-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const signInProvider = new GoogleAuthProvider();
signInProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
export const auth = getAuth(app);
export default app;

export const db = getDatabase(app);
export const DB_TODO_KEY = 'todos';
export const DB_CHAT_KEY = 'chat';