const STORAGE_KEY = "momentum_items";
const THEME_KEY = "momentum_theme";

const statusEl = document.getElementById("status");
const inputEl = document.getElementById("dataInput");
const saveBtn = document.getElementById("saveBtn");
const savedList = document.getElementById("savedList");
const feedbackEl = document.getElementById("feedback");
const clearBtn = document.getElementById("clearBtn");
const themeToggle = document.getElementById("themeToggle");

// Register service worker for offline support.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((error) => console.error("Service Worker registration failed", error));
}

function getItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function setItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function updateStatus() {
  const online = navigator.onLine;
  statusEl.textContent = online ? "Online" : "Offline";
  statusEl.classList.toggle("offline", !online);
}

function renderList() {
  const items = getItems();
  savedList.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No saved items yet.";
    savedList.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    savedList.appendChild(li);
  });
}

function saveData() {
  const value = inputEl.value.trim();

  if (!value) {
    feedbackEl.textContent = "Type something before saving.";
    inputEl.focus();
    return;
  }

  const items = getItems();
  items.unshift(value);
  setItems(items.slice(0, 8));
  renderList();
  inputEl.value = "";
  feedbackEl.textContent = navigator.onLine
    ? "Saved successfully."
    : "Saved locally while offline.";
}

function clearAll() {
  setItems([]);
  renderList();
  feedbackEl.textContent = "All saved items cleared.";
}

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
}

window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
saveBtn.addEventListener("click", saveData);
clearBtn.addEventListener("click", clearAll);
themeToggle.addEventListener("click", toggleTheme);
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveData();
  }
});

const preferredTheme = localStorage.getItem(THEME_KEY) || "light";
applyTheme(preferredTheme);
updateStatus();
renderList();