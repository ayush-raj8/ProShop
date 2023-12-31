// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider,sendSignInLinkToEmail } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAsXQ_voDAIhhkmlSUefTwO65DAZ49jvPE",
  authDomain: "shop-4d886.firebaseapp.com",
  projectId: "shop-4d886",
  storageBucket: "shop-4d886.appspot.com",
  messagingSenderId: "798438812990",
  appId: "1:798438812990:web:604fa26d200617358d506f",
  measurementId: "G-98FE4HE8NP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, provider,db, storage };
