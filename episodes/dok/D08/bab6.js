/* D08 bab 6 — POWER-UP: Cek satu menit sebelum mengunduh (b6_1 … b6_7). Kartu daftar periksa neon di kiri (lima item terisi satu per satu,
   gaya inventory game), ilustrasi tiap item di kanan, lalu halaman pemeriksa berkas generik dengan hasil 34/68. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = U.TAU, TY = 168;
  const ITEM = ["Dari toko resmi?", "Ukurannya masuk akal?", "Akhiran .exe atau .apk?", "Izinnya wajar?", "Dikunci password?"];
  const IDS = ["b6_2", "b6_3", "b6_4", "b6_5", "b6_6"];
  const beats = () => g.__beats || [];
  // waktu centang item i (detik global): saat kata kunci jawaban item diucapkan; dipakai juga oleh beat sesudahnya
  function tCek(i) { const b = beats().find(x => x.id === IDS[i]); if (!b) return 1e9; const kunci = ["toko resmi", "masuk akal", "akhiran nama", "izin yang diminta", "dikunci dengan password"][i]; return b.start + D.at(b, kunci) + 1.2; }

  // kartu daftar periksa (x, y kiri atas); aktif = indeks item yang sedang dibahas
  function daftar(ctx, x, y, w, l, b, aktif, tMuncul) {
    const a = ramp(l, tMuncul, 0.5); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    U.panel(ctx, x, y, w, 120 + ITEM.length * 108, { col: N.green }); U.neon(ctx, "CEK 1 MENIT", x + 40, y + 82, 56, N.green, { blur: 14 });
    ITEM.forEach((s, i) => { const yy = y + 124 + i * 108, gt = b.start + l, on = clamp((gt - tCek(i)) / 0.45), act = i === aktif;
      if (act) { ctx.fillStyle = D.hexA(N.green, 0.14); RR(ctx, x + 18, yy - 8, w - 36, 104, 18); ctx.fill(); }
      ctx.save(); ctx.strokeStyle = D.hexA(N.green, on > 0 ? 1 : 0.55); ctx.lineWidth = 5; ctx.shadowColor = N.green; ctx.shadowBlur = on * 16; RR(ctx, x + 40, yy + 10, 70, 70, 14); ctx.stroke(); ctx.restore();
      U.centang(ctx, x + 75, yy + 45, 40, on);
      txt(ctx, (i + 1) + ". " + s, x + 136, yy + 62, 46, { weight: act ? 900 : 800, color: act ? N.ink : (on > 0 ? N.ink2 : D.hexA(N.ink2, 0.6)), fit: w - 170 }); });
    ctx.restore();
  }
  const KANAN = { x: 1060, y: 260, w: 760, h: 620 };
  function panelKanan(ctx, l, t0, col) { const a = ramp(l, t0, 0.4); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, KANAN.x, KANAN.y, KANAN.w, KANAN.h, { col }); ctx.restore(); } return a; }

  S.b6_1 = function (ctx, b, l, t) {
    const tLim = D.at(b, "lima pertanyaan"), tApa = D.at(b, "berkas apa pun");
    U.ruang(ctx, t, { col: N.green, gx: 960, gy: 400 });
    daftar(ctx, 560, 240, 800, l, b, -1, Math.min(tLim - 0.3, 1.6));
    D.post(c => U.judulPop(c, "Berlaku untuk berkas apa pun", W / 2, TY, 58, l, tApa - 0.3, { col: N.green }));
  };

  S.b6_2 = function (ctx, b, l, t) {
    const tTok = D.at(b, "toko resmi"), tSah = D.at(b, "yang sah"), tGr = D.at(b, "bukan dibagikan");
    U.ruang(ctx, t, { col: N.green, gx: 1400, gy: 400 });
    daftar(ctx, 100, 240, 900, l, b, 0, -1);
    const a = panelKanan(ctx, l, 0.3, N.green); if (a > 0) { ctx.save(); ctx.globalAlpha *= a;
      // toko resmi: etalase dengan kanopi
      const x = KANAN.x + 210, y = KANAN.y + 250; ctx.fillStyle = "#1A0E36"; ctx.strokeStyle = N.green; ctx.lineWidth = 6; ctx.shadowColor = N.green; ctx.shadowBlur = 16; RR(ctx, x - 140, y - 80, 280, 200, 14); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? "#1A0E36" : N.green; ctx.beginPath(); ctx.moveTo(x - 150 + i * 60, y - 80); ctx.lineTo(x - 90 + i * 60, y - 80); ctx.lineTo(x - 90 + i * 60, y - 130); ctx.lineTo(x - 150 + i * 60, y - 130); ctx.fill(); } ctx.shadowBlur = 0;
      U.centang(ctx, x, y + 20, 80, ramp(l, tTok + 0.3, 0.5)); txt(ctx, "toko resmi", x, y + 190, 46, { align: "center", weight: 900, color: N.green });
      const gx = KANAN.x + 560; const ga = ramp(l, tGr - 0.2, 0.4); ctx.globalAlpha *= 0.3 + 0.7 * ga; U.berkas(ctx, gx, y + 10, 160, { jenis: "exe", mata: true, t }); U.silang(ctx, gx, y + 10, 150, ramp(l, tGr + 0.3, 0.4));
      txt(ctx, "link di grup", gx, y + 160, 42, { align: "center", weight: 800, color: N.red }); txt(ctx, "atau deskripsi", gx, y + 210, 42, { align: "center", weight: 800, color: N.red }); ctx.restore(); }
  };

  S.b6_3 = function (ctx, b, l, t) {
    const tPul = D.at(b, "puluhan sampai ratusan"), tMB = D.at(b, "beberapa megabyte"), tBuk = D.at(b, "hampir pasti bukan");
    U.ruang(ctx, t, { col: N.green, gx: 1400, gy: 400 });
    daftar(ctx, 100, 240, 900, l, b, 1, -1);
    const a = panelKanan(ctx, l, 0.3, N.cyan); if (a > 0) { ctx.save(); ctx.globalAlpha *= a;
      U.batangUkuran(ctx, KANAN.x + 210, KANAN.y + 500, 200, 340, [{ lab: "game besar", nilai: 100, col: N.cyan, teks: "puluhan–ratusan GB" }, { lab: "palsu", nilai: 0.004, col: N.red, teks: "4 MB" }], ramp(l, tPul - 0.4, 1.6), { gap: 90 });
      U.silang(ctx, KANAN.x + 560, KANAN.y + 300, 100, ramp(l, tBuk, 0.4)); ctx.restore(); }
  };

  S.b6_4 = function (ctx, b, l, t) {
    const tExe = D.at(b, "titik exe"), tApk = D.at(b, "titik apk"), tPro = D.at(b, "program yang akan dijalankan"), tJan = D.at(b, "jangan dibuka");
    U.ruang(ctx, t, { col: N.green, gx: 1400, gy: 400 });
    daftar(ctx, 100, 240, 900, l, b, 2, -1);
    const a = panelKanan(ctx, l, 0.3, N.gold); if (a > 0) { ctx.save(); ctx.globalAlpha *= a;
      [["GTA6_PC_Full", ".exe", tExe, "di komputer"], ["GTA6_HP", ".apk", tApk, "di HP"]].forEach(([n, e, t0, k], i) => { const y = KANAN.y + 140 + i * 180, s = ramp(l, t0 - 0.2, 0.4);
        ctx.font = `900 60px ${K.FONT}`; const wn = ctx.measureText(n).width, we = ctx.measureText(e).width, x0 = KANAN.x + KANAN.w / 2 - (wn + we) / 2;
        if (s > 0) { ctx.fillStyle = D.hexA(N.red, 0.3 * s); RR(ctx, x0 + wn - 8, y - 56, we + 16, 76, 12); ctx.fill(); ctx.strokeStyle = D.hexA(N.red, s); ctx.lineWidth = 4; ctx.stroke(); }
        txt(ctx, n, x0, y, 60, { weight: 900, color: N.ink }); txt(ctx, e, x0 + wn, y, 60, { weight: 900, color: s > 0 ? N.red : N.ink }); txt(ctx, k, KANAN.x + KANAN.w / 2, y + 64, 42, { align: "center", weight: 700, color: N.ink2 }); });
      const pr = ramp(l, tPro - 0.2, 0.4); if (pr > 0) { ctx.save(); ctx.globalAlpha *= pr; txt(ctx, "= program yang akan dijalankan", KANAN.x + KANAN.w / 2, KANAN.y + 500, 44, { align: "center", weight: 900, color: N.gold, fit: KANAN.w - 60 }); ctx.restore(); }
      ctx.restore(); }
    D.post(c => U.tag(c, "sumber tidak jelas? jangan dibuka", 1440, 840, l, tJan - 0.2, { col: N.red, size: 42 }));
  };

  S.b6_5 = function (ctx, b, l, t) {
    const tWaj = D.at(b, "izin yang diminta"), tSMS = D.at(b, "SMS-mu"), tKon = D.at(b, "kontakmu"), tLay = D.at(b, "kendali atas layarmu");
    U.ruang(ctx, t, { col: N.green, gx: 1400, gy: 400 });
    daftar(ctx, 100, 240, 900, l, b, 3, -1);
    const a = panelKanan(ctx, l, 0.3, N.red); if (a > 0) { ctx.save(); ctx.globalAlpha *= a;
      [["membaca SMS", tSMS], ["membaca kontak", tKon], ["kendali layar", tLay]].forEach(([s, t0], i) => { const y = KANAN.y + 140 + i * 170, k = ramp(l, t0 - 0.2, 0.4); if (k <= 0) return;
        ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = "#F4F1FA"; RR(ctx, KANAN.x + 80, y - 60, KANAN.w - 160, 120, 20); ctx.fill(); U.bahaya(ctx, KANAN.x + 150, y, 60, N.red);
        txt(ctx, "Izinkan " + s + "?", KANAN.x + 200, y + 16, 46, { weight: 900, color: "#1A0E36", fit: KANAN.w - 300 }); ctx.restore();
        const c = ramp(l, t0 + 0.4, 0.35); if (c > 0) { ctx.save(); ctx.strokeStyle = N.red; ctx.lineWidth = 9; ctx.shadowColor = N.red; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(KANAN.x + 70, y); ctx.lineTo(KANAN.x + 70 + (KANAN.w - 140) * c, y); ctx.stroke(); ctx.restore(); } });
      ctx.restore(); }
  };

  S.b6_6 = function (ctx, b, l, t) {
    const tPw = D.at(b, "dikunci dengan password"), tBah = D.at(b, "tanda bahaya besar"), tAv = D.at(b, "agar antivirus");
    U.ruang(ctx, t, { col: N.green, gx: 1400, gy: 400 });
    daftar(ctx, 100, 240, 900, l, b, 4, -1);
    const a = panelKanan(ctx, l, 0.3, N.gold); if (a > 0) { ctx.save(); ctx.globalAlpha *= a;
      U.berkas(ctx, KANAN.x + 300, KANAN.y + 280, 280, { jenis: "zip", gembok: true, t });
      U.bahaya(ctx, KANAN.x + 560, KANAN.y + 220, 160 * (1 + 0.06 * Math.sin(t * 6)), N.red, ramp(l, tBah - 0.2, 0.4));
      const av = ramp(l, tAv, 0.4); if (av > 0) { ctx.save(); ctx.globalAlpha *= av; U.perisai(ctx, KANAN.x + 560, KANAN.y + 470, 140, N.cyan, { tutup: 1 }); ctx.restore(); }
      ctx.restore(); }
  };

  S.b6_7 = function (ctx, b, l, t) {
    const tVT = D.at(b, "VirusTotal"), tPul = D.at(b, "puluhan antivirus"), tIng = D.at(b, "Ingat berkas"), tSep = D.at(b, "Separuh");
    U.ruang(ctx, t, { col: N.cyan, gx: 960, gy: 380 });
    const r = U.browser(ctx, 200, 240, 1520, 720, { url: "virustotal.com" });
    ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.fillStyle = "#F4F1FA"; ctx.fillRect(r.x, r.y, r.w, r.h);
    const up = ramp(l, tVT, 0.5), hasil = ramp(l, tIng - 0.3, 0.5);
    if (hasil <= 0) { ctx.save(); ctx.globalAlpha *= up; ctx.strokeStyle = "#8E86B0"; ctx.lineWidth = 5; ctx.setLineDash([18, 12]); RR(ctx, r.x + r.w / 2 - 420, r.y + 30, 840, 300, 28); ctx.stroke(); ctx.setLineDash([]);
      U.panah(ctx, r.x + r.w / 2, r.y + 200, r.x + r.w / 2, r.y + 90, "#5A4F80", 1, 12); txt(ctx, "Pilih berkas untuk diperiksa", r.x + r.w / 2, r.y + 280, 50, { align: "center", weight: 900, color: "#1A0E36" }); ctx.restore();
      const pa = ramp(l, tPul - 0.2, 0.4); if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; for (let i = 0; i < 12; i++) { const x = r.x + 160 + i * 100, y = r.y + 400; U.perisai(ctx, x, y, 70, [N.cyan, N.green, N.violet][i % 3]); } txt(ctx, "diperiksa puluhan antivirus sekaligus", r.x + r.w / 2, r.y + 500, 46, { align: "center", weight: 800, color: "#5A4F80" }); ctx.restore(); } }
    else { ctx.save(); ctx.globalAlpha *= hasil;
      txt(ctx, "GTAVI.exe", r.x + 60, r.y + 90, 56, { weight: 900, color: "#1A0E36" });
      const k = eout(ramp(l, tSep - 0.6, 1.4)), n = Math.round(34 * k);
      ctx.save(); ctx.translate(r.x + 250, r.y + 340); ctx.lineWidth = 34; ctx.strokeStyle = "#E3DDF0"; ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); ctx.stroke(); ctx.strokeStyle = N.red; ctx.beginPath(); ctx.arc(0, 0, 150, -Math.PI / 2, -Math.PI / 2 + TAU * n / 68); ctx.stroke();
      txt(ctx, String(n), 0, 10, 90, { align: "center", weight: 900, color: N.red }); txt(ctx, "/ 68", 0, 70, 46, { align: "center", weight: 800, color: "#5A4F80" }); ctx.restore();
      const FL = [0, 2, 3, 5]; for (let i = 0; i < 7; i++) { const y = r.y + 150 + i * 62, fi = FL.indexOf(i), on = fi >= 0 && k > (fi + 1) / 5; ctx.fillStyle = i % 2 ? "#ECE8F6" : "#F4F1FA"; ctx.fillRect(r.x + 520, y, r.w - 560, 58);
        txt(ctx, "Antivirus " + String.fromCharCode(65 + i), r.x + 550, y + 42, 40, { weight: 700, color: "#3A3360" }); txt(ctx, on ? "Trojan" : (k > 0.9 ? "aman" : "…"), r.x + r.w - 80, y + 42, 40, { align: "right", weight: 900, color: on ? N.red : "#8E86B0" }); }
      ctx.restore(); }
    ctx.restore();
    D.post(c => U.judulPop(c, "Masih ragu? Periksa di VirusTotal", W / 2, TY, 60, l, tVT - 0.3, { col: N.cyan }));
  };

  U.reg(6, S);
})(typeof window !== "undefined" ? window : globalThis);
