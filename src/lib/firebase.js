// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCK8NJyKCbB19CdeifjK8eviQhPNCVC2XE",
    authDomain: "capstone-28b31.firebaseapp.com",
    projectId: "capstone-28b31",
    storageBucket: "capstone-28b31.appspot.com",
    messagingSenderId: "440398580021",
    appId: "1:440398580021:web:71d2864a96b4826ed0e47c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)