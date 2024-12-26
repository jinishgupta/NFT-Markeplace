// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const analytics = getAnalytics(app);
const db = getDatabase(app);

function getNFTNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name");
}

function populateNFTDetails(nftName) {
    const dbRef = ref(db, `All-nfts`);

    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const nftData = snapshot.val();

                // Find the nft with the given name
                let selectedNFT = null;
                const collections = Object.keys(nftData).flatMap((category) =>
                    Object.values(nftData[category])
                  );
                  const nfts = collections.flatMap((collection) =>
                    collection.nfts
                  );
                  nfts.forEach((nft) => {
                    if (nft.name === nftName) {
                        selectedNFT = nft;
                        }   
                    });

                if (selectedNFT) {
                   renderNFTDetails(selectedNFT);
                } else {
                    console.error("NFT not found.");
                }
             
            } else {
                console.error("No data found in the database.");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function renderNFTDetails(nft) {
    // Populate NFT data
    document.getElementById("nft-name").textContent = nft.name;
    document.getElementById("nft-owner").innerHTML = `<strong>Owner</strong>: ${nft.owner}`;
    document.getElementById("nft-category").innerHTML = `<strong>Category</strong>: ${nft.category}`;
    document.getElementById("nft-description").innerHTML = `<strong>Description</strong>: ${nft.description}`;
    document.getElementById("nft-price").innerHTML = `<strong>Price</strong>: ${nft.price} ETH`;
    const image = document.getElementById("nft-image");
    image.src = nft.imageUrl;
}

// Get the collection ID from URL and populate details
const NFTName = getNFTNameFromURL();
populateNFTDetails(NFTName); 