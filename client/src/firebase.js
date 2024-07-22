// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mern-estate-46da5.firebaseapp.com",
  projectId: "mern-estate-46da5",
  storageBucket: "mern-estate-46da5.appspot.com",
  messagingSenderId: "809163005389",
  appId: "1:809163005389:web:8aba8f3457b38dda55b884"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);