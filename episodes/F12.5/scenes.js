/* Adegan episode F12.5: Transaksi Digital yang Aman. Gaya diagram Fase F. Semua toko, nama, nomor, dan pesan fiktif.
   Muat setelah kiko-core.js, kiko-devices.js, bayar.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Bx = K.bayar, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, clamp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 215) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.2; fn(); ctx.restore(); };
  const fiktif = (ctx, x = 1780, y = 870) => text(ctx, "contoh fiktif", x, y, 16, { align: "right", weight: 800, color: "#9AA7AF" });
  const items = (ctx, x, y, w, rows, n, opt = {}) => rows.forEach(([ic, t, s], i) => dim(ctx, n > i, () => { const gap = opt.gap || 120; card(ctx, x, y + i * gap, w, gap - 16, { fill: i === n - 1 && opt.hl ? "#FFF3D6" : C.bg2, stroke: i === n - 1 && opt.hl ? C.accent : undefined, lw: 3, r: 14 }); text(ctx, ic, x + 50, y + i * gap + (gap - 16) / 2 + 14, 38, { align: "center" }); text(ctx, t, x + 100, y + i * gap + (s ? 42 : (gap - 16) / 2 + 10), 26, { weight: 900 }); if (s) text(ctx, s, x + 100, y + i * gap + 78, 20, { weight: 800, color: C.ink2 }); }));

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 270, 560, 170, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.6, 5);
      [["🛒", "loka pasar"], ["🏦", "perbankan digital"], ["👛", "dompet digital"]].forEach(([ic, t], i) => dim(ctx, n >= i + 1, () => { const x = 480 + i * 410; card(ctx, x, 260, 380, 160, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 70, 360, 56, { align: "center" }); text(ctx, t, x + 130, 352, 28, { weight: 900 }); }));
      dim(ctx, n >= 4, () => { card(ctx, 480, 460, 1200, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "perjalanan satu pembayaran QRIS · titik rawan penipuan", 1080, 528, 28, { align: "center", weight: 900, color: C.accentDark }); });
      dim(ctx, n >= 5, () => { card(ctx, 480, 600, 1200, 90, { fill: C.goodBg, stroke: C.good, lw: 3, r: 16 }); text(ctx, "autentikasi dua langkah · bila tertipu", 1080, 657, 26, { align: "center", weight: 900, color: C.good }); });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "EPISODE SEBELUMNYA", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.3", "Kata Sandi Aman dan Rekam Jejak Digital"], ["E.3", "Keamanan Akun dan Jaringan Dasar"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 260, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 420, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 490, 26, 520, { align: "center", weight: 700, color: C.ink2 }); });
      if (l > 6) label(ctx, "semua toko, nama, nomor, dan pesan fiktif", 960, 680, { size: 26, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_pasar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: REKENING BERSAMA");
      const n = reveal(l, 2.0, 3.0, 4);
      kid(ctx, 360, 540, 120, {}); text(ctx, "pembeli", 360, 700, 24, { align: "center", weight: 900 });
      kid(ctx, 1560, 540, 120, { hair: "long" }); text(ctx, "penjual", 1560, 700, 24, { align: "center", weight: 900 });
      card(ctx, 820, 380, 280, 220, { fill: "#F4F0FA", stroke: "#8E6BBF", lw: 4, r: 18 }); text(ctx, "🔒", 960, 460, 50, { align: "center" }); text(ctx, "rekening bersama", 960, 520, 24, { align: "center", weight: 900, color: "#8E6BBF" });
      const env = (x, y, lab) => { ctx.fillStyle = "#FFF3D6"; rr(ctx, x - 50, y - 32, 100, 64, 8); ctx.fill(); ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 3; rr(ctx, x - 50, y - 32, 100, 64, 8); ctx.stroke(); text(ctx, lab, x, y + 8, 18, { align: "center", weight: 900 }); };
      if (n === 1) env(560, 400, "Rp15rb"); if (n === 2) env(960, 350, "Rp15rb"); if (n >= 4) env(1340, 400, "Rp15rb");
      if (n >= 1) text(ctx, "1. titip uang", 560, 330, 22, { align: "center", weight: 900, color: C.kiko });
      if (n >= 3) { text(ctx, "📦 barang diterima ✓", 960, 680, 24, { align: "center", weight: 900, color: C.good }); }
      if (n >= 4) text(ctx, "3. baru diteruskan", 1340, 330, 22, { align: "center", weight: 900, color: C.good });
    },
    unplugged_stiker(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: STIKER QR PALSU");
      const n = reveal(l, 2.0, 3.0, 4);
      Bx.stand(ctx, 300, 300, "Kedai Sari", { palsu: n >= 1, label: n >= 1 ? "ditempel diam-diam" : null });
      if (n >= 2) { ctx.save(); ctx.translate(960, 470); ctx.scale(0.85, 0.85); Bx.app(ctx, 0, 0, "konfirmasi", { nama: "Pulsa Murah 88", warn: true }); ctx.restore(); }
      if (n >= 3) { card(ctx, 1220, 300, 480, 150, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 }); text(ctx, "langsung bayar tanpa membaca?", 1460, 360, 22, { align: "center", weight: 900, color: C.bad }); text(ctx, "uang masuk ke penipu", 1460, 408, 26, { align: "center", weight: 900, color: C.bad }); }
      if (n >= 4) { card(ctx, 1220, 480, 480, 150, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "baca nama penerima dulu", 1460, 540, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "tidak cocok? batalkan", 1460, 588, 24, { align: "center", weight: 900, color: C.good }); }
      fiktif(ctx);
    },
    loka_pasar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LOKA PASAR: UANG DITAHAN DULU");
      const n = reveal(l, 1.5, 3.0, 5);
      Bx.flow(ctx, 220, 290, [["🙋", "pembeli membayar"], ["🔒", "platform menahan uang"], ["📦", "penjual mengirim"], ["✅", "pesanan diterima"], ["💸", "uang ke penjual"]], Math.min(n, 5) - 1, { w: 250, gap: 57 });
      dim(ctx, n >= 5, () => { card(ctx, 220, 500, 1480, 180, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 }); text(ctx, "\"transfer langsung saja ke rekeningku, lebih murah\"", 960, 560, 26, { align: "center", weight: 900 }); text(ctx, "di luar aplikasi = perlindungan rekening bersama hilang", 960, 620, 26, { align: "center", weight: 900, color: C.bad }); });
      fiktif(ctx);
    },
    dompet_bank(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PERBANKAN DIGITAL DAN DOMPET DIGITAL");
      const n = reveal(l, 1.5, 2.6, 5);
      dim(ctx, n >= 1, () => { card(ctx, 220, 270, 700, 170, { fill: C.bg2, r: 18 }); text(ctx, "🏦 perbankan digital", 260, 330, 30, { weight: 900 }); text(ctx, "memindahkan uang di rekening bank lewat aplikasi", 260, 380, 21, { weight: 800, color: C.ink2 }); });
      dim(ctx, n >= 2, () => { card(ctx, 1000, 270, 700, 170, { fill: C.bg2, r: 18 }); text(ctx, "👛 dompet digital", 1040, 330, 30, { weight: 900 }); text(ctx, "saldo untuk belanja sehari-hari", 1040, 380, 21, { weight: 800, color: C.ink2 }); });
      [["🔢", "PIN", "hanya kamu yang tahu"], ["📩", "OTP", "kode sekali pakai, berlaku singkat"], ["🔔", "notifikasi", "tiap transaksi tercatat"]].forEach(([ic, t, s], i) => dim(ctx, n >= i + 3, () => { const x = 220 + i * 500; card(ctx, x, 480, 460, 200, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 18 }); text(ctx, ic, x + 230, 550, 50, { align: "center" }); text(ctx, t, x + 230, 610, 30, { align: "center", weight: 900 }); text(ctx, s, x + 230, 650, 20, { align: "center", weight: 800, color: C.ink2 }); }));
    },
    perjalanan_qris(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PERJALANAN SATU PEMBAYARAN QRIS");
      const k = reveal(l, 1.5, 2.8, 6);
      const mode = k <= 1 ? "pindai" : k === 2 ? "konfirmasi" : k === 3 ? "pin" : "berhasil";
      ctx.save(); ctx.translate(400, 470); ctx.scale(0.85, 0.85); Bx.app(ctx, 0, 0, mode, {}); ctx.restore();
      Bx.flow(ctx, 660, 300, [["📷", "pindai kode"], ["👀", "cek nama + nominal"], ["🔢", "masukkan PIN"], ["🏦", "penerbit memproses"]], k <= 4 ? k - 1 : 3, { w: 230, gap: 40, h: 130 });
      dim(ctx, k >= 5, () => Bx.flow(ctx, 660, 470, [["🏪", "uang masuk ke Kedai Sari"], ["🔔", "notifikasi ke kedua pihak"]], k >= 6 ? 1 : 0, { w: 520, gap: 40, h: 130 }));
      if (k >= 2) label(ctx, "Kedai Sari · Rp15.000", 1180, 680, { size: 26 });
      fiktif(ctx);
    },
    titik_rawan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DUA TITIK RAWAN");
      const n = reveal(l, 1.5, 3.4, 4);
      dim(ctx, n >= 1, () => { Bx.stand(ctx, 240, 280, "Kedai Sari", { palsu: true }); card(ctx, 540, 300, 360, 150, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "1. stiker QR palsu", 720, 360, 24, { align: "center", weight: 900, color: C.bad }); text(ctx, "ditempel di atas yang asli", 720, 400, 20, { align: "center", weight: 800 }); });
      dim(ctx, n >= 2, () => { card(ctx, 540, 470, 360, 140, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "baca nama penjual", 720, 528, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "sebelum memasukkan PIN", 720, 568, 20, { align: "center", weight: 800 }); });
      dim(ctx, n >= 3, () => { card(ctx, 1000, 280, 330, 330, { fill: "#fff", stroke: C.bad, lw: 4, r: 16 }); text(ctx, "screenshot dari pembeli", 1165, 320, 18, { align: "center", weight: 900, color: C.ink2 }); ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(1165, 400, 40, 0, Math.PI * 2); ctx.fill(); text(ctx, "✓", 1165, 416, 44, { align: "center", weight: 900, color: "#fff" }); text(ctx, "Rp15.000", 1165, 490, 28, { align: "center", weight: 900 }); text(ctx, "hasil sunting?", 1165, 560, 24, { align: "center", weight: 900, color: C.bad }); });
      dim(ctx, n >= 4, () => { card(ctx, 1360, 280, 340, 330, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "2. penjual mengecek", 1530, 340, 22, { align: "center", weight: 900, color: C.good }); text(ctx, "🔔", 1530, 430, 56, { align: "center" }); para(ctx, "notifikasi di aplikasinya sendiri", 1530, 500, 22, 300, { align: "center", weight: 900 }); });
      fiktif(ctx);
    },
    rekayasa_sosial(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PENIPUAN YANG MEMBUJUK ORANGNYA");
      const n = reveal(l, 2.0, 3.4, 3);
      dim(ctx, n >= 1, () => Bx.chat(ctx, 220, 270, 480, "+62 8xx (nomor tak dikenal)", ["Selamat! Kamu menang hadiah Rp5 juta.", "Kirim kode OTP yang masuk untuk klaim, ya!"], { warn: [1] }));
      dim(ctx, n >= 2, () => { card(ctx, 740, 270, 440, 330, { fill: "#EAF2EE", r: 16 }); text(ctx, "📞 panggilan masuk", 960, 320, 22, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "\"Petugas Bank\"", 960, 380, 28, { align: "center", weight: 900 }); para(ctx, "\"Ada transaksi mencurigakan. Sebutkan kode yang baru masuk untuk membatalkannya.\"", 960, 440, 20, 380, { align: "center", weight: 800 }); });
      dim(ctx, n >= 3, () => Bx.chat(ctx, 1220, 270, 480, "Kurir Paket (nomor baru)", ["Paketmu tertahan, cek resi di sini:", "📎 Resi_Paket.apk"], { warn: [1] }));
      if (n >= 3) label(ctx, "APK asing bisa diam-diam membaca SMS berisi OTP", 960, 690, { size: 26, color: C.bad });
      fiktif(ctx);
    },
    tanda_bahaya(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "EMPAT TANDA BAHAYA");
      const n = reveal(l, 1.5, 2.6, 5);
      [["⏰", "mendesak", "\"harus sekarang juga!\""], ["🎁", "terlalu bagus", "hadiah tanpa ikut lomba"], ["🔑", "meminta kode", "OTP, PIN, kata sandi"], ["🔗", "link atau file asing", ".apk, situs mirip asli"]].forEach(([ic, t, s], i) => dim(ctx, n >= i + 1, () => { const x = 220 + (i % 2) * 750, y = 270 + Math.floor(i / 2) * 170; card(ctx, x, y, 730, 150, { fill: C.badBg, stroke: C.bad, lw: 3, r: 16 }); text(ctx, ic, x + 70, y + 92, 52, { align: "center" }); text(ctx, t, x + 140, y + 68, 30, { weight: 900, color: C.bad }); text(ctx, s, x + 140, y + 110, 22, { weight: 800 }); }));
      if (n >= 5) { card(ctx, 220, 620, 1480, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "bank dan dompet digital resmi tidak pernah meminta OTP atau PIN-mu", 960, 678, 28, { align: "center", weight: 900, color: C.accentDark }); }
    },
    tiga_faktor(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "AUTENTIKASI DUA LANGKAH: DUA FAKTOR BERBEDA JENIS");
      const n = reveal(l, 1.5, 3.2, 4);
      [["🧠", "yang kamu tahu", "kata sandi, PIN"], ["📱", "yang kamu punya", "HP, kunci keamanan"], ["🖐️", "yang ada pada dirimu", "sidik jari, wajah"]].forEach(([ic, t, s], i) => dim(ctx, n >= i + 2, () => { const x = 220 + i * 500; card(ctx, x, 280, 460, 300, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 230, 380, 70, { align: "center" }); text(ctx, t, x + 230, 460, 30, { align: "center", weight: 900 }); text(ctx, s, x + 230, 505, 22, { align: "center", weight: 800, color: C.ink2 }); }));
      dim(ctx, n >= 1, () => text(ctx, "2 faktor = 2 jenis berbeda dari tiga ini", 960, 640, 26, { align: "center", weight: 900, color: C.accentDark }));
    },
    moda_2fa(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MODA AUTENTIKASI DUA LANGKAH");
      const n = reveal(l, 1.5, 2.8, 5);
      const rows = [["📩", "kode lewat SMS", "mudah, tetapi bisa dicegat", 1], ["⏱️", "aplikasi autentikator", "kode baru tiap 30 detik", 2], ["🔑", "kunci keamanan / passkey", "paling tahan terhadap situs palsu", 3], ["🖐️", "biometrik di HP", "membuka kunci di perangkatmu sendiri", 2]];
      rows.forEach(([ic, t, s, lv], i) => dim(ctx, n >= i + 1, () => { const y = 270 + i * 100; card(ctx, 220, y, 1480, 84, { fill: C.bg2, r: 14 }); text(ctx, ic, 270, y + 56, 36, { align: "center" }); text(ctx, t, 320, y + 54, 28, { weight: 900 }); text(ctx, s, 820, y + 54, 22, { weight: 800, color: C.ink2 }); for (let k = 0; k < 3; k++) { ctx.fillStyle = k < lv ? C.good : "#DCE6EC"; rr(ctx, 1500 + k * 60, y + 30, 50, 24, 6); ctx.fill(); } }));
      text(ctx, "kekuatan", 1590, 262, 18, { align: "center", weight: 900, color: C.ink2 });
      if (n >= 5) label(ctx, "mulai dari akun email: kunci pemulihan akun-akun lain", 960, 700, { size: 26 });
    },
    bila_tertipu(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TERLANJUR TERTIPU? BERGERAK CEPAT");
      const n = reveal(l, 1.5, 3.0, 4);
      items(ctx, 300, 270, 1320, [["📞", "hubungi bank atau penyedia lewat nomor resmi", "nomor di aplikasi atau kartu, minta blokir"], ["🔐", "ganti kata sandi, keluarkan akun dari semua perangkat", ""], ["🗂️", "simpan bukti", "screenshot chat, nomor, waktu, jumlah"], ["📣", "laporkan ke platform dan pihak berwenang", ""]], n, { hl: true });
    },
    kebiasaan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "KEBIASAAN AMAN");
      const n = reveal(l, 1.5, 2.6, 5);
      items(ctx, 300, 270, 1320, [["🔔", "notifikasi transaksi selalu aktif", ""], ["📉", "batas transaksi harian secukupnya", ""], ["🏬", "aplikasi hanya dari toko resmi", ""], ["⏳", "tiga detik: baca nama dan nominal sebelum bayar", ""]], n, { hl: true, gap: 104 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const its = [["Simulasi kasir QRIS", "cek nama dan nominal", (x, y) => { ctx.save(); ctx.translate(x, y - 12); ctx.scale(0.5, 0.5); Bx.app(ctx, 0, 0, "konfirmasi", { nama: "Pulsa Murah 88", warn: true }); ctx.restore(); }],
        ["Detektif pesan penipuan", "temukan tanda bahayanya", (x, y) => ["⏰ mendesak", "🎁 terlalu bagus", "🔑 meminta kode"].forEach((s, i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: C.badBg, r: 10 }); text(ctx, s, x - 180, y - 64 + i * 66, 22, { weight: 900 }); })],
        ["Penyusun 2FA", "pasangkan dua faktor", (x, y) => [["kata sandi", "tahu"], ["autentikator", "punya"], ["sidik jari", "diri"]].forEach(([a, s], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 22, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 22, { align: "right", weight: 900, color: C.kiko }); })]];
      its.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 270, 480, 400, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 320, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 332, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 332, 24, { weight: 900 }); text(ctx, t2, x - 160, 366, 19, { weight: 700, color: C.ink2 }); draw(x, 530); });
      text(ctx, "lalu di rumah bersama orang tua: cek notifikasi, batas transaksi, dan 2FA satu aplikasi", 960, 725, 24, { align: "center", color: C.ink2, weight: 800 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
