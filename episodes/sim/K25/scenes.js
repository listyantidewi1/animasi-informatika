/* K25 Simulasi konsep: garis tren dan kuadrat error. Garis y = a + b·x diputar (di sekitar titik rata-rata) dan digeser
   di atas enam titik data rekaan; error tiap titik digambar sebagai jarak tegak dan kuadratnya sebagai persegi.
   Semua angka (garis regresi dan jumlah kuadrat error) sudah dicek dengan Python statistics.linear_regression.
   Kunci beat: data (rapat/sebar/pencilan/acak), keys [[cue|pecahan|null, a, b], …] (posisi garis; gerak dimulai pada cue),
   show [[cue, "line"|"err"|"sq"]], panel (sse/kurva/tabel), v (variasi), pilih. Adegan k25_ (video) dan k25s_ (Short).
   Semua gambar penting di atas y≈830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const X = [1, 2, 3, 4, 5, 6];
  const DATA = { rapat: [20, 24, 25, 28, 33, 35], sebar: [17, 27, 23, 32, 34, 32], pencilan: [20, 24, 25, 28, 33, 56], acak: [31, 24, 23, 35, 30, 25] };
  const RANGE = { rapat: [10, 40], sebar: [10, 40], acak: [10, 40], pencilan: [10, 60] };
  const UNIT = { rapat: "kg", sebar: "kg", pencilan: "kg", acak: "payung" };
  const NAMA = { rapat: "setoran bank sampah (kg, rekaan)", sebar: "setoran yang lebih menyebar (kg, rekaan)", pencilan: "bulan 6: kerja bakti besar (kg, rekaan)", acak: "payung tertinggal di sekolah (rekaan)" };
  const sse = (Y, a, b) => X.reduce((s, x, i) => s + (Y[i] - a - b * x) ** 2, 0);
  function reg(Y) { const mx = 3.5, my = Y.reduce((s, v) => s + v, 0) / 6; let sxy = 0, sxx = 0; X.forEach((x, i) => { sxy += (x - mx) * (Y[i] - my); sxx += (x - mx) ** 2; }); const b = sxy / sxx; return { a: my - b * mx, b, my }; }
  const fmt = v => { const r = Math.round(v * 10) / 10; return String(r).replace(".", ",").replace("-", "−"); };
  K.k25 = { DATA, sse, reg };   // untuk pemeriksaan angka
  const GREEN = "rgba(46,158,91,0.22)", RED = "rgba(217,68,59,0.20)", LINE = C.accent;

  // ---------- waktu ----------
  const A = b => b.audio || b.dur;
  const lead = b => (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * A(b); };
  const cueT = (b, c, dflt) => c == null ? dflt : typeof c === "number" ? lead(b) + c * A(b) : b.text.indexOf(c) >= 0 ? at(b, c) : dflt;
  function lineAt(b, l) {
    const keys = b.keys || [[null, 17, 3]]; let a = keys[0][1], bb = keys[0][2], moving = false;
    for (let i = 1; i < keys.length; i++) {
      const t0 = cueT(b, keys[i][0], lead(b) + 0.3), nx = i + 1 < keys.length ? cueT(b, keys[i + 1][0], t0 + 2) : t0 + 99, d = Math.min(1.8, Math.max(0.6, nx - t0 - 0.1));
      if (l < t0) break; const u = ease((l - t0) / d); if (u < 1) moving = true;
      a = lerp(keys[i - 1][1], keys[i][1], u); bb = lerp(keys[i - 1][2], keys[i][2], u);
    }
    return { a, b: bb, moving };
  }
  const shown = (b, l, what) => { const s = (b.show || []).find(q => q[1] === what); return !s || l >= cueT(b, s[0], 0) - 0.1; };

  // ---------- diagram titik ----------
  function plot(ctx, G, d, ln, o = {}) {
    const Y = DATA[d], [y0, y1] = RANGE[d], px = v => G.x + v / 7 * G.w, py = v => G.y + G.h - (v - y0) / (y1 - y0) * G.h, fs = G.fs || 20;
    if (o.frame !== false) card(ctx, G.x - 80, G.y - 40, G.w + 120, G.h + 100, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 16 });
    ctx.strokeStyle = "#E3EAEE"; ctx.lineWidth = 2; for (let v = y0; v <= y1; v += 10) { ctx.beginPath(); ctx.moveTo(G.x, py(v)); ctx.lineTo(G.x + G.w, py(v)); ctx.stroke(); text(ctx, String(v), G.x - 14, py(v) + 7, fs, { align: "right", weight: 700, color: C.ink2 }); }
    for (let v = 1; v <= 6; v++) text(ctx, String(v), px(v), G.y + G.h + fs + 10, fs, { align: "center", weight: 700, color: C.ink2 });
    ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(G.x, G.y); ctx.lineTo(G.x, G.y + G.h); ctx.lineTo(G.x + G.w, G.y + G.h); ctx.stroke();
    text(ctx, "bulan", G.x + G.w, G.y + G.h + fs * 2 + 14, fs, { align: "right", weight: 800, color: C.ink2 }); text(ctx, UNIT[d], G.x + 8, G.y - 12, fs, { weight: 800, color: C.ink2 });
    ctx.save(); ctx.beginPath(); ctx.rect(G.x, G.y - 4, G.w, G.h + 8); ctx.clip();
    (o.ghost || []).forEach(g => { ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = g.col || "#9AAFA6"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px(0), py(g.a)); ctx.lineTo(px(7), py(g.a + g.b * 7)); ctx.stroke(); ctx.restore(); });
    if (ln && o.sq !== false) X.forEach((x, i) => {
      const f = ln.a + ln.b * x, e = Y[i] - f, s = Math.abs(py(f) - py(Y[i])); if (s < 0.5) return;
      const left = x >= 4, sx = left ? px(x) - s : px(x), sy = Math.min(py(f), py(Y[i]));
      ctx.fillStyle = e > 0 ? GREEN : RED; ctx.fillRect(sx, sy, s, s); ctx.strokeStyle = e > 0 ? "rgba(46,158,91,0.6)" : "rgba(217,68,59,0.6)"; ctx.lineWidth = 2; ctx.strokeRect(sx, sy, s, s);
      if (o.sqLabel && s > 44) text(ctx, fmt(e * e), sx + s / 2, sy + s / 2 + 9, Math.min(34, s * 0.3), { align: "center", weight: 900, color: e > 0 ? C.good : C.bad });
    });
    if (ln && o.line !== false) { ctx.strokeStyle = o.lineCol || LINE; ctx.lineWidth = o.lw || 6; ctx.beginPath(); ctx.moveTo(px(0), py(ln.a)); ctx.lineTo(px(7), py(ln.a + ln.b * 7)); ctx.stroke(); }
    if (ln && o.err !== false) X.forEach((x, i) => { const f = ln.a + ln.b * x, e = Y[i] - f; ctx.strokeStyle = e >= 0 ? C.good : C.bad; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px(x), py(f)); ctx.lineTo(px(x), py(Y[i])); ctx.stroke(); });
    ctx.restore();
    X.forEach((x, i) => { const hl = o.hl === i; ctx.beginPath(); ctx.arc(px(x), py(Y[i]), (G.r || 11) + (hl ? 4 : 0), 0, Math.PI * 2); ctx.fillStyle = hl ? C.bad : C.kiko; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke(); if (o.values) text(ctx, String(Y[i]), px(x) + (x >= 4 ? 18 : -18), py(Y[i]) - 14, fs, { align: x >= 4 ? "left" : "right", weight: 900 }); });
    return { px, py };
  }
  const PG = { x: 250, y: 250, w: 750, h: 470 };
  const eqStr = ln => "y = " + fmt(ln.a) + (ln.b < -0.05 ? " − " : " + ") + fmt(Math.abs(ln.b)) + "x";

  // panel kanan
  function panelSSE(ctx, d, ln, o = {}) {
    const Y = DATA[d], best = reg(Y), s = sse(Y, ln.a, ln.b), sb = sse(Y, best.a, best.b);
    card(ctx, 1110, 236, 680, 150, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, "garis sekarang", 1140, 280, 22, { weight: 900, color: C.ink2 }); text(ctx, eqStr(ln), 1450, 352, 52, { align: "center", weight: 900, color: C.accentDark });
    card(ctx, 1110, 404, 680, 230, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, "jumlah kuadrat error", 1140, 448, 22, { weight: 900, color: C.ink2 });
    const near = s - sb < 0.05; text(ctx, fmt(s), 1450, 545, 96, { align: "center", weight: 900, color: near ? C.good : C.ink });
    if (near) text(ctx, "paling kecil ✓", 1450, 600, 26, { align: "center", weight: 900, color: C.good });
    else text(ctx, "garis terbaik: " + fmt(sb), 1450, 600, 24, { align: "center", weight: 800, color: C.ink2 });
    if (o.bar) { const max = o.max || Math.max(s, 50); card(ctx, 1110, 652, 680, 100, { fill: C.bg2, r: 16 }); rr(ctx, 1140, 690, 620 * clamp(s / max, 0.01, 1), 32, 10); ctx.fillStyle = near ? C.good : C.accent; ctx.fill(); }
  }
  function panelKurva(ctx, d, ln) {
    const Y = DATA[d], best = reg(Y), dom = d === "acak" ? [-2.6, 2.6] : [-0.6, 5.2], f = bb => sse(Y, best.my - bb * 3.5, bb), s = sse(Y, ln.a, ln.b);
    const ymax = Math.max(f(dom[0]), f(dom[1])) * 1.05, G = { x: 1170, y: 400, w: 580, h: 300 };
    card(ctx, 1110, 236, 680, 540, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, "jumlah kuadrat error", 1140, 280, 22, { weight: 900, color: C.ink2 }); text(ctx, fmt(s), 1760, 290, 60, { align: "right", weight: 900, color: Math.abs(s - f(best.b)) < 0.05 ? C.good : C.ink });
    text(ctx, eqStr(ln), 1140, 330, 30, { weight: 900, color: C.accentDark });
    const gx = bb => G.x + (bb - dom[0]) / (dom[1] - dom[0]) * G.w, gy = v => G.y + G.h - v / ymax * G.h;
    ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(G.x, G.y); ctx.lineTo(G.x, G.y + G.h); ctx.lineTo(G.x + G.w, G.y + G.h); ctx.stroke();
    ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 4; ctx.beginPath(); for (let k = 0; k <= 60; k++) { const bb = lerp(dom[0], dom[1], k / 60); k ? ctx.lineTo(gx(bb), gy(f(bb))) : ctx.moveTo(gx(bb), gy(f(bb))); } ctx.stroke();
    const tick = d === "acak" ? [-2, -1, 0, 1, 2] : [0, 1, 2, 3, 4, 5]; tick.forEach(v => text(ctx, fmt(v), gx(v), G.y + G.h + 28, 20, { align: "center", weight: 700, color: C.ink2 }));
    text(ctx, "kemiringan b →", G.x + G.w, G.y + G.h + 58, 20, { align: "right", weight: 800, color: C.ink2 });
    ctx.setLineDash([8, 8]); ctx.strokeStyle = C.good; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx(best.b), G.y); ctx.lineTo(gx(best.b), G.y + G.h); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, "terkecil", gx(best.b) + 8, G.y + 20, 20, { weight: 900, color: C.good });
    ctx.beginPath(); ctx.arc(gx(ln.b), gy(s), 13, 0, Math.PI * 2); ctx.fillStyle = C.accent; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke();
  }
  function panelTabel(ctx, d, ln, n) {
    const Y = DATA[d], x0 = 1110, y0 = 236, cw = [110, 120, 150, 150, 150], rh = 54, W = 680;
    card(ctx, x0, y0, W, rh * 8, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); ctx.fillStyle = C.bg2; rr(ctx, x0, y0, W, rh, 14); ctx.fill(); ctx.fillRect(x0, y0 + rh / 2, W, rh / 2);
    const cx = i => x0 + cw.slice(0, i).reduce((s, v) => s + v, 0) + cw[i] / 2;
    ["bulan", UNIT[d], "garis", "error", "kuadrat"].forEach((h, i) => text(ctx, h, cx(i), y0 + 36, 22, { align: "center", weight: 900, color: C.ink2 }));
    let tot = 0;
    X.forEach((x, r) => { if (r >= n) return; const f = ln.a + ln.b * x, e = Y[r] - f, ry = y0 + rh * (r + 1); tot += e * e;
      [x, Y[r], fmt(f), (e > 0.05 ? "+" : "") + fmt(e), fmt(e * e)].forEach((v, i) => text(ctx, String(v), cx(i), ry + 37, 26, { align: "center", weight: 900, color: i === 3 ? (e > 0.05 ? C.good : e < -0.05 ? C.bad : C.ink) : i === 4 ? C.accentDark : C.ink })); });
    const ry = y0 + rh * 7; ctx.fillStyle = "#FFF3D6"; rr(ctx, x0 + 3, ry, W - 6, rh - 3, 12); ctx.fill();
    if (n >= 6) { text(ctx, "jumlah", x0 + 30, ry + 37, 26, { weight: 900, color: C.accentDark }); text(ctx, fmt(tot), cx(4), ry + 37, 30, { align: "center", weight: 900, color: C.good }); }
  }
  const heading = (ctx, s, y = 205) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 900, fit: 1600 });
  const banner = (ctx, s, y, w = 1400, opt = {}) => { card(ctx, 960 - w / 2, y, w, 66, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 3, r: 16 }); text(ctx, s, 960, y + 44, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 40 }); };
  function thinking(ctx, x, y, l, dur) {
    const frac = clamp(l / Math.max(1, dur), 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    text(ctx, "?", x, y + 14, 40, { align: "center", weight: 900, color: C.accentDark });
  }
  const VQ = {
    1: ["VARIASI 1 · DATA MENYEBAR", "sebar", "Arahnya tetap naik, tetapi titiknya lebih menyebar. Bagaimana garis terbaik dan jumlah kuadrat error-nya?"],
    2: ["VARIASI 2 · SATU PENCILAN", "pencilan", "Bulan 6 melonjak dari 35 menjadi 56. Apa yang terjadi pada garis terbaik?"],
    3: ["VARIASI 3 · DATA TANPA POLA", "acak", "Angkanya naik turun tanpa arah. Garis terbaiknya seperti apa?"]
  };

  Object.assign(K.SCENES, {
    k25_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 240, 235, 30, { weight: 900, color: C.accentDark });
      ["mengukur kecocokan garis", "memakai jumlah kuadrat error", "menebak garis untuk data yang berbeda"].forEach((s, i) => {
        const u = ease((l - 0.5 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 240, 280 + i * 110, 760, 88, { fill: C.bg2, r: 16 }); text(ctx, "✓", 280, 338 + i * 110, 36, { weight: 900, color: C.good }); text(ctx, s, 330, 336 + i * 110, 30, { weight: 800, fit: 650 }); ctx.globalAlpha = 1;
      });
      const u = ease((l - 1) / 3), ln = { a: lerp(27.5, 17, u), b: lerp(0, 3, u) };
      plot(ctx, { x: 1170, y: 300, w: 480, h: 360, fs: 18, r: 9 }, "rapat", ln, {});
      text(ctx, "jumlah kuadrat error: " + fmt(sse(DATA.rapat, ln.a, ln.b)), 1410, 300 + 360 + 80, 24, { align: "center", weight: 900, color: C.accentDark });
    },
    k25_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 620, 400, { fill: C.bg2, r: 22 });
      text(ctx, "F12.3", 570, 390, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Analisis Data untuk Prediksi", 570, 470, 38, 540, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "kelas XII", 570, 640, 26, { align: "center", weight: 700, color: C.ink2 });
      [["garis tren: y = a + bx", C.kiko], ["error = data − garis", C.good], ["regresi linear", C.accentDark]].forEach(([s, col], i) => {
        const u = ease((l - 1 - i * 0.6) / 0.4); ctx.globalAlpha = Math.max(0.15, u);
        card(ctx, 1000, 300 + i * 110, 600, 84, { fill: "#fff", stroke: col, lw: 4, r: 42 }); text(ctx, s, 1300, 354 + i * 110, 32, { align: "center", weight: 900, color: col }); ctx.globalAlpha = 1;
      });
      kiko(ctx, 1680, 760, 90, 0, { wave: l });
    },
    k25_plot(ctx, b, l) {
      const d = b.data, ln = lineAt(b, l);
      card(ctx, 120, 150, 1680, 670);
      text(ctx, NAMA[d], 160, 205, 28, { weight: 900, color: C.kikoDark });
      const showLine = shown(b, l, "line"), showErr = shown(b, l, "err"), showSq = shown(b, l, "sq");
      plot(ctx, PG, d, ln, { line: showLine, err: showErr, sq: showSq, values: true, sqLabel: d === "pencilan", hl: d === "pencilan" ? 5 : null });
      if (b.panel === "kurva") panelKurva(ctx, d, ln);
      else if (b.panel === "tabel") { const n = clamp(Math.floor((l - lead(b) - 1.0) / 0.7) + 1, 0, 6); panelTabel(ctx, d, ln, n); }
      else panelSSE(ctx, d, ln, { bar: true, max: d === "pencilan" ? 445 : 70 });
    },
    k25_tanya(ctx, b, l) {
      const v = b.v, [hd, d, q] = VQ[v]; card(ctx, 120, 150, 1680, 670); heading(ctx, hd);
      const P = plot(ctx, PG, d, null, { values: true, hl: v === 2 ? 5 : null });
      if (v === 2) { const px = P.px(6), py = P.py(35); ctx.beginPath(); ctx.arc(px, py, 11, 0, Math.PI * 2); ctx.strokeStyle = C.muted; ctx.lineWidth = 3; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]); text(ctx, "tadi 35", px + 20, py + 30, 20, { weight: 800, color: C.muted }); }
      card(ctx, 1110, 236, 680, 560, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 });
      para(ctx, q, 1145, 300, 32, 610, { weight: 900, lh: 1.3 });
      if (b.pilih) { b.pilih.forEach((s, i) => { card(ctx, 1145, 530 + i * 76, 610, 62, { fill: "#fff", stroke: C.kiko, lw: 3, r: 31 }); text(ctx, "ABC"[i] + ". " + s, 1175, 571 + i * 76, 26, { weight: 900, color: C.kikoDark, fit: 560 }); }); thinking(ctx, 1730, 215, l, b.dur); }
    },
    k25_tebak(ctx, b, l) { K.SCENES.k25_tanya(ctx, b, l); },
    k25_banding(ctx, b, l) {
      const v = b.v; card(ctx, 120, 150, 1680, 670);
      if (v === 1) {
        heading(ctx, "GARIS TERBAIK SAMA, ERROR BERBEDA");
        [["rapat", 230], ["sebar", 1010]].forEach(([d, x], i) => { const ln = { a: 17, b: 3 }; plot(ctx, { x, y: 290, w: 600, h: 380, fs: 18, r: 10 }, d, ln, {});
          text(ctx, (i ? "menyebar" : "rapat") + ": jumlah kuadrat error " + fmt(sse(DATA[d], 17, 3)), x + 300, 270, 26, { align: "center", weight: 900, color: i ? C.bad : C.good }); });
        if (l > A(b) * 0.3) banner(ctx, "keduanya y = 17 + 3x · makin menyebar, makin kurang meyakinkan", 742, 1400);
      } else if (v === 2) {
        heading(ctx, "SATU PENCILAN MENARIK GARIS");
        plot(ctx, { x: 250, y: 300, w: 640, h: 380, fs: 18 }, "pencilan", { a: 10, b: 6 }, { ghost: [{ a: 17, b: 3 }], values: true, hl: 5, sqLabel: true });
        text(ctx, "putus-putus: garis lama 17 + 3x", 570, 252, 22, { align: "center", weight: 800, color: C.ink2 });
        const sq = X.map((x, i) => (DATA.pencilan[i] - 10 - 6 * x) ** 2), n = clamp(Math.floor((l - 0.4) / 0.4) + 1, 0, 6);
        card(ctx, 1040, 236, 750, 470, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "kuadrat error tiap bulan (garis 10 + 6x)", 1070, 282, 24, { weight: 900, color: C.ink2 });
        sq.slice(0, n).forEach((v2, i) => { const y = 310 + i * 58; text(ctx, "bulan " + (i + 1), 1070, y + 34, 24, { weight: 800 }); rr(ctx, 1200, y + 10, Math.max(8, v2 / 100 * 460), 34, 8); ctx.fillStyle = i === 5 ? C.bad : "#9AAFA6"; ctx.fill(); text(ctx, String(v2), 1215 + Math.max(8, v2 / 100 * 460), y + 36, 24, { weight: 900, color: i === 5 ? C.bad : C.ink }); });
        if (n >= 6) text(ctx, "jumlah: 214 · bulan 6 sendiri: 100", 1415, 680, 26, { align: "center", weight: 900, color: C.bad });
        if (l > A(b) * 0.55) banner(ctx, "error dikuadratkan → satu titik yang jauh punya pengaruh besar", 742, 1400);
      } else {
        heading(ctx, "GARIS TERBAIK BELUM TENTU BERGUNA");
        plot(ctx, { x: 250, y: 270, w: 750, h: 390 }, "acak", { a: 28, b: 0 }, { values: true });
        card(ctx, 1110, 236, 680, 470, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 });
        [["garis terbaik", "y = 28", C.accentDark], ["jumlah kuadrat error", "112", C.bad], ["bandingkan data rapat", "4", C.good]].forEach(([s, v2, col], i) => {
          const u = ease((l - 0.5 - i * 0.9) / 0.4); ctx.globalAlpha = Math.max(0, u); text(ctx, s, 1140, 300 + i * 140, 24, { weight: 900, color: C.ink2 }); text(ctx, v2, 1140, 360 + i * 140, 52, { weight: 900, color: col }); ctx.globalAlpha = 1; });
        if (l > A(b) * 0.55) banner(ctx, "data tanpa pola → garis mendatar, prediksinya tidak meyakinkan", 742, 1400);
      }
    },
    k25_latihan(ctx, b, l) {
      const a = A(b), t = [a * 0.1, a * 0.3, a * 0.55, a * 0.75, a * 0.85];
      const ga = l < t[1] ? 0 : lerp(0, 17, ease((l - t[1]) / (t[2] - t[1] - 0.3))), gb = l < t[2] ? 0 : lerp(0, 3, ease((l - t[2]) / (t[3] - t[2] - 0.3)));
      const done = l >= t[4];
      const pRow = { custom: (ctx, x, y, w) => {
        ctx.save(); plot(ctx, { x: x + 34, y: y + 14, w: w - 50, h: 130, fs: 10, r: 5 }, "rapat", { a: ga, b: gb }, { frame: false, err: false }); ctx.restore();
        const sl = (lab, v, max, yy) => { text(ctx, lab, x, yy + 5, 12, { weight: 800 }); ctx.fillStyle = "#D7E2DC"; rr(ctx, x + 80, yy - 3, w - 140, 8, 4); ctx.fill(); const kx = x + 80 + (w - 140) * clamp(v / max, 0, 1); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(kx, yy + 1, 9, 0, Math.PI * 2); ctx.fill(); text(ctx, fmt(v), x + w, yy + 5, 12, { align: "right", weight: 900 }); };
        sl("a (awal)", ga, 60, y + 200); sl("b (miring)", gb, 6, y + 230);
        ctx.fillStyle = C.bg2; rr(ctx, x, y + 250, w, 34, 8); ctx.fill(); text(ctx, "jumlah kuadrat error", x + 10, y + 272, 12, { weight: 800 }); text(ctx, fmt(sse(DATA.rapat, ga, gb)), x + w - 10, y + 273, 14, { align: "right", weight: 900, color: C.accentDark });
        return y + 292; } };
      K.halaman(ctx, 260, 175, 1.05, { url: "belajar-informatika.vercel.app/f123", judul: "Penggeser garis tren, kalkulator prediksi, detektif prediksi",
        rows: [{ tabs: ["1 Penggeser garis tren", "2 Kalkulator prediksi", "3 Detektif prediksi"], on: -1 }, pRow, { buttons: ["Periksa garisku"], cols: 1, on: -1 },
          done ? { note: "Tepat. Jumlah kuadrat error-mu 4. Garis regresi: y = 17 + 3x." } : { note: " " }],
        taps: [[0, 0, t[0]], [2, 0, t[4]]] }, l, { h: 575 });
      const n = l < t[0] ? 0 : l < t[1] ? 1 : l < t[4] ? 2 : 3;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN F12.3", ["Klik 1 Penggeser garis tren.", "Geser a dan b, lihat perseginya mengecil.", "Tekan Periksa garisku."], n);
      card(ctx, 840, 540, 880, 250, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 585, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Di kertas berpetak, gambar data enam bulan, rentangkan benang lurus, lalu hitung jumlah kuadrat error untuk dua posisi benang.", 870, 630, 28, 820, { weight: 700, lh: 1.3 });
    }
  });

  // ---------- adegan Short (area 40–1040 × 20–810; crop [40, 20, 1000, 790]) ----------
  Object.assign(K.SCENES, {
    k25s_plot(ctx, b, l) {
      const d = b.data, ln = lineAt(b, l), Y = DATA[d], s = sse(Y, ln.a, ln.b), best = reg(Y), sb = sse(Y, best.a, best.b);
      text(ctx, NAMA[d], 60, 62, 32, { weight: 900, color: C.kikoDark, fit: 960 });
      plot(ctx, { x: 150, y: 130, w: 850, h: 470, fs: 24, r: 13 }, d, ln, { values: false, sqLabel: d === "pencilan", hl: d === "pencilan" ? 5 : null, err: shown(b, l, "err"), sq: shown(b, l, "sq") });
      card(ctx, 60, 690, 960, 116, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 20 });
      text(ctx, eqStr(ln), 90, 764, 44, { weight: 900, color: C.accentDark });
      text(ctx, "jumlah", 700, 742, 26, { align: "right", weight: 800, color: C.ink2 }); text(ctx, "kuadrat error", 700, 776, 26, { align: "right", weight: 800, color: C.ink2 });
      text(ctx, fmt(s), 1000, 782, 64, { align: "right", weight: 900, color: s - sb < 0.05 ? C.good : C.ink });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
