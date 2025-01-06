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
const auth = getAuth();
const db = getDatabase(app);

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

// Fetch and Display User Credentials
function fetchUserProfile() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

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
  card.className = "card-container";

  card.innerHTML = `
      <div class="card-header">
      <img src=${nft.imageUrl} alt=${nft.name}>
      </div>
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

const ownedNFTGrid = document.getElementById("ownedNFT-grid");
const favoriteNFTGrid = document.getElementById("favoriteNFT-grid");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;

    async function OwnedNFTDisplay(userId) {
      try {
        const userRef = ref(db, `users/${userId}`);
        const userSnapshot = await get(userRef);
        const username = userSnapshot.val().name;
        console.log(username);

        const dbRef = ref(db, "All-nfts");
        const snapshot = await get(dbRef);
        const ownedNfts = [];

        if (snapshot.exists()) {
          const nftData = snapshot.val();
          const collections = Object.keys(nftData).flatMap((category) =>
            Object.values(nftData[category])
          );
          const nfts = collections.flatMap((collection) =>
            collection.nfts
          );
          nfts.forEach((nft) => {
            if (nft.owner == username) {
              ownedNfts.push(nft);
            }
          });
          favoriteNFTGrid.innerHTML = "";
          ownedNFTGrid.innerHTML = "";
          ownedNfts.forEach((nft) => {
            if (nft.category == "music") {
              appendMusicNFTCard(nft, ownedNFTGrid);
            } else {
              appendNFTCard(nft, ownedNFTGrid);
            }
          });
        } else {
          console.error("No data found in the database.");
        }
      } catch (error) {
        console.error("Error showing owned NFTs: ", error);
      }
    }

    async function FavoriteNFTDisplay(userId) {
      try {
        const dbRef = ref(db, `UserFavorites/${userId}`);
        const snapshot = await get(dbRef);
        const favoriteNfts = [];

        const nftRef =  ref(db,"All-nfts")
        const nftSnapshot = await get(nftRef);

        if (nftSnapshot.exists()) {
          const nftData = snapshot.val();
          const allNFTsData = nftSnapshot.val();
          const collections = Object.keys(allNFTsData).flatMap((category) =>
            Object.values(allNFTsData[category])
          );
          const nfts = collections.flatMap((collection) =>
            collection.nfts
          );
          nfts.forEach((nft)=>{
            if(nftData.includes(nft.name)) {
              favoriteNfts.push(nft);
            }
          });
          
          ownedNFTGrid.innerHTML="";
          favoriteNFTGrid.innerHTML = "";
          favoriteNfts.forEach((nft) => {
            if (nft.category == "Music") {
              console.log("music");
              appendMusicNFTCard(nft, favoriteNFTGrid);
            } else {
              appendNFTCard(nft, favoriteNFTGrid);
            }
          });
        } else {
          console.error("No data found in the database.");
        }
      }
      catch (error) {
        console.error("Error showing favorite NFTs:", error);
      }
    }
    document.getElementById("ownedNFTs").addEventListener("click", () => {
      OwnedNFTDisplay(userId);
    });
    document.addEventListener("DOMContentLoaded", () => {
      OwnedNFTDisplay(userId);
    });
    document.getElementById("favoriteNFTs").addEventListener("click", () => {
      FavoriteNFTDisplay(userId);
    });
  }
});  