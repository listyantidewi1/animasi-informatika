/* dokkit/bipkit.js — Bip beraksi (pose dengan lengan) dan properti kecil untuk dokumenter D03 dan seterusnya.
   Bip digambar ulang di sini dengan rupa yang sama dengan TikTok.helpers.bip (warna, proporsi, mata, antena), ditambah lengan
   karet bulat, kaki melangkah, pinggir terang lembut. Semua deterministik (t dalam detik), ctx dikembalikan seperti semula.
   API:
     K.kit.bipkit.draw(ctx, x, y, s, opt) -> anchors      (x, y) = tengah badan (sama dengan D.bip), s = ukuran (lebar badan ±0.9 s)
       opt.pose  diam | jalan | tunjuk | kaget | pegang | bisik | tekan | kacaPembesar
       opt.mood  happy | sad | think | wow (bawaan per pose), opt.look [dx,dy] -1..1 (bawaan: ke target/arah), opt.t, opt.seed
       opt.dir   1 kanan | -1 kiri (jalan, bisik; tunjuk/tekan/kaca bila target tidak ada)
       opt.target [x,y] dunia (tunjuk, tekan, kacaPembesar)       opt.wave (diam: angka -> tangan kanan melambai)
       jalan: opt.speed (1)          kaget: opt.k detik sejak kaget (bawaan t % 2.4), opt.seru false = tanpa tanda seru
       pegang: opt.prop(ctx, px, py, s) digambar di depan badan, opt.grip (setengah jarak tangan, satuan s, 0.3)
       tekan: opt.press 0..1 (0 = jari berhenti di atas target, 1 = menekan)
       kacaPembesar: opt.glass (diameter lensa, satuan s, 0.5), opt.content(ctx, cx, cy, r) isi lensa (sudah di-clip)
       opt.sweat (tetes keringat), opt.alpha
       anchors: { x, y, s, top:[x,y] (ujung antena), head:[x,y] (atas badan), mouth, hand (tangan aktif), tip (ujung jari/lensa), whisper, feet (y lantai) }
   Properti (semua: (ctx, x, y, size, opt) dengan opt.t untuk gerak diam):
     kacaPembesar  (x,y) tengah lensa, size diameter lensa; angle (arah gagang, bawaan 2.35), content(ctx,cx,cy,r), rim warna bingkai
     toples        (x,y) tengah dasar, size tinggi; label, color isi, fill 0..1, tilt (rad, miring dari dasar), pour 0..1 (aliran keluar),
                   pourTo (y dunia ujung aliran, mis. mouth[1] panci + 10) atau pourLen px, lid (true), labelCol; -> { mouth:[x,y], top }
     panci         (x,y) tengah dasar, size lebar; color, liquid, steam 0..1, steamShape '!' + form 0..1, steamH px, fire 0..1, lid false
                   -> { mouth:[x,y], w }
     mapBerkas     (x,y) tengah dasar tumpukan, size lebar map; n jumlah, grey jumlah map abu-abu teratas (true = semua),
                   greyLabel ("tidak dilaporkan"), labelSide 1|-1, drop 0..1 (map teratas jatuh), seed -> { top:[x,y], h }
     gembok        (x,y) tengah badan gembok, size tinggi total; locked 0..1, color, flash 0..1 (cahaya klik)
     kertasLipat   (x,y) tengah kertas, size lebar; word, fold 0..1 (0-.5 lipat atas ke bawah, .5-1 lipat kiri ke kanan), write 0..1, pencil
     stopwatch     (x,y) tengah muka, size diameter; seconds, range (5 detik satu putaran), run, readout (true), unit ("detik")
     meteran       (x,y) tengah panel, size lebar panel; value 0..100, label ("kemiripan") -> { top, bottom }
     benderaMerah  (x,y) kaki tiang, size tinggi tiang; raise 0..1, icon true = ikon bulat berpusat di (x,y) berdiameter size
     daftarPeriksa (x,y) kiri-atas baris, size lebar; text, icon (IKON), state none|check|flag|cross, u 0..1 muncul, su 0..1 status muncul,
                   textSize (≥44), h -> tinggi baris (untuk menumpuk)
     tombol        (x,y) tengah muka tombol, size lebar; label, color, press 0..1, blink 0..1, h -> { top:[x,y] } (titik tekan untuk pose tekan)
     ikon(ctx, nama, cx, cy, r, opt)   ikon vektor dalam lingkaran: IKON = hpBaru, rekening, larangan, teleponBalik, putus, tanya, gembok, uang
     seru(ctx, x, y, h, opt)           tanda seru vektor (x,y) = tengah, h = tinggi
     showcase(ctx, t) */
