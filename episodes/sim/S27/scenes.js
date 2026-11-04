/* S27 Simulasi praktik: membuat formulir daring yang rapi di aplikasi formulir generik ("Formulir") di browser.
   Jendela browser di kiri (x 110–1410, y 122–822), panel kanan (x 1450–1820) untuk langkah dan catatan.
   Semua nama dan data rekaan. Memakai layar.js (lembar kerja, pointer) + layar_web.js (browser) + formulir.js (Kiko.form). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, W = K.web, F = K.form;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B", ACC = F.ACC;
  const PX = 1450, PW = 370;
  const A = b => b.audio || b.dur;
  const fade = (l, t0, d = 0.4) => ease(clamp((l - t0) / d, 0, 1));
  const AREA = { x: WIN.x, y: WIN.y + 108, w: WIN.w, h: WIN.h - 108 };

  // ---------- data formulir ----------
  const TITLE = "Pendaftaran Ekskul", DESC = "Isi paling lambat Jumat. Data hanya dipakai pengurus ekskul.";
  const Q = [
    { title: "Nama lengkap", type: "short", required: 1 },
    { title: "Kelas", type: "drop", options: ["X-1", "X-2", "X-3", "X-4", "X-5", "X-6"], required: 1, noAdd: true },
    { title: "Ekskul pilihan", type: "radio", options: ["Futsal", "Paduan Suara", "Pramuka", "Robotik", "Tari"], required: 1 },
    { title: "Hari latihan", type: "check", options: ["Senin", "Rabu", "Jumat"] },
    { title: "Tanggal mulai bisa latihan", type: "date" },
    { title: "Lama pengalaman (tahun)", type: "num", limit: ["0", "12"] }
  ];
  const qs = (n, last) => Q.slice(0, n).map(q => ({ ...q })).concat(last ? [last] : []);
  const ET = [{ title: "Pendaftaran Ekskul - Formulir", icon: "check" }];
  function browser(ctx, opt) { return W.browser(ctx, WIN.x, WIN.y, WIN.w, WIN.h, opt); }
  function editor(ctx, st, bopt = {}) { const bg = browser(ctx, { tabs: ET, url: "formulir.example/d/ekskul/edit", ...bopt }); return F.editor(ctx, bg, { title: TITLE, desc: DESC, ...st }); }
  function probe(fn) { return ctx => { ctx.save(); ctx.globalAlpha = 0; const r = fn(ctx); ctx.restore(); return r; }; }
  const probeEd = (ctx, st) => { ctx.save(); ctx.globalAlpha = 0; const r = F.editor(ctx, AREA, { title: TITLE, desc: DESC, ...st }); ctx.restore(); return r; };
  const scrollOf = st => F.editorScroll(AREA, st);

  // ---------- panel kanan ----------
  function steps(ctx, title, items, n, y0) {
    const x = PX, y = y0 || WIN.y, w = PW; let hh = 70;
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
  function note(ctx, y, h, title, fn, o = {}) {
    card(ctx, PX, y, PW, h, { fill: o.fill || "#FFFFFF", stroke: o.stroke || "#D7E2DC", lw: 3, r: 18 });
    if (title) text(ctx, title, PX + 24, y + 44, 23, { weight: 900, color: o.color || C.accentDark, fit: PW - 40 });
    if (fn) fn(PX, y);
  }
  // langkah "tambah pertanyaan + ketik judul + pilih tipe" yang dipakai beberapa adegan
  // ds: [awal, klik +, ketik, klik tipe, arahkan, klik, sisanya...]
  function addQuestion(ctx, b, l, n, title, type, rest, extra = {}) {
    const span = A(b) * 0.9, ds = [0.3, 0.9, 1.1, 0.8, 0.9, 0.4, ...rest.map(r => r.d)], S = W.seq(l, span, ds);
    const added = S.at(1) && S.p(1) > 0.6;
    const st0 = { qs: qs(n), active: n - 1 };
    const curType = S.at(5) && S.p(5) > 0.5 ? type : "short";
    const newQ = { title: W.typed(title, S.p(2) / 0.9), type: curType, options: type === "drop" || type === "radio" || type === "check" ? (curType === type ? ["Opsi 1"] : undefined) : undefined };
    const r = { S, span, newQ, st: null };
    if (extra.mod) extra.mod(newQ, S);
    const st1 = { qs: qs(n, newQ), active: n };
    const menuOpen = S.at(3) && S.p(3) > 0.6 && !(S.at(5) && S.p(5) > 0.5);
    const hiSeq = ["short", "para", "radio", "check", "drop", "date", "num"], ti = hiSeq.indexOf(type);
    const hi = S.at(4) ? hiSeq[Math.min(ti, Math.floor(S.p(4) * (ti + 1)))] : null;
    let st;
    if (!added) st = { ...st0, plusHot: S.at(1) && S.p(1) > 0.5 };
    else st = { ...st1, scroll: lerp(scrollOf(st0), scrollOf(st1), ease(clamp((l - (ds[0] + ds[1] * 0.6) * span / ds.reduce((a, c) => a + c, 0)) / 0.5, 0, 1))),
      q: { titleEdit: S.i === 2 || (S.i === 1 && added), typeHot: S.i === 3 || menuOpen }, menu: menuOpen ? { hi } : null };
    r.st = st; r.st1 = st1;
    // geometri
    const g0 = probeEd(ctx, st0), g1 = probeEd(ctx, { ...st1, scroll: scrollOf(st1) }), gm = probeEd(ctx, { ...st1, scroll: scrollOf(st1), menu: { hi: null } });
    const tb = g1.q[n].typeBox, mi = gm.menuItem[type];
    r.pts = [{ x: 900, y: 600, d: ds[0] }, { x: g0.plus.cx, y: g0.plus.cy + 6, d: ds[1], click: true }, { x: g1.q[n].titleBox.cx, y: g1.q[n].titleBox.cy + 8, d: ds[2] },
      { x: tb.cx, y: tb.cy + 6, d: ds[3], click: true }, { x: mi.cx, y: mi.cy + 6, d: ds[4] }, { x: mi.cx, y: mi.cy + 6, d: ds[5], click: true }];
    r.g1 = g1;
    return r;
  }
  function stepsAdd(S, k) { return S.i <= 1 ? 0 : S.i === 2 ? 1 : S.i <= 5 ? 2 : k; }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      const a = A(b); card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 960, 228, 32, { align: "center", weight: 900, color: C.accentDark });
      const items = [["Memilih tipe kolom", (x, y) => { ["short", "radio", "check", "drop", "date", "num"].forEach((k, i) => { const cx = x + 80 + (i % 3) * 140, cy = y + 60 + Math.floor(i / 3) * 110; ctx.fillStyle = "#FFFFFF"; rr(ctx, cx - 50, cy - 40, 100, 80, 14); ctx.fill(); F.icon(ctx, k, cx, cy, 44, ACC, true); }); }],
        ["Menandai kolom wajib", (x, y) => { ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 30, y + 30, 400, 80, 14); ctx.fill(); text(ctx, "Nama lengkap", x + 56, y + 82, 30, { weight: 800 }); text(ctx, "*", x + 270, y + 84, 40, { weight: 900, color: RED }); W.toggle(ctx, x + 160, y + 160, 1, {}); text(ctx, "Wajib", x + 146, y + 182, 28, { align: "right", weight: 800 }); }],
        ["Membuat data rapi", (x, y) => { [["kls 10", "sepuluh", "x1"], ["X-1", "X-1", "X-1"]].forEach((col, j) => col.forEach((s, i) => { ctx.fillStyle = j ? C.goodBg : C.badBg; rr(ctx, x + 40 + j * 230, y + 20 + i * 66, 190, 54, 10); ctx.fill(); text(ctx, s, x + 135 + j * 230, y + 57 + i * 66, 26, { align: "center", weight: 800, color: j ? GREEN : RED }); }));
          text(ctx, "→", x + 250, y + 124, 40, { align: "center", weight: 900, color: C.ink2 }); }]];
      items.forEach(([t, fn], i) => { const u = fade(l, 0.4 + i * a * 0.2); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; const x = 220 + i * 500;
        card(ctx, x, 280, 470, 470, { fill: C.bg2, r: 22 }); text(ctx, t, x + 235, 340, 32, { align: "center", weight: 900, color: C.kikoDark, fit: 430 }); fn(x, 400); ctx.restore(); });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 420, 290, 560, 300, { fill: C.bg2, r: 22 }); text(ctx, "E.8", 700, 380, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Data Berkualitas dari Komputasi Manusia", 700, 440, 30, 480, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "formulir yang jelas", 700, 560, 24, { align: "center", weight: 600, color: C.ink2 });
      card(ctx, 1020, 290, 480, 300, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 }); F.formIcon(ctx, 1220, 330, 80);
      text(ctx, "Formulir", 1260, 470, 36, { align: "center", weight: 900 }); para(ctx, "nama aplikasi generik di video ini", 1260, 515, 24, 400, { align: "center", weight: 600, color: C.ink2 });
      if (l > A(b) * 0.4) { card(ctx, 420, 630, 1080, 70, { fill: "#FFF3D6", r: 14 }); text(ctx, "Semua nama dan data di video ini hanyalah contoh rekaan.", 960, 676, 28, { align: "center", weight: 800, color: C.accentDark }); }
      kiko(ctx, 1660, 730, 90, 0, { wave: l });
    },

    // ---------- 1. data berantakan ----------
    berantakan(ctx, b, l) {
      const a = A(b);
      const bg = browser(ctx, { tabs: [{ title: "Pendaftaran Ekskul 2025 - Lembar Kerja", icon: "check" }], url: "lembarkerja.example/d/ekskul-2025" });
      const cells = { A1: "Nama", B1: "Kelas", C1: "Ekskul", D1: "Mulai latihan" };
      MESSY.forEach((r, i) => ["A", "B", "C", "D"].forEach((c, j) => cells[c + (i + 2)] = r[j]));
      const g = L.sheet(ctx, { x: bg.x + 20, y: bg.y + 4, w: bg.w - 40, h: bg.h }, { cells, cols: 4, rows: 8, cw: { A: 260, B: 240, C: 270, D: 290 }, rh: 52, active: "B2" });
      const hot = [["B2", 0.3], ["B4", 0.5], ["B5", 0.6], ["B6", 0.68], ["B3", 0.8]];
      hot.forEach(([ad, t]) => { if (l < a * t) return; const c = g.cell(ad); ctx.fillStyle = ad === "B3" ? "rgba(242,177,52,0.35)" : "rgba(217,68,59,0.22)"; ctx.fillRect(c.x + 2, c.y + 2, c.w - 4, c.h - 4); });
      note(ctx, WIN.y, 330, "SEMUA TEKS BEBAS", (x, y) => { [["X-1", 0.3], ["sepuluh satu", 0.5], ["x1", 0.6], ["X 1", 0.68]].forEach(([s, t], i) => { if (l < a * t) return; ctx.fillStyle = C.badBg; rr(ctx, x + 20, y + 70 + i * 60, PW - 40, 50, 10); ctx.fill(); text(ctx, s, x + 40, y + 104 + i * 60, 25, { weight: 800, color: RED }); });
        });
      if (l > a * 0.72) note(ctx, WIN.y + 350, 200, null, (x, y) => { para(ctx, "Semuanya maksudnya kelas X-1.", x + 24, y + 56, 26, PW - 48, { weight: 900, lh: 1.3 }); para(ctx, "Ada juga \"kls 10\": kelas berapa?", x + 24, y + 140, 22, PW - 48, { weight: 700, color: C.ink2, lh: 1.3 }); }, { fill: "#FFF3D6", stroke: "#FFF3D6" });
    },
    berantakan_hitung(ctx, b, l) {
      const a = A(b);
      const bg = browser(ctx, { tabs: [{ title: "Pendaftaran Ekskul 2025 - Lembar Kerja", icon: "check" }], url: "lembarkerja.example/d/ekskul-2025" });
      const cells = { A1: "Kelas", B1: "Jumlah" };
      [["X-1", 2], ["sepuluh satu", 1], ["x1", 1], ["X 1", 1], ["kls 10", 1], ["X-2", 1]].forEach(([k, n], i) => { cells["A" + (i + 2)] = k; cells["B" + (i + 2)] = n; });
      const g = L.sheet(ctx, { x: bg.x + 20, y: bg.y + 4, w: bg.w - 40, h: bg.h }, { cells, cols: 2, rows: 7, cw: { A: 300, B: 200 }, rh: 56 });
      text(ctx, "Hitung per kelas", bg.x + 640, bg.y + 140, 30, { weight: 900, color: C.ink });
      para(ctx, "Komputer menghitung setiap tulisan yang berbeda sebagai kelas yang berbeda.", bg.x + 640, bg.y + 190, 25, 560, { weight: 700, color: C.ink2, lh: 1.35 });
      if (l > a * 0.3) { [2, 3, 4, 5].forEach(r => { const c = g.cell("A" + r), c2 = g.cell("B" + r); ctx.fillStyle = "rgba(217,68,59,0.22)"; ctx.fillRect(c.x + 2, c.y + 2, c.w + c2.w - 4, c.h - 4); });
        const c = g.cell("A2"), c5 = g.cell("A5"); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(c.x + 520, c.y + 6); ctx.lineTo(c.x + 545, c.y + 6); ctx.lineTo(c.x + 545, c5.y + c5.h - 6); ctx.lineTo(c.x + 520, c5.y + c5.h - 6); ctx.stroke();
        text(ctx, "satu kelas = empat baris", c.x + 565, (c.y + c5.y + c5.h) / 2 + 10, 28, { weight: 900, color: RED }); }
      note(ctx, WIN.y, 230, "KELAS X-1", (x, y) => { text(ctx, "seharusnya 5 murid", x + 24, y + 96, 26, { weight: 800 }); if (l > a * 0.3) text(ctx, "terpecah jadi 4 baris", x + 24, y + 150, 26, { weight: 800, color: RED }); });
      if (l > a * 0.6) note(ctx, WIN.y + 250, 250, "SINTA HARUS…", (x, y) => { para(ctx, "merapikan satu per satu, sebelum datanya bisa dihitung.", x + 24, y + 96, 25, PW - 48, { weight: 700, lh: 1.35 }); }, { fill: "#FFF3D6", stroke: "#FFF3D6" });
    },

    // ---------- 2. formulir baru ----------
    buat_baru(ctx, b, l) {
      const span = A(b) * 0.9, ds = [0.3, 1, 0.4, 0.8, 1.6, 0.7, 2.4, 0.5], S = W.seq(l, span, ds);
      const inEd = S.at(2);
      const bg = browser(ctx, { tabs: inEd ? ET : [{ title: "Formulir", icon: "check" }], url: inEd ? "formulir.example/d/ekskul/edit" : "formulir.example", loading: S.i === 2 ? S.u : 0 });
      let g, gh;
      const pr = probe(c => F.home(c, bg))(ctx);
      if (!inEd) gh = F.home(ctx, bg, { hot: S.i === 1 && S.u > 0.4 ? 0 : null });
      else {
        const t = S.at(4) ? W.typed(TITLE, S.p(4) / 0.9) : "", d = S.at(6) ? W.typed(DESC, S.p(6) / 0.92) : "";
        g = F.editor(ctx, bg, { title: t, desc: d, titleEdit: S.i >= 6 || (S.i === 5 && S.u > 0.6) ? "desc" : S.i >= 4 || (S.i === 3 && S.u > 0.6) ? "title" : null, caret: Math.floor(l * 2.4) % 2 === 0, titleCardOn: S.at(3), qs: [{ title: "", type: "short" }], active: null, scroll: 0 });
      }
      const ge = probe(c => F.editor(c, bg, { title: "", qs: [{ title: "", type: "short" }], active: null, scroll: 0 }))(ctx);
      const p = W.path(l, span, [{ x: 900, y: 650, d: ds[0] }, { x: pr.tile[0].cx, y: pr.tile[0].cy + 6, d: ds[1], click: true }, { x: pr.tile[0].cx, y: pr.tile[0].cy, d: ds[2] },
        { x: ge.titleBox.cx, y: ge.titleBox.cy + 8, d: ds[3], click: true }, { x: ge.titleBox.cx + 300, y: ge.titleBox.cy + 30, d: ds[4] }, { x: ge.descBox.cx, y: ge.descBox.cy + 8, d: ds[5], click: true }, { x: ge.descBox.cx + 420, y: ge.descBox.cy + 40, d: ds[6] }, { x: ge.descBox.cx + 420, y: ge.descBox.cy + 40, d: ds[7] }], { x: 900, y: 650 });
      L.cursor(ctx, p.x, p.y, { click: p.click, kind: S.i === 3 || S.i === 5 ? "arrow" : S.i >= 4 ? "text" : "arrow" });
      steps(ctx, "LANGKAH", ["Klik Formulir kosong.", "Klik judul, ketik namanya.", "Tambahkan keterangan."], S.i <= 2 ? 0 : S.i <= 4 ? 1 : S.n >= 8 ? 3 : 2);
    },
    tanya_nama(ctx, b, l) {
      const span = A(b) * 0.9, ds = [0.3, 0.8, 1.6, 1.4, 1, 1.4], S = W.seq(l, span, ds);
      const req = S.at(4) ? ease(clamp((S.p(4) - 0.6) / 0.3, 0, 1)) : 0;
      const st = { qs: [{ title: S.at(2) ? W.typed("Nama lengkap", S.p(2) / 0.9) : "", type: "short", required: req }], active: 0, caret: true, q: { titleEdit: S.i >= 1 && S.i <= 2, caret: Math.floor(l * 2.4) % 2 === 0, typeHot: S.i === 3, reqHot: S.i === 4 } };
      const g = editor(ctx, st), q0 = g.q[0];
      const p = W.path(l, span, [{ x: 900, y: 650, d: ds[0] }, { x: q0.titleBox.cx, y: q0.titleBox.cy + 8, d: ds[1], click: true }, { x: q0.titleBox.cx + 120, y: q0.titleBox.cy + 40, d: ds[2] }, { x: q0.typeBox.cx, y: q0.typeBox.cy + 50, d: ds[3] }, { x: q0.req.cx, y: q0.req.cy + 6, d: ds[4], click: true }, { x: q0.req.cx + 40, y: q0.req.cy + 60, d: ds[5] }], { x: 900, y: 650 });
      L.cursor(ctx, p.x, p.y, { click: p.click, kind: S.i === 2 ? "text" : "arrow" });
      steps(ctx, "LANGKAH", ["Ketik pertanyaannya.", "Tipe: Jawaban singkat.", "Nyalakan Wajib."], S.i <= 2 ? 0 : S.i === 3 ? 1 : S.n >= 5 ? 3 : 2);
      if (S.at(3)) note(ctx, WIN.y + 340, 250, "KENAPA SINGKAT?", (x, y) => para(ctx, "Jawabannya berbeda-beda dan pendek: tidak bisa dibuat pilihan.", x + 24, y + 92, 24, PW - 48, { weight: 700, lh: 1.35 }));
    },

    // ---------- 3. pilihan tetap ----------
    tanya_kelas(ctx, b, l) {
      const r = addQuestion(ctx, b, l, 1, "Kelas", "drop", [{ d: 1.4 }]);
      editor(ctx, { ...r.st, caret: true, q: { ...(r.st.q || {}), caret: Math.floor(l * 2.4) % 2 === 0 } });
      const p = W.path(l, r.span, [...r.pts, { x: r.pts[5].x + 60, y: r.pts[5].y + 60, d: 1.4 }], { x: 900, y: 600 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
      steps(ctx, "LANGKAH", ["Klik tanda + (tambah pertanyaan).", "Ketik Kelas.", "Klik menu tipe, pilih Dropdown."], stepsAdd(r.S, 3));
    },
    isi_kelas(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [0.2, 1, 1, 1, 1, 1, 1, 0.5, 0.9, 0.8], S = W.seq(l, span, ds);
      const opts = Q[1].options, k = Math.min(S.i - 1, 6);
      let shown = [];
      if (S.i === 0) shown = ["Opsi 1"]; else { shown = opts.slice(0, Math.max(0, k)); if (k < 6) shown.push(W.typed(opts[k], S.u / 0.7)); }
      const done = S.at(7), req = S.at(8) ? ease(clamp((S.p(8) - 0.6) / 0.3, 0, 1)) : 0;
      const st = { qs: qs(1, { title: "Kelas", type: "drop", options: shown, noAdd: done, required: req }), active: 1, q: { editOpt: done ? null : (S.i === 0 ? 0 : k), caret: Math.floor(l * 2.4) % 2 === 0, reqHot: S.i === 8 } };
      const g = editor(ctx, st);
      if (S.i >= 1 && S.i <= 6 && S.u > 0.75) L.keys(ctx, PX + PW / 2, 700, ["Enter"], { press: (S.u - 0.75) / 0.25, align: "center", size: 30 });
      if (S.at(7)) { const q1 = g.q[1]; const p = W.path(l - (span * 7.2 / 8.4), span * 1.2 / 8.4, [{ x: q1.req.cx - 200, y: q1.req.cy - 80, d: 0.3 }, { x: q1.req.cx, y: q1.req.cy + 6, d: 1, click: true }], { x: q1.req.cx - 200, y: q1.req.cy - 80 }); L.cursor(ctx, p.x, p.y, { click: p.click }); }
      steps(ctx, "LANGKAH", ["Ketik X-1, tekan Enter.", "Ulangi sampai X-6.", "Nyalakan Wajib."], S.i <= 1 ? 0 : S.i <= 6 ? 1 : S.n >= 9 ? 3 : 2);
      note(ctx, WIN.y + 290, 300, "TIDAK ADA LAGI…", (x, y) => { ["kls 10", "sepuluh satu", "x1"].forEach((s, i) => { ctx.fillStyle = C.badBg; rr(ctx, x + 20, y + 66 + i * 60, PW - 40, 50, 10); ctx.fill(); text(ctx, s, x + 40, y + 100 + i * 60, 24, { weight: 800, color: RED });
        ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 36, y + 92 + i * 60); ctx.lineTo(x + 46 + F.meas(ctx, s, 24, 800), y + 92 + i * 60); ctx.stroke(); }); });
    },
    tanya_ekskul(ctx, b, l) {
      const opts = Q[2].options;
      const r = addQuestion(ctx, b, l, 2, "Ekskul pilihan", "radio", [{ d: 3 }, { d: 0.9 }, { d: 0.5 }], { mod: (q, S) => { if (S.at(6)) { const n = S.p(6) * opts.length; q.options = opts.slice(0, Math.max(1, Math.ceil(n))).map((o, i) => i === Math.ceil(n) - 1 && n < opts.length ? W.typed(o, (n % 1 || 1) / 0.8) : o); } if (S.at(7)) q.required = ease(clamp((S.p(7) - 0.6) / 0.3, 0, 1)); } });
      const S = r.S, st = { ...r.st, q: { ...(r.st.q || {}), caret: Math.floor(l * 2.4) % 2 === 0, editOpt: S.i === 6 ? r.st.qs[2].options.length - 1 : null, reqHot: S.i === 7 } };
      const g = editor(ctx, st);
      const gq = probeEd(ctx, { qs: qs(3), active: 2 }).q[2];
      const p = W.path(l, r.span, [...r.pts, { x: r.pts[5].x + 40, y: r.pts[5].y + 120, d: 3 }, { x: gq.req.cx, y: gq.req.cy + 6, d: 0.9, click: true }, { x: gq.req.cx + 40, y: gq.req.cy + 60, d: 0.5 }], { x: 900, y: 600 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
      steps(ctx, "LANGKAH", ["Tambah pertanyaan.", "Ketik Ekskul pilihan.", "Pilih tipe Pilihan ganda.", "Isi lima ekskul, nyalakan Wajib."], stepsAdd(S, S.n >= 8 ? 4 : 3));
      if (S.at(6)) note(ctx, WIN.y + 400, 190, "PILIHAN GANDA", (x, y) => { F.icon(ctx, "radio", x + 50, y + 110, 40, ACC, true); para(ctx, "hanya boleh memilih satu", x + 90, y + 104, 25, PW - 110, { weight: 800, lh: 1.25 }); });
    },
    tanya_hari(ctx, b, l) {
      const opts = Q[3].options;
      const r = addQuestion(ctx, b, l, 3, "Hari latihan", "check", [{ d: 2 }, { d: 2 }], { mod: (q, S) => { if (S.at(6)) { const n = S.p(6) * opts.length; q.options = opts.slice(0, Math.max(1, Math.ceil(n))).map((o, i) => i === Math.ceil(n) - 1 && n < opts.length ? W.typed(o, (n % 1 || 1) / 0.8) : o); } } });
      const S = r.S; editor(ctx, { ...r.st, q: { ...(r.st.q || {}), caret: Math.floor(l * 2.4) % 2 === 0, editOpt: S.i === 6 ? r.st.qs[3].options.length - 1 : null } });
      const p = W.path(l, r.span, [...r.pts, { x: r.pts[5].x + 40, y: r.pts[5].y + 120, d: 4 }], { x: 900, y: 600 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
      steps(ctx, "LANGKAH", ["Tambah pertanyaan.", "Ketik Hari latihan.", "Pilih tipe Kotak centang.", "Isi Senin, Rabu, Jumat."], stepsAdd(S, S.n >= 7 ? 4 : 3));
      if (S.at(6)) note(ctx, WIN.y + 390, 310, "BEDANYA", (x, y) => {
        ctx.fillStyle = "#F4F6F5"; rr(ctx, x + 16, y + 66, PW - 32, 104, 12); ctx.fill(); F.icon(ctx, "radio", x + 52, y + 118, 36, C.ink2, true); para(ctx, "Pilihan ganda: pilih satu", x + 88, y + 110, 23, PW - 110, { weight: 800, lh: 1.2 });
        ctx.fillStyle = C.goodBg; rr(ctx, x + 16, y + 184, PW - 32, 104, 12); ctx.fill(); F.icon(ctx, "check", x + 52, y + 236, 36, GREEN, true); para(ctx, "Kotak centang: boleh lebih dari satu", x + 88, y + 222, 23, PW - 110, { weight: 800, lh: 1.2 }); });
    },

    // ---------- 4. tanggal dan angka ----------
    tanya_tanggal(ctx, b, l) {
      const r = addQuestion(ctx, b, l, 4, "Tanggal mulai bisa latihan", "date", [{ d: 2.5 }]);
      editor(ctx, { ...r.st, q: { ...(r.st.q || {}), caret: Math.floor(l * 2.4) % 2 === 0 } });
      const p = W.path(l, r.span, [...r.pts, { x: r.pts[5].x + 40, y: r.pts[5].y + 50, d: 2.5 }], { x: 900, y: 600 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
      steps(ctx, "LANGKAH", ["Tambah pertanyaan.", "Ketik pertanyaannya.", "Pilih tipe Tanggal."], stepsAdd(r.S, 3));
      if (r.S.at(6)) note(ctx, WIN.y + 330, 370, "MURID MEMILIH DI KALENDER", (x, y) => {
        ctx.fillStyle = "#F4F7F9"; rr(ctx, x + 30, y + 66, PW - 60, 210, 12); ctx.fill(); text(ctx, "Maret 2027", x + PW / 2, y + 98, 20, { align: "center", weight: 800 });
        for (let i = 0; i < 21; i++) { const cx = x + 60 + (i % 7) * 42, cy = y + 130 + Math.floor(i / 7) * 46; const on = i === 9; if (on) { ctx.fillStyle = ACC; ctx.beginPath(); ctx.arc(cx, cy - 6, 18, 0, Math.PI * 2); ctx.fill(); } text(ctx, String(i + 3), cx, cy, 17, { align: "center", weight: 700, color: on ? "#FFFFFF" : C.ink2 }); }
        text(ctx, "→ selalu 12/03/2027", x + PW / 2, y + 330, 25, { align: "center", weight: 900, color: GREEN }); });
    },
    tanya_angka(ctx, b, l) {
      const r = addQuestion(ctx, b, l, 5, "Lama pengalaman (tahun)", "num", [{ d: 0.8 }, { d: 1.4 }, { d: 1.6 }], { mod: (q, S) => { if (S.at(6) && S.p(6) > 0.6) q.limit = [S.at(7) ? "0" : "", S.at(7) ? W.typed("12", (S.p(7) - 0.5) / 0.4) : ""]; } });
      const S = r.S; editor(ctx, { ...r.st, q: { ...(r.st.q || {}), caret: Math.floor(l * 2.4) % 2 === 0, limEdit: S.i === 7 ? (S.u < 0.5 ? 0 : 1) : null } });
      const p = W.path(l, r.span, [...r.pts, { x: r.pts[5].x, y: r.pts[5].y + 40, d: 0.8 }, { x: r.pts[5].x - 60, y: r.pts[5].y + 60, d: 1.4 }, { x: r.pts[5].x, y: r.pts[5].y + 70, d: 1.6 }], { x: 900, y: 600 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
      steps(ctx, "LANGKAH", ["Tambah pertanyaan.", "Ketik pertanyaannya.", "Pilih tipe Angka.", "Batas: 0 sampai 12."], stepsAdd(S, S.at(6) ? (S.n >= 8 ? 4 : 3) : 3));
      if (S.at(7)) note(ctx, WIN.y + 400, 300, null, (x, y) => { para(ctx, "Di aplikasi lain, angka diatur lewat Jawaban singkat → Validasi → Angka.", x + 24, y + 56, 24, PW - 48, { weight: 800, lh: 1.35 }); }, { fill: "#FFF3D6", stroke: "#FFF3D6" });
    },

    // ---------- 5. wajib dan pratinjau ----------
    wajib(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "DAFTAR KOLOM FORMULIR", 960, 206, 32, { align: "center", weight: 900, color: C.accentDark });
      [["Kolom", 300], ["Tipe", 960], ["Wajib", 1500]].forEach(([s, x]) => text(ctx, s, x, 262, 24, { weight: 900, color: C.ink2 }));
      Q.forEach((q, i) => { const y = 290 + i * 84, on = q.required, hot = on && l > a * (0.1 + i * 0.12);
        ctx.fillStyle = hot ? "#FDF1F0" : "#F4F6F5"; rr(ctx, 260, y, 1400, 72, 12); ctx.fill();
        text(ctx, q.title, 300, y + 46, 28, { weight: 800 }); if (on) text(ctx, "*", 310 + F.meas(ctx, q.title, 28, 800), y + 48, 34, { weight: 900, color: RED });
        F.icon(ctx, q.type, 985, y + 36, 32, ACC, true); text(ctx, F.typeName(q.type), 1020, y + 46, 26, { weight: 700, color: C.ink2 });
        W.toggle(ctx, 1500, y + 22, on ? 1 : 0, {}); text(ctx, on ? "wajib" : "boleh kosong", 1580, y + 46, 22, { weight: 800, color: on ? RED : C.ink2 }); });
    },
    pratinjau(ctx, b, l) {
      const span = A(b) * 0.9, ds = [0.3, 0.8, 0.6, 0.9, 0.9, 1, 0.9, 0.8, 0.8, 0.8], S = W.seq(l, span, ds);
      const open = S.at(2) && S.p(2) > 0.4 || S.at(3);
      const tabs = [...ET, ...(open ? [{ title: TITLE, icon: "check" }] : [])];
      const bg = browser(ctx, { tabs, tab: open ? 1 : 0, url: open ? "formulir.example/f/ekskul" : "formulir.example/d/ekskul/edit", loading: S.i === 2 ? S.u : 0 });
      const all = qs(6);
      if (!open) { const g = F.editor(ctx, bg, { title: TITLE, desc: DESC, qs: all, active: null, scroll: 0, eyeHot: S.i === 1 && S.u > 0.5 });
        const p = W.path(l, span * 1.1 / 7.6, [{ x: 900, y: 600, d: 0.3 }, { x: g.eye.cx, y: g.eye.cy + 6, d: 0.8, click: true }], { x: 900, y: 600 }); L.cursor(ctx, p.x, p.y, { click: p.click }); }
      else {
        const sc = S.at(5) ? lerp(200, 492, ease(S.p(5))) : S.at(3) ? 200 * ease(clamp(S.p(3) / 0.45, 0, 1)) : 0;
        const vals = { 1: S.at(4) && S.p(4) > 0.7 ? "X-3" : null, 2: S.at(6) && S.p(6) > 0.6 ? "Robotik" : null, 3: [...(S.at(7) && S.p(7) > 0.6 ? ["Senin"] : []), ...(S.at(8) && S.p(8) > 0.6 ? ["Jumat"] : [])] };
        const dropOpen = (S.at(3) && S.p(3) > 0.75) && !(S.at(4) && S.p(4) > 0.7);
        const st = { title: TITLE, desc: DESC, qs: all, vals, scroll: sc, open: dropOpen ? 1 : null, hi: S.at(4) ? Math.min(2, Math.floor(S.p(4) * 4)) : null };
        F.preview(ctx, bg, st);
        const g0 = probe(c => F.preview(c, bg, { ...st, scroll: 200, open: 1 }))(ctx), g1 = probe(c => F.preview(c, bg, { ...st, scroll: 492 }))(ctx);
        const d = g0.q[1].drop, it = d.item[2], ro = g1.q[2].opt[3], c0 = g1.q[3].opt[0], c2 = g1.q[3].opt[2];
        const t0 = span * 1.7 / 7.6, p = W.path(l - t0, span * 5.9 / 7.6, [{ x: d.cx, y: d.cy + 6, d: 0.9, click: true }, { x: it.cx, y: it.cy + 6, d: 0.9, click: true }, { x: 700, y: 520, d: 1 }, { x: ro.cx, y: ro.cy + 6, d: 0.9, click: true }, { x: c0.cx, y: c0.cy + 6, d: 0.8, click: true }, { x: c2.cx, y: c2.cy + 6, d: 0.8, click: true }, { x: c2.cx + 80, y: c2.cy + 60, d: 0.8 }], { x: 900, y: 600 });
        L.cursor(ctx, p.x, p.y, { click: p.click });
      }
      steps(ctx, "LANGKAH", ["Klik ikon mata (pratinjau).", "Pilih kelas dari dropdown.", "Pilih satu ekskul.", "Centang dua hari."], S.i <= 2 ? 0 : S.i <= 4 ? 1 : S.i <= 6 ? 2 : S.n >= 9 ? 4 : 3);
      note(ctx, WIN.y + 420, 200, null, (x, y) => { F.icon(ctx, "eye", x + 54, y + 70, 50, ACC); para(ctx, "Pratinjau = mencoba sebagai murid.", x + 100, y + 62, 24, PW - 120, { weight: 800, lh: 1.25 }); });
    },
    pratinjau_salah(ctx, b, l) {
      const span = A(b) * 0.9, ds = [0.8, 0.8, 0.8, 1.4, 0.8, 1.2, 2.2], S = W.seq(l, span, ds);
      const all = qs(6), err = {}, vals = { 1: "X-3", 2: "Robotik", 3: ["Senin", "Jumat"] };
      if (S.at(1) && S.p(1) > 0.6) err[0] = "Pertanyaan ini wajib diisi.";
      if (S.at(5)) vals[5] = W.typed("20", S.p(5) / 0.5);
      if (S.at(5) && S.p(5) > 0.6) err[5] = "Masukkan angka antara 0 dan 12.";
      const bg = browser(ctx, { tabs: [...ET, { title: TITLE, icon: "check" }], tab: 1, url: "formulir.example/f/ekskul" });
      const bottomOf = e => { const g = probe(c => F.preview(c, bg, { title: TITLE, desc: DESC, qs: all, err: e, vals, scroll: 0 }))(ctx); return Math.max(0, g.contentH - bg.h); };
      const e0 = err[0] ? { 0: err[0] } : {};
      const sBot0 = bottomOf({}), sBot1 = bottomOf(e0);
      let sc;
      if (S.i === 0) sc = lerp(492, sBot0, ease(S.u));
      else if (S.i === 1) sc = sBot0;
      else if (S.i === 2) sc = lerp(sBot1, 0, ease(S.u));
      else if (S.i === 3) sc = 0;
      else if (S.i === 4) sc = lerp(0, sBot1, ease(S.u));
      else sc = sBot1;
      const st = { title: TITLE, desc: DESC, qs: all, vals, err, scroll: sc, focus: S.at(5) ? 5 : null, caret: Math.floor(l * 2.4) % 2 === 0, submitHot: S.i === 1 };
      F.preview(ctx, bg, st);
      const gA = probe(c => F.preview(c, bg, { ...st, err: {}, scroll: sBot0 }))(ctx), gB = probe(c => F.preview(c, bg, { ...st, err: e0, scroll: sBot1 }))(ctx);
      const p = W.path(l, span, [{ x: 900, y: 500, d: 0.8 }, { x: gA.submit.cx, y: gA.submit.cy + 6, d: 0.8, click: true }, { x: 800, y: 400, d: 0.8 }, { x: 800, y: 400, d: 1.4 }, { x: 800, y: 400, d: 0.8 }, { x: gB.q[5].field.cx, y: gB.q[5].field.cy + 6, d: 1.2, click: true }, { x: gB.q[5].field.cx + 60, y: gB.q[5].field.cy + 70, d: 2.2 }], { x: 900, y: 500 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
      note(ctx, WIN.y, 300, "FORMULIR MENOLAK", (x, y) => {
        if (S.at(2)) { ctx.fillStyle = C.badBg; rr(ctx, x + 16, y + 66, PW - 32, 100, 12); ctx.fill(); para(ctx, "Nama kosong: wajib diisi", x + 34, y + 106, 23, PW - 68, { weight: 800, color: RED, lh: 1.25 }); }
        if (S.at(5) && S.p(5) > 0.6) { ctx.fillStyle = C.badBg; rr(ctx, x + 16, y + 180, PW - 32, 100, 12); ctx.fill(); para(ctx, "20 tahun: di luar batas 0–12", x + 34, y + 220, 23, PW - 68, { weight: 800, color: RED, lh: 1.25 }); } });
      if (S.at(6)) note(ctx, WIN.y + 320, 200, null, (x, y) => para(ctx, "Data yang salah tertahan sebelum masuk ke tabel.", x + 24, y + 60, 25, PW - 48, { weight: 800, lh: 1.35 }), { fill: C.goodBg, stroke: C.goodBg });
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 280, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 290, 245, 20, 70, 6); ctx.fill(); rr(ctx, 330, 245, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 268, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 430, 316, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 380 + i * 104, 900, 88, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 436 + i * 104, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 435 + i * 104, 27, { weight: 700, fit: 790 }); });
      card(ctx, 1170, 380, 540, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "Contoh: data kelasmu", 1200, 424, 24, { weight: 900, color: C.ink2 });
      [["Nama panggilan", "short"], ["Cara ke sekolah", "radio"], ["Jajanan favorit", "check"], ["Kelas", "drop"], ["Tanggal lahir? Tidak perlu!", "date"]].forEach(([k, t], i) => {
        const y = 450 + i * 62; ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(1200, y, 480, 62);
        F.icon(ctx, t, 1230, y + 31, 26, i === 4 ? RED : ACC, true); text(ctx, k, 1260, y + 39, 22, { weight: 700, color: i === 4 ? RED : C.ink, fit: 400 }); });
    },

    // ---------- 6. tabel respons ----------
    respons(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [0.3, 0.9, 4], S = W.seq(l, span, ds);
      const bg = browser(ctx, { tabs: ET, url: S.at(2) ? "formulir.example/d/ekskul/responses" : "formulir.example/d/ekskul/edit" });
      if (!S.at(2)) { const g = F.editor(ctx, bg, { title: TITLE, desc: DESC, qs: qs(6), active: null, scroll: 0, count: 24 });
        const p = W.path(l, span * 1.2 / 5.2, [{ x: 900, y: 600, d: 0.3 }, { x: g.tabs[1].cx, y: g.tabs[1].cy + 6, d: 0.9, click: true }], { x: 900, y: 600 }); L.cursor(ctx, p.x, p.y, { click: p.click }); }
      else respView(ctx, bg, clamp(S.p(2) * 2.5, 0, 1), {});
      if (S.at(2)) note(ctx, WIN.y, 300, "LANGSUNG JADI DIAGRAM", (x, y) => para(ctx, "Setiap jawaban berasal dari pilihan yang sama, jadi mudah dihitung.", x + 24, y + 92, 24, PW - 48, { weight: 700, lh: 1.35 }));
    },
    respons_tabel(ctx, b, l) {
      const a = A(b), span = a * 0.85, ds = [0.3, 0.9, 0.6, 4], S = W.seq(l, span, ds);
      const sheet = S.at(2) && S.p(2) > 0.4 || S.at(3);
      const tabs = [...ET, ...(sheet ? [{ title: "Respons Pendaftaran Ekskul", icon: "check" }] : [])];
      const bg = browser(ctx, { tabs, tab: sheet ? 1 : 0, url: sheet ? "lembarkerja.example/d/respons-ekskul" : "formulir.example/d/ekskul/responses", loading: S.i === 2 ? S.u : 0 });
      if (!sheet) { const g = respView(ctx, bg, 1, { btnHot: S.i === 1 && S.u > 0.5 });
        const p = W.path(l, span * 1.2 / 5.8, [{ x: 900, y: 600, d: 0.3 }, { x: g.btn.cx, y: g.btn.cy + 6, d: 0.9, click: true }], { x: 900, y: 600 }); L.cursor(ctx, p.x, p.y, { click: p.click }); }
      else {
        const cells = { A1: "Nama", B1: "Kelas", C1: "Ekskul", D1: "Hari", E1: "Mulai latihan", F1: "Pengalaman" };
        CLEAN.forEach((r, i) => ["A", "B", "C", "D", "E", "F"].forEach((c, j) => cells[c + (i + 2)] = r[j]));
        const g = L.sheet(ctx, { x: bg.x + 10, y: bg.y + 4, w: bg.w - 20, h: bg.h }, { cells, cols: 6, rows: 8, cw: { A: 230, B: 120, C: 190, D: 190, E: 190, F: 170 }, rh: 52 });
        const u = S.at(3) ? S.p(3) : 0;
        if (u > 0.15) for (let r = 2; r <= 8; r++) { if (u < 0.15 + (r - 2) * 0.05) break; const c = g.cell("B" + r); ctx.fillStyle = "rgba(46,158,91,0.22)"; ctx.fillRect(c.x + 2, c.y + 2, c.w - 4, c.h - 4); }
        if (u > 0.55) for (let r = 2; r <= 8; r++) { const c = g.cell("E" + r); ctx.fillStyle = "rgba(46,158,91,0.16)"; ctx.fillRect(c.x + 2, c.y + 2, c.w - 4, c.h - 4); }
      }
      if (sheet) note(ctx, WIN.y, 420, "HITUNG PER KELAS", (x, y) => { [["X-1", 5], ["X-2", 4], ["X-3", 3], ["X-4", 6], ["X-5", 2], ["X-6", 4]].forEach(([k, n], i) => { const yy = y + 66 + i * 54; ctx.fillStyle = C.goodBg; rr(ctx, x + 16, yy, PW - 32, 46, 10); ctx.fill();
        text(ctx, k, x + 36, yy + 32, 24, { weight: 900, color: GREEN }); text(ctx, String(n) + " murid", x + PW - 36, yy + 32, 22, { align: "right", weight: 800 }); }); });
      if (sheet && l > a * 0.6) note(ctx, WIN.y + 440, 160, null, (x, y) => para(ctx, "Siap diurutkan dan dihitung, tanpa dirapikan.", x + 24, y + 60, 24, PW - 48, { weight: 800, lh: 1.3 }), { fill: "#FFF3D6", stroke: "#FFF3D6" });
    },

    // ---------- 7. kesalahan ----------
    salah_teks(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "KESALAHAN 1: SEMUA KOLOM TEKS BEBAS", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      const side = (x, good) => {
        card(ctx, x, 250, 720, 540, { fill: good ? "#F2FAF4" : "#FDF1F0", stroke: good ? GREEN : RED, lw: 4, r: 20 });
        text(ctx, good ? "✓ tipe sesuai jawaban" : "✗ semua jawaban singkat", x + 360, 300, 30, { align: "center", weight: 900, color: good ? GREEN : RED });
        [["Kelas", good ? "drop" : "short"], ["Ekskul", good ? "radio" : "short"], ["Mulai latihan", good ? "date" : "short"]].forEach(([t, k], i) => { const y = 330 + i * 70; ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 40, y, 640, 58, 10); ctx.fill();
          text(ctx, t, x + 64, y + 38, 24, { weight: 800 }); F.icon(ctx, k, x + 460, y + 29, 26, good ? ACC : C.ink2, true); text(ctx, F.typeName(k), x + 490, y + 38, 21, { weight: 700, color: C.ink2 }); });
        const rows = good ? [["X-1", "Futsal", "12/03/2027"], ["X-1", "Robotik", "15/03/2027"], ["X-2", "Futsal", "12/03/2027"]] : [["kls 10", "futsal", "12 Maret"], ["sepuluh satu", "FUTSAL", "minggu depan"], ["x1", "Robot", "12-3"]];
        rows.forEach((r, i) => r.forEach((s, j) => { const cx = x + 40 + j * 214, cy = 560 + i * 62; ctx.fillStyle = good ? C.goodBg : C.badBg; ctx.fillRect(cx, cy, 208, 56); text(ctx, s, cx + 104, cy + 36, 22, { align: "center", weight: 800, color: good ? GREEN : RED, fit: 196 }); }));
      };
      side(220, false); if (l > a * 0.45) { ctx.save(); ctx.globalAlpha = fade(l, a * 0.45); side(980, true); ctx.restore(); }
    },
    salah_lainnya(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [0.4, 1.2, 3], S = W.seq(l, span, ds);
      const other = S.at(2) || (S.i === 1 && S.u > 0.6);
      const st = { qs: qs(6).map((q, i) => i === 2 ? { ...q, other } : q), active: 2, q: { otherHot: S.i === 1 && S.u > 0.3 } };
      const g = editor(ctx, st), g0 = probeEd(ctx, { ...st, qs: qs(6), scroll: F.editorScroll(AREA, { qs: qs(6), active: 2 }) });
      const o = g0.q[2].other;
      const p = W.path(l, span, [{ x: 900, y: 650, d: 0.4 }, { x: o.cx, y: o.cy + 6, d: 1.2, click: true }, { x: o.cx + 260, y: o.cy - 90, d: 3 }], { x: 900, y: 650 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
      note(ctx, WIN.y, 250, "KESALAHAN 2", (x, y) => para(ctx, "Pilihan kurang lengkap: ekskul Karate tidak ada.", x + 24, y + 92, 25, PW - 48, { weight: 800, lh: 1.35 }));
      if (other) note(ctx, WIN.y + 270, 250, "MURID MELIHAT", (x, y) => { F.icon(ctx, "radio", x + 46, y + 100, 30, ACC, true); text(ctx, "Lainnya:", x + 74, y + 110, 24, { weight: 800 });
        ctx.fillStyle = ACC; ctx.fillRect(x + 186, y + 118, 150, 2.5); text(ctx, "Karate", x + 192, y + 110, 24, { weight: 700, color: C.ink2 });
        para(ctx, "Ia tetap bisa menjawab.", x + 24, y + 180, 23, PW - 48, { weight: 700, color: GREEN, lh: 1.3 }); }, { stroke: "#B9DEC5" });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan E.8", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Rancang formulir", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/e8", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "tipe dan aturan setiap kolom", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Buat formulir untuk satu data kecil di kelasmu, misalnya menu favorit kantin. Data secukupnya saja.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });

  // ---------- data tabel ----------
  const MESSY = [["Ayu Lestari", "X-1", "futsal", "12/3"], ["Bima Saputra", "kls 10", "Futsal", "12 Maret"], ["Citra Dewi", "sepuluh satu", "sepak bola mini", "minggu depan"],
    ["Dimas Pratama", "x1", "ROBOTIK", "2026-03-12"], ["Eka Putri", "X 1", "Robot", "12-3-26"], ["Fajar Nugroho", "X-2", "tari", "Senin"], ["Gita Rahma", "X-1", "Paduan suara", "12/03"]];
  const CLEAN = [["Ayu Lestari", "X-1", "Futsal", "Senin, Rabu", "12/03/2027", 2], ["Bima Saputra", "X-4", "Futsal", "Jumat", "12/03/2027", 0], ["Citra Dewi", "X-1", "Robotik", "Rabu", "15/03/2027", 1],
    ["Dimas Pratama", "X-3", "Robotik", "Senin, Jumat", "12/03/2027", 3], ["Eka Putri", "X-1", "Tari", "Rabu", "19/03/2027", 0], ["Fajar Nugroho", "X-2", "Pramuka", "Jumat", "12/03/2027", 1], ["Gita Rahma", "X-6", "Paduan Suara", "Senin", "15/03/2027", 4]];
  function respView(ctx, bg, u, o) {
    const g = F.app(ctx, bg, { title: TITLE, tab: 1, count: 24 }), bd = g.body, x = bd.x + 200, w = F.CW;
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, bd.y + 16, w, 96, 10); ctx.fill();
    text(ctx, "24 respons", x + 28, bd.y + 76, 32, { weight: 900, color: C.ink });
    const bx = x + w - 330; ctx.fillStyle = o.btnHot ? "#DDF3E4" : "#FFFFFF"; rr(ctx, bx, bd.y + 38, 300, 52, 26); ctx.fill(); ctx.strokeStyle = GREEN; ctx.lineWidth = 2; rr(ctx, bx, bd.y + 38, 300, 52, 26); ctx.stroke();
    F.icon(ctx, "grid", bx + 34, bd.y + 64, 26, GREEN); text(ctx, "Lihat di lembar kerja", bx + 58, bd.y + 72, 21, { weight: 800, color: GREEN });
    F.bars(ctx, x, bd.y + 126, 372, "Kelas", [["X-1", 5], ["X-2", 4], ["X-3", 3], ["X-4", 6], ["X-5", 2], ["X-6", 4]], u, { h: 340, rh: 38, lw: 70 });
    F.bars(ctx, x + 388, bd.y + 126, 372, "Ekskul pilihan", [["Futsal", 7], ["Paduan Suara", 4], ["Pramuka", 5], ["Robotik", 6], ["Tari", 2]], u, { h: 340, rh: 44, lw: 150, color: "#5C8F6A" });
    g.btn = { cx: bx + 150, cy: bd.y + 64 };
    return g;
  }
})(typeof window !== "undefined" ? window : globalThis);
