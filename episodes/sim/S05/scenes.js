/* S05 Simulasi praktik: membersihkan data terbuka dari file CSV di lembar kerja generik (metadata, impor dengan pemisah titik koma,
   filter sel kosong, Cari dan ganti kode 999/-1, Hapus duplikat, format seragam, lembar "catatan").
   Jendela aplikasi x 80–1440 (y 122–830; kisi y 284–788, tab lembar y 790–826), panel langkah x 1470–1830.
   Semua data rekaan: portal data.kotatunas.example, Stasiun Tunas, curah hujan Januari–Oktober 2026. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, W = K.web, G = K.grafik;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 80, y: 122, w: 1360, h: 708 };
  const MENUS = ["File", "Edit", "Tampilan", "Sisipkan", "Format", "Data"];
  const CW = { A: 180, B: 265, C: 195, D: 50, E: 220, F: 230 };
  const CWN = { A: 70, B: 340, C: 300, D: 480 };                     // lembar catatan
  const RH = 36, ROWS = 13, SX = WIN.x + 14, GY = WIN.y + 46 + 40 + 76, HW = 60;
  const TY = GY + RH * (ROWS + 1) + 2;                                // bilah tab lembar
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";
  const YEL = "rgba(242,177,52,0.30)", REDBG = "rgba(217,68,59,0.16)";

  // ---------- data (rekaan) ----------
  const HEAD = { A1: { v: "bulan", bold: true }, B1: { v: "curah_hujan_mm", bold: true }, C1: { v: "hari_hujan", bold: true } };
  const RAW = [["2026-01", 312, 21], ["2026-02", 285, 19], ["Mar 2026", 254, ""], ["2026-04", 198, 14], ["2026-05", 999, 10], ["2026-06", 96, 7],
               ["2026-06", 96, 7], ["", "", ""], ["07/2026", 64, 5], ["2026-08", "41 mm", 3], ["2026-09", 75, -1], ["2026-10", 156, 11]];
  const ST1 = RAW.filter((r, i) => i !== 7);                                            // baris kosong dihapus
  const ST2 = ST1.map(r => [r[0], r[1] === 999 ? "" : r[1], r[2] === -1 ? "" : r[2]]);  // 999 dan -1 dikosongkan
  const ST3 = ST2.filter((r, i) => i !== 6);                                            // Juni kembar dihapus
  const ST4 = ST3.map(r => [r[0] === "Mar 2026" ? "2026-03" : r[0] === "07/2026" ? "2026-07" : r[0], r[1] === "41 mm" ? 41 : r[1], r[2]]);
  function cellsOf(rows, extra) {
    const c = { ...HEAD }; rows.forEach((r, i) => "ABC".split("").forEach((col, j) => { if (r[j] !== "") c[col + (i + 2)] = r[j]; }));
    return Object.assign(c, extra || {});
  }
  const CSV_LINES = ["bulan;curah_hujan_mm;hari_hujan", ...RAW.map(r => r.join(";"))];
  // lembar catatan
  const CAT = [["Baris 9 kosong semua", "Baris dihapus", "Tidak berisi data"],
               ["hari_hujan Maret kosong", "Dibiarkan kosong", "Tidak ada data; 0 = tidak hujan"],
               ["curah_hujan Mei = 999", "Diganti kosong", "Metadata: 999 = tidak ada data"],
               ["hari_hujan Sep = -1", "Diganti kosong", "Metadata: -1 = tidak ada data"],
               ["Juni tercatat dua kali", "1 baris dihapus", "Baris kembar"],
               ["Bulan: 3 bentuk tulisan", "Diseragamkan 2026-MM", "Supaya bisa diurutkan"],
               ["Agustus \"41 mm\" (teks)", "\" mm\" dihapus", "Supaya terbaca sebagai angka"]];
  const CAT_HEAD = { A1: { v: "No", bold: true }, B1: { v: "Masalah", bold: true }, C1: { v: "Tindakan", bold: true }, D1: { v: "Alasan", bold: true } };
  function catCells(n, partial) {          // n baris lengkap; partial = {row: i, u: 0..1} baris yang sedang diketik
    const c = { ...CAT_HEAD };
    CAT.forEach((r, i) => { if (i < n) { c["A" + (i + 2)] = i + 1; c["B" + (i + 2)] = r[0]; c["C" + (i + 2)] = r[1]; c["D" + (i + 2)] = r[2]; } });
    if (partial && partial.row < CAT.length) { const i = partial.row, r = CAT[i], u = partial.u;
      c["A" + (i + 2)] = i + 1; const s = [r[0], r[1], r[2]]; let rem = u * 3;
      s.forEach((v, j) => { const k = clamp(rem - j, 0, 1); if (k > 0) c["BCD"[j] + (i + 2)] = v.slice(0, Math.round(v.length * k)); }); }
    return c;
  }
  const AVG_RAW = 253.5, AVG_CLEAN = 164.6;   // (312+285+254+198+999+96+96+64+75+156)/10 dan 1481/9

  // ---------- geometri ----------
  const COLS = "ABCDEF";
  const colX = (c, cw = CW) => { let x = SX + HW; const cs = Object.keys(cw); for (let i = 0; i < cs.indexOf(c); i++) x += cw[cs[i]]; return x; };
  const rowY = r => GY + RH * r;
  const cellQ = (a, cw = CW) => { const c = a[0], r = parseInt(a.slice(1)); return { x: colX(c, cw), y: rowY(r), w: cw[c], h: RH, cx: colX(c, cw) + cw[c] / 2, cy: rowY(r) + RH / 2 }; };
  const at = (a, cw) => { const q = cellQ(a, cw); return [q.x + Math.min(q.w * 0.62, 120), q.y + q.h * 0.62]; };
  function menuPos(ctx, name) {
    let mx = WIN.x + 24; ctx.font = "600 21px Inter";
    for (const m of MENUS) { const mw = ctx.measureText(m).width + 24; if (m === name) return { x: mx - 8, w: mw, cx: mx + 4 + (mw - 24) / 2, cy: WIN.y + 46 + 20 }; mx += mw + 6; }
  }
  const funnelAt = col => { const q = cellQ(col + "1"); return { x: q.x + q.w - 34, y: q.y + 5, cx: q.x + q.w - 20, cy: q.y + 18 }; };
  const rowHeadAt = r => [SX + HW / 2, rowY(r) + RH / 2];

  // ---------- jendela + lembar kerja ----------
  function funnel(ctx, col, active, hot) {
    const f = funnelAt(col), s = 26;
    ctx.fillStyle = active ? "#DCE9F7" : hot ? "#FFF3D6" : "#FFFFFF"; rr(ctx, f.x, f.y, s, s, 6); ctx.fill();
    ctx.strokeStyle = active ? BLUE : "#9AA8B1"; ctx.lineWidth = 1.5; rr(ctx, f.x, f.y, s, s, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(f.x + 5, f.y + 7); ctx.lineTo(f.x + 21, f.y + 7); ctx.lineTo(f.x + 15, f.y + 14); ctx.lineTo(f.x + 15, f.y + 21); ctx.lineTo(f.x + 11, f.y + 19); ctx.lineTo(f.x + 11, f.y + 14); ctx.closePath();
    if (active) { ctx.fillStyle = BLUE; ctx.fill(); } else { ctx.strokeStyle = "#5B6B76"; ctx.lineWidth = 2; ctx.stroke(); }
  }
  // tab lembar di bawah kisi: list = [{name, edit, caret}], active = nama; mengembalikan posisi {plus, tab(name)}
  function sheetTabs(ctx, list, active, opt = {}) {
    const x0 = WIN.x + 2, w = WIN.w - 4;
    ctx.fillStyle = "#F2F5F7"; ctx.fillRect(x0, TY, w, 34); ctx.fillStyle = L.UI.grid; ctx.fillRect(x0, TY, w, 1.5);
    const plus = { x: x0 + 34, y: TY + 17 };
    ctx.fillStyle = opt.plusHot ? "#FFF3D6" : "#FFFFFF"; rr(ctx, plus.x - 16, TY + 3, 32, 28, 6); ctx.fill(); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1.5; rr(ctx, plus.x - 16, TY + 3, 32, 28, 6); ctx.stroke();
    text(ctx, "+", plus.x, TY + 26, 26, { align: "center", weight: 800, color: L.UI.menuInk });
    let tx = x0 + 70; const pos = {};
    list.forEach(t => { const name = t.edit != null ? t.edit : t.name; ctx.font = "700 21px Inter"; const tw = Math.max(90, ctx.measureText(name).width + 44); const on = t.name === active;
      ctx.fillStyle = on ? "#FFFFFF" : "#E6ECF0"; rr(ctx, tx, TY + 2, tw, 30, 6); ctx.fill();
      if (on) { ctx.fillStyle = BLUE; ctx.fillRect(tx + 6, TY + 29, tw - 12, 3); }
      if (t.edit != null) { ctx.strokeStyle = BLUE; ctx.lineWidth = 2; rr(ctx, tx + 4, TY + 4, tw - 8, 26, 4); ctx.stroke(); }
      text(ctx, name, tx + tw / 2, TY + 24, 21, { align: "center", weight: 700, color: on ? BLUE : L.UI.menuInk });
      if (t.edit != null && t.caret) { const cw = ctx.measureText(name).width; ctx.fillStyle = C.ink; ctx.fillRect(tx + tw / 2 + cw / 2 + 2, TY + 8, 2, 20); }
      pos[t.name] = { x: tx + tw / 2, y: TY + 17 }; tx += tw + 6; });
    return { plus, tab: n => pos[n] };
  }
  // opt: cells, sel (state L.sheet tambahan), menuOn, title, tabs, tab, cat (lembar catatan), rowLabels, blueRows, funnels, fActive, fHot, plusHot
  function app(ctx, opt = {}) {
    L.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: opt.title || "Curah Hujan 2026 — Lembar Kerja", menus: MENUS, menuOn: opt.menuOn });
    const cat = opt.tab === "catatan";
    const geo = L.sheet(ctx, { x: SX, y: WIN.y + 86 }, { cols: cat ? 4 : 6, rows: ROWS, rh: RH, cw: cat ? CWN : CW, cells: opt.cells || {}, ...(opt.sel || {}) });
    if (opt.rowLabels) opt.rowLabels.forEach((n, i) => { const y = rowY(i + 1); const blue = (opt.blueRows || []).includes(n);
      ctx.fillStyle = L.UI.head; ctx.fillRect(SX + 1, y + 1, HW - 2, RH - 2);
      text(ctx, String(n), SX + HW / 2, y + RH / 2 + 8, 22, { align: "center", weight: 800, color: blue ? BLUE : L.UI.headInk }); });
    if (opt.funnels) opt.funnels.split("").forEach(c => funnel(ctx, c, opt.fActive === c, opt.fHot === c));
    if (opt.after) opt.after(geo);
    const tabs = sheetTabs(ctx, opt.tabs || [{ name: "data" }], opt.tab || "data", { plusHot: opt.plusHot });
    return { sheet: geo, tabs };
  }
  const TABS2 = [{ name: "data" }, { name: "catatan" }];

  // ---------- menu, dialog, kontrol ----------
  // daftar menu di bawah nama menu; items: teks ("-" garis pemisah); mengembalikan item(i) titik tengah
  function menuList(ctx, name, items, hi, opt = {}) {
    const m = menuPos(ctx, name); const x = opt.x || m.x, y = opt.y || WIN.y + 88, w = opt.w || 330; let yy = y + 8; const pos = [];
    const hh = 16 + items.reduce((a, s) => a + (s === "-" ? 12 : 44), 0);
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 5; card(ctx, x, y, w, hh, { fill: "#FFFFFF", r: 10 }); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, hh, 10); ctx.stroke();
    items.forEach((s, i) => {
      if (s === "-") { ctx.fillStyle = "#E1E7EB"; ctx.fillRect(x + 12, yy + 5, w - 24, 2); pos.push(null); yy += 12; return; }
      const on = s === hi || i === hi; if (on) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(x + 4, yy, w - 8, 42); }
      const parts = s.split("|"); text(ctx, parts[0], x + 22, yy + 29, 22, { weight: 600, color: on ? BLUE : C.ink });
      if (parts[1]) text(ctx, parts[1], x + w - 18, yy + 29, 19, { align: "right", weight: 600, color: C.ink2 });
      pos.push({ x: x + Math.min(w * 0.55, 190), y: yy + 22 }); yy += 44; });
    return { item: i => pos[i], x, y, w, h: hh };
  }
  function dialogBox(ctx, x, y, w, h, title) {
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.28)"; ctx.shadowBlur = 34; ctx.shadowOffsetY = 10; card(ctx, x, y, w, h, { fill: "#FFFFFF", r: 16 }); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 16); ctx.stroke();
    text(ctx, title, x + 28, y + 50, 29, { weight: 900 });
    text(ctx, "✕", x + w - 32, y + 46, 24, { align: "center", weight: 700, color: C.ink2 });
  }
  function checkbox(ctx, x, y, on, label, opt = {}) {
    if (opt.hot) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x - 8, y - 8, opt.hotW || 420, 42, 8); ctx.fill(); }
    ctx.fillStyle = on ? BLUE : "#FFFFFF"; rr(ctx, x, y, 26, 26, 5); ctx.fill(); ctx.strokeStyle = on ? BLUE : "#7C8A94"; ctx.lineWidth = 2; rr(ctx, x, y, 26, 26, 5); ctx.stroke();
    if (on === "part") { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + 6, y + 11, 14, 4); }
    else if (on) { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(x + 6, y + 13); ctx.lineTo(x + 11, y + 19); ctx.lineTo(x + 20, y + 7); ctx.stroke(); }
    text(ctx, label, x + 40, y + 21, opt.size || 23, { weight: opt.bold ? 800 : 600, color: opt.color || C.ink });
  }
  function radio(ctx, x, y, on, label, hot) {
    if (hot) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x - 22, y - 20, 260, 40, 8); ctx.fill(); }
    ctx.strokeStyle = on ? BLUE : "#7C8A94"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
    if (on) { ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(x, y, 6.5, 0, Math.PI * 2); ctx.fill(); }
    text(ctx, label, x + 24, y + 8, 23, { weight: on ? 800 : 600, color: on ? BLUE : C.ink });
  }
  function button(ctx, x, y, w, label, primary, hot) {
    card(ctx, x, y, w, 50, { fill: primary ? (hot ? "#155FA6" : BLUE) : (hot ? "#E6ECF0" : "#F4F6F5"), stroke: primary ? null : "#C9D4DB", lw: 2, r: 10 });
    if (hot) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, x - 4, y - 4, w + 8, 58, 12); ctx.stroke(); }
    text(ctx, label, x + w / 2, y + 33, 22, { align: "center", weight: 800, color: primary ? "#FFFFFF" : C.ink });
    return { x: x + w / 2, y: y + 25 };
  }
  function inputBox(ctx, x, y, w, label, value, opt = {}) {
    text(ctx, label, x, y - 10, 20, { weight: 700, color: C.ink2 });
    card(ctx, x, y, w, 48, { fill: "#FFFFFF", stroke: opt.focus ? BLUE : "#C9D4DB", lw: opt.focus ? 3 : 2, r: 8 });
    const v = value || ""; text(ctx, v || opt.ph || "", x + 14, y + 32, 24, { weight: 700, color: v ? C.ink : "#A9B6BE" });
    if (opt.space && v.startsWith(" ")) { ctx.fillStyle = "rgba(242,177,52,0.45)"; rr(ctx, x + 13, y + 10, 8, 28, 2); ctx.fill(); }
    if (opt.caret) { ctx.font = "700 24px Inter"; const cw = ctx.measureText(v).width; ctx.fillStyle = C.ink; ctx.fillRect(x + 16 + cw, y + 10, 2.5, 28); }
    return { x: x + w / 2, y: y + 24 };
  }

  // ---------- pointer berdasarkan titik-kunci: [[detik, x, y, klik?, jenis?, tahan?]] ----------
  function track(l, keys) {
    if (!keys || !keys.length) return null;
    if (l <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], click: 0, kind: keys[0][4] || "arrow" };
    let i = 0; while (i + 1 < keys.length && l >= keys[i + 1][0]) i++;
    const k = keys[i], n = keys[i + 1]; let x = k[1], y = k[2], kind = k[4] || "arrow", down = !!k[5];
    if (n) { const mv = Math.min(0.7, (n[0] - k[0]) * 0.8); const u = ease((l - (n[0] - mv)) / mv); x = lerp(k[1], n[1], u); y = lerp(k[2], n[2], u); if (u > 0) { down = !!(k[5] && n[5]); if (n[4]) kind = n[4]; } }
    const dt = l - k[0]; const click = k[3] && dt < 0.45 ? dt / 0.45 : 0;
    return { x, y, click, kind, down };
  }
  const cur = (ctx, p) => { if (p) L.cursor(ctx, p.x, p.y, { kind: p.kind, click: p.click, down: p.down }); };
  const A_ = b => b.audio || b.dur;
  // detik dalam beat saat frasa mulai dibacakan (perkiraan: sebanding dengan posisi huruf)
  const ph = (b, s, off = 0) => { const tx = b.src_text || b.text, i = tx.indexOf(s); return (i < 0 ? 0 : i / tx.length) * A_(b) + off; };
  const typed = (s, l, t0, t1) => s.slice(0, Math.round(s.length * clamp((l - t0) / (t1 - t0), 0, 1)));
  const fade = (l, t0, d = 0.35) => ease(clamp((l - t0) / d, 0, 1));

  // ---------- panel langkah (kanan) ----------
  function steps(ctx, title, items, n, opt = {}) {
    const x = 1470, y = opt.y || 122, w = 360; let hh = 70;
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
  const stepAt = (l, marks) => { let n = 0; marks.forEach((m, i) => { if (l >= m) n = i + 1; }); return n; };
  const note = (ctx, y, s, opt = {}) => L.callout(ctx, 1470, y, s, null, null, { size: 22, maxW: 320, fill: opt.fill || "#E7F1FB", color: opt.color || BLUE });
  const ring = (ctx, x, y, w, h, col) => { ctx.strokeStyle = col || C.accent; ctx.lineWidth = 4; rr(ctx, x, y, w, h, 8); ctx.stroke(); };
  const ringCell = (ctx, a, col, cw) => { const q = cellQ(a, cw); ring(ctx, q.x - 3, q.y - 3, q.w + 6, q.h + 6, col); };
  const ringRow = (ctx, r, col, c0 = "A", c1 = "C") => { const a = cellQ(c0 + r), z = cellQ(c1 + r); ring(ctx, a.x - 3, a.y - 3, z.x + z.w - a.x + 6, RH + 6, col); };
  function cross(ctx, x, y, s, col) { ctx.strokeStyle = col || RED; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke(); ctx.lineCap = "butt"; }
  function toast(ctx, x, y, w, s, col) {
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 5; card(ctx, x, y, w, 64, { fill: "#24313A", r: 12 }); ctx.restore();
    text(ctx, s, x + 24, y + 41, 23, { weight: 700, color: col || "#FFFFFF", fit: w - 40 });
  }
  // lembar catatan dengan n baris lengkap dan baris berikutnya diketik pada kemajuan u
  function catSheet(ctx, n, opt = {}) {
    const cells = catCells(n, opt.partial);
    const o = app(ctx, { cells, tab: "catatan", tabs: TABS2, sel: { active: opt.active || (opt.partial ? "D" + (opt.partial.row + 2) : "A" + (n + 2)), changed: opt.changed || [] }, ...(opt.app || {}) });
    if (opt.footer) { text(ctx, "Hasil: 12 baris data → 10 baris bersih", colX("B", CWN) + 12, rowY(10) + 26, 24, { weight: 800, color: GREEN });
      text(ctx, "Sumber: data.kotatunas.example (diunduh 4 Nov 2026)", colX("B", CWN) + 12, rowY(11) + 26, 24, { weight: 600, color: C.ink2 }); }
    return o;
  }

  // ---------- dialog Impor ----------
  const IMP = { x: 330, y: 230, w: 900, h: 560 };
  const SEPS = ["Deteksi otomatis", "Tab", "Koma", "Titik koma"];
  function importDialog(ctx, sep, hot, btnHot) {
    const { x, y, w, h } = IMP; dialogBox(ctx, x, y, w, h, "Impor file");
    text(ctx, "📄 curah_hujan_2026.csv", x + 28, y + 92, 23, { weight: 700, color: C.ink2 });
    text(ctx, "Jenis pemisah", x + 28, y + 140, 22, { weight: 800 });
    SEPS.forEach((s, i) => radio(ctx, x + 48, y + 180 + i * 46, sep === s, s, hot === s));
    // pratinjau
    const px = x + 330, py = y + 120, pw = w - 360, cols = sep === "Titik koma" ? 3 : 1;
    text(ctx, "Pratinjau", px, py + 12, 22, { weight: 800 });
    const cws = cols === 3 ? [130, 200, 140] : [470]; const ty = py + 28;
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(px, ty, pw, 300); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; ctx.strokeRect(px, ty, pw, 300);
    ctx.fillStyle = L.UI.head; ctx.fillRect(px, ty, pw, 34);
    let cx = px; cws.forEach((cw, j) => { text(ctx, "ABC"[j], cx + cw / 2, ty + 24, 19, { align: "center", weight: 700, color: L.UI.headInk }); cx += cw; ctx.fillStyle = L.UI.grid; ctx.fillRect(cx, ty, 1.5, 300); });
    CSV_LINES.slice(0, 7).forEach((ln, i) => { const yy = ty + 34 + i * 38; ctx.fillStyle = L.UI.grid; ctx.fillRect(px, yy, pw, 1.5);
      if (cols === 1) { ctx.save(); ctx.beginPath(); ctx.rect(px, yy, pw - 4, 38); ctx.clip(); text(ctx, ln, px + 10, yy + 27, 20, { weight: i === 0 ? 800 : 600, color: C.ink }); ctx.restore(); }
      else { let xx = px; ln.split(";").forEach((v, j) => { const isN = v !== "" && !isNaN(+v); ctx.save(); ctx.beginPath(); ctx.rect(xx, yy, cws[j], 38); ctx.clip();
        text(ctx, v, isN ? xx + cws[j] - 10 : xx + 10, yy + 27, 20, { align: isN ? "right" : "left", weight: i === 0 ? 800 : 600 }); ctx.restore(); xx += cws[j]; }); } });
    const b1 = button(ctx, x + w - 360, y + h - 76, 150, "Batal", false), b2 = button(ctx, x + w - 190, y + h - 76, 162, "Impor data", true, btnHot);
    return { sep: s => ({ x: x + 48, y: y + 180 + SEPS.indexOf(s) * 46 }), ok: b2, preview: { x: px, y: ty, w: pw, h: 300 } };
  }

  // ---------- dialog Cari dan ganti ----------
  const FND = { x: 760, y: 300, w: 640, h: 440 };
  function findDialog(ctx, st) {
    const { x, y, w, h } = FND; dialogBox(ctx, x, y, w, h, "Cari dan ganti");
    const f1 = inputBox(ctx, x + 28, y + 110, w - 56, "Cari", st.find, { focus: st.focus === "find", caret: st.focus === "find" && st.caret, space: true });
    const f2 = inputBox(ctx, x + 28, y + 200, w - 56, "Ganti dengan", st.repl, { focus: st.focus === "repl", ph: "(biarkan kosong)" });
    checkbox(ctx, x + 32, y + 276, false, "Cocokkan huruf besar/kecil", { size: 22 });
    checkbox(ctx, x + 32, y + 318, st.whole, "Cocokkan seluruh isi sel", { size: 22, bold: true, hot: st.wholeHot, hotW: 400 });
    const b1 = button(ctx, x + w - 380, y + h - 72, 170, "Ganti semua", true, st.btnHot), b2 = button(ctx, x + w - 194, y + h - 72, 166, "Selesai", false);
    return { find: f1, repl: f2, whole: { x: x + 45, y: y + 289 }, all: b1, done: b2 };
  }

  // ---------- dialog Hapus duplikat ----------
  const DUP = { x: 720, y: 270, w: 640, h: 470 };
  function dupDialog(ctx, st) {
    const { x, y, w, h } = DUP; dialogBox(ctx, x, y, w, h, "Hapus duplikat");
    text(ctx, "Rentang data: A1:C12", x + 28, y + 92, 22, { weight: 600, color: C.ink2 });
    checkbox(ctx, x + 32, y + 120, st.header, "Data memiliki baris judul", { bold: true, hot: st.headHot, hotW: 400 });
    text(ctx, "Kolom yang dianalisis", x + 28, y + 196, 22, { weight: 800 });
    const names = st.header ? ["bulan", "curah_hujan_mm", "hari_hujan"] : ["Kolom A", "Kolom B", "Kolom C"];
    checkbox(ctx, x + 32, y + 216, true, "Pilih semua", { size: 22 });
    names.forEach((s, i) => checkbox(ctx, x + 72, y + 258 + i * 40, true, s, { size: 22 }));
    const b1 = button(ctx, x + w - 410, y + h - 72, 160, "Batal", false), b2 = button(ctx, x + w - 234, y + h - 72, 206, "Hapus duplikat", true, st.btnHot);
    return { header: { x: x + 45, y: y + 133 }, ok: b2 };
  }

  // ---------- daftar filter kolom C ----------
  const FV = ["(Kosong)", "-1", "3", "5", "7", "10", "11"];
  function filterList(ctx, st) {
    const q = cellQ("C1"); const x = q.x, y = q.y + RH + 2, w = 330, h = 470;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6; card(ctx, x, y, w, h, { fill: "#FFFFFF", r: 12 }); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 12); ctx.stroke();
    text(ctx, "Saring menurut nilai", x + 22, y + 38, 22, { weight: 800 });
    const n = FV.filter(v => st.checks[v]).length, all = n === FV.length;
    const rows = [["(Pilih semua)", all ? true : n ? "part" : false], ...FV.map(v => [v, !!st.checks[v]])];
    rows.forEach(([s, on], i) => { const yy = y + 58 + i * 40; checkbox(ctx, x + 22, yy, on, s, { size: 22, bold: i === 0 || s === "(Kosong)", hot: st.hot === i, hotW: w - 28 }); });
    text(ctx, "⋮ 14, 19, 21", x + 62, y + 58 + rows.length * 40 + 14, 20, { weight: 600, color: C.ink2 });
    button(ctx, x + w - 236, y + h - 66, 100, "Batal", false); const ok = button(ctx, x + w - 124, y + h - 66, 100, "OK", true, st.hot === "ok");
    return { row: i => ({ x: x + 35, y: y + 71 + i * 40 }), ok };
  }

  // ---------- grafik batang kecil curah hujan ----------
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt"];

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["membuka file CSV dengan benar", "membersihkan sel kosong", "mengganti kode 999 dan -1", "menghapus baris kembar", "mencatat setiap langkah"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.6) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 276 + i * 92, 760, 76, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 327 + i * 92, 34, { weight: 900, color: GREEN }); text(ctx, s, 350, 326 + i * 92, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      // file CSV mentah → tabel bersih
      card(ctx, 1090, 270, 600, 200, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "curah_hujan_2026.csv", 1120, 312, 22, { weight: 800, color: C.ink2 });
      CSV_LINES.slice(4, 8).forEach((s, i) => text(ctx, s || ";;", 1120, 350 + i * 30, 22, { weight: 600, color: /999|;;$|^;/.test(s) || s === ";;" || i === 3 ? RED : C.ink }));
      text(ctx, "▼", 1390, 512, 34, { align: "center", weight: 900, color: C.accent });
      card(ctx, 1090, 540, 600, 200, { fill: "#FFFFFF", stroke: GREEN, lw: 3, r: 16 });
      [["2026-04", 198, 14], ["2026-05", "", 10], ["2026-06", 96, 7], ["2026-07", 64, 5]].forEach((r, i) => { const y = 584 + i * 38;
        text(ctx, r[0], 1120, y, 23, { weight: 700 }); text(ctx, String(r[1]), 1420, y, 23, { align: "right", weight: 700 }); text(ctx, String(r[2]), 1600, y, 23, { align: "right", weight: 700 }); });
      text(ctx, "aplikasi lembar kerja apa pun", 1390, 780, 24, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      [["F11.5", "Data Terbuka untuk Keputusan", "langkah bersihkan"], ["F11.10", "Proyek: Aplikasi Data Terbuka", "999 dan baris kembar"], ["F12.3", "Analisis Data untuk Prediksi", "data bersih dulu"]].forEach(([c, t, s], i) => {
        const x = 240 + i * 490, u = ease((l - 0.3 - i * 0.6) / 0.5); ctx.globalAlpha = Math.max(0.15, u); card(ctx, x, 280, 460, 320, { fill: i === 0 ? "#FFF3D6" : C.bg2, r: 22 });
        text(ctx, c, x + 230, 360, 54, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 230, 420, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 560, 25, { align: "center", weight: 600, color: C.ink2 }); ctx.globalAlpha = 1;
      });
      card(ctx, 520, 640, 880, 80, { fill: "#E7F1FB", r: 16 }); text(ctx, "Cara memakai filter: simulasi S03", 960, 692, 30, { align: "center", weight: 800, color: BLUE });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    },
    portal(ctx, b, l) {
      const A = A_(b), tMeta = ph(b, "Baca dulu"), tSep = ph(b, "pemisahnya"), t999 = ph(b, "999 atau");
      let dlP = null;
      const area = W.browser(ctx, 80, 122, 1040, 708, { tabs: ["Portal Data Kota Tunas"], url: "data.kotatunas.example/dataset/curah-hujan-2026" });
      W.clip(ctx, area, () => {
        const x = area.x, y = area.y;
        ctx.fillStyle = "#3D5A6C"; ctx.fillRect(x, y, area.w, 64); text(ctx, "Portal Data Kota Tunas", x + 30, y + 42, 26, { weight: 800, color: "#FFFFFF" });
        text(ctx, "Dataset · Lingkungan", x + area.w - 30, y + 42, 20, { align: "right", weight: 600, color: "#D5E3EA" });
        text(ctx, "Curah Hujan Bulanan Stasiun Tunas 2026", x + 30, y + 116, 32, { weight: 900 });
        text(ctx, "Pengukur: Stasiun Cuaca Tunas · Diperbarui 3 Nov 2026", x + 30, y + 154, 21, { weight: 600, color: C.ink2 });
        // baris file
        card(ctx, x + 30, y + 180, area.w - 60, 76, { fill: "#F7F9FA", stroke: "#D3DCE2", lw: 2, r: 12 });
        text(ctx, "📄 curah_hujan_2026.csv", x + 54, y + 228, 24, { weight: 800 }); text(ctx, "CSV · 1 KB", x + 430, y + 228, 21, { weight: 600, color: C.ink2 });
        const dl = button(ctx, x + area.w - 230, y + 193, 176, "Download", true, l > 0.86 * A);
        // metadata
        const mu = fade(l, tMeta - 0.2);
        ctx.globalAlpha = Math.max(0.35, mu);
        text(ctx, "Metadata", x + 30, y + 310, 26, { weight: 900, color: C.accentDark });
        const meta = [["Pemisah", "titik koma ( ; )", tSep], ["Satuan", "milimeter (mm)", 1e9], ["Kode khusus", "999 atau -1 = tidak ada data", t999], ["Lisensi", "boleh dipakai ulang, sebut sumber", 1e9]];
        meta.forEach(([k, v, t0], i) => { const yy = y + 336 + i * 62, on = l > t0;
          if (on) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 22, yy - 4, area.w - 44, 56, 10); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, x + 22, yy - 4, area.w - 44, 56, 10); ctx.stroke(); }
          text(ctx, k, x + 44, yy + 33, 24, { weight: 700, color: C.ink2 }); text(ctx, v, x + 280, yy + 33, 25, { weight: 800 }); });
        ctx.globalAlpha = 1;
        dlP = dl;
      });
      // isi file CSV
      card(ctx, 1150, 122, 680, 520, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "ISI FILE CSV (teks biasa)", 1180, 170, 24, { weight: 900, color: C.accentDark });
      const hiSep = l > 0.2 * A;
      CSV_LINES.slice(0, 9).forEach((ln, i) => { let xx = 1180; const yy = 216 + i * 44;
        ln.split(/(;)/).forEach(p => { const sep = p === ";"; text(ctx, p, xx, yy, 25, { weight: sep ? 900 : 600, color: sep && hiSep ? RED : C.ink }); ctx.font = `${sep ? 900 : 600} 25px Inter`; xx += ctx.measureText(p).width + (sep ? 2 : 0); }); });
      text(ctx, "⋮", 1180, 620, 26, { weight: 800, color: C.ink2 });
      if (hiSep) L.callout(ctx, 1470, 660, "; memisahkan nilai, satu baris = satu baris tabel", null, null, { size: 22, maxW: 330, fill: "#FDF1F0", color: RED });
      const d = dlP || { x: 900, y: 420 };
      cur(ctx, track(l, [[0, 700, 700], [0.7 * A, 900, 600], [0.84 * A, d.x, d.y, 1], [0.95 * A, d.x + 20, d.y + 60]]));
    },
    impor(ctx, b, l) {
      const A = A_(b), tFile = ph(b, "Klik File"), tImp = ph(b, "pilih Impor"), tPick = ph(b, "lalu pilih file"), tDlg = ph(b, "Jendela impor");
      const fileOpen = l > tFile && l < tImp + 0.5, pick = l > tImp + 0.5 && l < tDlg, dlg = l >= tDlg;
      app(ctx, { title: "Tanpa judul — Lembar Kerja", menuOn: fileOpen ? "File" : null, cells: {}, sel: { active: "A1" } });
      const items = ["Baru", "Buka", "Impor", "-", "Simpan", "Download", "Cetak|Ctrl+P"];
      let ml = null; if (fileOpen) ml = menuList(ctx, "File", items, l > tImp ? "Impor" : null);
      const m = menuPos(ctx, "File");
      const PK = { x: 380, y: 260, w: 760, h: 460 };
      if (pick) { dialogBox(ctx, PK.x, PK.y, PK.w, PK.h, "Impor file — pilih file");
        text(ctx, "Folder: Download", PK.x + 28, PK.y + 92, 22, { weight: 600, color: C.ink2 });
        [["📄 curah_hujan_2026.csv", "1 KB"], ["📄 jadwal_piket.xlsx", "8 KB"], ["🖼 foto_kemah.jpg", "2 MB"]].forEach(([s, z], i) => { const yy = PK.y + 120 + i * 58, on = i === 0 && l > tPick + 0.4;
          if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, PK.x + 20, yy, PK.w - 40, 52, 8); ctx.fill(); }
          text(ctx, s, PK.x + 40, yy + 35, 24, { weight: on ? 800 : 600, color: on ? BLUE : C.ink }); text(ctx, z, PK.x + PK.w - 44, yy + 35, 21, { align: "right", weight: 600, color: C.ink2 }); });
        button(ctx, PK.x + PK.w - 344, PK.y + PK.h - 76, 150, "Batal", false); button(ctx, PK.x + PK.w - 176, PK.y + PK.h - 76, 148, "Pilih", true, l > tDlg - 0.6); }
      if (dlg) importDialog(ctx, "Koma", null, false);
      steps(ctx, "LANGKAH", ["Klik menu File.", "Pilih Impor.", "Pilih file CSV-nya.", "Jendela impor muncul."], stepAt(l, [tFile + 0.3, tImp + 0.4, tDlg - 0.3, tDlg + 0.3]));
      if (dlg) note(ctx, 470, "Di aplikasi lain: Data → Dari Teks/CSV, atau File → Buka.");
      const it = ml ? ml.item(2) : { x: m.x + 180, y: WIN.y + 88 + 8 + 2 * 44 + 22 };
      cur(ctx, track(l, [[0, 700, 600], [tFile, m.cx, m.cy + 6, 1], [tImp, m.x + 180, WIN.y + 88 + 8 + 2 * 44 + 22], [tImp + 0.3, m.x + 180, WIN.y + 118 + 88, 1],
        [tPick + 0.3, 600, PK.y + 155, 1], [tDlg - 0.6, PK.x + PK.w - 102, PK.y + PK.h - 51, 1], [tDlg + 0.3, 1300, 720]]));
    },
    impor_pemisah(ctx, b, l) {
      const A = A_(b), tPick = ph(b, "Pilih Titik koma"), tOk = ph(b, "lalu klik Impor"), tDone = ph(b, "Kini setiap");
      const sep = l > tPick + 0.5 ? "Titik koma" : "Koma", done = l > tDone - 0.4;
      if (!done) { app(ctx, { title: "Tanpa judul — Lembar Kerja", cells: {}, sel: { active: "A1" } }); const g = importDialog(ctx, sep, l > tPick && l < tPick + 1.4 ? "Titik koma" : null, l > tOk + 0.4);
        if (l < tPick) { const p = g.preview; ring(ctx, p.x - 4, p.y + 30, 480, 270, RED); L.callout(ctx, 1470, 300, "Semua isi menumpuk di kolom A ✗", null, null, { size: 24, maxW: 320, fill: "#FDF1F0", color: RED }); }
        else { const p = g.preview; ring(ctx, p.x - 4, p.y - 4, p.w + 8, 308, GREEN); L.callout(ctx, 1470, 300, "Titik koma: tiga kolom ✓", null, null, { size: 24, maxW: 320, fill: C.goodBg, color: GREEN }); }
        const s = g.sep("Titik koma"), ok = g.ok;
        cur(ctx, track(l, [[0, 1300, 720], [tPick + 0.2, s.x, s.y, 1], [tOk + 0.3, ok.x, ok.y, 1], [tOk + 1, ok.x + 40, ok.y + 80]])); }
      else { const u = fade(l, tDone - 0.4, 0.5);
        app(ctx, { title: "curah_hujan_2026 — Lembar Kerja", cells: cellsOf(RAW), sel: { active: "A1", marks: u < 1 ? [] : [] } });
        if (l > tDone) { ["A", "B", "C"].forEach((c, i) => { const q = cellQ(c + "1"); ctx.fillStyle = "rgba(46,158,91,0.12)"; ctx.fillRect(q.x, q.y, q.w, RH * 13); ring(ctx, q.x + 2, q.y + 2, q.w - 4, RH * 13 - 4, GREEN); }); }
        L.callout(ctx, 1470, 300, "Setiap nilai di kolomnya sendiri ✓", null, null, { size: 24, maxW: 320, fill: C.goodBg, color: GREEN }); }
    },
    tinjau(ctx, b, l) {
      const t1 = ph(b, "Ada sel"), t2 = ph(b, "angka 999"), t3 = ph(b, "Juni"), t4 = ph(b, "dan tulisan");
      const marks = [];
      if (l > t1) marks.push(["C4", YEL], ["A9", YEL], ["B9", YEL], ["C9", YEL]);
      if (l > t2) marks.push(["B6", REDBG], ["C12", REDBG]);
      if (l > t3) ["A", "B", "C"].forEach(c => marks.push([c + "7", "rgba(46,126,154,0.16)"], [c + "8", "rgba(46,126,154,0.16)"]));
      if (l > t4) marks.push(["A4", "rgba(122,90,166,0.18)"], ["A10", "rgba(122,90,166,0.18)"], ["B11", "rgba(122,90,166,0.18)"]);
      app(ctx, { cells: cellsOf(RAW), sel: { active: "E2", marks } });
      const items = [["Sel kosong", YEL, t1], ["Kode 999 dan -1", REDBG, t2], ["Juni dua kali", "rgba(46,126,154,0.22)", t3], ["Tulisan berbeda", "rgba(122,90,166,0.24)", t4]];
      card(ctx, 1470, 122, 360, 110 + items.length * 84, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "MASALAH YANG TERLIHAT", 1650, 172, 23, { align: "center", weight: 900, color: C.accentDark });
      items.forEach(([s, col, t0], i) => { const on = l > t0, y = 200 + i * 84;
        ctx.fillStyle = on ? col : "#F4F6F5"; rr(ctx, 1490, y, 320, 70, 12); ctx.fill(); text(ctx, String(i + 1), 1520, y + 45, 26, { align: "center", weight: 900, color: on ? C.ink : C.muted });
        text(ctx, s, 1548, y + 44, 24, { weight: 800, color: on ? C.ink : C.muted }); });
      if (l > t3) { ringRow(ctx, 7, C.kiko); ringRow(ctx, 8, C.kiko); }
      if (l > t4) { ringCell(ctx, "A4", "#7A5AA6"); ringCell(ctx, "A10", "#7A5AA6"); ringCell(ctx, "B11", "#7A5AA6"); note(ctx, 600, "Teks rata kiri, angka rata kanan: \"41 mm\" terbaca sebagai teks.", { fill: "#F3EEF8", color: "#7A5AA6" }); }
    },
    catatan_baru(ctx, b, l) {
      const A = A_(b), tNew = 0.15 * A, tName = ph(b, "beri nama") , tHead = ph(b, "Di sini");
      const has = l > tNew + 0.4, editing = l > tName && l < tHead, named = l >= tHead;
      const tabs = !has ? [{ name: "data" }] : [{ name: "data" }, editing ? { name: "catatan", edit: typed("catatan", l, tName + 0.4, tHead - 0.3) || "Lembar2", caret: true } : { name: named ? "catatan" : "Lembar2" }];
      if (named) { const cells = { ...CAT_HEAD }; const u = clamp((l - tHead) / (0.5 * (A - tHead)), 0, 1);
        const hs = ["No", "Masalah", "Tindakan", "Alasan"]; Object.keys(cells).forEach((k, i) => { if (u * 4 < i) delete cells[k]; else if (u * 4 < i + 1) cells[k] = { v: hs[i].slice(0, Math.round(hs[i].length * (u * 4 - i))), bold: true }; });
        app(ctx, { cells, tab: "catatan", tabs: [{ name: "data" }, { name: "catatan" }], sel: { active: "A2" } });
        ["Masalah", "Tindakan", "Alasan"].forEach((s, i) => { if (u * 4 > i + 1.5) { const q = cellQ("BCD"[i] + "1", CWN); ctx.fillStyle = "rgba(242,177,52,0.18)"; ctx.fillRect(q.x + 1, q.y + 1, q.w - 2, q.h - 2); } }); }
      else { const o = app(ctx, { cells: cellsOf(RAW), tabs: tabs.map(t => ({ ...t, name: t.name === "Lembar2" && !editing ? "Lembar2" : t.name })), tab: "data", sel: { active: "E2" }, plusHot: l > tNew - 0.6 && l < tNew + 0.6 }); }
      steps(ctx, "LANGKAH", ["Klik + di bawah.", "Beri nama: catatan.", "Tulis judul kolom: No, Masalah, Tindakan, Alasan."], stepAt(l, [tNew + 0.3, tHead, A * 0.8]));
      if (named && l > A * 0.6) note(ctx, 450, "Catatan membuat pembersihanmu bisa diperiksa dan diulang orang lain.");
      const px = WIN.x + 36, py = TY + 17, tabX = WIN.x + 72 + 96 + 6 + 55;
      cur(ctx, track(l, [[0, 700, 650], [tNew, px, py, 1], [tName - 0.25, tabX, py, 1], [tName, tabX, py, 1], [tHead + 0.2, 500, 600]]));
    },
    filter_buat(ctx, b, l) {
      const A = A_(b), tCell = ph(b, "Klik satu"), tMenu = ph(b, "klik menu Data"), tItem = ph(b, "lalu pilih"), tF = ph(b, "Tanda corong");
      const open = l > tMenu && l < tF - 0.2;
      app(ctx, { cells: cellsOf(RAW), tabs: TABS2, sel: { active: l > tCell + 0.4 ? "A2" : "E2" }, menuOn: open ? "Data" : null, funnels: l > tF - 0.2 ? "ABC" : null });
      const items = ["Urutkan rentang", "Buat filter", "Pembersihan data|▸", "Pisahkan teks ke kolom"];
      if (open) menuList(ctx, "Data", items, l > tItem ? "Buat filter" : null);
      if (l > tF) { ["A", "B", "C"].forEach(c => { const f = funnelAt(c); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.cx, f.cy, 22, 0, Math.PI * 2); ctx.stroke(); }); }
      steps(ctx, "LANGKAH", ["Klik satu sel di tabel.", "Klik menu Data.", "Pilih Buat filter."], stepAt(l, [tCell + 0.4, tMenu + 0.3, tF - 0.2]));
      if (l > tF) note(ctx, 420, "Di aplikasi lain, menu ini bernama Filter atau Filter Otomatis.");
      const m = menuPos(ctx, "Data"), [ax, ay] = at("A2"), iy = WIN.y + 88 + 8 + 44 + 22;
      cur(ctx, track(l, [[0, 900, 650], [tCell + 0.2, ax, ay, 1], [tMenu + 0.1, m.cx, m.cy + 6, 1], [tItem + 0.2, m.x + 170, iy], [tF - 0.4, m.x + 170, iy, 1], [tF + 0.4, 1000, 640]]));
    },
    filter_kosong(ctx, b, l) {
      const A = A_(b), tF = ph(b, "Klik corong"), tAll = ph(b, "Hilangkan"), tK = ph(b, "centang Kosong"), tOk = ph(b, "lalu klik OK"), tRes = ph(b, "Hanya dua");
      const open = l > tF + 0.5 && l < tRes - 0.2, filtered = l >= tRes - 0.2;
      const checks = {}; FV.forEach(v => checks[v] = l < tAll + 0.5); if (l > tK + 0.4) checks["(Kosong)"] = true;
      if (filtered) {
        const cells = { ...HEAD }; [RAW[2], RAW[7]].forEach((r, i) => "ABC".split("").forEach((c, j) => { if (r[j] !== "") cells[c + (i + 2)] = r[j]; }));
        const labels = [1, 4, 9, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        app(ctx, { cells, tabs: TABS2, sel: { active: "C2" }, funnels: "ABC", fActive: "C", rowLabels: labels, blueRows: [4, 9] });
        ctx.fillStyle = "#9AA8B1"; ctx.fillRect(SX, rowY(2) - 2, HW + 900, 3); ctx.fillRect(SX, rowY(3) - 2, HW + 900, 3);
        const u = fade(l, tRes); ctx.globalAlpha = u; card(ctx, 1470, 150, 360, 96, { fill: C.goodBg, r: 16 }); text(ctx, "2 dari 12 baris tampil", 1650, 210, 28, { align: "center", weight: 900, color: GREEN }); ctx.globalAlpha = 1;
        ringRow(ctx, 2, C.accent); ringRow(ctx, 3, C.accent);
      } else {
        app(ctx, { cells: cellsOf(RAW), tabs: TABS2, sel: { active: "A2" }, funnels: "ABC", fHot: l > tF - 0.3 ? "C" : null });
        steps(ctx, "LANGKAH", ["Klik corong di kolom hari_hujan.", "Hilangkan centang Pilih semua.", "Centang (Kosong).", "Klik OK."], stepAt(l, [tF + 0.5, tAll + 0.5, tK + 0.4, tOk + 0.4]));
      }
      let fl = null; if (open) fl = filterList(ctx, { checks, hot: l > tAll && l < tAll + 0.9 ? 0 : l > tK && l < tK + 0.9 ? 1 : l > tOk ? "ok" : null });
      const f = funnelAt("C"), q = cellQ("C1"), rowP = i => ({ x: q.x + 35, y: q.y + RH + 2 + 71 + i * 40 }), okP = { x: q.x + 330 - 74, y: q.y + RH + 2 + 470 - 41 };
      cur(ctx, track(l, [[0, 900, 650], [tF + 0.2, f.cx, f.cy, 1], [tAll + 0.2, rowP(0).x, rowP(0).y, 1], [tK + 0.2, rowP(1).x, rowP(1).y, 1], [tOk + 0.2, okP.x, okP.y, 1], [tRes + 0.3, 1100, 700]]));
    },
    kosong_putus(ctx, b, l) {
      const A = A_(b), tMenu = 0.08 * A, tDel = ph(b, "jadi dihapus"), tMar = ph(b, "Hari hujan Maret"), tNol = ph(b, "Jangan diisi"), tKeep = ph(b, "Biarkan kosong");
      const deleted = l > tDel + 0.3;
      const rows = deleted ? [RAW[2]] : [RAW[2], RAW[7]], labels = deleted ? [1, 4, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] : [1, 4, 9, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      const cells = { ...HEAD }; rows.forEach((r, i) => "ABC".split("").forEach((c, j) => { if (r[j] !== "") cells[c + (i + 2)] = r[j]; }));
      const marks = []; if (!deleted) ["A3", "B3", "C3"].forEach(a => marks.push([a, "rgba(217,68,59,0.12)"]));
      if (l > tMar) marks.push(["C2", YEL]);
      app(ctx, { cells, tabs: TABS2, sel: { active: l > tMar ? "C2" : "A3", selTo: l > tMar ? null : (deleted ? null : "C3"), marks }, funnels: "ABC", fActive: "C", rowLabels: labels, blueRows: deleted ? [4] : [4, 9] });
      // menu klik kanan nomor baris
      const [rx, ry] = rowHeadAt(3); const cm = l > tMenu + 0.5 && !deleted;
      let mi = null; if (cm) mi = menuList(ctx, "File", ["Sisipkan baris di atas", "Hapus baris 9", "Sembunyikan baris"], l > tDel - 0.4 ? 1 : null, { x: rx + 30, y: ry + 10, w: 330 });
      if (!deleted && l < tMar) L.callout(ctx, 860, 430, "Baris 9: kosong seluruhnya", cellQ("C3").cx, ry, { size: 24, fill: "#FDF1F0", color: RED });
      if (deleted && l < tMar) toast(ctx, 420, 560, 420, "Baris 9 dihapus.", "#BFF0CF");
      if (l > tMar) { const q = cellQ("B2"); L.callout(ctx, 700, 420, "Curah hujan ada: 254 mm", q.x + q.w - 40, q.y + RH, { size: 24, fill: C.goodBg, color: GREEN }); }
      if (l > tNol) { const q = cellQ("C2"); const z = fade(l, tNol, 0.3);
        ctx.globalAlpha = z; text(ctx, "0", q.x + q.w - 20, q.y + 27, 28, { align: "right", weight: 900, color: RED }); if (l > tNol + 0.6) cross(ctx, q.x + q.w - 28, q.y + 18, 16); ctx.globalAlpha = 1;
        card(ctx, 1470, 150, 360, 210, { fill: "#FDF1F0", stroke: RED, lw: 3, r: 18 }); text(ctx, "JANGAN DIISI 0", 1650, 200, 26, { align: "center", weight: 900, color: RED });
        para(ctx, "0 berarti tidak hujan sama sekali.", 1650, 250, 25, 320, { align: "center", weight: 800, lh: 1.3 }); }
      if (l > tKeep) { card(ctx, 1470, 390, 360, 150, { fill: C.goodBg, stroke: GREEN, lw: 3, r: 18 }); text(ctx, "✓ BIARKAN KOSONG", 1650, 440, 26, { align: "center", weight: 900, color: GREEN });
        para(ctx, "kosong = tidak ada data", 1650, 490, 24, 320, { align: "center", weight: 700, lh: 1.3 }); }
      const it = { x: rx + 30 + 180, y: ry + 10 + 8 + 44 + 22 };
      cur(ctx, track(l, [[0, 700, 650], [tMenu, rx, ry, 1], [tDel - 0.5, it.x, it.y], [tDel, it.x, it.y, 1], [tDel + 0.6, 900, 700]]));
    },
    kosong_catat(ctx, b, l) {
      const A = A_(b), tCat = 0.05 * A, tOff = ph(b, "lalu matikan"), back = l > tOff - 0.3;
      if (!back) {
        const u = clamp((l - tCat - 0.4) / (tOff - tCat - 1.0), 0, 1) * 2; const n = Math.floor(u), part = n < 2 ? { row: n, u: u - n } : null;
        catSheet(ctx, Math.min(2, n), { partial: part, changed: n >= 2 ? ["B2", "C2", "D2", "B3", "C3", "D3"] : [] });
        steps(ctx, "LANGKAH", ["Buka lembar catatan.", "Tulis masalah, tindakan, alasan.", "Kembali ke lembar data.", "Data → Hapus filter."], stepAt(l, [tCat + 0.3, tOff - 0.5]));
        const p = { x: WIN.x + 72 + 96 + 6 + 55, y: TY + 17 };
        cur(ctx, track(l, [[0, 700, 700], [tCat, p.x, p.y, 1], [tCat + 0.8, 900, 760]]));
      } else {
        const tMenu = tOff + 0.5, tItem = tMenu + 0.9, done = l > tItem + 0.5;
        const ST1labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        if (done) app(ctx, { cells: cellsOf(ST1), tabs: TABS2, sel: { active: "A2", changed: [] } });
        else { const cells = { ...HEAD }; cells.A2 = RAW[2][0]; cells.B2 = RAW[2][1];
          app(ctx, { cells, tabs: TABS2, sel: { active: "A2" }, funnels: "ABC", fActive: "C", rowLabels: [1, 4, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], blueRows: [4], menuOn: l > tMenu ? "Data" : null });
          if (l > tMenu) menuList(ctx, "Data", ["Urutkan rentang", "Hapus filter", "Pembersihan data|▸", "Pisahkan teks ke kolom"], l > tItem - 0.4 ? "Hapus filter" : null); }
        steps(ctx, "LANGKAH", ["Buka lembar catatan.", "Tulis masalah, tindakan, alasan.", "Kembali ke lembar data.", "Data → Hapus filter."], stepAt(l, [0, 0, tOff, tItem + 0.5]));
        if (done) { const u = fade(l, tItem + 0.5); ctx.globalAlpha = u; card(ctx, 1470, 520, 360, 96, { fill: C.goodBg, r: 16 }); text(ctx, "Semua 12 baris tampil", 1650, 580, 27, { align: "center", weight: 900, color: GREEN }); ctx.globalAlpha = 1; }
        const m = menuPos(ctx, "Data"), tp = { x: WIN.x + 72 + 50, y: TY + 17 }, iy = WIN.y + 88 + 8 + 44 + 22;
        cur(ctx, track(l, [[tOff - 0.3, 900, 760], [tOff + 0.1, tp.x, tp.y, 1], [tMenu, m.cx, m.cy + 6, 1], [tItem, m.x + 170, iy, 1], [tItem + 0.6, 1000, 650]]));
      }
    },
    kode_999(ctx, b, l) {
      const A = A_(b), tMei = ph(b, "Curah hujan Mei"), tTiga = ph(b, "lebih dari"), tMeta = ph(b, "Menurut metadata");
      app(ctx, { cells: cellsOf(ST1), tabs: TABS2, sel: { active: l > tMei ? "B6" : "A2", marks: l > tMei ? [["B6", REDBG]] : [] } });
      if (l > tMei) ringCell(ctx, "B6", RED);
      const vals = ST1.filter((r, i) => i !== 6).map(r => typeof r[1] === "number" ? r[1] : 41);
      const g = fade(l, tMei + 0.3, 1.2);
      card(ctx, 870, 300, 540, 470, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      const geo = G.chart(ctx, 884, 312, 512, 446, { type: "batang", labels: MONTHS, values: vals, title: "Curah hujan (mm)", grow: g, hi: l > tTiga ? 4 : null, s: 0.85 });
      if (l > tTiga && geo.bar) { const b0 = geo.bar(0), b4 = geo.bar(4); const y312 = geo.yOf(312);
        ctx.strokeStyle = C.kiko; ctx.setLineDash([8, 6]); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(geo.plot.x, y312); ctx.lineTo(geo.plot.x + geo.plot.w, y312); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "999", b4.x + b4.w / 2, b4.y - 12, 24, { align: "center", weight: 900, color: RED }); text(ctx, "bulan terbasah: 312", geo.plot.x + geo.plot.w - 6, y312 - 10, 19, { align: "right", weight: 800, color: C.kiko }); }
      if (l > tMeta) { card(ctx, 1470, 150, 360, 250, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "METADATA", 1650, 200, 26, { align: "center", weight: 900, color: C.accentDark });
        para(ctx, "999 atau -1 = tidak ada data", 1650, 256, 27, 320, { align: "center", weight: 800, lh: 1.3 }); text(ctx, "bukan hujan sungguhan", 1650, 360, 23, { align: "center", weight: 700, color: RED }); }
    },
    ganti_999(ctx, b, l) {
      const A = A_(b), tE = ph(b, "Klik Edit"), tCg = ph(b, "lalu Cari"), tType = ph(b, "Ketik 999"), tRepl = ph(b, "biarkan"), tWhole = ph(b, "centang Cocokkan"), tAll = ph(b, "lalu klik Ganti");
      const menu = l > tE && l < tCg + 0.6, dlg = l >= tCg + 0.6, done = l > tAll + 0.5;
      const cells = cellsOf(done ? ST1.map(r => [r[0], r[1] === 999 ? "" : r[1], r[2]]) : ST1);
      app(ctx, { cells, tabs: TABS2, sel: { active: "A2", changed: done ? ["B6"] : [], marks: done ? [] : [["B6", REDBG]] }, menuOn: menu ? "Edit" : null });
      if (menu) menuList(ctx, "Edit", ["Urungkan|Ctrl+Z", "Ulangi|Ctrl+Y", "-", "Salin|Ctrl+C", "Tempel|Ctrl+V", "-", "Cari dan ganti|Ctrl+H"], l > tCg ? 6 : null, { w: 380 });
      let g = null;
      if (dlg && !done) g = findDialog(ctx, { find: typed("999", l, tType, tType + 0.8), focus: l < tRepl ? "find" : l < tWhole ? "repl" : null, caret: true, repl: "", whole: l > tWhole + 0.6, wholeHot: l > tWhole && l < tAll, btnHot: l > tAll });
      if (done) { ringCell(ctx, "B6", GREEN); toast(ctx, 830, 640, 520, "1 sel berisi 999 diganti dengan kosong.", "#BFF0CF"); }
      steps(ctx, "LANGKAH", ["Edit → Cari dan ganti.", "Cari: 999", "Ganti dengan: (kosong)", "Centang Cocokkan seluruh isi sel.", "Klik Ganti semua."], stepAt(l, [tCg + 0.6, tType + 0.8, tWhole, tWhole + 0.6, tAll + 0.5]));
      if (dlg && l < tWhole) L.keys(ctx, 1650, 640, ["Ctrl", "H"], { align: "center", size: 28 });
      if (l > tWhole && !done) note(ctx, 640, "Hanya sel yang isinya tepat 999 yang diganti.", { fill: "#FFF3D6", color: C.accent });
      const me = menuPos(ctx, "Edit"), iy = WIN.y + 88 + 8 + 2 * 44 + 12 + 2 * 44 + 12 + 22;
      const D = FND, wp = { x: D.x + 45, y: D.y + 289 }, ap = { x: D.x + D.w - 380 + 85, y: D.y + D.h - 72 + 25 }, rp = { x: D.x + 300, y: D.y + 224 };
      cur(ctx, track(l, [[0, 700, 650], [tE, me.cx, me.cy + 6, 1], [tCg, me.x + 190, iy, 1], [tRepl, rp.x, rp.y, 1], [tWhole + 0.3, wp.x, wp.y, 1], [tAll + 0.2, ap.x, ap.y, 1], [tAll + 1, ap.x + 60, ap.y + 120]]));
    },
    ganti_min1(ctx, b, l) {
      const A = A_(b), tCat = ph(b, "lalu catat"), tType = 0.06 * A, tAll = tCat - 1.0, done = l > tAll + 0.4;
      if (l < tCat) {
        const cells = cellsOf(done ? ST2 : ST1.map(r => [r[0], r[1] === 999 ? "" : r[1], r[2]]));
        app(ctx, { cells, tabs: TABS2, sel: { active: "A2", changed: done ? ["C11"] : [], marks: done ? [] : [["C11", REDBG]] } });
        if (!done) findDialog(ctx, { find: typed("-1", l, tType, tType + 0.6), focus: "find", caret: true, repl: "", whole: true, btnHot: l > tAll - 0.4 });
        else { ringCell(ctx, "C11", GREEN); toast(ctx, 830, 640, 520, "1 sel berisi -1 diganti dengan kosong.", "#BFF0CF"); }
        steps(ctx, "LANGKAH", ["Cari: -1", "Ganti dengan: (kosong)", "Cocokkan seluruh isi sel ✓", "Klik Ganti semua."], stepAt(l, [tType + 0.6, tType + 0.8, tType + 1, tAll + 0.4]));
        const ap = { x: FND.x + FND.w - 380 + 85, y: FND.y + FND.h - 72 + 25 };
        cur(ctx, track(l, [[0, 1000, 700], [tAll - 0.2, ap.x, ap.y, 1], [tAll + 0.8, ap.x + 60, ap.y + 120]]));
      } else {
        const u = clamp((l - tCat - 0.3) / Math.max(1, (A - tCat) * 0.75), 0, 1) * 2; const n = Math.floor(u);
        catSheet(ctx, 2 + Math.min(2, n), { partial: n < 2 ? { row: 2 + n, u: u - n } : null, changed: n >= 2 ? ["B4", "C4", "D4", "B5", "C5", "D5"] : [] });
        card(ctx, 1470, 150, 360, 96, { fill: "#FFF3D6", r: 16 }); text(ctx, "Catatan no. 3 dan 4", 1650, 210, 27, { align: "center", weight: 900, color: C.accentDark });
      }
    },
    duplikat(ctx, b, l) {
      const A = A_(b), tData = ph(b, "Klik Data"), tPb = ph(b, "Pembersihan"), tHd = ph(b, "Hapus duplikat."), tHead = ph(b, "Centang Data"), tOk = ph(b, "lalu klik Hapus");
      const menu = l > tData && l < tHd + 0.6, dlg = l >= tHd + 0.6;
      const marks = l < tData ? ["A", "B", "C"].flatMap(c => [[c + "7", "rgba(46,126,154,0.16)"], [c + "8", "rgba(46,126,154,0.16)"]]) : [];
      app(ctx, { cells: cellsOf(ST2), tabs: TABS2, sel: { active: "A2", marks }, menuOn: menu ? "Data" : null });
      if (l < tData) { ringRow(ctx, 7, C.kiko); ringRow(ctx, 8, C.kiko); L.callout(ctx, 900, 520, "Isi baris 7 dan 8 sama persis", cellQ("C8").x + 180, rowY(8) + 18, { size: 24, fill: "#E7F1FB", color: C.kiko }); }
      let sm = null;
      if (menu) { const ml = menuList(ctx, "Data", ["Urutkan rentang", "Buat filter", "Pembersihan data|▸", "Pisahkan teks ke kolom"], l > tPb ? 2 : null);
        if (l > tPb + 0.4) sm = menuList(ctx, "Data", ["Saran pembersihan", "Hapus duplikat", "Pangkas spasi kosong"], l > tHd - 0.3 ? 1 : null, { x: ml.x + ml.w - 6, y: ml.y + 8 + 2 * 44 - 8, w: 320 }); }
      if (dlg) dupDialog(ctx, { header: l > tHead + 0.8, headHot: l > tHead && l < tOk, btnHot: l > tOk });
      steps(ctx, "LANGKAH", ["Klik menu Data.", "Pembersihan data → Hapus duplikat.", "Centang Data memiliki baris judul.", "Klik Hapus duplikat."], stepAt(l, [tData + 0.3, tHd + 0.6, tHead + 0.8, tOk + 0.4]));
      const m = menuPos(ctx, "Data"), ml0 = { x: m.x, w: 330, y: WIN.y + 88 }, pbY = ml0.y + 8 + 2 * 44 + 22, subX = ml0.x + 330 - 6 + 170, subY = ml0.y + 8 + 2 * 44 - 8 + 8 + 44 + 22;
      const hp = { x: DUP.x + 45, y: DUP.y + 133 }, okp = { x: DUP.x + DUP.w - 234 + 103, y: DUP.y + DUP.h - 72 + 25 };
      cur(ctx, track(l, [[0, 900, 650], [tData, m.cx, m.cy + 6, 1], [tPb, m.x + 170, pbY], [tPb + 0.3, ml0.x + 300, pbY], [tHd - 0.2, subX, subY, 1], [tHead + 0.5, hp.x, hp.y, 1], [tOk + 0.2, okp.x, okp.y, 1], [tOk + 1, okp.x + 40, okp.y + 100]]));
    },
    duplikat_hasil(ctx, b, l) {
      const A = A_(b), tNote = ph(b, "Di aplikasi lain");
      const u = ease(clamp(l / 0.9, 0, 1));
      // baris 8 (Juni kedua) menghilang lalu baris di bawahnya naik
      const cells = u < 1 ? cellsOf(ST2) : cellsOf(ST3);
      app(ctx, { cells, tabs: TABS2, sel: { active: "A2", changed: u >= 1 && l < 2.5 ? [] : [], marks: u < 1 ? ["A8", "B8", "C8"].map(a => [a, `rgba(217,68,59,${0.25 * (1 - u)})`]) : [] } });
      if (u >= 1) { ringRow(ctx, 7, GREEN); text(ctx, "Juni: satu baris", cellQ("C7").x + CW.C + 20, rowY(7) + 26, 23, { weight: 800, color: GREEN }); }
      // kotak pesan
      const D = { x: 840, y: 380, w: 560, h: 230 };
      if (l > 0.5) { const z = fade(l, 0.5); ctx.globalAlpha = z; dialogBox(ctx, D.x, D.y, D.w, D.h, "Hapus duplikat");
        para(ctx, "1 baris duplikat ditemukan dan dihapus. 10 baris unik tersisa.", D.x + 28, D.y + 100, 24, D.w - 56, { weight: 700, lh: 1.35 });
        button(ctx, D.x + D.w - 140, D.y + D.h - 70, 112, "OK", true, l > A * 0.8); ctx.globalAlpha = 1; }
      if (l > tNote) note(ctx, 150, "Di aplikasi lain: Data → Hapus Duplikat.");
      card(ctx, 1470, 300, 360, 96, { fill: "#FFF3D6", r: 16 }); text(ctx, "Catatan no. 5", 1650, 360, 27, { align: "center", weight: 900, color: C.accentDark });
      cur(ctx, track(l, [[0, 1100, 700], [A * 0.78, D.x + D.w - 84, D.y + D.h - 45, 1], [A * 0.95, D.x + D.w, D.y + D.h + 80]]));
    },
    format_bulan(ctx, b, l) {
      const A = A_(b), tTiga = ph(b, "Kolom bulan"), tKetik = ph(b, "Ketik ulang"), tSame = ph(b, "tahun, strip");
      const base = cellsOf(ST3);
      const marks = [];
      if (l > tTiga && l < tKetik + 0.3) { ["A2", "A3", "A5", "A6", "A7", "A9", "A10", "A11"].forEach(a => marks.push([a, C.goodBg])); marks.push(["A4", REDBG], ["A8", REDBG]); }
      // ketik A4 lalu A8
      const s1 = tKetik + 0.2, e1 = s1 + 1.3, s2 = e1 + 0.5, e2 = s2 + 1.3;
      const cells = { ...base }; let edit = null, active = "A2", changed = [];
      if (l > s1) { active = "A4"; if (l < e1) edit = { addr: "A4", text: typed("2026-03", l, s1 + 0.2, e1 - 0.2) }; else { cells.A4 = "2026-03"; changed.push("A4"); } }
      if (l > s2) { active = "A8"; if (l < e2) edit = { addr: "A8", text: typed("2026-07", l, s2 + 0.2, e2 - 0.2) }; else { cells.A8 = "2026-07"; changed.push("A8"); active = "A9"; } }
      app(ctx, { cells, tabs: TABS2, sel: { active, edit, caret: true, changed, marks } });
      if (l > tTiga && l < s1) { [["A2", "2026-01", GREEN], ["A4", "Mar 2026", RED], ["A8", "07/2026", RED]].forEach(([a, s, col], i) => { const q = cellQ(a); L.callout(ctx, 850, 300 + i * 120, "Bentuk " + (i + 1) + ": " + s, q.x + q.w - 10, q.cy, { size: 24, fill: col === GREEN ? C.goodBg : "#FDF1F0", color: col }); }); }
      if (l > tSame) { card(ctx, 850, 520, 520, 120, { fill: C.goodBg, stroke: GREEN, lw: 3, r: 16 }); text(ctx, "tahun - bulan: 2026-03", 1110, 594, 30, { align: "center", weight: 900, color: GREEN }); }
      steps(ctx, "LANGKAH", ["Klik A4, ketik 2026-03, Enter.", "Klik A8, ketik 2026-07, Enter."], stepAt(l, [e1, e2]));
      if (l > e2) { card(ctx, 1470, 330, 360, 96, { fill: "#FFF3D6", r: 16 }); text(ctx, "Catatan no. 6", 1650, 390, 27, { align: "center", weight: 900, color: C.accentDark }); }
      if ((l > e1 - 0.4 && l < e1 + 0.1) || (l > e2 - 0.4 && l < e2 + 0.1)) L.keys(ctx, 1650, 640, ["Enter"], { align: "center", size: 30, press: 0.4 });
      const [a4x, a4y] = at("A4"), [a8x, a8y] = at("A8");
      cur(ctx, track(l, [[0, 900, 680], [s1, a4x, a4y, 1], [s2, a8x, a8y, 1], [e2 + 0.4, a8x + 200, a8y + 120]]));
    },
    format_mm(ctx, b, l) {
      const A = A_(b), tCari = ph(b, "Cari spasi"), tTanpa = ph(b, "kali ini"), tPindah = ph(b, "Angkanya pindah");
      const done = l > tPindah - 0.5, dlg = l > tCari - 0.4 && !done;
      const cells = cellsOf(done ? ST4 : ST3.map(r => [r[0] === "Mar 2026" ? "2026-03" : r[0] === "07/2026" ? "2026-07" : r[0], r[1], r[2]]));
      app(ctx, { cells, tabs: TABS2, sel: { active: done ? "B9" : "A2", changed: done ? ["B9"] : [], marks: done ? [] : [["B9", "rgba(122,90,166,0.18)"]] } });
      if (!dlg) { const q = cellQ("B9"); ringCell(ctx, "B9", done ? GREEN : "#7A5AA6");
        // garis rata kanan
        ctx.strokeStyle = done ? GREEN : C.kiko; ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(q.x + q.w - 12, rowY(2)); ctx.lineTo(q.x + q.w - 12, rowY(12)); ctx.stroke(); ctx.setLineDash([]);
        L.callout(ctx, 860, 560, done ? "41: sekarang angka, rata kanan ✓" : "\"41 mm\": teks, rata kiri", q.x + (done ? q.w - 30 : 60), q.y + RH, { size: 24, fill: done ? C.goodBg : "#F3EEF8", color: done ? GREEN : "#7A5AA6" }); }
      if (dlg) findDialog(ctx, { find: typed(" mm", l, tCari, tCari + 0.8), focus: "find", caret: true, repl: "", whole: false, wholeHot: l > tTanpa && l < tPindah - 0.6, btnHot: l > tPindah - 1.0 });
      if (dlg && l > tCari + 0.5) note(ctx, 560, "Ketik spasi dulu, lalu mm.", { fill: "#FFF3D6", color: C.accent });
      steps(ctx, "LANGKAH", ["Edit → Cari dan ganti.", "Cari: spasi mm", "Ganti dengan: (kosong)", "Tanpa centang seluruh isi sel.", "Klik Ganti semua."], stepAt(l, [tCari - 0.3, tCari + 0.8, tTanpa, tTanpa + 0.6, tPindah - 0.5]));
      if (done) { card(ctx, 1470, 560, 360, 96, { fill: "#FFF3D6", r: 16 }); text(ctx, "Catatan no. 7", 1650, 620, 27, { align: "center", weight: 900, color: C.accentDark }); }
      const ap = { x: FND.x + FND.w - 380 + 85, y: FND.y + FND.h - 72 + 25 }, wp = { x: FND.x + 45, y: FND.y + 289 };
      cur(ctx, track(l, [[0, 1000, 700], [tTanpa + 0.2, wp.x + 200, wp.y + 4], [tPindah - 0.8, ap.x, ap.y, 1], [tPindah, ap.x + 60, ap.y + 120]]));
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 260, 62, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 304, 230, 18, 60, 6); ctx.fill(); rr(ctx, 338, 230, 18, 60, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 420, 252, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 420, 296, 26, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 220, 352 + i * 88, 760, 74, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 264, 400 + i * 88, 32, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 304, 399 + i * 88, 26, { weight: 700, fit: 660 }); });
      card(ctx, 1030, 190, 680, 590, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "Data (salin ke lembar kerja)", 1060, 236, 24, { weight: 900, color: C.accentDark });
      CSV_LINES.forEach((s, i) => text(ctx, s || ";;", 1060, 280 + i * 38, 24, { weight: i ? 600 : 800, color: C.ink }));
    },
    periksa(ctx, b, l) {
      const A = A_(b), tCat = ph(b, "dan catatan"), tAvg = ph(b, "Rata-rata");
      const showCat = l > tCat - 0.2 && l < tAvg - 0.2;
      if (showCat) catSheet(ctx, 7, { footer: true, active: "A12" });
      else app(ctx, { cells: cellsOf(ST4, l > tAvg ? { E1: { v: "rata-rata", bold: true }, E2: { v: AVG_CLEAN, f: "=AVERAGE(B2:B11)" } } : {}), tabs: TABS2, sel: { active: l > tAvg ? "E2" : "A2", marks: l > tAvg ? [["E2", C.goodBg]] : [] } });
      const items = ["10 bulan, satu baris per bulan", "Angka rata kanan", "Kosong = tidak ada data", "Catatan lengkap: 7 langkah"], marks = [0.1 * A, ph(b, "angka rata"), ph(b, "angka rata") + 0.8, tCat];
      card(ctx, 1470, 122, 360, 90 + items.length * 84, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA", 1650, 170, 24, { align: "center", weight: 900, color: C.accentDark });
      items.forEach((s, i) => { const on = l > marks[i]; const y = 196 + i * 84;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 1490, y, 320, 70, 12); ctx.fill();
        para(ctx, s, 1508, y + 30, 21, 250, { weight: 800, color: on ? C.ink : C.ink2, lh: 1.15 }); if (on) text(ctx, "✓", 1796, y + 46, 30, { align: "right", weight: 900, color: GREEN }); });
      if (l > tAvg) { card(ctx, 1470, 560, 360, 230, { fill: "#FFFFFF", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "RATA-RATA CURAH HUJAN", 1650, 604, 21, { align: "center", weight: 900, color: C.ink2 });
        text(ctx, "253,5 mm", 1650, 656, 34, { align: "center", weight: 900, color: RED }); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1572, 645); ctx.lineTo(1728, 645); ctx.stroke();
        text(ctx, "sebelum dibersihkan", 1650, 684, 19, { align: "center", weight: 700, color: C.ink2 });
        text(ctx, "164,6 mm", 1650, 740, 38, { align: "center", weight: 900, color: GREEN }); text(ctx, "sesudah", 1650, 768, 19, { align: "center", weight: 700, color: C.ink2 }); }
    },
    salah_csv(ctx, b, l) {
      const A = A_(b), tOnly = ph(b, "CSV hanya"), tOk = ph(b, "Simpan sebagai"), tOrig = ph(b, "tanpa menimpa");
      text(ctx, "Menyimpan hasil pembersihan", 960, 190, 36, { align: "center", weight: 900 });
      const fileIcon = (x, y, ext, col) => { ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 90, y); ctx.lineTo(x + 120, y + 30); ctx.lineTo(x + 120, y + 150); ctx.lineTo(x, y + 150); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = col; rr(ctx, x - 14, y + 92, 110, 40, 8); ctx.fill(); text(ctx, ext, x + 41, y + 121, 24, { align: "center", weight: 900, color: "#FFFFFF" }); };
      const tabRow = (x, y, list) => list.forEach(([s, ok], i) => { const tx = x + i * 170; card(ctx, tx, y, 158, 50, { fill: ok ? "#FFFFFF" : "#F4F6F5", stroke: ok ? GREEN : RED, lw: 3, r: 10 });
        text(ctx, s, tx + 79, y + 33, 23, { align: "center", weight: 800, color: ok ? C.ink : RED }); if (!ok) cross(ctx, tx + 79, y + 25, 22); });
      // kiri: CSV
      card(ctx, 160, 240, 760, 460, { fill: "#FFFFFF", stroke: RED, lw: 4, r: 22 }); text(ctx, "✗ Simpan sebagai CSV", 540, 300, 32, { align: "center", weight: 900, color: RED });
      fileIcon(220, 350, "CSV", RED); text(ctx, "curah_hujan_2026.csv", 380, 400, 24, { weight: 800 });
      if (l > tOnly) { text(ctx, "Hanya satu lembar tersimpan:", 380, 450, 23, { weight: 700, color: C.ink2 }); tabRow(380, 474, [["data", true], ["catatan", false]]);
        para(ctx, "Lembar catatan hilang.", 540, 610, 28, 680, { align: "center", weight: 900, color: RED }); }
      // kanan: file lembar kerja
      ctx.globalAlpha = l > tOk - 0.3 ? 1 : 0.25;
      card(ctx, 1000, 240, 760, 460, { fill: "#FFFFFF", stroke: GREEN, lw: 4, r: 22 }); text(ctx, "✓ Simpan sebagai file lembar kerja", 1380, 300, 30, { align: "center", weight: 900, color: GREEN });
      fileIcon(1060, 350, "XLSX", GREEN); text(ctx, "curah_hujan_2026_bersih", 1220, 400, 24, { weight: 800 });
      text(ctx, "Semua lembar tersimpan:", 1220, 450, 23, { weight: 700, color: C.ink2 }); tabRow(1220, 474, [["data", true], ["catatan", true]]);
      ctx.globalAlpha = 1;
      if (l > tOrig) { card(ctx, 1040, 560, 680, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 });
        text(ctx, "File asli curah_hujan_2026.csv", 1380, 604, 25, { align: "center", weight: 800 }); text(ctx, "tetap disimpan, tidak ditimpa", 1380, 642, 23, { align: "center", weight: 700, color: C.accentDark }); }
      text(ctx, "Di aplikasi lain: File → Simpan sebagai / Download → format lembar kerja", 960, 770, 23, { align: "center", weight: 700, color: BLUE });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F11.5", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Latihan 1: pembersih data", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f115", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "temukan baris bermasalah, pilih tindakannya", 620, 600, 24, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Download satu file CSV dari portal data terbuka daerahmu. Bersihkan, lalu tulis lembar catatannya.", 1310, 420, 28, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
