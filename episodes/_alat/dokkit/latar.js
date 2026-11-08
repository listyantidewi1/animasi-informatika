/* dokkit/latar.js — set latar penuh 1920x1080 untuk dokumenter D03 (gaya vektor datar ala Kurzgesagt, palet sedikit lebih terang).
   Setiap set punya 3 lapisan paralaks (jauh, tengah, dekat) yang digeser opt.px (−1..1; positif = kamera bergeser ke kanan).
   Semua fungsi set menggambar satu frame penuh dan mengembalikan {floorY, anchors} dalam koordinat layar (sudah termasuk geseran paralaks
   lapisan tengah) supaya adegan bisa menaruh tokoh/benda. opt.near === false: lapisan dekat tidak digambar; panggil latar.depan(ctx, set, t, opt)
   sesudah tokoh supaya benda latar depan menutupi tokoh.
   API: kamar, kamarAnak, dinding, lewatDinding, selimut, kampung, dapur, ruangMakan, studio, depan, showcase. */
(function (g) {
  const K = g.Kiko, D = K.dok, H = K.helpers, P = D.P, W = 1920, HH = 1080, TAU = Math.PI * 2;
  K.kit = K.kit || {};

  // ---------- warna ----------
  const _hc = {};
  function hx(c) { let v = _hc[c]; if (!v) { const n = parseInt(c.slice(1), 16); v = _hc[c] = [n >> 16 & 255, n >> 8 & 255, n & 255]; } return v; }
  const _mc = {};
  function mix(a, b, u) {
    u = D.clamp(u); const key = a + b + (u * 1000 | 0); let r = _mc[key]; if (r) return r;
    const A = hx(a), B = hx(b); r = "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join(""); _mc[key] = r; return r;
  }
  const lt = (c, u) => mix(c, "#FFFFFF", u), dk = (c, u) => mix(c, "#161C4A", u), rgba = (c, a) => D.hexA(c, a);

  // ---------- pembantu gambar ----------
  function lin(ctx, x0, y0, x1, y1, st) { const gr = ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(s => gr.addColorStop(s[0], s[1])); return gr; }
  function rr(ctx, x, y, w, h, r, fill) { if (w < 0) { x += w; w = -w; } H.rr(ctx, x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); if (fill) { ctx.fillStyle = fill; ctx.fill(); } }
  function ell(ctx, x, y, rx, ry, fill, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } }
  function circ(ctx, x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.1, r), 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } }
  function poly(ctx, pts, fill) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } }
  function line(ctx, x0, y0, x1, y1, col, w) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
  function shadow(ctx, x, y, rx, ry, a = 0.35) {
    if (rx <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, `rgba(16,20,60,${a})`); gr.addColorStop(1, "rgba(16,20,60,0)");
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
  }
  function light(ctx, x, y, r, col, a) { if (a <= 0.002) return; ctx.save(); ctx.globalCompositeOperation = "screen"; D.glow(ctx, x, y, r, col, a); ctx.restore(); }
  function cone(ctx, x, y, w0, w1, h, col, a) {   // berkas cahaya trapesium dari (x,y) sepanjang h (negatif = ke atas)
    if (a <= 0.002) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, rgba(col, a)], [1, rgba(col, 0)]]);
    poly(ctx, [[x - w0 / 2, y], [x + w0 / 2, y], [x + w1 / 2, y + h], [x - w1 / 2, y + h]]); ctx.fill(); ctx.restore();
  }
  const DEP = { far: 26, mid: 60, near: 160 };
  const shift = (opt, k) => -(opt.px || 0) * DEP[k];
  function lay(ctx, dx, fn) { ctx.save(); ctx.translate(dx, 0); fn(); ctx.restore(); }
  const flick = (t, s = 1) => 1 + 0.025 * Math.sin(t * 13.1 + s) * Math.sin(t * 7.7 + s * 2) + 0.012 * Math.sin(t * 31 + s);

  // pola dinding (titik/belah ketupat samar), di-cache per warna
  const PAT = {};
  function wallPattern(ctx, col, kind) {
    const key = col + kind; if (PAT[key] !== undefined) return PAT[key];
    if (typeof document === "undefined") return (PAT[key] = null);
    const c = document.createElement("canvas"); c.width = c.height = 72; const o = c.getContext("2d");
    o.fillStyle = col;
    if (kind === "titik") { o.beginPath(); o.arc(18, 18, 3.2, 0, TAU); o.arc(54, 54, 3.2, 0, TAU); o.fill(); }
    else if (kind === "ketupat") { [[36, 6], [0, 42], [72, 42]].forEach(([x, y]) => { o.beginPath(); o.moveTo(x, y); o.lineTo(x + 7, y + 10); o.lineTo(x, y + 20); o.lineTo(x - 7, y + 10); o.closePath(); o.fill(); }); }
    else { o.fillRect(34, 0, 4, 72); }
    return (PAT[key] = ctx.createPattern(c, "repeat"));
  }
  function wall(ctx, y1, top, bot, pat, patCol, patA = 0.07) {
    ctx.fillStyle = lin(ctx, 0, 0, 0, y1, [[0, top], [1, bot]]); ctx.fillRect(-500, -10, W + 1000, y1 + 10);
    const p = pat && wallPattern(ctx, patCol, pat); if (p) { ctx.save(); ctx.globalAlpha = patA; ctx.fillStyle = p; ctx.fillRect(-500, 0, W + 1000, y1); ctx.restore(); }
  }
  // lantai keramik dengan perspektif; garis memudar ke bawah supaya 200 px terbawah tenang
  function floor(ctx, y0, col, dx, opt = {}) {
    ctx.fillStyle = lin(ctx, 0, y0, 0, HH, [[0, lt(col, 0.1)], [0.4, col], [1, dk(col, 0.1)]]); ctx.fillRect(-500, y0, W + 1000, HH - y0 + 10);
    ctx.save(); ctx.beginPath(); ctx.rect(-500, y0, W + 1000, HH - y0 + 10); ctx.clip();
    const lc = lt(col, 0.45); ctx.strokeStyle = lin(ctx, 0, y0, 0, HH, [[0, rgba(lc, 0.32)], [0.45, rgba(lc, 0.12)], [1, rgba(lc, 0.02)]]); ctx.lineWidth = 2;
    const vx = W / 2 - dx * 0.8, vy = y0 - 900, tile = opt.tile || 210; ctx.beginPath();
    for (let i = -14; i <= 14; i++) { const xb = vx + i * tile * 1.45; const xa = vx + (xb - vx) * (y0 - vy) / (HH - vy); ctx.moveTo(xa, y0); ctx.lineTo(xb, HH); }
    for (let n = 1; n < 12; n++) { const y = y0 + n * (16 + n * 7); if (y > HH) break; ctx.moveTo(-500, y); ctx.lineTo(W + 500, y); }
    ctx.stroke();
    // bayangan kontak di kaki dinding + pantulan cahaya samar
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + 60, [[0, "rgba(16,20,60,0.35)"], [1, "rgba(16,20,60,0)"]]); ctx.fillRect(-500, y0, W + 1000, 60);
    ctx.restore();
    // plint
    ctx.fillStyle = dk(opt.wall || col, 0.18); ctx.fillRect(-500, y0 - 16, W + 1000, 16); ctx.fillStyle = rgba("#FFFFFF", 0.1); ctx.fillRect(-500, y0 - 16, W + 1000, 3);
  }

  // ---------- langit malam dilihat dari jendela (lapisan jauh) ----------
  const STAR = (() => { const r = D.rng(31); return Array.from({ length: 90 }, () => [r(), r(), r() * 1.7 + 0.7, r() * 6.28]); })();
  function palm(ctx, x, y, h, col, t, ph = 0) {
    const sw = Math.sin(t * 0.8 + ph) * 0.04;
    ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineWidth = h * 0.05;
    const tx = x + h * 0.12, ty = y - h; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * 0.02, y - h * 0.6, tx, ty); ctx.stroke();
    ctx.fillStyle = col;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.48 + sw * (1 + i * 0.1), L = h * (0.42 + 0.06 * (i % 2));
      ctx.save(); ctx.translate(tx, ty); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(0, -h * 0.015); ctx.quadraticCurveTo(L * 0.5, -h * 0.1, L, h * 0.08 + Math.abs(i - 3) * h * 0.03); ctx.quadraticCurveTo(L * 0.5, h * 0.02, 0, h * 0.015); ctx.fill(); ctx.restore();
    }
  }
  function nightView(ctx, x, y, w, h, t, off) {
    ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, "#2F4295"], [0.65, "#4C62BA"], [1, "#7486D2"]]); ctx.fillRect(x - 10, y - 10, w + 20, h + 20);
    ctx.save(); ctx.translate(off, 0);
    ctx.fillStyle = "#FFFFFF";
    STAR.forEach(([u, v, r, ph]) => { ctx.globalAlpha = 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.3 + ph * 3)); circ(ctx, x - 60 + u * (w + 120), y + v * h * 0.55, r * 0.8); ctx.fill(); });
    ctx.globalAlpha = 1;
    const mx = x + w * 0.3, my = y + h * 0.25, mr = Math.min(w, h) * 0.085;
    D.glow(ctx, mx, my, mr * 5, "#BFD3FF", 0.55); circ(ctx, mx, my, mr, "#FFF5DC"); circ(ctx, mx + mr * 0.3, my - mr * 0.2, mr * 0.22, "#F1E3C0"); circ(ctx, mx - mr * 0.35, my + mr * 0.3, mr * 0.15, "#F1E3C0");
    // awan tipis berjalan
    const cx = x + ((t * 9) % (w + 300)) - 150; ctx.fillStyle = rgba("#A9BCF0", 0.35); rr(ctx, cx, y + h * 0.4, 160, 22, 11); ctx.fill(); rr(ctx, cx + 40, y + h * 0.4 - 14, 90, 22, 11); ctx.fill();
    // atap-atap tetangga
    const by = y + h; const rc = "#3A4996", rc2 = "#33408A"; let hx0 = x - 80; const r = D.rng(5);
    for (let i = 0; i < 7; i++) {
      const hw = 110 + r() * 70, hh = h * (0.16 + r() * 0.1), top = by - hh;
      ctx.fillStyle = i % 2 ? rc : rc2; ctx.fillRect(hx0, top, hw, hh + 10);
      poly(ctx, [[hx0 - 12, top + 2], [hx0 + hw * 0.5, top - hh * 0.55], [hx0 + hw + 12, top + 2]], dk(rc, 0.12));
      if (r() > 0.3) { const wa = 0.75 + 0.25 * Math.sin(t * 0.6 + i); ctx.fillStyle = rgba("#FFC66E", wa); rr(ctx, hx0 + hw * 0.3, top + hh * 0.3, 18, 22, 3); ctx.fill(); light(ctx, hx0 + hw * 0.3 + 9, top + hh * 0.3 + 11, 40, "#FFB547", 0.25); }
      hx0 += hw + 6;
    }
    palm(ctx, x + w * 0.83, by + 4, h * 0.62, "#34428F", t, 1);
    // lampu jalan jauh
    const lx = x + w * 0.62, ly = by - h * 0.36; line(ctx, lx, ly, lx, by, "#2E3B84", 5); light(ctx, lx, ly, 70, "#FFB547", 0.7 * flick(t, 3)); circ(ctx, lx, ly, 6, "#FFE3A8");
    ctx.restore();
  }
  // kusen jendela kayu + lubang angin + kaca
  function windowFrame(ctx, x, y, w, h, t, frame, viewFn) {
    const f = 18, fc = frame, hi = lt(frame, 0.2), lo = dk(frame, 0.2);
    // lubang angin di atas jendela
    rr(ctx, x - f, y - 92, w + 2 * f, 54, 6, fc);
    ctx.fillStyle = dk(fc, 0.45); for (let i = 0; i < Math.floor((w - 10) / 34); i++) { rr(ctx, x + 6 + i * 34, y - 82, 22, 34, 4); ctx.fill(); }
    ctx.fillStyle = hi; ctx.fillRect(x - f, y - 92, w + 2 * f, 3);
    // kusen
    rr(ctx, x - f, y - f, w + 2 * f, h + 2 * f, 8, fc); ctx.fillStyle = hi; ctx.fillRect(x - f, y - f, w + 2 * f, 4); ctx.fillStyle = lo; ctx.fillRect(x - f + 2, y + h, w + 2 * f - 4, f);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); viewFn();
    // pantulan kaca
    ctx.fillStyle = "rgba(255,255,255,0.07)"; poly(ctx, [[x + w * 0.1, y + h], [x + w * 0.35, y], [x + w * 0.48, y], [x + w * 0.23, y + h]]); ctx.fill();
    poly(ctx, [[x + w * 0.55, y + h], [x + w * 0.8, y], [x + w * 0.85, y], [x + w * 0.6, y + h]]); ctx.fill();
    ctx.restore();
    // jeruji kusen
    ctx.fillStyle = fc; ctx.fillRect(x + w / 2 - 7, y, 14, h); ctx.fillRect(x, y + h * 0.42 - 6, w, 12);
    ctx.fillStyle = hi; ctx.fillRect(x + w / 2 - 7, y, 3, h); ctx.fillRect(x, y + h * 0.42 - 6, w, 3);
    // ambang
    rr(ctx, x - f - 22, y + h + f - 4, w + 2 * f + 44, 18, 5, hi); ctx.fillStyle = lo; ctx.fillRect(x - f - 18, y + h + f + 14, w + 2 * f + 36, 6);
  }
  // tirai berlipit, terikat; side −1 = panel kiri (terkumpul ke kiri), +1 = panel kanan
  function curtain(ctx, xo, wdt, top, bot, t, col, side, ph = 0, open = 1) {
    const sw = Math.sin(t * 0.65 + ph) * 7, tieY = top + (bot - top) * 0.58;
    const inner = xo + side * wdt, tie = xo + side * wdt * (1 - 0.6 * open), hem = xo + side * wdt * (1 - 0.3 * open) + sw;
    ctx.save(); ctx.beginPath(); ctx.moveTo(xo, top); ctx.lineTo(inner, top);
    ctx.bezierCurveTo(inner, top + 80, tie, tieY - 120, tie, tieY);
    ctx.bezierCurveTo(tie, tieY + 60, hem, bot - 60, hem, bot);
    ctx.quadraticCurveTo((xo + hem) / 2, bot + 10, xo - side * 6 + sw * 0.3, bot - 4); ctx.closePath();
    ctx.fillStyle = lin(ctx, xo, 0, inner, 0, [[0, dk(col, 0.12)], [0.6, col], [1, lt(col, 0.12)]]); ctx.fill(); ctx.clip();
    // lipit
    for (let i = 0; i < 6; i++) {
      const u = (i + 0.5) / 6, x0 = xo + side * wdt * u, x1 = xo + side * (wdt * (1 - 0.6 * open) * u + 4), x2 = xo + side * (wdt * (1 - 0.3 * open) * u) + sw * u;
      ctx.strokeStyle = rgba(dk(col, 0.3), 0.55); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x0, top); ctx.bezierCurveTo(x0, top + 120, x1, tieY - 100, x1, tieY); ctx.bezierCurveTo(x1, tieY + 70, x2, bot - 60, x2, bot + 10); ctx.stroke();
      ctx.strokeStyle = rgba(lt(col, 0.3), 0.35); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 + side * 12, top); ctx.bezierCurveTo(x0 + side * 12, top + 120, x1 + side * 8, tieY - 100, x1 + side * 8, tieY); ctx.bezierCurveTo(x1 + side * 8, tieY + 70, x2 + side * 12, bot - 60, x2 + side * 12, bot + 10); ctx.stroke();
    }
    ctx.restore();
    // tali pengikat
    rr(ctx, Math.min(xo, tie) - 4, tieY - 9, Math.abs(tie - xo) + 8, 18, 9, lt(col, 0.35));
  }
  function rod(ctx, x0, x1, y, col) { rr(ctx, x0, y - 6, x1 - x0, 12, 6, col); circ(ctx, x0, y, 13, lt(col, 0.15)); circ(ctx, x1, y, 13, lt(col, 0.15)); }

  // ---------- perabot ----------
  function clock(ctx, x, y, r, t, jam) {
    shadow(ctx, x + 6, y + 10, r * 1.1, r * 1.1, 0.25);
    circ(ctx, x, y, r, "#E59A52"); circ(ctx, x, y, r * 0.86, "#FFF4E2"); circ(ctx, x - r * 0.08, y - r * 0.1, r * 0.7, "rgba(255,255,255,0.35)");
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.save(); ctx.translate(x, y); ctx.rotate(a); rr(ctx, -2.5, -r * 0.76, 5, i % 3 ? r * 0.08 : r * 0.15, 2, "#3A3F7A"); ctx.restore(); }
    const tot = jam * 3600 + t, hA = (tot / 3600) % 12 / 12 * TAU, mA = (tot / 60) % 60 / 60 * TAU;
    const s = Math.floor(t), sA = (s + D.spring(t - s, 26, 0.5)) / 60 * TAU;
    const hand = (a, L, w, c) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); rr(ctx, -w / 2, -L, w, L + w, w / 2, c); ctx.restore(); };
    hand(hA, r * 0.45, 9, "#2E3370"); hand(mA, r * 0.66, 6, "#2E3370"); hand(sA, r * 0.7, 2.5, P.pink); circ(ctx, x, y, 6, P.pink);
  }
  function tableLamp(ctx, x, y, t, on, col) {   // y = permukaan meja
    shadow(ctx, x, y, 60, 8, 0.4);
    ell(ctx, x, y - 8, 46, 12, dk(col, 0.25)); rr(ctx, x - 40, y - 20, 80, 14, 7, dk(col, 0.1));
    ell(ctx, x, y - 52, 26, 34, col); ell(ctx, x - 8, y - 60, 9, 14, lt(col, 0.35));
    rr(ctx, x - 5, y - 110, 10, 30, 3, "#C9B79A");
    const st = y - 200, sb = y - 106; const on2 = D.clamp(on) * flick(t);
    if (on2 > 0.01) { cone(ctx, x, sb, 150, 360, 140, "#FFD38A", 0.35 * on2); cone(ctx, x, st, 96, 220, -150, "#FFD38A", 0.22 * on2); }
    poly(ctx, [[x - 50, st], [x + 50, st], [x + 80, sb], [x - 80, sb]], mix("#C79B86", "#FFE3B0", on2));
    poly(ctx, [[x - 50, st], [x - 30, st], [x - 52, sb], [x - 80, sb]], mix("#B08079", "#FFD08A", on2));
    ctx.fillStyle = rgba("#FFFFFF", 0.25 + 0.3 * on2); ctx.fillRect(x - 50, st, 100, 4);
    if (on2 > 0.01) { ell(ctx, x, sb, 80, 9, rgba("#FFF4D0", 0.9 * on2)); }
    else ell(ctx, x, sb, 80, 9, "#8E6A72");
    return { x, y: (st + sb) / 2 };
  }
  function phoneFlat(ctx, x, y, t, glow, ring) {   // HP tergeletak di permukaan (y), tampak samping-atas
    const j = ring ? Math.sin(t * 70) * 3 * ring * (Math.sin(t * 6) > 0 ? 1 : 0) : 0;
    ctx.save(); ctx.translate(x + j, y);
    shadow(ctx, 0, 0, 52, 6, 0.45);
    rr(ctx, -46, -12, 92, 12, 5, "#2B2F66"); rr(ctx, -44, -16, 88, 8, 4, mix("#3B427E", "#BFFBF4", glow));
    ctx.restore();
    if (glow > 0.01) { cone(ctx, x + j, y - 14, 80, 520, -460, "#9FF0FF", 0.28 * glow); light(ctx, x + j, y - 12, 230, "#7FE6F0", 0.55 * glow); }
  }
  function nightstand(ctx, x, top, fy, w, col) {
    shadow(ctx, x + w / 2, fy, w * 0.6, 12, 0.4);
    ctx.fillStyle = dk(col, 0.25); ctx.fillRect(x + 14, fy - 22, 14, 22); ctx.fillRect(x + w - 28, fy - 22, 14, 22);
    rr(ctx, x, top + 8, w, fy - top - 28, 10, col); ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, rgba("#FFFFFF", 0.08)], [1, rgba("#000000", 0.08)]]); ctx.fill();
    rr(ctx, x - 10, top, w + 20, 18, 7, lt(col, 0.18)); ctx.fillStyle = rgba("#FFFFFF", 0.25); ctx.fillRect(x - 6, top, w + 12, 3);
    const dh = (fy - top - 60) / 2;
    for (let i = 0; i < 2; i++) { const yy = top + 30 + i * (dh + 4); rr(ctx, x + 14, yy, w - 28, dh - 6, 6, lt(col, 0.07)); rr(ctx, x + w / 2 - 22, yy + dh / 2 - 8, 44, 10, 5, lt(col, 0.4)); }
  }
  function frameArt(ctx, x, y, w, h, kind, t) {
    shadow(ctx, x + w / 2 + 8, y + h / 2 + 12, w * 0.6, h * 0.6, 0.18);
    rr(ctx, x, y, w, h, 6, "#E8C489"); rr(ctx, x + 12, y + 12, w - 24, h - 24, 3, "#FFF6E6");
    ctx.save(); ctx.beginPath(); ctx.rect(x + 22, y + 22, w - 44, h - 44); ctx.clip(); const ix = x + 22, iy = y + 22, iw = w - 44, ih = h - 44;
    if (kind === "gunung") {
      ctx.fillStyle = lin(ctx, 0, iy, 0, iy + ih, [[0, "#8FD3F0"], [1, "#FFD6A8"]]); ctx.fillRect(ix, iy, iw, ih);
      circ(ctx, ix + iw * 0.72, iy + ih * 0.35, ih * 0.16, "#FFB547");
      poly(ctx, [[ix - 10, iy + ih], [ix + iw * 0.35, iy + ih * 0.3], [ix + iw * 0.7, iy + ih]], "#5B7BC9");
      poly(ctx, [[ix + iw * 0.35, iy + ih], [ix + iw * 0.7, iy + ih * 0.45], [ix + iw + 10, iy + ih]], "#4A66B0");
      poly(ctx, [[ix + iw * 0.27, iy + ih * 0.45], [ix + iw * 0.35, iy + ih * 0.3], [ix + iw * 0.43, iy + ih * 0.45]], "#FFFFFF");
      ctx.fillStyle = "#3FB48A"; ctx.fillRect(ix, iy + ih * 0.85, iw, ih * 0.15);
    } else if (kind === "keluarga") {
      ctx.fillStyle = "#F7D9B8"; ctx.fillRect(ix, iy, iw, ih);
      const n = 3, cols = ["#5B7BC9", "#FF6F91", "#3FB48A"], sk = ["#8A5A3C", "#B07850", "#9C6A45"];
      for (let i = 0; i < n; i++) { const px = ix + iw * (0.22 + i * 0.28), s = i === 2 ? 0.75 : 1, b = iy + ih;
        rr(ctx, px - 26 * s, b - 70 * s, 52 * s, 80 * s, 24 * s, cols[i]); circ(ctx, px, b - 92 * s, 22 * s, sk[i]);
        if (i === 1) { ctx.fillStyle = "#6E5BC0"; ctx.beginPath(); ctx.arc(px, b - 94 * s, 26 * s, Math.PI * 1.02, Math.PI * 1.98); ctx.lineTo(px + 28 * s, b - 60 * s); ctx.lineTo(px - 28 * s, b - 60 * s); ctx.closePath(); ctx.fill(); circ(ctx, px, b - 90 * s, 17 * s, sk[i]); } }
    } else if (kind === "bunga") {
      ctx.fillStyle = "#CDE9E4"; ctx.fillRect(ix, iy, iw, ih);
      rr(ctx, ix + iw * 0.35, iy + ih * 0.62, iw * 0.3, ih * 0.38, 8, "#E59A52");
      line(ctx, ix + iw * 0.5, iy + ih * 0.64, ix + iw * 0.5, iy + ih * 0.32, "#3FB48A", 5);
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; circ(ctx, ix + iw * 0.5 + Math.cos(a) * 16, iy + ih * 0.3 + Math.sin(a) * 16, 13, "#FF6F91"); } circ(ctx, ix + iw * 0.5, iy + ih * 0.3, 10, "#FFD38A");
    }
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.15)"; poly(ctx, [[x + 22, y + h - 22], [x + w * 0.5, y + 22], [x + w * 0.62, y + 22], [x + 22 + w * 0.12, y + h - 22]]); ctx.fill();
  }
  // tempat tidur tampak samping; mengembalikan koordinat penting
  function bed(ctx, o, t) {
    const { x0, x1, top, fy } = o, mh = 64, hl = o.head !== "kanan", col = o.frame, d = dk(col, 0.22), hi = lt(col, 0.18);
    shadow(ctx, (x0 + x1) / 2, fy, (x1 - x0) * 0.56, 20, 0.45);
    const legs = [x0 + 40, x1 - 60]; ctx.fillStyle = d; legs.forEach(lx => rr(ctx, lx, top + mh + 30, 22, fy - top - mh - 30, 6, d));
    rr(ctx, x0 + 10, top + mh - 6, x1 - x0 - 20, 46, 12, col); ctx.fillStyle = hi; ctx.fillRect(x0 + 20, top + mh - 6, x1 - x0 - 40, 4);
    // sandaran kepala dan kaki
    const hx = hl ? x0 : x1 - 64, fx = hl ? x1 - 44 : x0;
    rr(ctx, hx, top - 210, 64, fy - top + 210, 26, col); ctx.fillStyle = hi; rr(ctx, hx + 8, top - 200, 14, fy - top + 170, 7); ctx.fill();
    rr(ctx, hx + 12, top - 170, 40, 120, 16, dk(col, 0.1));
    rr(ctx, fx, top - 50, 44, fy - top + 50, 18, col); ctx.fillStyle = hi; rr(ctx, fx + 6, top - 42, 10, fy - top + 20, 5); ctx.fill();
    // kasur
    const mx0 = hl ? x0 + 56 : x0 + 40, mx1 = hl ? x1 - 40 : x1 - 56;
    rr(ctx, mx0, top, mx1 - mx0, mh, 24, o.sheet); ctx.fillStyle = lin(ctx, 0, top, 0, top + mh, [[0, "rgba(255,255,255,0.22)"], [0.3, "rgba(255,255,255,0)"], [1, "rgba(20,24,70,0.18)"]]); rr(ctx, mx0, top, mx1 - mx0, mh, 24); ctx.fill();
    ctx.strokeStyle = rgba(dk(o.sheet, 0.25), 0.5); ctx.lineWidth = 3; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(mx0 + 24, top + mh * 0.62); ctx.lineTo(mx1 - 24, top + mh * 0.62); ctx.stroke(); ctx.setLineDash([]);
    // bantal
    const pw = 190, px0 = hl ? mx0 + 14 : mx1 - 14 - pw; const breath = Math.sin(t * 0.9) * 1.5;
    ctx.save(); ctx.translate(px0 + pw / 2, top - 22 + breath * 0.2); ctx.rotate(hl ? -0.05 : 0.05);
    rr(ctx, -pw / 2, -30, pw, 58, 29, o.pillow); rr(ctx, -pw / 2 + 14, -26, pw - 60, 14, 7, rgba("#FFFFFF", 0.4)); ctx.fillStyle = rgba(dk(o.pillow, 0.3), 0.4); rr(ctx, -pw / 2 + 10, 14, pw - 20, 10, 5); ctx.fill(); ctx.restore();
    // selimut terlipat di ujung kaki
    if (o.fold) { const fw = o.fold, fx0 = hl ? mx1 - fw : mx0, bc = o.blanket;
      rr(ctx, fx0 - 6, top - 26, fw + 12, 40, 18, lt(bc, 0.1)); rr(ctx, fx0 - 6, top - 6, fw + 12, mh + 26, 20, bc);
      ctx.fillStyle = rgba(dk(bc, 0.3), 0.6); for (let i = 1; i < 4; i++) ctx.fillRect(fx0 + i * fw / 4, top + 4, 6, mh + 10);
      ctx.fillStyle = rgba("#FFFFFF", 0.25); ctx.fillRect(fx0 + 6, top - 22, fw - 12, 5); }
    return { mx0, mx1, top, pillow: { x: px0 + pw / 2, y: top - 22 } };
  }
  function blanket(ctx, x0, x1, top, mh, col, t, hl, pat) {   // selimut penuh menutupi tubuh berbaring (kepala di sisi bantal)
    const br = Math.sin(t * 1.2) * 3, a = hl ? x0 : x1, b = hl ? x1 : x0, s = hl ? 1 : -1, L = Math.abs(x1 - x0);
    ctx.save(); ctx.beginPath();
    ctx.moveTo(a, top - 24);
    ctx.bezierCurveTo(a + s * L * 0.08, top - 70 - br, a + s * L * 0.28, top - 80 - br, a + s * L * 0.42, top - 66 - br * 0.6);
    ctx.bezierCurveTo(a + s * L * 0.58, top - 52, a + s * L * 0.72, top - 44, a + s * L * 0.86, top - 50);
    ctx.bezierCurveTo(a + s * L * 0.95, top - 54, b + s * 14, top - 30, b + s * 14, top + 6);
    ctx.lineTo(b + s * 18, top + mh + 32); ctx.quadraticCurveTo((a + b) / 2, top + mh + 48, a - s * 6, top + mh + 34); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, top - 80, 0, top + mh + 50, [[0, lt(col, 0.2)], [0.4, col], [1, dk(col, 0.2)]]); ctx.fill(); ctx.clip();
    if (pat) { ctx.fillStyle = rgba(lt(col, 0.45), 0.4); for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) { circ(ctx, Math.min(a, b) + 20 + i * 48 + (j % 2) * 24, top - 50 + j * 40, 6); ctx.fill(); } }
    // bayangan sisi kasur dan kerutan lembut
    ctx.fillStyle = rgba(dk(col, 0.35), 0.35); ctx.fillRect(Math.min(a, b) - 20, top + 6, L + 40, mh + 60);
    ctx.strokeStyle = rgba(lt(col, 0.35), 0.5); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(a + s * L * 0.15, top - 52); ctx.quadraticCurveTo(a + s * L * 0.3, top - 70, a + s * L * 0.4, top - 60); ctx.stroke();
    ctx.restore();
    // lipatan tepi atas (dekat bantal)
    ctx.save(); ctx.beginPath(); ctx.moveTo(a - s * 6, top - 26); ctx.bezierCurveTo(a + s * 20, top - 62 - br, a + s * 58, top - 70 - br, a + s * 70, top - 62 - br);
    ctx.lineTo(a + s * 62, top + mh + 36); ctx.lineTo(a - s * 6, top + mh + 34); ctx.closePath(); ctx.fillStyle = lt(col, 0.32); ctx.fill(); ctx.restore();
  }
  function rug(ctx, x, y, rx, ry, col) { ell(ctx, x, y + 6, rx, ry, dk(col, 0.25)); ell(ctx, x, y, rx, ry, col); ell(ctx, x, y, rx * 0.8, ry * 0.7, lt(col, 0.12)); ctx.strokeStyle = rgba(lt(col, 0.4), 0.7); ctx.lineWidth = 4; ctx.setLineDash([14, 12]); ell(ctx, x, y, rx * 0.9, ry * 0.82); ctx.stroke(); ctx.setLineDash([]); }
  function door(ctx, x, y, w, h, col, open, t, spill) {   // pintu panel; open 0..1 berayun ke dalam
    rr(ctx, x - 16, y - 16, w + 32, h + 16, 6, lt(col, 0.2));
    ctx.fillStyle = "#2A3270"; ctx.fillRect(x, y, w, h);
    if (open > 0.01) {
      const sp = spill == null ? 1 : spill;
      ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, rgba("#FFC77A", 0.25 * sp)], [1, rgba("#FFD38A", 0.75 * sp)]]); ctx.fillRect(x, y, w, h);
      cone(ctx, x + w * 0.6, y + h, w * 0.9 * open, w * 2.2 * open, 160, "#FFD38A", 0.3 * sp * open);
    }
    const lw = w * (1 - 0.82 * D.clamp(open));   // daun pintu tampak menyempit saat berayun
    rr(ctx, x, y, lw, h, 4, col); ctx.fillStyle = rgba("#FFFFFF", 0.1); ctx.fillRect(x, y, Math.max(0, lw * 0.12), h);
    if (lw > 60) { rr(ctx, x + lw * 0.15, y + h * 0.07, lw * 0.7, h * 0.36, 8, dk(col, 0.1)); rr(ctx, x + lw * 0.15, y + h * 0.5, lw * 0.7, h * 0.42, 8, dk(col, 0.1)); circ(ctx, x + lw * 0.85, y + h * 0.5, 10, "#F2C66B"); circ(ctx, x + lw * 0.85 - 3, y + h * 0.5 - 3, 4, "#FFF0C0"); }
    return { x: x + w / 2, y: y + h, w, h, top: y };
  }

  // ---------- lapisan dekat (dipakai juga oleh latar.depan) ----------
  function plant(ctx, x, y, s, t, col, potCol, ph = 0) {   // tanaman berdaun lebar (seperti monstera), y = dasar pot
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const leaves = [[-0.9, 300, 1], [-0.45, 360, 1.1], [0, 330, 1], [0.4, 350, 1.05], [0.85, 290, 0.95], [-0.2, 250, 0.85], [0.6, 230, 0.8]];
    leaves.forEach(([a, L, k], i) => {
      const sw = Math.sin(t * 0.9 + i * 1.3 + ph) * 0.035;
      ctx.save(); ctx.translate(0, -150); ctx.rotate(a + sw);
      line(ctx, 0, 0, 0, -L * 0.75, dk(col, 0.2), 8);
      ctx.translate(0, -L * 0.75);
      ctx.fillStyle = i % 2 ? col : lt(col, 0.08); ell(ctx, 0, -L * 0.18, 70 * k, 105 * k); ctx.fill();
      ctx.fillStyle = rgba(lt(col, 0.4), 0.5); ell(ctx, -18 * k, -L * 0.22, 22 * k, 60 * k, null, 0.2); ctx.fill();
      line(ctx, 0, 40 * k, 0, -L * 0.18 - 90 * k, dk(col, 0.25), 4);
      ctx.restore();
    });
    shadow(ctx, 0, 0, 130, 14, 0.5);
    poly(ctx, [[-95, -170], [95, -170], [72, 0], [-72, 0]], potCol); poly(ctx, [[-95, -170], [-50, -170], [-36, 0], [-72, 0]], lt(potCol, 0.12));
    rr(ctx, -108, -190, 216, 32, 12, lt(potCol, 0.08)); ctx.fillStyle = rgba("#FFFFFF", 0.2); ctx.fillRect(-100, -190, 200, 4);
    ctx.restore();
  }
  function guitar(ctx, x, y, s, col, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    shadow(ctx, 0, 0, 90, 12, 0.4);
    rr(ctx, -14, -560, 28, 330, 8, dk(col, 0.35)); rr(ctx, -22, -620, 44, 70, 14, dk(col, 0.45));
    ctx.fillStyle = col; ell(ctx, 0, -110, 108, 120); ctx.fill(); ell(ctx, 0, -250, 82, 92); ctx.fill();
    ctx.fillStyle = lt(col, 0.15); ell(ctx, -40, -150, 30, 70, null, 0.2); ctx.fill();
    circ(ctx, 0, -190, 32, dk(col, 0.5)); rr(ctx, -38, -78, 76, 16, 6, dk(col, 0.4));
    ctx.strokeStyle = rgba("#FFFFFF", 0.4); ctx.lineWidth = 2; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 5, -600); ctx.lineTo(i * 5, -70); ctx.stroke(); }
    ctx.restore();
  }
  function bigLeaf(ctx, x, y, L, a, col, t, ph) {   // daun pisang menjuntai dari tepi bingkai
    const sw = Math.sin(t * 0.8 + ph) * 0.05; ctx.save(); ctx.translate(x, y); ctx.rotate(a + sw);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(L * 0.3, -L * 0.22, L * 0.8, -L * 0.12, L, L * 0.08);
    ctx.bezierCurveTo(L * 0.75, L * 0.12, L * 0.35, L * 0.16, 0, 0.02 * L); ctx.fill();
    ctx.strokeStyle = rgba(lt(col, 0.25), 0.7); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * 0.55, -L * 0.05, L, L * 0.08); ctx.stroke();
    ctx.strokeStyle = rgba(dk(col, 0.3), 0.6); ctx.lineWidth = 3; for (let i = 1; i < 9; i++) { const u = i / 9; ctx.beginPath(); ctx.moveTo(L * u, -L * 0.02 + L * 0.06 * u * u); ctx.lineTo(L * u + 24, -L * 0.16 * (1 - u) - 8); ctx.stroke(); }
    ctx.restore();
  }
  const NEAR = {
    kamar(ctx, t, opt) { lay(ctx, shift(opt, "near"), () => { plant(ctx, 70, HH + 70, 0.95, t, "#24566E", "#8A4E62"); }); },
    kamarAnak(ctx, t, opt) { lay(ctx, shift(opt, "near"), () => { guitar(ctx, W - 90, HH + 60, 0.9, "#A8604E", -0.14); }); },
    kampung(ctx, t, opt) { lay(ctx, shift(opt, "near"), () => {
      const c = mix("#24497A", "#1E3266", 1 - (opt.senja == null ? 0.7 : opt.senja));
      // semak gelap di pojok bawah (tepi saja, tengah bawah tetap tenang)
      [[-40, 1040, 110], [70, 1090, 90], [-70, 950, 90], [W + 30, 1050, 110], [W - 70, 1100, 80]].forEach(([x, y, r], i) => { circ(ctx, x + Math.sin(t * 0.8 + i) * 3, y, r, i % 2 ? "#22406E" : "#1F3A68"); circ(ctx, x - r * 0.3, y - r * 0.35, r * 0.45, rgba("#3E6E9A", 0.45)); }); }); },
    dapur(ctx, t, opt) { lay(ctx, shift(opt, "near"), () => { rr(ctx, -120, 90, 260, HH, 26, "#D9E2F7"); ctx.fillStyle = "#B8C3E6"; ctx.fillRect(100, 90, 40, HH); rr(ctx, 70, 380, 20, 160, 10, "#8E99C9"); ctx.fillStyle = rgba("#FFFFFF", 0.4); ctx.fillRect(-120, 110, W * 0, 0); }); },
    ruangMakan(ctx, t, opt) { lay(ctx, shift(opt, "near"), () => {
      // tanaman gantung di pojok kiri atas
      const sw = Math.sin(t * 0.7) * 6; line(ctx, 150, -10, 150 + sw * 0.3, 120, "#C9A27A", 4); ell(ctx, 150 + sw * 0.4, 150, 80, 44, "#C9705A"); ell(ctx, 150 + sw * 0.4, 132, 80, 16, "#B05E4C");
      for (let i = 0; i < 6; i++) { const x = 90 + i * 24 + sw * 0.5, L = 120 + (i % 3) * 70; ctx.strokeStyle = "#2F7C68"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, 150); ctx.quadraticCurveTo(x - 10 + Math.sin(t + i) * 6, 150 + L / 2, x + Math.sin(t * 0.8 + i) * 10, 150 + L); ctx.stroke();
        for (let k = 1; k < 5; k++) ell(ctx, x + Math.sin(t * 0.8 + i) * 10 * k / 5 + (k % 2 ? 9 : -9), 150 + L * k / 5, 12, 7, k % 2 ? "#3FA07E" : "#4FB890", k % 2 ? 0.5 : -0.5); } }); },
    studio() {},
  };
  function depan(ctx, set, t, opt = {}) { const f = NEAR[set]; if (f) { ctx.save(); f(ctx, t, opt); ctx.restore(); } }

  // ======================= SET: kamar Bu Rina =======================
  const KM = { fy: 800, win: [150, 220, 340, 330], door: [620, 280, 190, 520], ns: [860, 612, 200], bed: [1110, 1820, 650] };
  function kamar(ctx, t, opt = {}) {
    ctx.save();
    const lamp = opt.lamp == null ? 1 : D.clamp(opt.lamp), pg = D.clamp(opt.phoneGlow || 0), dm = shift(opt, "mid"), df = shift(opt, "far");
    const fy = KM.fy, [wx, wy, ww, wh] = KM.win, [nx, ntop, nw] = KM.ns, [bx0, bx1, btop] = KM.bed;
    let A;
    lay(ctx, dm, () => {
      wall(ctx, fy, "#3F4E9C", "#5767B4", "ketupat", "#9FB0F0", 0.06);
      // panel kayu (lambris) rendah
      ctx.fillStyle = "#4A57A6"; ctx.fillRect(-500, 640, W + 1000, fy - 640); ctx.fillStyle = rgba("#FFFFFF", 0.08); ctx.fillRect(-500, 640, W + 1000, 4);
      ctx.fillStyle = rgba("#2A3478", 0.25); for (let x = -480; x < W + 500; x += 90) ctx.fillRect(x, 650, 3, fy - 650);
      floor(ctx, fy, "#4B53A0", dm, { wall: "#4A57A6" });
      // sinar bulan dari jendela ke dinding & lantai
      ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = lin(ctx, 0, wy, 0, fy + 200, [[0, rgba("#A9C4FF", 0.0)], [0.4, rgba("#A9C4FF", 0.16)], [1, rgba("#A9C4FF", 0.04)]]);
      poly(ctx, [[wx, wy + wh], [wx + ww, wy + wh], [wx + ww + 420, fy + 190], [wx + 240, fy + 190]]); ctx.fill(); ctx.restore();
      light(ctx, wx + ww / 2, wy + wh / 2, 420, "#9DB8FF", 0.28);
      windowFrame(ctx, wx, wy, ww, wh, t, "#9A6A6E", () => nightView(ctx, wx, wy, ww, wh, t, df - dm));
      rod(ctx, wx - 70, wx + ww + 70, wy - 120, "#C9A27A");
      curtain(ctx, wx - 60, 120, wy - 118, fy - 70, t, "#C9619A", 1, 0);
      curtain(ctx, wx + ww + 60, 120, wy - 118, fy - 70, t, "#C9619A", -1, 1.7);
      const d = door(ctx, ...KM.door, "#B98A6A", D.clamp(opt.pintu || 0), t, opt.pintuCahaya);
      clock(ctx, 1240, 250, 62, t, opt.jam == null ? 23 : opt.jam);
      frameArt(ctx, 1420, 200, 300, 210, "gunung", t);
      rug(ctx, 1040, 880, 520, 46, "#E36F8E");
      const bd = bed(ctx, { x0: bx0, x1: bx1, top: btop, fy, frame: "#A8746A", sheet: "#E9E6FF", pillow: "#FFFFFF", blanket: "#5BB6C9", fold: opt.selimut === "atas" ? 0 : 230 }, t);
      nightstand(ctx, nx, ntop, fy, nw, "#C08A6B");
      const lp = tableLamp(ctx, nx + 62, ntop, t, lamp, "#E59A52");
      if (opt.phone !== false) phoneFlat(ctx, nx + 150, ntop, t, pg, opt.ring || 0);
      // cahaya
      const lf = lamp * flick(t);
      if (lf > 0.01) { light(ctx, lp.x, lp.y, 900, "#FFB547", 0.42 * lf); light(ctx, lp.x, lp.y, 300, "#FFD38A", 0.45 * lf); light(ctx, lp.x, ntop + 40, 500, "#FFB547", 0.18 * lf); }
      A = { door: d, window: { x: wx, y: wy, w: ww, h: wh }, clock: { x: 1240, y: 250, r: 62 }, lamp: lp, nightstandTop: { x: nx + nw / 2, y: ntop, x0: nx, x1: nx + nw },
        phone: { x: nx + 150, y: ntop - 10 }, bedTop: { x0: bd.mx0, x1: bd.mx1, y: btop }, pillow: bd.pillow, sit: { x: bd.mx0 + 260, y: btop + 10 }, lie: { headX: bd.pillow.x, footX: bd.mx1 - 60, y: btop },
        stand: { x: 460, y: fy + 40 }, standDoor: { x: d.x, y: fy + 30 } };
    });
    // jika lampu mati, ruangan sedikit lebih biru-gelap tetapi tetap terbaca
    if (lamp < 1) { ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = rgba("#B8C4F2", (1 - lamp) * 0.6); ctx.fillRect(0, 0, W, HH); ctx.restore(); if (pg > 0) lay(ctx, dm, () => { light(ctx, nx + 150, ntop - 20, 520, "#7FE6F0", 0.32 * pg); }); }
    if (opt.near !== false) NEAR.kamar(ctx, t, opt);
    if (opt.wall === "kanan" || opt.wall === "kiri") neighbour(ctx, t, opt);
    ctx.restore();
    shiftAnchors(A, dm);
    return { floorY: fy, anchors: A };
  }
  // geser semua koordinat x di anchors (sekali per objek, juga di dalam larik)
  function shiftAnchors(A, dx, seen = new Set()) { if (!A || typeof A !== "object" || seen.has(A) || !dx) return; seen.add(A);
    if (Array.isArray(A)) { A.forEach(v => shiftAnchors(v, dx, seen)); return; }
    for (const k of ["x", "x0", "x1", "headX", "footX"]) if (typeof A[k] === "number") A[k] += dx;
    for (const k in A) if (A[k] && typeof A[k] === "object") shiftAnchors(A[k], dx, seen); }

  // ======================= dinding penampang =======================
  const WW = 130;
  const BRICK = (() => { const r = D.rng(77); return Array.from({ length: 80 }, () => r()); })();
  function dinding(ctx, x, t, opt = {}) {
    const fy = opt.floorY || 800, w = opt.w || WW, x0 = x - w / 2; ctx.save();
    // pelat lantai & fondasi
    ctx.fillStyle = "#8C93C4"; ctx.fillRect(x0 - 30, fy, w + 60, 44); ctx.fillStyle = "#6E5A7E"; ctx.fillRect(x0 - 30, fy + 44, w + 60, HH);
    const rr2 = D.rng(9); ctx.fillStyle = "#83709A"; for (let i = 0; i < 26; i++) { circ(ctx, x0 - 20 + rr2() * (w + 40), fy + 60 + rr2() * 220, 6 + rr2() * 9); ctx.fill(); }
    // plester
    ctx.fillStyle = "#E7E3F6"; ctx.fillRect(x0, -20, w, fy + 20);
    // bata merah
    const bx = x0 + 14, bw = w - 28; ctx.save(); ctx.beginPath(); ctx.rect(bx, 60, bw, fy - 60); ctx.clip();
    ctx.fillStyle = "#E6B892"; ctx.fillRect(bx, 60, bw, fy - 60);
    const bh = 34; let k = 0;
    for (let y = 60, row = 0; y < fy; y += bh, row++) { const off = row % 2 ? -bw * 0.25 : 0; for (let xx = bx + off; xx < bx + bw; xx += bw * 0.5) { const c = BRICK[k++ % BRICK.length]; rr(ctx, xx + 3, y + 3, bw * 0.5 - 6, bh - 6, 4, mix("#C9603F", "#E07A52", c)); ctx.fillStyle = rgba("#FFFFFF", 0.12); ctx.fillRect(xx + 5, y + 4, bw * 0.5 - 10, 3); } }
    ctx.restore();
    // balok beton atas & kabel listrik dalam pipa
    ctx.fillStyle = "#A9AFD6"; ctx.fillRect(x0, -20, w, 80); ctx.fillStyle = "#C3C8E8"; ctx.fillRect(x0, 54, w, 6);
    rr(ctx, x0 + w * 0.62, 60, 14, fy - 260, 7, "#F2F2FA"); ctx.fillStyle = P.amber; ctx.fillRect(x0 + w * 0.62 + 5, 60, 4, fy - 260);
    // tepi bercahaya (rim light) dan bayangan lembut ke dua sisi
    ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.fillRect(x0, -20, 3, fy + 20); ctx.fillStyle = "rgba(20,24,70,0.25)"; ctx.fillRect(x0 + w - 4, -20, 4, fy + 20);
    ctx.fillStyle = lin(ctx, x0 - 40, 0, x0, 0, [[0, "rgba(16,20,60,0)"], [1, "rgba(16,20,60,0.3)"]]); ctx.fillRect(x0 - 40, -20, 40, fy + 20);
    ctx.fillStyle = lin(ctx, x0 + w, 0, x0 + w + 40, 0, [[0, "rgba(16,20,60,0.3)"], [1, "rgba(16,20,60,0)"]]); ctx.fillRect(x0 + w, -20, 40, fy + 20);
    ctx.restore();
    return { x0, x1: x0 + w, w };
  }
  // ruang sebelah di luar tepi frame (untuk kamera yang lewat dinding)
  function neighbour(ctx, t, opt) {
    const right = opt.wall !== "kiri", wx = right ? W + WW / 2 : -WW / 2, rx = right ? W + WW : -WW - W;
    dinding(ctx, wx, t, { floorY: KM.fy });
    ctx.save(); ctx.translate(rx, 0); ctx.beginPath(); ctx.rect(0, 0, W, HH); ctx.clip();
    kamarAnak(ctx, t, Object.assign({ near: true }, opt.anak || {}, { px: (opt.anak && opt.anak.px) || 0 }));
    ctx.restore();
  }
  // kamera bergeser dari kamar Bu Rina, menembus dinding, ke kamar anak. u 0..1 (pakai easing sendiri). opt.arah 'kanan'|'kiri'
  function lewatDinding(ctx, t, u, opt = {}) {
    const right = opt.arah !== "kiri", s = right ? 1 : -1, d = (W + WW) * D.clamp(u);
    ctx.save(); ctx.translate(-s * d, 0);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, HH); ctx.clip();
    const a = kamar(ctx, t, Object.assign({}, opt.kamar || {}, { px: s * D.clamp(u * 2), wall: null }));
    ctx.restore();
    dinding(ctx, right ? W + WW / 2 : -WW / 2, t, { floorY: KM.fy });
    ctx.save(); ctx.translate(s * (W + WW), 0); ctx.beginPath(); ctx.rect(0, 0, W, HH); ctx.clip();
    const b = kamarAnak(ctx, t, Object.assign({}, opt.anak || {}, { px: -s * (1 - D.clamp(u * 2 - 1)) }));
    ctx.restore(); ctx.restore();
    shiftAnchors(a.anchors, -s * d); shiftAnchors(b.anchors, s * (W + WW) - s * d);
    return { floorY: KM.fy, anchors: { kamar: a.anchors, kamarAnak: b.anchors, wallX: (right ? W + WW / 2 : -WW / 2) - s * d } };
  }

  // ======================= SET: kamar anak =======================
  function stringLights(ctx, x0, x1, y, sag, n, t) {
    ctx.strokeStyle = "#2C3470"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo((x0 + x1) / 2, y + sag * 2, x1, y); ctx.stroke();
    const cols = ["#FFD38A", "#FF9FB8", "#9FF0E6", "#FFD38A"];
    for (let i = 1; i < n; i++) { const u = i / n, x = x0 + (x1 - x0) * u, yy = y + sag * 4 * u * (1 - u) + 10; const a = 0.7 + 0.3 * Math.sin(t * 2.2 + i * 1.7);
      light(ctx, x, yy + 8, 46, cols[i % 4], 0.5 * a); rr(ctx, x - 7, yy - 2, 14, 22, 7, cols[i % 4]); rr(ctx, x - 5, yy - 8, 10, 8, 2, "#2C3470"); }
  }
  function poster(ctx, x, y, w, h, kind, t, rot) {
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot);
    shadow(ctx, 8, 14, w * 0.6, h * 0.6, 0.2);
    if (kind === "planet") {
      rr(ctx, -w / 2, -h / 2, w, h, 6, "#2D3A8C"); ctx.fillStyle = "#FFFFFF"; [[-0.3, -0.35], [0.3, -0.3], [-0.2, 0.3], [0.32, 0.35], [0, -0.42]].forEach(([u, v]) => { circ(ctx, u * w, v * h, 3); ctx.fill(); });
      circ(ctx, 0, 0, w * 0.26, "#FF8C6B"); ctx.fillStyle = "#FFB08F"; ell(ctx, -w * 0.06, -w * 0.08, w * 0.16, w * 0.06); ctx.fill();
      ctx.strokeStyle = "#FFD38A"; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, 0, w * 0.42, w * 0.1, -0.35, 0, TAU); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.rect(-w, -h, 2 * w, h); ctx.clip(); ctx.restore();
      rr(ctx, -w / 2 + 16, h / 2 - 40, w - 32, 12, 6, "#FFD38A");
    } else if (kind === "roket") {
      rr(ctx, -w / 2, -h / 2, w, h, 6, "#3FD8C8"); const bob = Math.sin(t * 1.5) * 3;
      ctx.save(); ctx.translate(0, bob); rr(ctx, -22, -60, 44, 110, 22, "#FFFFFF"); circ(ctx, 0, -18, 12, "#5AA9FF"); poly(ctx, [[-22, 30], [-44, 60], [-22, 50]], "#FF6F91"); poly(ctx, [[22, 30], [44, 60], [22, 50]], "#FF6F91");
      poly(ctx, [[-12, 52], [12, 52], [0, 88 + Math.sin(t * 12) * 6]], "#FFB547"); ctx.restore();
    } else {   // bola
      rr(ctx, -w / 2, -h / 2, w, h, 6, "#FFD38A"); circ(ctx, 0, -10, w * 0.28, "#FFFFFF"); ctx.fillStyle = "#2D3A8C"; poly(ctx, [[0, -26], [15, -14], [9, 4], [-9, 4], [-15, -14]]); ctx.fill();
      ctx.fillStyle = "#FF6F91"; ctx.fillRect(-w / 2 + 16, h / 2 - 44, w - 32, 12);
    }
    ctx.fillStyle = "#FF6F91"; circ(ctx, 0, -h / 2 + 10, 7); ctx.fill();
    ctx.restore();
  }
  function fan(ctx, x, fy, t, col) {   // kipas angin berdiri, menyala
    shadow(ctx, x, fy, 80, 10, 0.4); ell(ctx, x, fy - 10, 70, 16, dk(col, 0.2)); rr(ctx, x - 7, fy - 230, 14, 220, 7, dk(col, 0.1));
    const hy = fy - 300; circ(ctx, x, hy, 84, rgba(lt(col, 0.4), 0.35)); ctx.save(); ctx.translate(x, hy); ctx.rotate(t * 14);
    ctx.fillStyle = rgba("#DDE6FF", 0.55); for (let i = 0; i < 3; i++) { ctx.rotate(TAU / 3); ell(ctx, 0, -40, 22, 42); ctx.fill(); } ctx.restore();
    ctx.strokeStyle = col; ctx.lineWidth = 4; circ(ctx, x, hy, 84); ctx.stroke(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; line(ctx, x, hy, x + Math.cos(a) * 84, hy + Math.sin(a) * 84, rgba(col, 0.5), 2); }
    circ(ctx, x, hy, 16, lt(col, 0.2)); rr(ctx, x - 22, hy + 70, 44, 26, 8, col);
  }
  function deskLamp(ctx, x, y, t, on) {
    const o = D.clamp(on) * flick(t, 5); ell(ctx, x, y - 6, 40, 10, "#2F3A86"); line(ctx, x, y - 10, x - 40, y - 150, "#3F4CA0", 10); line(ctx, x - 40, y - 150, x - 140, y - 190, "#3F4CA0", 10); circ(ctx, x - 40, y - 150, 10, "#FFB547");
    ctx.save(); ctx.translate(x - 140, y - 190); ctx.rotate(0.6); poly(ctx, [[-30, 0], [30, 0], [52, 60], [-52, 60]], "#3F4CA0"); ell(ctx, 0, 60, 52, 9, mix("#28306E", "#FFF0C8", o)); ctx.restore();
    if (o > 0.01) { cone(ctx, x - 175, y - 140, 90, 280, 140, "#FFD38A", 0.4 * o); light(ctx, x - 170, y - 130, 380, "#FFB547", 0.4 * o); }
  }
  function books(ctx, x0, y, x1, seed) {
    const r = D.rng(seed), cols = ["#FF6F91", "#3FD8C8", "#FFB547", "#9584FF", "#5AA9FF", "#5BD68A", "#FFD38A"]; let x = x0;
    while (x < x1 - 30) { const bw = 18 + r() * 16, bh = 70 + r() * 50; if (r() < 0.12) { x += 30; continue; } const c = cols[(r() * cols.length) | 0]; rr(ctx, x, y - bh, bw, bh, 3, c); ctx.fillStyle = rgba("#FFFFFF", 0.35); ctx.fillRect(x + 3, y - bh + 12, bw - 6, 4); x += bw + 2; }
  }
  function kamarAnak(ctx, t, opt = {}) {
    ctx.save();
    const fy = 800, dm = shift(opt, "mid"), df = shift(opt, "far"), lamp = D.clamp(opt.lamp || 0), pg = D.clamp(opt.phoneGlow || 0);
    let A;
    lay(ctx, dm, () => {
      wall(ctx, fy, "#3A5F9E", "#4E79B8", "titik", "#C6E6FF", 0.07);
      floor(ctx, fy, "#4C5CA0", dm, { wall: "#3E6AA8" });
      const wx = 960, wy = 230, ww = 280, wh = 300;
      ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = lin(ctx, 0, wy, 0, fy + 200, [[0, rgba("#A9C4FF", 0)], [0.45, rgba("#A9C4FF", 0.15)], [1, rgba("#A9C4FF", 0.04)]]);
      poly(ctx, [[wx, wy + wh], [wx + ww, wy + wh], [wx + ww - 160, fy + 190], [wx - 380, fy + 190]]); ctx.fill(); ctx.restore();
      light(ctx, wx + ww / 2, wy + wh / 2, 380, "#9DB8FF", 0.25);
      windowFrame(ctx, wx, wy, ww, wh, t, "#8C7BB8", () => nightView(ctx, wx, wy, ww, wh, t + 7, df - dm - 160));
      rod(ctx, wx - 50, wx + ww + 50, wy - 120, "#E8C489");
      curtain(ctx, wx - 40, 110, wy - 118, wy + wh + 80, t, "#3FB4A8", 1, 0.4, 0.8); curtain(ctx, wx + ww + 40, 110, wy - 118, wy + wh + 80, t, "#3FB4A8", -1, 2.1, 0.8);
      stringLights(ctx, 40, 880, 110, 34, 12, t);
      poster(ctx, 250, 230, 210, 280, "planet", t, -0.04); poster(ctx, 530, 270, 170, 220, "roket", t, 0.05);
      rug(ctx, 720, 880, 420, 40, "#9584FF");
      const bd = bed(ctx, { x0: 120, x1: 880, top: 660, fy, frame: "#6B7FD0", sheet: "#FFE7C7", pillow: "#FFFFFF", blanket: "#FF8FA8", fold: opt.selimut === "atas" ? 0 : 200 }, t);
      if (opt.guling !== false) { const gy = 628 + Math.sin(t * 0.9) * 1.2; rr(ctx, 370, gy - 30, 300, 60, 30, "#FFF6E6"); ctx.fillStyle = rgba("#E8C9A0", 0.6); [420, 520, 620].forEach(x => { ctx.fillRect(x, gy - 30, 8, 60); }); rr(ctx, 380, gy - 24, 200, 12, 6, rgba("#FFFFFF", 0.6)); }
      fan(ctx, 1090, fy, t, "#9AA8E6");
      // rak buku dan meja belajar
      const dx0 = 1300, dx1 = 1770, dtop = 600;
      rr(ctx, 1320, 380, 400, 20, 6, "#E8C489"); books(ctx, 1336, 380, 1600, 11); circ(ctx, 1660, 330, 40, "#5AA9FF"); ctx.fillStyle = "#5BD68A"; ell(ctx, 1650, 320, 18, 24); ctx.fill(); rr(ctx, 1652, 370, 16, 12, 3, "#C9A27A");
      shadow(ctx, (dx0 + dx1) / 2, fy, 300, 16, 0.4);
      ctx.fillStyle = "#B98A6A"; ctx.fillRect(dx0 + 20, dtop, 22, fy - dtop); rr(ctx, dx1 - 170, dtop + 20, 150, fy - dtop - 20, 8, "#C79A78");
      [0, 1, 2].forEach(i => { rr(ctx, dx1 - 158, dtop + 34 + i * 54, 126, 44, 6, "#D6AC88"); rr(ctx, dx1 - 115, dtop + 52 + i * 54, 40, 8, 4, "#8E6450"); });
      rr(ctx, dx0 - 10, dtop - 4, dx1 - dx0 + 20, 26, 8, "#D6AC88"); ctx.fillStyle = rgba("#FFFFFF", 0.3); ctx.fillRect(dx0 - 4, dtop - 4, dx1 - dx0 + 8, 4);
      rr(ctx, 1360, dtop - 60, 120, 56, 6, "#FF6F91"); rr(ctx, 1368, dtop - 52, 104, 8, 4, rgba("#FFFFFF", 0.5));   // buku di meja
      deskLamp(ctx, 1740, dtop, t, lamp);
      if (opt.phone !== false) phoneFlat(ctx, 1560, dtop - 4, t, pg, opt.ring || 0);
      // kursi
      const cx = 1230; shadow(ctx, cx + 70, fy, 110, 10, 0.4); rr(ctx, cx, 470, 26, 330, 10, "#3FB4A8"); rr(ctx, cx, 650, 170, 28, 10, "#4FC7BA"); ctx.fillStyle = "#2E8F86"; ctx.fillRect(cx + 140, 676, 18, fy - 676); rr(ctx, cx - 6, 470, 40, 130, 14, "#4FC7BA");
      // tas sekolah
      ctx.save(); ctx.translate(1520, fy); shadow(ctx, 0, 0, 80, 9, 0.4); rr(ctx, -62, -150, 124, 150, 34, "#FFB547"); rr(ctx, -46, -78, 92, 62, 18, "#F29A2E"); rr(ctx, -30, -168, 60, 30, 14, null); ctx.strokeStyle = "#F29A2E"; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
      if (lamp > 0) light(ctx, 1600, 520, 700, "#FFB547", 0.2 * lamp);
      A = { bedTop: { x0: bd.mx0, x1: bd.mx1, y: 660 }, pillow: bd.pillow, guling: { x: 520, y: 628 }, lie: { headX: bd.pillow.x, footX: bd.mx1 - 50, y: 660 }, sit: { x: 700, y: 670 },
        deskTop: { x0: dx0, x1: dx1, y: dtop }, phone: { x: 1560, y: dtop - 14 }, chair: { x: cx + 85, y: 650 }, window: { x: wx, y: wy, w: ww, h: wh }, stand: { x: 1000, y: fy + 40 } };
    });
    if (opt.near !== false) NEAR.kamarAnak(ctx, t, opt);
    ctx.restore(); shiftAnchors(A, dm);
    return { floorY: fy, anchors: A };
  }
  // selimut penuh untuk tokoh yang berbaring; panggil SESUDAH menggambar tokoh. set: 'kamar'|'kamarAnak'. opt.px sama dengan set.
  function selimut(ctx, set, t, opt = {}) {
    ctx.save(); ctx.translate(shift(opt, "mid"), 0);
    if (set === "kamarAnak") blanket(ctx, 360, 860, 660, 64, "#FF8FA8", t, true, true);
    else blanket(ctx, 1340, 1800, 650, 64, "#5BB6C9", t, true, true);
    ctx.restore();
  }

  // ======================= SET: kampung senja =======================
  function tileRoof(ctx, x0, x1, y0, y1, ov, col, kind) {   // atap genteng limasan / pelana
    const d = dk(col, 0.25), h = lt(col, 0.15);
    if (kind === "pelana") poly(ctx, [[x0 - ov, y1], [(x0 + x1) / 2, y0], [x1 + ov, y1]], col);
    else poly(ctx, [[x0 - ov, y1], [x0 + (x1 - x0) * 0.22, y0], [x1 - (x1 - x0) * 0.22, y0], [x1 + ov, y1]], col);
    ctx.save(); ctx.clip();
    ctx.strokeStyle = rgba(d, 0.8); ctx.lineWidth = 4; for (let y = y0 + 16; y < y1; y += 18) { ctx.beginPath(); ctx.moveTo(x0 - ov, y); ctx.lineTo(x1 + ov, y); ctx.stroke(); }
    ctx.fillStyle = rgba(h, 0.5); ctx.fillRect(x0 - ov, y0, x1 - x0 + 2 * ov, 6);
    ctx.fillStyle = rgba(d, 0.35); poly(ctx, [[(x0 + x1) / 2, y0], [x1 + ov, y1], [x1 + ov, y0]]); ctx.fill();
    ctx.restore();
    ctx.fillStyle = d; ctx.fillRect(x0 - ov - 4, y1, x1 - x0 + 2 * ov + 8, 10);   // lisplang
    if (kind !== "pelana") rr(ctx, x0 + (x1 - x0) * 0.22 - 6, y0 - 8, (x1 - x0) * 0.56 + 12, 14, 7, d);
  }
  function house(ctx, x, w, by, o, t, i) {
    const hh = o.h || 290, top = by - hh;
    shadow(ctx, x + w / 2, by + 6, w * 0.6, 14, 0.4);
    ctx.fillStyle = o.wall; ctx.fillRect(x, top, w, hh); ctx.fillStyle = lin(ctx, 0, top, 0, by, [[0, "rgba(20,24,70,0.25)"], [0.25, "rgba(20,24,70,0)"], [1, "rgba(20,24,70,0.12)"]]); ctx.fillRect(x, top, w, hh);
    ctx.fillStyle = dk(o.wall, 0.2); ctx.fillRect(x, by - 34, w, 34);   // plin bawah
    tileRoof(ctx, x, x + w, top - (o.roofH || 120), top + 6, 38, o.roof, o.kind);
    // pintu & jendela hangat
    const dxp = x + w * (o.doorAt || 0.5) - 46; rr(ctx, dxp - 10, by - 220, 112, 220, 6, lt(o.wall, 0.25)); ctx.fillStyle = o.doorCol || "#7E5A62"; ctx.fillRect(dxp, by - 210, 92, 210);
    if (o.doorOpen) { ctx.fillStyle = "#FFC877"; ctx.fillRect(dxp, by - 210, 92 * o.doorOpen, 210); light(ctx, dxp + 46, by - 100, 200, "#FFB547", 0.4 * o.doorOpen); }
    circ(ctx, dxp + 78, by - 104, 6, "#F2C66B");
    const wins = o.wins || [0.18, 0.82];
    wins.forEach((u, k) => {
      const wx = x + w * u - 60, wy = top + 70, lit = o.lit == null ? 1 : o.lit[k] == null ? o.lit : o.lit[k], a = lit * (0.85 + 0.15 * Math.sin(t * 0.7 + i * 2 + k));
      rr(ctx, wx - 12, wy - 12, 144, 154, 6, lt(o.wall, 0.25));
      ctx.fillStyle = mix("#3A4690", "#FFD08A", a); ctx.fillRect(wx, wy, 120, 130);
      if (a > 0.05) { light(ctx, wx + 60, wy + 65, 190, "#FFB547", 0.38 * a); ctx.fillStyle = rgba("#FFF0C8", 0.5 * a); ctx.fillRect(wx + 8, wy + 8, 40, 114); }
      ctx.fillStyle = mix(o.curtain || "#E36F8E", "#FF9BB0", a * 0.5); poly(ctx, [[wx, wy], [wx + 34, wy], [wx + 14, wy + 130], [wx, wy + 130]]); ctx.fill(); poly(ctx, [[wx + 120, wy], [wx + 86, wy], [wx + 106, wy + 130], [wx + 120, wy + 130]]); ctx.fill();
      ctx.fillStyle = lt(o.wall, 0.25); ctx.fillRect(wx + 57, wy, 6, 130); ctx.fillRect(wx, wy + 52, 120, 6);
      ctx.fillStyle = dk(o.wall, 0.3); for (let s = 0; s < 4; s++) rr(ctx, wx + 6 + s * 29, wy - 46, 22, 22, 4, dk(o.wall, 0.3));   // lubang angin
    });
    return { door: { x: dxp + 46, y: by, top: by - 210 } };
  }
  function fence(ctx, x0, x1, by, col) {
    ctx.fillStyle = col; ctx.fillRect(x0, by - 40, x1 - x0, 40); ctx.fillStyle = lt(col, 0.2); ctx.fillRect(x0, by - 44, x1 - x0, 8);
    ctx.fillStyle = dk(col, 0.15); for (let x = x0 + 10; x < x1; x += 34) rr(ctx, x, by - 110, 12, 72, 5, dk(col, 0.1)); ctx.fillRect(x0, by - 96, x1 - x0, 8);
    rr(ctx, x0 - 8, by - 130, 34, 130, 6, lt(col, 0.1)); rr(ctx, x1 - 26, by - 130, 34, 130, 6, lt(col, 0.1));
  }
  function mangoTree(ctx, x, by, s, t, cols) {
    ctx.save(); ctx.translate(x, by); ctx.scale(s, s); shadow(ctx, 0, 0, 160, 16, 0.4);
    poly(ctx, [[-22, 0], [22, 0], [14, -200], [60, -280], [46, -290], [6, -230], [-30, -300], [-44, -290], [-12, -200]], cols.trunk);
    const sw = Math.sin(t * 0.7) * 5, blobs = [[-110, -300, 110], [100, -310, 115], [0, -380, 140], [-60, -440, 100], [80, -430, 95], [0, -270, 100]];
    blobs.forEach(([bx, bY, r], k) => circ(ctx, bx + sw * (k % 2 ? 1 : 0.6), bY, r, cols.leaf));
    blobs.forEach(([bx, bY, r], k) => { circ(ctx, bx + sw - r * 0.25, bY - r * 0.25, r * 0.55, rgba(cols.leafHi, 0.5)); });
    ctx.fillStyle = cols.fruit; [[-60, -240], [70, -250], [20, -300], [-120, -290]].forEach(([fx, fyy], k) => { ell(ctx, fx + sw, fyy + Math.sin(t + k) * 2, 12, 16); ctx.fill(); });
    ctx.restore();
  }
  function bananaTree(ctx, x, by, s, t, col) {
    ctx.save(); ctx.translate(x, by); ctx.scale(s, s);
    rr(ctx, -16, -300, 32, 300, 14, dk(col, 0.1)); ctx.fillStyle = rgba(lt(col, 0.2), 0.6); ctx.fillRect(-10, -290, 6, 280);
    [[-2.5, 260, 0], [-2.0, 300, 1], [-1.2, 280, 2], [-0.6, 300, 3], [-0.25, 230, 4]].forEach(([a, L, k]) => { ctx.save(); ctx.translate(0, -300); bigLeaf(ctx, 0, 0, L, a, k % 2 ? col : lt(col, 0.08), t, k); ctx.restore(); });
    ctx.restore();
  }
  function streetLamp(ctx, x, by, t, col, on) {
    const hy = by - 430, hx = x - 90, o = on * flick(t, 9);
    rr(ctx, x - 9, hy, 18, 430, 8, col); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x, hy + 20); ctx.quadraticCurveTo(x, hy - 30, hx + 20, hy - 20); ctx.stroke();
    poly(ctx, [[hx - 36, hy - 28], [hx + 30, hy - 28], [hx + 22, hy - 4], [hx - 28, hy - 4]], dk(col, 0.1));
    if (o > 0.01) { cone(ctx, hx, hy - 4, 50, 420, by - hy + 20, "#FFC877", 0.32 * o); light(ctx, hx, hy, 260, "#FFB547", 0.6 * o); shadow(ctx, hx, by + 26, 260, 36, 0); ctx.save(); ctx.translate(hx, by + 26); ctx.scale(1, 0.15); const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, 260); gg.addColorStop(0, rgba("#FFC877", 0.35 * o)); gg.addColorStop(1, rgba("#FFC877", 0)); ctx.fillStyle = gg; circ(ctx, 0, 0, 260); ctx.fill(); ctx.restore(); }
    ell(ctx, hx, hy - 3, 26, 8, mix("#3A3F7A", "#FFF2C8", o));
    // laron berputar
    if (o > 0.1) { ctx.fillStyle = rgba("#FFF2C8", 0.9); for (let i = 0; i < 5; i++) { const a = t * (1.5 + i * 0.3) + i * 1.3; circ(ctx, hx + Math.cos(a) * (30 + i * 9), hy + 30 + Math.sin(a * 1.3) * (16 + i * 5), 2.4); ctx.fill(); } }
    return { x: hx, y: hy };
  }
  function scooter(ctx, x, gy, s, col, t) {   // motor matik generik menghadap kiri, berdiri dengan standar samping; (x, gy) = titik tengah di tanah
    ctx.save(); ctx.translate(x, gy); ctx.scale(s, s); shadow(ctx, 0, 0, 190, 14, 0.5);
    const d = dk(col, 0.22), h = lt(col, 0.3), tyre = "#262C66", rim = "#C3CAEE", R = 40;
    line(ctx, 40, -50, 18, 0, "#3A3F7A", 7);   // standar samping
    [[-128, -R], [118, -R]].forEach(([wx, wy]) => { circ(ctx, wx, wy, R, tyre); circ(ctx, wx, wy, R * 0.58, rim); circ(ctx, wx, wy, R * 0.26, "#5A64A8"); });
    ctx.fillStyle = d; poly(ctx, [[60, -60], [130, -48], [130, -30], [60, -36]]); ctx.fill();   // lengan ayun & mesin
    rr(ctx, -10, -66, 120, 22, 10, "#4A5096");
    // bodi belakang
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-20, -62); ctx.bezierCurveTo(-10, -112, 30, -134, 80, -134); ctx.lineTo(160, -136);
    ctx.bezierCurveTo(196, -136, 200, -96, 186, -80); ctx.quadraticCurveTo(170, -62, 120, -64); ctx.lineTo(40, -60); ctx.closePath(); ctx.fill();
    ctx.fillStyle = h; ctx.beginPath(); ctx.moveTo(10, -104); ctx.bezierCurveTo(30, -124, 60, -128, 90, -128); ctx.lineTo(150, -129); ctx.lineTo(150, -122); ctx.lineTo(60, -120); ctx.quadraticCurveTo(30, -118, 10, -104); ctx.fill();
    rr(ctx, 178, -112, 16, 20, 6, P.red);   // lampu belakang
    // pijakan kaki
    rr(ctx, -80, -70, 110, 16, 8, d);
    // tameng depan + spakbor
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-62, -66); ctx.quadraticCurveTo(-70, -150, -92, -214); ctx.lineTo(-118, -214); ctx.quadraticCurveTo(-126, -150, -150, -104);
    ctx.quadraticCurveTo(-170, -86, -176, -64); ctx.lineTo(-150, -66); ctx.quadraticCurveTo(-128, -92, -100, -80); ctx.closePath(); ctx.fill();
    ctx.fillStyle = h; ctx.beginPath(); ctx.moveTo(-118, -210); ctx.quadraticCurveTo(-126, -150, -150, -104); ctx.lineTo(-140, -102); ctx.quadraticCurveTo(-116, -150, -110, -210); ctx.fill();
    ctx.fillStyle = d; ctx.beginPath(); ctx.arc(-128, -R, R + 10, Math.PI * 1.08, Math.PI * 1.75); ctx.arc(-128, -R, R + 2, Math.PI * 1.75, Math.PI * 1.08, true); ctx.fill();
    // kepala setang, lampu depan, spion
    rr(ctx, -132, -238, 66, 30, 14, col); ell(ctx, -128, -224, 12, 9, "#FFF2C8"); light(ctx, -134, -224, 26, "#FFF2C8", 0.5);
    line(ctx, -84, -232, -52, -236, "#3A3F7A", 9); line(ctx, -96, -236, -84, -280, "#3A3F7A", 4); ell(ctx, -82, -288, 14, 9, "#9AA4D8", -0.2);
    // jok
    rr(ctx, 30, -158, 150, 28, 14, "#2E3170"); rr(ctx, 44, -156, 100, 6, 3, "#4A4F96");
    ctx.restore();
  }
  function kampung(ctx, t, opt = {}) {
    ctx.save();
    const sj = opt.senja == null ? 0.7 : D.clamp(opt.senja), df = shift(opt, "far"), dm = shift(opt, "mid"), by = 820;
    const top = mix("#253A86", "#3A3E92", sj), mid = mix("#3F55AA", "#8A5FAE", sj), hor = mix("#5B70C0", "#FF9F86", sj);
    ctx.fillStyle = lin(ctx, 0, 0, 0, 720, [[0, top], [0.5, mid], [0.82, hor], [1, hor]]); ctx.fillRect(0, 0, W, HH);
    lay(ctx, df, () => {
      // bintang & bulan
      ctx.fillStyle = "#FFFFFF"; STAR.forEach(([u, v, r, ph]) => { ctx.globalAlpha = (1 - sj * 0.7) * (0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.2 + ph * 3))); circ(ctx, -100 + u * (W + 200), v * 330, r); ctx.fill(); }); ctx.globalAlpha = 1;
      const mx = 1330, my = 150; D.glow(ctx, mx, my, 170, "#D6E2FF", 0.45); ctx.save(); ctx.beginPath(); ctx.rect(mx - 60, my - 60, 120, 120); ctx.arc(mx + 18, my - 12, 38, 0, TAU); ctx.clip("evenodd"); circ(ctx, mx, my, 44, "#FFF5DC"); ctx.restore();
      if (sj > 0) light(ctx, 700, 700, 900, "#FFB08A", 0.45 * sj);
      // awan panjang
      for (let i = 0; i < 4; i++) { const cx = ((i * 640 + t * (8 + i * 2)) % (W + 800)) - 400, cy = 230 + i * 70; ctx.fillStyle = rgba(mix("#B9C4F2", "#FFC2B0", sj), 0.35 + 0.1 * (i % 2)); rr(ctx, cx, cy, 360, 26, 13); ctx.fill(); rr(ctx, cx + 70, cy - 18, 180, 26, 13); ctx.fill(); }
      // bukit dan atap kampung jauh
      ctx.fillStyle = mix("#4A58A8", "#7A5EA6", sj); ctx.beginPath(); ctx.moveTo(-200, 640); ctx.quadraticCurveTo(300, 470, 800, 600); ctx.quadraticCurveTo(1200, 500, 1700, 590); ctx.quadraticCurveTo(1950, 540, 2200, 600); ctx.lineTo(2200, 800); ctx.lineTo(-200, 800); ctx.fill();
      const fc = mix("#3F4C9E", "#5E4E98", sj); const r = D.rng(12); let x = -200;
      while (x < W + 200) { const w = 90 + r() * 90, h = 50 + r() * 50, ty = 690 - h; ctx.fillStyle = fc; ctx.fillRect(x, ty, w, 200); poly(ctx, [[x - 10, ty + 2], [x + w / 2, ty - 40], [x + w + 10, ty + 2]], dk(fc, 0.12));
        if (r() > 0.4) { ctx.fillStyle = rgba("#FFC66E", 0.85); rr(ctx, x + w * 0.4, ty + 18, 14, 18, 3); ctx.fill(); } x += w + 8; }
      palm(ctx, 260, 700, 260, mix("#344290", "#4E3F86", sj), t, 0.4); palm(ctx, 1260, 690, 220, mix("#344290", "#4E3F86", sj), t, 2); palm(ctx, 1760, 700, 280, mix("#344290", "#4E3F86", sj), t, 3.1);
    });
    let A;
    lay(ctx, dm, () => {
      // jalan kampung (tenang di 200 px terbawah)
      ctx.fillStyle = "#4E5596"; ctx.fillRect(-500, by, W + 1000, HH - by); ctx.fillStyle = lin(ctx, 0, by, 0, HH, [[0, "#5D64A6"], [1, "#454C8C"]]); ctx.fillRect(-500, by + 34, W + 1000, HH);
      ctx.fillStyle = "#6A72B4"; ctx.fillRect(-500, by, W + 1000, 34); ctx.fillStyle = "#353C7E"; ctx.fillRect(-500, by + 34, W + 1000, 10);   // trotoar & selokan
      // tiang listrik dan kabel
      const poles = [360, 1290, 2140], pt = 250;
      poles.forEach(px => { rr(ctx, px - 10, pt, 20, by - pt, 6, "#363E86"); rr(ctx, px - 70, pt + 20, 140, 12, 5, "#363E86"); });
      ctx.strokeStyle = "#2A3170"; ctx.lineWidth = 3;
      for (let k = 0; k < 3; k++) { const yo = pt + 22 + k * 0; const xo = -60 + k * 60; let prev = [-500, pt + 60 + k * 10];
        poles.concat([2700]).forEach(px => { const p = [px + xo, yo]; const sag = 60 + Math.sin(t * 0.9 + k) * 3; ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.quadraticCurveTo((prev[0] + p[0]) / 2, Math.max(prev[1], p[1]) + sag, p[0], p[1]); ctx.stroke(); prev = p; }); }
      rr(ctx, 1290 - 34, 330, 68, 80, 8, "#5A64A8"); ctx.fillStyle = "#7A84C8"; ctx.fillRect(1290 - 34, 330, 68, 6);   // trafo
      const wallC = (c) => mix(c, "#6E6AA8", 0.25 + 0.15 * (1 - sj));
      const H1 = house(ctx, -60, 420, by, { wall: wallC("#7FC8B4"), roof: "#C2584E", wins: [0.25, 0.78], kind: "pelana", roofH: 150 }, t, 0);
      bananaTree(ctx, 440, by, 0.9, t, "#2F8A70");
      const H2 = house(ctx, 520, 470, by, { wall: wallC("#F2B08C"), roof: "#B84E4A", wins: [0.2, 0.8], curtain: "#5BB6C9", doorOpen: opt.pintu || 0 }, t, 1);
      mangoTree(ctx, 1080, by, 0.95, t, { trunk: "#6E5070", leaf: "#2E7E78", leafHi: "#4FB08E", fruit: "#FFB547" });
      const L = streetLamp(ctx, 1210, by, t, "#3A428A", opt.lampu == null ? 1 : opt.lampu);
      const H3 = house(ctx, 1320, 440, by, { wall: wallC("#B7A6E8"), roof: "#C2584E", wins: [0.22, 0.78], lit: [1, 0.3], curtain: "#FFB547" }, t, 2);
      const H4 = house(ctx, 1840, 400, by, { wall: wallC("#F2D27A"), roof: "#B84E4A", wins: [0.25], kind: "pelana", roofH: 140 }, t, 3);
      fence(ctx, 540, 960, by, mix("#E9E2F6", "#A9A4D6", 0.45)); fence(ctx, 1340, 1500, by, mix("#E9E2F6", "#A9A4D6", 0.45));
      scooter(ctx, 1600, by + 22, 1.05, "#E8606A", t);
      // burung pulang sarang
      ctx.strokeStyle = rgba("#2A3170", 0.8); ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { const bx = ((t * 40 + i * 70) % (W + 400)) - 200 + i * 30, byy = 300 + i * 22 + Math.sin(t * 2 + i) * 6, f = Math.sin(t * 9 + i) * 8; ctx.beginPath(); ctx.moveTo(bx - 14, byy - f); ctx.quadraticCurveTo(bx - 6, byy - 6, bx, byy); ctx.quadraticCurveTo(bx + 6, byy - 6, bx + 14, byy - f); ctx.stroke(); }
      A = { doors: [H1.door, H2.door, H3.door, H4.door], rumah: H2.door, lamp: L, motor: { x: 1600, y: by + 22 }, sidewalk: { y: by + 16 }, stand: [{ x: 770, y: by + 24 }, { x: 1180, y: by + 24 }, { x: 300, y: by + 24 }] };
    });
    if (opt.near !== false) NEAR.kampung(ctx, t, opt);
    ctx.restore(); shiftAnchors(A, dm);
    return { floorY: by + 16, anchors: A };
  }

  // ======================= SET: dapur =======================
  function jar(ctx, x, y, w, h, col, lid, fill) {   // toples kaca, y = dasar
    shadow(ctx, x, y, w * 0.6, 6, 0.35);
    rr(ctx, x - w / 2, y - h, w, h, w * 0.22, rgba("#E6F2FF", 0.35)); ctx.save(); H.rr(ctx, x - w / 2, y - h, w, h, w * 0.22); ctx.clip();
    ctx.fillStyle = col; ctx.fillRect(x - w / 2, y - h * fill, w, h); ctx.fillStyle = rgba("#FFFFFF", 0.25); ctx.fillRect(x - w / 2, y - h * fill, w, 4); ctx.restore();
    ctx.fillStyle = rgba("#FFFFFF", 0.45); rr(ctx, x - w / 2 + 6, y - h + 10, 7, h - 24, 4); ctx.fill();
    rr(ctx, x - w / 2 - 4, y - h - 16, w + 8, 20, 6, lid);
  }
  function stove(ctx, x, y, t, flame) {   // kompor gas dua tungku; y = permukaan meja
    rr(ctx, x - 160, y - 40, 320, 40, 10, "#C9D0EE"); ctx.fillStyle = "#A9B1DA"; ctx.fillRect(x - 160, y - 10, 320, 10); ctx.fillStyle = rgba("#FFFFFF", 0.5); ctx.fillRect(x - 152, y - 40, 304, 4);
    [-1, 1].forEach(s => { circ(ctx, x + s * 50, y - 20, 11, "#3A3F7A"); circ(ctx, x + s * 50, y - 20, 4, "#9AA4D8"); });
    [-80, 80].forEach(bx => { ell(ctx, x + bx, y - 44, 56, 9, "#3A3F7A"); line(ctx, x + bx - 48, y - 50, x + bx + 48, y - 50, "#2A2F6A", 5); });
    const fl = D.clamp(flame);
    if (fl > 0.01) [-80, 80].forEach((bx, k) => { if (k === 1 || fl > 0.5) for (let i = -3; i <= 3; i++) { const hh = (16 + 6 * Math.sin(t * 20 + i * 1.7)) * fl; ell(ctx, x + bx + i * 13, y - 50 - hh / 2, 5, hh / 2, rgba("#5AD6FF", 0.9)); ell(ctx, x + bx + i * 13, y - 50 - hh / 3, 2.5, hh / 3, "#E8FBFF"); } light(ctx, x + bx, y - 60, 90, "#5AD6FF", 0.5 * fl); });
  }
  function pot(ctx, x, y, t, steam) {   // panci; y = dasar
    rr(ctx, x - 92, y - 110, 184, 110, 18, "#E8606A"); ctx.fillStyle = "#C94A57"; ctx.fillRect(x - 92, y - 26, 184, 16); ctx.fillStyle = rgba("#FFFFFF", 0.35); ctx.fillRect(x - 80, y - 98, 10, 70);
    rr(ctx, x - 118, y - 94, 30, 14, 7, "#2E3170"); rr(ctx, x + 88, y - 94, 30, 14, 7, "#2E3170");
    ell(ctx, x, y - 112, 96, 14, "#F28A92"); rr(ctx, x - 16, y - 136, 32, 18, 8, "#2E3170");
    if (steam > 0) { ctx.strokeStyle = rgba("#FFFFFF", 0.45 * steam); ctx.lineWidth = 9; ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) { const ph = (t * 0.6 + i / 3) % 1, sx = x - 40 + i * 40, sy = y - 150 - ph * 120; ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.beginPath(); ctx.moveTo(sx, sy + 40); ctx.bezierCurveTo(sx - 18, sy + 20, sx + 18, sy + 10, sx, sy - 20); ctx.stroke(); } ctx.globalAlpha = 1; }
  }
  function dispenser(ctx, x, fy, t) {
    shadow(ctx, x, fy, 100, 12, 0.4); rr(ctx, x - 70, fy - 300, 140, 300, 14, "#E9ECFA"); ctx.fillStyle = "#C9D0EE"; ctx.fillRect(x + 40, fy - 300, 30, 300);
    rr(ctx, x - 50, fy - 220, 100, 70, 10, "#B8C1E6"); rr(ctx, x - 30, fy - 210, 14, 22, 4, P.red); rr(ctx, x + 16, fy - 210, 14, 22, 4, "#5AA9FF"); rr(ctx, x - 40, fy - 90, 80, 10, 4, "#9AA4D8");
    ctx.fillStyle = rgba("#7FC4FF", 0.55); rr(ctx, x - 62, fy - 470, 124, 170, 30); ctx.fill(); rr(ctx, x - 28, fy - 500, 56, 34, 10, rgba("#7FC4FF", 0.55));
    const wl = fy - 420 + Math.sin(t * 1.4) * 2; ctx.save(); H.rr(ctx, x - 62, fy - 470, 124, 170, 30); ctx.clip(); ctx.fillStyle = rgba("#4FA6F0", 0.5); ctx.fillRect(x - 62, wl, 124, 200); ctx.restore();
    ctx.fillStyle = rgba("#FFFFFF", 0.5); rr(ctx, x - 48, fy - 455, 12, 130, 6); ctx.fill(); ctx.strokeStyle = rgba("#FFFFFF", 0.35); ctx.lineWidth = 3; [fy - 420, fy - 360].forEach(yy => { ctx.beginPath(); ctx.moveTo(x - 60, yy); ctx.lineTo(x + 60, yy); ctx.stroke(); });
  }
  function dayView(ctx, x, y, w, h, t, off, night) {
    ctx.fillStyle = lin(ctx, 0, y, 0, y + h, night ? [[0, "#2F4295"], [1, "#6A7CCB"]] : [[0, "#6FA8E8"], [1, "#FFC9A8"]]); ctx.fillRect(x - 10, y - 10, w + 20, h + 20);
    ctx.save(); ctx.translate(off, 0);
    if (night) { circ(ctx, x + w * 0.7, y + h * 0.3, 22, "#FFF5DC"); } else { light(ctx, x + w * 0.75, y + h * 0.75, 200, "#FFD38A", 0.7); circ(ctx, x + w * 0.75, y + h * 0.78, 36, "#FFE4A8"); }
    const cl = night ? "#3A4996" : "#7E8FD6"; ctx.fillStyle = rgba("#FFFFFF", night ? 0.15 : 0.55); rr(ctx, x + ((t * 10) % (w + 200)) - 100, y + h * 0.25, 130, 24, 12); ctx.fill();
    const r = D.rng(3); let xx = x - 40; while (xx < x + w + 40) { const hw = 80 + r() * 60, hh = h * (0.18 + r() * 0.12); ctx.fillStyle = cl; ctx.fillRect(xx, y + h - hh, hw, hh); poly(ctx, [[xx - 8, y + h - hh], [xx + hw / 2, y + h - hh - 30], [xx + hw + 8, y + h - hh]], dk(cl, 0.12)); xx += hw + 6; }
    bananaTree(ctx, x + w * 0.15, y + h + 30, 0.55, t, night ? "#2E5C80" : "#3FA07E");
    ctx.restore();
  }
  function dapur(ctx, t, opt = {}) {
    ctx.save();
    const fy = 840, dm = shift(opt, "mid"), df = shift(opt, "far"), ct = 610, night = !!opt.malam; let A;
    lay(ctx, dm, () => {
      wall(ctx, fy, "#4A79B0", "#6191C4", "garis", "#BFE3FF", 0.06);
      floor(ctx, fy, "#5865A8", dm, { wall: "#4A79B0", tile: 180 });
      light(ctx, 960, -60, 900, "#FFD38A", 0.35);
      // keramik dinding di atas meja
      ctx.fillStyle = "#9CC9DD"; ctx.fillRect(140, 460, 1520, ct - 460); ctx.strokeStyle = rgba("#FFFFFF", 0.5); ctx.lineWidth = 3; ctx.beginPath();
      for (let x = 140; x <= 1660; x += 50) { ctx.moveTo(x, 460); ctx.lineTo(x, ct); } for (let y = 460; y <= ct; y += 50) { ctx.moveTo(140, y); ctx.lineTo(1660, y); } ctx.stroke();
      ctx.fillStyle = "#7DB4CE"; for (let x = 140; x < 1660; x += 100) ctx.fillRect(x, 460, 50, 50); ctx.fillStyle = rgba("#FFFFFF", 0.5); for (let x = 140; x < 1660; x += 100) { ctx.beginPath(); ctx.moveTo(x + 25, 470); ctx.lineTo(x + 40, 485); ctx.lineTo(x + 25, 500); ctx.lineTo(x + 10, 485); ctx.closePath(); ctx.fill(); }
      // jendela
      const wx = 470, wy = 150, ww = 400, wh = 230; windowFrame(ctx, wx, wy, ww, wh, t, "#E8E2F6", () => dayView(ctx, wx, wy, ww, wh, t, df - dm, night));
      if (!night) { ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = lin(ctx, 0, wy, 0, ct, [[0, rgba("#FFE0B0", 0.2)], [1, rgba("#FFE0B0", 0.03)]]); poly(ctx, [[wx, wy + wh], [wx + ww, wy + wh], [wx + ww + 220, ct], [wx + 220, ct]]); ctx.fill(); ctx.restore(); }
      // rak dua tingkat dan toples
      const sx0 = 1090, sx1 = 1600;
      [270, 450].forEach(y => { rr(ctx, sx0, y, sx1 - sx0, 20, 6, "#E8C489"); ctx.fillStyle = "#C9A27A"; ctx.fillRect(sx0, y + 16, sx1 - sx0, 6); [sx0 + 30, sx1 - 50].forEach(bx => poly(ctx, [[bx, y + 20], [bx + 20, y + 20], [bx + 20, y + 60]], "#C9A27A")); });
      jar(ctx, 1140, 270, 64, 90, "#FFD38A", "#E8606A", 0.6); jar(ctx, 1220, 270, 56, 70, "#F2F2FA", "#3FB4A8", 0.7); rr(ctx, 1290, 190, 40, 80, 10, "#5BD68A"); rr(ctx, 1300, 170, 20, 24, 4, "#2E3170");
      jar(ctx, 1400, 270, 70, 100, "#C9603F", "#FFB547", 0.5); rr(ctx, 1480, 206, 90, 64, 10, "#FF8FA8"); circ(ctx, 1525, 238, 18, "#FFFFFF");
      const slotsY = 450, slots = [{ x: 1180, y: slotsY }, { x: 1345, y: slotsY }, { x: 1510, y: slotsY }];
      if (opt.toples !== false) [["#FFFFFF", "#9584FF"], ["#FFB547", "#3FB4A8"], ["#E8606A", "#FF6F91"]].forEach(([c, l], i) => jar(ctx, slots[i].x, slotsY, 90, 104, c, l, 0.55 + i * 0.1));
      // gantungan peralatan
      rr(ctx, 930, 404, 130, 8, 4, "#8E99C9"); [[950, "sendok"], [990, "spatula"], [1030, "sendok"]].forEach(([x, k], i) => { const sw = Math.sin(t * 1.1 + i) * 0.04; ctx.save(); ctx.translate(x, 408); ctx.rotate(sw); line(ctx, 0, 0, 0, 90, "#B9C2EA", 6); if (k === "spatula") rr(ctx, -16, 88, 32, 40, 6, "#B9C2EA"); else ell(ctx, 0, 100, 16, 20, "#B9C2EA"); ctx.restore(); });
      // meja dapur & lemari bawah
      shadow(ctx, 960, fy, 900, 18, 0.4);
      rr(ctx, 140, ct + 20, 1520, fy - ct - 20, 6, "#6D6CC0"); for (let i = 0; i < 6; i++) { const cx = 160 + i * 250; rr(ctx, cx, ct + 44, 230, fy - ct - 80, 10, "#7C7BCC"); rr(ctx, cx + 95, ct + 64, 40, 10, 5, "#C9D0EE"); }
      ctx.fillStyle = "#4E4D9C"; ctx.fillRect(140, fy - 30, 1520, 30);
      rr(ctx, 120, ct - 4, 1560, 32, 8, "#ECE2D2"); ctx.fillStyle = rgba("#FFFFFF", 0.6); ctx.fillRect(126, ct - 4, 1548, 4); ctx.fillStyle = "#C9BBA8"; ctx.fillRect(126, ct + 22, 1548, 6);
      stove(ctx, 420, ct, t, opt.api == null ? 0.8 : opt.api);
      const pan = opt.panci !== false; if (pan) pot(ctx, 500, ct - 50, t, opt.api == null ? 0.8 : opt.api);
      // talenan & sayur
      rr(ctx, 700, ct - 18, 200, 18, 6, "#E8C489"); circ(ctx, 760, ct - 34, 18, "#FF6F91"); circ(ctx, 800, ct - 30, 14, "#5BD68A"); ell(ctx, 850, ct - 28, 26, 10, "#FFB547");
      dispenser(ctx, 1790, fy, t);
      A = { counterTop: { x0: 120, x1: 1680, y: ct }, workspace: { x: 1080, y: ct }, stove: { x: 420, y: ct - 44 }, pot: { x: 500, y: ct - 162 }, shelf: { x0: sx0, x1: sx1, y: [270, 450] }, jarSlots: slots, window: { x: wx, y: wy, w: ww, h: wh }, stand: { x: 960, y: fy + 40 } };
    });
    if (opt.near !== false) NEAR.dapur(ctx, t, opt);
    ctx.restore(); shiftAnchors(A, dm);
    return { floorY: fy, anchors: A };
  }

  // ======================= SET: ruang makan =======================
  function chairBack(ctx, x, y, w, col) {   // sandaran kursi berjeruji (tampak depan, di belakang meja)
    const d = dk(col, 0.15); rr(ctx, x - w / 2, y + 10, 20, 230, 10, col); rr(ctx, x + w / 2 - 20, y + 10, 20, 230, 10, col);
    for (let i = 1; i < 4; i++) rr(ctx, x - w / 2 + i * w / 4 - 7, y + 50, 14, 180, 6, d);
    rr(ctx, x - w / 2 - 6, y, w + 12, 54, 16, col); ctx.fillStyle = rgba("#FFFFFF", 0.2); ctx.fillRect(x - w / 2 + 6, y + 6, w - 12, 5); rr(ctx, x - w / 2, y + 150, w, 16, 6, col); }
  function sideChair(ctx, x, fy, seatY, col, face) {   // kursi tampak samping; face 1 = menghadap kanan
    const d = dk(col, 0.2); shadow(ctx, x, fy, 90, 10, 0.4);
    ctx.fillStyle = d; ctx.fillRect(x - 60, seatY + 20, 14, fy - seatY - 20); ctx.fillRect(x + 46, seatY + 20, 14, fy - seatY - 20);
    rr(ctx, x - 70, seatY, 140, 26, 10, col); const bx = face > 0 ? x - 70 : x + 50; rr(ctx, bx, seatY - 220, 22, 240, 10, col); rr(ctx, bx - (face > 0 ? 0 : 6), seatY - 220, 28, 60, 10, lt(col, 0.1));
  }
  function riceCooker(ctx, x, y, t) {   // y = permukaan
    shadow(ctx, x, y, 90, 8, 0.35); rr(ctx, x - 80, y - 110, 160, 110, 40, "#F4F2FC"); ctx.fillStyle = "#D6D9F0"; ctx.fillRect(x - 80, y - 40, 160, 6);
    ell(ctx, x, y - 112, 74, 22, "#FFFFFF"); ell(ctx, x, y - 116, 50, 12, "#E6E8F8"); rr(ctx, x - 26, y - 70, 52, 20, 8, "#FF8FA8"); circ(ctx, x + 50, y - 60, 6, "#FFB547");
    light(ctx, x + 50, y - 60, 22, "#FFB547", 0.8 * (0.6 + 0.4 * Math.sin(t * 3)));
    rr(ctx, x + 70, y - 90, 30, 10, 5, "#C9D0EE");
    ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 7; ctx.lineCap = "round"; for (let i = 0; i < 2; i++) { const ph = (t * 0.5 + i * 0.5) % 1, sy = y - 140 - ph * 110; ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.beginPath(); ctx.moveTo(x - 10 + i * 20, sy + 30); ctx.bezierCurveTo(x - 26 + i * 20, sy + 10, x + 6 + i * 20, sy, x - 10 + i * 20, sy - 24); ctx.stroke(); } ctx.globalAlpha = 1;
  }
  function ruangMakan(ctx, t, opt = {}) {
    ctx.save();
    const fy = 820, dm = shift(opt, "mid"), lampOn = opt.lamp == null ? 1 : D.clamp(opt.lamp); let A;
    lay(ctx, dm, () => {
      wall(ctx, fy, "#4C59A8", "#6470BC", "ketupat", "#FFE3B0", 0.06);
      // panel lambris
      ctx.fillStyle = "#56609E"; ctx.fillRect(-500, 600, W + 1000, fy - 600); ctx.fillStyle = rgba("#FFFFFF", 0.1); ctx.fillRect(-500, 600, W + 1000, 5);
      floor(ctx, fy, "#53589E", dm, { wall: "#56609E" });
      // lemari kaca kiri
      shadow(ctx, 200, fy, 180, 14, 0.4); rr(ctx, 60, 360, 290, fy - 360, 12, "#B98A6A"); rr(ctx, 80, 380, 250, 250, 8, rgba("#BFE3FF", 0.35));
      [470, 560].forEach(y => { ctx.fillStyle = "#E8C489"; ctx.fillRect(80, y, 250, 8); }); [110, 170, 230, 290].forEach((x, i) => { ell(ctx, x, 452, 26, 26, i % 2 ? "#FFFFFF" : "#FF8FA8"); circ(ctx, x, 452, 14, i % 2 ? "#E6E8F8" : "#FFB0C2"); });
      [130, 200, 270].forEach((x, i) => rr(ctx, x - 18, 512, 36, 48, 6, ["#5BD68A", "#FFD38A", "#5AA9FF"][i]));
      rr(ctx, 80, 650, 250, 150, 8, "#A87A5C"); rr(ctx, 192, 710, 26, 10, 5, "#E8C489");
      // bingkai foto
      frameArt(ctx, 470, 170, 230, 180, "keluarga", t); frameArt(ctx, 1240, 150, 190, 230, "bunga", t); frameArt(ctx, 1460, 200, 170, 140, "gunung", t);
      clock(ctx, 760, 210, 50, t, opt.jam == null ? 19.5 : opt.jam);
      // meja samping + rice cooker
      shadow(ctx, 1720, fy, 170, 14, 0.4); rr(ctx, 1590, 660, 260, fy - 660, 10, "#B98A6A"); rr(ctx, 1576, 650, 288, 22, 8, "#D6AC88"); rr(ctx, 1610, 700, 220, 90, 8, "#A87A5C"); rr(ctx, 1700, 740, 40, 10, 5, "#E8C489");
      riceCooker(ctx, 1700, 650, t); rr(ctx, 1790, 610, 44, 40, 8, "#5AA9FF");
      // kursi belakang
      const seats = [{ x: 780, y: 640, facing: "depan" }, { x: 1140, y: 640, facing: "depan" }, { x: 470, y: 700, facing: "kanan" }, { x: 1450, y: 700, facing: "kiri" }];
      chairBack(ctx, 780, 420, 150, "#A8746A"); chairBack(ctx, 1140, 420, 150, "#A8746A");
      sideChair(ctx, 470, fy + 40, 700, "#A8746A", 1); sideChair(ctx, 1450, fy + 40, 700, "#A8746A", -1);
      // lampu gantung
      const lx = 960, ly = 330, sw = Math.sin(t * 0.6) * 0.012, lo = lampOn * flick(t, 2);
      ctx.save(); ctx.translate(lx, -20); ctx.rotate(sw); line(ctx, 0, 0, 0, ly - 40, "#2E3170", 4);
      if (lo > 0.01) cone(ctx, 0, ly + 10, 200, 900, 380, "#FFD38A", 0.22 * lo);
      ctx.fillStyle = "#FFB547"; ctx.beginPath(); ctx.moveTo(-140, ly + 10); ctx.quadraticCurveTo(-120, ly - 70, 0, ly - 70); ctx.quadraticCurveTo(120, ly - 70, 140, ly + 10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#FFD38A"; ctx.beginPath(); ctx.moveTo(-110, ly - 10); ctx.quadraticCurveTo(-90, ly - 60, 0, ly - 64); ctx.lineTo(0, ly - 52); ctx.quadraticCurveTo(-70, ly - 46, -80, ly); ctx.closePath(); ctx.fill();
      ell(ctx, 0, ly + 10, 140, 14, mix("#B07A3A", "#FFF4D0", lo)); ctx.restore();
      if (lo > 0.01) { light(ctx, lx, ly + 10, 1000, "#FFB547", 0.4 * lo); light(ctx, lx, ly + 10, 240, "#FFF0C8", 0.55 * lo); }
      // meja (tampak depan) dengan taplak motif kawung
      const tx0 = 560, tx1 = 1360, tt = 650, te = 710;
      shadow(ctx, 960, fy + 70, 520, 24, 0.45);
      ctx.fillStyle = "#8E6450"; [tx0 + 40, tx1 - 64].forEach(x => ctx.fillRect(x, te, 24, fy + 70 - te));
      poly(ctx, [[tx0 + 36, tt], [tx1 - 36, tt], [tx1, te], [tx0, te]], "#F4E6CF"); ctx.fillStyle = rgba("#FFFFFF", 0.4); ctx.fillRect(tx0 + 40, tt, tx1 - tx0 - 80, 3);
      ctx.save(); ctx.beginPath(); ctx.moveTo(tx0, te); ctx.lineTo(tx1, te); ctx.lineTo(tx1 + 6, 790); for (let x = tx1; x >= tx0; x -= 40) ctx.quadraticCurveTo(x - 20, 812, x - 40, 790); ctx.closePath();
      ctx.fillStyle = "#E36F8E"; ctx.fill(); ctx.clip();
      ctx.fillStyle = rgba("#FFD38A", 0.75); for (let x = tx0 + 30; x < tx1; x += 60) for (let y = te + 26; y < 800; y += 50) { const ox = ((y - te) / 50 | 0) % 2 ? 30 : 0; [[0, -10], [0, 10], [-10, 0], [10, 0]].forEach(([a, b]) => { ell(ctx, x + ox + a, y + b, a ? 9 : 5, a ? 5 : 9); ctx.fill(); }); }
      ctx.fillStyle = rgba("#FFFFFF", 0.25); ctx.fillRect(tx0, te, tx1 - tx0, 6); ctx.restore();
      if (opt.makanan !== false) {
        ell(ctx, 960, tt + 22, 70, 14, "#FFFFFF"); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(960, tt + 12, 50, Math.PI, 0); ctx.fill(); ell(ctx, 960, tt + 22, 56, 10, "#E6E8F8");   // bakul nasi
        [780, 1140].forEach(x => { ell(ctx, x, tt + 32, 62, 12, "#FFFFFF"); ell(ctx, x, tt + 30, 44, 8, "#E6E8F8"); });
        [640, 1280].forEach(x => { ell(ctx, x, tt + 44, 48, 10, "#FFFFFF"); });
        [870, 1050].forEach((x, i) => { rr(ctx, x - 14, tt - 18, 28, 50, 6, rgba("#BFE3FF", 0.7)); ctx.fillStyle = rgba(i ? "#FFB547" : "#C9603F", 0.7); ctx.fillRect(x - 12, tt + 6, 24, 24); });
        ell(ctx, 1200, tt + 20, 40, 9, "#5BD68A"); ell(ctx, 720, tt + 20, 40, 9, "#FFB547");
      }
      A = { seats, tableTop: { x0: tx0 + 36, x1: tx1 - 36, y: tt, front: te }, lamp: { x: lx, y: ly }, riceCooker: { x: 1700, y: 650 }, sideTable: { x0: 1576, x1: 1864, y: 650 }, frames: { x: 585, y: 260 }, stand: { x: 1700, y: fy + 40 } };
    });
    if (opt.near !== false) NEAR.ruangMakan(ctx, t, opt);
    ctx.restore(); shiftAnchors(A, dm);
    return { floorY: fy, anchors: A };
  }

  // ======================= SET: studio penjelas =======================
  // tiga lapis bentuk melayang: jauh (kecil, samar), tengah, dekat (besar, di tepi bingkai)
  const SH = (() => { const r = D.rng(23), out = [];
    for (let i = 0; i < 30; i++) { const L = i < 16 ? 0 : i < 25 ? 1 : 2; let x = r() * W; if (L === 2) x = r() < 0.5 ? r() * 300 : W - r() * 300;
      out.push({ L, x, y: 70 + r() * (L === 2 ? 760 : 640), s: [16, 34, 70][L] + r() * [18, 26, 50][L], k: (r() * 5) | 0, ph: r() * 6.28, c: (r() * 4) | 0 }); }
    return out; })();
  const STUDIO = { biru: ["#3A4C9E", "#5D6FC4", "#8A96E0"], ungu: ["#4A3F9A", "#7363C2", "#A394EC"], teal: ["#2F5E96", "#3F8DB2", "#6CC7D2"], senja: ["#4A3F9A", "#8A5FAE", "#F09A8E"] };
  function shape(ctx, k, s, col) {
    ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = Math.max(3, s * 0.16); ctx.lineCap = "round";
    if (k === 0) circ(ctx, 0, 0, s * 0.5, col); else if (k === 1) rr(ctx, -s / 2, -s / 2, s, s, s * 0.24, col);
    else if (k === 2) { ctx.lineJoin = "round"; poly(ctx, [[0, -s * 0.5], [s * 0.46, s * 0.32], [-s * 0.46, s * 0.32]]); ctx.fill(); ctx.stroke(); }
    else if (k === 3) { circ(ctx, 0, 0, s * 0.4); ctx.stroke(); }
    else { rr(ctx, -s * 0.5, -s * 0.13, s, s * 0.26, s * 0.13, col); rr(ctx, -s * 0.13, -s * 0.5, s * 0.26, s, s * 0.13, col); }
  }
  function studio(ctx, t, opt = {}) {
    ctx.save();
    const pal = STUDIO[opt.warna] || STUDIO.biru, fy = opt.floorY || 760, px = opt.px || 0, acc = [P.teal, P.amber, P.pink, P.violet];
    ctx.fillStyle = lin(ctx, 0, 0, 0, fy, [[0, pal[0]], [1, pal[1]]]); ctx.fillRect(0, 0, W, HH);
    // bola cahaya besar yang lembut (lapisan jauh)
    lay(ctx, -px * DEP.far, () => {
      light(ctx, 260 + Math.sin(t * 0.2) * 30, 180, 620, P.teal, 0.28); light(ctx, 1700, 300 + Math.sin(t * 0.17) * 30, 700, P.pink, 0.22); light(ctx, 1150, -80, 600, P.violet, 0.3);
      light(ctx, W / 2, fy - 200, 900, pal[2], 0.5);
      // busur konsentris di belakang panggung
      ctx.save(); ctx.translate(W / 2, fy); ctx.lineCap = "round";
      [420, 560, 720].forEach((r, i) => { ctx.strokeStyle = rgba("#FFFFFF", 0.1 - i * 0.02); ctx.lineWidth = 3; ctx.setLineDash([r * 0.08, r * 0.05]); ctx.lineDashOffset = t * (i % 2 ? 14 : -14); ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, TAU); ctx.stroke(); });
      ctx.setLineDash([]); ctx.restore();
    });
    // bentuk melayang tiga lapis
    SH.forEach(o => {
      const dep = [0.25, 0.6, 1.4][o.L], x = o.x - px * 90 * dep, y = o.y + Math.sin(t * (0.5 + o.L * 0.1) + o.ph) * (8 + o.L * 8), a = [0.16, 0.3, 0.42][o.L];
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.1 * (o.ph > 3 ? 1 : -1) + o.ph); ctx.globalAlpha = a;
      shape(ctx, o.k, o.s, o.L === 0 ? lt(pal[2], 0.3) : acc[o.c]);
      ctx.restore();
    });
    // lantai grid perspektif, memudar ke bawah
    ctx.fillStyle = lin(ctx, 0, fy, 0, HH, [[0, lt(pal[1], 0.12)], [0.5, pal[1]], [1, dk(pal[1], 0.15)]]); ctx.fillRect(0, fy, W, HH - fy);
    ctx.save(); ctx.beginPath(); ctx.rect(0, fy, W, HH - fy); ctx.clip();
    ctx.strokeStyle = lin(ctx, 0, fy, 0, HH, [[0, rgba("#FFFFFF", 0.32)], [0.45, rgba("#FFFFFF", 0.1)], [1, rgba("#FFFFFF", 0.02)]]); ctx.lineWidth = 2; ctx.beginPath();
    const vx = W / 2 - px * 120, vy = fy - 420;
    for (let i = -24; i <= 24; i++) { const xb = vx + i * 260; const xa = vx + (xb - vx) * (fy - vy) / (HH - vy); ctx.moveTo(xa, fy); ctx.lineTo(xb, HH); }
    const sc = (t * 0.25) % 1; let py = HH + 99; for (let n = 0; n < 40; n++) { const z = 1 + (n + 1 - sc) * 0.55, y = fy + (HH - fy) * 1.0 / z; if (py - y < 9) break; py = y; ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke(); ctx.restore();
    ctx.fillStyle = rgba("#FFFFFF", 0.3); ctx.fillRect(0, fy - 1, W, 3); light(ctx, W / 2, fy, 650, pal[2], 0.35);
    ell(ctx, W / 2, fy + 50, 420, 34, rgba("#FFFFFF", 0.06)); shadow(ctx, W / 2, fy + 50, 380, 28, 0.2);
    ctx.restore();
    return { floorY: fy, anchors: { center: { x: W / 2, y: fy }, kiri: { x: W * 0.28, y: fy }, kanan: { x: W * 0.72, y: fy }, papan: { x: W / 2, y: 400, w: 1300, h: 560 } } };
  }

  // ======================= showcase =======================
  function cell(ctx, i, cap, fn, marks) {
    const cw = W / 3, ch = HH / 3, x = (i % 3) * cw, y = Math.floor(i / 3) * ch;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, cw, ch); ctx.clip(); ctx.translate(x, y); ctx.scale(1 / 3, 1 / 3);
    const res = fn();
    if (marks && res) { const pts = marks(res.anchors); ctx.fillStyle = P.pink; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; pts.forEach(p => { if (!p) return; circ(ctx, p.x, p.y, 14); ctx.fill(); ctx.stroke(); }); ctx.strokeStyle = rgba(P.pink, 0.8); ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(0, res.floorY); ctx.lineTo(W, res.floorY); ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
    ctx.save(); ctx.font = `800 22px ${K.FONT}`; const tw = ctx.measureText(cap).width; ctx.fillStyle = "rgba(10,16,48,0.82)"; rr(ctx, x + 10, y + 10, tw + 24, 36, 10); ctx.fill(); ctx.fillStyle = "#F2F6FF"; ctx.textBaseline = "middle"; ctx.fillText(cap, x + 22, y + 29); ctx.restore();
    ctx.strokeStyle = "#0B1236"; ctx.lineWidth = 4; ctx.strokeRect(x, y, cw, ch);
  }
  function showcase(ctx, t) {
    const px = Math.sin(t * 0.9), u = 0.5 - 0.5 * Math.cos(t * Math.PI / 3.4);
    cell(ctx, 0, "kamar · lamp 1, px " + px.toFixed(1), () => kamar(ctx, t, { px }), a => [a.bedTop && { x: a.bedTop.x0, y: a.bedTop.y }, a.pillow, a.sit, a.nightstandTop, a.phone, a.door, a.stand]);
    cell(ctx, 1, "kamar · lamp 0, phoneGlow, ring, pintu .5", () => kamar(ctx, t, { lamp: 0, phoneGlow: 0.6 + 0.4 * Math.sin(t * 5), ring: 1, pintu: 0.5 }), a => [a.phone, a.door]);
    cell(ctx, 2, "lewatDinding · u " + u.toFixed(2), () => lewatDinding(ctx, t, u, {}), null);
    cell(ctx, 3, "kamarAnak · lamp 0 · + selimut()", () => { const r = kamarAnak(ctx, t, {}); selimut(ctx, "kamarAnak", t, {}); return r; }, a => [a.pillow, a.guling, a.deskTop && { x: a.deskTop.x0, y: a.deskTop.y }, a.phone, a.chair]);
    cell(ctx, 4, "kampung · senja .8", () => kampung(ctx, t, { px, senja: 0.8 }), a => a.doors.concat([a.lamp, a.motor]));
    cell(ctx, 5, "kampung · senja 0 (malam)", () => kampung(ctx, t, { senja: 0, pintu: 0.6 }), null);
    cell(ctx, 6, "dapur · api .8", () => dapur(ctx, t, { px }), a => a.jarSlots.concat([a.stove, a.pot, a.workspace]));
    cell(ctx, 7, "ruangMakan · lamp 1", () => ruangMakan(ctx, t, { px }), a => a.seats.concat([a.riceCooker, a.lamp]));
    cell(ctx, 8, "studio · biru / ungu", () => studio(ctx, t, { px, warna: t > 2.5 ? "ungu" : "biru" }), a => [a.center, a.kiri, a.kanan]);
  }

  K.kit.latar = { kamar, kamarAnak, dinding, lewatDinding, selimut, kampung, dapur, ruangMakan, studio, depan, showcase,
    // perabot kecil yang mungkin berguna di adegan lain
    parts: { clock, tableLamp, phoneFlat, nightstand, frameArt, door, plant, jar, pot, stove, riceCooker, scooter, streetLamp, house, mangoTree, bananaTree, palm, curtain, windowFrame, nightView },
    WALL_W: WW };
})(typeof window !== "undefined" ? window : globalThis);
