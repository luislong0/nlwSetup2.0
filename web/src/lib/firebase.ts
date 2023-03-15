// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcBUqjq9-y8-V5wP_6g8_38uECkUa_lns",
  authDomain: "firbase-auth-26902.firebaseapp.com",
  projectId: "firbase-auth-26902",
  storageBucket: "firbase-auth-26902.appspot.com",
  messagingSenderId: "544365552392",
  appId: "1:544365552392:web:30c11cfec6c57e5e2e42bd",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
