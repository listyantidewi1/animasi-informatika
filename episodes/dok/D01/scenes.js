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
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
