/* S12: layar aplikasi password manager rekaan "Brankas Sandi" di HP (satuan lokal layar_hp.js: 360 × 740).
   Pembantu khusus simulasi ini: keyboard huruf, bilah saran isi otomatis, browser HP sederhana, dan semua layar Brankas Sandi.
   Semua tampilan generik, tanpa logo atau tata letak aplikasi bermerek. Situs memakai domain .example. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, HP = K.hp;
  const { rr, wrap, clamp, lerp, ease } = H;
  const text = (ctx, s, x, y, size, opt = {}) => {
    if (opt.fit) { const f = `${opt.weight || 600} `; ctx.font = f + size + "px Inter"; while (size > 11 && ctx.measureText(s).width > opt.fit) { size -= 1; ctx.font = f + size + "px Inter"; } }
    H.text(ctx, s, x, y, size, { ...opt, fit: undefined });
  };
  const W = HP.W, HH = HP.H, UI = HP.UI;
  const V = "#3E5BA9", VBG = "#E6EBF7", RED = "#D9443B", GREEN = "#2E9E5B", ORANGE = "#D9822B", INK2 = "#5B6B76";
  const B = { V, VBG, RED, GREEN, ORANGE, text };

  // ---------- akun rekaan ----------
  B.ACC = {
    perpus: { label: "Perpustakaan Sekolah", sub: "perpus.sekolah.example", app: { color: GREEN, letter: "P" } },
    email: { label: "Email", sub: "surel.example", app: { color: "#C94F4F", letter: "E" } },
    game: { label: "Game Seru", sub: "game.example", app: { color: "#8E6BBF", letter: "G" } },
    toko: { label: "Toko Daring", sub: "toko.example", app: { color: ORANGE, letter: "T" } },
    teman: { label: "Temanku", sub: "temanku.example", app: { color: "#4C9BE0", letter: "M" } },
    sekolah: { label: "Akun Sekolah", sub: "akun.sekolah.example", app: { color: "#2E7E9A", letter: "S" } }
  };
  B.PASS = ["q7#Lm2v!Rt9wZ@e4Kp8s", "W4!xc9Qe#2Lr7Tz$m5Hk", "f8$Yt2Kq!9mWc3#Rz6Ve"];
  B.PHRASE = "Bakso Hangat Naik Angkot Biru";

  // ---------- keyboard huruf ----------
  const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"], KW = 32, KG = 3.6, KH = 46;
  B.KB_Y = 452;
  B.keyPos = function (ch, y0 = B.KB_Y) {
    const c = (ch || "").toLowerCase();
    if (c === " ") return { x: W / 2, y: y0 + 10 + 3 * 54 + KH / 2 };
    for (let r = 0; r < 3; r++) { const i = ROWS[r].indexOf(c); if (i >= 0) { const n = ROWS[r].length, x0 = (W - (n * KW + (n - 1) * KG)) / 2; return { x: x0 + i * (KW + KG) + KW / 2, y: y0 + 10 + r * 54 + KH / 2 }; } }
    if (c === "." || c === "-") return { x: 262, y: y0 + 10 + 3 * 54 + KH / 2 };
    return { x: W / 2, y: y0 + 10 + 1 * 54 + KH / 2 };
  };
  // opt: y, press (huruf yang sedang ditekan), suggest: {text, sub, icon, warn} bilah saran di atas keyboard, sugHl
  B.kb = function (ctx, opt = {}) {
    const y0 = opt.y || B.KB_Y; const out = {};
    if (opt.suggest) {
      const s = opt.suggest, sy = y0 - 52;
      ctx.fillStyle = opt.sugHl ? "#FFF3D6" : "#F4F6F8"; ctx.fillRect(0, sy, W, 52); ctx.fillStyle = UI.line; ctx.fillRect(0, sy, W, 1.5);
      if (opt.sugHl) { ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; rr(ctx, 6, sy + 4, W - 12, 44, 10); ctx.stroke(); }
      ctx.fillStyle = s.warn ? "#FBE1DF" : VBG; ctx.beginPath(); ctx.arc(30, sy + 26, 17, 0, Math.PI * 2); ctx.fill();
      HP.icon(ctx, s.icon || "key", 30, sy + 26, 18, s.warn ? RED : V);
      text(ctx, s.text, 56, sy + (s.sub ? 23 : 32), s.sub ? 17 : 16, { weight: 800, color: s.warn ? RED : UI.ink, fit: W - 70 });
      if (s.sub) text(ctx, s.sub, 56, sy + 43, 14, { weight: 600, color: INK2, fit: W - 70 });
      out.suggest = { x: W / 2, y: sy + 26 };
    }
    ctx.fillStyle = "#DDE3E8"; ctx.fillRect(0, y0, W, HH - y0);
    const press = (opt.press || "").toLowerCase();
    const key = (x, y, w, label, on, special) => {
      ctx.fillStyle = on ? "#FFE7A8" : special ? "#C7D0D7" : "#FFFFFF"; rr(ctx, x, y, w, KH, 7); ctx.fill();
      if (label) text(ctx, label, x + w / 2, y + KH / 2 + 7, label.length > 1 ? 14 : 20, { align: "center", weight: 600, color: UI.ink });
    };
    ROWS.forEach((row, r) => {
      const n = row.length, x0 = (W - (n * KW + (n - 1) * KG)) / 2, y = y0 + 10 + r * 54;
      for (let i = 0; i < n; i++) key(x0 + i * (KW + KG), y, KW, row[i], press === row[i]);
      if (r === 2) { key(6, y, 44, "⇧", false, true); key(W - 50, y, 44, "⌫", false, true); }
    });
    const y3 = y0 + 10 + 3 * 54;
    key(6, y3, 62, "123", false, true); key(74, y3, 170, "", press === " "); key(250, y3, 28, ".", press === "." || press === "-"); key(284, y3, 70, "OK", false, true);
    return out;
  };

  // ---------- kolom isian ----------
  // opt: label, value, placeholder, focus, caret, password (titik), ok, hl, size, filledBy (label kecil "Diisi Brankas Sandi")
  B.field = function (ctx, x, y, w, opt = {}) {
    if (opt.label) text(ctx, opt.label, x + 2, y, 15, { weight: 700, color: INK2 });
    const by = y + 8, h = 46;
    ctx.fillStyle = opt.filledBy ? "#EEF7F0" : "#FFFFFF"; rr(ctx, x, by, w, h, 12); ctx.fill();
    ctx.strokeStyle = opt.hl ? C.accent : opt.focus ? UI.primary : opt.ok ? GREEN : "#C9D4DB"; ctx.lineWidth = opt.focus || opt.hl || opt.ok ? 2.5 : 1.6; rr(ctx, x, by, w, h, 12); ctx.stroke();
    const v = opt.value || "", size = opt.size || 18; let tw = 0;
    if (opt.password && v) { const n = v.length, gap = Math.min(10, (w - 50) / Math.max(1, n)); ctx.fillStyle = UI.ink; for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(x + 16 + i * gap, by + h / 2, 3.6, 0, Math.PI * 2); ctx.fill(); } tw = n * gap; }
    else if (v) { text(ctx, v, x + 14, by + h / 2 + size * 0.36, size, { weight: 700, color: UI.ink, fit: w - 40 }); ctx.font = `700 ${size}px Inter`; tw = Math.min(w - 40, ctx.measureText(v).width); }
    else if (opt.placeholder) text(ctx, opt.placeholder, x + 14, by + h / 2 + 6, 16, { weight: 500, color: "#9AA8B1", fit: w - 30 });
    if (opt.caret) { ctx.fillStyle = UI.primary; ctx.fillRect(x + 15 + tw, by + 11, 2, h - 22); }
    if (opt.eye) HP.icon(ctx, opt.show ? "eye" : "eyeOff", x + w - 22, by + h / 2, 20, INK2);
    if (opt.filledBy) { ctx.fillStyle = VBG; rr(ctx, x + w - 122, by - 18, 116, 22, 11); ctx.fill(); text(ctx, "Diisi Brankas Sandi", x + w - 64, by - 3, 11.5, { align: "center", weight: 800, color: V }); }
    return { x, y: by, w, h, cx: x + w / 2, cy: by + h / 2 };
  };
  // pengukur kekuatan 0..4
  B.meter = function (ctx, x, y, w, level) {
    const cols = ["#D9443B", "#E07B2E", "#E0A23B", "#7DB55A", GREEN], names = ["Sangat lemah", "Lemah", "Sedang", "Kuat", "Sangat kuat"];
    const lv = clamp(Math.round(level), 0, 4), seg = (w - 12) / 5;
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i <= lv && level >= 0 ? cols[lv] : "#DDE5EA"; rr(ctx, x + i * (seg + 3), y, seg, 8, 4); ctx.fill(); }
    if (level >= 0) text(ctx, names[lv], x, y + 30, 16, { weight: 800, color: cols[lv] });
  };
  B.levelOf = s => { const n = (s || "").length; return n === 0 ? -1 : n < 8 ? 0 : n < 13 ? 1 : n < 18 ? 2 : n < 24 ? 3 : 4; };
  // sandi acak berwarna: huruf hitam, angka biru, simbol merah
  B.passText = function (ctx, s, cx, y, size, opt = {}) {
    ctx.font = `800 ${size}px Inter`; let total = 0; const ws = [...s].map(ch => { const w = ctx.measureText(ch).width + 1.2; total += w; return w; });
    let x = cx - total / 2;
    [...s].forEach((ch, i) => { const col = /[0-9]/.test(ch) ? "#1A56B8" : /[A-Za-z]/.test(ch) ? UI.ink : RED; text(ctx, ch, x + ws[i] / 2, y, size, { align: "center", weight: 800, color: opt.mono ? UI.ink : col }); x += ws[i]; });
    return total;
  };

  // ---------- browser HP ----------
  // opt: bad (alamat tersorot merah), mark: [awal, akhir] bagian alamat yang disorot
  B.browser = function (ctx, url, opt = {}) {
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 36, W, HH - 36);
    ctx.fillStyle = "#EEF2F5"; ctx.fillRect(0, 36, W, 62);
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 12, 46, W - 24, 42, 21); ctx.fill(); ctx.strokeStyle = opt.bad ? RED : "#C9D4DB"; ctx.lineWidth = opt.bad ? 2.5 : 1.5; rr(ctx, 12, 46, W - 24, 42, 21); ctx.stroke();
    HP.icon(ctx, "lock", 34, 67, 15, INK2);
    ctx.font = "700 16px Inter";
    if (opt.mark) { const a = ctx.measureText(url.slice(0, opt.mark[0])).width, b = ctx.measureText(url.slice(0, opt.mark[1])).width; ctx.fillStyle = "rgba(242,177,52,0.55)"; rr(ctx, 50 + a - 2, 55, b - a + 4, 24, 5); ctx.fill(); }
    text(ctx, url, 50, 73, 16, { weight: 700, color: UI.ink, fit: W - 80 });
    return { top: 98, url: { x: W / 2, y: 67 } };
  };
  // halaman login perpustakaan. o: url, user, pass, focus ("user"|"pass"), kb, suggest, sugHl, filled, hlBtn, welcome
  B.login = function (ctx, o = {}) {
    const url = o.url || "perpus.sekolah.example/login"; B.browser(ctx, url, { bad: o.bad, mark: o.mark });
    ctx.fillStyle = "#2E7D5B"; ctx.fillRect(0, 98, W, 74); HP.icon(ctx, "school", 40, 135, 30, "#FFFFFF");
    text(ctx, "Perpustakaan Digital", 66, 131, 20, { weight: 900, color: "#FFFFFF" }); text(ctx, "SMA Harapan (rekaan)", 66, 154, 14, { weight: 600, color: "#D5EFE2" });
    const out = {};
    if (o.welcome) { HP.icon(ctx, "check", W / 2, 260, 60, GREEN); text(ctx, "Selamat datang, Dito!", W / 2, 340, 22, { align: "center", weight: 900 }); text(ctx, "Kamu sudah login.", W / 2, 368, 16, { align: "center", weight: 600, color: INK2 }); return out; }
    text(ctx, o.title || "Login", 24, 210, 24, { weight: 900 });
    out.user = B.field(ctx, 24, 226, W - 48, { label: "Nama pengguna", value: o.user, focus: o.focus === "user", caret: o.focus === "user" && !o.user, filledBy: o.filled && o.user });
    out.pass = B.field(ctx, 24, 300, W - 48, { label: "Kata sandi", value: o.pass, password: true, eye: true, focus: o.focus === "pass", filledBy: o.filled && o.pass });
    out.btn = HP.button(ctx, 24, 380, W - 48, 48, o.btnLabel || "Masuk", { fill: "#2E7D5B", hl: o.hlBtn, size: 19, r: 12 });
    if (o.kb) Object.assign(out, B.kb(ctx, { suggest: o.suggest, sugHl: o.sugHl }));
    return out;
  };

  // ---------- layar Brankas Sandi ----------
  B.tabs = function (ctx, active, hl) {
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 648, W, HH - 648); ctx.fillStyle = UI.line; ctx.fillRect(0, 648, W, 1.5);
    const tabs = [["Brankas", "key"], ["Periksa", "shield"], ["Pengaturan", "gear"]], out = {};
    tabs.forEach(([s, ic], i) => { const x = 60 + i * 120, on = active === s;
      if (hl === s) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x - 52, 654, 104, 58, 14); ctx.fill(); }
      if (on) { ctx.fillStyle = VBG; rr(ctx, x - 30, 656, 60, 30, 15); ctx.fill(); }
      HP.icon(ctx, ic, x, 671, 20, on ? V : INK2); text(ctx, s, x, 704, 13.5, { align: "center", weight: on ? 800 : 600, color: on ? V : INK2 }); out[s] = { x, y: 676 }; });
    return out;
  };
  B.TAB = { Brankas: [60, 676], Periksa: [180, 676], Pengaturan: [300, 676] };
  B.welcome = function (ctx, o = {}) {
    ctx.fillStyle = VBG; ctx.fillRect(0, 36, W, HH - 36);
    ctx.fillStyle = V; rr(ctx, 120, 150, 120, 120, 32); ctx.fill(); HP.icon(ctx, "lock", 180, 212, 64, "#FFFFFF");
    text(ctx, "Brankas Sandi", W / 2, 320, 30, { align: "center", weight: 900, color: UI.ink });
    HP.para(ctx, "Satu sandi induk untuk membuka semua sandimu.", W / 2, 360, 18, 280, { align: "center" });
    const b1 = HP.button(ctx, 40, 540, 280, 54, "Buat brankas baru", { fill: V, hl: o.hl, size: 19 });
    HP.button(ctx, 40, 606, 280, 50, "Saya sudah punya brankas", { outline: true, ink: V, size: 16 });
    return { btn: b1 };
  };
  // o: value, kb, press, hl (tombol Lanjut)
  B.master = function (ctx, o = {}) {
    HP.header(ctx, "Buat sandi induk", { back: true });
    HP.para(ctx, "Sandi induk membuka semua sandimu. Pakai frasa panjang dari beberapa kata acak.", 20, 130, 16, 320);
    const v = o.value || "";
    const f = B.field(ctx, 20, 196, W - 40, { label: "Sandi induk", value: v, focus: !!o.kb, caret: !!o.kb, eye: true, show: true, size: 17 });
    B.meter(ctx, 22, 268, W - 44, B.levelOf(v));
    const words = v.trim() ? v.trim().split(/\s+/).length : 0;
    const tips = [["Empat kata atau lebih", words >= 4], ["Bukan nama atau tanggal lahir", v.length > 0]];
    tips.forEach(([s, ok], i) => { const y = 330 + i * 28; HP.icon(ctx, ok ? "check" : "info", 32, y - 6, 16, ok ? GREEN : "#9AA8B1"); text(ctx, s, 50, y, 15, { weight: 700, color: ok ? UI.ink : "#8A99A3" }); });
    let btn = null; if (!o.kb) btn = HP.button(ctx, 20, 400, W - 40, 50, "Lanjut", { fill: V, hl: o.hl, size: 18, r: 14 });
    if (o.kb) B.kb(ctx, { press: o.press });
    return { field: f, btn };
  };
  // o: n (titik terketik), total, kb, press, hl, done (spinner/ok)
  B.confirm = function (ctx, o = {}) {
    HP.header(ctx, "Ketik ulang sandi induk", { back: true });
    const tot = o.total || B.PHRASE.length, n = Math.round(o.n || 0);
    const f = B.field(ctx, 20, 140, W - 40, { label: "Ketik ulang", value: "•".repeat(n), password: true, focus: !!o.kb, caret: !!o.kb, ok: n >= tot });
    if (n >= tot) { HP.icon(ctx, "check", 32, 218, 16, GREEN); text(ctx, "Cocok", 50, 224, 15, { weight: 800, color: GREEN }); }
    ctx.fillStyle = "#FFF6E0"; rr(ctx, 16, 244, W - 32, 112, 16); ctx.fill(); HP.icon(ctx, "warning", 42, 274, 22, "#B57A12");
    HP.para(ctx, "Brankas Sandi tidak menyimpan sandi induk. Kalau kamu lupa, brankas tidak bisa dibuka lagi.", 64, 280, 15, 266, { color: "#7A5208", weight: 700 });
    let btn = null; if (!o.kb) btn = HP.button(ctx, 20, 380, W - 40, 50, "Buat brankas", { fill: V, hl: o.hl, size: 18, r: 14 });
    if (o.kb) B.kb(ctx, { press: o.press });
    return { field: f, btn };
  };
  B.bioOffer = function (ctx, o = {}) {
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 36, W, HH - 36);
    ctx.fillStyle = VBG; ctx.beginPath(); ctx.arc(180, 200, 64, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "fingerprint", 180, 200, 70, V);
    text(ctx, "Buka dengan sidik jari?", W / 2, 310, 23, { align: "center", weight: 900 });
    HP.para(ctx, "Kamu tidak perlu mengetik sandi induk setiap kali membuka brankas.", W / 2, 346, 16, 290, { align: "center" });
    const b = HP.button(ctx, 40, 430, 280, 52, "Nyalakan", { fill: V, hl: o.hl, size: 18 }); HP.button(ctx, 40, 494, 280, 48, "Nanti", { outline: true, ink: V, size: 17 });
    return { btn: b };
  };
  B.locked = function (ctx, o = {}) {
    ctx.fillStyle = V; ctx.fillRect(0, 0, W, HH);
    HP.icon(ctx, "lock", 180, 170, 56, "#FFFFFF"); text(ctx, "Brankas terkunci", W / 2, 250, 24, { align: "center", weight: 900, color: "#FFFFFF" });
    const u = o.u || 0;
    ctx.fillStyle = u >= 1 ? "rgba(46,158,91,0.9)" : "rgba(255,255,255,0.16)"; ctx.beginPath(); ctx.arc(180, 420, 52, 0, Math.PI * 2); ctx.fill();
    if (u > 0 && u < 1) { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(180, 420, 52, -Math.PI / 2, -Math.PI / 2 + u * Math.PI * 2); ctx.stroke(); }
    HP.icon(ctx, u >= 1 ? "check" : "fingerprint", 180, 420, 52, "#FFFFFF");
    text(ctx, u >= 1 ? "Terbuka" : "Sentuh sensor sidik jari", W / 2, 506, 17, { align: "center", weight: 700, color: "#FFFFFF" });
    text(ctx, "Pakai sandi induk", W / 2, 600, 17, { align: "center", weight: 800, color: "#CFE0FF" });
  };
  // daftar brankas. o: items [kunci ACC], hl (kunci), fabHl, tabHl, toast
  B.vault = function (ctx, o = {}) {
    HP.header(ctx, "Brankas Sandi", { action: "more" }); HP.search(ctx, 112, "", { placeholder: "Cari akun" });
    const keys = o.items || []; let rows = [];
    if (!keys.length) {
      HP.icon(ctx, "lock", 180, 300, 70, "#9FB6CC"); text(ctx, "Brankasmu masih kosong", W / 2, 390, 20, { align: "center", weight: 800 });
      HP.para(ctx, "Tap tanda tambah untuk menyimpan akun pertamamu.", W / 2, 420, 16, 260, { align: "center" });
    } else rows = HP.list(ctx, keys.map(k => ({ ...B.ACC[k], hl: o.hl === k })), { y: 178 });
    if (o.fab !== false) { if (o.fabHl) { ctx.fillStyle = "rgba(242,177,52,0.5)"; ctx.beginPath(); ctx.arc(306, 590, 38, 0, Math.PI * 2); ctx.fill(); }
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.3)"; ctx.shadowBlur = 10; ctx.fillStyle = V; ctx.beginPath(); ctx.arc(306, 590, 30, 0, Math.PI * 2); ctx.fill(); ctx.restore(); HP.icon(ctx, "plus", 306, 590, 26, "#FFFFFF"); }
    B.tabs(ctx, "Brankas", o.tabHl);
    return { rows, fab: { x: 306, y: 590 } };
  };
  B.FAB = [306, 590];
  // formulir tambah akun. o: name, site, user, pass (string), focus, kb, press, genHl, saveHl, show
  B.addForm = function (ctx, o = {}) {
    HP.header(ctx, "Tambah akun", { back: true });
    if (o.saveHl) { ctx.fillStyle = "#FFF3D6"; rr(ctx, 270, 50, 80, 40, 12); ctx.fill(); }
    text(ctx, "Simpan", 310, 78, 18, { align: "center", weight: 800, color: o.pass ? V : "#9AA8B1" });
    const f = {};
    f.name = B.field(ctx, 20, 132, W - 40, { label: "Nama akun", value: o.name, focus: o.focus === "name", caret: o.focus === "name" });
    f.site = B.field(ctx, 20, 206, W - 40, { label: "Alamat situs", value: o.site, focus: o.focus === "site", caret: o.focus === "site", size: 17 });
    f.user = B.field(ctx, 20, 280, W - 40, { label: "Nama pengguna", value: o.user, focus: o.focus === "user", caret: o.focus === "user" });
    f.pass = B.field(ctx, 20, 354, W - 40, { label: "Sandi", value: o.pass, password: !o.show, eye: !!o.pass, show: o.show, size: 16 });
    if (!o.kb) f.gen = HP.button(ctx, 20, 430, W - 40, 48, "Buat sandi acak", { outline: true, ink: V, hl: o.genHl, size: 17, r: 14 });
    if (o.kb) B.kb(ctx, { press: o.press });
    return f;
  };
  B.SAVE = [310, 70];
  // lembar generator. o: u (masuk 0..1), len, pass, useHl, againHl, slideHl
  B.gen = function (ctx, o = {}) {
    const u = o.u == null ? 1 : ease(clamp(o.u, 0, 1)); if (u <= 0) return {};
    ctx.fillStyle = `rgba(15,22,28,${0.45 * u})`; ctx.fillRect(0, 0, W, HH);
    const y0 = lerp(HH, 236, u); ctx.fillStyle = "#FFFFFF"; rr(ctx, 0, y0, W, HH - y0 + 30, 26); ctx.fill();
    ctx.save(); ctx.translate(0, y0 - 236);
    ctx.fillStyle = "#C9D4DB"; rr(ctx, 155, 246, 50, 5, 3); ctx.fill();
    text(ctx, "Buat sandi acak", 22, 284, 21, { weight: 900 });
    const len = Math.round(o.len || 20), pass = (o.pass || B.PASS[0]).slice(0, len);
    ctx.fillStyle = "#F4F6F8"; rr(ctx, 16, 298, W - 32, 62, 14); ctx.fill();
    B.passText(ctx, pass, W / 2, 337, len > 16 ? 19 : 22);
    B.meter(ctx, 22, 374, W - 44, B.levelOf(pass));
    text(ctx, "Panjang", 22, 436, 17, { weight: 800 }); text(ctx, String(len) + " karakter", W - 22, 436, 17, { align: "right", weight: 800, color: V });
    const t = clamp((len - 8) / 24, 0, 1), sx = 26 + t * (W - 52);
    ctx.fillStyle = "#DDE5EA"; rr(ctx, 26, 452, W - 52, 6, 3); ctx.fill(); ctx.fillStyle = V; rr(ctx, 26, 452, sx - 26, 6, 3); ctx.fill();
    if (o.slideHl) { ctx.fillStyle = "rgba(242,177,52,0.5)"; ctx.beginPath(); ctx.arc(sx, 455, 20, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = V; ctx.beginPath(); ctx.arc(sx, 455, 11, 0, Math.PI * 2); ctx.fill();
    const rows = HP.list(ctx, [{ label: "Huruf besar dan kecil", toggle: true }, { label: "Angka (0–9)", toggle: true }, { label: "Simbol (!@#$)", toggle: true }], { y: 474, gap: 0 });
    const again = HP.button(ctx, 16, 676, 140, 44, "Buat lagi", { outline: true, ink: V, hl: o.againHl, size: 16, r: 12 });
    const use = HP.button(ctx, 166, 676, 178, 44, "Pakai sandi ini", { fill: V, hl: o.useHl, size: 16, r: 12 });
    ctx.restore();
    return { sx, again, use, rows };
  };
  B.slideX = len => 26 + clamp((len - 8) / 24, 0, 1) * (W - 52);
  // laporan Periksa keamanan. o: score, reuse, weak, strong, hl ("reuse"|...), tabHl
  B.report = function (ctx, o = {}) {
    HP.header(ctx, "Periksa keamanan");
    const sc = Math.round(o.score == null ? 45 : o.score), col = sc >= 80 ? GREEN : sc >= 60 ? "#E0A23B" : RED;
    ctx.lineWidth = 12; ctx.strokeStyle = "#E3E9EE"; ctx.beginPath(); ctx.arc(180, 190, 58, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(180, 190, 58, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(sc / 100, 0.001, 1)); ctx.stroke(); ctx.lineCap = "butt";
    text(ctx, String(sc), 180, 204, 40, { align: "center", weight: 900, color: col }); text(ctx, "Skor keamanan dari 100", 180, 274, 15, { align: "center", weight: 700, color: INK2 });
    const reuse = o.reuse == null ? 4 : o.reuse, weak = o.weak == null ? 2 : o.weak;
    const rows = HP.list(ctx, [
      { label: "Dipakai ulang", sub: reuse ? reuse + " akun memakai sandi yang sama" : "Tidak ada", subColor: reuse ? RED : GREEN, icon: reuse ? "warning" : "check", danger: !!reuse, color: reuse ? RED : GREEN, value: String(reuse), valueColor: reuse ? RED : GREEN, arrow: true, hl: o.hl === "reuse" },
      { label: "Lemah", sub: weak ? weak + " sandi mudah ditebak" : "Tidak ada", subColor: weak ? ORANGE : GREEN, icon: weak ? "key" : "check", color: weak ? ORANGE : GREEN, value: String(weak), valueColor: weak ? ORANGE : GREEN, arrow: true, hl: o.hl === "weak" },
      { label: "Kuat", sub: "Sandi acak yang berbeda", icon: "check", color: GREEN, value: String(o.strong == null ? 1 : o.strong), valueColor: GREEN, arrow: true }
    ], { y: 294 });
    B.tabs(ctx, "Periksa", o.tabHl);
    return { rows };
  };
  // daftar akun dengan sandi kembar. o: items, hl (kunci), btnHl
  B.reused = function (ctx, o = {}) {
    HP.header(ctx, "Dipakai ulang", { back: true });
    const keys = o.items || ["email", "game", "toko", "teman"];
    HP.para(ctx, keys.length + " akun ini memakai sandi yang sama. Ganti satu per satu.", 20, 134, 16, 320);
    const rows = HP.list(ctx, keys.map(k => ({ ...B.ACC[k], hl: o.hl === k })), { y: 172 }), btns = {};
    keys.forEach((k, i) => { const r = rows[i]; const hl = o.btnHl === k;
      if (hl) { ctx.fillStyle = "rgba(242,177,52,0.5)"; rr(ctx, 262, r.cy - 22, 84, 44, 22); ctx.fill(); }
      ctx.fillStyle = VBG; rr(ctx, 266, r.cy - 18, 76, 36, 18); ctx.fill(); text(ctx, "Ganti", 304, r.cy + 6, 16, { align: "center", weight: 800, color: V }); btns[k] = { x: 304, y: r.cy }; });
    return { rows, btns };
  };
  // halaman ganti sandi di situs game. o: newPass (0..1 terisi), chipHl, saveHl, dialog, updHl
  B.change = function (ctx, o = {}) {
    B.browser(ctx, "game.example/akun/sandi");
    ctx.fillStyle = "#6E55A8"; ctx.fillRect(0, 98, W, 60); text(ctx, "Game Seru", 24, 136, 21, { weight: 900, color: "#FFFFFF" });
    text(ctx, "Ganti kata sandi", 24, 196, 22, { weight: 900 });
    B.field(ctx, 24, 214, W - 48, { label: "Sandi lama", value: "dito123", password: true, filledBy: true });
    const nf = B.field(ctx, 24, 288, W - 48, { label: "Sandi baru", value: o.newPass ? B.PASS[2] : "", password: true, focus: !o.newPass, filledBy: !!o.newPass });
    let chip = null;
    if (!o.newPass) { if (o.chipHl) { ctx.fillStyle = "rgba(242,177,52,0.5)"; rr(ctx, 20, 350, W - 40, 54, 16); ctx.fill(); }
      ctx.fillStyle = VBG; rr(ctx, 24, 354, W - 48, 46, 14); ctx.fill(); HP.icon(ctx, "key", 48, 377, 18, V);
      text(ctx, "Pakai sandi kuat dari Brankas Sandi", 68, 383, 15, { weight: 800, color: V, fit: W - 110 }); chip = { x: W / 2, y: 377 }; }
    const save = HP.button(ctx, 24, 420, W - 48, 48, "Simpan", { fill: "#6E55A8", hl: o.saveHl, size: 18, r: 12 });
    let dlg = null; if (o.dialog) dlg = HP.dialog(ctx, { icon: "key", iconColor: V, title: "Perbarui sandi Game Seru di brankas?", buttons: ["Nanti", "Perbarui"], hl: o.updHl ? 1 : null, u: o.dialog });
    return { chip, save, dlg, nf };
  };
  // pengaturan brankas. o: tfa (bool), hl (indeks baris), tabHl
  B.SET_ITEMS = (o = {}) => [{ section: "KEAMANAN BRANKAS" }, { label: "Buka dengan sidik jari", icon: "fingerprint", toggle: true },
    { label: "Kunci otomatis", icon: "clock", value: "1 menit", arrow: true },
    { label: "Verifikasi dua langkah", icon: "shield", value: o.tfa ? "Aktif" : "Mati", valueColor: o.tfa ? GREEN : RED, arrow: true, hl: o.hl === 3 },
    { label: "Ganti sandi induk", icon: "lock", arrow: true }, { section: "DATA" }, { label: "Impor sandi", icon: "download", arrow: true }];
  B.settings = function (ctx, o = {}) { HP.header(ctx, "Pengaturan"); const rows = HP.list(ctx, B.SET_ITEMS(o), { y: 112 }); B.tabs(ctx, "Pengaturan", o.tabHl); return rows; };
  B.tfaIntro = function (ctx, o = {}) {
    HP.header(ctx, "Verifikasi dua langkah", { back: true });
    ctx.fillStyle = VBG; ctx.beginPath(); ctx.arc(180, 190, 56, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "shield", 180, 190, 60, V);
    HP.para(ctx, "Saat brankas dibuka di HP baru, kamu memasukkan sandi induk, lalu kode dari aplikasi autentikator.", W / 2, 290, 17, 300, { align: "center" });
    return { btn: HP.button(ctx, 40, 420, 280, 52, "Mulai", { fill: V, hl: o.hl, size: 18 }) };
  };
  B.tfaQR = function (ctx, o = {}) {
    HP.header(ctx, "Verifikasi dua langkah", { back: true });
    HP.para(ctx, "Pindai kode QR ini dengan aplikasi autentikator di HP-mu.", W / 2, 136, 17, 300, { align: "center" });
    HP.qr(ctx, 80, 196, 200, 12);
    text(ctx, "Jangan dipotret atau dibagikan.", W / 2, 438, 15, { align: "center", weight: 800, color: RED });
    return { btn: HP.button(ctx, 40, 470, 280, 52, "Lanjut", { fill: V, hl: o.hl, size: 18 }) };
  };
  B.tfaCode = function (ctx, o = {}) {
    HP.header(ctx, "Verifikasi dua langkah", { back: true });
    HP.para(ctx, "Ketik kode enam angka dari aplikasi autentikator.", W / 2, 140, 17, 300, { align: "center" });
    HP.codeBoxes(ctx, 180, 200, o.code || "", { size: 40 });
    HP.numpad(ctx, { press: o.press, pressU: o.pressU, done: (o.code || "").length >= 6 });
  };
  B.CODES = ["4821-7730", "9054-1186", "3367-2049", "7712-5583", "1290-6634", "5048-9917"];
  B.backup = function (ctx, o = {}) {
    HP.header(ctx, "Kode cadangan", { back: true });
    HP.para(ctx, "Tulis kode ini di kertas. Pakai bila HP-mu hilang. Tiap kode hanya berlaku sekali.", 20, 132, 16, 320);
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 16, 196, W - 32, 170, 16); ctx.fill();
    B.CODES.forEach((s, i) => text(ctx, s, 100 + (i % 2) * 160, 236 + Math.floor(i / 2) * 50, 20, { align: "center", weight: 800, color: UI.ink }));
    const cy = 398; ctx.strokeStyle = o.tick ? V : "#9AA8B1"; ctx.lineWidth = 2.2; rr(ctx, 22, cy - 13, 26, 26, 6); ctx.stroke();
    if (o.tick) { ctx.fillStyle = V; rr(ctx, 22, cy - 13, 26, 26, 6); ctx.fill(); HP.icon(ctx, "check", 35, cy, 16, "#FFFFFF"); }
    text(ctx, "Saya sudah menulisnya di kertas", 60, cy + 6, 16, { weight: 700, fit: 280 });
    return { tick: { x: 35, y: cy }, btn: HP.button(ctx, 40, 440, 280, 50, "Selesai", { fill: o.tick ? V : "#9FB6CC", hl: o.hl, size: 18 }) };
  };
  // aplikasi Catatan (untuk kesalahan umum)
  B.notesApp = function (ctx, o = {}) {
    ctx.fillStyle = "#FFF9E6"; ctx.fillRect(0, 36, W, HH - 36);
    HP.header(ctx, "Catatan", { back: true, bg: "#FFF9E6" });
    text(ctx, "Penting!!", 24, 150, 24, { weight: 900 }); text(ctx, "Diubah kemarin, 21.04", 24, 176, 14, { weight: 600, color: INK2 });
    const lines = ["Jadwal piket: Kamis", "Sandi brankas: dito123", "Bawa buku paket IPA"];
    lines.forEach((s, i) => { const y = 226 + i * 40; if (i === 1 && o.hl) { ctx.fillStyle = "rgba(217,68,59,0.16)"; rr(ctx, 16, y - 26, W - 32, 38, 8); ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 2.5; rr(ctx, 16, y - 26, W - 32, 38, 8); ctx.stroke(); }
      text(ctx, s, 24, y, 19, { weight: i === 1 ? 800 : 600, color: i === 1 && o.hl ? RED : UI.ink }); });
  };

  K.brankas = B;
})(typeof window !== "undefined" ? window : globalThis);
