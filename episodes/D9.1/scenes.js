/* Adegan episode D9.1: Pseudocode Lengkap: Perulangan dan Data. Muat setelah kiko-core.js, kiko-devices.js, alur.js, memori.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, A = K.alur, M = K.memori, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const NILAI = [80, 75, 90, 60, 80];
  const pseudo = (ctx, x, y, w, lines, hl, opt = {}) => A.pseudo(ctx, x, y, w, lines.map((ln, i) => ({ ...ln, hl: i === hl })), { rh: opt.rh || 56, size: opt.size || 28, title: opt.title });
  // kata kunci tambahan (ULANGI, SELAMA, UNTUK) diwarnai lewat pemisahan di alur.js hanya untuk JIKA/MAKA/LAINNYA; cukup tebal.

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      pseudo(ctx, 620, 230, 520, [{ t: "total ← nilai1 + nilai2" }, { t: "      + nilai3 + nilai4" }, { t: "      + … + nilai32" }], -1, { title: "CARA PANJANG", rh: 50, size: 26 });
      if (l > 2.5) { arrowIcon(ctx, "right", 1200, 380, 50, C.ink2); pseudo(ctx, 1270, 230, 460, [{ t: "total ← 0" }, { t: "UNTUK i dari 1 sampai 32:", hl: true }, { t: "total ← total + nilai[i]", ind: 1 }], -1, { title: "DENGAN PERULANGAN", rh: 50, size: 24 }); }
      if (l > 5) { M.board(ctx, 620, 520, 1100, [{ name: "total", value: 385, changed: true, old: 305 }, { name: "i", value: 5 }], { bw: 200, bh: 110, h: 190 }); }
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D9.0", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Jembatan Kelas IX: Flowchart, Pseudocode, dan Tabel", 960, 500, 42, { align: "center", weight: 700, color: C.ink2 });
      ["JIKA–MAKA–LAINNYA", "Token di flowchart", "Tabel"].forEach((s, i) => { card(ctx, 420 + i * 380, 580, 340, 120, { fill: C.bg2 }); text(ctx, s, 590 + i * 380, 652, 28, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_box(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER: KOTAK BERNAMA", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const k = reveal(l, 1.5, 1.8, 3); const vals = [0, 80, 155, 245];
      M.box(ctx, 560, 520, 300, "total", vals[Math.min(k, 3)], { changed: k > 0 });
      [80, 75, 90].forEach((v, i) => M.numCard(ctx, 1000 + i * 100, 420, v, { fill: i < k ? C.goodBg : "#FFF9E0", stroke: i < k ? C.good : "#E0B04B" }));
      text(ctx, "kartu nilai", 1135, 550, 22, { align: "center", weight: 800, color: C.ink2 });
      if (k >= 1) label(ctx, "ambil kartu → tambahkan → ganti isi kotak", 1300, 650, { size: 26 });
      if (l > 7.5) banner(ctx, "variabel: namanya tetap, isinya berganti", 745, 900);
    },
    unplugged_repeat(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const steps = ["ambil kartu", "tambahkan ke isi kotak", "ganti isi kotak"]; const k = Math.floor(l / 0.9) % 3; const round = Math.min(3, Math.floor(l / 2.7) + 1);
      steps.forEach((s, i) => { card(ctx, 300, 280 + i * 120, 600, 90, { fill: i === k ? "#FFF3D6" : C.bg2, stroke: i === k ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, (i + 1) + ". " + s, 340, 338 + i * 120, 30, { weight: 900 }); });
      ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(920, 325); ctx.lineTo(980, 325); ctx.lineTo(980, 565); ctx.lineTo(920, 565); ctx.stroke(); arrowIcon(ctx, "up", 980, 440, 40, C.kiko); text(ctx, "ulang", 1030, 450, 26, { weight: 900, color: C.kiko });
      M.rounds(ctx, 1200, 300, 5, round, { label: "kartu ke-" });
      M.box(ctx, 1400, 560, 260, "total", [0, 80, 155, 245][Math.min(round, 3)], {});
      if (l > 6.5) banner(ctx, "gerakan yang sama diulang: itulah perulangan", 745, 900);
    },

    var_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 1.0, 2.4, 2);
      pseudo(ctx, 240, 240, 640, [{ t: "total ← 0" }, { t: "total ← total + 80" }], n - 1, { rh: 64, size: 32 });
      M.board(ctx, 960, 240, 740, [{ name: "total", value: n >= 2 ? 80 : n >= 1 ? 0 : null, changed: n >= 1, old: n >= 2 ? 0 : undefined }], { bw: 220, bh: 130, h: 210 });
      if (n >= 1) { text(ctx, "← dibaca: diberi nilai", 560, 480, 28, { align: "center", weight: 900, color: C.kiko }); }
      if (n >= 2) { text(ctx, "baca isi lama (0), tambah 80, simpan lagi", 1330, 520, 24, { align: "center", weight: 800, color: C.ink2 }); }
      if (l > 6.5) banner(ctx, "variabel = kotak bernama di memori", 745, 900);
    },
    var_board(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const lines = [{ t: "a ← 3" }, { t: "b ← 4" }, { t: "c ← a + b" }, { t: "a ← 10" }];
      const n = clamp(reveal(l, 0.8, 1.5, 4), 0, 4);
      pseudo(ctx, 240, 230, 600, lines, n - 1, { rh: 60, size: 30 });
      const st = [[null, null, null], [3, null, null], [3, 4, null], [3, 4, 7], [10, 4, 7]][n];
      const changed = n >= 1 ? ["a", "b", "c", "a"][n - 1] : null;
      M.board(ctx, 920, 230, 780, [["a", 0], ["b", 1], ["c", 2]].map(([nm, i]) => ({ name: nm, value: st[i], changed: changed === nm, old: nm === "a" && n === 4 ? 3 : undefined })), { bw: 200, bh: 130, h: 210 });
      if (n >= 3) text(ctx, "c tetap 7 walau a diganti: c sudah dihitung tadi", 1310, 520, 24, { align: "center", weight: 800, color: C.ink2 });
      if (l > 6.5) banner(ctx, "baris aktif menyala, kotak yang berubah menyala", 745, 1000, { size: 30 });
    },

    repeat_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      pseudo(ctx, 240, 240, 700, [{ t: "ULANGI 3 kali:" }, { t: "tulis halo", ind: 1 }], l > 1.5 ? 1 : 0, { rh: 64, size: 32 });
      if (l > 1.5) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.setLineDash([10, 8]); ctx.strokeRect(300, 370, 620, 56); ctx.setLineDash([]); label(ctx, "badan perulangan: baris yang menjorok", 1330, 330, { size: 28 }); label(ctx, "dijalankan 3 kali", 1330, 380, { size: 28, color: C.good }); }
      if (l > 4) { ["halo", "halo", "halo"].forEach((s, i) => { card(ctx, 1080 + i * 200, 440, 170, 80, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, s, 1165 + i * 200, 492, 32, { align: "center", weight: 900, color: C.good }); }); }
      if (l > 6.5) banner(ctx, "ULANGI n kali: jumlah putarannya pasti", 745, 900);
    },
    repeat_trace(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const lines = [{ t: "hitung ← 0" }, { t: "ULANGI 3 kali:" }, { t: "hitung ← hitung + 1", ind: 1 }];
      const step = clamp(Math.floor((l - 0.6) / 1.1), 0, 7); // 0: baris0, 1: ULANGI, 2:body r1, 3:ULANGI, 4:body r2, 5:ULANGI, 6:body r3, 7: selesai
      const hl = step === 0 ? 0 : step === 7 ? -1 : step % 2 === 1 ? 1 : 2; const round = Math.min(3, Math.ceil(step / 2)); const val = step === 0 ? 0 : Math.floor(step / 2);
      pseudo(ctx, 240, 230, 640, lines, hl, { rh: 60, size: 30 });
      M.board(ctx, 960, 230, 740, [{ name: "hitung", value: step >= 0 ? val : null, changed: step % 2 === 0 && step > 0 && step < 7, old: step >= 2 && step % 2 === 0 && step < 7 ? val - 1 : undefined }], { bw: 220, bh: 130, h: 210 });
      M.rounds(ctx, 980, 490, 3, step >= 7 ? 4 : round, {});
      if (step >= 7) banner(ctx, "selesai: hitung berisi 3", 745, 800, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    repeat_robot(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      pseudo(ctx, 200, 240, 520, [{ t: "maju" }, { t: "maju" }, { t: "maju" }, { t: "maju" }], -1, { title: "EMPAT BARIS", rh: 52, size: 28 });
      arrowIcon(ctx, "right", 790, 420, 50, C.ink2);
      pseudo(ctx, 860, 240, 520, [{ t: "ULANGI 4 kali:" }, { t: "maju", ind: 1 }], -1, { title: "SATU KALI TULIS", rh: 52, size: 28 });
      kiko(ctx, 1560, 420, 140, 0, { mood: "happy" });
      const u = clamp(l / 5, 0, 1);
      for (let i = 0; i < 5; i++) { ctx.fillStyle = i <= Math.floor(u * 4) ? C.goodBg : C.tile; rr(ctx, 1440 + i * 70, 560, 64, 64, 10); ctx.fill(); ctx.strokeStyle = C.tileLine; ctx.lineWidth = 2; ctx.stroke(); }
      text(ctx, "mau 10 kali? cukup ganti angkanya", 1120, 480, 26, { align: "center", weight: 800, color: C.ink2 });
      if (l > 5.5) banner(ctx, "hasil sama, tulisan jauh lebih singkat", 745, 900);
    },

    list_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "DAFTAR (ARRAY): SATU NAMA, BANYAK KOTAK BERNOMOR", 960, 230, 32, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 0.7, 5);
      M.list(ctx, 300, 330, NILAI.slice(0, n).concat(Array(5 - n).fill("")), { name: "nilai", w: 150, h: 80, hl: n });
      if (n >= 1) text(ctx, "nilai[1] = 80", 1300, 380, 32, { weight: 900, color: C.kiko });
      if (n >= 2) text(ctx, "nilai[2] = 75", 1300, 430, 32, { weight: 900, color: C.kiko });
      if (n >= 5) { text(ctx, "… sampai nilai[32]", 1300, 480, 28, { weight: 800, color: C.ink2 }); banner(ctx, "nomor di dalam kurung siku = nomor kotaknya", 745, 1000, { size: 30 }); }
    },
    sum_trace(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const lines = [{ t: "total ← 0" }, { t: "UNTUK i dari 1 sampai 5:" }, { t: "total ← total + nilai[i]", ind: 1 }];
      const step = clamp(Math.floor((l - 0.5) / 0.75), 0, 11); // 0 init, then pairs (1:UNTUK,2:body)x5, 11 done
      const i = step === 0 ? 0 : Math.min(5, Math.ceil(step / 2)); const done = step === 0 ? 0 : Math.floor(step / 2); const total = NILAI.slice(0, done).reduce((a, b) => a + b, 0);
      const hl = step === 0 ? 0 : step >= 11 ? -1 : step % 2 === 1 ? 1 : 2;
      pseudo(ctx, 200, 210, 660, lines, hl, { rh: 54, size: 26 });
      M.list(ctx, 220, 470, NILAI, { name: "nilai", w: 110, h: 60, hl: step >= 11 ? 0 : i, done });
      M.board(ctx, 920, 210, 780, [{ name: "total", value: total, changed: step > 0 && step % 2 === 0 && step < 11, old: step >= 2 && step % 2 === 0 && step < 11 ? total - NILAI[done - 1] : undefined }, { name: "i", value: step === 0 ? null : i, changed: step % 2 === 1 }], { bw: 200, bh: 120, h: 200 });
      M.rounds(ctx, 940, 460, 5, step >= 11 ? 6 : i, {});
      if (step >= 11) banner(ctx, "lima putaran: total = 385", 1310, 700, { fill: C.goodBg, stroke: C.good, color: C.good });
    },

    while_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      pseudo(ctx, 240, 240, 720, [{ t: "SELAMA gelas belum penuh:" }, { t: "tuang air", ind: 1 }], l > 1 ? 0 : -1, { rh: 64, size: 30 });
      const lv = clamp((l - 1) / 5, 0, 1); M.glass(ctx, 1300, 640, 200, 300, lv, { marks: 3 });
      if (l > 1) { card(ctx, 1460, 300, 260, 100, { fill: lv < 1 ? C.goodBg : C.badBg, stroke: lv < 1 ? C.good : C.bad, lw: 4 }); text(ctx, lv < 1 ? "belum penuh: ya" : "belum penuh: tidak", 1590, 340, 22, { align: "center", weight: 900, color: lv < 1 ? C.good : C.bad }); text(ctx, lv < 1 ? "→ tuang lagi" : "→ berhenti", 1590, 375, 22, { align: "center", weight: 900, color: lv < 1 ? C.good : C.bad }); }
      text(ctx, "kondisi dicek sebelum tiap putaran", 600, 480, 26, { align: "center", weight: 800, color: C.ink2 });
      if (l > 6.5) banner(ctx, "SELAMA kondisi: jumlah putarannya belum pasti", 745, 1000, { size: 30 });
    },
    while_trace(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const lines = [{ t: "air ← 0" }, { t: "SELAMA air < 3:" }, { t: "air ← air + 1", ind: 1 }];
      const step = clamp(Math.floor((l - 0.5) / 0.9), 0, 8); // 0 init; 1 cek(0<3 ya),2 body=1,3 cek,4 body=2,5 cek,6 body=3,7 cek (tidak),8 selesai
      const air = step === 0 ? 0 : Math.min(3, Math.floor(step / 2)); const hl = step === 0 ? 0 : step >= 8 ? -1 : step % 2 === 1 ? 1 : 2;
      pseudo(ctx, 200, 210, 620, lines, hl, { rh: 54, size: 26 });
      M.board(ctx, 880, 210, 400, [{ name: "air", value: air, changed: step > 0 && step % 2 === 0 && step < 8, old: step >= 2 && step % 2 === 0 && step < 8 ? air - 1 : undefined }], { bw: 200, bh: 120, h: 200 });
      M.glass(ctx, 1500, 620, 180, 300, air / 3, { marks: 3 });
      if (step % 2 === 1) { const ya = air < 3; card(ctx, 880, 440, 400, 110, { fill: ya ? C.goodBg : C.badBg, stroke: ya ? C.good : C.bad, lw: 4 }); text(ctx, air + " < 3?", 1080, 485, 28, { align: "center", weight: 900 }); text(ctx, ya ? "YA → lanjut" : "TIDAK → berhenti", 1080, 525, 26, { align: "center", weight: 900, color: ya ? C.good : C.bad }); }
      const checks = ["0 < 3 ya", "1 < 3 ya", "2 < 3 ya", "3 < 3 tidak"]; checks.slice(0, Math.min(4, Math.ceil(step / 2))).forEach((s, i) => text(ctx, s, 240, 500 + i * 40, 24, { weight: 800, color: i === 3 ? C.bad : C.good }));
      if (step >= 8) banner(ctx, "berhenti saat kondisi menjadi TIDAK", 745, 900);
    },
    while_danger(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      pseudo(ctx, 240, 240, 720, [{ t: "air ← 0" }, { t: "SELAMA air < 3:", bad: l > 1.5 }, { t: "tulis \"menuang…\"", ind: 1, bad: l > 1.5 }], -1, { rh: 60, size: 30 });
      if (l > 1.5) { text(ctx, "✕ tidak ada yang mengubah air", 600, 520, 28, { align: "center", weight: 900, color: C.bad }); text(ctx, "0 < 3 selalu ya → berputar selamanya", 600, 565, 26, { align: "center", weight: 800, color: C.ink2 }); }
      const spin = l * 3; ctx.save(); ctx.translate(1350, 420); ctx.rotate(spin); ctx.strokeStyle = C.bad; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 90, 0.4, Math.PI * 1.8); ctx.stroke(); ctx.fillStyle = C.bad; ctx.beginPath(); ctx.moveTo(90 * Math.cos(0.4), 90 * Math.sin(0.4)); ctx.lineTo(90 * Math.cos(0.4) + 26, 90 * Math.sin(0.4) - 14); ctx.lineTo(90 * Math.cos(0.4) - 6, 90 * Math.sin(0.4) - 30); ctx.closePath(); ctx.fill(); ctx.restore(); text(ctx, "∞", 1350, 440, 70, { align: "center", weight: 900, color: C.bad });
      if (l > 5) { card(ctx, 1080, 560, 620, 110, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "✓ pastikan ada yang berubah", 1390, 605, 26, { align: "center", weight: 900, color: C.good }); text(ctx, "di dalam badan perulangan: air ← air + 1", 1390, 645, 22, { align: "center", weight: 700, color: C.ink2 }); }
    },

    patterns(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "TIGA POLA DENGAN DAFTAR", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 2.2, 3);
      const P = [["MENJUMLAH", [{ t: "total ← 0" }, { t: "UNTUK tiap nilai:" }, { t: "total ← total + nilai", ind: 1 }]], ["MENGHITUNG", [{ t: "lulus ← 0" }, { t: "UNTUK tiap nilai:" }, { t: "JIKA nilai > 70 MAKA", ind: 1 }, { t: "lulus ← lulus + 1", ind: 2 }]], ["TERBESAR", [{ t: "terbesar ← 0" }, { t: "UNTUK tiap nilai:" }, { t: "JIKA nilai > terbesar MAKA", ind: 1 }, { t: "terbesar ← nilai", ind: 2 }]]];
      P.forEach(([t, lines], i) => { if (i < n) pseudo(ctx, 180 + i * 540, 280, 500, lines, -1, { title: t, rh: 46, size: 20 }); });
      if (n >= 3) label(ctx, "bentuknya mirip: siapkan kotak, ulangi, ubah kotak", 960, 600, { size: 28 });
    },
    max_trace(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const D3 = [80, 95, 70]; const lines = [{ t: "terbesar ← 0" }, { t: "UNTUK i dari 1 sampai 3:" }, { t: "JIKA nilai[i] > terbesar MAKA", ind: 1 }, { t: "terbesar ← nilai[i]", ind: 2 }];
      const step = clamp(Math.floor((l - 0.5) / 0.85), 0, 10); // 0 init; per i: cek(1), isi/skip(2) -> i1:1,2 i2:3,4 i3:5,6 ; 7 done
      const i = step === 0 ? 0 : Math.min(3, Math.ceil(step / 2)); const vals = [0, 0, 80, 80, 95, 95, 95, 95]; const tb = vals[Math.min(step, 7)];
      const hl = step === 0 ? 0 : step >= 7 ? -1 : step % 2 === 1 ? 2 : (D3[i - 1] > (i === 1 ? 0 : i === 2 ? 80 : 95) ? 3 : 2);
      pseudo(ctx, 180, 210, 720, lines, hl, { rh: 52, size: 25 });
      M.list(ctx, 220, 560, D3, { name: "nilai", w: 120, h: 64, hl: step >= 7 ? 0 : i });
      M.board(ctx, 960, 210, 740, [{ name: "terbesar", value: tb, changed: step % 2 === 0 && step > 0 && step < 6 && tb !== vals[step - 1] }, { name: "i", value: step ? i : null, changed: step % 2 === 1 }], { bw: 200, bh: 120, h: 200 });
      const checks = ["80 > 0? ya → 80", "95 > 80? ya → 95", "70 > 95? tidak"]; checks.slice(0, Math.min(3, Math.floor((step + 1) / 2))).forEach((s, k) => text(ctx, s, 980, 480 + k * 44, 26, { weight: 900, color: k === 2 ? C.bad : C.good }));
      if (step >= 7) banner(ctx, "hasil: terbesar = 95", 1310, 700, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pelacak pseudocode", "jalankan baris demi baris", (x, y) => { ctx.save(); ctx.translate(x - 220, y - 110); ctx.scale(0.7, 0.7); pseudo(ctx, 0, 0, 300, [{ t: "x ← 0" }, { t: "ULANGI 3:" }, { t: "x ← x+2", ind: 1 }], 2, { title: "", rh: 44, size: 22 }); M.board(ctx, 320, 0, 300, [{ name: "x", value: 4, changed: true }], { bw: 140, bh: 90, h: 160 }); ctx.restore(); }],
        ["Tebak nilai akhirnya", "sebelum dijalankan", (x, y) => { card(ctx, x - 180, y - 80, 360, 150, { fill: "#fff", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "total = ?", x, y - 10, 44, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "tebak dulu, lalu jalankan", x, y + 40, 22, { align: "center", weight: 700, color: C.ink2 }); }],
        ["Susun tiga pola", "menjumlah, menghitung, terbesar", (x, y) => { ctx.save(); ctx.translate(x - 200, y - 110); ctx.scale(0.8, 0.8); pseudo(ctx, 0, 0, 500, [{ t: "terbesar ← 0" }, { t: "UNTUK tiap nilai:" }, { t: "JIKA nilai > terbesar", ind: 1 }], -1, { title: "", rh: 44, size: 22 }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 630, 26, { align: "center", weight: 900 }); text(ctx, t2, x, 668, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu tulis pseudocode untuk persoalan kelasmu", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
