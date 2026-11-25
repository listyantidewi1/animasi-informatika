/* PNG04 Pembahasan Soal Bebras 2025-ID-03 "Pesan Rahasia" (Indonesia), kategori Penggalang (SMP).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras) + simulasi: tabel huruf-bilangan, baris 9 kotak
   (bagian pertama 5 kotak = hasil bagi 5, bagian kedua 4 kotak = sisa bagi), contoh BEBRAS, pesan 5 baris, analogi kantong kelereng.
   Jawaban dihitung ulang di kode (ANS harus RADIO) dan dilaporkan lewat K._warn bila salah.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Pesan Rahasia", tahun: "2025", negara: "Indonesia", kode: "2025-ID-03" };

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
  function computer(ctx, x, y, s, col = "#2B3440") {
    ctx.fillStyle = col; rr(ctx, x - s * 0.5, y - s * 0.38, s, s * 0.62, s * 0.06); ctx.fill();
    ctx.fillStyle = "#BFE3F2"; rr(ctx, x - s * 0.42, y - s * 0.31, s * 0.84, s * 0.48, s * 0.03); ctx.fill();
    ctx.fillStyle = col; ctx.fillRect(x - s * 0.08, y + s * 0.24, s * 0.16, s * 0.12); rr(ctx, x - s * 0.28, y + s * 0.34, s * 0.56, s * 0.07, s * 0.03); ctx.fill();
  }
  function flagID(ctx, x, y, w) {   // bendera Indonesia: merah di atas, putih di bawah
    const h = w * 0.66;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#E12A2A"; ctx.fillRect(x, y, w, h / 2);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y + h / 2, w, h / 2);
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }
  function letter(ctx, L, cx, cy, r, good) {
    ctx.fillStyle = good ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, cx, cy + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
  }

  // ---------- kode soal ----------
  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const num = ch => ABC.indexOf(ch) + 1;
  const enc = ch => { const n = num(ch); return [Math.floor(n / 5), n % 5]; };   // [kotak bagian pertama, kotak bagian kedua], 0 = kosong
  const dec = ([q, r]) => ABC[5 * q + r - 1];
  const MSG = [[3, 3], [0, 1], [0, 4], [1, 4], [3, 0]];   // pesan di soal, dibaca dari gambar soal yang diperbesar
  const EX = "BEBRAS".split("").map(enc);
  const ANS = MSG.map(dec).join("");
  if (ANS !== "RADIO") (K._warn = K._warn || []).push("jawaban salah: " + ANS);
  if ("RADIO".split("").map(enc).join("|") !== MSG.join("|")) (K._warn = K._warn || []).push("RADIO tidak cocok");
  const BLUE = "#2F6FD0", OR2 = "#C25E00";

  // grid baris kode: rows = [[q, r], ...]; y = tepi atas baris pertama (judul kolom di atasnya)
  function grid(ctx, x, y, c, rows, o = {}) {
    const g = c * 0.2, hc = Math.max(c * 0.62, 44), col = j => x + j * c + (j >= 5 ? g : 0), W = 9 * c + g, top = y - 2 * hc;
    ctx.lineWidth = 2; ctx.strokeStyle = "#B8C3CA";
    if (o.head !== false) {
      [[0, 5, "pertama (i)"], [5, 9, "kedua (ii)"]].forEach(([a, z, s], k) => {
        const x0 = col(a), x1 = col(z - 1) + c;
        ctx.fillStyle = k ? "#E3ECF8" : "#FDEBD7"; ctx.fillRect(x0, top, x1 - x0, hc); ctx.strokeRect(x0, top, x1 - x0, hc);
        text(ctx, s, (x0 + x1) / 2, top + hc * 0.72, Math.max(hc * 0.5, 26), { align: "center", weight: 900, color: k ? BLUE : OR2, fit: x1 - x0 - 10 });
      });
      for (let j = 0; j < 9; j++) {
        const cx = col(j); ctx.fillStyle = "#F3F6F8"; ctx.fillRect(cx, top + hc, c, hc); ctx.strokeRect(cx, top + hc, c, hc);
        text(ctx, String(j < 5 ? j + 1 : j - 4), cx + c / 2, top + hc * 1.72, Math.max(hc * 0.56, 26), { align: "center", weight: 800, color: INK });
      }
    }
    rows.forEach(([q, r], i) => {
      const a = o.show ? o.show(i) : 1; if (a <= 0) return;
      alpha(ctx, a, () => {
        const yy = y + i * c;
        for (let j = 0; j < 9; j++) {
          const cx = col(j); ctx.fillStyle = "#fff"; ctx.fillRect(cx, yy, c, c); ctx.strokeStyle = "#B8C3CA"; ctx.lineWidth = 2; ctx.strokeRect(cx, yy, c, c);
          const on = j < 5 ? q === j + 1 : r === j - 4;
          const f = on ? (o.fill ? o.fill(i, j < 5 ? 0 : 1) : 1) : 0;
          if (f > 0) { const s = (c - 8) * clamp(f, 0, 1); ctx.fillStyle = "#151515"; ctx.fillRect(cx + c / 2 - s / 2, yy + c / 2 - s / 2, s, s); }
        }
        if (o.labels) text(ctx, o.labels[i], x - c * 0.5, yy + c * 0.7, c * 0.55, { align: "center", weight: 900, color: o.labelColor ? o.labelColor(i) : INK });
      });
    });
    return { col, W, top, c, g, x, y, rowY: i => y + i * c, cx: j => col(j) + c / 2, part: k => k ? [col(5), col(8) + c] : [col(0), col(4) + c] };
  }
  function rowBox(ctx, G, i, u, color = ORANGE) {
    if (u <= 0) return; alpha(ctx, u, () => { ctx.strokeStyle = color; ctx.lineWidth = 7; rr(ctx, G.x - 8, G.rowY(i) - 8, G.W + 16, G.c + 16, 10); ctx.stroke(); });
  }
  function partBox(ctx, G, k, y0, y1, u, color) {
    if (u <= 0) return; const [a, z] = G.part(k);
    alpha(ctx, u, () => { ctx.strokeStyle = color; ctx.lineWidth = 7; rr(ctx, a - 7, y0 - 7, z - a + 14, y1 - y0 + 14, 12); ctx.stroke(); });
  }
  function zeroMark(ctx, G, i, k, u) {   // bagian kosong bernilai nol
    if (u <= 0) return; const [a, z] = G.part(k);
    hand(ctx, "0", (a + z) / 2, G.rowY(i) + G.c * 0.78, G.c * 0.8, { color: k ? BLUE : OR2, alpha: u });
  }
  // tabel huruf-bilangan: dua blok (A–M, N–Z), tiap blok baris huruf + baris bilangan
  function abcTable(ctx, x, y, cw, ch, o = {}) {
    for (let i = 0; i < 26; i++) {
      const k = Math.floor(i / 13), cx = x + (i % 13) * cw, yy = y + k * (ch * 2 + ch * 0.45);
      const a = o.a ? o.a(i) : 1; if (a <= 0) continue;
      const hl = o.hl && o.hl(i);
      alpha(ctx, a, () => {
        ctx.fillStyle = hl ? "#FFE3BF" : "#F3F6F8"; ctx.fillRect(cx, yy, cw, ch); ctx.fillStyle = hl ? "#FFF3E2" : "#fff"; ctx.fillRect(cx, yy + ch, cw, ch);
        ctx.strokeStyle = hl ? ORANGE : "#B8C3CA"; ctx.lineWidth = hl ? 5 : 2; ctx.strokeRect(cx, yy, cw, ch * 2);
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, yy + ch); ctx.lineTo(cx + cw, yy + ch); ctx.stroke();
        text(ctx, ABC[i], cx + cw / 2, yy + ch * 0.7, ch * 0.55, { align: "center", weight: 900, color: INK });
        text(ctx, String(i + 1), cx + cw / 2, yy + ch * 1.7, ch * 0.5, { align: "center", weight: 800, color: hl ? OR2 : C.ink2 });
      });
    }
  }
  function abcStrip(ctx, x, y, cw, hl) {   // satu baris A–Z dengan bilangan di bawahnya
    for (let i = 0; i < 26; i++) {
      const cx = x + i * cw, on = hl === i;
      ctx.fillStyle = on ? "#FFE3BF" : "#F3F6F8"; ctx.fillRect(cx, y, cw, 84);
      ctx.strokeStyle = on ? ORANGE : "#C9D2D8"; ctx.lineWidth = on ? 5 : 2; ctx.strokeRect(cx, y, cw, 84);
      text(ctx, ABC[i], cx + cw / 2, y + 36, 30, { align: "center", weight: 900, color: INK });
      text(ctx, String(i + 1), cx + cw / 2, y + 74, 26, { align: "center", weight: 800, color: on ? OR2 : C.ink2 });
    }
  }
  const MCOL = ["#E2574C", "#3B8FD9", "#F2B33D", "#4CB273", "#9B6BD6"];
  function marble(ctx, x, y, r, i) {
    ctx.fillStyle = MCOL[i % 5]; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, Math.PI * 2); ctx.fill();
  }
  function bag(ctx, x, y, s, a = 1) {   // kantong kain; (x, y) = tengah
    if (a <= 0) return;
    alpha(ctx, a, () => {
      ctx.fillStyle = "#E8D3A8"; ctx.strokeStyle = "#8A6B3A"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x - s * 0.32, y - s * 0.42); ctx.quadraticCurveTo(x - s * 0.62, y + s * 0.1, x - s * 0.45, y + s * 0.42);
      ctx.quadraticCurveTo(x, y + s * 0.56, x + s * 0.45, y + s * 0.42); ctx.quadraticCurveTo(x + s * 0.62, y + s * 0.1, x + s * 0.32, y - s * 0.42); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#B5462F"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - s * 0.36, y - s * 0.3); ctx.lineTo(x + s * 0.36, y - s * 0.3); ctx.stroke();
    });
  }
  const SLOT = [[-0.22, 0.02], [0.22, 0.02], [-0.26, 0.26], [0.0, 0.3], [0.26, 0.26]];
  function envelope(ctx, x, y, w) {
    const h = w * 0.64; ctx.fillStyle = "#FFF4D6"; ctx.strokeStyle = "#B08A3E"; ctx.lineWidth = 4;
    rr(ctx, x - w / 2, y - h / 2, w, h, 6); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x, y + h * 0.05); ctx.lineTo(x + w / 2, y - h / 2); ctx.stroke();
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x, y + h * 0.05, w * 0.07, 0, Math.PI * 2); ctx.fill();
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
    const fu = P(l, at(b, "negara kita"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagID(ctx, 470, 230, 170); ctx.restore(); }
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
    if (au > 0) ring(ctx, 1210, 300 + 2 * 92 - 14, 240, 44, au);
  }

  // ---------- 0. soal ----------
  function abjad(ctx, b, l) {
    board(ctx);
    const t0 = at(b, "Setiap huruf"), t1 = at(b, "Huruf A");
    abcTable(ctx, 128, 190, 128, 86, { a: i => P(l, t0 + i * (t1 - t0) / 30, 0.3),
      hl: i => (i === 0 && l > t1 && l < at(b, "huruf B")) || (i === 1 && l > at(b, "huruf B") && l < at(b, "sampai huruf Z")) || (i === 25 && l > at(b, "sampai huruf Z")) });
    const fr = P(l, at(b, "Sekelompok"), 0.6);
    if (fr > 0) [300, 480, 660].forEach((x, i) => beaver(ctx, x, 690, 120, { alpha: fr }));
    hand(ctx, "huruf  →  bilangan", 1240, 720, 60, { alpha: P(l, at(b, "diganti"), 0.6) });
  }
  const ROW1 = { x: 409, y: 400, c: 120 };
  function baris(ctx, b, l) {
    board(ctx);
    const id = b.id, k = ["soal2", "soal3", "soal4", "soal5"].indexOf(id);
    const f4 = id === "soal4" ? P(l, at(b, "kotak nomor tiga"), 0.5) : (k > 2 ? 1 : 0);
    const f5 = id === "soal5" ? P(l, at(b, "kotak nomor empat"), 0.5) : 0;
    const G = grid(ctx, ROW1.x, ROW1.y, ROW1.c, [[3, 4]], { labels: [k >= 1 ? "S" : ""], fill: (i, part) => part ? f5 : f4 });
    if (id === "soal2") {
      text(ctx, "1 huruf = 1 baris berisi 9 kotak", 960, 230, 46, { align: "center", weight: 900, color: INK });
      partBox(ctx, G, 0, G.top, G.y + G.c, P(l, at(b, "Bagian pertama"), 0.5), ORANGE);
      hand(ctx, "5 kotak", (G.part(0)[0] + G.part(0)[1]) / 2, 620, 52, { color: OR2, alpha: P(l, at(b, "Bagian pertama"), 0.5) });
      partBox(ctx, G, 1, G.top, G.y + G.c, P(l, at(b, "Bagian kedua"), 0.5), BLUE);
      hand(ctx, "4 kotak", (G.part(1)[0] + G.part(1)[1]) / 2, 620, 52, { color: BLUE, alpha: P(l, at(b, "Bagian kedua"), 0.5) });
      return;
    }
    text(ctx, "Mengodekan huruf S", 960, 220, 46, { align: "center", weight: 900, color: INK });
    const sA = id === "soal3" ? P(l, at(b, "Huruf S adalah"), 0.5) : 1;
    hand(ctx, "Langkah 1:  S = 19", 560, 610, 46, { align: "left", color: INK, alpha: sA });
    if (k >= 2) hand(ctx, "Langkah 2:  19 : 5 = 3  (dibulatkan ke bawah)", 560, 675, 46, { align: "left", color: OR2, alpha: id === "soal4" ? P(l, at(b, "Hasilnya"), 0.5) : 1 });
    if (k >= 3) hand(ctx, "Langkah 3:  19 : 5 = 3, sisa 4", 560, 740, 46, { align: "left", color: BLUE, alpha: P(l, at(b, "Sembilan belas dibagi"), 0.5) });
    if (id === "soal4") ring(ctx, G.cx(2), G.y + G.c / 2, G.c * 0.62, G.c * 0.62, P(l, at(b, "kotak nomor tiga"), 0.6), ORANGE);
    if (id === "soal5") ring(ctx, G.cx(8), G.y + G.c / 2, G.c * 0.62, G.c * 0.62, P(l, at(b, "kotak nomor empat"), 0.6), BLUE);
  }
  function contoh(ctx, b, l) {
    board(ctx);
    const t0 = at(b, "Hasilnya");
    const G = grid(ctx, 620, 292, 72, EX, { labels: "BEBRAS".split(""), show: i => P(l, t0 + i * 0.45, 0.35) });
    beaver(ctx, 300, 460, 210);
    envelope(ctx, 300, 650, 120);
    hand(ctx, "“BEBRAS”", 300, 270, 56, { color: INK });
    hand(ctx, "1 baris = 1 huruf", 1610, 470, 50, { alpha: P(l, at(b, "Setiap baris"), 0.5) });
    rowBox(ctx, G, 0, P(l, at(b, "Setiap baris"), 0.4) * (1 - P(l, at(b, "Setiap baris") + 1.6, 0.4)));
  }
  const MG = { x: 590, y: 300, c: 80 };
  function tantang(ctx, b, l) {
    board(ctx);
    const t0 = at(b, "lima baris");
    grid(ctx, MG.x, MG.y, MG.c, MSG, { labels: MSG.map(() => "?"), labelColor: () => ORANGE, show: i => P(l, t0 + i * 0.3, 0.3) });
    beaver(ctx, 290, 430, 190); envelope(ctx, 290, 620, 110);
    hand(ctx, "pesan rahasia", 290, 260, 46, { color: INK });
    const q = P(l, at(b, "Apa pesan"), 0.5);
    alpha(ctx, q, () => thinkBadge(ctx, 1350, 330, 500, 160, Math.max(0, l - at(b, "Apa pesan")), b.dur - at(b, "Apa pesan"), "Apa pesan aslinya?"));
  }

  // ---------- 1. memahami cara mengodekan ----------
  function periksa(ctx, b, l) {
    board(ctx);
    const id = b.id;
    const G = grid(ctx, 200, 290, 66, EX, { labels: "BEBRAS".split("") });
    const L = (s, y, t, color = INK) => hand(ctx, s, 1000, y, 46, { align: "left", color, alpha: P(l, t, 0.5) });
    if (id === "m1" || id === "m2") {
      L("B = 2", 260, id === "m1" ? at(b, "Huruf B") : 0);
      L("2 : 5 = 0, sisa 2", 340, id === "m1" ? at(b, "Dua dibagi") : 0);
      rowBox(ctx, G, 0, id === "m1" ? P(l, at(b, "Huruf B"), 0.4) : 1);
      if (id === "m2") {
        L("hasil 0  →  bagian pertama kosong", 450, at(b, "Hasil nol"), OR2);
        L("sisa 2  →  kotak 2 bagian kedua", 530, at(b, "Sisa dua"), BLUE);
        zeroMark(ctx, G, 0, 0, P(l, at(b, "Hasil nol"), 0.5));
        ring(ctx, G.cx(6), G.rowY(0) + G.c / 2, G.c * 0.6, G.c * 0.6, P(l, at(b, "Sisa dua"), 0.5), BLUE);
        alpha(ctx, P(l, at(b, "Ternyata"), 0.5), () => { tick(ctx, 1080, 650, 80); hand(ctx, "cocok!", 1140, 670, 54, { align: "left", color: GREEN }); });
      }
    }
    if (id === "m3") {
      rowBox(ctx, G, 1, P(l, 0.3, 0.4));
      L("E = 5", 260, at(b, "huruf E"));
      L("5 : 5 = 1, sisa 0", 340, at(b, "Lima dibagi"));
      L("hasil 1  →  kotak 1 bagian pertama", 450, at(b, "Jadi, kotak"), OR2);
      L("sisa 0  →  bagian kedua kosong", 530, at(b, "bagian kedua kosong"), BLUE);
      ring(ctx, G.cx(0), G.rowY(1) + G.c / 2, G.c * 0.6, G.c * 0.6, P(l, at(b, "Jadi, kotak"), 0.5), ORANGE);
      zeroMark(ctx, G, 1, 1, P(l, at(b, "bagian kedua kosong"), 0.5));
    }
    if (id === "m4") {
      hand(ctx, "bagian kosong = 0", 1380, 330, 70, { color: ORANGE, alpha: P(l, at(b, "Kalau sebuah"), 0.5) });
      [[0, 0], [1, 1], [2, 0], [4, 0]].forEach(([i, k], n) => zeroMark(ctx, G, i, k, P(l, at(b, "artinya nilainya") + n * 0.2, 0.4)));
      const u = P(l, at(b, "hanya punya satu"), 0.5);
      [0, 1, 2, 4].forEach(i => rowBox(ctx, G, i, u, GREEN));
      hand(ctx, "baris dengan 1 kotak hitam", 1380, 520, 48, { color: GREEN, alpha: u });
    }
  }
  const KG = { x: 545, y: 650, c: 88 };
  function kelereng(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "k1") {
      const t0 = at(b, "Setiap kantong");
      bag(ctx, 640, 300, 170);
      for (let i = 0; i < 5; i++) { const u = P(l, t0 + i * 0.3, 0.4), sx = 240 + i * 46, sy = 190; const [dx, dy] = SLOT[i]; marble(ctx, lerp(sx, 640 + dx * 170, u), lerp(sy, 300 + dy * 170, u), 17, i); }
      hand(ctx, "1 kantong = 5 kelereng", 1000, 300, 44, { color: INK, alpha: P(l, t0 + 1.6, 0.5) });
      const rs = P(l, at(b, "kelereng sisa"), 0.5);
      for (let i = 0; i < 3; i++) marble(ctx, 1380 + i * 52, 290, 18, i + 1);
      hand(ctx, "sisa", 1432, 250, 44, { color: BLUE, alpha: 1 });
      const G = grid(ctx, KG.x, KG.y, KG.c, [[1, 3]], { fill: () => 0 });
      partBox(ctx, G, 0, G.top, G.y + G.c, P(l, at(b, "Bagian pertama"), 0.5), ORANGE);
      hand(ctx, "banyak kantong penuh", 1600, 690, 40, { color: OR2, alpha: P(l, at(b, "Bagian pertama"), 0.5) * (1 - rs) });
      partBox(ctx, G, 1, G.top, G.y + G.c, rs, BLUE);
      hand(ctx, "kelereng sisa", 1600, 690, 40, { color: BLUE, alpha: rs });
      return;
    }
    if (id === "k2") {
      const tb = at(b, "tiga kantong penuh"), u = P(l, tb, 1.2), BX = [330, 560, 790];
      BX.forEach(x => bag(ctx, x, 360, 160, u));
      for (let i = 0; i < 19; i++) {
        const sx = 170 + i * 52, sy = 210; let tx, ty;
        if (i < 15) { const k = Math.floor(i / 5), [dx, dy] = SLOT[i % 5]; tx = BX[k] + dx * 160; ty = 360 + dy * 160; } else { tx = 1010 + (i - 15) * 50; ty = 390; }
        marble(ctx, lerp(sx, tx, u), lerp(sy, ty, u), 17, i);
      }
      hand(ctx, "19 kelereng", 1320, 235, 44, { align: "left", color: INK, alpha: 1 - u });
      hand(ctx, "3 kantong", 560, 275, 40, { color: OR2, alpha: P(l, tb + 1.2, 0.5) });
      hand(ctx, "sisa 4", 1085, 340, 40, { color: BLUE, alpha: P(l, at(b, "sisa empat"), 0.5) });
      const G = grid(ctx, KG.x, KG.y, KG.c, [[3, 4]], { labels: ["S"], fill: (i, p) => p ? P(l, at(b, "sisa empat"), 0.5) : P(l, tb + 1.2, 0.5) });
      hand(ctx, "3 × 5 = 15", 1560, 330, 46, { color: OR2, alpha: P(l, at(b, "lima belas kelereng"), 0.5) });
      hand(ctx, "15 + 4 = 19", 1560, 405, 46, { color: GREEN, alpha: P(l, at(b, "ditambah empat"), 0.5) });
      return;
    }
    if (id === "k3") {
      const u = P(l, at(b, "Bilangan hurufnya"), 0.6);
      text(ctx, "Cara membaca satu baris", 960, 230, 46, { align: "center", weight: 900, color: INK });
      alpha(ctx, u, () => {
        card(ctx, 170, 290, 1580, 200, { fill: "#FFF8E8", stroke: ORANGE, lw: 5, r: 24 });
        text(ctx, "bilangan  =  5 × (kotak bagian pertama)  +  (kotak bagian kedua)", 960, 410, 52, { align: "center", weight: 900, color: INK, fit: 1500 });
      });
      const G = grid(ctx, 420, 680, 74, [[3, 4]], { labels: ["S"] });
      hand(ctx, "5 × 3 + 4 = 19", 1500, 735, 52, { color: GREEN, alpha: P(l, at(b, "ditambah nomor"), 0.5) });
      return;
    }
    // k4: lima kelereng sisa langsung menjadi satu kantong baru
    const t5 = at(b, "lima kelereng sudah"), u = P(l, t5, 1.0);
    bag(ctx, 900, 330, 170, u);
    for (let i = 0; i < 5; i++) { const sx = 640 + i * 60, [dx, dy] = SLOT[i]; marble(ctx, lerp(sx, 900 + dx * 170, u), lerp(330, 330 + dy * 170, u), 18, i); }
    hand(ctx, "sisa 5?", 760, 250, 48, { color: RED, alpha: P(l, at(b, "lima atau lebih"), 0.5) * (1 - u) });
    hand(ctx, "jadi 1 kantong baru!", 900, 500, 46, { color: OR2, alpha: P(l, t5 + 1.0, 0.5) });
    hand(ctx, "sisa hanya 0, 1, 2, 3, atau 4", 960, 600, 52, { color: BLUE, alpha: P(l, at(b, "Itulah sebabnya"), 0.5) });
    hand(ctx, "→ bagian kedua cukup 4 kotak", 960, 680, 48, { color: BLUE, alpha: P(l, at(b, "hanya punya empat"), 0.5) });
  }

  // ---------- 2. membaca pesan ----------
  const RD = { d1: [0, "Lima dikali", "huruf R"], d2: [1, "Nol ditambah", "huruf A"], d3: [2, "Jadi, bilangannya", "huruf D"], d4: [3, "Lima dikali", "huruf I"], d5: [4, "Lima dikali", "huruf O"] };
  const RORDER = ["d0", "d1", "d2", "d3", "d4", "d5", "d6"];
  const BG = { x: 220, y: 255, c: 70 };
  function baca(ctx, b, l) {
    board(ctx);
    const id = b.id, k = RORDER.indexOf(id), cur = RD[id];
    const G = grid(ctx, BG.x, BG.y, BG.c, MSG, { labels: MSG.map(() => ""), head: true });
    let look = -1;
    MSG.forEach(([q, r], i) => {
      const n = 5 * q + r, bi = RORDER.indexOf("d" + (i + 1));
      let ca = 0, la = 0;
      if (bi < k) { ca = 1; la = 1; } else if (bi === k) { ca = P(l, at(b, cur[1]), 0.5); la = P(l, at(b, cur[2]), 0.5); if (l > at(b, cur[2]) - 0.3) look = n - 1; }
      const yy = G.rowY(i) + G.c * 0.68;
      if (ca > 0 && id !== "d6") hand(ctx, `5 × ${q} + ${r} = ${n}`, 1000, yy, 44, { align: "left", color: INK, alpha: ca });
      if (la > 0) alpha(ctx, la, () => { letter(ctx, ABC[n - 1], 1660, G.rowY(i) + G.c / 2, 30, id === "d6"); });
      else if (id !== "d6") text(ctx, "?", 1660, yy, 50, { align: "center", weight: 900, color: ORANGE });
    });
    if (cur) {
      const i = cur[0], [q, r] = MSG[i];
      rowBox(ctx, G, i, P(l, 0.2, 0.4));
      if (q === 0) zeroMark(ctx, G, i, 0, P(l, at(b, "kosong"), 0.5));
      if (r === 0) zeroMark(ctx, G, i, 1, P(l, at(b, "kosong"), 0.5));
    }
    if (id === "d0") alpha(ctx, P(l, 0.3, 0.5), () => thinkBadge(ctx, 560, 620, 820, 150, l, b.dur, "Rumus: 5 × bagian pertama + bagian kedua"));
    if (id === "d6") {
      const u = P(l, at(b, "pesan rahasianya"), 0.6);
      alpha(ctx, u, () => { hand(ctx, "RADIO", 1290, 470, 150, { color: GREEN }); tick(ctx, 1290, 560, 90, u); });
    }
    if (id !== "d0" && id !== "d6") abcStrip(ctx, 102, 622, 66, look);
  }

  // ---------- 3. memeriksa ----------
  function cek(ctx, b, l) {
    board(ctx);
    const id = b.id, j1 = id === "j1", t0 = j1 ? at(b, "Kalau hasilnya") : 0, step = j1 ? (b.dur - t0 - 0.5) / 5 : 0;
    const show = i => j1 ? P(l, t0 + i * step, 0.4) : 1;
    text(ctx, "hasil kita", 826, 175, 34, { align: "center", weight: 900, color: OR2 });
    text(ctx, "pesan yang diterima", 1466, 175, 34, { align: "center", weight: 900, color: BLUE });
    "RADIO".split("").forEach((ch, i) => {
      const [q, r] = enc(ch), n = num(ch), y = 280 + i * 58 + 40;
      alpha(ctx, show(i), () => text(ctx, `${ch} = ${n} = 5×${q} + ${r}`, 160, y, 32, { weight: 800, color: INK }));
    });
    grid(ctx, 560, 280, 58, "RADIO".split("").map(enc), { show });
    const G2 = grid(ctx, 1200, 280, 58, MSG, {});
    if (!j1) {
      MSG.forEach((_, i) => tick(ctx, 1800, G2.rowY(i) + 29, 46, P(l, at(b, "sama persis") + i * 0.2, 0.3)));
      hand(ctx, "Sama persis!  Jawaban: RADIO", 960, 700, 70, { color: GREEN, alpha: P(l, at(b, "jawabannya"), 0.5) });
    }
  }
  function jebak(ctx, b, l) {
    board(ctx);
    const id = b.id, j3 = id === "j3", row = j3 ? 1 : 0;
    text(ctx, j3 ? "Kesalahan 1: bagian kosong dianggap 1" : "Kesalahan 2: nomor kotak langsung dijumlahkan", 960, 200, 44, { align: "center", weight: 900, color: RED, fit: 1600 });
    const G = grid(ctx, 560, 360, 90, [MSG[row]], { labels: [j3 ? "2" : "1"] });
    if (j3) {
      zeroMark(ctx, G, 0, 0, P(l, at(b, "melainkan nol"), 0.5));
      const w = P(l, at(b, "Kalau baris kedua"), 0.5), c2 = P(l, at(b, "padahal seharusnya"), 0.5);
      hand(ctx, "5 + 1 = 6  →  F", 960, 580, 60, { color: RED, alpha: w }); cross(ctx, 1290, 560, 60, w);
      hand(ctx, "0 + 1 = 1  →  A", 960, 700, 60, { color: GREEN, alpha: c2 }); tick(ctx, 1290, 680, 60, c2);
    } else {
      const w = P(l, at(b, "tiga ditambah tiga"), 0.5), c2 = P(l, at(b, "padahal jawabannya"), 0.5), bu = P(l, at(b, "lima kali lipat"), 0.6);
      hand(ctx, "3 + 3 = 6", 960, 580, 60, { color: RED, alpha: w }); cross(ctx, 1200, 560, 60, w);
      hand(ctx, "5 × 3 + 3 = 18  →  R", 960, 700, 60, { color: GREEN, alpha: c2 }); tick(ctx, 1330, 680, 60, c2);
      [1500, 1640, 1780].forEach(x => bag(ctx, x, 420, 110, bu));
      hand(ctx, "3 kantong × 5", 1640, 530, 40, { color: OR2, alpha: bu });
    }
  }

  // ---------- 4. penutup ----------
  function key(ctx, x, y, s, L) {
    ctx.fillStyle = "#E7ECEF"; rr(ctx, x - s / 2, y - s / 2, s, s, s * 0.14); ctx.fill(); ctx.strokeStyle = "#9AA6AE"; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "#fff"; rr(ctx, x - s * 0.4, y - s * 0.44, s * 0.8, s * 0.72, s * 0.1); ctx.fill();
    text(ctx, L, x, y + s * 0.12, s * 0.42, { align: "center", weight: 900, color: INK });
  }
  function kode(ctx, b, l) {
    board(ctx);
    if (b.id === "p1") {
      const u = P(l, at(b, "huruf A besar"), 0.5);
      key(ctx, 360, 420, 190, "A");
      alpha(ctx, u, () => { mline(ctx, [[500, 420], [760, 420]], 1, ORANGE, 8, true); computer(ctx, 1000, 440, 360); text(ctx, "65", 1000, 445, 110, { align: "center", weight: 900, color: INK }); });
      alpha(ctx, P(l, at(b, "enam puluh lima") + 1, 0.5), () => { text(ctx, "B → 66", 1460, 380, 48, { weight: 800, color: C.ink2 }); text(ctx, "C → 67", 1460, 450, 48, { weight: 800, color: C.ink2 }); text(ctx, "…", 1460, 510, 48, { weight: 800, color: C.ink2 }); });
      hand(ctx, "pengodean", 960, 740, 80, { color: C.kiko, alpha: P(l, at(b, "disebut pengodean"), 0.5) });
      return;
    }
    const R = [["kelompok lima:", "19  =  3 × 5  +  4", "kelompok lima"], ["kelompok sepuluh:", "35  =  3 puluhan  +  5 satuan", "puluhan dan satuan"], ["kelompok dua:", "bilangan biner (hanya 0 dan 1)", "bilangan biner"]];
    R.forEach(([k, v, ph], i) => alpha(ctx, P(l, at(b, ph), 0.5), () => {
      card(ctx, 180, 200 + i * 190, 1560, 150, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 22 });
      text(ctx, k, 240, 295 + i * 190, 46, { weight: 800, color: [OR2, C.ink2, C.kiko][i] });
      text(ctx, v, 720, 295 + i * 190, 54, { weight: 900, color: INK, fit: 980 });
    }));
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Pahami cara mengodekan dengan mencoba contohnya.", "Balik caranya: 5 × bagian pertama + bagian kedua.", "Kodekan lagi jawabanmu untuk memeriksanya."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 46, { weight: 900, color: INK, fit: 1180 });
        if (i === 0) grid(ctx, 1555, y + 70, 20, [[3, 4]], { head: false });
        if (i === 1) hand(ctx, "5 × i + ii", 1640, y + 98, 40, { color: OR2 });
        if (i === 2) tick(ctx, 1640, y + 80, 80);
      });
    });
  }

  // ---------- versi tegak untuk Short (area x 440–1480, y 120–830) ----------
  function kotak_v(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "h0" || id === "h1") {
      text(ctx, "A = 1    B = 2    C = 3    …    Z = 26", 960, 210, 46, { align: "center", weight: 900, color: INK });
      const s1 = id === "h1";
      const G = grid(ctx, 500, 430, 100, [[3, 4]], { labels: [s1 ? "S" : ""], fill: (i, p) => s1 ? P(l, at(b, p ? "kotak empat" : "kotak tiga"), 0.5) : 0 });
      if (!s1) {
        partBox(ctx, G, 0, G.top, G.y + G.c, P(l, at(b, "Hasil baginya"), 0.5), ORANGE);
        hand(ctx, "hasil bagi 5", (G.part(0)[0] + G.part(0)[1]) / 2, 600, 44, { color: OR2, alpha: P(l, at(b, "Hasil baginya"), 0.5) });
        partBox(ctx, G, 1, G.top, G.y + G.c, P(l, at(b, "sisanya"), 0.5), BLUE);
        hand(ctx, "sisa", (G.part(1)[0] + G.part(1)[1]) / 2, 600, 44, { color: BLUE, alpha: P(l, at(b, "sisanya"), 0.5) });
        hand(ctx, "bilangan : 5", 960, 720, 56, { color: INK, alpha: P(l, at(b, "dibagi lima"), 0.5) });
      } else {
        hand(ctx, "S = 19", 960, 640, 54, { color: INK, alpha: P(l, at(b, "sembilan belas."), 0.5) });
        hand(ctx, "19 : 5 = 3, sisa 4", 960, 730, 54, { color: OR2, alpha: P(l, at(b, "Sembilan belas dibagi"), 0.5) });
      }
      return;
    }
    const GX = 540, t4 = ["delapan belas", "satu adalah A", "empat adalah D", "sembilan adalah I", "lima belas adalah O"];
    const G = grid(ctx, GX, 300, 86, MSG, { labels: MSG.map(() => id === "h4" ? "" : "?"), labelColor: () => ORANGE });
    if (id === "h2") hand(ctx, "Apa pesan aslinya?", 960, 800, 56, { color: ORANGE, alpha: P(l, at(b, "Apa pesan"), 0.5) });
    if (id === "h3") {
      hand(ctx, "5 × bagian pertama + bagian kedua", 960, 800, 46, { color: INK, alpha: P(l, at(b, "Bilangannya"), 0.5) });
      MSG.forEach(([q, r], i) => { if (q === 0) zeroMark(ctx, G, i, 0, P(l, at(b, "bernilai nol"), 0.5)); if (r === 0) zeroMark(ctx, G, i, 1, P(l, at(b, "bernilai nol"), 0.5)); });
    }
    if (id === "h4") {
      MSG.forEach(([q, r], i) => {
        const n = 5 * q + r, a = P(l, at(b, t4[i]), 0.5);
        alpha(ctx, a, () => { text(ctx, String(n), 1400, G.rowY(i) + 56, 34, { align: "right", weight: 900, color: C.ink2 }); letter(ctx, ABC[n - 1], 1440, G.rowY(i) + 43, 30, true); });
      });
      hand(ctx, "RADIO", 960, 800, 80, { color: GREEN, alpha: P(l, at(b, "pesannya adalah"), 0.5) });
    }
  }

  // ---------- akhir, ajakan Short ----------
  function akhir(ctx, b, l) {
    board(ctx);
    kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
    [640, 860].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
    grid(ctx, 640, 640, 30, MSG, { head: false });
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
    text(ctx, "Bagi lima, lalu balik caranya", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
    kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
  }

  Object.assign(K.SCENES, { buka, kredit, abjad, baris, contoh, tantang, periksa, kelereng, baca, cek, jebak, kode, langkah, kotak_v, akhir, cta_bebras });
})(typeof window !== "undefined" ? window : globalThis);
