/* Adegan episode D9.4: Data Pribadi, Identitas Digital, dan Kesadaran Penuh. Muat setelah kiko-core.js, kiko-devices.js, empati.js, privasi.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Em = K.empati, Pv = K.privasi, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  // sepuluh kartu permainan: [ikon, label, kotak]
  const CARDS = [["🙂", "nama panggilan", "publik"], ["⚽", "hobi", "publik"], ["🏫", "nama sekolah", "tergantung"], ["🏠", "alamat rumah", "privat"], ["📱", "nomor HP", "privat"], ["🎂", "tanggal lahir", "tergantung"], ["👩", "nama ibu", "privat"], ["🤳", "foto wajah", "tergantung"], ["🕒", "jadwal les", "privat"], ["🐱", "nama kucing", "publik"]];
  const RISKY = [["🪪", "NIK"], ["🏠", "alamat lengkap"], ["📱", "nomor HP"], ["🎂", "tanggal lahir"], ["👩", "nama ibu kandung"], ["📄", "foto dokumen"]];
  const SETTINGS = [["🔒", "Akun privat", "hanya teman yang kamu setujui"], ["📍", "Lokasi langsung mati", "jangan siarkan posisimu"], ["📝", "Bio bersih", "tanpa sekolah, kelas, nomor HP"], ["🏷️", "Tinjau tanda", "setujui dulu foto yang menandaimu"]];
  const ASK = ["Siapa yang bisa melihat?", "Apa yang bisa diketahui orang dari sini?", "Masih nyamankah aku jika guru, orang tua, atau orang asing melihatnya setahun lagi?", "Apakah ini milikku untuk dibagikan?"];
  const selfieImg = (ctx, x, y, w, h) => { ctx.fillStyle = "#CFE3D8"; ctx.fillRect(x, y, w, h); kid(ctx, x + w / 2, y + h * 0.55, h * 0.42, { hair: "long" }); };
  const cardImg = (mask) => (ctx, x, y, w, h) => { ctx.fillStyle = "#CFE3D8"; ctx.fillRect(x, y, w, h); Pv.idCard(ctx, x + w / 2 - 150, y + 6, { w: 300, mask, flag: !mask }); };
  const beachImg = (ctx, x, y, w, h) => { ctx.fillStyle = "#9FD6EA"; ctx.fillRect(x, y, w, h * 0.55); ctx.fillStyle = "#F2DDA4"; ctx.fillRect(x, y + h * 0.55, w, h * 0.45); ctx.fillStyle = "#F2B134"; ctx.beginPath(); ctx.arc(x + w * 0.8, y + h * 0.25, h * 0.14, 0, Math.PI * 2); ctx.fill(); };

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const items = [["🪪", "Data pribadi", "mana yang publik, mana yang privat"], ["👤", "Identitas digital", "gambaran dirimu di internet"], ["🧘", "Kesadaran penuh", "jeda dulu sebelum menekan unggah"]];
      const n = reveal(l, 0.8, 1.3, 3);
      items.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 640 + i * 380; card(ctx, x, 260, 350, 300, { fill: i === 2 ? "#FFF3D6" : C.bg2, r: 20 }); text(ctx, ic, x + 175, 370, 72, { align: "center" }); text(ctx, t, x + 175, 440, 30, { align: "center", weight: 900 }); para(ctx, s, x + 175, 490, 22, 310, { align: "center", color: C.ink2, weight: 700 }); ctx.restore(); });
      if (n >= 3) banner(ctx, "berhenti sejenak sebelum jari menekan unggah", 640, 900);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.3", "Kata Sandi Aman dan Rekam Jejak Digital"], ["D7.7", "Ruang Publik Virtual dan Empati"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 32, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_cards(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: SEPULUH KARTU TENTANG AKU");
      const n = reveal(l, 1.2, 0.8, 10);
      CARDS.forEach(([ic, lab], i) => { const x = 260 + (i % 5) * 290, y = 290 + Math.floor(i / 5) * 190; Pv.info(ctx, x, y, 260, 150, ic, lab, null, { dim: i >= n, on: i === n - 1, size: 26 }); });
      kid(ctx, 1700, 760, 110, { point: true });
      if (n >= 10) label(ctx, "sepuluh kartu, satu orang: kamu", 960, 710);
    },
    unplugged_boxes(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TIGA KOTAK: PUBLIK · PRIVAT · TERGANTUNG");
      const subs = { publik: "boleh diketahui semua orang", privat: "hanya keluarga dan orang terdekat", tergantung: "teman sekelas ya, orang asing tidak" };
      const n = reveal(l, 3.0, 0.75, 10);
      const groups = { publik: [], privat: [], tergantung: [] };
      CARDS.slice(0, n).forEach(([ic, lab, k]) => groups[k].push([ic, lab]));
      ["publik", "tergantung", "privat"].forEach((k, i) => Pv.box(ctx, 230 + i * 520, 300, 460, 400, k, subs[k], groups[k]));
      if (n >= 10) label(ctx, "pilahanmu boleh berbeda dengan temanmu: bahas alasannya", 960, 750, { size: 26, color: C.ink2 });
    },

    data_def(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DATA PRIBADI: SIAPA KAMU, DI MANA KAMU, CARA MENGHUBUNGIMU");
      card(ctx, 200, 280, 620, 400, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 }); text(ctx, "UMUM", 510, 330, 30, { align: "center", weight: 900, color: C.good });
      const nu = reveal(l, 2.0, 0.8, 3);
      [["🙂", "nama panggilan"], ["⚽", "hobi"], ["🐱", "nama kucing"]].forEach(([ic, lab], i) => { if (i < nu) Pv.info(ctx, 240, 355 + i * 100, 540, 84, ic, lab, null, { size: 26 }); });
      card(ctx, 880, 280, 840, 400, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "BERISIKO", 1300, 330, 30, { align: "center", weight: 900, color: C.bad });
      const nr = reveal(l, 5.5, 0.7, 6);
      RISKY.forEach(([ic, lab], i) => { if (i < nr) Pv.info(ctx, 910 + (i % 2) * 400, 355 + Math.floor(i / 2) * 100, 380, 84, ic, lab, null, { size: 24 }); });
      if (nr >= 6) label(ctx, "berisiko: cukup untuk menemukan atau menyamar menjadi dirimu", 960, 740, { size: 26, color: C.bad });
    },
    puzzle(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "POTONGAN KECIL MENJADI POTRET LENGKAP");
      const pieces = [["🤳", "foto berseragam", "→ sekolahmu"], ["🕒", "\"pulang jam tiga\"", "→ waktumu"], ["🛣️", "\"lewat gang mawar\"", "→ jalurmu"]];
      const n = reveal(l, 1.5, 2.2, 3);
      pieces.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 220 + i * 380; card(ctx, x, 300, 340, 260, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 4, r: 18 }); text(ctx, ic, x + 170, 390, 64, { align: "center" }); text(ctx, t, x + 170, 460, 26, { align: "center", weight: 900 }); text(ctx, s, x + 170, 510, 24, { align: "center", weight: 800, color: C.ink2 }); if (i < 2) text(ctx, "+", x + 360, 450, 60, { align: "center", weight: 900, color: C.ink2 }); ctx.restore(); });
      text(ctx, "=", 1380, 450, 60, { align: "center", weight: 900, color: C.ink2 });
      const done = l > 8.5;
      Pv.silhouette(ctx, 1560, 430, 150, { color: done ? C.bad : "#B7C4CC", mark: done ? "!" : "?" });
      text(ctx, done ? "orang asing tahu di mana dan kapan" : "siapa? di mana? kapan?", 1560, 600, 24, { align: "center", weight: 900, color: done ? C.bad : C.ink2 });
      if (done) banner(ctx, "satu per satu aman, digabung berbahaya", 700, 900, { fill: C.badBg, stroke: C.bad, color: C.bad });
    },
    branch1(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "APA YANG BOLEH KUBAGIKAN? · KARTU PELAJAR BARU", 215);
      const stage = l < 4.5 ? 0 : 1;
      [["A", "unggah kartu apa adanya", cardImg(false), 1.0, "bad"], ["B", "foto diri berseragam saja", selfieImg, 0.08, "good"]].forEach(([k, t, img, v, tone], i) => {
        ctx.save(); const on = stage === i || (stage === 1 && i === 0); if (!on) ctx.globalAlpha = 0.25;
        const x = 180 + i * 820; text(ctx, "PILIHAN " + k + ": " + t, x + 330, 265, 26, { align: "center", weight: 900, color: tone === "bad" ? C.bad : C.good });
        Pv.post(ctx, x, 285, 420, { who: "Sinta", text: "Kartu pelajar baru!", img, likes: 18 }, { tone: on ? tone : null, imgH: 196 });
        Pv.gap(ctx, x + 450, 420, 200, on ? v : 0, { label: v > 0.5 ? "terbuka" : "tertutup" });
        ctx.restore();
      });
      if (l > 8) label(ctx, "cerita tetap tersampaikan, data tetap aman", 960, 790, { size: 26, color: C.good });
    },
    branch2(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "APA YANG BOLEH KUBAGIKAN? · LIBURAN", 215);
      const stage = l < 6 ? 0 : 1;
      [["A", "sekarang, dengan lokasi langsung", { who: "Dito", text: "Liburan seminggu! Rumah kosong, berangkat besok 😎", loc: "Lokasi langsung: Jl. Melati 5", img: beachImg }, 1.0, "bad"], ["B", "setelah pulang, tanpa lokasi", { who: "Dito", text: "Minggu lalu seru banget liburannya!", img: beachImg, when: "setelah pulang" }, 0.1, "good"]].forEach(([k, t, p, v, tone], i) => {
        ctx.save(); const on = stage === i || (stage === 1 && i === 0); if (!on) ctx.globalAlpha = 0.25;
        const x = 180 + i * 820; text(ctx, "PILIHAN " + k + ": " + t, x + 330, 265, 26, { align: "center", weight: 900, color: tone === "bad" ? C.bad : C.good });
        Pv.post(ctx, x, 285, 440, p, { tone: on ? tone : null, imgH: 150 });
        Pv.gap(ctx, x + 470, 420, 190, on ? v : 0, { label: v > 0.5 ? "terbuka" : "tertutup" });
        if (i === 0 && on) { text(ctx, "semua tahu", x + 565, 515, 20, { align: "center", weight: 900, color: C.bad }); text(ctx, "rumah kosong", x + 565, 541, 20, { align: "center", weight: 900, color: C.bad }); }
        ctx.restore();
      });
      if (l > 9) label(ctx, "pikirkan dulu, unggah nanti", 960, 740, { size: 26 });
    },

    identitas(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "IDENTITAS DIGITAL: GAMBARAN DIRIMU DI INTERNET");
      kid(ctx, 420, 540, 170, { hair: "long" }); text(ctx, "Sinta yang asli", 420, 740, 24, { align: "center", weight: 800, color: C.ink2 });
      arrowIcon(ctx, "east", 640, 500, 40, C.ink2);
      const parts = [["👤", "nama akun & foto profil"], ["📝", "bio"], ["🖼️", "unggahan"], ["💬", "komentar"], ["♡", "tanda suka"], ["🏷️", "unggahan orang lain tentangmu"]];
      const n = reveal(l, 1.5, 1.0, 6);
      parts.forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 720 + (i % 2) * 500, y = 290 + Math.floor(i / 2) * 130; card(ctx, x, y, 470, 110, { fill: i === 5 ? "#FFF3D6" : C.bg2, r: 16 }); text(ctx, ic, x + 50, y + 72, 40, { align: "center" }); para(ctx, t, x + 100, y + 48, 26, 350, { weight: 900 }); ctx.restore(); });
      if (n >= 6) label(ctx, "orang menilai dari gambaran ini, bukan dari dirimu langsung", 1205, 720, { size: 26, color: C.ink2 });
    },
    pengaturan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "EMPAT PENGATURAN YANG MERAPIKAN");
      const n = reveal(l, 1.5, 2.3, 4);
      Pv.profile(ctx, 440, 540, 360, 560, { name: "Rani Putri Lestari", handle: "@rani_9b", pub: true, loc: true, avatar: "Rani", bio: [["SMP Nusa Bangsa · IX B", true], ["HP 08xx-xxxx-123", true], ["suka menggambar 🎨", false]], tags: 3 }, { fix: n >= 4, flag: n < 4 });
      SETTINGS.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 290 + i * 112; card(ctx, 720, y, 1000, 96, { fill: i < n ? C.goodBg : C.bg2, stroke: i < n ? C.good : undefined, lw: 4, r: 16 }); text(ctx, ic, 770, y + 62, 40, { align: "center" }); text(ctx, (i + 1) + ". " + t, 830, y + 44, 28, { weight: 900 }); text(ctx, s, 830, y + 78, 22, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) label(ctx, "profil Rani sesudah dirapikan", 440, 860, { size: 22, color: C.good });
    },
    jeda(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "KESADARAN PENUH: SADAR SEBELUM JARI BERGERAK");
      const moods = [["😡", "marah"], ["🤩", "terlalu senang"], ["😰", "takut ketinggalan"]];
      const n = reveal(l, 4.0, 1.0, 3);
      moods.forEach(([e, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 260 + i * 300; card(ctx, x, 300, 260, 200, { fill: C.badBg, stroke: C.bad, lw: 3, r: 16 }); text(ctx, e, x + 130, 400, 64, { align: "center" }); text(ctx, t, x + 130, 460, 24, { align: "center", weight: 900, color: C.bad }); ctx.restore(); });
      if (n >= 3) text(ctx, "saat paling mudah salah unggah", 690, 560, 26, { align: "center", weight: 900, color: C.bad });
      const breathing = l > 8;
      Pv.breath(ctx, 1400, 450, 130, breathing ? (l - 8) / 3 : 0.25, breathing ? ["tarik", "hembus", "tarik", "hembus", "tarik", "hembus"][Math.floor(((l - 8) / 1.5)) % 6] : "jeda");
      text(ctx, breathing ? "tarik napas tiga kali" : "sebelum menekan unggah", 1400, 660, 26, { align: "center", weight: 900, color: C.kiko });
      D.finger(ctx, 1190, 690, { s: 36, angle: -0.6 }); card(ctx, 1080, 690, 150, 56, { fill: C.kiko, r: 14 }); text(ctx, "Unggah", 1155, 728, 24, { align: "center", weight: 900, color: "#fff" });
    },
    empat_tanya(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "EMPAT PERTANYAAN SEBELUM MENGUNGGAH");
      const n = reveal(l, 1.5, 2.6, 4);
      ASK.forEach((q, i) => Em.choice(ctx, 240 + (i % 2) * 740, 290 + Math.floor(i / 2) * 200, 700, 170, i + 1, q, { on: i === n - 1, dim: i >= n }));
      kiko(ctx, 1740, 820, 90, 0, { mood: "happy" });
      if (n >= 4) label(ctx, "empat ya, baru unggah; satu ragu, tunda dulu", 960, 720);
    },
    bocor(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "KALAU DATA TELANJUR TERSEBAR");
      const steps = [["🗑️", "Hapus unggahannya", "secepatnya, sebelum makin menyebar"], ["🔑", "Ganti kata sandi", "akun yang terkait dengan data itu"], ["📸", "Simpan bukti", "screenshot sebelum dihapus"], ["🧑‍🏫", "Beri tahu orang dewasa", "orang tua atau guru; jangan sendirian"]];
      const n = reveal(l, 1.2, 1.5, 4);
      steps.forEach(([ic, t, s], i) => Em.step(ctx, 220 + (i % 2) * 760, 290 + Math.floor(i / 2) * 180, 720, i + 1, t, s, i < n));
      if (n >= 4) label(ctx, "yang sudah tersebar sulit ditarik penuh: itulah gunanya jeda", 960, 700, { size: 26, color: C.bad });
    },
    data_teman(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DATA TEMANMU JUGA BUKAN MILIKMU");
      const msgs = [{ who: "Bayu", text: "Minta nomor HP Rani dong, mau tanya PR" }, { who: "Aku", text: "Tunggu, aku tanya Rani dulu boleh atau tidak.", tone: "good" }, { who: "Rani", text: "Boleh, kirim ke Bayu saja ya. Makasih sudah tanya dulu!", mood: "happy" }];
      Em.chat(ctx, 200, 280, 700, 440, "Bayu", msgs, { n: reveal(l, 1.0, 2.2, 3) });
      const dont = [["🖼️", "foto teman tanpa izin"], ["📱", "meneruskan nomor HP ke grup lain"], ["📍", "menandai lokasi rumah orang"]];
      const n = reveal(l, 4.0, 1.4, 3);
      dont.forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 300 + i * 130; card(ctx, 980, y, 720, 110, { fill: C.badBg, stroke: C.bad, lw: 3, r: 16 }); text(ctx, "✕", 1030, y + 72, 40, { align: "center", weight: 900, color: C.bad }); text(ctx, ic, 1090, y + 70, 36, { align: "center" }); para(ctx, t, 1130, y + 52, 26, 540, { weight: 900 }); ctx.restore(); });
      if (n >= 3) label(ctx, "menjaga data orang lain = menjaga dirimu", 1340, 720, { size: 26, color: C.good });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pilah dua belas kartu", "publik, privat, tergantung", (x, y) => { [["publik", "🐱 nama kucing"], ["privat", "📱 nomor HP"], ["tergantung", "🏫 sekolah"]].forEach(([k, t], i) => { const kk = Pv.kind[k]; card(ctx, x - 190, y - 90 + i * 70, 380, 58, { fill: kk[0], stroke: kk[1], lw: 3, r: 12 }); text(ctx, t, x - 170, y - 52 + i * 70, 22, { weight: 900 }); text(ctx, kk[2], x + 175, y - 54 + i * 70, 15, { align: "right", weight: 900, color: kk[1] }); }); }],
        ["Skenario bercabang", "apa yang boleh kubagikan?", (x, y) => { card(ctx, x - 190, y - 115, 380, 60, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "A: unggah sekarang + lokasi", x, y - 77, 22, { align: "center", weight: 900, color: C.bad }); card(ctx, x - 190, y - 40, 380, 60, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "B: nanti, tanpa lokasi", x, y - 2, 22, { align: "center", weight: 900, color: C.good }); Pv.gap(ctx, x - 150, y + 55, 300, 0.15, { title: "" }); }],
        ["Rapikan profil", "temukan yang bocor, perbaiki", (x, y) => { ctx.save(); ctx.translate(x, y - 8); ctx.scale(0.47, 0.47); Pv.profile(ctx, 0, 0, 340, 520, { name: "Rani Putri", handle: "@rani_9b", pub: true, loc: true, bio: [["SMP Nusa · IX B", true], ["HP 08xx-123", true]], tags: 3 }, { flag: true }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu periksa akunmu bersama orang tua", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
