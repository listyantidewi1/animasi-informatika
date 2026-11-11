/* PG04 Pembahasan Soal Bebras 2025-TW-04 "Buletin Pulau Berang-berang" (Taiwan), kategori Penegak (SMA).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras) + simulasi:
   pulau dengan 18 desa dan 25 jalan (letak desa dan jalan meniru gambar soal), amplop yang menyebar ke tetangga,
   angka hari di samping setiap desa (lapis demi lapis, breadth-first search).
   Jawaban dihitung ulang di kode (BFS dari J harus 4, dari A harus 6) dan dilaporkan lewat K._warn bila salah.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Buletin Pulau Berang-berang", tahun: "2025", negara: "Taiwan", kode: "2025-TW-04" };

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
  function flagTW(ctx, x, y, w) {   // bendera seperti di gambar soal: merah, kanton biru dengan matahari putih 12 sinar
    const h = w * 2 / 3;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#FE0000"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#000095"; ctx.fillRect(x, y, w / 2, h / 2);
    const cx = x + w / 4, cy = y + h / 4, R = h * 0.19;
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath();
    for (let k = 0; k < 24; k++) { const a = -Math.PI / 2 + k * Math.PI / 12, r = k % 2 ? R * 0.62 : R; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#000095"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- pulau, desa, jalan ----------
  // letak desa diukur dari gambar soal (diperbesar 3×, digeser sehingga desa Q di 0,0)
  const NP = {
    Q: [0, 0], F: [215, 70], K: [440, 95], P: [730, 100], C: [115, 185], H: [340, 210], N: [615, 225],
    A: [15, 275], E: [235, 320], J: [455, 330], O: [765, 350], B: [65, 440], G: [350, 475], M: [635, 460],
    R: [900, 520], D: [235, 600], I: [535, 615], L: [760, 600]
  };
  const NODES = Object.keys(NP).sort();
  // 25 jalan, dibaca dari gambar soal yang diperbesar
  const EDGES = "QF FK KP QA FC CA CE AB BE BD EJ KH HN HJ NM JG JM GD GI IL MO ML PO OL LR".split(" ");
  const ADJ = {}; NODES.forEach(n => ADJ[n] = []);
  EDGES.forEach(e => { ADJ[e[0]].push(e[1]); ADJ[e[1]].push(e[0]); });
  function bfs(s) { const d = { [s]: 0 }, q = [s]; while (q.length) { const u = q.shift(); ADJ[u].slice().sort().forEach(w => { if (d[w] == null) { d[w] = d[u] + 1; q.push(w); } }); } return d; }
  const DJ = bfs("J"), DA = bfs("A");
  const maxD = d => Math.max(...Object.values(d));
  if (NODES.length !== 18 || EDGES.length !== 25) (K._warn = K._warn || []).push("peta salah");
  if (maxD(DJ) !== 4 || maxD(DA) !== 6) (K._warn = K._warn || []).push("jawaban salah: J " + maxD(DJ) + ", A " + maxD(DA));
  if (DA.B !== 1 || DA.C !== 1 || DA.Q !== 1 || DA.D !== 2 || DA.E !== 2 || DA.F !== 2) (K._warn = K._warn || []).push("contoh soal tidak cocok");
  const LAYERS = d => { const L = []; NODES.forEach(n => { (L[d[n]] = L[d[n]] || []).push(n); }); return L; };
  if (LAYERS(DJ).map(x => x.join("")).join("|") !== "J|EGHM|BCDIKLNO|AFPR|Q") (K._warn = K._warn || []).push("lapis J salah");
  const edgeKey = (a, b2) => EDGES.includes(a + b2) ? a + b2 : EDGES.includes(b2 + a) ? b2 + a : null;

  // warna lapis (hari 0–6)
  const DAYC = ["#6A4BC4", "#2F6FD0", "#23964F", "#EE7A12", "#D9443B", "#A0527A", "#5F6A73"];
  const HR = 40;   // setengah lebar rumah (satuan peta)
  const BADGE = { Q: [-58, 12], F: [0, -78], K: [0, -78], P: [56, -36], C: [-58, -30], H: [-58, -30], N: [58, -30], A: [-60, -10],
                  E: [0, 82], J: [56, -48], O: [60, -28], B: [-60, 0], G: [-66, 0], M: [56, -50], R: [0, -78], D: [-62, -10], I: [-58, 32], L: [62, 32] };
  const ISLE = [[-70, -55], [200, -60], [470, -20], [760, 20], [905, 70], [950, 250], [995, 470], [960, 600], [820, 670], [560, 680], [330, 675], [150, 660], [20, 560], [-90, 420], [-120, 200], [-110, 30]];
  const pos = (M, n) => [M.ox + NP[n][0] * M.s, M.oy + NP[n][1] * M.s];

  function island(ctx, M) {
    const pts = ISLE.map(([x, y]) => [M.ox + x * M.s, M.oy + y * M.s]);
    ctx.save(); ctx.fillStyle = "#86C25A"; ctx.beginPath();
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    let m0 = mid(pts[pts.length - 1], pts[0]); ctx.moveTo(m0[0], m0[1]);
    pts.forEach((p, i) => { const m = mid(p, pts[(i + 1) % pts.length]); ctx.quadraticCurveTo(p[0], p[1], m[0], m[1]); });
    ctx.closePath(); ctx.fill();
    // rumput kecil
    ctx.strokeStyle = "#5E9E38"; ctx.lineWidth = Math.max(2, 4 * M.s); ctx.lineCap = "round";
    [[120, 20], [320, 0], [560, 60], [840, 230], [180, 400], [500, 390], [470, 560], [80, 600], [700, 300]].forEach(([x, y]) => {
      const gx = M.ox + x * M.s, gy = M.oy + y * M.s, s = 14 * M.s;
      ctx.beginPath(); [-1, 0, 1].forEach(k => { ctx.moveTo(gx + k * s, gy); ctx.lineTo(gx + k * s * 1.4, gy - s * (k ? 1.1 : 1.6)); }); ctx.stroke();
    });
    ctx.restore();
  }
  function roadLine(ctx, M, e, opt = {}) {
    const [x1, y1] = pos(M, e[0]), [x2, y2] = pos(M, e[1]), w = 11 * M.s;
    if (opt.glow) { alpha(ctx, opt.gu == null ? 1 : opt.gu, () => { ctx.strokeStyle = opt.glow; ctx.lineWidth = w * 2.6; ctx.lineCap = "round"; ctx.globalAlpha *= 0.75; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }); }
    alpha(ctx, opt.a == null ? 1 : opt.a, () => { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
  }
  function house(ctx, M, n, a = 1, opt = {}) {
    if (a <= 0) return;
    const [x, y] = pos(M, n), s = HR * M.s;
    alpha(ctx, a, () => {
      ctx.save(); ctx.translate(x, y + (1 - clamp(a, 0, 1)) * 10);
      if (opt.dim) ctx.globalAlpha *= 0.45;
      ctx.fillStyle = "#F3D98B"; ctx.strokeStyle = "#5A4630"; ctx.lineWidth = Math.max(2, 3 * M.s);
      rr(ctx, -s * 0.78, -s * 0.2, s * 1.56, s * 1.05, s * 0.12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#E07A3C"; ctx.beginPath(); ctx.moveTo(-s * 0.98, -s * 0.12); ctx.lineTo(0, -s * 0.95); ctx.lineTo(s * 0.98, -s * 0.12); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#C96430"; ctx.fillRect(s * 0.42, -s * 0.85, s * 0.2, s * 0.38);
      ctx.restore();
      ctx.save(); ctx.font = `900 ${s * 1.15}px ${K.FONT}`; ctx.textAlign = "center"; ctx.lineJoin = "round";
      ctx.lineWidth = s * 0.26; ctx.strokeStyle = "#1E242A"; ctx.strokeText(n, x, y + s * 0.62);
      ctx.fillStyle = "#FFFFFF"; ctx.fillText(n, x, y + s * 0.62); ctx.restore();
    });
  }
  function badge(ctx, M, n, v, a = 1, color) {
    if (a <= 0 || v == null) return;
    const [x, y] = pos(M, n), [dx, dy] = BADGE[n], r = 25 * M.s, bx = x + dx * M.s, by = y + dy * M.s;
    alpha(ctx, a, () => {
      const k = 0.6 + 0.4 * ease(clamp(a, 0, 1));
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(bx, by, r * 1.18 * k, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = color || (typeof v === "number" ? DAYC[v] : ORANGE); ctx.beginPath(); ctx.arc(bx, by, r * k, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(v), bx, by + r * 0.42 * k, r * 1.25 * k, { align: "center", weight: 900, color: "#fff" });
    });
  }
  function envelope(ctx, x, y, s, a = 1) {
    alpha(ctx, a, () => {
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#B23B2E"; ctx.lineWidth = Math.max(2, s * 0.09);
      rr(ctx, x - s * 0.6, y - s * 0.4, s * 1.2, s * 0.8, s * 0.08); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - s * 0.6, y - s * 0.36); ctx.lineTo(x, y + s * 0.08); ctx.lineTo(x + s * 0.6, y - s * 0.36); ctx.stroke();
    });
  }
  function along(pts, u) {   // u = 0..n-1 (indeks ruas pecahan)
    const k = clamp(Math.floor(u), 0, pts.length - 2), f = clamp(u - k, 0, 1);
    return [lerp(pts[k][0], pts[k + 1][0], ease(f)), lerp(pts[k][1], pts[k + 1][1], ease(f))];
  }
  // amplop berjalan dari a ke b, u = 0..1
  function flyMail(ctx, M, a, b2, u) {
    if (u <= 0 || u >= 1) return;
    const p = pos(M, a), q = pos(M, b2), e = ease(u);
    envelope(ctx, lerp(p[0], q[0], e), lerp(p[1], q[1], e) - 10 * M.s, 34 * M.s, Math.min(1, u * 6, (1 - u) * 6));
  }
  // gambar seluruh pulau. o.nums[n] = {v, a, color}; o.roads[e] = opt; o.parks[n] = alpha; o.ring[n] = {u, color}
  function drawIsle(ctx, M, o = {}) {
    island(ctx, M);
    EDGES.forEach(e => roadLine(ctx, M, e, Object.assign({ a: o.roadA == null ? 1 : o.roadA }, (o.roads || {})[e] || {})));
    if (o.mail) o.mail.forEach(([a, b2, u]) => flyMail(ctx, M, a, b2, u));
    NODES.forEach(n => house(ctx, M, n, o.parks && o.parks[n] != null ? o.parks[n] : 1, { dim: o.dim && o.dim.includes(n) }));
    NODES.forEach(n => { const r = o.ring && o.ring[n]; if (r) ring(ctx, pos(M, n)[0], pos(M, n)[1] - 4 * M.s, 62 * M.s, 62 * M.s, r.u, r.color || ORANGE, Math.max(4, 7 * M.s)); });
    if (o.mail) o.mail.forEach(([a, b2, u]) => flyMail(ctx, M, a, b2, u));
    NODES.forEach(n => { const nm = o.nums && o.nums[n]; if (nm) badge(ctx, M, n, nm.v, nm.a == null ? 1 : nm.a, nm.color); });
  }
  // kejadian penyebaran: [frasa, [[asal, tujuan], ...]]; mengisi o.nums, o.roads, o.mail untuk beat b pada waktu l
  function spread(o, b, l, steps, D, opt = {}) {
    steps.forEach(([ph, pairs]) => {
      const t = typeof ph === "number" ? ph : at(b, ph);
      pairs.forEach(([a, c], i) => {
        const t0 = t + i * (opt.stagger || 0), u = clamp((l - t0) / 1.1, 0, 1);
        if (u > 0) { o.mail.push([a, c, u]); const e = edgeKey(a, c); if (e) o.roads[e] = { glow: DAYC[D[c]], gu: u }; }
        if (u >= 0.85) o.nums[c] = { v: D[c], a: clamp((u - 0.85) / 0.15, 0, 1) };
      });
    });
  }
  function fullState(o, D, upto, glowTree) {
    NODES.forEach(n => { if (D[n] <= upto) o.nums[n] = { v: D[n] }; });
    if (glowTree) Object.entries(glowTree).forEach(([c, a]) => { if (D[c] <= upto) { const e = edgeKey(a, c); if (e) o.roads[e] = { glow: DAYC[D[c]] }; } });
  }
  // pohon penyebaran yang dibacakan narasi (tujuan: asal)
  const TREE_J = { E: "J", H: "J", G: "J", M: "J", C: "E", B: "E", K: "H", N: "H", D: "G", I: "G", O: "M", L: "M", A: "C", F: "C", P: "K", R: "L", Q: "A" };
  const TREE_A = { B: "A", C: "A", Q: "A", D: "B", E: "B", F: "Q" };
  const mk = () => ({ nums: {}, roads: {}, mail: [], ring: {} });

  // ---------- panel kanan: daftar hari ----------
  function dayTable(ctx, x, y, w, rows, opt = {}) {   // rows: [hari, "huruf", alpha]
    const lh = opt.lh || 70, fs = opt.fs || 40;
    rows.forEach(([d, s, a], i) => alpha(ctx, a == null ? 1 : a, () => {
      const yy = y + i * lh;
      ctx.fillStyle = DAYC[d]; rr(ctx, x, yy, 170, lh - 12, 14); ctx.fill();
      text(ctx, "Hari " + d, x + 85, yy + (lh - 12) / 2 + fs * 0.36, fs * 0.9, { align: "center", weight: 900, color: "#fff" });
      text(ctx, s, x + 196, yy + (lh - 12) / 2 + fs * 0.36, fs, { weight: 900, color: INK, fit: w - 210 });
    }));
  }

  const MAPM = { ox: 200, oy: 222, s: 0.84 };   // pulau di sisi kiri papan (x 100–1035, y 175–795)
  const PX = 1080;   // tepi kiri panel kanan

  // ---------- adegan: buka, kredit ----------
  function buka(ctx, b, l) {
    board(ctx);
    const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
    ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
    text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
    mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
    const bu = first ? P(l, at(b, "pembahasan"), 0.8) : 1;
    [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
    if (first) hand(ctx, "tingkat SMA (Penegak)", 1230, 770, 44, { alpha: P(l, at(b, "tingkat SMA"), 0.6) });
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
    const fu = P(l, at(b, "Taiwan"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagTW(ctx, 470, 230, 170); ctx.restore(); }
    const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
    text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
    rows.forEach(([k, v, ph], i) => {
      const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
      text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
      ctx.restore();
    });
    const au = P(l, at(b, "Taiwan"), 0.8);
    if (au > 0) ring(ctx, 1160, 300 + 2 * 92 - 14, 190, 44, au);
  }
  function postBeaver(ctx, x, y, s, a = 1) {   // berang-berang pengirim pesan dengan topi hijau dan amplop
    alpha(ctx, a, () => {
      beaver(ctx, x, y, s);
      ctx.fillStyle = "#2F8A4E"; ctx.beginPath(); ctx.ellipse(x, y - s * 0.36, s * 0.3, s * 0.1, 0, Math.PI, 0); ctx.fill();
      rr(ctx, x - s * 0.24, y - s * 0.52, s * 0.48, s * 0.18, s * 0.06); ctx.fill();
      envelope(ctx, x + s * 0.42, y + s * 0.12, s * 0.38);
    });
  }

  // ---------- 0. soal ----------
  function pulau(ctx, b, l) {
    board(ctx);
    const M = MAPM, id = b.id, o = mk();
    if (id === "soal1") {
      const t0 = at(b, "delapan belas desa"), t1 = at(b, "Setiap desa diberi");
      o.parks = {}; NODES.forEach((n, i) => o.parks[n] = P(l, lerp(t0, t1, i / 17), 0.35)); o.roadA = 0;
    }
    if (id === "soal2") {
      o.roadA = P(l, at(b, "dihubungkan oleh jalan"), 1.0);
      o.roads.AB = { glow: ORANGE, gu: P(l, at(b, "Dua desa"), 0.5) };
    }
    if (id === "soal4" || id === "soal5") {
      o.ring.A = { u: P(l, id === "soal4" ? at(b, "desa A mengirim") : 0, 0.6) };
      o.nums.A = { v: 0, a: id === "soal4" ? P(l, at(b, "desa A mengirim"), 0.4) : 1 };
      if (id === "soal4") spread(o, b, l, [["setelah satu hari", [["A", "B"], ["A", "C"], ["A", "Q"]]]], DA);
      else { fullState(o, DA, 1, TREE_A); spread(o, b, l, [["pesan tiba", [["B", "D"], ["B", "E"], ["Q", "F"]]]], DA); }
    }
    if (id === "soal6") o.ring.J = { u: P(l, at(b, "desa J"), 0.6) };
    drawIsle(ctx, M, o);
    // panel kanan
    const cx = PX + 390;
    if (id === "soal1") {
      hand(ctx, "18 desa", cx, 360, 70, { color: GREEN, alpha: P(l, at(b, "delapan belas desa"), 0.5) });
      hand(ctx, "nama desa: A sampai R", cx, 450, 46, { color: INK, alpha: P(l, at(b, "satu huruf"), 0.5) });
    }
    if (id === "soal2") {
      alpha(ctx, P(l, at(b, "Dua desa"), 0.5), () => {
        text(ctx, "A", cx - 150, 400, 90, { align: "center", weight: 900, color: INK });
        text(ctx, "B", cx + 150, 400, 90, { align: "center", weight: 900, color: INK });
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - 90, 370); ctx.lineTo(cx + 90, 370); ctx.stroke();
        hand(ctx, "1 jalan langsung", cx, 330, 34, { color: ORANGE });
      });
      hand(ctx, "A dan B bertetangga", cx, 520, 54, { color: GREEN, alpha: P(l, at(b, "desa tetangga"), 0.5) });
    }
    if (id === "soal3") {
      postBeaver(ctx, cx - 250, 330, 170, P(l, at(b, "pengirim pesan"), 0.6));
      alpha(ctx, P(l, at(b, "meneruskan"), 0.5), () => { hand(ctx, "pesan baru →", cx + 60, 300, 44, { color: INK }); hand(ctx, "teruskan ke", cx + 60, 360, 44, { color: INK }); hand(ctx, "SEMUA tetangga", cx + 60, 420, 44, { color: ORANGE }); });
      alpha(ctx, P(l, at(b, "hari berikutnya"), 0.5), () => { card(ctx, cx - 300, 560, 600, 130, { fill: "#EEF4FC", stroke: "#2F6FD0", lw: 4, r: 18 }); text(ctx, "tiba BESOK", cx, 645, 60, { align: "center", weight: 900, color: "#2F6FD0" }); });
    }
    if (id === "soal4" || id === "soal5") {
      const rows = [[0, "A", 1], [1, "B, C, Q", id === "soal4" ? P(l, at(b, "setelah satu hari") + 1.0, 0.4) : 1]];
      if (id === "soal5") rows.push([2, "D, E, F", P(l, at(b, "pesan tiba") + 1.0, 0.4)]);
      text(ctx, "Contoh: mulai dari desa A", PX + 20, 230, 40, { weight: 900, color: INK });
      dayTable(ctx, PX + 20, 280, 740, rows, { lh: 90, fs: 46 });
      if (id === "soal5") hand(ctx, "… dan seterusnya", cx, 640, 46, { color: ORANGE, alpha: P(l, at(b, "Begitu seterusnya"), 0.5) });
    }
    if (id === "soal6") {
      card(ctx, PX, 190, 760, 300, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      para(ctx, "Pesan baru mulai dari desa J. Berapa hari sampai pesan tiba di SELURUH desa?", PX + 380, 260, 44, 680, { align: "center", weight: 900, color: INK });
      alpha(ctx, P(l, at(b, "bilangan bulat"), 0.5), () => { text(ctx, "Jawaban: bilangan bulat 1–18", PX + 380, 580, 40, { align: "center", weight: 800, color: C.ink2 }); });
    }
  }

  // ---------- 1. cara pesan menyebar ----------
  function sebar(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "w1") {
      // kiri: satu pengirim berkeliling (salah); kanan: banyak pengirim bersamaan (benar)
      const a1 = P(l, at(b, "tidak berkeliling"), 0.5), a2 = P(l, at(b, "Semua pengirim"), 0.5);
      alpha(ctx, a1, () => {
        card(ctx, 110, 200, 800, 560, { fill: "#FDF1F0", stroke: "#E7B4AF", lw: 3, r: 22 });
        const pts = [[220, 640], [400, 360], [600, 620], [790, 340]];
        pts.forEach(p => { ctx.fillStyle = "#E07A3C"; ctx.beginPath(); ctx.moveTo(p[0] - 44, p[1] - 14); ctx.lineTo(p[0], p[1] - 50); ctx.lineTo(p[0] + 44, p[1] - 14); ctx.fill(); ctx.fillStyle = "#F3D98B"; rr(ctx, p[0] - 34, p[1] - 16, 68, 50, 6); ctx.fill(); });
        const u = ((l - at(b, "tidak berkeliling")) / 4) % 1 * 3, q = along(pts, Math.max(0, u));
        postBeaver(ctx, q[0], q[1] - 95, 140);
        text(ctx, "satu pengirim berkeliling", 510, 270, 40, { align: "center", weight: 900, color: RED });
        cross(ctx, 820, 690, 80, P(l, at(b, "Semua pengirim") - 0.3, 0.5));
      });
      alpha(ctx, a2, () => {
        card(ctx, 1010, 200, 800, 560, { fill: "#EEF7F0", stroke: "#A9D3B5", lw: 3, r: 22 });
        const c = [1410, 500];
        [[0, -1], [0.95, -0.3], [0.6, 0.8], [-0.6, 0.8], [-0.95, -0.3]].forEach(([dx, dy], i) => {
          const k = ease(((l - at(b, "Semua pengirim")) / 2.5) % 1);
          envelope(ctx, c[0] + dx * (40 + 200 * k), c[1] + dy * (40 + 170 * k), 52, 1 - k * 0.3);
        });
        postBeaver(ctx, c[0], c[1], 170);
        text(ctx, "semua bekerja bersamaan", 1410, 270, 40, { align: "center", weight: 900, color: GREEN });
        tick(ctx, 1730, 690, 80, P(l, at(b, "hari yang sama"), 0.5));
      });
    }
    if (id === "w2") {
      const c = [960, 500], t0 = at(b, "riak air");
      // kolam
      ctx.fillStyle = "#CFE7F5"; ctx.beginPath(); ctx.ellipse(c[0], c[1], 760, 300, 0, 0, Math.PI * 2); ctx.fill();
      const drop = P(l, t0 - 0.6, 0.6);
      if (drop < 1) { ctx.fillStyle = "#7B7F86"; ctx.beginPath(); ctx.arc(c[0], 160 + 340 * drop, 26, 0, Math.PI * 2); ctx.fill(); }
      if (l > t0) for (let k = 0; k < 5; k++) {
        const r = ((l - t0) * 120 - k * 110); if (r <= 0) continue;
        ctx.save(); ctx.strokeStyle = DAYC[Math.min(k, 4)]; ctx.globalAlpha = clamp(1 - r / 760, 0, 1); ctx.lineWidth = 8;
        ctx.beginPath(); ctx.ellipse(c[0], c[1], r, r * 0.4, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      hand(ctx, "menyebar ke segala arah, bersamaan", 960, 790, 48, { color: "#2F6FD0", alpha: P(l, at(b, "Gelombangnya"), 0.5) });
    }
    if (id === "w3") {
      alpha(ctx, P(l, at(b, "menjumlahkan"), 0.5), () => {
        text(ctx, "1 + 2 + 3 + … hari ?", 960, 360, 80, { align: "center", weight: 900, color: "#A3ADB5" });
        mline(ctx, [[560, 340], [1360, 320]], P(l, at(b, "menjumlahkan") + 0.6, 0.6), RED, 10);
        hand(ctx, "tidak dijumlahkan", 960, 450, 44, { color: RED });
      });
      alpha(ctx, P(l, at(b, "Kita cukup"), 0.5), () => {
        text(ctx, "Kapan desa yang PALING AKHIR", 960, 600, 60, { align: "center", weight: 900, color: INK });
        text(ctx, "menerima pesan?", 960, 680, 60, { align: "center", weight: 900, color: INK });
        ring(ctx, 960, 625, 560, 120, P(l, at(b, "paling akhir"), 0.8), GREEN, 7);
      });
      kiko(ctx, 230, 600, 170, 0, { wave: l * 0.3, mood: "happy" });
    }
  }
  function contoh(ctx, b, l) {
    board(ctx);
    const M = MAPM, id = b.id, o = mk(), order = ["w4", "w5", "w6"], pg = prog(order, b);
    o.nums.A = { v: 0, a: id === "w4" ? P(l, at(b, "angka nol"), 0.4) : 1 }; o.ring.A = { u: 1 };
    if (id === "w5") spread(o, b, l, [["yaitu B, C, dan Q", [["A", "B"], ["A", "C"], ["A", "Q"]]], ["yaitu D, E, dan F", [["B", "D"], ["B", "E"], ["Q", "F"]]]], DA);
    if (id === "w6") {
      fullState(o, DA, 2, TREE_A);
      const t1 = at(b, "lewat desa Q"), t2 = at(b, "lewat desa C");
      o.roads.QF = { glow: ORANGE, gu: P(l, t1, 0.4) }; o.roads.FC = { glow: ORANGE, gu: P(l, t2, 0.4) };
      o.ring.F = { u: P(l, at(b, "Perhatikan desa F"), 0.6), color: ORANGE };
    }
    drawIsle(ctx, M, o);
    if (id === "w4") {
      alpha(ctx, P(l, at(b, "angka hari"), 0.5), () => {
        text(ctx, "Tulis angka hari", PX + 20, 260, 48, { weight: 900, color: INK });
        text(ctx, "di samping setiap desa.", PX + 20, 320, 48, { weight: 900, color: INK });
        [0, 1, 2, 3, 4].forEach(d => { ctx.fillStyle = DAYC[d]; ctx.beginPath(); ctx.arc(PX + 60 + d * 110, 440, 40, 0, Math.PI * 2); ctx.fill(); text(ctx, String(d), PX + 60 + d * 110, 457, 48, { align: "center", weight: 900, color: "#fff" }); });
        hand(ctx, "angka = hari tibanya pesan", PX + 300, 540, 38, { color: C.ink2 });
      });
      hand(ctx, "A = titik awal → 0", PX + 300, 680, 50, { color: DAYC[0], alpha: P(l, at(b, "angka nol"), 0.5) });
    }
    if (id === "w5" || id === "w6") {
      const rows = [[0, "A", 1], [1, "B, C, Q", id === "w5" ? P(l, at(b, "angka satu"), 0.4) : 1], [2, "D, E, F", id === "w5" ? P(l, at(b, "angka dua"), 0.4) : 1]];
      dayTable(ctx, PX + 20, 210, 740, rows, { lh: 86, fs: 44 });
    }
    if (id === "w6") {
      alpha(ctx, P(l, at(b, "lewat desa Q"), 0.5), () => text(ctx, "Q → F : hari 2", PX + 40, 530, 40, { weight: 800, color: INK }));
      alpha(ctx, P(l, at(b, "lewat desa C"), 0.5), () => text(ctx, "C → F : hari 2", PX + 40, 590, 40, { weight: 800, color: INK }));
      alpha(ctx, P(l, at(b, "Desa yang sudah"), 0.5), () => { card(ctx, PX + 20, 640, 740, 130, { fill: "#FFF8E8", stroke: C.accent, lw: 3, r: 16 }); text(ctx, "Sudah punya angka? Lewati.", PX + 390, 690, 40, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "Pesan yang sama bukan pesan baru.", PX + 390, 745, 32, { align: "center", weight: 700, color: C.ink2 }); });
    }
  }

  // ---------- 2. menghitung dari J ----------
  const STEPS_J = {
    m2: [["yaitu desa E, H, G, dan M", [["J", "E"], ["J", "H"], ["J", "G"], ["J", "M"]]]],
    m3: [["Dari desa E", [["E", "C"], ["E", "B"]]], ["Dari desa H", [["H", "K"], ["H", "N"]]], ["Dari desa G", [["G", "D"], ["G", "I"]]], ["dari desa M", [["M", "O"], ["M", "L"]]]],
    m5: [["dari desa C", [["C", "A"], ["C", "F"]]], ["Dari desa K", [["K", "P"]]], ["Dari desa L", [["L", "R"]]]],
    m6: [["hari keempat", [["A", "Q"], ["F", "Q"]]]],
  };
  const ROWS_J = [[0, "J"], [1, "E, H, G, M"], [2, "C, B, K, N, D, I, O, L"], [3, "A, F, P, R"], [4, "Q"]];
  function hitung(ctx, b, l) {
    board(ctx);
    const M = MAPM, id = b.id, o = mk();
    const order = ["m1", "m2", "m3", "m4", "m5", "m6", "m7"], k = order.indexOf(id);
    const done = { m1: -1, m2: 0, m3: 1, m4: 2, m5: 2, m6: 3, m7: 4 }[id];
    o.ring.J = { u: id === "m1" ? P(l, 0.3, 0.8) : 1, color: DAYC[0] };
    if (id !== "m1") {
      fullState(o, DJ, done, TREE_J);
      if (id === "m2") o.nums.J = { v: 0, a: P(l, at(b, "angka nol"), 0.4) };
      if (STEPS_J[id]) spread(o, b, l, STEPS_J[id], DJ, { stagger: 0.35 });
      if (id === "m6") { o.roads.QF = { glow: DAYC[4], gu: P(l, at(b, "desa A dan desa F"), 0.4) }; o.roads.QA = { glow: DAYC[4], gu: P(l, at(b, "desa A dan desa F"), 0.4) }; }
    }
    if (id === "m4") ["A", "F", "P", "R", "Q"].forEach((n, i) => o.nums[n] = { v: "?", a: P(l, at(b, "yaitu desa A") + i * 0.35, 0.3), color: "#A3ADB5" });
    if (id === "m6") o.ring.Q = { u: P(l, at(b, "hanya desa Q"), 0.6), color: DAYC[4] };
    drawIsle(ctx, M, o);
    if (id === "m1") { thinkBadge(ctx, PX, 220, 760, 170, l, b.dur || 8, "Mulai dari J. Tulis angka hari setiap desa."); hand(ctx, "mulai di sini: J = 0", PX + 380, 520, 46, { color: DAYC[0], alpha: P(l, 0.5, 0.5) }); return; }
    // tabel hari di kanan, baris muncul saat dibacakan
    const rowA = d => {
      if (d <= done) return 1;
      if (d === done + 1 && STEPS_J[id]) { const st = STEPS_J[id]; return P(l, at(b, st[0][0]) + 0.6, 0.4); }
      return 0;
    };
    const rows = ROWS_J.map(([d, s]) => [d, s, d === 0 && id === "m2" ? P(l, at(b, "angka nol"), 0.4) : rowA(d)]);
    // hari 2 diisi bertahap seiring narasi
    if (id === "m3") { const parts = ["C, B", "K, N", "D, I", "O, L"], ph = ["Dari desa E", "Dari desa H", "Dari desa G", "dari desa M"]; rows[2][1] = parts.filter((_, i) => l > at(b, ph[i]) + 0.6).join(", "); rows[2][2] = rows[2][1] ? 1 : 0; }
    if (id === "m5") { const parts = ["A, F", "P", "R"], ph = ["dari desa C", "Dari desa K", "Dari desa L"]; rows[3][1] = parts.filter((_, i) => l > at(b, ph[i]) + 0.6).join(", "); rows[3][2] = rows[3][1] ? 1 : 0; }
    dayTable(ctx, PX + 10, 200, 770, rows, { lh: 84, fs: 40 });
    if (id === "m4") {
      alpha(ctx, P(l, at(b, "tiga belas"), 0.5), () => { text(ctx, "13 desa sudah", PX + 30, 680, 46, { weight: 900, color: GREEN }); });
      alpha(ctx, P(l, at(b, "lima desa"), 0.5), () => { text(ctx, "5 desa belum: A, F, P, R, Q", PX + 30, 750, 42, { weight: 900, color: ORANGE }); });
    }
    if (id === "m6") alpha(ctx, P(l, at(b, "Keduanya"), 0.5), () => { hand(ctx, "tetangga Q: A (3) dan F (3)", PX + 390, 680, 40, { color: INK }); hand(ctx, "3 + 1 = hari 4", PX + 390, 750, 44, { color: DAYC[4] }); });
    if (id === "m7") {
      const a = P(l, at(b, "jawabannya"), 0.5);
      alpha(ctx, a, () => { card(ctx, PX + 120, 640, 560, 140, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: 4 hari", PX + 400, 735, 64, { align: "center", weight: 900, color: GREEN }); });
      ring(ctx, PX + 210, 200 + 4 * 84 + 36, 230, 52, P(l, at(b, "Angka terbesarnya"), 0.6), GREEN, 6);
    }
  }

  // ---------- 3. memeriksa ----------
  function periksa(ctx, b, l) {
    board(ctx);
    const M = MAPM, id = b.id, o = mk();
    fullState(o, DJ, 4);
    if (id === "k1" || id === "k2") {
      const route = ["J", "H", "K", "F", "Q"], ph = ["dari J ke H", "dari H ke K", "dari K ke F", "dari F ke Q"];
      route.slice(1).forEach((n, i) => { const e = edgeKey(route[i], n), u = id === "k2" ? 1 : P(l, at(b, ph[i]), 0.6); o.roads[e] = { glow: ORANGE, gu: u }; });
      o.ring.Q = { u: id === "k2" ? 1 : P(l, at(b, "Lihat desa Q"), 0.6), color: DAYC[4] };
      if (id === "k2") NODES.forEach(n => { if (n !== "Q") o.nums[n].a = 1; });
    }
    if (id === "k3") NODES.forEach(n => o.nums[n].a = 0.25);
    if (id === "k4") { o.ring.R = { u: P(l, at(b, "Desa R terletak"), 0.6), color: DAYC[3] }; o.ring.Q = { u: P(l, at(b, "Yang menentukan"), 0.6), color: DAYC[4] }; o.dim = NODES.filter(n => n !== "R" && n !== "Q" && n !== "J"); }
    drawIsle(ctx, M, o);
    if (id === "k1") {
      const route = ["J", "H", "K", "F", "Q"], ph = ["dari J ke H", "dari H ke K", "dari K ke F", "dari F ke Q"];
      route.slice(1).forEach((n, i) => { const p = pos(M, route[i]), q = pos(M, n); alpha(ctx, P(l, at(b, ph[i]), 0.5), () => { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(mx, my, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), mx, my + 10, 28, { align: "center", weight: 900, color: "#fff" }); }); });
      text(ctx, "Kurang dari 4 hari?", PX + 20, 250, 52, { weight: 900, color: INK });
      alpha(ctx, P(l, at(b, "paling sedikit empat"), 0.5), () => { para(ctx, "Setiap rute dari J ke Q melewati paling sedikit 4 jalan.", PX + 20, 350, 42, 740, { weight: 800, color: C.ink2 }); });
      alpha(ctx, P(l, at(b, "dari J ke H"), 0.5), () => { seqLine(ctx, route, PX + 20, 600, 60, P(l, at(b, "dari J ke H"), 0.1) * 1 + ph.filter(x => l > at(b, x)).length); });
    }
    if (id === "k2") {
      alpha(ctx, P(l, 0.3, 0.5), () => { card(ctx, PX + 20, 220, 740, 120, { fill: "#FFF8E8", stroke: C.accent, lw: 3, r: 18 }); text(ctx, "1 jalan = 1 hari", PX + 390, 300, 56, { align: "center", weight: 900, color: C.accentDark }); });
      alpha(ctx, P(l, at(b, "paling sedikit empat hari"), 0.5), () => text(ctx, "Q paling cepat: hari ke-4", PX + 390, 450, 46, { align: "center", weight: 900, color: DAYC[4] }));
      alpha(ctx, P(l, at(b, "semua desa lain"), 0.5), () => { text(ctx, "Desa lain: hari 1 sampai 3", PX + 390, 560, 42, { align: "center", weight: 800, color: INK }); tick(ctx, PX + 390, 670, 90, P(l, at(b, "semua desa lain") + 0.4, 0.5)); });
    }
    if (id === "k3") {
      card(ctx, PX, 210, 780, 560, { fill: "#FDF1F0", stroke: "#E7B4AF", lw: 3, r: 22 });
      text(ctx, "Kesalahan 1", PX + 390, 280, 48, { align: "center", weight: 900, color: RED });
      alpha(ctx, P(l, at(b, "menjumlahkan"), 0.5), () => {
        const n = Math.floor(clamp((l - at(b, "menjumlahkan")) * 2.5, 0, 11)) + 1;
        postBeaver(ctx, PX + 200, 470, 120);
        text(ctx, "hari ke-" + n + " …", PX + 520, 480, 54, { align: "center", weight: 900, color: "#A3ADB5" });
        para(ctx, "satu pengirim berkeliling", PX + 390, 610, 38, 700, { align: "center", weight: 800, color: INK });
      });
      cross(ctx, PX + 650, 360, 90, P(l, at(b, "Padahal"), 0.5));
      hand(ctx, "semua pengirim bekerja bersamaan", PX + 390, 730, 36, { color: GREEN, alpha: P(l, at(b, "Padahal"), 0.5) });
    }
    if (id === "k4") {
      card(ctx, PX, 210, 780, 560, { fill: "#FDF1F0", stroke: "#E7B4AF", lw: 3, r: 22 });
      text(ctx, "Kesalahan 2", PX + 390, 280, 48, { align: "center", weight: 900, color: RED });
      alpha(ctx, P(l, at(b, "Desa R terletak"), 0.5), () => text(ctx, "R terlihat paling jauh → hari 3", PX + 390, 390, 40, { align: "center", weight: 900, color: DAYC[3] }));
      alpha(ctx, P(l, at(b, "Yang menentukan"), 0.5), () => text(ctx, "Q paling akhir → hari 4", PX + 390, 470, 40, { align: "center", weight: 900, color: DAYC[4] }));
      alpha(ctx, P(l, at(b, "banyaknya jalan"), 0.5), () => { card(ctx, PX + 40, 560, 700, 150, { fill: "#FFFFFF", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "Hitung jalannya,", PX + 390, 625, 46, { align: "center", weight: 900, color: GREEN }); text(ctx, "bukan jaraknya.", PX + 390, 685, 46, { align: "center", weight: 900, color: GREEN }); });
    }
  }
  function seqLine(ctx, route, x, y, size, u) {
    ctx.save(); ctx.font = `900 ${size}px ${K.FONT}`; let cx = x;
    route.forEach((p, i) => { const s = (i ? " → " : "") + p, w = ctx.measureText(s).width; if (u >= i + 1 || i === 0) { ctx.fillStyle = i ? INK : DAYC[0]; ctx.fillText(s, cx, y); } cx += w; });
    ctx.restore();
  }

  // ---------- 4. penutup ----------
  function graphView(ctx, M, D, o = {}) {   // pulau sebagai graf: titik dan garis, warna sesuai lapis
    EDGES.forEach(e => { const p = pos(M, e[0]), q = pos(M, e[1]); ctx.strokeStyle = "#9AA5AE"; ctx.lineWidth = Math.max(2, 6 * M.s); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); });
    NODES.forEach(n => {
      const [x, y] = pos(M, n), r = 30 * M.s, d = D[n], a = o.upto == null || d <= o.upto ? 1 : 0.15;
      alpha(ctx, a, () => { ctx.fillStyle = DAYC[d]; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); text(ctx, n, x, y + r * 0.4, r * 1.1, { align: "center", weight: 900, color: "#fff" }); });
    });
  }
  function bfs_(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "p1") {
      const M = MAPM, u = P(l, at(b, "breadth-first search"), 1.0);
      alpha(ctx, 1 - u, () => { const o = mk(); fullState(o, DJ, 4); drawIsle(ctx, M, o); });
      alpha(ctx, u, () => graphView(ctx, M, DJ, { upto: Math.floor(clamp((l - at(b, "lapis demi lapis")) / 0.8, 0, 4)) }));
      hand(ctx, "breadth-first search", PX + 380, 290, 58, { color: C.kiko, alpha: P(l, at(b, "breadth-first search"), 0.5) });
      text(ctx, "(BFS)", PX + 380, 360, 40, { align: "center", weight: 900, color: C.kiko, alpha: P(l, at(b, "breadth-first search"), 0.5) });
      alpha(ctx, P(l, at(b, "lapis demi lapis"), 0.5), () => {
        [0, 1, 2, 3, 4].forEach(d => { const a2 = P(l, at(b, "lapis demi lapis") + d * 0.8, 0.4); alpha(ctx, a2, () => { ctx.fillStyle = DAYC[d]; rr(ctx, PX + 80, 430 + d * 66, 600, 54, 12); ctx.fill(); text(ctx, "lapis " + d + ": " + ROWS_J[d][1], PX + 110, 468 + d * 66, 32, { weight: 900, color: "#fff", fit: 550 }); }); });
      });
    }
    if (id === "p2") {
      const L = { ox: 150, oy: 300, s: 0.78 * 0.85 }, R2 = { ox: 1040, oy: 300, s: 0.78 * 0.85 };
      graphView(ctx, L, DJ); graphView(ctx, R2, DA, { upto: Math.floor(clamp((l - at(b, "desa A")) / 0.6, 0, 6)) });
      text(ctx, "Mulai dari J", 450, 230, 48, { align: "center", weight: 900, color: INK });
      text(ctx, "Mulai dari A", 1340, 230, 48, { align: "center", weight: 900, color: INK });
      alpha(ctx, P(l, at(b, "Titik awal"), 0.5), () => { card(ctx, 300, 735, 300, 80, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 16 }); text(ctx, "4 hari", 450, 790, 48, { align: "center", weight: 900, color: GREEN }); });
      alpha(ctx, P(l, at(b, "enam hari"), 0.5), () => { card(ctx, 1190, 735, 300, 80, { fill: "#FDF1F0", stroke: RED, lw: 4, r: 16 }); text(ctx, "6 hari", 1340, 790, 48, { align: "center", weight: 900, color: RED }); });
      alpha(ctx, P(l, at(b, "di tengah"), 0.5), () => hand(ctx, "J lebih di tengah", 450, 700, 40, { color: GREEN }));
    }
  }
  function phone(ctx, x, y, s, l, t0) {   // HP dengan pesan grup yang diteruskan (digambar dengan kode)
    ctx.fillStyle = "#2B3440"; rr(ctx, x, y, s * 0.55, s, s * 0.07); ctx.fill();
    ctx.fillStyle = "#EEF2F5"; rr(ctx, x + s * 0.04, y + s * 0.08, s * 0.47, s * 0.82, s * 0.03); ctx.fill();
    ctx.fillStyle = C.kiko; ctx.fillRect(x + s * 0.04, y + s * 0.08, s * 0.47, s * 0.1);
    text(ctx, "Grup Kelas", x + s * 0.275, y + s * 0.15, s * 0.05, { align: "center", weight: 800, color: "#fff" });
    [0, 1, 2].forEach(i => alpha(ctx, P(l, t0 + i * 0.6, 0.4), () => { ctx.fillStyle = i % 2 ? "#DDF3E4" : "#FFFFFF"; rr(ctx, x + s * (i % 2 ? 0.16 : 0.07), y + s * (0.24 + i * 0.17), s * 0.32, s * 0.12, s * 0.02); ctx.fill(); text(ctx, "Diteruskan", x + s * (i % 2 ? 0.32 : 0.23), y + s * (0.31 + i * 0.17), s * 0.04, { align: "center", weight: 700, color: C.ink2 }); }));
  }
  function computer(ctx, x, y, s, col = "#2B3440") {
    ctx.fillStyle = col; rr(ctx, x - s * 0.5, y - s * 0.38, s, s * 0.62, s * 0.06); ctx.fill();
    ctx.fillStyle = "#BFE3F2"; rr(ctx, x - s * 0.42, y - s * 0.31, s * 0.84, s * 0.48, s * 0.03); ctx.fill();
    ctx.fillStyle = col; ctx.fillRect(x - s * 0.08, y + s * 0.24, s * 0.16, s * 0.12); rr(ctx, x - s * 0.28, y + s * 0.34, s * 0.56, s * 0.07, s * 0.03); ctx.fill();
  }
  function jaringan(ctx, b, l) {
    board(ctx);
    const tg = at(b, "grup kelas"), ti = at(b, "data yang dikirim");
    alpha(ctx, P(l, tg - 0.3, 0.5), () => { phone(ctx, 230, 230, 480, l, tg); hand(ctx, "pengumuman diteruskan", 360, 790, 38, { color: ORANGE }); });
    alpha(ctx, P(l, ti - 0.3, 0.5), () => {
      const N = { S: [1000, 480], A: [1250, 300], B: [1250, 660], C: [1520, 230], D: [1520, 480], E: [1520, 730], F: [1760, 480] };
      const D = { S: 0, A: 1, B: 1, C: 2, D: 2, E: 2, F: 3 };
      const L = [["S", "A"], ["S", "B"], ["A", "C"], ["A", "D"], ["B", "D"], ["B", "E"], ["D", "F"], ["C", "F"]];
      const step = (l - ti) / 0.9;
      L.forEach(([p, q]) => { ctx.strokeStyle = step > D[q] - 0.5 ? DAYC[D[q]] : "#B8C3CA"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(...N[p]); ctx.lineTo(...N[q]); ctx.stroke(); });
      Object.entries(N).forEach(([k, p]) => computer(ctx, p[0], p[1], 120, step >= D[k] ? DAYC[D[k]] : "#2B3440"));
      hand(ctx, "data menyebar lapis demi lapis", 1380, 840 - 40, 38, { color: "#2F6FD0" });
    });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Beri angka 0 pada desa awal.", "Beri angka 1, 2, 3, … lapis demi lapis.", "Angka terbesar adalah jawabannya."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 46, { weight: 900, color: INK, fit: 1140 });
        const ix = 1600, iy = y + 80;
        if (i === 0) { ctx.fillStyle = DAYC[0]; ctx.beginPath(); ctx.arc(ix, iy, 46, 0, Math.PI * 2); ctx.fill(); text(ctx, "0", ix, iy + 18, 52, { align: "center", weight: 900, color: "#fff" }); }
        if (i === 1) [1, 2, 3].forEach((d, k) => { ctx.fillStyle = DAYC[d]; ctx.beginPath(); ctx.arc(ix - 90 + k * 90, iy, 36, 0, Math.PI * 2); ctx.fill(); text(ctx, String(d), ix - 90 + k * 90, iy + 15, 42, { align: "center", weight: 900, color: "#fff" }); });
        if (i === 2) { ctx.fillStyle = DAYC[4]; ctx.beginPath(); ctx.arc(ix, iy, 46, 0, Math.PI * 2); ctx.fill(); text(ctx, "4", ix, iy + 18, 52, { align: "center", weight: 900, color: "#fff" }); ring(ctx, ix, iy, 64, 64, 1, GREEN, 6); }
      });
    });
  }
  function akhir(ctx, b, l) {
    board(ctx);
    kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
    [640, 860].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
    const o = mk(); fullState(o, DJ, 4); drawIsle(ctx, { ox: 600, oy: 610, s: 0.22 }, o);
    card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
    text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
    const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
    L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
    para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
    hand(ctx, "Semoga sukses!", 330, 790, 50, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
  }

  // ---------- versi tegak untuk Short (area x 440–1480, y 118–830) ----------
  const MAPV = { ox: 600, oy: 180, s: 0.8 };
  function pulau_v(ctx, b, l) {
    board(ctx);
    const M = MAPV, id = b.id, o = mk();
    let note = "", nc = INK;
    if (id === "h0") { o.parks = {}; NODES.forEach((n, i) => o.parks[n] = P(l, 0.2 + i * 0.12, 0.3)); note = "18 desa · pesan tiba keesokan harinya"; spread(o, b, l, [["meneruskannya", [["A", "B"], ["A", "C"], ["A", "Q"]]]], DA); o.nums = {}; }
    if (id === "h1") { o.ring.J = { u: P(l, at(b, "desa J"), 0.6), color: DAYC[0] }; note = "Mulai dari J: berapa hari?"; nc = ORANGE; }
    if (id === "h2") { o.ring.J = { u: 1, color: DAYC[0] }; o.nums.J = { v: 0, a: P(l, at(b, "angka hari"), 0.4) }; note = "Beri angka hari, lapis demi lapis"; nc = "#2F6FD0"; }
    if (id === "h3") { o.ring.J = { u: 1, color: DAYC[0] }; fullState(o, DJ, 0); spread(o, b, l, [["desa E, H, G, dan M", [["J", "E"], ["J", "H"], ["J", "G"], ["J", "M"]]], ["hari kedua", [["E", "C"], ["E", "B"], ["H", "K"], ["H", "N"], ["G", "D"], ["G", "I"], ["M", "O"], ["M", "L"]]]], DJ, { stagger: 0.15 }); note = "Hari 1: 4 desa · Hari 2: 8 desa"; }
    if (id === "h4") { o.ring.J = { u: 1, color: DAYC[0] }; fullState(o, DJ, 2, TREE_J); spread(o, b, l, [["desa A, F, P, dan R", [["C", "A"], ["C", "F"], ["K", "P"], ["L", "R"]]]], DJ, { stagger: 0.25 }); o.ring.R = { u: P(l, at(b, "Desa R"), 0.6), color: DAYC[3] }; note = "Hari 3: A, F, P, R"; nc = DAYC[3]; }
    if (id === "h5") { o.ring.J = { u: 1, color: DAYC[0] }; fullState(o, DJ, 3, TREE_J); spread(o, b, l, [[0.6, [["A", "Q"], ["F", "Q"]]]], DJ); o.ring.Q = { u: P(l, 0.4, 0.6), color: DAYC[4] }; note = l > at(b, "Jadi, jawabannya") ? "Jawaban: 4 hari" : "Hari 4: Q"; nc = l > at(b, "Jadi, jawabannya") ? GREEN : DAYC[4]; }
    drawIsle(ctx, M, o);
    if (note) text(ctx, note, 960, 805, 44, { align: "center", weight: 900, color: nc, fit: 1000 });
  }
  function cta_bebras(ctx, b, l) {
    board(ctx);
    text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, META.judul, 960, 340, 66, { align: "center", weight: 900, color: INK, fit: 1000 });
    text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "Beri angka hari, lapis demi lapis", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
    kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
  }

  Object.assign(K.SCENES, { buka, kredit, pulau, sebar, contoh, hitung, periksa, bfs: bfs_, jaringan, langkah, akhir, pulau_v, cta_bebras });
})(typeof window !== "undefined" ? window : globalThis);
