// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get, push, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const auth = getAuth()

function getNFTNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name");
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        (async () => {
            const userFavoritesRef = ref(db, `UserFavorites/${userId}`);
            try {
                const snapshot = await get(userFavoritesRef);
                const userFavorites = snapshot.exists() ? snapshot.val() || [] : [];
                const isFavorited = userFavorites.includes(nftName);
                const nonFavoriteIcon = document.getElementById("non-favorites");
                const favoriteIcon = document.getElementById("favorites");

                if (nonFavoriteIcon && favoriteIcon) {
                    if (isFavorited) {
                        nonFavoriteIcon.style.display = "none";
                        favoriteIcon.style.display = "block";
                    } else {
                        nonFavoriteIcon.style.display = "block";
                        favoriteIcon.style.display = "none";
                    }
                } else {
                    console.error("Favorite icons not found in the DOM.");
                }
            } catch (error) {
                console.error("Error loading user favorites:", error);
            }
        })();
    } else {
        console.log("User is not signed in.");
    }
});


function populateNFTdetails(nftName) {
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
                        console.log(nft);
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
    document.getElementById("nft-id").innerHTML = `<strong>ID</strong>: ${nft.unique_id}`;
    document.getElementById("nft-owner").innerHTML = `<strong>Owner</strong>: ${nft.owner}`;
    document.getElementById("nft-category").innerHTML = `<strong>Category</strong>: ${nft.category}`;
    document.getElementById("nft-description").innerHTML = `<strong>Description</strong>: ${nft.description}`;
    document.getElementById("nft-price").innerHTML = `<strong>Price</strong>: ${nft.price} ETH`;
    document.getElementById("nft-views").innerHTML = `<strong>Views</strong>: ${nft.views} `;
    document.getElementById("nft-favorite").innerHTML = `<strong>Favorite</strong>: ${nft.favorites} `;
    const image = document.getElementById("nft-image");
    image.src = nft.imageUrl;
}

