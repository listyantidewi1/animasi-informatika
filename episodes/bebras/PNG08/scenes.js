/* PNG08 Pembahasan Soal Bebras 2025-KR-04 "Du-re" (Korea Selatan), kategori Penggalang (SMP).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras) + simulasi:
   tabel ketersediaan 8 penduduk × 7 hari (isi sama dengan tabel soal), baris Jumlah, kolom yang dicoret/disorot,
   kartu pilihan A–D dan tiga aturan yang dicentang atau disilang.
   Jawaban dihitung ulang di kode (harus hanya pilihan A) dan dilaporkan lewat K._warn bila salah.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F6FD0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Du-re", tahun: "2025", negara: "Korea Selatan", kode: "2025-KR-04" };

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
  function letter(ctx, L, cx, cy, r, good) {
    ctx.fillStyle = good ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, cx, cy + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
  }

  // ---------- data soal (dibaca dari tabel soal yang diperbesar) ----------
  const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const NAMES = ["Ain", "Boa", "Chaewon", "Doyun", "Eunwoo", "Felix", "Gaon", "Hana"];
  const AV = [[0, 2, 4, 5], [0, 1, 2], [1, 4], [2, 3, 5], [0, 3, 6], [1, 3, 5], [0, 2, 6], [1, 4, 5]];
  const has = (i, j) => AV[i].includes(j);
  const CNT = DAYS.map((_, j) => AV.filter(r => r.includes(j)).length);
  const OPTS = [[0, 1, 5], [1, 2, 5], [0, 1, 2], [0, 2, 5]], LET = ["A", "B", "C", "D"];
  // pemeriksaan: jadwal sah bila ada pembagian kerja (tiap orang 1–2 hari dari hari yang tersedia) dengan ≥4 orang per hari
  function valid(days) {
    const opts = AV.map(r => { const d = r.filter(j => days.includes(j)); const out = []; for (let m = 1; m < 1 << d.length; m++) { const s = d.filter((_, k) => m >> k & 1); if (s.length <= 2) out.push(s); } return out; });
    if (opts.some(o => !o.length)) return false;
    const rec = (i, cnt) => { if (i === AV.length) return days.every(j => cnt[j] >= 4); return opts[i].some(s => { const c = cnt.slice(); s.forEach(j => c[j]++); return rec(i + 1, c); }); };
    return rec(0, Array(7).fill(0));
  }
  const OK = OPTS.map(valid);
  if (OK.join() !== "true,false,false,false") (K._warn = K._warn || []).push("jawaban salah: " + OK.join());
  if (CNT.join() !== "4,4,4,3,3,4,2") (K._warn = K._warn || []).push("jumlah salah: " + CNT.join());

  // ---------- tabel ----------
  const G = (ox, oy) => ({ ox, oy, NW: 220, DW: 108, H0: 56, RH: 60 });
  const GM = G(80, 150), GV = G(470, 150);
  const cx = (g, j) => g.ox + g.NW + j * g.DW + g.DW / 2, rowT = (g, i) => g.oy + g.H0 + i * g.RH, rcy = (g, i) => rowT(g, i) + g.RH / 2;
  const TW = g => g.NW + 7 * g.DW, CY = g => rowT(g, 8);   // CY: atas baris Jumlah
  // S: {nameA(i), oA(i,j), hdrA, rowHi{i:col}, colHi{j:col}, dim{j:a}, strike{j:u}, hdrRing{j:u}, count{a, v(j)->[val,a,color]|null}, oRing{"i,j":u}, oCross{"i,j":u}, nameRing{i:u}, rowMark{i:{k,u,v}}}
  function table(ctx, g, S, l) {
    const W = TW(g), rows = S.count ? 9 : 8, Hh = g.H0 + rows * g.RH;
    const nameA = S.nameA || (() => 1), oA = S.oA || (() => 1), hdrA = S.hdrA == null ? 1 : S.hdrA;
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(g.ox, g.oy, W, g.H0 + 8 * g.RH);
    alpha(ctx, hdrA, () => { ctx.fillStyle = "#E6EEF3"; ctx.fillRect(g.ox, g.oy, W, g.H0); });
    Object.entries(S.colHi || {}).forEach(([j, col]) => { ctx.fillStyle = col; ctx.fillRect(g.ox + g.NW + j * g.DW, g.oy, g.DW, g.H0 + 8 * g.RH + (S.count ? g.RH : 0)); });
    Object.entries(S.rowHi || {}).forEach(([i, col]) => { ctx.fillStyle = col; ctx.fillRect(g.ox, rowT(g, +i), W, g.RH); });
    if (S.count) alpha(ctx, S.count.a, () => { ctx.fillStyle = "rgba(244,213,141,0.35)"; ctx.fillRect(g.ox, CY(g), W, g.RH); });
    // garis
    ctx.strokeStyle = "#C9D2D8"; ctx.lineWidth = 2;
    for (let i = 0; i <= 8; i++) { const y = rowT(g, i); ctx.beginPath(); ctx.moveTo(g.ox, y); ctx.lineTo(g.ox + W, y); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(g.ox, g.oy); ctx.lineTo(g.ox + W, g.oy); ctx.stroke();
    for (let j = 0; j <= 7; j++) { const x = g.ox + g.NW + j * g.DW; ctx.beginPath(); ctx.moveTo(x, g.oy); ctx.lineTo(x, rowT(g, 8)); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(g.ox, g.oy); ctx.lineTo(g.ox, rowT(g, 8)); ctx.stroke();
    if (S.count) alpha(ctx, S.count.a, () => {
      ctx.strokeStyle = "#B8892F"; ctx.lineWidth = 2.5; ctx.strokeRect(g.ox, CY(g), W, g.RH);
      for (let j = 0; j < 7; j++) { const x = g.ox + g.NW + j * g.DW; ctx.beginPath(); ctx.moveTo(x, CY(g)); ctx.lineTo(x, CY(g) + g.RH); ctx.stroke(); }
      text(ctx, "Jumlah", g.ox + 18, CY(g) + 40, 28, { weight: 900, color: "#8A6420" });
    });
    // kepala
    alpha(ctx, hdrA, () => {
      text(ctx, "Nama", g.ox + 18, g.oy + 38, 28, { weight: 900, color: INK });
      DAYS.forEach((d, j) => text(ctx, d, cx(g, j), g.oy + 38, 26, { align: "center", weight: 800, color: INK, fit: g.DW - 8 }));
    });
    // nama + berang-berang kecil
    NAMES.forEach((n, i) => alpha(ctx, nameA(i), () => { beaver(ctx, g.ox + 30, rcy(g, i) + 2, 40); text(ctx, n, g.ox + 60, rcy(g, i) + 10, 28, { weight: 800, color: INK }); }));
    // huruf O
    AV.forEach((r, i) => r.forEach(j => alpha(ctx, oA(i, j), () => {
      ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.ellipse(cx(g, j), rcy(g, i), 12, 15, 0, 0, Math.PI * 2); ctx.stroke();
    })));
    Object.entries(S.oRing || {}).forEach(([k, u]) => { const [i, j] = k.split(",").map(Number); ring(ctx, cx(g, j), rcy(g, i), 30, 25, u, ORANGE, 5); });
    Object.entries(S.oCross || {}).forEach(([k, u]) => { const [i, j] = k.split(",").map(Number); cross(ctx, cx(g, j), rcy(g, i), 46, u, RED, 6); });
    Object.entries(S.nameRing || {}).forEach(([i, u]) => ring(ctx, g.ox + 110, rcy(g, +i), 100, 27, u, ORANGE, 4));
    // redup
    Object.entries(S.dim || {}).forEach(([j, a]) => { if (a <= 0) return; ctx.fillStyle = `rgba(255,255,255,${0.7 * clamp(a, 0, 1)})`; ctx.fillRect(g.ox + g.NW + j * g.DW + 1, g.oy + g.H0 + 1, g.DW - 2, 8 * g.RH - 2); });
    // angka jumlah
    if (S.count && S.count.v) for (let j = 0; j < 7; j++) { const r = S.count.v(j); if (!r) continue; const [v, a, col] = r; alpha(ctx, a, () => text(ctx, String(v), cx(g, j), CY(g) + 44, 38, { align: "center", weight: 900, color: col || INK })); }
    Object.entries(S.countRing || {}).forEach(([j, u]) => ring(ctx, cx(g, +j), CY(g) + g.RH / 2, 34, 28, u, GREEN, 5));
    // coret kolom
    Object.entries(S.strike || {}).forEach(([j, u]) => { const x = cx(g, +j); mline(ctx, [[x, g.oy + 8], [x, rowT(g, 8) + (S.count ? g.RH : 0) - 8]], u, RED, 6); cross(ctx, x, g.oy + g.H0 / 2, 40, u, RED, 5); });
    Object.entries(S.hdrRing || {}).forEach(([j, u]) => ring(ctx, cx(g, +j), g.oy + g.H0 / 2, 56, 26, u, GREEN, 5));
    // tanda di ujung baris
    Object.entries(S.rowMark || {}).forEach(([i, m]) => {
      const x = g.ox + W + 34, y = rcy(g, +i);
      if (m.k === "tick") tick(ctx, x, y, 40, m.u, GREEN, 6);
      if (m.k === "cross") cross(ctx, x, y, 40, m.u, RED, 6);
      if (m.k === "num") alpha(ctx, m.u, () => text(ctx, String(m.v), x, y + 12, 34, { align: "center", weight: 900, color: m.col || INK }));
    });
  }

  // ---------- panel kanan ----------
  const PX = 1140, PW = 700;
  const RULES = ["Setiap hari Du-re: paling sedikit 4 orang.", "Setiap orang ikut paling sedikit 1 hari.", "Tidak ada yang bekerja 3 hari."];
  // st: {n, a, ring{i:u}, mark{i:{k,u}}, size}
  function rulesPanel(ctx, x, y, w, st) {
    const n = st.n == null ? 3 : st.n, size = st.size || 30, rh = size * 2.1;
    alpha(ctx, st.a == null ? 1 : st.a, () => {
      text(ctx, "ATURAN", x, y, 28, { weight: 900, color: C.accentDark });
      RULES.forEach((r, i) => {
        const a = typeof n === "number" ? clamp(n - i, 0, 1) : 1; if (a <= 0) return;
        const yy = y + 24 + i * rh;
        alpha(ctx, a, () => {
          card(ctx, x, yy, w, rh - 12, { fill: "#F3F6F8", stroke: "#C9D2D8", lw: 2, r: 14 });
          ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 34, yy + (rh - 12) / 2, 20, 0, Math.PI * 2); ctx.fill();
          text(ctx, String(i + 1), x + 34, yy + (rh - 12) / 2 + 9, 26, { align: "center", weight: 900, color: "#fff" });
          text(ctx, r, x + 66, yy + (rh - 12) / 2 + size * 0.36, size, { weight: 800, color: INK, fit: w - 140 });
        });
        const rg = st.ring && st.ring[i]; if (rg) ring(ctx, x + w / 2, yy + (rh - 12) / 2, w / 2 + 14, (rh - 12) / 2 + 12, rg, ORANGE, 5);
        const m = st.mark && st.mark[i]; if (m) { const mx = x + w - 36, my = yy + (rh - 12) / 2; if (m.k === "tick") tick(ctx, mx, my, 44, m.u, GREEN, 7); else cross(ctx, mx, my, 40, m.u, RED, 7); }
      });
    });
    return y + 24 + 3 * rh;
  }
  // st: {a, size, gap, ring{i:u}, ringCol, mark{i:{k,u}}, dayCol(j), aOpt(i)}
  function optionsPanel(ctx, x, y, w, st) {
    const size = st.size || 34, gap = st.gap || size * 1.75;
    alpha(ctx, st.a == null ? 1 : st.a, () => {
      OPTS.forEach((o, i) => {
        const a = st.aOpt ? st.aOpt(i) : 1; if (a <= 0) return;
        const yy = y + i * gap;
        alpha(ctx, a, () => {
          letter(ctx, LET[i], x + size * 0.7, yy - size * 0.33, size * 0.62, false);
          let tx = x + size * 1.6;
          o.forEach((j, k) => {
            const s = DAYS[j] + (k < 2 ? ", " : ""), col = st.dayCol ? st.dayCol(j) : INK;
            ctx.font = `800 ${size}px ${K.FONT}`; const sw = ctx.measureText(s).width;
            text(ctx, DAYS[j], tx, yy, size, { weight: 800, color: col }); if (k < 2) text(ctx, ",", tx + ctx.measureText(DAYS[j]).width, yy, size, { weight: 800, color: INK });
            tx += sw;
          });
          const m = st.mark && st.mark[i];
          if (m && m.k === "cross") mline(ctx, [[x - 6, yy - size * 0.32], [tx + 6, yy - size * 0.32]], m.u, RED, 5);
          if (m) { const mx = x + w - 40; if (m.k === "tick") tick(ctx, mx, yy - size * 0.35, 46, m.u, GREEN, 7); else cross(ctx, mx, yy - size * 0.35, 40, m.u, RED, 7); }
        });
        const rg = st.ring && st.ring[i]; if (rg > 0) alpha(ctx, rg, () => { ctx.strokeStyle = st.ringCol || BLUE; ctx.lineWidth = 4; rr(ctx, x - 12, yy - size * 1.05, w + 4, size * 1.45, 12); ctx.stroke(); });
      });
    });
    return y + 4 * gap;
  }

  // ---------- urutan beat dan keadaan ----------
  const ORDER = ["soal2", "soal3", "soal4", "soal5", "soal6", "soal7", "soal8", "soal9", "m1", "m2", "m3", "m4", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "f1", "f2", "k1", "k2", "k3", "k4", "k5", "k6", "k7", "b1", "b2", "c1", "c2", "c3", "d1", "d2", "j1", "j2"];
  const ix = id => ORDER.indexOf(id);
  const SELB = { k: 0, b: 1, c: 2, d: 3, j: 0 };
  const COLHI = "rgba(47,111,208,0.13)", COLHI2 = "rgba(238,122,18,0.16)", ROWHI = "rgba(238,122,18,0.16)", ROWBAD = "rgba(217,68,59,0.14)";
  const COUNT_PH = { a3: [[0, "Hari Senin"], [1, "Hari Selasa"]], a4: [[2, "Hari Rabu"], [3, "Hari Kamis"]], a5: [[4, "Hari Jumat"], [5, "Hari Sabtu"], [6, "hari Minggu"]] };
  const cntCol = v => v < 4 ? RED : GREEN;
  // status kartu pilihan sampai beat ini: A centang (k7), B silang (b2), C silang (c3), D silang (d1)
  const OPTMARK = [["k7", "pilihan A memenuhi", "tick"], ["b2", "Pilihan B melanggar", "cross"], ["c3", "Jadi, pilihan C", "cross"], ["d1", "Pilihan D melanggar", "cross"]];
  function optMarks(b, l) {
    const m = {}; OPTMARK.forEach(([id, ph, k], i) => { if (ix(b.id) > ix(id)) m[i] = { k, u: 1 }; else if (b.id === id) m[i] = { k, u: P(l, at(b, ph), 0.5) }; }); return m;
  }
  // jumlah orang pada hari terpilih bila seseorang (row) beristirahat di hari rest
  function restCycle(b, l, t1, t2, days) { if (l < t1) return -1; if (l < t2) return days[0]; return days[1 + Math.floor((l - t2) / 1.6) % 2]; }

  function tabel(ctx, b, l) {
    board(ctx);
    const id = b.id, k = ix(id), g = GM, S = { rowHi: {}, colHi: {}, dim: {}, strike: {}, hdrRing: {}, oRing: {}, oCross: {}, nameRing: {}, rowMark: {}, countRing: {} };
    // muncul
    if (id === "soal2") { const t0 = at(b, "Ain"), t1 = at(b, "Hana"); S.nameA = i => P(l, lerp(t0, t1, i / 7) - 0.2, 0.4); S.hdrA = 0; S.oA = () => 0; }
    if (id === "soal3") { const t0 = at(b, "Tabel ini"); S.hdrA = P(l, t0, 0.5); const t1 = at(b, "Huruf O"); S.oA = (i, j) => P(l, t1 + (i * 7 + j) * 0.035, 0.3); }
    if (id === "soal4") { S.rowHi[0] = ROWHI; const t = at(b, "tersedia pada hari"); [0, 2, 4, 5].forEach(j => S.oRing["0," + j] = P(l, at(b, DAYS[j], t), 0.5)); }
    if (id === "m1") S.rowHi[1] = ROWHI;
    if (id === "m2") { S.colHi[0] = COLHI2; const t = at(b, "Misalnya"); [0, 1, 4, 6].forEach(i => S.nameRing[i] = P(l, at(b, NAMES[i], t), 0.5)); }
    // baris jumlah
    if (k >= ix("a1")) {
      S.count = { a: id === "a1" ? P(l, at(b, "Jadi"), 0.5) : 1 };
      if (COUNT_PH[id]) {
        const shown = {}; let cur = -1;
        Object.entries(COUNT_PH).forEach(([bid, arr]) => arr.forEach(([j, ph]) => { if (ix(bid) < k) shown[j] = 1; else if (bid === id) { const t = at(b, ph); shown[j] = P(l, t + 0.8, 0.4); if (l > t - 0.2) cur = j; } }));
        S.count.v = j => shown[j] ? [CNT[j], shown[j], cntCol(CNT[j])] : null;
        if (cur >= 0) S.colHi[cur] = COLHI2;
      } else if (k > ix("a5")) S.count.v = j => [CNT[j], 1, cntCol(CNT[j])];
    }
    // coret Kamis, Jumat, Minggu
    if (k >= ix("a6") && k <= ix("f2")) [3, 4, 6].forEach((j, n) => { const u = id === "a6" ? P(l, at(b, "kita coret") + n * 0.3, 0.6) : 1; S.strike[j] = u; S.dim[j] = u; });
    if (id === "a7") [0, 1, 2, 5].forEach((j, n) => S.hdrRing[j] = P(l, at(b, "yaitu") + n * 0.4, 0.6));
    // pilihan terpilih
    let sel = null;
    if (k >= ix("k1")) {
      sel = OPTS[SELB[id[0]]];
      const su = id === "k1" ? P(l, 0.3, 0.8) : 1;
      for (let j = 0; j < 7; j++) { if (sel.includes(j)) S.colHi[j] = `rgba(47,111,208,${0.13 * su})`; else S.dim[j] = su; }
      if (S.count) S.count.v = j => sel.includes(j) ? [CNT[j], 1, cntCol(CNT[j])] : [CNT[j], 0.25, "#9AA4AC"];
    }
    if (id === "k3" || id === "k4") {
      const names = id === "k3" ? [0, 1, 2, 3] : [4, 5, 6, 7];
      if (id === "k4") [0, 1, 2, 3].forEach(i => S.rowMark[i] = { k: "tick", u: 1 });
      let cur = -1; names.forEach(i => { const t = at(b, NAMES[i] + " punya"); S.rowMark[i] = { k: "tick", u: P(l, t + 1.6, 0.5) }; if (l > t - 0.2) cur = i; });
      if (cur >= 0) S.rowHi[cur] = ROWHI;
    }
    if (k >= ix("k5") && k <= ix("k7")) {
      const t = id === "k5" ? at(b, "tidak ada baris") : -9;
      AV.forEach((r, i) => S.rowMark[i] = { k: "num", v: r.filter(j => sel.includes(j)).length, u: P(l, t + i * 0.25, 0.4), col: BLUE });
    }
    if (id === "k6" || id === "k7") sel.forEach((j, n) => S.countRing[j] = id === "k6" ? P(l, at(b, "masing-masing") + n * 0.3, 0.5) : 1);
    if (id === "b2") { S.rowHi[4] = ROWBAD; S.rowMark[4] = { k: "cross", u: P(l, at(b, "tidak bisa ikut"), 0.5) }; }
    if (id === "c1" || id === "c2" || id === "c3") {
      S.rowHi[1] = ROWHI; const t = id === "c1" ? at(b, "ketiga hari") : -9;
      [0, 1, 2].forEach((j, n) => S.oRing["1," + j] = P(l, t + n * 0.3, 0.5));
      if (id === "c1") AV.forEach((r, i) => S.rowMark[i] = { k: "tick", u: P(l, at(b, "Kali ini") + 0.5 + i * 0.12, 0.4) });
    }
    if (id === "c3") {
      const rest = restCycle(b, l, at(b, "Kalau Boa beristirahat hari Senin"), at(b, "Kalau Boa beristirahat hari Selasa"), [0, 1, 2]);
      if (rest >= 0) { S.oCross["1," + rest] = P(l, Math.max(at(b, "Kalau Boa"), 0), 0.4) ; S.count.v = j => sel.includes(j) ? (j === rest ? [3, 1, RED] : [4, 1, GREEN]) : [CNT[j], 0.25, "#9AA4AC"]; }
    }
    if (id === "d1") { S.rowHi[2] = ROWBAD; S.rowMark[2] = { k: "cross", u: P(l, at(b, "tidak bisa ikut"), 0.5) }; }
    if (id === "d2") { S.rowHi[2] = ROWBAD; S.rowMark[2] = { k: "cross", u: 1 }; S.rowHi[0] = ROWHI; [0, 2, 5].forEach((j, n) => S.oRing["0," + j] = P(l, at(b, "ketiga hari") + n * 0.3, 0.5)); }
    table(ctx, g, S, l);

    // ----- panel kanan -----
    const x = PX, w = PW;
    if (id === "soal2") {
      hand(ctx, "8 penduduk", x + w / 2, 300, 72, { color: ORANGE, alpha: P(l, at(b, "delapan"), 0.5) });
      alpha(ctx, P(l, at(b, "delapan") + 0.4, 0.6), () => [0, 1, 2, 3].forEach(i => beaver(ctx, x + 120 + i * 160, 520 + Math.sin(l * 2.5 + i) * 6, 130)));
      hand(ctx, "ikut Du-re", x + w / 2, 700, 50, { color: INK, alpha: P(l, at(b, "ikut Du-re"), 0.5) });
    }
    if (id === "soal3") {
      text(ctx, "Cara membaca tabel", x, 250, 40, { weight: 900, color: C.accentDark });
      alpha(ctx, P(l, at(b, "Huruf O"), 0.5), () => {
        card(ctx, x, 300, 110, 90, { fill: "#fff", stroke: "#C9D2D8", lw: 2, r: 6 });
        ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.ellipse(x + 55, 345, 12, 15, 0, 0, Math.PI * 2); ctx.stroke();
        text(ctx, "= tersedia (bisa datang)", x + 140, 360, 38, { weight: 800, color: GREEN, fit: w - 150 });
      });
      alpha(ctx, P(l, at(b, "Kotak yang kosong"), 0.5), () => {
        card(ctx, x, 440, 110, 90, { fill: "#fff", stroke: "#C9D2D8", lw: 2, r: 6 });
        text(ctx, "= tidak bisa datang", x + 140, 500, 38, { weight: 800, color: RED, fit: w - 150 });
      });
    }
    if (id === "soal4") {
      text(ctx, "Ain", x, 260, 56, { weight: 900, color: ORANGE });
      const t = at(b, "tersedia pada hari");
      alpha(ctx, P(l, t, 0.5), () => text(ctx, "tersedia:", x, 350, 36, { weight: 800, color: GREEN }));
      [0, 2, 4, 5].forEach((j, n) => alpha(ctx, P(l, at(b, DAYS[j], t), 0.4), () => text(ctx, DAYS[j], x + 30 + n * 165, 420, 38, { weight: 900, color: INK })));
      const t2 = at(b, "Pada hari Selasa");
      alpha(ctx, P(l, t2, 0.5), () => { text(ctx, "tidak bisa datang:", x, 530, 36, { weight: 800, color: RED }); text(ctx, "Selasa, Kamis, Minggu", x + 30, 600, 38, { weight: 900, color: INK }); });
    }
    if (["soal5", "soal6", "soal7", "soal8"].includes(id)) {
      hand(ctx, "Pilih 3 hari dalam seminggu", x + w / 2, 230, 46, { color: ORANGE, alpha: id === "soal5" ? P(l, at(b, "tiga hari"), 0.5) : 1 });
      const n = id === "soal5" ? 0 : id === "soal6" ? P(l, 0.3, 0.6) : id === "soal7" ? 1 + P(l, 0.3, 0.6) : 2 + P(l, 0.3, 0.6);
      alpha(ctx, id === "soal5" ? P(l, at(b, "tiga aturan"), 0.5) : 1, () => rulesPanel(ctx, x, 320, w, { n }));
      if (id === "soal8") hand(ctx, "artinya: paling banyak 2 hari", x + w / 2, 640, 42, { color: INK, alpha: P(l, at(b, "Artinya"), 0.5) });
    }
    if (id === "soal9") {
      card(ctx, x, 175, w, 120, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "Pada hari-hari apa saja", x + w / 2, 225, 40, { align: "center", weight: 900, color: INK });
      text(ctx, "Du-re dijadwalkan?", x + w / 2, 275, 40, { align: "center", weight: 900, color: INK });
      optionsPanel(ctx, x + 20, 390, w - 20, { size: 38, gap: 100, aOpt: i => P(l, at(b, "Pilihan " + LET[i]), 0.5) });
    }
    if (id === "m1" || id === "m2" || id === "m3") {
      alpha(ctx, P(l, id === "m1" ? at(b, "ke samping") : 0, 0.5), () => {
        text(ctx, "Baca ke samping (baris):", x, 250, 36, { weight: 900, color: ORANGE });
        mline(ctx, [[x + 10, 300], [x + 250, 300]], 1, ORANGE, 7, true);
        text(ctx, "hari-hari satu orang", x + 280, 312, 34, { weight: 800, color: INK });
      });
      if (id !== "m1") alpha(ctx, P(l, id === "m2" ? at(b, "ke bawah") : 0, 0.5), () => {
        text(ctx, "Baca ke bawah (kolom):", x, 400, 36, { weight: 900, color: ORANGE });
        mline(ctx, [[x + 40, 425], [x + 40, 520]], 1, ORANGE, 7, true);
        text(ctx, "siapa saja di satu hari", x + 100, 485, 34, { weight: 800, color: INK });
      });
      if (id === "m3") {
        alpha(ctx, P(l, at(b, "Orang yang tersedia"), 0.5), () => noteCard(ctx, x, 560, w, ["O = boleh ikut, boleh istirahat"], 1, { size: 34, stroke: GREEN }));
        alpha(ctx, P(l, at(b, "Yang pasti"), 0.5), () => noteCard(ctx, x, 680, w, ["kosong = pasti tidak ikut"], 1, { size: 34, stroke: RED }));
      }
    }
    if (id === "m4") {
      hand(ctx, "7 hari, pilih 3", x + w / 2, 240, 52, { color: INK, alpha: P(l, 0.3, 0.5) });
      rulesPanel(ctx, x, 320, w, { ring: { 0: P(l, at(b, "aturan pertama"), 0.6) } });
      hand(ctx, "mulai dari yang paling mudah", x + w / 2, 730, 40, { color: ORANGE, alpha: P(l, at(b, "Jadi"), 0.5) });
    }
    if (id === "a1") {
      rulesPanel(ctx, x, 230, w, { n: 1, ring: { 0: 1 } });
      alpha(ctx, P(l, at(b, "Jadi"), 0.5), () => noteCard(ctx, x, 420, w, ["Hari bisa dipilih kalau", "ada paling sedikit 4 orang", "yang tersedia."], 1, { size: 38, stroke: ORANGE }));
    }
    if (id === "a2") { rulesPanel(ctx, x, 230, w, { n: 1 }); thinkBadge(ctx, x, 560, w, 150, l, b.hold, "Hari mana yang kurang dari 4 orang?"); }
    if (["a3", "a4", "a5", "a6", "a7"].includes(id)) {
      rulesPanel(ctx, x, 230, w, { n: 1 });
      hand(ctx, "kurang dari 4 orang → coret", x + w / 2, 440, 42, { color: RED });
      if (id === "a6") alpha(ctx, P(l, at(b, "kita coret"), 0.5), () => noteCard(ctx, x, 520, w, ["Dicoret:", "Kamis (3), Jumat (3), Minggu (2)"], 1, { size: 36, stroke: RED, head: RED }));
      if (id === "a7") alpha(ctx, P(l, at(b, "yaitu"), 0.5), () => noteCard(ctx, x, 520, w, ["Masih mungkin:", "Senin, Selasa, Rabu, Sabtu"], 1, { size: 36, stroke: GREEN, head: GREEN }));
    }
    if (id === "f1" || id === "f2") {
      text(ctx, "Pilihan jawaban", x, 230, 36, { weight: 900, color: C.accentDark });
      const gu = id === "f1" ? P(l, at(b, "Ternyata"), 0.6) : 1;
      optionsPanel(ctx, x + 10, 320, w - 10, { size: 36, gap: 82, dayCol: j => [0, 1, 2, 5].includes(j) && gu > 0.5 ? GREEN : INK, ring: id === "f2" ? { 0: P(l, at(b, "pilihan A"), 0.6) } : {} });
      if (id === "f1") hand(ctx, "Aturan 1 belum mencoret satu pilihan pun.", x + w / 2, 700, 36, { color: ORANGE, alpha: P(l, at(b, "Jadi"), 0.5) });
      if (id === "f2") hand(ctx, "periksa dengan aturan 2 dan 3", x + w / 2, 700, 40, { color: BLUE, alpha: P(l, 0.4, 0.5) });
    }
    if (k >= ix("k1") && k <= ix("d2")) {
      const opt = SELB[id[0]];
      optionsPanel(ctx, x + 10, 205, w - 10, { size: 30, gap: 58, ring: { [opt]: 1 }, mark: optMarks(b, l) });
      const rm = {}, rr2 = {};
      if (id === "k2") rr2[1] = P(l, 0.3, 0.5);
      if (id === "k4") rm[1] = { k: "tick", u: P(l, at(b, "Aturan kedua terpenuhi"), 0.5) };
      if (id === "k5") { rm[1] = { k: "tick", u: 1 }; rm[2] = { k: "tick", u: P(l, at(b, "Jadi, aturan ketiga"), 0.5) }; }
      if (id === "k6" || id === "k7") { rm[1] = rm[2] = { k: "tick", u: 1 }; rm[0] = { k: "tick", u: id === "k6" ? P(l, at(b, "Aturan pertama pun"), 0.5) : 1 }; }
      if (id === "b2") rm[1] = { k: "cross", u: P(l, at(b, "melanggar"), 0.5) };
      if (id === "c1") rm[1] = { k: "tick", u: P(l, at(b, "Kali ini") + 1.5, 0.5) };
      if (id === "c2") { rm[1] = { k: "tick", u: 1 }; rr2[2] = P(l, 0.3, 0.5); }
      if (id === "c3") { rm[1] = { k: "tick", u: 1 }; rm[0] = { k: "cross", u: P(l, at(b, "selalu melanggar"), 0.5) }; }
      if (id === "d1") rm[1] = { k: "cross", u: P(l, at(b, "melanggar"), 0.5) };
      if (id === "d2") { rm[1] = { k: "cross", u: 1 }; rr2[2] = P(l, at(b, "Ain"), 0.5); }
      rulesPanel(ctx, x, 470, w, { size: 28, mark: rm, ring: rr2 });
      const think = { k2: "Adakah baris tanpa O?", b1: "Siapa yang tidak bisa ikut?", c2: "Apa akibatnya?" }[id];
      if (think) alpha(ctx, P(l, 0.3, 0.4), () => thinkBadge(ctx, x - 20, 650, w + 30, 140, l, b.hold + 2, think));
      else {
        const note = { k3: "Setiap baris perlu O di kolom biru.", k4: "Semua baris punya O.", k5: "Paling banyak 2 hari per orang.", k6: "Senin 4, Selasa 4, Sabtu 4.", k7: "Pilihan A lolos. Periksa yang lain.", b2: "Eunwoo tidak bisa ikut.", c1: "Boa tersedia 3 hari.", c3: "Boa istirahat → hari itu 3 orang.", d1: "Chaewon tidak bisa ikut.", d2: "Ain juga tersedia 3 hari." }[id];
        const ncol = { k7: GREEN, b2: RED, c3: RED, d1: RED, c1: ORANGE, d2: ORANGE }[id] || BLUE;
        if (note) hand(ctx, note, x + w / 2, 760, 40, { color: ncol, alpha: P(l, 0.5, 0.5) });
      }
    }
    if (id === "j1") {
      optionsPanel(ctx, x + 10, 205, w - 10, { size: 30, gap: 58, mark: optMarks(b, l), ring: { 0: P(l, at(b, "Jawabannya"), 0.6) }, ringCol: GREEN });
      alpha(ctx, P(l, at(b, "Jawabannya"), 0.5), () => {
        card(ctx, x, 480, w, 200, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 });
        text(ctx, "Jawaban: A", x + w / 2, 560, 60, { align: "center", weight: 900, color: GREEN });
        text(ctx, "Senin, Selasa, Sabtu", x + w / 2, 640, 48, { align: "center", weight: 900, color: INK });
      });
    }
    if (id === "j2") {
      const L = [["A", "lolos ketiga aturan", GREEN], ["B", "Eunwoo tidak bisa ikut (aturan 2)", RED], ["C", "Boa tersedia 3 hari (aturan 3, lalu 1)", RED], ["D", "Chaewon tidak bisa ikut (aturan 2)", RED]];
      text(ctx, "Alasan setiap pilihan", x, 230, 36, { weight: 900, color: C.accentDark });
      L.forEach(([a, s, col], i) => alpha(ctx, P(l, 0.3 + i * 0.3, 0.5), () => { letter(ctx, a, x + 26, 300 + i * 90, 24, a === "A"); text(ctx, s, x + 66, 312 + i * 90, 32, { weight: 800, color: col, fit: w - 70 }); }));
      hand(ctx, "periksa semua aturan!", x + w / 2, 720, 50, { color: ORANGE, alpha: P(l, at(b, "Karena itu"), 0.5) });
    }
  }
  function noteCard(ctx, x, y, w, lines, a = 1, opt = {}) {
    if (a <= 0) return;
    alpha(ctx, a, () => {
      const lh = opt.size ? opt.size * 1.3 : 48, h = lines.length * lh + 44;
      card(ctx, x, y, w, h, { fill: opt.fill || "#FFFDF7", stroke: opt.stroke || ORANGE, lw: 3, r: 18 });
      lines.forEach((s, i) => text(ctx, s, x + 30, y + 22 + lh * (i + 0.78), opt.size || 36, { weight: i === 0 ? 900 : 700, color: i === 0 ? (opt.head || INK) : C.ink2, fit: w - 60 }));
    });
  }

  // ---------- adegan: buka, kredit, desa ----------
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
  function flagKR(ctx, x, y, w) {   // bendera Korea Selatan: latar putih, taegeuk merah-biru, empat trigram hitam
    const h = w * 2 / 3, mx = x + w / 2, my = y + h / 2, r = h / 4;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    const ang = Math.atan2(2, 3);   // sumbu diagonal bendera
    ctx.save(); ctx.translate(mx, my); ctx.rotate(ang);
    ctx.fillStyle = "#CD2E3A"; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#0047A0"; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI); ctx.fill();
    ctx.fillStyle = "#CD2E3A"; ctx.beginPath(); ctx.arc(-r / 2, 0, r / 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#0047A0"; ctx.beginPath(); ctx.arc(r / 2, 0, r / 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // trigram: [pojok, pola tiga garis (1 = utuh, 0 = putus)]
    const T = [[[-1, -1], [1, 1, 1]], [[1, -1], [0, 1, 0]], [[-1, 1], [1, 0, 1]], [[1, 1], [0, 0, 0]]];
    const dist = h * 0.42, bl = h / 4, bw = h / 24;
    T.forEach(([[sx, sy], pat]) => {
      const a = Math.atan2(sy * 2, sx * 3), tx = mx + Math.cos(a) * dist * 1.25, ty = my + Math.sin(a) * dist;
      ctx.save(); ctx.translate(tx, ty); ctx.rotate(a); ctx.fillStyle = "#000";
      pat.forEach((p, k) => { const off = (k - 1) * bw * 1.5; if (p) ctx.fillRect(off - bw / 2, -bl / 2, bw, bl); else { ctx.fillRect(off - bw / 2, -bl / 2, bw, bl * 0.45); ctx.fillRect(off - bw / 2, bl * 0.05, bw, bl * 0.45); } });
      ctx.restore();
    });
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
    const fu = P(l, at(b, "Korea"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagKR(ctx, 450, 220, 200); ctx.restore(); }
    const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
    text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
    rows.forEach(([k, v, ph], i) => {
      const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
      text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
      ctx.restore();
    });
    const au = P(l, at(b, "Korea"), 0.8);
    if (au > 0) ring(ctx, 1240, 300 + 2 * 92 - 14, 310, 48, au);
  }
  function field(ctx, x0, y0, w, h) {   // kebun desa dengan bedeng sayuran
    ctx.fillStyle = "#9CCB5E"; ctx.beginPath(); ctx.ellipse(x0 + w / 2, y0 + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#7DB043"; ctx.beginPath(); ctx.ellipse(x0 + w / 2, y0 + h * 0.58, w * 0.44, h * 0.34, 0, 0, Math.PI * 2); ctx.fill();
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) {
      const px = x0 + w * 0.17 + c * w * 0.13, py = y0 + h * 0.48 + r * h * 0.22;
      ctx.fillStyle = "#7A5230"; ctx.beginPath(); ctx.ellipse(px, py + 10, 26, 8, 0, 0, Math.PI * 2); ctx.fill();
      if ((r + c) % 2) { ctx.fillStyle = "#EE7A12"; ctx.beginPath(); ctx.moveTo(px - 9, py); ctx.lineTo(px + 9, py); ctx.lineTo(px, py + 26); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#2E8B3A"; [-8, 0, 8].forEach(d => { ctx.beginPath(); ctx.ellipse(px + d, py - 12, 4, 13, d * 0.05, 0, Math.PI * 2); ctx.fill(); }); }
      else { ctx.fillStyle = "#4FA34A"; ctx.beginPath(); ctx.arc(px, py - 4, 17, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#8ACB6A"; ctx.beginPath(); ctx.arc(px, py - 4, 9, 0, Math.PI * 2); ctx.fill(); }
    }
  }
  function desa(ctx, b, l) {
    board(ctx);
    field(ctx, 110, 380, 900, 400);
    const bu = P(l, at(b, "bekerja bersama"), 0.8);
    [[260, 440], [460, 410], [660, 430], [860, 450]].forEach(([x, y], i) => alpha(ctx, clamp(bu * 4 - i, 0, 1), () => {
      beaver(ctx, x, y + Math.sin(l * 3 + i) * 6, 150);
      // alat tani sederhana: cangkul / ember
      ctx.strokeStyle = "#7A5230"; ctx.lineWidth = 7; ctx.lineCap = "round";
      if (i % 2) { ctx.beginPath(); ctx.moveTo(x + 40, y - 10); ctx.lineTo(x + 70, y + 90); ctx.stroke(); ctx.fillStyle = "#8C98A2"; rr(ctx, x + 52, y + 84, 40, 18, 4); ctx.fill(); }
      else { ctx.fillStyle = "#4F8FD6"; rr(ctx, x + 36, y + 30, 40, 40, 6); ctx.fill(); ctx.strokeStyle = "#2F5F99"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + 56, y + 30, 16, Math.PI, 0); ctx.stroke(); }
    }));
    hand(ctx, "Desa Hana", 560, 260, 80, { color: INK, alpha: P(l, at(b, "Desa Hana"), 0.5) });
    alpha(ctx, P(l, at(b, "disebut Du-re"), 0.5), () => text(ctx, "Du-re", 1440, 300, 96, { align: "center", weight: 900, color: ORANGE }));
    alpha(ctx, P(l, at(b, "Du-re adalah"), 0.5), () => { hand(ctx, "= bekerja bersama-sama", 1440, 410, 52, { color: INK }); });
    alpha(ctx, P(l, at(b, "tugas pertanian"), 0.5), () => { hand(ctx, "untuk tugas pertanian", 1440, 490, 46, { color: C.ink2 }); });
    alpha(ctx, P(l, at(b, "gotong royong"), 0.5), () => { card(ctx, 1150, 580, 580, 120, { fill: "#EEF7F1", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "mirip gotong royong", 1440, 660, 50, { align: "center", weight: 900, color: GREEN }); });
  }

  // ---------- 5. penutup ----------
  function computer(ctx, x, y, s, col = "#2B3440") {
    ctx.fillStyle = col; rr(ctx, x - s * 0.5, y - s * 0.38, s, s * 0.62, s * 0.06); ctx.fill();
    ctx.fillStyle = "#EAF4FA"; rr(ctx, x - s * 0.46, y - s * 0.34, s * 0.92, s * 0.54, s * 0.03); ctx.fill();
    ctx.fillStyle = col; ctx.fillRect(x - s * 0.08, y + s * 0.24, s * 0.16, s * 0.12); rr(ctx, x - s * 0.28, y + s * 0.34, s * 0.56, s * 0.07, s * 0.03); ctx.fill();
  }
  function jadwal(ctx, b, l) {
    board(ctx);
    hand(ctx, "masalah penjadwalan", 960, 240, 74, { color: C.kiko, alpha: P(l, at(b, "penjadwalan"), 0.5) });
    hand(ctx, "cari pilihan yang memenuhi semua aturan", 960, 320, 42, { color: INK, alpha: P(l, at(b, "Kita mencari"), 0.5) });
    // komputer berisi jadwal pelajaran
    alpha(ctx, P(l, at(b, "jadwal pelajaran"), 0.5), () => {
      const X = 460, Y = 500, s = 440; computer(ctx, X, Y, s);
      const gx = X - s * 0.43, gy = Y - s * 0.31, cw = s * 0.86 / 5, ch = s * 0.48 / 5, cols = ["#F4D58D", "#BFE3F2", "#CDEBC4", "#F6C9C4", "#E0D4F5"];
      for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { ctx.fillStyle = r === 0 ? "#2B3440" : cols[(r * 2 + c * 3) % 5]; ctx.fillRect(gx + c * cw + 2, gy + r * ch + 2, cw - 4, ch - 4); }
      text(ctx, "jadwal pelajaran", X, 720, 32, { align: "center", weight: 800, color: C.ink2 });
    });
    alpha(ctx, P(l, at(b, "jadwal piket"), 0.5), () => {
      card(ctx, 900, 430, 420, 300, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 18 });
      text(ctx, "Jadwal Piket", 1110, 490, 36, { align: "center", weight: 900, color: ORANGE });
      ["Senin: Dito, Sinta", "Selasa: Ain, Boa", "Rabu: Gaon, Hana"].forEach((s, i) => text(ctx, s, 940, 560 + i * 55, 30, { weight: 700, color: INK }));
    });
    alpha(ctx, P(l, at(b, "jadwal pertandingan"), 0.5), () => {
      card(ctx, 1380, 430, 420, 300, { fill: "#F3F6F8", stroke: BLUE, lw: 4, r: 18 });
      text(ctx, "Pertandingan", 1590, 490, 36, { align: "center", weight: 900, color: BLUE });
      ["Tim 1 – Tim 2", "Tim 3 – Tim 4", "Tim 1 – Tim 3"].forEach((s, i) => text(ctx, s, 1590, 560 + i * 55, 30, { align: "center", weight: 700, color: INK }));
    });
  }
  function saring(ctx, b, l) {
    board(ctx);
    // corong: banyak kartu jadwal masuk, yang salah dicoret, sedikit yang lolos
    const t0 = at(b, "mencoret dulu");
    ctx.fillStyle = "#E6EEF3"; ctx.beginPath(); ctx.moveTo(560, 330); ctx.lineTo(1360, 330); ctx.lineTo(1040, 620); ctx.lineTo(880, 620); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#7A858E"; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = "#E6EEF3"; ctx.fillRect(900, 620, 120, 110); ctx.strokeRect(900, 620, 120, 110);
    for (let i = 0; i < 14; i++) {
      const x = 600 + (i % 7) * 105, y = 200 + Math.floor(i / 7) * 80, bad = i !== 3 && i !== 10;
      card(ctx, x, y, 90, 60, { fill: "#fff", stroke: "#9AA4AC", lw: 2, r: 8 });
      for (let k = 0; k < 3; k++) { ctx.fillStyle = "#BFC8CE"; ctx.fillRect(x + 12, y + 12 + k * 14, 66, 7); }
      if (bad) cross(ctx, x + 45, y + 30, 50, P(l, t0 + i * 0.12, 0.4), RED, 5);
    }
    alpha(ctx, P(l, at(b, "jauh lebih sedikit"), 0.5), () => {
      [0, 1].forEach(k => { const x = 920 + k * 0, y = 760 - k * 0; });
      card(ctx, 915, 750, 90, 60, { fill: "#fff", stroke: GREEN, lw: 3, r: 8 }); tick(ctx, 960, 780, 46, 1);
      hand(ctx, "tinggal sedikit yang diperiksa", 1450, 790, 42, { color: GREEN });
    });
    hand(ctx, "coret dulu yang pasti salah", 1600, 470, 40, { color: RED, alpha: P(l, t0, 0.5) });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Pakai aturan termudah untuk mencoret hari yang tidak mungkin.", "Periksa setiap pilihan dengan semua aturan.", "Cari orang yang tidak bisa ikut, dan orang yang tersedia di semua hari."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 42, { weight: 900, color: INK, fit: 1250 });
        const ix2 = 1660, iy = y + 80;
        if (i === 0) cross(ctx, ix2, iy, 70, 1, RED, 9);
        if (i === 1) tick(ctx, ix2, iy, 80, 1, GREEN, 10);
        if (i === 2) { ctx.strokeStyle = ORANGE; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(ix2 - 10, iy - 10, 30, 0, Math.PI * 2); ctx.stroke(); mline(ctx, [[ix2 + 12, iy + 12], [ix2 + 40, iy + 40]], 1, ORANGE, 10); }
      });
    });
  }
  function akhir(ctx, b, l) {
    board(ctx);
    kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
    [640, 860].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
    field(ctx, 560, 600, 420, 160);
    card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
    text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
    const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
    L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
    para(ctx, "Tabel soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
    hand(ctx, "Semoga sukses!", 330, 790, 50, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function tabel_v(ctx, b, l) {
    board(ctx);
    const id = b.id, g = GV, S = { rowHi: {}, colHi: {}, dim: {}, strike: {}, hdrRing: {}, oRing: {}, oCross: {}, nameRing: {}, rowMark: {}, countRing: {} };
    let note = "", nc = INK, sel = null;
    if (id === "h0") { S.oA = (i, j) => P(l, at(b, "Tabel ini") + (i * 7 + j) * 0.03, 0.3); note = "O = tersedia"; }
    if (id === "h1") { note = ""; }
    if (id === "h2") {
      S.count = { a: 1, v: j => [CNT[j], P(l, 0.3 + j * 0.25, 0.4), cntCol(CNT[j])] };
      [3, 4, 6].forEach((j, n) => { const u = P(l, at(b, "dicoret") + n * 0.2, 0.5); S.strike[j] = u; S.dim[j] = u; });
      note = "Semua pilihan memakai Senin, Selasa, Rabu, Sabtu"; nc = BLUE;
      if (l < at(b, "Tetapi")) note = "Kamis, Jumat, Minggu kurang dari 4";
      if (l < at(b, "Tetapi")) nc = RED;
    }
    if (id === "h3") { const tD = at(b, "Chaewon"); const isD = l > tD - 0.3; sel = OPTS[isD ? 3 : 1]; const r = isD ? 2 : 4; S.rowHi[r] = ROWBAD; S.rowMark[r] = { k: "cross", u: P(l, isD ? tD : at(b, "Eunwoo"), 0.5) }; note = isD ? "D (Sen, Rab, Sab): Chaewon tidak ikut" : "B (Sel, Rab, Sab): Eunwoo tidak ikut"; nc = RED; }
    if (id === "h4") {
      sel = OPTS[2]; S.rowHi[1] = ROWHI; [0, 1, 2].forEach(j => S.oRing["1," + j] = P(l, 0.4, 0.5));
      const t1 = at(b, "Kalau Boa"), rest = l < t1 ? -1 : [0, 1, 2][Math.floor((l - t1) / 1.4) % 3];
      S.count = { a: 1, v: j => sel.includes(j) ? (j === rest ? [3, 1, RED] : [4, 1, GREEN]) : null };
      if (rest >= 0) S.oCross["1," + rest] = 1;
      note = "C (Sen, Sel, Rab): Boa tersedia 3 hari"; nc = ORANGE;
    }
    if (id === "h5") { sel = OPTS[0]; S.count = { a: 1, v: j => sel.includes(j) ? [4, 1, GREEN] : null }; AV.forEach((r, i) => S.rowMark[i] = { k: "tick", u: P(l, 0.4 + i * 0.15, 0.4) }); note = "Jawaban: Senin, Selasa, Sabtu"; nc = GREEN; }
    if (sel) for (let j = 0; j < 7; j++) { if (sel.includes(j)) S.colHi[j] = COLHI; else S.dim[j] = 1; }
    table(ctx, g, S, l);
    if (note) text(ctx, note, 960, 812, 38, { align: "center", weight: 900, color: nc, fit: 1000 });
    if (id === "h1") OPTS.forEach((o, i) => alpha(ctx, P(l, at(b, "empat pilihan") + i * 0.3, 0.4), () => {
      const x = 490 + (i % 2) * 500, y = 735 + Math.floor(i / 2) * 62;
      letter(ctx, LET[i], x + 20, y - 11, 20, false); text(ctx, o.map(j => DAYS[j]).join(", "), x + 52, y, 32, { weight: 800, color: INK, fit: 440 });
    }));
  }
  function cta_bebras(ctx, b, l) {
    board(ctx);
    text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
    text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "Coret hari yang tidak mungkin, lalu periksa semua aturan", 960, 500, 36, { align: "center", weight: 800, color: ORANGE, fit: 980 });
    kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
  }

  Object.assign(K.SCENES, { buka, kredit, desa, tabel, jadwal, saring, langkah, akhir, tabel_v, cta_bebras });
})(typeof window !== "undefined" ? window : globalThis);
