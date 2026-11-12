/* ---------- 1. Data awal ---------- */

// Organisasi & ekstrakurikuler (n: nama, d: deskripsi, j: jadwal, p: pembina)
const ORGS = [
  { n: "OSIS",         d: "Organisasi Siswa Intra Sekolah, wadah aspirasi dan kepemimpinan siswa.", j: "Senin, 14.00",  p: "Bu Rina" },
  { n: "MPK",          d: "Majelis Perwakilan Kelas, pengawas dan penyalur aspirasi kelas.",        j: "Selasa, 14.00", p: "Pak Hadi" },
  { n: "Ambalan",      d: "Gugus depan Pramuka: kepanduan, tali-temali, dan perkemahan.",           j: "Jumat, 15.00",  p: "Pak Joko" },
  { n: "PMR",          d: "Palang Merah Remaja: pertolongan pertama dan kegiatan kemanusiaan.",     j: "Rabu, 14.30",   p: "Bu Sari" },
  { n: "Pecinta Alam", d: "Pendakian, konservasi, dan pelatihan survival.",                         j: "Sabtu, 07.00",  p: "Pak Dedi" },
  { n: "Futsal",       d: "Latihan futsal dan persiapan turnamen antar sekolah.",                   j: "Selasa, 15.30", p: "Pak Agus" },
  { n: "Voli",         d: "Latihan bola voli putra dan putri.",                                     j: "Kamis, 15.30",  p: "Bu Wati" },
  { n: "Basket",       d: "Latihan basket dan pembinaan tim sekolah.",                              j: "Rabu, 15.30",   p: "Pak Anto" },
  { n: "Hadroh",       d: "Seni musik rebana dan shalawat untuk acara keagamaan.",                  j: "Jumat, 14.00",  p: "Ust. Fauzi" },
  { n: "PIK-R",        d: "Pusat Informasi dan Konseling Remaja: edukasi kesehatan remaja.",        j: "Kamis, 14.00",  p: "Bu Lina" }
];

// Jenis informasi
const TYPES = ["Ekstrakurikuler", "Acara", "Ujian", "Libur", "Pengumuman"];

// Akun awal (u: username, p: kata sandi, n: nama, r: peran, j: ekskul diikuti)
const SEED_U = [
  { u: "admin", p: "admin123", n: "Administrator",  r: "admin", j: [] },
  { u: "guru",  p: "guru123",  n: "Bu Rina (Guru)", r: "guru",  j: [] },
  { u: "siswa", p: "siswa123", n: "Andi (Siswa)",   r: "siswa", j: ["OSIS"] }
];

// Informasi awal (t: jenis, o: organisasi, ti: judul, dt: tanggal, ds: keterangan, a: pembuat)
const SEED_I = [
  { id: 1, t: "Ujian",           o: "Umum",         ti: "Penilaian Akhir Semester Ganjil", dt: "2026-12-07", ds: "PAS dilaksanakan 7–18 Desember. Kartu ujian diambil di wali kelas.",       a: "guru" },
  { id: 2, t: "Libur",           o: "Umum",         ti: "Libur Semester Ganjil",           dt: "2026-12-21", ds: "Libur 21 Desember 2026 – 2 Januari 2027. Masuk kembali 4 Januari.",         a: "admin" },
  { id: 3, t: "Acara",           o: "OSIS",         ti: "Peringatan Hari Guru Nasional",   dt: "2026-11-25", ds: "Upacara dan penampilan seni untuk guru di lapangan sekolah.",              a: "admin" },
  { id: 4, t: "Acara",           o: "Futsal",       ti: "Turnamen Futsal Antar Kelas",     dt: "2026-11-20", ds: "Pendaftaran tim ke pembina sebelum 15 November.",                          a: "guru" },
  { id: 5, t: "Ekstrakurikuler", o: "PMR",          ti: "Pelatihan Pertolongan Pertama",   dt: "2026-11-18", ds: "Materi RJP dan penanganan luka. Bawa seragam PMR.",                        a: "guru" },
  { id: 6, t: "Pengumuman",      o: "Umum",         ti: "Pembayaran Seragam Olahraga",     dt: "2026-11-14", ds: "Batas pembayaran seragam olahraga hingga 14 November di TU.",              a: "admin" },
  { id: 7, t: "Acara",           o: "Pecinta Alam", ti: "Pendakian Bersama Gunung Wilis",  dt: "2026-11-28", ds: "Berkumpul 04.00 di sekolah. Wajib izin orang tua.",                        a: "guru" },
  { id: 8, t: "Acara",           o: "Hadroh",       ti: "Penampilan Maulid Sekolah",       dt: "2026-11-22", ds: "Latihan tambahan Kamis dan Jumat sebelum acara.",                          a: "guru" }
];


