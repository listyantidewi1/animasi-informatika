/* B03 Pembahasan Soal Bebras 2025-CA-01 "Perakitan Robot" (Kanada), kategori SiKecil.
   Gaya papan tulis putih dengan coretan spidol + simulasi jalur perakitan.
   Papan: x 52–1868, y 130–830 (kartu narasi mulai y≈841).
   Lima pos (sama dengan soal): 1 banteng = badan, lengan, kaki; 2 kanguru = kepala; 3 monyet = tiga kancing di badan;
   4 sigung = dua mata; 5 hewan kelima = mulut. Robot yang dihasilkan: kancing di kaki kiri (dari atas: hijau, kuning, merah).
   Jawaban: B (monyet). Pilihan: A banteng, B monyet, C kanguru, D sigung (urutan sama dengan soal).
   Memakai berang-berang dari B01 (K.bebras.beaver) untuk adegan pembuka. Waktu kejadian diambil dari posisi kata di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, kid, ease, clamp, lerp } = H;
  const JUDUL_ASLI = "";   // soal 2025: berkas soal hanya memuat judul Indonesia, jadi kredit memakai judul itu
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B";
  const RG = "#CDD4DA", RGD = "#59656E", BRED = "#E5483B", BYEL = "#F2B134", BGRN = "#2FA65A", MOUTH = "#F2665A";

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => { const T = TXT(b), i = T.indexOf(s); if (i < 0 && typeof console !== "undefined") console.warn("frasa tidak ada: " + s + " @" + b.id); return lead(b) + Math.max(0, i) / T.length * (b.audio || b.dur); };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));
  const blink = (l, t0) => (l > t0 && l < t0 + 1.6) ? 0.5 + 0.5 * Math.cos((l - t0) * 9) : 0;

  // ---------- papan dan spidol ----------
  function board(ctx) {
    ctx.fillStyle = "#C3CDD4"; rr(ctx, 40, 118, 1840, 724, 22); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 52, 130, 1816, 700, 14); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.03)"; rr(ctx, 52, 130, 1816, 18, 8); ctx.fill();
  }
  function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
  function mline(ctx, pts, u, color, w, head, dash) {
    if (u <= 0) return;
    const L = plen(pts) * clamp(u, 0, 1); let s = 0;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round"; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let end = pts[0], prev = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s + d >= L) { const k = d ? (L - s) / d : 0; end = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; prev = pts[i - 1]; ctx.lineTo(end[0], end[1]); break; }
      ctx.lineTo(pts[i][0], pts[i][1]); s += d; end = pts[i]; prev = pts[i - 1];
    }
    ctx.stroke(); ctx.setLineDash([]);
    if (head && u >= 0.98) {
      const a = Math.atan2(end[1] - prev[1], end[0] - prev[0]), hs = w * 3.2;
      ctx.beginPath(); ctx.moveTo(end[0] - hs * Math.cos(a - 0.5), end[1] - hs * Math.sin(a - 0.5)); ctx.lineTo(end[0], end[1]);
      ctx.lineTo(end[0] - hs * Math.cos(a + 0.5), end[1] - hs * Math.sin(a + 0.5)); ctx.stroke();
    }
    ctx.restore();
  }
  function tick(ctx, x, y, s, u = 1, color = GREEN, w) {
    mline(ctx, [[x - s * 0.45, y], [x - s * 0.12, y + s * 0.33], [x + s * 0.48, y - s * 0.38]], u, color, w || Math.max(4, s * 0.16));
  }
  function cross(ctx, x, y, s, u = 1, color = ORANGE, w) {
    const lw = w || Math.max(4, s * 0.16);
    mline(ctx, [[x - s * 0.36, y - s * 0.36], [x + s * 0.36, y + s * 0.36]], u * 2, color, lw);
    mline(ctx, [[x + s * 0.36, y - s * 0.36], [x - s * 0.36, y + s * 0.36]], u * 2 - 1, color, lw);
  }
  function ring(ctx, x, y, rx, ry, u, color = ORANGE, w = 6) {
    if (u <= 0) return;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -0.06, -Math.PI * 0.6, -Math.PI * 0.6 + Math.PI * 2.15 * clamp(u, 0, 1)); ctx.stroke(); ctx.restore();
  }
  function hand(ctx, s, x, y, size, opt = {}) {
    ctx.save(); ctx.font = `italic 800 ${size}px ${K.FONT}`; ctx.fillStyle = opt.color || ORANGE; ctx.textAlign = opt.align || "center";
    ctx.textBaseline = "alphabetic"; if (opt.alpha != null) ctx.globalAlpha = opt.alpha; ctx.fillText(s, x, y); ctx.restore();
  }
  function eqSign(ctx, x, y, s, u, color = GREEN) {   // tanda sama dengan
    if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = color;
    rr(ctx, x - s / 2, y - s * 0.28, s, s * 0.16, s * 0.08); ctx.fill(); rr(ctx, x - s / 2, y + s * 0.12, s, s * 0.16, s * 0.08); ctx.fill(); ctx.restore();
  }
  function neqSign(ctx, x, y, s, u) {
    if (u <= 0) return; eqSign(ctx, x, y, s, u, ORANGE);
    ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = ORANGE; ctx.lineWidth = s * 0.14; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x + s * 0.22, y - s * 0.5); ctx.lineTo(x - s * 0.22, y + s * 0.5); ctx.stroke(); ctx.restore();
  }
  function hourglass(ctx, x, y, l, d, u = 1) {   // jam pasir + "Pikirkan dulu"
    if (u <= 0) return;
    ctx.save(); ctx.globalAlpha = u;
    card(ctx, x - 110, y - 150, 220, 300, { fill: "#FFF6E8", stroke: ORANGE, lw: 4, r: 18 });
    text(ctx, "PIKIRKAN", x, y - 105, 28, { align: "center", weight: 900, color: ORANGE });
    text(ctx, "DULU", x, y - 72, 28, { align: "center", weight: 900, color: ORANGE });
    const f = clamp(l / d, 0, 1);
    ctx.translate(x, y + 30); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-40, -70); ctx.lineTo(40, -70); ctx.lineTo(6, 0); ctx.lineTo(40, 70); ctx.lineTo(-40, 70); ctx.lineTo(-6, 0); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = BYEL; const top = 1 - f;
    if (top > 0) { ctx.beginPath(); ctx.moveTo(-30 * top, -62 + 58 * (1 - top)); ctx.lineTo(30 * top, -62 + 58 * (1 - top)); ctx.lineTo(0, -4); ctx.closePath(); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-34, 64); ctx.lineTo(34, 64); ctx.lineTo(34 * (1 - f * 0.85), 64 - 56 * f); ctx.lineTo(-34 * (1 - f * 0.85), 64 - 56 * f); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function hourglassSmall(ctx, x, y, l, d, u = 1) {   // versi mendatar yang kecil
    if (u <= 0) return;
    ctx.save(); ctx.globalAlpha = u;
    card(ctx, x - 190, y - 50, 380, 100, { fill: "#FFF6E8", stroke: ORANGE, lw: 4, r: 18 });
    text(ctx, "PIKIRKAN DULU", x + 35, y + 11, 30, { align: "center", weight: 900, color: ORANGE });
    const f = clamp(l / d, 0, 1); ctx.translate(x - 140, y); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-22, -34); ctx.lineTo(22, -34); ctx.lineTo(4, 0); ctx.lineTo(22, 34); ctx.lineTo(-22, 34); ctx.lineTo(-4, 0); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = BYEL; const top = 1 - f;
    if (top > 0) { ctx.beginPath(); ctx.moveTo(-16 * top, -28 + 26 * (1 - top)); ctx.lineTo(16 * top, -28 + 26 * (1 - top)); ctx.lineTo(0, -3); ctx.closePath(); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-18, 30); ctx.lineTo(18, 30); ctx.lineTo(18 * (1 - f * 0.85), 30 - 26 * f); ctx.lineTo(-18 * (1 - f * 0.85), 30 - 26 * f); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // ---------- robot mainan (sama bentuknya dengan soal) ----------
  // koordinat lokal: badan di tengah (0,8); kepala (0,-102); kaki sampai y 135. s = tinggi gambar (piksel) untuk rentang -145..135
  // o: {body, head, btn: "body" | "leg" | null, eyes, mouth, alpha, hi: {bagian: u}}
  const RPOS = { body: [0, 20, 118, 128], head: [0, -102, 74, 52], btnBody: [0, 10, 44, 20], btnLeg: [-24, 96, 22, 38], eyes: [0, -108, 46, 18], mouth: [0, -79, 36, 16] };
  function robot(ctx, x, y, s, o = {}) {
    const k = s / 280;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); if (o.alpha != null) ctx.globalAlpha = o.alpha;
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (o.body !== false) {
      // lengan
      for (const sx of [-1, 1]) {
        ctx.strokeStyle = RGD; ctx.lineWidth = 27; ctx.beginPath(); ctx.moveTo(sx * 52, -34); ctx.lineTo(sx * 86, 44); ctx.stroke();
        ctx.strokeStyle = RG; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(sx * 52, -34); ctx.lineTo(sx * 86, 44); ctx.stroke();
      }
      // kaki
      ctx.fillStyle = RG; ctx.strokeStyle = RGD; ctx.lineWidth = 3.5;
      rr(ctx, -37, 52, 26, 84, 10); ctx.fill(); ctx.stroke(); rr(ctx, 11, 52, 26, 84, 10); ctx.fill(); ctx.stroke();
      // badan
      rr(ctx, -57, -48, 114, 114, 10); ctx.fill(); ctx.stroke();
    }
    if (o.head) {
      ctx.fillStyle = RG; ctx.strokeStyle = RGD; ctx.lineWidth = 3.5;
      rr(ctx, -13, -64, 26, 18, 3); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.translate(0, -102); ctx.rotate(-0.07);
      rr(ctx, -59, -40, 118, 80, 9); ctx.fill(); ctx.stroke();
      if (o.eyes) { ctx.fillStyle = "#3E4A52"; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 24, -7, 9, 0, Math.PI * 2); ctx.fill(); } }
      if (o.mouth) {
        ctx.fillStyle = MOUTH; ctx.beginPath(); ctx.moveTo(-27, 17); ctx.quadraticCurveTo(0, 37, 27, 15); ctx.quadraticCurveTo(0, 25, -27, 17); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    if (o.btn === "body") { [[-22, BRED], [0, BYEL], [22, BGRN]].forEach(([bx, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(bx, 10, 7.5, 0, Math.PI * 2); ctx.fill(); }); }
    if (o.btn === "leg") { [[80, BGRN], [97, BYEL], [114, BRED]].forEach(([by, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(-24, by, 7, 0, Math.PI * 2); ctx.fill(); }); }
    ctx.restore();
    if (o.hi) for (const p in o.hi) ringPart(ctx, x, y, s, p, o.hi[p], o.hiColor);
  }
  function ringPart(ctx, x, y, s, p, u, color, w) {
    if (!(u > 0)) return; const k = s / 280, [dx, dy, rx, ry] = RPOS[p];
    ring(ctx, x + dx * k, y + dy * k, rx * k + 6, ry * k + 6, u, color || ORANGE, w || Math.max(4, s * 0.02));
  }
  function glowPart(ctx, x, y, s, p, a) {   // sorotan kuning lembut di belakang bagian robot (untuk "berkedip")
    if (!(a > 0)) return; const k = s / 280, [dx, dy, rx, ry] = RPOS[p];
    ctx.save(); ctx.globalAlpha = a * 0.55; ctx.fillStyle = "#FFD86B"; ctx.beginPath(); ctx.ellipse(x + dx * k, y + dy * k, rx * k + 8, ry * k + 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  // keadaan robot setelah pos ke-n; actual = yang benar-benar terjadi (kancing di kaki), selain itu = tugas yang benar
  const STATE = (n, actual) => ({ body: n >= 1, head: n >= 2, btn: n >= 3 ? (actual ? "leg" : "body") : null, eyes: n >= 4, mouth: n >= 5 });
  const GOOD = STATE(5, false), BAD = STATE(5, true);
  const PART_OF = ["body", "head", null, "eyes", "mouth"];   // bagian yang dipasang di pos 1..5 (pos 3: kancing)

  // ---------- lima hewan (digambar ulang, sederhana) ----------
  // koordinat lokal tinggi 230: kaki di y 112, kepala (0,-40); s = tinggi gambar
  const AN = {
    banteng: { fur: "#C9A27A", vest: "#F08A24", nama: "banteng" },
    kanguru: { fur: "#C8B394", vest: "#8E6CC4", nama: "kanguru" },
    monyet: { fur: "#A8743F", vest: "#8FCB3A", nama: "monyet" },
    sigung: { fur: "#3A3A40", vest: "#F2D33A", nama: "sigung" },
    kelima: { fur: "#A0602E", vest: "#D9532B", nama: "hewan kelima" },
  };
  const POS_AN = ["banteng", "kanguru", "monyet", "sigung", "kelima"];
  const OPT = [["A", "banteng"], ["B", "monyet"], ["C", "kanguru"], ["D", "sigung"]];
  function animal(ctx, kind, x, y, s, o = {}) {
    const a = AN[kind], k = s / 230, OUT = "#2A211B";
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); if (o.alpha != null) ctx.globalAlpha = o.alpha;
    ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 3;
    // ekor di belakang
    if (kind === "sigung") {
      ctx.fillStyle = "#2E2E33"; ctx.beginPath(); ctx.moveTo(22, 70); ctx.bezierCurveTo(90, 70, 100, -10, 70, -40); ctx.bezierCurveTo(52, -10, 60, 40, 18, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(30, 60); ctx.bezierCurveTo(78, 58, 86, 10, 68, -26); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 3;
    }
    if (kind === "kanguru") { ctx.fillStyle = a.fur; ctx.beginPath(); ctx.moveTo(20, 80); ctx.quadraticCurveTo(80, 100, 96, 70); ctx.quadraticCurveTo(70, 82, 24, 62); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    // kaki
    ctx.fillStyle = "#3B2A20"; rr(ctx, -20, 70, 15, 42, 5); ctx.fill(); rr(ctx, 5, 70, 15, 42, 5); ctx.fill();
    ctx.fillStyle = "#2A1E17"; rr(ctx, -24, 104, 22, 10, 5); ctx.fill(); rr(ctx, 2, 104, 22, 10, 5); ctx.fill();
    // badan + rompi
    ctx.fillStyle = a.fur; ctx.beginPath(); ctx.ellipse(0, 38, 32, 42, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = a.vest; ctx.beginPath(); ctx.moveTo(-28, 14); ctx.quadraticCurveTo(0, 6, 28, 14); ctx.lineTo(26, 66); ctx.quadraticCurveTo(0, 80, -26, 66); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (kind === "banteng" || kind === "sigung") { ctx.strokeStyle = kind === "banteng" ? "#C9601A" : "#7A4FB0"; ctx.lineWidth = 4; for (const yy of [30, 46, 60]) { ctx.beginPath(); ctx.moveTo(-24, yy); ctx.lineTo(24, yy); ctx.stroke(); } ctx.strokeStyle = OUT; ctx.lineWidth = 3; }
    // lengan
    ctx.fillStyle = a.fur; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 31, 36, 9, 22, sx * 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    // telinga dan tanduk (di belakang kepala)
    if (kind === "banteng") {
      ctx.fillStyle = "#FFFFFF"; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 30, -66); ctx.quadraticCurveTo(sx * 70, -66, sx * 78, -98); ctx.quadraticCurveTo(sx * 64, -78, sx * 34, -80); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = a.fur; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 48, -48, 15, 8, sx * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    }
    if (kind === "kanguru") { ctx.fillStyle = a.fur; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 18, -96, 10, 30, sx * 0.18, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#E9C9C0"; ctx.beginPath(); ctx.ellipse(sx * 18, -94, 4.5, 20, sx * 0.18, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = a.fur; } }
    if (kind === "monyet") { for (const sx of [-1, 1]) { ctx.fillStyle = a.fur; ctx.beginPath(); ctx.arc(sx * 46, -40, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#F0CFA8"; ctx.beginPath(); ctx.arc(sx * 46, -40, 8, 0, Math.PI * 2); ctx.fill(); } }
    if (kind === "sigung") { for (const sx of [-1, 1]) { ctx.fillStyle = a.fur; ctx.beginPath(); ctx.moveTo(sx * 18, -76); ctx.lineTo(sx * 40, -94); ctx.lineTo(sx * 42, -62); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#F2A7B8"; ctx.beginPath(); ctx.moveTo(sx * 24, -76); ctx.lineTo(sx * 38, -86); ctx.lineTo(sx * 38, -68); ctx.closePath(); ctx.fill(); } }
    if (kind === "kelima") { ctx.fillStyle = a.fur; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 14, -76); ctx.lineTo(sx * 34, -108); ctx.lineTo(sx * 40, -66); ctx.closePath(); ctx.fill(); ctx.stroke(); } }
    // kepala
    ctx.fillStyle = a.fur; ctx.beginPath(); ctx.ellipse(0, -40, 40, 40, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // wajah
    if (kind === "banteng") { ctx.fillStyle = "#F4D23C"; ctx.beginPath(); ctx.ellipse(0, -20, 30, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = OUT; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 10, -18, 3.5, 5, 0, 0, Math.PI * 2); ctx.fill(); } }
    if (kind === "kanguru") { ctx.fillStyle = "#E4D6BE"; ctx.beginPath(); ctx.ellipse(0, -22, 22, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(0, -31, 8, 5.5, 0, 0, Math.PI * 2); ctx.fill(); }
    if (kind === "monyet") { ctx.fillStyle = "#F0CFA8"; ctx.beginPath(); ctx.ellipse(-13, -48, 16, 14, 0, 0, Math.PI * 2); ctx.ellipse(13, -48, 16, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -24, 26, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -24, 10, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    if (kind === "sigung") { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-6, -80); ctx.lineTo(6, -80); ctx.lineTo(9, -28); ctx.lineTo(-9, -28); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.ellipse(-20, -22, 13, 10, 0, 0, Math.PI * 2); ctx.ellipse(20, -22, 13, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#F2A7B8"; ctx.beginPath(); ctx.ellipse(0, -24, 7, 5, 0, 0, Math.PI * 2); ctx.fill(); }
    if (kind === "kelima") { ctx.fillStyle = "#C88A55"; ctx.beginPath(); ctx.ellipse(0, -18, 24, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = OUT; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 9, -16, 3.5, 0, Math.PI * 2); ctx.fill(); } }
    // mata
    const ey = kind === "monyet" ? -48 : -50;
    ctx.fillStyle = kind === "sigung" ? "#FFFFFF" : OUT;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 15, ey, kind === "sigung" ? 7 : 5.5, 0, Math.PI * 2); ctx.fill(); }
    if (kind === "sigung") { ctx.fillStyle = OUT; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 15, ey, 4, 0, Math.PI * 2); ctx.fill(); } }
    ctx.fillStyle = "#FFFFFF"; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 15 + 1.8, ey - 1.8, 1.8, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    if (o.label) {
      const r = Math.max(18, s * 0.11), by = y + s * 0.5 + r + 6;
      ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
      ctx.fillStyle = o.labelColor || INK; ctx.beginPath(); ctx.arc(x, by, r, 0, Math.PI * 2); ctx.fill();
      text(ctx, o.label, x, by + r * 0.4, r * 1.15, { align: "center", color: "#fff", weight: 900 }); ctx.restore();
    }
    if (o.name) text(ctx, a.nama, x, y + s * 0.5 + (o.label ? s * 0.22 + 52 : 36), o.nameSize || Math.max(24, s * 0.13), { align: "center", weight: 800, color: INK });
  }

  // ---------- lima pos jalur perakitan ----------
  // opt: {x, y, w, h, gap, show: [0..1]*5 (hewan), robots: [null | state]*5, num, labels: [u]*5, hi: {i: a}}
  const TASK = ["badan, lengan, kaki", "kepala", "3 kancing", "2 mata", "mulut"];
  function strip(ctx, o) {
    const n = 5, w = o.w, gap = o.gap ?? 16, h = o.h, x0 = o.x, y0 = o.y;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (w + gap), su = o.show ? o.show[i] : 1;
      if (su <= 0) continue;
      ctx.save(); ctx.globalAlpha = su;
      const mark = o.marks && o.marks[i];
      card(ctx, x, y0, w, h, { fill: o.hi && o.hi[i] ? "#FFF6E8" : "#FFFFFF", stroke: o.hi && o.hi[i] ? ORANGE : "#8D99A3", lw: o.hi && o.hi[i] ? 5 : 3, r: 10 });
      if (o.num) { const nu = o.num[i] ?? 1; if (nu > 0) { ctx.globalAlpha = su * nu; ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + 26, y0 + 26, 19, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 26, y0 + 35, 25, { align: "center", color: "#fff", weight: 900 }); ctx.globalAlpha = su; } }
      const rs = h * 0.66, as = h * 0.74;
      const rb = o.robots && o.robots[i];
      if (rb) { robot(ctx, x + w * 0.31, y0 + h * 0.55, rs, rb); if (rb.glow) glowPart(ctx, x + w * 0.31, y0 + h * 0.55, rs, rb.glow, rb.glowA); if (rb.glow) robot(ctx, x + w * 0.31, y0 + h * 0.55, rs, rb); }
      if (o.cover && o.cover[i] > 0) {   // robot yang belum diperlihatkan: tanda tanya
        ctx.globalAlpha = su * o.cover[i]; ctx.fillStyle = "#EEF1F3"; rr(ctx, x + w * 0.31 - rs * 0.4, y0 + h * 0.55 - rs * 0.52, rs * 0.8, rs * 1.04, 12); ctx.fill();
        text(ctx, "?", x + w * 0.31, y0 + h * 0.55 + rs * 0.18, rs * 0.5, { align: "center", weight: 900, color: "#9AA6AE" }); ctx.globalAlpha = su;
      }
      animal(ctx, POS_AN[i], x + w * 0.72, y0 + h * 0.52, as);
      ctx.restore();
      if (o.labels && o.labels[i] > 0) {
        ctx.save(); ctx.globalAlpha = o.labels[i];
        text(ctx, TASK[i], x + w / 2, y0 + h + (o.labelSize || 34) + 8, o.labelSize || 34, { align: "center", weight: 800, color: o.hi && o.hi[i] ? ORANGE : INK, fit: w + gap - 4 });
        ctx.restore();
      }
      if (mark) { const [kind, u] = mark, mx = x + w / 2, my = y0 + h + (o.markDy || 110); if (kind === "ok") tick(ctx, mx, my, o.markSize || 70, u, GREEN); else cross(ctx, mx, my, (o.markSize || 70) * 0.85, u, ORANGE); }
    }
  }
  function frame(ctx, x, y, w, h, label, good, u = 1) {
    if (u <= 0) return; ctx.save(); ctx.globalAlpha = u;
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: good ? GREEN : ORANGE, lw: 5, r: 18 });
    const tw = label.length * 19 + 50;
    card(ctx, x + w / 2 - tw / 2, y - 24, tw, 48, { fill: good ? GREEN : ORANGE, r: 24 });
    text(ctx, label, x + w / 2, y + 11, 32, { align: "center", weight: 900, color: "#fff" });
    ctx.restore();
  }
  const STEPS = ["Bandingkan", "Periksa setiap pos", "Temukan pos yang salah"];
  function stepsStrip(ctx, big, u = 1) {
    if (u <= 0) return;
    ctx.save(); ctx.globalAlpha = u;
    const y = 700, h = 58, gap = 18; ctx.font = `800 28px ${K.FONT}`;
    const ws = STEPS.map(s => ctx.measureText(s).width + 96), tot = ws.reduce((a, b) => a + b, 0) + gap * 2;
    let x = 960 - tot / 2;
    STEPS.forEach((s, i) => {
      const on = big === i + 1;
      card(ctx, x, y, ws[i], h, { fill: on ? "#FFF1DF" : "#F3F6F8", stroke: on ? ORANGE : "#B8C3CA", lw: on ? 4 : 2.5, r: 32 });
      ctx.fillStyle = on ? ORANGE : C.kiko; ctx.beginPath(); ctx.arc(x + 34, y + h / 2, 22, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), x + 34, y + h / 2 + 9, 26, { align: "center", color: "#fff", weight: 900 });
      text(ctx, s, x + 66, y + h / 2 + 10, 28, { weight: 800, color: INK });
      x += ws[i] + gap;
    });
    ctx.restore();
  }

  // ---------- kue (pemanasan) ----------
  function cake(ctx, x, y, s, o = {}) {   // s = lebar piring; berry: "top" | "side" | 0
    const k = s / 260;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = "#E3E8EC"; ctx.strokeStyle = "#9AA6AE"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 62, 128, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (o.cake !== false) {
      ctx.fillStyle = "#B8763F"; rr(ctx, -88, -14, 176, 80, 12); ctx.fill(); ctx.strokeStyle = "#7A4A22"; ctx.stroke();
      ctx.fillStyle = "#E7B676"; ctx.fillRect(-86, 22, 172, 12);
    }
    if (o.cream) {
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#B9C3CA"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-92, -10); ctx.quadraticCurveTo(-92, -40, -60, -40); ctx.lineTo(60, -40); ctx.quadraticCurveTo(92, -40, 92, -10);
      for (let i = 0; i <= 6; i++) { const xx = 92 - i * 30.6; ctx.quadraticCurveTo(xx - 8, 14 + (i % 2) * 8, xx - 15.3, -6); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    if (o.berry) {
      const [bx, by] = o.berry === "top" ? [0, -66] : [170, 46];
      ctx.fillStyle = "#E23B3B"; ctx.strokeStyle = "#9E1F1F"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(bx, by + 30); ctx.bezierCurveTo(bx - 34, by + 6, bx - 26, by - 22, bx, by - 18); ctx.bezierCurveTo(bx + 26, by - 22, bx + 34, by + 6, bx, by + 30); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FFE08A"; for (const [dx, dy] of [[-8, -4], [8, 0], [-2, 10], [10, -10], [-12, 8]]) { ctx.beginPath(); ctx.arc(bx + dx, by + dy, 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = "#3E9B4F"; for (const a of [-0.7, 0, 0.7]) { ctx.save(); ctx.translate(bx, by - 18); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, -9, 6, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    }
    ctx.restore();
  }
  const BERRY_POS = { top: [0, -66], side: [170, 46] };

  // ---------- adegan: soal utuh ----------
  const SX = 99, SW = 330, SG = 18, SY = 175, SH = 300;   // lima kotak soal (ukuran penuh)
  function soal(ctx, b, l, t, TL) {
    board(ctx);
    const id = b.id, n = +id.slice(1);
    if (n <= 3) {
      const show = POS_AN.map((_, i) => n === 1 ? P(l, at(b, "Ada lima") + 0.6 + i * 0.45, 0.5) : 1);
      const num = POS_AN.map((_, i) => n === 1 ? 0 : n === 2 ? P(l, at(b, "berurutan") + i * 0.35, 0.4) : 1);
      const robots = [null, null, null, null, null], labels = [0, 0, 0, 0, 0];
      if (n === 3) {
        const keys = ["Hewan pertama", "Hewan kedua", "Hewan ketiga", "Hewan keempat", "Hewan kelima"];
        keys.forEach((kk, i) => {
          const t0 = at(b, kk), u = P(l, t0, 0.5); labels[i] = u;
          if (u > 0) { const st = STATE(i + 1, false); robots[i] = { ...st, alpha: u, glow: i === 2 ? "btnBody" : PART_OF[i], glowA: blink(l, t0 + 0.3) }; }
        });
      }
      strip(ctx, { x: SX, y: SY, w: SW, h: SH, gap: SG, show, num, robots, labels, labelSize: 34 });
      if (n === 1) { const u = P(l, at(b, "robot mainan"), 0.6); if (u > 0) hand(ctx, "jalur perakitan robot mainan", 960, 640, 54, { alpha: u }); }
      if (n === 2) { mline(ctx, [[SX + 40, 620], [SX + 5 * SW + 4 * SG - 40, 620]], P(l, at(b, "berurutan"), 2.2), ORANGE, 8, true); hand(ctx, "urutan kerja", 960, 700, 46, { alpha: P(l, at(b, "dari kotak"), 0.6) }); }
      if (n === 3) mline(ctx, [[SX + 40, 600], [SX + 5 * SW + 4 * SG - 40, 600]], 1, "#C9D2D8", 6, true);
      return;
    }
    // s4–s7: lima kotak mengecil di atas kiri; dua robot di bawahnya; pertanyaan dan pilihan di kanan
    const sc = 0.55;
    ctx.save(); ctx.translate(76, 150); ctx.scale(sc, sc); ctx.translate(-SX, -SY);
    strip(ctx, { x: SX, y: SY, w: SW, h: SH, gap: SG, robots: POS_AN.map((_, i) => STATE(i + 1, false)), labels: [1, 1, 1, 1, 1], labelSize: 50 });
    ctx.restore();
    const gu = n === 4 ? P(l, at(b, "seharusnya"), 0.6) : 1;
    frame(ctx, 90, 400, 420, 410, "Seharusnya", true, gu);
    if (gu > 0) robot(ctx, 300, 612, 330, { ...GOOD, alpha: gu, hi: n === 4 ? { btnBody: P(l, at(b, "Tiga kancingnya"), 0.7) } : null, hiColor: GREEN });
    const bu = n === 5 ? P(l, 0.3, 0.6) : n > 5 ? 1 : 0;
    frame(ctx, 570, 400, 420, 410, "Hasilnya", false, bu);
    if (bu > 0) robot(ctx, 780, 612, 330, { ...BAD, alpha: bu });
    if (n >= 6) {
      const qu = n === 6 ? P(l, 0.2, 0.6) : 1;
      ctx.save(); ctx.globalAlpha = qu;
      card(ctx, 1050, 160, 790, 170, { fill: "#FFFFFF", stroke: ORANGE, lw: 4, r: 18 });
      text(ctx, "PERTANYAAN", 1445, 205, 26, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "Hewan mana yang tidak melakukan", 1445, 256, 38, { align: "center", weight: 800, color: INK });
      text(ctx, "tugasnya dengan benar?", 1445, 304, 38, { align: "center", weight: 800, color: INK });
      ctx.restore();
      OPT.forEach(([L, an], i) => {
        const u = n === 6 ? P(l, at(b, "Pilihan " + L), 0.5) : 1; if (u <= 0) return;
        animal(ctx, an, 1150 + i * 196, 520, 210, { label: L, alpha: u, name: true, nameSize: 30 });
      });
    }
  }

  // soal untuk layar vertikal (Short; b.id = beat asal). s3/h1: lima pos dua baris, potong [540, 140, 840, 600]; h2: dua robot + pilihan A–D, potong [480, 140, 960, 690]
  function soal_v(ctx, b, l, t, TL) {
    board(ctx);
    if (b.id === "s3") {   // Short h1 (id = beat asal)
      const w = 264, h = 226, rows = [[0, 1, 2], [3, 4]];
      rows.forEach((r, ri) => r.forEach((i, j) => {
        const x = 960 - (r.length * w + (r.length - 1) * 14) / 2 + j * (w + 14), y = 156 + ri * (h + 62);
        card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#8D99A3", lw: 3, r: 10 });
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + 22, y + 22, 17, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 22, y + 30, 22, { align: "center", color: "#fff", weight: 900 });
        robot(ctx, x + w * 0.31, y + h * 0.55, h * 0.66, STATE(i + 1, false)); animal(ctx, POS_AN[i], x + w * 0.72, y + h * 0.52, h * 0.74);
        text(ctx, TASK[i], x + w / 2, y + h + 38, 32, { align: "center", weight: 800, color: INK, fit: w + 10 });
      }));
      return;
    }
    frame(ctx, 500, 170, 420, 400, "Seharusnya", true); robot(ctx, 710, 372, 320, GOOD);
    frame(ctx, 1000, 170, 420, 400, "Hasilnya", false); robot(ctx, 1210, 372, 320, BAD);
    OPT.forEach(([L, an], i) => animal(ctx, an, 960 + (i - 1.5) * 225, 660, 150, { label: L, name: true, nameSize: 28 }));
  }

  // ---------- adegan: kata penting ----------
  function bread(ctx, x, y, s, step) {   // roti isi: 1 roti, 2 + selai, 3 + roti penutup
    const k = s / 160; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = "#E6B873"; ctx.strokeStyle = "#A8743F"; ctx.lineWidth = 3; rr(ctx, -70, 0, 140, 26, 10); ctx.fill(); ctx.stroke();
    if (step >= 2) { ctx.fillStyle = "#C8283C"; rr(ctx, -66, -10, 132, 12, 6); ctx.fill(); }
    if (step >= 3) { ctx.fillStyle = "#E6B873"; ctx.beginPath(); ctx.moveTo(-70, -10); ctx.quadraticCurveTo(-70, -44, 0, -44); ctx.quadraticCurveTo(70, -44, 70, -10); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  function belt(ctx, x0, x1, y, l, moving) {
    ctx.fillStyle = "#5C6770"; rr(ctx, x0, y, x1 - x0, 34, 17); ctx.fill();
    ctx.fillStyle = "#8D99A3"; for (let x = x0 + 30; x < x1 - 10; x += 70) { ctx.beginPath(); ctx.arc(x, y + 17, 10, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = "#3E4850"; ctx.lineWidth = 3; const off = moving ? (l * 60) % 50 : 0;
    for (let x = x0 + 20 + off; x < x1 - 10; x += 50) { ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x - 10, y + 32); ctx.stroke(); }
  }
  function kata(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "k1") {
      hand(ctx, "Kata-kata penting", 960, 330, 84, { color: INK, alpha: P(l, 0.3, 0.8) });
      mline(ctx, [[600, 360], [1320, 360]], P(l, 1.0, 0.8), ORANGE, 8);
      kiko(ctx, 960, 590, 200, 0, { mood: "happy" });
      return;
    }
    if (id === "k2") {
      const X = [520, 960, 1400];
      belt(ctx, 200, 1720, 610, l, true);
      X.forEach((x, i) => { kid(ctx, x, 360, 92, { hair: i === 1 ? "long" : undefined }); text(ctx, "pekerja " + (i + 1), x, 492, 28, { align: "center", weight: 800, color: C.ink2 }); });
      // barang (kotak) berjalan dari kiri ke kanan; setiap pekerja menambah satu bagian
      const T = b.audio || b.dur, u = clamp((l - 1.0) / Math.max(4, T - 2), 0, 1), bx = lerp(260, 1660, u);
      ctx.fillStyle = "#E7C48A"; ctx.strokeStyle = "#A8743F"; ctx.lineWidth = 3; rr(ctx, bx - 50, 540, 100, 70, 6); ctx.fill(); ctx.stroke();
      X.forEach((x, i) => { if (bx > x) { ctx.fillStyle = [BRED, BYEL, BGRN][i]; ctx.beginPath(); ctx.arc(bx - 28 + i * 28, 575, 11, 0, Math.PI * 2); ctx.fill(); } });
      hand(ctx, "jalur perakitan", 960, 730, 60, { alpha: P(l, 0.4, 0.6) });
      hand(ctx, "satu pekerja = satu bagian", 960, 800, 40, { color: INK, alpha: P(l, at(b, "Setiap pekerja"), 0.6) });
      return;
    }
    if (id === "k3") {
      const X = [560, 960, 1360], ph = ["Orang pertama", "Orang kedua", "Orang ketiga"], lab = ["roti", "+ selai", "+ roti penutup"];
      ctx.fillStyle = "#C98A57"; rr(ctx, 300, 520, 1320, 30, 10); ctx.fill(); ctx.fillStyle = "#A4653A"; ctx.fillRect(330, 550, 26, 160); ctx.fillRect(1564, 550, 26, 160);
      X.forEach((x, i) => {
        const u = P(l, at(b, ph[i]), 0.5);
        kid(ctx, x, 330, 92, { hair: i === 1 ? "long" : undefined });
        if (u > 0) { ctx.save(); ctx.globalAlpha = u; bread(ctx, x, 494, 170, i + 1); text(ctx, lab[i], x, 610, 34, { align: "center", weight: 800, color: INK }); ctx.restore(); }
        if (i < 2) mline(ctx, [[x + 100, 470], [X[i + 1] - 100, 470]], P(l, at(b, ph[i + 1]) - 0.4, 0.5), ORANGE, 6, true);
      });
      hand(ctx, "membuat roti isi di kantin", 960, 720, 46, { alpha: P(l, 0.4, 0.6) });
      return;
    }
    // k4, k5: bagian-bagian robot
    const rx = 960, ry = 480, rs = 560, kk = rs / 280;
    robot(ctx, rx, ry, rs, id === "k4" ? { body: true, head: true } : { ...GOOD });
    const LB = id === "k4"
      ? [["badan", "badan", [0, 40], [1260, 480]], ["lengan", "dua lengan", [-82, 30], [620, 470]], ["kaki", "dua kaki", [12, 120], [1260, 700]], ["kepala", "satu kepala", [50, -110], [1260, 260]]]
      : [["mata", "dua mata", [24, -108], [1300, 230]], ["mulut", "satu mulut", [-14, -80], [600, 300]], ["kancing", "tiga kancing", [22, 10], [1300, 470]]];
    const prev = id === "k5" ? [["badan", [1260, 560]], ["lengan", [600, 560]], ["kaki", [1260, 700]], ["kepala", [600, 200]]] : [];
    prev.forEach(([s, [x, y]]) => text(ctx, s, x, y, 34, { align: x > rx ? "left" : "right", weight: 700, color: "#9AA6AE" }));
    LB.forEach(([s, ph, [dx, dy], [lx, ly]]) => {
      const u = P(l, at(b, ph), 0.5); if (u <= 0) return;
      const px = rx + dx * kk, py = ry + dy * kk, right = lx > rx;
      mline(ctx, [[right ? lx - 14 : lx + 14, ly - 12], [px, py]], u, ORANGE, 4);
      ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(px, py, 7 * u, 0, Math.PI * 2); ctx.fill();
      hand(ctx, s, lx, ly, 46, { align: right ? "left" : "right", alpha: u, color: INK });
    });
    if (id === "k5") {   // kaca pembesar pada kancing
      const u = P(l, at(b, "Warnanya"), 0.6);
      if (u > 0) {
        ctx.save(); ctx.globalAlpha = u; const cx = 1560, cy = 640;
        ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, 120, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - 86, cy + 86); ctx.lineTo(cx - 140, cy + 140); ctx.stroke();
        ctx.fillStyle = RG; ctx.fillRect(cx - 110, cy - 50, 220, 100);
        [[-60, BRED, "merah"], [0, BYEL, "kuning"], [60, BGRN, "hijau"]].forEach(([dx, c, nm], i) => {
          const v = P(l, at(b, nm), 0.4);
          ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx + dx, cy - 6, 22, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = u * v; text(ctx, nm, cx + dx, cy + 40, 22, { align: "center", weight: 800, color: INK }); ctx.globalAlpha = u;
        });
        ctx.restore();
      }
    }
  }

  // ---------- adegan: pemanasan kue ----------
  const WX = [520, 960, 1400], WNAMA = ["Dito", "Sinta", "Kiko"];
  function worker(ctx, i, x, y, s, o = {}) {
    if (i === 2) kiko(ctx, x, y + s * 0.15, s * 1.25, 0, { mood: o.mood || "happy" });
    else kid(ctx, x, y - s * 0.1, s * 0.8, { hair: i === 1 ? "long" : undefined });
  }
  function kue(ctx, b, l) {
    board(ctx);
    const n = +b.id.slice(1);
    if (n === 8) {   // papan dihapus, lalu lima pos muncul
      const w = P(l, at(b, "Bedanya"), 1.4);
      if (w < 1) {
        ctx.save(); ctx.globalAlpha = 1 - w; WX.forEach((x, i) => { worker(ctx, i, x, 300, 120); }); ctx.restore();
        if (w > 0) { const ex = lerp(400, 1500, w); ctx.fillStyle = "#4B5A66"; rr(ctx, ex - 90, 330, 180, 70, 12); ctx.fill(); ctx.fillStyle = "#E9E3D2"; rr(ctx, ex - 90, 390, 180, 26, 8); ctx.fill(); }
      }
      if (w > 0.5) { ctx.save(); ctx.globalAlpha = clamp((w - 0.5) * 2, 0, 1); strip(ctx, { x: SX, y: 250, w: SW, h: SH, gap: SG, num: [1, 1, 1, 1, 1], robots: POS_AN.map((_, i) => STATE(i + 1, false)) }); ctx.restore(); }
      return;
    }
    if (n === 7) {
      const ph = [["bandingkan", "1. Bandingkan."], ["menemukan", "2. Cari bagian yang berbeda."], ["lalu mencari", "3. Cari siapa yang mengerjakannya."]];
      kiko(ctx, 330, 500, 220, 0, { mood: "happy" });
      hand(ctx, "Kita tidak menebak!", 1060, 250, 58, { color: GREEN, alpha: P(l, 0.3, 0.6) });
      ph.forEach(([k2, s], i) => hand(ctx, s, 560, 400 + i * 130, 56, { align: "left", color: i === 2 ? ORANGE : INK, alpha: P(l, at(b, k2), 0.6) }));
      return;
    }
    // baris atas: tiga pekerja + tugasnya
    const TASKS = ["menaruh kue", "mengoles krim", "menaruh stroberi"];
    const marks = [0, 0, 0];
    if (n >= 5) { marks[0] = n === 5 ? P(l, at(b, "Dito sudah"), 0.6) : 1; marks[1] = n === 5 ? P(l, at(b, "Sinta juga"), 0.6) : 1; }
    const bad = n === 6 ? P(l, at(b, "akulah"), 0.6) : n > 6 ? 1 : 0;
    WX.forEach((x, i) => {
      const u = n === 1 ? P(l, at(b, "tiga teman") + i * 0.5, 0.5) : 1; if (u <= 0) return;
      const hi = n === 6 && i === 2 && l > at(b, "Siapa yang");
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, x - 200, 150, 400, 300, { fill: hi ? "#FFF6E8" : "#F7F9FA", stroke: hi ? ORANGE : "#C9D2D8", lw: hi ? 5 : 2.5, r: 16 });
      worker(ctx, i, x - 80, 285, 120, { mood: i === 2 && bad > 0 ? "confused" : "happy" });
      text(ctx, WNAMA[i], x - 80, 432, 34, { align: "center", weight: 900, color: INK });
      const tu = n === 1 ? 0 : n === 2 ? P(l, at(b, WNAMA[i] + " bertugas"), 0.5) : 1;
      if (tu > 0) {
        ctx.globalAlpha = u * tu;
        if (i === 0) cake(ctx, x + 100, 300, 140, {});
        if (i === 1) cake(ctx, x + 100, 300, 140, { cream: true });
        if (i === 2) cake(ctx, x + 100, 300, 140, { cream: true, berry: "top" });
        text(ctx, TASKS[i], x + 100, 410, 24, { align: "center", weight: 800, color: C.ink2, fit: 190 });
      }
      ctx.restore();
      if (marks[i] > 0) tick(ctx, x + 150, 190, 60, marks[i], GREEN, 10);
      if (i === 2 && bad > 0) cross(ctx, x + 150, 190, 54, bad, ORANGE, 10);
    });
    // baris bawah: kue seharusnya dan kue hasilnya
    const gu = n === 3 ? P(l, 0.3, 0.6) : n > 3 ? 1 : 0, ru = n === 4 ? P(l, 0.3, 0.6) : n > 4 ? 1 : 0;
    frame(ctx, 330, 500, 560, 310, "Seharusnya", true, gu);
    if (gu > 0) { ctx.save(); ctx.globalAlpha = gu; cake(ctx, 610, 640, 260, { cream: true, berry: "top" }); ctx.restore(); }
    frame(ctx, 1030, 500, 560, 310, "Hasilnya", false, ru);
    if (ru > 0) { ctx.save(); ctx.globalAlpha = ru; cake(ctx, 1270, 640, 260, { cream: true, berry: "side" }); ctx.restore(); }
    const k = 260 / 260;
    if (n === 5) {
      ring(ctx, 610, 655, 110, 52, P(l, at(b, "Kuenya ada"), 0.6), GREEN); ring(ctx, 1270, 655, 110, 52, P(l, at(b, "Kuenya ada"), 0.6), GREEN);
      ring(ctx, 610, 615, 110, 34, P(l, at(b, "Krimnya"), 0.6), GREEN); ring(ctx, 1270, 615, 110, 34, P(l, at(b, "Krimnya"), 0.6), GREEN);
    }
    if (n >= 6) {
      const ru2 = n === 6 ? P(l, 0.2, 0.6) : 1;
      ring(ctx, 610 + BERRY_POS.top[0] * k, 640 + BERRY_POS.top[1] * k, 46, 46, ru2); ring(ctx, 1270 + BERRY_POS.side[0] * k, 640 + BERRY_POS.side[1] * k, 46, 46, ru2);
      if (n === 6) mline(ctx, [[1270 + 170, 640], [1500, 480], [WX[2] + 100, 420]], P(l, at(b, "Siapa yang"), 0.8), ORANGE, 5, true, [14, 12]);
    }
  }

  // ---------- adegan: tiga langkah ----------
  function stepIcon(ctx, i, x, y) {
    if (i === 0) { robot(ctx, x - 40, y, 90, GOOD); robot(ctx, x + 40, y, 90, BAD); }
    if (i === 1) { tick(ctx, x - 34, y, 50, 1, GREEN, 8); cross(ctx, x + 36, y, 40, 1, ORANGE, 8); }
    if (i === 2) { ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x - 10, y - 10, 30, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 12, y + 12); ctx.lineTo(x + 40, y + 40); ctx.stroke(); }
  }
  function steps3(ctx, b, l, phs, big) {
    const LBL = ["Bandingkan hasil dengan yang seharusnya.", "Periksa setiap pos: centang atau silang.", "Pos yang mendapat silang adalah yang salah."];
    text(ctx, "TIGA LANGKAH", 960, 200, 40, { align: "center", weight: 900, color: C.accentDark });
    LBL.forEach((s, i) => {
      const u = phs[i] == null ? 1 : P(l, phs[i], 0.6); if (u <= 0) return;
      const y = 240 + i * 180, on = big === i;
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, 200, y, 1520, 150, { fill: on ? "#FFF1DF" : "#F3F6F8", stroke: on ? ORANGE : "#B8C3CA", lw: on ? 5 : 3, r: 75 });
      ctx.fillStyle = on ? ORANGE : C.kiko; ctx.beginPath(); ctx.arc(278, y + 75, 50, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), 278, y + 96, 58, { align: "center", color: "#fff", weight: 900 });
      text(ctx, s, 360, y + 92, 48, { weight: 900, color: INK, fit: 1120 });
      stepIcon(ctx, i, 1600, y + 75);
      ctx.restore();
    });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const n = +b.id.slice(1);
    const phs = [n === 1 ? at(b, "Langkah pertama") : null, n === 2 ? at(b, "Langkah kedua") : n < 2 ? Infinity : null, n === 3 ? at(b, "Langkah ketiga") : n < 3 ? Infinity : null];
    steps3(ctx, b, l, phs, n - 1);
  }

  // ---------- adegan: membandingkan dua robot ----------
  const CL = 570, CR = 1350, CY = 432, CS = 430;   // pusat robot kiri/kanan, tinggi robot
  function banding(ctx, b, l) {
    board(ctx);
    const n = +b.id.slice(1), k = CS / 280;
    frame(ctx, 330, 165, 480, 510, "Seharusnya", true); frame(ctx, 1110, 165, 480, 510, "Hasilnya", false);
    // daftar periksa di kiri
    const ROWS = [["badan", "Kedua robot punya badan"], ["lengan", "dua lengan"], ["kaki", "dan dua kaki"], ["kepala", "Kedua robot punya kepala"], ["mata", "dua mata"], ["mulut", "satu mulut"], ["kancing", "lihat kancingnya"]];
    card(ctx, 70, 150, 230, 530, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 16 });
    text(ctx, "Sama?", 185, 192, 30, { align: "center", weight: 900, color: INK });
    const done = { 2: 3, 3: 6, 4: 7, 5: 7 }[n] || 0;
    ROWS.forEach(([s, ph], i) => {
      const y = 240 + i * 62;
      text(ctx, s, 92, y + 12, 30, { weight: 800, color: i === 6 && n >= 4 ? ORANGE : INK });
      let u = 0;
      if (i < done) u = 1;
      const cur = (n === 2 && i < 3) || (n === 3 && i >= 3 && i < 6) || (n === 4 && i === 6);
      if (cur) u = P(l, at(b, ph) + 0.5, 0.5);
      if (u > 0) { if (i === 6) cross(ctx, 262, y, 34, u, ORANGE, 7); else tick(ctx, 262, y, 40, u, GREEN, 7); }
    });
    // sorotan bagian yang sedang dibandingkan
    const hiL = {}, hiR = {};
    if (n === 2) { const u = P(l, at(b, "Kedua robot punya badan"), 0.6); hiL.body = hiR.body = u; }
    if (n === 3) { const u = P(l, at(b, "kepala"), 0.6), v = P(l, at(b, "dua mata"), 0.6), w = P(l, at(b, "satu mulut"), 0.6); hiL.head = hiR.head = u * (1 - v); hiL.eyes = hiR.eyes = v * (1 - w); hiL.mouth = hiR.mouth = w; }
    robot(ctx, CL, CY, CS, { ...GOOD }); robot(ctx, CR, CY, CS, { ...BAD });
    for (const p in hiL) { ringPart(ctx, CL, CY, CS, p, hiL[p], GREEN); ringPart(ctx, CR, CY, CS, p, hiR[p], GREEN); }
    if (n === 2) eqSign(ctx, 960, CY + 60, 70, P(l, at(b, "Bagian ini sama"), 0.5));
    if (n === 3) eqSign(ctx, 960, CY - 170, 70, P(l, at(b, "Bagian ini juga"), 0.5));
    if (n >= 4) {
      const a = n === 4 ? P(l, at(b, "Pada robot yang seharusnya"), 0.7) : 1, q = n === 4 ? P(l, at(b, "badannya polos"), 0.5) : 1, c = n === 4 ? P(l, at(b, "justru ada di kaki"), 0.7) : 1;
      ringPart(ctx, CL, CY, CS, "btnBody", a, GREEN, 7);
      if (q > 0) { ctx.save(); ctx.globalAlpha = q * (n === 4 ? 1 : 0.9); text(ctx, "?", CR + 2, CY + 10 * k + 22, 64, { align: "center", weight: 900, color: ORANGE }); ctx.restore(); }
      ringPart(ctx, CR, CY, CS, "btnLeg", c, ORANGE, 7);
      if (c > 0) { mline(ctx, [[CR - 37 * k - 10, CY + 96 * k], [1135, CY + 96 * k]], c, ORANGE, 5); hand(ctx, "di kaki", 1135, CY + 96 * k - 14, 36, { align: "left", alpha: c }); }
      neqSign(ctx, 960, CY + 60, 74, c);
    }
    if (n === 1) hourglass(ctx, 1730, 450, Math.max(0, l - (b.audio || 0)), 6, P(l, at(b, "Bagian mana"), 0.5));
    if (n === 5) {
      const u = P(l, at(b, "yaitu kancingnya"), 0.6);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; card(ctx, 1625, 260, 225, 300, { fill: "#FFF1DF", stroke: ORANGE, lw: 4, r: 18 });
        text(ctx, "Yang berbeda:", 1737, 310, 26, { align: "center", weight: 900, color: INK }); text(ctx, "kancing", 1737, 370, 44, { align: "center", weight: 900, color: ORANGE });
        [[-46, BRED], [0, BYEL], [46, BGRN]].forEach(([dx, cc]) => { ctx.fillStyle = cc; ctx.beginPath(); ctx.arc(1737 + dx, 460, 18, 0, Math.PI * 2); ctx.fill(); }); ctx.restore(); }
    }
    stepsStrip(ctx, 1);
  }

  // ---------- adegan: memeriksa setiap pos ----------
  const PX = 76, PW = 296, PG = 14, PY = 165, PH = 330;
  function pos(ctx, b, l) {
    board(ctx);
    const n = +b.id.slice(1);
    // pos yang sudah diperiksa sebelum beat ini dan yang diperiksa di beat ini
    const CHECK = { p2: 0, p3: 1, p5: 2, p7: 3, p8: 4 };
    const before = { p1: [], p2: [], p3: [0], p4: [0, 1], p5: [0, 1], p6: [0, 1, 2], p7: [0, 1, 2], p8: [0, 1, 2, 3] }[b.id];
    const cur = CHECK[b.id], t0 = cur != null ? (cur === 2 ? at(b, "Kita sudah tahu") : at(b, "Di pos")) : 0;
    const robots = [null, null, null, null, null], marks = [null, null, null, null, null], hi = {}, cover = [0, 0, 0, 0, 0], labels = [1, 1, 1, 1, 1];
    before.forEach(i => { robots[i] = STATE(i + 1, true); marks[i] = [i === 2 ? "bad" : "ok", 1]; });
    if (b.id === "p4") { cover[2] = 1; hi[2] = 1; }
    let refHi = null, refA = 0;
    if (cur != null) {
      const ru = P(l, t0 + 0.3, 0.6), part = cur === 2 ? "btnLeg" : PART_OF[cur];
      hi[cur] = 1;
      robots[cur] = { ...STATE(cur + 1, true), alpha: ru };
      if (cur !== 2) { robots[cur].glow = part; robots[cur].glowA = blink(l, at(b, "Pada robot")); }
      cover[cur] = cur === 2 ? 1 - ru : 0;
      const markAt = cur === 2 ? at(b, "Jadi, monyet") : at(b, "Jadi,");
      marks[cur] = [cur === 2 ? "bad" : "ok", P(l, markAt, 0.6)];
      refHi = part; refA = cur === 2 ? P(l, at(b, "ada di kaki"), 0.6) : blink(l, at(b, "Pada robot"));
    }
    strip(ctx, { x: PX, y: PY, w: PW, h: PH, gap: PG, num: [1, 1, 1, 1, 1], robots, marks, hi, cover, labels, labelSize: 30, markDy: 118, markSize: 74 });
    if (cur === 2) { const rs = PH * 0.66, cx = PX + 2 * (PW + PG) + PW * 0.31, cy = PY + PH * 0.55; ringPart(ctx, cx, cy, rs, "btnLeg", P(l, at(b, "ada di kaki"), 0.6), ORANGE, 5); }
    // robot hasil sebagai pembanding (kanan)
    const RX = 1757, RY = 395, RS = 250;
    card(ctx, 1662, 165, 190, 470, { fill: "#FFFFFF", stroke: ORANGE, lw: 4, r: 16 });
    text(ctx, "Hasilnya", 1757, 205, 28, { align: "center", weight: 900, color: ORANGE });
    if (refHi && refHi !== "btnLeg") glowPart(ctx, RX, RY + 20, RS, refHi, refA);
    robot(ctx, RX, RY + 20, RS, BAD);
    if (refHi === "btnLeg") ringPart(ctx, RX, RY + 20, RS, "btnLeg", refA, ORANGE, 5);
    if (b.id === "p4") hourglassSmall(ctx, 1250, 640, Math.max(0, l - (b.audio || 0)), 6, P(l, at(b, "Coba pikirkan"), 0.5));
    if (b.id === "p6") { const u = P(l, 0.3, 0.6); hand(ctx, "Periksa sampai habis!", 1250, 660, 46, { alpha: u }); }
    stepsStrip(ctx, 2, b.id === "p6" ? 1 : 1);
  }

  // ---------- adegan: memeriksa jawaban ----------
  function cek(ctx, b, l) {
    board(ctx);
    const n = +b.id.slice(1);
    const ph = ["Pos pertama", "Pos kedua", "Pos ketiga", "Pos keempat", "Pos kelima"];
    const marks = POS_AN.map((_, i) => [i === 2 ? "bad" : "ok", n === 1 ? P(l, at(b, ph[i]), 0.5) : 1]);
    const sc = 0.5;
    ctx.save(); ctx.translate(960 - (5 * PW + 4 * PG) * sc / 2, 152); ctx.scale(sc, sc); ctx.translate(-PX, -PY);
    strip(ctx, { x: PX, y: PY, w: PW, h: PH, gap: PG, num: [1, 1, 1, 1, 1], robots: POS_AN.map((_, i) => STATE(i + 1, true)), marks, hi: n >= 2 ? { 2: 1 } : {}, labels: [1, 1, 1, 1, 1], labelSize: 44, markDy: 130, markSize: 90 });
    ctx.restore();
    if (n >= 2) {
      const u = n === 2 ? P(l, at(b, "jawabannya adalah B"), 0.6) : 1;
      OPT.forEach(([L, an], i) => {
        const x = 700 + (i - 1.5) * 250, y = 570, isB = L === "B";
        const a = n === 2 && !b.src_text ? P(l, at(b, "Jadi"), 0.6) : 1;   // di Short pilihan langsung tampil
        ctx.save(); ctx.globalAlpha = a; animal(ctx, an, x, y - 20, 160, { label: L, name: true, nameSize: 30 }); ctx.restore();
        if (isB && u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = GREEN; ctx.lineWidth = 8; rr(ctx, x - 100, y - 140, 200, 322, 26); ctx.stroke(); ctx.restore(); }
        else { const v = n === 3 ? P(l, at(b, AN[an].nama === "banteng" ? "Banteng" : AN[an].nama), 0.5) : n > 3 ? 1 : 0; if (v > 0) { ctx.save(); ctx.globalAlpha = 0.55 * v; ctx.fillStyle = "#FFFFFF"; rr(ctx, x - 110, y - 120, 220, 290, 16); ctx.fill(); ctx.restore(); tick(ctx, x + 70, y - 90, 44, v, GREEN, 7); } }
      });
      const ju = n === 2 ? P(l, at(b, "jawabannya adalah B"), 0.6) : 1;
      if (ju > 0) { ctx.save(); ctx.globalAlpha = ju; card(ctx, 1200, 520, 420, 110, { fill: C.goodBg, stroke: GREEN, lw: 5, r: 55 }); text(ctx, "Jawaban: B (monyet)", 1410, 588, 40, { align: "center", weight: 900, color: GREEN, fit: 390 }); ctx.restore(); }
    }
    // (tanpa strip langkah: pilihan jawaban butuh tempat)
  }

  // ---------- adegan: penutup ----------
  function debug(ctx, b, l) {
    board(ctx);
    const n = +b.id.slice(1);
    if (n === 1) {
      const u = P(l, at(b, "mencari kesalahan"), 0.6), v = P(l, at(b, "debugging"), 0.6);
      robot(ctx, 470, 470, 470, BAD);
      // kaca pembesar di atas kancing
      const k = 470 / 280, cx = 470 - 24 * k, cy = 470 + 96 * k;
      ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx + 44, cy + 44); ctx.lineTo(cx + 92, cy + 92); ctx.stroke(); ctx.restore();
      hand(ctx, "mencari kesalahan", 1250, 380, 70, { color: INK, alpha: u });
      text(ctx, "=", 1250, 480, 70, { align: "center", weight: 900, color: C.ink2 });
      ctx.save(); ctx.globalAlpha = v; text(ctx, "debugging", 1250, 600, 96, { align: "center", weight: 900, color: ORANGE }); ctx.restore();
      return;
    }
    if (n === 2) {
      const X0 = 160, W = 250, G = 30, Y = 230;
      const u = P(l, at(b, "Komputer"), 0.6), f = P(l, at(b, "lalu mencari langkah"), 0.6);
      ["badan", "kepala", "kancing", "mata", "mulut"].forEach((s, i) => {
        const x = X0 + i * (W + G), bad = i === 2 && l > at(b, "Kalau hasilnya");
        ctx.save(); ctx.globalAlpha = P(l, 0.3 + i * 0.3, 0.5);
        card(ctx, x, Y, W, 150, { fill: bad ? "#FFF1DF" : "#F3F6F8", stroke: bad ? ORANGE : "#B8C3CA", lw: bad ? 5 : 3, r: 16 });
        text(ctx, "Langkah " + (i + 1), x + W / 2, Y + 60, 34, { align: "center", weight: 900, color: bad ? ORANGE : INK });
        text(ctx, "pasang " + s, x + W / 2, Y + 110, 28, { align: "center", weight: 700, color: C.ink2 });
        ctx.restore();
        if (i < 4) mline(ctx, [[x + W + 4, Y + 75], [x + W + G - 4, Y + 75]], P(l, 0.5 + i * 0.3, 0.4), INK, 4, true);
      });
      hand(ctx, "program = langkah-langkah berurutan", 760, 470, 48, { color: INK, alpha: u });
      robot(ctx, 1650, 540, 230, BAD); text(ctx, "hasilnya salah", 1650, 700, 30, { align: "center", weight: 800, color: ORANGE });
      ringPart(ctx, 1650, 540, 230, "btnLeg", P(l, at(b, "Mereka melihat"), 0.6), ORANGE, 5);
      if (f > 0) { mline(ctx, [[1540, 620], [1000, 620], [X0 + 2 * (W + G) + W / 2, 395]], f, ORANGE, 6, true, [16, 12]); hand(ctx, "cari langkahnya", 1270, 600, 40, { alpha: f }); }
      return;
    }
    if (n === 3) {   // monyet memindahkan kancing dari kaki ke badan
      const k = 470 / 280, X = 960, Y = 450, m = P(l, 0.6, 2.2);
      animal(ctx, "monyet", 1450, 470, 300);
      robot(ctx, X, Y, 470, { ...BAD, btn: null });
      const from = [[-24, 80, BGRN], [-24, 97, BYEL], [-24, 114, BRED]], to = [[22, 10], [0, 10], [-22, 10]];
      from.forEach(([fx, fy, c], i) => { const x = X + lerp(fx, to[i][0], m) * k, y = Y + lerp(fy, to[i][1], m) * k - Math.sin(m * Math.PI) * 60; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 7.5 * k, 0, Math.PI * 2); ctx.fill(); });
      const ok = P(l, at(b, "Kancingnya kembali"), 0.6);
      if (ok > 0) { robot(ctx, 330, 470, 300, { ...GOOD, alpha: ok }); text(ctx, "Seharusnya", 330, 700, 32, { align: "center", weight: 900, color: GREEN, }); tick(ctx, 330, 230, 70, ok, GREEN, 11); tick(ctx, X, 160, 70, ok, GREEN, 11); text(ctx, "=", 640, 490, 80, { align: "center", weight: 900, color: GREEN }); }
      hand(ctx, "diperbaiki!", X, 790, 50, { color: GREEN, alpha: P(l, at(b, "diperbaiki"), 0.6) });
      return;
    }
  }
  function aturan(ctx, b, l) {
    board(ctx);
    steps3(ctx, b, l, [at(b, "Bandingkan"), at(b, "Periksa"), at(b, "Lalu, temukan")], -1);
  }

  Object.assign(K.SCENES, {
    soal, soal_v, kata, kue, langkah, banding, pos, cek, debug, aturan,
    buka(ctx, b, l, t, TL) {
      board(ctx);
      const first = b.id === "intro1";
      const u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(560, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1180, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[640, 330], [1720, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "lomba"), 0.8) : 1;
      [820, 1060, 1300, 1540].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) K.bebras.beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
      if (!first) hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1180, 760, 40, { color: ORANGE, alpha: P(l, at(b, "pelan"), 0.6) });
      kiko(ctx, 300, 520, 230, 0, { wave: l, mood: "happy" });
    },
    kredit(ctx, b, l, t, TL) {
      board(ctx);
      const u = P(l, 0.2, 0.6);
      ctx.save(); ctx.globalAlpha = u;
      const gx = 420, gy = 470, gr = 170;
      ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
      ctx.lineWidth = 3; for (const kk of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(kk * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
      for (const kk of [-0.5, 0, 0.5]) { const yy = gy + kk * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
      ctx.restore();
      const asli = JUDUL_ASLI;
      const rows = [["Judul soal", "Perakitan Robot", "berjudul"]];
      if (asli) rows.push(["Judul asli", asli, "berjudul"]);
      rows.push(["Tahun", "Bebras 2025", "berasal"], ["Dibuat oleh", "Tim Bebras Kanada", "dibuat oleh"], ["Kode soal", "2025-CA-01", "dibuat oleh"]);
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([kk, v, ph], i) => {
        const a = P(l, at(b, ph) + (kk === "Judul asli" || kk === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, kk, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: kk === "Dibuat oleh" ? ORANGE : INK });
        ctx.restore();
      });
      const ri = rows.findIndex(r => r[0] === "Dibuat oleh");
      const au = P(l, at(b, "Kanada"), 0.8); if (au > 0) ring(ctx, 1170, 300 + ri * 92 - 14, 210, 44, au);
    },
    akhir(ctx, b, l, t, TL) {
      board(ctx);
      kiko(ctx, 300, 470, 220, 0, { wave: l, mood: "happy" });
      robot(ctx, 640, 450 + Math.sin(l * 3) * 6, 330, GOOD);
      animal(ctx, "monyet", 920, 470, 230);
      card(ctx, 1150, 170, 680, 610, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1490, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const asli = JUDUL_ASLI;
      const L = [["Soal:", "Perakitan Robot"]]; if (asli) L.push(["Judul asli:", asli]);
      L.push(["Bebras:", "2025"], ["Kontributor:", "Kanada"], ["Kode soal:", "2025-CA-01"]);
      L.forEach(([kk, v], i) => { const y = 310 + i * 66; text(ctx, kk, 1190, y, 28, { weight: 700, color: C.ink2 }); text(ctx, v, 1420, y, 32, { weight: 900, color: kk === "Kontributor:" ? ORANGE : INK, fit: 390 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1490, 700, 26, 600, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 700, 760, 54, { color: ORANGE, alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l, t, TL) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "Perakitan Robot", 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras 2025-CA-01 · Kanada", 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Cara mencari langkah yang salah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      robot(ctx, 820, 640, 200, GOOD); animal(ctx, "monyet", 1100, 650, 190);
    },
  });
  K.b03 = { robot, animal, STATE };
})(typeof window !== "undefined" ? window : globalThis);
