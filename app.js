/* ==========================================
   NovaCart — Application Logic
   ========================================== */

const CART_STORAGE_KEY = "novacart-items";

/* ---------- Cart Helpers ---------- */

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatINR(value) {
  return `\u20b9${value.toLocaleString("en-IN")}`;
}

/* ---------- Toast Notifications ---------- */

function showToast(message, icon = "🛒") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast-icon">${icon}</span>${message}`;
  container.appendChild(toast);

  // Remove after animation completes
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ---------- Cart Summary ---------- */

function refreshCartSummary() {
  const cart = getCart();
  const count = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");

  if (countEl) countEl.textContent = String(count);
  if (totalEl) totalEl.textContent = formatINR(total);

  // Animate cart count on change
  if (countEl && count > 0) {
    countEl.style.transform = "scale(1.3)";
    setTimeout(() => {
      countEl.style.transform = "scale(1)";
    }, 200);
  }
}

/* ---------- Add / Clear ---------- */

function addToCart(name, price) {
  const cart = getCart();
  cart.push({ name, price, addedAt: Date.now() });
  saveCart(cart);
  refreshCartSummary();
  showToast(`${name} added to cart`, "✅");
}

function clearCart() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Cart is already empty", "ℹ️");
    return;
  }
  saveCart([]);
  refreshCartSummary();
  showToast("Cart cleared", "🗑️");
}

/* ---------- Product Search ---------- */

function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll(".card");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    cards.forEach((card) => {
      const name = (card.dataset.name || "").toLowerCase();
      const category = (card.dataset.category || "").toLowerCase();
      const match = !query || name.includes(query) || category.includes(query);

      card.style.display = match ? "" : "none";

      // Re-trigger animation
      if (match) {
        card.style.animation = "none";
        card.offsetHeight; // force reflow
        card.style.animation = "";
      }
    });
  });
}

/* ---------- Category Chips ---------- */

function initChips() {
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".card");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      // Update active state
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const category = chip.dataset.category;

      cards.forEach((card) => {
        const match = category === "all" || card.dataset.category === category;
        card.style.display = match ? "" : "none";

        if (match) {
          card.style.animation = "none";
          card.offsetHeight;
          card.style.animation = "";
        }
      });
    });
  });
}

/* ---------- Network Status ---------- */

function updateNetworkStatus() {
  const statusEl = document.getElementById("status");
  if (!statusEl) return;

  const online = navigator.onLine;
  statusEl.textContent = online ? "● Online" : "● Offline";
  statusEl.classList.toggle("online", online);
  statusEl.classList.toggle("offline", !online);
}

/* ---------- Install Prompt ---------- */

let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  const btn = document.getElementById("installBtn");
  if (btn) btn.hidden = false;
});

function initInstall() {
  const btn = document.getElementById("installBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    btn.hidden = true;

    if (outcome === "accepted") {
      showToast("App installed successfully!", "🎉");
    }
  });
}

/* ---------- Service Worker ---------- */

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    });
  }
}

/* ---------- Add-to-Cart Buttons ---------- */

function initAddButtons() {
  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.currentTarget.closest(".card");
      if (!card) return;

      const name = card.dataset.name;
      const price = Number(card.dataset.price);
      addToCart(name, price);

      // Button feedback animation
      const btn = event.currentTarget;
      btn.textContent = "✓ Added!";
      btn.style.background = "#059669";
      btn.style.boxShadow = "0 2px 8px rgba(5, 150, 105, 0.3)";

      setTimeout(() => {
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add to Cart
        `;
        btn.style.background = "";
        btn.style.boxShadow = "";
      }, 1200);
    });
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  // Core functionality
  refreshCartSummary();
  updateNetworkStatus();
  initAddButtons();
  initSearch();
  initChips();
  initInstall();
  registerServiceWorker();

  // Clear cart
  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearCart);
  }

  // Network events
  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);
});