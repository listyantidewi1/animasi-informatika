/* D05 — perangkat bersama: dunia "Pasar Juragan" (satu metafora sepanjang video) dan pembantu gambar.
   Koordinat dunia = layar pada zoom 1. Lantai pelataran y = FLOOR (850).
   pasar(ctx,t,o)  latar lengkap: langit, gedung pasar, gapura, lapak, gerobak es teh; o.suram 0..1 (makin kusam), o.pagi 0..1;
   spanduk(ctx,t,u) lapisan spanduk iklan (u 0..1 = berapa banyak yang sudah turun), palang(ctx,t,u,kunci) palang + gembok di gapura;
   juragan(...) siluet bertopi tanpa wajah, buSari/raka (tokoh rekaan), pengunjung(...), jaring(...) graf efek jaringan, gerobak(...) dengan 4 rem.
   Orang sungguhan tidak digambar; tidak ada logo/warna merek. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, P = D.P;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const U = K.d05 = {};
  const FLOOR = 850;
  U.FLOOR = FLOOR;

  // ---------- pembantu umum ----------
  const ramp = U.ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  U.pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55)) });
  U.camT = (ctx, c) => { ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); };
  // "napas" kamera: zoom dan geser sangat pelan dari waktu absolut (menyambung antarbeat), hanya untuk lapisan dunia; label D.post tidak ikut
  U.napas = (ctx, t) => { const z = 1.025 + 0.012 * Math.sin(t * TAU / 16), dx = 6 * Math.sin(t * 0.37), dy = 3.5 * Math.cos(t * 0.29); U._nap = { z, dx, dy };
    ctx.translate(W / 2 + dx, HH / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -HH / 2); };
  U.toS = (c, x, y) => { const N = U._nap || { z: 1, dx: 0, dy: 0 }, sx = (x - c.x) * c.z + W / 2, sy = (y - c.y) * c.z + HH / 2;
    return [(sx - W / 2) * N.z + W / 2 + N.dx, (sy - HH / 2) * N.z + HH / 2 + N.dy]; };
  U.beatOf = (TL, id) => TL.beats.find(x => x.id === id);
  const txt = U.txt = (ctx, s, x, y, size, opt = {}) => D.txt(ctx, s, x, y, size, opt);
  U.rb = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  U.grade = function (ctx, a, col = "#3B4690") { if (a <= 0.01) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, HH); ctx.restore(); };
  U.addLight = function (ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  };
  // label pil (layar) dengan muncul pegas; panggil di dalam D.post
  U.tag = function (ctx, s, x, y, a, opt = {}) {
    if (a <= 0.01) return; const sp = opt.sp == null ? 1 : opt.sp; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.translate(x, y); const k = lerp(0.82, 1, sp); ctx.scale(k, k); D.label(ctx, s, 0, 0, { size: opt.size || 48, col: opt.col || P.amber, color: opt.color }); ctx.restore();
  };
  // judul besar di tengah atas (pertanyaan, angka kunci)
  U.judul = function (ctx, s, x, y, size, a, opt = {}) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= clamp(a); const k = lerp(0.9, 1, opt.sp == null ? 1 : opt.sp);
    ctx.translate(x, y); ctx.scale(k, k);
    ctx.font = `900 ${size}px ${FONT}`; const w = Math.min(opt.fit || 1700, ctx.measureText(s).width) + size * 0.9, h = size * 1.55;
    if (opt.panel !== false) { ctx.fillStyle = opt.fill || "rgba(10,18,52,0.88)"; RR(ctx, -w / 2, -h * 0.68, w, h, h * 0.3); ctx.fill(); ctx.strokeStyle = D.hexA(opt.col || P.amber, 0.9); ctx.lineWidth = 4; ctx.stroke(); }
    txt(ctx, s, 0, size * 0.1, size, { align: "center", weight: 900, color: opt.color || P.ink, fit: opt.fit || 1700 }); ctx.restore();
  };
  // teks "jalan" (bar abu) untuk isi layar yang tidak perlu dibaca
  U.bars = function (ctx, x, y, w, h, n, col = "rgba(40,50,100,0.25)", seed = 1) {
    const r = D.rng(seed); ctx.fillStyle = col; for (let i = 0; i < n; i++) { const ww = w * (i === n - 1 ? 0.45 + r() * 0.2 : 0.75 + r() * 0.25); RR(ctx, x, y + i * h * 1.9, ww, h, h / 2); ctx.fill(); }
  };

  // ---------- palet pasar ----------
  const AWN = ["#FF6F61", "#FFB547", "#3FD8C8", "#5AA9FF", "#9584FF", "#5BD68A", "#FF8FB1"];
  U.AWN = AWN;
  const mix = (a, b, k) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = (s) => Math.round(lerp(pa >> s & 255, pb >> s & 255, k));
    return `rgb(${c(16)},${c(8)},${c(0)})`; };
  U.mix = mix;

  // ---------- es teh ----------
  U.esTeh = function (ctx, x, y, s, o = {}) {   // (x,y) dasar gelas; s tinggi gelas
    ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
    const w0 = s * 0.42, w1 = s * 0.6;
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.moveTo(-w0 / 2, 0); ctx.lineTo(w0 / 2, 0); ctx.lineTo(w1 / 2, -s); ctx.lineTo(-w1 / 2, -s); ctx.closePath(); ctx.fill();
    const lv = o.isi == null ? 0.8 : o.isi; const wl = lerp(w0, w1, lv);
    const gr = ctx.createLinearGradient(0, -s * lv, 0, 0); gr.addColorStop(0, "#E39A4E"); gr.addColorStop(1, "#B8642A");
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(-w0 / 2 + 2, -2); ctx.lineTo(w0 / 2 - 2, -2); ctx.lineTo(wl / 2 - 2, -s * lv); ctx.lineTo(-wl / 2 + 2, -s * lv); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(235,248,255,0.85)"; [[-0.1, 0.62], [0.08, 0.5], [-0.02, 0.34]].forEach(([dx, dy], i) => { RR(ctx, dx * s - s * 0.08, -s * dy - s * 0.08, s * 0.16, s * 0.15, s * 0.03); ctx.fill(); });
    ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = Math.max(1.5, s * 0.03); ctx.beginPath(); ctx.moveTo(-w0 / 2, 0); ctx.lineTo(-w1 / 2, -s); ctx.lineTo(w1 / 2, -s); ctx.lineTo(w0 / 2, 0); ctx.stroke();
    ctx.strokeStyle = o.sedotan || "#FF6F91"; ctx.lineWidth = Math.max(2, s * 0.07); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(s * 0.06, -s * 0.3); ctx.lineTo(s * 0.16, -s * 1.28); ctx.lineTo(s * 0.3, -s * 1.38); ctx.stroke();
    ctx.restore();
  };

  // ---------- lapak ----------
  // (x,y) = tengah bawah meja di lantai; w lebar. o: col (warna terpal), barang 'kue'|'buah'|'baju'|'sayur'|'sepatu', label, sponsor 0..1, tutup 0..1, t, kosong
  U.lapak = function (ctx, x, y, w, o = {}) {
    const t = o.t || 0, col = o.col || AWN[0], h = w * 1.25, top = y - h;
    ctx.save(); ctx.translate(x, 0);
    // tiang
    ctx.fillStyle = "#7A5236"; ctx.fillRect(-w / 2 + 6, top + 30, 12, h - 30); ctx.fillRect(w / 2 - 18, top + 30, 12, h - 30);
    // dinding belakang lapak
    ctx.fillStyle = "rgba(40,30,60,0.35)"; ctx.fillRect(-w / 2 + 18, top + 60, w - 36, h - 60 - w * 0.36);
    // barang di rak belakang
    const by = y - w * 0.36;
    if (!o.kosong) barang(ctx, o.barang || "kue", -w / 2 + 30, by - 4, w - 60, w * 0.5, t, o.seed || 1);
    // meja depan
    ctx.fillStyle = "#9A6A44"; ctx.fillRect(-w / 2, by, w, w * 0.36);
    ctx.fillStyle = "#B88456"; ctx.fillRect(-w / 2, by, w, 12);
    ctx.fillStyle = "rgba(0,0,0,0.12)"; for (let i = 1; i < 4; i++) ctx.fillRect(-w / 2 + i * w / 4 - 1, by + 14, 3, w * 0.36 - 14);
    // terpal bergelombang
    const n = Math.max(4, Math.round(w / 52)), sw = (w + 30) / n, aw = top + 50;
    for (let i = 0; i < n; i++) { ctx.fillStyle = i % 2 ? "#FFF3DE" : col; const x0 = -w / 2 - 15 + i * sw;
      ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x0 + sw, top); ctx.lineTo(x0 + sw, aw); ctx.arc(x0 + sw / 2, aw, sw / 2, 0, Math.PI); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fillRect(-w / 2 - 15, top, w + 30, 8);
    // rolling door
    const tp = clamp(o.tutup || 0);
    if (tp > 0) { const hh = (by + w * 0.36 - (top + 50)) * tp; ctx.fillStyle = "#8C93B8"; ctx.fillRect(-w / 2 + 4, top + 50, w - 8, hh);
      ctx.fillStyle = "rgba(40,45,90,0.35)"; for (let yy = top + 58; yy < top + 50 + hh; yy += 16) ctx.fillRect(-w / 2 + 4, yy, w - 8, 4);
      ctx.fillStyle = "#5C6390"; ctx.fillRect(-w / 2 + 4, top + 50 + hh - 10, w - 8, 10); }
    ctx.restore();
    // papan nama (teks ≥44)
    if (o.label) { const a = o.labelA == null ? 1 : o.labelA; if (a > 0.01) { ctx.save(); ctx.globalAlpha *= a; ctx.font = `900 46px ${FONT}`; const lw = ctx.measureText(o.label).width + 40;
      ctx.fillStyle = "#FFF6E6"; RR(ctx, x - lw / 2, top - 74, lw, 66, 14); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
      txt(ctx, o.label, x, top - 25, 46, { align: "center", weight: 900, color: "#2A2350" }); ctx.restore(); } }
    // pita "Bersponsor"
    const sp = clamp(o.sponsor || 0); if (sp > 0.01) sponsorTag(ctx, x, top + 110, sp, w);
    return { top, by, w, h };
  };
  function sponsorTag(ctx, x, y, a, w) {
    ctx.save(); ctx.globalAlpha *= clamp(a * 3); const k = lerp(0.6, 1, clamp(spring(a * 1.2, 10, 0.5)));
    ctx.translate(x, y); ctx.rotate(-0.06); ctx.scale(k, k);
    ctx.font = `900 44px ${FONT}`; const lw = ctx.measureText("Bersponsor").width + 36;
    ctx.fillStyle = "#FFD23F"; RR(ctx, -lw / 2, -34, lw, 62, 10); ctx.fill(); ctx.strokeStyle = "#2A2350"; ctx.lineWidth = 4; ctx.stroke();
    txt(ctx, "Bersponsor", 0, 12, 44, { align: "center", weight: 900, color: "#2A2350" }); ctx.restore();
  }
  U.sponsorTag = sponsorTag;
  function barang(ctx, jenis, x, y, w, h, t, seed) {
    const r = D.rng(seed * 31);
    if (jenis === "kue") { const n = Math.max(3, Math.floor(w / 48)); for (let row = 0; row < 2; row++) for (let i = 0; i < n - row; i++) {
      const cx = x + (i + 0.5 + row * 0.5) * w / n, cy = y - row * 40 - 14; const c = ["#F7C873", "#E98AA0", "#8B5A3C", "#F2E2C4", "#7FCF8E"][(i + row * 2 + seed) % 5];
      ctx.fillStyle = "#FFF3DE"; ctx.fillRect(cx - 20, cy + 6, 40, 8); ctx.fillStyle = c; RR(ctx, cx - 17, cy - 16, 34, 24, 8); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.fillRect(cx - 12, cy - 12, 24, 4); } }
    else if (jenis === "buah") { for (let i = 0; i < 14; i++) { const cx = x + 20 + r() * (w - 40), cy = y - 12 - r() * 50; ctx.fillStyle = ["#FF6F61", "#FFB547", "#5BD68A", "#FFD23F"][i % 4]; ctx.beginPath(); ctx.arc(cx, cy, 15, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.arc(cx - 5, cy - 5, 5, 0, TAU); ctx.fill(); } }
    else if (jenis === "baju") { const n = Math.max(3, Math.floor(w / 60)); ctx.strokeStyle = "#5A4030"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y - h * 0.95); ctx.lineTo(x + w, y - h * 0.95); ctx.stroke();
      for (let i = 0; i < n; i++) { const cx = x + (i + 0.5) * w / n, c = AWN[(i + seed) % AWN.length]; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(cx - 14, y - h * 0.95 + 4); ctx.lineTo(cx + 14, y - h * 0.95 + 4); ctx.lineTo(cx + 24, y - h * 0.95 + 22); ctx.lineTo(cx + 16, y - h * 0.95 + 28); ctx.lineTo(cx + 16, y - h * 0.3); ctx.lineTo(cx - 16, y - h * 0.3); ctx.lineTo(cx - 16, y - h * 0.95 + 28); ctx.lineTo(cx - 24, y - h * 0.95 + 22); ctx.closePath(); ctx.fill(); } }
    else if (jenis === "sayur") { for (let i = 0; i < 9; i++) { const cx = x + 24 + i * (w - 48) / 8, cy = y - 18 - (i % 2) * 22; ctx.fillStyle = ["#5BD68A", "#3FAE6A", "#FF8A3D"][i % 3]; ctx.beginPath(); ctx.ellipse(cx, cy, 20, 15, 0.3 * (i % 3 - 1), 0, TAU); ctx.fill(); } }
    else if (jenis === "sepatu") { for (let i = 0; i < 6; i++) { const cx = x + 30 + (i % 3) * (w - 60) / 2, cy = y - 16 - Math.floor(i / 3) * 44; ctx.fillStyle = AWN[(i + seed) % AWN.length]; RR(ctx, cx - 24, cy - 12, 48, 22, 10); ctx.fill(); ctx.fillStyle = "#FFF"; ctx.fillRect(cx - 24, cy + 6, 48, 5); } }
  }

  // ---------- gerobak es teh ----------
  U.gerobakEsTeh = function (ctx, x, y, s, o = {}) {   // (x,y) lantai di tengah; s = lebar
    const t = o.t || 0; ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(20,15,40,0.25)"; ctx.beginPath(); ctx.ellipse(0, 4, s * 0.55, s * 0.06, 0, 0, TAU); ctx.fill();
    // roda
    [-0.32, 0.32].forEach(k => { ctx.fillStyle = "#2A2350"; ctx.beginPath(); ctx.arc(k * s, -s * 0.09, s * 0.09, 0, TAU); ctx.fill(); ctx.fillStyle = "#8C93B8"; ctx.beginPath(); ctx.arc(k * s, -s * 0.09, s * 0.035, 0, TAU); ctx.fill(); });
    // badan
    ctx.fillStyle = "#3FA7B8"; RR(ctx, -s / 2, -s * 0.52, s, s * 0.38, 12); ctx.fill(); ctx.fillStyle = "#2E8394"; ctx.fillRect(-s / 2, -s * 0.2, s, s * 0.06);
    ctx.fillStyle = "#FFF3DE"; ctx.fillRect(-s / 2, -s * 0.52, s, 12);
    // galon teh
    ctx.fillStyle = "rgba(255,255,255,0.5)"; RR(ctx, -s * 0.38, -s * 0.9, s * 0.26, s * 0.38, 12); ctx.fill();
    const gr = ctx.createLinearGradient(0, -s * 0.8, 0, -s * 0.52); gr.addColorStop(0, "#E39A4E"); gr.addColorStop(1, "#B8642A");
    ctx.fillStyle = gr; RR(ctx, -s * 0.37, -s * (0.8 - 0.02 * Math.sin(t * 2)), s * 0.24, s * 0.27, 10); ctx.fill();
    ctx.fillStyle = "rgba(235,248,255,0.8)"; for (let i = 0; i < 5; i++) { RR(ctx, -s * 0.34 + (i % 3) * s * 0.07, -s * 0.72 + Math.floor(i / 3) * s * 0.08 + Math.sin(t * 1.5 + i) * 3, s * 0.05, s * 0.05, 4); ctx.fill(); }
    // gelas berjajar
    for (let i = 0; i < 5; i++) U.esTeh(ctx, -s * 0.02 + i * s * 0.1, -s * 0.52, s * 0.16, { isi: 0.75 });
    ctx.restore();
    // papan "ES TEH GRATIS" (copot 0..1: lepas lalu jatuh)
    const cp = clamp(o.copot || 0), sa = o.papan == null ? 1 : o.papan; if (sa <= 0.01 || cp >= 1) return;
    ctx.save(); ctx.globalAlpha *= sa * (1 - clamp((cp - 0.6) / 0.4));
    const px = x, py = y - s * 1.12 + eio(cp) * s * 0.9;
    ctx.translate(px, py); ctx.rotate(cp * 0.9);
    if (cp < 0.05) { ctx.strokeStyle = "#7A5236"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-s * 0.3, 40); ctx.lineTo(-s * 0.3, s * 0.2); ctx.moveTo(s * 0.3, 40); ctx.lineTo(s * 0.3, s * 0.2); ctx.stroke(); }
    ctx.font = `900 52px ${FONT}`; const lw = Math.max(s * 0.9, ctx.measureText("ES TEH GRATIS").width + 50);
    ctx.fillStyle = "#FFF6E6"; RR(ctx, -lw / 2, -40, lw, 84, 16); ctx.fill(); ctx.strokeStyle = "#FF6F61"; ctx.lineWidth = 6; ctx.stroke();
    txt(ctx, "ES TEH GRATIS", 0, 19, 52, { align: "center", weight: 900, color: "#C7413B" }); ctx.restore();
  };

  // ---------- Juragan: siluet bertopi, tanpa wajah ----------
  // (x,y) = tengah kaki; h tinggi; o.pose 'diam'|'bagi'|'garuk'|'tunjuk'|'angkat'|'jalan'|'ketuk'; o.dir 1 (hadap kanan) / -1; o.k (fase pose 0..1); o.t; o.kunci (cincin kunci)
  U.juragan = function (ctx, x, y, h, o = {}) {
    const t = o.t || 0, u = h / 100, dir = o.dir || 1, pose = o.pose || "diam", k = o.k == null ? 1 : clamp(o.k);
    const body = o.col || "#43397E", rim = o.rim || P.amber, bob = Math.sin(t * 2.1 + (o.seed || 0)) * u * 0.5;
    const A = {}; ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.fillStyle = "rgba(10,8,30,0.28)"; ctx.beginPath(); ctx.ellipse(0, 0, 24 * u, 4.5 * u, 0, 0, TAU); ctx.fill();
    // kaki
    const step = pose === "jalan" ? Math.sin(t * 6) : 0;
    ctx.strokeStyle = body; ctx.lineCap = "round"; ctx.lineWidth = 9 * u;
    ctx.beginPath(); ctx.moveTo(-5 * u, -36 * u); ctx.lineTo(-5 * u + step * 6 * u, -3 * u); ctx.moveTo(5 * u, -36 * u); ctx.lineTo(5 * u - step * 6 * u, -3 * u); ctx.stroke();
    ctx.fillStyle = "#1C1640"; RR(ctx, -12 * u + step * 6 * u, -5 * u, 13 * u, 5 * u, 2 * u); ctx.fill(); RR(ctx, 1 * u - step * 6 * u, -5 * u, 13 * u, 5 * u, 2 * u); ctx.fill();
    ctx.translate(0, bob);
    // badan (perut juragan)
    ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(-14 * u, -72 * u); ctx.quadraticCurveTo(-21 * u, -50 * u, -15 * u, -34 * u); ctx.lineTo(15 * u, -34 * u); ctx.quadraticCurveTo(25 * u, -52 * u, 14 * u, -72 * u); ctx.closePath(); ctx.fill();
    // ikat pinggang + cincin kunci emas
    ctx.fillStyle = "#1C1640"; ctx.fillRect(-17 * u, -40 * u, 35 * u, 4 * u);
    if (o.kunci !== false) { ctx.strokeStyle = "#FFC94D"; ctx.lineWidth = 1.6 * u; ctx.beginPath(); ctx.arc(10 * u, -35 * u, 3.4 * u, 0, TAU); ctx.stroke();
      ctx.fillStyle = "#FFC94D"; ctx.save(); ctx.translate(10 * u, -31 * u); ctx.rotate(0.2 + Math.sin(t * 2.1) * 0.12); ctx.fillRect(-0.9 * u, 0, 1.8 * u, 8 * u); ctx.fillRect(-0.9 * u, 6 * u, 3.5 * u, 1.5 * u); ctx.restore(); }
    // tepi cahaya
    ctx.strokeStyle = D.hexA(rim, 0.55); ctx.lineWidth = 1.6 * u; ctx.beginPath(); ctx.moveTo(14 * u, -71 * u); ctx.quadraticCurveTo(24 * u, -52 * u, 15 * u, -36 * u); ctx.stroke();
    // kepala tanpa wajah
    const hy = -82 * u; ctx.fillStyle = body; ctx.beginPath(); ctx.arc(1 * u, hy, 9.5 * u, 0, TAU); ctx.fill(); ctx.fillRect(-4 * u, -75 * u, 9 * u, 5 * u);
    ctx.strokeStyle = D.hexA(rim, 0.5); ctx.lineWidth = 1.4 * u; ctx.beginPath(); ctx.arc(1 * u, hy, 9.5 * u, -1.3, 0.9); ctx.stroke();
    // topi lebar
    const tilt = pose === "garuk" ? -0.12 * Math.sin(t * 8) * k : 0; ctx.save(); ctx.translate(1 * u, hy - 6 * u); ctx.rotate(tilt);
    ctx.fillStyle = "#1C1640"; ctx.beginPath(); ctx.ellipse(0, 0, 17 * u, 3.6 * u, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3A2F6E"; RR(ctx, -9.5 * u, -11 * u, 19 * u, 11 * u, 4 * u); ctx.fill(); ctx.fillStyle = "#FFB547"; ctx.fillRect(-9.5 * u, -3.5 * u, 19 * u, 2.4 * u); ctx.restore();
    A.head = [x + dir * 1 * u, y + bob + hy]; A.top = [x, y + bob + hy - 17 * u];
    // lengan
    const sh = [-11 * u, -68 * u], shF = [11 * u, -68 * u];
    let hb = [-17 * u, -38 * u], hf = [17 * u, -38 * u];
    if (pose === "bagi") hf = [lerp(17, 32, k) * u, lerp(-38, -58, k) * u];
    if (pose === "tunjuk") hf = [lerp(17, 36, k) * u, lerp(-38, -66, k) * u];
    if (pose === "garuk") hf = [lerp(17, 8, k) * u, lerp(-38, -88, k) * u + Math.sin(t * 14) * 1.5 * u * k];
    if (pose === "angkat") { hf = [lerp(17, 26, k) * u, lerp(-38, -98, k) * u]; hb = [lerp(-17, -12, k) * u, lerp(-38, -98, k) * u]; }
    if (pose === "ketuk") hf = [30 * u, -60 * u + Math.abs(Math.sin(t * 7)) * -4 * u];
    if (pose === "jalan") { hf = [17 * u - step * 6 * u, -38 * u]; hb = [-17 * u + step * 6 * u, -38 * u]; }
    ctx.strokeStyle = body; ctx.lineWidth = 7.5 * u;
    const arm = (s0, h0) => { const mx = (s0[0] + h0[0]) / 2 + (h0[0] > s0[0] ? 3 : -3) * u, my = (s0[1] + h0[1]) / 2 + 4 * u; ctx.beginPath(); ctx.moveTo(...s0); ctx.quadraticCurveTo(mx, my, ...h0); ctx.stroke(); ctx.fillStyle = "#3A2F6E"; ctx.beginPath(); ctx.arc(h0[0], h0[1], 4.2 * u, 0, TAU); ctx.fill(); };
    arm(sh, hb); arm(shF, hf);
    if (o.bawa) { ctx.save(); ctx.translate(hf[0], hf[1]); ctx.scale(dir, 1); o.bawa(ctx, u); ctx.restore(); }
    ctx.restore();
    A.hand = [x + dir * hf[0], y + bob + hf[1]]; A.handB = [x + dir * hb[0], y + bob + hb[1]]; A.u = u;
    return A;
  };

  // ---------- tokoh rekaan ----------
  const O = () => KIT.orang;
  U.SARI = { age: "dewasa", hair: "hijab", hijab: "#8E6CE0", ciput: "#5A3FA8", skin: 3, top: "#FFD38A", outfit: "kemeja", lengan: "panjang", bawah: "rokPanjang", bottom: "#3F6E8A", motifBawah: "batik", seed: 21 };
  U.RAKA = { age: "remaja", hair: "pendek", skin: 2, top: "#5AA9FF", outfit: "kaos", bottom: "#2F3462", bawah: "celana", seed: 23 };
  U.orang = (ctx, x, y, h, base, opt = {}) => { const o = Object.assign({}, base, opt); if (typeof o.skin === "number") o.skin = O().SKIN[o.skin]; return O().draw(ctx, x, y, h, o); };

  // pengunjung berjalan melintas: n orang, kecepatan v px/dtk; o.y lantai, o.h tinggi, o.x0/x1 batas, o.dir arah tetap (1/-1) atau campur, o.wajah, o.pose
  U.pengunjung = function (ctx, t, n, o = {}) {
    const y = o.y || 990, h = o.h || 230, x0 = o.x0 == null ? -150 : o.x0, x1 = o.x1 == null ? 2070 : o.x1, span = x1 - x0, out = [];
    const items = [];
    for (let i = 0; i < n; i++) {
      const r = D.rng((o.seed || 5) * 131 + i * 17); r(); const dir = o.dir || (r() < 0.5 ? 1 : -1), v = (o.v || 70) * (0.7 + r() * 0.6);
      const x = x0 + ((r() * span + dir * v * t) % span + span) % span; const dy = (r() - 0.5) * (o.dy == null ? 50 : o.dy);
      items.push({ i, x, y: y + dy, dir, r });
    }
    items.sort((a, b) => a.y - b.y);
    items.forEach(it => {
      const crowd = O().crowd; // gaya pakaian acak sama dengan crowd
      const hair = ["pendek", "hijab", "panjang", "pendek", "kuncir", "hijab", "botak", "pendek", "uban", "hijab"][(it.i * 7 + (o.seed || 5)) % 10];
      const SK = O().SKIN, TOPS = ["#FF8A65", "#5AA9FF", "#FFD38A", "#5BD68A", "#B39DFF", "#FF8FB1", "#3FD8C8", "#F2F6FF"];
      let op = { age: hair === "uban" ? "lansia" : (it.i % 5 === 2 ? "remaja" : "dewasa"), hair, skin: SK[(it.i * 4 + 1) % SK.length], top: TOPS[(it.i * 3 + (o.seed || 5)) % TOPS.length], bottom: ["#3B4785", "#2F3462", "#6B4E3D", "#4A5A8A"][it.i % 4],
        hijab: ["#E0607E", "#3FAE9E", "#8E6CE0", "#F2A65A"][it.i % 4], outfit: it.i % 3 === 0 ? "kemeja" : "kaos", pose: o.pose || "jalan", flip: it.dir < 0, seed: it.i * 7 + 3, t, face: o.wajah ? o.wajah(it.i) : undefined };
      if (o.each) op = o.each(it.i, op) || op;
      if (op.hidden) return;
      out.push(O().draw(ctx, it.x, it.y, h * (op.age === "remaja" ? 0.93 : 1), op));
    });
    return out;
  };

  // ---------- dunia Pasar Juragan ----------
  const CLOUDS = (() => { const r = D.rng(41); return Array.from({ length: 7 }, () => [r() * 2400 - 200, 70 + r() * 220, 80 + r() * 90, r() * 0.6 + 0.4]); })();
  U.STALLS = [{ x: 170, w: 250, col: AWN[3], barang: "baju", label: "BAJU" }, { x: 450, w: 250, col: AWN[5], barang: "sayur", label: "SAYUR" },
    { x: 1470, w: 250, col: AWN[1], barang: "buah", label: "BUAH" }, { x: 1750, w: 250, col: AWN[4], barang: "sepatu", label: "SEPATU" }];
  U.GATE = { x0: 640, x1: 1280, top: 230, beam: 300, post: 70, cx: 960, inner: [710, 1210, 400, FLOOR] };
  // o: suram 0..1, pagi 0..1, stalls (bool), stallOpt(i,s)->opt, esTeh (bool), esTehOpt, label (bool), ramai (crowd n), gate (bool), dalam (fn untuk isi lorong gapura)
  U.pasar = function (ctx, t, o = {}) {
    const sr = clamp(o.suram || 0), pg = clamp(o.pagi || 0);
    // langit
    const sky = ctx.createLinearGradient(0, -300, 0, FLOOR);
    sky.addColorStop(0, mix("#3E62C4", "#232A58", sr)); sky.addColorStop(0.6, mix("#7FA6E8", "#4A4A78", sr)); sky.addColorStop(1, mix("#FFD3A0", "#6E6380", sr));
    ctx.fillStyle = sky; ctx.fillRect(-3000, -1500, 9000, FLOOR + 1500);
    // matahari
    const sunA = (1 - sr * 0.8) + pg * 0.4; U.addLight(ctx, 1600, 150, 360, "#FFE2A0", 0.55 * sunA); ctx.fillStyle = D.hexA("#FFF1C8", 0.9 * (1 - sr * 0.7)); ctx.beginPath(); ctx.arc(1600, 150, 58, 0, TAU); ctx.fill();
    // awan
    CLOUDS.forEach(([cx, cy, r, sp], i) => { const x = ((cx + t * 8 * sp) % 2600) - 300; ctx.fillStyle = D.hexA(sr > 0.5 ? "#8A88A8" : "#FFFFFF", 0.5 - sr * 0.2);
      ctx.beginPath(); ctx.ellipse(x, cy, r, r * 0.38, 0, 0, TAU); ctx.ellipse(x + r * 0.5, cy - r * 0.18, r * 0.55, r * 0.35, 0, 0, TAU); ctx.ellipse(x - r * 0.45, cy - r * 0.08, r * 0.45, r * 0.28, 0, 0, TAU); ctx.fill(); });
    // kota jauh
    ctx.fillStyle = mix("#8FA3D8", "#4A4870", sr); const rc = D.rng(9); for (let x = -3000; x < 6000; x += 70 + rc() * 60) { const hh = 90 + rc() * 170; ctx.fillRect(x, 520 - hh, 60 + rc() * 40, hh + 40); }
    // lantai pelataran
    const fl = ctx.createLinearGradient(0, FLOOR, 0, HH + 300); fl.addColorStop(0, mix("#D9B58C", "#6E6276", sr)); fl.addColorStop(1, mix("#B98E66", "#4E4560", sr));
    ctx.fillStyle = fl; ctx.fillRect(-3000, FLOOR, 9000, 1500);
    ctx.strokeStyle = D.hexA("#5A3A28", 0.18); ctx.lineWidth = 2; for (let i = -30; i <= 30; i++) { ctx.beginPath(); ctx.moveTo(960 + i * 90, FLOOR); ctx.lineTo(960 + i * 260, HH + 300); ctx.stroke(); }
    for (let k = 0; k < 6; k++) { const yy = FLOOR + 30 * Math.pow(1.5, k); ctx.beginPath(); ctx.moveTo(-3000, yy); ctx.lineTo(6000, yy); ctx.stroke(); }
    const naik = o.naik == null ? 1 : clamp(o.naik);
    ctx.save(); if (naik < 1) { ctx.beginPath(); ctx.rect(-3000, -1500, 9000, FLOOR + 1500); ctx.clip(); ctx.translate(0, (1 - eout(naik)) * 700); }
    // gedung pasar (atap gergaji)
    const wall = mix("#F3D9B1", "#8C8098", sr), roof = mix("#D2694B", "#6A4A5E", sr), roofD = mix("#A94A35", "#4E3650", sr);
    ctx.fillStyle = wall; ctx.fillRect(-3000, 470, 9000, FLOOR - 470);
    for (let x = -3080; x < 6000; x += 520) { ctx.fillStyle = roof; ctx.beginPath(); ctx.moveTo(x - 20, 480); ctx.lineTo(x + 260, 330); ctx.lineTo(x + 540, 480); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = roofD; ctx.lineWidth = 3; for (let k = 1; k < 6; k++) { const yy = 480 - k * 25; const dx = k * 25 * 280 / 150; ctx.beginPath(); ctx.moveTo(x - 20 + dx * 0.98, yy); ctx.lineTo(x + 540 - dx * 0.98, yy); ctx.stroke(); } }
    ctx.fillStyle = roofD; ctx.fillRect(-3000, 470, 9000, 16);
    // jendela tinggi (ventilasi) di dinding
    ctx.fillStyle = mix("#C59A6E", "#5C5070", sr); for (let x = -2950; x < 6000; x += 130) { RR(ctx, x, 505, 60, 70, 30); ctx.fill(); }
    // lorong di balik gapura
    if (o.gate !== false) gapura(ctx, t, o, sr);
    // lapak
    if (o.stalls !== false) U.STALLS.forEach((s, i) => { const so = Object.assign({ col: s.col, barang: s.barang, label: o.label === false ? null : s.label, t, seed: i + 2 }, o.stallOpt ? o.stallOpt(i, s) : {});
      U.lapak(ctx, s.x, FLOOR + 10, s.w, so); });
    ctx.restore();
    if (o.esTeh) U.gerobakEsTeh(ctx, o.esTehX || 1310, FLOOR + 90, 230, Object.assign({ t }, o.esTehOpt || {}));
    // cahaya pagi
    if (pg > 0) { U.addLight(ctx, 960, 640, 700 * pg, "#FFE7B0", 0.5 * pg); }
    if (sr > 0) { ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = sr * 0.45; ctx.fillStyle = "#808080"; ctx.fillRect(-3000, -1500, 9000, 3600); ctx.restore(); }
  };
  function gapura(ctx, t, o, sr) {
    const G = U.GATE, [ix0, ix1, iy0, iy1] = G.inner;
    // isi lorong: gelap hangat, lampu gantung, lapak kecil menjauh
    ctx.save(); ctx.beginPath(); ctx.rect(ix0, iy0, ix1 - ix0, iy1 - iy0); ctx.clip();
    const gi = ctx.createLinearGradient(0, iy0, 0, iy1); gi.addColorStop(0, mix("#4B3A6A", "#2A2440", sr)); gi.addColorStop(1, mix("#8A5E4A", "#3A3048", sr)); ctx.fillStyle = gi; ctx.fillRect(ix0, iy0, ix1 - ix0, iy1 - iy0);
    const vx = 960, vy = 600;
    for (let k = 0; k < 5; k++) { const s = Math.pow(0.68, k), w = 230 * s, hh = 150 * s, yb = vy + (iy1 - vy) * s;
      [-1, 1].forEach(side => { const x = vx + side * (250 * s); ctx.fillStyle = AWN[(k * 2 + (side > 0)) % AWN.length]; ctx.globalAlpha = 0.85; ctx.fillRect(x - w / 2 * (side < 0 ? 1.2 : 0.8), yb - hh, w, hh * 0.25);
        ctx.fillStyle = mix("#6A4A3A", "#3A3048", sr); ctx.fillRect(x - w / 2 * (side < 0 ? 1.2 : 0.8), yb - hh * 0.4, w, hh * 0.4); ctx.globalAlpha = 1; });
      const lx = vx, ly = iy0 + 30 + (vy - iy0 - 30) * (1 - s) * 0.4; ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, iy0); ctx.lineTo(lx, ly); ctx.stroke();
      U.addLight(ctx, lx, ly + 6, 120 * s + 40, "#FFC66E", 0.5 * (1 - sr * 0.4)); ctx.fillStyle = "#FFE0A0"; ctx.beginPath(); ctx.arc(lx, ly + 6, 9 * s + 3, 0, TAU); ctx.fill(); }
    if (o.dalam) o.dalam(ctx, t);
    ctx.restore();
    // tiang dan balok gapura
    const post = mix("#2F7F8A", "#3A4A6A", sr), postD = mix("#235F68", "#2C3650", sr), trim = mix("#FFB547", "#A08060", sr);
    [[G.x0, G.x0 + G.post], [G.x1 - G.post, G.x1]].forEach(([a, b]) => { ctx.fillStyle = post; ctx.fillRect(a, G.beam, b - a, FLOOR - G.beam); ctx.fillStyle = postD; ctx.fillRect(b - 18, G.beam, 18, FLOOR - G.beam);
      ctx.fillStyle = trim; ctx.fillRect(a - 10, FLOOR - 40, b - a + 20, 40); ctx.fillRect(a - 6, G.beam + 110, b - a + 12, 14); });
    // atap kecil gapura
    ctx.fillStyle = mix("#C7413B", "#5A3A50", sr); ctx.beginPath(); ctx.moveTo(G.x0 - 70, G.top + 40); ctx.lineTo(G.cx, G.top - 70); ctx.lineTo(G.x1 + 70, G.top + 40); ctx.closePath(); ctx.fill();
    ctx.fillStyle = trim; ctx.fillRect(G.x0 - 70, G.top + 36, G.x1 - G.x0 + 140, 10);
    // papan nama
    ctx.fillStyle = mix("#C7413B", "#5A3A50", sr); RR(ctx, G.x0 - 30, G.top + 44, G.x1 - G.x0 + 60, 130, 14); ctx.fill(); ctx.strokeStyle = trim; ctx.lineWidth = 6; ctx.stroke();
    const sa = o.papanA == null ? 1 : o.papanA; if (sa > 0.01) { ctx.save(); ctx.globalAlpha *= sa; txt(ctx, o.nama || "PASAR JURAGAN", G.cx, G.top + 134, 74, { align: "center", weight: 900, color: mix("#FFF6E6", "#C8C0D0", sr), fit: G.x1 - G.x0 }); ctx.restore(); }
    // lampu bohlam di papan
    for (let i = 0; i < 11; i++) { const x = G.x0 - 10 + i * (G.x1 - G.x0 + 20) / 10, on = sr > 0.5 ? 0.25 : 0.7 + 0.3 * Math.sin(t * 3 + i); ctx.fillStyle = D.hexA("#FFE9A8", on); ctx.beginPath(); ctx.arc(x, G.top + 44, 7, 0, TAU); ctx.fill(); }
  }

  // ---------- spanduk iklan ----------
  const BANNERS = [
    { x: 960, y: 455, w: 420, h: 96, s: "PROMO!", c: "#FF5A5F" }, { x: 360, y: 300, w: 380, h: 90, s: "IKLAN", c: "#FFB547" },
    { x: 1580, y: 290, w: 420, h: 90, s: "DISKON?!", c: "#9584FF" }, { x: 760, y: 620, w: 300, h: 86, s: "IKLAN", c: "#5AA9FF" },
    { x: 1180, y: 640, w: 330, h: 86, s: "BELI!", c: "#FF6F91" }, { x: 160, y: 520, w: 330, h: 86, s: "PROMO!", c: "#5BD68A" },
    { x: 1760, y: 520, w: 330, h: 86, s: "IKLAN", c: "#FF5A5F" }, { x: 600, y: 430, w: 300, h: 80, s: "SALE", c: "#3FD8C8" },
    { x: 1340, y: 450, w: 320, h: 80, s: "PROMO!", c: "#FFB547" }];
  U.BANNERS = BANNERS;
  U.spanduk = function (ctx, t, u, o = {}) {
    const n = BANNERS.length, list = o.list || BANNERS;
    list.forEach((B, i) => {
      const k = clamp(u * n - i); if (k <= 0) return; const drop = clamp(spring(k * 1.4, 9, 0.45));
      const sway = Math.sin(t * 1.6 + i * 1.3) * 0.025;
      ctx.save(); ctx.translate(B.x, B.y - (1 - drop) * 420); ctx.rotate(sway + (B.rot || 0));
      // tali
      ctx.strokeStyle = "rgba(40,30,30,0.6)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-B.w / 2 + 10, -B.h / 2); ctx.lineTo(-B.w / 2 - 40, -B.h / 2 - 220); ctx.moveTo(B.w / 2 - 10, -B.h / 2); ctx.lineTo(B.w / 2 + 40, -B.h / 2 - 220); ctx.stroke();
      ctx.fillStyle = "rgba(10,8,30,0.25)"; ctx.fillRect(-B.w / 2 + 8, -B.h / 2 + 10, B.w, B.h);
      ctx.fillStyle = B.c; ctx.fillRect(-B.w / 2, -B.h / 2, B.w, B.h);
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(-B.w / 2, -B.h / 2, B.w, 10);
      ctx.fillStyle = "#FFF6E6"; ctx.fillRect(-B.w / 2 + 8, -B.h / 2 + 8, 14, 14); ctx.fillRect(B.w / 2 - 22, -B.h / 2 + 8, 14, 14);
      txt(ctx, B.s, 0, B.h * 0.2, Math.min(64, B.h * 0.62), { align: "center", weight: 900, color: "#FFFFFF", fit: B.w - 30 });
      ctx.restore();
    });
  };

  // ---------- palang dan gembok di gapura ----------
  U.palang = function (ctx, t, u, kunci = 0, o = {}) {
    const G = U.GATE, px = G.x0 + G.post / 2, py = o.y || 600, len = G.x1 - G.x0 - 10;
    const ang = lerp(-Math.PI / 2 + 0.15, 0, eout(clamp(u))) + (u >= 1 ? 0 : 0) + Math.sin(clamp(u) * 12) * 0.03 * (1 - u);
    const shake = u > 0.85 && u < 1 ? 0 : 0;
    ctx.save(); ctx.translate(px, py + shake); ctx.rotate(ang);
    ctx.fillStyle = "rgba(10,8,30,0.3)"; RR(ctx, 0, 8, len, 50, 10); ctx.fill();
    const gr = ctx.createLinearGradient(0, -24, 0, 26); gr.addColorStop(0, "#B07A4C"); gr.addColorStop(1, "#7A5030"); ctx.fillStyle = gr; RR(ctx, 0, -24, len, 50, 10); ctx.fill();
    ctx.fillStyle = "#3A2F6E"; for (let x = 60; x < len - 20; x += 150) ctx.fillRect(x, -24, 20, 50);
    ctx.fillStyle = "#FFB547"; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fill();
    ctx.restore();
    if (u >= 0.98 && kunci > 0) { const gx = G.cx + 120, gy = py + 46; ctx.strokeStyle = "#8C93B8"; ctx.lineWidth = 6;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(gx - 90 + i * 30, py + 6 + i * 10, 14, 9, 0.6, 0, TAU); ctx.stroke(); }
      KIT.bipkit.gembok(ctx, gx, gy + 40, 120, { locked: clamp(kunci), t, color: "#FFC94D" }); }
  };

  // ---------- graf efek jaringan ----------
  // n titik di lingkaran; e = jumlah garis yang sudah tergambar (boleh pecahan); o: col, nodeR, lw, ikat (fn), alpha
  U.ringPts = (cx, cy, r, n, rot = -Math.PI / 2) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(rot + i * TAU / n), cy + r * Math.sin(rot + i * TAU / n)]);
  U.jaring = function (ctx, cx, cy, r, n, e, o = {}) {
    const pts = o.pts || U.ringPts(cx, cy, r, n), tot = n * (n - 1) / 2, E = Math.min(e, tot);
    ctx.save(); ctx.lineCap = "round";
    let c = 0; const lw = o.lw || (n > 30 ? 1.2 : 5), col = o.col || P.teal, la = o.lineA == null ? (n > 30 ? 0.35 : 0.9) : o.lineA;
    ctx.strokeStyle = D.hexA(col, la); ctx.lineWidth = lw;
    if (n > 30) { ctx.beginPath(); }
    outer: for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (c >= E) break outer; const f = clamp(E - c); c++;
      const [x0, y0] = pts[i], [x1, y1] = pts[j];
      if (n > 30) { ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, f), lerp(y0, y1, f)); }
      else { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, f), lerp(y0, y1, f)); ctx.stroke(); }
    }
    if (n > 30) ctx.stroke();
    const nr = o.nodeR || (n > 30 ? 9 : 26);
    pts.forEach(([x, y], i) => { ctx.fillStyle = "rgba(10,18,52,0.6)"; ctx.beginPath(); ctx.arc(x, y + 3, nr + 3, 0, TAU); ctx.fill();
      ctx.fillStyle = o.nodeCol ? o.nodeCol(i) : P.warm; ctx.beginPath(); ctx.arc(x, y, nr, 0, TAU); ctx.fill();
      if (nr >= 18) { ctx.fillStyle = "#2A2350"; ctx.beginPath(); ctx.arc(x, y - nr * 0.2, nr * 0.32, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + nr * 0.55, nr * 0.52, nr * 0.32, 0, Math.PI, 0); ctx.fill(); } });
    ctx.restore(); return pts;
  };

  // ---------- gerobak "platform" dengan empat rem ----------
  U.REM = ["persaingan", "aturan", "interoperabilitas", "pekerja teknologi"];
  // (x,y) titik tengah bawah roda; s lebar; o.rem [4 nilai 0..1 menyala], o.ang kemiringan jalan, o.t, o.putar (rotasi roda)
  U.gerobak = function (ctx, x, y, s, o = {}) {
    const rem = o.rem || [0, 0, 0, 0], t = o.t || 0, rot = o.putar || 0, A = { rem: [] };
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang || 0);
    ctx.fillStyle = "rgba(10,8,30,0.3)"; ctx.beginPath(); ctx.ellipse(0, 6, s * 0.56, s * 0.05, 0, 0, TAU); ctx.fill();
    // bak
    ctx.fillStyle = "#C7413B"; RR(ctx, -s / 2, -s * 0.52, s, s * 0.3, 14); ctx.fill(); ctx.fillStyle = "#A8322E"; ctx.fillRect(-s / 2, -s * 0.28, s, s * 0.06);
    ctx.fillStyle = "#FFF6E6"; RR(ctx, -s * 0.36, -s * 0.49, s * 0.72, s * 0.16, 10); ctx.fill();
    txt(ctx, "PLATFORM", 0, -s * 0.37, Math.min(64, s * 0.1), { align: "center", weight: 900, color: "#C7413B" });
    // muatan: karung uang kecil
    for (let i = 0; i < 3; i++) { ctx.fillStyle = "#E9C46A"; ctx.beginPath(); ctx.ellipse(-s * 0.25 + i * s * 0.25, -s * 0.56, s * 0.1, s * 0.07, 0, Math.PI, 0); ctx.fill(); }
    // roda (4: dua terlihat di depan, dua di belakang sedikit bergeser)
    const wx = [-0.38, -0.14, 0.14, 0.38];
    wx.forEach((k, i) => { const cx = k * s, cy = -s * 0.1, r = s * 0.1;
      ctx.fillStyle = "#2A2350"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#8C93B8"; ctx.lineWidth = 4; for (let j = 0; j < 3; j++) { const a = rot + j * Math.PI / 3; ctx.beginPath(); ctx.moveTo(cx - Math.cos(a) * r * 0.8, cy - Math.sin(a) * r * 0.8); ctx.lineTo(cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8); ctx.stroke(); }
      // kampas rem
      const on = clamp(rem[i]); ctx.fillStyle = on > 0.05 ? mix("#5C6390", "#FF5A5F", on) : "#5C6390";
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.6); RR(ctx, -r * 0.35, -r - 12, r * 0.7, 16, 6); ctx.fill(); ctx.restore();
      if (on > 0.05) { ctx.save(); ctx.globalCompositeOperation = "screen"; D.glow(ctx, cx, cy - r * 0.8, r * 1.4, "#FF8A6A", on * 0.8); ctx.restore(); }
      const m = ctx.getTransform(); A.rem.push([m.a * cx + m.c * (cy - r) + m.e, m.b * cx + m.d * (cy - r) + m.f]); });
    ctx.restore(); return A;
  };

  // ---------- layar feed media sosial generik (layar HP, koordinat layar lokal) ----------
  // o.kartu: array jenis 'teman'|'iklan'|'saran'|'berita'; o.muncul jumlah kartu (pecahan = sedang muncul); o.scroll px; o.judul
  U.layarFeed = function (ctx, w, h, t, o = {}) {
    ctx.fillStyle = o.bg || "#F4F6FF"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, w, h * 0.1); ctx.fillStyle = "rgba(40,50,100,0.12)"; ctx.fillRect(0, h * 0.1, w, 2);
    if (o.judul !== false) txt(ctx, o.judul || "Beranda", w * 0.06, h * 0.07, Math.max(28, w * 0.075), { weight: 900, color: "#2A2350" });
    const list = o.kartu || [], ch = h * 0.21, gap = h * 0.025; let y = h * 0.12 - (o.scroll || 0);
    const M = o.muncul == null ? list.length : o.muncul;
    list.forEach((k, i) => { const a = clamp(M - i); if (a <= 0 || y > h) { y += ch + gap; return; }
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - eout(a)) * 30);
      const x = w * 0.04, cw = w * 0.92; ctx.fillStyle = k === "iklan" ? "#FFF6D8" : "#FFFFFF"; RR(ctx, x, y, cw, ch, 14); ctx.fill();
      ctx.strokeStyle = k === "iklan" ? "#FFC94D" : "rgba(40,50,100,0.12)"; ctx.lineWidth = k === "iklan" ? 4 : 2; ctx.stroke();
      const col = { teman: "#5BD68A", iklan: "#FFB547", saran: "#9584FF", berita: "#5AA9FF" }[k] || "#5BD68A";
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + ch * 0.2, y + ch * 0.2, ch * 0.11, 0, TAU); ctx.fill();
      U.bars(ctx, x + ch * 0.38, y + ch * 0.14, cw * 0.4, ch * 0.05, 1, "rgba(40,50,100,0.3)", i + 3);
      ctx.fillStyle = D.hexA(col, 0.28); RR(ctx, x + ch * 0.1, y + ch * 0.38, cw - ch * 0.2, ch * 0.5, 10); ctx.fill();
      if (k === "teman") { ctx.fillStyle = D.hexA(col, 0.9); ctx.beginPath(); ctx.arc(x + cw * 0.3, y + ch * 0.62, ch * 0.12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x + cw * 0.52, y + ch * 0.6, ch * 0.12, 0, TAU); ctx.fill(); }
      if (k === "berita") { U.bars(ctx, x + ch * 0.2, y + ch * 0.48, cw * 0.7, ch * 0.06, 3, D.hexA("#2A4A8A", 0.45), i); }
      if (k === "iklan") { ctx.fillStyle = "#FFB547"; RR(ctx, x + cw * 0.3, y + ch * 0.45, cw * 0.4, ch * 0.36, 12); ctx.fill(); }
      if (k === "saran") { ctx.fillStyle = D.hexA(col, 0.8); ctx.beginPath(); ctx.moveTo(x + cw * 0.45, y + ch * 0.5); ctx.lineTo(x + cw * 0.58, y + ch * 0.63); ctx.lineTo(x + cw * 0.45, y + ch * 0.76); ctx.fill(); }
      const tagTxt = { teman: "Teman", iklan: "Bersponsor", saran: "Disarankan", berita: "Berita" }[k];
      if (tagTxt && o.tagSize) { const fs = o.tagSize; ctx.font = `900 ${fs}px ${FONT}`; const tw = ctx.measureText(tagTxt).width + fs * 0.6;
        ctx.fillStyle = k === "iklan" ? "#FFD23F" : "#FFFFFF"; RR(ctx, x + cw - tw - 10, y + 8, tw, fs * 1.35, fs * 0.3); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke();
        txt(ctx, tagTxt, x + cw - tw / 2 - 10, y + 8 + fs * 1.0, fs, { align: "center", weight: 900, color: "#2A2350" }); }
      ctx.restore(); y += ch + gap; });
  };

  // ---------- pasar mini (ikon bangunan pasar), (x,y) = tengah bawah, s = lebar ----------
  // o.nama, o.col (atap), o.tutup 0..1 (rolling door turun), o.ramai 0..1 (lampu), o.t, o.suram
  U.pasarMini = function (ctx, x, y, s, o = {}) {
    const t = o.t || 0, sr = clamp(o.suram || 0), h = s * 0.62, col = o.col || "#D2694B";
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(10,8,30,0.22)"; ctx.beginPath(); ctx.ellipse(0, 4, s * 0.58, s * 0.05, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mix("#F3D9B1", "#8C8098", sr); ctx.fillRect(-s / 2, -h, s, h);
    ctx.fillStyle = mix(col, "#5A4A5E", sr); ctx.beginPath(); ctx.moveTo(-s * 0.56, -h + 6); ctx.lineTo(0, -h - s * 0.26); ctx.lineTo(s * 0.56, -h + 6); ctx.closePath(); ctx.fill();
    // pintu-pintu lapak
    const n = 3, dw = s * 0.24, gap = (s - n * dw) / (n + 1);
    for (let i = 0; i < n; i++) { const dx = -s / 2 + gap + i * (dw + gap), dh = h * 0.55;
      ctx.fillStyle = "#4B3A6A"; ctx.fillRect(dx, -dh, dw, dh);
      ctx.fillStyle = AWN[(i + (o.seed || 0)) % AWN.length]; ctx.fillRect(dx - 6, -dh - 16, dw + 12, 18);
      const lit = clamp(o.ramai == null ? 1 : o.ramai); if (lit > 0) { ctx.fillStyle = D.hexA("#FFD38A", 0.55 * lit); ctx.fillRect(dx + 6, -dh + 8, dw - 12, dh * 0.4); }
      const tp = clamp((o.tutup || 0) * 1.3 - i * 0.15); if (tp > 0) { ctx.fillStyle = "#8C93B8"; ctx.fillRect(dx, -dh, dw, dh * tp); ctx.fillStyle = "rgba(40,45,90,0.35)"; for (let yy = -dh + 8; yy < -dh + dh * tp; yy += 12) ctx.fillRect(dx, yy, dw, 3); } }
    ctx.restore();
    if (o.nama) { const fs = o.fs || 48; ctx.save(); ctx.font = `900 ${fs}px ${FONT}`; const lw = ctx.measureText(o.nama).width + fs;
      ctx.fillStyle = mix("#C7413B", "#5A3A50", sr); RR(ctx, x - lw / 2, y - h - s * 0.26 - fs * 1.6, lw, fs * 1.4, fs * 0.3); ctx.fill(); ctx.strokeStyle = "#FFB547"; ctx.lineWidth = 4; ctx.stroke();
      txt(ctx, o.nama, x, y - h - s * 0.26 - fs * 1.6 + fs * 1.03, fs, { align: "center", weight: 900, color: "#FFF6E6" }); ctx.restore(); }
    return { top: y - h - s * 0.26, door: [x, y], h };
  };

  // ---------- latar polos studio (diagram) ----------
  U.studio = function (ctx, t, o = {}) {
    D.bg(ctx, t, { top: o.top || "#1F2D68", bot: o.bot || "#33498F", stars: o.stars == null ? 0.25 : o.stars });
    ctx.save(); ctx.globalAlpha = 0.07; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2; for (let x = 0; x <= W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); } for (let y = 0; y <= HH; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore();
  };

  // ---------- kantor Juragan (dalam) ----------
  U.kantor = function (ctx, t, o = {}) {
    const sr = clamp(o.suram || 0);
    const gw = ctx.createLinearGradient(0, 0, 0, 760); gw.addColorStop(0, mix("#5A4A8A", "#3A3460", sr)); gw.addColorStop(1, mix("#7A5E9A", "#4A4070", sr));
    ctx.fillStyle = gw; ctx.fillRect(-400, -400, 2720, 1160);
    ctx.fillStyle = "rgba(255,255,255,0.04)"; for (let x = -400; x < 2400; x += 90) ctx.fillRect(x, -400, 40, 1160);
    // jendela ke pasar
    ctx.fillStyle = "#2A2350"; RR(ctx, 1260, 120, 520, 360, 14); ctx.fill(); ctx.save(); RR(ctx, 1276, 136, 488, 328, 8); ctx.clip();
    const sk = ctx.createLinearGradient(0, 136, 0, 464); sk.addColorStop(0, "#7FA6E8"); sk.addColorStop(1, "#FFD3A0"); ctx.fillStyle = sk; ctx.fillRect(1276, 136, 488, 328);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = AWN[i]; ctx.fillRect(1290 + i * 80, 380, 64, 24); ctx.fillStyle = "#C59A6E"; ctx.fillRect(1290 + i * 80, 404, 64, 60); }
    ctx.restore(); ctx.fillStyle = "#2A2350"; ctx.fillRect(1516, 120, 10, 360); ctx.fillRect(1260, 296, 520, 10);
    // lantai
    ctx.fillStyle = mix("#6B4E3D", "#4A3A40", sr); ctx.fillRect(-400, 760, 2720, 700);
    ctx.fillStyle = "rgba(0,0,0,0.12)"; for (let x = -400; x < 2400; x += 160) ctx.fillRect(x, 760, 4, 700);
    // meja besar
    ctx.fillStyle = "#8A5A3C"; RR(ctx, 360, 640, 1200, 60, 12); ctx.fill(); ctx.fillStyle = "#6E4630"; ctx.fillRect(400, 700, 1120, 220); ctx.fillStyle = "#A8714C"; ctx.fillRect(360, 640, 1200, 10);
  };
})(typeof window !== "undefined" ? window : globalThis);
