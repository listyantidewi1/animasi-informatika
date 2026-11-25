/* R01 — mesin adegan: satu adegan "r01" yang menggambar rancangan per beat dari vis.js (dibuat vis.py).
   Jenis: daftar, dua, kutip, peta, tokoh, catatan, tonton, alur, gd (gambar + daftar), x (khusus: pelayan, rencana, akhir).
   Aturan tata letak: judul y 140, isi y 236–796, label bawah y 852, tidak ada teks penting di bawah 900; teks ≥ 40 px. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P, R = K.r01, VIS = K.r01vis || {};
  const { clamp, lerp, eio, eout, spring } = D; const { ramp, txt, RR } = U; const TAU = U.TAU, T = R.T, COL = R.COL, popAt = R.popAt, pil = R.pil;
  const INK = "#10142E", SEGCOL = [P.amber, P.teal, P.blue, P.violet, P.green, P.pink, P.amber, P.red, P.teal, P.amber];
  const STASIUN = { 2: 0, 3: 1, 4: 2, 6: 3, 8: 4 };
  const mW = (ctx, s, size, w = 800) => { ctx.font = `${w} ${size}px ${K.FONT}`; return ctx.measureText(s).width; };
  function wrap(ctx, s, size, weight, maxW, maxL = 3) { const ws = String(s).split(" "), out = []; let cur = "";
    ws.forEach(w => { const nx = cur ? cur + " " + w : w; if (mW(ctx, nx, size, weight) > maxW && cur && out.length < maxL - 1) { out.push(cur); cur = w; } else cur = nx; }); if (cur) out.push(cur);
    if (out.length === 2 && maxL >= 2) { let best = out, bd = 1e9; for (let i = 1; i < ws.length; i++) { const a = ws.slice(0, i).join(" "), c = ws.slice(i).join(" "), wa = mW(ctx, a, size, weight), wc = mW(ctx, c, size, weight); if (wa <= maxW && wc <= maxW && Math.abs(wa - wc) < bd) { bd = Math.abs(wa - wc); best = [a, c]; } } return best; }
    return out; }

  function judul(ctx, b, l, v) { if (!v.j) return; if (v.j2 && l >= T(b, v.j2[0]) - 0.3) { D.post(c => U.judulPop(c, v.j2[1], 960, 140, 62, l, T(b, v.j2[0]) - 0.3, { col: P.amber })); return; }
    const s = Array.isArray(v.j) ? v.j[1] : v.j, t0 = Array.isArray(v.j) ? Math.max(0.3, T(b, v.j[0]) - 0.3) : 0.3;
    D.post(c => U.judulPop(c, s, 960, 140, 62, l, t0, { col: SEGCOL[b.seg] })); }
  function bawah(ctx, b, l, v) { if (!v.bawah || Array.isArray(v.bawah[0])) return; D.post(c => U.tagPop(c, v.bawah[1], 960, 852, l, Math.max(0.4, T(b, v.bawah[0]) - 0.2), { size: 48 })); }
  function miniPeta(ctx, b) { const st = STASIUN[b.seg]; if (st == null) return; D.post(c => { c.strokeStyle = "rgba(242,246,255,0.3)"; c.lineWidth = 4; c.beginPath(); c.moveTo(1630, 48); c.lineTo(1806, 48); c.stroke();
      for (let i = 0; i < 5; i++) { c.fillStyle = i === st ? P.amber : i < st ? P.teal : "#44528A"; c.beginPath(); c.arc(1630 + i * 44, 48, i === st ? 15 : 10, 0, TAU); c.fill(); } }); }

  // ---------- daftar butir: [kunci, s1, s2?, tanda?] ----------
  function drawItems(ctx, b, l, items, B, o = {}) {
    const kol = o.kol || 1, colW = kol === 1 ? B.w : (B.w - 30) / 2, size = o.size || 46, padL = 104, fitW = colW - padL - 28, col = o.col || P.amber;
    const rows = items.map(it => { const L = []; wrap(ctx, it[1], size, 800, fitW, 2).forEach(s => L.push([s, size, 800, P.ink])); if (it[2]) wrap(ctx, it[2], 40, 700, fitW, 2).forEach(s => L.push([s, 40, 700, P.ink2])); return L; });
    let pad = o.flat ? 10 : 22, lh = z => z >= 44 ? 56 : 50, gap = o.flat ? 8 : 16, hs, rowH, tot, f = 1; const nR = Math.ceil(items.length / kol);
    const ukur = () => { hs = rows.map(L => pad * 2 + L.reduce((a, x) => a + lh(x[1]), 0)); rowH = []; for (let r = 0; r < nR; r++) rowH.push(Math.max(...hs.slice(r * kol, r * kol + kol))); tot = rowH.reduce((a, x) => a + x, 0) + gap * (nR - 1); };
    ukur(); if (tot > B.h) { pad = 9; gap = 9; lh = z => z >= 44 ? 51 : 45; ukur(); }
    if (tot > B.h) { f = B.h / tot; gap *= f; rowH = rowH.map(x => x * f); tot = B.h; }
    const ts = items.map(it => T(b, it[0]) - 0.25), cur = o.sorot != null ? o.sorot : R.latest(l, ts); let y = B.y + (o.atas ? 0 : (B.h - tot) / 2); const ys = []; rowH.forEach(h => { ys.push(y); y += h + gap; });
    items.forEach((it, i) => { const r = Math.floor(i / kol), x = B.x + (i % kol) * (colW + 30), yy = ys[r], h = rowH[r], on = l >= ts[i], q = on ? U.pop(l, ts[i]) : { a: 1, sp: 1 }, L = rows[i], m = it[3];
      if (!on) { if (o.flat) return; ctx.save(); ctx.globalAlpha *= 0.3 * ramp(l, 0.2, 0.4); U.panel(ctx, x, yy, colW, h, { r: 22 }); if (o.no) { ctx.fillStyle = "#44528A"; ctx.beginPath(); ctx.arc(x + 54, yy + h / 2, 28, 0, TAU); ctx.fill(); txt(ctx, String(i + 1), x + 54, yy + h / 2 + 16, 44, { align: "center", weight: 900, color: P.ink2 }); } ctx.restore(); return; }
      popAt(ctx, x + colW / 2, yy + h / 2, q, () => { ctx.translate(-colW / 2, -h / 2); const mc = m === "-" ? P.red : m === "+" || o.cek ? P.green : col;
        if (!o.flat) U.panel(ctx, 0, 0, colW, h, { r: 22, stroke: i === cur ? P.amber : D.hexA(mc, 0.55), lw: i === cur ? 6 : 3 }); else if (i === cur) { ctx.fillStyle = D.hexA(P.amber, 0.14); RR(ctx, 0, 0, colW, h, 16); ctx.fill(); }
        const k = ts[i] < -5 ? 1 : (l - ts[i]) / 0.4;
        if (o.no) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(54, h / 2, 28, 0, TAU); ctx.fill(); txt(ctx, String(i + 1), 54, h / 2 + 16, 44, { align: "center", weight: 900, color: INK }); }
        else if (m === "-") U.silang(ctx, 54, h / 2, 26, k); else if (m === "+" || o.cek) U.centang(ctx, 54, h / 2, 26, k); else { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(54, h / 2, 13, 0, TAU); ctx.fill(); }
        if (i === cur && !o.flat && ts[i] > -5) { const nx = Math.min(...ts.filter(z => z > ts[i] + 0.05), D.speechEnd(b)), k = clamp((l - ts[i]) / Math.max(0.6, nx - ts[i])); ctx.fillStyle = D.hexA(P.amber, 0.85); RR(ctx, 22, h - 9, (colW - 44) * k, 5, 2.5); ctx.fill(); }
        const th = L.reduce((a, x) => a + lh(x[1]), 0) * f; let ty = (h - th) / 2; L.forEach(([s, z, w, c]) => { const lhh = lh(z) * f; txt(ctx, s, padL, ty + lhh / 2 + z * 0.35, z, { weight: w, color: c, fit: fitW }); ty += lhh; }); }); });
  }
  // deretan label yang membungkus ke baris berikutnya
  function chips(ctx, b, l, list, yTop, size = 44) { const maxW = 1660, gapX = 24, rows = [[]]; let w = 0;
    const ws = list.map(it => mW(ctx, it[1], size) + size * 1.2); list.forEach((it, i) => { if (w + ws[i] > maxW && rows[rows.length - 1].length) { rows.push([]); w = 0; } rows[rows.length - 1].push(i); w += ws[i] + gapX; });
    const cl = [P.teal, P.amber, P.pink, P.green]; D.post(c => rows.forEach((r, j) => { const tw = r.reduce((a, i) => a + ws[i], 0) + gapX * (r.length - 1); let x = 960 - tw / 2; r.forEach(i => { U.tagPop(c, list[i][1], x + ws[i] / 2, yTop + j * 92, l, Math.max(0.4, T(b, list[i][0]) - 0.2), { size, col: cl[i % 4] }); x += ws[i] + gapX; }); })); }

  const A = {};
  A.daftar = (ctx, b, l, t, v) => { const w = v.kol === 2 ? 1700 : (v.w || 1200); drawItems(ctx, b, l, v.items, { x: 960 - w / 2, y: 236, w, h: 560 }, { kol: v.kol, no: v.no, cek: v.cek, sorot: v.sorot, col: SEGCOL[b.seg] }); };
  A.gd = (ctx, b, l, t, v) => { const B = { x: 110, y: 236, w: 660, h: 560 }; if (R.pic[v.g]) R.pic[v.g](ctx, b, l, t, B, v.gp || {}); drawItems(ctx, b, l, v.items, { x: 810, y: 236, w: 1010, h: 560 }, { col: SEGCOL[b.seg] }); };
  A.dua = (ctx, b, l, t, v) => { [["kiri", 110], ["kanan", 980]].forEach(([nm, x]) => { const s = v[nm], t0 = s.key ? T(b, s.key) - 0.3 : -9, c = COL(s.w), q = U.pop(l, t0);
      if (l < t0) { ctx.save(); ctx.globalAlpha *= 0.3; U.panel(ctx, x, 236, 830, 560); ctx.restore(); return; }
      ctx.save(); ctx.globalAlpha *= q.a; U.panel(ctx, x, 236, 830, 560, { stroke: D.hexA(c, 0.9), lw: 5 }); txt(ctx, s.j, x + 40, 312, 54, { weight: 900, color: c, fit: 750 });
      if (s.g && R.pic[s.g]) R.pic[s.g](ctx, b, l, t, { x: x + 30, y: 340, w: 770, h: 140 }, s);
      drawItems(ctx, b, l, s.items, { x: x + 20, y: s.g ? 500 : 340, w: 790, h: s.g ? 284 : 440 }, { flat: 1, col: c, atas: 1 }); ctx.restore(); }); };
  A.kutip = (ctx, b, l, t, v) => { const H = v.baris.reduce((a, r) => a + r[3] * 1.5, 0); let y = 500 - H / 2; D.glow(ctx, 960, 500, 700, SEGCOL[b.seg], 0.16);
    if (v.bip) U.bip(ctx, 200, 790, 150, t, { pose: "diam", mood: v.bip });
    v.baris.forEach(([k, s, c, z]) => { const t0 = Math.max(0.3, T(b, k) - 0.25), q = U.pop(l, t0); y += z * 1.5; const yy = y - z * 0.4; if (q.a > 0) { ctx.save(); ctx.globalAlpha *= q.a; ctx.translate(960, yy); const kk = lerp(0.9, 1, q.sp); ctx.scale(kk, kk); ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 18; txt(ctx, s, 0, 0, z, { align: "center", weight: 900, color: c ? COL(c) : P.ink, fit: 1640 }); ctx.restore(); } }); };

  // ---------- peta lima stasiun ----------
  const NAMA = ["Fondasi", "Alat kerja", "Aplikasi utuh", "Portofolio", "Kerja pertama"], NC = [P.teal, P.blue, P.green, P.amber, P.pink], SX = i => 236 + i * 350, SY = i => (i % 2 ? 400 : 470);
  function jalan(ctx) { ctx.beginPath(); ctx.moveTo(40, 520); ctx.quadraticCurveTo(140, 500, SX(0), SY(0)); for (let i = 0; i < 4; i++) { const mx = (SX(i) + SX(i + 1)) / 2; ctx.bezierCurveTo(mx, SY(i), mx, SY(i + 1), SX(i + 1), SY(i + 1)); } ctx.quadraticCurveTo(1760, 500, 1890, 430); }
  R.peta = function (ctx, l, t, lit, aktif, o = {}) { const a = ramp(l, 0.2, 0.6); ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = "round"; ctx.strokeStyle = "rgba(8,14,44,0.9)"; ctx.lineWidth = 34; jalan(ctx); ctx.stroke(); ctx.strokeStyle = "rgba(242,246,255,0.5)"; ctx.lineWidth = 5; ctx.setLineDash([22, 22]); ctx.lineDashOffset = -t * 30; jalan(ctx); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    NAMA.forEach((nm, i) => { const on = l >= lit[i], q = on && lit[i] > 0 ? U.pop(l, lit[i]) : { a: a, sp: 1 }, x = SX(i), y = SY(i);
      if (on && i === aktif) D.glow(ctx, x, y, 170 + 16 * Math.sin(t * 4), NC[i], 0.6);
      popAt(ctx, x, y, q, () => { ctx.fillStyle = on ? NC[i] : "#2B3A6E"; ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fill(); ctx.strokeStyle = on ? "#FFFFFF" : "rgba(242,246,255,0.3)"; ctx.lineWidth = 5; ctx.stroke(); txt(ctx, String(i + 1), 0, 23, 66, { align: "center", weight: 900, color: on ? INK : P.dim }); });
      ctx.save(); ctx.globalAlpha *= a * (on ? 1 : 0.5); txt(ctx, nm, x, y + 122, 44, { align: "center", weight: 900, color: on ? P.ink : P.ink2 }); ctx.restore(); });
    if (aktif >= 0 && !o.noBip) U.bip(ctx, SX(aktif), SY(aktif) - 150, 110, t, { mood: "happy" }); };
  A.peta = (ctx, b, l, t, v) => { let lit = NAMA.map((_, i) => (v.aktif < 0 || i <= v.aktif) ? 0.5 + i * 0.25 : 1e9); if (v.nyala) { lit = NAMA.map(() => 1e9); v.nyala.forEach(([k, i]) => lit[i] = T(b, k) - 0.2); }
    R.peta(ctx, l, t, lit, v.aktif);
    if (v.ai) { const q = U.pop(l, T(b, v.ai) - 0.2); popAt(ctx, SX(3) + 178, 280, q, () => { ctx.fillStyle = P.ink2; ctx.fillRect(-5, 30, 10, 130); pil(ctx, "AI?", 0, 0, P.violet, 56, "#FFFFFF"); }); }
    if (v.lari) { const t0 = T(b, v.lari); if (l >= t0) { const u = ((l - t0) / 2.4) % 1 * 4, i = Math.min(3, Math.floor(u)), f = eio(u - i); D.glow(ctx, lerp(SX(i), SX(i + 1), f), lerp(SY(i), SY(i + 1), f) - 90, 80, P.ink, 0.9); U.bip(ctx, lerp(SX(i), SX(i + 1), f), lerp(SY(i), SY(i + 1), f) - 150, 100, t, { pose: "jalan" }); } }
    if (v.janji) chips(ctx, b, l, v.janji, 700); };

  // ---------- tiga tokoh ----------
  A.tokoh = (ctx, b, l, t, v) => { ["Rani", "Bayu", "Tegar"].forEach((nm, i) => { const x = 400 + i * 560, it = (v.siapa || []).find(s => s[0] === nm), t0 = it ? T(b, it[1]) - 0.2 : 1e9, on = l >= t0, q = on ? U.pop(l, t0) : { a: 0, sp: 0 };
      if (on) D.glow(ctx, x, 400, 300, [P.pink, P.teal, P.amber][i], 0.25 * q.a);
      R.tokoh(ctx, x, 510, 262, nm, t, on ? 1 : 0.32); ctx.save(); ctx.globalAlpha *= on ? 1 : 0.4; txt(ctx, nm, x, 572, 54, { align: "center", weight: 900 }); txt(ctx, R.STATUS[nm], x, 622, 40, { align: "center", weight: 700, color: P.ink2 }); ctx.restore();
      if (on && it[2]) { const L = wrap(ctx, it.slice(2).filter(Boolean).join(" "), 40, 800, 470, 3), h = L.length * 50 + 34; popAt(ctx, x, 648 + h / 2, q, () => { U.panel(ctx, -260, -h / 2, 520, h, { r: 20, stroke: [P.pink, P.teal, P.amber][i], lw: 4 }); L.forEach((s, j) => txt(ctx, s, 0, -h / 2 + 17 + j * 50 + 38, 40, { align: "center", weight: 800, fit: 490 })); }); } }); };

  A.catatan = (ctx, b, l, t, v) => { D.glow(ctx, 1080, 520, 800, P.amber, 0.14); U.panel(ctx, 330, 236, 1490, 560, { stroke: P.amber, lw: 5 }); U.bip(ctx, 200, 560, 150, t, { pose: "tunjuk", target: [330, 480], mood: "think" });
    drawItems(ctx, b, l, v.baris, { x: 360, y: 258, w: 1430, h: 516 }, { col: P.amber }); };

  A.tonton = (ctx, b, l, t, v) => { const t0 = Math.max(0.4, T(b, v.key) - 0.4), q = U.pop(l, t0), big = !v.juga, ty = v.juga ? 240 : 270;
    ctx.save(); ctx.globalAlpha *= 0.35 + 0.65 * ramp(l, t0, 0.4); R.thumb(ctx, 130, ty, 720, 405, v.gbr, true); ctx.restore();
    if (q.a > 0) { ctx.save(); ctx.globalAlpha *= q.a; txt(ctx, "Tonton di kanal ini", 910, ty + 56, 44, { weight: 800, color: P.ink2 }); const L = wrap(ctx, v.video, 68, 900, 880, 3); L.forEach((s, i) => txt(ctx, s, 910, ty + 150 + i * 84, 68, { weight: 900, color: P.amber, fit: 890 }));
      txt(ctx, v.sub, 910, ty + 150 + L.length * 84, 44, { weight: 700, fit: 890 }); ctx.restore(); D.post(c => U.tagPop(c, "Link ada di deskripsi", 1140, ty + 150 + L.length * 84 + 86, l, t0 + 0.8, { size: 44, col: P.teal })); }
    if (v.juga) { const t1 = T(b, v.juga[0]) - 0.4, q2 = U.pop(l, t1); if (q2.a > 0) { ctx.save(); ctx.globalAlpha *= q2.a; U.panel(ctx, 130, 672, 1690, 150, { stroke: P.violet, lw: 4 }); R.thumb(ctx, 150, 688, 210, 118, v.juga[2], false); const L = wrap(ctx, v.juga[1], 46, 800, 1400, 2); L.forEach((s, i) => txt(ctx, s, 390, (L.length === 1 ? 764 : 736) + i * 56, 46, { weight: 800, fit: 1410 })); ctx.restore(); } } };

  A.alur = (ctx, b, l, t, v) => { const n = v.langkah.length, w = Math.min(400, (1700 - (n - 1) * 70) / n), tot = n * w + (n - 1) * 70, x0 = 960 - tot / 2, y = v.bawah ? 270 : 350, h = 260, ts = v.langkah.map(s => T(b, s[0]) - 0.25), cur = R.latest(l, ts);
    v.langkah.forEach(([k, s, c], i) => { const x = x0 + i * (w + 70), col = COL(c), on = l >= ts[i], q = on ? U.pop(l, ts[i]) : { a: 1, sp: 1 }, L = s.split("|");
      if (i) U.panah(ctx, x - 62, y + h / 2, x - 12, y + h / 2, P.ink2, (l - ts[i] + 0.3) / 0.3, 8);
      popAt(ctx, x + w / 2, y + h / 2, q, () => { ctx.save(); if (!on) ctx.globalAlpha *= 0.3; U.panel(ctx, -w / 2, -h / 2, w, h, { stroke: i === cur ? P.amber : col, lw: i === cur ? 7 : 4, fill: on ? D.hexA(col, 0.2) : undefined }); ctx.fillStyle = on ? col : "#44528A"; ctx.beginPath(); ctx.arc(0, -h / 2, 34, 0, TAU); ctx.fill(); txt(ctx, String(i + 1), 0, -h / 2 + 17, 46, { align: "center", weight: 900, color: INK });
        if (on) L.forEach((z, j) => txt(ctx, z, 0, 18 - (L.length - 1) * 29 + j * 58 + 14, 46, { align: "center", weight: 900, fit: w - 30 })); ctx.restore(); }); });
    if (v.bawah) chips(ctx, b, l, v.bawah, 650); };

  // ---------- khusus ----------
  const X = {};
  X.pelayan = (ctx, b, l, t, v) => { const ts = v.ks.map(k => T(b, k) - 0.2), yb = 600;
    U.orang(ctx, 330, yb, 240, P.teal); ctx.fillStyle = "#8D5A2B"; RR(ctx, 230, yb - 20, 200, 22, 8); ctx.fill();
    U.panel(ctx, 1380, 360, 320, 250, { stroke: P.green, lw: 4 }); ctx.fillStyle = "#C9D0E8"; RR(ctx, 1470, 450, 140, 90, 16); ctx.fill(); ctx.fillStyle = "#8D98B8"; RR(ctx, 1450, 436, 180, 20, 8); ctx.fill(); for (let i = 0; i < 3; i++) { ctx.strokeStyle = "rgba(242,246,255,0.6)"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); for (let k = 0; k <= 6; k++) { const yy = 420 - k * 8, xx = 1500 + i * 40 + Math.sin(k + t * 3 + i) * 7; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    ctx.fillStyle = P.amber; ctx.beginPath(); ctx.moveTo(1510, 575); ctx.quadraticCurveTo(1540, 530 + Math.sin(t * 9) * 6, 1570, 575); ctx.fill();
    const qp = U.pop(l, ts[0]); if (qp.a > 0) { ctx.save(); ctx.globalAlpha *= qp.a; U.orang(ctx, 935, yb, 250, P.amber); ctx.fillStyle = "#DDE6FF"; ctx.beginPath(); ctx.ellipse(1020, yb - 150, 62, 12, 0, 0, TAU); ctx.fill(); ctx.restore(); } else { ctx.save(); ctx.globalAlpha *= 0.25; U.orang(ctx, 935, yb, 250, P.ink2); ctx.restore(); }
    if (l >= ts[1]) { const k = clamp((l - ts[1]) / 0.7); ctx.save(); ctx.strokeStyle = P.red; ctx.lineWidth = 8; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.moveTo(360, 350); ctx.quadraticCurveTo(935, 170, 360 + 1150 * k, 350); ctx.stroke(); ctx.restore(); U.silang(ctx, 935, 264, 46, (l - ts[1] - 0.5) / 0.4); }
    U.panah(ctx, 470, 470, 800, 470, P.teal, (l - ts[2]) / 0.6, 9); U.panah(ctx, 1070, 470, 1360, 470, P.teal, (l - ts[2] - 0.8) / 0.6, 9);
    U.panah(ctx, 1360, 550, 1070, 550, P.amber, (l - ts[3]) / 0.6, 9); U.panah(ctx, 800, 550, 470, 550, P.amber, (l - ts[3] - 0.7) / 0.6, 9);
    if (l >= ts[3] + 1.3) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(330, yb - 34, 60, 14, 0, 0, TAU); ctx.fill(); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(330, yb - 44, 26, Math.PI, 0); ctx.fill(); }
    D.post(c => { U.tagPop(c, "Kamu", 330, 690, l, 0.5, { col: P.teal, size: 46 }); U.tagPop(c, "Pelayan = API", 935, 690, l, ts[0], { size: 48 }); U.tagPop(c, "Dapur", 1540, 690, l, 0.7, { col: P.green, size: 46 });
      U.tagPop(c, "tampilan", 330, 786, l, ts[2], { col: P.blue, size: 44 }); U.tagPop(c, "server + database", 1540, 786, l, ts[2] + 0.8, { col: P.green, size: 44 }); }); };

  X.rencana = (ctx, b, l, t, v) => { const x0 = 430, bw = 112, FC = [P.teal, P.blue, P.amber];
    ["0", "3", "6", "9", "12"].forEach((s, i) => { const x = x0 + i * 3 * bw; ctx.strokeStyle = "rgba(242,246,255,0.18)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 262); ctx.lineTo(x, 800); ctx.stroke(); txt(ctx, s, x, 250, 40, { align: "center", weight: 800, color: P.ink2 }); }); txt(ctx, "bulan ke-", 130, 250, 40, { weight: 800, color: P.ink2 });
    v.rows.forEach(([nm, fase], r) => { const yc = 366 + r * 176, act = r === v.aktif; ctx.save(); if (!act) ctx.globalAlpha *= 0.78; R.tokoh(ctx, 180, yc + 70, 140, nm, t); txt(ctx, nm, 262, yc + 16, 46, { weight: 900 });
      const ts = fase.map(f => act ? T(b, f[0]) - 0.25 : -9), cur = act ? R.latest(l, ts) : -1;
      fase.forEach(([k, m0, m1, s], i) => { const x = x0 + m0 * bw + 7, w = (m1 - m0) * bw - 14, on = l >= ts[i], q = on ? U.pop(l, ts[i]) : { a: 1, sp: 1 }, L = s.split("|");
        popAt(ctx, x + w / 2, yc, q, () => { if (!on) { ctx.globalAlpha *= 0.35; ctx.strokeStyle = "rgba(242,246,255,0.5)"; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); RR(ctx, -w / 2, -72, w, 144, 20); ctx.stroke(); ctx.setLineDash([]); return; }
          ctx.fillStyle = FC[i]; RR(ctx, -w / 2, -72, w, 144, 20); ctx.fill(); if (i === cur) { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.stroke(); }
          L.forEach((z, j) => txt(ctx, z, 0, -(L.length - 1) * 22 + j * 44 + 14, 40, { align: "center", weight: 900, color: INK, fit: w - 16 })); }); }); ctx.restore(); }); };

  X.akhir = (ctx, b, l, t, v) => { const ts = v.ks.map(k => T(b, k) - 0.2); D.glow(ctx, 1440, 450, 700, P.amber, 0.18);
    ctx.save(); ctx.strokeStyle = "rgba(242,246,255,0.45)"; ctx.lineWidth = 5; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.arc(440, 300, 122, 0, TAU); ctx.stroke(); RR(ctx, 1056, 232, 768, 436, 24); ctx.stroke(); ctx.restore(); ctx.fillStyle = "rgba(10,18,52,0.5)"; RR(ctx, 1060, 236, 760, 428, 22); ctx.fill();
    txt(ctx, "Tonton berikutnya", 1440, 196, 50, { align: "center", weight: 900 }); const q = U.pop(l, ts[0]); if (q.a > 0) { ctx.save(); ctx.globalAlpha *= q.a; txt(ctx, "Sistem Antrean dari Nol", 1440, 742, 56, { align: "center", weight: 900, color: P.amber }); ctx.restore(); }
    txt(ctx, "I Teach Software Engineering", 440, 486, 42, { align: "center", weight: 800, color: P.ink2 });
    U.panel(ctx, 130, 540, 620, 240, { stroke: P.teal, lw: 4 }); txt(ctx, "Kamu sekarang di", 440, 618, 50, { align: "center", weight: 900 }); txt(ctx, "stasiun berapa?", 440, 680, 50, { align: "center", weight: 900, color: P.amber }); txt(ctx, "Tulis di komentar.", 440, 742, 42, { align: "center", weight: 700, color: P.ink2 });
    U.bip(ctx, 900, 730, 130, t, { mood: "happy" }); D.post(c => U.tagPop(c, "Sampai jumpa di sana!", 1440, 840, l, ts[1], { size: 48 })); };

  K.SCENES.r01 = function (ctx, b, l, t, TL) { const v = VIS[b.id]; U.latar(ctx, t, { col: SEGCOL[b.seg], gx: 1500 - (b.seg % 3) * 500, gy: 300 }); if (!v) return;
    if (v.k === "x") { if (X[v.f]) X[v.f](ctx, b, l, t, v); } else if (A[v.k]) A[v.k](ctx, b, l, t, v);
    judul(ctx, b, l, v); if (v.k !== "tokoh" && v.k !== "alur") bawah(ctx, b, l, v); miniPeta(ctx, b); };
})(typeof window !== "undefined" ? window : globalThis);
