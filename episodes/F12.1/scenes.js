/* Adegan episode F12.1: Struktur Data Kompleks dan Abstrak. Gaya diagram Fase F.
   Muat setelah kiko-core.js, kiko-devices.js, py.js (F11.0), struktur.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Py = K.py, Sk = K.struktur, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, rr, clamp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 665, w = 1100, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 30, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 215) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.2; fn(); ctx.restore(); };
  const arrow = Sk.arrow;
  const BST = [50, 30, 70, 20, 40, 60, 80];
  const HALTE = { "Pasar": [330, 330], "Sekolah": [640, 300], "Alun-alun": [880, 470], "Terminal": [380, 620], "Stasiun": [760, 660] };
  const JALUR = [["Pasar", "Sekolah"], ["Pasar", "Terminal"], ["Sekolah", "Alun-alun"], ["Sekolah", "Terminal"], ["Alun-alun", "Stasiun"], ["Terminal", "Stasiun"]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 270, 560, 170, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.4, 4);
      [["🔗", "linked list", "rantai node"], ["🗄️", "hash map", "laci berkunci"], ["🌳", "tree", "data bertingkat"], ["🕸️", "graph", "jaringan hubungan"]].forEach(([ic, t, s], i) => dim(ctx, i < n, () => { const x = 460 + i * 330; card(ctx, x, 270, 300, 280, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 150, 370, 60, { align: "center" }); text(ctx, t, x + 150, 450, 30, { align: "center", weight: 900 }); text(ctx, s, x + 150, 495, 22, { align: "center", weight: 800, color: C.ink2 }); }));
      if (n >= 4) banner(ctx, "pakai dulu yang disediakan Python, lalu intip cara membuatnya", 620, 1100);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "EPISODE SEBELUMNYA", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["E.5", "Struktur Data Standar: array, record, stack, queue"], ["F12.0", "Jembatan Kelas XII: perulangan, list, fungsi"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_rantai(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: RANTAI KARTU NAMA");
      const P = [["Rani", 320, 430, "Bayu"], ["Bayu", 1130, 390, "Putu"], ["Putu", 640, 560, "Sinta"], ["Sinta", 1510, 520, "Dito"], ["Dito", 1000, 560, "(terakhir)"]];
      const k = reveal(l, 4.0, 2.2, 5);
      P.forEach(([nm, x, y, nx], i) => { const on = k >= 1 && i === k - 1; kid(ctx, x, y, 95, i % 2 ? { hair: "long" } : {}); text(ctx, nm, x, y + 118, 22, { align: "center", weight: 900, color: on ? C.accentDark : C.ink }); card(ctx, x + 50, y - 110, 150, 56, { fill: on ? "#FFF3D6" : "#FFF9E0", stroke: on ? C.accent : "#E0B04B", lw: 3, r: 8 }); text(ctx, nx[0] === "(" ? nx : "→ " + nx, x + 125, y - 74, 20, { align: "center", weight: 900 }); });
      for (let i = 0; i < Math.min(k, 5) - 1; i++) { const [, x1, y1] = P[i], [, x2, y2] = P[i + 1]; const a = Math.atan2(y2 - y1, x2 - x1); ctx.save(); ctx.setLineDash([12, 10]); arrow(ctx, x1 + 75 * Math.cos(a), y1 + 75 * Math.sin(a), x2 - 75 * Math.cos(a), y2 - 75 * Math.sin(a), C.accent, 4); ctx.restore(); }
      text(ctx, "mulai di sini", 320, 300, 20, { align: "center", weight: 900, color: C.accentDark });
      if (k >= 4) label(ctx, "orang keempat (Sinta): harus melewati Rani, Bayu, Putu dulu", 960, 745, { size: 24 });
    },
    unplugged_loker(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: LOKER BERDASARKAN BANYAK HURUF");
      const n = reveal(l, 3.0, 3.0, 3);
      for (let i = 0; i < 5; i++) { const x = 1000 + i * 150, on = (n >= 2 && i === 4); card(ctx, x, 290, 130, 300, { fill: on ? "#FFF3D6" : "#DCE6EC", stroke: on ? C.accent : "#7B8B95", lw: on ? 5 : 3, r: 10 }); text(ctx, String(i), x + 65, 350, 40, { align: "center", weight: 900, color: on ? C.accentDark : C.ink2 }); ctx.fillStyle = "#7B8B95"; rr(ctx, x + 95, 430, 14, 50, 6); ctx.fill(); if (on && n >= 3) text(ctx, "🎒", x + 65, 540, 50, { align: "center" }); }
      text(ctx, "loker", 1370, 640, 22, { align: "center", weight: 900, color: C.ink2 });
      card(ctx, 240, 290, 660, 300, { fill: C.bg2, r: 16 });
      text(ctx, "aturan: banyak huruf ÷ 5, sisanya", 570, 340, 24, { align: "center", weight: 900, color: C.kiko });
      dim(ctx, n >= 1, () => { text(ctx, "D-i-t-o: 4 huruf", 570, 410, 30, { align: "center", weight: 900 }); text(ctx, "4 ÷ 5 = 0 sisa 4", 570, 460, 26, { align: "center", weight: 800, color: C.ink2 }); });
      dim(ctx, n >= 2, () => text(ctx, "→ loker 4", 570, 530, 34, { align: "center", weight: 900, color: C.accentDark }));
      if (n >= 3) label(ctx, "langsung ke loker 4, tidak membuka semua loker", 960, 720, { size: 26 });
    },
    adt(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ABSTRACT DATA TYPE: APA, BUKAN BAGAIMANA");
      const n = reveal(l, 1.5, 2.8, 4);
      dim(ctx, n >= 1, () => { card(ctx, 220, 270, 700, 380, { fill: "#fff", stroke: C.kiko, lw: 4, r: 18 }); text(ctx, "YANG KAMU PAKAI: OPERASI", 570, 320, 24, { align: "center", weight: 900, color: C.kiko });
        [["stack", "push · pop · peek"], ["queue", "enqueue (masuk belakang) · dequeue (keluar depan)"]].forEach(([t, s], i) => dim(ctx, n >= i + 2, () => { card(ctx, 250, 350 + i * 140, 640, 120, { fill: C.bg2, r: 14 }); text(ctx, t, 280, 400 + i * 140, 30, { weight: 900 }); text(ctx, s, 280, 440 + i * 140, 21, { weight: 800, color: C.ink2 }); })); });
      dim(ctx, n >= 4, () => { card(ctx, 1000, 270, 700, 380, { fill: "#F4F8FB", stroke: "#B7C4CC", lw: 3, r: 18 }); text(ctx, "DI BALIK LAYAR: CARA MENYIMPAN", 1350, 320, 24, { align: "center", weight: 900, color: C.ink2 });
        ["array?", "linked list?", "blok memori?"].forEach((s, i) => { ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 3; rr(ctx, 1040, 345 + i * 82, 620, 64, 12); ctx.stroke(); ctx.restore(); text(ctx, s, 1350, 386 + i * 82, 26, { align: "center", weight: 800, color: "#7B8B95" }); });
        text(ctx, "urusan pembuat library", 1350, 625, 24, { align: "center", weight: 900, color: C.accentDark }); });
    },
    library(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SUDAH DISEDIAKAN PYTHON");
      const n = reveal(l, 1.5, 2.6, 6);
      dim(ctx, n >= 1, () => { text(ctx, "list sebagai stack", 560, 270, 26, { align: "center", weight: 900, color: C.kiko }); Py.code(ctx, 220, 290, 680, [{ t: "tumpuk = []" }, { t: "tumpuk.append(3)", hl: n === 1 }, { t: "tumpuk.append(5)", hl: n === 1 }, { t: "tumpuk.pop()   # 5", hl: n === 2 }], { rh: 44, size: 22 }); Sk.stack(ctx, 460, 720, n >= 2 ? [3] : [3, 5], { w: 200, cap: 2 }); });
      dim(ctx, n >= 3, () => { text(ctx, "deque sebagai queue", 1360, 270, 26, { align: "center", weight: 900, color: C.kiko }); Py.code(ctx, 1020, 290, 680, [{ t: "from collections import deque" }, { t: "antre = deque()" }, { t: 'antre.append("Dito")', hl: n === 3 }, { t: 'antre.append("Sinta")', hl: n === 3 }, { t: 'antre.popleft()   # "Dito"', hl: n === 4 }], { rh: 44, size: 22 }); Sk.queue(ctx, 1080, 580, n >= 4 ? ["Sinta"] : ["Dito", "Sinta"], { w: 170, cap: 3 }); });
      if (n >= 5) { card(ctx, 1010, 585, 720, 148, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 }); text(ctx, "list.pop(0) menggeser semua isi ke kiri", 1370, 625, 24, { align: "center", weight: 900, color: C.bad });
        ["B", "C", "D", "E"].forEach((s, i) => { const x = 1080 + i * 150; card(ctx, x, 642, 110, 50, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 8 }); text(ctx, s, x + 55, 676, 24, { align: "center", weight: 900 }); arrow(ctx, x + 20, 712, x - 30, 712, C.bad, 3); }); }
    },
    linked_list(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LINKED LIST: NODE DAN PENUNJUK");
      const n = reveal(l, 1.5, 2.2, 6);
      const walk = n >= 4 ? clamp(Math.floor((l - 8.1) / 1.4), 0, 2) : null;
      Sk.chain(ctx, 300, 330, ["Dito", "Sinta", "Bayu"], { hl: walk, head: n >= 2, none: n >= 3, dimFrom: n >= 1 ? null : 0 });
      if (n >= 1) { text(ctx, "data", 395, 450, 20, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "penunjuk", 465, 450, 20, { align: "left", weight: 900, color: C.ink2 }); }
      dim(ctx, n >= 4, () => { Py.code(ctx, 300, 500, 760, [{ t: "n = head", hl: walk === 0 && l < 9 }, { t: "while n is not None:" }, { t: '    print(n["data"])', hl: walk != null }, { t: '    n = n["next"]' }], { rh: 44, size: 22 }); });
      if (n >= 4) Py.console(ctx, 1120, 500, 480, ["Dito", "Sinta", "Bayu"].slice(0, (walk || 0) + 1).map(s => [s, "out"]));
      if (n >= 6) label(ctx, "tiap node: dictionary {\"data\": …, \"next\": …}", 1360, 720, { size: 22, color: C.ink2 });
    },
    ll_insert(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SISIP CEPAT, AMBIL LAMBAT");
      const n = reveal(l, 1.5, 2.6, 5);
      // atas: linked list sisip Rani di antara Dito dan Sinta
      text(ctx, "linked list", 230, 290, 24, { weight: 900, color: C.kiko });
      const a = Sk.node(ctx, 230, 320, "Dito"), c = Sk.node(ctx, 760, 320, "Sinta"), d = Sk.node(ctx, 1080, 320, "Bayu");
      arrow(ctx, c.px, c.py, d.x - 4, d.py); arrow(ctx, d.px, d.py, d.px + 60, d.py, "#7B8B95"); text(ctx, "None", d.px + 70, d.py + 8, 20, { weight: 900, color: "#7B8B95" });
      if (n < 2) arrow(ctx, a.px, a.py, c.x - 4, c.py);
      if (n >= 1) { const r = Sk.node(ctx, 495, 440, "Rani", { fresh: true }); if (n >= 1) arrow(ctx, r.px, r.py, c.x + 40, c.y + Sk.NH + 4, C.good); if (n >= 2) arrow(ctx, a.px, a.py, r.x + 40, r.y - 4, C.good); }
      if (n >= 2) label(ctx, "cukup 2 penunjuk berubah", 1060, 490, { size: 24, color: C.good });
      // bawah kiri: ambil isi keseribu
      dim(ctx, n >= 3, () => { card(ctx, 230, 580, 700, 120, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "ambil isi keseribu: head → … → node ke-1000", 580, 625, 22, { align: "center", weight: 900, color: C.bad }); text(ctx, "langkah: " + (n >= 3 ? Math.min(1000, Math.max(1, Math.floor((l - 6.7) * 160))) : 0), 580, 672, 26, { align: "center", weight: 900 }); });
      dim(ctx, n >= 4, () => { card(ctx, 990, 580, 700, 120, { fill: C.bg2, r: 14 }); text(ctx, "list Python: nilai[999] langsung", 1340, 625, 22, { align: "center", weight: 900, color: C.good }); text(ctx, "tetapi insert(0, …) menggeser semuanya", 1340, 668, 22, { align: "center", weight: 900, color: C.bad }); });
    },
    hash_map(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "HASH MAP: KUNCI → NOMOR LACI");
      const n = reveal(l, 2.0, 2.6, 5);
      dim(ctx, n >= 1, () => { card(ctx, 220, 290, 200, 80, { fill: "#fff", stroke: C.kiko, lw: 4, r: 14 }); text(ctx, "\"teh\"", 320, 342, 30, { align: "center", weight: 900, color: C.kiko }); text(ctx, "kunci", 320, 400, 20, { align: "center", weight: 900, color: C.ink2 }); });
      dim(ctx, n >= 2, () => { arrow(ctx, 430, 330, 500, 330); card(ctx, 510, 270, 300, 120, { fill: "#F4F0FA", stroke: "#8E6BBF", lw: 4, r: 16 }); text(ctx, "fungsi hash", 660, 318, 26, { align: "center", weight: 900, color: "#8E6BBF" }); text(ctx, "contoh: banyak huruf % 5", 660, 356, 18, { align: "center", weight: 800, color: C.ink2 }); arrow(ctx, 820, 330, 900, 330); text(ctx, "3", 930, 342, 40, { align: "center", weight: 900, color: C.accentDark }); });
      Sk.buckets(ctx, 1080, 260, 5, { 0: [["bakso", 9]], 2: [["es", 20]], 3: [["teh", 12, n >= 4]], 4: [["roti", 5]] }, { hl: n >= 3 ? 3 : null, w: 560, h: 72 });
      dim(ctx, n >= 4, () => { Py.code(ctx, 220, 470, 760, [{ t: 'stok = {"teh": 12, "roti": 5, "es": 20, "bakso": 9}' }, { t: 'stok["teh"]   # 12', hl: true }], { rh: 44, size: 20 }); });
      if (n >= 5) label(ctx, "Python memakai rumus hash yang jauh lebih rumit", 600, 700, { size: 22, color: C.ink2 });
    },
    collision(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TABRAKAN (COLLISION): DUA KUNCI, SATU LACI");
      const n = reveal(l, 1.5, 2.6, 5);
      const isi = { 0: [["Sinta", "XII A"]], 4: [["Dito", "XII B", n >= 5 ? "bad" : false]] }; if (n >= 2) isi[4].push(["Kiko", "robot", n >= 5]);
      Sk.buckets(ctx, 1000, 260, 5, isi, { hl: n >= 1 ? 4 : null, w: 680, h: 72 });
      [["Sinta", 5, 0], ["Dito", 4, 4], ["Kiko", 4, 4]].forEach(([k, len, idx], i) => dim(ctx, i < 2 || n >= 1, () => { card(ctx, 220, 290 + i * 100, 660, 80, { fill: i === 2 ? "#FFF3D6" : C.bg2, stroke: i === 2 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, k + ": " + len + " huruf → " + len + " % 5 = " + idx, 250, 342 + i * 100, 26, { weight: 900 }); }));
      if (n >= 3) { card(ctx, 220, 600, 660, 110, { fill: C.bg2, r: 14 }); text(ctx, "cari Kiko: buka laci 4,", 550, 645, 24, { align: "center", weight: 900 }); text(ctx, "cocokkan kunci: Dito ✕, Kiko ✓", 550, 685, 24, { align: "center", weight: 900, color: C.good }); }
    },
    tree(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TREE: DATA BERTINGKAT");
      const n = reveal(l, 2.0, 2.4, 5);
      const T = { "Dokumen": [700, 300], "Sekolah": [440, 460], "Foto": [960, 460], "Informatika": [300, 620], "Matematika": [580, 620], "Liburan": [960, 620] };
      const E = [["Dokumen", "Sekolah"], ["Dokumen", "Foto"], ["Sekolah", "Informatika"], ["Sekolah", "Matematika"], ["Foto", "Liburan"]];
      E.forEach(([a, c]) => { ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(T[a][0], T[a][1] + 36); ctx.lineTo(T[c][0], T[c][1] - 36); ctx.stroke(); });
      const role = id => id === "Dokumen" ? "root" : ["Informatika", "Matematika", "Liburan"].includes(id) ? "leaf" : "child";
      Object.entries(T).forEach(([id, [x, y]]) => { const r = role(id); const on = (n >= 2 && r === "root") || (n >= 3 && r === "child") || (n >= 4 && r === "leaf"); card(ctx, x - 120, y - 36, 240, 72, { fill: on ? (r === "root" ? "#FFF3D6" : r === "leaf" ? C.goodBg : "#E5F1F6") : "#fff", stroke: on ? (r === "root" ? C.accent : r === "leaf" ? C.good : C.kiko) : "#B7C4CC", lw: 3, r: 12 }); text(ctx, "📁 " + id, x, y + 9, 22, { align: "center", weight: 900 }); });
      [["root", "node paling atas", C.accentDark, 2], ["child", "node di bawah suatu node", C.kiko, 3], ["leaf", "node tanpa child", C.good, 4]].forEach(([t, s, col, k], i) => dim(ctx, n >= k, () => { card(ctx, 1220, 290 + i * 120, 480, 100, { fill: C.bg2, r: 14 }); text(ctx, t, 1250, 336 + i * 120, 28, { weight: 900, color: col }); text(ctx, s, 1250, 370 + i * 120, 20, { weight: 800, color: C.ink2 }); }));
      if (n >= 1) text(ctx, "contoh: folder di laptop", 1460, 680, 22, { align: "center", weight: 900, color: C.ink2 });
    },
    bst(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BINARY SEARCH TREE: KECIL KE KIRI, BESAR KE KANAN");
      const k = reveal(l, 3.5, 1.3, 7); const searching = l > 14;
      const path = searching ? Sk.bstPath(BST, 60).path.slice(0, clamp(Math.floor((l - 14) / 1.6) + 1, 1, 3)) : null;
      Sk.bst(ctx, 800, 310, BST, { n: k, path, spread: 330, dy: 130, fresh: !searching });
      text(ctx, "urutan sisip: " + BST.slice(0, k).join(", "), 230, 270, 22, { weight: 900, color: C.ink2 });
      dim(ctx, true, () => { card(ctx, 1380, 560, 330, 150, { fill: C.bg2, r: 14 }); text(ctx, "aturan", 1545, 600, 22, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "< ke kiri", 1545, 640, 24, { align: "center", weight: 900 }); text(ctx, "> ke kanan", 1545, 680, 24, { align: "center", weight: 900 }); });
      if (searching) { card(ctx, 1380, 290, 330, 200, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 14 }); text(ctx, "cari 60", 1545, 335, 26, { align: "center", weight: 900, color: C.accentDark }); text(ctx, path.join(" → "), 1545, 395, 26, { align: "center", weight: 900 }); text(ctx, path.length + " langkah", 1545, 455, 30, { align: "center", weight: 900, color: path.length === 3 ? C.good : C.ink }); }
    },
    graph(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "GRAPH: NODE DAN EDGE");
      const n = reveal(l, 1.5, 2.6, 5);
      Sk.graph(ctx, HALTE, JALUR, { hlNodes: n >= 4 ? ["Pasar"] : [], hlEdges: n >= 4 ? [["Pasar", "Sekolah"], ["Pasar", "Terminal"]] : [], r: 62, size: 18 });
      if (n >= 1) { text(ctx, "node: halte", 300, 735, 20, { weight: 900, color: C.kiko }); text(ctx, "edge: jalur angkot", 520, 735, 20, { weight: 900, color: C.ink2 }); }
      dim(ctx, n >= 3, () => Py.code(ctx, 1020, 280, 680, [{ t: "halte = {" }, { t: '  "Pasar": ["Sekolah", "Terminal"],', hl: n >= 4 }, { t: '  "Sekolah": ["Pasar", "Alun-alun",' }, { t: '              "Terminal"],' }, { t: '  "Alun-alun": ["Sekolah", "Stasiun"],' }, { t: '  "Terminal": ["Pasar", "Sekolah",' }, { t: '               "Stasiun"],' }, { t: '  "Stasiun": ["Alun-alun", "Terminal"]' }, { t: "}" }], { rh: 40, size: 18 }));
      if (n >= 5) label(ctx, "rute terpendek: F12.2", 1360, 720, { size: 24 });
    },
    pilih(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PILIH SESUAI KEBUTUHAN");
      const rows = [["batalkan langkah terakhir (undo)", "stack", "🥞"], ["layani sesuai urutan datang", "queue", "🚶"], ["sering sisip di tengah", "linked list", "🔗"], ["cari lewat kunci", "dictionary", "🗄️"], ["data terurut, cepat dicari", "binary search tree", "🌳"], ["hubungan dan rute", "graph", "🕸️"]];
      const n = reveal(l, 2.0, 2.4, 6);
      rows.forEach(([need, st, ic], i) => dim(ctx, i < n, () => { const x = i < 3 ? 220 : 980, y = 270 + (i % 3) * 140; card(ctx, x, y, 720, 120, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, need, x + 26, y + 46, 22, { weight: 800, color: C.ink2 }); text(ctx, ic + "  " + st, x + 26, y + 92, 30, { weight: 900 }); }));
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Binary search tree", "sisipkan dan cari, lihat jalurnya", (x, y) => { ctx.save(); ctx.translate(x, y - 120); ctx.scale(0.42, 0.42); Sk.bst(ctx, 0, 0, BST, { path: [50, 70, 60], spread: 360, dy: 130 }); ctx.restore(); }],
        ["Pemilih struktur data", "enam kasus, enam pilihan", (x, y) => [["undo", "stack"], ["urutan datang", "queue"], ["cari lewat kunci", "dictionary"]].forEach(([a, s], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 20, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 20, { align: "right", weight: 900, color: C.kiko }); })],
        ["Pelacak stack dan queue", "tebak isinya setiap langkah", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 110); ctx.scale(0.7, 0.7); Py.code(ctx, 0, 0, 600, [{ t: "s.append(3)" }, { t: "s.append(5)" }, { t: "s.pop()", hl: true }], { rh: 44, size: 24 }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 270, 500, 400, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 320, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 332, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 332, 24, { weight: 900 }); text(ctx, t2, x - 160, 366, 19, { weight: 700, color: C.ink2 }); draw(x, 530); });
      text(ctx, "lalu di komputer: deque untuk antrean, dictionary untuk hitung kata, linked list buatan sendiri", 960, 725, 24, { align: "center", color: C.ink2, weight: 800 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
