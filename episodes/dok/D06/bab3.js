/* D06 bab 3 — Burung kenari di tambang (b3_1 … b3_8). Sumber: Brynjolfsson, Chandar, Chen, "Canaries in the Coal Mine?" (Stanford Digital Economy Lab, versi Agustus 2026).
   Orang sungguhan tidak digambar: peneliti tampil sebagai nama pada sampul makalah. Grafik bersifat skematis; hanya angka 19% yang berasal dari makalah. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, TAU = U.TAU;

  U.kenari = function (ctx, x, y, s, t, o = {}) {   // (x, y) = kaki; sing 0..1
    const sing = o.sing == null ? 1 : o.sing, bob = Math.sin(t * 6) * s * 0.03 * sing; ctx.save(); ctx.translate(x, y + bob); if (o.droop) ctx.rotate(o.droop * 0.5);
    ctx.fillStyle = "#F2B632"; ctx.beginPath(); ctx.ellipse(0, -s * 0.36, s * 0.34, s * 0.28, -0.25, 0, TAU); ctx.fill();   // badan
    ctx.fillStyle = "#E09A1E"; ctx.beginPath(); ctx.moveTo(-s * 0.26, -s * 0.34); ctx.lineTo(-s * 0.66, -s * 0.2); ctx.lineTo(-s * 0.3, -s * 0.18); ctx.closePath(); ctx.fill();   // ekor
    ctx.beginPath(); ctx.ellipse(-s * 0.04, -s * 0.34, s * 0.2, s * 0.13, 0.4, 0, TAU); ctx.fill();   // sayap
    ctx.fillStyle = "#FFCF4A"; ctx.beginPath(); ctx.arc(s * 0.24, -s * 0.62, s * 0.19, 0, TAU); ctx.fill();   // kepala
    ctx.fillStyle = "#10142E"; ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.66, s * 0.035, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FF8A3C"; const op = sing > 0.3 ? 0.07 * (0.5 + 0.5 * Math.sin(t * 12)) : 0; ctx.beginPath(); ctx.moveTo(s * 0.4, -s * 0.66 - s * op); ctx.lineTo(s * 0.56, -s * 0.61); ctx.lineTo(s * 0.4, -s * 0.57 + s * op); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#B36B1A"; ctx.lineWidth = s * 0.03; ctx.beginPath(); ctx.moveTo(-s * 0.05, -s * 0.1); ctx.lineTo(-s * 0.05, 0); ctx.moveTo(s * 0.08, -s * 0.1); ctx.lineTo(s * 0.08, 0); ctx.stroke(); ctx.restore();
  };
  function sangkar(ctx, x, y, w, h) {
    ctx.strokeStyle = "#C9B27A"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - h * 0.62); ctx.quadraticCurveTo(x - w / 2, y - h, x, y - h); ctx.quadraticCurveTo(x + w / 2, y - h, x + w / 2, y - h * 0.62); ctx.lineTo(x + w / 2, y); ctx.stroke();
    for (let i = 1; i < 6; i++) { const xx = x - w / 2 + i * w / 6, top = y - h + Math.abs(xx - x) / (w / 2) * h * 0.28; ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx, top); ctx.stroke(); }
    ctx.fillStyle = "#8A6A3C"; RR(ctx, x - w / 2 - 10, y, w + 20, 20, 8); ctx.fill(); ctx.beginPath(); ctx.arc(x, y - h - 16, 14, 0, TAU); ctx.stroke(); ctx.fillStyle = "#8A6A3C"; ctx.fillRect(x - w * 0.36, y - h * 0.22, w * 0.72, 8);
  }
  function tambang(ctx, t, gas) {
    const gr = ctx.createLinearGradient(0, 0, 0, 1080); gr.addColorStop(0, "#1A1626"); gr.addColorStop(1, "#2C2436"); ctx.fillStyle = gr; ctx.fillRect(0, 0, 1920, 1080);
    ctx.fillStyle = "#3A3040"; ctx.beginPath(); ctx.moveTo(0, 1080); ctx.lineTo(0, 300); ctx.quadraticCurveTo(960, -160, 1920, 300); ctx.lineTo(1920, 1080); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#231C2C"; ctx.beginPath(); ctx.ellipse(960, 640, 420, 380, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#6E4E32"; [[240, 160], [1560, 160]].forEach(([x]) => { ctx.fillRect(x, 200, 60, 700); }); ctx.fillRect(200, 170, 1520, 56);
    ctx.fillStyle = "#4A3C52"; ctx.fillRect(0, 880, 1920, 200);
    ctx.strokeStyle = "#8A7A6A"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(700, 1080); ctx.lineTo(900, 880); ctx.moveTo(1220, 1080); ctx.lineTo(1020, 880); ctx.stroke();
    D.glow(ctx, 420, 330, 420, P.warm, 0.4 + 0.05 * Math.sin(t * 7)); ctx.fillStyle = "#FFD38A"; RR(ctx, 396, 300, 48, 62, 10); ctx.fill();
    if (gas > 0) { for (let i = 0; i < 9; i++) { const x = 1300 - i * 120 * gas + Math.sin(t + i) * 30, y = 520 + Math.sin(t * 0.7 + i * 2) * 120; D.glow(ctx, x, y, 240, "#8FD14F", 0.16 * gas); } }
  }
  S.b3_1 = function (ctx, b, l, t) {
    const tB = D.at(b, "burung kenari"), tG = D.at(b, "gas beracun"), tS = D.at(b, "berhenti berkicau"), tK = D.at(b, "segera keluar");
    const gas = ramp(l, tG, 2), sing = 1 - ramp(l, tS - 0.2, 0.6);
    tambang(ctx, t, gas);
    // penambang (siluet, tanpa ciri)
    [[1320, 880, 300], [1500, 890, 280]].forEach(([x, y, s], i) => { const run = eio(ramp(l, tK, 1.6)); U.orang(ctx, x + run * 500, y, s, "#58506A", 1); ctx.fillStyle = "#FFD38A"; ctx.beginPath(); ctx.arc(x + run * 500, y - s * 0.95, s * 0.08, 0, TAU); ctx.fill(); });
    const a = eout(ramp(l, tB - 0.5, 0.6)); ctx.save(); ctx.globalAlpha *= a; sangkar(ctx, 820, 760, 260, 340); U.kenari(ctx, 815, 690, 150, t, { sing, droop: 1 - sing }); ctx.restore();
    if (sing > 0.1 && a > 0.5) for (let i = 0; i < 3; i++) { const u = (t * 0.6 + i / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - u) * sing; txt(ctx, "♪", 900 + u * 120 + i * 30, 560 - u * 140, 64, { color: P.warm }); ctx.restore(); }
    D.post(c => {
      U.tagPop(c, "burung kenari", 820, 360, l, tB, { col: P.amber, size: 52, a: 1 - ramp(l, tS, 0.4) });
      U.tagPop(c, "peka terhadap gas beracun", 1080, 300, l, tG, { col: P.green, size: 48, a: 1 - ramp(l, tS, 0.4) });
      U.tagPop(c, "berhenti berkicau = tanda bahaya", 900, 300, l, tS, { col: P.red, size: 54 });
      U.tagPop(c, "keluar!", 1620, 560, l, tK, { col: P.amber, size: 60 });
    });
  };

  S.b3_2 = function (ctx, b, l, t) {
    const tSt = D.at(b, "Universitas Stanford"), tn = [D.at(b, "Erik Brynjolfsson"), D.at(b, "Bharat Chandar"), D.at(b, "Ruyu Chen")], tC = D.at(b, "siapa burung kenari"), tP = D.at(b, "paling dulu");
    U.latar(ctx, t, { col: P.red, gx: 400, gy: 400, ga: 0.2 });
    const a = eout(ramp(l, tSt - 0.4, 0.6)); ctx.save(); ctx.globalAlpha *= a; ctx.translate(520, 520 + (1 - a) * 40); ctx.rotate(-0.03);
    ctx.fillStyle = "rgba(0,0,0,0.3)"; RR(ctx, -330, -270, 680, 560, 16); ctx.fill(); ctx.fillStyle = "#F4F1E8"; RR(ctx, -340, -280, 680, 560, 16); ctx.fill();
    txt(ctx, "Canaries in the", 0, -180, 62, { align: "center", weight: 900, color: "#1A1A2E" }); txt(ctx, "Coal Mine?", 0, -110, 62, { align: "center", weight: 900, color: "#1A1A2E" });
    ctx.fillStyle = "#B03A2E"; ctx.fillRect(-120, -80, 240, 6);
    ["Erik Brynjolfsson", "Bharat Chandar", "Ruyu Chen"].forEach((s, i) => { const k = ramp(l, tn[i] - 0.1, 0.3); ctx.save(); ctx.globalAlpha *= 0.25 + 0.75 * k; txt(ctx, s, 0, 0 + i * 62, 46, { align: "center", weight: 800, color: "#2A2A44" }); ctx.restore(); });
    txt(ctx, "Stanford Digital Economy Lab", 0, 230, 40, { align: "center", weight: 700, color: "#5A5A72" }); ctx.restore();
    // pasar kerja: kerumunan piktogram, satu kelompok disorot
    const aC = ramp(l, tC - 0.4, 0.5); if (aC > 0) { U.panel(ctx, 1010, 260, 790, 520); const r = D.rng(3);
      for (let i = 0; i < 24; i++) { const q = i % 8, rr = Math.floor(i / 8), young = rr === 2 && q < 3, hi = young ? eio(ramp(l, tP, 0.5)) : 0; U.orang(ctx, 1090 + q * 90, 430 + rr * 150, 120, hi > 0.5 ? P.amber : D.hexA(P.ink2, 0.6), aC); }
      U.sorot(ctx, 1040, 600, 300, 150, ramp(l, tP, 0.4)); }
    D.post(c => { U.judulPop(c, "Siapa \"burung kenari\" di pasar kerja?", 960, 150, 64, l, tC - 0.3, { col: P.amber }); U.tagPop(c, "yang paling dulu merasakan dampak AI", 1380, 800, l, tP, { col: P.amber, size: 44 }); });
    U.kenari(ctx, 880, 800, 110, t, { sing: 1 });
  };

  S.b3_3 = function (ctx, b, l, t) {
    const tD = D.at(b, "data gaji"), tJ = D.at(b, "jutaan pekerja"), tT = D.at(b, "pertengahan tahun"), tL = D.at(b, "melegakan"), tPHK = D.at(b, "tidak menemukan bukti");
    U.latar(ctx, t, { col: P.teal, gx: 500, gy: 500 });
    const r = D.rng(21); for (let i = 0; i < 40; i++) { const a = ramp(l, tD - 0.3 + i * 0.05, 0.3); if (a <= 0) continue; const x = 160 + (i % 10) * 82, y = 300 + Math.floor(i / 10) * 118; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "#EEF2FF"; RR(ctx, x, y, 64, 92, 8); ctx.fill(); ctx.fillStyle = "rgba(40,50,100,0.4)"; RR(ctx, x + 10, y + 14, 44, 8, 4); ctx.fill(); RR(ctx, x + 10, y + 32, 30, 8, 4); ctx.fill(); ctx.fillStyle = P.green; RR(ctx, x + 10, y + 62, 44, 14, 6); ctx.fill(); ctx.restore(); }
    const p = U.pop(l, tPHK - 0.1); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(1430, 510); const k = lerp(0.85, 1, p.sp); ctx.scale(k, k); U.panel(ctx, -370, -200, 740, 400, { stroke: D.hexA(P.green, 0.9), lw: 5 });
      txt(ctx, "Tidak ada bukti", 0, -30, 66, { align: "center", weight: 900 }); txt(ctx, "PHK besar-besaran", 0, 50, 66, { align: "center", weight: 900, color: P.green }); txt(ctx, "di seluruh ekonomi", 0, 126, 50, { align: "center", weight: 800, color: P.ink2 }); ctx.restore(); U.centang(ctx, 1430, 340, 44, (l - tPHK - 0.2) / 0.4); }
    D.post(c => { U.judulPop(c, "Data gaji jutaan pekerja di Amerika Serikat", 960, 150, 62, l, tD - 0.3, { col: P.teal }); U.tagPop(c, "sampai Juni 2026", 1430, 758, l, tT, { col: P.teal, size: 48 }); U.sumber(c, l, tD, "Brynjolfsson, Chandar, Chen (Stanford, 2026), data ADP"); });
  };

  // grafik dua garis: kurang terpapar vs paling terpapar (skematis)
  function duaGaris(ctx, l, t0, tTurun, o = {}) {
    const x = 330, y = 270, w = 1100, h = 440; U.panel(ctx, x - 150, y - 60, w + 250, h + 150);
    U.sumbu(ctx, x, y, w, h, [[0.1, ""], [0.5, ""], [0.9, ""]]); txt(ctx, "akhir 2022", x + 40, y + h + 56, 40, { weight: 700, color: P.ink2 }); txt(ctx, "pertengahan 2026", x + w - 20, y + h + 56, 40, { weight: 700, color: P.ink2, align: "right" });
    const A = [], B = []; for (let i = 0; i <= 28; i++) { const u = i / 28; A.push([x + 40 + u * (w - 80), y + h * 0.42 - u * h * 0.14 + Math.sin(i * 1.3) * 4]); B.push([x + 40 + u * (w - 80), y + h * 0.42 + (o.sama ? -u * h * 0.12 + Math.sin(i * 1.7) * 5 : (u < 0.35 ? -u * h * 0.05 : -0.0175 * h + Math.pow((u - 0.35) / 0.65, 1.25) * h * 0.36))]); }
    const k1 = eio(ramp(l, t0, 2)), k2 = eio(ramp(l, tTurun, 2.4));
    const e1 = U.garis(ctx, A, k1, P.blue, 10), e2 = U.garis(ctx, B, k2, o.sama ? P.teal : P.red, 12);
    if (k1 > 0) U.titik(ctx, e1[0], e1[1], 14, P.blue); if (k2 > 0) U.titik(ctx, e2[0], e2[1], 16, o.sama ? P.teal : P.red);
    return { e1, e2, k2, xEnd: x + w - 40 };
  }
  S.b3_4 = function (ctx, b, l, t) {
    const tM = D.at(b, "Pekerja muda"), tP = D.at(b, "paling terpapar AI"), t19 = D.at(b, "sembilan belas persen"), tK = D.at(b, "kurang terpapar");
    U.latar(ctx, t, { col: P.red, gx: 1400, gy: 600, ga: 0.2 });
    const G = duaGaris(ctx, l, tM - 0.3, tP - 0.2);
    const kg = eio(ramp(l, t19 - 0.2, 0.6)); if (kg > 0 && G.k2 > 0.95) { ctx.save(); ctx.globalAlpha *= kg; ctx.strokeStyle = P.amber; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(G.xEnd + 40, G.e1[1]); ctx.lineTo(G.xEnd + 40, G.e2[1]); ctx.stroke(); ctx.restore(); }
    D.post(c => {
      U.judulPop(c, "Pekerja muda, usia 22–25 tahun", 880, 130, 64, l, tM - 0.3, { col: P.amber });
      U.tagPop(c, "pekerjaan kurang terpapar AI", 760, 300, l, tM + 1.2, { col: P.blue, size: 44 });
      U.tagPop(c, "pekerjaan paling terpapar AI", 800, 640, l, tP + 0.6, { col: P.red, size: 44 });
      const p = U.pop(l, t19); if (p.a > 0) { c.save(); c.globalAlpha *= p.a; U.panel(c, 1500, 380, 330, 260, { stroke: D.hexA(P.amber, 0.9), lw: 5 }); U.angka(c, "19%", 1665, 510, 120, P.amber, 1, { sp: p.sp }); txt(c, "di bawah", 1665, 590, 46, { align: "center", weight: 800 }); c.restore(); }
      U.sumber(c, l, tM, "Brynjolfsson, Chandar, Chen (2026); bentuk garis skematis");
    });
  };
  S.b3_5 = function (ctx, b, l, t) {
    const tB = D.at(b, "berpengalaman"), tT = D.at(b, "tidak mengalami");
    U.latar(ctx, t, { col: P.teal, gx: 1400, gy: 400 });
    const G = duaGaris(ctx, l, 0.3, 0.5, { sama: true });
    D.post(c => { U.judulPop(c, "Pekerja berpengalaman, pekerjaan yang sama", 880, 130, 62, l, tB - 0.5, { col: P.teal }); U.tagPop(c, "tidak ada jurang serupa", 880, 640, l, tT, { col: P.teal, size: 52 }); U.sumber(c, l, 0.4, "Brynjolfsson, Chandar, Chen (2026); bentuk garis skematis"); });
    U.centang(ctx, 1665, 500, 70, (l - tT) / 0.4, P.teal);
  };

  S.b3_6 = function (ctx, b, l, t) {
    const tP = D.at(b, "tidak banyak dipecat"), tR = D.at(b, "merekrut lebih sedikit"), tS = D.at(b, "pintu masuknya");
    U.latar(ctx, t, { col: P.amber, gx: 960, gy: 500, ga: 0.2 });
    // kantor (kanan) dan antrean pelamar (kiri), pintu di tengah menyempit
    U.panel(ctx, 1000, 260, 800, 520, { stroke: D.hexA(P.blue, 0.7) }); txt(ctx, "Perusahaan", 1400, 330, 52, { align: "center", weight: 900, color: P.blue });
    for (let i = 0; i < 8; i++) U.orang(ctx, 1110 + (i % 4) * 170, 560 + Math.floor(i / 4) * 170, 150, P.blue, ramp(l, 0.3 + i * 0.06, 0.3), { laptop: true });
    const sempit = eio(ramp(l, tR - 0.2, 1.6)), dw = lerp(170, 54, sempit), dy = 520;
    ctx.fillStyle = "#0B1236"; ctx.fillRect(1000 - 14, dy - 170, 28, 340); ctx.fillStyle = P.amber; RR(ctx, 1000 - 16, dy - dw, 32, dw * 2, 10); ctx.fill(); D.glow(ctx, 1000, dy, 60 + dw, P.amber, 0.5);
    for (let i = 0; i < 6; i++) { const base = 860 - i * 130; const adv = i === 0 ? eio(ramp(l, 1.2, 1.2)) * (sempit < 0.3 ? 1 : 0) : 0; U.orang(ctx, base + Math.sin(t * 2 + i) * 4, 640, 170, i === 0 ? P.amber : D.hexA(P.amber, 0.7), ramp(l, 0.4 + i * 0.1, 0.3)); }
    D.post(c => {
      U.judulPop(c, "Penyebabnya: bukan pemecatan", 960, 150, 66, l, 0.3, { col: P.amber });
      U.tagPop(c, "yang di dalam: tidak banyak dipecat", 1400, 800 - 26, l, tP, { col: P.blue, size: 44 });
      U.tagPop(c, "perekrutan orang baru berkurang", 520, 400, l, tR, { col: P.red, size: 48 });
      U.tagPop(c, "pintu masuk menyempit", 520, 800 - 26, l, tS, { col: P.amber, size: 54 });
    });
  };

  // dua jalur (dipakai lagi di bab 5)
  U.duaJalur = function (ctx, l, tG, tB, o = {}) {
    const defs = [[150, "AI menggantikan tugas manusia", P.red, tG, -1], [1000, "AI membantu manusia", P.green, tB, 1]];
    defs.forEach(([x, s, col, tt, dir]) => { const a = eout(ramp(l, tt - 0.3, 0.5)); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - a) * 30); U.panel(ctx, x, 270, 770, 500, { stroke: D.hexA(col, 0.85), lw: 4 });
      txt(ctx, s, x + 385, 350, 48, { align: "center", weight: 900, color: col, fit: 700 });
      const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([x + 90 + u * 590, 540 + (dir < 0 ? Math.pow(u, 1.4) * 150 : -u * 70 + Math.sin(i) * 5)]); }
      ctx.strokeStyle = "rgba(242,246,255,0.3)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 90, 720); ctx.lineTo(x + 680, 720); ctx.stroke();
      const e = U.garis(ctx, pts, eio(ramp(l, tt + 0.2, 1.8)), col, 12); U.titik(ctx, e[0], e[1], 14, col);
      txt(ctx, "lapangan kerja", x + 90, 450, 40, { weight: 700, color: P.ink2 }); ctx.restore(); });
  };
  S.b3_7 = function (ctx, b, l, t) {
    const tK = D.at(b, "kunci"), tG = D.at(b, "menggantikan tugas"), tB = D.at(b, "membantu manusia"), tN = D.at(b, "tetap datar");
    U.latar(ctx, t, { col: P.violet, gx: 960, gy: 300 });
    const ak = eout(ramp(l, 0.4, 0.6)) * (1 - ramp(l, tG - 0.6, 0.4)); if (ak > 0) { ctx.save(); ctx.globalAlpha *= ak; ctx.translate(960, 500 + Math.sin(t * 2) * 8); ctx.rotate(-0.5); D.glow(ctx, 0, 0, 380, P.amber, 0.45);
      ctx.strokeStyle = P.amber; ctx.lineWidth = 34; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(-150, 0, 90, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(250, 0); ctx.moveTo(170, 0); ctx.lineTo(170, 70); ctx.moveTo(240, 0); ctx.lineTo(240, 90); ctx.stroke(); ctx.restore(); }
    U.duaJalur(ctx, l, tG, tB);
    D.post(c => { U.judulPop(c, "Temuan kunci", 960, 150, 72, l, tK - 0.5, { col: P.amber }); U.tagPop(c, "turun", 720, 470, l, tG + 1.4, { col: P.red, size: 50 }); U.tagPop(c, "datar, bahkan naik", 1500, 650, l, tN, { col: P.green, size: 46 }); U.sumber(c, l, tG, "Brynjolfsson, Chandar, Chen (2026); skematis"); });
  };

  S.b3_8 = function (ctx, b, l, t) {
    const ts = [D.at(b, "tanda awal"), D.at(b, "bukan bukti"), D.at(b, "datanya dari Amerika")], tP = D.at(b, "pesannya jelas"), tK = D.at(b, "posisi burung kenari");
    U.latar(ctx, t, { col: P.amber, gx: 960, gy: 600, ga: 0.22 });
    const fo = 1 - 0.7 * ramp(l, tP - 0.2, 0.5);
    const kk = Math.max(0.4 * ramp(l, 0.5, 0.6), eout(ramp(l, tP, 0.8))); if (kk > 0) { ctx.save(); ctx.globalAlpha *= kk; sangkar(ctx, 960, 760, 300, 360); U.kenari(ctx, 955, 690, 170, t, { sing: 0.2 + 0.8 * (1 - ramp(l, tK, 0.5)) }); ctx.restore(); }
    D.post(c => {
      U.judulPop(c, "Catatan dari para peneliti", 960, 140, 60, l, 0.3, { col: P.ink2, a: fo });
      [["masih tanda awal", P.amber], ["bukan bukti sebab-akibat", P.violet], ["data dari Amerika Serikat", P.blue]].forEach(([s, col], i) => U.tagPop(c, s, [290, 905, 1545][i], 262, l, ts[i], { col, size: 40, a: fo }));
      U.tagPop(c, "pekerjaan yang hanya berisi tugas yang bisa dikerjakan AI", 960, 830 - 30, l, tK - 1.6, { col: P.red, size: 46 });
    });
  };

  U.reg(3, S);
})(typeof window !== "undefined" ? window : globalThis);
