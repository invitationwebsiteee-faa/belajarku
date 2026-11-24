/* ============================================================
   SERVICE WORKER — supaya aplikasi bisa dibuka tanpa internet
   Kalau file website diubah, naikkan angka VERSI di bawah
   (misalnya v18 → v19) supaya semua HP mengambil versi terbaru.

   Cara kerja:
   - File website (HTML, JS, CSS): selalu ambil yang TERBARU dari internet.
     Simpanan hanya dipakai kalau sedang tidak ada internet.
   - Font & pembaca PDF: pakai simpanan (jarang berubah).
   ============================================================ */
const VERSI = "belajar-pribadi-v6";

const FILE_UTAMA = [
  "./template-belajar-ujian.html",
  "./belajar-ujian.css",
  "./belajar-ujian.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png"
];

// Simpan file utama saat aplikasi dipasang/diperbarui (ambil langsung dari server, bukan simpanan browser)
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(FILE_UTAMA.map((u) => new Request(u, { cache: "reload" })))));
  self.skipWaiting();
});

// Hapus simpanan versi lama
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSI).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Materi Bersama (Google Sheets) selalu lewat internet, tidak disimpan
  if (url.hostname.endsWith("script.google.com") || url.hostname.endsWith("googleusercontent.com")) return;

  // File website sendiri: internet dulu, simpanan hanya kalau offline
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(VERSI);
      try {
        const res = await fetch(new Request(req, { cache: "no-cache" }));
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        const simpanan = await cache.match(req, { ignoreSearch: true });
        if (simpanan) return simpanan;
        if (req.mode === "navigate") return cache.match("./template-belajar-ujian.html");
        return new Response("", { status: 504, statusText: "Offline" });
      }
    })());
    return;
  }

  // Font & pembaca PDF/PowerPoint: simpanan dulu
  const bolehSimpan = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com" ||
    url.hostname === "cdnjs.cloudflare.com";
  if (!bolehSimpan) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSI);
    const simpanan = await cache.match(req);
    if (simpanan) return simpanan;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return new Response("", { status: 504, statusText: "Offline" });
    }
  })());
});
