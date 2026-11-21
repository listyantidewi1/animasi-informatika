/* D08 bab 2 — LEVEL 2: Bocoran 209 GB (b2_1 … b2_5). Isi bocoran (Xbox, bukan PC; executable hilang), puzzle + koin kripto,
   dua kolom Xbox vs PC dengan tiga sambungan putus, jaring penipu, garis waktu 2022 dan rantai yang mata rantai terlemahnya manusia. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = U.TAU;

  S.b2_1 = function (ctx, b, l, t) {
    const tXb = D.at(b, "untuk Xbox"), tPC = D.at(b, "bukan untuk PC"), t209 = D.at(b, "dua ratus sembilan"), tJan = D.at(b, "Tapi ada yang janggal"), tEx = D.at(b, "executable utama"), tTid = D.at(b, "tidak ikut");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 300 });
    const sh = eio(ramp(l, tJan - 0.3, 0.8));
    // kiri: kartu build
    ctx.save(); ctx.translate(lerp(0, -480, sh), 0);
    const pb = U.pop(l, 1.0); if (pb.a > 0) { ctx.save(); ctx.globalAlpha *= pb.a; U.berkas(ctx, 960, 470, 300 * lerp(0.7, 1, pb.sp), { jenis: "torrent", nama: l > tXb - 0.3 ? "build GTA 6 untuk Xbox" : "bocoran Cyberleek", size: 50, ukuran: l > t209 ? "±209 GB" : "", ukCol: N.gold }); ctx.restore(); }
    const pp = ramp(l, tPC - 0.1, 0.4); if (pp > 0) { ctx.save(); ctx.globalAlpha *= pp * (1 - sh); ctx.translate(1520, 470); U.perangkat(ctx, 0, 0, 220, "pc", { col: N.red }); ctx.restore(); U.silang(ctx, 1520, 470, 160, ramp(l, tPC + 0.3, 0.4) * (1 - sh)); ctx.save(); ctx.globalAlpha *= pp * (1 - sh); txt(ctx, "bukan PC", 1520, 680, 52, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
    ctx.restore();
    if (sh > 0) { ctx.save(); ctx.globalAlpha *= sh; U.isiBocoran(ctx, 860, 290, 900, l, tJan, tTid - 0.2, t, { judul: "Isinya" }); ctx.restore(); }
    D.post(c => { U.judulPop(c, "Yang dibagikan Cyberleek", W / 2, 168, 60, l, 0.3, { col: N.violet, a: 1 - sh }); U.judulPop(c, "Tapi ada yang janggal", W / 2, 168, 60, l, tJan, { col: N.red });
      U.tag(c, "executable = program yang menjalankan game", 1310, 900, l, tEx + 0.4, { col: N.red, size: 44 }); });
  };

  // puzzle 3×2 dengan satu kepingan hilang
  function puzzle(ctx, x, y, s, lepas, t, o = {}) {
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { const miss = r === 0 && c === 2; const px = x + c * s, py = y + r * s;
      if (miss && lepas <= 0) { ctx.save(); ctx.strokeStyle = D.hexA(N.red, 0.6 + 0.4 * Math.sin(t * 6)); ctx.lineWidth = 5; ctx.setLineDash([16, 12]); RR(ctx, px + 6, py + 6, s - 12, s - 12, 16); ctx.stroke(); ctx.restore();
        txt(ctx, "?", px + s / 2, py + s / 2 + 34, 100, { align: "center", weight: 900, color: N.red }); continue; }
      ctx.save(); if (miss) ctx.translate(0, -(1 - eout(lepas)) * 260); ctx.fillStyle = miss ? "#3A1438" : "#22144A"; ctx.strokeStyle = miss ? N.red : N.cyan; ctx.lineWidth = 5; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 16;
      RR(ctx, px + 6, py + 6, s - 12, s - 12, 16); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(px + s - 6, py + s / 2, s * 0.1, 0, TAU); ctx.arc(px + s / 2, py + s - 6, s * 0.1, 0, TAU); ctx.fill(); ctx.restore(); }
  }
  S.b2_2 = function (ctx, b, l, t) {
    const tJan = D.at(b, "berjanji"), tKoin = D.at(b, "koin kripto"), tTar = D.at(b, "target tertentu"), tNai = D.at(b, "menaikkan harga"), tBel = D.at(b, "belum ada pihak");
    U.ruang(ctx, t, { col: N.gold, gx: 1400, gy: 300 });
    // puzzle kiri
    const pa = ramp(l, 0.2, 0.5); ctx.save(); ctx.globalAlpha *= pa; puzzle(ctx, 180, 340, 200, 0, t); txt(ctx, "build Xbox", 480, 820, 50, { align: "center", weight: 900 });
    ctx.restore();
    // kepingan yang ditahan, menggantung di atas grafik
    const kp = U.pop(l, tJan); if (kp.a > 0) { ctx.save(); ctx.globalAlpha *= kp.a; ctx.translate(1180, 320 + Math.sin(t * 2) * 8); ctx.fillStyle = "#3A1438"; ctx.strokeStyle = N.red; ctx.lineWidth = 5; ctx.shadowColor = N.red; ctx.shadowBlur = 20; RR(ctx, -90, -90, 180, 180, 16); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      U.gembok(ctx, 0, -10, 90, N.gold); txt(ctx, "executable", 0, 140, 44, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
    // grafik harga koin
    const ga = ramp(l, tKoin - 0.3, 0.5); if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; const x0 = 1000, y0 = 880, w = 720, h = 300;
      ctx.strokeStyle = D.hexA(N.ink2, 0.5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0 - h); ctx.lineTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.stroke();
      const ty = y0 - h * 0.85; ctx.setLineDash([14, 10]); ctx.strokeStyle = N.gold; ctx.beginPath(); ctx.moveTo(x0, ty); ctx.lineTo(x0 + w, ty); ctx.stroke(); ctx.setLineDash([]);
      if (l > tTar - 0.3) txt(ctx, "target", x0 + w - 6, ty - 16, 42, { align: "right", weight: 900, color: N.gold });
      const k = ramp(l, tKoin, Math.max(1, tNai - tKoin + 1)); ctx.strokeStyle = N.green; ctx.lineWidth = 7; ctx.shadowColor = N.green; ctx.shadowBlur = 14; ctx.beginPath();
      for (let i = 0; i <= 40 * k; i++) { const u = i / 40, yy = y0 - 30 - h * 0.6 * u - Math.sin(u * 17) * 26 * (1 - u * 0.3); i ? ctx.lineTo(x0 + u * w, yy) : ctx.moveTo(x0, yy); } ctx.stroke(); ctx.restore();
      U.koin(ctx, x0 - 10, y0 - h - 40, 46, N.gold, "$"); txt(ctx, "harga koin milik mereka", x0 + 60, y0 - h - 26, 44, { weight: 800, color: N.ink2 }); ctx.restore(); }
    // stempel belum terverifikasi
    const st = U.pop(l, tBel); if (st.a > 0) { ctx.save(); ctx.globalAlpha *= st.a; ctx.translate(480, 560); ctx.rotate(-0.12); const k = lerp(1.6, 1, st.sp); ctx.scale(k, k);
      ctx.strokeStyle = N.red; ctx.lineWidth = 8; ctx.shadowColor = N.red; ctx.shadowBlur = 16; RR(ctx, -330, -70, 660, 140, 18); ctx.fillStyle = "rgba(20,4,20,0.85)"; ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      txt(ctx, "BELUM TERVERIFIKASI", 0, 20, 56, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
    D.post(c => U.judulPop(c, "Kepingan terakhir ditukar dengan harga koin", W / 2, 168, 58, l, tJan - 0.2, { col: N.gold }));
  };

  S.b2_3 = function (ctx, b, l, t) {
    const tSem = D.at(b, "tidak semudah"), tKhu = D.at(b, "dibuat khusus"), tGr = D.at(b, "menggambar grafis"), tBer = D.at(b, "membaca berkas"), tEnk = D.at(b, "kunci enkripsinya"), tPor = D.at(b, "disebut porting"), tTim = D.at(b, "tim programmer");
    U.ruang(ctx, t, { col: N.cyan, gx: 960, gy: 300 });
    const out = eio(ramp(l, tPor - 0.5, 0.7));
    ctx.save(); ctx.globalAlpha *= 1 - out;
    // dua kolom
    [[360, "Xbox", "konsol", N.green], [1560, "PC Windows", "pc", N.cyan]].forEach(([x, s, j, col], i) => { const a = ramp(l, (i ? D.at(b, "dimainkan di PC") : 0.6) - 0.2, 0.5); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
      U.panel(ctx, x - 230, 280, 460, 600, { col }); U.perangkat(ctx, x, 420, 200, j, { col }); txt(ctx, s, x, 600, 56, { align: "center", weight: 900 }); ctx.restore(); });
    const rows = [[tKhu, "sistem operasi"], [tGr, "cara menggambar grafis"], [tBer, "cara membaca berkas"], [tEnk, "kunci enkripsi"]];
    rows.forEach(([t0, s], i) => { const a = ramp(l, t0 - 0.2, 0.4); if (a <= 0) return; const y = 360 + i * 140, br = ramp(l, t0 + 0.5, 0.4);
      ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = N.gold; ctx.lineWidth = 7; ctx.shadowColor = N.gold; ctx.shadowBlur = 12; const gap = 40 * eout(br);
      ctx.beginPath(); ctx.moveTo(600, y + 60); ctx.lineTo(960 - gap, y + 60 + gap * 0.5); ctx.moveTo(960 + gap, y + 60 - gap * 0.5); ctx.lineTo(1320, y + 60); ctx.stroke(); ctx.shadowBlur = 0;
      txt(ctx, s, 960, y + 30, 44, { align: "center", weight: 800, color: N.ink }); if (br > 0) U.silang(ctx, 960, y + 62, 36, br); ctx.restore(); });
    ctx.restore();
    if (out > 0) { ctx.save(); ctx.globalAlpha *= out;
      U.panel(ctx, 460, 300, 1000, 520, { col: N.gold }); U.neon(ctx, "PORTING", 960, 430, 110, N.gold, { align: "center" });
      txt(ctx, "membuat versi baru untuk perangkat lain", 960, 520, 46, { align: "center", weight: 800, color: N.ink2 });
      const tp = ramp(l, tTim - 0.2, 0.4); for (let i = 0; i < 6; i++) { const a = clamp(tp * 6 - i); if (a <= 0) continue; ctx.save(); ctx.globalAlpha *= a; U.raka(ctx, 620 + i * 136, 790, 200, { t: t + i, seed: i + 2, skin: i % 5, outfit: ["kaos", "hoodie", "kemeja"][i % 3], top: [N.violet, "#3B2A7A", "#2C6E8A"][i % 3], hair: ["pendek", "hijab", "kuncir"][i % 3], pose: "menulis", meja: false }); ctx.restore(); }
      U.tag(ctx, "berbulan-bulan", 960, 875, l, tTim + 0.8, { col: N.gold, size: 50 }); ctx.restore(); }
    D.post(c => { U.judulPop(c, "Kalau lengkap, bisa dimainkan di PC?", W / 2, 168, 58, l, 0.4, { col: N.gold, a: 1 - ramp(l, tKhu - 0.6, 0.25) }); U.judulPop(c, "Game konsol dibuat khusus untuk konsolnya", W / 2, 168, 58, l, tKhu - 0.3, { col: N.cyan, a: 1 - out }); });
  };

  S.b2_4 = function (ctx, b, l, t) {
    const tSem = D.at(b, "justru sempurna"), tDen = D.at(b, "sudah mendengar"), tTin = D.at(b, "Penipu tinggal");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 460, ga: 0.22 });
    // jaring laba-laba neon
    const ja = ramp(l, 0.2, 1.2), cx = 960, cy = 520;
    ctx.save(); ctx.strokeStyle = D.hexA(N.pink, 0.7); ctx.lineWidth = 3; ctx.shadowColor = N.pink; ctx.shadowBlur = 10;
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, k = clamp(ja * 12 - i * 0.6); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 520 * k, cy + Math.sin(a) * 400 * k); ctx.stroke(); }
    for (let r = 1; r <= 5; r++) { const k = clamp(ja * 2 - r * 0.25); if (k <= 0) continue; ctx.beginPath(); for (let i = 0; i <= 12; i++) { const a = i / 12 * TAU, sag = 0.92; const x = cx + Math.cos(a) * 100 * r * (i % 1 ? sag : 1), y = cy + Math.sin(a) * 78 * r; i ? ctx.quadraticCurveTo(cx + Math.cos(a - TAU / 24) * 100 * r * sag, cy + Math.sin(a - TAU / 24) * 78 * r * sag, x, y) : ctx.moveTo(x, y); } ctx.globalAlpha = k; ctx.stroke(); }
    ctx.restore();
    U.neonPop(ctx, "GTA 6 PC", cx, cy + 40, 120, N.gold, l, tSem - 0.4, { align: "center" });
    // orang-orang yang tertarik (kepala kecil bergerak ke jaring)
    const da = ramp(l, tDen - 0.2, 0.6); if (da > 0) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.4, r = lerp(620, 540, eio(ramp(l, tDen, 3))); ctx.save(); ctx.globalAlpha *= da;
      K.kit.orang.kepala(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.62, 54, { skin: i % 6, hair: ["pendek", "hijab", "kuncir", "pendek", "panjang", "hood"][i], face: "senang", look: [-Math.cos(a), -Math.sin(a)], t: t + i }); ctx.restore(); }
    // spanduk penipu
    const sp = U.pop(l, tTin + 0.3); if (sp.a > 0) { ctx.save(); ctx.globalAlpha *= sp.a; ctx.translate(960, 880); const k = lerp(0.7, 1, sp.sp); ctx.scale(k, k);
      ctx.fillStyle = "#FFE17A"; RR(ctx, -560, -70, 1120, 140, 24); ctx.fill(); txt(ctx, "\"Ini versi PC dari bocoran itu, unduh di sini!\"", 0, 18, 50, { align: "center", weight: 900, color: "#2A1648", fit: 1060 }); ctx.restore(); }
    D.post(c => U.judulPop(c, "Bagi penipu, bocoran ini umpan yang sempurna", W / 2, 168, 58, l, tSem - 0.6, { col: N.red }));
  };
  S.b2_4.noCam = true;

  S.b2_5 = function (ctx, b, l, t) {
    const t22 = D.at(b, "dua ribu dua puluh dua"), tRem = D.at(b, "seorang remaja"), tSE = D.at(b, "social engineering"), tMen = D.at(b, "menipu orang"), tVid = D.at(b, "Puluhan video"), tTit = D.at(b, "titik terlemah");
    U.ruang(ctx, t, { col: N.violet, gx: 500, gy: 300 });
    const ch = eio(ramp(l, tTit - 0.4, 0.7));
    ctx.save(); ctx.globalAlpha *= 1 - ch;
    // garis waktu
    const la = ramp(l, 0.2, 0.8); ctx.strokeStyle = D.hexA(N.ink2, 0.6); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(200, 330); ctx.lineTo(200 + 1520 * la, 330); ctx.stroke();
    [["2022", t22, 560, N.red], ["2026", 0.6, 1500, N.cyan]].forEach(([s, t0, x, col]) => { const p = U.pop(l, t0); if (p.a <= 0) return; ctx.save(); ctx.globalAlpha *= p.a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, 330, 20, 0, TAU); ctx.fill(); U.neon(ctx, s, x, 270, 70, col, { align: "center" }); ctx.restore(); });
    const g2 = U.pop(l, t22 + 0.3); if (g2.a > 0) { ctx.save(); ctx.globalAlpha *= g2.a; U.gembok(ctx, 560, 470, 150, N.red, eio(ramp(l, tRem, 0.6))); ctx.restore(); }
    // social engineering: pesan tipuan ke karyawan
    const se = ramp(l, tSE - 0.3, 0.5); if (se > 0) { ctx.save(); ctx.globalAlpha *= se;
      K.kit.orang.kepala(ctx, 880, 630, 76, { skin: 1, hair: "hood", face: "senang", look: [1, 0], t }); K.kit.orang.kepala(ctx, 1440, 630, 76, { skin: 3, hair: "pendek", face: "bingung", look: [-1, 0], t: t + 1 });
      txt(ctx, "remaja", 880, 835, 44, { align: "center", weight: 800, color: N.ink2 }); txt(ctx, "karyawan", 1440, 835, 44, { align: "center", weight: 800, color: N.ink2 });
      U.gelembung(ctx, 1160, 575, 420, 100, ramp(l, tMen - 0.2, 0.4)); if (l > tMen - 0.2) txt(ctx, "\"Saya dari tim IT\"", 1160, 590, 44, { align: "center", weight: 900, color: "#2A1648" }); ctx.restore(); }
    const va = ramp(l, tVid - 0.2, 0.5); if (va > 0) for (let i = 0; i < 5; i++) { ctx.save(); ctx.globalAlpha *= clamp(va * 5 - i); const x = 1180 + (i % 5) * 120, y = 400; ctx.fillStyle = "#22144A"; ctx.strokeStyle = N.cyan; ctx.lineWidth = 3; RR(ctx, x, y - 45, 100, 90, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = N.cyan; ctx.beginPath(); ctx.moveTo(x + 38, y - 20); ctx.lineTo(x + 66, y); ctx.lineTo(x + 38, y + 20); ctx.fill(); ctx.restore(); }
    if (va > 0) { ctx.save(); ctx.globalAlpha *= va; txt(ctx, "puluhan video uji coba bocor", 1480, 500, 44, { align: "center", weight: 800, color: N.ink }); ctx.restore(); }
    ctx.restore();
    // rantai: mata rantai terlemah = manusia
    if (ch > 0) { ctx.save(); ctx.globalAlpha *= ch; const y = 560;
      for (let i = 0; i < 5; i++) { const x = 400 + i * 280, weak = i === 2, sh = weak ? Math.sin(t * 14) * 4 * ramp(l, tTit + 0.8, 0.3) : 0; ctx.save(); ctx.translate(x + sh, y); ctx.strokeStyle = weak ? N.red : N.cyan; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 18; ctx.lineWidth = 22;
        ctx.beginPath(); ctx.ellipse(0, 0, 150, 78, 0, 0, TAU); ctx.stroke(); ctx.restore();
        if (weak) K.kit.orang.kepala(ctx, x, y, 46, { skin: 2, hair: "pendek", face: "bingung", t }); else U.gembok(ctx, x, y - 10, 70, N.cyan); }
      txt(ctx, "manusia", 960, 720, 54, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
    D.post(c => { U.judulPop(c, "Bukan pertama kalinya Rockstar dibobol", W / 2, 168, 58, l, 0.4, { col: N.violet, a: 1 - ramp(l, t22 - 0.5, 0.25) }); U.judulPop(c, "2022: sistem internal Rockstar dibobol", W / 2, 168, 58, l, t22 - 0.2, { col: N.red, a: 1 - ch }); U.tag(c, "social engineering = menipu orang, bukan membobol mesin", W / 2, 880, l, tMen, { col: N.violet, size: 44, a: 1 - ch });
      U.judulPop(c, "Titik terlemah sering kali manusianya", W / 2, 168, 60, l, tTit - 0.2, { col: N.red }); });
  };

  U.reg(2, S);
})(typeof window !== "undefined" ? window : globalThis);
