/* SG03 Pembahasan Soal Bebras 2023-UA-02 "Minuman Favorit" (Ukraina), kategori Siaga.
   Gaya papan tulis putih dengan coretan spidol (sama dengan B01–B02, SG01) + simulasi:
   mesin penjual otomatis berisi sembilan kaleng bernomor, tabel hadir, dua baris daftar dengan kolom nomor 1–9
   (nomor yang ada di kedua daftar dilingkari), lalu diagram dua lingkaran (Senin, Selasa) yang diisi kaleng.
   Warna tetap: Dedi biru, Nur ungu, Joko hijau; lingkaran Senin oranye, lingkaran Selasa biru kehijauan.
   Papan: x 52–1868, y 130–830 (kartu narasi 3 baris mulai y≈840, 4 baris y≈783).
   Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Minuman Favorit", asli: "", tahun: "2023", negara: "Ukraina", kode: "2023-UA-02" };
  const OWN = { Dedi: "#2F6FD1", Nur: "#9B45C4", Joko: "#1E9050" };
  const OWNL = { Dedi: "#DCE8FA", Nur: "#F1E1F8", Joko: "#DDF2E4" };
  const DAY = { SENIN: "#E07A12", SELASA: "#16808F" };
  const MON = [1, 2, 3, 5, 8, 9], TUE = [1, 4, 5, 6, 7, 9];
  const FAV = { Dedi: [2, 3, 8], Nur: [1, 5, 9], Joko: [4, 6, 7] };
  const owner = n => Object.keys(FAV).find(k => FAV[k].includes(n));
  const OPTS = [
    [[1, 2, 5], [3, 8, 9], [4, 6, 7]],
    [[1, 2, 3], [5, 8, 9], [4, 6, 7]],
    [[1, 3, 9], [2, 5, 8], [4, 6, 7]],
    [[2, 3, 8], [1, 5, 9], [4, 6, 7]],
  ];
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

  // ---------- benda: kaleng, mesin, orang, label ----------
  const CANC = { 1: ["#2E2E33", "#E9E9EC"], 2: ["#86C8EA", "#FFFFFF"], 3: ["#F28A26", "#FFD84A"], 4: ["#C7D94A", "#7BA62E"],
                 5: ["#2C6CC2", "#BFE0FF"], 6: ["#D6352D", "#FFB3A8"], 7: ["#6B2C80", "#D3A6E3"], 8: ["#3D9C49", "#C2E8AE"], 9: ["#6A3B22", "#D2A27A"] };
  // kaleng bernomor; cx,cy = pusat; h = tinggi. Nomor besar di lingkaran putih (tidak tertutup apa pun).
  function can(ctx, n, cx, cy, h, opt = {}) {
    const w = h * 0.64, [body, acc] = CANC[n];
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    if (opt.back) { ctx.fillStyle = opt.back; rr(ctx, cx - w / 2 - h * 0.12, cy - h / 2 - h * 0.1, w + h * 0.24, h * 1.2, h * 0.14); ctx.fill(); }
    if (opt.edge) { ctx.strokeStyle = opt.edge; ctx.lineWidth = Math.max(3, h * 0.05); rr(ctx, cx - w / 2 - h * 0.12, cy - h / 2 - h * 0.1, w + h * 0.24, h * 1.2, h * 0.14); ctx.stroke(); }
    ctx.fillStyle = body; rr(ctx, cx - w / 2, cy - h / 2, w, h, w * 0.18); ctx.fill();
    ctx.fillStyle = "#C9D1D6"; rr(ctx, cx - w / 2 + w * 0.06, cy - h / 2 - h * 0.03, w * 0.88, h * 0.09, h * 0.04); ctx.fill();
    ctx.fillStyle = acc; ctx.fillRect(cx - w / 2, cy - h * 0.2, w, h * 0.4);
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.fillRect(cx - w / 2 + w * 0.12, cy - h / 2 + h * 0.08, w * 0.1, h * 0.84);
    ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = Math.max(1.5, h * 0.02); rr(ctx, cx - w / 2, cy - h / 2, w, h, w * 0.18); ctx.stroke();
    const r = w * 0.4; ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = Math.max(1.5, h * 0.025);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    text(ctx, String(n), cx, cy + r * 0.52, r * 1.45, { align: "center", weight: 900, color: INK });
    ctx.restore();
  }
  function slot(ctx, n, cx, cy, h, opt = {}) {   // tempat kosong bergaris putus-putus dengan nomor samar
    const w = h * 0.64;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.setLineDash([10, 9]); ctx.strokeStyle = "#B4BEC5"; ctx.lineWidth = 3; rr(ctx, cx - w / 2, cy - h / 2, w, h, w * 0.18); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, String(n), cx, cy + h * 0.13, h * 0.36, { align: "center", weight: 800, color: "#C2CBD1" });
    ctx.restore();
  }
  function chip(ctx, name, cx, cy, size = 34, opt = {}) {   // label nama berwarna pemilik
    const col = opt.color || OWN[name] || INK, w = tw(ctx, name, size, 900) + size * 1.1, h = size * 1.55;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = opt.light ? "#FFFFFF" : col; ctx.strokeStyle = col; ctx.lineWidth = 4; rr(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
    text(ctx, name, cx, cy + size * 0.36, size, { align: "center", weight: 900, color: opt.light ? col : "#FFFFFF" });
    ctx.restore();
    return w;
  }
  function dayPill(ctx, day, x, y, size = 32, opt = {}) {   // x = kiri, y = pusat
    const w = tw(ctx, day, size, 900) + size * 1.2, h = size * 1.6;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = DAY[day]; rr(ctx, x, y - h / 2, w, h, 12); ctx.fill();
    text(ctx, day, x + w / 2, y + size * 0.36, size, { align: "center", weight: 900, color: "#fff" });
    ctx.restore(); return w;
  }
  function person(ctx, name, cx, cy, s, opt = {}) {   // orang dewasa sederhana; cy = pusat badan
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(0, s * 0.62, s * 0.5, s * 0.09, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3C4652"; rr(ctx, -s * 0.28, s * 0.2, s * 0.56, s * 0.42, s * 0.08); ctx.fill();
    ctx.fillStyle = OWN[name]; rr(ctx, -s * 0.4, -s * 0.3, s * 0.8, s * 0.62, s * 0.16); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-s * 0.13, -s * 0.3); ctx.lineTo(0, -s * 0.14); ctx.lineTo(s * 0.13, -s * 0.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(0, -s * 0.58, s * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.hair;
    if (name === "Nur") { ctx.beginPath(); ctx.arc(0, -s * 0.64, s * 0.32, Math.PI, 0); ctx.fill(); ctx.fillRect(-s * 0.32, -s * 0.66, s * 0.11, s * 0.5); ctx.fillRect(s * 0.21, -s * 0.66, s * 0.11, s * 0.5); }
    else if (name === "Joko") { ctx.beginPath(); ctx.arc(0, -s * 0.66, s * 0.3, Math.PI * 1.05, -0.05); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(0, -s * 0.64, s * 0.31, Math.PI, 0); ctx.fill(); ctx.fillRect(-s * 0.31, -s * 0.66, s * 0.62, s * 0.06); }
    ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(-s * 0.1, -s * 0.56, s * 0.032, 0, Math.PI * 2); ctx.arc(s * 0.1, -s * 0.56, s * 0.032, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.025; ctx.beginPath(); ctx.arc(0, -s * 0.5, s * 0.08, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    ctx.restore();
  }
  // mesin penjual otomatis (digambar ulang): x,y kiri atas; w lebar; tinggi = w * 1.62
  function machine(ctx, x, y, w, opt = {}) {
    const h = w * 1.62, side = w * 0.09;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = "#A92A25"; ctx.beginPath(); ctx.moveTo(x + w, y + side * 0.6); ctx.lineTo(x + w + side, y); ctx.lineTo(x + w + side, y + h - side); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#D83A34"; rr(ctx, x, y + side * 0.6, w, h - side * 0.6, 10); ctx.fill();
    ctx.strokeStyle = "#8E201C"; ctx.lineWidth = 3; ctx.stroke();
    const gx = x + w * 0.07, gy = y + w * 0.1, gw = w * 0.86, gh = w * 0.96;
    ctx.fillStyle = "#F4F8FB"; rr(ctx, gx, gy, gw, gh, 8); ctx.fill(); ctx.strokeStyle = "#8E201C"; ctx.lineWidth = 3; ctx.stroke();
    const rowH = gh / 3, colW = gw / 3, ch = Math.min(rowH * 0.66, colW * 1.25);
    for (let r = 0; r < 3; r++) {
      ctx.fillStyle = "#3D8FD6"; ctx.fillRect(gx + 4, gy + rowH * (r + 1) - rowH * 0.1, gw - 8, rowH * 0.07);
      for (let c = 0; c < 3; c++) {
        const n = r * 3 + c + 1, cx = gx + colW * (c + 0.5), cy = gy + rowH * r + rowH * 0.46;
        const o = opt.owner ? owner(n) : null, lit = opt.lit ? opt.lit(n) : 0, show = opt.show ? opt.show(n) : 1;
        if (lit > 0) { ctx.save(); ctx.globalAlpha *= lit; ctx.fillStyle = "rgba(242,177,52,0.45)"; rr(ctx, cx - colW * 0.46, cy - ch * 0.62, colW * 0.92, ch * 1.24, 10); ctx.fill(); ctx.restore(); }
        can(ctx, n, cx, cy, ch, { back: o && opt.owner(n) > 0 ? OWNL[o] : null, edge: o && opt.owner(n) > 0 ? OWN[o] : null, alpha: show });
      }
    }
    const py = gy + gh + w * 0.06;
    ctx.fillStyle = "#7FC4E8"; rr(ctx, gx, py, gw * 0.48, w * 0.3, 6); ctx.fill();
    ctx.fillStyle = "#6DB36A"; ctx.beginPath(); ctx.moveTo(gx, py + w * 0.3); ctx.lineTo(gx + gw * 0.18, py + w * 0.14); ctx.lineTo(gx + gw * 0.32, py + w * 0.22); ctx.lineTo(gx + gw * 0.48, py + w * 0.12); ctx.lineTo(gx + gw * 0.48, py + w * 0.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#555E66"; rr(ctx, gx + gw * 0.6, py, gw * 0.25, w * 0.14, 5); ctx.fill();
    ctx.fillStyle = "#3B4249"; rr(ctx, gx + gw * 0.62, py + w * 0.18, gw * 0.2, w * 0.1, 4); ctx.fill();
    ctx.fillStyle = "#5B636B"; rr(ctx, gx, y + h - w * 0.3, gw, w * 0.18, 6); ctx.fill();
    ctx.fillStyle = "#2D3338"; rr(ctx, gx + gw * 0.08, y + h - w * 0.25, gw * 0.84, w * 0.06, 4); ctx.fill();
    ctx.restore();
  }
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
  function magnifier(ctx, x, y, r) {
    ctx.save();
    ctx.fillStyle = "rgba(47,127,209,0.10)"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 7; ctx.stroke();
    const a = Math.PI * 0.25, hx = x + r * Math.cos(a), hy = y + r * Math.sin(a);
    ctx.strokeStyle = "#5B4636"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hx + 4, hy + 4); ctx.lineTo(hx + 40, hy + 36); ctx.stroke();
    ctx.restore();
  }
  function canRow(ctx, nums, x0, cy, h, step, opt = {}) {   // deretan kaleng mulai x0 (pusat kaleng pertama)
    nums.forEach((n, i) => can(ctx, n, x0 + i * step, cy, h, { alpha: opt.show ? opt.show(i, n) : 1, back: opt.back ? opt.back(n) : null, edge: opt.edge ? opt.edge(n) : null }));
  }

  // ---------- soal utuh ----------
  function soal(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal1", "soal1b", "soal2", "soal3", "soal4"], b, l);
    // mesin
    const s1 = ord("soal1", () => P(l, 0.3, 0.8));
    let lit = () => 0;
    if (b.id === "soal1b") {
      const t0 = at(b, "dari nomor satu"), t1 = at(b, "sembilan.", TXT(b).indexOf("dari nomor satu"));
      lit = n => { const tn = lerp(t0, t1, (n - 1) / 8); return l >= tn ? clamp(1 - (l - tn - 0.6) / 1.5, 0.0, 1) : 0; };
    }
    alpha(ctx, s1, () => machine(ctx, 100, 165, 380, { lit }));
    if (b.id === "soal1b") { const a = P(l, at(b, "sembilan macam"), 0.6); hand(ctx, "9 macam minuman", 920, 420, 56, { alpha: a, color: ORANGE }); hand(ctx, "nomor 1 sampai 9", 920, 500, 56, { alpha: P(l, at(b, "dari nomor satu"), 0.6), color: INK }); }
    // tiga orang
    const names = ["Dedi", "Nur", "Joko"], px = [610, 790, 970];
    names.forEach((nm, i) => {
      const a = ord("soal2", () => P(l, at(b, i === 0 ? "Dedi," : i === 1 ? "Nur," : "Joko."), 0.5));
      alpha(ctx, a, () => {
        person(ctx, nm, px[i], 300, 120);
        chip(ctx, nm, px[i], 410, 32);
      });
      const f = ord("soal2", () => P(l, at(b, "tiga minuman favorit"), 0.6));
      alpha(ctx, Math.min(a, f), () => {
        for (let k = 0; k < 3; k++) { const bx = px[i] - 52 + k * 52; ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = OWN[nm]; ctx.lineWidth = 3; rr(ctx, bx - 21, 465, 42, 62, 8); ctx.fill(); ctx.stroke(); text(ctx, "?", bx, 509, 34, { align: "center", weight: 900, color: OWN[nm] }); }
      });
    });
    alpha(ctx, ord("soal2", () => P(l, at(b, "tiga minuman favorit"), 0.6)), () => {
      hand(ctx, "masing-masing", 790, 590, 34, { color: ORANGE });
      hand(ctx, "3 minuman favorit", 790, 636, 34, { color: ORANGE });
    });
    alpha(ctx, ord("soal2", () => P(l, at(b, "selalu membeli"), 0.6)), () => {
      kiko(ctx, 790, 745, 92, 0, { mood: "happy" });
    });
    // kartu hari
    dayCard(ctx, b, l, "SENIN", ord("soal3", () => P(l, 0.2, 0.5)), b.id === "soal3", 1080, 150);
    dayCard(ctx, b, l, "SELASA", ord("soal4", () => P(l, 0.2, 0.5)), b.id === "soal4", 1080, 490);
  }
  function dayCard(ctx, b, l, day, a, live, x, y) {
    if (a <= 0) return;
    const nums = day === "SENIN" ? MON : TUE, who = day === "SENIN" ? ["Dedi", "Nur"] : ["Nur", "Joko"];
    alpha(ctx, a, () => {
      card(ctx, x, y, 760, 330, { fill: "#F7F9FA", stroke: DAY[day], lw: 4, r: 18 });
      dayPill(ctx, day, x + 24, y + 48, 32);
      text(ctx, "Yang bekerja:", x + 250, y + 60, 30, { weight: 700, color: C.ink2 });
      let cx = x + 470; who.forEach(nm => { const w = chip(ctx, nm, cx + tw(ctx, nm, 30, 900) / 2 + 17, y + 49, 30); cx += w + 16; });
      text(ctx, "Minuman yang dibeli:", x + 28, y + 128, 28, { weight: 700, color: C.ink2 });
      let times = null;
      if (live) times = atSeq(b, nums.map(n => WORD[n]), "Minuman yang");
      canRow(ctx, nums, x + 78, y + 230, 120, 120, { show: (i) => times ? P(l, times[i], 0.35) : 1 });
    });
  }

  // ---------- pilihan jawaban ----------
  const ROWS0 = { y0: 255, step: 136, h: 122 }, ROWS5 = { y0: 272, step: 126, h: 114 };
  const OL = { x: 100, w: 1720, bx: 175, br: 40, gx0: 270, gs: 520, co: 70, cs: 30, c0: 200, cst: 96, chMax: 92, to: 455, ts: 48 };
  const OLV = { x: 466, w: 988, bx: 506, br: 28, gx0: 548, gs: 298, co: 40, cs: 20, c0: 112, cst: 56, chMax: 70, to: 278, ts: 34 };
  function optRow(ctx, i, y, h, st = {}, O = OL) {
    const L = "ABCD"[i];
    ctx.save(); if (st.dim) ctx.globalAlpha *= 1 - 0.6 * st.dim;
    card(ctx, O.x, y, O.w, h, { fill: st.good ? "#E8F6EC" : "#F7F9FA", stroke: st.good ? GREEN : "#C9D2D8", lw: st.good ? 5 : 2.5, r: 18 });
    ctx.fillStyle = st.good ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(O.bx, y + h / 2, O.br, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, O.bx, y + h / 2 + O.br * 0.42, O.br * 1.2, { align: "center", weight: 900, color: "#fff" });
    ["Dedi", "Nur", "Joko"].forEach((nm, g) => {
      const gx = O.gx0 + g * O.gs, cy = y + h / 2;
      if (st.hl && st.hl[g]) { ctx.save(); ctx.globalAlpha *= st.hl[g]; ctx.fillStyle = g === 2 ? "rgba(242,177,52,0.30)" : "rgba(155,69,196,0.16)"; rr(ctx, gx - 10, y + 8, O.gs - 20, h - 16, 14); ctx.fill(); ctx.restore(); }
      chip(ctx, nm, gx + O.co, cy, O.cs);
      OPTS[i][g].forEach((n, k) => {
        const x = gx + O.c0 + k * O.cst;
        const ch = Math.min(O.chMax, h * 0.76); can(ctx, n, x, cy, ch);
        const cr = st.cross && st.cross[g] && st.cross[g][n];
        if (cr) { ctx.save(); ctx.globalAlpha *= clamp(cr * 2, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 5; rr(ctx, x - ch * 0.42, cy - ch * 0.56, ch * 0.84, ch * 1.12, 10); ctx.stroke();
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x + ch * 0.42, cy - ch * 0.52, 17, 0, Math.PI * 2); ctx.fill(); ctx.restore(); cross(ctx, x + ch * 0.42, cy - ch * 0.52, 26, cr, RED, 6); }
      });
      const tk = st.tick && st.tick[g]; if (tk) tick(ctx, gx + O.to, cy, O.ts, tk, GREEN, O.ts > 40 ? 9 : 7);
    });
    ctx.restore();
    if (st.strike) { cross(ctx, O.bx, y + h / 2, O.br * 2.3, st.strike, RED, O.br > 30 ? 10 : 7); }
    if (st.ringD) ring(ctx, O.x + O.w / 2, y + h / 2, O.w / 2 + 20, h * 0.68, st.ringD, GREEN, 7);
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    const seg5 = b.id[0] === "p";
    if (!seg5) {
      text(ctx, "Apa saja minuman favorit mereka?", 960, 210, 48, { align: "center", weight: 900, color: INK });
      for (let i = 0; i < 4; i++) {
        const a = b.id === "soal5" ? P(l, at(b, "empat pilihan") + i * 0.35, 0.5) : 1;
        alpha(ctx, a, () => optRow(ctx, i, ROWS0.y0 + i * ROWS0.step, ROWS0.h));
      }
      if (b.id === "soal5") { const t = at(b, "pilihan A"); hand(ctx, "A, B, C, D = nama pilihan", 1500, 212, 30, { alpha: P(l, t, 0.6), color: ORANGE }); }
      return;
    }
    const ord = prog(["p1", "p2", "p3", "p4", "p5", "p6", "p6b", "p7"], b, l);
    // hasil kita
    card(ctx, 90, 145, 950, 112, { fill: "#FFFFFF", stroke: "#C9D2D8", lw: 2.5, r: 16 });
    text(ctx, "HASIL KITA", 112, 178, 22, { weight: 900, color: C.accentDark });
    ["Dedi", "Nur", "Joko"].forEach((nm, g) => {
      const gx = 112 + g * 312; chip(ctx, nm, gx + 42, 222, 22);
      FAV[nm].forEach((n, k) => can(ctx, n, gx + 128 + k * 56, 213, 72));
    });
    // kanan atas: jam pasir (p1) lalu daftar Selasa (p3–p5)
    if (b.id === "p1") thinkBadge(ctx, 1060, 145, 770, 112, l, b.dur, "Pilihan mana yang sama?");
    const sel = ord("p3", () => P(l, at(b, "tidak dibeli"), 0.5));
    if (sel > 0 && ["p3", "p4", "p5"].includes(b.id)) alpha(ctx, sel, () => {
      card(ctx, 1060, 145, 770, 112, { fill: "#F2FAFB", stroke: DAY.SELASA, lw: 4, r: 16 });
      dayPill(ctx, "SELASA", 1078, 201, 24);
      canRow(ctx, TUE, 1286, 201, 76, 92);
    });
    // baris pilihan
    const crossA = { 1: { 3: ord("p3", () => P(l, at(b, "nomor tiga dan"), 0.4)), 8: ord("p3", () => P(l, at(b, "dan delapan"), 0.4)) } };
    const crossB = { 1: { 8: ord("p4", () => P(l, at(b, "Nomor delapan"), 0.4)) } };
    const crossC = { 1: { 2: ord("p5", () => P(l, at(b, "Nomor dua"), 0.4)), 8: ord("p5", () => P(l, at(b, "dan delapan"), 0.4)) } };
    const strike = [ord("p3", () => P(l, at(b, "pilihan A salah"), 0.5)), ord("p4", () => P(l, at(b, "juga salah"), 0.5)), ord("p5", () => P(l, at(b, "juga salah"), 0.5)), 0];
    const jokoHl = b.id === "p2" ? P(l, at(b, "Joko selalu"), 0.5) * (1 - P(l, at(b, "bagian Nur."), 0.5)) : 0;
    const nurHl = b.id === "p2" ? P(l, at(b, "bagian Nur."), 0.5) : 0;
    const dT = [ord("p6", () => P(l, at(b, "Dedi nomor"), 0.5)), ord("p6", () => P(l, at(b, "Nur mendapat"), 0.5)), ord("p6", () => P(l, at(b, "Joko mendapat"), 0.5))];
    const good = ord("p6b", () => P(l, at(b, "pilihan D."), 0.5));
    for (let i = 0; i < 4; i++) {
      const y = ROWS5.y0 + i * ROWS5.step;
      optRow(ctx, i, y, ROWS5.h, {
        dim: strike[i], strike: strike[i],
        hl: [0, nurHl, jokoHl],
        cross: i === 0 ? crossA : i === 1 ? crossB : i === 2 ? crossC : null,
        tick: i === 3 ? dT : null, good: i === 3 && good > 0.5, ringD: i === 3 ? good : 0,
      });
    }
  }

  // ---------- memahami daftar ----------
  function paham(ctx, b, l) {
    board(ctx);
    const ord = prog(["k1", "k2", "k3", "k4", "k5"], b, l);
    card(ctx, 90, 150, 1740, 300, { fill: "#F7F9FA", stroke: DAY.SENIN, lw: 4, r: 18 });
    dayPill(ctx, "SENIN", 116, 198, 34);
    person(ctx, "Dedi", 210, 330, 100); chip(ctx, "Dedi", 210, 415, 26);
    person(ctx, "Nur", 360, 330, 100); chip(ctx, "Nur", 360, 415, 26);
    alpha(ctx, 0.35, () => { person(ctx, "Joko", 510, 330, 100); chip(ctx, "Joko", 510, 415, 26); });
    hand(ctx, "tidak datang", 510, 222, 28, { color: RED, alpha: ord("k1", () => P(l, at(b, "Joko tidak"), 0.5)) });
    const n3 = b.id === "k3" ? atSeq(b, ["Tiga ditambah", "enam.", "tepat enam"]) : null;
    MON.forEach((n, i) => {
      const x = 760 + i * 170;
      can(ctx, n, x, 300, 150);
      if (b.id === "k3") { const a = P(l, n3[2] + i * 0.25, 0.3); if (a > 0) { alpha(ctx, a, () => { ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(x + 46, 222, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 46, 232, 28, { align: "center", weight: 900, color: "#fff" }); }); } }
    });
    // k2: siapa pemilik daftar ini
    if (b.id === "k2") {
      const u = P(l, at(b, "Daftar ini"), 0.7);
      mline(ctx, [[1185, 395], [1185, 500]], u, ORANGE, 6, true);
      alpha(ctx, u, () => {
        text(ctx, "favorit", 840, 590, 44, { align: "right", weight: 800, color: INK }); chip(ctx, "Dedi", 920, 575, 36);
        text(ctx, "+", 1040, 592, 56, { align: "center", weight: 900, color: INK });
        text(ctx, "favorit", 1260, 590, 44, { align: "right", weight: 800, color: INK }); chip(ctx, "Nur", 1330, 575, 36);
      });
    }
    // k3: 3 + 3 = 6
    if (b.id === "k3") {
      const a1 = P(l, at(b, "Dedi punya"), 0.5), a2 = P(l, at(b, "Nur juga"), 0.5), a3 = P(l, n3[0], 0.5);
      alpha(ctx, a1, () => { chip(ctx, "Dedi", 330, 520, 30); for (let k = 0; k < 3; k++) { ctx.fillStyle = OWNL.Dedi; ctx.strokeStyle = OWN.Dedi; ctx.lineWidth = 4; rr(ctx, 250 + k * 66, 560, 54, 80, 10); ctx.fill(); ctx.stroke(); } text(ctx, "3", 330, 700, 48, { align: "center", weight: 900, color: OWN.Dedi }); });
      alpha(ctx, a2, () => { chip(ctx, "Nur", 640, 520, 30); for (let k = 0; k < 3; k++) { ctx.fillStyle = OWNL.Nur; ctx.strokeStyle = OWN.Nur; ctx.lineWidth = 4; rr(ctx, 560 + k * 66, 560, 54, 80, 10); ctx.fill(); ctx.stroke(); } text(ctx, "3", 640, 700, 48, { align: "center", weight: 900, color: OWN.Nur }); });
      alpha(ctx, a3, () => { text(ctx, "+", 485, 612, 56, { align: "center", weight: 900, color: INK }); hand(ctx, "3 + 3 = 6", 1000, 630, 72, { color: ORANGE }); });
      const a4 = P(l, n3[2] + 1.6, 0.5);
      alpha(ctx, a4, () => { hand(ctx, "daftar Senin: 6 minuman", 1460, 630, 44, { color: INK }); tick(ctx, 1760, 610, 60, a4, GREEN, 9); });
    }
    // k4–k5: kesimpulan
    const a4 = ord("k4", () => P(l, 0.3, 0.6));
    if (["k4", "k5"].includes(b.id)) {
      const big = b.id === "k4";
      alpha(ctx, a4, () => {
        hand(ctx, "Tidak ada minuman milik berdua.", 960, big ? 545 : 515, big ? 52 : 40, { color: INK });
      });
      alpha(ctx, ord("k4", () => P(l, at(b, "Setiap minuman"), 0.6)), () => {
        const y = big ? 640 : 580, s = big ? 46 : 36;
        text(ctx, "Setiap minuman Senin:", 960 - (big ? 300 : 230), y, s, { align: "right", weight: 800, color: INK });
        chip(ctx, "Dedi", 960 - (big ? 220 : 170), y - s * 0.36, s * 0.75); hand(ctx, "ATAU", 960 - (big ? 70 : 55), y, s, { color: ORANGE }); chip(ctx, "Nur", 960 + (big ? 60 : 45), y - s * 0.36, s * 0.75);
      });
    }
    if (b.id === "k5") {
      const a = P(l, 0.2, 0.6);
      alpha(ctx, a, () => {
        card(ctx, 90, 620, 1740, 190, { fill: "#F2FAFB", stroke: DAY.SELASA, lw: 4, r: 18 });
        dayPill(ctx, "SELASA", 116, 668, 30);
        canRow(ctx, TUE, 330, 715, 110, 92);
      });
      alpha(ctx, P(l, at(b, "Keenam"), 0.6), () => {
        text(ctx, "Setiap minuman Selasa:", 900, 730, 38, { weight: 800, color: INK });
        chip(ctx, "Nur", 1400, 717, 30); hand(ctx, "ATAU", 1520, 730, 38, { color: ORANGE }); chip(ctx, "Joko", 1650, 717, 30);
      });
    }
  }

  // ---------- pemanasan: dua ekskul ----------
  const EKS = { PRAMUKA: ["Dito", "Sinta", "Bayu"], MENARI: ["Rani", "Sinta", "Lala"] };
  const EKC = { PRAMUKA: "#8B5A2B", MENARI: "#D0457A" };
  const VE = { c1: [1135, 500], c2: [1475, 500], r: 275 };
  const VPOS = { Dito: [985, 430], Bayu: [985, 570], Sinta: [1305, 500], Rani: [1625, 430], Lala: [1625, 570] };
  function nameTag(ctx, nm, cx, cy, opt = {}) {
    const s = opt.size || 34, w = Math.max(150, tw(ctx, nm, s, 900) + 40), h = 62;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = opt.fill || "#FFFFFF"; ctx.strokeStyle = opt.stroke || INK; ctx.lineWidth = 3; rr(ctx, cx - w / 2, cy - h / 2, w, h, 12); ctx.fill(); ctx.stroke();
    text(ctx, nm, cx, cy + s * 0.36, s, { align: "center", weight: 900, color: INK });
    ctx.restore(); return w;
  }
  function ekskul(ctx, b, l) {
    board(ctx);
    const ord = prog(["w1", "w2", "w3", "w4", "w5", "w6", "w7"], b, l);
    const LP = { PRAMUKA: [100, 160], MENARI: [100, 500] };
    const listPos = (k, i) => [LP[k][0] + 110 + i * 190, LP[k][1] + 200];
    const nT = b.id === "w2" ? atSeq(b, ["Dito,", "Sinta,", "Bayu.", "Rani,", "Sinta,", "Lala."]) : null;
    Object.keys(EKS).forEach((k, ki) => {
      const [x, y] = LP[k];
      card(ctx, x, y, 610, 300, { fill: "#F7F9FA", stroke: EKC[k], lw: 4, r: 18 });
      ctx.fillStyle = EKC[k]; rr(ctx, x + 24, y + 22, tw(ctx, k, 32, 900) + 40, 52, 12); ctx.fill();
      text(ctx, k, x + 44, y + 60, 32, { weight: 900, color: "#fff" });
      EKS[k].forEach((nm, i) => {
        const a = ord("w2", () => P(l, nT[ki * 3 + i], 0.4)); const [cx, cy] = listPos(k, i);
        const only = nm !== "Sinta" && k === "PRAMUKA" ? ord("w4", () => P(l, at(b, nm + " "), 0.5)) : 0;
        nameTag(ctx, nm, cx, cy, { alpha: a, fill: nm === "Sinta" && ord("w4", () => P(l, at(b, "nama Sinta"), 0.5)) > 0.5 ? "#FFF1C9" : "#FFFFFF" });
        if (only > 0) hand(ctx, "hanya pramuka", cx, cy + 66, 24, { alpha: only, color: GRAYT });
      });
    });
    // w3: kaca pembesar menyusuri daftar pramuka
    if (b.id === "w3") { const u = P(l, at(b, "Kita cari"), 0.4); if (u > 0) { const k = ((l - at(b, "Kita cari")) / 1.1) % 3; const i = Math.floor(clamp(k, 0, 2.99)); const [cx, cy] = listPos("PRAMUKA", i); magnifier(ctx, cx, cy, 70); } }
    // w4: Sinta di kedua daftar
    const sU = ord("w4", () => P(l, at(b, "nama Sinta"), 0.8));
    if (sU > 0) {
      const [ax, ay] = listPos("PRAMUKA", 1), [bx, by] = listPos("MENARI", 1);
      ring(ctx, ax, ay, 100, 46, sU, ORANGE, 6); ring(ctx, bx, by, 100, 46, sU, ORANGE, 6);
      if (["w4"].includes(b.id)) { mline(ctx, [[ax, ay + 48], [ax, by - 48]], sU, ORANGE, 5); hand(ctx, "ada di kedua daftar!", 1040, 500, 40, { alpha: P(l, at(b, "kedua daftar"), 0.5) }); }
    }
    // w5: diagram Venn
    const cU = ord("w5", () => P(l, at(b, "dua lingkaran"), 1.4));
    if (cU > 0) {
      const ov = ord("w5", () => P(l, at(b, "Lingkaran kiri"), 0.6));
      if (ov > 0) { ctx.save(); ctx.globalAlpha *= ov * 0.5; ctx.beginPath(); ctx.arc(VE.c1[0], VE.c1[1], VE.r, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = "#FFE7A8"; ctx.beginPath(); ctx.arc(VE.c2[0], VE.c2[1], VE.r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      circleDraw(ctx, VE.c1[0], VE.c1[1], VE.r, cU, EKC.PRAMUKA, 7);
      circleDraw(ctx, VE.c2[0], VE.c2[1], VE.r, cU, EKC.MENARI, 7);
      text(ctx, "PRAMUKA", VE.c1[0] - 150, 200, 34, { align: "center", weight: 900, color: EKC.PRAMUKA });
      text(ctx, "MENARI", VE.c2[0] + 150, 200, 34, { align: "center", weight: 900, color: EKC.MENARI });
    }
    // w6: nama pindah ke bagiannya
    const mv = {
      Sinta: ord("w6", () => P(l, at(b, "nama Sinta kita"), 0.9)),
      Dito: ord("w6", () => P(l, at(b, "Dito dan Bayu"), 0.9)), Bayu: ord("w6", () => P(l, at(b, "Dito dan Bayu") + 0.3, 0.9)),
      Rani: ord("w6", () => P(l, at(b, "Rani dan Lala"), 0.9)), Lala: ord("w6", () => P(l, at(b, "Rani dan Lala") + 0.3, 0.9)),
    };
    Object.keys(mv).forEach(nm => {
      const u = mv[nm]; if (u <= 0) return;
      const src = nm === "Rani" || nm === "Lala" ? listPos("MENARI", EKS.MENARI.indexOf(nm)) : listPos("PRAMUKA", EKS.PRAMUKA.indexOf(nm));
      const [tx, ty] = VPOS[nm];
      ctx.save(); ctx.translate(tx, ty); const sc = 0.6 + 0.4 * u + Math.sin(u * Math.PI) * 0.15; ctx.scale(sc, sc);
      nameTag(ctx, nm, 0, 0, { alpha: u, fill: nm === "Sinta" ? "#FFF1C9" : "#FFFFFF" }); ctx.restore();
      if (u < 1) { const g = Math.sin(u * Math.PI); ring(ctx, src[0], src[1], 96, 42, 1, `rgba(238,122,18,${g})`, 5); }
    });
    if (b.id === "w7") hand(ctx, "ikut keduanya → bagian tengah", VE.c1[0] + 170, 815, 36, { alpha: P(l, at(b, "namanya muncul"), 0.6) });
  }

  // ---------- tabel hadir ----------
  function hari(ctx, b, l) {
    board(ctx);
    const ord = prog(["n1", "n2"], b, l);
    kiko(ctx, 230, 620, 150, 0, { mood: "happy" });
    const X0 = 520, CX = { SENIN: 1060, SELASA: 1350 }, RY = { Dedi: 340, Nur: 490, Joko: 640 };
    card(ctx, X0 - 40, 165, 1120, 560, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "SIAPA YANG BEKERJA?", X0, 220, 28, { weight: 900, color: C.accentDark });
    dayPill(ctx, "SENIN", CX.SENIN - 72, 250, 30); dayPill(ctx, "SELASA", CX.SELASA - 82, 250, 30);
    ctx.strokeStyle = "#D5DCE1"; ctx.lineWidth = 2; [415, 565].forEach(y => { ctx.beginPath(); ctx.moveTo(X0 - 20, y); ctx.lineTo(X0 + 1060, y); ctx.stroke(); });
    const tks = {
      Dedi: { SENIN: ord("n1", () => P(l, at(b, "Dedi hanya"), 0.5)) },
      Joko: { SELASA: ord("n1", () => P(l, at(b, "Joko hanya"), 0.5)) },
      Nur: { SENIN: ord("n1", () => P(l, at(b, "Nur bekerja"), 0.5)), SELASA: ord("n1", () => P(l, at(b, "dan juga pada"), 0.5)) },
    };
    Object.keys(RY).forEach(nm => {
      const y = RY[nm];
      person(ctx, nm, X0 + 50, y + 4, 96); chip(ctx, nm, X0 + 210, y, 32);
      ["SENIN", "SELASA"].forEach(d => {
        const u = (tks[nm] || {})[d] || 0;
        if (u > 0) tick(ctx, CX[d], y, 70, u, GREEN, 10);
        else if (nm !== "Nur" && ord("n1", () => P(l, at(b, nm === "Dedi" ? "Dedi hanya" : nm === "Joko" ? "Joko hanya" : "Nur bekerja") + 0.6, 0.4)) > 0) { mline(ctx, [[CX[d] - 22, y], [CX[d] + 22, y]], 1, "#B4BEC5", 6); }
      });
    });
    const nr = ord("n1", () => P(l, at(b, "dan juga pada"), 0.8));
    if (nr > 0) ring(ctx, X0 + 520, RY.Nur, 600, 70, nr, OWN.Nur, 6);
    if (b.id === "n2") {
      const a = P(l, at(b, "Minuman favorit Nur pasti"), 0.6);
      alpha(ctx, a, () => {
        const w0 = tw(ctx, "Minuman Nur ada di daftar", 38, 800), x0 = 960 - (w0 + 420) / 2;
        text(ctx, "Minuman Nur ada di daftar", x0, 780, 38, { weight: 800, color: INK });
        const w1 = dayPill(ctx, "SENIN", x0 + w0 + 18, 768, 28); hand(ctx, "DAN", x0 + w0 + 18 + w1 + 50, 780, 38, { color: ORANGE }); dayPill(ctx, "SELASA", x0 + w0 + 18 + w1 + 100, 768, 28);
      });
    }
  }

  // ---------- dua daftar berjajar, kolom 1–9 ----------
  const CC = { x0: 470, step: 158, ySen: 335, ySel: 595, h: 150 };
  const colX = n => CC.x0 + (n - 1) * CC.step;
  // kejadian pemeriksaan: [beat, frasa, jenis, nomor]
  const SCAN = [
    ["n5", "nomor satu di daftar Senin", "mag", 1], ["n5", "Apakah nomor satu", "down", 1], ["n5", "Ada!", "yes", 1],
    ["n6", "nomor dua.", "mag", 2], ["n6", "tidak ada nomor dua", "no", 2], ["n6", "Nomor tiga", "mag", 3], ["n6", "juga tidak ada", "no", 3],
    ["n7", "Nomor lima", "mag", 5], ["n7", "jadi kita lingkari", "yes", 5], ["n7", "Nomor delapan", "mag", 8], ["n7", "delapan tidak ada", "no", 8],
    ["n8", "nomor sembilan", "mag", 9], ["n8", "Kita lingkari", "yes", 9],
  ];
  const CORD = ["n3", "n4", "n5", "n6", "n7", "n8", "n9"];
  function cocok(ctx, b, l) {
    board(ctx);
    const k = CORD.indexOf(b.id);
    const appear = b.id === "n3" ? P(l, at(b, "setiap minuman"), 0.8) : 1;
    const nurCol = b.id === "n9" ? P(l, at(b, "minuman favorit Nur adalah"), 0.6) : 0;
    // baris
    [["SENIN", CC.ySen, MON], ["SELASA", CC.ySel, TUE]].forEach(([d, y, nums]) => {
      card(ctx, 70, y - 115, 1780, 230, { fill: d === "SENIN" ? "#FFF7EE" : "#EEF8F9", stroke: DAY[d], lw: 4, r: 18 });
      dayPill(ctx, d, 92, y, 30);
      if (nurCol > 0) [1, 5, 9].forEach(n => { ctx.save(); ctx.globalAlpha *= nurCol; ctx.fillStyle = OWNL.Nur; rr(ctx, colX(n) - 68, y - 100, 136, 200, 20); ctx.fill(); ctx.restore(); });
      for (let n = 1; n <= 9; n++) {
        if (nums.includes(n)) {
          if (appear < 1) { const i = nums.indexOf(n); const fx = 360 + i * 120; can(ctx, n, lerp(fx, colX(n), appear), y, CC.h); }
          else can(ctx, n, colX(n), y, CC.h);
        } else slot(ctx, n, colX(n), y, CC.h, { alpha: appear });
      }
    });
    // pemeriksaan
    let mag = null;
    SCAN.forEach(([id, ph, kind, n]) => {
      const j = CORD.indexOf(id); if (j > k) return;
      const t0 = j < k ? -99 : at(b, ph), u = j < k ? 1 : P(l, t0, 0.6);
      if (u <= 0) return;
      const x = colX(n);
      if (kind === "mag" && j === k) mag = n;
      if (kind === "down" && j === k && l < at(b, "Ada!") + 0.6) mline(ctx, [[x + 66, CC.ySen + 40], [x + 66, CC.ySel - 40]], u, BLUE, 6, true);
      if (kind === "yes") {
        ctx.save(); ctx.strokeStyle = nurCol > 0.5 ? OWN.Nur : GREEN; ctx.lineWidth = 7; ctx.globalAlpha *= u;
        rr(ctx, x - 72, CC.ySen - 102, 144, CC.ySel - CC.ySen + 204, 28); ctx.stroke(); ctx.restore();
        if (nurCol > 0) chip(ctx, "Nur", x, 740, 28, { alpha: nurCol });
      }
      if (kind === "no") cross(ctx, x, CC.ySel, 90, u, RED, 9);
    });
    if (mag != null) magnifier(ctx, colX(mag), CC.ySen, 92);
    if (b.id === "n4") thinkBadge(ctx, 560, 720, 800, 104, l, b.dur, "Nomor berapa yang ada di kedua daftar?");
    if (b.id === "n9") {
      const a = P(l, at(b, "Nur punya tepat"), 0.6);
      hand(ctx, "3 nomor di kedua daftar", colX(3), 815, 38, { alpha: a, color: INK });
      hand(ctx, "= 3 favorit Nur", colX(7) - 20, 815, 38, { alpha: a, color: OWN.Nur });
    }
  }

  // ---------- diagram Venn Senin–Selasa ----------
  const VS = { c1: [600, 495], c2: [960, 495], r: 300 };
  const VCAN = { 1: [780, 375], 5: [780, 495], 9: [780, 615], 2: [440, 375], 3: [440, 495], 8: [440, 615], 4: [1120, 375], 6: [1120, 495], 7: [1120, 615] };
  function vennBase(ctx, cu, tint) {
    const { c1, c2, r } = VS;
    if (tint.Nur > 0) { ctx.save(); ctx.globalAlpha *= tint.Nur; ctx.beginPath(); ctx.arc(c1[0], c1[1], r, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = OWNL.Nur; ctx.beginPath(); ctx.arc(c2[0], c2[1], r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    if (tint.Dedi > 0) { ctx.save(); ctx.globalAlpha *= tint.Dedi; ctx.beginPath(); ctx.arc(c1[0], c1[1], r, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = OWNL.Dedi; ctx.beginPath(); ctx.rect(0, 0, 1920, 1080); ctx.arc(c2[0], c2[1], r, 0, Math.PI * 2); ctx.fill("evenodd"); ctx.restore(); }
    if (tint.Joko > 0) { ctx.save(); ctx.globalAlpha *= tint.Joko; ctx.beginPath(); ctx.arc(c2[0], c2[1], r, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = OWNL.Joko; ctx.beginPath(); ctx.rect(0, 0, 1920, 1080); ctx.arc(c1[0], c1[1], r, 0, Math.PI * 2); ctx.fill("evenodd"); ctx.restore(); }
    circleDraw(ctx, c1[0], c1[1], r, cu, DAY.SENIN, 8);
    circleDraw(ctx, c2[0], c2[1], r, cu, DAY.SELASA, 8);
    alpha(ctx, cu, () => { dayPill(ctx, "SENIN", c1[0] - 250, 175, 28); dayPill(ctx, "SELASA", c2[0] + 105, 175, 28); });
  }
  function venn(ctx, b, l) {
    board(ctx);
    const ord = prog(["d1", "d2", "d3", "d4"], b, l);
    const cu = ord("d1", () => P(l, at(b, "Lingkaran kiri"), 1.4));
    const tN = ord("d2", () => P(l, at(b, "milik Nur"), 0.6)), tD = ord("d3", () => P(l, at(b, "adalah milik Dedi"), 0.6)), tJ = ord("d4", () => P(l, at(b, "adalah milik Joko"), 0.6));
    vennBase(ctx, cu, { Nur: tN, Dedi: tD, Joko: tJ });
    const T2 = b.id === "d2" ? atSeq(b, ["satu,", "lima,", "sembilan"]) : null;
    const T3 = b.id === "d3" ? atSeq(b, ["dua,", "tiga,", "delapan."]) : null;
    const T4 = b.id === "d4" ? atSeq(b, ["empat,", "enam,", "tujuh."]) : null;
    const show = {};
    [1, 5, 9].forEach((n, i) => show[n] = ord("d2", () => P(l, T2[i], 0.4)));
    [2, 3, 8].forEach((n, i) => show[n] = ord("d3", () => P(l, T3[i], 0.4)));
    [4, 6, 7].forEach((n, i) => show[n] = ord("d4", () => P(l, T4[i], 0.4)));
    Object.keys(VCAN).forEach(n => { const [x, y] = VCAN[n]; if (show[n] > 0) can(ctx, +n, x, y - (1 - show[n]) * 30, 100, { alpha: show[n] }); });
    // label pemilik
    alpha(ctx, tN, () => { chip(ctx, "Nur", 780, 175, 30); mline(ctx, [[780, 205], [780, 262]], 1, OWN.Nur, 5, true); });
    alpha(ctx, tD, () => { chip(ctx, "Dedi", 165, 495, 32); mline(ctx, [[228, 495], [385, 495]], 1, OWN.Dedi, 5, true); });
    alpha(ctx, tJ, () => { chip(ctx, "Joko", 1390, 495, 32); mline(ctx, [[1325, 495], [1175, 495]], 1, OWN.Joko, 5, true); });
    if (b.id === "d3") { const a = P(l, at(b, "bukan milik Nur"), 0.5) * (1 - P(l, at(b, "Jadi, nomor"), 0.4)); hand(ctx, "bukan milik Nur", 440, 715, 32, { alpha: a, color: "#6E2A92" }); }
    // panel hasil
    card(ctx, 1500, 165, 330, 560, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "HASIL", 1665, 210, 28, { align: "center", weight: 900, color: C.accentDark });
    [["Dedi", tD], ["Nur", tN], ["Joko", tJ]].forEach(([nm, a], i) => {
      const y = 290 + i * 160;
      alpha(ctx, a, () => { chip(ctx, nm, 1665, y, 28); canRow(ctx, FAV[nm], 1585, y + 80, 74, 80); });
    });
  }

  // ---------- memeriksa hasil ----------
  function periksa(ctx, b, l) {
    board(ctx);
    const ord = prog(["d5", "d6"], b, l);
    machine(ctx, 110, 165, 340, { owner: n => 1 });
    const T5 = b.id === "d5" ? atSeq(b, ["Dedi punya", "Nur punya", "Joko juga", "Jumlahnya", "setiap nomor"]) : null;
    ["Dedi", "Nur", "Joko"].forEach((nm, i) => {
      const y = 210 + i * 105, a = ord("d5", () => P(l, T5[i], 0.5));
      alpha(ctx, a, () => { chip(ctx, nm, 640, y, 30); canRow(ctx, FAV[nm], 760, y, 84, 82); text(ctx, "3", 1010, y + 18, 50, { align: "center", weight: 900, color: OWN[nm] }); });
    });
    const s = ord("d5", () => P(l, T5[3], 0.6));
    alpha(ctx, s, () => { hand(ctx, "3 + 3 + 3 = 9", 1400, 330, 60, { color: ORANGE }); });
    const s2 = ord("d5", () => P(l, T5[4], 0.6));
    alpha(ctx, s2, () => { hand(ctx, "setiap nomor 1–9", 1400, 400, 40, { color: INK }); hand(ctx, "tepat satu kali", 1400, 448, 40, { color: INK }); tick(ctx, 1640, 420, 56, s2, GREEN, 9); });
    // d6: gabungan sama dengan daftar hari
    if (b.id === "d6" || ord("d6") > 0) {
      const T6 = b.id === "d6" ? atSeq(b, ["Kalau Dedi", "Hasilnya sama", "Kalau Nur", "Hasilnya sama"]) : [0, 0, 0, 0];
      [[["Dedi", "Nur"], MON, "SENIN", 560], [["Nur", "Joko"], TUE, "SELASA", 690]].forEach(([who, nums, d, y], i) => {
        const a = b.id === "d6" ? P(l, T6[i * 2], 0.5) : 1, ok = b.id === "d6" ? P(l, T6[i * 2 + 1], 0.5) : 1;
        alpha(ctx, a, () => {
          card(ctx, 540, y - 58, 1290, 116, { fill: "#F7F9FA", stroke: ok > 0.5 ? GREEN : "#C9D2D8", lw: ok > 0.5 ? 4 : 2.5, r: 16 });
          let x = 575; const w1 = chip(ctx, who[0], x + tw(ctx, who[0], 26, 900) / 2 + 15, y, 26); x += w1 + 10;
          text(ctx, "+", x + 14, y + 12, 36, { align: "center", weight: 900, color: INK }); x += 36;
          chip(ctx, who[1], x + tw(ctx, who[1], 26, 900) / 2 + 15, y, 26);
          canRow(ctx, nums, 880, y, 84, 76, { back: n => OWNL[owner(n)], edge: n => OWN[owner(n)] });
          text(ctx, "=", 1340, y + 14, 44, { align: "center", weight: 900, color: INK });
          dayPill(ctx, d, 1380, y, 28, { alpha: ok });
          tick(ctx, 1600 + (d === "SELASA" ? 20 : 0), y, 56, ok, GREEN, 9);
        });
      });
    }
  }

  // ---------- penutup ----------
  function komputer(ctx, b, l) {
    board(ctx);
    const ord = prog(["c1", "c2"], b, l);
    const X = 300, Y = 160, W = 1050, Hh = 560;
    ctx.fillStyle = "#3B4652"; rr(ctx, X, Y, W, Hh, 24); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, X + 24, Y + 24, W - 48, Hh - 70, 10); ctx.fill();
    ctx.fillStyle = "#3B4652"; ctx.fillRect(X + W / 2 - 40, Y + Hh, 80, 60); rr(ctx, X + W / 2 - 180, Y + Hh + 56, 360, 22, 10); ctx.fill();
    ctx.fillStyle = "#E7EEF2"; ctx.fillRect(X + 24, Y + 24, W - 48, 56);
    text(ctx, "Data Ekskul Sekolah", X + 50, Y + 62, 28, { weight: 800, color: INK });
    const cols = [["PRAMUKA", X + 70], ["MENARI", X + 420]];
    const T2 = b.id === "c2" ? atSeq(b, ["daftar pertama", "daftar kedua", "mencari nama"]) : null;
    cols.forEach(([k, x], ci) => {
      text(ctx, k, x, Y + 135, 28, { weight: 900, color: EKC[k] });
      EKS[k].forEach((nm, i) => {
        const y = Y + 200 + i * 80, hot = ord("c2", () => P(l, T2[2] + 0.4, 0.5)) > 0.5 && nm === "Sinta";
        const scan = b.id === "c2" && l >= T2[ci] && l < T2[ci] + 2.2 && Math.floor((l - T2[ci]) / 0.7) === i;
        ctx.fillStyle = hot ? "#FFF1C9" : scan ? "#DCEBFA" : "#F4F7F9"; rr(ctx, x - 16, y - 42, 290, 60, 8); ctx.fill();
        text(ctx, nm, x, y, 32, { weight: 800, color: INK });
      });
    });
    const r = ord("c2", () => P(l, T2[2] + 0.8, 0.6));
    alpha(ctx, r, () => {
      ctx.fillStyle = "#E8F6EC"; ctx.strokeStyle = GREEN; ctx.lineWidth = 3; rr(ctx, X + 770 - 20, Y + 150, 270, 200, 12); ctx.fill(); ctx.stroke();
      text(ctx, "Ikut dua ekskul:", X + 885, Y + 205, 26, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Sinta", X + 885, Y + 290, 54, { align: "center", weight: 900, color: GREEN });
    });
    kiko(ctx, 1600, 560, 220, 0, { mood: "happy" });
    alpha(ctx, ord("c1", () => P(l, at(b, "supaya jadwal"), 0.6)), () => hand(ctx, "jadwal tidak bentrok", 1600, 780, 38, { color: ORANGE }));
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Pertama", "Kedua", "Ketiga"]);
    const S = [["Cari orang yang muncul di dua hari.", "hari"], ["Nomor di kedua daftar = milik orang itu.", "kolom"], ["Sisa setiap daftar = milik orang lainnya.", "venn"]];
    S.forEach(([s, ic], i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 50, { weight: 900, color: INK, fit: 1060 });
        const ix = 1570, iy = y + 80;
        if (ic === "hari") { dayPill(ctx, "SENIN", ix - 150, iy - 26, 20); dayPill(ctx, "SELASA", ix - 150, iy + 26, 20); chip(ctx, "Nur", ix + 90, iy, 26); }
        if (ic === "kolom") { can(ctx, 1, ix - 30, iy - 32, 56); can(ctx, 1, ix - 30, iy + 34, 56); ctx.strokeStyle = GREEN; ctx.lineWidth = 5; rr(ctx, ix - 66, iy - 72, 72, 144, 16); ctx.stroke(); chip(ctx, "Nur", ix + 80, iy, 26); }
        if (ic === "venn") { ctx.save(); ctx.lineWidth = 5; ctx.strokeStyle = DAY.SENIN; ctx.beginPath(); ctx.arc(ix - 40, iy, 62, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = DAY.SELASA; ctx.beginPath(); ctx.arc(ix + 40, iy, 62, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); ctx.fillStyle = OWN.Dedi; ctx.beginPath(); ctx.arc(ix - 70, iy, 14, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = OWN.Nur; ctx.beginPath(); ctx.arc(ix, iy, 14, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = OWN.Joko; ctx.beginPath(); ctx.arc(ix + 70, iy, 14, 0, Math.PI * 2); ctx.fill(); }
      });
    });
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
  function flagUA(ctx, x, y, w) {   // bendera Ukraina: biru di atas, kuning di bawah
    const h = w * 0.6;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#0057B7"; ctx.fillRect(x, y, w, h / 2 + 0.5);
    ctx.fillStyle = "#FFD700"; ctx.fillRect(x, y + h / 2, w, h / 2);
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- versi tegak untuk Short: mesin + dua daftar dalam area 1000×700 (x 460–1460) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    machine(ctx, 480, 165, 250, {});
    ["Dedi", "Nur", "Joko"].forEach((nm, i) => { person(ctx, nm, 520 + i * 95, 650, 70); chip(ctx, nm, 520 + i * 95, 725, 22); });
    hand(ctx, "masing-masing", 615, 772, 26, { color: ORANGE }); hand(ctx, "3 favorit", 615, 806, 26, { color: ORANGE });
    const show3 = ["soal3", "soal4", "p6"].includes(b.id), show4 = ["soal4", "p6"].includes(b.id);
    [["SENIN", 165, MON, ["Dedi", "Nur"], show3, "soal3"], ["SELASA", 495, TUE, ["Nur", "Joko"], show4, "soal4"]].forEach(([d, y, nums, who, sh, live]) => {
      if (!sh) return;
      const times = b.id === live ? atSeq(b, nums.map(n => WORD[n]), "beli adalah") : null;
      card(ctx, 790, y, 660, 310, { fill: "#F7F9FA", stroke: DAY[d], lw: 4, r: 18 });
      dayPill(ctx, d, 810, y + 46, 30);
      let cx = 1030; who.forEach(nm => { const w = chip(ctx, nm, cx + tw(ctx, nm, 28, 900) / 2 + 16, y + 46, 28); cx += w + 12; });
      text(ctx, "bekerja", cx + 6, y + 56, 28, { weight: 700, color: C.ink2 });
      canRow(ctx, nums, 845, y + 200, 120, 110, { show: i => times ? P(l, times[i], 0.35) : 1 });
    });
  }

  // Short: pilihan jawaban dalam area 1000×560 (x 460–1460)
  function pilihan_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Apa saja minuman favorit mereka?", 960, 200, 38, { align: "center", weight: 900, color: INK });
    const done = b.id === "p6b";
    const good = done ? P(l, at(b, "pilihan D."), 0.5) : 0;
    for (let i = 0; i < 4; i++) {
      const st = done ? { dim: i < 3 ? 1 : 0, strike: i < 3 ? 1 : 0, cross: [{ 1: { 3: 1, 8: 1 } }, { 1: { 8: 1 } }, { 1: { 2: 1, 8: 1 } }, null][i],
                          tick: i === 3 ? [1, 1, 1] : null, good: i === 3 && good > 0.5, ringD: i === 3 ? good : 0 } : {};
      optRow(ctx, i, 235 + i * 102, 90, st, OLV);
    }
  }
  // Short: dua daftar berjajar dalam area 1000×520 (x 460–1460), keadaan akhir pemeriksaan (beat n9)
  function cocok_v(ctx, b, l) {
    board(ctx);
    const X = n => 545 + (n - 1) * 104, nurCol = P(l, at(b, "minuman favorit Nur adalah"), 0.6);
    [["SENIN", 290, MON], ["SELASA", 510, TUE]].forEach(([d, y, nums]) => {
      card(ctx, 470, y - 75, 980, 150, { fill: d === "SENIN" ? "#FFF7EE" : "#EEF8F9", stroke: DAY[d], lw: 4, r: 16 });
      dayPill(ctx, d, 640, y - 100, 22);
      if (nurCol > 0) [1, 5, 9].forEach(n => { ctx.save(); ctx.globalAlpha *= nurCol; ctx.fillStyle = OWNL.Nur; rr(ctx, X(n) - 46, y - 66, 92, 132, 14); ctx.fill(); ctx.restore(); });
      for (let n = 1; n <= 9; n++) { if (nums.includes(n)) can(ctx, n, X(n), y, 104); else slot(ctx, n, X(n), y, 104); }
    });
    [2, 3, 8].forEach(n => cross(ctx, X(n), 510, 64, 1, RED, 7));
    [1, 5, 9].forEach(n => { ctx.save(); ctx.strokeStyle = nurCol > 0.5 ? OWN.Nur : GREEN; ctx.lineWidth = 6; rr(ctx, X(n) - 48, 220, 96, 360, 20); ctx.stroke(); ctx.restore(); chip(ctx, "Nur", X(n), 618, 22, { alpha: nurCol }); });
    const a = P(l, at(b, "Nur punya tepat"), 0.6);
    hand(ctx, "3 nomor di kedua daftar = 3 favorit Nur", 960, 685, 36, { alpha: a, color: OWN.Nur });
  }

  Object.assign(K.SCENES, {
    pilihan_v, cocok_v, soal, pilihan, paham, ekskul, hari, cocok, venn, periksa, komputer, langkah, soal_v,
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
      ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
      ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
      for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
      ctx.restore();
      const fu = P(l, at(b, "Ukraina"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagUA(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Ukraina"), 0.8);
      if (au > 0) ring(ctx, 1170, 300 + 2 * 92 - 14, 200, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      [640, 860].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
      can(ctx, 5, 640, 650, 90); can(ctx, 9, 860, 650, 90);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 750, 790, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Membandingkan dua daftar, langkah demi langkah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
