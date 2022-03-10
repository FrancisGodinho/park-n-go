import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCgOfPEHYKv20cx82WLeGAH1fmhc2atCbQ",
  authDomain: "cpen-391-ab53e.firebaseapp.com",
  projectId: "cpen-391-ab53e",
  storageBucket: "cpen-391-ab53e.appspot.com",
  messagingSenderId: "228565866782",
  appId: "1:228565866782:web:d2bc1715c980f7c3e9510f",
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };
