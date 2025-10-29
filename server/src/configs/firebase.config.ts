import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const API_KEY = process.env.FIREBASE_API_KEY || '';
const AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN || '';
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';
const STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || '';
const MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID || '';
const APP_ID = process.env.FIREBASE_APP_ID || '';
const MEASUREMENT_ID = process.env.FIREBASE_MEASUREMENT_ID || '';


const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const projectStorage = getStorage(app);
const projectAuth = getAuth(app);

export { app, projectStorage, projectAuth };