/* D08 bab 3 — BOSS 1: Situs unduhan palsu dan keygen (b3_1 … b3_6). Situs palsu generik, paket penipuan $200 di dark web,
   empat isi paket, alur pencurian token sesi, crypto miner (CPU 100%), situs "aktivasi" $100 + GTAVI.exe 34/68. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = U.TAU, TY = 168;

  // isi halaman situs unduhan palsu (dalam rect r dari U.browser)
  U.situsPalsu = function (ctx, r, l, t, o = {}) {
    ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
    const gr = ctx.createLinearGradient(0, r.y, 0, r.y + r.h); gr.addColorStop(0, "#2A0F45"); gr.addColorStop(1, "#5A1660"); ctx.fillStyle = gr; ctx.fillRect(r.x, r.y, r.w, r.h);
    U.neon(ctx, "GTA 6 PC FULL", r.x + r.w * 0.34, r.y + 110, 70, N.gold, { align: "center", fit: r.w * 0.6 });
    txt(ctx, "GRATIS · 100% WORK", r.x + r.w * 0.34, r.y + 180, 44, { align: "center", weight: 900, color: N.ink });
    U.tombol(ctx, "DOWNLOAD", r.x + r.w * 0.32, r.y + 300, 460, 120, N.green, { pulse: true, t, size: 58 });
    if (o.hitung) { const n = Math.max(0, 9 - Math.floor(Math.max(0, l - o.hitung))); txt(ctx, "Unduhan siap dalam 00:0" + n, r.x + r.w * 0.34, r.y + 420, 44, { align: "center", weight: 800, color: N.gold }); }
    // kolom komentar bergulir
    const cx = r.x + r.w * 0.64, cw = r.w * 0.34; ctx.fillStyle = "rgba(10,4,26,0.5)"; RR(ctx, cx, r.y + 20, cw, r.h - 40, 18); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(cx, r.y + 20, cw, r.h - 40); ctx.clip();
    const KOM = ["Works 100%!", "Udah kucoba, lancar!", "Makasih min!", "Mantap, jalan di PC!", "Works 100%!", "Gila, beneran bisa"], off = o.gulir ? (l * 40) % (KOM.length * 110) : 0;
    for (let i = 0; i < KOM.length * 2; i++) { const y = r.y + 40 + i * 110 - off; if (y < r.y - 100 || y > r.y + r.h) continue; ctx.fillStyle = "rgba(255,255,255,0.08)"; RR(ctx, cx + 14, y, cw - 28, 92, 14); ctx.fill();
      ctx.fillStyle = [N.pink, N.cyan, N.gold][i % 3]; ctx.beginPath(); ctx.arc(cx + 50, y + 46, 22, 0, TAU); ctx.fill();
      txt(ctx, KOM[i % KOM.length], cx + 86, y + 60, 40, { weight: 800, color: N.ink, fit: cw - 110 }); }
    ctx.restore(); ctx.restore();
  };

  S.b3_1 = function (ctx, b, l, t) {
    const tDl = D.at(b, "tombol DOWNLOAD"), tHit = D.at(b, "hitung mundur"), tKom = D.at(b, "komentar");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 380 });
    const r = U.browser(ctx, 160, 230, 1600, 720, { url: "gta6-gratis.contoh" });
    U.situsPalsu(ctx, r, l, t, { hitung: tHit, gulir: l > tKom });
    // sorotan bergiliran
    [[tDl, r.x + r.w * 0.34, r.y + 300, 280, 90], [tHit, r.x + r.w * 0.34, r.y + 405, 330, 44], [tKom, r.x + r.w * 0.83, r.y + 300, 270, 280]].forEach(([t0, x, y, rx, ry], i, arr) => {
      const a = ramp(l, t0 - 0.1, 0.3) * (i < 2 ? 1 - ramp(l, arr[i + 1][0] - 0.1, 0.3) : 1); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = N.gold; ctx.lineWidth = 7; ctx.shadowColor = N.gold; ctx.shadowBlur = 18; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.stroke(); ctx.restore(); });
    D.post(c => U.judulPop(c, "Situs unduhan palsu yang tampak meyakinkan", W / 2, TY, 58, l, 0.4, { col: N.red }));
  };

  S.b3_2 = function (ctx, b, l, t) {
    const tNord = D.at(b, "NordVPN"), tDark = D.at(b, "dark web"), t200 = D.at(b, "dua ratus dolar"), tTek = D.at(b, "tanpa kemampuan"), tEmp = D.at(b, "Isinya ada empat");
    U.ruang(ctx, t, { col: N.violet, top: "#07030F", bot: "#170A2B", gx: 960, gy: 500, ga: 0.12 });
    // etalase gelap
    const pa = ramp(l, Math.min(tDark - 0.3, 0.6), 0.6); if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; U.panel(ctx, 420, 280, 1080, 560, { col: N.red, fill: "rgba(8,3,16,0.92)" });
      txt(ctx, "pasar gelap", 470, 350, 44, { weight: 800, color: N.dim });
      const kp = U.pop(l, t200 - 0.8); if (kp.a > 0) { ctx.save(); ctx.globalAlpha *= kp.a; ctx.translate(700, 580); const k = lerp(0.7, 1, kp.sp); ctx.scale(k, k);
        ctx.fillStyle = "#3A1A1A"; ctx.strokeStyle = N.gold; ctx.lineWidth = 6; ctx.shadowColor = N.gold; ctx.shadowBlur = 16; RR(ctx, -170, -110, 340, 230, 18); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
        ctx.fillStyle = N.gold; ctx.fillRect(-170, -40, 340, 18); txt(ctx, "PAKET", 0, 80, 54, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
      txt(ctx, "Paket penipuan", 1180, 500, 52, { align: "center", weight: 900 }); txt(ctx, "GTA 6 versi PC", 1180, 566, 52, { align: "center", weight: 900 });
      const pr = U.pop(l, t200); if (pr.a > 0) { ctx.save(); ctx.globalAlpha *= pr.a; ctx.translate(1180, 690); const k = lerp(0.6, 1, pr.sp); ctx.scale(k, k); U.neon(ctx, "$200", 0, 30, 110, N.green, { align: "center" }); ctx.restore(); }
      ctx.restore(); }
    D.post(c => { U.sumber(c, l, tNord, "NordVPN (Threat Intelligence)"); U.judulPop(c, "Temuan tim keamanan NordVPN", W / 2, TY, 58, l, 0.4, { col: N.violet, a: 1 - ramp(l, tDark - 0.5, 0.25) }); U.judulPop(c, "Dijual di dark web, siap pakai", W / 2, TY, 58, l, tDark - 0.2, { col: N.red });
      U.tag(c, "siapa pun bisa memakainya", W / 2, 885, l, tTek, { col: N.violet, size: 48 }); });
    const e4 = U.pop(l, tEmp); if (e4.a > 0) { ctx.save(); ctx.globalAlpha *= e4.a; ctx.translate(1660, 330); ctx.scale(lerp(0.5, 1, e4.sp), lerp(0.5, 1, e4.sp)); ctx.fillStyle = N.gold; ctx.beginPath(); ctx.arc(0, 0, 80, 0, TAU); ctx.fill(); txt(ctx, "4", 0, 36, 100, { align: "center", weight: 900, color: "#1A0E36" }); ctx.restore();
      ctx.save(); ctx.globalAlpha *= e4.a; txt(ctx, "isi", 1660, 460, 44, { align: "center", weight: 800 }); ctx.restore(); }
  };

  // ikon isi paket
  function ikonIsi(ctx, i, x, y, s, t) {
    if (i === 0) { U.berkas(ctx, x, y, s, { jenis: "exe", t, mata: true }); ctx.save(); ctx.translate(x + s * 0.32, y - s * 0.34); ctx.rotate(-0.6); ctx.strokeStyle = N.gold; ctx.lineWidth = 8; ctx.shadowColor = N.gold; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.moveTo(18, 0); ctx.lineTo(70, 0); ctx.moveTo(56, 0); ctx.lineTo(56, 16); ctx.stroke(); ctx.restore(); }
    else if (i === 1) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#1A0E36"; ctx.strokeStyle = N.orange; ctx.lineWidth = 6; ctx.shadowColor = N.orange; ctx.shadowBlur = 16; RR(ctx, -s * 0.36, -s * 0.36, s * 0.72, s * 0.72, 14); ctx.fill(); ctx.stroke();
      for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(k * s * 0.12, -s * 0.36); ctx.lineTo(k * s * 0.12, -s * 0.48); ctx.moveTo(k * s * 0.12, s * 0.36); ctx.lineTo(k * s * 0.12, s * 0.48); ctx.moveTo(-s * 0.36, k * s * 0.12); ctx.lineTo(-s * 0.48, k * s * 0.12); ctx.moveTo(s * 0.36, k * s * 0.12); ctx.lineTo(s * 0.48, k * s * 0.12); ctx.stroke(); }
      ctx.restore(); U.koin(ctx, x, y, s * 0.2, N.gold, "₿"); }
    else if (i === 2) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#3B2416"; ctx.strokeStyle = N.gold; ctx.lineWidth = 6; ctx.shadowColor = N.gold; ctx.shadowBlur = 14; RR(ctx, -s * 0.45, -s * 0.3, s * 0.9, s * 0.62, 16); ctx.fill(); ctx.stroke(); ctx.fillStyle = N.gold; RR(ctx, s * 0.18, -s * 0.08, s * 0.3, s * 0.2, 8); ctx.fill(); ctx.restore();
      U.panah(ctx, x, y + s * 0.3, x, y + s * 0.62, N.red, 1, 7); }
    else { ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#1A0E36"; ctx.strokeStyle = N.cyan; ctx.lineWidth = 6; ctx.shadowColor = N.cyan; ctx.shadowBlur = 16; RR(ctx, -s * 0.34, -s * 0.28, s * 0.68, s * 0.56, 20); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -s * 0.28); ctx.lineTo(0, -s * 0.44); ctx.stroke(); ctx.fillStyle = N.cyan; ctx.beginPath(); ctx.arc(0, -s * 0.46, 8, 0, TAU); ctx.arc(-s * 0.13, -s * 0.04, 10, 0, TAU); ctx.arc(s * 0.13, -s * 0.04, 10, 0, TAU); ctx.fill();
      ctx.fillStyle = N.red; RR(ctx, s * 0.14, s * 0.06, s * 0.36, s * 0.26, 8); ctx.fill(); ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.moveTo(s * 0.27, s * 0.12); ctx.lineTo(s * 0.37, s * 0.19); ctx.lineTo(s * 0.27, s * 0.26); ctx.fill(); ctx.restore(); }
  }
  S.b3_3 = function (ctx, b, l, t) {
    const T = [D.at(b, "keygen palsu"), D.at(b, "crypto miner"), D.at(b, "penguras dompet"), D.at(b, "bot untuk")];
    const LAB = [["keygen palsu", "kode aktivasi palsu"], ["crypto miner", "menambang diam-diam"], ["penguras", "dompet kripto"], ["bot penyebar", "iklan di Shorts"]];
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 760 });
    // kotak paket terbuka di bawah
    ctx.save(); ctx.translate(960, 930); ctx.fillStyle = "#3A1A1A"; ctx.strokeStyle = N.gold; ctx.lineWidth = 6; ctx.shadowColor = N.gold; ctx.shadowBlur = 16; RR(ctx, -200, -80, 400, 160, 16); ctx.fill(); ctx.stroke();
    const lid = eout(ramp(l, T[0] - 0.8, 0.6)); ctx.save(); ctx.translate(-200, -80); ctx.rotate(-lid * 0.9); RR(ctx, 0, -30, 400, 30, 8); ctx.fill(); ctx.stroke(); ctx.restore(); ctx.restore();
    const X = [300, 740, 1180, 1620];
    T.forEach((t0, i) => { const k = eout(ramp(l, t0 - 0.2, 0.7)); if (k <= 0) return; const x = lerp(960, X[i], k), y = lerp(900, 470, k) - Math.sin(k * Math.PI) * 140;
      ctx.save(); ctx.globalAlpha *= clamp(k * 3); U.panel(ctx, x - 190, y - 170, 380, 420, { col: [N.red, N.orange, N.gold, N.cyan][i], fill: "rgba(14,6,34,0.9)" }); ikonIsi(ctx, i, x, y - 30, 160, t);
      txt(ctx, (i + 1) + ". " + LAB[i][0], x, y + 140, 46, { align: "center", weight: 900, fit: 350 }); txt(ctx, LAB[i][1], x, y + 200, 40, { align: "center", weight: 700, color: N.ink2, fit: 350 }); ctx.restore(); });
    D.post(c => U.judulPop(c, "Isi paket penipuan GTA 6", W / 2, TY, 60, l, 0.3, { col: N.gold }));
  };

  S.b3_4 = function (ctx, b, l, t) {
    const tKey = D.at(b, "keygen palsu itu"), tCur = D.at(b, "mencuri token"), tTan = D.at(b, "Token sesi adalah"), tLog = D.at(b, "tetap login"), tDic = D.at(b, "Kalau token ini dicuri"), tSan = D.at(b, "tanpa tahu"), t2 = D.at(b, "verifikasi dua langkah");
    U.ruang(ctx, t, { col: N.gold, gx: 1500, gy: 400 });
    const dua = eio(ramp(l, tDic - 0.4, 0.7));
    ctx.save(); ctx.globalAlpha *= 1 - dua;
    // alur: keygen → folder browser → token → server penipu
    U.berkas(ctx, 330, 500, 220, { jenis: "exe", t, mata: true, nama: "GTA6 Keygen.exe", size: 44 });
    const a1 = ramp(l, tCur - 0.5, 0.6); U.panah(ctx, 470, 500, 720, 500, N.red, a1, 8);
    if (a1 > 0) { ctx.save(); ctx.globalAlpha *= a1; ctx.translate(880, 500); ctx.fillStyle = "#2B2242"; ctx.strokeStyle = N.cyan; ctx.lineWidth = 5; ctx.shadowColor = N.cyan; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.moveTo(-130, -80); ctx.lineTo(-40, -80); ctx.lineTo(-20, -60); ctx.lineTo(130, -60); ctx.lineTo(130, 90); ctx.lineTo(-130, 90); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      txt(ctx, "data browser", 0, 160, 44, { align: "center", weight: 800 }); ctx.restore(); }
    const tk = eio(ramp(l, tCur + 0.5, 1.4)), tx = lerp(880, 1540, tk), ty = lerp(510, 500, tk) - Math.sin(tk * Math.PI) * 160;
    U.token(ctx, tx, ty, 80, ramp(l, tCur + 0.2, 0.3), tk * 0.4);
    U.server(ctx, 1540, 520, 220, N.red, t); ctx.save(); ctx.globalAlpha *= ramp(l, tCur, 0.4); txt(ctx, "server penipu", 1540, 700, 44, { align: "center", weight: 800, color: N.red }); ctx.restore();
    // penjelasan token
    const ex = ramp(l, tTan - 0.2, 0.4); if (ex > 0) { ctx.save(); ctx.globalAlpha *= ex; U.panel(ctx, 600, 780, 1060, 160, { col: N.gold }); U.token(ctx, 720, 860, 56, 1);
      txt(ctx, "token sesi = tanda yang membuatmu", 1200, 850, 44, { align: "center", weight: 800 }); txt(ctx, "tetap login tanpa kata sandi", 1200, 906, 44, { align: "center", weight: 800, color: l > tLog ? N.gold : N.ink }); ctx.restore(); }
    ctx.restore();
    // bagian kedua: penipu masuk tanpa kata sandi
    if (dua > 0) { ctx.save(); ctx.globalAlpha *= dua;
      U.server(ctx, 420, 520, 220, N.red, t); U.token(ctx, 420, 760, 70, 1);
      U.panah(ctx, 600, 520, 820, 520, N.red, ramp(l, tDic + 0.3, 0.5), 8);
      U.panel(ctx, 880, 300, 760, 480, { col: N.cyan }); txt(ctx, "Akun kamu", 1260, 380, 52, { align: "center", weight: 900 });
      ctx.fillStyle = "rgba(255,255,255,0.08)"; RR(ctx, 940, 430, 640, 80, 14); ctx.fill(); txt(ctx, "Kata sandi: tidak diisi", 970, 484, 44, { weight: 700, color: N.dim });
      const ms = U.pop(l, tSan); if (ms.a > 0) { ctx.save(); ctx.globalAlpha *= ms.a; U.tombol(ctx, "Berhasil masuk", 1260, 600, 460, 100, N.red, { size: 46 }); ctx.restore(); }
      const v2 = ramp(l, t2 - 0.3, 0.4); if (v2 > 0) { ctx.save(); ctx.globalAlpha *= v2; txt(ctx, "verifikasi dua langkah", 1260, 720, 44, { align: "center", weight: 800, color: N.ink2 }); ctx.restore(); ctx.save(); ctx.strokeStyle = N.red; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1050, 706); ctx.lineTo(1050 + 420 * ramp(l, t2 + 0.6, 0.4), 706); ctx.stroke(); ctx.restore(); U.tag(ctx, "kadang ikut terlewati", 1260, 860, l, t2 + 0.8, { col: N.red, size: 44 }); }
      ctx.restore(); }
    D.post(c => { U.sumber(c, l, tCur, "NordVPN"); U.judulPop(c, "Keygen palsu mencuri token sesi", W / 2, TY, 60, l, tKey - 0.2, { col: N.red, a: 1 - dua }); U.judulPop(c, "Penipu masuk tanpa tahu kata sandimu", W / 2, TY, 60, l, tDic, { col: N.red }); });
  };

  S.b3_5 = function (ctx, b, l, t) {
    const tDia = D.at(b, "bekerja diam-diam"), tPan = D.at(b, "terasa panas"), tKip = D.at(b, "kipasnya berisik"), tLam = D.at(b, "terasa lambat"), tTid = D.at(b, "tidak membuka");
    U.ruang(ctx, t, { col: N.orange, gx: 960, gy: 500, ga: 0.15 + 0.15 * ramp(l, tPan, 1) });
    const r = U.laptop(ctx, 760, 860, 900, { layar: "#0E0A1E" });
    // layar desktop kosong + pengukur CPU
    const cpu = lerp(8, 100, eio(ramp(l, tDia - 0.3, 2.2))) + (l > tDia + 2 ? Math.sin(t * 13) * 1.2 : 0);
    ctx.save(); ctx.fillStyle = "#1A1432"; ctx.fillRect(r.x, r.y, r.w, r.h); txt(ctx, "Penggunaan CPU", r.x + 40, r.y + 70, 46, { weight: 900 });
    ctx.fillStyle = "rgba(255,255,255,0.08)"; RR(ctx, r.x + 40, r.y + 110, r.w - 80, 70, 35); ctx.fill(); const cc = cpu > 70 ? N.red : N.green; ctx.fillStyle = cc; ctx.shadowColor = cc; ctx.shadowBlur = 16; RR(ctx, r.x + 46, r.y + 116, (r.w - 92) * cpu / 100, 58, 29); ctx.fill(); ctx.shadowBlur = 0;
    U.neon(ctx, Math.round(Math.min(100, cpu)) + "%", r.x + r.w - 40, r.y + 290, 110, cc, { align: "right" });
    const ta = ramp(l, tTid - 0.2, 0.4); if (ta > 0) { ctx.globalAlpha *= ta; txt(ctx, "Aplikasi terbuka: tidak ada", r.x + 40, r.y + 400, 44, { weight: 800, color: N.ink2 }); } ctx.restore();
    // kipas dan panas
    const kp = ramp(l, tKip - 0.3, 0.4); ctx.save(); ctx.translate(1480, 520); ctx.globalAlpha *= 0.4 + 0.6 * kp; ctx.strokeStyle = N.cyan; ctx.lineWidth = 6; ctx.shadowColor = N.cyan; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(0, 0, 130, 0, TAU); ctx.stroke(); ctx.rotate(t * (2 + 26 * kp));
    ctx.fillStyle = D.hexA(N.cyan, 0.8); for (let i = 0; i < 5; i++) { ctx.rotate(TAU / 5); ctx.beginPath(); ctx.ellipse(0, -62, 30, 60, 0.4, 0, TAU); ctx.fill(); } ctx.restore();
    ctx.save(); ctx.globalAlpha *= kp; txt(ctx, "kipas berisik", 1480, 720, 46, { align: "center", weight: 800 }); ctx.restore();
    const ph = ramp(l, tPan - 0.2, 0.6); if (ph > 0) { ctx.save(); ctx.globalAlpha *= ph; ctx.strokeStyle = N.orange; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.shadowColor = N.orange; ctx.shadowBlur = 14;
      for (let i = 0; i < 4; i++) { const x = 480 + i * 180; ctx.beginPath(); for (let k = 0; k <= 20; k++) { const y = 300 - k * 8 - (t * 60 % 40); ctx.lineTo(x + Math.sin(k * 0.6 + t * 4 + i) * 14, y); } ctx.stroke(); } ctx.restore(); }
    U.tag(ctx, "semuanya lambat", 1480, 820, l, tLam, { col: N.red, size: 46 });
    D.post(c => U.judulPop(c, "Tanda ada crypto miner tersembunyi", W / 2, TY, 60, l, 0.3, { col: N.orange }));
  };

  S.b3_6 = function (ctx, b, l, t) {
    const tNet = D.at(b, "Peneliti Netcraft"), t100 = D.at(b, "seratus dolar"), tSet = D.at(b, "Setelah membayar"), tExe = D.at(b, "berkas bernama"), t34 = D.at(b, "tiga puluh empat");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 400 });
    const dua = eio(ramp(l, tExe - 0.5, 0.7));
    ctx.save(); ctx.globalAlpha *= 1 - dua;
    const r = U.browser(ctx, 260, 250, 1000, 640, { url: "aktivasi-gta6.contoh" });
    ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.fillStyle = "#2A0F45"; ctx.fillRect(r.x, r.y, r.w, r.h);
    txt(ctx, "Aktifkan GTA 6 kamu", r.x + r.w / 2, r.y + 90, 56, { align: "center", weight: 900 }); txt(ctx, "Bayar dengan kripto:", r.x + r.w / 2, r.y + 170, 46, { align: "center", weight: 700, color: N.ink2 });
    const p1 = U.pop(l, t100 - 0.1); if (p1.a > 0) { ctx.save(); ctx.globalAlpha *= p1.a; U.neon(ctx, "$100", r.x + r.w / 2, r.y + 310, 120, N.gold, { align: "center" }); ctx.restore(); }
    U.tombol(ctx, "BAYAR", r.x + r.w / 2, r.y + 420, 360, 100, N.green, { pulse: l < tSet, t, size: 50 }); ctx.restore();
    // dompet terkuras
    const dw = ramp(l, tSet - 0.2, 0.5); if (dw > 0) { ctx.save(); ctx.globalAlpha *= dw; const x = 1530, y = 560; ctx.fillStyle = "#3B2416"; ctx.strokeStyle = N.gold; ctx.lineWidth = 6; RR(ctx, x - 170, y - 110, 340, 220, 24); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 5; i++) { const u = clamp((l - tSet - i * 0.25) / 1.2), cx = lerp(x, x + 120 - i * 60, u), cy = lerp(y, y - 300, eout(u)); if (u < 1) U.koin(ctx, cx, cy, 30 * (1 - u * 0.5), N.gold, "$"); }
      txt(ctx, "tidak dapat apa-apa", x, y + 190, 46, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
    ctx.restore();
    if (dua > 0) { ctx.save(); ctx.globalAlpha *= dua;
      U.berkas(ctx, 560, 520, 300, { jenis: "exe", t, mata: true, nama: "GTAVI.exe", size: 56 });
      const k = eout(ramp(l, t34 - 0.3, 1.6)), n = Math.round(34 * k);
      U.panel(ctx, 900, 330, 820, 420, { col: N.red }); txt(ctx, "Ditandai trojan oleh", 1310, 410, 48, { align: "center", weight: 800, color: N.ink2 });
      U.neon(ctx, n + " / 68", 1310, 560, 130, N.red, { align: "center" }); txt(ctx, "antivirus", 1310, 640, 48, { align: "center", weight: 800, color: N.ink2 });
      for (let i = 0; i < 68; i++) { const on = i < n; ctx.fillStyle = on ? N.red : "rgba(255,255,255,0.15)"; ctx.fillRect(950 + (i % 34) * 21.5, 680 + Math.floor(i / 34) * 26, 16, 18); }
      ctx.restore(); }
    D.post(c => { U.sumber(c, l, tNet, "Netcraft"); U.judulPop(c, "Situs \"aktivasi\" yang minta bayaran kripto", W / 2, TY, 58, l, tNet, { col: N.red, a: 1 - dua }); U.judulPop(c, "Berkas GTAVI.exe ternyata trojan", W / 2, TY, 60, l, tExe, { col: N.red }); });
  };

  U.reg(3, S);
})(typeof window !== "undefined" ? window : globalThis);
