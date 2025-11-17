import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from "@env";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

// REmove this later if you don't need it, i just used it for debuggin my shit

const requiredEnv = {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
};

const missing = Object.entries(requiredEnv)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(
    "Missing required Firebase env vars:",
    missing,
    "\nMake sure you have a valid frontend/.env and restart Metro (npx expo start -c)."
  );
  throw new Error(
    `Missing required Firebase env vars: ${missing.join(
      ", "
    )}. See frontend/.env.example.`
  );
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
console.log("Connected Firebase project:", app.options.projectId);
console.log("Using API key:", app.options.apiKey);
export const auth = getAuth(app);
export const db = getFirestore(app);

// optional sanity check — remove later
console.log("✅ Firebase initialized:", firebaseConfig.projectId);
