// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVf2gy1x87kOSl4rghsyxLsv_uJHBijzQ",
  authDomain: "mpyp-a22e2.firebaseapp.com",
  projectId: "mpyp-a22e2",
  storageBucket: "mpyp-a22e2.firebasestorage.app",
  messagingSenderId: "58345687868",
  appId: "1:58345687868:web:660338bd63ef8e75ba2c39",
  measurementId: "G-B0R4FEFLLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);