const nftName = getNFTNameFromURL();
populateNFTdetails(nftName);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;

        async function updateOwner(nftId) {
            try {
                const dbRef = ref(db, "All-nfts");
                const snapshot = await get(dbRef);

                if (snapshot.exists()) {
                    const userRef = ref(db, `users/${userId}`);
                    const userSnapshot = await get(userRef);
                    const userInfo = userSnapshot.val();
                    const newOwner = userInfo.name;

                    const nftData = snapshot.val();
                    for (const category in nftData) {
                        const collections = nftData[category];
                        for (const collectionKey in collections) {
                            const collection = collections[collectionKey];
                            if (collection.nfts && Array.isArray(collection.nfts)) {
                                const nftIndex = collection.nfts.findIndex(
                                    (nft) => nft.unique_id == nftId
                                );
                                if (nftIndex !== -1) {
                                    const nftRef = ref(
                                        db,
                                        `All-nfts/${category}/${collectionKey}/nfts/${nftIndex}/owner`
                                    );
                                    await set(nftRef, newOwner);
                                    console.log(`Owner of NFT ${nftId} updated to ${newOwner}`);
                                    return;
                                }
                            }
                        }
                    }
                    console.error("NFT not found for updating owner.");
                } else {
                    console.error("No data found in the database.");
                }
            } catch (error) {
                console.error("Error updating NFT owner:", error);
            }
        }

        //Simulate transactions using metamask
        async function simulateTransactionWithMetaMask(sender, receiver, nftId) {
            const transactionMessage = `Simulated Transaction:
    - NFT ID: ${nftId}
    - From: ${sender}
    - To: ${receiver}`;

            try {
                // Request MetaMask to sign the transaction message
                const signedMessage = await window.ethereum.request({
                    method: "personal_sign",
                    params: [transactionMessage, sender],
                });

                // Log the transaction in Firebase
                const transactionRef = ref(db, "transactions");
                const timestamp = new Date().toISOString();
                const newTransaction = {
                    sender,
                    receiver,
                    nftId,
                    timestamp,
                    status: "Simulated",
                    signedMessage,
                };

                await push(transactionRef, newTransaction);
                updateOwner(nftId);
                alert("Transaction simulated successfully!");

            } catch (error) {
                console.error("Error simulating transaction:", error);
                alert("Transaction simulation failed.");
            }
        }

        // MetaMask Wallet Connection
        async function getMetaMaskWallet() {
            if (typeof window.ethereum !== "undefined") {
                try {
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                    return accounts[0]; // Return the first wallet address
                } catch (error) {
                    console.error("MetaMask connection failed:", error);
                    alert("Failed to connect to MetaMask.");
                    return null;
                }
            } else {
                alert("MetaMask is not installed.");
                return null;
            }
        }
        document.getElementById("buy").addEventListener("click", async () => {
            const nftId = document.getElementById("nft-id").textContent.replace("ID: ", "").trim();
            const receiverAddress = "0x3c12b5875d40991349F4E5f4FEa945a9CC556336";
            if (!nftId) {
                alert("NFT ID not found.");
                return;
            }

            // Get sender wallet address from MetaMask
            const senderAddress = await getMetaMaskWallet();
            if (!senderAddress) {
                alert("Sender wallet address not found.");
                return;
            }

            // Simulate the transaction
            await simulateTransactionWithMetaMask(senderAddress, receiverAddress, nftId);
        });

        //Favorite NFTs  
        async function findNFTRef(nftName) {
            const dbRef = ref(db, "All-nfts");
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                const nftData = snapshot.val();
                for (const category in nftData) {
                    const collections = nftData[category];
                    for (const collectionKey in collections) {
                        const collection = collections[collectionKey];
                        if (collection.nfts && Array.isArray(collection.nfts)) {
                            const nftIndex = collection.nfts.findIndex((nft) => nft.name === nftName);
                            if (nftIndex !== -1) {
                                return {
                                    nftRef: ref(db, `All-nfts/${category}/${collectionKey}/nfts/${nftIndex}`),
                                    nft: collection.nfts[nftIndex],
                                };
                            }
                        }
                    }
                }
            }
            throw new Error(`NFT with name "${nftName}" not found.`);
        }

        // Favorite Handler
        async function handleFavorite(userId, nftName, isAdding) {
            const userFavoritesRef = ref(db, `UserFavorites/${userId}`);
            try {
                const {nftRef,nft} = await findNFTRef(nftName);

                // Update the user's favorites list
                const userFavoritesSnapshot = await get(userFavoritesRef);
                let userFavorites = userFavoritesSnapshot.exists() ? userFavoritesSnapshot.val() : [];

                if (isAdding && !userFavorites.includes(nftName)) {
                    userFavorites.push(nftName);
                    await set(nftRef,{...nft, favorites: (nft.favorites || 0)+1});
                    console.log("Count updated successfully");    
                } else if (!isAdding && userFavorites.includes(nftName)) {
                    userFavorites = userFavorites.filter((name) => name !== nftName);
                    await set(nftRef,{...nft, favorites: Math.max((nft.favorites || 0) -1 || 0)});
                    console.log("Count updated successfully");    
                }

                await set(userFavoritesRef, userFavorites);

                // Update the UI
                document.getElementById("non-favorites").style.display = isAdding ? "none" : "block";
                document.getElementById("favorites").style.display = isAdding ? "block" : "none";
                console.log(`${isAdding ? "Added to" : "Removed from"} favorites successfully.`);
            } catch (error) {
                console.error("Error updating favorites:", error);
            }
        }

        // Event Listeners for Favorites
        document.getElementById("non-favorites").addEventListener("click", async () => {
            if (!userId) return alert("Please log in to favorite NFTs.");
            await handleFavorite(userId, nftName, true);
        });

        document.getElementById("favorites").addEventListener("click", async () => {
            if (!userId) return alert("Please log in to unfavorite NFTs.");
            await handleFavorite(userId, nftName, false);
        });


        // Update Views every time someone visits the page
        async function updateViewCount(nftName) {
            try {
                const dbRef = ref(db, "All-nfts");
                const snapshot = await get(dbRef);

                if (snapshot.exists()) {
                    const nftData = snapshot.val();
                    for (const category in nftData) {
                        const collections = nftData[category];
                        for (const collectionKey in collections) {
                            const collection = collections[collectionKey];
                            if (collection.nfts && Array.isArray(collection.nfts)) {
                                const nftIndex = collection.nfts.findIndex(
                                    (nft) => nft.name === nftName
                                );
                                if (nftIndex !== -1) {
                                    console.log("Found NFT:", collection.nfts[nftIndex]);
                                    const nftRef = ref(
                                        db,
                                        `All-nfts/${category}/${collectionKey}/nfts/${nftIndex}/views`
                                    );
                                    const viewSnapshot = await get(nftRef);
                                    let currentViews = viewSnapshot.exists() ? viewSnapshot.val() : 0;
                                    const newViewCount = currentViews + 1;
                                    await set(nftRef, newViewCount);
                                    console.log(`View count for NFT ${nftName} updated to ${newViewCount}`);
                                    return;
                                }
                            }
                        }
                    }
                    console.error("NFT not found for updating view count.");
                } else {
                    console.error("No data found in the database.");
                }
            } catch (error) {
                console.error("Error updating NFT view count:", error);
            }
        }

        updateViewCount(nftName);
    } else {
        console.error("User not authenticated. Writing to the database is restricted.");
        alert("Please log in to buy NFTs.");
    }
});