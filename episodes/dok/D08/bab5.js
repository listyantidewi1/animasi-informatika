/* D08 bab 5 — BOSS 3: Video "cara main GTA 6 di HP" (b5_1 … b5_5). Daftar video umpan (kanal disamarkan) + bot pembuatnya,
   alur video → link → survei → data diambil, ZIP terkunci yang tidak bisa diperiksa antivirus, pencuri data gamer, diagram cloud gaming. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = U.TAU, TY = 168;

  // kartu video tiruan: thumbnail neon + judul kapital + nama kanal yang disamarkan
  function kartuVideo(ctx, x, y, w, judul, seed, t, a = 1) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const th = w * 0.5;
    const r = U.rng(seed), gr = ctx.createLinearGradient(x, y, x + w, y + th); gr.addColorStop(0, ["#FF4FD8", "#FF7A5C", "#33F0FF"][seed % 3]); gr.addColorStop(1, "#2A0F45");
    ctx.fillStyle = gr; RR(ctx, x, y, w, th, 18); ctx.fill();
    U.neon(ctx, "GTA 6", x + w * 0.5, y + th * 0.5, w * 0.16, N.gold, { align: "center" }); U.perangkat(ctx, x + w * 0.82, y + th * 0.42, th * 0.5, "hp", { col: N.ink });
    ctx.fillStyle = N.red; RR(ctx, x + w * 0.04, y + th * 0.72, w * 0.26, th * 0.2, 8); ctx.fill(); txt(ctx, "GRATIS", x + w * 0.17, y + th * 0.87, th * 0.12, { align: "center", weight: 900, color: "#FFF" });
    txt(ctx, judul, x, y + th + 54, 42, { weight: 900, color: N.ink, fit: w });
    ctx.fillStyle = "rgba(255,255,255,0.18)"; RR(ctx, x, y + th + 76, w * 0.5, 30, 15); ctx.fill(); ctx.filter = "none";
    ctx.restore();
  }
  // bot penyebar
  function bot(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 6); ctx.fillStyle = "#1A0E36"; ctx.strokeStyle = N.cyan; ctx.lineWidth = 6; ctx.shadowColor = N.cyan; ctx.shadowBlur = 18;
    RR(ctx, -s * 0.4, -s * 0.32, s * 0.8, s * 0.64, s * 0.14); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s * 0.32); ctx.lineTo(0, -s * 0.5); ctx.stroke();
    ctx.fillStyle = N.red; ctx.beginPath(); ctx.arc(0, -s * 0.52, s * 0.05, 0, TAU); ctx.arc(-s * 0.15, -s * 0.05, s * 0.07, 0, TAU); ctx.arc(s * 0.15, -s * 0.05, s * 0.07, 0, TAU); ctx.fill();
    ctx.fillStyle = N.cyan; ctx.fillRect(-s * 0.18, s * 0.14, s * 0.36, s * 0.05); ctx.restore(); }

  S.b5_1 = function (ctx, b, l, t) {
    const tVid = D.at(b, "yaitu video"), tHP = D.at(b, "cara main GTA 6 di HP"), tPC = D.at(b, "di PC sekarang"), tBot = D.at(b, "Ingat bot"), tHas = D.at(b, "salah satu hasilnya");
    U.ruang(ctx, t, { col: N.pink, gx: 960, gy: 300 });
    const J = ["CARA MAIN GTA 6 DI HP 😱🔥", "GTA 6 PC SEKARANG JUGA!! 🔥", "GTA 6 ANDROID GRATIS 100% 😱", "MAIN GTA 6 TANPA KONSOL 🤯"];
    const sh = eio(ramp(l, tBot - 0.4, 0.8));
    ctx.save(); ctx.translate(lerp(0, 360, sh), 0);
    J.forEach((s, i) => { const t0 = [1.2, tHP, tPC, tPC + 0.8][i]; const x = 260 + (i % 2) * 640, y = 250 + Math.floor(i / 2) * 340; kartuVideo(ctx, x, y, 540, s, i + 1, t, ramp(l, t0 - 0.2, 0.4) * (1 - sh * 0.35)); });
    ctx.restore();
    if (sh > 0) { ctx.save(); ctx.globalAlpha *= sh; bot(ctx, 300, 560, 240, t); txt(ctx, "bot penyebar", 300, 760, 46, { align: "center", weight: 900, color: N.cyan });
      for (let i = 0; i < 4; i++) { const u = ((t * 0.7 + i / 4) % 1); ctx.save(); ctx.globalAlpha *= Math.sin(u * Math.PI); ctx.fillStyle = N.red; RR(ctx, lerp(420, 600, u), 520 + (i - 1.5) * 50, 70, 44, 8); ctx.fill(); ctx.restore(); } ctx.restore(); }
    D.post(c => { U.judulPop(c, "Penipuan ketiga ada di tempat kamu menonton", W / 2, TY, 56, l, 1.2, { col: N.pink, a: 1 - ramp(l, tVid - 0.5, 0.25) }); U.judulPop(c, "Video umpan: \"cara main GTA 6 di HP\"", W / 2, TY, 58, l, tVid - 0.2, { col: N.pink, a: 1 - ramp(l, tHas - 0.7, 0.3) }); U.judulPop(c, "Dibuat massal oleh bot dari paket penipuan", W / 2, TY, 56, l, tHas - 0.4, { col: N.cyan }); });
  };

  S.b5_2 = function (ctx, b, l, t) {
    const tLink = D.at(b, "link di deskripsi"), tSur = D.at(b, "mengisi survei"), tMan = D.at(b, "kamu manusia"), tUmp = D.at(b, "umpan dan tukar"), tTid = D.at(b, "tidak pernah ada"), tDat = D.at(b, "datamu sudah diambil");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 400 });
    const X = [300, 820, 1460], T = [0.3, tLink, tSur];
    // 1 video
    let a = ramp(l, T[0], 0.4); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; kartuVideo(ctx, 140, 380, 360, "CARA MAIN GTA 6...", 1, t); ctx.restore(); }
    // 2 link
    a = ramp(l, T[1] - 0.2, 0.4); if (a > 0) { U.panah(ctx, 520, 480, 640, 480, N.gold, a, 8); ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, 660, 400, 330, 160, { col: N.gold }); txt(ctx, "Deskripsi:", 690, 460, 42, { weight: 800, color: N.ink2 }); txt(ctx, "link unduh ↓", 690, 524, 46, { weight: 900, color: N.cyan }); ctx.restore(); }
    // 3 survei
    a = ramp(l, T[2] - 0.2, 0.4); if (a > 0) { U.panah(ctx, 1010, 480, 1130, 480, N.gold, a, 8); ctx.save(); ctx.globalAlpha *= a; const r = U.browser(ctx, 1150, 260, 640, 560, { url: "survei.contoh" });
      txt(ctx, "Buktikan kamu manusia", r.x + r.w / 2, r.y + 60, 42, { align: "center", weight: 900, color: "#1A0E36", fit: r.w - 30 });
      ["Nama", "Nomor HP", "Email"].forEach((s, i) => { const y = r.y + 100 + i * 92; ctx.fillStyle = "#E3DDF0"; RR(ctx, r.x + 30, y, r.w - 60, 70, 12); ctx.fill(); const f = ramp(l, tMan + 0.3 + i * 0.5, 0.4);
        txt(ctx, f > 0 ? s + ": ••••••" : s, r.x + 54, y + 48, 40, { weight: 700, color: "#5A4F80" }); });
      ctx.restore(); }
    // data diambil, game tidak ada
    const td = ramp(l, tTid - 0.2, 0.4); if (td > 0) { ctx.save(); ctx.globalAlpha *= td; U.berkas(ctx, 830, 760, 140, { jenis: "game", a: 0.35 }); ctx.restore(); U.silang(ctx, 830, 760, 120, ramp(l, tTid, 0.4)); ctx.save(); ctx.globalAlpha *= td; txt(ctx, "gamenya tidak ada", 830, 900, 44, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
    const dd = ramp(l, tDat - 0.2, 0.5); if (dd > 0) { ctx.save(); ctx.globalAlpha *= dd; ctx.fillStyle = N.red; RR(ctx, 1180, 740, 580, 70, 16); ctx.fill(); txt(ctx, "Datamu terkirim ke penipu", 1470, 790, 42, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore(); }
    D.post(c => { U.judulPop(c, "Dari video, ke link, ke survei", W / 2, TY, 60, l, 0.3, { col: N.violet, a: 1 - ramp(l, tUmp - 0.6, 0.3) }); U.judulPop(c, "Umpan dan tukar (bait and switch)", W / 2, TY, 60, l, tUmp - 0.3, { col: N.red }); U.sumber(c, l, tUmp, "Netcraft"); });
  };

  S.b5_3 = function (ctx, b, l, t) {
    const tTri = D.at(b, "trik yang dijanjikan"), tZip = D.at(b, "dibungkus dalam ZIP"), tPw = D.at(b, "password-nya ditulis"), tKen = D.at(b, "Kenapa repot-repot"), tTid = D.at(b, "tidak bisa dibuka"), tKot = D.at(b, "sebuah kotak terkunci"), tBuka = D.at(b, "Saat kamu sendiri"), tKel = D.at(b, "baru keluar");
    U.ruang(ctx, t, { col: N.gold, gx: 1100, gy: 420 });
    const buka = eio(ramp(l, tBuka + 0.6, 1.0));
    const zp = U.pop(l, tZip - 0.2); if (zp.a > 0) { ctx.save(); ctx.globalAlpha *= zp.a; U.berkas(ctx, 1160, 520, 340 * lerp(0.7, 1, zp.sp), { jenis: "zip", gembok: buka < 1, gembokBuka: buka, t }); ctx.restore(); }
    const pw = U.pop(l, tPw - 0.1); if (pw.a > 0) { ctx.save(); ctx.globalAlpha *= pw.a; ctx.translate(1580, 320); ctx.rotate(0.06); ctx.fillStyle = "#FFE17A"; RR(ctx, -190, -60, 380, 120, 12); ctx.fill(); txt(ctx, "Password: 1234", 0, 16, 48, { align: "center", weight: 900, color: "#2A1648" }); ctx.restore(); }
    // antivirus memeriksa: hanya melihat kotak terkunci
    const av = ramp(l, tKen - 0.2, 0.5); if (av > 0) { ctx.save(); ctx.globalAlpha *= av * (1 - buka * 0.4); U.perisai(ctx, 480, 520, 300, N.cyan, { tutup: eio(ramp(l, tTid, 0.6)) }); txt(ctx, "antivirus", 480, 760, 48, { align: "center", weight: 800, color: N.ink2 }); ctx.restore();
      const sc = ramp(l, tKen + 0.3, 0.4) * (1 - buka); if (sc > 0) { ctx.save(); ctx.globalAlpha *= sc; ctx.strokeStyle = D.hexA(N.cyan, 0.7); ctx.lineWidth = 5; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(640, 470); ctx.lineTo(960, 380); ctx.moveTo(640, 570); ctx.lineTo(960, 680); ctx.stroke(); ctx.restore(); }
      const kt = ramp(l, tKot - 0.2, 0.4) * (1 - buka); if (kt > 0) { ctx.save(); ctx.globalAlpha *= kt; ctx.fillStyle = "rgba(14,6,34,0.92)"; RR(ctx, 300, 840, 360, 76, 38); ctx.fill(); txt(ctx, "\"kotak terkunci\"", 480, 892, 44, { align: "center", weight: 900, color: N.cyan }); ctx.restore(); } }
    // malware keluar saat dibuka
    if (buka > 0) { const k = eout(ramp(l, tKel - 0.2, 0.7)); ctx.save(); ctx.globalAlpha *= clamp(buka * 2); const y = lerp(520, 300, k), x = lerp(1160, 1240, k);
      ctx.translate(x, y); ctx.scale(lerp(0.3, 1, k), lerp(0.3, 1, k)); ctx.fillStyle = "#3A0F2A"; ctx.strokeStyle = N.red; ctx.lineWidth = 6; ctx.shadowColor = N.red; ctx.shadowBlur = 24;
      ctx.beginPath(); for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU, r = 110 + (i % 2 ? 26 : 0) + Math.sin(t * 6 + i) * 6; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.85); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      U.mataJahat(ctx, 0, -10, 140, t); txt(ctx, "malware", 0, 72, 44, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
    D.post(c => { U.judulPop(c, "Trik ZIP berpassword", W / 2, TY, 62, l, tTri - 0.2, { col: N.gold, a: 1 - ramp(l, tKen - 0.6, 0.3) }); U.judulPop(c, "Antivirus tidak bisa membuka ZIP yang terkunci", W / 2, TY, 58, l, tKen - 0.3, { col: N.cyan, a: 1 - ramp(l, tBuka - 0.6, 0.3) });
      U.judulPop(c, "Kamu sendiri yang membukakan pintunya", W / 2, TY, 58, l, tBuka - 0.3, { col: N.red }); });
  };

  S.b5_4 = function (ctx, b, l, t) {
    const tMal = D.at(b, "Salah satu malware"), T = [D.at(b, "kata sandi yang tersimpan"), D.at(b, "cookie login"), D.at(b, "akun Steam"), D.at(b, "Roblox"), D.at(b, "dompet kripto")], tGam = D.at(b, "gamer muda");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 520 });
    const LAB = ["kata sandi di browser", "cookie login", "akun Steam", "akun Roblox", "dompet kripto"], COL = [N.cyan, N.gold, N.violet, N.green, N.orange];
    // pencuri di tengah
    const pc = U.pop(l, tMal - 0.2); if (pc.a > 0) { ctx.save(); ctx.globalAlpha *= pc.a; ctx.translate(960, 560); const k = lerp(0.6, 1, pc.sp); ctx.scale(k, k);
      ctx.fillStyle = "#3A0F2A"; ctx.strokeStyle = N.red; ctx.lineWidth = 7; ctx.shadowColor = N.red; ctx.shadowBlur = 26; ctx.beginPath(); ctx.moveTo(-150, -20); ctx.quadraticCurveTo(-170, 160, 0, 170); ctx.quadraticCurveTo(170, 160, 150, -20); ctx.quadraticCurveTo(0, -60, -150, -20); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-60, -40); ctx.quadraticCurveTo(0, -90, 60, -40); ctx.stroke(); ctx.shadowBlur = 0; U.mataJahat(ctx, 0, 50, 140, t); ctx.restore();
      txt(ctx, "pencuri data", 960, 800, 48, { align: "center", weight: 900, color: N.red }); }
    LAB.forEach((s, i) => { const k = ramp(l, T[i] - 0.2, 0.4); if (k <= 0) return; const a = -Math.PI / 2 + (i - 2) * 0.62, R = 470, px = 960 + Math.cos(a) * R * 1.18, py = 600 + Math.sin(a) * R * 0.75 + 80;
      const suck = eio(ramp(l, tGam - 1.5 + i * 0.12, 0.9)), x = lerp(px, 960, suck), y = lerp(py, 560, suck);
      ctx.save(); ctx.globalAlpha *= k * (1 - suck * 0.9); ctx.translate(x, y); ctx.scale(1 - suck * 0.6, 1 - suck * 0.6); ctx.fillStyle = "rgba(14,6,34,0.92)"; ctx.strokeStyle = COL[i]; ctx.lineWidth = 5; ctx.shadowColor = COL[i]; ctx.shadowBlur = 16;
      ctx.font = `900 46px ${K.FONT}`; const w = ctx.measureText(s).width + 60; RR(ctx, -w / 2, -42, w, 84, 42); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; txt(ctx, s, 0, 16, 46, { align: "center", weight: 900, color: COL[i] }); ctx.restore(); });
    D.post(c => { U.judulPop(c, "Yang dicuri dari ZIP berpassword itu", W / 2, TY, 58, l, tMal - 0.2, { col: N.red, a: 1 - ramp(l, tGam - 0.8, 0.3) }); U.judulPop(c, "Korban terbesarnya: gamer muda", W / 2, TY, 60, l, tGam - 0.5, { col: N.gold }); });
  };

  S.b5_5 = function (ctx, b, l, t) {
    const tMus = D.at(b, "benar-benar mustahil"), tSah = D.at(b, "Ada caranya yang sah"), tCl = D.at(b, "cloud gaming"), tKon = D.at(b, "konsol atau di server resmi"), tVid = D.at(b, "gambarnya sebagai video"), tTom = D.at(b, "tombol yang kamu tekan"), tNet = D.at(b, "internet yang cepat"), tApp = D.at(b, "aplikasi resmi"), tBuk = D.at(b, "bukan dari link");
    U.ruang(ctx, t, { col: N.cyan, gx: 960, gy: 380 });
    const dg = ramp(l, tCl - 0.3, 0.6);
    if (dg <= 0) { const p = U.pop(l, 0.4); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.perangkat(ctx, 960, 520, 360, "hp", { col: N.cyan }); ctx.restore(); U.tanya(ctx, 1160, 380, 180, N.gold, p.a * ramp(l, tMus - 0.4, 0.4)); } }
    if (dg > 0) { ctx.save(); ctx.globalAlpha *= dg;
      // kiri: konsol/server; kanan: HP
      U.panel(ctx, 140, 300, 560, 480, { col: N.green }); U.perangkat(ctx, 300, 470, 220, "konsol", { col: N.green }); U.server(ctx, 560, 470, 200, N.green, t);
      txt(ctx, "game berjalan di sini", 420, 690, 46, { align: "center", weight: 900 }); txt(ctx, "konsol atau server resmi", 420, 745, 40, { align: "center", weight: 700, color: N.ink2, fit: 520 });
      U.hp(ctx, 1560, 560, 600, (c, w, h, tt) => { c.fillStyle = "#000"; c.fillRect(0, 0, w, h); if (l > tVid) {
          const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5A1660"); gr.addColorStop(1, "#FF8A5C"); c.fillStyle = gr; c.fillRect(0, h * 0.25, w, h * 0.5); U.neon(c, "▶ video", w / 2, h * 0.52, w * 0.13, N.ink, { align: "center" }); } }, { t });
      // panah video →, tombol ←
      const v = ramp(l, tVid - 0.3, 0.5); if (v > 0) { U.panah(ctx, 720, 470, 1380, 470, N.cyan, v, 10); U.titikJalan(ctx, 740, 470, 1370, 470, N.cyan, t * 1.4, 6, 10); ctx.save(); ctx.globalAlpha *= v; txt(ctx, "gambar dikirim sebagai video", 1050, 430, 44, { align: "center", weight: 900, color: N.cyan }); ctx.restore(); }
      const tb = ramp(l, tTom - 0.4, 0.5); if (tb > 0) { U.panah(ctx, 1380, 640, 720, 640, N.pink, tb, 10); U.titikJalan(ctx, 1370, 640, 740, 640, N.pink, t * 1.4, 6, 8); ctx.save(); ctx.globalAlpha *= tb; txt(ctx, "sinyal tombol yang kamu tekan", 1050, 710, 44, { align: "center", weight: 900, color: N.pink }); ctx.restore(); }
      ctx.restore(); }
    const ne = U.pop(l, tNet - 0.2); if (ne.a > 0) { ctx.save(); ctx.globalAlpha *= ne.a; ctx.translate(1050, 790); ctx.strokeStyle = N.gold; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.shadowColor = N.gold; ctx.shadowBlur = 14; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(0, 30, i * 30, -Math.PI * 0.75, -Math.PI * 0.25); ctx.stroke(); } ctx.restore();
      ctx.save(); ctx.globalAlpha *= ne.a; txt(ctx, "butuh internet cepat dan stabil", 1050, 875, 44, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
    D.post(c => { U.judulPop(c, "Cara sah: cloud gaming atau remote play", W / 2, TY, 58, l, tSah - 0.2, { col: N.green, a: 1 - ramp(l, tApp - 0.6, 0.3) }); U.judulPop(c, "Mulai dari aplikasi resmi, bukan link di deskripsi", W / 2, TY, 56, l, tApp - 0.3, { col: N.green }); });
  };

  U.reg(5, S);
})(typeof window !== "undefined" ? window : globalThis);
