/* PG05 Pembahasan Soal Bebras 2025-SK-03 "Gambar Bunga" (Slowakia), kategori Penegak (SMA).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras) + simulasi robot penanam bunga:
   sepuluh petak tanah, papan tanda di petak 1–5, X di petak 5; robot melayang di atas petak, pita langkah 0–5 dan kotak ingatan.
   Simulasi dihitung dari aturan soal (genEvents) dan diperiksa: hasil akhir harus sama dengan pilihan A.
   Papan: x 52–1868, y 130–830 (kartu narasi mulai y≈840).
   Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F6FA8", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Gambar Bunga", tahun: "2025", negara: "Slowakia", kode: "2025-SK-03" };

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

  function letter(ctx, L, cx, cy, r, good) {
    ctx.fillStyle = good ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, cx, cy + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
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

  // ---------- bunga (bentuk meniru gambar soal) ----------
  // O = tulip oranye, U = bunga ungu, R = mawar merah
  const FNAME = { O: "tulip oranye", U: "bunga ungu", R: "mawar merah" };
  const FCOL = { O: "#E8650F", U: "#7E4FC0", R: "#D51F55" };
  function stem(ctx, x0, y0, x1, y1, s) { ctx.strokeStyle = "#5DBB3F"; ctx.lineWidth = Math.max(2, s * 0.05); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
  function leaf(ctx, x, y, s, dir = 1) { ctx.fillStyle = "#5DBB3F"; ctx.beginPath(); ctx.ellipse(x + dir * s * 0.12, y, s * 0.13, s * 0.06, -dir * 0.45, 0, Math.PI * 2); ctx.fill(); }
  // x = tengah, y = pangkal batang (permukaan tanah), s = tinggi bunga; g = 0..1 (tumbuh)
  function flower(ctx, f, x, y, s, g = 1) {
    if (g <= 0) return;
    ctx.save(); ctx.translate(x, y); const k = 0.25 + 0.75 * ease(clamp(g, 0, 1)); ctx.scale(k, k); ctx.globalAlpha *= clamp(g * 2, 0, 1);
    if (f === "O") {
      stem(ctx, 0, 0, 0, -s * 0.62, s);
      const cy = -s * 0.78, w = s * 0.42, h = s * 0.36;
      ctx.fillStyle = "#FF8A1F"; ctx.beginPath();
      ctx.moveTo(-w / 2, cy - h * 0.35); ctx.lineTo(-w * 0.25, cy - h * 0.05); ctx.lineTo(0, cy - h * 0.5); ctx.lineTo(w * 0.25, cy - h * 0.05); ctx.lineTo(w / 2, cy - h * 0.35);
      ctx.quadraticCurveTo(w * 0.55, cy + h * 0.5, 0, cy + h * 0.5); ctx.quadraticCurveTo(-w * 0.55, cy + h * 0.5, -w / 2, cy - h * 0.35); ctx.fill();
      ctx.fillStyle = "#E8650F"; ctx.beginPath(); ctx.moveTo(-w * 0.18, cy - h * 0.1); ctx.lineTo(0, cy - h * 0.5); ctx.lineTo(w * 0.18, cy - h * 0.1);
      ctx.quadraticCurveTo(w * 0.2, cy + h * 0.45, 0, cy + h * 0.48); ctx.quadraticCurveTo(-w * 0.2, cy + h * 0.45, -w * 0.18, cy - h * 0.1); ctx.fill();
    } else if (f === "U") {
      stem(ctx, s * 0.1, 0, -s * 0.02, -s * 0.66, s); leaf(ctx, s * 0.04, -s * 0.3, s, -1);
      const cx = -s * 0.03, cy = -s * 0.74, r = s * 0.16;
      ctx.fillStyle = "#8E5CD0";
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * 0.62, r * 0.36, a, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = "#6C3FB0"; for (let i = 0; i < 8; i += 2) { const a = i * Math.PI / 4 + 0.4; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9, r * 0.4, r * 0.22, a, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = "#F4D35E"; ctx.beginPath(); ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2); ctx.fill();
    } else {
      stem(ctx, 0, 0, 0, -s * 0.62, s); leaf(ctx, s * 0.03, -s * 0.24, s, 1);
      const cy = -s * 0.8, w = s * 0.38, h = s * 0.4;
      ctx.fillStyle = "#E62E66"; ctx.beginPath();
      ctx.moveTo(-w / 2, cy - h * 0.3); ctx.quadraticCurveTo(-w * 0.3, cy - h * 0.55, 0, cy - h * 0.42); ctx.quadraticCurveTo(w * 0.3, cy - h * 0.55, w / 2, cy - h * 0.3);
      ctx.quadraticCurveTo(w * 0.6, cy + h * 0.45, 0, cy + h * 0.5); ctx.quadraticCurveTo(-w * 0.6, cy + h * 0.45, -w / 2, cy - h * 0.3); ctx.fill();
      ctx.fillStyle = "#B8174A"; ctx.beginPath(); ctx.moveTo(-w * 0.3, cy - h * 0.2); ctx.quadraticCurveTo(0, cy - h * 0.05, w * 0.3, cy - h * 0.2);
      ctx.quadraticCurveTo(w * 0.15, cy + h * 0.1, 0, cy + h * 0.05); ctx.quadraticCurveTo(-w * 0.15, cy + h * 0.1, -w * 0.3, cy - h * 0.2); ctx.fill();
      ctx.fillStyle = "#5DBB3F"; ctx.beginPath(); ctx.moveTo(-w * 0.32, cy + h * 0.3); ctx.quadraticCurveTo(0, cy + h * 0.75, w * 0.32, cy + h * 0.3); ctx.quadraticCurveTo(0, cy + h * 0.55, -w * 0.32, cy + h * 0.3); ctx.fill();
    }
    ctx.restore();
  }
  // ikon bunga di dalam kotak (tanda, ingatan): x,y = tengah kotak, s = sisi kotak
  function ficon(ctx, f, x, y, s) { flower(ctx, f, x, y + s * 0.42, s * 0.95); }

  // ---------- hamparan bunga ----------
  // L: { x0, pw, soil (puncak gundukan), fs (tinggi bunga), sTop, sSize (papan tanda), numY, rY (robot) }
  const LM = { x0: 150, pw: 138, soil: 676, fs: 112, sTop: 392, sSize: 84, numY: 768, rY: 318 };
  const cxOf = (L, i) => L.x0 + (i - 0.5) * L.pw;   // i = 1..10; i = 0 berarti di luar hamparan (kiri)
  function soil(ctx, L, n = 10) {
    ctx.fillStyle = "#7A5340";
    const base = L.soil + L.pw * 0.32;
    ctx.beginPath(); ctx.moveTo(L.x0 - L.pw * 0.06, base);
    for (let i = 1; i <= n; i++) {
      const x = cxOf(L, i), hw = L.pw * 0.56;
      ctx.lineTo(x - hw, base); ctx.bezierCurveTo(x - hw * 0.9, L.soil - L.pw * 0.02, x + hw * 0.9, L.soil - L.pw * 0.02, x + hw, base);
    }
    ctx.closePath(); ctx.fill();
  }
  function nums(ctx, L, a = 1, n = 10) {
    if (a <= 0) return;
    alpha(ctx, a, () => { for (let i = 1; i <= n; i++) text(ctx, String(i), cxOf(L, i), L.numY, Math.round(L.pw * 0.22), { align: "center", weight: 900, color: "#6B7780" }); });
  }
  function xmark(ctx, L, i, a = 1) {
    if (a <= 0) return;
    const x = cxOf(L, i), y = L.soil + L.pw * 0.16, s = L.pw * 0.12;
    alpha(ctx, a, () => { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = L.pw * 0.05; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke(); });
  }
  // papan tanda: a = tampak (0..1), del = 0..1 (sedang dihapus: dicoret lalu memudar)
  function sign(ctx, L, i, f, a = 1, del = 0) {
    if (a <= 0 || del >= 1) return;
    const x = cxOf(L, i), s = L.sSize, y = L.sTop;
    alpha(ctx, a * (del > 0.5 ? 1 - (del - 0.5) * 2 : 1), () => {
      ctx.fillStyle = "#4A453C"; ctx.fillRect(x - s * 0.07, y + s, s * 0.14, L.soil - y - s + 6);
      ctx.fillStyle = "#E3E3E3"; ctx.fillRect(x - s / 2, y, s, s);
      ctx.strokeStyle = "#4A453C"; ctx.lineWidth = Math.max(3, s * 0.07); ctx.strokeRect(x - s / 2, y, s, s);
      ficon(ctx, f, x, y + s / 2, s * 0.86);
      if (del > 0) cross(ctx, x, y + s / 2, s * 0.95, del * 2.2, RED, Math.max(5, s * 0.09));
    });
  }
  function plotRing(ctx, L, i, a, color = ORANGE) {
    if (a <= 0) return;
    const x = cxOf(L, i);
    alpha(ctx, a, () => { ctx.strokeStyle = color; ctx.lineWidth = Math.max(4, L.pw * 0.04); rr(ctx, x - L.pw * 0.47, L.soil - L.fs * 1.08, L.pw * 0.94, L.fs * 1.08 + L.pw * 0.36, 14); ctx.stroke(); });
  }
  // gambar satu hamparan: st = { signs: {i: f}, del: {i: 0..1}, fl: {i: f}, grow: {i: 0..1} }
  function field(ctx, L, st, opt = {}) {
    soil(ctx, L);
    if (opt.x !== false) xmark(ctx, L, 5, opt.xa == null ? 1 : opt.xa);
    if (st.fl) for (const i in st.fl) if (st.fl[i]) flower(ctx, st.fl[i], cxOf(L, +i), L.soil + L.pw * 0.08, L.fs, st.grow && st.grow[i] != null ? st.grow[i] : 1);
    if (st.signs) for (const i in st.signs) if (st.signs[i]) sign(ctx, L, +i, st.signs[i], st.sa && st.sa[i] != null ? st.sa[i] : 1, st.del && st.del[i] || 0);
    if (opt.nums !== false) nums(ctx, L, opt.numA == null ? 1 : opt.numA);
  }
  // baris bunga jadi (pilihan jawaban / hasil): str 10 huruf
  function row(ctx, L, str, opt = {}) {
    soil(ctx, L);
    for (let i = 1; i <= 10; i++) alpha(ctx, opt.dim && opt.dim(i) ? 0.25 : 1, () => flower(ctx, str[i - 1], cxOf(L, i), L.soil + L.pw * 0.08, L.fs, opt.grow ? opt.grow(i) : 1));
    if (opt.nums) nums(ctx, L, 1);
  }

  // ---------- robot penanam bunga (melayang, baling-baling di atas) ----------
  function robot(ctx, x, y, s, t = 0, opt = {}) {
    ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * s * 0.04); const k = s / 100; ctx.scale(k, k);
    if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.strokeStyle = "#2B3440"; ctx.lineWidth = 3;
    // baling-baling
    ctx.fillStyle = "#6B7780"; ctx.fillRect(-3, -62, 6, 14);
    const sp = Math.cos(t * 18); ctx.fillStyle = "#9AA4AC"; ctx.beginPath(); ctx.ellipse(0, -63, 34 * Math.abs(sp) + 6, 5, 0, 0, Math.PI * 2); ctx.fill();
    // kepala
    ctx.fillStyle = "#3BA7B5"; rr(ctx, -36, -50, 72, 46, 14); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#E8FBFF"; rr(ctx, -27, -42, 54, 30, 9); ctx.fill();
    ctx.fillStyle = "#1B2630"; ctx.beginPath(); ctx.arc(-11, -27, 5, 0, Math.PI * 2); ctx.arc(11, -27, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#1B2630"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, -22, 7, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    // badan
    ctx.strokeStyle = "#2B3440"; ctx.lineWidth = 3;
    ctx.fillStyle = "#2E8E9B"; rr(ctx, -28, -2, 56, 40, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#F2B134"; ctx.beginPath(); ctx.arc(0, 18, 7, 0, Math.PI * 2); ctx.fill();
    // lengan + sekop kecil
    ctx.strokeStyle = "#2B3440"; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-28, 8); ctx.lineTo(-42, 26); ctx.moveTo(28, 8); ctx.lineTo(42, 26); ctx.stroke();
    ctx.fillStyle = "#9AA4AC"; ctx.beginPath(); ctx.ellipse(44, 34, 7, 10, 0, 0, Math.PI * 2); ctx.fill();
    // penunjuk ke petak
    if (opt.pointer !== false) { ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-11, 46); ctx.lineTo(11, 46); ctx.lineTo(0, 62); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function robotAt(ctx, L, pos, t, a = 1) { const x = pos <= 0 ? L.x0 - L.pw * 0.35 + pos * L.pw * 0.5 : pos < 1 ? lerp(L.x0 - L.pw * 0.35, cxOf(L, 1), pos) : cxOf(L, pos); robot(ctx, x, L.rY, L.pw * 0.78, t, { alpha: a }); }

  // ---------- data soal + simulasi ----------
  const SIGNS = { 1: "O", 2: "O", 3: "U", 4: "R", 5: "U" };
  const OPT = { A: "OOURUURUOO", B: "OOURUOOURU", C: "OOURUUOURR", D: "OOURUOURUO" };
  const STEP_TXT = ["Pergi ke petak berlabel X.", "Tanam bunga sesuai tanda.", "Ingat bunga yang baru ditanam.", "Hapus tandanya.",
                    "Ke kanan sampai petak kosong, lalu tanam.", "Ke kiri sampai ada tanda, atau keluar."];
  // kejadian simulasi, dihitung dari aturan soal
  function genEvents() {
    const sg = Object.assign({}, SIGNS), fl = {}; let pos = 0, mem = null, round = 0; const ev = [];
    ev.push({ k: "move", from: 0, to: 5, step: 0, round: 0, tag: "r0.go" }); pos = 5;
    const anySign = () => Object.values(sg).some(Boolean);
    while (anySign() && round < 9) {
      round++;
      if (sg[pos]) {
        ev.push({ k: "plant", at: pos, f: sg[pos], step: 1, round, tag: `r${round}.s1` }); fl[pos] = sg[pos];
        mem = fl[pos]; ev.push({ k: "mem", f: mem, step: 2, round, tag: `r${round}.s2` });
        ev.push({ k: "erase", at: pos, step: 3, round, tag: `r${round}.s3` }); sg[pos] = null;
      }
      let q = pos + 1; while (q <= 10 && (fl[q] || sg[q])) q++;
      ev.push({ k: "move", from: pos, to: q, step: 4, round, tag: `r${round}.s4m` }); pos = q;
      ev.push({ k: "plant", at: q, f: mem, step: 4, round, tag: `r${round}.s4p` }); fl[q] = mem;
      let p = pos - 1; while (p >= 1 && !sg[p]) p--;
      ev.push({ k: "move", from: pos, to: Math.max(0, p), step: 5, round, tag: `r${round}.s5` }); pos = Math.max(0, p);
    }
    let fin = ""; for (let i = 1; i <= 10; i++) fin += fl[i] || "-";
    return { ev, fin };
  }
  const SIM = genEvents(), EV = SIM.ev, FINAL = SIM.fin;
  if (FINAL !== OPT.A) (K._warn = K._warn || []).push("simulasi tidak sama dengan pilihan A: " + FINAL);
  const TAG = {}; EV.forEach((e, i) => TAG[e.tag] = i);
  const evDur = e => e.k === "move" ? Math.max(0.5, Math.abs(e.to - e.from) * 0.32) : e.k === "plant" ? 0.6 : 0.5;
  // keadaan setelah n kejadian penuh + kejadian ke-n sebagian (f)
  function simState(n, f) {
    const st = { signs: Object.assign({}, SIGNS), del: {}, fl: {}, grow: {}, pos: 0, mem: null, memG: 1, step: -1, round: 0, ev: null, f: 0 };
    for (let i = 0; i < Math.min(n + 1, EV.length); i++) {
      const e = EV[i], u = i < n ? 1 : f; if (i === n && f <= 0) { if (e.k === "move") st.pos = e.from; break; }
      st.step = e.step; st.round = e.round; st.ev = e; st.f = u;
      if (e.k === "move") st.pos = lerp(e.from, e.to, ease(u));
      else if (e.k === "plant") { st.fl[e.at] = e.f; st.grow[e.at] = u; st.pos = e.at; }
      else if (e.k === "mem") { st.mem = e.f; st.memG = u; }
      else if (e.k === "erase") { st.del[e.at] = u; if (u >= 1) st.signs[e.at] = null; }
    }
    if (n >= EV.length) { const e = EV[EV.length - 1]; st.step = e.step; st.round = e.round; st.ev = e; st.f = 1; }
    return st;
  }
  // penanda waktu per beat: [frasa, tag terakhir yang selesai, pengali tempo]
  const SIM_ORDER = ["r0", "r1a", "r1b", "r1c", "r1d", "r2a", "r2b", "r2c", "r3", "r3b", "r4", "r5", "r6", "r7", "r7b"];
  const ANCH = {
    r0: [["pergi ke petak", "r0.go", 2.2]],
    r1a: [["Jadi, robot menanam", "r1.s1"]],
    r1b: [["robot mengingat", "r1.s2"], ["Langkah tiga", "r1.s3"]],
    r1c: [["bergerak ke kanan", "r1.s4m", 2.5], ["jadi robot menanam", "r1.s4p"]],
    r1d: [["bergerak ke kiri", "r1.s5", 4.5]],
    r2a: [["menanam mawar", "r2.s1"], ["mengingat mawar", "r2.s2"], ["menghapus", "r2.s3"]],
    r2b: [["bergerak ke kanan", "r2.s4m", 5.5], ["jadi robot menanam", "r2.s4p"]],
    r2c: [["kembali ke kiri", "r2.s5", 2]],
    r3: [["menanam bunga ungu di petak tiga", "r3.s1"], ["mengingatnya", "r3.s2"], ["menghapus", "r3.s3"], ["Petak kosong pertama", "r3.s4m", 2.5], ["jadi bunga ungu", "r3.s4p"]],
    r3b: [["kembali ke kiri", "r3.s5", 2]],
    r4: [["menanam tulip oranye di petak dua", "r4.s3", 0.7], ["tulip oranye lagi", "r4.s4p", 1], ["kembali ke petak", "r4.s5", 1.5]],
    r5: [["menanam tulip oranye di petak satu", "r5.s3", 0.7], ["tulip oranye lagi", "r5.s4p", 1]],
    r6: [["bergerak ke kiri", "r5.s5", 3.2]],
    r7: [], r7b: [],
  };
  // short: ringkasan simulasi
  ANCH.sv1 = [["Langkah nol", "r0.go", 1.2], ["menanam bunga ungu di petak lima", "r1.s3", 0.7], ["bunga ungu lagi", "r1.s5", 0.8]];
  ANCH.sv2 = [["mawar merah", "r2.s5", 0.55], ["Bunga ungu", "r3.s5", 0.55], ["Terakhir", "r4.s5", 0.55], ["lalu di petak satu", "r5.s5", 0.55]];
  const SIM_SHORT = ["sv1", "sv2"];
  function baseCount(id) {
    const order = SIM_SHORT.includes(id) ? SIM_SHORT : SIM_ORDER;
    let n = 0; for (const k of order) { if (k === id) break; for (const a of ANCH[k]) n = Math.max(n, TAG[a[1]] + 1); }
    return id === "r7" || id === "r7b" ? EV.length : n;
  }
  function simAt(b, l) {
    let done = baseCount(b.id), t = -1e9;
    for (const [ph, tag, slow] of ANCH[b.id] || []) {
      const target = TAG[tag] + 1; t = Math.max(t, at(b, ph));
      for (let e = done; e < target; e++) {
        const d = evDur(EV[e]) * (slow || 1);
        if (l < t) return simState(e, 0);
        if (l < t + d) return simState(e, (l - t) / d);
        t += d + 0.06;
      }
      done = Math.max(done, target);
    }
    return simState(done, 0);
  }

  // ---------- pita langkah + ingatan ----------
  function memBox(ctx, x, y, w, h, f, g = 1, title = "Ingatan robot") {
    card(ctx, x, y, w, h, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 16 });
    text(ctx, title, x + 18, y + 36, 26, { weight: 900, color: C.accentDark, fit: w - 36 });
    const s = Math.min(h - 56, w * 0.5), cx = x + w / 2, cy = y + 50 + (h - 56) / 2;
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#C9B78E"; ctx.lineWidth = 3; rr(ctx, cx - s / 2, cy - s / 2, s, s, 10); ctx.fill(); ctx.stroke();
    if (f) flower(ctx, f, cx, cy + s * 0.42, s * 0.92, g);
    else text(ctx, "kosong", cx, cy + 9, 24, { align: "center", weight: 700, color: "#A0A8AE" });
  }
  function memInline(ctx, x, y, w, h, f, g = 1) {
    card(ctx, x, y, w, h, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 16 });
    text(ctx, "Ingatan", x + 20, y + h / 2 - 4, 28, { weight: 900, color: C.accentDark });
    text(ctx, "robot", x + 20, y + h / 2 + 28, 28, { weight: 900, color: C.accentDark });
    const s = h - 18, cx = x + w - s / 2 - 14, cy = y + h / 2;
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#C9B78E"; ctx.lineWidth = 3; rr(ctx, cx - s / 2, cy - s / 2, s, s, 10); ctx.fill(); ctx.stroke();
    if (f) flower(ctx, f, cx, cy + s * 0.42, s * 0.92, g);
    else text(ctx, "kosong", cx, cy + 8, 22, { align: "center", weight: 700, color: "#A0A8AE" });
  }
  function stepBar(ctx, st, opt = {}) {
    const y = opt.y || 150, x0 = opt.x || 70;
    const rd = st.round > 0 ? "Putaran " + st.round : "Mulai";
    text(ctx, rd, x0, y + 58, 40, { weight: 900, color: INK });
    for (let i = 0; i <= 5; i++) {
      const cx = x0 + 250 + i * 64, on = i === st.step;
      ctx.fillStyle = on ? ORANGE : "#E6EAED"; ctx.beginPath(); ctx.arc(cx, y + 45, 26, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i), cx, y + 56, 30, { align: "center", weight: 900, color: on ? "#fff" : "#6B7780" });
    }
    if (st.step >= 0) text(ctx, "Langkah " + st.step + ": " + STEP_TXT[st.step], x0 + 690, y + 56, 34, { weight: 800, color: INK, fit: opt.tw || 1060 });
    memBox(ctx, 1572, 270, 276, 300, st.mem, st.memG);
  }

  // ---------- adegan: soal ----------
  function soal(ctx, b, l) {
    board(ctx);
    const L = LM, s1 = b.id === "soal1", s2 = b.id === "soal2", s3 = b.id === "soal3";
    const st = { signs: {}, sa: {} };
    for (let i = 1; i <= 5; i++) { st.signs[i] = SIGNS[i]; st.sa[i] = s1 ? 0 : 1; }
    if (s2) {   // tanda muncul satu per satu sesuai nama bunga
      let from = b.text.indexOf("yaitu");
      for (let i = 1; i <= 5; i++) { const nm = FNAME[SIGNS[i]]; const k = b.text.indexOf(nm, from); from = k + nm.length; st.sa[i] = P(l, atI(b, k), 0.4); }
    }
    field(ctx, L, st, { numA: s1 ? P(l, at(b, "kita beri nomor"), 0.6) : 1, xa: s1 ? 0 : s2 ? P(l, at(b, "Lima petak lainnya"), 0.5) * 0 : 1 });
    robotAt(ctx, L, 0, l, s1 ? P(l, at(b, "sebuah robot"), 0.6) : 1);
    if (s1) hand(ctx, "robot penanam bunga", 360, 300, 38, { color: "#2E8E9B", align: "left", alpha: P(l, at(b, "sebuah robot"), 0.6) });
    if (s1) hand(ctx, "10 petak tanah", 960, 230, 52, { color: ORANGE, alpha: P(l, at(b, "sepuluh petak"), 0.6) });
    if (s2) {
      // legenda nama bunga
      ["O", "U", "R"].forEach((f, j) => {
        const k = b.text.indexOf(FNAME[f]); const a = P(l, atI(b, k), 0.5), x = 560 + j * 400;
        alpha(ctx, a, () => { flower(ctx, f, x, 300, 110); text(ctx, FNAME[f], x + 50, 280, 36, { weight: 900, color: FCOL[f] }); });
      });
      const u = P(l, at(b, "Lima petak lainnya"), 0.5);
      alpha(ctx, u, () => {
        ctx.save(); ctx.setLineDash([12, 9]); ctx.strokeStyle = "#16808F"; ctx.lineWidth = 5; rr(ctx, cxOf(L, 6) - L.pw * 0.48, 410, L.pw * 4.96, 330, 16); ctx.stroke(); ctx.restore();
        hand(ctx, "kosong: tanpa tanda, tanpa bunga", cxOf(L, 8), 500, 34, { color: "#16808F" });
      });
    }
    if (s3) {
      const u = P(l, at(b, "tanda silang"), 0.6);
      ring(ctx, cxOf(L, 5), L.soil + 26, 46, 34, u, ORANGE, 6);
      const u2 = P(l, at(b, "tempat robot mulai"), 0.6);
      alpha(ctx, u2, () => { mline(ctx, [[cxOf(L, 7) + 30, 300], [cxOf(L, 5) + 40, L.soil + 10]], 1, ORANGE, 6, true); hand(ctx, "X = tempat robot mulai", cxOf(L, 7) + 20, 280, 44, { align: "left" }); });
    }
  }

  // ---------- adegan: aturan ----------
  const RULES = [
    ["0", "Pergi ke tempat yang berlabel X."],
    ["↻", "Ulangi langkah 1–5, sampai tidak ada lagi petak yang bertanda."],
    ["1", "Jika ada tanda di tempat itu, tanamlah bunga yang ditunjukkan tanda itu."],
    ["2", "Ingatlah bunga yang baru saja ditanam."],
    ["3", "Hapus tandanya."],
    ["4", "Terus bergerak ke kanan sampai menemukan tempat kosong, lalu tanam bunga terakhir yang diingat di sana."],
    ["5", "Bergerak ke kiri sampai berada di tempat yang ada tandanya, atau sampai keluar dari hamparan bunga."],
  ];
  const RULE_AT = { soal4: [[0, "Langkah nol"], [1, "Lalu, ulangi"]], soal5: [[2, "Langkah satu"], [3, "Langkah dua"], [4, "Langkah tiga"]], soal6: [[5, "Langkah empat"], [6, "Langkah lima"]] };
  function aturan(ctx, b, l) {
    board(ctx);
    const ord = ["soal4", "soal5", "soal6"], k = ord.indexOf(b.id);
    // waktu tampil tiap baris
    const show = RULES.map(() => 0); let cur = -1;
    ord.forEach((id, j) => RULE_AT[id].forEach(([i, ph]) => { if (j < k) show[i] = 1; else if (j === k) { const a = P(l, at(b, ph), 0.5); show[i] = a; if (a > 0) cur = i; } }));
    let y = 150;
    RULES.forEach(([n, t], i) => {
      ctx.font = `700 32px ${K.FONT}`;
      const w = ctx.measureText(t).width, nl = w > 1540 ? 2 : 1, h = 18 + nl * 42;
      const a = 0.22 + 0.78 * show[i];
      alpha(ctx, a, () => {
        if (i === cur) { card(ctx, 90, y - 6, 1740, h + 4, { fill: "#FFF3E2", stroke: ORANGE, lw: 4, r: 14 }); }
        const isLoop = n === "↻";
        ctx.fillStyle = isLoop ? "#16808F" : n === "0" ? "#6B7780" : C.kiko; ctx.beginPath(); ctx.arc(150, y + 36, 27, 0, Math.PI * 2); ctx.fill();
        text(ctx, isLoop ? "↻" : n, 150, y + 48, 32, { align: "center", weight: 900, color: "#fff" });
        para(ctx, t, 200, y + 46, 32, 1580, { weight: i === 1 ? 800 : 700, color: isLoop ? "#16808F" : INK, lh: 1.3 });
      });
      y += h + (i === 1 ? 24 : 10);
      if (i === 1) { ctx.strokeStyle = "#C9D2D8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(120, y - 15); ctx.lineTo(1800, y - 15); ctx.stroke(); }
    });
  }

  // ---------- adegan: pilihan ----------
  const LO = (y) => ({ x0: 300, pw: 118, soil: y, fs: 92, numY: y + 50 });
  const OPT_Y = [322, 452, 582, 712];
  function options(ctx, opt = {}) {
    ["A", "B", "C", "D"].forEach((k, j) => {
      const L = LO(OPT_Y[j]);
      alpha(ctx, opt.dimRow && opt.dimRow(k) ? 0.3 : 1, () => {
        letter(ctx, k, 220, L.soil - 30, 34, opt.good === k);
        row(ctx, L, OPT[k], { dim: opt.dim ? (i => opt.dim(k, i)) : null });
      });
    });
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    text(ctx, "Seperti apa hamparan bunga setelah robot selesai menanam?", 960, 196, 42, { align: "center", weight: 900, color: INK, fit: 1700 });
    const a = b.id === "soal7" ? P(l, at(b, "Ada empat pilihan"), 0.6) : 1;
    alpha(ctx, a, () => options(ctx));
    if (b.id === "soal8") {
      const L = LO(0), u1 = P(l, at(b, "lima bunga pertama"), 0.5), u2 = P(l, at(b, "Perbedaannya"), 0.5);
      alpha(ctx, u1, () => { ctx.strokeStyle = GREEN; ctx.lineWidth = 6; rr(ctx, L.x0 - 6, 222, L.pw * 5 + 12, 534, 16); ctx.stroke(); hand(ctx, "sama", L.x0 + L.pw * 2.5, 796, 38, { color: GREEN }); });
      alpha(ctx, u2, () => { ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, L.x0 + L.pw * 5 + 6, 222, L.pw * 5 - 6, 534, 16); ctx.stroke(); ctx.restore(); hand(ctx, "berbeda", L.x0 + L.pw * 7.5, 796, 38); });
      kiko(ctx, 1700, 520, 150, 0, { mood: "happy" });
    }
  }

  // ---------- adegan: memahami aturan ----------
  function paham(ctx, b, l) {
    board(ctx);
    if (b.id === "m1") {
      const L = { x0: 0, pw: 300, soil: 640, fs: 210, sTop: 250, sSize: 140, numY: 0 };
      const X = [420, 960, 1500];
      X.forEach((x, j) => {
        const LL = Object.assign({}, L, { x0: x - 150 });
        soil(ctx, LL, 1);
        if (j === 0) sign(ctx, LL, 1, "U");
        if (j === 1) flower(ctx, "R", x, L.soil + 24, L.fs);
      });
      const uE = P(l, at(b, "Petak kosong adalah"), 0.5), uS = P(l, at(b, "tidak punya tanda"), 0.5), uF = P(l, at(b, "sudah ditanami"), 0.5);
      alpha(ctx, uE, () => { hand(ctx, "tanpa tanda, tanpa bunga", X[2], 780, 34, { color: GREEN }); tick(ctx, X[2], 420, 110, uE, GREEN, 12); text(ctx, "KOSONG", X[2], 300, 44, { align: "center", weight: 900, color: GREEN }); });
      alpha(ctx, uS, () => { hand(ctx, "ada tanda: bukan kosong", X[0], 780, 34, { color: RED }); });
      alpha(ctx, uF, () => { hand(ctx, "ada bunga: bukan kosong", X[1], 780, 34, { color: RED }); cross(ctx, X[1] + 130, 300, 70, uF, RED, 10); });
      if (uS > 0) cross(ctx, X[0] + 130, 300, 70, uS, RED, 10);
    } else if (b.id === "m2") {
      robot(ctx, 640, 470, 300, l, { pointer: false });
      const u = P(l, at(b, "mengingat satu bunga"), 0.6);
      memBox(ctx, 1000, 250, 420, 400, u > 0 ? "U" : null, u);
      const u2 = P(l, at(b, "di dalam kotak"), 0.6);
      alpha(ctx, u2, () => { mline(ctx, [[1640, 300], [1440, 380]], 1, ORANGE, 6, true); hand(ctx, "ingatan robot", 1600, 280, 40, { align: "left" }); hand(ctx, "(hanya 1 bunga)", 1600, 330, 32, { align: "left", color: INK }); });
    } else if (b.id === "m3") {
      const L = LM; field(ctx, L, { signs: SIGNS });
      robotAt(ctx, L, 5, l);
      const u4 = P(l, at(b, "ke kanan"), 0.6), u5 = P(l, at(b, "ke kiri"), 0.6);
      mline(ctx, [[cxOf(L, 5) + 70, 250], [cxOf(L, 9), 250]], u4, GREEN, 9, true);
      hand(ctx, "langkah 4: ke kanan, lalu tanam", cxOf(L, 7.5) + 20, 220, 36, { color: GREEN, alpha: u4 });
      mline(ctx, [[cxOf(L, 5) - 70, 250], [cxOf(L, 1), 250]], u5, BLUE, 9, true);
      hand(ctx, "langkah 5: ke kiri, cari tanda", cxOf(L, 3) - 20, 220, 36, { color: BLUE, alpha: u5 });
    } else if (b.id === "m4") {
      const L = LM; field(ctx, L, { signs: SIGNS });
      for (let i = 1; i <= 5; i++) {
        const a = P(l, at(b, "satu tanda") + i * 0.35, 0.3);
        alpha(ctx, a, () => { ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(cxOf(L, i), 330, 30, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i), cxOf(L, i), 342, 34, { align: "center", weight: 900, color: "#fff" }); });
      }
      hand(ctx, "1 putaran = 1 tanda dihapus", 1340, 250, 40, { color: INK, alpha: P(l, at(b, "Setiap putaran"), 0.5) });
      hand(ctx, "5 tanda = 5 putaran", 1340, 330, 52, { alpha: P(l, at(b, "lima putaran"), 0.5) });
    } else {   // m5: pikirkan dulu
      const L = LM;
      field(ctx, L, { signs: SIGNS }); robotAt(ctx, L, 0, l);
      thinkBadge(ctx, 520, 175, 880, 120, l, b.dur, "Jalankan robotnya sendiri di kertas.");
    }
  }

  // ---------- adegan: simulasi ----------
  function simDraw(ctx, b, l, L, opt = {}) {
    const st = simAt(b, l);
    field(ctx, L, { signs: st.signs, del: st.del, fl: st.fl, grow: st.grow });
    // sorot petak yang sedang dikerjakan
    if (st.ev && st.f > 0 && st.f < 1 && (st.ev.k === "plant" || st.ev.k === "erase")) plotRing(ctx, L, st.ev.at, 1);
    const out = b.id === "r6" && st.pos < 0.5 ? 1 - st.pos * 2 : 0;
    if (b.id !== "r7" && b.id !== "r7b") robotAt(ctx, L, st.pos - out * 0.6, l, 1 - out * 0.65);
    return st;
  }
  function sim(ctx, b, l) {
    board(ctx);
    const L = LM, st = simDraw(ctx, b, l, L);
    stepBar(ctx, b.id === "r7" || b.id === "r7b" ? { step: -1, round: 5, mem: st.mem, memG: 1 } : st);
    if (b.id === "r6") hand(ctx, "keluar", 150, 500, 40, { color: BLUE, alpha: P(l, at(b, "sampai keluar"), 0.5) });
    if (b.id === "r7") hand(ctx, "SELESAI: semua tanda sudah dihapus", 960, 330, 48, { color: GREEN, alpha: P(l, 0.3, 0.6) });
    if (b.id === "r7b") {
      hand(ctx, "baca dari kiri ke kanan", 960, 330, 44, { color: INK });
      mline(ctx, [[cxOf(L, 3), 352], [cxOf(L, 8), 352]], 1, ORANGE, 6, true);
      let from = b.text.indexOf("yaitu");
      for (let i = 1; i <= 10; i++) {
        const nm = FNAME[FINAL[i - 1]], k = b.text.indexOf(nm, from); from = k + nm.length;
        const t0 = atI(b, k), t1 = i < 10 ? atI(b, b.text.indexOf(FNAME[FINAL[i]], from)) : 1e9;
        const a = P(l, t0, 0.25);
        if (a > 0) { if (l < t1) plotRing(ctx, L, i, a, ORANGE); else alpha(ctx, 0.5, () => plotRing(ctx, L, i, 1, "#9AA4AC")); }
      }
    }
  }

  // ---------- adegan: jawaban ----------
  function jawab(ctx, b, l) {
    board(ctx);
    const LR = { x0: 300, pw: 118, soil: 262, fs: 92, numY: 0 };
    text(ctx, "hasil", 225, 214, 28, { align: "center", weight: 900, color: GREEN }); text(ctx, "robot", 225, 246, 28, { align: "center", weight: 900, color: GREEN });
    row(ctx, LR, FINAL);
    ctx.strokeStyle = GREEN; ctx.lineWidth = 4; rr(ctx, LR.x0 - 10, 150, LR.pw * 10 + 20, 140, 14); ctx.stroke();
    ctx.strokeStyle = "#C9D2D8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(100, 312); ctx.lineTo(1820, 312); ctx.stroke();
    const Y = [412, 542, 672, 802];
    const u = b.id === "j1" ? P(l, at(b, "sama persis"), 0.6) : 1;
    ["A", "B", "C", "D"].forEach((k, j) => {
      const L = { x0: 300, pw: 118, soil: Y[j], fs: 86 };
      letter(ctx, k, 220, L.soil - 28, 32, k === "A" && b.id === "j2");
      row(ctx, L, OPT[k]);
      if (k === "A") {
        for (let i = 1; i <= 10; i++) { const a = clamp(u * 10 - (i - 1), 0, 1); if (a > 0) tick(ctx, cxOf(L, i) + 40, L.soil - 90, 34, a, GREEN, 6); }
        if (u >= 1) hand(ctx, "= hasil robot", 1560, L.soil - 26, 40, { color: GREEN, align: "left" });
      }
    });
    if (b.id === "j2") { const u2 = P(l, 0.2, 0.6); alpha(ctx, u2, () => { ctx.strokeStyle = GREEN; ctx.lineWidth = 7; rr(ctx, 170, Y[0] - 118, 1340, 160, 18); ctx.stroke(); }); hand(ctx, "Jawaban: A", 1680, 620, 52, { color: GREEN, alpha: P(l, 0.4, 0.5) }); }
  }

  // ---------- adegan: memeriksa pilihan lain ----------
  function count(str, f) { let n = 0; for (const c of str) if (c === f) n++; return n; }
  function cek(ctx, b, l) {
    board(ctx);
    if (b.id === "x1") {
      const L = { x0: 360, pw: 200, soil: 640, fs: 170, sTop: 200, sSize: 120, numY: 720 };
      soil(ctx, L, 7);
      const u0 = P(l, at(b, "Setiap tanda"), 0.5), u1 = P(l, at(b, "satu di tempat tanda"), 0.5), u2 = P(l, at(b, "satu lagi di sebelah kanan"), 0.5);
      sign(ctx, L, 2, "U", u0, 0);
      flower(ctx, "U", cxOf(L, 2), L.soil + 16, L.fs, u1);
      flower(ctx, "U", cxOf(L, 6), L.soil + 16, L.fs, u2);
      hand(ctx, "di tempat tanda", cxOf(L, 2), 790, 36, { color: GREEN, alpha: u1 });
      hand(ctx, "di sebelah kanan", cxOf(L, 6), 790, 36, { color: GREEN, alpha: u2 });
      alpha(ctx, u2, () => mline(ctx, [[cxOf(L, 2) + 70, 380], [cxOf(L, 4), 330], [cxOf(L, 6) - 40, 450]], 1, ORANGE, 6, true));
      hand(ctx, "1 tanda → 2 bunga yang sama", 1340, 250, 44, { alpha: u2 });
    } else if (b.id === "x2") {
      const R = [["O", "dua tanda tulip oranye", "empat tulip oranye", 2], ["U", "dua tanda bunga ungu", "empat bunga ungu", 2], ["R", "satu tanda mawar merah", "dua mawar merah", 1]];
      text(ctx, "tanda", 560, 200, 34, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "bunga di hasil akhir", 1330, 200, 34, { align: "center", weight: 900, color: C.ink2 });
      R.forEach(([f, p1, p2, n], j) => {
        const y = 250 + j * 190, a1 = P(l, at(b, p1), 0.5), a2 = P(l, at(b, p2), 0.5);
        alpha(ctx, a1, () => { for (let q = 0; q < n; q++) { const x = 460 + q * 130; ctx.fillStyle = "#E3E3E3"; ctx.fillRect(x - 50, y, 100, 100); ctx.strokeStyle = "#4A453C"; ctx.lineWidth = 6; ctx.strokeRect(x - 50, y, 100, 100); ficon(ctx, f, x, y + 50, 90); } text(ctx, "× 2", 790, y + 66, 46, { align: "center", weight: 900, color: ORANGE }); });
        alpha(ctx, a2, () => { mline(ctx, [[860, y + 50], [960, y + 50]], 1, ORANGE, 7, true); for (let q = 0; q < 2 * n; q++) flower(ctx, f, 1040 + q * 120, y + 120, 120); text(ctx, String(2 * n), 1560, y + 70, 60, { align: "center", weight: 900, color: FCOL[f] }); });
      });
    } else if (b.id === "x3") {
      // fokus pada pilihan C: hitung mawar merah dan tulip oranye
      const L = { x0: 360, pw: 136, soil: 560, fs: 120, numY: 620 };
      text(ctx, "Harus ada: 4 tulip oranye, 4 bunga ungu, 2 mawar merah", 960, 200, 38, { align: "center", weight: 900, color: INK, fit: 1600 });
      letter(ctx, "C", 270, L.soil - 40, 40);
      row(ctx, L, OPT.C, { nums: true });
      const uR = P(l, at(b, "tiga mawar merah"), 0.5), uO = P(l, at(b, "tiga tulip oranye"), 0.5), uX = P(l, at(b, "pasti salah"), 0.5);
      let nr = 0, no = 0;
      for (let i = 1; i <= 10; i++) {
        const f = OPT.C[i - 1], x = cxOf(L, i);
        const badge = (n, col, a) => alpha(ctx, a, () => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, 330, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(n), x, 342, 32, { align: "center", weight: 900, color: "#fff" }); });
        if (f === "R") { nr++; badge(nr, RED, clamp(uR * 3 - (nr - 1), 0, 1)); }
        if (f === "O") { no++; badge(no, ORANGE, clamp(uO * 3 - (no - 1), 0, 1)); }
      }
      hand(ctx, "3 mawar merah, padahal harus 2", 960, 700, 38, { color: RED, alpha: uR });
      hand(ctx, "3 tulip oranye, padahal harus 4", 960, 752, 38, { color: ORANGE, alpha: uO });
      cross(ctx, 270, L.soil - 40, 110, uX, RED, 12);
      if (count(OPT.C, "R") !== 3 || count(OPT.C, "O") !== 3) (K._warn = K._warn || []).push("hitungan C berubah");
    } else {
      // x4: petak 6 harus bunga ungu
      text(ctx, "Petak 6 harus bunga ungu", 960, 196, 42, { align: "center", weight: 900, color: INK });
      options(ctx, { dimRow: k => k === "C" });
      cross(ctx, 220, OPT_Y[2] - 30, 90, 1, RED, 10);
      const L = LO(0), x = cxOf(L, 6), u1 = P(l, at(b, "petak enam"), 0.5), u2 = P(l, at(b, "keduanya juga salah"), 0.5), uU = P(l, at(b, "harus bunga ungu"), 0.5);
      alpha(ctx, u1, () => { ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, x - L.pw * 0.5, 226, L.pw, 530, 14); ctx.stroke(); hand(ctx, "petak 6", x, 796, 36); });
      [["A", OPT_Y[0]], ["B", OPT_Y[1]], ["D", OPT_Y[3]]].forEach(([k, y]) => {
        if (OPT[k][5] === "U") { tick(ctx, 1560, y - 40, 50, uU, GREEN, 8); hand(ctx, "bunga ungu", 1600, y - 28, 32, { color: GREEN, align: "left", alpha: uU }); }
        else { cross(ctx, 1560, y - 40, 50, P(l, at(b, "Pilihan B dan D"), 0.5), RED, 8); hand(ctx, "tulip oranye", 1600, y - 28, 32, { color: RED, align: "left", alpha: P(l, at(b, "Pilihan B dan D"), 0.5) }); cross(ctx, 220, y - 30, 90, u2, RED, 10); }
      });
      if (OPT.B[5] !== "O" || OPT.D[5] !== "O" || OPT.A[5] !== "U") (K._warn = K._warn || []).push("petak 6 berubah");
    }
  }

  // ---------- adegan: pola cermin ----------
  function cermin(ctx, b, l) {
    board(ctx);
    const L = { x0: 360, pw: 120, soil: 540, fs: 104, numY: 606 };
    row(ctx, L, FINAL, { nums: true });
    const mx = L.x0 + L.pw * 5;
    if (b.id === "x5") {
      const u = P(l, at(b, "urutan terbalik"), 0.5);
      for (let k = 1; k <= 5; k++) {
        const a = clamp(u * 5 - (k - 1), 0, 1), xl = cxOf(L, 6 - k), xr = cxOf(L, 5 + k);
        if (a <= 0) continue;
        ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = FCOL[FINAL[5 - k]]; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(xl, 420); ctx.quadraticCurveTo((xl + xr) / 2, 420 - 50 - k * 38, xr, 420); ctx.stroke(); ctx.restore();
      }
      const um = P(l, at(b, "cermin"), 0.5);
      alpha(ctx, um, () => { ctx.save(); ctx.setLineDash([16, 10]); ctx.strokeStyle = BLUE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(mx, 170); ctx.lineTo(mx, 640); ctx.stroke(); ctx.restore(); hand(ctx, "cermin", mx, 690, 44, { color: BLUE }); });
      hand(ctx, "kiri", cxOf(L, 3), 760, 40, { color: INK, alpha: P(l, 0.3, 0.5) }); hand(ctx, "kanan (terbalik)", cxOf(L, 8), 760, 40, { color: INK, alpha: u });
    } else {
      const u1 = P(l, at(b, "membaca tanda"), 0.6), u2 = P(l, at(b, "menanam salinannya"), 0.6);
      // urutan dibaca: petak 5,4,3,2,1 ; urutan ditanam: 6..10
      for (let k = 1; k <= 5; k++) {
        const a1 = clamp(u1 * 5 - (k - 1), 0, 1), a2 = clamp(u2 * 5 - (k - 1), 0, 1);
        alpha(ctx, a1, () => { ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(cxOf(L, 6 - k), 330, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, String(k), cxOf(L, 6 - k), 341, 30, { align: "center", weight: 900, color: "#fff" }); });
        alpha(ctx, a2, () => { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(cxOf(L, 5 + k), 330, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, String(k), cxOf(L, 5 + k), 341, 30, { align: "center", weight: 900, color: "#fff" }); });
      }
      mline(ctx, [[cxOf(L, 5) + 20, 260], [cxOf(L, 1) - 20, 260]], u1, BLUE, 7, true); hand(ctx, "dibaca: dari kanan ke kiri", cxOf(L, 3), 230, 34, { color: BLUE, alpha: u1 });
      mline(ctx, [[cxOf(L, 6) - 20, 260], [cxOf(L, 10) + 20, 260]], u2, GREEN, 7, true); hand(ctx, "ditanam: dari kiri ke kanan", cxOf(L, 8), 230, 34, { color: GREEN, alpha: u2 });
      ctx.save(); ctx.setLineDash([16, 10]); ctx.strokeStyle = "#9AA4AC"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(mx, 190); ctx.lineTo(mx, 620); ctx.stroke(); ctx.restore();
      if (b.id === "x7") {
        const ua = P(l, at(b, "paling akhir"), 0.5);
        alpha(ctx, ua, () => { ring(ctx, cxOf(L, 1), 330, 44, 40, 1, ORANGE, 5); ring(ctx, cxOf(L, 10), 330, 44, 40, 1, ORANGE, 5); hand(ctx, "dibaca terakhir → ditanam paling kanan", 960, 175, 34, { alpha: ua }); });
        const uB = P(l, at(b, "Pilihan B"), 0.5);
        alpha(ctx, uB, () => {
          const LB = { x0: 360, pw: 120, soil: 770, fs: 96 };
          letter(ctx, "B", 280, LB.soil - 28, 32); row(ctx, LB, OPT.B);
          hand(ctx, "hanya disalin, tidak dibalik", 360 + 120 * 7.5, 652, 32, { color: RED });
          ctx.save(); ctx.setLineDash([12, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 5; rr(ctx, LB.x0 + LB.pw * 5 + 4, 660, LB.pw * 5 - 8, 140, 12); ctx.stroke(); ctx.restore();
        });
        cross(ctx, 280, 742, 80, P(l, at(b, "tanpa membaliknya"), 0.5), RED, 9);
      }
    }
  }

  // ---------- adegan: komputer ----------
  function komputer(ctx, b, l) {
    board(ctx);
    if (b.id === "c1") {
      const W = ["B", "U", "N", "G", "A"], s = 120, x0 = 560, ya = 250, yb = 560;
      text(ctx, "data", 450, ya + 78, 36, { align: "right", weight: 900, color: C.ink2 });
      text(ctx, "hasil", 450, yb + 78, 36, { align: "right", weight: 900, color: C.ink2 });
      const u = P(l, at(b, "membaca data dari belakang"), 0.5), T = u > 0 ? (l - at(b, "membaca data dari belakang")) / 0.9 : -1;
      W.forEach((c, i) => {
        card(ctx, x0 + i * (s + 20), ya, s, s, { fill: "#EAF2FB", stroke: BLUE, lw: 4, r: 14 });
        text(ctx, c, x0 + i * (s + 20) + s / 2, ya + 84, 64, { align: "center", weight: 900, color: INK });
      });
      for (let j = 0; j < 5; j++) {
        const a = clamp(T - j, 0, 1), src = 4 - j;
        card(ctx, x0 + j * (s + 20), yb, s, s, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 14 });
        if (a > 0) {
          alpha(ctx, a, () => { card(ctx, x0 + j * (s + 20), yb, s, s, { fill: "#E6F5EA", stroke: GREEN, lw: 4, r: 14 }); text(ctx, W[src], x0 + j * (s + 20) + s / 2, yb + 84, 64, { align: "center", weight: 900, color: INK }); });
          if (a < 1 || T - j < 1.4) mline(ctx, [[x0 + src * (s + 20) + s / 2, ya + s + 10], [x0 + j * (s + 20) + s / 2, yb - 12]], 1, ORANGE, 6, true);
        }
      }
      hand(ctx, "dibaca dari belakang", 1350, ya + 80, 34, { color: BLUE, align: "left", alpha: u });
      hand(ctx, "ditulis dari depan", 1350, yb + 80, 34, { color: GREEN, align: "left", alpha: P(l, at(b, "menuliskannya dari depan"), 0.5) });
    } else {
      // tabel jejak dari simulasi
      text(ctx, "Catatan jejak robot", 960, 200, 44, { align: "center", weight: 900, color: INK });
      const cols = [["Putaran", 380], ["Petak tanda", 720], ["Ingatan", 1060], ["Petak tanam", 1400]];
      cols.forEach(([h, x]) => text(ctx, h, x, 270, 34, { align: "center", weight: 900, color: C.accentDark }));
      ctx.strokeStyle = "#C9D2D8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(220, 290); ctx.lineTo(1560, 290); ctx.stroke();
      const rows = []; EV.forEach(e => { if (e.k === "plant" && e.step === 1) rows.push({ r: e.round, at: e.at, f: e.f }); if (e.k === "plant" && e.step === 4) rows[rows.length - 1].to = e.at; });
      const u = P(l, at(b, "sambil mencatat"), 0.5);
      rows.forEach((rw, i) => {
        const y = 350 + i * 92, a = clamp(u * 5 - i, 0, 1);
        alpha(ctx, a, () => {
          text(ctx, String(rw.r), 380, y, 40, { align: "center", weight: 900, color: INK });
          text(ctx, String(rw.at), 720, y, 40, { align: "center", weight: 900, color: BLUE });
          flower(ctx, rw.f, 1060, y + 20, 80);
          text(ctx, String(rw.to), 1400, y, 40, { align: "center", weight: 900, color: GREEN });
        });
      });
      robot(ctx, 1730, 480, 170, l, { pointer: false });
    }
  }

  // ---------- adegan: tiga langkah ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Pahami arti setiap langkah aturan.", "Jalankan algoritmanya, catat posisi dan ingatan.", "Cari pola untuk memeriksa jawaban."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 48, { weight: 900, color: INK, fit: 1120 });
        const ix = 1560, iy = y + 80;
        if (i === 0) { ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(ix + 20, iy, 30, 0, Math.PI * 2); ctx.fill(); text(ctx, "4", ix + 20, iy + 12, 34, { align: "center", weight: 900, color: "#fff" }); mline(ctx, [[ix + 70, iy], [ix + 160, iy]], 1, GREEN, 7, true); }
        if (i === 1) { robot(ctx, ix + 30, iy + 4, 90, l, { pointer: false }); memBox(ctx, ix + 80, iy - 70, 110, 140, "U", 1, "ingat"); }
        if (i === 2) { const LL = { x0: ix - 20, pw: 20, soil: iy + 30, fs: 40 }; for (let q = 1; q <= 10; q++) flower(ctx, FINAL[q - 1], cxOf(LL, q), LL.soil, 40); ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LL.x0 + 100, iy - 50); ctx.lineTo(LL.x0 + 100, iy + 40); ctx.stroke(); ctx.restore(); }
      });
    });
  }

  // ---------- bendera Slowakia ----------
  function flagSK(ctx, x, y, w) {   // putih, biru, merah (atas ke bawah) + lambang: salib ganda putih di atas tiga bukit biru, perisai merah
    const h = w * 2 / 3;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h / 3 + 0.5);
    ctx.fillStyle = "#0B4EA2"; ctx.fillRect(x, y + h / 3, w, h / 3 + 0.5);
    ctx.fillStyle = "#EE1C25"; ctx.fillRect(x, y + h * 2 / 3, w, h / 3);
    const sx = x + w * 0.36, sy = y + h * 0.2, sw = w * 0.26, sh = h * 0.62;
    const shield = () => { ctx.beginPath(); ctx.moveTo(sx - sw / 2, sy); ctx.lineTo(sx + sw / 2, sy); ctx.lineTo(sx + sw / 2, sy + sh * 0.6); ctx.quadraticCurveTo(sx + sw / 2, sy + sh * 0.92, sx, sy + sh); ctx.quadraticCurveTo(sx - sw / 2, sy + sh * 0.92, sx - sw / 2, sy + sh * 0.6); ctx.closePath(); };
    ctx.fillStyle = "#FFFFFF"; ctx.save(); ctx.translate(sx, sy + sh / 2); ctx.scale(1.12, 1.07); ctx.translate(-sx, -(sy + sh / 2)); shield(); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#EE1C25"; shield(); ctx.fill();
    ctx.save(); shield(); ctx.clip(); ctx.fillStyle = "#0B4EA2";
    for (const [dx, r] of [[-0.3, 0.2], [0.3, 0.2], [0, 0.24]]) { ctx.beginPath(); ctx.arc(sx + dx * sw, sy + sh * 1.0, r * sw * 1.2, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = "#FFFFFF"; const cw = sw * 0.09;
    ctx.fillRect(sx - cw / 2, sy + sh * 0.12, cw, sh * 0.62);
    ctx.fillRect(sx - sw * 0.2, sy + sh * 0.26, sw * 0.4, cw); ctx.fillRect(sx - sw * 0.27, sy + sh * 0.42, sw * 0.54, cw);
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- versi tegak untuk Short (area ±1000×700, x 460–1460) ----------
  const LV = { x0: 482, pw: 95.6, soil: 640, fs: 76, sTop: 452, sSize: 60, numY: 712, rY: 370 };
  function soal_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Robot menanam bunga di 10 petak.", 960, 205, 40, { align: "center", weight: 900, color: INK, fit: 980 });
    field(ctx, LV, { signs: SIGNS }); robotAt(ctx, LV, 0, l);
    hand(ctx, "5 tanda bunga", cxOf(LV, 3), 300, 34, { alpha: P(l, at(b, "tanda bunga"), 0.5) });
    alpha(ctx, P(l, at(b, "berlabel X"), 0.5), () => { ring(ctx, cxOf(LV, 5), LV.soil + 16, 32, 24, 1, ORANGE, 5); hand(ctx, "mulai di X", cxOf(LV, 7.5), 300, 34, { color: ORANGE }); });
    hand(ctx, "kosong", cxOf(LV, 8), 560, 30, { color: "#16808F", alpha: P(l, at(b, "lima petak lainnya"), 0.5) });
  }
  function aturan_v(ctx, b, l) {
    board(ctx);
    const R = [["1–3", "Tanam bunga sesuai tanda, ingat bunganya, lalu hapus tandanya.", "Di setiap putaran"], ["4", "Ke kanan sampai petak kosong, lalu tanam bunga yang diingat.", "Kemudian"], ["5", "Ke kiri sampai ada tanda lagi.", "Setelah itu"]];
    R.forEach(([n, t, ph], i) => {
      const y = 170 + i * 175, a = P(l, at(b, ph), 0.5);
      alpha(ctx, 0.25 + 0.75 * a, () => {
        card(ctx, 475, y, 970, 155, { fill: "#F7F9FA", stroke: "#B8C3CA", lw: 2.5, r: 16 });
        ctx.fillStyle = C.kiko; rr(ctx, 495, y + 45, 100, 64, 32); ctx.fill();
        text(ctx, n, 545, y + 90, 34, { align: "center", weight: 900, color: "#fff" });
        para(ctx, t, 625, y + 66, 36, 800, { weight: 800, color: INK, lh: 1.25 });
      });
    });
    const u = P(l, 0.2, 0.5);
    alpha(ctx, u, () => { mline(ctx, [[1150, 740], [1400, 740]], 1, GREEN, 8, true); mline(ctx, [[770, 740], [520, 740]], 1, BLUE, 8, true); robot(ctx, 960, 720, 100, l, { pointer: false }); });
  }
  function pilihan_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Seperti apa hasilnya?", 960, 200, 42, { align: "center", weight: 900, color: INK });
    ["A", "B", "C", "D"].forEach((k, j) => {
      const L = { x0: 560, pw: 88, soil: 340 + j * 140, fs: 70 };
      letter(ctx, k, 510, L.soil - 22, 28); row(ctx, L, OPT[k]);
    });
  }
  function sim_v(ctx, b, l) {
    board(ctx);
    const st = simDraw(ctx, b, l, LV);
    text(ctx, st.round > 0 ? "Putaran " + st.round : "Mulai", 480, 210, 38, { weight: 900, color: INK });
    if (st.step >= 0) para(ctx, "Langkah " + st.step + ": " + STEP_TXT[st.step], 480, 262, 30, 690, { weight: 800, color: INK, lh: 1.2 });
    memBox(ctx, 1200, 170, 250, 190, st.mem, st.memG, "Ingatan");
  }
  function hasil_v(ctx, b, l) {
    board(ctx);
    const L = { x0: 482, pw: 95.6, soil: 480, fs: 80, numY: 530 };
    row(ctx, L, FINAL, { nums: true });
    const mx = L.x0 + L.pw * 5, u = P(l, at(b, "urutan terbalik"), 0.5);
    for (let k = 1; k <= 5; k++) {
      const a = clamp(u * 5 - (k - 1), 0, 1), xl = cxOf(L, 6 - k), xr = cxOf(L, 5 + k);
      if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = FCOL[FINAL[5 - k]]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(xl, 375); ctx.quadraticCurveTo((xl + xr) / 2, 345 - k * 30, xr, 375); ctx.stroke(); ctx.restore(); }
    }
    alpha(ctx, P(l, at(b, "bayangan cermin"), 0.5), () => { ctx.save(); ctx.setLineDash([12, 8]); ctx.strokeStyle = BLUE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(mx, 180); ctx.lineTo(mx, 560); ctx.stroke(); ctx.restore(); hand(ctx, "cermin", mx, 600, 36, { color: BLUE }); });
    const ua = P(l, at(b, "jawabannya adalah A"), 0.5);
    alpha(ctx, ua, () => { letter(ctx, "A", 760, 715, 44, true); hand(ctx, "Jawaban: A", 1000, 732, 56, { color: GREEN }); });
  }

  Object.assign(K.SCENES, {
    soal, aturan, pilihan, paham, sim, jawab, cek, cermin, komputer, langkah, soal_v, aturan_v, pilihan_v, sim_v, hasil_v,
    buka(ctx, b, l) {
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
      const fu = P(l, at(b, "Slowakia"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagSK(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Slowakia"), 0.8);
      if (au > 0) ring(ctx, 1180, 300 + 2 * 92 - 14, 210, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 470, 200, 0, { wave: l, mood: "happy" });
      [640, 860].forEach((x, i) => beaver(ctx, x, 430 + Math.sin(l * 3 + i) * 8, 150));
      const LL = { x0: 150, pw: 88, soil: 740, fs: 76 }; row(ctx, LL, FINAL);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const Lr = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      Lr.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 760, 620, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Robot bekerja langkah demi langkah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
