/* Adegan episode E.2: Peran Sistem Operasi. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, komputer.js, struktur.js, os.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Km = K.komp, St = K.struktur, O = K.os, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const TASKS = [["⏱️", "Proses", "giliran prosesor"], ["🧠", "Memori", "wilayah tiap proses"], ["📁", "Berkas", "nama, folder, izin"], ["🖨️", "Perangkat", "driver, antrean"]];
  const A = O.APPS;

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      card(ctx, 520, 250, 1200, 90, { fill: C.bg2, r: 16 }); text(ctx, "APLIKASI: musik · chat · peramban · game · …", 1120, 305, 26, { align: "center", weight: 900 });
      card(ctx, 520, 390, 1200, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "SISTEM OPERASI", 1120, 435, 30, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "pengatur lalu lintas: Windows · Android · iOS · Linux", 1120, 475, 22, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 520, 550, 1200, 90, { fill: C.bg2, r: 16 }); text(ctx, "PERANGKAT KERAS: prosesor · RAM · penyimpanan · layar · printer", 1120, 605, 24, { align: "center", weight: 900 });
      arrowIcon(ctx, "down", 1120, 365, 26, C.ink2); arrowIcon(ctx, "down", 1120, 525, 26, C.ink2);
      const n = reveal(l, 6.5, 0.9, 4);
      TASKS.forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 560 + i * 290, 670, 260, 70, { fill: "#fff", stroke: C.kiko, lw: 3, r: 12 }); text(ctx, ic + " " + t, 690 + i * 290, 715, 24, { align: "center", weight: 900 }); ctx.restore(); });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode E.1", 960, 420, 60, { align: "center", weight: 900 }); text(ctx, "Komputer Von Neumann", 960, 500, 48, { align: "center", weight: 700, color: C.ink2 });
      ["Prosesor dan register", "Memori dan alamat", "Masukan, keluaran, bus"].forEach((s, i) => { card(ctx, 420 + i * 380, 580, 340, 120, { fill: C.bg2 }); para(ctx, s, 590 + i * 380, 632, 28, 300, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_giliran(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: SATU PROSESOR, LIMA SOAL");
      kid(ctx, 420, 540, 150, { point: true }); ctx.fillStyle = C.kiko; rr(ctx, 320, 300, 200, 44, 10); ctx.fill(); text(ctx, "PROSESOR", 420, 330, 22, { align: "center", weight: 900, color: "#fff" });
      const turn = Math.floor(l / 2.2) % 5;
      for (let i = 0; i < 5; i++) { const x = 760 + i * 200; kid(ctx, x, 560, 110, { hair: i % 2 ? "long" : null }); ctx.fillStyle = i === turn ? "#FFF3D6" : "#fff"; ctx.strokeStyle = i === turn ? C.accent : "#B7C4CC"; ctx.lineWidth = i === turn ? 5 : 3; rr(ctx, x - 60, 330, 120, 80, 10); ctx.fill(); ctx.stroke(); text(ctx, "soal " + (i + 1), x, 365, 20, { align: "center", weight: 900 }); text(ctx, ["3 mnt", "1 mnt", "2 mnt", "4 mnt", "1 mnt"][i], x, 395, 18, { align: "center", weight: 700, color: C.ink2 }); }
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(1660, 370, 50, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(1660, 370, 36, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ((l / 2.2) % 1)); ctx.stroke(); text(ctx, "30 dt", 1660, 378, 20, { align: "center", weight: 900, color: "#fff" });
      if (l > 7) label(ctx, "30 detik per soal, lalu pindah walau belum selesai", 960, 740, { size: 26 });
    },
    unplugged_meja(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MEJA DIBAGI PETAK: TIAP APLIKASI DAPAT WILAYAHNYA");
      ctx.fillStyle = C.tableTop; rr(ctx, 300, 300, 1320, 320, 14); ctx.fill();
      const n = reveal(l, 1.5, 1.6, 4);
      [[0, 3, A[0]], [3, 2, A[1]], [5, 4, A[2]], [9, 1, A[3]]].forEach(([s, w, app], i) => { if (i >= n) return; const x = 310 + s * 130, bw = w * 130 - 10; ctx.fillStyle = app[2]; rr(ctx, x, 310, bw, 300, 10); ctx.fill(); ctx.setLineDash([10, 8]); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; rr(ctx, x, 310, bw, 300, 10); ctx.stroke(); ctx.setLineDash([]); text(ctx, app[0], x + bw / 2, 440, 44, { align: "center" }); text(ctx, app[1], x + bw / 2, 490, 22, { align: "center", weight: 900, color: "#fff" }); });
      if (n >= 4) { text(ctx, "murid baru? tunggu petak kosong", 1700, 270, 20, { align: "right", weight: 900, color: C.bad }); kid(ctx, 1720, 690, 70); }
      if (n >= 4) label(ctx, "petak = wilayah memori; tidak boleh menulis di petak teman", 900, 700, { size: 26 });
    },

    proses(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TUGAS 1 · PROSES: IRISAN WAKTU BERGANTIAN", 215);
      const per = 1.6, k = Math.floor(l / per) % 4, u = (l % per) / per;
      O.cpu(ctx, 560, 480, A[k], u, { label: "irisan waktu: beberapa milidetik" });
      A.forEach((app, i) => O.proc(ctx, 1200, 300 + i * 100, 420, app, { on: i === k, sub: i === k ? "giliran" : "menunggu" }));
      arrowIcon(ctx, "left", 920, 300 + k * 100, 30, C.accent);
      text(ctx, "proses = aplikasi yang sedang berjalan", 1200, 700, 22, { align: "center", weight: 800, color: C.ink2 });
      if (l > 9) label(ctx, "berganti ribuan kali tiap detik → terasa bersamaan", 560, 700, { size: 24 });
    },
    round_robin(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ANTREAN BERPUTAR, PRIORITAS, DAN PENGELOLA TUGAS", 215);
      const k = Math.floor(l / 1.2) % 4;
      A.forEach((app, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; const x = 470 + Math.cos(a) * 170, y = 480 + Math.sin(a) * 150; O.proc(ctx, x, y, 220, app, { on: i === k }); });
      ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.ellipse(470, 480, 170, 150, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); text(ctx, "↻", 470, 500, 60, { align: "center", weight: 900, color: C.kiko });
      const n = reveal(l, 5, 3.5, 2);
      if (n >= 1) { card(ctx, 820, 280, 400, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "prioritas", 1020, 325, 24, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "panggilan video > unduhan latar", 1020, 365, 20, { align: "center", weight: 700, color: C.ink2 }); }
      if (n >= 2) { O.taskman(ctx, 1260, 260, 460, [["Musik", "2%", "120 MB"], ["Chat", "1%", "210 MB"], ["Peramban", "35%", "1,1 GB"], ["Game (tidak merespons)", "98%", "2,4 GB"]], { hl: 3 }); card(ctx, 1380, 560, 220, 50, { fill: C.bad, r: 10 }); text(ctx, "Akhiri tugas", 1490, 593, 20, { align: "center", weight: 900, color: "#fff" }); text(ctx, "yang macet dihentikan, yang lain jalan terus", 1490, 650, 18, { align: "center", weight: 800, color: C.ink2 }); }
    },
    memori(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TUGAS 2 · MEMORI: SATU PETA, WILAYAH SENDIRI-SENDIRI", 215);
      const n = reveal(l, 1.5, 1.4, 4);
      const alloc = [{ app: A[0], start: 0, size: 3 }, { app: A[1], start: 3, size: 2 }, { app: A[2], start: 5, size: 5 }, { app: A[3], start: 10, size: 4 }].slice(0, n);
      O.memmap(ctx, 240, 300, 1440, 120, 16, alloc, { title: "RAM 16 GB (1 blok = 1 GB)" });
      if (n >= 4) { card(ctx, 240, 480, 700, 200, { fill: "#fff", stroke: "#8E6BBF", lw: 3, r: 14 }); text(ctx, "PETA (dipegang sistem operasi)", 590, 520, 20, { align: "center", weight: 900, color: "#8E6BBF" }); ["Musik: blok 0–2", "Chat: blok 3–4", "Peramban: blok 5–9", "Game: blok 10–13 · kosong: 14–15"].forEach((s, i) => text(ctx, s, 270, 560 + i * 32, 20, { weight: 800 })); }
      if (l > 9) { card(ctx, 1000, 480, 680, 200, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "✕ Game mencoba membaca blok 3 (milik Chat)", 1340, 540, 22, { align: "center", weight: 900, color: C.bad }); text(ctx, "sistem operasi menolak: aplikasi rusak", 1340, 585, 20, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "tidak merusak aplikasi lain", 1340, 620, 20, { align: "center", weight: 700, color: C.ink2 }); }
    },
    memori_penuh(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "RAM PENUH: DIPINDAH KE PENYIMPANAN, JADI LAMBAT", 215);
      const n = reveal(l, 1.5, 2.6, 3);
      const alloc = [{ app: A[0], start: 0, size: 3, swap: n >= 2 }, { app: A[1], start: 3, size: 2 }, { app: A[2], start: 5, size: 5 }, { app: A[3], start: 10, size: 6, hl: n === 1 }];
      O.memmap(ctx, 240, 300, 1100, 120, 16, alloc, { title: "RAM 16 GB: penuh" });
      card(ctx, 1420, 280, 300, 180, { fill: "#F7FAF8", stroke: "#7B8B95", lw: 3, r: 14 }); text(ctx, "PENYIMPANAN", 1570, 320, 20, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "lambat", 1570, 350, 18, { align: "center", weight: 700, color: C.muted });
      if (n >= 1) { text(ctx, "📷 Kamera butuh 2 GB", 790, 500, 26, { align: "center", weight: 900, color: C.bad }); }
      if (n >= 2) { arrowIcon(ctx, "right", 1385, 360, 30, C.ink2); ctx.fillStyle = "#8E6BBF"; rr(ctx, 1450, 380, 240, 50, 8); ctx.fill(); text(ctx, "🎵 Musik (jarang dipakai)", 1570, 413, 18, { align: "center", weight: 900, color: "#fff" }); text(ctx, "bolak-balik RAM ↔ penyimpanan: tersendat", 790, 560, 24, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 3) { card(ctx, 440, 610, 1040, 80, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "✓ tutup aplikasi yang tidak dipakai → wilayahnya bebas lagi", 960, 660, 26, { align: "center", weight: 900, color: C.good }); }
    },

    berkas(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TUGAS 3 · BERKAS: YANG KAMU LIHAT DAN YANG DICATAT", 215);
      St.tree(ctx, { label: "Dokumen", kids: [{ label: "Tugas", kids: [{ label: "fisika.docx" }, { label: "foto.jpg" }] }, { label: "Musik" }] }, 220, 280, 600, { levelH: 110, bw: 170, bh: 50, size: 20, path: l > 4 ? ["Dokumen", "Tugas", "fisika.docx"] : [] });
      text(ctx, "yang kamu lihat: nama, folder, jenis", 520, 640, 22, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 4.0, 1.0, 4);
      O.disk(ctx, 1000, 320, 8, 4, 70, [{ idx: 3, col: C.kiko, label: "1" }, { idx: 11, col: C.kiko, label: "2" }, { idx: 20, col: C.kiko, label: "3" }, { idx: 29, col: C.kiko, label: "4" }].slice(0, n), { title: "yang dicatat sistem operasi: fisika.docx = blok 3, 11, 20, 29" });
      if (n >= 4) label(ctx, "disusun kembali saat dibuka; kamu tak perlu tahu nomor bloknya", 1280, 660, { size: 22 });
    },
    izin_berkas(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SISTEM OPERASI MENJAGA PINTU: IZIN", 215);
      const n = reveal(l, 1.5, 3.0, 2);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; card(ctx, 220, 280, 700, 400, { fill: C.bg2, r: 16 }); text(ctx, "IZIN BERKAS", 570, 325, 24, { align: "center", weight: 900, color: C.kiko });
      [["rapor_sinta.pdf", "Sinta", "baca ✓ ubah ✓"], ["", "Dito", "baca ✕ ubah ✕"], ["", "Guru", "baca ✓ ubah ✓"]].forEach(([f, who, p], i) => { card(ctx, 260, 360 + i * 90, 620, 70, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); if (f) text(ctx, "📄 " + f, 280, 404 + i * 90, 20, { weight: 900 }); text(ctx, who, 560, 404 + i * 90, 22, { weight: 800, color: C.ink2 }); text(ctx, p, 860, 404 + i * 90, 20, { align: "right", weight: 900, color: p.includes("✕") ? C.bad : C.good }); }); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; card(ctx, 1000, 280, 700, 400, { fill: C.bg2, r: 16 }); text(ctx, "IZIN APLIKASI", 1350, 325, 24, { align: "center", weight: 900, color: C.kiko });
      card(ctx, 1080, 360, 540, 260, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 16 }); para(ctx, "Aplikasi Senter meminta izin mengakses Kamera", 1350, 410, 22, 480, { align: "center", weight: 800 }); card(ctx, 1110, 520, 230, 60, { fill: C.bad, r: 10 }); text(ctx, "Tolak", 1225, 560, 22, { align: "center", weight: 900, color: "#fff" }); card(ctx, 1360, 520, 230, 60, { fill: C.good, r: 10 }); text(ctx, "Izinkan", 1475, 560, 22, { align: "center", weight: 900, color: "#fff" });
      text(ctx, "yang bertanya: sistem operasi, bukan aplikasinya", 1350, 660, 18, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
    },
    perangkat(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TUGAS 4 · PERANGKAT: DRIVER SEBAGAI PENERJEMAH", 215);
      card(ctx, 220, 300, 400, 300, { fill: "#F7FAF8", stroke: C.kiko, lw: 4, r: 16 }); text(ctx, "APLIKASI", 420, 345, 22, { align: "center", weight: 900, color: C.kiko }); text(ctx, "\"cetak halaman ini\"", 420, 450, 24, { align: "center", weight: 800 });
      card(ctx, 700, 300, 520, 300, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "SISTEM OPERASI", 960, 345, 22, { align: "center", weight: 900, color: C.accentDark });
      const n = reveal(l, 2.0, 1.2, 3);
      [["printer", C.bad], ["kamera", C.good], ["keyboard", "#8E6BBF"]].forEach(([d, col], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; O.plug(ctx, 860 + i * 110, 450, 70, { color: col, label: "drv" }); text(ctx, d, 860 + i * 110, 520, 16, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      text(ctx, "driver: penerjemah tiap perangkat", 960, 570, 20, { align: "center", weight: 800, color: C.ink2 });
      arrowIcon(ctx, "right", 660, 450, 30, C.ink2); arrowIcon(ctx, "right", 1260, 450, 30, C.ink2);
      Km.printer(ctx, 1520, 440, 150); text(ctx, "printer baru dicolok → driver dipasang", 1520, 580, 18, { align: "center", weight: 800, color: C.ink2 });
      if (l > 9) label(ctx, "semua aplikasi langsung bisa mencetak, tanpa tahu merek printernya", 960, 680, { size: 24 });
    },
    antrean_cetak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ANTREAN CETAK DAN INTERUPSI", 215);
      const n = reveal(l, 1.0, 2.0, 3);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; text(ctx, "📄 tugas Sinta", 320, 330, 24, { align: "center", weight: 900 }); text(ctx, "📄 poster Dito", 320, 420, 24, { align: "center", weight: 900 }); arrowIcon(ctx, "right", 470, 330, 26, C.ink2); arrowIcon(ctx, "right", 470, 420, 26, C.ink2);
      card(ctx, 520, 290, 420, 170, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "ANTREAN CETAK", 730, 330, 20, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "1. tugas Sinta  →  2. poster Dito", 730, 380, 22, { align: "center", weight: 800 }); text(ctx, "satu per satu", 730, 420, 18, { align: "center", weight: 700, color: C.ink2 }); arrowIcon(ctx, "right", 980, 375, 26, C.ink2); Km.printer(ctx, 1120, 370, 120); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; card(ctx, 220, 500, 1480, 190, { fill: C.bg2, r: 16 }); text(ctx, "INTERUPSI", 300, 545, 22, { weight: 900, color: C.kiko });
      const steps = ["proses A jalan", "⌨️ tombol ditekan → interupsi", "OS menyela, melayani keyboard", "lanjut proses A"];
      steps.forEach((s, i) => { ctx.save(); if (n < 3 && i >= 2) ctx.globalAlpha = 0.25; card(ctx, 300 + i * 350, 580, 320, 80, { fill: i === 1 ? C.badBg : "#fff", stroke: i === 1 ? C.bad : "#B7C4CC", lw: 3, r: 12 }); para(ctx, s, 460 + i * 350, 612, 20, 290, { align: "center", weight: 800 }); if (i < 3) arrowIcon(ctx, "right", 635 + i * 350, 620, 22, C.ink2); ctx.restore(); }); ctx.restore();
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Giliran prosesor", "siapa selesai lebih dulu?", (x, y) => { A.forEach((app, i) => O.proc(ctx, x - 90, y - 90 + i * 60, 300, app, { sub: ["3", "1", "2", "4"][i] + " irisan" })); }],
        ["Peta memori", "tempatkan tanpa tumpang tindih", (x, y) => O.memmap(ctx, x - 200, y - 60, 400, 70, 10, [{ app: A[0], start: 0, size: 3 }, { app: A[1], start: 3, size: 1 }, { app: A[2], start: 4, size: 2 }], { title: "RAM 10 blok" })],
        ["Pasangkan kejadian", "tugas OS mana?", (x, y) => TASKS.forEach(([ic, t], i) => { card(ctx, x - 200 + (i % 2) * 205, y - 90 + Math.floor(i / 2) * 80, 195, 66, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, ic + " " + t, x - 102 + (i % 2) * 205, y - 48 + Math.floor(i / 2) * 80, 20, { align: "center", weight: 900 }); })]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu buka pengelola tugas bersama guru", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
