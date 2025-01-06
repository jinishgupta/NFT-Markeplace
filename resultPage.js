import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth ,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
            <span class="value">${collection.metadata.totalVolume}</span>
          </div>
        </div>
      </div>
  `;
  card.addEventListener("click", () => {
    window.location.href = `collection.html?name=${collection.metadata.name}`;
  });

  container.appendChild(card);
}

// Utility function to append nft cards
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
  card.addEventListener("click", () => {
    window.location.href = `nft.html?name=${nft.name}`;
  });

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

const resultsContainer = document.getElementById("results");

// Function to fetch nfts
async function fetchNfts(category) {
  try {
    if(category=="All"){
      const dbRef = ref(db, "All-nfts");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const nftData = snapshot.val();
  
        const collections = Object.keys(nftData).flatMap((category) =>
          Object.values(nftData[category])
        );
        const nfts = collections.flatMap((collection) =>
          collection.nfts
        );
        return nfts;
      }
      else {
        console.error("No data found!!");
        return{};
      }
    } else {
      const dbRef = ref(db, `All-nfts/${category}-NFTs`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const nftData = snapshot.val();
        const nfts = Object.keys(nftData).flatMap((key) =>
          Object.values(nftData[key].nfts)
        );
        return nfts;
      }
      else {
        console.error("No data found!!");
        return{};
      }
    }
  } 
  catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function fetchCollections(category) {
  try {
    if(category=="All"){
      const dbRef = ref(db, "All-nfts");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const nftData = snapshot.val();
  
        const collections = Object.keys(nftData).flatMap((category) =>
          Object.values(nftData[category])
        );
        return collections;
      }
      else {
        console.error("No data found!!");
        return{};
      }
    } else {
      const dbRef = ref(db, `All-nfts/${category}-NFTs`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const collections = snapshot.val();
        return collections;
      }
    else {
      console.error("No data found!!");
      return{};
    }
  } 
}
  catch (error) {
    console.error("Error fetching data:", error);
  }
}
// Function to fetch and display results
async function fetchResults(query) {
  resultsContainer.innerHTML = "<div>Loading...</div>";

  if (query == "allCollections") {
    const collections = await fetchCollections("All");
    const resultCollections = [];
    collections.forEach((collection) => {
      if (collection.metadata.name.toLowerCase().includes(query.toLowerCase()) || query == "allCollections") {
        resultCollections.push(collection);
      } 
    });
    resultsContainer.innerHTML = "";
    resultCollections.forEach((collection) => {
        appendCollectionCard(collection, resultsContainer);
    });
  } else {
    const nfts = await fetchNfts("All");
    const resultNFTs = [];
    nfts.forEach((nft) => {
      if (nft.name.toLowerCase().includes(query.toLowerCase()) || query == "allNFTs") {
        resultNFTs.push(nft);
      } 
    });
    resultsContainer.innerHTML = "";
    resultNFTs.forEach((nft) => {
      if (nft.category == "music") {
        appendMusicNFTCard(nft, resultsContainer);
      } else {
        appendNFTCard(nft, resultsContainer);
      }
    });
  }
}

//Function to sort collections
function sortCollections(collections, criteria, order) {
  if (criteria === "name") {
    collections.sort((a, b) => {
      const comparison = a.metadata.name.localeCompare(b.metadata.name);
      return order == "asc" ? comparison : -comparison;
    });
  } else if (criteria === "price") {
    collections.sort((a, b) => {
    const VolumeA = parseFloat(a.metadata.totalVolume);
    const VolumeB = parseFloat(b.metadata.totalVolume);
    console.log(VolumeA);
    return order == "asc" ? VolumeA - VolumeB : VolumeB - VolumeA
  });
  } 
    return collections;
}

// Function to sort NFTs
function sortNFTs(nfts, criteria, order) {
  if (criteria === "name") {
    nfts.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order == "asc" ? comparison : -comparison;
    });
  } else if (criteria === "price") {
    nfts.sort((a, b) => (order == "asc" ? a.price - b.price : b.price - a.price));
  } 
    return nfts;
}

// Function to handle sorting
async function handleSort(query) {
  const criteria = document.getElementById("sort-criteria").value;
  const order = document.getElementById("sort-order").value;
  const category = document.getElementById("category-filter").value;

  if(query =="allNFTs") {
    const nfts = await fetchNfts(category);
  const sortedNFTs = sortNFTs(nfts, criteria, order);
  
  resultsContainer.innerHTML = ""; 
  sortedNFTs.forEach((nft) => {
    if (nft.category === "music") {
      appendMusicNFTCard(nft, resultsContainer);
    } else {
      appendNFTCard(nft, resultsContainer);
    }
  });    
  } else {
    const collections = await fetchCollections(category);
    const arrCollections = Object.keys(collections).map(key => collections[key]);
    const sortedCollections = sortCollections(arrCollections, criteria, order);
  resultsContainer.innerHTML = "";
  sortedCollections.forEach((collection) => {
    if (collection.metadata.category === "music") {
      appendMusicCollectionCard(collection, resultsContainer);
    } else {
      appendCollectionCard(collection, resultsContainer);
    }
  });    
  }
}

// Extract query from URL and fetch results
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query");

if (query) {
  fetchResults(query);
  document.getElementById("sort").addEventListener("click",() => handleSort(query));
} else {
  document.getElementById("results").innerHTML = "<div>Please enter a search query</div>";
}