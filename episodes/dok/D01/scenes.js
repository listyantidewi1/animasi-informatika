/* D01 "Apakah AI Benar-benar Berpikir?" — adegan per bab (d01_b0 … d01_b9). Memakai K.dok (sinema.js).
   Setiap adegan bercabang menurut id beat; waktu langkah memakai at(b, "potongan narasi") supaya gambar mengikuti suara. */
(function (global) {
  const K = global.Kiko, H = K.helpers, D = K.dok, { P, W, HH, clamp, lerp, sm, eio, eout, rng, A, at, pr, fade, bg, glow, hexA, txt, cam, path, pill, panel, bip, neuron } = D;

  // ---------- pembantu adegan ----------
  function phone(ctx, cx, cy, h, draw, opt = {}) {
    const w = h * 0.49, x = cx - w / 2, y = cy - h / 2;
    glow(ctx, cx, cy, h * 0.75, opt.glow || P.blue, 0.22);
    ctx.fillStyle = "#05070F"; H.rr(ctx, x - h * 0.025, y - h * 0.025, w + h * 0.05, h + h * 0.05, h * 0.08); ctx.fill();
    ctx.strokeStyle = "#2A3560"; ctx.lineWidth = Math.max(2, h * 0.006); ctx.stroke();
    ctx.save(); H.rr(ctx, x, y, w, h, h * 0.06); ctx.clip();
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, "#111A3A"); g.addColorStop(1, "#0B1129"); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.translate(x, y); ctx.scale(w / 400, w / 400); draw && draw(ctx, 400, h * 400 / w); ctx.restore();
    ctx.fillStyle = "#05070F"; H.rr(ctx, cx - w * 0.14, y + h * 0.012, w * 0.28, h * 0.022, h * 0.011); ctx.fill();
  }
  function bubble(ctx, s, x, y, maxW, me, size = 22, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; const lines = H.wrap(ctx, s, size, 600, maxW - 36); ctx.font = `600 ${size}px ${K.FONT}`;
    const w = Math.min(maxW, Math.max(...lines.map(t => ctx.measureText(t).width)) + 36), h = lines.length * size * 1.35 + 26, bx = me ? x - w : x;
    ctx.fillStyle = me ? "#3B5BDB" : "#1E2A55"; H.rr(ctx, bx, y, w, h, 18); ctx.fill();
    lines.forEach((t, i) => txt(ctx, t, bx + 18, y + 16 + size + i * size * 1.35 - 4, size, { weight: 600, color: P.ink }));
    ctx.restore(); return h;
  }
  const typed = (s, u) => s.slice(0, Math.round(clamp(u) * s.length));
  function counter(ctx, val, x, y, size, opt = {}) { txt(ctx, Math.round(val).toLocaleString("id-ID"), x, y, size, { align: "center", weight: 900, color: opt.color || P.amber, ...opt }); }
  function head(ctx, cx, cy, s, opt = {}) {   // kepala manusia tampak samping (siluet), menghadap kanan
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 400, s / 400);
    ctx.fillStyle = opt.fill || "#1B2B5E"; ctx.beginPath();
    ctx.moveTo(-40, 190); ctx.lineTo(-40, 120); ctx.bezierCurveTo(-140, 60, -150, -110, -40, -160); ctx.bezierCurveTo(60, -200, 160, -140, 150, -40);
    ctx.lineTo(185, 25); ctx.lineTo(150, 40); ctx.lineTo(160, 90); ctx.bezierCurveTo(150, 120, 110, 120, 80, 118); ctx.lineTo(80, 190); ctx.closePath(); ctx.fill();
    if (opt.stroke) { ctx.strokeStyle = opt.stroke; ctx.lineWidth = 6; ctx.stroke(); }
    ctx.restore();
  }
  function brain(ctx, cx, cy, s, a = 1, col = P.pink) {   // otak bergaya: lobus bulat dengan alur
    ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.scale(s / 200, s / 200);
    glow(ctx, 0, 0, 180, col, 0.4);
    ctx.fillStyle = hexA(col, 0.9); ctx.beginPath(); ctx.ellipse(0, 0, 100, 74, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 5; ctx.lineCap = "round";
    [[-70, -20, -30, -50, 0, -20], [-60, 20, -20, 0, 20, 30], [10, -50, 40, -20, 70, -40], [20, 10, 50, 40, 80, 10], [-20, 45, 10, 60, 40, 50]].forEach(([a1, b1, c1, d1, e1, f1]) => { ctx.beginPath(); ctx.moveTo(a1, b1); ctx.quadraticCurveTo(c1, d1, e1, f1); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(0, -72); ctx.quadraticCurveTo(-8, 0, 0, 72); ctx.stroke();
    ctx.restore();
  }
  // jaringan neuron acak (seed tetap) untuk "kota cahaya" di otak
  const NET = (() => { const r = rng(42), pts = []; for (let i = 0; i < 160; i++) pts.push([r() * 2400 - 1200, r() * 1500 - 750, 6 + r() * 10, r() * 6.28]); const ed = [];
    pts.forEach((p, i) => { const near = pts.map((q, j) => [Math.hypot(p[0] - q[0], p[1] - q[1]), j]).filter(d => d[1] !== i).sort((a, b) => a[0] - b[0]).slice(0, 3); near.forEach(([d, j]) => { if (j > i && d < 260) ed.push([i, j]); }); }); return { pts, ed }; })();
  function netCity(ctx, t, a = 1, lit = 1) {
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = hexA(P.teal, 0.28); ctx.lineWidth = 2;
    NET.ed.forEach(([i, j]) => { const p = NET.pts[i], q = NET.pts[j]; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo((p[0] + q[0]) / 2 + 30, (p[1] + q[1]) / 2 - 30, q[0], q[1]); ctx.stroke(); });
    NET.ed.forEach(([i, j], k) => { const u = (t * 0.6 + k * 0.137) % 1, p = NET.pts[i], q = NET.pts[j]; if (k % 3) return; const x = lerp(p[0], q[0], u), y = lerp(p[1], q[1], u); glow(ctx, x, y, 14, P.amber, 0.8 * lit); });
    NET.pts.forEach(([x, y, r, ph]) => { const f = lit * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2 + ph))); glow(ctx, x, y, r * 3.2, P.teal, 0.5 * f); ctx.fillStyle = "#DFFBF7"; ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, 6.283); ctx.fill(); });
    ctx.restore();
  }
  function bulb(ctx, x, y, s, on) {
    glow(ctx, x, y - s * 0.1, s * 1.6, P.amber, 0.55 * on);
    ctx.fillStyle = on > 0.5 ? "#FFE3A3" : "#3A4672"; ctx.beginPath(); ctx.arc(x, y - s * 0.15, s * 0.42, 0, 6.283); ctx.fill();
    ctx.fillStyle = "#8A97BF"; H.rr(ctx, x - s * 0.18, y + s * 0.2, s * 0.36, s * 0.32, s * 0.06); ctx.fill();
  }
  function year(ctx, s, x, y, u) { if (u <= 0) return; ctx.save(); ctx.globalAlpha = sm(u); txt(ctx, s, x, y, 150, { align: "center", weight: 900, color: hexA(P.amber, 0.95) }); ctx.restore(); }
  function card(ctx, x, y, w, h, title, sub, u, col = P.teal) {
    if (u <= 0) return; ctx.save(); ctx.globalAlpha = sm(u); ctx.translate(0, (1 - eout(u)) * 30);
    panel(ctx, x, y, w, h, { stroke: hexA(col, 0.7), lw: 3 }); txt(ctx, title, x + w / 2, y + h / 2 + (sub ? -4 : 12), 34, { align: "center", color: col, fit: w - 30 });
    if (sub) txt(ctx, sub, x + w / 2, y + h / 2 + 40, 24, { align: "center", weight: 700, color: P.ink2, fit: w - 30 }); ctx.restore();
  }

  // ---------- adegan ----------
  Object.assign(K.SCENES, {
    // ===== 0. Pembuka =====
    d01_b0(ctx, b, l, t, TL) {
      bg(ctx, t);
      if (b.id === "b0_1" || b.id === "b0_2") {
        const Q = "Kenapa langit berwarna biru?", ANS = "Cahaya matahari tersebar oleh udara. Warna biru paling banyak tersebar, jadi langit tampak biru.";
        const c = b.id === "b0_1" ? { ty: at(b, "Kamu mengetik") , send: at(b, "lalu menekan"), ans: at(b, "Dalam dua detik"), conf: at(b, "Kalimatnya") } : { ty: -9, send: -9, ans: -9, conf: -9 };
        if (b.id === "b0_2") { const uh = fade(l, at(b, "Rasanya"), 1.4); if (uh > 0) { ctx.save(); ctx.globalAlpha = 0.85 * sm(uh); glow(ctx, 1010, 470, 520, P.violet, 0.35); head(ctx, 1000, 560, 980, { fill: "rgba(143,124,255,0.22)" }); ctx.restore(); } }
        phone(ctx, 960, 540, 820, (c2, w, h) => {
          txt(c2, "Asisten AI", w / 2, 62, 24, { align: "center", weight: 800, color: P.ink2 });
          const q = b.id === "b0_1" ? typed(Q, (l - c.ty) / 1.8) : Q, sent = l > c.send || b.id === "b0_2";
          if (!sent) { panel(c2, 20, h - 90, w - 40, 56, { fill: "#1A2550", r: 28 }); txt(c2, q + ((l * 2) % 1 < 0.5 ? "|" : ""), 40, h - 52, 24, { weight: 600, fit: w - 80 }); }
          else { const h1 = bubble(c2, Q, w - 20, 110, 320, true, 26); const y2 = 110 + h1 + 18;
            if (b.id === "b0_2" || l > c.ans) bubble(c2, typed(ANS, b.id === "b0_2" ? 1 : (l - c.ans) / 1.6), 20, y2, 350, false, 25);
            else { [0, 1, 2].forEach(i => { c2.fillStyle = hexA(P.ink2, 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(l * 8 - i))); c2.beginPath(); c2.arc(44 + i * 18, y2 + 26, 6, 0, 6.283); c2.fill(); }); } }
        });
        if (b.id === "b0_1") { const u = fade(l, c.conf, 0.6); if (u > 0) { ctx.save(); ctx.globalAlpha = u; ["rapi", "masuk akal", "meyakinkan"].forEach((s, i) => { const tt = at(b, ["rapi", "masuk akal", "meyakinkan"][i]); if (l > tt) pill(ctx, "✓ " + s, 1420, 380 + i * 110, { size: 30, color: P.green }); }); ctx.restore(); }
          bip(ctx, 1240, 900 - 60 * sm(fade(l, A(b) * 0.55, 0.6)), 150, { mood: "wow", t, look: [-0.8, -0.3] }); }
        if (b.id === "b0_2") {
          const items = [["menulis puisi", "📝", -1, -1], ["merangkum buku", "📚", 1, -1], ["menjelaskan rumus", "a² + b² = c²", -1, 1], ["bercanda", "😄", 1, 1]];
          items.forEach(([k, ic, sx, sy], i) => { const u = fade(l, at(b, k), 0.6); if (u <= 0) return; const a = t * 0.15 + i * 1.57, x = 960 + sx * (470 + 20 * Math.sin(a)), y = 540 + sy * (230 + 15 * Math.cos(a));
            ctx.save(); ctx.globalAlpha = sm(u); panel(ctx, x - 170, y - 70, 340, 140, { stroke: hexA(P.violet, 0.8), lw: 3 }); txt(ctx, ic, x, y - 2, ic.length > 3 ? 32 : 52, { align: "center" }); txt(ctx, k, x, y + 50, 26, { align: "center", color: P.ink2, weight: 700 }); ctx.restore(); });
        }
        return;
      }
      if (b.id === "b0_3") {
        // tiga panggung berurutan, masing-masing kamera mundur, disambung pudar silang: kamar → kota → Bumi, lalu judul
        const t0 = at(b, "Apakah AI"), tB = t0 + 1.7, tC = t0 + 3.6, X = 0.6;
        const aA = 1 - fade(l, tB, X), aB = Math.min(fade(l, tB, X), 1 - fade(l, tC, X)), aC = fade(l, tC, X);
        if (aA > 0) { ctx.save(); ctx.globalAlpha = aA; const z = Math.exp(lerp(Math.log(2.6), Math.log(0.9), eio((l - t0 + 0.5) / 2.4)));
          cam(ctx, { x: 960, y: 560, z }, () => {
            ctx.fillStyle = "#151F48"; ctx.fillRect(-400, -300, 2720, 1700); ctx.fillStyle = "#0B1233"; H.rr(ctx, 1180, 170, 520, 420, 14); ctx.fill();
            for (let k = 0; k < 40; k++) { const r = rng(k + 9); ctx.fillStyle = hexA("#FFFFFF", 0.6); ctx.fillRect(1200 + r() * 480, 190 + r() * 380, 3, 3); }
            ctx.strokeStyle = "#2E3F7E"; ctx.lineWidth = 14; ctx.strokeRect(1180, 170, 520, 420); ctx.beginPath(); ctx.moveTo(1440, 170); ctx.lineTo(1440, 590); ctx.stroke();
            ctx.fillStyle = "#24336B"; ctx.fillRect(-400, 760, 2720, 700); ctx.fillStyle = "#33468A"; ctx.fillRect(420, 720, 1080, 40);
            glow(ctx, 520, 470, 260, P.amber, 0.45); ctx.fillStyle = "#3A4A8A"; ctx.fillRect(505, 480, 30, 240); ctx.fillStyle = "#FFD58A"; ctx.beginPath(); ctx.moveTo(450, 480); ctx.lineTo(590, 480); ctx.lineTo(560, 410); ctx.lineTo(480, 410); ctx.closePath(); ctx.fill();
            phone(ctx, 960, 560, 300, (c2, w, h) => txt(c2, "?", w / 2, h / 2 + 70, 220, { align: "center", color: P.amber, weight: 900 }));
            bip(ctx, 1280, 690, 110, { mood: "think", t });
          }); ctx.restore(); }
        if (aB > 0) { ctx.save(); ctx.globalAlpha = aB; const z = Math.exp(lerp(Math.log(2.2), Math.log(0.85), eio((l - tB + 0.3) / 2.2)));
          cam(ctx, { x: 960, y: 620, z }, () => {
            for (let i = -14; i < 30; i++) { const hh = 260 + ((i * 7919) % 11) * 55, x = i * 120 - 400, w = 104; ctx.fillStyle = i % 2 ? "#0E1A44" : "#122052"; ctx.fillRect(x, 900 - hh, w, hh + 400);
              for (let k = 0; k < hh / 34 - 1; k++) for (let m = 0; m < 3; m++) { const lit = ((i * 13 + k * 7 + m * 3) % 9) > 4, me = i === 8 && k === 3 && m === 1; ctx.fillStyle = me ? P.amber : lit ? hexA(P.amber, 0.55) : "#1B2A60"; ctx.fillRect(x + 14 + m * 30, 900 - hh + 18 + k * 34, 18, 20); if (me) glow(ctx, x + 23 + m * 30, 900 - hh + 28 + k * 34, 50, P.amber, 0.8); } }
            ctx.fillStyle = "#070B22"; ctx.fillRect(-1000, 900, 4000, 600);
          }); ctx.restore(); }
        if (aC > 0) { ctx.save(); ctx.globalAlpha = aC; const z = Math.exp(lerp(Math.log(2.4), Math.log(1), eio((l - tC + 0.3) / 2.6)));
          cam(ctx, { x: 960, y: 560, z }, () => {
            glow(ctx, 960, 760, 760, P.blue, 0.35); const g = ctx.createRadialGradient(820, 600, 60, 960, 760, 520); g.addColorStop(0, "#2E66C8"); g.addColorStop(1, "#0E2458");
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(960, 760, 500, 0, 6.283); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(960, 760, 500, 0, 6.283); ctx.clip();
            ctx.fillStyle = "#2F8A6A"; [[760, 560, 170, 90, 0.4], [1110, 640, 210, 120, -0.3], [900, 900, 160, 80, 0.2], [1220, 930, 120, 70, 0.6]].forEach(([x, y, a, c, r]) => { ctx.beginPath(); ctx.ellipse(x, y, a, c, r, 0, 6.283); ctx.fill(); });
            ctx.fillStyle = "rgba(4,8,30,0.55)"; ctx.beginPath(); ctx.arc(1260, 900, 620, 0, 6.283); ctx.fill();
            const r = rng(21); for (let k = 0; k < 120; k++) { const x = 1000 + r() * 460, y = 640 + r() * 420; glow(ctx, x, y, 10, P.amber, 0.9); }
            ctx.restore();
          }); ctx.restore(); }
        const u = fade(l, at(b, "berpura-pura") + 0.4, 1.0);
        if (u > 0) { ctx.save(); ctx.globalAlpha = sm(u); txt(ctx, "Apakah AI", 960, 200, 92, { align: "center", weight: 900 }); txt(ctx, "Benar-benar Berpikir?", 960, 310, 92, { align: "center", weight: 900, color: P.amber }); ctx.restore(); }
        return;
      }
      // b0_4: kepala manusia, otak menyala, kamera mendekat, otak larut menjadi jaringan neuron
      const u = fade(l, 0.2, 1.2), tb = at(b, "otak di dalam"), zz = eio((l - tb) / 3.2), z = Math.exp(lerp(0, Math.log(2.4), zz));
      cam(ctx, { x: lerp(960, 1000, zz), y: lerp(540, 470, zz), z }, () => {
        ctx.save(); ctx.globalAlpha = sm(u) * (1 - 0.6 * zz); head(ctx, 960, 560, 760, { fill: "#16275A", stroke: hexA(P.violet, 0.6) }); ctx.restore();
        brain(ctx, 1000, 470, 230 * sm(fade(l, tb, 0.8)), sm(fade(l, tb, 0.8)) * (1 - fade(l, tb + 2.6, 1.2)));
      });
      const un = fade(l, tb + 2.4, 1.4); if (un > 0) { ctx.save(); ctx.globalAlpha = un; cam(ctx, { x: 0, y: 0, z: 2.2 }, () => netCity(ctx, t, 1, 1)); ctx.restore(); }
      if (un < 1) bip(ctx, 1540, 820, 150, { mood: "think", t });
    },

    // ===== 1. Mesin berpikir yang asli =====
    d01_b1(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.3, top: "#090C24", bot: "#1A1440" });
      if (b.id === "b1_1") {
        const z = Math.exp(lerp(Math.log(2.2), Math.log(0.55), eio(l / (A(b) + 2))));
        cam(ctx, { x: 0, y: 0, z }, () => netCity(ctx, t, 1, 1));
        const c1 = at(b, "delapan puluh enam"), c2 = at(b, "Kalau kamu menghitung");
        const v = 86e9 * eout((l - c1) / 2.5); if (l > c1) { panel(ctx, 560, 70, 800, 150, { fill: "rgba(10,16,48,0.8)" }); counter(ctx, v, 960, 160, 84); txt(ctx, "neuron", 960, 205, 28, { align: "center", color: P.ink2, weight: 700 }); }
        const u = fade(l, c2, 0.7); if (u > 0) { ctx.save(); ctx.globalAlpha = sm(u); panel(ctx, 1300, 760, 520, 200, { fill: "rgba(10,16,48,0.85)", stroke: hexA(P.amber, 0.6) }); txt(ctx, "1 neuron per detik", 1560, 830, 30, { align: "center", color: P.ink2, weight: 700 }); txt(ctx, "> 2.700 tahun", 1560, 905, 58, { align: "center", color: P.amber, weight: 900 }); ctx.restore(); }
        return;
      }
      if (b.id === "b1_2") {
        const cx = 900, cy = 560;
        const tIn = at(b, "Ia menerima"), tW = at(b, "menimbang"), tF = at(b, "apakah ia akan");
        neuron(ctx, cx, cy, 70, { seed: 3, arms: 8, color: P.teal, fire: l > tF ? clamp(1 - (l - tF - 0.6) / 1.5) * 0.9 + 0.2 : 0.15 });
        // sinyal masuk dari kiri, menumpuk di badan sel
        for (let i = 0; i < 6; i++) { const s0 = tIn + i * 0.45, u = clamp((l - s0) / 1.2); if (u <= 0 || u >= 1) continue; const a = Math.PI * (0.7 + i * 0.12); const x = cx + Math.cos(a) * 330 * (1 - u), y = cy + Math.sin(a) * 330 * (1 - u); glow(ctx, x, y, 34, P.amber, 1); }
        // meteran penjumlahan
        const fill = clamp((l - tIn) / Math.max(1, tF - tIn)); panel(ctx, 1240, 300, 90, 420, { fill: "rgba(10,16,48,0.85)" }); ctx.fillStyle = P.amber; H.rr(ctx, 1252, 708 - 396 * fill * 0.95, 66, 396 * fill * 0.95, 14); ctx.fill();
        ctx.strokeStyle = P.pink; ctx.setLineDash([10, 8]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1225, 400); ctx.lineTo(1345, 400); ctx.stroke(); ctx.setLineDash([]);
        txt(ctx, "batas", 1360, 410, 26, { color: P.pink, weight: 800 });
        // akson: sinyal keluar ke kanan
        ctx.strokeStyle = hexA(P.teal, 0.7); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(cx + 70, cy); ctx.bezierCurveTo(cx + 250, cy + 40, 1050, cy + 260, 1550, cy + 240); ctx.stroke();
        if (l > tF) { const u = clamp((l - tF) / 1.4); glow(ctx, lerp(cx + 80, 1550, u), lerp(cy, cy + 240, u * u), 60, P.amber, 1); txt(ctx, "klik!", cx, cy - 150, 56, { align: "center", color: P.amber, weight: 900 }); }
        [["menerima", tIn, 420, 260], ["menimbang", tW, 1285, 260], ["menembak / diam", tF, 1560, 880]].forEach(([s, tt, x, y]) => { const u = fade(l, tt, 0.5); if (u > 0) { ctx.save(); ctx.globalAlpha = u; pill(ctx, s, x, y, { size: 30 }); ctx.restore(); } });
        return;
      }
      if (b.id === "b1_3") {
        const t1 = at(b, "Tetapi miliaran"), z = l < t1 ? 3.2 : Math.exp(lerp(Math.log(3.2), Math.log(0.6), eio((l - t1) / 2.5)));
        cam(ctx, { x: NET.pts[17][0], y: NET.pts[17][1], z }, () => netCity(ctx, t, 1, l < t1 ? 0.15 : 1));
        if (l < t1) { pill(ctx, "1 neuron: tidak bisa berpikir", 960, 860, { size: 34, color: P.ink2 }); }
        [["wajah ibumu", "🙂", 520], ["lagu masa kecil", "🎵", 960], ["dirinya sendiri", "❓", 1400]].forEach(([k, ic, x], i) => { const u = fade(l, at(b, k.split(" ")[0] === "wajah" ? "mengenali" : k.split(" ")[0] === "lagu" ? "mengingat" : "bertanya"), 0.6); if (u <= 0) return;
          ctx.save(); ctx.globalAlpha = sm(u); panel(ctx, x - 180, 760, 360, 190, { fill: "rgba(10,16,48,0.85)", stroke: hexA(P.violet, 0.7), lw: 3 }); txt(ctx, ic, x, 860, 70, { align: "center" }); txt(ctx, k, x, 925, 28, { align: "center", color: P.ink2, weight: 700 }); ctx.restore(); });
        return;
      }
      // b1_4: otak dan bohlam 20 watt
      const u = fade(l, 0.3, 0.8), u2 = fade(l, at(b, "kira-kira"), 0.8);
      brain(ctx, 700, 520, 360 * sm(u), sm(u));
      bulb(ctx, 1260, 560, 230 * sm(u2), u2); if (u2 > 0) { ctx.save(); ctx.globalAlpha = u2; txt(ctx, "≈ 20 watt", 960, 880, 84, { align: "center", color: P.amber, weight: 900 }); txt(ctx, "=", 980, 560, 90, { align: "center", color: P.ink2 }); ctx.restore(); }
    },

    // ===== 2. Neuron tiruan =====
    d01_b2(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.25, top: "#0B1230", bot: "#1F1A3C" });
      if (b.id === "b2_1") {
        year(ctx, "1943", 960, 300, fade(l, 0.2, 0.8));
        const tn = at(b, "Warren"), tq = at(b, "Bagaimana kalau"); const m = pr(l, tq, 2.2);
        [["Warren McCulloch", 620], ["Walter Pitts", 1300]].forEach(([s, x], i) => { const u = fade(l, tn + i * 0.8, 0.5); if (u > 0) { ctx.save(); ctx.globalAlpha = u; pill(ctx, s, x, 420, { size: 34, stroke: hexA(P.amber, 0.6) }); ctx.restore(); } });
        // neuron biologis berubah menjadi lingkaran dan garis
        ctx.save(); ctx.globalAlpha = 1 - m; neuron(ctx, 960, 700, 60, { seed: 9, arms: 7, color: P.teal, fire: 0.3 }); ctx.restore();
        if (m > 0) { ctx.save(); ctx.globalAlpha = m; ctx.strokeStyle = P.ink; ctx.lineWidth = 6; [[-1], [0], [1]].forEach(([k]) => { ctx.beginPath(); ctx.moveTo(700, 700 + k * 110); ctx.lineTo(900, 700); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(1020, 700); ctx.lineTo(1240, 700); ctx.stroke();
          ctx.fillStyle = P.bg1; ctx.beginPath(); ctx.arc(960, 700, 62, 0, 6.283); ctx.fill(); ctx.strokeStyle = P.amber; ctx.stroke(); txt(ctx, "Σ", 960, 724, 64, { align: "center", color: P.amber }); txt(ctx, "neuron dalam matematika", 960, 880, 34, { align: "center", color: P.ink2, weight: 700 }); ctx.restore(); }
        return;
      }
      if (b.id === "b2_2") {
        const X = [1, 0, 1], Wt = [0.6, 0.9, 0.4], tM = at(b, "mengalikan"), tS = at(b, "menjumlahkannya"), tOn = at(b, "ia menyala");
        const ys = [330, 540, 750];
        ys.forEach((y, i) => { const u = fade(l, 0.4 + i * 0.4, 0.5); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u;
          ctx.fillStyle = X[i] ? P.amber : "#3A4672"; ctx.beginPath(); ctx.arc(330, y, 56, 0, 6.283); ctx.fill(); txt(ctx, String(X[i]), 330, y + 22, 60, { align: "center", color: X[i] ? "#3A2600" : P.ink2, weight: 900 });
          ctx.strokeStyle = P.line; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(390, y); ctx.lineTo(900, 540); ctx.stroke();
          // kenop bobot
          const kx = lerp(390, 900, 0.3), ky = lerp(y, 540, 0.3); ctx.fillStyle = "#24336B"; ctx.beginPath(); ctx.arc(kx, ky, 46, 0, 6.283); ctx.fill(); ctx.strokeStyle = P.violet; ctx.lineWidth = 5; ctx.stroke();
          const ang = -2.4 + Wt[i] * 4.8 * pr(l, tM - 0.6, 1); ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx + Math.cos(ang) * 36, ky + Math.sin(ang) * 36); ctx.stroke();
          txt(ctx, "× " + Wt[i].toLocaleString("id-ID"), kx - 66, ky + 10, 30, { align: "right", color: P.violet });
          if (l > tM) { const lx = lerp(390, 900, 0.62), ly = lerp(y, 540, 0.62) - 22; txt(ctx, "= " + (X[i] * Wt[i]).toLocaleString("id-ID"), lx, ly, 30, { align: "center", color: P.ink2, weight: 700 }); }
          ctx.restore(); });
        const sum = l > tS ? 1.0 * pr(l, tS, 1.2) : 0, on = l > tOn ? 1 : 0;
        glow(ctx, 960, 540, 260, P.amber, on * 0.9); ctx.fillStyle = on ? "#FFE3A3" : P.bg1; ctx.beginPath(); ctx.arc(960, 540, 90, 0, 6.283); ctx.fill(); ctx.strokeStyle = P.amber; ctx.lineWidth = 6; ctx.stroke();
        txt(ctx, "Σ = " + sum.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 }), 960, 560, 40, { align: "center", color: on ? "#3A2600" : P.amber });
        panel(ctx, 1240, 420, 520, 240, { fill: "rgba(10,16,48,0.85)" }); txt(ctx, "batas: 0,8", 1500, 490, 34, { align: "center", color: P.pink }); txt(ctx, on ? "1,0 > 0,8 → menyala" : "jumlah ≥ batas?", 1500, 590, 38, { align: "center", color: on ? P.green : P.ink2 });
        return;
      }
      if (b.id === "b2_3") {
        year(ctx, "1958", 360, 250, fade(l, 0.2, 0.6)); const tP = at(b, "Perceptron"), tL = at(b, "Mesin ini bisa"), tS = at(b, "sedikit demi");
        const u = fade(l, tP - 0.6, 0.8); if (u <= 0) return; ctx.save(); ctx.globalAlpha = sm(u);
        // mesin: lemari kabel dengan kisi sel cahaya 12×12
        panel(ctx, 700, 200, 760, 640, { fill: "#141D45", stroke: hexA(P.ink2, 0.4), lw: 4, r: 16 }); txt(ctx, "PERCEPTRON", 1080, 260, 36, { align: "center", color: P.amber, weight: 900 });
        const tries = Math.floor(clamp((l - tL) / 1.6, 0, 6)), shape = tries % 2; // 0 kotak, 1 lingkaran
        for (let r = 0; r < 12; r++) for (let c = 0; c < 12; c++) { const x = 760 + c * 30, y = 300 + r * 30, dx = c - 5.5, dy = r - 5.5;
          const inS = shape ? dx * dx + dy * dy < 20 : Math.abs(dx) < 3.6 && Math.abs(dy) < 3.6; ctx.fillStyle = inS ? P.amber : "#25305E"; ctx.fillRect(x, y, 24, 24); }
        for (let k = 0; k < 9; k++) { ctx.strokeStyle = [P.pink, P.teal, P.violet][k % 3]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1140, 320 + k * 40); ctx.bezierCurveTo(1250, 320 + k * 40, 1230, 700 - k * 20, 1400, 700 - k * 30); ctx.stroke(); }
        const right = tries >= 4; const guess = tries > 0 ? (right ? shape : 1 - shape) : -1;
        if (guess >= 0) { txt(ctx, "tebakan: " + (guess ? "lingkaran" : "kotak"), 1080, 760, 34, { align: "center", color: P.ink2 }); txt(ctx, right ? "✓" : "✕", 1380, 770, 64, { align: "center", color: right ? P.green : P.red, weight: 900 }); }
        // kenop bobot bergeser tiap salah
        for (let k = 0; k < 4; k++) { const x = 1560 + (k % 2) * 140, y = 360 + Math.floor(k / 2) * 180, a = -1.5 + tries * 0.35 * (k % 2 ? 1 : -1) + Math.sin(k) * 0.4; ctx.fillStyle = "#24336B"; ctx.beginPath(); ctx.arc(x, y, 50, 0, 6.283); ctx.fill(); ctx.strokeStyle = P.violet; ctx.lineWidth = 6; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 40, y + Math.sin(a) * 40); ctx.stroke(); }
        if (l > tS) txt(ctx, "bobot digeser sedikit", 1630, 700, 28, { align: "center", color: P.violet });
        ctx.restore(); return;
      }
      // b2_4: aturan dicoret, contoh mengalir, grafik kesalahan turun
      const tR = at(b, "tidak diberi aturan"), tC = at(b, "Ia diberi contoh"), tG = at(b, "digeser sampai");
      const u1 = fade(l, tR - 0.3, 0.6); if (u1 > 0) { ctx.save(); ctx.globalAlpha = u1; panel(ctx, 160, 280, 420, 500, { fill: "#F2E9D8", stroke: false, r: 12 }); txt(ctx, "ATURAN", 370, 350, 40, { align: "center", color: "#5A4630" }); for (let k = 0; k < 7; k++) { ctx.fillStyle = "#C9B998"; ctx.fillRect(210, 400 + k * 50, 320 - (k % 3) * 40, 12); }
        const x = pr(l, tR + 0.6, 0.5); ctx.strokeStyle = P.red; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(180, 300); ctx.lineTo(lerp(180, 560, x), lerp(300, 760, x)); ctx.stroke(); ctx.restore(); }
      for (let k = 0; k < 10; k++) { const s0 = tC + k * 0.35, u = clamp((l - s0) / 2.2); if (u <= 0 || u >= 1) continue; const x = lerp(650, 1080, u), y = 300 + (k % 4) * 120; ctx.save(); ctx.globalAlpha = Math.min(1, (1 - u) * 3); panel(ctx, x, y, 120, 90, { stroke: hexA(P.teal, 0.8), lw: 3 }); txt(ctx, ["🐱", "🐶", "🐱", "🚗", "🐱", "🌳", "🐶", "🐱", "🏠", "🐱"][k], x + 60, y + 62, 46, { align: "center" }); ctx.restore(); }
      panel(ctx, 1150, 260, 640, 520, { fill: "rgba(10,16,48,0.85)" }); txt(ctx, "kesalahan", 1470, 320, 32, { align: "center", color: P.ink2, weight: 700 });
      const gx = 1200, gy = 720, gw = 540, gh = 340, prog = clamp((l - tC) / (A(b) * 0.8));
      ctx.strokeStyle = P.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx, gy - gh); ctx.lineTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke();
      ctx.strokeStyle = P.pink; ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i <= 60 * prog; i++) { const u = i / 60, y = gy - gh * (0.08 + 0.85 * Math.exp(-u * 3.5) + 0.04 * Math.sin(i * 1.7)); i ? ctx.lineTo(gx + gw * u, y) : ctx.moveTo(gx, y); } ctx.stroke();
      if (l > tG) txt(ctx, "makin jarang salah", 1470, 770, 30, { align: "center", color: P.green });
    },

    // ===== 3. Dari satu menjadi miliaran =====
    d01_b3(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.4 });
      const LAY = [4, 7, 7, 5, 2], LX = i => 360 + i * 300, LY = (n, j) => 540 + (j - (n - 1) / 2) * 82;
      function net(ctx, a, act) { ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < LAY.length - 1; i++) for (let j = 0; j < LAY[i]; j++) for (let k = 0; k < LAY[i + 1]; k++) { ctx.strokeStyle = hexA(P.teal, 0.12 + 0.3 * act(i, j, k)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(LX(i), LY(LAY[i], j)); ctx.lineTo(LX(i + 1), LY(LAY[i + 1], k)); ctx.stroke(); }
        LAY.forEach((n, i) => { for (let j = 0; j < n; j++) { const f = act(i, j, -1); glow(ctx, LX(i), LY(n, j), 50, P.teal, 0.5 * f); ctx.fillStyle = f > 0.5 ? "#DFFBF7" : "#2B3A73"; ctx.beginPath(); ctx.arc(LX(i), LY(n, j), 22, 0, 6.283); ctx.fill(); } }); ctx.restore(); }
      if (b.id === "b3_1") {
        const tL = at(b, "Tetapi kalau"), m = pr(l, tL, 1.4);
        if (m < 1) { ctx.save(); ctx.globalAlpha = 1 - m; const r = rng(3); panel(ctx, 560, 200, 800, 640, { fill: "rgba(10,16,48,0.7)" });
          for (let i = 0; i < 40; i++) { const x = 600 + r() * 720, y = 240 + r() * 560, side = y - 240 > (x - 600) * 0.75; ctx.fillStyle = side ? P.pink : P.teal; ctx.beginPath(); ctx.arc(x, y, 12, 0, 6.283); ctx.fill(); }
          ctx.strokeStyle = P.amber; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(600, 240); ctx.lineTo(600 + 720 * pr(l, 0.8, 1.2), 240 + 540 * pr(l, 0.8, 1.2)); ctx.stroke(); txt(ctx, "1 neuron = 1 garis pemisah", 960, 900, 34, { align: "center", color: P.ink2, weight: 700 }); ctx.restore(); }
        if (m > 0) net(ctx, m, (i, j) => 0.5 + 0.5 * Math.sin(t * 3 - i * 0.9 + j));
        return;
      }
      if (b.id === "b3_2") {
        // kamera bergeser dari lapis pertama ke lapis terakhir; tiap lapis menampilkan apa yang dikenalinya
        const cues = ["garis dan sudut", "bentuk", "telinga", "wajah kucing"].map(s => at(b, s)), tR = at(b, "Tidak ada yang");
        const k = cues.filter(c => l >= c).length; const cx = lerp(LX(0) + 300, LX(4) - 200, eio((l - cues[0]) / (cues[3] - cues[0] + 1)));
        cam(ctx, { x: cx, y: 540, z: 1.0 }, () => net(ctx, 1, (i) => (i < k + 1 ? 1 : 0.2)));
        const lab = [["garis & sudut", "╱ ╲ ┘"], ["bentuk", "◯ △"], ["telinga & mata", "▲ ● ●"], ["kucing", "🐱"]];
        lab.forEach(([s, ic], i) => { const u = fade(l, cues[i], 0.5); if (u <= 0) return; const x = 300 + i * 440; ctx.save(); ctx.globalAlpha = u * (i === k - 1 ? 1 : 0.55); panel(ctx, x - 180, 70, 360, 170, { fill: "rgba(10,16,48,0.88)", stroke: hexA(P.amber, i === k - 1 ? 0.9 : 0.3), lw: 3 }); txt(ctx, ic, x, 165, ic.length > 2 ? 52 : 80, { align: "center", color: P.amber }); txt(ctx, s, x, 220, 26, { align: "center", color: P.ink2, weight: 700 }); ctx.restore(); });
        const u = fade(l, tR, 0.5); if (u > 0) { ctx.save(); ctx.globalAlpha = u; panel(ctx, 560, 820, 800, 120, { fill: "#F2E9D8", stroke: false, r: 14 }); txt(ctx, "aturan: \"kucing punya telinga runcing\"", 960, 895, 32, { align: "center", color: "#5A4630" }); const x = pr(l, tR + 1.0, 0.4); ctx.strokeStyle = P.red; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(580, 880); ctx.lineTo(lerp(580, 1340, x), 880); ctx.stroke(); ctx.restore(); }
        return;
      }
      // b3_3: jaringan meluas menjadi galaksi; jumlah parameter
      const tG = at(b, "tetapi raksasa"), z = Math.exp(lerp(0, Math.log(0.18), eio((l - tG) / 4)));
      cam(ctx, { x: 960, y: 540, z }, () => { const r = rng(11); for (let i = 0; i < 900; i++) { const a = r() * 6.283, d = Math.pow(r(), 0.6) * 5200, x = 960 + Math.cos(a + d * 0.0006) * d, y = 540 + Math.sin(a + d * 0.0006) * d * 0.55; glow(ctx, x, y, 60, [P.teal, P.violet, P.blue][i % 3], 0.5 * (0.5 + 0.5 * Math.sin(t * 2 + i))); }
        net(ctx, 1 - eio((l - tG) / 2.5), (i, j) => 0.5 + 0.5 * Math.sin(t * 3 - i + j)); });
      const tP = at(b, "Parameternya"); if (l > tP) { ctx.save(); ctx.globalAlpha = fade(l, tP, 0.6); panel(ctx, 560, 820, 800, 150, { fill: "rgba(10,16,48,0.88)", stroke: hexA(P.amber, 0.6) }); txt(ctx, "ratusan miliar parameter", 960, 912, 52, { align: "center", color: P.amber, weight: 900 }); ctx.restore(); }
      const u = fade(l, at(b, "AI chatbot"), 0.6); if (u > 0) { ctx.save(); ctx.globalAlpha = u * (1 - fade(l, tG + 2, 1)); bubble(ctx, "AI chatbot", 1700, 120, 300, true, 30); ctx.restore(); }
    },
    // ===== 4. Mesin penebak kata =====
    d01_b4(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.35 });
      if (b.id === "b4_1") {
        txt(ctx, "Nasi goreng paling enak dimakan saat", 1180, 430, 54, { align: "right", weight: 800 });
        const blink = (l * 2) % 1 < 0.6; ctx.strokeStyle = P.amber; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); H.rr(ctx, 1210, 370, 260, 80, 14); ctx.stroke(); ctx.setLineDash([]); if (blink) txt(ctx, "?", 1340, 430, 56, { align: "center", color: P.amber });
        const C4 = [["malam", 46], ["lapar", 28], ["hujan", 14], ["pagi", 9]];
        C4.forEach(([w, p], i) => { const u = fade(l, 1.0 + i * 0.35, 0.4); if (u <= 0) return; const y = 560 + i * 90; ctx.save(); ctx.globalAlpha = u;
          txt(ctx, w, 1180, y + 18, 42, { align: "right", weight: 800, color: i ? P.ink2 : P.ink }); ctx.fillStyle = i ? hexA(P.violet, 0.7) : P.amber; H.rr(ctx, 1210, y - 18, 9 * p * eout(u), 44, 10); ctx.fill(); txt(ctx, p + "%", 1230 + 9 * p, y + 16, 34, { color: P.ink2, weight: 800 }); ctx.restore(); });
        return;
      }
      if (b.id === "b4_2") {
        const tR = at(b, "Model bahasa"), tG = at(b, "menebak potongan"), tC = at(b, "lalu memeriksa"), tS = at(b, "Kalau salah"), tL = at(b, "Lalu diulang");
        if (l < tL) {
          txt(ctx, "Ibu pergi ke pasar untuk membeli", 1000, 380, 54, { align: "right" });
          const g = fade(l, tG, 0.4), c = fade(l, tC, 0.4);
          ctx.strokeStyle = l > tC ? (c > 0 ? P.red : P.amber) : P.amber; ctx.lineWidth = 5; H.rr(ctx, 1030, 322, 300, 80, 14); ctx.stroke();
          if (g > 0) { ctx.save(); ctx.globalAlpha = g; txt(ctx, "sepatu", 1180, 380, 52, { align: "center", color: l > tC ? P.red : P.amber }); ctx.restore(); }
          if (c > 0) { ctx.save(); ctx.globalAlpha = c; txt(ctx, "jawaban di teks: sayur", 1180, 470, 34, { align: "center", color: P.green }); txt(ctx, "✕", 1380, 385, 64, { align: "center", color: P.red, weight: 900 }); ctx.restore(); }
          // kenop parameter bergeser sedikit
          for (let k = 0; k < 8; k++) { const x = 560 + k * 115, y = 690, a = -1.6 + Math.sin(k * 2.1) * 0.8 + (l > tS ? 0.35 * pr(l, tS + k * 0.08, 0.6) * (k % 2 ? 1 : -1) : 0);
            ctx.fillStyle = "#24336B"; ctx.beginPath(); ctx.arc(x, y, 42, 0, 6.283); ctx.fill(); ctx.strokeStyle = l > tS ? P.amber : P.violet; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 34, y + Math.sin(a) * 34); ctx.stroke(); }
          txt(ctx, "parameter", 960, 790, 30, { align: "center", color: P.ink2, weight: 700 });
          if (l > tS) txt(ctx, "digeser sedikit", 960, 610, 34, { align: "center", color: P.amber });
        } else {
          // diulang: kalimat-kalimat berkelebat cepat, penghitung tebakan naik
          const S = ["Matahari terbit dari sebelah …", "Ayo kita belajar …", "Kucing itu sedang …", "Hari ini cuacanya sangat …", "Dua tambah dua sama dengan …", "Buku itu ada di atas …"];
          const k = Math.floor((l - tL) * 3.2); for (let i = 0; i < 6; i++) { const j = (k + i) % S.length, a = Math.max(0, 1 - i * 0.18); ctx.save(); ctx.globalAlpha = a; txt(ctx, S[j], 960, 300 + i * 90, 46 - i * 3, { align: "center", color: i ? P.ink2 : P.ink, weight: 800 }); ctx.restore(); }
          counter(ctx, Math.pow(10, 3 + (l - tL) * 2.4), 960, 900, 70); txt(ctx, "tebakan", 960, 950, 30, { align: "center", color: P.ink2, weight: 700 });
        }
        return;
      }
      if (b.id === "b4_3") {
        const tN = at(b, "lima belas triliun"), tH = at(b, "Kalau seseorang"), tY = at(b, "puluhan ribu");
        // menara buku menjulang melewati awan; kamera naik
        const grow = eout((l - 0.3) / (tH - 0.3)), camY = lerp(540, -1400, eio((l - 0.6) / (tH - 0.2)));
        cam(ctx, { x: 960, y: camY, z: 1 }, () => {
          const top = lerp(940, -3400, grow); for (let y = 940; y > top; y -= 46) { const i = Math.round((940 - y) / 46); ctx.fillStyle = [P.pink, P.teal, P.violet, P.amber, P.blue][i % 5]; H.rr(ctx, 1260 + ((i * 37) % 30) - 15, y - 40, 200, 40, 6); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(1270 + ((i * 37) % 30) - 15, y - 26, 180, 4); }
          for (let c = 0; c < 6; c++) { const cy = -600 - c * 450, cx = 400 + (c % 2) * 1100; ctx.fillStyle = "rgba(220,230,255,0.18)"; [[0, 0, 140], [110, 20, 110], [-110, 25, 100]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(cx + dx, cy + dy, r, 0, 6.283); ctx.fill(); }); }
          ctx.fillStyle = "#0E1638"; ctx.fillRect(-500, 940, 2920, 800);
        });
        if (l > tN) { ctx.save(); ctx.globalAlpha = fade(l, tN, 0.5); panel(ctx, 80, 90, 640, 200, { fill: "rgba(10,16,48,0.88)", stroke: hexA(P.amber, 0.6) }); counter(ctx, 15e12 * eout((l - tN) / 2), 400, 190, 54); txt(ctx, "potongan kata", 400, 250, 30, { align: "center", color: P.ink2, weight: 700 }); ctx.restore(); }
        const u = fade(l, tH, 0.7); if (u > 0) { ctx.save(); ctx.globalAlpha = u; panel(ctx, 80, 640, 800, 330, { fill: "rgba(10,16,48,0.9)", stroke: hexA(P.violet, 0.6) });
          // manusia kecil membaca + jam pasir
          ctx.fillStyle = P.ink2; ctx.beginPath(); ctx.arc(230, 760, 30, 0, 6.283); ctx.fill(); H.rr(ctx, 195, 795, 70, 100, 20); ctx.fill(); ctx.fillStyle = P.amber; ctx.fillRect(250, 810, 70, 50);
          const hg = (l * 0.6) % 1; ctx.strokeStyle = P.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(350, 730); ctx.lineTo(430, 730); ctx.lineTo(350, 880); ctx.lineTo(430, 880); ctx.closePath(); ctx.stroke(); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.moveTo(360 + 30 * hg, 740 + 60 * hg); ctx.lineTo(420 - 30 * hg, 740 + 60 * hg); ctx.lineTo(390, 800); ctx.fill(); ctx.beginPath(); ctx.moveTo(390, 880 - 70 * hg); ctx.lineTo(360, 872); ctx.lineTo(420, 872); ctx.fill();
          txt(ctx, "membaca tanpa henti", 660, 780, 30, { align: "center", color: P.ink2, weight: 700 }); if (l > tY) txt(ctx, "± 84.000 tahun", 660, 860, 50, { align: "center", color: P.amber, weight: 900 }); ctx.restore(); }
        return;
      }
      if (b.id === "b4_4") {
        const tS = at(b, "terjadi sesuatu"), ks = ["tata bahasa", "fakta", "gaya bercerita", "langkah-langkah"];
        cam(ctx, { x: 0, y: 0, z: 0.8 }, () => netCity(ctx, t, 1, 0.6 + 0.4 * fade(l, tS, 1)));
        const lab = ["tata bahasa", "fakta", "gaya bercerita", "memecahkan soal"], pos = [[480, 300], [1440, 300], [480, 760], [1440, 760]], col = [P.teal, P.amber, P.pink, P.violet];
        ks.forEach((k, i) => { const u = fade(l, at(b, k), 0.6); if (u <= 0) return; const [x, y] = pos[i]; ctx.save(); ctx.globalAlpha = u; glow(ctx, x, y, 220, col[i], 0.35); panel(ctx, x - 230, y - 60, 460, 120, { fill: "rgba(10,16,48,0.88)", stroke: col[i], lw: 4 }); txt(ctx, lab[i], x, y + 16, 44, { align: "center", color: col[i] }); ctx.restore(); });
        if (l > tS && l < at(b, ks[0])) txt(ctx, "!", 960, 580, 200, { align: "center", color: P.amber, weight: 900 });
        return;
      }
      // b4_5: jawaban terbentuk satu potongan kata demi satu
      const ANS = ["Langit", " tampak", " biru", " karena", " cahaya", " biru", " paling", " banyak", " tersebar", "."], tT = at(b, "menebak potongan"), n = clamp(Math.floor((l - 0.4) / 0.62), 0, ANS.length);
      phone(ctx, 600, 540, 800, (c2, w, h) => { txt(c2, "Asisten AI", w / 2, 62, 24, { align: "center", color: P.ink2 }); bubble(c2, ANS.slice(0, n).join("") + (n < ANS.length ? " ▍" : ""), 20, 120, 360, false, 28); });
      if (n < ANS.length) { const opts = [[ANS[n].trim() || ".", 0.62], ["dan", 0.21], ["yang", 0.11]]; panel(ctx, 1040, 330, 700, 360, { fill: "rgba(10,16,48,0.9)" }); txt(ctx, "potongan kata berikutnya:", 1390, 395, 30, { align: "center", color: P.ink2, weight: 700 });
        opts.forEach(([w, p], i) => { const y = 470 + i * 75; txt(ctx, w, 1260, y, 40, { align: "right", color: i ? P.ink2 : P.amber }); ctx.fillStyle = i ? hexA(P.violet, 0.6) : P.amber; H.rr(ctx, 1290, y - 32, 400 * p, 40, 10); ctx.fill(); }); }
      else { panel(ctx, 1040, 420, 700, 160, { fill: "rgba(10,16,48,0.9)", stroke: hexA(P.amber, 0.6) }); txt(ctx, "satu demi satu", 1390, 520, 52, { align: "center", color: P.amber }); }
    },

    // ===== 5. Burung beo atau pembuat peta? =====
    d01_b5(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.35, top: "#0A1030", bot: "#122A3E" });
      if (b.id === "b5_1") {
        const u = fade(l, 0.3, 0.6);
        [[560, P.pink, "?"], [1360, P.teal, "!"]].forEach(([x, col, s], i) => { ctx.save(); ctx.globalAlpha = sm(fade(l, 0.3 + i * 0.5, 0.6));
          for (let k = -1; k <= 1; k++) { ctx.fillStyle = hexA(col, 0.85); ctx.beginPath(); ctx.arc(x + k * 120, 560, 42, 0, 6.283); ctx.fill(); H.rr(ctx, x + k * 120 - 50, 610, 100, 160, 40); ctx.fill(); }
          panel(ctx, x - 90, 340, 180, 130, { stroke: col, lw: 4 }); txt(ctx, s, x, 432, 84, { align: "center", color: col, weight: 900 }); ctx.restore(); });
        txt(ctx, "VS", 960, 640, 70, { align: "center", color: P.ink2, weight: 900 });
        return;
      }
      if (b.id === "b5_2") {
        const tP = at(b, "beo stokastik"), tW = at(b, "seperti burung");
        // burung beo geometris
        const u = fade(l, 0.3, 0.8); ctx.save(); ctx.globalAlpha = sm(u); const bx = 700, by = 520;
        ctx.fillStyle = "#2BB673"; ctx.beginPath(); ctx.ellipse(bx, by, 150, 200, -0.2, 0, 6.283); ctx.fill(); ctx.fillStyle = "#E64545"; ctx.beginPath(); ctx.arc(bx + 40, by - 210, 110, 0, 6.283); ctx.fill();
        ctx.fillStyle = "#FFC94A"; ctx.beginPath(); ctx.moveTo(bx + 130, by - 230); ctx.quadraticCurveTo(bx + 230, by - 210, bx + 170, by - 140); ctx.lineTo(bx + 120, by - 180); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(bx + 70, by - 240, 26, 0, 6.283); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(bx + 76, by - 240, 12, 0, 6.283); ctx.fill();
        ctx.fillStyle = "#1E7FCB"; ctx.beginPath(); ctx.moveTo(bx - 60, by + 150); ctx.lineTo(bx - 140, by + 380); ctx.lineTo(bx + 20, by + 180); ctx.fill();
        ctx.fillStyle = "#3A2F25"; ctx.fillRect(bx - 260, by + 190, 520, 26); ctx.restore();
        // kata keluar dari paruh tanpa makna yang tersambung
        const W8 = ["kopi", "pelangi", "jika", "melompat", "biru", "karena", "angka", "sepatu", "terbang", "maka"];
        for (let i = 0; i < 10; i++) { const s0 = tW + i * 0.45, uu = clamp((l - s0) / 2.4); if (uu <= 0 || uu >= 1) continue; ctx.save(); ctx.globalAlpha = Math.min(1, (1 - uu) * 2.5); txt(ctx, W8[i], bx + 200 + uu * 900, by - 200 + Math.sin(i * 2.3) * 160 * uu, 40, { color: [P.amber, P.teal, P.pink][i % 3] }); ctx.restore(); }
        if (l > tP) { ctx.save(); ctx.globalAlpha = fade(l, tP, 0.5); pill(ctx, "\"beo stokastik\"", 1400, 860, { size: 44, stroke: hexA(P.amber, 0.6), color: P.amber }); ctx.restore(); }
        return;
      }
      // papan Othello
      function board(ctx, x, y, s, st, a = 1, hl = null) {
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#1F7A55"; H.rr(ctx, x, y, s, s, 10); ctx.fill(); const c = s / 8; ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 2;
        for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(x + i * c, y); ctx.lineTo(x + i * c, y + s); ctx.moveTo(x, y + i * c); ctx.lineTo(x + s, y + i * c); ctx.stroke(); }
        st.forEach(([r, k, w]) => { ctx.fillStyle = w ? "#F2F4F8" : "#141820"; ctx.beginPath(); ctx.arc(x + (k + 0.5) * c, y + (r + 0.5) * c, c * 0.38, 0, 6.283); ctx.fill(); });
        if (hl) { ctx.strokeStyle = P.amber; ctx.lineWidth = 6; ctx.strokeRect(x + hl[1] * c + 3, y + hl[0] * c + 3, c - 6, c - 6); glow(ctx, x + (hl[1] + 0.5) * c, y + (hl[0] + 0.5) * c, c, P.amber, 0.6); }
        ctx.restore();
      }
      const ST = [[3, 3, 1], [3, 4, 0], [4, 3, 0], [4, 4, 1], [2, 3, 0], [2, 2, 1], [5, 4, 0], [4, 5, 1], [3, 5, 0]];
      if (b.id === "b5_3") {
        year(ctx, "2023", 960, 230, fade(l, at(b, "Pada tahun"), 0.6));
        const tM = at(b, "daftar langkah"), tN = at(b, "tidak pernah diberi");
        const mv = ["C4", "D3", "E6", "F5", "C5", "B4", "D6", "E3", "F4", "C6", "B5", "A4"]; const k = Math.floor(clamp((l - tM) * 2.2, 0, 99));
        if (l > tM) { panel(ctx, 160, 340, 700, 120, { fill: "rgba(10,16,48,0.9)" }); txt(ctx, mv.slice(Math.max(0, k - 6), k).join(", ") + (k ? " …" : ""), 510, 415, 42, { align: "center", color: P.amber, font: "mono" }); }
        board(ctx, 1160, 340, 520, ST, 0.18 + 0.08 * Math.sin(t * 2));
        ctx.save(); ctx.fillStyle = "rgba(20,30,70,0.55)"; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(1180 + i * 100, 400 + (i % 3) * 160, 160, 0, 6.283); ctx.fill(); } ctx.restore();
        [["tanpa aturan", tN], ["tanpa melihat papan", at(b, "tidak pernah melihat")]].forEach(([s, tt], i) => { const u = fade(l, tt, 0.5); if (u > 0) { ctx.save(); ctx.globalAlpha = u; pill(ctx, "✕ " + s, 510, 580 + i * 110, { size: 36, color: P.pink }); ctx.restore(); } });
        return;
      }
      if (b.id === "b5_4") {
        const tF = at(b, "menemukan sesuatu"), tC = at(b, "Saat gambar itu"), tM = at(b, "Model itu tampaknya");
        cam(ctx, { x: 0, y: 0, z: 0.7 }, () => netCity(ctx, t, 0.5, 0.5));
        // kaca pembesar menampakkan papan di dalam model
        const u = fade(l, tF - 0.5, 0.8); glow(ctx, 960, 520, 440, P.teal, 0.25 * u); ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = "rgba(10,16,48,0.92)"; ctx.beginPath(); ctx.arc(960, 520, 330, 0, 6.283); ctx.fill(); ctx.strokeStyle = P.ink2; ctx.lineWidth = 18; ctx.stroke();
        ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(1195, 755); ctx.lineTo(1340, 900); ctx.stroke();
        const flip = l > tC + 0.6; const st = ST.map(([r, k, w]) => (flip && r === 3 && k === 4) ? [r, k, 1] : [r, k, w]);
        board(ctx, 760, 320, 400, st, 1, flip ? [5, 5] : [2, 4]); ctx.restore();
        if (l > tC) { ctx.save(); ctx.globalAlpha = fade(l, tC, 0.5); panel(ctx, 1350, 330, 470, 220, { fill: "rgba(10,16,48,0.9)", stroke: hexA(P.amber, 0.6) }); txt(ctx, "gambar diubah", 1585, 410, 36, { align: "center", color: P.ink2 }); txt(ctx, "→ langkah berubah", 1585, 480, 40, { align: "center", color: P.amber }); ctx.restore(); }
        if (l > tM) { ctx.save(); ctx.globalAlpha = fade(l, tM, 0.5); pill(ctx, "peta dunia di dalam model", 960, 960, { size: 40, color: P.teal, stroke: hexA(P.teal, 0.6) }); ctx.restore(); }
        return;
      }
      if (b.id === "b5_5") {
        year(ctx, "2025", 960, 230, fade(l, 0.3, 0.6));
        const tW = at(b, "menulis pantun"), tR = at(b, "Ternyata model");
        const L1 = "Pagi-pagi minum kopi hangat,", L2a = "Sampai di sekolah tetap ", L2b = "semangat";
        if (l > 0.8) { ctx.save(); ctx.globalAlpha = fade(l, 0.8, 0.6); panel(ctx, 260, 360, 1400, 360, { fill: "rgba(10,16,48,0.9)" }); txt(ctx, L1, 330, 480, 56, { weight: 800 });
          const rhyme = fade(l, tR, 0.6), wr = clamp((l - tR - 0.8) / 3.2);
          ctx.font = `800 56px ${K.FONT}`; const xR = 330 + ctx.measureText(L2a).width;
          if (rhyme > 0) { glow(ctx, xR + 120, 600, 200, P.amber, 0.7 * rhyme); txt(ctx, L2b, xR, 620, 56, { color: P.amber, weight: 900 }); ctx.save(); ctx.globalAlpha = rhyme; txt(ctx, "kata rima dipilih lebih dulu", xR + 130, 690, 28, { align: "center", color: P.amber, weight: 700 }); ctx.restore(); }
          txt(ctx, typed(L2a, wr), 330, 620, 56, { weight: 800 }); ctx.restore(); }
        return;
      }
      // b5_6: beo atau pembuat peta?
      const tQ = at(b, "Tetapi, apakah");
      panel(ctx, 260, 300, 620, 420, { stroke: hexA(P.pink, 0.6), lw: 3 }); txt(ctx, "🦜", 570, 500, 140, { align: "center" }); txt(ctx, "beo stokastik", 570, 640, 40, { align: "center", color: P.pink });
      panel(ctx, 1040, 300, 620, 420, { stroke: hexA(P.teal, 0.6), lw: 3 }); board(ctx, 1220, 360, 260, ST, 1); txt(ctx, "pembuat peta", 1350, 680, 40, { align: "center", color: P.teal });
      if (l > tQ) { ctx.save(); ctx.globalAlpha = fade(l, tQ, 0.6); txt(ctx, "= berpikir?", 960, 880, 80, { align: "center", color: P.amber, weight: 900 }); ctx.restore(); }
      bip(ctx, 960, 520, 150, { mood: "think", t });
    },

    // ===== 6. Ruangan berisi buku aturan =====
    d01_b6(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.25, top: "#0C0F2A", bot: "#22183C" });
      if (b.id === "b6_1") {
        year(ctx, "1950", 960, 200, fade(l, 0.3, 0.6)); const tT = at(b, "Alan Turing"), tC = at(b, "Kalau kamu"), tM = at(b, "mungkin kita");
        if (l > tT) { ctx.save(); ctx.globalAlpha = fade(l, tT, 0.5); pill(ctx, "Alan Turing · Uji Turing", 960, 300, { size: 34, stroke: hexA(P.amber, 0.6) }); ctx.restore(); }
        [[560, "A"], [1360, "B"]].forEach(([x, s], i) => { ctx.fillStyle = "#3A2A1E"; H.rr(ctx, x - 140, 380, 280, 460, 10); ctx.fill(); ctx.fillStyle = "#5A4230"; H.rr(ctx, x - 120, 400, 240, 420, 8); ctx.fill(); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(x + 90, 620, 10, 0, 6.283); ctx.fill(); txt(ctx, s, x, 470, 60, { align: "center", color: "#E8D2B8" });
          const u = clamp((l - tC - i * 0.6) / 1.4); if (u > 0) { ctx.save(); ctx.translate(x + (i ? -1 : 1) * 200 * eout(u), 700); ctx.rotate((i ? 1 : -1) * 0.1); panel(ctx, -90, -55, 180, 110, { fill: "#F2E9D8", stroke: false, r: 8 }); txt(ctx, "Halo!", 0, 12, 34, { align: "center", color: "#5A4630" }); ctx.restore(); } });
        // penanya di tengah
        ctx.fillStyle = P.ink2; ctx.beginPath(); ctx.arc(960, 650, 46, 0, 6.283); ctx.fill(); H.rr(ctx, 905, 705, 110, 150, 40); ctx.fill();
        if (l > tC + 1) txt(ctx, "?", 960, 580, 80, { align: "center", color: P.amber, weight: 900 });
        if (l > tM) { ctx.save(); ctx.globalAlpha = fade(l, tM, 0.5); pill(ctx, "manusia atau mesin?", 960, 950, { size: 40, color: P.amber }); ctx.restore(); }
        return;
      }
      // ruangan Searle (dipakai b6_2–b6_4)
      function room(ctx, l, step) {
        ctx.fillStyle = "#1A2350"; H.rr(ctx, 360, 260, 1200, 620, 18); ctx.fill(); ctx.strokeStyle = "#3A4C90"; ctx.lineWidth = 10; ctx.stroke();
        ctx.fillStyle = "#0A0E25"; ctx.fillRect(1548, 520, 24, 110); // celah pintu
        for (let i = 0; i < 9; i++) { ctx.fillStyle = [P.pink, P.teal, P.violet, P.amber][i % 4]; H.rr(ctx, 420 + (i % 3) * 70, 720 - Math.floor(i / 3) * 70, 60, 64, 6); ctx.fill(); }
        ctx.fillStyle = "#F2E9D8"; H.rr(ctx, 700, 640, 300, 180, 8); ctx.fill(); txt(ctx, "BUKU ATURAN", 850, 700, 26, { align: "center", color: "#5A4630" }); ctx.fillStyle = "#C9B998"; for (let k = 0; k < 3; k++) ctx.fillRect(730, 730 + k * 26, 240, 8);
        bip(ctx, 1150, 690, 200, { mood: step === 2 ? "think" : "happy", t, look: [0.6, 0.4] });
      }
      if (b.id === "b6_2") {
        year(ctx, "1980", 300, 180, fade(l, 0.3, 0.6)); const tS = at(b, "John Searle"), tR = at(b, "Bayangkan"), tP = at(b, "Lewat celah");
        if (l > tS) { ctx.save(); ctx.globalAlpha = fade(l, tS, 0.5); pill(ctx, "John Searle · thought experiment", 1160, 180, { size: 32, stroke: hexA(P.amber, 0.6) }); ctx.restore(); }
        const u = fade(l, tR - 0.4, 0.8); if (u > 0) { ctx.save(); ctx.globalAlpha = sm(u); room(ctx, l, 1); ctx.restore(); }
        if (l > tP) { const p = eout((l - tP) / 1.6); ctx.save(); ctx.translate(lerp(1760, 1380, p), 575); panel(ctx, -110, -60, 220, 120, { fill: "#F8F3E8", stroke: false, r: 8 }); txt(ctx, "你好吗？", 0, 16, 44, { align: "center", color: "#222", font: "WenQuanYi Zen Hei" }); ctx.restore(); }
        return;
      }
      if (b.id === "b6_3") {
        room(ctx, l, 2); const tL = at(b, "mencari simbol"), tW = at(b, "lalu menyalin"), tO = at(b, "Dari luar"), tN = at(b, "Tetapi kamu");
        ctx.save(); ctx.translate(1380, 575); panel(ctx, -110, -60, 220, 120, { fill: "#F8F3E8", stroke: false, r: 8 }); txt(ctx, "你好吗？", 0, 16, 44, { align: "center", color: "#222" }); ctx.restore();
        if (l > tL) { const u = fade(l, tL, 0.5); ctx.save(); ctx.globalAlpha = u; panel(ctx, 640, 330, 520, 230, { fill: "#F2E9D8", stroke: false, r: 10 }); txt(ctx, "你好吗？", 760, 420, 44, { align: "center", color: "#222" }); txt(ctx, "→", 900, 420, 50, { align: "center", color: "#5A4630" }); txt(ctx, "我很好", 1040, 420, 44, { align: "center", color: "#222" }); txt(ctx, "aturan nomor 4.812", 900, 510, 26, { align: "center", color: "#7A6650", weight: 700 }); ctx.restore(); }
        if (l > tW) { const p = eout((l - tW - 0.6) / 1.6); ctx.save(); ctx.translate(lerp(1380, 1760, p), 440); panel(ctx, -100, -55, 200, 110, { fill: "#F8F3E8", stroke: false, r: 8 }); txt(ctx, "我很好", 0, 16, 42, { align: "center", color: "#222" }); ctx.restore(); }
        if (l > tO) { ctx.save(); ctx.globalAlpha = fade(l, tO, 0.5); pill(ctx, "✓ jawaban benar", 1700, 300, { size: 32, color: P.green }); ctx.restore(); }
        if (l > tN) { ctx.save(); ctx.globalAlpha = fade(l, tN, 0.5); pill(ctx, "Bip tidak mengerti satu kata pun", 960, 960, { size: 38, color: P.pink, stroke: hexA(P.pink, 0.5) }); ctx.restore(); }
        return;
      }
      // b6_4: argumen Searle dan bantahan "seluruh sistem"
      const c = ["Kata Searle", "Tetapi ada yang", "Satu sel otakmu", "Mungkin begitu pula", "Satu komponen", "Sampai hari ini"].map(s => at(b, s));
      const st = c.filter(x => l >= x).length;
      if (st <= 2) { room(ctx, l, 2); ctx.save(); ctx.globalAlpha = fade(l, c[0], 0.5); panel(ctx, 360, 120, 1200, 110, { fill: "rgba(10,16,48,0.92)", stroke: hexA(P.pink, 0.6) }); txt(ctx, "Searle: komputer hanya mencocokkan simbol", 960, 192, 40, { align: "center", color: P.pink }); ctx.restore();
        if (st === 2) { ctx.save(); ctx.globalAlpha = fade(l, c[1], 0.5); pill(ctx, "Tetapi ada yang membantah …", 960, 960, { size: 40, color: P.teal, stroke: hexA(P.teal, 0.6) }); ctx.restore(); } return; }
      if (st === 3) { // satu sel vs otak utuh
        const u = fade(l, c[2], 0.6); ctx.save(); ctx.globalAlpha = u;
        neuron(ctx, 560, 520, 50, { seed: 4, color: P.teal, fire: 0.2 }); txt(ctx, "1 sel: tidak mengerti bahasa", 560, 820, 36, { align: "center", color: P.ink2 });
        brain(ctx, 1360, 520, 300, 1); txt(ctx, "otak utuh: mengerti", 1360, 820, 36, { align: "center", color: P.green }); ctx.restore(); return; }
      if (st === 4) { // seluruh ruangan bersama-sama
        room(ctx, l, 1); const u = fade(l, c[3] + 0.8, 1.2); glow(ctx, 960, 570, 800, P.teal, 0.35 * u); ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = P.teal; ctx.lineWidth = 10; ctx.setLineDash([24, 14]); H.rr(ctx, 330, 230, 1260, 680, 26); ctx.stroke(); ctx.setLineDash([]); pill(ctx, "orang + buku + aturan = paham?", 960, 170, { size: 40, color: P.teal }); ctx.restore(); return; }
      if (st === 5) { // satu komponen vs seluruh sistem komputer
        const u = fade(l, c[4], 0.6); ctx.save(); ctx.globalAlpha = u;
        ctx.fillStyle = "#24336B"; H.rr(ctx, 440, 420, 200, 200, 16); ctx.fill(); ctx.strokeStyle = P.ink2; ctx.lineWidth = 4; ctx.stroke(); for (let k = 0; k < 6; k++) { ctx.fillRect(420, 440 + k * 30, 20, 8); ctx.fillRect(640, 440 + k * 30, 20, 8); } txt(ctx, "1 komponen", 540, 700, 36, { align: "center", color: P.ink2 });
        const u2 = fade(l, at(b, "tapi seluruh"), 0.8); ctx.globalAlpha = u * u2; glow(ctx, 1360, 520, 420, P.teal, 0.4); panel(ctx, 1080, 300, 560, 440, { stroke: P.teal, lw: 5 }); for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { ctx.fillStyle = "#2B3A73"; H.rr(ctx, 1120 + k * 125, 340 + r * 120, 100, 90, 10); ctx.fill(); } txt(ctx, "seluruh sistem", 1360, 800, 40, { align: "center", color: P.teal }); ctx.restore(); return; }
      // perdebatan: timbangan seimbang bergoyang
      const sw = Math.sin(t * 1.4) * 0.12; ctx.save(); ctx.translate(960, 420); ctx.strokeStyle = P.ink2; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 420); ctx.stroke(); ctx.rotate(sw); ctx.beginPath(); ctx.moveTo(-420, 0); ctx.lineTo(420, 0); ctx.stroke();
      [[-420, "tidak paham", P.pink], [420, "bisa paham", P.teal]].forEach(([x, s, col]) => { ctx.save(); ctx.translate(x, 0); ctx.rotate(-sw); ctx.strokeStyle = P.ink2; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-90, 160); ctx.moveTo(0, 0); ctx.lineTo(90, 160); ctx.stroke(); panel(ctx, -150, 160, 300, 90, { stroke: col, lw: 4 }); txt(ctx, s, 0, 218, 34, { align: "center", color: col }); ctx.restore(); });
      ctx.restore(); txt(ctx, "perdebatan belum selesai", 960, 960, 44, { align: "center", color: P.amber });
    },

    // ===== 7. Yang belum dimiliki AI =====
    d01_b7(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.3 });
      if (b.id === "b7_1") { ["?", "?", "?"].forEach((s, i) => { const u = fade(l, 0.3 + i * 0.4, 0.5); ctx.save(); ctx.globalAlpha = u; panel(ctx, 380 + i * 420, 360, 320, 320, { stroke: hexA(P.violet, 0.6), lw: 4 }); txt(ctx, s, 540 + i * 420, 560, 140, { align: "center", color: P.ink2, weight: 900 }); ctx.restore(); }); return; }
      if (b.id === "b7_2") {
        const tB = at(b, "Ia bisa menyebut"), tD = at(b, "Kesalahan ini");
        for (let r = 0; r < 3; r++) { ctx.fillStyle = "#3A2A1E"; ctx.fillRect(260, 330 + r * 210, 1400, 20); for (let k = 0; k < 16; k++) { const h = 150 + ((k * 7 + r) % 4) * 12; ctx.fillStyle = [P.pink, P.teal, P.violet, P.blue, P.amber][(k + r) % 5]; ctx.globalAlpha = 0.55; ctx.fillRect(280 + k * 86, 330 + r * 210 - h, 70, h); } ctx.globalAlpha = 1; }
        const u = fade(l, tB, 0.6), dust = fade(l, tD - 0.6, 1.6);
        if (u > 0) { ctx.save(); ctx.globalAlpha = u * (1 - dust); glow(ctx, 1500, 520, 300, P.amber, 0.7); panel(ctx, 1330, 300, 340, 440, { fill: "#2B2060", stroke: P.amber, lw: 5, r: 12 }); txt(ctx, "Sejarah Robot", 1500, 430, 34, { align: "center", color: P.amber }); txt(ctx, "Nusantara", 1500, 475, 34, { align: "center", color: P.amber }); txt(ctx, "Prof. R. Nusantoro", 1500, 560, 24, { align: "center", color: P.ink2, weight: 700 }); txt(ctx, "1987", 1500, 640, 34, { align: "center", color: P.ink2 }); ctx.restore();
          if (dust > 0) { const r = rng(3); for (let k = 0; k < 120; k++) { const x = 1340 + r() * 320, y = 310 + r() * 420; ctx.fillStyle = hexA(P.amber, 0.8 * (1 - dust)); ctx.fillRect(x + dust * (r() - 0.3) * 300, y - dust * r() * 300, 5, 5); } } }
        if (l > tD) { ctx.save(); ctx.globalAlpha = fade(l, tD, 0.5); pill(ctx, "halusinasi", 1500, 860, { size: 48, color: P.pink, stroke: hexA(P.pink, 0.6) }); pill(ctx, "buku ini tidak pernah ada", 700, 860, { size: 34, color: P.ink2 }); ctx.restore(); }
        return;
      }
      if (b.id === "b7_3") {
        const tN = at(b, "panasnya nasi"), tH = at(b, "dinginnya hujan"), tW = at(b, "Ia mengenal");
        // kiri: AI hanya kata-kata; kanan: manusia merasakan
        panel(ctx, 160, 220, 760, 640, { stroke: hexA(P.violet, 0.5) }); panel(ctx, 1000, 220, 760, 640, { stroke: hexA(P.amber, 0.5) });
        txt(ctx, "AI", 540, 300, 44, { align: "center", color: P.violet }); txt(ctx, "kamu", 1380, 300, 44, { align: "center", color: P.amber });
        if (l > tW) { const r = rng(8); for (let k = 0; k < 18; k++) { ctx.save(); ctx.globalAlpha = fade(l, tW + k * 0.12, 0.4) * 0.85; txt(ctx, "hujan", 220 + r() * 600, 380 + r() * 440, 22 + r() * 22, { color: P.violet, weight: 700 }); ctx.restore(); } }
        else txt(ctx, "…", 540, 560, 90, { align: "center", color: P.ink2 });
        if (l > tN) { ctx.save(); ctx.globalAlpha = fade(l, tN, 0.5); ctx.fillStyle = "#F4F1E8"; ctx.beginPath(); ctx.ellipse(1240, 520, 150, 70, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = "#8A6A4A"; ctx.fillRect(1100, 520, 280, 60); for (let k = 0; k < 3; k++) { ctx.strokeStyle = hexA("#FFFFFF", 0.6); ctx.lineWidth = 5; ctx.beginPath(); const x = 1190 + k * 50; ctx.moveTo(x, 430); ctx.bezierCurveTo(x - 20, 400 - (l * 30) % 20, x + 20, 380, x, 350); ctx.stroke(); } txt(ctx, "panas", 1240, 640, 30, { align: "center", color: P.amber }); ctx.restore(); }
        if (l > tH) { ctx.save(); ctx.globalAlpha = fade(l, tH, 0.5); for (let k = 0; k < 24; k++) { const x = 1460 + (k * 53) % 260, y = 380 + ((k * 97 + l * 400) % 380); ctx.strokeStyle = P.blue; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 26); ctx.stroke(); } txt(ctx, "dingin", 1590, 800, 30, { align: "center", color: P.blue }); ctx.restore(); }
        return;
      }
      // b7_4: AI diam menunggu; pikiran manusia terus bergerak
      const tH = at(b, "Sementara itu");
      phone(ctx, 560, 540, 700, (c2, w, h) => { txt(c2, "menunggu pertanyaan…", w / 2, h / 2, 26, { align: "center", color: P.dim }); if ((l * 1.5) % 1 < 0.5) { c2.fillStyle = P.dim; c2.fillRect(w / 2 - 4, h / 2 + 30, 8, 36); } }, { glow: "#334" });
      if (l > tH - 0.3) { const u = fade(l, tH - 0.3, 0.8); ctx.save(); ctx.globalAlpha = u; head(ctx, 1320, 600, 600, { fill: "#1B2B5E", stroke: hexA(P.amber, 0.5) });
        [["mimpi", "☁", 0], ["khawatir", "〰", 1], ["penasaran", "?", 2]].forEach(([s, ic, i]) => { const a = t * 0.8 + i * 2.1, x = 1360 + Math.cos(a) * 230, y = 360 + Math.sin(a) * 120; const uu = fade(l, at(b, s === "mimpi" ? "bermimpi" : s), 0.5); if (uu <= 0) return; ctx.save(); ctx.globalAlpha = uu; panel(ctx, x - 110, y - 50, 220, 100, { stroke: hexA(P.amber, 0.6), lw: 3 }); txt(ctx, ic + " " + s, x, y + 12, 28, { align: "center", color: P.amber }); ctx.restore(); });
        ctx.restore(); }
    },

    // ===== 8. Jadi, apakah AI berpikir? =====
    d01_b8(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.5 });
      if (b.id === "b8_1") {
        const u = fade(l, 0.2, 0.8); glow(ctx, 960, 480, 420, P.violet, 0.4 * u); ctx.save(); ctx.globalAlpha = u; txt(ctx, "?", 960, 600, 360, { align: "center", color: P.amber, weight: 900 }); ctx.restore();
        const tD = at(b, "Kita bahkan"); if (l > tD) { const D8 = ["mengingat?", "memahami?", "merasakan?", "merencanakan?", "menyadari?"]; D8.forEach((s, i) => { const a = i / 5 * 6.283 + t * 0.2; ctx.save(); ctx.globalAlpha = fade(l, tD + i * 0.25, 0.5) * 0.85; txt(ctx, s, 960 + Math.cos(a) * 560, 520 + Math.sin(a) * 300, 36, { align: "center", color: P.ink2 }); ctx.restore(); }); }
        return;
      }
      if (b.id === "b8_2") {
        // kemampuan berpikir sebagai pulau; sebagian diterangi cahaya AI
        const IS = [["mengenali pola", 420, 420, 1, "Mengenali pola"], ["merencanakan", 900, 330, 1, "merencanakan"], ["memahami", 1400, 430, 0.45, "memahami"], ["merasakan", 650, 760, 0, "merasakan"], ["menyadari diri", 1230, 770, 0, "menyadari diri"]];
        const tL = at(b, "AI hari ini");
        IS.forEach(([s, x, y, lit, cue], i) => { const u = 0.3 + 0.7 * fade(l, at(b, cue), 0.6); ctx.save(); ctx.globalAlpha = u * fade(l, 0.2, 0.8);
          const L = lit * fade(l, tL + i * 0.3, 1); if (L > 0) glow(ctx, x, y, 260, P.amber, 0.55 * L);
          ctx.fillStyle = L > 0.5 ? "#3D8A62" : L > 0.2 ? "#2C5C4E" : "#1E3040"; ctx.beginPath(); ctx.ellipse(x, y, 190, 90, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = hexA("#0A1030", 0.6 * (1 - L)); ctx.beginPath(); ctx.ellipse(x, y, 190, 90, 0, 0, 6.283); ctx.fill();
          txt(ctx, s, x, y + 12, 34, { align: "center", color: L > 0.2 ? P.ink : P.dim }); ctx.restore(); });
        if (l > tL) { ctx.save(); ctx.globalAlpha = fade(l, tL, 0.6); pill(ctx, "☀ cahaya = kemampuan AI hari ini", 960, 990, { size: 32, color: P.amber }); ctx.restore(); }
        return;
      }
      if (b.id === "b8_3") {
        const tF = at(b, "teman berpikir"), T3 = [["Periksa jawabannya", "Periksa", "🔍"], ["Tanyakan alasannya", "tanyakan", "💬"], ["Keputusan akhir: kamu", "biarkan", "🧠"]];
        ctx.fillStyle = P.ink2; ctx.beginPath(); ctx.arc(420, 420, 70, 0, 6.283); ctx.fill(); H.rr(ctx, 340, 500, 160, 240, 60); ctx.fill(); bip(ctx, 640, 640, 220, { mood: "happy", t, wave: l > tF ? l : undefined });
        if (l > tF) { ctx.save(); ctx.globalAlpha = fade(l, tF, 0.5); pill(ctx, "teman berpikir", 530, 860, { size: 38, color: P.teal, stroke: hexA(P.teal, 0.6) }); ctx.restore(); }
        T3.forEach(([s, cue, ic], i) => { const u = fade(l, at(b, cue), 0.5); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; ctx.translate((1 - eout(u)) * 60, 0); panel(ctx, 980, 250 + i * 190, 780, 150, { stroke: hexA(P.amber, 0.6), lw: 3 }); txt(ctx, ic, 1070, 345 + i * 190, 60, { align: "center" }); txt(ctx, s, 1140, 342 + i * 190, 44, { color: P.ink }); ctx.restore(); });
        return;
      }
      // b8_4: kembali ke kepala manusia yang bercahaya, lalu langit malam
      const z = Math.exp(lerp(Math.log(1.6), Math.log(0.8), eio(l / (A(b) + 4))));
      cam(ctx, { x: 960, y: 560, z }, () => { head(ctx, 960, 600, 760, { fill: "#16275A", stroke: hexA(P.amber, 0.5) }); ctx.save(); ctx.beginPath(); ctx.ellipse(1000, 480, 230, 170, 0, 0, 6.283); ctx.clip(); ctx.translate(1000, 480); ctx.scale(0.2, 0.2); netCity(ctx, t, 1, 1); ctx.restore(); });
      const u = fade(l, at(b, "yang bekerja"), 0.6); if (u > 0) { ctx.save(); ctx.globalAlpha = u; pill(ctx, "86 miliar neuron · 20 watt", 960, 960, { size: 40, color: P.amber, stroke: hexA(P.amber, 0.5) }); ctx.restore(); }
      bip(ctx, 1600, 860, 130, { mood: "happy", t, look: [-0.8, -0.6] });
    },

    // ===== 9. Penutup =====
    d01_b9(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.6 }); glow(ctx, 960, 420, 600, P.violet, 0.3);
      bip(ctx, 960, 360, 260, { mood: "happy", t, wave: l });
      const u = fade(l, at(b, "subscribe"), 0.6);
      panel(ctx, 560, 560, 800, 120, { stroke: hexA(P.amber, 0.8), lw: 5 }); txt(ctx, "youtube.com/@iTeachSWE", 960, 638, 54, { align: "center", color: P.amber, weight: 900 });
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = "#E5484D"; H.rr(ctx, 790, 720, 340, 90, 45); ctx.fill(); txt(ctx, "🔔 SUBSCRIBE", 960, 778, 38, { align: "center", color: "#FFFFFF", weight: 900 }); ctx.restore(); }
      txt(ctx, "I Teach Software Engineering", 960, 880, 34, { align: "center", color: P.ink2, weight: 700 });
      const v = fade(l, at(b, "Sampai jumpa"), 0.6); if (v > 0) { ctx.save(); ctx.globalAlpha = v * 0.8; [["Tonton juga", 100], ["Tonton juga", 1420]].forEach(([s, x]) => { ctx.strokeStyle = hexA(P.ink2, 0.5); ctx.lineWidth = 3; ctx.setLineDash([12, 10]); H.rr(ctx, x, 380, 400, 225, 16); ctx.stroke(); ctx.setLineDash([]); txt(ctx, s, x + 200, 500, 30, { align: "center", color: P.ink2 }); }); ctx.restore(); }
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
