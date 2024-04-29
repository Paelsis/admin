/*import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyCniLg3N-jF1DQava7qoeUZmvX5a-3rwbY",
  authDomain: "malmo-tango-calendar.firebaseapp.com",
  projectId: "malmo-tango-calendar",
  storageBucket: "malmo-tango-calendar.appspot.com",
  messagingSenderId: "45243718639",
  appId: "1:45243718639:web:b2a86d254ba5db84ddf41a"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig)
export default app
*/ 

import * as firebase from 'firebase/app';
require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
// Initialize Firebase 
const firebaseApp = firebase.initializeApp(firebaseConfig)
console.log('firebaseApp', firebaseApp)
export default firebaseApp

