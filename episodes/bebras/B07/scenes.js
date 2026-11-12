/* B07 Pembahasan Soal Bebras 2024-DE-03a "Bunga Ajaib" (Jerman), kategori SiKecil.
   Gaya papan tulis putih dengan coretan spidol (sama dengan B01–B04) + simulasi bunga ajaib tumbuh hari demi hari:
   setiap pagi setiap kuncup baru menumbuhkan satu batang; saat matahari terbenam ujung batang bercabang menjadi dua kuncup baru.
   Pilihan A–D digambar ulang dari koordinat gambar soal. Jawaban D (4 batang dari bawah ke ujung, semua kuncup tumbuh, 16 kuncup baru).
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Bunga Ajaib", asli: "", tahun: "2024", negara: "Jerman", kode: "2024-DE-03a" };

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
  // ---------- pembuka dan penutup ----------
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


  // ---------- bunga ajaib: kuncup, pasangan kuncup, batang ----------
  const STEM = "#4FBF7A", STEM_D = "#2E9A5A", BUD = "#C8141E", BUD_D = "#8E0C12";
  // satu kuncup: tetes merah dengan ujung runcing ke arah ang (0 = ke atas)
  function bud(ctx, x, y, r, ang = 0, a = 1) {
    if (a <= 0) return;
    const s = 0.4 + 0.6 * clamp(a, 0, 1);
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); ctx.globalAlpha *= clamp(a * 1.5, 0, 1);
    ctx.fillStyle = BUD; ctx.strokeStyle = BUD_D; ctx.lineWidth = Math.max(1.5, r * 0.14);
    ctx.beginPath(); ctx.moveTo(0, -r * 1.55);
    ctx.bezierCurveTo(r * 0.55, -r * 0.95, r * 1.05, -r * 0.35, r, r * 0.15);
    ctx.arc(0, r * 0.15, r, 0, Math.PI);
    ctx.bezierCurveTo(-r * 1.05, -r * 0.35, -r * 0.55, -r * 0.95, 0, -r * 1.55);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.ellipse(-r * 0.35, -r * 0.2, r * 0.18, r * 0.36, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  const budPos = (n, k, sc) => [n[0] + (k ? 1 : -1) * sc.off, n[1]];
  // pohon: { root: [x, y], n: [x, y, kids] } dalam koordinat sumber; tf = {cx, cy, s, ox, oy} memetakan ke papan.
  // Anak diurutkan dari kiri ke kanan: anak kiri tumbuh dari kuncup kiri, anak kanan dari kuncup kanan.
  // Anak tunggal tumbuh dari kuncup di sisinya; kuncup lainnya tidak tumbuh.
  function layout(tree, tf, r) {
    const P = p => [tf.cx + (p[0] - tf.ox) * tf.s, tf.cy + (p[1] - tf.oy) * tf.s];
    const sc = { r, off: r * 1.05 };
    const nodes = [], edges = [];
    const root = P(tree.root);
    function walk(src, d, from, id) {
      const p = P(src); const node = { x: p[0], y: p[1], d, id, kids: [], bare: [] };
      nodes.push(node); edges.push({ a: from, b: [p[0], p[1]], d, id });
      const ks = src[2].map(k => ({ k, dx: k[0] - src[0], dy: k[1] - src[1] }));
      ks.sort((u, v) => Math.atan2(u.dx, -u.dy) - Math.atan2(v.dx, -v.dy));
      if (ks.length === 1) {
        const side = ks[0].dx < 0 ? 0 : 1; node.bare = [1 - side];
        node.kids.push(walk(ks[0].k, d + 1, budPos([p[0], p[1]], side, sc), id + side));
      } else ks.forEach((o, i) => node.kids.push(walk(o.k, d + 1, budPos([p[0], p[1]], i, sc), id + i)));
      if (!ks.length) node.bare = [0, 1];
      return node;
    }
    const top = walk(tree.n, 1, [root[0], root[1] - r * 0.4], "");
    return { root, top, nodes, edges, sc };
  }
  // st(d) = panjang batang hari ke-d (0–1); bd(d) = munculnya dua kuncup di ujung batang hari ke-d (0–1)
  function drawTree(ctx, L, opt = {}) {
    const st = opt.st || (() => 1), bd = opt.bd || (() => 1), r = L.sc.r;
    ctx.save(); ctx.strokeStyle = STEM; ctx.lineCap = "round"; ctx.lineWidth = Math.max(3, r * 0.42);
    L.edges.forEach(e => {
      const u = clamp(st(e.d), 0, 1); if (u <= 0) return;
      ctx.beginPath(); ctx.moveTo(e.a[0], e.a[1]); ctx.lineTo(lerp(e.a[0], e.b[0], u), lerp(e.a[1], e.b[1], u)); ctx.stroke();
    });
    ctx.restore();
    bud(ctx, L.root[0], L.root[1], r, 0, 1);
    L.nodes.forEach(n => {
      const a = clamp(bd(n.d), 0, 1); if (a <= 0) return;
      for (const k of [0, 1]) { const p = budPos([n.x, n.y], k, L.sc); bud(ctx, p[0], p[1], r, k ? 0.75 : -0.75, a); }
    });
  }
  function findNode(L, id) { return L.nodes.find(n => n.id === id); }
  // jalur dari kuncup bawah ke node id: daftar titik
  function pathPts(L, id) {
    const pts = [[L.root[0], L.root[1]]];
    for (let k = 0; k <= id.length; k++) { const n = findNode(L, id.slice(0, k)); pts.push([n.x, n.y]); }
    return pts;
  }
  function numDot(ctx, x, y, s, n, col = ORANGE) {
    ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke();
    text(ctx, String(n), x, y + s * 0.36, s * 1.05, { align: "center", weight: 900, color: "#fff" }); ctx.restore();
  }
  // jalur dihitung: garis oranye tebal + nomor di samping setiap batang (u[i] = munculnya batang ke-i)
  function countPath(ctx, L, id, us, opt = {}) {
    const pts = pathPts(L, id), s = opt.dot || 22;
    for (let i = 1; i < pts.length; i++) {
      const u = us[i - 1] || 0; if (u <= 0) continue;
      mline(ctx, [pts[i - 1], pts[i]], u, "rgba(238,122,18,0.75)", opt.w || 10);
      if (u > 0.5) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        const len = Math.hypot(x1 - x0, y1 - y0) || 1, side = opt.side || 1;
        alpha(ctx, (u - 0.5) * 2, () => numDot(ctx, mx + side * (y1 - y0) / len * -(s + 14), my + side * (x1 - x0) / len * (s + 14), s, i));
      }
    }
  }

  // ---------- empat pilihan jawaban (koordinat dari gambar soal, diperbesar) ----------
  const OPT = {
    A: { root: [165, 420], n: [165, 345, [[135, 240, [[35, 215, []], [130, 160, []]]], [220, 280, [[210, 185, []], [275, 265, []]]]]] },
    B: { root: [638, 418], n: [638, 343, [[605, 240, [[515, 215, [[455, 180, []], [470, 250, []]]], [600, 165, [[610, 90, []]]]]], [695, 280, [[685, 185, [[660, 120, []], [730, 125, []]]], [770, 235, [[810, 135, []], [840, 240, []]]]]]]] },
    C: { root: [185, 845], n: [185, 768, [[155, 665, [[145, 590, []]]], [240, 705, [[230, 610, []], [320, 660, []]]]]] },
    D: { root: [628, 885], n: [625, 810, [[595, 705, [[505, 680, [[445, 640, []], [460, 715, []]]], [595, 630, [[525, 590, []], [600, 555, []]]]]], [680, 745, [[675, 650, [[650, 585, []], [720, 590, []]]], [760, 700, [[800, 600, []], [825, 705, []]]]]]]] },
  };
  const PATH = { A: "10", B: "100", C: "10", D: "101" };   // jalur yang dihitung dari bawah ke ujung
  function bbox(tree) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9;
    (function w(n) { x0 = Math.min(x0, n[0]); x1 = Math.max(x1, n[0]); y0 = Math.min(y0, n[1]); n[2].forEach(w); })(tree.n);
    return { x0: x0 - 12, x1: x1 + 12, y0: y0 - 12, cx: (x0 + x1) / 2 };
  }
  // pilihan k digambar dengan dasar kuncup bawah di (cx, baseY) dan skala s
  function optLayout(k, cx, baseY, s, r) {
    const t = OPT[k], bb = bbox(t);
    return layout(t, { cx, cy: baseY, s, ox: bb.cx, oy: t.root[1] }, r || 8.5 * s);
  }
  function letter(ctx, x, y, k, col = C.kiko, R = 34) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
    text(ctx, k, x, y + R * 0.42, R * 1.2, { align: "center", weight: 900, color: "#fff" });
  }

  // ---------- matahari dan langit ----------
  function sun(ctx, x, y, r, a = 1) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1);
    ctx.strokeStyle = "#F2B517"; ctx.lineWidth = r * 0.16; ctx.lineCap = "round";
    for (let i = 0; i < 8; i++) { const g = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + Math.cos(g) * r * 1.3, y + Math.sin(g) * r * 1.3); ctx.lineTo(x + Math.cos(g) * r * 1.65, y + Math.sin(g) * r * 1.65); ctx.stroke(); }
    ctx.fillStyle = "#FFD23F"; ctx.strokeStyle = "#E39A12"; ctx.lineWidth = r * 0.1;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  // posisi matahari pada busur: u 0 = terbit di kiri, 0,5 = di atas, 1 = terbenam di kanan
  const sunArc = (x0, x1, yH, hgt, u) => [lerp(x0, x1, u), yH - Math.sin(Math.PI * clamp(u, 0, 1)) * hgt];
  // jendela langit kecil (pagi biru, sore jingga) dengan garis tanah
  function sky(ctx, x, y, w, h, u, lab) {
    const eve = clamp((u - 0.75) / 0.25, 0, 1);
    ctx.save(); rr(ctx, x, y, w, h, 16); ctx.clip();
    ctx.fillStyle = eve > 0 ? `rgb(${Math.round(lerp(205, 252, eve))},${Math.round(lerp(232, 196, eve))},${Math.round(lerp(250, 150, eve))})` : "#CDE8FA";
    ctx.fillRect(x, y, w, h);
    const [sx, sy] = sunArc(x + 30, x + w - 30, y + h - 26, h - 70, u);
    if (u >= 0 && u <= 1.02) sun(ctx, sx, sy, 22);
    ctx.fillStyle = "#9BCB7A"; ctx.fillRect(x, y + h - 26, w, 26);
    ctx.restore();
    ctx.save(); ctx.strokeStyle = "#8D99A3"; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 16); ctx.stroke(); ctx.restore();
    if (lab) text(ctx, lab, x + w / 2, y - 14, 30, { align: "center", weight: 900, color: C.ink2 });
  }

  // ---------- adegan soal: satu kuncup, pagi tumbuh batang, sore bercabang ----------
  const SOAL = ["soal1", "soal2", "soal3"];
  function soal(ctx, b, l) {
    board(ctx);
    const o = prog(SOAL, b, l);
    const GX = 560, GY = 770, TOP = 360;
    // langit dan tanah
    const su = b.id === "soal1" ? -1 : b.id === "soal2" ? 0.45 * P(l, at(b, "matahari terbit"), 1.6) :
      0.45 + 0.55 * P(l, at(b, "matahari terbenam") - 0.6, 1.8);
    ctx.save(); rr(ctx, 120, 170, 900, 640, 20); ctx.clip();
    const eve = b.id === "soal3" ? clamp((su - 0.8) / 0.2, 0, 1) : 0;
    ctx.fillStyle = eve > 0 ? `rgb(${Math.round(lerp(220, 252, eve))},${Math.round(lerp(238, 205, eve))},${Math.round(lerp(250, 165, eve))})` : (b.id === "soal1" ? "#E9EEF2" : "#DCEFFB");
    ctx.fillRect(120, 170, 900, 640);
    if (su >= 0) { const [sx, sy] = sunArc(170, 970, GY + 10, 520, su); sun(ctx, sx, sy, 46); }
    ctx.fillStyle = "#A9D48A"; ctx.fillRect(120, GY + 6, 900, 60);
    ctx.restore();
    ctx.save(); ctx.strokeStyle = "#B8C3CA"; ctx.lineWidth = 3; rr(ctx, 120, 170, 900, 640, 20); ctx.stroke(); ctx.restore();
    // bunga
    const g = o("soal2", () => P(l, at(b, "menumbuhkan"), Math.max(1, b.audio - at(b, "menumbuhkan") - 0.3)));
    const R = 30;
    const stemTop = lerp(GY - R * 0.4, TOP, g);
    if (g > 0) { ctx.save(); ctx.strokeStyle = STEM; ctx.lineCap = "round"; ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(GX, GY - R * 0.4); ctx.lineTo(GX, stemTop); ctx.stroke(); ctx.restore(); }
    bud(ctx, GX, GY - 4, R, 0, 1);
    const pb = o("soal3", () => P(l, at(b, "dua kuncup baru"), 0.7));
    if (pb > 0) { bud(ctx, GX - R * 1.05, TOP, R, -0.75, pb); bud(ctx, GX + R * 1.05, TOP, R, 0.75, pb); }
    if (b.id === "soal1") {
      alpha(ctx, P(l, at(b, "bunga ajaib"), 0.6), () => hand(ctx, "bunga ajaib", GX, 300, 56, { color: BLUE }));
      alpha(ctx, P(l, at(b, "Awalnya"), 0.6), () => { hand(ctx, "kuncup", GX + 170, GY - 10, 46, { color: ORANGE }); mline(ctx, [[GX + 90, GY - 22], [GX + 42, GY - 18]], 1, ORANGE, 5, true); });
    }
    if (b.id === "soal2" && g > 0.05) alpha(ctx, P(l, at(b, "terus tumbuh"), 0.6), () => { mline(ctx, [[GX + 60, GY - 60], [GX + 60, stemTop + 20]], 1, GREEN, 6, true); hand(ctx, "tumbuh", GX + 150, (GY + stemTop) / 2, 40, { color: GREEN }); });
    if (b.id === "soal3") {
      alpha(ctx, P(l, at(b, "dua kuncup baru"), 0.6), () => { hand(ctx, "2 kuncup baru", GX, TOP - 70, 46, { color: ORANGE }); });
      alpha(ctx, P(l, at(b, "berhenti tumbuh"), 0.6), () => hand(ctx, "berhenti tumbuh", GX + 200, 560, 40, { color: RED }));
    }
    // aturan di kanan
    const rules = [
      ["soal2", "Pagi:", "setiap kuncup baru", "menumbuhkan 1 batang.", "setiap kuncup baru"],
      ["soal3", "Sore:", "ujung batang bercabang,", "muncul 2 kuncup baru.", "bercabang"],
    ];
    if (b.id !== "soal1") {
      text(ctx, "ATURAN BUNGA AJAIB", 1440, 250, 34, { align: "center", weight: 900, color: C.accentDark });
      rules.forEach(([id, k, l1, l2, ph], i) => {
        const a = o(id, () => P(l, at(b, ph), 0.6)); if (a <= 0) return;
        alpha(ctx, a, () => {
          const y = 310 + i * 230;
          card(ctx, 1090, y, 700, 200, { fill: i ? "#FFF3E6" : "#EAF6FD", stroke: i ? "#F3B27A" : "#9CCBEB", lw: 3, r: 20 });
          sun(ctx, 1160, y + 62, 26, 1);
          text(ctx, k, 1215, y + 76, 42, { weight: 900, color: i ? ORANGE : BLUE });
          text(ctx, l1, 1130, y + 132, 38, { weight: 800, color: INK });
          text(ctx, l2, 1130, y + 180, 38, { weight: 800, color: INK });
        });
      });
    } else kiko(ctx, 1450, 540, 200, 0, { mood: "happy" });
  }

  // ---------- tabel: sebelum terbit, setelah hari 1, setelah hari 2 ----------
  const T2 = { root: [0, 0], n: [0, -150, [[-70, -255, []], [80, -245, []]]] };
  const T1 = { root: [0, 0], n: [0, -150, []] };
  function tabel(ctx, b, l) {
    board(ctx);
    const cols = [["Kuncup sebelum", "matahari terbit", null, 0], ["Setelah", "hari pertama", T1, at(b, "Lihat")], ["Setelah", "hari kedua", T2, at(b, "Dan ini")]];
    cols.forEach(([h1, h2, tree, t0], i) => {
      const x = 170 + i * 540, a = i ? P(l, t0 - 0.2, 0.6) : 1;
      alpha(ctx, a, () => {
        card(ctx, x, 180, 500, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
        text(ctx, h1, x + 250, 245, 36, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, h2, x + 250, 292, 40, { align: "center", weight: 900, color: INK });
        if (!tree) bud(ctx, x + 250, 700, 26, 0, 1);
        else drawTree(ctx, layout(tree, { cx: x + 250, cy: 700, s: 1.25, ox: 0, oy: 0 }, 22));
      });
      if (i < 2) alpha(ctx, P(l, cols[i + 1][3] - 0.2, 0.6), () => mline(ctx, [[x + 492, 560], [x + 548, 560]], 1, ORANGE, 7, true));
    });
    alpha(ctx, P(l, at(b, "hari demi hari"), 0.6), () => hand(ctx, "hari demi hari →", 960, 822, 38, { color: ORANGE }));
  }

  // ---------- pilihan jawaban: soal5, j0–j4 ----------
  const PIL = ["soal5", "j0", "j1", "j2", "j3", "j4"];
  const OCX = { A: 300, B: 750, C: 1185, D: 1600 }, OBASE = 800, OS = 1.28;
  function pilihan(ctx, b, l) {
    board(ctx);
    const o = prog(PIL, b, l);
    const keys = ["A", "B", "C", "D"];
    const show = b.id === "soal5" ? keys.map((k, i) => P(l, at(b, "empat pilihan") + i * 0.45, 0.5)) : [1, 1, 1, 1];
    // tanda per pilihan
    const crossA = o("j2", () => P(l, at(b, "Pilihan A salah"), 0.6));
    const crossC = o("j3", () => P(l, at(b, "pilihan C juga salah"), 0.6));
    const pA = o("j2", () => 1) > 0 ? atSeqU(b, "j2", l, o) : [0, 0, 0];
    const pC = o("j3", () => 1) > 0 ? atSeqU(b, "j3", l, o) : [0, 0, 0];
    const pBD = b.id === "j4" ? [0, 1, 2, 3].map(i => P(l, at(b, "empat batang") - 0.6 + i * 0.35, 0.4)) : [0, 0, 0, 0];
    keys.forEach((k, i) => {
      if (show[i] <= 0) return;
      alpha(ctx, show[i], () => {
        const cx = OCX[k], dead = k === "A" ? crossA : k === "C" ? crossC : 0;
        const L = optLayout(k, cx, OBASE, OS);
        ctx.save(); ctx.globalAlpha *= 1 - 0.5 * dead;
        letter(ctx, cx - 150, 330, k, dead > 0.5 ? GRAYT : C.kiko);
        drawTree(ctx, L); ctx.restore();
        if (k === "A") countPath(ctx, L, PATH.A, pA, { dot: 21, w: 8 });
        if (k === "C") countPath(ctx, L, PATH.C, pC, { dot: 21, w: 8, side: -1 });
        if (k === "B" || k === "D") countPath(ctx, L, PATH[k], pBD, { dot: 21, w: 8, side: k === "B" ? -1 : 1 });
        if (dead > 0) { cross(ctx, cx - 150, 330, 70, dead, RED, 9); }
      });
    });
    if (crossA > 0) alpha(ctx, crossA, () => hand(ctx, "baru 3 hari", OCX.A, 420, 40, { color: RED }));
    if (crossC > 0) alpha(ctx, crossC, () => hand(ctx, "baru 3 hari", OCX.C, 420, 40, { color: RED }));
    if (b.id === "j4") ["B", "D"].forEach(k => alpha(ctx, P(l, at(b, "empat batang"), 0.6), () => hand(ctx, "4 batang", OCX[k] + 60, 335, 40, { color: GREEN })));
    // kepala adegan
    if (b.id === "soal5") alpha(ctx, P(l, 0.3, 0.6), () => text(ctx, "Bunga ajaib mana yang sudah tumbuh 4 hari?", 960, 225, 52, { align: "center", weight: 900, color: INK }));
    if (b.id === "j0") thinkBadge(ctx, 560, 150, 800, 110, l, b.dur, "Bunga mana yang tumbuh 4 hari?");
    if (["j1", "j2", "j3"].includes(b.id)) alpha(ctx, b.id === "j1" ? P(l, at(b, "Cara pertama"), 0.6) : 1, () => {
      card(ctx, 360, 160, 1200, 92, { fill: "#FFF4E3", stroke: ORANGE, lw: 3, r: 18 });
      text(ctx, "Cara 1: hitung batang dari bawah ke ujung. Harus 4.", 960, 222, 40, { align: "center", weight: 900, color: INK });
    });
    if (b.id === "j4") alpha(ctx, P(l, at(b, "cara kedua"), 0.6), () => {
      card(ctx, 300, 160, 1320, 92, { fill: "#EAF6EE", stroke: GREEN, lw: 3, r: 18 });
      text(ctx, "Cara 2: apakah setiap kuncup baru sudah tumbuh?", 960, 222, 40, { align: "center", weight: 900, color: INK });
    });
  }
  // nomor batang 1, 2, 3 pada j2 (A) dan j3 (C), mengikuti kata "satu, dua, tiga" atau "tiga batang"
  function atSeqU(b, id, l, o) {
    if (b.id !== id) return [1, 1, 1];
    if (id === "j2") return atSeq(b, ["satu", "dua", "tiga"]).map(t => P(l, t, 0.45));
    const t0 = at(b, "melewati"); return [0, 1, 2].map(i => P(l, t0 + i * 0.4, 0.4));
  }

  // ---------- simulasi: bunga ajaib tumbuh 4 hari (w1–w6) ----------
  const GROW = ["w1", "w2", "w3", "w4", "w5", "w6"];
  const SIM_TREE = (() => {   // pohon penuh 4 hari: ujung (16 kuncup) berjarak sama
    const X0 = 690, DX = 68, Y = [805, 640, 500, 385, 290];
    function mk(d, i0, n) {
      const xs = []; for (let i = i0; i < i0 + n; i++) xs.push(X0 + i * DX);
      const x = (xs[0] + xs[xs.length - 1]) / 2;
      return [x, Y[d], d === 4 ? [] : [mk(d + 1, i0, n / 2), mk(d + 1, i0 + n / 2, n / 2)]];
    }
    return { root: [X0 + 7.5 * DX, 800], n: mk(1, 0, 16) };
  })();
  const DAY = {   // [frasa batang tumbuh, frasa kuncup baru muncul, jumlah batang, jumlah kuncup]
    w1: ["menumbuhkan satu batang", "Sore harinya", 1, 2], w2: ["tumbuh dua batang", "Sore harinya", 2, 4],
    w3: ["menumbuhkan empat batang", "Sore harinya", 4, 8], w4: ["menumbuhkan delapan batang", "Sore harinya", 8, 16],
  };
  function tumbuh(ctx, b, l) {
    board(ctx);
    const L = layout(SIM_TREE, { cx: 0, cy: 0, s: 1, ox: 0, oy: 0 }, 15);
    const k = GROW.indexOf(b.id), day = Math.min(k + 1, 4), D = DAY[b.id];
    let sg = 1, bu = 1, su = 1.2;
    if (D) {
      const t1 = at(b, D[0]), t2 = at(b, D[1]);
      sg = P(l, t1 - 0.3, Math.max(0.8, t2 - t1)); bu = P(l, t2 + 0.2, 0.7);
      su = clamp((l - (t1 - 1.2)) / (t2 + 0.6 - (t1 - 1.2)), 0, 1.2);
    }
    const st = d => d < day ? 1 : d === day ? sg : 0, bd = d => d < day ? 1 : d === day ? bu : 0;
    drawTree(ctx, L, { st, bd });
    // kuncup yang baru muncul diberi lingkaran oranye; pada w1 kuncup bawah ditunjuk dulu
    if (b.id === "w1") alpha(ctx, P(l, at(b, "satu kuncup"), 0.5) * (1 - bu), () => ring(ctx, L.root[0], L.root[1] - 4, 34, 34, 1, ORANGE, 5));
    if (D && bu > 0) L.nodes.filter(n => n.d === day).forEach(n => ring(ctx, n.x, n.y - 4, 40, 26, bu, ORANGE, 4));
    // panel kiri: langit + daftar hari
    sky(ctx, 100, 200, 400, 200, D ? su : 1.2, "HARI KE-" + day);
    const rows = [[1, 1, 2], [2, 2, 4], [3, 4, 8], [4, 8, 16]];
    rows.forEach(([h, s, c], i) => {
      if (i + 1 > day) return;
      const cur = i + 1 === day && D, y = 470 + i * 88;
      const a = cur ? P(l, at(b, D[0]) - 0.3, 0.5) : 1;
      alpha(ctx, a, () => {
        if (cur) { ctx.fillStyle = "#FFF4D6"; rr(ctx, 92, y - 52, 450, 78, 14); ctx.fill(); }
        text(ctx, "Hari " + h, 112, y, 34, { weight: 900, color: INK });
        const cA = cur ? bu : 1;
        if (cA > 0) alpha(ctx, cA, () => { text(ctx, String(c), 300, y + 4, 50, { align: "center", weight: 900, color: ORANGE }); text(ctx, "kuncup baru", 340, y, 30, { weight: 800, color: C.ink2 }); });
      });
    });
    if (b.id === "w4") alpha(ctx, P(l, at(b, "makin lebat"), 0.6), () => hand(ctx, "makin lebat!", 1230, 200, 48, { color: GREEN }));
    if (b.id === "w5") {
      const T = atSeq(b, ["Satu", "dua", "tiga", "empat"]);
      countPath(ctx, L, "011", T.map(t => P(l, t, 0.45)), { dot: 22, w: 10 });
      alpha(ctx, P(l, at(b, "karena"), 0.6), () => hand(ctx, "4 hari → 4 batang", 1230, 200, 50, { color: ORANGE }));
    }
    if (b.id === "w6") {
      const a1 = P(l, at(b, "pasti menumbuhkan"), 0.8);
      L.nodes.filter(n => n.d < 4).forEach((n, i) => tick(ctx, n.x + 34, n.y + 10, 30, clamp(a1 * 2 - i / 15, 0, 1), GREEN, 6));
      alpha(ctx, P(l, at(b, "tidak ada kuncup"), 0.6), () => hand(ctx, "semua kuncup menumbuhkan batang", 1240, 180, 40, { color: GREEN }));
      const a2 = P(l, at(b, "kecuali"), 0.6);
      alpha(ctx, a2, () => {
        ctx.save(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.setLineDash([12, 10]);
        rr(ctx, 650, 240, 1180, 80, 30); ctx.stroke(); ctx.restore();
        hand(ctx, "kecuali kuncup paling baru di ujung atas", 1240, 228, 38, { color: ORANGE });
      });
    }
  }
  // batang boleh miring dan panjangnya berbeda (w7): tiga bunga 2 hari yang semuanya benar
  const MIR = [
    { root: [0, 0], n: [0, -150, [[-90, -260, []], [90, -260, []]]] },
    { root: [0, 0], n: [-40, -170, [[-150, -230, []], [-30, -330, []]]] },
    { root: [0, 0], n: [30, -110, [[20, -200, []], [150, -160, []]]] },
  ];
  function miring(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["miring ke kiri", "panjang atau pendek", "aturannya sama"]);
    const ap = [P(l, 0.3, 0.6), P(l, T[0], 0.6), P(l, T[1], 0.6)];
    MIR.forEach((t, i) => alpha(ctx, ap[i], () => {
      const x = 420 + i * 540;
      card(ctx, x - 230, 230, 460, 520, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      drawTree(ctx, layout(t, { cx: x, cy: 680, s: 1.15, ox: 0, oy: 0 }, 22));
    }));
    alpha(ctx, P(l, T[2], 0.6), () => {
      [420, 960, 1500].forEach(x => { text(ctx, "2 hari", x - 10, 820, 40, { align: "center", weight: 900, color: GREEN }); tick(ctx, x + 85, 806, 40, 1, GREEN, 7); });
      hand(ctx, "bentuknya berbeda, aturannya sama", 960, 200, 48, { color: ORANGE });
    });
  }

  // ---------- memeriksa B dan D (k1–k4) ----------
  const PER = ["k1", "k2", "k3", "k4"];
  const PS = 1.55, PB = { B: [520, 812], D: [1400, 812] };
  const zin0 = b => b.id === "k1" || b.id === "k2";
  function periksa(ctx, b, l) {
    board(ctx);
    const o = prog(PER, b, l);
    const LB = optLayout("B", PB.B[0], PB.B[1], PS, 15), LD = optLayout("D", PB.D[0], PB.D[1], PS, 15);
    const deadB = o("k2", () => P(l, at(b, "Pilihan B salah"), 0.6));
    const win = o("k4", () => P(l, at(b, "jawabannya adalah D"), 0.8));
    // B
    ctx.save(); ctx.globalAlpha *= 1 - 0.45 * deadB; letter(ctx, 150, 210, "B", deadB > 0.5 ? GRAYT : C.kiko, 40); drawTree(ctx, LB); ctx.restore();
    const bare = LB.nodes.find(n => n.bare.length === 1), bp = budPos([bare.x, bare.y], bare.bare[0], LB.sc);
    const look = o("k1", () => P(l, at(b, "bagian ini"), 0.7));
    if (look > 0 && zin0(b)) ring(ctx, bare.x, bare.y - 4, 62, 46, look, BLUE, 5);
    // kaca pembesar: pasangan kuncup itu digambar besar di sebelah kanan (k1–k2), D belum ditampilkan
    const zin = b.id === "k1" || b.id === "k2" ? (b.id === "k1" ? P(l, at(b, "bagian ini") + 0.3, 0.7) : 1) : 0;
    if (zin > 0) alpha(ctx, zin, () => {
      const ZX = 1300, ZY = 510, ZR = 220;
      mline(ctx, [[bare.x + 62, bare.y - 10], [ZX - ZR, ZY - 60]], 1, BLUE, 4);
      ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(ZX, ZY, ZR, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.clip();
      const R = 44, lx = ZX - R * 1.7, rx = ZX + R * 1.7, by = ZY + 70;
      ctx.strokeStyle = STEM; ctx.lineCap = "round"; ctx.lineWidth = 20;
      ctx.beginPath(); ctx.moveTo(ZX, ZY + ZR); ctx.lineTo(ZX, by + 30); ctx.lineTo(lx, by); ctx.moveTo(ZX, by + 30); ctx.lineTo(rx, by); ctx.stroke();
      const side = bare.bare[0], gx = side ? lx : rx, bx = side ? rx : lx;
      ctx.beginPath(); ctx.moveTo(gx, by - 30); ctx.lineTo(gx + (side ? -30 : 30), ZY - ZR); ctx.stroke();
      bud(ctx, lx, by, R, -0.75, 1); bud(ctx, rx, by, R, 0.75, 1);
      ctx.restore();
      const rb = o("k1", () => P(l, at(b, "Kuncup yang satu lagi"), 0.7));
      const gr = o("k1", () => P(l, at(b, "hanya satu kuncup"), 0.6));
      if (gr > 0) { circleDraw(ctx, gx, by - 6, 64, gr, GREEN, 7); alpha(ctx, gr, () => hand(ctx, "tumbuh", ZX + ZR + 24, ZY - 40, 48, { color: GREEN, align: "left" })); }
      if (rb > 0) { circleDraw(ctx, bx, by - 6, 64, rb, RED, 7); alpha(ctx, rb, () => hand(ctx, "tidak tumbuh!", ZX, ZY + ZR + 62, 48, { color: RED })); }
    });
    if (deadB > 0) { cross(ctx, 150, 210, 84, deadB, RED, 10); alpha(ctx, deadB, () => hand(ctx, "tidak sesuai aturan", 220, 225, 40, { color: RED, align: "left" })); }
    // D
        const dA = b.id === "k1" || b.id === "k2" ? 0 : b.id === "k3" ? P(l, 0.1, 0.6) : 1;
    alpha(ctx, dA, () => drawTree(ctx, LD));
    if (dA > 0) alpha(ctx, dA, () => letter(ctx, 1030, 210, "D", win > 0.5 ? GREEN : C.kiko, 40));
    const tk = o("k3", () => P(l, at(b, "Setiap kuncup"), 1.6));
    LD.nodes.filter(n => n.kids.length).forEach((n, i) => tick(ctx, n.x + 44, n.y + 6, 28, clamp(tk * 7 - i, 0, 1), GREEN, 6));
    const cnt = o("k4", () => clamp((l - at(b, "enam belas") + 0.8) / 2.2, 0, 1));
    const tips = LD.nodes.filter(n => !n.kids.length).sort((p, q) => p.x - q.x);
    let num = 0;
    tips.forEach(n => [0, 1].forEach(kk => {
      num++; const v = clamp(cnt * 16 - (num - 1), 0, 1); if (v <= 0) return;
      const p = budPos([n.x, n.y], kk, LD.sc);
      alpha(ctx, v, () => { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(p[0] + (kk ? 12 : -12), p[1] - 44, 17, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(num), p[0] + (kk ? 12 : -12), p[1] - 34, 26, { align: "center", weight: 900, color: ORANGE }); });
    }));
    alpha(ctx, o("k4", () => P(l, at(b, "sama seperti"), 0.6)), () => hand(ctx, "16 kuncup baru", 1640, 200, 46, { color: ORANGE }));
    if (win > 0) ring(ctx, 1030, 210, 62, 62, win, GREEN, 8);
    // keterangan bawah
    if (b.id === "k3") alpha(ctx, P(l, at(b, "empat batang"), 0.6), () => hand(ctx, "4 batang dari bawah ke ujung", 1500, 200, 40, { color: GREEN }));
  }

  // ---------- penutup ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Pahami aturannya", "tumbuhkan sendiri", "periksa setiap pilihan"]);
    const S = ["Pahami aturannya dulu.", "Tumbuhkan sendiri, hari demi hari.", "Periksa setiap pilihan dengan aturan itu."];
    S.forEach((s, i) => {
      const y = 170 + i * 185;
      alpha(ctx, P(l, T[i], 0.5), () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 50, { weight: 900, color: INK, fit: 1060 });
        const ix = 1580, iy = y + 80;
        if (i === 0) drawTree(ctx, layout(T1, { cx: ix, cy: iy + 55, s: 0.7, ox: 0, oy: 0 }, 13));
        if (i === 1) sun(ctx, ix, iy, 34, 1);
        if (i === 2) { ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(ix - 10, iy - 10, 36, 0, Math.PI * 2); ctx.stroke();
          ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(ix + 16, iy + 16); ctx.lineTo(ix + 50, iy + 50); ctx.stroke(); ctx.restore(); tick(ctx, ix - 10, iy - 8, 40, 1, GREEN, 6); }
      });
    });
  }

  // ---------- versi tegak untuk Short: aturan bunga ajaib (area x 460–1460, y 140–840) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    const T = [0.3, 0.62].map(f => f * (b.audio || b.dur));   // dipakai di Short: waktu dibagi rata, tidak bergantung teks beat asal
    const panels = [["kuncup", null], ["pagi: tumbuh batang", T1], ["sore: 2 kuncup baru", T2]];
    panels.forEach(([lab, tree], i) => {
      const x = 640 + i * 320, a = i === 0 ? 1 : P(l, T[i - 1], 0.6);
      alpha(ctx, a, () => {
        card(ctx, x - 145, 180, 290, 470, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 18 });
        if (i === 1) sun(ctx, x + 90, 240, 26);
        if (!tree) bud(ctx, x, 590, 24, 0, 1);
        else drawTree(ctx, layout(i === 1 ? { root: [0, 0], n: [0, -170, []] } : { root: [0, 0], n: [0, -170, [[-60, -280, []], [70, -270, []]]] }, { cx: x, cy: 600, s: 1.15, ox: 0, oy: 0 }, 20), { bd: d => i === 1 ? 0 : 1 });
        text(ctx, lab, x, 700, 30, { align: "center", weight: 900, color: i === 2 ? ORANGE : i === 1 ? BLUE : INK, fit: 300 });
      });
      if (i < 2) alpha(ctx, P(l, T[i], 0.6), () => mline(ctx, [[x + 150, 420], [x + 172, 420]], 1, ORANGE, 6, true));
    });
    text(ctx, "Begitu terus, hari demi hari.", 960, 790, 44, { align: "center", weight: 900, color: INK });
  }

  function flagDE(ctx, x, y, w) {   // bendera Jerman: hitam, merah, emas
    const h = w * 0.6;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    [["#1B1B1B", 0], ["#DD1C1A", 1], ["#FFCE00", 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(x, y + i * h / 3, w, h / 3 + 0.5); });
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  Object.assign(K.SCENES, {
    soal, tabel, pilihan, tumbuh, miring, periksa, langkah, soal_v,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "satu soal"), 0.8) : 1;
      [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
      if (!first) hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1230, 770, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
      kiko(ctx, 380, 560, 230, 0, { wave: l, mood: "happy" });
    },
    kredit(ctx, b, l) {
      board(ctx);
      const u = P(l, 0.2, 0.6);
      ctx.save(); ctx.globalAlpha = u;
      const gx = 380, gy = 500, gr = 160;
      ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
      ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
      for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
      ctx.restore();
      const fu = P(l, at(b, "Jerman"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagDE(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Jerman"), 0.8);
      if (au > 0) ring(ctx, 1190, 300 + 2 * 92 - 14, 220, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      drawTree(ctx, layout(T2, { cx: 760, cy: 740, s: 1.6, ox: 0, oy: 0 }, 26));
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const LL = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      LL.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Sampai jumpa!", 560, 800, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Menumbuhkan bunga ajaib hari demi hari", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
