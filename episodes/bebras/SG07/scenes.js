/* SG07 Pembahasan Soal Bebras 2025-ID-04a "Meja Makan Bundar" (Indonesia), kategori Siaga.
   Gaya papan tulis putih dengan coretan spidol (sama dengan SG01–SG04) + simulasi:
   meja bundar dilihat dari atas, empat berang-berang (dilihat dari atas, menghadap meja) dengan label tangan kiri/kanan,
   meja diputar supaya berang-berang yang dibicarakan duduk di bawah. Nama selalu tegak; kiri biru, kanan oranye.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WORD = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = T.indexOf(s, from);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); i = 0; }
    return atI(b, i);
  };
  // frasa berurutan: waktu tiap frasa dicari setelah frasa sebelumnya
  const atSeq = (b, list, from = "") => {
    const T = TXT(b); let p = from ? Math.max(0, T.indexOf(from)) : 0; const out = [];
    list.forEach(s => { const i = T.indexOf(s, p); if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); out.push(atI(b, p)); } else { out.push(atI(b, i)); p = i + s.length; } });
    return out;
  };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));
  // urutan beat: beat sebelumnya dalam satu adegan dianggap selesai (nilai 1)
  function prog(order, b, l) {
    const k = order.indexOf(b.id);
    return (id, fn) => { const j = order.indexOf(id); if (j < 0) return 0; if (j < k) return 1; if (j > k) return 0; return fn ? fn() : 1; };
  }

  // ---------- papan dan spidol (sama dengan B02) ----------
  function board(ctx) {
    ctx.fillStyle = "#C3CDD4"; rr(ctx, 40, 118, 1840, 724, 22); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 52, 130, 1816, 700, 14); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.03)"; rr(ctx, 52, 130, 1816, 18, 8); ctx.fill();
  }
  function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
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
  function tick(ctx, x, y, s, u = 1, color = GREEN, w) { mline(ctx, [[x - s * 0.45, y], [x - s * 0.12, y + s * 0.33], [x + s * 0.48, y - s * 0.38]], u, color, w || Math.max(4, s * 0.16)); }
  function cross(ctx, x, y, s, u = 1, color = RED, w) {
    const lw = w || Math.max(4, s * 0.16);
    mline(ctx, [[x - s * 0.36, y - s * 0.36], [x + s * 0.36, y + s * 0.36]], u * 2, color, lw);
    mline(ctx, [[x + s * 0.36, y - s * 0.36], [x - s * 0.36, y + s * 0.36]], u * 2 - 1, color, lw);
  }
  function ring(ctx, x, y, rx, ry, u, color = ORANGE, w = 6) {
    if (u <= 0) return;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -0.04, -Math.PI * 0.6, -Math.PI * 0.6 + Math.PI * 2.15 * clamp(u, 0, 1)); ctx.stroke(); ctx.restore();
  }
  function circleDraw(ctx, x, y, r, u, color, w = 7) {   // lingkaran digambar spidol dari atas searah jarum jam
    if (u <= 0) return;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(u, 0, 1)); ctx.stroke(); ctx.restore();
  }
  function hand(ctx, s, x, y, size, opt = {}) {
    ctx.save(); ctx.font = `italic 800 ${size}px ${K.FONT}`; ctx.fillStyle = opt.color || ORANGE; ctx.textAlign = opt.align || "center";
    ctx.textBaseline = "alphabetic"; if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1); ctx.fillText(s, x, y); ctx.restore();
  }
  function tw(ctx, s, size, weight = 800) { ctx.font = `${weight} ${size}px ${K.FONT}`; return ctx.measureText(s).width; }
  function alpha(ctx, a, fn) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1); fn(); ctx.restore(); }
  function hourglass(ctx, cx, cy, l, d, R = 54) {
    const frac = clamp(l / Math.max(1, d - 0.3), 0, 1);
    ctx.strokeStyle = "#E9DDBF"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.scale(R / 68, R / 68); ctx.fillStyle = "#F4D58D"; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-24, -36); ctx.lineTo(24, -36); ctx.lineTo(4, 0); ctx.lineTo(24, 36); ctx.lineTo(-24, 36); ctx.lineTo(-4, 0); ctx.closePath(); ctx.stroke();
    const top = 1 - frac; ctx.beginPath(); ctx.moveTo(-20 * top, -32 + 28 * (1 - top)); ctx.lineTo(20 * top, -32 + 28 * (1 - top)); ctx.lineTo(0, -2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-20 * frac - 2, 34); ctx.lineTo(20 * frac + 2, 34); ctx.lineTo(0, 34 - 28 * frac); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function thinkBadge(ctx, x, y, w, h, l, d, q) {
    card(ctx, x, y, w, h, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    hourglass(ctx, x + h / 2 + 6, y + h / 2, l, d, h * 0.34);
    text(ctx, "PIKIRKAN DULU", x + h + 20, y + h * 0.42, 38, { weight: 900, color: C.accentDark });
    text(ctx, q, x + h + 20, y + h * 0.78, 30, { weight: 800, color: INK, fit: w - h - 40 });
  }
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan B01–B02)
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (o.alpha != null) ctx.globalAlpha = o.alpha;
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, 24, 32, 27, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = FUR2; ctx.beginPath(); ctx.ellipse(0, 30, 19, 17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = FUR; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 15, 49, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, Math.PI * 2); ctx.fillStyle = FUR; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * 23, -37, 3.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -23, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -24.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  // ---------- SG07: meja bundar dan berang-berang ----------
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Meja Makan Bundar", tahun: "2025", negara: "Indonesia", kode: "2025-ID-04a" };
  const NM = { A: "Anita", B: "Bruno", C: "Clara", D: "David", X: "?" };
  const COL = { A: "#E0567A", B: "#2F7FD1", C: "#8A4FC7", D: "#23964F", X: "#9AA3AA" };
  const PI = Math.PI;
  const ANG = { S: PI / 2, W: PI, N: -PI / 2, E: 0 };
  const KIRI = BLUE, KANAN = ORANGE;

  // berang-berang dilihat dari atas; menghadap ke atas (−y lokal) bila th = 0
  function topBeaver(ctx, x, y, s, th, col, opt = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(th); ctx.scale(s / 100, s / 100);
    if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    const gray = col === COL.X;
    const fur = gray ? "#A9B0B5" : FUR, fur2 = gray ? "#C7CCD0" : FUR2, dark = gray ? "#6F777E" : "#3A2618";
    ctx.strokeStyle = dark; ctx.lineWidth = 3;
    // ekor pipih di belakang
    ctx.fillStyle = gray ? "#8D959B" : "#5E3B24"; ctx.beginPath(); ctx.ellipse(0, 54, 16, 19, 0, 0, PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2;
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 8, 42); ctx.lineTo(-k * 8, 66); ctx.stroke(); }
    ctx.strokeStyle = dark; ctx.lineWidth = 3;
    // badan
    ctx.fillStyle = fur; ctx.beginPath(); ctx.ellipse(0, 14, 36, 38, 0, 0, PI * 2); ctx.fill(); ctx.stroke();
    // tangan (kiri = −x, kanan = +x)
    ctx.fillStyle = fur2; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 37, -6, 11, 14, k * 0.3, 0, PI * 2); ctx.fill(); ctx.stroke(); }
    // syal
    ctx.fillStyle = col; rr(ctx, -27, -20, 54, 13, 6); ctx.fill(); ctx.stroke();
    // kepala, telinga, hidung
    for (const k of [-1, 1]) { ctx.fillStyle = fur; ctx.beginPath(); ctx.arc(k * 19, -42, 7, 0, PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = fur; ctx.beginPath(); ctx.arc(0, -34, 24, 0, PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -52, 12, 9, 0, 0, PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -57, 6, 4, 0, 0, PI * 2); ctx.fill();
    ctx.restore();
  }
  // berang-berang tampak depan dengan syal berwarna (untuk perkenalan)
  function frontBeaver(ctx, x, y, s, col, opt = {}) {
    beaver(ctx, x, y, s, opt);
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = col; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2; rr(ctx, -24, 9, 48, 10, 5); ctx.fill(); ctx.stroke();
    if (opt.arm) {   // opt.arm = −1 (sisi kiri layar) atau 1 (sisi kanan layar): tangan diangkat
      const k = opt.arm; ctx.fillStyle = FUR; ctx.lineWidth = 2.5;
      ctx.save(); ctx.translate(k * 28, 14); ctx.rotate(k * 0.35); ctx.beginPath(); ctx.ellipse(0, -26, 9, 28, 0, 0, PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = FUR2; ctx.beginPath(); ctx.arc(0, -54, 9, 0, PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  }
  // berang-berang tampak belakang ("kamu")
  function backBeaver(ctx, x, y, s, opt = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.ellipse(0, 56, 16, 12, 0, 0, PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, 24, 32, 27, 0, 0, PI * 2); ctx.fill(); ctx.stroke();
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(0, -14, 29, 0, PI * 2); ctx.fill(); ctx.stroke();
    if (opt.arm) {
      const k = opt.arm; ctx.save(); ctx.translate(k * 28, 14); ctx.rotate(k * 0.35); ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, -26, 9, 28, 0, 0, PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = FUR2; ctx.beginPath(); ctx.arc(0, -54, 9, 0, PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  }
  function star(ctx, x, y, r, color = ORANGE) {
    ctx.save(); ctx.fillStyle = color; ctx.strokeStyle = "#9A4A00"; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5, rr2 = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  // tata letak meja: L = {cx, cy, s}
  const LMAIN = { cx: 640, cy: 470, s: 1 };
  const TOK = 186;   // jari-jari posisi berang-berang
  const pillR = (a) => TOK + 96 + Math.abs(Math.cos(a)) * 94;   // papan nama tidak menimpa berang-berang
  function seatPos(L, key, rot, rad) { const a = ANG[key] + rot; return [L.cx + Math.cos(a) * rad * L.s, L.cy + Math.sin(a) * rad * L.s, a]; }
  // seats: {S:"D", N:"A", ...}; huruf X = berang-berang abu-abu bertanda ?
  // opt: star (kunci tempat), hands (kunci tempat), handsA, face (kunci), sa {kunci: alpha masuk}, ring {kunci: [u, warna]}, q (kunci tempat bertanda ?)
  function table(ctx, L, seats, rot, opt = {}) {
    const s = L.s, R = 110 * s;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.arc(L.cx + 6, L.cy + 8, R, 0, PI * 2); ctx.fill();
    ctx.fillStyle = "#A9411A"; ctx.strokeStyle = "#6E2A10"; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.arc(L.cx, L.cy, R, 0, PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.arc(L.cx, L.cy, R * 0.8, 0, PI * 2); ctx.stroke();
    ctx.restore();
    ["S", "W", "N", "E"].forEach(k => {
      const who = seats[k], a = opt.sa && opt.sa[k] != null ? opt.sa[k] : 1;
      const [px, py] = seatPos(L, k, rot, pillR(ANG[k] + rot));
      // piring
      if (who && a > 0) { const [qx, qy] = seatPos(L, k, rot, 78); alpha(ctx, a, () => { ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#E6D3C4"; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.arc(qx, qy, 20 * s, 0, PI * 2); ctx.fill(); ctx.stroke(); }); }
      // papan nama
      const w = 176 * s, h = 54 * s, filled = who && a > 0;
      ctx.save();
      ctx.fillStyle = opt.star === k ? "#FFD08A" : "#FFE04A"; ctx.strokeStyle = filled ? COL[who] : "#B79A00"; ctx.lineWidth = (filled ? 5 : 3) * s;
      if (!filled) ctx.setLineDash([10 * s, 8 * s]);
      rr(ctx, px - w / 2, py - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke(); ctx.restore();
      if (opt.star === k) star(ctx, px - w / 2 - 4 * s, py - h / 2 + 2 * s, 22 * s);
      if (filled) alpha(ctx, a, () => text(ctx, NM[who], px, py + 11 * s, 32 * s, { align: "center", weight: 900, color: who === "X" ? GRAYT : INK, fit: w - 20 * s }));
      else if (opt.q && opt.q.includes(k)) text(ctx, "?", px, py + 13 * s, 38 * s, { align: "center", weight: 900, color: RED });
      // berang-berang
      if (who && a > 0) { const [bx, by, ang] = seatPos(L, k, rot, TOK); topBeaver(ctx, bx, by + (1 - a) * 0, 100 * s, ang - PI / 2, COL[who], { alpha: a }); }
      if (opt.ring && opt.ring[k]) { const [u, c] = opt.ring[k]; ring(ctx, px, py, w * 0.66, h * 0.95, u, c, 6 * s); }
    });
    if (opt.face) {   // panah arah hadap ke tengah meja
      const k = opt.face, fa = opt.faceA == null ? 1 : opt.faceA;
      const [x1, y1] = seatPos(L, k, rot, 128), [x2, y2] = seatPos(L, k, rot, 40);
      alpha(ctx, fa, () => mline(ctx, [[x1, y1], [x2, y2]], 1, "#FFF3C4", 7 * s, true));
    }
    if (opt.hands) handLabels(ctx, L, opt.hands, rot, opt.handsA == null ? 1 : opt.handsA, opt.handsHL);
  }
  // label "kiri"/"kanan" di tangan berang-berang pada tempat k (teks tetap tegak)
  function handLabels(ctx, L, k, rot, a, hl) {
    if (a <= 0) return;
    const s = L.s, [bx, by, ang] = seatPos(L, k, rot, TOK), th = ang - PI / 2;
    const P2 = (lx, ly) => [bx + (lx * Math.cos(th) - ly * Math.sin(th)) * s, by + (lx * Math.sin(th) + ly * Math.cos(th)) * s];
    alpha(ctx, a, () => {
      [[-1, "kiri", KIRI], [1, "kanan", KANAN]].forEach(([sg, t, c]) => {
        const [x, y] = P2(sg * 92, -6);
        const big = hl === t ? 1.25 : 1, tw2 = tw(ctx, t, 28 * s * big, 900) + 22 * s;
        ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = c; ctx.lineWidth = 4 * s; rr(ctx, x - tw2 / 2, y - 22 * s * big, tw2, 42 * s * big, 12 * s); ctx.fill(); ctx.stroke();
        text(ctx, t, x, y + 9 * s * big, 28 * s * big, { align: "center", weight: 900, color: c });
      });
    });
  }
  // nilai rotasi beranimasi: daftar [waktu mulai, dari, ke]
  function rotAt(l, list, d = 1.6) { let r = list.length ? list[0][1] : 0; list.forEach(([t0, a, z]) => { if (l >= t0) r = lerp(a, z, P(l, t0, d)); }); return r; }
  function clueCard(ctx, x, y, w, l, opt = {}) {
    const h = opt.h || 250;
    card(ctx, x, y, w, h, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 18 });
    text(ctx, "PETUNJUK", x + 28, y + 48, 28, { weight: 900, color: C.accentDark });
    const L2 = [["1", "Bruno duduk di sebelah kanan Anita."], ["2", "David duduk di sebelah kiri Clara."]];
    L2.forEach(([n, s2], i) => {
      const a = opt.show ? opt.show[i] : 1; if (a <= 0) return;
      const yy = y + 100 + i * 82, hl = opt.hl === i;
      alpha(ctx, a, () => {
        if (hl) { ctx.fillStyle = "#FFF1CC"; rr(ctx, x + 14, yy - 42, w - 28, 72, 12); ctx.fill(); }
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 48, yy - 6, 22, 0, PI * 2); ctx.fill();
        text(ctx, n, x + 48, yy + 4, 28, { align: "center", weight: 900, color: "#fff" });
        text(ctx, s2, x + 84, yy + 6, 32, { weight: 800, color: INK, fit: w - 150 });
        if (opt.tick && opt.tick[i] > 0) tick(ctx, x + w - 44, yy - 8, 50, opt.tick[i], GREEN, 8);
      });
    });
  }
  function flagID(ctx, x, y, w) {
    const h = w * 2 / 3;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#CE1126"; ctx.fillRect(x, y, w, h / 2); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y + h / 2, w, h / 2);
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }
  function eyeIcon(ctx, x, y, s, a) {
    alpha(ctx, a, () => {
      ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-60, 0); ctx.quadraticCurveTo(0, -46, 60, 0); ctx.quadraticCurveTo(0, 46, -60, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(0, 0, 20, 0, PI * 2); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 9, 0, PI * 2); ctx.fill();
      ctx.restore();
    });
  }
  const ORDER = ["A", "B", "C", "D"];

  // ---------- soal utuh ----------
  function soal(ctx, b, l) {
    board(ctx);
    if (b.id === "soal1") {
      const T = atSeq(b, ["Anita", "Bruno", "Clara", "David"]);
      ORDER.forEach((k, i) => {
        const a = P(l, T[i], 0.5), x = 420 + i * 360;
        alpha(ctx, a, () => { frontBeaver(ctx, x, 440, 230, COL[k]); text(ctx, NM[k], x, 680, 50, { align: "center", weight: 900, color: COL[k] }); });
      });
      hand(ctx, "duduk mengelilingi meja bundar", 960, 790, 42, { color: ORANGE, alpha: P(l, at(b, "Mereka duduk"), 0.6) });
      return;
    }
    const ord = prog(["soal2", "soal3", "soal4", "soal5", "soal6"], b, l);
    const dA = ord("soal3", () => P(l, at(b, "tempat David"), 0.6));
    const qN = ord("soal5", () => P(l, 0.3, 0.5)) > 0.5;
    const tA = ord("soal2", () => P(l, at(b, "Meja bundarnya"), 0.6));
    alpha(ctx, tA, () => table(ctx, LMAIN, { S: "D" }, 0, { sa: { S: dA }, q: qN ? ["N"] : [] }));
    if (b.id === "soal2") {
      const e = P(l, at(b, "dilihat dari atas"), 0.6);
      eyeIcon(ctx, 1450, 260, 110, e);
      alpha(ctx, e, () => { mline(ctx, [[1450, 320], [1450, 420]], 1, INK, 6, true); });
      hand(ctx, "dilihat dari atas", 1450, 500, 46, { color: ORANGE, alpha: e });
      return;
    }
    // panah "sebelah kiri/kanan David" seperti gambar soal
    const arA = ord("soal3", () => P(l, at(b, "sisi kiri gambar"), 0.6)), arB = ord("soal3", () => P(l, at(b, "sisi kanan gambar"), 0.6));
    if (b.id === "soal3" || b.id === "soal4") {
      const [dx, dy] = seatPos(LMAIN, "S", 0, pillR(ANG.S + 0));
      const sx = pillR(0);
      mline(ctx, [[dx - 110, dy - 5], [dx - sx + 40, dy - 50], [dx - sx, dy - 245]], arA, INK, 5, true);
      mline(ctx, [[dx + 110, dy - 5], [dx + sx - 40, dy - 50], [dx + sx, dy - 245]], arB, INK, 5, true);
      hand(ctx, "sebelah kiri", dx - sx - 20, dy - 120, 30, { color: KIRI, alpha: arA, align: "right" });
      hand(ctx, "David", dx - sx - 20, dy - 82, 30, { color: KIRI, alpha: arA, align: "right" });
      hand(ctx, "sebelah kanan", dx + sx + 20, dy - 120, 30, { color: KANAN, alpha: arB, align: "left" });
      hand(ctx, "David", dx + sx + 20, dy - 82, 30, { color: KANAN, alpha: arB, align: "left" });
    }
    if (ord("soal4") > 0 && b.id !== "soal5" && b.id !== "soal6") {
      const T = b.id === "soal4" ? atSeq(b, ["Petunjuk pertama", "Petunjuk kedua"]) : [0, 0];
      clueCard(ctx, 1120, 220, 720, l, { show: T.map(t => b.id === "soal4" ? P(l, t, 0.5) : 1) });
    }
    if (ord("soal5") > 0) {
      const a = ord("soal5", () => P(l, 0.3, 0.6));
      alpha(ctx, a, () => {
        card(ctx, 1150, 170, 690, 560, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
        text(ctx, "TANTANGAN", 1495, 225, 32, { align: "center", weight: 900, color: C.accentDark });
        text(ctx, "Siapa yang duduk", 1495, 300, 42, { align: "center", weight: 900, color: INK });
        text(ctx, "di depan David?", 1495, 352, 42, { align: "center", weight: 900, color: INK });
        const T = b.id === "soal5" ? atSeq(b, ["Clara", "Anita", "Bruno", "tidak dapat"]) : [0, 0, 0, 0];
        ["Clara", "Anita", "Bruno", "Tidak dapat ditentukan"].forEach((o, i) => {
          const oa = b.id === "soal5" ? P(l, T[i], 0.4) : 1, y = 420 + i * 72;
          alpha(ctx, oa, () => { ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(1240, y - 12, 14, 0, PI * 2); ctx.stroke(); text(ctx, o, 1275, y, 34, { weight: 800, color: INK }); });
        });
      });
      // panah dari David ke tempat di depannya
      const [x1, y1] = seatPos(LMAIN, "S", 0, 40), [x2, y2] = seatPos(LMAIN, "N", 0, 100);
      mline(ctx, [[x1, y1], [x2, y2]], a, RED, 7, true);
    }
    if (b.id === "soal6") hand(ctx, "tanpa menebak!", 1495, 800, 42, { color: ORANGE, alpha: P(l, at(b, "tanpa"), 0.5) });
  }

  // ---------- kiri dan kanan siapa? ----------
  function arah(ctx, b, l) {
    board(ctx);
    const ord = prog(["k1", "k2", "k3"], b, l);
    const up = ord("k1", () => P(l, at(b, "angkat tangan"), 0.6));
    backBeaver(ctx, 640, 640, 210, { arm: up > 0.5 ? 1 : 0 });
    text(ctx, "kamu (dilihat dari belakang)", 640, 805, 30, { align: "center", weight: 900, color: INK });
    alpha(ctx, up, () => { hand(ctx, "tangan kananmu", 940, 575, 40, { color: KANAN }); mline(ctx, [[860, 585], [765, 560]], 1, KANAN, 5, true); });
    const fr = ord("k2", () => P(l, at(b, "berdiri berhadapan"), 0.6)), fu = ord("k2", () => P(l, at(b, "Dia juga"), 0.5));
    alpha(ctx, fr, () => {
      frontBeaver(ctx, 640, 300, 190, COL.B, { arm: fu > 0.5 ? -1 : 0 });
      text(ctx, "teman (menghadap kamu)", 640, 455, 30, { align: "center", weight: 900, color: INK });
    });
    if (fu > 0) {
      alpha(ctx, fu, () => { hand(ctx, "tangan kanan teman", 300, 200, 38, { color: KANAN }); mline(ctx, [[400, 215], [540, 215]], 1, KANAN, 5, true); });
      const sk = ord("k2", () => P(l, at(b, "sisi kirimu"), 0.5));
      alpha(ctx, sk, () => { hand(ctx, "ada di sisi kirimu!", 300, 300, 40, { color: RED }); hand(ctx, "← sisi kirimu", 250, 640, 38, { color: KIRI }); hand(ctx, "sisi kananmu →", 1030, 640, 38, { color: KANAN }); });
    }
    if (b.id === "k3") {
      const a = P(l, at(b, "Kiri dan kanan seseorang"), 0.6);
      alpha(ctx, a, () => {
        card(ctx, 1150, 250, 660, 340, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
        para(ctx, "Kiri dan kanan dilihat dari arah orang itu menghadap.", 1480, 350, 46, 580, { align: "center", weight: 900, color: INK, lh: 1.25 });
      });
      ring(ctx, 1480, 420, 350, 190, P(l, at(b, "dilihat dari arah") + 0.3, 0.9), GREEN, 6);
      hand(ctx, "kanan teman ≠ kananmu", 1480, 680, 40, { color: RED, alpha: P(l, 0.3, 0.6) });
    }
  }
  // meja latihan: David di bawah, berang-berang ? di atas, tempat kiri berbintang
  function meja(ctx, b, l) {
    board(ctx);
    const ord = prog(["k4", "k5", "k6", "k7", "k8"], b, l);
    const xA = ord("k5", () => P(l, at(b, "yang duduk di atas"), 0.6));
    let rot = 0;
    if (b.id === "k6") rot = rotAt(l, [[at(b, "Kita putar"), 0, PI]], 2.2);
    else if (b.id === "k7") rot = PI;
    else if (b.id === "k8") rot = rotAt(l, [[at(b, "putar gambarnya") + 0.3, PI, 0]], 2.2);
    const st = ord("k5", () => P(l, at(b, "sisi kiri gambar"), 0.4)) > 0.5 ? "W" : null;
    const showDavidHands = b.id === "k4";
    const nh = b.id === "k6" ? P(l, at(b, "Sekarang, dia"), 0.6) : b.id === "k7" ? 1 : 0;
    table(ctx, LMAIN, { S: "D", N: "X" }, rot, {
      sa: { N: xA }, star: st, face: b.id === "k4" ? "S" : b.id === "k5" ? "N" : null,
      faceA: b.id === "k4" ? P(l, at(b, "menghadap ke atas"), 0.5) : P(l, at(b, "menghadap ke bawah"), 0.5),
      hands: showDavidHands ? "S" : nh > 0 ? "N" : null,
      handsA: showDavidHands ? P(l, at(b, "kiri David"), 0.5) : nh, handsHL: b.id === "k7" ? "kanan" : null,
    });
    if (b.id === "k4") {
      hand(ctx, "semua menghadap ke meja", 1450, 300, 42, { color: ORANGE, alpha: P(l, 0.3, 0.6) });
      hand(ctx, "kiri David = kiri gambar", 1450, 470, 40, { color: KIRI, alpha: P(l, at(b, "kiri David"), 0.5) });
      hand(ctx, "kanan David = kanan gambar", 1450, 540, 40, { color: KANAN, alpha: P(l, at(b, "kanan David"), 0.5) });
      kiko(ctx, 1680, 700, 150, 0, { mood: "happy" });
    }
    if (b.id === "k5") thinkBadge(ctx, 1130, 560, 710, 150, l, b.dur, "Bintang: kirinya atau kanannya?");
    if (b.id === "k5") hand(ctx, "menghadap ke bawah", 1480, 330, 40, { color: ORANGE, alpha: P(l, at(b, "menghadap ke bawah"), 0.5) });
    if (b.id === "k6") hand(ctx, "putar setengah putaran", 1480, 330, 42, { color: ORANGE, alpha: P(l, at(b, "Kita putar"), 0.5) });
    if (b.id === "k7") {
      const [px, py] = seatPos(LMAIN, "W", rot, pillR(ANG.W + rot));
      ring(ctx, px, py, 125, 50, P(l, at(b, "sekarang ada"), 0.8), GREEN, 6);
      hand(ctx, "bintang = kanan-nya", 1520, 300, 44, { color: KANAN, alpha: P(l, at(b, "sebelah kanannya"), 0.5) });
      para(ctx, "Yang duduk di atas: kiri dan kanannya terbalik dari gambar.", 1520, 440, 38, 560, { align: "center", weight: 900, color: INK, alpha: 1 });
    }
    if (b.id === "k8") {
      const a = P(l, at(b, "Kalau kamu bingung"), 0.6);
      alpha(ctx, a, () => { hand(ctx, "Bingung?", 1480, 330, 60, { color: RED }); hand(ctx, "Putar gambarnya!", 1480, 420, 60, { color: GREEN }); });
      para(ctx, "Yang dibicarakan duduk di bawah → kiri-kanannya sama dengan gambar.", 1480, 540, 34, 560, { align: "center", weight: 800, color: INK });
      kiko(ctx, 1700, 720, 140, 0, { mood: "happy" });
    }
  }

  // ---------- petunjuk kedua: Clara ----------
  function clara(ctx, b, l) {
    board(ctx);
    const ord = prog(["p1", "p2", "p3", "p4"], b, l);
    const cA = ord("p3", () => P(l, at(b, "Clara duduk di sana"), 0.6));
    const rot = b.id === "p4" ? rotAt(l, [[at(b, "Kita putar"), 0, PI / 2]], 2.0) : 0;
    const hA = b.id === "p3" ? P(l, 0.3, 0.5) : b.id === "p4" ? P(l, at(b, "Benar"), 0.5) : 0;
    table(ctx, LMAIN, { S: "D", E: "C" }, rot, { sa: { E: cA }, hands: b.id === "p3" ? "S" : b.id === "p4" ? "E" : null, handsA: hA, handsHL: b.id === "p3" ? "kanan" : "kiri" });
    clueCard(ctx, 1120, 170, 720, l, { hl: 1, show: [0.35, 1], h: 240, tick: [0, ord("p4", () => P(l, at(b, "sudah cocok"), 0.6))] });
    if (b.id === "p2") {
      hand(ctx, "David di kiri Clara", 1500, 500, 42, { color: KIRI, alpha: P(l, 0.3, 0.5) });
      hand(ctx, "= Clara di kanan David", 1500, 570, 42, { color: KANAN, alpha: P(l, at(b, "berarti Clara"), 0.5) });
      const a = P(l, at(b, "Sama seperti"), 0.6);
      alpha(ctx, a, () => {
        backBeaver(ctx, 1400, 640, 100); backBeaver(ctx, 1600, 640, 100);
        text(ctx, "teman", 1400, 740, 28, { align: "center", weight: 900, color: KIRI }); text(ctx, "kamu", 1600, 740, 28, { align: "center", weight: 900, color: KANAN });
        text(ctx, "(dilihat dari belakang)", 1500, 778, 24, { align: "center", weight: 700, color: GRAYT });
      });
    }
    if (b.id === "p3") hand(ctx, "kanan David → Clara", 1500, 520, 44, { color: KANAN, alpha: P(l, at(b, "Clara duduk"), 0.5) });
    if (b.id === "p4") hand(ctx, "Clara di bawah: David di kirinya ✓", 1500, 520, 38, { color: GREEN, alpha: P(l, at(b, "Benar"), 0.5) });
  }
  // ---------- petunjuk pertama: Anita dan Bruno ----------
  function coba(ctx, b, l) {
    board(ctx);
    let seats = { S: "D", E: "C" }, rot = 0, hands = null, hA = 0, mk = null;
    const notes = [];
    if (b.id === "r1") {
      const a = P(l, at(b, "Anita dan Bruno"), 0.5);
      table(ctx, LMAIN, seats, 0, { q: ["W", "N"] });
      alpha(ctx, a, () => { ["A", "B"].forEach((k, i) => { const x = 1340 + i * 280; frontBeaver(ctx, x, 540, 140, COL[k]); text(ctx, NM[k], x, 670, 40, { align: "center", weight: 900, color: COL[k] }); }); });
      hand(ctx, "siapa di mana?", 1480, 770, 44, { color: ORANGE, alpha: P(l, at(b, "siapa duduk"), 0.5) });
    } else {
      const one = b.id === "r2";
      seats = one ? { S: "D", E: "C", W: "A", N: "B" } : { S: "D", E: "C", N: "A", W: "B" };
      const tIn = P(l, at(b, "Kemungkinan"), 0.6), tR = at(b, "Kita putar");
      rot = rotAt(l, [[tR, 0, one ? -PI / 2 : PI]], 2.2);
      hands = one ? "W" : "N"; hA = P(l, at(b, "yang duduk di sebelah kanan"), 0.5);
      table(ctx, LMAIN, seats, rot, { sa: { W: tIn, N: tIn }, hands, handsA: hA, handsHL: "kanan" });
      mk = P(l, at(b, one ? "bukan Bruno" : "adalah Bruno"), 0.5);
      // tanda silang/centang di tempat di sebelah kanan Anita
      const tgt = one ? "S" : "W", [px, py] = seatPos(LMAIN, tgt, rot, pillR(ANG[tgt] + rot));
      if (one) cross(ctx, px, py - 72, 64, mk, RED, 9); else tick(ctx, px, py - 72, 74, mk, GREEN, 10);
    }
    clueCard(ctx, 1120, 170, 720, l, { hl: 0, show: [1, 0.35], h: 240 });
    if (b.id !== "r1") {
      const r2done = b.id === "r3" ? 1 : P(l, at(b, "tidak cocok"), 0.5), r3done = b.id === "r3" ? P(l, at(b, "cocok dengan petunjuk"), 0.5) : 0;
      alpha(ctx, b.id === "r2" ? P(l, 0.2, 0.5) : 1, () => {
        text(ctx, "Kemungkinan 1: Anita kiri, Bruno atas", 1130, 500, 34, { weight: 800, color: INK, fit: 610 });
        if (r2done > 0) cross(ctx, 1800, 488, 46, r2done, RED, 7);
      });
      if (b.id === "r3") alpha(ctx, P(l, 0.2, 0.5), () => {
        text(ctx, "Kemungkinan 2: Anita atas, Bruno kiri", 1130, 580, 34, { weight: 800, color: INK, fit: 610 });
        if (r3done > 0) tick(ctx, 1800, 568, 52, r3done, GREEN, 8);
      });
      const say = b.id === "r2" ? "kanan Anita = David ✗" : "kanan Anita = Bruno ✓";
      hand(ctx, say, 1480, 700, 44, { color: b.id === "r2" ? RED : GREEN, alpha: mk });
    }
  }
  // ---------- menjawab ----------
  const FULL = { S: "D", E: "C", N: "A", W: "B" };
  function jawab(ctx, b, l) {
    board(ctx);
    const ord = prog(["j1", "j2", "j3", "j4", "j5"], b, l);
    const rot = b.id === "j1" ? rotAt(l, [[0.3, PI, 0]], 2.0) : 0;
    const ans = ord("j2", () => P(l, at(b, "jawabannya adalah Anita"), 0.5));
    table(ctx, LMAIN, FULL, rot, { ring: ans > 0 ? { N: [ans, GREEN] } : null });
    if (b.id === "j1" || b.id === "j2") {
      const a = b.id === "j1" ? P(l, 2.4, 0.6) : 1, [x1, y1] = seatPos(LMAIN, "S", 0, 40), [x2, y2] = seatPos(LMAIN, "N", 0, 100);
      mline(ctx, [[x1, y1], [x2, y2]], a, RED, 7, true);
    }
    if (b.id === "j1") thinkBadge(ctx, 1130, 560, 710, 150, l, b.dur, "Siapa di depan David?");
    // kotak jawaban
    card(ctx, 1260, 190, 460, 230, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    text(ctx, "JAWABAN", 1510, 245, 30, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, ans > 0.5 ? "Anita" : "?", 1510, 345, 60, { align: "center", weight: 900, color: ans > 0.5 ? GREEN : GRAYT });
    if (b.id === "j3") {
      const T = atSeq(b, ["Bruno duduk", "David duduk"]);
      clueCard(ctx, 1120, 450, 720, l, { h: 250, tick: [P(l, at(b, "itu cocok"), 0.5), P(l, at(b, "juga cocok"), 0.5)], show: T.map(t => P(l, t - 0.4, 0.4)) });
    }
    if (b.id === "j4") {
      const a = P(l, 0.3, 0.5);
      alpha(ctx, a, () => { text(ctx, "Tidak dapat ditentukan", 1510, 520, 38, { align: "center", weight: 800, color: INK }); });
      mline(ctx, [[1290, 507], [1730, 507]], P(l, at(b, "Karena"), 0.6), RED, 7);
      hand(ctx, "hanya 1 susunan yang cocok", 1510, 640, 42, { color: GREEN, alpha: P(l, at(b, "hanya satu"), 0.5) });
    }
    if (b.id === "j5") {
      const a1 = P(l, at(b, "dari mata kita"), 0.5), a2 = P(l, at(b, "dari arah Anita"), 0.5);
      hand(ctx, "kiri-kanan dari mata kita", 1510, 520, 36, { color: RED, alpha: a1 });
      mline(ctx, [[1290, 508], [1730, 508]], P(l, at(b, "dari mata kita") + 0.5, 0.5), RED, 6);
      hand(ctx, "kiri-kanan dari arah dia menghadap", 1490, 630, 32, { color: GREEN, alpha: a2 });
      ring(ctx, 1490, 618, 345, 52, P(l, at(b, "dari arah Anita") + 0.4, 0.8), GREEN, 5);
      hand(ctx, "→ salah pilih Bruno", 1510, 740, 36, { color: RED, alpha: P(l, at(b, "salah memilih"), 0.5) });
    }
  }

  // ---------- penutup ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Pertama", "Kedua", "Ketiga"]);
    const S = ["Kiri dan kanan dilihat dari arah orang itu menghadap.", "Mulailah dari tempat yang sudah pasti.", "Coba setiap kemungkinan, buang yang tidak cocok."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 46, { weight: 900, color: INK, fit: 1120 });
        const ix = 1600, iy = y + 80;
        if (i === 0) { topBeaver(ctx, ix, iy + 10, 80, 0, COL.A); mline(ctx, [[ix, iy - 30], [ix, iy - 70]], 1, INK, 5, true); }
        if (i === 1) { topBeaver(ctx, ix, iy + 6, 70, 0, COL.D); text(ctx, "David", ix + 80, iy + 14, 28, { weight: 900, color: COL.D }); }
        if (i === 2) { tick(ctx, ix - 40, iy, 70, 1, GREEN, 8); cross(ctx, ix + 50, iy, 60, 1, RED, 8); }
      });
    });
  }
  function robot(ctx, b, l) {
    board(ctx);
    const tC = at(b, "Perintah belok kiri"), turn = P(l, tC + 0.8, 1.2), mv = P(l, tC + 2.2, 1.6);
    const ang = lerp(PI, PI / 2, turn), x = 760 + mv * 300, y = 470;
    // jalur kotak-kotak
    ctx.strokeStyle = "#E3E8EC"; ctx.lineWidth = 2; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(460 + i * 100, 220); ctx.lineTo(460 + i * 100, 720); ctx.stroke(); }
    for (let j = 0; j < 6; j++) { ctx.beginPath(); ctx.moveTo(460, 220 + j * 100); ctx.lineTo(1260, 220 + j * 100); ctx.stroke(); }
    kiko(ctx, x, y, 190, ang, { mood: "happy" });
    alpha(ctx, P(l, tC, 0.5), () => {
      card(ctx, 1340, 220, 440, 130, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
      text(ctx, "PERINTAH", 1560, 265, 26, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "belok kiri", 1560, 325, 48, { align: "center", weight: 900, color: KIRI });
    });
    hand(ctx, turn < 0.5 ? "Kiko menghadap ke bawah" : "Kiko belok ke kirinya sendiri", 760, 790, 34, { color: INK, alpha: P(l, 0.3, 0.5) });
    hand(ctx, "kiri robot, bukan kiri kita", 1560, 500, 40, { color: ORANGE, alpha: P(l, at(b, "bergantung"), 0.5) });
    hand(ctx, "→ tampak ke kanan layar", 1560, 580, 34, { color: ORANGE, alpha: turn });
  }
  function susunan(ctx, b, l) {
    board(ctx);
    table(ctx, LMAIN, FULL, 0, { ring: { N: [P(l, at(b, "Anita duduk"), 0.8), GREEN] } });
    text(ctx, "Jawaban: Anita", 1450, 300, 64, { align: "center", weight: 900, color: GREEN, alpha: 1 });
    hand(ctx, "Anita: di depan David", 1450, 430, 38, { color: COL.A, alpha: P(l, at(b, "Anita duduk"), 0.5) });
    hand(ctx, "Bruno: di kiri David", 1450, 510, 38, { color: COL.B, alpha: P(l, at(b, "Bruno duduk"), 0.5) });
    hand(ctx, "Clara: di kanan David", 1450, 590, 38, { color: COL.C, alpha: P(l, at(b, "Clara duduk"), 0.5) });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–840) ----------
  const LV = { cx: 960, cy: 495, s: 0.8 };
  function meja_v(ctx, b, l) {
    board(ctx);
    if (b.id === "soal3") {
      table(ctx, LV, { S: "D" }, 0, {});
      hand(ctx, "dilihat dari atas", 960, 190, 40, { color: ORANGE });
      return;
    }
    if (b.id === "soal4") {   // petunjuk
      table(ctx, LV, { S: "D" }, 0, { q: [] });
      const T = atSeq(b, ["Petunjuk pertama", "Petunjuk kedua"]);
      alpha(ctx, P(l, T[0], 0.5), () => { card(ctx, 470, 160, 980, 70, { fill: "#FFF8E8", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "1. Bruno duduk di sebelah kanan Anita.", 960, 207, 34, { align: "center", weight: 900, color: INK }); });
      alpha(ctx, P(l, T[1], 0.5), () => { card(ctx, 470, 760, 980, 70, { fill: "#FFF8E8", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "2. David duduk di sebelah kiri Clara.", 960, 807, 34, { align: "center", weight: 900, color: INK }); });
      return;
    }
    if (b.id === "soal6") {   // tanya
      table(ctx, LV, { S: "D" }, 0, { q: ["N"] });
      const [x1, y1] = seatPos(LV, "S", 0, 40), [x2, y2] = seatPos(LV, "N", 0, 100);
      mline(ctx, [[x1, y1], [x2, y2]], 1, RED, 7, true);
      text(ctx, "Siapa di depan David?", 960, 195, 44, { align: "center", weight: 900, color: INK });
      hand(ctx, "Coba pikirkan dulu!", 960, 815, 44, { color: ORANGE });
      return;
    }
    if (b.id === "p3") {   // Clara
      const cA = P(l, at(b, "Clara duduk di sana"), 0.6);
      table(ctx, LV, { S: "D", E: "C" }, 0, { sa: { E: cA }, hands: "S", handsA: 1, handsHL: "kanan" });
      text(ctx, "David di kiri Clara = Clara di kanan David", 960, 195, 36, { align: "center", weight: 900, color: INK, fit: 960 });
      return;
    }
    if (b.id === "r3") {   // Anita di atas, diputar
      const rot = rotAt(l, [[at(b, "Kita putar"), 0, PI]], 2.2), hA = P(l, at(b, "yang duduk di sebelah kanan"), 0.5);
      table(ctx, LV, FULL, rot, { hands: "N", handsA: hA, handsHL: "kanan" });
      const mk = P(l, at(b, "adalah Bruno"), 0.5);
      hand(ctx, "kanan Anita = Bruno ✓", 960, 815, 44, { color: GREEN, alpha: mk });
      text(ctx, "Putar sampai Anita di bawah", 960, 195, 40, { align: "center", weight: 900, color: INK });
      return;
    }
    if (b.id === "j2") {
      const ans = P(l, at(b, "jawabannya adalah Anita"), 0.5);
      table(ctx, LV, FULL, 0, { ring: { N: [ans, GREEN] } });
      text(ctx, "Di depan David: Anita", 960, 815, 46, { align: "center", weight: 900, color: GREEN, alpha: ans });
    }
  }

  Object.assign(K.SCENES, {
    soal, arah, meja, clara, coba, jawab, langkah, robot, susunan, meja_v,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "lomba"), 0.8) : 1;
      [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
      if (!first) hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1230, 770, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
      kiko(ctx, 380, 560, 230, 0, { wave: l, mood: "happy" });
    },
    kredit(ctx, b, l) {
      board(ctx);
      const u = P(l, 0.2, 0.6);
      ctx.save(); ctx.globalAlpha = u;
      const gx = 380, gy = 500, gr = 160;
      ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, PI * 2); ctx.fill(); ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
      ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, PI * 2); ctx.stroke(); }
      for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
      ctx.restore();
      const fu = P(l, at(b, "Indonesia"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagID(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Indonesia"), 0.8);
      if (au > 0) ring(ctx, 1240, 300 + 2 * 92 - 14, 268, 46, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 300, 560, 200, 0, { wave: l, mood: "happy" });
      ORDER.forEach((k, i) => { const x = 500 + (i % 2) * 230, y = 360 + Math.floor(i / 2) * 260 + Math.sin(l * 3 + i) * 6; frontBeaver(ctx, x, y, 150, COL[k]); text(ctx, NM[k], x, y + 115, 28, { align: "center", weight: 900, color: COL[k] }); });
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 620, 815, 46, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Kiri dan kanan dilihat dari arah orang menghadap", 960, 500, 38, { align: "center", weight: 800, color: ORANGE, fit: 1000 });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
