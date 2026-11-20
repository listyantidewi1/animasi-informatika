/* R01 — gambar: tokoh (Rani, Bayu, Tegar), layar alat generik (editor, terminal, Git), dan gambar kecil per konsep.
   Semua digambar dengan kode; layar aplikasi generik tanpa logo. pic.<nama>(ctx, b, l, t, B, p): B = kotak {x,y,w,h}, p = parameter dari vis.py. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P;
  const { clamp, lerp, eio, eout, spring } = D; const { ramp, txt, RR } = U; const TAU = U.TAU;
  const R = K.r01 = {}; const pic = R.pic = {};
  // waktu dari kunci: null = sejak awal, "-" = tidak pernah, "frasa@+1.2" = geser
  const T = R.T = (b, k) => { if (k == null) return -9; if (k === "-") return 1e9; if (typeof k === "number") return k; const m = /^(.*)@([+-][\d.]+)$/.exec(k); return m ? D.at(b, m[1]) + parseFloat(m[2]) : D.at(b, k); };
  R.COL = n => P[n] || n || P.amber;
  const pop = (l, t0) => U.pop(l, t0);
  const INK = "#10142E", KERTAS = "#F3F1E7";
  function popAt(ctx, x, y, p, fn) { if (p.a <= 0.01) return; ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(x, y); const k = lerp(0.82, 1, p.sp); ctx.scale(k, k); fn(); ctx.restore(); }
  const pil = (ctx, s, cx, cy, col, size = 40, ink = INK) => { ctx.font = `800 ${size}px ${K.FONT}`; const w = ctx.measureText(s).width + size * 1.1, h = size * 1.7; ctx.fillStyle = col; RR(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill(); txt(ctx, s, cx, cy + size * 0.35, size, { align: "center", weight: 800, color: ink }); return w; };
  R.pil = pil; R.popAt = popAt;

  // ---------- tokoh: dada ke atas; (x, y) = dasar, s = tinggi ----------
  const TK = { Rani: [P.pink, "#2A1B3D"], Bayu: [P.teal, "#1B1B2A"], Tegar: [P.amber, "#2B2118"] };
  R.STATUS = { Rani: "Kelas 11 SMA", Bayu: "SMK jurusan RPL", Tegar: "Mahasiswa semester 3" };
  R.tokoh = function (ctx, x, y, s, nama, t, a = 1) {
    const c = TK[nama]; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + Math.sin(t * 1.4 + x) * s * 0.008);
    ctx.fillStyle = c[0]; RR(ctx, -s * 0.37, -s * 0.42, s * 0.74, s * 0.42 + 2, s * 0.15); ctx.fill(); ctx.fillRect(-s * 0.37, -s * 0.2, s * 0.74, s * 0.2);
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.42); ctx.lineTo(0, -s * 0.3); ctx.lineTo(s * 0.1, -s * 0.42); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#E3B58C"; ctx.fillRect(-s * 0.065, -s * 0.52, s * 0.13, s * 0.12);
    if (nama === "Rani") { ctx.fillStyle = c[1]; RR(ctx, -s * 0.26, -s * 0.95, s * 0.52, s * 0.62, s * 0.22); ctx.fill(); }
    ctx.fillStyle = "#F4CBA4"; ctx.beginPath(); ctx.arc(0, -s * 0.68, s * 0.2, 0, TAU); ctx.fill();
    ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, -s * 0.735, s * 0.212, Math.PI, TAU); ctx.closePath(); ctx.fill();
    if (nama === "Bayu") { ctx.beginPath(); ctx.moveTo(-s * 0.21, -s * 0.74); ctx.lineTo(-s * 0.02, -s * 0.94); ctx.lineTo(s * 0.21, -s * 0.74); ctx.closePath(); ctx.fill(); }
    const bl = (t * 0.37 + x * 0.01) % 1 > 0.96 ? 0.15 : 1; ctx.fillStyle = "#1A1A2E";
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * s * 0.078, -s * 0.665, s * 0.024, s * 0.03 * bl, 0, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = "#8A4B3A"; ctx.lineWidth = s * 0.018; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, -s * 0.62, s * 0.07, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    if (nama === "Tegar") { ctx.strokeStyle = "#1A1A2E"; ctx.lineWidth = s * 0.014; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * s * 0.078, -s * 0.665, s * 0.058, 0, TAU); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(-s * 0.02, -s * 0.665); ctx.lineTo(s * 0.02, -s * 0.665); ctx.stroke(); }
    ctx.restore();
  };

  // ---------- bagian kecil ----------
  function hpBingkai(ctx, cx, y, w, h, isi = "#F3F6FF") { const x = cx - w / 2; ctx.fillStyle = "rgba(0,0,0,0.3)"; RR(ctx, x + 10, y + 14, w, h, 46); ctx.fill(); ctx.fillStyle = "#0B1030"; RR(ctx, x, y, w, h, 46); ctx.fill(); ctx.strokeStyle = "rgba(242,246,255,0.4)"; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = isi; RR(ctx, x + 16, y + 16, w - 32, h - 32, 32); ctx.fill(); return x; }
  function kertas(ctx, x, y, w, h) { ctx.fillStyle = "rgba(0,0,0,0.3)"; RR(ctx, x + 10, y + 14, w, h, 18); ctx.fill(); ctx.fillStyle = KERTAS; RR(ctx, x, y, w, h, 18); ctx.fill(); }
  const bar = (ctx, x, y, w, h, col) => { ctx.fillStyle = col; RR(ctx, x, y, w, h, h / 2); ctx.fill(); };
  function terminal(ctx, B, h, title) { U.jendela(ctx, B.x, B.y + 10, B.w, h, title, { fill: "#070B1E" }); }
  const latest = (l, ts) => { let k = -1, m = -1e9; ts.forEach((v, i) => { if (v <= l && v > m && v > -5) { m = v; k = i; } }); return k; };
  R.latest = latest;

  // ---------- HP patungan (hook, bab 7) ----------
  pic.hp = function (ctx, b, l, t, B, p) {
    const cx = B.x + B.w / 2, w = 400, h = 540, y = B.y + 10, tm = T(b, p.minus), tv = p.voucher === undefined ? -9 : T(b, p.voucher), neg = l >= tm;
    const sh = neg && tm > -5 ? Math.sin((l - tm) * 40) * 9 * Math.exp(-(l - tm) * 4) : 0; ctx.save(); ctx.translate(sh, 0);
    const x = hpBingkai(ctx, cx, y, w, h); ctx.fillStyle = P.teal; RR(ctx, x + 16, y + 16, w - 32, 86, 32); ctx.fill(); ctx.fillRect(x + 16, y + 62, w - 32, 40);
    txt(ctx, "Patungan", cx, y + 76, 44, { align: "center", weight: 900, color: INK });
    txt(ctx, "Belanja 90rb", x + 44, y + 160, 40, { weight: 800, color: "#2A3156" });
    const av = ramp(l, tv - 0.15, 0.3); if (av > 0) { ctx.save(); ctx.globalAlpha *= av; txt(ctx, "Voucher 105rb", x + 44, y + 214, 40, { weight: 800, color: "#0E8A5F" }); ctx.restore(); }
    ctx.fillStyle = "#C9D0E8"; ctx.fillRect(x + 40, y + 238, w - 80, 4);
    [P.pink, P.blue, P.amber].forEach((c, i) => { const yy = y + 300 + i * 80; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 74, yy - 14, 28, 0, TAU); ctx.fill();
      if (neg) { const pu = 0.5 + 0.5 * Math.sin(t * 5); ctx.fillStyle = D.hexA(P.red, 0.14 + 0.1 * pu); RR(ctx, x + 116, yy - 52, w - 150, 72, 14); ctx.fill(); }
      txt(ctx, neg ? "-Rp 5.000" : "Rp 30.000", x + w - 44, yy, 44, { align: "right", weight: 900, color: neg ? "#D8262E" : "#1D2445" }); });
    ctx.restore();
  };
  // ---------- editor dengan kode diketik cepat ----------
  pic.editor = function (ctx, b, l, t, B, p) {
    const ts = T(b, p.salah); U.jendela(ctx, B.x, B.y + 10, B.w, 450, "app.js"); U.kode(ctx, B.x + 40, B.y + 110, B.w - 80, 8, 31, clamp((l - 0.3) / 3.2), { lh: 42 });
    if (l >= ts) { U.sorot(ctx, B.x + 26, B.y + 266, B.w - 52, 50, ramp(l, ts, 0.3), P.red); U.silang(ctx, B.x + B.w - 90, B.y + 290, 44, (l - ts) / 0.4); }
    D.post(c => U.tagPop(c, l >= ts ? "10 detik, dan bisa salah" : "selesai dalam 10 detik", B.x + B.w / 2, B.y + 516, l, 1.2, { col: l >= ts ? P.red : P.green, size: 44 }));
  };
  pic.kodeai = function (ctx, b, l, t, B) { ctx.fillStyle = "#0F1738"; RR(ctx, B.x, B.y, B.w, B.h, 18); ctx.fill(); U.kode(ctx, B.x + 30, B.y + 26, B.w - 60, 3, 12, (t * 0.9) % 4, { lh: 40 }); };
  pic.lowongan = function (ctx, b, l, t, B) {
    const cx = B.x + B.w / 2, y = B.y + 20 + Math.sin(t * 1.2) * 5; kertas(ctx, cx - 250, y, 500, 500);
    pil(ctx, "LOWONGAN", cx - 110, y + 70, P.amber, 40); txt(ctx, "Software", cx - 210, y + 190, 64, { weight: 900, color: INK }); txt(ctx, "Engineer", cx - 210, y + 262, 64, { weight: 900, color: INK });
    [300, 250, 340].forEach((w, i) => bar(ctx, cx - 210, y + 310 + i * 40, w, 18, "#C5C8D6")); pil(ctx, "Dicari", cx + 120, y + 440, P.teal, 40);
  };
  pic.sertifikat = function (ctx, b, l, t, B, p = {}) {
    const t0 = p.mulai ? T(b, p.mulai) - 0.2 : 0.4, cx = B.x + B.w / 2;
    [[-110, 60, -0.12], [90, 100, 0.1], [-60, 190, 0.05], [100, 240, -0.08], [0, 320, 0.02]].forEach(([dx, dy, r], i) => { const q = pop(l, t0 + i * 0.45), base = p.mulai && i < 2 ? { a: 1, sp: 1 } : q;
      popAt(ctx, cx + dx, B.y + dy + 80, base, () => { ctx.rotate(r); ctx.fillStyle = "rgba(0,0,0,0.25)"; RR(ctx, -172, -108, 360, 230, 12); ctx.fill(); ctx.fillStyle = "#FBF4DC"; RR(ctx, -180, -115, 360, 230, 12); ctx.fill(); ctx.strokeStyle = "#C9A227"; ctx.lineWidth = 6; RR(ctx, -166, -101, 332, 202, 8); ctx.stroke();
        bar(ctx, -110, -70, 220, 22, "#3A3F5C"); bar(ctx, -130, -22, 260, 12, "#B9B39A"); bar(ctx, -100, 8, 200, 12, "#B9B39A"); ctx.fillStyle = "#D8262E"; ctx.beginPath(); ctx.arc(110, 62, 28, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFD38A"; ctx.beginPath(); ctx.arc(110, 62, 15, 0, TAU); ctx.fill(); }); });
  };
  pic.ojek = function (ctx, b, l, t, B, p) {
    const cx = B.x + B.w / 2, w = 380, h = 540, y = B.y + 10, tt = T(b, p.tekan), x = hpBingkai(ctx, cx, y, w, h, "#E6EEDB");
    ctx.save(); RR(ctx, x + 16, y + 16, w - 32, h - 32, 32); ctx.clip(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(x, y + 150); ctx.lineTo(x + w, y + 230); ctx.moveTo(x + 130, y); ctx.lineTo(x + 220, y + h); ctx.moveTo(x, y + 360); ctx.lineTo(x + w, y + 330); ctx.stroke();
    const u = (t * 0.12) % 1; ctx.fillStyle = "#1FA971"; ctx.beginPath(); ctx.arc(x + u * w, y + 150 + u * 80, 14, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#D8262E"; ctx.beginPath(); ctx.arc(cx + 20, y + 250, 26, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx - 2, y + 262); ctx.lineTo(cx + 20, y + 308); ctx.lineTo(cx + 42, y + 262); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx + 20, y + 250, 10, 0, TAU); ctx.fill();
    const pr = l >= tt ? clamp(1 - (l - tt) / 0.35) : 0, k = 1 - 0.07 * pr; ctx.save(); ctx.translate(cx, y + h - 84); ctx.scale(k, k); ctx.fillStyle = l >= tt ? "#178A5B" : "#1FA971"; RR(ctx, -150, -42, 300, 84, 42); ctx.fill(); txt(ctx, "Pesan", 0, 16, 46, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore();
    if (l >= tt && l < tt + 1) { ctx.strokeStyle = D.hexA(P.amber, 1 - (l - tt)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, y + h - 84, 60 + (l - tt) * 200, 0, TAU); ctx.stroke(); }
  };
  // ---------- siklus enam langkah ----------
  const SIK = ["Memahami", "Merancang", "Menulis kode", "Menguji", "Merilis", "Merawat"], SIKC = [P.teal, P.blue, P.amber, P.green, P.pink, P.violet];
  pic.siklus = function (ctx, b, l, t, B, p) {
    const cx = B.x + B.w / 2, cy = B.y + B.h / 2, r = 200, ts = SIK.map((_, i) => i < (p.pre || 0) ? -9 : 1e9); (p.on || []).forEach(([k, i]) => ts[i] = T(b, k) - 0.2);
    ctx.strokeStyle = "rgba(242,246,255,0.16)"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    SIK.forEach((_, i) => { const j = (i + 1) % 6; if (l >= ts[i] && l >= ts[j] && (j !== 0 || p.pre >= 6)) { const a0 = -Math.PI / 2 + i * TAU / 6, k = clamp((l - Math.max(ts[i], ts[j])) / 0.5); ctx.strokeStyle = SIKC[i]; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(cx, cy, r, a0 + 0.3, a0 + 0.3 + (TAU / 6 - 0.6) * k); ctx.stroke(); } });
    let cur = latest(l, ts); const ss = p.sorot ? T(b, p.sorot[0]) - 0.2 : 1e9; if (l >= ss) cur = p.sorot[1];
    SIK.forEach((_, i) => { const a = -Math.PI / 2 + i * TAU / 6, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, on = l >= ts[i], q = on ? pop(l, ts[i]) : { a: 1, sp: 1 };
      if (i === cur) D.glow(ctx, x, y, 130 + 14 * Math.sin(t * 4), SIKC[i], 0.55);
      popAt(ctx, x, y, q, () => { ctx.fillStyle = on ? SIKC[i] : "#2B3A6E"; ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fill(); ctx.strokeStyle = on ? "#FFFFFF" : "rgba(242,246,255,0.25)"; ctx.lineWidth = 4; ctx.stroke(); txt(ctx, String(i + 1), 0, 20, 56, { align: "center", weight: 900, color: on ? INK : P.dim }); }); });
    if (p.putar) { const a = -Math.PI / 2 + t * 1.6; D.glow(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 70, P.ink, 0.8); txt(ctx, "berulang", cx, cy + 14, 44, { align: "center", weight: 900, color: P.amber }); }
    else if (cur >= 0) { txt(ctx, SIK[cur], cx, cy + (l >= ss ? -10 : 14), 42, { align: "center", weight: 900, color: SIKC[cur], fit: 290 }); if (l >= ss) txt(ctx, "dibantu AI", cx, cy + 44, 40, { align: "center", weight: 800 }); }
  };
  pic.mi = function (ctx, b, l, t, B, p) {
    const cx = B.x + B.w / 2, y = B.y + 150, tl = T(b, p.langkah);
    for (let i = 0; i < 3; i++) { ctx.strokeStyle = "rgba(242,246,255,0.5)"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); for (let k = 0; k <= 10; k++) { const yy = y - 40 - k * 9, xx = cx - 70 + i * 70 + Math.sin(k * 0.8 + t * 2 + i) * 10; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    ctx.fillStyle = "#E4572E"; ctx.beginPath(); ctx.ellipse(cx, y, 190, 130, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = "#FFE08A"; ctx.beginPath(); ctx.ellipse(cx, y, 190, 34, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#E8B93B"; ctx.lineWidth = 6; for (let i = 0; i < 5; i++) { ctx.beginPath(); for (let k = 0; k <= 12; k++) { const xx = cx - 150 + k * 25, yy = y - 12 + i * 6 + Math.sin(k * 1.3 + i * 2) * 6; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    ctx.fillStyle = "#B3421F"; RR(ctx, cx - 70, y + 122, 140, 22, 8); ctx.fill();
    ["1. Rebus air", "2. Masukkan mi", "3. Tunggu 3 menit"].forEach((s, i) => { const q = pop(l, tl + 0.3 + i * 0.7); popAt(ctx, cx, B.y + 350 + i * 72, q, () => { U.panel(ctx, -230, -34, 460, 62, { r: 16 }); txt(ctx, s, -200, 12, 42, { weight: 800 }); }); });
  };
  pic.bahasa = function (ctx, b, l, t, B, p) {
    const ts = p.ks.map(k => T(b, k) - 0.2), pos = [[B.x + 170, B.y + 90], [B.x + 330, B.y + 260], [B.x + 490, B.y + 430]], nm = ["Python", "JavaScript", "Java"], cl = [P.blue, P.amber, P.pink], cur = latest(l, ts.slice(0, 3)), gone = l >= ts[3];
    pos.forEach(([x, y], i) => { const q = i === 0 && ts[0] > 0.6 ? { a: 1, sp: 1 } : pop(l, ts[i]); ctx.save(); if (gone || (cur > i)) ctx.globalAlpha *= 0.4;
      popAt(ctx, x, y, q, () => { U.panel(ctx, -160, -55, 320, 110, { stroke: cl[i], lw: i === cur && !gone ? 6 : 3 }); txt(ctx, nm[i], 0, 16, 46, { align: "center", weight: 900, color: cl[i] }); }); ctx.restore();
      if (i < 2) U.panah(ctx, x + 60, y + 70, pos[i + 1][0] - 60, pos[i + 1][1] - 70, P.ink2, (l - ts[i + 1] + 0.4) / 0.4, 7); });
    U.silang(ctx, B.x + 330, B.y + 260, 80, (l - ts[3]) / 0.4);
  };
  pic.python = function (ctx, b, l, t, B, p) {
    const L = [['nama = "Rani"', 0, P.ink], ["if nilai > 75:", 1, P.amber], ['    print("Lulus")', 1, P.teal], ["for i in range(3):", 2, P.pink], ["    print(i)", 2, P.teal], ["def sapa(nama):", 3, P.violet]];
    const ts = p.ks.map(k => T(b, k) - 0.2), cur = latest(l, ts); U.jendela(ctx, B.x, B.y + 10, B.w, 490, "belajar.py");
    L.forEach(([s, gI, c], i) => { const y = B.y + 150 + i * 62; if (gI === cur) { ctx.fillStyle = D.hexA(P.amber, 0.2); RR(ctx, B.x + 16, y - 46, B.w - 32, 60, 10); ctx.fill(); }
      const n = Math.floor(clamp((l - 0.4 - i * 0.45) / 0.5) * s.length); txt(ctx, s.slice(0, n), B.x + 40, y, 42, { weight: 600, color: c }); });
  };
  pic.logika = function (ctx, b, l, t, B, p) {
    const ts = p.ks.map(k => T(b, k) - 0.2); U.panel(ctx, B.x, B.y + 10, B.w, 500);
    ctx.save(); ctx.globalAlpha *= l >= ts[0] + 0.5 ? 0.45 : 1; txt(ctx, "∫ dx", B.x + 70, B.y + 190, 130, { weight: 700, color: P.ink2 }); ctx.restore(); U.silang(ctx, B.x + 200, B.y + 140, 54, (l - ts[0] - 0.2) / 0.4);
    [["BENAR", P.green, 150, 300], ["SALAH", P.red, 430, 300], ["DAN", P.blue, 110, 410], ["ATAU", P.blue, 310, 410], ["TIDAK", P.blue, 520, 410]].forEach(([s, c, dx, dy], i) => popAt(ctx, B.x + dx, B.y + dy, pop(l, ts[1] + i * 0.3), () => pil(ctx, s, 0, 0, c, 44)));
    popAt(ctx, B.x + 440, B.y + 150, pop(l, ts[2]), () => txt(ctx, "%", 0, 46, 130, { align: "center", weight: 900, color: P.amber }));
    [0.5, 0.8, 0.6, 1].forEach((v, i) => U.batang(ctx, B.x + 530 + i * 28, B.y + 200, 20, 130 * v, P.teal, (l - ts[3] - i * 0.1) / 0.5, { r: 4 }));
  };
  pic.inggris = function (ctx, b, l, t, B, p) {
    const ta = T(b, p.arti) - 0.2; terminal(ctx, B, 330, "Terminal");
    txt(ctx, "NameError:", B.x + 40, B.y + 150, 44, { weight: 700, color: P.red }); txt(ctx, "name 'skor'", B.x + 40, B.y + 214, 44, { weight: 700 }); txt(ctx, "is", B.x + 40, B.y + 278, 44, { weight: 700 }); txt(ctx, "not defined", B.x + 96, B.y + 278, 44, { weight: 700, color: l >= ta ? P.amber : P.ink });
    if (l >= ta) { U.sorot(ctx, B.x + 84, B.y + 232, 280, 64, ramp(l, ta, 0.3)); U.panah(ctx, B.x + 224, B.y + 310, B.x + 224, B.y + 400, P.amber, (l - ta) / 0.4, 7); D.post(c => U.tagPop(c, "belum didefinisikan", B.x + 280, B.y + 460, l, ta + 0.3, { size: 44 })); }
  };
  pic.folder = function (ctx, b, l, t, B, p) {
    const ts = p.ks.map(k => T(b, k) - 0.2), cur = latest(l, ts), on = i => l >= ts[i]; U.jendela(ctx, B.x, B.y + 10, B.w, 360, "File");
    const row = (y, ind, isF, nm, ext) => { const x = B.x + 40 + ind; if (isF) { ctx.fillStyle = P.amber; RR(ctx, x, y - 34, 56, 42, 8); ctx.fill(); RR(ctx, x, y - 44, 28, 16, 6); ctx.fill(); } else { ctx.fillStyle = "#DDE6FF"; RR(ctx, x + 6, y - 44, 40, 52, 6); ctx.fill(); }
      txt(ctx, nm, x + 76, y, 44, { weight: 700 }); if (ext) { ctx.font = `700 44px ${K.FONT}`; const w = ctx.measureText(nm).width; txt(ctx, ext, x + 76 + w, y, 44, { weight: 900, color: on(1) ? P.amber : P.ink }); } };
    if (cur === 0) U.sorot(ctx, B.x + 22, B.y + 92, B.w - 44, 76, ramp(l, ts[0], 0.3)); if (cur === 1) U.sorot(ctx, B.x + 82, B.y + 176, B.w - 104, 172, ramp(l, ts[1], 0.3));
    row(B.y + 150, 0, 1, "proyek"); row(B.y + 234, 60, 0, "tugas", ".py"); row(B.y + 318, 60, 0, "catatan", ".txt");
    ["Ctrl+C", "Ctrl+V", "Ctrl+Z"].forEach((s, i) => popAt(ctx, B.x + 115 + i * 215, B.y + 450, pop(l, ts[2] + i * 0.25), () => { ctx.fillStyle = "#DDE6FF"; RR(ctx, -98, -42, 196, 84, 14); ctx.fill(); ctx.fillStyle = "#AEB9DC"; RR(ctx, -98, 30, 196, 12, 6); ctx.fill(); txt(ctx, s, 0, 12, 42, { align: "center", weight: 900, color: INK }); }));
  };
  pic.tukang = function (ctx, b, l, t, B, p) {
    const ts = p.ks.map(k => T(b, k) - 0.2); U.panel(ctx, B.x, B.y + 10, B.w, 250);
    popAt(ctx, B.x + 130, B.y + 140, pop(l, ts[0]), () => { ctx.scale(1.25, 1.25); ctx.fillStyle = "#B7C0DA"; ctx.beginPath(); ctx.moveTo(-20, -30); ctx.lineTo(95, -12); ctx.lineTo(95, 8); for (let i = 0; i < 8; i++) { ctx.lineTo(88 - i * 14, 22 + (i % 2) * 0); ctx.lineTo(81 - i * 14, 10); } ctx.lineTo(-20, 28); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#9A5B2E"; RR(ctx, -78, -36, 64, 72, 14); ctx.fill(); ctx.fillStyle = "#16224F"; RR(ctx, -62, -16, 30, 32, 8); ctx.fill(); });
    popAt(ctx, B.x + 340, B.y + 140, pop(l, ts[1]), () => { ctx.rotate(-0.35); ctx.fillStyle = "#9A5B2E"; RR(ctx, -11, -40, 22, 140, 8); ctx.fill(); ctx.fillStyle = "#8D98B8"; RR(ctx, -62, -80, 124, 50, 10); ctx.fill(); });
    popAt(ctx, B.x + 540, B.y + 140, pop(l, ts[2]), () => { ctx.fillStyle = "#C9D0E8"; ctx.fillRect(50, 26, 60, 18); ctx.fillStyle = P.amber; RR(ctx, -62, -62, 124, 124, 26); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill(); });
    const q = pop(l, ts[3]); if (q.a > 0) { ctx.save(); ctx.globalAlpha *= q.a; U.panel(ctx, B.x, B.y + 290, B.w, 250, { stroke: D.hexA(P.amber, 0.8) }); ctx.restore(); }
    popAt(ctx, B.x + 130, B.y + 415, pop(l, ts[3] + 0.2), () => { ctx.fillStyle = "#0F1738"; RR(ctx, -85, -65, 170, 130, 14); ctx.fill(); ctx.strokeStyle = P.blue; ctx.lineWidth = 4; ctx.stroke(); U.kode(ctx, -65, -36, 130, 4, 5, 1, { lh: 26 }); });
    popAt(ctx, B.x + 340, B.y + 415, pop(l, ts[3] + 0.5), () => { ctx.fillStyle = "#070B1E"; RR(ctx, -85, -65, 170, 130, 14); ctx.fill(); ctx.strokeStyle = P.green; ctx.lineWidth = 4; ctx.stroke(); ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-50, -20); ctx.lineTo(-20, 5); ctx.lineTo(-50, 30); ctx.moveTo(0, 32); ctx.lineTo(45, 32); ctx.stroke(); });
    popAt(ctx, B.x + 540, B.y + 415, pop(l, ts[3] + 0.8), () => { ctx.strokeStyle = P.ink2; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-60, -30); ctx.lineTo(60, -30); ctx.moveTo(-20, -30); ctx.quadraticCurveTo(-10, 35, 30, 35); ctx.stroke(); [[-60, -30, P.teal], [-20, -30, P.teal], [60, -30, P.teal], [30, 35, P.pink]].forEach(([x, y, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fill(); }); });
  };
  pic.vscode = function (ctx, b, l, t, B, p) {
    const ts = p.ks.map(k => T(b, k) - 0.2), cur = latest(l, ts); U.jendela(ctx, B.x, B.y + 10, B.w, 520, "Code editor");
    ctx.fillStyle = "#0A1030"; ctx.fillRect(B.x + 3, B.y + 74, 200, 453);
    for (let i = 0; i < 5; i++) { const a = ts[0] > 0.6 ? clamp(0.3 + 0.7 * ramp(l, ts[0] + i * 0.15, 0.3)) : 1; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = i === 0 ? P.amber : "#DDE6FF"; RR(ctx, B.x + 26 + (i ? 26 : 0), B.y + 104 + i * 54, 30, 30, 6); ctx.fill(); bar(ctx, B.x + 70 + (i ? 26 : 0), B.y + 110 + i * 54, i ? 80 : 104, 18, "rgba(242,246,255,0.45)"); ctx.restore(); }
    U.kode(ctx, B.x + 236, B.y + 116, B.w - 270, 7, 77, 0.3 + 0.7 * clamp((l - ts[1]) / 2.4), { lh: 44 });
    const run = l >= ts[2], pu = run ? 1 + 0.15 * Math.max(0, Math.sin((l - ts[2]) * 8)) * Math.exp(-(l - ts[2])) : 1; ctx.save(); ctx.translate(B.x + B.w - 54, B.y + 42); ctx.scale(pu, pu); ctx.fillStyle = P.green; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(-7, -11); ctx.lineTo(12, 0); ctx.lineTo(-7, 11); ctx.fill(); ctx.restore();
    if (run) { ctx.save(); ctx.globalAlpha *= ramp(l, ts[2], 0.3); ctx.fillStyle = "#070B1E"; ctx.fillRect(B.x + 206, B.y + 440, B.w - 209, 86); txt(ctx, "> Halo, dunia!", B.x + 236, B.y + 498, 42, { weight: 700, color: P.green }); ctx.restore(); }
    if (cur === 0) U.sorot(ctx, B.x + 8, B.y + 82, 192, 300, ramp(l, ts[0], 0.3)); if (cur === 1) U.sorot(ctx, B.x + 214, B.y + 90, B.w - 228, 340, ramp(l, ts[1], 0.3)); if (cur === 2) U.sorot(ctx, B.x + 210, B.y + 436, B.w - 220, 90, ramp(l, ts[2], 0.3));
  };
  pic.terminal = function (ctx, b, l, t, B, p) {
    terminal(ctx, B, 520, "Terminal"); const ts = p.lines.map(([k]) => T(b, k) - 0.3); let cur = -1;
    p.lines.forEach(([k, cmd], i) => { const y = B.y + 150 + i * 88, on = l >= ts[i]; if (!on && cur !== -1) return; if (!on) cur = i;
      txt(ctx, "$", B.x + 40, y, 46, { weight: 800, color: P.green }); const n = on ? Math.floor(clamp((l - ts[i]) / 0.7) * cmd.length) : 0; txt(ctx, cmd.slice(0, n), B.x + 86, y, 46, { weight: 700 });
      if ((!on || n < cmd.length || i === p.lines.length - 1) && Math.floor(t * 2) % 2 === 0) { ctx.font = `700 46px ${K.FONT}`; ctx.fillStyle = P.ink; ctx.fillRect(B.x + 90 + ctx.measureText(cmd.slice(0, n)).width, y - 38, 20, 44); } });
  };
  pic.git = function (ctx, b, l, t, B, p) {
    const ts = p.ks.map(k => T(b, k) - 0.2), X = i => B.x + 150 + i * 92, y1 = B.y + 190, y2 = B.y + 380; U.panel(ctx, B.x, B.y + 10, B.w, 500);
    U.orang(ctx, B.x + 70, y1 + 44, 96, P.teal); const n = 1 + Math.floor(clamp((l - ts[0]) / 2) * 4.01), back = l >= ts[1], merge = l >= ts[2];
    ctx.strokeStyle = P.teal; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(X(0), y1); ctx.lineTo(X(merge ? 4 + clamp((l - ts[2] - 1.2) / 0.5) : n - 1), y1); ctx.stroke();
    if (merge) { const k = clamp((l - ts[2]) / 1.2); U.orang(ctx, B.x + 70, y2 + 44, 96, P.pink, ramp(l, ts[2], 0.3)); ctx.strokeStyle = P.pink; ctx.beginPath(); ctx.moveTo(X(1), y1); ctx.quadraticCurveTo(X(1) + 10, y2, X(2), y2); if (k > 0.3) ctx.lineTo(X(2) + (X(3.6) - X(2)) * clamp((k - 0.3) / 0.4), y2); ctx.stroke();
      if (k > 0.7) { ctx.beginPath(); ctx.moveTo(X(3.6), y2); ctx.quadraticCurveTo(X(4.9), y2, X(5), y1 + 20); ctx.stroke(); }
      [2, 3.3].forEach((i, j) => { if (k > 0.3 + j * 0.2) U.titik(ctx, X(i), y2, 20, P.pink); }); if (l >= ts[2] + 1.7) U.titik(ctx, X(5), y1, 26, P.green); }
    for (let i = 0; i < n; i++) U.titik(ctx, X(i), y1, 20, back && i === 4 && !merge ? P.red : back && i === 3 && !merge ? P.green : P.teal);
    if (back && !merge) { const k = clamp((l - ts[1]) / 0.6); ctx.strokeStyle = P.amber; ctx.lineWidth = 8; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.arc(X(3.5), y1 - 20, 62, -0.15 * Math.PI, -0.15 * Math.PI - 0.7 * Math.PI * k, true); ctx.stroke(); ctx.setLineDash([]); if (k >= 1) { U.panah(ctx, X(3) + 2, y1 - 70, X(3), y1 - 40, P.amber, 1, 7); } }
  };
  pic.github = function (ctx, b, l, t, B, p) {
    const x = B.x, y = B.y + 10, w = B.w, h = 530; ctx.fillStyle = "rgba(0,0,0,0.3)"; RR(ctx, x + 10, y + 14, w, h, 22); ctx.fill(); ctx.fillStyle = "#0F1738"; RR(ctx, x, y, w, h, 22); ctx.fill(); ctx.strokeStyle = "rgba(242,246,255,0.2)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#1B2656"; RR(ctx, x, y, w, 84, 22); ctx.fill(); ctx.fillStyle = "#0A1030"; RR(ctx, x + 24, y + 14, w - 48, 58, 29); ctx.fill(); txt(ctx, p.url || "github.com/namamu", x + w / 2, y + 58, 40, { align: "center", weight: 700, color: p.url ? P.amber : P.ink2 });
    ctx.fillStyle = P.teal; ctx.beginPath(); ctx.arc(x + 76, y + 146, 38, 0, TAU); ctx.fill(); bar(ctx, x + 136, y + 124, 220, 22, "rgba(242,246,255,0.7)"); bar(ctx, x + 136, y + 160, 140, 14, "rgba(242,246,255,0.3)");
    for (let i = 0; i < 6; i++) { const tx = x + 24 + (i % 2) * 312, ty = y + 206 + Math.floor(i / 2) * 104, nm = p.repo && p.repo[i]; popAt(ctx, tx + 150, ty + 46, pop(l, 0.4 + i * 0.2), () => { U.panel(ctx, -150, -46, 300, 92, { r: 14, stroke: nm ? P.amber : undefined, lw: nm ? 5 : 3 }); ctx.fillStyle = [P.blue, P.amber, P.green, P.pink, P.violet, P.teal][i]; ctx.beginPath(); ctx.arc(-116, 0, 12, 0, TAU); ctx.fill();
      if (nm) txt(ctx, nm, -92, 15, 42, { weight: 900 }); else { bar(ctx, -92, -18, 150, 16, "rgba(242,246,255,0.6)"); bar(ctx, -92, 10, 200, 10, "rgba(242,246,255,0.25)"); } }); }
  };
  pic.error = function (ctx, b, l, t, B, p) {
    terminal(ctx, B, 480, "Terminal"); const tm = T(b, p.merah) - 0.2, ts = p.ks.map(k => T(b, k) - 0.2), cur = latest(l, ts), tb = p.bawah ? T(b, p.bawah) - 0.2 : 1e9, Y = i => B.y + 140 + i * 74;
    txt(ctx, "$ python kasir.py", B.x + 36, Y(0), 42, { weight: 700 });
    ['File "kasir.py",', "  line 12", "NameError: 'jmlh'", "is not defined"].forEach((s, i) => { const a = ramp(l, tm + i * 0.15, 0.2); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; txt(ctx, s, B.x + 36, Y(i + 1), 42, { weight: 700, color: P.red }); ctx.restore(); } });
    if (cur === 0 || l >= tb) U.sorot(ctx, B.x + 20, Y(3) - 54, B.w - 40, 148, ramp(l, l >= tb ? tb : ts[0], 0.3)); if (cur === 1) U.sorot(ctx, B.x + 20, Y(1) - 54, B.w - 40, 74, ramp(l, ts[1], 0.3)); if (cur === 2) U.sorot(ctx, B.x + 20, Y(2) - 54, B.w - 40, 74, ramp(l, ts[2], 0.3));
    if (l >= tb) U.panah(ctx, B.x + B.w - 70, Y(4) + 80 + 8 * Math.sin(t * 5), B.x + B.w - 70, Y(4) + 34 + 8 * Math.sin(t * 5), P.amber, (l - tb) / 0.3, 9);
  };
  // ---------- tiga lapisan ----------
  const LAP = [["Tampilan", "yang dilihat pengguna", P.blue], ["Server", "aturan dan izin", P.violet], ["Database", "tempat data disimpan", P.green]];
  pic.lapis = function (ctx, b, l, t, B, p) {
    const ts = LAP.map((_, i) => i < (p.pre || 0) ? -9 : 1e9); (p.on || []).forEach(([k, i]) => ts[i] = T(b, k) - 0.2); let cur = latest(l, ts); if (p.putar) cur = Math.floor(l / 1.5) % 3;
    LAP.forEach(([nm, sub, c], i) => { const y = B.y + 14 + i * 184, on = l >= ts[i], q = on ? pop(l, ts[i]) : { a: 1, sp: 1 };
      if (i < 2 && l >= ts[i] && l >= ts[i + 1]) { U.panah(ctx, B.x + B.w / 2 - 40, y + 152, B.x + B.w / 2 - 40, y + 180, P.ink2, 1, 6); U.panah(ctx, B.x + B.w / 2 + 40, y + 180, B.x + B.w / 2 + 40, y + 152, P.ink2, 1, 6); }
      popAt(ctx, B.x + B.w / 2, y + 74, q, () => { const w = B.w - 20; ctx.save(); if (!on) ctx.globalAlpha *= 0.35; U.panel(ctx, -w / 2, -74, w, 148, { fill: on ? D.hexA(c, 0.26) : undefined, stroke: on ? c : undefined, lw: i === cur ? 7 : 4 });
        const ix = -w / 2 + 84; ctx.fillStyle = on ? c : P.dim; if (i === 0) { RR(ctx, ix - 44, -36, 88, 66, 10); ctx.fill(); ctx.fillStyle = INK; ctx.fillRect(ix - 34, -14, 68, 34); }
        else if (i === 1) { [0, 1].forEach(j => { ctx.fillStyle = on ? c : P.dim; RR(ctx, ix - 44, -40 + j * 44, 88, 36, 8); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ix - 24, -22 + j * 44, 7, 0, TAU); ctx.fill(); }); }
        else { ctx.beginPath(); ctx.ellipse(ix, 26, 42, 14, 0, 0, TAU); ctx.fill(); ctx.fillRect(ix - 42, -26, 84, 52); ctx.beginPath(); ctx.ellipse(ix, -26, 42, 14, 0, 0, TAU); ctx.fillStyle = on ? "#D9FFE8" : P.ink2; ctx.fill(); }
        txt(ctx, nm, ix + 76, -6, 54, { weight: 900 }); txt(ctx, sub, ix + 76, 46, 40, { weight: 700, color: P.ink2 }); ctx.restore(); });
      if (i === cur && on) D.glow(ctx, B.x + B.w - 40, y + 74, 70, c, 0.5); });
  };
  // ---------- empat jalur ----------
  const JAL = ["Kuliah S1", "Vokasi D3 atau D4", "Langsung bekerja", "Mandiri atau bootcamp"], JALC = [P.blue, P.teal, P.pink, P.violet];
  pic.jalur = function (ctx, b, l, t, B, p) {
    const cx = B.x + B.w / 2, tm = p.muncul ? T(b, p.muncul) - 0.2 : -9, tsat = p.satu ? T(b, p.satu) - 0.2 : 1e9, Y = i => B.y + 112 + i * 90;
    ctx.strokeStyle = "rgba(242,246,255,0.35)"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(B.x + 30, B.y + 40); ctx.lineTo(B.x + 30, Y(3) + 37); for (let i = 0; i < 4; i++) { ctx.moveTo(B.x + 30, Y(i) + 37); ctx.lineTo(B.x + 62, Y(i) + 37); } ctx.moveTo(B.x + 30, B.y + 40); ctx.lineTo(cx - 150, B.y + 40); ctx.stroke();
    pil(ctx, "Lulus sekolah", cx, B.y + 40, P.ink, 42);
    JAL.forEach((s, i) => { const on = l >= tm + i * 0.3, act = p.aktif === i, all = p.aktif === -1 || p.aktif === 9, q = on && tm > -5 ? pop(l, tm + i * 0.3) : { a: 1, sp: 1 };
      popAt(ctx, cx + 16, Y(i) + 37, q, () => { ctx.save(); if (!on) ctx.globalAlpha *= 0.3; else if (!act && !all) ctx.globalAlpha *= 0.45; if (act) D.glow(ctx, 0, 0, 330, JALC[i], 0.35);
        U.panel(ctx, -280, -37, 560, 74, { r: 20, fill: act || (all && on) ? D.hexA(JALC[i], 0.3) : undefined, stroke: act ? P.amber : JALC[i], lw: act ? 7 : 4 }); if (on) txt(ctx, s, 0, 16, 44, { align: "center", weight: 900 }); ctx.restore(); }); });
    if (l >= tsat) { const k = clamp((l - tsat) / 0.8); ctx.strokeStyle = P.amber; ctx.lineWidth = 7; ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(cx + 296, Y(i) + 37); ctx.lineTo(cx + 316, Y(i) + 37); } ctx.moveTo(cx + 316, Y(0) + 37); ctx.lineTo(cx + 316, lerp(Y(0) + 37, B.y + 520, k)); if (k >= 1) ctx.lineTo(cx + 160, B.y + 520); ctx.stroke();
      popAt(ctx, cx, B.y + 520, pop(l, tsat + 0.8), () => { D.glow(ctx, 0, 0, 260, P.amber, 0.5); pil(ctx, "Portofolio", 0, 0, P.amber, 48); }); }
  };
  pic.tokoh1 = function (ctx, b, l, t, B, p) { const cx = B.x + B.w / 2; D.glow(ctx, cx, B.y + 260, 380, P.pink, 0.25); R.tokoh(ctx, cx, B.y + 440, 420, p.nama, t); txt(ctx, p.nama, cx, B.y + 508, 56, { align: "center", weight: 900 }); txt(ctx, R.STATUS[p.nama], cx, B.y + 556, 40, { align: "center", weight: 700, color: P.ink2 }); };
  pic.bukti = function (ctx, b, l, t, B, p) {
    const ts = p.ks.map(k => T(b, k) - 0.2), cx = B.x + B.w / 2, y = B.y + 14; kertas(ctx, cx - 220, y, 440, 400); txt(ctx, "CV", cx - 180, y + 84, 64, { weight: 900, color: INK }); bar(ctx, cx - 180, y + 116, 250, 16, "#C5C8D6");
    ctx.fillStyle = D.hexA(P.amber, 0.45); RR(ctx, cx - 192, y + 160, 384, 124, 10); ctx.fill(); txt(ctx, "Bisa membuat", cx - 180, y + 210, 44, { weight: 800, color: INK }); txt(ctx, "aplikasi web", cx - 180, y + 264, 44, { weight: 800, color: INK }); [280, 220].forEach((w, i) => bar(ctx, cx - 180, y + 316 + i * 34, w, 14, "#C5C8D6"));
    const done = l >= ts[2] + 0.5; if (!done) popAt(ctx, cx + 190, y + 60, pop(l, ts[0]), () => { ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fill(); txt(ctx, "?", 0, 26, 72, { align: "center", weight: 900, color: INK }); }); else U.centang(ctx, cx + 190, y + 60, 54, (l - ts[2] - 0.5) / 0.4);
    popAt(ctx, cx - 150, y + 480, pop(l, ts[1]), () => pil(ctx, "Link demo", 0, 0, P.green, 44)); popAt(ctx, cx + 170, y + 480, pop(l, ts[2]), () => pil(ctx, "Kode", 0, 0, P.teal, 44));
  };
  pic.tangga = function (ctx, b, l, t, B, p) {
    const ts = [0, 1, 2].map(i => i < (p.pre || 0) ? -9 : 1e9); (p.on || []).forEach(([k, i]) => ts[i] = T(b, k) - 0.2); let cur = latest(l, ts); if (p.sorot != null) cur = p.sorot; const base = B.y + 540, cl = [P.teal, P.blue, P.amber];
    [0, 1, 2].forEach(i => { const x = B.x + 10 + i * 216, h = (i + 1) * 150, on = l >= ts[i];
      if (on) U.batang(ctx, x, base, 204, h, cl[i], ts[i] < -5 ? 1 : (l - ts[i]) / 0.6, { r: 18 }); else { ctx.strokeStyle = "rgba(242,246,255,0.25)"; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); RR(ctx, x, base - h, 204, h, 18); ctx.stroke(); ctx.setLineDash([]); }
      txt(ctx, String(i + 1), x + 102, base - 40, 80, { align: "center", weight: 900, color: on ? INK : P.dim }); if (i === cur && on) { U.sorot(ctx, x - 6, base - h - 6, 216, h + 12, 0.6 + 0.4 * Math.sin(t * 4)); U.orang(ctx, x + 102, base - h - 6, 96, P.ink); } });
  };
  pic.cv = function (ctx, b, l, t, B, p) {
    const ts = p.ks.map(k => T(b, k) - 0.2), cx = B.x + B.w / 2, x = cx - 220, y = B.y + 6, cur = latest(l, ts); kertas(ctx, x, y, 440, 550); bar(ctx, x + 30, y + 30, 210, 26, "#3A3F5C");
    popAt(ctx, x + 116, y + 108, pop(l, ts[0]), () => pil(ctx, "GitHub", 0, 0, P.teal, 40)); popAt(ctx, x + 316, y + 108, pop(l, ts[0] + 0.25), () => pil(ctx, "Demo", 0, 0, P.green, 40));
    for (let i = 0; i < 3; i++) { const a = ramp(l, ts[1] + i * 0.3, 0.3); ctx.save(); ctx.globalAlpha *= 0.25 + 0.75 * a; bar(ctx, x + 30, y + 180 + i * 88, 200, 20, "#3A3F5C"); bar(ctx, x + 30, y + 212 + i * 88, 370, 12, "#B5B8C8"); bar(ctx, x + 30, y + 234 + i * 88, 300, 12, "#B5B8C8"); ctx.restore(); }
    if (cur === 0) U.sorot(ctx, x + 12, y + 66, 416, 84, ramp(l, ts[0], 0.3)); if (cur === 1) U.sorot(ctx, x + 12, y + 162, 416, 268, ramp(l, ts[1], 0.3));
    const a2 = ramp(l, ts[2], 0.3), a3 = ramp(l, ts[3], 0.3); if (a2 > 0 && a3 < 1) { ctx.save(); ctx.globalAlpha *= a2 * (1 - a3); for (let i = 0; i < 20; i++) bar(ctx, x + 30 + (i % 10) * 39, y + 458 + Math.floor(i / 10) * 36, 32, 22, "#9AA0BD"); ctx.strokeStyle = P.red; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 24, y + 490); ctx.lineTo(x + 24 + 396 * clamp((l - ts[2] - 0.3) / 0.4), y + 490); ctx.stroke(); ctx.restore(); }
    for (let i = 0; i < 3; i++) popAt(ctx, x + 90 + i * 130, y + 490, pop(l, ts[3] + i * 0.2), () => { ctx.fillStyle = "#1FA971"; RR(ctx, -56, -26, 112, 52, 26); ctx.fill(); U.centang(ctx, 0, 0, 18, 1, "#FFFFFF"); });
  };
  pic.wawancara = function (ctx, b, l, t, B, p) {
    const ts = p.ks.map(k => T(b, k) - 0.2), cx = B.x + B.w / 2, yb = B.y + 520, diam = l >= ts[1]; U.panel(ctx, B.x, B.y + 10, B.w, 540);
    U.orang(ctx, cx - 160, yb, 300, P.teal, 1, { laptop: 1 }); U.orang(ctx, cx + 170, yb, 300, P.violet);
    const a = 1 - ramp(l, ts[1], 0.4); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "#F3F6FF"; RR(ctx, cx - 300, B.y + 40, 270, 130, 34); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx - 190, B.y + 166); ctx.lineTo(cx - 160, B.y + 210); ctx.lineTo(cx - 130, B.y + 166); ctx.fill();
      for (let i = 0; i < 3; i++) { ctx.fillStyle = [P.teal, P.blue, P.violet][i]; ctx.beginPath(); ctx.arc(cx - 225 + i * 60, B.y + 105 - Math.max(0, Math.sin(t * 6 - i * 0.9)) * 16, 15, 0, TAU); ctx.fill(); } ctx.restore(); }
    if (diam) popAt(ctx, cx + 170, B.y + 150, pop(l, ts[1] + 0.3), () => { ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(0, 0, 58, 0, TAU); ctx.fill(); txt(ctx, "?", 0, 28, 78, { align: "center", weight: 900, color: INK }); });
  };
  pic.pdf = function (ctx, b, l, t, B) {
    const cx = B.x + B.w / 2, x = cx - 220, y = B.y + 6 + Math.sin(t * 1.3) * 5; kertas(ctx, x, y, 440, 550); ctx.fillStyle = P.teal; RR(ctx, x, y, 440, 150, 18); ctx.fill(); ctx.fillRect(x, y + 120, 440, 30);
    txt(ctx, "Rencana", x + 30, y + 64, 46, { weight: 900, color: INK }); txt(ctx, "12 bulan", x + 30, y + 120, 46, { weight: 900, color: INK });
    for (let i = 0; i < 12; i++) { const c = i % 3, r = Math.floor(i / 3), bx = x + 30 + c * 134, by = y + 184 + r * 84, k = (l - 0.8 - (c * 4 + r) * 0.35) / 0.3; ctx.strokeStyle = "#3A3F5C"; ctx.lineWidth = 4; RR(ctx, bx, by, 36, 36, 8); ctx.stroke(); bar(ctx, bx + 46, by + 10, 70, 14, "#B5B8C8"); if (k > 0) U.centang(ctx, bx + 18, by + 18, 16, k, [P.pink, P.teal, P.amber][c]); }
    D.glow(ctx, x + 400, y + 510, 110, P.amber, 0.5); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(x + 400, y + 510, 54, 0, TAU); ctx.fill(); const dy = Math.sin(t * 4) * 5; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x + 400, y + 484 + dy); ctx.lineTo(x + 400, y + 524 + dy); ctx.moveTo(x + 380, y + 508 + dy); ctx.lineTo(x + 400, y + 528 + dy); ctx.lineTo(x + 420, y + 508 + dy); ctx.stroke();
  };
  pic.repo20 = function (ctx, b, l, t, B) { for (let i = 0; i < 20; i++) { const a = ramp(l, 0.3 + i * 0.05, 0.2); if (a <= 0) continue; ctx.save(); ctx.globalAlpha *= a; const x = B.x + (i % 5) * 154, y = B.y + Math.floor(i / 5) * 35; ctx.fillStyle = "#3B466F"; RR(ctx, x, y, 144, 27, 8); ctx.fill(); bar(ctx, x + 12, y + 9, 70 + (i * 37) % 40, 9, "#8791B5"); ctx.restore(); } };
  pic.repo3 = function (ctx, b, l, t, B, s) { const t0 = s && s.key ? T(b, s.key) : 0.3; [P.teal, P.blue, P.amber].forEach((c, i) => popAt(ctx, B.x + 125 + i * 258, B.y + B.h / 2, pop(l, t0 + i * 0.25), () => { ctx.fillStyle = "#0F1738"; RR(ctx, -120, -68, 240, 136, 14); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = c; RR(ctx, -106, -54, 100, 66, 8); ctx.fill(); bar(ctx, 8, -50, 96, 14, "#DDE6FF"); bar(ctx, 8, -24, 70, 10, "#8791B5"); bar(ctx, 8, -4, 84, 10, "#8791B5"); bar(ctx, -106, 30, 212, 12, "#8791B5"); ctx.fillStyle = P.green; ctx.beginPath(); ctx.arc(96, 50, 9, 0, TAU); ctx.fill(); })); };

  // ---------- gambar sampul video (tanpa memakai gambar asli) ----------
  R.thumb = function (ctx, x, y, w, h, gbr, big) {
    const C2 = { tebak: [P.blue, P.violet], git: [P.teal, "#1F6F8B"], siantre: [P.green, "#178A5B"], silapor: [P.pink, "#B23A5E"], patungan: [P.amber, "#D97B29"], d06: [P.violet, "#3B2E8C"] }[gbr] || [P.blue, P.violet];
    ctx.save(); RR(ctx, x, y, w, h, big ? 26 : 12); ctx.clip(); const gr = ctx.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, C2[0]); gr.addColorStop(1, C2[1]); ctx.fillStyle = gr; ctx.fillRect(x, y, w, h); const cx = x + w / 2, cy = y + h / 2;
    if (big) { ctx.globalAlpha = 0.95;
      if (gbr === "tebak") { txt(ctx, "?", cx - 150, cy + 80, 240, { align: "center", weight: 900, color: "#FFFFFF" }); [["7", 90, -70], ["42", 210, 30], ["99", 100, 110]].forEach(([s, dx, dy]) => { ctx.fillStyle = "rgba(10,18,52,0.85)"; RR(ctx, cx + dx - 60, cy + dy - 46, 120, 84, 16); ctx.fill(); txt(ctx, s, cx + dx, cy + dy + 20, 60, { align: "center", weight: 900 }); }); }
      else if (gbr === "git") { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - 240, cy - 50); ctx.lineTo(cx + 240, cy - 50); ctx.moveTo(cx - 120, cy - 50); ctx.quadraticCurveTo(cx - 100, cy + 80, cx, cy + 80); ctx.lineTo(cx + 60, cy + 80); ctx.quadraticCurveTo(cx + 120, cy + 80, cx + 130, cy - 50); ctx.stroke(); [[-240, -50], [-120, -50], [0, 80], [130, -50], [240, -50]].forEach(([dx, dy]) => { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(cx + dx, cy + dy, 30, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx + dx, cy + dy, 16, 0, TAU); ctx.fill(); }); }
      else if (gbr === "siantre") { ctx.fillStyle = "#FFFFFF"; RR(ctx, cx - 210, cy - 120, 420, 240, 24); ctx.fill(); txt(ctx, "Nomor antrean", cx, cy - 50, 44, { align: "center", weight: 800, color: "#4A5278" }); txt(ctx, "A-012", cx, cy + 70, 120, { align: "center", weight: 900, color: INK }); }
      else if (gbr === "patungan") { hpBingkai(ctx, cx, y + 30, 230, h + 40); txt(ctx, "Rp", cx, cy + 50, 110, { align: "center", weight: 900, color: INK }); }
      else txt(ctx, "?", cx, cy + 80, 240, { align: "center", weight: 900, color: "#FFFFFF" }); }
    ctx.globalAlpha = 1; const r = big ? 58 : 26; ctx.fillStyle = "rgba(10,18,52,0.72)"; ctx.beginPath(); ctx.arc(big ? x + w - 90 : cx, big ? y + h - 86 : cy, r, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); const px = big ? x + w - 90 : cx, py = big ? y + h - 86 : cy; ctx.moveTo(px - r * 0.3, py - r * 0.45); ctx.lineTo(px + r * 0.5, py); ctx.lineTo(px - r * 0.3, py + r * 0.45); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "rgba(242,246,255,0.5)"; ctx.lineWidth = big ? 5 : 3; RR(ctx, x, y, w, h, big ? 26 : 12); ctx.stroke();
  };
})(typeof window !== "undefined" ? window : globalThis);
