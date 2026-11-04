/* S03 Simulasi praktik: mengurutkan, menyaring (filter), dan menghitung per kelompok (COUNTIF) di lembar kerja generik.
   Jendela aplikasi di kiri (x 110–1410, y 122–822), panel langkah di kanan (x 1450–1820). Data nilai rekaan (sama dengan latihan D8.2). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const MENUS = ["File", "Edit", "Tampilan", "Sisipkan", "Format", "Data"];
  const CW = { A: 190, B: 140, C: 140, D: 170, E: 50, F: 150, G: 170 };
  const RH = 44, SX = WIN.x + 14, GY = WIN.y + 46 + 40 + 76, HW = 60;   // GY: atas kisi (baris huruf kolom)
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";

  // ---------- data nilai (rekaan) ----------
  const ROWS0 = [["Dito", "8A", 65, "belum"], ["Sinta", "8B", 88, "-"], ["Rani", "8A", 65, "sudah"], ["Bayu", "8A", 58, "belum"], ["Tari", "8A", 72, "-"],
                 ["Agus", "8A", 69, "belum"], ["Lina", "8B", 91, "-"], ["Putri", "8B", 60, "sudah"], ["Eko", "8A", 77, "-"], ["Maya", "8B", 55, "belum"]];
  const AZ = ROWS0.slice().sort((a, b) => a[0].localeCompare(b[0]));
  const DESC = AZ.slice().sort((a, b) => b[2] - a[2]);           // sort stabil: Dito sebelum Rani (65)
  const HEAD = { A1: { v: "Nama", bold: true }, B1: { v: "Kelas", bold: true }, C1: { v: "Nilai", bold: true }, D1: { v: "Remedi", bold: true } };
  function cellsOf(rows, extra) {
    const c = { ...HEAD }; rows.forEach((r, i) => "ABCD".split("").forEach((col, j) => c[col + (i + 2)] = r[j]));
    return Object.assign(c, extra || {});
  }
  const F_COUNT = "=COUNTIF(B2:B11,F2)", F_FIX = "=COUNTIF($B$2:$B$11,F2)", F_LT = '=COUNTIF(C2:C11,"<70")';
  const KECIL = { F1: { v: "Kelas", bold: true }, G1: { v: "Jumlah", bold: true }, F2: "8A", F3: "8B" };
  const STAGE = {
    kecil: KECIL,
    g2: { ...KECIL, G2: { v: 6, f: F_COUNT } },
    g3salah: { ...KECIL, G2: { v: 6, f: F_COUNT }, G3: { v: 3, f: "=COUNTIF(B3:B12,F3)" } },
    g2fix: { ...KECIL, G2: { v: 6, f: F_FIX }, G3: { v: 3, f: "=COUNTIF(B3:B12,F3)" } },
    g3fix: { ...KECIL, G2: { v: 6, f: F_FIX }, G3: { v: 4, f: "=COUNTIF($B$2:$B$11,F3)" } },
    lt: { ...KECIL, G2: { v: 6, f: F_FIX }, G3: { v: 4, f: "=COUNTIF($B$2:$B$11,F3)" }, F5: { v: "Nilai < 70", bold: true }, G5: { v: 6, f: F_LT } }
  };

  // ---------- geometri analitis (sama dengan L.sheet) ----------
  const COLS = "ABCDEFG";
  const colX = c => { let x = SX + HW; for (let i = 0; i < COLS.indexOf(c); i++) x += CW[COLS[i]]; return x; };
  const rowY = r => GY + RH * r;
  const cellQ = a => { const c = a[0], r = parseInt(a.slice(1)); return { x: colX(c), y: rowY(r), w: CW[c], h: RH, cx: colX(c) + CW[c] / 2, cy: rowY(r) + RH / 2 }; };
  const at = a => { const q = cellQ(a); return [q.x + q.w * 0.62, q.y + q.h * 0.6]; };
  const handleAt = a => { const q = cellQ(a); return [q.x + q.w - 1, q.y + q.h - 1]; };
  function menuPos(ctx, name) {
    let mx = WIN.x + 24; ctx.font = "600 21px Inter";
    for (const m of MENUS) { const mw = ctx.measureText(m).width + 24; if (m === name) return { x: mx - 8, w: mw, cx: mx + 4 + (mw - 24) / 2, cy: WIN.y + 46 + 20 }; mx += mw + 6; }
  }
  const funnelAt = col => { const q = cellQ(col + "1"); return { x: q.x + q.w - 36, y: q.y + 8, cx: q.x + q.w - 22, cy: q.y + 22 }; };

  // ---------- gambar: jendela + lembar kerja + tambahan ----------
  function funnel(ctx, col, active, hot) {
    const f = funnelAt(col);
    ctx.fillStyle = active ? "#DCE9F7" : hot ? "#FFF3D6" : "#FFFFFF"; rr(ctx, f.x, f.y, 28, 28, 6); ctx.fill();
    ctx.strokeStyle = active ? BLUE : "#9AA8B1"; ctx.lineWidth = 1.5; rr(ctx, f.x, f.y, 28, 28, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(f.x + 6, f.y + 8); ctx.lineTo(f.x + 22, f.y + 8); ctx.lineTo(f.x + 16, f.y + 15); ctx.lineTo(f.x + 16, f.y + 22); ctx.lineTo(f.x + 12, f.y + 20); ctx.lineTo(f.x + 12, f.y + 15); ctx.closePath();
    if (active) { ctx.fillStyle = BLUE; ctx.fill(); } else { ctx.strokeStyle = "#5B6B76"; ctx.lineWidth = 2; ctx.stroke(); }
  }
  // opt: title, menuOn, funnels: "ABCD", fActive: "D", rowLabels: [nomor tampil per baris kisi], blueRows: [nomor biru]
  function app(ctx, st, opt = {}) {
    const area = L.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: opt.title || "Nilai Ulangan 8 — Lembar Kerja", menus: MENUS, menuOn: opt.menuOn });
    const geo = L.sheet(ctx, { x: area.x + 14, y: area.y }, { cols: 7, rows: 11, rh: RH, cw: CW, ...st });
    if (opt.rowLabels) opt.rowLabels.forEach((n, i) => { const y = rowY(i + 1); const blue = (opt.blueRows || []).includes(n);
      ctx.fillStyle = L.UI.head; ctx.fillRect(SX + 1, y + 1, HW - 2, RH - 2);
      text(ctx, String(n), SX + HW / 2, y + RH / 2 + 8, 22, { align: "center", weight: 800, color: blue ? BLUE : L.UI.headInk }); });
    if (opt.hiddenMark) { opt.hiddenMark.forEach(i => { const y = rowY(i + 1); ctx.fillStyle = "#9AA8B1"; ctx.fillRect(SX, y - 2, HW + 950, 3); }); }
    if (opt.funnels) opt.funnels.split("").forEach(c => funnel(ctx, c, opt.fActive === c, opt.fHot === c));
    return geo;
  }
  function cellText(ctx, col, top, v, color) {
    const x = colX(col), w = CW[col], isNum = typeof v === "number";
    text(ctx, String(v), isNum ? x + w - 14 : x + 12, top + RH / 2 + 9, 25, { align: isNum ? "right" : "left", weight: 600, color: color || C.ink });
  }
  // baris yang berpindah: moves = [{vals, cols, from, to}] (nomor baris kisi); u 0..1 dengan jeda bertahap
  function drawMoves(ctx, moves, u) {
    const items = moves.map((m, i) => { const k = ease(clamp((u - i * 0.035) / 0.65, 0, 1)); return { m, k, y: rowY(lerp(m.from, m.to, k)), dx: m.from !== m.to ? Math.sin(k * Math.PI) * 26 : 0 }; });
    items.sort((a, b) => (a.k > 0 && a.k < 1) - (b.k > 0 && b.k < 1));
    items.forEach(({ m, k, y, dx }) => {
      const x0 = colX(m.cols[0]) + dx, x1 = colX(m.cols[m.cols.length - 1]) + CW[m.cols[m.cols.length - 1]] + dx;
      const moving = k > 0 && k < 1 && m.from !== m.to;
      if (moving) { ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4; ctx.fillStyle = m.fill || "#FFFDF4"; rr(ctx, x0 + 1, y + 1, x1 - x0 - 2, RH - 2, 6); ctx.fill(); ctx.restore(); ctx.strokeStyle = "#E8D9A8"; ctx.lineWidth = 1.5; rr(ctx, x0 + 1, y + 1, x1 - x0 - 2, RH - 2, 6); ctx.stroke(); }
      ctx.save(); ctx.translate(dx, 0); [...m.cols].forEach((col, j) => cellText(ctx, col, y, m.vals[j], m.color)); ctx.restore();
    });
  }
  // susun perpindahan baris dari urutan A ke urutan B (semua kolom A–D)
  function rowMoves(A, B) { const used = new Set(); return A.map((r, i) => { const j = B.findIndex((x, jj) => x === r && !used.has(jj)); used.add(j); return { vals: r, cols: "ABCD", from: i + 2, to: j + 2 }; }); }
  // hanya kolom C yang diurutkan (kesalahan): nilai berpindah, nama diam
  function colMoves(A) {
    const vals = A.map(r => r[2]); const order = vals.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
    return order.map((o, j) => ({ vals: [o.v], cols: "C", from: o.i + 2, to: j + 2, fill: "#FDF1F0" }));
  }
  const sortedColC = A => A.map(r => r[2]).sort((a, b) => b - a);

  // ---------- pointer berdasarkan titik-kunci: [[detik, x, y, klik?, jenis?, tahan?]] ----------
  function track(l, keys) {
    if (!keys || !keys.length) return null;
    if (l <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], click: 0, kind: keys[0][4] || "arrow" };
    let i = 0; while (i + 1 < keys.length && l >= keys[i + 1][0]) i++;
    const k = keys[i], n = keys[i + 1]; let x = k[1], y = k[2], kind = k[4] || "arrow", down = !!k[5];
    if (n) { const mv = Math.min(0.75, (n[0] - k[0]) * 0.8); const u = ease((l - (n[0] - mv)) / mv); x = lerp(k[1], n[1], u); y = lerp(k[2], n[2], u); if (u > 0) { down = !!(k[5] && n[5]); if (n[4]) kind = n[4]; } }
    const dt = l - k[0]; const click = k[3] && dt < 0.45 ? dt / 0.45 : 0;
    return { x, y, click, kind, down };
  }
  const cur = (ctx, p) => { if (p) L.cursor(ctx, p.x, p.y, { kind: p.kind, click: p.click, down: p.down }); };

  // ---------- panel langkah (kanan) ----------
  function steps(ctx, title, items, n, opt = {}) {
    const x = 1450, y = opt.y || 122, w = 370; let hh = 70;
    const rows = items.map(s => H.wrap(ctx, s, 23, 700, w - 86)); rows.forEach(lines => hh += lines.length * 30 + 22);
    card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, title, x + 24, y + 44, 24, { weight: 900, color: C.accentDark });
    let yy = y + 74;
    rows.forEach((lines, i) => {
      const done = i < n, now = i === n;
      if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 10, yy - 8, w - 20, lines.length * 30 + 16, 10); ctx.fill(); }
      ctx.fillStyle = done ? GREEN : now ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(x + 36, yy + 13, 14, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 36, yy + 21, 18, { align: "center", weight: 900, color: "#FFFFFF" });
      lines.forEach((ln, j) => text(ctx, ln, x + 62, yy + 22 + j * 30, 23, { weight: 700, color: done ? C.ink2 : C.ink }));
      yy += lines.length * 30 + 22;
    });
    return y + hh;
  }
  const stepAt = (ph, marks) => { let n = 0; marks.forEach((m, i) => { if (ph >= m) n = i + 1; }); return n; };
  // catatan kecil "Di aplikasi lain …"
  const note = (ctx, y, s) => L.callout(ctx, 1450, y, s, null, null, { size: 22, maxW: 330, fill: "#E7F1FB", color: BLUE });
  // kartu rumus besar dengan bagian berwarna: parts = [[teks, warna]]
  function formulaCard(ctx, x, y, w, label, parts, opt = {}) {
    card(ctx, x, y, w, opt.h || 130, { fill: opt.fill || "#FFFFFF", stroke: opt.stroke || "#D7E2DC", lw: 3, r: 16 });
    text(ctx, label, x + 20, y + 36, 21, { weight: 800, color: opt.labelColor || C.ink2 });
    let size = opt.size || 30; ctx.font = `800 ${size}px Inter`; let tw = parts.reduce((a, p) => a + ctx.measureText(p[0]).width, 0);
    if (tw > w - 40) { size = Math.floor(size * (w - 40) / tw); ctx.font = `800 ${size}px Inter`; tw = parts.reduce((a, p) => a + ctx.measureText(p[0]).width, 0); }
    let px = x + 20; parts.forEach(([s, col]) => { text(ctx, s, px, y + 88, size, { weight: 800, color: col || L.UI.formula }); ctx.font = `800 ${size}px Inter`; px += ctx.measureText(s).width; });
  }

  // ---------- menu Data dan kotak dialog ----------
  const DATA_ITEMS = ["Urutkan…", "Urutkan A ke Z", "Urutkan Z ke A", "Filter", "Hapus duplikat"];
  function dataMenu(ctx, hi) {
    const m = menuPos(ctx, "Data"); const x = m.x, y = WIN.y + 86 + 2, w = 300;
    card(ctx, x, y, w, 16 + DATA_ITEMS.length * 46, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 10 });
    DATA_ITEMS.forEach((s, i) => { const on = s === hi; if (on) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(x + 4, y + 8 + i * 46, w - 8, 44); }
      if (i === 3) { ctx.fillStyle = "#E1E7EB"; ctx.fillRect(x + 12, y + 7 + i * 46, w - 24, 2); }
      text(ctx, s, x + 24, y + 38 + i * 46, 23, { weight: 600, color: on ? BLUE : C.ink }); });
  }
  const dataItemAt = (ctx, s) => { const m = menuPos(ctx, "Data"); const i = DATA_ITEMS.indexOf(s); return [m.x + 236, WIN.y + 88 + 8 + i * 46 + 26]; };
  // dialog Urutkan: st = {header: bool, col: "Kolom A"|"Nama"|..., listOpen, listHi, dir: "az"|"za", hot: "btn"}
  const DLG = { x: 840, y: 300, w: 556, h: 470 };
  function sortDialog(ctx, st) {
    const { x, y, w, h } = DLG;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 8; card(ctx, x, y, w, h, { fill: "#FFFFFF", r: 16 }); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 16); ctx.stroke();
    text(ctx, "Urutkan rentang", x + 30, y + 52, 30, { weight: 900 });
    text(ctx, st.header ? "Rentang A2:D11" : "Rentang A1:D11", x + 30, y + 90, 22, { weight: 600, color: C.ink2 });
    // kotak centang baris judul
    const cx = x + 30, cy = y + 120; ctx.fillStyle = st.header ? BLUE : "#FFFFFF"; rr(ctx, cx, cy, 30, 30, 6); ctx.fill(); ctx.strokeStyle = st.header ? BLUE : "#7C8A94"; ctx.lineWidth = 2.5; rr(ctx, cx, cy, 30, 30, 6); ctx.stroke();
    if (st.header) { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx + 7, cy + 15); ctx.lineTo(cx + 13, cy + 22); ctx.lineTo(cx + 24, cy + 8); ctx.stroke(); }
    text(ctx, "Data memiliki baris judul", cx + 46, cy + 24, 24, { weight: 700 });
    text(ctx, "Urutkan menurut", x + 30, y + 200, 22, { weight: 700, color: C.ink2 });
    card(ctx, x + 30, y + 214, 300, 54, { fill: "#FFFFFF", stroke: st.listOpen ? BLUE : "#C9D4DB", lw: 2, r: 8 });
    text(ctx, st.col || "Kolom A", x + 48, y + 250, 25, { weight: 700 }); text(ctx, "▾", x + 306, y + 250, 24, { align: "center", weight: 800, color: C.ink2 });
    // pilihan arah
    [["az", "A ke Z", "kecil → besar"], ["za", "Z ke A", "besar → kecil"]].forEach(([k, a, b], i) => {
      const ry = y + 310 + i * 52, on = st.dir === k; ctx.strokeStyle = on ? BLUE : "#7C8A94"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x + 45, ry, 14, 0, Math.PI * 2); ctx.stroke();
      if (on) { ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(x + 45, ry, 8, 0, Math.PI * 2); ctx.fill(); }
      text(ctx, a, x + 72, ry + 9, 25, { weight: 700 }); text(ctx, "(" + b + ")", x + 180, ry + 9, 22, { weight: 600, color: C.ink2 });
    });
    card(ctx, x + w - 330, y + h - 74, 140, 52, { fill: "#F4F6F5", stroke: "#C9D4DB", lw: 2, r: 10 }); text(ctx, "Batal", x + w - 260, y + h - 39, 24, { align: "center", weight: 700 });
    card(ctx, x + w - 172, y + h - 74, 142, 52, { fill: st.hot === "btn" ? "#155FA6" : BLUE, r: 10 }); text(ctx, "Urutkan", x + w - 101, y + h - 39, 24, { align: "center", weight: 800, color: "#FFFFFF" });
    if (st.listOpen) { const items = ["Nama", "Kelas", "Nilai", "Remedi"]; card(ctx, x + 30, y + 272, 300, 16 + items.length * 46, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 8 });
      items.forEach((s, i) => { if (s === st.listHi) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(x + 34, y + 280 + i * 46, 292, 44); } text(ctx, s, x + 52, y + 311 + i * 46, 24, { weight: 600, color: s === st.listHi ? BLUE : C.ink }); }); }
  }
  const DP = { check: [DLG.x + 45, DLG.y + 135], drop: [DLG.x + 200, DLG.y + 241], item: i => [DLG.x + 250, DLG.y + 302 + i * 46], az: [DLG.x + 45, DLG.y + 310], za: [DLG.x + 45, DLG.y + 362], btn: [DLG.x + DLG.w - 50, DLG.y + DLG.h - 44] };

  // daftar filter di bawah corong kolom: st = {checks: {"-":1, belum:1, sudah:1}, hot}
  const FV = ["-", "belum", "sudah"];
  function filterList(ctx, col, st) {
    const q = cellQ(col + "1"); const x = q.x, y = q.y + RH + 2, w = 330, h = 418;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6; card(ctx, x, y, w, h, { fill: "#FFFFFF", r: 12 }); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 12); ctx.stroke();
    text(ctx, "Urutkan A ke Z", x + 22, y + 40, 22, { weight: 600, color: C.ink2 }); text(ctx, "Urutkan Z ke A", x + 22, y + 80, 22, { weight: 600, color: C.ink2 });
    ctx.fillStyle = "#E1E7EB"; ctx.fillRect(x + 12, y + 100, w - 24, 2);
    text(ctx, "Saring menurut nilai", x + 22, y + 136, 22, { weight: 800 });
    const n = FV.filter(v => st.checks[v]).length; const all = n === FV.length;
    const box = (bx, by, on, part) => { ctx.fillStyle = on ? BLUE : "#FFFFFF"; rr(ctx, bx, by, 26, 26, 5); ctx.fill(); ctx.strokeStyle = on ? BLUE : "#7C8A94"; ctx.lineWidth = 2; rr(ctx, bx, by, 26, 26, 5); ctx.stroke();
      if (on && !part) { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(bx + 6, by + 13); ctx.lineTo(bx + 11, by + 19); ctx.lineTo(bx + 20, by + 7); ctx.stroke(); }
      if (on && part) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(bx + 6, by + 11, 14, 4); } };
    const rowsY = [y + 160, y + 206, y + 252, y + 298];
    [["(Pilih semua)", n > 0, !all], ...FV.map(v => [v, !!st.checks[v], false])].forEach(([s, on, part], i) => {
      if (st.hot === i) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 8, rowsY[i] - 6, w - 16, 42); }
      box(x + 22, rowsY[i] + 2, on, part); text(ctx, s, x + 62, rowsY[i] + 24, 24, { weight: i === 0 ? 700 : 600 }); if (s === "-") text(ctx, "(tanda strip)", x + 84, rowsY[i] + 24, 22, { weight: 600, color: C.ink2 });
    });
    card(ctx, x + w - 250, y + h - 66, 110, 48, { fill: "#F4F6F5", stroke: "#C9D4DB", lw: 2, r: 10 }); text(ctx, "Batal", x + w - 195, y + h - 34, 22, { align: "center", weight: 700 });
    card(ctx, x + w - 128, y + h - 66, 106, 48, { fill: st.hot === "ok" ? "#155FA6" : BLUE, r: 10 }); text(ctx, "OK", x + w - 75, y + h - 34, 22, { align: "center", weight: 800, color: "#FFFFFF" });
  }
  const FL = col => { const q = cellQ(col + "1"); const x = q.x, y = q.y + RH + 2; return { row: i => [x + 28, y + 175 + i * 46], ok: [x + 330 - 70, y + 418 - 40] }; };
  // tampilan terfilter: hanya baris "belum"
  function filtered(rows) {
    const c = { ...HEAD }, labels = [1], blue = []; let r = 2;
    rows.forEach((row, i) => { if (row[3] === "belum") { "ABCD".split("").forEach((col, j) => c[col + r] = row[j]); labels.push(i + 2); blue.push(i + 2); r++; } });
    let n = rows.length + 2; while (labels.length < 11) labels.push(n++);
    return { cells: c, labels, blue };
  }

  // satu adegan aksi berbasis L.play (untuk klik sel, mengetik, drag gagang isi)
  function action(ctx, b, l, base, acts, panel, opt = {}) {
    const span = Math.max(3, (b.audio || b.dur) * (opt.speed || 0.92));
    let g0; const g = () => g0 || (g0 = (() => { ctx.save(); ctx.globalAlpha = 0; const r = app(ctx, base, opt); ctx.restore(); return r; })());
    const P = L.play(base, acts, l, span, g);
    if (opt.mod) opt.mod(P.st, l, span);
    const geo = app(ctx, P.st, opt);
    if (panel) steps(ctx, panel.title || "LANGKAH", panel.items, stepAt(l / span, panel.marks));
    if (opt.after) opt.after(ctx, geo, P, l, span);
    if (P.ptr) L.cursor(ctx, P.ptr.x, P.ptr.y, { kind: P.kind, click: P.click, down: P.down });
    if (P.key) L.keys(ctx, 1635, 700, P.key.keys, { press: P.key.press, align: "center", size: 30 });
    return { geo, P };
  }
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const FUN = { funnels: "ABCD" };

  // pemilihan dengan drag dari a ke b selama [t0, t1]
  function dragSel(l, t0, t1, a, bAddr) {
    const u = ease(clamp((l - t0) / (t1 - t0), 0, 1));
    const ca = COLS.indexOf(a[0]), cb = COLS.indexOf(bAddr[0]), ra = parseInt(a.slice(1)), rb = parseInt(bAddr.slice(1));
    const c = Math.round(lerp(ca, cb, u)), r = Math.round(lerp(ra, rb, u));
    return { active: a, selTo: COLS[c] + r, range: [a, COLS[c] + r] };
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["mengurutkan tanpa tercampur", "menyaring dengan filter", "menghitung per kelompok", "mengunci rentang dengan $"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      // tabel mini dengan corong dan panah urut
      const x0 = 1130, y0 = 300; card(ctx, x0 - 20, y0 - 30, 560, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      const mini = [["Nama", "Nilai"], ["Lina", 91], ["Sinta", 88], ["Eko", 77], ["Tari", 72], ["Agus", 69]];
      mini.forEach((r, i) => r.forEach((v, j) => { const x = x0 + j * 240, y = y0 + i * 50; ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(x, y, 240, 50);
        if (i === 0) { ctx.fillStyle = L.UI.head; ctx.fillRect(x + 1, y + 1, 238, 48); }
        text(ctx, String(v), typeof v === "number" ? x + 220 : x + 16, y + 35, 28, { align: typeof v === "number" ? "right" : "left", weight: i === 0 ? 800 : 600 }); }));
      ctx.fillStyle = BLUE; ctx.beginPath(); ctx.moveTo(x0 + 448, y0 + 18); ctx.lineTo(x0 + 468, y0 + 18); ctx.lineTo(x0 + 461, y0 + 28); ctx.lineTo(x0 + 461, y0 + 40); ctx.lineTo(x0 + 455, y0 + 37); ctx.lineTo(x0 + 455, y0 + 28); ctx.closePath(); ctx.fill();
      card(ctx, x0 + 90, y0 + 322, 340, 56, { fill: "#E7F1FB", r: 12 }); text(ctx, "=COUNTIF(…)", x0 + 260, y0 + 361, 30, { align: "center", weight: 900, color: L.UI.formula });
      text(ctx, "aplikasi lembar kerja apa pun", x0 + 260, 740, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      [["D8.2", "Memecahkan Persoalan dengan Data Kecil", "mengurutkan dan menyaring"], ["D8.6", "Proyek: Cek Data, Cek Fakta", "mengolah data sekolah"], ["D9.6", "Proyek Akhir Fase D", "data antrean kantin"]].forEach(([c, t, s], i) => {
        const x = 240 + i * 490, u = ease((l - 0.3 - i * 0.5) / 0.5); ctx.globalAlpha = Math.max(0.15, u); card(ctx, x, 280, 460, 320, { fill: i === 0 ? "#FFF3D6" : C.bg2, r: 22 });
        text(ctx, c, x + 230, 360, 54, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 230, 420, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 560, 25, { align: "center", weight: 600, color: C.ink2 }); ctx.globalAlpha = 1;
      });
      card(ctx, 520, 640, 880, 80, { fill: "#E7F1FB", r: 16 }); text(ctx, "Cara menulis rumus: simulasi S02", 960, 692, 30, { align: "center", weight: 800, color: BLUE });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    },
    kenal_tabel(ctx, b, l) {
      const a = b.audio || b.dur, ph = l / a;
      const k = ph < 0.21 ? -1 : ph < 0.33 ? 0 : ph < 0.46 ? 1 : ph < 0.59 ? 2 : ph < 0.8 ? 3 : 4;
      const marks = []; if (k >= 0 && k < 4) for (let r = 1; r <= 11; r++) marks.push(["ABCD"[k] + r, "rgba(242,177,52,0.22)"]);
      if (k === 4) "ABCD".split("").forEach(c => marks.push([c + "1", "rgba(242,177,52,0.35)"]));
      app(ctx, { cells: cellsOf(ROWS0), marks });
      const items = [["A", "Nama"], ["B", "Kelas"], ["C", "Nilai"], ["D", "Remedi"], ["1", "Baris judul"]];
      card(ctx, 1450, 150, 370, 120 + items.length * 84, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "ISI TABEL", 1635, 200, 24, { align: "center", weight: 900, color: C.accentDark });
      items.forEach(([c, s], i) => { const on = i === k, seen = i <= k; const y = 230 + i * 84;
        ctx.fillStyle = on ? "#FFF3D6" : "#F4F6F5"; rr(ctx, 1470, y, 330, 68, 12); ctx.fill();
        ctx.fillStyle = seen ? C.kiko : "#C9D4DB"; rr(ctx, 1484, y + 12, 44, 44, 10); ctx.fill(); text(ctx, c, 1506, y + 44, 24, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, i < 4 ? "Kolom " + c + ": " + s : s, 1544, y + 44, 24, { weight: 800, color: seen ? C.ink : C.muted }); });
    },
    kenal_baris(ctx, b, l) {
      const a = b.audio || b.dur, ph = l / a;
      const c = cellsOf(ROWS0); const lift = ph > 0.5 ? Math.sin(clamp((ph - 0.5) / 0.38, 0, 1) * Math.PI) : 0;
      if (lift > 0) "ABCD".split("").forEach(col => delete c[col + 3]);
      app(ctx, { cells: c, marks: ph > 0.12 && lift === 0 ? "ABCD".split("").map(col => [col + "3", "rgba(242,177,52,0.3)"]) : [] });
      if (lift > 0) { const y = rowY(3) - lift * 8, dx = lift * 70, x0 = colX("A") + dx, x1 = colX("E") + dx;
        ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8 * lift; ctx.fillStyle = "#FFF3D6"; rr(ctx, x0 + 2, y + 2, x1 - x0 - 4, RH - 4, 8); ctx.fill(); ctx.restore();
        ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, x0 + 2, y + 2, x1 - x0 - 4, RH - 4, 8); ctx.stroke();
        ctx.save(); ctx.translate(dx, 0); ROWS0[1].forEach((v, j) => cellText(ctx, "ABCD"[j], y, v)); ctx.restore(); }
      if (ph > 0.12) L.callout(ctx, 1450, 200, "Satu baris = data satu murid", colX("E") + 10, rowY(3) + RH / 2);
      if (ph > 0.5) { card(ctx, 1450, 340, 370, 250, { fill: "#FFFFFF", stroke: C.accent, lw: 3, r: 18 });
        text(ctx, "Selalu bersama:", 1474, 386, 24, { weight: 900, color: C.accentDark });
        ["Sinta", "8B", "88", "-"].forEach((s, i) => { ctx.fillStyle = "#FFF3D6"; rr(ctx, 1474 + i * 84, 412, 76, 56, 10); ctx.fill(); text(ctx, s, 1512 + i * 84, 450, 22, { align: "center", weight: 800 }); });
        para(ctx, "Ke mana pun barisnya pindah, semua isinya ikut.", 1474, 510, 22, 330, { weight: 700, color: C.ink2, lh: 1.3 }); }
    },
    urut_pilih(ctx, b, l) {
      const span = spanOf(b), t = l / span;
      const sel = t < 0.32 ? { active: "B4" } : dragSel(t, 0.36, 0.8, "A1", "D11");
      app(ctx, { cells: cellsOf(ROWS0), ...sel });
      steps(ctx, "LANGKAH", ["Klik sel A1.", "Tahan klik, drag ke D11.", "Seluruh tabel terpilih."], stepAt(t, [0.32, 0.82, 1]));
      if (t > 0.7) L.callout(ctx, 1450, 420, "A1 sampai D11 = seluruh tabel", colX("E") - 10, rowY(6) + 20);
      const [ax, ay] = at("A1"), [dx, dy] = at("D11");
      cur(ctx, track(t * span, [[0, 900, 600], [0.28 * span, ax, ay, 1], [0.36 * span, ax, ay, 0, "arrow", 1], [0.8 * span, dx, dy, 0, "arrow", 1], [0.86 * span, dx, dy]]));
    },
    urut_menu(ctx, b, l) {
      const span = spanOf(b), t = l / span; const open = t > 0.12;
      app(ctx, { cells: cellsOf(ROWS0), active: "A1", selTo: "D11", range: ["A1", "D11"] }, { menuOn: open ? "Data" : null });
      if (open) dataMenu(ctx, t > 0.3 ? "Urutkan…" : null);
      steps(ctx, "LANGKAH", ["Klik menu Data.", "Pilih Urutkan…"], stepAt(t, [0.12, 0.42]));
      if (t > 0.42) note(ctx, 400, "Di aplikasi lain: Urutkan rentang, atau Sort.");
      const m = menuPos(ctx, "Data"), it = dataItemAt(ctx, "Urutkan…");
      cur(ctx, track(l, [[0, 800, 700], [0.1 * span, m.cx, m.cy + 6, 1], [0.3 * span, it[0], it[1]], [0.4 * span, it[0], it[1], 1]]));
    },
    urut_dialog(ctx, b, l) {
      const span = spanOf(b), t = l / span;
      const header = t > 0.2, listOpen = t > 0.7 && t < 0.79, dir = "az";
      app(ctx, { cells: cellsOf(ROWS0), active: header ? "A2" : "A1", selTo: "D11", range: [header ? "A2" : "A1", "D11"] });
      sortDialog(ctx, { header, col: header ? "Nama" : "Kolom A", listOpen, listHi: t > 0.74 ? "Nama" : null, dir, hot: t > 0.95 ? "btn" : null });
      if (t > 0.87) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, DLG.x + 22, DLG.y + 286, 330, 48, 10); ctx.stroke(); }
      steps(ctx, "LANGKAH", ["Centang Data memiliki baris judul.", "Pilih kolom Nama.", "Pilih A ke Z.", "Klik Urutkan."], stepAt(t, [0.22, 0.8, 0.9, 0.97]));
      if (header && t < 0.7) L.callout(ctx, 1450, 520, "Baris judul tidak ikut diurutkan.", null, null, { size: 22, maxW: 330 });
      cur(ctx, track(l, [[0, 700, 700], [0.18 * span, ...DP.check, 1], [0.7 * span, ...DP.drop, 1], [0.78 * span, ...DP.item(0), 1], [0.87 * span, ...DP.az, 1], [0.95 * span, ...DP.btn, 1]]));
    },
    urut_hasil(ctx, b, l) {
      const a = b.audio || b.dur, u = clamp(l / (a * 0.36), 0, 1);
      if (u < 1) { app(ctx, { cells: { ...HEAD }, active: "A2", selTo: "D11", range: ["A2", "D11"] }); drawMoves(ctx, rowMoves(ROWS0, AZ), u); }
      else { const ph = l / a; const lina = AZ.findIndex(r => r[0] === "Lina") + 2;
        app(ctx, { cells: cellsOf(AZ), active: "A2", selTo: "D11", range: ["A2", "D11"], marks: ph > 0.65 ? "ABCD".split("").map(c => [c + lina, C.goodBg]) : [] });
        if (ph > 0.37) L.callout(ctx, 1450, 200, "Agus di atas", colX("E") - 6, rowY(2) + 22); if (ph > 0.52) { L.callout(ctx, 1450, 330, "Tari di bawah", colX("E") - 6, rowY(11) + 22); }
        if (ph > 0.65) L.callout(ctx, 1450, 470, "Lina tetap bersama nilai 91", colX("E") - 6, rowY(lina) + 22, { fill: C.goodBg, color: GREEN }); }
    },
    salah_pilih(ctx, b, l) {
      const span = spanOf(b), t = l / span;
      const sel = t < 0.2 ? { active: "A2" } : dragSel(t, 0.22, 0.48, "C1", "C11");
      const open = t > 0.58;
      app(ctx, { cells: cellsOf(AZ), ...sel }, { menuOn: open ? "Data" : null });
      if (open) dataMenu(ctx, t > 0.74 ? "Urutkan Z ke A" : null);
      steps(ctx, "YANG SERING TERJADI", ["Hanya kolom Nilai dipilih.", "Data → Urutkan Z ke A."], stepAt(t, [0.5, 0.95]));
      if (t > 0.5 && t < 0.58) L.callout(ctx, 1450, 360, "Hanya C1 sampai C11", colX("D") + 10, rowY(6), { fill: "#FDF1F0", color: RED });
      const [cx, cy] = at("C1"), [ex, ey] = at("C11"), m = menuPos(ctx, "Data"), it = dataItemAt(ctx, "Urutkan Z ke A");
      cur(ctx, track(l, [[0, 900, 650], [0.18 * span, cx, cy, 1], [0.22 * span, cx, cy, 0, "arrow", 1], [0.48 * span, ex, ey, 0, "arrow", 1], [0.56 * span, m.cx, m.cy + 6, 1], [0.74 * span, it[0], it[1]], [0.9 * span, it[0], it[1], 1]]));
    },
    salah_hasil(ctx, b, l) {
      const a = b.audio || b.dur, u = clamp(l / (a * 0.4), 0, 1), ph = l / a;
      const base = cellsOf(AZ); for (let r = 2; r <= 11; r++) delete base["C" + r];
      if (u < 1) { app(ctx, { cells: base, active: "C1", selTo: "C11", range: ["C1", "C11"] }); drawMoves(ctx, colMoves(AZ), u); }
      else { const vals = sortedColC(AZ); vals.forEach((v, i) => base["C" + (i + 2)] = v);
        const lina = AZ.findIndex(r => r[0] === "Lina") + 2;
        const marks = ph > 0.48 ? [["A2", C.badBg], ["C2", C.badBg]] : []; if (ph > 0.66) marks.push(["A" + lina, C.badBg], ["C" + lina, C.badBg]);
        app(ctx, { cells: base, active: "C1", selTo: "C11", range: ["C1", "C11"], marks });
        if (ph > 0.42) L.callout(ctx, 1450, 170, "Nama tidak ikut pindah", null, null, { fill: "#FDF1F0", color: RED });
        if (ph > 0.48) L.callout(ctx, 1450, 300, "91 milik Lina, kini di baris Agus ✗", colX("E") - 6, rowY(2) + 22, { fill: "#FDF1F0", color: RED, maxW: 330 });
        if (ph > 0.66) L.callout(ctx, 1450, 470, "Lina malah tertulis 69 ✗", colX("E") - 6, rowY(lina) + 22, { fill: "#FDF1F0", color: RED, maxW: 330 });
        if (ph > 0.84) { card(ctx, 1450, 600, 370, 90, { fill: RED, r: 16 }); text(ctx, "DATA TERCAMPUR", 1635, 657, 30, { align: "center", weight: 900, color: "#FFFFFF" }); } }
    },
    salah_batal(ctx, b, l) {
      const a = b.audio || b.dur, ph = l / a, u = 1 - clamp((l - a * 0.3) / (a * 0.22), 0, 1);
      const base = cellsOf(AZ); for (let r = 2; r <= 11; r++) delete base["C" + r];
      app(ctx, { cells: base, active: "C1", selTo: "C11", range: ["C1", "C11"] });
      drawMoves(ctx, colMoves(AZ).map(m => ({ ...m, fill: "#F2FAF4" })), u);
      if (ph < 0.42) L.keys(ctx, 1635, 200, ["Ctrl", "Z"], { press: clamp((l - a * 0.13) / (a * 0.2), 0, 1), align: "center", size: 34 });
      if (ph > 0.42) { L.callout(ctx, 1450, 170, "Ctrl + Z = batalkan", null, null, { fill: C.goodBg, color: GREEN }); }
      if (ph > 0.6) { // contoh peringatan dari aplikasi
        const x = 1450, y = 280; card(ctx, x, y, 370, 330, { fill: "#FFFFFF", stroke: C.accent, lw: 3, r: 16 });
        text(ctx, "Contoh peringatan", x + 22, y + 40, 22, { weight: 900, color: C.accentDark });
        para(ctx, "Ada data di sebelah pilihanmu.", x + 22, y + 80, 22, 330, { weight: 700, lh: 1.25 });
        [["Perluas pilihan", true], ["Lanjutkan dengan pilihan sekarang", false]].forEach(([s, on], i) => { const ry = y + 140 + i * 66;
          ctx.strokeStyle = on ? BLUE : "#7C8A94"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x + 36, ry, 12, 0, Math.PI * 2); ctx.stroke(); if (on) { ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(x + 36, ry, 7, 0, Math.PI * 2); ctx.fill(); }
          para(ctx, s, x + 58, ry + 8, 22, 290, { weight: on ? 800 : 600, lh: 1.2, color: on ? C.ink : C.ink2 }); });
        card(ctx, x + 200, y + 262, 146, 48, { fill: BLUE, r: 10 }); text(ctx, "Urutkan", x + 273, y + 294, 22, { align: "center", weight: 800, color: "#FFFFFF" });
        if (ph > 0.84) { ctx.strokeStyle = GREEN; ctx.lineWidth = 4; rr(ctx, x + 12, y + 118, 346, 46, 10); ctx.stroke(); }
      }
    },
    urut_benar(ctx, b, l) {
      const span = spanOf(b), t = l / span;
      const m = menuPos(ctx, "Data"), it = dataItemAt(ctx, "Urutkan…"), [ax, ay] = at("A1"), [dx, dy] = at("D11");
      const nilaiAt = DP.item(2);
      if (t < 0.62) {
        const sel = t < 0.06 ? { active: "C1" } : dragSel(t, 0.06, 0.2, "A1", "D11");
        const dlg = t > 0.34; const menu = t > 0.22 && t <= 0.34;
        if (dlg) { sel.active = "A2"; sel.range = ["A2", "D11"]; }
        app(ctx, { cells: cellsOf(AZ), ...sel }, { menuOn: menu ? "Data" : null });
        if (menu) dataMenu(ctx, t > 0.29 ? "Urutkan…" : null);
        if (dlg) sortDialog(ctx, { header: true, col: t > 0.47 ? "Nilai" : "Nama", listOpen: t > 0.4 && t < 0.47, listHi: t > 0.44 ? "Nilai" : null, dir: t > 0.53 ? "za" : "az", hot: t > 0.58 ? "btn" : null });
      } else {
        const u = clamp((t - 0.62) / 0.26, 0, 1);
        if (u < 1) { app(ctx, { cells: { ...HEAD }, active: "A2", selTo: "D11", range: ["A2", "D11"] }); drawMoves(ctx, rowMoves(AZ, DESC), u); }
        else { app(ctx, { cells: cellsOf(DESC), active: "A2", selTo: "D11", range: ["A2", "D11"], marks: "ABCD".split("").map(c => [c + 2, C.goodBg]) });
          L.callout(ctx, 1450, 470, "Lina 91 di paling atas ✓", colX("E") - 6, rowY(2) + 22, { fill: C.goodBg, color: GREEN }); }
      }
      steps(ctx, "CARA YANG BENAR", ["Pilih A1 sampai D11.", "Data → Urutkan…", "Kolom Nilai, Z ke A.", "Klik Urutkan."], stepAt(t, [0.2, 0.34, 0.56, 0.62]));
      cur(ctx, track(l, [[0, 700, 650], [0.05 * span, ax, ay, 1], [0.06 * span, ax, ay, 0, "arrow", 1], [0.2 * span, dx, dy, 0, "arrow", 1], [0.26 * span, m.cx, m.cy + 6, 1], [0.31 * span, it[0], it[1], 1], [0.4 * span, ...DP.drop, 1], [0.45 * span, ...nilaiAt, 1], [0.53 * span, ...DP.za, 1], [0.6 * span, ...DP.btn, 1], [0.75 * span, 1300, 700]]));
    },
    coba(ctx, b, l, t, TL) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 280, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 300, 245, 20, 70, 6); ctx.fill(); rr(ctx, 340, 245, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 440, 268, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 440, 316, 28, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 220, 400 + i * 110, 830, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 266, 456 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 306, 455 + i * 110, 26, { weight: 700, fit: 730 }); });
      const xs = 1110, ys = 236;
      card(ctx, xs - 20, ys - 60, 610, 610, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      if (b.id === "coba1") {
        text(ctx, "Data yang diketik", xs, ys - 20, 24, { weight: 900, color: C.ink2 });
        const rows = [["Nama", "Kelas", "Nilai", "Remedi"]].concat(ROWS0), ws = [170, 110, 110, 180];
        rows.forEach((r, i) => { let x = xs; r.forEach((v, j) => { const y = ys + i * 48; if (i === 0) { ctx.fillStyle = L.UI.head; ctx.fillRect(x, y, ws[j], 48); }
          ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(x, y, ws[j], 48);
          text(ctx, String(v), typeof v === "number" ? x + ws[j] - 12 : x + 12, y + 33, 23, { align: typeof v === "number" ? "right" : "left", weight: i === 0 ? 800 : 600 }); x += ws[j]; }); });
      } else {
        text(ctx, "Hasil yang dituju", xs, ys - 20, 24, { weight: 900, color: C.ink2 });
        text(ctx, "Filter Remedi: belum", xs, ys + 26, 24, { weight: 800, color: BLUE });
        DESC.filter(r => r[3] === "belum").forEach((r, i) => { const y = ys + 46 + i * 48; [r[0], r[1], r[2], r[3]].forEach((v, j) => { const ws = [170, 110, 110, 180]; const x = xs + ws.slice(0, j).reduce((p, q) => p + q, 0);
          ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(x, y, ws[j], 48); text(ctx, String(v), typeof v === "number" ? x + ws[j] - 12 : x + 12, y + 33, 23, { align: typeof v === "number" ? "right" : "left", weight: 600 }); }); });
        text(ctx, "Jumlah per kelas", xs, ys + 296, 24, { weight: 800, color: BLUE });
        [["Kelas", "Jumlah"], ["8A", 6], ["8B", 4]].forEach((r, i) => r.forEach((v, j) => { const x = xs + j * 180, y = ys + 316 + i * 48; if (i === 0) { ctx.fillStyle = L.UI.head; ctx.fillRect(x, y, 180, 48); }
          ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(x, y, 180, 48); text(ctx, String(v), typeof v === "number" ? x + 166 : x + 12, y + 33, 23, { align: typeof v === "number" ? "right" : "left", weight: i === 0 ? 800 : 600 }); }));
      }
    },
    filter_buat(ctx, b, l) {
      const span = spanOf(b), t = l / span; const open = t > 0.66 && t < 0.92;
      app(ctx, { cells: cellsOf(DESC), active: t > 0.5 ? "B4" : "A2" }, { menuOn: open ? "Data" : null, funnels: t > 0.93 ? "ABCD" : null });
      if (open) dataMenu(ctx, t > 0.78 ? "Filter" : null);
      steps(ctx, "LANGKAH", ["Klik satu sel di tabel.", "Klik menu Data.", "Pilih Filter."], stepAt(t, [0.52, 0.68, 0.93]));
      const m = menuPos(ctx, "Data"), it = dataItemAt(ctx, "Filter"), [bx, by] = at("B4");
      cur(ctx, track(l, [[0, 900, 650], [0.48 * span, bx, by, 1], [0.66 * span, m.cx, m.cy + 6, 1], [0.78 * span, it[0], it[1]], [0.9 * span, it[0], it[1], 1], [1.02 * span, 1100, 640]]));
    },
    filter_corong(ctx, b, l) {
      const a = b.audio || b.dur, ph = l / a; const z = ease(clamp((ph - 0.12) / 0.15, 0, 1)) * (1 - ease(clamp((ph - 0.62) / 0.12, 0, 1)));
      const f = funnelAt("D"), draw = () => app(ctx, { cells: cellsOf(DESC), active: "B4" }, { funnels: "ABCD", fHot: ph > 0.12 ? "D" : null });
      draw();
      if (z > 0.01) { const ix = 900, iy = 400, iw = 480, ih = 300; ctx.save(); ctx.globalAlpha = z;
        ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(f.cx + 14, f.cy + 14); ctx.lineTo(ix, iy + 40); ctx.stroke();
        ctx.save(); rr(ctx, ix, iy, iw, ih, 18); ctx.clip(); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(ix, iy, iw, ih); L.zoom(ctx, f.cx - 60, f.cy + 20, 2.6, draw, ix + iw / 2, iy + ih / 2); ctx.restore();
        ctx.strokeStyle = C.accent; ctx.lineWidth = 5; rr(ctx, ix, iy, iw, ih, 18); ctx.stroke(); ctx.restore(); }
      if (z > 0.9) L.callout(ctx, 1450, 400, "Tombol corong = filter", 1380, 470, { size: 28 });
      if (ph > 0.3 && z < 0.9) "ABCD".split("").forEach(c => { const q = funnelAt(c); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(q.cx, q.cy, 22, 0, Math.PI * 2); ctx.stroke(); });
      if (ph > 0.74) { L.callout(ctx, 1450, 230, "Ada di setiap judul kolom", funnelAt("D").cx + 24, funnelAt("D").cy); note(ctx, 380, "Di aplikasi lain: Buat filter."); }
    },
    filter_pilih(ctx, b, l) {
      const span = spanOf(b), t = l / span;
      const open = t > 0.2 && t < 1, checks = { "-": t < 0.46, belum: true, sudah: t < 0.64 };
      const flt = filtered(DESC);
      if (t >= 1) app(ctx, { cells: flt.cells, active: "A1" }, { funnels: "ABCD", fActive: "D", rowLabels: flt.labels, blueRows: flt.blue });
      else app(ctx, { cells: cellsOf(DESC), active: "D1" }, { funnels: "ABCD", fHot: t > 0.1 ? "D" : null });
      if (open) filterList(ctx, "D", { checks, hot: t > 0.4 && t < 0.5 ? 1 : t > 0.58 && t < 0.68 ? 3 : t > 0.92 ? "ok" : null });
      steps(ctx, "LANGKAH", ["Klik corong di kolom Remedi.", "Hilangkan centang - dan sudah.", "Yang tercentang hanya belum.", "Klik OK."], stepAt(t, [0.22, 0.66, 0.78, 1]));
      const fl = FL("D"), fu = funnelAt("D");
      cur(ctx, track(l, [[0, 900, 600], [0.18 * span, fu.cx, fu.cy, 1], [0.44 * span, ...fl.row(1), 1], [0.62 * span, ...fl.row(3), 1], [0.97 * span, ...fl.ok, 1], [1.08 * span, 1200, 640]]));
    },
    filter_hasil(ctx, b, l) {
      const a = b.audio || b.dur, ph = l / a; const flt = filtered(DESC);
      app(ctx, { cells: flt.cells, active: "A1", marks: ph > 0.1 && ph < 0.42 ? [2, 3, 4, 5].flatMap(r => "ABCD".split("").map(c => [c + r, C.goodBg])) : [] }, { funnels: "ABCD", fActive: "D", rowLabels: flt.labels, blueRows: flt.blue, hiddenMark: ph > 0.42 ? [1, 3] : null });
      if (ph > 0.12) { card(ctx, 1450, 150, 370, 96, { fill: C.goodBg, r: 16 }); text(ctx, "4 dari 10 baris tampil", 1635, 210, 28, { align: "center", weight: 900, color: GREEN }); }
      if (ph > 0.42) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, SX + 4, rowY(1) + 3, HW - 8, RH * 5 - 6, 10); ctx.stroke(); L.callout(ctx, 230, 600, "Nomor baris melompat: 1, 6, 7, 10, 11", SX + HW / 2, rowY(6) - 2, { maxW: 520 }); }
      if (ph > 0.62) { const f = funnelAt("D"); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(f.cx, f.cy, 24, 0, Math.PI * 2); ctx.stroke(); L.callout(ctx, 930, 400, "Corong berubah: filter aktif", f.cx + 18, f.cy + 14, { maxW: 420 }); }
    },
    filter_buka(ctx, b, l) {
      const span = spanOf(b), t = l / span; const flt = filtered(DESC);
      const open = t > 0.52 && t < 0.86, done = t >= 0.86;
      if (done) app(ctx, { cells: cellsOf(DESC), active: "A1", marks: t < 0.97 ? [2, 3, 4, 5, 8, 9].flatMap(r => "ABCD".split("").map(c => [c + r, C.goodBg])) : [] }, { funnels: "ABCD" });
      else app(ctx, { cells: flt.cells, active: "A1" }, { funnels: "ABCD", fActive: "D", fHot: t > 0.45 ? "D" : null, rowLabels: flt.labels, blueRows: flt.blue });
      if (open) filterList(ctx, "D", { checks: t > 0.66 ? { "-": 1, belum: 1, sudah: 1 } : { belum: 1 }, hot: t > 0.6 && t < 0.7 ? 0 : t > 0.78 ? "ok" : null });
      if (t < 0.5) { card(ctx, 1450, 150, 370, 170, { fill: "#FFFFFF", stroke: GREEN, lw: 3, r: 16 }); para(ctx, "Enam baris lain tidak terhapus, hanya disembunyikan.", 1474, 200, 26, 330, { weight: 800, lh: 1.3 }); }
      else steps(ctx, "LANGKAH", ["Klik corong Remedi.", "Centang Pilih semua.", "Klik OK."], stepAt(t, [0.54, 0.7, 0.86]));
      if (done) L.callout(ctx, 1450, 470, "Kesepuluh baris muncul lagi ✓", colX("E") - 6, rowY(6), { fill: C.goodBg, color: GREEN, maxW: 330 });
      const fl = FL("D"), fu = funnelAt("D");
      cur(ctx, track(l, [[0, 1000, 640], [0.5 * span, fu.cx, fu.cy, 1], [0.64 * span, ...fl.row(0), 1], [0.82 * span, ...fl.ok, 1], [0.95 * span, 1200, 660]]));
    },
    hitung_siapkan(ctx, b, l) {
      action(ctx, b, l, { cells: cellsOf(DESC), active: "A1", pointer: { x: 900, y: 650 } }, [
        { wait: 1, d: 5 }, { click: "F1", d: 0.9 }, { move: "G4", d: 0.3 }, { type: "Kelas", to: "F1", d: 0.9 }, { key: "Tab", commit: true, value: { v: "Kelas", bold: true }, next: "G1", d: 0.6 }, { type: "Jumlah", to: "G1", d: 1 }, { key: "Enter", commit: true, value: { v: "Jumlah", bold: true }, next: "G2", d: 0.6 },
        { click: "F2", d: 0.8 }, { move: "G5", d: 0.3 }, { type: "8A", to: "F2", d: 0.6 }, { key: "Enter", commit: true, next: "F3", d: 0.6 }, { type: "8B", to: "F3", d: 0.6 }, { key: "Enter", commit: true, next: "F4", d: 0.6 }, { wait: 1, d: 0.6 }],
        { items: ["F1: Kelas, G1: Jumlah.", "F2: 8A, lalu Enter.", "F3: 8B, lalu Enter."], marks: [0.66, 0.84, 0.97] }, { ...FUN, mod: (st, ll, span) => { if (ll > span * 0.08 && ll < span * 0.42) st.marks = ["F1", "G1", "F2", "G2", "F3", "G3"].map(a => [a, "rgba(242,177,52,0.25)"]); } });
    },
    hitung_ketik(ctx, b, l) {
      action(ctx, b, l, { cells: cellsOf(DESC, STAGE.kecil), active: "F4", pointer: { x: 900, y: 650 } }, [
        { click: "G2", d: 0.9 }, { move: "G7", d: 0.4 }, { type: F_COUNT, to: "G2", d: 3.6 }, { wait: 1, d: 1.6 }],
        { items: ["Klik G2.", "Ketik =COUNTIF(B2:B11,F2)"], marks: [0.15, 0.75] },
        { ...FUN, mod: (st) => { const e = st.edit || { text: "" }; if (e.text.includes("B11")) st.range = ["B2", "B11"]; st.refs = e.text.includes("F2") ? [["F2", RED]] : []; },
          after: (ctx, geo, P, ll, span) => { if (ll > span * 0.76) { formulaCard(ctx, 1450, 350, 370, "ARTINYA", [["hitung sel di ", C.ink], ["B2:B11", BLUE]], { size: 28 });
            card(ctx, 1450, 490, 370, 96, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "yang isinya sama", 1470, 528, 26, { weight: 800 }); text(ctx, "dengan ", 1470, 566, 26, { weight: 800 }); text(ctx, "F2 (8A)", 1574, 566, 26, { weight: 900, color: RED }); } } });
    },
    hitung_enter(ctx, b, l) {
      const a6 = DESC.map((r, i) => r[1] === "8A" ? i + 2 : 0).filter(Boolean);
      action(ctx, b, l, { cells: cellsOf(DESC, STAGE.kecil), pointer: { x: 1100, y: 640 } }, [
        { state: { edit: { addr: "G2", text: F_COUNT } }, d: 0.4 }, { key: "Enter", commit: true, value: { v: 6, f: F_COUNT }, next: "G2", d: 0.9 }, { wait: 1, d: 3 }],
        { items: ["Tekan Enter.", "Hasilnya 6."], marks: [0.25, 0.45] },
        { ...FUN, mod: (st, ll, span) => { if (ll < span * 0.1) { st.edit = { addr: "G2", text: F_COUNT }; st.range = ["B2", "B11"]; } if (ll > span * 0.3) { st.marks = a6.map(r => ["B" + r, C.goodBg]); st.changed = ["G2"]; } },
          after: (ctx, geo, P, ll, span) => { if (ll > span * 0.3) L.callout(ctx, 1450, 330, "6 murid kelas 8A", colX("G") + CW.G, rowY(2) + 22, { fill: C.goodBg, color: GREEN });
            if (ll > span * 0.62) { formulaCard(ctx, 1450, 450, 370, "Pemisahnya titik koma?", [["=COUNTIF(B2:B11", null], [";", RED], ["F2)", null]], { size: 28, fill: "#E7F1FB", stroke: BLUE }); } } });
    },
    hitung_salin(ctx, b, l) {
      action(ctx, b, l, { cells: cellsOf(DESC, STAGE.g2), active: "G3", pointer: { x: 1100, y: 640 } }, [
        { click: "G2", d: 0.8 }, { drag: ["G2", "G3"], fill: { G3: { v: 3, f: "=COUNTIF(B3:B12,F3)" } }, d: 2.2 }, { wait: 1, d: 3 }],
        { items: ["Klik G2.", "Drag kotak kecil ke G3."], marks: [0.14, 0.5] },
        { ...FUN, mod: (st) => { if (st.dragSpan && st.dragFrac != null && !st.selTo) st.copy = ["G2", st.dragFrac > 0.5 ? "G3" : "G2"]; },
          after: (ctx, geo, P, ll, span) => { if (ll > span * 0.55) { card(ctx, 1450, 330, 370, 220, { fill: "#FFFFFF", stroke: RED, lw: 3, r: 16 }); text(ctx, "6 + 3 = 9", 1635, 400, 48, { align: "center", weight: 900 });
            text(ctx, "padahal murid ada 10 ✗", 1635, 460, 26, { align: "center", weight: 800, color: RED }); text(ctx, "Ada yang terlewat!", 1635, 510, 24, { align: "center", weight: 700, color: C.ink2 }); } } });
    },
    hitung_salah(ctx, b, l) {
      action(ctx, b, l, { cells: cellsOf(DESC, STAGE.g3salah), active: "G2", pointer: { x: 1100, y: 640 } }, [{ click: "G3", d: 1 }, { move: "G8", d: 0.5 }, { wait: 1, d: 3.5 }],
        { items: ["Klik G3.", "Lihat bilah rumus."], marks: [0.2, 0.3] },
        { ...FUN, mod: (st, ll, span) => { if (ll > span * 0.3) { st.range = ["B3", "B11"]; st.refs = [["F3", RED]]; } if (ll > span * 0.55) st.marks = [["A2", C.badBg], ["B2", C.badBg]]; },
          after: (ctx, geo, P, ll, span) => {
            if (ll > span * 0.3) { const q = cellQ("B3"); ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.setLineDash([9, 6]); ctx.strokeRect(q.x + 2, q.y + 2, q.w - 4, rowY(12) - q.y - 2); ctx.setLineDash([]);
              formulaCard(ctx, 1450, 320, 370, "Rumus di G3", [["=COUNTIF(", null], ["B3:B12", RED], [",F3)", null]], { size: 30 }); }
            if (ll > span * 0.55) L.callout(ctx, 1450, 480, "B2 (Lina, 8B) tidak dihitung ✗", null, null, { fill: "#FDF1F0", color: RED, maxW: 330 }); } });
    },
    hitung_dolar(ctx, b, l) {
      action(ctx, b, l, { cells: cellsOf(DESC, STAGE.g3salah), active: "G3", pointer: { x: 1100, y: 640 } }, [
        { wait: 1, d: 1.6 }, { click: "G2", d: 0.8 }, { move: "G7", d: 0.4 }, { state: { edit: { addr: "G2", text: "=COUNTIF(" } }, d: 0.4 }, { type: "$B$2:$B$11,F2)", prefix: "=COUNTIF(", to: "G2", d: 3 },
        { key: "Enter", commit: true, value: { v: 6, f: F_FIX }, next: "G2", d: 0.8 }, { wait: 1, d: 1.6 }],
        { items: ["Klik G2.", "Ubah rentang: $B$2:$B$11", "Tekan Enter."], marks: [0.28, 0.72, 0.8] },
        { ...FUN, mod: (st) => { if (st.edit && st.edit.text.length > 16) st.range = ["B2", "B11"]; },
          after: (ctx, geo, P, ll, span) => { if (ll > span * 0.55) { formulaCard(ctx, 1450, 400, 370, "Rentang dikunci", [["=COUNTIF(", null], ["$", RED], ["B", null], ["$", RED], ["2:", null], ["$", RED], ["B", null], ["$", RED], ["11,F2)", null]], { size: 28 });
            L.callout(ctx, 1450, 550, "$ = kunci: alamat tidak ikut bergeser saat disalin.", null, null, { size: 22, maxW: 330 });
            if (ll > span * 0.8) note(ctx, 660, "Tips: di banyak aplikasi, tombol F4 menambahkan tanda $."); } } });
    },
    hitung_benar(ctx, b, l) {
      action(ctx, b, l, { cells: cellsOf(DESC, STAGE.g2fix), active: "G3", pointer: { x: 1100, y: 640 } }, [
        { click: "G2", d: 0.7 }, { drag: ["G2", "G3"], fill: { G3: { v: 4, f: "=COUNTIF($B$2:$B$11,F3)" } }, d: 2 }, { click: "G3", d: 0.8 }, { move: "G8", d: 0.4 }, { wait: 1, d: 2.2 }],
        { items: ["Drag kotak kecil G2 ke G3.", "Klik G3: rentang tetap."], marks: [0.45, 0.6] },
        { ...FUN, mod: (st, ll, span) => { if (st.dragSpan && st.dragFrac != null && !st.selTo) st.copy = ["G2", st.dragFrac > 0.5 ? "G3" : "G2"]; if (ll > span * 0.55) { st.range = ["B2", "B11"]; st.changed = ["G3"]; } },
          after: (ctx, geo, P, ll, span) => { if (ll > span * 0.55) { card(ctx, 1450, 350, 370, 190, { fill: "#FFFFFF", stroke: GREEN, lw: 3, r: 16 }); text(ctx, "6 + 4 = 10", 1635, 420, 48, { align: "center", weight: 900 });
            text(ctx, "cocok dengan 10 murid ✓", 1635, 482, 26, { align: "center", weight: 800, color: GREEN }); } } });
    },
    hitung_syarat(ctx, b, l) {
      action(ctx, b, l, { cells: cellsOf(DESC, STAGE.g3fix), active: "G3", pointer: { x: 1100, y: 640 } }, [
        { set: { F5: { v: "Nilai < 70", bold: true } }, flash: true, d: 0.6 }, { click: "G5", d: 0.8 }, { move: "G9", d: 0.4 }, { type: F_LT, to: "G5", d: 3.8 }, { wait: 1, d: 1.2 }],
        { items: ["F5: Nilai < 70.", "Klik G5.", "Ketik =COUNTIF(C2:C11,\"<70\")"], marks: [0.1, 0.22, 0.82] },
        { ...FUN, mod: (st) => { const e = st.edit || { text: "" }; if (e.text.includes("C11")) st.range = ["C2", "C11"]; },
          after: (ctx, geo, P, ll, span) => { if (ll > span * 0.84) formulaCard(ctx, 1450, 420, 370, "Syarat ditulis dalam tanda kutip", [['"<70"', RED], [" = kurang dari 70", C.ink]], { size: 28 }); } });
    },
    hitung_syarat_hasil(ctx, b, l) {
      const lt = DESC.map((r, i) => r[2] < 70 ? i + 2 : 0).filter(Boolean);
      action(ctx, b, l, { cells: cellsOf(DESC, { ...STAGE.g3fix, F5: { v: "Nilai < 70", bold: true } }), pointer: { x: 1100, y: 660 } }, [
        { state: { edit: { addr: "G5", text: F_LT } }, d: 0.4 }, { key: "Enter", commit: true, value: { v: 6, f: F_LT }, next: "G5", d: 0.9 }, { wait: 1, d: 3 }],
        { items: ["Tekan Enter.", "Hasilnya 6."], marks: [0.25, 0.4] },
        { ...FUN, mod: (st, ll, span) => { if (ll < span * 0.1) st.edit = { addr: "G5", text: F_LT }; if (ll > span * 0.3) { st.marks = lt.map(r => ["C" + r, C.goodBg]); st.changed = ["G5"]; } },
          after: (ctx, geo, P, ll, span) => { if (ll > span * 0.32) L.callout(ctx, 1450, 330, "6 murid nilainya di bawah 70", colX("G") + CW.G, rowY(5) + 22, { fill: C.goodBg, color: GREEN, maxW: 330 }); } });
    },
    periksa(ctx, b, l) {
      app(ctx, { cells: cellsOf(DESC, STAGE.lt), active: "G2", marks: [["A2", C.goodBg], ["C2", C.goodBg], ["G2", C.goodBg], ["G3", C.goodBg], ["G5", C.goodBg]] }, { ...FUN });
      const items = [["Paling atas", "Lina 91"], ["Filter belum", "4 baris"], ["Kelas 8A", "6"], ["Kelas 8B", "4"], ["Di bawah 70", "6"]];
      card(ctx, 1450, 150, 370, 110 + items.length * 84, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILMU", 1635, 200, 24, { align: "center", weight: 900, color: C.accentDark });
      const a = b.audio || b.dur;
      items.forEach(([k, v], i) => { const on = l > a * [0.1, 0.24, 0.48, 0.63, 0.76][i]; const y = 228 + i * 84;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 1470, y, 330, 70, 12); ctx.fill();
        text(ctx, k, 1490, y + 44, 24, { weight: 700 }); text(ctx, v + (on ? " ✓" : ""), 1785, y + 45, 26, { align: "right", weight: 900, color: on ? GREEN : C.ink2 }); });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D8.2", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "latihan kartu nilai", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d82", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "urutkan, saring, kelompokkan", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Catat jajanan kesukaan sepuluh temanmu, lalu hitung tiap jenis dengan COUNTIF.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      text(ctx, "=COUNTIF($B$2:$B$11,D2)", 1310, 640, 26, { align: "center", weight: 800, color: L.UI.formula });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