/* ---------- 2. Penyimpanan (localStorage) ---------- */

const mem = {};   // cadangan di memori jika localStorage tidak tersedia

// Membaca data
const ld = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : (mem[key] || fallback);
  } catch (e) {
    return mem[key] || fallback;
  }
};

// Menyimpan data
const sv = (key, value) => {
  mem[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};


/* ---------- 3. State aplikasi ---------- */

let users = ld("sk_u", SEED_U);       // daftar pengguna
let items = ld("sk_i", SEED_I);       // daftar informasi
let me    = ld("sk_me", null);        // pengguna yang sedang login
let view  = "home";                   // halaman aktif
let edit  = null;                     // id informasi yang sedang diubah
let f     = { q: "", t: "", o: "" };  // filter: pencarian, jenis, organisasi
let theme = ld("sk_theme", null);     // tema: "light", "dark", atau null (ikut perangkat)


/* ---------- Tema (mode gelap & terang) ---------- */

// Memasang tema pada <html> (dibaca oleh style.css lewat data-theme)
function applyTheme() {
  if (theme) document.documentElement.setAttribute("data-theme", theme);
  else document.documentElement.removeAttribute("data-theme");
}

// Apakah tampilan saat ini gelap?
const isDark = () => theme
  ? theme === "dark"
  : window.matchMedia("(prefers-color-scheme: dark)").matches;

// Teks tombol: menawarkan mode kebalikan dari yang aktif
const themeLabel = () => isDark() ? "☀️ Mode Terang" : "🌙 Mode Gelap";

// Ganti tema, simpan pilihan, dan perbarui teks semua tombol tema
function toggleTheme() {
  theme = isDark() ? "light" : "dark";
  sv("sk_theme", theme);
  applyTheme();
  document.querySelectorAll(".theme-btn").forEach(b => b.textContent = themeLabel());
}


/* ---------- 4. Fungsi bantu ---------- */

// Mengamankan teks dari karakter HTML berbahaya
const E = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));

// Nama jenis menjadi nama kelas CSS ("Ekstrakurikuler" -> "ekstrakurikuler")
const tgl = t => t.toLowerCase().replace(/[^a-z]/g, "");

// Format tanggal Indonesia
const fd = d => new Date(d + "T00:00:00").toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

const $ = s => document.querySelector(s);
const today = () => new Date().toISOString().slice(0, 10);
const sorted = () => [...items].sort((a, b) => a.dt.localeCompare(b.dt));

// Hak akses
const isStaff = () => me && (me.r === "admin" || me.r === "guru");
const canEdit = i => me && (me.r === "admin" || (me.r === "guru" && i.a === me.u));

// Buka / tutup sidebar di HP
const tsb = () => document.body.classList.toggle("open");


/* ---------- 5. Kerangka halaman & sidebar ---------- */

