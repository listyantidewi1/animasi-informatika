/* D08 — perangkat bersama: palet senja neon, langit + kota pantai 2D, teks neon (Bungee), panel kaca, ikon berkas,
   jendela browser generik, HP, Raka (kit.orang), ikon keamanan, panah, kartu sumber.
   Gaya: nuansa senja pantai tropis 80-an yang digambar dengan kode. TIDAK memakai logo/huruf/tokoh/aset GTA atau Rockstar. */
(function (g) {
  const K = g.Kiko, D = K.dok, H = K.helpers;
  const W = 1920, HH = 1080, TAU = Math.PI * 2, FONT = K.FONT, NEON = "Bungee, " + FONT;
  const { clamp, lerp, eio, eout, spring } = D;
  const RR = (...a) => H.rr(...a);
  const U = K.d08 = {};
  const N = U.N = { ink: "#F6F2FF", ink2: "#CFC3EE", dim: "#8E7FB8", pink: "#FF4FD8", cyan: "#33F0FF", sun: "#FFB36B", gold: "#FFE17A",
    red: "#FF3B5C", green: "#3DFFA8", violet: "#9B6BFF", night: "#0B0620", deep: "#170A33", panel: "rgba(16,8,38,0.86)", orange: "#FF7A5C" };
  U.W = W; U.HH = HH; U.TAU = TAU; U.RR = RR;
  // huruf Bungee (OFL) dari vendor; juga dipasang di sistem saat render. Bila belum termuat, Inter Black dipakai.
  try { if (g.FontFace && g.document) { const f = new FontFace("Bungee", "url(../../_alat/vendor/fonts/Bungee-Regular.ttf)"); f.load().then(x => document.fonts.add(x)).catch(() => {}); } } catch (e) {}

  const txt = U.txt = (ctx, s, x, y, size, opt = {}) => D.txt(ctx, s, x, y, size, { color: N.ink, ...opt });
  const ramp = U.ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  U.pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55)) });
  U.ease = (l, t0, d = 0.8) => eio(clamp((l - t0) / d));
  U.reg = (seg, S) => { K.SCENES["d08_b" + seg] = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else U.senja(ctx, t); }; };
  U.at = (b, s, off = 0) => D.at(b, s, off);
  U.hexA = D.hexA;

  // ---------- latar senja pantai (lapisan dicache; paralaks pelan) ----------
  const CACHE = {};
  function layer(key, w, h, fn) { if (!CACHE[key]) { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); CACHE[key] = c; } return CACHE[key]; }
  function rng(seed) { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  U.rng = rng;
  function palm(c, x, y, s, col) {
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 16; c.lineCap = "round";
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(30, -200, 10, -380); c.stroke();
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.5; c.save(); c.translate(10, -380); c.rotate(a); c.beginPath(); c.moveTo(0, 0);
      c.quadraticCurveTo(90, -30, 170, 40); c.quadraticCurveTo(90, -5, 0, 10); c.fill(); c.restore(); }
    c.restore();
  }
  U.palm = palm;
  function skyLayer() {
    return layer("sky", W, HH, (c) => {
      const gr = c.createLinearGradient(0, 0, 0, HH * 0.64); gr.addColorStop(0, "#160832"); gr.addColorStop(0.45, "#6E1C6C"); gr.addColorStop(0.8, "#F2596E"); gr.addColorStop(1, "#FFB06B");
      c.fillStyle = gr; c.fillRect(0, 0, W, HH);
      const sea = c.createLinearGradient(0, HH * 0.64, 0, HH); sea.addColorStop(0, "#1B5F86"); sea.addColorStop(1, "#06142A"); c.fillStyle = sea; c.fillRect(0, HH * 0.64, W, HH * 0.36);
      const r = rng(3); c.fillStyle = "#FFFFFF"; for (let i = 0; i < 70; i++) { c.globalAlpha = 0.15 + r() * 0.5; c.beginPath(); c.arc(r() * W, r() * HH * 0.35, 1 + r() * 1.6, 0, TAU); c.fill(); } c.globalAlpha = 1;
    });
  }
  function sunLayer() {
    return layer("sun", 640, 640, (c) => {
      c.beginPath(); c.arc(320, 320, 300, 0, TAU); c.clip();
      const sg = c.createLinearGradient(0, 20, 0, 620); sg.addColorStop(0, "#FFE58A"); sg.addColorStop(0.65, "#FF7A6B"); sg.addColorStop(1, "#FF3D8F"); c.fillStyle = sg; c.fillRect(0, 0, 640, 640);
      c.globalCompositeOperation = "destination-out"; for (let i = 0; i < 8; i++) c.fillRect(0, 350 + i * 34, 640, 5 + i * 3.5);
    });
  }
  function cityLayer(seed, col, winA) {
    return layer("city" + seed, W * 2, 700, (c) => {
      const r = rng(seed); let x = 0;
      while (x < W * 2) { const w = 90 + r() * 150, h = 140 + r() * 380, y = 700 - h; c.fillStyle = col; c.fillRect(x, y, w, h);
        // mahkota art deco
        c.fillRect(x + w * 0.25, y - 26, w * 0.5, 26); c.fillRect(x + w * 0.4, y - 48, w * 0.2, 22);
        if (winA > 0) { c.fillStyle = `rgba(255,214,140,${winA})`; for (let yy = y + 30; yy < 690; yy += 28) for (let xx = x + 12; xx < x + w - 14; xx += 22) if (r() < 0.42) c.fillRect(xx, yy, 9, 13); }
        x += w + 10 + r() * 60; }
    });
  }
  function palmLayer() {
    return layer("palms", W * 2, HH, (c) => { [[0.03, 1.25], [0.24, 0.95], [0.46, 1.1], [0.71, 1.3], [0.93, 1.0], [1.18, 1.2], [1.4, 0.9], [1.62, 1.15], [1.85, 1.05]].forEach(([x, s]) => palm(c, x * W, HH * 0.68, s, "#12061F")); });
  }
  // o: sunX, sunY, drift (px/s), cityA, palms, dim, sea (garis pantul)
  U.senja = function (ctx, t, o = {}) {
    ctx.drawImage(skyLayer(), 0, 0);
    const sx = o.sunX == null ? 1180 : o.sunX, sy = o.sunY == null ? 560 : o.sunY, sr = o.sunR || 260;
    D.glow(ctx, sx, sy - 40, sr * 2.4, "#FF7A9A", 0.35);
    ctx.drawImage(sunLayer(), sx - sr, sy - sr - 60, sr * 2, sr * 2);
    // pantulan matahari di laut
    ctx.save(); ctx.strokeStyle = "rgba(255,190,140,0.55)"; ctx.lineWidth = 4;
    for (let i = 0; i < 11; i++) { const y = HH * 0.66 + i * i * 4.2, hw = (sr * 0.9 - i * 16) * (0.85 + 0.15 * Math.sin(t * 1.3 + i)); ctx.beginPath(); ctx.moveTo(sx - hw, y); ctx.lineTo(sx + hw, y); ctx.stroke(); }
    ctx.restore();
    const dr = o.drift == null ? 10 : o.drift;
    const far = cityLayer(11, "#3A1450", 0.18), near = cityLayer(29, "#1C0D33", 0.5);
    const fx = -((t * dr * 0.5) % W), nx = -((t * dr) % W);
    ctx.drawImage(far, fx, HH * 0.64 - 700 + 40); ctx.drawImage(near, nx, HH * 0.64 - 700 + 6);
    // garis pantai neon
    ctx.save(); ctx.shadowColor = N.cyan; ctx.shadowBlur = 16; ctx.strokeStyle = "rgba(51,240,255,0.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, HH * 0.64 + 6); ctx.lineTo(W, HH * 0.64 + 6); ctx.stroke(); ctx.restore();
    if (o.palms !== false) { const px = -((t * dr * 1.6) % W); ctx.drawImage(palmLayer(), px, 0); }
    if (o.dim) { ctx.fillStyle = `rgba(10,4,26,${o.dim})`; ctx.fillRect(0, 0, W, HH); }
  };
  // latar gelap polos ber-kisi neon (untuk diagram dan layar)
  U.ruang = function (ctx, t, o = {}) {
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, o.top || "#2C1660"); gr.addColorStop(0.62, o.mid || "#4A1E76"); gr.addColorStop(1, o.bot || "#66237C"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    // lantai kisi perspektif di bawah
    ctx.save(); ctx.strokeStyle = D.hexA(o.grid || N.pink, 0.22); ctx.lineWidth = 2; const hz = 760, sp = (t * 40) % 60;
    for (let i = -14; i <= 14; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 40, hz); ctx.lineTo(W / 2 + i * 260, HH); ctx.stroke(); }
    for (let k = 0; k < 9; k++) { const y = hz + Math.pow((k * 60 + sp) / 540, 2) * (HH - hz); ctx.globalAlpha = clamp((y - hz) / 80); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
    // cahaya latar "bernapas" pelan (gerak halus untuk adegan diagram)
    D.glow(ctx, (o.gx == null ? 1500 : o.gx) + 120 * Math.sin(t * 0.45), (o.gy == null ? 240 : o.gy) + 60 * Math.cos(t * 0.37), 900, o.col || N.pink, (o.ga == null ? 0.18 : o.ga) * (1.25 + 0.45 * Math.sin(t * 1.1)));
    D.glow(ctx, 300, 900, 700, N.cyan, 0.1);
    // debu neon melayang (gerak halus supaya adegan diagram tidak diam)
    if (o.debu !== false) { const r = rng(17); ctx.save(); for (let i = 0; i < 46; i++) { const x0 = r() * W, y0 = r() * HH, sp = 14 + r() * 30, ph = r() * 6.28, sz = 2 + r() * 4;
      const x = (x0 + t * sp * 0.6) % W, y = ((y0 - t * sp) % HH + HH) % HH; ctx.globalAlpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.7 + ph)); ctx.fillStyle = [N.pink, N.cyan, N.gold][i % 3];
      ctx.beginPath(); ctx.arc(x, y, sz, 0, TAU); ctx.fill(); } ctx.restore(); }
  };

  // ---------- teks neon ----------
  U.neon = function (ctx, s, x, y, size, col, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.font = `${size}px ${NEON}`; ctx.textAlign = o.align || "left"; ctx.textBaseline = "alphabetic";
    if (o.fit) { let sz = size; while (sz > 30 && ctx.measureText(s).width > o.fit) { sz -= 2; ctx.font = `${sz}px ${NEON}`; } }
    ctx.lineJoin = "round"; ctx.shadowColor = col; ctx.shadowBlur = o.blur == null ? size * 0.35 : o.blur; ctx.strokeStyle = col; ctx.lineWidth = Math.max(3, size * 0.05);
    ctx.strokeText(s, x, y); ctx.strokeText(s, x, y); ctx.shadowBlur = size * 0.12;
    ctx.fillStyle = o.fill || "#FFF6FD"; ctx.fillText(s, x, y); ctx.restore();
  };
  U.neonPop = function (ctx, s, x, y, size, col, l, t0, o = {}) { const p = U.pop(l, t0); if (p.a <= 0) return; ctx.save(); ctx.translate(x, y); const k = lerp(0.7, 1, p.sp); ctx.scale(k, k); U.neon(ctx, s, 0, 0, size, col, { ...o, a: p.a * (o.a == null ? 1 : o.a) }); ctx.restore(); };
  // judul lurus Inter dengan panel (untuk keterangan yang harus mudah dibaca)
  U.judul = function (ctx, s, x, y, size, a, o = {}) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= clamp(a); const k = lerp(0.88, 1, o.sp == null ? 1 : o.sp); ctx.translate(x, y); ctx.scale(k, k);
    ctx.font = `900 ${size}px ${FONT}`; const w = Math.min(o.fit || 1700, ctx.measureText(s).width) + size * 0.9, h = size * 1.55;
    ctx.fillStyle = o.fill || "rgba(14,6,34,0.9)"; RR(ctx, -w / 2, -h * 0.68, w, h, h * 0.3); ctx.fill();
    ctx.shadowColor = o.col || N.cyan; ctx.shadowBlur = 18; ctx.strokeStyle = o.col || N.cyan; ctx.lineWidth = 4; ctx.stroke(); ctx.shadowBlur = 0;
    txt(ctx, s, 0, size * 0.1, size, { align: "center", weight: 900, color: o.color || N.ink, fit: o.fit || 1700 }); ctx.restore();
  };
  U.judulPop = (ctx, s, x, y, size, l, t0, o = {}) => { const p = U.pop(l, t0); U.judul(ctx, s, x, y, size, p.a * (o.a == null ? 1 : o.a), { ...o, sp: p.sp }); };
  U.tag = function (ctx, s, x, y, l, t0, o = {}) { const p = U.pop(l, t0); if (p.a <= 0.01) return; ctx.save(); ctx.globalAlpha *= p.a * (o.a == null ? 1 : o.a); ctx.translate(x, y); const k = lerp(0.8, 1, p.sp); ctx.scale(k, k);
    D.label(ctx, s, 0, 0, { size: o.size || 46, col: o.col || N.pink, color: o.color, fill: o.fill || "rgba(14,6,34,0.92)" }); ctx.restore(); };
  // kartu sumber kecil kiri bawah (≥40 px)
  U.sumber = function (ctx, l, t0, s, a = 1) { const k = ramp(l, t0, 0.4) * a; if (k <= 0.01) return; ctx.save(); ctx.globalAlpha *= k;
    ctx.font = `700 40px ${FONT}`; const w = ctx.measureText("Sumber: " + s).width + 48; ctx.fillStyle = "rgba(10,4,26,0.82)"; RR(ctx, 96, 822, w, 66, 18); ctx.fill();
    txt(ctx, "Sumber: " + s, 120, 868, 40, { weight: 700, color: N.ink2 }); ctx.restore(); };

  // ---------- panel kaca ----------
  U.panel = function (ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.fillStyle = o.fill || N.panel; RR(ctx, x, y, w, h, o.r || 26); ctx.fill();
    ctx.shadowColor = o.col || N.cyan; ctx.shadowBlur = o.blur == null ? 22 : o.blur; ctx.strokeStyle = D.hexA(o.col || N.cyan, o.la == null ? 0.85 : o.la); ctx.lineWidth = o.lw || 4; ctx.stroke(); ctx.restore();
  };

  // ---------- ikon berkas: kartu dengan sudut terlipat ----------
  const JENIS = { exe: [N.red, "EXE"], apk: [N.green, "APK"], zip: [N.gold, "ZIP"], game: [N.cyan, "GAME"], torrent: [N.violet, "BUILD"] };
  U.berkas = function (ctx, x, y, s, o = {}) {   // (x,y) = tengah ikon; s = tinggi ikon
    const a = o.a == null ? 1 : o.a; if (a <= 0.01) return; const [col, lab] = JENIS[o.jenis || "exe"], w = s * 0.78, h = s, f = s * 0.24;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.scale) ctx.scale(o.scale, o.scale);
    ctx.shadowColor = col; ctx.shadowBlur = o.glow == null ? 26 : o.glow;
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - f, -h / 2); ctx.lineTo(w / 2, -h / 2 + f); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath();
    ctx.fillStyle = "#1A0E36"; ctx.fill(); ctx.lineWidth = Math.max(3, s * 0.03); ctx.strokeStyle = col; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.moveTo(w / 2 - f, -h / 2); ctx.lineTo(w / 2 - f, -h / 2 + f); ctx.lineTo(w / 2, -h / 2 + f); ctx.strokeStyle = col; ctx.stroke();
    ctx.fillStyle = col; RR(ctx, -w * 0.42, h * 0.08, w * 0.84, h * 0.26, 8); ctx.fill();
    txt(ctx, lab, 0, h * 0.08 + h * 0.19, Math.max(18, s * 0.17), { align: "center", weight: 900, color: "#120826" });
    if (o.gembok) U.gembok(ctx, 0, -h * 0.18, s * 0.3, N.gold, o.gembokBuka || 0);
    if (o.mata) U.mataJahat(ctx, 0, -h * 0.2, s * 0.32, o.t || 0);
    ctx.restore();
    // nama + ukuran di bawah (Inter, ≥40 px)
    if (o.nama) { txt(ctx, o.nama, x, y + h / 2 + 62, o.size || 44, { align: "center", weight: 800, color: N.ink, fit: o.fit || 700 }); }
    if (o.ukuran) { txt(ctx, o.ukuran, x, y + h / 2 + 62 + (o.size || 44) * 1.25, (o.size || 44) * 1.05, { align: "center", weight: 900, color: o.ukCol || col }); }
  };
  U.mataJahat = function (ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); const bl = Math.abs(Math.sin(t * 0.9)) > 0.97 ? 0.15 : 1;
    [-1, 1].forEach(k => { ctx.save(); ctx.translate(k * s * 0.32, 0); ctx.scale(1, bl); ctx.fillStyle = N.red; ctx.shadowColor = N.red; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.moveTo(-s * 0.22, -s * 0.06 * k * -1); ctx.lineTo(s * 0.22, s * 0.06 * k * -1 - s * 0.05); ctx.lineTo(s * 0.12, s * 0.14); ctx.lineTo(-s * 0.16, s * 0.12); ctx.closePath(); ctx.fill(); ctx.restore(); });
    ctx.restore();
  };

  // ---------- ikon keamanan ----------
  U.gembok = function (ctx, x, y, s, col, buka = 0) {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * 0.12; ctx.lineCap = "round"; ctx.shadowColor = col; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(0, -s * 0.12 - buka * s * 0.25, s * 0.26, Math.PI, 0); ctx.lineTo(s * 0.26, -s * 0.02 - buka * s * 0.25); ctx.moveTo(-s * 0.26, -s * 0.12 - buka * s * 0.25); ctx.lineTo(-s * 0.26, buka > 0.5 ? -s * 0.2 : -s * 0.02); ctx.stroke();
    ctx.fillStyle = col; RR(ctx, -s * 0.4, -s * 0.04, s * 0.8, s * 0.58, s * 0.1); ctx.fill(); ctx.fillStyle = "#1A0E36"; ctx.beginPath(); ctx.arc(0, s * 0.2, s * 0.08, 0, TAU); ctx.fill(); ctx.restore();
  };
  U.perisai = function (ctx, x, y, s, col, o = {}) {   // antivirus
    ctx.save(); ctx.translate(x, y); ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.fillStyle = "#1A0E36"; ctx.strokeStyle = col; ctx.lineWidth = s * 0.06;
    ctx.beginPath(); ctx.moveTo(0, -s / 2); ctx.quadraticCurveTo(s * 0.42, -s * 0.38, s * 0.42, -s * 0.36); ctx.lineTo(s * 0.38, s * 0.05); ctx.quadraticCurveTo(s * 0.3, s * 0.36, 0, s / 2); ctx.quadraticCurveTo(-s * 0.3, s * 0.36, -s * 0.38, s * 0.05); ctx.lineTo(-s * 0.42, -s * 0.36); ctx.quadraticCurveTo(-s * 0.42, -s * 0.38, 0, -s / 2); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    // mata: terbuka, atau tertutup (o.tutup 0..1)
    const tp = o.tutup || 0; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.ellipse(0, -s * 0.02, s * 0.2, s * 0.12 * (1 - tp) + 0.5, 0, 0, TAU); ctx.stroke();
    if (tp < 0.8) { ctx.beginPath(); ctx.arc(0, -s * 0.02, s * 0.06 * (1 - tp), 0, TAU); ctx.fill(); }
    if (tp > 0.5) { ctx.strokeStyle = N.ink2; ctx.lineWidth = s * 0.04; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * s * 0.08, s * 0.08); ctx.lineTo(i * s * 0.1, s * 0.15); ctx.stroke(); } }
    ctx.restore();
  };
  U.centang = function (ctx, x, y, s, k, col = N.green) { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.2; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.shadowColor = col; ctx.shadowBlur = 14;
    const p = [[x - s * 0.5, y], [x - s * 0.12, y + s * 0.4], [x + s * 0.6, y - s * 0.45]]; ctx.beginPath(); ctx.moveTo(...p[0]);
    const k1 = clamp(k * 2), k2 = clamp(k * 2 - 1); ctx.lineTo(lerp(p[0][0], p[1][0], k1), lerp(p[0][1], p[1][1], k1)); if (k2 > 0) ctx.lineTo(lerp(p[1][0], p[2][0], k2), lerp(p[1][1], p[2][1], k2)); ctx.stroke(); ctx.restore(); };
  U.silang = function (ctx, x, y, s, k, col = N.red) { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.2; ctx.lineCap = "round"; ctx.shadowColor = col; ctx.shadowBlur = 14;
    const k1 = clamp(k * 2), k2 = clamp(k * 2 - 1); ctx.beginPath(); ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x - s / 2 + s * k1, y - s / 2 + s * k1);
    if (k2 > 0) { ctx.moveTo(x + s / 2, y - s / 2); ctx.lineTo(x + s / 2 - s * k2, y - s / 2 + s * k2); } ctx.stroke(); ctx.restore(); };
  U.tanya = function (ctx, x, y, s, col = N.gold, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `${s}px ${NEON}`; ctx.textAlign = "center"; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.fillStyle = col; ctx.fillText("?", x, y + s * 0.36); ctx.restore(); };
  U.bahaya = function (ctx, x, y, s, col = N.red, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.shadowColor = col; ctx.shadowBlur = 18; ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(0, -s / 2); ctx.lineTo(s * 0.55, s * 0.45); ctx.lineTo(-s * 0.55, s * 0.45); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
    txt(ctx, "!", 0, s * 0.36, s * 0.62, { align: "center", weight: 900, color: "#1A0E36" }); ctx.restore(); };
  U.server = function (ctx, x, y, s, col = N.red, t = 0) {   // server penipu
    ctx.save(); ctx.translate(x, y); for (let i = 0; i < 3; i++) { const yy = -s / 2 + i * s * 0.36; ctx.fillStyle = "#1A0E36"; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.shadowColor = col; ctx.shadowBlur = 14;
      RR(ctx, -s * 0.42, yy, s * 0.84, s * 0.3, 10); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = (Math.floor(t * 4 + i) % 2) ? col : D.hexA(col, 0.3); ctx.beginPath(); ctx.arc(-s * 0.28, yy + s * 0.15, s * 0.04, 0, TAU); ctx.fill();
      ctx.fillStyle = D.hexA(N.ink2, 0.5); ctx.fillRect(-s * 0.12, yy + s * 0.12, s * 0.42, s * 0.06); } ctx.restore(); };
  U.koin = function (ctx, x, y, r, col = N.gold, s = "₿") { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = "#1A0E36"; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.arc(x, y, r * 0.72, 0, TAU); ctx.stroke(); txt(ctx, s, x, y + r * 0.36, r, { align: "center", weight: 900, color: "#1A0E36" }); ctx.restore(); };
  U.token = function (ctx, x, y, s, a = 1, rot = 0) {   // kartu "token sesi"
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.shadowColor = N.gold; ctx.shadowBlur = 20; ctx.fillStyle = "#2A1648"; ctx.strokeStyle = N.gold; ctx.lineWidth = 5;
    RR(ctx, -s, -s * 0.55, s * 2, s * 1.1, 18); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; U.koin(ctx, -s * 0.62, 0, s * 0.3, N.gold, "✓");
    txt(ctx, "token", s * 0.2, -s * 0.06, s * 0.36, { align: "center", weight: 900, color: N.gold }); txt(ctx, "login", s * 0.2, s * 0.34, s * 0.32, { align: "center", weight: 800, color: N.ink2 }); ctx.restore(); };
  U.panah = function (ctx, x1, y1, x2, y2, col, k = 1, lw = 8, o = {}) {
    if (k <= 0) return; const x = lerp(x1, x2, k), y = lerp(y1, y2, k); ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.shadowColor = col; ctx.shadowBlur = 14;
    if (o.dash) ctx.setLineDash(o.dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
    const an = Math.atan2(y2 - y1, x2 - x1), hs = lw * 3.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - hs * Math.cos(an - 0.45), y - hs * Math.sin(an - 0.45)); ctx.lineTo(x - hs * Math.cos(an + 0.45), y - hs * Math.sin(an + 0.45)); ctx.closePath(); ctx.fill(); ctx.restore(); };
  U.titikJalan = function (ctx, x1, y1, x2, y2, col, t, n = 5, r = 9) { ctx.save(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12; for (let i = 0; i < n; i++) { const u = ((t * 0.6 + i / n) % 1); ctx.globalAlpha = Math.sin(u * Math.PI); ctx.beginPath(); ctx.arc(lerp(x1, x2, u), lerp(y1, y2, u), r, 0, TAU); ctx.fill(); } ctx.restore(); };

  // ---------- batang ukuran (GB vs MB) ----------
  U.batangUkuran = function (ctx, x, yBase, w, hMax, items, k, o = {}) {   // items: [{lab, nilai (GB), col, teks}]
    const max = Math.max(...items.map(i => i.nilai)); items.forEach((it, i) => { const kk = clamp(k * 1.4 - i * 0.25), hh = Math.max(4, hMax * Math.pow(it.nilai / max, 1) * eout(kk)), xx = x + i * (w + (o.gap || 120));
      ctx.save(); ctx.shadowColor = it.col; ctx.shadowBlur = 24; ctx.fillStyle = D.hexA(it.col, 0.85); RR(ctx, xx, yBase - hh, w, hh, 12); ctx.fill(); ctx.restore();
      txt(ctx, it.lab, xx + w / 2, yBase + 62, 44, { align: "center", weight: 800, color: N.ink, fit: w + (o.gap || 120) - 20 });
      if (kk > 0.3) txt(ctx, it.teks, xx + w / 2, yBase - hh - 26, 58, { align: "center", weight: 900, color: it.col }); }); };

  // ---------- jendela browser generik (tanpa merek) ----------
  U.browser = function (ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 40; ctx.fillStyle = "#F4F1FA"; RR(ctx, x, y, w, h, 22); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = "#2B2242"; RR(ctx, x, y, w, 92, 22); ctx.fill(); ctx.fillRect(x, y + 60, w, 32);
    [N.red, N.gold, N.green].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 40 + i * 34, y + 46, 11, 0, TAU); ctx.fill(); });
    ctx.fillStyle = "#3E3360"; RR(ctx, x + 150, y + 20, w - 190, 52, 26); ctx.fill();
    txt(ctx, o.url || "", x + 186, y + 60, 40, { weight: 700, color: o.urlCol || N.ink2, fit: w - 260 });
    ctx.restore(); return { x: x + 20, y: y + 112, w: w - 40, h: h - 132 };
  };
  U.tombol = function (ctx, s, cx, cy, w, h, col, o = {}) { ctx.save(); const pul = o.pulse ? 1 + 0.04 * Math.sin(o.t * 6) : 1; ctx.translate(cx, cy); ctx.scale(pul, pul);
    ctx.shadowColor = col; ctx.shadowBlur = 24; ctx.fillStyle = col; RR(ctx, -w / 2, -h / 2, w, h, h * 0.22); ctx.fill(); ctx.shadowBlur = 0;
    txt(ctx, s, 0, h * 0.18, o.size || h * 0.42, { align: "center", weight: 900, color: o.color || "#FFFFFF", fit: w - 30 }); ctx.restore(); };

  // ---------- laptop ----------
  U.laptop = function (ctx, cx, cy, w, o = {}) {   // cy = garis engsel; kembalikan rect layar
    const h = w * 0.62; ctx.save(); ctx.fillStyle = "#1B1430"; ctx.strokeStyle = D.hexA(N.cyan, 0.7); ctx.lineWidth = 4; ctx.shadowColor = N.cyan; ctx.shadowBlur = 18;
    RR(ctx, cx - w / 2, cy - h, w, h, 18); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = "#2A2340"; ctx.beginPath(); ctx.moveTo(cx - w / 2 - 40, cy + 26); ctx.lineTo(cx + w / 2 + 40, cy + 26); ctx.lineTo(cx + w / 2, cy); ctx.lineTo(cx - w / 2, cy); ctx.closePath(); ctx.fill();
    ctx.restore(); const r = { x: cx - w / 2 + 18, y: cy - h + 18, w: w - 36, h: h - 36 };
    ctx.save(); ctx.fillStyle = o.layar || "#0E0A1E"; RR(ctx, r.x, r.y, r.w, r.h, 8); ctx.fill(); ctx.restore(); return r;
  };

  // ---------- HP generik (kit.layar) ----------
  U.hp = function (ctx, cx, cy, h, screen, o = {}) { return K.kit.layar.hp(ctx, cx, cy, h, { screen, t: o.t || 0, ringkas: o.ringkas !== false, glowCol: o.glowCol || "#A9D4FF", ...o }); };

  // ---------- Raka (remaja, hoodie) ----------
  U.raka = function (ctx, x, y, h, o = {}) {
    return K.kit.orang.draw(ctx, x, y, h, { age: "remaja", skin: 2, hair: "pendek", outfit: "hoodie", top: "#3B2A7A", bottom: "#2A2E4A", sepatu: "#F2F2F2", seed: 5, t: o.t || 0, ...o });
  };

  // ---------- gelembung pikiran ----------
  U.gelembung = function (ctx, x, y, w, h, a, ekor) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "rgba(246,242,255,0.95)"; RR(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    if (ekor) { ctx.beginPath(); ctx.arc(ekor[0], ekor[1], 16, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(lerp(ekor[0], x, 0.45), lerp(ekor[1], y + h / 2, 0.45), 24, 0, TAU); ctx.fill(); } ctx.restore(); };

  // ---------- teks paragraf rata kiri ----------
  U.paragraf = function (ctx, s, x, y, size, maxW, o = {}) { const lines = H.wrap ? H.wrap(ctx, s, size, o.weight || 700, maxW) : [s]; lines.forEach((ln, i) => txt(ctx, ln, x, y + i * size * 1.3, size, { weight: o.weight || 700, color: o.color || N.ink, align: o.align })); return lines.length; };
})(typeof window !== "undefined" ? window : globalThis);
