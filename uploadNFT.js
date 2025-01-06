// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth ,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, push,get , update} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
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

const collectionTypeRadios = document.getElementsByName("collection-type");
const newCollectionSection = document.getElementById("new-collection-section");
const existingCollectionSection = document.getElementById("existing-collection-section");

collectionTypeRadios.forEach((radio) =>
  radio.addEventListener("change", () => {
    if (radio.value === "new" && radio.checked) {
      newCollectionSection.style.display = "block";
      existingCollectionSection.style.display = "none";
    } else if (radio.value === "existing" && radio.checked) {
      newCollectionSection.style.display = "none";
      existingCollectionSection.style.display = "block";
    }
  })
);
// Upload NFT
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid; 
    
    // Function to handle NFT uploading
    const uploadNFT = async () => {
      const nftId = document.getElementById("nft-id").value;
      const nftName = document.getElementById("nft-name").value;
      const nftDescription = document.getElementById("nft-description").value;
      const nftPrice = document.getElementById("nft-price").value;
      const nftImageUrl = document.getElementById("nft-image").value;
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!nftName || !nftDescription || !nftPrice || !nftImageUrl) {
        alert("Please fill out all fields and upload an image.");
        return;
      }

      try {
        // Upload data to save
        const nftData = {
          name: nftName,
          description: nftDescription,
          price: parseFloat(nftPrice),
          imageUrl: nftImageUrl,
          owner: userData.name,
          nftId: nftId,
          category:collectionCategory,
          views: 0,
          favorites: 0,
        };

        // Check if creating a new collection or adding to an existing one
        const isNewCollection = document.querySelector('input[name="collection-type"]:checked').value === "new";
        if (isNewCollection) {
          const collectionName = document.getElementById("collection-name").value;
          const collectionDescription = document.getElementById("collection-description").value;
          const collectionCategory = document.getElementById("collection-category").value;
          const collectionImageUrl = document.getElementById("cover-imageUrl").value;
          const collectionChain = document.getElementById("collection-chain").value;
          const collectionID = document.getElementById("collection-id").value;
          if (!collectionName || !collectionDescription || !collectionChain) {
            alert("Please provide all collection details.");
            return;
          }
          const date= new Date();
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDate();

          const newCollectionData = {
            metadata: {
              name: collectionName,
              description: collectionDescription,
              chain: collectionChain,
              imageUrl: collectionImageUrl,
              createdDate:`${day}-${month}-${year}`,
              floor:parseFloat(nftPrice),
              totalItems:1,
              totalVolume:parseFloat(nftPrice),
            },
            nfts: [nftData],
          };

          await set(ref(db, `All-nfts/${collectionCategory}-NFTs/${collectionID}`), newCollectionData);
          alert("New collection created and NFT uploaded successfully!");
        } else {
          const collectionCategory = document.getElementById("existingCollection-category").value;
          const collectionID = document.getElementById("existingCollection-id").value;
          const path = `All-nfts/${collectionCategory}-NFTs/${collectionID}`;

          try {
              const collectionRef = ref(db ,path);
              
              // Fetch the existing collection metadata
              const snapshot = await get(collectionRef);
              if (!snapshot.exists()) {
                throw new Error("Collection not found.");
              }
          
              const collectionData = snapshot.val();
              const metadata = collectionData.metadata;
          
              // Update the collection metadata
              const updatedTotalItems = metadata.totalItems + 1; 
              const price = parseFloat(nftPrice);
              const floor = parseFloat(metadata.floor.split(' ')[0]);
              const totalVolume = parseFloat(metadata.totalVolume.split(' ')[0]);
              const updatedTotalVolume = totalVolume + price;
              const updatedFloor = Math.min(floor, nftPrice);
          
              // Update the collection in the database
              const updatedMetadata = {
                ...collectionData.metadata,
                floor: `${updatedFloor} ETH`,
                totalItems: updatedTotalItems,
                totalVolume: `${updatedTotalVolume} ETH`,
              };
          
              const nftRef = push(ref(db, `All-nfts/${collectionCategory}-NFTs/${collectionID}/nfts`));
              set(nftRef,nftData);
              const updates = {};
              updates["metadata"] = updatedMetadata;

              update(collectionRef, updates)
              .then(() => {
                console.log("NFT successfully added to collection.");
                alert("NFT successfully added to the collection!");
              });
             } catch (error) {
              console.error("Error adding NFT to existing collection:", error);
              alert("Failed to add NFT to the collection. Please try again.");
            }
          };
      } catch (error) {
        console.error("Error uploading NFT:", error);
        alert("Failed to upload NFT. Please try again.");
      }
    };

    // Attach the function to the button
    document.getElementById("upload-button").addEventListener("click", uploadNFT);
  } else {
    console.error("User not authenticated. Writing to the database is restricted.");
    alert("Please log in to upload NFTs.");
  }
});
