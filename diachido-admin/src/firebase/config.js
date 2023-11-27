import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
export { db, auth };
