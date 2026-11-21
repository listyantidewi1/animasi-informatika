/* D08 bab 0 — pembuka (b0_1 … b0_5). Kota neon 3D, isi bocoran dengan kepingan hilang, Raka dan mimpi "gratis di PC",
   berkas 4 MB di grup, peta video gaya peta game, ZIP bergembok + antivirus yang matanya tertutup. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = U.TAU;

  // daftar isi bocoran (tanpa nama berkas/torrent sungguhan)
  U.isiBocoran = function (ctx, x, y, w, l, t0, tHilang, t, o = {}) {
    const rows = [["data dunia game", N.cyan], ["model dan tekstur", N.cyan], ["suara dan musik", N.cyan], ["executable utama", N.red]];
    U.panel(ctx, x, y, w, 150 + rows.length * 96, { col: N.violet });
    txt(ctx, o.judul || "Isi bocoran build Xbox", x + 40, y + 74, 52, { weight: 900, color: N.ink });
    txt(ctx, "±209 GB", x + w - 40, y + 74, 52, { align: "right", weight: 900, color: N.gold });
    rows.forEach(([s, col], i) => { const yy = y + 130 + i * 96, a = ramp(l, t0 + i * 0.25, 0.3); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
      const miss = i === 3, h = ramp(l, tHilang, 0.3), blink = miss && h > 0 ? 0.55 + 0.45 * Math.sin(t * 9) : 1;
      ctx.fillStyle = miss && h > 0 ? D.hexA(N.red, 0.18 * blink) : "rgba(255,255,255,0.05)"; RR(ctx, x + 24, yy, w - 48, 80, 16); ctx.fill();
      if (miss && h > 0) { ctx.strokeStyle = D.hexA(N.red, blink); ctx.lineWidth = 4; ctx.setLineDash([14, 10]); ctx.stroke(); ctx.setLineDash([]); }
      U.berkas(ctx, x + 74, yy + 40, 58, { jenis: miss ? "exe" : "game", glow: 8, a: miss && h > 0 ? 0.35 : 1 });
      txt(ctx, s, x + 130, yy + 54, 44, { weight: 800, color: miss && h > 0 ? D.hexA(N.ink2, 0.6) : N.ink });
      if (!miss) U.centang(ctx, x + w - 80, yy + 40, 30, 1);
      else if (h > 0) { ctx.save(); ctx.globalAlpha *= blink; txt(ctx, "HILANG", x + w - 52, yy + 56, 46, { align: "right", weight: 900, color: N.red }); ctx.restore(); }
      ctx.restore(); });
  };

  S.b0_1 = function (ctx, b, l, t) {
    const tTapi = D.at(b, "Tapi di hari"), tCy = D.at(b, "Cyberleek"), tTor = D.at(b, "lewat torrent");
    const dm = ramp(l, tTapi - 0.2, 0.8);
    K.kota3d.draw(ctx, t, { z: t * 9, dim: 0.12 + 0.5 * dm });
    // judul pembuka di atas kota
    const a1 = ramp(l, 0.2, 0.4) * (1 - dm);
    if (a1 > 0) { U.neonPop(ctx, "GTA 6", W / 2, 470, 190, N.pink, l, 0.2, { align: "center", a: a1 }); U.judulPop(ctx, "Rilis 19 November 2026", W / 2, 620, 60, l, 1.6, { col: N.cyan, a: 1 - dm }); }
    if (dm > 0) { ctx.save(); ctx.globalAlpha *= dm; ctx.translate(0, (1 - eout(dm)) * 40);
      U.isiBocoran(ctx, 480, 300, 960, l, tTapi + 0.4, tCy + 1.2, t); ctx.restore();
      D.post(c => { U.judulPop(c, "Cyberleek mengaku membocorkan GTA 6", W / 2, 200, 64, l, tCy - 0.1, { col: N.red }); U.tag(c, "lewat torrent", W / 2, 880, l, tTor, { col: N.violet }); }); }
  };
  S.b0_1.noCam = true;

  S.b0_2 = function (ctx, b, l, t) {
    const tGr = D.at(b, "gratis di PC"), tTid = D.at(b, "Ternyata tidak"), tTah = D.at(b, "ditahan");
    U.senja(ctx, t, { dim: 0.35, sunX: 1500 });
    const scr = U.laptop(ctx, 760, 900, 640);
    // layar laptop: kotak unduhan
    ctx.save(); ctx.fillStyle = "#1A1236"; ctx.fillRect(scr.x, scr.y, scr.w, scr.h); U.berkas(ctx, scr.x + scr.w / 2, scr.y + scr.h / 2 - 10, 160, { jenis: "game", t }); ctx.restore();
    U.raka(ctx, 1260, 1010, 760, { t, pose: "berdiri", face: l < tTid ? "senang" : "bingung", look: [-0.6, 0.1] });
    const ga = ramp(l, 0.3, 0.4); U.gelembung(ctx, 1240, 210, 760, 160, ga, [1230, 380]);
    if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; txt(ctx, "GTA 6 gratis di PC!", 1240, 232, 70, { align: "center", weight: 900, color: "#2A1648" }); ctx.restore(); }
    U.silang(ctx, 1240, 210, 150, ramp(l, tTid, 0.4));
    D.post(c => U.tag(c, "berkas terpentingnya ditahan", 560, 170, l, tTah - 0.5, { col: N.red }));
  };

  // layar grup chat dengan kartu berkas (digambar di koordinat lokal layar HP)
  U.layarGrup = function (nama, berkas, ukuran, jenis, u, o = {}) {
    return (c, w, h, t) => {
      const f = w * 0.115; c.fillStyle = "#120B28"; c.fillRect(0, 0, w, h);
      c.fillStyle = "#2B1E52"; c.fillRect(0, 0, w, h * 0.12); txt(c, nama, w * 0.07, h * 0.085, f, { weight: 900, color: N.ink, fit: w * 0.86 });
      const m = o.pesan || "GTA 6 PC, gratis!"; c.fillStyle = "#2E2450"; RR(c, w * 0.05, h * 0.155, w * 0.9, h * 0.1, 18); c.fill();
      txt(c, m, w * 0.1, h * 0.22, f, { weight: 800, color: N.ink, fit: w * 0.8 });
      const a = clamp(u); if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(0, (1 - eout(a)) * 30);
      const y = h * 0.3, bh = h * 0.46; c.fillStyle = "#2E2450"; RR(c, w * 0.05, y, w * 0.9, bh, 22); c.fill(); c.strokeStyle = D.hexA(N.red, 0.9); c.lineWidth = 4; c.stroke();
      U.berkas(c, w / 2, y + bh * 0.3, bh * 0.4, { jenis, t, mata: o.mata });
      txt(c, berkas, w / 2, y + bh * 0.68, f, { align: "center", weight: 900, color: N.ink, fit: w * 0.84 });
      txt(c, ukuran, w / 2, y + bh * 0.88, f * 1.3, { align: "center", weight: 900, color: N.gold });
      c.restore();
    };
  };
  S.b0_3 = function (ctx, b, l, t) {
    const tBer = D.at(b, "kini beredar"), t4 = D.at(b, "empat megabyte");
    U.ruang(ctx, t, { col: N.pink, gx: 1400 });
    const u = ramp(l, tBer, 0.5), sh = ramp(l, t4 - 0.6, 0.6);
    U.hp(ctx, lerp(960, 560, eio(sh)), 600, 860, U.layarGrup("Grup Kelas 9B", "GTA6_PC_Full.exe", "4 MB", "exe", u, { mata: true }), { t });
    if (sh > 0) { ctx.save(); ctx.globalAlpha *= sh;
      U.batangUkuran(ctx, 1180, 810, 200, 520, [{ lab: "bocoran asli", nilai: 209, col: N.violet, teks: "209 GB" }, { lab: "berkas di grup", nilai: 0.004, col: N.red, teks: "4 MB" }], ramp(l, t4 - 0.4, 1.4), { gap: 140 });
      ctx.restore(); }
    D.post(c => U.judulPop(c, "Beredar: GTA 6 versi PC, ukurannya 4 MB", W / 2, 120, 56, l, tBer - 0.2, { col: N.red }));
  };

  // peta video: tiga pos bergaya peta level
  S.b0_4 = function (ctx, b, l, t) {
    const tA = D.at(b, "apa yang sebenarnya bocor"), tB = D.at(b, "apa isi berkas"), tC = D.at(b, "cara memeriksa");
    K.kota3d.draw(ctx, t, { z: 40 + t * 3, dim: 0.62, sway: 0.4 });
    const P = [[400, 560], [960, 470], [1520, 560]], T = [tA, tB, tC];
    ctx.save(); ctx.setLineDash([4, 26]); ctx.lineCap = "round"; ctx.strokeStyle = D.hexA(N.gold, 0.7); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(...P[0]); ctx.quadraticCurveTo(680, 380, ...P[1]); ctx.quadraticCurveTo(1240, 380, ...P[2]); ctx.stroke(); ctx.restore();
    const lab = ["Apa yang bocor", "Isi berkas 4 MB", "Cek satu menit"], ik = ["torrent", "exe", null], col = [N.cyan, N.red, N.green];
    P.forEach(([x, y], i) => { const on = ramp(l, T[i] - 0.1, 0.35), p = clamp(spring(l - T[i] + 0.1, 10, 0.5));
      ctx.save(); ctx.globalAlpha *= 0.35 + 0.65 * on; ctx.fillStyle = "rgba(14,6,34,0.92)"; ctx.beginPath(); ctx.arc(x, y, 130, 0, TAU); ctx.fill();
      ctx.shadowColor = col[i]; ctx.shadowBlur = 30 * on; ctx.strokeStyle = col[i]; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
      const s = lerp(0.85, 1.08, on > 0 ? p : 0);
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= 0.4 + 0.6 * on;
      if (ik[i]) U.berkas(ctx, 0, 0, 150, { jenis: ik[i], mata: i === 1, t });
      else { U.panel(ctx, -60, -75, 120, 150, { col: N.green, r: 16 }); for (let k = 0; k < 3; k++) { ctx.strokeStyle = D.hexA(N.green, 0.8); ctx.lineWidth = 4; ctx.strokeRect(-38, -50 + k * 42, 24, 24); U.centang(ctx, -26, -38 + k * 42, 22, on); } }
      ctx.restore();
      ctx.save(); ctx.globalAlpha *= 0.4 + 0.6 * on; txt(ctx, lab[i], x, y + 200, 50, { align: "center", weight: 900, color: on > 0.5 ? N.ink : N.ink2 }); ctx.restore(); });
    D.post(c => U.neon(c, "PETA VIDEO", W / 2, 210, 80, N.gold, { align: "center", a: ramp(l, 0.2, 0.4) }));
  };
  S.b0_4.noCam = true;

  S.b0_5 = function (ctx, b, l, t) {
    const tTr = D.at(b, "satu trik"), tAv = D.at(b, "antivirus"), tTid = D.at(b, "tidak bisa melihat"), tBab = D.at(b, "bab lima");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 420 });
    const zp = U.pop(l, tTr);
    if (zp.a > 0) { ctx.save(); ctx.globalAlpha *= zp.a; U.berkas(ctx, 1220, 500, 300 * lerp(0.7, 1, zp.sp), { jenis: "zip", gembok: true, t }); ctx.restore(); }
    const pv = U.pop(l, tAv - 0.2);
    if (pv.a > 0) { ctx.save(); ctx.globalAlpha *= pv.a; U.perisai(ctx, 680, 500, 300 * lerp(0.7, 1, pv.sp), N.cyan, { tutup: eio(ramp(l, tTid, 0.6)) }); ctx.restore();
      txt(ctx, "antivirus", 680, 740, 48, { align: "center", weight: 800, color: N.ink2 }); }
    // tatapan antivirus ke kotak: garis putus-putus, lalu "???"
    const sa = ramp(l, tTid, 0.5); if (sa > 0) { U.panah(ctx, 850, 500, 1040, 500, D.hexA(N.cyan, 0.6), 1, 6, { dash: [12, 12] }); U.tanya(ctx, 945, 400, 110, N.gold, sa); }
    D.post(c => { U.judulPop(c, "Satu trik membuat antivirus tidak bisa melihat isinya", W / 2, 190, 58, l, tTr, { col: N.gold }); U.tag(c, "Dibongkar di BOSS 3 (bab 5)", W / 2, 870, l, tBab - 0.3, { col: N.red, size: 50 }); });
  };

  U.reg(0, S);
})(typeof window !== "undefined" ? window : globalThis);
