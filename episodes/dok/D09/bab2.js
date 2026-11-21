/* D09 bab 2 — Apa sebenarnya celah keamanan itu? (b2_1 … b2_11): bug vs celah, loker memori (use-after-free),
   formulir yang meluber (out-of-bounds write), Base64 decoder, tebak, RCE, meter CVSS. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d09, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, W = 1920, HH = 1080;
  const S = {};

  S.b2_1 = function (ctx, b, l, t) {
    const tErr = U.at(b, "membuat aplikasi error"), tPintu = U.at(b, "membuka pintu");
    U.geser(ctx, l, 0.2, -200, 0, () => { const f = X.windowFrame(ctx, 110, 240, 820, 560, { title: "localhost/daftar.php" });
      if (l < tErr - 0.3) { T(ctx, "Daftar Siswa", f.x + 10, f.y + 90, 48, { weight: 800 }); [0, 1].forEach(i => { ctx.fillStyle = C.win; U.rr(ctx, f.x + 10, f.y + 140 + i * 110, f.w - 20, 80, 12); ctx.fill(); });
        ctx.fillStyle = C.php2; U.rr(ctx, f.x + 10, f.y + 370, 240, 80, 14); ctx.fill(); T(ctx, "Kirim", f.x + 130, f.y + 424, 40, { align: "center", weight: 800 });
        if (l > 1.5) { const k = (l * 1.2) % 1; ctx.fillStyle = C.amber; ctx.beginPath(); ctx.arc(f.x + 130 + 40 * Math.sin(k * 6.28), f.y + 410, 12, 0, 6.28); ctx.fill(); } }
      if (l > tErr - 0.3) { U.kotak(ctx, f.x + 10, f.y + 60, f.w - 20, 220, "", { col: C.amber, fill: U.rgba(C.amber, 0.12) });
        T(ctx, "Fatal error:", f.x + 40, f.y + 140, 48, { weight: 800, color: C.amber }); T(ctx, "Uncaught Error ... line 42", f.x + 40, f.y + 220, 40, { mono: true, weight: 500, color: C.text2 }); }
      T(ctx, "bug biasa", 520, 890, 52, { align: "center", weight: 800, color: C.amber }); });
    U.geser(ctx, l, U.at(b, "Bedanya") - 0.2, 200, 0, () => { X.windowFrame(ctx, 990, 240, 820, 560, { title: "server" });
      U.server(ctx, 1290, 540, 300, {});
      const o = eio(ramp(l, tPintu, 0.6)); ctx.save(); ctx.fillStyle = U.rgba(C.red, 0.25 + 0.3 * o); ctx.fillRect(1520, 420, 140 * o, 240); ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.strokeRect(1520, 420, 140, 240);
      ctx.fillStyle = C.lokBebas; ctx.beginPath(); ctx.moveTo(1520, 420); ctx.lineTo(1520 + 140 * (1 - o) + 20 * o, 420 + 30 * o); ctx.lineTo(1520 + 140 * (1 - o) + 20 * o, 660 - 30 * o); ctx.lineTo(1520, 660); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      U.panah(ctx, 1830, 540, 1600, 540, C.red, eio(ramp(l, tPintu + 0.4, 0.5)), { lw: 9, head: 32 });
      T(ctx, "celah keamanan", 1400, 890, 52, { align: "center", weight: 800, color: C.red }); });
  };

  // grid loker bersama untuk b2_2 dan b2_3 (12 loker, sorot indeks 3)
  const LX = 285, LY = 290;
  function lokerGrid(ctx, st, lb) { return X.loker(ctx, LX, LY, 6, 2, { state: st, labels: lb, lw: 210, lh: 220, labelSize: 30 }); }
  S.b2_2 = function (ctx, b, l, t) {
    const tPin = U.at(b, "meminjam satu loker"), tKun = U.at(b, "memegang kuncinya");
    U.judul(ctx, "Memori server = deretan loker", l, 0.3, { y: 170 });
    const st = Array(12).fill("kosong"), lb = {}; st[0] = "php"; lb[0] = "$nama"; st[8] = "php"; lb[8] = "$sesi";
    if (l > tPin) { st[3] = "php"; lb[3] = "$zonaWaktu"; }
    const cells = lokerGrid(ctx, st, lb), c = cells[3];
    if (l > tPin) X.glow(ctx, c.x + c.w / 2, c.y + c.h / 2, 200, C.php, 0.5 * ramp(l, tPin, 0.4));
    U.muncul(ctx, l, tKun - 0.2, c.x + c.w / 2, c.y + c.h + 120, () => { X.kunci(ctx, c.x + c.w / 2 - 60, c.y + c.h + 120 + Math.sin(t * 3) * 8, 1.3, C.php); });
    if (l > tKun + 0.3) T(ctx, "kunci = alamat loker", 960, 900, 44, { align: "center", weight: 700, color: C.php });
  };
  S.b2_3 = function (ctx, b, l, t) {
    const tKem = U.at(b, "dikembalikan"), tLain = U.at(b, "dipakai untuk data lain"), tLama = U.at(b, "kunci lama"), tBuka = U.at(b, "tetap membuka");
    U.judul(ctx, "Memori server = deretan loker", l, -1, { y: 170 });
    const st = Array(12).fill("kosong"), lb = {}; st[0] = "php"; lb[0] = "$nama"; st[8] = "php"; lb[8] = "$sesi";
    st[3] = l < tKem ? "php" : l < tLain ? "bebas" : l < tBuka + 0.4 ? "baru" : "rusak"; lb[3] = l < tKem ? "$zonaWaktu" : l < tLain ? "dibebaskan" : "$data_lain";
    const cells = lokerGrid(ctx, st, lb), c = cells[3];
    // kunci lama berwarna merah bergerak ke loker
    const kx0 = c.x + c.w / 2 - 60, ky0 = c.y + c.h + 120, mv = eio(ramp(l, tBuka - 0.3, 0.8));
    const kcol = l > tLama - 0.2 ? C.red : C.php; X.kunci(ctx, lerp(kx0, c.x + c.w - 40, mv), lerp(ky0, c.y + c.h - 40, mv), 1.3, kcol);
    if (l > tLama && l < tBuka + 0.5) T(ctx, "kunci lama masih tersimpan", 960, 900, 44, { align: "center", weight: 800, color: C.red });
    if (l > tBuka + 0.5) U.pill(ctx, "isinya terbaca atau tertimpa", 960, 830, { size: 44, col: C.red });
  };

  S.b2_4 = function (ctx, b, l, t) {
    const tCont = U.at(b, "misalnya celah");
    U.muncul(ctx, l, 0.2, 960, 330, () => { T(ctx, "use-after-free", 960, 340, 120, { align: "center", mono: true, weight: 700, color: C.red, glow: C.red, blur: 24 });
      T(ctx, "memakai sesuatu setelah dibebaskan", 960, 440, 52, { align: "center", weight: 600, color: C.text2 }); });
    U.geser(ctx, l, tCont - 0.2, 600, 0, () => X.kartuCVE(ctx, 460, 560, { w: 1000, h: 300, tag: "CONTOH NYATA · PHP NOVEMBER 2026", id: "CVE-2026-129496", title: "Timezone cache use-after-free", col: C.red }));
  };

  S.b2_5 = function (ctx, b, l, t) {
    const tForm = U.at(b, "Bayangkan formulir"), tTulis = U.at(b, "Kalau program tidak"), tLub = U.at(b, "meluber"), tTim = U.at(b, "menimpa kotak");
    U.muncul(ctx, l, 0.2, 960, 220, () => { T(ctx, "out-of-bounds write", 960, 230, 96, { align: "center", mono: true, weight: 700, color: C.red, glow: C.red, blur: 20 }); T(ctx, "menulis di luar batas", 960, 310, 46, { align: "center", weight: 600, color: C.text2 }); });
    const a = U.muncul(ctx, l, tForm, 960, 620, () => {
      U.kotak(ctx, 300, 430, 1320, 440, "", { col: C.line, lw: 2 }); T(ctx, "Formulir pendaftaran", 360, 500, 44, { weight: 800 });
      T(ctx, "nama (20 huruf)", 360, 580, 38, { weight: 600, color: C.text2 }); T(ctx, "peran", 1120, 580, 38, { weight: 600, color: C.text2 });
      ctx.fillStyle = C.win; ctx.fillRect(360, 610, 700, 100); ctx.fillRect(1120, 610, 440, 100);
      const n = Math.max(0, Math.floor((l - tTulis) * 10)), cap = 20, over = Math.max(0, Math.min(n - cap, 18));
      ctx.save(); ctx.font = `600 44px ${X.MONO}`; const cw = ctx.measureText("A").width; ctx.restore();
      T(ctx, "A".repeat(Math.min(n, cap)), 380, 677, 44, { mono: true, weight: 600, color: C.text });
      const hit = l > tTim - 0.2;
      if (over > 0) { const s = "A".repeat(over); T(ctx, s.slice(0, 6), 380 + cap * cw, 677, 44, { mono: true, weight: 600, color: C.red }); }
      const peran = !hit ? "siswa" : "AAAA#@!";
      if (hit) { X.glow(ctx, 1340, 660, 260, C.red, 0.4 + 0.3 * Math.sin(t * 10)); ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.strokeRect(1120, 610, 440, 100); }
      T(ctx, peran, 1140, 677, 44, { mono: true, weight: 700, color: hit ? C.red : C.term });
      ctx.strokeStyle = C.amber; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(380 + cap * cw, 600); ctx.lineTo(380 + cap * cw, 720); ctx.stroke(); ctx.setLineDash([]);
      T(ctx, "batas", 380 + cap * cw, 770, 36, { align: "center", weight: 700, color: C.amber });
    });
    if (a && l > tLub) U.pill(ctx, "meluber ke kotak sebelah", 960, 920, { size: 40, col: C.red });
  };

  S.b2_6 = function (ctx, b, l, t) {
    const tCel = U.at(b, "Celahnya ada"), tB = U.at(b, "mengubah teks"), tOut = U.at(b, "data aslinya"), tLab = U.atEnd(b, "data aslinya") + 0.2;
    U.judul(ctx, "Java4Shell", l, 0.2, { y: 190, mono: true, col: C.red, size: 72 });
    U.muncul(ctx, l, tCel - 0.3, 360, 560, () => U.kotak(ctx, 160, 480, 400, 160, "SGFsbw==", { col: C.text2, mono: true, size: 52 }));
    U.panah(ctx, 580, 560, 690, 560, C.text2, eio(ramp(l, tB - 0.2, 0.4)));
    U.muncul(ctx, l, tB - 0.2, 960, 560, () => U.kotak(ctx, 710, 450, 500, 220, "Base64\ndecoder", { col: C.red, size: 56, glow: l > tLab ? 0.5 : 0 }));
    U.panah(ctx, 1230, 560, 1340, 560, C.text2, eio(ramp(l, tOut - 0.3, 0.4)));
    U.muncul(ctx, l, tOut, 1550, 560, () => U.kotak(ctx, 1360, 480, 380, 160, "Halo", { col: C.term, size: 60, color: C.term }));
    if (l > tLab) U.muncul(ctx, l, tLab, 960, 800, () => { U.panah(ctx, 960, 760, 960, 690, C.red, 1, { lw: 7 }); U.pill(ctx, "di sinilah celahnya", 960, 820, { size: 46, col: C.red }); });
  };

  S.b2_7 = function (ctx, b, l, t) {
    U.kotak(ctx, 710, 180, 500, 200, "Base64\ndecoder", { col: C.red, size: 56 });
    U.panah(ctx, 960, 400, 960, 500, C.red, eio(ramp(l, 0.8, 0.5)), { lw: 7 });
    U.muncul(ctx, l, 1.1, 960, 630, () => { U.server(ctx, 960, 630, 210, { glow: 0.3 }); T(ctx, "diambil alih?", 1130, 660, 56, { weight: 900, color: C.amber }); });
    U.tebak(ctx, l, U.at(b, "Kenapa"), t);
  };

  S.b2_8 = function (ctx, b, l, t) {
    const tTim = U.at(b, "bisa menimpa"), tAtur = U.at(b, "Kalau penyerang"), tPer = U.at(b, "menjalankan perintahnya");
    const nm = ["data", "data", "data", "langkah\nberikutnya"], x0 = 300, w = 300, y = 330;
    nm.forEach((s, i) => { const red = i < 3 ? false : l > tTim + 1.0; U.kotak(ctx, x0 + i * (w + 30), y, w, 170, s, { col: i === 3 ? (red ? C.red : C.amber) : C.php, size: 40, mono: i < 3, color: i === 3 ? (red ? C.red : C.amber) : C.text2, fill: red ? C.redDeep : C.panel }); });
    const sw = ramp(l, tTim - 0.4, 1.6); if (sw > 0) { const xe = lerp(x0, x0 + 4 * (w + 30) - 30, eio(sw)); ctx.save(); ctx.globalAlpha *= 0.55; ctx.fillStyle = C.red; ctx.fillRect(x0, y + 186, xe - x0, 22); ctx.restore(); T(ctx, "luberan", x0 + 10, y + 256, 40, { weight: 700, color: C.red }); }
    // alur program
    const by = 730; U.muncul(ctx, l, 0.5, 520, by, () => U.kotak(ctx, 330, by - 70, 380, 140, "kode PHP-mu", { col: C.php, size: 44 }));
    const bend = eio(ramp(l, tAtur, 0.8));
    U.muncul(ctx, l, 0.9, 1400, by - 90, () => U.kotak(ctx, 1180, by - 150, 460, 120, "langkah normal", { col: bend > 0.5 ? C.line : C.text2, size: 42, color: bend > 0.5 ? C.dim : C.text }));
    U.panah(ctx, 730, by, 1170, by - 90, bend > 0.5 ? U.rgba(C.text2, 0.25) : C.text2, eio(ramp(l, 0.9, 0.6)), { dash: bend > 0.5 ? [10, 10] : null });
    if (bend > 0) U.panah(ctx, 730, by, 1170, by + 90, C.red, bend, { lw: 8 });
    U.muncul(ctx, l, tAtur + 0.5, 1410, by + 90, () => U.kotak(ctx, 1180, by + 30, 480, 120, "perintah penyerang", { col: C.red, size: 42, color: C.red, glow: l > tPer ? 0.4 : 0 }));
  };

  S.b2_9 = function (ctx, b, l, t) {
    const tJar = U.at(b, "Penyerang menjalankan"), tDuduk = U.at(b, "seolah-olah");
    U.muncul(ctx, l, 0.1, 960, 220, () => { T(ctx, "RCE", 960, 250, 150, { align: "center", weight: 900, color: C.red, glow: C.red, blur: 40 }); T(ctx, "remote code execution", 960, 330, 50, { align: "center", mono: true, weight: 600, color: C.text2 }); });
    ctx.strokeStyle = C.line; ctx.lineWidth = 3; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(960, 420); ctx.lineTo(960, 900); ctx.stroke(); ctx.setLineDash([]);
    T(ctx, "internet", 900, 900, 36, { align: "right", weight: 600, color: C.dim }); T(ctx, "servermu", 1020, 900, 36, { weight: 600, color: C.dim });
    U.muncul(ctx, l, tJar - 0.4, 480, 640, () => U.termKetik(ctx, 160, 460, 660, 320, [{ cmd: "echo halo", t0: tJar, out: [] }], l, { size: 40, contoh: false, title: "penyerang" }));
    U.muncul(ctx, l, tJar - 0.2, 1440, 640, () => { const f = X.windowFrame(ctx, 1100, 460, 660, 320, { title: "server", fill: C.termBg });
      const on = l > tJar + 1.6; if (on) { T(ctx, "halo", f.x + 10, f.y + 100, 44, { mono: true, weight: 600, color: C.red }); X.glow(ctx, 1430, 620, 300, C.red, 0.35); }
      if (on && Math.floor(l * 2.2) % 2 === 0) { ctx.fillStyle = C.red; ctx.fillRect(f.x + 10, f.y + 130, 22, 44); } });
    U.panah(ctx, 830, 620, 1090, 620, C.red, eio(ramp(l, tJar + 1.0, 0.5)), { lw: 7 });
    if (l > tDuduk) U.pill(ctx, "seperti duduk di depan servermu", 960, 404, { size: 40, col: C.red });
  };

  function meter(ctx, l, cx, cy, r, v) { X.meterCVSS(ctx, cx, cy, r, +v.toFixed(1)); }
  S.b2_10 = function (ctx, b, l, t) {
    const tSk = U.at(b, "Skor sembilan koma dua"), tBel = U.at(b, "belum tentu");
    U.judul(ctx, "Skor CVSS: 0 sampai 10", l, 0.2, { y: 170 });
    const v = 9.2 * eio(ramp(l, 1.0, Math.max(1, tSk - 1.0)));
    meter(ctx, l, 960, 560, 260, v);
    T(ctx, "0", 700, 800, 40, { align: "center", weight: 700, color: C.dim }); T(ctx, "10", 1220, 800, 40, { align: "center", weight: 700, color: C.dim });
    if (l > tSk + 0.3) U.pill(ctx, "sangat berbahaya", 960, 880, { size: 44, col: C.red });
    if (l > tBel) U.muncul(ctx, l, tBel, 1420, 420, () => { T(ctx, "untuk servermu?", 1450, 430, 52, { align: "center", weight: 800, color: C.amber }); T(ctx, "?", 1450, 560, 120, { align: "center", weight: 900, color: C.amber, glow: C.amber, blur: 24 }); });
  };
  S.b2_11 = function (ctx, b, l, t) {
    const u = eio(ramp(l, 0, 0.9)); meter(ctx, l, lerp(960, 1560, u), lerp(560, 260, u), lerp(260, 110, u), 9.2);
    ctx.save(); ctx.globalAlpha *= 1 - u; T(ctx, "untuk servermu?", 1450, 430, 52, { align: "center", weight: 800, color: C.amber }); ctx.restore();
    if (u > 0.9) T(ctx, "?", 1700, 220, 70, { align: "center", weight: 900, color: C.amber });
    U.muncul(ctx, l, U.at(b, "siapa yang menemukan"), 700, 560, () => { T(ctx, "Siapa yang menemukan?", 700, 470, 64, { align: "center", weight: 900 }); U.orang(ctx, 560, 650, 150, C.text2); U.ai(ctx, 860, 650, 150, C.php, { glow: 0.4 }); T(ctx, "+", 710, 680, 70, { align: "center", weight: 900, color: C.dim }); });
  };

  U.reg(2, S);
})(typeof window !== "undefined" ? window : globalThis);
