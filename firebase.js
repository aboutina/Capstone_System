// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWsfWYB8lxzJbGXw_iN0ypCd1H4KiG_08",
    authDomain: "capstone-66741.firebaseapp.com",
    projectId: "capstone-66741",
    storageBucket: "capstone-66741.appspot.com",
    messagingSenderId: "825653312206",
    appId: "1:825653312206:web:a0048438d84f8b44e26e9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage(app)