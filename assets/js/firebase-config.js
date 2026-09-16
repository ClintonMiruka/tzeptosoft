import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
    getDatabase,
    ref,
    push,
    onValue,
    runTransaction,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
};

const isConfigured = Object.values(firebaseConfig).every((value) => !value.includes('YOUR_'));
const app = isConfigured ? initializeApp(firebaseConfig) : null;
const db = app ? getDatabase(app) : null;

export { db, isConfigured, ref, push, onValue, runTransaction, serverTimestamp };
