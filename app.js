const CART_STORAGE_KEY = "novacart-items";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatINR(value) {
  return `\u20b9${value.toLocaleString("en-IN")}`;
}

function refreshCartSummary() {
  const cart = getCart();
  const count = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  document.getElementById("cartCount").textContent = String(count);
  document.getElementById("cartTotal").textContent = formatINR(total);
}

function addToCart(name, price) {
  const cart = getCart();
  cart.push({ name, price, addedAt: Date.now() });
  saveCart(cart);
  refreshCartSummary();
  alert(`${name} added to cart`);
}

function clearCart() {
  saveCart([]);
  refreshCartSummary();
}

function updateNetworkStatus() {
  const statusEl = document.getElementById("status");
  const online = navigator.onLine;
  statusEl.textContent = online ? "Online" : "Offline";
  statusEl.classList.toggle("online", online);
  statusEl.classList.toggle("offline", !online);
}

document.querySelectorAll(".add-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = event.currentTarget.closest(".card");
    addToCart(card.dataset.name, Number(card.dataset.price));
  });
});

document.getElementById("clearCartBtn").addEventListener("click", clearCart);
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);

let deferredInstallPrompt;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  document.getElementById("installBtn").hidden = false;
});

document.getElementById("installBtn").addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  document.getElementById("installBtn").hidden = true;
});

refreshCartSummary();
updateNetworkStatus();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}