function render() {
  document.body.classList.remove("open");
  if (!me) return loginView();

  // Menu sidebar menurut peran
  const tabs = [
    ["home", "🏠", "Beranda"],
    ["keg",  "📅", "Kegiatan"],
    ["eks",  "🏅", "Ekstrakurikuler"]
  ];
  if (isStaff())         tabs.push(["kel", "✏️", "Kelola Informasi"]);
  if (me.r === "admin")  tabs.push(["usr", "👥", "Pengguna"]);

  const cur = tabs.find(t => t[0] === view);

  $("#app").innerHTML = `
    <aside class="sb">
      <div class="brand">🏫 Smkn 2 Trenggalek</div>
      <div class="me">${E(me.n)}<br><span class="tag">${me.r}</span></div>
      ${tabs.map(t => `
        <button class="menu-i ${view === t[0] ? "on" : ""}" onclick="go('${t[0]}')">
          <span>${t[1]}</span>${t[2]}
        </button>`).join("")}
      <button class="theme-btn" onclick="toggleTheme()">${themeLabel()}</button>
      <button class="out" onclick="logout()">Keluar</button>
    </aside>

    <div class="ov" onclick="tsb()"></div>

    <div class="content">
      <div class="top">
        <button onclick="tsb()" aria-label="Menu">☰</button>
        <b>${cur ? cur[2] : ""}</b>
      </div>
      <main id="m"></main>
    </div>`;

  // Tampilkan halaman yang aktif
  ({ home, keg, eks, kel, usr })[view]();
}

function go(v) {
  view = v;
  edit = null;
  render();
  window.scrollTo(0, 0);
}


/* ---------- 6. Login & logout ---------- */

function loginView() {
  $("#app").innerHTML = `
    <div class="login">
      <button class="theme-btn theme-fab" onclick="toggleTheme()">${themeLabel()}</button>
      <div class="box">
        <h1>🏫Login to school information </h1>
        <p class="mu">Masuk untuk melihat informasi sekolah.</p>

        <label>Username</label>
        <input id="lu" autocomplete="username">

        <label>Kata sandi</label>
        <input id="lp" type="password" autocomplete="current-password"
               onkeydown="if(event.key==='Enter')login()">

        <p id="le" style="color:var(--dg);min-height:1.2em;font-size:.85rem"></p>
        <button class="btn" style="width:100%" onclick="login()">Masuk</button>

      </div>
    </div>`;
}

function fill(u, p) {
  $("#lu").value = u;
  $("#lp").value = p;
}

function login() {
  const u = users.find(x => x.u === $("#lu").value.trim() && x.p === $("#lp").value);
  if (!u) {
    $("#le").textContent = "Username atau kata sandi salah.";
    return;
  }
  me = { u: u.u, n: u.n, r: u.r };
  sv("sk_me", me);
  view = "home";
  render();
}

function logout() {
  me = null;
  sv("sk_me", null);
  render();
}


/* ---------- 7. Komponen kartu ---------- */

const tag = i => `
  <span class="tag ${tgl(i.t)}">${E(i.t)}</span>
  <span class="tag">${E(i.o)}</span>`;

const itemCard = i => `
  <div class="card k-${tgl(i.t)}">
    ${tag(i)}
    <h3>${E(i.ti)}</h3>
    <p>📅 ${fd(i.dt)}</p>
    <p>${E(i.ds)}</p>
  </div>`;


/* ---------- 8. Halaman: Beranda ---------- */

function home() {
  const upcoming      = sorted().filter(i => i.dt >= today() && i.t !== "Pengumuman").slice(0, 6);
  const announcements = items.filter(i => i.t === "Pengumuman").slice(-3).reverse();
  const joined        = (users.find(u => u.u === me.u)?.j || []).length;

  $("#m").innerHTML = `
    <div class="grid sec">
      <div class="card stat"><b>${items.length}</b>Informasi</div>
      <div class="card stat"><b>${ORGS.length}</b>Ekstrakurikuler</div>
      <div class="card stat"><b>${items.filter(i => i.t === "Ujian").length}</b>Jadwal ujian</div>
      <div class="card stat">
        <b>${me.r === "siswa" ? joined : users.length}</b>
        ${me.r === "siswa" ? "Ekskul diikuti" : "Pengguna"}
      </div>
    </div>

    <div class="sec">
      <h2>📢 Pengumuman terbaru</h2>
      <div class="grid">
        ${announcements.map(itemCard).join("") || '<div class="empty">Belum ada pengumuman.</div>'}
      </div>
    </div>

    <div class="sec">
      <h2>🗓️ Kegiatan mendatang</h2>
      <div class="grid">
        ${upcoming.map(itemCard).join("") || '<div class="empty">Tidak ada kegiatan mendatang.</div>'}
      </div>
    </div>`;
}


