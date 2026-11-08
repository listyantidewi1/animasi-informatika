/* dokkit/orang.js — figur manusia sederhana ala dokumenter vektor datar (D03 dan seterusnya).
   Kepala bulat, badan kapsul, tungkai bulat pendek, wajah hanya dua mata (alis dan mulut kecil untuk emosi kuat).
   Tanpa garis hitam: pemisahan lewat isi lebih gelap/terang, pinggir terang (rim) dan bayangan lembut.
   API (semua deterministik, waktu t dalam detik):
     K.kit.orang.draw(ctx, x, y, h, opt) -> anchors   (x, y) = tengah kaki di lantai, h = tinggi berdiri (px)
       opt: pose (POSES), face (FACES; bawaan per pose), age dewasa|remaja|anak|lansia, skin (warna atau indeks SKIN), hair (HAIRS),
            top/bottom (warna), outfit kaos|kemeja|daster|hoodie|kebaya, bawah celana|pendek|rok|rokPanjang|sarung|daster, lengan pendek|panjang,
            motif/motifBawah titik|garis|kotak|batik, hijab/ciput (warna), hairCol, sanggul, peci, kacamata, sepatu, flip, t, seed (fase kedip/napas),
            look [x,y], holding(ctx, info) digambar di tangan depan (satuan h/total; HP tinggi ±13), dering, layar, glow, tanya, garisBisik,
            kursi/kursiCol (duduk, menulis), mejaCol, alpha, alis, mulut, pipi, keringat, airmata; tidur: selimut, guling, zzz, ranjangCol
       anchors: head, top, hand, handB, chest, feet, seat, table (tidur: head, bed, hand), scale (px per satuan)
     K.kit.orang.crowd(ctx, x, y, w, n, opt) -> [anchors]
     K.kit.orang.preset(name) -> opt
     K.kit.orang.kepala(ctx, cx, cy, r, opt)          kepala saja (ikon, close-up)
     K.kit.orang.hp(ctx, x, y, size, opt)             HP generik (tinggi = size px)
     K.kit.orang.SKIN, SKIN_NAMA, POSES, FACES, HAIRS, PRESETS */
