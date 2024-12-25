// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref , get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFj5ZjLfmG18d6uawRrESmR0iadVek-H4",
  authDomain: "nft-marketplace-9a468.firebaseapp.com",
  databaseUrl:"https://nft-marketplace-9a468-default-rtdb.firebaseio.com",
  projectId: "nft-marketplace-9a468",
  storageBucket: "nft-marketplace-9a468.firebasestorage.app",
  messagingSenderId: "208333584068",
  appId: "1:208333584068:web:b0bd814d46324504d4fb91",
  measurementId: "G-5JRN00H2YD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
console.log(app);

   // Logout code 	  
   document.getElementById("logout").addEventListener("click", function() {
       signOut(auth).then(() => {
           console.log('Log-out successful.');
           window.location.href="login.html";
         }).catch((error) => {
           console.log('An error happened.',error);
         });		  		  
   });

// Realtime Database
const db = getDatabase(app);

// Utility function to append collection cards with metadata
function appendCollectionCard(collection, container) {
    const card = document.createElement("div");
    card.className = "card-container";
  
    card.innerHTML = `
      <div class="card-header">
        <img src="${collection.metadata.imageUrl}" alt="${collection.metadata.name}">
      </div>
      <div class="card-content">
        <div class="card-title">
            ${collection.metadata.name}
        </div>
        <div class="info">
          <div>
            Floor<br>
            <span class="value">${collection.metadata.floor}</span>
          </div>
          <div>
            Total Volume<br>
            <span class="value">${collection.metadata["total volume"]}</span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  }
  
  // Utility function to append NFT cards
  function appendNFTCard(nft, container) {
    const card = document.createElement("div");
    card.className = "card-container";
  
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
    container.appendChild(card);
  }
  
  // Function to detect the current page and fetch NFTs accordingly
  function fetchNFTsForPage() {
    const dbRef = ref(db, "All-nfts");
  
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const nftData = snapshot.val();
  
          // Detect the current page based on a unique identifier (e.g., body class or specific ID)
          if (document.body.classList.contains("main-page")) {
            // Main page: 6 sections , Section containers
          const topCollectionsContainer = document.querySelector(".top-collections");
          const trendingArtContainer = document.querySelector(".trending-art");
          const trendingGamingContainer = document.querySelector(".trending-gaming");
          const trendingPFPsContainer = document.querySelector(".trending-pfps");
          const trendingPhotographyContainer = document.querySelector(".trending-photography");
          const trendingMusicContainer = document.querySelector(".trending-music");
  
          // Populate Top Collections with metadata
          const collections = Object.keys(nftData).flatMap((category) =>
            Object.values(nftData[category])
          );
          collections.slice(0, 10).forEach((collection) =>
            appendCollectionCard(collection, topCollectionsContainer)
          );
  
          // Populate NFTs by categories
          populateCategory("Art-NFTs", trendingArtContainer, nftData);
          populateCategory("Gaming-NFTs", trendingGamingContainer, nftData);
          populateCategory("PFP-NFTs", trendingPFPsContainer, nftData);
          populateCategory("Photography-NFTs", trendingPhotographyContainer, nftData);
          populateCategory("Music-NFTs", trendingMusicContainer, nftData);
   
          } else if (document.body.classList.contains("art-page")) {
            //  Art Section
          const topArtCollectionsContainer = document.querySelector(".top-art-collections");
          const trendingArtContainer = document.querySelector(".trending-art");
  
          const artcollections = Object.values(nftData["Art-NFTs"]);
          artcollections.forEach((collection) =>
            appendCollectionCard(collection, topArtCollectionsContainer)
          );
          populateCategory("Art-NFTs", trendingArtContainer, nftData);
          }
        else if (document.body.classList.contains("music-page")) {
          // Music Section
        const topMusicCollectionsContainer = document.querySelector(".top-music-collections");
        const trendingMusicContainer = document.querySelector(".trending-music");

        const musiccollections = Object.values(nftData["Music-NFTs"]);
        musiccollections.forEach((collection) =>
          appendCollectionCard(collection, topMusicCollectionsContainer)
        );
        populateCategory("Music-NFTs", trendingMusicContainer, nftData);
        
      } else if (document.body.classList.contains("gaming-page")) {
        // Gaming Section
      const topGamingCollectionsContainer = document.querySelector(".top-gaming-collections");
      const trendingGamingContainer = document.querySelector(".trending-gaming");

      const gamingcollections = Object.values(nftData["Gaming-NFTs"]);
      gamingcollections.forEach((collection) =>
        appendCollectionCard(collection, topGamingCollectionsContainer)
      );
      populateCategory("Gaming-NFTs", trendingGamingContainer, nftData);
      
    } else if (document.body.classList.contains("pfp-page")) {
      // PFP Section
    const topPfpCollectionsContainer = document.querySelector(".top-pfp-collections");
    const trendingPfpContainer = document.querySelector(".trending-pfps");

    const pfpcollections = Object.values(nftData["PFP-NFTs"]);
    pfpcollections.forEach((collection) =>
      appendCollectionCard(collection, topPfpCollectionsContainer)
    );
    populateCategory("PFP-NFTs", trendingPfpContainer, nftData);
    
  } else if (document.body.classList.contains("photography-page")) {
    // Photography Section
  const topPhotographyCollectionsContainer = document.querySelector(".top-photography-collections");
  const trendingPhotographyContainer = document.querySelector(".trending-photography");

  const photographycollections = Object.values(nftData["Photography-NFTs"]);
  photographycollections.forEach((collection) =>
    appendCollectionCard(collection, topPhotographyCollectionsContainer)
  );
  populateCategory("Photography-NFTs", trendingPhotographyContainer, nftData); 
 }
} else {
          console.error("No data found in the database.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
   
  // Helper function to populate NFTs by category
  function populateCategory(category, container, nftData) {
    const nfts = Object.values(nftData[category] || {}).flatMap((collection) => collection.nfts);
    const shuffledNFTs = nfts.sort(() => Math.random() - 0.5);
    shuffledNFTs.slice(0, 10).forEach((nft) => appendNFTCard(nft, container));
}

  // Fetch NFTs when the page loads
  fetchNFTsForPage();