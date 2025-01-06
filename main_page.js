function scrolll() {
    var left = document.querySelector(".scroll-images");
    left.scrollBy(350, 0)
}
function scrollr() {
    var right = document.querySelector(".scroll-images");
    right.scrollBy(-350, 0)
}

function TCscrolll() {
    var left = document.querySelector(".top-collections");
    left.scrollBy(350, 0)
}
function TCscrollr() {
    var right = document.querySelector(".top-collections");
    right.scrollBy(-350, 0)
}

function TAscrolll() {
    var left = document.querySelector(".trending-art");
    left.scrollBy(350, 0)
}
function TAscrollr() {
    var right = document.querySelector(".trending-art");
    right.scrollBy(-350, 0)
}

function TGscrolll() {
    var left = document.querySelector(".trending-gaming");
    left.scrollBy(350, 0)
}
function TGscrollr() {
    var right = document.querySelector(".trending-gaming");
    right.scrollBy(-350, 0)
}

function TPFscrolll() {
    var left = document.querySelector(".trending-pfps");
    left.scrollBy(350, 0)
}
function TPFscrollr() {
    var right = document.querySelector(".trending-pfps");
    right.scrollBy(-350, 0)
}

function TPscrolll() {
    var left = document.querySelector(".trending-photography");
    left.scrollBy(350, 0)
}
function TPscrollr() {
    var right = document.querySelector(".trending-photography");
    right.scrollBy(-350, 0)
}

function TMscrolll() {
    var left = document.querySelector(".trending-music");
    left.scrollBy(350, 0)
}
function TMscrollr() {
    var right = document.querySelector(".trending-music");
    right.scrollBy(-350, 0)
}

const button = document.getElementById("wallet");
button.addEventListener("click", ()=>{
    connectMetaMask();
});

async function connectMetaMask() {
    if (window.ethereum) {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts[0]);
            button.textContent = "Wallet Connected";
        } catch (error) {
            console.error('User rejected the request.');
        }
    } else {
        alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
}

function redirectToResultsPage(event) {
    if (event.key === "Enter") {
        const query = document.getElementById("search").value.trim();
        console.log(query);
        if (query) {
            window.location.href = `resultPage.html?query=${encodeURIComponent(query)}`;
        }
    }
}

function displayAllCollections() {
    window.location.href = `resultPage.html?query=allCollections` ;
}
function displayAllNFTs() {
    window.location.href = `resultPage.html?query=allNFTs` ;
}