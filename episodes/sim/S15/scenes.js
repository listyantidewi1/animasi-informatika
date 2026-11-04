/* S15 Simulasi praktik: mengamankan aplikasi pembayaran rekaan "Dompet Digital" di HP (layar_hp.js + layar_dompet.js).
   Tata letak sama dengan S13: HP besar di kiri (cx 560), lup di tengah (x 790–1410), panel langkah di kanan (x 1450–1820).
   Cerita menyambung F12.5: Sinta membayar jajan di Kedai Sari dengan QRIS. Semua nama, nomor, dan nominal rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, HP = K.hp, D = K.dompet;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const PC = { cx: 560, cy: 474, h: 680 };
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B", P = D.P;

  // ---------- pembantu (pola S13) ----------
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
  function badge(ctx, x, y, ok, s, opt = {}) {
    const h = opt.h || 76, w = opt.w || 500; ctx.fillStyle = ok ? C.goodBg : C.badBg; rr(ctx, x, y, w, h, 14); ctx.fill();
    ctx.fillStyle = ok ? GREEN : RED; ctx.beginPath(); ctx.arc(x + 34, y + h / 2, 19, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ok ? "check" : "close", x + 34, y + h / 2, 18, "#FFFFFF");
    const sz = opt.size || 24, lines = wrap(ctx, s, sz, 800, w - 80); lines.forEach((ln, i) => text(ctx, ln, x + 66, y + h / 2 + sz * 0.36 - (lines.length - 1) * sz * 0.6 + i * sz * 1.2, sz, { weight: 800, color: C.ink }));
  }
  const MAG = { x: 790, y: 150, w: 620 };
  function show(ctx, draw, src, opt = {}) { const ph = phone(ctx, draw, opt); const m = src ? HP.magnify(ctx, ph, draw, src, { x: opt.mx || MAG.x, y: opt.my || MAG.y, w: opt.mw || MAG.w }) : null; return { ph, m }; }
  function notes(ctx, y, list) { let yy = y + 24; list.forEach(n => { if (!n) return; const r = L.callout(ctx, 1450, yy, n.s, null, null, { size: n.size || 22, maxW: 330, fill: n.fill, color: n.color }); yy += r.h + 16; }); return yy; }
  function tapDraw(c, R) { if (R.tap) HP.tap(c, R.tap.x, R.tap.y, R.tap.u); }
  const NARROW = { mw: 480, mx: 860 };
  const OK = { notif: true, limit: "Rp100.000", tfa: true, dev: 1 };
  const HOME = [{ name: "Dompet Digital", color: P, icon: "Rp" }, { name: "Kamera", color: "#2E7E9A", icon: "camera" }, { name: "Pesan", color: "#7B8B95", icon: "chat" }, { name: "Peta", color: GREEN, icon: "map" }];
  const SEC_ROWS = o => rowsOf(D.SEC_ITEMS(o || {}), { y: D.SEC_Y });
  const secSrc = i => { const r = SEC_ROWS()[i]; return { u: 0, v: r.y - 14, w: 360, h: 112 }; };

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      [["bell", "menyalakan notifikasi transaksi"], ["calc", "mengatur batas transaksi harian"], ["shield", "mengaktifkan dua langkah"], ["warning", "melaporkan transaksi asing"]].forEach(([ic, s], i) => {
        const u = ease((l - 0.6 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 820, 84, { fill: C.bg2, r: 16 }); HP.icon(ctx, ic, 308, 322 + i * 104, 36, GREEN); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      phone(ctx, c => D.home(c, {}), { cx: 1400, cy: 480, h: 560 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 280, 640, 340, { fill: C.bg2, r: 22 });
      text(ctx, "F12.5", 580, 370, 60, { align: "center", weight: 900, color: C.kiko }); para(ctx, "Transaksi Digital yang Aman", 580, 440, 34, 560, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "tiga detik sebelum bayar", 580, 580, 26, { align: "center", weight: 600, color: C.ink2 });
      text(ctx, "Yang kita atur hari ini:", 1000, 320, 28, { weight: 900 });
      [["bell", "Notifikasi transaksi"], ["calc", "Batas harian"], ["lock", "PIN dan sidik jari"], ["shield", "Verifikasi dua langkah"], ["clock", "Riwayat dan perangkat"]].forEach(([ic, s], i) => {
        const u = ease((l - 0.5 - i * 0.5) / 0.4); if (u <= 0) return; ctx.globalAlpha = u; const y = 350 + i * 62;
        ctx.fillStyle = "#E3EEFA"; ctx.beginPath(); ctx.arc(1030, y + 24, 22, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, 1030, y + 24, 24, BLUE); text(ctx, s, 1066, y + 33, 26, { weight: 800 }); ctx.globalAlpha = 1; });
      card(ctx, 460, 680, 1000, 64, { fill: "#FFF3D6", r: 14 }); text(ctx, "Tampilan aplikasi pembayaranmu bisa sedikit berbeda.", 960, 722, 26, { align: "center", weight: 800, color: C.accentDark, fit: 960 });
    },
    buka_keamanan(ctx, b, l) {
      const span = spanOf(b), pr = rowsOf(D.PROF_ITEMS(), { y: 206 });
      const R = HP.run({ scr: "home" }, [{ wait: 1, d: 0.6 }, { tap: D.TAB.Profil, set: { scr: "prof" }, d: 1 }, { wait: 1, d: 0.6 }, { tap: tapRow(pr, 0), set: { scr: "sec" }, d: 1 }, { wait: 1, d: 2 }], l, span);
      const st = R.st;
      show(ctx, c => { if (st.scr === "home") D.home(c, { tabHl: R.i >= 1 ? "Profil" : null }); else if (st.scr === "prof") D.profile(c, { hl: R.i >= 3 ? 0 : null }); else D.security(c, {}); tapDraw(c, R); },
        st.scr === "home" ? { u: 0, v: 520, w: 360, h: 210 } : st.scr === "prof" ? { u: 0, v: 110, w: 360, h: 260 } : { u: 0, v: 110, w: 360, h: 460 }, st.scr === "sec" ? NARROW : {});
      const y = steps(ctx, "LANGKAH", ["Tap Profil di kanan bawah.", "Tap Keamanan."], stepAt(l, span, [0.3, 0.62]));
      if (st.scr !== "home") notes(ctx, y, [{ s: "Di aplikasi lain: Akun, lalu Keamanan dan privasi.", fill: "#E7F1FB", color: BLUE }]);
    },
    lihat_keamanan(ctx, b, l) {
      const hl = after(b, l, 0.68) ? 3 : after(b, l, 0.38) ? 1 : after(b, l, 0.12) ? 0 : null;
      show(ctx, c => D.security(c, { hl }), { u: 0, v: 110, w: 360, h: 460 }, NARROW);
      card(ctx, 1450, 122, 370, 70, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "MASIH PERLU DIUBAH", 1474, 166, 24, { weight: 900, color: C.accentDark });
      notes(ctx, 186, [after(b, l, 0.12) && { s: "Notifikasi transaksi: Mati", fill: C.badBg, color: RED }, after(b, l, 0.38) && { s: "Batas harian: Rp2.000.000", fill: C.badBg, color: RED },
        after(b, l, 0.68) && { s: "Verifikasi dua langkah: Mati", fill: C.badBg, color: RED }]);
    },
    notif_nyala(ctx, b, l) {
      const span = spanOf(b), sr = SEC_ROWS(), nr = rowsOf(D.NOTIF_ITEMS(), { y: 112 });
      const R = HP.run({ scr: "sec", a: 0, b: 0 }, [{ wait: 1, d: 0.3 }, { tap: tapRow(sr, 0), set: { scr: "notif" }, d: 1 }, { wait: 1, d: 0.3 }, { tap: [nr[1].toggle.x, nr[1].toggle.y], d: 0.8 }, { anim: "a", d: 0.5 }, { wait: 1, d: 0.6 },
        { tap: [nr[2].toggle.x, nr[2].toggle.y], d: 0.8 }, { anim: "b", d: 0.5 }, { wait: 1, d: 1.5 }], l, span);
      const st = R.st;
      show(ctx, c => { if (st.scr === "sec") D.security(c, { hl: R.i >= 1 ? 0 : null }); else D.notifPage(c, { a: R.i >= 4 ? st.a : 0, b: R.i >= 7 ? st.b : 0, hl: R.i >= 6 ? 2 : R.i >= 3 ? 1 : null }); tapDraw(c, R); },
        st.scr === "sec" ? secSrc(0) : { u: 0, v: 104, w: 360, h: 290 });
      const y = steps(ctx, "LANGKAH", ["Tap Notifikasi transaksi.", "Nyalakan Setiap transaksi.", "Nyalakan Login di perangkat baru."], stepAt(l, span, [0.2, 0.47, 0.75]));
      if (after(b, l, 0.8)) notes(ctx, y, [{ s: "Biarkan promo mati, supaya notifikasi penting tidak tenggelam.", fill: "#E7F1FB", color: BLUE }]);
    },
    notif_contoh(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ scr: "pay", n: "" }, [{ wait: 1, d: 0.8 }, { tap: [180, 378], set: { scr: "pin" }, d: 0.9 }, { numpad: "582049", field: "n", d: 2 }, { set: { scr: "paid" }, d: 0.1 }, { wait: 1, d: 0.4 }, { anim: "nu", d: 0.6 }, { wait: 1, d: 2.2 }], l, span);
      const st = R.st;
      show(ctx, c => {
        if (st.scr === "pay") D.payPage(c, { hl: after(b, l, 0.05), btnHl: R.i >= 1 });
        else if (st.scr === "pin") D.pinPad(c, { n: (st.n || "").length, press: st.press, pressU: st.pressU });
        else { D.paid(c); if (R.i >= 5) HP.notif(c, D.NOTIF_PAY, st.nu); }
        tapDraw(c, R);
      }, st.scr === "pay" ? { u: 0, v: 116, w: 360, h: 300 } : st.scr === "pin" ? { u: 0, v: 140, w: 360, h: 160 } : { u: 0, v: 36, w: 360, h: 140 });
      const y = steps(ctx, "LANGKAH", ["Periksa nama dan nominal.", "Tap Bayar, lalu masukkan PIN.", "Baca notifikasinya."], stepAt(l, span, [0.15, 0.55, 0.95]));
      if (st.scr === "paid" && R.i >= 5) notes(ctx, y, [{ s: "Notifikasi yang tidak kamu kenal adalah tanda bahaya.", fill: "#FFF3D6", color: C.accent }]);
    },
    batas_atur(ctx, b, l) {
      const span = spanOf(b), sr = SEC_ROWS({ notif: true }), lr = measure(m => D.limitPage(m, { pick: 3 })).rows;
      const R = HP.run({ scr: "sec", pick: 3 }, [{ wait: 1, d: 0.5 }, { tap: tapRow(sr, 1), set: { scr: "lim" }, d: 1 }, { wait: 1, d: 1.6 }, { tap: tapRow(lr, 1, 100), set: { pick: 1 }, d: 1 }, { wait: 1, d: 1.6 }], l, span);
      const st = R.st;
      show(ctx, c => { if (st.scr === "sec") D.security(c, { notif: true, hl: R.i >= 1 ? 1 : null }); else D.limitPage(c, { pick: st.pick, hl: R.i >= 3 ? 1 : null }); tapDraw(c, R); },
        st.scr === "sec" ? secSrc(1) : { u: 0, v: 110, w: 360, h: 460 }, st.scr === "sec" ? {} : NARROW);
      const y = steps(ctx, "LANGKAH", ["Tap Batas transaksi harian.", "Pilih Rp100.000."], stepAt(l, span, [0.3, 0.75]));
      if (st.scr === "lim") notes(ctx, y, [after(b, l, 0.4) && { s: "Pilih secukupnya untuk kebutuhan sehari.", fill: "#E7F1FB", color: BLUE }]);
    },
    batas_pin(ctx, b, l) {
      const span = spanOf(b), bt = measure(m => D.limitPage(m, { pick: 1 })).btn;
      const R = HP.run({ scr: "lim", n: "" }, [{ wait: 1, d: 0.3 }, { tap: [bt.cx, bt.cy], set: { scr: "pin" }, d: 0.9 }, { numpad: "582049", field: "n", d: 1.8 }, { set: { scr: "sec" }, d: 0.1 }, { anim: "toast", d: 1.6 }, { wait: 1, d: 1.6 }], l, span);
      const st = R.st;
      show(ctx, c => {
        if (st.scr === "lim") D.limitPage(c, { pick: 1, btnHl: R.i >= 1 });
        else if (st.scr === "pin") D.pinPad(c, { title: "Konfirmasi dengan PIN", n: (st.n || "").length, press: st.press, pressU: st.pressU });
        else { D.security(c, { notif: true, limit: "Rp100.000", hl: 1 }); HP.toast(c, "Batas harian disimpan.", st.toast || 0, { y: 520 }); }
        tapDraw(c, R);
      }, st.scr === "lim" ? { u: 0, v: 470, w: 360, h: 130 } : st.scr === "pin" ? { u: 0, v: 140, w: 360, h: 160 } : secSrc(1));
      const y = steps(ctx, "LANGKAH", ["Tap Simpan.", "Masukkan PIN."], stepAt(l, span, [0.15, 0.5]));
      card(ctx, 790, 520, 620, 290, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "KALAU AKUN DICURI", 1100, 562, 24, { align: "center", weight: 900, color: C.accentDark });
      if (after(b, l, 0.45)) badge(ctx, 810, 584, false, "tanpa batas: bisa hilang Rp2.000.000 sehari", { w: 580, h: 96, size: 23 });
      if (after(b, l, 0.68)) badge(ctx, 810, 696, true, "dengan batas: paling banyak Rp100.000", { w: 580, h: 96, size: 23 });
    },
    pin_ganti(ctx, b, l) {
      const span = spanOf(b), sr = SEC_ROWS(OK), br = rowsOf(D.BIO_ITEMS(), { y: 112 });
      const R = HP.run({ scr: "sec", n: "" }, [{ wait: 1, d: 0.3 }, { tap: tapRow(sr, 2), set: { scr: "bio" }, d: 1 }, { wait: 1, d: 0.3 }, { tap: tapRow(br, 0), set: { scr: "pin" }, d: 1 }, { numpad: "730194", field: "n", d: 2.6 }, { wait: 1, d: 1.6 }], l, span);
      const st = R.st;
      show(ctx, c => {
        if (st.scr === "sec") D.security(c, { notif: true, limit: "Rp100.000", hl: R.i >= 1 ? 2 : null });
        else if (st.scr === "bio") D.bioPage(c, { hl: R.i >= 3 ? 0 : null });
        else D.pinPad(c, { title: "Buat PIN baru", sub: "Enam angka yang sulit ditebak", n: (st.n || "").length, press: st.press, pressU: st.pressU });
        tapDraw(c, R);
      }, st.scr === "sec" ? secSrc(2) : st.scr === "bio" ? { u: 0, v: 104, w: 360, h: 160 } : { u: 0, v: 140, w: 360, h: 160 });
      const y = steps(ctx, "LANGKAH", ["Tap PIN dan biometrik.", "Tap Ganti PIN.", "Ketik enam angka baru."], stepAt(l, span, [0.2, 0.4, 0.9]));
      card(ctx, 790, 470, 620, 330, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PIN YANG BAIK", 1100, 512, 24, { align: "center", weight: 900, color: C.accentDark });
      if (after(b, l, 0.45)) badge(ctx, 810, 536, true, "sulit ditebak, berbeda dari PIN lain", { w: 580, h: 74, size: 24 });
      if (after(b, l, 0.62)) badge(ctx, 810, 620, false, "tanggal lahir, misalnya 120807", { w: 580, h: 74, size: 24 });
      if (after(b, l, 0.76)) badge(ctx, 810, 704, false, "angka berurutan: 123456", { w: 580, h: 74, size: 24 });
    },
    biometrik(ctx, b, l) {
      const span = spanOf(b), br = rowsOf(D.BIO_ITEMS(), { y: 112 });
      const R = HP.run({ fp: 0, lock: 0 }, [{ wait: 1, d: 0.4 }, { tap: [br[2].toggle.x, br[2].toggle.y], d: 0.8 }, { anim: "fp", d: 0.5 }, { wait: 1, d: 0.8 }, { tap: [br[3].toggle.x, br[3].toggle.y], d: 0.8 }, { anim: "lock", d: 0.5 }, { wait: 1, d: 2.2 }], l, span);
      const st = R.st;
      show(ctx, c => { D.bioPage(c, { fp: R.i >= 2 ? st.fp : 0, lock: R.i >= 5 ? st.lock : 0, hl: R.i >= 4 ? 3 : R.i >= 1 ? 2 : null }); tapDraw(c, R); }, { u: 0, v: 104, w: 360, h: 300 });
      const y = steps(ctx, "LANGKAH", ["Nyalakan Sidik jari untuk membayar.", "Nyalakan Minta PIN saat membuka aplikasi."], stepAt(l, span, [0.3, 0.6]));
      if (after(b, l, 0.65)) notes(ctx, y, [{ s: "HP dipinjam teman? Dompet tetap terkunci.", fill: C.goodBg, color: GREEN }]);
    },
    dua_langkah(ctx, b, l) {
      const span = spanOf(b), sr = SEC_ROWS(OK), tr = measure(m => D.tfaPage(m, {}));
      const R = HP.run({ scr: "sec", on: 0, code: "" }, [{ wait: 1, d: 0.3 }, { tap: tapRow(sr, 3), set: { scr: "tfa" }, d: 1 }, { wait: 1, d: 0.4 }, { tap: [tr[0].toggle.x, tr[0].toggle.y], set: { scr: "otp" }, d: 0.9 },
        { anim: "nu", d: 0.5 }, { numpad: "482913", field: "code", d: 2.2 }, { set: { scr: "tfa2" }, d: 0.1 }, { anim: "on", d: 0.4 }, { wait: 1, d: 1.6 }], l, span);
      const st = R.st;
      show(ctx, c => {
        if (st.scr === "sec") D.security(c, { notif: true, limit: "Rp100.000", hl: R.i >= 1 ? 3 : null });
        else if (st.scr === "tfa") D.tfaPage(c, { on: 0, hl: R.i >= 3 });
        else if (st.scr === "otp") { D.otpPage(c, { code: st.code, press: st.press, pressU: st.pressU }); HP.notif(c, D.SMS, R.i >= 4 ? (R.i === 4 ? st.nu : 1) : 0); }
        else D.tfaPage(c, { on: st.on || 0 });
        tapDraw(c, R);
      }, st.scr === "sec" ? secSrc(3) : st.scr === "otp" ? { u: 0, v: 36, w: 360, h: 230 } : { u: 0, v: 230, w: 360, h: 210 });
      const y = steps(ctx, "LANGKAH", ["Tap Verifikasi dua langkah.", "Nyalakan sakelarnya.", "Ketik kode OTP dari SMS."], stepAt(l, span, [0.2, 0.38, 0.8]));
      if (st.scr === "tfa2") notes(ctx, y, [{ s: "Login di HP baru: kode OTP + PIN", fill: C.goodBg, color: GREEN }]);
    },
    otp_rahasia(ctx, b, l) {
      const draw = c => D.smsChat(c, { warn: after(b, l, 0.25) ? 0 : null });
      const ph = phone(ctx, draw);
      const bub = measure(m => D.smsChat(m, {}))[0];
      HP.magnify(ctx, ph, draw, { u: 0, v: bub.y - 8, w: 360, h: bub.h + 16 }, { x: 790, y: 150, w: 620 });
      if (after(b, l, 0.45)) badge(ctx, 790, 560, true, "Kode OTP hanya kamu ketik sendiri di aplikasi.", { w: 620, h: 96, size: 25 });
      if (after(b, l, 0.65)) badge(ctx, 790, 672, false, "Jangan diberikan kepada siapa pun, termasuk petugas.", { w: 620, h: 96, size: 25 });
      notes(ctx, 120, [{ s: "SMS resmi saat kamu login atau menyalakan dua langkah", fill: "#E7F1FB", color: BLUE }]);
    },
    riwayat(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ scr: "home" }, [{ wait: 1, d: 0.4 }, { tap: D.TAB.Riwayat, set: { scr: "hist" }, d: 1 }, { wait: 1, d: 4 }], l, span);
      const hl = after(b, l, 0.62) ? "game" : after(b, l, 0.48) ? "isi" : after(b, l, 0.3) ? "kedai" : null;
      show(ctx, c => { if (R.st.scr === "home") D.home(c, { tabHl: R.i >= 1 ? "Riwayat" : null }); else D.history(c, { hl }); tapDraw(c, R); },
        R.st.scr === "home" ? { u: 0, v: 520, w: 360, h: 210 } : { u: 0, v: 104, w: 360, h: 420 }, R.st.scr === "home" ? {} : NARROW);
      const y = steps(ctx, "LANGKAH", ["Tap Riwayat.", "Cocokkan dengan ingatanmu."], stepAt(l, span, [0.25, 1]));
      notes(ctx, y, [after(b, l, 0.3) && { s: "Kedai Sari: jajan kemarin", fill: C.goodBg, color: GREEN }, after(b, l, 0.48) && { s: "Isi saldo: dari rekening ibu", fill: C.goodBg, color: GREEN },
        after(b, l, 0.62) && { s: "Voucher game pukul 02.13: bukan Sinta!", fill: C.badBg, color: RED }]);
    },
    perangkat(ctx, b, l) {
      const span = spanOf(b), sr = SEC_ROWS(OK), dv = measure(m => D.devPage(m, { dialog: 1 }));
      const R = HP.run({ scr: "sec" }, [{ wait: 1, d: 0.3 }, { tap: tapRow(sr, 4), set: { scr: "dev" }, d: 1 }, { wait: 1, d: 1.6 }, { tap: [dv.btn.cx, dv.btn.cy], set: { dialog: 1 }, d: 0.9 }, { wait: 1, d: 0.3 },
        { tap: [dv.dlg.buttons[1].cx, dv.dlg.buttons[1].cy], set: { gone: true, dialog: 0 }, d: 0.9 }, { anim: "toast", d: 1.6 }, { wait: 1, d: 0.8 }], l, span);
      const st = R.st;
      show(ctx, c => {
        if (st.scr === "sec") D.security(c, { notif: true, limit: "Rp100.000", tfa: true, hl: R.i >= 1 ? 4 : null });
        else { D.devPage(c, { hl: !st.gone && after(b, l, 0.25), btnHl: R.i === 3, dialog: st.dialog, okHl: R.i >= 5, gone: st.gone }); if (st.gone) HP.toast(c, "Perangkat dikeluarkan.", st.toast || 0, { y: 520 }); }
        tapDraw(c, R);
      }, st.scr === "sec" ? secSrc(4) : st.dialog ? { u: 0, v: dv.dlg.box.y - 10, w: 360, h: dv.dlg.box.h + 20 } : { u: 0, v: 104, w: 360, h: 340 }, st.scr === "dev" && !st.dialog ? NARROW : {});
      const y = steps(ctx, "LANGKAH", ["Tap Perangkat terhubung.", "Tap Keluarkan di HP asing.", "Ganti PIN-mu."], stepAt(l, span, [0.2, 0.62, 0.9]));
      if (st.scr === "dev" && !st.gone && after(b, l, 0.25)) notes(ctx, y, [{ s: "Login semalam dari kota lain: bukan Sinta", fill: C.badBg, color: RED }]);
      if (st.gone) notes(ctx, y, [{ s: "Lalu ganti PIN, seperti tadi.", fill: "#E7F1FB", color: BLUE }]);
    },
    lapor(ctx, b, l) {
      const span = spanOf(b), hr = rowsOf(D.HIST(), { y: 112 }), dt = measure(m => D.detail(m, {})), rp = measure(m => D.reportPage(m, { pick: 0 }));
      const R = HP.run({ scr: "hist" }, [{ wait: 1, d: 1.0 }, { tap: tapRow(hr, 1), set: { scr: "det" }, d: 1 }, { wait: 1, d: 0.6 }, { tap: [dt.cx, dt.cy], set: { scr: "rep" }, d: 1 }, { wait: 1, d: 0.3 },
        { tap: tapRow(rp.rows, 0, 120), set: { pick: 0 }, d: 1 }, { tap: [rp.btn.cx, rp.btn.cy], set: { scr: "done" }, d: 1 }, { wait: 1, d: 1.4 }], l, span);
      const st = R.st;
      show(ctx, c => {
        if (st.scr === "hist") D.history(c, { hl: "game" });
        else if (st.scr === "det") D.detail(c, { hl: R.i >= 3 });
        else if (st.scr === "rep") D.reportPage(c, { pick: st.pick, hl: R.i >= 5 ? 0 : null, btnHl: R.i >= 6 });
        else D.reported(c);
        tapDraw(c, R);
      }, st.scr === "hist" ? { u: 0, v: 104, w: 360, h: 160 } : st.scr === "det" ? { u: 0, v: 200, w: 360, h: 310 } : st.scr === "rep" ? { u: 0, v: 120, w: 360, h: 360 } : { u: 0, v: 150, w: 360, h: 330 }, st.scr === "hist" ? {} : { mw: 520, mx: 840 });
      const y = steps(ctx, "LANGKAH", ["Tap transaksi asing.", "Tap Laporkan masalah.", "Pilih alasannya, lalu Kirim."], stepAt(l, span, [0.3, 0.5, 0.82]));
      if (st.scr === "done") notes(ctx, y, [{ s: "Simpan nomor laporan, lalu beri tahu orang tua.", fill: C.goodBg, color: GREEN },
        after(b, l, 0.88) && { s: "Pakai nomor resmi di menu Bantuan. Pengaduan konsumen: Kontak OJK 157.", fill: "#E7F1FB", color: BLUE, size: 20 }]);
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 270, 64, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 292, 238, 18, 64, 6); ctx.fill(); rr(ctx, 330, 238, 18, 64, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 258, 44, { weight: 900, color: C.accentDark }); text(ctx, "Bersama orang tua, tanpa membuka saldo atau PIN.", 430, 304, 28, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 360 + i * 88, 930, 74, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 409 + i * 88, 32, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 408 + i * 88, 27, { weight: 700, fit: 820 }); });
      phone(ctx, c => D.security(c, {}), { cx: 1460, cy: 500, h: 560 });
    },
    periksa(ctx, b, l) {
      phone(ctx, c => D.security(c, OK));
      const items = [["Notifikasi transaksi", "aktif"], ["Batas harian", "Rp100.000"], ["PIN dan dua langkah", "aktif"], ["Perangkat asing", "tidak ada"]];
      card(ctx, 900, 122, 920, 120 + items.length * 108, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILMU", 1360, 172, 26, { align: "center", weight: 900, color: C.accentDark });
      const a = b.audio || b.dur;
      items.forEach(([k, v], i) => { const on = l > a * (0.2 + i * 0.18); const y = 196 + i * 100;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 925, y, 870, 86, 12); ctx.fill();
        text(ctx, k, 950, y + 54, 28, { weight: 800 }); text(ctx, v + (on ? " ✓" : ""), 1770, y + 54, 28, { align: "right", weight: 900, color: on ? GREEN : C.ink2 }); });
    },
    tipu_otp(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      text(ctx, "TANDA PENIPUAN 1: MEMINTA KODE OTP", 1290, 210, 30, { align: "center", weight: 900, color: RED });
      phone(ctx, c => HP.chat(c, { size: 21, maxW: 320, name: "Petugas Dompet Digital", sub: "nomor tidak dikenal", subColor: RED, color: "#7B8B95", warn: after(b, l, 0.3) ? 0 : null,
        messages: [{ from: "them", text: "Halo Kak, kami dari Dompet Digital. Akun Kakak akan diblokir hari ini. Kirim kode OTP yang baru masuk supaya akun tetap aktif!", time: "19.42" }] }), { cx: 470, cy: 478, h: 620 });
      if (after(b, l, 0.3)) { ctx.save(); ctx.translate(470, 600); ctx.rotate(-0.18); ctx.strokeStyle = RED; ctx.lineWidth = 7; rr(ctx, -170, -44, 340, 88, 12); ctx.stroke(); text(ctx, "PENIPUAN", 0, 20, 52, { align: "center", weight: 900, color: RED }); ctx.restore(); }
      [["meminta kode OTP", 0.35], ["mendesak: diblokir hari ini", 0.45], ["mengaku petugas", 0.55]].forEach(([s, f], i) => { if (after(b, l, f)) badge(ctx, 860, 260 + i * 104, false, s, { w: 620, h: 84, size: 28 }); });
      if (after(b, l, 0.7)) { card(ctx, 860, 590, 860, 110, { fill: "#E7F1FB", stroke: BLUE, lw: 3, r: 16 }); para(ctx, "Petugas resmi tidak pernah meminta OTP atau PIN-mu.", 890, 636, 30, 800, { weight: 900, color: C.kikoDark, lh: 1.2 }); }
    },
    tipu_hadiah(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      text(ctx, "TANDA PENIPUAN 2: TAUTAN HADIAH", 1290, 210, 30, { align: "center", weight: 900, color: RED });
      phone(ctx, c => HP.chat(c, { size: 21, maxW: 320, name: "Info Hadiah", sub: "nomor tidak dikenal", subColor: RED, color: "#C98A57", warn: after(b, l, 0.3) ? 0 : null,
        messages: [{ from: "them", text: "SELAMAT! Nomor Kakak menang saldo Rp1.000.000. Klaim sebelum jam 12 malam di hadiahku.example lalu login dengan PIN.", time: "20.15" }] }), { cx: 470, cy: 478, h: 620 });
      [["hadiah tanpa ikut lomba", 0.2], ["tautan asing, bukan aplikasi resmi", 0.35], ["meminta login dan PIN", 0.5]].forEach(([s, f], i) => { if (after(b, l, f)) badge(ctx, 860, 260 + i * 104, false, s, { w: 620, h: 84, size: 28 }); });
      if (after(b, l, 0.68)) { card(ctx, 860, 590, 860, 110, { fill: C.goodBg, stroke: GREEN, lw: 3, r: 16 }); para(ctx, "Jangan buka tautannya. Hapus pesannya, lalu laporkan.", 890, 636, 30, 800, { weight: 900, color: "#1E6B3E", lh: 1.2 }); }
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F12.5", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Latihan 2: Detektif pesan penipuan", 620, 410, 28, { align: "center", weight: 700, color: C.ink2, fit: 600 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f125", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "temukan empat tanda bahaya", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Bersama orang tua, periksa notifikasi, batas transaksi, dan dua langkah di satu aplikasi pembayaran, tanpa membuka saldo atau PIN.", 1310, 420, 28, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
