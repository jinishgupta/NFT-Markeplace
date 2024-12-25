// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth();
console.log(app);

// Logout code 	  
document.getElementById("logout").addEventListener("click", function () {
  signOut(auth).then(() => {
    console.log('Log-out successful.');
    window.location.href = "login.html";
  }).catch((error) => {
    console.log('An error happened.', error);
  });
});

// Realtime Database
const db = getDatabase(app);

// Utility function to append NFTs in scroll images
function appendNFTsInScroll(nft, container) {
  const card = document.createElement("div");
  card.className = "child";

  card.innerHTML = `
    <img class="child-img" src="${nft.imageUrl}" alt=${nft.name}></img>
  `;
  container.appendChild(card);
}

function appendMusicNFTsInScroll(nft, container) {
  const card = document.createElement("div");
  card.className = "child";

  card.style.background = `linear-gradient(90deg,#4e104b,#5fd8df)`;
  card.textContent = `${nft.name}`;
  card.style.fontSize = `3em`;
  card.style.fontWeight = `bold`;
  card.style.display = `flex`;
  card.style.justifyContent = `center`;
  card.style.alignItems = `center`;

  container.appendChild(card);
}

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

// Utility function to append music collection cards with metadata
function appendMusicCollectionCard(collection, container) {
  const card = document.createElement("div");
  card.className = "nft-container";

  card.innerHTML = `
       <div class="musicCard-title">${collection.metadata.name}</div>
    <div class="info"> 
      <div>
        Floor Price<br>
        <span class="value">${collection.metadata.floor}</span>
      </div>
      <div>
        Volume<br>
        <span class="value">${collection.metadata["total volume"]}</span>
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

// Function to format time in mm:ss
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

// Function to append Music NFT Card
function appendMusicNFTCard(nft, container) {
  const card = document.createElement("div");
  card.className = "nft-card";

  card.innerHTML = `
      <div class="gradient"></div>
      <div class="details">
        <h2>${nft.name}</h2>
        <p>${nft.price} ETH</p>
        <div class="audio-player">
          <button class="play-pause" data-id="${nft.id}">Play</button>
          <input type="range" class="seek-bar" value="0" min="0" max="100">
          <span class="current-time">0:00</span> / <span class="duration">0:00</span>
        </div>
        <audio class="audios">
          <source src="${nft.audioUrl}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
  container.appendChild(card);

  // Add play/pause and seek functionality
  const audio = card.querySelector(".audios");
  const playPauseBtn = card.querySelector(".play-pause");
  const seekBar = card.querySelector(".seek-bar");
  const currentTimeElem = card.querySelector(".current-time");
  const durationElem = card.querySelector(".duration");

  // Update duration once metadata is loaded
  audio.addEventListener("loadedmetadata", () => {
    durationElem.textContent = formatTime(audio.duration);
    seekBar.max = Math.floor(audio.duration);
  });

  // Play/pause button functionality
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playPauseBtn.textContent = "Pause";
    } else {
      audio.pause();
      playPauseBtn.textContent = "Play";
    }
  });

  // Update seek bar and current time during playback
  audio.addEventListener("timeupdate", () => {
    seekBar.value = Math.floor(audio.currentTime);
    currentTimeElem.textContent = formatTime(audio.currentTime);
  });

  // Seek functionality
  seekBar.addEventListener("input", () => {
    audio.currentTime = seekBar.value;
  });

  // Reset button text when audio ends
  audio.addEventListener("ended", () => {
    playPauseBtn.textContent = "Play";
  });
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
          const scrollNFTs = document.querySelector(".scroll-images");
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
          const nfts = collections.flatMap((collection) =>
            collection.nfts
          );

          const shuffledNFTs = nfts.sort(() => Math.random() - 0.5);
          shuffledNFTs.slice(0, 6).forEach((nft) => {
            if (nft.imageUrl) {
              appendNFTsInScroll(nft, scrollNFTs);
            } else {
              appendMusicNFTsInScroll(nft, scrollNFTs);
            }
          }
          );

          const shuffledCollections = collections.sort(() => Math.random() - 0.5);
          shuffledCollections.slice(0, 10).forEach((collection) => {
            if (collection.metadata.imageUrl) {
              appendCollectionCard(collection, topCollectionsContainer);
            } else {
              appendMusicCollectionCard(collection, topCollectionsContainer);
            }
          }
          );

          // Populate NFTs by categories
          populateCategory("Art-NFTs", trendingArtContainer, nftData);
          populateCategory("Gaming-NFTs", trendingGamingContainer, nftData);
          populateCategory("PFP-NFTs", trendingPFPsContainer, nftData);
          populateCategory("Photography-NFTs", trendingPhotographyContainer, nftData);
          populateCategory("Music-NFTs", trendingMusicContainer, nftData);

        } else if (document.body.classList.contains("art-page")) {
          //  Art Section
          const scrollNFTs = document.querySelector(".scroll-images");
          const topArtCollectionsContainer = document.querySelector(".top-art-collections");
          const trendingArtContainer = document.querySelector(".trending-art");

          const artcollections = Object.values(nftData["Art-NFTs"]);
          artcollections.forEach((collection) =>
            appendCollectionCard(collection, topArtCollectionsContainer)
          );
          populateCategory("Art-NFTs", trendingArtContainer, nftData);
          populateSmallCategory("Art-NFTs", scrollNFTs, nftData);

        } else if (document.body.classList.contains("music-page")) {
          // Music Section
          const scrollNFTs = document.querySelector(".scroll-images");
          const topMusicCollectionsContainer = document.querySelector(".top-music-collections");
          const trendingMusicContainer = document.querySelector(".trending-music");

          const musiccollections = Object.values(nftData["Music-NFTs"]);
          musiccollections.forEach((collection) =>
            appendMusicCollectionCard(collection, topMusicCollectionsContainer)
          );
          populateCategory("Music-NFTs", trendingMusicContainer, nftData);
          populateSmallCategory("Music-NFTs", scrollNFTs, nftData);

        } else if (document.body.classList.contains("gaming-page")) {
          // Gaming Section
          const scrollNFTs = document.querySelector(".scroll-images");
          const topGamingCollectionsContainer = document.querySelector(".top-gaming-collections");
          const trendingGamingContainer = document.querySelector(".trending-gaming");

          const gamingcollections = Object.values(nftData["Gaming-NFTs"]);
          gamingcollections.forEach((collection) =>
            appendCollectionCard(collection, topGamingCollectionsContainer)
          );
          populateCategory("Gaming-NFTs", trendingGamingContainer, nftData);
          populateSmallCategory("Gaming-NFTs", scrollNFTs, nftData);

        } else if (document.body.classList.contains("pfp-page")) {
          // PFP Section
          const scrollNFTs = document.querySelector(".scroll-images");
          const topPfpCollectionsContainer = document.querySelector(".top-pfp-collections");
          const trendingPfpContainer = document.querySelector(".trending-pfps");

          const pfpcollections = Object.values(nftData["PFP-NFTs"]);
          pfpcollections.forEach((collection) =>
            appendCollectionCard(collection, topPfpCollectionsContainer)
          );
          populateCategory("PFP-NFTs", trendingPfpContainer, nftData);
          populateSmallCategory("PFP-NFTs", scrollNFTs, nftData);

        } else if (document.body.classList.contains("photography-page")) {
          // Photography Section
          const scrollNFTs = document.querySelector(".scroll-images");
          const topPhotographyCollectionsContainer = document.querySelector(".top-photography-collections");
          const trendingPhotographyContainer = document.querySelector(".trending-photography");

          const photographycollections = Object.values(nftData["Photography-NFTs"]);
          photographycollections.forEach((collection) =>
            appendCollectionCard(collection, topPhotographyCollectionsContainer)
          );
          populateCategory("Photography-NFTs", trendingPhotographyContainer, nftData);
          populateSmallCategory("Photography-NFTs", scrollNFTs, nftData);
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
  if (category == "Music-NFTs") {
    shuffledNFTs.slice(0, 10).forEach((nft) => appendMusicNFTCard(nft, container));
  } else {
    shuffledNFTs.slice(0, 10).forEach((nft) => appendNFTCard(nft, container));
  }
}

function populateSmallCategory(category, container, nftData) {
  const nfts = Object.values(nftData[category] || {}).flatMap((collection) => collection.nfts);
  const shuffledNFTs = nfts.sort(() => Math.random() - 0.5);
  if (category == "Music-NFTs") {
    shuffledNFTs.slice(0, 6).forEach((nft) => appendMusicNFTsInScroll(nft, container));
  } else {
    shuffledNFTs.slice(0, 6).forEach((nft) => appendNFTsInScroll(nft, container));
  }
}

// Fetch NFTs when the page loads
fetchNFTsForPage();