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
    apiKey: 'AIzaSyChcwSjIbImdxl38fEZqC5803jiLSXLNYA',
    authDomain: 'tzeptosoft-comments.firebaseapp.com',
    databaseURL: 'https://tzeptosoft-comments-default-rtdb.firebaseio.com',
    projectId: 'tzeptosoft-comments',
    storageBucket: 'tzeptosoft-comments.firebasestorage.app',
    messagingSenderId: '111764232266',
    appId: '1:111764232266:web:1007abbff6c1de49d86eb3',
    measurementId: 'G-QNJBCD54ET'
};

const isConfigured = Object.values(firebaseConfig).every((value) => !value.includes('YOUR_'));
const app = isConfigured ? initializeApp(firebaseConfig) : null;
const db = app ? getDatabase(app) : null;

export { db, isConfigured, ref, push, onValue, runTransaction, serverTimestamp };
