// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBr7MU85u_h7HD4BApca_BYW9rnCMwlZMg",
    authDomain: "roomora-3d77d.firebaseapp.com",
    projectId: "roomora-3d77d",
    storageBucket: "roomora-3d77d.firebasestorage.app",
    messagingSenderId: "917393487894",
    appId: "1:917393487894:web:e579465bdcae8da1c81d37",
    measurementId: "G-EHFSZPQDLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);