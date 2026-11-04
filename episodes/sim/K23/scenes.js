/* K23 Simulasi konsep: Binary Search Tree dan Hash Map (episode induk F12.1). Gaya diagram Fase F.
   Tata letak pohon: x = peringkat nilai (in-order), y = kedalaman; jadi pohon miring tampil sebagai tangga.
   Fungsi hash sama dengan F12.1: banyak huruf % 5 (laci 0–4); tabrakan disimpan berdampingan di laci yang sama.
   Nilai dicek dengan Python: 50,30,70,20,40,60,80 → tinggi 3; 20..80 urut → tinggi 7; cari 80: 3 lawan 7 langkah;
   65 → kanan 60; Sinta 0, Dito 4, Ayu 3, Kiko 4, Rahmat 1. Semua gambar di atas y≈830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Py = K.py, Sk = K.struktur;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const A = b => b.audio || b.dur;
  const prog = (l, b, a0, a1) => clamp((l - A(b) * a0) / (A(b) * (a1 - a0)), 0, 1);
  const panel = ctx => card(ctx, 120, 128, 1680, 694);
  const heading = (ctx, s, y = 190) => text(ctx, s, 960, y, 32, { align: "center", color: C.accentDark, weight: 900 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.18; fn(); ctx.restore(); };
  const banner = (ctx, s, y, w = 1200, opt = {}) => { card(ctx, 960 - w / 2, y, w, 76, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4, r: 16 }); text(ctx, s, 960, y + 50, opt.size || 30, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 40 }); };
  function counter(ctx, x, y, n, label, opt = {}) {
    const w = opt.w || 240; card(ctx, x, y, w, 110, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4, r: 16 });
    text(ctx, String(n), x + w / 2, y + 62, opt.size || 50, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 20 });
    text(ctx, label, x + w / 2, y + 96, 20, { align: "center", weight: 800, color: C.ink2 });
  }
  const ACAK = [50, 30, 70, 20, 40, 60, 80], URUT = [20, 30, 40, 50, 60, 70, 80];

  // ---------- binary search tree ----------
  function build(vals) {
    let root = null; const nodes = {};
    vals.forEach(v => { const nd = { v, l: null, r: null, d: 0, p: null, path: [] }; nodes[v] = nd; if (!root) { root = nd; return; }
      let c = root; while (true) { nd.path.push(c.v); const k = v < c.v ? "l" : "r"; if (c[k]) c = c[k]; else { c[k] = nd; nd.p = c; nd.side = k; nd.d = c.d + 1; break; } } });
    return { root, nodes };
  }
  const height = vals => Math.max(...vals.map(v => build(vals).nodes[v].d)) + 1;
  const subtree = (nd, out = new Set()) => { if (!nd) return out; out.add(nd.v); subtree(nd.l, out); subtree(nd.r, out); return out; };
  // gambar pohon: vals (urutan sisip), n = banyak node tampil; opt {box:{x,y,w,h}, path, hit, dimNot:Set, fresh, r, cmp:{v, at}}
  function tree(ctx, vals, n, opt = {}) {
    const box = opt.box || { x: 200, y: 280, w: 1100, h: 480 }; const full = build(vals); const hgt = height(vals);
    const sorted = vals.slice().sort((a, b) => a - b); const dx = box.w / (vals.length - 1), dy = hgt > 1 ? Math.min(160, box.h / (hgt - 1)) : 0;
    const r = opt.r || (hgt > 4 ? 34 : 42);
    const pos = v => [box.x + sorted.indexOf(v) * dx, box.y + full.nodes[v].d * dy];
    const shown = vals.slice(0, n); const onPath = v => opt.path && opt.path.includes(v);
    shown.forEach(v => { const nd = full.nodes[v]; if (!nd.p) return; const [x1, y1] = pos(nd.p.v), [x2, y2] = pos(v); const on = onPath(v) && onPath(nd.p.v);
      ctx.save(); if (opt.dimNot && !opt.dimNot.has(v)) ctx.globalAlpha = 0.18; ctx.strokeStyle = on ? C.accent : "#B7C4CC"; ctx.lineWidth = on ? 8 : 5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); });
    shown.forEach(v => { const [x, y] = pos(v); const on = onPath(v), hit = opt.hit === v, fresh = opt.fresh === v;
      ctx.save(); if (opt.dimNot && !opt.dimNot.has(v)) ctx.globalAlpha = 0.18;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = hit ? C.good : on ? "#FFF3D6" : fresh ? C.goodBg : "#fff"; ctx.fill();
      ctx.strokeStyle = hit ? C.good : on ? C.accent : fresh ? C.good : C.kiko; ctx.lineWidth = on || hit || fresh ? 6 : 4; ctx.stroke();
      text(ctx, String(v), x, y + 10, r > 38 ? 30 : 26, { align: "center", weight: 900, color: hit ? "#fff" : C.ink }); ctx.restore(); });
    if (opt.cmp) { const [x, y] = pos(opt.cmp.at); const bx = x + r + 26, by = y - r - 22; ctx.beginPath(); ctx.arc(bx, by, 30, 0, Math.PI * 2); ctx.fillStyle = C.accent; ctx.fill(); text(ctx, String(opt.cmp.v), bx, by + 9, 24, { align: "center", weight: 900, color: "#fff" }); }
    return { pos, full, hgt, dy, r };
  }
  // keadaan sisip pada unit u (tiap angka: satu unit per perbandingan + satu unit menaruh)
  function insertState(vals, from, upto, p) {
    const full = build(vals); const units = []; for (let i = from; i < upto; i++) { const nd = full.nodes[vals[i]]; nd.path.forEach(c => units.push({ i, at: c })); units.push({ i, place: true }); }
    const k = Math.min(units.length - 1, Math.floor(p * units.length)); const u = units[k];
    return { n: u.place ? u.i + 1 : u.i, cur: vals[u.i], at: u.at, place: u.place, nd: full.nodes[vals[u.i]], all: p >= 1 };
  }
  function orderChips(ctx, x, y, vals, cur, done, opt = {}) {
    const S = opt.s || 56, G = opt.g || 5;
    text(ctx, opt.label || "urutan sisip:", x, y - 14, 22, { weight: 900, color: C.ink2 });
    vals.forEach((v, i) => { const cx = x + i * (S + G); const now = i === cur, ok = i < done; card(ctx, cx, y, S, S, { fill: now ? "#FFF3D6" : ok ? C.goodBg : "#F4F6F5", stroke: now ? C.accent : ok ? C.good : "#D7E2DC", lw: 3, r: 10 }); text(ctx, String(v), cx + S / 2, y + S / 2 + S * 0.17, S * 0.45, { align: "center", weight: 900, color: ok || now ? C.ink : C.muted }); });
  }
  // ---------- hash map ----------
  const ORANG = { Sinta: "XII A", Dito: "XII B", Ayu: "XI C", Kiko: "robot", Bayu: "XI A", Rudi: "X B", Lina: "XII C" };
  function drawers(ctx, x, y, w, isi, opt = {}) {
    const h = opt.h || 96, gap = 12;
    for (let i = 0; i < 5; i++) { const by = y + i * (h + gap), on = opt.hl === i; card(ctx, x, by, w, h, { fill: on ? "#FFF3D6" : "#F4F8FB", stroke: on ? C.accent : "#B7C4CC", lw: on ? 5 : 3, r: 12 });
      ctx.fillStyle = on ? C.accent : C.kiko; rr(ctx, x + 10, by + 10, 66, h - 20, 10); ctx.fill(); text(ctx, String(i), x + 43, by + h / 2 + 12, 32, { align: "center", weight: 900, color: "#fff" });
      let cx = x + 92; (isi[i] || []).forEach(([k, st]) => { const s = opt.keysOnly ? k : k + ": " + ORANG[k]; const fs = opt.fs || 24; ctx.font = "900 " + fs + "px Inter"; const iw = ctx.measureText(s).width + 36;
        card(ctx, cx, by + 14, iw, h - 28, { fill: st === "bad" ? C.badBg : st === "good" ? C.goodBg : st === "new" ? "#FFF9E0" : "#fff", stroke: st === "bad" ? C.bad : st === "good" ? C.good : st === "new" ? C.accent : "#B7C4CC", lw: 3, r: 10 });
        text(ctx, s, cx + iw / 2, by + h / 2 + fs * 0.37, fs, { align: "center", weight: 900 }); cx += iw + 10; }); }
    text(ctx, "laci", x + 43, y - 14, 20, { align: "center", weight: 900, color: C.ink2 });
  }
  function hashCalc(ctx, x, y, name, u) {
    card(ctx, x, y, 520, 400, { fill: C.bg2, r: 18 });
    text(ctx, "kunci", x + 30, y + 46, 22, { weight: 900, color: C.ink2 });
    const n = name.length; [...name].forEach((ch, i) => { const on = u > 0.1 + i * 0.05; card(ctx, x + 30 + i * 70, y + 66, 60, 70, { fill: on ? "#fff" : "#F4F6F5", stroke: on ? C.kiko : "#D7E2DC", lw: 3, r: 10 }); text(ctx, ch, x + 60 + i * 70, y + 112, 32, { align: "center", weight: 900 }); if (on) text(ctx, String(i + 1), x + 60 + i * 70, y + 160, 20, { align: "center", weight: 900, color: C.kiko }); });
    if (u > 0.4) text(ctx, n + " huruf", x + 30, y + 220, 34, { weight: 900 });
    if (u > 0.55) text(ctx, n + " ÷ 5 = " + Math.floor(n / 5) + " sisa " + (n % 5), x + 30, y + 280, 32, { weight: 900, color: "#8E6BBF" });
    if (u > 0.7) { card(ctx, x + 30, y + 310, 460, 70, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 12 }); text(ctx, "→ laci " + (n % 5), x + 260, y + 357, 34, { align: "center", weight: 900, color: C.accentDark }); }
  }

  // ---------- tanya / tebak ----------
  const VQ = {
    1: { title: "MENYISIPKAN", q: "Di mana 40 berada setelah ketujuh angka disisipkan?", draw: (ctx, x, y) => orderChips(ctx, x, y + 60, ACAK, -1, 7, { label: "urutan sisip:", s: 72, g: 8 }) },
    2: { title: "URUTAN TERURUT", q: "Angka yang sama, tetapi sudah urut. Seperti apa bentuk pohonnya?", draw: (ctx, x, y) => orderChips(ctx, x, y + 60, URUT, -1, 7, { label: "urutan sisip:", s: 72, g: 8 }) },
    3: { title: "MENCARI", q: "Cari 80. Berapa langkah di pohon seimbang dan di pohon miring?", draw: (ctx, x, y) => { tree(ctx, ACAK, 7, { box: { x: x + 10, y: y + 10, w: 240, h: 150 }, r: 16 }); tree(ctx, URUT, 7, { box: { x: x + 300, y: y - 10, w: 240, h: 200 }, r: 13 }); ctx.fillStyle = "#000"; } },
    4: { title: "HASH MAP", q: "Sinta punya 5 huruf. Di laci nomor berapa Sinta disimpan?", draw: (ctx, x, y) => { card(ctx, x, y + 10, 300, 90, { fill: "#fff", stroke: C.kiko, lw: 4, r: 14 }); text(ctx, "\"Sinta\"", x + 150, y + 70, 40, { align: "center", weight: 900, color: C.kiko }); text(ctx, "banyak huruf % 5", x, y + 170, 30, { weight: 900, color: "#8E6BBF" }); } },
    5: { title: "TABRAKAN", q: "Kiko punya 4 huruf, sama dengan Dito. Apa yang terjadi?", draw: (ctx, x, y) => { card(ctx, x, y + 10, 260, 90, { fill: "#fff", stroke: C.kiko, lw: 4, r: 14 }); text(ctx, "\"Kiko\"", x + 130, y + 70, 40, { align: "center", weight: 900, color: C.kiko }); text(ctx, "laci 4 sudah berisi Dito", x, y + 170, 28, { weight: 900, color: C.ink2 }); } }
  };
  function tanya(ctx, b, l, tebak) {
    const v = VQ[b.v]; panel(ctx);
    text(ctx, "VARIASI " + b.v, 200, 200, 30, { weight: 900, color: C.kiko }); text(ctx, v.title, 200, 240, 24, { weight: 800, color: C.ink2 });
    card(ctx, 180, 268, 640, 300, { fill: C.bg2, r: 22 }); v.draw(ctx, 220, 320);
    para(ctx, v.q, 880, 320, 40, 840, { weight: 800, lh: 1.3 });
    if (!tebak) { kiko(ctx, 960, 690, 110, 0, { mood: "happy" }); text(ctx, "Menurutmu?", 1100, 700, 40, { weight: 900, color: C.accentDark }); return; }
    const opts = b.pilih || []; const ow = Math.min(440, (1440 - (opts.length - 1) * 30) / opts.length);
    text(ctx, "TEBAK DULU", 200, 640, 28, { weight: 900, color: C.accentDark });
    opts.forEach((o, i) => { const x = 200 + i * (ow + 30), u = ease((l - 0.3 - i * 0.35) / 0.4); ctx.save(); ctx.globalAlpha = u; card(ctx, x, 664, ow, 100, { fill: "#FFF9E0", stroke: C.accent, lw: 4, r: 18 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 50, 714, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, "ABC"[i], x + 50, 726, 32, { align: "center", weight: 900, color: "#fff" });
      text(ctx, o, x + 96, 728, 36, { weight: 900, fit: ow - 110 }); ctx.restore(); });
    const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(1690, 220, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1690, 220, 40, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
  }

  Object.assign(K.SCENES, {
    k23_tujuan(ctx, b, l) {
      panel(ctx);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 220, 220, 30, { weight: 900, color: C.accentDark });
      ["menyisipkan angka ke BST", "mencari sambil menghitung langkah", "menentukan laci di hash map"].forEach((s, i) => {
        const u = ease((l - 0.5 - i * 0.8) / 0.5); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u;
        card(ctx, 220, 260 + i * 120, 820, 96, { fill: C.bg2, r: 16 }); text(ctx, "✓", 262, 322 + i * 120, 38, { weight: 900, color: C.good }); text(ctx, s, 316, 320 + i * 120, 32, { weight: 800, fit: 700 }); ctx.restore(); });
      tree(ctx, ACAK, clamp(Math.floor(l / 0.6), 1, 7), { box: { x: 1140, y: 280, w: 540, h: 260 }, r: 30 });
      [0, 1, 2, 3, 4].forEach(i => { const x = 1140 + i * 110; const on = i === 4 && l > 2.5; card(ctx, x, 620, 96, 110, { fill: on ? "#FFF3D6" : "#F4F8FB", stroke: on ? C.accent : "#B7C4CC", lw: 3, r: 10 }); text(ctx, String(i), x + 48, 690, 34, { align: "center", weight: 900, color: on ? C.accentDark : C.kiko }); });
      text(ctx, "laci hash map", 1410, 770, 24, { align: "center", weight: 900, color: C.ink2 });
    },
    k23_prasyarat(ctx, b, l) {
      panel(ctx);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 260, 640, 380, { fill: C.bg2, r: 22 });
      text(ctx, "F12.1", 620, 360, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Struktur Data Kompleks dan Abstrak", 620, 430, 32, 560, { align: "center", weight: 800, lh: 1.25 });
      text(ctx, "yang perlu kamu kenal:", 1040, 300, 26, { weight: 800, color: C.ink2 });
      ["tree: root, child, leaf", "binary search tree", "dictionary = hash map", "kunci dan nilai"].forEach((s, i) => { const u = ease((l - 1 - i * 0.6) / 0.4); ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * u; card(ctx, 1040, 330 + i * 86, 560, 70, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 14 }); text(ctx, s, 1070, 376 + i * 86, 30, { weight: 900 }); ctx.restore(); });
      kiko(ctx, 1700, 740, 90, 0, { wave: l });
    },
    k23_aturan(ctx, b, l) {
      panel(ctx); heading(ctx, "ATURAN BINARY SEARCH TREE");
      const vals = [50, 30, 70, 40]; const p = prog(l, b, 0.25, 0.85);
      const st = l < A(b) * 0.25 ? { n: 3 } : p >= 1 ? { n: 4, place: true } : insertState(vals, 3, 4, p);
      tree(ctx, vals, st.n, { box: { x: 260, y: 300, w: 760, h: 300 }, cmp: st.at != null && !st.place ? { v: 40, at: st.at } : null, fresh: st.place ? 40 : null, r: 46 });
      const note = st.at == null ? (st.place ? "40 ditaruh di kanan 30" : "sisipkan 40") : st.at === 50 ? "40 < 50 → kiri" : "40 > 30 → kanan";
      text(ctx, note, 640, 720, 34, { align: "center", weight: 900, color: st.place ? C.good : C.accentDark });
      card(ctx, 1180, 270, 540, 120, { fill: C.bg2, r: 16 }); text(ctx, "1. mulai dari root", 1210, 345, 32, { weight: 900 });
      card(ctx, 1180, 410, 540, 120, { fill: "#E5F1F6", stroke: C.kiko, lw: 3, r: 16 }); text(ctx, "2. lebih kecil → kiri", 1210, 485, 32, { weight: 900, color: C.kikoDark });
      card(ctx, 1180, 550, 540, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, "3. lebih besar → kanan", 1210, 625, 32, { weight: 900, color: C.accentDark });
      text(ctx, "sampai menemukan tempat kosong", 1450, 720, 26, { align: "center", weight: 800, color: C.ink2 });
    },
    k23_tanya(ctx, b, l) { tanya(ctx, b, l, false); },
    k23_tebak(ctx, b, l) { tanya(ctx, b, l, true); },
    k23_sisip(ctx, b, l) {
      const vals = b.order === "acak" ? ACAK : URUT; const from = b.from || 0, upto = b.upto || 7;
      panel(ctx); heading(ctx, b.order === "acak" ? "VARIASI 1 · SISIP 50, 30, 70, 20, 40, 60, 80" : "VARIASI 2 · SISIP 20, 30, 40, 50, 60, 70, 80");
      const p = prog(l, b, 0.04, from ? 0.55 : 0.88); const st = insertState(vals, from, upto, p);
      const fin = p >= 1; const n = fin ? upto : st.n;
      const g = tree(ctx, vals, n, { box: b.order === "acak" ? { x: 300, y: 300, w: 950, h: 340 } : { x: 300, y: 270, w: 950, h: 500 }, cmp: !fin && !st.place && st.at != null ? { v: st.cur, at: st.at } : null, fresh: fin ? vals[upto - 1] : st.place ? st.cur : null });
      orderChips(ctx, 1330, 290, vals, fin ? -1 : vals.indexOf(st.cur), n);
      let note = "";
      if (!fin) { if (st.at == null) note = st.place && !st.nd.p ? st.cur + " menjadi root" : st.cur + " ditaruh di " + (st.nd.side === "l" ? "kiri " : "kanan ") + st.nd.p.v; else note = st.cur < st.at ? st.cur + " < " + st.at + " → kiri" : st.cur + " > " + st.at + " → kanan"; }
      if (st.place && st.nd.p) note = st.cur + " ditaruh di " + (st.nd.side === "l" ? "kiri " : "kanan ") + st.nd.p.v;
      if (!st.place && st.at == null && !fin) note = "";
      if (!fin) { card(ctx, 1340, 380, 380, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 14 }); text(ctx, note, 1530, 438, 30, { align: "center", weight: 900, color: C.accentDark, fit: 350 }); }
      if (from && l > A(b) * 0.6) { // tingkat
        const H2 = height(vals); for (let d = 0; d < H2; d++) { const y = (b.order === "acak" ? 300 : 270) + d * g.dy; text(ctx, "tingkat " + (d + 1), 150 + 0, y + 8, 18, { weight: 900, color: C.ink2 }); }
        card(ctx, 1340, 500, 380, 150, { fill: b.order === "acak" ? C.goodBg : C.badBg, stroke: b.order === "acak" ? C.good : C.bad, lw: 4, r: 16 });
        text(ctx, H2 + " tingkat", 1530, 575, 48, { align: "center", weight: 900, color: b.order === "acak" ? C.good : C.bad }); text(ctx, b.order === "acak" ? "pohon seimbang" : "pohon miring", 1530, 620, 26, { align: "center", weight: 800, color: C.ink2 }); }
    },
    k23_cari(ctx, b, l) {
      const vals = b.which === "seimbang" ? ACAK : URUT; const full = build(vals);
      const path = []; let c = full.root; while (c) { path.push(c.v); if (c.v === 80) break; c = 80 < c.v ? c.l : c.r; }
      panel(ctx); heading(ctx, b.which === "seimbang" ? "VARIASI 3 · CARI 80 DI POHON SEIMBANG" : "VARIASI 3 · CARI 80 DI POHON MIRING");
      const p = prog(l, b, 0.06, b.which === "seimbang" ? 0.5 : 0.8); const k = clamp(Math.floor(p * path.length), 0, path.length - 1);
      const sub = subtree(full.nodes[path[k]]);
      const found = k === path.length - 1;
      tree(ctx, vals, 7, { box: b.which === "seimbang" ? { x: 300, y: 300, w: 950, h: 340 } : { x: 300, y: 270, w: 950, h: 500 }, path: path.slice(0, k + 1), hit: found ? 80 : null, dimNot: b.which === "seimbang" ? sub : null });
      counter(ctx, 1400, 260, k + 1, "langkah", found ? { fill: C.goodBg, stroke: C.good, color: C.good, w: 280 } : { w: 280 });
      const v = path[k]; const note = found ? "80 = 80: ketemu" : "80 > " + v + " → kanan";
      card(ctx, 1340, 400, 400, 90, { fill: found ? C.goodBg : "#FFF3D6", stroke: found ? C.good : C.accent, lw: 4, r: 14 }); text(ctx, note, 1540, 458, 32, { align: "center", weight: 900, color: found ? C.good : C.accentDark });
      text(ctx, "jalur: " + path.slice(0, k + 1).join(" → "), 1540, 540, 22, { align: "center", weight: 800, color: C.ink2, fit: 400 });
      if (found && b.which === "seimbang" && l > A(b) * 0.6) { card(ctx, 1340, 590, 400, 120, { fill: C.bg2, r: 14 }); text(ctx, "separuh pohon", 1540, 640, 28, { align: "center", weight: 900 }); text(ctx, "dibuang tiap langkah", 1540, 680, 24, { align: "center", weight: 800, color: C.ink2 }); }
      if (found && b.which === "miring") { card(ctx, 1340, 590, 400, 120, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "satu per satu,", 1540, 640, 28, { align: "center", weight: 900, color: C.bad }); text(ctx, "seperti cari linear", 1540, 680, 24, { align: "center", weight: 800, color: C.ink2 }); }
    },
    k23_banding(ctx, b, l) {
      panel(ctx); heading(ctx, "URUTAN SISIP MENENTUKAN KECEPATAN");
      card(ctx, 180, 240, 760, 300, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 }); text(ctx, "pohon seimbang", 210, 285, 28, { weight: 900, color: C.good });
      tree(ctx, ACAK, 7, { box: { x: 300, y: 340, w: 520, h: 170 }, r: 26, path: [50, 70, 80], hit: 80 });
      card(ctx, 980, 240, 760, 300, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "pohon miring", 1010, 285, 28, { weight: 900, color: C.bad });
      tree(ctx, URUT, 7, { box: { x: 1180, y: 330, w: 500, h: 190 }, r: 16, path: URUT, hit: 80 });
      const rows = [["7 angka", "3 langkah", "7 langkah"], ["1.000 angka", "± 10 langkah", "sampai 1.000 langkah"]];
      rows.forEach((r, i) => dim(ctx, l > A(b) * (i ? 0.25 : 0.0), () => { const y = 570 + i * 90; card(ctx, 180, y, 1560, 76, { fill: i ? "#FFF3D6" : C.bg2, r: 14 }); text(ctx, r[0], 220, y + 50, 30, { weight: 900 }); text(ctx, r[1], 560, y + 50, 32, { align: "center", weight: 900, color: C.good }); text(ctx, r[2], 1360, y + 50, 32, { align: "center", weight: 900, color: C.bad }); }));
    },
    k23_hash_intro(ctx, b, l) {
      panel(ctx); heading(ctx, "HASH MAP: KUNCI → FUNGSI HASH → NOMOR LACI");
      const u = [l > A(b) * 0.05, l > A(b) * 0.4, l > A(b) * 0.65];
      dim(ctx, u[0], () => { card(ctx, 200, 300, 260, 110, { fill: "#fff", stroke: C.kiko, lw: 4, r: 16 }); text(ctx, "\"teh\"", 330, 370, 40, { align: "center", weight: 900, color: C.kiko }); text(ctx, "kunci", 330, 450, 24, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "nilai: stok 12", 330, 490, 22, { align: "center", weight: 800, color: C.ink2 }); });
      dim(ctx, u[1], () => { Sk.arrow(ctx, 470, 355, 540, 355); card(ctx, 550, 280, 420, 160, { fill: "#F4F0FA", stroke: "#8E6BBF", lw: 4, r: 16 }); text(ctx, "fungsi hash", 760, 335, 30, { align: "center", weight: 900, color: "#8E6BBF" }); text(ctx, "banyak huruf % 5", 760, 385, 28, { align: "center", weight: 900 }); text(ctx, "3 % 5 = 3", 760, 422, 22, { align: "center", weight: 800, color: C.ink2 }); });
      dim(ctx, u[2], () => { Sk.arrow(ctx, 980, 355, 1050, 355); });
      drawers(ctx, 1080, 240, 640, u[2] ? { 3: [["teh", "good"]] } : {}, { hl: u[2] ? 3 : null, keysOnly: true });
      if (l > A(b) * 0.8) text(ctx, "% = sisa pembagian", 585, 560, 30, { align: "center", weight: 900, color: C.ink2 });
      if (l > A(b) * 0.8) text(ctx, "laci bernomor 0 sampai 4", 585, 610, 26, { align: "center", weight: 800, color: C.ink2 });
    },
    k23_hash(ctx, b, l) {
      panel(ctx);
      const titles = { sinta: "VARIASI 4 · MENYIMPAN SINTA", dito_ayu: "VARIASI 4 · DITO DAN AYU", kiko: "VARIASI 5 · TABRAKAN (COLLISION)", cari_kiko: "VARIASI 5 · MENCARI KIKO", penuh: "VARIASI 5 · KALAU TABRAKAN TERLALU BANYAK" };
      heading(ctx, titles[b.step]);
      const X = 780, W = 940;
      if (b.step === "sinta") { const u = prog(l, b, 0.0, 0.7); hashCalc(ctx, 200, 260, "Sinta", u); drawers(ctx, X, 240, W, u >= 0.85 ? { 0: [["Sinta", "new"]] } : {}, { hl: u > 0.7 ? 0 : null });
        if (l > A(b) * 0.65) { card(ctx, 200, 690, 520, 80, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "✕ tidak ada laci 5", 460, 742, 30, { align: "center", weight: 900, color: C.bad }); } }
      if (b.step === "dito_ayu") { const p = prog(l, b, 0.0, 0.62); const nm = p < 0.5 ? "Dito" : "Ayu"; const u = (p < 0.5 ? p : p - 0.5) * 2; hashCalc(ctx, 200, 260, nm, Math.min(1, u * 1.2 + 0.2));
        const isi = { 0: [["Sinta"]] }; if (p >= 0.45) isi[4] = [["Dito", p < 0.5 ? "new" : ""]]; if (p >= 0.95) isi[3] = [["Ayu", "new"]];
        const cari = l > A(b) * 0.7; if (cari) isi[3] = [["Ayu", "good"]];
        drawers(ctx, X, 240, W, isi, { hl: cari ? 3 : p >= 0.95 ? 3 : p >= 0.45 && p < 0.5 ? 4 : null });
        if (cari) { card(ctx, 200, 690, 520, 80, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "cari Ayu: langsung laci 3", 460, 742, 28, { align: "center", weight: 900, color: C.good }); } }
      if (b.step === "kiko") { const u = prog(l, b, 0.0, 0.45); hashCalc(ctx, 200, 260, "Kiko", u);
        const isi = { 0: [["Sinta"]], 3: [["Ayu"]], 4: [["Dito"]] }; if (u >= 0.85) isi[4].push(["Kiko", "new"]);
        drawers(ctx, X, 240, W, isi, { hl: u > 0.7 ? 4 : null });
        if (l > A(b) * 0.45) { card(ctx, 200, 690, 520, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "tabrakan: laci yang sama", 460, 742, 28, { align: "center", weight: 900, color: C.accentDark }); }
        if (l > A(b) * 0.7) text(ctx, "berdampingan, tidak tertimpa", X + W - 20, 800, 26, { align: "right", weight: 900, color: C.good }); }
      if (b.step === "cari_kiko") { const p = prog(l, b, 0.15, 0.75); const k = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
        card(ctx, 200, 260, 520, 220, { fill: C.bg2, r: 18 }); text(ctx, "cari \"Kiko\"", 230, 310, 30, { weight: 900, color: C.kiko }); text(ctx, "4 huruf → laci 4", 230, 365, 30, { weight: 900 }); text(ctx, "lalu cocokkan kunci", 230, 420, 26, { weight: 800, color: C.ink2 });
        const isi = { 0: [["Sinta"]], 3: [["Ayu"]], 4: [["Dito", k >= 1 ? "bad" : ""], ["Kiko", k >= 2 ? "good" : ""]] };
        drawers(ctx, X, 240, W, isi, { hl: 4 });
        if (k >= 1) text(ctx, "Dito ✕", 230, 560, 34, { weight: 900, color: C.bad }); if (k >= 2) text(ctx, "Kiko ✓", 430, 560, 34, { weight: 900, color: C.good });
        counter(ctx, 200, 600, k, "kali mencocokkan", { w: 300 }); }
      if (b.step === "penuh") { const p = prog(l, b, 0.05, 0.45); const extra = ["Bayu", "Rudi", "Lina"].slice(0, Math.floor(p * 3 + 0.001));
        const isi = { 0: [["Sinta"]], 3: [["Ayu"]], 4: [["Dito"], ["Kiko"], ...extra.map(e => [e, "bad"])] };
        drawers(ctx, X, 240, W, isi, { hl: 4, keysOnly: true });
        card(ctx, 200, 260, 520, 200, { fill: C.badBg, stroke: C.bad, lw: 3, r: 18 }); text(ctx, "banyak nama 4 huruf", 460, 320, 30, { align: "center", weight: 900, color: C.bad }); text(ctx, "→ laci 4 memanjang", 460, 370, 28, { align: "center", weight: 900 }); text(ctx, "→ mencari jadi lambat", 460, 420, 28, { align: "center", weight: 900 });
        if (l > A(b) * 0.55) { card(ctx, 200, 490, 520, 240, { fill: C.goodBg, stroke: C.good, lw: 3, r: 18 }); text(ctx, "hash map sungguhan:", 460, 545, 28, { align: "center", weight: 900, color: C.good }); text(ctx, "• laci jauh lebih banyak", 240, 600, 26, { weight: 800 }); text(ctx, "• fungsi hash lebih rumit", 240, 645, 26, { weight: 800 }); text(ctx, "(dictionary di Python)", 240, 695, 24, { weight: 800, color: C.ink2 }); } }
    },
    k23_latihan(ctx, b, l) {
      panel(ctx);
      const a = A(b), t = [a * 0.1, a * 0.3, a * 0.42, a * 0.54, a * 0.75];
      const ins = [30, 70, 20]; const nIns = [t[1], t[2], t[3]].filter(q => l >= q).length;
      const treeRow = { custom: (ctx, x, y, w, ll) => {
        ctx.fillStyle = C.bg2; rr(ctx, x, y, w, 120, 10); ctx.fill();
        const nodes = [[50, 0, 0], [30, -1, 1], [70, 1, 1], [20, -1.5, 2]].slice(0, 1 + nIns); const cx = x + w / 2;
        nodes.forEach(([v, dx, d]) => { if (d) { const px = dx === -1.5 ? cx - 70 : cx; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, y + 22 + (d - 1) * 40); ctx.lineTo(cx + dx * 70, y + 22 + d * 40); ctx.stroke(); } });
        nodes.forEach(([v, dx, d]) => { ctx.beginPath(); ctx.arc(cx + dx * 70, y + 22 + d * 40, 15, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = C.kiko; ctx.lineWidth = 2.5; ctx.stroke(); text(ctx, String(v), cx + dx * 70, y + 27 + d * 40, 11, { align: "center", weight: 900 }); });
        return y + 130; } };
      K.halaman(ctx, 250, 190, 1.15, { url: "belajar-informatika.vercel.app/f121", judul: "Binary search tree, pemilih struktur, pelacak stack dan queue",
        rows: [{ tabs: ["1 Binary search tree", "2 Pemilih struktur", "3 Pelacak stack dan queue"], on: 1 }, { label: "Langkah A: sisipkan · nilai " + (ins[nIns] || 40) },
          { buttons: ["30", "70", "20", "40", "60", "80", "45", "65"], on: -1 }, treeRow, { buttons: ["← kiri", "·", "kanan →"], cols: 3, on: -1 }],
        taps: [[0, 0, t[0]], [4, 0, t[1]], [4, 2, t[2]], [4, 0, t[3] - 0.01]] }, l, { h: 535 });
      const n = l < t[0] ? 0 : l < t[4] ? 1 : 2;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN F12.1", ["Klik Binary search tree.", "Ketuk kiri atau kanan untuk delapan angka.", "Cari 65 dan 25, lihat jalurnya."], n);
      card(ctx, 840, 520, 880, 250, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 565, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Di kertas, gambar BST dari urutan 40, 20, 60, 10, 30, 50, 70, lalu dari 10, 20, 30, 40, 50, 60, 70. Bandingkan tingginya.", 870, 610, 28, 820, { weight: 700, lh: 1.3 });
    }
  });

  // ---------- adegan khusus Short (area 40..1040 × 30..810; crop [40, 30, 1000, 780]) ----------
  Object.assign(K.SCENES, {
    k23s_sisip(ctx, b, l) {
      const vals = b.order === "acak" ? ACAK : URUT; const p = prog(l, b, 0.05, 0.85); const st = insertState(vals, 0, 7, p); const fin = p >= 1, n = fin ? 7 : st.n;
      orderChips(ctx, 90, 70, vals, fin ? -1 : vals.indexOf(st.cur), n, { s: 116, g: 10, label: " " });
      tree(ctx, vals, n, { box: b.order === "acak" ? { x: 140, y: 300, w: 800, h: 320 } : { x: 120, y: 250, w: 840, h: 480 }, r: b.order === "acak" ? 52 : 40, cmp: !fin && !st.place && st.at != null ? { v: st.cur, at: st.at } : null, fresh: fin ? null : st.place ? st.cur : null });
      if (fin) text(ctx, b.order === "acak" ? "3 tingkat: seimbang" : "7 tingkat: miring", b.order === "acak" ? 540 : 120, b.order === "acak" ? 760 : 780, 54, { align: b.order === "acak" ? "center" : "left", weight: 900, color: b.order === "acak" ? C.good : C.bad });
    },
    k23s_cari(ctx, b, l) {
      const p = prog(l, b, 0.08, 0.8);
      [[ACAK, { x: 110, y: 330, w: 360, h: 220 }, 34, "seimbang", C.good], [URUT, { x: 600, y: 230, w: 380, h: 520 }, 30, "miring", C.bad]].forEach(([vals, box, r, nm, col], j) => {
        const full = build(vals); const path = []; let c = full.root; while (c) { path.push(c.v); if (c.v === 80) break; c = 80 < c.v ? c.l : c.r; }
        const k = clamp(Math.floor(p * 7), 0, 6), kk = Math.min(k, path.length - 1), found = k >= path.length - 1;
        tree(ctx, vals, 7, { box, r, path: path.slice(0, kk + 1), hit: found ? 80 : null });
        card(ctx, 60 + j * 500, 40, 460, 140, { fill: found ? (j ? C.badBg : C.goodBg) : "#FFF3D6", stroke: found ? col : C.accent, lw: 5, r: 18 });
        text(ctx, nm + ": " + (kk + 1), 290 + j * 500, 120, 54, { align: "center", weight: 900, color: found ? col : C.accentDark }); text(ctx, "langkah", 290 + j * 500, 162, 28, { align: "center", weight: 800, color: C.ink2 }); });
      text(ctx, "cari 80", 290, 260, 44, { align: "center", weight: 900, color: C.ink2 });
    },
    k23s_hash(ctx, b, l) {
      const nm = b.step === "sinta" ? "Sinta" : "Kiko"; const u = prog(l, b, 0.0, b.step === "sinta" ? 0.7 : 0.45);
      [...nm].forEach((ch, i) => { const on = u > 0.1 + i * 0.06; card(ctx, 60 + i * 110, 40, 96, 100, { fill: on ? "#fff" : "#F4F6F5", stroke: on ? C.kiko : "#D7E2DC", lw: 4, r: 14 }); text(ctx, ch, 108 + i * 110, 108, 52, { align: "center", weight: 900 }); });
      if (u > 0.45) text(ctx, nm.length + " huruf", 640, 108, 50, { weight: 900 });
      if (u > 0.6) text(ctx, nm.length + " ÷ 5 = " + Math.floor(nm.length / 5) + " sisa " + (nm.length % 5) + "  →  laci " + (nm.length % 5), 60, 220, 46, { weight: 900, color: "#8E6BBF" });
      let isi, hl = u > 0.7 ? nm.length % 5 : null;
      if (b.step === "sinta") isi = u >= 0.85 ? { 0: [["Sinta", "new"]] } : {};
      else { const k = prog(l, b, 0.55, 0.95); isi = { 0: [["Sinta"]], 3: [["Ayu"]], 4: [["Dito", k > 0.4 ? "bad" : ""]] }; if (u >= 0.85) isi[4].push(["Kiko", k > 0.8 ? "good" : "new"]);
        if (l > A(b) * 0.5) text(ctx, "tabrakan di laci 4!", 1000, 300, 40, { align: "right", weight: 900, color: C.accentDark }); }
      drawers(ctx, 60, 320, 960, isi, { hl, h: 82, fs: 38 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
