/* Adegan episode D9.6: Proyek Akhir Fase D. Muat setelah kiko-core.js, kiko-devices.js, cek.js, alur.js, proyek.js, konten.js, akhir.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Ck = K.cek, Al = K.alur, Pr = K.proyek, Kt = K.konten, Ak = K.akhir, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const STEPS = [["Pilih masalah", "bisa diukur, bisa diubah"], ["Kumpulkan data", "lima hari, apa adanya"], ["Analisis", "tabel, rata-rata, grafik"], ["Rancang algoritma", "flowchart dan pseudocode"], ["Buat konten", "poster dan video pendek"], ["Uji coba, perbaiki", "bandingkan data"]];
  const DATA = [["Hari", "Warung A", "Warung B", "Warung C"], ["Senin", 130, 38, 28], ["Selasa", 125, 42, 31], ["Rabu", 96, 35, 26], ["Kamis", 128, 41, 33], ["Jumat", 121, 44, 32], ["Rata-rata", 120, 40, 30]];
  const PSEUDO = [{ t: "MULAI" }, { t: "ULANGI untuk tiap pembeli", ind: 0 }, { t: "ambil kartu nomor, tulis pesanan", ind: 1 }, { t: "bayar di kasir", ind: 1 }, { t: "JIKA antrean kasir > 10 MAKA buka kasir kedua", ind: 1 }, { t: "SAMPAI istirahat selesai", ind: 0 }, { t: "ULANGI panggil nomor berikutnya SAMPAI pesanan habis", ind: 0 }, { t: "SELESAI" }];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const items = [["📊", "Data kecil", "menemukan penyebab", "kelas 8"], ["🧭", "Algoritma", "merancang solusi", "kelas 9"], ["🎬", "Konten digital", "menyebarkan solusi", "kelas 9"]];
      const n = reveal(l, 2.5, 1.3, 3);
      items.forEach(([ic, t, s, k], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 620 + i * 380; card(ctx, x, 260, 350, 310, { fill: C.bg2, r: 20 }); text(ctx, ic, x + 175, 370, 72, { align: "center" }); text(ctx, t, x + 175, 440, 30, { align: "center", weight: 900 }); text(ctx, s, x + 175, 485, 22, { align: "center", weight: 700, color: C.ink2 }); ctx.fillStyle = C.kiko; rr(ctx, x + 115, 510, 120, 34, 10); ctx.fill(); text(ctx, k, x + 175, 534, 18, { align: "center", weight: 900, color: "#fff" }); ctx.restore(); });
      if (n >= 3) banner(ctx, "tiga jurus, satu proyek: antrean kantin", 650, 900);
    },
    prereq(ctx, b, l) {
      card(ctx, 200, 200, 1520, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D8.6", "Proyek: Cek Data, Cek Fakta"], ["D9.1", "Pseudocode Lengkap: Perulangan dan Data"], ["D9.5", "Produksi dan Diseminasi Konten Digital"]].forEach(([c, t], i) => { const x = 260 + i * 470; card(ctx, x, 340, 440, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 220, 430, 44, { align: "center", weight: 900 }); para(ctx, t, x + 220, 500, 28, 400, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1660, 820, 120, 0);
    },
    unplugged_masalah(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: LIMA MASALAH, SATU PROYEK");
      const probs = [["Antrean kantin panjang", null], ["Pelajaran matematika susah", "sulit diukur dan diubah"], ["Sampah menumpuk di kelas 9B", null], ["Cuaca sering hujan", "tidak bisa diubah"], ["Buku perpustakaan sulit dicari", null]];
      const n = reveal(l, 1.5, 1.0, 5); const cross = l > 8, pick = l > 10;
      probs.forEach(([s, why], i) => { if (i >= n) return; const x = 230 + (i % 3) * 520, y = 290 + Math.floor(i / 3) * 210; Ak.problem(ctx, x, y, 460, 130, s, { cross: cross && why, why, pick: pick && i === 0 }); });
      kid(ctx, 1500, 700, 130, { point: true });
      if (pick) label(ctx, "kelas Sinta memilih: antrean kantin", 800, 745, { size: 26, color: C.good });
    },
    unplugged_pecah(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PECAH MASALAHNYA: DEKOMPOSISI");
      card(ctx, 660, 280, 600, 110, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 }); text(ctx, "Antrean kantin panjang", 960, 345, 32, { align: "center", weight: 900, color: C.bad });
      const qs = [["👥", "Siapa yang antre?"], ["🕒", "Kapan paling ramai?"], ["🏪", "Di warung mana?"], ["⏱️", "Berapa lama tiap orang dilayani?"]];
      const n = reveal(l, 2.0, 1.6, 4);
      qs.forEach(([ic, q], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 380; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(960, 390); ctx.lineTo(x + 180, 480); ctx.stroke(); card(ctx, x, 480, 360, 180, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 16 }); text(ctx, ic, x + 180, 550, 44, { align: "center" }); para(ctx, q, x + 180, 605, 24, 320, { align: "center", weight: 900 }); ctx.restore(); });
      if (n >= 4) label(ctx, "empat pertanyaan kecil yang bisa dijawab data", 960, 730);
    },

    langkah_tim(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ENAM LANGKAH, EMPAT PERAN");
      const n = reveal(l, 1.0, 0.9, 6);
      STEPS.forEach(([t, s], i) => Ck.step(ctx, 200 + i * 260, 280, 240, 190, i + 1, t, s, { dim: i >= n, on: i === n - 1 }));
      const roles = [["Sinta", "pencatat data", { hair: "long" }], ["Dito", "perancang algoritma", {}], ["Rani", "pembuat konten", { hair: "long" }], ["Bayu", "pemeriksa", {}]];
      const m = reveal(l, 7.5, 0.9, 4);
      roles.forEach(([nm, r, k], i) => { if (i < m) { ctx.save(); ctx.translate(0, 0); card(ctx, 330 + i * 330, 510, 300, 200, { fill: C.bg2, r: 16 }); kid(ctx, 400 + i * 330, 610, 80, k); text(ctx, nm, 490 + i * 330, 590, 24, { weight: 900 }); para(ctx, r, 490 + i * 330, 625, 20, 170, { weight: 700, color: C.ink2 }); ctx.restore(); } });
    },
    kumpul_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "RENCANA DATA: LIMA HARI SAAT ISTIRAHAT");
      Ak.stall(ctx, 420, 400, 260, "Warung A", {}); Ak.queue(ctx, 280, 520, Math.min(6, Math.floor(l) + 1), { s: 50, gap: 48 });
      Ak.clock(ctx, 700, 460, 60, Math.min(12, Math.floor(l * 2)), { label: "lama antre" });
      const items = [["👥", "jumlah pembeli di tiap warung"], ["⏱️", "lama antre: dari ekor sampai dibayar"], ["🕒", "jam paling ramai"], ["📝", "catatan: hujan, kantin sepi, dll."]];
      const n = reveal(l, 2.0, 1.6, 4);
      items.forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 290 + i * 100; card(ctx, 900, y, 800, 86, { fill: i === 3 ? "#FFF9E0" : C.bg2, r: 14 }); text(ctx, ic, 950, y + 56, 36, { align: "center" }); text(ctx, t, 1000, y + 54, 26, { weight: 800 }); ctx.restore(); });
      if (n >= 4) label(ctx, "catat apa adanya, jangan dibulatkan supaya sesuai harapan", 960, 740, { size: 26 });
    },
    analisis_tabel(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ANALISIS DI LEMBAR KERJA", 215);
      const n = reveal(l, 0.5, 0.7, 7); const rows = DATA.slice(0, Math.max(1, n));
      const hl = n >= 7 ? { B7: "#FFF3D6", C7: "#FFF3D6", D7: "#FFF3D6" } : {};
      Ck.sheet(ctx, 240, 250, rows, { cw: [170, 150, 150, 150], rh: 50, hl });
      if (n >= 7) { Ck.formulaBar(ctx, 240, 660, 664, "B7", "=AVERAGE(B2:B6)"); }
      if (l > 7) { card(ctx, 1000, 280, 700, 300, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "TEMUAN", 1350, 330, 26, { align: "center", weight: 900, color: C.bad }); text(ctx, "120 dari 190 pembeli", 1350, 400, 44, { align: "center", weight: 900 }); text(ctx, "≈ dua pertiga, menumpuk di warung A", 1350, 450, 26, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "membayar di A paling lama", 1350, 530, 26, { align: "center", weight: 800, color: C.bad }); }
      if (l > 7) label(ctx, "satu baris satu hari; rata-rata di baris terakhir", 1350, 660, { size: 24, color: C.ink2 });
    },
    analisis_grafik(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "GRAFIK BATANG: PEMBELI RATA-RATA PER HARI", 215);
      Ck.bars(ctx, 240, 250, 760, 460, [["Warung A", 120, C.bad], ["Warung B", 40, C.kiko], ["Warung C", 30, C.kiko]], { grow: ease(l / 2), title: "rata-rata pembeli per hari" });
      const n = reveal(l, 3.0, 2.0, 2);
      Ck.verdict(ctx, 1060, 280, 640, "salah", "Bukan kurang warung", "dua warung lain sepi", { on: n >= 1, dim: n < 1 });
      Ck.verdict(ctx, 1060, 440, 640, "benar", "Menumpuk di A, bayar lambat", "ini yang akan dipecahkan", { on: n >= 2, dim: n < 2 });
      if (n >= 2) label(ctx, "kesimpulan dibaca dari data, bukan tebakan", 1380, 640, { size: 26, color: C.good });
    },

    alur_solusi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SOLUSI SEBAGAI ALGORITMA: SISTEM NOMOR PESAN", 215);
      const steps = [["term", "Mulai"], ["proc", "ambil kartu nomor"], ["io", "tulis pesanan"], ["proc", "bayar di kasir"], ["proc", "tunggu nomor dipanggil"], ["proc", "ambil makanan"], ["term", "Selesai"]];
      const n = reveal(l, 1.0, 1.1, 7);
      steps.forEach(([k, t], i) => { const cx = 300 + i * 220; Al.node(ctx, k, cx, 380, 190, 76, t, { dim: i >= n, hl: i === n - 1 }); if (i < steps.length - 1) Al.arrow(ctx, [[cx + 95, 380], [cx + 125, 380]], { on: i < n - 1 }); });
      Ak.ticket(ctx, 520, 600, 110, 17, { order: "mi ayam" }); arrowIcon(ctx, "right", 640, 600, 36, C.ink2); Ak.stall(ctx, 860, 640, 220, "KASIR", { color: C.kiko }); arrowIcon(ctx, "right", 1020, 600, 36, C.ink2);
      text(ctx, "📣 nomor 17!", 1220, 610, 34, { align: "center", weight: 900, color: C.accentDark }); kid(ctx, 1450, 620, 110, { hair: "long" });
      if (n >= 7) label(ctx, "satu antrean kasir, bukan tiga kerumunan", 960, 760, { size: 26 });
    },
    pseudo_solusi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PSEUDOCODE: KEPUTUSAN DAN PERULANGAN", 215);
      const n = reveal(l, 0.8, 0.9, 8);
      Al.pseudo(ctx, 220, 250, 1000, PSEUDO.map((p, i) => ({ ...p, hl: i === 4 && l > 6, t: i < n ? p.t : "" })), { rh: 50, size: 24 });
      if (l > 9) { card(ctx, 1280, 280, 440, 380, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 16 }); text(ctx, "UJI DENGAN DATA", 1500, 330, 24, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "120 pembeli, 1 kasir", 1500, 390, 24, { align: "center", weight: 800 }); text(ctx, "→ antrean > 10, kasir kedua dibuka", 1500, 430, 22, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "40 pembeli, hari hujan", 1500, 510, 24, { align: "center", weight: 800 }); text(ctx, "→ satu kasir cukup", 1500, 550, 22, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "✓ algoritma menyesuaikan diri", 1500, 620, 22, { align: "center", weight: 900, color: C.good }); }
    },
    konten_sosialisasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SOLUSI HARUS DIKENAL: TIGA PERTANYAAN LAGI");
      const qs = [["Untuk siapa?", "👥 semua murid"], ["Pesan apa?", "🎫 ambil nomor dulu, bayar di kasir"], ["Bentuk apa?", "🖼️ poster di pintu kantin + 🎬 video 1 menit"]];
      const n = reveal(l, 1.5, 2.2, 3);
      qs.forEach(([q, a], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 290 + i * 110; card(ctx, 220, y, 880, 90, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, q, 250, y + 56, 28, { weight: 900 }); text(ctx, a, 480, y + 56, 24, { weight: 800, color: C.ink2 }); ctx.restore(); });
      // poster
      card(ctx, 1180, 270, 520, 440, { fill: "#fff", stroke: C.kiko, lw: 6, r: 14 }); text(ctx, "ANTRE LEBIH CEPAT", 1440, 330, 30, { align: "center", weight: 900, color: C.kiko });
      Ak.ticket(ctx, 1320, 470, 90, 1, {}); arrowIcon(ctx, "right", 1420, 470, 30, C.ink2); text(ctx, "💵", 1500, 485, 50, { align: "center" }); arrowIcon(ctx, "right", 1570, 470, 30, C.ink2); text(ctx, "🍜", 1640, 485, 50, { align: "center" });
      text(ctx, "1 ambil nomor · 2 bayar di kasir · 3 tunggu dipanggil", 1440, 600, 20, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "Tim 9B · 2026", 1440, 680, 18, { align: "center", weight: 700, color: C.muted });
      if (n >= 3) label(ctx, "poster + video: pesan yang sama, dua saluran", 660, 740, { size: 26 });
    },
    uji_coba(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "UJI COBA SEMINGGU, CATAT LAGI, BANDINGKAN");
      const p = ease((l - 1) / 3);
      card(ctx, 240, 280, 600, 400, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "SEBELUM", 540, 330, 26, { align: "center", weight: 900, color: C.bad }); Ak.clock(ctx, 540, 480, 90, 12, { color: C.bad }); Ak.queue(ctx, 330, 620, 8, { s: 36, gap: 56 });
      card(ctx, 1080, 280, 600, 400, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 }); text(ctx, "SESUDAH", 1380, 330, 26, { align: "center", weight: 900, color: C.good }); Ak.clock(ctx, 1380, 480, 90, Math.round(lerp(12, 6, p)), { color: C.good }); Ak.queue(ctx, 1250, 620, 4, { s: 36, gap: 56 });
      arrowIcon(ctx, "right", 960, 480, 60, C.ink2);
      if (l > 7) { card(ctx, 500, 700, 920, 60, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 12 }); text(ctx, "⚠ beberapa murid bingung dengan nomor → bahan perbaikan putaran berikutnya", 960, 740, 22, { align: "center", weight: 900, color: C.accentDark }); }
    },
    presentasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PRESENTASI ENAM SLIDE", 215);
      const slides = [["1 Masalah", "12 menit antre"], ["2 Data", "5 hari, 3 warung"], ["3 Temuan", "120 dari 190 di A"], ["4 Algoritma", "nomor pesan + kasir"], ["5 Konten", "poster + video"], ["6 Hasil uji", "12 → 6 menit"]];
      const n = reveal(l, 1.0, 1.1, 6);
      slides.forEach(([t, w], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 260 + (i % 3) * 480, y = 255 + Math.floor(i / 3) * 235; Pr.slide(ctx, x, y, 400, { title: t, words: w, good: i === n - 1 }); ctx.restore(); });
      if (n >= 6) label(ctx, "satu ide per slide; ceritakan juga yang belum berhasil", 960, 742, { size: 26 });
    },
    rubrik(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "RUBRIK: NILAI DIRI DULU", 215);
      const n = reveal(l, 1.0, 1.6, 5);
      Pr.rubric(ctx, 260, 250, 1400, [["Data", "jujur, berkaitan dengan pertanyaan, lima hari penuh"], ["Analisis", "kesimpulan dibaca dari tabel dan grafik"], ["Algoritma", "jelas, ada keputusan dan perulangan, diuji dengan data"], ["Konten", "jujur, aman, pesan satu, saluran tepat"], ["Kerja tim", "empat peran terbagi rata, semua bisa menjelaskan"]], { n });
      if (n >= 5) label(ctx, "bintang diisi sendiri dulu, lalu oleh guru", 960, 740, { size: 24, color: C.ink2 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Langkah dan data", "urutkan, pilih yang berkaitan", (x, y) => STEPS.slice(0, 3).forEach(([t], i) => { card(ctx, x - 190, y - 90 + i * 66, 380, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 160, y - 62 + i * 66, 16, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 160, y - 56 + i * 66, 16, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, x - 130, y - 54 + i * 66, 22, { weight: 900 }); })],
        ["Baca tabel, simpulkan", "tidak lebih, tidak kurang", (x, y) => { ctx.save(); ctx.translate(x - 200, y - 100); ctx.scale(0.6, 0.6); Ck.sheet(ctx, 0, 0, DATA.slice(0, 4), { cw: [150, 150, 150, 150], rh: 50 }); ctx.restore(); card(ctx, x - 190, y + 50, 380, 50, { fill: C.goodBg, stroke: C.good, lw: 2, r: 10 }); text(ctx, "✓ menumpuk di warung A", x, y + 82, 20, { align: "center", weight: 900, color: C.good }); }],
        ["Susun pseudocode", "JIKA dan ULANGI", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 100); ctx.scale(0.62, 0.62); Al.pseudo(ctx, 0, 0, 680, [{ t: "ULANGI untuk tiap pembeli" }, { t: "ambil kartu nomor", ind: 1 }, { t: "JIKA antrean > 10 MAKA kasir kedua", ind: 1, hl: true }, { t: "SAMPAI istirahat selesai" }], { rh: 48, size: 24 }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu kerjakan proyekmu sendiri, enam pertemuan", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
