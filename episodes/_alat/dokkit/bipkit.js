/* dokkit/bipkit.js — Bip beraksi (pose dengan lengan) dan properti kecil untuk dokumenter D03 dan seterusnya.
   Bip digambar ulang di sini dengan rupa yang sama dengan TikTok.helpers.bip (warna, proporsi, mata, antena), ditambah lengan
   karet bulat, kaki melangkah, pinggir terang lembut. Semua deterministik (t dalam detik), ctx dikembalikan seperti semula.
   API:
     K.kit.bipkit.draw(ctx, x, y, s, opt) -> anchors      (x, y) = tengah badan (sama dengan D.bip), lantai = y + 0.5 s, s = ukuran (lebar badan ±0.9 s)
       opt.pose  diam | jalan | tunjuk | kaget | pegang | bisik | tekan | kacaPembesar
       opt.mood  happy | sad | think | wow (bawaan per pose), opt.look [dx,dy] -1..1 (bawaan: ke target/arah), opt.t, opt.seed
       opt.dir   1 kanan | -1 kiri (jalan, bisik, pegang samping; tunjuk/tekan/kaca bila target tidak ada)
       opt.target [x,y] dunia (tunjuk, tekan, kacaPembesar)       opt.wave (diam: angka -> tangan kanan melambai)
       opt.shadow false = tanpa bayangan lantai (Bip tidak berdiri di lantai)
       jalan: opt.speed (1)          kaget: opt.k detik sejak kaget (bawaan t % 2.4), opt.seru false = tanpa tanda seru
       pegang: opt.prop(ctx, px, py, s) digambar di titik pegang, opt.hold 'depan' (bawaan) | 'samping'
               depan: titik pegang (0, +0.3 s) dari tengah badan, opt.grip (setengah jarak tangan, satuan s, 0.3);
                      benda setinggi ≤0.35 s berpusat di titik pegang tidak menutupi mata (≤0.24 s: mulut juga bebas)
               samping: benda di samping badan setinggi bahu, pusat (dir·s·(0.5 + propSize/2), −0.06 s); opt.propSize (satuan s, 0.5)
       tekan: opt.press 0..1 (0 = jari ragu di atas target, bergoyang kecil; 1 = menekan); berdiri di lantai yang sama dengan tombol
       kacaPembesar: opt.glass (diameter lensa, satuan s, 0.5), opt.content(ctx, cx, cy, r) isi lensa (sudah di-clip)
       opt.sweat (tetes keringat), opt.alpha
       anchors: { x, y, s, top (ujung antena), head (atas badan), mouth, hand (tangan aktif), tip (ujung jari/lensa), whisper, prop (pegang), feet (y lantai) }
   Properti (semua: (ctx, x, y, size, opt) dengan opt.t untuk gerak diam):
     kacaPembesar  (x,y) tengah lensa, size diameter lensa; angle (arah gagang, bawaan 2.35), content(ctx,cx,cy,r), rim warna bingkai
     toples        (x,y) tengah dasar, size tinggi; label (≥40 px, lebar toples menyesuaikan label), textSize, color isi, fill 0..1, tilt (rad),
                   pour 0..1 (aliran ≥0.14·size, meruncing, tetes, percikan + riak di ujung), pourTo (y dunia ujung aliran) atau pourLen px,
                   splash (true), lid (true), lidColor, labelCol -> { mouth:[x,y], top, w (lebar sebenarnya), streamEnd:[x,y] }
     panci         (x,y) tengah dasar, size lebar; color, liquid, steam 0..1, steamShape '!' + form 0..1, steamH px, steamCol, glowCol,
                   fire 0..1 (tungku + lidah api + cahaya hangat; dasar tungku y + 0.11·size), burner true = tungku tanpa api -> { mouth:[x,y], w }
     bukuResep     (x,y) tengah buku terbuka, size lebar terbuka (tinggi 0.62·size); open 0..1, page (bagian pecahan = halaman berbalik), turn 0..1,
                   title ("Resep Penipuan"), header ("Bahan:"), slots (3), labels [..], active (indeks slot menyala), slotColors [..], cover
                   -> { spine, slots:[[x,y]..] (tengah slot), badges:[[x,y]..] (nomor), w, h, top, bottom }
     mapBerkas     (x,y) tengah dasar tumpukan, size lebar map; n jumlah, grey jumlah map abu-abu teratas (true = semua),
                   greyLabel ("tidak dilaporkan" | false), labelSide 1|-1, drop 0..1 (map teratas jatuh), seed -> { top:[x,y], h }
     gembok        (x,y) tengah badan gembok, size tinggi total; locked 0..1, color, flash 0..1 (cahaya klik)
     kertasLipat   (x,y) tengah kertas, size lebar; word, fold 0..1 (0-.5 lipat atas ke bawah, .5-1 lipat kiri ke kanan), write 0..1, pencil
     stopwatch     (x,y) tengah muka, size diameter; seconds, range (5 detik satu putaran), run, readout (true), unit ("detik")
     meteran       (x,y) tengah panel, size lebar panel; value 0..100, label ("kemiripan"), panel -> { top, bottom }
     benderaMerah  (x,y) kaki tiang, size tinggi tiang; raise 0..1, icon true = ikon bulat berpusat di (x,y) berdiameter size
     daftarPeriksa (x,y) kiri-atas baris, size lebar (≥600 disarankan); text, icon (IKON), state none|check|flag|cross, u 0..1 muncul,
                   su 0..1 status muncul, textSize (≥44), h, fill -> tinggi baris (untuk menumpuk)
     tombol        (x,y) tengah muka tombol, size lebar; label, color, press 0..1, blink 0..1, h -> { top:[x,y], h, w } (titik tekan untuk pose tekan)
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
    ctx.fillStyle = "rgba(255,143,177,0.85)"; ctx.beginPath(); ctx.ellipse(-s * 0.27, s * 0.1, s * 0.07, s * 0.045, 0, 0, TAU); ctx.ellipse(s * 0.27, s * 0.1, s * 0.07, s * 0.045, 0, 0, TAU); ctx.fill();
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
    if (kind === "tekan") {   // ujung jari lebih panjang dan terang agar terbaca pada ukuran kecil
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); ctx.fillStyle = C.light; ctx.beginPath(); rrp(ctx, s * 0.02, -s * 0.03, s * 0.16, s * 0.06, s * 0.03); ctx.fill();
      ctx.fillStyle = A_("#FFFFFF", 0.55); ctx.beginPath(); rrp(ctx, s * 0.05, -s * 0.024, s * 0.1, s * 0.016, s * 0.008); ctx.fill(); ctx.restore(); }
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
    if (opt.shadow !== false) ctx.fillStyle = "rgba(14,18,60,0.3)", ctx.beginPath(), ctx.ellipse(x, y + s * 0.5, s * 0.36 * hs, s * 0.07 * hs, 0, 0, TAU), ctx.fill();
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
      const bob = Math.sin(t * 1.6 + ph) * s * 0.006;
      if (opt.hold === "samping") {   // memperlihatkan benda di samping badan setinggi bahu
        const ps = opt.propSize || 0.5, side = dir, px = side * s * (0.5 + ps * 0.5), py = -s * 0.06 + bob;
        rest[side > 0 ? 1 : 0] = false; look = [side * 0.85, -0.15];
        const hx = px - side * ps * s * 0.22, hy = py + ps * s * 0.42;
        propFn = () => { if (opt.prop) { const [wx, wy] = toW(px, py); ctx.save(); ctx.rotate(-tilt); ctx.translate(-ox, -oy); opt.prop(ctx, wx, wy, s); ctx.restore(); } };
        front.push({ from: [side * s * 0.38, s * 0.08], to: [hx, hy], bend: -0.25 * side, kind: "kepal", ang: 0, arm: true, full: true });
        out.hand = toW(hx, hy); out.prop = toW(px, py);
      } else {
        rest = [false, false]; const gw = (opt.grip || 0.3) * s, py = s * 0.3 + bob;
        propFn = () => { if (opt.prop) { const [wx, wy] = toW(0, py); ctx.save(); ctx.rotate(-tilt); ctx.translate(-ox, -oy); opt.prop(ctx, wx, wy, s); ctx.restore(); } };
        for (const sd of [-1, 1]) front.push({ from: [sd * s * 0.38, s * 0.06], to: [sd * gw, py], bend: 0.18 * sd, kind: "kepal", ang: 0, arm: true });
        out.hand = toW(0, py); out.prop = out.hand;
      }
    } else if (pose === "bisik") {
      rest[dir > 0 ? 1 : 0] = false;
      front.push({ cup: true, to: [dir * s * 0.2, s * 0.14] });
      out.whisper = toW(dir * s * 0.75, s * 0.1); out.hand = toW(dir * s * 0.2, s * 0.14);
    } else if (pose === "tekan") {
      const side = dir; rest[side > 0 ? 1 : 0] = false;
      const sh = [side * s * 0.34, s * 0.12];
      const [tx, ty] = tg ? toL(tg[0], tg[1]) : [side * s * 0.45, s * 0.85];
      const pr = opt.press == null ? 0.5 + 0.5 * Math.sin(t * 2) : opt.press;
      const hes = 1 - clamp(pr * 4);   // ragu-ragu: jari bergoyang kecil selama belum menekan
      const wx = (Math.sin(t * 9 + ph) * 0.6 + Math.sin(t * 5.3 + ph) * 0.4) * s * 0.018 * hes;
      const tipY = lerp(ty - s * 0.13 + Math.sin(t * 3.4 + ph) * s * 0.012 * hes, ty + s * 0.025, eio(pr)), fl = s * 0.18, hr = s * 0.07;
      const hx = tx + wx, hy = tipY - fl - hr * 0.2;
      back.push({ from: sh, to: [hx, hy], bend: 0.16 * side, kind: "tekan", ang: PI / 2 });
      look = [clamp((tx - 0) / (s * 0.8), -0.8, 0.8), 0.9];
      out.hand = toW(hx, hy); out.tip = toW(tx + wx, tipY);
    }

    // --- kaki ---
    ctx.fillStyle = C.dark;
    if (pose === "kaget") {   // kaki tetap menempel di badan; terlipat ke atas dan ke dalam saat melayang
      const tuck = clamp(hop / (s * 0.3));
      for (const [fx] of feet) { ctx.beginPath(); ctx.ellipse(fx * (1 - 0.22 * tuck), s * (0.43 - 0.035 * tuck), s * 0.11 * (1 - 0.12 * tuck), s * 0.07, -Math.sign(fx) * 0.35 * tuck, 0, TAU); ctx.fill(); }
    } else for (const [fx, lift] of feet) { ctx.beginPath(); ctx.ellipse(fx, s * 0.43 + hop - lift, s * 0.11, s * 0.07, 0, 0, TAU); ctx.fill(); }
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
    if (propFn) { for (const a of front) if (a.arm) { const f = a.full ? 1 : 0.7; hose(ctx, s, a.from[0], a.from[1], lerp(a.from[0], a.to[0], f), lerp(a.from[1], a.to[1], f), a.bend); } propFn(); }
    for (const a of front) {
      if (a.cup) {   // tangan menangkup di samping mulut
        const [hx, hy] = a.to; hose(ctx, s, dir * s * 0.4, s * 0.1, hx + dir * s * 0.04, hy + s * 0.04, 0.1 * dir);
        ctx.save(); ctx.translate(hx, hy); ctx.scale(dir, 1);
        ctx.fillStyle = C.bip; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.065, s * 0.11, 0.15, 0, TAU); ctx.fill();
        ctx.fillStyle = A_(C.dark, 0.35); ctx.beginPath(); ctx.ellipse(s * 0.02, s * 0.01, s * 0.035, s * 0.085, 0.15, 0, TAU); ctx.fill();
        ctx.fillStyle = A_(C.light, 0.7); ctx.beginPath(); ctx.ellipse(-s * 0.025, -s * 0.04, s * 0.02, s * 0.04, 0.15, 0, TAU); ctx.fill();
        ctx.restore();
        // gelombang bisikan
        ctx.lineCap = "round";
        for (let i = 0; i < 3; i++) { const u = ((t * 0.9 + i / 3 + ph) % 1), r = s * (0.14 + u * 0.4), a0 = dir > 0 ? 0 : PI;
          ctx.strokeStyle = A_(i % 2 ? "#FFD38A" : "#FFF1D6", Math.sin(PI * u)); ctx.lineWidth = s * 0.038 * (1 - u * 0.45);
          ctx.beginPath(); ctx.arc(hx + dir * s * 0.04, hy - s * 0.02, r, a0 - 0.5, a0 + 0.5); ctx.stroke(); }
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
    const h = size, t = opt.t || 0, col = opt.color || P.pink, fill = opt.fill == null ? 0.7 : opt.fill;
    // label menentukan lebar: badan toples selalu lebih lebar dari stiker (stiker ≥40 px)
    const fs = Math.max(40, Math.round(opt.textSize || h * 0.13)), lw = opt.label ? tw(ctx, opt.label, fs) + fs * 0.8 : 0;
    const w = Math.max(size * 0.74, lw + fs * 0.6);
    const tilt = opt.tilt || 0, neckW = w * 0.72, neckH = h * 0.08, bodyH = h - neckH - h * 0.1, lidH = h * 0.1;
    ctx.save(); ctx.translate(x, y);
    if (!tilt) shadow(ctx, 0, 0, w * 0.55, h * 0.05);
    ctx.rotate(tilt);
    const bodyP = () => rrp(ctx, -w / 2, -bodyH, w, bodyH, Math.min(w, bodyH) * 0.24);
    // kaca belakang
    ctx.fillStyle = "rgba(205,228,255,0.22)"; ctx.beginPath(); bodyP(); ctx.fill();
    ctx.beginPath(); rrp(ctx, -neckW / 2, -bodyH - neckH, neckW, neckH + w * 0.1, w * 0.05); ctx.fill();
    // isi (permukaan tetap mendatar ketika toples miring)
    if (fill > 0.001) {
      const m = Math.min(w, bodyH) * 0.05;
      ctx.save(); ctx.beginPath(); rrp(ctx, -w / 2 + m, -bodyH + m, w - 2 * m, bodyH - 2 * m, Math.min(w, bodyH) * 0.19); ctx.clip();
      ctx.rotate(-tilt);
      const lev = lerp(0, bodyH * 0.92, fill) * Math.cos(tilt) - (tilt ? Math.sin(Math.abs(tilt)) * w * 0.1 : 0), E = Math.max(w, h) * 1.5;
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-E, E); ctx.lineTo(-E, -lev);
      for (let i = 0; i <= 24; i++) { const xx = lerp(-E, E, i / 24); ctx.lineTo(xx, -lev + Math.sin(xx * 0.06 + t * 3) * h * 0.008); }
      ctx.lineTo(E, E); ctx.closePath(); ctx.fill();
      ctx.fillStyle = lite(col, 0.3); ctx.fillRect(-E, -lev - h * 0.004, E * 2, h * 0.022);
      const r = D.rng(7 + (opt.seed || 0)); ctx.fillStyle = dark(col, 0.18);
      for (let i = 0; i < 16; i++) { const bx = (r() - 0.5) * w * 0.85, by = -r() * lev * 0.95; ctx.beginPath(); ctx.arc(bx, by, h * (0.012 + r() * 0.018), 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    // kaca depan: kilap
    ctx.save(); ctx.beginPath(); bodyP(); ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,0.32)"; ctx.beginPath(); rrp(ctx, -w / 2 + w * 0.12, -bodyH * 0.86, h * 0.065, bodyH * 0.72, h * 0.032); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); rrp(ctx, -w / 2 + w * 0.12 + h * 0.1, -bodyH * 0.5, h * 0.026, bodyH * 0.34, h * 0.013); ctx.fill();
    ctx.fillStyle = "rgba(30,36,100,0.16)"; ctx.beginPath(); ctx.ellipse(w * 0.5, -bodyH / 2, h * 0.1, bodyH * 0.6, 0, 0, TAU); ctx.fill();
    ctx.restore();
    // tutup
    if (opt.lid !== false) {
      const lc = opt.lidColor || "#7C66E0", lx = -neckW / 2 - w * 0.04, lW = neckW + w * 0.08, n = Math.max(5, Math.round(lW / (h * 0.045)));
      solid(ctx, () => rrp(ctx, lx, -h, lW, lidH, lidH * 0.35), lc, h * 0.012);
      ctx.fillStyle = dark(lc, 0.2); for (let i = 1; i < n; i++) ctx.fillRect(lx + lW * i / n - h * 0.003, -h + lidH * 0.25, h * 0.006, lidH * 0.6);
    } else { ctx.fillStyle = "rgba(225,240,255,0.5)"; ctx.beginPath(); ctx.ellipse(0, -bodyH - neckH, neckW / 2 + w * 0.03, h * 0.022, 0, 0, TAU); ctx.fill(); }
    // label: stiker pendek di bahu toples, isi tetap terlihat di bawahnya
    if (opt.label) {
      const lh = fs * 1.28, ly = -bodyH + bodyH * 0.07;
      ctx.fillStyle = "rgba(20,24,70,0.18)"; ctx.beginPath(); rrp(ctx, -lw / 2 + 3, ly + 5, lw, lh, fs * 0.22); ctx.fill();
      ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); rrp(ctx, -lw / 2, ly, lw, lh, fs * 0.22); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillRect(-lw / 2 + fs * 0.22, ly + fs * 0.07, lw - fs * 0.44, fs * 0.06);
      ctx.fillStyle = opt.labelCol || col; ctx.fillRect(-lw / 2 + fs * 0.22, ly + lh - fs * 0.17, lw - fs * 0.44, fs * 0.08);
      say(ctx, opt.label, 0, ly + lh * 0.47, fs, INK, { w: 800 });
    }
    ctx.restore();
    // aliran tuang: keluar dari bibir toples, melengkung lalu jatuh, menipis ke bawah
    const sg = tilt > 0.05 ? 1 : tilt < -0.05 ? -1 : 0, lx0 = sg * neckW / 2, ly0 = -(bodyH + neckH);
    const mw = [x + Math.cos(tilt) * lx0 - Math.sin(tilt) * ly0, y + Math.sin(tilt) * lx0 + Math.cos(tilt) * ly0];
    const pour = opt.pour || 0, sw = h * 0.14 * Math.min(1, pour * 3), arc = sg * sw * 0.9;
    let end = [mw[0] + arc, opt.pourTo != null ? opt.pourTo : mw[1] + (opt.pourLen || h)];
    if (pour > 0 && fill > 0) {
      const Lf = Math.max(0, end[1] - mw[1]), grow = clamp(pour * 1.6), L = Lf * grow, x0 = mw[0], y0 = mw[1];
      const cxf = u => x0 + arc * (1 - (1 - u) * (1 - u)) + Math.sin(u * 9 - t * 12) * sw * 0.06 * u, wf = u => sw / 2 * (1 - u * 0.35);
      ctx.save(); ctx.fillStyle = col; ctx.beginPath();
      for (let i = 0; i <= 16; i++) { const u = i / 16; ctx.lineTo(cxf(u) - wf(u), y0 + u * L); }
      for (let i = 16; i >= 0; i--) { const u = i / 16; ctx.lineTo(cxf(u) + wf(u), y0 + u * L); }
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cxf(0), y0, sw * 0.55, sw * 0.28, tilt, 0, TAU); ctx.fill();   // bibir aliran
      ctx.fillStyle = lite(col, 0.4); ctx.beginPath();
      for (let i = 1; i <= 14; i++) { const u = i / 16; ctx.lineTo(cxf(u) - wf(u) * 0.45, y0 + u * L); }
      for (let i = 14; i >= 1; i--) { const u = i / 16; ctx.lineTo(cxf(u) - wf(u) * 0.15, y0 + u * L); }
      ctx.closePath(); ctx.fill();
      // tetes yang lepas di samping aliran
      ctx.fillStyle = col;
      for (let i = 0; i < 4; i++) { const u = (t * 1.3 + i * 0.27) % 1, yy = y0 + L * (0.15 + u * 0.8), k = i % 2 ? 1 : -1;
        if (yy > y0 + L) continue; const dr = sw * (0.24 - 0.035 * i); ctx.globalAlpha = Math.sin(PI * u);
        ctx.beginPath(); ctx.ellipse(cxf(clamp((yy - y0) / Lf)) + k * (wf(0.5) + sw * (0.25 + 0.15 * u)), yy, dr * 0.85, dr * 1.15, 0, 0, TAU); ctx.fill(); }
      ctx.globalAlpha = 1;
      // percikan dan riak di permukaan
      if (grow >= 1 && opt.splash !== false) {
        const ex = cxf(1), ey = y0 + L; end = [ex, ey];
        ctx.strokeStyle = lite(col, 0.45); ctx.lineWidth = Math.max(2, sw * 0.12);
        for (let i = 0; i < 2; i++) { const u = (t * 1.1 + i * 0.5) % 1; ctx.globalAlpha = 0.9 * (1 - u); ctx.beginPath(); ctx.ellipse(ex, ey, sw * (0.7 + u * 1.6), sw * (0.16 + u * 0.32), 0, 0, TAU); ctx.stroke(); }
        ctx.globalAlpha = 1; ctx.fillStyle = col;
        ctx.beginPath(); ctx.ellipse(ex, ey, sw * 0.75, sw * 0.22, 0, PI, TAU); ctx.fill();
        for (let i = 0; i < 6; i++) { const u = (t * 2.2 + i * 0.37) % 1, a = -PI / 2 + (i - 2.5) * 0.42, sp = sw * (0.6 + (i % 3) * 0.25);
          const px = ex + Math.cos(a) * sp * u * 1.6, py = ey - Math.sin(-a) * sp * u * 2.2 + sp * 2.6 * u * u;
          ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(px, py, sw * 0.11 * (1 - u * 0.5), 0, TAU); ctx.fill(); }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    }
    return { mouth: mw, top: y - h, w, streamEnd: end };
  }

  // titik sasaran tanda seru dari uap (satuan: tinggi bentuk H, lebar relatif)
  const SERU_PTS = (() => { const pts = [], r = D.rng(31); for (let i = 0; i < 34; i++) { const u = i / 33, k = i % 3 - 1; pts.push([k * (0.07 - u * 0.035) + (r() - 0.5) * 0.015, -1 + 0.06 + u * 0.6, 0.085 - u * 0.03 + r() * 0.012]); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; pts.push([Math.cos(a) * 0.05, -0.13 + Math.sin(a) * 0.05, 0.055]); } pts.push([0, -0.13, 0.075]); return pts; })();
  function panci(ctx, x, y, size, opt = {}) {
    const w = size, t = opt.t || 0, col = opt.color || "#EE5560", hb = w * 0.46, top = y - hb;
    ctx.save();
    // api kompor
    const fire = opt.fire || 0;
    const burner = fire > 0 || opt.burner, by = y + w * 0.075;
    if (burner) {   // tungku kompor: cincin abu-abu, lidah api ke atas (biru di dasar, toska muda di ujung), cahaya hangat di dasar panci
      shadow(ctx, x, by + w * 0.035, w * 0.5, w * 0.05);
      ctx.fillStyle = "#6F7899"; ctx.beginPath(); ctx.ellipse(x, by + w * 0.012, w * 0.42, w * 0.06, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#8F98BA"; ctx.beginPath(); ctx.ellipse(x, by, w * 0.42, w * 0.055, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#5B6488"; ctx.beginPath(); ctx.ellipse(x, by, w * 0.3, w * 0.034, 0, 0, TAU); ctx.fill();
      for (const k of [-1, 1]) { ctx.fillStyle = "#7B84A8"; ctx.beginPath(); rrp(ctx, x + k * w * 0.36 - w * 0.03, by - w * 0.06, w * 0.06, w * 0.06, w * 0.015); ctx.fill(); }
      if (fire > 0) {
        D.glow(ctx, x, y + w * 0.01, w * 0.5, P.amber, 0.45 * fire);
        const N = 9;
        for (let i = 0; i < N; i++) { const u = i / (N - 1), fx = x + (u - 0.5) * w * 0.56, fl = w * (0.075 + 0.025 * Math.sin(t * 13 + i * 2.1) + 0.012 * Math.sin(t * 29 + i)) * fire * (1 - Math.abs(u - 0.5) * 0.5), fw = w * 0.03, lean = Math.sin(t * 7 + i * 1.3) * w * 0.006;
          const fb = by - w * 0.004;
          ctx.fillStyle = "#4A8BFF"; ctx.beginPath(); ctx.moveTo(fx - fw, fb); ctx.quadraticCurveTo(fx - fw, fb - fl * 0.55, fx + lean, fb - fl); ctx.quadraticCurveTo(fx + fw, fb - fl * 0.55, fx + fw, fb); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#9FF3E8"; ctx.beginPath(); ctx.moveTo(fx - fw * 0.45, fb); ctx.quadraticCurveTo(fx - fw * 0.45, fb - fl * 0.45, fx + lean * 0.8, fb - fl * 0.72); ctx.quadraticCurveTo(fx + fw * 0.45, fb - fl * 0.45, fx + fw * 0.45, fb); ctx.closePath(); ctx.fill(); }
      }
    } else shadow(ctx, x, y, w * 0.55, w * 0.05);
    // pegangan samping
    for (const k of [-1, 1]) { ctx.fillStyle = dark(col, 0.35); ctx.beginPath(); rrp(ctx, x + k * w * 0.5 - (k > 0 ? 0 : w * 0.16), top + hb * 0.12, w * 0.16, hb * 0.16, hb * 0.08); ctx.fill(); }
    // badan
    solid(ctx, () => { ctx.moveTo(x - w / 2, top); ctx.lineTo(x + w / 2, top); ctx.lineTo(x + w * 0.47, y - w * 0.1); ctx.quadraticCurveTo(x + w * 0.46, y, x + w * 0.36, y); ctx.lineTo(x - w * 0.36, y); ctx.quadraticCurveTo(x - w * 0.46, y, x - w * 0.47, y - w * 0.1); ctx.closePath(); }, col, w * 0.03, 0.25, 0.22);
    ctx.fillStyle = dark(col, 0.12); ctx.fillRect(x - w * 0.485, top + hb * 0.55, w * 0.97, hb * 0.07);
    if (fire > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - w, y - hb * 0.3, w * 2, hb * 0.3); ctx.clip(); const gg = ctx.createLinearGradient(0, y - hb * 0.3, 0, y); gg.addColorStop(0, "rgba(255,181,71,0)"); gg.addColorStop(1, `rgba(255,190,90,${0.45 * fire})`); ctx.fillStyle = gg;
      ctx.beginPath(); ctx.moveTo(x + w * 0.47, y - w * 0.1); ctx.quadraticCurveTo(x + w * 0.46, y, x + w * 0.36, y); ctx.lineTo(x - w * 0.36, y); ctx.quadraticCurveTo(x - w * 0.46, y, x - w * 0.47, y - w * 0.1); ctx.lineTo(x - w * 0.48, y - hb * 0.3); ctx.lineTo(x + w * 0.48, y - hb * 0.3); ctx.closePath(); ctx.fill(); ctx.restore(); }
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
      if (form > 0.05) D.glow(ctx, x, top - HH * 0.6, HH * 0.42, opt.glowCol || P.pink, 0.3 * form * steam);
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
  const GREY = "#A9ACBA";
  function mapBerkas(ctx, x, y, size, opt = {}) {
    const fw = size, th = fw * 0.13, n = Math.max(0, Math.floor(opt.n == null ? 6 : opt.n)), t = opt.t || 0, seed = opt.seed || 0;
    const ng = opt.grey === true ? n : Math.min(n, opt.grey || 0);
    // atribut tetap per map (tidak berubah ketika n bertambah)
    const attr = i => { const r = D.rng(101 + seed * 977 + i * 131); return { jx: (r() - 0.5) * fw * 0.08, rot: (r() - 0.5) * 0.05, tab: [-0.36, -0.12, 0.12][Math.floor(r() * 3)], side: r() > 0.5 ? 1 : -1, tabY: 0.15 + r() * 0.3, bx: (r() - 0.5) * fw * 0.05, paper: r() > 0.35, pOff: (r() - 0.5) * fw * 0.1, pH: 0.3 + r() * 0.25 }; };
    ctx.save(); shadow(ctx, x, y, fw * 0.62, fw * 0.06);
    const drop = opt.drop == null ? 1 : opt.drop;
    for (let i = 0; i < n; i++) {
      const a = attr(i), grey = i >= n - ng, c = grey ? GREY : MAP_COLS[(i + seed) % MAP_COLS.length], topOne = i === n - 1;
      let yy = y - i * th * 0.94, xx = x + a.jx, rot = a.rot;
      if (topOne && drop < 1) { const u = clamp(drop); yy -= (1 - eout(u)) * fw * 0.9; rot += (1 - u) * 0.25; ctx.globalAlpha = clamp(u * 4); }
      ctx.save(); ctx.translate(xx, yy); ctx.rotate(rot);
      const back = grey ? "#8E91A2" : dark(c, 0.3), paperC = grey ? "#E2E3E9" : "#FBF7EE";
      // sampul belakang: sedikit bergeser, dengan tab di samping (tetap terlihat dalam tumpukan) dan tab atas untuk map teratas
      ctx.fillStyle = back;
      ctx.beginPath(); rrp(ctx, a.side > 0 ? fw / 2 + a.bx - th * 0.4 : -fw / 2 + a.bx - fw * 0.06, -th * (0.86 - a.tabY * 0.5) - th * 0.05, fw * 0.06 + th * 0.4, th * 0.5, th * 0.16); ctx.fill();
      if (topOne) { ctx.beginPath(); rrp(ctx, a.tab * fw + a.bx, -th * 1.3, fw * 0.24, th * 0.6, th * 0.18); ctx.fill(); }
      ctx.beginPath(); rrp(ctx, -fw / 2 + a.bx, -th * 1.0, fw, th * 1.0, th * 0.2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(-fw / 2 + a.bx + th * 0.2, -th * 0.98, fw - th * 0.4, Math.max(1.5, th * 0.07));
      // kertas di antara sampul (garis krem) — sebagian map, juga menyembul di sisi
      if (a.paper) { ctx.fillStyle = paperC; ctx.fillRect(-fw * 0.46 + a.pOff * 0.3, -th * 0.8, fw * 0.92, th * 0.2);
        ctx.fillStyle = grey ? "rgba(120,124,140,0.3)" : "rgba(214,196,160,0.8)"; ctx.fillRect(-fw * 0.46 + a.pOff * 0.3, -th * 0.66, fw * 0.92, Math.max(1.5, th * 0.05));
        ctx.fillStyle = paperC; ctx.fillRect(a.side < 0 ? fw / 2 - fw * 0.005 : -fw / 2 - fw * 0.03, -th * 0.78, fw * 0.035, th * 0.16); }
      // sampul depan (lebih pendek: map terlihat "terbuka" berisi kertas)
      solid(ctx, () => rrp(ctx, -fw / 2, -th * 0.62, fw, th * 0.62, th * 0.18), c, th * 0.1, grey ? 0.18 : 0.3, 0.2);
      ctx.fillStyle = "rgba(255,255,255,0.28)"; ctx.fillRect(-fw / 2 + th * 0.2, -th * 0.62, fw - th * 0.4, Math.max(1.5, th * 0.06));
      ctx.fillStyle = grey ? "#C6C8D2" : "#FFF6E6"; ctx.beginPath(); rrp(ctx, -fw * 0.1 + a.tab * fw * 0.3, -th * 0.45, fw * 0.2, th * 0.26, th * 0.06); ctx.fill();
      if (grey) {   // garis putus-putus terang: map jenis lain, bukan sekadar abu-abu
        ctx.setLineDash([th * 0.32, th * 0.22]); ctx.lineDashOffset = -t * th * 0.6; ctx.strokeStyle = "#E3E5EE"; ctx.lineWidth = Math.max(2, th * 0.08);
        ctx.beginPath(); rrp(ctx, -fw / 2 + th * 0.1, -th * 0.54, fw - th * 0.2, th * 0.46, th * 0.13); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.restore(); ctx.globalAlpha = 1;
    }
    const topY = y - n * th * 0.94;
    if (ng > 0 && opt.greyLabel !== false) {
      const side = opt.labelSide === -1 ? -1 : 1, y0 = topY - th * 0.2, y1 = y - (n - ng) * th * 0.94, bx = x + side * fw * 0.62;
      ctx.strokeStyle = A_("#DDE3FF", 0.9); ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(bx - side * 14, y0); ctx.lineTo(bx, y0); ctx.lineTo(bx, y1); ctx.lineTo(bx - side * 14, y1); ctx.moveTo(bx, (y0 + y1) / 2); ctx.lineTo(bx + side * 16, (y0 + y1) / 2); ctx.stroke();
      const s = opt.greyLabel || "tidak dilaporkan", fs = Math.max(40, opt.labelSize || 40), lw = tw(ctx, s, fs, 800) + fs * 1.0, lh = fs * 1.6;
      const lx = side > 0 ? bx + 20 : bx - 20 - lw, ly = (y0 + y1) / 2 - lh / 2;
      ctx.fillStyle = "#7A7E96"; ctx.beginPath(); rrp(ctx, lx, ly, lw, lh, lh / 2); ctx.fill();
      ctx.setLineDash([12, 8]); ctx.strokeStyle = "#E3E5EE"; ctx.lineWidth = 3; ctx.beginPath(); rrp(ctx, lx + 5, ly + 5, lw - 10, lh - 10, lh / 2 - 5); ctx.stroke(); ctx.setLineDash([]);
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
    const FR = "#FFF8EA", BK = "#F0E5CC", BKD = "#C9B994", EDGE = ["#CDBB92", "#F3E8CC", "#C4B087"], word = opt.word || "", fs = Math.max(44, Math.round(opt.textSize || w * 0.2)), write = opt.write == null ? 1 : clamp(opt.write);
    const lt = Math.max(3, w * 0.011), MINC = 0.16;   // tebal satu lapis kertas; tinggi minimum flap (0.16 × h/2 = 0.08 h)
    // posisi huruf (tulisan tangan) — dihitung sekali per kata
    const r = D.rng([...word].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0);
    font(ctx, fs, 700, "italic "); const ws = ctx.measureText(word).width;
    const letters = []; let cx = -ws / 2; for (const ch of word) { const cw = ctx.measureText(ch).width; letters.push([ch, cx + cw / 2, (r() - 0.5) * fs * 0.16, (r() - 0.5) * 0.3, 0.9 + r() * 0.2]); cx += cw * (0.96 + r() * 0.06); }
    const wy = -h * 0.17;
    const ink = (a = 1) => {
      const nShow = write * letters.length;
      font(ctx, fs, 700, "italic "); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      letters.forEach(([ch, lx, dy, rot, sc], i) => { const al = clamp(nShow - i) * a; if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.translate(lx, wy + dy); ctx.rotate(rot - 0.05); ctx.scale(sc, sc); ctx.fillStyle = "#2B3A9A"; ctx.fillText(ch, 0, 0); ctx.restore(); });
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      if (write >= 1 && word) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = "rgba(43,58,154,0.75)"; ctx.lineWidth = Math.max(3, fs * 0.07); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-ws / 2, wy + fs * 0.62); ctx.quadraticCurveTo(0, wy + fs * 0.5, ws / 2 + fs * 0.1, wy + fs * 0.66); ctx.stroke(); ctx.restore(); }
    };
    const face = () => {
      ctx.fillStyle = FR; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(90,169,255,0.28)"; for (let i = 1; i < 6; i++) ctx.fillRect(-w / 2, -h / 2 + h * i / 6, w, Math.max(1.5, h * 0.008));
      ctx.fillStyle = "rgba(255,111,145,0.45)"; ctx.fillRect(-w / 2 + w * 0.1, -h / 2, Math.max(2, w * 0.008), h);
      ink();
    };
    // gradien gelap ke arah engsel (x0,y0) -> terang ke tepi bebas (x1,y1)
    const hingeGrad = (x0, y0, x1, y1, a0, a1 = 0) => { const g2 = ctx.createLinearGradient(x0, y0, x1, y1); g2.addColorStop(0, `rgba(110,84,40,${a0})`); g2.addColorStop(1, `rgba(110,84,40,${a1})`); return g2; };
    // tumpukan lapis kertas: tepi bertingkat di sisi terbuka (kanan dan bawah)
    const stack = (rx, ry, rw, rh, n) => { for (let k = n; k >= 1; k--) { ctx.fillStyle = EDGE[(k - 1) % EDGE.length]; ctx.fillRect(rx + lt * 0.7 * k, ry + lt * k, rw, rh); } };
    const crease = (horiz, x0, y0, len, depth) => {   // pita bayangan lembut + garis terang di lipatan
      const g2 = horiz ? ctx.createLinearGradient(0, y0, 0, y0 + depth) : ctx.createLinearGradient(x0, 0, x0 + depth, 0);
      g2.addColorStop(0, "rgba(120,92,48,0.26)"); g2.addColorStop(0.45, "rgba(120,92,48,0.08)"); g2.addColorStop(1, "rgba(120,92,48,0)");
      ctx.fillStyle = g2; if (horiz) ctx.fillRect(x0, y0, len, depth); else ctx.fillRect(x0, y0, depth, len);
      ctx.fillStyle = "rgba(255,255,255,0.7)"; if (horiz) ctx.fillRect(x0, y0, len, Math.max(1.5, lt * 0.5)); else ctx.fillRect(x0, y0, Math.max(1.5, lt * 0.5), len);
    };

    ctx.save(); ctx.translate(x - w / 4 * f2, y - h / 4 * f1);
    const pw = w * (1 - 0.5 * f2), phh = h * (1 - 0.5 * f1);
    ctx.save(); ctx.translate(w / 4 * f2, h / 4 * f1); shadow(ctx, 0, phh / 2 + h * 0.05, pw * 0.55, h * 0.05, 0.2); ctx.restore();
    if (f1 < 1) {
      // tahap 1: setengah atas dilipat ke bawah (engsel y = 0)
      const th1 = PI * f1, c = Math.cos(th1), ce = c >= 0 ? Math.max(c, MINC) : Math.min(c, -MINC), lift = Math.sin(th1);
      ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, 0, w, h / 2); ctx.clip(); face();
      if (f1 > 0) { // bayangan flap yang terangkat jatuh ke setengah bawah
        const sd = c < 0 ? -ce * h / 2 : 0, g2 = ctx.createLinearGradient(0, sd, 0, sd + h * 0.18 * lift + 1); g2.addColorStop(0, `rgba(60,48,90,${0.22 * lift})`); g2.addColorStop(1, "rgba(60,48,90,0)");
        ctx.fillStyle = g2; ctx.fillRect(-w / 2, sd, w, h * 0.18 * lift + 1); }
      ctx.restore();
      if (f1 === 0) { ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h / 2); ctx.clip(); face(); ctx.restore(); }
      else if (ce > 0) {   // sisi depan flap, makin pendek dan gelap ke engsel
        ctx.save(); ctx.transform(1, 0, 0, ce, 0, 0); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h / 2); ctx.clip(); face();
        ctx.fillStyle = hingeGrad(0, 0, 0, -h / 2, 0.08 + 0.3 * (1 - c), 0.15 * (1 - c)); ctx.fillRect(-w / 2, -h / 2, w, h / 2); ctx.restore();
      } else {   // sisi belakang flap (BK), melebar sedikit di tepi bebas karena mendekat ke kamera
        const L = -ce * h / 2, xs = 1 + 0.06 * lift;
        if (-c > 0.85) { ctx.fillStyle = EDGE[0]; ctx.fillRect(-w / 2 + lt * 0.7, h / 2 - lt * 0.2, w, lt * 1.2); ctx.fillRect(w / 2, lt, lt * 0.7, h / 2); }
        ctx.save(); ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2 * xs, L); ctx.quadraticCurveTo(0, L + h * 0.05 * lift, -w / 2 * xs, L); ctx.closePath(); ctx.clip();
        ctx.fillStyle = BK; ctx.fillRect(-w, 0, w * 2, L + h * 0.06);
        ctx.fillStyle = hingeGrad(0, 0, 0, L, 0.18 + 0.25 * lift, 0.02); ctx.fillRect(-w, 0, w * 2, L + h * 0.06);
        ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - lift)})`; ctx.fillRect(-w, L - lt, w * 2, lt);
        ctx.restore();
      }
    } else {
      // tahap 2: setengah kiri dilipat ke kanan (engsel x = 0); lapisan kertas bertambah
      const th2 = PI * f2, c2 = Math.cos(th2), ce2 = c2 >= 0 ? Math.max(c2, MINC) : Math.min(c2, -MINC), lift2 = Math.sin(th2);
      const top2 = () => { ctx.fillStyle = BK; ctx.fillRect(-w / 2, 0, w, h / 2); crease(true, -w / 2, 0, w, h * 0.16); };
      if (f2 === 0) { stack(-w / 2, 0, w, h / 2, 1); ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, 0, w, h / 2); ctx.clip(); top2(); ctx.restore(); }
      else if (f2 < 1) {
        // separuh kanan (2 lapis)
        stack(0, 0, w / 2, h / 2, 1);
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w / 2, h / 2); ctx.clip(); top2();
        if (f2 > 0) { const sd = c2 < 0 ? -ce2 * w / 2 : 0, g2 = ctx.createLinearGradient(sd, 0, sd + w * 0.14 * lift2 + 1, 0); g2.addColorStop(0, `rgba(60,48,90,${0.22 * lift2})`); g2.addColorStop(1, "rgba(60,48,90,0)"); ctx.fillStyle = g2; ctx.fillRect(sd, 0, w * 0.14 * lift2 + 1, h / 2); }
        ctx.restore();
        if (ce2 > 0) {
          ctx.save(); ctx.transform(ce2, 0, 0, 1, 0, 0); stack(-w / 2, 0, w / 2, h / 2, 1); ctx.beginPath(); ctx.rect(-w / 2, 0, w / 2, h / 2); ctx.clip(); top2();
          ctx.fillStyle = hingeGrad(0, 0, -w / 2, 0, 0.08 + 0.3 * (1 - c2), 0.12 * (1 - c2)); ctx.fillRect(-w / 2, 0, w / 2, h / 2); ctx.restore();
        } else {
          const L = -ce2 * w / 2, ys = 1 + 0.06 * lift2;
          ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L, -h / 2 * (ys - 1)); ctx.lineTo(L, h / 2 * ys); ctx.lineTo(0, h / 2); ctx.closePath(); ctx.clip();
          ctx.fillStyle = mix(BK, "#FFF8EA", 0.35); ctx.fillRect(0, -h, L + 2, h * 2);
          ctx.fillStyle = hingeGrad(0, 0, L, 0, 0.18 + 0.25 * lift2, 0.02); ctx.fillRect(0, -h, L + 2, h * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - lift2)})`; ctx.fillRect(L - lt, -h, lt, h * 2);
          ctx.restore();
        }
      } else {
        // tahap akhir: seperempat ukuran, 4 lapis; tepi bertingkat, bayangan lipatan, satu sudut sedikit terangkat
        const qw = w / 2, qh = h / 2, cq = Math.min(qw, qh) * (0.16 + 0.025 * Math.sin(t * 1.8));
        stack(0, 0, qw, qh, 3);
        ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(qw, 0); ctx.lineTo(qw, qh - cq); ctx.lineTo(qw - cq, qh); ctx.lineTo(0, qh); ctx.closePath(); ctx.clip();
        ctx.fillStyle = mix(BK, "#FFF8EA", 0.35); ctx.fillRect(0, 0, qw, qh);
        const dg = ctx.createLinearGradient(0, 0, qw, qh); dg.addColorStop(0, "rgba(255,255,255,0.18)"); dg.addColorStop(1, "rgba(120,92,48,0.1)"); ctx.fillStyle = dg; ctx.fillRect(0, 0, qw, qh);
        crease(true, 0, 0, qw, qh * 0.3); crease(false, 0, 0, qh, qw * 0.22);
        // bayangan diagonal dari sudut yang terangkat
        const sg2 = ctx.createLinearGradient(qw - cq * 0.5, qh - cq * 0.5, qw - cq * 1.6, qh - cq * 1.6); sg2.addColorStop(0, "rgba(90,70,40,0.22)"); sg2.addColorStop(1, "rgba(90,70,40,0)");
        ctx.fillStyle = sg2; ctx.beginPath(); ctx.moveTo(qw, qh - cq * 2.2); ctx.lineTo(qw, qh); ctx.lineTo(qw - cq * 2.2, qh); ctx.closePath(); ctx.fill();
        ctx.restore();
        // sudut terangkat: sisi bawah kertas terlihat
        ctx.fillStyle = "rgba(90,70,40,0.2)"; ctx.beginPath(); ctx.moveTo(qw, qh - cq); ctx.lineTo(qw - cq * 0.78 + lt, qh - cq * 0.78 + lt * 2); ctx.lineTo(qw - cq, qh); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#FBF4E4"; ctx.beginPath(); ctx.moveTo(qw, qh - cq); ctx.lineTo(qw - cq * 0.82, qh - cq * 0.82); ctx.lineTo(qw - cq, qh); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(120,92,48,0.16)"; ctx.beginPath(); ctx.moveTo(qw, qh - cq); ctx.lineTo(qw - cq * 0.82, qh - cq * 0.82); ctx.lineTo(qw - cq * 0.5, qh - cq * 0.5); ctx.closePath(); ctx.fill();
      }
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

  // buku resep bergaya: terbuka dari sampul, pita pembatas, halaman berbalik, tiga slot bahan bernomor
  function bukuResep(ctx, x, y, size, opt = {}) {
    const W = size, H = W * 0.62, t = opt.t || 0, o = eio(clamp(opt.open == null ? 1 : opt.open)), title = opt.title == null ? "Resep Penipuan" : opt.title;
    const cov = opt.cover || "#7A5BD6", covD = dark(cov, 0.25), covL = lite(cov, 0.3), PG = "#FFF8EA", PGD = "#EADFC6", m = W * 0.022, nS = opt.slots || 3;
    const sx = x - W / 4 * (1 - o), top = y - H / 2, bot = y + H / 2, pw = W / 2;
    const fsT = Math.max(44, Math.round(opt.titleSize || W * 0.062)), fsH = Math.max(40, Math.round(W * 0.05)), fsN = Math.max(40, Math.round(W * 0.046));
    const pageTurn = opt.turn != null ? clamp(opt.turn) : (opt.page != null ? opt.page - Math.floor(opt.page) : 0);
    const out = { spine: [sx, y], slots: [], badges: [], w: W, h: H, top, bottom: bot };
    // halaman dengan tepi atas/bawah melengkung turun ke punggung buku
    const pagePath = (k, x0, w0) => { const ox = x0 + k * w0, dip = H * 0.025;
      ctx.moveTo(x0, top + dip); ctx.quadraticCurveTo(x0 + k * w0 * 0.25, top - H * 0.012, ox, top); ctx.lineTo(ox, bot); ctx.quadraticCurveTo(x0 + k * w0 * 0.25, bot + H * 0.006, x0, bot - dip * 0.4); ctx.closePath(); };
    const pageFill = (k, x0, w0, col = PG) => {
      for (let i = 3; i >= 1; i--) { ctx.fillStyle = i % 2 ? PGD : "#F7EEDB"; ctx.save(); ctx.translate(k * i * W * 0.004, i * W * 0.004); ctx.beginPath(); pagePath(k, x0, w0); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = col; ctx.beginPath(); pagePath(k, x0, w0); ctx.fill();
      ctx.save(); ctx.beginPath(); pagePath(k, x0, w0); ctx.clip();
      const g2 = ctx.createLinearGradient(x0, 0, x0 + k * w0 * 0.22, 0); g2.addColorStop(0, "rgba(120,92,48,0.28)"); g2.addColorStop(1, "rgba(120,92,48,0)"); ctx.fillStyle = g2; ctx.fillRect(Math.min(x0, x0 + k * w0), top - H, w0, H * 3);
      ctx.restore();
    };
    const lines = (x0, y0, w0, n, gap) => { ctx.fillStyle = "rgba(122,91,214,0.16)"; for (let i = 0; i < n; i++) { ctx.beginPath(); rrp(ctx, x0, y0 + i * gap, w0 * (i === n - 1 ? 0.6 : 1), Math.max(3, H * 0.012), H * 0.006); ctx.fill(); } };
    const coverFront = (x0, w0) => {   // sampul depan dengan judul
      solid(ctx, () => rrp(ctx, x0, top - m, w0 + m, H + 2 * m, m * 1.4), cov, W * 0.008, 0.25, 0.22);
      ctx.fillStyle = covD; ctx.fillRect(x0, top - m, W * 0.035, H + 2 * m);
      ctx.strokeStyle = A_(covL, 0.8); ctx.lineWidth = Math.max(3, W * 0.005); ctx.beginPath(); rrp(ctx, x0 + w0 * 0.12, top + H * 0.07, w0 * 0.78, H * 0.86, W * 0.02); ctx.stroke();
      const tl = wrapLines(ctx, title, fsT, w0 * 0.66); font(ctx, fsT, 900);
      tl.forEach((ln, i) => say(ctx, ln, x0 + w0 * 0.51, y - H * 0.1 + (i - (tl.length - 1) / 2) * fsT * 1.15, fsT, "#FFF4E2", { w: 900 }));
      ctx.save(); ctx.translate(x0 + w0 * 0.51, y + H * 0.22); ctx.fillStyle = P.amber; ctx.beginPath(); rrp(ctx, -W * 0.06, -W * 0.02, W * 0.12, W * 0.055, W * 0.015); ctx.fill(); ctx.fillRect(-W * 0.075, -W * 0.028, W * 0.15, W * 0.014);
      for (const k of [-1, 0, 1]) { ctx.strokeStyle = A_("#FFF4E2", 0.8); ctx.lineWidth = W * 0.007; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(k * W * 0.025, -W * 0.04); ctx.quadraticCurveTo(k * W * 0.025 + W * 0.012, -W * 0.06, k * W * 0.025, -W * 0.08 - Math.sin(t * 3 + k) * W * 0.004); ctx.stroke(); }
      ctx.restore();
    };
    const leftContent = () => {
      const tl = wrapLines(ctx, title, fsT, pw * 0.78);
      tl.forEach((ln, i) => say(ctx, ln, sx - pw * 0.5, top + H * 0.17 + i * fsT * 1.12, fsT, cov, { w: 900 }));
      const ly = top + H * 0.17 + (tl.length - 1) * fsT * 1.12 + fsT * 0.75;
      ctx.strokeStyle = P.pink; ctx.lineWidth = Math.max(3, W * 0.006); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sx - pw * 0.75, ly); for (let i = 0; i <= 12; i++) ctx.lineTo(sx - pw * 0.75 + pw * 0.5 * i / 12, ly + Math.sin(i * 1.4) * W * 0.004); ctx.stroke();
      panci(ctx, sx - pw * 0.5, bot - H * 0.12, pw * 0.36, { t, steam: 0.85, steamShape: "!", form: 1, steamH: H * 0.27, color: P.pink, glowCol: P.amber, steamCol: "#B7A9EE" });
      lines(sx - pw * 0.84, ly + H * 0.07, pw * 0.68, 2, H * 0.05);
    };
    const rightContent = () => {
      say(ctx, opt.header || "Bahan:", sx + pw * 0.1, top + H * 0.12, fsH, cov, { w: 900, align: "left" });
      const y0 = top + H * 0.24, rowH = (H * 0.72) / nS;
      for (let i = 0; i < nS; i++) {
        const cy = y0 + rowH * (i + 0.5), bx = sx + pw * 0.16, slx = sx + pw * 0.62, act = opt.active === i, sc = (opt.slotColors && opt.slotColors[i]) || cov;
        out.badges.push([bx, cy]); out.slots.push([slx, cy]);
        if (act) D.glow(ctx, slx, cy, rowH * 0.9, sc, 0.45 * (0.75 + 0.25 * Math.sin(t * 5)));
        ctx.fillStyle = sc; ctx.beginPath(); ctx.arc(bx, cy, fsN * 0.72, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.beginPath(); ctx.arc(bx - fsN * 0.15, cy - fsN * 0.2, fsN * 0.3, 0, TAU); ctx.fill();
        say(ctx, String(i + 1), bx, cy + fsN * 0.04, fsN, "#FFFFFF", { w: 900 });
        const lab = opt.labels && opt.labels[i];
        if (lab) say(ctx, lab, sx + pw * 0.3, cy + fsN * 0.04, Math.max(40, fsN), INK, { w: 800, align: "left" });
        else { // tempat kosong bergaris putus-putus untuk toples yang akan muncul
          ctx.setLineDash([W * 0.014, W * 0.01]); ctx.lineDashOffset = -t * W * 0.02; ctx.strokeStyle = A_(sc, act ? 0.95 : 0.55); ctx.lineWidth = Math.max(3, W * 0.005);
          ctx.beginPath(); rrp(ctx, slx - pw * 0.3, cy - rowH * 0.36, pw * 0.6, rowH * 0.72, rowH * 0.18); ctx.stroke(); ctx.setLineDash([]);
          lines(slx - pw * 0.2, cy - H * 0.012, pw * 0.4, 1, 0);
        }
      }
    };
    ctx.save();
    shadow(ctx, x, y + H / 2 + H * 0.06, (W / 2) * (0.6 + 0.5 * o), H * 0.05, 0.25);
    // sampul belakang (kanan) + punggung
    ctx.fillStyle = covD; ctx.beginPath(); rrp(ctx, sx - W * 0.012, top - m, pw + m + W * 0.012, H + 2 * m, m * 1.4); ctx.fill();
    if (o > 0.5) { ctx.fillStyle = covD; ctx.beginPath(); rrp(ctx, sx - (pw + m) * Math.min(1, -Math.cos(PI * o)), top - m, (pw + m) * Math.min(1, -Math.cos(PI * o)) + W * 0.012, H + 2 * m, m * 1.4); ctx.fill(); }
    // halaman kanan (tetap)
    pageFill(1, sx, pw);
    // halaman kanan bergoyang sedikit di sudut luar
    ctx.save(); ctx.beginPath(); pagePath(1, sx, pw); ctx.clip(); if (o > 0.6) { ctx.globalAlpha *= clamp((o - 0.6) / 0.4); rightContent(); } ctx.restore();
    // pita pembatas
    const rbx = sx + pw * 0.06, sway = Math.sin(t * 1.7) * W * 0.008;
    ctx.fillStyle = P.pink; ctx.fillRect(rbx - W * 0.012, top - m, W * 0.024, H * 0.12);
    ctx.beginPath(); ctx.moveTo(rbx - W * 0.012, bot); ctx.lineTo(rbx + W * 0.012, bot); ctx.lineTo(rbx + W * 0.012 + sway, bot + H * 0.16); ctx.lineTo(rbx + sway, bot + H * 0.13); ctx.lineTo(rbx - W * 0.012 + sway, bot + H * 0.16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = dark(P.pink, 0.2); ctx.fillRect(rbx - W * 0.012, bot, W * 0.024, H * 0.012);
    // sampul depan + halaman kiri berputar pada punggung
    const c = Math.cos(PI * o);
    if (c > 0.02) { ctx.save(); ctx.translate(sx, 0); ctx.scale(c, 1); ctx.translate(-sx, 0); coverFront(sx, pw); ctx.restore(); }
    else if (c < -0.02) { ctx.save(); ctx.translate(sx, 0); ctx.scale(-c, 1); ctx.translate(-sx, 0);
      ctx.fillStyle = covD; ctx.beginPath(); rrp(ctx, sx - pw - m, top - m, pw + m + W * 0.012, H + 2 * m, m * 1.4); ctx.fill();
      pageFill(-1, sx, pw);
      ctx.save(); ctx.beginPath(); pagePath(-1, sx, pw); ctx.clip(); if (o > 0.6) { ctx.globalAlpha *= clamp((o - 0.6) / 0.4); leftContent(); } ctx.restore();
      ctx.restore(); }
    else { ctx.fillStyle = cov; ctx.fillRect(sx - W * 0.008, top - m, W * 0.016, H + 2 * m); }
    // punggung buku (lipatan tengah)
    ctx.fillStyle = "rgba(120,92,48,0.25)"; ctx.fillRect(sx - 1.5, top + H * 0.02, 3, H * 0.97);
    // halaman yang sedang berbalik (dekoratif)
    if (pageTurn > 0 && pageTurn < 1 && o > 0.95) {
      const u = eio(pageTurn), c3 = Math.cos(PI * u), k = c3 >= 0 ? 1 : -1, ww = pw * Math.abs(c3), bulge = Math.sin(PI * u) * H * 0.05;
      ctx.save(); ctx.beginPath(); ctx.moveTo(sx, top + H * 0.025); ctx.quadraticCurveTo(sx + k * ww * 0.5, top - bulge, sx + k * ww, top - bulge * 0.6); ctx.lineTo(sx + k * ww, bot - bulge * 0.6); ctx.quadraticCurveTo(sx + k * ww * 0.5, bot - bulge * 0.2, sx, bot - H * 0.01); ctx.closePath();
      ctx.fillStyle = k > 0 ? PG : "#FBF3E2"; ctx.fill(); ctx.clip();
      const g3 = ctx.createLinearGradient(sx, 0, sx + k * ww, 0); g3.addColorStop(0, "rgba(120,92,48,0.3)"); g3.addColorStop(0.6, "rgba(120,92,48,0.06)"); g3.addColorStop(1, `rgba(255,255,255,${0.3 * Math.sin(PI * u)})`); ctx.fillStyle = g3; ctx.fillRect(sx - pw, top - H, pw * 2, H * 3);
      lines(Math.min(sx + k * ww * 0.15, sx + k * ww * 0.85), top + H * 0.3, ww * 0.7, 5, H * 0.1);
      ctx.restore();
    }
    ctx.restore();
    if (!out.slots.length) { const y0 = top + H * 0.24, rowH = (H * 0.72) / nS; for (let i = 0; i < nS; i++) { out.badges.push([sx + pw * 0.16, y0 + rowH * (i + 0.5)]); out.slots.push([sx + pw * 0.62, y0 + rowH * (i + 0.5)]); } }
    return out;
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
      ctx.fillStyle = "rgba(16,20,64,0.18)"; ctx.beginPath(); rrp(ctx, -lw / 2 + 3, ly + 5, lw, lh, lh / 2); ctx.fill();
      ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); rrp(ctx, -lw / 2, ly, lw, lh, lh / 2); ctx.fill();
      say(ctx, s, 0, ly + lh * 0.53, fs, INK, { w: 900 }); }
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
    solid(ctx, () => rrp(ctx, x - w / 2, top, w, ph, w * 0.08), opt.panel || "#4459B5", w * 0.015, 0.16, 0.2);
    // jalur
    ctx.lineCap = "round"; ctx.lineWidth = sw; ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.beginPath(); ctx.arc(x, py, R, PI, TAU); ctx.stroke();
    const N = 48; ctx.lineCap = "butt";
    for (let i = 0; i < N; i++) { const u0 = i / N, u1 = (i + 1.06) / N; if (u0 >= v) continue; ctx.strokeStyle = lerpCol(u0); ctx.beginPath(); ctx.arc(x, py, R, PI + u0 * PI, PI + Math.min(1, u1) * PI); ctx.stroke(); }
    ctx.lineCap = "round"; if (v > 0.005) { ctx.fillStyle = lerpCol(0); ctx.beginPath(); ctx.arc(x - R, py, sw / 2, 0, TAU); ctx.fill(); }
    // skala
    ctx.strokeStyle = "rgba(242,246,255,0.55)"; ctx.lineWidth = Math.max(2, w * 0.007);
    for (let i = 0; i <= 10; i++) { const a = PI + i / 10 * PI, r0 = R - sw / 2 - w * (i % 5 ? 0.02 : 0.04), r1 = R - sw / 2 - w * 0.005; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, py + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, py + Math.sin(a) * r1); ctx.stroke(); }
    // jarum (sedikit bergetar)
    const va = PI + clamp(v + Math.sin(t * 9) * 0.004 + Math.sin(t * 2.3) * 0.003) * PI;
    if (v > 0.01) D.glow(ctx, x + Math.cos(va) * R, py + Math.sin(va) * R, sw * 1.6, lerpCol(v), 0.6);
    ctx.save(); ctx.translate(x, py); ctx.rotate(va);
    ctx.fillStyle = "#F2F6FF"; ctx.beginPath(); ctx.moveTo(0, -w * 0.022); ctx.lineTo(R * 0.92, -w * 0.005); ctx.lineTo(R * 0.92, w * 0.005); ctx.lineTo(0, w * 0.022); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#F2F6FF"; ctx.beginPath(); ctx.arc(x, py, w * 0.04, 0, TAU); ctx.fill(); ctx.fillStyle = "#4459B5"; ctx.beginPath(); ctx.arc(x, py, w * 0.016, 0, TAU); ctx.fill();
    // angka
    say(ctx, `${Math.round(v * 100)}%`, x, py + ns * 0.72, ns, opt.numColor || lerpCol(v), { w: 900 });
    if (label) say(ctx, label, x, py + ns * 1.15 + ls * 0.7, ls, "#E4EAFF", { w: 700 });
    ctx.restore();
    return { top, bottom: top + ph };
  }

  // bendera berkibar: tepi atas/bawah/ujung bergelombang sinus, pita lipatan gelap di lembah gelombang
  function flagShape(ctx, x0, y0, fw, fh, t) {
    const N = 18, amp = fh * 0.16, wv = u => Math.sin(u * 6.2 - t * 5) * amp * u, xs = u => x0 + u * fw * (1 - 0.05 * Math.abs(Math.sin(t * 2)));
    const outline = () => { ctx.moveTo(x0, y0);
      for (let i = 1; i <= N; i++) { const u = i / N; ctx.lineTo(xs(u), y0 + wv(u)); }
      const ex = xs(1); for (let i = 1; i <= 8; i++) { const v = i / 8; ctx.lineTo(ex + Math.sin(v * PI * 2 - t * 6) * fw * 0.035, y0 + wv(1) + v * fh); }
      for (let i = N; i >= 0; i--) { const u = i / N; ctx.lineTo(xs(u), y0 + wv(u) + fh); }
      ctx.closePath(); };
    ctx.save(); ctx.fillStyle = "#FF5A5F"; ctx.beginPath(); outline(); ctx.fill(); ctx.clip();
    for (let i = 0; i < N; i++) {   // pita bayangan menurut kemiringan gelombang
      const u0 = i / N, u1 = (i + 1) / N, sl = (wv(u1) - wv(u0)) / (fw / N);
      if (Math.abs(sl) < 0.03) continue;
      ctx.fillStyle = sl > 0 ? `rgba(150,20,60,${clamp(sl * 1.6) * 0.45})` : `rgba(255,190,190,${clamp(-sl * 1.6) * 0.35})`;
      ctx.fillRect(xs(u0), y0 - fh, xs(u1) - xs(u0) + 1, fh * 3);
    }
    ctx.fillStyle = "rgba(150,20,60,0.25)"; ctx.fillRect(x0, y0 - fh, fw * 0.05, fh * 3);   // pita lipatan di tiang
    ctx.restore();
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
  // gagang telepon melengkung (bentuk "C" terbuka ke kanan, diputar rot)
  function handset(ctx, r, col, rot = 0) {
    ctx.save(); ctx.rotate(rot); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = "round";
    const R = r * 0.62, cx = r * 0.28, a0 = PI * 0.66, a1 = PI * 1.34;
    ctx.lineWidth = r * 0.3; ctx.beginPath(); ctx.arc(cx, 0, R, a0, a1); ctx.stroke();
    for (const a of [a0, a1]) { const px = cx + Math.cos(a) * R, py = Math.sin(a) * R; ctx.save(); ctx.translate(px, py); ctx.rotate(a + PI / 2);
      ctx.beginPath(); rrp(ctx, -r * 0.24, -r * 0.2 + (a === a0 ? 0 : 0), r * 0.48, r * 0.34, r * 0.13); ctx.fill(); ctx.restore(); }
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
    } else if (name === "larangan") {   // pasangan keluarga (besar + kecil) dengan satu garis coret
      ctx.beginPath(); ctx.arc(-ir * 0.32, -ir * 0.32, ir * 0.27, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-ir * 0.32, ir * 0.62, ir * 0.42, ir * 0.55, 0, PI, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(ir * 0.42, -ir * 0.02, ir * 0.2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(ir * 0.42, ir * 0.62, ir * 0.32, ir * 0.4, 0, PI, TAU); ctx.fill();
      ctx.lineWidth = ir * 0.34; ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(-ir * 0.8, -ir * 0.8); ctx.lineTo(ir * 0.8, ir * 0.8); ctx.stroke();
      ctx.lineWidth = ir * 0.17; ctx.strokeStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-ir * 0.8, -ir * 0.8); ctx.lineTo(ir * 0.8, ir * 0.8); ctx.stroke();
    } else if (name === "teleponBalik") {
      ctx.save(); ctx.translate(-ir * 0.2, ir * 0.2); handset(ctx, ir * 0.78, W_, PI * 0.25); ctx.restore();
      ctx.lineWidth = ir * 0.15; ctx.beginPath(); ctx.arc(ir * 0.18, -ir * 0.2, ir * 0.62, -PI * 0.95, -PI * 0.05); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ir * 0.8, -ir * 0.48); ctx.lineTo(ir * 0.8, -ir * 0.12); ctx.lineTo(ir * 0.48, -ir * 0.2); ctx.closePath(); ctx.fill();
    } else if (name === "putus") {
      // gagang tergantung (terbuka ke bawah), terbelah zigzag di tengah
      for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * ir * 0.09, k * ir * 0.04); ctx.beginPath(); ctx.rect(k < 0 ? -ir * 2 : 0, -ir * 2, ir * 2, ir * 4); ctx.clip(); handset(ctx, ir * 0.95, W_, PI * 0.5); ctx.restore(); }
      ctx.lineWidth = ir * 0.16; ctx.strokeStyle = col; ctx.lineJoin = "miter"; ctx.beginPath(); ctx.moveTo(-ir * 0.06, -ir * 0.9); ctx.lineTo(ir * 0.12, -ir * 0.55); ctx.lineTo(-ir * 0.12, -ir * 0.3); ctx.lineTo(ir * 0.08, ir * 0.05); ctx.stroke();
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
    const t = opt.t || 0, u = opt.u == null ? 1 : clamp(opt.u), su = opt.su == null ? 1 : clamp(opt.su), state = opt.state || "none";
    let fs = Math.max(44, opt.textSize || 46), w = size;
    const geo = () => { const baseH = Math.max(opt.h || 0, fs * 2.3), ir = baseH * 0.36, sr = baseH * 0.3, textX = baseH * 0.2 + ir * 2 + fs * 0.45; return { baseH, ir, sr, textX, maxW: w - textX - sr * 2 - fs * 0.7 }; };
    // kata terpanjang harus muat: kecilkan huruf (tidak di bawah 44 px), bila masih tidak muat, baris dilebarkan
    let G = geo(); font(ctx, fs, 700); const longest = Math.max(0, ...(opt.text || "").split(/\s+/).map(s => ctx.measureText(s).width));
    if (longest > G.maxW) { fs = Math.max(44, Math.floor(fs * G.maxW / longest)); G = geo(); font(ctx, fs, 700); const l2 = Math.max(0, ...(opt.text || "").split(/\s+/).map(s => ctx.measureText(s).width)); if (l2 > G.maxW) { w += l2 - G.maxW + 2; G = geo(); } }
    const { baseH, ir, sr, textX, maxW } = G, lines = wrapLines(ctx, opt.text || "", fs, maxW);
    const h = Math.max(baseH, lines.length * fs * 1.22 + fs * 0.9);
    if (u <= 0) return h;
    ctx.save(); ctx.globalAlpha *= eout(u); ctx.translate((1 - eout(u)) * -w * 0.08, 0);
    const flag = state === "flag" && su > 0;
    ctx.fillStyle = "rgba(16,20,64,0.22)"; ctx.beginPath(); rrp(ctx, x + 4, y + 8, w, h, h * 0.22); ctx.fill();
    solid(ctx, () => rrp(ctx, x, y, w, h, h * 0.22), opt.fill || "#4459B5", 4, 0.16, 0.2);
    if (flag) { ctx.fillStyle = A_(P.red, 0.16 * su); ctx.beginPath(); rrp(ctx, x, y, w, h, h * 0.22); ctx.fill(); ctx.fillStyle = A_(P.red, su); ctx.beginPath(); rrp(ctx, x, y + h * 0.18, h * 0.07, h * 0.64, h * 0.035); ctx.fill(); }
    if (state === "check" && su > 0) { ctx.fillStyle = A_(P.green, 0.12 * su); ctx.beginPath(); rrp(ctx, x, y, w, h, h * 0.22); ctx.fill(); }
    if (opt.icon) { if (typeof opt.icon === "function") opt.icon(ctx, x + baseH * 0.2 + ir, y + h / 2, ir); else ikon(ctx, opt.icon, x + baseH * 0.2 + ir, y + h / 2, ir, { t }); }
    font(ctx, fs, 700); ctx.fillStyle = opt.color || "#F2F6FF"; ctx.textBaseline = "middle";
    lines.forEach((ln, i) => ctx.fillText(ln, x + textX, y + h / 2 + (i - (lines.length - 1) / 2) * fs * 1.22 + fs * 0.03));
    ctx.textBaseline = "alphabetic";
    const sx = x + w - sr - fs * 0.35, sy = y + h / 2, pop = spring(su * 0.9, 12, 0.42);
    ctx.fillStyle = "rgba(255,255,255,0.14)"; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
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
  function cap(ctx, s, x, y, size = 22, col = "#E4EAFF") { say(ctx, s, x, y, size, col, { w: 700 }); }
  function sidikJari(ctx, x, y, size, t = 0) {   // kartu sidik jari kecil (contoh prop untuk hold:'samping')
    const w = size * 0.8, h = size;
    ctx.save(); ctx.fillStyle = "rgba(16,20,64,0.2)"; ctx.beginPath(); rrp(ctx, x - w / 2 + 3, y - h / 2 + 4, w, h, size * 0.1); ctx.fill();
    ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); rrp(ctx, x - w / 2, y - h / 2, w, h, size * 0.1); ctx.fill();
    ctx.strokeStyle = P.violet || "#7A5BD6"; ctx.lineWidth = Math.max(2, size * 0.035); ctx.lineCap = "round";
    for (let i = 0; i < 5; i++) { const r = size * (0.07 + i * 0.065); ctx.beginPath(); ctx.ellipse(x, y + size * 0.05, r * 0.8, r, 0, PI * (1.05 + i * 0.04), PI * (2.0 + 0.1 * Math.sin(i))); ctx.stroke(); }
    ctx.restore();
  }
  function showcase(ctx, t) {
    const W = 1920, HH = 1080, cyc = (t % 5.1) / 3.4;   // 0, .5, 1 pada t = 0, 1.7, 3.4
    const g0 = ctx.createLinearGradient(0, 0, 0, HH); g0.addColorStop(0, "#3A4C98"); g0.addColorStop(1, "#5466B2"); ctx.fillStyle = g0; ctx.fillRect(0, 0, W, HH);
    D.glow(ctx, 1500, 120, 500, P.warm, 0.12);
    say(ctx, "K.kit.bipkit", 32, 32, 34, "#FFFFFF", { align: "left", w: 900 });
    say(ctx, "pose (baris 1) · properti (baris 2–3) · t = " + t.toFixed(1), 270, 32, 22, "#C9D3F2", { align: "left", w: 700 });
    for (const [fy, fh] of [[328, 34], [700, 30]]) { ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(0, fy, W, fh); }
    // ---- baris 1: pose (s = 112, lantai y = 328) ----
    const S = 112, FL = 328;
    const poses = [["kacaPembesar", "kacaPembesar"], ["diam", "diam · wave"], ["bisik", "bisik"], ["jalan", "jalan"], ["kaget", "kaget"], ["pegang", "pegang"], ["pegangS", "hold samping"], ["tunjuk", "tunjuk"]];
    poses.forEach(([p, label], i) => {
      const cx = 105 + i * 168; let bx = cx; const o = { pose: p === "pegangS" ? "pegang" : p, t, seed: i };
      if (p === "diam") o.wave = t;
      if (p === "jalan") { o.dir = 1; bx = cx - 12 + Math.sin(t * 0.8) * 12; }
      if (p === "tunjuk") { bx = cx - 15; o.target = [cx + 55, 120]; ikon(ctx, "tanya", cx + 55, 120, 26, { t }); }
      if (p === "kaget") o.k = (t % 2.4);
      if (p === "bisik") { o.dir = 1; bx = cx - 22; }
      if (p === "pegang") o.prop = (c, px, py, ss) => gembok(c, px, py + ss * 0.03, ss * 0.3, { t, locked: 1 });
      if (p === "pegangS") { bx = cx - 38; o.hold = "samping"; o.propSize = 0.5; o.prop = (c, px, py, ss) => sidikJari(c, px, py, ss * 0.5, t); }
      if (p === "kacaPembesar") { bx = cx - 30; const fx = cx + 50, fy = FL - 52; sidikJari(ctx, fx, fy, 44, t);
        o.target = [fx, fy]; o.glass = 0.5; o.content = (c, lx, ly, r) => { c.fillStyle = "#FFF6E6"; c.fillRect(lx - r, ly - r, 2 * r, 2 * r); c.strokeStyle = "#7A5BD6"; c.lineWidth = 4; for (let j = 0; j < 5; j++) { c.beginPath(); c.arc(fx, fy + 4, 6 + j * 8, PI * 1.05, PI * 1.95 + j * 0.15); c.stroke(); } }; }
      draw(ctx, bx, FL - S * 0.5, S, o);
      cap(ctx, label, cx, FL + 17, 20);
    });
    // tekan: Bip berdiri di lantai yang sama di antara dua tombol; jari ragu di atas "Transfer", lalu menekan "Tunggu"
    const bT = tombol(ctx, 1468, FL - 52, 196, { label: "Transfer", color: P.pink, blink: 1, t });
    const pr = clamp(cyc * 2.2 - 1.2), mv = eio(clamp(cyc * 2.4 - 0.5));
    const bW = tombol(ctx, 1818, FL - 52, 168, { label: "Tunggu", color: P.teal, press: pr, t });
    const tgt = [lerp(bT.top[0] + 50, bW.top[0], mv), lerp(bT.top[1], bW.top[1], mv)];
    draw(ctx, 1650, FL - 70, 140, { pose: "tekan", t, target: tgt, press: mv < 1 ? 0 : pr, mood: pr > 0.8 ? "happy" : "think", seed: 9 });
    cap(ctx, "tekan + tombol: ragu di Transfer, lalu tekan Tunggu", 1640, FL + 17, 20);
    // ---- baris 2 (lantai y = 690) ----
    const F2 = 690;
    const bk = bukuResep(ctx, 290, 530, 520, { open: clamp(cyc * 1.6), page: cyc > 0.62 && cyc < 1 ? (cyc - 0.62) / 0.38 : 0, t, active: Math.min(2, Math.floor(cyc * 3)), slotColors: [P.pink, "#9584FF", P.amber] });
    say(ctx, "bukuResep · open, page, slots", 335, F2 + 25, 20, "#E4EAFF", { w: 700, align: "left" });
    toples(ctx, 655, F2 - 4, 190, { label: "panik", color: P.pink, fill: 0.2 + 0.6 * cyc, t, seed: 1 });
    toples(ctx, 910, F2 - 4, 190, { label: "terburu-buru", color: P.amber, fill: 0.55, t, seed: 2, lidColor: "#FF8A5B" });
    cap(ctx, "toples · label, fill", 800, F2 + 25, 20);
    const pc = panci(ctx, 1270, F2 - 22, 190, { t, steamShape: "!", form: clamp(cyc * 1.3 - 0.1), steamH: 160, fire: 1, liquid: P.amber });
    toples(ctx, 1135, 480, 110, { color: P.teal, fill: 0.65, tilt: 1.25 - 0.5 * cyc, pour: clamp(1.2 - cyc), pourTo: pc.mouth[1] + 6, t, seed: 3, lid: false });
    cap(ctx, "panci · toples pour", 1250, F2 + 25, 20);
    kertasLipat(ctx, 1590, 540, 290, { word: "Mangga", fold: clamp(cyc * 1.6 - 0.5), write: clamp(0.55 + cyc * 2), pencil: true, t });
    cap(ctx, "kertasLipat · write, fold", 1590, F2 + 25, 20);
    IKON.forEach((n, i) => { const ix = 1790 + (i % 2) * 86, iy = 420 + Math.floor(i / 2) * 72; ikon(ctx, n, ix, iy, 23, { t }); say(ctx, n, ix, iy + 34, 14, "#E4EAFF", { w: 700 }); });
    cap(ctx, "ikon()", 1833, F2 + 25, 20);
    // ---- baris 3 ----
    stopwatch(ctx, 140, 810, 116, { seconds: 3 * clamp(cyc * 1.3), run: cyc < 0.75, t });
    cap(ctx, "stopwatch", 140, 1000, 20);
    meteran(ctx, 395, 905, 225, { value: 85 * eio(clamp(cyc * 1.25)), t });
    cap(ctx, "meteran", 395, 1055, 20);
    benderaMerah(ctx, 548, 1040, 165, { raise: clamp(cyc * 2), t });
    benderaMerah(ctx, 628, 790, 56, { icon: true, t });
    cap(ctx, "benderaMerah", 575, 1062, 20);
    let ry = 748;
    ry += daftarPeriksa(ctx, 672, ry, 560, { textSize: 44, text: "Nomor baru, HP rusak", icon: "hpBaru", state: "flag", su: clamp(cyc * 2), t }) + 10;
    daftarPeriksa(ctx, 672, ry, 560, { textSize: 44, text: "Telepon balik", icon: "teleponBalik", state: cyc < 0.75 ? "check" : "cross", u: clamp(cyc * 2 - 0.2), su: clamp(cyc * 2 - 0.8), t });
    cap(ctx, "daftarPeriksa · flag / check / cross", 952, 1062, 20);
    gembok(ctx, 1298, 812, 86, { locked: clamp(cyc * 1.2), flash: cyc >= 0.84 ? 0.8 : 0, t });
    seru(ctx, 1298, 905, 56, { t });
    kacaPembesarW(ctx, 1306, 1000, 64, { t, angle: 2.4, content: (c, x0, y0, r) => { c.fillStyle = P.amber; c.beginPath(); c.arc(x0 + 6, y0 + 4, r * 0.45, 0, TAU); c.fill(); } });
    cap(ctx, "gembok · seru · kaca", 1298, 1062, 20);
    mapBerkas(ctx, 1812, 1015, 170, { n: 5 + Math.round(cyc * 4), grey: 3, drop: clamp((t * 0.9) % 1.4), t, seed: 2, labelSide: -1 });
    cap(ctx, "mapBerkas · n, grey, drop", 1640, 1062, 20);
  }

  K.kit.bipkit = { draw, kacaPembesar: kacaPembesarW, toples, panci, bukuResep, mapBerkas, gembok, kertasLipat, stopwatch, meteran, benderaMerah, daftarPeriksa, tombol, ikon, seru, IKON, POSES: Object.keys(DEF_MOOD), showcase };
})(typeof window !== "undefined" ? window : globalThis);
