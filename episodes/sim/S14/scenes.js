/* S14 Simulasi praktik: mengatur privasi akun di aplikasi media sosial rekaan "Lingkar" (memakai layar_hp.js + bantu.js).
   HP besar di kiri (cx 560), lup di tengah, panel langkah di kanan. Menyambung D9.4: akun privat, bio tanpa data pribadi,
   lokasi, tanda (tag), pesan, tinjauan tanda. Semua akun, nama, sekolah, alamat, dan nomor rekaan (nomor disamarkan). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, HP = K.hp, B = K.bantu;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const { BLUE, RED, GREEN, ORANGE } = B;
  const LK = "#5A62C9", LKBG = "#ECEDFB";

  // ---------- data rekaan ----------
  const NAME0 = "Sinta Ayu Lestari", NAME1 = "Sinta";
  const BIO0 = ["SMPN 9 Kota Pelangi · kelas 9B", "Jl. Melati No. 12, Kota Pelangi", "WA 0812 xxxx 7788", "suka menggambar dan kucing"];
  const BIO1 = ["suka menggambar dan kucing", "gambar baru tiap hari Minggu"];
  const POSTS = ["#F2C98A", "#9CC9E0", "#A8D5B5", "#E8A9A0", "#C3B5E0", "#F0D58C"];

  // ---------- gambar kecil ----------
  function avatar(c, x, y, r, who = "sinta") {
    c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.clip();
    const bg = { sinta: "#F6D9C4", dito: "#CFE3F2" }[who];
    if (bg) { c.fillStyle = bg; c.fillRect(x - r, y - r, 2 * r, 2 * r);
      c.fillStyle = C.hair; c.beginPath(); c.arc(x, y - r * 0.05, r * 0.52, Math.PI, 0); c.fill(); if (who === "sinta") { c.fillRect(x - r * 0.52, y - r * 0.05, r * 0.2, r * 0.6); c.fillRect(x + r * 0.32, y - r * 0.05, r * 0.2, r * 0.6); }
      c.fillStyle = C.skin; c.beginPath(); c.arc(x, y + r * 0.08, r * 0.38, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(x, y + r * 1.1, r * 0.62, Math.PI, 0); c.fill();
      c.fillStyle = C.ink; c.beginPath(); c.arc(x - r * 0.13, y + r * 0.06, r * 0.05, 0, Math.PI * 2); c.arc(x + r * 0.13, y + r * 0.06, r * 0.05, 0, Math.PI * 2); c.fill(); }
    else { c.fillStyle = who === "promo" ? "#E07B2E" : "#8A99A3"; c.fillRect(x - r, y - r, 2 * r, 2 * r); text(c, who === "promo" ? "%" : "?", x, y + r * 0.35, r, { align: "center", weight: 900, color: "#FFFFFF" }); }
    c.restore();
  }
  function catPic(c, x, y, w, h) {
    c.fillStyle = "#F4E3C3"; c.fillRect(x, y, w, h); c.fillStyle = "#D9B98A"; c.fillRect(x, y + h * 0.72, w, h * 0.28);
    const cx = x + w * 0.5, cy = y + h * 0.62; c.fillStyle = "#E39A4E"; c.beginPath(); c.ellipse(cx, cy, w * 0.22, h * 0.14, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(cx - w * 0.2, cy - h * 0.06, h * 0.1, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.moveTo(cx - w * 0.27, cy - h * 0.12); c.lineTo(cx - w * 0.25, cy - h * 0.22); c.lineTo(cx - w * 0.2, cy - h * 0.14); c.moveTo(cx - w * 0.17, cy - h * 0.14); c.lineTo(cx - w * 0.13, cy - h * 0.22); c.lineTo(cx - w * 0.12, cy - h * 0.1); c.fill();
    c.strokeStyle = "#E39A4E"; c.lineWidth = h * 0.04; c.lineCap = "round"; c.beginPath(); c.moveTo(cx + w * 0.2, cy); c.quadraticCurveTo(cx + w * 0.34, cy - h * 0.02, cx + w * 0.3, cy - h * 0.16); c.stroke();
    c.strokeStyle = C.ink; c.lineWidth = 1.5; c.beginPath(); c.arc(cx - w * 0.24, cy - h * 0.06, 3, 0, Math.PI); c.arc(cx - w * 0.16, cy - h * 0.06, 3, 0, Math.PI); c.stroke();
  }
  function sleepPic(c, x, y, w, h) {
    c.fillStyle = "#DCE9F2"; c.fillRect(x, y, w, h); c.fillStyle = "#3E6B57"; c.fillRect(x + w * 0.1, y + h * 0.08, w * 0.8, h * 0.28);
    c.fillStyle = "#C98A57"; c.fillRect(x, y + h * 0.66, w, h * 0.12);
    const hx = x + w * 0.45, hy = y + h * 0.58; c.fillStyle = "#FFFFFF"; c.beginPath(); c.ellipse(hx + w * 0.08, hy + h * 0.06, w * 0.2, h * 0.08, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = C.skin; c.beginPath(); c.arc(hx, hy, h * 0.11, 0, Math.PI * 2); c.fill(); c.fillStyle = C.hair; c.beginPath(); c.arc(hx + h * 0.02, hy - h * 0.02, h * 0.11, Math.PI * 0.9, Math.PI * 1.9); c.fill();
    text(c, "z", x + w * 0.62, y + h * 0.46, h * 0.08, { weight: 900, color: "#5B6B76" }); text(c, "Z", x + w * 0.68, y + h * 0.4, h * 0.11, { weight: 900, color: "#5B6B76" });
  }
  function menuIcon(c, x, y, hl) { if (hl) { c.fillStyle = "#FFF3D6"; c.beginPath(); c.arc(x, y, 22, 0, Math.PI * 2); c.fill(); c.strokeStyle = C.accent; c.lineWidth = 2.5; c.stroke(); }
    c.fillStyle = C.ink; for (let i = -1; i <= 1; i++) rr(c, x - 12, y + i * 8 - 1.5, 24, 3, 1.5), c.fill(); }

  // ---------- layar Lingkar ----------
  // profil. o: priv, name, bio, hl (indeks baris bio disorot merah), view ("self"|"public"), menuHl, editHl, follow
  function profile(c, o = {}) {
    c.fillStyle = "#FFFFFF"; c.fillRect(0, 36, HP.W, HP.H - 36);
    const pub = o.view === "public";
    if (pub) HP.icon(c, "back", 30, 70, 24, C.ink);
    const ux = pub ? 56 : 22; text(c, "sinta.senja", ux, 79, 23, { weight: 900 });
    if (o.priv) { c.font = "900 23px Inter"; HP.icon(c, "lock", ux + c.measureText("sinta.senja").width + 18, 71, 18, C.ink); }
    if (!pub) { HP.icon(c, "plus", 284, 70, 24, C.ink); menuIcon(c, 330, 70, o.menuHl); }
    avatar(c, 64, 160, 42, "sinta");
    [["24", "unggahan"], ["312", "pengikut"], ["180", "mengikuti"]].forEach(([n, s], i) => { text(c, n, 162 + i * 72, 156, 21, { align: "center", weight: 900 }); text(c, s, 162 + i * 72, 178, 13, { align: "center", weight: 600, color: "#5B6B76" }); });
    const bio = o.bio || BIO0; let y = 236;
    text(c, o.name || NAME0, 22, y, 18, { weight: 800 }); y += 6;
    bio.forEach((s, i) => { y += 24; if (o.hl && o.hl.includes(i)) { c.fillStyle = C.badBg; rr(c, 16, y - 18, 328, 24, 6); c.fill(); } text(c, s, 22, y, 16, { weight: 600, color: o.hl && o.hl.includes(i) ? RED : C.ink, fit: 316 }); });
    y += 18; const out = {};
    if (pub) out.btn = HP.button(c, 16, y, 328, 40, o.follow || "Ikuti", { fill: LK, r: 10, size: 17 });
    else out.btn = HP.button(c, 16, y, 328, 40, "Edit profil", { fill: "#EEF1F4", ink: C.ink, r: 10, size: 17, hl: o.editHl });
    y += 58; c.fillStyle = "#E3E9EE"; c.fillRect(0, y, HP.W, 1.5);
    if (pub && o.priv) { c.strokeStyle = C.ink; c.lineWidth = 2.5; c.beginPath(); c.arc(180, y + 70, 30, 0, Math.PI * 2); c.stroke(); HP.icon(c, "lock", 180, y + 70, 28, C.ink);
      text(c, "Akun ini privat", 180, y + 134, 19, { align: "center", weight: 800 }); text(c, "Ikuti untuk melihat unggahannya.", 180, y + 160, 15, { align: "center", weight: 600, color: "#5B6B76" }); }
    else POSTS.forEach((col, i) => { const px = 1 + (i % 3) * 120, py = y + 2 + Math.floor(i / 3) * 120; if (i === 0) catPic(c, px, py, 118, 118); else { c.fillStyle = col; c.fillRect(px, py, 118, 118); } });
    out.bioTop = 236; out.bioBottom = 236 + 6 + bio.length * 24; out.gridTop = y;
    return out;
  }
  const SHEET = ["Pengaturan dan privasi", "Arsip", "Aktivitasmu", "Tersimpan"];
  function sheet(c, hl, u = 1) {
    c.save(); c.globalAlpha = ease(u); c.fillStyle = "rgba(15,22,28,0.45)"; c.fillRect(0, 0, HP.W, HP.H);
    const y0 = HP.H - 300 + (1 - ease(u)) * 120; c.fillStyle = "#FFFFFF"; rr(c, 0, y0, HP.W, 330, 24); c.fill(); c.fillStyle = "#C9D4DB"; rr(c, 156, y0 + 10, 48, 5, 3); c.fill();
    [["gear"], ["clock"], ["update"], ["photo"]].forEach(([ic], i) => { const y = y0 + 36 + i * 58; if (hl === i) { c.fillStyle = "#FFF3D6"; rr(c, 10, y, 340, 52, 12); c.fill(); }
      HP.icon(c, ic, 40, y + 26, 22, C.ink); text(c, SHEET[i], 70, y + 33, 19, { weight: 700 }); });
    c.restore(); return { row: i => ({ x: 180, y: y0 + 62 + i * 58 }) };
  }
  const ROOT = (o = {}) => [{ section: "SIAPA YANG BISA MELIHAT" }, { label: "Privasi akun", icon: "lock", value: o.priv ? "Privat" : "Publik", valueColor: o.priv ? GREEN : RED, arrow: true, hl: o.hl === 1 },
    { label: "Permintaan mengikuti", icon: "contacts", badge: o.req ? null : "3", arrow: true, hl: o.hl === 2 },
    { section: "BAGAIMANA ORANG LAIN BERINTERAKSI" }, { label: "Lokasi", icon: "location", arrow: true, hl: o.hl === 4 }, { label: "Tanda dan sebutan", icon: "user", arrow: true, hl: o.hl === 5 },
    { label: "Pesan", icon: "chat", arrow: true, hl: o.hl === 6 }, { label: "Akun yang diblokir", icon: "close", arrow: true }];
  function rootPage(c, o = {}) { HP.header(c, "Pengaturan dan privasi", { back: true }); return HP.list(c, ROOT(o), { y: 112 }); }
  const ROOT_ROWS = () => B.rowsOf(ROOT(), { y: 112 });
  const PRIV_DLG = { icon: "lock", title: "Ubah ke akun privat?", body: "Hanya pengikut yang kamu setujui yang bisa melihat unggahanmu. Foto profil, nama, dan bio tetap terlihat oleh semua orang.", buttons: ["Ubah ke privat", "Batal"], stack: true };
  function privPage(c, o = {}) {
    HP.header(c, "Privasi akun", { back: true });
    const r = HP.list(c, [{ label: "Akun privat", toggle: o.on || 0, hl: o.hl }], { y: 120 });
    HP.para(c, o.on >= 1 ? "Akunmu privat. Orang baru harus meminta izin untuk mengikutimu." : "Akunmu publik. Siapa pun bisa melihat unggahan dan pengikutmu, termasuk orang yang tidak kamu kenal.", 24, 222, 16, 312, { color: o.on >= 1 ? GREEN : "#5B6B76", weight: 700 });
    if (o.dlg) HP.dialog(c, { ...PRIV_DLG, hl: o.dlgHl ? 0 : null, u: o.dlg });
    return r;
  }
  const REQ = [["dito.kantin", "Dito · 25 teman bersama", "dito"], ["hadiah_gratis_88", "0 teman bersama", "promo"], ["kak.foto.keren", "0 teman bersama", "anon"]];
  function reqPage(c, o = {}) {
    HP.header(c, "Permintaan mengikuti", { back: true }); const out = [];
    REQ.forEach(([n, s, who], i) => { const y = 120 + i * 96, st = (o.done || {})[i];
      c.fillStyle = o.hl === i ? "#FFF3D6" : "#FFFFFF"; rr(c, 12, y, 336, 86, 16); c.fill();
      avatar(c, 46, y + 43, 24, who); text(c, n, 80, y + 34, 17, { weight: 800, fit: 140 }); text(c, s, 80, y + 58, 13, { weight: 600, color: who === "dito" ? GREEN : RED, fit: 140 });
      if (st) text(c, st === "ok" ? "Diterima" : "Ditolak", 330, y + 50, 16, { align: "right", weight: 800, color: st === "ok" ? GREEN : "#8A99A3" });
      else { HP.button(c, 226, y + 24, 60, 38, "Terima", { fill: LK, r: 10, size: 14 }); HP.button(c, 292, y + 24, 50, 38, "Tolak", { outline: true, ink: "#5B6B76", r: 10, size: 14 }); }
      out.push({ ok: [256, y + 43], no: [317, y + 43] }); });
    return out;
  }
  // edit profil. o: name, bio (baris), del {i: u} (baris dihapus), focus, saveHl
  function editPage(c, o = {}) {
    HP.header(c, "Edit profil", { back: true }); text(c, "Simpan", 336, 79, 18, { align: "right", weight: 800, color: o.saveHl ? C.accentDark : LK });
    if (o.saveHl) { c.strokeStyle = C.accent; c.lineWidth = 2.5; rr(c, 262, 56, 84, 34, 10); c.stroke(); }
    avatar(c, 180, 156, 38, "sinta"); text(c, "Ganti foto", 180, 216, 15, { align: "center", weight: 800, color: LK });
    const field = (lab, y, h, focus) => { text(c, lab, 20, y, 14, { weight: 800, color: "#5B6B76" }); c.fillStyle = "#FFFFFF"; rr(c, 14, y + 8, 332, h, 10); c.fill(); c.strokeStyle = focus ? LK : "#D5DEE4"; c.lineWidth = focus ? 2.5 : 1.5; rr(c, 14, y + 8, 332, h, 10); c.stroke(); };
    field("Nama", 246, 40, o.focus === "name"); text(c, o.name || NAME0, 28, 280, 17, { weight: 700 });
    if (o.focus === "name" && o.caret) { c.font = "700 17px Inter"; c.fillStyle = C.ink; c.fillRect(30 + c.measureText(o.name || "").width, 264, 2, 22); }
    field("Nama pengguna", 314, 40); text(c, "sinta.senja", 28, 348, 17, { weight: 700 });
    const bio = o.bio || BIO0, bh = Math.max(2, bio.length) * 28 + 20; field("Bio", 382, bh, o.focus === "bio");
    bio.forEach((s, i) => { const d = (o.del || {})[i] || 0, y = 418 + i * 28; c.save(); c.globalAlpha = 1 - d * 0.75;
      if (d > 0) { c.fillStyle = C.badBg; rr(c, 22, y - 18, 316, 25, 6); c.fill(); }
      text(c, s, 28, y, 16, { weight: 600, color: d > 0 ? RED : C.ink, fit: 300 });
      if (d > 0) { c.font = "600 16px Inter"; const w = Math.min(300, c.measureText(s).width) * Math.min(1, d * 2); c.strokeStyle = RED; c.lineWidth = 2; c.beginPath(); c.moveTo(28, y - 5); c.lineTo(28 + w, y - 5); c.stroke(); }
      c.restore(); });
    text(c, (o.n != null ? o.n : 96) + "/150", 340, 382 + bh + 30, 13, { align: "right", weight: 600, color: "#8A99A3" });
    return { bio: { x: 180, y: 382 + 8 + bh / 2 }, name: { x: 180, y: 274 }, save: { x: 304, y: 73 } };
  }
  // unggahan baru. o: loc (true = ada lokasi), xHl, shareHl
  function composer(c, o = {}) {
    HP.header(c, "Unggahan baru", { back: true }); text(c, "Bagikan", 336, 79, 18, { align: "right", weight: 800, color: LK });
    if (o.shareHl) { c.strokeStyle = C.accent; c.lineWidth = 2.5; rr(c, 256, 56, 90, 34, 10); c.stroke(); }
    catPic(c, 16, 120, 110, 110); HP.para(c, "Kucing kantin tidur siang lagi.", 140, 146, 17, 200, { color: C.ink, weight: 700 });
    c.fillStyle = "#E3E9EE"; c.fillRect(0, 250, HP.W, 1.5);
    const row = (y, ic, lab) => { HP.icon(c, ic, 34, y + 30, 22, C.ink); text(c, lab, 62, y + 37, 18, { weight: 700 }); c.fillStyle = "#E3E9EE"; c.fillRect(0, y + 60, HP.W, 1.5); };
    row(252, "user", "Tandai orang"); HP.icon(c, "chevron", 336, 282, 16, "#8A99A3");
    row(314, "location", o.loc ? "Lokasi" : "Tambah lokasi");
    let xb = null;
    if (o.loc) { c.fillStyle = o.locHl ? "#FBE1DF" : LKBG; rr(c, 120, 326, 226, 36, 18); c.fill(); text(c, "Kantin SMPN 9 Kota Pelangi", 134, 350, 14, { weight: 800, color: o.locHl ? RED : LK, fit: 172 });
      xb = { x: 326, y: 344 }; if (o.xHl) { c.fillStyle = "#FFF3D6"; c.beginPath(); c.arc(xb.x, xb.y, 15, 0, Math.PI * 2); c.fill(); } HP.icon(c, "close", xb.x, xb.y, 14, o.locHl ? RED : LK); }
    else HP.icon(c, "chevron", 336, 344, 16, "#8A99A3");
    row(376, "globe", "Pemirsa: Pengikut"); HP.icon(c, "chevron", 336, 406, 16, "#8A99A3");
    return { x: xb, share: { x: 300, y: 73 } };
  }
  const LOC = (o = {}) => [{ label: "Tambah lokasi otomatis", sub: "Menulis tempatmu di setiap unggahan", toggle: o.auto == null ? 1 : o.auto, hl: o.hl === 0 },
    { section: "IZIN LOKASI HP" }, { label: "Izin lokasi untuk Lingkar", value: o.perm ? "Jangan izinkan" : "Selalu", valueColor: o.perm ? GREEN : RED, arrow: true, hl: o.hl === 2 }];
  function locPage(c, o = {}) { HP.header(c, "Lokasi", { back: true }); return HP.list(c, LOC(o), { y: 120 }); }
  const PERM_OPTS = ["Selalu", "Saat aplikasi digunakan", "Jangan izinkan"];
  function permPage(c, pick, hl) { HP.header(c, "Izin lokasi", { back: true }); text(c, "Lingkar", 180, 150, 22, { align: "center", weight: 800 });
    return HP.list(c, PERM_OPTS.map((s, i) => ({ label: s, radio: pick === i, hl: hl === i })), { y: 180 }); }
  const TAG = (o = {}) => [{ section: "SIAPA YANG BOLEH MENANDAIMU" }, ...["Semua orang", "Orang yang kamu ikuti", "Tidak ada"].map((s, i) => ({ label: s, radio: (o.pick == null ? 0 : o.pick) === i, hl: o.hl === i + 1 })),
    { section: "TINJAUAN" }, { label: "Tinjau tanda sebelum tampil", sub: "Kamu memilih: tampilkan atau sembunyikan", toggle: o.rev || 0, hl: o.hl === 5 }];
  function tagPage(c, o = {}) { HP.header(c, "Tanda dan sebutan", { back: true }); return HP.list(c, TAG(o), { y: 112 }); }
  const MSG = (o = {}) => [{ section: "SIAPA YANG BOLEH MENGIRIM PESAN" }, ...["Semua orang", "Pengikut saja", "Tidak ada"].map((s, i) => ({ label: s, radio: (o.pick == null ? 0 : o.pick) === i, hl: o.hl === i + 1 })),
    { section: "LAINNYA" }, { label: "Permintaan pesan", sub: "Pesan dari orang lain menunggu di sini", arrow: true, hl: o.hl === 5 }];
  function msgPage(c, o = {}) { HP.header(c, "Pesan", { back: true }); return HP.list(c, MSG(o), { y: 112 }); }
  const REV_BTNS = ["Tampilkan di profil", "Sembunyikan", "Hapus tanda"];
  function reviewPage(c, o = {}) {
    HP.header(c, "Tinjau tanda", { back: true }); sleepPic(c, 16, 116, 328, 230);
    c.fillStyle = "rgba(31,42,51,0.82)"; rr(c, 150, 300, 120, 30, 15); c.fill(); text(c, "sinta.senja", 210, 321, 14, { align: "center", weight: 800, color: "#FFFFFF" });
    avatar(c, 36, 378, 18, "dito"); HP.para(c, "dito.kantin menandaimu di foto ini. Tampilkan di profilmu?", 64, 374, 16, 280, { color: C.ink, weight: 700 });
    return REV_BTNS.map((s, i) => HP.button(c, 24, 440 + i * 64, 312, 52, s, { fill: i === 1 ? LK : "#EEF1F4", ink: i === 1 ? "#FFFFFF" : i === 2 ? RED : C.ink, r: 14, size: 18, hl: o.hl === i }));
  }
  const REV = () => B.measure(m => reviewPage(m, {}));
  // lup menulis keterangan kecil "Lingkar · aplikasi rekaan"
  function appTag(ctx) { B.tag(ctx, 1450, 784, "Lingkar adalah aplikasi rekaan", { fill: LK, size: 18 }); }

  B.art.tujuan = (ctx, l) => B.phone(ctx, c => profile(c, { priv: true, name: NAME1, bio: BIO1 }), { cx: 1490, cy: 480, h: 560 });
  B.art.coba = (ctx, l) => B.phone(ctx, c => rootPage(c, { priv: true, req: true }), { cx: 1460, cy: 500, h: 560 });
  B.art.periksa = (ctx, l) => { B.phone(ctx, c => profile(c, { view: "public", priv: true, name: NAME1, bio: BIO1 }), { cy: 494, h: 650 }); B.tag(ctx, 560, 100, "Dilihat sebagai orang lain", { align: "center", fill: C.ink }); };

  Object.assign(K.SCENES, {
    profil_publik(ctx, b, l) {
      const a = b.audio || b.dur, hl = [[0.18, 0], [0.32, 1], [0.45, 2]].filter(([f]) => l > a * f).map(x => x[1]);
      const nameHl = l > a * 0.08, gridHl = l > a * 0.62;
      const draw = c => { profile(c, { view: "public", hl, follow: "Ikuti" }); if (nameHl) { c.strokeStyle = RED; c.lineWidth = 2.5; rr(c, 14, 218, 332, 26, 6); c.stroke(); } if (gridHl) { c.strokeStyle = RED; c.lineWidth = 4; rr(c, 2, 390, 356, 242, 6); c.stroke(); } };
      const { ph } = B.show(ctx, draw, gridHl ? { u: 0, v: 380, w: 360, h: 260 } : { u: 0, v: 206, w: 360, h: 140 });
      B.tag(ctx, 790, 100, "Dilihat oleh orang asing", { fill: RED });
      const list = [["user", "Nama lengkap", 0.08], ["school", "Sekolah dan kelas", 0.18], ["map", "Alamat rumah", 0.32], ["phone", "Nomor HP", 0.45], ["photo", "Semua unggahan", 0.62]];
      card(ctx, 1450, 122, 370, 80 + list.length * 66, { fill: "#FFFFFF", stroke: "#F3C7C3", lw: 3, r: 18 }); text(ctx, "YANG TERBUKA", 1474, 166, 24, { weight: 900, color: RED });
      list.forEach(([ic, s, f], i) => { const on = l > a * f, y = 190 + i * 66; ctx.globalAlpha = on ? 1 : 0.3; ctx.fillStyle = C.badBg; ctx.beginPath(); ctx.arc(1494, y + 24, 22, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, 1494, y + 24, 24, RED); text(ctx, s, 1530, y + 33, 24, { weight: 800 }); ctx.globalAlpha = 1; });
    },
    privat_buka(ctx, b, l) {
      const span = B.spanOf(b), rows = ROOT_ROWS(), sh = B.measure(m => sheet(m, null));
      const ST = [{ wait: 1, d: 0.4 }, { tap: [330, 70], set: { sheet: true }, d: 1 }, { wait: 1, d: 0.3 }, { tap: [180, sh.row(0).y], set: { scr: "root" }, d: 1 }, { wait: 1, d: 0.6 }, { tap: B.tapRow(rows, 1), set: { scr: "priv" }, d: 1 }, { wait: 1, d: 1 }];
      const R = HP.run({ scr: "prof" }, ST, l, span), st = R.st;
      const draw = c => { if (st.scr === "prof") { profile(c, { menuHl: R.i >= 1 }); if (st.sheet) sheet(c, R.i >= 3 ? 0 : null, Math.min(1, (l - span * 0.1) / 0.3)); }
        else if (st.scr === "root") rootPage(c, { hl: R.i >= 5 ? 1 : null }); else privPage(c, {}); B.tapDraw(c, R); };
      const src = st.scr === "prof" ? (st.sheet ? { u: 0, v: 420, w: 360, h: 290 } : { u: 160, v: 40, w: 200, h: 70 }) : st.scr === "root" ? { u: 0, v: 100, w: 360, h: 200 } : { u: 0, v: 104, w: 360, h: 200 };
      B.show(ctx, draw, src); appTag(ctx);
      const y = B.steps(ctx, "LANGKAH", ["Tap tombol menu bergaris tiga.", "Tap Pengaturan dan privasi.", "Tap Privasi akun."], B.stepAt(l, span, [0.25, 0.5, 0.75]));
      if (st.scr === "priv") B.notes(ctx, y, [B.warn("Sekarang: Publik")]);
    },
    privat_nyala(ctx, b, l) {
      const span = B.spanOf(b), d = B.measure(m => HP.dialog(m, PRIV_DLG)), ok = d.buttons[0];
      const ST = [{ tap: [306, 152], set: { dlg: 1 }, d: 1 }, { wait: 1, d: 1.6 }, { tap: [ok.cx, ok.cy], set: { dlg: 0 }, d: 1 }, { anim: "on", d: 0.6 }, { wait: 1, d: 1.6 }];
      const R = HP.run({ on: 0 }, ST, l, span), st = R.st;
      const draw = c => { privPage(c, { on: st.on || 0, hl: true, dlg: st.dlg, dlgHl: R.i >= 2 }); B.tapDraw(c, R); };
      B.show(ctx, draw, st.dlg ? { u: 0, v: d.box.y - 6, w: 360, h: d.box.h + 12 } : { u: 0, v: 104, w: 360, h: 220 }); appTag(ctx);
      const y = B.steps(ctx, "LANGKAH", ["Nyalakan sakelar Akun privat.", "Tap Ubah ke privat."], B.stepAt(l, span, [0.2, 0.55]));
      if (st.on >= 1) B.notes(ctx, y, [B.ok("Akun privat: hanya pengikut yang kamu setujui melihat unggahanmu.")]);
      else if (st.dlg) B.notes(ctx, y, [{ s: "Baca pesannya: bio tetap terlihat semua orang." }]);
    },
    privat_minta(ctx, b, l) {
      const span = B.spanOf(b), g = B.measure(m => reqPage(m, {}));
      const ST = [{ wait: 1, d: 0.8 }, { tap: g[0].ok, set: { d0: "ok" }, d: 1 }, { wait: 1, d: 0.6 }, { tap: g[1].no, set: { d1: "no" }, d: 1 }, { tap: g[2].no, set: { d2: "no" }, d: 1 }, { wait: 1, d: 1.2 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      const draw = c => { reqPage(c, { done: { 0: st.d0, 1: st.d1, 2: st.d2 }, hl: R.i <= 1 ? 0 : R.i <= 4 ? (R.i === 4 ? 2 : 1) : null }); B.tapDraw(c, R); };
      B.show(ctx, draw, { u: 0, v: 108, w: 360, h: 310 }); appTag(ctx);
      const y = B.steps(ctx, "PERMINTAAN MENGIKUTI", ["Kenal? Terima: Dito.", "Tidak kenal? Tolak."], B.stepAt(l, span, [0.3, 0.6]));
      B.notes(ctx, y, [B.after(b, l, 0.45) && B.warn("0 teman bersama, nama aneh: tolak.")]);
    },
    bio_hapus(ctx, b, l) {
      const span = B.spanOf(b), eg = B.measure(m => editPage(m, {}));
      const ST = [{ tap: [180, 376], set: { scr: "edit" }, d: 1 }, { wait: 1, d: 0.4 }, { tap: [eg.bio.x, eg.bio.y], set: { focus: "bio" }, d: 0.9 }, { anim: "d0", d: 0.9 }, { anim: "d1", d: 0.9 }, { anim: "d2", d: 0.9 }, { wait: 1, d: 1.2 }];
      const R = HP.run({ scr: "prof" }, ST, l, span), st = R.st;
      const pg = B.measure(m => profile(m, {}));
      const draw = c => { if (st.scr === "prof") profile(c, { editHl: true }); else editPage(c, { focus: st.focus, del: { 0: st.d0 || 0, 1: st.d1 || 0, 2: st.d2 || 0 } }); B.tapDraw(c, R); };
      B.show(ctx, draw, st.scr === "prof" ? { u: 0, v: 300, w: 360, h: 140 } : { u: 0, v: 362, w: 360, h: 196 }); appTag(ctx);
      const y = B.steps(ctx, "HAPUS DARI BIO", ["Nama sekolah dan kelas", "Alamat rumah", "Nomor HP"], st.scr === "prof" ? 0 : (st.d2 >= 1 ? 3 : st.d1 >= 1 ? 2 : st.d0 >= 1 ? 1 : 0));
      B.notes(ctx, y, [B.after(b, l, 0.7) && B.warn("Data ini membantu orang asing menemukanmu.")]);
    },
    bio_simpan(ctx, b, l) {
      const span = B.spanOf(b);
      const ST = [{ wait: 1, d: 1.4 }, { tap: [180, 274], set: { focus: "name", nm: "Sinta Ayu Lestari" }, d: 0.8 }, { type: "Sinta", field: "nm", d: 0.6 }, { wait: 1, d: 0.8 }, { tap: [304, 73], set: { saved: true }, d: 0.9 }, { wait: 1, d: 1.6 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      const draw = c => { if (st.saved) profile(c, { priv: true, name: NAME1, bio: BIO1 }); else editPage(c, { focus: st.focus, caret: st.focus === "name", name: st.nm != null ? st.nm : NAME0, bio: BIO1, n: 54, saveHl: R.i >= 4 }); B.tapDraw(c, R); };
      B.show(ctx, draw, st.saved ? { u: 0, v: 210, w: 360, h: 108 } : R.i >= 4 ? { u: 160, v: 40, w: 200, h: 70 } : { u: 0, v: 236, w: 360, h: 270 }); appTag(ctx);
      const y = B.steps(ctx, "BOLEH TETAP ADA", ["Hobi: menggambar, kucing.", "Nama panggilan: Sinta.", "Tap Simpan."], B.stepAt(l, span, [0.2, 0.5, 0.75]));
      if (st.saved) B.notes(ctx, y, [B.ok("Bio bersih dari data pribadi.")]);
    },
    lokasi_unggah(ctx, b, l) {
      const span = B.spanOf(b), cg = B.measure(m => composer(m, { loc: true }));
      const ST = [{ wait: 1, d: 1.2, set: { locHl: true } }, { wait: 1, d: 0.6 }, { tap: [cg.x.x, cg.x.y], set: { loc: false }, d: 1 }, { wait: 1, d: 0.6 }, { tap: [cg.share.x, cg.share.y], set: { shared: true }, d: 1 }, { wait: 1, d: 1 }];
      const R = HP.run({ loc: true }, ST, l, span), st = R.st;
      const draw = c => { composer(c, { loc: st.loc, locHl: st.locHl, xHl: R.i === 2, shareHl: R.i === 4 }); if (st.shared) HP.toast(c, "Dibagikan tanpa lokasi", 0.5, { y: 600 }); B.tapDraw(c, R); };
      B.show(ctx, draw, { u: 0, v: 240, w: 360, h: 200 }); appTag(ctx);
      const y = B.steps(ctx, "SAAT MENGUNGGAH", ["Lihat baris lokasi.", "Tap tanda silang.", "Tap Bagikan."], B.stepAt(l, span, [0.15, 0.45, 0.7]));
      B.notes(ctx, y, [st.loc ? B.warn("Lokasi menunjukkan di mana kamu biasa berada.") : B.ok("Lokasi sudah dihapus.")]);
    },
    lokasi_atur(ctx, b, l) {
      const span = B.spanOf(b), rows = ROOT_ROWS(), lr = B.rowsOf(LOC(), { y: 120 }), pr = B.rowsOf(PERM_OPTS.map(s => ({ label: s, radio: false })), { y: 180 });
      const ST = [{ tap: B.tapRow(rows, 4), set: { scr: "loc" }, d: 1 }, { tap: lr[0].toggle ? [lr[0].toggle.x, lr[0].toggle.y] : [306, 160], d: 0.8 }, { anim: "off", d: 0.5 }, { wait: 1, d: 0.4 },
        { tap: B.tapRow(lr, 2), set: { scr: "perm" }, d: 0.9 }, { tap: B.tapRow(pr, 2, 100), set: { pick: 2 }, d: 0.9 }, { tap: [32, 70], set: { scr: "loc2" }, d: 0.8 }, { wait: 1, d: 1 }];
      const R = HP.run({ scr: "root", pick: 0 }, ST, l, span), st = R.st;
      const draw = c => { if (st.scr === "root") rootPage(c, { priv: true, req: true, hl: 4 });
        else if (st.scr === "perm") permPage(c, st.pick, R.i === 5 ? 2 : null);
        else locPage(c, { auto: 1 - (st.off || 0), perm: st.scr === "loc2", hl: R.i >= 1 && R.i <= 3 ? 0 : st.scr === "loc2" ? 2 : null });
        B.tapDraw(c, R); };
      B.show(ctx, draw, st.scr === "root" ? { u: 0, v: 300, w: 360, h: 170 } : st.scr === "perm" ? { u: 0, v: 130, w: 360, h: 270 } : { u: 0, v: 104, w: 360, h: 230 }); appTag(ctx);
      const y = B.steps(ctx, "LANGKAH", ["Pengaturan dan privasi, lalu Lokasi.", "Matikan Tambah lokasi otomatis.", "Izin lokasi HP: Jangan izinkan."], B.stepAt(l, span, [0.15, 0.45, 0.8]));
      if (st.scr === "loc2") B.notes(ctx, y, [B.ok("Lokasi tidak ditulis otomatis lagi.")]);
    },
    tanda_atur(ctx, b, l) {
      const span = B.spanOf(b), rows = ROOT_ROWS(), tr = B.rowsOf(TAG(), { y: 112 });
      const ST = [{ tap: B.tapRow(rows, 5), set: { scr: "tag" }, d: 1 }, { wait: 1, d: 0.6 }, { tap: B.tapRow(tr, 2, 100), set: { pick: 1 }, d: 1 }, { wait: 1, d: 0.6 }, { tap: [tr[5].toggle.x, tr[5].toggle.y], d: 0.9 }, { anim: "rev", d: 0.5 }, { wait: 1, d: 1.2 }];
      const R = HP.run({ scr: "root", pick: 0 }, ST, l, span), st = R.st;
      const draw = c => { if (st.scr === "root") rootPage(c, { priv: true, req: true, hl: 5 }); else tagPage(c, { pick: st.pick, rev: st.rev || 0, hl: R.i <= 3 ? 2 : 5 }); B.tapDraw(c, R); };
      B.show(ctx, draw, st.scr === "root" ? { u: 0, v: 340, w: 360, h: 170 } : R.i <= 3 ? { u: 0, v: 104, w: 360, h: 250 } : { u: 0, v: 346, w: 360, h: 130 }); appTag(ctx);
      const y = B.steps(ctx, "TANDA (TAG)", ["Buka Tanda dan sebutan.", "Pilih Orang yang kamu ikuti.", "Nyalakan Tinjau tanda."], B.stepAt(l, span, [0.15, 0.5, 0.8]));
      B.notes(ctx, y, [B.tip("Di aplikasi lain: Tag, atau Penandaan.")]);
    },
    pesan_atur(ctx, b, l) {
      const span = B.spanOf(b), rows = ROOT_ROWS(), mr = B.rowsOf(MSG(), { y: 112 });
      const ST = [{ tap: B.tapRow(rows, 6), set: { scr: "msg" }, d: 1 }, { wait: 1, d: 0.6 }, { tap: B.tapRow(mr, 2, 100), set: { pick: 1 }, d: 1 }, { wait: 1, d: 0.6, set: { hl5: true } }, { wait: 1, d: 1.4 }];
      const R = HP.run({ scr: "root", pick: 0 }, ST, l, span), st = R.st;
      const draw = c => { if (st.scr === "root") rootPage(c, { priv: true, req: true, hl: 6 }); else msgPage(c, { pick: st.pick, hl: st.hl5 ? 5 : 2 }); B.tapDraw(c, R); };
      B.show(ctx, draw, st.scr === "root" ? { u: 0, v: 380, w: 360, h: 160 } : st.hl5 ? { u: 0, v: 346, w: 360, h: 130 } : { u: 0, v: 104, w: 360, h: 260 }); appTag(ctx);
      const y = B.steps(ctx, "PESAN", ["Buka Pesan.", "Pilih Pengikut saja."], B.stepAt(l, span, [0.2, 0.5]));
      if (st.hl5) B.notes(ctx, y, [{ s: "Pesan orang asing menunggu di Permintaan pesan. Kamu boleh tidak membukanya." }]);
    },
    tanda_tinjau(ctx, b, l) {
      const span = B.spanOf(b), rv = REV();
      const ST = [{ set: { notif: true }, d: 1.2 }, { tap: [180, 90], set: { scr: "rev" }, d: 1 }, { wait: 1, d: 1.4 }, { tap: [rv[1].cx, rv[1].cy], set: { hidden: true }, d: 1 }, { wait: 1, d: 1.6 }];
      const R = HP.run({ scr: "prof" }, ST, l, span), st = R.st;
      const draw = c => { if (st.scr === "prof") { profile(c, { priv: true, name: NAME1, bio: BIO1 }); HP.notif(c, { app: "Lingkar", icon: "user", color: LK, title: "dito.kantin menandaimu", body: "Tinjau sebelum tampil di profilmu.", time: "sekarang" }, Math.min(1, l / 0.6)); }
        else { reviewPage(c, { hl: R.i >= 3 ? 1 : null }); if (st.hidden) HP.toast(c, "Foto tidak tampil di profilmu", 0.5, { y: 640 }); } B.tapDraw(c, R); };
      B.show(ctx, draw, st.scr === "prof" ? { u: 0, v: 36, w: 360, h: 130 } : R.i >= 3 ? { u: 0, v: 420, w: 360, h: 260 } : { u: 0, v: 110, w: 360, h: 310 }); appTag(ctx);
      const y = B.steps(ctx, "TINJAU TANDA", ["Tap pemberitahuan.", "Lihat fotonya.", "Tap Sembunyikan."], B.stepAt(l, span, [0.2, 0.45, 0.65]));
      if (st.hidden) B.notes(ctx, y, [B.ok("Minta Dito menghapus fotonya dengan sopan.")]);
    },
    salah_privat(ctx, b, l) {
      const a = b.audio || b.dur, hlOn = l > a * 0.35;
      card(ctx, 900, 140, 880, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 1: MERASA AMAN KARENA SUDAH PRIVAT", 1340, 200, 26, { align: "center", weight: 900, color: RED, fit: 840 });
      const draw = c => profile(c, { view: "public", priv: true, hl: hlOn ? [0, 1, 2] : [], bio: BIO0.slice(0, 3).concat(BIO0.slice(3)) });
      const ph = B.phone(ctx, draw, { cy: 494, h: 650 }); B.tag(ctx, 560, 100, "Dilihat sebagai orang lain", { align: "center", fill: C.ink });
      HP.magnify(ctx, ph, draw, { u: 0, v: 216, w: 360, h: 130 }, { x: 960, y: 250, w: 760 });
      if (hlOn) B.badge(ctx, 930, 560, false, "Akun privat, tetapi nama, foto profil, dan bio tetap terlihat.", { w: 820, h: 100, size: 26 });
      if (l > a * 0.75) B.badge(ctx, 930, 676, true, "Bio tetap harus bersih dari data pribadi.", { w: 820, h: 90, size: 26 });
    },
    salah_terima(ctx, b, l) {
      const span = B.spanOf(b), g = B.measure(m => reqPage(m, {}));
      const ST = [{ wait: 1, d: 0.6 }, { tap: g[0].ok, set: { d0: "ok" }, d: 0.7 }, { tap: g[1].ok, set: { d1: "ok" }, d: 0.7 }, { tap: g[2].ok, set: { d2: "ok" }, d: 0.7 }, { wait: 1, d: 2.4 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      card(ctx, 900, 140, 880, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 2: MENERIMA SEMUA PERMINTAAN", 1340, 200, 26, { align: "center", weight: 900, color: RED, fit: 840 });
      const draw = c => { reqPage(c, { done: { 0: st.d0, 1: st.d1, 2: st.d2 } }); B.tapDraw(c, R); };
      const ph = B.phone(ctx, draw); HP.magnify(ctx, ph, draw, { u: 0, v: 110, w: 360, h: 300 }, { x: 1110, y: 240, w: 460 });
      if (R.i >= 3) B.badge(ctx, 930, 640, false, "Orang asing ikut diterima: akun privat jadi tidak berguna.", { w: 820, h: 76, size: 24 });
      if (B.after(b, l, 0.8)) B.badge(ctx, 930, 730, true, "Terima hanya orang yang kamu kenal di dunia nyata.", { w: 820, h: 76, size: 24 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
