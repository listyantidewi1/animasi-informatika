/* ON01 Koin Palsu (OSN-K 2026 SMA no. 10). Adegan per beat; waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers;
  const { rr, text, para, panel, label, chip, coin, scale, check, cross, arrow, strike, hilite, ease, clamp, lerp, ap, at, speechEnd } = H;
  const L = "ABCDE"; const R = 36;
  const COLW = ["#1F7A55", "#A8611B", "#D2382B", "#22201B", "#6B7A1E"];   // warna kolom tabel A..E (ungu tetap khusus untuk palsu/salah)
  const EX = [[0], [1, 2, 4, 8], [3, 5, 6, 9, 10, 12], [7, 11, 13, 14], [15]];
  const gx = (i, n = 5, x0 = 330, dx = 315) => n === 5 ? x0 + i * dx : 960 + (i - (n - 1) / 2) * 380;
  const OFF = [[-42, -42], [42, -42], [-42, 42], [42, 42]];
  const num = v => v >= 1000 ? (v / 1000).toFixed(3).replace(".", ".") : String(v);
  const gram = v => (v >= 1000 ? Math.floor(v / 1000) + "." + String(v % 1000).padStart(3, "0") : String(v)) + " g";

  /* lima (atau n) kelompok koin. o.cy pusat; o.fake = indeks kelompok palsu; o.alpha[i]; o.gone[i] = banyak koin yang sudah diambil;
     o.lab = alpha label; o.x4 = alpha tulisan ×4; o.mark[i] = "check"/"fake"/"?" ; o.markU[i] */
  function groups(ctx, o = {}) {
    const n = o.n || 5, cy = o.cy || 330, s = o.s || 1;
    for (let i = 0; i < n; i++) {
      const x = o.xs ? o.xs[i] : gx(i, n); const a = o.alpha ? o.alpha[i] : 1; if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha *= a;
      const hl = o.hl ? o.hl[i] : 0;
      if (hl > 0) hilite(ctx, x - 100 * s, cy - 100 * s, 200 * s, 236 * s, o.hlColor || C.purple, hl, o.hlFill || "rgba(138,63,168,0.10)");
      for (let k = 0; k < 4; k++) {
        const gone = o.gone ? o.gone[i] || 0 : 0; const cx = x + OFF[k][0] * s, cyy = cy + OFF[k][1] * s;
        if (k >= 4 - gone) { coin(ctx, cx, cyy, R * s, "", { ghost: true }); continue; }
        coin(ctx, cx, cyy, R * s, L[i], { fake: o.fake === i, glow: o.glow ? o.glow[i] : 0 });
      }
      const la = o.lab === undefined ? 1 : Array.isArray(o.lab) ? o.lab[i] : o.lab;
      if (la > 0) { ctx.save(); ctx.globalAlpha *= la; text(ctx, "label " + L[i], x, cy + 122 * s, 30 * s, { mono: true, weight: 800, align: "center", color: o.fake === i ? C.purple : C.ink }); ctx.restore(); }
      const xa = o.x4 === undefined ? 0 : Array.isArray(o.x4) ? o.x4[i] : o.x4;
      if (xa > 0) { ctx.save(); ctx.globalAlpha *= xa; text(ctx, "×4", x + 96 * s, cy - 70 * s, 30 * s, { mono: true, weight: 800, color: C.red, align: "center" }); ctx.restore(); }
      const m = o.mark ? o.mark[i] : null, mu = o.markU ? o.markU[i] : 1;
      if (m === "check") check(ctx, x, cy - 132 * s, 54 * s, C.green, mu);
      if (m === "fake" && mu > 0) { ctx.save(); ctx.globalAlpha *= mu; chip(ctx, "PALSU", x, cy - 168 * s, { center: true, size: 24, color: C.purple, stroke: C.purple, fill: C.purpleBg }); ctx.restore(); }
      if (m === "?" && mu > 0) { ctx.save(); ctx.globalAlpha *= mu; text(ctx, "?", x, cy - 112 * s, 64 * s, { disp: true, weight: 800, color: C.purple, align: "center" }); ctx.restore(); }
      ctx.restore();
    }
  }
  // posisi koin ke-p dari n koin di atas piringan timbangan (x tengah, y permukaan)
  const onPlate = (sx, sy, p, n, r = R) => { const gap = Math.min(2.1 * r, 600 / Math.max(1, n)); return [sx - (n - 1) / 2 * gap + p * gap, sy - r - 2]; };
  // koin bergerak dari (x0,y0) ke (x1,y1) dengan lengkung ke atas
  function fly(ctx, x0, y0, x1, y1, u, s, o = {}) {
    const e = ease(u); const x = lerp(x0, x1, e), y = lerp(y0, y1, e) - Math.sin(Math.PI * e) * 120; coin(ctx, x, y, R, s, o);
  }
  // berat yang tampil saat koin mendarat satu per satu: n0 + bagian yang sudah mendarat
  function counter(from, to, u) { return Math.round(lerp(from, to, ease(u))); }
  function bigNote(ctx, s, x, y, size, u, o = {}) { if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; text(ctx, s, x, y + (1 - u) * 16, size, { disp: true, weight: 800, align: o.align || "center", color: o.color || C.ink, fit: o.fit }); ctx.restore(); }
  function note(ctx, s, x, y, size, u, o = {}) { if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; text(ctx, s, x, y, size, { weight: o.weight || 700, align: o.align || "center", color: o.color || C.ink, mono: o.mono, fit: o.fit }); ctx.restore(); }

  // tabel kelebihan berat (bingkai 4): kolom A..E, tampil sampai kolom `upto` (dengan animasi isi kolom `upto` sejak lu)
  function exTable(ctx, x, y, w, o = {}) {
    const upto = o.upto === undefined ? 4 : o.upto, cw = (w - 280) / 5;
    panel(ctx, x, y, w, o.h || 420, { alpha: o.alpha });
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    label(ctx, o.title || "// KELEBIHAN BERAT YANG MUNGKIN", x + 40, y + 52);
    const r1 = y + 120, r2 = y + 200, r3 = y + 290;
    text(ctx, "label", x + 40, r1, 26, { mono: true, color: C.mut }); text(ctx, "koin ditimbang", x + 40, r2, 26, { mono: true, color: C.mut }); text(ctx, "kelebihan (g)", x + 40, r3, 26, { mono: true, color: C.mut });
    ctx.fillStyle = C.line; ctx.fillRect(x + 30, r1 + 28, w - 60, 2); ctx.fillRect(x + 30, r2 + 34, w - 60, 2);
    for (let i = 0; i < 5; i++) {
      const cx = x + 280 + cw * (i + 0.5);
      if (o.hlCol === i) hilite(ctx, cx - cw / 2 + 6, y + 80, cw - 12, (o.h || 420) - 100, C.green, o.hlU === undefined ? 1 : o.hlU);
      text(ctx, L[i], cx, r1, 34, { mono: true, weight: 800, align: "center" });
      text(ctx, String(i), cx, r2, 34, { mono: true, weight: 700, align: "center" });
      if (i > upto) continue;
      const vals = EX[i]; const lu = i === upto && o.fillU !== undefined ? o.fillU : 1;
      vals.forEach((v, k) => {
        const u = clamp(lu * vals.length - k, 0, 1); if (u <= 0) return;
        const row = Math.floor(k / 2), col = k % 2, multi = vals.length > 1;
        const vx = multi ? cx + (col ? 40 : -40) : cx, vy = r3 + row * 52;
        const isH = o.hlVal === v;
        ctx.save(); ctx.globalAlpha *= u;
        if (isH) { rr(ctx, vx - 34, vy - 36, 68, 48, 8); ctx.fillStyle = C.green; ctx.fill(); }
        text(ctx, String(v), vx, vy, 34, { mono: true, weight: 800, align: "center", color: isH ? C.white : COLW[i] });
        ctx.restore();
      });
    }
    ctx.restore();
  }

  Object.assign(Kiko.SCENES, {
    // ---------- 0. KAIT ----------
    kait_koin(ctx, b, l) {
      const tFake = at(b, "Empat"), tScale = at(b, "timbangan");
      for (let i = 0; i < 5; i++) for (let k = 0; k < 4; k++) {
        const idx = i * 4 + k, t0 = 0.15 + idx * 0.11, u = clamp((l - t0) / 0.5, 0, 1); if (u <= 0) continue;
        const x = gx(i) + OFF[k][0], y = 300 + OFF[k][1];
        const yy = lerp(-80, y, 1 - Math.pow(1 - u, 3)) - (u < 1 ? 0 : 0);
        const gl = i === 2 && l > tFake && l < tFake + 2.6 ? ease((l - tFake) / 0.3) * ease((tFake + 2.6 - l) / 0.4) : 0;
        coin(ctx, x, yy, R, L[i], { fake: gl > 0.5, glow: gl > 0 ? l : 0 });
      }
      for (let i = 0; i < 5; i++) note(ctx, "label " + L[i], gx(i), 422, 30, ap(l, 2.4), { mono: true, weight: 800 });
      scale(ctx, 960, 620 + (1 - ap(l, tScale, 0.6)) * 60, 560, "???", { alpha: ap(l, tScale, 0.6) });
    },
    kait_empat(ctx, b, l) {
      const t4 = at(b, "empat"), tT = at(b, "Ternyata"), tS = at(b, "sedikit");
      bigNote(ctx, "Berapa kali harus menimbang?", 960, 230, 76, ap(l, 0.3));
      const u = ap(l, t4, 0.35); if (u > 0) { ctx.save(); ctx.globalAlpha = u; text(ctx, "4?", 960, 560, 300 * (0.8 + 0.2 * u), { disp: true, weight: 800, align: "center", color: C.red }); ctx.restore(); }
      strike(ctx, 790, 480, 1130, 420, ap(l, tT, 0.5), C.ink, 18);
      bigNote(ctx, "jauh lebih sedikit!", 960, 720, 64, ap(l, tS - 0.2), { color: C.green });
    },
    kait_judul(ctx, b, l) {
      const u = ap(l, 0.1, 0.6);
      ctx.save(); ctx.globalAlpha = u;
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 140, 200, 30, { mono: true, weight: 700, color: C.green, ls: 4 });
      text(ctx, "20 koin. Satu label palsu.", 140, 310, 88, { disp: true, weight: 800 });
      text(ctx, "Cukup sekali timbang?", 140, 410, 88, { disp: true, weight: 800, color: C.red });
      chip(ctx, "OSN-K 2026 · Kabupaten/Kota · SMA · Soal 10", 140, 470, { size: 26 });
      ctx.restore();
      note(ctx, "OSN-K = OSN tingkat kabupaten/kota", 140, 600, 30, ap(l, 1.2), { align: "left", weight: 600, color: C.mut });
      scale(ctx, 1530, 520, 520, "1 kali?", { alpha: ap(l, 0.4, 0.6), dispColor: C.red });
      const xs = [1340, 1440, 1540, 1640, 1740];
      xs.forEach((x, i) => coin(ctx, x, 380 - Math.abs(Math.sin(l * 1.6 + i)) * 10, 40, i === 2 ? "?" : L[i], { fake: i === 2, alpha: ap(l, 0.6 + i * 0.12) }));
    },
    // ---------- 1. MEMAHAMI SOAL ----------
    tahap(ctx, b, l) {
      const tK = at(b, "OSN-K", 2), tP = at(b, "provinsi"), tN = at(b, "nasional", 2);
      bigNote(ctx, "Bedah Soal OSN-K Informatika", 960, 230, 70, ap(l, 0.2));
      const st = [["OSN-K", "Kabupaten/Kota", "babak pertama", tK], ["OSN-P", "Provinsi", "", tP], ["OSN", "Nasional", "", tN]];
      st.forEach((s, i) => {
        const x = 360 + i * 600, u = ap(l, s[3] - 0.2); if (u <= 0) return;
        ctx.save(); ctx.globalAlpha = u;
        panel(ctx, x - 230, 350, 460, 260, { stroke: i === 0 ? C.green : C.line, lw: i === 0 ? 5 : 2, fill: i === 0 ? "#F1F6EC" : C.panel });
        text(ctx, s[0], x, 450, 64, { mono: true, weight: 800, align: "center", color: i === 0 ? C.green : C.ink });
        text(ctx, s[1], x, 520, 38, { weight: 700, align: "center" });
        if (s[2]) text(ctx, s[2], x, 575, 28, { mono: true, weight: 600, align: "center", color: C.red });
        ctx.restore();
        if (i > 0) arrow(ctx, x - 370, 480, x - 240, 480, { u: ap(l, s[3] - 0.2, 0.4), color: C.mut });
      });
      if (l > tK) note(ctx, "video ini", 360, 670, 30, ap(l, tK + 0.3), { mono: true, color: C.green });
    },
    sumber(ctx, b, l) {
      const tJ = at(b, "Koin"), tA = at(b, "OSN-K"), tS = at(b, "SMA"), tT = at(b, "Tim");
      panel(ctx, 360, 150, 1200, 600, { alpha: ap(l, 0.1) });
      ctx.save(); ctx.globalAlpha = ap(l, 0.1);
      label(ctx, "// SUMBER SOAL", 420, 220);
      ctx.restore();
      bigNote(ctx, "Soal 10 · Koin Palsu", 420, 320, 76, ap(l, tJ - 0.2), { align: "left" });
      const rows = [["Ajang", "OSN-K Informatika 2026", tA], ["Tingkat", "Kabupaten/Kota", tA + 0.8], ["Jenjang", "SMA", tS], ["Penyusun", "Tim Olimpiade Komputer Indonesia (TOKI)", tT]];
      rows.forEach((r, i) => { const u = ap(l, r[2] - 0.2); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u;
        text(ctx, r[0], 420, 420 + i * 70, 30, { mono: true, color: C.mut, weight: 600 }); text(ctx, r[1], 640, 420 + i * 70, 36, { weight: 700, fit: 880 }); ctx.restore(); });
      note(ctx, "Gambar soal digambar ulang untuk video ini.", 420, 715, 24, ap(l, tT + 1), { align: "left", weight: 600, color: C.mut });
    },
    dengklek(ctx, b, l) {
      const tP = at(b, "Pak"), t20 = at(b, "dua", 1);
      const u = ap(l, tP - 0.3, 0.6);
      // Pak Dengklek: ikon garis sederhana dengan kaca pembesar
      ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
      const px = 430, py = 430;
      ctx.beginPath(); ctx.arc(px, py - 150, 62, 0, Math.PI * 2); ctx.fillStyle = C.panel; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px - 70, py - 200); ctx.lineTo(px + 70, py - 200); ctx.stroke();        // topi
      ctx.beginPath(); ctx.moveTo(px - 46, py - 200); ctx.lineTo(px - 40, py - 250); ctx.lineTo(px + 40, py - 250); ctx.lineTo(px + 46, py - 200); ctx.stroke();
      ctx.beginPath(); ctx.arc(px - 22, py - 152, 5, 0, Math.PI * 2); ctx.arc(px + 22, py - 152, 5, 0, Math.PI * 2); ctx.fillStyle = C.ink; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py - 128, 20, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px - 110, py + 190); ctx.lineTo(px - 110, py - 20); ctx.quadraticCurveTo(px - 110, py - 70, px - 60, py - 76); ctx.lineTo(px + 60, py - 76); ctx.quadraticCurveTo(px + 110, py - 70, px + 110, py - 20); ctx.lineTo(px + 110, py + 190); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px + 100, py - 30); ctx.lineTo(px + 190, py - 60); ctx.stroke();       // lengan
      ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(px + 180, py - 54); ctx.lineTo(px + 224, py - 92); ctx.stroke(); ctx.lineWidth = 7;   // gagang kaca pembesar
      ctx.beginPath(); ctx.arc(px + 262, py - 130, 54, 0, Math.PI * 2); ctx.fillStyle = "rgba(31,122,85,0.10)"; ctx.fill(); ctx.strokeStyle = C.green; ctx.lineWidth = 9; ctx.stroke();
      ctx.restore();
      note(ctx, "Pak Dengklek", px, 700, 34, u, { weight: 800 });
      for (let k = 0; k < 20; k++) {
        const r = Math.floor(k / 5), c = k % 5; const x = 920 + c * 160, y = 220 + r * 140;
        coin(ctx, x, y, 48, "", { alpha: ap(l, t20 + k * 0.05, 0.3) });
      }
      note(ctx, "20 koin", 1240, 770, 40, ap(l, t20 + 1.2), { mono: true, weight: 800, color: C.red });
    },
    label5(ctx, b, l) {
      const tl = [at(b, "A,"), at(b, "B,"), at(b, "C,"), at(b, "D,"), at(b, "E.")], t4 = at(b, "empat");
      // dari kisi 4×5 ke lima kelompok
      for (let i = 0; i < 5; i++) for (let k = 0; k < 4; k++) {
        const idx = i * 4 + k, r = Math.floor(idx / 5), c = idx % 5; const x0 = 920 + c * 160 - 450, y0 = 220 + r * 140;
        const u = ap(l, 0.2 + i * 0.12, 0.9); const x = lerp(x0, gx(i) + OFF[k][0], u), y = lerp(y0, 330 + OFF[k][1], u);
        coin(ctx, x, y, R + (1 - u) * 12, u > 0.6 ? L[i] : "", {});
      }
      groups(ctx, { alpha: [0, 0, 0, 0, 0], lab: 0 });
      for (let i = 0; i < 5; i++) note(ctx, "label " + L[i], gx(i), 452, 30, ap(l, tl[i] - 0.15), { mono: true, weight: 800 });
      for (let i = 0; i < 5; i++) note(ctx, "4 koin", gx(i), 520, 30, ap(l, t4 + i * 0.1), { mono: true, weight: 700, color: C.red });
    },
    satu_palsu(ctx, b, l) {
      const t16 = at(b, "enam"), tSama = at(b, "sama");
      const hop = Math.floor(Math.max(0, l - 0.4) / 0.9) % 5;
      const hl = [0, 0, 0, 0, 0]; if (l < t16 + 2) hl[hop] = 1;
      groups(ctx, { hl, mark: hl.map(v => v ? "?" : null) });
      note(ctx, "salah satu label ini palsu, tetapi belum tahu yang mana", 960, 140 + 0, 30, ap(l, 0.6), { weight: 600, color: C.mut });
      const u = ap(l, t16 - 0.2);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u;
        chip(ctx, "16 asli", 520, 560, { size: 40, color: C.goldInk, stroke: C.goldRim, fill: "#FBF1CF" });
        chip(ctx, "4 palsu", 820, 560, { size: 40, color: C.purple, stroke: C.purple, fill: C.purpleBg });
        ctx.restore(); }
      note(ctx, "keempat koin palsu ada di satu label", 1430, 610, 34, ap(l, tSama - 0.6), { weight: 800, color: C.purple, fit: 640 });
    },
    berat(ctx, b, l) {
      const tA = at(b, "seratus", 1), tP = at(b, "palsu");
      const tw = [at(b, "seratus", 2), at(b, "seratus", 3), at(b, "seratus", 4), at(b, "seratus", 5)];
      panel(ctx, 160, 150, 640, 600, { alpha: ap(l, 0.1) });
      note(ctx, "koin asli", 480, 240, 34, ap(l, 0.2), { weight: 800 });
      coin(ctx, 480, 400, 92, "", { alpha: ap(l, tA - 0.4) });
      note(ctx, "100 g", 480, 620, 64, ap(l, tA - 0.1), { mono: true, weight: 800 });
      note(ctx, "semua sama", 480, 690, 28, ap(l, tA + 0.8), { mono: true, weight: 600, color: C.mut });
      panel(ctx, 880, 150, 880, 600, { alpha: ap(l, tP - 0.3), stroke: C.purple });
      note(ctx, "koin palsu (berbeda-beda)", 1320, 240, 34, ap(l, tP - 0.3), { weight: 800, color: C.purple });
      [101, 102, 104, 108].forEach((w, i) => {
        const x = 1000 + i * 213, u = ap(l, tw[i] - 0.15); if (u <= 0) return;
        coin(ctx, x, 420 - (1 - u) * 30, 72, "", { fake: true, alpha: u });
        note(ctx, w + " g", x, 580, 48, u, { mono: true, weight: 800, color: C.purple });
        note(ctx, "+" + (w - 100), x, 650, 34, ap(l, tw[i] + 0.4), { mono: true, weight: 700, color: C.red });
      });
    },
    acak(ctx, b, l) {
      const tT = at(b, "tidak"), tK = at(b, "keempat");
      note(ctx, "Empat koin palsu di satu label (misalnya label B)", 960, 170, 34, ap(l, 0.2), { weight: 700, color: C.mut });
      const W4 = [101, 102, 104, 108];
      // urutan berubah tiap 1,1 detik setelah "tidak": koin bertukar tempat
      const per = 1.1, ph = Math.max(0, l - tT) / per, step = Math.floor(ph), fr = ease(ph - step);
      const perm = s => { let p = [0, 1, 2, 3]; for (let j = 0; j < s; j++) { const a = (j * 3 + 1) % 4, c = (j * 5 + 2) % 4; [p[a], p[c]] = [p[c], p[a]]; } return p; };
      const p0 = perm(step), p1 = perm(step + 1);
      for (let k = 0; k < 4; k++) {
        const s0 = p0.indexOf(k), s1 = p1.indexOf(k); const x = lerp(510 + s0 * 300, 510 + s1 * 300, l > tT ? fr : 0);
        const y = 440 - (l > tT ? Math.sin(Math.PI * fr) * 90 * Math.sign(s1 - s0) : 0);   // yang ke kanan naik, yang ke kiri turun
        coin(ctx, x, y, 80, "B", { fake: true });
        const known = l < tT;
        chip(ctx, known ? W4[k] + " g" : "? g", x, y - 180, { center: true, size: 36, color: known ? C.purple : C.mut, stroke: known ? C.purple : C.line, fill: known ? C.purpleBg : C.panel });
      }
      note(ctx, "Kita tidak tahu koin mana seberat berapa.", 960, 640, 40, ap(l, tT + 0.4), { weight: 800, color: C.red });
      note(ctx, "Yang pasti: keempat berat itu ada di label yang sama.", 960, 700, 32, ap(l, tK - 0.2), { weight: 700, color: C.purple });
    },
    timbangan(ctx, b, l) {
      const tTaruh = at(b, "menaruh"), tJ = at(b, "jumlah");
      const sx = 960, sy = 470; const n = 3, land = [tTaruh, tTaruh + 0.9, tTaruh + 1.8];
      let shown = 0;
      for (let p = 0; p < n; p++) { const u = clamp((l - land[p]) / 0.8, 0, 1); if (u >= 1) shown++; }
      scale(ctx, sx, sy, 640, gram(shown * 100), { alpha: ap(l, 0.1) });
      for (let p = 0; p < n; p++) {
        const u = clamp((l - land[p]) / 0.8, 0, 1); const [x1, y1] = onPlate(sx, sy, p, n, 48);
        if (u <= 0) coin(ctx, 360 + p * 110, 300, 48, "", {}); else fly(ctx, 360 + p * 110, 300, x1, y1, u, "", {});
      }
      note(ctx, "timbangan menampilkan JUMLAH berat", 960, 200, 40, ap(l, tJ - 0.3), { weight: 800, color: C.green });
      note(ctx, "100 + 100 + 100 = 300 g", 1500, 380, 34, ap(l, tJ + 0.5), { mono: true, weight: 700 });
    },
    ditanya(ctx, b, l) {
      panel(ctx, 80, 120, 1000, 640, {});
      label(ctx, "// YANG DIKETAHUI", 128, 180);
      const rows = [["• 5 label ", "A B C D E", ", masing-masing 4 koin.", C.red], ["• Tepat satu label berisi koin palsu.", "", "", C.ink], ["• Koin asli: ", "100 g", "", C.ink], ["• Koin palsu: ", "101, 102, 104, 108 g", "", C.purple], ["• Timbangan menampilkan jumlah berat.", "", "", C.ink]];
      rows.forEach((r, i) => { const y = 250 + i * 60; let x = 128; x += text(ctx, r[0], x, y, 34, { weight: 600 }); if (r[1]) x += text(ctx, r[1], x, y, 34, { mono: true, weight: 800, color: r[3] }); if (r[2]) text(ctx, r[2], x, y, 34, { weight: 600 }); });
      const u = ap(l, at(b, "Pertanyaannya") - 0.2);
      ctx.save(); ctx.globalAlpha = u; label(ctx, "// DITANYA", 128, 600);
      let x = 128; x += text(ctx, "Paling sedikit berapa kali menimbang agar ", x, 660, 34, { weight: 700 });
      ctx.restore();
      const u2 = ap(l, at(b, "seratus") - 0.2); ctx.save(); ctx.globalAlpha = u2; const yw = text(ctx, "100% yakin", 128, 712, 40, { weight: 800, color: C.red }); text(ctx, " label mana yang palsu?", 128 + yw, 712, 34, { weight: 700 }); ctx.restore();
      panel(ctx, 1120, 120, 720, 640, {});
      // ringkasan gambar: lima kelompok kecil dan timbangan
      for (let i = 0; i < 5; i++) { const x = 1200 + i * 140; for (let k = 0; k < 4; k++) coin(ctx, x + (k % 2 ? 26 : -26), 230 + (k > 1 ? 52 : 0), 22, L[i], {}); text(ctx, L[i], x, 330, 26, { mono: true, weight: 800, align: "center" }); }
      scale(ctx, 1480, 470, 460, "? g", {});
      text(ctx, "berapa kali?", 1480, 720, 40, { disp: true, weight: 800, align: "center", color: C.red });
    },
    // ---------- 2. COBA DULU ----------
    coba(ctx, b, l) {
      const tE = speechEnd(b) + 0.2, N = b.countdown || 10;
      text(ctx, "PAUSE VIDEONYA", 960, 250, 32, { mono: true, weight: 700, color: C.red, align: "center", ls: 6 });
      text(ctx, "Bisakah kamu memecahkan ini?", 960, 380, 104, { disp: true, weight: 800, align: "center", fit: 1700 });
      const left = l < tE ? N : Math.max(0, N - (l - tE)); const s = Math.ceil(left - 1e-6);
      text(ctx, "00:" + String(s).padStart(2, "0"), 960, 610, 190, { mono: true, weight: 800, color: C.green, align: "center" });
      ctx.fillStyle = C.line; rr(ctx, 360, 690, 1200, 16, 8); ctx.fill();
      ctx.fillStyle = C.red; rr(ctx, 360, 690, 1200 * clamp((l - tE) / N, 0, 1), 16, 8); ctx.fill();
      if (l > tE - 0.2) {
        const u = ap(l, tE); ctx.save(); ctx.globalAlpha = u;
        text(ctx, "5 label × 4 koin  ·  asli 100 g  ·  palsu 101, 102, 104, 108 g  ·  satu label palsu", 960, 800, 30, { mono: true, weight: 600, color: C.mut, align: "center", fit: 1700 });
        text(ctx, "Paling sedikit berapa kali menimbang?", 960, 870, 40, { weight: 800, align: "center" });
        ctx.restore();
      }
    },
    // ---------- 3. CARA BIASA DAN PEMANASAN ----------
    biasa1(ctx, b, l) {
      const tA = at(b, "ambil"), tT = at(b, "timbang"), tAsli = at(b, "asli");
      groups(ctx, { cy: 230, s: 0.8, gone: [l > tA ? 1 : 0, 0, 0, 0, 0] });
      const sx = 960, sy = 560, u = clamp((l - tA) / 0.9, 0, 1);
      scale(ctx, sx, sy, 520, l > tT ? "100 g" : "0 g", {});
      if (u > 0) { const [x1, y1] = onPlate(sx, sy, 0, 1); fly(ctx, gx(0) + 34, 264, x1, y1, u, "A"); }
      if (l > tAsli) { check(ctx, gx(0), 100 + 18, 50, C.green, ap(l, tAsli, 0.5)); note(ctx, "A asli", 1460, 640, 40, ap(l, tAsli), { weight: 800, color: C.green }); }
      note(ctx, "Penimbangan ke-1", 1460, 520, 32, ap(l, tT), { mono: true, weight: 700, color: C.red });
    },
    biasa4(ctx, b, l) {
      const tB = at(b, "B,"), tC = at(b, "C,"), tD = at(b, "D."), tE = at(b, "E"), t4 = at(b, "empat", 1);
      const ts = [-5, tB, tC + 0.3, tD + 0.3];
      const k = ts.filter(x => l > x).length;   // banyak penimbangan
      groups(ctx, { cy: 230, s: 0.8, mark: [k >= 1 ? "check" : null, k >= 2 ? "check" : null, k >= 3 ? "check" : null, k >= 4 ? "check" : null, l > tE ? "fake" : null],
        markU: [1, ap(l, tB + 0.6), ap(l, tC + 0.9), ap(l, tD + 0.9), ap(l, tE)], hl: [0, 0, 0, 0, l > tE ? ap(l, tE) : 0] });
      const sx = 960, sy = 560; const cur = Math.max(0, k - 1);
      scale(ctx, sx, sy, 520, "100 g", {});
      const [x1, y1] = onPlate(sx, sy, 0, 1); coin(ctx, x1, y1, R, L[cur], {});
      for (let i = 0; i < 4; i++) { const u = ap(l, ts[i]); if (u <= 0) continue; chip(ctx, String(i + 1), 1380 + i * 100, 470, { size: 40, color: C.red, stroke: C.red, alpha: u }); }
      note(ctx, "jika A, B, C, D asli → E palsu", 1560, 640, 30, ap(l, tE), { weight: 700, color: C.purple, fit: 560 });
      bigNote(ctx, "4 kali menimbang", 1560, 720, 48, ap(l, t4 - 0.2), { color: C.red });
    },
    yatidak(ctx, b, l) {
      const tM = at(b, "Masalahnya"), tY = at(b, "apakah");
      bigNote(ctx, "benar, tetapi lambat", 960, 220, 64, ap(l, 0.2), { color: C.mut });
      const u = ap(l, tM);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u;
        panel(ctx, 360, 300, 1200, 200, { stroke: C.green, lw: 4 });
        text(ctx, "1 penimbangan = 1 pertanyaan ya/tidak", 960, 420, 56, { disp: true, weight: 800, align: "center", fit: 1120 }); ctx.restore(); }
      const v = ap(l, tY - 0.2);
      if (v > 0) { ctx.save(); ctx.globalAlpha = v;
        text(ctx, "“Apakah label ini palsu?”", 960, 600, 44, { weight: 700, align: "center" });
        chip(ctx, "YA", 820, 640, { size: 36, color: C.purple, stroke: C.purple, center: true }); chip(ctx, "TIDAK", 1100, 640, { size: 36, color: C.green, stroke: C.green, center: true });
        ctx.restore(); }
    },
    pm_tiga(ctx, b, l) {
      const t3 = at(b, "tiga"), tS = at(b, "Bisakah");
      groups(ctx, { n: 3, cy: 360, alpha: [ap(l, t3), ap(l, t3 + 0.2), ap(l, t3 + 0.4)] });
      note(ctx, "soal kecil: 3 label saja", 960, 180, 40, ap(l, t3 - 0.3), { weight: 800, color: C.green });
      bigNote(ctx, "Sekali timbang cukup?", 960, 700, 56, ap(l, tS - 0.2), { color: C.red });
    },
    pm_sama(ctx, b, l) {
      const tA = at(b, "ambil"), t302 = at(b, "tiga"), tBisa = at(b, "bisa");
      const sx = 960, sy = 560;
      groups(ctx, { n: 3, cy: 270, s: 0.8, gone: [l > tA ? 1 : 0, l > tA + 0.3 ? 1 : 0, l > tA + 0.6 ? 1 : 0] });
      scale(ctx, sx, sy, 560, l > t302 ? "302 g" : l > tA + 1.4 ? "300 g" : "0 g", { dispColor: l > t302 ? C.red : C.green });
      for (let p = 0; p < 3; p++) { const u = clamp((l - tA - p * 0.3) / 0.9, 0, 1); if (u <= 0) continue; const [x1, y1] = onPlate(sx, sy, p, 3); fly(ctx, gx(p, 3) + 34, 304, x1, y1, u, L[p]); }
      note(ctx, "1 koin palsu: +2 g", 1520, 540, 34, ap(l, t302 + 1), { mono: true, weight: 700, color: C.purple });
      for (let p = 0; p < 3; p++) { const u = ap(l, tBisa + p * 0.5); if (u <= 0) continue; ctx.save(); ctx.globalAlpha = u; text(ctx, "?", gx(p, 3) - 120, 250, 64, { disp: true, weight: 800, color: C.purple, align: "center" }); ctx.restore(); arrow(ctx, sx + (p - 1) * 40, sy - 80, gx(p, 3) + (1 - p) * 30, 380, { u, color: C.purple, dash: [10, 10], lw: 4 }); }
    },
    pm_sama_gagal(ctx, b, l) {
      groups(ctx, { n: 3, cy: 280, s: 0.8, gone: [1, 1, 1], mark: ["?", "?", "?"] });
      const u = ap(l, 0.3);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; panel(ctx, 360, 520, 1200, 170, { stroke: C.purple, lw: 4 });
        text(ctx, "jumlah koin sama → tidak bisa dibedakan", 960, 625, 52, { disp: true, weight: 800, align: "center", color: C.purple, fit: 1120 }); ctx.restore(); }
    },
    pm_beda(ctx, b, l) {
      const tn = [at(b, "nol"), at(b, "satu"), at(b, "dua")], tTot = at(b, "Totalnya"), tN = at(b, "normalnya");
      const sx = 1300, sy = 560;
      groups(ctx, { n: 3, xs: [240, 520, 800], cy: 250, s: 0.75, gone: [0, l > tn[1] ? 1 : 0, l > tn[2] ? 2 : 0] });
      // tabel kecil
      panel(ctx, 160, 470, 760, 230, {});
      [0, 1, 2].forEach(i => { const x = 300 + i * 240; text(ctx, L[i], x, 545, 40, { mono: true, weight: 800, align: "center" });
        note(ctx, String(i) + " koin", x, 650, 40, ap(l, tn[i] - 0.1), { mono: true, weight: 800, color: C.red }); });
      scale(ctx, sx, sy, 560, l > tN ? "300 g" : "", {});
      const pile = [["B", tn[1]], ["C", tn[2]], ["C", tn[2] + 0.35]];
      pile.forEach(([s, t0], p) => { const u = clamp((l - t0) / 0.9, 0, 1); if (u <= 0) return; const [x1, y1] = onPlate(sx, sy, p, 3); fly(ctx, s === "B" ? 554 : 834, 284, x1, y1, u, s); });
      note(ctx, "3 koin × 100 g", 1300, 300, 34, ap(l, tTot), { mono: true, weight: 700 });
      note(ctx, "normal = 300 g", 1300, 360, 40, ap(l, tN - 0.2), { mono: true, weight: 800, color: C.green });
    },
    pm_a(ctx, b, l) {
      const tA = at(b, "Artinya"), tT = at(b, "tidak", 2);
      const sx = 1300, sy = 560;
      groups(ctx, { n: 3, xs: [240, 520, 800], cy: 290, s: 0.75, gone: [0, 1, 2], fake: l > tA + 0.6 ? 0 : -1, hl: [ap(l, tA + 0.4), 0, 0] });
      scale(ctx, sx, sy, 560, "300 g", {});
      [["B", 0], ["C", 1], ["C", 2]].forEach(([s, p]) => { const [x, y] = onPlate(sx, sy, p, 3); coin(ctx, x, y, R, s, {}); });
      note(ctx, "tidak ada koin palsu di timbangan", 1300, 300, 32, ap(l, 0.8), { weight: 700, fit: 760 });
      bigNote(ctx, "→ label A palsu", 520, 640, 56, ap(l, tA + 0.4), { color: C.purple });
      note(ctx, "(A tidak ikut ditimbang)", 520, 710, 30, ap(l, tT - 0.2), { weight: 600, color: C.mut });
    },
    pm_b(ctx, b, l) {
      const tS = at(b, "Selisih"), tV = at(b, "Kelebihannya");
      panel(ctx, 160, 150, 1600, 250, {});
      label(ctx, "// KALAU B PALSU: 1 KOIN PALSU IKUT DITIMBANG", 210, 210);
      text(ctx, "berat = 300 g + kelebihan berat", 210, 290, 44, { mono: true, weight: 700 });
      note(ctx, "kelebihan berat = selisih dari berat normal", 210, 360, 32, ap(l, tS - 0.2), { align: "left", weight: 600, color: C.green });
      const vals = [1, 2, 4, 8]; panel(ctx, 160, 450, 1600, 220, { alpha: ap(l, tV - 0.4) });
      note(ctx, "B", 260, 590, 64, ap(l, tV - 0.4), { mono: true, weight: 800 });
      vals.forEach((v, i) => { note(ctx, "+" + v, 520 + i * 260, 590, 72, ap(l, tV + 0.5 + i * 0.6), { mono: true, weight: 800, color: COLW[1] }); });
    },
    pm_c(ctx, b, l) {
      const tV = at(b, "tiga");
      panel(ctx, 160, 150, 1600, 200, {});
      note(ctx, "B", 260, 280, 64, 1, { mono: true, weight: 800 });
      [1, 2, 4, 8].forEach((v, i) => note(ctx, "+" + v, 520 + i * 260, 280, 64, 1, { mono: true, weight: 800, color: COLW[1] }));
      panel(ctx, 160, 390, 1600, 330, { alpha: ap(l, 0.2) });
      note(ctx, "C", 260, 560, 64, ap(l, 0.2), { mono: true, weight: 800 });
      note(ctx, "2 koin palsu: jumlah dua berat berbeda", 960, 450, 30, ap(l, 0.6), { weight: 600, color: C.mut });
      const vals = [[3, "1+2"], [5, "1+4"], [6, "2+4"], [9, "1+8"], [10, "2+8"], [12, "4+8"]];
      vals.forEach(([v, s], i) => { const x = 470 + i * 220, u = ap(l, tV + i * 0.55); note(ctx, "+" + v, x, 580, 64, u, { mono: true, weight: 800, color: COLW[2] }); note(ctx, s, x, 650, 30, u, { mono: true, weight: 600, color: C.mut }); });
    },
    pm_cek(ctx, b, l) {
      const tC = at(b, "cukup");
      panel(ctx, 160, 130, 1600, 380, {});
      text(ctx, "A", 260, 220, 56, { mono: true, weight: 800, align: "center" }); text(ctx, "0", 520, 220, 56, { mono: true, weight: 800, color: COLW[0], align: "center" });
      text(ctx, "B", 260, 330, 56, { mono: true, weight: 800, align: "center" }); [1, 2, 4, 8].forEach((v, i) => text(ctx, String(v), 520 + i * 200, 330, 56, { mono: true, weight: 800, color: COLW[1], align: "center" }));
      text(ctx, "C", 260, 440, 56, { mono: true, weight: 800, align: "center" }); [3, 5, 6, 9, 10, 12].forEach((v, i) => text(ctx, String(v), 520 + i * 200, 440, 56, { mono: true, weight: 800, color: COLW[2], align: "center" }));
      check(ctx, 1680, 330, 80, C.green, ap(l, 1.2, 0.6));
      note(ctx, "tidak ada angka yang sama di dua baris", 960, 590, 38, ap(l, 0.8), { weight: 700 });
      bigNote(ctx, "3 label → 1 kali timbang", 960, 700, 64, ap(l, tC - 0.4), { color: C.green });
    },
    // ---------- 4. LIMA LABEL ----------
    aturan(ctx, b, l) {
      const tS = at(b, "Setiap");
      groups(ctx, { cy: 260, s: 0.85 });
      const u = ap(l, tS - 0.3);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; panel(ctx, 260, 520, 1400, 190, { stroke: C.green, lw: 5 });
        label(ctx, "// ATURAN", 310, 575); text(ctx, "Jumlah koin tiap label harus berbeda.", 310, 665, 56, { disp: true, weight: 800, fit: 1300 }); ctx.restore(); }
    },
    pilihan(ctx, b, l) {
      const tN = at(b, "nol");
      for (let k = 0; k < 4; k++) coin(ctx, 600 + OFF[k][0] * 1.3, 330 + OFF[k][1] * 1.3, 48, "A", {});
      note(ctx, "1 label = 4 koin", 600, 520, 40, ap(l, 0.4), { mono: true, weight: 800, color: C.red });
      ["0", "1", "2", "3", "4"].forEach((s, i) => { const u = ap(l, tN + i * 0.45); if (u <= 0) return; chip(ctx, s, 1000 + i * 150, 290, { size: 60, color: C.green, stroke: C.green, alpha: u, px: 30 }); });
      note(ctx, "pilihan jumlah koin yang diambil", 1300, 480, 32, ap(l, tN), { weight: 700, color: C.mut });
      note(ctx, "tepat 5 pilihan", 1300, 560, 40, ap(l, tN + 2.4), { weight: 800, color: C.green });
    },
    ambil(ctx, b, l) {
      const tn = [at(b, "nol"), at(b, "satu"), at(b, "dua"), at(b, "tiga"), at(b, "empat")];
      const sx = 1340, sy = 610;
      groups(ctx, { cy: 220, s: 0.7, xs: [180, 360, 540, 720, 900], gone: [0, 1, 2, 3, 4].map(i => l > tn[i] ? i : 0) });
      panel(ctx, 100, 410, 880, 220, {});
      for (let i = 0; i < 5; i++) { const x = 180 + i * 180; text(ctx, L[i], x, 480, 40, { mono: true, weight: 800, align: "center" }); note(ctx, String(i), x, 580, 56, ap(l, tn[i] - 0.1), { mono: true, weight: 800, color: C.red }); }
      scale(ctx, sx, sy, 760, "", {});
      let p = 0; const all = [];
      for (let i = 1; i < 5; i++) for (let k = 0; k < i; k++) all.push([i, k, tn[i] - 0.1 + k * 0.12]);
      all.forEach(([i, k, t0], idx) => { const u = clamp((l - t0) / 0.6, 0, 1); if (u <= 0) return; const [x1, y1] = onPlate(sx, sy, idx, 10, 30); const s0 = 0.7;
        const xx = 180 * (i + 1) + OFF[3 - k][0] * s0, yy = 220 + OFF[3 - k][1] * s0; const e = ease(u); coin(ctx, lerp(xx, x1, e), lerp(yy, y1, e) - Math.sin(Math.PI * e) * 120, 30, L[i], {}); });
      note(ctx, "10 koin", sx, 340, 40, ap(l, tn[4] + 1.2), { mono: true, weight: 800, color: C.red });
    },
    seribu(ctx, b, l) {
      const tA = at(b, "asli"), tK = at(b, "karena");
      const sx = 960, sy = 400;
      scale(ctx, sx, sy, 640, l > tA + 0.6 ? "1.000 g" : "", {});
      const lab = "BCCDDDEEEE"; for (let p = 0; p < 10; p++) { const [x, y] = onPlate(sx, sy, p, 10, 30); coin(ctx, x, y, 30, lab[p], {}); }
      note(ctx, "kalau semuanya asli", 960, 230, 36, ap(l, tA - 0.3), { weight: 700, color: C.mut });
      bigNote(ctx, "10 × 100 g = 1.000 g", 960, 790, 60, ap(l, tK - 0.2), { color: C.green });
    },
    lebih(ctx, b, l) {
      const tJ = at(b, "Jadi"), tS = at(b, "selisihnya");
      const sx = 1180, sy = 430;
      scale(ctx, sx, sy, 640, l > tJ ? "> 1.000 g" : "1.000 g", { dispColor: l > tJ ? C.red : C.green });
      const lab = "BCCDDDEEEE"; for (let p = 0; p < 10; p++) { const [x, y] = onPlate(sx, sy, p, 10, 30); coin(ctx, x, y, 30, lab[p], {}); }
      ctx.save(); ctx.globalAlpha = ap(l, 0.3);
      coin(ctx, 220, 420, 56, "", {}); text(ctx, "asli", 220, 530, 34, { mono: true, weight: 800, align: "center" });
      text(ctx, "<", 370, 440, 70, { mono: true, weight: 800, align: "center", color: C.red });
      coin(ctx, 520, 420, 56, "", { fake: true }); text(ctx, "palsu", 520, 530, 34, { mono: true, weight: 800, align: "center", color: C.purple });
      ctx.restore();
      note(ctx, "selisihnya pasti dari koin palsu", 960, 790, 44, ap(l, tS - 0.3), { weight: 800, color: C.purple });
    },
    tujuh(ctx, b, l) {
      const t7 = at(b, "tujuh", 2), tK = at(b, "kelebihan");
      const sx = 700, sy = 470;
      scale(ctx, sx, sy, 700, "1.007 g", { dispColor: C.red });
      const lab = "BCCDDDEEEE"; for (let p = 0; p < 10; p++) { const [x, y] = onPlate(sx, sy, p, 10, 28); coin(ctx, x, y, 28, lab[p], {}); }
      const u = ap(l, t7 - 0.4);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.textAlign = "right";
        text(ctx, "1.007 g", 1640, 300, 60, { mono: true, weight: 800, align: "right" });
        text(ctx, "− 1.000 g", 1640, 380, 60, { mono: true, weight: 800, align: "right", color: C.mut });
        ctx.fillStyle = C.ink; ctx.fillRect(1260, 410, 390, 5);
        text(ctx, "7 g", 1640, 500, 76, { mono: true, weight: 800, align: "right", color: C.red }); ctx.restore(); }
      note(ctx, "= kelebihan berat", 1450, 580, 44, ap(l, tK - 0.2), { weight: 800, color: C.green });
    },
    tabel(ctx, b, l) {
      const col = b.col; const tV = col === 0 ? at(b, "nol") : at(b, "Kelebihannya");
      const n = EX[col].length, fu = clamp((l - tV + 0.2) / (0.55 * n), 0, 1);
      exTable(ctx, 120, 130, 1680, { upto: col, fillU: fu, h: 470, hlCol: col, hlU: 0.6 });
      const sums = { 3: [["1 + 2 + 4", "7"], ["2 + 4 + 8", "14"]], 4: [["1 + 2 + 4 + 8", "15"]], 2: [["2 koin palsu: jumlah dua berat berbeda", ""]], 1: [["1 koin palsu: +1, +2, +4, atau +8", ""]], 0: [["0 koin palsu di timbangan: +0", ""]] }[col];
      const tN = col === 0 ? at(b, "tidak") : tV + 1.0;
      sums.forEach(([s, v], i) => note(ctx, v ? s + " = " + v : s, 960 + (sums.length > 1 ? (i ? 360 : -360) : 0), 690, 40, ap(l, tN + i * 1.2), { mono: true, weight: 700, color: COLW[col] }));
    },
    deret(ctx, b, l) {
      const tS = at(b, "Setiap"), tT = at(b, "tidak");
      exTable(ctx, 120, 120, 1680, { h: 420, alpha: 1 - 0.5 * ap(l, tS) });
      const colOf = v => EX.findIndex(e => e.includes(v));
      for (let v = 0; v <= 15; v++) { const x = 180 + v * 104, u = ap(l, tS + 0.2 + v * 0.18, 0.3); if (u <= 0) continue;
        ctx.save(); ctx.globalAlpha = u; rr(ctx, x - 46, 590, 92, 92, 12); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = COLW[colOf(v)]; ctx.stroke();
        text(ctx, String(v), x, 652, 44, { mono: true, weight: 800, align: "center", color: COLW[colOf(v)] }); text(ctx, L[colOf(v)], x, 720, 26, { mono: true, weight: 700, align: "center", color: C.mut }); ctx.restore(); }
      note(ctx, "0 sampai 15: masing-masing tepat satu kali", 960, 800, 40, ap(l, tT - 0.2), { weight: 800, color: C.green });
    },
    contoh6(ctx, b, l) {
      const t6 = at(b, "enam", 2), tC = at(b, "C."), tJ = at(b, "Jadi");
      scale(ctx, 380, 300, 460, "1.006 g", { dispColor: C.red });
      note(ctx, "1.006 − 1.000 = 6", 380, 590, 40, ap(l, t6 - 0.3), { mono: true, weight: 800, color: C.red });
      exTable(ctx, 680, 130, 1140, { h: 480, hlVal: l > tC - 0.4 ? 6 : null, hlCol: l > tJ - 0.2 ? 2 : null, hlU: ap(l, tJ - 0.2) });
      bigNote(ctx, "label C palsu", 1250, 720, 60, ap(l, tJ), { color: C.green });
    },
    // ---------- 5. JEBAKAN DAN JAWABAN ----------
    nol(ctx, b, l) {
      const tT = at(b, "Tidak"), tK = at(b, "Kelima");
      bigNote(ctx, "0 kali menimbang?", 960, 200, 64, ap(l, 0.2));
      cross(ctx, 1320, 180, 60, C.purple, ap(l, tT, 0.5));
      groups(ctx, { cy: 380, s: 0.75, mark: ["?", "?", "?", "?", "?"], markU: [0, 1, 2, 3, 4].map(i => ap(l, tK + i * 0.15)) });
      scale(ctx, 960, 620, 420, "", { alpha: 0.8 });
    },
    jawaban(ctx, b, l) {
      const tS = at(b, "satu"), tA = at(b, "asalkan");
      ctx.save(); ctx.globalAlpha = ap(l, tS - 0.3); label(ctx, "// JAWABAN", 960, 190, { align: "center" }); ctx.restore();
      const u = ap(l, tS - 0.2, 0.5);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; text(ctx, "1", 760, 520, 340 * (0.85 + 0.15 * u), { disp: true, weight: 800, align: "center", color: C.red }); text(ctx, "kali menimbang", 1130, 450, 64, { disp: true, weight: 800, align: "center" }); ctx.restore(); }
      const v = ap(l, tA - 0.2);
      if (v > 0) { ctx.save(); ctx.globalAlpha = v; panel(ctx, 460, 590, 1000, 170, {});
        for (let i = 0; i < 5; i++) { const x = 560 + i * 200; text(ctx, L[i], x, 655, 36, { mono: true, weight: 800, align: "center" }); text(ctx, i + " koin", x, 725, 36, { mono: true, weight: 800, align: "center", color: C.green }); }
        ctx.restore(); }
    },
    // ---------- 6. RAHASIA 1, 2, 4, 8 ----------
    rahasia(ctx, b, l) {
      const tK = at(b, "Kenapa"), tV = at(b, "satu");
      bigNote(ctx, "Kenapa trik ini berhasil?", 960, 260, 72, ap(l, tK - 0.2));
      [1, 2, 4, 8].forEach((v, i) => { const u = ap(l, tV + i * 0.5); if (u <= 0) return; chip(ctx, "+" + v, 560 + i * 270, 400, { size: 80, color: C.red, stroke: C.red, alpha: u, px: 34, py: 22 }); });
    },
    bit(ctx, b, l) {
      const tB = at(b, "biner"), t01 = at(b, "nol");
      const u = ap(l, tB - 0.4);
      [8, 4, 2, 1].forEach((v, i) => { const x = 600 + i * 240; ctx.save(); ctx.globalAlpha = u;
        rr(ctx, x - 90, 280, 180, 180, 14); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.green; ctx.stroke();
        text(ctx, String(v), x, 400, 90, { mono: true, weight: 800, align: "center", color: C.red });
        text(ctx, "nilai tempat", x, 510, 24, { mono: true, weight: 600, align: "center", color: C.mut }); ctx.restore(); });
      note(ctx, "bilangan biner: hanya angka 0 dan 1", 960, 640, 44, ap(l, t01 - 0.2), { weight: 800, color: C.green });
    },
    biner_c(ctx, b, l) {
      const tC = at(b, "kolom"), t3 = at(b, "Tiga"), t6 = at(b, "enam"), tS = at(b, "Semua");
      const C6 = [3, 5, 6, 9, 10, 12];
      text(ctx, "8  4  2  1", 1020, 170, 30, { mono: true, weight: 700, color: C.mut });
      C6.forEach((v, i) => {
        const y = 240 + i * 92, show = i === 0 ? ap(l, t3 - 0.2) : i === 2 ? ap(l, t6 - 0.2) : ap(l, tS - 0.6 + i * 0.12);
        if (show <= 0 && !(l > tC && i < 0)) return;
        ctx.save(); ctx.globalAlpha = show;
        text(ctx, String(v), 760, y, 56, { mono: true, weight: 800, align: "right", color: COLW[2] }); text(ctx, "=", 860, y, 56, { mono: true, weight: 700, align: "center", color: C.mut });
        const bits = v.toString(2).padStart(4, "0");
        [...bits].forEach((c, k) => { const x = 1000 + k * 72; if (c === "1") { rr(ctx, x - 28, y - 52, 56, 66, 8); ctx.fillStyle = C.redBg; ctx.fill(); } text(ctx, c, x, y, 56, { mono: true, weight: 800, align: "center", color: c === "1" ? C.red : C.mut }); });
        ctx.restore();
      });
      bigNote(ctx, "tepat dua angka 1", 1560, 470, 48, ap(l, tS + 1), { color: C.red, fit: 520 });
      note(ctx, "kolom C = 2 koin palsu", 1560, 540, 32, ap(l, tS + 1.3), { weight: 700, color: C.mut });
    },
    biner_all(ctx, b, l) {
      const tD = at(b, "kolom"), tE = at(b, "kolom", 2);
      const cols = [[1, [1, 2, 4, 8], 1, 0.2], [2, [3, 5, 6, 9, 10, 12], 2, 0.2], [3, [7, 11, 13, 14], 3, tD - 0.3], [4, [15], 4, tE - 0.3]];
      cols.forEach(([ci, vals, ones, t0], j) => {
        const x = 240 + j * 440, u = ap(l, t0); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u;
        panel(ctx, x - 190, 120, 380, 640, { stroke: COLW[ci] });
        text(ctx, "label " + L[ci], x, 175, 32, { mono: true, weight: 800, align: "center", color: COLW[ci] });
        vals.forEach((v, k) => { const y = 240 + k * 66; text(ctx, String(v).padStart(2, " "), x - 100, y, 34, { mono: true, weight: 700, align: "right", color: C.mut });
          [...v.toString(2).padStart(4, "0")].forEach((c, q) => text(ctx, c, x - 40 + q * 44, y, 38, { mono: true, weight: 800, align: "center", color: c === "1" ? C.red : "#B7AC92" })); });
        text(ctx, ones + "× angka 1", x, 730, 34, { mono: true, weight: 800, align: "center", color: C.red });
        ctx.restore();
      });
    },
    rantai(ctx, b, l) {
      const t1 = at(b, "berapa"), t2 = at(b, "koin"), t3 = at(b, "labelnya");
      const box = (s, x, u, col) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; panel(ctx, x - 250, 330, 500, 200, { stroke: col, lw: 5 }); para(ctx, s, x, 415, 40, 440, { weight: 800, align: "center", lh: 1.25 }); ctx.restore(); };
      box("banyak angka 1", 380, ap(l, t1 - 0.2), C.red); arrow(ctx, 640, 430, 700, 430, { u: ap(l, t2 - 0.4), color: C.mut });
      box("banyak koin palsu ditimbang", 960, ap(l, t2 - 0.3), C.purple); arrow(ctx, 1220, 430, 1280, 430, { u: ap(l, t3 - 0.8), color: C.mut });
      box("label yang palsu", 1540, ap(l, t3 - 0.6), C.green);
      note(ctx, "contoh: 6 = 0110 → dua angka 1 → 2 koin → label C", 960, 660, 34, ap(l, t3 + 0.4), { mono: true, weight: 700, color: C.ink });
    },
    bagaimana(ctx, b, l) {
      const t1 = at(b, "satu", 1), tS = at(b, "Kalau", 2), tD = at(b, "Kalau", 3);
      ctx.save(); ctx.globalAlpha = ap(l, 0.2);
      text(ctx, "koin palsu:", 200, 220, 36, { weight: 700, color: C.mut }); ctx.restore();
      [101, 102, 103, 104].forEach((w, i) => chip(ctx, w + " g", 420 + i * 230, 175, { size: 40, color: C.purple, stroke: C.purple, fill: C.purpleBg, alpha: ap(l, t1 - 0.3 + i * 0.4) }));
      const blink = l > tD + 1.5 ? 0.5 + 0.5 * Math.sin(l * 8) : 0;
      const row = (y, lbl, vals, hlv, u) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; panel(ctx, 160, y - 75, 1600, 130, {});
        text(ctx, lbl, 200, y + 12, 34, { mono: true, weight: 700, color: C.mut });
        vals.forEach((v, i) => { const x = 780 + i * 170; if (v === hlv && blink > 0) { rr(ctx, x - 60, y - 44, 120, 70, 10); ctx.fillStyle = `rgba(138,63,168,${0.15 + 0.35 * blink})`; ctx.fill(); }
          text(ctx, "+" + v, x, y + 12, 52, { mono: true, weight: 800, align: "center", color: v === hlv ? C.purple : C.ink }); }); ctx.restore(); };
      row(420, "ambil 1 koin:", [1, 2, 3, 4], 3, ap(l, tS - 0.2));
      row(620, "ambil 2 koin:", [3, 4, 5, 6, 7], 3, ap(l, tD - 0.2));
      note(ctx, "1 + 2 = 3", 1460, 720, 32, ap(l, tD + 2.0), { mono: true, weight: 700, color: C.purple });
    },
    sengaja(ctx, b, l) {
      const tT = at(b, "Ternyata");
      ctx.save(); ctx.globalAlpha = 1 - 0.6 * ap(l, tT);
      text(ctx, "+3", 760, 300, 120, { mono: true, weight: 800, align: "center", color: C.purple }); text(ctx, "?", 960, 300, 120, { disp: true, weight: 800, align: "center", color: C.purple }); text(ctx, "+3", 1160, 300, 120, { mono: true, weight: 800, align: "center", color: C.purple });
      text(ctx, "1 koin atau 2 koin?", 960, 400, 40, { weight: 700, align: "center", color: C.mut }); ctx.restore();
      const u = ap(l, tT - 0.2);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; panel(ctx, 360, 470, 1200, 220, { stroke: C.green, lw: 5 });
        text(ctx, "1, 2, 4, 8", 960, 570, 84, { mono: true, weight: 800, align: "center", color: C.red }); text(ctx, "dipilih dengan sengaja", 960, 650, 44, { weight: 800, align: "center" }); ctx.restore(); }
    },
    izin(ctx, b, l) {
      const tF = at(b, "file."), tS = at(b, "Setiap"), tD = at(b, "dibaca");
      const u = ap(l, tF - 0.6);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u;
        // ikon berkas
        ctx.beginPath(); ctx.moveTo(240, 200); ctx.lineTo(400, 200); ctx.lineTo(460, 260); ctx.lineTo(460, 440); ctx.lineTo(240, 440); ctx.closePath(); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(400, 200); ctx.lineTo(400, 260); ctx.lineTo(460, 260); ctx.stroke();
        for (let k = 0; k < 4; k++) { ctx.fillStyle = C.line; ctx.fillRect(270, 300 + k * 32, 150, 10); }
        text(ctx, "laporan.txt", 350, 500, 32, { mono: true, weight: 700, align: "center" }); ctx.restore(); }
      const P = [["baca", 4, true], ["tulis", 2, true], ["jalankan", 1, false]];
      P.forEach(([nm, v, on], i) => { const y = 250 + i * 120, uu = ap(l, tS - 0.3 + i * 0.5); if (uu <= 0) return; ctx.save(); ctx.globalAlpha = uu;
        panel(ctx, 620, y - 70, 620, 100, {});
        text(ctx, nm, 660, y, 40, { weight: 700 }); text(ctx, "= " + v, 960, y, 44, { mono: true, weight: 800, color: C.red });
        const lit = l > tD - 0.5; rr(ctx, 1110, y - 50, 96, 52, 26); ctx.fillStyle = lit && on ? C.green : C.line; ctx.fill(); ctx.beginPath(); ctx.arc(lit && on ? 1180 : 1136, y - 24, 20, 0, Math.PI * 2); ctx.fillStyle = C.white; ctx.fill();
        ctx.restore(); });
      const w = ap(l, tD - 0.3);
      if (w > 0) { ctx.save(); ctx.globalAlpha = w; panel(ctx, 1320, 180, 460, 400, { stroke: C.green, lw: 5 });
        text(ctx, "4 + 2 = 6", 1550, 300, 56, { mono: true, weight: 800, align: "center", color: C.red });
        text(ctx, "110", 1550, 400, 64, { mono: true, weight: 800, align: "center" });
        text(ctx, "boleh baca", 1550, 480, 34, { weight: 700, align: "center", color: C.green }); text(ctx, "dan tulis", 1550, 525, 34, { weight: 700, align: "center", color: C.green }); ctx.restore(); }
    },
    // ---------- 7. PENUTUP ----------
    ringkas(ctx, b, l) {
      const tB = at(b, "berbeda"), tH = at(b, "menghasilkan"), tL = at(b, "melihat");
      const S = [["1", "Ambil jumlah koin berbeda", "0, 1, 2, 3, 4 koin", tB - 0.5], ["2", "Timbang sekali", "setiap label → kelebihan berbeda", tH - 0.3], ["3", "Baca kelebihan berat", "angkanya menunjuk label palsu", tL - 0.3]];
      text(ctx, "RINGKASAN", 960, 190, 34, { mono: true, weight: 700, align: "center", color: C.green, ls: 4 });
      S.forEach(([n, a, s, t0], i) => { const x = 360 + i * 600, u = ap(l, t0); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u;
        panel(ctx, x - 270, 250, 540, 400, {}); ctx.beginPath(); ctx.arc(x, 340, 46, 0, Math.PI * 2); ctx.fillStyle = C.green; ctx.fill();
        text(ctx, n, x, 360, 52, { mono: true, weight: 800, align: "center", color: C.white });
        para(ctx, a, x, 470, 44, 480, { weight: 800, align: "center", disp: true, lh: 1.15 }); para(ctx, s, x, 590, 30, 480, { weight: 600, align: "center", color: C.mut, mono: true });
        ctx.restore(); if (i < 2) arrow(ctx, x + 280, 450, x + 320, 450, { u, color: C.mut }); });
    },
    kredit(ctx, b, l) {
      const u = ap(l, 0.2);
      ctx.save(); ctx.globalAlpha = u; panel(ctx, 360, 150, 1200, 600, {});
      label(ctx, "// KREDIT SOAL", 420, 220);
      text(ctx, "“Koin Palsu”", 420, 320, 76, { disp: true, weight: 800 });
      text(ctx, "Soal nomor 10 · OSN-K Informatika 2026 · Jenjang SMA", 420, 400, 34, { weight: 700, fit: 1080 });
      text(ctx, "Tingkat Kabupaten/Kota", 420, 455, 34, { weight: 600, color: C.mut });
      ctx.restore();
      ctx.save(); ctx.globalAlpha = ap(l, at(b, "Terima") - 0.2);
      text(ctx, "Penyusun: Tim Olimpiade Komputer Indonesia (TOKI)", 420, 550, 36, { weight: 800, color: C.green, fit: 1080 });
      text(ctx, "Naskah soal: osn.toki.id", 420, 615, 32, { mono: true, weight: 600 });
      text(ctx, "Gambar soal digambar ulang untuk video ini.", 420, 690, 26, { weight: 600, color: C.mut });
      ctx.restore();
    },
    akhir(ctx, b, l) {
      const tS = at(b, "situs"), tJ = at(b, "Sampai");
      ctx.save(); ctx.globalAlpha = ap(l, tS - 0.5);
      text(ctx, "BERLATIH SOAL LAIN", 960, 200, 30, { mono: true, weight: 700, align: "center", color: C.green, ls: 4 });
      chip(ctx, "tlx.toki.id", 960, 240, { size: 72, color: C.ink, stroke: C.green, lw: 4, center: true, px: 40, py: 20 });
      ctx.restore();
      const u = ap(l, tJ - 0.3);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; panel(ctx, 460, 470, 1000, 250, { stroke: C.line });
        label(ctx, "// BERIKUTNYA DI SERI INI", 960, 535, { align: "center" });
        para(ctx, "Empat Soal OSN-K yang Bisa Kamu Jawab Tanpa Coding", 960, 610, 48, 900, { disp: true, weight: 800, align: "center", lh: 1.15 }); ctx.restore(); }
    }
  });
})();
