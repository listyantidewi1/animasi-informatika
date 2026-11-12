/* PNG07 Pembahasan Soal Bebras 2025-CH-04 "Kayu Berang-berang" (Swiss), kategori Penggalang (SMP).
   Papan tulis + tabel catatan pohon Severin, Quirina, Ladina (ikon digambar dengan kode; isi tabel dibuat untuk video).
   Jawaban diperiksa di kode (urutan tanya: Severin lalu Ladina) dan dilaporkan lewat K._warn bila salah.
   Papan: x 52-1868, y 130-830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Kayu Berang-berang", tahun: "2025", negara: "Swiss", kode: "2025-CH-04" };

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
    if (o.scarf) { ctx.fillStyle = o.scarf; rr(ctx, -24, 4, 48, 11, 5); ctx.fill(); ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(22, 30); ctx.lineTo(13, 32); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -23, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -24.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }  const BLUE = "#2F6FD0", LEAF = "#5DAA4B", LEAFD = "#2E6B2A";
  function flagCH(ctx, x, y, w) {   // bendera Swiss: persegi merah dengan salib putih
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, w + 150);
    ctx.fillStyle = "#DA291C"; ctx.fillRect(x, y, w, w);
    ctx.fillStyle = "#FFFFFF"; const a = w * 0.19, b = w * 0.625;
    ctx.fillRect(x + w / 2 - a / 2, y + (w - b) / 2, a, b); ctx.fillRect(x + (w - b) / 2, y + w / 2 - a / 2, b, a);
  }

  // ---------- ikon: daun, pohon, buah, kayu, pondok ----------
  function leaf(ctx, kind, x, y, s, rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = LEAF; ctx.strokeStyle = LEAFD; ctx.lineWidth = Math.max(2, s * 0.035); ctx.lineJoin = "round";
    const R = s / 2;
    if (kind === "ek") {        // tepi berlekuk-lekuk
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) { const t = i / 200 * Math.PI * 2, bump = 1 + 0.16 * Math.abs(Math.sin(t * 4.5)); const xx = Math.sin(t) * R * 0.5 * bump, yy = -Math.cos(t) * R * 0.88 * (0.95 + 0.05 * bump); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (kind === "maple") {   // menjari, lima ujung
      const pts = [];
      const tips = [-90, -38, 12, 168, 218].map(d => d * Math.PI / 180), tipsLen = [1, 0.85, 0.55, 0.55, 0.85];
      const order = [3, 4, 0, 1, 2];   // dari kiri bawah memutar ke kanan bawah
      order.forEach((k, j) => { const a = tips[k] < -1.6 ? tips[k] : tips[k]; pts.push([Math.cos(tips[k]) * R * tipsLen[k], Math.sin(tips[k]) * R * tipsLen[k] - R * 0.05]);
        if (j < 4) { const a2 = (tips[k] + tips[order[j + 1]]) / 2 + (k === 4 ? 0 : 0); const nk = order[j + 1]; let am = (tips[k] + tips[nk]) / 2; if (k === 4 && nk === 0) am = (218 * Math.PI / 180 + 270 * Math.PI / 180) / 2; pts.push([Math.cos(am) * R * 0.32, Math.sin(am) * R * 0.32 - R * 0.05]); } });
      pts.push([R * 0.06, R * 0.28]); pts.push([-R * 0.06, R * 0.28]);
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); [0, 1, 2, 3, 4].forEach(k => { ctx.moveTo(0, R * 0.15); ctx.lineTo(Math.cos(tips[k]) * R * tipsLen[k] * 0.75, Math.sin(tips[k]) * R * tipsLen[k] * 0.75 - R * 0.05); }); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, R * 0.2); ctx.lineTo(0, R * 0.62); ctx.stroke();
      ctx.restore(); return;
    } else if (kind === "dedalu") {   // panjang dan ramping
      ctx.rotate(0.35); ctx.beginPath(); ctx.ellipse(0, 0, R * 0.17, R * 0.92, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (kind === "cemara") {   // daun jarum
      ctx.strokeStyle = "#7A5230"; ctx.lineWidth = Math.max(2, s * 0.04); ctx.beginPath(); ctx.moveTo(0, R * 0.9); ctx.lineTo(0, -R * 0.9); ctx.stroke();
      ctx.strokeStyle = "#2F7A3A"; ctx.lineWidth = Math.max(2, s * 0.035);
      for (let i = 0; i < 9; i++) { const yy = -R * 0.8 + i * R * 0.2; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(k * R * 0.42, yy - R * 0.2); ctx.stroke(); } }
      ctx.restore(); return;
    }
    ctx.beginPath(); ctx.moveTo(0, -R * 0.75); ctx.lineTo(0, R * 1.0); ctx.stroke();
    ctx.restore();
  }
  function tree(ctx, kind, x, y, s) {   // ikon pohon kecil (alas di y)
    ctx.save(); ctx.translate(x, y); const k = s / 100;
    ctx.fillStyle = "#8A5A33"; ctx.fillRect(-6 * k, -34 * k, 12 * k, 34 * k);
    if (kind === "cemara") { ctx.fillStyle = "#2F7A3A"; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(0, -100 * k + i * 20 * k); ctx.lineTo(-(26 + i * 10) * k, -50 * k + i * 16 * k); ctx.lineTo((26 + i * 10) * k, -50 * k + i * 16 * k); ctx.closePath(); ctx.fill(); } }
    else if (kind === "dedalu") { ctx.fillStyle = "#86B84E"; ctx.beginPath(); ctx.ellipse(0, -66 * k, 36 * k, 30 * k, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = "#86B84E"; ctx.lineWidth = 6 * k; ctx.lineCap = "round"; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 10 * k, -66 * k); ctx.quadraticCurveTo(i * 13 * k, -40 * k, i * 14 * k, -22 * k); ctx.stroke(); } }
    else { const col = kind === "maple" ? "#E0892F" : "#4E9A3A"; ctx.fillStyle = col; [[0, -72, 30], [-22, -58, 22], [22, -58, 22], [-12, -84, 18], [14, -86, 18]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(dx * k, dy * k, r * k * (kind === "ek" ? 1.1 : 1), 0, Math.PI * 2); ctx.fill(); }); }
    ctx.restore();
  }
  function fruit(ctx, kind, x, y, s) {
    ctx.save(); ctx.translate(x, y); const R = s / 2; ctx.strokeStyle = "#4A2E17"; ctx.lineWidth = Math.max(2, s * 0.04);
    if (kind === "biji") {   // biji ek
      ctx.fillStyle = "#B7792F"; ctx.beginPath(); ctx.ellipse(0, R * 0.15, R * 0.42, R * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#7A5230"; ctx.beginPath(); ctx.ellipse(0, -R * 0.3, R * 0.52, R * 0.3, 0, Math.PI, 0); ctx.lineTo(R * 0.52, -R * 0.22); ctx.lineTo(-R * 0.52, -R * 0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -R * 0.6); ctx.lineTo(R * 0.06, -R * 0.82); ctx.stroke();
    } else if (kind === "sayap") {   // buah bersayap (maple)
      ctx.fillStyle = "#D9B26A";
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, R * 0.3); ctx.quadraticCurveTo(k * R * 0.2, -R * 0.6, k * R * 0.85, -R * 0.55); ctx.quadraticCurveTo(k * R * 0.75, -R * 0.1, k * R * 0.15, R * 0.35); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = "#9C6B2E"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * R * 0.12, R * 0.35, R * 0.16, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    } else {   // runjung
      ctx.fillStyle = "#9A6332"; ctx.beginPath(); ctx.ellipse(0, 0, R * 0.42, R * 0.82, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#5E3A1C"; ctx.lineWidth = Math.max(1.5, s * 0.03);
      for (let i = -3; i <= 3; i++) { const yy = i * R * 0.22, w = R * 0.42 * Math.sqrt(Math.max(0, 1 - (yy / (R * 0.82)) ** 2)); ctx.beginPath(); ctx.moveTo(-w, yy - R * 0.08); ctx.quadraticCurveTo(0, yy + R * 0.12, w, yy - R * 0.08); ctx.stroke(); }
    }
    ctx.restore();
  }
  function swatch(ctx, col, x, y, w, h) {   // potongan kayu dengan serat
    ctx.save(); ctx.fillStyle = col; rr(ctx, x - w / 2, y - h / 2, w, h, 8); ctx.fill(); ctx.strokeStyle = "rgba(60,35,15,0.55)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = "rgba(60,35,15,0.28)"; ctx.lineWidth = 2;
    for (let i = 1; i <= 3; i++) { const yy = y - h / 2 + i * h / 4; ctx.beginPath(); ctx.moveTo(x - w / 2 + 6, yy); ctx.bezierCurveTo(x - w / 6, yy - 5, x + w / 6, yy + 5, x + w / 2 - 6, yy); ctx.stroke(); }
    ctx.restore();
  }
  function lodge(ctx, x, y, s) {   // pondok berang-berang dari ranting (alas di y)
    ctx.save(); ctx.translate(x, y); const R = s / 2;
    ctx.fillStyle = "#7FB6E0"; rr(ctx, -R * 1.05, -R * 0.12, R * 2.1, R * 0.3, R * 0.12); ctx.fill();
    ctx.fillStyle = "#8A5A33"; ctx.beginPath(); ctx.ellipse(0, 0, R * 0.9, R * 0.75, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#4A2E17"; ctx.lineWidth = Math.max(2, s * 0.035); ctx.lineCap = "round";
    [[-0.8, -0.1, -0.2, -0.7], [-0.5, -0.05, 0.3, -0.72], [0.1, -0.05, 0.8, -0.35], [-0.85, -0.35, 0.2, -0.55], [-0.2, -0.3, 0.75, -0.15], [-0.6, -0.5, 0.5, -0.62]].forEach(([a, b2, c, d]) => { ctx.beginPath(); ctx.moveTo(a * R, b2 * R); ctx.lineTo(c * R, d * R); ctx.stroke(); });
    ctx.fillStyle = "#3A2618"; ctx.beginPath(); ctx.ellipse(0, -R * 0.02, R * 0.2, R * 0.16, 0, Math.PI, 0); ctx.fill();
    ctx.restore();
  }

  // ---------- data tabel ----------
  const TREES = { Ek: "ek", Maple: "maple", Dedalu: "dedalu", Cemara: "cemara" };
  const WOOD = { Dedalu: "#EBDC9A", Ek: "#7B4F2C", Maple: "#F2E2C4", Cemara: "#C98B5A" };
  const TAB = {
    S: { owner: "Severin", scarf: "#2FA36B", cols: [["daun", "Daun", 170], ["pohon", "Pohon", 230]],
         rows: [{ daun: "ek", pohon: "Ek" }, { daun: "maple", pohon: "Maple" }, { daun: "dedalu", pohon: "Dedalu" }, { daun: "cemara", pohon: "Cemara" }] },
    Q: { owner: "Quirina", scarf: "#8B5CC4", cols: [["buah", "Buah", 160], ["pohon", "Pohon", 230], ["konifer", "Konifer?", 170]],
         rows: [{ buah: "biji", pohon: "Ek", konifer: false }, { buah: "runjung", pohon: "Cemara", konifer: true }, { buah: "sayap", pohon: "Maple", konifer: false }] },
    L: { owner: "Ladina", scarf: "#2F7FD0", cols: [["pohon", "Pohon", 230], ["warna", "Warna kayu", 180], ["pondok", "Pondok?", 160]],
         rows: [{ pohon: "Dedalu", pondok: true }, { pohon: "Ek", pondok: false }, { pohon: "Maple", pondok: true }, { pohon: "Cemara", pondok: false }] }
  };
  const EMIL = "#EE7A12", TH = 58, HH = 92, RH = 78;
  // pemeriksaan jawaban: dari bentuk daun ke kolom pondok, urutan tanya yang benar = Severin lalu Ladina
  (function () {
    const tabs = { Severin: TAB.S, Quirina: TAB.Q, Ladina: TAB.L };
    const ok = seq => { let known = new Set(["daun"]); for (const n of seq) { const t = tabs[n], ks = t.cols.map(c => c[0]); if (!ks.some(k => known.has(k))) return false; ks.forEach(k => known.add(k)); } return known.has("pondok"); };
    const res = [["Severin", "Ladina"], ["Ladina"], ["Quirina", "Severin", "Ladina"], ["Severin", "Quirina"]].map(ok);
    if (res.join() !== "true,false,false,false") (K._warn = K._warn || []).push("jawaban salah: " + res.join());
    const leafRow = TAB.S.rows.find(r => r.daun === "maple"), lr = TAB.L.rows.find(r => r.pohon === leafRow.pohon);
    if (!lr || !lr.pondok) (K._warn = K._warn || []).push("maple harus bagus untuk pondok");
  })();
  const tabW = T => T.cols.reduce((s, c) => s + c[2], 0);
  const tabH = T => TH + HH + T.rows.length * RH;
  function headIcon(ctx, key, x, y, s) {
    if (key === "daun") leaf(ctx, "maple", x, y, s * 0.9);
    else if (key === "pohon") tree(ctx, "ek", x, y + s * 0.5, s * 0.95);
    else if (key === "buah") fruit(ctx, "biji", x, y, s * 0.8);
    else if (key === "konifer") fruit(ctx, "runjung", x, y, s * 0.85);
    else if (key === "warna") swatch(ctx, "#D9B07A", x, y, s * 1.1, s * 0.62);
    else if (key === "pondok") lodge(ctx, x, y + s * 0.3, s * 1.1);
  }
  function cell(ctx, key, row, x, y) {
    const v = row[key];
    if (key === "daun") leaf(ctx, v, x, y, 58);
    else if (key === "buah") fruit(ctx, v, x, y, 54);
    else if (key === "pohon") { tree(ctx, TREES[v], x - 70, y + 22, 46); text(ctx, v, x - 40, y + 13, 34, { weight: 800, color: INK }); }
    else if (key === "warna") swatch(ctx, WOOD[row.pohon], x, y, 84, 46);
    else if (key === "konifer" || key === "pondok") v ? tick(ctx, x, y, 46, 1, GREEN) : cross(ctx, x, y, 40, 1, RED);
  }
  // o: {a, hiRow, rowColor, hiCol:{key:color}, ringCol:{key:[u,color]}, ringCell:[r,key,u,color], dimRows}
  function drawTable(ctx, T, x, y, sc, o = {}) {
    const W = tabW(T), Hh = tabH(T);
    alpha(ctx, o.a == null ? 1 : o.a, () => {
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
      card(ctx, 0, 0, W, Hh, { fill: "#FFF6E6", stroke: "#8C7A62", lw: 3, r: 14 });
      ctx.fillStyle = "#EADBC1"; rr(ctx, 0, 0, W, TH, 14); ctx.fill(); ctx.fillRect(0, TH - 14, W, 14);
      beaver(ctx, 34, TH / 2 + 6, 40, { scarf: T.scarf });
      text(ctx, "Tabel " + T.owner, 66, TH / 2 + 12, 32, { weight: 900, color: INK });
      let cx = 0;
      T.cols.forEach(([k, lab, w]) => {
        if (o.hiCol && o.hiCol[k]) { ctx.save(); ctx.globalAlpha *= o.hiCol[k][1]; ctx.fillStyle = o.hiCol[k][0]; ctx.fillRect(cx + 3, TH, w - 6, Hh - TH - 3); ctx.restore(); }
        cx += w;
      });
      if (o.hiRow != null && o.hiRow >= 0) { ctx.save(); ctx.globalAlpha *= o.rowA == null ? 1 : o.rowA; ctx.fillStyle = o.rowColor || "rgba(238,122,18,0.22)"; ctx.fillRect(3, TH + HH + o.hiRow * RH + 2, W - 6, RH - 4); ctx.restore(); }
      ctx.strokeStyle = "#B9A889"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, TH + HH); ctx.lineTo(W, TH + HH); for (let i = 1; i < T.rows.length; i++) { ctx.moveTo(8, TH + HH + i * RH); ctx.lineTo(W - 8, TH + HH + i * RH); } ctx.stroke();
      cx = 0; ctx.beginPath(); T.cols.forEach(([k, lab, w], j) => { if (j) { ctx.moveTo(cx, TH + 6); ctx.lineTo(cx, Hh - 6); } cx += w; }); ctx.lineWidth = 3; ctx.strokeStyle = "#8C7A62"; ctx.stroke();
      cx = 0;
      T.cols.forEach(([k, lab, w]) => {
        headIcon(ctx, k, cx + w / 2, TH + 34, 46);
        text(ctx, lab, cx + w / 2, TH + HH - 10, 24, { align: "center", weight: 800, color: C.ink2 });
        T.rows.forEach((r, i) => { const dim = o.dimRows && o.hiRow != null && i !== o.hiRow ? 0.35 : 1; alpha(ctx, dim, () => cell(ctx, k, r, cx + w / 2, TH + HH + i * RH + RH / 2)); });
        cx += w;
      });
      ctx.restore();
      if (o.ringCol) Object.entries(o.ringCol).forEach(([k, [u, col]]) => { const g = colGeom(T, x, y, sc, k); ring(ctx, g.cx, g.cy, g.w * 0.62, g.h * 0.56, u, col, 6); });
      if (o.ringCell) { const [ri, k, u, col] = o.ringCell, g = cellGeom(T, x, y, sc, ri, k); ring(ctx, g.cx, g.cy, g.w * 0.55, g.h * 0.62, u, col, 5); }
    });
  }
  function colGeom(T, x, y, sc, key) { let cx = 0; for (const [k, , w] of T.cols) { if (k === key) return { cx: x + (cx + w / 2) * sc, cy: y + (TH + (tabH(T) - TH) / 2) * sc, w: w * sc, h: (tabH(T) - TH) * sc, top: y + TH * sc, bot: y + tabH(T) * sc }; cx += w; } return null; }
  function cellGeom(T, x, y, sc, ri, key) { const g = colGeom(T, x, y, sc, key); return { cx: g.cx, cy: y + (TH + HH + ri * RH + RH / 2) * sc, w: g.w, h: RH * sc }; }
  function chip(ctx, s, x, y, size, o = {}) {   // label nama pohon yang dibawa
    const w = tw(ctx, s, size, 900) + size * 1.9, h = size * 1.5;
    alpha(ctx, o.a == null ? 1 : o.a, () => {
      card(ctx, x - w / 2, y - h / 2, w, h, { fill: o.fill || "#EAF1FD", stroke: o.stroke || BLUE, lw: 3, r: 12 });
      tree(ctx, TREES[s] || "ek", x - w / 2 + size * 0.8, y + size * 0.55, size * 1.1);
      text(ctx, s, x + size * 0.45, y + size * 0.36, size, { align: "center", weight: 900, color: o.color || INK });
    });
  }
  function bubble(ctx, x, y, w, h, tailX, tailY) {
    ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#7A858E"; ctx.lineWidth = 3;
    rr(ctx, x, y, w, h, 22); ctx.fill(); ctx.stroke();
    const bx = clamp(tailX, x + 30, x + w - 30), by = y + h;
    ctx.beginPath(); ctx.moveTo(bx - 16, by - 2); ctx.lineTo(tailX, tailY); ctx.lineTo(bx + 16, by - 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(bx - 14, by - 5, 28, 6); ctx.restore();
  }
  function friend(ctx, T, x, y, s, o = {}) { beaver(ctx, x, y, s, { scarf: T ? T.scarf : EMIL, alpha: o.a }); alpha(ctx, o.a == null ? 1 : o.a, () => text(ctx, T ? T.owner : "Emil", x, y + s * 0.78, Math.max(22, s * 0.26), { align: "center", weight: 900, color: T ? T.scarf : EMIL })); }

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
    const fu = P(l, at(b, "Swiss"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagCH(ctx, 480, 220, 130); ctx.restore(); }
    const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
    text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
    rows.forEach(([k, v, ph], i) => {
      const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
      text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
      ctx.restore();
    });
    const au = P(l, at(b, "Swiss"), 0.8);
    if (au > 0) ring(ctx, 1170, 300 + 2 * 92 - 14, 200, 44, au);
  }

  // ---------- 0. soal ----------
  const SC0 = 0.86, TX = { S: 390, Q: 390 + 400 * SC0 + 50, L: 390 + 960 * SC0 + 100 }, TY = 160;
  function mountains(ctx, a) {
    alpha(ctx, a, () => {
      ctx.fillStyle = "#DCE6EC"; ctx.beginPath(); ctx.moveTo(60, 820); ctx.lineTo(420, 330); ctx.lineTo(700, 640); ctx.lineTo(980, 260); ctx.lineTo(1400, 760); ctx.lineTo(1600, 480); ctx.lineTo(1860, 820); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; [[420, 330, 70], [980, 260, 80], [1600, 480, 55]].forEach(([x, y, w]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - w * 0.7, y + w); ctx.lineTo(x + w * 0.7, y + w); ctx.closePath(); ctx.fill(); });
      [["ek", 260, 790, 150], ["cemara", 520, 800, 170], ["maple", 1180, 800, 150], ["dedalu", 1500, 790, 160], ["cemara", 1720, 800, 140]].forEach(([k, x, y, s]) => tree(ctx, k, x, y, s));
    });
  }
  function cerita(ctx, b, l) {
    board(ctx);
    const id = b.id, ord = ["soal1", "soal2", "soal3", "soal4", "soal5", "soal6"], pg = prog(ord, b);
    if (id === "soal1") {
      mountains(ctx, P(l, 0.2, 0.8));
      const ws = P(l, at(b, "Emil dan"), 2.5);
      [[null, 620], [TAB.S, 820], [TAB.Q, 1020], [TAB.L, 1220]].forEach(([T, x], i) => friend(ctx, T, x - 500 * (1 - ws) + Math.sin(l * 6 + i) * 3, 520 + Math.abs(Math.sin(l * 6 + i)) * -8, 130, { a: ws }));
      hand(ctx, "mereka mencatat pohon di tabel", 960, 260, 48, { alpha: P(l, at(b, "mencatat"), 0.6), color: INK });
      return;
    }
    const dim = pg("soal5", () => P(l, at(b, "Emil ingin"), 0.6) * 0.65) || pg("soal6") ? 0.65 : 0;
    const dimV = id === "soal5" ? P(l, at(b, "Emil ingin"), 0.6) * 0.65 : (id === "soal6" ? 1 : 0);
    [["S", "soal2"], ["Q", "soal3"], ["L", "soal4"]].forEach(([k, bid]) => {
      const a = pg(bid, () => P(l, 0.3, 0.6)); if (a <= 0) return;
      const o = { a: a * (1 - dimV) };
      if (id === "soal3" && k === "Q") o.ringCol = { konifer: [P(l, at(b, "termasuk pohon konifer"), 0.6), ORANGE] };
      if (id === "soal4" && k === "L") o.ringCol = { pondok: [P(l, at(b, "apakah kayu"), 0.6), GREEN] };
      drawTable(ctx, TAB[k], TX[k], TY, SC0, o);
      if (id !== "soal6") friend(ctx, TAB[k], TX[k] + tabW(TAB[k]) * SC0 / 2, 690, 100, { a: a * (1 - dimV) });
    });
    // Emil di kiri
    const eu = id === "soal2" || id === "soal3" || id === "soal4" ? 1 : 1;
    friend(ctx, null, 200, 640, 150, { a: eu });
    if (id === "soal5" || id === "soal6") leaf(ctx, "maple", 290, 610, 90 * (id === "soal5" ? P(l, at(b, "sehelai daun"), 0.5) : 1), -0.2);
    if (id === "soal3") {
      const ku = P(l, at(b, "Pohon konifer adalah"), 0.6) * (1 - P(l, b.dur - 0.5, 0.4));
      alpha(ctx, ku, () => {
        card(ctx, 1290, 165, 550, 420, { fill: "#FFFFFF", stroke: ORANGE, lw: 4, r: 20 });
        text(ctx, "Pohon konifer", 1565, 225, 42, { align: "center", weight: 900, color: ORANGE });
        leaf(ctx, "cemara", 1390, 330, 110); text(ctx, "daun jarum", 1390, 415, 26, { align: "center", weight: 800, color: C.ink2 });
        fruit(ctx, "runjung", 1565, 325, 100); text(ctx, "buah runjung", 1565, 415, 26, { align: "center", weight: 800, color: C.ink2 });
        tree(ctx, "cemara", 1740, 395, 140); text(ctx, "cemara", 1740, 415, 26, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, "contoh: pohon cemara", 1565, 520, 36, { align: "center", weight: 900, color: INK });
      });
    }
    if (id === "soal4") { const lu = P(l, at(b, "pondok berang-berang"), 0.6); alpha(ctx, lu, () => { lodge(ctx, 1640, 800, 120 + 10 * Math.sin(l * 3)); }); }
    if (id === "soal5") {
      const u = P(l, at(b, "Emil ingin"), 0.6);
      alpha(ctx, u, () => {
        bubble(ctx, 560, 230, 1080, 330, 330, 560);
        leaf(ctx, "maple", 700, 380, 150);
        text(ctx, "bentuk daun", 700, 515, 30, { align: "center", weight: 800, color: C.ink2 });
        mline(ctx, [[820, 380], [1020, 380]], P(l, at(b, "apakah kayu"), 0.6), INK, 6, true);
        text(ctx, "?", 1100, 410, 96, { align: "center", weight: 900, color: ORANGE });
        mline(ctx, [[1180, 380], [1340, 380]], P(l, at(b, "apakah kayu") + 0.4, 0.6), INK, 6, true);
        lodge(ctx, 1480, 440, 170); text(ctx, "bagus untuk pondok?", 1480, 515, 30, { align: "center", weight: 800, color: C.ink2 });
      });
    }
    if (id === "soal6") {
      text(ctx, "Teman mana yang harus Emil tanyai, dan dalam urutan apa?", 1100, 230, 44, { align: "center", weight: 900, color: INK, fit: 1400 });
      ["S", "Q", "L"].forEach((k, i) => { const x = TX[k] + tabW(TAB[k]) * SC0 / 2, a = P(l, at(b, "Teman mana") + i * 0.4, 0.4); friend(ctx, TAB[k], x, 520, 150, { a }); alpha(ctx, a * (0.6 + 0.4 * Math.sin(l * 4 + i)), () => text(ctx, "?", x + 80, 430, 80, { align: "center", weight: 900, color: ORANGE })); });
      bubble(ctx, 120, 330, 260, 150, 220, 560); leaf(ctx, "maple", 250, 405, 100);
    }
  }
  // kartu pilihan
  const OPTS = [["A", ["S", "L"]], ["B", ["L"]], ["C", ["Q", "S", "L"]], ["D", ["S", "Q"]]];
  function optCard(ctx, i, x, y, w, h, o = {}) {
    const [L, seq] = OPTS[i];
    alpha(ctx, o.a == null ? 1 : o.a, () => {
      card(ctx, x, y, w, h, { fill: o.fill || "#F7F9FA", stroke: o.stroke || "#B8C3CA", lw: o.lw || 3, r: 18 });
      ctx.fillStyle = o.letterCol || C.kiko; ctx.beginPath(); ctx.arc(x + 52, y + h / 2, 34, 0, Math.PI * 2); ctx.fill();
      text(ctx, L, x + 52, y + h / 2 + 15, 42, { align: "center", weight: 900, color: "#fff" });
      const n = seq.length, step = Math.min(200, (w - 140) / n), hs = h * 0.5;
      seq.forEach((k, j) => {
        const cx = x + 140 + step * j + step / 2 - 20;
        beaver(ctx, cx, y + h * 0.42, hs, { scarf: TAB[k].scarf });
        text(ctx, TAB[k].owner, cx, y + h - 14, Math.min(26, h * 0.2), { align: "center", weight: 900, color: TAB[k].scarf });
        if (j < n - 1) mline(ctx, [[cx + hs * 0.42, y + h * 0.42], [cx + step - hs * 0.42, y + h * 0.42]], 1, INK, 4, true);
      });
      if (o.mark === "x") cross(ctx, x + w - 50, y + h / 2, 56, o.mu == null ? 1 : o.mu, RED);
      if (o.mark === "v") tick(ctx, x + w - 50, y + h / 2, 62, o.mu == null ? 1 : o.mu, GREEN);
      if (o.ring) ring(ctx, x + w / 2, y + h / 2, w * 0.56, h * 0.7, o.ring, GREEN, 6);
    });
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    text(ctx, "Teman mana yang harus ditanya, dan dalam urutan apa?", 960, 205, 40, { align: "center", weight: 900, color: INK });
    const T = ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"].map(s => at(b, s));
    OPTS.forEach((_, i) => optCard(ctx, i, 140 + (i % 2) * 840, 260 + Math.floor(i / 2) * 270, 800, 230, { a: P(l, T[i], 0.5) }));
  }

  // ---------- 1. membaca tabel ----------
  function baca(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "t1" || id === "t2") {
      const T = TAB.S, x = 220, y = 165, sc = 1.25;
      const o = {};
      if (id === "t1") {
        const rU = P(l, at(b, "Setiap baris"), 0.4) * (1 - P(l, at(b, "Setiap kolom"), 0.4));
        if (rU > 0) { o.hiRow = 1; o.rowA = rU; }
        const cU = P(l, at(b, "Setiap kolom"), 0.4); if (cU > 0) o.hiCol = { daun: ["rgba(47,111,208,0.2)", cU] };
        if (cU > 0) o.hiCol.pohon = ["rgba(47,111,208,0.2)", P(l, at(b, "nama pohon"), 0.4)];
      } else { o.hiRow = 0; o.rowA = P(l, at(b, "baris pertama"), 0.4); }
      drawTable(ctx, T, x, y, sc, o);
      if (id === "t1") {
        hand(ctx, "baris = satu jenis pohon", 1000, 330, 50, { align: "left", color: ORANGE, alpha: P(l, at(b, "Setiap baris"), 0.5) });
        hand(ctx, "kolom = satu macam informasi", 1000, 480, 50, { align: "left", color: BLUE, alpha: P(l, at(b, "Setiap kolom"), 0.5) });
        alpha(ctx, P(l, at(b, "misalnya"), 0.5), () => { leaf(ctx, "ek", 1060, 620, 80); text(ctx, "bentuk daun", 1110, 635, 34, { weight: 800, color: INK }); tree(ctx, "ek", 1440, 660, 70); text(ctx, "nama pohon", 1490, 635, 34, { weight: 800, color: INK }); });
      } else {
        const g1 = cellGeom(T, x, y, sc, 0, "daun"), g2 = cellGeom(T, x, y, sc, 0, "pohon");
        ring(ctx, g1.cx, g1.cy, 70, 52, P(l, at(b, "berlekuk"), 0.6), ORANGE, 5);
        mline(ctx, [[g1.cx + 60, g1.cy - 40], [g2.cx - 40, g2.cy - 40]], P(l, at(b, "Di sebelahnya"), 0.6), ORANGE, 5, true);
        ring(ctx, g2.cx, g2.cy, 120, 52, P(l, at(b, "pohon ek"), 0.6), ORANGE, 5);
        alpha(ctx, P(l, at(b, "Artinya"), 0.6), () => {
          card(ctx, 1000, 330, 800, 260, { fill: "#FFF8E8", stroke: ORANGE, lw: 3, r: 20 });
          leaf(ctx, "ek", 1110, 460, 130); mline(ctx, [[1210, 460], [1400, 460]], 1, INK, 6, true); tree(ctx, "ek", 1500, 530, 150);
          text(ctx, "pohon ek", 1650, 480, 44, { weight: 900, color: INK });
        });
      }
      return;
    }
    // t3, t4: tabel Quirina
    const T = TAB.Q, x = 760, y = 175, sc = 1.2;
    friend(ctx, T, 360, 600, 190);
    const o = {};
    if (id === "t3") {
      const t0 = at(b, "Kalau kita"), t1 = at(b, "mencari barisnya"), t2 = at(b, "Lalu, ia");
      const fly = P(l, t0, 1.0), sx = 360, sy = 400, g = cellGeom(T, x, y, sc, 1, "buah");
      if (fly < 1) fruit(ctx, "runjung", lerp(560, sx + 140, fly), lerp(300, sy + 40, fly), 80);
      else fruit(ctx, "runjung", sx + 140, sy + 40, 80);
      const scan = clamp((l - t1) / 1.2, 0, 1) * 1;
      if (l > t1) { o.hiRow = Math.min(1, Math.floor(scan * 2)); o.rowA = 1; }
      if (l > t2) { o.hiRow = 1; o.ringCell = [1, "buah", P(l, t1 + 1.2, 0.5), ORANGE]; o.dimRows = true; }
      drawTable(ctx, T, x, y, sc, o);
      if (l > t2) {
        const g2 = cellGeom(T, x, y, sc, 1, "pohon"), g3 = cellGeom(T, x, y, sc, 1, "konifer");
        ring(ctx, g2.cx, g2.cy, 120, 50, P(l, t2, 0.5), BLUE, 5); ring(ctx, g3.cx, g3.cy, 80, 50, P(l, t2 + 0.5, 0.5), BLUE, 5);
        alpha(ctx, P(l, t2 + 0.8, 0.5), () => { bubble(ctx, 130, 210, 470, 150, 380, 470); text(ctx, "Cemara, konifer!", 365, 300, 44, { align: "center", weight: 900, color: BLUE }); });
      }
    } else {
      const t0 = at(b, "bentuk daun"), t1 = at(b, "ia tidak bisa");
      const fly = P(l, t0 - 0.6, 1.0);
      leaf(ctx, "maple", lerp(600, 500, fly), lerp(300, 440, fly), 100, -0.2);
      o.hiCol = { buah: ["rgba(217,68,59,0.12)", P(l, at(b, "Tabelnya"), 0.4)], pohon: ["rgba(217,68,59,0.12)", P(l, at(b, "Tabelnya"), 0.4)], konifer: ["rgba(217,68,59,0.12)", P(l, at(b, "Tabelnya"), 0.4)] };
      drawTable(ctx, T, x, y, sc, o);
      alpha(ctx, P(l, t1, 0.5), () => { bubble(ctx, 130, 190, 470, 150, 380, 460); text(ctx, "?", 365, 300, 90, { align: "center", weight: 900, color: RED }); });
      cross(ctx, 500, 440, 110, P(l, t1 + 0.3, 0.5), RED);
      hand(ctx, "tidak ada kolom \"Daun\"", 1150, 810, 48, { color: RED, alpha: P(l, at(b, "Tabelnya"), 0.6) });
    }
  }

  // ---------- 2. mencari jembatan antartabel ----------
  const SC2 = 0.8, J = { S: 300, Q: 300 + 400 * SC2 + 90, L: 300 + 960 * SC2 + 180 }, JY = 330;
  function knownBox(ctx, a1, a2, aq) {
    alpha(ctx, a1, () => { card(ctx, 260, 148, 560, 122, { fill: "#FFF8E8", stroke: ORANGE, lw: 3, r: 18 }); text(ctx, "Diketahui", 300, 190, 28, { weight: 900, color: ORANGE }); leaf(ctx, "maple", 360, 232, 60); text(ctx, "bentuk daun", 410, 248, 40, { weight: 900, color: INK }); });
    alpha(ctx, aq, () => { text(ctx, "?", 960, 240, 70, { align: "center", weight: 900, color: INK }); mline(ctx, [[840, 212], [920, 212]], 1, INK, 5); mline(ctx, [[1000, 212], [1080, 212]], 1, INK, 5, true); });
    alpha(ctx, a2, () => { card(ctx, 1100, 148, 640, 122, { fill: "#EAF7EF", stroke: GREEN, lw: 3, r: 18 }); text(ctx, "Dicari", 1140, 190, 28, { weight: 900, color: GREEN }); lodge(ctx, 1200, 258, 80); text(ctx, "bagus untuk pondok?", 1260, 248, 40, { weight: 900, color: INK }); });
  }
  function jembatan(ctx, b, l) {
    board(ctx);
    const id = b.id, ord = ["m1", "m2", "m3", "m4", "m5", "m6"], pg = prog(ord, b);
    knownBox(ctx, pg("m1", () => P(l, at(b, "Emil hanya"), 0.5)), pg("m1", () => P(l, at(b, "Ia ingin"), 0.5)), pg("m1", () => P(l, at(b, "Ia ingin") + 0.6, 0.5)));
    const oS = {}, oQ = {}, oL = {};
    const mS = pg("m3", () => P(l, at(b, "hanya ada di tabel Severin"), 0.6)), mL = pg("m4", () => P(l, at(b, "hanya ada di tabel Ladina"), 0.6));
    if (mS > 0) oS.ringCol = { daun: [mS, ORANGE] };
    if (mL > 0) oL.ringCol = { pondok: [mL, GREEN] };
    const br = pg("m6", () => P(l, at(b, "keduanya punya"), 0.6));
    if (br > 0) { oS.hiCol = { pohon: ["rgba(47,111,208,0.22)", br] }; oL.hiCol = { pohon: ["rgba(47,111,208,0.22)", br] }; }
    if (id === "m6") oQ.a = 1 - 0.55 * br; else if (id === "m5") oQ.a = 0.45; 
    drawTable(ctx, TAB.S, J.S, JY, SC2, oS); drawTable(ctx, TAB.Q, J.Q, JY, SC2, oQ); drawTable(ctx, TAB.L, J.L, JY, SC2, oL);
    const gS = colGeom(TAB.S, J.S, JY, SC2, "daun"), gL = colGeom(TAB.L, J.L, JY, SC2, "pondok");
    if (mS > 0) { tagChipTxt(ctx, "MULAI", gS.cx, JY - 30, ORANGE, mS); }
    if (mL > 0) { tagChipTxt(ctx, "AKHIR", gL.cx, JY - 30, GREEN, mL); }
    if (id === "m2") thinkBadge(ctx, 560, 715, 800, 108, l, b.dur, "Kolom daun di tabel siapa? Kolom pondok di tabel siapa?");
    if (id === "m5") {
      const u = P(l, at(b, "membawa daunnya"), 0.8), y0 = JY + tabH(TAB.S) * SC2 + 20;
      const pts = [[gS.cx, y0], [gS.cx + 60, y0 + 40], [J.L + 40, y0 + 40], [J.L + 80, y0 + 2]];
      mline(ctx, pts, u, RED, 6, true);
      cross(ctx, (gS.cx + J.L) / 2 + 60, y0 + 40, 60, P(l, at(b, "karena tabel Ladina"), 0.5), RED);
      hand(ctx, "tabel Ladina tidak punya kolom daun", (gS.cx + J.L) / 2 + 60, y0 + 100, 36, { color: RED, alpha: P(l, at(b, "karena tabel Ladina"), 0.5) });
    }
    if (br > 0) {
      const a = colGeom(TAB.S, J.S, JY, SC2, "pohon"), c = colGeom(TAB.L, J.L, JY, SC2, "pohon");
      const y0 = a.bot + 14, pts = []; for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push([lerp(a.cx, c.cx, t), y0 + Math.sin(t * Math.PI) * 45]); }
      mline(ctx, pts, br, BLUE, 8);
      ring(ctx, a.cx, a.cy, a.w * 0.6, a.h * 0.56, br, BLUE, 5); ring(ctx, c.cx, c.cy, c.w * 0.6, c.h * 0.56, br, BLUE, 5);
      hand(ctx, "jembatan: kolom Pohon", (a.cx + c.cx) / 2, y0 + 100, 44, { color: BLUE, alpha: pg("m6", () => P(l, at(b, "Kolom inilah"), 0.6)) });
    }
  }
  function tagChipTxt(ctx, s, x, y, col, a) {
    alpha(ctx, a, () => { const w = tw(ctx, s, 28, 900) + 30; card(ctx, x - w / 2, y - 24, w, 44, { fill: col, r: 10 }); text(ctx, s, x, y + 9, 28, { align: "center", weight: 900, color: "#fff" }); });
  }

  // ---------- 2b. menelusuri: Severin lalu Ladina ----------
  const SC3 = 1.0, TS = { x: 100, y: 190 }, TL3 = { x: 1240, y: 190 };
  function telusur(ctx, b, l) {
    board(ctx);
    const id = b.id, oS = {}, oL = {};
    const sMaple = 1, lMaple = 2;
    let chipPos = null, chipA = 0;
    if (id === "m7") {
      const t0 = at(b, "Severin mencari"), t1 = at(b, "lalu berkata");
      leaf(ctx, "maple", 900, 290, 150 * P(l, 0.2, 0.6), -0.15);
      hand(ctx, "seperti telapak tangan, lima jari", 900, 430, 34, { alpha: P(l, at(b, "telapak tangan"), 0.5) });
      if (l > t0) { const s = clamp((l - t0) / Math.max(0.6, t1 - t0 - 0.3), 0, 1); oS.hiRow = l > t1 ? sMaple : Math.min(sMaple, Math.floor(s * 2)); oS.rowA = 1; }
      if (l > t1) { oS.dimRows = true; oS.ringCell = [sMaple, "pohon", P(l, t1, 0.5), BLUE]; }
      const g = cellGeom(TAB.S, TS.x, TS.y, SC3, sMaple, "pohon");
      const cu = P(l, at(b, "pohon maple"), 0.9);
      if (cu > 0) { chipPos = [lerp(g.cx, 900, cu), lerp(g.cy, 520, cu)]; chipA = 1; }
      friend(ctx, null, 900, 640, 100);
    } else if (id === "m8") {
      const t0 = at(b, "Ladina mencari"), t1 = at(b, "Di baris itu"), t2 = at(b, "tanda centang");
      oS.hiRow = sMaple; oS.dimRows = true; oS.rowA = 0.6;
      const cu = P(l, 0.3, 1.0), g = cellGeom(TAB.L, TL3.x, TL3.y, SC3, lMaple, "pohon");
      chipPos = [lerp(900, 1000, cu), lerp(520, 330, cu)]; chipA = 1;
      if (l > t0) { const s = clamp((l - t0) / Math.max(0.6, t1 - t0 - 0.2), 0, 1); oL.hiRow = l > t1 ? lMaple : Math.min(lMaple, Math.floor(s * 3)); oL.rowA = 1; }
      if (l > t1) { oL.dimRows = true; oL.ringCell = [lMaple, "pohon", P(l, t1, 0.4), BLUE]; }
      if (l > t2) { const gc = cellGeom(TAB.L, TL3.x, TL3.y, SC3, lMaple, "pondok"); }
    } else {
      oS.hiRow = sMaple; oS.dimRows = true; oL.hiRow = lMaple; oL.dimRows = true;
    }
    drawTable(ctx, TAB.S, TS.x, TS.y, SC3, oS); drawTable(ctx, TAB.L, TL3.x, TL3.y, SC3, oL);
    if (id === "m8") {
      const t2 = at(b, "tanda centang"), gc = cellGeom(TAB.L, TL3.x, TL3.y, SC3, lMaple, "pondok");
      ring(ctx, gc.cx, gc.cy, 70, 52, P(l, t2, 0.6), GREEN, 6);
      alpha(ctx, P(l, at(b, "Jadi, kayu"), 0.6), () => { card(ctx, 600, 560, 620, 130, { fill: "#EAF7EF", stroke: GREEN, lw: 3, r: 18 }); lodge(ctx, 655, 665, 80); tick(ctx, 1170, 625, 50); text(ctx, "Kayu maple bagus untuk pondok", 920, 638, 34, { align: "center", weight: 900, color: GREEN, fit: 420 }); });
    }
    if (chipPos) chip(ctx, "Maple", chipPos[0], chipPos[1], 38, { a: chipA });
    if (id === "m9") {
      const gS = cellGeom(TAB.S, TS.x, TS.y, SC3, sMaple, "pohon"), gL = cellGeom(TAB.L, TL3.x, TL3.y, SC3, lMaple, "pohon");
      mline(ctx, [[gS.cx + 110, gS.cy], [gL.cx - 110, gL.cy]], 1, BLUE, 6, true);
      chip(ctx, "Maple", 960, gS.cy - 50, 34);
      const u1 = P(l, at(b, "Pertama"), 0.5), u2 = P(l, at(b, "kemudian kepada"), 0.5);
      friend(ctx, TAB.S, 700, 650, 110, { a: u1 });
      alpha(ctx, u2, () => mline(ctx, [[790, 640], [1120, 640]], 1, INK, 6, true));
      friend(ctx, TAB.L, 1220, 650, 110, { a: u2 });
      alpha(ctx, P(l, at(b, "pilihan A"), 0.5), () => { text(ctx, "Pilihan A", 960, 800, 52, { align: "center", weight: 900, color: GREEN }); });
      ring(ctx, 960, 782, 170, 46, P(l, at(b, "pilihan A") + 0.3, 0.6), GREEN, 5);
    }
  }

  // ---------- 3. memeriksa pilihan lain ----------
  function periksa(ctx, b, l) {
    board(ctx);
    const id = b.id, ord = ["x1", "x2", "x3", "x4", "j1"], pg = prog(ord, b);
    const xB = pg("x1", () => P(l, at(b, "Ladina tidak bisa"), 0.5)), xC = pg("x2", () => P(l, at(b, "pilihan C juga salah"), 0.5)), xD = pg("x3", () => P(l, at(b, "tidak punya kolom pondok"), 0.5));
    const cur = { x1: 1, x2: 2, x3: 3, j1: 0 }[id];
    [0, 1, 2, 3].forEach(i => {
      const o = { mark: i === 1 ? (xB > 0 ? "x" : null) : i === 2 ? (xC > 0 ? "x" : null) : i === 3 ? (xD > 0 ? "x" : null) : null, mu: [0, xB, xC, xD][i] };
      if (cur === i) { o.stroke = ORANGE; o.lw = 5; o.fill = "#FFF8E8"; }
      if (i === 0 && id === "j1") { o.mark = "v"; o.mu = P(l, at(b, "pilihan A"), 0.5); o.ring = P(l, at(b, "pilihan A") + 0.3, 0.6); o.stroke = GREEN; o.lw = 5; o.fill = "#EAF7EF"; }
      optCard(ctx, i, 90, 160 + i * 165, 700, 150, o);
    });
    const RX = 860;
    if (id === "x1") {
      drawTable(ctx, TAB.L, 1240, 200, 0.95);
      friend(ctx, null, 960, 470, 130);
      const fu = P(l, at(b, "Tetapi, Emil"), 0.8);
      leaf(ctx, "maple", lerp(1040, 1180, fu), lerp(440, 420, fu), 80, -0.2);
      alpha(ctx, P(l, at(b, "belum tahu nama"), 0.5), () => { text(ctx, "nama pohon?", 1060, 650, 36, { align: "center", weight: 900, color: RED }); });
      alpha(ctx, P(l, at(b, "warna kayunya"), 0.5), () => { text(ctx, "warna kayu?", 1060, 710, 36, { align: "center", weight: 900, color: RED }); });
      cross(ctx, 1200, 420, 90, P(l, at(b, "Ladina tidak bisa"), 0.5), RED);
      hand(ctx, "Ladina tidak bisa mencari barisnya", 1400, 800, 38, { color: RED, alpha: P(l, at(b, "Ladina tidak bisa"), 0.5) });
    }
    if (id === "x2") {
      drawTable(ctx, TAB.Q, 1270, 220, 0.95);
      friend(ctx, null, 980, 470, 130);
      const fu = P(l, at(b, "Emil tidak membawa"), 0.8);
      leaf(ctx, "maple", lerp(1060, 1190, fu), lerp(440, 420, fu), 80, -0.2);
      alpha(ctx, P(l, at(b, "tabel Quirina memakai buah"), 0.5), () => { const g = colGeom(TAB.Q, 1270, 220, 0.95, "buah"); ring(ctx, g.cx, g.cy, g.w * 0.62, g.h * 0.56, 1, ORANGE, 5); });
      cross(ctx, 1210, 420, 90, P(l, at(b, "Quirina tidak bisa"), 0.5), RED);
      hand(ctx, "Emil tidak membawa buah", 1400, 800, 40, { color: RED, alpha: P(l, at(b, "Emil tidak membawa"), 0.5) });
    }
    if (id === "x3") {
      const u1 = P(l, at(b, "sudah benar"), 0.5);
      drawTable(ctx, TAB.S, 880, 200, 0.7, { hiRow: 1, dimRows: true, rowA: u1 });
      tick(ctx, 1040, 560, 60, u1);
      const u2 = P(l, at(b, "bertanya kepada Quirina"), 0.8);
      chip(ctx, "Maple", lerp(1050, 1260, u2), lerp(620, 640, u2), 30, { a: u2 });
      drawTable(ctx, TAB.Q, 1300, 200, 0.85, { a: Math.max(0.15, u2), hiRow: u2 > 0.9 ? 2 : null, dimRows: u2 > 0.9 });
      const g = colGeom(TAB.Q, 1300, 200, 0.85, "konifer");
      ring(ctx, g.cx, g.cy, g.w * 0.62, g.h * 0.56, P(l, at(b, "apakah pohon itu konifer"), 0.6), ORANGE, 5);
      alpha(ctx, P(l, at(b, "tidak punya kolom pondok"), 0.5), () => { lodge(ctx, 1600, 740, 90); cross(ctx, 1600, 700, 80, 1, RED); text(ctx, "tidak ada kolom pondok", 1450, 810, 34, { align: "center", weight: 900, color: RED }); });
    }
    if (id === "x4") {
      alpha(ctx, P(l, at(b, "Konifer atau"), 0.6), () => {
        fruit(ctx, "runjung", 1000, 330, 120); text(ctx, "konifer", 1000, 440, 34, { align: "center", weight: 900, color: INK });
        text(ctx, "≠", 1250, 360, 120, { align: "center", weight: 900, color: RED });
        lodge(ctx, 1520, 380, 150); text(ctx, "bagus untuk pondok", 1520, 440, 34, { align: "center", weight: 900, color: INK });
      });
      hand(ctx, "dua informasi yang berbeda", 1260, 560, 46, { color: RED, alpha: P(l, at(b, "tidak sama dengan"), 0.6) });
      hand(ctx, "pakai hanya yang tertulis di tabel", 1260, 690, 46, { color: BLUE, alpha: P(l, at(b, "Kita hanya boleh"), 0.6) });
    }
    if (id === "j1") {
      alpha(ctx, P(l, at(b, "jawaban yang benar"), 0.5), () => {
        text(ctx, "Jawaban: A", 1320, 330, 90, { align: "center", weight: 900, color: GREEN });
        friend(ctx, TAB.S, 1120, 520, 140); mline(ctx, [[1210, 510], [1420, 510]], 1, INK, 7, true); friend(ctx, TAB.L, 1520, 520, 140);
        hand(ctx, "pertama Severin, kemudian Ladina", 1320, 760, 44, { color: GREEN });
      });
    }
  }

  // ---------- 4. penutup ----------
  function dbIcon(ctx, x, y, s, col = BLUE) {
    ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = "#fff"; ctx.lineWidth = s * 0.04;
    for (let i = 2; i >= 0; i--) { const yy = y + i * s * 0.3; ctx.beginPath(); ctx.ellipse(x, yy + s * 0.18, s * 0.5, s * 0.16, 0, 0, Math.PI); ctx.lineTo(x - s * 0.5, yy); ctx.ellipse(x, yy, s * 0.5, s * 0.16, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(x, y, s * 0.5, s * 0.16, 0, 0, Math.PI * 2); ctx.fillStyle = "#7FA9E8"; ctx.fill(); ctx.restore();
  }
  function simpleTable(ctx, x, y, title, cols, rows, o = {}) {
    const cw = o.cw || 190, rh = 62, W = cw * cols.length, Hh = 56 + rh * (rows.length + 1);
    card(ctx, x, y, W, Hh, { fill: "#F7F9FA", stroke: "#8C99A3", lw: 3, r: 14 });
    ctx.fillStyle = "#DDE6EC"; rr(ctx, x, y, W, 56, 14); ctx.fill(); ctx.fillRect(x, y + 42, W, 14);
    text(ctx, title, x + 20, y + 40, 30, { weight: 900, color: INK });
    cols.forEach((c, j) => {
      if (o.hiCol === j) { ctx.save(); ctx.globalAlpha = o.hiA; ctx.fillStyle = "rgba(47,111,208,0.2)"; ctx.fillRect(x + j * cw + 3, y + 56, cw - 6, Hh - 59); ctx.restore(); }
      text(ctx, c, x + j * cw + cw / 2, y + 56 + 42, 28, { align: "center", weight: 900, color: C.ink2 });
      rows.forEach((r, i) => text(ctx, String(r[j]), x + j * cw + cw / 2, y + 56 + rh * (i + 1) + 42, 30, { align: "center", weight: 700, color: INK }));
    });
    ctx.strokeStyle = "#C9D2D8"; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 1; i <= rows.length; i++) { ctx.moveTo(x + 8, y + 56 + rh * i); ctx.lineTo(x + W - 8, y + 56 + rh * i); } ctx.stroke();
    return { W, rowY: i => y + 56 + rh * (i + 1) + rh / 2, colX: j => x + j * cw + cw / 2, cw };
  }
  function basisdata(ctx, b, l) {
    board(ctx);
    if (b.id === "p1") {
      const u = P(l, at(b, "basis data"), 0.6);
      [["S", 260], ["Q", 760], ["L", 1260]].forEach(([k, x]) => drawTable(ctx, TAB[k], x, 200, 0.62));
      const a = colGeom(TAB.S, 260, 200, 0.62, "pohon"), q = colGeom(TAB.Q, 760, 200, 0.62, "pohon"), c = colGeom(TAB.L, 1260, 200, 0.62, "pohon");
      const tu = P(l, at(b, "saling terhubung"), 0.8);
      [[a, q], [q, c]].forEach(([p1, p2]) => { const y0 = p1.bot + 10, pts = []; for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push([lerp(p1.cx, p2.cx, t), y0 + Math.sin(t * Math.PI) * 60]); } mline(ctx, pts, tu, BLUE, 6); });
      alpha(ctx, u, () => { dbIcon(ctx, 960, 610, 120); text(ctx, "basis data", 1060, 690, 50, { weight: 900, color: BLUE }); });
      hand(ctx, "terhubung lewat kolom yang sama", 960, 810, 40, { color: BLUE, alpha: P(l, at(b, "seperti kolom"), 0.6) });
      return;
    }
    const mu = P(l, at(b, "tabel data murid"), 0.5), nu = P(l, at(b, "tabel nilai"), 0.5), ku = P(l, at(b, "nomor induk"), 0.5), lu = P(l, at(b, "Dengan nomor itu"), 0.6);
    let A, Bt;
    alpha(ctx, mu, () => { A = simpleTable(ctx, 170, 200, "Data Murid", ["NIS", "Nama"], [[101, "Ani"], [102, "Budi"], [103, "Citra"]], { hiCol: 0, hiA: ku }); });
    alpha(ctx, nu, () => { Bt = simpleTable(ctx, 1010, 200, "Nilai", ["NIS", "Mapel", "Nilai"], [[102, "Informatika", 88], [103, "Informatika", 85], [101, "Informatika", 92]], { hiCol: 0, hiA: ku, cw: 240 }); });
    if (A && Bt && lu > 0) {
      [[0, 2], [1, 0], [2, 1]].forEach(([i, j], k) => mline(ctx, [[A.colX(0) + 50, A.rowY(i)], [Bt.colX(0) - 60, Bt.rowY(j)]], clamp(lu * 3 - k, 0, 1), BLUE, 4, true));
    }
    hand(ctx, "NIS = nomor induk siswa", 960, 760, 44, { color: BLUE, alpha: ku });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Tulis yang diketahui dan yang dicari.", "Cari tabel dengan kolom awal dan kolom tujuan.", "Hubungkan lewat kolom yang sama."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 46, { weight: 900, color: INK, fit: 1140 });
        const ix = 1610, iy = y + 80;
        if (i === 0) { leaf(ctx, "maple", ix - 50, iy, 70); text(ctx, "→ ?", ix + 40, iy + 16, 44, { align: "center", weight: 900, color: INK }); }
        if (i === 1) { tagChipTxt(ctx, "MULAI", ix - 60, iy, ORANGE, 1); tagChipTxt(ctx, "AKHIR", ix + 70, iy, GREEN, 1); }
        if (i === 2) { mline(ctx, [[ix - 90, iy + 10], [ix - 40, iy - 30], [ix + 40, iy - 30], [ix + 90, iy + 10]], 1, BLUE, 8); }
      });
    });
  }

  // ---------- akhir, Short ----------
  function akhir(ctx, b, l) {
    board(ctx);
    kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
    [[TAB.S, 600], [TAB.L, 820]].forEach(([T, x], i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160, { scarf: T.scarf }));
    lodge(ctx, 710, 690, 170);
    card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
    text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
    const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
    L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
    para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
    hand(ctx, "Semoga sukses!", 330, 790, 50, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
  }
  // versi tegak untuk Short: dua potongan, atas x 500–1220 y 140–480 (Severin, Quirina), bawah x 500–1220 y 500–840 (Emil, Ladina)
  const VS = 0.7, VP = { S: [510, 150], Q: [810, 150], L: [810, 510] };
  function kayu_v(ctx, b, l) {
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, 1920, 1080);
    const id = b.id, oS = {}, oQ = {}, oL = {};
    let note = "", nc = INK;
    if (id === "h0") {
      alpha(ctx, P(l, at(b, "Ia ingin"), 0.5), () => { leaf(ctx, "maple", 620, 300, 150); text(ctx, "bentuk daun", 620, 440, 30, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "→ ? →", 860, 330, 64, { align: "center", weight: 900, color: ORANGE }); lodge(ctx, 1100, 370, 190); text(ctx, "bagus untuk pondok?", 1100, 440, 30, { align: "center", weight: 800, color: C.ink2 }); });
      friend(ctx, null, 700, 630, 160); leaf(ctx, "maple", 810, 600, 110 * P(l, 0.3, 0.5), -0.2);
      para(ctx, "Emil hanya tahu bentuk daunnya", 1040, 640, 36, 300, { align: "center", weight: 900, color: ORANGE });
    } else {
      if (id === "h1") { oS.a = P(l, at(b, "Severin"), 0.5); oQ.a = P(l, at(b, "Quirina"), 0.5); oL.a = P(l, at(b, "Ladina"), 0.5); }
      if (id === "h3" || id === "h4") {
        const u1 = id === "h3" ? P(l, at(b, "Kolom bentuk daun"), 0.5) : 1, u2 = id === "h3" ? P(l, at(b, "kolom pondok"), 0.5) : 1, u3 = id === "h3" ? P(l, at(b, "sama-sama"), 0.5) : 1;
        oS.ringCol = { daun: [u1, ORANGE] }; oL.ringCol = { pondok: [u2, GREEN] };
        oS.hiCol = { pohon: ["rgba(47,111,208,0.25)", u3] }; oL.hiCol = { pohon: ["rgba(47,111,208,0.25)", u3] }; oQ.a = 1 - 0.65 * u3;
        if (id === "h3") { note = u3 > 0 ? "Kolom Pohon ada di tabel Severin dan Ladina" : (u2 > 0 ? "Mulai di Severin, berakhir di Ladina" : "Kolom daun hanya di tabel Severin"); nc = u3 > 0 ? BLUE : ORANGE; }
      }
      if (id === "h4") { oS.hiRow = 1; oS.dimRows = true; oL.hiRow = 2; oL.dimRows = true; oS.rowA = P(l, at(b, "Severin dulu"), 0.4); oL.rowA = P(l, at(b, "kepada Ladina"), 0.4); }
      drawTable(ctx, TAB.S, VP.S[0], VP.S[1], VS, oS); drawTable(ctx, TAB.Q, VP.Q[0], VP.Q[1], VS, oQ); drawTable(ctx, TAB.L, VP.L[0], VP.L[1], VS, oL);
      friend(ctx, null, 600, 580, 100); leaf(ctx, "maple", 690, 560, 70, -0.2);
      if (id === "h1") { note = "Tiga tabel catatan pohon"; }
      if (id === "h2") { note = "Tanya siapa dulu, lalu siapa?"; nc = ORANGE; }
      if (id === "h4") {
        const u = P(l, at(b, "Jawabannya"), 0.5);
        chip(ctx, "Maple", 700, 700, 30, { a: P(l, at(b, "nama pohonnya"), 0.5) });
        if (u > 0) { note = "Severin, lalu Ladina"; nc = GREEN; }
      }
      if (note) para(ctx, note, 655, 770, 30, 290, { align: "center", weight: 900, color: nc });
    }
  }
  function cta_bebras(ctx, b, l) {
    board(ctx);
    text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
    text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "Cari kolom yang sama untuk menghubungkan tabel", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
    kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
  }

  Object.assign(K.SCENES, { buka, kredit, cerita, pilihan, baca, jembatan, telusur, periksa, basisdata, langkah, akhir, kayu_v, cta_bebras });
})(typeof window !== "undefined" ? window : globalThis);