(function (g) {
  const K = g.Kiko, D = K.dok, H = K.helpers; K.kit = K.kit || {};
  const P = D.P, TAU = Math.PI * 2, PI = Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, u) => a + (b - a) * u;

  const SKIN = ["#F0C9A2", "#E1AC7F", "#CD9165", "#B6794C", "#98613B", "#7A492C"];
  const SKIN_NAMA = ["langsat", "kuning", "sawo terang", "sawo matang", "cokelat", "cokelat tua"];
  const HAIRC = "#2C2233", UBAN = "#DADDE8", EYE = "#221A2C", MOUTH = "#5A2633";
  const POSES = ["berdiri", "jalan", "duduk", "tidur", "telepon", "pegangHP", "garuk", "panik", "lega", "bisik", "menulis"];
  const FACES = ["netral", "panik", "sedih", "senang", "ngantuk", "bingung", "tertawa", "tidur"];
  const HAIRS = ["pendek", "panjang", "hijab", "kuncir", "uban", "botak", "hood"];

  // ---------- warna ----------
  const CC = {};
  const rgb = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  function mix(a, b, f) { const k = a + b + f; if (CC[k]) return CC[k]; const A = rgb(a), B = rgb(b); const r = A.map((v, i) => Math.round(v + (B[i] - v) * f)); return (CC[k] = "#" + ((1 << 24) + (r[0] << 16) + (r[1] << 8) + r[2]).toString(16).slice(1)); }
  const dark = (c, f = 0.22) => mix(c, "#1A1F55", f), lite = (c, f = 0.22) => mix(c, "#FFF4E2", f);

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
  const dot = (ctx, x, y, r, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
  const ell = (ctx, x, y, rx, ry, rot, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU); ctx.fill(); };
  function fk(sx, sy, a1, a2, l1, l2) { const ex = sx + Math.sin(a1) * l1, ey = sy + Math.cos(a1) * l1; return [[sx, sy], [ex, ey], [ex + Math.sin(a1 + a2) * l2, ey + Math.cos(a1 + a2) * l2]]; }
  // IK dua ruas: sudut diukur dari arah bawah, positif ke +x; bend memilih sisi siku
  function ik(sx, sy, tx, ty, l1, l2, bend) {
    let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy); const m = l1 + l2 - 0.05;
    if (d > m) { dx *= m / d; dy *= m / d; d = m; } d = Math.max(d, 0.5);
    const th = Math.atan2(dx, dy), al = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const a = th + bend * al; return [[sx, sy], [sx + Math.sin(a) * l1, sy + Math.cos(a) * l1], [sx + dx, sy + dy]];
  }
  const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  function drop(ctx, x, y, s, col) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y - s);
    ctx.bezierCurveTo(x + s * 0.55, y - s * 0.15, x + s * 0.7, y + s * 0.6, x, y + s * 0.65);
    ctx.bezierCurveTo(x - s * 0.7, y + s * 0.6, x - s * 0.55, y - s * 0.15, x, y - s); ctx.fill();
    dot(ctx, x - s * 0.2, y + s * 0.2, s * 0.16, "rgba(255,255,255,0.75)");
  }

  // ---------- HP generik (satuan: lebar 7, tinggi 13, pusat di 0,0) ----------
  function phoneU(ctx, o = {}) {
    const t = o.t || 0, on = o.on !== false, ring = o.ring ? Math.sin(t * 50) * 0.35 * (Math.sin(t * 5) > 0 ? 1 : 0) : 0;
    ctx.save(); ctx.translate(ring, 0);
    if (o.back) { solid(ctx, () => H.rr(ctx, -3.5, -6.5, 7, 13, 1.6), o.col || "#3B3F78", 0.35); dot(ctx, -1.6, -4.4, 0.8, "#1E2350"); ctx.restore(); return; }
    ctx.fillStyle = o.col || "#30356A"; H.rr(ctx, -3.5, -6.5, 7, 13, 1.6); ctx.fill();
    if (on) { const gr = ctx.createLinearGradient(0, -6, 0, 6); gr.addColorStop(0, o.screen || "#A8FFF2"); gr.addColorStop(1, o.screen2 || P.teal); ctx.fillStyle = gr; }
    else ctx.fillStyle = "#1D2250";
    H.rr(ctx, -2.8, -5.6, 5.6, 11.2, 1.0); ctx.fill();
    if (on) { ctx.fillStyle = "rgba(255,255,255,0.75)"; H.rr(ctx, -1.9, -3.6, 3.8, 1.0, 0.5); ctx.fill(); H.rr(ctx, -1.9, -1.8, 2.6, 1.0, 0.5); ctx.fill();
      dot(ctx, -1.1, 3.6, 0.85, P.green); dot(ctx, 1.1, 3.6, 0.85, P.red); }
    ctx.restore();
  }
  function pen(ctx) { ctx.save(); ctx.rotate(-0.5); ctx.fillStyle = P.amber; H.rr(ctx, -0.8, -8, 1.6, 9, 0.8); ctx.fill(); ctx.fillStyle = "#3A3350"; ctx.beginPath(); ctx.moveTo(-0.8, 1); ctx.lineTo(0.8, 1); ctx.lineTo(0, 2.8); ctx.fill(); ctx.restore(); }

  // ---------- opsi ----------
  function norm(opt) {
    const o = { pose: "berdiri", age: "dewasa", hair: "pendek", skin: SKIN[2], top: P.teal, bottom: "#3B4785", t: 0, seed: 1 };
    for (const key in opt || {}) if (opt[key] !== undefined && opt[key] !== null) o[key] = opt[key];
    if (typeof o.skin === "number") o.skin = SKIN[((o.skin % SKIN.length) + SKIN.length) % SKIN.length];
    if (!AGE[o.age]) o.age = "dewasa";
    o.outfit = o.outfit || (o.hair === "hood" ? "hoodie" : "kaos");
    o.bawah = o.bawah || (o.outfit === "daster" ? "daster" : "celana");
    o.lengan = o.lengan || (["hoodie", "kebaya"].includes(o.outfit) || o.hair === "hijab" ? "panjang" : "pendek");
    o.hairCol = o.hairCol || (o.hair === "uban" ? UBAN : HAIRC);
    o.hijab = o.hijab || P.pink;
    o.sepatu = o.sepatu || "#3A3462";
    return o;
  }

  // ---------- pose ----------
  // Bingkai lokal tubuh atas: titik asal di tengah pinggul, y ke atas negatif. Leher di (0, -T+1).
  function headC(A, tilt) { const d = A.neck + A.R * 0.95; return [Math.sin(tilt) * d, -A.T + 1 - Math.cos(tilt) * d]; }
  function pose(o, A, t, ph) {
    const p = { lean: 0, tilt: 0.03 * Math.sin(t * 0.7 + ph), bob: 0, jx: 0, view: "q", legs: "stand", bFront: false, look: [0, 0], face: "netral", obj: null, objRot: 0 };
    const br = Math.sin(t * 2.1 + ph), T = A.T, R = A.R, sx = A.Wt / 2 - 3.2, sy = -T + 5.5;
    p.SF = [sx, sy]; p.SB = [-sx, sy];
    const hang = () => { p.F = { a: [0.1 + 0.02 * br, -0.14] }; p.B = { a: [-0.1 - 0.02 * br, 0.14] }; };
    hang();
    const hcAt = tilt => headC(A, tilt);
    switch (o.pose) {
      case "jalan": {
        const c = t * PI * (o.speed || 1.7) + ph, sw = Math.sin(c);
        p.view = "side"; p.legs = "walk"; p.c = c; p.lean = 0.05; p.SF = [1.5, sy]; p.SB = [-1.5, sy];
        p.F = { a: [-sw * 0.55, 0.3 + 0.35 * Math.max(0, -sw)] }; p.B = { a: [sw * 0.55, 0.3 + 0.35 * Math.max(0, sw)] };
        p.tilt = 0.02 * Math.sin(c * 2); break;
      }
      case "duduk": p.legs = "sit"; p.F = { to: [A.lt * 0.85, -4 + br * 0.2], bend: 1 }; p.B = { to: [A.lt * 0.55, -5 + br * 0.2], bend: 1 }; p.lean = -0.02; break;
      case "telepon": { p.tilt = 0.1 + 0.02 * br; const h = hcAt(p.tilt); p.F = { to: [h[0] + R * 0.98, h[1] + R * 0.5], bend: -1 };
        p.B = { to: [-A.Wb / 2 - 0.5, -T * 0.28], bend: 1 }; p.obj = "hp"; p.objRot = -0.22; p.objOff = [0.8, -5.2]; p.face = "netral"; break; }
      case "pegangHP": { p.tilt = 0.12; p.look = [0.5, 0.9]; p.F = { to: [A.Wt * 0.36, -T * 0.6 + br * 0.3], bend: 1 }; p.B = { to: [A.Wt * 0.16, -T * 0.52 + br * 0.3], bend: 1 }; p.bFront = true;
        p.obj = "hp"; p.objRot = -0.15; p.objOff = [0.5, -4.5]; p.glow = true; break; }
      case "garuk": { p.tilt = 0.08 + 0.02 * br; const h = hcAt(p.tilt); p.F = { to: [h[0] + R * 0.5 + Math.sin(t * 15) * 1.1, h[1] - R * 0.78 + Math.cos(t * 15) * 0.5], bend: -1 };
        p.face = "bingung"; p.look = [0.6, -0.6]; break; }
      case "panik": { p.tilt = 0.02 * Math.sin(t * 9); p.jx = Math.sin(t * 37 + ph) * 0.45; const h = hcAt(p.tilt);
        const sh = Math.sin(t * 31 + ph) * 0.7;
        p.F = { to: [h[0] + R * 1.38, h[1] + R * 0.05 + sh], bend: -1 }; p.B = { to: [h[0] - R * 1.38, h[1] + R * 0.05 - sh], bend: 1 }; p.bFront = true; p.face = "panik"; break; }
      case "lega": { const lf = Math.abs(Math.sin(t * 8 + ph)); p.tilt = -0.13 - 0.04 * lf; p.lean = -0.04; p.bob = -lf * 1.1;
        p.F = { to: [A.Wt * 0.16, -T * 0.32], bend: -1 }; p.B = { to: [A.Wt * 0.0, -T * 0.52], bend: 1 }; p.bFront = true; p.face = "tertawa"; break; }
      case "bisik": { p.lean = 0.1; p.tilt = 0.1 + 0.02 * br; const h = hcAt(p.tilt); p.F = { to: [h[0] + R * 0.86, h[1] + R * 0.52], bend: -1 }; p.face = "netral"; p.look = [1, 0]; p.mouth = "o"; p.whisper = h; break; }
      case "menulis": { p.legs = "sit"; p.lean = 0.12; p.tilt = 0.2; p.look = [0.4, 1]; p.table = true;
        p.Fw = [A.lt + 5 + Math.sin(t * 7 + ph) * 1.4 + Math.sin(t * 1.3) * 2, -T * 0.4 - 1]; p.Bw = [A.lt * 0.75, -T * 0.4 - 0.5]; p.bFront = true; p.obj = "pen"; break; }
    }
    if (A.hunch) { p.lean += A.hunch; p.tilt += A.hunch * 0.6; }
    return p;
  }

  // ---------- kepala (bingkai kepala: pusat 0,0, satuan R) ----------
  function hairBack(ctx, o, R, t, ph, view) {
    const hc = o.hairCol, s = o.hair;
    if (s === "panjang") solid(ctx, () => H.rr(ctx, -R * 1.1, -R * 0.55, R * 2.1, R * 2.05, R * 0.95), dark(hc, 0.08), 0.5, 0.1);
    if (s === "kuncir") { const a = 0.35 + Math.sin(t * 2.4 + ph) * 0.12; ctx.save(); ctx.translate(-R * 0.86, -R * 0.42); ctx.rotate(a);
      solid(ctx, () => ctx.ellipse(-R * 0.2, R * 0.55, R * 0.32, R * 0.62, 0.15, 0, TAU), hc, 0.4, 0.12); ell(ctx, 0, 0, R * 0.16, R * 0.16, 0, P.pink); ctx.restore(); }
    if (o.sanggul) solid(ctx, () => ctx.arc(-R * 0.82, -R * 0.62, R * 0.42, 0, TAU), hc, 0.4);
    if (s === "hood") solid(ctx, () => ctx.arc(-R * 0.08, -R * 0.02, R * 1.28, 0, TAU), dark(o.top, 0.12), 0.6);
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
      ctx.fillStyle = "rgba(255,255,255,0.13)"; ctx.beginPath(); ctx.ellipse(R * 0.25, -R * 0.78, R * 0.38, R * 0.1, -0.2, 0, TAU); ctx.fill();
    } else if (s === "uban") {
      solid(ctx, () => {
        ctx.moveTo(-R * 1.03, R * 0.2); ctx.arc(0, 0, R * 1.04, PI * 0.97, PI * 1.55);
        ctx.quadraticCurveTo(-R * 0.25, -R * 0.66, -R * 0.6, -R * 0.45); ctx.quadraticCurveTo(-R * 0.82, -R * 0.2, -R * 0.78, R * 0.18); ctx.closePath();
        if (!side) { ctx.moveTo(R * 1.02, R * 0.05); ctx.arc(0, 0, R * 1.04, PI * 2.01, PI * 1.82, true); ctx.quadraticCurveTo(R * 0.86, -R * 0.2, R * 0.9, R * 0.08); ctx.closePath(); }
      }, hc, 0.45);
    } else if (s === "botak") {
      ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.ellipse(R * 0.3, -R * 0.62, R * 0.3, R * 0.14, -0.4, 0, TAU); ctx.fill();
      ctx.fillStyle = dark(HAIRC, 0); ctx.globalAlpha *= 0.8; ctx.beginPath(); ctx.ellipse(-R * 0.92, R * 0.0, R * 0.14, R * 0.34, 0.1, 0, TAU); ctx.fill(); ctx.globalAlpha /= 0.8;
    }
    if (o.peci) { solid(ctx, () => { ctx.moveTo(-R * 0.82, -R * 0.55); ctx.lineTo(-R * 0.76, -R * 1.18); ctx.quadraticCurveTo(0, -R * 1.32, R * 0.76, -R * 1.18); ctx.lineTo(R * 0.82, -R * 0.55); ctx.quadraticCurveTo(0, -R * 0.68, -R * 0.82, -R * 0.55); }, o.peci === true ? "#2E2B48" : o.peci, 0.4);
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(-R * 0.78, -R * 0.82, R * 1.56, R * 0.07); }
  }
  function features(ctx, o, R, mood, view, look, t, ph, cx, cy, mouth) {
    const side = view === "side", es = R * 0.29, xs = side ? [cx + R * 0.12] : [cx - es, cx + es];
    const lx = look[0] * R * 0.07, ly = look[1] * R * 0.06;
    const bt = (t + ph * 0.9) % 3.7, blink = bt > 3.56 || (mood === "ngantuk" && bt > 2.6);
    ctx.lineCap = "round"; ctx.strokeStyle = EYE; ctx.fillStyle = EYE; ctx.lineWidth = R * 0.075;
    const browC = o.hair === "uban" ? "#8A8496" : o.hair === "hijab" || o.hair === "botak" ? dark(o.skin, 0.62) : mix(o.hairCol, "#000000", 0.1);
    const ey = cy + R * 0.04;
    xs.forEach((x, i) => {
      const k = side ? 1 : (i === 0 ? -1 : 1);       // -1 = mata kiri, 1 = mata kanan
      ctx.fillStyle = EYE; ctx.strokeStyle = EYE; ctx.lineWidth = R * 0.075;
      if (mood === "senang" || mood === "tertawa") { ctx.beginPath(); ctx.arc(x, ey + R * 0.05, R * 0.1, PI * 1.12, PI * 1.88); ctx.stroke(); }
      else if (mood === "tidur") { ctx.beginPath(); ctx.arc(x, ey - R * 0.04, R * 0.1, PI * 0.12, PI * 0.88); ctx.stroke(); }
      else if (blink) { ctx.beginPath(); ctx.moveTo(x - R * 0.09, ey + R * 0.02); ctx.lineTo(x + R * 0.09, ey + R * 0.02); ctx.stroke(); }
      else if (mood === "ngantuk") { ctx.beginPath(); ctx.ellipse(x + lx * 0.5, ey + R * 0.02, R * 0.09, R * 0.075, 0, 0, PI); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x - R * 0.12, ey + R * 0.02); ctx.lineTo(x + R * 0.12, ey + R * 0.02); ctx.stroke(); }
      else { const big = mood === "panik" ? 1.3 : 1, sm = mood === "sedih" ? 0.9 : 1;
        if (mood === "panik") ell(ctx, x, ey, R * 0.15, R * 0.19, 0, "#FFFFFF");
        ell(ctx, x + lx, ey + ly + (mood === "sedih" ? R * 0.03 : 0), R * 0.083 * big * sm, R * 0.115 * big * sm, 0, EYE);
        dot(ctx, x + lx - R * 0.025, ey + ly - R * 0.04, R * 0.026, "rgba(255,255,255,0.9)"); }
      // alis
      if (o.alis === false && mood === "netral") return;
      ctx.strokeStyle = browC; ctx.lineWidth = R * 0.075; ctx.beginPath();
      const by = ey - R * 0.27;
      if (mood === "panik") { ctx.moveTo(x - k * R * 0.1, by - R * 0.13); ctx.lineTo(x + k * R * 0.12, by - R * 0.02); }
      else if (mood === "sedih") { ctx.moveTo(x - k * R * 0.1, by - R * 0.04); ctx.lineTo(x + k * R * 0.12, by + R * 0.07); }
      else if (mood === "senang" || mood === "tertawa") { ctx.arc(x, by + R * 0.02, R * 0.12, PI * 1.2, PI * 1.8); }
      else if (mood === "ngantuk") { ctx.moveTo(x - R * 0.12, by + R * 0.07); ctx.lineTo(x + R * 0.1, by + R * 0.08); }
      else if (mood === "bingung") { if (k > 0) { ctx.arc(x, by - R * 0.02, R * 0.13, PI * 1.15, PI * 1.85); } else { ctx.moveTo(x - R * 0.11, by + R * 0.07); ctx.lineTo(x + R * 0.1, by + R * 0.04); } }
      else if (mood === "tidur") { ctx.moveTo(x - R * 0.1, by + R * 0.06); ctx.lineTo(x + R * 0.1, by + R * 0.06); }
      else { ctx.moveTo(x - R * 0.1, by + R * 0.01); ctx.quadraticCurveTo(x, by - R * 0.04, x + R * 0.1, by + R * 0.01); }
      ctx.stroke();
    });
    // pipi
    if (mood === "senang" || mood === "tertawa" || o.pipi) { ctx.fillStyle = "rgba(255,111,145,0.32)"; (side ? [cx + R * 0.15] : [cx - R * 0.42, cx + R * 0.42]).forEach(x => { ctx.beginPath(); ctx.ellipse(x, ey + R * 0.25, R * 0.13, R * 0.08, 0, 0, TAU); ctx.fill(); }); }
    // mulut
    const mx = cx + (side ? R * 0.22 : R * 0.02), my = cy + R * 0.42;
    ctx.strokeStyle = MOUTH; ctx.fillStyle = MOUTH; ctx.lineWidth = R * 0.065;
    if (mood === "panik") ell(ctx, mx, my, R * 0.09, R * (0.12 + 0.02 * Math.sin(t * 18)), 0, MOUTH);
    else if (mood === "sedih") { ctx.beginPath(); ctx.arc(mx, my + R * 0.1, R * 0.11, PI * 1.2, PI * 1.8); ctx.stroke(); }
    else if (mood === "senang") { ctx.beginPath(); ctx.arc(mx, my - R * 0.12, R * 0.15, PI * 0.22, PI * 0.78); ctx.stroke(); }
    else if (mood === "tertawa") { ctx.beginPath(); ctx.moveTo(mx - R * 0.19, my - R * 0.08); ctx.quadraticCurveTo(mx, my - R * 0.02, mx + R * 0.19, my - R * 0.08); ctx.quadraticCurveTo(mx + R * 0.14, my + R * 0.26, mx, my + R * 0.26); ctx.quadraticCurveTo(mx - R * 0.14, my + R * 0.26, mx - R * 0.19, my - R * 0.08); ctx.fill();
      ctx.save(); ctx.clip(); ell(ctx, mx, my + R * 0.24, R * 0.1, R * 0.07, 0, "#FF8FA8"); ctx.restore(); }
    else if (mood === "bingung") { ctx.beginPath(); ctx.moveTo(mx - R * 0.1, my); ctx.quadraticCurveTo(mx - R * 0.03, my - R * 0.06, mx + R * 0.02, my); ctx.quadraticCurveTo(mx + R * 0.07, my + R * 0.06, mx + R * 0.12, my - R * 0.03); ctx.stroke(); }
    else if (mood === "ngantuk" && ((t + ph) % 7.5) < 1.4) { const u = Math.sin(((t + ph) % 7.5) / 1.4 * PI); ell(ctx, mx, my + R * 0.04, R * 0.08 * (0.5 + u), R * 0.13 * u + R * 0.01, 0, MOUTH); }
    else if (mouth === "o") ell(ctx, mx + R * 0.05, my, R * 0.06, R * 0.07, 0, MOUTH);
    else if (mouth === "line" || o.mulut) { ctx.beginPath(); ctx.moveTo(mx - R * 0.08, my); ctx.lineTo(mx + R * 0.08, my); ctx.stroke(); }
    // keringat / air mata
    if (mood === "panik" || mood === "bingung" || o.keringat) {
      const n = mood === "panik" ? 2 : 1;
      for (let i = 0; i < n; i++) { const u = ((t * 0.7 + ph + i * 0.5) % 1); ctx.save(); ctx.globalAlpha *= Math.sin(u * PI);
        drop(ctx, (i ? cx + R * 0.95 : cx - R * 0.98) , cy - R * 0.45 + u * R * 0.55, R * 0.13, "#9FE6FF"); ctx.restore(); }
    }
    if (mood === "sedih" && o.airmata !== false) { const u = (t * 0.5 + ph) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(u * PI); drop(ctx, xs[0] - R * 0.02, ey + R * 0.2 + u * R * 0.35, R * 0.08, "#9FE6FF"); ctx.restore(); }
  }
  function glasses(ctx, o, R, side, fx) {
    if (!o.kacamata) return;
    ctx.strokeStyle = "#3A3058"; ctx.lineWidth = R * 0.07; ctx.fillStyle = "rgba(220,240,255,0.22)";
    const xs = side ? [fx + R * 0.12] : [fx - R * 0.29, fx + R * 0.29];
    xs.forEach(x => { ctx.beginPath(); ctx.arc(x, R * 0.05, R * 0.19, 0, TAU); ctx.fill(); ctx.stroke(); });
    if (side) { ctx.beginPath(); ctx.moveTo(xs[0] - R * 0.19, R * 0.02); ctx.lineTo(-R * 0.05, -R * 0.02); ctx.stroke(); }
    if (!side) { ctx.beginPath(); ctx.moveTo(fx - R * 0.1, R * 0.02); ctx.lineTo(fx + R * 0.1, R * 0.02); ctx.stroke(); ctx.beginPath(); ctx.moveTo(fx - R * 0.48, R * 0.02); ctx.lineTo(-R * 0.92, -R * 0.06); ctx.stroke(); }
  }
  function headWrap(ctx, o, R, mood, view, look, t, ph, mouth, fx) {
    const s = o.hair, wrapC = s === "hijab" ? o.hijab : o.top, wr = s === "hijab" ? 1.14 : 1.24;
    solid(ctx, () => ctx.arc(0, -R * 0.06, R * wr, 0, TAU), wrapC, 0.6);
    const fcx = fx * 0.55, fcy = R * 0.12, frx = R * 0.74, fry = R * 0.84;
    if (s === "hijab") ell(ctx, fcx, fcy - R * 0.04, frx + R * 0.09, fry + R * 0.08, 0, o.ciput || dark(o.hijab, 0.35));
    else ell(ctx, fcx, fcy, frx + R * 0.1, fry + R * 0.1, 0, dark(o.top, 0.35));
    solid(ctx, () => ctx.ellipse(fcx, fcy, frx, fry, 0, 0, TAU), o.skin, 0.35);
    if (s === "hood") {   // wajah dalam bayangan tudung: hanya dua titik mata redup
      ctx.save(); ctx.beginPath(); ctx.ellipse(fcx, fcy, frx, fry, 0, 0, TAU); ctx.clip();
      const gr = ctx.createLinearGradient(0, fcy - fry, 0, fcy + fry); gr.addColorStop(0, "rgba(22,24,64,0.96)"); gr.addColorStop(0.6, "rgba(30,32,78,0.86)"); gr.addColorStop(1, "rgba(44,46,100,0.66)");
      ctx.fillStyle = gr; ctx.fillRect(-R * 2, -R * 2, R * 4, R * 4); ctx.restore();
      const bt = (t + ph) % 4.1 > 3.96;
      [-1, 1].forEach(k => ell(ctx, fcx + k * R * 0.27 + look[0] * R * 0.06, fcy - R * 0.05 + look[1] * R * 0.04, R * 0.075, bt ? R * 0.015 : R * 0.062, 0, "rgba(214,224,255,0.88)"));
      return;
    }
    features(ctx, o, R, mood, view, look, t, ph, fcx, fcy - R * 0.08, mouth);
    glasses(ctx, o, R, view === "side", fcx);
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
    features(ctx, o, R, mood, view, look, t, ph, fx, 0, mouth);
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
  function motif(ctx, kind, col, x0, y0, x1, y1) {
    if (!kind) return; const c = lite(col, 0.38), c2 = dark(col, 0.2);
    if (kind === "titik") { ctx.fillStyle = c; for (let y = y0, j = 0; y < y1; y += 4.2, j++) for (let x = x0 + (j % 2) * 2.1; x < x1; x += 4.2) { ctx.beginPath(); ctx.arc(x, y, 0.75, 0, TAU); ctx.fill(); } }
    else if (kind === "garis") { ctx.fillStyle = c; for (let y = y0; y < y1; y += 5) ctx.fillRect(x0, y, x1 - x0, 1.6); }
    else if (kind === "kotak") { ctx.fillStyle = c2; for (let y = y0; y < y1; y += 6) ctx.fillRect(x0, y, x1 - x0, 1.8); for (let x = x0; x < x1; x += 6) ctx.fillRect(x, y0, 1.8, y1 - y0); ctx.fillStyle = "rgba(255,255,255,0.12)"; for (let y = y0 + 3; y < y1; y += 6) ctx.fillRect(x0, y, x1 - x0, 0.8); }
    else if (kind === "batik") { ctx.fillStyle = c; for (let y = y0, j = 0; y < y1; y += 6, j++) for (let x = x0 + (j % 2) * 3; x < x1; x += 6) { for (let q = 0; q < 4; q++) { ctx.beginPath(); ctx.ellipse(x + Math.cos(q * PI / 2) * 1.3, y + Math.sin(q * PI / 2) * 1.3, 1.25, 0.6, q * PI / 2, 0, TAU); ctx.fill(); } } }
  }
  function torso(ctx, o, A, p, wt, wb, yT, yB) {
    const fn = () => torsoPath(ctx, wt, wb, yT, yB);
    solid(ctx, fn, o.top, 1);
    ctx.save(); ctx.beginPath(); fn(); ctx.clip();
    motif(ctx, o.motif, o.top, -wb, yT, wb, yB);
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
  // rok / sarung / bagian bawah daster (bingkai dunia, satuan)
  function skirt(ctx, o, A, hipY, bottomY, sway, col) {
    const wt = A.Wb * 0.98, wb = A.Wb * (bottomY > -6 ? 1.12 : 1.06);
    const fn = () => { ctx.moveTo(-wt / 2, hipY - 3); ctx.lineTo(wt / 2, hipY - 3); ctx.quadraticCurveTo(wb / 2 + 0.5, lerp(hipY, bottomY, 0.6), wb / 2 + sway, bottomY - 1.5);
      ctx.quadraticCurveTo(wb / 2 + sway, bottomY, wb / 2 - 2 + sway, bottomY); ctx.lineTo(-wb / 2 + 2 + sway, bottomY); ctx.quadraticCurveTo(-wb / 2 + sway, bottomY, -wb / 2 + sway, bottomY - 1.5);
      ctx.quadraticCurveTo(-wb / 2 - 0.5, lerp(hipY, bottomY, 0.6), -wt / 2, hipY - 3); ctx.closePath(); };
    solid(ctx, fn, col, 1);
    ctx.save(); ctx.beginPath(); fn(); ctx.clip(); motif(ctx, o.bawah === "sarung" ? (o.motifBawah || "kotak") : (o.motifBawah || (o.bawah === "daster" ? o.motif : null)), col, -wb, hipY - 3, wb, bottomY);
    ctx.fillStyle = "rgba(26,28,84,0.14)"; ctx.fillRect(-wb, bottomY - 2.2, wb * 2, 2.2); ctx.restore();
  }
  function arm(ctx, o, A, pts, back) {
    const sk = back ? dark(o.skin, 0.14) : o.skin, tc = back ? dark(o.top, 0.16) : o.top, w = A.aw;
    ctx.save(); ctx.translate(-LX * 1.3, -LY * 1.3); line(ctx, pts, w * 0.96, "rgba(26,28,84,0.26)"); ctx.restore();
    if (o.lengan === "panjang") { line(ctx, pts, w, tc); const [e, h] = [pts[1], pts[2]]; line(ctx, [[lerp(e[0], h[0], 0.82), lerp(e[1], h[1], 0.82)], h], w * 0.92, dark(tc, 0.12)); }
    else { line(ctx, pts, w * 0.88, sk); const s = pts[0], e = pts[1]; line(ctx, [s, [lerp(s[0], e[0], 0.58), lerp(s[1], e[1], 0.58)]], w * 1.14, tc); }
  }
  function hand(ctx, o, A, h, back) {
    const r = A.aw * 0.64, c = back ? dark(o.skin, 0.14) : o.skin;
    dot(ctx, h[0] - LX * 1.1, h[1] - LY * 1.1, r, "rgba(26,28,84,0.26)"); dot(ctx, h[0], h[1], r, c);
    dot(ctx, h[0] + LX * r * 0.3, h[1] + LY * r * 0.3, r * 0.45, "rgba(255,242,222,0.18)");
  }
  function leg(ctx, o, A, hip, knee, ank, back, fwd) {
    const sk = back ? dark(o.skin, 0.14) : o.skin, bc = back ? dark(o.bottom, 0.16) : o.bottom, w = A.lw, b = o.bawah;
    const longCover = b === "sarung" || b === "rokPanjang" || b === "daster";
    const thighC = b === "celana" || b === "pendek" || longCover ? (b === "daster" ? (back ? dark(o.top, 0.16) : o.top) : bc) : sk;
    const shinC = b === "celana" || longCover ? thighC : sk;
    const wide = longCover ? 1.3 : 1;
    line(ctx, [knee, ank], w * (shinC === sk ? 0.86 : wide), shinC);
    line(ctx, [hip, knee], w * (thighC === sk ? 0.92 : wide * 1.04), thighC);
    // sepatu/sandal
    const sc = back ? dark(o.sepatu, 0.15) : o.sepatu;
    ctx.save(); ctx.translate(ank[0], ank[1]); ctx.rotate(fwd || 0); solid(ctx, () => ctx.ellipse(2.2, 0.4, w * 0.78, w * 0.42, 0, 0, TAU), sc, 0.3); ctx.restore();
  }

  // ---------- figur utama ----------
  function draw(ctx, x, y, h, opt) {
    const o = norm(opt), t = o.t || 0, ph = (o.seed * 1.618) % 7;
    if (o.pose === "tidur") return sleep(ctx, x, y, h, o, t, ph);
    const A = AGE[o.age], k = h / A.total, fs = o.flip ? -1 : 1, p = pose(o, A, t, ph), R = A.R;
    LX = 0.8 * fs; LY = -0.6;
    const mood = o.face || p.face, look = o.look || p.look;
    ctx.save(); ctx.translate(x, y); ctx.scale(fs * k, k);
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    // bayangan kaki
    ctx.fillStyle = "rgba(14,18,60,0.26)"; ctx.beginPath(); ctx.ellipse(p.legs === "sit" ? A.lt * 0.6 : 0, 0.6, A.Wb * 0.85, 2.6, 0, 0, TAU); ctx.fill();
    // kaki
    const lw = A.lw, lt = A.lt, ankY = -lw * 0.35;
    let hipY = -A.L, legs;
    if (p.legs === "walk") {
      const c = p.c, sw = Math.sin(c), cs = Math.cos(c);
      const LF = fk(1, hipY, sw * 0.42, -(0.08 + 0.75 * Math.max(0, cs)), lt, lt), LB = fk(-1, hipY, -sw * 0.42, -(0.08 + 0.75 * Math.max(0, -cs)), lt, lt);
      const dy = ankY - Math.max(LF[2][1], LB[2][1]); [LF, LB].forEach(L => L.forEach(q => (q[1] += dy))); hipY += dy;
      legs = [[LB, -0.2 * Math.max(0, -cs)], [LF, -0.2 * Math.max(0, cs)]];
    } else if (p.legs === "sit") {
      hipY = ankY - lt; const sY = hipY + lw * 0.45;
      if (o.kursi !== false) { const sc = o.kursiCol || "#B98457"; line(ctx, [[-9, sY], [-8, 0]], 2.4, dark(sc, 0.2)); line(ctx, [[8, sY], [7.5, 0]], 2.4, dark(sc, 0.2)); solid(ctx, () => H.rr(ctx, -13, sY, 26, 4, 2), sc, 0.5); }
      legs = [[[[-1.5, hipY], [-1.5 + lt, hipY + 0.5], [-1.5 + lt + 0.6, ankY]], 0], [[[1.8, hipY], [1.8 + lt, hipY + 0.5], [1.8 + lt + 0.6, ankY]], 0]];
      p.seat = [0, sY];
    } else {
      const b1 = Math.sin(t * 2.1 + ph) * 0.15;
      legs = [[[[-A.hipX, hipY], [-A.hipX - 0.3, hipY / 2], [-A.hipX - 0.5, ankY]], -0.08], [[[A.hipX, hipY], [A.hipX + 0.3 + b1 * 0, hipY / 2], [A.hipX + 0.5, ankY]], 0.05]];
    }
    const longSk = o.bawah === "sarung" || o.bawah === "rokPanjang" || o.bawah === "daster";
    legs.forEach(([L, r], i) => leg(ctx, o, A, L[0], L[1], L[2], i === 0 && p.view !== "q" || (i === 0 && p.legs === "sit"), r));
    if (p.legs !== "sit" && (longSk || o.bawah === "rok")) {
      const bottomY = longSk ? ankY - 2.2 : hipY / 2 + 2, sway = p.legs === "walk" ? Math.sin(p.c) * 1.2 : 0;
      skirt(ctx, o, A, hipY, bottomY, sway, o.bawah === "daster" ? o.top : o.bottom);
    }
    if (p.legs === "sit" && o.bawah === "rok") { line(ctx, [[-1, hipY], [lt * 0.7, hipY + 0.5]], lw * 1.5, o.bottom); }
    // badan atas
    const ox = p.jx, oy = hipY + p.bob;
    const W2 = (u) => { const r = rot(u[0], u[1], p.lean); return [x + fs * k * (ox + r[0]), y + k * (oy + r[1])]; };
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(p.lean);
    const T = A.T, br = 1 + 0.012 * Math.sin(t * 2.1 + ph), hc = headC(A, p.tilt), toLocal = (wx, wy) => rot(wx - ox, wy - oy, -p.lean);
    // lengan: tentukan titik
    const armPts = (spec, S, bendDef) => spec.to ? ik(S[0], S[1], spec.to[0], spec.to[1], A.ua, A.fa, spec.bend || bendDef) : fk(S[0], S[1], spec.a[0], spec.a[1], A.ua, A.fa);
    // menulis: titik tangan di meja (relatif pinggul, bingkai dunia) -> bingkai lokal
    if (p.table) { p.F = { to: toLocal(p.Fw[0], hipY + p.Fw[1]), bend: -1 }; p.B = { to: toLocal(p.Bw[0], hipY + p.Bw[1]), bend: -1 }; }
    const ptsF = armPts(p.F, p.SF, -1), ptsB = armPts(p.B, p.SB, 1);
    if (!p.bFront) { arm(ctx, o, A, ptsB, true); hand(ctx, o, A, ptsB[2], true); }
    // rambut belakang/tudung: di bingkai kepala, sebelum badan
    const headGroup = (fn) => { ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(p.tilt); fn(); ctx.restore(); };
    if (["panjang", "kuncir", "hood"].includes(o.hair) || o.sanggul) headGroup(() => hairBack(ctx, o, R, t, ph, p.view));
    // leher
    if (o.hair !== "hijab") line(ctx, [[0, -T + 3], [hc[0] * 0.5, -T - A.neck - 1]], R * 0.5, dark(o.skin, 0.14));
    ctx.save(); ctx.translate(0, 0); ctx.scale(1, br);
    torso(ctx, o, A, p, A.Wt, A.Wb, -T, 3);
    ctx.restore();
    if (o.hair === "hijab") {   // kerudung menutup bahu dan dada
      const bot = -T + 13 + (o.age === "anak" ? -2 : 0);
      solid(ctx, () => { ctx.moveTo(hc[0] - R * 1.05, hc[1] + 2); ctx.quadraticCurveTo(-A.Wt * 0.6, -T + 1, -A.Wt * 0.52, bot - 4); ctx.quadraticCurveTo(hc[0] * 0.4, bot + 6, A.Wt * 0.52, bot - 4);
        ctx.quadraticCurveTo(A.Wt * 0.6, -T + 1, hc[0] + R * 1.05, hc[1] + 2); ctx.closePath(); }, o.hijab, 1);
    }
    if (o.hair === "hood") solid(ctx, () => { ctx.moveTo(hc[0] - R * 1.1, hc[1]); ctx.quadraticCurveTo(-A.Wt * 0.62, -T + 1, -A.Wt * 0.4, -T + 7); ctx.quadraticCurveTo(0, -T + 10, A.Wt * 0.4, -T + 7); ctx.quadraticCurveTo(A.Wt * 0.62, -T + 1, hc[0] + R * 1.1, hc[1]); ctx.closePath(); }, dark(o.top, 0.08), 0.8);
    headGroup(() => drawHead(ctx, o, R, mood, p.view, look, t, ph, p.mouth, true));
    // meja (menulis)
    let table = null;
    if (p.table) { ctx.restore(); ctx.save();   // meja di bingkai dunia
      const ty = hipY + -T * 0.4 + A.aw * 0.55, tx0 = lt * 0.45, tx1 = lt + 30, tc = o.mejaCol || "#C98A57";
      line(ctx, [[tx1 - 4, ty], [tx1 - 4.5, 0]], 2.6, dark(tc, 0.25));
      solid(ctx, () => H.rr(ctx, tx0, ty, tx1 - tx0, 3.6, 1.6), tc, 0.5);
      ctx.save(); ctx.translate(lt + 8, ty - 0.3); ctx.rotate(-0.05); ctx.fillStyle = "#F4F6FF"; ctx.fillRect(-7, -1.1, 15, 1.1); ctx.restore();
      table = [tx0, ty, tx1];
      ctx.translate(ox, oy); ctx.rotate(p.lean); }
    // lengan depan
    const drawObj = (pts) => {
      const hnd = pts[2]; ctx.save(); ctx.translate(hnd[0], hnd[1]); ctx.rotate(p.objRot || 0); ctx.scale(fs, 1);
      if (o.holding) o.holding(ctx, { pose: o.pose, t, unit: k, flip: !!o.flip });
      else if (p.obj === "hp") { ctx.translate(...(p.objOff || [0, 0])); phoneU(ctx, { t, ring: o.dering, on: o.layar !== false }); if (p.glow && o.glow !== false) D.glow(ctx, 0, -2, 16, P.teal, 0.28); }
      else if (p.obj === "pen") pen(ctx);
      ctx.restore();
    };
    if (p.bFront) { arm(ctx, o, A, ptsB, true); hand(ctx, o, A, ptsB[2], true); }
    arm(ctx, o, A, ptsF, false);
    if (o.holding || p.obj) drawObj(ptsF);
    hand(ctx, o, A, ptsF[2], false);
    // garis bisikan
    if (p.whisper && o.garisBisik !== false) { const hn = ptsF[2]; ctx.lineCap = "round";
      for (let i = 0; i < 2; i++) { const u = (t * 1.2 + i * 0.5) % 1; ctx.strokeStyle = `rgba(255,244,226,${0.75 * Math.sin(u * PI)})`; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.arc(hn[0] + 1, hn[1], 4.5 + u * 5, -0.55, 0.55); ctx.stroke(); } }
    // tanda tanya
    if (o.tanya || (o.pose === "garuk" && o.tanya !== false)) { const u = (t * 0.6 + ph) % 1, hx = hc[0] - R * 1.3, hy = hc[1] - R * 0.9 - u * 3;
      ctx.save(); ctx.globalAlpha *= Math.min(1, Math.sin(u * PI) * 1.6); ctx.translate(hx, hy); ctx.scale(fs, 1); ctx.rotate(-0.15);
      ctx.font = `900 ${R * 1.2}px ${K.FONT}`; ctx.textAlign = "center"; ctx.fillStyle = P.amber; ctx.fillText("?", 0, 0); ctx.restore(); }
    ctx.restore();
    ctx.restore();
    const hcW = W2(hc);
    return { head: hcW, top: [hcW[0], hcW[1] - k * R * 1.05], hand: W2(ptsF[2]), handB: W2(ptsB[2]), chest: W2([0, -T * 0.6]), feet: [x, y], scale: k,
      seat: p.seat ? [x + fs * k * p.seat[0], y + k * p.seat[1]] : null, table: table ? [x + fs * k * (table[0] + table[2]) / 2, y + k * table[1]] : null };
  }
  // ---------- tidur di kasur (tampak samping); (x, y) = tengah bawah ranjang di lantai ----------
  function sleep(ctx, x, y, h, o, t, ph) {
    const A = AGE[o.age], k = h / A.total, fs = o.flip ? -1 : 1, R = A.R, f = A.total / 92, br = Math.sin(t * 1.5 + ph);
    LX = 0.8 * fs; LY = -0.6;
    ctx.save(); ctx.translate(x, y); ctx.scale(fs * k, k);
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    const X = v => v * f, wood = o.ranjangCol || "#B07A52", mt = -27 * Math.sqrt(f);
    ctx.fillStyle = "rgba(14,18,60,0.26)"; ctx.beginPath(); ctx.ellipse(0, 0.6, X(64), 3, 0, 0, TAU); ctx.fill();
    // rangka
    [-54, 52].forEach(v => line(ctx, [[X(v), -8], [X(v), -1]], 3.2, dark(wood, 0.3)));
    solid(ctx, () => H.rr(ctx, X(-63), mt - 30, X(8), -mt + 30, 3), wood, 0.7);                // sandaran kepala
    ctx.fillStyle = lite(wood, 0.25); H.rr(ctx, X(-61), mt - 26, X(4), 10, 2); ctx.fill();
    solid(ctx, () => H.rr(ctx, X(-58), mt + 8, X(116), 9, 2.5), wood, 0.6);                      // bingkai
    solid(ctx, () => H.rr(ctx, X(-56), mt, X(112), 10, 4), "#E8ECFA", 0.6);                       // kasur
    solid(ctx, () => ctx.ellipse(X(-43), mt - 4, X(15), 6.5, -0.04, 0, TAU), "#F7F2FF", 0.5);  // bantal
    // bahu & kepala
    solid(ctx, () => ctx.ellipse(X(-30), mt - 5, 10, 7.5, -0.2, 0, TAU), o.top, 0.7);
    const hx = X(-42), hy = mt - 6 - R * 0.7 + br * 0.15;
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(-PI / 2 + 0.42); drawHead(ctx, o, R, o.face || "tidur", "q", [0, 0], t, ph, o.mulut ? "line" : null, false); ctx.restore();
    const bc = o.selimut || "#7C8BEA", c = br * 1.1;
    // guling (di bawah selimut, bagian atasnya menyembul)
    if (o.guling !== false) { ctx.save(); ctx.translate(X(-12), mt - 15 - c * 0.8); ctx.rotate(-0.08);
      solid(ctx, () => H.rr(ctx, -17, -5.5, 34, 11, 5.5), "#F3EAFB", 0.7); ctx.fillStyle = "#D9CFF0"; ctx.fillRect(-13, -5.5, 1.4, 11); ctx.fillRect(11.6, -5.5, 1.4, 11); ctx.restore(); }
    // selimut
    const fn = () => {
      ctx.moveTo(X(-34), mt + 9);
      ctx.lineTo(X(-34), mt - 2);
      ctx.bezierCurveTo(X(-33), mt - 11 - c, X(-20), mt - 12 - c, X(-8), mt - 11 - c * 0.6);
      ctx.bezierCurveTo(X(6), mt - 10, X(14), mt - 12, X(24), mt - 9);
      ctx.bezierCurveTo(X(36), mt - 6, X(42), mt - 13, X(48), mt - 10);
      ctx.bezierCurveTo(X(55), mt - 7, X(57), mt - 3, X(57), mt + 2);
      ctx.lineTo(X(57), mt + 13); ctx.quadraticCurveTo(X(12), mt + 16, X(-34), mt + 13); ctx.closePath();
    };
    solid(ctx, fn, bc, 1);
    ctx.save(); ctx.beginPath(); fn(); ctx.clip(); ctx.fillStyle = lite(bc, 0.25); for (let v = -24; v < 60; v += 14) ctx.fillRect(X(v), mt - 20, X(4), 40);
    ctx.fillStyle = lite(bc, 0.5); ctx.fillRect(X(-36), mt - 20, X(8), 40); ctx.restore();
    // lengan memeluk guling, di atas selimut
    if (o.guling !== false) { const yy = mt - 15 - c * 0.8;
      ctx.save(); ctx.translate(-LX * 1.2, -LY * 1.2); line(ctx, [[X(-29), mt - 7], [X(-20), yy], [X(-6), yy - 1]], A.aw * 0.9, "rgba(26,28,84,0.25)"); ctx.restore();
      line(ctx, [[X(-29), mt - 7], [X(-20), yy], [X(-6), yy - 1]], A.aw * 0.9, o.lengan === "panjang" ? o.top : o.skin);
      if (o.lengan !== "panjang") line(ctx, [[X(-29), mt - 7], [X(-25), mt - 10]], A.aw * 1.1, o.top);
      dot(ctx, X(-6), yy - 1, A.aw * 0.62, o.skin); }
    // Zzz
    if (o.zzz !== false) for (let i = 0; i < 3; i++) {
      const u = (t * 0.45 + i / 3 + ph * 0.1) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(u * PI) * 0.9;
      ctx.translate(hx + 6 + u * 16, hy - 12 - u * 22); ctx.scale(fs, 1); ctx.rotate(-0.2);
      ctx.font = `900 ${7 + u * 6}px ${K.FONT}`; ctx.textAlign = "center"; ctx.fillStyle = P.ink; ctx.fillText("z", 0, 0); ctx.restore();
    }
    ctx.restore();
    return { head: [x + fs * k * hx, y + k * hy], top: [x + fs * k * hx, y + k * (hy - R)], bed: [x, y + k * mt], feet: [x, y], scale: k, hand: [x + fs * k * X(-8), y + k * (mt - 16)] };
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
      const ny = A.neck + R * 0.95, tilt = o.tilt || 0;
      const dep = typeof o.bahu === "number" ? o.bahu : 1.1;
      ctx.save(); ctx.beginPath(); ctx.rect(-R * 3, -R * 2, R * 6, ny + R * dep + R * 2); ctx.clip();
      ctx.translate(0, ny - 1 + A.T);
      if (["panjang", "kuncir", "hood"].includes(o.hair) || o.sanggul) { ctx.save(); ctx.translate(0, -A.T - ny + 1); hairBack(ctx, o, R, t, ph, "q"); ctx.restore(); }
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
  // HP generik dalam piksel: (x, y) = pusat, size = tinggi
  function hp(ctx, x, y, size, opt = {}) { ctx.save(); ctx.translate(x, y); ctx.rotate(opt.rot || 0); ctx.scale(size / 13, size / 13); phoneU(ctx, opt); if (opt.glow) D.glow(ctx, 0, 0, 16, P.teal, 0.3); ctx.restore(); }

  // ---------- etalase ----------
  function showcase(ctx, t) {
    const W = 1920, HH = 1080;
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, "#3A4F9C"); gr.addColorStop(1, "#6177C6"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    D.glow(ctx, 1600, 120, 520, P.amber, 0.18); D.glow(ctx, 260, 980, 520, P.teal, 0.12);
    const floor = (y0) => { ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.fillRect(0, y0, W, 46); ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(0, y0, W, 3); };
    const cap = (s, x, y, size = 24, col = P.ink2) => D.txt(ctx, s, x, y, size, { align: "center", weight: 700, color: col });
    D.txt(ctx, "K.kit.orang", 40, 50, 34, { weight: 900 }); D.txt(ctx, "figur sederhana · pose (baris 1) · preset (baris 2) · wajah, rambut & kulit, kerumunan (baris 3)", 290, 50, 24, { weight: 600, color: P.ink2 });
    // baris 1: semua pose (kecuali tidur)
    floor(338);
    const pz = ["berdiri", "jalan", "duduk", "telepon", "pegangHP", "garuk", "panik", "lega", "bisik", "menulis"];
    const skins = [0, 2, 3, 4, 5, 1, 3, 2, 4, 3], hairs = ["pendek", "kuncir", "hijab", "panjang", "pendek", "botak", "hijab", "pendek", "panjang", "uban"];
    const tops = [P.teal, P.pink, "#8E7CF0", P.amber, "#5BD68A", "#FF8A5B", "#F2F6FF", "#5AA9FF", "#C77DFF", "#FFD38A"];
    pz.forEach((ps, i) => { const cx = 95 + i * 182 - (ps === "menulis" ? 30 : ps === "duduk" ? 18 : 0);
      draw(ctx, cx, 340, 228, { pose: ps, t, skin: SKIN[skins[i]], hair: hairs[i], top: tops[i], seed: i + 2, age: ps === "menulis" ? "lansia" : ps === "jalan" ? "remaja" : "dewasa", bawah: hairs[i] === "hijab" ? "rokPanjang" : undefined, bottom: hairs[i] === "hijab" ? "#4A5B8F" : undefined, hijab: HIJ[i % HIJ.length], outfit: i === 4 ? "kemeja" : undefined });
      cap(ps, 95 + i * 182, 376); });
    // baris 2: preset + tidur
    floor(668);
    const pr = [["buRina", "telepon", "panik"], ["anakRina", "berdiri"], ["ayah", "berdiri"], ["nenek", "berdiri", "senang"], ["kakek", "jalan"], ["adik", "lega"], ["pelaku", "pegangHP"]];
    pr.forEach(([n, ps, fc], i) => { const o = preset(n); o.pose = ps; o.t = t; if (fc) o.face = fc; if (n === "pelaku") o.flip = true; draw(ctx, 100 + i * 172, 670, 240, o); cap(n, 100 + i * 172, 706); });
    draw(ctx, 1480, 670, 220, Object.assign(preset("anakRina"), { pose: "tidur", t })); cap("tidur (anakRina, guling)", 1480, 706);
    hp(ctx, 1790, 560, 120, { t, ring: true, glow: true }); cap("hp()  dering", 1790, 706);
    // baris 3: wajah
    const fz = ["netral", "panik", "sedih", "senang", "ngantuk", "bingung", "tertawa", "tidur"];
    fz.forEach((f, i) => { kepala(ctx, 66 + i * 104, 790, 38, Object.assign(preset("buRina"), { face: f, t, seed: i, bahu: false })); cap(f, 66 + i * 104, 860, 21); });
    const hz = ["pendek", "panjang", "hijab", "kuncir", "uban", "botak", "hood"];
    hz.forEach((hs, i) => { kepala(ctx, 66 + i * 117, 936, 32, { hair: hs, skin: SKIN[i % 6], t, seed: i + 4, top: hs === "hood" ? "#4C5286" : TOPS[i], hijab: "#8E7CF0", sanggul: hs === "uban" && i % 2 === 0 }); cap(hs, 66 + i * 117, 1050, 21); });
    SKIN.forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(890, 760 + i * 46, 18, 0, TAU); ctx.fill(); D.txt(ctx, SKIN_NAMA[i], 916, 768 + i * 46, 20, { weight: 600, color: P.ink2 }); });
    // kerumunan: 10 orang, 7 menggaruk kepala
    const garuk = [0, 1, 2, 4, 5, 7, 9];
    floor(1040);
    crowd(ctx, 1490, 1042, 820, 10, { h: 190, t, seed: 4, gesture: i => garuk.includes(i) ? { pose: "garuk", tanya: false } : "berdiri" });
    cap("crowd(10), 7 garuk", 1490, 790, 22);
  }

  K.kit.orang = { draw, crowd, preset, kepala, hp, SKIN, SKIN_NAMA, POSES, FACES, HAIRS, PRESETS, AGE, showcase };
})(typeof window !== "undefined" ? window : globalThis);
