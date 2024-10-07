// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAL_gZCPCEU7AV22p3yUHAJfBh_UkDreD0",
  authDomain: "hashbankk2.firebaseapp.com",
  projectId: "hashbankk2",
  storageBucket: "hashbankk2.appspot.com",
  messagingSenderId: "457638546313",
  appId: "1:457638546313:web:8689f5295d86be16bcef58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };