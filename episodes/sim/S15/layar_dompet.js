/* S15: layar aplikasi dompet digital rekaan "Dompet Digital" di HP (satuan lokal layar_hp.js: 360 × 740).
   Tampilan generik tanpa logo, warna khas, atau tata letak aplikasi pembayaran bermerek. Nama, nomor, dan nominal rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, HP = K.hp;
  const { rr, wrap, clamp, lerp, ease } = H;
  const text = (ctx, s, x, y, size, opt = {}) => {
    if (opt.fit) { const f = `${opt.weight || 600} `; ctx.font = f + size + "px Inter"; while (size > 11 && ctx.measureText(s).width > opt.fit) { size -= 1; ctx.font = f + size + "px Inter"; } }
    H.text(ctx, s, x, y, size, { ...opt, fit: undefined });
  };
  const W = HP.W, HH = HP.H, UI = HP.UI;
  const P = "#1F7A6D", PBG = "#E1F1EE", RED = "#D9443B", GREEN = "#2E9E5B", ORANGE = "#D9822B", INK2 = "#5B6B76";
  const D = { P, PBG, RED, GREEN, ORANGE, text };
  D.APP = { color: P, letter: "Rp" };

  // ---------- bilah tab bawah ----------
  D.TAB = { Beranda: [60, 676], Riwayat: [180, 676], Profil: [300, 676] };
  D.tabs = function (ctx, active, hl) {
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 648, W, HH - 648); ctx.fillStyle = UI.line; ctx.fillRect(0, 648, W, 1.5);
    [["Beranda", "store"], ["Riwayat", "clock"], ["Profil", "user"]].forEach(([s, ic], i) => { const x = 60 + i * 120, on = active === s;
      if (hl === s) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x - 52, 654, 104, 58, 14); ctx.fill(); }
      if (on) { ctx.fillStyle = PBG; rr(ctx, x - 30, 656, 60, 30, 15); ctx.fill(); }
      HP.icon(ctx, ic, x, 671, 20, on ? P : INK2); text(ctx, s, x, 704, 13.5, { align: "center", weight: on ? 800 : 600, color: on ? P : INK2 }); });
  };
  // ---------- beranda ----------
  D.home = function (ctx, o = {}) {
    ctx.fillStyle = P; ctx.fillRect(0, 0, W, 230);
    text(ctx, "Dompet Digital", 22, 74, 22, { weight: 900, color: "#FFFFFF" }); HP.icon(ctx, "bell", 326, 66, 22, "#FFFFFF");
    text(ctx, "Saldo", 22, 116, 15, { weight: 700, color: "#CFEAE5" });
    text(ctx, o.saldo || "Rp350.000", 22, 152, 32, { weight: 900, color: "#FFFFFF" });
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 16, 178, W - 32, 94, 18); ctx.fill();
    [["qr", "Bayar"], ["plus", "Isi saldo"], ["back", "Kirim"], ["clock", "Riwayat"]].forEach(([ic, s], i) => { const x = 58 + i * 82;
      if (o.hl === s) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x - 36, 184, 72, 82, 12); ctx.fill(); }
      ctx.fillStyle = PBG; ctx.beginPath(); ctx.arc(x, 210, 20, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, x, 210, 20, P); text(ctx, s, x, 254, 13.5, { align: "center", weight: 700 }); });
    text(ctx, "Transaksi terakhir", 22, 312, 17, { weight: 800 });
    HP.list(ctx, [{ label: "Kedai Sari", sub: "Kemarin 12.05", app: { color: ORANGE, letter: "K" }, value: "−Rp12.000" }, { label: "Isi saldo", sub: "Senin 16.10", app: { color: GREEN, icon: "plus" }, value: "+Rp200.000", valueColor: GREEN }], { y: 326 });
    D.tabs(ctx, "Beranda", o.tabHl);
  };
  D.profile = function (ctx, o = {}) {
    HP.header(ctx, "Profil");
    ctx.fillStyle = PBG; ctx.beginPath(); ctx.arc(60, 150, 30, 0, Math.PI * 2); ctx.fill(); text(ctx, "S", 60, 160, 28, { align: "center", weight: 900, color: P });
    text(ctx, "Sinta", 104, 146, 21, { weight: 800 }); text(ctx, "0812 0000 0007", 104, 170, 15, { weight: 600, color: INK2 });
    const rows = HP.list(ctx, D.PROF_ITEMS(o), { y: 206 });
    D.tabs(ctx, "Profil"); return rows;
  };
  D.PROF_ITEMS = (o = {}) => [{ label: "Keamanan", icon: "shield", arrow: true, hl: o.hl === 0 }, { label: "Bantuan", icon: "info", arrow: true, hl: o.hl === 1 }, { label: "Bahasa", icon: "globe", value: "Indonesia", arrow: true }, { label: "Keluar", icon: "back", arrow: true }];
  // ---------- halaman Keamanan ----------
  // o: notif, limit ("Rp2.000.000"), tfa, dev (jumlah), hl (indeks), mark (array indeks yang diberi bingkai merah)
  D.SEC_ITEMS = (o = {}) => [
    { label: "Notifikasi transaksi", icon: "bell", value: o.notif ? "Aktif" : "Mati", valueColor: o.notif ? GREEN : RED, arrow: true, hl: o.hl === 0 },
    { label: "Batas transaksi harian", icon: "calc", value: o.limit || "Rp2.000.000", valueColor: o.limit ? GREEN : RED, arrow: true, hl: o.hl === 1 },
    { label: "PIN dan biometrik", icon: "lock", arrow: true, hl: o.hl === 2 },
    { label: "Verifikasi dua langkah", icon: "shield", value: o.tfa ? "Aktif" : "Mati", valueColor: o.tfa ? GREEN : RED, arrow: true, hl: o.hl === 3 },
    { label: "Perangkat terhubung", icon: "phone", value: (o.dev || 2) + " perangkat", arrow: true, hl: o.hl === 4 }];
  D.security = function (ctx, o = {}) { HP.header(ctx, "Keamanan", { back: true }); HP.para(ctx, "Atur cara melindungi saldo dan akunmu.", 20, 132, 16, 320); return HP.list(ctx, D.SEC_ITEMS(o), { y: 152 }); };
  D.SEC_Y = 152;
  // ---------- notifikasi ----------
  D.NOTIF_ITEMS = (o = {}) => [{ section: "KIRIM NOTIFIKASI UNTUK" }, { label: "Setiap transaksi", sub: "Bayar, kirim, dan isi saldo", toggle: o.a || 0, hl: o.hl === 1 },
    { label: "Login di perangkat baru", sub: "Saat akunmu dibuka di HP lain", toggle: o.b || 0, hl: o.hl === 2 }, { label: "Promo dan penawaran", toggle: 0 }];
  D.notifPage = function (ctx, o = {}) { HP.header(ctx, "Notifikasi transaksi", { back: true }); return HP.list(ctx, D.NOTIF_ITEMS(o), { y: 112 }); };
  // ---------- pembayaran QRIS ----------
  D.payPage = function (ctx, o = {}) {
    HP.header(ctx, "Bayar", { back: true });
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 16, 120, W - 32, 210, 18); ctx.fill();
    HP.appIcon(ctx, 60, 166, 48, ORANGE, "K"); text(ctx, "Kedai Sari", 96, 162, 21, { weight: 900 }); text(ctx, "QRIS · Kantin Sekolah", 96, 184, 14, { weight: 600, color: INK2 });
    if (o.hl) { ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; rr(ctx, 24, 132, W - 48, 70, 12); ctx.stroke(); }
    text(ctx, "Nominal", 32, 232, 15, { weight: 700, color: INK2 }); text(ctx, "Rp15.000", 32, 274, 34, { weight: 900 });
    text(ctx, "Cek nama dan nominal dulu.", 32, 310, 14, { weight: 700, color: P });
    return HP.button(ctx, 24, 352, W - 48, 52, "Bayar", { fill: P, hl: o.btnHl, size: 19, r: 14 });
  };
  D.pinPad = function (ctx, o = {}) {
    HP.header(ctx, o.title || "Masukkan PIN", { back: true }); HP.icon(ctx, "lock", 180, 168, 36, P);
    text(ctx, o.sub || "PIN enam angka", 180, 226, 18, { align: "center", weight: 700, color: INK2 });
    HP.pinDots(ctx, 180, 270, 6, o.n || 0);
    HP.numpad(ctx, { press: o.press, pressU: o.pressU, done: (o.n || 0) >= 6 });
  };
  D.paid = function (ctx, o = {}) {
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 36, W, HH - 36);
    ctx.fillStyle = C.goodBg; ctx.beginPath(); ctx.arc(180, 240, 56, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "check", 180, 240, 56, GREEN);
    text(ctx, "Pembayaran berhasil", 180, 340, 23, { align: "center", weight: 900 });
    text(ctx, "Rp15.000", 180, 384, 30, { align: "center", weight: 900, color: P }); text(ctx, "ke Kedai Sari · 12.05", 180, 412, 16, { align: "center", weight: 600, color: INK2 });
  };
  D.NOTIF_PAY = { app: "Dompet Digital", color: P, icon: "bell", title: "Pembayaran Rp15.000 berhasil", body: "ke Kedai Sari, hari ini 12.05", time: "sekarang" };
  // ---------- batas harian ----------
  D.LIMITS = ["Rp50.000", "Rp100.000", "Rp500.000", "Rp2.000.000"];
  D.limitPage = function (ctx, o = {}) {
    HP.header(ctx, "Batas transaksi harian", { back: true });
    HP.para(ctx, "Jumlah paling banyak yang bisa keluar dari saldomu dalam satu hari.", 20, 132, 16, 320);
    const rows = HP.list(ctx, D.LIMITS.map((s, i) => ({ label: s, radio: o.pick === i, hl: o.hl === i, sub: i === 3 ? "Bawaan aplikasi" : i === 1 ? "Cukup untuk jajan dan ongkos" : null })), { y: 176 });
    const btn = HP.button(ctx, 24, 520, W - 48, 50, "Simpan", { fill: P, hl: o.btnHl, size: 18, r: 14 });
    return { rows, btn };
  };
  // ---------- PIN dan biometrik ----------
  D.BIO_ITEMS = (o = {}) => [{ label: "Ganti PIN", icon: "lock", arrow: true, hl: o.hl === 0 }, { section: "" },
    { label: "Sidik jari untuk membayar", sub: "Ganti mengetik PIN saat bayar", toggle: o.fp || 0, hl: o.hl === 2 }, { label: "Minta PIN saat membuka aplikasi", sub: "Juga saat HP baru dibuka", toggle: o.lock || 0, hl: o.hl === 3 }];
  D.bioPage = function (ctx, o = {}) { HP.header(ctx, "PIN dan biometrik", { back: true }); return HP.list(ctx, D.BIO_ITEMS(o), { y: 112 }); };
  // ---------- verifikasi dua langkah ----------
  D.tfaPage = function (ctx, o = {}) {
    HP.header(ctx, "Verifikasi dua langkah", { back: true });
    ctx.fillStyle = PBG; ctx.beginPath(); ctx.arc(180, 176, 48, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "shield", 180, 176, 52, P);
    HP.para(ctx, "Login di HP baru membutuhkan kode OTP dari SMS dan PIN-mu.", W / 2, 258, 17, 300, { align: "center" });
    const rows = HP.list(ctx, [{ label: "Verifikasi dua langkah", toggle: o.on || 0, hl: o.hl }], { y: 320 });
    if (o.on >= 1) { HP.icon(ctx, "check", 40, 418, 18, GREEN); text(ctx, "Aktif sejak hari ini", 60, 424, 16, { weight: 800, color: GREEN }); }
    return rows;
  };
  D.otpPage = function (ctx, o = {}) {
    HP.header(ctx, "Masukkan kode OTP", { back: true });
    HP.para(ctx, "Kode enam angka dikirim lewat SMS ke 0812 •••• 0007.", W / 2, 140, 17, 300, { align: "center" });
    HP.codeBoxes(ctx, 180, 200, o.code || "", { size: 40 });
    HP.numpad(ctx, { press: o.press, pressU: o.pressU, done: (o.code || "").length >= 6 });
  };
  D.SMS = { app: "Pesan", color: "#7B8B95", icon: "chat", title: "Kode OTP Dompet Digital: 482913", body: "JANGAN berikan kode ini kepada siapa pun.", time: "sekarang" };
  D.smsChat = function (ctx, o = {}) {
    return HP.chat(ctx, { name: "Dompet Digital", sub: "Pesan resmi", color: P, size: 20, maxW: 320, input: false, warn: o.warn,
      messages: [{ from: "them", text: "Kode OTP Dompet Digital: 482913. JANGAN BERIKAN kode ini kepada siapa pun, termasuk petugas Dompet Digital. Berlaku 5 menit.", time: "12.31" }] });
  };
  // ---------- riwayat ----------
  D.HIST = (o = {}) => [{ section: "HARI INI" },
    { label: "Voucher Game Seru", sub: "02.13 · Pembelian", app: { color: "#8E6BBF", icon: "game" }, value: "−Rp50.000", valueColor: RED, hl: o.hl === "game", danger: o.hl === "game" },
    { section: "KEMARIN" }, { label: "Kedai Sari", sub: "12.05 · QRIS", app: { color: ORANGE, letter: "K" }, value: "−Rp12.000", hl: o.hl === "kedai" },
    { label: "Fotokopi Pak Budi", sub: "07.40 · QRIS", app: { color: "#5B6B76", letter: "F" }, value: "−Rp3.000" },
    { section: "SENIN" }, { label: "Isi saldo", sub: "16.10 · dari rekening ibu", app: { color: GREEN, icon: "plus" }, value: "+Rp200.000", valueColor: GREEN, hl: o.hl === "isi" }];
  D.history = function (ctx, o = {}) { HP.header(ctx, "Riwayat"); const r = HP.list(ctx, D.HIST(o), { y: 112 }); D.tabs(ctx, "Riwayat"); return r; };
  D.detail = function (ctx, o = {}) {
    HP.header(ctx, "Detail transaksi", { back: true });
    HP.appIcon(ctx, 180, 160, 60, "#8E6BBF", "game"); text(ctx, "Voucher Game Seru", 180, 224, 21, { align: "center", weight: 900 });
    text(ctx, "−Rp50.000", 180, 266, 32, { align: "center", weight: 900, color: RED });
    const rows = [["Waktu", "Hari ini, 02.13"], ["Perangkat", "HP tidak dikenal"], ["ID transaksi", "TX-2611-0213"]];
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 16, 290, W - 32, 136, 16); ctx.fill();
    rows.forEach(([k, v], i) => { text(ctx, k, 34, 326 + i * 40, 16, { weight: 600, color: INK2 }); text(ctx, v, W - 34, 326 + i * 40, 16, { align: "right", weight: 800, color: i === 1 ? RED : UI.ink }); });
    return HP.button(ctx, 24, 448, W - 48, 50, "Laporkan masalah", { fill: "#FFFFFF", outline: true, ink: RED, hl: o.hl, size: 18, r: 14 });
  };
  D.REASONS = ["Saya tidak melakukan transaksi ini", "Nominal tidak sesuai", "Barang belum diterima"];
  D.reportPage = function (ctx, o = {}) {
    HP.header(ctx, "Laporkan masalah", { back: true });
    HP.para(ctx, "Apa yang terjadi dengan transaksi Rp50.000 ini?", 20, 134, 16, 320);
    const rows = HP.list(ctx, D.REASONS.map((s, i) => ({ label: s, radio: o.pick === i, hl: o.hl === i })), { y: 176 });
    const btn = HP.button(ctx, 24, 420, W - 48, 50, "Kirim laporan", { fill: o.pick != null ? RED : "#E8A8A3", hl: o.btnHl, size: 18, r: 14 });
    return { rows, btn };
  };
  D.reported = function (ctx) {
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 36, W, HH - 36);
    ctx.fillStyle = C.goodBg; ctx.beginPath(); ctx.arc(180, 210, 52, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "check", 180, 210, 52, GREEN);
    text(ctx, "Laporan terkirim", 180, 302, 23, { align: "center", weight: 900 });
    ctx.fillStyle = PBG; rr(ctx, 40, 326, W - 80, 62, 14); ctx.fill(); text(ctx, "Nomor laporan", 180, 350, 14, { align: "center", weight: 700, color: INK2 }); text(ctx, "LP-2611-0457", 180, 377, 20, { align: "center", weight: 900, color: P });
    HP.para(ctx, "Tim layanan akan menghubungimu lewat menu Bantuan di aplikasi ini.", W / 2, 420, 16, 290, { align: "center" });
  };
  // ---------- perangkat terhubung ----------
  D.devPage = function (ctx, o = {}) {
    HP.header(ctx, "Perangkat terhubung", { back: true });
    const items = [{ section: "PERANGKAT INI" }, { label: "HP Sinta", sub: "Aktif sekarang · kota kamu", icon: "phone", color: GREEN, iconBg: C.goodBg }];
    if (!o.gone) items.push({ section: "PERANGKAT LAIN" }, { label: "HP tidak dikenal", sub: "Semalam 01.58 · kota lain", icon: "warning", danger: true, hl: o.hl });
    const rows = HP.list(ctx, items, { y: 112 }); let btn = null;
    if (!o.gone) { const r = rows[3]; btn = HP.button(ctx, 24, r.y + r.h + 14, W - 48, 48, "Keluarkan", { fill: RED, hl: o.btnHl, size: 18, r: 14 }); }
    else { HP.icon(ctx, "check", 40, rows.bottom + 24, 18, GREEN); text(ctx, "Tidak ada perangkat lain.", 60, rows.bottom + 30, 16, { weight: 800, color: GREEN }); }
    let dlg = null; if (o.dialog) dlg = HP.dialog(ctx, { icon: "warning", iconColor: RED, title: "Keluarkan HP tidak dikenal?", body: "Perangkat itu harus login lagi dengan OTP dan PIN.", buttons: ["Batal", "Keluarkan"], danger: 1, hl: o.okHl ? 1 : null, u: o.dialog });
    return { rows, btn, dlg };
  };

  K.dompet = D;
})(typeof window !== "undefined" ? window : globalThis);
