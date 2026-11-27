/* D13 — perangkat bersama: bahan asli (klip, potongan log, postingan X), sorotan baris log, pelacak lima petunjuk,
   kaca pembesar, pita frame per detik, angka bergaya Indonesia. Di atas K.d08 (palet neon) dan K.d10 (tata letak aman).
   Zona isi: x 110..1810, y 250..820; judul y=178; keterangan bawah y=868. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, A = K.aset;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const W = 1920, HH = 1080, TAU = Math.PI * 2, MONO = X.MONO;
  const Z = K.d13 = {};
  Z.reg = (seg, S) => { K.SCENES["d13_b" + seg] = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else U.ruang(ctx, t); }; };
  Z.fmt = n => Math.round(n).toLocaleString("id-ID");
  const img = Z.img = k => { const im = A && A.img[k]; return im && im.complete && im.naturalWidth ? im : null; };

  // ---------- gambar asli ----------
  // o: a, r (sudut), src [sx,sy,sw,sh], col (bingkai), dim (0..1), blur (bayangan)
  Z.foto = function (ctx, k, x, y, w, h, o = {}) {
    const im = img(k), a = o.a == null ? 1 : o.a; if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    if (o.col) { ctx.shadowColor = o.col; ctx.shadowBlur = o.blur == null ? 30 : o.blur; ctx.fillStyle = "#000"; RR(ctx, x, y, w, h, o.r || 18); ctx.fill(); ctx.shadowBlur = 0; }
    ctx.save(); RR(ctx, x, y, w, h, o.r || 18); ctx.clip();
    if (im) { const s = o.src || [0, 0, im.naturalWidth, im.naturalHeight]; ctx.drawImage(im, s[0], s[1], s[2], s[3], x, y, w, h); } else { ctx.fillStyle = "#222"; ctx.fillRect(x, y, w, h); }
    if (o.dim) { ctx.fillStyle = `rgba(8,3,22,${o.dim})`; ctx.fillRect(x, y, w, h); }
    ctx.restore();
    if (o.col) { ctx.strokeStyle = D.hexA(o.col, 0.9); ctx.lineWidth = o.lw || 4; RR(ctx, x, y, w, h, o.r || 18); ctx.stroke(); }
    ctx.restore();
  };
  // klip video asli (30 gambar/detik, 10 detik pertama); tv = detik di dalam klip
  Z.frameKlip = tv => 1 + ((Math.floor(Math.max(0, tv) * 30) % A.KLIP) + A.KLIP) % A.KLIP;
  Z.klip = (ctx, tv, x, y, w, h, o = {}) => Z.foto(ctx, "f" + Z.frameKlip(tv), x, y, w, h, o);
  // latar layar penuh dari klip asli, diredupkan (gameplay milik pemegang hak cipta: jangan tampil terang lama)
  Z.latar = function (ctx, tv, o = {}) {
    Z.foto(ctx, "f" + Z.frameKlip(tv), 0, 0, W, HH, { r: 0.01, dim: o.dim == null ? 0.62 : o.dim });
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, "rgba(20,6,44,0.55)"); gr.addColorStop(0.5, "rgba(20,6,44,0.15)"); gr.addColorStop(1, "rgba(20,6,44,0.6)");
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
  };
  // label "bahan asli" kecil di kanan bawah
  Z.labelAsli = (ctx, s, a = 1) => D.post(c => { if (a <= 0.01) return; c.save(); c.globalAlpha *= a; c.font = `800 40px ${K.FONT}`; const w = c.measureText(s).width + 48;
    c.fillStyle = "rgba(10,4,26,0.86)"; RR(c, W - 96 - w, 822, w, 66, 18); c.fill(); c.strokeStyle = D.hexA(N.gold, 0.8); c.lineWidth = 3; c.stroke(); txt(c, s, W - 120, 868, 40, { align: "right", weight: 800, color: N.gold }); c.restore(); });
  // postingan X (tangkapan layar asli; akun perorangan sudah diburamkan) dengan tinggi h, berpusat di (cx, cy)
  Z.tweet = function (ctx, k, cx, cy, h, o = {}) { const im = img(k); if (!im) return null; const w = h * im.naturalWidth / im.naturalHeight, a = o.a == null ? 1 : o.a; if (a <= 0.01) return null;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); if (o.rot) ctx.rotate(o.rot); const s = o.sp == null ? 1 : lerp(0.9, 1, o.sp); ctx.scale(s, s);
    Z.foto(ctx, k, -w / 2, -h / 2, w, h, { r: 26, col: o.col || N.cyan, blur: 40 }); ctx.restore(); return { x: cx - w / 2, y: cy - h / 2, w, h }; };

  // ---------- potongan log asli (aset log/t6.4: 940x580, baris i berpusat di y = 95 + 22.6 i; bilah bawah y = 527) ----------
  Z.baris = i => 95 + 22.6 * i;
  Z.BAR_Y = 527;
  // jenis baris pada potongan t6.4 (0..17); "ca" = baris Co-Authored-By
  Z.JENIS = ["vram", "native", "host2", "ca", "input", "stream", "host", "swapchain", "shader", "ca", "lighting", "vram", "native", "host2", "ca", "input", "stream", "host"];
  // gambar sebagian potongan log (src = [sx, sy, sw, sh] dalam koordinat potongan) ke kotak (x, y, w); hl: [{y0, y1, x0?, x1?, col, a}]
  Z.logAsli = function (ctx, k, src, x, y, w, o = {}) {
    const s = w / src[2], h = src[3] * s, a = o.a == null ? 1 : o.a; if (a <= 0.01) return { x, y, w, h, s };
    ctx.save(); ctx.globalAlpha *= a; Z.foto(ctx, k, x, y, w, h, { src, r: 18, col: o.col || N.cyan, blur: 24 });
    const map = (px, py) => [x + (px - src[0]) * s, y + (py - src[1]) * s];
    (o.redup || []).forEach(r => { const [x0, y0] = map(src[0], r[0]), [, y1] = map(src[0], r[1]); ctx.fillStyle = `rgba(6,2,16,${0.68 * (r[2] == null ? 1 : r[2])})`; ctx.fillRect(x0, y0, w, y1 - y0); });
    (o.hl || []).forEach(r => { const ha = r.a == null ? 1 : r.a; if (ha <= 0.01) return; const [x0, y0] = map(r.x0 == null ? src[0] + 6 : r.x0, r.y0), [x1, y1] = map(r.x1 == null ? src[0] + src[2] - 6 : r.x1, r.y1);
      ctx.save(); ctx.globalAlpha *= ha; ctx.fillStyle = D.hexA(r.col || N.gold, 0.16); RR(ctx, x0, y0, x1 - x0, y1 - y0, 10); ctx.fill(); ctx.shadowColor = r.col || N.gold; ctx.shadowBlur = 18; ctx.strokeStyle = r.col || N.gold; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); });
    ctx.restore(); return { x, y, w, h, s, map };
  };
  Z.rowHL = (i, col, a, o = {}) => ({ y0: Z.baris(i) - 11.5, y1: Z.baris(i) + 11.5, col, a, ...o });

  // ---------- kaca pembesar dan pelacak lima petunjuk ----------
  Z.kaca = function (ctx, x, y, s, col, o = {}) { ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.lineCap = "round"; ctx.shadowColor = col; ctx.shadowBlur = 20;
    ctx.fillStyle = o.isi || "rgba(51,240,255,0.10)"; ctx.strokeStyle = col; ctx.lineWidth = s * 0.09; ctx.beginPath(); ctx.arc(0, 0, s * 0.36, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.lineWidth = s * 0.14; ctx.beginPath(); ctx.moveTo(s * 0.27, s * 0.27); ctx.lineTo(s * 0.56, s * 0.56); ctx.stroke(); ctx.restore(); };
  // n petunjuk sudah ditemukan, k = petunjuk yang sedang menyala (1..5). Gaya slot game di kanan atas.
  Z.slot = function (ctx, x, y, s, i, st, t) {   // st: 0 kosong, 1 menyala (sedang dicari), 2 ditemukan
    const col = st === 2 ? N.gold : st === 1 ? N.cyan : N.dim; ctx.save(); ctx.fillStyle = "rgba(12,5,30,0.9)"; ctx.strokeStyle = col; ctx.lineWidth = 4; if (st) { ctx.shadowColor = col; ctx.shadowBlur = st === 1 ? 14 + 8 * Math.sin(t * 5) : 16; }
    ctx.beginPath(); ctx.arc(x, y, s / 2, 0, TAU); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    if (st === 2) U.centang(ctx, x, y, s * 0.3, 1, N.gold); else txt(ctx, String(i), x, y + Math.max(40, s * 0.56) * 0.36, Math.max(40, s * 0.56), { align: "center", weight: 900, color: col });
    ctx.restore(); };
  Z.pelacak = function (ctx, n, k, t, o = {}) { const a = o.a == null ? 1 : o.a; if (a <= 0.01) return; const s = 64, gap = 18, x0 = W - 96 - 5 * s - 4 * gap;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "rgba(10,4,26,0.72)"; RR(ctx, x0 - 22, 28, 5 * s + 4 * gap + 44, s + 2 + 0, 20); ctx.fill();
    for (let i = 0; i < 5; i++) Z.slot(ctx, x0 + s / 2 + i * (s + gap), 28 + s / 2 + 1, s - 6, i + 1, i < n ? 2 : i + 1 === k ? 1 : 0, t); ctx.restore(); };
  // kartu petunjuk besar (dipakai di rekap dan akhir tiap petunjuk)
  Z.kartuPetunjuk = function (ctx, r, i, judul, sub, o = {}) { X.kartu(ctx, r, { col: o.col || N.gold, nomor: i, judul, sub, a: o.a, sp: o.sp, ikon: (c, x, y, s, col) => Z.kaca(c, x, y, s * 0.9, col), ih: o.ih == null ? 120 : o.ih, js: o.js || 46, ss: o.ss || 40, redup: o.redup }); };

  // ---------- frame dan FPS ----------
  // pita satu detik berisi n kotak; isi = berapa kotak menyala; o.col, o.kosong (warna kotak tak terisi)
  Z.pita = function (ctx, x, y, w, h, n, isi, o = {}) { const gap = n > 60 ? 1 : 3, bw = (w - gap * (n - 1)) / n; ctx.save();
    for (let i = 0; i < n; i++) { const on = i < isi; ctx.fillStyle = on ? (o.col || N.cyan) : (o.kosong || "rgba(255,255,255,0.08)"); if (on && o.glow !== false) { ctx.shadowColor = o.col || N.cyan; ctx.shadowBlur = 8; } ctx.fillRect(x + i * (bw + gap), y, bw, h); ctx.shadowBlur = 0; }
    ctx.strokeStyle = D.hexA(o.garis || N.ink2, 0.5); ctx.lineWidth = 3; RR(ctx, x - 8, y - 8, w + 16, h + 16, 12); ctx.stroke(); ctx.restore(); };
  // bola memantul untuk buku gambar (posisi menurut indeks gambar)
  Z.bola = (ctx, x, y, r, col) => { ctx.save(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); };
  // angka besar neon yang bergulir dari a ke b
  Z.angkaGulir = (ctx, x, y, size, col, v0, v1, u, o = {}) => U.neon(ctx, (o.pre || "") + Z.fmt(lerp(v0, v1, eio(u))) + (o.suf || ""), x, y, size, col, { align: o.align || "center", fit: o.fit });
  // kutipan dari sumber (teks asli, kursif terang) di panel; baris: string[]
  Z.kutipan = function (ctx, x, y, w, baris, o = {}) { const size = o.size || 44, lh = size * 1.32, pad = 36, hJ = o.judul ? 64 : 0, h = pad * 2 + hJ + baris.length * lh, a = o.a == null ? 1 : o.a; if (a <= 0.01) return h;
    ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, x, y, w, h, { col: o.col || N.gold, fill: "rgba(14,6,32,0.94)" });
    if (o.judul) txt(ctx, o.judul, x + pad, y + pad + 36, 40, { weight: 800, color: o.col || N.gold, fit: w - pad * 2 });
    baris.forEach((s, i) => { const k = o.t0s ? ramp(o.l, o.t0s[i] == null ? -1 : o.t0s[i], 0.35) : 1; if (k <= 0.01) return; ctx.save(); ctx.globalAlpha *= k;
      X.mono(ctx, s, x + pad, y + pad + hJ + (i + 0.78) * lh, size, { color: (o.warna && o.warna[i]) || N.ink, fit: w - pad * 2, weight: 700 }); ctx.restore(); });
    ctx.restore(); return h; };
})(typeof window !== "undefined" ? window : globalThis);
