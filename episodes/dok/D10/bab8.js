/* D10 bab 8 — LEVEL 6: Kapan versi resmi? (b6_1 … b6_6, termasuk b6_3a dan b6_3b). Belum ada tanggal, rumor 2027, GTA 5 ±19 bulan,
   ribuan kombinasi PC, port resmi dari kode sumber, arti porting, berkas palsu, tautan ke video sebelumnya. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920;

  S.b6_1 = function (ctx, b, l, t) {
    const tTahu = D.at(b, "belum ada yang tahu");
    U.ruang(ctx, t, { col: N.gold, gx: 480, gy: 480 });
    const p = U.pop(l, 0.3); ctx.save(); ctx.globalAlpha *= p.a; I.kalender(ctx, 460, 520, 420 * lerp(0.85, 1, p.sp), N.gold); ctx.restore(); U.tanya(ctx, 460, 590, 150, N.gold, p.a * (0.7 + 0.3 * Math.sin(t * 3)));
    X.daftar(ctx, b, l, 780, 380, 1010, [{ ph: "belum mengumumkan tanggal", s: "Belum ada tanggal rilis", col: N.red, tanda: "silang" }, { ph: "bahkan belum", s: "Belum ada pengumuman versi PC", col: N.red, tanda: "silang" }], { rh: 120, size: 48 });
    X.judul(ctx, "Kapan versi PC yang resmi akan datang?", l, 0.2, N.gold);
    X.bawah(ctx, "Jawaban jujurnya: belum ada yang tahu", l, tTahu - 0.6, N.gold);
  };
  S.b6_2 = function (ctx, b, l, t) {
    const tLap = D.at(b, "laporan media"), tRum = D.at(b, "masih rumor"), tG5 = D.at(b, "GTA 5"), tBln = D.at(b, "sembilan belas bulan");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 420 });
    const p = U.pop(l, tLap - 0.2); X.kotak(ctx, 210, 262, 1000, 120, "Laporan media: awal tahun 2027", N.violet, { a: p.a, size: 54 });
    X.stempel(ctx, "MASIH RUMOR", 1520, 330, l, tRum - 0.2, N.red, { size: 56 });
    X.garisWaktu(ctx, l, 600, 300, 1620, [{ x: 440, lab: "GTA 5 di konsol", sub: "rilis pertama", col: N.cyan, t0: tG5 - 0.3, fit: 480, }, { x: 1480, lab: "GTA 5 di PC", sub: "menyusul kemudian", col: N.green, t0: tBln - 0.6, fit: 480 }], { size: 50 });
    const k = eio(ramp(l, tG5 + 0.4, Math.max(0.8, tBln - tG5 - 0.4))); if (k > 0) { ctx.save(); ctx.strokeStyle = N.gold; ctx.lineWidth = 8; ctx.shadowColor = N.gold; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(440, 600); ctx.lineTo(lerp(440, 1480, k), 600); ctx.stroke(); ctx.restore(); }
    const a = ramp(l, tBln - 0.2, 0.4); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; txt(ctx, "sekitar 19 bulan", 960, 566, 54, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
    X.judul(ctx, "Ada laporan, tetapi belum ada pengumuman", l, 0.2, N.violet);
    X.sumber(ctx, l, tLap, "GamesBeat (laporan, bukan pengumuman resmi)");
  };
  S.b6_3 = function (ctx, b, l, t) {
    const tKon = D.at(b, "segelintir model"), tPC = D.at(b, "ribuan kombinasi"), tSatu = D.at(b, "Membuat game berjalan"), tBesar = D.at(b, "Membuatnya berjalan lancar");
    U.ruang(ctx, t, { col: N.cyan, gx: 1240, gy: 440 });
    const p1 = U.pop(l, tKon - 0.4); X.kartu(ctx, { x: 110, y: 270, w: 480, h: 480, cx: 350 }, { col: N.pink, ikon: I.konsol, judul: "Konsol", sub: "segelintir model", a: p1.a, sp: p1.sp });
    const p2 = U.pop(l, tPC - 0.5); if (p2.a > 0) { ctx.save(); ctx.globalAlpha *= p2.a; U.panel(ctx, 650, 262, 1160, 506, { col: N.cyan }); const R = U.rng(11), cols = [N.cyan, N.pink, N.gold, N.green, N.violet], n = 48, sh = Math.floor(clamp((l - (tPC - 0.4)) / 2.4) * n);
      for (let i = 0; i < n; i++) { const cx = 690 + (i % 12) * 91, cy = 288 + Math.floor(i / 12) * 84, c1 = cols[Math.floor(R() * 5)], c2 = cols[Math.floor(R() * 5)], c3 = cols[Math.floor(R() * 5)]; if (i > sh) continue;
        ctx.fillStyle = "rgba(10,6,26,0.9)"; RR(ctx, cx, cy, 76, 68, 10); ctx.fill(); ctx.fillStyle = c1; ctx.fillRect(cx + 10, cy + 12, 56, 10); ctx.fillStyle = c2; ctx.fillRect(cx + 10, cy + 29, 40, 10); ctx.fillStyle = c3; ctx.fillRect(cx + 10, cy + 46, 48, 10); }
      txt(ctx, "PC: ribuan kombinasi", 1230, 682, 50, { align: "center", weight: 900 }); txt(ctx, "prosesor, kartu grafis, dan memori", 1230, 738, 40, { align: "center", weight: 700, color: N.ink2 }); ctx.restore(); }
    X.judul(ctx, "Mengapa selama itu, padahal prosesornya sekeluarga?", l, 0.2, N.cyan);
    X.bawah(ctx, "Membuat game berjalan itu satu hal", l, tSatu - 0.2, N.ink2, { a: 1 - ramp(l, tBesar - 0.3, 0.3) });
    X.bawah(ctx, "Lancar di semua kombinasi adalah hal yang jauh lebih besar", l, tBesar, N.gold, { size: 46 });
  };
  S.b6_3a = function (ctx, b, l, t) {
    const tRes = D.at(b, "memegang resepnya"), tTid = D.at(b, "tidak perlu menerjemahkan"), tGan = D.at(b, "mengganti lapisan"), tWin = D.at(b, "berbicara dengan Windows"), tKom = D.at(b, "mengompilasi ulang");
    U.ruang(ctx, t, { col: N.gold, gx: 560, gy: 440 });
    const p0 = U.pop(l, tRes - 0.3); X.kotak(ctx, 150, 300, 800, 130, "Kode sumber game (resepnya)", N.gold, { a: p0.a, size: 48 });
    const sw = eio(ramp(l, tWin - 0.5, 0.7)), pg = U.pop(l, tGan - 0.2);
    X.kotak(ctx, 150 - sw * 60, 470, 800, 130, "lapisan penghubung ke konsol", N.pink, { a: pg.a * (1 - sw), size: 42 });
    X.kotak(ctx, 150 + (1 - sw) * 60, 470, 800, 130, "lapisan penghubung ke Windows", N.cyan, { a: sw, size: 42 });
    const a = ramp(l, tGan, 0.4) ; if (a > 0) { ctx.save(); ctx.globalAlpha *= a; txt(ctx, sw > 0.5 ? "lapisan ini diganti" : "lapisan ini yang akan diganti", 550, 660, 42, { align: "center", weight: 700, color: N.ink2 }); ctx.restore(); }
    const pk = U.pop(l, tKom - 0.3); if (pk.a > 0) { ctx.save(); ctx.globalAlpha *= pk.a; U.panah(ctx, 980, 450, 1090, 450, N.gold, 1, 10); I.mesin(ctx, 1230, 450, 230, N.green, t); txt(ctx, "kompilasi ulang", 1230, 640, 44, { align: "center", weight: 800, fit: 330 });
      const k = ramp(l, tKom + 0.6, 0.5); U.panah(ctx, 1380, 450, 1456, 450, N.gold, k, 10); ctx.globalAlpha *= k; I.pc(ctx, 1610, 430, 230, N.cyan); txt(ctx, "versi PC resmi", 1610, 640, 44, { align: "center", weight: 800 }); ctx.restore(); }
    X.judul(ctx, "Port resmi dikerjakan dengan cara yang berbeda", l, 0.2, N.gold);
    X.bawah(ctx, "Tidak ada yang perlu diterjemahkan", l, tTid - 0.2, N.gold, { a: 1 - ramp(l, tKom - 0.4, 0.3) });
    X.bawah(ctx, "Dikompilasi ulang langsung dari kode sumbernya", l, tKom, N.green);
  };
  S.b6_3b = function (ctx, b, l, t) {
    const tArti = D.at(b, "Itulah arti porting"), tPor = D.at(b, "Porting berarti"), tBkn = D.at(b, "bukan hanya");
    U.ruang(ctx, t, { col: N.green, gx: 960, gy: 420 });
    const out = eio(ramp(l, tPor - 0.5, 0.5));
    ctx.save(); ctx.globalAlpha *= 1 - out * 0.75;
    X.daftar(ctx, b, l, 260, 262, 1400, [{ ph: "dukungan keyboard", s: "Dukungan keyboard dan mouse", col: N.cyan }, { ph: "pengaturan grafis", s: "Pengaturan grafis untuk komputer lemah maupun kuat", col: N.pink }, { ph: "dukungan layar lebar", s: "Dukungan layar lebar", col: N.gold }, { ph: "pengujian", s: "Pengujian di ratusan kombinasi perangkat", col: N.green }], { rh: 104 });
    ctx.restore();
    const p = U.pop(l, tPor - 0.1); if (p.a > 0) D.post(c => { c.save(); c.globalAlpha *= p.a; U.panel(c, 210, 690, 1500, 190, { col: N.gold, fill: "rgba(16,8,38,0.96)" }); txt(c, "Porting = memindahkan program ke rumah baru", 960, 762, 52, { align: "center", weight: 900, fit: 1420 });
      c.globalAlpha *= 0.3 + 0.7 * ramp(l, tBkn - 0.6, 0.4); txt(c, "sampai ia betah, bukan hanya sampai ia menyala", 960, 836, 50, { align: "center", weight: 900, color: N.gold, fit: 1420 }); c.restore(); });
    X.judul(ctx, "Sisanya adalah pekerjaan yang jarang terlihat", l, 0.2, N.green, { a: 1 - ramp(l, tArti - 0.2, 0.3) });
    X.judul(ctx, "Itulah arti porting yang sebenarnya", l, tArti, N.gold);
  };
  S.b6_4 = function (ctx, b, l, t) {
    const tSet = D.at(b, "Setiap kali"), tBer = D.at(b, "bermunculan"), tAku = D.at(b, "mengaku sebagai");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 420, dim: 0.72 });
    X.deret(ctx, b, l, t, [{ t0: tBer - 0.2, judul: "berkas “installer”", sub: "dibagikan di grup dan forum", ikon: I.peti, col: N.red }, { t0: tBer + 0.4, judul: "situs unduhan", sub: "muncul di hasil pencarian", ikon: I.os, col: N.pink }, { t0: tBer + 1.0, judul: "tautan di komentar", sub: "menumpang kabar terbaru", ikon: I.balon, col: N.violet }], { y: 280, h: 440, gap: 44, js: 46 });
    X.judul(ctx, "Kekosongan ini dimanfaatkan oleh penipu", l, 0.2, N.red);
    X.bawah(ctx, "Semuanya mengaku sebagai port PC GTA 6", l, tAku - 0.2, N.red);
  };
  S.b6_5 = function (ctx, b, l, t) {
    const tJadi = D.at(b, "Jadi, setiap installer");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 420 });
    X.daftar(ctx, b, l, 210, 290, 1500, [{ ph: "Belum ada versi PC", s: "Belum ada versi PC resmi yang bisa dimainkan", col: N.red, tanda: "silang" }, { ph: "maupun yang tidak resmi", s: "Belum ada versi PC tidak resmi yang bisa dimainkan", col: N.red, tanda: "silang" }], { rh: 116, size: 48 });
    const p = U.pop(l, tJadi - 0.1); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, 210, 560, 1500, 200, { col: N.gold, fill: "rgba(30,18,6,0.94)" }); txt(ctx, "Setiap installer GTA 6 untuk PC hari ini", 960, 636, 54, { align: "center", weight: 900, fit: 1420 }); txt(ctx, "pasti bukan gamenya", 960, 716, 60, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
    X.judul(ctx, "Ingat faktanya", l, 0.2, N.gold);
    X.status(ctx, l, tJadi + 1.0);
  };
  S.b6_6 = function (ctx, b, l, t) {
    const tVid = D.at(b, "video sebelumnya"), tDes = D.at(b, "di deskripsi"), tAkh = D.at(b, "layar akhir");
    U.ruang(ctx, t, { col: N.pink, gx: 960, gy: 420 });
    const p = U.pop(l, 0.4); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, 360, 270, 1200, 380, { col: N.pink }); U.neon(ctx, "VIDEO SEBELUMNYA", 960, 360, 56, N.pink, { align: "center", a: ramp(l, tVid - 0.4, 0.4) });
      txt(ctx, "GTA 6 Dibocorkan oleh Cyberleek", 960, 470, 60, { align: "center", weight: 900, fit: 1100 }); txt(ctx, "Lewat Torrent?", 960, 550, 60, { align: "center", weight: 900 }); txt(ctx, "isi berkas palsu dan cara memeriksanya", 960, 618, 42, { align: "center", weight: 700, color: N.ink2, fit: 1100 }); ctx.restore(); }
    U.tag(ctx, "tautan di deskripsi", 640, 760, l, tDes - 0.2, { col: N.cyan, size: 48 });
    U.tag(ctx, "dan di layar akhir", 1280, 760, l, tAkh - 0.2, { col: N.gold, size: 48 });
    X.judul(ctx, "Cara memeriksa berkas semacam itu", l, 0.2, N.pink);
  };
  X.reg(8, S);
})(typeof window !== "undefined" ? window : globalThis);
