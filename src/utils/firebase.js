// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9LxdTWWXgwbD_Nn4P-F5Ko1ZttQrEBuA",
  authDomain: "discord-clone-project-835b1.firebaseapp.com",
  projectId: "discord-clone-project-835b1",
  storageBucket: "discord-clone-project-835b1.appspot.com",
  messagingSenderId: "221906202623",
  appId: "1:221906202623:web:36c3d328c9257782a101ca",
  measurementId: "G-QESLQ0YJ46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
export default db;