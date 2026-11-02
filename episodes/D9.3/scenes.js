/* Adegan episode D9.3: Melindungi Perangkat dari Malware. Muat setelah kiko-core.js, kiko-devices.js, malware.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Mw = K.malware, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const KINDS = [["virus", "Virus", "menumpang berkas"], ["worm", "Worm", "menjalar lewat jaringan"], ["trojan", "Trojan", "menyamar jadi aplikasi"], ["ransomware", "Ransomware", "mengunci berkas"], ["spyware", "Spyware", "mengintip diam-diam"]];
  const DOORS = ["berkas", "jaringan", "unduhan", "tautan", "izin aplikasi"];
  const HABITS = [["Perbarui", "sistem dan aplikasi selalu versi terbaru"], ["Sumber resmi", "unduh hanya dari toko aplikasi resmi"], ["Jangan klik sembarangan", "tautan dan lampiran tak dikenal: lewati"], ["Antivirus", "nyalakan antivirus bawaan"], ["Cadangan", "salin berkas penting ke tempat lain"]];
  const kindCard = (ctx, x, y, w, h, i, opt = {}) => { const [k, t, s] = KINDS[i]; ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 5, r: 16 }); Mw.bug(ctx, x + w / 2, y + h * 0.38, Math.min(90, h * 0.4), k, { t: opt.t }); text(ctx, t, x + w / 2, y + h * 0.72, 26, { align: "center", weight: 900, color: Mw.color(k) }); text(ctx, s, x + w / 2, y + h * 0.88, 18, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); };

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const n = reveal(l, 0.6, 0.9, 5);
      KINDS.forEach((k, i) => kindCard(ctx, 620 + i * 230, 260, 210, 240, i, { dim: i >= n, t: l }));
      if (l > 5.5) { text(ctx, "malware = malicious software: perangkat lunak jahat", 1195, 580, 28, { align: "center", weight: 900, color: C.accentDark }); banner(ctx, "kenali pintunya, tutup pintunya", 640, 700); }
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D9.2", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Jaringan Lokal dan Internet", 960, 500, 48, { align: "center", weight: 700, color: C.ink2 });
      ["LAN dan Wi-Fi", "Router dan ISP", "Paket data"].forEach((s, i) => { card(ctx, 480 + i * 340, 580, 300, 120, { fill: C.bg2 }); text(ctx, s, 630 + i * 340, 652, 30, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_doors(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER: RUMAH DENGAN LIMA PINTU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      ctx.fillStyle = "#FFF9E0"; ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(240, 700); ctx.lineTo(240, 360); ctx.lineTo(960, 260); ctx.lineTo(1680, 360); ctx.lineTo(1680, 700); ctx.closePath(); ctx.fill(); ctx.stroke();
      const n = reveal(l, 1.0, 0.9, 5);
      DOORS.forEach((d, i) => { if (i < n) Mw.door(ctx, 400 + i * 280, 690, 110, 220, "pintu " + d, { hl: i === n - 1 }); });
      if (n >= 5) { for (let i = 0; i < 5; i++) Mw.bug(ctx, 400 + i * 280, 430, 54, KINDS[i][0], { t: l }); label(ctx, "tiap tamu jahat punya pintu kesukaannya", 960, 820, { size: 26, color: C.ink2 }); }
    },
    unplugged_guard(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      ctx.fillStyle = "#FFF9E0"; ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(240, 700); ctx.lineTo(240, 360); ctx.lineTo(960, 260); ctx.lineTo(1680, 360); ctx.lineTo(1680, 700); ctx.closePath(); ctx.fill(); ctx.stroke();
      const n = reveal(l, 0.8, 1.0, 5);
      DOORS.forEach((d, i) => Mw.door(ctx, 400 + i * 280, 690, 110, 220, "pintu " + d, { guard: i < n, sub: i < n ? HABITS[[3, 0, 1, 2, 4][i]][0] : "" }));
      if (n >= 5) banner(ctx, "pintu yang dijaga sulit dimasuki", 745, 800, { fill: C.goodBg, stroke: C.good, color: C.good });
    },

    malware_def(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MALWARE = MALICIOUS + SOFTWARE", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "perangkat lunak jahat: merusak, mencuri, mengunci", 960, 280, 26, { align: "center", weight: 800, color: C.ink2 });
      D.phone(ctx, 420, 560, 300, 440);
      const n = reveal(l, 1.5, 1.1, 4);
      const sym = [["🐢", "perangkat lambat"], ["📢", "iklan muncul sendiri"], ["🔋", "baterai cepat habis"], ["📄", "berkas hilang / berubah"]];
      sym.forEach(([e, t], i) => { if (i < n) { card(ctx, 700 + (i % 2) * 520, 330 + Math.floor(i / 2) * 170, 480, 140, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, e, 760 + (i % 2) * 520, 415 + Math.floor(i / 2) * 170, 50, { align: "center" }); text(ctx, t, 820 + (i % 2) * 520, 410 + Math.floor(i / 2) * 170, 26, { weight: 900 }); } });
      if (n >= 4) label(ctx, "gejala ada tamu tak diundang", 1220, 720, { size: 26, color: C.bad });
    },
    virus_worm(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      card(ctx, 200, 230, 740, 480, { fill: C.bg2 }); text(ctx, "VIRUS: menumpang berkas", 570, 290, 30, { align: "center", weight: 900, color: Mw.color("virus") });
      const p = clamp((l - 1) / 3, 0, 1); Mw.file(ctx, 380, 450, 150, { infected: true, name: "tugas.docx" }); if (p > 0.4) Mw.file(ctx, 620, 450, 150, { infected: p > 0.9, name: "foto.jpg" }); if (p > 0.4 && p < 0.9) Mw.bug(ctx, lerp(410, 650, (p - 0.4) / 0.5), 490, 60, "virus");
      text(ctx, "aktif saat berkas dibuka, lalu menular", 570, 640, 24, { align: "center", weight: 800, color: C.ink2 });
      if (l > 4) { card(ctx, 980, 230, 740, 480, { fill: C.bg2 }); text(ctx, "WORM: menjalar sendiri lewat jaringan", 1350, 290, 30, { align: "center", weight: 900, color: Mw.color("worm") }); const pts = [[1100, 450], [1350, 380], [1600, 450], [1350, 560]]; pts.forEach(pt => { ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 4; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(1350, 470); ctx.lineTo(pt[0], pt[1]); ctx.stroke(); ctx.setLineDash([]); D.monitor(ctx, pt[0] - 40, pt[1] - 30, 80, 60); }); const k = Math.floor((l - 4) / 0.8); pts.slice(0, Math.min(4, k)).forEach(pt => Mw.bug(ctx, pt[0], pt[1] - 10, 44, "worm", { t: l })); text(ctx, "tanpa dibuka, tanpa menumpang: lewat Wi-Fi atau kabel", 1350, 640, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (l > 8) label(ctx, "dua tamu pertama: menumpang vs menjalar", 960, 700);
    },

    trojan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "TROJAN: MENYAMAR JADI YANG KAMU INGINKAN", 960, 230, 34, { align: "center", color: Mw.color("trojan"), weight: 800 });
      const ph = D.phone(ctx, 420, 540, 320, 520); card(ctx, ph.x + 20, ph.y + 60, ph.w - 40, 140, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 14 }); text(ctx, "Kuota GRATIS 50GB!", ph.x + ph.w / 2, ph.y + 110, 22, { align: "center", weight: 900, color: C.accentDark }); card(ctx, ph.x + 60, ph.y + 140, ph.w - 120, 44, { fill: C.good, r: 10 }); text(ctx, "PASANG", ph.x + ph.w / 2, ph.y + 170, 20, { align: "center", weight: 900, color: "#fff" });
      if (l > 1.5) D.finger(ctx, ph.x + ph.w / 2 + 10, ph.y + 190, {});
      const rev = l > 3.5; Mw.bug(ctx, 960, 480, 220, "trojan", { reveal: rev });
      if (rev) { text(ctx, "di dalamnya: program jahat", 960, 640, 26, { align: "center", weight: 900, color: C.bad }); }
      if (l > 5.5) { card(ctx, 1240, 330, 460, 260, { fill: C.badBg, stroke: C.bad, lw: 4 }); ["kamu sendiri yang memasangnya", "sering dari luar toko resmi", "contoh: game bajakan, penambah kuota"].forEach((s, i) => text(ctx, "• " + s, 1270, 390 + i * 60, 22, { weight: 800 })); }
      if (l > 8) banner(ctx, "hadiah yang terlalu bagus biasanya jebakan", 745, 900);
    },
    ransom_spy(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      card(ctx, 200, 230, 740, 480, { fill: C.bg2 }); text(ctx, "RANSOMWARE: mengunci berkas", 570, 290, 30, { align: "center", weight: 900, color: C.ink });
      const lock = l > 1.5; ["tugas", "foto", "video"].forEach((nm, i) => Mw.file(ctx, 380 + i * 190, 430, 140, { locked: lock, name: lock ? nm + ".xq7" : nm }));
      if (l > 3) { card(ctx, 300, 560, 540, 90, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "\"Bayar untuk membuka berkasmu\"", 570, 615, 24, { align: "center", weight: 900, color: C.bad }); }
      if (l > 4.5) { card(ctx, 980, 230, 740, 480, { fill: C.bg2 }); text(ctx, "SPYWARE: mengintip diam-diam", 1350, 290, 30, { align: "center", weight: 900, color: Mw.color("spyware") }); D.keyboard(ctx, 1060, 380, 420, { small: true }); Mw.bug(ctx, 1600, 420, 80, "spyware", { look: Math.sin(l * 3) }); const typed = "kata sandi: ra***"; text(ctx, typed, 1270, 540, 26, { align: "center", weight: 800 }); arrowIcon(ctx, "right", 1480, 530, 36, C.bad); text(ctx, "dikirim ke pembuatnya", 1350, 640, 22, { align: "center", weight: 800, color: C.bad }); }
      if (l > 8) banner(ctx, "lima tamu: menumpang, menjalar, menyamar, mengunci, mengintip", 745, 1200, { size: 30 });
    },

    doors_map(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "LIMA TAMU, LIMA PINTU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.3, 5);
      KINDS.forEach(([k, t], i) => { const x = 400 + i * 280; ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.2; Mw.bug(ctx, x, 320, 60, k, { t: l }); text(ctx, t, x, 390, 22, { align: "center", weight: 900, color: Mw.color(k) }); arrowIcon(ctx, "down", x, 430, 30, C.ink2); Mw.door(ctx, x, 680, 100, 190, "pintu " + DOORS[i], { hl: i === n - 1 }); ctx.restore(); });
      if (n >= 5) label(ctx, "kenali pintunya dulu, baru kita jaga", 960, 820, { size: 26, color: C.ink2 });
    },
    habit_update(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.8, 3.0, 2);
      Mw.habit(ctx, 200, 240, 740, 1, HABITS[0][0], HABITS[0][1], { on: n === 1, dim: n < 1 });
      Mw.habit(ctx, 980, 240, 740, 2, HABITS[1][0], HABITS[1][1], { on: n === 2, dim: n < 2 });
      if (n >= 1) { D.phone(ctx, 420, 600, 220, 300); card(ctx, 330, 520, 180, 60, { fill: C.goodBg, stroke: C.good, lw: 3, r: 10 }); text(ctx, "Perbarui sekarang", 420, 558, 18, { align: "center", weight: 900, color: C.good }); text(ctx, "menambal lubang yang dipakai worm", 760, 600, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 2) { card(ctx, 1060, 420, 260, 200, { fill: C.goodBg, stroke: C.good, lw: 4, r: 14 }); text(ctx, "toko resmi", 1190, 470, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "★★★★☆ 12 rb ulasan", 1190, 520, 20, { align: "center", weight: 800 }); card(ctx, 1380, 420, 300, 200, { fill: C.badBg, stroke: C.bad, lw: 4, r: 14 }); text(ctx, "unduh dari tautan grup", 1530, 470, 22, { align: "center", weight: 900, color: C.bad }); text(ctx, "tanpa ulasan, tanpa nama pembuat", 1530, 520, 18, { align: "center", weight: 800 }); text(ctx, "trojan paling sering dari sini", 1370, 680, 22, { align: "center", weight: 800, color: C.bad }); }
    },

    habit_click(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Mw.habit(ctx, 200, 230, 1520, 3, HABITS[2][0], HABITS[2][1], { on: true });
      const n = reveal(l, 1.2, 1.3, 3);
      const traps = [["pesan dari nomor tak dikenal", "\"Selamat! Kamu menang hadiah, klik di sini\""], ["lampiran tak terduga", "\"nilai_rapor_final.exe\""], ["tombol unduh raksasa", "DOWNLOAD NOW di situs gratisan"]];
      traps.forEach(([t, s], i) => { if (i < n) { card(ctx, 200 + i * 520, 400, 480, 200, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "✕ " + t, 440 + i * 520, 450, 24, { align: "center", weight: 900, color: C.bad }); para(ctx, s, 440 + i * 520, 500, 20, 440, { align: "center", weight: 700, color: C.ink2, lh: 1.3 }); text(ctx, "→ lewati", 440 + i * 520, 575, 22, { align: "center", weight: 900, color: C.good }); } });
      if (n >= 3) banner(ctx, "ragu? tanya pengirimnya lewat jalur lain", 745, 900, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    habit_av_backup(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.8, 3.0, 2);
      Mw.habit(ctx, 200, 240, 740, 4, HABITS[3][0], HABITS[3][1], { on: n === 1, dim: n < 1 });
      Mw.habit(ctx, 980, 240, 740, 5, HABITS[4][0], HABITS[4][1], { on: n === 2, dim: n < 2 });
      if (n >= 1) { Mw.shield(ctx, 420, 560, 160); text(ctx, "memindai dan menghentikan malware", 570, 690, 22, { align: "center", weight: 800, color: C.ink2 }); Mw.bug(ctx, 620, 540, 50, "virus"); ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(595, 515); ctx.lineTo(645, 565); ctx.moveTo(645, 515); ctx.lineTo(595, 565); ctx.stroke(); }
      if (n >= 2) { Mw.file(ctx, 1150, 540, 130, { name: "tugas" }); arrowIcon(ctx, "right", 1280, 530, 40, C.good); D.fileIcon(ctx, 1420, 520, 70, "folder", {}); text(ctx, "awan / flashdisk", 1420, 590, 20, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "ransomware mengunci? pulihkan, tak perlu bayar", 1350, 690, 22, { align: "center", weight: 900, color: C.good }); }
    },

    izin(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "IZIN APLIKASI: BACA SEBELUM MENYETUJUI", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.2, 4);
      Mw.perms(ctx, 300, 290, 760, "Aplikasi Senter", [["menyalakan lampu kilat", true], ["membaca pesan SMS", false], ["mengakses kontak", false], ["lokasi setiap saat", false]], { n });
      if (n >= 4) { Mw.bug(ctx, 1300, 420, 110, "spyware", { look: Math.sin(l * 2) }); text(ctx, "spyware hidup dari izin", 1300, 540, 26, { align: "center", weight: 900, color: Mw.color("spyware") }); text(ctx, "yang diberikan tanpa dibaca", 1300, 580, 26, { align: "center", weight: 900, color: Mw.color("spyware") }); card(ctx, 1150, 630, 300, 70, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "TOLAK", 1300, 676, 28, { align: "center", weight: 900, color: C.bad }); }
    },
    checklist(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "ENAM KEBIASAAN PENJAGA PINTU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const all = [...HABITS.map(h => h[0]), "Baca izin aplikasi"]; const n = reveal(l, 0.8, 0.9, 6);
      all.forEach((t, i) => { const x = 260 + (i % 3) * 480, y = 290 + Math.floor(i / 3) * 170; ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.2; card(ctx, x, y, 440, 130, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); Mw.shield(ctx, x + 60, y + 65, 70); text(ctx, t, x + 120, y + 75, 26, { weight: 900 }); ctx.restore(); });
      if (n >= 6) banner(ctx, "enam kebiasaan kecil, perangkat jauh lebih aman", 745, 1000, { fill: C.goodBg, stroke: C.good, color: C.good, size: 30 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pasangkan tamu dan pintu", "lima jenis, lima cara masuk", (x, y) => { [0, 2, 4].forEach((k, i) => { Mw.bug(ctx, x - 150 + i * 150, y - 60, 50, KINDS[k][0]); arrowIcon(ctx, "down", x - 150 + i * 150, y - 10, 24, C.ink2); Mw.door(ctx, x - 150 + i * 150, y + 90, 50, 80, DOORS[k], {}); }); }],
        ["Aman atau bahaya?", "sepuluh situasi", (x, y) => { card(ctx, x - 200, y - 80, 400, 60, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "✓ unduh dari toko resmi", x, y - 42, 22, { align: "center", weight: 900, color: C.good }); card(ctx, x - 200, y, 400, 60, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "✕ klik tautan hadiah", x, y + 38, 22, { align: "center", weight: 900, color: C.bad }); }],
        ["Periksa izin aplikasi", "masuk akal atau tidak", (x, y) => { ctx.save(); ctx.translate(x - 200, y - 100); ctx.scale(0.65, 0.65); Mw.perms(ctx, 0, 0, 600, "Kalkulator", [["tidak perlu izin", true], ["mengakses kamera", false]], {}); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 630, 26, { align: "center", weight: 900 }); text(ctx, t2, x, 668, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu rapikan HP-mu bersama orang tua", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
