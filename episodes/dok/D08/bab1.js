/* D08 bab 1 — LEVEL 1: Cek fakta dulu (b1_1 … b1_3). Tanggal rilis + dua konsol generik, tiga perangkat (✓ ? ✗),
   tautan palsu dicoret, batang ukuran 212 GB vs beberapa MB, lalu tanda tanya besar di atas berkas kecil. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = U.TAU;

  // ikon perangkat generik: "konsol", "pc", "hp" (x,y tengah; s ≈ tinggi)
  U.perangkat = function (ctx, x, y, s, jenis, o = {}) {
    const col = o.col || N.cyan; ctx.save(); ctx.translate(x, y); ctx.lineWidth = Math.max(4, s * 0.03); ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 18; ctx.fillStyle = "#1A0E36";
    if (jenis === "konsol") {
      RR(ctx, -s * 0.5, -s * 0.32, s, s * 0.34, s * 0.06); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col; ctx.fillRect(-s * 0.38, -s * 0.16, s * 0.3, s * 0.03); ctx.beginPath(); ctx.arc(s * 0.34, -s * 0.15, s * 0.035, 0, TAU); ctx.fill(); ctx.fillStyle = "#1A0E36";
      // stik
      ctx.beginPath(); ctx.ellipse(-s * 0.16, s * 0.3, s * 0.14, s * 0.11, 0.3, 0, TAU); ctx.ellipse(s * 0.16, s * 0.3, s * 0.14, s * 0.11, -0.3, 0, TAU); ctx.fill(); ctx.stroke();
      RR(ctx, -s * 0.22, s * 0.18, s * 0.44, s * 0.14, s * 0.05); ctx.fill(); ctx.stroke();
    } else if (jenis === "pc") {
      RR(ctx, -s * 0.5, -s * 0.45, s * 0.8, s * 0.55, s * 0.04); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.1, s * 0.1); ctx.lineTo(-s * 0.1, s * 0.28); ctx.moveTo(-s * 0.3, s * 0.3); ctx.lineTo(s * 0.1, s * 0.3); ctx.stroke();
      RR(ctx, s * 0.36, -s * 0.45, s * 0.2, s * 0.75, s * 0.03); ctx.fill(); ctx.stroke();
    } else {
      RR(ctx, -s * 0.24, -s * 0.48, s * 0.48, s * 0.96, s * 0.07); ctx.fill(); ctx.stroke(); ctx.fillStyle = col; ctx.fillRect(-s * 0.07, s * 0.38, s * 0.14, s * 0.025);
    }
    ctx.restore();
  };

  S.b1_1 = function (ctx, b, l, t) {
    const tTg = D.at(b, "sembilan belas November"), tDua = D.at(b, "dua jenis konsol"), tPS = D.at(b, "PlayStation 5"), tXb = D.at(b, "Xbox Series");
    U.ruang(ctx, t, { col: N.cyan, gx: 960, gy: 380 });
    // kalender
    const pc = U.pop(l, 0.4); if (pc.a > 0) { ctx.save(); ctx.globalAlpha *= pc.a; ctx.translate(960, 380); const k = lerp(0.7, 1, pc.sp); ctx.scale(k, k);
      U.panel(ctx, -230, -170, 460, 330, { col: N.pink }); ctx.fillStyle = N.pink; RR(ctx, -230, -170, 460, 90, 26); ctx.fill(); ctx.fillRect(-230, -110, 460, 30);
      txt(ctx, "NOVEMBER 2026", 0, -110, 46, { align: "center", weight: 900, color: "#1A0E36" }); if (l > tTg - 0.2) { const p19 = U.pop(l, tTg - 0.2); ctx.save(); ctx.scale(lerp(0.6, 1, p19.sp), lerp(0.6, 1, p19.sp)); U.neon(ctx, "19", 0, 90, 170, N.gold, { align: "center" }); ctx.restore(); } else U.neon(ctx, "?", 0, 90, 170, N.cyan, { align: "center", a: 0.5 + 0.3 * Math.sin(t * 4) }); ctx.restore(); }
    const sh = ramp(l, tDua - 0.3, 0.6);
    if (sh > 0) { ctx.save(); ctx.globalAlpha *= sh; ctx.translate(0, -sh * 120); ctx.restore(); }
    [[tPS, "PlayStation 5", 600], [tXb, "Xbox Series", 1320]].forEach(([t0, s, x]) => { const p = U.pop(l, t0 - 0.2); if (p.a <= 0) return;
      ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(x, 720); const k = lerp(0.6, 1, p.sp); ctx.scale(k, k); U.perangkat(ctx, 0, -20, 260, "konsol"); ctx.restore();
      ctx.save(); ctx.globalAlpha *= p.a; txt(ctx, s, x, 880, 56, { align: "center", weight: 900 }); ctx.restore(); U.centang(ctx, x + 190, 650, 60, ramp(l, t0 + 0.3, 0.5)); });
    D.post(c => { U.judulPop(c, "Kita mulai dari fakta", W / 2, 168, 60, l, 0.6, { col: N.cyan, a: 1 - ramp(l, tDua - 0.6, 0.25) }); U.judulPop(c, "Rilis hanya untuk dua jenis konsol", W / 2, 168, 60, l, tDua - 0.3, { col: N.cyan }); });
  };

  S.b1_2 = function (ctx, b, l, t) {
    const tPC = D.at(b, "versi untuk PC"), tHP = D.at(b, "versi untuk HP"), tSet = D.at(b, "setiap tautan"), tBuk = D.at(b, "pasti bukan");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 400 });
    const up = eio(ramp(l, tSet - 0.4, 0.8)), y0 = lerp(500, 400, up), sc = lerp(1, 0.75, up);
    const items = [["konsol", "Konsol", 0, null], ["pc", "PC", tPC, "tanya"], ["hp", "HP", tHP, "silang"]];
    items.forEach(([j, s, t0, m], i) => { const x = 480 + i * 480, a = i === 0 ? ramp(l, 0.2, 0.4) : ramp(l, t0 - 0.3, 0.4); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y0); ctx.scale(sc, sc); U.perangkat(ctx, 0, 0, 280, j, { col: [N.green, N.gold, N.red][i] });
      txt(ctx, s, 0, 230, 60, { align: "center", weight: 900 }); ctx.restore();
      const mx = x + 150 * sc, my = y0 - 140 * sc;
      if (i === 0) U.centang(ctx, mx, my, 70 * sc, ramp(l, 0.5, 0.5)); else if (m === "tanya") U.tanya(ctx, mx, my, 120 * sc, N.gold, ramp(l, t0 + 0.2, 0.3)); else U.silang(ctx, mx, my, 80 * sc, ramp(l, t0 + 0.3, 0.4)); });
    if (up > 0) { ctx.save(); ctx.globalAlpha *= up;
      ["Link GTA 6 untuk PC", "Link GTA 6 untuk Android"].forEach((s, i) => { const x = 560 + i * 800, y = 760; ctx.fillStyle = "rgba(14,6,34,0.92)"; RR(ctx, x - 330, y - 56, 660, 112, 56); ctx.fill();
        ctx.strokeStyle = D.hexA(N.red, 0.9); ctx.lineWidth = 4; ctx.stroke(); txt(ctx, s, x, y + 16, 46, { align: "center", weight: 800, color: N.ink });
        const k = ramp(l, tBuk + i * 0.2, 0.4); if (k > 0) { ctx.save(); ctx.strokeStyle = N.red; ctx.lineWidth = 8; ctx.shadowColor = N.red; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(x - 300, y); ctx.lineTo(x - 300 + 600 * k, y); ctx.stroke(); ctx.restore(); } });
      ctx.restore(); }
    D.post(c => { U.judulPop(c, "Belum ada versi PC, tidak ada versi HP", W / 2, 168, 60, l, tPC - 0.3, { col: N.violet }); U.tag(c, "pasti bukan dari Rockstar", W / 2, 880, l, tBuk + 0.3, { col: N.red, size: 50 }); });
  };

  S.b1_3 = function (ctx, b, l, t) {
    const t212 = D.at(b, "dua ratus dua belas"), tMB = D.at(b, "beberapa megabyte"), tBuk = D.at(b, "jelas bukan"), tApa = D.at(b, "sebenarnya apa"), tBoc = D.at(b, "tentang bocoran");
    U.ruang(ctx, t, { col: N.cyan, gx: 600, gy: 300 });
    const out = eio(ramp(l, tApa - 0.4, 0.7));
    if (out < 1) { ctx.save(); ctx.globalAlpha *= 1 - out;
      U.batangUkuran(ctx, 620, 820, 260, 500, [{ lab: "GTA 6 di konsol", nilai: 212, col: N.cyan, teks: "212 GB" }, { lab: "\"GTA 6\" di internet", nilai: 0.004, col: N.red, teks: "beberapa MB" }], ramp(l, 0.4, Math.max(1.8, t212 - 0.2)), { gap: 160 });
      // kalau ukurannya beberapa MB → jelas bukan gamenya
      U.silang(ctx, 1200, 660, 90, ramp(l, tBuk, 0.4)); ctx.restore(); }
    if (out > 0) { ctx.save(); ctx.globalAlpha *= out; U.berkas(ctx, 960, 560, 300, { jenis: "exe", t, mata: true, nama: "berkas \"GTA 6\" · beberapa MB", size: 48 }); U.tanya(ctx, 1240, 420, 220, N.gold, out); U.tanya(ctx, 680, 460, 150, N.gold, ramp(l, tApa + 0.3, 0.4)); ctx.restore(); }
    const kb = ramp(l, tBoc - 0.2, 0.6); if (kb > 0) { ctx.save(); ctx.globalAlpha *= kb * 0.9; ctx.fillStyle = "rgba(8,3,22,0.5)"; ctx.fillRect(0, 0, W, HH); ctx.restore(); }
    D.post(c => { U.judulPop(c, "Berapa besar GTA 6 yang asli?", W / 2, 168, 60, l, 0.4, { col: N.cyan, a: 1 - ramp(l, t212 - 0.6, 0.25) }); U.judulPop(c, "GTA 6 butuh ±212 GB di konsol", W / 2, 168, 60, l, t212 - 0.4, { col: N.cyan, a: 1 - out });
      U.judulPop(c, "Lalu, berkas kecil itu sebenarnya apa?", W / 2, 168, 60, l, tApa - 0.2, { col: N.gold }); U.tag(c, "jawabannya ada di bocoran", W / 2, 880, l, tBoc, { col: N.violet, size: 50 }); });
  };

  U.reg(1, S);
})(typeof window !== "undefined" ? window : globalThis);
