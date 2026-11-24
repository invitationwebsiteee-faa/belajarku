/* ============================================================
   SCRIPT BELAJAR UJIAN (versi pribadi, tanpa fitur berbagi)
   Dipakai oleh template-belajar-ujian.html
   ============================================================ */

/* ============================================================
   ⚙️ PENGATURAN (diisi admin)
   ============================================================ */

// Tempel "Web app URL" dari Google Apps Script (lihat Code.gs).
// Kalau dikosongkan "", fitur Materi Bersama & Soal dari Teman disembunyikan.
const API_URL = "";   // versi pribadi: fitur berbagi (Materi Bersama, Bagikan, soal teman) dimatikan

// Daftar jurusan di menu "Bagikan" dan filter "Materi Bersama".
const JURUSAN = [
  "Administrasi Bisnis",
  "Administrasi Negara",
  "Ilmu Komunikasi",
  "Ilmu Hukum",
  "Ilmu Perpustakaan",
  "Sosiologi",
  "Manajemen",
  "Akuntansi",
  "Ekonomi Pembangunan",
  "Pariwisata",
  "Sistem Informasi",
  "PGSD",
  "PG PAUD",
  "Sastra Inggris"
];

/* ============================================================
   CONTOH SUSUNAN CATATAN (cara "Tempel catatan")
   ============================================================ */
const CONTOH_SEDERHANA = `MATA KULIAH: Pengantar Ilmu Administrasi
MODUL 1: Konsep Dasar Administrasi

Administrasi adalah proses kerja sama sekelompok orang untuk mencapai tujuan yang telah ditetapkan.

Administrasi dalam arti sempit sering disamakan dengan ketatausahaan, yaitu kegiatan mencatat dan menyimpan surat.
- Unsur administrasi: sekelompok orang, kerja sama, dan tujuan bersama.`;

const CONTOH_SUSUNAN = `MATA KULIAH: Pengantar Ilmu Ekonomi
KODE: FSAB4102
TANGGAL UJIAN: 6 Desember 2026 pukul 07.30

MODUL 1: Konsep Dasar Ilmu Ekonomi
RINGKASAN:
## Pengertian
Ilmu ekonomi mempelajari cara manusia memakai **sumber daya yang terbatas** untuk memenuhi kebutuhan yang *tidak terbatas*.
POIN PENTING:
- Masalah pokok ekonomi adalah kelangkaan.
- Setiap pilihan punya biaya peluang.
ISTILAH:
- Kelangkaan: sumber daya terbatas dibanding kebutuhan.
- Biaya peluang: pilihan terbaik yang dikorbankan.
SOAL:
1. Masalah pokok dalam ilmu ekonomi adalah...
A. Inflasi
B. Kelangkaan
C. Pajak
D. Pengangguran
JAWABAN: B
PEMBAHASAN: Kebutuhan tidak terbatas, sumber daya terbatas.
ESAI:
1. Jelaskan apa itu biaya peluang!
JAWABAN: Nilai pilihan terbaik yang dikorbankan saat memilih.`;

/* ============================================================
   CONTOH MATERI (untuk tombol "Coba pakai contoh")
   ============================================================ */
const CONTOH = {
  mataKuliah: "Contoh: Pengantar Ilmu Ekonomi",
  kode: "CONTOH",
  info: "Materi contoh · hapus kalau sudah tidak dipakai",
  tanggalUjian: "",
  catatan: "Baca ringkasan dulu, hafalkan istilah dengan kartu hafalan, lalu latihan soal.",
  modul: [
    {
      nomor: 1,
      judul: "Konsep Dasar Ilmu Ekonomi",
      ringkasan: "Ilmu ekonomi mempelajari bagaimana manusia memilih cara menggunakan sumber daya yang terbatas untuk memenuhi kebutuhan yang tidak terbatas.",
      poin: ["Masalah pokok ekonomi adalah kelangkaan.", "Ekonomi dibagi menjadi mikroekonomi dan makroekonomi.", "Setiap pilihan memiliki biaya peluang."],
      istilah: [
        { kata: "Kelangkaan", arti: "Keadaan ketika sumber daya terbatas dibanding kebutuhan manusia." },
        { kata: "Biaya peluang", arti: "Nilai alternatif terbaik yang dikorbankan saat membuat pilihan." }
      ],
      soal: [
        { tanya: "Masalah pokok yang menjadi dasar ilmu ekonomi adalah...", pilihan: ["Inflasi", "Kelangkaan", "Pengangguran", "Pajak"], jawaban: 1, pembahasan: "Kelangkaan muncul karena kebutuhan tidak terbatas sedangkan sumber daya terbatas." },
        { tanya: "Nilai alternatif terbaik yang dikorbankan disebut...", pilihan: ["Biaya tetap", "Biaya variabel", "Biaya peluang", "Biaya marginal"], jawaban: 2, pembahasan: "Biaya peluang adalah pengorbanan dari pilihan terbaik yang tidak diambil." }
      ],
      esai: [{ tanya: "Jelaskan perbedaan mikroekonomi dan makroekonomi beserta contohnya!", jawaban: "Mikroekonomi membahas unit kecil seperti keputusan konsumen, sedangkan makroekonomi membahas perekonomian secara keseluruhan seperti inflasi." }]
    },
    {
      nomor: 2,
      judul: "Permintaan dan Penawaran",
      ringkasan: "Harga di pasar terbentuk dari pertemuan antara permintaan pembeli dan penawaran penjual.",
      poin: ["Hukum permintaan: harga naik, jumlah diminta turun.", "Hukum penawaran: harga naik, jumlah ditawarkan naik.", "Keseimbangan terjadi saat jumlah diminta = jumlah ditawarkan."],
      istilah: [{ kata: "Ceteris paribus", arti: "Asumsi bahwa faktor lain dianggap tetap." }],
      soal: [{ tanya: "Menurut hukum permintaan, jika harga naik maka...", pilihan: ["Jumlah diminta naik", "Jumlah diminta turun", "Jumlah diminta tetap", "Penawaran turun"], jawaban: 1, pembahasan: "Hubungan harga dan jumlah diminta berbanding terbalik." }],
      esai: [{ tanya: "Apa yang terjadi pada harga jika permintaan naik sementara penawaran tetap?", jawaban: "Harga keseimbangan akan naik karena barang yang diminta lebih banyak dari yang tersedia." }]
    }
  ]
};

/* ============================================================
   PENYIMPANAN DI HP/LAPTOP (localStorage)
   ============================================================ */
const LIB_KEY = "demuse-belajar-library-v1";
const NAMA_KEY = "demuse-belajar-nama";
const JURUSAN_KEY = "demuse-belajar-jurusan";
const LAPOR_KEY = "demuse-belajar-dilaporkan";
const memoryFallback = {};
function readStore(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch (e) { return memoryFallback[key] ?? fallback; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { memoryFallback[key] = value; return false; }
}
let library = readStore(LIB_KEY, { active: null, subjects: {} });
if (!library || typeof library !== "object" || !library.subjects) library = { active: null, subjects: {} };
const saveLibrary = () => {
  if (!writeStore(LIB_KEY, library)) toast("⚠️ Materi tidak bisa tersimpan otomatis. Tekan \"Simpan ke file\" supaya tidak hilang.");
};
const current = () => library.subjects[library.active] || null;
const progressKey = () => "demuse-belajar-progress-" + library.active;

/* ============================================================
   HELPER
   ============================================================ */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const slug = (s) => String(s ?? "").toLowerCase().normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "materi";
const courseKey = (d) => slug(d.kode || d.mataKuliah);
const hasApi = () => /^https:\/\//.test(API_URL.trim());
const fmtTanggal = (iso) => { const t = new Date(iso); return isNaN(t) ? "" : t.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); };
let toastTimer;
function toast(text) {
  const t = $("toast"); t.textContent = text; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}
function showMsg(id, text, type = "err") {
  const m = $(id);
  m.textContent = text; m.className = "msg " + type;
  m.classList.toggle("hidden", !text);
}

/* ============================================================
   HUBUNGAN KE GOOGLE SHEETS
   ============================================================ */
const PESAN_OFFLINE = "Tidak bisa terhubung. Periksa internet, lalu coba lagi.";
async function apiGet(params) {
  const res = await fetch(API_URL.trim() + "?" + new URLSearchParams(params));
  const data = await res.json();
  if (!data.ok) throw new Error(data.pesan || "Terjadi kesalahan.");
  return data;
}
async function apiPost(body) {
  const res = await fetch(API_URL.trim(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // supaya tidak diblokir CORS
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.pesan || "Terjadi kesalahan.");
  return data;
}
const errText = (err) => (err instanceof TypeError || /JSON|Unexpected/.test(String(err.message)) ? PESAN_OFFLINE : err.message);

/* ============================================================
   MODAL (jendela pop-up)
   ============================================================ */
// Tombol back HP/browser: menutup jendela pop-up dulu, lalu kembali ke Beranda, baru keluar.
const modalStack = [];
let abaikanPop = 0;
const adaRiwayat = () => !!(window.history && history.pushState);
function sembunyikanModal(id) {
  $(id).classList.add("hidden");
  const i = modalStack.lastIndexOf(id); if (i >= 0) modalStack.splice(i, 1);
  if (!modalStack.length) document.body.style.overflow = "";
}
function openModal(id) {
  if (!$(id).classList.contains("hidden") && modalStack.includes(id)) return;
  $(id).classList.remove("hidden");
  modalStack.push(id);
  document.body.style.overflow = "hidden";
  if (adaRiwayat() && !(history.state && history.state.modal)) history.pushState({ ...(history.state || {}), modal: true }, "");
}
function closeModal(id) {
  if (id === "importModal" && typeof simpanDrafSekarang === "function") simpanDrafSekarang();
  sembunyikanModal(id);
  // tunggu sebentar: kadang jendela berikutnya langsung dibuka (misalnya "Simpan ke mana?")
  setTimeout(() => {
    if (!modalStack.length && adaRiwayat() && history.state && history.state.modal) { abaikanPop++; history.back(); }
  }, 60);
}
document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => closeModal(b.dataset.close)));
// Jendela tempat mengetik (materi, soal, bagikan) hanya ditutup lewat tombol, tidak lewat klik di luar
// atau tombol Esc, supaya tidak tertutup tanpa sengaja saat memblok tulisan.
const MODAL_ISIAN = new Set(["importModal", "soalModal", "shareModal", "editMkModal", "stikerModal", "hurufModal"]);
let tekanDiLatar = null;
document.querySelectorAll(".modal").forEach((m) => {
  m.addEventListener("mousedown", (e) => { tekanDiLatar = e.target === m ? m : null; });
  m.addEventListener("click", (e) => {
    const benarDiLatar = e.target === m && tekanDiLatar === m;   // klik harus mulai DAN selesai di latar gelap
    tekanDiLatar = null;
    if (benarDiLatar && !MODAL_ISIAN.has(m.id)) closeModal(m.id);
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const atas = modalStack[modalStack.length - 1];
  if (atas && !MODAL_ISIAN.has(atas)) closeModal(atas);
});
// tombol "← Kembali" di setiap jendela pop-up
document.querySelectorAll(".modal .modal-box").forEach((box) => {
  const id = box.parentElement.id;
  const b = document.createElement("button");
  b.type = "button"; b.className = "modal-back"; b.innerHTML = "← Kembali";
  b.addEventListener("click", () => closeModal(id));
  box.insertBefore(b, box.firstChild);
});
window.addEventListener("popstate", () => {
  if (abaikanPop) { abaikanPop--; return; }
  if (modalStack.length) {
    const atas = modalStack[modalStack.length - 1];
    if (MODAL_ISIAN.has(atas)) {          // sedang mengisi: jangan ditutup, cukup beri tahu
      history.pushState({ ...(history.state || {}), modal: true }, "");
      toast("Tekan Batal atau ← Kembali kalau ingin menutup. Isian kalian tetap tersimpan.");
      return;
    }
    sembunyikanModal(atas);
    if (modalStack.length) history.pushState({ ...(history.state || {}), modal: true }, "");
    return;
  }
  if (tampilan === "materi") tampilkanBeranda(false);
});

/* ============================================================
   MEMBACA & MERAPIKAN MATERI DARI CATATAN / FILE
   ============================================================ */
function extractJSON(raw) {
  let t = String(raw).trim().replace(/^﻿/, "");
  t = t.replace(/```[a-zA-Z]*\s*/g, "").replace(/```/g, "");
  const start = t.search(/[\[{]/);
  const end = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (start === -1 || end <= start) throw new Error("Isi file belum lengkap. Coba minta teman mengirim ulang file-nya.");
  t = t.slice(start, end + 1);
  try { return JSON.parse(t); } catch (e) { /* coba perbaiki di bawah */ }
  const repaired = t
    .replace(/^\s*\/\/.*$/gm, "")                          // komentar satu baris
    .replace(/[“”]/g, '"')                                  // tanda kutip miring
    .replace(/,\s*([}\]])/g, "$1")                          // koma berlebih
    .replace(/([{,]\s*)([A-Za-z_][\w]*)\s*:/g, '$1"$2":');  // key tanpa tanda kutip
  try { return JSON.parse(repaired); }
  catch (e) { throw new Error("Isi file tidak bisa dibaca. Coba minta teman mengirim ulang file-nya."); }
}

/* ---------- Membaca susunan teks biasa (MATA KULIAH / MODUL / SOAL ...) ---------- */
const BULAN = { jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12 };
const NAMA_BULAN = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const pad = (n) => String(n).padStart(2, "0");

function parseTanggal(raw) {
  const s = String(raw || "").trim().toLowerCase();
  if (!s || /^[-–—]$|tidak|belum|kosong/.test(s)) return "";
  let y, mo, d, rest = s;
  let m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) { [y, mo, d] = [m[1], m[2], m[3]]; rest = s.slice(m.index + m[0].length); }
  else if ((m = s.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/))) { [d, mo, y] = [m[1], m[2], m[3]]; rest = s.slice(m.index + m[0].length); }
  else if ((m = s.match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/)) && BULAN[m[2].slice(0, 3)]) { d = m[1]; mo = BULAN[m[2].slice(0, 3)]; y = m[3]; rest = s.slice(m.index + m[0].length); }
  else return "";
  const t = rest.match(/(\d{1,2})[:.](\d{2})/);
  const out = `${y}-${pad(mo)}-${pad(d)}T${t ? pad(t[1]) + ":" + t[2] : "07:00"}`;
  return isNaN(new Date(out)) ? "" : out;
}
function tulisTanggal(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return m ? `${Number(m[3])} ${NAMA_BULAN[Number(m[2])]} ${m[1]} pukul ${m[4]}.${m[5]}` : "-";
}

function parseSederhana(text) {
  const out = { mataKuliah: "", kode: "", info: "", tanggalUjian: "", catatan: "", modul: [] };
  let mod = null, section = null, q = null, field = null;
  let para = [];   // paragraf teks bebas yang sedang dikumpulkan
  const flushPara = () => {
    if (!para.length || !mod) { para = []; return; }
    const p = para.join(" ").replace(/\s+/g, " ").trim(); para = [];
    if (!p) return;
    if (!mod.ringkasan && !mod.poin.length) mod.ringkasan = p;
    else mod.poin.push(...potongParagraf(p, 700));
  };
  const newModul = (nomor, judul) => { flushPara(); mod = { nomor, judul, subjudul: [], ringkasan: "", poin: [], istilah: [], soal: [], esai: [] }; out.modul.push(mod); section = "ringkasan"; q = null; field = null; };
  const ensureModul = () => { if (!mod) newModul(null, ""); };
  const add = (a, b) => (a ? a + " " + b : b);
  const addLn = (a, b) => (a ? a + "\n" + b : b);       // ringkasan: pertahankan baris & judul
  const BUL = /^([-•–]|\*(?=\s)|\d+[.)])\s+/;            // tanda poin (bukan *miring*)

  const lines = String(text).replace(/\r/g, "").replace(/```[a-zA-Z]*/g, "").split("\n");
  for (let raw of lines) {
    // fmt = baris asli (format **tebal**, *miring*, ## judul tetap ada)
    const fmt = raw.replace(/\s?\[\d+(?:\s*[,\-–]\s*\d+)*\]/g, "") // angka sumber NotebookLM [1]
      .replace(/^\s*>\s*/, "").trim();
    const fl = fmt.replace(/^#+\s*/, "").replace(/^=+\s*|\s*=+$/g, "").trim();
    // line = versi polos, untuk mengenali judul seperti MODUL 1: / RINGKASAN:
    const line = fl.replace(/⟦[^⟦⟧]{0,60}⟧/g, "").replace(/\*\*|__/g, "").trim();
    const hanyaStiker = !line && /⟦s[ft]:/.test(fmt);     // baris yang isinya hanya stiker tetap disimpan
    if (!line && !hanyaStiker) { if (section === "bebas") flushPara(); if (section === "ringkasan" && mod && mod.ringkasan && !mod.ringkasan.endsWith("\n\n")) mod.ringkasan += "\n"; continue; }
    const isBullet = BUL.test(line);
    const two = (re) => fl.match(re) || line.match(re);    // ambil isi dengan format kalau bisa
    let m;

    // Info mata kuliah
    const labelBaru = /^(mata\s*kuliah|kode|tanggal\s*ujian|info|keterangan|catatan|tips)\s*[:：]|^(modul|bab)\s+\d+\s*([:.\-–—)]|$)|^(ringkasan|poin(\s*-?\s*poin)?(\s*penting)?|istilah|kata\s*kunci|(soal\s*|latihan\s*)?esai|(latihan\s*)?soal(\s*pilihan\s*ganda|\s*pg)?)\s*[:：]?/i.test(line);
    if (labelBaru && section === "bebas") flushPara();
    // Keterangan (MATA KULIAH, KODE, ...) hanya dibaca sebelum isi materi dimulai
    const belumAdaIsi = !mod || !(mod.ringkasan || mod.poin.length || mod.istilah.length || mod.soal.length || mod.esai.length);
    if (belumAdaIsi && (m = line.match(/^mata\s*kuliah\s*[:：]\s*(.*)$/i))) { out.mataKuliah = m[1].trim(); continue; }
    if (belumAdaIsi && (m = line.match(/^kode(?:\s*mata\s*kuliah)?\s*[:：]\s*(.*)$/i))) { out.kode = m[1].replace(/^[-–—]$/, "").trim(); continue; }
    if (belumAdaIsi && (m = line.match(/^tanggal\s*ujian\s*[:：]\s*(.*)$/i))) { out.tanggalUjian = parseTanggal(m[1]); continue; }
    if (belumAdaIsi && (m = line.match(/^(?:info|keterangan)\s*[:：]\s*(.*)$/i))) { out.info = m[1].trim(); continue; }
    if (belumAdaIsi && (m = line.match(/^(?:catatan|tips)\s*[:：]\s*(.*)$/i))) { if (!out.catatan) out.catatan = m[1].trim(); continue; }

    // Sub-judul modul: "SUB-JUDUL: Kegiatan Belajar 1"
    if (mod && (m = line.match(/^sub[\s-]*judul\s*[:：]\s*(.+)$/i))) { flushPara(); if (mod.subjudul.length < 3) mod.subjudul.push(m[1].trim()); continue; }

    // Judul modul: "MODUL 1: Judul" atau "BAB 2 - Judul"
    if (!isBullet && (m = line.match(/^(?:modul|bab)\s+(\d+)\s*(?:[:.\-–—)]\s*(.*)|$)/i))) { newModul(Number(m[1]), (m[2] || "").trim()); continue; }

    // Judul bagian
    // Judul bagian hanya dikenali kalau pakai titik dua (SOAL:) atau HURUF BESAR semua (SOAL),
    // supaya kalimat biasa seperti "Soal ini membahas..." tetap jadi isi materi
    const judulBagian = (re) => re.test(line) && (/[:：]/.test(line) || line === line.toUpperCase());
    if ((m = two(/^ringkasan\s*[:：]\s*(.*)$/i)) || line === "RINGKASAN") { ensureModul(); section = "ringkasan"; if (m && m[1].trim()) mod.ringkasan = addLn(mod.ringkasan, m[1].trim()); continue; }
    if (judulBagian(/^poin(\s*-?\s*poin)?(\s*penting)?\s*[:：]?$/i)) { ensureModul(); section = "poin"; continue; }
    if (judulBagian(/^(istilah|kata\s*kunci)(\s*penting)?\s*[:：]?$/i)) { ensureModul(); section = "istilah"; continue; }
    if (judulBagian(/^(soal\s*|latihan\s*)?esai\s*[:：]?$/i)) { ensureModul(); section = "esai"; q = null; continue; }
    if (judulBagian(/^(latihan\s*)?soal(\s*pilihan\s*ganda|\s*pg)?\s*[:：]?$/i)) { ensureModul(); section = "soal"; q = null; continue; }
    if (!section) { ensureModul(); section = "ringkasan"; }

    // Teks bebas: paragraf pertama = ringkasan, sisanya poin penting; judul (##) & poin (-) tetap
    if (section === "bebas") {
      if (/^#{1,3}\s/.test(fmt)) { flushPara(); mod.poin.push(fmt); continue; }
      if (BUL.test(fl)) { flushPara(); mod.poin.push(fmt.replace(BUL, "")); continue; }
      para.push(fmt);
      continue;
    }

    if (section === "ringkasan") { mod.ringkasan = addLn(mod.ringkasan, fmt); continue; }
    if (section === "poin") { mod.poin.push(fmt.replace(BUL, "")); continue; }
    if (section === "istilah") {
      const t = line.replace(BUL, "");
      const sp = t.match(/^(.+?)\s*(?:[:：=]|\s[-–—]\s)\s*(.+)$/);
      if (sp) mod.istilah.push({ kata: sp[1].trim(), arti: sp[2].trim() });
      else mod.ringkasan = addLn(mod.ringkasan, fmt);          // jangan dibuang
      continue;
    }

    const nomorSoal = two(/^(?:soal\s*)?\d+\s*[.):]\s*(.+)$/i);
    if (section === "soal") {
      if (nomorSoal) { q = { tanya: nomorSoal[1], pilihan: [], jawaban: "", pembahasan: "" }; mod.soal.push(q); field = "tanya"; continue; }
      if (!q) { mod.ringkasan = addLn(mod.ringkasan, fmt); continue; }
      if ((m = two(/^\(?([A-Ha-h])[.)]\s*(.+)$/))) { q.pilihan.push(m[2].trim()); field = null; continue; }
      if ((m = line.match(/^(?:kunci\s*)?jawaban(?:\s*benar)?\s*[:：]\s*(.*)$/i))) {
        const h = m[1].trim().match(/^\(?([A-Ha-h])(?:[.)\s]|$)/);
        q.jawaban = h ? h[1].toUpperCase() : m[1].trim(); field = null; continue;
      }
      if ((m = two(/^pembahasan\s*[:：]\s*(.*)$/i))) { q.pembahasan = m[1].trim(); field = "pembahasan"; continue; }
      if (field === "tanya" && !q.pilihan.length) q.tanya = add(q.tanya, fl);
      else if (field === "pembahasan") q.pembahasan = add(q.pembahasan, fl);
      else mod.ringkasan = addLn(mod.ringkasan, fmt);          // jangan dibuang
      continue;
    }
    if (section === "esai") {
      if (nomorSoal) { q = { tanya: nomorSoal[1], jawaban: "" }; mod.esai.push(q); field = "tanya"; continue; }
      if (!q) { mod.ringkasan = addLn(mod.ringkasan, fmt); continue; }
      if ((m = two(/^(?:contoh\s*)?jawaban\s*[:：]\s*(.*)$/i))) { q.jawaban = m[1].trim(); field = "jawaban"; continue; }
      q[field] = field === "jawaban" ? addLn(q[field], fmt.replace(BUL, "")) : add(q[field], fl);
    }
  }
  flushPara();
  out.modul = out.modul.filter((x) => x.judul || x.ringkasan || x.poin.length || x.istilah.length || x.soal.length || x.esai.length);
  // buang kalimat pembuka tanpa judul modul (misalnya "Berikut materinya:") kalau ada modul sungguhan
  out.modul.forEach((x) => { x.ringkasan = x.ringkasan.replace(/\n{3,}/g, "\n\n").trim(); });
  if (!out.modul.length) throw new Error("Belum ada materi yang terbaca. Pastikan baris paling atas berisi MATA KULIAH: dan MODUL 1:, lalu materinya di bawahnya.");
  return out;
}

// Ubah materi jadi teks biasa (untuk "Simpan ke file")
function toText(d) {
  const L = [`MATA KULIAH: ${d.mataKuliah}`];
  if (d.kode) L.push(`KODE: ${d.kode}`);
  L.push(`TANGGAL UJIAN: ${tulisTanggal(d.tanggalUjian)}`);
  if (d.info) L.push(`INFO: ${d.info}`);
  if (d.catatan) L.push(`CATATAN: ${d.catatan}`);
  d.modul.forEach((m) => {
    L.push("", `MODUL ${m.nomor}: ${m.judul}`);
    (m.subjudul || []).forEach((sj) => L.push(`SUB-JUDUL: ${sj}`));
    if (m.ringkasan) L.push("RINGKASAN:", m.ringkasan);
    if (m.poin.length) L.push("POIN PENTING:", ...m.poin.map((p) => `- ${p}`));
    if (m.istilah.length) L.push("ISTILAH:", ...m.istilah.map((t) => `- ${t.kata}: ${t.arti}`));
    if (m.soal.length) {
      L.push("SOAL:");
      m.soal.forEach((s, i) => {
        L.push(`${i + 1}. ${s.tanya}`, ...s.pilihan.map((p, j) => `${String.fromCharCode(65 + j)}. ${p}`), `JAWABAN: ${String.fromCharCode(65 + s.jawaban)}`);
        if (s.pembahasan) L.push(`PEMBAHASAN: ${s.pembahasan}`);
      });
    }
    if (m.esai.length) {
      L.push("ESAI:");
      m.esai.forEach((s, i) => L.push(`${i + 1}. ${s.tanya}`, `JAWABAN: ${s.jawaban || "-"}`));
    }
  });
  return L.join("\n") + "\n";
}

// Pilih cara baca: susunan teks biasa (utama) atau JSON (file lama)
function bacaMateri(text) {
  const t = String(text).replace(/```[a-zA-Z]*/g, "").trim().replace(/^﻿/, "");
  if (/^[\[{]/.test(t)) return extractJSON(t);
  return parseSederhana(t);
}

function toAnswerIndex(jawaban, pilihan) {
  if (typeof jawaban === "number") return jawaban;
  const s = String(jawaban ?? "").trim();
  if (/^\d+$/.test(s)) return Number(s);
  if (/^[A-Ha-h][.)]?$/.test(s)) return s.toUpperCase().charCodeAt(0) - 65;
  return pilihan.findIndex((p) => p.trim().toLowerCase() === s.toLowerCase());
}

