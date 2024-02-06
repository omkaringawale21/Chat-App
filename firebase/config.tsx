import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: `AIzaSyAQ7ACQin1PwHMJ7V8uW-l6u7hpOhKaccI`,
    authDomain: `chatapp-ddc9d.firebaseapp.com`,
    databaseURL: `https://chatapp-ddc9d-default-rtdb.asia-southeast1.firebasedatabase.app/`,
    projectId: `chatapp-ddc9d`,
    storageBucket: `chatapp-ddc9d.appspot.com`,
    messagingSenderId: `764000647663`,
    appId: `1:764000647663:web:5c0fdde061f1b5d7f9de1a`,
    measurementId: `G-308W24L12K`,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export {auth, app};