(function (g) {
  const K = g.Kiko, D = K.dok, H = K.helpers; K.kit = K.kit || {};
  const P = D.P, TAU = Math.PI * 2, PI = Math.PI;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, u) => a + (b - a) * u;
  const eio = D.eio, eout = D.eout, spring = D.spring;
  const TC = (g.TikTok && g.TikTok.C) || {};
  const C = { bip: TC.bip || "#22E3C4", dark: TC.bipDark || "#0E9C88", light: TC.bipLight || "#8FF5E3", eye: "#FFFFFF", pupil: TC.pupil || "#0B0E2A", kuning: TC.kuning || "#FFD23F" };
  const INK = "#1C2050";

  // ---------- warna ----------
  const CC = {};
  const rgb = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  function mix(a, b, f) { const k = a + b + f; if (CC[k]) return CC[k]; const A = rgb(a), B = rgb(b); const r = A.map((v, i) => Math.round(v + (B[i] - v) * f)); return (CC[k] = "#" + ((1 << 24) + (r[0] << 16) + (r[1] << 8) + r[2]).toString(16).slice(1)); }
  const dark = (c, f = 0.22) => mix(c, "#1A1F55", f), lite = (c, f = 0.25) => mix(c, "#FFF4E2", f);
  const A_ = (c, a) => D.hexA(c, a);
  const font = (ctx, size, w = 800, it = "") => { ctx.font = `${it}${w} ${size}px ${K.FONT}`; };
  function say(ctx, s, x, y, size, col, opt = {}) {
    font(ctx, size, opt.w || 800, opt.italic ? "italic " : ""); ctx.fillStyle = col; ctx.textAlign = opt.align || "center"; ctx.textBaseline = "middle";
    ctx.fillText(s, x, y); ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
  }
  function tw(ctx, s, size, w = 800) { font(ctx, size, w); return ctx.measureText(s).width; }
  function shadow(ctx, x, y, rx, ry, a = 0.22) { ctx.fillStyle = `rgba(16,20,64,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); }
  // isi bentuk fn lalu pita gelap (bawah-kiri) dan pita terang (atas-kanan) di dalamnya: pemisahan tanpa garis tepi
  function solid(ctx, fn, col, d = 4, la = 0.28, da = 0.2) {
    ctx.fillStyle = col; ctx.beginPath(); fn(); ctx.fill();
    ctx.save(); ctx.beginPath(); fn(); ctx.clip();
    ctx.beginPath(); fn(); ctx.save(); ctx.translate(d * 0.8, -d * 0.9); fn(); ctx.restore(); ctx.fillStyle = `rgba(26,28,84,${da})`; ctx.fill("evenodd");
    ctx.beginPath(); fn(); ctx.save(); ctx.translate(-d * 0.4, d * 0.45); fn(); ctx.restore(); ctx.fillStyle = `rgba(255,244,226,${la})`; ctx.fill("evenodd");
    ctx.restore();
  }
  const rrp = (ctx, x, y, w, h, r) => { r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2)); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };

  // ======================================================================
  // BIP
  // ======================================================================
  const ARM = mix(C.bip, C.dark, 0.38);
  function bipFace(ctx, s, o) {
    const mood = o.mood, big = mood === "wow" ? 1.15 : 1;
    ctx.fillStyle = "rgba(255,79,154,0.55)"; ctx.beginPath(); ctx.ellipse(-s * 0.27, s * 0.1, s * 0.07, s * 0.045, 0, 0, TAU); ctx.ellipse(s * 0.27, s * 0.1, s * 0.07, s * 0.045, 0, 0, TAU); ctx.fill();
    const [lx, ly] = o.look;
    for (const k of [-1, 1]) {
      const ex = k * s * 0.15, ey = -s * 0.06;
      ctx.fillStyle = C.eye; ctx.beginPath(); ctx.ellipse(ex, ey, s * 0.11 * big, o.blink ? s * 0.015 : s * 0.13 * big, 0, 0, TAU); ctx.fill();
      if (!o.blink) {
        ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(ex + lx * s * 0.04, ey + ly * s * 0.05, s * 0.065, 0, TAU); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex + lx * s * 0.04 - s * 0.025, ey + ly * s * 0.05 - s * 0.03, s * 0.022, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.025; ctx.lineCap = "round";
      if (mood === "sad" || mood === "think") {
        ctx.beginPath();
        if (mood === "sad") { ctx.moveTo(ex - k * s * 0.09, ey - s * 0.17); ctx.lineTo(ex + k * s * 0.05, ey - s * 0.2); }
        else { ctx.moveTo(ex - s * 0.08, ey - s * 0.19 - (k > 0 ? s * 0.03 : 0)); ctx.lineTo(ex + s * 0.08, ey - s * 0.19); }
        ctx.stroke();
      } else if (mood === "wow" && o.brows) { ctx.beginPath(); ctx.arc(ex, ey - s * 0.12, s * 0.09, PI * 1.25, PI * 1.75); ctx.stroke(); }
    }
    ctx.strokeStyle = C.pupil; ctx.fillStyle = C.pupil; ctx.lineWidth = s * 0.03; ctx.lineCap = "round";
    const m = o.mouth || mood;
    if (m === "wow") { ctx.beginPath(); ctx.ellipse(0, s * 0.17, s * 0.05, s * 0.065, 0, 0, TAU); ctx.fill(); }
    else if (m === "o") { ctx.beginPath(); ctx.ellipse(o.mx || 0, s * 0.16, s * 0.032, s * 0.038, 0, 0, TAU); ctx.fill(); }
    else if (m === "sad") { ctx.beginPath(); ctx.arc(0, s * 0.22, s * 0.07, PI * 1.15, PI * 1.85); ctx.stroke(); }
    else if (m === "think") { ctx.beginPath(); ctx.moveTo(-s * 0.05, s * 0.16); ctx.lineTo(s * 0.06, s * 0.14); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(0, s * 0.1, s * 0.08, PI * 0.15, PI * 0.85); ctx.stroke(); }
  }
  function antenna(ctx, s, t, ph, extra = 0) {
    const sway = Math.sin(t * 3.2 + ph) * 0.12 + extra;
    const ax = Math.sin(sway) * s * 0.3, ay = -s * 0.42 - Math.cos(sway) * s * 0.26;
    ctx.strokeStyle = C.dark; ctx.lineWidth = s * 0.035; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0, -s * 0.4); ctx.quadraticCurveTo(ax * 0.3, (ay - s * 0.4) / 2, ax, ay); ctx.stroke();
    D.glow(ctx, ax, ay, s * 0.2, C.kuning, 0.55);
    ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(ax, ay, s * 0.065, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(ax - s * 0.02, ay - s * 0.02, s * 0.022, 0, TAU); ctx.fill();
    return [ax, ay];
  }
  function bodyShape(ctx, s) {
    const g2 = ctx.createRadialGradient(-s * 0.15, -s * 0.2, s * 0.05, 0, 0, s * 0.48);
    g2.addColorStop(0, C.light); g2.addColorStop(0.35, C.bip); g2.addColorStop(1, C.dark);
    ctx.fillStyle = g2; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.42, 0, 0, TAU); ctx.fill();
    // pinggir terang lembut di kanan atas (cahaya bulan/lampu)
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.42, 0, 0, TAU); ctx.clip();
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.42, 0, 0, TAU); ctx.ellipse(-s * 0.03, s * 0.025, s * 0.45, s * 0.42, 0, 0, TAU);
    ctx.fillStyle = "rgba(225,255,250,0.3)"; ctx.fill("evenodd"); ctx.restore();
  }
  function hose(ctx, s, ax, ay, bx, by, bend = 0.15, col = ARM) {
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, mx = (ax + bx) / 2 - dy / L * bend * L, my = (ay + by) / 2 + dx / L * bend * L;
    ctx.strokeStyle = col; ctx.lineWidth = s * 0.085; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(mx, my, bx, by); ctx.stroke();
  }
  function hand(ctx, s, hx, hy, ang, kind = "kepal") {
    if (kind === "tunjuk") { ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); ctx.fillStyle = C.bip; ctx.beginPath(); rrp(ctx, 0, -s * 0.024, s * 0.125, s * 0.048, s * 0.024); ctx.fill(); ctx.restore(); }
    if (kind === "buka") { ctx.fillStyle = C.bip; for (const da of [-0.75, -0.25, 0.25, 0.75]) { ctx.beginPath(); ctx.arc(hx + Math.cos(ang + da) * s * 0.075, hy + Math.sin(ang + da) * s * 0.075, s * 0.03, 0, TAU); ctx.fill(); } }
    const r = kind === "buka" ? s * 0.075 : s * 0.07;
    ctx.fillStyle = C.bip; ctx.beginPath(); ctx.arc(hx, hy, r, 0, TAU); ctx.fill();
    ctx.fillStyle = A_(C.dark, 0.35); ctx.beginPath(); ctx.arc(hx, hy, r, PI * 0.1, PI * 0.9); ctx.arc(hx, hy - r * 0.25, r * 0.92, PI * 0.9, PI * 0.1, true); ctx.fill();
    ctx.fillStyle = A_(C.light, 0.75); ctx.beginPath(); ctx.arc(hx - r * 0.3, hy - r * 0.35, r * 0.32, 0, TAU); ctx.fill();
  }
  function restHand(ctx, s, k, dy = 0, dx = 0) { ctx.fillStyle = C.bip; ctx.beginPath(); ctx.ellipse(k * s * 0.44 + dx, s * 0.1 + dy, s * 0.08, s * 0.12, -k * 0.5, 0, TAU); ctx.fill();
    ctx.fillStyle = A_(C.dark, 0.3); ctx.beginPath(); ctx.ellipse(k * s * 0.44 + dx + k * s * 0.015, s * 0.13 + dy, s * 0.06, s * 0.08, -k * 0.5, 0, TAU); ctx.fill(); }
  function seru(ctx, x, y, h, opt = {}) {
    const col = opt.color || P.amber, w = h * 0.26;
    ctx.save(); ctx.translate(x, y); if (opt.rot) ctx.rotate(opt.rot);
    if (opt.glow !== false) D.glow(ctx, 0, 0, h * 0.8, col, 0.5);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + w / 2); ctx.arc(0, -h / 2 + w / 2, w / 2, PI, 0); ctx.lineTo(w * 0.28, h * 0.16); ctx.arc(0, h * 0.16, w * 0.28, 0, PI); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0, h / 2 - w * 0.42, w * 0.42, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.beginPath(); ctx.ellipse(-w * 0.14, -h / 2 + w * 0.7, w * 0.11, h * 0.16, 0.06, 0, TAU); ctx.fill();
    ctx.restore();
  }

  const DEF_MOOD = { diam: "happy", jalan: "happy", tunjuk: "happy", kaget: "wow", pegang: "happy", bisik: "happy", tekan: "think", kacaPembesar: "think" };
  function draw(ctx, x, y, s, opt = {}) {
    const t = opt.t || 0, pose = opt.pose || "diam", ph = (opt.seed || 0) * 1.37;
    let dir = opt.dir < 0 ? -1 : 1, mood = opt.mood || DEF_MOOD[pose] || "happy";
    let hop = 0, tilt = 0, shake = 0, sq = 0, look = null, antX = 0;
    const breath = Math.sin(t * 2.2 + ph);
    let feet = [[-s * 0.17, 0], [s * 0.17, 0]];   // [x, angkat]
    const tg = opt.target;
    if (tg && (pose === "tunjuk" || pose === "tekan" || pose === "kacaPembesar") && Math.abs(tg[0] - x) > s * 0.05) dir = tg[0] < x ? -1 : 1;
    let mouthO = null, brows = false, k = 0;
    if (pose === "jalan") {
      const cyc = t * TAU * 1.5 * (opt.speed || 1) + ph;
      hop = Math.abs(Math.sin(cyc)) * s * 0.055; tilt = dir * 0.07; look = [dir * 0.75, 0];
      feet = [[-s * 0.15 + dir * Math.sin(cyc) * s * 0.1, Math.max(0, Math.cos(cyc)) * s * 0.07], [s * 0.15 - dir * Math.sin(cyc) * s * 0.1, Math.max(0, -Math.cos(cyc)) * s * 0.07]];
      antX = -dir * 0.15;
    } else if (pose === "kaget") {
      k = opt.k != null ? opt.k : t % 2.4;
      const up = clamp((k - 0.1) / 0.5);
      hop = Math.sin(PI * up) * s * 0.3;
      sq = k < 0.1 ? -0.1 * Math.sin(PI * k / 0.1) : (k > 0.6 && k < 0.85 ? -0.09 * Math.sin(PI * (k - 0.6) / 0.25) : (up > 0 && up < 1 ? 0.06 * Math.sin(PI * up) : 0));
      if (k > 0.85) shake = Math.sin(t * 47) * s * 0.008 * Math.max(0, 1 - (k - 0.85) / 1.2);
      brows = true; antX = Math.sin(k * 14) * 0.25 * Math.exp(-k * 2);
    } else if (pose === "bisik") { tilt = dir * 0.12; look = [dir * 0.85, 0.1]; mouthO = "o"; }
    else if (pose === "tekan") { tilt = dir * 0.05; }
    sq += breath * 0.012;
    if (pose === "diam" || pose === "pegang") hop = (0.5 + 0.5 * Math.sin(t * 1.6 + ph)) * s * 0.012;
    const ox = x + shake, oy = y - hop, ct = Math.cos(tilt), st = Math.sin(tilt);
    const toL = (wx, wy) => { const dx = wx - ox, dy = wy - oy; return [ct * dx + st * dy, -st * dx + ct * dy]; };
    const toW = (lx, ly) => [ox + ct * lx - st * ly, oy + st * lx + ct * ly];
    const blink = ((t + ph * 2.1) % 3.4) > 3.27;
    const out = { x, y, s, feet: y + s * 0.5 };

    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    // bayangan lantai (tidak ikut melompat)
    const hs = 1 - clamp(hop / s * 1.8, 0, 0.6);
    ctx.fillStyle = "rgba(14,18,60,0.3)"; ctx.beginPath(); ctx.ellipse(x, y + s * 0.5, s * 0.36 * hs, s * 0.07 * hs, 0, 0, TAU); ctx.fill();
    ctx.translate(ox, oy); ctx.rotate(tilt);

    // --- lengan: hitung dulu (lokal) ---
    const back = [], front = []; let rest = [true, true], restDy = [0, 0], restDx = [0, 0], propFn = null, lens = null;
    if (pose === "diam") {
      restDy = [Math.sin(t * 2.2 + ph) * s * 0.008, Math.sin(t * 2.2 + ph + 0.6) * s * 0.008];
      if (opt.wave !== undefined) { rest[1] = false; const a = -1.15 + Math.sin(opt.wave * 7) * 0.35; const hx = s * 0.36 + Math.cos(a) * s * 0.3, hy = -s * 0.02 + Math.sin(a) * s * 0.3; back.push({ from: [s * 0.36, s * 0.02], to: [hx, hy], bend: -0.2, kind: "buka", ang: a }); out.hand = toW(hx, hy); }
    } else if (pose === "jalan") {
      const cyc = t * TAU * 1.5 * (opt.speed || 1) + ph; restDx = [Math.sin(cyc) * s * 0.06 * dir, -Math.sin(cyc) * s * 0.06 * dir]; restDy = [-Math.abs(Math.cos(cyc)) * s * 0.02, -Math.abs(Math.cos(cyc)) * s * 0.02];
    } else if (pose === "tunjuk" || pose === "kacaPembesar") {
      const side = dir, sh = [side * s * 0.33, s * 0.04];
      const [tx, ty] = tg ? toL(tg[0], tg[1]) : [side * s * 1.2, -s * 0.3];
      let dx = tx - sh[0], dy = ty - sh[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      look = [clamp(dx * 1.1, -1, 1), clamp(dy * 1.1, -1, 1)];
      rest[side > 0 ? 1 : 0] = false;
      if (pose === "tunjuk") {
        const reach = s * (0.36 + 0.015 * Math.sin(t * 5 + ph));
        const hx = sh[0] + dx * reach, hy = sh[1] + dy * reach;
        back.push({ from: sh, to: [hx, hy], bend: 0.08 * side, kind: "tunjuk", ang: Math.atan2(dy, dx) });
        out.hand = toW(hx, hy); out.tip = toW(hx + dx * s * 0.17, hy + dy * s * 0.17);
      } else {
        const gr = (opt.glass || 0.5) * s / 2, handle = gr * 1.25;
        const ld = clamp(d, s * 0.55, s * 0.9) + Math.sin(t * 1.3 + ph) * s * 0.012;
        const lx = sh[0] + dx * ld, ly = sh[1] + dy * ld, hx = lx - dx * (gr + handle * 0.75), hy = ly - dy * (gr + handle * 0.75);
        back.push({ from: sh, to: [hx, hy], bend: 0.1 * side, kind: null });
        lens = { lx, ly, gr, ang: Math.atan2(-dy, -dx), hx, hy };
        out.hand = toW(hx, hy); out.tip = toW(lx, ly);
      }
    } else if (pose === "kaget") {
      rest = [false, false]; const raise = clamp((k - 0.05) / 0.25);
      for (const sd of [-1, 1]) { const hx = sd * s * lerp(0.48, 0.56, raise), hy = lerp(s * 0.12, -s * 0.38, eout(raise)) + Math.sin(t * 20 + sd) * s * 0.008;
        back.push({ from: [sd * s * 0.32, -s * 0.02], to: [hx, hy], bend: -0.15 * sd, kind: "buka", ang: Math.atan2(hy + s * 0.02, hx - sd * s * 0.32) }); }
    } else if (pose === "pegang") {
      rest = [false, false]; const gw = (opt.grip || 0.3) * s, py = s * 0.2 + Math.sin(t * 1.6 + ph) * s * 0.006;
      propFn = () => { if (opt.prop) { const [wx, wy] = toW(0, py); ctx.save(); ctx.rotate(-tilt); ctx.translate(-ox, -oy); opt.prop(ctx, wx, wy, s); ctx.restore(); } };
      for (const sd of [-1, 1]) front.push({ from: [sd * s * 0.38, s * 0.04], to: [sd * gw, py], bend: 0.18 * sd, kind: "kepal", ang: 0, arm: true });
      out.hand = toW(0, py);
    } else if (pose === "bisik") {
      rest[dir > 0 ? 1 : 0] = false;
      front.push({ cup: true, to: [dir * s * 0.33, s * 0.1] });
      out.whisper = toW(dir * s * 0.75, s * 0.06); out.hand = toW(dir * s * 0.33, s * 0.1);
    } else if (pose === "tekan") {
      const side = dir; rest[side > 0 ? 1 : 0] = false;
      const sh = [side * s * 0.34, s * 0.12];
      const [tx, ty] = tg ? toL(tg[0], tg[1]) : [side * s * 0.45, s * 0.85];
      const pr = opt.press == null ? 0.5 + 0.5 * Math.sin(t * 2) : opt.press;
      const tipY = lerp(ty - s * 0.12 + Math.sin(t * 3 + ph) * s * 0.008 * (1 - pr), ty + s * 0.025, eio(pr)), fl = s * 0.11, hr = s * 0.07;
      const hx = tx, hy = tipY - fl - hr * 0.3;
      back.push({ from: sh, to: [hx, hy], bend: 0.12 * side, kind: "tunjuk", ang: PI / 2 });
      look = [clamp((tx - 0) / (s * 0.8), -0.6, 0.6), 0.9];
      out.hand = toW(hx, hy); out.tip = toW(tx, tipY);
    }

    // --- kaki ---
    ctx.fillStyle = C.dark;
    for (const [fx, lift] of feet) { ctx.beginPath(); ctx.ellipse(fx, s * 0.43 + hop - lift - (pose === "kaget" ? hop * 0.7 : 0), s * 0.11, s * 0.07, 0, 0, TAU); ctx.fill(); }
    // --- antena + lengan belakang + tangan istirahat ---
    ctx.save(); ctx.translate(0, s * 0.43); ctx.scale(1 - sq * 0.8, 1 + sq); ctx.translate(0, -s * 0.43);
    const [aX, aY] = antenna(ctx, s, t, ph, antX); out.top = toW(aX, aY);
    ctx.restore();
    for (const a of back) { hose(ctx, s, a.from[0], a.from[1], a.to[0], a.to[1], a.bend); }
    for (const a of back) if (a.kind) hand(ctx, s, a.to[0], a.to[1], a.ang, a.kind);
    for (const k2 of [0, 1]) if (rest[k2]) restHand(ctx, s, k2 ? 1 : -1, restDy[k2], restDx[k2]);
    // --- badan + wajah (dengan squash) ---
    ctx.save(); ctx.translate(0, s * 0.43); ctx.scale(1 - sq * 0.8, 1 + sq); ctx.translate(0, -s * 0.43);
    bodyShape(ctx, s);
    bipFace(ctx, s, { mood, look: opt.look || look || (mood === "think" ? [0.6, -0.7] : [0, 0]), blink, mouth: mouthO, mx: pose === "bisik" ? dir * s * 0.03 : 0, brows });
    if (opt.sweat) { const u = (t * 0.6 + ph) % 1; ctx.globalAlpha *= 1 - u * 0.7; ctx.fillStyle = "#9FE3FF"; const sx = -dir * s * 0.36, sy = -s * 0.2 + u * s * 0.15; ctx.beginPath(); ctx.moveTo(sx, sy - s * 0.08); ctx.quadraticCurveTo(sx + s * 0.045, sy, sx, sy + s * 0.035); ctx.quadraticCurveTo(sx - s * 0.045, sy, sx, sy - s * 0.08); ctx.fill(); }
    ctx.restore();
    out.head = toW(0, -s * 0.42); out.mouth = toW(0, s * 0.15);
    // --- depan ---
    if (propFn) { for (const a of front) if (a.arm) hose(ctx, s, a.from[0], a.from[1], lerp(a.from[0], a.to[0], 0.7), lerp(a.from[1], a.to[1], 0.7), a.bend); propFn(); }
    for (const a of front) {
      if (a.cup) {   // tangan menangkup di samping mulut
        const [hx, hy] = a.to; ctx.save(); ctx.translate(hx, hy); ctx.scale(dir, 1);
        ctx.fillStyle = C.bip; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.065, s * 0.11, 0.15, 0, TAU); ctx.fill();
        ctx.fillStyle = A_(C.dark, 0.35); ctx.beginPath(); ctx.ellipse(s * 0.02, s * 0.01, s * 0.035, s * 0.085, 0.15, 0, TAU); ctx.fill();
        ctx.fillStyle = A_(C.light, 0.7); ctx.beginPath(); ctx.ellipse(-s * 0.025, -s * 0.04, s * 0.02, s * 0.04, 0.15, 0, TAU); ctx.fill();
        ctx.restore();
        // gelombang bisikan
        ctx.lineCap = "round";
        for (let i = 0; i < 3; i++) { const u = ((t * 0.9 + i / 3 + ph) % 1), r = s * (0.12 + u * 0.32);
          ctx.strokeStyle = `rgba(255,248,232,${0.85 * Math.sin(PI * u)})`; ctx.lineWidth = s * 0.03 * (1 - u * 0.5);
          ctx.beginPath(); ctx.arc(hx + dir * s * 0.02, hy - s * 0.02, r, dir > 0 ? -0.55 : PI - 0.55, dir > 0 ? 0.55 : PI + 0.55); ctx.stroke(); }
      } else hand(ctx, s, a.to[0], a.to[1], a.ang, a.kind);
    }
    ctx.restore();
    // --- efek di ruang dunia ---
    if (lens) { const [lx, ly] = toW(lens.lx, lens.ly), [hx, hy] = toW(lens.hx, lens.hy);
      kacaPembesarW(ctx, lx, ly, lens.gr * 2, { angle: Math.atan2(hy - ly, hx - lx), t, content: opt.content }); hand(ctx, s, hx, hy, 0, "kepal"); }
    if (pose === "kaget" && opt.seru !== false) {
      const u = clamp((k - 0.12) / 0.6), sp = spring(k - 0.12, 11, 0.4);
      if (u > 0) {
        const [hx, hy] = toW(s * 0.48, -s * 0.78);
        ctx.save(); ctx.globalAlpha *= clamp(u * 4) * (opt.alpha == null ? 1 : opt.alpha);
        seru(ctx, hx, hy, s * 0.42 * sp, { rot: 0.18 });
        ctx.strokeStyle = P.amber; ctx.lineWidth = s * 0.03; ctx.lineCap = "round";
        const [cx0, cy0] = toW(0, -s * 0.1);
        for (const a of [-2.5, -2.05, -1.1 + 0.0, -0.65]) { const r0 = s * (0.56 + 0.04 * sp), r1 = r0 + s * 0.12 * clamp(u * 3); ctx.beginPath(); ctx.moveTo(cx0 + Math.cos(a) * r0, cy0 + Math.sin(a) * r0); ctx.lineTo(cx0 + Math.cos(a) * r1, cy0 + Math.sin(a) * r1); ctx.stroke(); }
        ctx.restore();
      }
    }
    out.hand = out.hand || toW(s * 0.44, s * 0.1); out.tip = out.tip || out.hand; out.whisper = out.whisper || toW(dir * s * 0.75, s * 0.06);
    return out;
  }

  // ======================================================================
  // PROPERTI
  // ======================================================================
  function kacaPembesar(ctx, x, y, size, opt = {}) {
    const r = size / 2, t = opt.t || 0, ang = opt.angle == null ? 2.35 : opt.angle, rim = opt.rim || "#FFC25C";
    ctx.save(); ctx.translate(x, y);
    // gagang
    ctx.save(); ctx.rotate(ang);
    ctx.fillStyle = "#6B4FB8"; ctx.beginPath(); rrp(ctx, r * 0.98, -r * 0.2, r * 1.2, r * 0.4, r * 0.2); ctx.fill();
    ctx.fillStyle = "#8C72E0"; ctx.beginPath(); rrp(ctx, r * 1.05, -r * 0.2, r * 1.1, r * 0.13, r * 0.07); ctx.fill();
    ctx.fillStyle = dark(rim, 0.15); ctx.beginPath(); rrp(ctx, r * 0.9, -r * 0.24, r * 0.26, r * 0.48, r * 0.08); ctx.fill();
    ctx.restore();
    // lensa
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r * 0.9, 0, TAU); ctx.clip();
    ctx.fillStyle = "rgba(196,232,255,0.28)"; ctx.fillRect(-r, -r, 2 * r, 2 * r);
    if (opt.content) opt.content(ctx, x, y, r * 0.9);   // catatan: content menerima koordinat lokal sesudah translate
    const sw = ((t * 0.25) % 1.6) - 0.3;   // kilau menyapu
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.moveTo(lerp(-2 * r, 2 * r, sw) - r * 0.3, -r); ctx.lineTo(lerp(-2 * r, 2 * r, sw) + r * 0.05, -r); ctx.lineTo(lerp(-2 * r, 2 * r, sw) - r * 0.6, r); ctx.lineTo(lerp(-2 * r, 2 * r, sw) - r * 0.95, r); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = r * 0.09; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 0, r * 0.66, PI * 1.08, PI * 1.42); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.beginPath(); ctx.arc(Math.cos(PI * 1.55) * r * 0.66, Math.sin(PI * 1.55) * r * 0.66, r * 0.05, 0, TAU); ctx.fill();
    // bingkai
    ctx.lineWidth = r * 0.17; ctx.strokeStyle = rim; ctx.beginPath(); ctx.arc(0, 0, r * 0.92, 0, TAU); ctx.stroke();
    ctx.lineWidth = r * 0.06; ctx.strokeStyle = lite(rim, 0.45); ctx.beginPath(); ctx.arc(0, 0, r * 0.96, PI * 1.05, PI * 1.75); ctx.stroke();
    ctx.strokeStyle = dark(rim, 0.25); ctx.beginPath(); ctx.arc(0, 0, r * 0.88, PI * 0.1, PI * 0.8); ctx.stroke();
    ctx.restore();
  }
  // isi lensa dipanggil dalam ruang yang sudah di-translate ke tengah lensa; bungkus agar pemanggil menerima koordinat dunia
  const _kaca = kacaPembesar;
  function kacaPembesarW(ctx, x, y, size, opt = {}) {
    if (!opt.content) return _kaca(ctx, x, y, size, opt);
    const user = opt.content; return _kaca(ctx, x, y, size, { ...opt, content: (c, wx, wy, r) => { c.save(); c.translate(-wx, -wy); user(c, wx, wy, r); c.restore(); } });
  }

  function toples(ctx, x, y, size, opt = {}) {
    const h = size, w = size * 0.74, t = opt.t || 0, col = opt.color || P.pink, fill = opt.fill == null ? 0.7 : opt.fill;
    const tilt = opt.tilt || 0, neckW = w * 0.72, neckH = h * 0.08, bodyH = h - neckH - h * 0.1, lidH = h * 0.1;
    ctx.save(); ctx.translate(x, y);
    if (!tilt) shadow(ctx, 0, 0, w * 0.55, h * 0.05);
    ctx.rotate(tilt);
    const bodyP = () => rrp(ctx, -w / 2, -bodyH, w, bodyH, w * 0.18);
    // kaca belakang
    ctx.fillStyle = "rgba(205,228,255,0.22)"; ctx.beginPath(); bodyP(); ctx.fill();
    ctx.beginPath(); rrp(ctx, -neckW / 2, -bodyH - neckH, neckW, neckH + w * 0.1, w * 0.05); ctx.fill();
    // isi (permukaan tetap mendatar ketika toples miring)
    if (fill > 0.001) {
      ctx.save(); ctx.beginPath(); rrp(ctx, -w / 2 + w * 0.05, -bodyH + w * 0.05, w * 0.9, bodyH - w * 0.1, w * 0.14); ctx.clip();
      ctx.rotate(-tilt);
      const lev = lerp(0, bodyH * 0.92, fill) * Math.cos(tilt) - (tilt ? Math.sin(Math.abs(tilt)) * w * 0.1 : 0);
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-h * 1.5, h); ctx.lineTo(-h * 1.5, -lev);
      for (let i = 0; i <= 24; i++) { const xx = lerp(-h * 1.5, h * 1.5, i / 24); ctx.lineTo(xx, -lev + Math.sin(xx * 0.06 + t * 3) * h * 0.008); }
      ctx.lineTo(h * 1.5, h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = lite(col, 0.3); ctx.fillRect(-h * 1.5, -lev - h * 0.004, h * 3, h * 0.022);
      const r = D.rng(7 + (opt.seed || 0)); ctx.fillStyle = dark(col, 0.18);
      for (let i = 0; i < 16; i++) { const bx = (r() - 0.5) * w * 0.85, by = -r() * lev * 0.95; ctx.beginPath(); ctx.arc(bx, by, h * (0.012 + r() * 0.018), 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    // kaca depan: kilap
    ctx.save(); ctx.beginPath(); bodyP(); ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,0.32)"; ctx.beginPath(); rrp(ctx, -w * 0.38, -bodyH * 0.88, w * 0.09, bodyH * 0.7, w * 0.045); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); rrp(ctx, -w * 0.24, -bodyH * 0.88, w * 0.035, bodyH * 0.35, w * 0.02); ctx.fill();
    ctx.fillStyle = "rgba(30,36,100,0.16)"; ctx.beginPath(); ctx.ellipse(w * 0.5, -bodyH / 2, w * 0.14, bodyH * 0.6, 0, 0, TAU); ctx.fill();
    ctx.restore();
    // tutup
    if (opt.lid !== false) {
      const lc = opt.lidColor || "#7C66E0";
      solid(ctx, () => rrp(ctx, -neckW / 2 - w * 0.04, -h, neckW + w * 0.08, lidH, lidH * 0.35), lc, h * 0.012);
      ctx.fillStyle = dark(lc, 0.2); for (let i = 1; i < 7; i++) ctx.fillRect(-neckW / 2 - w * 0.04 + (neckW + w * 0.08) * i / 7 - h * 0.003, -h + lidH * 0.25, h * 0.006, lidH * 0.6);
    } else { ctx.fillStyle = "rgba(225,240,255,0.5)"; ctx.beginPath(); ctx.ellipse(0, -bodyH - neckH, neckW / 2 + w * 0.03, h * 0.022, 0, 0, TAU); ctx.fill(); }
    // label
    if (opt.label) {
      const fs = Math.max(40, Math.round(h * 0.13)); const lw = Math.max(w * 0.86, tw(ctx, opt.label, fs) + fs * 0.9), lh = fs * 1.55, ly = -bodyH * 0.5 - lh / 2;
      ctx.fillStyle = "rgba(20,24,70,0.18)"; ctx.beginPath(); rrp(ctx, -lw / 2 + 3, ly + 5, lw, lh, fs * 0.25); ctx.fill();
      ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); rrp(ctx, -lw / 2, ly, lw, lh, fs * 0.25); ctx.fill();
      ctx.fillStyle = opt.labelCol || col; ctx.fillRect(-lw / 2 + fs * 0.25, ly + lh - fs * 0.22, lw - fs * 0.5, fs * 0.09);
      say(ctx, opt.label, 0, ly + lh * 0.46, fs, INK, { w: 800 });
    }
    // aliran tuang (dari mulut toples, jatuh lurus ke bawah)
    ctx.restore();
    const lx0 = tilt > 0.05 ? neckW / 2 : tilt < -0.05 ? -neckW / 2 : 0, ly0 = -(bodyH + neckH);
    const mw = [x + Math.cos(tilt) * lx0 - Math.sin(tilt) * ly0, y + Math.sin(tilt) * lx0 + Math.cos(tilt) * ly0];
    const pour = opt.pour || 0;
    if (pour > 0 && fill > 0) {
      const L = Math.max(0, opt.pourTo != null ? opt.pourTo - mw[1] : (opt.pourLen || h)) * clamp(pour * 1.6), sw = h * 0.07 * Math.min(1, pour * 3);
      ctx.save(); ctx.fillStyle = col; ctx.beginPath();
      const x0 = mw[0], y0 = mw[1];
      ctx.moveTo(x0 - sw / 2, y0);
      for (let i = 0; i <= 10; i++) { const u = i / 10; ctx.lineTo(x0 - sw / 2 * (1 - u * 0.4) + Math.sin(u * 9 - t * 12) * sw * 0.12, y0 + u * L); }
      for (let i = 10; i >= 0; i--) { const u = i / 10; ctx.lineTo(x0 + sw / 2 * (1 - u * 0.4) + Math.sin(u * 9 - t * 12) * sw * 0.12, y0 + u * L); }
      ctx.fill();
      ctx.fillStyle = lite(col, 0.35); ctx.fillRect(x0 - sw * 0.2, y0, sw * 0.12, L * 0.9);
      for (let i = 0; i < 4; i++) { const u = (t * 2 + i / 4) % 1; ctx.beginPath(); ctx.arc(x0 + (i - 1.5) * sw * 0.4 * u, y0 + L + u * h * 0.03, sw * 0.18 * (1 - u), 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    return { mouth: mw, top: y - h };
  }

  // titik sasaran tanda seru dari uap (satuan: tinggi bentuk H, lebar relatif)
  const SERU_PTS = (() => { const pts = [], r = D.rng(31); for (let i = 0; i < 34; i++) { const u = i / 33, k = i % 3 - 1; pts.push([k * (0.07 - u * 0.035) + (r() - 0.5) * 0.015, -1 + 0.06 + u * 0.6, 0.085 - u * 0.03 + r() * 0.012]); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; pts.push([Math.cos(a) * 0.05, -0.13 + Math.sin(a) * 0.05, 0.055]); } pts.push([0, -0.13, 0.075]); return pts; })();
  function panci(ctx, x, y, size, opt = {}) {
    const w = size, t = opt.t || 0, col = opt.color || "#EE5560", hb = w * 0.46, top = y - hb;
    ctx.save();
    // api kompor
    const fire = opt.fire || 0;
    if (fire > 0) for (let i = 0; i < 7; i++) { const fx = x + (i - 3) * w * 0.11, fl = w * (0.06 + 0.04 * Math.sin(t * 13 + i * 2.1)) * fire;
      ctx.fillStyle = A_("#5AA9FF", 0.9); ctx.beginPath(); ctx.ellipse(fx, y + w * 0.02 - fl / 2, w * 0.03, fl, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = A_("#BFE3FF", 0.9); ctx.beginPath(); ctx.ellipse(fx, y + w * 0.02 - fl * 0.3, w * 0.012, fl * 0.5, 0, 0, TAU); ctx.fill(); }
    shadow(ctx, x, y, w * 0.55, w * 0.05);
    // pegangan samping
    for (const k of [-1, 1]) { ctx.fillStyle = dark(col, 0.35); ctx.beginPath(); rrp(ctx, x + k * w * 0.5 - (k > 0 ? 0 : w * 0.16), top + hb * 0.12, w * 0.16, hb * 0.16, hb * 0.08); ctx.fill(); }
    // badan
    solid(ctx, () => { ctx.moveTo(x - w / 2, top); ctx.lineTo(x + w / 2, top); ctx.lineTo(x + w * 0.47, y - w * 0.1); ctx.quadraticCurveTo(x + w * 0.46, y, x + w * 0.36, y); ctx.lineTo(x - w * 0.36, y); ctx.quadraticCurveTo(x - w * 0.46, y, x - w * 0.47, y - w * 0.1); ctx.closePath(); }, col, w * 0.03, 0.25, 0.22);
    ctx.fillStyle = dark(col, 0.12); ctx.fillRect(x - w * 0.485, top + hb * 0.55, w * 0.97, hb * 0.07);
    ctx.fillStyle = "rgba(255,255,255,0.28)"; ctx.beginPath(); rrp(ctx, x - w * 0.38, top + hb * 0.18, w * 0.05, hb * 0.3, w * 0.025); ctx.fill();
    // bibir dan isi
    ctx.fillStyle = lite(col, 0.25); ctx.beginPath(); ctx.ellipse(x, top, w * 0.52, w * 0.075, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = dark(col, 0.45); ctx.beginPath(); ctx.ellipse(x, top + w * 0.004, w * 0.47, w * 0.058, 0, 0, TAU); ctx.fill();
    const liq = opt.liquid || "#FFB547";
    ctx.save(); ctx.beginPath(); ctx.ellipse(x, top + w * 0.004, w * 0.47, w * 0.058, 0, 0, TAU); ctx.clip();
    ctx.fillStyle = liq; ctx.beginPath(); ctx.ellipse(x, top + w * 0.024, w * 0.45, w * 0.05, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = lite(liq, 0.4); for (let i = 0; i < 6; i++) { const u = (t * 1.3 + i * 0.37) % 1; ctx.globalAlpha = Math.sin(PI * u); ctx.beginPath(); ctx.arc(x + (i - 2.5) * w * 0.13, top + w * 0.025, w * 0.018 * (0.5 + u), 0, TAU); ctx.fill(); }
    ctx.restore();
    // uap
    const steam = opt.steam == null ? 1 : opt.steam, form = opt.steamShape === "!" ? eio(opt.form == null ? 1 : opt.form) : 0;
    if (steam > 0) {
      const HH = opt.steamH || w * 1.05, sc = opt.steamCol || "#F4F1FF";
      if (form > 0.05) D.glow(ctx, x, top - HH * 0.55, HH * 0.6, opt.glowCol || P.pink, 0.45 * form * steam);
      const N = SERU_PTS.length;
      for (let i = 0; i < N; i++) {
        const u = (t * 0.32 + i / N * 1.618) % 1, sx = x + Math.sin(u * 6 + i * 1.7 + t * 0.8) * w * 0.12 * u + (((i * 37) % 9) - 4) * w * 0.02,
          sy = top - w * 0.02 - u * HH, sr = w * (0.035 + 0.075 * u), sa = Math.sin(PI * Math.min(1, u * 1.15)) * 0.75;
        const [px, py, pr] = SERU_PTS[i], tx = x + px * HH + Math.sin(t * 2 + i) * w * 0.006, ty = top - HH * 0.1 + py * HH * 0.9 + Math.cos(t * 1.7 + i) * w * 0.006;
        const cx = lerp(sx, tx, form), cy = lerp(sy, ty, form), r = lerp(sr, pr * HH, form), a = lerp(sa, 0.96, form) * steam;
        ctx.globalAlpha = a; ctx.fillStyle = sc; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (form > 0.5) { ctx.globalAlpha = (form - 0.5) * 2 * steam * 0.5; ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); rrp(ctx, x - HH * 0.045, top - HH * 0.98, HH * 0.03, HH * 0.4, HH * 0.015); ctx.fill(); ctx.globalAlpha = 1; }
    }
    ctx.restore();
    return { mouth: [x, top], w };
  }

  const MAP_COLS = ["#FFB547", "#3FD8C8", "#FF6F91", "#5AA9FF", "#9584FF", "#5BD68A", "#FFD38A"];
  function mapBerkas(ctx, x, y, size, opt = {}) {
    const fw = size, th = fw * 0.13, n = Math.max(0, Math.floor(opt.n == null ? 6 : opt.n)), t = opt.t || 0;
    const ng = opt.grey === true ? n : Math.min(n, opt.grey || 0), r = D.rng(11 + (opt.seed || 0));
    const jit = []; for (let i = 0; i < Math.max(n, 1); i++) jit.push([(r() - 0.5) * fw * 0.08, (r() - 0.5) * 0.05, r()]);
    ctx.save(); shadow(ctx, x, y, fw * 0.62, fw * 0.06);
    const drop = opt.drop == null ? 1 : opt.drop;
    for (let i = 0; i < n; i++) {
      const grey = i >= n - ng, c = grey ? "#98A0C2" : MAP_COLS[(i + (opt.seed || 0)) % MAP_COLS.length];
      let yy = y - i * th * 0.94, xx = x + jit[i][0], rot = jit[i][1];
      if (i === n - 1 && drop < 1) { const u = clamp(drop); yy -= (1 - eout(u)) * fw * 0.9; rot += (1 - u) * 0.25; ctx.globalAlpha = clamp(u * 4); }
      ctx.save(); ctx.translate(xx, yy); ctx.rotate(rot);
      // kertas yang menyembul
      ctx.fillStyle = "#F4F1E8"; ctx.fillRect(-fw * 0.44, -th * 1.02, fw * 0.86, th * 0.4);
      ctx.fillStyle = "#DCD6C6"; ctx.fillRect(-fw * 0.44, -th * 0.7, fw * 0.86, th * 0.08);
      // tab
      const tx = (jit[i][2] > 0.5 ? 0.12 : -0.42) * fw;
      ctx.fillStyle = dark(c, 0.12); ctx.beginPath(); rrp(ctx, tx, -th * 1.25, fw * 0.28, th * 0.6, th * 0.2); ctx.fill();
      // badan map
      solid(ctx, () => rrp(ctx, -fw / 2, -th * 0.92, fw, th * 0.92, th * 0.22), c, th * 0.12, 0.3, 0.22);
      ctx.fillStyle = dark(c, 0.18); ctx.fillRect(-fw * 0.12, -th * 0.6, fw * 0.24, th * 0.12);
      ctx.restore(); ctx.globalAlpha = 1;
    }
    const topY = y - n * th * 0.94;
    if (ng > 0 && opt.greyLabel !== false) {
      const side = opt.labelSide === -1 ? -1 : 1, y0 = topY - th * 0.2, y1 = y - (n - ng) * th * 0.94, bx = x + side * fw * 0.62;
      ctx.strokeStyle = A_("#DDE3FF", 0.9); ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(bx - side * 14, y0); ctx.lineTo(bx, y0); ctx.lineTo(bx, y1); ctx.lineTo(bx - side * 14, y1); ctx.moveTo(bx, (y0 + y1) / 2); ctx.lineTo(bx + side * 16, (y0 + y1) / 2); ctx.stroke();
      const s = opt.greyLabel || "tidak dilaporkan", fs = Math.max(40, opt.labelSize || 40), lw = tw(ctx, s, fs, 800) + fs * 1.0, lh = fs * 1.6;
      const lx = side > 0 ? bx + 20 : bx - 20 - lw, ly = (y0 + y1) / 2 - lh / 2;
      ctx.fillStyle = "#6F78A0"; ctx.beginPath(); rrp(ctx, lx, ly, lw, lh, lh / 2); ctx.fill();
      say(ctx, s, lx + lw / 2, ly + lh * 0.52, fs, "#FFFFFF");
    }
    ctx.restore();
    return { top: [x, topY - th], h: n * th * 0.94 };
  }

  function gembok(ctx, x, y, size, opt = {}) {
    const l = clamp(opt.locked == null ? 1 : opt.locked), h = size, bw = h * 0.74, bh = h * 0.56, col = opt.color || P.amber, t = opt.t || 0;
    const bTop = y - bh / 2, sr = bw * 0.3, sw = h * 0.1, lift = (1 - eio(l)) * h * 0.24;
    const thump = l > 0.88 && l < 1 ? Math.sin(PI * (l - 0.88) / 0.12) : 0;
    ctx.save(); ctx.translate(x, y);
    shadow(ctx, 0, bh / 2 + h * 0.02, bw * 0.55, h * 0.04);
    if (opt.flash) D.glow(ctx, 0, 0, h * 0.95, P.teal, opt.flash * 0.6);
    // gagang (shackle)
    const sy = -bh / 2 - lift + h * 0.02, open = (1 - l) * 0.35;
    ctx.save(); ctx.translate(sr, sy); ctx.rotate(-open); ctx.translate(-sr, -sy);
    ctx.lineCap = "butt"; ctx.lineWidth = sw; ctx.strokeStyle = "#B9C2DE";
    ctx.beginPath(); ctx.moveTo(-sr, sy + h * 0.14 - (1 - l) * h * 0.05); ctx.lineTo(-sr, sy - h * 0.12); ctx.arc(0, sy - h * 0.12, sr, PI, 0); ctx.lineTo(sr, sy + h * 0.16); ctx.stroke();
    ctx.lineWidth = sw * 0.32; ctx.strokeStyle = "#E7ECFA"; ctx.beginPath(); ctx.arc(0, sy - h * 0.12, sr + sw * 0.18, PI * 1.1, PI * 1.75); ctx.stroke();
    ctx.restore();
    // badan
    ctx.save(); ctx.scale(1 + thump * 0.04, 1 - thump * 0.05);
    solid(ctx, () => rrp(ctx, -bw / 2, -bh / 2, bw, bh, bh * 0.22), col, h * 0.03, 0.32, 0.22);
    ctx.fillStyle = dark(col, 0.12); ctx.fillRect(-bw / 2 + bh * 0.1, bh * 0.18, bw - bh * 0.2, bh * 0.06);
    // lubang kunci / centang
    ctx.fillStyle = dark(col, 0.6); ctx.beginPath(); ctx.arc(0, -bh * 0.08, bh * 0.12, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-bh * 0.06, -bh * 0.04); ctx.lineTo(bh * 0.06, -bh * 0.04); ctx.lineTo(bh * 0.085, bh * 0.2); ctx.lineTo(-bh * 0.085, bh * 0.2); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (opt.flash) { ctx.strokeStyle = A_("#FFFFFF", opt.flash); ctx.lineWidth = h * 0.025; ctx.lineCap = "round"; for (let i = 0; i < 6; i++) { const a = -PI / 2 + (i - 2.5) * 0.45, r0 = h * 0.6, r1 = h * (0.6 + 0.14 * opt.flash); ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0 - h * 0.05); ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1 - h * 0.05); ctx.stroke(); } }
    ctx.restore();
  }

  function kertasLipat(ctx, x, y, size, opt = {}) {
    const w = size, h = w * 0.68, fold = clamp(opt.fold || 0), f1 = eio(clamp(fold * 2)), f2 = eio(clamp(fold * 2 - 1)), t = opt.t || 0;
    const FR = "#FFF8EA", BK = "#E9DEC4", word = opt.word || "", fs = Math.max(44, Math.round(opt.textSize || w * 0.2)), write = opt.write == null ? 1 : clamp(opt.write);
    // posisi huruf (tulisan tangan) — dihitung sekali per kata
    const r = D.rng([...word].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0);
    font(ctx, fs, 700, "italic "); const ws = ctx.measureText(word).width;
    const letters = []; let cx = -ws / 2; for (const ch of word) { const cw = ctx.measureText(ch).width; letters.push([ch, cx + cw / 2, (r() - 0.5) * fs * 0.16, (r() - 0.5) * 0.3, 0.9 + r() * 0.2]); cx += cw * (0.96 + r() * 0.06); }
    const wy = -h * 0.17;
    const face = () => {
      ctx.fillStyle = FR; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(90,169,255,0.28)"; for (let i = 1; i < 6; i++) ctx.fillRect(-w / 2, -h / 2 + h * i / 6, w, Math.max(1.5, h * 0.008));
      ctx.fillStyle = "rgba(255,111,145,0.45)"; ctx.fillRect(-w / 2 + w * 0.1, -h / 2, Math.max(2, w * 0.008), h);
      const nShow = write * letters.length;
      font(ctx, fs, 700, "italic "); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      letters.forEach(([ch, lx, dy, rot, sc], i) => { const a = clamp(nShow - i); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(lx, wy + dy); ctx.rotate(rot - 0.05); ctx.scale(sc, sc); ctx.fillStyle = "#2B3A9A"; ctx.fillText(ch, 0, 0); ctx.restore(); });
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      if (write >= 1 && word) { ctx.strokeStyle = "rgba(43,58,154,0.75)"; ctx.lineWidth = Math.max(3, fs * 0.07); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-ws / 2, wy + fs * 0.62); ctx.quadraticCurveTo(0, wy + fs * 0.5, ws / 2 + fs * 0.1, wy + fs * 0.66); ctx.stroke(); }
    };
    ctx.save(); ctx.translate(x - w / 4 * f2, y - h / 4 * f1);
    const pw = w * (1 - 0.5 * f2), phh = h * (1 - 0.5 * f1);
    ctx.save(); ctx.translate(w / 4 * f2, h / 4 * f1); shadow(ctx, 0, phh / 2 + h * 0.05, pw * 0.55, h * 0.05, 0.2); ctx.restore();
    if (f1 < 1) {
      ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, 0, w, h / 2); ctx.clip(); face(); ctx.fillStyle = `rgba(30,30,80,${0.16 * Math.sin(PI * f1)})`; ctx.fillRect(-w / 2, 0, w, h / 2); ctx.restore();
      const c = Math.cos(PI * f1);
      if (Math.abs(c) > 0.01) { ctx.save(); ctx.transform(1, 0, 0, c, 0, 0); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h / 2); ctx.clip();
        if (c > 0) { face(); ctx.fillStyle = `rgba(30,30,80,${0.25 * (1 - c)})`; ctx.fillRect(-w / 2, -h / 2, w, h / 2); } else { ctx.fillStyle = BK; ctx.fillRect(-w / 2, -h / 2, w, h / 2); ctx.fillStyle = `rgba(255,255,255,${0.2 * -c})`; ctx.fillRect(-w / 2, -h / 2, w, h * 0.06); }
        ctx.restore(); }
    } else {
      ctx.fillStyle = BK; ctx.fillRect(0, 0, w / 2, h / 2);
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(0, 0, w / 2, h * 0.03);
      const c2 = Math.cos(PI * f2);
      if (Math.abs(c2) > 0.01) { ctx.save(); ctx.transform(c2, 0, 0, 1, 0, 0); ctx.fillStyle = c2 > 0 ? BK : mix(BK, "#FFF8EA", 0.4); ctx.fillRect(-w / 2, 0, w / 2, h / 2); ctx.fillStyle = `rgba(30,30,80,${0.2 * (1 - Math.abs(c2))})`; ctx.fillRect(-w / 2, 0, w / 2, h / 2); ctx.restore(); }
      ctx.fillStyle = "rgba(60,50,30,0.12)"; ctx.fillRect(0, 0, Math.max(2, w * 0.006), h / 2);
    }
    // pensil di ujung tulisan
    if (opt.pencil && write < 1 && f1 === 0) {
      const i = Math.min(letters.length - 1, Math.floor(write * letters.length)), L = letters[i] || ["", 0, 0, 0];
      const px = L[1] + fs * 0.2 + Math.sin(t * 18) * fs * 0.08, py = wy + fs * 0.25 + Math.cos(t * 23) * fs * 0.05;
      ctx.save(); ctx.translate(px, py); ctx.rotate(-0.75);
      ctx.fillStyle = "#FFD38A"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(fs * 0.22, -fs * 0.12); ctx.lineTo(fs * 0.22, fs * 0.12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#2B3A9A"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(fs * 0.08, -fs * 0.045); ctx.lineTo(fs * 0.08, fs * 0.045); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#FFB547"; ctx.fillRect(fs * 0.22, -fs * 0.12, fs * 1.1, fs * 0.24); ctx.fillStyle = "#E89A2E"; ctx.fillRect(fs * 0.22, fs * 0.04, fs * 1.1, fs * 0.08);
      ctx.fillStyle = "#C9D0E6"; ctx.fillRect(fs * 1.32, -fs * 0.12, fs * 0.14, fs * 0.24); ctx.fillStyle = "#FF6F91"; ctx.beginPath(); rrp(ctx, fs * 1.46, -fs * 0.12, fs * 0.2, fs * 0.24, fs * 0.08); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  const fmt1 = v => (Math.round(v * 10) / 10).toFixed(1).replace(".", ",");
  function stopwatch(ctx, x, y, size, opt = {}) {
    const R = size / 2, t = opt.t || 0, range = opt.range || 5, sec = Math.max(0, opt.seconds == null ? (opt.run ? t % range : 0) : opt.seconds), run = !!opt.run;
    const ring = opt.color || P.teal, a = -PI / 2 + (sec / range) * TAU;
    ctx.save(); ctx.translate(x, y);
    shadow(ctx, 0, R * 1.12, R * 0.8, R * 0.08);
    // tombol atas dan samping
    const pd = run ? R * 0.05 * (0.5 + 0.5 * Math.sin(t * 6)) : 0;
    ctx.fillStyle = dark(ring, 0.2); ctx.beginPath(); rrp(ctx, -R * 0.1, -R * 1.2 + pd, R * 0.2, R * 0.2, R * 0.04); ctx.fill();
    ctx.fillStyle = ring; ctx.beginPath(); rrp(ctx, -R * 0.24, -R * 1.34 + pd, R * 0.48, R * 0.16, R * 0.08); ctx.fill();
    ctx.save(); ctx.rotate(PI / 4); ctx.fillStyle = dark(ring, 0.2); ctx.beginPath(); rrp(ctx, -R * 0.08, -R * 1.18, R * 0.16, R * 0.2, R * 0.05); ctx.fill(); ctx.restore();
    // cincin dan muka
    solid(ctx, () => ctx.arc(0, 0, R * 1.04, 0, TAU), ring, R * 0.06, 0.3, 0.2);
    ctx.fillStyle = "#F7F3EA"; ctx.beginPath(); ctx.arc(0, 0, R * 0.86, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(40,40,110,0.08)"; ctx.beginPath(); ctx.arc(0, 0, R * 0.86, 0, TAU); ctx.arc(R * 0.04, R * 0.05, R * 0.84, 0, TAU, true); ctx.fill();
    // sektor waktu berjalan
    if (sec > 0) { ctx.fillStyle = A_(opt.sweep || P.pink, 0.3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R * 0.78, -PI / 2, a); ctx.closePath(); ctx.fill(); }
    // garis skala
    for (let i = 0; i < range * 5; i++) { const aa = -PI / 2 + i / (range * 5) * TAU, major = i % 5 === 0; const r0 = R * (major ? 0.66 : 0.72), r1 = R * 0.8;
      ctx.strokeStyle = major ? "#2A2F6A" : "#9AA2C8"; ctx.lineWidth = major ? R * 0.045 : R * 0.02; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(Math.cos(aa) * r0, Math.sin(aa) * r0); ctx.lineTo(Math.cos(aa) * r1, Math.sin(aa) * r1); ctx.stroke(); }
    for (let i = 0; i < range; i++) { const aa = -PI / 2 + i / range * TAU; say(ctx, String(i), Math.cos(aa) * R * 0.5, Math.sin(aa) * R * 0.5, Math.round(R * 0.17), "#4A527E", { w: 800 }); }
    // jarum
    ctx.save(); ctx.rotate(a + PI / 2);
    ctx.fillStyle = opt.hand || "#FF5A5F"; ctx.beginPath(); ctx.moveTo(-R * 0.035, R * 0.16); ctx.lineTo(-R * 0.014, -R * 0.78); ctx.lineTo(R * 0.014, -R * 0.78); ctx.lineTo(R * 0.035, R * 0.16); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#2A2F6A"; ctx.beginPath(); ctx.arc(0, 0, R * 0.09, 0, TAU); ctx.fill(); ctx.fillStyle = "#FF5A5F"; ctx.beginPath(); ctx.arc(0, 0, R * 0.04, 0, TAU); ctx.fill();
    // kilap kaca
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = R * 0.05; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 0, R * 0.7, PI * 1.12, PI * 1.38); ctx.stroke();
    if (run) { ctx.fillStyle = A_("#FF5A5F", 0.5 + 0.5 * Math.sin(t * 8)); ctx.beginPath(); ctx.arc(R * 0.86, -R * 0.86, R * 0.07, 0, TAU); ctx.fill(); }
    // angka digital
    if (opt.readout !== false) { const fs = Math.max(44, Math.round(R * 0.36)), s = `${fmt1(sec)} ${opt.unit || "detik"}`, lw = tw(ctx, s, fs, 900) + fs * 1.0, lh = fs * 1.5, ly = R * 1.2;
      ctx.fillStyle = "rgba(16,24,66,0.88)"; ctx.beginPath(); rrp(ctx, -lw / 2, ly, lw, lh, lh / 2); ctx.fill();
      say(ctx, s, 0, ly + lh * 0.53, fs, "#FFFFFF", { w: 900 }); }
    ctx.restore();
  }

  const lerpCol = (u) => u < 0.5 ? mix(P.teal, P.amber, u * 2) : mix(P.amber, P.pink, (u - 0.5) * 2);
  function meteran(ctx, x, y, size, opt = {}) {
    const w = size, t = opt.t || 0, v = clamp((opt.value || 0) / 100), R = w * 0.36, sw = w * 0.075;
    const ns = Math.max(64, Math.round(w * 0.2)), ls = Math.max(40, Math.round(w * 0.09)), label = opt.label == null ? "kemiripan" : opt.label;
    const padT = w * 0.07, ph = padT + R + sw / 2 + ns * 1.15 + (label ? ls * 1.35 : 0) + w * 0.05;
    const top = y - ph / 2, py = top + padT + R + sw / 2;
    ctx.save();
    shadow(ctx, x, top + ph + w * 0.03, w * 0.45, w * 0.035);
    solid(ctx, () => rrp(ctx, x - w / 2, top, w, ph, w * 0.08), opt.panel || "#2A3B86", w * 0.015, 0.14, 0.25);
    // jalur
    ctx.lineCap = "round"; ctx.lineWidth = sw; ctx.strokeStyle = "rgba(10,16,52,0.45)"; ctx.beginPath(); ctx.arc(x, py, R, PI, TAU); ctx.stroke();
    const N = 48; ctx.lineCap = "butt";
    for (let i = 0; i < N; i++) { const u0 = i / N, u1 = (i + 1.06) / N; ctx.strokeStyle = u0 < v ? lerpCol(u0) : A_(lerpCol(u0), 0.22); ctx.beginPath(); ctx.arc(x, py, R, PI + u0 * PI, PI + Math.min(1, u1) * PI); ctx.stroke(); }
    ctx.lineCap = "round"; ctx.fillStyle = lerpCol(0); ctx.beginPath(); ctx.arc(x - R, py, sw / 2, 0, TAU); ctx.fill();
    // skala
    ctx.strokeStyle = "rgba(242,246,255,0.55)"; ctx.lineWidth = Math.max(2, w * 0.007);
    for (let i = 0; i <= 10; i++) { const a = PI + i / 10 * PI, r0 = R - sw / 2 - w * (i % 5 ? 0.02 : 0.04), r1 = R - sw / 2 - w * 0.005; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, py + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, py + Math.sin(a) * r1); ctx.stroke(); }
    // jarum (sedikit bergetar)
    const va = PI + clamp(v + Math.sin(t * 9) * 0.004 + Math.sin(t * 2.3) * 0.003) * PI;
    if (v > 0.01) D.glow(ctx, x + Math.cos(va) * R, py + Math.sin(va) * R, sw * 1.6, lerpCol(v), 0.6);
    ctx.save(); ctx.translate(x, py); ctx.rotate(va);
    ctx.fillStyle = "#F2F6FF"; ctx.beginPath(); ctx.moveTo(0, -w * 0.022); ctx.lineTo(R * 0.92, -w * 0.005); ctx.lineTo(R * 0.92, w * 0.005); ctx.lineTo(0, w * 0.022); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#F2F6FF"; ctx.beginPath(); ctx.arc(x, py, w * 0.04, 0, TAU); ctx.fill(); ctx.fillStyle = dark("#2A3B86", 0.3); ctx.beginPath(); ctx.arc(x, py, w * 0.016, 0, TAU); ctx.fill();
    // angka
    say(ctx, `${Math.round(v * 100)}%`, x, py + ns * 0.72, ns, opt.numColor || lerpCol(v), { w: 900 });
    if (label) say(ctx, label, x, py + ns * 1.15 + ls * 0.7, ls, "#C9D3F2", { w: 700 });
    ctx.restore();
    return { top, bottom: top + ph };
  }

  function flagShape(ctx, x0, y0, fw, fh, t, raise = 1) {
    const N = 14, pts = [];
    for (let i = 0; i <= N; i++) { const u = i / N, wv = Math.sin(u * 5.5 - t * 5) * fh * 0.12 * u; pts.push([x0 + u * fw * (1 - 0.06 * Math.abs(Math.sin(t * 2))), y0 + wv, wv]); }
    for (let i = 0; i < N; i++) {
      const [ax, ay, aw] = pts[i], [bx, by, bw2] = pts[i + 1], sl = (bw2 - aw) / (fh * 0.12);
      ctx.fillStyle = sl > 0 ? mix("#FF5A5F", "#B8264A", clamp(sl * 1.5) * 0.6) : mix("#FF5A5F", "#FF9A9E", clamp(-sl * 1.5) * 0.5);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx + 0.6, by); ctx.lineTo(bx + 0.6, by + fh); ctx.lineTo(ax, ay + fh); ctx.closePath(); ctx.fill();
    }
  }
  function benderaMerah(ctx, x, y, size, opt = {}) {
    const t = opt.t || 0;
    ctx.save();
    if (opt.icon) {
      const r = size / 2; ctx.fillStyle = opt.bg || "#FFE3E6"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,90,95,0.18)"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.arc(x - r * 0.06, y - r * 0.08, r * 0.92, 0, TAU, true); ctx.fill();
      const ph = r * 1.25, px = x - r * 0.32, py = y + ph / 2;
      ctx.fillStyle = "#59608C"; ctx.beginPath(); rrp(ctx, px - r * 0.06, py - ph, r * 0.12, ph, r * 0.06); ctx.fill();
      flagShape(ctx, px + r * 0.04, py - ph + r * 0.04, r * 0.78, r * 0.52, t);
      ctx.restore(); return;
    }
    const h = size, raise = opt.raise == null ? 1 : eio(opt.raise), pw = h * 0.045, fw = h * 0.6, fh = h * 0.38;
    shadow(ctx, x, y, h * 0.16, h * 0.03);
    ctx.fillStyle = "#59608C"; ctx.beginPath(); rrp(ctx, x - h * 0.1, y - h * 0.04, h * 0.2, h * 0.05, h * 0.02); ctx.fill();
    ctx.fillStyle = "#C9D0EC"; ctx.beginPath(); rrp(ctx, x - pw / 2, y - h, pw, h, pw / 2); ctx.fill();
    ctx.fillStyle = "#EEF1FB"; ctx.fillRect(x - pw * 0.25, y - h * 0.98, pw * 0.2, h * 0.94);
    ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(x, y - h - pw * 0.4, pw * 0.9, 0, TAU); ctx.fill();
    const fy = lerp(y - fh - h * 0.08, y - h + h * 0.04, raise);
    flagShape(ctx, x + pw / 2, fy, fw, fh, t);
    ctx.restore();
  }

  // ---------- ikon vektor untuk daftar periksa ----------
  const IKON = ["hpBaru", "rekening", "larangan", "teleponBalik", "putus", "tanya", "gembok", "uang"];
  const IKON_COL = { hpBaru: "#5AA9FF", rekening: "#9584FF", larangan: "#FF6F91", teleponBalik: "#3FD8C8", putus: "#FF5A5F", tanya: "#FFB547", gembok: "#3FD8C8", uang: "#5BD68A" };
  function handset(ctx, r, col) {
    ctx.save(); ctx.fillStyle = col; ctx.rotate(-0.75);
    ctx.beginPath(); rrp(ctx, -r * 0.12, -r * 0.55, r * 0.24, r * 1.1, r * 0.12); ctx.fill();
    ctx.beginPath(); rrp(ctx, -r * 0.2, -r * 0.62, r * 0.42, r * 0.3, r * 0.12); ctx.fill();
    ctx.beginPath(); rrp(ctx, -r * 0.2, r * 0.32, r * 0.42, r * 0.3, r * 0.12); ctx.fill();
    ctx.restore();
  }
  function ikon(ctx, name, cx, cy, r, opt = {}) {
    const col = opt.color || IKON_COL[name] || P.blue, W_ = "#FFFFFF", t = opt.t || 0;
    ctx.save(); ctx.translate(cx, cy);
    if (opt.bg !== false) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.arc(0, 0, r, PI * 1.05, PI * 1.95); ctx.arc(r * 0.06, r * 0.1, r * 0.92, PI * 1.95, PI * 1.05, true); ctx.fill(); }
    const ir = r * 0.62; ctx.fillStyle = W_; ctx.strokeStyle = W_; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (name === "hpBaru") {
      ctx.beginPath(); rrp(ctx, -ir * 0.45, -ir * 0.78, ir * 0.9, ir * 1.56, ir * 0.16); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); rrp(ctx, -ir * 0.34, -ir * 0.62, ir * 0.68, ir * 1.12, ir * 0.06); ctx.fill();
      ctx.fillStyle = W_; ctx.beginPath(); ctx.arc(0, ir * 0.62, ir * 0.07, 0, TAU); ctx.fill();
      // bintang "baru"
      ctx.save(); ctx.translate(ir * 0.55, -ir * 0.6); ctx.rotate(t * 0.8); ctx.fillStyle = P.warm; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * PI / 4, rr2 = i % 2 ? ir * 0.14 : ir * 0.36; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fill(); ctx.restore();
    } else if (name === "rekening") {
      ctx.beginPath(); ctx.moveTo(-ir * 0.85, -ir * 0.3); ctx.lineTo(0, -ir * 0.85); ctx.lineTo(ir * 0.85, -ir * 0.3); ctx.closePath(); ctx.fill();
      for (let i = -1; i <= 1; i++) ctx.fillRect(i * ir * 0.5 - ir * 0.11, -ir * 0.2, ir * 0.22, ir * 0.72);
      ctx.fillRect(-ir * 0.85, ir * 0.58, ir * 1.7, ir * 0.2);
    } else if (name === "larangan") {
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * ir * 0.4, -ir * 0.25, ir * 0.24, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(k * ir * 0.4, ir * 0.42, ir * 0.36, ir * 0.3, 0, PI, TAU); ctx.fill(); }
      ctx.lineWidth = ir * 0.18; ctx.strokeStyle = "#FFE0E6"; ctx.beginPath(); ctx.arc(0, 0, ir * 0.95, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-ir * 0.67, -ir * 0.67); ctx.lineTo(ir * 0.67, ir * 0.67); ctx.stroke();
    } else if (name === "teleponBalik") {
      ctx.save(); ctx.translate(-ir * 0.08, ir * 0.08); handset(ctx, ir * 0.85, W_); ctx.restore();
      ctx.lineWidth = ir * 0.15; ctx.beginPath(); ctx.arc(ir * 0.18, -ir * 0.2, ir * 0.62, -PI * 0.95, -PI * 0.05); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ir * 0.8, -ir * 0.48); ctx.lineTo(ir * 0.8, -ir * 0.12); ctx.lineTo(ir * 0.48, -ir * 0.2); ctx.closePath(); ctx.fill();
    } else if (name === "putus") {
      ctx.save(); ctx.rotate(0.75 + PI / 2); handset(ctx, ir * 0.85, W_); ctx.restore();
      ctx.lineWidth = ir * 0.16; ctx.beginPath(); ctx.moveTo(ir * 0.35, -ir * 0.85); ctx.lineTo(ir * 0.85, -ir * 0.35); ctx.moveTo(ir * 0.85, -ir * 0.85); ctx.lineTo(ir * 0.35, -ir * 0.35); ctx.stroke();
    } else if (name === "tanya") {
      ctx.beginPath(); rrp(ctx, -ir * 0.85, -ir * 0.72, ir * 1.7, ir * 1.2, ir * 0.35); ctx.fill(); ctx.beginPath(); ctx.moveTo(-ir * 0.4, ir * 0.4); ctx.lineTo(-ir * 0.55, ir * 0.85); ctx.lineTo(-ir * 0.05, ir * 0.45); ctx.fill();
      say(ctx, "?", 0, -ir * 0.1, Math.round(ir * 1.1), col, { w: 900 });
    } else if (name === "gembok") {
      ctx.lineWidth = ir * 0.18; ctx.beginPath(); ctx.arc(0, -ir * 0.2, ir * 0.36, PI, 0); ctx.lineTo(ir * 0.36, 0); ctx.moveTo(-ir * 0.36, 0); ctx.lineTo(-ir * 0.36, -ir * 0.2); ctx.stroke();
      ctx.beginPath(); rrp(ctx, -ir * 0.62, -ir * 0.08, ir * 1.24, ir * 0.9, ir * 0.18); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, ir * 0.3, ir * 0.12, 0, TAU); ctx.fill(); ctx.fillRect(-ir * 0.05, ir * 0.3, ir * 0.1, ir * 0.24);
    } else if (name === "uang") {
      ctx.save(); ctx.rotate(-0.15); ctx.beginPath(); rrp(ctx, -ir * 0.9, -ir * 0.5, ir * 1.8, ir * 1.0, ir * 0.14); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, ir * 0.28, 0, TAU); ctx.fill(); ctx.fillRect(-ir * 0.75, -ir * 0.36, ir * 0.16, ir * 0.16); ctx.fillRect(ir * 0.59, ir * 0.2, ir * 0.16, ir * 0.16); ctx.restore();
    }
    ctx.restore();
  }

  function check(ctx, cx, cy, r, col = P.green, a = 1) {
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * 0.24; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(cx - r * 0.45, cy + r * 0.02); ctx.lineTo(cx - r * 0.12, cy + r * 0.35); ctx.lineTo(cx + r * 0.48, cy - r * 0.32); ctx.stroke(); ctx.restore();
  }
  function wrapLines(ctx, s, size, maxW) { font(ctx, size, 700); const words = s.split(/\s+/), lines = []; let cur = "";
    for (const w of words) { const n = cur ? cur + " " + w : w; if (ctx.measureText(n).width > maxW && cur) { lines.push(cur); cur = w; } else cur = n; } if (cur) lines.push(cur); return lines; }
  function daftarPeriksa(ctx, x, y, size, opt = {}) {
    const w = size, t = opt.t || 0, u = opt.u == null ? 1 : clamp(opt.u), su = opt.su == null ? 1 : clamp(opt.su), state = opt.state || "none";
    const fs = Math.max(44, opt.textSize || 46), baseH = Math.max(opt.h || 0, fs * 2.3), ir = baseH * 0.36, sr = baseH * 0.3;
    const textX = baseH * 0.2 + ir * 2 + fs * 0.45, maxW = w - textX - sr * 2 - fs * 0.7, lines = wrapLines(ctx, opt.text || "", fs, maxW);
    const h = Math.max(baseH, lines.length * fs * 1.22 + fs * 0.9);
    if (u <= 0) return h;
    ctx.save(); ctx.globalAlpha *= eout(u); ctx.translate((1 - eout(u)) * -w * 0.08, 0);
    const flag = state === "flag" && su > 0;
    ctx.fillStyle = "rgba(16,20,64,0.22)"; ctx.beginPath(); rrp(ctx, x + 4, y + 8, w, h, h * 0.22); ctx.fill();
    solid(ctx, () => rrp(ctx, x, y, w, h, h * 0.22), opt.fill || "#2E4190", 4, 0.12, 0.2);
    if (flag) { ctx.fillStyle = A_(P.red, 0.16 * su); ctx.beginPath(); rrp(ctx, x, y, w, h, h * 0.22); ctx.fill(); ctx.fillStyle = A_(P.red, su); ctx.beginPath(); rrp(ctx, x, y + h * 0.18, h * 0.07, h * 0.64, h * 0.035); ctx.fill(); }
    if (state === "check" && su > 0) { ctx.fillStyle = A_(P.green, 0.12 * su); ctx.beginPath(); rrp(ctx, x, y, w, h, h * 0.22); ctx.fill(); }
    if (opt.icon) { if (typeof opt.icon === "function") opt.icon(ctx, x + baseH * 0.2 + ir, y + h / 2, ir); else ikon(ctx, opt.icon, x + baseH * 0.2 + ir, y + h / 2, ir, { t }); }
    font(ctx, fs, 700); ctx.fillStyle = opt.color || "#F2F6FF"; ctx.textBaseline = "middle";
    lines.forEach((ln, i) => ctx.fillText(ln, x + textX, y + h / 2 + (i - (lines.length - 1) / 2) * fs * 1.22 + fs * 0.03));
    ctx.textBaseline = "alphabetic";
    const sx = x + w - sr - fs * 0.35, sy = y + h / 2, pop = spring(su * 0.9, 12, 0.42);
    ctx.fillStyle = "rgba(10,16,52,0.35)"; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
    if (state === "check" && su > 0) check(ctx, sx, sy, sr * pop, P.green);
    else if (state === "cross" && su > 0) { ctx.save(); ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(sx, sy, sr * pop, 0, TAU); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = sr * 0.24; ctx.lineCap = "round"; const q = sr * 0.38 * pop; ctx.beginPath(); ctx.moveTo(sx - q, sy - q); ctx.lineTo(sx + q, sy + q); ctx.moveTo(sx + q, sy - q); ctx.lineTo(sx - q, sy + q); ctx.stroke(); ctx.restore(); }
    else if (flag) { ctx.save(); ctx.translate(sx, sy); ctx.scale(pop, pop); benderaMerah(ctx, 0, 0, sr * 2, { icon: true, t }); ctx.restore(); }
    ctx.restore();
    return h;
  }

  function tombol(ctx, x, y, size, opt = {}) {
    const w = size, label = opt.label || "", fs = Math.max(40, Math.round(opt.textSize || w * 0.16)), h = opt.h || Math.max(w * 0.3, fs * 1.8), dep = h * 0.22;
    const col = opt.color || P.pink, t = opt.t || 0, pr = clamp(opt.press || 0), blink = opt.blink || 0, b = blink * (0.5 + 0.5 * Math.sin(t * 7));
    const off = pr * dep * 0.8;
    ctx.save();
    shadow(ctx, x, y + h / 2 + dep + h * 0.08, w * 0.55, h * 0.12);
    if (b > 0) D.glow(ctx, x, y + dep * 0.5, w * 0.75, col, 0.55 * b);
    ctx.fillStyle = dark(col, 0.4); ctx.beginPath(); rrp(ctx, x - w / 2, y - h / 2 + dep, w, h, h * 0.4); ctx.fill();
    solid(ctx, () => rrp(ctx, x - w / 2, y - h / 2 + off, w, h, h * 0.4), b > 0 ? mix(col, "#FFFFFF", 0.25 * b) : col, h * 0.06, 0.3, 0.18);
    say(ctx, label, x, y + off + fs * 0.04, fs, opt.textColor || "#FFFFFF", { w: 900 });
    if (b > 0) { ctx.strokeStyle = A_("#FFFFFF", 0.7 * b); ctx.lineWidth = 4; ctx.beginPath(); rrp(ctx, x - w / 2 - 8, y - h / 2 - 8 + off, w + 16, h + 16, h * 0.45); ctx.stroke(); }
    ctx.restore();
    return { top: [x, y - h / 2 + off], h, w };
  }

  // ======================================================================
  // SHOWCASE
  // ======================================================================
  function cap(ctx, s, x, y, size = 26, col = "#DCE3FF") { say(ctx, s, x, y, size, col, { w: 700 }); }
  function showcase(ctx, t) {
    const W = 1920, HH = 1080, cyc = (t % 5.1) / 3.4;   // 0, .5, 1 pada t = 0, 1.7, 3.4
    const g0 = ctx.createLinearGradient(0, 0, 0, HH); g0.addColorStop(0, "#3A4C98"); g0.addColorStop(1, "#5466B2"); ctx.fillStyle = g0; ctx.fillRect(0, 0, W, HH);
    D.glow(ctx, 1500, 120, 500, P.warm, 0.12);
    say(ctx, "K.kit.bipkit", 40, 42, 40, "#FFFFFF", { align: "left", w: 900 });
    say(ctx, "Bip beraksi · pose (baris 1) · properti (baris 2–3) · t = " + t.toFixed(1), 330, 42, 28, "#C9D3F2", { align: "left", w: 700 });
    for (const fy of [388, 722]) { ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(0, fy, W, 40); }
    // ---- baris 1: pose ----
    const poses = ["diam", "jalan", "tunjuk", "kaget", "pegang", "bisik", "tekan", "kacaPembesar"];
    poses.forEach((p, i) => {
      const cx = 120 + i * 240; let s = 150, cy = 318, bx = cx; const o = { pose: p, t, seed: i };
      if (p === "diam") o.wave = t;
      if (p === "jalan") { o.dir = 1; bx = cx - 20 + Math.sin(t * 0.8) * 20; }
      if (p === "tunjuk") { bx = cx - 30; o.target = [cx + 90, 150]; ikon(ctx, "tanya", cx + 90, 150, 28, { t }); }
      if (p === "kaget") o.k = (t % 2.4);
      if (p === "pegang") o.prop = (c, px, py, ss) => gembok(c, px, py + ss * 0.02, ss * 0.42, { t, locked: 1 });
      if (p === "bisik") { o.dir = 1; bx = cx - 30; }
      if (p === "tekan") { s = 120; cy = 215; bx = cx - 50; const pr = clamp(cyc * 1.6 - 0.2); const b = tombol(ctx, cx + 20, 340, 180, { label: "Tunggu", color: P.teal, press: pr, t }); o.target = b.top; o.press = pr; o.mood = pr > 0.8 ? "happy" : "think"; }
      if (p === "kacaPembesar") { bx = cx - 45; const fx = cx + 45, fy = 350; for (let j = 0; j < 4; j++) { ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, fy, 5 + j * 5, PI * 1.1, PI * 1.9 + j * 0.2); ctx.stroke(); }
        o.target = [fx, fy]; o.content = (c, lx, ly, r) => { c.strokeStyle = "#4D3FB0"; c.lineWidth = 5; for (let j = 0; j < 5; j++) { c.beginPath(); c.arc(fx, fy + 6, 8 + j * 10, PI * 1.05, PI * 1.95 + j * 0.15); c.stroke(); } }; }
      draw(ctx, bx, cy, s, o);
      cap(ctx, p, cx, 408);
    });
    // ---- baris 2 ----
    toples(ctx, 105, 690, 200, { label: "panik", color: P.pink, fill: 0.25 + 0.6 * cyc, t, seed: 1 });
    toples(ctx, 300, 690, 200, { label: "rahasia", color: P.violet, fill: 0.8, t, seed: 2, lidColor: "#FF8A5B" });
    cap(ctx, "toples · fill · label", 200, 742);
    panci(ctx, 640, 690, 200, { t, steamShape: "!", form: clamp(cyc * 1.3 - 0.1), steamH: 185, fire: 1, liquid: P.amber });
    const tl = 0.7 + 0.9 * clamp(1 - cyc * 1.5);
    toples(ctx, 455, 500, 120, { color: P.teal, fill: 0.6, tilt: tl, pour: clamp(1 - cyc * 2), pourTo: 600, t, seed: 3, lid: false });
    cap(ctx, "panci '!' · toples tilt/pour", 610, 742);
    mapBerkas(ctx, 905, 690, 160, { n: 5 + Math.round(cyc * 4), grey: 3, drop: clamp((t * 0.9) % 1.4), t });
    cap(ctx, "mapBerkas · n, grey, drop", 960, 742);
    gembok(ctx, 1480, 610, 150, { locked: clamp(cyc * 1.2), flash: cyc >= 0.84 ? 0.8 : 0, t });
    cap(ctx, "gembok", 1480, 742);
    kertasLipat(ctx, 1730, 590, 260, { word: "Mangga", fold: clamp(cyc * 2 - 1), write: clamp(cyc * 2.2), pencil: true, t });
    cap(ctx, "kertasLipat · write, fold", 1745, 742);
    // ---- baris 3 ----
    stopwatch(ctx, 120, 860, 150, { seconds: 3 * clamp(cyc * 1.3), run: cyc < 0.75, t });
    meteran(ctx, 400, 905, 270, { value: 85 * eio(clamp(cyc * 1.25)), t });
    benderaMerah(ctx, 585, 1050, 210, { raise: clamp(cyc * 2), t });
    benderaMerah(ctx, 665, 820, 60, { icon: true, t });
    let ry = 772;
    ry += daftarPeriksa(ctx, 720, ry, 720, { textSize: 44, text: "Nomor baru, HP rusak", icon: "hpBaru", state: "flag", su: clamp(cyc * 2), t }) + 12;
    ry += daftarPeriksa(ctx, 720, ry, 720, { textSize: 44, text: "Telepon balik", icon: "teleponBalik", state: "check", u: clamp(cyc * 2 - 0.2), su: clamp(cyc * 2 - 0.8), t }) + 12;
    say(ctx, "stopwatch · meteran · benderaMerah · daftarPeriksa", 720, 1052, 24, "#DCE3FF", { align: "left", w: 700 });
    tombol(ctx, 1555, 820, 220, { label: "Transfer", color: P.pink, blink: 1, t });
    kacaPembesarW(ctx, 1490, 965, 100, { t, angle: 2.4, content: (c, x0, y0, r) => { c.fillStyle = P.amber; c.beginPath(); c.arc(x0 + 8, y0 + 6, r * 0.45, 0, TAU); c.fill(); } });
    seru(ctx, 1610, 965, 80, { t });
    say(ctx, "tombol · kacaPembesar · seru", 1555, 1052, 24, "#DCE3FF", { w: 700 });
    IKON.forEach((n, i) => { const ix = 1712 + (i % 3) * 72, iy = 800 + Math.floor(i / 3) * 86; ikon(ctx, n, ix, iy, 27, { t }); say(ctx, n, ix, iy + 40, 15, "#DCE3FF", { w: 700 }); });
    say(ctx, "ikon()", 1785, 1052, 24, "#DCE3FF", { w: 700 });
  }

  K.kit.bipkit = { draw, kacaPembesar: kacaPembesarW, toples, panci, mapBerkas, gembok, kertasLipat, stopwatch, meteran, benderaMerah, daftarPeriksa, tombol, ikon, seru, IKON, POSES: Object.keys(DEF_MOOD), showcase };
})(typeof window !== "undefined" ? window : globalThis);
