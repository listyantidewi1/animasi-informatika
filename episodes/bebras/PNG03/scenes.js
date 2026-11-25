/* PNG03 Pembahasan Soal Bebras 2025-IT-02 "Jalan yang Diblokir" (Italia), kategori Penggalang (SMP).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras) + simulasi:
   peta 7 taman dan 10 jalan satu arah (letak dan arah panah meniru gambar soal), bidak berjalan searah panah,
   tabel jalan masuk/keluar, tanda jalan ditutup, rute keliling.
   Jawaban dihitung ulang di kode (ANS harus FB,FG; jalan tunggal harus 7) dan dilaporkan lewat K._warn bila salah.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Jalan yang Diblokir", tahun: "2025", negara: "Italia", kode: "2025-IT-02" };

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = T.indexOf(s, from);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); i = 0; }
    return atI(b, i);
  };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));
  function prog(order, b) {
    const k = order.indexOf(b.id);
    return (id, fn) => { const j = order.indexOf(id); if (j < 0) return 0; if (j < k) return 1; if (j > k) return 0; return fn ? fn() : 1; };
  }

  // ---------- papan dan spidol ----------
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
    text(ctx, "PIKIRKAN DULU", x + h + 20, y + h * 0.42, 36, { weight: 900, color: C.accentDark });
    text(ctx, q, x + h + 20, y + h * 0.8, 28, { weight: 800, color: INK, fit: w - h - 40 });
  }

  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan seri Bebras SD)
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
  function flagIT(ctx, x, y, w) {   // bendera Italia: hijau, putih, merah (kiri ke kanan)
    const h = w * 0.66;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#009246"; ctx.fillRect(x, y, w / 3 + 0.5, h);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + w / 3, y, w / 3 + 0.5, h);
    ctx.fillStyle = "#CE2B37"; ctx.fillRect(x + w * 2 / 3, y, w / 3, h);
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }
  function letter(ctx, L, cx, cy, r, good) {
    ctx.fillStyle = good ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, cx, cy + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
  }

  // ---------- peta taman ----------
  // posisi taman diukur dari gambar soal (satuan piksel gambar soal yang diperbesar, digeser ke 0)
  const NP = { A: [15, 225], B: [455, 0], C: [945, 205], D: [680, 485], E: [990, 720], F: [470, 870], G: [0, 605] };
  // letak huruf (dalam satuan jari-jari taman), meniru soal
  const LBL = { A: [-0.25, -1.45], B: [0, -1.5], C: [0.35, -1.5], D: [-0.1, 1.85], E: [1.55, 0.2], F: [1.3, -1.05], G: [-0.35, 1.85] };
  // sepuluh jalan satu arah, dibaca dari arah panah di gambar soal: huruf pertama = asal, huruf kedua = tujuan
  const ROADS = ["BA", "AG", "GB", "FB", "BC", "CE", "ED", "DC", "EF", "FG"];
  const ARROW = s => s[0] + "→" + s[1];
  const IN = {}, OUT = {};
  "ABCDEFG".split("").forEach(n => { IN[n] = ROADS.filter(r => r[1] === n); OUT[n] = ROADS.filter(r => r[0] === n); });
  // jalan yang menjadi satu-satunya jalan masuk atau keluar sebuah taman
  const SOLE = ROADS.filter(r => OUT[r[0]].length === 1 || IN[r[1]].length === 1);
  // pemeriksaan: semua taman saling terjangkau bila satu jalan ditutup; harus tepat FB dan FG
  function strong(roads) {
    const reach = (s, rev) => { const seen = new Set([s]), st = [s]; while (st.length) { const u = st.pop(); roads.forEach(r => { const [a, b2] = rev ? [r[1], r[0]] : [r[0], r[1]]; if (a === u && !seen.has(b2)) { seen.add(b2); st.push(b2); } }); } return seen.size; };
    return reach("A", false) === 7 && reach("A", true) === 7;
  }
  const ANS = ROADS.filter(r => strong(ROADS.filter(x => x !== r)));
  if (ANS.join() !== "FB,FG") (K._warn = K._warn || []).push("jawaban salah: " + ANS.join());
  if (SOLE.length !== 7 || SOLE.includes("FB") || SOLE.includes("FG") || SOLE.includes("BC")) (K._warn = K._warn || []).push("jalan tunggal salah: " + SOLE.join());

  const MAPM = { ox: 150, oy: 230, s: 0.6 };   // peta di sisi kiri papan
  const pos = (M, n) => [M.ox + NP[n][0] * M.s, M.oy + NP[n][1] * M.s];
  const RAD = M => 74 * M.s;
  function park(ctx, M, n, a = 1, opt = {}) {
    if (a <= 0) return;
    const [x, y] = pos(M, n), R = RAD(M);
    alpha(ctx, a, () => {
      ctx.fillStyle = "#D9CBB2"; ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#79B546"; ctx.beginPath(); ctx.arc(x, y, R * 0.84, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#5C9A33";
      [[-0.35, -0.3, 0.3], [0.3, -0.25, 0.28], [-0.1, 0.32, 0.32], [0.38, 0.3, 0.22]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * R, y + dy * R, r * R, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = "#F3E2B0";
      [[-0.5, 0.05], [0.05, -0.55], [0.5, -0.05], [0.12, 0.12], [-0.3, 0.55], [0.45, 0.55]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(x + dx * R, y + dy * R, R * 0.07, 0, Math.PI * 2); ctx.fill(); });
      if (opt.label !== false) text(ctx, n, x + LBL[n][0] * R, y + LBL[n][1] * R + R * 0.36, R * 0.95, { align: "center", weight: 900, color: INK });
    });
  }
  function roadGeom(M, id) {
    const p = pos(M, id[0]), q = pos(M, id[1]), R = RAD(M);
    const d = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / d, uy = (q[1] - p[1]) / d;
    const a = [p[0] + ux * R * 1.02, p[1] + uy * R * 1.02], b2 = [q[0] - ux * R * 1.02, q[1] - uy * R * 1.02];
    // sisi label: menjauhi pusat peta
    const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, cx = M.ox + 515 * M.s, cy = M.oy + 445 * M.s;
    let nx = -uy, ny = ux; if (nx * (mx - cx) + ny * (my - cy) < 0) { nx = -nx; ny = -ny; }
    if (TAGFLIP[id]) { nx = -nx; ny = -ny; }
    return { a, b: b2, ux, uy, nx, ny, mx: (a[0] + b2[0]) / 2, my: (a[1] + b2[1]) / 2, len: d - 2.04 * R };
  }
  const TAGFLIP = {};
  function lock(ctx, x, y, s) {
    ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y, s * 0.78, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#5F6A73"; ctx.lineWidth = s * 0.16; ctx.beginPath(); ctx.arc(x, y - s * 0.12, s * 0.26, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = "#5F6A73"; rr(ctx, x - s * 0.4, y - s * 0.14, s * 0.8, s * 0.6, s * 0.1); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y + s * 0.12, s * 0.09, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function noEntry(ctx, x, y, s) {   // tanda jalan ditutup: lingkaran merah dengan palang putih
    ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y, s * 1.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#D7263D"; ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x - s * 0.68, y - s * 0.18, s * 1.36, s * 0.36, s * 0.08); ctx.fill(); ctx.restore();
  }
  // st: {a: muncul 0..1, mode: "dim"|"block"|"lock", glow: warna, gu: 0..1, tag: bool, blockU}
  function road(ctx, M, id, st = {}) {
    const a0 = st.a == null ? 1 : st.a; if (a0 <= 0) return;
    const g = roadGeom(M, id), R = RAD(M), w = R * 0.56;
    ctx.save(); ctx.globalAlpha *= clamp(a0, 0, 1);
    if (st.glow && (st.gu == null || st.gu > 0)) {
      ctx.save(); ctx.globalAlpha *= clamp(st.gu == null ? 1 : st.gu, 0, 1) * 0.55; ctx.strokeStyle = st.glow; ctx.lineWidth = w * 2.3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(g.a[0], g.a[1]); ctx.lineTo(g.b[0], g.b[1]); ctx.stroke(); ctx.restore();
    }
    const dim = st.mode === "dim" || st.mode === "lock";
    if (dim) ctx.globalAlpha *= 0.32;
    ctx.strokeStyle = "#565D64"; ctx.lineWidth = w; ctx.lineCap = "butt";
    ctx.beginPath(); ctx.moveTo(g.a[0], g.a[1]); ctx.lineTo(g.b[0], g.b[1]); ctx.stroke();
    // panah putih di tengah jalan, searah jalan
    ctx.fillStyle = "#FFFFFF";
    [0.3, 0.7].forEach(t => {
      const cx = lerp(g.a[0], g.b[0], t), cy = lerp(g.a[1], g.b[1], t), h = w * 0.85;
      ctx.beginPath(); ctx.moveTo(cx + g.ux * h * 0.7, cy + g.uy * h * 0.7);
      ctx.lineTo(cx - g.ux * h * 0.5 + g.nx * h * 0.55, cy - g.uy * h * 0.5 + g.ny * h * 0.55);
      ctx.lineTo(cx - g.ux * h * 0.5 - g.nx * h * 0.55, cy - g.uy * h * 0.5 - g.ny * h * 0.55); ctx.closePath(); ctx.fill();
    });
    ctx.restore();
    if (st.tag) {
      const ta = st.tag === true ? 1 : st.tag; const tx = g.mx + g.nx * R * 0.78, ty = g.my + g.ny * R * 0.78, fs = R * 0.5;
      alpha(ctx, ta * a0, () => {
        const tw2 = tw(ctx, id, fs, 900) + fs * 0.6;
        card(ctx, tx - tw2 / 2, ty - fs * 0.62, tw2, fs * 1.24, { fill: dim ? "#EEF1F3" : "#FFFFFF", stroke: st.tagColor || (dim ? "#C3CBD1" : "#7A858E"), lw: st.tagColor ? 3.5 : 2, r: 8 });
        text(ctx, id, tx, ty + fs * 0.36, fs, { align: "center", weight: 900, color: dim ? "#A3ADB5" : (st.tagColor || INK) });
      });
    }
    if (st.mode === "lock") alpha(ctx, a0, () => lock(ctx, g.mx, g.my, R * 0.42));
    if (st.mode === "block") { const u = st.blockU == null ? 1 : st.blockU; if (u > 0) { ctx.save(); ctx.globalAlpha *= clamp(u, 0, 1); noEntry(ctx, g.mx, g.my, R * 0.42 * (0.6 + 0.4 * ease(u))); ctx.restore(); } }
  }
  function nodeMark(ctx, M, n, kind, u, color) {
    if (u <= 0) return; const [x, y] = pos(M, n), R = RAD(M);
    if (kind === "ring") { ring(ctx, x, y, R * 1.3, R * 1.3, u, color || ORANGE, 6); return; }
    alpha(ctx, Math.min(1, u * 3), () => { ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(x, y, R * 0.55, 0, Math.PI * 2); ctx.fill(); });
    if (kind === "tick") tick(ctx, x, y, R * 0.8, u, GREEN, 8); else cross(ctx, x, y, R * 0.8, u, RED, 8);
  }
  function pawn(ctx, M, p, a = 1, color = ORANGE) {
    if (a <= 0 || !p) return; const R = RAD(M);
    alpha(ctx, a, () => {
      ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.beginPath(); ctx.ellipse(p[0], p[1] + R * 0.38, R * 0.36, R * 0.12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(p[0], p[1], R * 0.44, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(p[0], p[1], R * 0.36, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(p[0], p[1] - R * 0.06, R * 0.12, 0, Math.PI * 2); ctx.fill();
      rr(ctx, p[0] - R * 0.17, p[1] + R * 0.07, R * 0.34, R * 0.15, R * 0.07); ctx.fill();
    });
  }
  // rute: titik-titik pusat taman; perjalanan sepanjang rute, u = 0..1 per ruas
  const rpts = (M, route) => route.split("").map(n => pos(M, n));
  function along(pts, u) {   // u = 0..n-1 (indeks ruas pecahan)
    const k = clamp(Math.floor(u), 0, pts.length - 2), f = clamp(u - k, 0, 1);
    return [lerp(pts[k][0], pts[k + 1][0], ease(f)), lerp(pts[k][1], pts[k + 1][1], ease(f))];
  }
  // waktu tiba di tiap taman berikutnya: frasa dicari berurutan di narasi
  function seqTimes(b, phrases, start) {
    const T = TXT(b); let from = start ? Math.max(0, T.indexOf(start)) : 0; const out = [];
    phrases.forEach(ph => { let i = T.indexOf(ph, from); if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + ph); i = from; } out.push(atI(b, i + ph.length)); from = i + ph.length; });
    return out;
  }
  function routeU(l, times, dur = 0.8) {   // indeks ruas pecahan pada waktu l
    let u = 0;
    times.forEach((t, k) => { const t0 = Math.max(k ? times[k - 1] : -9, t - dur); u += clamp((l - t0) / Math.max(0.2, t - t0), 0, 1); });
    return u;
  }
  function trail(ctx, M, route, u, color = "rgba(238,122,18,0.8)") {
    if (u <= 0) return; const pts = rpts(M, route), R = RAD(M);
    const k = Math.floor(u), part = pts.slice(0, k + 1); if (k < pts.length - 1) part.push(along(pts, u));
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = R * 0.2; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.setLineDash([R * 0.3, R * 0.22]);
    ctx.beginPath(); part.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
  }
  // gambar seluruh peta: o.roads[id] = st, o.parks[n] = alpha
  function drawMap(ctx, M, o = {}) {
    const rs = o.roads || {};
    ROADS.forEach(id => road(ctx, M, id, Object.assign({ tag: o.tags || 0 }, rs[id] || {})));
    "ABCDEFG".split("").forEach(n => park(ctx, M, n, o.parks ? (o.parks[n] == null ? 1 : o.parks[n]) : 1));
  }
  // jalan yang ditutup untuk sebuah rute keliling dan rutenya
  const TOUR = { FB: "BAGBCEDCEFGB", FG: "BAGBCEDCEFB" };
  (function cekTur() {   // setiap ruas harus jalan yang ada dan bukan jalan yang ditutup; ketujuh taman dilewati
    Object.entries(TOUR).forEach(([x, r]) => { for (let i = 0; i + 1 < r.length; i++) { const e = r[i] + r[i + 1]; if (!ROADS.includes(e) || e === x) (K._warn = K._warn || []).push("tur " + x + ": " + e); } if (new Set(r).size !== 7) (K._warn = K._warn || []).push("tur " + x + " kurang taman"); });
  })();

  // ---------- panel kanan ----------
  const PX = 900;   // tepi kiri panel kanan
  function seqText(ctx, route, x, y, size, u, opt = {}) {   // urutan taman "D → C → …" yang muncul satu per satu (u = jumlah taman tampil)
    const parts = route.split(""); let cx = x;
    ctx.save(); ctx.font = `900 ${size}px ${K.FONT}`;
    const full = parts.join(" → "); const W = ctx.measureText(full).width; if (opt.align === "center") cx = x - W / 2;
    parts.forEach((p, i) => {
      const a = clamp(u - i + 1, 0, 1); const s = (i ? " → " : "") + p; const sw = ctx.measureText(s).width;
      if (a > 0) { ctx.globalAlpha = a; ctx.fillStyle = INK; if (i) { ctx.fillStyle = "#8A949C"; ctx.fillText(" → ", cx, y); ctx.fillStyle = (opt.hi && opt.hi.includes(i)) ? ORANGE : INK; ctx.fillText(p, cx + ctx.measureText(" → ").width, y); } else ctx.fillText(p, cx, y); }
      cx += sw;
    });
    ctx.restore();
  }
  function noteCard(ctx, x, y, w, lines, a = 1, opt = {}) {
    if (a <= 0) return;
    alpha(ctx, a, () => {
      const lh = opt.size ? opt.size * 1.3 : 48, h = lines.length * lh + 44;
      card(ctx, x, y, w, h, { fill: opt.fill || "#FFFDF7", stroke: opt.stroke || ORANGE, lw: 3, r: 18 });
      lines.forEach((s, i) => text(ctx, s, x + 30, y + 22 + lh * (i + 0.78), opt.size || 36, { weight: i === 0 ? 900 : 700, color: i === 0 ? (opt.head || INK) : C.ink2, fit: w - 60 }));
    });
  }
  function tagChip(ctx, id, x, y, size, o = {}) {   // label jalan di daftar
    const w = tw(ctx, id, size, 900) + size * 0.9, h = size * 1.45;
    alpha(ctx, o.a == null ? 1 : o.a, () => {
      card(ctx, x - w / 2, y - h / 2, w, h, { fill: o.fill || "#FFFFFF", stroke: o.stroke || "#7A858E", lw: o.lw || 2.5, r: 10 });
      text(ctx, id, x, y + size * 0.36, size, { align: "center", weight: 900, color: o.color || INK });
      if (o.strike > 0) mline(ctx, [[x - w / 2 - 4, y + 4], [x + w / 2 + 4, y - 4]], o.strike, RED, 5);
      if (o.ring > 0) ring(ctx, x, y, w * 0.72, h * 0.85, o.ring, o.ringColor || "#2F6FD0", 5);
    });
    return w;
  }
  function roadList(ctx, x, y, size, fn) {   // sepuluh label jalan dalam satu baris
    const gap = size * 0.5; let cx = x;
    ROADS.forEach(id => { const w = tw(ctx, id, size, 900) + size * 0.9; tagChip(ctx, id, cx + w / 2, y, size, fn(id)); cx += w + gap; });
  }

  // ---------- adegan: buka, kredit ----------
  function buka(ctx, b, l) {
    board(ctx);
    const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
    ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
    text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
    mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
    const bu = first ? P(l, at(b, "pembahasan"), 0.8) : 1;
    [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
    if (first) hand(ctx, "tingkat SMP (Penggalang)", 1230, 770, 44, { alpha: P(l, at(b, "tingkat SMP"), 0.6) });
    else hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1230, 770, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
    kiko(ctx, 380, 560, 230, 0, { wave: l, mood: "happy" });
  }
  function kredit(ctx, b, l) {
    board(ctx);
    const u = P(l, 0.2, 0.6);
    ctx.save(); ctx.globalAlpha = u;
    const gx = 380, gy = 500, gr = 160;
    ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
    ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
    for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
    ctx.restore();
    const fu = P(l, at(b, "Italia"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagIT(ctx, 470, 230, 170); ctx.restore(); }
    const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
    text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
    rows.forEach(([k, v, ph], i) => {
      const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
      text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
      ctx.restore();
    });
    const au = P(l, at(b, "Italia"), 0.8);
    if (au > 0) ring(ctx, 1185, 300 + 2 * 92 - 14, 215, 44, au);
  }

  // ---------- 0. soal ----------
  function kota(ctx, b, l) {
    board(ctx);
    const M = MAPM, id = b.id, o = { roads: {}, parks: {} };
    if (id === "soal1") {
      const t0 = at(b, "tujuh taman"), t1 = at(b, "huruf A sampai G");
      "ABCDEFG".split("").forEach((n, i) => o.parks[n] = P(l, lerp(t0, t1, i / 6), 0.4));
      ROADS.forEach(r => o.roads[r] = { a: 0 });
    }
    if (id === "soal2") {
      const t0 = at(b, "sepuluh jalan"), t1 = at(b, "Setiap jalan");
      ROADS.forEach((r, i) => o.roads[r] = { a: P(l, lerp(t0, t1, i / 9), 0.35) });
      const hu = P(l, at(b, "searah dengan panah"), 0.5);
      o.roads.BA.glow = ORANGE; o.roads.BA.gu = hu;
    }
    if (id === "soal3" || id === "soal4") { o.roads.BA = { glow: ORANGE, tag: id === "soal4" ? P(l, at(b, "dua huruf"), 0.5) : 0, tagColor: ORANGE }; }
    if (id === "soal7") ROADS.forEach(r => o.roads[r] = { tag: 0 });
    drawMap(ctx, M, o);
    const R = RAD(M);
    // panel kanan
    if (id === "soal1") {
      hand(ctx, "7 taman", 1360, 380, 64, { color: GREEN, alpha: P(l, at(b, "tujuh taman"), 0.5) });
      hand(ctx, "bernama A, B, C, D, E, F, G", 1360, 460, 44, { color: INK, alpha: P(l, at(b, "huruf A"), 0.5) });
    }
    if (id === "soal2") {
      hand(ctx, "10 jalan satu arah", 1360, 320, 60, { color: INK, alpha: P(l, at(b, "sepuluh jalan"), 0.5) });
      const a = P(l, at(b, "Artinya"), 0.5);
      alpha(ctx, a, () => {
        // contoh jalan besar dengan panah
        const y = 470; ctx.strokeStyle = "#565D64"; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(1060, y); ctx.lineTo(1660, y); ctx.stroke();
        ctx.fillStyle = "#fff"; [1240, 1480].forEach(x => { ctx.beginPath(); ctx.moveTo(x + 22, y); ctx.lineTo(x - 14, y - 18); ctx.lineTo(x - 14, y + 18); ctx.closePath(); ctx.fill(); });
        tick(ctx, 1700, 545, 50, P(l, at(b, "searah dengan panah"), 0.4)); hand(ctx, "boleh: searah panah", 1360, 590, 40, { color: GREEN, alpha: P(l, at(b, "searah dengan panah"), 0.4) });
        hand(ctx, "tidak boleh: melawan panah", 1360, 660, 40, { color: RED, alpha: P(l, at(b, "searah dengan panah") + 0.8, 0.4) });
      });
    }
    if (id === "soal3") {
      const tOk = at(b, "boleh berjalan dari B ke A"), tNo = at(b, "tidak boleh dari A ke B");
      const pts = rpts(M, "BA");
      if (l < tNo - 0.3) pawn(ctx, M, along(pts, P(l, tOk - 0.3, 1.2)), P(l, tOk - 0.6, 0.3));
      else { const u = clamp((l - (tNo - 0.3)) / 1.0, 0, 1); const back = [lerp(pts[1][0], pts[0][0], 0.35 * Math.sin(Math.PI * u)), lerp(pts[1][1], pts[0][1], 0.35 * Math.sin(Math.PI * u))]; pawn(ctx, M, back); }
      alpha(ctx, P(l, tOk, 0.5), () => { text(ctx, "dari B ke A", 1100, 360, 60, { weight: 900, color: INK }); tick(ctx, 1560, 340, 70, P(l, tOk + 0.3, 0.5)); });
      alpha(ctx, P(l, tNo, 0.5), () => { text(ctx, "dari A ke B", 1100, 520, 60, { weight: 900, color: INK }); cross(ctx, 1560, 500, 70, P(l, tNo + 0.3, 0.5)); hand(ctx, "melawan panah", 1100, 590, 38, { color: RED, align: "left" }); });
    }
    if (id === "soal4") {
      const a = P(l, at(b, "dua huruf"), 0.5);
      alpha(ctx, a, () => {
        text(ctx, "B", 1180, 470, 170, { align: "center", weight: 900, color: INK });
        text(ctx, "A", 1440, 470, 170, { align: "center", weight: 900, color: INK });
      });
      const a1 = P(l, at(b, "Huruf pertama"), 0.5), a2 = P(l, at(b, "huruf kedua"), 0.5);
      alpha(ctx, a1, () => { mline(ctx, [[1180, 500], [1180, 560]], 1, ORANGE, 6, true); hand(ctx, "asal", 1180, 620, 50); });
      alpha(ctx, a2, () => { mline(ctx, [[1440, 500], [1440, 560]], 1, ORANGE, 6, true); hand(ctx, "tujuan", 1440, 620, 50); });
      alpha(ctx, a2, () => hand(ctx, "BA = dari B ke A", 1310, 720, 44, { color: INK }));
    }
    if (id === "soal5") {
      const a = P(l, at(b, "Bertrand"), 0.6);
      alpha(ctx, a, () => {
        [[1160, "Bertrand"], [1520, "Noam"]].forEach(([x, nm], i) => {
          beaver(ctx, x, 470 + Math.sin(l * 2.5 + i) * 5, 210);
          hand(ctx, nm, x, 640, 44, { color: "#7A4A2A" });
        });
        // papan "DAMAI"
        ctx.fillStyle = "#8C6A4A"; ctx.fillRect(1336, 300, 10, 200);
        card(ctx, 1230, 220, 220, 100, { fill: "#FFF4D6", stroke: "#B8892F", lw: 4, r: 12 });
        text(ctx, "DAMAI", 1340, 290, 50, { align: "center", weight: 900, color: "#2F7D46" });
      });
      const u = P(l, at(b, "jalan itu tertutup"), 0.5);
      alpha(ctx, u, () => { noEntry(ctx, 1080, 730, 40); hand(ctx, "satu jalan ditutup", 1130, 745, 42, { color: RED, align: "left" }); });
    }
    if (id === "soal6") {
      alpha(ctx, P(l, at(b, "Jadi, setelah"), 0.5), () => {
        hand(ctx, "Setelah satu jalan ditutup,", 1360, 300, 44, { color: INK });
        hand(ctx, "warga tetap bisa pergi", 1360, 390, 52, { color: GREEN });
        hand(ctx, "dari taman mana pun", 1360, 470, 52, { color: GREEN });
        hand(ctx, "ke taman mana pun,", 1360, 550, 52, { color: GREEN });
      });
      hand(ctx, "tetap searah panah.", 1360, 650, 44, { color: ORANGE, alpha: P(l, at(b, "mematuhi arah"), 0.5) });
    }
    if (id === "soal7") {
      card(ctx, PX + 10, 190, 920, 170, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "Jalan mana yang boleh dipilih", PX + 470, 260, 46, { align: "center", weight: 900, color: INK });
      text(ctx, "untuk aksi duduk damai?", PX + 470, 320, 46, { align: "center", weight: 900, color: INK });
      alpha(ctx, P(l, at(b, "dua jawaban"), 0.5), () => { hand(ctx, "Ada 2 jawaban benar.", PX + 470, 450, 54, { color: ORANGE }); });
      alpha(ctx, P(l, at(b, "Ayo"), 0.5), () => { text(ctx, "Tulis: huruf asal, lalu huruf tujuan.", PX + 470, 560, 36, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "Contoh: BA", PX + 470, 620, 36, { align: "center", weight: 800, color: C.ink2 }); });
    }
  }

  // ---------- 1. syarat ----------
  function syarat(ctx, b, l) {
    board(ctx);
    const M = MAPM, id = b.id, o = { roads: {} };
    if (id === "s1d") o.roads.ED = { mode: "block", blockU: P(l, at(b, "satu jalan ditutup"), 0.5) };
    if (id === "s1e") o.tags = P(l, at(b, "sepuluh jalan"), 0.6);
    drawMap(ctx, M, o);
    const R = RAD(M);
    if (id === "s1a") {
      kiko(ctx, 1500, 560, 220, -0.12, { mood: "happy" });
      hand(ctx, "Bisakah warga pergi", 1250, 300, 46, { color: INK, alpha: P(l, at(b, "apa artinya"), 0.5) });
      hand(ctx, "ke mana saja?", 1250, 360, 46, { color: INK, alpha: P(l, at(b, "apa artinya"), 0.5) });
      hand(ctx, "(belum ada jalan yang ditutup)", 1250, 750, 34, { color: C.ink2, alpha: P(l, at(b, "sebelum"), 0.5) });
    }
    if (id === "s1b" || id === "s1c") {
      const route = "DCEFBA";
      const times = id === "s1b" ? seqTimes(b, ["ke C", "ke E", "ke F", "ke B", "ke A"]) : null;
      const u = id === "s1b" ? routeU(l, times) : 5;
      trail(ctx, M, route, u); pawn(ctx, M, along(rpts(M, route), u), id === "s1b" ? P(l, at(b, "dari taman D") , 0.4) : 1);
      if (id === "s1b") { alpha(ctx, P(l, at(b, "dari taman D"), 0.4), () => { nodeMark(ctx, M, "D", "ring", 1, "#2F6FD0"); nodeMark(ctx, M, "A", "ring", P(l, at(b, "ke taman A"), 0.6), ORANGE); }); }
      text(ctx, "Dari D ke A:", 1000, 300, 44, { weight: 900, color: C.accentDark });
      seqText(ctx, route, 1000, 400, 62, id === "s1b" ? (l > at(b, "dari taman D") ? 1 + u : 0) : 6, {});
      if (id === "s1c") {
        nodeMark(ctx, M, "A", "tick", P(l, 0.3, 0.5));
        hand(ctx, "jauh tidak apa-apa,", 1360, 560, 54, { color: GREEN, alpha: P(l, at(b, "panjang"), 0.5) });
        hand(ctx, "asal sampai", 1360, 640, 54, { color: GREEN, alpha: P(l, at(b, "panjang"), 0.5) });
        hand(ctx, "yang penting: ada jalan searah panah", 1360, 740, 36, { color: INK, alpha: P(l, at(b, "Yang penting"), 0.5) });
      }
    }
    if (id === "s1d") {
      const t = at(b, "satu jalan ditutup"), route = "CED";
      const u = clamp((l - t - 0.6) / 1.4, 0, 1) * 1 + clamp((l - t - 2.0) / 0.8, 0, 1) * 0.35;
      pawn(ctx, M, along(rpts(M, route), u), P(l, t, 0.4));
      if (l > t + 3) text(ctx, "?", pos(M, "E")[0] + R * 1.5, pos(M, "E")[1] - R * 1.1, 70, { align: "center", weight: 900, color: RED });
      hand(ctx, "Kalau satu jalan ditutup,", 1380, 310, 46, { color: INK, alpha: P(l, t, 0.5) });
      hand(ctx, "mungkin ada warga yang", 1380, 380, 46, { color: INK, alpha: P(l, t, 0.5) });
      hand(ctx, "tidak bisa sampai.", 1380, 450, 46, { color: RED, alpha: P(l, t, 0.5) });
      alpha(ctx, P(l, at(b, "Kita harus mencari"), 0.5), () => {
        card(ctx, 1000, 560, 780, 150, { fill: "#EEF7F1", stroke: GREEN, lw: 3, r: 18 });
        text(ctx, "Cari jalan yang kalau ditutup,", 1390, 620, 38, { align: "center", weight: 900, color: INK });
        text(ctx, "semua warga tetap bisa sampai.", 1390, 675, 38, { align: "center", weight: 900, color: GREEN });
      });
    }
    if (id === "s1e") {
      text(ctx, "Sepuluh jalan:", 1000, 260, 44, { weight: 900, color: C.accentDark });
      const t0 = at(b, "sepuluh jalan");
      ROADS.forEach((r, i) => { const col = i % 5, row = Math.floor(i / 5); tagChip(ctx, r, 1060 + col * 165, 360 + row * 100, 44, { a: P(l, t0 + i * 0.12, 0.3) }); });
      hand(ctx, "coba satu per satu? melelahkan…", 1380, 600, 40, { color: C.ink2, alpha: P(l, at(b, "satu per satu"), 0.5) });
      hand(ctx, "cari cara yang lebih cerdas!", 1380, 690, 50, { color: ORANGE, alpha: P(l, at(b, "cara yang lebih cerdas"), 0.5) });
    }
  }

  // ---------- 2. mencoret ----------
  const ROWORD = ["A", "B", "C", "D", "E", "F", "G"];
  const FILL = { c5: ["A"], c6: ["A", "G"], c7: ["A", "G", "C", "D"], c8: ROWORD, c9: ROWORD };
  const LOCKED = { c5: ["BA", "AG"], c6: ["BA", "AG", "GB"], c7: ["BA", "AG", "GB", "CE", "ED", "DC"], c8: SOLE, c9: SOLE };
  const NEWROW = { c5: { A: "Taman A" }, c6: { G: "Taman G" }, c7: { C: "Taman C", D: "Taman D" }, c8: { F: "Taman F" } };
  function table(ctx, b, l, x, y) {
    const cw = [140, 290, 290], rh = 60, W = cw[0] + cw[1] + cw[2];
    card(ctx, x, y, W, rh, { fill: "#E6EEF3", r: 8 });
    ["Taman", "Masuk", "Keluar"].forEach((h, i) => text(ctx, h, x + cw.slice(0, i).reduce((s, v) => s + v, 0) + cw[i] / 2, y + 42, 32, { align: "center", weight: 900, color: INK }));
    const prevFill = { c5: [], c6: FILL.c5, c7: FILL.c6, c8: FILL.c7, c9: FILL.c8 }[b.id] || [];
    const fill = FILL[b.id] || [];
    ROWORD.forEach((n, r) => {
      const ry = y + rh * (r + 1);
      ctx.strokeStyle = "#D0D8DE"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, ry + rh); ctx.lineTo(x + W, ry + rh); ctx.stroke();
      text(ctx, n, x + cw[0] / 2, ry + 44, 36, { align: "center", weight: 900, color: INK });
      let a = fill.includes(n) ? 1 : 0;
      if (a && !prevFill.includes(n)) {
        // baris baru muncul saat namanya disebut (B dan E di c8 menyusul di akhir)
        const ph = NEWROW[b.id] && NEWROW[b.id][n] ? NEWROW[b.id][n] : null;
        const t = ph ? at(b, ph) : (b.id === "c8" ? at(b, "jalan itu juga") + 1.5 : 0.3);
        a = P(l, t, 0.5);
      }
      if (a <= 0) return;
      alpha(ctx, a, () => {
        [IN[n], OUT[n]].forEach((list, ci) => {
          const sole = list.length === 1, cx = x + cw[0] + (ci ? cw[1] : 0) + cw[1] / 2;
          const s = list.map(ARROW).join(",  ");
          text(ctx, s, cx, ry + 42, 32, { align: "center", weight: sole ? 900 : 700, color: sole ? ORANGE : C.ink2 });
          if (sole) { const w = tw(ctx, s, 32, 900); lock(ctx, cx + w / 2 + 24, ry + 31, 22); }
        });
      });
    });
    ctx.strokeStyle = "#9AA6AF"; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, W, rh * 8);
    ctx.beginPath(); [cw[0], cw[0] + cw[1]].forEach(dx => { ctx.moveTo(x + dx, y); ctx.lineTo(x + dx, y + rh * 8); }); ctx.stroke();
  }
  function coret(ctx, b, l) {
    board(ctx);
    const M = MAPM, id = b.id, o = { roads: {}, tags: 0 };
    const R = RAD(M);
    let lockSet = LOCKED[id] || [], prev = { c6: LOCKED.c5, c7: LOCKED.c6, c8: LOCKED.c7, c9: SOLE }[id] || [];
    const lockAt = r => {
      if (prev.includes(r)) return 1;
      if (!lockSet.includes(r)) return 0;
      const T = { c5: { BA: "jalan dari B ke A", AG: "jalan dari A ke G" }, c6: { GB: "Jadi, jalan dari G ke B" }, c7: { CE: "Jadi, ketiga", ED: "Jadi, ketiga", DC: "Jadi, ketiga" }, c8: { EF: "Jadi, jalan itu" } }[id] || {};
      return P(l, T[r] ? at(b, T[r]) + 0.4 : 0, 0.5);
    };
    if (id === "c1") { const t = at(b, "Kalau jalan itu ditutup"); o.roads.AG = { glow: ORANGE, gu: P(l, at(b, "jalan dari A ke G") - 0.4, 0.4) * (l < t ? 0.6 + 0.4 * Math.sin(l * 8) : 1), mode: l > t ? "block" : undefined, blockU: P(l, t, 0.5) }; }
    if (id === "c2") { const t = at(b, "Kalau jalan itu ditutup"); o.roads.BA = { glow: ORANGE, gu: P(l, at(b, "jalan dari B ke A") - 0.4, 0.4) * (l < t ? 0.6 + 0.4 * Math.sin(l * 8) : 1), mode: l > t ? "block" : undefined, blockU: P(l, t, 0.5) }; }
    if (id >= "c4" && id <= "c9") o.tags = 1;
    ROADS.forEach(r => { const u = lockAt(r); if (u > 0) o.roads[r] = Object.assign(o.roads[r] || {}, { mode: u > 0.5 ? "lock" : undefined }); });
    if (id === "c9") ["BC", "FB", "FG"].forEach(r => o.roads[r] = { glow: "#2F6FD0", gu: P(l, at(b, "tiga jalan"), 0.6), tagColor: "#2F6FD0" });
    drawMap(ctx, M, o);
    if (id === "c1") {
      const t = at(b, "Kalau jalan itu ditutup");
      pawn(ctx, M, pos(M, "A"), P(l, t, 0.4));
      nodeMark(ctx, M, "A", "ring", P(l, at(b, "terkurung"), 0.6), RED);
      noteCard(ctx, 1000, 220, 800, ["Taman A: hanya 1 jalan keluar", "yaitu jalan dari A ke G (AG)"], P(l, at(b, "Hanya ada satu"), 0.5));
      alpha(ctx, P(l, at(b, "terkurung"), 0.5), () => hand(ctx, "AG ditutup → warga di A terkurung", 1400, 560, 44, { color: RED }));
    }
    if (id === "c2") {
      const t = at(b, "Kalau jalan itu ditutup");
      const pB = pos(M, "B"), pA = pos(M, "A"); const u = clamp((l - t - 0.4) / 1.0, 0, 1) * 0.42;
      pawn(ctx, M, [lerp(pB[0], pA[0], u), lerp(pB[1], pA[1], u)], P(l, t, 0.4));
      if (l > t + 1.6) nodeMark(ctx, M, "A", "cross", P(l, t + 1.6, 0.5));
      noteCard(ctx, 1000, 220, 800, ["Taman A: hanya 1 jalan masuk", "yaitu jalan dari B ke A (BA)"], P(l, at(b, "satu jalan masuk"), 0.5));
      alpha(ctx, P(l, at(b, "tidak ada warga"), 0.5), () => hand(ctx, "BA ditutup → tidak ada yang bisa", 1400, 560, 42, { color: RED }));
      alpha(ctx, P(l, at(b, "tidak ada warga"), 0.5), () => hand(ctx, "datang ke taman A", 1400, 615, 42, { color: RED }));
    }
    if (id === "c3") {
      text(ctx, "Aturan penting", 1000, 250, 44, { weight: 900, color: C.accentDark });
      const r1 = P(l, at(b, "satu-satunya jalan keluar"), 0.5), r2 = P(l, at(b, "satu-satunya jalan masuk"), 0.5);
      alpha(ctx, r1, () => { card(ctx, 1000, 300, 820, 160, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 18 }); lock(ctx, 1070, 380, 44); text(ctx, "Satu-satunya jalan KELUAR", 1130, 365, 40, { weight: 900, color: INK }); text(ctx, "dari sebuah taman → jangan ditutup", 1130, 420, 36, { weight: 800, color: ORANGE }); });
      alpha(ctx, r2, () => { card(ctx, 1000, 500, 820, 160, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 18 }); lock(ctx, 1070, 580, 44); text(ctx, "Satu-satunya jalan MASUK", 1130, 565, 40, { weight: 900, color: INK }); text(ctx, "ke sebuah taman → jangan ditutup", 1130, 620, 36, { weight: 800, color: ORANGE }); });
    }
    if (id >= "c4" && id <= "c9") {
      table(ctx, b, l, 940, 160);
      if (id === "c4") thinkBadge(ctx, 940, 668, 880, 108, l, b.dur, "Hitung jalan masuk dan keluar setiap taman.");
      else roadList(ctx, 950, 720, 32, r => {
        const s = lockAt(r), cand = ["BC", "FB", "FG"].includes(r);
        return { strike: s, color: s > 0.5 ? "#A3ADB5" : INK, ring: id === "c9" && cand ? P(l, at(b, "tiga jalan"), 0.6) : 0, stroke: id === "c9" && cand ? "#2F6FD0" : "#7A858E" };
      });
    }
  }

  // ---------- 3. menguji ----------
  const CANDS = ["BC", "FB", "FG"];
  function candCards(ctx, b, l) {
    const id = b.id, st = {};
    // status: 0 belum, "x" gagal, "v" berhasil, "t" sedang diuji
    const order = ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8", "u9"], k = order.indexOf(id);
    st.BC = k >= 2 ? "x" : k >= 1 ? "t" : 0; st.FB = k >= 6 ? "v" : k >= 3 ? "t" : 0; st.FG = k >= 8 ? "v" : k >= 7 ? "t" : 0;
    CANDS.forEach((r, i) => {
      const x = 960 + i * 300, y = 165, s = st[r];
      card(ctx, x, y, 270, 120, { fill: s === "t" ? "#FFF3E3" : s === "v" ? "#E9F6EE" : s === "x" ? "#FBECEA" : "#F3F6F8", stroke: s === "t" ? ORANGE : s === "v" ? GREEN : s === "x" ? RED : "#B8C3CA", lw: s ? 4 : 2.5, r: 18 });
      text(ctx, ARROW(r), x + 105, y + 78, 50, { align: "center", weight: 900, color: INK });
      const fresh = (r === "BC" && id === "u3") || (r === "FB" && id === "u7") || (r === "FG" && id === "u9");
      const u = fresh ? P(l, 0.5, 0.6) : 1;
      if (s === "x") cross(ctx, x + 222, y + 60, 56, u);
      if (s === "v") tick(ctx, x + 222, y + 60, 56, u);
      if (s === "t") noEntry(ctx, x + 222, y + 60, 26);
    });
  }
  function uji(ctx, b, l) {
    board(ctx);
    const M = MAPM, id = b.id, o = { roads: {}, tags: 1 };
    const R = RAD(M);
    const blocked = { u2: "BC", u3: "BC", u4: "FB", u5: "FB", u6: "FB", u7: "FB", u8: "FG", u9: "FG" }[id];
    if (blocked) {
      let bu = 1;
      if (id === "u2") bu = P(l, at(b, "menutup jalan"), 0.5);
      if (id === "u4") bu = P(l, at(b, "kita tutup"), 0.5);
      if (id === "u8") bu = P(l, at(b, "kita tutup"), 0.5);
      o.roads[blocked] = { mode: "block", blockU: bu };
      if (id === "u4" && l < at(b, "kita tutup")) o.roads.FB = {};
      if (id === "u8" && l < at(b, "kita tutup")) o.roads.FG = {};
    }
    if (id === "u4") o.roads.BC = { glow: GREEN, gu: P(l, at(b, "buka lagi"), 0.4) * (1 - P(l, at(b, "kita tutup"), 0.5)) };
    if (id === "u8") o.roads.FB = { glow: GREEN, gu: P(l, at(b, "buka lagi"), 0.4) * (1 - P(l, at(b, "kita tutup"), 0.5)) };
    if (id === "u7") o.roads.FB.glow = GREEN;
    if (id === "u9") o.roads.FG.glow = GREEN;
    drawMap(ctx, M, o);
    candCards(ctx, b, l);
    if (id === "u1") thinkBadge(ctx, 960, 560, 860, 112, l, b.dur, "Tutup satu calon, lalu periksa.");
    if (id === "u1") alpha(ctx, P(l, at(b, "belum tentu"), 0.5), () => hand(ctx, "belum tentu benar → uji satu per satu", 1390, 420, 40, { color: INK }));
    if (id === "u2" || id === "u3") {
      const route = "BAGB";
      const u = id === "u2" ? routeU(l, seqTimes(b, ["ke A", "ke G", "ke B"], "Jalan keluar")) : 3;
      trail(ctx, M, route, u);
      const loopU = id === "u3" ? 3 + ((l * 0.5) % 1) * 3 : u;   // terus berputar
      const pts = rpts(M, id === "u3" ? "BAGBAGB" : route);
      pawn(ctx, M, along(pts, id === "u3" ? (l * 1.2) % 6 : u), id === "u2" ? P(l, at(b, "Seorang warga"), 0.4) : 1);
      text(ctx, "Dari B:", 960, 380, 40, { weight: 900, color: C.accentDark });
      seqText(ctx, route, 960, 460, 56, id === "u2" ? (l > at(b, "Seorang warga") ? 1 + u : 0) : 4);
      if (id === "u3") {
        ["C", "D", "E", "F"].forEach((n, i) => nodeMark(ctx, M, n, "cross", P(l, at(b, "taman C") + i * 0.3, 0.4)));
        hand(ctx, "hanya berputar di B, A, G", 1390, 560, 42, { color: INK, alpha: P(l, at(b, "berputar"), 0.5) });
        hand(ctx, "C, D, E, F tidak bisa dicapai", 1390, 630, 42, { color: RED, alpha: P(l, at(b, "taman C"), 0.5) });
        hand(ctx, "BC tidak boleh ditutup", 1390, 720, 44, { color: RED, alpha: P(l, at(b, "Jadi, jalan"), 0.5) });
      }
    }
    if (id === "u4") {
      alpha(ctx, P(l, at(b, "satu rute keliling"), 0.5), () => {
        card(ctx, 960, 340, 860, 200, { fill: "#EEF4FB", stroke: "#2F6FD0", lw: 3, r: 18 });
        text(ctx, "Cari rute keliling:", 1390, 410, 44, { align: "center", weight: 900, color: "#2F6FD0" });
        text(ctx, "lewati ketujuh taman,", 1390, 465, 38, { align: "center", weight: 800, color: INK });
        text(ctx, "lalu kembali ke taman awal.", 1390, 515, 38, { align: "center", weight: 800, color: INK });
      });
    }
    if (id === "u5" || id === "u6" || id === "u7" || id === "u8" || id === "u9") {
      const key = id === "u8" || id === "u9" ? "FG" : "FB", route = TOUR[key], n = route.length - 1;
      let u = n;
      if (id === "u5") u = routeU(l, seqTimes(b, ["ke A", "ke G", "ke B", "ke C", "ke E", "ke D", "ke C", "ke E", "ke F", "ke G", "ke B"], "Kita mulai"));
      if (id === "u8") u = routeU(l, seqTimes(b, ["ke A", "ke G", "ke B", "ke C", "ke E", "ke D", "ke C", "ke E", "ke F", "ke B"], "Dari B ke A"), 0.6);
      trail(ctx, M, route, u, id === "u6" ? "rgba(238,122,18,0.45)" : undefined);
      const visited = new Set(route.slice(0, Math.floor(u) + 1).split(""));
      if (id !== "u6") "ABCDEFG".split("").forEach(nn => { if (visited.has(nn)) nodeMark(ctx, M, nn, "tick", (id === "u5" || id === "u8") ? clamp((u - route.indexOf(nn)) * 2, 0, 1) : 1); });
      if (id === "u5" || id === "u8") pawn(ctx, M, along(rpts(M, route), u), P(l, 0.2, 0.4));
      text(ctx, "Rute keliling:", 960, 380, 40, { weight: 900, color: C.accentDark });
      const sz = 38;
      seqText(ctx, route, 960, 450, sz, (id === "u5" || id === "u8") ? 1 + u : n + 1);
      if (id === "u5" || id === "u8" || id === "u7" || id === "u9") {
        const done = id === "u7" || id === "u9" || u >= n - 0.05;
        hand(ctx, "7 taman terlewati, kembali ke B ✓", 1390, 560, 42, { color: GREEN, alpha: done ? (id === "u5" ? P(l, at(b, "Kita sudah melewati"), 0.5) : id === "u8" ? P(l, seqTimes(b, ["langsung ke B"])[0], 0.5) : 1) : 0 });
      }
      if (id === "u6") {
        // contoh: dari E (setelah D, C) ke A, ikuti rute
        const sub = "EFGBA", t0 = at(b, "mengikuti rute"), uu = clamp((l - t0) / 3.2, 0, 1) * 4;
        trail(ctx, M, sub, uu, "rgba(47,111,208,0.85)"); pawn(ctx, M, along(rpts(M, sub), uu), P(l, t0 - 0.3, 0.3), "#2F6FD0");
        alpha(ctx, P(l, t0 - 0.3, 0.4), () => { text(ctx, "Contoh: dari E ke A", 960, 560, 40, { weight: 900, color: "#2F6FD0" }); seqText(ctx, sub, 960, 630, 46, 1 + uu); });
        hand(ctx, "rute lewat semua taman → semua bisa dicapai", 1390, 730, 36, { color: GREEN, alpha: P(l, at(b, "Rute itu melewati"), 0.5) });
      }
      if (id === "u7" || id === "u9") {
        const ans = id === "u7" ? "Jawaban 1: FB" : "Jawaban 2: FG";
        alpha(ctx, P(l, at(b, "Inilah"), 0.5), () => { card(ctx, 1110, 610, 560, 120, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 20 }); text(ctx, ans, 1390, 690, 60, { align: "center", weight: 900, color: GREEN }); });
      }
    }
  }

  // ---------- 4. jawaban ----------
  function jawab(ctx, b, l) {
    board(ctx);
    const M = MAPM, id = b.id, o = { roads: {}, tags: 1 };
    if (id === "j1") { o.roads.FB = { glow: GREEN, tagColor: GREEN }; o.roads.FG = { glow: GREEN, tagColor: GREEN }; }
    if (id === "j2") {
      const ph = Math.floor(Math.max(0, l - at(b, "Kalau satu jalan")) / 1.8) % 2, on = l > at(b, "Kalau satu jalan");
      o.roads.FB = { glow: GREEN, gu: on && ph === 1 ? 0 : 1, mode: on && ph === 1 ? "block" : undefined };
      o.roads.FG = { glow: GREEN, gu: on && ph === 0 ? 0 : 1, mode: on && ph === 0 ? "block" : undefined };
      o.roads.GB = { glow: GREEN, gu: P(l, at(b, "Dari G"), 0.5) * (on && ph === 0 ? 0 : 1) };
    }
    if (id === "j3") { o.roads.FB = { glow: GREEN, tagColor: GREEN }; }
    drawMap(ctx, M, o);
    const R = RAD(M);
    if (id === "j1") {
      ["FB", "FG"].forEach((r, i) => { const g = roadGeom(M, r); ring(ctx, g.mx, g.my, R * 1.1, R * 1.1, P(l, 0.3 + i * 0.4, 0.6), GREEN, 6); });
      card(ctx, 1000, 260, 800, 170, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 });
      text(ctx, "Jawaban: FB atau FG", 1400, 368, 66, { align: "center", weight: 900, color: GREEN });
      hand(ctx, "cocok dengan soal: ada 2 jawaban", 1400, 560, 44, { color: INK, alpha: P(l, at(b, "Hasil ini"), 0.5) });
    }
    if (id === "j2") {
      nodeMark(ctx, M, "F", "ring", P(l, at(b, "keluar dari taman F"), 0.6), ORANGE);
      alpha(ctx, P(l, at(b, "keluar dari taman F"), 0.5), () => { text(ctx, "F → B", 1100, 330, 60, { weight: 900, color: INK }); });
      alpha(ctx, P(l, at(b, "Dari G"), 0.5), () => { text(ctx, "F → G → B", 1100, 430, 60, { weight: 900, color: INK }); });
      alpha(ctx, P(l, at(b, "sama-sama"), 0.5), () => hand(ctx, "keduanya membawa warga ke B", 1400, 560, 44, { color: GREEN }));
      alpha(ctx, P(l, at(b, "menggantikannya"), 0.5), () => hand(ctx, "yang satu bisa menggantikan yang lain", 1400, 640, 40, { color: ORANGE }));
    }
    if (id === "j3") {
      alpha(ctx, P(l, at(b, "FB berarti"), 0.5), () => { text(ctx, "FB", 1060, 360, 90, { weight: 900, color: GREEN }); text(ctx, "= dari F ke B", 1220, 350, 46, { weight: 800, color: INK }); tick(ctx, 1730, 330, 70, P(l, at(b, "FB berarti") + 0.5, 0.5)); });
      alpha(ctx, P(l, at(b, "BF"), 0.5), () => { text(ctx, "BF", 1060, 540, 90, { weight: 900, color: RED }); text(ctx, "= dari B ke F", 1220, 530, 46, { weight: 800, color: INK }); cross(ctx, 1730, 510, 70, P(l, at(b, "padahal"), 0.5)); });
      hand(ctx, "jalan dari B ke F tidak ada di peta", 1400, 670, 40, { color: RED, alpha: P(l, at(b, "padahal"), 0.5) });
    }
  }

  // ---------- 5. penutup ----------
  function phoneNav(ctx, x, y, s) {   // HP dengan peta navigasi sederhana (digambar dengan kode)
    ctx.fillStyle = "#2B3440"; rr(ctx, x, y, s * 0.55, s, s * 0.07); ctx.fill();
    ctx.fillStyle = "#EAF2E6"; rr(ctx, x + s * 0.04, y + s * 0.08, s * 0.47, s * 0.82, s * 0.03); ctx.fill();
    ctx.strokeStyle = "#C7CFD5"; ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(x + s * 0.04, y + s * 0.35); ctx.lineTo(x + s * 0.51, y + s * 0.3); ctx.moveTo(x + s * 0.2, y + s * 0.08); ctx.lineTo(x + s * 0.3, y + s * 0.9); ctx.stroke();
    ctx.strokeStyle = "#2F6FD0"; ctx.lineWidth = s * 0.035; ctx.beginPath(); ctx.moveTo(x + s * 0.12, y + s * 0.78); ctx.lineTo(x + s * 0.27, y + s * 0.6); ctx.lineTo(x + s * 0.24, y + s * 0.33); ctx.lineTo(x + s * 0.42, y + s * 0.2); ctx.stroke();
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x + s * 0.42, y + s * 0.2, s * 0.04, 0, Math.PI * 2); ctx.fill();
  }
  function computer(ctx, x, y, s, col = "#2B3440") {
    ctx.fillStyle = col; rr(ctx, x - s * 0.5, y - s * 0.38, s, s * 0.62, s * 0.06); ctx.fill();
    ctx.fillStyle = "#BFE3F2"; rr(ctx, x - s * 0.42, y - s * 0.31, s * 0.84, s * 0.48, s * 0.03); ctx.fill();
    ctx.fillStyle = col; ctx.fillRect(x - s * 0.08, y + s * 0.24, s * 0.16, s * 0.12); rr(ctx, x - s * 0.28, y + s * 0.34, s * 0.56, s * 0.07, s * 0.03); ctx.fill();
  }
  function graf(ctx, b, l) {
    board(ctx);
    const M = MAPM, R = RAD(M), u = P(l, at(b, "titik"), 1.0);
    alpha(ctx, 1 - u, () => drawMap(ctx, M, {}));
    alpha(ctx, u, () => {
      ROADS.forEach(id => { const g = roadGeom(M, id); mline(ctx, [g.a, g.b], 1, INK, 6, true); });
      "ABCDEFG".split("").forEach(n => { const [x, y] = pos(M, n); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, R * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); text(ctx, n, x, y + R * 0.3, R * 0.85, { align: "center", weight: 900, color: INK }); });
    });
    hand(ctx, "graf berarah", 1380, 280, 66, { color: C.kiko, alpha: P(l, at(b, "graf berarah"), 0.5) });
    alpha(ctx, P(l, at(b, "Tamannya"), 0.5), () => { text(ctx, "taman  →  titik", 1100, 390, 44, { weight: 800, color: INK }); });
    alpha(ctx, P(l, at(b, "jalan satu arahnya"), 0.5), () => { text(ctx, "jalan satu arah  →  panah", 1100, 460, 44, { weight: 800, color: INK }); });
    alpha(ctx, P(l, at(b, "aplikasi navigasi"), 0.5), () => { phoneNav(ctx, 1130, 540, 220); text(ctx, "navigasi", 1190, 800, 30, { align: "center", weight: 800, color: C.ink2 }); });
    alpha(ctx, P(l, at(b, "jaringan internet"), 0.5), () => { computer(ctx, 1520, 610, 120); computer(ctx, 1700, 700, 100); mline(ctx, [[1560, 660], [1660, 690]], 1, "#2F6FD0", 5); text(ctx, "jaringan", 1610, 800, 30, { align: "center", weight: 800, color: C.ink2 }); });
  }
  function jaringan(ctx, b, l) {
    board(ctx);
    const N = { S: [300, 470], P: [700, 260], Q: [700, 680], T: [1100, 470], U: [1500, 470] };
    const L = [["S", "P"], ["S", "Q"], ["P", "T"], ["Q", "T"], ["T", "U"]];
    const tb = at(b, "satu jalur yang rusak"), broke = P(l, tb, 0.5);
    L.forEach(([p, q]) => {
      const bad = p === "P" && q === "T";
      ctx.save(); if (bad && broke > 0) ctx.setLineDash([16, 14]);
      ctx.strokeStyle = bad && broke > 0 ? RED : "#7E8A93"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(...N[p]); ctx.lineTo(...N[q]); ctx.stroke(); ctx.restore();
      if (bad && broke > 0) cross(ctx, (N.P[0] + N.T[0]) / 2, (N.P[1] + N.T[1]) / 2, 60, broke);
    });
    Object.entries(N).forEach(([k, p]) => computer(ctx, p[0], p[1], 130, k === "S" || k === "U" ? C.kiko : "#2B3440"));
    // paket data: S → P → T → U sebelum rusak, S → Q → T → U sesudahnya
    const route = l < tb ? ["S", "P", "T", "U"] : ["S", "Q", "T", "U"];
    const t0 = l < tb ? 0.3 : tb + 0.6, uu = ((l - t0) / 3.6) % 1 * 3;
    if (l > t0) { const pts = route.map(k => N[k]); const p = along(pts, uu); ctx.fillStyle = ORANGE; rr(ctx, p[0] - 26, p[1] - 70, 52, 36, 6); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0] - 22, p[1] - 66); ctx.lineTo(p[0], p[1] - 50); ctx.lineTo(p[0] + 22, p[1] - 66); ctx.stroke(); }
    text(ctx, "data", 300, 590, 30, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "tujuan", 1500, 590, 30, { align: "center", weight: 800, color: C.ink2 });
    alpha(ctx, P(l, at(b, "Karena itu"), 0.5), () => { hand(ctx, "← jalur cadangan", 800, 700, 44, { color: GREEN, align: "left" }); });
    hand(ctx, "data tetap sampai", 1500, 330, 42, { color: GREEN, alpha: P(l, tb + 1.5, 0.5) });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Coret jalan yang satu-satunya masuk atau keluar.", "Uji calon yang tersisa satu per satu.", "Cari rute keliling yang melewati semua taman."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 46, { weight: 900, color: INK, fit: 1140 });
        const ix = 1600, iy = y + 80;
        if (i === 0) lock(ctx, ix, iy, 70);
        if (i === 1) noEntry(ctx, ix, iy, 46);
        if (i === 2) { ctx.strokeStyle = ORANGE; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(ix, iy, 46, 0.3, Math.PI * 1.85); ctx.stroke(); mline(ctx, [[ix + 40, iy - 30], [ix + 46, iy - 10]], 1, ORANGE, 9, true); }
      });
    });
  }

  // ---------- versi tegak untuk Short (area x 440–1480, y 140–800) ----------
  const MAPV = { ox: 683, oy: 222, s: 0.56 };
  function peta_v(ctx, b, l) {
    board(ctx);
    const M = MAPV, id = b.id, o = { roads: {} }, R = RAD(M);
    let note = "", nc = INK;
    if (id === "h0") { note = "7 taman · 10 jalan satu arah"; ROADS.forEach((r, i) => o.roads[r] = { a: P(l, 0.3 + i * 0.15, 0.3) }); }
    if (id === "h1") { note = "Jalan mana yang boleh ditutup? (2 jawaban)"; nc = ORANGE; }
    if (id === "h2") { o.roads.AG = { glow: ORANGE, mode: l > at(b, "Kalau jalan itu") ? "block" : undefined, blockU: P(l, at(b, "Kalau jalan itu"), 0.5) }; note = "A hanya punya 1 jalan keluar"; nc = RED; }
    if (id === "h3") { o.tags = 1; SOLE.forEach(r => o.roads[r] = { mode: P(l, 0.5, 0.5) > 0.5 ? "lock" : undefined }); CANDS.forEach(r => o.roads[r] = { glow: "#2F6FD0", gu: P(l, at(b, "Tinggal"), 0.5), tagColor: "#2F6FD0" }); note = "Tinggal 3 calon: BC, FB, FG"; nc = "#2F6FD0"; }
    if (id === "h4") { o.tags = 1; o.roads.BC = { mode: "block" }; note = "BC ditutup: C, D, E, F tak tercapai"; nc = RED; }
    if (id === "h5") { o.tags = 1; o.roads.FB = { glow: GREEN, tagColor: GREEN }; o.roads.FG = { glow: GREEN, tagColor: GREEN }; note = "Jawaban: FB atau FG"; nc = GREEN; }
    drawMap(ctx, M, o);
    if (id === "h1") ["BA", "AG", "GB", "FB", "BC", "CE", "ED", "DC", "EF", "FG"].forEach((r, i) => { const g = roadGeom(M, r); alpha(ctx, 0.5 + 0.5 * Math.sin(l * 3 + i), () => text(ctx, "?", g.mx + g.nx * R * 0.8, g.my + g.ny * R * 0.8 + 14, 40, { align: "center", weight: 900, color: ORANGE })); });
    if (id === "h2") { pawn(ctx, M, pos(M, "A"), P(l, at(b, "Kalau jalan itu"), 0.4)); nodeMark(ctx, M, "A", "ring", P(l, at(b, "terkurung"), 0.6), RED); }
    if (id === "h4") { const u = routeU(l, seqTimes(b, ["B,", "A,", "G."], "berputar di")) ; trail(ctx, M, "BAGB", u); pawn(ctx, M, along(rpts(M, "BAGB"), u)); ["C", "D", "E", "F"].forEach((n, i) => nodeMark(ctx, M, n, "cross", P(l, at(b, "Jadi, jalan") - 1.2 + i * 0.2, 0.4))); }
    if (id === "h5") { const route = TOUR.FB, u = clamp((l - 0.6) / Math.max(1, at(b, "Jadi, jawabannya") - 1), 0, 1) * (route.length - 1); trail(ctx, M, route, u); pawn(ctx, M, along(rpts(M, route), u)); }
    if (note) text(ctx, note, 960, 795, 40, { align: "center", weight: 900, color: nc, fit: 1000 });
  }

  // ---------- akhir, ajakan Short ----------
  function akhir(ctx, b, l) {
    board(ctx);
    kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
    [640, 860].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
    drawMap(ctx, { ox: 650, oy: 575, s: 0.19 }, {});
    card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
    text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
    const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
    L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
    para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
    hand(ctx, "Semoga sukses!", 330, 790, 50, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
  }
  function cta_bebras(ctx, b, l) {
    board(ctx);
    text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
    text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "Coret, uji, lalu buktikan dengan rute keliling", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
    kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
  }

  Object.assign(K.SCENES, { buka, kredit, kota, syarat, coret, uji, jawab, graf, jaringan, langkah, akhir, peta_v, cta_bebras });
})(typeof window !== "undefined" ? window : globalThis);
