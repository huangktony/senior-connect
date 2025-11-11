import Constants from "expo-constants";
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig =
  Constants.expoConfig?.extra?.firebase ||
  (Constants.manifest?.extra?.firebase ?? {});

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
