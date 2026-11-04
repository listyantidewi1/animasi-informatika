/* Layar HP: pembantu gambar bersama untuk video simulasi yang memperagakan HP (S01, S11, S12, S13, S14, S15, S16, S28, …).
   Muat setelah kiko-core.js dan layar.js:  "engine": ["../../_alat/kiko-core.js", "../../_alat/layar.js", "../../_alat/layar_hp.js", "scenes.js"]
   Semua tampilan generik dan digambar dengan kode: tanpa logo, tanpa tata letak sistem operasi atau merek HP tertentu.

   ===== KOORDINAT =====
   Isi layar digambar dalam SATUAN LOKAL: lebar HP.W = 360, tinggi HP.H = 740 (bilah status y 0–36, isi y 36–712, garis navigasi di bawah).
   HP.phone() menskalakan satuan itu ke ukuran HP di kanvas 1920×1080. Huruf 24 satuan ≈ 22 px pada tinggi layar bawaan 680 px.

   ===== API =====
   const HP = Kiko.hp;
   const ph = HP.phone(ctx, cx, cy, opt, draw)
       Bingkai HP tegak berpusat di (cx, cy). draw(ctx, ph) dipanggil dalam satuan lokal, terpotong di layar.
       opt: h (tinggi layar px, bawaan 680), time ("07.15"), battery (0..1), dark (bilah status putih untuk layar gelap),
            bg (warna latar layar), status (false = tanpa bilah status), nav (false = tanpa garis navigasi), shadow (bawaan true).
       Hasil ph: { x, y, w, h, s, at(u, v) → {x, y} titik kanvas, rect(u, v, w, h) → {x, y, w, h} kotak kanvas }.
       Contoh: const p = ph.at(300, 640); L.callout(ctx, 1450, 500, "Tombol tambah", p.x, p.y);
   — Semua fungsi di bawah dipanggil DI DALAM draw (satuan lokal). —
   HP.header(ctx, title, {back, backHl, action: "more"|"search"|null, bg})  bilah judul y 36–104, panah kembali. Hasil: {bottom, back: {x, y}}
   HP.search(ctx, y, text, {focus, caret})  kolom "Cari pengaturan". Hasil: {x, y, w, h, cx, cy}
   HP.list(ctx, items, {y, scroll, gap})  daftar menu Pengaturan. items: [{ section: "JUDUL" } | {
        label, sub, icon: "update"|… (ikon bulat) | app: {color, icon|letter} (ikon aplikasi), color,
        toggle: true|false|0..1 (sakelar, angka = animasi), value: "teks kanan", arrow: true, radio: true|false,
        hl: true (sorot kuning), dim: true, danger: true (merah), badge: "1" }]
       Hasil: array baris {x, y, w, h, cx, cy, toggle: {x, y}} (urutan sama dengan items, section = null).
   HP.toggle(ctx, cx, cy, on)  sakelar nyala/mati (on 0..1).   HP.radio(ctx, cx, cy, on)
   HP.icon(ctx, kind, cx, cy, s, color)  ikon garis sederhana. kind: update, shield, lock, apps, location, camera, mic, contacts, bell,
        wifi, battery, key, trash, flashlight, info, gear, download, warning, check, close, sun, chat, game, globe, folder, search,
        back, chevron, plus, more, qr, eye, eyeOff, fingerprint, phone, calc, map, store, clock, user, cloud, mail, school, photo, music
   HP.appIcon(ctx, cx, cy, size, color, iconOrLetter)  ikon aplikasi persegi membulat.
   HP.button(ctx, x, y, w, h, label, {fill, ink, outline, hl, size, r})  Hasil: {cx, cy}
   HP.notif(ctx, {app, icon, color, title, body, time}, u)  notifikasi turun dari atas (u 0..1 masuk). Hasil: kotaknya.
   HP.dialog(ctx, {icon, iconColor, title, body, buttons: [..], stack: true, hl: i, danger: i, u})  dialog di tengah, latar digelapkan.
        stack = tombol bertumpuk penuh (dialog izin); tanpa stack = tombol teks di kanan bawah. Hasil: {box, buttons: [{x, y, w, h, cx, cy}]}
   HP.permission(ctx, {app, color, appIcon, perm: "lokasi"|…, icon, question, hl, u})  dialog izin standar: "Izinkan X mengakses lokasi?"
        tombol: Saat aplikasi digunakan / Hanya kali ini / Jangan izinkan. Hasil sama dengan dialog.
   HP.numpad(ctx, {y, press, pressU, done})  keyboard angka di bawah layar (1–9, hapus, 0, selesai). Hasil: {key(ch) → {x, y}}.
   HP.numpadKey(ch, y)  posisi tombol tanpa menggambar (untuk HP.run).
   HP.codeBoxes(ctx, cx, y, value, {n, size, error, active})  kotak kode 6 digit.   HP.pinDots(ctx, cx, y, n, filled)
   HP.auth(ctx, {title, accounts: [{issuer, user, code, secs, period, hl}], empty, fabHl, menu: true, menuHl})  aplikasi autentikator:
        kode 6 digit + lingkaran sisa waktu 30 detik; kode memerah 5 detik terakhir. Hasil: {fab, cards, menu: {scan, key}}
   HP.totp(t, period)  → {secs: sisa detik, frac, idx}: untuk lingkaran waktu yang berjalan nyata.   HP.ring(ctx, cx, cy, r, frac, color)
   HP.scanner(ctx, {found, hint, inner(ctx, box)})  kamera pemindai kode QR (layar gelap + bingkai bidik). Hasil: kotak bidik.
   HP.qr(ctx, x, y, size, seed)  pola kotak acak mirip kode QR (BUKAN kode QR sungguhan; tidak bisa dipindai ke situs mana pun).
   HP.chat(ctx, {name, sub, color, messages: [{from: "them"|"me", text, time}], input, warn: i, size: 18, maxW: 250})  layar obrolan generik (gelembung pesan).
        warn = indeks pesan yang diberi bingkai merah. Hasil: kotak tiap gelembung.
   HP.home(ctx, apps, {clock, hl, cols})  layar utama dengan kisi aplikasi [{name, color, icon}]. Hasil: posisi tiap ikon {name, x, y}.
   HP.progress(ctx, x, y, w, frac, {color, h})   HP.spinner(ctx, cx, cy, r, t)   HP.toast(ctx, msg, u, {y})
   HP.para(ctx, s, x, y, size, maxW, opt)  paragraf (pembungkus H.para).
   HP.magnify(ctx, ph, draw, {u, v, w, h}, {x, y, w | k}, {bg, color})  lup: bagian layar HP (satuan lokal) digambar ulang besar di kanvas,
        dengan bingkai di HP dan garis penghubung. draw = fungsi gambar yang sama dengan HP.phone. Hasil: {x, y, w, h, k, at(u, v) → titik kanvas}.
   HP.tap(ctx, x, y, u, {r})  efek tap jari: lingkaran tekan lalu riak (u 0..1). Bisa di satuan lokal atau kanvas.
   HP.run(base, steps, l, span)  penerjemah langkah berurutan (durasi relatif d dibagi rata ke span detik):
        {tap: [u, v], set: {...}}  tap di HP (satuan lokal); set berlaku setelah setengah langkah
        {to: [x, y], click: true, set}  pointer mouse bergerak ke titik kanvas (lalu klik)   ·  {key: ["Enter"]}  tombol keyboard tampil
        {type: "teks", field: "nama"}  mengetik bertahap ke st[field]   ·  {numpad: "482913", field: "code", y}  tap tombol angka satu per satu
        {anim: "nama"}  st[nama] = 0..1 selama langkah (sakelar, progress)   ·  {set: {...}}  ubah state langsung   ·  {wait: 1}
        Hasil: {st, tap: {x, y, u}|null, ptr: {x, y}|null, click, key: {keys, press}|null, i (langkah ke-), u (0..1 dalam langkah)}
        Gambar hasilnya: HP.tap(ctx, r.tap.x, r.tap.y, r.tap.u) di dalam draw; L.cursor(ctx, r.ptr.x, r.ptr.y, {click: r.click}) di luar. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr,  wrap, ease, clamp, lerp } = H;
  // text dengan opt.fit yang juga mengecilkan huruf kecil (H.text hanya mengecilkan sampai 20 px)
  const text = (ctx, s, x, y, size, opt = {}) => {
    if (opt.fit) { const f = `${opt.weight || 600} `; ctx.font = f + size + "px Inter"; while (size > 11 && ctx.measureText(s).width > opt.fit) { size -= 1; ctx.font = f + size + "px Inter"; } }
    H.text(ctx, s, x, y, size, { ...opt, fit: undefined });
  };
  const HP = {};
  const W = 360, HH = 740, TOP = 36;
  const UI = { bezel: "#2B3A46", bezel2: "#1A262F", bg: "#F1F4F7", surface: "#FFFFFF", line: "#E3E9EE", ink: C.ink, ink2: "#5B6B76",
               primary: "#1A73C8", primaryBg: "#E3EEFA", off: "#B9C4CC", good: C.good, bad: C.bad, hl: "#FFF3D6", hlLine: C.accent };
  HP.W = W; HP.H = HH; HP.TOP = TOP; HP.UI = UI;

  // ---------- bingkai HP ----------
  HP.phone = function (ctx, cx, cy, opt = {}, draw) {
    const h = opt.h || 680, s = h / HH, w = W * s, x = cx - w / 2, y = cy - h / 2, pad = Math.max(10, 16 * s);
    const ph = { x, y, w, h, s, at: (u, v) => ({ x: x + u * s, y: y + v * s }), rect: (u, v, ww, hh) => ({ x: x + u * s, y: y + v * s, w: ww * s, h: hh * s }) };
    ctx.save();
    if (opt.shadow !== false) { ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 34; ctx.shadowOffsetY = 12; }
    ctx.fillStyle = UI.bezel; rr(ctx, x - pad, y - pad, w + pad * 2, h + pad * 2, 50 * s); ctx.fill(); ctx.restore();
    ctx.fillStyle = UI.bezel2; rr(ctx, x + w + pad - 3, y + 120 * s, 6, 70 * s, 3); ctx.fill(); rr(ctx, x + w + pad - 3, y + 210 * s, 6, 46 * s, 3); ctx.fill();
    ctx.save(); rr(ctx, x, y, w, h, 34 * s); ctx.clip(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = opt.bg || UI.bg; ctx.fillRect(0, 0, W, HH);
    if (draw) draw(ctx, ph);
    if (opt.status !== false) HP.statusBar(ctx, opt);
    if (opt.nav !== false) { ctx.fillStyle = opt.dark ? "rgba(255,255,255,0.7)" : "rgba(31,42,51,0.55)"; rr(ctx, W / 2 - 60, HH - 16, 120, 6, 3); ctx.fill(); }
    ctx.restore();
    // kamera depan (lubang kecil)
    ctx.fillStyle = UI.bezel2; ctx.beginPath(); ctx.arc(cx, y + 18 * s, 7 * s, 0, Math.PI * 2); ctx.fill();
    return ph;
  };
  HP.statusBar = function (ctx, opt = {}) {
    const ink = opt.dark ? "#FFFFFF" : UI.ink;
    text(ctx, opt.time || "07.15", 26, 26, 17, { weight: 700, color: ink });
    // sinyal
    for (let i = 0; i < 4; i++) { ctx.fillStyle = ink; ctx.fillRect(250 + i * 6, 23 - i * 3.5, 4, 4 + i * 3.5); }
    // wifi
    ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.lineCap = "round";
    for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(288, 26, i * 4.5, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke(); }
    // baterai
    const bt = opt.battery == null ? 0.76 : opt.battery;
    ctx.lineWidth = 1.8; rr(ctx, 304, 13, 30, 15, 4); ctx.stroke(); ctx.fillStyle = ink; ctx.fillRect(335, 17, 3, 7);
    ctx.fillStyle = bt < 0.2 ? UI.bad : ink; rr(ctx, 306.5, 15.5, 25 * clamp(bt, 0, 1), 10, 2); ctx.fill();
  };

  // ---------- ikon garis ----------
  HP.icon = function (ctx, kind, cx, cy, s = 26, color = UI.ink) {
    ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = Math.max(1.6, s * 0.1); ctx.lineCap = "round"; ctx.lineJoin = "round";
    const r = s / 2, P = Math.PI;
    const line = (...pts) => { ctx.beginPath(); ctx.moveTo(pts[0] * r, pts[1] * r); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i] * r, pts[i + 1] * r); ctx.stroke(); };
    const circ = (x, y, rad, fill) => { ctx.beginPath(); ctx.arc(x * r, y * r, rad * r, 0, P * 2); fill ? ctx.fill() : ctx.stroke(); };
    const box = (x, y, w, h, rad, fill) => { rr(ctx, x * r, y * r, w * r, h * r, rad * r); fill ? ctx.fill() : ctx.stroke(); };
    switch (kind) {
      case "update": ctx.beginPath(); ctx.arc(0, 0, r * 0.72, P * 0.15, P * 1.05); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * 0.72, P * 1.15, P * 2.05); ctx.stroke();
        line(-0.72, -0.05, -0.68, 0.32, -0.36, 0.18); line(0.72, 0.05, 0.68, -0.32, 0.36, -0.18); break;
      case "shield": ctx.beginPath(); ctx.moveTo(0, -r * 0.85); ctx.lineTo(r * 0.72, -r * 0.55); ctx.quadraticCurveTo(r * 0.72, r * 0.5, 0, r * 0.9); ctx.quadraticCurveTo(-r * 0.72, r * 0.5, -r * 0.72, -r * 0.55); ctx.closePath(); ctx.stroke();
        line(-0.3, 0.02, -0.06, 0.28, 0.34, -0.2); break;
      case "lock": box(-0.62, -0.1, 1.24, 0.95, 0.18); ctx.beginPath(); ctx.arc(0, -r * 0.1, r * 0.4, P, 0); ctx.stroke(); line(-0.4, -0.1, -0.4, -0.1); circ(0, 0.33, 0.12, true); break;
      case "apps": [[-0.75, -0.75], [0.1, -0.75], [-0.75, 0.1], [0.1, 0.1]].forEach(([a, b]) => box(a, b, 0.65, 0.65, 0.16)); break;
      case "location": ctx.beginPath(); ctx.moveTo(0, r * 0.9); ctx.bezierCurveTo(-r * 0.95, -r * 0.05, -r * 0.6, -r * 0.92, 0, -r * 0.9); ctx.bezierCurveTo(r * 0.6, -r * 0.92, r * 0.95, -r * 0.05, 0, r * 0.9); ctx.stroke(); circ(0, -0.25, 0.24); break;
      case "camera": box(-0.85, -0.45, 1.7, 1.2, 0.2); line(-0.35, -0.45, -0.2, -0.7, 0.2, -0.7, 0.35, -0.45); circ(0, 0.12, 0.32); break;
      case "mic": box(-0.3, -0.9, 0.6, 1.1, 0.3); ctx.beginPath(); ctx.arc(0, -r * 0.05, r * 0.6, 0, P); ctx.stroke(); line(0, 0.55, 0, 0.88); line(-0.32, 0.88, 0.32, 0.88); break;
      case "contacts": case "user": circ(0, -0.38, 0.34); ctx.beginPath(); ctx.arc(0, r * 0.82, r * 0.72, P * 1.08, P * 1.92); ctx.stroke(); break;
      case "bell": ctx.beginPath(); ctx.moveTo(-r * 0.7, r * 0.45); ctx.lineTo(-r * 0.55, r * 0.25); ctx.lineTo(-r * 0.55, -r * 0.15); ctx.quadraticCurveTo(-r * 0.55, -r * 0.75, 0, -r * 0.75); ctx.quadraticCurveTo(r * 0.55, -r * 0.75, r * 0.55, -r * 0.15); ctx.lineTo(r * 0.55, r * 0.25); ctx.lineTo(r * 0.7, r * 0.45); ctx.closePath(); ctx.stroke(); line(-0.18, 0.7, 0.18, 0.7); break;
      case "wifi": for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(0, r * 0.6, r * 0.42 * i, P * 1.25, P * 1.75); ctx.stroke(); } circ(0, 0.6, 0.1, true); break;
      case "battery": box(-0.8, -0.42, 1.45, 0.84, 0.15); box(0.7, -0.18, 0.15, 0.36, 0.05, true); box(-0.65, -0.27, 0.8, 0.54, 0.06, true); break;
      case "key": circ(-0.42, 0, 0.32); line(-0.1, 0, 0.85, 0); line(0.55, 0, 0.55, 0.32); line(0.8, 0, 0.8, 0.26); break;
      case "trash": line(-0.75, -0.55, 0.75, -0.55); line(-0.25, -0.55, -0.2, -0.8, 0.2, -0.8, 0.25, -0.55); ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.45); ctx.lineTo(-r * 0.45, r * 0.85); ctx.lineTo(r * 0.45, r * 0.85); ctx.lineTo(r * 0.55, -r * 0.45); ctx.stroke(); line(-0.15, -0.2, -0.12, 0.55); line(0.15, -0.2, 0.12, 0.55); break;
      case "flashlight": ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.85); ctx.lineTo(r * 0.55, -r * 0.85); ctx.lineTo(r * 0.55, -r * 0.5); ctx.lineTo(r * 0.28, -r * 0.15); ctx.lineTo(r * 0.28, r * 0.88); ctx.lineTo(-r * 0.28, r * 0.88); ctx.lineTo(-r * 0.28, -r * 0.15); ctx.lineTo(-r * 0.55, -r * 0.5); ctx.closePath(); ctx.stroke(); circ(0, 0.25, 0.1, true); break;
      case "info": circ(0, 0, 0.85); line(0, -0.05, 0, 0.45); circ(0, -0.38, 0.08, true); break;
      case "gear": { const n = 8; ctx.beginPath(); for (let i = 0; i < n * 2; i++) { const a = i * P / n, rad = (i % 2 ? 0.62 : 0.86) * r; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); } ctx.closePath(); ctx.stroke(); circ(0, 0, 0.28); break; }
      case "download": line(0, -0.85, 0, 0.3); line(-0.38, -0.08, 0, 0.3, 0.38, -0.08); line(-0.8, 0.45, -0.8, 0.8, 0.8, 0.8, 0.8, 0.45); break;
      case "warning": ctx.beginPath(); ctx.moveTo(0, -r * 0.85); ctx.lineTo(r * 0.92, r * 0.75); ctx.lineTo(-r * 0.92, r * 0.75); ctx.closePath(); ctx.stroke(); line(0, -0.3, 0, 0.2); circ(0, 0.46, 0.08, true); break;
      case "check": ctx.lineWidth = s * 0.14; line(-0.62, 0.02, -0.18, 0.46, 0.66, -0.4); break;
      case "close": ctx.lineWidth = s * 0.13; line(-0.55, -0.55, 0.55, 0.55); line(0.55, -0.55, -0.55, 0.55); break;
      case "sun": circ(0, 0, 0.36); for (let i = 0; i < 8; i++) { const a = i * P / 4; line(Math.cos(a) * 0.6, Math.sin(a) * 0.6, Math.cos(a) * 0.85, Math.sin(a) * 0.85); } break;
      case "chat": ctx.beginPath(); rr(ctx, -r * 0.85, -r * 0.7, r * 1.7, r * 1.15, r * 0.3); ctx.stroke(); line(-0.35, 0.45, -0.5, 0.85, 0.05, 0.45); [-0.4, 0, 0.4].forEach(a => circ(a, -0.12, 0.09, true)); break;
      case "game": box(-0.9, -0.42, 1.8, 0.95, 0.42); line(-0.52, 0.05, -0.18, 0.05); line(-0.35, -0.12, -0.35, 0.22); circ(0.32, -0.06, 0.09, true); circ(0.55, 0.16, 0.09, true); break;
      case "globe": circ(0, 0, 0.85); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.36, r * 0.85, 0, 0, P * 2); ctx.stroke(); line(-0.85, 0, 0.85, 0); line(-0.72, -0.42, 0.72, -0.42); line(-0.72, 0.42, 0.72, 0.42); break;
      case "folder": ctx.beginPath(); ctx.moveTo(-r * 0.85, r * 0.7); ctx.lineTo(-r * 0.85, -r * 0.65); ctx.lineTo(-r * 0.3, -r * 0.65); ctx.lineTo(-r * 0.15, -r * 0.45); ctx.lineTo(r * 0.85, -r * 0.45); ctx.lineTo(r * 0.85, r * 0.7); ctx.closePath(); ctx.stroke(); break;
      case "search": circ(-0.15, -0.15, 0.55); line(0.25, 0.25, 0.8, 0.8); break;
      case "back": ctx.lineWidth = s * 0.12; line(0.75, 0, -0.7, 0); line(-0.15, -0.55, -0.72, 0, -0.15, 0.55); break;
      case "chevron": ctx.lineWidth = s * 0.12; line(-0.25, -0.55, 0.3, 0, -0.25, 0.55); break;
      case "plus": ctx.lineWidth = s * 0.13; line(-0.65, 0, 0.65, 0); line(0, -0.65, 0, 0.65); break;
      case "more": [-0.6, 0, 0.6].forEach(b => circ(0, b, 0.12, true)); break;
      case "qr": [[-0.85, -0.85], [0.25, -0.85], [-0.85, 0.25]].forEach(([a, b]) => { box(a, b, 0.6, 0.6, 0.08); box(a + 0.18, b + 0.18, 0.24, 0.24, 0.03, true); }); [[0.3, 0.3], [0.62, 0.62], [0.62, 0.3], [0.3, 0.62]].forEach(([a, b], i) => i % 3 === 0 && box(a, b, 0.22, 0.22, 0.03, true)); break;
      case "eye": case "eyeOff": ctx.beginPath(); ctx.moveTo(-r * 0.9, 0); ctx.quadraticCurveTo(0, -r * 0.85, r * 0.9, 0); ctx.quadraticCurveTo(0, r * 0.85, -r * 0.9, 0); ctx.stroke(); circ(0, 0, 0.25); if (kind === "eyeOff") line(-0.75, -0.75, 0.75, 0.75); break;
      case "fingerprint": for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.27 * i, P * 1.05, P * 1.95 + (i === 1 ? P * 0.9 : 0)); ctx.stroke(); } line(0, 0.1, 0, 0.75); break;
      case "phone": box(-0.48, -0.88, 0.96, 1.76, 0.2); line(-0.12, 0.66, 0.12, 0.66); break;
      case "calc": box(-0.65, -0.85, 1.3, 1.7, 0.16); box(-0.42, -0.62, 0.84, 0.36, 0.05); [[-0.32, 0.1], [0, 0.1], [0.32, 0.1], [-0.32, 0.45], [0, 0.45], [0.32, 0.45]].forEach(([a, b]) => circ(a, b, 0.08, true)); break;
      case "map": ctx.beginPath(); ctx.moveTo(-r * 0.85, -r * 0.6); ctx.lineTo(-r * 0.3, -r * 0.8); ctx.lineTo(r * 0.3, -r * 0.6); ctx.lineTo(r * 0.85, -r * 0.8); ctx.lineTo(r * 0.85, r * 0.6); ctx.lineTo(r * 0.3, r * 0.8); ctx.lineTo(-r * 0.3, r * 0.6); ctx.lineTo(-r * 0.85, r * 0.8); ctx.closePath(); ctx.stroke(); line(-0.3, -0.8, -0.3, 0.6); line(0.3, -0.6, 0.3, 0.8); break;
      case "store": ctx.beginPath(); ctx.moveTo(-r * 0.75, -r * 0.3); ctx.lineTo(r * 0.75, -r * 0.3); ctx.lineTo(r * 0.62, r * 0.85); ctx.lineTo(-r * 0.62, r * 0.85); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -r * 0.3, r * 0.38, P, 0); ctx.stroke(); break;
      case "clock": circ(0, 0, 0.85); line(0, -0.5, 0, 0, 0.36, 0.22); break;
      case "cloud": ctx.beginPath(); ctx.arc(-r * 0.35, r * 0.1, r * 0.38, P * 0.5, P * 1.5); ctx.arc(r * 0.05, -r * 0.2, r * 0.45, P * 1.1, P * 1.9); ctx.arc(r * 0.45, r * 0.15, r * 0.33, P * 1.5, P * 0.5); ctx.closePath(); ctx.stroke(); break;
      case "mail": box(-0.85, -0.6, 1.7, 1.2, 0.12); line(-0.8, -0.5, 0, 0.12, 0.8, -0.5); break;
      case "school": ctx.beginPath(); ctx.moveTo(0, -r * 0.8); ctx.lineTo(r * 0.9, -r * 0.3); ctx.lineTo(-r * 0.9, -r * 0.3); ctx.closePath(); ctx.stroke(); line(-0.75, 0.75, 0.75, 0.75); [-0.5, 0, 0.5].forEach(a => line(a, -0.15, a, 0.6)); break;
      case "photo": box(-0.85, -0.65, 1.7, 1.3, 0.15); line(-0.7, 0.5, -0.2, -0.05, 0.15, 0.3, 0.4, 0.05, 0.7, 0.5); circ(0.35, -0.3, 0.13, true); break;
      case "music": line(-0.3, 0.55, -0.3, -0.7, 0.6, -0.85, 0.6, 0.4); circ(-0.5, 0.55, 0.22, true); circ(0.4, 0.4, 0.22, true); break;
      default: circ(0, 0, 0.6);
    }
    ctx.restore();
  };
  const ICONS = "update shield lock apps location camera mic contacts bell wifi battery key trash flashlight info gear download warning check close sun chat game globe folder search back chevron plus more qr eye eyeOff fingerprint phone calc map store clock user cloud mail school photo music".split(" ");
  HP.ICONS = ICONS;
  HP.appIcon = function (ctx, cx, cy, size, color, ic) {
    ctx.fillStyle = color || UI.primary; rr(ctx, cx - size / 2, cy - size / 2, size, size, size * 0.26); ctx.fill();
    if (!ic) return;
    if (ICONS.includes(ic)) HP.icon(ctx, ic, cx, cy, size * 0.58, "#FFFFFF");
    else text(ctx, ic, cx, cy + size * 0.18, size * 0.5, { align: "center", weight: 900, color: "#FFFFFF" });
  };

  // ---------- bagian layar ----------
  HP.header = function (ctx, title, opt = {}) {
    ctx.fillStyle = opt.bg || UI.surface; ctx.fillRect(0, TOP, W, 68);
    ctx.fillStyle = UI.line; ctx.fillRect(0, TOP + 67, W, 1.5);
    let tx = 24;
    if (opt.back) {
      if (opt.backHl) { ctx.fillStyle = UI.hl; ctx.beginPath(); ctx.arc(32, TOP + 34, 22, 0, Math.PI * 2); ctx.fill(); }
      HP.icon(ctx, "back", 32, TOP + 34, 26, UI.ink); tx = 62;
    }
    text(ctx, title, tx, TOP + 43, 25, { weight: 800, color: UI.ink, fit: W - tx - (opt.action ? 52 : 18) });
    if (opt.action) HP.icon(ctx, opt.action, W - 30, TOP + 34, 24, UI.ink);
    return { bottom: TOP + 68, back: { x: 32, y: TOP + 34 } };
  };
  HP.search = function (ctx, y, s, opt = {}) {
    const x = 16, w = W - 32, h = 50;
    ctx.fillStyle = UI.surface; rr(ctx, x, y, w, h, 25); ctx.fill(); ctx.strokeStyle = opt.focus ? UI.primary : UI.line; ctx.lineWidth = opt.focus ? 2.5 : 1.5; rr(ctx, x, y, w, h, 25); ctx.stroke();
    HP.icon(ctx, "search", x + 30, y + 25, 22, UI.ink2);
    const has = s && s.length; text(ctx, has ? s : (opt.placeholder || "Cari pengaturan"), x + 54, y + 33, 20, { weight: has ? 700 : 500, color: has ? UI.ink : "#8A99A3" });
    if (opt.caret) { ctx.font = "700 20px Inter"; const cw = has ? ctx.measureText(s).width : 0; ctx.fillStyle = UI.ink; ctx.fillRect(x + 56 + cw, y + 13, 2, 24); }
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  };
  HP.toggle = function (ctx, cx, cy, on) {
    const u = on === true ? 1 : on === false || on == null ? 0 : clamp(on, 0, 1), w = 50, h = 28;
    ctx.fillStyle = u > 0.5 ? UI.primary : UI.off; ctx.globalAlpha = 1; rr(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill();
    const kx = lerp(cx - w / 2 + h / 2, cx + w / 2 - h / 2, ease(u));
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(kx, cy, h / 2 - 3.5, 0, Math.PI * 2); ctx.fill();
  };
  HP.radio = function (ctx, cx, cy, on) {
    ctx.strokeStyle = on ? UI.primary : UI.off; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.stroke();
    if (on) { ctx.fillStyle = UI.primary; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill(); }
  };
  HP.list = function (ctx, items, opt = {}) {
    let y = (opt.y || TOP + 80) - (opt.scroll || 0); const x = 12, w = W - 24, out = [];
    // kelompokkan baris berurutan menjadi satu kartu
    const groups = []; let g = null;
    items.forEach((it, i) => { if (it.section != null) { groups.push({ section: it.section, rows: [] }); g = groups[groups.length - 1]; out[i] = null; return; } if (!g) { g = { rows: [] }; groups.push(g); } g.rows.push(i); });
    groups.forEach((gr, gi) => {
      if (gr.section != null) { if (gr.section) { text(ctx, gr.section, x + 10, y + 22, 16, { weight: 800, color: UI.ink2 }); y += 34; } else y += 6; }
      const hs = gr.rows.map(i => items[i].sub ? 82 : 64); const total = hs.reduce((a, b) => a + b, 0);
      if (!gr.rows.length) return;
      ctx.fillStyle = UI.surface; rr(ctx, x, y, w, total, 18); ctx.fill();
      gr.rows.forEach((i, k) => {
        const it = items[i], rh = hs[k], ry = y;
        ctx.save(); if (it.dim) ctx.globalAlpha = 0.42;
        if (it.hl) { ctx.fillStyle = UI.hl; rr(ctx, x + 2, ry + 2, w - 4, rh - 4, 16); ctx.fill(); ctx.strokeStyle = UI.hlLine; ctx.lineWidth = 2.5; rr(ctx, x + 2, ry + 2, w - 4, rh - 4, 16); ctx.stroke(); }
        let lx = x + 18;
        const iconCol = it.danger ? UI.bad : (it.color || UI.primary);
        if (it.app) { HP.appIcon(ctx, x + 38, ry + rh / 2, 40, it.app.color, it.app.icon || it.app.letter); lx = x + 70; }
        else if (it.icon) { ctx.fillStyle = it.danger ? C.badBg : (it.iconBg || UI.primaryBg); ctx.beginPath(); ctx.arc(x + 36, ry + rh / 2, 20, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, it.icon, x + 36, ry + rh / 2, 22, iconCol); lx = x + 68; }
        let right = x + w - 16;
        if (it.toggle != null && it.toggle !== undefined) { HP.toggle(ctx, x + w - 42, ry + rh / 2, it.toggle); right = x + w - 76; }
        else if (it.radio != null) { HP.radio(ctx, x + w - 30, ry + rh / 2, it.radio); right = x + w - 54; }
        else if (it.arrow) { HP.icon(ctx, "chevron", x + w - 22, ry + rh / 2, 16, "#8A99A3"); right = x + w - 38; }
        if (it.value) { ctx.font = "600 17px Inter"; const vw = Math.min(130, ctx.measureText(it.value).width); text(ctx, it.value, right, ry + rh / 2 + 6, 17, { align: "right", weight: 700, color: it.valueColor || UI.ink2, fit: 130 }); right -= vw + 10; }
        if (it.badge) { ctx.fillStyle = UI.bad; ctx.beginPath(); ctx.arc(right - 10, ry + rh / 2, 11, 0, Math.PI * 2); ctx.fill(); text(ctx, it.badge, right - 10, ry + rh / 2 + 5, 14, { align: "center", weight: 900, color: "#FFFFFF" }); right -= 28; }
        const lw = right - lx - 6;
        if (it.sub) { text(ctx, it.label, lx, ry + 35, 21, { weight: 700, color: it.danger ? UI.bad : UI.ink, fit: lw }); text(ctx, it.sub, lx, ry + 61, 16, { weight: 600, color: it.subColor || UI.ink2, fit: lw }); }
        else text(ctx, it.label, lx, ry + rh / 2 + 7, 21, { weight: 700, color: it.danger ? UI.bad : UI.ink, fit: lw });
        ctx.restore();
        if (k < gr.rows.length - 1) { ctx.fillStyle = UI.line; ctx.fillRect(lx, ry + rh - 1, x + w - lx - 12, 1.5); }
        out[i] = { x, y: ry, w, h: rh, cx: x + w / 2, cy: ry + rh / 2, toggle: { x: x + w - 42, y: ry + rh / 2 } };
        y += rh;
      });
      y += opt.gap == null ? 14 : opt.gap;
    });
    out.bottom = y;
    return out;
  };
  HP.button = function (ctx, x, y, w, h, label, opt = {}) {
    const fill = opt.outline ? UI.surface : (opt.fill || UI.primary);
    if (opt.hl) { ctx.fillStyle = "rgba(242,177,52,0.45)"; rr(ctx, x - 5, y - 5, w + 10, h + 10, (opt.r || h / 2) + 5); ctx.fill(); }
    ctx.fillStyle = fill; rr(ctx, x, y, w, h, opt.r || h / 2); ctx.fill();
    if (opt.outline) { ctx.strokeStyle = opt.ink || UI.primary; ctx.lineWidth = 2; rr(ctx, x, y, w, h, opt.r || h / 2); ctx.stroke(); }
    text(ctx, label, x + w / 2, y + h / 2 + (opt.size || 20) * 0.36, opt.size || 20, { align: "center", weight: 800, color: opt.ink || (opt.outline ? UI.primary : "#FFFFFF"), fit: w - 16 });
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  };
  HP.para = function (ctx, s, x, y, size, maxW, opt = {}) { return H.para(ctx, s, x, y, size, maxW, { weight: 600, color: UI.ink2, lh: 1.3, ...opt }); };

  // ---------- notifikasi, dialog, izin ----------
  HP.notif = function (ctx, n, u = 1) {
    const e = ease(clamp(u, 0, 1)), h = n.body ? 104 : 80, y = lerp(-h - 10, TOP + 8, e), x = 12, w = W - 24;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; ctx.fillStyle = UI.surface; rr(ctx, x, y, w, h, 20); ctx.fill(); ctx.restore();
    HP.appIcon(ctx, x + 30, y + 30, 28, n.color || UI.primary, n.icon || "bell");
    text(ctx, n.app || "Sistem", x + 54, y + 36, 16, { weight: 700, color: UI.ink2 }); text(ctx, n.time || "sekarang", x + w - 16, y + 36, 15, { align: "right", weight: 600, color: "#8A99A3" });
    text(ctx, n.title || "", x + 18, y + 66, 19, { weight: 800, color: UI.ink, fit: w - 36 });
    if (n.body) text(ctx, n.body, x + 18, y + 92, 17, { weight: 600, color: UI.ink2, fit: w - 36 });
    return { x, y, w, h };
  };
  HP.dialog = function (ctx, d) {
    const u = d.u == null ? 1 : ease(clamp(d.u, 0, 1)); if (u <= 0) return { box: null, buttons: [] };
    ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = "rgba(15,22,28,0.5)"; ctx.fillRect(0, 0, W, HH);
    const x = 22, w = W - 44; ctx.font = "600 19px Inter";
    const bodyLines = d.body ? wrap(ctx, d.body, 19, 600, w - 48) : [], titleLines = wrap(ctx, d.title || "", 23, 800, w - 48);
    const bh = d.stack ? 56 : 50, btnBlock = d.stack ? (d.buttons || []).length * (bh + 10) + 6 : bh + 10;
    const h = 30 + (d.icon ? 54 : 0) + titleLines.length * 30 + (bodyLines.length ? 12 + bodyLines.length * 26 : 0) + 24 + btnBlock;
    const y = d.y != null ? d.y : (HH - h) / 2 + 10;
    ctx.fillStyle = UI.surface; rr(ctx, x, y, w, h, 26); ctx.fill();
    let yy = y + 30;
    if (d.icon) { HP.icon(ctx, d.icon, W / 2, yy + 18, 34, d.iconColor || UI.primary); yy += 54; }
    titleLines.forEach((ln, i) => text(ctx, ln, W / 2, yy + 20 + i * 30, 23, { align: "center", weight: 800, color: UI.ink })); yy += titleLines.length * 30;
    if (bodyLines.length) { yy += 12; bodyLines.forEach((ln, i) => text(ctx, ln, W / 2, yy + 18 + i * 26, 19, { align: "center", weight: 600, color: UI.ink2 })); yy += bodyLines.length * 26; }
    yy += 24; const out = [];
    (d.buttons || []).forEach((b, i) => {
      if (d.stack) { const by = yy + i * (bh + 10), hl = d.hl === i;
        const r = HP.button(ctx, x + 20, by, w - 40, bh, b, { fill: hl ? UI.primary : UI.primaryBg, ink: hl ? "#FFFFFF" : (d.danger === i ? UI.bad : UI.primary), hl, size: 19, r: 16 }); out.push(r); }
      else { const n = d.buttons.length, bw = 120, bx = x + w - 20 - (n - i) * (bw + 8), hl = d.hl === i;
        const r = HP.button(ctx, bx, yy, bw, bh - 4, b, { fill: hl ? (d.danger === i ? UI.bad : UI.primary) : UI.surface, ink: hl ? "#FFFFFF" : (d.danger === i ? UI.bad : UI.primary), hl, size: 19, r: 14 }); out.push(r); }
    });
    ctx.restore();
    return { box: { x, y, w, h }, buttons: out };
  };
  HP.permission = function (ctx, p) {
    const app = p.app || "Aplikasi", perm = p.perm || "lokasi";
    const icons = { lokasi: "location", kamera: "camera", mikrofon: "mic", kontak: "contacts", notifikasi: "bell", foto: "photo", file: "folder" };
    return HP.dialog(ctx, { icon: p.icon || icons[perm] || "info", iconColor: p.color || UI.primary, title: p.question || `Izinkan ${app} mengakses ${perm}?`,
      buttons: p.buttons || ["Saat aplikasi digunakan", "Hanya kali ini", "Jangan izinkan"], stack: true, hl: p.hl, u: p.u, y: p.y });
  };
  HP.toast = function (ctx, msg, u = 1, opt = {}) {
    const a = clamp(u < 0.15 ? u / 0.15 : u > 0.85 ? (1 - u) / 0.15 : 1, 0, 1); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.font = "700 18px Inter"; const w = Math.min(W - 40, ctx.measureText(msg).width + 44), y = opt.y || HH - 110;
    ctx.fillStyle = "rgba(31,42,51,0.92)"; rr(ctx, (W - w) / 2, y, w, 46, 23); ctx.fill(); text(ctx, msg, W / 2, y + 30, 18, { align: "center", weight: 700, color: "#FFFFFF", fit: w - 30 }); ctx.restore();
  };

  // ---------- keyboard angka, kode, PIN ----------
  const PAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"];
  HP.numpadKey = function (ch, y0 = 452) { const i = PAD_KEYS.indexOf(ch); const c = i % 3, r = Math.floor(i / 3); return { x: 16 + c * 110 + 54, y: y0 + 12 + r * 62 + 28 }; };
  HP.numpad = function (ctx, opt = {}) {
    const y0 = opt.y || 452; ctx.fillStyle = "#DDE3E8"; ctx.fillRect(0, y0, W, HH - y0);
    PAD_KEYS.forEach((k, i) => {
      const c = i % 3, r = Math.floor(i / 3), x = 16 + c * 110, y = y0 + 12 + r * 62, on = opt.press === k && (opt.pressU == null || (opt.pressU > 0.1 && opt.pressU < 0.8));
      const special = k === "⌫" || k === "✓";
      ctx.fillStyle = on ? "#FFE7A8" : k === "✓" ? (opt.done === false ? "#9FB6CC" : UI.primary) : special ? "#C7D0D7" : "#FFFFFF"; rr(ctx, x, y, 108, 56, 12); ctx.fill();
      if (k === "⌫") HP.icon(ctx, "back", x + 54, y + 28, 24, UI.ink);
      else if (k === "✓") HP.icon(ctx, "check", x + 54, y + 28, 26, "#FFFFFF");
      else text(ctx, k, x + 54, y + 38, 28, { align: "center", weight: 700, color: UI.ink });
    });
    return { key: ch => HP.numpadKey(ch, y0) };
  };
  HP.codeBoxes = function (ctx, cx, y, value = "", opt = {}) {
    const n = opt.n || 6, bw = opt.size || 42, gap = 8, total = n * bw + (n - 1) * gap + (n === 6 ? 14 : 0); let x = cx - total / 2;
    for (let i = 0; i < n; i++) {
      if (n === 6 && i === 3) x += 14;
      const ch = value[i] || "", act = opt.active !== false && i === value.length;
      ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, bw, bw * 1.25, 10); ctx.fill();
      ctx.strokeStyle = opt.error ? UI.bad : act ? UI.primary : "#B9C4CC"; ctx.lineWidth = act || opt.error ? 2.5 : 1.8; rr(ctx, x, y, bw, bw * 1.25, 10); ctx.stroke();
      if (ch) text(ctx, ch, x + bw / 2, y + bw * 0.85, bw * 0.62, { align: "center", weight: 800, color: opt.error ? UI.bad : UI.ink });
      x += bw + gap;
    }
    return { x: cx - total / 2, y, w: total, h: bw * 1.25 };
  };
  HP.pinDots = function (ctx, cx, y, n, filled) {
    const gap = 30; const x0 = cx - (n - 1) * gap / 2;
    for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(x0 + i * gap, y, 8, 0, Math.PI * 2); if (i < filled) { ctx.fillStyle = UI.ink; ctx.fill(); } else { ctx.strokeStyle = UI.ink2; ctx.lineWidth = 2; ctx.stroke(); } }
  };

  // ---------- autentikator ----------
  HP.totp = function (t, period = 30) { const p = ((t % period) + period) % period; return { secs: Math.ceil(period - p), frac: 1 - p / period, idx: Math.floor(t / period) }; };
  HP.ring = function (ctx, cx, cy, r, frac, color) {
    ctx.fillStyle = "#E3E9EE"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color || UI.primary; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(frac, 0, 1)); ctx.closePath(); ctx.fill();
  };
  HP.auth = function (ctx, opt = {}) {
    HP.header(ctx, opt.title || "Autentikator", { action: "more" });
    const cards = [];
    if (opt.empty || !(opt.accounts || []).length) {
      HP.icon(ctx, "shield", W / 2, 300, 90, "#9FB6CC");
      HP.para(ctx, "Belum ada akun. Tap tanda tambah untuk menambah akun.", W / 2, 400, 20, 280, { align: "center" });
    }
    (opt.accounts || []).forEach((a, i) => {
      const y = 124 + i * 150, x = 12, w = W - 24;
      ctx.fillStyle = UI.surface; rr(ctx, x, y, w, 136, 18); ctx.fill();
      if (a.hl) { ctx.strokeStyle = UI.hlLine; ctx.lineWidth = 3; rr(ctx, x, y, w, 136, 18); ctx.stroke(); }
      text(ctx, a.issuer, x + 20, y + 34, 19, { weight: 800, color: UI.ink, fit: w - 40 });
      text(ctx, a.user || "", x + 20, y + 58, 16, { weight: 600, color: UI.ink2, fit: w - 40 });
      const code = String(a.code || "000000"), red = a.secs != null && a.secs <= 5;
      text(ctx, code.slice(0, 3) + " " + code.slice(3), x + 20, y + 112, 44, { weight: 800, color: red ? UI.bad : UI.primary });
      if (a.secs != null) { const per = a.period || 30; HP.ring(ctx, x + w - 38, y + 96, 18, a.secs / per, red ? UI.bad : UI.primary); }
      cards.push({ x, y, w, h: 136, code: { x: x + 20, y: y + 96 }, ring: { x: x + w - 38, y: y + 96 } });
    });
    let menu = null;
    if (opt.menu) {
      ctx.fillStyle = "rgba(15,22,28,0.35)"; ctx.fillRect(0, 0, W, HH);
      const items = [["qr", "Pindai kode QR"], ["key", "Ketik kunci penyiapan"]];
      menu = {};
      items.forEach(([ic, s], i) => { const y = 520 + i * 66, hl = opt.menuHl === i;
        ctx.fillStyle = hl ? UI.hl : UI.surface; rr(ctx, 60, y, 270, 54, 16); ctx.fill(); if (hl) { ctx.strokeStyle = UI.hlLine; ctx.lineWidth = 2.5; rr(ctx, 60, y, 270, 54, 16); ctx.stroke(); }
        HP.icon(ctx, ic, 90, y + 27, 22, UI.primary); text(ctx, s, 114, y + 34, 18, { weight: 700, color: UI.ink, fit: 205 });
        menu[i === 0 ? "scan" : "key"] = { x: 195, y: y + 27 }; });
    }
    const fab = { x: W - 56, y: HH - 84 };
    if (opt.fabHl) { ctx.fillStyle = "rgba(242,177,52,0.45)"; ctx.beginPath(); ctx.arc(fab.x, fab.y, 38, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = UI.primary; rr(ctx, fab.x - 30, fab.y - 30, 60, 60, 20); ctx.fill(); HP.icon(ctx, opt.menu ? "close" : "plus", fab.x, fab.y, 26, "#FFFFFF");
    return { fab, cards, menu };
  };

  // ---------- kamera pemindai & pola QR ----------
  HP.scanner = function (ctx, opt = {}) {
    ctx.fillStyle = "#11181D"; ctx.fillRect(0, 0, W, HH);
    const bx = 50, by = 220, bs = 260, box = { x: bx, y: by, w: bs, h: bs };
    if (opt.inner) { ctx.save(); ctx.beginPath(); ctx.rect(0, TOP, W, HH - TOP); ctx.clip(); opt.inner(ctx, box); ctx.restore(); }
    // gelapkan di luar bingkai bidik
    ctx.fillStyle = "rgba(10,14,18,0.55)"; ctx.fillRect(0, 0, W, by); ctx.fillRect(0, by + bs, W, HH - by - bs); ctx.fillRect(0, by, bx, bs); ctx.fillRect(bx + bs, by, W - bx - bs, bs);
    const col = opt.found ? "#4CD07D" : "#FFFFFF"; ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.lineCap = "round"; const k = 40;
    [[bx, by, 1, 1], [bx + bs, by, -1, 1], [bx, by + bs, 1, -1], [bx + bs, by + bs, -1, -1]].forEach(([x, y, sx, sy]) => { ctx.beginPath(); ctx.moveTo(x, y + sy * k); ctx.lineTo(x, y); ctx.lineTo(x + sx * k, y); ctx.stroke(); });
    text(ctx, opt.title || "Pindai kode QR", W / 2, TOP + 52, 22, { align: "center", weight: 800, color: "#FFFFFF" });
    HP.para(ctx, opt.found ? (opt.foundText || "Kode ditemukan") : (opt.hint || "Arahkan kamera ke kode QR"), W / 2, by + bs + 60, 20, 300, { align: "center", color: opt.found ? "#4CD07D" : "#DDE5EA", weight: 700 });
    return box;
  };
  HP.qr = function (ctx, x, y, size, seed = 7) {
    const n = 25, m = size / n; let s = seed * 9301 + 49297;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x - m * 2, y - m * 2, size + m * 4, size + m * 4); ctx.fillStyle = "#1F2A33";
    const finder = (r, c) => r < 8 && c < 8 || r < 8 && c >= n - 8 || r >= n - 8 && c < 8;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const v = rnd(); if (!finder(r, c) && v > 0.52) ctx.fillRect(x + c * m, y + r * m, m + 0.5, m + 0.5); }
    [[0, 0], [0, n - 7], [n - 7, 0]].forEach(([r, c]) => { const fx = x + c * m, fy = y + r * m;
      ctx.fillRect(fx, fy, 7 * m, 7 * m); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(fx + m, fy + m, 5 * m, 5 * m); ctx.fillStyle = "#1F2A33"; ctx.fillRect(fx + 2 * m, fy + 2 * m, 3 * m, 3 * m); });
  };

  // ---------- obrolan ----------
  HP.chat = function (ctx, opt = {}) {
    ctx.fillStyle = "#E9EEF0"; ctx.fillRect(0, TOP, W, HH - TOP);
    ctx.fillStyle = UI.surface; ctx.fillRect(0, TOP, W, 72); ctx.fillStyle = UI.line; ctx.fillRect(0, TOP + 71, W, 1.5);
    HP.icon(ctx, "back", 26, TOP + 36, 22, UI.ink);
    ctx.fillStyle = opt.color || "#7B8B95"; ctx.beginPath(); ctx.arc(70, TOP + 36, 20, 0, Math.PI * 2); ctx.fill();
    text(ctx, (opt.name || "?").slice(0, 1), 70, TOP + 43, 20, { align: "center", weight: 900, color: "#FFFFFF" });
    text(ctx, opt.name || "", 100, TOP + 32, 19, { weight: 800, color: UI.ink, fit: 240 });
    if (opt.sub) text(ctx, opt.sub, 100, TOP + 54, 15, { weight: 600, color: opt.subColor || UI.ink2, fit: 240 });
    let y = TOP + 92; const out = [];
    (opt.messages || []).forEach((m, i) => {
      const me = m.from === "me", maxW = opt.maxW || 250, fs = opt.size || 18, lh = Math.round(fs * 1.33); ctx.font = `600 ${fs}px Inter`; const lines = wrap(ctx, m.text, fs, 600, maxW - 28);
      const bw = Math.max(90, Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width)) + 30)), bh = lines.length * lh + 36;
      const bx = me ? W - 14 - bw : 14;
      ctx.fillStyle = me ? "#D7F0DC" : UI.surface; rr(ctx, bx, y, bw, bh, 16); ctx.fill();
      if (opt.warn === i) { ctx.strokeStyle = UI.bad; ctx.lineWidth = 3; rr(ctx, bx, y, bw, bh, 16); ctx.stroke(); }
      lines.forEach((ln, k) => text(ctx, ln, bx + 14, y + 8 + fs + k * lh, fs, { weight: 600, color: UI.ink }));
      if (m.time) text(ctx, m.time, bx + bw - 12, y + bh - 9, 13, { align: "right", weight: 600, color: "#8A99A3" });
      out.push({ x: bx, y, w: bw, h: bh }); y += bh + 12;
    });
    if (opt.input !== false) { ctx.fillStyle = UI.surface; rr(ctx, 12, HH - 84, W - 84, 50, 25); ctx.fill(); text(ctx, opt.input || "Ketik pesan", 34, HH - 52, 17, { weight: 600, color: opt.input ? UI.ink : "#8A99A3", fit: W - 130 });
      ctx.fillStyle = UI.good; ctx.beginPath(); ctx.arc(W - 42, HH - 59, 25, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "chevron", W - 40, HH - 59, 18, "#FFFFFF"); }
    return out;
  };

  // ---------- layar utama ----------
  HP.home = function (ctx, apps, opt = {}) {
    const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, "#CFE6EE"); g.addColorStop(1, "#E9F1E4"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
    text(ctx, opt.clock || "07.15", W / 2, 140, 64, { align: "center", weight: 800, color: UI.ink });
    text(ctx, opt.date || "Rabu, 4 November", W / 2, 176, 19, { align: "center", weight: 600, color: UI.ink2 });
    const cols = opt.cols || 4, cw = (W - 24) / cols, out = [];
    apps.forEach((a, i) => { const c = i % cols, r = Math.floor(i / cols), x = 12 + cw * c + cw / 2, y = 250 + r * 104;
      if (opt.hl === a.name) { ctx.fillStyle = "rgba(242,177,52,0.5)"; rr(ctx, x - 38, y - 38, 76, 76, 22); ctx.fill(); }
      HP.appIcon(ctx, x, y, 58, a.color, a.icon || a.name.slice(0, 1));
      text(ctx, a.name, x, y + 50, 15, { align: "center", weight: 700, color: UI.ink, fit: cw - 6 }); out.push({ name: a.name, x, y }); });
    return out;
  };
  HP.progress = function (ctx, x, y, w, frac, opt = {}) {
    const h = opt.h || 10; ctx.fillStyle = "#DDE5EA"; rr(ctx, x, y, w, h, h / 2); ctx.fill();
    ctx.fillStyle = opt.color || UI.primary; rr(ctx, x, y, Math.max(h, w * clamp(frac, 0, 1)), h, h / 2); ctx.fill();
  };
  HP.spinner = function (ctx, cx, cy, r, t) {
    ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = UI.primary; ctx.lineCap = "round"; ctx.beginPath(); const a = t * 5; ctx.arc(cx, cy, r, a, a + Math.PI * 0.6); ctx.stroke();
  };

  // ---------- lup ----------
  HP.magnify = function (ctx, ph, draw, src, dst, opt = {}) {
    const k = dst.k || (dst.w ? dst.w / src.w : 2), w = src.w * k, h = src.h * k, a = ph.rect(src.u, src.v, src.w, src.h), col = opt.color || C.accent;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(a.x + a.w, a.y); ctx.lineTo(dst.x, dst.y + 10); ctx.moveTo(a.x + a.w, a.y + a.h); ctx.lineTo(dst.x, dst.y + h - 10); ctx.stroke();
    ctx.globalAlpha = 1; ctx.lineWidth = 3.5; rr(ctx, a.x, a.y, a.w, a.h, 8); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 8; ctx.fillStyle = opt.bg || UI.bg; rr(ctx, dst.x, dst.y, w, h, 20); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, dst.x, dst.y, w, h, 20); ctx.clip(); ctx.translate(dst.x - src.u * k, dst.y - src.v * k); ctx.scale(k, k);
    ctx.fillStyle = opt.bg || UI.bg; ctx.fillRect(src.u, src.v, src.w, src.h); if (draw) draw(ctx, ph); ctx.restore();
    ctx.strokeStyle = col; ctx.lineWidth = 4; rr(ctx, dst.x, dst.y, w, h, 20); ctx.stroke();
    return { x: dst.x, y: dst.y, w, h, k, at: (u, v) => ({ x: dst.x + (u - src.u) * k, y: dst.y + (v - src.v) * k }) };
  };

  // ---------- efek tap ----------
  HP.tap = function (ctx, x, y, u, opt = {}) {
    if (u == null || u <= 0 || u >= 1) return; const r = opt.r || 24;
    if (u < 0.45) { const a = ease(u / 0.2); ctx.fillStyle = `rgba(242,177,52,${0.45 * a})`; ctx.beginPath(); ctx.arc(x, y, r * (0.7 + 0.3 * a), 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(181,122,18,${0.9 * a})`; ctx.lineWidth = 3; ctx.stroke(); }
    else { const v = (u - 0.45) / 0.55; ctx.strokeStyle = `rgba(242,177,52,${1 - v})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r + v * r * 1.3, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(242,177,52,${0.35 * (1 - v)})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  };

  // ---------- penerjemah langkah ----------
  HP.run = function (base, steps, l, span) {
    const st = { ...(base || {}) }; delete st.pointer;
    const total = steps.reduce((a, s) => a + (s.d || 1), 0), unit = span / total;
    let t0 = 0, tap = null, ptr = base && base.pointer ? { ...base.pointer } : null, click = 0, key = null, cur = 0, cu = 0;
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i], d = (s.d || 1) * unit; if (l < t0) break;
      const u = clamp((l - t0) / d, 0, 1); cur = i; cu = u;
      if (s.tap) { if (u < 1) tap = { x: s.tap[0], y: s.tap[1], u }; else tap = null; if (u >= 0.5 && s.set) Object.assign(st, s.set); }
      else if (s.to) { const from = ptr || { x: s.to[0], y: s.to[1] }, m = ease(clamp(u / 0.6, 0, 1)); ptr = { x: lerp(from.x, s.to[0], m), y: lerp(from.y, s.to[1], m) };
        if (u >= 1) ptr = { x: s.to[0], y: s.to[1] };
        click = s.click && u >= 0.6 && u < 1 ? (u - 0.6) / 0.4 : 0; if (s.set && (!s.click || u >= 0.65)) Object.assign(st, s.set); }
      else if (s.set) Object.assign(st, s.set);
      if (s.type != null) { const n = Math.round(s.type.length * clamp(u / 0.9, 0, 1)); st[s.field || "typed"] = (s.prefix || "") + s.type.slice(0, n); st.caret = true; }
      if (s.numpad != null) { const n = s.numpad.length, k = Math.min(n - 1, Math.floor(u * n)), su = u * n - k, ch = s.numpad[k];
        const p = HP.numpadKey(ch, s.y); tap = u < 1 ? { x: p.x, y: p.y, u: su } : null; st.press = u < 1 ? ch : null; st.pressU = su;
        st[s.field || "typed"] = (s.prefix || "") + s.numpad.slice(0, k + (su >= 0.5 ? 1 : 0)); if (u >= 1) st[s.field || "typed"] = (s.prefix || "") + s.numpad; }
      if (s.key) key = u < 1 ? { keys: [].concat(s.key), press: u } : null;
      if (s.anim) st[s.anim] = u;
      t0 += d;
    }
    return { st, tap, ptr, click, key, i: cur, u: cu };
  };

  K.hp = HP;
})(typeof window !== "undefined" ? window : globalThis);
