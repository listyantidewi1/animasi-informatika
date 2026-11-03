/* Adegan episode E.5: Struktur Data Standar. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, alur.js, memori.js, sd.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Al = K.alur, Sd = K.sd, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const WADAH = [["▦", "Array", "kotak bernomor"], ["🪪", "Record", "satu benda, banyak keterangan"], ["🥞", "Stack", "terakhir masuk, pertama keluar"], ["🚶‍♂️🚶‍♀️", "Queue", "pertama masuk, pertama keluar"]];
  const NILAI = [70, 85, 90, 65];
  // jadwal operasi tumpukan/antrean: ops [[jenis, label]], per detik; mengembalikan {items, moving}
  const play = (ops, l, t0, per, kind) => { let items = []; let moving = null; for (let i = 0; i < ops.length; i++) { const [op, lab] = ops[i]; const t = t0 + i * per; if (l < t) break; const u = clamp((l - t) / (per * 0.7), 0, 1); if (op === "in") { if (u >= 1) items.push(lab); else moving = { label: lab, u, dir: "in" }; } else { if (u >= 1) { if (kind === "stack") items.pop(); else items.shift(); } else { const out = kind === "stack" ? items[items.length - 1] : items[0]; if (kind === "stack") items = items.slice(0, -1); else items = items.slice(1); moving = { label: out, u, dir: "out" }; } } } return { items, moving }; };

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.3, 4);
      WADAH.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 520 + i * 310; card(ctx, x, 280, 290, 300, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 145, 380, 56, { align: "center" }); text(ctx, t, x + 145, 440, 28, { align: "center", weight: 900 }); para(ctx, s, x + 145, 485, 20, 250, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) banner(ctx, "empat struktur data, empat aturan main", 650, 900);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.6", "Data Terstruktur di Sekitar Kita"], ["D9.1", "Pseudocode Lengkap: Perulangan dan Data"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 30, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_kotak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: ENAM KOTAK BERNOMOR");
      const open = l > 4;
      for (let i = 0; i < 6; i++) { const x = 300 + i * 230; const on = open && i === 3; ctx.fillStyle = on ? "#F2B134" : "#C98A57"; rr(ctx, x, 360, 180, 140, 10); ctx.fill(); ctx.fillStyle = "#A4653A"; rr(ctx, x - 8, 340, 196, 30, 6); ctx.fill(); text(ctx, String(i + 1), x + 90, 440, 44, { align: "center", weight: 900, color: "#fff" }); if (on) { ctx.fillStyle = "#fff"; rr(ctx, x + 40, 290, 100, 60, 8); ctx.fill(); text(ctx, "65", x + 90, 332, 30, { align: "center", weight: 900 }); } }
      kid(ctx, 1700, 620, 120, { point: open });
      if (open) bubble(ctx, 1380, 560, 300, "Kotak nomor empat!", 24, { tailX: 1640 });
      if (l > 7) label(ctx, "langsung ke nomor 4, tanpa menghitung dari 1: akses langsung", 960, 620);
    },
    unplugged_kartu(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "KARTU ANGGOTA, TUMPUKAN BUKU, ANTREAN FOTOKOPI", 215);
      Sd.record(ctx, 240, 280, 420, "kartu anggota", [["nama", "Sinta", ""], ["kelas", "X-A", ""], ["HP", "08xx…", ""]]);
      text(ctx, "satu benda, banyak keterangan: record", 450, 530, 20, { align: "center", weight: 900, color: "#8E6BBF" });
      Sd.stack(ctx, 900, 560, ["Matematika", "Fisika", "Bahasa"], { w: 220, h: 50, cap: 4, hlTop: true, label: "tumpukan buku" });
      const n = reveal(l, 6, 1.2, 3);
      Sd.queue(ctx, 1200, 400, ["Dito", "Rani", "Bayu"].slice(0, n), { w: 130, h: 60, cap: 4, hlFront: true });
      text(ctx, "antrean fotokopi", 1460, 520, 20, { align: "center", weight: 900, color: C.ink2 });
      if (l > 10) label(ctx, "hari ini: bagaimana program memakainya", 1300, 640, { size: 26 });
    },

    larik_def(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ARRAY: DERETAN KOTAK SEJENIS BERNOMOR", 215);
      const hl = l < 3 ? null : l < 6 ? 1 : l < 9 ? 3 : null;
      Sd.array(ctx, 360, 320, NILAI, { name: "nilai", hl, w: 240, h: 110 });
      if (hl) { card(ctx, 1200, 520, 400, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "nilai[" + hl + "] = " + NILAI[hl - 1], 1400, 572, 32, { align: "center", weight: 900, color: C.accentDark }); }
      text(ctx, "indeks", 300, 465, 20, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 9, 2.0, 3);
      [["ukuran ditentukan di awal: 4 kotak"], ["semua kotak sejenis: angka"], ["baca atau ubah langsung lewat indeks"]].forEach(([t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 360, 520 + i * 70, 760, 58, { fill: C.bg2, r: 12 }); text(ctx, "• " + t, 390, 557 + i * 70, 24, { weight: 800 }); ctx.restore(); });
    },
    larik_ops(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MENELUSURI ARRAY DENGAN PERULANGAN", 215);
      const step = reveal(l, 1.5, 1.6, 4); const total = NILAI.slice(0, step).reduce((a, b) => a + b, 0);
      Al.pseudo(ctx, 220, 260, 760, [{ t: "total ← 0" }, { t: "UNTUK i dari 1 sampai 4:", hl: step >= 1 && step < 4 }, { t: "total ← total + nilai[i]", ind: 1, hl: step >= 1 && step < 4 }], { rh: 54, size: 26 });
      Sd.array(ctx, 1040, 290, NILAI, { name: "nilai", hl: step >= 1 && step <= 4 ? step : null, w: 150, h: 80 });
      card(ctx, 1040, 440, 300, 90, { fill: "#1F2A33", r: 12 }); text(ctx, "i = " + Math.min(step, 4), 1190, 475, 22, { align: "center", weight: 900, color: "#8FD0E6" }); text(ctx, "total = " + total, 1190, 512, 26, { align: "center", weight: 900, color: "#fff" });
      if (l > 9) { Sd.array(ctx, 220, 560, NILAI, { name: "nilai[5]?", bad: 5, w: 120, h: 60 }); text(ctx, "indeks di luar batas → error", 700, 680, 22, { align: "center", weight: 900, color: C.bad }); }
      if (l > 12) { card(ctx, 1040, 580, 660, 110, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 12 }); para(ctx, "catatan: banyak bahasa pemrograman menghitung indeks mulai dari 0 (nilai[0] = 70)", 1370, 625, 20, 620, { align: "center", weight: 800, color: C.ink2 }); }
    },
    rekaman_def(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "RECORD: SATU BENDA, BANYAK KETERANGAN", 215);
      const n = reveal(l, 2.0, 2.0, 3);
      Sd.record(ctx, 300, 280, 560, "siswa", [["nama", "Sinta", "teks"], ["kelas", "X-A", "teks"], ["nilai", 85, "angka"]].slice(0, Math.max(1, n)), { hl: l > 9 ? "nilai" : null });
      if (n >= 3) { ["siswa.nama → \"Sinta\"", "siswa.kelas → \"X-A\"", "siswa.nilai → 85"].forEach((s, i) => { card(ctx, 1000, 300 + i * 90, 640, 70, { fill: C.bg2, r: 12 }); text(ctx, s, 1030, 345 + i * 90, 26, { weight: 900 }); }); }
      if (l > 9) label(ctx, "jenisnya boleh berbeda: teks, angka, tanggal", 960, 640, { size: 26 });
    },
    larik_rekaman(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ARRAY BERISI RECORD = TABEL", 215);
      const rows = [["Sinta", "X-A", 85], ["Dito", "X-A", 76], ["Rani", "X-B", 91]];
      const n = reveal(l, 1.0, 1.0, 3);
      rows.forEach((r, i) => { if (i < n) { ctx.save(); ctx.translate(0, 0); const h = 56 + 3 * 46 + 14; Sd.record(ctx, 240 + i * 300, 280, 280, "siswa[" + (i + 1) + "]", [["nama", r[0], ""], ["kelas", r[1], ""], ["nilai", r[2], ""]], { hl: l > 6 && i === 1 ? "nama" : null }); ctx.restore(); } });
      if (l > 6) { card(ctx, 1200, 290, 500, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "siswa[2].nama → \"Dito\"", 1450, 342, 28, { align: "center", weight: 900, color: C.accentDark }); }
      if (l > 9) { Al.pseudo(ctx, 1200, 400, 500, [{ t: "total ← 0" }, { t: "ULANGI untuk tiap s dalam siswa:" }, { t: "total ← total + s.nilai", ind: 1 }, { t: "rata ← total / 3" }], { rh: 46, size: 20 }); }
      if (l > 12) label(ctx, "rata-rata = 84", 1450, 700, { size: 26, color: C.good });
    },

    stack_ops(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "STACK: PUSH · POP · PEEK", 215);
      const r = play([["in", "A"], ["in", "B"], ["in", "C"], ["out", ""]], l, 6, 2.2, "stack");
      Sd.stack(ctx, 520, 700, r.items, { w: 220, h: 60, cap: 5, hlTop: !r.moving, moving: r.moving, label: "" });
      const ops = [["push", "taruh di atas"], ["pop", "ambil yang paling atas"], ["peek", "intip yang paling atas"]];
      const n = reveal(l, 1.0, 1.6, 3);
      ops.forEach(([nm, d], i) => Sd.op(ctx, 900, 280 + i * 100, 520, nm, d, { dim: i >= n, on: i === n - 1 }));
      if (l > 6) { const k = Math.min(3, Math.floor((l - 6) / 2.2)); const log = ["push A", "push B", "push C", "pop → C"]; card(ctx, 1460, 280, 260, 300, { fill: "#1F2A33", r: 12 }); log.slice(0, k + 1).forEach((s, i) => text(ctx, s, 1480, 325 + i * 44, 22, { weight: 900, color: i === k ? C.accent : "#C9D4DB" })); }
      if (l > 13) label(ctx, "terakhir masuk, pertama keluar (LIFO)", 1200, 700);
    },
    stack_use(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DI MANA STACK DIPAKAI?", 215);
      const n = reveal(l, 1.5, 3.0, 3);
      const items = [["↶ Undo", ["ketik 'a'", "ketik 'b'", "hapus 'b'"], "undo → batalkan 'hapus b' dulu"], ["← Kembali", ["Beranda", "Kelas X", "Jadwal"], "kembali → Kelas X"], ["( ) Kurung", ["(", "(", "["], "tutup ] → pop [ : pasangan ✓"]];
      items.forEach(([t, st, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 500; card(ctx, x, 270, 460, 420, { fill: C.bg2, r: 16 }); text(ctx, t, x + 230, 315, 26, { align: "center", weight: 900, color: C.kiko }); Sd.stack(ctx, x + 230, 560, st, { w: 200, h: 46, cap: 4, hlTop: true }); text(ctx, s, x + 230, 660, 18, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
    },
    queue_ops(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "QUEUE: ENQUEUE · DEQUEUE", 215);
      const n = reveal(l, 1.0, 2.0, 2);
      [["enqueue", "masuk di belakang"], ["dequeue", "keluar dari depan"]].forEach(([nm, d], i) => Sd.op(ctx, 240 + i * 540, 280, 500, nm, d, { dim: i >= n, on: i === n - 1 }));
      const r = play([["in", "A"], ["in", "B"], ["in", "C"], ["out", ""]], l, 5, 2.2, "queue");
      Sd.queue(ctx, 360, 460, r.items, { w: 150, h: 80, cap: 5, hlFront: !r.moving, moving: r.moving });
      if (l > 5) { const k = Math.min(3, Math.floor((l - 5) / 2.2)); const log = ["enqueue A", "enqueue B", "enqueue C", "dequeue → A"]; card(ctx, 1360, 280, 340, 300, { fill: "#1F2A33", r: 12 }); log.slice(0, k + 1).forEach((s, i) => text(ctx, s, 1380, 325 + i * 44, 22, { weight: 900, color: i === k ? C.accent : "#C9D4DB" })); }
      if (l > 12) label(ctx, "pertama masuk, pertama keluar (FIFO): B maju ke depan", 960, 640);
    },
    queue_use(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DI MANA QUEUE DIPAKAI?", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      [["🖨️", "antrean cetak", ["tugas Sinta", "poster Dito"]], ["💬", "pesan chat", ["pesan 1", "pesan 2", "pesan 3"]], ["🎫", "tiket klinik", ["A-12", "A-13"]], ["⏱️", "giliran prosesor", ["musik", "chat", "game"]]].forEach(([ic, t, q], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 270 + i * 110; card(ctx, 230, y, 1460, 96, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, ic, 280, y + 62, 40, { align: "center" }); text(ctx, t, 330, y + 58, 26, { weight: 900 }); q.forEach((s, k) => { card(ctx, 700 + k * 230, y + 18, 210, 60, { fill: "#fff", stroke: k === 0 ? C.good : "#B7C4CC", lw: k === 0 ? 4 : 2, r: 10 }); text(ctx, s, 805 + k * 230, y + 56, 20, { align: "center", weight: 800 }); }); text(ctx, "depan →", 650, y + 58, 16, { align: "right", weight: 800, color: C.good }); ctx.restore(); });
      if (n >= 4) label(ctx, "adil: yang datang dulu dilayani dulu", 960, 730, { size: 26 });
    },
    tabel_pilih(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MEMILIH STRUKTUR DATA: EMPAT PERTANYAAN", 215);
      const n = reveal(l, 1.5, 2.6, 4);
      [["Data sejenis, diakses lewat nomor?", "Array", "nilai[3]"], ["Satu benda, banyak keterangan?", "Record", "siswa.nama"], ["Yang terakhir harus keluar dulu (undo)?", "Stack", "pop"], ["Yang datang dulu dilayani dulu?", "Queue", "dequeue"]].forEach(([q, w, ex], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 270 + i * 110; card(ctx, 230, y, 1460, 96, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, q, 260, y + 58, 26, { weight: 800 }); arrowIcon(ctx, "east", 1080, y + 48, 26, C.ink2); text(ctx, w, 1140, y + 58, 28, { weight: 900, color: C.kiko }); text(ctx, ex, 1660, y + 58, 22, { align: "right", weight: 800, color: C.ink2 }); ctx.restore(); });
    },
    contoh_gabungan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SATU APLIKASI, EMPAT STRUKTUR DATA: ANTREAN KLINIK", 215);
      const n = reveal(l, 1.5, 2.8, 3);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; text(ctx, "QUEUE berisi RECORD pasien", 560, 290, 22, { align: "center", weight: 900, color: C.kiko }); [["A-12", "Sinta"], ["A-13", "Dito"], ["A-14", "Rani"]].forEach(([no, nm], i) => { card(ctx, 260 + i * 200, 310, 180, 120, { fill: "#fff", stroke: i === 0 ? C.good : "#8E6BBF", lw: 3, r: 12 }); text(ctx, no, 350 + i * 200, 350, 24, { align: "center", weight: 900 }); text(ctx, ".nama " + nm, 350 + i * 200, 385, 18, { align: "center", weight: 800, color: C.ink2 }); text(ctx, ".keluhan …", 350 + i * 200, 412, 16, { align: "center", weight: 700, color: C.muted }); }); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; text(ctx, "ARRAY jadwal dokter per jam", 560, 500, 22, { align: "center", weight: 900, color: C.kiko }); Sd.array(ctx, 260, 520, ["dr. A", "dr. A", "dr. B", "dr. B"], { w: 140, h: 60 }); text(ctx, "jam 8 · 9 · 10 · 11", 560, 650, 18, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
      ctx.save(); if (n < 3) ctx.globalAlpha = 0.2; text(ctx, "STACK layar: tombol kembali", 1400, 290, 22, { align: "center", weight: 900, color: C.kiko }); Sd.stack(ctx, 1400, 640, ["Beranda", "Daftar", "Ambil nomor"], { w: 260, h: 56, cap: 4, hlTop: true }); ctx.restore();
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Simulator", "push · pop · enqueue · dequeue", (x, y) => { Sd.stack(ctx, x - 100, y + 90, ["A", "B"], { w: 120, h: 40, cap: 3, hlTop: true }); Sd.queue(ctx, x + 10, y - 60, ["A", "B"], { w: 70, h: 44, cap: 3, hlFront: true, noLabels: true }); }],
        ["Tebak isi array", "setelah serangkaian operasi", (x, y) => { Sd.array(ctx, x - 200, y - 60, [70, "?", 90, "?"], { w: 90, h: 60, hl: 2 }); text(ctx, "nilai[2] ← nilai[1] + 5", x, y + 70, 20, { align: "center", weight: 900, color: C.kiko }); }],
        ["Pilih struktur data", "delapan persoalan", (x, y) => WADAH.forEach(([ic, t], i) => { card(ctx, x - 200 + (i % 2) * 205, y - 90 + Math.floor(i / 2) * 80, 195, 66, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, t, x - 102 + (i % 2) * 205, y - 48 + Math.floor(i / 2) * 80, 22, { align: "center", weight: 900 }); })]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — tebak dulu, lalu tekan tombolnya", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
