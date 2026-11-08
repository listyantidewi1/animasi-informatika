/* dokkit/orang.js — figur manusia sederhana ala dokumenter vektor datar (D03 dan seterusnya).
   Kepala bulat, badan kapsul, tungkai bulat pendek, wajah hanya dua mata (alis dan mulut kecil untuk emosi kuat).
   Tanpa garis hitam: pemisahan lewat isi lebih gelap/terang, pinggir terang (rim) dan bayangan lembut.
   API (semua deterministik, waktu t dalam detik):
     K.kit.orang.draw(ctx, x, y, h, opt) -> anchors   (x, y) = tengah kaki di lantai, h = tinggi berdiri (px)
       opt: pose (POSES), face (FACES; bawaan per pose), age dewasa|remaja|anak|lansia, skin (warna atau indeks SKIN), hair (HAIRS),
            top/bottom (warna), outfit kaos|kemeja|daster|hoodie|kebaya, bawah celana|pendek|rok|rokPanjang|sarung|daster, lengan pendek|panjang,
            motif/motifBawah titik|garis|kotak|batik, hijab/ciput (warna), hairCol, sanggul, peci, kacamata, sepatu, flip, t, seed (fase kedip/napas),
            look [x,y], holding(ctx, info) digambar di tangan depan, blend {to: pose, k: 0..1}, jalan / duduk (kaki berjalan / duduk untuk pose tubuh atas),
            layar true|false|'chat'|'panggilan'|'bicara'|'video'|fn(ctx, w=100, h, t), dering, glow, wajah (opt kepala untuk layar 'video'), glitch 0..1,
            kursi true|false|'ranjang', kursiCol, ranjangCol, meja (menulis: bawaan true; dudukMeja: bawaan false), mejaY (px, puncak meja), mejaCol,
            lapis 'semua'|'badan'|'lengan', produkCol, tanya, garisBisik, alpha, alis, mulut, pipi, keringat, airmata; tidur: selimut, guling, zzz
       anchors: head, top, hand, handB, chest, feet, seat, table, bed, phone, scale (px per satuan)   (tidur: head, top, bed, hand, feet, scale)
     K.kit.orang.crowd(ctx, x, y, w, n, opt) -> [anchors]
     K.kit.orang.preset(name) -> opt
     K.kit.orang.kepala(ctx, cx, cy, r, opt)          kepala saja (ikon, close-up)
     K.kit.orang.hp(ctx, x, y, size, opt)             HP generik (tinggi = size px)
     K.kit.orang.hpStand(ctx, x, y, size, opt)        HP di tripod + lampu cincin (siaran langsung)
     K.kit.orang.meja(ctx, cx, yTop, w, yFloor, opt)  meja bersama; K.kit.orang.mejaY(y, h, age) -> puncak meja bawaan (px)
     K.kit.orang.SKIN, SKIN_NAMA, POSES, FACES, HAIRS, PRESETS */
