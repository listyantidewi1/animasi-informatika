/* Adegan episode D9.0: Jembatan Kelas IX. Muat setelah kiko-core.js, kiko-devices.js, alur.js (D8.3), lembar.js (D8.1). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, A = K.alur, LB = K.lembar, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const ROWS = [["Dito", 65, "belum"], ["Sinta", 88, "-"], ["Rani", 72, "-"], ["Bayu", 58, "belum"], ["Tari", 91, "-"], ["Agus", 69, "belum"]];
  function gradeFlow(ctx, x, y, opt = {}) {
    const a = A.node(ctx, "term", x, y, 180, 46, "MULAI", { hl: opt.hl === "mulai" });
    const b = A.node(ctx, "io", x, y + 80, 240, 48, "baca nilai", { hl: opt.hl === "baca" });
    const c = A.node(ctx, "dec", x, y + 190, 280, 100, "nilai > 70?", { hl: opt.hl === "dec" });
    const d1 = A.node(ctx, "io", x - 220, y + 320, 200, 48, "tulis LULUS", { hl: opt.hl === "lulus" });
    const d2 = A.node(ctx, "io", x + 220, y + 320, 200, 48, "tulis REMEDI", { hl: opt.hl === "remedi" });
    const e = A.node(ctx, "term", x, y + 430, 180, 46, "SELESAI", { hl: opt.hl === "selesai" });
    A.arrow(ctx, [a.bottom, b.top]); A.arrow(ctx, [b.bottom, c.top]);
    A.arrow(ctx, [c.left, [x - 220, y + 190], d1.top], { label: "ya", dy: -12, on: opt.on === "ya" }); A.arrow(ctx, [c.right, [x + 220, y + 190], d2.top], { label: "tidak", dy: -12, on: opt.on === "tidak" });
    A.arrow(ctx, [d1.bottom, [x - 220, y + 430], e.left]); A.arrow(ctx, [d2.bottom, [x + 220, y + 430], e.right]);
  }
  const PATH = (x, y, yes) => yes ? [[x, y], [x, y + 190], [x - 220, y + 190], [x - 220, y + 320], [x - 220, y + 430], [x - 90, y + 430]] : [[x, y], [x, y + 190], [x + 220, y + 190], [x + 220, y + 320], [x + 220, y + 430], [x + 90, y + 430]];
  const PSEUDO = [{ t: "baca nilai" }, { t: "JIKA nilai > 70 MAKA" }, { t: "tulis LULUS", ind: 1 }, { t: "LAINNYA" }, { t: "tulis REMEDI", ind: 1 }];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      card(ctx, 620, 260, 1100, 180, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "Bukan ulangan.", 1170, 330, 40, { align: "center", weight: 900, color: C.good }); text(ctx, "Kuis diagnostik di halaman latihan: hasilnya hanya untukmu.", 1170, 390, 26, { align: "center", weight: 700, color: C.ink2 });
      if (l > 3) { [["D8.3", "Flowchart dan Pseudocode"], ["D8.2", "Data Kecil: Urutkan, Saring"]].forEach(([c, t], i) => { card(ctx, 700 + i * 520, 500, 460, 180, { fill: C.bg2 }); text(ctx, "tonton ulang " + c + "?", 930 + i * 520, 570, 28, { align: "center", weight: 900 }); text(ctx, t, 930 + i * 520, 620, 26, { align: "center", weight: 700, color: C.ink2 }); }); label(ctx, "peta belajarmu akan menjawabnya", 1170, 760, { size: 26, color: C.ink2 }); }
    },
    unplugged(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER: ROBOT DENGAN JIKA", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      kid(ctx, 360, 560, 160, { point: true }); text(ctx, "pemberi perintah", 360, 790, 24, { align: "center", weight: 800, color: C.ink2 });
      kid(ctx, 760, 560, 160, { hair: "long" }); text(ctx, "robot", 760, 790, 24, { align: "center", weight: 800, color: C.ink2 });
      // kursi
      ctx.fillStyle = "#A4653A"; rr(ctx, 930, 560, 90, 20, 6); ctx.fill(); rr(ctx, 930, 480, 20, 100, 6); ctx.fill(); rr(ctx, 940, 580, 14, 60, 4); ctx.fill(); rr(ctx, 1000, 580, 14, 60, 4); ctx.fill(); text(ctx, "kursi", 975, 680, 22, { align: "center", weight: 800, color: C.ink2 });
      if (l > 1.5) A.pseudo(ctx, 1120, 260, 600, [{ t: "JIKA ada kursi MAKA" }, { t: "belok kanan", ind: 1 }, { t: "LAINNYA" }, { t: "maju", ind: 1 }], { rh: 56, size: 28 });
      if (l > 6) label(ctx, "robot hanya melakukan persis yang dikatakan", 1420, 640, { size: 26, color: C.ink2 });
    },
    unplugged_result(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      card(ctx, 200, 240, 740, 460, { fill: C.bg2 }); text(ctx, "ADA KURSI", 570, 300, 30, { align: "center", weight: 900, color: C.kiko });
      kid(ctx, 440, 500, 130, { hair: "long" }); ctx.fillStyle = "#A4653A"; rr(ctx, 560, 500, 70, 16, 6); ctx.fill(); rr(ctx, 560, 440, 16, 76, 6); ctx.fill();
      arrowIcon(ctx, "right", 460, 640, 50, C.good); text(ctx, "belok kanan", 570, 660, 26, { align: "center", weight: 900, color: C.good });
      if (l > 2.5) { card(ctx, 980, 240, 740, 460, { fill: C.bg2 }); text(ctx, "TANPA KURSI", 1350, 300, 30, { align: "center", weight: 900, color: C.kiko }); kid(ctx, 1220, 500, 130, { hair: "long" }); arrowIcon(ctx, "up", 1240, 640, 50, C.good); text(ctx, "maju", 1350, 660, 26, { align: "center", weight: 900, color: C.good }); }
      if (l > 6) banner(ctx, "satu program, dua jalan, tergantung keadaan", 745, 900);
    },

    flow_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "LIMA BENTUK FLOWCHART", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.1, 5);
      const items = [["term", "MULAI / SELESAI", "oval", 160, 50], ["proc", "proses", "kotak: pekerjaan", 180, 56], ["io", "input / output", "jajar genjang", 200, 56], ["dec", "keputusan?", "belah ketupat: ya/tidak", 200, 100]];
      items.forEach(([k, lab, desc, w, h], i) => { if (i < n) { const x = 330 + i * 330; card(ctx, x - 150, 290, 300, 300, { fill: C.bg2 }); A.node(ctx, k, x, 400, w, h, lab, { size: 20 }); text(ctx, desc, x, 550, 22, { align: "center", weight: 800, color: C.ink2 }); } });
      if (n >= 5) { card(ctx, 1500, 290, 260, 300, { fill: C.bg2 }); A.arrow(ctx, [[1630, 340], [1630, 470]], { on: true }); text(ctx, "panah: arah", 1630, 550, 22, { align: "center", weight: 800, color: C.ink2 }); banner(ctx, "bentuknya bercerita, panahnya mengarahkan", 745, 900); }
    },
    pseudo_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      gradeFlow(ctx, 520, 200, {});
      const n = reveal(l, 1.0, 1.0, 5);
      A.pseudo(ctx, 1000, 230, 700, PSEUDO.slice(0, n).map((ln, i) => ({ ...ln, hl: i === n - 1 })), { rh: 56, size: 28 });
      if (n >= 5) { ["JIKA = kondisi", "MAKA = jalan bila ya", "LAINNYA = jalan bila tidak"].forEach((s, i) => text(ctx, s, 1040, 620 + i * 44, 24, { weight: 800, color: C.kiko })); }
    },
    token_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const second = l > 4.5; const x = 520, y = 200; const yes = !second; const u = clamp(((second ? l - 4.5 : l) - 0.4) / 3.6, 0, 1);
      const stage = u < 0.4 ? "dec" : u < 0.75 ? (yes ? "lulus" : "remedi") : "selesai";
      gradeFlow(ctx, x, y, { hl: u > 0.1 ? stage : "mulai", on: u > 0.4 && u < 0.75 ? (yes ? "ya" : "tidak") : undefined });
      const pos = A.along(PATH(x, y, yes), u); A.token(ctx, pos[0], pos[1], { color: yes ? C.accent : C.bad });
      card(ctx, 1000, 260, 700, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "nilai = " + (yes ? 82 : 70), 1350, 335, 44, { align: "center", weight: 900 });
      if (u > 0.4) { card(ctx, 1000, 410, 700, 130, { fill: C.bg2 }); text(ctx, (yes ? 82 : 70) + " > 70?", 1350, 460, 30, { align: "center", weight: 900 }); text(ctx, yes ? "YA → tulis LULUS" : "TIDAK → tulis REMEDI", 1350, 510, 28, { align: "center", weight: 900, color: yes ? C.good : C.bad }); }
      if (second && u > 0.75) banner(ctx, "70 tidak lebih dari 70: dibaca persis, seperti mesin", 1270, 700, { size: 28 });
    },

    table_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.8, 0.6, 6);
      LB.sheet(ctx, 300, 240, [["Nama", "Nilai", "Remedi"], ...ROWS.slice(0, n)], { cw: 220, rh: 60, size: 24 });
      if (n >= 6) { ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; ctx.strokeRect(356, 360, 660, 60); label(ctx, "satu baris = satu murid", 1400, 400, { color: C.kiko, size: 26 }); ctx.strokeStyle = C.good; ctx.strokeRect(576, 240, 220, 420); label(ctx, "satu kolom = satu keterangan", 1400, 460, { color: C.good, size: 26 }); }
    },
    sort_filter_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const sorted = [...ROWS].sort((a, c) => c[1] - a[1]); const filtered = ROWS.filter(r => r[1] < 70);
      LB.sheet(ctx, 180, 260, [["Nama", "Nilai", "Remedi"], ...sorted], { cw: 170, rh: 50, size: 22, hl: { A2: C.goodBg, B2: C.goodBg, C2: C.goodBg } });
      text(ctx, "URUTKAN dari terbesar", 480, 230, 28, { align: "center", weight: 900, color: C.kiko });
      if (l > 2.5) { LB.sheet(ctx, 1000, 260, [["Nama", "Nilai", "Remedi"], ...filtered], { cw: 170, rh: 50, size: 22 }); text(ctx, "SARING: nilai < 70", 1300, 230, 28, { align: "center", weight: 900, color: C.accentDark }); label(ctx, "3 baris dari 6", 1300, 540, { size: 24, color: C.ink2 }); }
      if (l > 6) banner(ctx, "saring dulu, baru urutkan: langkah paling sedikit", 745, 1000, { size: 30 });
    },

    loop_teaser(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "BEKAL BARU KELAS IX: PERULANGAN", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      A.pseudo(ctx, 240, 290, 600, [{ t: "tulis halo" }, { t: "tulis halo" }, { t: "tulis halo" }], { title: "TIGA BARIS YANG SAMA", rh: 56, size: 28 });
      if (l > 3.5) { ctx.strokeStyle = C.ink2; ctx.fillStyle = C.ink2; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(905, 420); ctx.lineTo(1030, 420); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1048, 420); ctx.lineTo(1024, 404); ctx.lineTo(1024, 436); ctx.closePath(); ctx.fill(); A.pseudo(ctx, 1060, 290, 640, [{ t: "ULANGI 3 kali:", hl: true }, { t: "tulis halo", ind: 1 }], { title: "DITULIS SATU KALI", rh: 56, size: 28 }); }
      if (l > 6) { card(ctx, 1060, 480, 640, 150, { fill: C.goodBg, stroke: C.good, lw: 4 }); ["halo", "halo", "halo"].forEach((s, i) => text(ctx, s, 1220 + i * 160, 565, 36, { align: "center", weight: 900, color: C.good })); label(ctx, "hasilnya sama", 1380, 700, { size: 26, color: C.good }); }
    },
    map9(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "PETA KELAS IX", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const units = [["D9.1", "Pseudocode lengkap: perulangan dan data"], ["D9.2", "Jaringan lokal dan internet"], ["D9.3", "Melindungi perangkat dari malware"], ["D9.4", "Data pribadi dan identitas digital"], ["D9.5", "Produksi konten digital"], ["D9.6", "Proyek akhir Fase D"]];
      const n = reveal(l, 0.8, 1.1, 6);
      units.forEach(([c, t], i) => { const x = 420 + (i % 3) * 540, y = i < 3 ? 280 : 480; ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.2; card(ctx, x - 240, y, 480, 160, { fill: C.bg2, r: 16 }); text(ctx, c, x, y + 55, 30, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x, y + 105, 24, 440, { align: "center", weight: 800, lh: 1.2 }); ctx.restore(); });
      if (n >= 6) label(ctx, "semua memakai bekal: flowchart, pseudocode, tabel", 960, 700, { size: 28 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU: KUIS DIAGNOSTIK", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["8 soal bergambar", "flowchart, pseudocode, tabel", (x, y) => { for (let i = 0; i < 8; i++) { card(ctx, x - 190 + (i % 4) * 95, y - 70 + Math.floor(i / 4) * 80, 85, 70, { fill: i < 5 ? C.goodBg : "#fff", stroke: i < 5 ? C.good : "#CFDCD5", lw: 3, r: 10 }); text(ctx, String(i + 1), x - 147 + (i % 4) * 95, y - 26 + Math.floor(i / 4) * 80, 26, { align: "center", weight: 900, color: i < 5 ? C.good : C.ink2 }); } }],
        ["Hasil hanya untukmu", "salah tidak apa-apa", (x, y) => kiko(ctx, x, y + 10, 150, 0, { mood: "happy" })],
        ["Peta belajarmu", "tonton ulang D8.2 atau D8.3?", (x, y) => { [["D8.3", true], ["D8.2", false]].forEach(([c, on], i) => { card(ctx, x - 170, y - 80 + i * 90, 340, 70, { fill: on ? "#FFF3D6" : C.goodBg, stroke: on ? C.accent : C.good, lw: 3, r: 12 }); text(ctx, (on ? "↺ tonton ulang " : "✓ aman ") + c, x, y - 36 + i * 90, 24, { align: "center", weight: 900, color: on ? C.accentDark : C.good }); }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 610, 28, { align: "center", weight: 900 }); text(ctx, t2, x, 650, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini, sebelum masuk perulangan", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
