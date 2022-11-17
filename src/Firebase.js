// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import { getFirestore, } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6WV_5yxG4LyADW7JYENen-8oR_ze9rvM",
  authDomain: "capstonemta.firebaseapp.com",
  projectId: "capstonemta",
  storageBucket: "capstonemta.appspot.com",
  messagingSenderId: "121494440709",
  appId: "1:121494440709:web:e7bfe41df8b0fad436c56c",
  measurementId: "G-7RKP4DXT0X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
