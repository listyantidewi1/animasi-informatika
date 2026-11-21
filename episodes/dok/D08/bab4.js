/* D08 bab 4 — BOSS 2: APK yang minta izin aneh-aneh (b4_1 … b4_6). Berkas APK + HP Android generik, pesan "undangan" vs "GTA 6",
   dialog izin satu per satu, OTP SMS yang disalin ke server, layar login palsu menutupi aplikasi bank, Raka menekan Batal. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = U.TAU, TY = 168;

  // layar HP: beranda gelap dengan ikon aplikasi
  function beranda(c, w, h, t) { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#2A1050"); gr.addColorStop(1, "#0E0A24"); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    const cols = [N.cyan, N.pink, N.gold, N.green, N.violet, N.orange]; for (let i = 0; i < 12; i++) { const x = w * (0.16 + (i % 4) * 0.23), y = h * (0.14 + Math.floor(i / 4) * 0.13); c.fillStyle = D.hexA(cols[i % 6], 0.55); RR(c, x - w * 0.08, y - w * 0.08, w * 0.16, w * 0.16, w * 0.04); c.fill(); } }
  // dialog izin di tengah layar HP
  U.dialogIzin = function (c, w, h, judul, isi, k, o = {}) {
    if (k <= 0) return; c.save(); c.globalAlpha *= clamp(k * 2); c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(0, 0, w, h);
    const s = lerp(0.85, 1, eout(k)), dh = h * 0.44, y = h * 0.5 - dh / 2 + (o.dy || 0); c.translate(w / 2, h / 2); c.scale(s, s); c.translate(-w / 2, -h / 2);
    c.fillStyle = "#F4F1FA"; RR(c, w * 0.06, y, w * 0.88, dh, 26); c.fill();
    if (o.ikon) U.bahaya(c, w / 2, y + dh * 0.15, w * 0.13, N.red);
    const f = w * 0.095; let yy = y + dh * (o.ikon ? 0.34 : 0.2); judul.split("\n").forEach(s => { txt(c, s, w / 2, yy, f, { align: "center", weight: 900, color: "#1A0E36", fit: w * 0.8 }); yy += f * 1.25; });
    if (isi) isi.split("\n").forEach(s => { txt(c, s, w / 2, yy + f * 0.2, f * 0.82, { align: "center", weight: 700, color: "#5A4F80", fit: w * 0.8 }); yy += f * 1.05; });
    const by = y + dh * 0.8, pr = o.tekan || 0;
    c.fillStyle = pr > 0 ? D.hexA(N.cyan, 0.25 + 0.4 * Math.sin(pr * Math.PI)) : "rgba(0,0,0,0)"; RR(c, w * 0.1, by - f * 0.9, w * 0.38, f * 1.5, 14); c.fill();
    txt(c, o.batal || "Batal", w * 0.29, by + f * 0.1, f, { align: "center", weight: 900, color: "#2B6CB0" });
    txt(c, o.izin || "Izinkan", w * 0.71, by + f * 0.1, f, { align: "center", weight: 900, color: o.izinCol || "#2B6CB0" }); c.restore();
  };

  S.b4_1 = function (ctx, b, l, t) {
    const tNet = D.at(b, "Netcraft"), tApk = D.at(b, "GTA 6 APK"), tAnd = D.at(b, "langsung di Android"), tTid = D.at(b, "tidak pernah ada");
    U.ruang(ctx, t, { col: N.green, gx: 1300, gy: 380 });
    const pa = U.pop(l, tApk - 0.3); if (pa.a > 0) { ctx.save(); ctx.globalAlpha *= pa.a; U.berkas(ctx, 640, 500, 320 * lerp(0.7, 1, pa.sp), { jenis: "apk", t, mata: true, nama: "\"GTA 6 APK\"", size: 56 }); ctx.restore(); }
    const ha = ramp(l, tAnd - 0.3, 0.5); if (ha > 0) { ctx.save(); ctx.globalAlpha *= ha; U.hp(ctx, 1320, 560, 640, beranda, { t }); ctx.restore(); U.panah(ctx, 840, 520, 1110, 540, N.green, ramp(l, tAnd, 0.5), 8, { dash: [16, 12] }); }
    const st = U.pop(l, tTid); if (st.a > 0) { ctx.save(); ctx.globalAlpha *= st.a; ctx.translate(960, 820); ctx.rotate(-0.06); const k = lerp(1.5, 1, st.sp); ctx.scale(k, k);
      ctx.fillStyle = "rgba(20,4,20,0.9)"; ctx.strokeStyle = N.red; ctx.lineWidth = 7; RR(ctx, -500, -64, 1000, 128, 18); ctx.fill(); ctx.stroke(); txt(ctx, "GTA 6 untuk HP tidak pernah ada", 0, 18, 54, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
    D.post(c => { U.sumber(c, l, tNet, "Netcraft"); U.judulPop(c, "Penipuan kedua menyasar HP", W / 2, TY, 60, l, 0.3, { col: N.green }); });
  };

  S.b4_2 = function (ctx, b, l, t) {
    const tInd = D.at(b, "Di Indonesia"), tUnd = D.at(b, "undangan pernikahan"), tPol = D.at(b, "Polanya sama"), tDul = D.at(b, "Dulu undangan"), tSek = D.at(b, "sekarang game");
    U.ruang(ctx, t, { col: N.green, gx: 960, gy: 380 });
    const u1 = ramp(l, tUnd - 0.3, 0.5), u2 = ramp(l, tSek - 0.3, 0.5), sh = eio(ramp(l, tPol - 0.4, 0.8));
    U.hp(ctx, lerp(960, 560, sh), 600, 860, U.layarGrup("Pesan", "Undangan.apk", "undangan", "apk", u1, { pesan: "Datang ya!" }), { t });
    if (sh > 0) { ctx.save(); ctx.globalAlpha *= sh; U.hp(ctx, 1360, 600, 860, U.layarGrup("Pesan", "GTA6_HP.apk", "GTA 6", "apk", u2, { pesan: "GTA 6 HP gratis!", mata: true }), { t }); ctx.restore();
      U.panah(ctx, 820, 600, 1100, 600, N.gold, ramp(l, tPol, 0.5), 9); }
    D.post(c => { U.tag(c, "Dulu", lerp(960, 560, sh), 140, l, tDul - 0.2, { col: N.violet, size: 52 }); U.tag(c, "Sekarang", 1360, 140, l, tSek - 0.2, { col: N.red, size: 52 });
      U.judulPop(c, "Modus lama, umpan baru", W / 2, TY, 60, l, 0.3, { col: N.green, a: 1 - ramp(l, tDul - 0.6, 0.3) }); });
  };

  S.b4_3 = function (ctx, b, l, t) {
    const tPas = D.at(b, "Setelah dipasang"), tIz = D.at(b, "meminta izin"), tSMS = D.at(b, "membaca SMS"), tAks = D.at(b, "izin Aksesibilitas"), tLih = D.at(b, "melihat layar"), tTek = D.at(b, "menekan tombol");
    U.ruang(ctx, t, { col: N.red, gx: 1400, gy: 380 });
    const D1 = ["Pasang aplikasi dari\nsumber tak dikenal?", "Izinkan aplikasi\nmembaca SMS?", "Aktifkan\nAksesibilitas?"], T = [tPas, tSMS - 0.3, tAks - 0.3];
    U.hp(ctx, 640, 590, 880, (c, w, h, tt) => { beranda(c, w, h, tt); let cur = -1; T.forEach((t0, i) => { if (l > t0) cur = i; });
      if (cur >= 0) U.dialogIzin(c, w, h, D1[cur], cur === 2 ? "kendali penuh layar" : "", ramp(l, T[cur], 0.35), { ikon: cur > 0 }); }, { t });
    // daftar izin di kanan
    const L = [["sumber tak dikenal", T[0]], ["membaca SMS", T[1]], ["Aksesibilitas", T[2]]];
    L.forEach(([s, t0], i) => { const p = U.pop(l, t0 + 0.4); if (p.a <= 0) return; ctx.save(); ctx.globalAlpha *= p.a; const y = 360 + i * 150; U.panel(ctx, 1100, y - 60, 640, 116, { col: i ? N.red : N.gold, r: 20 }); U.bahaya(ctx, 1170, y, 64, i ? N.red : N.gold); txt(ctx, s, 1230, y + 18, 50, { weight: 900 }); ctx.restore(); });
    const ak = ramp(l, tLih - 0.2, 0.4); if (ak > 0) { ctx.save(); ctx.globalAlpha *= ak; txt(ctx, "bisa melihat layarmu", 1400, 800, 46, { align: "center", weight: 800, color: N.ink }); txt(ctx, "dan menekan tombol atas namamu", 1400, 856, 44, { align: "center", weight: 800, color: l > tTek ? N.red : N.ink }); ctx.restore(); }
    D.post(c => U.judulPop(c, "Izin yang tidak masuk akal untuk sebuah game", W / 2, TY, 58, l, tIz - 0.3, { col: N.red }));
  };

  S.b4_4 = function (ctx, b, l, t) {
    const tOTP = D.at(b, "kode OTP dari bank"), tSer = D.at(b, "Sering kali"), tNam = D.at(b, "nama pengguna"), tBut = D.at(b, "Yang mereka butuhkan"), tKun = D.at(b, "kunci terakhir"), tMb = D.at(b, "m-banking");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 380 });
    const otp = ramp(l, tOTP - 0.4, 0.4);
    U.hp(ctx, 460, 590, 820, (c, w, h, tt) => { beranda(c, w, h, tt); if (otp <= 0) return; c.save(); c.globalAlpha *= otp; c.translate(0, (1 - eout(otp)) * -80);
      c.fillStyle = "#F4F1FA"; RR(c, w * 0.05, h * 0.05, w * 0.9, h * 0.2, 20); c.fill(); txt(c, "SMS · Bank", w * 0.1, h * 0.1, w * 0.075, { weight: 800, color: "#5A4F80" });
      txt(c, "Kode OTP: 482913", w * 0.1, h * 0.18, w * 0.11, { weight: 900, color: "#1A0E36", fit: w * 0.8 }); c.restore(); }, { t });
    // salinan OTP terbang ke server penipu
    const fl = eio(ramp(l, tOTP + 0.8, 1.2)); if (fl > 0 && fl < 1) { ctx.save(); const x = lerp(460, 1500, fl), y = lerp(330, 380, fl) - Math.sin(fl * Math.PI) * 120; ctx.fillStyle = N.gold; ctx.shadowColor = N.gold; ctx.shadowBlur = 16; RR(ctx, x - 110, y - 36, 220, 72, 16); ctx.fill(); txt(ctx, "482913", x, y + 16, 44, { align: "center", weight: 900, color: "#1A0E36" }); ctx.restore(); }
    U.server(ctx, 1500, 440, 220, N.red, t); ctx.save(); ctx.globalAlpha *= ramp(l, tOTP + 0.6, 0.3); txt(ctx, "server penipu", 1500, 620, 44, { align: "center", weight: 800, color: N.red }); ctx.restore();
    // kunci-kunci yang sudah dipegang penipu
    const kn = ramp(l, tNam - 0.3, 0.4); if (kn > 0) { ctx.save(); ctx.globalAlpha *= kn; [["nama pengguna ✓", 760], ["kata sandi ✓", 830]].forEach(([s, y]) => { ctx.fillStyle = "rgba(14,6,34,0.92)"; RR(ctx, 1200, y - 46, 600, 64, 16); ctx.fill(); txt(ctx, s, 1500, y, 44, { align: "center", weight: 800, color: N.ink2 }); });
      txt(ctx, "dari kebocoran data", 1500, 905, 40, { align: "center", weight: 700, color: N.dim }); ctx.restore(); }
    const ku = ramp(l, tKun - 0.3, 0.4); if (ku > 0) { ctx.save(); ctx.globalAlpha *= ku; U.gembok(ctx, 960, 560, 170, N.gold, eio(ramp(l, tMb - 0.2, 0.6))); txt(ctx, "kunci terakhir: OTP", 960, 720, 48, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
    D.post(c => U.judulPop(c, "Kenapa izin membaca SMS sangat berbahaya", W / 2, TY, 58, l, 0.3, { col: N.gold }));
  };

  // aplikasi bank generik + lapisan login palsu
  function layarBank(c, w, h, palsu, ketik) {
    c.fillStyle = "#F4F1FA"; c.fillRect(0, 0, w, h); c.fillStyle = "#1F6FB2"; c.fillRect(0, 0, w, h * 0.26); txt(c, "Bank Saya", w / 2, h * 0.16, w * 0.11, { align: "center", weight: 900, color: "#FFFFFF" });
    const f = w * 0.095; ["Nama pengguna", "Kata sandi"].forEach((s, i) => { const y = h * (0.36 + i * 0.16); c.fillStyle = "#E3DDF0"; RR(c, w * 0.08, y, w * 0.84, h * 0.1, 14); c.fill(); txt(c, i === 1 && ketik > 0 ? "•".repeat(Math.round(ketik * 8)) : s, w * 0.13, y + h * 0.066, f, { weight: 700, color: "#5A4F80" }); });
    c.fillStyle = "#1F6FB2"; RR(c, w * 0.08, h * 0.7, w * 0.84, h * 0.11, 16); c.fill(); txt(c, "Masuk", w / 2, h * 0.77, f * 1.1, { align: "center", weight: 900, color: "#FFFFFF" });
  }
  S.b4_5 = function (ctx, b, l, t) {
    const tPal = D.at(b, "layar login palsu"), tAtas = D.at(b, "di atas aplikasi asli"), tMer = D.at(b, "Kamu merasa"), tPad = D.at(b, "padahal kamu sedang mengetik");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 380 });
    const ov = eio(ramp(l, tPal - 0.2, 0.9)), ketik = ramp(l, tMer, Math.max(1, tPad - tMer + 1)), reveal = eio(ramp(l, tPad + 0.6, 0.8));
    const a = U.hp(ctx, 960, 590, 860, (c, w, h, tt) => { layarBank(c, w, h, false, 0);
      if (ov > 0) { c.save(); c.translate(lerp(w * 1.05, 0, ov), 0); c.shadowColor = "rgba(0,0,0,0.6)"; c.shadowBlur = 30; layarBank(c, w, h, true, ketik);
        if (reveal > 0) { c.globalAlpha = reveal; c.fillStyle = D.hexA(N.red, 0.25); c.fillRect(0, 0, w, h); c.strokeStyle = N.red; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); c.save(); c.translate(w / 2, h * 0.6); c.rotate(-0.25); c.strokeStyle = N.red; c.lineWidth = 7; RR(c, -w * 0.36, -w * 0.11, w * 0.72, w * 0.22, 12); c.fillStyle = "rgba(255,255,255,0.85)"; c.fill(); c.stroke(); txt(c, "PALSU", 0, w * 0.06, w * 0.15, { align: "center", weight: 900, color: N.red }); c.restore(); } c.restore(); } }, { t });
    ctx.save(); ctx.globalAlpha *= ramp(l, 0.4, 0.4); txt(ctx, "aplikasi asli", 520, 520, 48, { align: "center", weight: 900, color: N.cyan }); ctx.restore();
    ctx.save(); ctx.globalAlpha *= ramp(l, tAtas, 0.4); txt(ctx, "lapisan palsu", 1420, 520, 48, { align: "center", weight: 900, color: N.red }); U.panah(ctx, 1290, 540, 1200, 600, N.red, ramp(l, tAtas, 0.4), 7); ctx.restore();
    if (reveal > 0) { U.server(ctx, 1560, 690, 170, N.red, t); U.panah(ctx, 1240, 690, 1450, 690, N.red, reveal, 7); }
    D.post(c => { U.judulPop(c, "Layar login palsu di atas aplikasi asli", W / 2, TY, 60, l, tPal - 0.3, { col: N.red }); U.tag(c, "kata sandimu terkirim ke penipu", 1450, 880, l, tPad + 0.6, { col: N.red, size: 42 }); });
  };

  S.b4_6 = function (ctx, b, l, t) {
    const tSMS = D.at(b, "tidak butuh SMS-mu"), tLay = D.at(b, "mengendalikan layarmu"), tBat = D.at(b, "batalkan"), tHap = D.at(b, "hapus aplikasinya");
    U.senja(ctx, t, { dim: 0.45, sunX: 600 });
    const ragu = l < tBat, tekan = ramp(l, tBat - 0.1, 0.5);
    U.raka(ctx, 640, 1070, 800, { t, pose: "pegangHP", face: l < tBat ? "bingung" : (l > tHap ? "senang" : "netral"), look: [0.3, 0.4], glow: true, layar: (c, w, h, tt) => { beranda(c, w, h, tt); U.dialogIzin(c, w, h, "Izinkan\nbaca SMS?", "", 1, { ikon: true, tekan }); } });
    // HP besar (tampilan dekat) di kanan
    U.hp(ctx, 1380, 600, 800, (c, w, h, tt) => { beranda(c, w, h, tt); const gone = ramp(l, tHap, 0.6); if (gone < 1) { c.save(); c.globalAlpha *= 1 - gone; U.dialogIzin(c, w, h, "Izinkan aplikasi\nmembaca SMS?", "", 1, { ikon: true, tekan }); c.restore(); }
      if (gone > 0) { c.save(); c.globalAlpha *= gone; txt(c, "Aplikasi dihapus", w / 2, h * 0.52, w * 0.09, { align: "center", weight: 900, color: N.green }); c.restore(); } }, { t });
    D.post(c => { U.judulPop(c, "Game tidak butuh SMS-mu", W / 2, TY, 58, l, tSMS - 0.3, { col: N.green, a: 1 - ramp(l, tLay - 0.5, 0.3) });
      U.judulPop(c, "Game tidak butuh mengendalikan layarmu", W / 2, TY, 58, l, tLay - 0.3, { col: N.green, a: 1 - ramp(l, tBat - 0.5, 0.3) });
      U.judulPop(c, "Batalkan, lalu hapus aplikasinya", W / 2, TY, 60, l, tBat - 0.3, { col: N.green }); });
  };

  U.reg(4, S);
})(typeof window !== "undefined" ? window : globalThis);
