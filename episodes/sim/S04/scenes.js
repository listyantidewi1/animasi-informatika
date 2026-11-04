/* S04 Simulasi praktik: membuat grafik yang jujur di lembar kerja generik (memilih rentang, Sisipkan → Grafik, jenis grafik,
   judul/label/satuan, sumbu tegak dari nol). Jendela aplikasi x 80–1440 (y 122–822), panel langkah x 1470–1830.
   Gambar grafik dan panel pengaturan memakai episodes/_alat/layar_grafik.js (Kiko.grafik). Semua data rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, G = K.grafik;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 80, y: 122, w: 1360, h: 700 };
  const MENUS = ["File", "Edit", "Tampilan", "Sisipkan", "Format", "Data"];
  const CW = { A: 180, B: 110, C: 120, D: 120, E: 120, F: 120, G: 120 };
  const RH = 44, SX = WIN.x + 14, GY = WIN.y + 46 + 40 + 76, HW = 60;
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";
  const PANEL = { x: 1060, y: WIN.y + 86, w: 380, h: WIN.h - 86 };
  const CH = { x: 466, y: 296, w: 580, h: 480 };            // kotak grafik di atas kisi

  // ---------- data (rekaan) ----------
  const MENU = [["Bakso", 75], ["Mie ayam", 60], ["Nasi uduk", 45], ["Es teh", 120]];
  const HARI = [["Senin", 20], ["Selasa", 25], ["Rabu", 18], ["Kamis", 30], ["Jumat", 27]];
  const BERANGKAT = [["Jalan kaki", 12], ["Angkot", 10], ["Diantar motor", 14], ["Sepeda", 4]];
  const TELAT = [["Kelas 7", 3.2], ["Kelas 8", 3.5]];
  const table = (rows, h1, h2, extra) => { const c = { A1: { v: h1, bold: true }, B1: { v: h2, bold: true } }; rows.forEach((r, i) => { c["A" + (i + 2)] = r[0]; c["B" + (i + 2)] = r[1]; }); return Object.assign(c, extra || {}); };
  const T_MENU = table(MENU, "Menu", "Porsi"), T_HARI = table(HARI, "Hari", "Es teh");
  const T_BER = table(BERANGKAT, "Berangkat", "Murid", { A6: { v: "Jumlah", bold: true }, B6: { v: 40, bold: true } });
  const T_TELAT = table(TELAT, "Kelas", "Telat");
  const S_MENU = { type: "batang", labels: MENU.map(r => r[0]), values: MENU.map(r => r[1]) };
  const S_TELAT = { type: "batang", labels: TELAT.map(r => r[0]), values: TELAT.map(r => r[1]), color: "#D9443B", dec: 1 };
  const FULL = { title: "Penjualan Menu Kantin Seminggu", subtitle: "Sumber: catatan kantin, Senin–Jumat", xTitle: "Menu", yTitle: "Jumlah porsi", dataLabels: true };

  // ---------- geometri ----------
  const COLS = "ABCDEFG";
  const colX = c => { let x = SX + HW; for (let i = 0; i < COLS.indexOf(c); i++) x += CW[COLS[i]]; return x; };
  const rowY = r => GY + RH * r;
  const at = a => { const c = a[0], r = parseInt(a.slice(1)); return [colX(c) + CW[c] * 0.62, rowY(r) + RH * 0.6]; };
  function menuPos(ctx, name) {
    let mx = WIN.x + 24; ctx.font = "600 21px Inter";
    for (const m of MENUS) { const mw = ctx.measureText(m).width + 24; if (m === name) return { x: mx - 8, cx: mx + 4 + (mw - 24) / 2, cy: WIN.y + 46 + 20 }; mx += mw + 6; }
  }

  // ---------- jendela + lembar kerja + grafik + panel ----------
  // opt: cells, sel (st lembar kerja), chart (spec, digambar di CH), panel (st G.panel), menuOn, title
  function app(ctx, opt = {}) {
    L.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: opt.title || "Kantin — Lembar Kerja", menus: MENUS, menuOn: opt.menuOn });
    const geo = L.sheet(ctx, { x: SX, y: WIN.y + 86 }, { cols: 7, rows: 11, rh: RH, cw: CW, cells: opt.cells || {}, ...(opt.sel || {}) });
    const out = { sheet: geo };
    if (opt.chart) { const b = opt.chartBox || CH; out.chart = G.chart(ctx, b.x, b.y, b.w, b.h, opt.chart); }
    if (opt.panel) out.panel = G.panel(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, opt.panel);
    return out;
  }
  // panel tab Penyiapan
  const TYPES = [{ label: "Garis", icon: "garis" }, { label: "Batang", icon: "batang" }, { label: "Lingkaran", icon: "lingkaran" }, { label: "Titik (sebar)", icon: "titik" }];
  const TYPE_KEY = { Garis: "garis", Batang: "batang", Lingkaran: "lingkaran" };
  function setup(type, o = {}) {
    return { tab: "Penyiapan", rows: [
      { kind: "dropdown", label: "Jenis grafik", value: type, icon: TYPE_KEY[type], items: TYPES, open: o.open, hi: o.hi, hot: o.hot },
      { kind: "field", label: "Rentang data", value: o.range || "A1:B5" },
      { kind: "field", label: "Sumbu datar (kategori)", value: o.x || "Menu" },
      { kind: "field", label: "Seri (angka)", value: o.y || "Porsi" }] };
  }
  // panel tab Sesuaikan: f = {title, sub, xt, yt, labels, min, max, focus, caret, sec}
  function custom(f = {}) {
    const fld = (label, key) => ({ kind: "field", label, value: f[key] || "", focus: f.focus === key, caret: f.focus === key && f.caret, hot: f.hot === key });
    if (f.sec === "sumbu") return { tab: "Sesuaikan", rows: [
      { kind: "section", label: "Judul dan label", open: false },
      { kind: "section", label: "Sumbu tegak", on: true },
      { kind: "pair", label: "Batas sumbu", a: { label: "Minimum", value: f.min, focus: f.focus === "min", caret: f.focus === "min" && f.caret, auto: f.minAuto, hot: f.hot === "min" }, b: { label: "Maksimum", value: f.max || "Otomatis", auto: !f.max } },
      { kind: "field", label: "Judul sumbu tegak", value: f.yt || "" },
      { kind: "toggle", label: "Garis kisi", on: true }] };
    return { tab: "Sesuaikan", rows: [
      { kind: "section", label: "Judul dan label" },
      fld("Judul grafik", "title"), fld("Subjudul", "sub"), fld("Judul sumbu datar", "xt"), fld("Judul sumbu tegak", "yt"),
      { kind: "toggle", label: "Label data", on: !!f.labels, hot: f.hot === "labels" },
      { kind: "section", label: "Sumbu tegak", open: false }] };
  }
  // titik sasaran pointer di panel (dihitung dengan gambar tak terlihat)
  function panelGeo(ctx, st) { ctx.save(); ctx.globalAlpha = 0; const g = G.panel(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, st); ctx.restore(); return g; }

  // ---------- pointer berdasarkan titik-kunci: [[detik, x, y, klik?, jenis?, tahan?]] ----------
  function track(l, keys) {
    if (l <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], click: 0, kind: "arrow" };
    let i = 0; while (i + 1 < keys.length && l >= keys[i + 1][0]) i++;
    const k = keys[i], n = keys[i + 1]; let x = k[1], y = k[2], down = !!k[5];
    if (n) { const mv = Math.min(0.75, (n[0] - k[0]) * 0.8); const u = ease((l - (n[0] - mv)) / mv); x = lerp(k[1], n[1], u); y = lerp(k[2], n[2], u); if (u > 0) down = !!(k[5] && n[5]); }
    const dt = l - k[0]; return { x, y, click: k[3] && dt < 0.45 ? dt / 0.45 : 0, kind: "arrow", down };
  }
  const cur = (ctx, p) => L.cursor(ctx, p.x, p.y, { kind: p.kind, click: p.click, down: p.down });
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const typed = (s, t, t0, t1) => s.slice(0, Math.round(s.length * clamp((t - t0) / (t1 - t0), 0, 1)));

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
  const stepAt = (t, marks) => { let n = 0; marks.forEach((m, i) => { if (t >= m) n = i + 1; }); return n; };
  const note = (ctx, y, s) => L.callout(ctx, 1470, y, s, null, null, { size: 22, maxW: 320, fill: "#E7F1FB", color: BLUE });
  const ring = (ctx, x, y, r, col) => { ctx.strokeStyle = col || C.accent; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); };
  // kartu grafik mandiri (di luar aplikasi)
  function chartCard(ctx, x, y, w, h, head, spec, col) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: col || "#D7E2DC", lw: 4, r: 22 });
    if (head) text(ctx, head, x + w / 2, y + 48, 28, { align: "center", weight: 900, color: col || C.accentDark });
    return G.chart(ctx, x + 24, y + (head ? 70 : 24), w - 48, h - (head ? 94 : 48), spec);
  }
  // HP sederhana dengan pesan grup kelas
  function phone(ctx, x, y, w, h, fn) {
    ctx.fillStyle = "#24313A"; rr(ctx, x, y, w, h, 46); ctx.fill(); ctx.fillStyle = "#EEF3F1"; rr(ctx, x + 14, y + 14, w - 28, h - 28, 34); ctx.fill();
    ctx.fillStyle = "#2E7E9A"; ctx.save(); rr(ctx, x + 14, y + 14, w - 28, h - 28, 34); ctx.clip(); ctx.fillRect(x + 14, y + 14, w - 28, 92); ctx.restore();
    text(ctx, "Grup Kelas 8A", x + 50, y + 74, 28, { weight: 800, color: "#FFFFFF" }); text(ctx, "32 anggota", x + w - 50, y + 74, 20, { align: "right", weight: 600, color: "#D5ECF3" });
    fn(x + 14, y + 106, w - 28, h - 120);
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["membuat grafik dari tabel", "memilih jenis yang cocok", "memberi judul dan label", "membuat sumbu dari nol"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 760, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      G.chart(ctx, 1110, 270, 560, 420, { ...S_MENU, title: "Penjualan Menu Kantin", yTitle: "Jumlah porsi", grow: clamp(l / 2.5, 0, 1) });
      text(ctx, "aplikasi lembar kerja apa pun", 1390, 740, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      [["D8.1", "Lembar Kerja Pengolah Data", "grafik batang dan garis"], ["D8.6", "Proyek: Cek Data, Cek Fakta", "menguji klaim dengan data"], ["F11.5", "Data Terbuka untuk Keputusan", "grafik yang jujur"]].forEach(([c, t, s], i) => {
        const x = 240 + i * 490, u = ease((l - 0.3 - i * 0.6) / 0.5); ctx.globalAlpha = Math.max(0.15, u); card(ctx, x, 280, 460, 320, { fill: i === 0 ? "#FFF3D6" : C.bg2, r: 22 });
        text(ctx, c, x + 230, 360, 54, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 230, 420, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 560, 25, { align: "center", weight: 600, color: C.ink2 }); ctx.globalAlpha = 1;
      });
      card(ctx, 520, 640, 880, 80, { fill: "#E7F1FB", r: 16 }); text(ctx, "Cara membuat tabel: simulasi S02", 960, 692, 30, { align: "center", weight: 800, color: BLUE });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    },
    g_tabel(ctx, b, l) {
      const t = l / spanOf(b); const marks = [];
      if (t > 0.34 && t < 0.52) for (let r = 1; r <= 5; r++) marks.push(["A" + r, "rgba(242,177,52,0.25)"]);
      if (t > 0.52 && t < 0.8) for (let r = 1; r <= 5; r++) marks.push(["B" + r, "rgba(242,177,52,0.25)"]);
      if (t >= 0.8) marks.push(["A2", C.goodBg], ["B2", C.goodBg], ["A5", C.goodBg], ["B5", C.goodBg]);
      app(ctx, { cells: T_MENU, sel: { marks } });
      const items = [["A", "Menu"], ["B", "Porsi"]];
      card(ctx, 1470, 150, 360, 290, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "ISI TABEL", 1650, 200, 24, { align: "center", weight: 900, color: C.accentDark });
      items.forEach(([c, s], i) => { const on = (i === 0 && t > 0.34) || (i === 1 && t > 0.52); const y = 230 + i * 90;
        ctx.fillStyle = on ? "#FFF3D6" : "#F4F6F5"; rr(ctx, 1490, y, 320, 72, 12); ctx.fill(); ctx.fillStyle = on ? C.kiko : "#C9D4DB"; rr(ctx, 1504, y + 14, 44, 44, 10); ctx.fill();
        text(ctx, c, 1526, y + 46, 24, { align: "center", weight: 900, color: "#FFFFFF" }); text(ctx, "Kolom " + c + ": " + s, 1564, y + 46, 23, { weight: 800, color: on ? C.ink : C.muted }); });
      if (t >= 0.8) L.callout(ctx, 1470, 480, "Bakso 75 dan es teh 120: dari simulasi S02", null, null, { size: 22, maxW: 320, fill: C.goodBg, color: GREEN });
    },
    g_pilih(ctx, b, l) {
      const span = spanOf(b), t = l / span; const u = ease(clamp((t - 0.3) / 0.25, 0, 1)); const r = Math.round(lerp(1, 5, u)), c = u > 0.5 ? "B" : "A";
      const sel = t < 0.2 ? { active: "C7" } : { active: "A1", selTo: c + r, range: ["A1", c + r] };
      app(ctx, { cells: T_MENU, sel });
      steps(ctx, "LANGKAH", ["Klik sel A1.", "Drag sampai sel B5.", "Baris judul ikut terpilih."], stepAt(t, [0.2, 0.56, 0.75]));
      if (t > 0.5) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, colX("A") + 2, rowY(1) + 2, CW.A + CW.B - 4, RH - 4, 8); ctx.stroke(); L.callout(ctx, 1470, 420, "Baris judul: nama menu dan satuan", colX("C") - 4, rowY(1) + 22, { size: 22, maxW: 320 }); }
      const [ax, ay] = at("A1"), [bx, by] = at("B5");
      cur(ctx, track(l, [[0, 700, 650], [0.18 * span, ax, ay, 1], [0.3 * span, ax, ay, 0, 0, 1], [0.55 * span, bx, by, 0, 0, 1], [0.62 * span, bx + 60, by + 80]]));
    },
    g_sisip(ctx, b, l) {
      const span = spanOf(b), t = l / span; const open = t > 0.06 && t < 0.24; const shown = t >= 0.24;
      const g = ease(clamp((t - 0.26) / 0.25, 0, 1)), pa = ease(clamp((t - 0.55) / 0.15, 0, 1));
      app(ctx, { cells: T_MENU, sel: { active: "A1", selTo: "B5", range: ["A1", "B5"] }, menuOn: open ? "Sisipkan" : null,
        chart: shown ? { type: "garis", labels: S_MENU.labels, values: S_MENU.values, ph: { title: "Porsi" }, grow: g, sel: true } : null });
      if (pa > 0) { ctx.save(); ctx.globalAlpha = pa; G.panel(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, setup("Garis")); ctx.restore(); }
      const m = menuPos(ctx, "Sisipkan"); const items = ["Grafik", "Gambar", "Kotak teks", "Komentar"];
      if (open) { const x = m.x, y = WIN.y + 88; card(ctx, x, y, 280, 16 + items.length * 46, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 10 });
        items.forEach((s, i) => { const on = s === "Grafik" && t > 0.14; if (on) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(x + 4, y + 8 + i * 46, 272, 44); }
          if (i === 0) G.icon(ctx, "batang", x + 16, y + 16, 28); text(ctx, s, x + 56, y + 38 + i * 46, 23, { weight: 600, color: on ? BLUE : C.ink }); }); }
      steps(ctx, "LANGKAH", ["Klik menu Sisipkan.", "Pilih Grafik.", "Grafik dan panel pengaturan muncul."], stepAt(t, [0.08, 0.24, 0.7]));
      if (t > 0.72) note(ctx, 470, "Di aplikasi lain: klik dua kali grafik untuk membuka pengaturannya.");
      cur(ctx, track(l, [[0, 640, 640], [0.05 * span, m.cx, m.cy + 6, 1], [0.15 * span, m.x + 200, WIN.y + 88 + 30], [0.21 * span, m.x + 200, WIN.y + 88 + 30, 1], [0.32 * span, 1200, 760]]));
    },
    g_garis(ctx, b, l) {
      const t = l / spanOf(b);
      const o = app(ctx, { cells: T_MENU, sel: { active: "A1", selTo: "B5", range: ["A1", "B5"] }, chart: { type: "garis", labels: S_MENU.labels, values: S_MENU.values, ph: { title: "Porsi" }, sel: true },
        panel: setup("Garis", { hot: t > 0.12 && t < 0.4 }) });
      if (t > 0.38) { const g = o.chart; const p0 = g.pt(0), p1 = g.pt(1);
        ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); ctx.globalAlpha = 1;
        L.callout(ctx, 104, 600, "Bakso → mie ayam bukan urutan waktu ✗", (p0.x + p1.x) / 2, (p0.y + p1.y) / 2 + 4, { size: 22, maxW: 320, fill: "#FDF1F0", color: RED }); }
      if (t > 0.84) L.callout(ctx, 1470, 460, "Kita hanya ingin membandingkan.", null, null, { size: 24, maxW: 320 });
      if (t < 0.4 && t > 0.12) L.callout(ctx, 1470, 300, "Tebakan aplikasi: Garis", PANEL.x + 20, PANEL.y + 170, { size: 24, maxW: 320 });
    },
    g_batang(ctx, b, l) {
      const span = spanOf(b), t = l / span; const open = t > 0.08 && t < 0.3, isBar = t >= 0.3;
      const g = isBar ? ease(clamp((t - 0.3) / 0.25, 0, 1)) : 1;
      const st = setup(isBar ? "Batang" : "Garis", { open, hi: t > 0.18 ? 1 : null });
      const o = app(ctx, { cells: T_MENU, sel: { active: "A1", selTo: "B5", range: ["A1", "B5"] }, chart: { ...(isBar ? S_MENU : { ...S_MENU, type: "garis" }), ph: { title: "Porsi" }, grow: g, sel: true, hi: t > 0.75 ? 3 : null }, panel: st });
      steps(ctx, "LANGKAH", ["Buka Jenis grafik.", "Pilih Batang."], stepAt(t, [0.1, 0.3]));
      if (t > 0.75) { const bb = o.chart.bar(3); L.callout(ctx, 104, 600, "Es teh paling laris", bb.x, bb.y + 30, { fill: C.goodBg, color: GREEN }); note(ctx, 450, "Di aplikasi lain, batang tegak disebut Kolom."); }
      const pg = panelGeo(ctx, setup("Garis", { open: true })), r = pg.row("Jenis grafik");
      cur(ctx, track(l, [[0, 1250, 700], [0.08 * span, r.box.x + r.box.w - 30, r.cy, 1], [0.2 * span, r.item(1).x, r.item(1).y], [0.28 * span, r.item(1).x, r.item(1).y, 1], [0.4 * span, 1300, 760]]));
    },
    jenis_tiga(ctx, b, l) {
      const t = l / spanOf(b);
      const cards = [["BATANG", "membandingkan beberapa hal", { ...S_MENU, s: 0.8 }, 0.18], ["GARIS", "perubahan dari waktu ke waktu", { type: "garis", labels: ["Sen", "Sel", "Rab", "Kam", "Jum"], values: HARI.map(r => r[1]), s: 0.8 }, 0.44],
        ["LINGKARAN", "bagian dari satu keseluruhan", { type: "lingkaran", labels: BERANGKAT.map(r => r[0]), values: BERANGKAT.map(r => r[1]), s: 0.8, percent: true, legend: false }, 0.72]];
      cards.forEach(([h, s, spec, t0], i) => { const x = 120 + i * 570, on = t > t0; ctx.globalAlpha = on ? 1 : 0.25;
        card(ctx, x, 140, 540, 680, { fill: "#FFFFFF", stroke: on ? C.accent : "#D7E2DC", lw: on ? 5 : 3, r: 24 });
        G.icon(ctx, spec.type, x + 30, 168, 48); text(ctx, h, x + 96, 208, 40, { weight: 900, color: C.kikoDark });
        para(ctx, s, x + 30, 270, 30, 480, { weight: 800, lh: 1.25 });
        G.chart(ctx, x + 30, 360, 480, 420, { ...spec, grow: on ? clamp((t - t0) / 0.15, 0, 1) : 0 }); ctx.globalAlpha = 1; });
    },
    jenis_garis(ctx, b, l) {
      const t = l / spanOf(b); const g = ease(clamp((t - 0.08) / 0.4, 0, 1));
      const o = app(ctx, { title: "Es Teh — Lembar Kerja", cells: T_HARI, sel: { active: "A1", selTo: "B6", range: ["A1", "B6"] },
        chart: { type: "garis", labels: HARI.map(r => r[0]), values: HARI.map(r => r[1]), title: "Penjualan Es Teh per Hari", yTitle: "Porsi", dataLabels: true, grow: g }, panel: setup("Garis", { range: "A1:B6", x: "Hari", y: "Es teh" }) });
      if (t > 0.78) { const c = o.chart; const p = [0, 1, 2, 3].map(i => c.pt(i));
        text(ctx, "naik", (p[0].x + p[1].x) / 2 - 10, (p[0].y + p[1].y) / 2 - 22, 22, { align: "center", weight: 900, color: GREEN });
        text(ctx, "turun", (p[1].x + p[2].x) / 2 + 10, (p[1].y + p[2].y) / 2 + 40, 22, { align: "center", weight: 900, color: RED });
        text(ctx, "naik", (p[2].x + p[3].x) / 2 + 30, (p[2].y + p[3].y) / 2 + 30, 22, { align: "center", weight: 900, color: GREEN }); }
      card(ctx, 1470, 150, 360, 210, { fill: "#FFFFFF", stroke: C.accent, lw: 3, r: 18 }); G.icon(ctx, "garis", 1494, 176, 44); text(ctx, "GARIS", 1552, 210, 30, { weight: 900, color: C.kikoDark });
      para(ctx, "Data berubah dari hari ke hari: naik turunnya terlihat.", 1494, 268, 23, 320, { weight: 700, lh: 1.3 });
    },
    jenis_lingkaran(ctx, b, l) {
      const t = l / spanOf(b); const g = ease(clamp((t - 0.08) / 0.4, 0, 1));
      app(ctx, { title: "Berangkat Sekolah — Lembar Kerja", cells: T_BER, sel: { active: "A1", selTo: "B5", range: ["A1", "B5"], marks: t > 0.35 ? [["A6", C.goodBg], ["B6", C.goodBg]] : [] },
        chart: { type: "lingkaran", labels: BERANGKAT.map(r => r[0]), values: BERANGKAT.map(r => r[1]), title: "Cara Berangkat ke Sekolah (40 murid)", percent: true, grow: g },
        panel: setup("Lingkaran", { x: "Berangkat", y: "Murid" }) });
      card(ctx, 1470, 150, 360, 210, { fill: "#FFFFFF", stroke: C.accent, lw: 3, r: 18 }); G.icon(ctx, "lingkaran", 1494, 176, 44); text(ctx, "LINGKARAN", 1552, 210, 30, { weight: 900, color: C.kikoDark });
      para(ctx, "Bagian-bagian dari satu keseluruhan.", 1494, 268, 23, 320, { weight: 700, lh: 1.3 });
      if (t > 0.5) { card(ctx, 1470, 390, 360, 150, { fill: C.goodBg, r: 18 }); text(ctx, "30% + 25% + 35% + 10%", 1650, 448, 26, { align: "center", weight: 900 }); text(ctx, "= 100% ✓", 1650, 500, 32, { align: "center", weight: 900, color: GREEN }); }
    },
    label_judul(ctx, b, l) {
      const span = spanOf(b), t = l / span; const tab = t > 0.6 ? "Sesuaikan" : "Penyiapan";
      const title = typed(FULL.title, t, 0.74, 0.98);
      const st = tab === "Sesuaikan" ? custom({ title, focus: t > 0.68 ? "title" : null, caret: Math.floor(l * 2.4) % 2 === 0 }) : setup("Batang");
      const o = app(ctx, { cells: T_MENU, chart: { ...S_MENU, title, ph: { title: "Judul grafik" }, sel: true }, panel: st });
      if (t > 0.25 && t < 0.6) { const c = o.chart; ring(ctx, c.title.x, c.title.y, 60); L.callout(ctx, 104, 600, "Tanpa judul: grafik tentang apa?", c.title.x - 60, c.title.y + 10, { size: 22, maxW: 320, fill: "#FDF1F0", color: RED }); }
      steps(ctx, "LANGKAH", ["Klik tab Sesuaikan.", "Klik kotak Judul grafik.", "Ketik judulnya."], stepAt(t, [0.62, 0.72, 0.98]));
      const tb = panelGeo(ctx, setup("Batang")).tab("Sesuaikan"), fr = panelGeo(ctx, custom({})).row("Judul grafik");
      cur(ctx, track(l, [[0, 1300, 700], [0.6 * span, tb.x, tb.y + 4, 1], [0.7 * span, fr.box.x + fr.box.w - 40, fr.cy, 1], [0.78 * span, 1400, 790]]));
    },
    label_sumbu(ctx, b, l) {
      const span = spanOf(b), t = l / span;
      const xt = typed("Menu", t, 0.22, 0.34), yt = typed("Jumlah porsi", t, 0.46, 0.64);
      const focus = t < 0.4 ? "xt" : "yt";
      const o = app(ctx, { cells: T_MENU, chart: { ...S_MENU, title: FULL.title, xTitle: xt, yTitle: yt, sel: true }, panel: custom({ title: FULL.title, xt, yt, focus: t > 0.16 ? focus : null, caret: Math.floor(l * 2.4) % 2 === 0 }) });
      steps(ctx, "LANGKAH", ["Judul sumbu datar: Menu.", "Judul sumbu tegak: Jumlah porsi."], stepAt(t, [0.36, 0.66]));
      if (t > 0.68) { const c = o.chart; ring(ctx, c.box.x + 26, c.plot.y + c.plot.h / 2, 44); L.callout(ctx, 104, 600, "porsi = satuannya", c.box.x + 14, c.plot.y + c.plot.h / 2 + 30, { size: 24, maxW: 320 }); }
      const pg = panelGeo(ctx, custom({})), rx = pg.row("Judul sumbu datar"), ry = pg.row("Judul sumbu tegak");
      cur(ctx, track(l, [[0, 1400, 790], [0.16 * span, rx.box.x + rx.box.w - 40, rx.cy, 1], [0.24 * span, 1020, 800], [0.4 * span, ry.box.x + ry.box.w - 40, ry.cy, 1], [0.48 * span, 1020, 800]]));
    },
    label_data(ctx, b, l) {
      const span = spanOf(b), t = l / span; const on = t > 0.12; const sub = typed(FULL.subtitle, t, 0.62, 0.96);
      const o = app(ctx, { cells: T_MENU, chart: { ...S_MENU, title: FULL.title, xTitle: "Menu", yTitle: "Jumlah porsi", subtitle: sub, dataLabels: on, sel: true },
        panel: custom({ title: FULL.title, xt: "Menu", yt: "Jumlah porsi", sub, labels: on, hot: t < 0.3 ? "labels" : null, focus: t > 0.5 ? "sub" : null, caret: Math.floor(l * 2.4) % 2 === 0 }) });
      steps(ctx, "LANGKAH", ["Nyalakan Label data.", "Subjudul: sumber datanya."], stepAt(t, [0.14, 0.96]));
      if (t > 0.18 && t < 0.5) { const bb = o.chart.bar(0); ring(ctx, bb.x + bb.w / 2, bb.y - 16, 30); }
      const pg = panelGeo(ctx, custom({})), tg = pg.row("Label data"), sr = pg.row("Subjudul");
      cur(ctx, track(l, [[0, 1020, 800], [0.1 * span, tg.cx, tg.cy, 1], [0.5 * span, sr.box.x + sr.box.w - 40, sr.cy, 1], [0.6 * span, 1020, 800]]));
    },
    tipu_grup(ctx, b, l) {
      const t = l / spanOf(b);
      phone(ctx, 300, 128, 640, 690, (x, y, w, h) => {
        text(ctx, "Rudi", x + 30, y + 40, 22, { weight: 800, color: C.kiko });
        card(ctx, x + 24, y + 54, w - 80, 420, { fill: "#FFFFFF", r: 20 });
        text(ctx, "KELAS 8 PALING SERING TELAT!!", x + 48, y + 100, 26, { weight: 900, color: RED });
        G.chart(ctx, x + 44, y + 120, w - 120, 320, { ...S_TELAT, yMin: 3, yMax: 3.6, yStep: 0.1, title: "Rata-rata murid telat per hari", s: 0.85, grow: clamp(l / 1.5, 0, 1) });
        text(ctx, "07.15", x + w - 70, y + 464, 18, { align: "right", weight: 600, color: C.muted });
        if (t > 0.3) { card(ctx, x + 150, y + 492, w - 180, 56, { fill: "#DCF3E4", r: 16 }); text(ctx, "Wah, dua kali lipat!", x + 174, y + 529, 22, { weight: 700 }); text(ctx, "Sinta", x + w - 40, y + 488, 18, { align: "right", weight: 800, color: GREEN }); }
      });
      kiko(ctx, 1300, 600, 150, 0, { mood: t > 0.7 ? "confused" : "happy" });
      if (t > 0.7) { card(ctx, 1110, 220, 520, 180, { fill: "#FFFFFF", stroke: C.accent, lw: 4, r: 24 }); para(ctx, "Benarkah dua kali lebih sering telat?", 1370, 290, 32, 460, { align: "center", weight: 900, lh: 1.25 }); }
      if (t > 1.02) { const u = clamp((t - 1.02) / 0.3, 0, 1); ctx.strokeStyle = C.accent; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(1600, 520, 34, -Math.PI / 2, -Math.PI / 2 + u * Math.PI * 2); ctx.stroke(); text(ctx, "Pikirkan dulu", 1600, 595, 24, { align: "center", weight: 800, color: C.ink2 }); }
    },
    tipu_sumbu(ctx, b, l) {
      const t = l / spanOf(b);
      const c = chartCard(ctx, 140, 140, 820, 680, "GRAFIK DARI GRUP KELAS", { ...S_TELAT, yMin: 3, yMax: 3.6, yStep: 0.1, title: "Rata-rata murid telat per hari" }, RED);
      if (t > 0.08) { const tk = c.ticks[0]; ring(ctx, c.plot.x - 34, tk.y, 30); }
      if (t > 0.27) L.callout(ctx, 250, 420, "Mulai dari 3, bukan dari 0!", c.plot.x - 34, c.ticks[0].y - 24, { size: 26, fill: "#FDF1F0", color: RED });
      // gambaran lengkap dari nol: bagian yang terpotong
      if (t > 0.58) { const x0 = 1040, y0 = 160, w0 = 760, h0 = 640; card(ctx, x0, y0, w0, h0, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
        text(ctx, "BATANG YANG UTUH", x0 + w0 / 2, y0 + 50, 28, { align: "center", weight: 900, color: C.accentDark });
        const base = y0 + h0 - 70, top = y0 + 110, sc = v => base - v / 3.6 * (base - top), cut = sc(3);
        [["Kelas 7", 3.2], ["Kelas 8", 3.5]].forEach(([lab, v], i) => { const bx = x0 + 170 + i * 280, bw = 150;
          ctx.fillStyle = "#E8EDF0"; ctx.fillRect(bx, cut, bw, base - cut); ctx.strokeStyle = "#B9C7CF"; ctx.setLineDash([8, 6]); ctx.lineWidth = 2; ctx.strokeRect(bx, cut, bw, base - cut); ctx.setLineDash([]);
          ctx.fillStyle = RED; ctx.fillRect(bx, sc(v), bw, cut - sc(v)); text(ctx, lab, bx + bw / 2, base + 40, 24, { align: "center", weight: 800 }); text(ctx, G.fmt(v, 1), bx + bw / 2, sc(v) - 12, 24, { align: "center", weight: 900 }); });
        ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(x0 + 120, cut); ctx.lineTo(x0 + w0 - 40, cut); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "3", x0 + 100, cut + 8, 24, { align: "right", weight: 800, color: RED }); text(ctx, "0", x0 + 100, base + 8, 24, { align: "right", weight: 800 });
        ctx.fillStyle = C.ink2; ctx.fillRect(x0 + 120, base, w0 - 160, 3);
        if (t > 0.7) { card(ctx, x0 + 200, cut + 120, 360, 110, { fill: "#FFFFFF", stroke: "#9AA8B1", lw: 2, r: 14 }); para(ctx, "bagian ini dipotong dan tidak terlihat", x0 + 380, cut + 162, 23, 320, { align: "center", weight: 800, color: C.ink2, lh: 1.25 }); } }
    },
    tipu_angka(ctx, b, l) {
      const t = l / spanOf(b);
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "ANGKA ASLINYA", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      [["Kelas 7", "3,2", 0.08], ["Kelas 8", "3,5", 0.45]].forEach(([k, v, t0], i) => { if (t < t0) return; const x = 300 + i * 460;
        card(ctx, x, 290, 400, 280, { fill: C.bg2, r: 22 }); text(ctx, k, x + 200, 350, 34, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, v, x + 200, 470, 110, { align: "center", weight: 900 }); text(ctx, "murid telat per hari", x + 200, 535, 24, { align: "center", weight: 700, color: C.ink2 }); });
      if (t > 0.72) { card(ctx, 1220, 290, 420, 280, { fill: C.goodBg, stroke: GREEN, lw: 4, r: 22 }); text(ctx, "Selisih", 1430, 350, 34, { align: "center", weight: 800, color: GREEN });
        text(ctx, "0,3", 1430, 470, 110, { align: "center", weight: 900, color: GREEN }); text(ctx, "murid per hari", 1430, 535, 24, { align: "center", weight: 700, color: C.ink2 }); }
      if (t > 0.85) text(ctx, "3,5 jauh dari dua kali 3,2.", 960, 680, 34, { align: "center", weight: 900, color: RED });
    },
    tipu_perbaiki(ctx, b, l) {
      const span = spanOf(b), t = l / span;
      const tabS = t > 0.3, secS = t > 0.5; const typing = t > 0.74 && t < 0.88; const done = t >= 0.88;
      const yMin = done ? lerp(3, 0, ease(clamp((t - 0.88) / 0.12, 0, 1))) : 3;
      const st = !tabS ? setup("Batang", { range: "A1:B3", x: "Kelas", y: "Telat" }) : !secS ? custom({ title: "Rata-rata murid telat per hari" })
        : custom({ sec: "sumbu", min: done ? "0" : typing ? "" : "3", focus: t > 0.68 ? "min" : null, caret: Math.floor(l * 2.4) % 2 === 0, hot: t > 0.6 && t < 0.74 ? "min" : null, yt: "Murid" });
      const o = app(ctx, { title: "Data Telat — Lembar Kerja", cells: T_TELAT, chart: { ...S_TELAT, yMin, yMax: done && yMin < 2.9 ? 4 : 3.6, yStep: yMin < 2.9 ? 0.5 : 0.1, title: "Rata-rata murid telat per hari", yTitle: "Murid", sel: true }, panel: st });
      if (!done && t > 0.05) ring(ctx, o.chart.plot.x - 30, o.chart.ticks[0].y, 28);
      steps(ctx, "LANGKAH", ["Klik tab Sesuaikan.", "Buka Sumbu tegak.", "Minimum: ganti 3 menjadi 0."], stepAt(t, [0.32, 0.52, 0.9]));
      const tb = panelGeo(ctx, setup("Batang")).tab("Sesuaikan"), sc = panelGeo(ctx, custom({})).row("Sumbu tegak"), mn = panelGeo(ctx, custom({ sec: "sumbu" })).row("Batas sumbu").a;
      cur(ctx, track(l, [[0, 900, 760], [0.3 * span, tb.x, tb.y + 4, 1], [0.5 * span, sc.cx, sc.cy, 1], [0.68 * span, mn.x + mn.w - 30, mn.cy, 1], [0.82 * span, 1020, 800]]));
    },
    tipu_jujur(ctx, b, l) {
      const t = l / spanOf(b);
      chartCard(ctx, 140, 136, 780, 600, "SEBELUM: MENIPU ✗", { ...S_TELAT, yMin: 3, yMax: 3.6, yStep: 0.1, title: "Rata-rata murid telat per hari", dataLabels: true, s: 0.9 }, RED);
      chartCard(ctx, 1000, 136, 780, 600, "SESUDAH: JUJUR ✓", { ...S_TELAT, color: GREEN, yMin: 0, yMax: 4, yStep: 0.5, title: "Rata-rata murid telat per hari", dataLabels: true, s: 0.9, grow: clamp(l / 1.2, 0, 1) }, GREEN);
      if (t > 0.45) { const s2 = t > 0.72 ? "Klaim di grup kelas: tidak terbukti." : "Selisih kecil tampak kecil."; card(ctx, 560, 752, 800, 66, { fill: t > 0.72 ? C.ink : GREEN, r: 18 }); text(ctx, s2, 960, 796, 30, { align: "center", weight: 900, color: "#FFFFFF" }); }
    },
    tipu_otomatis(ctx, b, l) {
      const t = l / spanOf(b);
      const o = app(ctx, { title: "Data Telat — Lembar Kerja", cells: T_TELAT, chart: { ...S_TELAT, yMin: 3, yMax: 3.6, yStep: 0.1, title: "Rata-rata murid telat per hari", yTitle: "Murid", sel: true },
        panel: custom({ sec: "sumbu", min: "Otomatis", minAuto: true, hot: t > 0.1 && t < 0.6 ? "min" : null, yt: "Murid" }) });
      if (t > 0.1) L.callout(ctx, 1470, 200, "Otomatis bisa memilih 3, bukan 0.", null, null, { size: 24, maxW: 320, fill: "#FDF1F0", color: RED });
      if (t > 0.62) { ring(ctx, o.chart.plot.x - 30, o.chart.ticks[0].y, 30); card(ctx, 1470, 340, 360, 230, { fill: "#FFFFFF", stroke: C.accent, lw: 4, r: 18 });
        text(ctx, "SEBELUM DIBAGIKAN", 1650, 388, 24, { align: "center", weight: 900, color: C.accentDark }); para(ctx, "Periksa angka paling bawah di sumbu tegak: harus 0.", 1650, 440, 26, 310, { align: "center", weight: 800, lh: 1.3 }); }
    },
    coba(ctx, b, l, t, TL) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 270, 66, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 302, 238, 19, 64, 6); ctx.fill(); rr(ctx, 339, 238, 19, 64, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 260, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 430, 306, 28, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 220, 370 + i * 104, 780, 86, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 266, 424 + i * 104, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 306, 423 + i * 104, 27, { weight: 700, fit: 680 }); });
      text(ctx, "Hasil yang dituju", 1060, 214, 24, { weight: 900, color: C.ink2 });
      G.chart(ctx, 1060, 236, 640, 540, { ...S_MENU, ...FULL });
    },
    masalah_label(ctx, b, l) {
      const t = l / spanOf(b);
      chartCard(ctx, 140, 140, 800, 680, "✗ HANYA B1:B5 DIPILIH", { type: "batang", labels: ["1", "2", "3", "4"], values: S_MENU.values, title: "Porsi", grow: clamp((t - 0.3) / 0.2, 0, 1) }, RED);
      if (t > 0.6) L.callout(ctx, 330, 300, "Ini menu apa?", 540, 740, { size: 26, fill: "#FDF1F0", color: RED });
      if (t > 0.86) chartCard(ctx, 980, 140, 800, 680, "✓ A1:B5 DIPILIH", { ...S_MENU, title: "Porsi", grow: clamp((t - 0.86) / 0.15, 0, 1) }, GREEN);
      else { card(ctx, 980, 140, 800, 680, { fill: "#F7FAF8", stroke: "#D7E2DC", lw: 3, r: 22 }); text(ctx, "Pilih juga kolom nama menunya.", 1380, 480, 30, { align: "center", weight: 800, color: C.muted }); }
    },
    periksa(ctx, b, l) {
      const t = l / spanOf(b);
      app(ctx, { cells: T_MENU, chart: { ...S_MENU, ...FULL } });
      const items = ["Jenis cocok", "Ada judul", "Label sumbu + satuan", "Sumbu tegak dari 0", "Sumber ditulis"], marks = [0.3, 0.41, 0.5, 0.74, 0.94];
      card(ctx, 1470, 150, 360, 110 + items.length * 84, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA 5 HAL", 1650, 200, 24, { align: "center", weight: 900, color: C.accentDark });
      items.forEach((s, i) => { const on = t > marks[i]; const y = 228 + i * 84;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 1490, y, 320, 70, 12); ctx.fill();
        text(ctx, s, 1508, y + 44, 23, { weight: 800, color: on ? C.ink : C.ink2 }); if (on) text(ctx, "✓", 1790, y + 46, 30, { align: "right", weight: 900, color: GREEN }); });
      // penanda pada grafik
      const g = { x: CH.x, y: CH.y, w: CH.w, h: CH.h }; const mk = [[0.41, g.x + g.w / 2, g.y + 34, 200], [0.5, g.x + 24, g.y + g.h / 2, 30], [0.74, g.x + 72, g.y + g.h - 108, 26], [0.94, g.x + g.w / 2, g.y + 82, 170]];
      mk.forEach(([t0, x, y, r]) => { if (t > t0 && t < t0 + 0.2) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y, r, 26, 0, 0, Math.PI * 2); ctx.stroke(); } });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D8.1", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "lembar kerja mini", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d81", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "pilih grafik yang tepat", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Buat grafik dari data kelasmu sendiri, lalu periksa lima hal: jenis, judul, label dan satuan, sumbu dari 0, sumber.", 1310, 420, 28, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
