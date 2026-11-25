/* D10 — kartu bab gaya game (LEVEL / BONUS STAGE) lewat K.dok.cardFn + label HUD kecil di pojok kiri atas.
   Meniru kartu D08 (tanpa BOSS). Unsur game generik saja. Dimuat sesudah bab0–9.js. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout } = D, { txt, RR } = U, W = 1920, HH = 1080;
  const KARTU = {
    1: { jenis: "level", besar: "LEVEL 1", judul: "Apa yang Sebenarnya Bocor?", baris: "Misi: susun urutan kejadiannya.", col: N.cyan },
    2: { jenis: "level", besar: "LEVEL 2", judul: "Mengapa Game Xbox Tidak Bisa Langsung Dibuka di Windows?", baris: "Misi: temukan tiga hal yang dibutuhkan sebuah game.", col: N.cyan },
    3: { jenis: "level", besar: "LEVEL 3", judul: "Tiga Jalan untuk Memindahkan Game", baris: "Misi: bandingkan ketiga jalannya.", col: N.cyan },
    4: { jenis: "bonus", besar: "BONUS STAGE", judul: "Di Dalam Mesin Penerjemah", baris: "Empat langkah rekompilasi dan dua jebakannya.", col: N.gold },
    5: { jenis: "level", besar: "LEVEL 4", judul: "Empat Pekerjaan Besar", baris: "Misi: bedah rencana proyek port tidak resmi.", col: N.cyan },
    6: { jenis: "level", besar: "LEVEL 5", judul: "“Hampir Menyala” Itu Sejauh Apa?", baris: "Misi: pisahkan klaim dari bukti.", col: N.cyan },
    7: { jenis: "bonus", besar: "BONUS STAGE", judul: "Siapa Sebenarnya Para Modder?", baris: "Tiga tingkatan dan tiga cerita nyata.", col: N.gold },
    8: { jenis: "level", besar: "LEVEL 6", judul: "Jadi, Kapan Versi PC yang Asli?", baris: "Misi: pahami arti porting yang sebenarnya.", col: N.cyan },
    9: { jenis: "level", besar: "LEVEL 7", judul: "Pelajaran untuk Programmer", baris: "Misi terakhir: bawa pulang satu konsep.", col: N.green }
  };
  const beats = () => g.__beats || [];
  function cardStart(seg) { const bs = beats(); const i = bs.findIndex(x => x.seg === seg); if (i <= 0) return 0; const pb = bs[i - 1]; return pb.start + D.speechEnd(pb) + (pb.cardDelay != null ? pb.cardDelay : 0.3); }
  function glitch(ctx, draw, u) { if (u >= 1) { draw(ctx); return; }
    const c = document.createElement("canvas"); c.width = W; c.height = 420; const o = c.getContext("2d"); o.translate(0, -330); draw(o);
    const r = U.rng(Math.floor(u * 12) + 3); for (let y = 0; y < 420; y += 30) { const dx = (r() - 0.5) * 180 * (1 - u); ctx.drawImage(c, 0, y, W, 30, dx, 330 + y, W, 30); } }
  D.cardFn = function (ctx, seg, title, a, t) {
    const k = KARTU[seg]; if (!k || a <= 0) return; const ct = t - cardStart(seg);
    ctx.save(); ctx.globalAlpha = a; K.kota3d.draw(ctx, t, { dim: 0.5, z: t * 7 });
    const gr = ctx.createLinearGradient(0, 300, 0, 800); gr.addColorStop(0, "rgba(8,3,22,0)"); gr.addColorStop(0.2, "rgba(8,3,22,0.8)"); gr.addColorStop(0.8, "rgba(8,3,22,0.8)"); gr.addColorStop(1, "rgba(8,3,22,0)");
    ctx.fillStyle = gr; ctx.fillRect(0, 280, W, 560);
    glitch(ctx, c => U.neon(c, k.besar, W / 2, 470, 150, k.col, { align: "center" }), clamp(ct / 0.35));
    const s2 = clamp((ct - 0.25) / 0.4);
    if (s2 > 0) { ctx.save(); ctx.globalAlpha *= s2; ctx.translate(0, (1 - eout(s2)) * 30);
      txt(ctx, k.judul, W / 2, 606, 76, { align: "center", weight: 900, color: N.ink, fit: 1640 });
      txt(ctx, k.baris, W / 2, 690, 46, { align: "center", weight: 700, color: N.ink2, fit: 1600 }); ctx.restore(); }
    const v = clamp((ct - 0.4) / 2.6);
    if (k.jenis === "level") { const x = 560, y = 810, w = 800; txt(ctx, "MEMUAT LEVEL", x, y - 16, 40, { weight: 800, color: N.ink2 });
      ctx.save(); ctx.fillStyle = "rgba(10,4,26,0.85)"; RR(ctx, x, y, w, 34, 17); ctx.fill(); ctx.strokeStyle = D.hexA(k.col, 0.8); ctx.lineWidth = 3; ctx.stroke();
      ctx.shadowColor = k.col; ctx.shadowBlur = 14; ctx.fillStyle = k.col; RR(ctx, x + 5, y + 5, (w - 10) * eio(v), 24, 12); ctx.fill(); ctx.restore();
      txt(ctx, Math.round(eio(v) * 100) + "%", x + w + 24, y + 31, 40, { weight: 900, color: k.col }); }
    if (k.jenis === "bonus") { for (let i = 0; i < 5; i++) { const on = clamp(v * 5 - i), x = 680 + i * 140, y = 836, s = 34 * (0.6 + 0.4 * eout(on)); ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.6 + i);
      ctx.fillStyle = D.hexA(N.gold, 0.25 + 0.75 * on); ctx.shadowColor = N.gold; ctx.shadowBlur = 22 * on; ctx.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? s * 0.45 : s, an = j * Math.PI / 5 - Math.PI / 2; j ? ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r) : ctx.moveTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); } }
    ctx.restore();
  };
  // HUD kecil kiri atas
  function hud(ctx, b, l) { const k = KARTU[b.seg]; if (!k || b.id === "b7_99") return; const bs = beats(), i = bs.findIndex(x => x.id === b.id), pv = bs[i - 1]; let a = 1; if (i < 0) return;
    if (pv && pv.seg !== b.seg) a = clamp((l - (b.cardOut || 0.9) - 0.2) / 0.4); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a * 0.92;
    ctx.fillStyle = "rgba(10,4,26,0.72)"; RR(ctx, 96, 28, k.jenis === "bonus" ? 430 : 300, 66, 20); ctx.fill(); U.neon(ctx, k.besar, 120, 78, 40, k.col, { blur: 10 }); ctx.restore(); }
  for (let seg = 0; seg <= 9; seg++) { const f = K.SCENES["d10_b" + seg]; if (!f) continue;
    K.SCENES["d10_b" + seg] = function (ctx, b, l, t, TL) { f(ctx, b, l, t, TL); D.post(c => hud(c, b, l)); }; }
})(typeof window !== "undefined" ? window : globalThis);
