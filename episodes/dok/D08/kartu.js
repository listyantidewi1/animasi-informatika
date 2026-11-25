/* D08 — kartu bab gaya game (menggantikan kartu bab bawaan sinema_dok lewat K.dok.cardFn), label HUD di pojok selama bab,
   dan momen "BOSS KALAH" di akhir bab BOSS. Unsur game generik saja (LEVEL, BOSS, POWER-UP, CONTINUE?), tanpa unsur khas GTA. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D, { txt, RR } = U, W = 1920, HH = 1080;
  const KARTU = {
    1: { jenis: "level", besar: "LEVEL 1", judul: "Cek Fakta Dulu", baris: "Misi: cari tahu GTA 6 sebenarnya bisa dimainkan di mana saja.", col: N.cyan },
    2: { jenis: "level", besar: "LEVEL 2", judul: "Bocoran 209 GB", baris: "Misi: temukan kepingan yang hilang dari bocoran Cyberleek.", col: N.cyan },
    3: { jenis: "boss", besar: "BOSS 1", judul: "Situs Unduhan Palsu dan Keygen", baris: "Jurus andalan: mencuri token login tanpa kata sandi.", col: N.red, ikon: "exe" },
    4: { jenis: "boss", besar: "BOSS 2", judul: "APK yang Minta Izin Aneh-Aneh", baris: "Jurus andalan: membaca kode OTP dari SMS-mu.", col: N.red, ikon: "apk" },
    5: { jenis: "boss", besar: "BOSS 3", judul: "Video “Cara Main GTA 6 di HP”", baris: "Jurus andalan: ZIP terkunci yang tidak bisa diperiksa antivirus.", col: N.red, ikon: "zip" },
    6: { jenis: "power", besar: "POWER-UP", judul: "Cek Satu Menit Sebelum Mengunduh", baris: "Lima item baru masuk ke inventory-mu.", col: N.green },
    7: { jenis: "continue", besar: "CONTINUE?", judul: "Kalau Sudah Terlanjur Kena", baris: "Masih ada kesempatan untuk menyelamatkan akunmu.", col: N.gold }
  };
  U.KARTU = KARTU;
  const beats = () => g.__beats || [];
  // waktu mulai kartu bab `seg` (detik global): di ekor beat terakhir bab sebelumnya
  function cardStart(seg) { const bs = beats(); const i = bs.findIndex(x => x.seg === seg); if (i <= 0) return 0; const pb = bs[i - 1];
    return pb.start + D.speechEnd(pb) + (pb.cardDelay != null ? pb.cardDelay : 0.3); }
  U.cardStart = cardStart;

  function glitch(ctx, draw, u) {   // u 0..1 selama 0,35 dtk pertama: irisan horizontal bergeser
    if (u >= 1) { draw(ctx); return; }
    const c = document.createElement("canvas"); c.width = W; c.height = 420; const o = c.getContext("2d"); o.translate(0, -330); draw(o);
    const r = U.rng(Math.floor(u * 12) + 3); for (let y = 0; y < 420; y += 30) { const dx = (r() - 0.5) * 180 * (1 - u); ctx.globalAlpha *= 1; ctx.drawImage(c, 0, y, W, 30, dx, 330 + y, W, 30); }
  }
  function hpBar(ctx, x, y, w, h, v, col, lab) {
    ctx.save(); ctx.fillStyle = "rgba(10,4,26,0.85)"; RR(ctx, x, y, w, h, h / 2); ctx.fill(); ctx.strokeStyle = D.hexA(col, 0.9); ctx.lineWidth = 4; ctx.stroke();
    if (v > 0.005) { ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.fillStyle = col; RR(ctx, x + 6, y + 6, (w - 12) * v, h - 12, (h - 12) / 2); ctx.fill(); }
    ctx.restore(); if (lab) txt(ctx, lab, x, y - 18, 40, { weight: 800, color: N.ink2 });
  }
  U.hpBar = hpBar;

  D.cardFn = function (ctx, seg, title, a, t) {
    const k = KARTU[seg]; if (!k || a <= 0) return; const ct = t - cardStart(seg);
    ctx.save(); ctx.globalAlpha = a;
    K.kota3d.draw(ctx, t, { dim: 0.5, z: t * 7 });
    // pita gelap di tengah
    const gr = ctx.createLinearGradient(0, 300, 0, 800); gr.addColorStop(0, "rgba(8,3,22,0)"); gr.addColorStop(0.2, "rgba(8,3,22,0.78)"); gr.addColorStop(0.8, "rgba(8,3,22,0.78)"); gr.addColorStop(1, "rgba(8,3,22,0)");
    ctx.fillStyle = gr; ctx.fillRect(0, 280, W, 540);
    const gu = clamp(ct / 0.35);
    glitch(ctx, c => U.neon(c, k.besar, W / 2, 470, 150, k.col, { align: "center" }), gu);
    const s2 = clamp((ct - 0.25) / 0.4);
    if (s2 > 0) { ctx.save(); ctx.globalAlpha *= s2; ctx.translate(0, (1 - eout(s2)) * 30);
      txt(ctx, k.judul, W / 2, 606, 80, { align: "center", weight: 900, color: N.ink, fit: 1600 });
      txt(ctx, k.baris, W / 2, 690, 46, { align: "center", weight: 700, color: N.ink2, fit: 1600 }); ctx.restore(); }
    // visual khas
    const v = clamp((ct - 0.4) / 2.6);
    if (k.jenis === "level") { const x = 560, y = 810, w = 800; txt(ctx, "MEMUAT LEVEL", x, y - 16, 40, { weight: 800, color: N.ink2 });
      ctx.save(); ctx.fillStyle = "rgba(10,4,26,0.85)"; RR(ctx, x, y, w, 34, 17); ctx.fill(); ctx.strokeStyle = D.hexA(k.col, 0.8); ctx.lineWidth = 3; ctx.stroke();
      ctx.shadowColor = k.col; ctx.shadowBlur = 14; ctx.fillStyle = k.col; RR(ctx, x + 5, y + 5, (w - 10) * eio(v), 24, 12); ctx.fill(); ctx.restore();
      txt(ctx, Math.round(eio(v) * 100) + "%", x + w + 24, y + 31, 40, { weight: 900, color: k.col }); }
    if (k.jenis === "boss") { hpBar(ctx, 560, 810, 800, 40, 1, N.red, "NYAWA BOSS"); U.berkas(ctx, 460, 826, 120, { jenis: k.ikon, mata: true, t, gembok: k.ikon === "zip" }); }
    if (k.jenis === "power") { for (let i = 0; i < 5; i++) { const on = clamp(v * 5 - i), x = 680 + i * 140, y = 830; ctx.save(); ctx.fillStyle = "rgba(10,4,26,0.85)"; RR(ctx, x - 54, y - 54, 108, 108, 20); ctx.fill();
      ctx.strokeStyle = D.hexA(N.green, 0.3 + 0.7 * on); ctx.lineWidth = 4; ctx.shadowColor = N.green; ctx.shadowBlur = 20 * on; ctx.stroke(); ctx.restore(); if (on > 0) U.centang(ctx, x, y, 44 * eout(on) + 0.01, 1); } }
    if (k.jenis === "continue") { const n = Math.max(7, 10 - Math.floor(ct)); U.neon(ctx, String(n), W / 2, 900, 120, N.gold, { align: "center" }); }
    ctx.restore();
  };

  // ---------- HUD kecil di pojok kiri atas selama bab ----------
  U.hud = function (ctx, b, l, t) {
    const k = KARTU[b.seg]; if (!k || b.noHud || b.id === "b7_99") return;
    const bs = beats(), i = bs.findIndex(x => x.id === b.id), pv = bs[i - 1]; let a = 1; if (i < 0) return;   // Short: tanpa HUD
    if (pv && pv.seg !== b.seg) a = clamp((l - (b.cardOut || 0.9) - 0.2) / 0.4);
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a * 0.92;
    ctx.fillStyle = "rgba(10,4,26,0.72)"; RR(ctx, 96, 28, k.jenis === "boss" ? 470 : 330, 66, 20); ctx.fill();
    U.neon(ctx, k.besar, 120, 78, 40, k.col, { blur: 10 });
    if (k.jenis === "boss") { // nyawa bos turun pelan sepanjang bab
      const segBeats = bs.filter(x => x.seg === b.seg), s0 = segBeats[0].start, s1 = segBeats[segBeats.length - 1].start + D.speechEnd(segBeats[segBeats.length - 1]);
      const v = 1 - 0.75 * clamp((b.start + l - s0) / (s1 - s0)); ctx.fillStyle = "rgba(255,255,255,0.12)"; RR(ctx, 330, 50, 210, 22, 11); ctx.fill();
      ctx.fillStyle = N.red; RR(ctx, 330, 50, 210 * v, 22, 11); ctx.fill(); }
    ctx.restore();
  };
  // ---------- BOSS KALAH di ekor beat terakhir bab BOSS ----------
  U.bossKalah = function (ctx, b, l, t) {
    const k = KARTU[b.seg]; if (!k || k.jenis !== "boss") return; const bs = beats(), i = bs.findIndex(x => x.id === b.id), nx = bs[i + 1]; if (i < 0) return;
    if (!nx || nx.seg === b.seg) return; const s0 = D.speechEnd(b) + 0.15, u = l - s0; if (u <= 0) return;
    ctx.save(); ctx.fillStyle = `rgba(8,3,22,${0.86 * clamp(u / 0.3)})`; ctx.fillRect(0, 0, W, HH);
    ctx.fillStyle = `rgba(10,4,26,${0.96 * clamp(u / 0.3)})`; RR(ctx, 420, 390, 1080, 400, 34); ctx.fill();
    hpBar(ctx, 560, 720, 800, 44, 0.25 * (1 - eio(clamp(u / 0.6))), N.red, "NYAWA BOSS");
    const p = clamp(spring(u - 0.5, 10, 0.5)); if (u > 0.5) { ctx.save(); ctx.translate(W / 2, 520); const s = lerp(0.6, 1, p); ctx.scale(s, s); U.neon(ctx, "BOSS KALAH!", 0, 0, 130, N.green, { align: "center", a: clamp((u - 0.5) / 0.2) }); ctx.restore(); }
    ctx.restore();
  };
  // pasang HUD + BOSS KALAH pada semua adegan D08
  // (kartu.js dimuat sesudah bab0–7.js, jadi adegan yang sudah terdaftar dibungkus di sini)
  for (let seg = 0; seg <= 7; seg++) { const f = K.SCENES["d08_b" + seg]; if (!f) continue;
    K.SCENES["d08_b" + seg] = function (ctx, b, l, t, TL) { f(ctx, b, l, t, TL); D.post(c => { U.hud(c, b, l, t); U.bossKalah(c, b, l, t); }); }; }
})(typeof window !== "undefined" ? window : globalThis);
