import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhJbN5bKiJrdjS-D2OJGg7QDqJ_JlHneQ",
  authDomain: "chat-fun-3f71a.firebaseapp.com",
  projectId: "chat-fun-3f71a",
  storageBucket: "chat-fun-3f71a.appspot.com",
  messagingSenderId: "962906343400",
  appId: "1:962906343400:web:3fe41a7807a0ca2290c65d",
  measurementId: "G-RCTRPLNP2Q"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
  auth.useEmulator('http://localhost:9099');
  db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;
