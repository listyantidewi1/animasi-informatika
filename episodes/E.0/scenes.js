/* Adegan episode E.0: Jembatan ke Kelas X. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, struktur.js, alur.js, sandi.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, St = K.struktur, Al = K.alur, Sd = K.sandi, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  // kotak diagram: judul + isi, bergaya Fase E (garis tipis, tanpa tokoh)
  const box = (ctx, x, y, w, h, title, lines = [], opt = {}) => { ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : opt.fill || "#FFFFFF", stroke: opt.on ? C.accent : opt.stroke || "#B7C4CC", lw: opt.on ? 6 : 3, r: 14 }); if (title) { ctx.fillStyle = opt.head || C.kiko; rr(ctx, x, y, w, 44, 14); ctx.fill(); ctx.fillRect(x, y + 22, w, 22); text(ctx, title, x + w / 2, y + 30, 22, { align: "center", weight: 900, color: "#fff" }); } lines.forEach((ln, i) => text(ctx, ln, x + w / 2, y + (title ? 84 : 40) + i * 32, opt.size || 24, { align: "center", weight: 700, color: C.ink })); ctx.restore(); };
  const BEKAL = [["🧩", "Berpikir komputasional", "D7.1"], ["🗂️", "Data terstruktur", "D7.6"], ["📜", "Pseudocode dasar", "D9.1"], ["🔑", "Keamanan akun", "D7.3"]];
  const JURUS = [["Dekomposisi", "pecah masalah besar", "dekorasi · konsumsi · acara"], ["Pengenalan pola", "cari yang berulang", "tiap bagian: daftar + PJ"], ["Abstraksi", "simpan yang penting", "siapa, apa, kapan"], ["Algoritma", "susun langkah", "1 bentuk tim → 2 daftar → 3 beli → 4 pasang"]];
  const MURID = [["Nama", "NIS", "Kelas", "Nilai"], ["Rani Putri", "10231", "X-A", "88"], ["Dito Pratama", "10232", "X-A", "76"], ["Rani Putri", "10233", "X-B", "91"], ["Bayu Saputra", "10234", "X-B", "69"]];
  const TRACE = [["Langkah", "nilai", "total"], ["awal", "–", "0"], ["1", "2", "2"], ["2", "5", "7"], ["3", "3", "10"]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      const n = reveal(l, 0.8, 1.0, 4);
      BEKAL.forEach(([ic, t, ep], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 520 + i * 310; card(ctx, x, 270, 290, 300, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 145, 370, 64, { align: "center" }); para(ctx, t, x + 145, 430, 26, 260, { align: "center", weight: 900 }); ctx.fillStyle = C.kiko; rr(ctx, x + 95, 505, 100, 34, 10); ctx.fill(); text(ctx, ep, x + 145, 529, 18, { align: "center", weight: 900, color: "#fff" }); ctx.restore(); });
      if (l > 6) banner(ctx, "bukan ulangan: kuis diagnostik → peta belajarmu", 650, 1000);
    },
    prereq(ctx, b, l) {
      card(ctx, 160, 200, 1600, 600);
      text(ctx, "EPISODE SMP YANG BISA DITONTON ULANG", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.1", "Empat Jurus Berpikir Komputasional"], ["D7.6", "Data Terstruktur di Sekitar Kita"], ["D9.1", "Pseudocode Lengkap: Perulangan dan Data"], ["D7.3", "Kata Sandi Aman dan Rekam Jejak Digital"]].forEach(([c, t], i) => { const x = 220 + i * 390; card(ctx, x, 340, 350, 280, { fill: C.bg2 }); text(ctx, c, x + 175, 420, 44, { align: "center", weight: 900 }); para(ctx, t, x + 175, 480, 24, 310, { align: "center", weight: 700, color: C.ink2 }); });
      if (l > 6) label(ctx, "mulai kelas X: lebih banyak diagram, cara tetap pelan dan runtut", 960, 700, { size: 26, color: C.ink2 });
    },
    unplugged_acara(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: ACARA PERPISAHAN KELAS");
      box(ctx, 660, 280, 600, 90, null, ["Masalah: menyiapkan acara perpisahan"], { fill: C.badBg, stroke: C.bad });
      const n = reveal(l, 2.0, 1.5, 4);
      JURUS.forEach(([t, s, ex], i) => { const x = 230 + i * 380; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(960, 370); ctx.lineTo(x + 170, 440); ctx.stroke(); box(ctx, x, 440, 340, 170, (i + 1) + ". " + t, [s], { dim: i >= n, on: i === n - 1, size: 22 }); });
      if (n >= 4) label(ctx, "tulis langkahnya di kertas, berurutan", 960, 690);
    },
    unplugged_tukar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TUKARKAN: BISAKAH ORANG LAIN MENGIKUTINYA PERSIS?");
      const steps = ["1. bentuk tim 3 bagian", "2. tiap tim tulis daftar barang", "3. belanja hari Jumat", "4. pasang dekorasi jam 7", "5. mulai acara jam 8"];
      card(ctx, 300, 290, 560, 400, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 12 }); text(ctx, "Kertas tim A", 580, 335, 24, { align: "center", weight: 900, color: C.accentDark });
      steps.forEach((s, i) => text(ctx, s, 340, 390 + i * 54, 26, { weight: 700 }));
      arrowIcon(ctx, "right", 960, 480, 50, C.ink2);
      const n = reveal(l, 2.0, 2.0, 3);
      [["✓", "bisa diikuti", C.good], ["?", "\"beli di mana?\" belum jelas", C.accentDark], ["✎", "perbaiki langkah 3", C.kiko]].forEach(([m, t, col], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1060, 300 + i * 130, 620, 110, { fill: C.bg2, r: 14 }); text(ctx, m, 1110, 370 + i * 130, 44, { align: "center", weight: 900, color: col }); text(ctx, t, 1160, 365 + i * 130, 26, { weight: 800 }); ctx.restore(); });
      if (n >= 3) label(ctx, "langkah yang bisa diikuti tanpa bertanya = algoritma", 960, 740, { size: 26 });
    },

    empat_jurus(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 1 · EMPAT JURUS BERPIKIR KOMPUTASIONAL");
      const n = reveal(l, 1.5, 2.6, 4);
      JURUS.forEach(([t, s], i) => { const x = 230 + i * 380; box(ctx, x, 290, 340, 260, (i + 1) + ". " + t, [s], { dim: i >= n, on: i === n - 1 }); if (i < 3) arrowIcon(ctx, "right", x + 358, 420, 26, C.ink2);
        ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const cx = x + 170, cy = 470;
        if (i === 0) { ctx.fillStyle = C.bad; rr(ctx, cx - 60, cy - 30, 120, 60, 8); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 20, cy - 30); ctx.lineTo(cx - 20, cy + 30); ctx.moveTo(cx + 20, cy - 30); ctx.lineTo(cx + 20, cy + 30); ctx.stroke(); }
        if (i === 1) for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? C.kiko : C.accent; ctx.beginPath(); ctx.arc(cx - 75 + k * 30, cy, 12, 0, Math.PI * 2); ctx.fill(); }
        if (i === 2) { ctx.fillStyle = "#B7C4CC"; rr(ctx, cx - 70, cy - 30, 140, 60, 8); ctx.fill(); ctx.fillStyle = C.kiko; rr(ctx, cx - 30, cy - 15, 60, 30, 6); ctx.fill(); }
        if (i === 3) for (let k = 0; k < 4; k++) { ctx.fillStyle = C.good; rr(ctx, cx - 70 + k * 38, cy - 12, 28, 24, 4); ctx.fill(); if (k < 3) { ctx.fillStyle = C.ink2; ctx.fillRect(cx - 42 + k * 38, cy - 2, 10, 4); } }
        ctx.restore(); });
      if (n >= 4) label(ctx, "empat jurus dipakai bersama, bukan satu per satu", 960, 640);
    },
    jurus_contoh(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "CONTOH: ACARA PERPISAHAN KELAS", 215);
      const n = reveal(l, 1.5, 2.6, 4);
      JURUS.forEach(([t, s, ex], i) => { const y = 255 + i * 120; ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 220, y, 1480, 104, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); ctx.fillStyle = C.kiko; rr(ctx, 236, y + 16, 300, 72, 12); ctx.fill(); text(ctx, t, 386, y + 62, 26, { align: "center", weight: 900, color: "#fff" }); text(ctx, ex, 580, y + 62, 28, { weight: 800 }); ctx.restore(); });
      if (n >= 4) label(ctx, "warna pita bukan urusan sekarang: itulah abstraksi", 960, 750, { size: 26 });
    },
    tabel(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 2 · DATA TERSTRUKTUR: TABEL", 215);
      const n = reveal(l, 1.0, 0.9, 4);
      St.table(ctx, 240, 260, MURID[0], MURID.slice(1, 1 + n), { cw: [300, 160, 140, 140], rh: 56, size: 26, hlCol: l > 6 ? 1 : -1 });
      if (l > 6) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; rr(ctx, 540, 260, 160, 56 * 5, 8); ctx.stroke(); label(ctx, "NIS: penanda unik", 620, 580, { size: 24 }); }
      if (l > 3) { text(ctx, "satu baris = satu murid", 1180, 330, 26, { weight: 900, color: C.ink2 }); text(ctx, "satu kolom = satu keterangan", 1180, 380, 26, { weight: 900, color: C.ink2 }); }
      if (l > 8) { text(ctx, "nama bisa sama ↑", 1180, 460, 24, { weight: 800, color: C.bad }); }
      const m = reveal(l, 10, 1.0, 3);
      [["🔍 saring", "kelas X-B"], ["↕ urutkan", "nilai terbesar"], ["Σ hitung", "rata-rata 81"]].forEach(([t, s], i) => { ctx.save(); if (i >= m) ctx.globalAlpha = 0.2; card(ctx, 1180 + 0, 520 + i * 80, 500, 66, { fill: C.bg2, r: 12 }); text(ctx, t, 1200, 562 + i * 80, 24, { weight: 900 }); text(ctx, s, 1660, 562 + i * 80, 24, { align: "right", weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    antrean_tumpukan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ANTREAN · TUMPUKAN · HIERARKI", 215);
      const n = reveal(l, 1.0, 3.0, 3);
      // antrean
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; card(ctx, 200, 260, 500, 420, { fill: C.bg2, r: 16 }); text(ctx, "ANTREAN", 450, 305, 24, { align: "center", weight: 900, color: C.kiko });
      ["A", "B", "C", "D"].forEach((s, i) => { ctx.fillStyle = i === 0 ? C.good : "#fff"; ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 3; rr(ctx, 260 + i * 100, 400, 80, 80, 10); ctx.fill(); ctx.stroke(); text(ctx, s, 300 + i * 100, 452, 36, { align: "center", weight: 900, color: i === 0 ? "#fff" : C.ink }); });
      arrowIcon(ctx, "left", 230, 440, 26, C.good); text(ctx, "keluar", 230, 500, 18, { align: "center", weight: 800, color: C.good }); arrowIcon(ctx, "left", 680, 440, 26, C.ink2); text(ctx, "masuk", 680, 500, 18, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "pertama masuk, pertama keluar", 450, 600, 22, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "FIFO", 450, 640, 22, { align: "center", weight: 900, color: C.kiko }); ctx.restore();
      // tumpukan
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; card(ctx, 740, 260, 440, 420, { fill: C.bg2, r: 16 }); text(ctx, "TUMPUKAN", 960, 305, 24, { align: "center", weight: 900, color: C.kiko });
      ["1", "2", "3"].forEach((s, i) => { ctx.fillStyle = i === 2 ? C.accent : "#fff"; ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 3; rr(ctx, 860, 540 - i * 70, 200, 60, 10); ctx.fill(); ctx.stroke(); text(ctx, "buku " + s, 960, 580 - i * 70, 26, { align: "center", weight: 900 }); });
      arrowIcon(ctx, "down", 1110, 360, 26, C.ink2); text(ctx, "taruh / ambil di atas", 960, 640, 22, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
      // hierarki
      ctx.save(); if (n < 3) ctx.globalAlpha = 0.2; card(ctx, 1220, 260, 480, 420, { fill: C.bg2, r: 16 }); text(ctx, "HIERARKI", 1460, 305, 24, { align: "center", weight: 900, color: C.kiko });
      St.tree(ctx, { label: "Sekolah", kids: [{ label: "Kelas X", kids: [{ label: "X-A" }, { label: "X-B" }] }, { label: "Kelas XI" }] }, 1240, 340, 440, { levelH: 95, bw: 120, bh: 44, size: 20 });
      text(ctx, "induk dan anak", 1460, 650, 22, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
      if (n >= 3) label(ctx, "di kelas X: antrean dan tumpukan dipakai di dalam program", 960, 740, { size: 26 });
    },

    pseudo_dasar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 3 · PSEUDOCODE DASAR: TIGA BAHAN", 215);
      const n = reveal(l, 1.5, 2.6, 3);
      Al.pseudo(ctx, 220, 250, 820, [{ t: "total ← 0", hl: n === 1 }, { t: "ULANGI untuk tiap nilai dalam daftar", hl: n === 3 }, { t: "total ← total + nilai", ind: 1 }, { t: "JIKA total > 9 MAKA tulis \"lulus\"", hl: n === 2 }, { t: "LAINNYA tulis \"ulang\"" }], { rh: 56, size: 26 });
      const bahan = [["📦", "Variabel", "kotak bernama penyimpan nilai: total"], ["🔀", "JIKA · MAKA · LAINNYA", "memilih satu dari dua jalan"], ["🔁", "ULANGI", "mengerjakan baris yang sama berkali-kali"]];
      bahan.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 260 + i * 140; card(ctx, 1090, y, 620, 120, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, ic, 1140, y + 72, 40, { align: "center" }); text(ctx, t, 1190, y + 52, 26, { weight: 900 }); text(ctx, s, 1190, y + 88, 20, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) label(ctx, "dibaca baris demi baris, dari atas ke bawah", 960, 730, { size: 26 });
    },
    pelacakan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TABEL PELACAKAN: JANGAN MENEBAK", 215);
      const n = reveal(l, 2.0, 2.2, 4);
      Al.pseudo(ctx, 220, 250, 720, [{ t: "total ← 0", hl: n === 1 }, { t: "ULANGI untuk tiap nilai dalam [2, 5, 3]", hl: n > 1 }, { t: "total ← total + nilai", ind: 1, hl: n > 1 }], { rh: 56, size: 26 });
      St.table(ctx, 1020, 250, TRACE[0], TRACE.slice(1, 1 + n), { cw: [200, 160, 160], rh: 56, size: 26 });
      if (n >= 4) { card(ctx, 1020, 560, 520, 70, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "total akhir = 10", 1280, 605, 30, { align: "center", weight: 900, color: C.good }); }
      if (n >= 4) label(ctx, "satu baris tabel untuk tiap putaran", 580, 560, { size: 26, color: C.ink2 });
    },
    sandi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 4 · KEAMANAN AKUN: PANJANG, UNIK, RAHASIA", 215);
      const n = reveal(l, 1.0, 1.0, 3);
      [["✉️", "surel sekolah"], ["🏫", "kelas daring"], ["📚", "perpustakaan digital"]].forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 220 + i * 300, 260, 280, 100, { fill: C.bg2, r: 14 }); text(ctx, ic, 270 + i * 300, 325, 40, { align: "center" }); text(ctx, t, 310 + i * 300, 318, 22, { weight: 900 }); ctx.restore(); });
      const m = reveal(l, 5.0, 2.0, 2);
      if (m >= 1) { Sd.pwBox(ctx, 220, 420, 600, "Sma10!", { size: 40, count: true }); Sd.meter(ctx, 220, 530, 600, 0); text(ctx, "pendek, rumit, mudah ditebak", 520, 640, 24, { align: "center", weight: 800, color: C.bad }); }
      if (m >= 2) { Sd.pwBox(ctx, 1000, 420, 700, "kucing oren makan roti", { size: 36, count: true }); Sd.meter(ctx, 1000, 530, 700, 3); text(ctx, "frasa empat kata acak: panjang, mudah diingat", 1350, 640, 24, { align: "center", weight: 800, color: C.good }); }
      if (m >= 2) label(ctx, "panjang mengalahkan rumit", 960, 730);
    },
    akun_baru(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DUA KEBIASAAN DI KOMPUTER BERSAMA DAN BANYAK AKUN", 215);
      const n = reveal(l, 1.5, 3.0, 2);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; card(ctx, 220, 270, 700, 400, { fill: C.bg2, r: 16 }); text(ctx, "1. KELUAR DARI AKUN", 570, 320, 26, { align: "center", weight: 900, color: C.kiko }); ctx.fillStyle = "#1F2A33"; rr(ctx, 390, 350, 360, 230, 14); ctx.fill(); ctx.fillStyle = "#EAF2EE"; rr(ctx, 404, 364, 332, 202, 8); ctx.fill(); ctx.fillStyle = "#4A5A66"; rr(ctx, 540, 580, 60, 22, 4); ctx.fill(); rr(ctx, 490, 600, 160, 12, 4); ctx.fill(); text(ctx, "Akun: sinta@sekolah", 570, 410, 20, { align: "center", weight: 800, color: C.ink2 }); card(ctx, 440, 450, 260, 56, { fill: C.kiko, r: 10 }); text(ctx, "Keluar (logout)", 570, 487, 24, { align: "center", weight: 900, color: "#fff" }); text(ctx, "lab komputer, HP teman, warnet", 570, 640, 22, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; card(ctx, 1000, 270, 700, 400, { fill: C.bg2, r: 16 }); text(ctx, "2. SATU AKUN, SATU KATA SANDI", 1350, 320, 26, { align: "center", weight: 900, color: C.kiko });
      [["✉️", C.good], ["🏫", C.good], ["📚", C.bad]].forEach(([ic, col], i) => { const x = 1120 + i * 230; text(ctx, ic, x, 420, 44, { align: "center" }); Sd.lock(ctx, x, 500, 50, i === 2 ? { open: true } : {}); text(ctx, i === 2 ? "bocor" : "aman", x, 580, 22, { align: "center", weight: 900, color: col }); });
      text(ctx, "satu bocor, yang lain tetap aman", 1350, 640, 22, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
      if (n >= 2) label(ctx, "verifikasi dua langkah: di episode E.3", 960, 740, { size: 24, color: C.ink2 });
    },
    peta10(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PETA KELAS X", 215);
      const s1 = [["E.1", "Komputer Von Neumann"], ["E.2", "Peran Sistem Operasi"], ["E.3", "Keamanan Akun dan Jaringan"], ["E.4", "Mencari, Memeriksa, Membaca Lateral"]];
      const s2 = [["E.5", "Struktur Data Standar"], ["E.6", "Pencarian dan Pengurutan"], ["E.7", "Pseudocode Dekat Komputer"], ["E.8", "Data Berkualitas"], ["E.9", "Proyek Budaya Lokal"]];
      const n = reveal(l, 1.0, 0.8, 9);
      text(ctx, "SEMESTER 1", 540, 280, 24, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "SEMESTER 2", 1380, 280, 24, { align: "center", weight: 900, color: C.ink2 });
      s1.forEach(([c, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 240, 300 + i * 100, 600, 84, { fill: C.bg2, r: 12 }); ctx.fillStyle = C.kiko; rr(ctx, 256, 316 + i * 100, 80, 52, 10); ctx.fill(); text(ctx, c, 296, 350 + i * 100, 22, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, 356, 352 + i * 100, 24, { weight: 800 }); ctx.restore(); });
      s2.forEach(([c, t], i) => { ctx.save(); if (i + 4 >= n) ctx.globalAlpha = 0.2; card(ctx, 1080, 300 + i * 84, 600, 72, { fill: i === 4 ? "#FFF3D6" : C.bg2, r: 12 }); ctx.fillStyle = C.kiko; rr(ctx, 1096, 312 + i * 84, 80, 48, 10); ctx.fill(); text(ctx, c, 1136, 344 + i * 84, 22, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, 1196, 346 + i * 84, 24, { weight: 800 }); ctx.restore(); });
      if (n >= 9) label(ctx, "E.0 hari ini → E.1 minggu depan", 540, 740, { size: 24 });
    },
    cara_belajar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "CARA BELAJAR: TIGA LAPIS, LALU BUKA TUTUP MESIN");
      const n = reveal(l, 1.5, 1.6, 3);
      [["✋", "Konkret", "coba dulu tanpa komputer"], ["🎞️", "Gambar", "lihat animasinya"], ["🔣", "Simbol", "latihan di halaman web"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 400; card(ctx, x, 290, 360, 220, { fill: C.bg2, r: 16 }); text(ctx, ic, x + 180, 370, 56, { align: "center" }); text(ctx, t, x + 180, 430, 28, { align: "center", weight: 900 }); text(ctx, s, x + 180, 470, 22, { align: "center", weight: 700, color: C.ink2 }); if (i < 2) arrowIcon(ctx, "right", x + 380, 400, 26, C.ink2); ctx.restore(); });
      if (l > 7) { card(ctx, 1440, 290, 260, 220, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); ctx.fillStyle = "#1F2A33"; rr(ctx, 1480, 320, 180, 120, 10); ctx.fill(); ctx.fillStyle = "#EAF2EE"; rr(ctx, 1490, 330, 160, 100, 6); ctx.fill(); text(ctx, "⚙️", 1570, 400, 50, { align: "center" }); text(ctx, "buka tutup mesin", 1570, 480, 20, { align: "center", weight: 900, color: C.accentDark }); }
      if (l > 7) label(ctx, "melihat apa yang terjadi di dalam komputer", 960, 620);
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Kuis diagnostik", "12 soal, 3 per bekal", (x, y) => BEKAL.forEach(([ic, t], i) => { card(ctx, x - 200 + (i % 2) * 205, y - 90 + Math.floor(i / 2) * 95, 195, 80, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, ic, x - 170 + (i % 2) * 205, y - 40 + Math.floor(i / 2) * 95, 30, { align: "center" }); para(ctx, t, x - 145 + (i % 2) * 205, y - 58 + Math.floor(i / 2) * 95, 15, 125, { weight: 900 }); })],
        ["Peta belajarmu", "aman atau tonton ulang", (x, y) => [["✓ aman", C.goodBg, C.good], ["✓ aman", C.goodBg, C.good], ["↺ ulang D9.1", "#FFF3D6", C.accentDark], ["✓ aman", C.goodBg, C.good]].forEach(([t, bg, col], i) => { card(ctx, x - 190, y - 100 + i * 52, 380, 44, { fill: bg, r: 10 }); text(ctx, BEKAL[i][1], x - 175, y - 72 + i * 52, 18, { weight: 800 }); text(ctx, t, x + 175, y - 72 + i * 52, 18, { align: "right", weight: 900, color: col }); })],
        ["Pelacak mini", "isi tabel pelacakan", (x, y) => { ctx.save(); ctx.translate(x - 190, y - 100); ctx.scale(0.7, 0.7); St.table(ctx, 0, 0, TRACE[0], TRACE.slice(1, 4), { cw: [180, 170, 170], rh: 50, size: 24 }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — guru memakai peta kelas untuk membagi kelompok penguatan", 960, 820, 26, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
