import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpRtxX4mT2K8otyIKiQiY6KSanYHtrsCY",
  authDomain: "practice-5a829.firebaseapp.com",
  projectId: "practice-5a829",
  storageBucket: "practice-5a829.firebasestorage.app",
  messagingSenderId: "1072891173935",
  appId: "1:1072891173935:web:0fb6d032c7e29c18f0fada",
  measurementId: "G-0WPQYM3NS5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider ,signInWithPopup};