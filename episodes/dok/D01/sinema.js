/* Mesin sinema untuk video dokumenter (dimuat setelah kiko-core.js dan tiktok-core.js, sebelum scenes.js).
   Menggantikan Kiko.draw untuk video ini saja: layar penuh tanpa kartu narasi (teks di subtitel YouTube), latar malam,
   kamera yang bisa zoom/geser, cahaya, partikel, dan kartu judul bab pada selingan antarbab. Semua digambar dengan kode. */
(function (global) {
  const K = global.Kiko, H = K.helpers, TK = global.TikTok;
  const W = 1920, HH = 1080;
  const P = { bg0: "#0A1030", bg1: "#17244E", ink: "#EEF3FF", ink2: "#A9B8DC", dim: "#5E6E98", amber: "#FFB547", teal: "#3FD8C8", pink: "#FF6F91",
    violet: "#8F7CFF", blue: "#4DA3FF", green: "#5BD68A", red: "#FF5A5F", line: "rgba(238,243,255,0.16)", panel: "rgba(23,36,78,0.86)" };

  // ---------- matematika kecil ----------
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const eio = t => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const eout = t => { t = clamp(t); return 1 - Math.pow(1 - t, 3); };
  function rng(seed) { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  // ---------- waktu beat ----------
  const A = b => b.audio || b.dur;
  const lead = b => (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s, off = 0) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * A(b) + off; };
  const pr = (l, t0, d = 0.8) => eio((l - t0) / d);          // kemajuan 0..1 dengan easing
  const fade = (l, t0, d = 0.5) => clamp((l - t0) / d);       // linear 0..1

  // ---------- gambar dasar ----------
  const STARS = (() => { const r = rng(7); return Array.from({ length: 220 }, () => [r() * W, r() * HH, r() * 1.6 + 0.3, r() * 6.28]); })();
  function bg(ctx, t, opt = {}) {
    const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, opt.top || P.bg0); g.addColorStop(1, opt.bot || P.bg1);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
    if (opt.stars !== false) { const a = opt.stars == null ? 1 : opt.stars; ctx.fillStyle = "#FFFFFF"; STARS.forEach(([x, y, r, ph]) => { ctx.globalAlpha = a * (0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.9 + ph))); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }); ctx.globalAlpha = 1; }
  }
  function glow(ctx, x, y, r, col, a = 1) {
    if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, hexA(col, 0.9 * a)); g.addColorStop(0.35, hexA(col, 0.35 * a)); g.addColorStop(1, hexA(col, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  }
  function hexA(hex, a) { if (hex.startsWith("rgba")) return hex; const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${clamp(a)})`; }
  function vignette(ctx) { const g = ctx.createRadialGradient(W / 2, HH / 2, HH * 0.35, W / 2, HH / 2, HH * 0.95); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.45)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); }
  const txt = (ctx, s, x, y, size, opt = {}) => H.text(ctx, s, x, y, size, { color: P.ink, weight: 800, ...opt });
  // kamera: c = {x, y, z} titik dunia di tengah layar; fn digambar dalam koordinat dunia
  function cam(ctx, c, fn) { ctx.save(); ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); fn(); ctx.restore(); }
  // jalur kamera: keys [[t, x, y, z], …]; zoom diinterpolasi logaritmis supaya gerak zoom terasa rata
  function path(keys, t) {
    if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], z: keys[0][3] };
    for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, x0, y0, z0] = keys[i - 1], [t1, x1, y1, z1] = keys[i]; const u = eio((t - t0) / (t1 - t0));
      return { x: lerp(x0, x1, u), y: lerp(y0, y1, u), z: Math.exp(lerp(Math.log(z0), Math.log(z1), u)) }; }
    const k = keys[keys.length - 1]; return { x: k[1], y: k[2], z: k[3] };
  }
  function pill(ctx, s, cx, cy, opt = {}) {
    const size = opt.size || 30; ctx.font = `800 ${size}px ${K.FONT}`; const w = ctx.measureText(s).width + size * 1.2, h = size * 1.7;
    ctx.fillStyle = opt.fill || P.panel; H.rr(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill();
    if (opt.stroke) { ctx.strokeStyle = opt.stroke; ctx.lineWidth = 3; ctx.stroke(); }
    txt(ctx, s, cx, cy + size * 0.36, size, { align: "center", color: opt.color || P.ink }); return w;
  }
  function panel(ctx, x, y, w, h, opt = {}) { ctx.fillStyle = opt.fill || P.panel; H.rr(ctx, x, y, w, h, opt.r || 24); ctx.fill(); if (opt.stroke !== false) { ctx.strokeStyle = opt.stroke || P.line; ctx.lineWidth = opt.lw || 2; ctx.stroke(); } }
  const bip = (ctx, x, y, s, opt) => TK.helpers.bip(ctx, x, y, s, opt);

  // neuron bergaya: badan sel bercahaya + cabang (seed tetap); fire 0..1 = kilatan sinyal
  function neuron(ctx, x, y, r, opt = {}) {
    const R = rng(opt.seed || 1), col = opt.color || P.teal, n = opt.arms || 7;
    ctx.save(); ctx.translate(x, y); ctx.rotate(opt.rot || 0);
    ctx.strokeStyle = hexA(col, opt.alpha == null ? 0.8 : opt.alpha); ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const a = i / n * 6.283 + R() * 0.6, len = r * (2.2 + R() * 2.2); ctx.lineWidth = r * 0.22;
      ctx.beginPath(); ctx.moveTo(0, 0); const mx = Math.cos(a) * len * 0.55 + (R() - 0.5) * r, my = Math.sin(a) * len * 0.55 + (R() - 0.5) * r;
      const ex = Math.cos(a) * len, ey = Math.sin(a) * len; ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
      ctx.lineWidth = r * 0.1; for (let k = 0; k < 2; k++) { const b2 = a + (R() - 0.5) * 1.4; ctx.beginPath(); ctx.moveTo(ex * 0.75, ey * 0.75); ctx.lineTo(ex * 0.75 + Math.cos(b2) * r * 1.3, ey * 0.75 + Math.sin(b2) * r * 1.3); ctx.stroke(); }
    }
    ctx.restore();
    if (opt.fire) glow(ctx, x, y, r * 4.5, col, opt.fire);
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, "#FFFFFF"); g.addColorStop(0.35, col); g.addColorStop(1, hexA(col, 0.55));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  }

  // ---------- kartu judul bab (selingan tanpa narasi) ----------
  function chapterCard(ctx, num, title, u, t) {
    if (u <= 0) return; ctx.save(); ctx.globalAlpha = sm(u);
    ctx.fillStyle = "rgba(6,10,30,0.82)"; ctx.fillRect(0, 0, W, HH);
    glow(ctx, W / 2, HH / 2, 520, P.violet, 0.35);
    txt(ctx, "BAGIAN " + num, W / 2, HH / 2 - 60, 34, { align: "center", color: P.amber, weight: 900 });
    txt(ctx, title, W / 2, HH / 2 + 40, 76, { align: "center", weight: 900, fit: 1600 });
    ctx.fillStyle = P.amber; ctx.fillRect(W / 2 - 60, HH / 2 + 90, 120 * sm(u * 1.5), 5);
    ctx.restore();
  }

  function beatAt(TL, t) { let b = TL.beats[0]; for (const x of TL.beats) { if (t >= x.start) b = x; else break; } return b; }
  K.draw = function (ctx, t, TL) {
    const b = beatAt(TL, t), l = t - b.start;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const fn = K.SCENES[b.scene]; if (fn) fn(ctx, b, l, t, TL); else bg(ctx, t);
    vignette(ctx);
    // selingan antarbab: beat terakhir tiap bab ditahan lebih lama; kartu judul bab berikutnya muncul di jeda itu
    const i = TL.beats.indexOf(b), nx = TL.beats[i + 1];
    if (nx && nx.seg !== b.seg && b.dur - (lead(b) + A(b)) > 3) {
      const s0 = lead(b) + A(b) + 0.9, s1 = b.dur - 0.5; const u = Math.min(clamp((l - s0) / 0.8), clamp((s1 - l) / 0.6));
      chapterCard(ctx, nx.seg, TL.segments[nx.seg], u, t);
    }
    ctx.restore(); return b;
  };
  K.dok = { P, W, HH, clamp, lerp, sm, eio, eout, rng, A, lead, at, pr, fade, bg, glow, hexA, vignette, txt, cam, path, pill, panel, bip, neuron, chapterCard };
})(typeof window !== "undefined" ? window : globalThis);
