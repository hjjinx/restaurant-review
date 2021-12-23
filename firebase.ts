import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import FirebaseConfig from "./firebase-config.json";

initializeApp(FirebaseConfig);

let auth = getAuth();

export { auth };
