import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyCWaRAug2H40G0boS_sLBeINr-pOf6dNug',
    authDomain: 'mauudai.firebaseapp.com',
    projectId: 'mauudai',
    storageBucket: 'mauudai.appspot.com',
    messagingSenderId: '10291322247',
    appId: '1:10291322247:web:129303534317763b808722',
    measurementId: 'G-XF12D0ZWC4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const fbProvider = new FacebookAuthProvider();
const ggProvider = new GoogleAuthProvider();

export { db, auth, fbProvider, ggProvider, analytics };
