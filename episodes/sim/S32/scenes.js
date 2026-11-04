/* S32 Simulasi praktik: membaca spesifikasi laptop di katalog toko rekaan (komputerkita.example) dan menyusun anggaran lima tahun
   di Lembar Kerja generik (SUM, cadangan 10%, salin rumus, grafik batang). Browser x 110–1410, panel x 1450–1820;
   Lembar Kerja x 80–1440 (y 122–822), panel x 1470–1830. Semua merek, harga, dan angka rekaan; angka anggaran dalam juta rupiah. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, W = K.web, G = K.grafik, KT = K.katalog;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 }, PX = 1450, PW = 370;
  const SW = { x: 80, y: 122, w: 1360, h: 700 }, PX2 = 1470, PW2 = 360;
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";
  const A = b => b.audio || b.dur, SP = b => A(b) * 0.9;
  const inShort = ctx => !!(ctx.canvas && ctx.canvas.isConnected === false);
  const callout = (ctx, x, y, s, tx, ty, o) => L.callout(ctx, x, y, s, inShort(ctx) ? null : tx, inShort(ctx) ? null : ty, o);
  const r2 = x => Math.round(x * 100) / 100;
  const ptr = (ctx, P, key, kx) => { if (P) L.cursor(ctx, P.x, P.y, { click: P.click, kind: P.kind, down: P.down }); if (key) L.keys(ctx, kx || PX + PW / 2, 760, key.keys, { press: key.press, align: "center", size: 30 }); };
  const run = (l, span, pts) => ({ S: W.seq(l, span, pts.map(p => p.d || 1)), P: W.path(l, span, pts) });
  const stepN = (S, marks) => marks.filter(k => S.n > k).length;

  // ---------- browser toko ----------
  function browser(ctx, url, tab, opt = {}) { return W.browser(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { tabs: [tab || "Laptop - KomputerKita"], url, ...opt }); }
  // titik tombol "Lihat detail" kartu ke-i dan "Kembali"
  const BTN = i => ({ x: 150 + i * 413 + 196, y: 294 + 66 + 388 + 22 });
  const BACK = { x: 240, y: 327 };
  const needMarks = (k, n) => { const m = {}, d = KT.L[k]; KT.NEEDS.forEach(([key], i) => { if (i >= n) return; m[key] = key === "fund" ? (k === "kirana" ? "bad" : "ok") : (d.mark[key] === "ok" ? "ok" : "bad"); }); return m; };

  // ---------- lembar kerja ----------
  const CW = { A: 305, B: 170, C: 170, D: 230, E: 230, F: 240 }, RH = 48, COLS = "ABCDEF";
  const AREA_Y = SW.y + 46 + 40 + 44, GY = AREA_Y + 10 + 66;
  const colX = c => { let x = SW.x + 60; for (let i = 0; i < COLS.indexOf(c); i++) x += CW[COLS[i]]; return x; };
  const GEO = { cell(a) { const c = a[0], r = parseInt(a.slice(1)); const x = colX(c), y = GY + RH * r; return { x, y, w: CW[c], h: RH, cx: x + CW[c] / 2, cy: y + RH / 2 }; },
    handle(a) { const q = this.cell(a); return { x: q.x + q.w - 1, y: q.y + q.h - 1 }; } };
  const geoFn = () => GEO;
  const LAB = { A2: "Harga beli", A3: "Listrik", A4: "Perawatan dan upgrade", A5: "Langganan aplikasi", A6: "Cadangan 10%", A7: { v: "Total", bold: true } };
  const HEAD = { A1: { v: "Biaya 5 tahun (juta Rp)", bold: true }, B1: { v: "Nusa Lite 14", bold: true }, C1: { v: "Bima 14", bold: true } };
  const NB = [5.4, 0.6, 1.9, 1.1], NC = [8.8, 0.4, 0.7, 1.1];
  const sum = a => r2(a.reduce((s, v) => s + v, 0));
  const NUMS = {}; NB.forEach((v, i) => NUMS["B" + (i + 2)] = v); NC.forEach((v, i) => NUMS["C" + (i + 2)] = v);
  const B6 = { v: r2(sum(NB) * 0.1), f: "=SUM(B2:B5)*10%" }, C6 = { v: r2(sum(NC) * 0.1), f: "=SUM(C2:C5)*10%" };
  const B7 = { v: r2(sum(NB) * 1.1), f: "=SUM(B2:B6)", bold: true }, C7 = { v: r2(sum(NC) * 1.1), f: "=SUM(C2:C6)", bold: true };
  const FULL = { ...HEAD, ...LAB, ...NUMS, B6, C6, B7, C7 };
  const MENUS = ["File", "Edit", "Tampilan", "Sisipkan", "Format", "Data"];
  function sheetApp(ctx, st, opt = {}) {
    const a = L.window(ctx, SW.x, SW.y, SW.w, SW.h, { title: "Lembar Kerja — Anggaran Laptop Bu Rina", menus: MENUS, tools: true, menuOn: opt.menuOn });
    return L.sheet(ctx, a, { cols: 6, rows: 8, cw: CW, rh: RH, ...st });
  }
  function menuPos(ctx, name) { let mx = SW.x + 24; ctx.font = "600 21px Inter"; for (const m of MENUS) { const mw = ctx.measureText(m).width + 24; if (m === name) return { x: mx - 8, cx: mx + 4 + (mw - 24) / 2, cy: SW.y + 66 }; mx += mw + 6; } }
  const CH = { x: 800, y: 330, w: 628, h: 440 };
  const SPEC = { type: "batang", labels: ["Harga beli", "Listrik", "Perawatan", "Langganan", "Cadangan"],
    series: [{ name: "Nusa Lite 14", values: [...NB, B6.v], color: "#8A99A3" }, { name: "Bima 14", values: [...NC, C6.v], color: "#2E7E9A" }],
    title: "Biaya 5 tahun (juta Rp)", dataLabels: true, dec: 1, legend: true, s: 1 };
  function steps2(ctx, title, items, n) { return KT.steps(ctx, PX2, SW.y, PW2, title, items, n); }
  function pcard(ctx, title, h, y0) { const y = y0 || SW.y; card(ctx, PX2, y, PW2, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, title, PX2 + 22, y + 44, 23, { weight: 900, color: C.accentDark, fit: PW2 - 44 }); return y + 70; }
  function line(ctx, s, y, opt = {}) { text(ctx, s, PX2 + 22, y, opt.size || 22, { weight: opt.weight || 700, color: opt.color || C.ink, fit: PW2 - 44 }); }

  // ---------- gambar kecil ----------
  function person(ctx, cx, cy, s, color) {
    ctx.fillStyle = color; rr(ctx, cx - s * 0.5, cy, s, s * 0.8, s * 0.3); ctx.fill();
    ctx.fillStyle = "#C98E62"; ctx.beginPath(); ctx.arc(cx, cy - s * 0.25, s * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3B2A1E"; ctx.beginPath(); ctx.arc(cx, cy - s * 0.32, s * 0.33, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
  }
  function bars(ctx, x, y, w, rows, max, opt = {}) {
    rows.forEach(([lab, v, col], i) => { const yy = y + i * 74; text(ctx, lab, x, yy + 34, 24, { weight: 800 });
      const bw = (w - 260) * v / max; ctx.fillStyle = col; rr(ctx, x + 170, yy + 8, bw, 40, 8); ctx.fill();
      text(ctx, G.fmt(v, 1) + " juta", x + 180 + bw, yy + 37, 24, { weight: 900, color: col }); });
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 236, 30, { weight: 900, color: C.accentDark });
      [["1", "Baca spesifikasi"], ["2", "Cocokkan kebutuhan"], ["3", "Anggaran 5 tahun"]].forEach(([n, s], i) => {
        const u = ease((l - 0.5 - i * 0.8) / 0.5); if (u <= 0) return; const x = 250 + i * 480, y = 280; ctx.globalAlpha = u;
        card(ctx, x, y, 440, 420, { fill: C.bg2, r: 22 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 46, y + 48, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, n, x + 46, y + 59, 30, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, s, x + 88, y + 59, 30, { weight: 900, fit: 330 });
        if (i === 0) [["RAM", "16 GB"], ["Penyimpanan", "SSD 512 GB"], ["Baterai", "10 jam"], ["Garansi", "2 tahun"]].forEach(([k, v], j) => { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + 30, y + 110 + j * 64, 380, 56);
          text(ctx, k, x + 46, y + 146 + j * 64, 22, { weight: 700, color: C.ink2 }); text(ctx, v, x + 394, y + 146 + j * 64, 24, { align: "right", weight: 900 }); });
        if (i === 1) [["Nusa Lite 14", "✗", RED], ["Bima 14", "✓", GREEN], ["Kirana 15", "✗", RED]].forEach(([k, m, c], j) => { ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 30, y + 120 + j * 86, 380, 70, 12); ctx.fill();
          KT.laptop(ctx, x + 80, y + 172 + j * 86, 60, KT.L[KT.ORDER[j]].color, j === 2); text(ctx, k, x + 130, y + 164 + j * 86, 25, { weight: 800 }); text(ctx, m, x + 380, y + 167 + j * 86, 34, { align: "center", weight: 900, color: c }); });
        if (i === 2) { [["Harga beli", "8,8"], ["Listrik", "0,4"], ["Perawatan", "0,7"], ["Langganan", "1,1"], ["Cadangan", "1,1"]].forEach(([k, v], j) => { ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1.5; ctx.strokeRect(x + 30, y + 104 + j * 46, 380, 46);
            text(ctx, k, x + 44, y + 135 + j * 46, 21, { weight: 700 }); text(ctx, v, x + 396, y + 135 + j * 46, 21, { align: "right", weight: 800 }); });
          ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + 30, y + 340, 380, 50); ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.strokeRect(x + 30, y + 340, 380, 50);
          text(ctx, "=SUM(C2:C6)", x + 44, y + 374, 22, { weight: 800, color: "#1F5A6E" }); text(ctx, "12,1", x + 396, y + 374, 22, { align: "right", weight: 900 }); }
        ctx.globalAlpha = 1; });
      kiko(ctx, 1690, 760, 80, 0, { wave: l });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      [["F11.9", "Merancang Kebutuhan Sistem Komputer", "profil, komponen, anggaran"], ["D7.2", "Mengenal Komputer", "prosesor, RAM, penyimpanan"], ["D8.1", "Lembar Kerja Pengolah Data", "rumus dan SUM"]].forEach(([c, t, s], i) => {
        const x = 230 + i * 500; card(ctx, x, 290, 460, 300, { fill: i ? "#FFFFFF" : C.bg2, stroke: i ? "#D7E2DC" : null, lw: 3, r: 22 });
        text(ctx, c, x + 230, 370, 54, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 230, 430, 28, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 560, 24, { align: "center", weight: 600, color: C.ink2 }); });
      if (l > A(b) * 0.55) { card(ctx, 420, 630, 1080, 70, { fill: "#FFF3D6", r: 14 }); text(ctx, "Semua merek, toko, dan harga di video ini hanyalah contoh rekaan.", 960, 676, 28, { align: "center", weight: 800, color: C.accentDark, fit: 1040 }); }
      kiko(ctx, 1660, 730, 90, 0, { wave: l });
    },
    profil(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      card(ctx, 230, 200, 420, 560, { fill: C.bg2, r: 22 }); person(ctx, 440, 400, 170, "#7A5AA6");
      text(ctx, "Bu Rina", 440, 630, 40, { align: "center", weight: 900 }); text(ctx, "guru, pengguna laptop", 440, 676, 26, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "PROFIL PENGGUNA", 720, 240, 30, { weight: 900, color: C.accentDark });
      [["Pekerjaan", "mengetik, lembar kerja, slide"], ["Kebiasaan", "membuka banyak tab sekaligus"], ["Mobilitas", "dibawa ke kelas setiap hari"], ["Dana", "Rp13 juta untuk lima tahun"]].forEach(([k, v], i) => {
        const u = ease((l - 0.4 - i * a * 0.16) / 0.4); if (u <= 0) return; ctx.globalAlpha = u; const y = 280 + i * 116;
        card(ctx, 720, y, 960, 96, { fill: i === 3 ? "#FFF3D6" : "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
        text(ctx, k, 750, y + 60, 26, { weight: 800, color: C.ink2 }); text(ctx, v, 960, y + 60, 32, { weight: 900, fit: 690 }); ctx.globalAlpha = 1; });
    },
    kebutuhan(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "BEBAN KERJA", 470, 214, 30, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "KEBUTUHAN", 1300, 214, 30, { align: "center", weight: 900, color: C.accentDark });
      [["banyak tab dan aplikasi", "RAM ≥ 8 GB, lebih baik 16"], ["ingin terasa cepat", "penyimpanan SSD"], ["dibawa ke kelas", "baterai ≥ 8 jam"], ["dipakai lima tahun", "garansi ≥ 2 tahun"], ["dana sekolah", "Rp13 juta / 5 tahun"]].forEach(([w, n], i) => {
        const u = ease((l - 0.3 - i * a * 0.15) / 0.4); if (u <= 0) return; ctx.globalAlpha = u; const y = 250 + i * 108;
        card(ctx, 230, y, 500, 88, { fill: C.bg2, r: 16 }); text(ctx, w, 480, y + 55, 28, { align: "center", weight: 800, fit: 470 });
        ctx.strokeStyle = C.accent; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(750, y + 44); ctx.lineTo(880, y + 44); ctx.stroke();
        ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(900, y + 44); ctx.lineTo(878, y + 30); ctx.lineTo(878, y + 58); ctx.fill();
        card(ctx, 920, y, 760, 88, { fill: "#FFFFFF", stroke: GREEN, lw: 3, r: 16 }); text(ctx, n, 1300, y + 56, 32, { align: "center", weight: 900, fit: 720 }); ctx.globalAlpha = 1; });
    },
    katalog(ctx, b, l) {
      const span = SP(b), url = "komputerkita.example/laptop";
      const pts = [{ x: 900, y: 600, d: 0.3 }, { x: 600, y: 202, d: 0.8, click: true }, { x: 600, y: 202, d: 1.6 }, { x: 600, y: 202, d: 0.5 }, { x: 600, y: 202, d: 0.6 }, { x: 760, y: 600, d: 1.6 }, { ...BTN(0), d: 1.1, click: true }, { ...BTN(0), d: 0.6 }];
      const { S, P } = run(l, span, pts);
      const typed = S.at(2) ? W.typed(url, S.p(2) / 0.9) : "", entered = S.at(3) && S.p(3) > 0.5;
      const bg = browser(ctx, entered ? url : typed, entered ? "Laptop - KomputerKita" : "Tab baru", { urlFocus: S.at(1) && !entered && S.p(1) > 0.55, caret: true, loading: S.i === 4 ? S.p(4) : 0 });
      if (entered && (S.i > 4 || S.p(4) > 0.4)) KT.catalog(ctx, bg, { hi: S.i >= 6 && S.p(6) > 0.3 ? 0 : null, press: S.i === 6 ? (S.p(6) - 0.55) / 0.45 : 0 });
      else W.clip(ctx, bg, () => text(ctx, "Tab baru", bg.x + bg.w / 2, bg.y + 260, 30, { align: "center", weight: 700, color: "#B7C4CC" }));
      KT.needs(ctx, PX, WIN.y, PW);
      ptr(ctx, P, S.i === 3 ? { keys: ["Enter"], press: S.u } : null);
    },
    spek_nusa(ctx, b, l) {
      const a = A(b), seq = ["ram", "disk", "bat", "war"], k = Math.floor(clamp((l - a * 0.15) / (a * 0.7), 0, 0.999) * 4);
      const hi = l > a * 0.15 && l < a * 0.88 ? seq[k] : null;
      const bg = browser(ctx, "komputerkita.example/laptop/nusa-lite-14", "Nusa Lite 14 - KomputerKita");
      const rowsDone = l > a * 0.15 ? KT.ROWS.findIndex(r => r[0] === seq[k]) + 1 : 0;
      KT.detail(ctx, bg, "nusa", { hi, marks: l > a * 0.88 ? true : rowsDone });
      KT.needs(ctx, PX, WIN.y, PW, { title: "NUSA LITE 14", marks: needMarks("nusa", l > a * 0.15 ? k + 1 : 0) });
      if (hi) { const rowI = KT.ROWS.findIndex(r => r[0] === hi); L.cursor(ctx, 1240, 294 + 26 + 44 + rowI * 56 + 36, {}); }
    },
    satuan(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "PERHATIKAN SATUANNYA", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      const show = i => ease((l - 0.3 - i * a * 0.26) / 0.4);
      // 1. GB RAM vs GB penyimpanan
      let u = show(0); if (u > 0) { ctx.globalAlpha = u; card(ctx, 220, 250, 460, 520, { fill: C.bg2, r: 22 });
        text(ctx, "GB ≠ GB", 450, 310, 40, { align: "center", weight: 900 });
        card(ctx, 250, 340, 400, 180, { fill: "#FFFFFF", r: 16 }); text(ctx, "RAM 16 GB", 450, 392, 32, { align: "center", weight: 900, color: BLUE }); text(ctx, "meja kerja:", 450, 440, 24, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "yang sedang dipakai", 450, 476, 24, { align: "center", weight: 700, color: C.ink2 });
        card(ctx, 250, 540, 400, 200, { fill: "#FFFFFF", r: 16 }); text(ctx, "SSD 512 GB", 450, 592, 32, { align: "center", weight: 900, color: GREEN }); text(ctx, "lemari:", 450, 640, 24, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "file yang disimpan", 450, 676, 24, { align: "center", weight: 700, color: C.ink2 }); ctx.globalAlpha = 1; }
      u = show(1); if (u > 0) { ctx.globalAlpha = u; card(ctx, 730, 250, 460, 520, { fill: C.bg2, r: 22 });
        text(ctx, "GHz dan inti", 960, 310, 40, { align: "center", weight: 900 });
        [["4 inti", 4, "#8A99A3"], ["6 inti", 6, "#2E7E9A"]].forEach(([s, n, c], i) => { const y = 360 + i * 170; card(ctx, 760, y, 400, 150, { fill: "#FFFFFF", r: 16 }); text(ctx, s, 790, y + 46, 30, { weight: 900, color: c });
          for (let j = 0; j < n; j++) { ctx.fillStyle = c; rr(ctx, 790 + j * 58, y + 70, 48, 48, 8); ctx.fill(); } });
        text(ctx, "lebih banyak inti = lebih banyak", 960, 710, 23, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "pekerjaan bersamaan", 960, 740, 23, { align: "center", weight: 700, color: C.ink2 }); ctx.globalAlpha = 1; }
      u = show(2); if (u > 0) { ctx.globalAlpha = u; card(ctx, 1240, 250, 460, 520, { fill: C.bg2, r: 22 });
        text(ctx, "SSD vs HDD", 1470, 310, 40, { align: "center", weight: 900 }); text(ctx, "membuka aplikasi:", 1470, 370, 26, { align: "center", weight: 700, color: C.ink2 });
        const p = clamp((l - 0.3 - a * 0.52) / 2.5, 0, 1);
        [["SSD", 1, GREEN], ["HDD", 0.3, "#8A99A3"]].forEach(([s, sp, c], i) => { const y = 420 + i * 130; text(ctx, s, 1280, y + 40, 32, { weight: 900, color: c });
          ctx.fillStyle = "#FFFFFF"; rr(ctx, 1370, y + 10, 300, 40, 10); ctx.fill(); ctx.fillStyle = c; rr(ctx, 1370, y + 10, Math.max(10, 300 * clamp(p * sp * 1.4, 0, 1)), 40, 10); ctx.fill();
          if (p * sp * 1.4 >= 1) text(ctx, "siap ✓", 1520, y + 92, 24, { align: "center", weight: 900, color: c }); });
        text(ctx, "SSD jauh lebih cepat", 1470, 720, 28, { align: "center", weight: 900, color: GREEN }); ctx.globalAlpha = 1; }
    },
    spek_bima(ctx, b, l) {
      const span = SP(b), a = A(b);
      const pts = [{ x: 1240, y: 700, d: 0.2 }, { ...BACK, d: 0.9, click: true }, { ...BACK, d: 0.4 }, { ...BTN(1), d: 1.0, click: true }, { x: 1240, y: 520, d: 0.7 }, { x: 1240, y: 520, d: 3 }];
      const { S, P } = run(l, span, pts);
      const page = S.i <= 1 ? "nusa" : S.i <= 3 ? "cat" : "bima";
      const bg = browser(ctx, page === "cat" ? "komputerkita.example/laptop" : "komputerkita.example/laptop/" + (page === "nusa" ? "nusa-lite-14" : "bima-14"), page === "cat" ? "Laptop - KomputerKita" : KT.L[page].name + " - KomputerKita");
      let n = 0;
      if (page === "nusa") KT.detail(ctx, bg, "nusa", { marks: true, backHot: S.i === 1 && S.p(1) > 0.5 });
      else if (page === "cat") KT.catalog(ctx, bg, { hi: S.i === 3 && S.p(3) > 0.3 ? 1 : null, press: S.i === 3 ? (S.p(3) - 0.55) / 0.45 : 0 });
      else { n = Math.floor(clamp(S.i === 4 ? 0 : S.p(5) / 0.8, 0, 1) * 5); KT.detail(ctx, bg, "bima", { marks: n >= 5 ? true : [0, 2, 3, 6, 8][n] }); }
      KT.needs(ctx, PX, WIN.y, PW, { title: page === "bima" ? "BIMA 14" : "NUSA LITE 14", marks: page === "bima" ? needMarks("bima", n) : needMarks("nusa", 4) });
      ptr(ctx, P);
    },
    spek_kirana(ctx, b, l) {
      const a = A(b);
      const bg = browser(ctx, "komputerkita.example/laptop/kirana-15-gaming", "Kirana 15 Gaming - KomputerKita");
      const st = l < a * 0.3 ? { hi: "cpu" } : l < a * 0.52 ? { hi: "bat", marks: 6 } : l < a * 0.72 ? { hi: "kg", marks: 7 } : { marks: true, priceBad: true };
      KT.detail(ctx, bg, "kirana", st);
      if (l < a * 0.3) callout(ctx, 780, 300, "angka terbesar…", null, null, { color: C.accentDark, fill: "#FFF3D6", size: 24 });
      const m = needMarks("kirana", l < a * 0.3 ? 2 : l < a * 0.72 ? 3 : 5);
      KT.needs(ctx, PX, WIN.y, PW, { title: "KIRANA 15 GAMING", marks: m });
      if (l > a * 0.3) { card(ctx, PX, WIN.y + 446, PW, 140, { fill: "#FFF8E8", stroke: "#E9C46A", lw: 3, r: 18 }); text(ctx, "Kartu grafis terpisah", PX + 24, WIN.y + 494, 22, { weight: 900, color: "#C07A0C" });
        text(ctx, "tidak dibutuhkan", PX + 24, WIN.y + 526, 22, { weight: 800 }); text(ctx, "untuk mengetik dan slide", PX + 24, WIN.y + 558, 22, { weight: 800 }); }
    },
    cocokkan(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "MENCOCOKKAN SPESIFIKASI DENGAN KEBUTUHAN", 960, 206, 30, { align: "center", weight: 900, color: C.accentDark });
      const x0 = 220, cw = [520, 340, 340, 340], y0 = 236, rh = 70;
      const heads = ["Kebutuhan", "Nusa Lite 14", "Bima 14", "Kirana 15 Gaming"];
      const best = l > a * 0.4;
      if (best) { ctx.fillStyle = "#E3F5EA"; rr(ctx, x0 + cw[0] + cw[1], y0 - 6, cw[2], rh * 7 + 12, 14); ctx.fill(); ctx.strokeStyle = GREEN; ctx.lineWidth = 4; rr(ctx, x0 + cw[0] + cw[1], y0 - 6, cw[2], rh * 7 + 12, 14); ctx.stroke(); }
      let x = x0; heads.forEach((h, i) => { text(ctx, h, i ? x + cw[i] / 2 : x + 20, y0 + 44, 26, { align: i ? "center" : "left", weight: 900, fit: cw[i] - 20 }); x += cw[i]; });
      const rows = [["RAM ≥ 8 GB", "4 GB", "16 GB", "16 GB"], ["SSD", "HDD", "SSD", "SSD"], ["Baterai ≥ 8 jam", "5 jam", "10 jam", "4 jam"], ["Garansi ≥ 2 tahun", "1 tahun", "2 tahun", "1 tahun"], ["Harga dalam dana", "5,4 juta", "8,8 juta", "15,9 juta"]];
      const ok = [[0, 1, 1], [0, 1, 1], [0, 1, 0], [0, 1, 0], [1, 1, 0]];
      rows.forEach((r, i) => { const y = y0 + rh * (i + 1); const v = ease((l - 0.3 - i * a * 0.06) / 0.3); if (v <= 0) return; ctx.globalAlpha = v;
        ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 1540, y); ctx.stroke();
        let xx = x0; r.forEach((s, j) => { if (!j) text(ctx, s, xx + 20, y + 46, 26, { weight: 800 });
          else { const g = ok[i][j - 1]; text(ctx, s, xx + cw[j] / 2 - 20, y + 46, 26, { align: "center", weight: 700, color: g ? C.ink : RED }); text(ctx, g ? "✓" : "✗", xx + cw[j] - 40, y + 48, 30, { align: "center", weight: 900, color: g ? GREEN : RED }); }
          xx += cw[j]; }); ctx.globalAlpha = 1; });
      if (best) { text(ctx, "semua ✓", x0 + cw[0] + cw[1] + cw[2] / 2, y0 + rh * 6 + 46, 30, { align: "center", weight: 900, color: GREEN });
        text(ctx, "perlu upgrade", x0 + cw[0] + cw[1] / 2, y0 + rh * 6 + 46, 26, { align: "center", weight: 800, color: RED }); text(ctx, "terlalu mahal", x0 + cw[0] + cw[1] + cw[2] + cw[3] / 2, y0 + rh * 6 + 46, 26, { align: "center", weight: 800, color: RED }); }
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 280, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 290, 245, 20, 70, 6); ctx.fill(); rr(ctx, 330, 245, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 268, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 430, 316, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 380 + i * 112, 860, 92, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 438 + i * 112, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 437 + i * 112, 27, { weight: 700, fit: 750 }); });
      card(ctx, 1130, 370, 580, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "Catat seperti ini", 1160, 414, 24, { weight: 900, color: C.ink2 });
      [["Spesifikasi", "Laptop A", "Laptop B"], ["RAM", "8 GB ✓", "4 GB ✗"], ["Penyimpanan", "SSD ✓", "HDD ✗"], ["Baterai", "9 jam ✓", "6 jam ✗"], ["Garansi", "2 tahun ✓", "1 tahun ✗"], ["Harga", "Rp…", "Rp…"]].forEach((r, i) => {
        const y = 436 + i * 56; ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(1160, y, 520, 56);
        r.forEach((s, j) => text(ctx, s, [1176, 1356, 1526][j], y + 36, 21, { weight: i === 0 || j === 0 ? 800 : 700, color: j === 0 ? C.ink2 : s.includes("✗") ? RED : s.includes("✓") ? GREEN : C.ink })); });
    },
    tabel_isi(ctx, b, l) {
      const span = SP(b);
      const P = L.play({ cells: {}, active: "A1", pointer: { x: 700, y: 650 } }, [
        { click: "A1", d: 0.8 }, { type: "Biaya 5 tahun (juta Rp)", to: "A1", d: 1.8 }, { key: "Tab", commit: true, value: HEAD.A1, next: "B1", d: 0.4 },
        { type: "Nusa Lite 14", to: "B1", d: 1.0 }, { key: "Tab", commit: true, value: HEAD.B1, next: "C1", d: 0.4 }, { type: "Bima 14", to: "C1", d: 0.8 }, { key: "Enter", commit: true, value: HEAD.C1, next: "A2", d: 0.4 },
        { set: LAB, flash: true, d: 1.2 }, { wait: 1, d: 0.8 }], l, span, geoFn);
      sheetApp(ctx, { ...P.st, active: P.st.active });
      const y = pcard(ctx, "BIAYA LIMA TAHUN", 560);
      [["Harga beli", "saat membeli"], ["Listrik", "selama dipakai"], ["Perawatan dan upgrade", "servis, suku cadang"], ["Langganan aplikasi", "aplikasi dan cloud"], ["Cadangan 10%", "biaya tak terduga"]].forEach(([k, v], i) => {
        const on = l > span * (0.55 + i * 0.07); ctx.fillStyle = on ? "#FFF3D6" : "#F4F6F5"; rr(ctx, PX2 + 14, y + i * 92, PW2 - 28, 80, 10); ctx.fill();
        text(ctx, k, PX2 + 30, y + i * 92 + 34, 22, { weight: 900, fit: PW2 - 60 }); text(ctx, v, PX2 + 30, y + i * 92 + 64, 20, { weight: 600, color: C.ink2 }); });
      ptr(ctx, P.ptr ? { ...P.ptr, click: P.click, kind: P.kind } : null, P.key, PX2 + PW2 / 2);
    },
    angka_isi(ctx, b, l) {
      const span = SP(b), cells = { ...HEAD, ...LAB }; const order = ["B2", "B3", "B4", "B5", "C2", "C3", "C4", "C5"];
      const n = Math.floor(clamp(l / (span * 0.8), 0, 1) * order.length + 1e-6);
      order.slice(0, n).forEach(a => cells[a] = NUMS[a]);
      const cur = order[Math.min(n, order.length - 1)];
      sheetApp(ctx, { cells, active: n >= order.length ? "C5" : cur, changed: n ? [order[n - 1]] : [], marks: [["B4", "rgba(242,177,52,0.25)"]] });
      const y = pcard(ctx, "DARI MANA ANGKANYA?", 640);
      line(ctx, "Perawatan Nusa Lite:", y + 10, { weight: 900 }); line(ctx, "RAM 0,6 + SSD 0,8 + servis 0,5", y + 42, { size: 20 }); line(ctx, "= 1,9 juta", y + 72, { color: RED, weight: 900 });
      line(ctx, "Perawatan Bima: servis 0,7", y + 112, { size: 20 });
      line(ctx, "Listrik 5 tahun:", y + 168, { weight: 900 }); line(ctx, "6 jam × 200 hari × 5 tahun", y + 200, { size: 20 }); line(ctx, "tarif Rp1.500 per kWh", y + 228, { size: 20 });
      line(ctx, "Nusa 65 W → 0,6 juta", y + 258, { size: 20 }); line(ctx, "Bima 45 W → 0,4 juta", y + 286, { size: 20 });
      line(ctx, "Langganan aplikasi:", y + 342, { weight: 900 }); line(ctx, "Rp220.000 × 5 tahun = 1,1 juta", y + 374, { size: 20 });
      card(ctx, PX2 + 14, y + 410, PW2 - 28, 120, { fill: "#FFF3D6", r: 12 }); line(ctx, "Ketik angkanya saja,", y + 456, { weight: 900, color: C.accentDark }); line(ctx, "pakai koma desimal: 5,4", y + 490, { weight: 800, color: C.accentDark });
    },
    rumus_cadangan(ctx, b, l) {
      const span = SP(b), base = { cells: { ...HEAD, ...LAB, ...NUMS }, active: "B5", pointer: { x: 700, y: 650 } };
      const P = L.play(base, [{ click: "B6", d: 0.8 }, { type: "=SUM(B2:B5)*10%", to: "B6", d: 3.0 }, { key: "Enter", commit: true, value: B6, next: "B7", d: 0.6 }, { wait: 1, d: 0.4 }, { click: "B6", d: 0.8 }, { wait: 1, d: 1.2 }], l, span, geoFn);
      const st = { ...P.st }; if (st.edit && st.edit.text.length >= 10) st.range = ["B2", "B5"];
      sheetApp(ctx, st);
      const y = pcard(ctx, "ARTI RUMUSNYA", 560);
      [["=", "awal rumus"], ["SUM( … )", "jumlahkan"], ["B2:B5", "dari B2 sampai B5"], ["*10%", "kali sepuluh persen"]].forEach(([k, v], i) => { const yy = y + i * 92;
        ctx.fillStyle = "#F4F6F5"; rr(ctx, PX2 + 14, yy, PW2 - 28, 80, 10); ctx.fill(); text(ctx, k, PX2 + 30, yy + 36, 26, { weight: 900, color: "#1F5A6E" }); text(ctx, v, PX2 + 30, yy + 66, 20, { weight: 700, color: C.ink2 }); });
      if (l > span * 0.75) { card(ctx, PX2 + 14, y + 376, PW2 - 28, 90, { fill: C.goodBg, r: 12 }); line(ctx, "9,0 × 10% = 0,9", y + 432, { size: 28, weight: 900, color: GREEN }); }
      ptr(ctx, P.ptr ? { ...P.ptr, click: P.click, kind: P.kind } : null, P.key, PX2 + PW2 / 2);
    },
    rumus_total(ctx, b, l) {
      const span = SP(b), base = { cells: { ...HEAD, ...LAB, ...NUMS, B6 }, active: "B6", pointer: GEO.cell("B6") };
      const P = L.play(base, [{ click: "B7", d: 0.8 }, { type: "=SUM(B2:B6)", to: "B7", d: 2.4 }, { key: "Enter", commit: true, value: B7, next: "B8", d: 0.6 }, { wait: 1, d: 0.3 }, { click: "B7", d: 0.8 }, { wait: 1, d: 1.4 }], l, span, geoFn);
      const st = { ...P.st }; if (st.edit && st.edit.text.length >= 8) st.range = ["B2", "B6"];
      sheetApp(ctx, st);
      const y = pcard(ctx, "CEK DENGAN BERHITUNG", 420);
      ["5,4 + 0,6 + 1,9", "+ 1,1 + 0,9"].forEach((s, i) => line(ctx, s, y + 20 + i * 40, { size: 28, weight: 800 }));
      if (l > span * 0.6) { card(ctx, PX2 + 14, y + 120, PW2 - 28, 100, { fill: C.goodBg, r: 12 }); line(ctx, "= 9,9 juta ✓", y + 184, { size: 34, weight: 900, color: GREEN }); }
      ptr(ctx, P.ptr ? { ...P.ptr, click: P.click, kind: P.kind } : null, P.key, PX2 + PW2 / 2);
    },
    rumus_salin(ctx, b, l) {
      const span = SP(b), base = { cells: { ...HEAD, ...LAB, ...NUMS, B6, B7 }, active: "B7", pointer: GEO.cell("B7") };
      const P = L.play(base, [{ click: "B6", d: 0.7 }, { select: ["B6", "B7"], d: 0.5 }, { drag: ["B7", "C7"], fill: { C6, C7 }, d: 2.2 }, { state: { active: "B6", selTo: "C7" }, d: 0.6 }, { click: "C7", d: 0.9 }, { wait: 1, d: 1.6 }], l, span, geoFn);
      sheetApp(ctx, P.st);
      const y = pcard(ctx, "RUMUS IKUT BERGESER", 400);
      [["C6", "=SUM(C2:C5)*10%", "1,1"], ["C7", "=SUM(C2:C6)", "12,1"]].forEach(([c, f, v], i) => { const on = l > span * (0.5 + i * 0.1); if (!on) return; const yy = y + i * 140;
        ctx.fillStyle = C.goodBg; rr(ctx, PX2 + 14, yy, PW2 - 28, 124, 10); ctx.fill(); text(ctx, c, PX2 + 30, yy + 38, 26, { weight: 900 }); text(ctx, "→ " + v, PX2 + PW2 - 30, yy + 38, 26, { align: "right", weight: 900, color: GREEN });
        text(ctx, f, PX2 + 30, yy + 90, 25, { weight: 800, color: "#1F5A6E", fit: PW2 - 60 }); });
      ptr(ctx, P.ptr ? { ...P.ptr, click: P.click, kind: P.kind, down: P.down } : null, P.key, PX2 + PW2 / 2);
    },
    grafik(ctx, b, l) {
      const span = SP(b);
      const ins = menuPos(ctx, "Sisipkan");
      const pts = [{ ...GEO.cell("C7"), d: 0.2 }, { x: GEO.cell("A1").cx, y: GEO.cell("A1").cy, d: 0.8, click: true }, { x: GEO.cell("C6").cx, y: GEO.cell("C6").cy, d: 1.2, down: true }, { x: ins.cx, y: ins.cy, d: 1.0, click: true }, { x: ins.cx + 40, y: ins.cy + 34 + 46 * 1 + 23, d: 0.8, click: true }, { x: 1200, y: 800, d: 0.8 }, { x: 1200, y: 800, d: 1.4 }];
      const { S, P } = run(l, span, pts);
      const sel = S.i >= 2 ? { active: "A1", selTo: S.i === 2 ? ["A1", "B2", "C4", "C6"][Math.min(3, Math.floor(S.p(2) * 4))] : "C6", range: ["A1", S.i === 2 ? ["A1", "B2", "C4", "C6"][Math.min(3, Math.floor(S.p(2) * 4))] : "C6"] } : { active: S.i === 1 && S.p(1) > 0.6 ? "A1" : "C7" };
      const menuOpen = S.i === 4 || (S.i === 3 && S.p(3) > 0.6);
      sheetApp(ctx, { cells: FULL, ...sel }, { menuOn: menuOpen ? "Sisipkan" : null });
      if (menuOpen) { const mx = ins.x, my = SW.y + 86; ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 18; ctx.fillStyle = "#FFFFFF"; rr(ctx, mx, my, 260, 4 * 46 + 16, 10); ctx.fill(); ctx.restore();
        ["Gambar", "Grafik", "Tabel", "Komentar"].forEach((s, i) => { const iy = my + 8 + i * 46; if (i === 1) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(mx + 4, iy, 252, 46); } text(ctx, s, mx + 24, iy + 31, 22, { weight: i === 1 ? 800 : 600, color: i === 1 ? BLUE : C.ink }); }); }
      if (S.i >= 5) G.chart(ctx, CH.x, CH.y, CH.w, CH.h, { ...SPEC, grow: S.i === 5 ? S.p(5) : 1, sel: true });
      steps2(ctx, "LANGKAH", ["Pilih A1 sampai C6", "Klik Sisipkan", "Klik Grafik"], stepN(S, [2, 3, 4]));
      ptr(ctx, { ...P, down: S.i === 2 });
    },
    baca_grafik(ctx, b, l) {
      const a = A(b);
      sheetApp(ctx, { cells: FULL, active: "C7", marks: l > a * 0.45 ? [["B7", "rgba(242,177,52,0.3)"], ["C7", "rgba(242,177,52,0.3)"]] : [["B2", "rgba(242,177,52,0.3)"], ["C2", "rgba(242,177,52,0.3)"]] });
      G.chart(ctx, CH.x, CH.y, CH.w, CH.h, { ...SPEC, hi: l > a * 0.45 ? 2 : 0 });
      const y = pcard(ctx, "SELISIH", 560);
      line(ctx, "Harga beli", y + 14, { weight: 900 }); line(ctx, "8,8 − 5,4 = 3,4 juta", y + 50, { size: 26, weight: 800 });
      if (l > a * 0.45) { line(ctx, "Total 5 tahun", y + 116, { weight: 900 }); line(ctx, "12,1 − 9,9 = 2,2 juta", y + 152, { size: 26, weight: 800, color: GREEN });
        card(ctx, PX2 + 14, y + 196, PW2 - 28, 150, { fill: "#FFF3D6", r: 12 }); line(ctx, "Kenapa menyempit?", y + 236, { weight: 900, color: C.accentDark });
        line(ctx, "Perawatan Nusa 1,9 juta,", y + 272, { size: 21 }); line(ctx, "Bima hanya 0,7 juta.", y + 302, { size: 21 }); }
    },
    rekomendasi(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      card(ctx, 260, 180, 1100, 610, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 10 });
      text(ctx, "REKOMENDASI LAPTOP UNTUK BU RINA", 310, 240, 30, { weight: 900, color: C.accentDark });
      text(ctx, "Pilihan: Bima 14", 310, 304, 40, { weight: 900 });
      text(ctx, "Biaya 5 tahun Rp12,1 juta (sekitar Rp2,42 juta per tahun)", 310, 348, 26, { weight: 700, color: C.ink2 });
      text(ctx, "Alasan", 310, 410, 28, { weight: 900 });
      ["RAM 16 GB dan SSD: lancar untuk banyak tab dan slide.", "Baterai 10 jam: cukup untuk sehari mengajar.", "Garansi 2 tahun; berat 1,4 kg.", "Di bawah dana Rp13 juta, sisa Rp0,9 juta."].forEach((s, i) => { const v = ease((l - 0.4 - i * a * 0.12) / 0.4); if (v <= 0) return; ctx.globalAlpha = v;
        ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(326, 448 + i * 50, 9, 0, Math.PI * 2); ctx.fill(); text(ctx, s, 350, 457 + i * 50, 26, { weight: 700 }); ctx.globalAlpha = 1; });
      if (l > a * 0.65) { card(ctx, 300, 664, 1020, 100, { fill: "#F4F6F5", r: 12 }); text(ctx, "Alternatif: Nusa Lite 14 + upgrade, Rp9,9 juta.", 330, 706, 25, { weight: 800 });
        text(ctx, "Risiko: baterai 5 jam, garansi hanya 1 tahun.", 330, 742, 24, { weight: 700, color: RED }); }
      KT.laptop(ctx, 1540, 520, 240, KT.L.bima.color); text(ctx, "Bima 14", 1540, 620, 32, { align: "center", weight: 900 });
      if (l > a * 0.3) { ctx.fillStyle = GREEN; rr(ctx, 1430, 650, 220, 60, 30); ctx.fill(); text(ctx, "✓ Dipilih", 1540, 690, 28, { align: "center", weight: 900, color: "#FFFFFF" }); }
    },
    salah_harga(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "KESALAHAN 1: HANYA MELIHAT HARGA BELI", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 220, 250, 720, 540, { fill: "#FDF1F0", stroke: RED, lw: 4, r: 20 }); text(ctx, "✗ harga beli saja", 580, 302, 30, { align: "center", weight: 900, color: RED });
      bars(ctx, 260, 350, 660, [["Nusa", 5.4, "#8A99A3"], ["Bima", 8.8, "#2E7E9A"]], 12.1);
      para(ctx, "\"Nusa lebih murah 3,4 juta, pilih Nusa!\"", 580, 560, 28, 640, { align: "center", weight: 800, lh: 1.25 });
      if (l > a * 0.45) { card(ctx, 980, 250, 720, 540, { fill: "#F2FAF4", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "✓ biaya lima tahun", 1340, 302, 30, { align: "center", weight: 900, color: GREEN });
        bars(ctx, 1020, 350, 660, [["Nusa", 9.9, "#8A99A3"], ["Bima", 12.1, "#2E7E9A"]], 12.1);
        para(ctx, "Selisih tinggal 2,2 juta, dan hanya Bima yang memenuhi kebutuhan.", 1340, 560, 28, 640, { align: "center", weight: 800, lh: 1.25 }); }
    },
    salah_satuan(ctx, b, l) {
      const a = A(b), fixed = l > a * 0.62;
      const cells = { ...FULL };
      if (!fixed) Object.assign(cells, { C2: { v: "8,8 juta", color: RED }, C6: { v: 0.22, f: "=SUM(C2:C5)*10%" }, C7: { v: 2.42, f: "=SUM(C2:C6)", bold: true, color: RED } });
      sheetApp(ctx, { cells, active: fixed ? "C7" : "C2", marks: fixed ? [["C7", C.goodBg]] : [["C2", "#FBE1DF"], ["C7", "#FBE1DF"]], changed: fixed ? ["C2", "C6", "C7"] : [] });
      if (!fixed && l > a * 0.2) callout(ctx, 900, 560, "Rata kiri: ini teks!", null, null, { color: RED, fill: "#FFFFFF", size: 24 });
      const y = pcard(ctx, fixed ? "SUDAH DIPERBAIKI" : "TOTAL SALAH", 470);
      if (!fixed) { line(ctx, "C2 berisi teks", y + 14, { weight: 900, color: RED }); line(ctx, "\"8,8 juta\", jadi SUM", y + 48, { size: 21 }); line(ctx, "melewatinya.", y + 76, { size: 21 });
        line(ctx, "Total Bima: 2,42 ✗", y + 130, { size: 28, weight: 900, color: RED }); }
      else { line(ctx, "Ketik 8,8 saja.", y + 14, { weight: 900, color: GREEN }); line(ctx, "Satuannya di judul A1:", y + 50, { size: 21 }); line(ctx, "(juta Rp)", y + 80, { size: 21, weight: 900 });
        line(ctx, "Total Bima: 12,1 ✓", y + 134, { size: 28, weight: 900, color: GREEN }); }
    },
    periksa(ctx, b, l) {
      const a = A(b);
      sheetApp(ctx, { cells: FULL, active: "C7" });
      G.chart(ctx, CH.x, CH.y, CH.w, CH.h, SPEC);
      const y = pcard(ctx, "PERIKSA HASILMU", 520);
      ["B7 = 9,9", "C7 = 12,1", "Angka rata kanan", "Rentang rumus benar"].forEach((s, i) => { const on = l > a * (0.15 + i * 0.16), yy = y + i * 100;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, PX2 + 14, yy, PW2 - 28, 84, 12); ctx.fill(); text(ctx, s, PX2 + 32, yy + 52, 26, { weight: 800, fit: PW2 - 110 });
        text(ctx, on ? "✓" : "?", PX2 + PW2 - 46, yy + 54, 32, { align: "center", weight: 900, color: on ? GREEN : C.ink2 }); });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F11.9", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Konfigurator", 620, 414, 28, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "Penyusun anggaran", 620, 452, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 340, 500, 560, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f119", 620, 546, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "pilih, hitung, lalu periksa petunjuknya", 620, 636, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Wawancarai satu guru. Tulis kebutuhannya, pilih laptop dari katalog sungguhan, lalu hitung anggaran lima tahunnya.", 1310, 420, 29, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
