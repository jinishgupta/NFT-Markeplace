// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth ,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const db = getDatabase(app);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
      const Inelement = document.getElementById("login");
      Inelement.innerHTML = "Logout";
      Inelement.addEventListener("click", function () {
        signOut(auth).then(() => {
          console.log('Log-out successful.');
          window.location.href = "login.html";
        }).catch((error) => {
          console.log('An error happened.', error);
        });
      });
    } else {
      const Outelement = document.getElementById("login");
      Outelement.innerHTML="Login";
      Outelement.href = "login.html";
    }
  });

function getCollectionNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name");
}

function populateCollectionDetails(collectionName) {
    const dbRef = ref(db, `All-nfts`);

    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const nftData = snapshot.val();

                // Find the collection with the given name
                let selectedCollection = null;
                Object.values(nftData).forEach((category) => {
                    Object.values(category).forEach((collection) => {
                        if (collection.metadata.name === collectionName) {
                            selectedCollection = collection;
                        }
                    });
                });

                if (selectedCollection) {
                    renderCollectionDetails(selectedCollection);
                } else {
                    console.error("Collection not found.");
                }
            } else {
                console.error("No data found in the database.");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function renderCollectionDetails(collection) {
    // Populate collection metadata
    document.getElementById("collection-name").textContent = collection.metadata.name;
    document.getElementById("collection-description").textContent = collection.metadata.description;
    document.getElementById("collection-info").textContent = `Created ${collection.metadata.createdDate} | Chain:${collection.metadata.chain }`;
    document.getElementById("collection-numbers").textContent =` Items:${collection.metadata.totalItems} | Floor:${collection.metadata.floor} | Total Volume:${collection.metadata["total volume"]}`;

    // Populate NFTs in the collection
    const nftContainer = document.getElementById("nft-grid");
    nftContainer.innerHTML = ""; // Clear existing content

    collection.nfts.forEach((nft) => {
        const card = document.createElement("div");
        card.className = "nft-card";

        card.innerHTML = `
        <div class="card-header">
        <img src="${nft.imageUrl}" alt="${nft.name}">
      </div>
      <div class="card-content">
        <div class="card-title">
            ${nft.name}
        </div>
        <div class="info">
          <div>
            Owner<br>
            <span class="value">${nft.owner}</span>
          </div>
          <div>
            Price<br>
            <span class="value">${nft.price} ETH</span>
          </div>
        </div>
      </div>
      `;
        nftContainer.appendChild(card);
    });
}

// Get the collection ID from URL and populate details
const collectionName = getCollectionNameFromURL();
populateCollectionDetails(collectionName);  