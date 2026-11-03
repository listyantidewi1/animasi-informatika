/* Adegan episode D7.3: Kata Sandi Aman dan Rekam Jejak Digital. Muat setelah kiko-core.js, kiko-devices.js, sandi.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, S = K.sandi, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 800, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, 34, { align: "center", weight: 900, color: opt.color || C.ink }); };

  Object.assign(SCENES, {
    title_story(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 420, 560, 200, {}); text(ctx, "Dito", 420, 830, 30, { align: "center", color: C.ink2, weight: 700 });
      const sc = D.phone(ctx, 900, 520, 330, 600);
      text(ctx, "Game Kiko Dash", sc.x + sc.w / 2, sc.y + 90, 26, { align: "center", weight: 900 });
      S.pwBox(ctx, sc.x + 30, sc.y + 160, sc.w - 60, "dito2013", { mask: true, h: 70, size: 30, stroke: C.bad });
      card(ctx, sc.x + 30, sc.y + 260, sc.w - 60, 90, { fill: C.badBg, stroke: C.bad, lw: 3 }); text(ctx, "Kata sandi salah", sc.x + sc.w / 2, sc.y + 300, 24, { align: "center", weight: 900, color: C.bad }); text(ctx, "sandi sudah diganti", sc.x + sc.w / 2, sc.y + 330, 20, { align: "center", weight: 700, color: C.bad });
      S.lock(ctx, sc.x + sc.w / 2, sc.y + 460, 70, { open: true });
      if (l > 2) bubble(ctx, 1280, 400, 440, "Ada yang masuk duluan!", 32, { tailX: 1300, tailDir: -40, fill: C.badBg, stroke: C.bad, color: C.bad });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU: Episode D7.0 Cara Memakai Komputer dan HP", 960, 300, 32, { align: "center", color: C.accentDark, weight: 800 });
      card(ctx, 380, 380, 1160, 300, { fill: C.badBg, stroke: C.bad, lw: 5 });
      text(ctx, "Semua kata sandi di sini hanya CONTOH.", 960, 470, 40, { align: "center", weight: 900 });
      text(ctx, "Jangan pernah menulis kata sandimu yang asli di mana pun,", 960, 550, 32, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "termasuk di latihan.", 960, 600, 32, { align: "center", weight: 700, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      kid(ctx, 380, 560, 200, { hair: "long" }); kid(ctx, 700, 560, 200, { point: true });
      const ph = l < 3.5;
      bubble(ctx, 540, 392, 300, ph ? "angkaku: 7" : "angkaku: 4 8 2", 34, { tailX: 600, tailDir: -40 });
      card(ctx, 1000, 300, 700, 440, { fill: C.bg2 });
      text(ctx, ph ? "1 digit" : "3 digit", 1350, 370, 36, { align: "center", weight: 900 });
      text(ctx, "paling banyak", 1350, 440, 28, { align: "center", color: C.ink2, weight: 700 });
      text(ctx, ph ? "10 tebakan" : "1.000 tebakan", 1350, 540, 72, { align: "center", weight: 900, color: ph ? C.good : C.accentDark });
      text(ctx, ph ? "pasti kena" : "lama sekali kalau manusia", 1350, 640, 30, { align: "center", color: C.ink2, weight: 700 });
    },
    unplugged_long(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAKIN PANJANG, MAKIN LAMA DITEBAK", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const rows = [["1 digit", 10, 0.05], ["3 digit", 1000, 0.18], ["6 digit", "1 juta", 0.4], ["8 huruf+angka", "triliunan", 0.9]];
      const n = reveal(l, 0.6, 0.9, 4);
      rows.forEach(([lab, cnt, k], i) => { if (i >= n) return; const y = 300 + i * 110; text(ctx, lab, 420, y + 48, 32, { align: "right", weight: 900 }); ctx.fillStyle = i === 3 ? C.good : C.kiko; rr(ctx, 460, y + 10, 1100 * k, 60, 12); ctx.fill(); text(ctx, String(cnt) + " tebakan", 480 + 1100 * k, y + 50, 30, { weight: 900, color: C.ink }); });
      if (n >= 4) { banner(ctx, "komputer menebak jutaan kali tiap detik → sandi harus jauh lebih panjang", 760, 1400); }
    },

    pw_house(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      S.house(ctx, 560, 520, 420, 420, { label: "AKUN" });
      ["foto", "pesan", "teman", "uang game"].forEach((s, i) => { card(ctx, 400 + (i % 2) * 170, 300 + Math.floor(i / 2) * 60, 150, 46, { fill: "#FFF3B0", r: 8 }); text(ctx, s, 475 + (i % 2) * 170, 331 + Math.floor(i / 2) * 60, 22, { align: "center", weight: 800 }); });
      const u = ease(clamp((l - 1.5) / 1.2, 0, 1)); S.key(ctx, lerp(1300, 620, u), lerp(520, 640, u), 90, { label: "kata sandi" });
      kid(ctx, 1450, 560, 200, { point: true });
      text(ctx, "kata sandi = kunci rumah digitalmu", 960, 830, 34, { align: "center", color: C.accentDark, weight: 800 });
    },
    pw_weak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      S.house(ctx, 560, 520, 420, 420, { label: "AKUN", open: l > 3 });
      S.key(ctx, 760, 420, 80, { label: "dito2013", rot: -0.4 }); ctx.strokeStyle = "#6B7B88"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(760, 300); ctx.lineTo(760, 380); ctx.stroke();
      card(ctx, 1000, 300, 700, 300, { fill: C.badBg, stroke: C.bad, lw: 4 });
      text(ctx, "dito2013", 1350, 380, 56, { align: "center", weight: 900, color: C.bad });
      text(ctx, "nama + tahun lahir", 1350, 450, 30, { align: "center", color: C.ink2, weight: 700 });
      text(ctx, "teman sekelas pun bisa menebak", 1350, 540, 30, { align: "center", weight: 900, color: C.bad });
      if (l > 3) { kid(ctx, 1560, 760, 140, { point: true }); text(ctx, "Ketebak!", 1350, 700, 40, { align: "center", weight: 900, color: C.bad }); }
      text(ctx, "kunci yang digantung di depan pintu", 560, 840, 32, { align: "center", color: C.bad, weight: 800 });
    },
    pw_common(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "KATA SANDI PALING SERING DIPAKAI", 560, 240, 32, { align: "center", color: C.accentDark, weight: 800 });
      const list = ["123456", "password", "qwerty", "111111", "abc123"]; const n = reveal(l, 0.5, 0.5, 5);
      list.forEach((s, i) => { if (i >= n) return; card(ctx, 260, 280 + i * 92, 600, 76, { fill: i < 3 ? C.badBg : C.bg2, stroke: i < 3 ? C.bad : "#D7E2DC", lw: 3 }); text(ctx, (i + 1) + ".", 300, 330 + i * 92, 32, { weight: 900, color: C.ink2 }); text(ctx, s, 360, 330 + i * 92, 36, { weight: 900 }); });
      card(ctx, 1000, 280, 700, 200, { fill: C.bg2 }); text(ctx, "dipakai jutaan orang", 1350, 350, 32, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "→ dicoba mesin pertama kali", 1350, 420, 32, { align: "center", weight: 900 });
      if (l > 3.5) { S.counter(ctx, 1100, 560, 500, "tebakan ke-1", { label: "mesin mencoba:" }); text(ctx, "langsung masuk ✕", 1350, 740, 40, { align: "center", weight: 900, color: C.bad }); }
    },
    pw_bruteforce(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = Math.floor(Math.max(0, l - 0.3) * 1234567) % 100000000; S.counter(ctx, 200, 300, 560, String(n).padStart(8, "0"), { label: "mencoba semua kombinasi…" });
      text(ctx, "jutaan tebakan tiap detik", 480, 460, 28, { align: "center", color: C.ink2, weight: 700 });
      const rows = [["4 angka", "sekejap", C.bad], ["8 huruf", "beberapa jam", "#B57A12"], ["12 huruf campur", "ratusan tahun", C.good]]; const m = reveal(l, 1.5, 1.2, 3);
      rows.forEach(([a, c, col], i) => { if (i >= m) return; const y = 300 + i * 150; card(ctx, 880, y, 820, 120, { fill: C.panel, stroke: col, lw: 5 }); text(ctx, a, 920, y + 72, 36, { weight: 900 }); text(ctx, c, 1660, y + 72, 36, { align: "right", weight: 900, color: col }); });
      if (m >= 3) text(ctx, "panjang menang", 1290, 800, 40, { align: "center", weight: 900, color: C.good });
    },
    pw_long(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      banner(ctx, "yang penting bukan rumit, melainkan PANJANG", 180, 1000);
      card(ctx, 200, 290, 720, 470, { fill: C.bg2 }); card(ctx, 1000, 290, 720, 470, { fill: C.bg2 });
      text(ctx, "pendek tapi rumit", 560, 350, 34, { align: "center", weight: 900, color: C.ink2 }); S.pwBox(ctx, 260, 390, 600, "S!n7a", { count: true }); S.meter(ctx, 260, 520, 600, 0); text(ctx, "susah diingat, cepat ketebak", 560, 700, 30, { align: "center", color: C.bad, weight: 800 });
      text(ctx, "panjang dan mudah diingat", 1360, 350, 34, { align: "center", weight: 900, color: C.ink2 }); S.pwBox(ctx, 1060, 390, 600, "sepedakantinbiru", { count: true, size: 40 }); S.meter(ctx, 1060, 520, 600, 2); text(ctx, "mudah diingat, lama ditebak", 1360, 700, 30, { align: "center", color: C.good, weight: 800 });
    },
    pw_passphrase(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "FRASA SANDI (passphrase): empat kata acak", 960, 240, 34, { align: "center", color: C.accentDark, weight: 800 });
      const words = ["kucing", "angkot", "hujan", "bakso"]; const n = reveal(l, 0.8, 0.8, 4);
      words.forEach((w, i) => { if (i >= n) return; card(ctx, 260 + i * 360, 300, 320, 130, { fill: ["#FFF3B0", "#DCEBFF", "#D6F5E3", "#FFD6E0"][i], r: 18 }); text(ctx, w, 420 + i * 360, 380, 44, { align: "center", weight: 900 }); if (i) text(ctx, "-", 240 + i * 360, 380, 44, { align: "center", weight: 900, color: C.ink2 }); });
      if (n >= 4) { S.pwBox(ctx, 360, 500, 1200, "kucing-angkot-hujan-bakso", { count: true, size: 44 }); S.meter(ctx, 360, 630, 1200, 3); text(ctx, "mudah dibayangkan, sangat sulit ditebak", 960, 800, 32, { align: "center", color: C.good, weight: 900 }); }
    },

    rule_unique(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "ATURAN 1: satu akun, satu sandi", 960, 240, 34, { align: "center", color: C.accentDark, weight: 800 });
      const same = l < 3.2; const names = ["game", "email", "sekolah"];
      names.forEach((nm, i) => { const x = 420 + i * 540; S.house(ctx, x, 520, 260, 260, { label: nm, open: same && l > 1.5 }); S.key(ctx, x, 720, 50, { label: same ? "sandi A" : "sandi " + "ABC"[i], color: same ? C.bad : "#B57A12" }); });
      banner(ctx, same ? "satu kunci bocor → semua rumah terbuka" : "kunci berbeda → yang lain tetap aman", 820, 1000, same ? { fill: C.badBg, stroke: C.bad, color: C.bad } : { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    rule_secret(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "ATURAN 2: rahasia, bahkan dari teman dekat", 960, 240, 34, { align: "center", color: C.accentDark, weight: 800 });
      const sc = D.phone(ctx, 520, 560, 340, 580);
      S.chat(ctx, sc, [{ who: "Admin Game (?)", color: C.bad, text: "Halo, saya admin. Kirim kata sandimu untuk verifikasi hadiah." }, ...(l > 2 ? [{ me: true, text: "Tidak. Admin asli tidak pernah minta kata sandi." }] : [])], { title: "Pesan" });
      card(ctx, 1000, 320, 700, 400, { fill: C.badBg, stroke: C.bad, lw: 4 });
      text(ctx, "\"saya admin, kirim kata sandimu\"", 1350, 400, 30, { align: "center", weight: 800 });
      text(ctx, "= PENIPUAN", 1350, 480, 56, { align: "center", weight: 900, color: C.bad });
      text(ctx, "admin sungguhan tidak pernah", 1350, 580, 28, { align: "center", color: C.ink2, weight: 700 }); text(ctx, "meminta kata sandi", 1350, 620, 28, { align: "center", color: C.ink2, weight: 700 });
    },
    rule_2fa(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "ATURAN 3: verifikasi dua langkah", 960, 240, 34, { align: "center", color: C.accentDark, weight: 800 });
      card(ctx, 200, 300, 560, 420, { fill: C.bg2 }); text(ctx, "langkah 1", 480, 360, 28, { align: "center", color: C.ink2, weight: 800 }); S.pwBox(ctx, 240, 400, 480, "kucing-angkot…", { mask: false, h: 80, size: 30 }); text(ctx, "kata sandi", 480, 560, 32, { align: "center", weight: 900 });
      H.arrowIcon(ctx, "east", 840, 500, 70, C.accentDark);
      card(ctx, 920, 300, 560, 420, { fill: l > 1.5 ? "#FFF3D6" : C.bg2, stroke: l > 1.5 ? C.accent : "#D7E2DC", lw: 4 }); text(ctx, "langkah 2", 1200, 360, 28, { align: "center", color: C.ink2, weight: 800 });
      const sc = D.phone(ctx, 1200, 540, 150, 240); if (l > 1.5) { text(ctx, "kode:", sc.x + sc.w / 2, sc.y + 90, 20, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "482 913", sc.x + sc.w / 2, sc.y + 140, 30, { align: "center", weight: 900 }); }
      text(ctx, "kode dikirim ke HP-mu", 1200, 700, 28, { align: "center", weight: 900 });
      if (l > 3.5) { S.lock(ctx, 1630, 470, 80, {}); para(ctx, "pembobol punya sandi pun tetap tertahan", 1630, 600, 24, 240, { align: "center", color: C.good, weight: 900, lh: 1.3 }); }
    },
    rule_recap(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 400, 540, 200, { point: true }); text(ctx, "Dito", 400, 810, 30, { align: "center", color: C.ink2, weight: 700 });
      const items = ["frasa sandi baru yang panjang", "beda dari akun lain", "tidak diberitahukan ke siapa pun", "verifikasi dua langkah menyala"]; const n = reveal(l, 0.6, 1.0, 4);
      items.forEach((s, i) => { if (i >= n) return; card(ctx, 700, 280 + i * 120, 980, 96, { fill: C.goodBg, stroke: C.good, lw: 3 }); text(ctx, "✓", 760, 342 + i * 120, 44, { align: "center", weight: 900, color: C.good }); text(ctx, s, 820, 340 + i * 120, 34, { weight: 800 }); });
      if (n >= 4) S.lock(ctx, 1560, 800, 60, {});
    },

    trace_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      ctx.fillStyle = "#F1E3C8"; rr(ctx, 160, 520, 1600, 340, 20); ctx.fill();
      const n = reveal(l, 0.8, 0.5, 8); const pts = Array.from({ length: n }, (_, i) => [300 + i * 170, 700 - (i % 2) * 20]); S.footprints(ctx, pts);
      D.phone(ctx, 1640, 380, 140, 240); kid(ctx, 1440, 420, 160, { point: true });
      text(ctx, "REKAM JEJAK DIGITAL (digital footprint)", 200, 300, 34, { color: C.accentDark, weight: 800 });
      text(ctx, "setiap kali memakai HP, kamu meninggalkan jejak", 200, 380, 32, { weight: 800 });
    },
    trace_kinds(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 1.6, 2);
      if (n >= 1) { card(ctx, 180, 230, 760, 600, { fill: C.bg2 }); text(ctx, "JEJAK YANG KAMU BUAT", 560, 300, 30, { align: "center", color: C.accentDark, weight: 800 }); ["unggahan", "foto", "komentar", "like"].forEach((s, i) => { card(ctx, 240 + (i % 2) * 320, 350 + Math.floor(i / 2) * 110, 300, 90, { fill: C.panel }); text(ctx, s, 390 + (i % 2) * 320, 408 + Math.floor(i / 2) * 110, 32, { align: "center", weight: 900 }); }); text(ctx, "kamu sadar membuatnya", 560, 640, 28, { align: "center", color: C.ink2, weight: 700 }); }
      if (n >= 2) { card(ctx, 980, 230, 760, 600, { fill: C.bg2 }); text(ctx, "JEJAK YANG TERCATAT DIAM-DIAM", 1360, 300, 30, { align: "center", color: C.bad, weight: 800 }); ["pencarian", "lokasi", "aplikasi yang dibuka", "jam online"].forEach((s, i) => { card(ctx, 1040 + (i % 2) * 320, 350 + Math.floor(i / 2) * 110, 300, 90, { fill: C.panel }); text(ctx, s, 1190 + (i % 2) * 320, 408 + Math.floor(i / 2) * 110, 28, { align: "center", weight: 900 }); }); text(ctx, "sering tanpa kamu sadari", 1360, 640, 28, { align: "center", color: C.ink2, weight: 700 }); }
    },
    trace_story(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const sc = D.phone(ctx, 520, 530, 360, 640);
      const ph = l < 2.2 ? 0 : l < 4 ? 1 : 2;
      const msgs = [{ who: "Rama", text: "Besok bawa alat tulis ya" }, ph === 0 ? { me: true, img: true } : { me: true, text: "Pesan ini telah dihapus", deleted: true }];
      S.chat(ctx, sc, msgs);
      kid(ctx, 1200, 560, 200, { hair: "long" }); text(ctx, "Sinta", 1200, 830, 30, { align: "center", color: C.ink2, weight: 700 });
      if (ph === 1) bubble(ctx, 1050, 350, 380, "Aduh, hapus saja…", 30, { tailX: 1200, tailDir: 0 });
      if (ph === 2) { for (let i = 0; i < 3; i++) { S.photo(ctx, 1480 + (i % 2) * 120, 360 + Math.floor(i / 2) * 130, 100); } para(ctx, "3 teman sudah menyimpan screenshot-nya", 1560, 630, 26, 300, { align: "center", weight: 900, color: C.bad, lh: 1.3 }); }
    },
    trace_copies(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.5, 0.9, 4);
      D.phone(ctx, 360, 520, 170, 300); text(ctx, "HP-mu", 360, 740, 28, { align: "center", weight: 900 }); S.photo(ctx, 360, 500, 90, { x: l > 4 });
      if (n >= 2) { H.arrowIcon(ctx, "east", 600, 500, 70, C.ink2); S.server(ctx, 820, 500, 150, { label: "server aplikasi" }); S.photo(ctx, 900, 400, 70); }
      if (n >= 3) { H.arrowIcon(ctx, "east", 1060, 500, 70, C.ink2); for (let i = 0; i < 3; i++) { D.phone(ctx, 1300 + i * 170, 520, 110, 200); S.photo(ctx, 1300 + i * 170, 500, 60); } text(ctx, "HP teman-teman", 1470, 700, 28, { align: "center", weight: 900 }); }
      if (l > 4) banner(ctx, "tombol hapus hanya menghapus salinanmu", 800, 1000, { fill: C.badBg, stroke: C.bad, color: C.bad });
    },
    trace_future(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      ctx.strokeStyle = "#9AAFA6"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(260, 500); ctx.lineTo(1660, 500); ctx.stroke();
      const pts = [["kelas 7", "unggah foto", 360], ["kelas 10", "daftar SMA", 820], ["kuliah / kerja", "daftar & wawancara", 1400]]; const n = reveal(l, 0.6, 1.2, 3);
      pts.forEach(([a, c, x], i) => { if (i >= n) return; ctx.fillStyle = i ? C.accent : C.kiko; ctx.beginPath(); ctx.arc(x, 500, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, a, x, 440, 30, { align: "center", weight: 900 }); text(ctx, c, x, 570, 28, { align: "center", color: C.ink2, weight: 700 }); if (i) S.photo(ctx, x, 660, 80); });
      if (n >= 3) banner(ctx, "foto yang sama masih bisa muncul bertahun-tahun kemudian", 790, 1200);
    },
    trace_think(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "TIGA PERTANYAAN SEBELUM MENGUNGGAH", 960, 240, 34, { align: "center", color: C.accentDark, weight: 800 });
      const qs = ["Bolehkah ini dilihat orang tua dan guruku?", "Apakah ini menyakiti orang lain?", "Masih mau ini terlihat lima tahun lagi?"]; const n = reveal(l, 0.8, 1.3, 3);
      qs.forEach((q, i) => { if (i >= n) return; const x = 240 + i * 500; card(ctx, x, 300, 460, 400, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); ctx.fillStyle = C.accentDark; ctx.beginPath(); ctx.arc(x + 230, 380, 40, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 230, 395, 40, { align: "center", color: "#fff", weight: 900 }); para(ctx, q, x + 230, 480, 32, 400, { align: "center", weight: 800, lh: 1.3 }); });
      if (n >= 3) text(ctx, "kalau ada satu jawaban \"tidak\": jangan unggah", 960, 800, 32, { align: "center", color: C.bad, weight: 900 });
    },
    trace_consent(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 500, 560, 200, { hair: "long", point: true }); kid(ctx, 960, 560, 200, {});
      D.phone(ctx, 300, 400, 120, 200); S.photo(ctx, 300, 380, 70);
      bubble(ctx, 560, 360, 420, "Boleh kuunggah fotomu?", 30, { tailX: 600, tailDir: -60 });
      if (l > 2.2) bubble(ctx, 1010, 360, 260, l > 3.8 ? "Jangan, ya." : "Hmm…", 30, { tailX: 1050, tailDir: -60, fill: C.badBg, stroke: C.bad, color: C.bad });
      card(ctx, 1310, 300, 430, 400, { fill: C.bg2 }); text(ctx, "foto temanmu", 1525, 400, 32, { align: "center", weight: 900 }); text(ctx, "= jejak digital temanmu", 1525, 460, 28, { align: "center", color: C.ink2, weight: 800 }); text(ctx, "minta izin dulu,", 1525, 560, 32, { align: "center", weight: 900, color: C.good }); text(ctx, "hormati jawabannya", 1525, 610, 32, { align: "center", weight: 900, color: C.good });
    },
    trace_good(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      ctx.fillStyle = "#F1E3C8"; rr(ctx, 160, 560, 1600, 300, 20); ctx.fill();
      S.footprints(ctx, Array.from({ length: 7 }, (_, i) => [320 + i * 190, 720 - (i % 2) * 20]), { color: "rgba(46,158,91,0.6)" });
      const items = ["karya", "prestasi", "hal yang kamu banggakan"]; const n = reveal(l, 0.8, 1.1, 3);
      items.forEach((s, i) => { if (i >= n) return; card(ctx, 300 + i * 460, 280, 420, 200, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, ["🏆", "🎨", "⭐"][i], 510 + i * 460, 370, 60, { align: "center" }); text(ctx, s, 510 + i * 460, 440, 30, { align: "center", weight: 900 }); });
      if (n >= 3) text(ctx, "jejak yang justru ingin kamu tinggalkan", 960, 530, 32, { align: "center", color: C.good, weight: 900 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pengukur kata sandi", "contoh fiktif saja, bukan sandimu", (x, y) => { S.pwBox(ctx, x - 170, y - 50, 340, "contoh-sandi", { h: 60, size: 26 }); S.meter(ctx, x - 170, y + 30, 340, 2); }], ["Pilah jejak digital", "kamu buat sendiri, atau tercatat diam-diam?", (x, y) => S.footprints(ctx, [[x - 90, y], [x - 30, y - 10], [x + 30, y], [x + 90, y - 10]])], ["Di rumah bersama orang tua", "ganti sandi pendek, nyalakan dua langkah", (x, y) => { S.lock(ctx, x - 40, y, 60, {}); D.phone(ctx, x + 60, y, 70, 120); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 610, 30, { align: "center", weight: 900 }); para(ctx, t2, x, 655, 22, 440, { align: "center", weight: 700, color: C.ink2, lh: 1.25 }); });
      text(ctx, "di halaman latihan episode ini", 960, 745, 30, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