/* ============================================================
   TAMPILAN BUKU CATATAN: sampul, pola, stiker, kertas
   ============================================================ */
const WARNA_SAMPUL = { biru: "#bcd7f2", butter: "#fde7a3", pink: "#f9c3d6", mint: "#c7ebd9", lavender: "#dacdf4", peach: "#ffd3b8", toska: "#b8e3e6", krem: "#efe6d8" };
const NAMA_WARNA = { biru: "Biru", butter: "Butter", pink: "Pink", mint: "Mint", lavender: "Lavender", peach: "Peach", toska: "Toska", krem: "Krem" };
const POLA_SAMPUL = { polos: "Polos", garis: "Garis miring", titik: "Polkadot", kotak: "Kotak-kotak" };
const STIKER = ["📚", "🌸", "⭐", "🍓", "🌷", "☁️", "🐰", "🧸", "🍀", "🎀", "💡", "🌙", "🦋", "🍋", "🌈", "✏️"];
const KERTAS = { garis: "Bergaris", kotak: "Kotak-kotak", titik: "Titik-titik", polos: "Polos" };
/* ---------- Stiker foto buatan sendiri ---------- */
const STIKER_FOTO_KEY = "demuse-belajar-stiker-foto";
const MAKS_STIKER_FOTO = 40;
let stikerFoto = readStore(STIKER_FOTO_KEY, []);
if (!Array.isArray(stikerFoto)) stikerFoto = [];
const cariStikerFoto = (id) => stikerFoto.find((x) => x && x.id === id);
const htmlStikerFoto = (id, kelas = "stiker-foto", untukEditor = false) => {
  const f = cariStikerFoto(id);
  if (!f || !/^data:image\/(png|webp|jpeg);base64,[a-z0-9+/=]+$/i.test(f.data)) return "";
  return `<img class="${kelas}" src="${f.data}" alt="stiker" data-st="${esc(id)}"${untukEditor ? ' contenteditable="false" draggable="false"' : ""}>`;
};
// Stiker melayang (bisa digeser): ⟦sf:f-ID|dx|dy|ukuran|putar⟧ atau ⟦sf:e-🌸|...⟧
const RE_SF = /⟦sf:([fe])-([^|⟦⟧]{1,24})\|(-?\d{1,4})\|(-?\d{1,4})\|(\d{2,3})\|(-?\d{1,3})⟧/g;
function htmlMelayang(k, v, dx, dy, uk, rot, untukEditor) {
  dx = Math.max(-2000, Math.min(2000, Number(dx) || 0)); dy = Math.max(-2000, Math.min(2000, Number(dy) || 0));
  uk = Math.max(24, Math.min(320, Number(uk) || 80)); rot = Math.max(-180, Math.min(180, Number(rot) || 0));
  let isi;
  if (k === "f") { const f = cariStikerFoto(v); if (!f || !/^data:image\/(png|webp|jpeg);base64,[a-z0-9+/=]+$/i.test(f.data)) return ""; isi = `<img src="${f.data}" alt="stiker" draggable="false">`; }
  else { if (!STIKER_TULISAN.includes(v)) return ""; isi = `<span class="sf-emoji" style="font-size:${Math.round(uk * 0.78)}px">${v}</span>`; }
  return `<span class="jangkar" data-sf="${k}-${esc(v)}|${dx}|${dy}|${uk}|${rot}"${untukEditor ? ' contenteditable="false"' : ""}><span class="melayang" style="left:${dx}px;top:${dy}px;width:${uk}px;height:${uk}px;transform:rotate(${rot}deg)">${isi}</span></span>`;
}
function tampilStiker(st) {
  if (String(st).startsWith("foto:")) return htmlStikerFoto(st.slice(5), "stiker-foto sampul") || "📚";
  return esc(st);
}
function bukuValid(b) {
  if (!b || typeof b !== "object") return null;
  return {
    warna: WARNA_SAMPUL[b.warna] ? b.warna : "biru",
    pola: POLA_SAMPUL[b.pola] ? b.pola : "polos",
    stiker: STIKER.includes(b.stiker) || /^foto:[a-z0-9]{4,20}$/.test(String(b.stiker)) ? b.stiker : "📚",
    kertas: KERTAS[b.kertas] ? b.kertas : "garis"
  };
}
// mata kuliah tanpa pilihan: warna dipilih otomatis dari namanya, jadi tiap buku beda warna
function bukuDari(s, id) {
  if (s && bukuValid(s.buku)) return bukuValid(s.buku);
  const kunci = Object.keys(WARNA_SAMPUL);
  let h = 0; for (const c of String(id || (s && s.mataKuliah) || "")) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { warna: kunci[h % kunci.length], pola: ["polos", "titik", "garis", "kotak"][(h >>> 3) % 4], stiker: STIKER[(h >>> 5) % STIKER.length], kertas: "garis" };
}

function normalize(obj) {
  let d = obj;
  if (Array.isArray(d)) d = { modul: d };
  if (d && !d.modul && d.judul) d = { modul: [d] };
  if (!d || !Array.isArray(d.modul) || !d.modul.length) throw new Error("Materinya masih kosong.");

  const str = (v) => (v == null ? "" : String(v).trim());
  const arr = (v) => (Array.isArray(v) ? v : []);
  const num = (v) => { const n = Math.round(Number(v)); return n > 0 && n < 1000 ? n : null; };

  const modul = d.modul.filter((m) => m && typeof m === "object").map((m, i) => ({
    nomor: num(m.nomor),
    judul: str(m.judul) || `Modul ${num(m.nomor) || i + 1}`,
    subjudul: arr(m.subjudul).map(str).filter(Boolean).slice(0, 3),
    ringkasan: str(m.ringkasan),
    poin: arr(m.poin).map(str).filter(Boolean),
    istilah: arr(m.istilah).map((t) => ({ kata: str(t?.kata ?? t?.istilah), arti: str(t?.arti ?? t?.definisi) })).filter((t) => t.kata && t.arti),
    soal: arr(m.soal).map((q) => {
      const pilihan = arr(q?.pilihan).map(str).filter(Boolean);
      return { tanya: str(q?.tanya ?? q?.pertanyaan), pilihan, jawaban: toAnswerIndex(q?.jawaban, pilihan), pembahasan: str(q?.pembahasan) };
    }).filter((q) => q.tanya && q.pilihan.length >= 2 && q.jawaban >= 0 && q.jawaban < q.pilihan.length),
    esai: arr(m.esai).map((q) => ({ tanya: str(q?.tanya ?? q?.pertanyaan), jawaban: str(q?.jawaban) })).filter((q) => q.tanya)
  }));
  if (!modul.length) throw new Error("Materinya masih kosong.");

  return {
    mataKuliah: str(d.mataKuliah) || "Mata Kuliah Tanpa Nama",
    kode: str(d.kode),
    info: str(d.info),
    tanggalUjian: str(d.tanggalUjian),
    catatan: str(d.catatan),
    ...(bukuValid(d.buku) ? { buku: bukuValid(d.buku) } : {}),
    modul
  };
}

// Pastikan setiap modul punya nomor unik, lalu urutkan
function fillNomor(list) {
  const used = new Set();
  list.forEach((m) => { if (m.nomor && !used.has(m.nomor)) used.add(m.nomor); else m.nomor = null; });
  let n = 1;
  list.forEach((m) => { if (!m.nomor) { while (used.has(n)) n++; m.nomor = n; used.add(n); } });
  return list.sort((a, b) => a.nomor - b.nomor);
}

// Materi dari versi lama belum punya nomor modul
Object.values(library.subjects).forEach((s) => { if (Array.isArray(s.modul)) fillNomor(s.modul); });

/* ============================================================
   MENYIMPAN: MATA KULIAH BARU / TAMBAHKAN KE YANG ADA
   ============================================================ */
function saveNew(data) {
  const base = courseKey(data);
  let id = base, n = 2;
  while (library.subjects[id]) id = `${base}-${n++}`;
  data.modul = fillNomor(data.modul);
  library.subjects[id] = data;
  saveLibrary();
  bukaMateri(id);
  toast(`🎉 Tersimpan: ${data.mataKuliah} · ${data.modul.length} modul`);
}

function mergeInto(id, incoming) {
  const target = library.subjects[id];
  let added = 0, updated = 0;
  incoming.modul.forEach((m) => {
    const idx = target.modul.findIndex((e) => (m.nomor && e.nomor === m.nomor) || slug(e.judul) === slug(m.judul));
    if (idx >= 0) {
      const lama = target.modul[idx];
      target.modul[idx] = { ...m, nomor: m.nomor || lama.nomor,
        istilah: m.istilah && m.istilah.length ? m.istilah : lama.istilah || [],
        soal: m.soal && m.soal.length ? m.soal : lama.soal || [],
        esai: m.esai && m.esai.length ? m.esai : lama.esai || [] };
      updated++;
    }
    else { target.modul.push({ ...m }); added++; }
  });
  ["kode", "info", "tanggalUjian", "catatan"].forEach((k) => { if (!target[k] && incoming[k]) target[k] = incoming[k]; });
  fillNomor(target.modul);
  saveLibrary();
  bukaMateri(id);
  const parts = [];
  if (added) parts.push(`${added} modul ditambahkan`);
  if (updated) parts.push(`${updated} modul diperbarui`);
  toast(`🎉 ${target.mataKuliah}: ${parts.join(", ")}`);
}

/* Simpan hasil edit: ganti modul lama; kalau mata kuliah tujuannya diganti, modul dipindahkan */
function simpanEditan(edit, tujuan, data) {
  const asal = library.subjects[edit.id];
  const m = data.modul[0];
  if (!asal) throw new Error("Mata kuliah asal sudah tidak ada.");
  const tetap = tujuan === edit.id;
  if (tetap) {
    const bentrok = asal.modul.find((x) => x.nomor === m.nomor && x.nomor !== edit.nomor);
    if (bentrok && !confirm(`Nomor modul ${m.nomor} sudah dipakai oleh "${bentrok.judul}".\n\nGanti modul itu dengan isian ini?`)) return;
  } else if (tujuan !== "__baru") {
    const bentrok = library.subjects[tujuan].modul.find((x) => x.nomor === m.nomor);
    if (bentrok && !confirm(`Di mata kuliah tujuan sudah ada Modul ${m.nomor} ("${bentrok.judul}").\n\nGanti dengan modul ini?`)) return;
  }
  // keluarkan modul lama dari mata kuliah asal
  asal.modul = asal.modul.filter((x) => x.nomor !== edit.nomor);
  closeModal("importModal"); hapusDrafMateri(); modeEdit = null;
  let idTujuan;
  if (tetap) {
    asal.modul = asal.modul.filter((x) => x.nomor !== m.nomor);
    asal.modul.push(m); fillNomor(asal.modul); idTujuan = edit.id;
  } else if (tujuan === "__baru") {
    const base = courseKey(data); let id = base, n = 2;
    while (library.subjects[id]) id = `${base}-${n++}`;
    library.subjects[id] = { ...data, modul: fillNomor([m]) }; idTujuan = id;
  } else {
    const t = library.subjects[tujuan];
    t.modul = t.modul.filter((x) => x.nomor !== m.nomor);
    t.modul.push(m); fillNomor(t.modul); idTujuan = tujuan;
  }
  let pesan = tetap ? "✅ Perubahan tersimpan." : `✅ Modul dipindahkan ke ${library.subjects[idTujuan].mataKuliah}.`;
  if (!tetap && !asal.modul.length) {         // mata kuliah asal sudah kosong
    delete library.subjects[edit.id];
    try { localStorage.removeItem("demuse-belajar-progress-" + edit.id); } catch (e) {}
    pesan += ` "${asal.mataKuliah}" sudah kosong, jadi dihapus.`;
  }
  saveLibrary();
  bukaMateri(idTujuan);
  toast(pesan);
  return idTujuan;
}
function hapusModul(id, nomor) {
  const s = library.subjects[id], m = s && s.modul.find((x) => x.nomor === nomor);
  if (!m) return;
  if (!confirm(`Hapus Modul ${m.nomor}: "${m.judul}"?\n\nIsi modul ini akan hilang dari HP/laptop ini dan tidak bisa dikembalikan.`)) return;
  s.modul = s.modul.filter((x) => x.nomor !== nomor);
  if (!s.modul.length) {
    if (confirm(`"${s.mataKuliah}" sekarang tidak punya modul lagi. Hapus mata kuliah ini sekalian?`)) {
      delete library.subjects[id];
      try { localStorage.removeItem("demuse-belajar-progress-" + id); } catch (e) {}
      saveLibrary(); closeModal("editMkModal"); tampilkanBeranda(); toast("🗑️ Mata kuliah dihapus."); return;
    }
  }
  saveLibrary(); renderAll(); isiEditMk(); toast("🗑️ Modul dihapus.");
}

