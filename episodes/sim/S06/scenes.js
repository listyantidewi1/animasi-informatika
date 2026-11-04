/* S06 Simulasi praktik: garis tren dan prediksi di lembar kerja generik (grafik sebar, garis tren linear + persamaan,
   =SLOPE, =INTERCEPT, =FORECAST, membaca prediksi dan batasnya). Jendela aplikasi x 80–1440 (y 122–822), panel langkah x 1470–1830.
   Data Bank Sampah SMA Tunas (fiktif, sama dengan F12.3): y = 17 + 3x, jumlah kuadrat error 4. Data latihan perpustakaan:
   SLOPE 5,2857; INTERCEPT 113,2143; FORECAST(9) 160,79 (dihitung dengan statistics.linear_regression). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, G = K.grafik;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 80, y: 122, w: 1360, h: 700 };
  const MENUS = ["File", "Edit", "Tampilan", "Sisipkan", "Format", "Data"];
  const CW = { A: 150, B: 170, C: 40, D: 230, E: 130, F: 150 };
  const RH = 44, SX = WIN.x + 14, GY = WIN.y + 46 + 40 + 76, HW = 60;
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B", ORANGE = "#D9822B", PURPLE = "#7A5AA6";
  const PANEL = { x: 1060, y: WIN.y + 86, w: 380, h: WIN.h - 86 };
  const CH1 = { x: 500, y: 296, w: 548, h: 500 }, CH2 = { x: 890, y: 290, w: 536, h: 512 };

  // ---------- data (rekaan) ----------
  const XS = [1, 2, 3, 4, 5, 6], YS = [20, 24, 25, 28, 33, 35];
  const SL = 3, IC = 17;
  const LX = [1, 2, 3, 4, 5, 6, 7, 8], LY = [118, 126, 131, 129, 140, 146, 149, 157];
  const LSL = 5.2857, LIC = 113.2143, LF9 = 160.79;
  const HEAD = { A1: { v: "Bulan ke-", bold: true }, B1: { v: "Sampah (kg)", bold: true } };
  const BASE = (() => { const c = { ...HEAD }; XS.forEach((x, i) => { c["A" + (i + 2)] = x; c["B" + (i + 2)] = YS[i]; }); return c; })();
  const LABELS = { D1: { v: "Hasil", bold: true }, D2: "kemiringan (b)", D3: "titik awal (a)", D4: "prediksi bulan 7" };
  const F_SL = "=SLOPE(B2:B7; A2:A7)", F_IC = "=INTERCEPT(B2:B7; A2:A7)", F_FC = "=FORECAST(7; B2:B7; A2:A7)", F_FC60 = "=FORECAST(60; B2:B7; A2:A7)";
  const R_SL = { E2: { v: SL, f: F_SL } }, R_IC = { E3: { v: IC, f: F_IC } }, R_FC = { E4: { v: 38, f: F_FC } };
  const ALL = { ...BASE, ...LABELS, ...R_SL, ...R_IC, ...R_FC };
  const SPEC = { type: "titik", labels: XS, values: YS, title: "Sampah Terkumpul per Bulan", xTitle: "Bulan ke-", yTitle: "Sampah (kg)", xMin: 0, xMax: 8, yMax: 50, yStep: 10 };

  // ---------- geometri ----------
  const COLS = "ABCDEF";
  const colX = c => { let x = SX + HW; for (let i = 0; i < COLS.indexOf(c); i++) x += CW[COLS[i]]; return x; };
  const rowY = r => GY + RH * r;
  const cellQ = a => { const c = a[0], r = parseInt(a.slice(1)); return { x: colX(c), y: rowY(r), w: CW[c], h: RH, cx: colX(c) + CW[c] / 2, cy: rowY(r) + RH / 2 }; };
  const at = a => { const q = cellQ(a); return [q.x + q.w * 0.62, q.y + q.h * 0.6]; };
  function menuPos(ctx, name) {
    let mx = WIN.x + 24; ctx.font = "600 21px Inter";
    for (const m of MENUS) { const mw = ctx.measureText(m).width + 24; if (m === name) return { x: mx - 8, cx: mx + 4 + (mw - 24) / 2, cy: WIN.y + 46 + 20 }; mx += mw + 6; }
  }
  function rangeBox(ctx, a, b, col) { const p = cellQ(a), q = cellQ(b); ctx.fillStyle = col + "22"; ctx.fillRect(p.x, p.y, q.x + q.w - p.x, q.y + q.h - p.y);
    ctx.strokeStyle = col; ctx.lineWidth = 3.5; ctx.strokeRect(p.x + 2, p.y + 2, q.x + q.w - p.x - 4, q.y + q.h - p.y - 4); }

  // ---------- jendela + lembar kerja + grafik + panel ----------
  function app(ctx, opt = {}) {
    L.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: opt.title || "Bank Sampah — Lembar Kerja", menus: MENUS, menuOn: opt.menuOn });
    const geo = L.sheet(ctx, { x: SX, y: WIN.y + 86 }, { cols: 6, rows: 11, rh: RH, cw: CW, cells: opt.cells || BASE, ...(opt.sel || {}) });
    (opt.ranges || []).forEach(r => rangeBox(ctx, r[0], r[1], r[2]));
    const out = { sheet: geo };
    if (opt.chart) { const b = opt.chartBox || CH1; out.chart = G.chart(ctx, b.x, b.y, b.w, b.h, opt.chart); }
    if (opt.panel) out.panel = G.panel(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, opt.panel);
    return out;
  }
  const TYPES = [{ label: "Garis", icon: "garis" }, { label: "Batang", icon: "batang" }, { label: "Lingkaran", icon: "lingkaran" }, { label: "Titik (sebar)", icon: "titik" }];
  function setup(type, o = {}) {
    return { tab: "Penyiapan", rows: [
      { kind: "dropdown", label: "Jenis grafik", value: type, icon: type === "Garis" ? "garis" : "titik", items: TYPES, open: o.open, hi: o.hi, hot: o.hot },
      { kind: "field", label: "Rentang data", value: "A1:B7" },
      { kind: "field", label: "Sumbu datar (X)", value: "Bulan ke-" },
      { kind: "field", label: "Seri (Y)", value: "Sampah (kg)" }] };
  }
  const TRENDS = [{ label: "Linear" }, { label: "Eksponensial" }, { label: "Polinomial" }, { label: "Rata-rata bergerak" }];
  function custom(o = {}) {
    return { tab: "Sesuaikan", rows: [
      { kind: "section", label: "Judul dan label", open: false },
      { kind: "section", label: "Seri", on: o.secOn },
      { kind: "dropdown", label: "Seri", value: "Sampah (kg)" },
      { kind: "toggle", label: "Garis tren", on: !!o.trend, hot: o.hotTrend },
      { kind: "dropdown", label: "Jenis garis tren", value: o.trend ? "Linear" : "—", items: TRENDS, open: o.open, hi: o.hi, hot: o.hotType },
      { kind: "toggle", label: "Tampilkan persamaan", on: !!o.eq, hot: o.hotEq }] };
  }
  function panelGeo(ctx, st) { ctx.save(); ctx.globalAlpha = 0; const g = G.panel(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, st); ctx.restore(); return g; }
  // label persamaan di grafik
  function eqLabel(ctx, g, s, hi) {
    const p = { x: g.xOf(5.2), y: g.yOf(IC + SL * 5.2) - 60 };
    ctx.font = "800 26px Inter"; const w = ctx.measureText(s).width + 28;
    card(ctx, p.x - w, p.y - 22, w, 44, { fill: hi ? "#FFF3D6" : "#FFFFFF", stroke: "#D9443B", lw: 2.5, r: 10 });
    text(ctx, s, p.x - w / 2, p.y + 9, 26, { align: "center", weight: 800, color: RED });
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
  // kartu rumus besar berwarna: parts [[teks, warna]]; label kecil di atas
  function fcard(ctx, x, y, w, label, parts, opt = {}) {
    card(ctx, x, y, w, opt.h || 120, { fill: "#FFFFFF", stroke: opt.stroke || "#D7E2DC", lw: 3, r: 16 });
    text(ctx, label, x + 20, y + 34, 21, { weight: 800, color: C.ink2 });
    let size = opt.size || 32; ctx.font = `800 ${size}px Inter`; let tw = parts.reduce((a, p) => a + ctx.measureText(p[0]).width, 0);
    if (tw > w - 40) { size = Math.floor(size * (w - 40) / tw); ctx.font = `800 ${size}px Inter`; tw = parts.reduce((a, p) => a + ctx.measureText(p[0]).width, 0); }
    let px = x + 20; const pos = []; parts.forEach(([s, col]) => { text(ctx, s, px, y + 84, size, { weight: 800, color: col || L.UI.formula }); ctx.font = `800 ${size}px Inter`; const ww = ctx.measureText(s).width; pos.push({ x: px, w: ww }); px += ww; });
    return pos;
  }
  // sel yang sedang diketik: teks tampil di bilah rumus (fx); di sel hanya awalnya (sel sempit)
  function editState(addr, s, l) { return { active: addr, edit: { addr, text: s.length > 7 ? s.slice(0, 7) + "…" : s }, caret: Math.floor(l * 2.2) % 2 === 0 }; }
  function fxOverlay(ctx, s) {   // tulis ulang isi bilah rumus dengan teks lengkap yang sedang diketik
    const x = SX + 212, y = WIN.y + 86 + 10; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x - 4, y + 4, 1000, 40);
    text(ctx, s, x, y + 33, 25, { weight: 700, color: L.UI.formula }); ctx.font = "700 25px Inter"; const w = ctx.measureText(s).width; ctx.fillStyle = C.ink; ctx.fillRect(x + 2 + w, y + 11, 2.5, 27);
  }
  function miniChart(ctx, y, hi) {
    card(ctx, 1470, y, 360, 300, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    const g = G.chart(ctx, 1484, y + 14, 332, 230, { ...SPEC, title: "", xTitle: "", yTitle: "", trend: true, s: 0.7 });
    text(ctx, "y = 17 + 3x", 1650, y + 278, 28, { align: "center", weight: 900, color: RED });
    if (hi === "a") { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, 1650 - 52, y + 250, 50, 40, 8); ctx.stroke(); }
    if (hi === "b") { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, 1650 + 16, y + 250, 50, 40, 8); ctx.stroke(); }
    return g;
  }
  const PALf = { y: BLUE, x: ORANGE, q: GREEN };
  const partsSL = (sep = ";") => [["=SLOPE(", null], ["B2:B7", BLUE], [sep + " ", null], ["A2:A7", ORANGE], [")", null]];
  const partsIC = [["=INTERCEPT(", null], ["B2:B7", BLUE], ["; ", null], ["A2:A7", ORANGE], [")", null]];
  const partsFC = (x = "7") => [["=FORECAST(", null], [x, GREEN], ["; ", null], ["B2:B7", BLUE], ["; ", null], ["A2:A7", ORANGE], [")", null]];

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["membuat grafik sebar", "menambahkan garis tren", "menghitung SLOPE dan INTERCEPT", "memprediksi dengan FORECAST", "menyebut batas prediksi"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.6) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 276 + i * 92, 760, 76, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 327 + i * 92, 34, { weight: 900, color: GREEN }); text(ctx, s, 350, 326 + i * 92, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      const g = G.chart(ctx, 1090, 270, 600, 440, { ...SPEC, title: "Sampah per bulan", grow: clamp(l / 2, 0, 1), trend: l > 2.5, trendTo: 7.5 });
      if (l > 3 && g.xOf) { const x7 = g.xOf(7), y7 = g.yOf(38); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x7, y7, 11, 0, Math.PI * 2); ctx.stroke(); text(ctx, "38?", x7, y7 - 20, 24, { align: "center", weight: 900, color: C.accentDark }); }
      text(ctx, "aplikasi lembar kerja apa pun", 1390, 750, 24, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE DAN SIMULASI TERKAIT", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      [["F12.3", "Analisis Data untuk Prediksi", "episode utama"], ["S04", "Membuat Grafik yang Jujur", "cara membuat grafik"], ["S05", "Membersihkan Data Terbuka", "data bersih dulu"]].forEach(([c, t, s], i) => {
        const x = 240 + i * 490, u = ease((l - 0.3 - i * 0.6) / 0.5); ctx.globalAlpha = Math.max(0.15, u); card(ctx, x, 280, 460, 320, { fill: i === 0 ? "#FFF3D6" : C.bg2, r: 22 });
        text(ctx, c, x + 230, 360, 54, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 230, 420, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 560, 25, { align: "center", weight: 600, color: C.ink2 }); ctx.globalAlpha = 1;
      });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    },
    t_tabel(ctx, b, l) {
      const tA = ph(b, "Kolom A"), tB = ph(b, "Kolom B"), tP = ph(b, "Setiap bulan");
      const marks = [];
      if (l > tA && l < tP) for (let r = 2; r <= 7; r++) marks.push(["A" + r, "rgba(217,130,43,0.22)"]);
      if (l > tB && l < tP) for (let r = 2; r <= 7; r++) marks.push(["B" + r, "rgba(26,115,200,0.18)"]);
      if (l > tP) marks.push(["A5", C.goodBg], ["B5", C.goodBg]);
      app(ctx, { sel: { active: "D9", marks } });
      card(ctx, 1470, 150, 360, 290, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "ISI TABEL", 1650, 200, 24, { align: "center", weight: 900, color: C.accentDark });
      [["A", "bulan ke- (x)", ORANGE, tA], ["B", "sampah, kg (y)", BLUE, tB]].forEach(([c, s, col, t0], i) => { const on = l > t0, y = 230 + i * 90;
        ctx.fillStyle = on ? "#FFF3D6" : "#F4F6F5"; rr(ctx, 1490, y, 320, 72, 12); ctx.fill(); ctx.fillStyle = on ? col : "#C9D4DB"; rr(ctx, 1504, y + 14, 44, 44, 10); ctx.fill();
        text(ctx, c, 1526, y + 46, 24, { align: "center", weight: 900, color: "#FFFFFF" }); text(ctx, s, 1564, y + 46, 24, { weight: 800, color: on ? C.ink : C.muted }); });
      if (l > tP) { const q = cellQ("B5"); L.callout(ctx, 760, 420, "Bulan ke-4 → 28 kg: satu pasangan (x, y)", q.x + q.w - 10, q.cy, { size: 24, fill: C.goodBg, color: GREEN, maxW: 520 }); }
      card(ctx, 1470, 470, 360, 120, { fill: "#E7F1FB", r: 16 }); para(ctx, "Data fiktif dari episode F12.3", 1650, 520, 23, 320, { align: "center", weight: 800, color: BLUE, lh: 1.3 });
    },
    t_sisip(ctx, b, l) {
      const A = A_(b), tSel = 0.03 * A, tSis = ph(b, "Klik Sisipkan"), tGr = ph(b, "lalu Grafik"), tJenis = ph(b, "ganti jenisnya"), tTitik = ph(b, "menjadi Titik"), tF = ph(b, "Di F12.3");
      const u = ease(clamp((l - tSel - 0.4) / 1.2, 0, 1)); const r = Math.round(lerp(1, 7, u)), c = u > 0.3 ? "B" : "A";
      const menu = l > tSis && l < tGr + 0.5, shown = l >= tGr + 0.5, isT = l > tTitik + 0.6;
      const open = l > tJenis && l < tTitik + 0.6;
      const sel = l < tSel ? { active: "D9" } : { active: "A1", selTo: c + r, range: ["A1", c + r] };
      const g = ease(clamp((l - tGr - 0.5) / 0.6, 0, 1));
      const o = app(ctx, { sel, menuOn: menu ? "Sisipkan" : null,
        chart: shown ? { ...SPEC, type: isT ? "titik" : "garis", labels: isT ? XS : XS.map(String), title: "Sampah (kg)", xTitle: "", yTitle: "", grow: isT ? 1 : g, sel: true, xMin: isT ? 0 : undefined, xMax: isT ? 8 : undefined } : null,
        panel: shown ? setup(isT ? "Titik (sebar)" : "Garis", { open, hi: l > tTitik ? 3 : null, hot: l > tJenis - 0.4 && l < tJenis }) : null });
      const m = menuPos(ctx, "Sisipkan"), items = ["Grafik", "Gambar", "Kotak teks", "Komentar"];
      if (menu) { const x = m.x, y = WIN.y + 88; card(ctx, x, y, 280, 16 + items.length * 46, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 10 });
        items.forEach((s, i) => { const on = s === "Grafik" && l > tGr - 0.3; if (on) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(x + 4, y + 8 + i * 46, 272, 44); }
          if (i === 0) G.icon(ctx, "titik", x + 16, y + 16, 28); text(ctx, s, x + 56, y + 38 + i * 46, 23, { weight: 600, color: on ? BLUE : C.ink }); }); }
      if (l > tF) L.callout(ctx, 1470, 300, "Grafik sebar = diagram titik (F12.3)", null, null, { size: 24, maxW: 330, fill: C.goodBg, color: GREEN });
      const pg = panelGeo(ctx, setup("Garis", { open: true })), rw = pg.row("Jenis grafik");
      const [ax, ay] = at("A1"), [bx, by] = at("B7");
      cur(ctx, track(l, [[0, 700, 700], [tSel, ax, ay, 1], [tSel + 0.35, ax, ay, 0, 0, 1], [tSel + 1.6, bx, by, 0, 0, 1], [tSis, m.cx, m.cy + 6, 1], [tGr, m.x + 140, WIN.y + 88 + 30, 1],
        [tJenis, rw.box.x + rw.box.w - 30, rw.cy, 1], [tTitik + 0.3, rw.item(3).x, rw.item(3).y, 1], [tTitik + 1.2, 1250, 780]]));
    },
    t_sebar(ctx, b, l) {
      const tX = 0.02 * A_(b), tY = ph(b, "dan kolom B"), tUp = ph(b, "Titik-titiknya");
      const o = app(ctx, { sel: { active: "D9", marks: [] }, ranges: [l > tX ? ["A2", "A7", ORANGE] : null, l > tY ? ["B2", "B7", BLUE] : null].filter(Boolean),
        chart: { ...SPEC }, chartBox: CH2 });
      const g = o.chart;
      if (l > tX) { ctx.fillStyle = ORANGE; ctx.fillRect(g.plot.x, g.plot.y + g.plot.h - 3, g.plot.w, 7); L.callout(ctx, 1470, 330, "Sumbu datar: kolom A, bulan (x)", null, null, { size: 23, maxW: 330, fill: "#FCEFE3", color: ORANGE }); }
      if (l > tY) { ctx.fillStyle = BLUE; ctx.fillRect(g.plot.x - 3, g.plot.y, 7, g.plot.h); L.callout(ctx, 1470, 440, "Sumbu tegak: kolom B, sampah (y)", null, null, { size: 23, maxW: 330, fill: "#E7F1FB", color: BLUE }); }
      if (l > tUp) { const u = ease(clamp((l - tUp - 0.3) / 1.2, 0, 1)); const p0 = g.pt(0), p5 = g.pt(5);
        ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.moveTo(p0.x - 10, p0.y + 40); ctx.lineTo(lerp(p0.x - 10, p5.x + 10, u), lerp(p0.y + 40, p5.y + 10, u)); ctx.stroke();
        if (u > 0.95) { const ex = p5.x + 10, ey = p5.y + 10; ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(ex + 8, ey - 10); ctx.lineTo(ex - 16, ey - 4); ctx.lineTo(ex - 2, ey + 16); ctx.closePath(); ctx.fill(); } ctx.globalAlpha = 1;
        card(ctx, 1470, 150, 360, 140, { fill: C.goodBg, stroke: GREEN, lw: 3, r: 18 }); para(ctx, "Naik dari kiri ke kanan: sampah bertambah", 1650, 205, 25, 320, { align: "center", weight: 800, lh: 1.3 }); }
    },
    t_tren(ctx, b, l) {
      const A = A_(b), tTab = 0.02 * A, tSeri = ph(b, "lalu bagian"), tTren = ph(b, "Centang Garis"), tJenis = ph(b, "pilih jenis"), tLine = ph(b, "Sebuah garis");
      const isS = l > tTab + 0.5, trend = l > tTren + 0.6, open = l > tJenis && l < tJenis + 1.2;
      const panel = isS ? custom({ secOn: l > tSeri, trend, open, hi: l > tJenis + 0.5 ? 0 : null, hotTrend: l > tTren && l < tTren + 0.8, hotType: l > tJenis - 0.3 && l < tJenis }) : setup("Titik (sebar)");
      const g0 = clamp((l - tTren - 0.6) / 0.8, 0, 1);
      app(ctx, { chart: { ...SPEC, sel: true, trend: trend }, panel });
      steps(ctx, "LANGKAH", ["Tab Sesuaikan → Seri.", "Centang Garis tren.", "Jenis: Linear."], stepAt(l, [tSeri + 0.4, tTren + 0.6, tJenis + 1.2]));
      if (l > tLine) note(ctx, 420, "Di aplikasi lain: klik kanan titik → Tambahkan garis tren.");
      const pg0 = panelGeo(ctx, setup("Titik (sebar)")), pg = panelGeo(ctx, custom({ trend: true, open: true }));
      const tp = pg0.tab("Sesuaikan"), sr = pg.row("Seri"), tr = pg.row("Garis tren"), jt = pg.row("Jenis garis tren");
      cur(ctx, track(l, [[0, 1250, 760], [tTab, tp.x, tp.y, 1], [tSeri, PANEL.x + 120, PANEL.y + 110 + 46 + 18, 1], [tTren + 0.1, tr.cx, tr.cy, 1], [tJenis - 0.2, jt.box.x + jt.box.w - 30, jt.cy, 1], [tJenis + 0.5, jt.item(0).x, jt.item(0).y, 1], [tJenis + 1.4, 1300, 790]]));
    },
    t_persamaan(ctx, b, l) {
      const A = A_(b), tEq = 0.03 * A, tShow = ph(b, "Di grafik"), tB = ph(b, "Angka tiga");
      const eq = l > tEq + 0.5;
      const o = app(ctx, { chart: { ...SPEC, sel: true, trend: true }, panel: custom({ secOn: true, trend: true, eq, hotEq: l > tEq && l < tEq + 0.9 }) });
      if (eq) eqLabel(ctx, o.chart, "y = 17 + 3x", l > tShow && l < tB);
      if (l > tB) { const g = o.chart; const x1 = g.xOf(3), x2 = g.xOf(4), y1 = g.yOf(IC + SL * 3), y2 = g.yOf(IC + SL * 4);
        ctx.strokeStyle = GREEN; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y2); ctx.stroke();
        text(ctx, "+1 bulan", (x1 + x2) / 2, y1 + 28, 20, { align: "center", weight: 800, color: GREEN }); text(ctx, "+3 kg", x2 + 10, (y1 + y2) / 2 + 8, 22, { weight: 900, color: GREEN }); }
      card(ctx, 1470, 160, 360, 230, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "y = a + bx", 1650, 220, 34, { align: "center", weight: 900, color: RED });
      text(ctx, "a = titik awal = 17", 1650, 290, 25, { align: "center", weight: 800, color: l > tB + 1.5 ? C.ink : C.ink2 });
      text(ctx, "b = kemiringan = 3", 1650, 340, 25, { align: "center", weight: 800, color: l > tB ? GREEN : C.ink2 });
      const pg = panelGeo(ctx, custom({ trend: true })), er = pg.row("Tampilkan persamaan");
      cur(ctx, track(l, [[0, 1250, 760], [tEq + 0.1, er.cx, er.cy, 1], [tEq + 1.2, 1300, 790]]));
    },
    t_slope(ctx, b, l) {
      const A = A_(b), t0 = ph(b, "ketik"), t1 = ph(b, "Hasilnya") - 0.2;
      const s = typed(F_SL, l, t0, t1), done = l > t1 + 0.2;
      const cells = { ...BASE, ...LABELS, ...(done ? R_SL : {}) };
      const sel = !done ? (l > t0 - 0.6 ? editState("E2", s, l) : { active: "E2" }) : { active: "E2", changed: ["E2"] };
      const ranges = []; if (s.length > 7) ranges.push(["B2", "B7", BLUE]); if (s.length > 13) ranges.push(["A2", "A7", ORANGE]);
      app(ctx, { cells, sel, ranges });
      if (!done && l > t0 - 0.6) fxOverlay(ctx, s);
      fcard(ctx, 900, 300, 520, "Kemiringan (b)", partsSL(), { stroke: done ? GREEN : "#D7E2DC" });
      if (done) { card(ctx, 900, 440, 520, 110, { fill: C.goodBg, stroke: GREEN, lw: 3, r: 16 }); text(ctx, "E2 = 3", 1160, 512, 44, { align: "center", weight: 900, color: GREEN }); }
      steps(ctx, "LANGKAH", ["Klik sel E2.", "Ketik rumus SLOPE.", "Tekan Enter."], stepAt(l, [t0 - 0.3, t1, t1 + 0.3]));
      if (l > t1 - 0.3 && l < t1 + 0.4) L.keys(ctx, 1650, 640, ["Enter"], { align: "center", size: 30, press: (l - t1 + 0.3) / 0.7 });
      const [ex, ey] = at("E2"); cur(ctx, track(l, [[0, 800, 700], [t0 - 0.6, ex, ey, 1], [t0 + 0.4, ex + 60, ey + 120]]));
    },
    t_urutan(ctx, b, l) {
      const tY = 0.02 * A_(b), tX = ph(b, "baru nilai x"), tSep = ph(b, "Pengaturan");
      app(ctx, { cells: { ...BASE, ...LABELS, ...R_SL }, sel: { active: "E2" }, ranges: [l > tY ? ["B2", "B7", BLUE] : null, l > tX ? ["A2", "A7", ORANGE] : null].filter(Boolean) });
      const pos = fcard(ctx, 900, 300, 520, "SLOPE(nilai y; nilai x)", partsSL(), {});
      if (l > tY) { const p = pos[1]; ctx.fillStyle = BLUE; ctx.fillRect(p.x, 300 + 96, p.w, 5); text(ctx, "1. nilai y: sampah", p.x, 300 + 150, 23, { weight: 900, color: BLUE }); }
      if (l > tX) { const p = pos[3]; ctx.fillStyle = ORANGE; ctx.fillRect(p.x, 300 + 96, p.w, 5); text(ctx, "2. nilai x: bulan", p.x, 300 + 186, 23, { weight: 900, color: ORANGE }); }
      if (l > tSep) { fcard(ctx, 900, 530, 520, "Pengaturan Indonesia: titik koma", partsSL(";"), { h: 110, size: 28 }); fcard(ctx, 900, 652, 520, "Pengaturan bahasa Inggris: koma", partsSL(","), { h: 110, size: 28 }); }
      card(ctx, 1470, 150, 360, 170, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "INGAT", 1650, 198, 26, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "y dulu, baru x", 1650, 262, 34, { align: "center", weight: 900 });
    },
    t_intercept(ctx, b, l) {
      const A = A_(b), t0 = ph(b, "ketik"), t1 = ph(b, "Hasilnya") - 0.3, tSame = ph(b, "sama dengan titik");
      const s = typed(F_IC, l, t0, t1), done = l > t1 + 0.2;
      const cells = { ...BASE, ...LABELS, ...R_SL, ...(done ? R_IC : {}) };
      const sel = !done ? (l > t0 - 0.5 ? editState("E3", s, l) : { active: "E3" }) : { active: "E3", changed: ["E3"] };
      const ranges = []; if (s.length > 11) ranges.push(["B2", "B7", BLUE]); if (s.length > 17) ranges.push(["A2", "A7", ORANGE]);
      app(ctx, { cells, sel, ranges });
      if (!done && l > t0 - 0.5) fxOverlay(ctx, s);
      fcard(ctx, 900, 300, 520, "Titik awal (a)", partsIC, { stroke: done ? GREEN : "#D7E2DC" });
      if (done) { card(ctx, 900, 440, 520, 110, { fill: C.goodBg, stroke: GREEN, lw: 3, r: 16 }); text(ctx, "E3 = 17", 1160, 512, 44, { align: "center", weight: 900, color: GREEN }); }
      miniChart(ctx, 160, l > tSame ? "a" : null);
      if (l > tSame) text(ctx, "sama ✓", 1650, 500, 30, { align: "center", weight: 900, color: GREEN });
      const [ex, ey] = at("E3"); cur(ctx, track(l, [[0, 800, 700], [t0 - 0.5, ex, ey, 1], [t0 + 0.4, ex + 60, ey + 120]]));
    },
    t_forecast(ctx, b, l) {
      const A = A_(b), t0 = ph(b, "ketik di E4") + 0.6, t1 = A * 0.93;
      const s = typed(F_FC, l, t0, t1);
      const cells = { ...BASE, ...LABELS, ...R_SL, ...R_IC };
      const sel = l > t0 - 0.5 ? editState("E4", s, l) : { active: "E4" };
      const ranges = []; if (s.length > 15) ranges.push(["B2", "B7", BLUE]); if (s.length > 21) ranges.push(["A2", "A7", ORANGE]);
      app(ctx, { cells, sel, ranges });
      if (l > t0 - 0.5) fxOverlay(ctx, s);
      const pos = fcard(ctx, 900, 300, 520, "Prediksi: FORECAST(x; nilai y; nilai x)", partsFC(), { size: 30 });
      [[1, "x yang ditanya: 7", GREEN, 450], [3, "nilai y", BLUE, 490], [5, "nilai x", ORANGE, 530]].forEach(([i, s2, col, y], k) => { if (s.length > [11, 16, 22][k]) { const p = pos[i]; ctx.fillStyle = col; ctx.fillRect(p.x, 396, p.w, 5); text(ctx, s2, 920, y, 24, { weight: 900, color: col }); } });
      steps(ctx, "LANGKAH", ["Klik sel E4.", "Ketik rumus FORECAST."], stepAt(l, [t0 - 0.3, t1]));
      const [ex, ey] = at("E4"); cur(ctx, track(l, [[0, 800, 700], [t0 - 0.5, ex, ey, 1], [t0 + 0.4, ex + 60, ey + 120]]));
    },
    t_forecast_hasil(ctx, b, l) {
      const A = A_(b), tCalc = ph(b, "sama dengan tujuh"), tLin = ph(b, "Di aplikasi lain");
      app(ctx, { cells: ALL, sel: { active: "E4", changed: l < 1.5 ? ["E4"] : [] } });
      card(ctx, 900, 300, 520, 130, { fill: C.goodBg, stroke: GREEN, lw: 3, r: 16 }); text(ctx, "E4 = 38 kg", 1160, 384, 46, { align: "center", weight: 900, color: GREEN });
      if (l > tCalc) { card(ctx, 900, 460, 520, 110, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "17 + 3 × 7 = 38", 1160, 532, 40, { align: "center", weight: 900 }); }
      if (l > tLin) { card(ctx, 1470, 160, 360, 220, { fill: "#E7F1FB", stroke: BLUE, lw: 3, r: 18 }); text(ctx, "Di aplikasi lain:", 1650, 214, 24, { align: "center", weight: 800, color: BLUE });
        text(ctx, "=FORECAST.LINEAR(", 1650, 274, 27, { align: "center", weight: 900, color: L.UI.formula }); text(ctx, "7; B2:B7; A2:A7)", 1650, 314, 27, { align: "center", weight: 900, color: L.UI.formula });
        text(ctx, "isi dan hasilnya sama", 1650, 356, 21, { align: "center", weight: 700, color: C.ink2 }); }
    },
    t_baca(ctx, b, l) {
      const A = A_(b), tPt = 0.05 * A, tErr = ph(b, "Titik asli"), tRange = ph(b, "jadi sebutkan");
      const o = app(ctx, { cells: ALL, sel: { active: "E4" }, chart: { ...SPEC, title: "Sampah per Bulan", trend: true, trendTo: 7.6 }, chartBox: CH2 });
      const g = o.chart, x7 = g.xOf(7), y38 = g.yOf(38);
      if (l > tRange) { const ya = g.yOf(40), yb = g.yOf(36); ctx.fillStyle = "rgba(242,177,52,0.35)"; rr(ctx, x7 - 16, ya, 32, yb - ya, 8); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; rr(ctx, x7 - 16, ya, 32, yb - ya, 8); ctx.stroke(); }
      if (l > tPt) { const z = fade(l, tPt); ctx.globalAlpha = z; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x7, y38, 11, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.accentDark; ctx.lineWidth = 4; ctx.stroke();
        text(ctx, "38", x7, y38 - 22, 24, { align: "center", weight: 900, color: C.accentDark }); ctx.globalAlpha = 1;
        const q = cellQ("E4"); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(q.x + q.w, q.cy); ctx.lineTo(x7 - 14, y38); ctx.stroke(); ctx.setLineDash([]); }
      if (l > tErr) { XS.forEach((x, i) => { const p = g.pt(i), yl = g.yOf(IC + SL * x); if (Math.abs(p.y - yl) > 1) { ctx.strokeStyle = PURPLE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, yl); ctx.stroke(); } }); }
      card(ctx, 1470, 150, 360, 120, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "Prediksi bulan 7", 1650, 196, 23, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "38 kg", 1650, 248, 40, { align: "center", weight: 900, color: C.accentDark });
      if (l > tErr) { card(ctx, 1470, 290, 360, 120, { fill: "#F3EEF8", stroke: PURPLE, lw: 3, r: 18 }); para(ctx, "Titik asli meleset paling jauh 1 kg", 1650, 336, 23, 320, { align: "center", weight: 800, lh: 1.3, color: PURPLE }); }
      if (l > tRange) { card(ctx, 1470, 430, 360, 130, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "sekitar", 1650, 474, 22, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "36 – 40 kg", 1650, 526, 38, { align: "center", weight: 900 }); }
    },
    t_jauh(ctx, b, l) {
      const A = A_(b), tEdit = ph(b, "Ganti angka"), tRes = ph(b, "Hasilnya"), tQ = ph(b, "Masuk akal");
      const s0 = "=FORECAST(", rest = "; B2:B7; A2:A7)"; let xs = "7", editing = l > tEdit && l < tRes - 0.2;
      if (editing) { const u = (l - tEdit) / Math.max(0.5, tRes - 0.2 - tEdit); xs = u < 0.35 ? "7" : u < 0.55 ? "" : u < 0.75 ? "6" : "60"; }
      if (l >= tRes - 0.2) xs = "60";
      const done = l >= tRes - 0.2;
      const cells = { ...ALL, E4: done ? { v: 197, f: F_FC60 } : { v: 38, f: F_FC }, D4: done ? "prediksi bulan 60" : "prediksi bulan 7" };
      const sel = editing ? editState("E4", s0 + xs + rest, l) : { active: "E4", changed: done && l < tRes + 1.5 ? ["E4"] : [] };
      app(ctx, { cells, sel });
      if (editing) fxOverlay(ctx, s0 + xs + rest);
      fcard(ctx, 900, 300, 520, "Prediksi jauh", partsFC(xs || " "), { size: 30, stroke: done ? RED : "#D7E2DC" });
      card(ctx, 1470, 150, 360, 150, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "Bulan ke-60", 1650, 200, 26, { align: "center", weight: 900 }); text(ctx, "= 5 tahun lagi", 1650, 250, 24, { align: "center", weight: 700, color: C.ink2 });
      if (done) { card(ctx, 900, 450, 520, 140, { fill: "#FDF1F0", stroke: RED, lw: 3, r: 16 }); text(ctx, "E4 = 197 kg", 1160, 520, 44, { align: "center", weight: 900, color: RED }); text(ctx, "17 + 3 × 60", 1160, 566, 24, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > tQ) { text(ctx, "?", 1650, 470, 120, { align: "center", weight: 900, color: RED }); kiko(ctx, 1650, 700, 90, 0, {}); }
      const [ex, ey] = at("E4"); cur(ctx, track(l, [[0, 800, 700], [tEdit - 0.4, SX + 520, WIN.y + 86 + 34, 1], [tRes + 0.4, 820, 760]]));
    },
    t_jauh_garis(ctx, b, l) {
      const A = A_(b), tWhy = ph(b, "Libur sekolah"), tSafe = ph(b, "Prediksi paling aman");
      const box = { x: 100, y: 140, w: 1330, h: 680 };
      card(ctx, box.x - 10, box.y - 10, box.w + 20, box.h + 20, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      const g = G.chart(ctx, box.x, box.y, box.w, box.h, { ...SPEC, title: "Garis tren ditarik sampai bulan ke-60", xMax: 60, xMin: 0, yMax: 200, yStep: 50, trend: true, trendTo: lerp(6, 60, ease(clamp(l / 2.5, 0, 1))) });
      const xd = g.xOf(6), x8 = g.xOf(8), xe = g.xOf(60);
      ctx.fillStyle = "rgba(46,158,91,0.14)"; ctx.fillRect(g.xOf(0.5), g.plot.y, x8 - g.xOf(0.5), g.plot.h);
      text(ctx, "data + aman", (g.xOf(0.5) + x8) / 2, g.plot.y + 28, 21, { align: "center", weight: 900, color: GREEN });
      if (l > 2.5) { ctx.fillStyle = "rgba(217,68,59,0.07)"; ctx.fillRect(x8, g.plot.y, xe - x8, g.plot.h); text(ctx, "tebakan berisiko", (x8 + xe) / 2, g.plot.y + 28, 24, { align: "center", weight: 900, color: RED });
        const y197 = g.yOf(197); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(xe, y197, 11, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.stroke(); text(ctx, "197?", xe - 18, y197 + 8, 26, { align: "right", weight: 900, color: RED }); }
      if (l > tWhy) [["Libur sekolah", 0], ["Aturan baru", 1], ["Jumlah murid berubah", 2]].forEach(([s, i]) => { const u = fade(l, tWhy + i * 0.9); ctx.globalAlpha = u; L.callout(ctx, 1470, 160 + i * 100, s, null, null, { size: 24, maxW: 320, fill: "#FDF1F0", color: RED }); ctx.globalAlpha = 1; });
      if (l > tSafe) { card(ctx, 1470, 480, 360, 170, { fill: C.goodBg, stroke: GREEN, lw: 4, r: 18 }); text(ctx, "PREDIKSI AMAN", 1650, 528, 24, { align: "center", weight: 900, color: GREEN }); para(ctx, "1–2 bulan setelah data terakhir", 1650, 580, 26, 320, { align: "center", weight: 800, lh: 1.25 }); }
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 260, 62, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 304, 230, 18, 60, 6); ctx.fill(); rr(ctx, 338, 230, 18, 60, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 420, 252, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 420, 296, 26, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 220, 360 + i * 100, 820, 84, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 264, 412 + i * 100, 32, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 304, 411 + i * 100, 26, { weight: 700, fit: 720 }); });
      card(ctx, 1110, 190, 560, 590, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "Pengunjung perpustakaan", 1390, 238, 25, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "Bulan ke-", 1240, 290, 24, { align: "center", weight: 900 }); text(ctx, "Pengunjung", 1520, 290, 24, { align: "center", weight: 900 });
      ctx.fillStyle = "#D7E2DC"; ctx.fillRect(1140, 304, 500, 2);
      LX.forEach((x, i) => { const y = 344 + i * 50; if (i % 2) { ctx.fillStyle = "#F4F7F6"; ctx.fillRect(1140, y - 32, 500, 50); }
        text(ctx, String(x), 1240, y, 26, { align: "center", weight: 700 }); text(ctx, String(LY[i]), 1520, y, 26, { align: "center", weight: 700 }); });
      text(ctx, "Prediksi: bulan ke-9", 1390, 760, 24, { align: "center", weight: 800, color: GREEN });
    },
    t_periksa(ctx, b, l) {
      const A = A_(b), tS = ph(b, "SLOPE"), tI = ph(b, "INTERCEPT"), tF = ph(b, "dan prediksi");
      const c = { A1: { v: "Bulan ke-", bold: true }, B1: { v: "Pengunjung", bold: true }, D1: { v: "Hasil", bold: true }, D2: "kemiringan (b)", D3: "titik awal (a)", D4: "prediksi bulan 9" };
      LX.forEach((x, i) => { c["A" + (i + 2)] = x; c["B" + (i + 2)] = LY[i]; });
      if (l > tS) c.E2 = { v: LSL, f: "=SLOPE(B2:B9; A2:A9)" }; if (l > tI) c.E3 = { v: LIC, f: "=INTERCEPT(B2:B9; A2:A9)" }; if (l > tF) c.E4 = { v: LF9, f: "=FORECAST(9; B2:B9; A2:A9)" };
      const o = app(ctx, { title: "Perpustakaan — Lembar Kerja", cells: c, sel: { active: l > tF ? "E4" : l > tI ? "E3" : "E2", changed: [l > tF ? "E4" : l > tI ? "E3" : "E2"] },
        chart: { type: "titik", labels: LX, values: LY, title: "Pengunjung per Bulan", xTitle: "Bulan ke-", yTitle: "Pengunjung", xMin: 0, xMax: 10, yMax: 200, yStep: 50, trend: true, trendTo: 9.4 }, chartBox: CH2 });
      if (l > tF) { const g = o.chart, x9 = g.xOf(9), y9 = g.yOf(LF9); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x9, y9, 10, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.accentDark; ctx.lineWidth = 4; ctx.stroke(); text(ctx, "≈161", x9, y9 - 20, 22, { align: "center", weight: 900, color: C.accentDark }); }
      const items = [["SLOPE ≈ 5,3", tS], ["INTERCEPT ≈ 113", tI], ["Bulan 9 ≈ 161 pengunjung", tF]];
      card(ctx, 1470, 122, 360, 100 + items.length * 84, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA", 1650, 170, 24, { align: "center", weight: 900, color: C.accentDark });
      items.forEach(([s, t0], i) => { const on = l > t0; const y = 196 + i * 84; ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 1490, y, 320, 70, 12); ctx.fill();
        text(ctx, s, 1508, y + 44, 23, { weight: 800, color: on ? C.ink : C.ink2, fit: 260 }); if (on) text(ctx, "✓", 1796, y + 46, 30, { align: "right", weight: 900, color: GREEN }); });
      if (l > tF + 1) note(ctx, 560, "Angka di sel boleh berbeda di desimalnya, tergantung format sel.");
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F12.3", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "kalkulator prediksi", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f123", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "detektif prediksi yang menyesatkan", 620, 600, 24, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Download data terbuka daerahmu, buat garis tren dan satu prediksi, lalu tulis rentang dan batasnya.", 1310, 420, 28, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
