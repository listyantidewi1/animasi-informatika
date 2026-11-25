/* D08 bab 7 — CONTINUE?: Kalau sudah terlanjur kena (b7_1 … b7_99). Garis waktu lima langkah bergaya "nyawa tambahan",
   ilustrasi tiap langkah, kembali ke senja neon (Raka menutup laptop), ajakan berbagi, catatan AI, layar akhir. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = U.TAU, TY = 168;
  const LANGKAH = ["Putuskan internet", "Ganti kata sandi", "Keluar dari semua perangkat", "Verifikasi dua langkah", "Pindai dan pulihkan"], COL = [N.cyan, N.gold, N.pink, N.green, N.violet];

  // garis waktu lima langkah di atas; aktif = indeks langkah yang sedang dibahas (selesai = sebelum aktif)
  function garis(ctx, l, aktif, tMuncul = -1) {
    const a = ramp(l, tMuncul, 0.5); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const y = 300, x0 = 300, dx = 330;
    ctx.strokeStyle = D.hexA(N.ink2, 0.35); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + dx * 4, y); ctx.stroke();
    if (aktif > 0) { ctx.strokeStyle = N.gold; ctx.shadowColor = N.gold; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + dx * Math.min(4, aktif - 1 + eio(ramp(l, 0, 0.8))), y); ctx.stroke(); ctx.shadowBlur = 0; }
    for (let i = 0; i < 5; i++) { const x = x0 + i * dx, act = i === aktif, done = i < aktif, r = act ? 46 + 3 * Math.sin(l * 5) : 36;
      ctx.save(); ctx.fillStyle = done || act ? COL[i] : "#1A0E36"; ctx.strokeStyle = COL[i]; ctx.lineWidth = 5; ctx.shadowColor = COL[i]; ctx.shadowBlur = act ? 26 : 8; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
      txt(ctx, String(i + 1), x, y + 16, 44, { align: "center", weight: 900, color: done || act ? "#1A0E36" : COL[i] }); }
    ctx.restore();
  }
  function kepala(ctx, l, i) { D.post(c => U.judulPop(c, (i + 1) + ". " + LANGKAH[i], W / 2, TY, 62, l, 0.2, { col: COL[i] })); }

  S.b7_1 = function (ctx, b, l, t) {
    const tTer = D.at(b, "sudah terlanjur"), tPan = D.at(b, "Jangan panik"), tCep = D.at(b, "bergeraklah cepat");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 500 });
    garis(ctx, l, -1, tCep - 0.6);
    const ra = ramp(l, 0.2, 0.5); ctx.save(); ctx.globalAlpha *= ra * (1 - ramp(l, tCep - 0.8, 0.5) * 0.0); U.raka(ctx, 960, 1060, 620, { t, pose: l < tPan ? "panik" : "berdiri", face: l < tPan ? "panik" : "netral", keringat: l < tPan }); ctx.restore();
    D.post(c => { U.judulPop(c, "Sudah terlanjur membuka berkasnya?", W / 2, TY, 60, l, tTer - 0.4, { col: N.gold }); U.tag(c, "jangan panik, tapi bergerak cepat", 1400, 640, l, tPan, { col: N.green, size: 46 }); });
  };

  S.b7_2 = function (ctx, b, l, t) {
    const tPut = D.at(b, "putuskan internet"), tKir = D.at(b, "terus terkirim");
    U.ruang(ctx, t, { col: N.cyan, gx: 960, gy: 600 });
    garis(ctx, l, 0); kepala(ctx, l, 0);
    const off = eio(ramp(l, tPut + 0.3, 0.6)), x = 960, y = 650;
    ctx.save(); ctx.translate(x, y); ctx.lineCap = "round"; for (let i = 1; i <= 3; i++) { ctx.strokeStyle = D.hexA(N.cyan, 1 - off * 0.75); ctx.lineWidth = 26; ctx.shadowColor = N.cyan; ctx.shadowBlur = 20 * (1 - off); ctx.beginPath(); ctx.arc(0, 60, i * 80, -Math.PI * 0.76, -Math.PI * 0.24); ctx.stroke(); }
    ctx.fillStyle = D.hexA(N.cyan, 1 - off * 0.75); ctx.beginPath(); ctx.arc(0, 60, 24, 0, TAU); ctx.fill(); ctx.restore();
    U.silang(ctx, x, y - 20, 220, off);
    // data yang tadinya mengalir ke server berhenti
    U.server(ctx, 1560, 640, 200, N.red, t); if (off < 1) U.titikJalan(ctx, 1180, 600, 1440, 620, D.hexA(N.red, 1 - off), t * 1.6, 5, 10);
    ctx.save(); ctx.globalAlpha *= ramp(l, tKir - 0.3, 0.4); txt(ctx, "data berhenti terkirim", 1500, 820, 44, { align: "center", weight: 900, color: N.green }); ctx.restore();
  };

  S.b7_3 = function (ctx, b, l, t) {
    const tGan = D.at(b, "ganti kata sandi"), tLain = D.at(b, "perangkat lain"), tEm = D.at(b, "dari email"), tKun = D.at(b, "kunci untuk memulihkan");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 600 });
    garis(ctx, l, 1); kepala(ctx, l, 1);
    // perangkat yang kena (dicoret) dan perangkat lain yang aman
    ctx.save(); ctx.globalAlpha *= 0.5; U.laptop(ctx, 380, 760, 440); ctx.restore(); U.silang(ctx, 380, 620, 120, ramp(l, tLain - 0.2, 0.4)); ctx.save(); ctx.globalAlpha *= ramp(l, tLain - 0.2, 0.4); txt(ctx, "perangkat yang kena", 380, 860, 42, { align: "center", weight: 800, color: N.red }); ctx.restore();
    const ha = ramp(l, tLain - 0.3, 0.5); if (ha > 0) { ctx.save(); ctx.globalAlpha *= ha; U.hp(ctx, 960, 600, 470, (c, w, h, tt) => { c.fillStyle = "#F4F1FA"; c.fillRect(0, 0, w, h); txt(c, "Kata sandi baru", w / 2, h * 0.16, w * 0.13, { align: "center", weight: 900, color: "#1A0E36", fit: w * 0.92 });
      [0, 1].forEach(i => { c.fillStyle = "#E3DDF0"; RR(c, w * 0.08, h * (0.3 + i * 0.16), w * 0.84, h * 0.11, 12); c.fill(); txt(c, "•".repeat(Math.round(clamp((l - tGan - i) / 1.2) * 9)), w * 0.14, h * (0.38 + i * 0.16), w * 0.1, { weight: 900, color: "#1A0E36" }); });
      c.fillStyle = N.green; RR(c, w * 0.08, h * 0.68, w * 0.84, h * 0.12, 14); c.fill(); txt(c, "Simpan", w / 2, h * 0.77, w * 0.14, { align: "center", weight: 900, color: "#0A2A1A" }); }, { t }); ctx.restore();
      ctx.save(); ctx.globalAlpha *= ha; txt(ctx, "perangkat lain yang aman", 960, 925 - 45, 42, { align: "center", weight: 800, color: N.green }); ctx.restore(); }
    // email sebagai kunci utama
    const ea = U.pop(l, tEm - 0.2); if (ea.a > 0) { ctx.save(); ctx.globalAlpha *= ea.a; ctx.translate(1520, 580); const k = lerp(0.6, 1, ea.sp); ctx.scale(k, k);
      ctx.fillStyle = "#1A0E36"; ctx.strokeStyle = N.gold; ctx.lineWidth = 7; ctx.shadowColor = N.gold; ctx.shadowBlur = 20; RR(ctx, -150, -100, 300, 200, 18); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-150, -100); ctx.lineTo(0, 20); ctx.lineTo(150, -100); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha *= ea.a; txt(ctx, "mulai dari email", 1520, 750, 48, { align: "center", weight: 900, color: N.gold }); ctx.restore();
      const kk = ramp(l, tKun - 0.2, 0.5); if (kk > 0) { ctx.save(); ctx.globalAlpha *= kk; txt(ctx, "kunci untuk memulihkan", 1520, 808, 42, { align: "center", weight: 700, color: N.ink2 }); txt(ctx, "akun-akun lain", 1520, 860, 42, { align: "center", weight: 700, color: N.ink2 }); ctx.restore(); } }
  };

  S.b7_4 = function (ctx, b, l, t) {
    const tMen = D.at(b, "keluar dari semua perangkat"), tTok = D.at(b, "Ingat token"), tTid = D.at(b, "tidak berlaku lagi");
    U.ruang(ctx, t, { col: N.pink, gx: 960, gy: 600 });
    garis(ctx, l, 2); kepala(ctx, l, 2);
    const tek = ramp(l, tMen + 0.6, 0.3), pr = tek > 0 ? 1 - 0.06 * Math.sin(tek * Math.PI) : 1;
    ctx.save(); ctx.translate(620, 640); ctx.scale(pr, pr); U.tombol(ctx, "Keluar dari semua perangkat", 0, 0, 760, 130, tek > 0.5 ? N.green : N.pink, { size: 48 }); ctx.restore();
    if (tek > 0.5) U.centang(ctx, 620, 780, 70, ramp(l, tMen + 1.0, 0.5));
    // token di server penipu hancur
    const ta = ramp(l, tTok - 0.3, 0.4); if (ta > 0) { ctx.save(); ctx.globalAlpha *= ta; U.server(ctx, 1460, 520, 200, N.red, t);
      const pec = eio(ramp(l, tTid - 0.3, 0.7)); [-1, 1].forEach(s => { ctx.save(); ctx.translate(1460 + s * pec * 80, 720 + pec * 50); ctx.rotate(s * pec * 0.6); ctx.globalAlpha *= 1 - pec * 0.7; ctx.beginPath(); ctx.rect(s < 0 ? -90 : 0, -60, 90, 120); ctx.clip(); U.token(ctx, 0, 0, 80, 1); ctx.restore(); });
      if (pec > 0.5) { ctx.save(); ctx.globalAlpha *= ramp(l, tTid + 0.2, 0.4); txt(ctx, "token curian tidak berlaku", 1420, 870, 44, { align: "center", weight: 900, color: N.green }); ctx.restore(); }
      ctx.restore(); }
  };

  S.b7_5 = function (ctx, b, l, t) {
    const tVer = D.at(b, "verifikasi dua langkah"), tApp = D.at(b, "aplikasi autentikator"), tSMS = D.at(b, "bukan hanya SMS"), tBank = D.at(b, "hubungi bank"), tRes = D.at(b, "nomor resmi");
    U.ruang(ctx, t, { col: N.green, gx: 960, gy: 600 });
    garis(ctx, l, 3); kepala(ctx, l, 3);
    // gembok ganda
    const g1 = U.pop(l, tVer - 0.2), g2 = U.pop(l, tVer + 0.4);
    if (g1.a > 0) { ctx.save(); ctx.globalAlpha *= g1.a; U.gembok(ctx, 400, 620, 200 * lerp(0.6, 1, g1.sp), N.green); ctx.restore(); }
    if (g2.a > 0) { ctx.save(); ctx.globalAlpha *= g2.a; U.gembok(ctx, 620, 620, 200 * lerp(0.6, 1, g2.sp), N.green); ctx.restore(); }
    // aplikasi autentikator: kode 6 angka yang berganti
    const aa = ramp(l, tApp - 0.3, 0.5); if (aa > 0) { ctx.save(); ctx.globalAlpha *= aa; U.hp(ctx, 1020, 590, 470, (c, w, h, tt) => { c.fillStyle = "#14102A"; c.fillRect(0, 0, w, h); txt(c, "Autentikator", w / 2, h * 0.16, w * 0.14, { align: "center", weight: 900, color: N.ink });
      const kode = String(100000 + Math.floor(U.rng(Math.floor(tt / 6))() * 899999)); txt(c, kode.slice(0, 3) + " " + kode.slice(3), w / 2, h * 0.47, w * 0.2, { align: "center", weight: 900, color: N.green });
      const u = (tt % 6) / 6; c.strokeStyle = N.green; c.lineWidth = 8; c.beginPath(); c.arc(w / 2, h * 0.66, w * 0.08, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - u)); c.stroke(); }, { t }); ctx.restore(); }
    const sm = ramp(l, tSMS - 0.2, 0.4); if (sm > 0) { ctx.save(); ctx.globalAlpha *= sm; txt(ctx, "lebih aman dari kode SMS", 1020, 920 - 40, 44, { align: "center", weight: 900, color: N.green }); ctx.restore(); }
    // bank lewat nomor resmi
    const bk = U.pop(l, tBank - 0.2); if (bk.a > 0) { ctx.save(); ctx.globalAlpha *= bk.a; ctx.translate(1520, 580); const k = lerp(0.6, 1, bk.sp); ctx.scale(k, k);
      ctx.fillStyle = "#1F6FB2"; ctx.shadowColor = "#7FB8FF"; ctx.shadowBlur = 18; RR(ctx, -180, -110, 360, 220, 22); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = N.gold; RR(ctx, -140, -50, 70, 52, 8); ctx.fill();
      txt(ctx, "KARTU BANK", 0, 70, 40, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore();
      ctx.save(); ctx.globalAlpha *= ramp(l, tRes - 0.2, 0.4); txt(ctx, "telepon nomor resmi", 1520, 760, 44, { align: "center", weight: 900, color: N.gold }); txt(ctx, "di kartu atau aplikasinya", 1520, 812, 40, { align: "center", weight: 700, color: N.ink2 }); ctx.restore(); }
  };

  S.b7_6 = function (ctx, b, l, t) {
    const tPin = D.at(b, "pindai perangkat"), tAne = D.at(b, "masih ada yang aneh"), tCad = D.at(b, "cadangkan foto"), tPab = D.at(b, "setelan pabrik");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 600 });
    garis(ctx, l, 4); kepala(ctx, l, 4);
    const r = U.laptop(ctx, 700, 900, 640);
    ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.fillStyle = "#14102A"; ctx.fillRect(r.x, r.y, r.w, r.h);
    const rs = ramp(l, tPab - 0.2, 2.0), sc = ramp(l, tPin - 0.1, Math.max(1.5, tAne - tPin));
    if (rs <= 0) { const sy = r.y + r.h * ((t * 0.6) % 1); ctx.fillStyle = D.hexA(N.cyan, 0.25); ctx.fillRect(r.x, sy - 30, r.w, 60); ctx.fillStyle = N.cyan; ctx.fillRect(r.x, sy, r.w, 4);
      txt(ctx, "Memindai… " + Math.round(sc * 100) + "%", r.x + r.w / 2, r.y + r.h / 2 + 18, 50, { align: "center", weight: 900, color: N.ink }); }
    else { txt(ctx, "Setelan pabrik", r.x + r.w / 2, r.y + r.h / 2 - 20, 50, { align: "center", weight: 900, color: N.ink }); ctx.fillStyle = "rgba(255,255,255,0.12)"; RR(ctx, r.x + 60, r.y + r.h / 2 + 20, r.w - 120, 36, 18); ctx.fill(); ctx.fillStyle = N.violet; RR(ctx, r.x + 60, r.y + r.h / 2 + 20, (r.w - 120) * eio(rs), 36, 18); ctx.fill(); }
    ctx.restore();
    U.perisai(ctx, 1080, 470, 140, N.cyan, {});
    // cadangan foto & dokumen
    const cd = ramp(l, tCad - 0.3, 0.5); if (cd > 0) { ctx.save(); ctx.globalAlpha *= cd; U.panah(ctx, 1080, 660, 1340, 660, N.gold, ramp(l, tCad, 0.5), 8);
      ctx.translate(1530, 640); ctx.fillStyle = "#1A0E36"; ctx.strokeStyle = N.gold; ctx.lineWidth = 6; ctx.shadowColor = N.gold; ctx.shadowBlur = 16; ctx.beginPath(); ctx.moveTo(-150, -90); ctx.lineTo(-50, -90); ctx.lineTo(-30, -60); ctx.lineTo(150, -60); ctx.lineTo(150, 110); ctx.lineTo(-150, 110); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha *= cd; txt(ctx, "cadangan foto", 1530, 830, 44, { align: "center", weight: 900, color: N.gold }); txt(ctx, "dan dokumen", 1530, 880, 44, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
  };

  S.b7_7 = function (ctx, b, l, t) {
    const tLua = D.at(b, "jauh di luar"), tPer = D.at(b, "memercayai orang"), tProg = D.at(b, "menjadi programmer"), tRepo = D.at(b, "repositori palsu"), tSeb = D.at(b, "sebelum menjalankan"), tDar = D.at(b, "datang dari mana");
    U.senja(ctx, t, { sunX: 1300, dim: 0.15 });
    const mid = eio(ramp(l, tProg - 0.4, 0.7)) * (1 - eio(ramp(l, tSeb - 0.5, 0.7))), akhir = eio(ramp(l, tSeb - 0.4, 0.7));
    // Raka & laptop (ditutup di akhir)
    ctx.save(); ctx.globalAlpha *= 1 - mid;
    const tutup = eio(ramp(l, tDar + 0.6, 0.8)); ctx.save(); ctx.translate(760, 930); ctx.scale(1, lerp(1, 0.06, tutup)); ctx.translate(-760, -930); const r = U.laptop(ctx, 760, 930, 560); ctx.fillStyle = "#1A1236"; ctx.fillRect(r.x, r.y, r.w, r.h); U.berkas(ctx, r.x + r.w / 2, r.y + r.h / 2, 150, { jenis: "exe" }); U.tanya(ctx, r.x + r.w / 2 + 120, r.y + 70, 90, N.gold, 1); ctx.restore();
    U.raka(ctx, 1240, 1060, 700, { t, pose: "berdiri", face: tutup > 0.5 ? "senang" : "netral", look: [-0.6, 0.2] });
    ctx.restore();
    // bagian tengah: repositori palsu
    if (mid > 0) { ctx.save(); ctx.globalAlpha *= mid; ctx.fillStyle = "rgba(10,4,26,0.6)"; ctx.fillRect(0, 0, W, HH);
      const r = U.browser(ctx, 360, 260, 1200, 600, { url: "repositori kode" }); ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.fillStyle = "#F4F1FA"; ctx.fillRect(r.x, r.y, r.w, r.h);
      txt(ctx, "alat-berguna-gratis", r.x + 50, r.y + 80, 56, { weight: 900, color: "#1A0E36" }); txt(ctx, "★ 1.2k   ⑂ 340", r.x + 50, r.y + 150, 44, { weight: 800, color: "#5A4F80" });
      ["README.md", "install.sh", "setup.exe"].forEach((s, i) => { const y = r.y + 210 + i * 80; ctx.fillStyle = i % 2 ? "#ECE8F6" : "#F4F1FA"; ctx.fillRect(r.x + 40, y, r.w - 80, 72); txt(ctx, s, r.x + 80, y + 50, 44, { weight: 700, color: i === 2 ? N.red : "#3A3360" }); });
      ctx.restore();
      const st = U.pop(l, tRepo); if (st.a > 0) { ctx.save(); ctx.globalAlpha *= st.a; ctx.translate(1240, 640); ctx.rotate(-0.12); const k = lerp(1.6, 1, st.sp); ctx.scale(k, k); ctx.strokeStyle = N.red; ctx.lineWidth = 8; ctx.fillStyle = "rgba(255,255,255,0.9)"; RR(ctx, -230, -64, 460, 128, 18); ctx.fill(); ctx.stroke(); txt(ctx, "PALSU", 0, 26, 80, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
      ctx.restore(); }
    D.post(c => { U.judulPop(c, "Menjalankan program = memercayai pembuatnya", W / 2, TY, 58, l, tPer - 0.3, { col: N.gold, a: (1 - mid) * (1 - akhir) });
      U.judulPop(c, "Penipu juga membuat repositori palsu", W / 2, TY, 58, l, tProg, { col: N.red, a: mid });
      if (akhir > 0) { c.save(); c.globalAlpha *= akhir; c.translate(W / 2, 190); const p = clamp(spring(l - tDar + 0.3, 9, 0.5)); const k = lerp(0.8, 1, p); c.scale(k, k); U.neon(c, "BERKAS INI DATANG DARI MANA?", 0, 0, 76, N.gold, { align: "center", fit: 1700 }); c.restore(); } });
  };

  S.b7_8 = function (ctx, b, l, t) {
    const tBag = D.at(b, "bagikan ke grup"), tOra = D.at(b, "orang yang paling mudah");
    U.ruang(ctx, t, { col: N.green, gx: 960, gy: 420 });
    U.hp(ctx, 620, 590, 860, U.layarGrup("Grup Kelas 9B", "Video cek berkas", "dibagikan ✓", "game", ramp(l, tBag, 0.5), { pesan: "Tonton ini dulu ya" }), { t });
    const ka = ramp(l, tOra - 0.3, 0.5); if (ka > 0) { ctx.save(); ctx.globalAlpha *= ka; [0, 1, 2, 3, 4].forEach(i => K.kit.orang.kepala(ctx, 1160 + i * 140, 600, 56, { skin: i, hair: ["pendek", "hijab", "kuncir", "uban", "panjang"][i], face: "senang", t: t + i }));
      txt(ctx, "teman, adik, orang tua", 1440, 740, 46, { align: "center", weight: 900 }); txt(ctx, "jadi tahu modusnya", 1440, 800, 46, { align: "center", weight: 800, color: N.green }); ctx.restore(); }
    D.post(c => U.judulPop(c, "Bagikan ke grup kelas atau keluargamu", W / 2, TY, 60, l, tBag - 0.3, { col: N.green }));
  };

  // layar akhir: lingkaran subscribe kiri, kotak video kanan (tempat elemen layar akhir YouTube)
  const SUB = { x: 440, y: 300, r: 118 }, SLOT = { x: 1060, y: 236, w: 760, h: 428 };
  S.b7_99 = function (ctx, b, l, t) {
    const tAI = D.at(b, "bantuan AI"), tCl = D.at(b, "Claude"), tF = D.at(b, "diperiksa faktanya"), tS = D.at(b, "disunting"), tD = D.at(b, "Semua sumber"), tEnd = D.speechEnd(b) + 1.0;
    K.kota3d.draw(ctx, t, { z: 300 + t * 4, dim: 0.55, sway: 0.4 });
    const ca = eout(ramp(l, 0.2, 0.6)) * (1 - ramp(l, tEnd, 0.6));
    if (ca > 0) D.post(c => { c.save(); c.globalAlpha *= ca; U.panel(c, 360, 170, 1200, 660, { col: N.violet, fill: "rgba(16,8,38,0.94)" });
      U.neon(c, "CATATAN TENTANG NASKAH", 960, 270, 60, N.violet, { align: "center" });
      [[tAI, "disusun dengan bantuan AI", 380], [tF, "diperiksa faktanya", 520], [tS, "disunting oleh manusia", 620], [tD, "semua sumber ada di deskripsi", 720]].forEach(([t0, s, y], i) => { const a = ramp(l, t0 - 0.2, 0.4); c.save(); c.globalAlpha *= 0.25 + 0.75 * a;
        U.centang(c, 470, y - 16, 40, a, COL[i]); txt(c, s, 530, y, 52, { weight: 900 }); if (i === 0) { c.globalAlpha *= ramp(l, tCl - 0.1, 0.4); txt(c, "termasuk Claude buatan Anthropic", 530, y + 60, 44, { weight: 700, color: N.ink2 }); } c.restore(); });
      c.restore(); });
    const ea = eout(ramp(l, tEnd + 0.4, 0.8)); if (ea <= 0) return;
    ctx.save(); ctx.globalAlpha *= ea; ctx.translate(0, (1 - ea) * 30);
    D.glow(ctx, SUB.x, SUB.y, SUB.r * 2, N.pink, 0.3 + 0.1 * Math.sin(t * 2)); for (let i = 0; i < 2; i++) { const ph = (t * 0.4 + i / 2) % 1; ctx.strokeStyle = D.hexA(N.pink, 0.5 * (1 - ph)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r * (1.08 + 0.35 * ph), 0, TAU); ctx.stroke(); }
    ctx.fillStyle = "#1A0E36"; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r, 0, TAU); ctx.fill(); ctx.strokeStyle = N.pink; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = "rgba(14,6,34,0.94)"; RR(ctx, SUB.x - 320, SUB.y + SUB.r + 22, 640, 154, 34); ctx.fill();
    txt(ctx, "I Teach", SUB.x, SUB.y + SUB.r + 76, 56, { align: "center", weight: 900, color: N.gold }); txt(ctx, "Software Engineering", SUB.x, SUB.y + SUB.r + 142, 52, { align: "center", weight: 900, color: "#FFFFFF" });
    // kotak video berikutnya
    U.panel(ctx, SLOT.x, SLOT.y, SLOT.w, SLOT.h, { col: N.cyan, fill: "rgba(14,6,34,0.7)" }); U.neon(ctx, "VIDEO BERIKUTNYA", SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h / 2 + 20, 64, N.cyan, { align: "center" });
    ctx.restore();
    U.tag(ctx, "youtube.com/@iTeachSWE", SUB.x, SUB.y + SUB.r + 250, l, tEnd + 1.2, { col: N.pink, size: 46 });
    U.tag(ctx, "sumber lengkap ada di deskripsi", SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h + 90, l, tEnd + 1.6, { col: N.violet, size: 40 });
    U.neon(ctx, "GAME OVER? BELUM. TETAP WASPADA!", W / 2, 880, 56, N.gold, { align: "center", a: ramp(l, tEnd + 2, 0.6) });
  };
  S.b7_99.noCam = true;

  U.reg(7, S);
})(typeof window !== "undefined" ? window : globalThis);
