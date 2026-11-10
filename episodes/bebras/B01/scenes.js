/* B01 Pembahasan Soal Bebras 2022-AU-02 "Remembering Face" (Australia), kategori SiKecil.
   Gaya papan tulis putih dengan coretan spidol + simulasi berang-berang yang berjalan mengikuti panah.
   Papan: x 52–1868, y 130–830 (kartu narasi tiga baris mulai y≈841).
   Pohon keputusan (sama dengan soal): kotak kacamata (atas) –✓→ kotak topi (kiri), –✗→ kotak syal (kanan);
   topi ✓→ lingkaran 1, ✗→ lingkaran 2; syal ✓→ lingkaran 3, ✗→ lingkaran 4 (berang-berang polos).
   Jawaban: 1 = C (kacamata + topi), 2 = B (kacamata), 3 = A (syal).
   Panel kiri (x 70–430): berang-berang yang sedang ditelusuri + tabel benda; panel kanan (x 1495–1850): pertanyaan + jawaban.
   Lajur aturan (y 690–800) di bawah lingkaran. Waktu kejadian diambil dari posisi kata di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, kid, ease, clamp, lerp, wrap } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", PINK = "#D63A97", LENS = "#2F7FD1",
        HAT = "#35B27F", HATD = "#1F8A5E", FUR = "#8E5B3A", FUR2 = "#B98458", GRAY = "#E3E7EA", BOXF = "#E6E9EC";

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => { const T = TXT(b), i = T.indexOf(s); return lead(b) + Math.max(0, i) / T.length * (b.audio || b.dur); };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));

  // ---------- papan dan spidol ----------
  function board(ctx) {
    ctx.fillStyle = "#C3CDD4"; rr(ctx, 40, 118, 1840, 724, 22); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 52, 130, 1816, 700, 14); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.03)"; rr(ctx, 52, 130, 1816, 18, 8); ctx.fill();
  }
  function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
  function ptAt(pts, u) {
    const L = plen(pts) * clamp(u, 0, 1); let s = 0;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s + d >= L) { const k = d ? (L - s) / d : 0; return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; }
      s += d;
    }
    return pts[pts.length - 1];
  }
  // garis spidol yang tergambar sampai fraksi u; head = mata panah di ujung
  function mline(ctx, pts, u, color, w, head) {
    if (u <= 0) return;
    const L = plen(pts) * clamp(u, 0, 1); let s = 0;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let end = pts[0], prev = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s + d >= L) { const k = d ? (L - s) / d : 0; end = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; prev = pts[i - 1]; ctx.lineTo(end[0], end[1]); break; }
      ctx.lineTo(pts[i][0], pts[i][1]); s += d; end = pts[i]; prev = pts[i - 1];
    }
    ctx.stroke();
    if (head && u >= 0.98) {
      const a = Math.atan2(end[1] - prev[1], end[0] - prev[0]), hs = w * 3.2;
      ctx.beginPath(); ctx.moveTo(end[0] - hs * Math.cos(a - 0.5), end[1] - hs * Math.sin(a - 0.5)); ctx.lineTo(end[0], end[1]);
      ctx.lineTo(end[0] - hs * Math.cos(a + 0.5), end[1] - hs * Math.sin(a + 0.5)); ctx.stroke();
    }
    ctx.restore();
  }
  // tanda centang dan silang digambar dengan garis (bukan huruf), supaya selalu jelas
  function tick(ctx, x, y, s, u = 1, color = GREEN, w) {
    mline(ctx, [[x - s * 0.45, y], [x - s * 0.12, y + s * 0.33], [x + s * 0.48, y - s * 0.38]], u, color, w || Math.max(4, s * 0.16));
  }
  function cross(ctx, x, y, s, u = 1, color = RED, w) {
    const lw = w || Math.max(4, s * 0.16);
    mline(ctx, [[x - s * 0.36, y - s * 0.36], [x + s * 0.36, y + s * 0.36]], u * 2, color, lw);
    mline(ctx, [[x + s * 0.36, y - s * 0.36], [x - s * 0.36, y + s * 0.36]], u * 2 - 1, color, lw);
  }
  function ring(ctx, x, y, rx, ry, u, color = ORANGE, w = 6) {   // lingkaran coretan spidol (dilingkari)
    if (u <= 0) return;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -0.08, -Math.PI * 0.6, -Math.PI * 0.6 + Math.PI * 2.15 * clamp(u, 0, 1)); ctx.stroke(); ctx.restore();
  }
  function hand(ctx, s, x, y, size, opt = {}) {   // tulisan tangan spidol (Inter miring, tebal) — tetap mudah dibaca
    ctx.save(); ctx.font = `italic 800 ${size}px ${K.FONT}`; ctx.fillStyle = opt.color || ORANGE; ctx.textAlign = opt.align || "center";
    ctx.textBaseline = "alphabetic"; if (opt.alpha != null) ctx.globalAlpha = opt.alpha; ctx.fillText(s, x, y); ctx.restore();
  }

  // ---------- berang-berang dan benda ----------
  // koordinat lokal 100 satuan: kepala di (0,-14) r 30, badan di (0,22); x,y = pusat, s = tinggi gambar
  function glassesPart(ctx) {
    ctx.fillStyle = LENS; ctx.strokeStyle = "#1B2733"; ctx.lineWidth = 3;
    rr(ctx, -25, -31, 21, 15, 5); ctx.fill(); ctx.stroke(); rr(ctx, 4, -31, 21, 15, 5); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-4, -26); ctx.lineTo(4, -26); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.fillRect(-21, -28, 6, 3); ctx.fillRect(8, -28, 6, 3);
  }
  function hatPart(ctx) {
    ctx.fillStyle = HAT; ctx.strokeStyle = "#1B2733"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-25, -37); ctx.bezierCurveTo(-25, -66, 25, -66, 25, -37); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = HATD; rr(ctx, -30, -40, 60, 8, 4); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = HATD; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, -59); ctx.lineTo(0, -41); ctx.stroke();
    ctx.fillStyle = HATD; ctx.beginPath(); ctx.arc(0, -60, 3.5, 0, Math.PI * 2); ctx.fill();
  }
  function scarfPart(ctx) {
    ctx.fillStyle = PINK; ctx.strokeStyle = "#1B2733"; ctx.lineWidth = 3;
    rr(ctx, -27, 9, 54, 11, 5); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, 15); ctx.lineTo(19, 15); ctx.lineTo(22, 40); ctx.lineTo(13, 41); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10, 15); ctx.lineTo(5, 36); ctx.lineTo(12, 38); ctx.lineTo(16, 16); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  // ikon syal (dilihat dari depan): lingkar syal berbentuk U + simpul + dua ujung yang menjuntai
  function scarfIconPart(ctx) {
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = "#1B2733"; ctx.lineWidth = 17; ctx.beginPath(); ctx.arc(0, -16, 24, 0.08 * Math.PI, 0.92 * Math.PI); ctx.stroke();
    ctx.strokeStyle = PINK; ctx.lineWidth = 11; ctx.beginPath(); ctx.arc(0, -16, 24, 0.08 * Math.PI, 0.92 * Math.PI); ctx.stroke();
    ctx.fillStyle = PINK; ctx.strokeStyle = "#1B2733"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(4, 8); ctx.lineTo(-2, 34); ctx.lineTo(7, 36); ctx.lineTo(12, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10, 8); ctx.lineTo(16, 33); ctx.lineTo(25, 30); ctx.lineTo(17, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(10, 6, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  function beaver(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
    if (o.alpha != null) ctx.globalAlpha = o.alpha;
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, 24, 32, 27, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();       // badan
    ctx.fillStyle = FUR2; ctx.beginPath(); ctx.ellipse(0, 30, 19, 17, 0, 0, Math.PI * 2); ctx.fill();                     // perut
    ctx.fillStyle = FUR; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 15, 49, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, Math.PI * 2); ctx.fillStyle = FUR; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * 23, -37, 3.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();                 // kepala
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();               // moncong
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();            // hidung
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();                                                  // gigi
    if (!o.glasses) { ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -23, 4, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -24.4, 1.4, 0, Math.PI * 2); ctx.fill(); } }
    if (o.scarf) scarfPart(ctx);
    if (o.glasses) glassesPart(ctx);
    if (o.hat) hatPart(ctx);
    ctx.restore();
    if (o.label) {   // huruf nama: lencana bulat di bawah
      const r = Math.max(16, s * 0.15), by = y + s * 0.62 + r * 0.4;
      ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x, by, r, 0, Math.PI * 2); ctx.fill();
      text(ctx, o.label, x, by + r * 0.38, r * 1.15, { align: "center", color: "#fff", weight: 900 }); ctx.restore();
    }
  }
  const WHO = { A: { scarf: 1 }, B: { glasses: 1 }, C: { glasses: 1, hat: 1 }, P: {} };
  const ITEM = ["glasses", "hat", "scarf"];
  const ITEM_NAMA = { glasses: "kacamata hitam", hat: "topi", scarf: "syal" };
  const has = (w, it) => !!WHO[w][it];
  // ikon benda saja (untuk kotak pertanyaan dan tabel); s = lebar ikon
  function itemIcon(ctx, it, x, y, s) {
    ctx.save(); ctx.translate(x, y);
    if (it === "glasses") { ctx.scale(s / 54, s / 54); ctx.translate(0, 23.5); glassesPart(ctx); }
    else if (it === "hat") { ctx.scale(s / 64, s / 64); ctx.translate(0, 49); hatPart(ctx); }
    else { ctx.scale(s / 64, s / 64); ctx.translate(0, -6); scarfIconPart(ctx); }
    ctx.restore();
  }
  // posisi benda pada berang-berang (untuk dilingkari)
  const ITEM_POS = { glasses: [0, -24, 34, 14], hat: [0, -50, 34, 20], scarf: [2, 22, 34, 24] };
  function ringItem(ctx, x, y, s, it, u) { const [dx, dy, rx, ry] = ITEM_POS[it], k = s / 100; ring(ctx, x + dx * k, y + dy * k, rx * k + 10, ry * k + 10, u); }

  // ---------- tabel benda ----------
  // marks: {glasses: u, hat: u, scarf: u} (0..1 = tanda tergambar), hi: benda yang disorot
  function itemTable(ctx, x, y, w, who, marks, opt = {}) {
    const rh = opt.rh || 76;
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 3.5; rr(ctx, x, y, w, rh * 3, 12); ctx.fill(); ctx.stroke();
    ITEM.forEach((it, i) => {
      const ry = y + i * rh;
      if (opt.hi === it) { ctx.fillStyle = "rgba(238,122,18,0.18)"; rr(ctx, x + 4, ry + 4, w - 8, rh - 8, 9); ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; rr(ctx, x + 4, ry + 4, w - 8, rh - 8, 9); ctx.stroke(); }
      if (i) { ctx.strokeStyle = "#AEB8BF"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 10, ry); ctx.lineTo(x + w - 10, ry); ctx.stroke(); }
      itemIcon(ctx, it, x + w * 0.3, ry + rh / 2 + (it === "hat" ? 5 : 0), rh * (it === "glasses" ? 1.05 : 0.9));
      ctx.strokeStyle = "#AEB8BF"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w * 0.62, ry + 8); ctx.lineTo(x + w * 0.62, ry + rh - 8); ctx.stroke();
      const u = marks ? (marks[it] ?? 0) : 0;
      if (u > 0) { if (has(who, it)) tick(ctx, x + w * 0.81, ry + rh / 2, rh * 0.62, u); else cross(ctx, x + w * 0.81, ry + rh / 2, rh * 0.5, u); }
    });
  }

  // ---------- pohon keputusan (sama persis strukturnya dengan soal) ----------
  const N = { r: [960, 200], h: [660, 370], s: [1260, 370], c1: [510, 600], c2: [810, 600], c3: [1110, 600], c4: [1410, 600] };
  const BW = 176, BH = 100, R = 64;
  const BOXITEM = { r: "glasses", h: "hat", s: "scarf" };
  // tepi: [asal, tujuan, ya?]
  const E = { rh: ["r", "h", true], rs: ["r", "s", false], h1: ["h", "c1", true], h2: ["h", "c2", false], s3: ["s", "c3", true], s4: ["s", "c4", false] };
  const ROUTE = { A: ["rs", "s3"], B: ["rh", "h2"], C: ["rh", "h1"], P: ["rs", "s4"] };
  const DEST = { A: "c3", B: "c2", C: "c1", P: "c4" };
  function edgePts(k) {
    const [a, b] = E[k], [ax, ay] = N[a], [bx, by] = N[b];
    const y0 = ay + BH / 2 + 4, y1 = b[0] === "c" ? by - R - 6 : by - BH / 2 - 6;
    return [[ax, y0], [bx, y1]];
  }
  function tagPos(k) { const p = edgePts(k); return ptAt(p, 0.42); }
  // tokens: posisi berdiri di samping kotak (supaya gambar kotak tidak tertutup)
  const SIDE = { r: [790, 200], h: [500, 362], s: [1420, 362] };   // token tidak pernah berhenti di atas ikon kotak

  function tree(ctx, st) {
    const draw = st.draw == null ? 1 : st.draw;                   // animasi menggambar pohon (0..1)
    const seq = ["r", "rh", "rs", "h", "s", "h1", "h2", "s3", "s4", "c1", "c2", "c3", "c4"];
    const part = k => clamp(draw * seq.length - seq.indexOf(k), 0, 1);
    // tepi
    for (const k in E) {
      const u = part(k); if (u <= 0) continue;
      const shimmer = st.edgeGlow && st.edgeGlow[k] || 0;
      mline(ctx, edgePts(k), u, INK, 5, true);
      if (shimmer > 0) mline(ctx, edgePts(k), 1, `rgba(238,122,18,${0.9 * shimmer})`, 10, true);
      const hp = st.path && st.path[k];
      if (hp > 0) mline(ctx, edgePts(k), hp, ORANGE, 11, true);
    }
    // tanda ✓/✗ di tepi (kotak abu-abu kecil, seperti di soal)
    for (const k in E) {
      const u = part(k); if (u < 1) continue;
      const [x, y] = tagPos(k), pulse = st.tagPulse ? 1 + 0.12 * st.tagPulse * Math.sin(st.l * 8) : 1, dim = st.dimEdge && st.dimEdge[k];
      ctx.save(); if (dim) ctx.globalAlpha = 0.35;
      ctx.fillStyle = BOXF; ctx.strokeStyle = "#9AA6AE"; ctx.lineWidth = 2; rr(ctx, x - 34 * pulse, y - 24 * pulse, 68 * pulse, 48 * pulse, 10); ctx.fill(); ctx.stroke();
      if (E[k][2]) tick(ctx, x, y, 40 * pulse, 1, GREEN, 7); else cross(ctx, x, y, 32 * pulse, 1, RED, 7);
      ctx.restore();
    }
    // kotak pertanyaan
    for (const k of ["r", "h", "s"]) {
      const u = part(k); if (u <= 0) continue;
      const [x, y] = N[k], g = st.glow && st.glow[k] || 0, dim = st.dimBox && st.dimBox[k] || 0;
      ctx.save(); ctx.globalAlpha = u * (1 - 0.6 * dim);
      if (g > 0) { ctx.fillStyle = `rgba(238,122,18,${0.25 * g})`; rr(ctx, x - BW / 2 - 14, y - BH / 2 - 14, BW + 28, BH + 28, 18); ctx.fill(); }
      ctx.fillStyle = BOXF; rr(ctx, x - BW / 2, y - BH / 2, BW, BH, 10); ctx.fill();
      ctx.strokeStyle = g > 0 ? ORANGE : "#8F9AA2"; ctx.lineWidth = g > 0 ? 6 : 3; rr(ctx, x - BW / 2, y - BH / 2, BW, BH, 10); ctx.stroke();
      itemIcon(ctx, BOXITEM[k], x, y + (k === "h" ? 8 : 0), k === "r" ? 120 : k === "h" ? 100 : 84);
      ctx.restore();
    }
    // lingkaran
    ["c1", "c2", "c3", "c4"].forEach((k, i) => {
      const u = part(k); if (u <= 0) return;
      const [x, y] = N[k], g = st.glowC && st.glowC[k] || 0, num = i + 1;
      if (g > 0) { ctx.fillStyle = `rgba(238,122,18,${0.22 * g})`; ctx.beginPath(); ctx.arc(x, y, R + 16, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
      mline(ctx, Array.from({ length: 41 }, (_, j) => [x + R * Math.cos(-Math.PI / 2 + j / 40 * Math.PI * 2), y + R * Math.sin(-Math.PI / 2 + j / 40 * Math.PI * 2)]), u, g > 0 ? ORANGE : INK, g > 0 ? 6 : 4);
      if (u < 1) return;
      const occ = st.fill && st.fill[num], arriving = st.arriving === num;
      if (num === 4) { if (!st.c4empty) beaver(ctx, x, y + 4, 104, {}); }
      else if (occ) {
        beaver(ctx, x, y + 2, 92, { ...WHO[occ] });
        const lx = x + R * 0.72, ly = y + R * 0.72;   // lencana huruf di kanan bawah lingkaran
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(lx, ly, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, occ, lx, ly + 10, 28, { align: "center", color: "#fff", weight: 900 });
      }
      if (num <= 3) {
        if (occ || arriving) { // nomor pindah ke lencana kecil di kiri atas
          const nx = x - R * 0.75, ny = y - R * 0.75; ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          text(ctx, String(num), nx, ny + 10, 28, { align: "center", weight: 900 });
        } else {
          const ps = st.numPulse ? 1 + 0.12 * st.numPulse * Math.max(0, Math.sin(st.l * 7)) : 1;
          text(ctx, String(num), x, y + 24 * ps, 66 * ps, { align: "center", weight: 800, color: INK });
        }
      }
      if (st.okC && st.okC[k] > 0) tick(ctx, x + R + 18, y - R + 8, 44, st.okC[k], GREEN, 8);
    });
  }

  // token berang-berang berjalan: pos = [x, y]
  function token(ctx, who, x, y, s = 86) {
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(x, y + s * 0.5, s * 0.36, s * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    beaver(ctx, x, y, s, { ...WHO[who] });
    if (who !== "P") { const lx = x + s * 0.42, ly = y + s * 0.36; ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(lx, ly, 18, 0, Math.PI * 2); ctx.fill(); text(ctx, who, lx, ly + 8, 22, { align: "center", color: "#fff", weight: 900 }); }
  }

  // ---------- lajur aturan, panel kanan ----------
  const RULES = ["Mulai dari kotak paling atas", "Jawab, lalu ikuti panah yang cocok", "Berhenti di lingkaran"];
  function rulesStrip(ctx, n, opt = {}) {
    if (n <= 0) return;
    const y = 708, h = 74, gap = 16; ctx.font = `800 26px ${K.FONT}`;
    const ws = RULES.map(s => ctx.measureText(s).width + 92), tot = ws.reduce((a, b) => a + b, 0) + gap * 2;
    let x = 960 - tot / 2;
    RULES.forEach((s, i) => {
      const u = clamp(n - i, 0, 1); if (u <= 0) { x += ws[i] + gap; return; }
      const big = opt.big === i + 1 ? 1 : 0;
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, x, y, ws[i], h, { fill: big ? "#FFF1DF" : "#F3F6F8", stroke: big ? ORANGE : "#B8C3CA", lw: big ? 5 : 2.5, r: 37 });
      ctx.fillStyle = big ? ORANGE : C.kiko; ctx.beginPath(); ctx.arc(x + 38, y + h / 2, 24, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), x + 38, y + h / 2 + 10, 28, { align: "center", color: "#fff", weight: 900 });
      text(ctx, s, x + 72, y + h / 2 + 9, 26, { weight: 800, color: INK });
      ctx.restore(); x += ws[i] + gap;
    });
  }
  function qCard(ctx, q) {   // q: {who, it, ans (null | true | false), u}
    if (!q) return;
    ctx.save(); ctx.globalAlpha = q.u ?? 1;
    card(ctx, 1500, 150, 350, 300, { fill: "#FFFFFF", stroke: ORANGE, lw: 4, r: 18 });
    text(ctx, q.title || "PERTANYAAN", 1675, 192, 24, { align: "center", weight: 900, color: C.accentDark });
    const subj = q.who && q.who !== "P" ? q.who : "dia";
    const s = q.text || `Apakah ${subj} memakai ${ITEM_NAMA[q.it]}?`;
    const lines = wrap(ctx, s, 32, 800, 310); lines.forEach((ln, i) => text(ctx, ln, 1675, 244 + i * 40, 32, { align: "center", weight: 800, color: INK }));
    if (q.it && !q.text) { ctx.save(); ctx.globalAlpha *= 1 - clamp(q.ansU || 0, 0, 1); itemIcon(ctx, q.it, 1675, 244 + lines.length * 40 + (q.it === "hat" ? 34 : 18), 70); ctx.restore(); }
    if (q.ans != null && q.ansU > 0) {
      ctx.globalAlpha = (q.u ?? 1) * clamp(q.ansU, 0, 1);
      const ok = q.ans; card(ctx, 1540, 372, 270, 62, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? GREEN : RED, lw: 4, r: 31 });
      if (ok) tick(ctx, 1590, 403, 36, 1, GREEN, 7); else cross(ctx, 1590, 403, 28, 1, RED, 7);
      text(ctx, ok ? "YA" : "TIDAK", 1700, 415, 36, { align: "center", weight: 900, color: ok ? GREEN : RED });
    }
    ctx.restore();
  }
  function ansCard(ctx, ans, opt = {}) {   // ans: {1:'C', ...}; opt.u alpha; opt.fresh: nomor yang baru ditulis (0..1)
    ctx.save(); ctx.globalAlpha = opt.u ?? 1;
    card(ctx, 1500, 470, 350, 220, { fill: "#FFFFFF", stroke: "#B8C3CA", lw: 3, r: 18 });
    text(ctx, "JAWABAN", 1675, 510, 24, { align: "center", weight: 900, color: C.ink2 });
    [1, 2, 3].forEach((n, i) => {
      const y = 560 + i * 50, v = ans && ans[n];
      text(ctx, `Lingkaran ${n} =`, 1530, y, 30, { weight: 800, color: INK });
      if (v) { const fu = opt.fresh && opt.fresh[n] != null ? opt.fresh[n] : 1; hand(ctx, v, 1790, y + 2, 40, { color: ORANGE, alpha: fu }); if (fu < 1) ring(ctx, 1790, y - 12, 26, 24, fu, ORANGE, 3); }
      else text(ctx, "?", 1790, y, 34, { align: "center", weight: 900, color: "#9AA6AE" });
    });
    ctx.restore();
  }
  function thinkTimer(ctx, l, d) {   // jam pasir + "Pikirkan dulu"
    card(ctx, 1500, 150, 350, 300, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    text(ctx, "PIKIRKAN DULU", 1675, 200, 32, { align: "center", weight: 900, color: C.accentDark });
    const frac = clamp(l / d, 0, 1);
    ctx.strokeStyle = "#E9DDBF"; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(1675, 320, 70, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1675, 320, 70, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    // jam pasir
    ctx.save(); ctx.translate(1675, 320); ctx.fillStyle = "#F4D58D"; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-26, -38); ctx.lineTo(26, -38); ctx.lineTo(4, 0); ctx.lineTo(26, 38); ctx.lineTo(-26, 38); ctx.lineTo(-4, 0); ctx.closePath(); ctx.stroke();
    const top = 1 - frac; ctx.beginPath(); ctx.moveTo(-22 * top, -34 + 30 * (1 - top)); ctx.lineTo(22 * top, -34 + 30 * (1 - top)); ctx.lineTo(0, -2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-22 * frac - 2, 36); ctx.lineTo(22 * frac + 2, 36); ctx.lineTo(0, 36 - 30 * frac); ctx.closePath(); ctx.fill();
    ctx.restore();
    text(ctx, "Ikuti panahnya dengan jarimu.", 1675, 430, 22, { align: "center", weight: 700, color: C.ink2 });
  }
  // panel kiri: berang-berang yang ditelusuri + tabel
  function leftPanel(ctx, who, marks, hi, u = 1) {
    ctx.save(); ctx.globalAlpha = u;
    text(ctx, who === "P" ? "Berang-berang ini" : "Berang-berang " + who, 250, 168, 28, { align: "center", weight: 900, color: INK });
    beaver(ctx, 250, 322, 170, { ...WHO[who] });
    itemTable(ctx, 110, 452, 280, who, marks || { glasses: 1, hat: 1, scarf: 1 }, { hi, rh: 76 });
    ctx.restore();
  }

  // ---------- konfigurasi tiap beat pohon ----------
  // tr: penelusuran {who, ev: {q1, a1, m1, q2, a2, m2, done}} — nilai = frasa di narasi (null = sudah terjadi sebelum beat)
  const DONE = null;
  const ALL = { q1: DONE, a1: DONE, m1: DONE, q2: DONE, a2: DONE, m2: DONE, done: DONE };
  const CFG = {
    g1: { mode: "kenal", drawFrom: "lihat gambar" },
    g2: { mode: "kenal", boxBlink: true },
    g3: { mode: "kenal", glow: "r", ask: "glasses", askAt: "Kotak ini" },
    g4: { mode: "kenal", glow: "h", ask: "hat", askAt: "Kotak ini", side: ["kiri", "h"] },
    g5: { mode: "kenal", glow: "s", ask: "scarf", askAt: "Kotak ini", side: ["kanan", "s"] },
    g6: { mode: "kenal", leg: 1, legAt: "Tanda centang", tagPulse: true },
    g7: { mode: "kenal", leg: 2, legAt: "Panah menunjukkan", shimmer: true },
    g8: { mode: "kenal", leg: 2, demo: true },
    g9: { mode: "kenal", leg: 3, legAt: "Lingkaran itu", glowCAll: true },
    g10: { mode: "kenal", leg: 3, numPulse: true, glowC4: "Satu lingkaran" },
    g11: { mode: "kenal", leg: 0, task: true },
    g12: { mode: "kenal", task: true, rulesAnim: [0, 1, "Satu,"] },
    g13: { mode: "kenal", task: true, rulesAnim: [1, 3, "Dua,", "Tiga,"] },
    c1: { tr: { who: "P", ev: {} }, lift: true },
    c2: { tr: { who: "P", ev: { q1: "Apakah dia", a1: "Tidak.", m1: "Jadi," } }, lifted: true },
    c3: { tr: { who: "P", ev: { q1: DONE, a1: DONE, m1: DONE, q2: "Apakah dia", a2: "Tidak.", m2: "Jadi," } }, lifted: true },
    c4: { tr: { who: "P", ev: { ...ALL } }, home: "Itu memang" },
    a1: { tr: { who: "A", ev: {} }, tableRead: true },
    a2: { tr: { who: "A", ev: { q1: "Apakah A", a1: "Jawabannya" } } },
    a3: { tr: { who: "A", ev: { q1: DONE, a1: DONE, m1: "kita ikuti" } } },
    a4: { tr: { who: "A", ev: { q1: DONE, a1: DONE, m1: DONE, q2: "Apakah A", a2: "Jawabannya" } } },
    a5: { tr: { who: "A", ev: { q1: DONE, a1: DONE, m1: DONE, q2: DONE, a2: DONE, m2: "kita ikuti" } } },
    a6: { tr: { who: "A", ev: { ...ALL, done: "Jadi," } } },
    a7: { tr: { who: "A", ev: { ...ALL } }, dimHat: true },
    b1: { tr: { who: "B", ev: {} }, think: "Sekarang", hideTable: false },
    b2: { tr: { who: "B", ev: {} }, think: "B akan" },
    b3: { tr: { who: "B", ev: {} }, tableRead: true },
    b4: { tr: { who: "B", ev: { q1: "Apakah B", a1: "Jawabannya", m1: "Jadi," } } },
    b5: { tr: { who: "B", ev: { q1: DONE, a1: DONE, m1: DONE, q2: "Apakah B", a2: "Jawabannya", m2: "Jadi," } } },
    b6: { tr: { who: "B", ev: { ...ALL, done: "Jadi," } } },
    k1: { tr: { who: "C", ev: {} }, think: "Tinggal" },
    k2: { tr: { who: "C", ev: {} }, tableRead: true },
    k3: { tr: { who: "C", ev: {} }, confuse: true },
    k4: { tr: { who: "C", ev: {} }, ruleBig: 1, glowRoot: "Kita selalu" },
    k5: { tr: { who: "C", ev: { q1: "Apakah C", a1: "Jawabannya", m1: "Jadi," } } },
    k6: { tr: { who: "C", ev: { q1: DONE, a1: DONE, m1: DONE, q2: "Apakah C", a2: "Jawabannya", m2: "Jadi," } } },
    k7: { tr: { who: "C", ev: { ...ALL, done: "Jadi," } } },
    r1: { review: "semua", fillAt: ["Lingkaran satu", "Lingkaran dua", "Lingkaran tiga"] },
    r2: { review: "cek", okAt: ["Setiap lingkaran", "Tidak ada lingkaran", "Tidak ada berang"] },
    r3: { review: "naik" },
    r4: { review: "cocok" },
    r5: { review: "akhir" },
  };
  const BEFORE = { A: {}, B: { 3: "A" }, C: { 3: "A", 2: "B" } };   // jawaban yang sudah ditemukan sebelum berang-berang ini
  const ANS = { 1: "C", 2: "B", 3: "A" };

  // jalur token: menyusuri panah, lalu memutar di luar kotak (tidak melintas di atas ikon kotak)
  function route1(e1, mid) { const p = edgePts(e1), [sx, sy] = SIDE[mid]; return [SIDE.r, ptAt(p, 0.2), ptAt(p, 0.7), [sx, 280], [sx, sy]]; }
  function route2(e2, mid) { const p = edgePts(e2), [sx] = SIDE[mid]; return [SIDE[mid], [sx, 470], ptAt(p, 0.3), p[1], N[E[e2][1]]]; }
  function trace(ctx, b, l, cf) {
    const who = cf.tr.who, ev = cf.tr.ev, route = ROUTE[who];
    const tOf = k => !(k in ev) ? Infinity : ev[k] === DONE ? -99 : at(b, ev[k]);
    const on = k => l >= tOf(k);
    const MV = 2.2;
    const m1 = clamp((l - tOf("m1")) / MV, 0, 1), m2 = clamp((l - tOf("m2")) / MV, 0, 1);
    const e1 = route[0], e2 = route[1], mid = E[e1][1];
    const before = b.kosong ? {} : BEFORE[who];   // Short: A dan B belum dikerjakan saat C ditelusuri
    const fill = { ...before };
    if (who !== "P" && m2 >= 1 && ("m2" in ev)) fill[+DEST[who].slice(1)] = who;
    // keadaan pohon
    const path = {}; path[e1] = m1; path[e2] = m2;
    const glow = {};
    if (on("q1") && m1 <= 0) glow.r = 1;
    if (on("q2") && m2 <= 0) glow[mid] = 1;
    if (cf.glowRoot && l >= at(b, cf.glowRoot)) glow.r = 0.5 + 0.5 * Math.sin(l * 6);
    const dimBox = cf.dimHat ? { h: P(l, 0.3, 0.8) } : {};
    const glowC = {}; if (m2 >= 1) glowC[DEST[who]] = 1;
    if (cf.home && l >= at(b, cf.home)) glowC.c4 = 0.6 + 0.4 * Math.sin(l * 5);
    const arriving = m2 > 0.6 && m2 < 1 && who !== "P" ? +DEST[who].slice(1) : 0;
    tree(ctx, { l, path, glow, fill, glowC, dimBox, arriving, c4empty: who === "P" && !(m2 >= 1 && "m2" in ev) && !cf.home });
    // ya/tidak tulisan tangan di samping tepi yang dilalui
    [[e1, m1], [e2, m2]].forEach(([k, u]) => {
      if (u < 0.5) return; const [x, y] = tagPos(k), yes = E[k][2], left = N[E[k][1]][0] < N[E[k][0]][0];
      const a = clamp((u - 0.5) * 3, 0, 1);
      if (E[k][0] === "r") hand(ctx, yes ? "ya" : "tidak", x, y + 62, 36, { color: ORANGE, alpha: a });
      else hand(ctx, yes ? "ya" : "tidak", x + (left ? -48 : 48), y + 12, 36, { color: ORANGE, alpha: a, align: left ? "right" : "left" });
    });
    // token
    let pos;
    if (who === "P" && cf.lift) {   // keluar dari lingkaran 4 lalu naik ke kotak atas
      const u = P(l, 0.8, 2.4); pos = ptAt([N.c4, [1560, 470], [1560, 230], SIDE.r.map((v, i) => v + (i ? 0 : 0))], u);
      if (u < 0.02) pos = null;
    } else if (m2 > 0) pos = ptAt([...edgePts(e2)].concat([N[E[e2][1]]]).slice(0), m2);
    else if (m1 > 0) pos = ptAt(route1(e1, mid), m1);
    else pos = SIDE.r;
    if (who === "P" && cf.lift && pos == null) pos = null;
    if (m2 > 0) { // dari samping kotak tengah ke tepi lalu ke lingkaran
      pos = ptAt(route2(e2, mid), m2);
    }
    const inCircle = m2 >= 1;
    if (pos && !(inCircle && who !== "P")) {
      if (who === "P" && inCircle) { /* lingkaran 4 menggambar berang-berang polos sendiri */ } else token(ctx, who, pos[0], pos[1], inCircle ? 92 : 86);
    }
    // panel kiri
    const marks = { glasses: 1, hat: 1, scarf: 1 };
    let hi = null;
    if (on("q2") && m2 < 1) hi = BOXITEM[mid]; else if (on("q1") && m1 < 1) hi = "glasses";
    if (cf.tableRead) { const order = TXT(b).indexOf("tidak memakai kacamata") >= 0 ? null : null; const k = Math.floor(clamp((l - lead(b)) / ((b.audio || b.dur) / 3.2), 0, 2.99)); hi = ITEM[k]; }
    leftPanel(ctx, who, marks, hi);
    if (cf.confuse) { ringItem(ctx, 250, 322, 170, "glasses", P(l, at(b, "dari kacamata"), 0.7)); ringItem(ctx, 250, 322, 170, "hat", P(l, at(b, "dari topi"), 0.7)); hand(ctx, "?", 400, 262, 70, { color: ORANGE, alpha: P(l, at(b, "bingung"), 0.5) }); }
    // panel kanan
    if (cf.think) thinkTimer(ctx, l - at(b, cf.think), Math.max(4, b.dur - at(b, cf.think) - 0.4));
    else if (on("m2") && m2 >= 1) qCard(ctx, { title: "SAMPAI!", text: who === "P" ? "Sampai di lingkaran paling kanan." : `${who} sampai di lingkaran ${DEST[who].slice(1)}.` });
    else if (on("q2")) qCard(ctx, { who, it: BOXITEM[mid], ans: has(who, BOXITEM[mid]), ansU: P(l, tOf("a2"), 0.4) });
    else if (on("q1")) qCard(ctx, { who, it: "glasses", ans: has(who, "glasses"), ansU: P(l, tOf("a1"), 0.4) });
    else if (cf.ruleBig != null) qCard(ctx, { title: "INGAT", text: "Kita selalu mulai dari kotak paling atas." });
    const ans = { ...before }; const fresh = {};
    if (who !== "P" && "done" in ev && on("done")) { const n = +DEST[who].slice(1); ans[n] = who; fresh[n] = P(l, tOf("done"), 0.8); }
    if (who !== "P") ansCard(ctx, ans, { fresh });
    rulesStrip(ctx, 3, { big: cf.ruleBig != null ? cf.ruleBig + 1 : (on("q1") && m1 <= 0 ? 1 : (m1 > 0 && m1 < 1) || (m2 > 0 && m2 < 1) ? 2 : (m2 >= 1 ? 3 : 0)) });
  }

  function kenal(ctx, b, l, cf) {
    const drawU = cf.drawFrom ? clamp((l - 0.3) / 3.2, 0, 1) : 1;
    const glow = {}, glowC = {}, edgeGlow = {};
    if (cf.boxBlink) { ["r", "h", "s"].forEach((k, i) => { const t0 = at(b, "Setiap") + i * 0.9; if (l > at(b, "kotak abu")) glow[k] = l > t0 ? 1 : 0.0; }); }
    if (cf.glow) glow[cf.glow] = 1;
    if (cf.shimmer) { Object.keys(E).forEach((k, i) => { edgeGlow[k] = clamp(1 - Math.abs(l - at(b, "Panah") - i * 0.45) / 0.6, 0, 1); }); }
    if (cf.glowCAll) { const t0 = at(b, "Keempat"); ["c1", "c2", "c3", "c4"].forEach((k, i) => glowC[k] = clamp(1 - Math.abs(l - t0 - 0.8 - i * 0.6) / 0.7, 0, 1) + (l > at(b, cf.legAt) ? 0.0 : 0)); }
    if (cf.glowC4 && l > at(b, cf.glowC4)) glowC.c4 = 1;
    const path = {};
    let demoNote = null;
    if (cf.demo) {   // ya -> ikuti panah centang; tidak -> ikuti panah silang
      const t1 = at(b, "Kalau jawabannya ya"), t2 = at(b, "Kalau jawabannya tidak");
      path.rh = clamp((l - t1 - 0.6) / 1.6, 0, 1) * (l < t2 ? 1 : 0);
      path.rs = clamp((l - t2 - 0.6) / 1.6, 0, 1);
      if (l >= t1 && l < t2) demoNote = true; else if (l >= t2) demoNote = false;
    }
    tree(ctx, { l, draw: drawU, glow, glowC, edgeGlow, path, tagPulse: cf.tagPulse ? 1 : 0, numPulse: cf.numPulse ? 1 : 0 });
    if (cf.side) { const [w, k] = cf.side, [x, y] = N[k], u = P(l, at(b, "Kotak di"), 0.5); hand(ctx, w, k === "h" ? x - 100 : x + 100, y + 12, 40, { color: ORANGE, alpha: u, align: k === "h" ? "right" : "left" }); }
    // panel kiri: legenda
    const legN = cf.leg ?? 0;
    if (legN > 0) {
      const lu = cf.legAt ? P(l, at(b, cf.legAt), 0.6) : 1;
      const items = [
        g => { tick(ctx, 130, 210, 56, 1, GREEN, 9); text(ctx, "= ya", 175, 228, 46, { weight: 900, color: GREEN }); cross(ctx, 130, 300, 44, 1, RED, 9); text(ctx, "= tidak", 175, 318, 46, { weight: 900, color: RED }); },
        g => { mline(ctx, [[100, 410], [210, 410]], 1, INK, 6, true); text(ctx, "= jalan", 230, 425, 42, { weight: 900, color: INK }); },
        g => { ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(140, 520, 40, 0, Math.PI * 2); ctx.stroke(); text(ctx, "= tempat", 195, 515, 38, { weight: 900, color: INK }); text(ctx, "berhenti", 195, 560, 38, { weight: 900, color: INK }); },
      ];
      ctx.save(); card(ctx, 70, 160, 360, 450, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
      items.forEach((f, i) => { if (i >= legN) return; ctx.globalAlpha = i === legN - 1 ? lu : 1; f(); ctx.globalAlpha = 1; });
      ctx.restore();
    }
    // panel kanan: pertanyaan kotak / demo / tugas
    if (cf.ask) qCard(ctx, { title: "KOTAK INI BERTANYA", it: cf.ask, u: P(l, at(b, cf.askAt), 0.5) });
    if (demoNote != null) {
      card(ctx, 1500, 150, 350, 300, { fill: "#FFFFFF", stroke: ORANGE, lw: 4, r: 18 });
      const yes = demoNote;
      text(ctx, "KALAU JAWABANNYA", 1675, 200, 24, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, yes ? "YA" : "TIDAK", 1675, 268, 56, { align: "center", weight: 900, color: yes ? GREEN : RED });
      text(ctx, "ikuti panah", 1675, 330, 32, { align: "center", weight: 800, color: INK });
      card(ctx, 1641, 352, 68, 48, { fill: BOXF, stroke: "#9AA6AE", lw: 2, r: 10 });
      if (yes) tick(ctx, 1675, 376, 40, 1, GREEN, 7); else cross(ctx, 1675, 376, 32, 1, RED, 7);
    }
    if (cf.task) {   // tugas: tiga teman menunggu, jawaban kosong
      const u = P(l, 0.2, 0.6);
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, 70, 160, 360, 500, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
      text(ctx, "Cari rumahnya:", 250, 210, 30, { align: "center", weight: 900, color: INK });
      [["A", 160, 320], ["B", 340, 320], ["C", 250, 500]].forEach(([w, x, y]) => beaver(ctx, x, y, 124, { ...WHO[w], label: w }));
      ctx.restore();
      ansCard(ctx, {}, { u });
    }
    if (cf.rulesAnim) {
      const [n0, n1, ...ph] = cf.rulesAnim; let n = n0;
      ph.forEach((p, i) => { n = Math.max(n, n0 + clamp((l - at(b, p)) / 0.6, 0, 1) * (i + 1 === ph.length ? n1 - n0 - i : 1) + (i ? 1 : 0) * 0); });
      // n naik dari n0 ke n1 mengikuti frasa
      n = n0 + ph.reduce((s, p, i) => s + clamp((l - at(b, p)) / 0.6, 0, 1) * (i === ph.length - 1 ? (n1 - n0) - (ph.length - 1) : 1), 0);
      rulesStrip(ctx, n);
    }
  }

  function review(ctx, b, l, cf) {
    const st = { l, fill: { ...ANS }, glowC: {}, okC: {}, path: {} };
    if (cf.review === "semua") {
      cf.fillAt.forEach((p, i) => { const k = "c" + [1, 2, 3][i]; st.glowC[k] = clamp(1 - Math.abs(l - at(b, p) - 0.6) / 0.9, 0, 1); });
    }
    if (cf.review === "cek") {
      const t0 = at(b, cf.okAt[0]);
      ["c1", "c2", "c3"].forEach((k, i) => st.okC[k] = clamp((l - t0 - 0.8 - i * 0.7) / 0.5, 0, 1));
    }
    if (cf.review === "naik" || cf.review === "cocok") {   // dari lingkaran 1 naik ke atas
      const t0 = cf.review === "naik" ? at(b, "Jalan ke") : -9;
      const u = clamp((l - t0) / 2.6, 0, 1);
      st.path.h1 = clamp(u * 2, 0, 1); st.path.rh = clamp(u * 2 - 1, 0, 1); st.glowC.c1 = 1;
    }
    tree(ctx, st);
    if (cf.review === "naik" || cf.review === "cocok") {   // garis naik: gambar ulang terbalik (dari bawah)
      const u = cf.review === "naik" ? clamp((l - at(b, "Jalan ke")) / 2.6, 0, 1) : 1;
      if (u > 0.3) hand(ctx, "ya", tagPos("h1")[0] - 48, tagPos("h1")[1] + 12, 36, { alpha: clamp((u - 0.3) * 4, 0, 1), align: "right" });
      if (u > 0.8) hand(ctx, "ya", tagPos("rh")[0], tagPos("rh")[1] + 62, 36, { alpha: clamp((u - 0.8) * 5, 0, 1) });
    }
    if (cf.review === "cocok") {
      const t1 = at(b, "C memang");
      leftPanel(ctx, "C", { glasses: 1, hat: 1, scarf: 1 }, null);
      ringItem(ctx, 250, 322, 170, "glasses", P(l, at(b, "kacamata hitam"), 0.6)); ringItem(ctx, 250, 322, 170, "hat", P(l, at(b, "dan topi"), 0.6));
      const u = P(l, t1, 0.6);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; card(ctx, 1500, 150, 350, 300, { fill: C.goodBg, stroke: GREEN, lw: 4, r: 18 }); tick(ctx, 1675, 260, 110, P(l, t1, 0.8), GREEN, 16); text(ctx, "COCOK!", 1675, 400, 52, { align: "center", weight: 900, color: GREEN }); ctx.restore(); }
    } else if (cf.review === "naik") {
      const u = clamp((l - at(b, "Jalan ke")) / 2.6, 0, 1);
      card(ctx, 70, 160, 360, 300, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
      text(ctx, "Jalan ke lingkaran 1:", 250, 210, 28, { align: "center", weight: 900, color: INK });
      const g = P(l, at(b, "centang kacamata"), 0.6), h = P(l, at(b, "centang topi"), 0.6);
      if (g > 0) { itemIcon(ctx, "glasses", 160, 300, 90); tick(ctx, 290, 300, 60, g); }
      if (h > 0) { itemIcon(ctx, "hat", 160, 400, 84); tick(ctx, 290, 392, 60, h); }
    } else if (cf.review === "akhir") {
      card(ctx, 70, 160, 360, 520, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
      text(ctx, "Setiap langkah", 250, 215, 30, { align: "center", weight: 900, color: INK });
      text(ctx, "dicek dengan tabel", 250, 255, 30, { align: "center", weight: 900, color: INK });
      itemTable(ctx, 110, 300, 280, "C", { glasses: 1, hat: 1, scarf: 1 }, { rh: 78 });
      tick(ctx, 250, 600, 80, P(l, 1, 0.8), GREEN, 12);
    }
    if (cf.review !== "cocok") ansCard(ctx, ANS, {});
    else ansCard(ctx, ANS, {});
    rulesStrip(ctx, 3);
  }

  function pohon(ctx, b, l, t, TL) {
    board(ctx);
    const cf = CFG[b.id] || { mode: "kenal" };
    if (cf.tr) trace(ctx, b, l, cf);
    else if (cf.review) review(ctx, b, l, cf);
    else kenal(ctx, b, l, cf);
  }

  // ---------- adegan lain ----------
  function capHat(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s / 64, s / 64); ctx.translate(0, 49); hatPart(ctx); ctx.restore(); }

  // soal utuh di awal video: tiga berang-berang, gambar bercabang, dan pertanyaannya
  function soal(ctx, b, l, t, TL) {
    board(ctx);
    const first = b.id === "soal1";
    const tu = first ? P(l, at(b, "Ada juga"), 0.8) : 1;
    const glowC = {};
    if (first) ["c1", "c2", "c3"].forEach((k, i) => glowC[k] = clamp(1 - Math.abs(l - at(b, "bernomor") - 0.6 - i * 0.6) / 0.6, 0, 1));
    if (tu > 0) { ctx.save(); ctx.globalAlpha = tu; tree(ctx, { l, glowC }); ctx.restore(); }
    const bu = first ? P(l, at(b, "Ada tiga"), 0.6) : 1;
    ctx.save(); ctx.globalAlpha = bu;
    card(ctx, 70, 160, 360, 500, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "Tiga teman baru:", 250, 210, 30, { align: "center", weight: 900, color: INK });
    [["A", 160, 320], ["B", 340, 320], ["C", 250, 500]].forEach(([w, x, y]) => beaver(ctx, x, y, 124, { ...WHO[w], label: w }));
    ctx.restore();
    const qu = first ? 0 : P(l, at(b, "Pertanyaannya"), 0.6);
    if (qu > 0) {
      qCard(ctx, { title: "PERTANYAAN", text: "Berang-berang mana yang masuk lingkaran 1, 2, dan 3?", u: qu });
      ansCard(ctx, {}, { u: qu });
    }
  }

  // soal untuk layar vertikal (Short): tiga berang-berang besar di atas, gambar bercabang di bawah; potong [460, 130, 1000, 700]
  function soal_v(ctx, b, l, t, TL) {
    board(ctx);
    [["A", 640], ["B", 960], ["C", 1280]].forEach(([w, x]) => beaver(ctx, x, 245, 170, { ...WHO[w], label: w }));
    ctx.save(); ctx.translate(960, 440); ctx.scale(0.68, 0.68); ctx.translate(-960, -150); tree(ctx, { l }); ctx.restore();
  }

  Object.assign(K.SCENES, {
    pohon, soal, soal_v,
    buka(ctx, b, l, t, TL) {
      board(ctx);
      const first = b.id === "intro1";
      const u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.globalAlpha = 1;
      // tulisan spidol "Tantangan Bebras"
      ctx.save(); ctx.beginPath(); ctx.rect(560, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1180, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[640, 330], [1720, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      ctx.restore();
      // berang-berang kecil + teman-teman di seluruh dunia (kartu kecil berisi berang-berang)
      const bu = first ? P(l, at(b, "lomba"), 0.8) : 1;
      [[820, 560, {}], [1060, 560, {}], [1300, 560, {}], [1540, 560, {}]].forEach(([x, y, o], i) => {
        const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, y + (1 - v) * 30, 190, { ...o, alpha: v });
      });
      if (!first) { hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1180, 760, 40, { color: ORANGE, alpha: P(l, at(b, "pelan"), 0.6) }); }
      kiko(ctx, 300, 520, 230, 0, { wave: l, mood: "happy" });
    },
    kredit(ctx, b, l, t, TL) {
      board(ctx);
      const u = P(l, 0.2, 0.6);
      ctx.save(); ctx.globalAlpha = u;
      // ikon bola dunia (tanpa peta benua, supaya tidak keliru)
      const gx = 420, gy = 470, gr = 170;
      ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
      ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
      for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
      ctx.restore();
      const rows = [["Judul soal", "Mengenali Wajah"], ["Judul asli", "Remembering Face"], ["Tahun", "Bebras 2022"], ["Dibuat oleh", "Tim Bebras Australia"], ["Kode soal", "2022-AU-02"]];
      const keys = ["berjudul", "berjudul", "berasal", "dibuat oleh", "dibuat oleh"];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v], i) => {
        const a = P(l, at(b, keys[i]) + (i === 1 || i === 4 ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: i === 3 ? ORANGE : INK });
        ctx.restore();
      });
      const au = P(l, at(b, "Australia"), 0.8); if (au > 0) ring(ctx, 1195, 572, 250, 44, au);
    },
    tebak(ctx, b, l, t, TL) {
      board(ctx);
      const id = b.id, step = { p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6, p7: 7 }[id] || 1;
      if (step === 7) {   // papan dihapus, lalu gambar soal muncul
        const w = P(l, at(b, "Bedanya"), 1.4);
        if (w < 1) {
          ctx.save(); ctx.globalAlpha = 1 - w;
          kid(ctx, 760, 470, 150, { point: false }); capHat(ctx, 760, 392, 132);
          kid(ctx, 1160, 470, 150, { hair: "long" });
          ctx.restore();
          // penghapus
          if (w > 0) { const ex = lerp(500, 1450, w); ctx.fillStyle = "#4B5A66"; rr(ctx, ex - 90, 400, 180, 70, 12); ctx.fill(); ctx.fillStyle = "#E9E3D2"; rr(ctx, ex - 90, 460, 180, 26, 8); ctx.fill(); }
        }
        if (w > 0.6) { ctx.save(); ctx.globalAlpha = clamp((w - 0.6) * 2.5, 0, 1); ctx.translate(960, 450); ctx.scale(0.62, 0.62); ctx.translate(-960, -420); tree(ctx, { l }); ctx.restore(); }
        kiko(ctx, 230, 600, 170, 0, { mood: "happy" });
        return;
      }
      const u2 = step >= 3 ? 1 : P(l, at(b, "Di papan"), 0.6);
      // Dito (memakai topi) dan Sinta (tidak memakai topi)
      const sintaDim = step >= 5 ? (step === 5 ? P(l, at(b, "yang memakai topi"), 0.6) : 1) : 0;
      ctx.save(); ctx.globalAlpha = step === 1 ? P(l, 0.5, 0.8) : u2;
      kid(ctx, 760, 470, 150, {}); capHat(ctx, 760, 392, 132);
      text(ctx, "Dito", 760, 700, 44, { align: "center", weight: 900, color: INK });
      ctx.globalAlpha *= 1 - 0.6 * sintaDim;
      kid(ctx, 1160, 470, 150, { hair: "long" });
      text(ctx, "Sinta", 1160, 700, 44, { align: "center", weight: 900, color: INK });
      ctx.restore();
      if (sintaDim > 0) cross(ctx, 1260, 370, 50, sintaDim, RED, 8);
      if (step >= 5) { const ru = step === 5 ? P(l, at(b, "Jadi"), 0.8) : 1; ring(ctx, 760, 510, 170, 240, ru); }
      if (step >= 6) { hand(ctx, "1 pertanyaan saja!", 960, 800, 44, { color: GREEN, alpha: P(l, at(b, "hanya dengan"), 0.5) }); }
      // Kiko + gelembung
      kiko(ctx, 260, 560, 190, 0, { mood: "happy", wave: step === 1 ? l : undefined });
      if (step === 2) H.bubble(ctx, 130, 410, 260, "Aku memikirkan... siapa ya?", 30, { tailX: 250 });
      if (step === 3) {
        card(ctx, 1450, 230, 380, 200, { fill: "#FFFFFF", stroke: "#B7C7BF", lw: 3, r: 18 });
        text(ctx, "Kiko hanya menjawab:", 1640, 285, 26, { align: "center", weight: 800, color: C.ink2 });
        const u = P(l, at(b, "\"ya\""), 0.5), v = P(l, at(b, "\"tidak\""), 0.5);
        ctx.save(); ctx.globalAlpha = u; tick(ctx, 1520, 360, 46, 1, GREEN, 8); text(ctx, "ya", 1555, 375, 40, { weight: 900, color: GREEN }); ctx.restore();
        ctx.save(); ctx.globalAlpha = v; cross(ctx, 1670, 360, 36, 1, RED, 8); text(ctx, "tidak", 1705, 375, 40, { weight: 900, color: RED }); ctx.restore();
      }
      if (step >= 4) {
        const qa = step === 4 ? P(l, at(b, "Apakah"), 0.5) : 1, aa = step === 4 ? P(l, at(b, "Aku jawab"), 0.5) : 1;
        ctx.save(); ctx.globalAlpha = qa;
        card(ctx, 1450, 200, 390, 250, { fill: "#FFFFFF", stroke: ORANGE, lw: 4, r: 18 });
        text(ctx, "Pertanyaanmu:", 1645, 248, 26, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, "Pakai topi?", 1645, 310, 46, { align: "center", weight: 900, color: INK });
        ctx.globalAlpha = qa * aa;
        card(ctx, 1525, 350, 240, 66, { fill: C.goodBg, stroke: GREEN, lw: 4, r: 33 }); tick(ctx, 1575, 382, 38, 1, GREEN, 7);
        text(ctx, "YA", 1680, 396, 40, { align: "center", weight: 900, color: GREEN });
        ctx.restore();
      }
    },
    teman(ctx, b, l, t, TL) {
      board(ctx);
      const id = b.id, X = { A: 480, B: 960, C: 1440 }, Y = 330, S = 200;
      const cur = { t3: "A", t4: "B", t5: "C" }[id];
      // urutan tanda pada tabel, mengikuti kalimat narasi
      const MARK = {
        A: [["scarf", "memakai syal"], ["glasses", "tidak memakai kacamata"], ["hat", "juga tidak memakai topi"]],
        B: [["glasses", "memakai kacamata"], ["hat", "tidak memakai topi"], ["scarf", "juga tidak memakai syal"]],
        C: [["glasses", "memakai kacamata"], ["hat", "juga memakai topi"], ["scarf", "tidak memakai syal"]],
      };
      const order = ["A", "B", "C"], ci = cur ? order.indexOf(cur) : (id === "t6" ? 3 : -1);
      order.forEach((w, i) => {
        const appear = id === "t1" ? P(l, at(b, "Ketiganya") + i * 0.7, 0.6) : 1;
        if (appear <= 0) return;
        const dim = cur && w !== cur ? 0.35 : 1;
        beaver(ctx, X[w], Y + (1 - appear) * 40, S, { ...WHO[w], label: w, alpha: appear * dim });
        // tabel
        const tu = id === "t1" ? 0 : id === "t2" ? P(l, at(b, "Lihat baik"), 0.6) : 1;
        if (tu > 0) {
          const marks = {};
          if (i < ci) ITEM.forEach(it => marks[it] = 1);
          if (w === cur) MARK[w].forEach(([it, ph]) => marks[it] = P(l, at(b, ph) + 0.3, 0.6));
          ctx.save(); ctx.globalAlpha = tu * (dim < 1 ? 0.55 : 1);
          if (id === "t6") { ctx.fillStyle = "rgba(238,122,18,0.16)"; rr(ctx, X[w] - 160, 524, 320, 272, 16); ctx.fill(); }
          itemTable(ctx, X[w] - 150, 534, 300, w, marks, { rh: 84 });
          ctx.restore();
        }
        if (w === cur) MARK[w].forEach(([it, ph]) => { if (has(w, it)) ringItem(ctx, X[w], Y, S, it, P(l, at(b, ph), 0.7)); });
      });
    },
    terbalik(ctx, b, l, t, TL) {
      board(ctx);
      // kiri: gambar soal kecil; kanan: pohon yang dibalik (batang di atas, cabang ke bawah)
      ctx.save(); ctx.translate(560, 470); ctx.scale(0.58, 0.58); ctx.translate(-960, -430); tree(ctx, { l, fill: { ...ANS } }); ctx.restore();
      hand(ctx, "pohon keputusan", 560, 760, 44, { color: ORANGE, alpha: P(l, at(b, "pohon keputusan"), 0.6) });
      const rot = P(l, at(b, "seperti pohon"), 1.6) * Math.PI;
      ctx.save(); ctx.translate(1400, 470); ctx.rotate(rot);
      // pohon: batang + cabang + daun bulat
      ctx.strokeStyle = "#7A4E2D"; ctx.lineCap = "round";
      ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(0, 230); ctx.lineTo(0, 60); ctx.stroke();
      ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, 80); ctx.lineTo(-120, -40); ctx.moveTo(0, 80); ctx.lineTo(120, -40); ctx.stroke();
      ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-120, -40); ctx.lineTo(-180, -150); ctx.moveTo(-120, -40); ctx.lineTo(-60, -150); ctx.moveTo(120, -40); ctx.lineTo(60, -150); ctx.moveTo(120, -40); ctx.lineTo(180, -150); ctx.stroke();
      ctx.fillStyle = "#4FB36B"; for (const x of [-180, -60, 60, 180]) { ctx.beginPath(); ctx.arc(x, -170, 46, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
      hand(ctx, rot > 3 ? "pohon terbalik" : "pohon", 1400, 790, 40, { color: INK });
      if (rot > 3) { hand(ctx, "batang di atas", 1440, 230, 28, { color: C.ink2, align: "left" }); hand(ctx, "cabang ke bawah", 1590, 470, 28, { color: C.ink2, align: "left" }); }
    },
    komputer(ctx, b, l, t, TL) {
      board(ctx);
      kiko(ctx, 330, 500, 240, 0, { mood: "happy" });
      // layar komputer generik dengan pertanyaan ya/tidak satu per satu
      ctx.fillStyle = "#2B3440"; rr(ctx, 640, 170, 1100, 600, 24); ctx.fill();
      ctx.fillStyle = "#F4F8FB"; rr(ctx, 670, 200, 1040, 540, 14); ctx.fill();
      const steps = [["Pakai kacamata hitam?", true], ["Pakai topi?", true]];
      const t0 = at(b, "Komputer bertanya");
      steps.forEach(([q, a], i) => {
        const u = P(l, t0 + i * 1.6, 0.5), v = P(l, t0 + i * 1.6 + 0.8, 0.5); if (u <= 0) return;
        const y = 280 + i * 140;
        ctx.save(); ctx.globalAlpha = u; text(ctx, (i + 1) + ". " + q, 720, y, 44, { weight: 800, color: INK });
        ctx.globalAlpha = v; card(ctx, 1460, y - 46, 200, 64, { fill: C.goodBg, stroke: GREEN, lw: 4, r: 32 }); tick(ctx, 1505, y - 14, 34, 1, GREEN, 7); text(ctx, "YA", 1590, y + 1, 36, { align: "center", weight: 900, color: GREEN });
        ctx.restore();
      });
      const fu = P(l, t0 + 3.6, 0.6);
      if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; card(ctx, 720, 580, 940, 110, { fill: "#FFF1DF", stroke: ORANGE, lw: 4, r: 18 }); text(ctx, "Hasil: lingkaran 1", 1190, 652, 48, { align: "center", weight: 900, color: ORANGE }); ctx.restore(); }
    },
    aturan(ctx, b, l, t, TL) {
      board(ctx);
      text(ctx, "TIGA ATURAN", 960, 210, 40, { align: "center", weight: 900, color: C.accentDark });
      const R3 = [["Mulailah dari atas.", "Mulailah"], ["Jawab pertanyaannya.", "Jawab"], ["Ikuti panahnya sampai ke lingkaran.", "Ikuti"]];
      R3.forEach(([s, ph], i) => {
        const u = P(l, at(b, ph), 0.6); if (u <= 0) return;
        const y = 270 + i * 165;
        ctx.save(); ctx.globalAlpha = u; card(ctx, 260, y, 1400, 130, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 3, r: 65 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(330, y + 65, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 330, y + 84, 54, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 410, y + 82, 50, { weight: 900, color: INK });
        // ikon kecil di kanan
        if (i === 0) { ctx.fillStyle = BOXF; rr(ctx, 1500, y + 30, 90, 56, 10); ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; rr(ctx, 1500, y + 30, 90, 56, 10); ctx.stroke(); itemIcon(ctx, "glasses", 1545, y + 58, 60); }
        if (i === 1) { tick(ctx, 1515, y + 65, 46, 1, GREEN, 8); cross(ctx, 1580, y + 65, 36, 1, RED, 8); }
        if (i === 2) { mline(ctx, [[1500, y + 30], [1540, y + 70]], 1, INK, 6, true); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(1568, y + 96, 22, 0, Math.PI * 2); ctx.stroke(); }
        ctx.restore();
      });
    },
    akhir(ctx, b, l, t, TL) {
      board(ctx);
      kiko(ctx, 330, 470, 220, 0, { wave: l, mood: "happy" });
      [["A", 640], ["B", 840], ["C", 1040]].forEach(([w, x], i) => beaver(ctx, x, 420 + Math.sin(l * 3 + i) * 8, 170, { ...WHO[w], label: w }));
      card(ctx, 1180, 170, 650, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1505, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", "Remembering Face"], ["", "(Mengenali Wajah)"], ["Bebras:", "2022"], ["Kontributor:", "Australia"], ["Kode soal:", "2022-AU-02"]];
      L.forEach(([k, v], i) => { const y = 310 + i * 66; if (k) text(ctx, k, 1220, y, 28, { weight: 700, color: C.ink2 }); text(ctx, v, 1440, y, 32, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 370 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1505, 680, 26, 580, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 840, 700, 54, { color: ORANGE, alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    // ajakan di akhir Short (dipotong dari kanvas 1920x1080)
    cta_bebras(ctx, b, l, t, TL) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "Mengenali Teman Baru", 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras 2022-AU-02 · Australia", 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Langkah demi langkah untuk A, B, dan C", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      [["A", 760], ["B", 960], ["C", 1160]].forEach(([w, x]) => beaver(ctx, x, 640, 150, { ...WHO[w], label: w }));
    },
  });
  K.bebras = { beaver, itemIcon, tree, WHO };
})(typeof window !== "undefined" ? window : globalThis);
