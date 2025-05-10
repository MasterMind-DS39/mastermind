import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIsqwdPF76fh5eBjPa-XzP3W0x0OC6Vxk",
  authDomain: "skillshareapp-32ecc.firebaseapp.com",
  projectId: "skillshareapp-32ecc",
  storageBucket: "skillshareapp-32ecc.firebasestorage.app",
  messagingSenderId: "539143797205",
  appId: "1:539143797205:web:1be679224416edcc79255c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider };
