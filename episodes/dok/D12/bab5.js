/* D12 bab 5 — cara cek dan update (b5_1 … b5_8): menu tiga titik > Bantuan > Tentang Google Chrome, alamat chrome://settings/help, nomor versi, Luncurkan Ulang, HP Android, browser semesin, kebiasaan. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d12, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, TAU = Math.PI * 2;
  const S = {};
  const MENU = ["Tab baru", "Histori", "Download", "Setelan", "Bantuan"], SUB = ["Tentang Google Chrome", "Yang baru di Chrome", "Pusat bantuan"];

  S.b5_1 = function (ctx, b, l, t) {
    const t3 = U.at(b, "tiga titik"), tB = U.at(b, "Pilih Bantuan"), tT = U.at(b, "Tentang Google Chrome");
    const f = U.browser(ctx, 110, 120, 1700, 840, { tabs: ["Tab baru"], url: "", menu: ramp(l, t3 - 0.3, 0.3) * (1 - ramp(l, tB + 0.6, 0.4)) });
    U.judul(ctx, "Di laptop atau komputer", l, 0.3, { x: 560, y: 420, size: 64, col: C.php });
    const mx = f.mx - 500, my = f.my + 44;
    if (l > t3 + 0.7) { const a = ramp(l, t3 + 0.7, 0.25); ctx.save(); ctx.globalAlpha *= a; U.kotak(ctx, mx, my, 520, MENU.length * 84 + 30, "", { col: C.text2, fill: "rgba(30,29,35,0.99)" });
      MENU.forEach((s, i) => { const y = my + 15 + i * 84, hi = i === 4 ? ramp(l, tB - 0.1, 0.25) : 0; if (hi > 0) { ctx.fillStyle = U.rgba(C.amber, 0.25 * hi); U.rr(ctx, mx + 10, y + 4, 500, 76, 10); ctx.fill(); } T(ctx, s, mx + 40, y + 56, 40, { weight: i === 4 ? 800 : 600, color: hi > 0.5 ? C.amber : C.text }); if (i === 4) T(ctx, "›", mx + 470, y + 58, 44, { weight: 800, color: C.text2 }); }); ctx.restore(); }
    if (l > tT - 0.6) { const a = ramp(l, tT - 0.6, 0.25), sx = mx - 620, sy = my + 15 + 4 * 84 - 10; ctx.save(); ctx.globalAlpha *= a; U.kotak(ctx, sx, sy, 610, SUB.length * 84 + 30, "", { col: C.text2, fill: "rgba(30,29,35,0.99)" });
      SUB.forEach((s, i) => { const y = sy + 15 + i * 84, hi = i === 0 ? ramp(l, tT, 0.25) : 0; if (hi > 0) { ctx.fillStyle = U.rgba(C.amber, 0.25 * hi); U.rr(ctx, sx + 10, y + 4, 590, 76, 10); ctx.fill(); } T(ctx, s, sx + 40, y + 56, 40, { weight: i === 0 ? 800 : 600, color: hi > 0.5 ? C.amber : C.text }); }); ctx.restore(); }
    let [kx, ky] = U.jalan(l, t3 - 0.9, 0.8, 900, 700, f.mx - 6, f.my + 2); if (l > tB - 0.5) [kx, ky] = U.jalan(l, tB - 0.5, 0.5, f.mx - 6, f.my + 2, mx + 260, my + 15 + 4 * 84 + 40); if (l > tT - 0.4) [kx, ky] = U.jalan(l, tT - 0.4, 0.5, mx + 260, my + 15 + 4 * 84 + 40, mx - 320, my + 15 + 4 * 84 + 40);
    U.kursor(ctx, kx, ky, 1.4);
    [[t3, "1  klik ⋮"], [tB, "2  Bantuan"], [tT, "3  Tentang Google Chrome"]].forEach(([t0, s], i) => U.muncul(ctx, l, t0, 330, 560 + i * 100, () => U.pill(ctx, s, 330, 560 + i * 100, { size: 36, col: C.amber })));
  };

  const URL = "chrome://settings/help";
  function halamanTentang(ctx, f, versi, status, colS, o = {}) {
    T(ctx, "Tentang Chrome", f.x + 40, f.y + 100, 60, { weight: 900 });
    U.kotak(ctx, f.x + 40, f.y + 150, f.w - 80, 330, "", { col: C.line, fill: C.row1 });
    ctx.fillStyle = C.php; ctx.beginPath(); ctx.arc(f.x + 130, f.y + 250, 46, 0, TAU); ctx.fill(); ctx.fillStyle = C.row1; ctx.beginPath(); ctx.arc(f.x + 130, f.y + 250, 20, 0, TAU); ctx.fill();
    T(ctx, "Browser", f.x + 210, f.y + 240, 50, { weight: 800 }); if (status) T(ctx, status, f.x + 210, f.y + 298, 38, { weight: 700, color: colS || C.text2 });
    if (versi) T(ctx, "Versi " + versi, f.x + 90, f.y + 420, 46, { mono: true, weight: 600, color: C.text });
    if (o.sorot > 0) { ctx.save(); ctx.globalAlpha *= o.sorot; ctx.strokeStyle = C.amber; ctx.lineWidth = 5; U.rr(ctx, f.x + 70, f.y + 366, 760, 80, 12); ctx.stroke(); ctx.restore(); }
  }
  U.halamanTentang = halamanTentang;

  S.b5_2 = function (ctx, b, l, t) {
    const tU = U.at(b, "chrome://settings/help"), tH = U.at(b, "Halaman ini"), tV = U.at(b, "nomor versi"), tP = U.at(b, "langsung memeriksa"), typed = U.ketik(URL, l, tU - 0.2, 6.5);
    const f = U.browser(ctx, 110, 120, 1700, 840, { tabs: [l > tH - 0.3 ? "Tentang Chrome" : "Tab baru"], url: typed });
    if (l > tU - 0.4 && l < tH - 0.3) { ctx.save(); ctx.strokeStyle = C.amber; ctx.lineWidth = 4; U.rr(ctx, 220, 188, 1470, 46, 23); ctx.stroke(); ctx.restore(); }
    if (l < tH - 0.3) { U.muncul(ctx, l, tU - 0.3, 960, 560, () => { T(ctx, "ketik di kolom alamat:", 960, 500, 48, { align: "center", weight: 700, color: C.text2 }); T(ctx, URL, 960, 610, 96, { align: "center", mono: true, weight: 700, color: C.amber }); }); return; }
    const a = ramp(l, tH - 0.3, 0.4); ctx.save(); ctx.globalAlpha *= a; const cek = l > tP - 0.2;
    halamanTentang(ctx, f, "158.0.8127.••", cek ? "Memeriksa pembaruan…" : "", C.amber, { sorot: ramp(l, tV - 0.2, 0.3) * (1 - ramp(l, tP - 0.2, 0.3)) });
    if (cek) { ctx.strokeStyle = C.amber; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(f.x + f.w - 160, f.y + 270, 34, t * 5, t * 5 + 4.4); ctx.stroke(); }
    ctx.restore();
  };

  S.b5_3 = function (ctx, b, l, t) {
    const tN = U.at(b, "158.0.8127.88"), tL = U.at(b, "atau lebih tinggi");
    U.judul(ctx, "Perhatikan nomor versinya", l, 0.2, { y: 160, col: C.php });
    ["Windows", "Mac", "Linux"].forEach((s, i) => U.muncul(ctx, l, U.at(b, s) - 0.1, 620 + i * 340, 270, () => U.pill(ctx, s, 620 + i * 340, 270, { size: 42, col: C.text2 })));
    U.muncul(ctx, l, tN - 0.3, 960, 500, () => { U.versi(ctx, "158.0.8127.88", 960, 540, 190, C.term, ramp(l, tN + 1.2, 0.3)); });
    U.muncul(ctx, l, tN + 0.4, 960, 640, () => T(ctx, "sudah ditambal", 960, 650, 50, { align: "center", weight: 800, color: C.term }));
    [["158.0.8127.60", "lebih rendah: perbarui", C.red, 520], ["158.0.8127.89", "lebih tinggi: aman dari celah ini", C.term, 1400]].forEach(([v, s, col, cx], i) => U.muncul(ctx, l, tL - 0.2 + i * 0.5, cx, 850, () => { U.kotak(ctx, cx - 400, 750, 800, 200, "", { col }); U.versi(ctx, v, cx, 840, 64, col, 1); T(ctx, s, cx, 910, 38, { align: "center", weight: 700, color: col }); }));
  };

  S.b5_4 = function (ctx, b, l, t) {
    const tO = U.at(b, "mengunduh pembaruan"), tA = U.at(b, "benar-benar aktif"), tD = U.at(b, "ditutup dan dibuka"), buka = ramp(l, tD - 0.3, 0.4);
    U.judul(ctx, "Langkah yang sering terlewat", l, 0.2, { y: 150, col: C.amber });
    U.daftar(ctx, 100, 220, 880, [{ s: "Apa sebenarnya celahnya", u: 1 }, { s: "Seberapa gawat", u: 1 }, { s: "Cara cek dan update", u: 1 }, { s: "Luncurkan Ulang", samar: 1 - buka, col: C.amber }], { size: 42 });
    U.muncul(ctx, l, tO - 0.2, 1400, 330, () => { U.kotak(ctx, 1040, 240, 720, 180, "", { col: C.text2 }); U.ikon(ctx, "unduh", 1130, 330, 90, C.text2); T(ctx, "patch diunduh otomatis", 1200, 320, 40, { weight: 800 }); T(ctx, "tetapi belum aktif", 1200, 372, 36, { weight: 600, color: C.amber }); });
    U.panah(ctx, 1400, 440, 1400, 540, C.amber, eio(ramp(l, tA - 0.4, 0.4)), { lw: 8, head: 26 });
    U.muncul(ctx, l, tA - 0.1, 1400, 660, () => { U.kotak(ctx, 1040, 560, 720, 220, "", { col: C.term, glow: 0.3 }); T(ctx, "aktif setelah Chrome", 1400, 650, 46, { align: "center", weight: 800 }); T(ctx, "ditutup dan dibuka kembali", 1400, 716, 46, { align: "center", weight: 800, color: C.term }); });
  };

  S.b5_5 = function (ctx, b, l, t) {
    const tK = U.at(b, "Klik tombol"), tT = U.at(b, "tab kamu akan"), klik = tK + 1.3, gelap = ramp(l, klik + 0.2, 0.35) * (1 - ramp(l, tT, 0.5)), baru = l > klik + 0.5, tV = U.at(b, "versi lama");
    const tabs = Array.from({ length: 34 }, () => "");
    const f = U.browser(ctx, 110, 120, 1700, 840, { tabs, aktif: 33, url: URL, tw: 46 });
    halamanTentang(ctx, f, baru ? "158.0.8127.88" : "158.0.8127.60", baru ? "Chrome sudah versi terbaru" : "Pembaruan sudah diunduh, belum aktif", baru ? C.term : C.amber, { sorot: baru ? 0 : ramp(l, tV - 0.3, 0.3) });
    if (baru) U.centang(ctx, f.x + f.w - 170, f.y + 250, 70, ramp(l, klik + 0.6, 0.4), C.term);
    else { U.tombol(ctx, "Luncurkan Ulang", f.x + f.w - 300, f.y + 400, { size: 40, col: C.amber, glow: l > tK - 0.3 ? 0.5 + 0.3 * Math.sin(t * 6) : 0, tekan: l > klik - 0.05 }); const [kx, ky] = U.jalan(l, tK - 0.4, 1.4, 900, 800, f.x + f.w - 290, f.y + 412); if (l > tK - 0.5) U.kursor(ctx, kx, ky, 1.4); }
    U.muncul(ctx, l, 0.4, 960, 80, () => U.pill(ctx, "puluhan tab, terbuka berminggu-minggu", 960, 70, { size: 38, col: C.text2, fill: "rgba(11,11,13,0.96)" }));
    if (!baru) U.muncul(ctx, l, tV - 0.2, 600, 660, () => T(ctx, "masih menjalankan versi lama", f.x + 90, f.y + 560, 44, { weight: 800, color: C.red }));
    else U.muncul(ctx, l, tT, 600, 660, () => T(ctx, "semua tab dibuka kembali", f.x + 90, f.y + 560, 44, { weight: 800, color: C.term }));
    if (gelap > 0) { ctx.fillStyle = `rgba(9,9,11,${gelap})`; ctx.fillRect(110, 120, 1700, 840); }
  };

  S.b5_6 = function (ctx, b, l, t) {
    const tS = U.at(b, "Play Store"), tP = U.at(b, "foto profil"), tK = U.at(b, "Kelola aplikasi"), tC = U.at(b, "Bila Chrome"), tU = U.at(b, "ketuk Update"), tV = U.at(b, "berakhiran");
    U.judul(ctx, "Di HP Android", l, 0.2, { x: 1300, y: 170, size: 68, col: C.php });
    const f = U.hp(ctx, 520, 550, 560, 920), tahap = l < tK - 0.2 ? 0 : l < tC - 0.3 ? 1 : 2;
    if (tahap === 0) { ctx.fillStyle = C.termBg; U.rr(ctx, f.x, f.y + 10, f.w - 90, 64, 32); ctx.fill(); T(ctx, "Play Store", f.x + 26, f.y + 54, 32, { weight: 600, color: C.text2 });
      const hp = ramp(l, tP - 0.2, 0.3); ctx.fillStyle = C.php; ctx.beginPath(); ctx.arc(f.x + f.w - 36, f.y + 42, 30, 0, TAU); ctx.fill(); if (hp > 0) { ctx.save(); ctx.globalAlpha *= hp; X.glow(ctx, f.x + f.w - 36, f.y + 42, 80, C.amber, 0.8); ctx.strokeStyle = C.amber; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(f.x + f.w - 36, f.y + 42, 42, 0, TAU); ctx.stroke(); ctx.restore(); }
      for (let i = 0; i < 6; i++) { ctx.fillStyle = "rgba(238,237,242,0.12)"; U.rr(ctx, f.x + (i % 3) * 170, f.y + 130 + Math.floor(i / 3) * 210, 150, 150, 30); ctx.fill(); } }
    else if (tahap === 1) { ["Kelola aplikasi & perangkat", "Notifikasi & penawaran", "Pembayaran", "Setelan"].forEach((s, i) => { const y = f.y + 40 + i * 110, hi = i === 0 ? 1 : 0; if (hi) { ctx.fillStyle = U.rgba(C.amber, 0.22); U.rr(ctx, f.x - 6, y - 10, f.w + 12, 96, 14); ctx.fill(); } T(ctx, s, f.x + 14, y + 50, 34, { weight: hi ? 800 : 600, color: hi ? C.amber : C.text2 }); }); }
    else { T(ctx, "Update tersedia", f.x + 10, f.y + 60, 40, { weight: 800 }); U.kotak(ctx, f.x, f.y + 100, f.w, 170, "", { col: C.line, fill: C.row1 }); ctx.fillStyle = C.php; ctx.beginPath(); ctx.arc(f.x + 60, f.y + 185, 36, 0, TAU); ctx.fill(); T(ctx, "Chrome", f.x + 120, f.y + 198, 40, { weight: 800 });
      U.tombol(ctx, "Update", f.x + f.w - 110, f.y + 185, { size: 34, col: C.term, glow: l > tU - 0.2 ? 0.6 : 0, tekan: l > tU + 0.5 && l < tU + 0.8 }); }
    [[tS, "1  buka Play Store"], [tP, "2  ketuk foto profil"], [tK, "3  Kelola aplikasi & perangkat"], [tU, "4  ketuk Update di Chrome"]].forEach(([t0, s], i) => { const a = ramp(l, t0 - 0.1, 0.35); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; T(ctx, s, 960, 320 + i * 96, 52, { weight: 800, color: l > ([tP, tK, tU, 99][i]) - 0.1 ? C.text2 : C.amber }); ctx.restore(); });
    U.muncul(ctx, l, tV - 0.3, 1380, 820, () => { U.kotak(ctx, 960, 720, 840, 220, "", { col: C.term }); T(ctx, "Android, sudah di-patch:", 1000, 790, 40, { weight: 700, color: C.text2 }); U.versi(ctx, "158.0.8127.92", 1380, 890, 84, C.term, 1); });
  };

  S.b5_7 = function (ctx, b, l, t) {
    const nm = ["Chrome", "Edge", "Brave", "Opera"], pos = [[420, 300], [1500, 300], [420, 800], [1500, 800]], tM = U.at(b, "mesin yang sama"), tP = U.at(b, "periksa juga");
    U.muncul(ctx, l, tM - 0.4, 960, 550, () => { U.kotak(ctx, 700, 430, 520, 240, "", { col: C.amber, glow: 0.35 }); T(ctx, "mesin browser", 960, 530, 52, { align: "center", weight: 900, color: C.amber }); T(ctx, "yang sama", 960, 600, 52, { align: "center", weight: 900, color: C.amber }); });
    nm.forEach((s, i) => { const t0 = i === 0 ? 0.3 : U.at(b, s) - 0.1, [x, y] = pos[i]; const a = ramp(l, t0, 0.3); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.text2; ctx.lineWidth = 5; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(960 + (x < 960 ? -260 : 260), 550 + (y < 550 ? -80 : 80)); ctx.stroke(); ctx.restore();
      U.muncul(ctx, l, t0, x, y, () => U.kotak(ctx, x - 190, y - 80, 380, 160, s, { col: C.php, size: 60, weight: 900 })); });
    U.muncul(ctx, l, tP, 960, 960, () => U.pill(ctx, "periksa juga pembaruannya", 960, 950, { size: 46, col: C.term }));
    T(ctx, "nama saja, tanpa logo", 1824, 64, 26, { align: "right", weight: 600, color: C.dim });
  };

  S.b5_8 = function (ctx, b, l, t) {
    const tO = U.at(b, "pembaruan otomatis"), tT = U.at(b, "menutup Chrome");
    U.judul(ctx, "Daftar periksa", l, 0.2, { y: 150, col: C.php });
    U.daftar(ctx, 330, 220, 1260, [{ s: "Cek nomor versi", u: ramp(l, 0.4, 0.3) }, { s: "Klik Luncurkan Ulang", u: ramp(l, 0.9, 0.3) }, { s: "Pembaruan otomatis tetap menyala", u: ramp(l, tO, 0.3), a: ramp(l, tO - 0.4, 0.4) }, { s: "Tutup Chrome sepenuhnya, sekali sehari", u: ramp(l, tT + 0.4, 0.3), a: ramp(l, tT - 0.4, 0.4) }], { size: 50, rh: 130 });
  };

  U.reg(5, S);
})(typeof window !== "undefined" ? window : globalThis);
