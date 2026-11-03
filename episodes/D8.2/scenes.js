/* Adegan episode D8.2: Memecahkan Persoalan dengan Data Kecil. Muat setelah kiko-core.js, kiko-devices.js, kartu.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.kartu, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const RAND = [72, 55, 90, 85, 60, 78, 95, 68];
  const SORTED = [55, 60, 68, 72, 78, 85, 90, 95];
  const FIVE = [78, 55, 90, 71, 62];
  const ROWS = [["Dito", 65, "belum"], ["Sinta", 88, "-"], ["Rani", 65, "sudah"], ["Bayu", 58, "belum"], ["Tari", 72, "-"], ["Agus", 69, "belum"], ["Lina", 91, "-"], ["Putri", 60, "sudah"]];
  // langkah-langkah selection sort untuk FIVE: [{arr, i(posisi), j(kandidat), compare, swap}]
  function selectionSteps(a) { const arr = a.slice(); const steps = []; let cmp = 0, mv = 0; for (let i = 0; i < arr.length - 1; i++) { let m = i; for (let j = i + 1; j < arr.length; j++) { cmp++; steps.push({ arr: arr.slice(), i, j, m, cmp, mv, kind: "cmp" }); if (arr[j] < arr[m]) m = j; } if (m !== i) { [arr[i], arr[m]] = [arr[m], arr[i]]; mv++; } steps.push({ arr: arr.slice(), i, j: -1, m: i, cmp, mv, kind: "mv" }); } steps.push({ arr: arr.slice(), i: arr.length, j: -1, m: -1, cmp, mv, kind: "done" }); return steps; }
  const SEL = selectionSteps(FIVE);

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const jobs = [["Mencari", "🔍"], ["Mengurutkan", "↕"], ["Mengelompokkan", "▦"], ["Menyaring", "⏷"]];
      const n = reveal(l, 0.6, 1.1, 4);
      jobs.forEach(([t, ic], i) => { const x = 700 + i * 280; ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.15; card(ctx, x - 120, 280, 240, 260, { fill: C.bg2 }); text(ctx, ic, x, 400, 70, { align: "center", color: C.kiko }); text(ctx, t, x, 480, 24, { align: "center", weight: 900 }); ctx.restore(); });
      if (l > 6) { Q.counter(ctx, 960, 600, "1, 2, 3…", "hitung langkahnya", { w: 420 }); }
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D8.1", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Lembar Kerja Pengolah Data", 960, 500, 48, { align: "center", weight: 700, color: C.ink2 });
      ["Sel dan rumus", "SUM, AVERAGE", "Urutkan"].forEach((s, i) => { card(ctx, 480 + i * 340, 580, 300, 120, { fill: C.bg2 }); text(ctx, s, 630 + i * 340, 652, 30, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_cards(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const k = clamp(Math.floor((l - 1.5) / 0.9), 0, 4); const open = new Set([...Array(k).keys()]);
      Q.row(ctx, 300, 330, RAND, { open, index: true, hl: k >= 4 ? { 3: C.good } : {} });
      Q.counter(ctx, 1380, 330, k, "langkah");
      text(ctx, "cari kartu bernilai 85", 1510, 500, 28, { align: "center", weight: 900 });
      if (k >= 4) label(ctx, "ketemu di kartu ke-4", 1510, 560, { size: 26, color: C.good });
      if (l > 7) label(ctx, "satu kartu dibuka = satu langkah", 960, 800, { size: 26, color: C.ink2 });
    },
    unplugged_sorted(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const k = clamp(Math.floor((l - 1.5) / 1.4), 0, 3); // 0: tertutup, 1: buka tengah (idx 3: 72), 2: buang kiri, buka idx 5 (85) ketemu
      const open = new Set(); if (k >= 1) open.add(3); if (k >= 2) open.add(5);
      const dim = k >= 2 ? [0, 1, 2, 3] : [];
      Q.row(ctx, 300, 330, SORTED, { open, index: true, dim, hl: k >= 2 ? { 5: C.good } : k >= 1 ? { 3: C.accent } : {} });
      text(ctx, "kartu sudah urut: 55 … 95", 960, 300, 26, { align: "center", weight: 800, color: C.ink2 });
      Q.counter(ctx, 1380, 330, Math.min(k, 2), "langkah");
      if (k >= 1) label(ctx, "buka tengah: 72, lebih kecil dari 85", 1510, 500, { size: 24 });
      if (k >= 2) { label(ctx, "buang setengah kiri", 1510, 540, { size: 24, color: C.bad }); label(ctx, "buka tengah sisanya: 85, ketemu!", 1510, 580, { size: 24, color: C.good }); }
      if (k >= 3) banner(ctx, "2 langkah, bukan 4: data urut lebih cepat dicari", 745, 1000, { fill: C.goodBg, stroke: C.good, color: C.good, size: 30 });
    },

    search_linear(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MENCARI 85 DI KARTU ACAK", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const target = [72, 55, 90, 60, 78, 68, 95, 85]; const k = clamp(Math.floor((l - 1.0) / 0.6), 0, 8); const open = new Set([...Array(k).keys()]);
      Q.row(ctx, 300, 330, target, { open, index: true, hl: k >= 8 ? { 7: C.good } : {} });
      Q.counter(ctx, 1380, 330, k, "langkah", { stroke: k >= 8 ? C.bad : C.accent, color: k >= 8 ? C.bad : C.accentDark, fill: k >= 8 ? C.badBg : "#FFF3D6" });
      if (k >= 8) label(ctx, "paling sial: kartu terakhir, 8 langkah", 1510, 500, { size: 24, color: C.bad });
      if (l > 7) banner(ctx, "acak: terpaksa satu per satu dari kiri", 745, 900);
    },
    search_binary(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MENCARI 85 DI KARTU URUT", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const k = clamp(Math.floor((l - 1.0) / 1.5), 0, 3);
      const open = new Set(); const dim = []; const hl = {};
      if (k >= 1) { open.add(3); hl[3] = C.accent; } if (k >= 2) { dim.push(0, 1, 2, 3); open.add(5); hl[5] = C.good; }
      Q.row(ctx, 300, 330, SORTED, { open, index: true, dim, hl });
      Q.counter(ctx, 1380, 330, Math.min(k, 2), "langkah", { stroke: C.good, color: C.good, fill: C.goodBg });
      const notes = ["buka tengah (ke-4): 72 < 85", "buang kiri, buka tengah sisanya: 85 ✓"]; notes.forEach((s, i) => { if (k >= i + 1) text(ctx, (i + 1) + ". " + s, 1380, 500 + i * 44, 24, { weight: 800, color: i ? C.good : C.ink }); });
      if (k >= 3) banner(ctx, "belah dua, buang setengah: 8 kartu ≤ 3 langkah", 745, 1000, { fill: C.goodBg, stroke: C.good, color: C.good, size: 30 });
    },

    sort_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MENGURUTKAN: CARA 1", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      Q.row(ctx, 400, 300, FIVE, { index: true, w: 130, h: 160, gap: 24, hl: l > 2 ? { 1: C.good } : {} });
      const steps = ["cari kartu terkecil", "taruh di paling depan", "ulangi untuk sisanya"]; const n = reveal(l, 1.0, 1.6, 3);
      steps.forEach((s, i) => { if (i < n) { card(ctx, 420 + i * 380, 560, 340, 90, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, (i + 1) + ". " + s, 590 + i * 380, 615, 26, { align: "center", weight: 900 }); } });
      if (n >= 3) banner(ctx, "caranya jelas: bisa diikuti siapa saja, bahkan mesin", 700, 1000, { size: 30 });
    },
    sort_run(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const si = clamp(Math.floor((l - 0.8) / 0.55), 0, SEL.length - 1); const st = SEL[si];
      const hl = {}; if (st.kind === "cmp") { hl[st.m] = C.accent; hl[st.j] = C.kiko; } else if (st.kind === "mv") hl[st.i] = C.good;
      const fills = {}; for (let i = 0; i < Math.min(st.i, 5); i++) fills[i] = C.goodBg;
      Q.row(ctx, 400, 300, st.arr, { index: true, w: 130, h: 160, gap: 24, hl, fills });
      Q.counter(ctx, 1220, 540, st.cmp, "membandingkan", { w: 240 }); Q.counter(ctx, 1480, 540, st.mv, "memindahkan", { w: 240, fill: C.goodBg, stroke: C.good, color: C.good });
      text(ctx, st.kind === "done" ? "selesai: urut dari kecil ke besar" : st.kind === "mv" ? "terkecil dipindah ke depan" : "bandingkan kandidat terkecil dengan kartu berikutnya", 700, 560, 24, { align: "center", weight: 800, color: C.ink2 });
      if (st.kind === "done") banner(ctx, "10 kali membandingkan, " + st.mv + " kali memindahkan", 745, 900, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    sort_compare(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "CARA 2: BANDINGKAN TETANGGA, TUKAR BILA TERBALIK", 960, 230, 32, { align: "center", color: C.accentDark, weight: 800 });
      const k = clamp(Math.floor((l - 0.8) / 0.7), 0, 4); const arr = FIVE.slice(); let cmp = 0, sw = 0;
      for (let j = 0; j < k; j++) { cmp++; if (arr[j] > arr[j + 1]) { [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; sw++; } }
      const hl = {}; if (k < 4) { hl[k] = C.accent; hl[k + 1] = C.accent; }
      Q.row(ctx, 400, 300, arr, { index: true, w: 130, h: 160, gap: 24, hl });
      Q.counter(ctx, 1220, 540, cmp, "membandingkan", { w: 240 }); Q.counter(ctx, 1480, 540, sw, "menukar", { w: 240, fill: C.goodBg, stroke: C.good, color: C.good });
      text(ctx, k < 4 ? "geser ke kanan, satu pasang tiap kali (putaran 1)" : "putaran 1 selesai: yang terbesar sampai di ujung; ulangi putaran berikutnya", 700, 560, 24, { align: "center", weight: 800, color: C.ink2 });
      if (l > 6) banner(ctx, "hasil akhir sama, jumlah langkah bisa beda: hitung!", 745, 1000, { size: 30 });
    },

    group_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MENGELOMPOKKAN KE TIGA TUMPUKAN", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.4, 3);
      [["di bawah 70", 0], ["70 – 84", 1], ["85 ke atas", 2]].forEach(([t, i]) => { if (i < n) Q.pile(ctx, 400 + i * 400, 300, 340, t, 0, { hl: i === n - 1 }); });
      if (n >= 3) label(ctx, "setiap kartu masuk ke tepat satu tumpukan", 960, 680, { size: 26, color: C.ink2 });
    },
    group_count(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const k = clamp(Math.floor((l - 0.6) / 0.22), 0, 32); const counts = [0, 0, 0]; const seq = [0, 1, 1, 2, 0, 1, 0, 1, 1, 2, 0, 1, 2, 0, 1, 1, 0, 1, 2, 0, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1, 2];
      for (let i = 0; i < k; i++) counts[seq[i]]++;
      [["di bawah 70", 0], ["70 – 84", 1], ["85 ke atas", 2]].forEach(([t, i]) => Q.pile(ctx, 400 + i * 400, 280, 340, t, counts[i], {}));
      Q.counter(ctx, 200, 300, k, "kartu dilihat", { w: 180 });
      if (k < 32) { const dest = 400 + seq[k] * 400 + 170; const u = (l - 0.6) / 0.22 - k; Q.card(ctx, lerp(290, dest - 50, ease(u)), lerp(450, 420, ease(u)), 100, 70, "?", { face: false }); }
      if (k >= 32) banner(ctx, "32 kartu, 32 langkah → 10, 15, 7", 745, 900, { fill: C.goodBg, stroke: C.good, color: C.good });
    },

    filter_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.condition(ctx, 200, 240, 520, ["nilai di bawah 70", "DAN", "belum remedi"], {});
      const n = reveal(l, 1.5, 1.0, 8);
      const pass = ROWS.map(r => r[1] < 70 && r[2] === "belum");
      ROWS.slice(0, n).forEach((r, i) => { const x = 800 + (i % 4) * 230, y = 260 + Math.floor(i / 4) * 200; Q.card(ctx, x, y, 190, 150, r[1], { name: r[0] + " · " + r[2], hl: pass[i] ? C.good : C.bad, fill: pass[i] ? C.goodBg : "#F4F6F5", color: pass[i] ? C.good : C.muted, size: 40 }); });
      if (n >= 8) banner(ctx, "lolos saringan: Dito, Bayu, Agus", 745, 800, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    filter_sheet(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const on = l > 2.5; const hide = on ? ROWS.map((r, i) => r[1] < 70 ? -1 : i).filter(i => i >= 0) : [];
      Q.table(ctx, 240, 230, ROWS, { hide, filterCol: on ? 1 : -1, hl: on ? ROWS.map((r, i) => r[1] < 70 ? i : -1).filter(i => i >= 0) : [] });
      card(ctx, 820, 260, 520, 200, { fill: C.bg2 }); text(ctx, "Filter: Nilai", 850, 310, 28, { weight: 900 }); text(ctx, "kurang dari  70", 850, 360, 28, { weight: 800, color: C.accentDark }); card(ctx, 850, 390, 160, 50, { fill: on ? C.accent : "#fff", stroke: C.accent, lw: 3, r: 10 }); text(ctx, "Terapkan", 930, 423, 24, { align: "center", weight: 900 });
      if (on) { D.pointer(ctx, 940, 430, 40); label(ctx, "baris lain disembunyikan, bukan dihapus", 1400, 560, { size: 26 }); }
      if (l > 6) banner(ctx, "datanya tetap ada, hanya tidak ditampilkan", 745, 900);
    },

    combine(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "3 MURID NILAI TERENDAH YANG BELUM REMEDI", 960, 230, 32, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.2, 1.6, 3);
      const steps = [["Saring", "belum remedi → 12 kartu"], ["Urutkan", "dari terkecil"], ["Ambil 3", "teratas"]];
      steps.forEach(([t, s], i) => { if (i < n) { card(ctx, 300 + i * 460, 300, 400, 200, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 16 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(350 + i * 460, 350, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 350 + i * 460, 360, 26, { align: "center", color: "#fff", weight: 900 }); text(ctx, t, 400 + i * 460, 362, 32, { weight: 900 }); text(ctx, s, 330 + i * 460, 440, 24, { weight: 700, color: C.ink2 }); if (i) arrowIcon(ctx, "right", 270 + i * 460, 400, 36, C.ink2); } });
      if (n >= 3) { Q.row(ctx, 560, 560, [58, 60, 65], { w: 110, h: 130, gap: 20, names: ["Bayu", "Putri", "Dito"], hl: { 0: C.good, 1: C.good, 2: C.good } }); label(ctx, "jawaban Bu Guru", 1200, 640, { size: 28, color: C.good }); }
    },
    combine_steps(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "KENAPA SARING DULU?", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      card(ctx, 200, 290, 740, 360, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, "urutkan 32 kartu, baru saring", 570, 350, 28, { align: "center", weight: 900, color: C.bad }); Q.counter(ctx, 440, 400, 496, "kali membandingkan", { w: 260, fill: "#fff", stroke: C.bad, color: C.bad }); text(ctx, "banyak langkah terbuang untuk kartu yang akhirnya dibuang", 570, 580, 22, { align: "center", weight: 700, color: C.ink2 });
      if (l > 3) { card(ctx, 980, 290, 740, 360, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "saring dulu, lalu urutkan 12 kartu", 1350, 350, 28, { align: "center", weight: 900, color: C.good }); Q.counter(ctx, 1220, 400, 32 + 66, "kali membandingkan", { w: 260, fill: "#fff", stroke: C.good, color: C.good }); text(ctx, "32 untuk menyaring + 66 untuk mengurutkan", 1350, 580, 22, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 6.5) banner(ctx, "urutan pekerjaan menentukan jumlah langkah: jurus algoritma", 745, 1100, { size: 30 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Cari dengan langkah sedikit", "kartu acak vs kartu urut", (x, y) => { Q.row(ctx, x - 200, y - 70, [55, 68, 78, 90], { w: 80, h: 100, gap: 12, open: new Set([1]), hl: { 1: C.accent } }); }],
        ["Urutkan, hitung langkah", "dua cara, bandingkan", (x, y) => { Q.row(ctx, x - 200, y - 90, [78, 55, 90], { w: 80, h: 100, gap: 12 }); Q.counter(ctx, x + 60, y - 80, 7, "langkah", { w: 150 }); }],
        ["Saring dan kelompokkan", "jawab pertanyaan Bu Guru", (x, y) => { Q.condition(ctx, x - 200, y - 90, 400, ["nilai < 70", "DAN", "belum remedi"], {}); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 630, 26, { align: "center", weight: 900 }); text(ctx, t2, x, 668, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu coba dengan data kelasmu di lembar kerja", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
