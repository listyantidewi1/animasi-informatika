/* B08 Pembahasan Soal Bebras 2024-FI-04 "Pola Berang-berang" (Finlandia), kategori SiKecil.
   Gaya papan tulis putih dengan coretan spidol (sama dengan B01–B04) + simulasi:
   Bastian si berang-berang menyusun kue versinya sendiri (dari bawah: biskuit, krim, krim, krim, biskuit, krim, krim, biskuit),
   lalu mengecat 8 papan pagar dengan pola yang sama: biskuit = merah (M), krim = kuning (K). Jawaban B: M K K K M K K M.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Pola Berang-berang", asli: "", tahun: "2024", negara: "Finlandia", kode: "2024-FI-04" };
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

  // ---------- benda: kue, pagar, Bastian, buku ----------
  const BIS = "#E3AE63", BIS2 = "#B9803A", CRM = "#FFFDF3", CRM2 = "#978E74";
  const PM = "#DE4A3F", PK = "#F6D23A";                       // cat merah dan kuning
  const KUE = ["B", "C", "C", "C", "B", "C", "C", "B"];       // kue versi Bastian, dari BAWAH ke atas
  const PAGAR = KUE.map(t => t === "B" ? "M" : "K");          // M K K K M K K M (pilihan B)
  const OPT = { A: "MKKKMMKM", B: "MKKKMKKM", C: "MKMMMMKM", D: "MKMKMKMK" };
  // satu lapis kue (tampak samping agak dari atas); y0 = dasar lapis
  function layer(ctx, cx, y0, h, w, type, opt = {}) {
    const rx = (type === "C" ? w * (opt.odd ? 0.87 : 0.92) : w) / 2, ry = w * 0.13;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    if (type === "C") { const g = ctx.createLinearGradient(0, y0 - h - ry, 0, y0 + ry); g.addColorStop(0, "#FFFFFF"); g.addColorStop(1, "#E4DCC6"); ctx.fillStyle = g; } else ctx.fillStyle = BIS;
    ctx.strokeStyle = type === "C" ? CRM2 : BIS2; ctx.lineWidth = Math.max(2.5, w * 0.009);
    ctx.beginPath(); ctx.moveTo(cx - rx, y0 - h); ctx.lineTo(cx - rx, y0);
    ctx.ellipse(cx, y0, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + rx, y0 - h);
    ctx.ellipse(cx, y0 - h, rx, ry, 0, 0, Math.PI, true); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (type === "C") ctx.fillStyle = CRM;
    ctx.beginPath(); ctx.ellipse(cx, y0 - h, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (type === "B" && opt.top) {       // titik-titik hiasan biskuit paling atas
      ctx.fillStyle = BIS2;
      for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rx * 0.8, y0 - h + Math.sin(a) * ry * 0.8, Math.max(1.5, w * 0.007), 0, Math.PI * 2); ctx.fill(); }
    }
    if (type === "B") { ctx.strokeStyle = "rgba(150,95,40,0.55)"; ctx.setLineDash([w * 0.012, w * 0.02]); ctx.beginPath(); ctx.ellipse(cx, y0 - h * 0.5, rx, ry, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
    if (opt.hi > 0) { ctx.save(); ctx.globalAlpha *= clamp(opt.hi, 0, 1); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, cx - rx - 14, y0 - h - ry - 6, rx * 2 + 28, h + ry * 2 + 12, 16); ctx.stroke(); ctx.restore(); }
  }
  // kue bertumpuk; layers dari bawah ke atas; mengembalikan pusat tiap lapis (sisi kanan) untuk label
  function cookie(ctx, cx, bottom, w, layers, opt = {}) {
    const tb = opt.tb || w * 0.12, tc = opt.tc || w * 0.08, out = [];
    let y = bottom;
    layers.forEach((t, i) => {
      const h = t === "B" ? tb : tc, show = opt.show ? opt.show[i] : 1;
      const yy = y - (1 - clamp(show, 0, 1)) * 60;
      if (show > 0) layer(ctx, cx, yy, h, w, t, { odd: i % 2 === 1, top: i === layers.length - 1, alpha: show, hi: opt.hi ? opt.hi[i] : 0 });
      out.push({ x: cx + w / 2, y: y - h / 2, type: t }); y -= h;
    });
    return out;
  }
  // pagar 8 papan; cols: string/array "M"/"K"/null; fill[i] = 0..1 untuk muncul catnya
  function fence(ctx, x, y, w, h, cols, opt = {}) {
    const n = 8, step = w / n, pw = step * 0.8, tip = pw * 0.55;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = "#2B2B2B";
    for (const ry of [0.3, 0.78]) rr(ctx, x - step * 0.15, y + h * ry - h * 0.025, w + step * 0.3, h * 0.05, 4), ctx.fill();
    const P = [];
    for (let i = 0; i < n; i++) {
      const px = x + i * step + (step - pw) / 2, c = cols ? cols[i] : null, f = opt.fill ? opt.fill[i] : (c ? 1 : 0);
      const path = () => { ctx.beginPath(); ctx.moveTo(px, y + tip); ctx.lineTo(px + pw / 2, y); ctx.lineTo(px + pw, y + tip); ctx.lineTo(px + pw, y + h); ctx.lineTo(px, y + h); ctx.closePath(); };
      path(); ctx.fillStyle = "#FFFFFF"; ctx.fill();
      if (c && f > 0) { ctx.save(); ctx.globalAlpha *= clamp(f, 0, 1); path(); ctx.fillStyle = c === "M" ? PM : PK; ctx.fill(); ctx.restore(); }
      path(); ctx.strokeStyle = "#5A646D"; ctx.lineWidth = Math.max(2, pw * 0.05); ctx.stroke();
      if (c && f > 0.5 && opt.letters !== false) text(ctx, c, px + pw / 2, y + h * 0.56 + pw * 0.17, pw * 0.5, { align: "center", weight: 900, color: c === "M" ? "#FFFFFF" : INK });
      P.push({ x: px + pw / 2, top: y, pw });
    }
    if (opt.nums) P.forEach((p, i) => text(ctx, String(i + 1), p.x, y + h + pw * 0.62, pw * 0.42, { align: "center", weight: 800, color: GRAYT }));
    ctx.restore();
    return P;
  }
  function chip(ctx, c, cx, cy, s, a = 1) {   // kotak warna kecil berhuruf
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1); ctx.fillStyle = c === "M" ? PM : PK; ctx.strokeStyle = "#5A646D"; ctx.lineWidth = 3;
    rr(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.18); ctx.fill(); ctx.stroke();
    text(ctx, c, cx, cy + s * 0.18, s * 0.5, { align: "center", weight: 900, color: c === "M" ? "#fff" : INK }); ctx.restore();
  }
  // Bastian: berang-berang maskot + ekor pipih + kuas cat
  function bastian(ctx, x, y, s, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
    ctx.fillStyle = "#5E3B24"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(36, 40, 26, 13, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#7A5233"; ctx.lineWidth = 1.5; for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(24 + k * 8, 36 + k * 6); ctx.lineTo(48 + k * 8, 30 + k * 6); ctx.stroke(); }
    ctx.restore();
    beaver(ctx, x, y, s);
    if (opt.brush) {
      ctx.save(); ctx.translate(x - s * 0.36, y + s * 0.12); ctx.rotate(-0.5 + (opt.wig || 0));
      ctx.fillStyle = "#B07A3E"; rr(ctx, -s * 0.03, -s * 0.05, s * 0.06, s * 0.42, s * 0.02); ctx.fill();
      ctx.fillStyle = "#9AA4AC"; ctx.fillRect(-s * 0.05, -s * 0.12, s * 0.1, s * 0.08);
      ctx.fillStyle = opt.brush; ctx.beginPath(); ctx.moveTo(-s * 0.05, -s * 0.12); ctx.lineTo(s * 0.05, -s * 0.12); ctx.lineTo(0, -s * 0.24); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  function flagFI(ctx, x, y, w) {   // bendera Finlandia: putih dengan salib biru
    const h = w * 0.61;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#1A4E9C"; ctx.fillRect(x + w * 0.28, y, w * 0.17, h); ctx.fillRect(x, y + h * 0.36, w, h * 0.28);
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }
  function book(ctx, cx, y0, w, h, opt = {}) {   // buku tampak samping; y0 = dasar
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = "#B5764A"; ctx.strokeStyle = "#6E4429"; ctx.lineWidth = 3;
    rr(ctx, cx - w / 2, y0 - h, w, h, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FBF6EA"; ctx.fillRect(cx - w / 2 + 14, y0 - h + 7, w - 24, h - 14);
    ctx.strokeStyle = "#D8CFBC"; ctx.lineWidth = 1.5;
    for (let k = 1; k < Math.max(2, h / 9); k++) { const yy = y0 - h + 7 + k * (h - 14) / Math.max(2, h / 9); ctx.beginPath(); ctx.moveTo(cx - w / 2 + 16, yy); ctx.lineTo(cx + w / 2 - 12, yy); ctx.stroke(); }
    ctx.restore();
    if (opt.hi > 0) { ctx.save(); ctx.globalAlpha *= clamp(opt.hi, 0, 1); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, cx - w / 2 - 12, y0 - h - 8, w + 24, h + 16, 12); ctx.stroke(); ctx.restore(); }
  }
  function swatch(ctx, c, x, y, s) { ctx.fillStyle = c; ctx.strokeStyle = "#5A646D"; ctx.lineWidth = 3; rr(ctx, x, y, s, s, 8); ctx.fill(); ctx.stroke(); }

  // ---------- adegan soal ----------
  function kue(ctx, b, l) {
    board(ctx);
    const first = b.id === "soal1", two = b.id === "soal2";
    bastian(ctx, 330, 470, 250, { alpha: first ? P(l, at(b, "Ini adalah Bastian"), 0.6) : 1 });
    hand(ctx, "Bastian", 330, 740, 50, { color: BLUE, alpha: first ? P(l, at(b, "Ini adalah Bastian"), 0.6) : 1 });
    if (first) {
      alpha(ctx, P(l, at(b, "kue kering"), 0.6), () => { cookie(ctx, 960, 560, 300, ["B", "C", "B"]); hand(ctx, "kue kering", 960, 330, 52); });
      return;
    }
    const nc = 860, nb = 600;
    const lab = b.id === "soal1b" ? atSeq(b, ["biskuit di bawah", "krim di tengah", "biskuit lagi"]).map(t => P(l, t, 0.5)) : [1, 1, 1];
    const hi = b.id === "soal1b" ? lab.map((a, i) => a * (1 - P(l, (atSeq(b, ["biskuit di bawah", "krim di tengah", "biskuit lagi"])[i + 1] || b.dur) - 0.1, 0.3))) : [0, 0, 0];
    const pts = cookie(ctx, nc, nb, 320, ["B", "C", "B"], { hi, tb: 58, tc: 44 });
    hand(ctx, "kue biasa", nc, 330, 50, { color: INK });
    const LY = [nb - 10, pts[1].y, pts[2].y - 50];
    ["biskuit", "krim", "biskuit"].forEach((s, i) => alpha(ctx, lab[i], () => {
      mline(ctx, [[pts[i].x + 20, pts[i].y], [pts[i].x + 80, LY[i]]], 1, GRAYT, 3);
      text(ctx, s, pts[i].x + 92, LY[i] + 13, 40, { weight: 800, color: s === "krim" ? "#8C8471" : BIS2 });
    }));
    if (!two) return;
    const t0 = at(b, "menyusunnya lagi"), t1 = at(b, "Inilah kue versi Bastian");
    const show = KUE.map((_, i) => P(l, t0 + i * (t1 - t0 + 0.3) / 8, 0.35));
    cookie(ctx, 1500, 740, 320, KUE, { show, tb: 50, tc: 40 });
    alpha(ctx, P(l, t1, 0.6), () => hand(ctx, "kue versi Bastian", 1500, 250, 50, { color: ORANGE }));
    alpha(ctx, P(l, at(b, "bertumpuk"), 0.6), () => hand(ctx, "krimnya bertumpuk!", 1180, 780, 40, { color: GRAYT }));
  }
  const FX = 540, FY = 290, FW = 880, FH = 400;
  function pagar(ctx, b, l) {
    board(ctx);
    const first = b.id === "soal3";
    cookie(ctx, 270, 700, 230, KUE, { tb: 40, tc: 31 });
    hand(ctx, "kue versi Bastian", 270, 760, 34, { color: ORANGE });
    bastian(ctx, 1640, 560, 190, { brush: first ? null : PM, wig: Math.sin(l * 4) * 0.08 });
    const fa = first ? P(l, at(b, "mengecat pagarnya"), 0.6) : 1;
    const red = first ? 0 : P(l, at(b, "papan pertama"), 0.8);
    alpha(ctx, fa, () => fence(ctx, FX, FY, FW, FH, ["M"], { fill: [red], nums: first ? P(l, at(b, "delapan papan"), 0.5) > 0.5 : true }));
    if (first) {
      alpha(ctx, P(l, at(b, "pola yang sama"), 0.6), () => { mline(ctx, [[400, 560], [500, 520]], 1, ORANGE, 6, true); hand(ctx, "pola sama", 980, 230, 46, { color: ORANGE }); });
      return;
    }
    const lg = atSeq(b, ["merah dan kuning", "huruf M", "huruf K"]);
    alpha(ctx, P(l, lg[1], 0.5), () => { swatch(ctx, PM, 640, 175, 54); text(ctx, "M = merah", 712, 218, 42, { weight: 900, color: INK }); });
    alpha(ctx, P(l, lg[2], 0.5), () => { swatch(ctx, PK, 1000, 175, 54); text(ctx, "K = kuning", 1072, 218, 42, { weight: 900, color: INK }); });
    alpha(ctx, P(l, at(b, "papan pertama"), 0.5), () => ring(ctx, FX + FW / 16, FY + FH / 2 + 10, 66, FH / 2 + 50, P(l, at(b, "papan pertama"), 0.8), BLUE, 5));
  }

  // ---------- pilihan jawaban (2 x 2) ----------
  const GX = [180, 770], GY = [200, 505], GW = 430, GH = 235, LET = ["A", "B", "C", "D"];
  const PIL = ["soal4", "p1", "p2", "p3", "p4"];
  function pilihan(ctx, b, l) {
    board(ctx);
    const o = prog(PIL, b, l);
    const show = b.id === "soal4" ? [0, 1, 2, 3].map(i => P(l, at(b, "empat pilihan") + i * 0.45, 0.5)) : [1, 1, 1, 1];
    const live = { p1: 0, p2: 2, p3: 3, p4: 1 }[b.id];
    const wrong = { 0: o("p1", () => P(l, at(b, "Jadi, pilihan A"), 0.5)), 2: o("p2", () => P(l, at(b, "Jadi, pilihan C"), 0.5)), 3: o("p3", () => P(l, at(b, "Jadi, pilihan D"), 0.5)) };
    const okB = o("p4", () => P(l, at(b, "adalah B"), 0.8));
    LET.forEach((L, i) => {
      if (show[i] <= 0) return;
      const x = GX[i % 2], y = GY[i >> 1];
      ctx.save(); ctx.globalAlpha *= show[i];
      if (live === i) { ctx.fillStyle = "#FFF4D6"; rr(ctx, x - 112, y - 40, GW + 140, GH + 80, 18); ctx.fill(); }
      const dim = wrong[i] ? 1 - 0.5 * wrong[i] : 1;
      ctx.save(); ctx.globalAlpha *= dim;
      ctx.fillStyle = i === 1 && okB > 0.5 ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(x - 60, y + GH / 2, 38, 0, Math.PI * 2); ctx.fill();
      text(ctx, L, x - 60, y + GH / 2 + 16, 46, { align: "center", weight: 900, color: "#fff" });
      const pl = fence(ctx, x, y, GW, GH, OPT[L].split(""));
      ctx.restore();
      if (wrong[i] > 0) cross(ctx, x - 60, y + GH / 2, 80, wrong[i], RED, 9);
      if (i === 1 && okB > 0) ring(ctx, x - 60, y + GH / 2, 56, 56, okB, GREEN, 7);
      // tanda khusus tiap pilihan
      if (i === 0) {
        const nm = o("p1", () => P(l, at(b, "empat papan merah"), 0.4)), rg = o("p1", () => P(l, at(b, "berdampingan"), 0.6));
        if (b.id === "p1") ["M"].forEach(() => { let k = 0; OPT.A.split("").forEach((c, j) => { if (c === "M") { k++; alpha(ctx, clamp(nm * 4 - (k - 1), 0, 1), () => numTag(ctx, pl[j].x, y - 26, k)); } }); });
        if (rg > 0 && b.id === "p1") ring(ctx, (pl[4].x + pl[5].x) / 2, y + GH / 2, 64, GH / 2 + 26, rg, ORANGE, 6);
      }
      if (i === 2 && b.id === "p2") { const nm = P(l, at(b, "enam papan merah"), 0.4); let k = 0; OPT.C.split("").forEach((c, j) => { if (c === "M") { k++; alpha(ctx, clamp(nm * 6 - (k - 1), 0, 1), () => numTag(ctx, pl[j].x, y - 26, k)); } }); }
      if (i === 3 && b.id === "p3") { const u = P(l, at(b, "berganti-ganti"), 1.2); const pts = pl.map((p, j) => [p.x, y + GH + 22 + (j % 2 ? 22 : 0)]); mline(ctx, pts, u, ORANGE, 5); }
      if (i === 1 && b.id === "p4") { const t0 = at(b, "merah"), t1 = at(b, "Semua papannya"); pl.forEach((p, j) => tick(ctx, p.x, y - 22, 34, P(l, t0 + j * (t1 - t0) / 8, 0.3), GREEN, 5)); }
      ctx.restore();
    });
    if (b.id === "soal4") {
      alpha(ctx, P(l, 0.3, 0.6), () => {
        card(ctx, 1260, 230, 570, 320, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
        text(ctx, "PERTANYAAN", 1545, 295, 32, { align: "center", weight: 900, color: C.accentDark });
        para(ctx, "Bagaimana warna pagar setelah Bastian selesai mengecat?", 1545, 370, 42, 500, { align: "center", weight: 900, color: INK });
      });
      return;
    }
    card(ctx, 1260, 170, 570, 330, { fill: "#EFF8F2", stroke: GREEN, lw: 4, r: 20 });
    text(ctx, "Pagar kita", 1545, 222, 34, { align: "center", weight: 900, color: GREEN });
    fence(ctx, 1325, 255, 440, 160, PAGAR);
    text(ctx, "3 merah dan 5 kuning", 1545, 470, 32, { align: "center", weight: 800, color: INK });
    const R = {
      p1: [["di kue Bastian, tidak ada", "dua biskuit yang menempel"], "Padahal", RED],
      p2: [["kue Bastian hanya", "punya 3 biskuit"], "Padahal", RED],
      p3: [["harus ada papan kuning", "yang berdampingan"], "Padahal", RED],
      p4: [["sama persis!"], "Semua papannya", GREEN],
    }[b.id];
    if (R) alpha(ctx, P(l, at(b, R[1]), 0.6), () => R[0].forEach((s, k) => hand(ctx, s, 1545, 590 + k * 58, R[0].length > 1 ? 38 : 52, { color: R[2] })));
  }
  function numTag(ctx, x, y, n) {
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x, y, 17, 0, Math.PI * 2); ctx.fill();
    text(ctx, String(n), x, y + 8, 22, { align: "center", weight: 900, color: "#fff" });
  }

  // ---------- pemanasan: tumpukan buku -> kotak warna ----------
  const BUKU = ["T", "t", "T", "t", "t"], BK = { T: 96, t: 50 };
  const BW_ = ["w1", "w2", "w3", "w4"];
  function buku(ctx, b, l) {
    board(ctx);
    const o = prog(BW_, b, l);
    const app = b.id === "w1" ? P(l, at(b, "tumpukan buku"), 0.6) : 1;
    const words = b.id === "w3" ? atSeq(b, ["Tebal", "tipis", "tebal", "tipis", "tipis"]) : null;
    const cw = b.id === "w3" ? atSeq(b, ["biru", "hijau", "biru", "hijau", "hijau"]) : null;
    let y = 740; const ys = [];
    BUKU.forEach((t, i) => {
      const hi = words ? P(l, words[i], 0.3) * (1 - P(l, (words[i + 1] || cw[0]) - 0.05, 0.3)) : 0;
      book(ctx, 470, y, 380, BK[t], { alpha: app, hi }); ys.push(y - BK[t] / 2); y -= BK[t];
    });
    const lt = b.id === "w1" ? [P(l, at(b, "buku yang tebal"), 0.5), P(l, at(b, "buku yang tipis"), 0.5)] : [1, 1];
    BUKU.forEach((t, i) => alpha(ctx, lt[t === "T" ? 0 : 1], () => text(ctx, t === "T" ? "tebal" : "tipis", 250, ys[i] + 11, 32, { align: "right", weight: 800, color: GRAYT })));
    alpha(ctx, o("w3", () => P(l, at(b, "dari bawah ke atas"), 0.6)), () => { mline(ctx, [[700, 740], [700, 420]], 1, ORANGE, 6, true); hand(ctx, "dari bawah", 700, 395, 34); });
    // legenda
    const lg = b.id === "w2" ? [P(l, at(b, "kotak biru"), 0.5), P(l, at(b, "kotak hijau"), 0.5)] : (b.id === "w1" ? [0, 0] : [1, 1]);
    alpha(ctx, lg[0], () => { book(ctx, 960, 270, 120, 46); mline(ctx, [[1040, 248], [1130, 248]], 1, ORANGE, 5, true); swatch(ctx, BLUE, 1150, 218, 60); text(ctx, "tebal = biru", 1240, 262, 38, { weight: 900, color: INK }); });
    alpha(ctx, lg[1], () => { book(ctx, 960, 360, 120, 22); mline(ctx, [[1040, 348], [1130, 348]], 1, ORANGE, 5, true); swatch(ctx, GREEN, 1150, 318, 60); text(ctx, "tipis = hijau", 1240, 362, 38, { weight: 900, color: INK }); });
    // deretan kotak
    if (b.id === "w1") return;
    const BXs = [870, 1060, 1250, 1440, 1630];
    BXs.forEach((x, i) => {
      ctx.save(); ctx.strokeStyle = "#8D99A3"; ctx.lineWidth = 4; ctx.fillStyle = "#F7F9FA"; rr(ctx, x - 75, 470, 150, 150, 16); ctx.fill(); ctx.stroke(); ctx.restore();
      const f = b.id === "w2" ? 0 : (cw ? P(l, cw[i], 0.4) : 1);
      alpha(ctx, f, () => { ctx.fillStyle = BUKU[i] === "T" ? BLUE : GREEN; rr(ctx, x - 75, 470, 150, 150, 16); ctx.fill(); });
      text(ctx, String(i + 1), x, 665, 30, { align: "center", weight: 800, color: GRAYT });
    });
    alpha(ctx, o("w4", () => P(l, at(b, "Benda yang sama"), 0.6)), () => hand(ctx, "benda sama = warna sama", 1250, 740, 44, { color: GREEN }));
    alpha(ctx, o("w4", () => P(l, at(b, "urutannya"), 0.6)), () => hand(ctx, "urutannya tetap", 1250, 800, 44, { color: GREEN }));
  }

  // ---------- mewarnai pagar (j0–j4) ----------
  const CAT = ["j0", "j1", "j2", "j3", "j4"];
  const CKX = 320, CKB = 760, CKW = 300, TB = 50, TC = 40;
  const PX = 760, PY = 330, PW = 1040, PH = 380;
  function cat(ctx, b, l) {
    board(ctx);
    const o = prog(CAT, b, l);
    const rd = b.id === "j2" ? atSeq(b, ["Biskuit", "krim", "krim", "krim", "biskuit", "krim", "krim", "biskuit"]) : null;
    const cl = b.id === "j3" ? atSeq(b, ["merah", "kuning", "kuning", "kuning", "merah", "kuning", "kuning", "merah"], "pagarnya menjadi") : null;
    const hi = KUE.map((_, i) => rd ? P(l, rd[i], 0.25) * (1 - P(l, (rd[i + 1] || b.dur) - 0.05, 0.25)) : (cl ? P(l, cl[i], 0.25) * (1 - P(l, (cl[i + 1] || b.dur) - 0.05, 0.25)) : 0));
    if (b.id === "j1") hi[0] = P(l, at(b, "dimulai dengan biskuit"), 0.3) * (1 - P(l, at(b, "Jadi, biskuit") + 0.3, 0.3));
    const pts = cookie(ctx, CKX, CKB, CKW, KUE, { tb: TB, tc: TC, hi });
    // lambang warna di samping tiap lapis
    pts.forEach((p, i) => chip(ctx, PAGAR[i], p.x + 56, p.y, 38, o("j2", () => rd ? P(l, rd[i], 0.3) : 0)));
    alpha(ctx, o("j2", () => P(l, at(b, "dari bawah ke atas"), 0.6)), () => { mline(ctx, [[110, CKB], [110, CKB - 330]], 1, ORANGE, 6, true); ctx.save(); ctx.translate(88, CKB - 165); ctx.rotate(-Math.PI / 2); hand(ctx, "dari bawah", 0, 0, 30); ctx.restore(); });
    // legenda biskuit = merah, krim = kuning
    const lg = b.id === "j1" ? [P(l, at(b, "biskuit menjadi merah"), 0.5), P(l, at(b, "krim menjadi kuning"), 0.5)] : (b.id === "j0" ? [0, 0] : [1, 1]);
    alpha(ctx, lg[0], () => { layer(ctx, 150, 214, 26, 110, "B", { top: true }); mline(ctx, [[220, 200], [280, 200]], 1, ORANGE, 5, true); swatch(ctx, PM, 296, 172, 54); text(ctx, "biskuit = merah", 366, 214, 34, { weight: 900, color: INK }); });
    alpha(ctx, lg[1], () => { layer(ctx, 150, 300, 20, 110, "C"); mline(ctx, [[220, 290], [280, 290]], 1, ORANGE, 5, true); swatch(ctx, PK, 296, 262, 54); text(ctx, "krim = kuning", 366, 304, 34, { weight: 900, color: INK }); });
    // pagar
    const fill = PAGAR.map((c, i) => i === 0 ? 1 : (cl ? P(l, cl[i], 0.35) : o("j3", () => 0)));
    const pl = fence(ctx, PX, PY, PW, PH, PAGAR, { fill, nums: true });
    if (b.id === "j1") alpha(ctx, P(l, at(b, "Papan pertama"), 0.5), () => ring(ctx, pl[0].x, PY + PH / 2 + 10, 70, PH / 2 + 50, P(l, at(b, "Papan pertama"), 0.8), BLUE, 5));
    if (cl) pl.forEach((p, i) => { const a = P(l, cl[i], 0.25) * (1 - P(l, (cl[i + 1] || b.dur) - 0.05, 0.25)); if (a > 0) mline(ctx, [[pts[i].x + 80, pts[i].y], [p.x - p.pw / 2 - 6, PY + PH * 0.55]], a, ORANGE, 4, true); });
    bastian(ctx, 1745, 215, 100, { brush: PM, wig: Math.sin(l * 4) * 0.08 });
    if (b.id === "j0") thinkBadge(ctx, 760, 158, 900, 110, l, b.dur, "Warnai 8 papan pagar Bastian.");
    if (b.id === "j4") {
      const t = atSeq(b, ["delapan lapis", "tiga biskuit", "lima krim"]);
      alpha(ctx, P(l, t[0], 0.5), () => hand(ctx, "8 lapis kue = 8 papan", 1280, 210, 44, { color: INK }));
      alpha(ctx, P(l, t[1], 0.5), () => hand(ctx, "3 biskuit = 3 merah", 1050, 290, 38, { color: RED }));
      alpha(ctx, P(l, t[2], 0.5), () => hand(ctx, "5 krim = 5 kuning", 1530, 290, 38, { color: "#B48A00" }));
    }
  }

  // ---------- dibaca dari atas = pagar B dari kanan ----------
  function balik(ctx, b, l) {
    board(ctx);
    const p5 = b.id === "p5";
    const top = KUE.slice().reverse().map(t => t === "B" ? "M" : "K");    // M K K M K K K M
    const tc = p5 ? atSeq(b, ["merah", "kuning", "kuning", "merah", "kuning", "kuning", "kuning", "merah"], "Urutannya menjadi") : null;
    const hi = KUE.map((_, i) => { if (!p5) return 0; const j = 7 - i; return P(l, tc[j], 0.25) * (1 - P(l, (tc[j + 1] || b.dur) - 0.05, 0.25)); });
    cookie(ctx, 320, 750, 300, KUE, { tb: TB, tc: TC, hi });
    alpha(ctx, p5 ? P(l, at(b, "dari atas ke bawah"), 0.6) : 1, () => { mline(ctx, [[540, 400], [540, 740]], 1, ORANGE, 6, true); hand(ctx, "dari atas", 540, 375, 34); });
    text(ctx, "Kue dibaca dari atas", 760, 205, 34, { weight: 900, color: C.ink2 });
    const CX0 = 820, ST = 125;
    top.forEach((c, i) => chip(ctx, c, CX0 + i * ST, 270, 70, p5 ? P(l, tc[i], 0.3) : 1));
    if (p5) return;
    const fx = 760, fw = 1000, tr = at(b, "dari kanan ke kiri"), ts = at(b, "sama persis");
    alpha(ctx, P(l, at(b, "pagar B"), 0.5), () => {
      text(ctx, "Pagar B", 760, 395, 34, { weight: 900, color: GREEN });
      const pl = fence(ctx, fx, 430, fw, 230, OPT.B.split(""));
      mline(ctx, [[fx + fw, 700], [fx, 700]], P(l, tr, 1.0), ORANGE, 6, true);
      alpha(ctx, P(l, tr, 0.5), () => hand(ctx, "dari kanan ke kiri", fx + fw / 2, 752, 38));
      // papan dibaca dari kanan: papan ke-k dari kanan dicocokkan dengan kotak ke-k
      const R = pl.slice().reverse();
      R.forEach((p, k) => { const t0 = tr + 0.3 + k * 0.35, u = P(l, t0, 0.3); if (u > 0) tick(ctx, CX0 + k * ST, 340, 40, u, GREEN, 6);
        const on = u * (1 - P(l, t0 + 0.35, 0.2)); if (on > 0) alpha(ctx, on, () => { ctx.fillStyle = BLUE; ctx.beginPath(); ctx.moveTo(p.x - 16, 395); ctx.lineTo(p.x + 16, 395); ctx.lineTo(p.x, 420); ctx.closePath(); ctx.fill(); }); });
    });
    alpha(ctx, P(l, ts, 0.6), () => hand(ctx, "sama persis!", 1590, 395, 44, { color: GREEN }));
    alpha(ctx, P(l, at(b, "tetap B"), 0.6), () => hand(ctx, "jawabannya tetap B", 1260, 805, 40, { color: GREEN }));
  }

  // ---------- penutup ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["ganti setiap benda", "salin urutannya", "hitung"]);
    const S = ["Ganti setiap benda dengan warnanya.", "Salin urutannya satu per satu.", "Hitung, lalu cocokkan dengan pilihan."];
    S.forEach((s, i) => {
      const y = 170 + i * 185;
      alpha(ctx, P(l, T[i], 0.5), () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 50, { weight: 900, color: INK, fit: 1000 });
        const ix = 1530, iy = y + 80;
        if (i === 0) { layer(ctx, ix - 90, iy + 18, 34, 120, "B", { top: true }); mline(ctx, [[ix - 18, iy], [ix + 40, iy]], 1, ORANGE, 5, true); chip(ctx, "M", ix + 100, iy, 70); }
        if (i === 1) "MKKKM".split("").forEach((c, k) => chip(ctx, c, ix - 120 + k * 62, iy, 52));
        if (i === 2) { hand(ctx, "3 + 5 = 8", ix, iy + 16, 46, { color: INK }); tick(ctx, ix + 150, iy, 50); }
      });
    });
  }

  // ---------- versi tegak untuk Short: kue Bastian, Bastian, pagar (area x 460–1460, y 140–840) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    hand(ctx, "kue versi Bastian", 720, 215, 40, { color: ORANGE });
    cookie(ctx, 720, 520, 270, KUE, { tb: 36, tc: 26 });
    bastian(ctx, 1210, 360, 170, { brush: PM, wig: Math.sin(l * 4) * 0.08 });
    hand(ctx, "Bastian", 1210, 520, 38, { color: BLUE });
    swatch(ctx, PM, 560, 560, 40); text(ctx, "M = merah", 612, 592, 32, { weight: 900, color: INK });
    swatch(ctx, PK, 900, 560, 40); text(ctx, "K = kuning", 952, 592, 32, { weight: 900, color: INK });
    fence(ctx, 520, 625, 880, 200, ["M"]);
  }

  Object.assign(K.SCENES, {
    kue, pagar, pilihan, buku, cat, balik, langkah, soal_v,
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
      const fu = P(l, at(b, "Finlandia"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagFI(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Finlandia"), 0.8);
      if (au > 0) ring(ctx, 1190, 300 + 2 * 92 - 14, 220, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 260, 520, 200, 0, { wave: l, mood: "happy" });
      bastian(ctx, 560, 470, 170, { brush: PM, wig: Math.sin(l * 4) * 0.1 });
      fence(ctx, 420, 600, 560, 190, PAGAR);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Sampai jumpa!", 700, 300, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Menyalin pola kue ke pagar, langkah demi langkah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
