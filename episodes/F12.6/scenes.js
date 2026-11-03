/* Adegan episode F12.6: Kreasi Konten Digital dengan Metode Bervariasi. Gaya diagram Fase F. Produk "Setor Sampah" fiktif.
   Muat setelah kiko-core.js, kiko-devices.js, py.js (F11.0), konten.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Py = K.py, Kt = K.konten, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, clamp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 215) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.2; fn(); ctx.restore(); };
  const fiktif = (ctx, x = 1780, y = 870) => text(ctx, "contoh fiktif", x, y, 16, { align: "right", weight: 800, color: "#9AA7AF" });
  const PESAN = "setor sampah plastikmu lewat Setor Sampah, kumpulkan poin, dan bantu sekolah lebih bersih";

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 270, 560, 170, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.8, 5);
      dim(ctx, n >= 1, () => { card(ctx, 480, 250, 1220, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "satu pesan inti → tiga format", 1090, 302, 30, { align: "center", weight: 900, color: C.accentDark }); });
      [["🖼️", "infografik", "dibaca sekilas"], ["🎬", "video pendek", "30–60 detik"], ["🌐", "halaman web", "info lengkap"]].forEach(([ic, t, s], i) => dim(ctx, n >= i + 2, () => { const x = 480 + i * 410; card(ctx, x, 370, 380, 260, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 190, 460, 60, { align: "center" }); text(ctx, t, x + 190, 535, 30, { align: "center", weight: 900 }); text(ctx, s, x + 190, 578, 22, { align: "center", weight: 800, color: C.ink2 }); }));
      if (n >= 5) label(ctx, "lalu: etika, aksesibilitas, uji ke audiens", 1090, 700, { size: 26 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "EPISODE SEBELUMNYA", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D9.5", "Produksi dan Diseminasi Konten Digital"], ["F12.4", "Hukum Digital: hak cipta dan data pribadi"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 260, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 420, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 490, 26, 520, { align: "center", weight: 700, color: C.ink2 }); });
      if (l > 6) label(ctx, "produk, nama, dan angka di episode ini fiktif", 960, 680, { size: 26, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_tiga(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: SATU PESAN, TIGA CARA");
      const n = reveal(l, 3.0, 2.8, 3);
      label(ctx, "\"ajak warga sekolah menyetor sampah plastik\"", 960, 285, { size: 26, color: C.ink2 });
      dim(ctx, n >= 1, () => { Kt.poster(ctx, 260, 330, 300, 380, "rapi"); text(ctx, "kelompok 1: poster kertas", 410, 740, 22, { align: "center", weight: 900 }); });
      dim(ctx, n >= 2, () => { kid(ctx, 870, 520, 110, { point: true }); kid(ctx, 1050, 520, 110, { hair: "long" }); bubble(ctx, 780, 400, 300, "Botolnya jangan dibuang!", 22); text(ctx, "kelompok 2: drama 30 detik", 960, 740, 22, { align: "center", weight: 900 }); });
      dim(ctx, n >= 3, () => { [0, 1, 2].forEach(i => { ctx.save(); ctx.translate(1380 + i * 70, 420 + i * 10); ctx.rotate(-0.08 + i * 0.08); card(ctx, -90, -110, 180, 240, { fill: i === 1 ? "#FFF9E0" : "#fff", stroke: "#B7C4CC", lw: 2, r: 8 }); for (let k = 0; k < 6; k++) { ctx.fillStyle = "#DCE6EC"; ctx.fillRect(-70, -80 + k * 30, 140, 10); } ctx.restore(); }); text(ctx, "kelompok 3: selebaran berlipat", 1450, 740, 22, { align: "center", weight: 900 }); });
    },
    unplugged_ingat(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SEPULUH MENIT KEMUDIAN: APA YANG DIINGAT?");
      const n = reveal(l, 3.0, 2.4, 4);
      [["🖼️", "poster", "cepat dibaca", "⚡"], ["🎭", "drama", "paling diingat", "🧠"], ["📄", "selebaran", "paling lengkap", "📚"]].forEach(([ic, t, s, k], i) => dim(ctx, n >= i + 1, () => { const x = 230 + i * 500; card(ctx, x, 280, 460, 300, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 230, 380, 66, { align: "center" }); text(ctx, t, x + 230, 455, 30, { align: "center", weight: 900 }); text(ctx, k + " " + s, x + 230, 510, 26, { align: "center", weight: 900, color: C.good }); }));
      if (n >= 4) label(ctx, "tiap format punya kekuatan; pesannya tetap satu", 960, 680, { size: 28 });
    },
    pesan_inti(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PESAN INTI: SATU KALIMAT");
      const n = reveal(l, 1.5, 3.0, 4);
      card(ctx, 260, 280, 1400, 180, { fill: "#FFF3D6", stroke: C.accent, lw: 5, r: 20 }); para(ctx, "\"" + PESAN.charAt(0).toUpperCase() + PESAN.slice(1) + ".\"", 960, 350, 36, 1300, { align: "center", weight: 900 });
      [["✂️", "pendek", "satu kalimat"], ["💡", "jelas manfaatnya", "poin, sekolah bersih"], ["👉", "ada ajakan", "setor lewat aplikasi"]].forEach(([ic, t, s], i) => dim(ctx, n >= i + 2, () => { const x = 260 + i * 480; card(ctx, x, 500, 440, 160, { fill: C.goodBg, stroke: C.good, lw: 3, r: 16 }); text(ctx, ic + " " + t, x + 220, 565, 28, { align: "center", weight: 900, color: C.good }); text(ctx, s, x + 220, 615, 22, { align: "center", weight: 800 }); }));
      fiktif(ctx);
    },
    audiens(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SIAPA AUDIENSNYA, DI MANA MEREKA MELIHAT?");
      const n = reveal(l, 1.5, 3.0, 4);
      [["🧑‍🎓", "murid", "lorong, media sosial", "infografik, video pendek"], ["🧑‍🏫", "guru", "grup sekolah", "video pendek, halaman web"], ["👪", "orang tua", "link dari wali kelas", "halaman web"]].forEach(([ic, t, s, f], i) => dim(ctx, n >= i + 1, () => { const y = 270 + i * 140; card(ctx, 260, y, 1400, 120, { fill: C.bg2, r: 16 }); text(ctx, ic, 330, y + 80, 56, { align: "center" }); text(ctx, t, 400, y + 55, 30, { weight: 900 }); text(ctx, "melihat di: " + s, 400, y + 95, 22, { weight: 800, color: C.ink2 }); text(ctx, "→ " + f, 1620, y + 72, 26, { align: "right", weight: 900, color: C.kiko }); }));
      if (n >= 4) label(ctx, "audiens menentukan tempat dan format", 960, 715, { size: 26 });
    },
    infografik(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "FORMAT 1: INFOGRAFIK");
      const n = reveal(l, 1.5, 2.8, 5);
      Kt.poster(ctx, 260, 260, 420, 470, "rapi");
      [["1", "judul besar", "terbaca dari jauh"], ["2", "tiga poin + ikon, satu angka", "bukan paragraf"], ["3", "ajakan di bawah", "apa yang harus dilakukan"], ["4", "ruang kosong, warna kontras", "mata tidak lelah"]].forEach(([k, t, s], i) => dim(ctx, n >= i + 1, () => { const y = 280 + i * 110; card(ctx, 760, y, 900, 94, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 14 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(808, y + 47, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, k, 808, y + 56, 24, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, 850, y + 44, 26, { weight: 900 }); text(ctx, s, 850, y + 76, 19, { weight: 800, color: C.ink2 }); }));
      fiktif(ctx);
    },
    infografik_cek(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PADAT ATAU RAPI? TES LIMA DETIK");
      const n = reveal(l, 1.5, 3.0, 4);
      dim(ctx, n >= 1, () => { Kt.poster(ctx, 260, 270, 560, 400, "padat"); text(ctx, "✕ versi padat", 540, 710, 26, { align: "center", weight: 900, color: C.bad }); });
      dim(ctx, n >= 2, () => { Kt.poster(ctx, 900, 270, 340, 400, "rapi"); text(ctx, "✓ versi rapi", 1070, 710, 26, { align: "center", weight: 900, color: C.good }); });
      dim(ctx, n >= 3, () => { card(ctx, 1300, 300, 380, 300, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "⏱️ 5 detik", 1490, 380, 40, { align: "center", weight: 900 }); para(ctx, "tunjukkan, tutup, lalu tanya: apa yang kamu ingat?", 1490, 450, 22, 330, { align: "center", weight: 900, color: C.accentDark }); });
      fiktif(ctx);
    },
    video_kait(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "FORMAT 2: VIDEO PENDEK, TIGA DETIK PERTAMA");
      const n = reveal(l, 2.0, 3.0, 4);
      ctx.fillStyle = "#DCE6EC"; rr(ctx, 260, 300, 1400, 24, 12); ctx.fill(); ctx.fillStyle = C.accent; rr(ctx, 260, 300, 1400 * 3 / 45, 24, 12); ctx.fill(); text(ctx, "0–3 detik: kait", 260, 290, 20, { weight: 900, color: C.accentDark }); text(ctx, "30–60 detik", 1660, 290, 20, { align: "right", weight: 900, color: C.ink2 });
      dim(ctx, n >= 1, () => { card(ctx, 260, 360, 640, 330, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 }); text(ctx, "✕ dibuka dengan logo panjang", 580, 420, 26, { align: "center", weight: 900, color: C.bad }); text(ctx, "TIM PROYEK XII-3", 580, 540, 40, { align: "center", weight: 900, color: "#9AA7AF" }); text(ctx, "penonton sudah menggeser…", 580, 640, 22, { align: "center", weight: 800 }); });
      dim(ctx, n >= 2, () => { card(ctx, 1020, 360, 640, 330, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "✓ dibuka dengan masalah", 1340, 420, 26, { align: "center", weight: 900, color: C.good }); for (let i = 0; i < 9; i++) Kt.bottle(ctx, 1110 + (i % 5) * 40 + Math.floor(i / 5) * 20, 560 - Math.floor(i / 5) * 40, 70); if (n >= 3) { text(ctx, "→ 📱 satu ketukan", 1470, 560, 28, { align: "center", weight: 900 }); } text(ctx, "\"botol di sudut kelas?\"", 1340, 650, 22, { align: "center", weight: 900 }); });
      fiktif(ctx);
    },
    papan_cerita(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PAPAN CERITA: LIMA PANEL");
      const k = reveal(l, 1.5, 2.2, 5);
      Kt.panels(ctx, 220, 270, [["🍾", "kait", "botol menumpuk"], ["😟", "masalah", "kelas kotor"], ["📱", "cara pakai", "pindai, setor"], ["⭐", "hasil", "poin bertambah"], ["👉", "ajakan", "mulai Senin"]], k - 1, { w: 272, gap: 30 });
      dim(ctx, k >= 5, () => { [["🎙️", "suara jelas"], ["💬", "teks di layar"], ["🎵", "musik berlisensi"]].forEach(([ic, t], i) => { card(ctx, 260 + i * 480, 560, 440, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, ic + "  " + t, 480 + i * 480, 628, 28, { align: "center", weight: 900 }); }); });
      fiktif(ctx);
    },
    halaman_web(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "FORMAT 3: HALAMAN WEB DENGAN HTML");
      const n = reveal(l, 1.5, 2.6, 5);
      Py.code(ctx, 220, 260, 920, [{ t: "<h1>Setor Sampah</h1>", hl: n === 1 }, { t: "<p>Setor botol plastik, kumpulkan poin.</p>", hl: n === 2 }, { t: '<img src="setor.jpg"', hl: n === 3 }, { t: '     alt="Anak menyetor botol plastik">', hl: n === 3 }, { t: '<a href="daftar.html">Daftar sekarang</a>', hl: n === 4 }], { rh: 52, size: 22, title: "HTML" });
      [["h1", "judul"], ["p", "paragraf"], ["img", "gambar"], ["a", "link"]].forEach(([t, s], i) => dim(ctx, n >= i + 1, () => { card(ctx, 220 + i * 230, 590, 210, 90, { fill: C.bg2, r: 14 }); text(ctx, "<" + t + ">", 325 + i * 230, 630, 26, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 325 + i * 230, 664, 20, { align: "center", weight: 800, color: C.ink2 }); }));
      ctx.save(); ctx.translate(1440, 480); ctx.scale(0.82, 0.82); Kt.webpage(ctx, 0, 0, {}); ctx.restore();
      fiktif(ctx);
    },
    alt_text(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ALT TEXT: GAMBAR YANG BISA DIBACAKAN");
      const n = reveal(l, 1.5, 3.0, 4);
      ctx.save(); ctx.translate(420, 480); ctx.scale(0.82, 0.82); Kt.webpage(ctx, 0, 0, { gagal: n >= 2, alt: "Anak menyetor botol plastik di meja bank sampah" }); ctx.restore();
      dim(ctx, n >= 1, () => { card(ctx, 700, 280, 1000, 140, { fill: C.bg2, r: 16 }); text(ctx, "🔊 pembaca layar:", 730, 330, 24, { weight: 900, color: C.kiko }); text(ctx, "\"gambar: anak menyetor botol plastik di meja bank sampah\"", 730, 380, 24, { weight: 800 }); });
      dim(ctx, n >= 2, () => { card(ctx, 700, 440, 1000, 100, { fill: "#FFF3D6", r: 16 }); text(ctx, "gambar gagal dimuat? alt text yang tampil", 730, 500, 24, { weight: 900, color: C.accentDark }); });
      dim(ctx, n >= 3, () => { card(ctx, 700, 560, 480, 120, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "✕ alt=\"foto\"", 940, 630, 28, { align: "center", weight: 900, color: C.bad }); card(ctx, 1220, 560, 480, 120, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "✓ jelaskan isinya", 1460, 630, 28, { align: "center", weight: 900, color: C.good }); });
    },
    etika(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PERIKSA ETIKANYA");
      const n = reveal(l, 1.5, 3.4, 4);
      [["🎵", "musik, foto, ikon", "milik sendiri atau berlisensi (lihat F12.4)"], ["🙋", "wajah teman", "hanya dengan izinnya"], ["📊", "klaim jujur", "\"bersih 50 kg sebulan\" hanya kalau datanya ada"]].forEach(([ic, t, s], i) => dim(ctx, n >= i + 1, () => { const y = 280 + i * 140; card(ctx, 260, y, 1400, 120, { fill: C.bg2, r: 16 }); text(ctx, ic, 330, y + 80, 56, { align: "center" }); text(ctx, t, 400, y + 55, 30, { weight: 900 }); text(ctx, s, 400, y + 95, 22, { weight: 800, color: C.ink2 }); }));
      fiktif(ctx);
    },
    uji(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "UJI KE AUDIENS SEBELUM TERBIT");
      const n = reveal(l, 1.5, 2.8, 5);
      [["👥", "tunjukkan ke 3 orang dari audiensmu"], ["❓", "apa yang diingat? apa yang membingungkan?"], ["🔧", "perbaiki satu hal"], ["🚀", "terbitkan, lalu lihat tanggapannya"]].forEach(([ic, t], i) => dim(ctx, n >= i + 1, () => { const x = 220 + i * 375; card(ctx, x, 300, 345, 300, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 18 }); text(ctx, ic, x + 172, 400, 60, { align: "center" }); para(ctx, t, x + 172, 470, 24, 300, { align: "center", weight: 900 }); if (i < 3) text(ctx, "→", x + 360, 460, 34, { align: "center", weight: 900, color: "#7B8B95" }); }));
      if (n >= 5) label(ctx, "versi berikutnya selalu lebih baik", 960, 680, { size: 28 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const its = [["Pemilih format", "enam situasi", (x, y) => [["mading lorong", "🖼️"], ["cara memakai", "🎬"], ["info lengkap", "🌐"]].forEach(([a, s], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 22, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 26, { align: "right" }); })],
        ["Penyusun papan cerita", "urutkan lima panel", (x, y) => { ctx.save(); ctx.translate(x - 220, y - 90); ctx.scale(0.55, 0.55); Kt.panels(ctx, 0, 0, [["🍾", "kait", ""], ["😟", "masalah", ""], ["📱", "cara", ""]], null, { w: 250, h: 200, gap: 20 }); ctx.restore(); }],
        ["Pemeriksa halaman web", "alt text dan link", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 110); ctx.scale(0.62, 0.62); Py.code(ctx, 0, 0, 680, [{ t: '<img alt="foto">', bad: true }, { t: '<a href="#">klik di sini</a>', bad: true }, { t: "<h1>Setor Sampah</h1>" }], { rh: 46, size: 24, title: "HTML" }); ctx.restore(); }]];
      its.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 270, 500, 400, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 320, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 332, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 332, 24, { weight: 900 }); text(ctx, t2, x - 160, 366, 19, { weight: 700, color: C.ink2 }); draw(x, 530); });
      text(ctx, "lalu bersama kelompok: satu pesan inti, tiga format untuk produk proyek akhirmu, uji ke tiga orang", 960, 725, 24, { align: "center", color: C.ink2, weight: 800 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
