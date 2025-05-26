import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBg0pXfeRr0--6KzLJ91xVOy44Y4MasR44",
    authDomain: "tactiq-d0bce.firebaseapp.com",
    projectId: "tactiq-d0bce",
    storageBucket: "tactiq-d0bce.appspot.com",
    messagingSenderId: "535944514987",
    appId: "1:535944514987:web:3cfcf0068edaa9006216ee",
    measurementId: "G-6E6B8JRK4R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


