/* PNG01 Pembahasan Soal Bebras 2025-LT-03 "Pesawat Terbang" (Lituania), kategori Penggalang (SMP).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras lain) + simulasi bandara:
   tujuh pesawat di landasan dan tiga jalur antre, berangkat satu per satu mengikuti jadwal.
   Warna dan motif pesawat diambil dari gambar soal (RGB diukur), jangan diganti.
   Jawaban: kotak 1 = A, 2 = C, 3 = B, 4 = D.
   Papan: x 52–1868, y 130–830 (kartu narasi 3 baris mulai y≈840, 4 baris y≈783).
   Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, kid, bakso, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Pesawat Terbang", tahun: "2025", negara: "Lituania", kode: "2025-LT-03" };

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
  const ORDER = ["intro1", "intro2", "kredit", "intro3", "soal1", "soal2", "soal3", "soal3b", "soal4", "soal5", "soal6", "soal7",
    "k1", "k2", "k3", "k4", "k5", "j1", "j2", "j3", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "n1", "n2", "n3", "n4", "n5",
    "r1", "r2", "r3", "r4", "c1", "c2", "c3"];
  const idx = id => ORDER.indexOf(id);
  // nilai kejadian: 1 bila beatnya sudah lewat, 0 bila belum, fn() bila beat ini
  function ev(b, id, fn) { const j = idx(id), k = idx(b.id); if (j < 0 || k < 0) return 0; if (j < k) return 1; if (j > k) return 0; return fn(); }

  // ---------- papan dan spidol ----------
  function board(ctx) {
    ctx.fillStyle = "#C3CDD4"; rr(ctx, 40, 118, 1840, 724, 22); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 52, 130, 1816, 700, 14); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.03)"; rr(ctx, 52, 130, 1816, 18, 8); ctx.fill();
  }
  function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
  function ptAt(pts, u) {
    const L = plen(pts) * clamp(u, 0, 1); let s = 0;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s + d >= L) { const k = d ? (L - s) / d : 0; return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; }
      s += d;
    }
    return pts[pts.length - 1];
  }
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
    text(ctx, "PIKIRKAN DULU", x + h + 20, y + h * 0.44, 34, { weight: 900, color: C.accentDark });
    text(ctx, q, x + h + 20, y + h * 0.8, 28, { weight: 800, color: INK, fit: w - h - 40 });
  }
  function letter(ctx, L, cx, cy, r, good) {
    ctx.fillStyle = good ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, cx, cy + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
  }

  // ---------- pesawat (menghadap ke kiri, seperti di soal) ----------
  // warna diukur dari gambar soal
  const PL = {
    A: { body: "#A4CE39", wing: "#A4CE39" },                                   // hijau polos
    B: { body: "#FFF200", wing: "#FFF200", pat: "dots", pc: "#00AEEF" },        // kuning bertotol biru
    C: { body: "#FBBC90", wing: "#FBBC90", pat: "tri", pc: "#ED1C24" },         // oranye bermotif segitiga merah
    D: { body: "#F8EB09", wing: "#776BB0", pat: "hstripe", pc: "#776BB0" },     // ungu bergaris kuning
    BB: { body: "#BFE8FB", wing: "#BFE8FB", pat: "vband", pc: "#3A9BD8" },      // biru belang
    HG: { body: "#7FC66B", wing: "#009649", pat: "diag", pc: "#FFF68E" },       // hijau bergaris
    BM: { body: "#00AEEF", wing: "#00AEEF", wing2: "#EC008C", pat: "half", pc: "#EC008C" },  // biru dan merah muda
    X: { body: "#E3E7EA", wing: "#C9D0D5" },                                    // pesawat contoh (bukan dari soal)
  };
  const NAMA = { A: "A", B: "B", C: "C", D: "D", BB: "biru belang", HG: "hijau bergaris", BM: "biru dan merah muda" };
  function bodyPath(ctx) {
    ctx.beginPath(); ctx.moveTo(-36, -13); ctx.lineTo(40, -13); ctx.quadraticCurveTo(52, -13, 52, -4); ctx.quadraticCurveTo(52, 10, 38, 11);
    ctx.lineTo(-36, 13); ctx.quadraticCurveTo(-52, 13, -52, 0); ctx.quadraticCurveTo(-52, -13, -36, -13); ctx.closePath();
  }
  function tailPath(ctx) { ctx.beginPath(); ctx.moveTo(26, -12); ctx.lineTo(38, -34); ctx.quadraticCurveTo(52, -38, 51, -26); ctx.lineTo(48, -8); ctx.closePath(); }
  function pattern(ctx, p) {
    ctx.fillStyle = p.pc;
    if (p.pat === "dots") { for (let x = -46; x <= 56; x += 10) for (let y = -38; y <= 14; y += 10) { const ox = (Math.round((y + 38) / 10) % 2) * 5; ctx.beginPath(); ctx.arc(x + ox, y, 3.4, 0, Math.PI * 2); ctx.fill(); } }
    if (p.pat === "tri") { for (let x = -54; x <= 56; x += 10) for (let y = -40; y <= 16; y += 10) { const ox = (Math.round((y + 40) / 10) % 2) * 5; ctx.beginPath(); ctx.moveTo(x + ox - 4.5, y - 3.5); ctx.lineTo(x + ox + 4.5, y - 3.5); ctx.lineTo(x + ox, y + 4); ctx.closePath(); ctx.fill(); } }
    if (p.pat === "hstripe") { for (let y = -40; y <= 16; y += 8.6) ctx.fillRect(-56, y, 112, 4.3); }
    if (p.pat === "vband") { for (let x = -40; x <= 56; x += 13) ctx.fillRect(x, -40, 6, 56); }
    if (p.pat === "diag") { ctx.save(); ctx.lineWidth = 3.4; ctx.strokeStyle = p.pc; for (let x = -80; x <= 70; x += 8) { ctx.beginPath(); ctx.moveTo(x, 16); ctx.lineTo(x + 50, -40); ctx.stroke(); } ctx.restore(); }
    if (p.pat === "half") { ctx.fillRect(-56, 0, 112, 18); }
  }
  function plane(ctx, k, cx, cy, s, opt = {}) {
    const p = PL[k]; if (!p) return;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 104, s / 104); if (opt.rot) ctx.rotate(opt.rot);
    if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    const OL = "#3A3A3A"; ctx.lineWidth = 1.6; ctx.strokeStyle = OL; ctx.lineJoin = "round";
    // sayap belakang (atas)
    ctx.fillStyle = p.wing; ctx.beginPath(); ctx.moveTo(-16, -8); ctx.quadraticCurveTo(-8, -42, 2, -42); ctx.quadraticCurveTo(12, -42, 10, -8); ctx.closePath(); ctx.fill(); ctx.stroke();
    // ekor dan badan dengan motif
    ctx.save(); tailPath(ctx); ctx.fillStyle = p.body; ctx.fill(); ctx.clip(); pattern(ctx, p); ctx.restore(); tailPath(ctx); ctx.stroke();
    ctx.save(); bodyPath(ctx); ctx.fillStyle = p.body; ctx.fill(); ctx.clip(); pattern(ctx, p); ctx.restore(); bodyPath(ctx); ctx.stroke();
    // sayap depan (bawah)
    ctx.fillStyle = p.wing2 || p.wing; ctx.beginPath(); ctx.moveTo(-14, 4); ctx.quadraticCurveTo(4, 42, 18, 46); ctx.quadraticCurveTo(28, 48, 24, 34); ctx.lineTo(14, 5); ctx.closePath(); ctx.fill(); ctx.stroke();
    // kokpit, jendela, roda
    ctx.fillStyle = "#222"; ctx.beginPath(); ctx.ellipse(-40, -4, 6.5, 3.6, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-22, 1, 2.8, 0, Math.PI * 2); ctx.arc(-14, 1, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#222"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-32, 13); ctx.lineTo(-33, 18); ctx.moveTo(38, 11); ctx.lineTo(39, 16); ctx.stroke();
    ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(-36, 20, 3.4, 0, Math.PI * 2); ctx.arc(-29, 22, 3.4, 0, Math.PI * 2); ctx.arc(39, 17, 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // ---------- bandara ----------
  // koordinat lokal 1000×560: landasan kiri (y 280), tiga jalur (y 110, 280, 450), slot depan x 480, belakang x 715
  const LANE_Y = [110, 280, 450], SLOT_X = [480, 715], RUN = [160, 280], PS = 176;
  const SOAL_PLANES = [{ k: "A", lane: -1 }, { k: "B", lane: 0, slot: 0 }, { k: "BM", lane: 0, slot: 1 }, { k: "C", lane: 1, slot: 0 }, { k: "HG", lane: 1, slot: 1 },
    { k: "BB", lane: 2, slot: 0 }, { k: "D", lane: 2, slot: 1 }];
  function airportBg(ctx) {
    ctx.fillStyle = "#E5F1D7"; rr(ctx, 0, 0, 1000, 560, 40); ctx.fill();
    ctx.fillStyle = "#96999E";
    ctx.fillRect(0, 225, 320, 110); rr(ctx, 290, 50, 90, 460, 40); ctx.fill();
    LANE_Y.forEach(y => { ctx.fillRect(330, y - 55, 670, 110); });
    ctx.fillStyle = "#FFFFFF";
    for (let x = 20; x < 280; x += 60) ctx.fillRect(x, 276, 34, 8);   // garis tengah landasan
    LANE_Y.forEach(y => { [382, 598, 832, 978].forEach(x => ctx.fillRect(x, y - 45, 10, 90)); });
  }
  // posisi pesawat: dep(k) 0..1 (0 = masih di tempat, 1 = sudah terbang)
  function planePos(pl, dep, planes) {
    const d = dep(pl.k);
    let x, y;
    if (pl.lane < 0) { x = RUN[0]; y = RUN[1]; }
    else {
      y = LANE_Y[pl.lane]; x = SLOT_X[pl.slot || 0];
      if (pl.slot === 1) {   // maju bila pesawat depan di jalurnya sudah berangkat
        const f = planes.find(q => q.lane === pl.lane && (q.slot || 0) === 0);
        const adv = f ? ease(clamp((dep(f.k) - 0.35) / 0.45, 0, 1)) : 0;
        x = lerp(SLOT_X[1], SLOT_X[0], adv);
      }
    }
    if (d <= 0) return { x, y, a: 1, s: 1 };
    const path = pl.lane < 0 ? [[x, y], [-260, RUN[1]]] : [[x, y], [335, y], [335, RUN[1]], [RUN[0], RUN[1]], [-260, RUN[1]]];
    const q = ptAt(path, ease(clamp(d, 0, 1)));
    const off = clamp((RUN[0] - q[0]) / 300, 0, 1);   // lepas landas: naik, membesar, memudar
    return { x: q[0], y: q[1] - off * 60, a: 1 - off, s: 1 + off * 0.25 };
  }
  // airport(ctx, x, y, sc, {planes, dep, hi(k)->0..1, letters, dim(k)})
  function airport(ctx, X, Y, sc, o = {}) {
    const planes = o.planes || SOAL_PLANES, dep = o.dep || (() => 0);
    ctx.save(); ctx.translate(X, Y); ctx.scale(sc, sc);
    airportBg(ctx);
    if (o.under) o.under(ctx);
    ctx.save(); ctx.beginPath(); rr(ctx, -2, -2, 1004, 564, 40); ctx.clip();
    const pos = {};
    planes.forEach(pl => {
      const q = planePos(pl, dep, planes); pos[pl.k] = q; if (q.a <= 0.01) return;
      const h = o.hi ? o.hi(pl.k) : 0;
      if (h > 0) alpha(ctx, h, () => { ctx.fillStyle = "rgba(238,122,18,0.22)"; ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; rr(ctx, q.x - 112, q.y - 52, 224, 104, 18); ctx.fill(); ctx.stroke(); });
      plane(ctx, pl.k, q.x, q.y, PS * q.s, { alpha: q.a * (o.dim ? 1 - 0.65 * o.dim(pl.k) : 1) });
    });
    ctx.restore();
    if (o.letters) planes.forEach(pl => {
      const L = "ABCD".includes(pl.k) ? pl.k : null, u = o.letters(pl.k); if (!L || u <= 0 || pos[pl.k].a < 0.98 || pos[pl.k].x < 80) return;
      alpha(ctx, u, () => letter(ctx, L, pos[pl.k].x - 66, pos[pl.k].y - 40, 26));
    });
    if (o.over) o.over(ctx, pos);
    ctx.restore();
    return { pos, X, Y, sc, g: (x, y) => [X + x * sc, Y + y * sc] };
  }

  // ---------- jadwal ----------
  const ROWS = [["10:45", 1], ["10:52", "BB"], ["10:55", 2], ["10:59", "HG"], ["11:00", 3], ["11:10", "BM"], ["11:11", 4]];
  const ANS = { 1: "A", 2: "C", 3: "B", 4: "D" };
  // tabel tegak: fill(n)->0..1 (kotak terisi), hi(i)->0..1 (sorotan baris), ghost: {n, k, a}
  function schedule(ctx, x, y, w, rh, o = {}) {
    const hh = rh * 0.8, tw = w * 0.36;
    ctx.fillStyle = "#F3F5F7"; ctx.fillRect(x, y, w, hh);
    text(ctx, "Waktu", x + tw / 2, y + hh * 0.66, rh * 0.36, { align: "center", weight: 900, color: INK });
    text(ctx, "Pesawat", x + tw + (w - tw) / 2, y + hh * 0.66, rh * 0.36, { align: "center", weight: 900, color: INK });
    ROWS.forEach(([t, v], i) => {
      const ry = y + hh + i * rh, cx = x + tw + (w - tw) / 2, cy = ry + rh / 2;
      const h = o.hi ? o.hi(i) : 0;
      if (h > 0) alpha(ctx, h, () => { ctx.fillStyle = "rgba(238,122,18,0.16)"; ctx.fillRect(x, ry, w, rh); });
      text(ctx, t, x + tw / 2, cy + rh * 0.15, rh * 0.42, { align: "center", weight: 800, color: INK });
      if (typeof v === "string") plane(ctx, v, cx, cy + 2, rh * 1.2);
      else {
        const f = o.fill ? o.fill(v) : 0, bs = rh * 0.74;
        ctx.save(); ctx.setLineDash([8, 6]); ctx.strokeStyle = "#8A96A0"; ctx.lineWidth = 3; rr(ctx, cx - bs * 1.9, cy - bs / 2, bs * 3.8, bs, 10); ctx.stroke(); ctx.restore();
        const g = o.ghost && o.ghost.n === v ? o.ghost : null;
        if (f < 1 && !(g && g.a > 0)) alpha(ctx, 1 - f, () => text(ctx, String(v), cx, cy + rh * 0.17, rh * 0.5, { align: "center", weight: 900, color: "#5A6670" }));
        if (g && g.a > 0) alpha(ctx, g.a, () => { letter(ctx, g.k, cx - bs * 1.3, cy, rh * 0.27); plane(ctx, g.k, cx + bs * 0.3, cy + 2, rh * 1.15, { alpha: 0.5 }); text(ctx, "?", cx + bs * 1.5, cy - bs * 0.1, rh * 0.4, { align: "center", weight: 900, color: RED }); });
        if (f > 0) alpha(ctx, f, () => { letter(ctx, ANS[v], cx - bs * 1.3, cy, rh * 0.27, true); plane(ctx, ANS[v], cx + bs * 0.3, cy + 2, rh * 1.15); });
      }
      if (o.ring && o.ring(i) > 0) ring(ctx, x + w / 2, cy, w * 0.53, rh * 0.62, o.ring(i), o.ringColor ? o.ringColor(i) : ORANGE, 5);
    });
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, hh + ROWS.length * rh);
    ctx.beginPath(); ctx.moveTo(x + tw, y); ctx.lineTo(x + tw, y + hh + ROWS.length * rh);
    for (let i = 0; i <= ROWS.length - 1; i++) { ctx.moveTo(x, y + hh + i * rh); ctx.lineTo(x + w, y + hh + i * rh); }
    ctx.stroke();
    return { rowY: i => y + hh + i * rh + rh / 2, x, w };
  }

  // ---------- simulasi: siapa sudah berangkat, kotak mana sudah terisi ----------
  const DEP = { A: ["j3", "lepas landas", 0], BB: ["m1", "berangkat", 0], C: ["m5", "diisi pesawat C", 0.6], HG: ["m7", "berangkat", 0],
    B: ["n3", "diisi pesawat B", 0.6], BM: ["n3", "diisi pesawat B", 3.4], D: ["n4", "diisi pesawat D", 0.6] };
  const FILL = { 1: ["j3", "kotak satu diisi"], 2: ["m5", "kotak dua diisi"], 3: ["n3", "kotak tiga diisi"], 4: ["n4", "kotak empat diisi"] };
  const DUR = 2.6;
  function depOf(b, l) {
    return k => { const [id, ph, dt] = DEP[k]; if (b.akhir && k === "D") return P(l, at(b, ph) + 3.4 + 2.6, DUR); return ev(b, id, () => P(l, at(b, ph) + dt, DUR)); };
  }
  function fillOf(b, l) {
    return n => { const [id, ph] = FILL[n]; if (b.akhir && n === 4) return P(l, at(b, "diisi pesawat B") + 5.6, 0.5); return ev(b, id, () => P(l, at(b, ph) + 0.3, 0.5)); };
  }

  // ---------- adegan: soal ----------
  function laneLabels(ctx, a, u) {
    ["jalur atas", "jalur tengah", "jalur bawah"].forEach((s, i) => { const [x, y] = a.g(1010, LANE_Y[i]); hand(ctx, s, x + 8, y + 14, 36, { color: INK, align: "left", alpha: u }); });
  }
  function bandara(ctx, b, l) {
    board(ctx);
    const id = b.id, X = 150, Y = 175, sc = 1.04;
    const lanesHi = { soal3: [0], soal3b: [1], soal4: [2] }[id] || [];
    const a = airport(ctx, X, Y, sc, {
      hi: k => {
        if (id === "soal2" && k === "A") return P(l, at(b, "hijau polos"), 0.5);
        const pl = SOAL_PLANES.find(q => q.k === k);
        return pl && lanesHi.includes(pl.lane) ? P(l, 0.3, 0.5) : 0;
      },
      dim: k => { const pl = SOAL_PLANES.find(q => q.k === k); return lanesHi.length && !(pl && lanesHi.includes(pl.lane)) ? 0.6 : 0; },
      letters: id === "soal7" ? (k => P(l, at(b, "pesawat " + k + " "), 0.5)) : null,
      over: (cx) => {
        if (id === "soal1") {
          const u = P(l, at(b, "satu landasan"), 0.6);
          alpha(ctx, u, () => { ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, 4, 222, 300, 116, 14); ctx.stroke(); });
          hand(ctx, "satu", 20, 150, 38, { alpha: u, align: "left" }); hand(ctx, "landasan pacu", 20, 196, 38, { alpha: u, align: "left" });
        }
      },
    });
    if (id === "soal1") hand(ctx, "7 pesawat", 1260, 300, 44, { color: INK, align: "left", alpha: P(l, at(b, "tujuh pesawat"), 0.6) });
    if (id === "soal2") { laneLabels(ctx, a, P(l, at(b, "jalur atas"), 0.6)); hand(ctx, "← arah antre", 1260, 760, 38, { align: "left", alpha: P(l, at(b, "tiga jalur"), 0.6) }); }
    else if (idx(id) > idx("soal2")) laneLabels(ctx, a, 1);
    if (id === "soal1") hand(ctx, "berangkat bergantian", 1260, 470, 38, { color: INK, align: "left", alpha: P(l, at(b, "bergantian"), 0.6) });
    if (lanesHi.length) {   // depan / belakang di panel kanan
      const i = lanesHi[0], ly = a.g(0, LANE_Y[i])[1], f = SOAL_PLANES.find(q => q.lane === i && q.slot === 0).k, r = SOAL_PLANES.find(q => q.lane === i && q.slot === 1).k;
      const u1 = P(l, at(b, "di depan"), 0.5), u2 = P(l, at(b, "di belakang"), 0.5), y = ly;
      alpha(ctx, u1, () => { plane(ctx, f, 1560, y, 140); hand(ctx, "depan", 1560, y + 80, 34, { color: GREEN }); });
      alpha(ctx, u2, () => { plane(ctx, r, 1760, y, 140); hand(ctx, "belakang", 1760, y + 80, 34, { color: INK }); });
    }
    if (id === "soal4") {
      const u = P(l, at(b, "Semua pesawat"), 0.6);
      alpha(ctx, u, () => { card(ctx, 1250, 150, 560, 110, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "Harus mengikuti antrean!", 1530, 220, 40, { align: "center", weight: 900, color: INK }); });
    }
    if (id === "soal7") {
      const u = P(l, at(b, "Ayo kita"), 0.6);
      alpha(ctx, u, () => { card(ctx, 1250, 600, 570, 130, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 3, r: 20 }); text(ctx, "Isi kotak 1–4 dengan", 1535, 655, 36, { align: "center", weight: 800, color: INK }); text(ctx, "A, B, C, atau D", 1535, 705, 40, { align: "center", weight: 900, color: ORANGE }); });
    }
  }
  function jadwal(ctx, b, l) {
    board(ctx);
    const first = b.id === "soal5";
    const s = schedule(ctx, 230, 150, 640, 76, {
      hi: i => first ? (typeof ROWS[i][1] === "number" ? P(l, at(b, "kotak kosong"), 0.5) : P(l, at(b, "Tiga waktu"), 0.5) * (1 - P(l, at(b, "kotak kosong"), 0.5))) : 0,
    });
    if (first) {
      text(ctx, "Jadwal lepas landas", 1340, 260, 52, { align: "center", weight: 900, color: INK });
      hand(ctx, "7 waktu keberangkatan", 1340, 360, 40, { color: INK, alpha: P(l, at(b, "tujuh waktu"), 0.6) });
      hand(ctx, "3 sudah ada pesawatnya", 1340, 440, 40, { color: GREEN, alpha: P(l, at(b, "Tiga waktu"), 0.6) });
      hand(ctx, "4 kotak kosong: 1, 2, 3, 4", 1340, 520, 40, { alpha: P(l, at(b, "kotak kosong"), 0.6) });
      mline(ctx, [[1100, 545], [900, 600]], P(l, at(b, "kotak kosong") + 0.4, 0.5), ORANGE, 6, true);
    } else {
      text(ctx, "Isi kotak kosong dengan pesawat yang seharusnya.", 1350, 230, 36, { align: "center", weight: 900, color: INK, fit: 900 });
      ["A", "B", "C", "D"].forEach((k, i) => {
        const x = 1080 + (i % 2) * 400, y = 360 + Math.floor(i / 2) * 210, u = P(l, at(b, "Pilihannya") + i * 0.35, 0.5);
        alpha(ctx, u, () => { card(ctx, x - 10, y - 70, 360, 170, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 }); letter(ctx, k, x + 50, y + 15, 36); plane(ctx, k, x + 220, y + 15, 200); });
      });
    }
  }

  // ---------- adegan: memahami antrean ----------
  function cart(ctx, x, y) {
    ctx.fillStyle = "#C0392B"; rr(ctx, x - 120, y - 30, 240, 150, 14); ctx.fill();
    ctx.fillStyle = "#F4E3C1"; rr(ctx, x - 100, y - 10, 200, 60, 10); ctx.fill();
    text(ctx, "BAKSO", x, y + 34, 40, { align: "center", weight: 900, color: "#C0392B" });
    ctx.fillStyle = "#7F8C8D"; ctx.fillRect(x - 130, y - 120, 12, 120); ctx.fillRect(x + 118, y - 120, 12, 120);
    ctx.fillStyle = "#F39C12"; rr(ctx, x - 150, y - 150, 300, 40, 10); ctx.fill();
    ctx.fillStyle = "#333"; ctx.beginPath(); ctx.arc(x - 70, y + 130, 22, 0, Math.PI * 2); ctx.arc(x + 70, y + 130, 22, 0, Math.PI * 2); ctx.fill();
    bakso(ctx, x, y - 60, 90);
  }
  function kantin(ctx, b, l) {
    board(ctx);
    cart(ctx, 330, 520);
    const kids = [[640, "#5B3A29", null, "1"], [880, C.hair, "long", "2"], [1120, "#3B2A1A", null, "3"]];
    const u0 = P(l, at(b, "antre membeli"), 0.6);
    kids.forEach(([x, hc, hr, n], i) => alpha(ctx, clamp(u0 * 3 - i, 0, 1), () => { kid(ctx, x, 480, 150, { hairColor: hc, hair: hr }); hand(ctx, n, x, 740, 44, { color: INK }); }));
    const u1 = P(l, at(b, "dilayani lebih dulu"), 0.6);
    mline(ctx, [[600, 250], [470, 250]], u1, GREEN, 7, true);
    hand(ctx, "dilayani lebih dulu", 640, 225, 36, { color: GREEN, alpha: u1, align: "left" });
    // menyalip: murid ke-4 mencoba masuk di depan, dicoret
    const u2 = P(l, at(b, "tidak boleh menyalip"), 0.6);
    alpha(ctx, u2, () => {
      const x = lerp(1450, 1300, u2);
      kid(ctx, x, 480, 150, { hairColor: "#6B4226" });
      mline(ctx, [[x - 60, 330], [1000, 330], [760, 330]], u2, RED, 6, true);
      cross(ctx, 1000, 330, 80, P(l, at(b, "tidak boleh menyalip") + 0.6, 0.5));
      hand(ctx, "tidak boleh menyalip", 1450, 760, 40, { color: RED });
    });
  }
  function jalur(ctx, b, l) {
    board(ctx);
    // satu jalur, digambar besar (jalur tengah soal)
    ctx.save(); ctx.translate(260, 260); ctx.scale(1.35, 1.35);
    ctx.fillStyle = "#E5F1D7"; rr(ctx, -40, -40, 1040, 260, 30); ctx.fill();
    ctx.fillStyle = "#96999E"; ctx.fillRect(0, 35, 1000, 110);
    ctx.fillStyle = "#fff"; [60, 300, 560, 960].forEach(x => ctx.fillRect(x, 45, 10, 90));
    plane(ctx, "C", 200, 90, 190); plane(ctx, "HG", 440, 90, 190);
    mline(ctx, [[960, 175], [40, 175]], P(l, 0.3, 0.8), ORANGE, 6, true);
    ctx.restore();
    const u1 = P(l, at(b, "di depan"), 0.5), u2 = P(l, at(b, "di belakangnya"), 0.5);
    hand(ctx, "1. berangkat lebih dulu", 530, 230, 40, { color: GREEN, alpha: u1 });
    hand(ctx, "2. sesudahnya", 855, 230, 40, { color: INK, alpha: u2, align: "left" });
    hand(ctx, "arah antre", 1450, 560, 36, { alpha: P(l, 0.6, 0.6) });
    text(ctx, "Di setiap jalur:", 960, 640, 44, { align: "center", weight: 900, color: INK });
    hand(ctx, "yang di depan berangkat lebih dulu", 960, 720, 52, { alpha: P(l, at(b, "harus berangkat"), 0.6) });
  }
  const EX_PL = [{ k: "X", lane: 0, slot: 0 }, { k: "X", lane: 0, slot: 1 }, { k: "X", lane: 1, slot: 0 }, { k: "X", lane: 1, slot: 1 }, { k: "X", lane: 2, slot: 0 }, { k: "X", lane: 2, slot: 1 }]
    .map((p, i) => ({ ...p, k: "X" + i }));
  function selang(ctx, b, l) {
    board(ctx);
    EX_PL.forEach(p => { PL[p.k] = PL.X; });
    const t = { X4: at(b, "jalur bawah boleh"), X2: at(b, "jalur tengah,"), X5: at(b, "jalur bawah lagi") };
    const a = airport(ctx, 150, 175, 1.04, { planes: EX_PL, dep: k => t[k] != null ? P(l, t[k], DUR) : 0 });
    // nomor urutan berangkat di samping jalur
    [["1", 2, "X4"], ["2", 1, "X2"], ["3", 2, "X5"]].forEach(([s, lane, k], i) => {
      const u = P(l, t[k], 0.4); const [x, y] = a.g(1010, LANE_Y[lane]);
      alpha(ctx, u, () => hand(ctx, s + ". jalur " + (lane === 2 ? "bawah" : "tengah"), x + 20, 300 + i * 70, 38, { color: INK, align: "left" }));
    });
    hand(ctx, "pesawat contoh", 1290, 230, 32, { color: C.ink2, align: "left", alpha: P(l, 0.2, 0.6) });
    hand(ctx, "boleh berselang-seling", 1290, 640, 40, { color: GREEN, align: "left", alpha: P(l, at(b, "berselang-seling"), 0.6) });
  }
  function aturan(ctx, b, l) {
    board(ctx);
    card(ctx, 200, 190, 1520, 230, { fill: "#FFF8E8", stroke: ORANGE, lw: 5, r: 26 });
    text(ctx, "Di dalam satu jalur,", 960, 280, 60, { align: "center", weight: 900, color: INK });
    text(ctx, "urutannya tidak boleh berubah.", 960, 370, 60, { align: "center", weight: 900, color: ORANGE });
    // kecil: jalur dengan dua pesawat
    plane(ctx, "B", 520, 560, 170); plane(ctx, "BM", 740, 560, 170);
    mline(ctx, [[640, 640], [420, 640]], 1, GREEN, 6, true);
    if (b.id === "k5") {
      const u = P(l, at(b, "disebut antrean"), 0.6);
      alpha(ctx, u, () => {
        card(ctx, 960, 480, 760, 270, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 3, r: 22 });
        text(ctx, "antrean (queue)", 1340, 560, 52, { align: "center", weight: 900, color: C.kikoDark });
        text(ctx, "masuk lebih dulu", 1340, 640, 40, { align: "center", weight: 800, color: INK });
        text(ctx, "→ keluar lebih dulu", 1340, 700, 40, { align: "center", weight: 800, color: INK });
      });
    } else hand(ctx, "dipakai berkali-kali", 1300, 620, 44, { alpha: P(l, at(b, "berkali-kali"), 0.6) });
  }

  // ---------- adegan utama: bandara + jadwal ----------
  const AX = 90, AY = 255, AS = 0.93, TX = 1100, TY = 150, TW = 730, RH = 76;
  function isi(ctx, b, l) {
    board(ctx);
    const id = b.id, dep = depOf(b, l), fill = fillOf(b, l);
    const think = id === "m2" || id === "n1";
    const pl = k => SOAL_PLANES.find(q => q.k === k);
    // sorotan pesawat
    const hiP = k => {
      if (id === "j2" && k === "A") return P(l, at(b, "Pesawat A"), 0.5);
      if (id === "m3" && k === "HG") return P(l, at(b, "pesawat hijau"), 0.5);
      if (id === "m4" && (k === "HG" || k === "C")) return P(l, at(b, k === "C" ? "pesawat C" : "hijau bergaris"), 0.5);
      if (id === "n2" && (k === "BM" || k === "B")) return P(l, at(b, k === "B" ? "pesawat B" : "biru dan merah"), 0.5);
      return 0;
    };
    const a = airport(ctx, AX, AY, AS, {
      dep, hi: hiP, letters: k => 1,
      over: (cx, pos) => {
        if (id === "j2") {   // ketiga jalur terhalang oleh A
          const u = P(l, at(b, "Tidak ada"), 0.5);
          LANE_Y.forEach(y => mline(cx, [[380, y], [335, y], [335, RUN[1]], [262, RUN[1]]], u, RED, 5, true));
          cross(cx, 300, RUN[1] - 90, 60, P(l, at(b, "Tidak ada") + 0.5, 0.5));
        }
        if (id === "m4" || id === "n2") {   // panah "harus lebih dulu" di sela jalur
          const lane = id === "m4" ? 1 : 0, y = LANE_Y[lane] + 70, u = P(l, at(b, id === "m4" ? "Jadi, pesawat C" : "di belakang pesawat B"), 0.6);
          mline(cx, [[SLOT_X[1], y], [SLOT_X[0] + 10, y]], u, ORANGE, 7, true);
        }
        if (id === "n5") {   // kilas balik jalur bawah: biru belang lalu D
          const u = P(l, at(b, "di belakang pesawat biru"), 0.6);
          alpha(cx, u, () => {
            cx.fillStyle = "rgba(255,255,255,0.9)"; rr(cx, 360, 370, 640, 175, 20); cx.fill(); cx.strokeStyle = GREEN; cx.lineWidth = 4; cx.stroke();
            plane(cx, "BB", 480, 425, 125, { alpha: 0.85 }); plane(cx, "D", 715, 425, 125);
            text(cx, "10:52", 480, 528, 30, { align: "center", weight: 800, color: INK }); text(cx, "11:11", 715, 528, 30, { align: "center", weight: 800, color: INK });
            tick(cx, 900, 440, 70, P(l, at(b, "boleh berangkat"), 0.5));
          });
        }
      },
    });
    // catatan di atas bandara
    const note = (s, ph, col) => hand(ctx, s, AX + 10, 225, 40, { color: col || ORANGE, align: "left", alpha: P(l, at(b, ph), 0.6) });
    if (think) thinkBadge(ctx, AX, 140, 900, 100, l, b.dur, id === "m2" ? "Pesawat mana yang mengisi kotak 2?" : "Pesawat mana untuk kotak 3 dan kotak 4?");
    else if (id === "j2") note("A paling depan, tidak bisa dilewati", "Tidak ada");
    else if (id === "m4") note("C harus berangkat sebelum 10:59", "Jadi, pesawat C");
    else if (id === "n2") note("B harus berangkat sebelum 11:10", "di belakang pesawat B");
    else if (id === "m7") note("jalur tengah kosong", "jalur tengah", GREEN);
    else if (id === "n5") note("D di belakang biru belang: aman", "Tidak.", GREEN);
    // jadwal
    const hiRow = {
      j1: [0], j2: [0], j3: [0], m1: [1], m2: [2], m3: [3], m4: [3], m7: [3], n1: [4, 6], n2: [5], n4: [6], n5: [1, 6],
    }[id] || [];
    const s = schedule(ctx, TX, TY, TW, RH, {
      fill, hi: i => {
        if (id === "m5") return [0, 2].includes(i) ? P(l, at(b, "Hanya kotak"), 0.5) : 0;
        if (id === "n3") return i === 4 ? P(l, at(b, "hanya kotak tiga"), 0.5) * (1 - P(l, at(b, "diisi pesawat B") + 3.2, 0.4)) : i === 5 ? P(l, at(b, "diisi pesawat B") + 3.2, 0.4) : 0;
        return hiRow.includes(i) ? P(l, 0.2, 0.5) : 0;
      },
      ring: i => (id === "m3" && i === 3) ? P(l, at(b, "Pukul sepuluh"), 0.7) : (id === "n2" && i === 5) ? P(l, at(b, "baris pukul"), 0.7) : 0,
    });
  }
  // bagaimana kalau kotak 2 = B?
  function andai(ctx, b, l) {
    board(ctx);
    const gone = { A: 1, BB: 1, B: P(l, at(b, "misalnya pesawat B") + 0.3, DUR) };
    airport(ctx, AX, AY, AS, {
      dep: k => gone[k] || 0, letters: () => 1, hi: k => k === "HG" ? P(l, at(b, "masih terhalang"), 0.5) : 0,
      over: (cx) => {
        const u = P(l, at(b, "masih terhalang") + 0.3, 0.5);
        cross(cx, SLOT_X[1] - 115, LANE_Y[1] - 4, 70, u);
        alpha(cx, u, () => hand(cx, "terhalang C!", SLOT_X[1] + 10, LANE_Y[1] + 95, 38, { color: RED }));
      },
    });
    card(ctx, AX, 140, 900, 100, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 3, r: 18 });
    text(ctx, "Bagaimana kalau kotak 2 diisi B?", AX + 450, 205, 40, { align: "center", weight: 900, color: INK });
    const erase = P(l, b.dur - 1.2, 0.6);
    schedule(ctx, TX, TY, TW, RH, {
      fill: n => n === 1 ? 1 : 0,
      ghost: { n: 2, k: "B", a: P(l, at(b, "misalnya pesawat B"), 0.5) * (1 - erase) },
      hi: i => i === 2 ? P(l, 0.2, 0.5) : 0,
      ring: i => i === 3 ? P(l, at(b, "masih terhalang"), 0.6) : 0, ringColor: () => RED,
    });
    const u = P(l, at(b, "Jadwalnya menjadi kacau"), 0.5) * (1 - erase);
    alpha(ctx, u, () => { cross(ctx, TX + TW * 0.68, TY + RH * 0.8 + 2.5 * RH, 70, 1); hand(ctx, "kacau!", TX - 60, TY + RH * 0.8 + 3.7 * RH, 44, { color: RED }); });
  }

  // ---------- memeriksa ----------
  const SEQ = ["A", "BB", "C", "HG", "B", "BM", "D"], SEQT = ["10:45", "10:52", "10:55", "10:59", "11:00", "11:10", "11:11"];
  function urut(ctx, b, l) {
    board(ctx);
    const first = b.id === "r1", top = first ? 400 : 225, sz = first ? 210 : 140, dx = 245, x0 = 220;
    if (first) text(ctx, "Urutan lepas landas", 960, 230, 48, { align: "center", weight: 900, color: INK });
    SEQ.forEach((k, i) => {
      const u = first ? P(l, at(b, "Urutannya") + i * 0.55, 0.5) : 1;
      alpha(ctx, u, () => {
        const x = x0 + i * dx;
        plane(ctx, k, x, top, sz);
        text(ctx, SEQT[i], x, top + sz * 0.62, first ? 36 : 28, { align: "center", weight: 800, color: INK });
        if ("ABCD".includes(k)) letter(ctx, k, x - sz * 0.38, top - sz * 0.3, first ? 26 : 22, true);
      });
    });
    if (first) { mline(ctx, [[1760, 640], [180, 640]], P(l, at(b, "Urutannya"), 1.5), ORANGE, 6, true); hand(ctx, "pertama", 220, 700, 36, { alpha: P(l, at(b, "Urutannya"), 0.6) }); hand(ctx, "terakhir", 1690, 700, 36, { color: INK, alpha: P(l, at(b, "lalu D"), 0.6) }); return; }
    // tiga jalur
    const L = [["jalur atas", "B", "BM", "Di jalur atas"], ["jalur tengah", "C", "HG", "Di jalur tengah"], ["jalur bawah", "BB", "D", "Di jalur bawah"]];
    L.forEach(([nm, f, r, ph], i) => {
      const y = 420 + i * 128, u = P(l, at(b, ph), 0.5);
      alpha(ctx, u, () => {
        card(ctx, 240, y - 55, 1440, 112, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
        text(ctx, nm, 280, y + 12, 34, { weight: 900, color: INK });
        plane(ctx, f, 640, y, 150); text(ctx, SEQT[SEQ.indexOf(f)], 760, y + 12, 32, { weight: 800, color: INK });
        hand(ctx, "sebelum", 960, y + 12, 36, { color: ORANGE });
        plane(ctx, r, 1170, y, 150); text(ctx, SEQT[SEQ.indexOf(r)], 1290, y + 12, 32, { weight: 800, color: INK });
        tick(ctx, 1560, y, 60, P(l, at(b, ph) + 1.6, 0.5));
      });
    });
  }
  function jawaban(ctx, b, l) {
    board(ctx);
    text(ctx, "Jawaban", 960, 215, 52, { align: "center", weight: 900, color: INK });
    const first = b.id === "r3";
    [1, 2, 3, 4].forEach((n, i) => {
      const x = 170 + i * 410, y = 270, u = first ? P(l, at(b, ["kotak satu", "kotak dua", "kotak tiga", "kotak empat"][i]), 0.5) : 1;
      alpha(ctx, u, () => {
        card(ctx, x, y, 370, 300, { fill: "#F2FAF5", stroke: GREEN, lw: 4, r: 24 });
        text(ctx, "Kotak " + n, x + 185, y + 60, 40, { align: "center", weight: 900, color: INK });
        text(ctx, ["10:45", "10:55", "11:00", "11:11"][i], x + 185, y + 105, 30, { align: "center", weight: 700, color: C.ink2 });
        letter(ctx, ANS[n], x + 55, y + 200, 36, true); plane(ctx, ANS[n], x + 230, y + 205, 200);
      });
    });
    if (!first) {
      const u = P(l, at(b, "Kita bertanya"), 0.6);
      alpha(ctx, u, () => { card(ctx, 260, 620, 1400, 110, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 22 }); text(ctx, "Siapa yang harus berangkat lebih dulu?", 960, 692, 48, { align: "center", weight: 900, color: INK }); });
    }
  }

  // ---------- penutup ----------
  function doc(ctx, x, y, w, h, col, n) {
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#8A96A0"; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col; ctx.fillRect(x + 12, y + 14, w - 24, 14);
    ctx.fillStyle = "#C9D2D8"; for (let i = 0; i < 4; i++) ctx.fillRect(x + 12, y + 40 + i * 18, w - 24 - (i % 2) * 20, 8);
    if (n) text(ctx, n, x + w / 2, y + h - 14, 30, { align: "center", weight: 900, color: col });
  }
  function printer(ctx, b, l) {
    board(ctx);
    // komputer
    ctx.fillStyle = "#2B3440"; rr(ctx, 120, 230, 420, 280, 16); ctx.fill(); ctx.fillStyle = "#EAF2F8"; rr(ctx, 140, 250, 380, 240, 8); ctx.fill();
    ctx.fillStyle = "#2B3440"; ctx.fillRect(300, 510, 60, 50); rr(ctx, 230, 556, 200, 18, 8); ctx.fill();
    text(ctx, "Antrean cetak", 330, 300, 30, { align: "center", weight: 900, color: INK });
    const docs = [["#2E86C1", "1"], ["#23964F", "2"], ["#EE7A12", "3"]];
    const tq = at(b, "dokumen-dokumen itu antre"), tp = at(b, "Dokumen yang dikirim");
    docs.forEach(([c, n], i) => { text(ctx, "Dokumen " + n, 330, 350 + i * 45, 28, { align: "center", weight: 800, color: c }); });
    // printer
    ctx.fillStyle = "#5D6D7E"; rr(ctx, 1380, 360, 340, 200, 20); ctx.fill(); ctx.fillStyle = "#34495E"; rr(ctx, 1410, 330, 280, 50, 10); ctx.fill();
    ctx.fillStyle = "#1C2833"; ctx.fillRect(1420, 470, 260, 14);
    text(ctx, "printer", 1550, 610, 34, { align: "center", weight: 800, color: INK });
    // dokumen antre menuju printer
    const pu = P(l, tp + 0.3, 1.6);
    docs.forEach(([c, n], i) => {
      const u = P(l, tq + i * 0.4, 0.6); if (u <= 0) return;
      let x = lerp(560, 1260 - i * 170, u), y = 360, a = 1;
      if (i === 0 && pu > 0) { x = lerp(1260, 1500, Math.min(1, pu * 2)); y = pu > 0.5 ? lerp(360, 520, (pu - 0.5) * 2) : 360; }
      else if (pu > 0) x += 170 * pu;
      alpha(ctx, a, () => doc(ctx, x, y, 120, 150, c, n));
    });
    hand(ctx, "dikirim lebih dulu → dicetak lebih dulu", 960, 730, 44, { alpha: P(l, tp, 0.6) });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Pahami urutan di setiap antrean.", "Tanyakan siapa yang harus berangkat lebih dulu.", "Periksa lagi seluruh jadwal."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 44, { weight: 900, color: INK, fit: 1150 });
        if (i === 0) { plane(ctx, "C", 1560, y + 80, 120); plane(ctx, "HG", 1680, y + 80, 120); }
        if (i === 1) { text(ctx, "10:59", 1560, y + 95, 40, { align: "center", weight: 900, color: INK }); plane(ctx, "HG", 1690, y + 80, 120); }
        if (i === 2) tick(ctx, 1620, y + 80, 90, 1);
      });
    });
  }

  // ---------- tokoh / kredit ----------
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan seri Bebras lain)
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
  function flagLT(ctx, x, y, w) {   // bendera Lituania: kuning, hijau, merah (atas ke bawah)
    const h = w * 0.6;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#FDB913"; ctx.fillRect(x, y, w, h / 3 + 0.5);
    ctx.fillStyle = "#006A44"; ctx.fillRect(x, y + h / 3, w, h / 3 + 0.5);
    ctx.fillStyle = "#C1272D"; ctx.fillRect(x, y + h * 2 / 3, w, h / 3);
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- versi tegak untuk Short (area 1000×780, x 460–1460, y 140–920) ----------
  // jadwal mendatar: dua baris (waktu, pesawat) × tujuh kolom
  function scheduleH(ctx, x, y, w, o = {}) {
    const cw = w / 7, h1 = 56, h2 = 120;
    ctx.fillStyle = "#F3F5F7"; ctx.fillRect(x, y, w, h1);
    ROWS.forEach(([t, v], i) => {
      const cx = x + i * cw + cw / 2, cy = y + h1 + h2 / 2;
      const hh = o.hi ? o.hi(i) : 0; if (hh > 0) alpha(ctx, hh, () => { ctx.fillStyle = "rgba(238,122,18,0.18)"; ctx.fillRect(x + i * cw, y, cw, h1 + h2); });
      text(ctx, t, cx, y + 40, 30, { align: "center", weight: 800, color: INK });
      if (typeof v === "string") plane(ctx, v, cx, cy, cw * 0.95);
      else {
        const f = o.fill ? o.fill(v) : 0;
        ctx.save(); ctx.setLineDash([7, 5]); ctx.strokeStyle = "#8A96A0"; ctx.lineWidth = 3; rr(ctx, cx - cw * 0.4, cy - 44, cw * 0.8, 88, 10); ctx.stroke(); ctx.restore();
        if (f < 1) alpha(ctx, 1 - f, () => text(ctx, String(v), cx, cy + 18, 52, { align: "center", weight: 900, color: "#5A6670" }));
        if (f > 0) alpha(ctx, f, () => { plane(ctx, ANS[v], cx, cy + 8, cw * 0.85); letter(ctx, ANS[v], cx - cw * 0.3, cy - 32, 20, true); });
      }
    });
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, h1 + h2);
    ctx.beginPath(); ctx.moveTo(x, y + h1); ctx.lineTo(x + w, y + h1); for (let i = 1; i < 7; i++) { ctx.moveTo(x + i * cw, y); ctx.lineTo(x + i * cw, y + h1 + h2); } ctx.stroke();
  }
  function bandara_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Satu landasan, tiga jalur antre", 960, 200, 40, { align: "center", weight: 900, color: INK });
    airport(ctx, 470, 250, 0.98, { letters: () => 1, hi: k => k === "A" ? P(l, 0.4, 0.5) : 0,
      over: (cx) => { mline(cx, [[960, 538], [420, 538]], P(l, 1.0, 0.8), ORANGE, 7, true); } });
  }
  function isi_v(ctx, b, l) {
    board(ctx);
    const first = b.id === "soal6";
    const dep = first ? (() => 0) : depOf(b, l), fill = first ? (() => 0) : fillOf(b, l);
    airport(ctx, 485, 150, 0.97, { dep, letters: () => 1,
      hi: k => (b.id === "m5" && (k === "C" || k === "HG")) ? P(l, 0.3, 0.5) * (1 - dep("C")) : 0,
      over: (cx) => { if (b.id === "m5") mline(cx, [[SLOT_X[1], LANE_Y[1] + 70], [SLOT_X[0] + 10, LANE_Y[1] + 70]], P(l, 0.4, 0.5) * (1 - dep("C")), ORANGE, 7, true); } });
    scheduleH(ctx, 470, 715, 980, { fill, hi: i => {
      if (first) return typeof ROWS[i][1] === "number" ? 0.8 : 0;
      if (b.id === "j3") return i === 0 ? 1 : 0;
      if (b.id === "m5") return i === 2 || i === 3 ? 1 : 0;
      if (b.id === "n3") return i >= 4 ? 1 : 0;
      return 0; } });
  }

  Object.assign(K.SCENES, {
    bandara, jadwal, kantin, jalur, selang, aturan, isi, andai, urut, jawaban, printer, langkah, bandara_v, isi_v,
    buka(ctx, b, l) {
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
      const fu = P(l, at(b, "Lituania"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagLT(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Lituania"), 0.8);
      if (au > 0) ring(ctx, 1180, 300 + 2 * 92 - 14, 210, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      [640, 860].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
      plane(ctx, "C", 620, 690, 170, { rot: -0.12 }); plane(ctx, "B", 860, 660, 170, { rot: -0.12 });
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 750, 800, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Mengisi jadwal dari tiga antrean, langkah demi langkah", 960, 500, 38, { align: "center", weight: 800, color: ORANGE, fit: 1000 });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
