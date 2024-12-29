// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFj5ZjLfmG18d6uawRrESmR0iadVek-H4",
    authDomain: "nft-marketplace-9a468.firebaseapp.com",
    databaseUrl: "https://nft-marketplace-9a468-default-rtdb.firebaseio.com",
    projectId: "nft-marketplace-9a468",
    storageBucket: "nft-marketplace-9a468.firebasestorage.app",
    messagingSenderId: "208333584068",
    appId: "1:208333584068:web:b0bd814d46324504d4fb91",
    measurementId: "G-5JRN00H2YD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Fetch and Display User Credentials
function fetchUserProfile() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      console.log(snapshot);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        document.getElementById("username").innerText = userData.name || "No Name Provided";
        document.getElementById("address").innerText = userData.wallet || "No Wallet Connected";
      } else {
        console.log("User data does not exist in the database.");
      }
    } else {
      console.log("User is not signed in.");
    }
  });
}

// Fetch Profile on Page Load
fetchUserProfile();