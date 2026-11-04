/* S11 Simulasi praktik: menyalakan verifikasi dua langkah (browser + HP).
   Tata letak: browser penuh x 90–1420, atau browser x 70–1060 + HP di x≈1250; panel langkah di kanan (x 1450–1820).
   Semua gambar penting di atas y≈830 (kartu narasi). Akun, kode, dan lokasi rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, HP = K.hp, Wb = K.web11;
  const { rr, text, para, card, kiko, kid, ease, clamp, lerp } = H;
  const BF = { x: 90, y: 122, w: 1330, h: 700 }, BH = { x: 70, y: 122, w: 990, h: 700 }, PH = { cx: 1250, cy: 474, h: 630 };
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";
  const ACC = { issuer: "akun.example", user: "dito@sekolah.example" };

  // ---------- pembantu ----------
  let MC = null;  // kanvas tak terlihat untuk mengukur letak tombol sebelum menggambar
  function measure(fn) { if (!MC) MC = document.createElement("canvas"); MC.width = 1920; MC.height = 1080; return fn(MC.getContext("2d")); }
  function browser(ctx, B, page, st = {}, opt = {}) { const A = Wb.browser(ctx, B.x, B.y, B.w, B.h, { url: opt.url || URLS[page] || "akun.example", typed: opt.typed, urlFocus: opt.urlFocus, tab: opt.tab }); return Wb.page(ctx, A, page, st); }
  const geo = (B, page, st = {}) => measure(m => browser(m, B, page, st));
  const URLS = { login: "akun.example/login", beranda: "akun.example", keamanan: "akun.example/keamanan", v2_intro: "akun.example/keamanan/dua-langkah", v2_sandi: "akun.example/keamanan/dua-langkah",
    v2_cara: "akun.example/keamanan/dua-langkah", v2_qr: "akun.example/keamanan/dua-langkah", v2_kode: "akun.example/keamanan/dua-langkah", v2_aktif: "akun.example/keamanan/dua-langkah",
    cadangan: "akun.example/keamanan/kode-cadangan", perangkat: "akun.example/keamanan/perangkat", ganti_sandi: "akun.example/keamanan/kata-sandi" };
  const pt = p => [p.x, p.y];
  function phone(ctx, draw, opt = {}) { return HP.phone(ctx, opt.cx || PH.cx, opt.cy || PH.cy, { h: opt.h || PH.h, ...opt }, draw); }
  // panel langkah di kanan (sama dengan S02)
  function steps(ctx, title, items, n, opt = {}) {
    const x = opt.x || 1450, y = opt.y || 122, w = opt.w || 370; let hh = 70;
    const rows = items.map(s => H.wrap(ctx, s, 23, 700, w - 86)); rows.forEach(lines => hh += lines.length * 30 + 22);
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
  function pointer(ctx, R) { if (R.ptr) L.cursor(ctx, R.ptr.x, R.ptr.y, { click: R.click }); if (R.key) L.keys(ctx, 1635, 720, R.key.keys, { press: R.key.press, align: "center", size: 28 }); }
  function note(ctx, x, y, s, opt = {}) { return L.callout(ctx, x, y, s, opt.tx, opt.ty, { size: opt.size || 24, maxW: opt.maxW || 330, ...opt }); }
  function badge(ctx, x, y, ok, s, opt = {}) {  // baris tanda ✓/✗ dengan teks
    ctx.fillStyle = ok ? C.goodBg : C.badBg; rr(ctx, x, y, opt.w || 370, opt.h || 64, 14); ctx.fill();
    ctx.fillStyle = ok ? GREEN : RED; ctx.beginPath(); ctx.arc(x + 32, y + (opt.h || 64) / 2, 18, 0, Math.PI * 2); ctx.fill();
    HP.icon(ctx, ok ? "check" : "close", x + 32, y + (opt.h || 64) / 2, 18, "#FFFFFF");
    para(ctx, s, x + 62, y + (opt.h || 64) / 2 + 8 - (opt.lines2 ? 14 : 0), opt.size || 22, (opt.w || 370) - 76, { weight: 800, color: C.ink, lh: 1.2 });
  }
  function hypo(ctx, s) { ctx.fillStyle = "#FFF3D6"; rr(ctx, 1450, 122, 370, 60, 14); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, 1450, 122, 370, 60, 14); ctx.stroke(); text(ctx, s, 1635, 162, 23, { align: "center", weight: 900, color: C.accentDark }); }
  // kode TOTP rekaan: daftar kode berurutan
  const CODES = ["482913", "075264", "315806", "629471", "908152"];

  const { wrap, arrowIcon } = H;
  Object.assign(K.SCENES, {
    // kartu judul: sama dengan kiko-core.js, tetapi ukuran judul dikecilkan bila perlu supaya muat dua baris (kait tiga baris tidak menabrak kartu narasi)
    title(ctx, b, l, t, TL) {
      card(ctx, 160, 160, 1600, 700, { fill: C.panel });
      kiko(ctx, 420, 520, 260, 0, { wave: l, mood: "happy" });
      text(ctx, TL.label, 720, 330, 34, { color: C.ink2, weight: 700 });
      let ts = 92; while (ts > 64 && wrap(ctx, TL.title, ts, 900, 1000).length > 2) ts -= 4;
      const th = para(ctx, TL.title, 720, 440, ts, 1000, { weight: 900, lh: 1.1 }); const hookLines = wrap(ctx, TL.hook, 34, 800, 1000).length;
      const hy = Math.max(hookLines >= 3 ? 600 : 640, 440 + th - ts * 0.35 + 30);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 720, hy, 26, { color: C.accentDark, weight: 800 }); para(ctx, TL.hook, 720, hy + 50, 34, 1000, { weight: 800, lh: 1.3 });
      const ny = hy + 50 + hookLines * 34 * 1.3 + 12; if (ny <= 830) text(ctx, "Dengarkan, atau baca teksnya pelan-pelan.", 720, Math.max(800, ny), 26, { color: C.ink2, weight: 600 });
    },
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menyalakan verifikasi dua langkah", "memindai kode QR dengan HP", "menyimpan kode cadangan", "mengeluarkan perangkat asing"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 800, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      // laptop kecil + HP
      ctx.fillStyle = "#2B3A44"; rr(ctx, 1110, 320, 420, 270, 16); ctx.fill(); ctx.fillStyle = "#FFFFFF"; rr(ctx, 1126, 336, 388, 238, 8); ctx.fill();
      ctx.fillStyle = "#5B6B76"; rr(ctx, 1076, 590, 488, 22, 10); ctx.fill();
      HP.qr(ctx, 1240, 380, 150, 11);
      phone(ctx, c => HP.auth(c, { accounts: [{ ...ACC, code: CODES[0], secs: 30 - (l % 30) }] }), { cx: 1600, cy: 520, h: 360, shadow: true });
      text(ctx, "laptop + HP", 1340, 700, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      [["D7.3", "Kata Sandi Aman", "kata sandi panjang dan rahasia"], ["E.3", "Keamanan Akun", "kode dua langkah, sesi aktif"], ["F12.5", "Transaksi Digital", "OTP tidak dibagikan"]].forEach(([c, t, s], i) => {
        const x = 230 + i * 500, u = ease((l - 0.4 - i * 0.9) / 0.5); ctx.globalAlpha = Math.max(0.15, u);
        card(ctx, x, 300, 460, 300, { fill: C.bg2, r: 22 });
        text(ctx, c, x + 230, 380, 56, { align: "center", weight: 900, color: C.kiko }); text(ctx, t, x + 230, 450, 32, { align: "center", weight: 800, fit: 420 });
        text(ctx, s, x + 230, 540, 24, { align: "center", weight: 600, color: C.ink2, fit: 420 }); ctx.globalAlpha = 1;
      });
      card(ctx, 560, 650, 800, 64, { fill: "#FFF3D6", r: 14 }); text(ctx, "Semua akun dan kode di video ini hanya contoh.", 960, 692, 26, { align: "center", weight: 800, color: C.accentDark });
    },
    dua_kunci(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      const a = b.audio || b.dur;
      const door = (x, title, locks, thief, ok) => {
        text(ctx, title, x + 330, 210, 32, { align: "center", weight: 900, color: ok ? GREEN : C.ink });
        card(ctx, x, 240, 660, 520, { fill: ok ? "#F2FAF4" : "#F7F9FA", stroke: ok ? GREEN : "#D7E2DC", lw: 3, r: 22 });
        // pintu akun
        ctx.fillStyle = "#A4653A"; rr(ctx, x + 430, 300, 170, 300, 12); ctx.fill(); ctx.fillStyle = "#C98A57"; rr(ctx, x + 446, 316, 138, 268, 8); ctx.fill();
        text(ctx, "AKUN", x + 515, 640, 26, { align: "center", weight: 900, color: C.ink2 });
        locks.forEach((lk, i) => { const ly = 380 + i * 110; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x + 515, ly, 42, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, lk.icon, x + 515, ly, 44, lk.color);
          text(ctx, lk.label, x + 400, ly + 9, 24, { align: "right", weight: 800, color: lk.color }); });
        // pencuri: hanya tahu kata sandi
        if (thief) {
          kid(ctx, x + 120, 520, 90, { hairColor: "#555" });
          ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 170, 420, 150, 56, 12); ctx.fill(); ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; rr(ctx, x + 170, 420, 150, 56, 12); ctx.stroke();
          text(ctx, "••••••", x + 245, 458, 26, { align: "center", weight: 900, color: C.ink });
          ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(x + 330, 448); ctx.lineTo(ok ? x + 385 : x + 415, 448); ctx.stroke(); ctx.setLineDash([]);
          if (ok) { ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x + 412, 448, 24, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "close", x + 412, 448, 26, "#FFFFFF"); }
          else { ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(x + 428, 448); ctx.lineTo(x + 406, 434); ctx.lineTo(x + 406, 462); ctx.closePath(); ctx.fill(); }
          text(ctx, "pencuri tahu", x + 120, 680, 22, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "kata sandimu", x + 120, 708, 22, { align: "center", weight: 800, color: C.ink2 });
          text(ctx, ok ? "TERTAHAN" : "MASUK!", x + 330, 740, 34, { align: "center", weight: 900, color: ok ? GREEN : RED });
        }
      };
      door(200, "Hanya kata sandi", [{ icon: "key", label: "kata sandi", color: C.ink }], after(b, l, 0.15), false);
      if (after(b, l, 0.3)) door(1060, "Verifikasi dua langkah", [{ icon: "key", label: "kata sandi", color: C.ink }, { icon: "phone", label: "kode dari HP", color: BLUE }], after(b, l, 0.65), true);
    },
    siapkan(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      text(ctx, "YANG PERLU DISIAPKAN", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      // laptop
      ctx.fillStyle = "#2B3A44"; rr(ctx, 230, 280, 520, 330, 18); ctx.fill(); ctx.fillStyle = "#FFFFFF"; rr(ctx, 248, 298, 484, 294, 8); ctx.fill(); ctx.fillStyle = "#5B6B76"; rr(ctx, 190, 610, 600, 26, 10); ctx.fill();
      ctx.fillStyle = "#DDE5EA"; ctx.fillRect(248, 298, 484, 36); ctx.fillStyle = "#EEF2F5"; rr(ctx, 300, 304, 380, 24, 12); ctx.fill(); text(ctx, "akun.example", 316, 322, 16, { weight: 700 });
      text(ctx, "Akun Sekolah", 490, 420, 30, { align: "center", weight: 900, color: BLUE }); text(ctx, "Keamanan", 490, 470, 24, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "Laptop atau komputer", 490, 690, 28, { align: "center", weight: 900 }); text(ctx, "untuk membuka akun", 490, 728, 24, { align: "center", weight: 700, color: C.ink2 });
      if (after(b, l, 0.3)) {
        phone(ctx, c => HP.home(c, [{ name: "Autentikator", color: BLUE, icon: "shield" }, { name: "Kamera", color: "#2E7E9A", icon: "camera" }, { name: "Toko Aplikasi", color: GREEN, icon: "store" }, { name: "Pesan", color: "#7B8B95", icon: "chat" }], { hl: "Autentikator" }), { cx: 1010, cy: 478, h: 420 });
        text(ctx, "HP + aplikasi autentikator", 1010, 742, 28, { align: "center", weight: 900 }); text(ctx, "dari toko aplikasi resmi", 1010, 778, 24, { align: "center", weight: 700, color: C.ink2 });
      }
      if (after(b, l, 0.75)) { kid(ctx, 1460, 470, 80, { hair: "long" }); kiko(ctx, 1620, 520, 110, 0, { wave: l }); text(ctx, "Ditemani orang tua", 1540, 690, 26, { align: "center", weight: 900 }); text(ctx, "atau guru", 1540, 726, 24, { align: "center", weight: 700, color: C.ink2 }); }
    },
    buka_keamanan(ctx, b, l) {
      const span = spanOf(b), gL = geo(BF, "login", {}), gB = geo(BF, "beranda", {});
      const R = HP.run({ page: "beranda0", typed: 0, pointer: { x: 700, y: 500 } }, [
        { to: [600, 195], click: true, set: { urlFocus: true }, d: 0.7 }, { anim: "typed", d: 1.1 }, { key: "Enter", set: { page: "login", urlFocus: false }, d: 0.6 },
        { to: pt(gL.email), click: true, set: { focus: "email" }, d: 0.6 }, { type: "dito@sekolah.example", field: "email", d: 1.1 },
        { to: pt(gL.pw), click: true, set: { focus: "pw" }, d: 0.5 }, { type: "kucing-angkot-hujan", field: "pw", d: 0.9 },
        { to: pt(gL.login), click: true, set: { page: "beranda", focus: null }, d: 0.7 }, { wait: 1, d: 0.4 },
        { to: pt(gB.nav["Keamanan"]), click: true, set: { page: "keamanan" }, d: 0.9 }, { wait: 1, d: 0.5 }], l, span);
      const st = R.st;
      if (st.page === "beranda0") { const A = Wb.browser(ctx, BF.x, BF.y, BF.w, BF.h, { url: "akun.example", typed: Math.round(12 * (st.typed || 0)), urlFocus: st.urlFocus, tab: "Tab baru" }); ctx.fillStyle = "#F4F7F9"; ctx.fillRect(A.x, A.y, A.w, A.h - 16); text(ctx, "Tab baru", A.x + A.w / 2, A.y + 280, 30, { align: "center", weight: 700, color: "#9AAFA6" }); }
      else browser(ctx, BF, st.page, { email: st.email, pw: st.pw, focus: st.focus, navHl: st.page === "beranda" ? "Keamanan" : null });
      steps(ctx, "LANGKAH", ["Ketik alamat akun sekolah.", "Login dengan email dan kata sandi.", "Klik menu Keamanan."], stepAt(l, span, [0.27, 0.76, 1]));
      pointer(ctx, R);
    },
    lihat_keamanan(ctx, b, l) {
      const span = spanOf(b), g = geo(BF, "keamanan", {});
      const R = HP.run({ hl: null, pointer: { x: 400, y: 330 } }, [{ wait: 1, d: 0.5 }, { to: pt(g.twofa), set: { hl: "2fa" }, d: 1.2 }, { wait: 1, d: 2.2 }, { to: pt(g.twofa), click: true, d: 0.8 }, { wait: 1, d: 0.6 }], l, span);
      browser(ctx, BF, "keamanan", { hl: R.st.hl });
      steps(ctx, "LANGKAH", ["Cari Verifikasi dua langkah.", "Lihat statusnya: Mati.", "Klik baris itu."], stepAt(l, span, [0.3, 0.75, 1]));
      if (after(b, l, 0.3)) note(ctx, 1450, 420, "Status: Mati", { tx: g.twofa.x + 520, ty: g.twofa.y - 10, fill: C.badBg, color: RED });
      if (after(b, l, 0.62)) note(ctx, 1450, 560, "Di aplikasi lain: Autentikasi dua faktor atau 2FA.", { fill: "#E7F1FB", color: BLUE, size: 22 });
      pointer(ctx, R);
    },
    ulang_sandi(ctx, b, l) {
      const span = spanOf(b), g1 = geo(BF, "v2_intro", {}), g2 = geo(BF, "v2_sandi", {});
      const R = HP.run({ page: "v2_intro", pointer: { x: 700, y: 400 } }, [{ to: pt(g1.mulai), click: true, set: { page: "v2_sandi" }, d: 1.2 }, { wait: 1, d: 0.8 },
        { to: pt(g2.pw), click: true, d: 0.7 }, { type: "kucing-angkot-hujan", field: "pw", d: 1.6 }, { to: pt(g2.lanjut), set: { hl: "lanjut" }, d: 1 }, { wait: 1, d: 1.2 }], l, span);
      browser(ctx, BF, R.st.page, { pw: R.st.pw, hl: R.st.hl });
      steps(ctx, "LANGKAH", ["Klik Mulai.", "Ketik ulang kata sandimu.", "Klik Lanjut."], stepAt(l, span, [0.18, 0.66, 1]));
      if (after(b, l, 0.6)) note(ctx, 1450, 420, "Wajar: supaya orang yang meminjam laptopmu tidak bisa mengubah pengaturan.", { fill: "#E7F1FB", color: BLUE, size: 22 });
      pointer(ctx, R);
    },
    pilih_cara(ctx, b, l) {
      const span = spanOf(b), g = geo(BF, "v2_cara", {});
      const R = HP.run({ page: "v2_cara", pick: null, pointer: { x: 900, y: 650 } }, [{ wait: 1, d: 0.6 }, { to: pt(g.opt0), click: true, set: { pick: 0 }, d: 1.2 }, { wait: 1, d: 2 }, { to: pt(g.lanjut), click: true, set: { hl: "lanjut" }, d: 1 }, { wait: 1, d: 0.5 }], l, span);
      browser(ctx, BF, "v2_cara", { pick: R.st.pick, hl: R.st.hl });
      steps(ctx, "LANGKAH", ["Pilih Aplikasi autentikator.", "Klik Lanjut."], stepAt(l, span, [0.4, 1]));
      if (after(b, l, 0.35)) note(ctx, 1450, 340, "Kode dibuat di HP-mu sendiri, tidak lewat SMS.", { tx: g.opt0.x + 560, ty: g.opt0.y, fill: C.goodBg, color: GREEN, size: 22 });
      pointer(ctx, R);
    },
    qr_tampil(ctx, b, l) {
      const g = browser(ctx, BF, "v2_qr", { qrHl: after(b, l, 0.15) });
      card(ctx, 1450, 122, 370, 420, { fill: "#FFFFFF", stroke: RED, lw: 3, r: 18 });
      text(ctx, "KODE QR INI RAHASIA", 1635, 172, 24, { align: "center", weight: 900, color: RED });
      [["jangan dipotret", 0.35], ["jangan dibagikan", 0.5], ["jangan tutup halaman ini dulu", 0.65]].forEach(([s, f], i) => { if (after(b, l, f)) badge(ctx, 1470, 200 + i * 106, false, s, { w: 330, h: 88, size: 22 }); });
      if (after(b, l, 0.15)) note(ctx, 1450, 600, "Khusus untuk akunmu", { tx: g.qr.x + g.qr.s / 2 + 20, ty: g.qr.y, size: 22 });
    },
    hp_tambah(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ scr: "empty" }, [{ wait: 1, d: 0.8 }, { tap: [304, 656], set: { scr: "menu" }, d: 1.2 }, { wait: 1, d: 0.6 }, { tap: [195, 547], set: { scr: "scan" }, d: 1.2 }, { wait: 1, d: 1.4 }], l, span);
      browser(ctx, BH, "v2_qr", {});
      const s = R.st.scr;
      phone(ctx, c => {
        if (s === "scan") HP.scanner(c, {});
        else HP.auth(c, { empty: true, menu: s === "menu", menuHl: s === "menu" && R.i >= 3 ? 0 : null, fabHl: s === "empty" && R.i >= 1 });
        if (R.tap) HP.tap(c, R.tap.x, R.tap.y, R.tap.u);
      }, { dark: s === "scan" });
      steps(ctx, "LANGKAH", ["Buka aplikasi autentikator.", "Tap tanda tambah.", "Pilih Pindai kode QR."], stepAt(l, span, [0.15, 0.45, 0.8]));
    },
    hp_pindai(ctx, b, l) {
      const span = spanOf(b), a = b.audio || b.dur;
      const g = browser(ctx, BH, "v2_qr", { qrHl: true });
      const found = l > span * 0.35, list = l > span * 0.55;
      const ph = phone(ctx, c => {
        if (!list) HP.scanner(c, { found, foundText: "Akun ditambahkan", inner: (cc, bx) => { const sh = Math.sin(l * 2.2) * 6 * (found ? 0 : 1); cc.fillStyle = "#EEF2F5"; cc.fillRect(bx.x - 30, bx.y - 30, bx.w + 60, bx.h + 60); HP.qr(cc, bx.x + 40 + sh, bx.y + 40, 180, 11); } });
        else { HP.auth(c, { accounts: [{ ...ACC, code: CODES[0], secs: 24 - (l - span * 0.55), hl: true }] }); }
      }, { dark: !list });
      if (!list) { // garis bidik dari kamera HP ke kode QR di laptop
        ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = "rgba(242,177,52,0.9)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ph.x + 10, ph.y + ph.h * 0.42); ctx.lineTo(g.qr.x + g.qr.s / 2 + 10, g.qr.y); ctx.stroke(); ctx.restore(); }
      steps(ctx, "LANGKAH", ["Arahkan kamera ke kode QR.", "Akun muncul dengan kode enam angka."], stepAt(l, span, [0.4, 1]));
      if (list) { const p = ph.at(20, 212); note(ctx, 1450, 420, "akun.example ditambahkan", { tx: ph.x + ph.w - 20, ty: p.y - 30, fill: C.goodBg, color: GREEN, size: 22 }); }
    },
    hp_kode(ctx, b, l) {
      const a = b.audio || b.dur, chg = Math.min(12, a * 0.62);  // kode berganti di tengah beat
      const rem = l < chg ? chg - l : 30 - (l - chg), code = l < chg ? CODES[0] : CODES[1];
      card(ctx, 140, 140, 1640, 680);
      const ph = phone(ctx, c => HP.auth(c, { accounts: [{ ...ACC, code, secs: rem, hl: true }] }), { cx: 460, cy: 478, h: 620 });
      // pembesaran kode + lingkaran
      const zx = 760, zy = 230; card(ctx, zx, zy, 700, 250, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
      const red = rem <= 5; text(ctx, code.slice(0, 3) + " " + code.slice(3), zx + 40, zy + 160, 100, { weight: 800, color: red ? RED : BLUE });
      HP.ring(ctx, zx + 610, zy + 125, 60, rem / 30, red ? RED : BLUE); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(zx + 610, zy + 125, 34, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(Math.ceil(rem)), zx + 610, zy + 138, 34, { align: "center", weight: 900, color: red ? RED : C.ink });
      const p = ph.at(320, 220); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(zx, zy + 125); ctx.stroke(); ctx.setLineDash([]);
      if (after(b, l, 0.18)) note(ctx, 1490, 300, "Lingkaran = sisa waktu", { tx: zx + 672, ty: zy + 125, size: 24, maxW: 240 });
      if (after(b, l, 0.45)) {
        card(ctx, 760, 520, 960, 120, { fill: C.bg2, r: 18 });
        text(ctx, "Setiap 30 detik:", 790, 592, 28, { weight: 900 });
        text(ctx, "482 913", 1070, 592, 34, { weight: 900, color: l >= chg ? "#9AAFA6" : BLUE }); if (l >= chg) { ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1066, 582); ctx.lineTo(1215, 582); ctx.stroke(); }
        text(ctx, "→", 1270, 594, 36, { align: "center", weight: 900, color: C.ink2 }); if (l >= chg) text(ctx, "075 264", 1320, 592, 34, { weight: 900, color: BLUE });
        if (l >= chg) text(ctx, "kode lama hangus", 1070, 628, 20, { weight: 700, color: RED });
      }
    },
    ketik_kode(ctx, b, l) {
      const span = spanOf(b), gq = geo(BH, "v2_qr", {}), gk = geo(BH, "v2_kode", {});
      const R = HP.run({ page: "v2_qr", code: "", pointer: { x: 700, y: 600 } }, [{ to: pt(gq.lanjut), click: true, set: { page: "v2_kode" }, d: 1.1 }, { to: pt(gk.boxes), click: true, d: 0.7 },
        { type: CODES[0], field: "code", d: 2.4 }, { to: pt(gk.verif), click: true, set: { hl: "verif", checking: 0.01 }, d: 1 }, { anim: "spin", d: 1.4 }], l, span);
      browser(ctx, BH, R.st.page, { code: R.st.code, hl: R.st.hl, checking: R.st.checking ? 1 + (R.st.spin || 0) * 3 : 0 });
      const rem = 27 - l;
      phone(ctx, c => HP.auth(c, { accounts: [{ ...ACC, code: CODES[0], secs: rem, hl: true }] }));
      steps(ctx, "LANGKAH", ["Klik Lanjut di laptop.", "Ketik enam angka dari HP.", "Klik Verifikasi."], stepAt(l, span, [0.15, 0.68, 0.84]));
      pointer(ctx, R);
    },
    kode_hangus(ctx, b, l) {
      const span = spanOf(b), gk = geo(BH, "v2_kode", {}), chg = span * 0.28;
      const R = HP.run({ code: "", pointer: { x: pt(gk.boxes)[0], y: pt(gk.boxes)[1] + 40 } }, [{ type: CODES[2], field: "code", d: 2.2 }, { to: pt(gk.verif), click: true, set: { err: true }, d: 0.9 }, { wait: 1, d: 0.9 },
        { to: pt(gk.boxes), click: true, d: 0.6 }, { key: "⌫", set: { code: "", err: false }, d: 0.6 }, { type: CODES[3], field: "code", d: 2.2 }, { wait: 1, d: 0.5 }], l, span);
      browser(ctx, BH, "v2_kode", { code: R.st.code, err: R.st.err });
      const rem = l < chg ? 30 * 0 + (chg - l) + 0.0 : 30 - (l - chg), code = l < chg ? CODES[2] : CODES[3];
      phone(ctx, c => HP.auth(c, { accounts: [{ ...ACC, code, secs: rem, hl: true }] }));
      hypo(ctx, "KALAU KODENYA HANGUS");
      steps(ctx, "LANGKAH", ["Kode lama ditolak.", "Hapus angkanya.", "Ketik kode yang baru."], stepAt(l, span, [0.45, 0.62, 1]), { y: 200 });
      if (R.st.err) note(ctx, 1450, 560, "Jangan panik: tunggu kode baru.", { fill: "#E7F1FB", color: BLUE, size: 22 });
      pointer(ctx, R);
    },
    aktif(ctx, b, l) {
      browser(ctx, BF, "v2_aktif", {});
      card(ctx, 1450, 122, 370, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "LOGIN BERIKUTNYA", 1635, 172, 24, { align: "center", weight: 900, color: C.accentDark });
      [["key", "1. Kata sandi", C.ink, 0.3], ["phone", "2. Kode dari HP", BLUE, 0.5]].forEach(([ic, s, col, f], i) => { if (!after(b, l, f)) return; const y = 210 + i * 130;
        ctx.fillStyle = C.bg2; rr(ctx, 1475, y, 320, 110, 16); ctx.fill(); HP.icon(ctx, ic, 1530, y + 55, 44, col); text(ctx, s, 1570, y + 64, 26, { weight: 900, color: col }); });
      if (after(b, l, 0.5)) text(ctx, "di perangkat baru", 1635, 500, 22, { align: "center", weight: 700, color: C.ink2 });
    },
    cadangan_tampil(ctx, b, l) {
      const g = browser(ctx, BF, "cadangan", { codesHl: after(b, l, 0.1) });
      if (after(b, l, 0.3)) note(ctx, 1450, 200, "Untuk saat HP hilang atau rusak", { tx: g.codes.x + 10, ty: g.codes.y - 60, size: 24 });
      if (after(b, l, 0.6)) note(ctx, 1450, 380, "Satu kode hanya untuk satu kali login", { fill: "#E7F1FB", color: BLUE, size: 24 });
    },
    cadangan_tulis(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      text(ctx, "SIMPAN DI KERTAS, DI TEMPAT AMAN", 960, 210, 32, { align: "center", weight: 900, color: GREEN });
      // kertas bertulisan tangan
      ctx.save(); ctx.translate(560, 490); ctx.rotate(-0.04);
      ctx.fillStyle = "#FFFDF4"; rr(ctx, -300, -240, 600, 470, 10); ctx.fill(); ctx.strokeStyle = "#E3D9B8"; ctx.lineWidth = 2; rr(ctx, -300, -240, 600, 470, 10); ctx.stroke();
      ctx.strokeStyle = "#E8E1C9"; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-270, -160 + i * 44); ctx.lineTo(270, -160 + i * 44); ctx.stroke(); }
      text(ctx, "Kode cadangan akun sekolah", -260, -190, 26, { weight: 800, color: "#3A4A8A" });
      const n = Math.round(10 * clamp(l / ((b.audio || b.dur) * 0.45), 0, 1));
      Wb.BACKUP.slice(0, n).forEach((s, i) => { const x = -250 + (i % 2) * 270, y = -128 + Math.floor(i / 2) * 44 * 1.0; text(ctx, s, x, y + 12, 28, { weight: 700, color: "#3A4A8A" });
        if (i === 0 && after(b, l, 0.8)) { ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 6, y + 2); ctx.lineTo(x + 150, y + 2); ctx.stroke(); } });
      ctx.restore();
      if (after(b, l, 0.45)) { // map dokumen keluarga
        const x = 1100, y = 300; ctx.fillStyle = "#E0A23B"; rr(ctx, x, y + 30, 460, 300, 18); ctx.fill(); ctx.fillStyle = "#F2B134"; rr(ctx, x, y + 70, 460, 260, 18); ctx.fill(); ctx.fillStyle = "#E0A23B"; rr(ctx, x, y, 180, 60, 14); ctx.fill();
        text(ctx, "Dokumen Keluarga", x + 230, y + 210, 34, { align: "center", weight: 900, color: "#6B4A10" });
        badge(ctx, x + 20, y + 360, true, "di rumah, di tempat aman", { w: 420 });
      }
      if (after(b, l, 0.8)) note(ctx, 860, 690, "Coret kode yang sudah terpakai", { size: 22, fill: C.badBg, color: RED });
    },
    cadangan_salah(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      text(ctx, "JANGAN SIMPAN SEBAGAI FOTO DI GALERI", 1280, 230, 32, { align: "center", weight: 900, color: RED });
      phone(ctx, c => { HP.header(c, "Galeri", { back: true });
        const tiles = ["#CFE6EE", "#F2D6A2", "#BFE3C6", "#E8C4C0", null, "#D5D0EE"];
        tiles.forEach((col, i) => { const x = 8 + (i % 3) * 116, y = 112 + Math.floor(i / 3) * 116; if (col) { c.fillStyle = col; c.fillRect(x, y, 112, 112); HP.icon(c, "photo", x + 56, y + 56, 40, "rgba(31,42,51,0.35)"); }
          else { c.fillStyle = "#FFFDF4"; c.fillRect(x, y, 112, 112); for (let k = 0; k < 5; k++) { c.fillStyle = "#3A4A8A"; c.fillRect(x + 14, y + 20 + k * 17, 84 - (k % 2) * 20, 6); } c.strokeStyle = RED; c.lineWidth = 5; c.strokeRect(x + 2, y + 2, 108, 108); } });
      }, { cx: 520, cy: 478, h: 600 });
      const a = b.audio || b.dur;
      ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(520, 478, 250, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(343, 301); ctx.lineTo(697, 655); ctx.stroke();
      if (after(b, l, 0.3)) badge(ctx, 900, 300, false, "HP hilang: fotonya ikut hilang", { w: 760, h: 100, size: 30 });
      if (after(b, l, 0.6)) badge(ctx, 900, 440, false, "Orang yang memegang HP-mu bisa melihatnya", { w: 760, h: 100, size: 30 });
      if (after(b, l, 0.8)) badge(ctx, 900, 580, true, "Simpan di kertas, di tempat aman", { w: 760, h: 100, size: 30 });
    },
    cadangan_selesai(ctx, b, l) {
      const span = spanOf(b), g = geo(BF, "cadangan", {}), gk = geo(BF, "keamanan", { on: true });
      const R = HP.run({ page: "cadangan", check: false, pointer: { x: 700, y: 560 } }, [{ to: pt(g.check), click: true, set: { check: true }, d: 1.2 }, { to: pt(g.selesai), click: true, set: { page: "keamanan" }, d: 1.2 }, { wait: 1, d: 0.4 }, { to: [gk.twofa.x + 300, gk.twofa.y + 50], set: { hl: "2fa" }, d: 1 }, { wait: 1, d: 1.6 }], l, span);
      browser(ctx, BF, R.st.page, { check: R.st.check, on: true, hl: R.st.hl, codesHl: false });
      steps(ctx, "LANGKAH", ["Centang kotak.", "Klik Selesai.", "Status: Aktif."], stepAt(l, span, [0.24, 0.45, 0.7]));
      if (R.st.page === "keamanan" && R.i >= 3) note(ctx, 1450, 420, "Verifikasi dua langkah: Aktif", { tx: gk.twofa.x + 520, ty: gk.twofa.y - 10, fill: C.goodBg, color: GREEN });
      pointer(ctx, R);
    },
    perangkat_buka(ctx, b, l) {
      const span = spanOf(b), g = geo(BF, "keamanan", { on: true });
      const R = HP.run({ page: "keamanan", pointer: { x: 900, y: 420 } }, [{ wait: 1, d: 0.6 }, { to: pt(g.devices), set: { hl: "devices" }, d: 1.2 }, { wait: 1, d: 0.5 }, { to: pt(g.devices), click: true, set: { page: "perangkat", hl: null }, d: 0.8 }, { wait: 1, d: 2 }], l, span);
      browser(ctx, BF, R.st.page, { on: true, hl: R.st.hl });
      steps(ctx, "LANGKAH", ["Klik Kelola perangkat.", "Lihat semua perangkat yang login."], stepAt(l, span, [0.5, 1]));
      pointer(ctx, R);
    },
    perangkat_baca(ctx, b, l) {
      const a = b.audio || b.dur; const n = l < a * 0.15 ? -1 : l < a * 0.3 ? 0 : l < a * 0.45 ? 1 : 2;
      const g = browser(ctx, BF, "perangkat", { hlRow: n });
      const items = [[true, "Laptop ini: milik Dito"], [true, "HP Dito: milik Dito"], [false, "Komputer di kota lain: bukan milik Dito!"]];
      items.forEach(([ok, s], i) => { if (i <= n) badge(ctx, 1450, 150 + i * 130, ok, s, { w: 370, h: 110, size: 23 }); });
    },
    perangkat_keluar(ctx, b, l) {
      const span = spanOf(b), g = geo(BF, "perangkat", {}), gd = geo(BF, "perangkat", { dialog: 1 });
      const R = HP.run({ pointer: { x: 900, y: 600 }, hlRow: 2 }, [{ to: pt(g.rows[2]), click: true, set: { hl: "keluar", dialog: 1 }, d: 1.3 }, { wait: 1, d: 0.6 }, { to: pt(gd.ok), click: true, set: { hl: "ok" }, d: 1.1 },
        { set: { dialog: 0, removed: true, hlRow: -1, toast: 1, hl: null }, d: 0.1 }, { wait: 1, d: 2 }], l, span);
      browser(ctx, BF, "perangkat", R.st);
      steps(ctx, "LANGKAH", ["Klik Keluarkan.", "Klik Keluarkan sekali lagi.", "Komputer itu terputus."], stepAt(l, span, [0.25, 0.55, 1]));
      pointer(ctx, R);
    },
    ganti_sandi(ctx, b, l) {
      const span = spanOf(b), g = geo(BF, "ganti_sandi", {});
      const R = HP.run({ pointer: { x: 800, y: 500 } }, [{ to: pt(g.old), click: true, set: { focus: "old" }, d: 0.8 }, { type: "kucing-angkot-hujan", field: "old", d: 1.2 },
        { to: pt(g.neu), click: true, set: { focus: "neu" }, d: 0.7 }, { type: "sepeda-kantin-biru-pagi", field: "neu", d: 1.5 }, { to: pt(g.simpan), click: true, set: { saved: true, focus: null, hl: "simpan" }, d: 1 }, { wait: 1, d: 1.5 }], l, span);
      browser(ctx, BF, "ganti_sandi", R.st);
      card(ctx, 1450, 122, 370, 470, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "ORANG ITU SEKARANG", 1635, 170, 23, { align: "center", weight: 900, color: C.accentDark });
      badge(ctx, 1470, 200, false, "kata sandi lama tidak berlaku", { w: 330, h: 100, size: 22 });
      if (after(b, l, 0.55)) badge(ctx, 1470, 320, false, "tidak punya kode dari HP Dito", { w: 330, h: 100, size: 22 });
      if (after(b, l, 0.75)) { ctx.fillStyle = C.goodBg; rr(ctx, 1470, 450, 330, 110, 14); ctx.fill(); text(ctx, "TERTAHAN", 1635, 522, 40, { align: "center", weight: 900, color: GREEN }); }
      pointer(ctx, R);
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 290, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 300, 255, 20, 70, 6); ctx.fill(); rr(ctx, 340, 255, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 275, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 322, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 390 + i * 100, 930, 84, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 444 + i * 100, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 443 + i * 100, 27, { weight: 700, fit: 820 }); });
      phone(ctx, c => HP.auth(c, { accounts: [{ ...ACC, code: CODES[0], secs: 30 - (l % 30) }] }), { cx: 1480, cy: 520, h: 520 });
      text(ctx, "dengan akunmu sendiri", 1480, 220, 24, { align: "center", weight: 800, color: C.ink2 });
    },
    periksa(ctx, b, l) {
      browser(ctx, BF, "keamanan", { on: true, devices: 2 });
      const items = [["Verifikasi dua langkah", "Aktif"], ["Kode cadangan", "di kertas"], ["Perangkat asing", "tidak ada"]];
      card(ctx, 1450, 122, 370, 120 + items.length * 110, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILMU", 1635, 172, 24, { align: "center", weight: 900, color: C.accentDark });
      const a = b.audio || b.dur;
      items.forEach(([k, v], i) => { const on = l > a * (0.2 + i * 0.2); const y = 205 + i * 110;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 1470, y, 330, 94, 12); ctx.fill();
        text(ctx, k, 1490, y + 38, 22, { weight: 800 }); text(ctx, v + (on ? " ✓" : ""), 1490, y + 74, 24, { weight: 900, color: on ? GREEN : C.ink2 }); });
    },
    salah_otp(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      text(ctx, "KESALAHAN 1: MEMBERIKAN KODE", 1290, 210, 30, { align: "center", weight: 900, color: RED });
      const ph = phone(ctx, c => HP.chat(c, { size: 22, maxW: 320, name: "Admin Akun Sekolah", sub: "nomor tidak dikenal", subColor: RED, color: "#7B8B95", warn: after(b, l, 0.3) ? 0 : null,
        messages: [{ from: "them", text: "Halo, saya petugas akun.example. Kode verifikasi sudah kami kirim ke HP-mu. Kirim kode itu ke sini supaya akunmu tidak diblokir hari ini!", time: "19.42" }] }), { cx: 470, cy: 478, h: 620 });
      if (after(b, l, 0.3)) { ctx.save(); ctx.translate(470, 570); ctx.rotate(-0.18); ctx.strokeStyle = RED; ctx.lineWidth = 7; rr(ctx, -170, -44, 340, 88, 12); ctx.stroke(); text(ctx, "PENIPUAN", 0, 20, 52, { align: "center", weight: 900, color: RED }); ctx.restore(); }
      const pts = [["minta kode", 0.4], ["mendesak: hari ini!", 0.5], ["mengaku petugas", 0.6]];
      pts.forEach(([s, f], i) => { if (after(b, l, f)) badge(ctx, 860, 260 + i * 104, false, s, { w: 620, h: 84, size: 28 }); });
      if (after(b, l, 0.72)) { card(ctx, 860, 590, 860, 110, { fill: "#E7F1FB", stroke: BLUE, lw: 3, r: 16 }); para(ctx, "Tidak ada petugas resmi yang meminta kode verifikasimu.", 890, 636, 30, 800, { weight: 900, color: C.kikoDark, lh: 1.2 }); }
    },
    salah_otp2(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      text(ctx, "YANG HARUS DILAKUKAN", 1290, 210, 30, { align: "center", weight: 900, color: GREEN });
      const a = b.audio || b.dur, u = clamp((l - a * 0.3) / 0.6, 0, 1);
      phone(ctx, c => { HP.home(c, [{ name: "Autentikator", color: BLUE, icon: "shield" }, { name: "Pesan", color: "#7B8B95", icon: "chat" }, { name: "Kamera", color: "#2E7E9A", icon: "camera" }, { name: "Pengaturan", color: "#5B6B76", icon: "gear" }]);
        if (u > 0) HP.notif(c, { app: "akun.example", icon: "school", color: BLUE, title: "Upaya login baru di Komputer", body: "Kota lain · 21.05. Apakah ini kamu?" }, u); }, { cx: 470, cy: 478, h: 620 });
      [["close", "Jangan balas pesannya", RED, 0.05], ["close", "Jangan kirim kodenya", RED, 0.15], ["key", "Ada upaya login asing? Ganti kata sandi.", BLUE, 0.55]].forEach(([ic, s, col, f], i) => {
        if (!after(b, l, f)) return; const y = 260 + i * 140; ctx.fillStyle = col === RED ? C.badBg : "#E7F1FB"; rr(ctx, 860, y, 860, 116, 18); ctx.fill();
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(920, y + 58, 32, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, 920, y + 58, 32, "#FFFFFF"); para(ctx, s, 980, y + 68 - (s.length > 34 ? 18 : 0), 32, 720, { weight: 900, color: C.ink, lh: 1.15 }); });
    },
    salah_jam(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ auto: 0, time: "07.09" }, [{ wait: 1, d: 1.6 }, { tap: [306, 198], d: 0.9 }, { anim: "auto", d: 0.5 }, { set: { time: "07.15" }, d: 0.1 }, { wait: 1, d: 1.6 }], l, span);
      card(ctx, 140, 140, 1640, 680);
      text(ctx, "KESALAHAN 2: KODE TERUS DITOLAK", 1290, 210, 30, { align: "center", weight: 900, color: RED });
      const on = R.st.auto;
      phone(ctx, c => { HP.header(c, "Tanggal dan waktu", { back: true });
        const rows = HP.list(c, [{ label: "Waktu otomatis", sub: "Pakai waktu dari jaringan", toggle: on, hl: R.i >= 1 && R.i <= 2 }, { label: "Zona waktu", sub: "WIB (GMT+7)", arrow: true }, { label: "Jam", value: R.st.time, valueColor: on >= 1 ? GREEN : RED, dim: on >= 1 }], { y: 120 });
        if (R.tap) HP.tap(c, R.tap.x, R.tap.y, R.tap.u); }, { cx: 470, cy: 478, h: 620, time: R.st.time });
      badge(ctx, 860, 270, false, "Jam di HP terlambat 6 menit: kode tidak cocok.", { w: 860, h: 104, size: 28 });
      if (after(b, l, 0.5)) badge(ctx, 860, 400, true, "Nyalakan Waktu otomatis di pengaturan tanggal dan waktu.", { w: 860, h: 120, size: 28, lines2: true });
      if (on >= 1) badge(ctx, 860, 550, true, "Jam tepat: kodenya diterima.", { w: 860, h: 104, size: 28 });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D7.3", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Latihan 1: Pengukur sandi", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d73", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "pakai contoh kata sandi rekaan saja", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Nyalakan verifikasi dua langkah di akun emailmu bersama orang tua, lalu simpan kode cadangannya di kertas.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