/* ---------- 9. Halaman: Kegiatan ---------- */

function keg() {
  const typeOptions = TYPES.map(t =>
    `<option ${f.t === t ? "selected" : ""}>${t}</option>`).join("");

  const orgOptions = ORGS.map(o =>
    `<option ${f.o === o.n ? "selected" : ""}>${o.n}</option>`).join("");

  $("#m").innerHTML = `
    <h2>Semua kegiatan</h2>
    <div class="bar">
      <input placeholder="Cari…" value="${E(f.q)}" oninput="f.q=this.value;list()">
      <select onchange="f.t=this.value;list()">
        <option value="">Semua jenis</option>${typeOptions}
      </select>
      <select onchange="f.o=this.value;list()">
        <option value="">Semua organisasi</option>
        <option ${f.o === "Umum" ? "selected" : ""}>Umum</option>${orgOptions}
      </select>
    </div>
    <div class="grid" id="l"></div>`;

  list();
}

// Menampilkan daftar sesuai filter
function list() {
  const q = f.q.toLowerCase();
  const result = sorted().filter(i =>
    (!f.t || i.t === f.t) &&
    (!f.o || i.o === f.o) &&
    (i.ti + i.ds).toLowerCase().includes(q)
  );

  $("#l").innerHTML = result.map(itemCard).join("")
    || '<div class="empty" style="grid-column:1/-1">Tidak ada data yang cocok.</div>';
}


/* ---------- 10. Halaman: Ekstrakurikuler ---------- */

function eks() {
  const mine = users.find(u => u.u === me.u)?.j || [];

  const cards = ORGS.map((o, x) => {
    const joined = mine.includes(o.n);
    const count  = items.filter(i => i.o === o.n).length;

    const joinBtn = me.r === "siswa"
      ? `<button class="btn s ${joined ? "d" : ""}" onclick="toggleJ('${o.n}')">${joined ? "Keluar" : "Gabung"}</button>`
      : "";

    return `
      <div class="card org c${x % 6}">
        <h3>${E(o.n)}</h3>
        <p>${E(o.d)}</p>
        <p>🕒 ${E(o.j)}<br>👤 Pembina: ${E(o.p)}<br>📌 ${count} informasi</p>
        <div class="row">
          <button class="btn o s" onclick="f={q:'',t:'',o:'${o.n}'};go('keg')">Lihat info</button>
          ${joinBtn}
        </div>
      </div>`;
  }).join("");

  $("#m").innerHTML = `<h2>Ekstrakurikuler & organisasi</h2><div class="grid">${cards}</div>`;
}

// Siswa bergabung / keluar dari ekskul
function toggleJ(name) {
  const u = users.find(x => x.u === me.u);
  u.j = u.j || [];
  u.j = u.j.includes(name) ? u.j.filter(x => x !== name) : [...u.j, name];
  sv("sk_u", users);
  eks();
}


/* ---------- 11. Halaman: Kelola Informasi (admin & guru) ---------- */

