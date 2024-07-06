
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWHz332Rml18Z3fxjLNEScZXoKKnKGtd4",
  authDomain: "quizzical-75575.firebaseapp.com",
  projectId: "quizzical-75575",
  storageBucket: "quizzical-75575.appspot.com",
  messagingSenderId: "177085833082",
  appId: "1:177085833082:web:5ba4cd8830f961557f00c3",
  measurementId: "G-Y1DWQSXCTV"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
