/* S30 Simulasi praktik: infografik satu halaman (judul besar, satu angka, tiga poin, ajakan, sumber) di aplikasi desain generik.
   Jendela aplikasi di kiri (x 110–1410, y 122–822), panel langkah dan label di kanan (x 1450–1820).
   Produk "Setor Sampah" milik Bank Sampah SMA Tunas, angka, dan sumbernya rekaan (sama dengan episode F12.6). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, D = K.dok;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 }, PX = 1450, PW = 370;
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";
  const G = "#2E9E5B", DK = "#1F2A33", LG = "#E3F4EA", GR = "#5B6B76";
  const SW = [DK, G, "#FFFFFF", "#F2B134"];

  // ---------- versi rapi (satuan desain 600 × 800) ----------
  const SRC = "Sumber: catatan Bank Sampah SMA Tunas, Juli–September 2026 (data rekaan).";
  const PTS = [["botol", "Pilah botol dan gelas plastik."], ["timbangan", "Timbang setiap hari Jumat."], ["koin", "Kumpulkan poin di aplikasi."]];
  const PART = {
    title: [{ id: "title", t: "text", x: 44, y: 104, s: "Sampah Plastik Jadi Poin", size: 54, weight: 900, color: DK, maxW: 512, lh: 1.08 }],
    sub: [{ id: "sub", t: "text", x: 44, y: 206, s: "Bank Sampah SMA Tunas · aplikasi Setor Sampah", size: 19, weight: 600, color: GR }],
    num: [{ id: "num", t: "text", x: 40, y: 330, s: "412 kg", size: 96, weight: 900, color: G }],
    numcap: [{ id: "numcap", t: "text", x: 44, y: 372, s: "plastik terkumpul dalam tiga bulan", size: 24, weight: 600, color: DK }],
    p0: [{ id: "i0", t: "icon", kind: PTS[0][0], x: 70, y: 452, s: 36, color: G, bg: LG }, { id: "p0", t: "text", x: 112, y: 461, s: PTS[0][1], size: 25, weight: 700, color: DK }],
    p1: [{ id: "i1", t: "icon", kind: PTS[1][0], x: 70, y: 530, s: 36, color: G, bg: LG }, { id: "p1", t: "text", x: 112, y: 539, s: PTS[1][1], size: 25, weight: 700, color: DK }],
    p2: [{ id: "i2", t: "icon", kind: PTS[2][0], x: 70, y: 608, s: 36, color: G, bg: LG }, { id: "p2", t: "text", x: 112, y: 617, s: PTS[2][1], size: 25, weight: 700, color: DK }],
    band: [{ id: "band", t: "rect", x: 0, y: 668, w: 600, h: 66, fill: G }],
    cta: [{ id: "cta", t: "text", x: 300, y: 710, s: "Setor hari Jumat, 12.00, dekat kantin!", size: 27, weight: 800, color: "#FFFFFF", align: "center" }],
    src: [{ id: "src", t: "text", x: 44, y: 764, s: SRC, size: 15, weight: 600, color: GR, maxW: 512, lh: 1.25 }]
  };
  const ORDER = ["title", "sub", "num", "numcap", "p0", "p1", "p2", "band", "cta", "src"];
  // rapi(daftar bagian atau "semua", mod): elemen versi rapi; mod[id] menimpa sifat elemen
  function rapi(parts = ORDER, mod = {}) { const out = []; ORDER.forEach(k => { if (parts.includes(k)) PART[k].forEach(e => out.push({ ...e, ...(mod[e.id] || {}) })); }); return out; }
  // ---------- versi berantakan ----------
  const MESSY = (() => { const c = ["#8E44AD", "#E74C3C", "#3498DB", "#F39C12", "#E91E63", "#16A085"]; const e = [];
    e.push({ t: "rect", x: 0, y: 0, w: 600, h: 70, fill: "#FCE4EC" }, { t: "text", x: 6, y: 46, s: "Bank sampah sekolah kita!!!", size: 34, weight: 800, color: c[0] });
    const lines = ["Bank Sampah SMA Tunas sekarang punya aplikasi baru yang namanya Setor Sampah.", "Aplikasi ini bisa dipakai oleh semua murid, guru, dan juga karyawan sekolah.", "Sampah plastik seperti botol dan gelas harus dipilah dulu sebelum disetor.",
      "Penimbangan dilakukan setiap hari Jumat, tetapi kadang-kadang juga hari lain.", "Selama tiga bulan sudah terkumpul 412 kg sampah plastik, banyak sekali!", "Setiap kilogram akan diubah menjadi poin yang tercatat di aplikasi.", "Poin bisa ditukar dengan alat tulis di koperasi sekolah.",
      "Jangan lupa mencuci botol supaya tidak bau dan tidak mengundang semut.", "Ayo ikut menjaga lingkungan sekolah kita supaya bersih dan sehat.", "Info lebih lanjut tanyakan kepada pengurus bank sampah di dekat kantin."];
    lines.forEach((s, i) => e.push({ t: "text", x: i % 3 === 1 ? 70 : 4, y: 104 + i * 66, s, size: [16, 14, 18, 13, 20, 15, 17, 14, 16, 13][i], weight: i === 4 ? 800 : 500, color: c[i % 6], maxW: i % 3 === 1 ? 526 : 592, lh: 1.15 }));
    e.push({ t: "circle", x: 560, y: 380, rad: 30, fill: "#F39C12" }, { t: "icon", kind: "bintang", x: 540, y: 600, s: 44, color: "#E91E63" }, { t: "icon", kind: "daun", x: 90, y: 760, s: 50, color: "#16A085" },
      { t: "rect", x: 300, y: 740, w: 300, h: 60, fill: "#3498DB" }, { t: "text", x: 310, y: 778, s: "Setor ya!!", size: 22, weight: 800, color: "#F1C40F" });
    return e; })();
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.9);
  const ptr = (ctx, p, kind) => L.cursor(ctx, p.x, p.y, { click: p.click, down: p.down, kind });
  const steps = (ctx, items, n, title, y) => D.steps(ctx, PX, y || 122, PW, title || "LANGKAH", items, n);
  const blink = l => Math.floor(l * 2.2) % 2 === 0;
  function app(ctx, opt = {}) { return D.canvasApp(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: "Desain — Infografik Setor Sampah", swatches: SW, ...opt }); }
  // halaman lepas (di luar aplikasi): bayangan + isi
  function sheet(ctx, x, y, w, els, opt = {}) { const h = w * 4 / 3; ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.2)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.restore();
    const ids = D.info(ctx, { x, y, w, h }, els, opt); if (opt.border) { ctx.strokeStyle = opt.border; ctx.lineWidth = 5; ctx.strokeRect(x - 4, y - 4, w + 8, h + 8); } return ids; }
  const mark = (ctx, x, y, ok, s) => text(ctx, (ok ? "✓ " : "✗ ") + s, x, y, 28, { align: "center", weight: 900, color: ok ? GREEN : RED });

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menyusun lima bagian infografik", "mengatur ukuran dan ruang kosong", "membatasi warna", "menulis sumber data"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      sheet(ctx, 1220, 200, 420, rapi());
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SIMULASI INI MELENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 330, 300, 600, 330, { fill: C.bg2, r: 22 });
      text(ctx, "F12.6", 630, 380, 56, { align: "center", weight: 900, color: C.kiko }); para(ctx, "Kreasi Konten Digital dengan Metode Bervariasi", 630, 440, 34, 520, { align: "center", weight: 800, lh: 1.2 });
      card(ctx, 990, 300, 600, 330, { fill: "#FFF9E0", r: 22 }); text(ctx, "Contoh: Setor Sampah", 1290, 370, 34, { align: "center", weight: 900 });
      para(ctx, "aplikasi fiktif milik Bank Sampah SMA Tunas; semua angka rekaan", 1290, 430, 28, 520, { align: "center", weight: 700, lh: 1.3, color: C.ink2 });
      D.icon(ctx, "daur", 1290, 570, 60, G);
      kiko(ctx, 1660, 720, 100, 0, { wave: l });
    },
    rencana(ctx, b, l) {
      const a = b.audio || b.dur; card(ctx, 160, 140, 1600, 680);
      text(ctx, "RENCANA DI KERTAS", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 230, 250, 760, 160, { fill: "#FFF9E0", r: 18 }); text(ctx, "Pesan inti", 260, 296, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Setor sampah plastikmu lewat Setor Sampah, kumpulkan poin, dan bantu sekolah lebih bersih.", 260, 340, 27, 700, { weight: 700, lh: 1.25 });
      // sketsa kotak
      const px = 1150, py = 230, pw = 420, k = pw / 600; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(px, py, pw, pw * 4 / 3); ctx.strokeStyle = "#B9C7CF"; ctx.lineWidth = 2; ctx.strokeRect(px, py, pw, pw * 4 / 3);
      const boxes = [["Judul", 30, 30, 540, 130], ["Angka penting", 30, 190, 300, 140], ["Poin 1", 30, 360, 540, 60], ["Poin 2", 30, 440, 540, 60], ["Poin 3", 30, 520, 540, 60], ["Ajakan", 0, 610, 600, 90], ["Sumber", 30, 725, 400, 50]];
      boxes.forEach(([s, x, y, w, h], i) => { if (l < a * (0.3 + i * 0.07)) return; ctx.strokeStyle = C.kiko; ctx.lineWidth = 3; ctx.setLineDash([9, 6]); ctx.strokeRect(px + x * k, py + y * k, w * k, h * k); ctx.setLineDash([]);
        text(ctx, s, px + x * k + 14, py + y * k + Math.min(h * k / 2 + 9, 34), i === 0 ? 26 : 20, { weight: 800, color: C.kikoDark }); });
      const items = ["Judul besar", "Satu angka penting", "Tiga poin", "Ajakan", "Sumber data"];
      items.forEach((s, i) => { if (l < a * (0.3 + i * 0.1)) return; text(ctx, (i + 1) + ".  " + s, 260, 480 + i * 56, 30, { weight: 800 }); });
    },
    kenal_kanvas(ctx, b, l) {
      const a = b.audio || b.dur; const g = app(ctx, { title: "Desain — Tanpa judul" });
      if (l > a * 0.12) L.callout(ctx, PX, 220, "Alat: Teks, Bentuk, Ikon, Gambar", g.panel(0).x + g.panel(0).w, g.panel(1).cy, { maxW: 330 });
      if (l > a * 0.42) L.callout(ctx, PX, 380, "Halaman tegak", g.page.x + g.page.w - 20, g.page.y + 200);
      if (l > a * 0.65) L.callout(ctx, PX, 170, "Ukuran huruf dan warna", g.tool("size").x + 300, g.tool("size").y + 6);
    },
    judul(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 2.6, 1.2, 0.8, 1.6], S = D.seq(l, sp, ds); const on = S.p(0) >= 0.6, big = S.p(2) >= 0.6, bold = S.p(3) >= 0.6;
      const m = ease(clamp(S.p(4) / 0.8, 0, 1));
      const el = { ...PART.title[0], size: big ? 54 : 24, weight: bold ? 900 : 600, typed: PART.title[0].s.length * clamp(S.p(1) / 0.9, 0, 1), caret: S.i <= 1 && on, y: lerp(400, 104, m) };
      const g = app(ctx, { pageW: 600, els: on ? [el] : [], sel: on && S.i >= 2 ? "title" : null, size: big ? 54 : 24, on: { bold }, panelHi: S.i === 0 ? 0 : null, hot: S.i === 2 ? "size" : S.i === 3 ? "bold" : null });
      steps(ctx, ["Klik Teks, ketik judulnya.", "Ukuran 54, tebal.", "Geser ke atas."], S.i <= 1 ? 0 : S.i <= 3 ? 1 : m < 1 ? 2 : 3);
      const sz = g.tool("size"), bd = g.tool("bold"), tr = g.ids.title || { cx: g.page.cx, cy: g.page.y + 260 };
      const pts = [{ x: g.panel(0).cx, y: g.panel(0).cy, d: ds[0], click: true }, { x: g.page.x + 120, y: g.page.y + 300, d: ds[1] }, { x: sz.cx, y: sz.cy, d: ds[2], click: true }, { x: bd.cx, y: bd.cy, d: ds[3], click: true }, { x: tr.x + 60, y: tr.y + 30, d: ds[4], down: true }];
      const p = D.path(l, sp, pts, { x: 900, y: 650 }); if (S.i === 4) { p.x = tr.x + 60; p.y = tr.y + 30; p.down = m < 1; } ptr(ctx, p);
    },
    angka(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 1.4, 1, 1, 2.6], S = D.seq(l, sp, ds); const on = S.p(0) >= 0.6, big = S.p(2) >= 0.6, green = S.p(3) >= 0.6;
      const num = { ...PART.num[0], size: big ? 96 : 24, color: green ? G : DK, typed: 6 * clamp(S.p(1) / 0.9, 0, 1), caret: S.i === 1 };
      const cap = { ...PART.numcap[0], typed: PART.numcap[0].s.length * clamp(S.p(4) / 0.85, 0, 1), caret: S.i === 4 && (S.p(4) < 0.9 || blink(l)) };
      const els = rapi(["title", "sub"]).concat(on ? [num] : [], S.at(4) ? [cap] : []);
      const g = app(ctx, { pageW: 600, els, sel: on && S.i >= 2 && S.i <= 3 ? "num" : null, size: S.i >= 4 ? 24 : big ? 96 : 24, swatchOn: green && S.i < 4 ? 1 : null, panelHi: S.i === 0 ? 0 : null, hot: S.i === 2 ? "size" : null });
      steps(ctx, ["Ketik: 412 kg.", "Ukuran 96, warna hijau.", "Tulis artinya, huruf kecil."], S.i <= 1 ? 0 : S.i <= 3 ? 1 : S.p(4) < 0.9 ? 2 : 3);
      const sz = g.tool("size"), swg = g.swatch(1);
      ptr(ctx, D.path(l, sp, [{ x: g.panel(0).cx, y: g.panel(0).cy, d: ds[0], click: true }, { x: g.page.x + 300, y: g.page.y + 360, d: ds[1] }, { x: sz.cx, y: sz.cy, d: ds[2], click: true }, { x: swg.cx, y: swg.cy, d: ds[3], click: true }, { x: g.page.x + g.page.w - 40, y: g.page.y + 420, d: ds[4] }], { x: 900, y: 650 }));
    },
    poin(ctx, b, l) {
      const sp = spanOf(b), ds = [1.2, 1.6, 1.6, 1.6, 1.2], S = D.seq(l, sp, ds);
      const els = rapi(["title", "sub", "num", "numcap"]);
      ["p0", "p1", "p2"].forEach((k, i) => { if (!S.at(i + 1)) return; const u = S.p(i + 1); els.push({ ...PART[k][0], alpha: ease(u * 3) }, { ...PART[k][1], typed: PART[k][1].s.length * clamp(u / 0.8, 0, 1) }); });
      const g = app(ctx, { pageW: 600, scroll: 190 * ease(clamp(l / (sp * 0.2), 0, 1)), els, guides: S.at(1) ? [{ x: 112 }] : [], panelHi: S.i === 0 ? 2 : null, size: 25 });
      steps(ctx, ["Pilih ikon dari menu Ikon.", "Satu ikon + satu kalimat pendek.", "Ukuran sama, garis kiri sama."], S.i === 0 ? 0 : S.i <= 2 ? 1 : S.i === 3 ? 2 : 3);
      if (S.at(4)) L.callout(ctx, PX, 420, "Garis bantu: semua poin rata kiri", g.page.x + 112 * g.page.w / 600, g.page.y + 640 * g.page.w / 600, { maxW: 330 });
      ptr(ctx, D.path(l, sp, [{ x: g.panel(2).cx, y: g.panel(2).cy, d: ds[0], click: true }, { x: g.page.x + 70, y: g.page.y + 470, d: ds[1] }, { x: g.page.x + 70, y: g.page.y + 548, d: ds[2] }, { x: g.page.x + 70, y: g.page.y + 626, d: ds[3] }, { x: g.page.x + g.page.w + 40, y: g.page.y + 660, d: ds[4] }], { x: 900, y: 650 }));
    },
    ajakan(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 1.2, 2.2, 2.4, 0.8], S = D.seq(l, sp, ds);
      const els = rapi(["title", "sub", "num", "numcap", "p0", "p1", "p2"]);
      if (S.p(1) > 0.3) els.push({ ...PART.band[0], w: 600 * ease(clamp((S.p(1) - 0.3) / 0.6, 0, 1)) });
      if (S.at(2)) els.push({ ...PART.cta[0], typed: PART.cta[0].s.length * clamp(S.p(2) / 0.9, 0, 1) });
      if (S.at(3)) els.push({ ...PART.src[0], typed: SRC.length * clamp(S.p(3) / 0.9, 0, 1) });
      const g = app(ctx, { pageW: 600, scroll: lerp(190, 268, ease(clamp(l / (sp * 0.2), 0, 1))), els, panelHi: S.i === 0 ? 1 : null, swatchOn: S.i === 1 ? 1 : null, size: S.i >= 3 ? 15 : 27 });
      steps(ctx, ["Bentuk: pita hijau.", "Ketik ajakannya.", "Tulis sumber data, kecil."], S.i <= 1 ? 0 : S.i === 2 ? 1 : S.i === 3 ? 2 : 3);
      ptr(ctx, D.path(l, sp, [{ x: g.panel(1).cx, y: g.panel(1).cy, d: ds[0], click: true }, { x: g.page.x + 30, y: g.page.y + 700, d: ds[1], down: true }, { x: g.page.x + g.page.w + 30, y: g.page.y + 620, d: ds[2] + ds[3] + ds[4] }], { x: 900, y: 650 }));
    },
    hierarki(ctx, b, l) {
      const a = b.audio || b.dur; const g = app(ctx, { els: rapi() }); const id = g.ids;
      const lab = [["num", "Angka: 96", 160], ["title", "Judul: 54", 270], ["p1", "Poin: 25", 380], ["src", "Sumber: 15", 490]];
      lab.forEach(([k, s, y], i) => { if (l < a * (0.12 + i * 0.13)) return; const q = id[k]; L.callout(ctx, PX, y, s, q.x + q.w, q.cy, { size: 28 }); });
      if (l > a * 0.7) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1690, 620); ctx.lineTo(1690, 760); ctx.stroke();
        text(ctx, "besar → kecil", PX + 10, 700, 28, { weight: 900, color: C.accentDark }); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(1675, 750); ctx.lineTo(1705, 750); ctx.lineTo(1690, 775); ctx.fill(); }
    },
    ruang(ctx, b, l) {
      const a = b.audio || b.dur; const showM = l > a * 0.1, showG = l > a * 0.6;
      const g = app(ctx, { els: rapi(), margin: showM ? 44 : 0, guides: showG ? [{ x: 44 }, { x: 556 }] : [] });
      const k = g.page.w / 600, X = v => g.page.x + v * k, Y = v => g.page.y + v * k;
      if (showM) L.callout(ctx, PX, 170, "Tepi kosong di keempat sisi", X(556), Y(250), { maxW: 330 });
      if (l > a * 0.35) { [[222, 250], [382, 420], [638, 668]].forEach(([y1, y2]) => { ctx.fillStyle = "rgba(214,51,132,0.18)"; ctx.fillRect(X(30), Y(y1), 540 * k, (y2 - y1) * k); });
        L.callout(ctx, PX, 300, "Jarak antarkelompok", X(560), Y(400)); }
      if (showG) L.callout(ctx, PX, 430, "Garis bantu: rata kiri", X(44), Y(500), { color: "#D63384", fill: "#FCE4F0" });
    },
    warna(ctx, b, l) {
      const a = b.audio || b.dur; const g = app(ctx, { els: rapi(), swatchOn: 1 });
      const y = 150; card(ctx, PX, y, PW, 330, { fill: "#FFFFFF", stroke: GREEN, lw: 3, r: 18 }); text(ctx, "WARNA YANG DIPAKAI", PX + 24, y + 46, 23, { weight: 900, color: GREEN });
      [[G, "hijau (utama)"], [DK, "hitam"], ["#FFFFFF", "putih"]].forEach(([c, s], i) => { if (l < a * (0.15 + i * 0.12)) return; const yy = y + 100 + i * 70;
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(PX + 50, yy, 24, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#AEBBC3"; ctx.lineWidth = 2; ctx.stroke(); text(ctx, s, PX + 92, yy + 9, 26, { weight: 800 }); });
      if (l > a * 0.6) { const y2 = 510; card(ctx, PX, y2, PW, 150, { fill: "#FDF1F0", stroke: RED, lw: 3, r: 18 }); text(ctx, "Hindari", PX + 24, y2 + 44, 24, { weight: 900, color: RED });
        ["#8E44AD", "#E74C3C", "#3498DB", "#F39C12", "#E91E63", "#16A085"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(PX + 44 + i * 52, y2 + 98, 20, 0, Math.PI * 2); ctx.fill(); });
        ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(PX + 20, y2 + 120); ctx.lineTo(PX + PW - 30, y2 + 76); ctx.stroke(); }
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 300, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 262, 22, 76, 6); ctx.fill(); rr(ctx, 340, 262, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 280, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 330, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 420 + i * 110, 900, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 476 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 476 + i * 110, 28, { weight: 700, fit: 790 }); });
      sheet(ctx, 1260, 260, 390, rapi());
    },
    berantakan(ctx, b, l) {
      const a = b.audio || b.dur; const g = app(ctx, { els: MESSY, title: "Desain — Infografik (versi berantakan)" }); const k = g.page.w / 600;
      if (l > a * 0.12) L.callout(ctx, PX, 170, "Sepuluh kalimat kecil", g.page.x + g.page.w - 30, g.page.y + 250 * k, { color: RED, fill: "#FDF1F0" });
      if (l > a * 0.35) L.callout(ctx, PX, 290, "Enam warna", g.page.x + g.page.w - 30, g.page.y + 380 * k, { color: RED, fill: "#FDF1F0" });
      if (l > a * 0.55) L.callout(ctx, PX, 410, "Banyak ukuran huruf", g.page.x + g.page.w - 60, g.page.y + 420 * k, { color: RED, fill: "#FDF1F0" });
      if (l > a * 0.72) L.callout(ctx, PX, 530, "Menempel di tepi halaman", g.page.x + 4, g.page.y + 160 * k, { color: RED, fill: "#FDF1F0" });
    },
    tes5(ctx, b, l) {
      const a = b.audio || b.dur; card(ctx, 160, 140, 1600, 680);
      text(ctx, "TES LIMA DETIK", 960, 205, 34, { align: "center", weight: 900, color: C.accentDark });
      sheet(ctx, 330, 250, 360, MESSY); sheet(ctx, 1230, 250, 360, rapi());
      const sec = Math.max(0, 5 - Math.floor(clamp((l - a * 0.3) / (a * 0.6), 0, 1) * 5)); const u = clamp((l - a * 0.3) / (a * 0.6), 0, 1);
      ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(960, 420, 90, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(960, 420, 90, -Math.PI / 2, -Math.PI / 2 + (1 - u) * Math.PI * 2); ctx.stroke();
      text(ctx, String(sec), 960, 450, 90, { align: "center", weight: 900 }); text(ctx, "detik", 960, 550, 28, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "Apa yang kamu ingat?", 960, 640, 30, { align: "center", weight: 800 });
      H.kid(ctx, 960, 720, 60, {});
    },
    hasil_tes(ctx, b, l) {
      const a = b.audio || b.dur; card(ctx, 160, 140, 1600, 680);
      text(ctx, "HASIL TES LIMA DETIK", 960, 205, 34, { align: "center", weight: 900, color: C.accentDark });
      sheet(ctx, 240, 250, 360, MESSY, { border: RED });
      const bub = (x, y, w, s, col) => { card(ctx, x, y, w, 150, { fill: "#FFFFFF", stroke: col, lw: 4, r: 24 }); para(ctx, s, x + w / 2, y + 62, 32, w - 40, { align: "center", weight: 800, lh: 1.25, color: col }); };
      bub(640, 300, 320, "Hmm… apa, ya?", RED); mark(ctx, 800, 520, false, "tidak ingat");
      if (l > a * 0.45 || b.full) { sheet(ctx, 1000, 250, 360, rapi(), { border: GREEN }); bub(1390, 300, 330, "412 kg! Setor hari Jumat.", GREEN); mark(ctx, 1555, 520, true, "ingat pesannya"); }
      H.kid(ctx, 960, 690, 60, {});
    },
    sumber(ctx, b, l) {
      const a = b.audio || b.dur; const noSrc = l < a * 0.4;
      const g = app(ctx, { pageW: 600, scroll: 268, els: noSrc ? rapi(ORDER.filter(k => k !== "src")) : rapi(), sel: noSrc ? null : "src" });
      if (noSrc) L.callout(ctx, PX, 170, "412 kg menurut siapa? Kapan?", g.page.x + 260, g.page.y + 300, { color: RED, fill: "#FDF1F0", maxW: 330 });
      else { const zy = 330; card(ctx, PX, zy, PW, 250, { fill: "#FFFFFF", stroke: GREEN, lw: 3, r: 18 }); text(ctx, "SUMBER DATA", PX + 24, zy + 44, 23, { weight: 900, color: GREEN });
        para(ctx, SRC, PX + 24, zy + 92, 25, PW - 48, { weight: 700, lh: 1.3 });
        ctx.strokeStyle = GREEN; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(PX, zy + 125); ctx.lineTo(g.page.x + g.page.w - 30, g.page.y + 770); ctx.stroke();
        text(ctx, "✓ siapa dan kapan", PX + 24, zy + 300, 28, { weight: 900, color: GREEN }); }
    },
    unduh(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 1.2, 1.4, 2.4], S = D.seq(l, sp, ds); const open = S.i >= 1 && S.i <= 2;
      const g = app(ctx, { els: rapi(), menuOn: open || S.i === 0 && S.u > 0.6 ? "File" : null });
      const mp = g.menu("File"); let png = { cx: 700, cy: 450 };
      if (open) { const m1 = D.menu(ctx, WIN.x + 16, WIN.y + 88, ["Baru", "Buka", { s: "Unduh", sub: true, sep: true }, "Bagikan"], { hi: S.i >= 1 && S.u > 0.4 || S.i === 2 ? 2 : null, w: 280 });
        if (S.i === 2 || S.u > 0.6) { const it = m1.item(2); const m2 = D.menu(ctx, it.x + 276, it.y - 6, ["PNG (gambar untuk HP)", "PDF (untuk dicetak)", "JPG"], { hi: S.i === 2 && S.u > 0.3 ? 0 : null, w: 360 }); png = m2.item(0); } }
      steps(ctx, ["Klik menu File.", "Pilih Unduh.", "Pilih PNG atau PDF.", "Buka di HP, cek tulisan."], S.i === 0 ? 0 : S.i === 1 ? 1 : S.i === 2 ? 2 : 3);
      if (S.at(3)) { // pratinjau di HP
        const hx = 1540, hy = 420, hw = 220, hh = 400; ctx.fillStyle = "#2B3A44"; rr(ctx, hx, hy, hw, hh, 28); ctx.fill(); ctx.fillStyle = "#FFFFFF"; rr(ctx, hx + 10, hy + 14, hw - 20, hh - 28, 18); ctx.fill();
        const pw = hw - 30; D.info(ctx, { x: hx + 15, y: hy + 40, w: pw, h: pw * 4 / 3 }, rapi()); ctx.strokeStyle = "#D5DEE3"; ctx.lineWidth = 1; ctx.strokeRect(hx + 15, hy + 40, pw, pw * 4 / 3);
        text(ctx, "infografik.png", hx + hw / 2, hy + hh - 30, 18, { align: "center", weight: 700, color: GR }); }
      const it3 = { x: WIN.x + 130, y: WIN.y + 88 + 6 + 12 + 2 * 46 + 23 };
      ptr(ctx, D.path(l, sp, [{ x: mp.x, y: mp.y, d: ds[0], click: true }, { ...it3, d: ds[1] }, { x: png.cx || it3.x + 330, y: png.cy || it3.y, d: ds[2], click: true }, { x: 1200, y: 760, d: ds[3] }], { x: 800, y: 560 }));
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F12.6", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "pemilih format", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f126", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "pilih format untuk pesan intimu", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Buat infografik untuk produk proyekmu, lalu lakukan tes lima detik bersama kelompok lain.", 1310, 420, 30, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
