// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7G0svo3uiFxAbAGD_wnIXd-077AY4ofo",
  authDomain: "hashbank-96ff2.firebaseapp.com",
  projectId: "hashbank-96ff2",
  storageBucket: "hashbank-96ff2.appspot.com",
  messagingSenderId: "1077537427140",
  appId: "1:1077537427140:web:bb24e51e0d5c47b7d18391"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };