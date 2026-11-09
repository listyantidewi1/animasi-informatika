/* Mesin sinema dokumenter versi 2 (mulai D03; D01–D02 tetap memakai dok/D01/sinema.js). Dimuat sesudah kiko-core.js dan tiktok-core.js.
   Perbaikan dari audit D02 (episodes/dok/audit_D02.md):
   - at(b, "potongan") memakai waktu kata sungguhan (timeline "words" dari align_dok.py), perkiraan proporsional hanya cadangan;
   - kamera dorong-masuk pelan bawaan di setiap adegan 2D, transisi silang-pudar antarbeat (kunci beat "trans": "pudar"|"geser"|"potong");
   - kartu bab singkat (±2,6 dtk), gelap penuh, memudar ke adegan BARU; tanpa kartu untuk bab "Penutup";
   - lapisan label sesudah vignette (D.post), label dramatisasi otomatis pada beat suara tokoh, palet sedikit lebih terang.
   API K.dok sama dengan versi 1 (dipakai short_dok.js) ditambah: spring, post, word, SAFE, label, kicker, sky. */
(function (global) {
  const K = global.Kiko, H = K.helpers, TK = global.TikTok;
  const W = 1920, HH = 1080;
  const P = { bg0: "#18265A", bg1: "#2E4384", ink: "#F2F6FF", ink2: "#B9C7EA", dim: "#6E7FAE", amber: "#FFB547", teal: "#3FD8C8", pink: "#FF6F91",
    violet: "#9584FF", blue: "#5AA9FF", green: "#5BD68A", red: "#FF5A5F", warm: "#FFD38A", line: "rgba(242,246,255,0.18)", panel: "rgba(16,26,66,0.88)", night: "#0B1236" };
  const SAFE = { x: 96, top: 72, bottom: 900, w: W - 192 };   // teks penting di dalam kotak ini (bawah 900 tertutup bilah pemutar/subtitel)

  // ---------- matematika ----------
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const eio = t => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const eout = t => { t = clamp(t); return 1 - Math.pow(1 - t, 3); };
  const spring = (t, k = 9, z = 0.45) => { if (t <= 0) return 0; const d = Math.exp(-z * k * t); return 1 - d * Math.cos(k * Math.sqrt(1 - z * z) * t); };
  function rng(seed) { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  // ---------- waktu beat: kata sungguhan ----------
  const A = b => b.audio || b.dur;
  const lead = b => (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const MISS = global.__missing = global.__missing || [];
  // indeks kata (dipisah spasi) yang memuat karakter ke-i di b.text
  function wordIndex(b, i) { let pos = 0, k = 0; const toks = b.text.split(/\s+/); for (; k < toks.length; k++) { const j = b.text.indexOf(toks[k], pos); if (j + toks[k].length > i) return k; pos = j + toks[k].length; } return toks.length - 1; }
  function word(b, s, edge = 0) {   // edge 0 = mulai kata pertama potongan, 1 = selesai kata terakhir potongan
    const i = b.text.indexOf(s); if (i < 0) { if (!MISS.includes(b.id + ":" + s)) MISS.push(b.id + ":" + s); return lead(b); }
    const toks = b.text.split(/\s+/), ws = b.words;
    if (ws && ws.length === toks.length) { const k = wordIndex(b, edge ? i + s.length - 1 : i); return ws[k][edge ? 2 : 1]; }
    return lead(b) + (edge ? i + s.length : i) / b.text.length * A(b);
  }
  const at = (b, s, off = 0) => word(b, s, 0) + off;
  const atEnd = (b, s, off = 0) => word(b, s, 1) + off;
  const speechEnd = b => (b.words && b.words.length ? b.words[b.words.length - 1][2] : lead(b) + A(b));
  const pr = (l, t0, d = 0.8) => eio((l - t0) / d);
  const fade = (l, t0, d = 0.5) => clamp((l - t0) / d);

  // ---------- gambar dasar ----------
  const STARS = (() => { const r = rng(7); return Array.from({ length: 160 }, () => [r() * W, r() * HH * 0.7, r() * 1.5 + 0.3, r() * 6.28]); })();
  function bg(ctx, t, opt = {}) {
    const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, opt.top || P.bg0); g.addColorStop(1, opt.bot || P.bg1);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
    const a = opt.stars == null ? 0.5 : opt.stars; if (a > 0) { ctx.fillStyle = "#FFFFFF"; STARS.forEach(([x, y, r, ph]) => { ctx.globalAlpha = a * (0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.9 + ph))); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }); ctx.globalAlpha = 1; }
  }
  function hexA(hex, a) { if (hex.startsWith("rgba")) return hex; const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${clamp(a)})`; }
  function glow(ctx, x, y, r, col, a = 1) { if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, 0.9 * a)); g.addColorStop(0.35, hexA(col, 0.35 * a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
  function vignette(ctx, a = 0.32) { const g = ctx.createRadialGradient(W / 2, HH / 2, HH * 0.42, W / 2, HH / 2, HH * 1.0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); }
  const txt = (ctx, s, x, y, size, opt = {}) => H.text(ctx, s, x, y, size, { color: P.ink, weight: 800, ...opt });
  function cam(ctx, c, fn) { ctx.save(); ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); fn(); ctx.restore(); }
  function path(keys, t) {
    if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], z: keys[0][3] };
    for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, x0, y0, z0] = keys[i - 1], [t1, x1, y1, z1] = keys[i]; const u = eio((t - t0) / (t1 - t0)); return { x: lerp(x0, x1, u), y: lerp(y0, y1, u), z: Math.exp(lerp(Math.log(z0), Math.log(z1), u)) }; }
    const k = keys[keys.length - 1]; return { x: k[1], y: k[2], z: k[3] };
  }
  function pill(ctx, s, cx, cy, opt = {}) {
    const size = opt.size || 44; ctx.font = `800 ${size}px ${K.FONT}`; const w = ctx.measureText(s).width + size * 1.2, h = size * 1.7;
    ctx.fillStyle = opt.fill || P.panel; H.rr(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill();
    if (opt.stroke) { ctx.strokeStyle = opt.stroke; ctx.lineWidth = 3; ctx.stroke(); }
    txt(ctx, s, cx, cy + size * 0.36, size, { align: "center", color: opt.color || P.ink }); return w;
  }
  function panel(ctx, x, y, w, h, opt = {}) { ctx.fillStyle = opt.fill || P.panel; H.rr(ctx, x, y, w, h, opt.r || 24); ctx.fill(); if (opt.stroke !== false) { ctx.strokeStyle = opt.stroke || P.line; ctx.lineWidth = opt.lw || 2; ctx.stroke(); } }
  const bip = (ctx, x, y, s, opt) => TK.helpers.bip(ctx, x, y, s, opt);
  // label besar (≥44 px) dengan latar, untuk nama benda/angka; digambar lewat D.post supaya di atas vignette
  function label(ctx, s, x, y, opt = {}) { const size = Math.max(44, opt.size || 48); return pill(ctx, s, x, y, { size, fill: opt.fill || "rgba(10,18,52,0.9)", stroke: opt.stroke || hexA(opt.col || P.amber, 0.9), color: opt.color || P.ink }); }
  // judul kecil di pojok kiri atas: maksimal satu per bab
  function kicker(ctx, l, t0, big, small, a = 1) {
    const u = l - t0; if (u <= 0 || a <= 0) return; const s = spring(u);
    ctx.save(); ctx.globalAlpha *= clamp(u / 0.25) * a; ctx.translate(SAFE.x, 168); ctx.scale(lerp(0.85, 1, s), lerp(0.85, 1, s));
    txt(ctx, big, 0, 0, 80, { weight: 900 }); if (small) txt(ctx, small, 2, 58, 40, { weight: 700, color: P.ink2 });
    ctx.fillStyle = P.amber; ctx.fillRect(2, small ? 84 : 28, 150 * clamp(u / 0.6), 7); ctx.restore();
  }

  // ---------- lapisan sesudah vignette ----------
  let POST = [];
  const post = fn => POST.push(fn);

  // ---------- kartu bab: singkat, gelap penuh, memudar ke adegan baru ----------
  function chapterCard(ctx, num, title, a, t) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    { const g = ctx.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, "#1E2C66"); g.addColorStop(1, "#2C3F86"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH); }
    glow(ctx, W / 2, HH / 2, 640, P.violet, 0.4);
    const r = 70; ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(W / 2, HH / 2 - 140, r, 0, 6.283); ctx.fill();
    txt(ctx, String(num), W / 2, HH / 2 - 140 + 34, 96, { align: "center", weight: 900, color: "#10142E" });
    txt(ctx, title, W / 2, HH / 2 + 70, 120, { align: "center", weight: 900, fit: 1640 });
    ctx.fillStyle = P.amber; ctx.fillRect(W / 2 - 90, HH / 2 + 118, 180, 7);
    ctx.restore();
  }
  const CARD_SKIP = s => /^penutup$/i.test(String(s || "").trim());

  function beatAt(TL, t) { let b = TL.beats[0]; for (const x of TL.beats) { if (t >= x.start) b = x; else break; } return b; }
  const TR = 0.5;   // lama silang-pudar antarbeat
  let off = null;
  function drawScene(ctx, b, l, t, TL) {
    const fn = K.SCENES[b.scene]; ctx.save();
    // kamera bawaan: dorong-masuk pelan 3,5% sepanjang beat (adegan 3D dan adegan yang menyetel fn.noCam tidak terkena)
    if (fn && !fn.noCam && !b.noCam) { const u = eio(clamp(l / Math.max(1, b.dur))), z = 1 + 0.035 * u * (b.zoom == null ? 1 : b.zoom); const [fx, fy] = b.focus || [W / 2, HH / 2];
      ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy); }
    if (fn) fn(ctx, b, l, t, TL); else bg(ctx, t);
    ctx.restore();
  }
  K.draw = function (ctx, t, TL) {
    const b = beatAt(TL, t), l = t - b.start, i = TL.beats.indexOf(b), pv = TL.beats[i - 1], nx = TL.beats[i + 1];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); POST = [];
    drawScene(ctx, b, l, t, TL);
    // transisi dari beat sebelumnya (kecuali sesudah kartu bab, yang sudah menutup layar)
    const cardBefore = pv && pv.seg !== b.seg && !CARD_SKIP(TL.segments[b.seg]);
    const kind = b.trans || "pudar";
    if (pv && l < TR && kind !== "potong" && !cardBefore) {
      off = off || Object.assign(document.createElement("canvas"), { width: W, height: HH }); const o = off.getContext("2d");
      o.setTransform(1, 0, 0, 1, 0, 0); const keep = POST; POST = []; drawScene(o, pv, l + pv.dur, t, TL); POST = keep;
      const u = eio(l / TR);
      ctx.save(); ctx.globalAlpha = 1 - u; ctx.drawImage(off, kind === "geser" ? -u * W * 0.35 : 0, 0); ctx.restore();
    }
    vignette(ctx);
    POST.forEach(fn => { ctx.save(); fn(ctx); ctx.restore(); });
    // label dramatisasi pada beat suara tokoh (dialog dibuat AI)
    if (b.suara) { const a = Math.min(fade(l, 0, 0.3), 1); ctx.save(); ctx.globalAlpha = a; pill(ctx, "Dramatisasi · suara dibuat AI", W - SAFE.x - 400, 118, { size: 40, fill: "rgba(10,18,52,0.85)", stroke: hexA(P.pink, 0.8) }); ctx.restore(); }
    // kartu bab: di ekor beat terakhir bab, lalu memudar di awal beat pertama bab berikutnya
    if (nx && nx.seg !== b.seg && !CARD_SKIP(TL.segments[nx.seg])) { const s0 = speechEnd(b) + 0.3; const a = clamp((l - s0) / 0.35); chapterCard(ctx, nx.seg, TL.segments[nx.seg], a, t); }
    if (cardBefore && l < 0.6) chapterCard(ctx, b.seg, TL.segments[b.seg], 1 - eio(l / 0.6), t);
    ctx.restore(); return b;
  };
  K.dok = { P, W, HH, SAFE, clamp, lerp, sm, eio, eout, spring, rng, A, lead, at, atEnd, word, speechEnd, pr, fade, bg, glow, hexA, vignette, txt, cam, path, pill, panel, bip, label, kicker, post, chapterCard,
    neuron: () => {} };
})(typeof window !== "undefined" ? window : globalThis);
