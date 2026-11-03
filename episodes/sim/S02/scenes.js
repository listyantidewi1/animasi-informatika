/* S02 Simulasi praktik: tabel, alamat sel, dan rumus pertama di lembar kerja generik.
   Jendela aplikasi di kiri (x 110–1410), panel langkah di kanan (x 1450–1820). Semua data rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const CW = { A: 190, B: 150, C: 150, D: 160, E: 130, F: 130 };
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";

  // ---------- data penjualan (rekaan) ----------
  const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"], BAKSO = [12, 15, 10, 18, 20], ESTEH = [20, 25, 18, 30, 27];
  const STAGES = ["judul", "hari", "angka", "d1", "d2", "d26", "total", "total_all", "avg", "avg_c"];
  function cells(stage) {
    const k = STAGES.indexOf(stage), c = {};
    if (k >= 0) Object.assign(c, { A1: "Hari", B1: "Bakso", C1: "Es teh" });
    if (k >= 1) DAYS.forEach((d, i) => c["A" + (i + 2)] = d);
    if (k >= 2) BAKSO.forEach((v, i) => { c["B" + (i + 2)] = v; c["C" + (i + 2)] = ESTEH[i]; });
    if (k >= 3) c.D1 = "Jumlah";
    if (k >= 4) c.D2 = { v: 32, f: "=B2+C2" };
    if (k >= 5) [3, 4, 5, 6].forEach(r => c["D" + r] = { v: BAKSO[r - 2] + ESTEH[r - 2], f: `=B${r}+C${r}` });
    if (k >= 6) { c.A7 = "Total"; c.B7 = { v: 75, f: "=SUM(B2:B6)" }; }
    if (k >= 7) { c.C7 = { v: 120, f: "=SUM(C2:C6)" }; c.D7 = { v: 195, f: "=SUM(D2:D6)" }; }
    if (k >= 8) { c.A8 = "Rata-rata"; c.B8 = { v: 15, f: "=AVERAGE(B2:B6)" }; }
    if (k >= 9) c.C8 = { v: 24, f: "=AVERAGE(C2:C6)" };
    return c;
  }

  // ---------- bingkai: jendela + lembar kerja ----------
  function app(ctx, st, opt = {}) {
    const area = L.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: opt.title || "Lembar Kerja — Tanpa judul", menus: ["File", "Edit", "Tampilan", "Sisipkan", "Format", "Data"], menuOn: opt.menuOn, tools: true });
    return L.sheet(ctx, { x: area.x + 14, y: area.y }, { cols: 6, rows: 8, rh: 46, cw: opt.cw || CW, ...st });
  }
  function geoOf(ctx, base, opt) { let g; return () => g || (g = (() => { ctx.save(); ctx.globalAlpha = 0; const r = app(ctx, base, opt); ctx.restore(); return r; })()); }
  // panel langkah di kanan: judul + daftar langkah, langkah ke-n sedang dikerjakan
  function steps(ctx, title, items, n, opt = {}) {
    const x = 1450, y = opt.y || 122, w = 370; let hh = 70;
    const rows = items.map(s => { ctx.font = "700 23px Inter"; const lines = H.wrap(ctx, s, 23, 700, w - 86); return lines; });
    rows.forEach(lines => hh += lines.length * 30 + 22);
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
  // langkah ke berapa sekarang, dari pembagian waktu aksi (batas kumulatif)
  const stepAt = (l, span, marks) => { let n = 0; marks.forEach((m, i) => { if (l >= m * span) n = i + 1; }); return n; };
  function show(ctx, P, g) {
    if (P.ptr) L.cursor(ctx, P.ptr.x, P.ptr.y, { kind: P.kind, click: P.click, down: P.down });
    if (P.key) L.keys(ctx, 1635, 700, P.key.keys, { press: P.key.press, align: "center", size: 30 });
  }
  // satu adegan aksi: state dasar + daftar aksi; panel langkah mengikuti
  function action(ctx, b, l, base, acts, panel, opt = {}) {
    const span = Math.max(3, (b.audio || b.dur) * (opt.speed || 0.92));
    const g = geoOf(ctx, base, opt);
    const P = L.play(base, acts, l, span, g);
    if (opt.mod) opt.mod(P.st, l, span);
    const geo = app(ctx, P.st, opt);
    if (panel) steps(ctx, panel.title || "LANGKAH", panel.items, stepAt(l, span, panel.marks));
    if (opt.after) opt.after(ctx, geo, P, l, span);
    show(ctx, P, geo);
    return { geo, P };
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["membuat tabel penjualan", "menulis rumus pertama", "menyalin rumus ke bawah", "memakai SUM dan AVERAGE"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 760, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      // laptop kecil berisi lembar kerja
      ctx.fillStyle = "#2B3A44"; rr(ctx, 1130, 300, 500, 320, 18); ctx.fill(); ctx.fillStyle = "#FFFFFF"; rr(ctx, 1148, 318, 464, 284, 8); ctx.fill();
      ctx.fillStyle = "#5B6B76"; rr(ctx, 1090, 620, 580, 26, 10); ctx.fill();
      ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; for (let r = 0; r <= 7; r++) { ctx.beginPath(); ctx.moveTo(1160, 340 + r * 34); ctx.lineTo(1600, 340 + r * 34); ctx.stroke(); }
      for (let c = 0; c <= 4; c++) { ctx.beginPath(); ctx.moveTo(1160 + c * 110, 340); ctx.lineTo(1160 + c * 110, 578); ctx.stroke(); }
      ctx.strokeStyle = BLUE; ctx.lineWidth = 4; ctx.strokeRect(1270, 408, 110, 34);
      text(ctx, "aplikasi lembar kerja apa pun", 1380, 700, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      [["D7.6", "Data Terstruktur di Sekitar Kita", "tabel: baris dan kolom"], ["D8.1", "Lembar Kerja Pengolah Data", "sel, rumus, fungsi"]].forEach(([c, t, s], i) => {
        const x = 330 + i * 660; card(ctx, x, 300, 600, 300, { fill: C.bg2, r: 22 });
        text(ctx, c, x + 300, 380, 56, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 300, 440, 34, 520, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 300, 560, 26, { align: "center", weight: 600, color: C.ink2 });
      });
      kiko(ctx, 1640, 700, 110, 0, { wave: l });
    },
    kenal_kisi(ctx, b, l) {
      const geo = app(ctx, { cells: {} });
      const a = b.audio || b.dur, u1 = l > a * 0.22, u2 = l > a * 0.5, u3 = l > a * 0.72;
      if (u1) { const q = geo.cell("C3"); ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.strokeRect(q.x + 2, q.y + 2, q.w - 4, q.h - 4); L.callout(ctx, 1450, 420, "Satu kotak = satu sel", q.x + q.w, q.cy); }
      if (u2) { const q = geo.cell("B1"); ctx.fillStyle = "rgba(242,177,52,0.25)"; ctx.fillRect(geo.cell("A1").x, geo.top, geo.right - geo.cell("A1").x, 46); L.callout(ctx, 1450, 200, "Huruf di atas = nama kolom", geo.cell("F1").x + 100, geo.top + 23); }
      if (u3) { ctx.fillStyle = "rgba(242,177,52,0.25)"; ctx.fillRect(geo.cell("A1").x - 60, geo.top + 46, 60, 46 * 8); L.callout(ctx, 1450, 600, "Angka di kiri = nomor baris", geo.cell("A6").x - 30, geo.cell("A6").cy); }
    },
    kenal_bilah(ctx, b, l) {
      const geo = app(ctx, { cells: { B3: "Bakso" }, active: "B3" });
      const a = b.audio || b.dur;
      if (l > a * 0.12) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; rr(ctx, geo.nameBox.x - 64, geo.nameBox.y - 28, 1100, 56, 10); ctx.stroke(); L.callout(ctx, 1450, 170, "Bilah rumus", geo.nameBox.x + 1040, geo.nameBox.y); }
      if (l > a * 0.42) L.callout(ctx, 1450, 330, "Kiri: alamat sel yang dipilih", geo.nameBox.x, geo.nameBox.y + 28);
      if (l > a * 0.7) L.callout(ctx, 1450, 480, "Kanan: isi sel itu", geo.fx.x + 40, geo.fx.y + 26);
    },
    pilih_sel(ctx, b, l) {
      action(ctx, b, l, { cells: {}, active: "A1", pointer: { x: 900, y: 700 } }, [{ wait: 1, d: 0.6 }, { click: "B3", d: 1.4 }, { wait: 1, d: 2 }],
        { title: "LANGKAH", items: ["Klik sel di kolom B, baris 3.", "Lihat bilah rumus: B3."], marks: [0.45, 1] },
        { after: (ctx, geo, P, ll, span) => { if (ll > span * 0.5) { L.callout(ctx, 1450, 380, "B3 = kolom B + baris 3", geo.cell("B3").x + 150, geo.cell("B3").cy); L.callout(ctx, 1450, 520, "Huruf kolom dulu, baru nomor baris.", null, null, { fill: "#E7F1FB", color: BLUE }); } } });
    },
    ketik_judul(ctx, b, l) {
      action(ctx, b, l, { cells: {}, active: "B3", pointer: { x: 520, y: 560 } }, [
        { click: "A1", d: 1 }, { type: "Hari", to: "A1", d: 1.2 }, { key: "Tab", commit: true, next: "B1", d: 0.8 },
        { type: "Bakso", to: "B1", d: 1.3 }, { key: "Tab", commit: true, next: "C1", d: 0.8 }, { type: "Es teh", to: "C1", d: 1.3 }, { key: "Enter", commit: true, next: "A2", d: 0.9 }, { wait: 1, d: 0.6 }],
        { items: ["Klik A1, ketik Hari.", "Tekan Tab, ketik Bakso.", "Tekan Tab, ketik Es teh."], marks: [0.28, 0.6, 0.92] });
    },
    ketik_hari(ctx, b, l) {
      const acts = [{ click: "A2", d: 1 }]; DAYS.forEach((d, i) => { acts.push({ type: d, to: "A" + (i + 2), d: 1 }, { key: "Enter", commit: true, next: "A" + (i + 3), d: 0.6 }); }); acts.push({ wait: 1, d: 0.5 });
      action(ctx, b, l, { cells: cells("judul"), active: "A2", pointer: { x: 700, y: 640 } }, acts,
        { items: ["Klik A2, ketik Senin.", "Tekan Enter: turun ke A3.", "Lanjutkan sampai Jumat."], marks: [0.2, 0.36, 0.95] });
    },
    ketik_angka(ctx, b, l) {
      const acts = [{ click: "B2", d: 0.8 }];
      BAKSO.forEach((v, i) => acts.push({ type: String(v), to: "B" + (i + 2), d: 0.45 }, { key: "Enter", commit: true, value: v, next: "B" + (i + 3), d: 0.4 }));
      acts.push({ click: "C2", d: 0.7 });
      ESTEH.forEach((v, i) => acts.push({ type: String(v), to: "C" + (i + 2), d: 0.45 }, { key: "Enter", commit: true, value: v, next: "C" + (i + 3), d: 0.4 }));
      acts.push({ wait: 1, d: 0.5 });
      action(ctx, b, l, { cells: cells("hari"), active: "A7", pointer: { x: 560, y: 380 } }, acts,
        { items: ["Isi kolom B: porsi bakso.", "Isi kolom C: porsi es teh.", "Ketik angkanya saja."], marks: [0.47, 0.95, 1] });
    },
    rata_kanan(ctx, b, l) {
      const geo = app(ctx, { cells: cells("angka"), active: "B3" });
      const a = b.audio || b.dur;
      if (l > a * 0.1) { const q = geo.cell("A3"); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.strokeRect(q.x + 2, q.y + 2, q.w - 4, q.h - 4); L.callout(ctx, 1450, 200, "Teks: rata kiri", q.x + 30, q.y + 6); }
      if (l > a * 0.3) { const q = geo.cell("B3"); L.callout(ctx, 1450, 330, "Angka: rata kanan", q.x + q.w - 30, q.y + 6); }
      if (l > a * 0.55) {
        card(ctx, 1450, 470, 370, 250, { fill: "#FFFFFF", stroke: RED, lw: 3, r: 16 }); text(ctx, "Tanda ada yang salah:", 1474, 512, 24, { weight: 900, color: RED });
        ctx.fillStyle = "#FBE1DF"; ctx.fillRect(1480, 540, 300, 56); ctx.strokeStyle = "#E7B5B1"; ctx.lineWidth = 2; ctx.strokeRect(1480, 540, 300, 56);
        text(ctx, "15 porsi", 1496, 578, 26, { weight: 700 }); text(ctx, "angka ini rata kiri, jadi", 1474, 640, 22, { weight: 700, color: C.ink2 }); text(ctx, "tidak bisa dihitung", 1474, 670, 22, { weight: 700, color: C.ink2 });
      }
    },
    coba(ctx, b, l, t, TL) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 300, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 262, 22, 76, 6); ctx.fill(); rr(ctx, 340, 262, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 280, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 330, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 250, 420 + i * 110, 820, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 296, 476 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 340, 476 + i * 110, 28, { weight: 700 }); });
      // tabel target mini
      const xs = 1150, ys = 420; card(ctx, xs - 20, ys - 60, 560, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Hasil yang dituju", xs, ys - 22, 24, { weight: 900, color: C.ink2 });
      const rows = [["Hari", "Bakso", "Es teh"]].concat(DAYS.map((d, i) => [d, BAKSO[i], ESTEH[i]]));
      rows.forEach((r, i) => r.forEach((v, j) => { const x = xs + j * 170, y = ys + i * 52; ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(x, y, 170, 52); text(ctx, String(v), typeof v === "number" ? x + 156 : x + 12, y + 35, 24, { align: typeof v === "number" ? "right" : "left", weight: i === 0 ? 800 : 600 }); }));
    },
    rumus_ketik(ctx, b, l) {
      action(ctx, b, l, { cells: cells("angka"), active: "C7", pointer: { x: 800, y: 640 } }, [
        { click: "D1", d: 0.9 }, { type: "Jumlah", to: "D1", d: 1 }, { key: "Enter", commit: true, next: "D2", d: 0.7 },
        { type: "=", to: "D2", d: 0.6 }, { move: "B2", tap: true, d: 0.9 }, { type: "B2", prefix: "=", to: "D2", d: 0.25, refs: [["B2", BLUE, 0]] },
        { type: "+", prefix: "=B2", to: "D2", d: 0.6 }, { move: "C2", tap: true, d: 0.9 }, { type: "C2", prefix: "=B2+", to: "D2", d: 0.25 }, { wait: 1, d: 0.8 }],
        { items: ["Klik D1, ketik Jumlah.", "Klik D2, ketik =", "Klik B2, ketik +", "Klik C2."], marks: [0.37, 0.48, 0.74, 0.92] },
        { mod: (st) => { if (st.edit && st.edit.addr === "D2") { st.refs = []; if (st.edit.text.includes("B2")) st.refs.push(["B2", BLUE]); if (st.edit.text.includes("C2")) st.refs.push(["C2", RED]); } } });
    },
    rumus_enter(ctx, b, l) {
      const base = { cells: cells("d1"), pointer: { x: 900, y: 420 } };
      action(ctx, b, l, base, [{ state: { edit: { addr: "D2", text: "=B2+C2" }, refs: [["B2", BLUE], ["C2", RED]] }, d: 0.4 }, { key: "Enter", commit: true, value: { v: 32, f: "=B2+C2" }, next: "D3", d: 1 }, { wait: 1, d: 0.6 }, { click: "D2", d: 1.2 }, { wait: 1, d: 1.6 }],
        { items: ["Tekan Enter.", "Klik lagi D2.", "Lihat bilah rumus."], marks: [0.3, 0.6, 1] },
        { mod: (st, ll, span) => { if (ll > span * 0.08 && ll < span * 0.3) { st.edit = { addr: "D2", text: "=B2+C2" }; st.refs = [["B2", BLUE], ["C2", RED]]; } },
          after: (ctx, geo, P, ll, span) => { if (ll > span * 0.62) { L.callout(ctx, 1450, 420, "Bilah rumus: =B2+C2", geo.fx.x + 90, geo.fx.y + 26); L.callout(ctx, 1450, 540, "Sel menampilkan: 32", geo.cell("D2").x + 140, geo.cell("D2").cy); } } });
    },
    rumus_tersimpan(ctx, b, l) {
      const geo = app(ctx, { cells: cells("d2"), active: "D2" });
      const a = b.audio || b.dur;
      card(ctx, 1450, 150, 370, 560, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "DI DALAM SEL D2", 1635, 200, 24, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 1480, 230, 310, 160, { fill: "#E7F1FB", r: 14 }); text(ctx, "yang tersimpan", 1635, 270, 24, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "=B2+C2", 1635, 340, 46, { align: "center", weight: 900, color: L.UI.formula });
      if (l > a * 0.45) { card(ctx, 1480, 420, 310, 160, { fill: C.goodBg, r: 14 }); text(ctx, "yang ditampilkan", 1635, 460, 24, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "32", 1635, 535, 56, { align: "center", weight: 900, color: GREEN }); }
      L.callout(ctx, 1480, 620, "Rumus menghitung; sel menampilkan hasilnya.", null, null, { size: 22, maxW: 300 });
    },
    rumus_hidup(ctx, b, l) {
      action(ctx, b, l, { cells: cells("d2"), active: "D2", pointer: { x: 760, y: 470 } }, [{ wait: 1, d: 0.4 }, { click: "B2", d: 1 }, { type: "14", to: "B2", d: 0.7 }, { key: "Enter", commit: true, value: 14, next: "B3", d: 0.8 }, { set: { D2: { v: 34, f: "=B2+C2" } }, flash: true, d: 0.6 }, { wait: 1, d: 2.2 }],
        { items: ["Klik B2, ketik 14.", "Tekan Enter.", "Lihat D2 berubah sendiri."], marks: [0.37, 0.5, 1] },
        { after: (ctx, geo, P, ll, span) => { if (ll > span * 0.52) { const a = geo.cell("B2"), c = geo.cell("C2"), d = geo.cell("D2"); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(a.cx + 30, a.y + a.h - 6); ctx.quadraticCurveTo(c.cx, c.y + c.h + 30, d.cx - 20, d.y + d.h - 6); ctx.stroke(); L.callout(ctx, 1450, 470, "12 → 14, maka 32 → 34", d.x + d.w, d.cy); } } });
    },
    rumus_kembali(ctx, b, l) {
      const c = cells("d2"); c.B2 = 14; c.D2 = { v: 34, f: "=B2+C2" };
      action(ctx, b, l, { cells: c, active: "B3", pointer: { x: 760, y: 470 } }, [{ click: "B2", d: 1 }, { type: "12", to: "B2", d: 0.7 }, { key: "Enter", commit: true, value: 12, next: "B3", d: 0.8 }, { set: { D2: { v: 32, f: "=B2+C2" } }, flash: true, d: 0.5 }, { wait: 1, d: 1.2 }],
        { items: ["Klik B2, ketik 12.", "Tekan Enter."], marks: [0.6, 1] });
    },
    salin_gagang(ctx, b, l) {
      const a = b.audio || b.dur, base = { cells: cells("d2"), active: "B3", pointer: { x: 900, y: 600 } };
      const g = geoOf(ctx, base); const P = L.play(base, [{ click: "D2", d: 1 }, { wait: 1, d: 0.5 }, { hover: "D2", d: 1.6 }, { wait: 1, d: 1.5 }], l, a * 0.9, g);
      const z = ease(clamp((l - a * 0.3) / (a * 0.15), 0, 1)); const h = g().handle("D2");
      L.zoom(ctx, h.x, h.y, 1 + 1.6 * z, () => { app(ctx, P.st); if (P.ptr) L.cursor(ctx, P.ptr.x, P.ptr.y, { kind: P.kind, click: P.click }); }, lerp(h.x, 760, z), lerp(h.y, 470, z));
      steps(ctx, "LANGKAH", ["Klik D2.", "Arahkan pointer ke kotak kecil di pojok kanan bawah.", "Pointer menjadi tanda tambah tipis."], stepAt(l, a * 0.9, [0.25, 0.65, 1]));
      if (z > 0.95 && P.kind === "plus") L.callout(ctx, 1450, 560, "Kotak kecil: tarik untuk menyalin", 760 + 18, 470 + 18);
    },
    salin_drag(ctx, b, l) {
      const fill = {}; [3, 4, 5, 6].forEach(r => fill["D" + r] = { v: BAKSO[r - 2] + ESTEH[r - 2], f: `=B${r}+C${r}` });
      action(ctx, b, l, { cells: cells("d2"), active: "D2", pointer: { x: 900, y: 600 } }, [{ drag: ["D2", "D6"], fill, d: 3 }, { wait: 1, d: 1.6 }],
        { items: ["Tahan klik di kotak kecil.", "Drag ke bawah sampai D6.", "Lepaskan."], marks: [0.15, 0.48, 0.6] },
        { mod: (st) => { if (st.dragSpan && st.dragFrac != null && !st.selTo) { const r = 2 + Math.round(st.dragFrac * 4); st.copy = ["D2", "D" + r]; } } });
    },
    salin_cek(ctx, b, l) {
      action(ctx, b, l, { cells: cells("d26"), active: "D2", pointer: { x: 900, y: 600 } }, [{ click: "D3", d: 1 }, { wait: 1, d: 3 }],
        { items: ["Klik D3.", "Bilah rumus: =B3+C3."], marks: [0.25, 1] },
        { mod: (st, ll, span) => { if (ll > span * 0.3) st.refs = [["B3", BLUE], ["C3", RED]]; },
          after: (ctx, geo, P, ll, span) => { if (ll > span * 0.35) { L.callout(ctx, 1450, 400, "D2: =B2+C2", null, null, { fill: "#F4F6F5", color: "#9AAFA6" }); L.callout(ctx, 1450, 480, "D3: =B3+C3", geo.fx.x + 90, geo.fx.y + 26); L.callout(ctx, 1450, 580, "Turun satu baris, alamatnya ikut turun.", null, null, { size: 22, maxW: 330, fill: "#E7F1FB", color: BLUE }); } } });
    },
    sum_ketik(ctx, b, l) {
      action(ctx, b, l, { cells: cells("d26"), active: "D6", pointer: { x: 700, y: 640 } }, [
        { click: "A7", d: 0.9 }, { type: "Total", to: "A7", d: 0.9 }, { key: "Tab", commit: true, next: "B7", d: 0.6 }, { type: "=SUM(B2:B6)", to: "B7", d: 3.2 }, { wait: 1, d: 0.6 }],
        { items: ["Klik A7, ketik Total.", "Klik B7.", "Ketik =SUM(B2:B6)"], marks: [0.3, 0.38, 1] },
        { mod: (st) => { if (st.edit && st.edit.addr === "B7" && st.edit.text.length >= 10) st.range = ["B2", "B6"]; } });
    },
    sum_arti(ctx, b, l) {
      const c = cells("d26"); c.A7 = "Total";
      action(ctx, b, l, { cells: c, pointer: { x: 520, y: 690 } }, [{ state: { edit: { addr: "B7", text: "=SUM(B2:B6)" } }, d: 2.6 }, { key: "Enter", commit: true, value: { v: 75, f: "=SUM(B2:B6)" }, next: "B8", d: 0.9 }, { set: {}, d: 0.2 }, { wait: 1, d: 1.2 }],
        { items: ["B2:B6 = dari B2 sampai B6.", "Tekan Enter."], marks: [0.53, 1] },
        { mod: (st, ll, span) => { if (ll < span * 0.6) { st.edit = { addr: "B7", text: "=SUM(B2:B6)" }; st.range = ["B2", "B6"]; } else if (ll < span * 0.7) st.range = ["B2", "B6"]; else st.changed = ["B7"]; },
          after: (ctx, geo, P, ll, span) => { if (ll < span * 0.6) L.callout(ctx, 1450, 400, "B2:B6 berarti dari B2 sampai B6", geo.cell("B4").x + 150, geo.cell("B4").cy, { size: 26 }); } });
    },
    sum_salin(ctx, b, l) {
      const c = cells("total");
      action(ctx, b, l, { cells: c, active: "B7", pointer: { x: 700, y: 650 } }, [{ drag: ["B7", "D7"], fill: { C7: { v: 120, f: "=SUM(C2:C6)" }, D7: { v: 195, f: "=SUM(D2:D6)" } }, d: 3 }, { wait: 1, d: 2 }],
        { items: ["Drag kotak kecil B7 ke kanan.", "Lepaskan di D7."], marks: [0.45, 0.6] },
        { mod: (st) => { if (st.dragSpan && st.dragFrac != null && !st.selTo) { const col = "BCD"[Math.round(st.dragFrac * 2)]; st.copy = ["B7", col + "7"]; } } });
    },
    sum_cek(ctx, b, l) {
      const geo = app(ctx, { cells: cells("total_all"), active: "D7", marks: [["B7", "#FFF3D6"], ["C7", "#FFF3D6"], ["D7", C.goodBg]] });
      const a = b.audio || b.dur;
      card(ctx, 1450, 200, 370, 380, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "HITUNG SENDIRI", 1635, 250, 24, { align: "center", weight: 900, color: C.accentDark });
      const u = clamp((l - a * 0.15) / (a * 0.5), 0, 1);
      if (u > 0.05) text(ctx, "75", 1635, 320, 48, { align: "center", weight: 900 });
      if (u > 0.35) text(ctx, "+ 120", 1635, 390, 48, { align: "center", weight: 900 });
      if (u > 0.65) { ctx.fillStyle = C.ink; ctx.fillRect(1520, 415, 230, 4); text(ctx, "195 ✓", 1635, 480, 52, { align: "center", weight: 900, color: GREEN }); }
    },
    avg_ketik(ctx, b, l) {
      action(ctx, b, l, { cells: cells("total_all"), active: "D7", pointer: { x: 700, y: 650 } }, [
        { click: "A8", d: 0.9 }, { type: "Rata-rata", to: "A8", d: 1.1 }, { key: "Tab", commit: true, next: "B8", d: 0.6 }, { type: "=AVERAGE(B2:B6)", to: "B8", d: 3.4 }, { wait: 1, d: 0.6 }],
        { items: ["Klik A8, ketik Rata-rata.", "Klik B8.", "Ketik =AVERAGE(B2:B6)"], marks: [0.3, 0.38, 1] },
        { mod: (st) => { if (st.edit && st.edit.addr === "B8" && st.edit.text.length >= 14) st.range = ["B2", "B6"]; } });
    },
    avg_salin(ctx, b, l) {
      const c = cells("total_all"); c.A8 = "Rata-rata";
      action(ctx, b, l, { cells: c, pointer: { x: 520, y: 700 } }, [{ state: { edit: { addr: "B8", text: "=AVERAGE(B2:B6)" } }, d: 0.5 }, { key: "Enter", commit: true, value: { v: 15, f: "=AVERAGE(B2:B6)" }, next: "B8", d: 0.9 }, { wait: 1, d: 0.8 }, { drag: ["B8", "C8"], fill: { C8: { v: 24, f: "=AVERAGE(C2:C6)" } }, d: 2.4 }, { wait: 1, d: 1.4 }],
        { items: ["Tekan Enter: 15.", "Drag kotak kecil ke C8.", "Rata-rata es teh: 24."], marks: [0.24, 0.75, 1] },
        { mod: (st, ll, span) => { if (ll < span * 0.08) st.edit = { addr: "B8", text: "=AVERAGE(B2:B6)" }; if (st.dragSpan && st.dragFrac != null && !st.selTo) st.copy = ["B8", st.dragFrac > 0.5 ? "C8" : "B8"]; } });
    },
    simpan(ctx, b, l) {
      const a = b.audio || b.dur, ph = l / a;
      const title = ph > 0.86 ? "Penjualan Kantin — Lembar Kerja" : "Lembar Kerja — Tanpa judul";
      const menuOn = ph > 0.1 && ph < 0.4 ? "File" : null;
      const geo = app(ctx, { cells: cells("avg_c"), active: "C8" }, { title, menuOn });
      steps(ctx, "LANGKAH", ["Klik menu File.", "Pilih Simpan.", "Beri nama: Penjualan Kantin.", "Pilih folder tugasmu, lalu Simpan."], ph < 0.12 ? 0 : ph < 0.4 ? 1 : ph < 0.62 ? 2 : ph < 0.86 ? 3 : 4);
      let ptr = { x: 200, y: 300 };
      if (menuOn) { // menu File terbuka
        const mx = WIN.x + 16, my = WIN.y + 86; card(ctx, mx, my, 300, 250, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 10 });
        ["Baru", "Buka", "Simpan", "Simpan sebagai", "Cetak"].forEach((s, i) => { const on = s === "Simpan" && ph > 0.25; if (on) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(mx + 4, my + 8 + i * 46, 292, 44); } text(ctx, s, mx + 24, my + 38 + i * 46, 24, { weight: 600, color: on ? BLUE : C.ink }); });
        ptr = ph < 0.25 ? { x: WIN.x + 40, y: WIN.y + 70 } : { x: mx + 120, y: my + 8 + 2 * 46 + 24 };
      }
      if (ph >= 0.4 && ph < 0.88) { // dialog simpan
        ctx.fillStyle = "rgba(31,42,51,0.25)"; ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
        const dx = 330, dy = 260; card(ctx, dx, dy, 860, 400, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 16 });
        text(ctx, "Simpan file", dx + 40, dy + 60, 32, { weight: 900 });
        text(ctx, "Nama file", dx + 40, dy + 120, 24, { weight: 700, color: C.ink2 });
        const name = "Penjualan Kantin"; const n = Math.round(name.length * clamp((ph - 0.42) / 0.16, 0, 1));
        card(ctx, dx + 40, dy + 135, 780, 60, { fill: "#FFFFFF", stroke: BLUE, lw: 3, r: 8 }); text(ctx, name.slice(0, n), dx + 60, dy + 175, 28, { weight: 700 });
        text(ctx, "Folder", dx + 40, dy + 240, 24, { weight: 700, color: C.ink2 });
        card(ctx, dx + 40, dy + 255, 780, 56, { fill: ph > 0.64 ? "#E7F1FB" : "#F4F6F5", stroke: "#C9D4DB", lw: 2, r: 8 }); text(ctx, ph > 0.64 ? "📁 Tugas Informatika" : "📁 Dokumen", dx + 60, dy + 292, 26, { weight: 700 });
        card(ctx, dx + 640, dy + 330, 180, 52, { fill: ph > 0.8 ? "#155FA6" : BLUE, r: 10 }); text(ctx, "Simpan", dx + 730, dy + 365, 26, { align: "center", weight: 800, color: "#FFFFFF" });
        ptr = ph < 0.62 ? { x: dx + 500, y: dy + 170 } : ph < 0.76 ? { x: dx + 400, y: dy + 285 } : { x: dx + 740, y: dy + 362 };
      }
      if (ph >= 0.88) L.callout(ctx, 1450, 560, "Nama file tampil di atas jendela", 760, WIN.y + 24);
      L.cursor(ctx, ptr.x, ptr.y, {});
    },
    masalah_rumus(ctx, b, l) {
      const a = b.audio || b.dur;
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "MASALAH 1: YANG MUNCUL TULISAN RUMUSNYA", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      const mini = (x, label, typed, shown, ok) => {
        card(ctx, x, 290, 640, 380, { fill: ok ? "#F2FAF4" : "#FDF1F0", stroke: ok ? GREEN : RED, lw: 4, r: 20 });
        text(ctx, label, x + 320, 345, 28, { align: "center", weight: 900, color: ok ? GREEN : RED });
        text(ctx, "yang diketik", x + 320, 410, 24, { align: "center", weight: 700, color: C.ink2 }); text(ctx, typed, x + 320, 465, 40, { align: "center", weight: 900, color: L.UI.formula });
        text(ctx, "yang muncul di sel", x + 320, 540, 24, { align: "center", weight: 700, color: C.ink2 });
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + 170, 560, 300, 60); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; ctx.strokeRect(x + 170, 560, 300, 60);
        text(ctx, shown, ok ? x + 454 : x + 186, 602, 30, { align: ok ? "right" : "left", weight: 700 });
      };
      mini(250, "✗ tanpa tanda sama dengan", "B2+C2", "B2+C2", false);
      if (l > a * 0.45) mini(1030, "✓ dengan tanda sama dengan", "=B2+C2", "32", true);
    },
    masalah_pagar(ctx, b, l) {
      const a = b.audio || b.dur; const base = cells("avg_c");
      const u = ease(clamp((l - a * 0.45) / (a * 0.3), 0, 1)); const dw = lerp(40, 160, u);
      const cw = { ...CW, D: dw };
      const geo = app(ctx, { cells: base, active: "D7" }, { cw });
      card(ctx, 1450, 150, 370, 200, { fill: "#FFFFFF", stroke: RED, lw: 3, r: 18 }); text(ctx, "MASALAH 2", 1474, 196, 24, { weight: 900, color: RED }); para(ctx, "#### berarti kolomnya terlalu sempit.", 1474, 240, 26, 330, { weight: 700, lh: 1.25 });
      const line = geo.colLine(4); const ptr = { x: line.x, y: line.y };
      if (l > a * 0.3) { L.callout(ctx, 1450, 400, "Drag garis di antara D dan E", line.x, line.y - 10); L.cursor(ctx, ptr.x, ptr.y, { kind: "plus", down: u > 0 && u < 1 }); }
      if (u >= 1) L.callout(ctx, 1450, 520, "Kolom lebar: angkanya tampil.", null, null, { fill: C.goodBg, color: GREEN });
    },
    periksa(ctx, b, l) {
      app(ctx, { cells: cells("avg_c"), active: "B7", marks: [["B7", C.goodBg], ["C7", C.goodBg], ["B8", C.goodBg], ["C8", C.goodBg]] });
      const items = [["Total bakso", "75"], ["Total es teh", "120"], ["Rata-rata bakso", "15"], ["Rata-rata es teh", "24"]];
      card(ctx, 1450, 150, 370, 120 + items.length * 90, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILMU", 1635, 200, 24, { align: "center", weight: 900, color: C.accentDark });
      const a = b.audio || b.dur;
      items.forEach(([k, v], i) => { const on = l > a * (0.15 + i * 0.15); const y = 230 + i * 90;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 1470, y, 330, 74, 12); ctx.fill();
        text(ctx, k, 1490, y + 46, 24, { weight: 700 }); text(ctx, v + (on ? " ✓" : ""), 1785, y + 47, 28, { align: "right", weight: 900, color: on ? GREEN : C.ink2 }); });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D8.1", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "lembar kerja mini", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d81", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "ubah angka, tebak, lalu periksa", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Catat penjualan kantin sekolahmu selama seminggu, lalu hitung total dan rata-ratanya.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
