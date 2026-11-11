/* PNG02 Pembahasan Soal Bebras 2025-TW-02 "Exciting Water Slide" (Seluncuran Air yang Seru, Taiwan), kategori Penggalang (SMP).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras) + simulasi: seluncuran bercabang tiga percabangan
   (atas, kiri, kanan) dengan sekat hitam dan panah merah arah keluar; berang-berang meluncur mengikuti jalur.
   Arti nilai sekat: 0 = cabang kiri, 1 = cabang kanan, null = belum diketahui ("?").
   Urutan berang-berang: 0 oranye (keluar B), 1 kuning (C), 2 hijau (A), 3 Dan, topi biru (D).
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at).
   Konfigurasi per beat ada di CFG (dipakai juga oleh Short, dengan id beat Short h0–h6). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const ARROW = "#E0302A";
  const META = { judul: "Exciting Water Slide", terj: "Seluncuran Air yang Seru", tahun: "2025", negara: "Taiwan", kode: "2025-TW-02" };

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = T.indexOf(s, from);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); i = 0; }
    return atI(b, i);
  };
  const atEnd = (b, s) => { const T = TXT(b); const i = T.indexOf(s); if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); return 0; } return atI(b, i + s.length); };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));

  // ---------- papan dan spidol ----------
  function board(ctx) {
    ctx.fillStyle = "#C3CDD4"; rr(ctx, 40, 118, 1840, 724, 22); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 52, 130, 1816, 700, 14); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.03)"; rr(ctx, 52, 130, 1816, 18, 8); ctx.fill();
  }
  function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
  function pointAt(pts, d) {
    let s = 0;
    for (let i = 1; i < pts.length; i++) {
      const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s + L >= d) { const k = L ? (d - s) / L : 0; return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; }
      s += L;
    }
    return pts[pts.length - 1].slice();
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
  function strike(ctx, x, y, s, u = 1, color = RED, w) {
    const lw = w || Math.max(4, s * 0.12);
    mline(ctx, [[x - s * 0.4, y - s * 0.4], [x + s * 0.4, y + s * 0.4]], u * 2, color, lw);
    mline(ctx, [[x + s * 0.4, y - s * 0.4], [x - s * 0.4, y + s * 0.4]], u * 2 - 1, color, lw);
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
  function tw(ctx, s, size, weight = 800, italic) { ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${K.FONT}`; return ctx.measureText(s).width; }
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

  // ---------- tokoh ----------
  const WHO = [
    { name: "1", cap: "#F07A1A", exit: "B" },   // oranye
    { name: "2", cap: "#F2BE16", exit: "C" },   // kuning
    { name: "3", cap: "#2FA55A", exit: "A" },   // hijau
    { name: "Dan", cap: "#2E6FD8", exit: "D" }, // Dan, topi biru
  ];
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras; o.cap = warna topi
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (o.alpha != null) ctx.globalAlpha *= clamp(o.alpha, 0, 1);
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    if (!o.headOnly) {
      ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, 24, 32, 27, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = FUR2; ctx.beginPath(); ctx.ellipse(0, 30, 19, 17, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = FUR; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 15, 49, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    }
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, Math.PI * 2); ctx.fillStyle = FUR; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * 23, -37, 3.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -23, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -24.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    if (o.cap) {   // topi
      ctx.fillStyle = o.cap; ctx.strokeStyle = "#2A1B12"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, -36, 20, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      rr(ctx, -4, -40, 34, 8, 4); ctx.fill(); ctx.stroke();
    }
    if (o.camera) {   // kamera di depan dada
      ctx.fillStyle = "#3A3F6B"; ctx.strokeStyle = "#1B1E33"; ctx.lineWidth = 2.5; rr(ctx, -30, 8, 60, 38, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#1B1E33"; ctx.beginPath(); ctx.arc(0, 27, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#8FB6E8"; ctx.beginPath(); ctx.arc(0, 27, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#E8EEF6"; ctx.fillRect(14, 11, 10, 6);
      ctx.strokeStyle = "#C34FB0"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-26, 10); ctx.lineTo(-14, -4); ctx.moveTo(26, 10); ctx.lineTo(14, -4); ctx.stroke();
    }
    ctx.restore();
  }
  function who(ctx, i, x, y, s, o = {}) {
    beaver(ctx, x, y, s, { cap: WHO[i].cap, alpha: o.alpha, headOnly: o.headOnly });
    if (o.label !== false) alpha(ctx, o.alpha == null ? 1 : o.alpha, () => {
      const t = WHO[i].name, fs = Math.max(18, s * 0.26);
      const w = tw(ctx, t, fs, 900) + fs * 0.7;
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = WHO[i].cap; ctx.lineWidth = 3; rr(ctx, x - w / 2, y + s * 0.62, w, fs * 1.3, fs * 0.4); ctx.fill(); ctx.stroke();
      text(ctx, t, x, y + s * 0.62 + fs * 1.0, fs, { align: "center", weight: 900, color: INK });
    });
  }
  function ibu(ctx, x, y, s, flash) {
    beaver(ctx, x, y, s, { camera: true });
    if (flash > 0 && flash < 1) alpha(ctx, Math.sin(flash * Math.PI), () => {
      ctx.fillStyle = "#FFF7C2"; ctx.beginPath(); const cx = x - s * 0.05, cy = y + s * 0.27;
      for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8, r = k % 2 ? s * 0.18 : s * 0.55; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
      ctx.closePath(); ctx.fill();
    });
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

  // ---------- seluncuran ----------
  // koordinat ternormalisasi (lebar 1, tinggi 1); L = layout {ox, oy, S}
  const NP = {
    top: [[0.5, -0.02], [0.5, 0.2]],
    TL: [[0.5, 0.2], [0.4, 0.235], [0.3, 0.3], [0.255, 0.4], [0.25, 0.5]],
    LA: [[0.25, 0.5], [0.17, 0.555], [0.12, 0.65], [0.11, 0.9]],
    LB: [[0.25, 0.5], [0.33, 0.555], [0.38, 0.65], [0.39, 0.9]],
  };
  const mir = pts => pts.map(([x, y]) => [1 - x, y]);
  NP.TR = mir(NP.TL); NP.RC = mir(NP.LB); NP.RD = mir(NP.LA);
  const JN = { T: [0.5, 0.2], L: [0.25, 0.5], R: [0.75, 0.5] };
  const EXN = { A: [0.11, 0.9], B: [0.39, 0.9], C: [0.61, 0.9], D: [0.89, 0.9] };
  const TUBE = { top: "#F07F4A", TL: "#F5C22E", TR: "#2E9BD6", LA: "#2E9BD6", LB: "#F07F4A", RC: "#F5C22E", RD: "#F07F4A" };
  const JCOL = { T: "#F07F4A", L: "#F5C22E", R: "#2E9BD6" };
  // cabang tiap percabangan: [kiri, kanan]
  const BR = { T: ["TL", "TR"], L: ["LA", "LB"], R: ["RC", "RD"] };
  const ROUTE = { A: ["top", "TL", "LA"], B: ["top", "TL", "LB"], C: ["top", "TR", "RC"], D: ["top", "TR", "RD"] };
  const VAL = { A: { T: 0, L: 0 }, B: { T: 0, L: 1 }, C: { T: 1, R: 0 }, D: { T: 1, R: 1 } };
  const DIRNAME = { T: ["kiri", "kanan"], L: ["ke A", "ke B"], R: ["ke C", "ke D"] };

  function lay(L) {
    const P2 = ([x, y]) => [L.ox + x * L.S, L.oy + y * L.S];
    return { P2, pts: k => NP[k].map(P2), j: k => P2(JN[k]), ex: k => P2(EXN[k]), S: L.S };
  }
  function tube(ctx, pts, color, S, u = 1) {
    mline(ctx, pts, u, "#5B4636", S * 0.064);
    mline(ctx, pts, u, color, S * 0.048);
    mline(ctx, pts, u, "rgba(255,255,255,0.35)", S * 0.012);
  }
  function routePts(G, X) {
    const out = []; ROUTE[X].forEach((k, i) => { const p = G.pts(k); (i ? p.slice(1) : p).forEach(q => out.push(q)); });
    const e = out[out.length - 1]; out.push([e[0], e[1] + G.S * 0.06]); return out;
  }
  // sudut cabang dari arah segmen pertamanya
  function brAng(G, j, side) { const p = G.pts(BR[j][side]); return Math.atan2(p[1][1] - p[0][1], p[1][0] - p[0][0]); }
  // sekat: v 0..1 (0 = buka kiri, 1 = buka kanan), null = belum tahu; q = kemunculan
  function sekat(ctx, G, j, v, q = 1, opt = {}) {
    const [x, y] = G.j(j), S = G.S;
    if (v == null) {
      alpha(ctx, q, () => {
        ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = ARROW; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y + S * 0.075, S * 0.045, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        text(ctx, "?", x, y + S * 0.075 + S * 0.028, S * 0.072, { align: "center", weight: 900, color: ARROW });
      });
      return;
    }
    const aL = brAng(G, j, 0), aR = brAng(G, j, 1);
    const aOpen = lerp(aL, aR, v), aShut = lerp(aR, aL, v);
    alpha(ctx, q, () => {
      // sekat hitam menutup cabang yang lain
      const r1 = S * 0.03, r2 = S * 0.085;
      mline(ctx, [[x + Math.cos(aShut) * r1, y + Math.sin(aShut) * r1], [x + Math.cos(aShut) * r2, y + Math.sin(aShut) * r2]], 1, "#1E1E1E", S * 0.026);
      // panah merah ke cabang yang terbuka
      const r3 = S * (opt.long ? 0.15 : 0.12);
      mline(ctx, [[x, y], [x + Math.cos(aOpen) * r3, y + Math.sin(aOpen) * r3]], 1, "#FFFFFF", S * 0.03, true);
      mline(ctx, [[x, y], [x + Math.cos(aOpen) * r3, y + Math.sin(aOpen) * r3]], 1, ARROW, S * 0.016, true);
      ctx.fillStyle = "#1E1E1E"; ctx.beginPath(); ctx.arc(x, y, S * 0.014, 0, Math.PI * 2); ctx.fill();
    });
  }
  function slide(ctx, G, opt = {}) {
    const S = G.S, grow = opt.grow || {};
    // kolam
    const [ax, ay] = G.ex("A"), [dx] = G.ex("D");
    ctx.fillStyle = "#3EA7DC"; rr(ctx, ax - S * 0.1, ay + S * 0.02, dx - ax + S * 0.2, S * 0.1, S * 0.02); ctx.fill();
    ctx.fillStyle = "#62C3EA"; rr(ctx, ax - S * 0.1, ay + S * 0.02, dx - ax + S * 0.2, S * 0.03, S * 0.015); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 2;
    for (let k = 0; k < 6; k++) { const xx = ax - S * 0.05 + k * (dx - ax + S * 0.1) / 6; ctx.beginPath(); ctx.moveTo(xx, ay + S * 0.085); ctx.quadraticCurveTo(xx + S * 0.03, ay + S * 0.07, xx + S * 0.06, ay + S * 0.085); ctx.stroke(); }
    // panggung di puncak
    const [tx, ty] = G.P2([0.5, -0.02]);
    ctx.fillStyle = "#C9CED3"; ctx.fillRect(tx - S * 0.04, ty - S * 0.02, S * 0.42, S * 0.03);
    ctx.fillStyle = "#AEB5BB"; ctx.fillRect(tx + S * 0.33, ty + S * 0.01, S * 0.02, S * 0.92);
    const g = k => grow[k] == null ? 1 : grow[k];
    tube(ctx, G.pts("top"), TUBE.top, S, g("top"));
    for (const k of ["TL", "TR"]) tube(ctx, G.pts(k), TUBE[k], S, g("mid"));
    for (const k of ["LA", "LB", "RC", "RD"]) tube(ctx, G.pts(k), TUBE[k], S, g("low"));
    // badan percabangan
    const jv = { T: g("top"), L: g("mid") >= 1 ? 1 : 0, R: g("mid") >= 1 ? 1 : 0 };
    for (const j of ["T", "L", "R"]) alpha(ctx, jv[j], () => {
      const [x, y] = G.j(j); ctx.fillStyle = JCOL[j]; ctx.strokeStyle = "#5B4636"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, S * 0.045, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    // huruf jalan keluar
    const la = opt.letters == null ? 1 : opt.letters;
    if (la > 0) "ABCD".split("").forEach((k, i) => alpha(ctx, clamp(la * 4 - i, 0, 1), () => {
      const [x, y] = G.ex(k); const hi = opt.hiExit && opt.hiExit[k];
      ctx.fillStyle = hi ? GREEN : "#FFFFFF"; ctx.strokeStyle = hi ? GREEN : "#5B4636"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x - S * 0.065, y - S * 0.04, S * 0.036, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      text(ctx, k, x - S * 0.065, y - S * 0.04 + S * 0.022, S * 0.05, { align: "center", weight: 900, color: hi ? "#fff" : INK });
    }));
    // nama percabangan
    if (opt.names) {
      const off = { T: [-0.16, -0.07], L: [-0.15, -0.04], R: [0.15, -0.04] };
      for (const j of ["T", "L", "R"]) alpha(ctx, opt.names[j] == null ? 1 : opt.names[j], () => {
        const [x, y] = G.P2([JN[j][0] + off[j][0], JN[j][1] + off[j][1]]);
        hand(ctx, { T: "atas", L: "kiri", R: "kanan" }[j], x, y, S * 0.05, { color: "#7A4FB5" });
      });
    }
  }
  // posisi berang-berang yang meluncur; keys = [t mulai, t di T, t di J, t keluar]
  function runPos(G, X, keys, l) {
    const pts = routePts(G, X);
    const dJ1 = plen(G.pts("top")), dJ2 = dJ1 + plen(G.pts(ROUTE[X][1])), dE = plen(pts) - G.S * 0.06, dP = plen(pts);
    const D = [0, dJ1, dJ2, dE, dP], T = keys.length === 2 ? (() => { const [a, d] = keys; return [a, a + d * dJ1 / dP, a + d * dJ2 / dP, a + d * dE / dP, a + d]; })() : keys.concat([keys[3] + 0.35]);
    let d;
    if (l <= T[0]) d = 0; else if (l >= T[4]) d = dP;
    else { let i = 0; while (i < 3 && l > T[i + 1]) i++; d = lerp(D[i], D[i + 1], clamp((l - T[i]) / Math.max(0.01, T[i + 1] - T[i]), 0, 1)); }
    return { p: pointAt(pts, d), u: d / dP, pts, T };
  }
  // tempat duduk di kolam dan antrean di puncak
  const poolPos = (G, X) => { const [x, y] = G.ex(X); return [x + G.S * 0.02, y + G.S * 0.075]; };
  const queuePos = (G, k) => G.P2([0.6 + k * 0.105, -0.1]);

  // ---------- konfigurasi per beat ----------
  // st: keadaan awal sekat; ev: [frasa, sekat, nilai] (nilai bisa sama = hanya dimunculkan dari "?");
  // runs: [siapa, [frasa mulai, frasa di T, frasa di J, frasa keluar]] atau [siapa, frasa mulai, durasi];
  // pool: sudah di kolam; queue: masih antre; rows: baris tabel terisi; row: [frasa] baris baru.
  const S0 = { T: null, L: null, R: null };
  const CFG = {
    t1: { st: S0, hideQ: true, pool: [], queue: [0, 1, 2, 3], rows: 0, names: ["percabangan atas", "percabangan kiri", "percabangan kanan"] },
    t2: { st: S0, qIn: "belum tahu", pool: [], queue: [0, 1, 2, 3], rows: 0 },
    t3: { st: S0, pool: [], queue: [0, 1, 2, 3], rows: 0, runs: [[0, ["Berang-berang pertama", "belok ke kiri", "belok ke kanan", "Jadi, saat itu"]]],
          ev: [["sekat atas mengarah", "T", 0], ["sekat kiri mengarah", "L", 1]], row: ["Jadi, saat itu"] },
    t4: { st: { T: 0, L: 1, R: null }, pool: [0], queue: [1, 2, 3], rows: 1, ev: [["Sekat atas sekarang", "T", 1], ["sekat kiri sekarang", "L", 0]], keep: [["Percabangan kanan", "R", "tidak dilewati"]] },
    t5: { st: { T: 1, L: 0, R: null }, pool: [0], queue: [1, 2, 3], rows: 1, runs: [[1, "Berang-berang kedua", 3.0]], ev: [["sekat kanan pasti", "R", 0]], row: ["sekat kanan pasti"],
          okT: "jadi hasil ini cocok" },
    t6: { st: { T: 1, L: 0, R: 0 }, pool: [0, 1], queue: [2, 3], rows: 2, ev: [["sekat atas kembali", "T", 0], ["sekat kanan berganti", "R", 1]], keep: [["Sekat kiri tidak", "L", "tidak dilewati"]], now: "Sekat kiri tidak" },
    t7: { st: { T: 0, L: 0, R: 1 }, pool: [0, 1], queue: [2, 3], rows: 2, now: 0, kiko: true },
    r1: { st: { T: 0, L: 0, R: 1 }, pool: [0, 1], queue: [2, 3], rows: 2, think: "Telusuri berang-berang ke-3, lalu Dan." },
    r2: { st: { T: 0, L: 0, R: 1 }, pool: [0, 1], queue: [2, 3], rows: 2, runs: [[2, ["Berang-berang ketiga tiba", "yang mengarah ke kiri", "yang mengarah ke A", "Jadi, berang-berang ketiga"]]], row: ["Jadi, berang-berang ketiga"] },
    r3: { st: { T: 0, L: 0, R: 1 }, pool: [0, 1, 2], queue: [3], rows: 3, ev: [["sekat atas berganti", "T", 1], ["sekat kiri berganti", "L", 1]], keep: [["Sekat kanan tidak", "R", "tidak dilewati"]] },
    r4: { st: { T: 1, L: 1, R: 1 }, pool: [0, 1, 2], queue: [3], rows: 3, runs: [[3, ["Dan tiba", "yang sekarang mengarah", "yang masih mengarah", "masih mengarah ke D"]]], row: ["masih mengarah ke D"] },
    r5: { st: { T: 1, L: 1, R: 1 }, pool: [0, 1, 2], queue: [3], rows: 4, runs: [[3, "Jadi, Dan keluar", 0.01]], answer: "Jadi, Dan keluar", flash: "bersiap memotret" },
    // Short (id beat Short; frasa dari teks Short)
    h0: { st: { T: 1, L: 0, R: 0 }, pool: [], queue: [], rows: 0, demo: true },
    h1: { st: S0, hideQ: true, pool: [], queue: [0, 1, 2, 3], rows: 0, pop: [[0, "keluar di B"], [1, "keluar di C"]], ibu: true },
    h2: { st: S0, hideQ: true, pool: [0, 1], queue: [2, 3], rows: 0, think: "Dari mana Dan keluar?", ibu: true },
    h3: { st: S0, pool: [], queue: [0, 1, 2, 3], rows: 0, runs: [[0, "Berang-berang pertama", 2.4]], ev: [["Jadi, sekat atas", "T", 0], ["sekat kiri mengarah", "L", 1], ["sekat atas berganti", "T", 1], ["sekat kiri berganti", "L", 0]] },
    h4: { st: { T: 1, L: 0, R: null }, pool: [0], queue: [1, 2, 3], rows: 0, runs: [[1, "Berang-berang kedua", 2.4]], ev: [["keluar di C", "R", 0], ["sekat atas kembali", "T", 0], ["sekat kanan berganti", "R", 1]] },
    h5: { st: { T: 0, L: 0, R: 1 }, pool: [0, 1], queue: [2, 3], rows: 0, runs: [[2, "Berang-berang ketiga", 2.4]], ev: [["Sekat atas pun", "T", 1], ["Sekat atas pun", "L", 1]] },
    h6: { st: { T: 1, L: 1, R: 1 }, pool: [0, 1, 2], queue: [3], rows: 0, runs: [[3, "Akhirnya, Dan", 2.6]], answer: "jawabannya adalah", ibu: true, flash: "jawabannya adalah" },
  };

  const ROWS = [["1", "kiri", "ke B", "?", "B"], ["2", "kanan", "ke A", "ke C", "C"], ["3", "kiri", "ke A", "ke D", "A"], ["4 (Dan)", "kanan", "ke B", "ke D", "D"]];
  function stTable(ctx, x, y, w, rows, newU, opt = {}) {
    const cols = [0.2, 0.2, 0.2, 0.2, 0.2], heads = ["Ke-", "Atas", "Kiri", "Kanan", "Keluar"], rh = opt.rh || 80, hh = opt.hh || 64, fs = opt.fs || 38;
    ctx.fillStyle = "#EEF3F6"; ctx.fillRect(x, y, w, hh);
    let cx = x; heads.forEach((h, i) => { text(ctx, h, cx + w * cols[i] / 2, y + hh * 0.66, fs * 0.85, { align: "center", weight: 900, color: INK }); cx += w * cols[i]; });
    ctx.strokeStyle = "#9AA6AE"; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, hh + 4 * rh);
    for (let r = 1; r <= 4; r++) { ctx.beginPath(); ctx.moveTo(x, y + hh + (r - 1) * rh); ctx.lineTo(x + w, y + hh + (r - 1) * rh); ctx.stroke(); }
    cx = x; for (let i = 1; i < 5; i++) { cx += w * cols[i - 1]; ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx, y + hh + 4 * rh); ctx.stroke(); }
    ROWS.forEach((row, r) => {
      const a = r < rows ? 1 : r === rows ? newU : 0; if (a <= 0) return;
      alpha(ctx, a, () => {
        let xx = x; const yy = y + hh + r * rh + rh * 0.64;
        if (r === 3) { ctx.fillStyle = "#E3EEFF"; ctx.fillRect(x + 2, y + hh + r * rh + 2, w - 4, rh - 4); }
        row.forEach((c, i) => {
          const col = i === 0 ? WHO[r].cap : i === 4 ? GREEN : c === "?" ? ARROW : INK;
          if (i === 0) { ctx.fillStyle = WHO[r].cap; ctx.beginPath(); ctx.arc(xx + w * 0.022, yy - fs * 0.33, fs * 0.22, 0, Math.PI * 2); ctx.fill(); }
          text(ctx, c, xx + w * cols[i] / 2 + (i === 0 ? w * 0.02 : 0), yy, i === 4 ? fs * 1.1 : fs, { align: "center", weight: i === 4 || i === 0 ? 900 : 800, color: i === 0 ? INK : col, fit: w * cols[i] - 16 });
          xx += w * cols[i];
        });
      });
    });
    return { x, y, w, hh, rh };
  }

  // keadaan sekat pada waktu l: [nilai, u transisi, muncul]
  function stateAt(b, cfg, l, j) {
    let v = cfg.st[j], prev = v, t0 = -99;
    (cfg.ev || []).forEach(([ph, jj, val]) => { if (jj !== j) return; const t = at(b, ph); if (l >= t) { prev = v; v = val; t0 = t; } });
    if (v == null) return { v: null };
    if (prev == null) return { v, q: P(l, t0, 0.5), from: null };
    const u = P(l, t0, 0.6);
    return { v: lerp(prev, v, u), q: 1, moving: u > 0 && u < 1 };
  }
  function drawSim(ctx, b, l, L, cfg, opt = {}) {
    const G = lay(L);
    const names = cfg.names ? { T: P(l, at(b, cfg.names[0]), 0.5), L: P(l, at(b, cfg.names[1]), 0.5), R: P(l, at(b, cfg.names[2]), 0.5) } : {};
    const hiExit = {};
    if (cfg.answer) { if (P(l, at(b, cfg.answer), 0.4) > 0.5) hiExit.D = 1; }
    slide(ctx, G, { names: opt.names === false ? null : names, hiExit });
    // jejak jalur berang-berang yang sedang meluncur
    const running = new Set(), runInfo = {};
    (cfg.runs || []).forEach(([i, spec, dur]) => {
      const keys = Array.isArray(spec) ? spec.map(ph => at(b, ph)) : [at(b, spec), dur];
      const r = runPos(G, WHO[i].exit, keys, l); runInfo[i] = r;
      if (l > r.T[0] && dur !== 0.01) mline(ctx, r.pts, r.u, WHO[i].cap, G.S * 0.02);
      running.add(i);
    });
    // sekat
    for (const j of ["T", "L", "R"]) {
      const s = stateAt(b, cfg, l, j);
      if (s.v == null) { if (!cfg.hideQ) sekat(ctx, G, j, null, cfg.qIn ? P(l, at(b, cfg.qIn), 0.5) : 1); }
      else sekat(ctx, G, j, s.v, s.q);
    }
    // catatan "tidak dilewati"
    (cfg.keep || []).forEach(([ph, j, s]) => {
      const u = P(l, at(b, ph), 0.5); const [x, y] = G.j(j);
      alpha(ctx, u, () => {
        const w = tw(ctx, s, G.S * 0.042, 800, true) + 24, xx = j === "L" ? x - w + G.S * 0.02 : x - G.S * 0.02;
        ctx.fillStyle = "rgba(255,255,255,0.92)"; rr(ctx, xx, y - G.S * 0.2, w, G.S * 0.065, 10); ctx.fill();
        hand(ctx, s, xx + w / 2, y - G.S * 0.153, G.S * 0.042, { color: "#7A4FB5" });
      });
    });
    if (cfg.okT) { const u = P(l, at(b, cfg.okT), 0.5); const [x, y] = G.j("T"); ring(ctx, x + G.S * 0.05, y + G.S * 0.04, G.S * 0.1, G.S * 0.08, u, GREEN, 5); alpha(ctx, u, () => { tick(ctx, x + G.S * 0.2, y + G.S * 0.02, G.S * 0.07, 1); hand(ctx, "cocok", x + G.S * 0.29, y + G.S * 0.04, G.S * 0.045, { color: GREEN, align: "left" }); }); }
    // kolam
    const pool = cfg.pool.slice();
    (cfg.pop || []).forEach(([i, ph]) => { if (l >= at(b, ph)) pool.push(i); });
    pool.forEach(i => { if (running.has(i)) return; const [x, y] = poolPos(G, WHO[i].exit); who(ctx, i, x, y - G.S * 0.02, G.S * 0.1, { label: true }); });
    // antrean
    const q = cfg.queue.filter(i => !(running.has(i) && l > runInfo[i].T[0]) && !(cfg.pop || []).some(([k, ph]) => k === i && l >= at(b, ph)));
    cfg.queue.forEach(i => {
      if (!q.includes(i)) return;
      const k = q.indexOf(i), [x, y] = queuePos(G, k);
      who(ctx, i, x, y, G.S * 0.1, { label: i === 3 });
    });
    // berang-berang yang meluncur / sudah keluar
    (cfg.runs || []).forEach(([i]) => {
      const r = runInfo[i]; if (l <= r.T[0]) return;
      if (r.u >= 1) { const [x, y] = poolPos(G, WHO[i].exit); who(ctx, i, x, y - G.S * 0.02, G.S * 0.1, { label: true }); }
      else who(ctx, i, r.p[0], r.p[1] - G.S * 0.03, G.S * 0.08, { label: false });
    });
    // demo Short: satu berang-berang tanpa nama meluncur, sekat berganti
    return G;
  }

  // ---------- adegan ----------
  const LM = { ox: 110, oy: 218, S: 540 };   // seluncuran di papan (kiri)
  const LV = { ox: 690, oy: 218, S: 540 };   // seluncuran di tengah (untuk potongan Short)
  function jalur(ctx, b, l) {
    board(ctx);
    const cfg = CFG[b.id];
    const G = drawSim(ctx, b, l, LM, cfg);
    // tabel
    const newU = cfg.row ? P(l, at(b, cfg.row[0]), 0.5) : 0;
    stTable(ctx, 860, 160, 960, cfg.rows, newU);
    if (cfg.think) thinkBadge(ctx, 960, 630, 760, 140, l, b.dur, cfg.think);
    if (cfg.now != null) {
      const u = cfg.now === 0 ? 1 : P(l, atEnd(b, "tetap mengarah ke A."), 0.5);
      alpha(ctx, u, () => {
        card(ctx, 860, 640, 760, 140, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
        text(ctx, "Keadaan sekarang:", 890, 690, 32, { weight: 900, color: C.accentDark });
        text(ctx, "atas → kiri,  kiri → A,  kanan → D", 890, 748, 40, { weight: 900, color: INK, fit: 700 });
      });
    }
    if (cfg.kiko) {
      kiko(ctx, 1730, 720, 120, 0, { mood: "happy", wave: l });
      hand(ctx, "hanya dari 2 petunjuk!", 1340, 615, 40, { alpha: P(l, at(b, "Hebatnya"), 0.6) });
    }
    if (cfg.answer) {
      const u = P(l, at(b, cfg.answer) + 0.3, 0.5);
      alpha(ctx, u, () => {
        card(ctx, 900, 630, 600, 150, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 });
        text(ctx, "Jawaban: D", 1200, 728, 64, { align: "center", weight: 900, color: GREEN });
      });
      ibu(ctx, 1660, 690, 150, P(l, at(b, cfg.flash), 0.7));
    }
  }
  function jalur_v(ctx, b, l) {
    board(ctx);
    const cfg = CFG[b.id];
    if (cfg.demo) return demo_v(ctx, b, l);
    const G = drawSim(ctx, b, l, LV, cfg, { names: false });
    if (cfg.ibu) ibu(ctx, 1335, 715, 100, cfg.flash ? P(l, at(b, cfg.flash), 0.7) : 0);
    if (cfg.think) { const [x, y] = queuePos(G, 1); alpha(ctx, P(l, 0.3, 0.5), () => { text(ctx, "?", x + 70, y + 20, 80, { align: "center", weight: 900, color: ARROW }); }); }
    if (cfg.answer) alpha(ctx, P(l, at(b, cfg.answer), 0.5), () => {
      card(ctx, 585, 150, 320, 100, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 });
      text(ctx, "Jawaban: D", 745, 218, 46, { align: "center", weight: 900, color: GREEN });
    });
  }
  // Short h0: seluncuran dengan sekat; satu berang-berang tanpa nama meluncur dan sekat yang dilewati berganti
  function demo_v(ctx, b, l) {
    const G = lay(LV);
    slide(ctx, G, { letters: P(l, at(b, "empat jalan keluar"), 0.6) });
    const t0 = at(b, "Di setiap percabangan"), T = runPos(G, "B", [t0 + 0.6, 2.4], l);
    const flipT = P(l, T.T[1], 0.5), flipL = P(l, T.T[2], 0.5);
    const sq = P(l, t0, 0.5);
    sekat(ctx, G, "T", lerp(0, 1, flipT), sq); sekat(ctx, G, "L", lerp(1, 0, flipL), sq); sekat(ctx, G, "R", 0, sq);
    if (l > T.T[0]) {
      mline(ctx, T.pts, T.u, "#9AA6AE", G.S * 0.02);
      if (T.u < 1) beaver(ctx, T.p[0], T.p[1] - G.S * 0.03, G.S * 0.08); else beaver(ctx, ...poolPos(G, "B"), G.S * 0.1);
    }
    alpha(ctx, flipT, () => hand(ctx, "berganti!", G.j("T")[0] + 120, G.j("T")[1] - 10, 34, { color: ARROW, align: "left" }));
  }

  // seluncuran utuh (soal1, soal4, soal5)
  function seluncur(ctx, b, l) {
    board(ctx);
    const G = lay(LM);
    if (b.id === "soal1") {
      const g1 = P(l, at(b, "Taman Hiburan"), 0.8), g2 = P(l, at(b, "terbelah dua."), 1.0), g3 = P(l, at(b, "terbelah dua lagi"), 1.0);
      slide(ctx, G, { grow: { top: g1, mid: g2, low: g3 }, letters: P(l, at(b, "empat jalan keluar"), 1.2) });
      hand(ctx, "1 pintu masuk", 960, 260, 44, { color: INK, align: "left", alpha: g1 });
      hand(ctx, "terbelah 2", 960, 380, 44, { color: INK, align: "left", alpha: g2 });
      hand(ctx, "terbelah 2 lagi", 960, 500, 44, { color: INK, align: "left", alpha: g3 });
      hand(ctx, "4 jalan keluar: A, B, C, D", 960, 640, 50, { alpha: P(l, at(b, "empat jalan keluar"), 0.6) });
      return;
    }
    slide(ctx, G, {});
    if (b.id === "soal4") {
      const u = P(l, at(b, "bernama Dan"), 0.6);
      who(ctx, 2, ...queuePos(G, 0), G.S * 0.1, { label: false, alpha: u });
      who(ctx, 3, ...queuePos(G, 1), G.S * 0.1, { alpha: u });
      alpha(ctx, u, () => { const [dx, dy] = queuePos(G, 1); mline(ctx, [[dx + 190, dy + 20], [dx + 50, dy + 5]], 1, "#2E6FD8", 5, true); hand(ctx, "Dan", dx + 200, dy + 36, 48, { color: "#2E6FD8", align: "left" }); });
      const ui = P(l, at(b, "Ibunya"), 0.6);
      alpha(ctx, ui, () => { ibu(ctx, 1120, 600, 210, 0); hand(ctx, "Ibu", 1120, 790, 44, { color: "#C34FB0" }); });
      alpha(ctx, P(l, at(b, "perlu tahu"), 0.6), () => {
        card(ctx, 1290, 430, 520, 150, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
        text(ctx, "Dan keluar dari mana?", 1550, 525, 42, { align: "center", weight: 900, color: INK, fit: 480 });
      });
      return;
    }
    // soal5: berang-berang 1 keluar di B, lalu 2 keluar di C (jalur belum ditelusuri)
    const p1 = P(l, at(b, "keluar dari seluncuran B"), 0.5), p2 = P(l, at(b, "keluar dari seluncuran C"), 0.5);
    const q = [p1 < 0.5 ? 0 : null, p2 < 0.5 ? 1 : null, 2, 3].filter(x => x != null);
    q.forEach((i, k) => who(ctx, i, ...queuePos(G, k), G.S * 0.1, { label: i === 3 }));
    if (p1 > 0) { const [x, y] = poolPos(G, "B"); who(ctx, 0, x, y - G.S * 0.02, G.S * 0.1, { alpha: p1 }); }
    if (p2 > 0) { const [x, y] = poolPos(G, "C"); who(ctx, 1, x, y - G.S * 0.02, G.S * 0.1, { alpha: p2 }); }
    ibu(ctx, 1640, 640, 170, 0);
    hand(ctx, "Yang dilihat Ibu:", 920, 300, 46, { color: INK, align: "left" });
    alpha(ctx, p1, () => { who(ctx, 0, 960, 400, 80, { label: false }); text(ctx, "pertama → keluar di B", 1030, 418, 42, { weight: 900, color: INK }); });
    alpha(ctx, p2, () => { who(ctx, 1, 960, 530, 80, { label: false }); text(ctx, "kedua → keluar di C", 1030, 548, 42, { weight: 900, color: INK }); });
  }

  // satu percabangan besar
  function bigJunc(ctx, cx, cy, s, v, q = 1) {
    const L = { ox: cx - s * 0.5, oy: cy - s * 0.2, S: s };
    const G = lay(L);
    tube(ctx, [G.P2([0.5, 0.02]), G.j("T")], TUBE.top, s);
    tube(ctx, G.pts("TL"), TUBE.TL, s); tube(ctx, G.pts("TR"), TUBE.TR, s);
    ctx.fillStyle = JCOL.T; ctx.strokeStyle = "#5B4636"; ctx.lineWidth = 3; const [x, y] = G.j("T"); ctx.beginPath(); ctx.arc(x, y, s * 0.045, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    sekat(ctx, G, "T", v, q, { long: true });
    return G;
  }
  function juncRun(G, side, t0, d, l) {   // posisi di percabangan besar: masuk dari atas, keluar ke cabang
    const pts = [G.P2([0.5, 0.02]), G.j("T")].concat(G.pts(side ? "TR" : "TL").slice(1));
    const D = plen(pts), u = clamp((l - t0) / d, 0, 1);
    return { p: pointAt(pts, D * u), u, pass: t0 + d * plen(pts.slice(0, 2)) / D, pts };
  }
  function sekatScene(ctx, b, l) {
    board(ctx);
    const cx = 620, cy = 330, s = 860;
    if (b.id === "soal2") {
      const G = bigJunc(ctx, cx, cy, s, 1, P(l, at(b, "ada sebuah sekat"), 0.6));
      const [x, y] = G.j("T");
      alpha(ctx, P(l, at(b, "ada sebuah sekat"), 0.6), () => { mline(ctx, [[x - 300, y - 60], [x - 70, y + 40]], 1, INK, 5, true); hand(ctx, "sekat", x - 310, y - 75, 46, { color: INK, align: "right" }); });
      alpha(ctx, P(l, at(b, "menentukan"), 0.6), () => { mline(ctx, [[x + 330, y - 40], [x + 120, y + 60]], 1, ARROW, 5, true); hand(ctx, "arah keluar", x + 340, y - 50, 46, { color: ARROW, align: "left" }); });
      alpha(ctx, P(l, at(b, "ke kiri atau"), 0.6), () => { hand(ctx, "kiri", x - 330, y + 330, 50, { color: INK }); hand(ctx, "kanan", x + 330, y + 330, 50, { color: INK }); });
      return;
    }
    // soal3: berang-berang lewat ke kanan, lalu sekat berganti ke kiri
    const t0 = at(b, "Setiap kali") + 0.4, R = juncRun(lay({ ox: cx - s * 0.5, oy: cy - s * 0.2, S: s }), 1, t0, 2.6, l);
    const flip = P(l, Math.max(R.pass + 0.4, at(b, "sekatnya berganti")), 0.7);
    const G = bigJunc(ctx, cx, cy, s, 1 - flip);
    if (l > t0) { mline(ctx, R.pts, R.u, "#9AA6AE", 14); beaver(ctx, R.p[0], R.p[1] - 30, 90, { alpha: R.u < 1 ? 1 : clamp(1 - (l - t0 - 2.6) * 2, 0, 1) }); }
    const s1 = P(l, at(b, "Kalau tadi"), 0.5), s2 = P(l, at(b, "sekarang sekat mengarah"), 0.5);
    alpha(ctx, s1, () => { card(ctx, 1250, 230, 560, 120, { fill: "#F7F9FA", stroke: "#B8C3CA", lw: 3, r: 16 }); text(ctx, "tadi: ke kanan", 1290, 308, 46, { weight: 900, color: INK }); });
    alpha(ctx, s2, () => { card(ctx, 1250, 390, 560, 120, { fill: "#FDECEB", stroke: ARROW, lw: 3, r: 16 }); text(ctx, "sekarang: ke kiri", 1290, 468, 46, { weight: 900, color: ARROW }); });
    alpha(ctx, flip, () => hand(ctx, "berganti!", G.j("T")[0] + 200, G.j("T")[1] - 40, 44, { color: ARROW, align: "left" }));
  }

  // bagian 1: satu percabangan
  function satu(ctx, b, l) {
    board(ctx);
    const cx = 560, cy = 330, s = 800;
    if (b.id === "m6") {
      // dua percabangan: satu dilewati (berganti), satu tidak (tetap)
      const t0 = at(b, "hanya berganti") , GL = lay({ ox: 470 - 260, oy: 300 - 104, S: 520 });
      const R = juncRun(GL, 0, t0, 2.4, l), f = P(l, R.pass + 0.3, 0.6);
      bigJunc(ctx, 470, 300, 520, f);
      bigJunc(ctx, 1350, 300, 520, 0);
      if (l > t0) { mline(ctx, R.pts, R.u, "#9AA6AE", 10); if (R.u < 1) beaver(ctx, R.p[0], R.p[1] - 22, 64); }
      hand(ctx, "dilewati → berganti", 470, 720, 46, { color: ARROW, alpha: P(l, at(b, "melewatinya"), 0.6) });
      hand(ctx, "tidak dilewati → tetap", 1350, 720, 46, { color: "#7A4FB5", alpha: P(l, at(b, "Kalau tidak"), 0.6) });
      return;
    }
    const GL = lay({ ox: cx - s * 0.5, oy: cy - s * 0.2, S: s });
    // jadwal: [beat, sisi, frasa mulai]
    const RUNS = { m2: [[1, "Berang-berang pertama"]], m3: [[0, "Berang-berang kedua"]], m5: [[1, "Berang-berang ketiga"], [0, "berang-berang keempat"]] };
    const start = { m1: 1, m2: 1, m3: 0, m4: 1, m5: 1 }[b.id];
    let v = start; const runs = (RUNS[b.id] || []).map(([side, ph]) => { const R = juncRun(GL, side, at(b, ph), 2.0, l); return R; });
    runs.forEach(R => { const f = P(l, R.pass + 0.25, 0.5); v = lerp(v, 1 - Math.round(v), f); });
    bigJunc(ctx, cx, cy, s, v);
    runs.forEach(R => { if (R.u > 0 && R.u < 1) beaver(ctx, R.p[0], R.p[1] - 26, 80); });
    // catatan di kanan
    const done = { m1: 0, m2: 0, m3: 1, m4: 2, m5: 2 }[b.id];
    const LST = ["kanan", "kiri", "kanan", "kiri"];
    const rowAt = { m2: [[0, "lalu meluncur ke kanan"]], m3: [[1, "lalu meluncur ke kiri"]], m5: [[2, "ketiga meluncur ke kanan"], [3, "keempat meluncur ke kiri"]] };
    hand(ctx, "Berang-berang ke-", 1180, 220, 40, { color: INK, align: "left" });
    for (let i = 0; i < 4; i++) {
      const y = 300 + i * 92;
      let a = i < done ? 1 : 0; (rowAt[b.id] || []).forEach(([k, ph]) => { if (k === i) a = P(l, at(b, ph), 0.5); });
      const showQ = (b.id === "m4" && i >= 2) ? P(l, at(b, "Coba tebak"), 0.5) : 0;
      text(ctx, (i + 1) + ":", 1200, y, 50, { weight: 900, color: INK });
      if (a > 0) alpha(ctx, a, () => text(ctx, LST[i], 1280, y, 50, { weight: 900, color: i % 2 ? "#C58A00" : "#1F7FB8" }));
      else if (showQ > 0) alpha(ctx, showQ, () => text(ctx, "?", 1280, y, 50, { weight: 900, color: ARROW }));
    }
    if (b.id === "m1") hand(ctx, "sekat sekarang: ke kanan", cx, 790, 46, { color: ARROW, alpha: P(l, at(b, "Misalkan"), 0.6) });
    if (b.id === "m4") thinkBadge(ctx, 1150, 660, 680, 130, l, b.dur, "Ke mana berang-berang ke-3 dan ke-4?");
    if (b.id === "m5") hand(ctx, "kanan, kiri, kanan, kiri, …", 1460, 720, 50, { alpha: P(l, at(b, "bergantian"), 0.6) });
  }

  // kalimat soal yang digarisbawahi
  function kalimat(ctx, b, l) {
    board(ctx);
    const s1 = "Dan adalah berang-berang yang muncul", s2 = "setelah berang-berang berikutnya.";
    const u = b.id === "soal6" ? P(l, at(b, "Dan adalah"), 0.8) : P(l, at(b, "Dan adalah"), 0.8);
    alpha(ctx, u, () => {
      text(ctx, "“" + s1, 960, 360, 64, { align: "center", weight: 800, color: INK });
      text(ctx, s2 + "”", 960, 460, 64, { align: "center", weight: 800, color: INK });
    });
    const w2 = tw(ctx, s2, 64, 800), x0 = 960 - w2 / 2 - 10;
    const ul = P(l, at(b, "setelah berang-berang berikutnya"), 1.0);
    mline(ctx, [[x0, 485], [x0 + w2, 485]], ul, ORANGE, 8);
    if (b.id === "j1") mline(ctx, [[x0, 503], [x0 + w2, 503]], P(l, atEnd(b, "berikutnya.") - 0.3, 0.6), ORANGE, 8);
    if (b.id === "soal6") {
      alpha(ctx, P(l, at(b, "Kalimat ini penting"), 0.6), () => { hand(ctx, "penting! dibahas nanti", 960, 640, 50); });
      kiko(ctx, 260, 640, 150, 0, { mood: "happy" });
    } else {
      hand(ctx, "baca dengan teliti", 960, 250, 46, { color: INK, alpha: P(l, at(b, "baca lagi"), 0.6) });
      kiko(ctx, 260, 640, 150, 0, { mood: "confused" });
    }
  }

  // soal utuh dengan pertanyaan
  function tanya(ctx, b, l) {
    board(ctx);
    const G = lay({ ox: 120, oy: 205, S: 590 });
    slide(ctx, G, {});
    who(ctx, 2, ...queuePos(G, 0), G.S * 0.1, { label: false }); who(ctx, 3, ...queuePos(G, 1), G.S * 0.1);
    [[0, "B"], [1, "C"]].forEach(([i, X]) => { const [x, y] = poolPos(G, X); who(ctx, i, x, y - G.S * 0.02, G.S * 0.1); });
    ibu(ctx, 800, 700, 120, 0);
    text(ctx, "Tantangan", 930, 250, 40, { weight: 900, color: C.accentDark });
    para(ctx, "Dari seluncuran manakah Dan akan keluar?", 930, 320, 52, 880, { weight: 900, color: INK, lh: 1.2 });
    const ua = P(l, at(b, "Pilihannya"), 0.5);
    ["A", "B", "C", "D"].forEach((k, i) => alpha(ctx, clamp(ua * 4 - i, 0, 1), () => {
      const y = 500 + i * 78;
      ctx.strokeStyle = "#7A8590"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(960, y - 14, 18, 0, Math.PI * 2); ctx.stroke();
      text(ctx, "Seluncuran " + k, 1000, y, 42, { weight: 800, color: INK });
    }));
  }

  // bagian 3: antrean di puncak
  function antre(ctx, b, l) {
    board(ctx);
    // puncak seluncuran diperbesar
    const G = lay({ ox: -300, oy: 380, S: 1400 });
    ctx.save(); ctx.beginPath(); ctx.rect(52, 130, 900, 700); ctx.clip();
    slide(ctx, G, { letters: 0 });
    who(ctx, 2, ...queuePos(G, 0), G.S * 0.1, { label: false }); who(ctx, 3, ...queuePos(G, 1), G.S * 0.1);
    ctx.restore();
    if (b.id === "j2") { thinkBadge(ctx, 1000, 560, 800, 140, l, b.dur, "Apakah Dan langsung berikutnya?"); hand(ctx, "siapa yang di depan Dan?", 1400, 330, 48, { alpha: P(l, at(b, "Coba lihat"), 0.6) }); }
    if (b.id === "j2") return;
    const [qx, qy] = queuePos(G, 0);
    ring(ctx, qx, qy, 90, 90, P(l, at(b, b.id === "j3" ? "masih ada satu" : "Jadi, Dan"), 0.7), ORANGE, 7);
    // daftar urutan
    const L = [[0, "1", "sudah keluar di B"], [1, "2", "sudah keluar di C"], [2, "3", "berang-berang hijau"], [3, "4", "Dan"]];
    const t3 = b.id === "j3" ? [at(b, "Ternyata"), at(b, "Ternyata") + 0.6, at(b, "masih ada satu"), at(b, "lalu Dan")] : [0, 0, 0, 0];
    L.forEach(([i, n, s], k) => {
      const y = 260 + k * 110, a = P(l, t3[k], 0.5);
      alpha(ctx, a, () => {
        who(ctx, i, 1040, y - 20, 70, { label: false });
        text(ctx, n + ".", 1110, y + 6, 48, { weight: 900, color: INK });
        text(ctx, s, 1170, y + 6, 46, { weight: k >= 2 ? 900 : 700, color: k === 3 ? "#2E6FD8" : k === 2 ? GREEN : C.ink2 });
      });
    });
    if (b.id === "j4") {
      const u = P(l, at(b, "Jadi, Dan"), 0.6);
      ring(ctx, 1185, 578, 120, 54, u, "#2E6FD8", 6);
      alpha(ctx, u, () => hand(ctx, "Dan = berang-berang ke-4", 1430, 700, 50, { color: "#2E6FD8" }));
      alpha(ctx, P(l, at(b, "jebakan"), 0.6), () => {
        ctx.fillStyle = ARROW; ctx.beginPath(); ctx.moveTo(1180, 790); ctx.lineTo(1210, 742); ctx.lineTo(1240, 790); ctx.closePath(); ctx.fill();
        text(ctx, "!", 1210, 785, 34, { align: "center", weight: 900, color: "#fff" });
        hand(ctx, "awas jebakan!", 1260, 785, 40, { color: ARROW, align: "left" });
      });
    }
  }

  // bagian 5: cara lain
  function cek(ctx, b, l) {
    board(ctx);
    const G = lay(LM);
    slide(ctx, G, {});
    [0, 1, 2, 3].forEach(i => { const [x, y] = poolPos(G, WHO[i].exit); who(ctx, i, x, y - G.S * 0.02, G.S * 0.1); });
    const ORD = [[0, "B"], [1, "C"], [2, "A"], [3, "D"]];
    // baris urutan di kanan
    const v1 = b.id === "v1" ? at(b, "yaitu B") : 0;
    ORD.forEach(([i, X], k) => {
      const x = 1000 + k * 200, a = P(l, v1 + k * 0.45, 0.4);
      alpha(ctx, a, () => {
        who(ctx, i, x, 250, 80, { label: false });
        text(ctx, X, x, 360, 70, { align: "center", weight: 900, color: INK });
        if (b.id === "v4" && k < 3) strike(ctx, x, 335, 70, P(l, at(b, "sudah memakai") + k * 0.4, 0.4));
      });
    });
    if (b.id === "v1") return;
    if (b.id === "v2") {
      const u = P(l, at(b, "Sekat atas membagi"), 0.6), [x, y] = G.j("T");
      ring(ctx, x, y, 60, 60, u, ORANGE, 6);
      alpha(ctx, P(l, at(b, "dua meluncur ke kiri"), 0.6), () => {
        hand(ctx, "1 dan 3", G.j("L")[0] - 20, G.j("L")[1] - 120, 40, { color: INK });
        hand(ctx, "2 dan 4", G.j("R")[0] + 20, G.j("R")[1] - 120, 40, { color: INK });
      });
      alpha(ctx, u, () => text(ctx, "Atas: kiri, kanan, kiri, kanan", 1000, 500, 46, { weight: 900, color: INK }));
      alpha(ctx, P(l, at(b, "dua meluncur ke kiri"), 0.6), () => text(ctx, "→ 2 ke kiri, 2 ke kanan", 1000, 580, 46, { weight: 900, color: ORANGE }));
      tick(ctx, 1760, 330, 60, P(l, at(b, "tepat satu kali"), 0.5));
      return;
    }
    if (b.id === "v3") {
      const u1 = P(l, at(b, "sehingga satu"), 0.6), u2 = P(l, at(b, "satu keluar di C"), 0.6);
      alpha(ctx, u1, () => { text(ctx, "Kiri: 1 → B, 3 → A", 1000, 500, 46, { weight: 900, color: INK }); ring(ctx, ...G.j("L"), 50, 50, 1, ORANGE, 5); });
      alpha(ctx, u2, () => { text(ctx, "Kanan: 2 → C, 4 → D", 1000, 580, 46, { weight: 900, color: INK }); ring(ctx, ...G.j("R"), 50, 50, 1, ORANGE, 5); });
      alpha(ctx, P(l, atEnd(b, "satu keluar di D."), 0.6), () => hand(ctx, "4 berang-berang = A, B, C, D masing-masing sekali", 1350, 700, 36, { color: GREEN }));
      return;
    }
    // v4
    const u = P(l, at(b, "yang tersisa"), 0.6);
    ring(ctx, 1600, 335, 60, 60, u, GREEN, 7);
    alpha(ctx, P(l, at(b, "hasilnya sama"), 0.6), () => {
      card(ctx, 1000, 520, 760, 150, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 });
      text(ctx, "Sama: Dan keluar di D", 1380, 617, 56, { align: "center", weight: 900, color: GREEN });
    });
  }

  // penutup: tabel keadaan
  function tabelScene(ctx, b, l) {
    board(ctx);
    stTable(ctx, 160, 190, 1100, 4, 1, { rh: 96 });
    const u = P(l, at(b, "keadaan, atau state"), 0.6);
    alpha(ctx, u, () => { hand(ctx, "keadaan", 1560, 330, 70, { color: ORANGE }); hand(ctx, "(state)", 1560, 410, 60, { color: ORANGE }); });
    alpha(ctx, P(l, at(b, "berubah setiap kali"), 0.6), () => hand(ctx, "berubah setiap dipakai", 1560, 540, 40, { color: INK }));
    alpha(ctx, P(l, at(b, "langkah demi langkah"), 0.6), () => hand(ctx, "catat langkah demi langkah", 1560, 640, 40, { color: GREEN }));
  }
  function server(ctx, b, l) {
    board(ctx);
    const u = P(l, at(b, "Contohnya"), 0.6);
    // pengunjung
    for (let k = 0; k < 6; k++) { const x = 160 + (k % 3) * 70, y = 330 + Math.floor(k / 3) * 110; ctx.fillStyle = ["#F07A1A", "#2E6FD8", "#2FA55A", "#C34FB0", "#F2BE16", "#2E9BD6"][k]; ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill(); rr(ctx, x - 26, y + 26, 52, 44, 16); ctx.fill(); }
    hand(ctx, "pengunjung", 230, 600, 40, { color: INK });
    // pembagi
    card(ctx, 620, 360, 300, 160, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
    text(ctx, "pembagi", 770, 430, 40, { align: "center", weight: 900, color: INK }); text(ctx, "bergiliran", 770, 480, 34, { align: "center", weight: 800, color: C.accentDark });
    mline(ctx, [[420, 440], [600, 440]], 1, INK, 6, true);
    // server
    const SV = [0, 1, 2, 3].map(i => [1340, 210 + i * 150]);
    SV.forEach(([x, y], i) => {
      ctx.fillStyle = "#3B4652"; rr(ctx, x, y, 300, 110, 12); ctx.fill();
      for (let r = 0; r < 3; r++) { ctx.fillStyle = "#5C6B78"; ctx.fillRect(x + 20, y + 16 + r * 30, 200, 18); }
      text(ctx, "Server " + (i + 1), x + 330, y + 70, 38, { weight: 900, color: INK });
      mline(ctx, [[920, 440], [x - 10, y + 55]], u, "#B8C3CA", 5, true);
    });
    // titik mengalir bergiliran
    if (u > 0) {
      const t0 = at(b, "Contohnya"), per = 0.9;
      for (let n = 0; n < 40; n++) {
        const ts = t0 + n * per, k = (l - ts) / 1.4; if (k < 0 || k > 1) continue;
        const [sx, sy] = SV[n % 4], p = k < 0.4 ? [lerp(420, 770, k / 0.4), 440] : [lerp(920, sx - 10, (k - 0.4) / 0.6), lerp(440, sy + 55, (k - 0.4) / 0.6)];
        ctx.fillStyle = ["#F07A1A", "#F2BE16", "#2FA55A", "#2E6FD8"][n % 4]; ctx.beginPath(); ctx.arc(p[0], p[1], 16, 0, Math.PI * 2); ctx.fill();
      }
      SV.forEach(([x, y], i) => { const last = Math.floor((l - t0 - 1.4 - i * per) / (4 * per)); if (last >= 0) { ctx.fillStyle = "#6EE08F"; ctx.beginPath(); ctx.arc(x + 260, y + 55, 14, 0, Math.PI * 2); ctx.fill(); } });
    }
    hand(ctx, "1, 2, 3, 4, 1, 2, 3, 4, …", 770, 640, 40, { alpha: P(l, at(b, "bergiliran ke"), 0.6) });
    hand(ctx, "tidak ada yang terlalu sibuk", 1490, 805, 38, { color: GREEN, alpha: P(l, at(b, "supaya"), 0.6) });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Cari keadaan setiap sekat dari petunjuk.", "Baca soal dengan teliti: siapa lewat lebih dulu?", "Telusuri langkah demi langkah dengan tabel."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 46, { weight: 900, color: INK, fit: 1160 });
        const ix = 1610, iy = y + 80;
        if (i === 0) bigJunc(ctx, ix, iy - 20, 220, 0);
        if (i === 1) { who(ctx, 2, ix - 40, iy - 10, 60, { label: false }); who(ctx, 3, ix + 40, iy - 10, 60, { label: false }); }
        if (i === 2) { ctx.strokeStyle = INK; ctx.lineWidth = 3; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) ctx.strokeRect(ix - 70 + c * 35, iy - 60 + r * 30, 35, 30); }
      });
    });
  }

  Object.assign(K.SCENES, {
    jalur, jalur_v, seluncur, sekat: sekatScene, satu, kalimat, tanya, antre, cek, tabel: tabelScene, server, langkah,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "pembahasan"), 0.8) : 1;
      [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v, cap: WHO[i].cap }); });
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
      const fu = P(l, at(b, "Taiwan"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagTW(ctx, 470, 230, 170); ctx.restore(); }
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      const rows = [["Judul soal", META.judul, "berjudul"], ["", "(" + META.terj + ")", "yang artinya"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      const ys = [290, 352, 450, 540, 630];
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        if (k) text(ctx, k, 720, ys[i], 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, ys[i], k ? 44 : 36, { weight: k ? 900 : 700, color: k === "Dibuat oleh" ? ORANGE : k ? INK : C.ink2, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Taiwan"), 0.8);
      if (au > 0) ring(ctx, 1160, 540 - 14, 190, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      [620, 800].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 150, { cap: WHO[i ? 3 : 2].cap }));
      ibu(ctx, 980, 480, 150, 0);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["", "(" + META.terj + ")"], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      const ys = [320, 372, 450, 522, 594];
      L.forEach(([k, v], i) => { const y = ys[i]; if (k) text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1330, y, k ? 36 : 28, { weight: k ? 900 : 700, color: k === "Kontributor:" ? ORANGE : k ? INK : C.ink2, fit: 470 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 690, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 650, 760, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.terj, 960, 340, 70, { align: "center", weight: 900, color: INK, fit: 980 });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Cara kedua: 4 berang-berang, 4 jalan keluar", 960, 500, 38, { align: "center", weight: 800, color: ORANGE, fit: 980 });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
