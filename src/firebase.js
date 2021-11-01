import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBzgQ4k60JJqk62d9jplHbnrBP67clVNHI",
	authDomain: "blog-49f65.firebaseapp.com",
	projectId: "blog-49f65",
	storageBucket: "blog-49f65.appspot.com",
	messagingSenderId: "1029799692329",
	appId: "1:1029799692329:web:f46c8352c913bf8dc1b438",
	measurementId: "G-28575SBW5Y",
};

initializeApp(firebaseConfig);

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore();

export function login() {
	signInWithPopup(auth, googleProvider);
}
export function logout() {
	signOut(auth);
}
