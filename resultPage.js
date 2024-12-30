import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const resultNFTs = [];

// Function to fetch and display results
function fetchResults(query) {
  resultsContainer.innerHTML = "<div>Loading...</div>";
  const dbRef = ref(db, "All-nfts");

  onValue(dbRef, (snapshot) => {
    const nftData = snapshot.val();

    if (nftData) {
      const collections = Object.keys(nftData).flatMap((category) =>
        Object.values(nftData[category])
      );
      const nfts = collections.flatMap((collection) =>
        collection.nfts
      );
      nfts.forEach((nft) => {
        if (nft.name.toLowerCase().includes(query.toLowerCase())) {
          resultNFTs.push(nft);
        }
      });
    }
    resultsContainer.innerHTML = "";
  resultNFTs.forEach((nft) => {
    console.log(nft);
    if (nft.category == "music") {
      appendMusicNFTCard(nft, resultsContainer);
    } else {
      appendNFTCard(nft, resultsContainer);
    }
  });
  });
}

// Extract query from URL and fetch results
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query");

if (query) {
  fetchResults(query);
} else {
  document.getElementById("results").innerHTML = "<div>Please enter a search query</div>";
}