function kel() {
  // Data formulir: informasi yang diubah, atau formulir kosong
  const e = (edit && items.find(i => i.id === edit)) || {
    t: "Pengumuman", o: "Umum", ti: "", dt: today(), ds: ""
  };

  const rows = sorted().filter(canEdit);

  const typeOptions = TYPES.map(t =>
    `<option ${e.t === t ? "selected" : ""}>${t}</option>`).join("");

  const orgOptions = ORGS.map(o =>
    `<option ${e.o === o.n ? "selected" : ""}>${o.n}</option>`).join("");

  const tableRows = rows.map(i => `
    <tr>
      <td>${E(i.ti)}<br><span class="mu">${E(i.o)}</span></td>
      <td>${E(i.t)}</td>
      <td>${fd(i.dt)}</td>
      <td>
        <button class="btn o s" onclick="editI(${i.id})">Ubah</button>
        <button class="btn d s" onclick="delI(${i.id})">Hapus</button>
      </td>
    </tr>`).join("") || '<tr><td colspan="4" class="empty">Belum ada data.</td></tr>';

  $("#m").innerHTML = `
    <h2>${edit ? "Ubah" : "Tambah"} informasi</h2>
    <div class="card sec ${edit ? "editing" : ""}">
      <div class="grid">
        <div><label>Jenis</label><select id="ft">${typeOptions}</select></div>
        <div><label>Organisasi</label>
          <select id="fo"><option ${e.o === "Umum" ? "selected" : ""}>Umum</option>${orgOptions}</select>
        </div>
        <div><label>Tanggal</label><input type="date" id="fd" value="${e.dt}"></div>
      </div>

      <label>Judul</label>
      <input id="fi" value="${E(e.ti)}">

      <label>Keterangan</label>
      <textarea id="fs" rows="3">${E(e.ds)}</textarea>

      <div class="row" style="margin-top:12px">
        <button class="btn" onclick="saveI()">Simpan</button>
        ${edit ? '<button class="btn o" onclick="go(\'kel\')">Batal</button>' : ""}
      </div>
    </div>

    <h2>${me.r === "admin" ? "Semua informasi" : "Informasi buatan Anda"}</h2>
    <div class="card tw">
      <table>
        <tr><th>Judul</th><th>Jenis</th><th>Tanggal</th><th></th></tr>
        ${tableRows}
      </table>
    </div>`;
}

// Masuk mode ubah, lalu gulir ke formulir
function editI(id) {
  edit = id;
  kel();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Simpan (tambah baru atau perbarui)
function saveI() {
  const ti = $("#fi").value.trim();
  if (!ti) {
    alert("Judul wajib diisi.");
    return;
  }

  const data = {
    t:  $("#ft").value,
    o:  $("#fo").value,
    ti: ti,
    dt: $("#fd").value,
    ds: $("#fs").value.trim()
  };

  if (edit) {
    items = items.map(i => i.id === edit ? { ...i, ...data } : i);
  } else {
    items.push({ id: Date.now(), ...data, a: me.u });
  }

  sv("sk_i", items);
  edit = null;
  kel();
}

function delI(id) {
  if (confirm("Hapus informasi ini?")) {
    items = items.filter(i => i.id !== id);
    sv("sk_i", items);
    kel();
  }
}


/* ---------- 12. Halaman: Pengguna (admin) ---------- */

function usr() {
  const tableRows = users.map(u => `
    <tr>
      <td>${E(u.n)}</td>
      <td>${E(u.u)}</td>
      <td><span class="tag">${u.r}</span></td>
      <td>${u.u === me.u ? "" : `<button class="btn d s" onclick="delU('${E(u.u)}')">Hapus</button>`}</td>
    </tr>`).join("");

  $("#m").innerHTML = `
    <h2>Tambah pengguna</h2>
    <div class="card sec">
      <div class="grid">
        <div><label>Nama</label><input id="un"></div>
        <div><label>Username</label><input id="uu"></div>
        <div><label>Kata sandi</label><input id="up"></div>
        <div><label>Peran</label>
          <select id="ur">
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn" onclick="addU()">Tambah</button>
      </div>
    </div>

    <h2>Daftar pengguna</h2>
    <div class="card tw">
      <table>
        <tr><th>Nama</th><th>Username</th><th>Peran</th><th></th></tr>
        ${tableRows}
      </table>
    </div>`;
}

function addU() {
  const n = $("#un").value.trim();
  const u = $("#uu").value.trim();
  const p = $("#up").value;

  if (!n || !u || !p) {
    alert("Semua kolom wajib diisi.");
    return;
  }
  if (users.some(x => x.u === u)) {
    alert("Username sudah dipakai.");
    return;
  }

  users.push({ u, p, n, r: $("#ur").value, j: [] });
  sv("sk_u", users);
  usr();
}

function delU(username) {
  if (confirm("Hapus pengguna ini?")) {
    users = users.filter(x => x.u !== username);
    sv("sk_u", users);
    usr();
  }
}


/* ---------- Jalankan aplikasi ---------- */
applyTheme();
render();