/* ---------- Menu Edit mata kuliah (nama, kode, tanggal ujian, daftar modul) ---------- */
function isiPilihanStikerSampul(pilih) {
  const semua = [...STIKER, ...stikerFoto.map((f) => "foto:" + f.id)];
  if (!semua.includes(pilih)) pilih = "📚";
  $("emStiker").innerHTML = semua.map((e) => `<label class="stiker-pilih"><input type="radio" name="emStiker" value="${esc(e)}" ${e === pilih ? "checked" : ""}><span>${tampilStiker(e)}</span></label>`).join("") +
    `<button type="button" class="stiker-tambah" data-buka-stiker-foto>📷<small>Foto</small></button>`;
}
function pratinjauBuku() {
  const w = (document.querySelector('input[name="emWarna"]:checked') || {}).value || "biru";
  const st = (document.querySelector('input[name="emStiker"]:checked') || {}).value || "📚";
  const el = $("emPratinjau");
  el.className = "course-card buku mini pola-" + $("emPola").value;
  el.style.setProperty("--sampul", WARNA_SAMPUL[w]);
  el.querySelector(".stiker-sampul").innerHTML = tampilStiker(st);
  el.querySelector(".cc-name").textContent = $("emNama").value.trim() || "Mata kuliah";
}
function isiEditMk() {
  const d = current(); if (!d) return;
  const bk = bukuDari(d, library.active);
  $("emWarna").innerHTML = Object.keys(WARNA_SAMPUL).map((k) => `<label class="swatch" title="${NAMA_WARNA[k]}" style="--w:${WARNA_SAMPUL[k]}"><input type="radio" name="emWarna" value="${k}" ${k === bk.warna ? "checked" : ""}><span>${NAMA_WARNA[k]}</span></label>`).join("");
  isiPilihanStikerSampul(bk.stiker);
  $("emPola").innerHTML = Object.entries(POLA_SAMPUL).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("emKertas").innerHTML = Object.entries(KERTAS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("emPola").value = bk.pola; $("emKertas").value = bk.kertas;
  setTimeout(pratinjauBuku, 0);
  $("emNama").value = d.mataKuliah; $("emKode").value = d.kode || "";
  $("emTgl").value = d.tanggalUjian ? d.tanggalUjian.slice(0, 10) : "";
  showMsg("emMsg", "");
  $("emModul").innerHTML = d.modul.length ? d.modul.map((m) => `
    <div class="em-row">
      <div class="em-info"><b>Modul ${m.nomor}</b><span>${esc(m.judul)}</span></div>
      <div class="em-act">
        <button type="button" class="btn small" data-edit-modul="${m.nomor}">✏️ Edit isi</button>
        <button type="button" class="btn small danger" data-hapus-modul="${m.nomor}" aria-label="Hapus modul ${m.nomor}">🗑️</button>
      </div>
    </div>`).join("") : `<p class="muted">Belum ada modul.</p>`;
}
$("editMkBtn").addEventListener("click", () => { isiEditMk(); openModal("editMkModal"); });
["emWarna", "emStiker", "emPola", "emNama"].forEach((id) => $(id).addEventListener(id === "emNama" ? "input" : "change", pratinjauBuku));
$("emModul").addEventListener("click", (e) => {
  const ed = e.target.closest("[data-edit-modul]"), del = e.target.closest("[data-hapus-modul]");
  if (ed) { const id = library.active; closeModal("editMkModal"); setTimeout(() => bukaEditModul(id, Number(ed.dataset.editModul)), 80); }
  if (del) hapusModul(library.active, Number(del.dataset.hapusModul));
});
$("emSimpan").addEventListener("click", () => {
  const d = current(); if (!d) return;
  const nama = $("emNama").value.trim();
  if (!nama) return showMsg("emMsg", "Nama mata kuliah belum diisi.");
  d.mataKuliah = nama;
  d.kode = $("emKode").value.trim();
  d.tanggalUjian = $("emTgl").value ? $("emTgl").value + "T07:00" : "";
  d.buku = bukuValid({
    warna: (document.querySelector('input[name="emWarna"]:checked') || {}).value,
    pola: $("emPola").value,
    stiker: (document.querySelector('input[name="emStiker"]:checked') || {}).value,
    kertas: $("emKertas").value
  });
  saveLibrary(); closeModal("editMkModal"); renderAll();
  toast("✅ Mata kuliah diperbarui.");
});

let pending = null, pendingDraf = false;
function chooseDestination(data, dariDraf = false) {
  const ids = Object.keys(library.subjects);
  if (!ids.length) { saveNew(data); if (dariDraf) hapusDrafMateri(); return; }
  pending = data; pendingDraf = dariDraf;
  const key = courseKey(data);
  const match = ids.find((id) => { const s = library.subjects[id]; return courseKey(s) === key || slug(s.mataKuliah) === slug(data.mataKuliah); });
  const nomorList = data.modul.map((m) => m.nomor).filter(Boolean);
  $("destSummary").textContent = `"${data.mataKuliah}" · ${data.modul.length} modul` + (nomorList.length ? ` (Modul ${nomorList.join(", ")})` : "");
  const opt = (value, label, sub, checked) => `
    <label class="choice"><input type="radio" name="dest" value="${esc(value)}" ${checked ? "checked" : ""}>
      <span>${label}${sub ? `<small>${sub}</small>` : ""}</span></label>`;
  $("destOptions").innerHTML =
    ids.map((id) => {
      const s = library.subjects[id];
      return opt(id, `Tambahkan ke: <b>${esc(s.mataKuliah)}</b>`, `Sekarang ada ${s.modul.length} modul`, id === match);
    }).join("") +
    opt("__baru", "Simpan sebagai <b>mata kuliah baru</b>", "", !match);
  openModal("destModal");
}
$("destSave").addEventListener("click", () => {
  if (!pending) return;
  const pick = document.querySelector('input[name="dest"]:checked');
  const data = pending; pending = null;
  closeModal("destModal");
  if (!pick || pick.value === "__baru" || !library.subjects[pick.value]) saveNew(data);
  else mergeInto(pick.value, data);
  if (pendingDraf) { hapusDrafMateri(); pendingDraf = false; }
});

/* ============================================================
   MODAL MASUKKAN MATERI
   ============================================================ */
/* ---------- Kotak tulisan langsung jadi (tebal, miring, judul tanpa tanda # atau *) ----------
   Di balik layar isi tetap disimpan dengan tanda sederhana (## judul, **tebal**, *miring*)
   di <textarea> tersembunyi, supaya simpan otomatis, berbagi, dan file .txt tetap jalan. */
/* ---------- Pilihan jenis huruf (seperti di Word) ----------
   Disimpan sebagai tanda tersembunyi ⟦f:Nama⟧teks⟦/f⟧, tapi pengguna hanya melihat hurufnya berubah. */
const DAFTAR_HURUF = [
  ["Nunito", "Nunito (bawaan)", "'Nunito', sans-serif"],
  ["Arial", "Arial", "Arial, Helvetica, sans-serif"],
  ["Times New Roman", "Times New Roman", "'Times New Roman', Times, serif"],
  ["Georgia", "Georgia", "Georgia, 'Times New Roman', serif"],
  ["Verdana", "Verdana", "Verdana, Geneva, sans-serif"],
  ["Courier New", "Courier New", "'Courier New', Courier, monospace"],
  ["Poppins", "Poppins", "'Poppins', sans-serif"],
  ["Open Sans", "Open Sans", "'Open Sans', sans-serif"],
  ["Merriweather", "Merriweather", "'Merriweather', serif"],
  ["Lora", "Lora", "'Lora', serif"],
  ["Caveat", "Caveat (tulisan tangan)", "'Caveat', cursive"]
];
const PETA_HURUF = new Map(DAFTAR_HURUF.map(([nama, label, css]) => [nama.toLowerCase(), { nama, label, css }]));
function namaHuruf(raw) {
  const pertama = String(raw || "").split(",")[0].replace(/["']/g, "").trim().toLowerCase();
  const f = PETA_HURUF.get(pertama);
  return f && f.nama !== "Nunito" ? f.nama : null;     // Nunito = huruf bawaan, tidak perlu ditandai
}
/* ---------- Huruf tambahan dari file sendiri (.ttf / .otf / .woff) ---------- */
const HURUF_SAYA_KEY = "demuse-belajar-huruf-saya";
let hurufSaya = readStore(HURUF_SAYA_KEY, []);
if (!Array.isArray(hurufSaya)) hurufSaya = [];
const namaAmanHuruf = (n) => String(n || "").replace(/\.[a-z0-9]+$/i, "").replace(/[_\-]+/g, " ").replace(/[^A-Za-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, 30);
function daftarkanHuruf(h) {
  const nama = namaAmanHuruf(h.nama);
  if (!nama || !/^data:[a-z\/\-+.]*;base64,[A-Za-z0-9+/=]+$/.test(h.data)) return Promise.reject(new Error("rusak"));
  PETA_HURUF.set(nama.toLowerCase(), { nama, label: "✨ " + nama, css: `'${nama}', 'Nunito', sans-serif`, saya: true });
  if (typeof FontFace === "undefined") return Promise.resolve();
  const ff = new FontFace(nama, `url(${h.data})`);
  return ff.load().then((f) => { document.fonts.add(f); });
}
hurufSaya.forEach((h) => daftarkanHuruf(h).catch(() => {}));
function opsiHuruf() {
  return [...PETA_HURUF.values()].map((f) => `<option value="${esc(f.nama)}" style="font-family:${esc(f.css)}">${esc(f.label)}</option>`).join("") +
    `<option value="__huruf">➕ Tambah / atur huruf sendiri…</option>`;
}
function segarkanPilihanHuruf() {
  document.querySelectorAll("[data-fontsel]").forEach((p) => { const v = p.value; p.innerHTML = opsiHuruf(); p.value = PETA_HURUF.has(String(v).toLowerCase()) ? v : "Nunito"; });
}

/* ---------- Ukuran huruf, warna huruf, stabilo, jarak baris ----------
   Disimpan sebagai tanda tersembunyi: ⟦z:4⟧ukuran⟦/z⟧, ⟦w:#c62828⟧warna⟦/w⟧, ⟦s:#fff176⟧stabilo⟦/s⟧,
   dan jarak baris di ujung baris: ...⟦ls:1.5⟧. Pengguna hanya melihat hasilnya. */
const UKURAN_HURUF = { 2: "0.85em", 4: "1.2em", 5: "1.45em", 6: "1.8em" };
const DAFTAR_UKURAN = [["3", "🔠 Ukuran normal"], ["2", "Kecil"], ["4", "Besar"], ["5", "Lebih besar"], ["6", "Sangat besar"]];
const DAFTAR_WARNA = [["", "🎨 Warna bawaan"], ["#c62828", "🔴 Merah"], ["#1565c0", "🔵 Biru"], ["#2e7d32", "🟢 Hijau"], ["#6a1b9a", "🟣 Ungu"], ["#e65100", "🟠 Oranye"], ["#d81b60", "💗 Pink"]];
const DAFTAR_STABILO = [["", "🖍️ Tanpa stabilo"], ["#fff176", "🟨 Kuning"], ["#b9f6ca", "🟩 Hijau"], ["#f8bbd0", "💗 Pink"], ["#b3e5fc", "🟦 Biru"], ["#ffcc80", "🟧 Oranye"]];
const DAFTAR_JARAK = [["", "↕️ Jarak baris normal"], ["1", "Jarak 1,0"], ["1.15", "Jarak 1,15"], ["1.5", "Jarak 1,5"], ["2", "Jarak 2,0"], ["2.5", "Jarak 2,5"], ["3", "Jarak 3,0"]];
const NILAI_JARAK = DAFTAR_JARAK.map((x) => x[0]).filter(Boolean);
const WARNA_TEKS_BAWAAN = "#3b2a24";
const opsiDari = (daftar) => daftar.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
function keHex(v) {
  v = String(v || "").trim().toLowerCase(); let m;
  if (!v || /^(transparent|inherit|initial|unset|currentcolor)$/.test(v)) return null;
  if ((m = v.match(/^#([0-9a-f]{3})$/))) return "#" + m[1].split("").map((c) => c + c).join("");
  if (/^#[0-9a-f]{6}$/.test(v)) return v;
  if ((m = v.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?\s*\)$/))) {
    if (m[4] != null && parseFloat(m[4]) === 0) return null;
    return "#" + [m[1], m[2], m[3]].map((x) => Math.min(255, Number(x)).toString(16).padStart(2, "0")).join("");
  }
  return null;
}
const KATA_UKURAN = { "x-small": "2", small: "2", medium: "3", large: "4", "x-large": "5", "xx-large": "6", "xxx-large": "6" };
function ukuranDari(el) {
  if (!el || el.nodeType !== 1) return null;
  let z = el.tagName === "FONT" ? el.getAttribute("size") : null;
  if (!z && el.style && el.style.fontSize) {
    const fs = el.style.fontSize.trim();
    z = KATA_UKURAN[fs] || Object.keys(UKURAN_HURUF).find((k) => UKURAN_HURUF[k] === fs) || null;
  }
  return z && UKURAN_HURUF[z] ? String(z) : null;
}
function warnaDari(el) {
  if (!el || el.nodeType !== 1) return null;
  const w = keHex((el.tagName === "FONT" && el.getAttribute("color")) || (el.style && el.style.color));
  return w && w !== WARNA_TEKS_BAWAAN && w !== "#000000" ? w : null;
}
function stabiloDari(el) {
  if (!el || el.nodeType !== 1 || !el.style) return null;
  const s = keHex(el.style.backgroundColor);
  return s && s !== "#ffffff" ? s : null;
}
// Word 1,0 ≈ CSS 1.2
const jarakKeCss = (v) => String(Math.round(Number(v) * 1.2 * 100) / 100);
function jarakDari(el) {
  if (!el || el.nodeType !== 1 || !el.style || !el.style.lineHeight) return null;
  const n = parseFloat(el.style.lineHeight) / 1.2;
  if (!isFinite(n)) return null;
  const v = NILAI_JARAK.find((x) => Math.abs(Number(x) - n) < 0.08);
  return v || null;
}
// "isi baris⟦ls:1.5⟧" → ["isi baris", "1.5"]
function pisahLs(l) {
  const m = String(l ?? "").match(/^([\s\S]*?)\s*⟦ls:([\d.]+)⟧\s*$/);
  if (!m) return [String(l ?? ""), null];
  return [m[1], NILAI_JARAK.includes(m[2]) ? m[2] : null];
}
const gayaJarak = (ls) => (ls ? ` style="line-height:${jarakKeCss(ls)}"` : "");
// tanda gaya → HTML (untuk tampilan, atau untuk kotak tulisan)
function gayaHtml(k, v, isi, untukEditor) {
  v = String(v).trim();
  if (k === "f") {
    const f = PETA_HURUF.get(v.toLowerCase()); if (!f) return isi;
    return untukEditor ? `<font face="${f.nama}">${isi}</font>` : `<span style="font-family:${f.css}">${isi}</span>`;
  }
  if (k === "z") {
    if (!UKURAN_HURUF[v]) return isi;
    return untukEditor ? `<font size="${v}">${isi}</font>` : `<span style="font-size:${UKURAN_HURUF[v]}">${isi}</span>`;
  }
  const hex = keHex(v); if (!hex) return isi;
  if (k === "w") return untukEditor ? `<font color="${hex}">${isi}</font>` : `<span style="color:${hex}">${isi}</span>`;
  if (k === "s") return untukEditor ? `<span style="background-color:${hex}">${isi}</span>` : `<span class="stabilo" style="background-color:${hex}">${isi}</span>`;
  return isi;
}

try { document.execCommand("defaultParagraphSeparator", false, "div"); } catch (e) {}
const nilaiAsli = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");

// Kotak tulisan (HTML) → teks bertanda
function editorKeTeks(root, opsi = {}) {
  const gaya = opsi.gaya !== false;     // saat menempel dari luar: warna/ukuran/stabilo/jarak dari web dibuang
  const lines = []; let cur = ""; let habisBr = false;
  const baris = () => { lines.push(cur); cur = ""; };
  const tebal = (el) => /^(B|STRONG)$/.test(el.tagName) || Number(el.style && el.style.fontWeight) >= 600 || (el.style && el.style.fontWeight === "bold");
  const miring = (el) => /^(I|EM)$/.test(el.tagName) || (el.style && el.style.fontStyle === "italic");
  const BLOK = /^(DIV|P|H1|H2|H3|H4|H5|H6|LI|BLOCKQUOTE|PRE|TR|SECTION|ARTICLE|HEADER|FOOTER)$/;
  const jalan = (node) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) { const t = n.nodeValue.replace(/[\r\n]+/g, " ").replace(/ /g, " ").replace(/\u200b/g, ""); if (t) { cur += t; habisBr = false; } return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (tag === "BR") { baris(); habisBr = true; return; }
      if (n.classList && n.classList.contains("jangkar")) {
        const t = `⟦sf:${n.getAttribute("data-sf") || ""}⟧`;
        if (new RegExp(RE_SF.source).test(t)) { cur += t; habisBr = false; }
        return;
      }
      if (tag === "IMG") { const id = n.getAttribute("data-st"); if (id && /^[a-z0-9]{4,20}$/.test(id)) { cur += `⟦st:${id}⟧`; habisBr = false; } return; }
      if (/^(SCRIPT|STYLE|META|TITLE)$/.test(tag)) return;
      if (BLOK.test(tag)) {
        if (cur !== "") baris();
        habisBr = false;
        if (/^H[12]$/.test(tag)) cur = "## ";
        else if (/^H[3-6]$/.test(tag)) cur = "### ";
        else if (tag === "LI") cur = "- ";
        jalan(n);
        const ls = gaya ? jarakDari(n) : null;
        if (ls && cur.replace(/^(#{2,3} |- )/, "").trim()) cur += `⟦ls:${ls}⟧`;
        if (cur !== "" || !habisBr) baris();
        habisBr = false;
        return;
      }
      const b = tebal(n), i = miring(n);
      const f = namaHuruf((n.getAttribute && n.getAttribute("face")) || (n.style && n.style.fontFamily));
      const z = gaya ? ukuranDari(n) : null, w = gaya ? warnaDari(n) : null, st = gaya ? stabiloDari(n) : null;
      if (!b && !i && !f && !z && !w && !st) { jalan(n); return; }
      // kumpulkan isi elemen, lalu taruh spasi di luar tanda (contoh: "**Lisan :** " bukan "**Lisan : **")
      const simpan = cur; cur = "";
      jalan(n);
      const isi = cur; cur = simpan;
      const m = isi.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const inti = m[2];
      if (!inti.trim()) { cur += isi; return; }
      const mk = (f ? `⟦f:${f}⟧` : "") + (z ? `⟦z:${z}⟧` : "") + (st ? `⟦s:${st}⟧` : "") + (w ? `⟦w:${w}⟧` : "") + (b ? "**" : "") + (i ? "*" : ""),
        tutup = (i ? "*" : "") + (b ? "**" : "") + (w ? "⟦/w⟧" : "") + (st ? "⟦/s⟧" : "") + (z ? "⟦/z⟧" : "") + (f ? "⟦/f⟧" : "");
      cur += m[1] + mk + inti + tutup + m[3];
    });
  };
  jalan(root);
  if (cur !== "") baris();
  return lines
    .map((l) => l.replace(/\*{4}/g, "").replace(/^(#{2,3} |- )?\s*(⟦ls:[\d.]+⟧)?$/, "").replace(/^(#{2,3} |- )\s*$/, "").replace(/\s+$/, ""))
    .join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\n+|\n+$/g, "");
}
// Teks bertanda → kotak tulisan (HTML)
function teksKeEditor(teks, inline) {
  const v = String(teks ?? "");
  if (!v) return "";
  return v.split("\n").map((baris0) => {
    let m;
    const [l, ls] = inline ? [baris0, null] : pisahLs(baris0);
    const st = gayaJarak(ls);
    if (!inline && (m = l.match(/^###\s+(.*)$/))) return `<h3${st}>${fmtInline(esc(m[1]), true) || "<br>"}</h3>`;
    if (!inline && (m = l.match(/^##?\s+(.*)$/))) return `<h2${st}>${fmtInline(esc(m[1]), true) || "<br>"}</h2>`;
    return `<div${st}>${fmtInline(esc(l), true) || "<br>"}</div>`;
  }).join("");
}

function isiLaci(laci) {
  laci.innerHTML = STIKER_TULISAN.map((e) => `<button type="button" data-stiker="${e}" aria-label="Stiker ${e}">${e}</button>`).join("") +
    stikerFoto.map((f) => `<button type="button" class="foto" data-stiker="foto:${esc(f.id)}" aria-label="Stiker foto">${htmlStikerFoto(f.id, "stiker-foto kecil")}</button>`).join("") +
    `<button type="button" class="tambah" data-stiker="__foto" aria-label="Buat stiker dari foto">📷<small>Foto</small></button>`;
}
const STIKER_TULISAN = ["⭐", "🌸", "📌", "💡", "✅", "❗", "❓", "❤️", "🍓", "🌷", "🎀", "🐰", "🧸", "☁️", "🌈", "📝", "👉", "🔥"];
function enhanceRich(ta, kind = "block") {
  if (!ta || ta.dataset.rich) return;
  ta.dataset.rich = kind;
  const inline = kind === "inline";
  const bar = document.createElement("div");
  bar.className = "rich-tools";
  bar.innerHTML = (!inline ? `<button type="button" data-fmt="h" title="Judul" aria-pressed="false"><span class="fh">Judul</span></button>
    <button type="button" data-fmt="h2" title="Sub-judul" aria-pressed="false"><span class="fh2">Sub-judul</span></button>` : "") +
    `<button type="button" data-fmt="b" title="Tebal (Ctrl+B)" aria-pressed="false"><b>B</b> <small>Tebal</small></button>
    <button type="button" data-fmt="i" title="Miring (Ctrl+I)" aria-pressed="false"><i>I</i> <small>Miring</small></button>
    <button type="button" data-stiker-buka title="Tempel stiker" aria-expanded="false">🌟 <small>Stiker</small></button>
    <select class="font-sel" data-fontsel title="Jenis huruf" aria-label="Jenis huruf">${opsiHuruf()}</select>
    <select class="font-sel" data-gaya="z" title="Ukuran huruf" aria-label="Ukuran huruf">${opsiDari(DAFTAR_UKURAN)}</select>
    <select class="font-sel" data-gaya="w" title="Warna huruf" aria-label="Warna huruf">${opsiDari(DAFTAR_WARNA)}</select>
    <select class="font-sel" data-gaya="s" title="Stabilo" aria-label="Stabilo">${opsiDari(DAFTAR_STABILO)}</select>` +
    (!inline ? `<select class="font-sel" data-gaya="ls" title="Jarak baris" aria-label="Jarak baris">${opsiDari(DAFTAR_JARAK)}</select>` : "");
  const ed = document.createElement("div");
  ed.className = "editor rich" + (inline ? " inline" : "");
  ed.contentEditable = "true";
  ed.setAttribute("role", "textbox");
  ed.setAttribute("aria-multiline", "true");
  ed.dataset.placeholder = ta.placeholder || "";
  if (ta.style.minHeight) ed.style.minHeight = ta.style.minHeight;
  const laci = document.createElement("div");
  laci.className = "laci-stiker hidden";
  laci.innerHTML = STIKER_TULISAN.map((e) => `<button type="button" data-stiker="${e}" aria-label="Stiker ${e}">${e}</button>`).join("");
  bar.appendChild(laci);
  ta.parentNode.insertBefore(bar, ta);
  ta.parentNode.insertBefore(ed, ta);
  ta.classList.add("hidden");
  ta.tabIndex = -1;
  ta._editor = ed;
  ed._ta = ta;
  // setiap kali kode mengisi ta.value (draf, kosongkan, contoh), kotak tulisan ikut berubah
  Object.defineProperty(ta, "value", {
    configurable: true,
    get() { return nilaiAsli.get.call(ta); },
    set(v) { nilaiAsli.set.call(ta, v); if (!ta._sinkron) { ed.innerHTML = teksKeEditor(v, inline); } }
  });
  ed.innerHTML = teksKeEditor(nilaiAsli.get.call(ta), inline);
  ed.addEventListener("input", () => {
    ta._sinkron = true; ta.value = editorKeTeks(ed); ta._sinkron = false;
    if (!ed.textContent.trim() && !ed.querySelector("h2,h3,img,.jangkar")) ed.innerHTML = "";
    perbaruiTombol();
  });
  // tempel: ambil tebal/miring/judul saja, buang gaya lain dari Word/PDF/web
  ed.addEventListener("paste", (e) => {
    const cd = e.clipboardData; if (!cd) return;
    e.preventDefault();
    const html = cd.getData("text/html"), plain = cd.getData("text/plain");
    let teks;
    if (html) { const tmp = document.createElement("div"); tmp.innerHTML = html; teks = editorKeTeks(tmp, { gaya: false }); }
    else teks = plain.replace(/\r/g, "");
    // sisipkan sendiri (bukan insertHTML) supaya browser tidak menambah warna/font tersembunyi
    const html2 = inline ? fmtInline(esc(teks.replace(/^#{1,3}\s+/gm, "")), true).replace(/\n/g, "<br>") : teksKeEditor(teks, false);
    const sel = window.getSelection();
    if (!sel.rangeCount || !ed.contains(sel.anchorNode)) { ed.focus(); const r0 = document.createRange(); r0.selectNodeContents(ed); r0.collapse(false); sel.removeAllRanges(); sel.addRange(r0); }
    const r = sel.getRangeAt(0);
    r.deleteContents();
    const frag = r.createContextualFragment(html2);
    const akhir = frag.lastChild;
    r.insertNode(frag);
    if (akhir) { const r2 = document.createRange(); r2.selectNodeContents(akhir); r2.collapse(false); sel.removeAllRanges(); sel.addRange(r2); }
    ed.dispatchEvent(new Event("input", { bubbles: true }));
  });
  if (ta.labels && ta.labels[0]) ed.setAttribute("aria-label", ta.labels[0].firstChild.textContent.trim());
}
function enhanceAll(root) {
  root.querySelectorAll("textarea.s-tanya, textarea.e-tanya").forEach((t) => enhanceRich(t, "inline"));
  root.querySelectorAll("textarea.e-jawab").forEach((t) => enhanceRich(t, "block"));
}
function editorAktif() {
  const sel = window.getSelection();
  const node = sel && sel.anchorNode;
  const el = node && (node.nodeType === 1 ? node : node.parentElement);
  return el ? el.closest(".editor") : null;
}
function blokSekarang(ed) {
  const sel = window.getSelection(); let n = sel && sel.anchorNode;
  while (n && n !== ed) { if (n.nodeType === 1 && /^(H2|H3|DIV|P)$/.test(n.tagName)) return n.tagName; n = n.parentNode; }
  return "";
}
function perbaruiTombol() {
  const ed = editorAktif();
  // ingat posisi blok terakhir, supaya pilihan huruf tetap mengenai tulisan yang diblok
  if (ed) {
    const sel = window.getSelection();
    if (sel.rangeCount) ed._range = sel.getRangeAt(0).cloneRange();
    const bar = ed.previousElementSibling, pilih = bar && bar.querySelector("[data-fontsel]");
    if (pilih) { let v = ""; try { v = document.queryCommandValue("fontName"); } catch (e) {} pilih.value = namaHuruf(v) || "Nunito"; }
    if (bar) {
      const g = { z: null, w: null, s: null, ls: null };
      let n = sel.anchorNode; if (n && n.nodeType === 3) n = n.parentNode;
      while (n && n !== ed) {
        g.z = g.z || ukuranDari(n); g.w = g.w || warnaDari(n); g.s = g.s || stabiloDari(n);
        if (n.parentNode === ed) g.ls = jarakDari(n);
        n = n.parentNode;
      }
      bar.querySelectorAll("[data-gaya]").forEach((p) => { p.value = g[p.dataset.gaya] || (p.dataset.gaya === "z" ? "3" : ""); });
    }
  }
  document.querySelectorAll(".rich-tools").forEach((bar) => {
    const milik = bar.nextElementSibling === ed;
    const blok = milik ? blokSekarang(ed) : "";
    bar.querySelectorAll("[data-fmt]").forEach((b) => {
      let on = false;
      if (milik) {
        if (b.dataset.fmt === "b") on = document.queryCommandState("bold");
        if (b.dataset.fmt === "i") on = document.queryCommandState("italic");
        if (b.dataset.fmt === "h") on = blok === "H2";
        if (b.dataset.fmt === "h2") on = blok === "H3";
      }
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });
}
document.addEventListener("selectionchange", perbaruiTombol);
// jarak baris dipakai untuk paragraf yang kena blok (seperti di Word)
function aturJarak(ed, v) {
  // tulisan yang belum ada di dalam paragraf (baris pertama) dibungkus dulu
  const lepas = [...ed.childNodes].filter((n) => !(n.nodeType === 1 && /^(DIV|P|H2|H3|UL|OL)$/.test(n.tagName)));
  if (lepas.length) {
    const sel = window.getSelection(), r = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    let div = null;
    [...ed.childNodes].forEach((n) => {
      if (n.nodeType === 1 && /^(DIV|P|H2|H3|UL|OL)$/.test(n.tagName)) { div = null; return; }
      if (n.nodeType === 3 && !n.nodeValue.trim() && !div) return;
      if (!div) { div = document.createElement("div"); ed.insertBefore(div, n); }
      div.appendChild(n);
      if (n.nodeName === "BR") div = null;
    });
    if (r) { try { sel.removeAllRanges(); sel.addRange(r); } catch (e) {} }
  }
  if (!ed.children.length) ed.innerHTML = "<div><br></div>";
  const sel = window.getSelection();
  const r = sel.rangeCount && ed.contains(sel.getRangeAt(0).commonAncestorContainer) ? sel.getRangeAt(0) : null;
  let blok = r ? [...ed.children].filter((c) => r.intersectsNode(c)) : [];
  if (!blok.length) blok = [ed.lastElementChild];
  blok.forEach((c) => (c.style.lineHeight = v ? jarakKeCss(v) : ""));
  return blok.length;
}
document.addEventListener("change", (e) => {
  const pilih = e.target.closest && e.target.closest("[data-fontsel],[data-gaya]");
  if (!pilih) return;
  if (pilih.value === "__huruf") {        // bukan huruf: buka pengaturan huruf sendiri
    let v = "Nunito"; try { v = namaHuruf(document.queryCommandValue("fontName")) || "Nunito"; } catch (er) {}
    pilih.value = v;
    bukaHurufSaya();
    return;
  }
  const bar = pilih.closest(".rich-tools"), ed = bar && bar.nextElementSibling;
  if (!ed || !ed.classList.contains("editor")) return;
  ed.focus();
  const sel = window.getSelection();
  if (ed._range && ed.contains(ed._range.startContainer)) { sel.removeAllRanges(); sel.addRange(ed._range); }
  else { const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); sel.removeAllRanges(); sel.addRange(r); }
  const css = (on) => { try { document.execCommand("styleWithCSS", false, on); } catch (err) {} };
  const g = pilih.dataset.gaya;
  css(false);
  if (!g) {
    document.execCommand("fontName", false, pilih.value);
    if (sel.isCollapsed) toast("Huruf " + (PETA_HURUF.get(pilih.value.toLowerCase()) || {}).label + " dipakai untuk tulisan berikutnya.");
  } else if (g === "ls") {
    const n = aturJarak(ed, pilih.value);
    if (sel.isCollapsed && n === 1) toast("Jarak baris diatur untuk paragraf ini. Mau semuanya? Blok dulu seluruh tulisannya.");
  } else {
    if (g === "z") document.execCommand("fontSize", false, pilih.value || "3");
    if (g === "w") document.execCommand("foreColor", false, pilih.value || WARNA_TEKS_BAWAAN);
    if (g === "s") { css(true); if (!document.execCommand("hiliteColor", false, pilih.value || "transparent")) document.execCommand("backColor", false, pilih.value || "transparent"); css(false); }
    if (sel.isCollapsed) toast("Dipakai untuk tulisan berikutnya. Untuk mengubah tulisan yang sudah ada, blok dulu tulisannya.");
  }
  ed.dispatchEvent(new Event("input", { bubbles: true }));
});
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-fmt]");
  if (!b) return;
  const bar = b.closest(".rich-tools");
  const ed = bar && bar.nextElementSibling;
  if (!ed || !ed.classList.contains("editor")) return;
  e.preventDefault();
  if (editorAktif() !== ed) {             // belum ada kursor di kotak ini: taruh di akhir
    ed.focus();
    const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false);
    const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }
  const f = b.dataset.fmt;
  if (f === "b") document.execCommand("bold");
  else if (f === "i") document.execCommand("italic");
  else {
    if (!ed.innerHTML.trim()) { ed.innerHTML = "<div><br></div>"; const r = document.createRange(); r.setStart(ed.firstChild, 0); r.collapse(true); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
    const tag = f === "h" ? "H2" : "H3";
    document.execCommand("formatBlock", false, blokSekarang(ed) === tag ? "<div>" : `<${tag.toLowerCase()}>`);
  }
  ed.dispatchEvent(new Event("input", { bubbles: true }));
});
// tombol format tidak mencuri kursor dari kotak tulisan
document.addEventListener("mousedown", (e) => { if (e.target.closest("[data-fmt],[data-stiker],[data-stiker-buka]")) e.preventDefault(); });
document.addEventListener("click", (e) => {
  const buka = e.target.closest("[data-stiker-buka]");
  if (buka) {
    const laci = buka.closest(".rich-tools").querySelector(".laci-stiker");
    isiLaci(laci);
    laci.classList.toggle("hidden");
    buka.setAttribute("aria-expanded", laci.classList.contains("hidden") ? "false" : "true");
    return;
  }
  const st = e.target.closest("[data-stiker]");
  if (!st) return;
  if (st.dataset.stiker === "__foto") { bukaStikerFoto(); return; }
  const bar = st.closest(".rich-tools"), ed = bar && bar.nextElementSibling;
  if (!ed || !ed.classList.contains("editor")) return;
  const sel = window.getSelection();
  if (editorAktif() !== ed) {
    ed.focus();
    if (ed._range && ed.contains(ed._range.startContainer)) { sel.removeAllRanges(); sel.addRange(ed._range); }
    else { const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); sel.removeAllRanges(); sel.addRange(r); }
  }
  const foto = st.dataset.stiker.startsWith("foto:");
  const html = foto ? htmlMelayang("f", st.dataset.stiker.slice(5), 0, -24, 96, 0, true) : htmlMelayang("e", st.dataset.stiker, 0, -16, 56, 0, true);
  if (html) {
    // disisipkan langsung (bukan lewat execCommand): Safari di iPhone mengubah isinya jadi huruf biasa
    const r = sel.rangeCount ? sel.getRangeAt(0) : null;
    const tmp = document.createElement("div"); tmp.innerHTML = html;
    const el = tmp.firstElementChild, spasi = document.createTextNode("\u200b");
    if (r && ed.contains(r.commonAncestorContainer)) { r.deleteContents(); r.insertNode(spasi); r.insertNode(el); }
    else { const akhir = ed.lastElementChild && /^(DIV|P|H2|H3)$/.test(ed.lastElementChild.tagName) ? ed.lastElementChild : ed; akhir.appendChild(el); akhir.appendChild(spasi); }
    const r2 = document.createRange(); r2.setStartAfter(spasi); r2.collapse(true); sel.removeAllRanges(); sel.addRange(r2);
    toast("👆 Geser stikernya ke mana saja. Ketuk stiker untuk ubah ukuran, putar, atau hapus.");
  } else if (!document.execCommand("insertText", false, st.dataset.stiker)) {
    const r = sel.getRangeAt(0); r.deleteContents(); const t = document.createTextNode(st.dataset.stiker); r.insertNode(t); r.setStartAfter(t); r.collapse(true); sel.removeAllRanges(); sel.addRange(r);
  }
  ed.dispatchEvent(new Event("input", { bubbles: true }));
});
document.addEventListener("click", (e) => {
  const lab = e.target.closest("label.field");
  if (!lab || e.target.closest(".editor, .rich-tools, input, select, button")) return;
  const ta = lab.querySelector("textarea[data-rich]");
  if (ta && ta._editor) ta._editor.focus();
});
enhanceRich($("pasteInput"), "block");
enhanceRich($("soalTanya"), "inline");
enhanceRich($("soalJawabEsai"), "block");
enhanceRich($("soalBahas"), "inline");

/* ---------- Simpan otomatis (draf) ---------- */
const DRAF_MATERI = "demuse-belajar-draf-materi";
const DRAF_EDIT = "demuse-belajar-draf-edit";
let modeEdit = null;   // { id, nomor } saat sedang mengedit modul yang sudah ada
const kunciDraf = () => (modeEdit ? DRAF_EDIT : DRAF_MATERI);
const DRAF_SOAL = "demuse-belajar-draf-soal";
const adaIsi = (...xs) => xs.some((x) => String(x ?? "").trim());

function ambilDrafMateri() {
  return { mode: importMode, edit: modeEdit, tempel: $("pasteInput").value };
}
// draf dari versi lama (formulir) diubah jadi teks, supaya ketikan lama tidak hilang
function drafKeTeks(d) {
  if (!d || typeof d !== "object") return "";
  if (d.tempel && tempelBerisi(d.tempel)) return d.tempel;
  if (!adaIsi(d.judul, d.ringkasan, d.poin)) return "";
  const mk = d.mkPilih && library.subjects[d.mkPilih] ? library.subjects[d.mkPilih].mataKuliah : (d.mk || "");
  const judul = String(d.judul || "").split("\n");
  return [`MATA KULIAH: ${mk}`, `MODUL ${d.nomor || 1}: ${judul[0] || ""}`, ...judul.slice(1).filter((x) => x.trim()).map((x) => `SUB-JUDUL: ${x.trim()}`), "",
    d.ringkasan || "", ...(d.poin ? ["", "POIN PENTING:", ...String(d.poin).split("\n")] : [])].join("\n");
}
function drafMateriBerisi(d) { return tempelBerisi(drafKeTeks(d)); }
function pulihkanDrafMateri(d) { $("pasteInput").value = drafKeTeks(d); }

let drafTimer = null;
function tandaiTersimpan(id) {
  const el = $(id); if (!el) return;
  el.textContent = "✓ Tersimpan otomatis";
  el.classList.add("show");
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 1800);
}
function simpanDrafSegera() {
  if ($("importModal").classList.contains("hidden")) return;
  clearTimeout(drafTimer);
  drafTimer = setTimeout(() => {
    const d = ambilDrafMateri();
    writeStore(kunciDraf(), drafMateriBerisi(d) ? d : null);
    if (drafMateriBerisi(d)) tandaiTersimpan("autosaveMateri");
  }, 400);
}
const hapusDrafMateri = () => { clearTimeout(drafTimer); writeStore(kunciDraf(), null); };
function simpanDrafSekarang() {
  if ($("importModal").classList.contains("hidden")) return;
  clearTimeout(drafTimer);
  const d = ambilDrafMateri();
  writeStore(kunciDraf(), drafMateriBerisi(d) ? d : null);
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") simpanDrafSekarang(); });
window.addEventListener("pagehide", simpanDrafSekarang);
$("importModal").addEventListener("input", simpanDrafSegera);
$("importModal").addEventListener("change", simpanDrafSegera);
$("draftClear").addEventListener("click", () => {
  if (!confirm(modeEdit ? "Batalkan perubahan dan kembali ke isi semula?" : "Hapus semua isian ini dan mulai dari kosong?")) return;
  hapusDrafMateri();
  if (modeEdit) { $("pasteInput").value = teksModul(modeEdit.id, modeEdit.nomor); $("draftNote").classList.add("hidden"); showMsg("importMsg", ""); return; }
  $("pasteInput").value = "";
  setMode("tempel");
  $("draftNote").classList.add("hidden");
  showMsg("importMsg", "");
});

/* ---------- Pilih cara (tulis-tempel / file) ---------- */
let importMode = "tempel";
function templatTempel() {
  const d = tampilan === "materi" ? current() : null;
  const nomor = d ? Math.max(0, ...d.modul.map((m) => m.nomor)) + 1 : 1;
  return `MATA KULIAH: ${d ? d.mataKuliah : ""}\nMODUL ${nomor}: `;
}
const tempelBerisi = (t) => String(t || "").split("\n").some((l) => l.trim() && !/^(mata\s*kuliah|modul\s+\d+)\s*:\s*.*$/i.test(l.trim()) ) ||
  /modul\s+\d+\s*:\s*\S/i.test(String(t || ""));
function setMode(mode) {
  importMode = mode;
  if (mode === "tempel" && !$("pasteInput").value.trim()) {
    const t = templatTempel();
    $("pasteInput").value = t + "\n\n";
    setTimeout(() => {      // kursor di akhir baris MODUL, siap mengetik judul modul
      const ed = $("pasteInput")._editor; if (!ed || !ed.children[1]) return;
      try { ed.focus(); const r = document.createRange(); r.selectNodeContents(ed.children[1]); r.collapse(false); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); } catch (e) {}
    }, 50);
  }
  document.querySelectorAll(".mode-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  $("modeTempel").classList.toggle("hidden", mode !== "tempel");
  $("modeFile").classList.toggle("hidden", mode !== "file");
  $("saveImport").classList.toggle("hidden", mode === "file");
  showMsg("importMsg", "");
}
document.querySelectorAll(".mode-btn").forEach((b) => b.addEventListener("click", () => { setMode(b.dataset.mode); simpanDrafSegera(); }));

function aturTampilanEdit() {
  const edit = !!modeEdit;
  $("importTitle").textContent = edit ? "✏️ Edit Materi" : "📥 Masukkan Materi";
  document.querySelector("#importModal .mode-tabs").classList.toggle("hidden", edit);
  document.querySelector("#importModal .modal-box > p.muted").classList.toggle("hidden", edit);
  $("saveImport").textContent = edit ? "💾 Simpan perubahan" : "💾 Simpan materi";
  $("draftClear").textContent = edit ? "Kembalikan isi semula" : "Mulai dari kosong";
}
// Isi modul diubah jadi teks di kotak tulisan (soal & kartu hafalan modul ini tetap tersimpan, tidak ikut diubah)
function teksModul(id, nomor) {
  const s = library.subjects[id], m = s && s.modul.find((x) => x.nomor === nomor);
  if (!m) return "";
  const baris = [`MATA KULIAH: ${s.mataKuliah}`, `MODUL ${m.nomor}: ${m.judul}`, ...(m.subjudul || []).map((x) => `SUB-JUDUL: ${x}`), ""];
  if (m.ringkasan) baris.push(m.ringkasan);
  if (m.poin && m.poin.length) baris.push("", "POIN PENTING:", ...m.poin.map((p) => (/^#{1,3}\s/.test(p) ? p : "- " + p)));
  return baris.join("\n");
}
function bukaEditModul(id, nomor) {
  modeEdit = { id, nomor };
  const draf = readStore(DRAF_EDIT, null);
  const drafCocok = draf && draf.edit && draf.edit.id === id && draf.edit.nomor === nomor && drafMateriBerisi(draf);
  const teks = drafCocok ? drafKeTeks(draf) : teksModul(id, nomor);
  if (!teks) { modeEdit = null; return; }
  $("pasteInput").value = teks;
  setMode("tempel");
  aturTampilanEdit();
  $("draftNote").classList.toggle("hidden", !drafCocok);
  openModal("importModal");
  $("importModal").scrollTop = 0;
}
function openImport() {
  modeEdit = null;
  aturTampilanEdit();
  const draf = readStore(DRAF_MATERI, null);
  $("fileInput").value = "";
  if (drafMateriBerisi(draf)) {
    pulihkanDrafMateri(draf);
    setMode("tempel");
    $("draftNote").classList.remove("hidden");
  } else {
    $("pasteInput").value = "";
    setMode("tempel");
    $("draftNote").classList.add("hidden");
  }
  openModal("importModal");
  $("importModal").scrollTop = 0;
}
document.querySelectorAll("[data-open-import]").forEach((b) => b.addEventListener("click", openImport));

/* ---------- Menyimpan isi kotak tulisan ---------- */
// mata kuliah yang sudah ada dicari dari namanya (atau kodenya)
function cariMk(data) {
  const ids = Object.keys(library.subjects);
  return ids.find((id) => slug(library.subjects[id].mataKuliah) === slug(data.mataKuliah)) ||
    (data.kode ? ids.find((id) => slug(library.subjects[id].kode || "") === slug(data.kode)) : undefined);
}
function simpanTempel(text) {
  try {
    const raw = bacaMateri(text);
    if (raw && !Array.isArray(raw) && !String(raw.mataKuliah || "").trim()) {
      const d = modeEdit ? library.subjects[modeEdit.id] : (tampilan === "materi" ? current() : null);
      if (!d) throw new Error("Nama mata kuliahnya belum ditulis. Isi di baris paling atas: MATA KULIAH: ...");
      raw.mataKuliah = d.mataKuliah;
    }
    const data = normalize(raw);
    if (modeEdit) {
      const asal = library.subjects[modeEdit.id];
      const lama = asal && asal.modul.find((x) => x.nomor === modeEdit.nomor);
      if (!asal || !lama) throw new Error("Modul yang diedit sudah tidak ada.");
      const [utama, ...lain] = data.modul;
      data.modul = [{ ...utama, istilah: [...lama.istilah, ...utama.istilah], soal: [...lama.soal, ...utama.soal], esai: [...lama.esai, ...utama.esai] }];
      const tujuan = slug(data.mataKuliah) === slug(asal.mataKuliah) ? modeEdit.id : (cariMk(data) || "__baru");
      if (tujuan === "__baru") { data.kode = data.kode || asal.kode; data.tanggalUjian = data.tanggalUjian || asal.tanggalUjian; }
      const idTujuan = simpanEditan(modeEdit, tujuan, data);
      if (idTujuan && lain.length) mergeInto(idTujuan, { modul: lain });
      return;
    }
    const id = cariMk(data);
    if (id) {
      const bentrok = data.modul.filter((m) => library.subjects[id].modul.some((x) => x.nomor === m.nomor));
      if (bentrok.length && !confirm(`${bentrok.map((m) => "Modul " + m.nomor).join(", ")} sudah ada di "${library.subjects[id].mataKuliah}".\n\nGanti isinya dengan yang baru ini? (Soal & kartu hafalannya tetap disimpan.)\n\nPilih Batal kalau mau mengganti nomor modulnya dulu.`)) return;
      closeModal("importModal"); hapusDrafMateri();
      mergeInto(id, data);
    } else {
      closeModal("importModal"); hapusDrafMateri();
      saveNew(data);
    }
  } catch (err) {
    showMsg("importMsg", "😕 " + err.message);
  }
}

/* ---------- Cara 3: pilih file (PDF, PowerPoint, Word, .txt) ---------- */
const LIB_PDF = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const LIB_PDF_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const LIB_ZIP = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
const scriptCache = {};
function loadScript(src) {
  if (!scriptCache[src]) {
    scriptCache[src] = new Promise((res, rej) => {
      const el = document.createElement("script");
      el.src = src; el.onload = res;
      el.onerror = () => { delete scriptCache[src]; rej(new Error("Pembaca file gagal dimuat. Pastikan HP/laptop tersambung ke internet, lalu coba lagi.")); };
      document.head.appendChild(el);
    });
  }
  return scriptCache[src];
}

const SUSUNAN_RE = /^\s*(modul|bab)\s+\d+\s*[:.\-–]|^\s*(ringkasan|poin penting|soal)\s*:/im;
const judulDariFile = (name) => name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim() || "Materi dari file";
const bersih = (t) => String(t).replace(/\s+/g, " ").trim();

// Pecah paragraf yang terlalu panjang menjadi beberapa bagian di akhir kalimat
function potongParagraf(p, maks = 600) {
  if (p.length <= maks) return [p];
  const out = []; let cur = "";
  (p.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) || [p]).forEach((k) => {
    if ((cur + k).length > maks && cur) { out.push(cur.trim()); cur = ""; }
    cur += k;
  });
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// Baris-baris teks → paragraf (dipakai PDF & Word)
function barisKeParagraf(lines) {
  const paras = []; let cur = "";
  const tutup = () => { if (cur.trim()) paras.push(bersih(cur)); cur = ""; };
  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) { tutup(); return; }
    if (/^(halaman\s*)?\d{1,4}$/i.test(line)) return;          // nomor halaman
    cur = cur.endsWith("-") ? cur.slice(0, -1) + line : (cur ? cur + " " + line : line);
    if (/[.!?:]["')\]]?$/.test(line) && cur.length > 220) tutup();
  });
  tutup();
  return paras.filter((p) => p.trim().length >= 2);
}

function paragrafKeMateri(paras, judul) {
  if (!paras.length) throw new Error("Tidak ada tulisan yang bisa dibaca di file ini. Kalau file-nya hasil scan/foto, silakan ketik materinya di bagian Tulis / tempel.");
  return { mataKuliah: judul, modul: [{ judul, ringkasan: paras.join("\n\n"), poin: [] }] };
}

async function bacaPdf(file) {
  await loadScript(LIB_PDF);
  const lib = window.pdfjsLib;
  lib.GlobalWorkerOptions.workerSrc = LIB_PDF_WORKER;
  const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const lines = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    showMsg("importMsg", `⏳ Membaca halaman ${p} dari ${pdf.numPages}...`, "ok");
    const isi = await (await pdf.getPage(p)).getTextContent();
    let line = "";
    isi.items.forEach((it) => { line += it.str || ""; if (it.hasEOL) { lines.push(line); line = ""; } });
    if (line) lines.push(line);
    lines.push("");
  }
  const teks = lines.join("\n");
  if (SUSUNAN_RE.test(teks)) return bacaMateri(teks);
  if (teks.replace(/\s/g, "").length < 40) throw new Error("PDF ini sepertinya hasil scan/foto, jadi tulisannya tidak bisa dibaca. Silakan ketik materinya di bagian Tulis / tempel.");
  return paragrafKeMateri(barisKeParagraf(lines), judulDariFile(file.name));
}

const tagNS = (el, name) => [...el.getElementsByTagNameNS("*", name)];
const teksParagraf = (p) => tagNS(p, "t").map((t) => t.textContent).join("").trim();

async function bacaPptx(file) {
  await loadScript(LIB_ZIP);
  const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const nomor = (f) => Number(f.match(/slide(\d+)\.xml$/)[1]);
  const files = Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f)).sort((x, y) => nomor(x) - nomor(y));
  if (!files.length) throw new Error("Isi PowerPoint tidak ditemukan.");
  const slides = [];
  for (const f of files) {
    const doc = new DOMParser().parseFromString(await zip.file(f).async("string"), "application/xml");
    let judul = "", sub = "", isi = [];
    tagNS(doc, "sp").forEach((sp) => {
      const ph = tagNS(sp, "ph")[0];
      const type = ph ? ph.getAttribute("type") || "body" : "";
      if (/^(sldNum|dt|ftr|hdr)$/.test(type)) return;
      const paras = tagNS(sp, "p").map(teksParagraf).filter(Boolean);
      if (!paras.length) return;
      if (type === "title" || type === "ctrTitle") judul = bersih(paras.join(" "));
      else if (type === "subTitle") sub = bersih(paras.join(" "));
      else isi.push(...paras.map(bersih));
    });
    tagNS(doc, "tbl").forEach((tbl) => tagNS(tbl, "tr").forEach((tr) => {
      const sel = tagNS(tr, "tc").map((tc) => tagNS(tc, "p").map(teksParagraf).join(" ").trim()).filter(Boolean);
      if (sel.length) isi.push(sel.join(" – "));
    }));
    if (!judul && isi.length) judul = isi.shift();
    if (judul || sub || isi.length) slides.push({ judul, sub, isi });
  }
  const semua = slides.map((s) => [s.judul, s.sub, ...s.isi].join("\n")).join("\n");
  if (SUSUNAN_RE.test(semua)) return bacaMateri(semua);
  if (!slides.length) throw new Error("Tidak ada tulisan di slide. Kalau isinya gambar semua, silakan ketik materinya di bagian Tulis / tempel.");

  const pertama = slides[0];
  const slideJudul = pertama.sub || !pertama.isi.length;           // slide 1 = slide judul?
  const judul = (slideJudul && pertama.judul) || judulDariFile(file.name);
  const ringkasan = slideJudul ? pertama.sub : "";
  const poin = [], istilah = [];
  (slideJudul ? slides.slice(1) : slides).forEach((s) => {
    const isi = s.isi.join("; ");
    const p = s.judul && isi ? `${s.judul}: ${isi}` : s.judul || isi;
    if (p) poin.push(...potongParagraf(p, 800));
    s.isi.forEach((baris) => {
      const m = baris.match(/^([^:–]{2,50}?)\s*[:–]\s+(.{3,300})$/);
      if (m && m[1].trim().split(/\s+/).length <= 6) istilah.push({ kata: m[1].trim(), arti: m[2].trim() });
    });
  });
  return { mataKuliah: judul, modul: [{ judul, ringkasan, poin, istilah }] };
}

async function bacaDocx(file) {
  await loadScript(LIB_ZIP);
  const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const xml = zip.file("word/document.xml");
  if (!xml) throw new Error("Isi dokumen Word tidak ditemukan.");
  const doc = new DOMParser().parseFromString(await xml.async("string"), "application/xml");
  const lines = tagNS(doc, "p").map(teksParagraf).flatMap((t) => [t, ""]);
  const teks = lines.join("\n");
  if (SUSUNAN_RE.test(teks)) return bacaMateri(teks);
  return paragrafKeMateri(barisKeParagraf(lines), judulDariFile(file.name));
}

async function readFile(file) {
  if (!file) return;
  const name = file.name.toLowerCase();
  if (/\.(ppt|doc)$/.test(name)) { showMsg("importMsg", "📄 File PowerPoint/Word versi lama belum bisa dibaca. Buka file-nya, pilih Save As (Simpan Sebagai), lalu simpan sebagai .pptx atau .docx."); return; }
  if (/\.(jpe?g|png|heic|webp|gif)$/.test(name)) { showMsg("importMsg", "🖼️ Foto tidak bisa dibaca langsung. Silakan ketik materinya di bagian Tulis / tempel."); return; }
  const besar = /\.(pdf|pptx|docx)$/.test(name);
  if (file.size > (besar ? 40 : 5) * 1024 * 1024) { showMsg("importMsg", `😕 File terlalu besar (maks ${besar ? 40 : 5} MB).`); return; }
  showMsg("importMsg", "⏳ Membaca file, tunggu sebentar...", "ok");
  try {
    let raw;
    if (name.endsWith(".pdf")) raw = await bacaPdf(file);
    else if (name.endsWith(".pptx")) raw = await bacaPptx(file);
    else if (name.endsWith(".docx")) raw = await bacaDocx(file);
    else raw = bacaMateri(await file.text());
    const data = normalize(raw);
    showMsg("importMsg", "");
    closeModal("importModal");
    chooseDestination(data);
  } catch (err) {
    showMsg("importMsg", "😕 " + (err && err.message ? err.message : "File tidak bisa dibaca."));
  } finally {
    $("fileInput").value = "";
  }
}

const dz = $("dropzone");
["dragenter", "dragover"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("over"); }));
["dragleave", "drop"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("over"); }));
dz.addEventListener("drop", (e) => readFile(e.dataTransfer.files[0]));
$("fileInput").addEventListener("change", (e) => readFile(e.target.files[0]));
$("saveImport").addEventListener("click", () => {
  const text = $("pasteInput").value.trim();
  if (!text || !String(text).split("\n").some((l) => l.trim() && !/^(mata\s*kuliah|modul\s+\d+)\s*:/i.test(l.trim()))) {
    showMsg("importMsg", "Materinya belum ada. Ketik atau tempel materi kalian di bawah baris MODUL ya."); return;
  }
  simpanTempel(text);
});
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault());

$("tryExample").addEventListener("click", () => {
  saveNew(normalize(CONTOH));
  toast("Ini contohnya. Tekan \"Tambah materi\" untuk memasukkan materi kalian sendiri.");
});

/* ============================================================
   PILIH / SIMPAN KE FILE / HAPUS MATA KULIAH
   ============================================================ */
$("subjectSelect").addEventListener("change", (e) => { library.active = e.target.value; saveLibrary(); renderAll(); });

$("downloadBtn").addEventListener("click", () => {
  const d = current(); if (!d) return;
  const blob = new Blob([toText(d)], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `materi-${courseKey(d)}.txt`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast("💾 File materi tersimpan. Bisa dikirim ke teman lewat WhatsApp.");
});

$("deleteBtn").addEventListener("click", () => {
  const d = current(); if (!d) return;
  if (!confirm(`Hapus materi "${d.mataKuliah}"? Materi yang dihapus tidak bisa dikembalikan.`)) return;
  try { localStorage.removeItem(progressKey()); } catch (e) {}
  delete library.subjects[library.active];
  library.active = Object.keys(library.subjects)[0] || null;
  saveLibrary();
  tampilkanBeranda();
});

/* ============================================================
   TABS
   ============================================================ */
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $(btn.dataset.tab).classList.add("active");
  });
});

/* ============================================================
   COUNTDOWN
   ============================================================ */
function tickCountdown() {
  const box = $("countdown"); const d = tampilan === "materi" ? current() : null;
  if (!d || !d.tanggalUjian) { box.innerHTML = ""; return; }
  const diff = new Date(d.tanggalUjian) - new Date();
  if (isNaN(diff)) { box.innerHTML = ""; return; }
  if (diff <= 0) { box.innerHTML = "<div><strong>🎓</strong><span>Hari ujian! Semangat!</span></div>"; return; }
  const dd = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60;
  box.innerHTML = `<div><strong>${dd}</strong><span>hari</span></div><div><strong>${h}</strong><span>jam</span></div><div><strong>${m}</strong><span>menit</span></div><div style="display:flex;align-items:center"><span>menuju ujian</span></div>`;
}
setInterval(tickCountdown, 30000);

/* ============================================================
   RINGKASAN
   ============================================================ */
function highlight(text, q) {
  const safe = esc(text);
  if (!q) return safe;
  const re = new RegExp("(" + esc(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
  return safe.replace(re, "<mark>$1</mark>");
}
/* ---------- Format tulisan: ## Judul, ### Sub-judul, **tebal**, *miring* ---------- */
function fmtInline(html, untukEditor = false) {
  let h = String(html), sebelum;
  do {   // dari yang paling dalam, supaya gaya di dalam gaya tetap benar
    sebelum = h;
    h = h.replace(/⟦([fzsw]):([^⟦⟧]{1,40})⟧([^⟦⟧]*?)⟦\/\1⟧/g, (_, k, v, t) => gayaHtml(k, v, t, untukEditor));
  } while (h !== sebelum);
  h = h.replace(/⟦st:([a-z0-9]{4,20})⟧/g, (_, id) => htmlStikerFoto(id, "stiker-foto", untukEditor));
  h = h.replace(RE_SF, (_, k, v, dx, dy, uk, rot) => htmlMelayang(k, v, dx, dy, uk, rot, untukEditor));
  h = h.replace(/⟦[^⟦⟧]{0,60}⟧/g, "");    // tanda yang tidak lengkap dibuang, tidak pernah terlihat
  return h
    // tebal + miring sekaligus: ***teks***
    .replace(/\*\*\*(\s*)([^*\n]*?[^*\s])(\s*)\*\*\*/g, "$1<strong><em>$2</em></strong>$3")
    // tebal: **teks** (spasi di dalam tanda tetap dianggap benar)
    .replace(/\*\*(\s*)([^\n]*?[^*\s])(\s*)\*\*/g, "$1<strong>$2</strong>$3")
    // miring: *teks*
    .replace(/(^|[^*\w])\*(?=\S)([^*\n]*?[^*\s])\*(?![\w*])/g, "$1<em>$2</em>")
    .replace(/(^|[^*\w])\*(?=[^\s*])([^*\n])\*(?![\w*])/g, "$1<em>$2</em>")
    // sisa tanda tebal yang tidak berpasangan dibuang, supaya tidak ada "**" yang terlihat
    .replace(/\*\*+/g, "");
}
function richInline(text, q = "") { return fmtInline(highlight(String(text ?? ""), q)).replace(/\n/g, "<br>"); }
function richBlock(text, q = "") {
  const out = []; let para = [], daftar = [], paraLs = null;
  const flushPara = () => { if (para.length) { out.push(`<p${gayaJarak(paraLs)}>${para.map((l) => richInline(l, q)).join("<br>")}</p>`); para = []; } };
  const tutupDaftar = () => { if (daftar.length) { out.push(`<ul>${daftar.map(([l, ls]) => `<li${gayaJarak(ls)}>${richInline(l, q)}</li>`).join("")}</ul>`); daftar = []; } };
  const flush = () => { flushPara(); tutupDaftar(); };
  String(text ?? "").split("\n").forEach((raw) => {
    const [isi, ls] = pisahLs(raw);
    const t = isi.trim(); let m;
    if (!t || /^#{1,3}$/.test(t)) { flush(); return; }
    if ((m = t.match(/^###\s+(.+)/))) { flush(); out.push(`<h6 class="rsub"${gayaJarak(ls)}>${richInline(m[1], q)}</h6>`); return; }
    if ((m = t.match(/^#{1,2}\s+(.+)/))) { flush(); out.push(`<h5 class="rhead"${gayaJarak(ls)}>${richInline(m[1], q)}</h5>`); return; }
    if ((m = t.match(/^([-•–]|\*(?=\s))\s+(.+)/))) { flushPara(); daftar.push([m[2], ls]); return; }
    tutupDaftar();
    if (para.length && paraLs !== ls) flushPara();
    paraLs = ls;
    para.push(t);
  });
  flush();
  return out.join("");
}
function richPoin(list, q = "") {
  let html = "", open = false;
  list.forEach((p0) => {
    const [p, ls] = pisahLs(p0), st = gayaJarak(ls);
    if (/^#{1,3}\s*$/.test(String(p).trim())) return;
    const m = String(p).match(/^(#{1,3})\s+(.+)/);
    if (m) {
      if (open) { html += "</ul>"; open = false; }
      html += m[1].length === 3 ? `<h6 class="rsub"${st}>${richInline(m[2], q)}</h6>` : `<h5 class="rhead"${st}>${richInline(m[2], q)}</h5>`;
    } else {
      if (!open) { html += "<ul>"; open = true; }
      html += `<li${st}>${richInline(p, q)}</li>`;
    }
  });
  if (open) html += "</ul>";
  return html;
}

function renderRingkasan(q = "") {
  const query = q.trim().toLowerCase();
  const html = current().modul.map((m) => {
    const all = [m.judul, ...(m.subjudul || []), m.ringkasan, ...m.poin, ...m.istilah.flatMap((t) => [t.kata, t.arti])].join(" ").toLowerCase();
    if (query && !all.includes(query)) return "";
    return `
      <details class="card modul" ${query ? "open" : ""}>
        <summary><div><span class="num">MODUL ${m.nomor}</span><h3>${highlight(m.judul, query)}</h3>${(m.subjudul || []).map((sj) => `<span class="subjudul">${highlight(sj, query)}</span>`).join("")}</div></summary>
        <div class="modul-body">
          <div class="modul-tools"><button type="button" class="btn small" data-edit-modul-materi="${m.nomor}">✏️ Edit modul ini</button></div>
          ${m.ringkasan ? `<div class="rich">${richBlock(m.ringkasan, query)}</div>` : ""}
          ${m.poin.length ? `<h4>📌 Poin penting</h4><div class="rich">${richPoin(m.poin, query)}</div>` : ""}
          ${m.istilah.length ? `<h4>🔑 Istilah</h4><div class="istilah-grid">${m.istilah.map((t) => `<div class="istilah-item"><b>${richInline(t.kata, query)}</b> — ${richInline(t.arti, query)}</div>`).join("")}</div>` : ""}
        </div>
      </details>`;
  }).join("");
  $("modulList").innerHTML = html || `<div class="card">Tidak ada materi yang cocok dengan "<b>${esc(q)}</b>".</div>`;
}
$("searchInput").addEventListener("input", (e) => renderRingkasan(e.target.value));
$("modulList").addEventListener("click", (e) => {
  const b = e.target.closest("[data-edit-modul-materi]");
  if (b) bukaEditModul(library.active, Number(b.dataset.editModulMateri));
});

const inFilter = (f, nomor) => f === "all" || String(nomor) === String(f);

/* ============================================================
   KARTU HAFALAN
   ============================================================ */
let cards = [], fcIndex = 0;
function buildCards() {
  const f = $("fcFilter").value;
  cards = current().modul.flatMap((m) => (inFilter(f, m.nomor) ? m.istilah.map((t, i) => ({ ...t, _modul: m.nomor, _idx: i })) : []));
  fcIndex = 0; showCard();
}
function showCard() {
  $("fcCard").classList.remove("flipped");
  if (!cards.length) {
    $("fcFront").textContent = "Belum ada kartu hafalan";
    $("fcBack").textContent = "Tekan ✍️ Tambah kartu untuk membuatnya.";
    $("fcCount").textContent = "0 / 0"; $("fcMilik").innerHTML = ""; return;
  }
  $("fcMilik").innerHTML = tombolMilik("kartu", cards[fcIndex]._modul, cards[fcIndex]._idx);
  setTimeout(() => { $("fcFront").innerHTML = richInline(cards[fcIndex].kata); $("fcBack").innerHTML = richInline(cards[fcIndex].arti); }, 150);
  $("fcCount").textContent = `${fcIndex + 1} / ${cards.length}`;
}
$("fcCard").addEventListener("click", () => $("fcCard").classList.toggle("flipped"));
$("fcNext").addEventListener("click", () => { if (cards.length) { fcIndex = (fcIndex + 1) % cards.length; showCard(); } });
$("fcPrev").addEventListener("click", () => { if (cards.length) { fcIndex = (fcIndex - 1 + cards.length) % cards.length; showCard(); } });
$("fcShuffle").addEventListener("click", () => { cards = shuffle(cards); fcIndex = 0; showCard(); });
$("fcFilter").addEventListener("change", buildCards);

/* ============================================================
   SOAL DARI TEMAN (disimpan terpisah, soal asli tidak berubah)
   ============================================================ */
const temanKey = (key) => "demuse-belajar-teman-" + key;
function cleanTeman(list) {
  return (Array.isArray(list) ? list : []).map((s) => {
    const tipe = s.tipe === "esai" ? "esai" : "pg";
    const pilihan = Array.isArray(s.pilihan) ? s.pilihan.map((p) => String(p ?? "").trim()).filter(Boolean) : [];
    const jawaban = tipe === "pg" ? Number(s.jawaban) : String(s.jawaban ?? "");
    return { id: String(s.id ?? ""), tipe, nomorModul: Number(s.nomorModul) || 0, tanya: String(s.tanya ?? "").trim(), pilihan, jawaban, pembahasan: String(s.pembahasan ?? ""), nama: String(s.nama ?? "Teman").trim() || "Teman" };
  }).filter((s) => s.id && s.tanya && (s.tipe === "esai" || (s.pilihan.length >= 2 && s.jawaban >= 0 && s.jawaban < s.pilihan.length)));
}
function temanSoal() {
  const d = current(); if (!d || !hasApi()) return [];
  const dilaporkan = new Set(readStore(LAPOR_KEY, []));
  const milik = new Set(readStore(MILIK_KEY, []));
  return cleanTeman(readStore(temanKey(courseKey(d)), [])).filter((s) => !dilaporkan.has(s.id) && !milik.has(s.id));
}
async function loadTemanSoal() {
  const d = current(); if (!d || !hasApi()) return;
  const key = courseKey(d);
  try {
    const res = await apiGet({ aksi: "soal", kunci: key });
    const fresh = cleanTeman(res.data);
    const old = readStore(temanKey(key), []);
    writeStore(temanKey(key), fresh);
    if (current() && courseKey(current()) === key && JSON.stringify(fresh) !== JSON.stringify(old)) { buildQuiz(); renderEsai(); aturTab(); }
  } catch (e) { /* tetap pakai soal teman yang tersimpan */ }
}

async function laporkan(tipe, id) {
  if (!confirm("Laporkan karena isinya salah atau tidak pantas? Admin akan mengeceknya.")) return false;
  const list = readStore(LAPOR_KEY, []);
  if (!list.includes(id)) { list.push(id); writeStore(LAPOR_KEY, list); }
  try { await apiPost({ aksi: "lapor", tipe, id }); } catch (e) {}
  toast("Terima kasih, laporan terkirim. 🙏");
  return true;
}

/* ============================================================
   LATIHAN SOAL PILIHAN GANDA
   ============================================================ */
let quiz = [], answered = 0, correct = 0;
function buildQuiz(random = false) {
  const f = $("quizFilter").value;
  const src = $("quizSource").value || "all";
  const d = current();
  const ai = src === "all" || src === "ai" ? d.modul.flatMap((m) => (inFilter(f, m.nomor) ? m.soal.map((s, i) => ({ ...s, modul: m.nomor, _idx: i })) : [])) : [];
  const teman = !(src === "all" || src === "teman") ? [] : temanSoal().filter((s) => s.tipe === "pg" && inFilter(f, s.nomorModul))
    .map((s) => ({ tanya: s.tanya, pilihan: s.pilihan, jawaban: s.jawaban, pembahasan: s.pembahasan, modul: s.nomorModul, dari: s.nama, id: s.id }));
  quiz = [...ai, ...teman];
  if (random) quiz = shuffle(quiz);
  answered = 0; correct = 0; renderQuiz();
}
function renderQuiz() {
  if (!quiz.length) {
    const src = $("quizSource").value;
    $("quizList").innerHTML = `<div class="card empty">${src === "teman" ? "Belum ada soal dari teman untuk pilihan ini. Yuk jadi yang pertama membuat soal! ✍️" :
      "Belum ada soal pilihan ganda.<br>Tekan <b>✍️ Buat soal</b> untuk menambahkan."}</div>`;
    updateScore(); return;
  }
  $("quizList").innerHTML = quiz.map((q, qi) => `
    <div class="card q-card" data-q="${qi}">
      <div class="q-meta">SOAL ${qi + 1} · MODUL ${esc(q.modul)}${q.dari ? `<span class="by">✍️ dari ${esc(q.dari)}</span>` : ""}${q.auto ? `<span class="by auto">⚙️ otomatis</span>` : ""}</div>
      <p class="q-text">${richInline(q.tanya)}</p>
      ${q.pilihan.map((p, pi) => `<button class="opt" data-p="${pi}">${String.fromCharCode(65 + pi)}. ${richInline(p)}</button>`).join("")}
      <div class="explain">${q.pembahasan ? "💬 " + richInline(q.pembahasan) : "✅ Jawaban benar sudah ditandai hijau."}</div>
      ${q.id ? `<button class="link-btn" data-lapor="${esc(q.id)}">⚠️ Laporkan soal salah</button>` : ""}
      ${q._idx != null ? tombolMilik("pg", q.modul, q._idx) : ""}
    </div>`).join("");
  updateScore();
}
$("quizList").addEventListener("click", async (e) => {
  const lapor = e.target.closest("[data-lapor]");
  if (lapor) { if (await laporkan("soal", lapor.dataset.lapor)) { buildQuiz(); renderEsai(); } return; }
  const opt = e.target.closest(".opt");
  if (!opt || opt.disabled) return;
  const card = opt.closest(".q-card");
  const q = quiz[card.dataset.q];
  const pick = Number(opt.dataset.p);
  card.querySelectorAll(".opt").forEach((b, i) => { b.disabled = true; if (i === q.jawaban) b.classList.add("correct"); });
  if (pick !== q.jawaban) opt.classList.add("wrong"); else correct++;
  answered++;
  card.querySelector(".explain").classList.add("show");
  updateScore();
});
function updateScore() {
  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  $("scoreText").textContent = `Skor: ${correct} / ${answered} dijawab (${pct}%) · total ${quiz.length} soal`;
}
$("quizFilter").addEventListener("change", () => buildQuiz());
$("quizSource").addEventListener("change", () => buildQuiz());
$("quizShuffle").addEventListener("click", () => buildQuiz(true));
$("quizReset").addEventListener("click", () => buildQuiz());

/* ============================================================
   LATIHAN ESAI
   ============================================================ */
function renderEsai() {
  const ai = current().modul.flatMap((m) => m.esai.map((s, i) => ({ ...s, modul: m.nomor, _idx: i })));
  const teman = temanSoal().filter((s) => s.tipe === "esai").map((s) => ({ tanya: s.tanya, jawaban: s.jawaban, modul: s.nomorModul, dari: s.nama, id: s.id }));
  const items = [...ai, ...teman].sort((a, b) => a.modul - b.modul);
  if (!items.length) { $("esaiList").innerHTML = `<div class="card empty">Belum ada soal esai.<br>Tekan <b>✍️ Buat soal esai</b> untuk menambahkan.</div>`; return; }
  $("esaiList").innerHTML = items.map((s, i) => `
    <div class="card q-card">
      <div class="q-meta">ESAI ${i + 1} · MODUL ${esc(s.modul)}${s.dari ? `<span class="by">✍️ dari ${esc(s.dari)}</span>` : ""}${s.auto ? `<span class="by auto">⚙️ otomatis</span>` : ""}</div>
      <p class="q-text">${richInline(s.tanya)}</p>
      <textarea placeholder="Tulis jawaban kalian di sini..."></textarea>
      <button class="btn primary" data-esai="${i}">Lihat contoh jawaban</button>
      <div class="esai-answer rich" id="esai-${i}">✅ ${richBlock(s.jawaban || "Belum ada contoh jawaban.")}</div>
      ${s.id ? `<div><button class="link-btn" data-lapor="${esc(s.id)}">⚠️ Laporkan soal salah</button></div>` : ""}
      ${s._idx != null ? tombolMilik("esai", s.modul, s._idx) : ""}
    </div>`).join("");
}
$("esaiList").addEventListener("click", async (e) => {
  const lapor = e.target.closest("[data-lapor]");
  if (lapor) { if (await laporkan("soal", lapor.dataset.lapor)) { buildQuiz(); renderEsai(); } return; }
  const btn = e.target.closest("[data-esai]");
  if (!btn) return;
  const box = $("esai-" + btn.dataset.esai);
  box.classList.toggle("show");
  btn.textContent = box.classList.contains("show") ? "Sembunyikan jawaban" : "Lihat contoh jawaban";
});

/* ============================================================
   BUAT SOAL (pilihan ganda, esai, kartu hafalan) — terpisah dari materi
   ============================================================ */
const MILIK_KEY = "demuse-belajar-soal-saya";      // id soal yang kita bagikan sendiri (supaya tidak tampil dobel)
const DAFTAR_JENIS = { pg: "soal", esai: "esai", kartu: "istilah" };
let modeEditSoal = null;   // { tipe, nomor, idx }
function setSoalTipe(tipe) {
  document.querySelectorAll('input[name="soalTipe"]').forEach((r) => (r.checked = r.value === tipe));
  $("pgFields").classList.toggle("hidden", tipe !== "pg");
  $("esaiFields").classList.toggle("hidden", tipe === "pg");
  $("bahasWrap").classList.toggle("hidden", tipe !== "pg");
  $("soalTanyaLabel").textContent = tipe === "kartu" ? "Istilah (depan kartu)" : "Pertanyaan";
  $("soalJawabLabel").textContent = tipe === "kartu" ? "Arti / penjelasan (belakang kartu)" : "Contoh jawaban";
  $("soalShareWrap").classList.toggle("hidden", tipe === "kartu" || !hasApi());
  aturBagikanSoal();
}
function aturBagikanSoal() { $("soalNamaWrap").classList.toggle("hidden", !$("soalShare").checked); }
$("soalShare").addEventListener("change", aturBagikanSoal);
function kosongkanSoal() {
  $("pgOptions").innerHTML = [0, 1, 2, 3].map((i) => `
    <label class="opt-row"><input type="radio" name="soalBenar" value="${i}" aria-label="Jawaban ${String.fromCharCode(65 + i)} benar">
      <input type="text" class="pg-opt" maxlength="300" placeholder="Pilihan ${String.fromCharCode(65 + i)}"></label>`).join("");
  ["soalTanya", "soalJawabEsai", "soalBahas"].forEach((id) => ($(id).value = ""));
  showMsg("soalMsg", "");
}
function openSoalForm(tipe, edit = null) {
  const d = current(); if (!d) return;
  if (!d.modul.length) { toast("Masukkan materinya dulu, baru buat soal."); return; }
  modeEditSoal = edit;
  $("soalModul").innerHTML = d.modul.map((m) => `<option value="${m.nomor}">Modul ${m.nomor}: ${esc(m.judul)}</option>`).join("");
  kosongkanSoal();
  $("soalNama").value = readStore(NAMA_KEY, "");
  $("soalShare").checked = false;
  $("soalTitle").textContent = edit ? "✏️ Edit Soal" : "✍️ Buat Soal";
  $("soalSendLagi").classList.toggle("hidden", !!edit);
  document.querySelectorAll('input[name="soalTipe"]').forEach((r) => (r.disabled = !!edit && r.value !== edit.tipe));
  if (edit) {
    const m = d.modul.find((x) => x.nomor === edit.nomor), item = m && m[DAFTAR_JENIS[edit.tipe]][edit.idx];
    if (!item) return;
    $("soalModul").value = edit.nomor;
    setSoalTipe(edit.tipe);
    if (edit.tipe === "kartu") { $("soalTanya").value = item.kata; $("soalJawabEsai").value = item.arti; }
    else {
      $("soalTanya").value = item.tanya;
      if (edit.tipe === "pg") {
        document.querySelectorAll(".pg-opt").forEach((inp, i) => (inp.value = item.pilihan[i] || ""));
        const rb = document.querySelector(`input[name="soalBenar"][value="${item.jawaban}"]`); if (rb) rb.checked = true;
        $("soalBahas").value = item.pembahasan || "";
      } else $("soalJawabEsai").value = item.jawaban || "";
    }
    $("soalDraftNote").classList.add("hidden");
    openModal("soalModal");
    return;
  }
  const f = tipe === "kartu" ? $("fcFilter").value : $("quizFilter").value;
  if (f && f !== "all") $("soalModul").value = f;
  setSoalTipe(["pg", "esai", "kartu"].includes(tipe) ? tipe : "pg");
  const draf = readStore(DRAF_SOAL, null);
  const berisi = draf && adaIsi(draf.tanya, draf.jawab, draf.bahas, ...(draf.opts || []));
  if (berisi && draf.kunci === courseKey(d)) {
    setSoalTipe(["pg", "esai", "kartu"].includes(draf.tipe) ? draf.tipe : "pg");
    if ([...$("soalModul").options].some((o) => o.value === String(draf.modul))) $("soalModul").value = draf.modul;
    $("soalTanya").value = draf.tanya || ""; $("soalJawabEsai").value = draf.jawab || ""; $("soalBahas").value = draf.bahas || "";
    document.querySelectorAll(".pg-opt").forEach((inp, i) => (inp.value = (draf.opts || [])[i] || ""));
    if (draf.benar != null) { const rb = document.querySelector(`input[name="soalBenar"][value="${Number(draf.benar)}"]`); if (rb) rb.checked = true; }
    $("soalDraftNote").classList.remove("hidden");
  } else {
    $("soalDraftNote").classList.add("hidden");
  }
  openModal("soalModal");
}
document.querySelectorAll("[data-open-soal]").forEach((b) => b.addEventListener("click", () => openSoalForm(b.dataset.openSoal)));
let drafSoalTimer = null;
function simpanDrafSoal() {
  const d = current(); if (!d || modeEditSoal || $("soalModal").classList.contains("hidden")) return;
  clearTimeout(drafSoalTimer);
  drafSoalTimer = setTimeout(() => {
    const draf = {
      kunci: courseKey(d),
      tipe: (document.querySelector('input[name="soalTipe"]:checked') || {}).value || "pg",
      modul: $("soalModul").value,
      tanya: $("soalTanya").value, jawab: $("soalJawabEsai").value, bahas: $("soalBahas").value,
      opts: [...document.querySelectorAll(".pg-opt")].map((x) => x.value),
      benar: (document.querySelector('input[name="soalBenar"]:checked') || {}).value ?? null
    };
    const berisi = adaIsi(draf.tanya, draf.jawab, draf.bahas, ...draf.opts);
    writeStore(DRAF_SOAL, berisi ? draf : null);
    if (berisi) tandaiTersimpan("autosaveSoal");
  }, 400);
}
$("soalModal").addEventListener("input", (e) => { if (e.target.id === "soalNama") writeStore(NAMA_KEY, e.target.value.trim()); else simpanDrafSoal(); });
$("soalModal").addEventListener("change", (e) => { if (e.target.id !== "soalNama") simpanDrafSoal(); });
$("shareNama").addEventListener("input", (e) => writeStore(NAMA_KEY, e.target.value.trim()));
$("soalDraftClear").addEventListener("click", () => {
  if (!confirm("Hapus isian soal ini dan mulai dari kosong?")) return;
  clearTimeout(drafSoalTimer); writeStore(DRAF_SOAL, null);
  kosongkanSoal();
  $("soalDraftNote").classList.add("hidden");
});
document.querySelectorAll('input[name="soalTipe"]').forEach((r) => r.addEventListener("change", () => setSoalTipe(r.value)));

function segarkanLatihan() { buildQuiz(); renderEsai(); buildCards(); aturTab(); renderChecklist(); }

async function simpanSoal(lagi) {
  const d = current(); if (!d) return;
  const tipe = document.querySelector('input[name="soalTipe"]:checked').value;
  const tanya = $("soalTanya").value.trim();
  const nomor = Number($("soalModul").value);
  const modul = d.modul.find((m) => m.nomor === nomor);
  if (!modul) return showMsg("soalMsg", "Pilih modulnya dulu.");
  if (!tanya) return showMsg("soalMsg", tipe === "kartu" ? "Istilahnya belum diisi." : "Pertanyaannya belum diisi.");

  let item;
  if (tipe === "pg") {
    const raw = [...document.querySelectorAll(".pg-opt")].map((i) => i.value.trim());
    const benar = document.querySelector('input[name="soalBenar"]:checked');
    if (raw.filter(Boolean).length < 2) return showMsg("soalMsg", "Isi minimal 2 pilihan jawaban.");
    if (!benar) return showMsg("soalMsg", "Tekan bulatan di samping jawaban yang benar.");
    if (!raw[Number(benar.value)]) return showMsg("soalMsg", "Jawaban yang dipilih sebagai benar masih kosong.");
    const pilihan = []; let jawaban = 0;
    raw.forEach((p, i) => { if (p) { if (i === Number(benar.value)) jawaban = pilihan.length; pilihan.push(p); } });
    item = { tanya, pilihan, jawaban, pembahasan: $("soalBahas").value.trim() };
  } else if (tipe === "esai") {
    const jawaban = $("soalJawabEsai").value.trim();
    if (!jawaban) return showMsg("soalMsg", "Contoh jawabannya belum diisi.");
    item = { tanya, jawaban };
  } else {
    const arti = $("soalJawabEsai").value.trim();
    if (!arti) return showMsg("soalMsg", "Arti / penjelasannya belum diisi.");
    item = { kata: tanya, arti };
  }

  const bagikan = tipe !== "kartu" && hasApi() && $("soalShare").checked;
  const nama = $("soalNama").value.trim();
  if (bagikan && !nama) return showMsg("soalMsg", "Isi nama kalian dulu supaya teman tahu siapa yang membuat soal.");

  // simpan di HP/laptop
  const daftar = DAFTAR_JENIS[tipe];
  if (modeEditSoal) {
    const asal = d.modul.find((m) => m.nomor === modeEditSoal.nomor);
    if (asal) asal[daftar].splice(modeEditSoal.idx, 1, ...(asal === modul ? [item] : []));
    if (asal !== modul) modul[daftar].push(item);
  } else modul[daftar].push(item);
  saveLibrary();
  clearTimeout(drafSoalTimer); writeStore(DRAF_SOAL, null);
  const diedit = !!modeEditSoal;
  segarkanLatihan();

  if (bagikan) {
    writeStore(NAMA_KEY, nama);
    try {
      const res = await apiPost({ aksi: "tambahSoal", kunci: courseKey(d), mataKuliah: d.mataKuliah, nomorModul: nomor, judulModul: modul.judul, tipe, tanya, pilihan: item.pilihan || [], jawaban: item.jawaban, pembahasan: item.pembahasan || "", nama });
      const milik = readStore(MILIK_KEY, []); milik.push(res.id); writeStore(MILIK_KEY, milik);
      toast(res.status === "tampil" ? "🎉 Soal tersimpan dan sudah dibagikan ke teman-teman." : "🎉 Soal tersimpan. Untuk teman-teman, tampil setelah dicek admin.");
    } catch (err) {
      toast("✅ Soal tersimpan di HP/laptop kalian, tapi belum terbagikan: " + errText(err));
    }
  } else {
    toast(diedit ? "✅ Perubahan soal tersimpan." : tipe === "kartu" ? "✅ Kartu hafalan tersimpan." : "✅ Soal tersimpan.");
  }

  if (lagi && !diedit) {            // tetap terbuka untuk soal berikutnya
    kosongkanSoal(); setSoalTipe(tipe); $("soalModul").value = nomor; $("soalShare").checked = bagikan; aturBagikanSoal();
    $("soalDraftNote").classList.add("hidden");
    $("soalModal").scrollTop = 0;
  } else {
    modeEditSoal = null;
    closeModal("soalModal");
  }
}
$("soalSend").addEventListener("click", () => simpanSoal(false));
$("soalSendLagi").addEventListener("click", () => simpanSoal(true));

// Edit / hapus soal & kartu buatan sendiri
function hapusSoal(tipe, nomor, idx) {
  const m = current().modul.find((x) => x.nomor === nomor); if (!m) return;
  if (!confirm(tipe === "kartu" ? "Hapus kartu hafalan ini?" : "Hapus soal ini?")) return;
  m[DAFTAR_JENIS[tipe]].splice(idx, 1);
  saveLibrary(); segarkanLatihan(); toast("🗑️ Dihapus.");
}
document.addEventListener("click", (e) => {
  const ed = e.target.closest("[data-edit-soal]"), del = e.target.closest("[data-hapus-soal]");
  const b = ed || del; if (!b) return;
  const [tipe, nomor, idx] = (b.dataset.editSoal || b.dataset.hapusSoal).split("|");
  if (ed) openSoalForm(tipe, { tipe, nomor: Number(nomor), idx: Number(idx) });
  else hapusSoal(tipe, Number(nomor), Number(idx));
});
const tombolMilik = (tipe, nomor, idx) => `<div class="milik-act">
  <button type="button" class="link-btn" data-edit-soal="${tipe}|${nomor}|${idx}">✏️ Edit</button>
  <button type="button" class="link-btn" data-hapus-soal="${tipe}|${nomor}|${idx}">🗑️ Hapus</button></div>`;

/* ============================================================
   BAGIKAN MATERI KE TEMAN-TEMAN
   ============================================================ */
function jurusanOptions(selected, withAll) {
  const list = [...JURUSAN];
  if (selected && !list.includes(selected) && selected !== "Lainnya") list.push(selected);
  return (withAll ? `<option value="all">Semua jurusan</option>` : `<option value="">— Pilih jurusan —</option>`) +
    list.map((j) => `<option value="${esc(j)}" ${j === selected ? "selected" : ""}>${esc(j)}</option>`).join("") +
    (withAll ? "" : `<option value="Lainnya">Lainnya (tulis sendiri)</option>`);
}
$("shareBtn").addEventListener("click", () => {
  const d = current(); if (!d || !hasApi()) return;
  $("shareSubject").textContent = `Mata kuliah: ${d.mataKuliah}`;
  $("shareNama").value = readStore(NAMA_KEY, "");
  const savedJur = readStore(JURUSAN_KEY, "");
  $("shareJurusan").innerHTML = jurusanOptions(savedJur, false);
  $("shareJurusanLainWrap").classList.add("hidden");
  $("shareJurusanLain").value = "";
  $("shareModules").innerHTML = d.modul.map((m) => `
    <label class="choice"><input type="checkbox" value="${m.nomor}" checked>
      <span>Modul ${m.nomor}: ${esc(m.judul)}<small>${m.soal.length} soal PG · ${m.esai.length} esai · ${m.istilah.length} istilah</small></span></label>`).join("");
  showMsg("shareMsg", "");
  openModal("shareModal");
});
$("shareJurusan").addEventListener("change", (e) => $("shareJurusanLainWrap").classList.toggle("hidden", e.target.value !== "Lainnya"));

$("shareSend").addEventListener("click", async () => {
  const d = current(); if (!d) return;
  const nama = $("shareNama").value.trim();
  let jurusan = $("shareJurusan").value;
  if (jurusan === "Lainnya") jurusan = $("shareJurusanLain").value.trim();
  const picked = [...$("shareModules").querySelectorAll("input:checked")].map((i) => Number(i.value));
  if (!nama) return showMsg("shareMsg", "Nama kalian belum diisi.");
  if (!jurusan) return showMsg("shareMsg", "Jurusannya belum dipilih.");
  if (!picked.length) return showMsg("shareMsg", "Centang minimal satu modul.");

  const data = { ...d, modul: d.modul.filter((m) => picked.includes(m.nomor)) };
  if (JSON.stringify(data).length > 1900000) return showMsg("shareMsg", "Materinya sangat besar. Coba bagikan sebagian modul dulu.");
  writeStore(NAMA_KEY, nama);
  writeStore(JURUSAN_KEY, jurusan);

  const btn = $("shareSend");
  btn.disabled = true; btn.textContent = "Mengirim...";
  try {
    const res = await apiPost({ aksi: "bagikan", nama, jurusan, kunci: courseKey(d), data });
    closeModal("shareModal");
    toast(res.status === "tampil" ? "🎉 Terkirim! Materi kalian sekarang tampil di Beranda, bagian Materi dari teman-teman." : "🎉 Terkirim! Materi kalian akan tampil di Beranda setelah dicek admin.");
    muatBersama();
  } catch (err) {
    showMsg("shareMsg", "😕 " + errText(err));
  } finally {
    btn.disabled = false; btn.textContent = "📤 Bagikan";
  }
});

/* ============================================================
   MATERI BERSAMA (daftar materi dari teman)
   ============================================================ */
let libItems = [];
async function loadLibrary() {
  $("libList").innerHTML = `<div class="empty">⏳ Memuat materi...</div>`;
  try {
    const res = await apiGet({ aksi: "daftar" });
    const dilaporkan = new Set(readStore(LAPOR_KEY, []));
    libItems = (Array.isArray(res.data) ? res.data : []).filter((x) => !dilaporkan.has(String(x.id)));
    const jur = [...new Set(libItems.map((x) => x.jurusan).filter(Boolean))].sort();
    const keep = $("libJurusan").value || readStore(JURUSAN_KEY, "all");
    $("libJurusan").innerHTML = `<option value="all">Semua jurusan</option>` + jur.map((j) => `<option value="${esc(j)}">${esc(j)}</option>`).join("");
    $("libJurusan").value = jur.includes(keep) ? keep : "all";
    renderLibrary();
  } catch (err) {
    $("libList").innerHTML = `<div class="empty">😕 ${esc(errText(err))}</div>`;
  }
}
function renderLibrary() {
  const jur = $("libJurusan").value;
  const q = $("libSearch").value.trim().toLowerCase();
  const items = libItems.filter((x) => (jur === "all" || x.jurusan === jur) &&
    (!q || [x.mataKuliah, x.kode, x.daftarModul].join(" ").toLowerCase().includes(q)));
  if (!items.length) {
    $("libList").innerHTML = `<div class="empty">${libItems.length ? "Tidak ada materi yang cocok." : "Belum ada materi yang dibagikan. Jadilah yang pertama! 🌱"}</div>`;
    return;
  }
  $("libList").innerHTML = items.map((x) => `
    <div class="lib-card">
      ${x.jurusan ? `<span class="jur">${esc(x.jurusan)}</span>` : ""}
      <h3>${esc(x.mataKuliah)}${x.kode ? ` <small class="muted">(${esc(x.kode)})</small>` : ""}</h3>
      <div class="lib-meta">${Number(x.jumlahModul) || 0} modul · ${Number(x.jumlahSoal) || 0} soal · dibagikan oleh ${esc(x.nama || "Teman")}${x.waktu ? " · " + esc(fmtTanggal(x.waktu)) : ""}</div>
      ${x.daftarModul ? `<div class="lib-modules">${esc(x.daftarModul).split(" | ").join("<br>")}</div>` : ""}
      <div class="row">
        <button class="btn pink" data-ambil="${esc(x.id)}">📥 Pakai materi ini</button>
        <button class="link-btn" data-lapor-materi="${esc(x.id)}">⚠️ Laporkan</button>
      </div>
    </div>`).join("");
}
document.querySelectorAll("[data-open-library]").forEach((b) => b.addEventListener("click", () => { if (hasApi()) keBersama(); }));
$("libRefresh").addEventListener("click", loadLibrary);
$("libJurusan").addEventListener("change", renderLibrary);
$("libSearch").addEventListener("input", renderLibrary);
async function klikMateriBersama(e) {
  const lapor = e.target.closest("[data-lapor-materi]");
  if (lapor) {
    if (await laporkan("materi", lapor.dataset.laporMateri)) {
      libItems = libItems.filter((x) => String(x.id) !== lapor.dataset.laporMateri);
      renderLibrary(); renderBersama();
    }
    return;
  }
  const btn = e.target.closest("[data-ambil]");
  if (!btn || btn.disabled) return;
  const label = btn.textContent;
  btn.disabled = true; btn.textContent = "⏳ Mengambil...";
  try {
    const res = await apiGet({ aksi: "ambil", id: btn.dataset.ambil });
    const data = normalize(res.data);
    if (!$("libraryModal").classList.contains("hidden")) closeModal("libraryModal");
    chooseDestination(data);
  } catch (err) {
    toast("😕 " + errText(err));
  } finally {
    btn.disabled = false; btn.textContent = label;
  }
}
$("libList").addEventListener("click", klikMateriBersama);

/* ---------- Materi dari teman-teman, tampil di Beranda (dikelompokkan per jurusan) ---------- */
const BERSAMA_CACHE = "demuse-belajar-bersama-cache";
let bersamaStatus = "belum";   // belum | memuat | siap | gagal
async function muatBersama() {
  if (!hasApi()) return;
  bersamaStatus = "memuat"; renderBersama();
  try {
    const res = await apiGet({ aksi: "daftar" });
    const dilaporkan = new Set(readStore(LAPOR_KEY, []));
    libItems = (Array.isArray(res.data) ? res.data : []).filter((x) => !dilaporkan.has(String(x.id)));
    writeStore(BERSAMA_CACHE, libItems);
    bersamaStatus = "siap";
  } catch (err) {
    const simpanan = readStore(BERSAMA_CACHE, []);
    if (!libItems.length && simpanan.length) libItems = simpanan;
    bersamaStatus = libItems.length ? "siap" : "gagal";
  }
  renderBersama();
}
function renderBersama() {
  const box = $("bersamaList"); if (!box || !hasApi()) return;
  if (bersamaStatus === "memuat" && !libItems.length) { box.innerHTML = `<div class="empty">⏳ Memuat materi dari teman-teman...</div>`; return; }
  if (bersamaStatus === "gagal") { box.innerHTML = `<div class="empty">😕 ${esc(PESAN_OFFLINE)}</div>`; return; }
  const jurAll = [...new Set(libItems.map((x) => x.jurusan || "Lainnya"))].sort((a, b) => (a === "Lainnya") - (b === "Lainnya") || a.localeCompare(b));
  const pilih = $("bJurusan").value;
  $("bJurusan").innerHTML = `<option value="all">Semua jurusan</option>` + jurAll.map((j) => `<option value="${esc(j)}">${esc(j)}</option>`).join("");
  $("bJurusan").value = jurAll.includes(pilih) ? pilih : "all";
  const jurPilih = $("bJurusan").value;
  const q = $("bSearch").value.trim().toLowerCase();
  const items = libItems.filter((x) => (jurPilih === "all" || (x.jurusan || "Lainnya") === jurPilih) &&
    (!q || [x.mataKuliah, x.kode, x.daftarModul, x.nama].join(" ").toLowerCase().includes(q)));
  if (!libItems.length) { box.innerHTML = `<div class="empty">Belum ada materi yang dibagikan.<br>Bagikan materi kalian lewat tombol <b>📤 Bagikan</b> di halaman mata kuliah. 🌱</div>`; return; }
  if (!items.length) { box.innerHTML = `<div class="empty">Tidak ada materi yang cocok.</div>`; return; }
  const namaSaya = String(readStore(NAMA_KEY, "") || "").trim().toLowerCase();
  const jurSaya = readStore(JURUSAN_KEY, "");
  const punyaLokal = new Set(Object.values(library.subjects).flatMap((s) => [courseKey(s), slug(s.mataKuliah)]));
  const grup = {};
  items.forEach((x) => { (grup[x.jurusan || "Lainnya"] = grup[x.jurusan || "Lainnya"] || []).push(x); });
  const urutan = Object.keys(grup).sort((a, b) => (b === jurSaya) - (a === jurSaya) || (a === "Lainnya") - (b === "Lainnya") || a.localeCompare(b));
  const bukaSemua = urutan.length <= 3 || jurPilih !== "all" || q;
  box.innerHTML = urutan.map((j) => `
    <details class="b-group" ${bukaSemua || j === jurSaya ? "open" : ""}>
      <summary><span>🎓 ${esc(j)}</span><span class="b-count">${grup[j].length} materi</span></summary>
      <div class="b-grid">${grup[j].map((x) => {
        const milikSaya = namaSaya && String(x.nama || "").trim().toLowerCase() === namaSaya;
        const sudahAda = punyaLokal.has(slug(x.kode || x.mataKuliah)) || punyaLokal.has(slug(x.mataKuliah));
        return `<div class="lib-card">
          ${milikSaya ? `<span class="jur saya">⭐ Dibagikan oleh kalian</span>` : ""}${sudahAda ? `<span class="jur ada">✓ Ada di daftar kalian</span>` : ""}
          <h3>${esc(x.mataKuliah)}${x.kode ? ` <small class="muted">(${esc(x.kode)})</small>` : ""}</h3>
          <div class="lib-meta">${Number(x.jumlahModul) || 0} modul · oleh <b>${esc(x.nama || "Teman")}</b>${x.waktu ? " · " + esc(fmtTanggal(x.waktu)) : ""}</div>
          ${x.daftarModul ? `<div class="lib-modules">${esc(x.daftarModul).split(" | ").join("<br>")}</div>` : ""}
          <div class="row">
            <button class="btn pink" data-ambil="${esc(x.id)}">📥 Pakai materi ini</button>
            <button class="link-btn" data-lapor-materi="${esc(x.id)}">⚠️ Laporkan</button>
          </div>
        </div>`;
      }).join("")}</div>
    </details>`).join("");
}
$("bersamaList").addEventListener("click", klikMateriBersama);
$("bJurusan").addEventListener("change", renderBersama);
$("bSearch").addEventListener("input", renderBersama);
$("bersamaRefresh").addEventListener("click", muatBersama);
function keBersama() {
  const lanjut = () => setTimeout(() => $("bersamaSection").scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  if (tampilan === "materi") { tampilkanBeranda(); setTimeout(lanjut, 150); } else lanjut();
}

/* ============================================================
   PROGRES
   ============================================================ */
const TASKS = [["baca", "Sudah baca"], ["hafal", "Hafal istilah"], ["latihan", "Sudah latihan"]];
const progKey = (m, key) => `m${m.nomor}-${key}`;
function renderChecklist() {
  const store = readStore(progressKey(), {});
  $("checkList").innerHTML = `<h3 style="margin-bottom:8px">Progres per modul</h3>` + current().modul.map((m) => `
    <div class="check-row">
      <div><b>Modul ${m.nomor}</b><br><small>${esc(m.judul)}</small></div>
      <div class="check-opts">
        ${TASKS.map(([key, label]) => `<label><input type="checkbox" data-key="${progKey(m, key)}" ${store[progKey(m, key)] ? "checked" : ""}>${label}</label>`).join("")}
      </div>
    </div>`).join("");
  updateProgress();
}
function updateProgress() {
  const store = readStore(progressKey(), {});
  const keys = current().modul.flatMap((m) => TASKS.map(([key]) => progKey(m, key)));
  const done = keys.filter((k) => store[k]).length;
  const pct = keys.length ? Math.round((done / keys.length) * 100) : 0;
  $("progressText").textContent = `Progres belajar: ${pct}%`;
  $("progressBar").style.width = pct + "%";
}
$("checkList").addEventListener("change", (e) => {
  if (e.target.type !== "checkbox") return;
  const store = readStore(progressKey(), {});
  store[e.target.dataset.key] = e.target.checked;
  writeStore(progressKey(), store);
  updateProgress();
});
$("resetProgress").addEventListener("click", () => {
  if (confirm("Hapus semua centang di mata kuliah ini?")) { writeStore(progressKey(), {}); renderChecklist(); }
});
$("printBtn").addEventListener("click", () => {
  $("searchInput").value = ""; renderRingkasan();
  document.querySelectorAll("details.modul").forEach((d) => (d.open = true));
  window.print();
});

/* ============================================================
   TAMPILKAN SEMUA
   ============================================================ */
document.querySelectorAll(".needs-api").forEach((el) => el.classList.toggle("api-off", !hasApi()));
if (!hasApi()) { const o = $("quizSource").querySelector('option[value="teman"]'); if (o) o.remove(); }

/* ---------- Beranda (daftar mata kuliah) & halaman materi ---------- */
let tampilan = "beranda";
const TEKS_AWAL = $("mkInfo").textContent;
function persenProgres(id) {
  const s = library.subjects[id]; if (!s) return 0;
  const store = readStore("demuse-belajar-progress-" + id, {});
  const keys = s.modul.flatMap((m) => TASKS.map(([key]) => `m${m.nomor}-${key}`));
  return keys.length ? Math.round((keys.filter((k) => store[k]).length / keys.length) * 100) : 0;
}
function sisaHari(iso) {
  const t = new Date(iso); if (!iso || isNaN(t)) return "";
  const hari = Math.ceil((t - new Date()) / 864e5);
  return hari > 0 ? `⏳ ${hari} hari lagi ujian` : hari === 0 ? "🎓 Ujian hari ini!" : "";
}
function renderBeranda() {
  renderBersama();
  const ids = Object.keys(library.subjects);
  $("courseList").classList.toggle("hidden", !ids.length);
  $("caraPakai").classList.toggle("hidden", ids.length > 0);
  $("caraPakaiLink").classList.toggle("hidden", !ids.length);
  $("tryExample").classList.toggle("hidden", ids.length > 0);
  $("courseCards").innerHTML = ids.map((id) => {
    const s = library.subjects[id], p = persenProgres(id), hari = sisaHari(s.tanggalUjian);
    const b = bukuDari(s, id);
    return `<button type="button" class="course-card buku pola-${b.pola}" data-buka="${esc(id)}" style="--sampul:${WARNA_SAMPUL[b.warna]}" aria-label="Buka ${esc(s.mataKuliah)}">
      <span class="spiral" aria-hidden="true"></span>
      <span class="stiker-sampul" aria-hidden="true">${tampilStiker(b.stiker)}</span>
      <span class="label-buku">
        <span class="cc-name">${esc(s.mataKuliah)}</span>
        <span class="cc-meta">${[s.kode, s.modul.length + " modul"].filter(Boolean).map(esc).join(" · ")}</span>
      </span>
      ${hari ? `<span class="cc-hari">${hari}</span>` : ""}
      <span class="cc-bawah"><span class="cc-bar"><i style="width:${p}%"></i></span><span class="cc-prog">${p}% selesai</span></span>
    </button>`;
  }).join("");
}
function tampilkanBeranda(pakaiRiwayat = true) {
  if (pakaiRiwayat && tampilan === "materi" && adaRiwayat() && history.state && history.state.view === "materi") { history.back(); return; }
  tampilan = "beranda";
  renderAll();
  window.scrollTo(0, 0);
}
function bukaMateri(id, pakaiRiwayat = true) {
  if (!library.subjects[id]) return;
  const dariBeranda = tampilan !== "materi";
  library.active = id; saveLibrary();
  tampilan = "materi";
  if (pakaiRiwayat && dariBeranda && adaRiwayat()) history.pushState({ view: "materi" }, "");
  renderAll();
  window.scrollTo(0, 0);
}
$("courseCards").addEventListener("click", (e) => { const c = e.target.closest("[data-buka]"); if (c) bukaMateri(c.dataset.buka); });
$("backHome").addEventListener("click", () => tampilkanBeranda());
$("caraPakaiLink").addEventListener("click", () => { $("caraPakai").classList.toggle("hidden"); });

/* ============================================================
   CADANGAN: semua materi, progres, dan soal jadi SATU file
   (untuk pindah HP, pindah alamat website, atau jaga-jaga)
   ============================================================ */
const AWALAN = "demuse-belajar-";
function tanggalHariIni() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
async function kirimFile(nama, isi, tipe) {
  const blob = new Blob([isi], { type: tipe });
  // di HP: lewat menu Bagikan (bisa "Simpan ke File" / kirim ke WhatsApp sendiri)
  try {
    const file = new File([blob], nama, { type: tipe });
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: nama });
      return true;
    }
  } catch (e) { if (e && e.name === "AbortError") return false; }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = nama;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return true;
}
$("backupBtn").addEventListener("click", async () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(AWALAN) && k !== BERSAMA_CACHE) data[k] = localStorage.getItem(k);
  }
  if (!Object.keys(library.subjects).length) { toast("Belum ada materi untuk dicadangkan."); return; }
  const isi = JSON.stringify({ jenis: "cadangan-belajar-ujian", versi: 1, dibuat: new Date().toISOString(), data }, null, 1);
  if (await kirimFile(`cadangan-belajar-${tanggalHariIni()}.json`, isi, "application/json"))
    toast(`📦 Cadangan ${Object.keys(library.subjects).length} mata kuliah tersimpan. Simpan file-nya baik-baik ya.`);
});
$("restoreBtn").addEventListener("click", () => $("restoreInput").click());
$("restoreInput").addEventListener("change", async () => {
  const f = $("restoreInput").files[0]; $("restoreInput").value = "";
  if (!f) return;
  try {
    const c = JSON.parse(await f.text());
    if (!c || c.jenis !== "cadangan-belajar-ujian" || !c.data) throw new Error("Ini bukan file cadangan. Pilih file yang namanya cadangan-belajar-....json");
    const lain = readStoreDari(c.data[LIB_KEY]) || { subjects: {} };
    let tambah = 0, sama = 0;
    Object.entries(lain.subjects || {}).forEach(([id, sub]) => {
      const ada = library.subjects[id];
      if (ada && JSON.stringify(ada) === JSON.stringify(sub)) { sama++; return; }
      let idBaru = id;
      if (ada) { idBaru = id + "-" + Date.now().toString(36); while (library.subjects[idBaru]) idBaru += "x"; }   // tidak menimpa materi yang sudah ada
      library.subjects[idBaru] = normalize(sub);
      const prog = c.data["demuse-belajar-progress-" + id];
      if (prog && !localStorage.getItem("demuse-belajar-progress-" + idBaru)) localStorage.setItem("demuse-belajar-progress-" + idBaru, prog);
      tambah++;
    });
    // soal dari teman, nama, dan simpanan lain: hanya diisi kalau belum ada
    Object.entries(c.data).forEach(([k, v]) => {
      if (!k.startsWith(AWALAN) || k === LIB_KEY || k.startsWith("demuse-belajar-progress-") || typeof v !== "string") return;
      try { if (localStorage.getItem(k) == null) localStorage.setItem(k, v); } catch (e) {}
    });
    if (!library.active) library.active = Object.keys(library.subjects)[0] || null;
    saveLibrary(); renderAll();
    toast(tambah ? `✅ ${tambah} mata kuliah dipulihkan${sama ? ` (${sama} sudah ada)` : ""}.` : "Semua materi di cadangan ini sudah ada.");
  } catch (err) {
    toast("😕 " + (err && err.message && !/JSON|token/i.test(err.message) ? err.message : "File cadangan tidak bisa dibaca."));
  }
});
function readStoreDari(v) { try { return JSON.parse(v); } catch (e) { return null; } }

/* Tab yang kosong disembunyikan (Kartu Hafalan hanya muncul kalau ada istilah yang diisi sendiri).
   Latihan Soal & Esai tetap ada kalau fitur berbagi aktif, supaya teman bisa menambah soal. */
function aturTab() {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("hidden"));
}

function renderAll() {
  if (library.active && !library.subjects[library.active]) library.active = null;
  if (!library.active) library.active = Object.keys(library.subjects)[0] || null;
  if (!current()) tampilan = "beranda";
  const d = tampilan === "materi" ? current() : null;
  const has = !!d;
  $("welcome").classList.toggle("hidden", has);
  $("app").classList.toggle("hidden", !has);
  $("subjectBar").classList.toggle("hidden", !has);
  $("progressWrap").classList.toggle("hidden", !has);
  $("backHome").classList.toggle("hidden", !has);

  if (!has) {
    document.title = "Belajar Ujian";
    $("mkTitle").textContent = "Belajar Ujian Jadi Lebih Ringan";
    document.body.classList.remove("buka-buku");
    $("mkInfo").textContent = TEKS_AWAL;
    $("countdown").innerHTML = "";
    renderBeranda();
    return;
  }

  document.title = "Belajar " + d.mataKuliah;
  $("mkTitle").textContent = d.mataKuliah;
  const bk = bukuDari(d, library.active);
  document.body.style.setProperty("--sampul", WARNA_SAMPUL[bk.warna]);
  document.body.classList.add("buka-buku");
  $("modulList").className = "kertas-" + bk.kertas;
  $("mkInfo").textContent = [d.kode, d.info].filter(Boolean).join(" · ");
  $("catatanUmum").textContent = d.catatan ? "💡 " + d.catatan : "";
  $("catatanUmum").classList.toggle("hidden", !d.catatan);

  $("subjectSelect").innerHTML = Object.entries(library.subjects)
    .map(([id, s]) => `<option value="${esc(id)}" ${id === library.active ? "selected" : ""}>📘 ${esc(s.mataKuliah)}</option>`).join("");

  const opts = `<option value="all">Semua modul</option>` + d.modul.map((m) => `<option value="${m.nomor}">Modul ${m.nomor}: ${esc(m.judul)}</option>`).join("");
  $("fcFilter").innerHTML = opts;
  $("quizFilter").innerHTML = opts;

  $("searchInput").value = "";
  tickCountdown();
  renderRingkasan();
  buildCards();
  buildQuiz();
  renderEsai();
  renderChecklist();
  aturTab();
  loadTemanSoal();
}

if (adaRiwayat()) history.replaceState({ view: "beranda" }, "");
libItems = readStore(BERSAMA_CACHE, []) || [];
renderAll();
muatBersama();

/* ============================================================
   APLIKASI (PWA): bisa dipasang & dibuka tanpa internet
   ============================================================ */
if ("serviceWorker" in navigator && /^https:|^http:\/\/(localhost|127\.0\.0\.1)/.test(location.href)) {
  // Versi baru otomatis terpakai saat website dibuka berikutnya (halaman tidak dimuat ulang sendiri)
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js", { updateViaCache: "none" })
      .then((reg) => reg.update())
      .catch(() => {});
  });
}

const sudahDipasang = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
const iniIphone = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let promptPasang = null;

// Android / Chrome / Edge: browser memberi izin pasang
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  promptPasang = e;
  if (!sudahDipasang()) $("installBtn").classList.remove("hidden");
});
// iPhone tidak punya tombol otomatis, jadi tampilkan panduan
if (iniIphone && !sudahDipasang()) $("installBtn").classList.remove("hidden");

$("installBtn").addEventListener("click", async () => {
  if (promptPasang) {
    promptPasang.prompt();
    const pilihan = await promptPasang.userChoice;
    promptPasang = null;
    if (pilihan.outcome === "accepted") $("installBtn").classList.add("hidden");
  } else {
    openModal("iosModal");
  }
});
window.addEventListener("appinstalled", () => {
  $("installBtn").classList.add("hidden");
  toast("🎉 Aplikasi terpasang! Cari ikon \"Belajar Ujian\" di layar HP kalian.");
});


/* ============================================================
   PEMBUAT STIKER FOTO: pilih foto → atur potongan → simpan
   ============================================================ */
const UK_STIKER = 320;
const ps = { img: null, zoom: 1, x: 0, y: 0, bentuk: "lingkaran", latar: 0, pinggir: true, titik: [], menggambar: false };
function bukaStikerFoto() {
  ps.img = null;
  $("psLangkah1").classList.remove("hidden");
  $("psLangkah2").classList.add("hidden");
  $("psSimpan").classList.add("hidden");
  renderDaftarStikerFoto();
  showMsg("psMsg", "");
  openModal("stikerModal");
}
document.addEventListener("click", (e) => { if (e.target.closest("[data-buka-stiker-foto]")) bukaStikerFoto(); });
function renderDaftarStikerFoto() {
  $("psDaftar").innerHTML = stikerFoto.length
    ? stikerFoto.map((f) => `<div class="ps-item">${htmlStikerFoto(f.id, "stiker-foto")}<button type="button" class="link-btn" data-hapus-stiker="${esc(f.id)}">🗑️ Hapus</button></div>`).join("")
    : `<p class="muted">Belum ada stiker foto.</p>`;
}
$("psDaftar").addEventListener("click", (e) => {
  const b = e.target.closest("[data-hapus-stiker]"); if (!b) return;
  if (!confirm("Hapus stiker ini? Stiker yang sudah ditempel di materi juga akan hilang.")) return;
  stikerFoto = stikerFoto.filter((f) => f.id !== b.dataset.hapusStiker);
  writeStore(STIKER_FOTO_KEY, stikerFoto);
  renderDaftarStikerFoto(); segarkanStiker();
});
function tampilLangkah2(on) {
  $("psLangkah1").classList.toggle("hidden", on);
  $("psLangkah2").classList.toggle("hidden", !on);
  $("psSimpan").classList.toggle("hidden", !on);
}
$("psPilih").addEventListener("click", () => $("psFile").click());
$("psGanti").addEventListener("click", () => $("psFile").click());
$("psFile").addEventListener("change", () => {
  const f = $("psFile").files[0]; $("psFile").value = "";
  if (!f) return;
  if (!/^image\//.test(f.type)) { showMsg("psMsg", "😕 Pilih file foto (JPG/PNG) ya."); return; }
  const img = new Image();
  img.onload = () => {
    ps.img = img; ps.zoom = 1; ps.x = 0; ps.y = 0; ps.latar = 0; ps.titik = [];
    $("psZoom").value = 1; $("psLatar").value = 0;
    tampilLangkah2(true); showMsg("psMsg", "");
    gambarStiker();
  };
  img.onerror = () => showMsg("psMsg", "😕 Foto ini tidak bisa dibuka. Coba foto lain (JPG/PNG).");
  img.src = URL.createObjectURL(f);
});
function aturInfoBebas() {
  const bebas = ps.bentuk === "bebas";
  $("psBebasInfo").classList.toggle("hidden", !bebas);
  $("psGeserInfo").classList.toggle("hidden", bebas);
}
document.querySelectorAll('input[name="psBentuk"]').forEach((r) => r.addEventListener("change", () => { ps.bentuk = r.value; aturInfoBebas(); gambarStiker(); }));
$("psUlangGambar").addEventListener("click", () => { ps.titik = []; gambarStiker(); });
$("psZoom").addEventListener("input", () => { ps.zoom = Number($("psZoom").value); gambarStiker(); });
$("psLatar").addEventListener("input", () => { ps.latar = Number($("psLatar").value); gambarStiker(); });
$("psPinggir").addEventListener("change", () => { ps.pinggir = $("psPinggir").checked; gambarStiker(); });
(() => {   // geser foto dengan jari / mouse
  let tarik = null;
  const c = $("psKanvas");
  const titikDi = (e) => { const r = c.getBoundingClientRect(), k = UK_STIKER / r.width; return [(e.clientX - r.left) * k, (e.clientY - r.top) * k]; };
  c.addEventListener("pointerdown", (e) => {
    if (!ps.img) return;
    e.preventDefault();
    try { c.setPointerCapture(e.pointerId); } catch (er) {}
    if (ps.bentuk === "bebas") { ps.titik = [titikDi(e)]; ps.menggambar = true; gambarStiker(); return; }
    tarik = { x: e.clientX, y: e.clientY, ox: ps.x, oy: ps.y };
  });
  c.addEventListener("pointermove", (e) => {
    if (ps.menggambar) {
      const p = titikDi(e), akhir = ps.titik[ps.titik.length - 1];
      if (Math.hypot(p[0] - akhir[0], p[1] - akhir[1]) > 2) { ps.titik.push(p); gambarStiker(); }
      return;
    }
    if (!tarik) return;
    const skala = UK_STIKER / c.getBoundingClientRect().width;
    ps.x = tarik.ox + (e.clientX - tarik.x) * skala; ps.y = tarik.oy + (e.clientY - tarik.y) * skala;
    gambarStiker();
  });
  const lepas = () => {
    tarik = null;
    if (ps.menggambar) { ps.menggambar = false; if (ps.titik.length < 6) ps.titik = []; gambarStiker(); }
  };
  c.addEventListener("pointerup", lepas); c.addEventListener("pointercancel", lepas);
})();
function jalurBentuk(ctx, bentuk, S, m) {
  const w = S - 2 * m, c = S / 2;
  ctx.beginPath();
  if (bentuk === "lingkaran") ctx.arc(c, c, w / 2, 0, Math.PI * 2);
  else if (bentuk === "kotak") { const r = w * 0.2, x = m, y = m; ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + w, r); ctx.arcTo(x + w, y + w, x, y + w, r); ctx.arcTo(x, y + w, x, y, r); ctx.arcTo(x, y, x + w, y, r); }
  else if (bentuk === "hati") {
    ctx.moveTo(c, m + w * 0.97);
    ctx.bezierCurveTo(m - w * 0.02, m + w * 0.6, m + w * 0.02, m + w * 0.05, c - w * 0.24, m + w * 0.06);
    ctx.bezierCurveTo(c - w * 0.08, m + w * 0.06, c, m + w * 0.18, c, m + w * 0.26);
    ctx.bezierCurveTo(c, m + w * 0.18, c + w * 0.08, m + w * 0.06, c + w * 0.24, m + w * 0.06);
    ctx.bezierCurveTo(m + w * 0.98, m + w * 0.05, m + w * 1.02, m + w * 0.6, c, m + w * 0.97);
  } else if (bentuk === "bintang") {
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? w * 0.25 : w * 0.52, a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx.lineTo(c + Math.cos(a) * r, c + w * 0.05 + Math.sin(a) * r);
    }
  } else if (bentuk === "awan") {
    ctx.arc(c - w * 0.24, c + w * 0.08, w * 0.24, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(c - w * 0.04, c - w * 0.12, w * 0.28, Math.PI * 1.05, Math.PI * 1.85);
    ctx.arc(c + w * 0.24, c + w * 0.05, w * 0.25, Math.PI * 1.4, Math.PI * 0.5);
    ctx.lineTo(c - w * 0.24, c + w * 0.32);
  } else if (bentuk === "bebas" && ps.titik.length > 2) {
    ps.titik.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  } else ctx.rect(0, 0, S, S);
  ctx.closePath();
}
// hapus latar polos: mulai dari tepi foto, warna yang mirip latar dibuat tembus pandang
function hapusLatar(ctx, S, tol) {
  const data = ctx.getImageData(0, 0, S, S), p = data.data;
  const tepi = [];
  for (let i = 0; i < S; i++) tepi.push([i, 0], [i, S - 1], [0, i], [S - 1, i]);
  const kumpul = tepi.map(([x, y]) => (y * S + x) * 4).filter((k) => p[k + 3] > 200);
  if (!kumpul.length) return;
  const rata = [0, 1, 2].map((j) => kumpul.reduce((a, k) => a + p[k + j], 0) / kumpul.length);
  const batas = (tol / 100) * 170, lunak = Math.max(1, batas * 0.35);
  const jarak = (k) => Math.hypot(p[k] - rata[0], p[k + 1] - rata[1], p[k + 2] - rata[2]);
  const lihat = new Uint8Array(S * S), antre = [];
  tepi.forEach(([x, y]) => { const i = y * S + x; if (!lihat[i] && jarak(i * 4) <= batas) { lihat[i] = 1; antre.push(i); } });
  while (antre.length) {
    const i = antre.pop(), k = i * 4, d = jarak(k);
    p[k + 3] = d < batas - lunak ? 0 : Math.round(p[k + 3] * Math.min(1, (d - (batas - lunak)) / lunak));
    const x = i % S, y = (i / S) | 0;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= S || ny >= S) continue;
      const j = ny * S + nx;
      if (!lihat[j] && jarak(j * 4) <= batas) { lihat[j] = 1; antre.push(j); }
    }
  }
  ctx.putImageData(data, 0, 0);
}
function buatStiker() {
  const S = UK_STIKER, m = ps.pinggir ? 16 : 4;
  const kv = () => { const c = document.createElement("canvas"); c.width = c.height = S; return c; };
  const foto = kv(), fc = foto.getContext("2d");
  const img = ps.img, dasar = Math.max(S / img.width, S / img.height) * ps.zoom;
  const w = img.width * dasar, h = img.height * dasar;
  fc.drawImage(img, (S - w) / 2 + ps.x, (S - h) / 2 + ps.y, w, h);
  if (ps.latar > 0) hapusLatar(fc, S, ps.latar);
  const pot = kv(), pc = pot.getContext("2d");
  if (ps.bentuk !== "asli") { jalurBentuk(pc, ps.bentuk, S, m); pc.clip(); }
  pc.drawImage(foto, 0, 0);
  const hasil = kv(), hc = hasil.getContext("2d");
  if (ps.pinggir) {
    const tebal = 10;
    for (let a = 0; a < 24; a++) hc.drawImage(pot, Math.cos((a / 24) * Math.PI * 2) * tebal, Math.sin((a / 24) * Math.PI * 2) * tebal);
    hc.globalCompositeOperation = "source-in"; hc.fillStyle = "#ffffff"; hc.fillRect(0, 0, S, S);
    hc.globalCompositeOperation = "source-over";
  }
  hc.drawImage(pot, 0, 0);
  return hasil;
}
function gambarStiker() {
  if (!ps.img) return;
  const c = $("psKanvas"), ctx = c.getContext("2d"), S = UK_STIKER;
  c.width = c.height = S;
  ctx.clearRect(0, 0, S, S);
  // mode bebas: selama menggambar (atau belum ada garis), tampilkan seluruh foto + garis potongnya
  if (ps.bentuk === "bebas" && (ps.menggambar || ps.titik.length < 3)) {
    const img = ps.img, dasar = Math.max(S / img.width, S / img.height) * ps.zoom;
    const w = img.width * dasar, h = img.height * dasar;
    ctx.globalAlpha = 0.85; ctx.drawImage(img, (S - w) / 2 + ps.x, (S - h) / 2 + ps.y, w, h); ctx.globalAlpha = 1;
    if (ps.titik.length > 1) {
      ctx.lineJoin = ctx.lineCap = "round";
      ctx.beginPath(); ps.titik.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 7; ctx.stroke();
      ctx.setLineDash([10, 8]); ctx.strokeStyle = "#e0558a"; ctx.lineWidth = 4; ctx.stroke(); ctx.setLineDash([]);
    }
    return;
  }
  ctx.drawImage(buatStiker(), 0, 0);
}
// buang bagian kosong di sekeliling stiker, supaya ukurannya pas
function rapikanStiker(src, ukuran) {
  const S = src.width, p = src.getContext("2d").getImageData(0, 0, S, S).data;
  let x0 = S, y0 = S, x1 = -1, y1 = -1;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (p[(y * S + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const out = document.createElement("canvas"); out.width = out.height = ukuran;
  if (x1 < 0) return out;
  const w = x1 - x0 + 1, h = y1 - y0 + 1, sisi = Math.max(w, h) * 1.04;
  const k = ukuran / sisi;
  out.getContext("2d").drawImage(src, x0, y0, w, h, (ukuran - w * k) / 2, (ukuran - h * k) / 2, w * k, h * k);
  return out;
}
$("psSimpan").addEventListener("click", () => {
  if (!ps.img) return;
  if (stikerFoto.length >= MAKS_STIKER_FOTO) { showMsg("psMsg", `Stiker foto sudah ${MAKS_STIKER_FOTO}. Hapus yang tidak dipakai dulu ya.`); return; }
  if (ps.bentuk === "bebas" && ps.titik.length < 3) { showMsg("psMsg", "Gambar dulu garis mengelilingi bagian foto yang mau diambil ya."); return; }
  const kecil = rapikanStiker(buatStiker(), 220);
  let data = kecil.toDataURL("image/webp", 0.85);
  if (!data.startsWith("data:image/webp")) data = kecil.toDataURL("image/png");
  stikerFoto.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), data });
  if (!writeStore(STIKER_FOTO_KEY, stikerFoto)) {
    stikerFoto.pop();
    showMsg("psMsg", "😕 Penyimpanan HP penuh. Hapus beberapa stiker foto dulu ya.");
    return;
  }
  toast("🎉 Stiker foto tersimpan. Bisa dipilih di 🌟 Stiker dan di sampul buku.");
  ps.img = null; ps.titik = []; tampilLangkah2(false);
  renderDaftarStikerFoto(); segarkanStiker();
});
function segarkanStiker() {
  if (!$("editMkModal").classList.contains("hidden")) {
    const pilih = (document.querySelector('input[name="emStiker"]:checked') || {}).value;
    isiPilihanStikerSampul(pilih); pratinjauBuku();
  }
  document.querySelectorAll(".laci-stiker:not(.hidden)").forEach(isiLaci);
  renderAll();
}


/* ============================================================
   HURUF SENDIRI: tambah dari file font, hapus
   ============================================================ */
const MAKS_FILE_HURUF = 1.5 * 1024 * 1024;
function bukaHurufSaya() { renderHurufSaya(); showMsg("hfMsg", ""); openModal("hurufModal"); }
function renderHurufSaya() {
  $("hfDaftar").innerHTML = hurufSaya.length
    ? hurufSaya.map((h, i) => { const n = namaAmanHuruf(h.nama); return `<div class="hf-item"><span style="font-family:'${esc(n)}', 'Nunito', sans-serif">${esc(n)} — Belajar itu menyenangkan</span><button type="button" class="link-btn" data-hapus-huruf="${i}">🗑️ Hapus</button></div>`; }).join("")
    : `<p class="muted">Belum ada huruf tambahan.</p>`;
}
$("hfPilih").addEventListener("click", () => $("hfFile").click());
$("hfFile").addEventListener("change", async () => {
  const f = $("hfFile").files[0]; $("hfFile").value = "";
  if (!f) return;
  if (!/\.(ttf|otf|woff2?)$/i.test(f.name)) { showMsg("hfMsg", "😕 Pilih file huruf yang berakhiran .ttf, .otf, .woff, atau .woff2 ya."); return; }
  if (f.size > MAKS_FILE_HURUF) { showMsg("hfMsg", "😕 File huruf ini terlalu besar (maks 1,5 MB). Coba versi .woff2 atau pilih satu ketebalan saja, misalnya \"Regular\"."); return; }
  const nama = namaAmanHuruf(f.name);
  if (!nama) { showMsg("hfMsg", "😕 Nama file huruf tidak bisa dipakai. Ganti nama file-nya dulu, misalnya \"HurufLucu.ttf\"."); return; }
  if (PETA_HURUF.has(nama.toLowerCase()) && !hurufSaya.some((h) => namaAmanHuruf(h.nama).toLowerCase() === nama.toLowerCase())) { showMsg("hfMsg", "Nama huruf ini sudah ada di daftar."); return; }
  showMsg("hfMsg", "⏳ Memasang huruf...", "ok");
  const data = await new Promise((ok, gagal) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = gagal; r.readAsDataURL(f); });
  const baru = { nama, data: String(data).replace(/^data:[^;]*;/, "data:font/" + f.name.split(".").pop().toLowerCase() + ";") };
  try { await daftarkanHuruf(baru); } catch (err) { PETA_HURUF.delete(nama.toLowerCase()); showMsg("hfMsg", "😕 File ini bukan huruf yang bisa dipakai. Coba file lain."); return; }
  const lama = hurufSaya.findIndex((h) => namaAmanHuruf(h.nama).toLowerCase() === nama.toLowerCase());
  if (lama >= 0) hurufSaya[lama] = baru; else hurufSaya.push(baru);
  if (!writeStore(HURUF_SAYA_KEY, hurufSaya)) {
    if (lama >= 0) hurufSaya = readStore(HURUF_SAYA_KEY, []); else hurufSaya.pop();
    showMsg("hfMsg", "😕 Penyimpanan HP penuh, huruf tidak bisa disimpan. Hapus huruf atau stiker foto yang tidak dipakai dulu.");
    return;
  }
  showMsg("hfMsg", `✅ Huruf "${nama}" siap dipakai. Pilih di daftar jenis huruf (ada tanda ✨).`, "ok");
  renderHurufSaya(); segarkanPilihanHuruf(); renderAll();
});
$("hfDaftar").addEventListener("click", (e) => {
  const b = e.target.closest("[data-hapus-huruf]"); if (!b) return;
  const h = hurufSaya[Number(b.dataset.hapusHuruf)]; if (!h) return;
  const nama = namaAmanHuruf(h.nama);
  if (!confirm(`Hapus huruf "${nama}"? Tulisan yang memakai huruf ini akan kembali ke huruf biasa.`)) return;
  hurufSaya.splice(Number(b.dataset.hapusHuruf), 1);
  writeStore(HURUF_SAYA_KEY, hurufSaya);
  PETA_HURUF.delete(nama.toLowerCase());
  renderHurufSaya(); segarkanPilihanHuruf(); renderAll();
});

/* ============================================================
   STIKER MELAYANG: geser dengan jari, ketuk untuk ubah ukuran/putar/hapus
   ============================================================ */
const panelStiker = document.createElement("div");
panelStiker.className = "panel-stiker hidden";
panelStiker.innerHTML = `<button type="button" data-ps="kecil" aria-label="Perkecil">➖</button><button type="button" data-ps="besar" aria-label="Perbesar">➕</button>
  <button type="button" data-ps="kiri" aria-label="Putar ke kiri">↺</button><button type="button" data-ps="kanan" aria-label="Putar ke kanan">↻</button>
  <button type="button" data-ps="hapus" aria-label="Hapus stiker">🗑️</button><button type="button" data-ps="selesai" aria-label="Selesai">✔️</button>`;
document.body.appendChild(panelStiker);
let stikerAktif = null, geser = null;
const bacaSf = (j) => { const [v, dx, dy, uk, rot] = String(j.dataset.sf).split("|"); return { v, dx: +dx, dy: +dy, uk: +uk, rot: +rot }; };
function tulisSf(j, d) {
  j.dataset.sf = [d.v, Math.round(d.dx), Math.round(d.dy), Math.round(d.uk), Math.round(d.rot)].join("|");
  const m = j.firstElementChild;
  m.style.left = Math.round(d.dx) + "px"; m.style.top = Math.round(d.dy) + "px";
  m.style.width = m.style.height = Math.round(d.uk) + "px";
  m.style.transform = `rotate(${Math.round(d.rot)}deg)`;
  const em = m.querySelector(".sf-emoji"); if (em) em.style.fontSize = Math.round(d.uk * 0.78) + "px";
}
function simpanEditorDari(j) { const ed = j.closest(".editor"); if (ed) ed.dispatchEvent(new Event("input", { bubbles: true })); }
function tutupPanelStiker() { panelStiker.classList.add("hidden"); if (stikerAktif) stikerAktif.classList.remove("dipilih"); stikerAktif = null; }
function letakkanPanel() {
  if (!stikerAktif) return;
  const r = stikerAktif.firstElementChild.getBoundingClientRect();
  const lebar = panelStiker.offsetWidth || 280;
  panelStiker.style.left = Math.max(8, Math.min(window.innerWidth - lebar - 8, r.left + r.width / 2 - lebar / 2)) + "px";
  const bawah = r.bottom + 8, muat = bawah + 56 < window.innerHeight;
  panelStiker.style.top = (muat ? bawah : Math.max(8, r.top - 56)) + "px";
}
// Di HP dipakai sentuhan (touch), di laptop dipakai mouse. Sentuhan di stiker
// dicegah supaya HP tidak menggulir halaman / memunculkan keyboard saat stiker digeser.
function mulaiGeser(target, x, y) {
  const j = target && target.closest && target.closest(".editor .jangkar");
  if (!j || !j.firstElementChild) return false;
  const m = j.firstElementChild, ed = j.closest(".editor");
  geser = { m, j, ed, x, y, d0: { ...bacaSf(j) }, gerak: false };
  return true;
}
document.addEventListener("touchstart", (e) => {
  if (e.touches.length !== 1) return;
  const t = e.touches[0];
  if (mulaiGeser(e.target, t.clientX, t.clientY)) e.preventDefault();
  else if (!e.target.closest(".panel-stiker")) tutupPanelStiker();
}, { passive: false });
document.addEventListener("touchmove", (e) => {
  if (!geser) return;
  e.preventDefault();
  const t = e.touches[0]; gerakGeser(t.clientX, t.clientY);
}, { passive: false });
document.addEventListener("touchend", (e) => { if (geser) { e.preventDefault(); lepasGeser(); } }, { passive: false });
document.addEventListener("touchcancel", () => lepasGeser());
document.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "touch") return;          // sudah ditangani touchstart
  if (mulaiGeser(e.target, e.clientX, e.clientY)) { e.preventDefault(); try { geser.m.setPointerCapture(e.pointerId); } catch (er) {} }
  else if (!e.target.closest(".panel-stiker")) tutupPanelStiker();
});
document.addEventListener("pointermove", (e) => { if (geser && e.pointerType !== "touch") gerakGeser(e.clientX, e.clientY); });
function gerakGeser(cx, cy) {
  if (!geser) return;
  const ddx = cx - geser.x, ddy = cy - geser.y;
  if (!geser.gerak && Math.hypot(ddx, ddy) < 5) return;
  geser.gerak = true;
  if (stikerAktif) panelStiker.classList.add("hidden");
  // tetap di dalam kotak tulisan
  const a = geser.j.getBoundingClientRect(), b = geser.ed.getBoundingClientRect(), uk = geser.d0.uk;
  const d = { ...geser.d0 };
  d.dx = Math.max(b.left - a.left, Math.min(b.right - a.left - uk, geser.d0.dx + ddx));
  d.dy = Math.max(b.top - a.top, Math.min(b.bottom - a.top - uk, geser.d0.dy + ddy));
  tulisSf(geser.j, d);
}
const lepasGeser = () => {
  if (!geser) return;
  const g = geser; geser = null;
  if (g.gerak) { simpanEditorDari(g.j); if (stikerAktif === g.j) { panelStiker.classList.remove("hidden"); letakkanPanel(); } return; }
  // ketuk: pilih stiker
  if (stikerAktif && stikerAktif !== g.j) stikerAktif.classList.remove("dipilih");
  stikerAktif = g.j; g.j.classList.add("dipilih");
  panelStiker.classList.remove("hidden"); letakkanPanel();
};
document.addEventListener("pointerup", (e) => { if (e.pointerType !== "touch") lepasGeser(); });
document.addEventListener("pointercancel", (e) => { if (e.pointerType !== "touch") lepasGeser(); });
panelStiker.addEventListener("pointerdown", (e) => e.preventDefault());
panelStiker.addEventListener("click", (e) => {
  const b = e.target.closest("[data-ps]"); if (!b || !stikerAktif) return;
  const j = stikerAktif, d = bacaSf(j), aksi = b.dataset.ps;
  if (aksi === "selesai") { tutupPanelStiker(); return; }
  if (aksi === "hapus") { const ed = j.closest(".editor"); tutupPanelStiker(); j.remove(); if (ed) ed.dispatchEvent(new Event("input", { bubbles: true })); return; }
  if (aksi === "kecil") d.uk = Math.max(24, d.uk - 12);
  if (aksi === "besar") d.uk = Math.min(320, d.uk + 12);
  if (aksi === "kiri") d.rot = Math.max(-180, d.rot - 10);
  if (aksi === "kanan") d.rot = Math.min(180, d.rot + 10);
  tulisSf(j, d); simpanEditorDari(j); letakkanPanel();
});
window.addEventListener("scroll", () => { if (stikerAktif) letakkanPanel(); }, true);
