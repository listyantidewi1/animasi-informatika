/* Adegan episode F12.7: Proyek Akhir Fase F (contoh alur kerja Tim XII-3, aplikasi Setor Sampah; fiktif). Gaya diagram Fase F.
   Muat setelah kiko-core.js, kiko-devices.js, alur_dev.js (F11.1), py.js (F11.0), struktur.js (F12.1), tren.js (F12.3), konten.js (F12.6), proyek.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, A = K.alurdev, Py = K.py, Sk = K.struktur, Tr = K.tren, Kt = K.konten, Pr = K.proyek, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, clamp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 215) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.2; fn(); ctx.restore(); };
  const fiktif = (ctx, x = 1780, y = 186) => text(ctx, "contoh fiktif", x, y, 16, { align: "right", weight: 800, color: "#9AA7AF" });
  const epTag = (ctx, s, x, y) => { ctx.fillStyle = C.kiko; rr(ctx, x, y, 20 + s.length * 13, 36, 10); ctx.fill(); text(ctx, s, x + 10, y + 26, 20, { weight: 900, color: "#fff" }); };

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 1.0, 1.3, 7);
      text(ctx, "Tim XII-3 · aplikasi Setor Sampah", 960, 260, 30, { align: "center", weight: 900, color: C.ink2 });
      Pr.steps(ctx, 220, 330, 1480, null, { n });
      if (n >= 7) label(ctx, "tiap tahap memakai lagi episode yang sudah kamu tonton", 960, 640, { size: 28 });
      fiktif(ctx);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "EPISODE YANG DIRANGKUM", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["F11.1", "Alur Pengembangan Program"], ["F11.10", "Proyek Aplikasi Data Terbuka"], ["F12.0–F12.6", "seluruh kelas dua belas"]].forEach(([c, t], i) => { const x = 330 + i * 430; card(ctx, x, 340, 400, 240, { fill: C.bg2 }); text(ctx, c, x + 200, 420, c.length > 6 ? 36 : 46, { align: "center", weight: 900 }); para(ctx, t, x + 200, 480, 24, 360, { align: "center", weight: 700, color: C.ink2 }); });
      if (l > 6) label(ctx, "boleh ditonton ulang kapan saja selama proyek", 960, 680, { size: 26, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_jalan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: JALAN-JALAN MASALAH");
      const n = reveal(l, 2.0, 2.4, 5);
      kid(ctx, 300, 560, 110, { point: true }); kid(ctx, 460, 560, 110, { hair: "long" }); text(ctx, "⏱️ 15 menit keliling sekolah", 380, 730, 22, { align: "center", weight: 900, color: C.ink2 });
      [["antrean kantin panjang", -0.05, "#FFF3B0"], ["sampah plastik di kelas", 0.04, "#FFD8C2"], ["peminjaman buku dicatat manual", -0.03, "#D7F0E0"], ["jadwal lab sering bentrok", 0.05, "#DCEBFA"]].forEach(([s, r, f], i) => dim(ctx, n >= i + 1, () => Pr.note(ctx, 760 + (i % 2) * 520, 360 + Math.floor(i / 2) * 230, s, { rot: r, fill: f })));
      fiktif(ctx);
    },
    unplugged_pilih(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TIGA PERTANYAAN UNTUK MEMILIH");
      const n = reveal(l, 2.0, 3.0, 4);
      [["nyata dan ada datanya?"], ["produk digital bisa membantu?"], ["selesai dalam satu semester?"]].forEach(([q], i) => dim(ctx, n >= i + 1, () => { card(ctx, 220, 270 + i * 110, 600, 90, { fill: C.bg2, r: 14 }); text(ctx, (i + 1) + ". " + q, 250, 326 + i * 110, 26, { weight: 900 }); }));
      const notes = [["antrean kantin panjang", "✓ ✓ ✕", false, "#FFF3B0"], ["sampah plastik di kelas", "✓ ✓ ✓", true, "#FFD8C2"], ["peminjaman buku dicatat manual", "✓ ✓ ✕", false, "#D7F0E0"], ["jadwal lab sering bentrok", "✕ ✓ ✓", false, "#DCEBFA"]];
      notes.forEach(([s, m, w, f], i) => Pr.note(ctx, 1040 + (i % 2) * 380, 350 + Math.floor(i / 2) * 230, s, { rot: 0, fill: f, marks: n >= 3 ? m : "", win: w && n >= 4 }));
      if (n >= 4) label(ctx, "dipilih: sampah plastik di kelas", 520, 690, { size: 28, color: C.good });
      fiktif(ctx);
    },
    kebutuhan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TAHAP KEBUTUHAN");
      const n = reveal(l, 1.5, 2.4, 7);
      epTag(ctx, "F11.1", 1560, 190);
      [["👷", "petugas bank sampah"], ["🧑‍🎓", "murid"], ["🧑‍🏫", "wali kelas"]].forEach(([ic, t], i) => dim(ctx, n >= 1, () => { card(ctx, 220, 270 + i * 120, 400, 100, { fill: C.bg2, r: 14 }); text(ctx, ic + "  " + t, 250, 330 + i * 120, 26, { weight: 900 }); }));
      [["catat setoran per murid", "wajib"], ["hitung poin", "wajib"], ["peringkat kelas", "wajib"], ["prediksi setoran", "tambahan"], ["grafik bulanan", "tambahan"]].forEach(([s, k], i) => A.need(ctx, 700, 270 + i * 76, 980, s, n >= i + 2 ? k : null, { dim: n < i + 2 }));
      if (n >= 7) label(ctx, "versi 1.0: hanya yang wajib", 1190, 680, { size: 26, color: C.good });
      fiktif(ctx);
    },
    rencana(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "RENCANA, PERAN, DAN PAPAN TUGAS");
      const n = reveal(l, 1.5, 2.6, 5);
      [["🔍", "analis kebutuhan"], ["💻", "pemrogram"], ["🧪", "penguji"], ["🎨", "pembuat konten"]].forEach(([ic, t], i) => dim(ctx, n >= 1, () => { card(ctx, 220 + i * 375, 260, 355, 80, { fill: C.bg2, r: 14 }); text(ctx, ic + "  " + t, 250 + i * 375, 310, 24, { weight: 900 }); }));
      const k = Math.min(Math.max(n - 2, 0), 2);
      const cols = [["akan", ["grafik bulanan", "konten pameran"].concat(k < 2 ? ["uji pengguna"] : [])], ["sedang", (k < 1 ? ["fungsi poin"] : []).concat(k >= 2 ? ["uji pengguna"] : [])], ["selesai", ["wawancara", "daftar kebutuhan", "fungsi catat"].concat(k >= 1 ? ["fungsi poin"] : [])]];
      dim(ctx, n >= 2, () => Pr.kanban(ctx, 220, 370, 1480, 360, cols, { hl: n >= 3 ? (k >= 2 ? [1, 0] : [2, 3]) : null }));
      fiktif(ctx);
    },
    desain_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TAHAP DESAIN DATA");
      const n = reveal(l, 1.5, 3.2, 5);
      epTag(ctx, "F12.1", 1560, 190);
      dim(ctx, n >= 1, () => { text(ctx, "poin: dictionary", 290, 280, 24, { weight: 900, color: C.kiko }); Sk.buckets(ctx, 220, 320, 3, { 0: [["A-017", 42]], 1: [["B-102", 35]], 2: [["C-221", 18]] }, { w: 520, h: 70 }); });
      dim(ctx, n >= 2, () => { text(ctx, "antrean setor: deque", 860, 290, 24, { weight: 900, color: C.kiko }); Sk.queue(ctx, 860, 330, ["A-017", "C-221", "B-102"], { w: 150, cap: 4 }); });
      dim(ctx, n >= 3, () => { text(ctx, "riwayat: list", 860, 500, 24, { weight: 900, color: C.kiko }); Py.code(ctx, 860, 515, 820, [{ t: 'riwayat.append(("A-017", 0.8))' }], { rh: 44, size: 20, title: "PYTHON" }); });
      dim(ctx, n >= 4, () => { text(ctx, "peringkat: urutkan poin per kelas", 220, 600, 24, { weight: 900, color: C.kiko }); ["1. XII-3 · 210", "2. XI-1 · 185", "3. X-2 · 160"].forEach((s, i) => text(ctx, s, 240 + i * 170, 650, 20, { weight: 900 })); });
      fiktif(ctx);
    },
    data_terbuka(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DATA TERBUKA, PREDIKSI, DAN DATA PRIBADI MINIMAL");
      const n = reveal(l, 1.5, 3.2, 5);
      dim(ctx, n >= 1, () => { card(ctx, 220, 270, 520, 160, { fill: C.bg2, r: 16 }); text(ctx, "🌐 data terbuka kota", 250, 320, 26, { weight: 900 }); text(ctx, "timbulan sampah per bulan", 250, 362, 22, { weight: 800, color: C.ink2 }); text(ctx, "sebagai pembanding", 250, 396, 22, { weight: 800, color: C.ink2 }); });
      dim(ctx, n >= 2, () => { epTag(ctx, "F12.3", 900, 250); Tr.plot(ctx, 900, 320, 420, 200, { line: { a: 17, b: 3, col: C.good, lw: 4 }, pred: { x: 7, y: 38 } }); });
      dim(ctx, n >= 4, () => { epTag(ctx, "F12.4", 1440, 250); card(ctx, 1440, 300, 260, 300, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); [["nomor anggota", true], ["kelas", true], ["nama lengkap", false], ["alamat", false], ["foto wajah", false]].forEach(([s, ok], i) => text(ctx, (ok ? "✓ " : "✕ ") + s, 1462, 345 + i * 50, 22, { weight: 900, color: ok ? C.good : C.bad })); });
      if (n >= 5) label(ctx, "data yang tidak dikumpulkan tidak bisa bocor", 960, 700, { size: 26 });
      fiktif(ctx);
    },
    versi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TAHAP MEMBANGUN: VERSI DEMI VERSI");
      const n = reveal(l, 1.5, 2.8, 5);
      [["0.1", ["mencatat setoran"]], ["0.2", ["menghitung poin"]], ["0.3", ["menyusun peringkat"]]].forEach(([v, lines], i) => dim(ctx, n >= i + 1, () => A.version(ctx, 220 + i * 500, 290, 460, v, lines)));
      dim(ctx, n >= 4, () => { card(ctx, 220, 480, 1480, 200, { fill: C.bg2, r: 16 }); text(ctx, "tiap versi:", 250, 530, 24, { weight: 900, color: C.ink2 }); text(ctx, "📝 catatan perubahan   💾 cadangan   🧩 satu fungsi satu tugas   🧪 diuji sedikit demi sedikit", 250, 590, 24, { weight: 900 }); });
      fiktif(ctx);
    },
    uji_pengguna(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TAHAP MENGUJI");
      const n = reveal(l, 1.5, 3.0, 5);
      A.tests(ctx, 220, 270, [["normal", "A-017, 0.8 kg", "poin +8", "ok"], ["edge case", "berat 0 kg", "ditolak", "ok"], ["salah", "nomor X-999", "pesan error", "ok"], ["ganda", "setor 2× cepat", "dicatat 1×", "ok"]], { n: Math.min(n + 1, 4) });
      dim(ctx, n >= 4, () => { kid(ctx, 1260, 560, 110, {}); bubble(ctx, 1080, 380, 560, "Antreannya macet, mengetik nomornya kelamaan!", 22); text(ctx, "uji dengan pengguna sungguhan", 1400, 730, 22, { align: "center", weight: 900, color: C.ink2 }); });
      fiktif(ctx);
    },
    pelihara(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TAHAP MEMELIHARA");
      const n = reveal(l, 1.5, 3.0, 4);
      epTag(ctx, "F11.3", 1560, 190);
      dim(ctx, n >= 1, () => A.bug(ctx, 220, 280, 620, "bug: poin ganda", ["setoran tercatat dua kali saat dua petugas", "memakai dua HP bersamaan"]));
      dim(ctx, n >= 2, () => A.version(ctx, 900, 280, 800, "1.1", ["perbaiki bug poin ganda", "nama variabel dan fungsi dirapikan", "README diperbarui"], { fill: C.goodBg, stroke: C.good }));
      dim(ctx, n >= 3, () => { Py.code(ctx, 220, 470, 620, [{ t: "def p(x, y):", bad: true }, { t: "def tambah_poin(nomor, berat):", hl: true }], { rh: 46, size: 22 }); text(ctx, "nama yang jelas", 530, 640, 22, { align: "center", weight: 900, color: C.good }); });
      fiktif(ctx);
    },
    aman_etis(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "KEAMANAN DAN ETIKA IKUT DIRANCANG");
      const n = reveal(l, 1.5, 3.2, 4);
      [["🔐", "akun petugas", "kata sandi kuat + autentikasi dua langkah bila tersedia", "F12.5"], ["💾", "cadangan rutin", "data tidak hilang kalau perangkat rusak", ""], ["🛡️", "data murid", "hanya untuk bank sampah, tidak dibagikan", "F12.4"]].forEach(([ic, t, s, ep], i) => dim(ctx, n >= i + 1, () => { const y = 280 + i * 140; card(ctx, 260, y, 1400, 120, { fill: C.bg2, r: 16 }); text(ctx, ic, 330, y + 80, 56, { align: "center" }); text(ctx, t, 400, y + 55, 30, { weight: 900 }); text(ctx, s, 400, y + 95, 22, { weight: 800, color: C.ink2 }); if (ep) epTag(ctx, ep, 1540, y + 40); }));
      fiktif(ctx);
    },
    pameran(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TAHAP MEMAMERKAN");
      const n = reveal(l, 1.5, 2.8, 5);
      epTag(ctx, "F12.6", 1560, 190);
      dim(ctx, n >= 1, () => Kt.poster(ctx, 220, 270, 300, 400, "rapi"));
      dim(ctx, n >= 2, () => { ctx.save(); ctx.translate(700, 470); ctx.scale(0.7, 0.7); Kt.webpage(ctx, 0, 0, {}); ctx.restore(); });
      dim(ctx, n >= 3, () => { card(ctx, 900, 280, 380, 220, { fill: "#1F2A33", r: 14 }); text(ctx, "▶ video 45 detik", 1090, 400, 28, { align: "center", weight: 900, color: "#fff" }); });
      dim(ctx, n >= 4, () => { card(ctx, 1320, 280, 380, 220, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "🧪 hasil uji coba", 1510, 340, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "6 minggu, 4 kelas", 1510, 395, 24, { align: "center", weight: 900 }); text(ctx, "setoran naik ±3 kg/bulan", 1510, 445, 22, { align: "center", weight: 800 }); });
      dim(ctx, n >= 5, () => { kid(ctx, 1100, 620, 80, { point: true }); kid(ctx, 1260, 620, 80, { hair: "long" }); text(ctx, "pengunjung mencoba menyetor sendiri", 1300, 735, 22, { align: "center", weight: 900, color: C.ink2 }); });
      fiktif(ctx);
    },
    portofolio(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PORTOFOLIO DAN REFLEKSI");
      const n = reveal(l, 1.5, 1.6, 9);
      Pr.check(ctx, 220, 270, 760, ["dokumen kebutuhan", "desain data dan alur", "kode (versi terakhir)", "hasil uji dan perbaikan", "catatan versi", "konten tiga format"], Math.min(n, 6), { gap: 70 });
      dim(ctx, n >= 7, () => { card(ctx, 1040, 270, 660, 410, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "refleksi", 1370, 330, 28, { align: "center", weight: 900, color: C.accentDark }); para(ctx, "Apa yang berhasil?", 1370, 420, 30, 600, { align: "center", weight: 900 }); para(ctx, "Apa yang akan kamu ubah kalau mengulang dari awal?", 1370, 520, 30, 600, { align: "center", weight: 900 }); });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const its = [["Perencana proyek", "tahap ↔ episode", (x, y) => [["kebutuhan", "F11.1"], ["desain data", "F12.1"], ["konten", "F12.6"]].forEach(([a, s], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 22, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 22, { align: "right", weight: 900, color: C.kiko }); })],
        ["Pemeriksa lingkup", "fitur versi 1.0", (x, y) => [["catat setoran", "✓", C.goodBg], ["poin", "✓", C.goodBg], ["permainan 3D", "nanti", "#F4F6F5"]].forEach(([a, s, f], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: f, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 22, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 22, { align: "right", weight: 900 }); })],
        ["Daftar portofolio", "siap pameran?", (x, y) => { ctx.save(); ctx.translate(x - 200, y - 110); ctx.scale(0.55, 0.55); Pr.check(ctx, 0, 0, 720, ["kebutuhan", "desain", "kode", "uji"], 2, { gap: 70, size: 30 }); ctx.restore(); }]];
      its.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 270, 480, 400, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 320, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 332, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 332, 24, { weight: 900 }); text(ctx, t2, x - 160, 366, 19, { weight: 700, color: C.ink2 }); draw(x, 530); });
      text(ctx, "lalu bersama timmu: jalan-jalan masalah, pilih satu masalah nyata, tulis rencana proyek pertamamu", 960, 725, 24, { align: "center", color: C.ink2, weight: 800 });
    },
    tamat(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "AKHIR SERI ANIMASI INFORMATIKA", 960, 300, 36, { align: "center", color: C.accentDark, weight: 900 });
      text(ctx, "Kelas VII sampai XII · Fase D, E, F", 960, 370, 30, { align: "center", weight: 800, color: C.ink2 });
      ["D", "E", "F"].forEach((f, i) => { const x = 700 + i * 260; ctx.fillStyle = [C.kiko, "#8E6BBF", C.good][i]; ctx.beginPath(); ctx.arc(x, 480, 56, 0, Math.PI * 2); ctx.fill(); text(ctx, f, x, 500, 52, { align: "center", weight: 900, color: "#fff" }); text(ctx, "✓", x + 44, 450, 34, { align: "center", weight: 900, color: C.accent }); });
      text(ctx, "terus belajar, terus membuat", 960, 620, 34, { align: "center", weight: 900 });
      kiko(ctx, 960, 760, 140, 0, { wave: l, mood: "happy" });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