(function (g) {
  const K = g.Kiko, D = K.dok, H = K.helpers; K.kit = K.kit || {};
  const P = D.P, TAU = Math.PI * 2, PI = Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, u) => a + (b - a) * u;
  const lerp2 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

  const SKIN = ["#F0C9A2", "#E1AC7F", "#CD9165", "#B6794C", "#98613B", "#7A492C"];
  const SKIN_NAMA = ["langsat", "kuning", "sawo terang", "sawo matang", "cokelat", "cokelat tua"];
  const HAIRC = "#2C2233", UBAN = "#DADDE8", EYE = "#221A2C", MOUTH = "#5A2633", BROW = "#2C2233";
  const POSES = ["berdiri", "jalan", "duduk", "tidur", "telepon", "pegangHP", "garuk", "panik", "lega", "bisik", "menulis", "kucek", "videoCall", "tunjukBarang", "dudukMeja"];
  const FACES = ["netral", "panik", "sedih", "senang", "ngantuk", "bingung", "tertawa", "tidur"];
  const HAIRS = ["pendek", "panjang", "hijab", "kuncir", "uban", "botak", "hood"];
  const SIT = ["duduk", "menulis", "dudukMeja"];

  // ---------- warna ----------
  const CC = {};
  const rgb = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  function mix(a, b, f) { const k = a + b + f; if (CC[k]) return CC[k]; const A = rgb(a), B = rgb(b); const r = A.map((v, i) => Math.round(v + (B[i] - v) * f)); return (CC[k] = "#" + ((1 << 24) + (r[0] << 16) + (r[1] << 8) + r[2]).toString(16).slice(1)); }
  const dark = (c, f = 0.22) => mix(c, "#1A1F55", f), lite = (c, f = 0.22) => mix(c, "#FFF4E2", f);
  const lum = c => { const [r, gg, b] = rgb(c); return (0.3 * r + 0.59 * gg + 0.11 * b) / 255; };

  // ---------- proporsi per usia (satuan; tinggi berdiri = total) ----------
  const AGE = {
    dewasa: { R: 12.5, T: 33, L: 34, Wt: 21, Wb: 23.5, ua: 15, fa: 14, aw: 6.3, lw: 8, hipX: 4.8, neck: 2 },
    remaja: { R: 12.4, T: 30.5, L: 35.5, Wt: 18.5, Wb: 19.5, ua: 14.5, fa: 13.5, aw: 5.7, lw: 7.2, hipX: 4.4, neck: 2.4 },
    anak: { R: 14.5, T: 22, L: 20, Wt: 17.5, Wb: 19.5, ua: 10.5, fa: 9.6, aw: 5.4, lw: 6.8, hipX: 4, neck: 1.2 },
    lansia: { R: 12.2, T: 31, L: 31, Wt: 21, Wb: 25, ua: 14, fa: 13, aw: 6, lw: 7.8, hipX: 4.8, neck: 1.4, hunch: 0.1 },
  };
  for (const k in AGE) { const a = AGE[k]; a.total = a.L + a.T + a.neck + 1.95 * a.R - 1; a.lt = (a.L - a.lw * 0.35) / 2; }

  // arah cahaya (satuan lokal; diatur ulang setiap draw sesuai flip): dari kanan atas layar
  let LX = 0.8, LY = -0.6;
  const pxScale = ctx => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b) || 1; };

  // ---------- pembantu gambar ----------
  // isi bentuk fn (hanya subpath) dengan col, lalu pita bayangan di sisi jauh cahaya dan pita terang di sisi cahaya
  function solid(ctx, fn, col, rim = 1, la = 0.32) {
    ctx.fillStyle = col; ctx.beginPath(); fn(); ctx.fill();
    if (!rim) return;
    ctx.save(); ctx.beginPath(); fn(); ctx.clip();
    const dS = 3.2 * rim, dL = 1.25 * rim;
    ctx.beginPath(); fn(); ctx.save(); ctx.translate(LX * dS, LY * dS); fn(); ctx.restore();
    ctx.fillStyle = "rgba(26,28,84,0.22)"; ctx.fill("evenodd");
    ctx.beginPath(); fn(); ctx.save(); ctx.translate(-LX * dL, -LY * dL); fn(); ctx.restore();
    ctx.fillStyle = `rgba(255,242,222,${la})`; ctx.fill("evenodd");
    ctx.restore();
  }
  function line(ctx, pts, w, col) {
    ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
  }
  // tungkai/lengan: lebar tetap, ujung bulat; sisi jauh cahaya sedikit lebih gelap (tanpa garis tepi)
  function limb(ctx, pts, w, col, shadow = true) {
    if (shadow) { ctx.save(); ctx.translate(-LX * w * 0.2, -LY * w * 0.2); line(ctx, pts, w * 0.96, "rgba(26,28,84,0.2)"); ctx.restore(); }
    line(ctx, pts, w, dark(col, 0.17));
    ctx.save(); ctx.translate(LX * w * 0.1, LY * w * 0.1); line(ctx, pts, w * 0.8, col); ctx.restore();
  }
  function capsule(ctx, a, b, r) {
    const an = Math.atan2(b[1] - a[1], b[0] - a[0]);
    ctx.moveTo(b[0] + r * Math.cos(an - PI / 2), b[1] + r * Math.sin(an - PI / 2));
    ctx.arc(b[0], b[1], r, an - PI / 2, an + PI / 2); ctx.arc(a[0], a[1], r, an + PI / 2, an + PI * 1.5); ctx.closePath();
  }
  const dot = (ctx, x, y, r, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const ell = (ctx, x, y, rx, ry, rot, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU); ctx.fill(); };
  function fk(sx, sy, a1, a2, l1, l2) { const ex = sx + Math.sin(a1) * l1, ey = sy + Math.cos(a1) * l1; return { S: [sx, sy], E: [ex, ey], H: [ex + Math.sin(a1 + a2) * l2, ey + Math.cos(a1 + a2) * l2] }; }
  // lengan ke titik tangan Ht. Sudut siku diukur dari arah bawah, positif = menjauhi badan (side +1 lengan depan, -1 lengan belakang).
  // Bila siku hasil IK di luar [lo, hi], sudut dijepit dan lengan atas dipendekkan (seolah mengarah ke kamera), bukan siku mencuat.
  function reach(S, Ht, l1, l2, side, lo, hi, pref) {
    let dx = Ht[0] - S[0], dy = Ht[1] - S[1], d = Math.hypot(dx, dy); const m = l1 + l2 - 0.05;
    if (d > m) { dx *= m / d; dy *= m / d; d = m; } d = Math.max(d, 0.5);
    const Hh = [S[0] + dx, S[1] + dy], th = Math.atan2(dx, dy), al = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const c1 = th + al, c2 = th - al;
    const a = pref === "out" ? (side * Math.sin(c1) > side * Math.sin(c2) ? c1 : c2) : (Math.cos(c1) > Math.cos(c2) ? c1 : c2);
    const ao = Math.atan2(side * Math.sin(a), Math.cos(a));
    if (ao >= lo && ao <= hi) return { S, E: [S[0] + Math.sin(a) * l1, S[1] + Math.cos(a) * l1], H: Hh };
    const ac = clamp(ao, lo, hi), v = [side * Math.sin(ac), Math.cos(ac)], vd = v[0] * dx + v[1] * dy, d2 = dx * dx + dy * dy;
    const solve = L => { const disc = vd * vd - d2 + L * L; if (disc < 0) return null; const s = Math.sqrt(disc), u = Math.min(l1, vd + s); return u >= Math.max(vd - s, 0.4 * l1) ? u : null; };
    let u = solve(l2); if (u == null) u = solve(l2 * 1.3); if (u == null) u = clamp(vd, 0.4 * l1, l1);
    return { S, E: [S[0] + v[0] * u, S[1] + v[1] * u], H: Hh };
  }
  const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  function drop(ctx, x, y, s) {
    const shape = (k) => { ctx.beginPath(); ctx.moveTo(x, y - s * k); ctx.bezierCurveTo(x + s * 0.55 * k, y - s * 0.15 * k, x + s * 0.7 * k, y + s * 0.6 * k, x, y + s * 0.65 * k);
      ctx.bezierCurveTo(x - s * 0.7 * k, y + s * 0.6 * k, x - s * 0.55 * k, y - s * 0.15 * k, x, y - s * k); ctx.fill(); };
    ctx.fillStyle = "#5FB4DE"; shape(1.16);
    ctx.fillStyle = "#9FE6FF"; shape(1);
    dot(ctx, x - s * 0.2, y + s * 0.18, s * 0.17, "#FFFFFF");
  }

  // ---------- HP generik (satuan: lebar 7, tinggi 13, pusat di 0,0; land = mendatar) ----------
  function handset(ctx, x, y, r, a, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineWidth = r * 0.3;
    ctx.beginPath(); ctx.arc(0, r * 0.3, r * 0.5, PI * 1.18, PI * 1.82); ctx.stroke(); ctx.fillStyle = col;
    [PI * 1.18, PI * 1.82].forEach(q => { ctx.beginPath(); ctx.ellipse(Math.cos(q) * r * 0.5, r * 0.3 + Math.sin(q) * r * 0.5, r * 0.2, r * 0.13, q + PI / 2, 0, TAU); ctx.fill(); }); ctx.restore(); }
  function screenU(ctx, mode, sw, sh, o) {
    const t = o.t || 0, x0 = -sw / 2, y0 = -sh / 2, land = sw > sh, m = Math.min(sw, sh);
    if (typeof mode === "function") { ctx.save(); ctx.translate(x0, y0); ctx.scale(sw / 100, sw / 100); mode(ctx, 100, 100 * sh / sw, t); ctx.restore(); return; }
    if (mode === "panggilan" || mode === "bicara") {
      const gr = ctx.createLinearGradient(0, y0, 0, -y0); gr.addColorStop(0, "#5B6BE0"); gr.addColorStop(1, "#8A5FD6"); ctx.fillStyle = gr; ctx.fillRect(x0, y0, sw, sh);
      const ay = land ? -sh * 0.08 : -sh * 0.17, ax = land ? -sw * 0.22 : 0, ar = m * 0.27;
      if (mode === "panggilan") for (let i = 0; i < 2; i++) { const u = (t * 0.9 + i * 0.5) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - u)})`; ctx.lineWidth = m * 0.05; ctx.beginPath(); ctx.arc(ax, ay, ar * (1 + u * 0.7), 0, TAU); ctx.stroke(); }
      dot(ctx, ax, ay, ar, "#B7C1F2"); dot(ctx, ax, ay - ar * 0.22, ar * 0.36, "#8C9AD8"); ctx.save(); ctx.beginPath(); ctx.arc(ax, ay, ar, 0, TAU); ctx.clip(); ell(ctx, ax, ay + ar * 0.78, ar * 0.62, ar * 0.48, 0, "#8C9AD8"); ctx.restore();
      ctx.font = `900 ${ar * 1.05}px ${K.FONT}`; ctx.textAlign = "center"; ctx.fillStyle = "#FFFFFF"; ctx.fillText("?", ax + ar * 0.62, ay - ar * 0.38);
      ctx.fillStyle = "rgba(255,255,255,0.85)"; const lx = land ? sw * 0.08 : 0, ly = land ? -sh * 0.12 : sh * 0.08;
      H.rr(ctx, lx - m * 0.36, ly, m * 0.72, m * 0.1, m * 0.05); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.5)"; H.rr(ctx, lx - m * 0.26, ly + m * 0.17, m * 0.52, m * 0.08, m * 0.04); ctx.fill();
      const by = land ? sh * 0.22 : sh * 0.34, br = m * 0.14;
      if (mode === "panggilan") { const pu = 1 + 0.12 * Math.max(0, Math.sin(t * 6)); dot(ctx, lx - m * 0.3, by, br * pu, P.green); handset(ctx, lx - m * 0.3, by, br, 0, "#FFFFFF");
        dot(ctx, lx + m * 0.3, by, br, P.red); handset(ctx, lx + m * 0.3, by, br, PI * 0.75, "#FFFFFF"); }
      else { dot(ctx, lx, by, br, P.red); handset(ctx, lx, by, br, PI * 0.75, "#FFFFFF");
        for (let i = 0; i < 5; i++) { const hh = m * (0.04 + 0.08 * Math.abs(Math.sin(t * 7 + i * 1.3))); ctx.fillStyle = "rgba(255,255,255,0.8)"; H.rr(ctx, lx - m * 0.2 + i * m * 0.1, ly + m * 0.34 - hh / 2, m * 0.05, hh, m * 0.025); ctx.fill(); } }
      return;
    }
    if (mode === "video") {
      const gr = ctx.createLinearGradient(0, y0, 0, -y0); gr.addColorStop(0, "#2F7F86"); gr.addColorStop(1, "#24496E"); ctx.fillStyle = gr; ctx.fillRect(x0, y0, sw, sh);
      const r = m * 0.3, cy = land ? sh * 0.02 : -sh * 0.02, gl = clamp(o.glitch || 0, 0, 1);
      const fl = gl > 0 && (Math.sin(t * 23.1) + Math.sin(t * 37.7 + 1)) > 1.6 - gl * 0.8;
      const wo = Object.assign({ hair: "hijab", hijab: "#4FA88E", ciput: "#2E6E5E", skin: SKIN[2], top: "#F2F0E6", face: "senang", seed: 21 }, o.wajah || {}, { t, bahu: 3 });
      const lx = LX, ly = LY;
      if (fl) { ctx.save(); ctx.globalAlpha *= 0.55; kepala(ctx, -r * 0.12, cy, r, Object.assign({}, wo, { skin: "#FF6F91" })); ctx.restore(); }
      kepala(ctx, fl ? r * 0.08 : 0, cy, r, wo); LX = lx; LY = ly;
      if (fl) { ctx.fillStyle = "rgba(168,255,242,0.55)"; ctx.fillRect(x0, cy - r * 0.2, sw, r * 0.12); ctx.fillRect(x0, cy + r * 0.45, sw, r * 0.07); }
      const pw = m * 0.3, ph = pw * 1.4; ctx.fillStyle = "#F2C9A0"; H.rr(ctx, -x0 - pw - m * 0.06, y0 + m * 0.06, pw, ph, m * 0.05); ctx.fill();
      dot(ctx, -x0 - pw / 2 - m * 0.06, y0 + m * 0.06 + ph * 0.42, pw * 0.26, "#B6794C");
      const hx = land ? -x0 - m * 0.2 : 0; dot(ctx, hx, -y0 - m * 0.16, m * 0.1, P.red); handset(ctx, hx, -y0 - m * 0.16, m * 0.1, PI * 0.75, "#FFFFFF");
      return;
    }
    // chat (bawaan)
    const gr = ctx.createLinearGradient(0, y0, 0, -y0); gr.addColorStop(0, o.screen || "#A8FFF2"); gr.addColorStop(1, o.screen2 || P.teal); ctx.fillStyle = gr; ctx.fillRect(x0, y0, sw, sh);
    ctx.fillStyle = "rgba(255,255,255,0.8)"; H.rr(ctx, x0 + m * 0.16, y0 + sh * 0.18, sw * 0.68, m * 0.18, m * 0.09); ctx.fill(); H.rr(ctx, x0 + m * 0.16, y0 + sh * 0.34, sw * 0.46, m * 0.18, m * 0.09); ctx.fill();
    ctx.fillStyle = "rgba(30,60,90,0.25)"; H.rr(ctx, -x0 - m * 0.16 - sw * 0.5, y0 + sh * 0.52, sw * 0.5, m * 0.18, m * 0.09); ctx.fill();
  }
  function phoneU(ctx, o = {}) {
    const t = o.t || 0, ring = o.ring ? Math.sin(t * 50) * 0.35 * (Math.sin(t * 5) > 0 ? 1 : 0) : 0, land = !!o.land;
    const bw = land ? 13 : 7, bh = land ? 7 : 13, sw = bw - 1.4, sh = bh - 1.8;
    ctx.save(); ctx.translate(ring, 0);
    if (o.back) { solid(ctx, () => H.rr(ctx, -bw / 2, -bh / 2, bw, bh, 1.6), o.col || "#3B3F78", 0.35); dot(ctx, -bw / 2 + 1.9, -bh / 2 + 2.1, 0.8, "#1E2350"); ctx.restore(); return; }
    ctx.fillStyle = o.col || "#30356A"; H.rr(ctx, -bw / 2, -bh / 2, bw, bh, 1.6); ctx.fill();
    ctx.save(); H.rr(ctx, -sw / 2, -sh / 2, sw, sh, 1.0); ctx.clip();
    const mode = o.layar === undefined || o.layar === true || o.on === true ? (o.on === false ? false : "chat") : o.layar;
    if (mode === false || o.on === false) { ctx.fillStyle = "#1D2250"; ctx.fillRect(-sw / 2, -sh / 2, sw, sh); }
    else screenU(ctx, mode, sw, sh, o);
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.beginPath(); ctx.moveTo(-sw / 2, -sh / 2); ctx.lineTo(-sw / 2 + sw * 0.45, -sh / 2); ctx.lineTo(-sw / 2, -sh / 2 + sh * 0.35); ctx.fill();
    ctx.restore();
  }
  function pen(ctx) { ctx.save(); ctx.rotate(-0.5); ctx.fillStyle = P.amber; H.rr(ctx, -0.8, -8, 1.6, 9, 0.8); ctx.fill(); ctx.fillStyle = "#3A3350"; ctx.beginPath(); ctx.moveTo(-0.8, 1); ctx.lineTo(0.8, 1); ctx.lineTo(0, 2.8); ctx.fill(); ctx.restore(); }
  // produk generik (toples krim/jamu): pusat 0,0, tinggi ±10
  function produk(ctx, col) {
    col = col || P.pink;
    solid(ctx, () => H.rr(ctx, -3, -3.6, 6, 8.2, 1.8), col, 0.5);
    solid(ctx, () => H.rr(ctx, -2.5, -5.6, 5, 2.4, 0.8), "#F2F6FF", 0.4);
    ctx.fillStyle = lite(col, 0.6); H.rr(ctx, -3, -1.2, 6, 3.4, 0.4); ctx.fill();
    ell(ctx, 0, 0.5, 1.1, 0.65, -0.5, P.green); ell(ctx, 0.9, 0.1, 0.7, 0.4, 0.6, "#3FB48A");
  }

  // ---------- opsi ----------
  function norm(opt) {
    const o = { pose: "berdiri", age: "dewasa", hair: "pendek", skin: SKIN[2], top: P.teal, bottom: "#3B4785", t: 0, seed: 1 };
    for (const key in opt || {}) if (opt[key] !== undefined && opt[key] !== null) o[key] = opt[key];
    if (typeof o.skin === "number") o.skin = SKIN[((o.skin % SKIN.length) + SKIN.length) % SKIN.length];
    if (!AGE[o.age]) o.age = "dewasa";
    if (!POSES.includes(o.pose)) o.pose = "berdiri";
    o.outfit = o.outfit || (o.hair === "hood" ? "hoodie" : "kaos");
    o.bawah = o.bawah || (o.outfit === "daster" ? "daster" : "celana");
    o.lengan = o.lengan || (["hoodie", "kebaya"].includes(o.outfit) || o.hair === "hijab" ? "panjang" : "pendek");
    o.hairCol = o.hairCol || (o.hair === "uban" ? UBAN : HAIRC);
    o.hijab = o.hijab || P.pink;
    o.sepatu = o.sepatu || "#3A3462";
    return o;
  }

  // ---------- pose ----------
  // Bingkai lokal tubuh atas: titik asal di tengah pinggul (p.ox, p.hipY), y ke atas negatif. Leher di (0, -T+1).
  function headC(A, tilt) { const d = A.neck + A.R * 0.95; return [Math.sin(tilt) * d, -A.T + 1 - Math.cos(tilt) * d]; }
  function poseRaw(name, o, A, t, ph) {
    const p = { name, lean: 0, tilt: 0.03 * Math.sin(t * 0.7 + ph), bob: 0, jx: 0, view: "q", legs: "stand", bMode: "behind", look: [0, 0], face: "netral", obj: null, objRot: 0, objOff: [0, 0], glow: 0, layar: undefined, land: false, ox: 0, hipY: -A.L, sRaise: 0 };
    const br = Math.sin(t * 2.1 + ph), T = A.T, R = A.R, sx = A.Wt / 2 - 3.2, sy = -T + 5.5, ua = A.ua, fa = A.fa, aw = A.aw, lw = A.lw, lt = A.lt, ankY = -lw * 0.35;
    const sit = SIT.includes(name) || ((o.duduk || o.kursi === "ranjang") && name !== "jalan" && o.duduk !== false), walk = !sit && (name === "jalan" || o.jalan);
    let SF = [sx, sy], SB = [-sx, sy];
    if (walk) { p.c = t * PI * (o.speed || 1.7) + ph; p.view = "side"; p.legs = "walk"; p.lean = 0.05; SF = [1.5, sy]; SB = [-1.5, sy]; p.tilt = 0.02 * Math.sin(p.c * 2); }
    if (sit) { p.legs = "sit"; p.hipY = ankY - lt; p.sb = A.Wb * 0.2; p.ox = -p.sb; }
    const sw = walk ? Math.sin(p.c) : 0;
    const hangF = () => walk ? fk(SF[0], SF[1], -sw * 0.55, 0.3 + 0.35 * Math.max(0, -sw), ua, fa) : sit ? F([lt * 0.62, -lw * 0.62 + br * 0.15], 0.05, 0.45) : fk(SF[0], SF[1], 0.13 + 0.02 * br, -0.1, ua, fa);
    const hangB = () => walk ? fk(SB[0], SB[1], sw * 0.55, 0.3 + 0.35 * Math.max(0, sw), ua, fa) : sit ? fk(SB[0], SB[1], -0.12, 0.25, ua, fa) : fk(SB[0], SB[1], -0.2 - 0.02 * br, 0.12, ua, fa);
    const F = (H, lo, hi, pref, S) => reach(S || SF, H, ua, fa, 1, lo, hi, pref), B = (H, lo, hi, pref, S) => reach(S || SB, H, ua, fa, -1, lo, hi, pref);
    p.F = hangF(); p.B = hangB();
    // titik pada kepala (bingkai kepala, satuan R) -> bingkai lokal tubuh
    const onHead = (u, v) => { const h = headC(A, p.tilt), r = rot(u * R, v * R, p.tilt); return [h[0] + r[0], h[1] + r[1]]; };
    // meja (pose duduk): puncak meja dalam satuan relatif kaki, dikonversi ke bingkai lokal
    const tableTop = () => clamp(o.mejaY != null ? o.mejaY : p.hipY - T * 0.45, p.hipY - T * 0.75, p.hipY - T * 0.15);
    const toLocal = (wx, wy) => rot(wx - p.ox, wy - (p.hipY + p.bob), -p.lean);
    switch (name) {
      case "duduk": p.lean = -0.02; break;
      case "telepon": { p.tilt = 0.1 + 0.02 * br; p.sRaise = 1.2; const S = [SF[0], SF[1] - 1.2];
        p.F = F(onHead(walk ? 0.55 : 0.88, 0.56), 0.25, 0.6, "down", S); p.obj = "hp"; p.objRot = -0.12; p.objOff = [walk ? -0.2 : 0.9, -5.4]; p.layar = "bicara"; break; }
      case "pegangHP": { p.tilt = 0.12; p.look = [0.5, 0.9];
        const yh = -T * 0.55 + br * 0.3; p.F = F([walk ? 5 : A.Wt * 0.26, yh], 0.12, 0.35); p.B = B([walk ? 1.2 : -A.Wt * 0.02, yh - 0.6], walk ? -0.3 : 0.12, 0.35); p.bMode = "fore";
        p.obj = "hp"; p.objRot = -0.08; p.objOff = [walk ? -1.6 : -A.Wt * 0.14, -4.4]; p.glow = 1; break; }
      case "garuk": { p.tilt = 0.08 + 0.02 * br; p.F = F(onHead(0.62 + Math.sin(t * 15) * 0.09, -0.62 + Math.cos(t * 15) * 0.05), 0.5, 2.8, "out");
        p.face = "bingung"; p.look = [0.6, -0.6]; break; }
      case "panik": { p.tilt = 0.02 * Math.sin(t * 9); p.jx = Math.sin(t * 37 + ph) * 0.45; const sh = Math.sin(t * 31 + ph) * 0.7;
        p.F = F(onHead(1.32, 0.22 + sh / R), 0.6, 1.75, "out"); p.B = B(onHead(-1.32, 0.22 - sh / R), 0.6, 1.75, "out"); p.face = "panik"; break; }
      case "lega": { const lf = Math.abs(Math.sin(t * 8 + ph)); p.tilt = -0.13 - 0.04 * lf; p.lean = -0.04; p.bob = -lf * 1.1;
        p.F = F([A.Wt * 0.18, -T * 0.3], 0.15, 0.5); p.B = B([-A.Wt * 0.02, -T * 0.5], 0.15, 0.5); p.bMode = "fore"; p.face = "tertawa"; break; }
      case "bisik": { p.lean = 0.1; p.tilt = 0.1 + 0.02 * br; p.F = F(onHead(0.74, 0.5), 0.3, 0.75); p.face = "netral"; p.look = [1, 0]; p.mouth = "o"; p.whisper = true; break; }
      case "kucek": { p.tilt = -0.06 + 0.015 * br; const side = p.view === "side", e = side ? [0.54, 0.04] : [0.49, 0.04], c = t * 8 + ph;
        p.F = F(onHead(e[0] + 0.06 + Math.sin(c) * 0.07, e[1] + 0.12 + Math.cos(c) * 0.05), 0.2, 0.9); p.face = "ngantuk"; p.kucek = true; break; }
      case "videoCall": { p.tilt = -0.04 + 0.01 * br; p.look = [0.9, -0.3]; p.F = F([A.Wt * 0.5 + ua * 0.95, -T * 0.8 + br * 0.3], 0.3, 1.2);
        p.obj = "hp"; p.land = true; p.objRot = -0.06; p.objOff = [0.6, -3.8]; p.layar = "video"; p.glow = 0.7; break; }
      case "tunjukBarang": { p.tilt = -0.05 + 0.02 * br; p.look = [0.8, -0.4]; const wg = Math.sin(t * 2.6 + ph) * 0.6;
        p.F = F([A.Wt * 0.5 + ua * 0.72, -T * 0.95 + wg], 0.3, 1.1); p.obj = "produk"; p.objRot = 0.08 * Math.sin(t * 2.6 + ph); p.objOff = [0.3, -5.4]; p.face = "senang"; break; }
      case "menulis": case "dudukMeja": {
        const ty = tableTop(); p.tableY = ty; p.lean = name === "menulis" ? 0.12 : 0.03; p.tilt = name === "menulis" ? 0.2 : 0.04 + 0.02 * br;
        p.look = name === "menulis" ? [0.4, 1] : [0, 0]; p.table = true; p.bMode = "fore";
        const ey = ty - aw * 0.5, hy = ty - aw * 0.62;
        if (name === "menulis") {
          const wx = A.Wt * 0.7 + 5 + Math.sin(t * 7 + ph) * 1.2 + Math.sin(t * 1.3) * 1.6;
          p.F = { S: SF, E: toLocal(p.ox + A.Wt * 0.48, ey), H: toLocal(p.ox + wx, hy) };
          p.B = { S: SB, E: toLocal(p.ox + A.Wt * 0.05, ey), H: toLocal(p.ox + A.Wt * 0.62, hy) };
          p.obj = "pen";
        } else {
          p.F = { S: SF, E: toLocal(p.ox + A.Wt * 0.56, ey), H: toLocal(p.ox + A.Wt * 0.12, hy) };
          p.B = { S: SB, E: toLocal(p.ox - A.Wt * 0.56, ey), H: toLocal(p.ox - A.Wt * 0.16, hy) };
        }
        break; }
    }
    if (A.hunch) { p.lean += A.hunch; p.tilt += A.hunch * 0.6; }
    return p;
  }
  function pose(o, A, t, ph) {
    const pa = poseRaw(o.pose, o, A, t, ph);
    if (!o.blend || !o.blend.to || !POSES.includes(o.blend.to) || o.blend.to === "tidur") return pa;
    const pb = poseRaw(o.blend.to, o, A, t, ph), k = clamp(o.blend.k || 0, 0, 1), dom = k < 0.5 ? pa : pb;
    if (pa.legs !== pb.legs) { pb.ox = pa.ox; pb.hipY = pa.hipY; }   // kaki tidak dicampur: tetap milik pose asal
    const p = Object.assign({}, pa);
    ["lean", "tilt", "bob", "jx", "sRaise", "glow"].forEach(f => (p[f] = lerp(pa[f] || 0, pb[f] || 0, k)));
    p.look = lerp2(pa.look, pb.look, k);
    const arm = (a, b) => ({ S: lerp2(a.S, b.S, k), E: lerp2(a.E, b.E, k), H: lerp2(a.H, b.H, k) });
    p.F = arm(pa.F, pb.F); p.B = arm(pa.B, pb.B);
    p.bMode = k < 0.35 ? pa.bMode : pb.bMode;
    p.face = dom.face; p.mouth = dom.mouth; p.whisper = dom.whisper; p.table = pa.table && (pb.table || k < 0.5); p.tableY = pa.tableY != null ? pa.tableY : pb.tableY;
    if (pa.obj && pa.obj === pb.obj) { p.objOff = lerp2(pa.objOff, pb.objOff, k); p.objRot = lerp(pa.objRot, pb.objRot, k); p.land = dom.land; p.layar = dom.layar; }
    else { p.obj = dom.obj; p.objOff = dom.objOff; p.objRot = dom.objRot; p.land = dom.land; p.layar = dom.layar; p.objA = Math.abs(k - 0.5) * 2; }
    return p;
  }

  // ---------- kepala (bingkai kepala: pusat 0,0, satuan R) ----------
  function hairBack(ctx, o, R, t, ph, view) {
    const hc = o.hairCol, s = o.hair;
    if (s === "panjang") solid(ctx, () => H.rr(ctx, -R * 1.1, -R * 0.55, R * 2.1, R * 2.05, R * 0.95), dark(hc, 0.08), 0.5, 0.1);
    if (s === "kuncir") { const a = 0.35 + Math.sin(t * 2.4 + ph) * 0.12; ctx.save(); ctx.translate(-R * 0.86, -R * 0.42); ctx.rotate(a);
      solid(ctx, () => ctx.ellipse(-R * 0.2, R * 0.55, R * 0.32, R * 0.62, 0.15, 0, TAU), hc, 0.4, 0.12); ell(ctx, 0, 0, R * 0.16, R * 0.16, 0, P.pink); ctx.restore(); }
    if (o.sanggul) solid(ctx, () => ctx.arc(-R * 0.82, -R * 0.62, R * 0.42, 0, TAU), hc, 0.4);
    if (s === "hood") solid(ctx, () => ctx.arc(view === "side" ? -R * 0.24 : -R * 0.08, -R * 0.02, R * 1.28, 0, TAU), dark(o.top, 0.12), 0.6);
  }
  function hairFront(ctx, o, R, view) {
    const hc = o.hairCol, s = o.hair, side = view === "side";
    if (s === "pendek" || s === "panjang" || s === "kuncir" || (s === "uban" && o.sanggul)) {
      solid(ctx, () => {
        ctx.moveTo(-R * 1.02, R * (s === "panjang" ? 0.55 : 0.2));
        ctx.arc(0, 0, R * 1.05, PI * 0.96, PI * 2.02);
        ctx.quadraticCurveTo(R * 0.98, -R * 0.42, R * 0.62, -R * 0.52);
        ctx.quadraticCurveTo(R * 0.15, -R * (s === "kuncir" ? 0.6 : 0.3), -R * 0.32, -R * 0.56);
        ctx.quadraticCurveTo(side ? -R * 0.5 : -R * 0.78, -R * 0.42, side ? -R * 0.55 : -R * 0.82, R * 0.12);
        if (s === "panjang") ctx.lineTo(-R * 0.86, R * 0.55);
        ctx.closePath();
      }, hc, 0.55, 0.12);
      ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.beginPath(); ctx.ellipse(R * 0.22, -R * 0.8, R * 0.34, R * 0.08, -0.2, 0, TAU); ctx.fill();
    } else if (s === "uban") {
      solid(ctx, () => {
        ctx.moveTo(-R * 1.03, R * 0.2); ctx.arc(0, 0, R * 1.04, PI * 0.97, PI * 1.55);
        ctx.quadraticCurveTo(-R * 0.25, -R * 0.66, -R * 0.6, -R * 0.45); ctx.quadraticCurveTo(-R * 0.82, -R * 0.2, -R * 0.78, R * 0.18); ctx.closePath();
        if (!side) { ctx.moveTo(R * 1.02, R * 0.05); ctx.arc(0, 0, R * 1.04, PI * 2.01, PI * 1.82, true); ctx.quadraticCurveTo(R * 0.86, -R * 0.2, R * 0.9, R * 0.08); ctx.closePath(); }
      }, hc, 0.45);
    } else if (s === "botak") {
      ctx.fillStyle = "rgba(255,255,255,0.16)"; ctx.beginPath(); ctx.ellipse(R * 0.3, -R * 0.62, R * 0.3, R * 0.14, -0.4, 0, TAU); ctx.fill();
      ctx.fillStyle = dark(HAIRC, 0); ctx.globalAlpha *= 0.8; ctx.beginPath(); ctx.ellipse(-R * 0.92, R * 0.0, R * 0.14, R * 0.34, 0.1, 0, TAU); ctx.fill(); ctx.globalAlpha /= 0.8;
    }
    if (o.peci) { solid(ctx, () => { ctx.moveTo(-R * 0.82, -R * 0.55); ctx.lineTo(-R * 0.76, -R * 1.18); ctx.quadraticCurveTo(0, -R * 1.32, R * 0.76, -R * 1.18); ctx.lineTo(R * 0.82, -R * 0.55); ctx.quadraticCurveTo(0, -R * 0.68, -R * 0.82, -R * 0.55); }, o.peci === true ? "#2E2B48" : o.peci, 0.4);
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(-R * 0.78, -R * 0.82, R * 1.56, R * 0.07); }
  }
  // wajah; wrap = wajah di dalam kerudung/tudung (oval lebih sempit)
  function features(ctx, o, R, mood, view, look, t, ph, cx, cy, mouth, wrap) {
    const side = view === "side", es = R * 0.29, xs = side ? [cx + R * 0.12] : [cx - es, cx + es];
    const lx = look[0] * R * 0.07, ly = look[1] * R * 0.06, px = pxScale(ctx);
    const bt = (t + ph * 0.9) % 3.7, blink = bt > 3.56 || (mood === "ngantuk" && bt > 2.6);
    const lw1 = Math.max(R * 0.075, 2.3 / px);
    ctx.lineCap = "round"; ctx.strokeStyle = EYE; ctx.fillStyle = EYE; ctx.lineWidth = lw1;
    const sl = lum(o.skin), browC = o.hair === "uban" ? (sl > 0.62 ? "#7D7790" : "#E2E4EE") : o.hair === "hijab" || o.hair === "botak" ? BROW : mix(o.hairCol, "#000000", 0.1);
    const ey = cy + R * 0.04;
    const erx = Math.max(R * 0.083, 3.0 / px), ery = Math.max(R * 0.115, 4.1 / px);
    // bercak terang di bawah mata (kulit gelap / ukuran kecil) supaya mata tetap terbaca
    const pa = clamp((0.72 - sl) * 1.1, 0, 0.3) * (px * R < 30 ? 1 : 0.6);
    if (pa > 0.01 && mood !== "tidur") { ctx.save(); ctx.globalAlpha *= pa; xs.forEach(x => ell(ctx, x, ey + R * 0.06, Math.max(R * 0.16, erx * 1.7), Math.max(R * 0.13, ery * 1.25), 0, lite(o.skin, 0.4))); ctx.restore(); }
    xs.forEach((x, i) => {
      const k = side ? 1 : (i === 0 ? -1 : 1);       // -1 = mata kiri, 1 = mata kanan
      ctx.fillStyle = EYE; ctx.strokeStyle = EYE; ctx.lineWidth = lw1;
      if (o.kucek && k > 0 && !side) { /* tertutup tangan */ }
      else if (mood === "senang" || mood === "tertawa") { ctx.beginPath(); ctx.arc(x, ey + R * 0.05, Math.max(R * 0.1, erx * 1.2), PI * 1.12, PI * 1.88); ctx.stroke(); }
      else if (mood === "tidur") { ctx.lineWidth = Math.max(R * 0.07, 2.2 / px); ctx.beginPath(); ctx.arc(x, ey - R * 0.07, R * 0.14, PI * 0.18, PI * 0.82); ctx.stroke(); }
      else if (blink) { ctx.beginPath(); ctx.moveTo(x - Math.max(R * 0.09, erx), ey + R * 0.02); ctx.lineTo(x + Math.max(R * 0.09, erx), ey + R * 0.02); ctx.stroke(); }
      else if (mood === "ngantuk") { ctx.beginPath(); ctx.ellipse(x + lx * 0.5, ey + R * 0.02, erx * 1.08, ery * 0.65, 0, 0, PI); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x - erx * 1.45, ey + R * 0.02); ctx.lineTo(x + erx * 1.45, ey + R * 0.02); ctx.stroke(); }
      else { const big = mood === "panik" ? 1.3 : 1, sm = mood === "sedih" ? 0.9 : 1;
        if (mood === "panik") ell(ctx, x, ey, Math.max(R * 0.15, erx * 1.8), Math.max(R * 0.19, ery * 1.65), 0, "#FFFFFF");
        ell(ctx, x + lx, ey + ly + (mood === "sedih" ? R * 0.03 : 0), erx * big * sm, ery * big * sm, 0, EYE);
        dot(ctx, x + lx - erx * 0.3, ey + ly - ery * 0.35, erx * 0.31, "rgba(255,255,255,0.9)"); }
      // alis (tidur: tanpa alis)
      if ((o.alis === false && mood === "netral") || mood === "tidur") return;
      ctx.strokeStyle = browC; ctx.lineWidth = lw1; ctx.beginPath();
      const by = ey - R * 0.27;
      if (mood === "panik") { ctx.moveTo(x - k * R * 0.1, by - R * 0.13); ctx.lineTo(x + k * R * 0.12, by - R * 0.02); }
      else if (mood === "sedih") { ctx.moveTo(x - k * R * 0.1, by - R * 0.04); ctx.lineTo(x + k * R * 0.12, by + R * 0.07); }
      else if (mood === "senang" || mood === "tertawa") { ctx.arc(x, by + R * 0.02, R * 0.12, PI * 1.2, PI * 1.8); }
      else if (mood === "ngantuk") { ctx.moveTo(x - R * 0.12, by + R * 0.07); ctx.lineTo(x + R * 0.1, by + R * 0.08); }
      else if (mood === "bingung") { if (k > 0) { ctx.arc(x, by - R * 0.02, R * 0.13, PI * 1.15, PI * 1.85); } else { ctx.moveTo(x - R * 0.11, by + R * 0.07); ctx.lineTo(x + R * 0.1, by + R * 0.04); } }
      else { ctx.moveTo(x - R * 0.1, by + R * 0.01); ctx.quadraticCurveTo(x, by - R * 0.04, x + R * 0.1, by + R * 0.01); }
      ctx.stroke();
    });
    // pipi
    if (mood === "senang" || mood === "tertawa" || o.pipi) { ctx.fillStyle = "rgba(255,111,145,0.32)"; (side ? [cx + R * 0.15] : [cx - R * 0.42, cx + R * 0.42]).forEach(x => { ctx.beginPath(); ctx.ellipse(x, ey + R * 0.25, R * 0.13, R * 0.08, 0, 0, TAU); ctx.fill(); }); }
    // mulut
    const mx = cx + (side ? R * 0.22 : R * 0.02), my = cy + R * 0.42;
    ctx.strokeStyle = MOUTH; ctx.fillStyle = MOUTH; ctx.lineWidth = Math.max(R * 0.065, 2 / px);
    if (mood === "panik") ell(ctx, mx, my, R * 0.09, R * (0.12 + 0.02 * Math.sin(t * 18)), 0, MOUTH);
    else if (mood === "sedih") { ctx.beginPath(); ctx.arc(mx, my + R * 0.1, R * 0.11, PI * 1.2, PI * 1.8); ctx.stroke(); }
    else if (mood === "senang") { ctx.beginPath(); ctx.arc(mx, my - R * 0.12, R * 0.15, PI * 0.22, PI * 0.78); ctx.stroke(); }
    else if (mood === "tertawa") { ctx.beginPath(); ctx.moveTo(mx - R * 0.19, my - R * 0.08); ctx.quadraticCurveTo(mx, my - R * 0.02, mx + R * 0.19, my - R * 0.08); ctx.quadraticCurveTo(mx + R * 0.14, my + R * 0.26, mx, my + R * 0.26); ctx.quadraticCurveTo(mx - R * 0.14, my + R * 0.26, mx - R * 0.19, my - R * 0.08); ctx.fill();
      ctx.save(); ctx.clip(); ell(ctx, mx, my + R * 0.24, R * 0.1, R * 0.07, 0, "#FF8FA8"); ctx.restore(); }
    else if (mood === "bingung") { ctx.beginPath(); ctx.moveTo(mx - R * 0.1, my); ctx.quadraticCurveTo(mx - R * 0.03, my - R * 0.06, mx + R * 0.02, my); ctx.quadraticCurveTo(mx + R * 0.07, my + R * 0.06, mx + R * 0.12, my - R * 0.03); ctx.stroke(); }
    else if (mood === "ngantuk" && ((t + ph) % 7.5) < 1.4) { const u = Math.sin(((t + ph) % 7.5) / 1.4 * PI); ell(ctx, mx, my + R * 0.04, R * 0.08 * (0.5 + u), R * 0.13 * u + R * 0.01, 0, MOUTH); }
    else if (mouth === "o") ell(ctx, mx + R * 0.05, my, R * 0.06, R * 0.07, 0, MOUTH);
    else if (mouth === "line" || o.mulut) { ctx.beginPath(); ctx.moveTo(mx - R * 0.08, my); ctx.lineTo(mx + R * 0.08, my); ctx.stroke(); }
    // keringat: di dalam oval wajah, di pelipis; muncul (membesar), meluncur, memudar di ujung
    if (mood === "panik" || mood === "bingung" || o.keringat) {
      const n = mood === "panik" && !side ? 2 : 1, tx = side ? -R * 0.3 : (wrap ? R * 0.56 : R * 0.7);
      for (let i = 0; i < n; i++) { const u = ((t * 0.7 + ph + i * 0.5) % 1), sc = clamp(u / 0.12, 0, 1), a = u > 0.78 ? (1 - u) / 0.22 : 1;
        ctx.save(); ctx.globalAlpha *= a; drop(ctx, cx + (side ? tx : (i ? tx : -tx)), cy - R * 0.36 + u * R * 0.42, Math.max(R * 0.12, 5 / px) * (0.4 + 0.6 * sc)); ctx.restore(); }
    }
    if (mood === "sedih" && o.airmata !== false) { const u = (t * 0.5 + ph) % 1, a = u > 0.75 ? (1 - u) / 0.25 : 1; ctx.save(); ctx.globalAlpha *= a; drop(ctx, xs[0] - R * 0.02, ey + R * 0.2 + u * R * 0.35, Math.max(R * 0.08, 4 / px) * (0.4 + 0.6 * clamp(u / 0.12, 0, 1))); ctx.restore(); }
  }
  function glasses(ctx, o, R, side, fx, fy = 0) {
    if (!o.kacamata) return;
    const px = pxScale(ctx); ctx.strokeStyle = "#3A3058"; ctx.lineWidth = Math.max(R * 0.07, 2 / px); ctx.fillStyle = "rgba(220,240,255,0.22)"; ctx.lineCap = "round";
    const y = fy + R * 0.05;
    if (side) {   // tampak samping: lensa dekat di mata, lensa jauh pipih di tepi wajah, gagang ke telinga
      const x1 = fx + R * 0.12;
      ctx.beginPath(); ctx.ellipse(R * 0.9, y, R * 0.07, R * 0.17, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1 + R * 0.19, y - R * 0.02); ctx.lineTo(R * 0.83, y - R * 0.02); ctx.stroke();
      ctx.beginPath(); ctx.arc(x1, y, R * 0.19, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1 - R * 0.19, y - R * 0.03); ctx.lineTo(-R * 0.1, y - R * 0.08); ctx.stroke();
      return;
    }
    [fx - R * 0.29, fx + R * 0.29].forEach(x => { ctx.beginPath(); ctx.arc(x, y, R * 0.19, 0, TAU); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(fx - R * 0.1, y - R * 0.03); ctx.lineTo(fx + R * 0.1, y - R * 0.03); ctx.stroke(); ctx.beginPath(); ctx.moveTo(fx - R * 0.48, y - R * 0.03); ctx.lineTo(-R * 0.92, y - R * 0.11); ctx.stroke();
  }
  function headWrap(ctx, o, R, mood, view, look, t, ph, mouth, fx) {
    const s = o.hair, side = view === "side", wrapC = s === "hijab" ? o.hijab : o.top, wr = s === "hijab" ? 1.14 : 1.24;
    solid(ctx, () => ctx.arc(side && s === "hood" ? -R * 0.06 : 0, -R * 0.06, R * wr, 0, TAU), wrapC, 0.6);
    const fcx = side ? R * (s === "hood" ? 0.42 : 0.3) : fx * 0.55, fcy = R * 0.12, frx = R * (side ? 0.62 : 0.74), fry = R * 0.84;
    if (s === "hijab") ell(ctx, fcx, fcy - R * 0.04, frx + R * 0.09, fry + R * 0.08, 0, o.ciput || dark(o.hijab, 0.35));
    else ell(ctx, fcx, fcy, frx + R * 0.1, fry + R * 0.1, 0, dark(o.top, 0.35));
    solid(ctx, () => ctx.ellipse(fcx, fcy, frx, fry, 0, 0, TAU), o.skin, 0.35);
    if (s === "hood") {   // wajah dalam bayangan tudung: hanya titik mata redup
      ctx.save(); ctx.beginPath(); ctx.ellipse(fcx, fcy, frx, fry, 0, 0, TAU); ctx.clip();
      const gr = ctx.createLinearGradient(0, fcy - fry, 0, fcy + fry); gr.addColorStop(0, "rgba(22,24,64,0.96)"); gr.addColorStop(0.6, "rgba(30,32,78,0.86)"); gr.addColorStop(1, "rgba(44,46,100,0.66)");
      ctx.fillStyle = gr; ctx.fillRect(-R * 2, -R * 2, R * 4, R * 4); ctx.restore();
      const bt = (t + ph) % 4.1 > 3.96, px = pxScale(ctx), ex = Math.max(R * 0.075, 2.6 / px);
      (side ? [fcx + R * 0.16] : [fcx - R * 0.27, fcx + R * 0.27]).forEach(x => ell(ctx, x + look[0] * R * 0.06, fcy - R * 0.05 + look[1] * R * 0.04, ex, bt ? ex * 0.2 : ex * 0.83, 0, "rgba(214,224,255,0.88)"));
      return;
    }
    features(ctx, o, R, mood, view, look, t, ph, side ? fcx - R * 0.12 : fcx, fcy - R * 0.08, mouth, true);
    glasses(ctx, o, R, side, side ? fcx - R * 0.12 : fcx, fcy - R * 0.08);
    ctx.fillStyle = "rgba(255,255,255,0.14)"; ctx.beginPath(); ctx.ellipse(R * 0.35, -R * 0.84, R * 0.42, R * 0.12, -0.3, 0, TAU); ctx.fill();
  }
  // kepala lengkap di bingkai kepala (pusat 0,0); skipBack = rambut belakang sudah digambar terpisah
  function drawHead(ctx, o, R, mood, view, look, t, ph, mouth, skipBack) {
    const side = view === "side", fx = side ? R * 0.42 : R * 0.2, s = o.hair;
    if (!skipBack) hairBack(ctx, o, R, t, ph, view);
    if (s === "hijab" || s === "hood") return headWrap(ctx, o, R, mood, view, look, t, ph, mouth, fx);
    if (s !== "panjang") ell(ctx, side ? -R * 0.12 : -R * 0.97, R * 0.1, R * 0.17, R * 0.22, 0, dark(o.skin, 0.12));
    solid(ctx, () => ctx.arc(0, 0, R, 0, TAU), o.skin, 0.55);
    hairFront(ctx, o, R, view);
    features(ctx, o, R, mood, view, look, t, ph, fx, 0, mouth, false);
    glasses(ctx, o, R, side, fx);
  }

  // ---------- pakaian ----------
  function torsoPath(ctx, wt, wb, yT, yB) {
    const r1 = wt * 0.42, r2 = Math.min(wb * 0.32, (yB - yT) * 0.3);
    ctx.moveTo(-wt / 2, yT + r1); ctx.quadraticCurveTo(-wt / 2, yT, -wt / 2 + r1, yT); ctx.lineTo(wt / 2 - r1, yT); ctx.quadraticCurveTo(wt / 2, yT, wt / 2, yT + r1);
    ctx.bezierCurveTo(wt / 2 + (wb - wt) * 0.3, lerp(yT, yB, 0.5), wb / 2, yB - r2 * 1.4, wb / 2, yB - r2); ctx.quadraticCurveTo(wb / 2, yB, wb / 2 - r2, yB);
    ctx.lineTo(-wb / 2 + r2, yB); ctx.quadraticCurveTo(-wb / 2, yB, -wb / 2, yB - r2);
    ctx.bezierCurveTo(-wb / 2, yB - r2 * 1.4, -wt / 2 - (wb - wt) * 0.3, lerp(yT, yB, 0.5), -wt / 2, yT + r1); ctx.closePath();
  }
  // daster: satu garis luar utuh dari bahu sampai keliman
  function dressPath(ctx, wt, wb, yT, hemY, hemW, sway) {
    const r1 = wt * 0.42, yH = 0, hw = hemW / 2;
    ctx.moveTo(-wt / 2, yT + r1); ctx.quadraticCurveTo(-wt / 2, yT, -wt / 2 + r1, yT); ctx.lineTo(wt / 2 - r1, yT); ctx.quadraticCurveTo(wt / 2, yT, wt / 2, yT + r1);
    ctx.bezierCurveTo(wt / 2 + (wb - wt) * 0.3, lerp(yT, yH, 0.5), wb / 2, yH - 4, wb / 2, yH);
    ctx.quadraticCurveTo(wb / 2 + 0.3, lerp(yH, hemY, 0.55), hw + sway, hemY - 1.6); ctx.quadraticCurveTo(hw + sway, hemY, hw - 2 + sway, hemY);
    ctx.lineTo(-hw + 2 + sway, hemY); ctx.quadraticCurveTo(-hw + sway, hemY, -hw + sway, hemY - 1.6); ctx.quadraticCurveTo(-wb / 2 - 0.3, lerp(yH, hemY, 0.55), -wb / 2, yH);
    ctx.bezierCurveTo(-wb / 2, yH - 4, -wt / 2 - (wb - wt) * 0.3, lerp(yT, yH, 0.5), -wt / 2, yT + r1); ctx.closePath();
  }
  function motif(ctx, kind, col, x0, y0, x1, y1) {
    if (!kind) return; const c = lite(col, 0.38), c2 = dark(col, 0.2);
    if (kind === "titik") { ctx.fillStyle = c; for (let y = y0, j = 0; y < y1; y += 4.2, j++) for (let x = x0 + (j % 2) * 2.1; x < x1; x += 4.2) { ctx.beginPath(); ctx.arc(x, y, 0.75, 0, TAU); ctx.fill(); } }
    else if (kind === "garis") { ctx.fillStyle = c; for (let y = y0; y < y1; y += 5) ctx.fillRect(x0, y, x1 - x0, 1.6); }
    else if (kind === "kotak") { ctx.fillStyle = c2; for (let y = y0; y < y1; y += 6) ctx.fillRect(x0, y, x1 - x0, 1.8); for (let x = x0; x < x1; x += 6) ctx.fillRect(x, y0, 1.8, y1 - y0); ctx.fillStyle = "rgba(255,255,255,0.12)"; for (let y = y0 + 3; y < y1; y += 6) ctx.fillRect(x0, y, x1 - x0, 0.8); }
    else if (kind === "batik") { ctx.fillStyle = c; for (let y = y0, j = 0; y < y1; y += 6, j++) for (let x = x0 + (j % 2) * 3; x < x1; x += 6) { for (let q = 0; q < 4; q++) { ctx.beginPath(); ctx.ellipse(x + Math.cos(q * PI / 2) * 1.3, y + Math.sin(q * PI / 2) * 1.3, 1.25, 0.6, q * PI / 2, 0, TAU); ctx.fill(); } } }
  }
  function torso(ctx, o, A, p, wt, wb, yT, yB, dress) {
    const fn = dress ? () => dressPath(ctx, wt, wb, yT, dress.hemY, dress.hemW, dress.sway) : () => torsoPath(ctx, wt, wb, yT, yB);
    solid(ctx, fn, o.top, 1);
    ctx.save(); ctx.beginPath(); fn(); ctx.clip();
    motif(ctx, o.motif, o.top, -wb, yT, wb, dress ? dress.hemY : yB);
    if (dress) { ctx.fillStyle = "rgba(26,28,84,0.14)"; ctx.fillRect(-dress.hemW, dress.hemY - 2.2, dress.hemW * 2, 2.2); }
    const side = p.view === "side", cx = side ? 3 : 1.2;
    if (o.outfit === "kaos" || o.outfit === "daster") { ctx.fillStyle = dark(o.top, 0.25); ctx.beginPath(); ctx.ellipse(cx, yT, 4.6, 3.4, 0, 0, PI); ctx.fill(); ell(ctx, cx, yT - 0.6, 3.6, 2.4, 0, dark(o.skin, 0.12)); }
    if (o.outfit === "kemeja") { ctx.fillStyle = dark(o.top, 0.22); ctx.fillRect(cx - 0.5, yT, 1, yB - yT); [0.3, 0.55, 0.8].forEach(f => dot(ctx, cx + 1.4, lerp(yT, yB, f), 0.65, lite(o.top, 0.5)));
      ell(ctx, cx, yT - 0.4, 3, 2.2, 0, dark(o.skin, 0.12));
      ctx.fillStyle = lite(o.top, 0.35); [-1, 1].forEach(k => { ctx.beginPath(); ctx.moveTo(cx, yT + 4.2); ctx.lineTo(cx + k * 5.2, yT - 0.5); ctx.lineTo(cx + k * 1.2, yT - 1); ctx.closePath(); ctx.fill(); }); }
    if (o.outfit === "kebaya") { ctx.fillStyle = lite(o.top, 0.3); ctx.beginPath(); ctx.moveTo(cx - 5, yT); ctx.lineTo(cx, yT + 9); ctx.lineTo(cx + 5, yT); ctx.lineTo(cx + 3.4, yT); ctx.lineTo(cx, yT + 6.4); ctx.lineTo(cx - 3.4, yT); ctx.fill(); }
    if (o.outfit === "hoodie") { ctx.fillStyle = dark(o.top, 0.16); H.rr(ctx, cx - 7, lerp(yT, yB, 0.58), 14, (yB - yT) * 0.28, 3); ctx.fill();
      line(ctx, [[cx - 2, yT + 1], [cx - 2.3, yT + 9]], 0.8, lite(o.top, 0.45)); line(ctx, [[cx + 2, yT + 1], [cx + 2.3, yT + 8]], 0.8, lite(o.top, 0.45)); }
    ctx.restore();
  }
  // rok / sarung berdiri (bingkai dunia, satuan)
  function skirt(ctx, o, A, hipY, bottomY, sway, col) {
    const wt = A.Wb * 0.98, wb = A.Wb * (bottomY > -6 ? 1.12 : 1.06);
    const fn = () => { ctx.moveTo(-wt / 2, hipY - 3); ctx.lineTo(wt / 2, hipY - 3); ctx.quadraticCurveTo(wb / 2 + 0.5, lerp(hipY, bottomY, 0.6), wb / 2 + sway, bottomY - 1.5);
      ctx.quadraticCurveTo(wb / 2 + sway, bottomY, wb / 2 - 2 + sway, bottomY); ctx.lineTo(-wb / 2 + 2 + sway, bottomY); ctx.quadraticCurveTo(-wb / 2 + sway, bottomY, -wb / 2 + sway, bottomY - 1.5);
      ctx.quadraticCurveTo(-wb / 2 - 0.5, lerp(hipY, bottomY, 0.6), -wt / 2, hipY - 3); ctx.closePath(); };
    solid(ctx, fn, col, 1);
    ctx.save(); ctx.beginPath(); fn(); ctx.clip(); motif(ctx, o.bawah === "sarung" ? (o.motifBawah || "kotak") : (o.motifBawah || null), col, -wb, hipY - 3, wb, bottomY);
    ctx.fillStyle = "rgba(26,28,84,0.14)"; ctx.fillRect(-wb, bottomY - 2.2, wb * 2, 2.2); ctx.restore();
  }
  // rok panjang / sarung / daster saat duduk: satu bentuk kain dari pinggul ke lutut lalu jatuh ke pergelangan
  function seatedSkirt(ctx, o, A, hip, knee, ankY, col, kind) {
    const w = A.lw * 0.72, hx = hip[0] - 3, hy = hip[1];
    const fn = () => { ctx.moveTo(hx, hy - w); ctx.lineTo(knee[0], knee[1] - w); ctx.quadraticCurveTo(knee[0] + w * 1.15, knee[1] - w, knee[0] + w * 1.15, knee[1]);
      ctx.lineTo(knee[0] + w * 1.3, ankY - 2.2); ctx.lineTo(knee[0] - w * 1.25, ankY - 2.2); ctx.lineTo(knee[0] - w * 1.05, knee[1] + w); ctx.lineTo(hx, hy + w); ctx.quadraticCurveTo(hx - w, hy, hx, hy - w); ctx.closePath(); };
    solid(ctx, fn, col, 1);
    ctx.save(); ctx.beginPath(); fn(); ctx.clip(); motif(ctx, kind, col, hx - w, hy - w, knee[0] + w * 2, ankY);
    ctx.fillStyle = "rgba(26,28,84,0.14)"; ctx.fillRect(hx - w, ankY - 4.4, knee[0] - hx + w * 3, 2.2); ctx.restore();
  }
  function armCol(o, back) { return { sk: back ? dark(o.skin, 0.14) : o.skin, tc: back ? dark(o.top, 0.16) : o.top }; }
  // part: 'all' | 'upper' | 'fore'
  function arm(ctx, o, A, a, back, part = "all") {
    const { sk, tc } = armCol(o, back), w = A.aw, pts = part === "upper" ? [a.S, a.E] : part === "fore" ? [a.E, a.H] : [a.S, a.E, a.H];
    if (o.lengan === "panjang") { limb(ctx, pts, w, tc); if (part !== "upper") line(ctx, [lerp2(a.E, a.H, 0.84), a.H], w * 0.86, dark(tc, 0.12)); }
    else {
      if (part !== "upper") limb(ctx, part === "fore" ? pts : [lerp2(a.S, a.E, 0.4), a.E, a.H], w * 0.88, sk);
      if (part !== "fore") { if (part === "upper") limb(ctx, [a.S, a.E], w * 0.88, sk); limb(ctx, [a.S, lerp2(a.S, a.E, 0.58)], w * 1.14, tc); }
    }
  }
  function hand(ctx, o, A, h, back) {
    const r = A.aw * 0.64, c = back ? dark(o.skin, 0.14) : o.skin;
    dot(ctx, h[0] - LX * r * 0.25, h[1] - LY * r * 0.25, r, "rgba(26,28,84,0.22)");
    solid(ctx, () => ctx.arc(h[0], h[1], r, 0, TAU), c, Math.min(0.35, r * 0.09), 0.16);
  }
  function legMotif(ctx, kind, col, segs, w) {
    if (!kind) return; ctx.save(); ctx.beginPath(); segs.forEach(([a, b]) => capsule(ctx, a, b, w / 2)); ctx.clip();
    const xs = segs.flat().map(q => q[0]), ys = segs.flat().map(q => q[1]); motif(ctx, kind, col, Math.min(...xs) - w, Math.min(...ys) - w, Math.max(...xs) + w, Math.max(...ys) + w); ctx.restore();
  }
  function shoe(ctx, o, A, ank, back, fwd) {
    const sc = back ? dark(o.sepatu, 0.15) : o.sepatu, w = A.lw;
    ctx.save(); ctx.translate(ank[0], ank[1]); ctx.rotate(fwd || 0); solid(ctx, () => ctx.ellipse(2.2, 0.4, w * 0.78, w * 0.42, 0, 0, TAU), sc, 0.3); ctx.restore();
  }
  function leg(ctx, o, A, hip, knee, ank, back, fwd, noCloth) {
    const sk = back ? dark(o.skin, 0.14) : o.skin, bc = back ? dark(o.bottom, 0.16) : o.bottom, w = A.lw, b = o.bawah;
    const longCover = b === "sarung" || b === "rokPanjang" || b === "daster";
    const clothC = b === "daster" ? (back ? dark(o.top, 0.16) : o.top) : bc;
    const thighC = noCloth ? sk : (b === "celana" || b === "pendek" || longCover ? clothC : sk);
    const shinC = noCloth ? sk : (b === "celana" || longCover ? thighC : sk);
    const wide = longCover && !noCloth ? 1.3 : 1;
    const ws = w * (shinC === sk ? 0.86 : wide), wt = w * (thighC === sk ? 0.92 : wide * 1.04);
    limb(ctx, [knee, ank], ws, shinC, false);
    limb(ctx, [hip, knee], wt, thighC, false);
    const mk = noCloth ? null : b === "sarung" ? (o.motifBawah || "kotak") : b === "daster" ? o.motif : o.motifBawah;
    if (mk) { const segs = []; if (thighC !== sk) segs.push([hip, knee]); if (shinC !== sk) segs.push([knee, ank]); if (segs.length) legMotif(ctx, mk, back ? dark(thighC === sk ? clothC : thighC, 0) : thighC, segs, Math.max(ws, wt)); }
    shoe(ctx, o, A, ank, back, fwd);
  }
  // meja dalam satuan bingkai saat ini: puncak di yTop, dari x0 ke x1, kaki ke yFloor
  function mejaU(ctx, x0, x1, yTop, yFloor, col, th, kain) {
    col = col || "#C98A57"; th = th || 3.6;
    const lg = Math.max(th * 0.7, 2.2); ctx.fillStyle = "rgba(14,18,60,0.22)"; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, yFloor + th * 0.15, (x1 - x0) * 0.52, th * 0.7, 0, 0, TAU); ctx.fill();
    [x0 + th * 1.4, x1 - th * 1.4].forEach(x => limb(ctx, [[x, yTop + th], [x, yFloor - lg * 0.3]], lg, dark(col, 0.18), false));
    solid(ctx, () => H.rr(ctx, x0 + th * 0.6, yTop + th * 0.5, x1 - x0 - th * 1.2, th * 1.6, th * 0.4), dark(col, 0.12), 0.4);
    solid(ctx, () => H.rr(ctx, x0, yTop, x1 - x0, th, th * 0.45), col, 0.5);
    if (kain) { solid(ctx, () => { ctx.moveTo(x0 + th, yTop + th * 0.5); ctx.lineTo(x1 - th, yTop + th * 0.5); ctx.lineTo(x1 - th * 1.4, yTop + th * 2.8); ctx.quadraticCurveTo((x0 + x1) / 2, yTop + th * 3.3, x0 + th * 1.4, yTop + th * 2.8); ctx.closePath(); }, kain, 0.6); }
  }

  // ---------- figur utama ----------
  function draw(ctx, x, y, h, opt) {
    const o = norm(opt), t = o.t || 0, ph = (o.seed * 1.618) % 7;
    if (o.pose === "tidur") return sleep(ctx, x, y, h, o, t, ph);
    const A = AGE[o.age], k = h / A.total, fs = o.flip ? -1 : 1, R = A.R;
    if (o.mejaY != null) o.mejaY = (o.mejaY - y) / k;   // px -> satuan relatif kaki
    const p = pose(o, A, t, ph);
    LX = 0.8 * fs; LY = -0.6;
    const mood = o.face || p.face, look = o.look || p.look, lapis = o.lapis || "semua", body = lapis !== "lengan", arms = lapis !== "badan";
    o.kucek = p.name === "kucek" || (o.blend && o.blend.to === "kucek" && o.blend.k > 0.5);
    ctx.save(); ctx.translate(x, y); ctx.scale(fs * k, k);
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    const lw = A.lw, lt = A.lt, ankY = -lw * 0.35;
    let hipY = p.hipY, legs = null, sY = null, bed = null;
    const longSk = o.bawah === "sarung" || o.bawah === "rokPanjang" || o.bawah === "daster";
    if (p.legs === "walk") {
      const c = p.c, sw = Math.sin(c), cs = Math.cos(c);
      const L1 = fk(1, hipY, sw * 0.42, -(0.08 + 0.75 * Math.max(0, cs)), lt, lt), L2 = fk(-1, hipY, -sw * 0.42, -(0.08 + 0.75 * Math.max(0, -cs)), lt, lt);
      const LF = [L1.S, L1.E, L1.H], LB = [L2.S, L2.E, L2.H];
      const dy = ankY - Math.max(LF[2][1], LB[2][1]); [LF, LB].forEach(L => L.forEach(q => (q[1] += dy))); hipY += dy;
      legs = [[LB, -0.2 * Math.max(0, -cs)], [LF, -0.2 * Math.max(0, cs)]];
    } else if (p.legs === "sit") {
      const hx = p.ox, kx = hx + lt + 2.2;
      sY = hipY + lw * 0.5;
      legs = [[[[hx - 1.5, hipY - 0.6], [kx - 1, hipY - 0.9], [kx - 0.2, ankY]], 0], [[[hx + 1.2, hipY + 0.3], [kx + 1.2, hipY], [kx + 2, ankY]], 0]];
      p.seat = [hx, sY];
    } else {
      legs = [[[[-A.hipX, hipY], [-A.hipX - 0.3, hipY / 2], [-A.hipX - 0.5, ankY]], -0.08], [[[A.hipX, hipY], [A.hipX + 0.3, hipY / 2], [A.hipX + 0.5, ankY]], 0.05]];
    }
    if (body) {
      // bayangan kaki
      ctx.fillStyle = "rgba(14,18,60,0.26)"; ctx.beginPath(); ctx.ellipse(p.legs === "sit" ? p.ox + lt * 0.5 : 0, 0.6, A.Wb * 0.85, 2.6, 0, 0, TAU); ctx.fill();
      // kursi / ranjang
      if (p.legs === "sit" && o.kursi === "ranjang") {
        const wood = o.ranjangCol || "#B07A52", bx1 = p.ox + 11, bx0 = bx1 - (o.ranjangPanjang || 84);
        [bx0 + 4, bx1 - 4].forEach(v => limb(ctx, [[v, sY + 10], [v, -0.8]], 2.8, dark(wood, 0.3), false));
        solid(ctx, () => H.rr(ctx, bx0 - 3, sY - 24, 7, -sY + 23, 3), wood, 0.7);
        solid(ctx, () => H.rr(ctx, bx0, sY + 6, bx1 - bx0, 5.5, 2.4), wood, 0.6);
        solid(ctx, () => H.rr(ctx, bx0 + 1, sY - 1, bx1 - bx0 - 1, 8, 3.2), "#E8ECFA", 0.6);
        solid(ctx, () => ctx.ellipse(bx0 + 13, sY - 4, 11, 4.6, -0.03, 0, TAU), "#F7F2FF", 0.5);
        const bc = o.selimut || "#7C8BEA"; solid(ctx, () => { ctx.moveTo(bx0 + 26, sY - 2); ctx.quadraticCurveTo(lerp(bx0, bx1, 0.55), sY - 4.5, bx1 - 22, sY - 1.5); ctx.lineTo(bx1 - 20, sY + 7.5); ctx.lineTo(bx0 + 26, sY + 7.5); ctx.closePath(); }, bc, 0.7);
        bed = [(bx0 + bx1) / 2, sY - 1];
      } else if (p.legs === "sit" && o.kursi !== false) {
        const sc = o.kursiCol || "#B98457", cx0 = p.ox;
        limb(ctx, [[cx0 - 8.5, sY + 3], [cx0 - 9, -0.6]], 2.4, dark(sc, 0.2), false); limb(ctx, [[cx0 + 8.5, sY + 3], [cx0 + 9, -0.6]], 2.4, dark(sc, 0.2), false);
        solid(ctx, () => H.rr(ctx, cx0 - 12, sY, 24, 4, 2), sc, 0.5);
      }
      // kaki
      if (p.legs === "sit" && longSk) {
        legs.forEach(([L, r], i) => shoe(ctx, o, A, L[2], i === 0, r));
        const col = o.bawah === "daster" ? o.top : o.bottom, kind = o.bawah === "sarung" ? (o.motifBawah || "kotak") : o.bawah === "daster" ? o.motif : o.motifBawah;
        seatedSkirt(ctx, o, A, legs[1][0][0], legs[1][0][1], ankY, col, kind);
      } else legs.forEach(([L, r], i) => leg(ctx, o, A, L[0], L[1], L[2], (i === 0 && p.view !== "q") || (i === 0 && p.legs === "sit"), r, longSk));
      if (p.legs !== "sit" && (o.bawah === "rok" || o.bawah === "sarung" || o.bawah === "rokPanjang")) {
        const bottomY = longSk ? ankY - 2.2 : hipY / 2 + 2, sway = p.legs === "walk" ? Math.sin(p.c) * 1.2 : 0;
        skirt(ctx, o, A, hipY, bottomY, sway, o.bottom);
      }
      if (p.legs === "sit" && o.bawah === "rok") limb(ctx, [[p.ox - 1, hipY], [p.ox + lt * 0.7, hipY + 0.3]], lw * 1.5, o.bottom, false);
    }
    // badan atas
    const ox = p.ox + p.jx, oy = hipY + p.bob;
    const W2 = (u) => { const r = rot(u[0], u[1], p.lean); return [x + fs * k * (ox + r[0]), y + k * (oy + r[1])]; };
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(p.lean);
    const T = A.T, br = 1 + 0.012 * Math.sin(t * 2.1 + ph), hc = headC(A, p.tilt);
    const headGroup = (fn) => { ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(p.tilt); fn(); ctx.restore(); };
    const bm = p.bMode;
    let table = null;
    if (body) {
      if (bm === "behind") { arm(ctx, o, A, p.B, true, arms ? "all" : "upper"); if (arms) hand(ctx, o, A, p.B.H, true); }
      else if (bm === "fore") arm(ctx, o, A, p.B, true, "upper");
      if (["panjang", "kuncir", "hood"].includes(o.hair) || o.sanggul) headGroup(() => hairBack(ctx, o, R, t, ph, p.view));
      if (o.hair !== "hijab") line(ctx, [[0, -T + 3], [hc[0] * 0.5, -T - A.neck - 1]], R * 0.5, dark(o.skin, 0.14));
      ctx.save(); ctx.scale(1, br);
      const dress = o.bawah === "daster" && p.legs !== "sit" ? { hemY: (ankY - 2.2 - oy) / br, hemW: A.Wb * 1.12, sway: p.legs === "walk" ? Math.sin(p.c) * 1.2 : 0 } : null;
      torso(ctx, o, A, p, A.Wt, A.Wb, -T, p.legs === "sit" ? lw * 0.3 : 3, dress);
      ctx.restore();
      const fUnder = o.hair === "hijab";   // lengan atas depan di bawah kerudung
      if (fUnder) arm(ctx, o, A, p.F, false, "upper");
      if (o.hair === "hijab") {   // kerudung menutup bahu dan dada
        const bot = -T + 13 + (o.age === "anak" ? -2 : 0);
        solid(ctx, () => { ctx.moveTo(hc[0] - R * 1.05, hc[1] + 2); ctx.quadraticCurveTo(-A.Wt * 0.6, -T + 1, -A.Wt * 0.52, bot - 4); ctx.quadraticCurveTo(hc[0] * 0.4, bot + 6, A.Wt * 0.52, bot - 4);
          ctx.quadraticCurveTo(A.Wt * 0.6, -T + 1, hc[0] + R * 1.05, hc[1] + 2); ctx.closePath(); }, o.hijab, 1);
      }
      if (o.hair === "hood") solid(ctx, () => { ctx.moveTo(hc[0] - R * 1.1, hc[1]); ctx.quadraticCurveTo(-A.Wt * 0.62, -T + 1, -A.Wt * 0.4, -T + 7); ctx.quadraticCurveTo(0, -T + 10, A.Wt * 0.4, -T + 7); ctx.quadraticCurveTo(A.Wt * 0.62, -T + 1, hc[0] + R * 1.1, hc[1]); ctx.closePath(); }, dark(o.top, 0.08), 0.8);
      headGroup(() => drawHead(ctx, o, R, mood, p.view, look, t, ph, p.mouth, true));
    }
    // meja: menulis (bawaan digambar) / dudukMeja (bawaan tidak; meja bersama digambar adegan)
    if (p.table && p.tableY != null) {
      const ty = p.tableY, own = o.meja != null ? !!o.meja : p.name === "menulis";
      const tx0 = p.name === "menulis" ? p.ox + A.Wt * 0.3 : p.ox - A.Wt * 0.95, tx1 = p.name === "menulis" ? p.ox + A.Wt * 0.3 + 34 : p.ox + A.Wt * 0.95;
      table = [(tx0 + tx1) / 2, ty];
      if (own && body) { ctx.restore(); ctx.save();
        mejaU(ctx, tx0, tx1, ty, 0, o.mejaCol, 3.6);
        if (p.name === "menulis") { ctx.save(); ctx.translate(p.ox + A.Wt * 0.7 + 6, ty - 0.3); ctx.rotate(-0.04); ctx.fillStyle = "#F4F6FF"; ctx.fillRect(-7, -1.1, 15, 1.1); ctx.restore(); }
        ctx.translate(ox, oy); ctx.rotate(p.lean); }
    }
    // lengan depan & benda
    let phoneW = null;
    const drawObj = (a) => {
      const hnd = a.H; ctx.save(); if (p.objA != null) ctx.globalAlpha *= clamp(p.objA * 2, 0, 1);
      if (o.holding) { ctx.translate(hnd[0], hnd[1]); ctx.rotate(p.objRot || 0); ctx.scale(fs, 1); o.holding(ctx, { pose: o.pose, t, unit: k, flip: !!o.flip }); }
      else if (p.obj === "hp") { ctx.translate(hnd[0] + p.objOff[0], hnd[1] + p.objOff[1]); ctx.rotate(p.objRot || 0); ctx.scale(fs, 1);
        phoneU(ctx, { t, ring: o.dering, layar: o.layar !== undefined ? o.layar : p.layar, land: p.land, wajah: o.wajah, glitch: o.glitch });
        const ga = (o.glow === false ? 0 : o.glow === true ? 1 : p.glow) * 0.28; if (ga > 0) D.glow(ctx, 0, -1, 16, P.teal, ga);
        phoneW = W2([hnd[0] + p.objOff[0], hnd[1] + p.objOff[1]]); }
      else if (p.obj === "produk") { ctx.translate(hnd[0] + p.objOff[0], hnd[1] + p.objOff[1]); ctx.rotate(p.objRot || 0); ctx.scale(fs, 1); produk(ctx, o.produkCol); }
      else if (p.obj === "pen") { ctx.translate(hnd[0], hnd[1]); pen(ctx); }
      ctx.restore();
    };
    if (bm === "fore" && arms) arm(ctx, o, A, p.B, true, "fore");
    if (bm === "front" && arms) arm(ctx, o, A, p.B, true, "all");
    if (body && bm === "front" && !arms) arm(ctx, o, A, p.B, true, "upper");
    const fUnder = body && o.hair === "hijab";
    if (body && !fUnder) arm(ctx, o, A, p.F, false, arms ? "all" : "upper"); else if (arms) arm(ctx, o, A, p.F, false, "fore");
    if (arms) {
      if (o.holding || p.obj) drawObj(p.F);
      if (bm !== "behind") hand(ctx, o, A, p.B.H, true);
      hand(ctx, o, A, p.F.H, false);
      // garis bisikan
      if (p.whisper && o.garisBisik !== false) { const hn = p.F.H; ctx.lineCap = "round";
        for (let i = 0; i < 2; i++) { const u = (t * 1.2 + i * 0.5) % 1; ctx.strokeStyle = `rgba(255,244,226,${0.75 * Math.sin(u * PI)})`; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.arc(hn[0] + 1, hn[1], 4.5 + u * 5, -0.55, 0.55); ctx.stroke(); } }
    }
    // tanda tanya
    if (body && (o.tanya || (p.name === "garuk" && o.tanya !== false))) { const u = (t * 0.6 + ph) % 1, hx = hc[0] - R * 1.3, hy = hc[1] - R * 0.9 - u * 3;
      ctx.save(); ctx.globalAlpha *= Math.min(1, Math.sin(u * PI) * 1.6); ctx.translate(hx, hy); ctx.scale(fs, 1); ctx.rotate(-0.15);
      ctx.font = `900 ${R * 1.2}px ${K.FONT}`; ctx.textAlign = "center"; ctx.fillStyle = P.amber; ctx.fillText("?", 0, 0); ctx.restore(); }
    ctx.restore();
    ctx.restore();
    const hcW = W2(hc), U = (q) => [x + fs * k * q[0], y + k * q[1]];
    return { head: hcW, top: [hcW[0], hcW[1] - k * R * 1.05], hand: W2(p.F.H), handB: W2(p.B.H), chest: W2([0, -T * 0.6]), feet: [x, y], scale: k,
      seat: p.seat ? U(p.seat) : null, table: table ? U(table) : null, bed: bed ? U(bed) : null, phone: phoneW };
  }
  // ---------- tidur di kasur (tampak samping); (x, y) = tengah bawah ranjang di lantai ----------
  function sleep(ctx, x, y, h, o, t, ph) {
    const A = AGE[o.age], k = h / A.total, fs = o.flip ? -1 : 1, R = A.R, f = A.total / 92, br = Math.sin(t * 1.5 + ph);
    LX = 0.8 * fs; LY = -0.6;
    ctx.save(); ctx.translate(x, y); ctx.scale(fs * k, k);
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    const X = v => v * f, Q = v => X(v + 9), wood = o.ranjangCol || "#B07A52", mt = -27 * Math.sqrt(f);   // Q: posisi tubuh, digeser 8% lebar ranjang dari sandaran
    ctx.fillStyle = "rgba(14,18,60,0.26)"; ctx.beginPath(); ctx.ellipse(0, 0.6, X(64), 3, 0, 0, TAU); ctx.fill();
    // rangka
    [-54, 52].forEach(v => limb(ctx, [[X(v), -8], [X(v), -1]], 3.2, dark(wood, 0.3), false));
    solid(ctx, () => H.rr(ctx, X(-63), mt - 30, X(8), -mt + 30, 3), wood, 0.7);                // sandaran kepala
    ctx.fillStyle = lite(wood, 0.25); H.rr(ctx, X(-61), mt - 26, X(4), 10, 2); ctx.fill();
    solid(ctx, () => H.rr(ctx, X(-58), mt + 8, X(116), 9, 2.5), wood, 0.6);                      // bingkai
    solid(ctx, () => H.rr(ctx, X(-56), mt, X(112), 10, 4), "#E8ECFA", 0.6);                       // kasur
    solid(ctx, () => ctx.ellipse(Q(-42), mt - 4, X(15), 6.5, -0.04, 0, TAU), "#F7F2FF", 0.5);  // bantal
    // bahu & kepala (sedikit tegak di bantal supaya wajah terbaca)
    solid(ctx, () => ctx.ellipse(Q(-28), mt - 5, 10, 7.5, -0.2, 0, TAU), o.top, 0.7);
    const hx = Q(-40), hy = mt - 6 - R * 0.62 + br * 0.15;
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(-0.62); drawHead(ctx, o, R, o.face || "tidur", "q", [0, 0], t, ph, o.mulut ? "line" : null, false); ctx.restore();
    const bc = o.selimut || "#7C8BEA", c = br * 1.1;
    // guling (di bawah selimut, bagian atasnya menyembul)
    if (o.guling !== false) { ctx.save(); ctx.translate(Q(-12), mt - 15 - c * 0.8); ctx.rotate(-0.08);
      solid(ctx, () => H.rr(ctx, -17, -5.5, 34, 11, 5.5), "#F3EAFB", 0.7); ctx.fillStyle = "#D9CFF0"; ctx.fillRect(-13, -5.5, 1.4, 11); ctx.fillRect(11.6, -5.5, 1.4, 11); ctx.restore(); }
    // selimut
    const fn = () => {
      ctx.moveTo(Q(-34), mt + 9);
      ctx.lineTo(Q(-34), mt - 2);
      ctx.bezierCurveTo(Q(-33), mt - 11 - c, Q(-20), mt - 12 - c, Q(-8), mt - 11 - c * 0.6);
      ctx.bezierCurveTo(X(10), mt - 10, X(18), mt - 12, X(26), mt - 9);
      ctx.bezierCurveTo(X(36), mt - 6, X(42), mt - 13, X(48), mt - 10);
      ctx.bezierCurveTo(X(55), mt - 7, X(57), mt - 3, X(57), mt + 2);
      ctx.lineTo(X(57), mt + 13); ctx.quadraticCurveTo(X(12), mt + 16, Q(-34), mt + 13); ctx.closePath();
    };
    solid(ctx, fn, bc, 1);
    ctx.save(); ctx.beginPath(); fn(); ctx.clip(); ctx.fillStyle = lite(bc, 0.25); for (let v = -16; v < 60; v += 14) ctx.fillRect(X(v), mt - 20, X(4), 40);
    ctx.fillStyle = lite(bc, 0.5); ctx.fillRect(Q(-36), mt - 20, X(8), 40); ctx.restore();
    // lengan memeluk guling, di atas selimut
    if (o.guling !== false) { const yy = mt - 15 - c * 0.8, pts = [[Q(-27), mt - 7], [Q(-19), yy], [Q(-6), yy - 1]];
      if (o.lengan === "panjang") limb(ctx, pts, A.aw * 0.9, o.top);
      else { limb(ctx, pts, A.aw * 0.9, o.skin); limb(ctx, [pts[0], [Q(-24), mt - 10]], A.aw * 1.1, o.top); }
      hand(ctx, o, A, pts[2], false); }
    // Zzz
    if (o.zzz !== false) for (let i = 0; i < 3; i++) {
      const u = (t * 0.45 + i / 3 + ph * 0.1) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(u * PI) * 0.9;
      ctx.translate(hx + 8 + u * 16, hy - 14 - u * 22); ctx.scale(fs, 1); ctx.rotate(-0.2);
      ctx.font = `900 ${7 + u * 6}px ${K.FONT}`; ctx.textAlign = "center"; ctx.fillStyle = P.ink; ctx.fillText("z", 0, 0); ctx.restore();
    }
    ctx.restore();
    return { head: [x + fs * k * hx, y + k * hy], top: [x + fs * k * hx, y + k * (hy - R)], bed: [x, y + k * mt], feet: [x, y], scale: k, hand: [x + fs * k * Q(-6), y + k * (mt - 16)] };
  }

  // ---------- kerumunan ----------
  const TOPS = [P.teal, P.pink, P.amber, "#8E7CF0", "#5BD68A", "#FF8A5B", "#5AA9FF", "#F2F6FF", "#C77DFF", "#FFD38A"];
  const BOTS = ["#3B4785", "#2F3A6E", "#5A4A7A", "#4A5B8F", "#6B4E3D", "#38406E"];
  const HIJ = ["#E0607E", "#8E7CF0", "#3FB8AE", "#F2A65A", "#5AA9FF", "#C2507A"];
  function crowd(ctx, x, y, w, n, opt = {}) {
    const sp = w / n, hh = opt.h || Math.min(sp * 2.3, 420), out = [];
    for (let i = 0; i < n; i++) {
      const r = D.rng((opt.seed || 11) * 977 + i * 131); r(); r();
      const roll = r(), hair = ["pendek", "hijab", "panjang", "pendek", "kuncir", "hijab", "botak", "pendek", "uban", "hijab"][(i * 7 + (opt.seed || 11) + (r() < 0.3 ? 3 : 0)) % 10];
      const age = hair === "uban" ? "lansia" : roll < 0.2 ? "remaja" : "dewasa";
      let o = { age, hair, skin: SKIN[(i * 4 + (opt.seed || 11) + Math.floor(r() * 2)) % SKIN.length], top: TOPS[(i * 3 + (opt.seed || 11)) % TOPS.length], bottom: BOTS[(i * 5 + 1) % BOTS.length], hijab: HIJ[(i * 2 + 1) % HIJ.length],
        outfit: r() < 0.3 ? "kemeja" : "kaos", flip: opt.flip != null ? opt.flip : r() < 0.4, seed: i * 7 + 3, t: opt.t || 0, motif: (i * 3 + (opt.seed || 11)) % 7 === 0 ? "garis" : null };
      if (hair === "hijab" && r() < 0.5) { o.bawah = "rokPanjang"; o.bottom = BOTS[(i + 2) % BOTS.length]; }
      if (o.top === o.hijab) o.hijab = HIJ[(i + 3) % HIJ.length];
      const ge = opt.gesture ? opt.gesture(i) : null;
      if (typeof ge === "string") o.pose = ge; else if (ge) Object.assign(o, ge);
      if (opt.each) o = opt.each(i, o) || o;
      const hs = (age === "remaja" ? 0.94 : age === "lansia" ? 0.92 : 1) * (0.95 + r() * 0.09);
      out.push(draw(ctx, x - w / 2 + sp * (i + 0.5) + (r() - 0.5) * sp * 0.12, y, hh * hs, o));
    }
    return out;
  }

  // ---------- tokoh tetap ----------
  const PRESETS = {
    buRina: { age: "dewasa", hair: "hijab", hijab: "#E0607E", ciput: "#8E3550", skin: SKIN[3], top: "#F2A65A", outfit: "daster", bawah: "daster", motif: "titik", lengan: "panjang", sepatu: "#8E3550", seed: 3 },
    anakRina: { age: "remaja", hair: "pendek", skin: SKIN[2], top: P.teal, outfit: "kaos", bottom: "#3B4785", bawah: "celana", seed: 5 },
    ayah: { age: "dewasa", hair: "pendek", skin: SKIN[4], top: "#5E9BE8", outfit: "kemeja", motif: "batik", bottom: "#3A3F6E", seed: 7 },
    nenek: { age: "lansia", hair: "uban", sanggul: true, skin: SKIN[3], top: "#A58BFF", outfit: "kebaya", lengan: "panjang", bawah: "rokPanjang", bottom: "#B5653C", motifBawah: "batik", sepatu: "#6B4E3D", seed: 9 },
    kakek: { age: "lansia", hair: "uban", peci: true, kacamata: true, skin: SKIN[4], top: "#EDE3C8", outfit: "kemeja", bawah: "sarung", bottom: "#3F8A7A", sepatu: "#6B4E3D", seed: 11 },
    adik: { age: "anak", hair: "kuncir", skin: SKIN[1], top: P.pink, outfit: "kaos", bawah: "rok", bottom: "#5A63C8", sepatu: "#FFD38A", seed: 13 },
    pelaku: { age: "dewasa", hair: "hood", skin: SKIN[2], top: "#4C5286", outfit: "hoodie", bottom: "#2F3462", lengan: "panjang", sepatu: "#2A2E58", seed: 17 },
  };
  const preset = name => Object.assign({}, PRESETS[name] || {});

  // ---------- kepala saja (ikon / close-up) ----------
  function kepala(ctx, cx, cy, r, opt) {
    const o = norm(opt), A = AGE[o.age], R = A.R, sc = r / R, fs = o.flip ? -1 : 1, t = o.t || 0, ph = (o.seed * 1.618) % 7;
    LX = 0.8 * fs; LY = -0.6;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(fs * sc, sc);
    if (o.bahu !== false) {
      const ny = A.neck + R * 0.95;
      const dep = typeof o.bahu === "number" ? o.bahu : 1.1;
      ctx.save(); ctx.beginPath(); ctx.rect(-R * 3, -R * 2, R * 6, ny + R * dep + R * 2); ctx.clip();
      ctx.translate(0, ny - 1 + A.T);
      if (["panjang", "kuncir", "hood"].includes(o.hair) || o.sanggul) { ctx.save(); ctx.translate(0, -A.T - ny + 1); hairBack(ctx, o, R, t, ph, o.view || "q"); ctx.restore(); }
      if (o.hair !== "hijab") line(ctx, [[0, -A.T + 3], [0, -A.T - A.neck - 1]], R * 0.5, dark(o.skin, 0.14));
      torso(ctx, o, A, { view: "q" }, A.Wt, A.Wb, -A.T, 3);
      if (o.hair === "hijab") solid(ctx, () => { const hcy = -A.T + 1 - ny; ctx.moveTo(-R * 1.05, hcy + 2); ctx.quadraticCurveTo(-A.Wt * 0.6, -A.T + 1, -A.Wt * 0.52, -A.T + 9); ctx.quadraticCurveTo(0, -A.T + 19, A.Wt * 0.52, -A.T + 9); ctx.quadraticCurveTo(A.Wt * 0.6, -A.T + 1, R * 1.05, hcy + 2); ctx.closePath(); }, o.hijab, 1);
      if (o.hair === "hood") solid(ctx, () => { const hcy = -A.T + 1 - ny; ctx.moveTo(-R * 1.1, hcy); ctx.quadraticCurveTo(-A.Wt * 0.62, -A.T + 1, -A.Wt * 0.4, -A.T + 7); ctx.quadraticCurveTo(0, -A.T + 10, A.Wt * 0.4, -A.T + 7); ctx.quadraticCurveTo(A.Wt * 0.62, -A.T + 1, R * 1.1, hcy); ctx.closePath(); }, dark(o.top, 0.08), 0.8);
      ctx.restore();
    }
    ctx.rotate(o.tilt || 0);
    drawHead(ctx, o, R, o.face || "netral", o.view || "q", o.look || [0, 0], t, ph, o.mouthStyle, o.bahu !== false && (["panjang", "kuncir", "hood"].includes(o.hair) || !!o.sanggul));
    ctx.restore();
  }
  // HP generik dalam piksel: (x, y) = pusat, size = tinggi (land: size = lebar)
  function hp(ctx, x, y, size, opt = {}) { ctx.save(); ctx.translate(x, y); ctx.rotate(opt.rot || 0); ctx.scale(size / 13, size / 13); const lx = LX, ly = LY; LX = 0.8; LY = -0.6;
    phoneU(ctx, opt); if (opt.glow) D.glow(ctx, 0, 0, 16, P.teal, 0.3); LX = lx; LY = ly; ctx.restore(); }
  // HP di tripod meja + lampu cincin (siaran langsung). (x, y) = tengah kaki tripod, size = tinggi total px. depan: true = layar menghadap penonton
  function hpStand(ctx, x, y, size, opt = {}) {
    const s = size / 64, t = opt.t || 0, lx = LX, ly = LY; LX = 0.8; LY = -0.6;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "rgba(14,18,60,0.24)"; ctx.beginPath(); ctx.ellipse(0, 0.5, 12, 1.8, 0, 0, TAU); ctx.fill();
    [[-10, 0], [10, 0], [2.5, -0.6]].forEach(([fx, fy]) => limb(ctx, [[0, -15], [fx, fy]], 1.6, "#3B3F78", false));
    limb(ctx, [[0, -15], [0, -40]], 1.9, "#4A4F8E", false);
    const cy = -50, fl = 0.92 + 0.08 * Math.sin(t * 3.1);
    D.glow(ctx, 0, cy, 30, "#FFE6B8", 0.5 * fl);
    ctx.lineWidth = 3.2; ctx.strokeStyle = "#CDBFA6"; ctx.beginPath(); ctx.arc(0, cy, 11.2, 0, TAU); ctx.stroke();
    ctx.lineWidth = 2.2; ctx.strokeStyle = `rgba(255,248,232,${fl})`; ctx.beginPath(); ctx.arc(0, cy, 11.2, 0, TAU); ctx.stroke();
    limb(ctx, [[0, -40], [0, cy + 6]], 1.4, "#4A4F8E", false);
    ctx.save(); ctx.translate(0, cy); ctx.scale(0.95, 0.95); phoneU(ctx, Object.assign({ t, back: !opt.depan }, opt.depan ? { layar: opt.layar } : {})); ctx.restore();
    const rp = 0.5 + 0.5 * Math.sin(t * 4); dot(ctx, 0, -36.5, 1.3, P.red); D.glow(ctx, 0, -36.5, 4, P.red, 0.5 * rp);
    ctx.restore(); LX = lx; LY = ly;
    return { phone: [x, y + cy * s], top: [x, y + (cy - 12) * s] };
  }
  // meja bersama dalam piksel: cx tengah, yTop puncak, w lebar, yFloor lantai; opt: col, kain (warna taplak), th (tebal px)
  function meja(ctx, cx, yTop, w, yFloor, opt = {}) {
    const th = opt.th || Math.max(12, w * 0.03), s = th / 3.6, lx = LX, ly = LY; LX = 0.8; LY = -0.6;
    ctx.save(); ctx.translate(cx, yTop); ctx.scale(s, s); mejaU(ctx, -w / 2 / s, w / 2 / s, 0, (yFloor - yTop) / s, opt.col, 3.6, opt.kain); ctx.restore(); LX = lx; LY = ly;
    return { top: yTop, x0: cx - w / 2, x1: cx + w / 2 };
  }
  // puncak meja bawaan (px) untuk figur duduk berkaki di y dengan tinggi h
  function mejaY(y, h, age) { const A = AGE[age] || AGE.dewasa, k = h / A.total; return y + k * (-A.lw * 0.35 - A.lt - A.T * 0.45); }

  // ---------- etalase ----------
  function showcase(ctx, t) {
    const W = 1920, HH = 1080;
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, "#3A4F9C"); gr.addColorStop(1, "#6177C6"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    D.glow(ctx, 1600, 120, 520, P.amber, 0.18); D.glow(ctx, 260, 980, 520, P.teal, 0.12);
    const floor = (y0) => { ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.fillRect(0, y0, W, 46); ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(0, y0, W, 3); };
    const cap = (s, x, y, size = 22, col = P.ink2) => D.txt(ctx, s, x, y, size, { align: "center", weight: 700, color: col });
    D.txt(ctx, "K.kit.orang", 40, 46, 32, { weight: 900 }); D.txt(ctx, "pose (baris 1) · preset, blend, ranjang, tidur, HP (baris 2) · wajah, rambut, kulit, layar HP, kerumunan (baris 3)", 270, 46, 22, { weight: 600, color: P.ink2 });
    // baris 1: semua pose berdiri/duduk
    floor(318);
    const pz = ["berdiri", "jalan", "duduk", "telepon", "pegangHP", "garuk", "panik", "lega", "bisik", "menulis", "kucek", "videoCall", "tunjukBarang", "dudukMeja"];
    const skins = [0, 2, 3, 4, 5, 1, 3, 2, 4, 3, 2, 3, 1, 5], hairs = ["pendek", "kuncir", "hijab", "panjang", "pendek", "botak", "hijab", "pendek", "panjang", "uban", "pendek", "hijab", "kuncir", "pendek"];
    const tops = [P.teal, P.pink, "#8E7CF0", P.amber, "#5BD68A", "#FF8A5B", "#F2F6FF", "#5AA9FF", "#C77DFF", "#FFD38A", P.teal, "#F2A65A", "#FF8A5B", "#5AA9FF"];
    const xs = [62, 186, 300, 420, 540, 660, 790, 915, 1030, 1150, 1300, 1420, 1580, 1770];
    pz.forEach((ps, i) => { const cx = xs[i] - (ps === "menulis" ? 34 : ps === "duduk" || ps === "dudukMeja" ? 12 : ps === "videoCall" || ps === "tunjukBarang" ? 26 : 0);
      if (ps === "dudukMeja") { const my = mejaY(320, 200); draw(ctx, cx, 320, 200, { pose: ps, t, skin: SKIN[skins[i]], hair: hairs[i], top: tops[i], seed: i + 2, mejaY: my, lapis: "badan" });
        meja(ctx, cx - 10, my, 130, 320, {}); draw(ctx, cx, 320, 200, { pose: ps, t, skin: SKIN[skins[i]], hair: hairs[i], top: tops[i], seed: i + 2, mejaY: my, lapis: "lengan" }); }
      else draw(ctx, cx, 320, 200, { pose: ps, t, skin: SKIN[skins[i]], hair: hairs[i], top: tops[i], seed: i + 2, age: ps === "menulis" ? "lansia" : ps === "jalan" || ps === "kucek" ? "remaja" : "dewasa", bawah: hairs[i] === "hijab" ? "rokPanjang" : undefined, bottom: hairs[i] === "hijab" ? "#4A5B8F" : undefined, hijab: HIJ[i % HIJ.length], outfit: i === 4 ? "kemeja" : undefined, sanggul: ps === "menulis" });
      cap(ps, xs[i], 352, ps.length > 9 ? 20 : 22); });
    // baris 2: preset, blend, ranjang, tidur, hpStand
    floor(640);
    const pr = [["buRina", "telepon", "panik"], ["anakRina", "berdiri"], ["ayah", "duduk"], ["nenek", "duduk", "senang"], ["kakek", "jalan"], ["adik", "lega"], ["pelaku", "pegangHP"]];
    pr.forEach(([n, ps, fc], i) => { const o = preset(n); o.pose = ps; o.t = t; if (fc) o.face = fc; if (n === "pelaku") o.flip = true; draw(ctx, 62 + i * 122 - (ps === "duduk" ? 14 : 0), 642, 215, o); cap(n, 62 + i * 122, 676); });
    [0, 0.5, 1].forEach((kk, i) => draw(ctx, 945 + i * 92, 642, 205, Object.assign(preset("buRina"), { pose: "telepon", blend: { to: "pegangHP", k: kk }, t, face: "netral" })));
    cap("blend: telepon → pegangHP", 1037, 670, 19); cap("k = 0 · 0,5 · 1", 1037, 692, 17);
    draw(ctx, 1440, 642, 210, Object.assign(preset("buRina"), { pose: "telepon", kursi: "ranjang", t, face: "panik", layar: "panggilan", dering: true }));
    cap("kursi: 'ranjang'", 1390, 676, 20);
    draw(ctx, 1700, 642, 170, Object.assign(preset("anakRina"), { pose: "tidur", t })); cap("tidur", 1700, 676, 20);
    hpStand(ctx, 1870, 640, 170, { t }); cap("hpStand", 1866, 676, 20);
    // baris 3: wajah
    const fz = ["netral", "panik", "sedih", "senang", "ngantuk", "bingung", "tertawa", "tidur"];
    fz.forEach((f, i) => { kepala(ctx, 52 + i * 92, 745, 34, Object.assign(preset("buRina"), { face: f, t, seed: i, bahu: false })); cap(f, 52 + i * 92, 806, 19); });
    const hz = [["pendek"], ["panjang"], ["hijab"], ["kuncir"], ["uban"], ["botak"], ["hood"], ["kakek", "side"], ["pelaku", "side"]];
    hz.forEach(([hs, v], i) => { const o = PRESETS[hs] ? Object.assign(preset(hs), { face: hs === "kakek" ? "sedih" : "netral" }) : { hair: hs, skin: SKIN[i % 6], top: hs === "hood" ? "#4C5286" : TOPS[i], hijab: "#8E7CF0", sanggul: hs === "uban" };
      kepala(ctx, 48 + i * 80, 880, 30, Object.assign(o, { t, seed: i + 4, view: v || "q" })); cap(hs, 48 + i * 80, 984, 18); if (v) cap("(samping)", 48 + i * 80, 1006, 16); });
    SKIN.forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(782, 732 + i * 50, 17, 0, TAU); ctx.fill(); kepala(ctx, 830, 732 + i * 50, 17, { skin: c, hair: i % 2 ? "botak" : "hijab", hijab: HIJ[i], face: "netral", t, seed: i, bahu: false }); D.txt(ctx, SKIN_NAMA[i], 856, 739 + i * 50, 18, { weight: 600, color: P.ink2 }); });
    // layar HP
    [["chat", true], ["panggilan", "panggilan"], ["bicara", "bicara"], ["video glitch", "video"]].forEach(([nm, l], i) => { hp(ctx, 1020 + i * 82, 790, 120, { t, layar: l, glitch: 0.8, ring: l === "panggilan" }); cap(nm, 1020 + i * 82, 872, 17); });
    hp(ctx, 1400, 790, 130, { t, layar: "video", land: true, glitch: 0.6 }); cap("land: true", 1400, 872, 17);
    // kerumunan: 10 orang, 7 menggaruk kepala
    const garuk = [0, 1, 2, 4, 5, 7, 9];
    floor(1040);
    crowd(ctx, 1480, 1042, 840, 10, { h: 150, t, seed: 4, gesture: i => garuk.includes(i) ? { pose: "garuk", tanya: false } : "berdiri" });
    cap("crowd(10), 7 garuk", 1760, 872, 17);
  }

  K.kit.orang = { draw, crowd, preset, kepala, hp, hpStand, meja, mejaY, SKIN, SKIN_NAMA, POSES, FACES, HAIRS, PRESETS, AGE, showcase };
})(typeof window !== "undefined" ? window : globalThis);
