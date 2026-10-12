// Service worker: makes the app installable and lets it open offline.
// Network first, so a fresh deploy shows up straight away; the cache is only the fallback.
// Bump VERSION if the file list below changes.
const VERSION = "v1";
const FILES = [
  "./", "index.html", "style.css", "manifest.json",
  "connection.js", "robot.js", "controls.js", "info.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon.svg",
];
// Bluetooth library from espruino.com. Fetched no-cors (like the page's <script> tag), and a failure doesn't block install.
const UART_JS = "https://www.espruino.com/js/uart.js";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => Promise.all([
      c.addAll(FILES),
      fetch(UART_JS, { mode: "no-cors" }).then(res => c.put(UART_JS, res)).catch(() => {}),
    ]))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request)
    .then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
