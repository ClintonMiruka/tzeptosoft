import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
    getDatabase,
    ref,
    push,
    set,
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

const requiredConfigFields = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];
const isConfigured = requiredConfigFields.every((field) => {
    const value = firebaseConfig[field];
    return typeof value === 'string' && value.trim().length > 0 && !value.includes('YOUR_');
});
const app = isConfigured ? initializeApp(firebaseConfig) : null;
const db = app ? getDatabase(app) : null;

export { db, isConfigured, ref, push, set, onValue, runTransaction, serverTimestamp };
