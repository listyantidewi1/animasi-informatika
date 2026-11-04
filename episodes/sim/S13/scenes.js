/* S13 Simulasi praktik: merapikan keamanan HP di aplikasi Pengaturan generik (memakai ../../_alat/layar_hp.js).
   Tata letak: HP besar di kiri (cx 560), keterangan di tengah (x 900–1420), panel langkah di kanan (x 1450–1820).
   Cerita menyambung D9.3: HP Dito sempat terpasang aplikasi "Kuota Gratis 50GB" dari link di grup. Semua aplikasi rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, HP = K.hp;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const PC = { cx: 560, cy: 474, h: 680 }, S = PC.h / HP.H, PX = PC.cx - HP.W * S / 2, PY = PC.cy - PC.h / 2;
  const at = (u, v) => ({ x: PX + u * S, y: PY + v * S });
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B", ORANGE = "#E07B2E";

  // ---------- aplikasi rekaan ----------
  const APP = {
    kuota: { color: ORANGE, icon: "download" }, senter: { color: "#E0A23B", icon: "flashlight" }, balap: { color: "#8E6BBF", icon: "game" },
    peta: { color: "#2E9E5B", icon: "map" }, kamera: { color: "#2E7E9A", icon: "camera" }, obrolan: { color: "#4C9BE0", icon: "chat" },
    browser: { color: "#5B6B76", icon: "globe" }, file: { color: "#C98A57", icon: "folder" }, email: { color: "#D9443B", icon: "mail" },
    telepon: { color: GREEN, icon: "phone" }, kalku: { color: "#7B8B95", icon: "calc" }, foto: { color: "#5FA8D3", icon: "photo" }
  };

  // ---------- pembantu ----------
  let MC = null;
  function measure(fn) { if (!MC) MC = document.createElement("canvas"); MC.width = 400; MC.height = 800; const m = MC.getContext("2d"); m.save(); const r = fn(m); m.restore(); return r; }
  const rowsOf = (items, opt) => measure(m => HP.list(m, items, opt));
  const tapRow = (rows, i, dx = 0) => [rows[i].x + rows[i].w * 0.5 + dx, rows[i].cy];
  function phone(ctx, draw, opt = {}) { return HP.phone(ctx, opt.cx || PC.cx, opt.cy || PC.cy, { h: opt.h || PC.h, ...opt }, draw); }
  function steps(ctx, title, items, n, opt = {}) {
    const x = opt.x || 1450, y = opt.y || 122, w = opt.w || 370; let hh = 70;
    const rows = items.map(s => wrap(ctx, s, 23, 700, w - 86)); rows.forEach(lines => hh += lines.length * 30 + 22);
    card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, title, x + 24, y + 44, 24, { weight: 900, color: C.accentDark });
    let yy = y + 74;
    rows.forEach((lines, i) => {
      const done = i < n, now = i === n;
      if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 10, yy - 8, w - 20, lines.length * 30 + 16, 10); ctx.fill(); }
      ctx.fillStyle = done ? GREEN : now ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(x + 36, yy + 13, 14, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 36, yy + 21, 18, { align: "center", weight: 900, color: "#FFFFFF" });
      lines.forEach((ln, j) => text(ctx, ln, x + 62, yy + 22 + j * 30, 23, { weight: 700, color: done ? C.ink2 : C.ink }));
      yy += lines.length * 30 + 22;
    });
    return y + hh;
  }
  const stepAt = (l, span, marks) => { let n = 0; marks.forEach((m, i) => { if (l >= m * span) n = i + 1; }); return n; };
  const spanOf = (b, k = 0.9) => Math.max(3, (b.audio || b.dur) * k);
  const after = (b, l, f) => l > (b.audio || b.dur) * f;
  function note(ctx, x, y, s, opt = {}) { return L.callout(ctx, x, y, s, opt.tx, opt.ty, { size: opt.size || 24, maxW: opt.maxW || 420, ...opt }); }
  function badge(ctx, x, y, ok, s, opt = {}) {
    const h = opt.h || 76, w = opt.w || 500; ctx.fillStyle = ok ? C.goodBg : C.badBg; rr(ctx, x, y, w, h, 14); ctx.fill();
    ctx.fillStyle = ok ? GREEN : RED; ctx.beginPath(); ctx.arc(x + 34, y + h / 2, 19, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ok ? "check" : "close", x + 34, y + h / 2, 18, "#FFFFFF");
    const sz = opt.size || 24, lines = wrap(ctx, s, sz, 800, w - 80); lines.forEach((ln, i) => text(ctx, ln, x + 66, y + h / 2 + sz * 0.36 - (lines.length - 1) * sz * 0.6 + i * sz * 1.2, sz, { weight: 800, color: C.ink }));
  }
  function tapDraw(c, R) { if (R.tap) HP.tap(c, R.tap.x, R.tap.y, R.tap.u); }

  // ---------- layar Pengaturan ----------
  const ROOT = [{ label: "Wi-Fi dan jaringan", icon: "wifi" }, { label: "Tampilan", icon: "sun" }, { label: "Baterai", icon: "battery" }, { label: "Aplikasi", icon: "apps" },
    { label: "Privasi", icon: "eye" }, { label: "Keamanan", icon: "shield" }, { label: "Pembaruan sistem", icon: "update", badge: "1" }, { label: "Tentang HP", icon: "info" }];
  const ROOT_Y = 176, IDX = { aplikasi: 3, privasi: 4, keamanan: 5, update: 6 };
  function root(c, opt = {}) {
    HP.header(c, "Pengaturan"); HP.search(c, 112, opt.search || "", { focus: opt.searchFocus, caret: opt.searchFocus });
    const items = ROOT.map((it, i) => ({ ...it, arrow: false, hl: opt.hl === i, badge: it.badge && !opt.updated ? it.badge : null }));
    return HP.list(c, items, { y: ROOT_Y });
  }
  const ROOT_ROWS = () => rowsOf(ROOT, { y: ROOT_Y });
  function searchResults(c, q) {
    HP.header(c, "Pengaturan", { back: true }); HP.search(c, 112, q, { focus: true, caret: true });
    const res = q.length >= 3 ? [{ label: "Pembaruan sistem", sub: "Pengaturan › Pembaruan sistem", icon: "update" }, { label: "Pembaruan otomatis", sub: "Pembaruan sistem › Otomatis", icon: "update" }, { label: "Pembaruan aplikasi", sub: "Toko aplikasi", icon: "store" }] : [];
    if (res.length) HP.list(c, res, { y: 182 });
  }
  // halaman pembaruan sistem. st.u: "awal" | "cek" | "ada" | "unduh" (p 0..1) | "restart" | "baru"
  function updatePage(c, st = {}) {
    if (st.u === "restart") { c.fillStyle = "#11181D"; c.fillRect(0, 0, HP.W, HP.H); HP.spinner(c, 180, 360, 30, st.t || 0); text(c, "Memulai ulang…", 180, 430, 22, { align: "center", weight: 700, color: "#FFFFFF" }); return {}; }
    HP.header(c, "Pembaruan sistem", { back: true, backHl: st.backHl });
    const ok = st.u === "baru";
    c.fillStyle = ok ? C.goodBg : "#E3EEFA"; c.beginPath(); c.arc(180, 190, 52, 0, Math.PI * 2); c.fill(); HP.icon(c, ok ? "check" : "update", 180, 190, 56, ok ? GREEN : BLUE);
    const out = {};
    if (st.u === "awal" || st.u === "cek") {
      text(c, "Versi sistem 5.1", 180, 282, 24, { align: "center", weight: 800 }); text(c, "Pembaruan keamanan: Maret 2026", 180, 312, 18, { align: "center", weight: 600, color: "#5B6B76" });
      if (st.u === "cek") { HP.spinner(c, 120, 400, 16, st.t || 0); text(c, "Memeriksa pembaruan…", 146, 407, 19, { weight: 700, color: "#5B6B76" }); }
      out.btn = HP.button(c, 60, 470, 240, 56, "Cek pembaruan", { hl: st.hl, fill: st.u === "cek" ? "#9FB6CC" : BLUE });
    } else if (st.u === "ada" || st.u === "unduh") {
      text(c, "Pembaruan tersedia", 180, 282, 24, { align: "center", weight: 800, color: BLUE });
      c.fillStyle = "#FFFFFF"; rr(c, 16, 304, 328, 150, 18); c.fill();
      text(c, "Versi 5.2", 36, 340, 21, { weight: 800 }); text(c, "Pembaruan keamanan · 850 MB", 36, 368, 17, { weight: 600, color: "#5B6B76" });
      HP.icon(c, "wifi", 46, 404, 18, GREEN); text(c, "Sambungkan ke Wi-Fi", 66, 410, 17, { weight: 700, color: C.ink });
      HP.icon(c, "battery", 46, 434, 18, GREEN); text(c, "Baterai minimal 50%", 66, 440, 17, { weight: 700, color: C.ink });
      if (st.u === "unduh") { const p = st.p || 0; text(c, p < 0.6 ? "Download… " + Math.round(p / 0.6 * 100) + "%" : p < 1 ? "Memasang… " + Math.round((p - 0.6) / 0.4 * 100) + "%" : "Siap dimulai ulang", 36, 494, 19, { weight: 800, color: C.ink });
        HP.progress(c, 36, 508, 288, p < 0.6 ? p / 0.6 : (p - 0.6) / 0.4, { h: 12, color: p < 0.6 ? BLUE : GREEN });
        if (p < 1) text(c, "Jangan matikan HP.", 36, 552, 17, { weight: 700, color: RED });
        out.btn = HP.button(c, 60, 600, 240, 56, "Mulai ulang", { hl: st.hl2, fill: p >= 1 ? BLUE : "#9FB6CC" }); }
      else out.btn = HP.button(c, 40, 490, 280, 56, "Download dan pasang", { hl: st.hl });
    } else if (ok) {
      text(c, "Sistem sudah terbaru", 180, 282, 24, { align: "center", weight: 800, color: GREEN }); text(c, "Versi 5.2 · November 2026", 180, 312, 18, { align: "center", weight: 600, color: "#5B6B76" });
      const r = HP.list(c, [{ label: "Pembaruan otomatis", sub: "Pasang saat HP diisi daya", toggle: st.auto, hl: st.autoHl }], { y: 350 }); out.auto = r[0];
    }
    return out;
  }
  const SEC_ITEMS = (o = {}) => [{ label: "Kunci layar", icon: "lock", value: o.pin ? "PIN" : "Geser", valueColor: o.pin ? GREEN : RED, arrow: true, hl: o.hl === 0 },
    { label: "Sidik jari", icon: "fingerprint", arrow: true }, { label: "Pasang aplikasi tidak dikenal", sub: o.src ? "Tidak ada yang diizinkan" : "2 aplikasi diizinkan", subColor: o.src ? GREEN : RED, icon: "warning", arrow: true, hl: o.hl === 2 },
    { label: "Pindai aplikasi berbahaya", sub: "Aktif", subColor: GREEN, icon: "shield", arrow: true }];
  function secPage(c, o = {}) { HP.header(c, "Keamanan", { back: true }); return HP.list(c, SEC_ITEMS(o), { y: 120 }); }
  const SRC_ITEMS = (o = {}) => [{ section: "" }, { label: "Browser", app: APP.browser, sub: o.browser ? "Tidak diizinkan" : "Diizinkan", subColor: o.browser ? "#5B6B76" : RED, arrow: true, hl: o.hl === 1 },
    { label: "Obrolan", app: APP.obrolan, sub: o.obrolan ? "Tidak diizinkan" : "Diizinkan", subColor: o.obrolan ? "#5B6B76" : RED, arrow: true, hl: o.hl === 2 },
    { label: "File", app: APP.file, sub: "Tidak diizinkan", arrow: true }, { label: "Email", app: APP.email, sub: "Tidak diizinkan", arrow: true }];
  function srcPage(c, o = {}) { HP.header(c, "Pasang aplikasi tidak dikenal", { back: true }); HP.para(c, "Aplikasi di bawah ini boleh memasang aplikasi lain dari luar toko resmi.", 20, 136, 17, 320); return HP.list(c, SRC_ITEMS(o), { y: 180 }); }
  function srcApp(c, name, app, on, hl) {
    HP.header(c, name, { back: true }); HP.appIcon(c, 180, 180, 76, app.color, app.icon); text(c, name, 180, 256, 24, { align: "center", weight: 800 });
    const r = HP.list(c, [{ label: "Izinkan dari sumber ini", toggle: on, hl }], { y: 290 });
    c.fillStyle = "#FFF6E0"; rr(c, 16, 380, 328, 120, 16); c.fill(); HP.icon(c, "warning", 42, 410, 22, "#B57A12");
    HP.para(c, "HP dan datamu lebih mudah diserang oleh aplikasi dari sumber tidak dikenal.", 64, 416, 16, 264, { color: "#7A5208", weight: 700 });
    return r;
  }
  const APPS = (o = {}) => [{ section: "URUTKAN: TERAKHIR DIPAKAI" }, ...(o.kuota === false ? [] : [{ label: "Kuota Gratis 50GB", app: APP.kuota, sub: "2 bulan lalu · dari luar toko", subColor: RED, hl: o.hl === "kuota" }]),
    { label: "Balap Liar", app: APP.balap, sub: "5 bulan lalu", hl: o.hl === "balap" }, { label: "Senter Super", app: APP.senter, sub: "1 bulan lalu", hl: o.hl === "senter" },
    { label: "Peta", app: APP.peta, sub: "hari ini" }, { label: "Kamera", app: APP.kamera, sub: "hari ini" }, { label: "Obrolan", app: APP.obrolan, sub: "hari ini" }];
  function appsPage(c, o = {}) { HP.header(c, "Aplikasi", { back: true, action: "search" }); return HP.list(c, APPS(o), { y: 112 }); }
  function appInfo(c, o = {}) {
    HP.header(c, "Info aplikasi", { back: true }); HP.appIcon(c, 180, 170, 76, APP.kuota.color, APP.kuota.icon);
    text(c, "Kuota Gratis 50GB", 180, 246, 24, { align: "center", weight: 800 }); text(c, "Dipasang dari luar toko resmi", 180, 272, 16, { align: "center", weight: 700, color: RED });
    const bs = [["Buka", "globe"], ["Uninstal", "trash"], ["Paksa berhenti", "close"]], out = {};
    bs.forEach(([s, ic], i) => { const x = 30 + i * 104, hl = o.hl === i; c.fillStyle = hl ? "#FFF3D6" : "#FFFFFF"; rr(c, x, 296, 92, 84, 16); c.fill(); if (hl) { c.strokeStyle = C.accent; c.lineWidth = 2.5; rr(c, x, 296, 92, 84, 16); c.stroke(); }
      HP.icon(c, ic, x + 46, 326, 24, i === 1 ? RED : BLUE); text(c, s, x + 46, 364, 15, { align: "center", weight: 800, color: i === 1 ? RED : BLUE, fit: 86 }); out[s] = { x: x + 46, y: 338 }; });
    HP.list(c, [{ label: "Izin", sub: "SMS, kontak, lokasi", subColor: RED, arrow: true }, { label: "Penyimpanan", sub: "120 MB", arrow: true }, { label: "Notifikasi", sub: "Diizinkan", arrow: true }], { y: 396 });
    if (o.dialog) { const d = HP.dialog(c, { title: "Uninstal Kuota Gratis 50GB?", body: "Aplikasi dan datanya akan dihapus dari HP.", buttons: ["Batal", "OK"], hl: o.ok ? 1 : null, u: o.dialog }); out.ok = d.buttons[1]; }
    return out;
  }
  const PERMS = [{ label: "Lokasi", icon: "location", sub: "5 aplikasi diizinkan" }, { label: "Kamera", icon: "camera", sub: "3 aplikasi diizinkan" }, { label: "Mikrofon", icon: "mic", sub: "2 aplikasi diizinkan" },
    { label: "Kontak", icon: "contacts", sub: "3 aplikasi diizinkan" }, { label: "SMS", icon: "chat", sub: "1 aplikasi diizinkan" }];
  function permRoot(c, hl) { HP.header(c, "Pengelola izin", { back: true }); return HP.list(c, PERMS.map((p, i) => ({ ...p, arrow: true, hl: hl === i })), { y: 120 }); }
  const KONTAK = (o = {}) => [{ section: "DIIZINKAN" }, { label: "Obrolan", app: APP.obrolan }, { label: "Telepon", app: APP.telepon }, ...(o.senterOff ? [] : [{ label: "Senter Super", app: APP.senter, hl: o.hl, danger: o.danger }]),
    { section: "TIDAK DIIZINKAN" }, ...(o.senterOff ? [{ label: "Senter Super", app: APP.senter, hl: true }] : []), { label: "Kamera", app: APP.kamera }, { label: "Peta", app: APP.peta }];
  function kontakPage(c, o = {}) { HP.header(c, "Izin kontak", { back: true }); return HP.list(c, KONTAK(o), { y: 112 }); }
  function permApp(c, appName, app, perm, opts, pick, hl) {
    HP.header(c, "Izin " + perm, { back: true }); HP.appIcon(c, 180, 168, 64, app.color, app.icon); text(c, appName, 180, 236, 22, { align: "center", weight: 800 });
    text(c, "Akses " + perm + " untuk aplikasi ini", 180, 264, 16, { align: "center", weight: 600, color: "#5B6B76" });
    return HP.list(c, opts.map((s, i) => ({ label: s, radio: pick === i, hl: hl === i })), { y: 290 });
  }
  const LOKASI = (o = {}) => [{ section: "DIIZINKAN SETIAP SAAT" }, ...(o.balapOff ? [] : [{ label: "Balap Liar", app: APP.balap, hl: o.hl }]),
    { section: "DIIZINKAN SAAT DIGUNAKAN" }, { label: "Peta", app: APP.peta, hl: o.petaHl }, { label: "Kamera", app: APP.kamera },
    { section: "TIDAK DIIZINKAN" }, ...(o.balapOff ? [{ label: "Balap Liar", app: APP.balap, hl: true }] : []), { label: "Kalkulator", app: APP.kalku }];
  function lokasiPage(c, o = {}) { HP.header(c, "Izin lokasi", { back: true }); return HP.list(c, LOKASI(o), { y: 112 }); }
  const LOCK_OPTS = ["Tidak ada", "Geser", "Pola", "PIN", "Sandi"];
  function lockPage(c, pick, hl) {
    HP.header(c, "Kunci layar", { back: true });
    return HP.list(c, LOCK_OPTS.map((s, i) => ({ label: s, radio: pick === i, hl: hl === i, sub: i === 1 ? "Tidak aman: siapa pun bisa membuka" : i === 3 ? "Enam angka atau lebih" : null, subColor: i === 1 ? RED : null })), { y: 120 });
  }
  function pinPage(c, title, n, press, pressU, done) {
    HP.header(c, "Kunci layar", { back: true }); HP.icon(c, "lock", 180, 170, 40, BLUE);
    text(c, title, 180, 236, 24, { align: "center", weight: 800 }); HP.pinDots(c, 180, 290, 6, n);
    text(c, "PIN minimal enam angka", 180, 340, 16, { align: "center", weight: 600, color: "#5B6B76" });
    HP.numpad(c, { press, pressU, done });
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      [["update", "memasang pembaruan sistem"], ["warning", "menutup sumber tidak dikenal"], ["contacts", "mencabut izin berlebihan"], ["lock", "memasang kunci layar"]].forEach(([ic, s], i) => {
        const u = ease((l - 0.6 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 820, 84, { fill: C.bg2, r: 16 }); HP.icon(ctx, ic, 308, 322 + i * 104, 36, GREEN); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      phone(ctx, c => root(c, {}), { cx: 1400, cy: 480, h: 560 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 280, 640, 340, { fill: C.bg2, r: 22 });
      text(ctx, "D9.3", 580, 370, 60, { align: "center", weight: 900, color: C.kiko }); para(ctx, "Melindungi Perangkat dari Malware", 580, 440, 34, 560, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "lima tamu jahat, lima pintu", 580, 580, 26, { align: "center", weight: 600, color: C.ink2 });
      // lima pintu yang ditutup di simulasi ini
      text(ctx, "Lima pintu yang kita tutup hari ini:", 1000, 320, 28, { weight: 900 });
      [["update", "Pembaruan sistem"], ["warning", "Sumber tidak dikenal"], ["trash", "Aplikasi tak terpakai"], ["contacts", "Izin aplikasi"], ["lock", "Kunci layar"]].forEach(([ic, s], i) => {
        const u = ease((l - 0.5 - i * 0.5) / 0.4); if (u <= 0) return; ctx.globalAlpha = u; const y = 350 + i * 62;
        ctx.fillStyle = "#E3EEFA"; ctx.beginPath(); ctx.arc(1030, y + 24, 22, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, 1030, y + 24, 24, BLUE); text(ctx, s, 1066, y + 33, 26, { weight: 800 }); ctx.globalAlpha = 1; });
      card(ctx, 560, 680, 800, 64, { fill: "#FFF3D6", r: 14 }); text(ctx, "Tampilan HP-mu bisa sedikit berbeda.", 960, 722, 26, { align: "center", weight: 800, color: C.accentDark });
    },
    pengaturan_buka(ctx, b, l) {
      const span = spanOf(b), rows = ROOT_ROWS();
      const R = HP.run({ scr: "home" }, [{ wait: 1, d: 0.4 }, { tap: [225, 354], set: { scr: "root" }, d: 1 }, { wait: 1, d: 0.6 }, { tap: tapRow(rows, IDX.keamanan), set: { scr: "sec" }, d: 1 }, { wait: 1, d: 0.8 }, { tap: [32, 70], set: { scr: "root" }, d: 1 }, { wait: 1, d: 0.6 }], l, span);
      const ph = phone(ctx, c => {
        if (R.st.scr === "home") HP.home(c, [{ name: "Kamera", color: "#2E7E9A", icon: "camera" }, { name: "Galeri", color: "#5FA8D3", icon: "photo" }, { name: "Obrolan", color: "#4C9BE0", icon: "chat" }, { name: "Peta", color: GREEN, icon: "map" },
          { name: "Senter Super", color: "#E0A23B", icon: "flashlight" }, { name: "Kuota Gratis", color: ORANGE, icon: "download" }, { name: "Pengaturan", color: "#5B6B76", icon: "gear" }, { name: "Toko Aplikasi", color: "#2E9E5B", icon: "store" }], { hl: R.i >= 1 ? "Pengaturan" : null });
        else if (R.st.scr === "root") root(c, {}); else secPage(c, {});
        tapDraw(c, R);
      });
      steps(ctx, "LANGKAH", ["Tap ikon roda gigi: Pengaturan.", "Tap satu menu untuk masuk.", "Tap panah kiri atas untuk kembali."], stepAt(l, span, [0.28, 0.6, 0.9]));
      if (R.st.scr === "sec") { const p = at(32, 70); note(ctx, 900, 200, "Panah kembali", { tx: p.x, ty: p.y }); }
    },
    pengaturan_cari(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ q: "", focus: false }, [{ tap: [180, 137], set: { focus: true }, d: 1 }, { type: "pembaruan", field: "q", d: 2 }, { wait: 1, d: 2 }], l, span);
      phone(ctx, c => { if (!R.st.focus) root(c, {}); else searchResults(c, R.st.q || ""); tapDraw(c, R); });
      steps(ctx, "LANGKAH", ["Tap kolom Cari.", "Ketik kata kunci."], stepAt(l, span, [0.2, 0.6]));
      if (after(b, l, 0.5)) { const p = at(330, 137); note(ctx, 900, 230, "Kata kunci: pembaruan, izin, kunci layar", { tx: p.x, ty: p.y, maxW: 380 }); }
    },
    update_buka(ctx, b, l) {
      const span = spanOf(b), rows = ROOT_ROWS();
      const R = HP.run({ scr: "root", u: "awal" }, [{ wait: 1, d: 0.5 }, { tap: tapRow(rows, IDX.update), set: { scr: "upd" }, d: 1.1 }, { wait: 1, d: 1 }, { tap: [180, 498], set: { u: "cek" }, d: 1 }, { anim: "t", d: 2 }], l, span);
      phone(ctx, c => { if (R.st.scr === "root") root(c, { hl: R.i >= 1 ? IDX.update : null }); else updatePage(c, { u: R.st.u, t: l }); tapDraw(c, R); });
      steps(ctx, "LANGKAH", ["Tap Pembaruan sistem.", "Tap Cek pembaruan.", "Tunggu HP memeriksa."], stepAt(l, span, [0.3, 0.65, 1]));
      if (R.st.scr === "upd") { const p = at(250, 282); note(ctx, 900, 230, "Versi sekarang: 5.1", { tx: p.x, ty: p.y }); }
    },
    update_ada(ctx, b, l) {
      phone(ctx, c => updatePage(c, { u: "ada", hl: after(b, l, 0.85) }));
      const p1 = at(330, 360), p2 = at(250, 420);
      if (after(b, l, 0.1)) note(ctx, 900, 200, "Pembaruan keamanan: menambal lubang yang dipakai malware", { tx: p1.x, ty: p1.y, maxW: 420 });
      if (after(b, l, 0.55)) note(ctx, 900, 420, "Wi-Fi tersambung, baterai cukup", { tx: p2.x, ty: p2.y, fill: C.goodBg, color: GREEN });
      steps(ctx, "SEBELUM MEMASANG", ["Sambungkan ke Wi-Fi.", "Baterai minimal 50%."], after(b, l, 0.7) ? 2 : after(b, l, 0.55) ? 1 : 0);
    },
    update_pasang(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ u: "ada", p: 0 }, [{ tap: [180, 518], set: { u: "unduh" }, d: 1 }, { anim: "p", d: 3.2 }, { tap: [180, 628], set: { hl2: true, u: "restart" }, d: 1 }, { wait: 1, d: 1 }], l, span);
      phone(ctx, c => { updatePage(c, { u: R.st.u, p: R.st.p, t: l, hl2: R.i === 2 }); tapDraw(c, R); }, { dark: R.st.u === "restart" });
      steps(ctx, "LANGKAH", ["Tap Download dan pasang.", "Tunggu sampai selesai.", "Tap Mulai ulang."], stepAt(l, span, [0.16, 0.68, 0.84]));
      if (R.st.u === "unduh" && R.st.p < 1) { const p = at(250, 548); note(ctx, 900, 420, "Jangan matikan HP saat memasang.", { tx: p.x, ty: p.y, fill: C.badBg, color: RED }); }
    },
    update_selesai(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ auto: 0 }, [{ wait: 1, d: 2 }, { tap: [306, 391], set: { autoHl: true }, d: 1 }, { anim: "auto", d: 0.6 }, { wait: 1, d: 1.4 }], l, span);
      phone(ctx, c => { updatePage(c, { u: "baru", auto: R.st.auto, autoHl: R.i >= 1 }); tapDraw(c, R); });
      steps(ctx, "LANGKAH", ["Buka lagi Pembaruan sistem.", "Lihat: sistem sudah terbaru.", "Nyalakan Pembaruan otomatis."], stepAt(l, span, [0.2, 0.4, 0.75]));
      const p = at(250, 282); note(ctx, 900, 230, "Versi 5.2: sudah terbaru", { tx: p.x, ty: p.y, fill: C.goodBg, color: GREEN });
    },
    sumber_buka(ctx, b, l) {
      const span = spanOf(b), rows = ROOT_ROWS(), sr = rowsOf(SEC_ITEMS(), { y: 120 });
      const R = HP.run({ scr: "root" }, [{ wait: 1, d: 0.5 }, { tap: tapRow(rows, IDX.keamanan), set: { scr: "sec" }, d: 1.1 }, { wait: 1, d: 1 }, { tap: tapRow(sr, 2), set: { scr: "src" }, d: 1.1 }, { wait: 1, d: 1.4 }], l, span);
      phone(ctx, c => { if (R.st.scr === "root") root(c, { hl: R.i >= 1 ? IDX.keamanan : null }); else if (R.st.scr === "sec") secPage(c, { hl: R.i >= 3 ? 2 : null }); else srcPage(c, {}); tapDraw(c, R); });
      steps(ctx, "LANGKAH", ["Tap Keamanan.", "Tap Pasang aplikasi tidak dikenal."], stepAt(l, span, [0.32, 0.72]));
      if (after(b, l, 0.5)) note(ctx, 900, 560, "Di HP lain: Sumber tidak dikenal, atau Instal aplikasi tak dikenal.", { fill: "#E7F1FB", color: BLUE, size: 22, maxW: 400 });
    },
    sumber_daftar(ctx, b, l) {
      const rows = rowsOf(SRC_ITEMS(), { y: 180 }), hl = after(b, l, 0.3) ? 2 : null;
      phone(ctx, c => srcPage(c, { hl }));
      const pb = at(340, rows[1].cy), po = at(340, rows[2].cy);
      if (after(b, l, 0.12)) note(ctx, 900, 200, "Boleh memasang aplikasi lain", { tx: pb.x, ty: pb.y });
      if (after(b, l, 0.3)) note(ctx, 900, 360, "Obrolan: diizinkan!", { tx: po.x, ty: po.y, fill: C.badBg, color: RED });
      if (after(b, l, 0.6)) { card(ctx, 900, 480, 520, 210, { fill: "#FFFFFF", stroke: ORANGE, lw: 3, r: 18 }); HP.appIcon(ctx, 960, 545, 64, ORANGE, "download");
        text(ctx, "Kuota Gratis 50GB", 1010, 540, 26, { weight: 900 }); text(ctx, "dari link di grup kelas", 1010, 572, 22, { weight: 700, color: C.ink2 });
        para(ctx, "terpasang lewat Obrolan (D9.3: trojan)", 930, 640, 22, 470, { weight: 800, color: RED }); }
    },
    sumber_matikan(ctx, b, l) {
      const span = spanOf(b), rows = rowsOf(SRC_ITEMS(), { y: 180 });
      const R = HP.run({ scr: "list", on: 1 }, [{ tap: tapRow(rows, 2), set: { scr: "obrolan" }, d: 1 }, { tap: [306, 322], d: 0.9 }, { anim: "off", d: 0.5 }, { set: { obrolan: true }, d: 0.1 }, { tap: [32, 70], set: { scr: "list" }, d: 0.9 },
        { tap: tapRow(rows, 1), set: { scr: "browser", off: 0 }, d: 1 }, { tap: [306, 322], d: 0.9 }, { anim: "off", d: 0.5 }, { set: { browserOff: true }, d: 0.1 }, { tap: [32, 70], set: { scr: "list2" }, d: 0.9 }, { wait: 1, d: 0.8 }], l, span);
      const st = R.st;
      phone(ctx, c => {
        if (st.scr === "obrolan") srcApp(c, "Obrolan", APP.obrolan, st.obrolan ? 0 : 1 - (st.off || 0), R.i >= 1);
        else if (st.scr === "browser") srcApp(c, "Browser", APP.browser, st.browserOff ? 0 : 1 - (st.off || 0), R.i >= 6);
        else srcPage(c, { obrolan: st.obrolan, browser: st.browserOff });
        tapDraw(c, R);
      });
      steps(ctx, "LANGKAH", ["Tap Obrolan.", "Matikan Izinkan dari sumber ini.", "Ulangi untuk Browser."], stepAt(l, span, [0.12, 0.35, 0.85]));
      if (st.scr === "list2") note(ctx, 900, 480, "Aplikasi hanya dari toko aplikasi resmi", { fill: C.goodBg, color: GREEN });
    },
    apps_daftar(ctx, b, l) {
      const span = spanOf(b), rows = ROOT_ROWS(), ar = rowsOf(APPS(), { y: 112 });
      const R = HP.run({ scr: "root" }, [{ wait: 1, d: 0.6 }, { tap: tapRow(rows, IDX.aplikasi), set: { scr: "apps" }, d: 1.1 }, { wait: 1, d: 3 }], l, span);
      phone(ctx, c => { if (R.st.scr === "root") root(c, { hl: R.i >= 1 ? IDX.aplikasi : null }); else appsPage(c, {}); tapDraw(c, R); });
      steps(ctx, "LANGKAH", ["Tap Aplikasi.", "Cari aplikasi yang lama tidak dibuka."], stepAt(l, span, [0.3, 1]));
      if (R.st.scr === "apps") {
        [[1, "dari luar toko, 2 bulan tidak dibuka", RED, 0.4], [2, "5 bulan tidak dibuka", ORANGE, 0.55], [3, "1 bulan tidak dibuka", ORANGE, 0.7]].forEach(([i, s, col, f], k) => {
          if (!after(b, l, f)) return; const p = at(345, ar[i].cy); note(ctx, 900, 180 + k * 130, s, { tx: p.x, ty: p.y, fill: col === RED ? C.badBg : "#FFF3D6", color: col, size: 22 }); });
      }
    },
    apps_uninstal(ctx, b, l) {
      const span = spanOf(b), ar = rowsOf(APPS(), { y: 112 }), ok = measure(m => appInfo(m, { dialog: 1 })).ok;
      const R = HP.run({ scr: "apps" }, [{ tap: tapRow(ar, 1), set: { scr: "info" }, d: 1 }, { wait: 1, d: 0.4 }, { tap: [150, 338], set: { dialog: 1 }, d: 1 }, { wait: 1, d: 0.5 }, { tap: [ok.cx, ok.cy], set: { ok: true }, d: 1 }, { set: { scr: "apps2", dialog: 0 }, d: 0.1 }, { anim: "toast", d: 2 }], l, span);
      const st = R.st;
      phone(ctx, c => {
        if (st.scr === "apps") appsPage(c, { hl: "kuota" });
        else if (st.scr === "info") appInfo(c, { hl: R.i >= 2 && !st.dialog ? 1 : null, dialog: st.dialog, ok: st.ok });
        else { appsPage(c, { kuota: false }); HP.toast(c, "Kuota Gratis 50GB sudah dihapus.", st.toast || 0); }
        tapDraw(c, R);
      });
      steps(ctx, "LANGKAH", ["Tap Kuota Gratis 50GB.", "Tap Uninstal.", "Tap OK."], stepAt(l, span, [0.15, 0.42, 0.62]));
      if (st.scr === "info") note(ctx, 900, 560, "Di HP lain: Copot pemasangan, atau Hapus.", { fill: "#E7F1FB", color: BLUE, size: 22 });
    },
    apps_lain(ctx, b, l) {
      const span = spanOf(b), ar = rowsOf(APPS({ kuota: false }), { y: 112 });
      phone(ctx, c => appsPage(c, { kuota: false, hl: after(b, l, 0.1) && !after(b, l, 0.5) ? "balap" : null }));
      const p = at(345, ar[1].cy); if (after(b, l, 0.1)) note(ctx, 900, 200, "Sudah 5 bulan tidak dibuka? Uninstal juga.", { tx: p.x, ty: p.y, maxW: 400 });
      if (after(b, l, 0.45)) { card(ctx, 900, 380, 520, 300, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
        text(ctx, "Makin sedikit aplikasi:", 930, 430, 26, { weight: 900 });
        badge(ctx, 920, 460, true, "makin sedikit pintu yang dijaga", { w: 480, h: 90, size: 23 }); if (after(b, l, 0.7)) badge(ctx, 920, 566, true, "memori HP lebih lega", { w: 480, h: 90, size: 23 }); }
    },
    izin_buka(ctx, b, l) {
      const span = spanOf(b), rows = ROOT_ROWS(), pr = measure(m => { const r = HP.list(m, [{ label: "Pengelola izin", icon: "contacts", arrow: true }], { y: 120 }); return r; });
      const R = HP.run({ scr: "root" }, [{ wait: 1, d: 0.5 }, { tap: tapRow(rows, IDX.privasi), set: { scr: "priv" }, d: 1 }, { wait: 1, d: 0.6 }, { tap: tapRow(pr, 0), set: { scr: "perm" }, d: 1 }, { wait: 1, d: 2.4 }], l, span);
      phone(ctx, c => {
        if (R.st.scr === "root") root(c, { hl: R.i >= 1 ? IDX.privasi : null });
        else if (R.st.scr === "priv") { HP.header(c, "Privasi", { back: true }); HP.list(c, [{ label: "Pengelola izin", icon: "contacts", arrow: true, hl: R.i >= 3 }, { label: "Riwayat izin", icon: "clock", arrow: true }, { label: "Iklan", icon: "info", arrow: true }], { y: 120 }); }
        else permRoot(c, null);
        tapDraw(c, R);
      });
      steps(ctx, "LANGKAH", ["Tap Privasi.", "Tap Pengelola izin.", "Lihat daftar izin."], stepAt(l, span, [0.3, 0.55, 1]));
      if (R.st.scr === "perm") note(ctx, 900, 560, "Lokasi, kamera, mikrofon, kontak: data pribadimu.", { fill: "#E7F1FB", color: BLUE, size: 22, maxW: 400 });
    },
    izin_kontak(ctx, b, l) {
      const span = spanOf(b), pr = rowsOf(PERMS, { y: 120 }), kr = rowsOf(KONTAK(), { y: 112 });
      const R = HP.run({ scr: "perm" }, [{ wait: 1, d: 0.3 }, { tap: tapRow(pr, 3), set: { scr: "kontak" }, d: 1 }, { wait: 1, d: 3 }], l, span);
      phone(ctx, c => { if (R.st.scr === "perm") permRoot(c, R.i >= 1 ? 3 : null); else kontakPage(c, { hl: after(b, l, 0.3), danger: after(b, l, 0.3) }); tapDraw(c, R); });
      steps(ctx, "LANGKAH", ["Tap Kontak.", "Baca daftar aplikasi yang diizinkan."], stepAt(l, span, [0.25, 1]));
      if (R.st.scr === "kontak" && after(b, l, 0.3)) { const p = at(345, kr[3].cy); note(ctx, 900, 220, "Senter Super membaca kontak?", { tx: p.x, ty: p.y, fill: C.badBg, color: RED });
        if (after(b, l, 0.55)) { card(ctx, 900, 380, 520, 230, { fill: "#FFFFFF", stroke: RED, lw: 3, r: 18 }); HP.icon(ctx, "flashlight", 960, 450, 56, "#E0A23B");
          text(ctx, "Senter butuh:", 1010, 440, 26, { weight: 900 }); text(ctx, "lampu kilat saja", 1010, 474, 24, { weight: 700, color: GREEN });
          text(ctx, "Kontak? TIDAK MASUK AKAL", 930, 570, 28, { weight: 900, color: RED }); } }
    },
    izin_cabut(ctx, b, l) {
      const span = spanOf(b), kr = rowsOf(KONTAK(), { y: 112 }), opts = ["Izinkan", "Jangan izinkan"], or = rowsOf(opts.map(s => ({ label: s, radio: false })), { y: 290 });
      const R = HP.run({ scr: "kontak", pick: 0 }, [{ tap: tapRow(kr, 3), set: { scr: "app" }, d: 1 }, { wait: 1, d: 0.4 }, { tap: tapRow(or, 1, 120), set: { pick: 1 }, d: 1 }, { wait: 1, d: 0.6 }, { tap: [32, 70], set: { scr: "kontak2" }, d: 0.9 }, { wait: 1, d: 2 }], l, span);
      phone(ctx, c => {
        if (R.st.scr === "kontak") kontakPage(c, { hl: true, danger: true });
        else if (R.st.scr === "app") permApp(c, "Senter Super", APP.senter, "kontak", opts, R.st.pick, R.i >= 2 ? 1 : null);
        else kontakPage(c, { senterOff: true });
        tapDraw(c, R);
      });
      steps(ctx, "LANGKAH", ["Tap Senter Super.", "Pilih Jangan izinkan.", "Senter pindah ke Tidak diizinkan."], stepAt(l, span, [0.2, 0.5, 0.75]));
      if (R.st.scr === "kontak2") badge(ctx, 900, 480, true, "Senternya tetap bisa menyala.", { w: 520, h: 90 });
    },
    izin_lokasi(ctx, b, l) {
      const span = spanOf(b), lr = rowsOf(LOKASI(), { y: 112 }), opts = ["Izinkan setiap saat", "Izinkan saat aplikasi digunakan", "Jangan izinkan"], or = rowsOf(opts.map(s => ({ label: s, radio: false })), { y: 290 });
      const R = HP.run({ scr: "lok", pick: 0 }, [{ wait: 1, d: 1.6 }, { tap: tapRow(lr, 1), set: { scr: "app" }, d: 1 }, { wait: 1, d: 0.3 }, { tap: tapRow(or, 2, 120), set: { pick: 2 }, d: 1 }, { wait: 1, d: 0.4 }, { tap: [32, 70], set: { scr: "lok2" }, d: 0.9 }, { wait: 1, d: 1 }], l, span);
      phone(ctx, c => {
        if (R.st.scr === "lok") lokasiPage(c, { hl: after(b, l, 0.3), petaHl: after(b, l, 0.12) && !after(b, l, 0.3) });
        else if (R.st.scr === "app") permApp(c, "Balap Liar", APP.balap, "lokasi", opts, R.st.pick, R.i >= 3 ? 2 : null);
        else lokasiPage(c, { balapOff: true });
        tapDraw(c, R);
      });
      if (R.st.scr === "lok") { const pp = at(345, lr[3].cy), pb = at(345, lr[1].cy);
        if (after(b, l, 0.12)) note(ctx, 900, 330, "Peta saat dibuka: wajar", { tx: pp.x, ty: pp.y, fill: C.goodBg, color: GREEN });
        if (after(b, l, 0.3)) note(ctx, 900, 180, "Game setiap saat: tidak perlu", { tx: pb.x, ty: pb.y, fill: C.badBg, color: RED }); }
      steps(ctx, "LANGKAH", ["Tap Lokasi, baca daftarnya.", "Tap Balap Liar.", "Pilih Jangan izinkan."], stepAt(l, span, [0.25, 0.42, 0.7]));
    },
    izin_dialog(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      const two = (cx, app, color, ic, perm, pick, ok, label) => {
        phone(ctx, c => { c.fillStyle = "#E9EEF0"; c.fillRect(0, 0, HP.W, HP.H); HP.header(c, app); HP.permission(c, { app, perm, color, hl: after(b, l, ok ? 0.45 : 0.7) ? pick : null }); }, { cx, cy: 460, h: 560 });
        if (after(b, l, ok ? 0.45 : 0.7)) { ctx.fillStyle = ok ? C.goodBg : C.badBg; rr(ctx, cx - 210, 760 - 14, 420, 54, 14); ctx.fill(); text(ctx, label, cx, 782, 24, { align: "center", weight: 900, color: ok ? GREEN : RED }); }
      };
      two(560, "Peta", GREEN, "map", "lokasi", 0, true, "Masuk akal: saat digunakan");
      two(1360, "Senter Super", "#E0A23B", "flashlight", "kontak", 2, false, "Tidak masuk akal: tolak");
      text(ctx, "BACA DULU", 960, 300, 34, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "pertanyaannya", 960, 344, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    kunci_buka(ctx, b, l) {
      const span = spanOf(b), rows = ROOT_ROWS(), sr = rowsOf(SEC_ITEMS(), { y: 120 });
      const R = HP.run({ scr: "root" }, [{ wait: 1, d: 0.5 }, { tap: tapRow(rows, IDX.keamanan), set: { scr: "sec" }, d: 1 }, { wait: 1, d: 0.5 }, { tap: tapRow(sr, 0), set: { scr: "lock" }, d: 1 }, { wait: 1, d: 2.4 }], l, span);
      phone(ctx, c => { if (R.st.scr === "root") root(c, { hl: R.i >= 1 ? IDX.keamanan : null }); else if (R.st.scr === "sec") secPage(c, { hl: R.i >= 3 ? 0 : null }); else lockPage(c, 1, null); tapDraw(c, R); });
      steps(ctx, "LANGKAH", ["Tap Keamanan.", "Tap Kunci layar.", "Lihat: masih Geser."], stepAt(l, span, [0.3, 0.55, 1]));
      if (R.st.scr === "lock") { const lr = rowsOf(LOCK_OPTS.map((s, i) => ({ label: s, radio: false, sub: i === 1 || i === 3 ? "x" : null })), { y: 120 }); const p = at(345, lr[1].cy); note(ctx, 900, 230, "Geser: siapa pun bisa membuka HP", { tx: p.x, ty: p.y, fill: C.badBg, color: RED }); }
    },
    kunci_pin(ctx, b, l) {
      const span = spanOf(b), lr = rowsOf(LOCK_OPTS.map((s, i) => ({ label: s, radio: false, sub: i === 1 || i === 3 ? "x" : null })), { y: 120 });
      const R = HP.run({ scr: "lock", n: "" }, [{ tap: tapRow(lr, 3), set: { scr: "pin" }, d: 1 }, { wait: 1, d: 0.5 }, { numpad: "582049", field: "n", d: 3.2 }, { wait: 1, d: 1.6 }], l, span);
      phone(ctx, c => { if (R.st.scr === "lock") lockPage(c, 1, 3); else pinPage(c, "Buat PIN", (R.st.n || "").length, R.st.press, R.st.pressU, (R.st.n || "").length >= 6); tapDraw(c, R); });
      steps(ctx, "LANGKAH", ["Pilih PIN.", "Ketik enam angka."], stepAt(l, span, [0.18, 0.75]));
      card(ctx, 900, 330, 520, 330, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PIN YANG BAIK", 1160, 372, 24, { align: "center", weight: 900, color: C.accentDark });
      if (after(b, l, 0.55)) badge(ctx, 920, 396, false, "tanggal lahir, misalnya 120311", { w: 480, h: 72, size: 22 });
      if (after(b, l, 0.72)) badge(ctx, 920, 480, false, "berurutan: 123456", { w: 480, h: 72, size: 22 });
      if (after(b, l, 0.3)) badge(ctx, 920, 564, true, "mudah kamu ingat, sulit ditebak", { w: 480, h: 72, size: 22 });
    },
    kunci_ulang(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ scr: "pin", n: "" }, [{ numpad: "582049", field: "n", d: 3 }, { tap: [HP.numpadKey("✓").x, HP.numpadKey("✓").y], set: { scr: "sec" }, d: 1 }, { wait: 1, d: 2.4 }], l, span);
      phone(ctx, c => { if (R.st.scr === "pin") pinPage(c, "Ketik ulang PIN", (R.st.n || "").length, R.st.press, R.st.pressU, (R.st.n || "").length >= 6); else secPage(c, { pin: true, src: true, hl: 0 }); tapDraw(c, R); });
      steps(ctx, "LANGKAH", ["Ketik ulang PIN yang sama.", "Tap Selesai.", "Kunci layar: PIN."], stepAt(l, span, [0.5, 0.66, 0.8]));
      if (R.st.scr === "sec") { const p = at(330, 152); note(ctx, 900, 220, "HP terkunci setiap layarnya mati", { tx: p.x, ty: p.y, fill: C.goodBg, color: GREEN }); if (after(b, l, 0.8)) note(ctx, 900, 420, "Sidik jari boleh jadi pelengkap.", { fill: "#E7F1FB", color: BLUE, size: 22 }); }
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 270, 64, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 292, 238, 18, 64, 6); ctx.fill(); rr(ctx, 330, 238, 18, 64, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 258, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan bersama orang tua, lalu putar lagi.", 430, 304, 28, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 360 + i * 88, 930, 74, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 409 + i * 88, 32, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 408 + i * 88, 27, { weight: 700, fit: 820 }); });
      phone(ctx, c => root(c, { updated: true }), { cx: 1460, cy: 500, h: 560 });
    },
    periksa(ctx, b, l) {
      phone(ctx, c => secPage(c, { pin: true, src: true }));
      const items = [["Sistem", "sudah terbaru"], ["Sumber tidak dikenal", "mati"], ["Aplikasi asing", "sudah hilang"], ["Izin aplikasi", "masuk akal"], ["Kunci layar", "PIN"]];
      card(ctx, 900, 122, 920, 120 + items.length * 108, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILMU", 1360, 172, 26, { align: "center", weight: 900, color: C.accentDark });
      const a = b.audio || b.dur;
      items.forEach(([k, v], i) => { const on = l > a * (0.18 + i * 0.15); const y = 196 + i * 100;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 925, y, 870, 86, 12); ctx.fill();
        text(ctx, k, 950, y + 54, 28, { weight: 800 }); text(ctx, v + (on ? " ✓" : ""), 1770, y + 54, 28, { align: "right", weight: 900, color: on ? GREEN : C.ink2 }); });
    },
    salah_cabut(ctx, b, l) {
      const span = spanOf(b), opts = ["Izinkan saat aplikasi digunakan", "Tanya setiap kali", "Jangan izinkan"], or = rowsOf(opts.map(s => ({ label: s, radio: false })), { y: 290 });
      const DLG = { icon: "camera", title: "Kamera tidak bisa memotret", body: "Aplikasi Kamera tidak punya izin kamera.", buttons: ["Batal", "Pengaturan"] };
      const pb = measure(m => HP.dialog(m, DLG)).buttons[1];
      const R = HP.run({ scr: "cam", pick: 2 }, [{ wait: 1, d: 1.6 }, { set: { scr: "camdlg" }, d: 0.1 }, { wait: 1, d: 1 }, { tap: [pb.cx, pb.cy], set: { scr: "perm" }, d: 1 }, { wait: 1, d: 0.3 }, { tap: tapRow(or, 0, 100), set: { pick: 0 }, d: 1 }, { wait: 1, d: 1.6 }], l, span);
      card(ctx, 900, 140, 880, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 1: IZIN YANG DIBUTUHKAN IKUT DICABUT", 1340, 200, 26, { align: "center", weight: 900, color: RED, fit: 840 });
      phone(ctx, c => {
        if (R.st.scr === "perm") permApp(c, "Kamera", APP.kamera, "kamera", opts, R.st.pick, R.i >= 5 ? 0 : null);
        else { c.fillStyle = "#11181D"; c.fillRect(0, 0, HP.W, HP.H); HP.icon(c, "camera", 180, 330, 80, "#5B6B76");
          if (R.st.scr === "camdlg") HP.dialog(c, { ...DLG, hl: R.i >= 3 ? 1 : null }); }
        tapDraw(c, R);
      }, { dark: R.st.scr !== "perm" });
      badge(ctx, 930, 250, false, "Semua izin Kamera dicabut, jadi Kamera tidak bisa memotret.", { w: 820, h: 100, size: 26 });
      if (R.st.scr === "perm") badge(ctx, 930, 380, true, "Nyalakan lagi: Izinkan saat aplikasi digunakan.", { w: 820, h: 100, size: 26 });
      if (after(b, l, 0.8)) badge(ctx, 930, 510, true, "Cabut hanya izin yang tidak sesuai fungsinya.", { w: 820, h: 100, size: 26 });
    },
    salah_tunda(ctx, b, l) {
      const span = spanOf(b), d0 = measure(m => HP.dialog(m, { icon: "update", title: "Pembaruan siap dipasang", body: "HP akan dimulai ulang. Kapan dipasang?", buttons: ["Pasang sekarang", "Pasang malam ini", "Nanti"], stack: true }));
      const bt = i => [d0.buttons[i].cx, d0.buttons[i].cy];
      const R = HP.run({ n: 0 }, [{ tap: bt(2), set: { n: 1 }, d: 0.8 }, { tap: bt(2), set: { n: 2 }, d: 0.6 }, { tap: bt(2), set: { n: 3 }, d: 0.6 }, { wait: 1, d: 1.2 }, { tap: bt(1), set: { pick: 1 }, d: 1 }, { wait: 1, d: 1.8 }], l, span);
      card(ctx, 900, 140, 880, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 2: MENUNDA PEMBARUAN", 1340, 200, 28, { align: "center", weight: 900, color: RED });
      phone(ctx, c => { HP.home(c, [{ name: "Kamera", color: "#2E7E9A", icon: "camera" }, { name: "Obrolan", color: "#4C9BE0", icon: "chat" }, { name: "Peta", color: GREEN, icon: "map" }, { name: "Pengaturan", color: "#5B6B76", icon: "gear" }]);
        if (!R.st.pick) HP.dialog(c, { icon: "update", title: "Pembaruan siap dipasang", body: "HP akan dimulai ulang. Kapan dipasang?", buttons: ["Pasang sekarang", "Pasang malam ini", "Nanti"], stack: true, hl: R.i === 4 ? 1 : null });
        else HP.toast(c, "Dipasang malam ini, saat diisi daya.", clamp((l - span * 0.75) / (span * 0.3), 0, 0.9), { y: 520 });
        tapDraw(c, R); });
      badge(ctx, 930, 260, false, "Menekan Nanti terus-menerus: " + (R.st.n || 0) + " kali", { w: 820, h: 100, size: 28 });
      if (R.i >= 4) badge(ctx, 930, 390, true, "Pilih Pasang malam ini: terpasang sendiri saat HP diisi daya.", { w: 820, h: 120, size: 28 });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D9.3", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Latihan 3: Periksa izin", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d93", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "masuk akal atau tidak?", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Rapikan HP keluargamu bersama orang tua, lalu catat tiga hal yang kamu ubah.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
