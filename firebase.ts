import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import FirebaseConfig from "./firebase-config.json";

initializeApp(FirebaseConfig);

let auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();

export { auth, firestore, storage };
