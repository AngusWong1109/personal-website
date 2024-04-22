// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaUkjZM0GGoK179RcDA3EOi9peSY3fcJ4",
  authDomain: "personal-website-24fed.firebaseapp.com",
  projectId: "personal-website-24fed",
  storageBucket: "personal-website-24fed.appspot.com",
  messagingSenderId: "354757116436",
  appId: "1:354757116436:web:29d71f58f008fac2d29d01",
  measurementId: "G-4BHXP1Z81B",
  databaseURL: "https://personal-website-24fed-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

function addProject(title, picsLink, organisation, startDate, endDate, description, codeLink, websiteLink){
    
}