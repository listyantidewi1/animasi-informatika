/* S29 Simulasi praktik: halaman web pertama dengan HTML (editor kode generik + browser).
   Mode penuh: editor atau browser di kiri (x 110–1410, y 122–822) + panel kanan (x 1450–1820).
   Mode berdampingan: editor (x 100–1040) dan browser (x 1060–1820), untuk "ubah, simpan, muat ulang" dan kesalahan.
   Semua nama dan situs rekaan (.example). Memakai layar.js, layar_web.js, layar_kode.js (LK.insert, LK.typed) dan html.js (Kiko.s29). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, W = K.web, LK = K.layarKode, HK = K.s29;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const ED = { x: 100, y: 122, w: 940, h: 700 }, BR = { x: 1060, y: 122, w: 760, h: 700 };
  const RED = "#D9443B", GREEN = "#2E9E5B", BLUE = "#1A73C8";
  const PX = 1450, PW = 370;
  const A = b => b.audio || b.dur;
  const fade = (l, t0, d = 0.4) => ease(clamp((l - t0) / d, 0, 1));
  const blink = l => Math.floor(l * 2.4) % 2 === 0;
  const inShort = ctx => !!(ctx.canvas && ctx.canvas.isConnected === false);

  // ---------- kode bertahap ----------
  const CODE = HK.CODE;
  const BASE0 = [...CODE.slice(0, 7), "</body>", "</html>"];                  // kerangka tanpa isi body
  const ADD_H1 = [CODE[7]], ADD_P = [CODE[8]], ADD_IMG = [CODE[9], CODE[10]], ADD_A = [CODE[11], CODE[12], CODE[13]];
  const upto = n => [...CODE.slice(0, 7), ...CODE.slice(7, 7 + n), "</body>", "</html>"];  // n baris isi body
  const P1 = "Catat setoran sampah kelasmu, lalu lihat poinnya bertambah.", P2 = "Setiap kilogram bernilai sepuluh poin.";
  const ALT = "Layar aplikasi Setor Sampah dengan poin tiap kelas";
  const PAGE = { h1: "Setor Sampah", p: [P1], img: "ok", alt: ALT, link: "Kunjungi Bank Sampah" };
  const CODE2 = [...CODE.slice(0, 8), "  <p>Catat setoran sampah kelasmu, lalu lihat poinnya bertambah.", "     " + P2 + "</p>", ...CODE.slice(9)];

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
  // potongan kode berwarna (untuk kartu panel)
  function codeChip(ctx, s, x, y, size) {
    const cw = LK.mono(ctx, size, 600); let col = 0;
    HK.tokens([s])[0].forEach(t => { ctx.fillStyle = HK.COL[t.k]; LK.mono(ctx, size, 600); LK.monoText(ctx, t.s, x + col * cw, y, cw); col += t.s.length; });
    return col * cw;
  }
  // pointer tangan (saat di atas link)
  function hand(ctx, x, y) {
    ctx.save(); ctx.translate(x - 8, y - 2); ctx.scale(1.25, 1.25);
    ctx.beginPath(); ctx.moveTo(6, 0); ctx.quadraticCurveTo(10, -2, 10, 4); ctx.lineTo(10, 12); ctx.quadraticCurveTo(14, 9, 16, 13); ctx.quadraticCurveTo(20, 11, 21, 15); ctx.quadraticCurveTo(25, 13, 26, 18);
    ctx.lineTo(26, 26); ctx.quadraticCurveTo(25, 34, 19, 36); ctx.lineTo(9, 36); ctx.quadraticCurveTo(4, 32, 0, 22); ctx.quadraticCurveTo(-2, 17, 3, 17); ctx.lineTo(3, 3); ctx.quadraticCurveTo(3, -1, 6, 0); ctx.closePath();
    ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  }
  // penerjemah: sisipkan baris di depan </body>, diketik bertahap
  function typing(ctx, b, l, nBefore, add, panel, o = {}) {
    const span = A(b) * (o.speed || 0.6), u = clamp((l - (o.t0 || 0.3)) / span, 0, 1);
    const r = LK.insert(upto(nBefore), 7 + nBefore, add, u);
    const added = []; for (let i = 0; i < add.length; i++) if (u > 0) added.push(7 + nBefore + i);
    const g = HK.editor(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { lines: r.lines, caret: r.caret, blink: !r.done || blink(l), file: o.file || "Tanpa judul", dirty: true, add: r.done && l > A(b) * 0.7 ? [] : added, mark: o.mark && r.done ? o.mark(l) : [] });
    if (panel) panel(ctx, g, r, u);
    return { g, r, u };
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      const a = A(b); card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 960, 228, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 220, 270, 760, 500, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 });
      const rows = [CODE[7], "  <p>Catat setoran sampah…</p>", "  <img src=\"setor.png\" alt=\"…\">", "  <a href=\"…\">Kunjungi…</a>"];
      rows.forEach((s, i) => { const u = fade(l, 0.4 + i * a * 0.12); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; codeChip(ctx, s.trim(), 260, 360 + i * 100, 28); ctx.restore(); });
      text(ctx, "index.html", 260, 316, 24, { weight: 800, color: C.ink2 });
      const v = fade(l, a * 0.55, 0.5);
      ctx.save(); ctx.globalAlpha = v;
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.moveTo(1000, 500); ctx.lineTo(1040, 520); ctx.lineTo(1000, 540); ctx.fill();
      const bg = HK.browser(ctx, 1060, 270, 640, 500, {});
      HK.page(ctx, bg, { ...PAGE, scale: 0.72 });
      ctx.restore();
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 380, 290, 560, 300, { fill: C.bg2, r: 22 }); text(ctx, "F12.6", 660, 380, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Kreasi Konten Digital dengan Metode Bervariasi", 660, 440, 30, 480, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "format ketiga: halaman web", 660, 562, 24, { align: "center", weight: 600, color: C.ink2 });
      card(ctx, 980, 290, 560, 300, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
      text(ctx, "Yang kamu butuhkan", 1260, 350, 28, { align: "center", weight: 900 });
      [["Editor teks / editor kode", "</>"], ["Browser apa pun", "◎"], ["Tanpa internet", "✓"]].forEach(([s, ic], i) => { text(ctx, ic, 1040, 420 + i * 56, 26, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 1080, 420 + i * 56, 26, { weight: 700 }); });
      if (l > A(b) * 0.6) { card(ctx, 420, 630, 1080, 70, { fill: "#FFF3D6", r: 14 }); text(ctx, "Semua nama dan situs di video ini hanyalah contoh rekaan.", 960, 676, 28, { align: "center", weight: 800, color: C.accentDark }); }
      kiko(ctx, 1660, 730, 90, 0, { wave: l });
    },

    // ---------- 1. folder dan kerangka ----------
    folder(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [0.3, 0.8, 2, 1, 0.6, 2.2], S = W.seq(l, span, ds);
      const inside = S.at(4);
      const name = "web-setor-sampah";
      let items, path;
      if (!inside) { items = [{ name: "tugas", kind: "folder" }, { name: "foto", kind: "folder" }]; if (S.at(1) && S.p(1) > 0.5) items.push({ name: S.at(2) ? W.typed(name, S.p(2) / 0.9) : "Folder baru", kind: "folder", typing: S.i <= 2 ? true : null, sel: S.at(3) }); path = "Dokumen"; }
      else { items = S.at(5) && S.p(5) > 0.25 ? [{ name: "setor.png", kind: "png", sel: S.p(5) < 0.7 }] : []; path = "Dokumen  ›  " + name; }
      const g = HK.files(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { items, path });
      // tombol Folder baru di kepala daftar
      const fb = { x: WIN.x + WIN.w - 220, y: WIN.y + 62, w: 190, h: 40 };
      ctx.fillStyle = S.i === 1 ? "#DCE9F7" : "#F1F4F6"; rr(ctx, fb.x, fb.y, fb.w, fb.h, 8); ctx.fill(); text(ctx, "+ Folder baru", fb.x + fb.w / 2, fb.y + 27, 20, { align: "center", weight: 800, color: BLUE });
      if (inside && S.at(5) && S.p(5) > 0.25 && S.p(5) < 0.7) { const it = g.item[0]; text(ctx, "disalin dari Unduhan", it.cx, it.cy + 120, 18, { align: "center", weight: 700, color: GREEN }); }
      const f2 = { cx: WIN.x + 260 + 2 * 190 + 75, cy: WIN.y + 46 + 90 + 60 };
      const p = W.path(l, span, [{ x: 900, y: 650, d: 0.3 }, { x: fb.x + 95, y: fb.y + 26, d: 0.8, click: true }, { x: fb.x + 60, y: fb.y + 90, d: 2 }, { x: f2.cx, y: f2.cy + 6, d: 1, click: true }, { x: f2.cx, y: f2.cy + 6, d: 0.6, click: true }, { x: f2.cx + 120, y: f2.cy + 160, d: 2.2 }], { x: 900, y: 650 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
      steps(ctx, "LANGKAH", ["Buat folder baru: web-setor-sampah.", "Buka folder itu.", "Simpan setor.png di dalamnya."], S.i <= 2 ? 0 : S.i <= 4 ? 1 : S.n >= 6 ? 3 : 2);
      if (S.at(5)) note(ctx, WIN.y + 330, 210, null, (x, y) => para(ctx, "Halaman web dan gambarnya berada di folder yang sama.", x + 24, y + 56, 25, PW - 48, { weight: 800, lh: 1.35 }), { fill: "#FFF3D6", stroke: "#FFF3D6" });
    },
    kerangka(ctx, b, l) {
      const a = A(b), u = clamp((l - 0.3) / (a * 0.5), 0, 1);
      const r = LK.typed(BASE0, u);
      const headOn = l > a * 0.58, bodyOn = l > a * 0.78;
      const hl = [...(headOn ? [2, 3, 4, 5] : []), ...(bodyOn ? [6, 7] : [])];
      HK.editor(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { lines: r.lines, caret: r.caret, blink: !r.done || blink(l), dirty: true, hl });
      note(ctx, WIN.y, 300, "KERANGKA HALAMAN", (x, y) => {
        ctx.save(); ctx.globalAlpha = headOn ? 1 : 0.25; ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 16, y + 66, PW - 32, 96, 12); ctx.fill(); codeChip(ctx, "<head>", x + 34, y + 104, 24); text(ctx, "judul tab, info halaman", x + 34, y + 144, 22, { weight: 700 }); ctx.restore();
        ctx.save(); ctx.globalAlpha = bodyOn ? 1 : 0.25; ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 16, y + 176, PW - 32, 96, 12); ctx.fill(); codeChip(ctx, "<body>", x + 34, y + 214, 24); text(ctx, "semua yang tampil di layar", x + 34, y + 254, 22, { weight: 700 }); ctx.restore(); });
      note(ctx, WIN.y + 320, 170, null, (x, y) => para(ctx, "Di Windows bisa memakai Notepad; di HP, editor kode daring.", x + 24, y + 52, 22, PW - 48, { weight: 700, color: C.ink2, lh: 1.35 }));
    },
    tag(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "ANATOMI SEBUAH TAG", 960, 210, 34, { align: "center", weight: 900, color: C.accentDark });
      const size = 66, cw = LK.mono(ctx, size, 600), s = "<h1>Setor Sampah</h1>", x0 = 960 - s.length * cw / 2, y0 = 420;
      ctx.fillStyle = "#F6F8F9"; rr(ctx, x0 - 40, y0 - 90, s.length * cw + 80, 130, 20); ctx.fill();
      codeChip(ctx, s, x0, y0, size);
      const seg = (from, to, label, col, t, below) => { if (l < a * t) return; const u = fade(l, a * t); ctx.save(); ctx.globalAlpha = u; const xa = x0 + from * cw, xb = x0 + to * cw, yb = below ? y0 + 40 : y0 - 104;
        ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(xa + 4, yb); ctx.lineTo(xa + 4, yb + (below ? 18 : -18)); ctx.lineTo(xb - 4, yb + (below ? 18 : -18)); ctx.lineTo(xb - 4, yb); ctx.stroke();
        text(ctx, label, (xa + xb) / 2, below ? yb + 64 : yb - 34, 32, { align: "center", weight: 900, color: col }); ctx.restore(); };
      seg(0, 4, "tag pembuka", "#1C6BB0", 0.12, true); seg(16, 21, "tag penutup", "#1C6BB0", 0.45, true); seg(4, 16, "isi", GREEN, 0.7, false);
      if (l > a * 0.45) { const u = fade(l, a * 0.5); ctx.save(); ctx.globalAlpha = u; const xs = x0 + 17.5 * cw; ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(xs, y0 - 22, 44, 0, Math.PI * 2); ctx.stroke();
        text(ctx, "garis miring", xs + 60, y0 - 140, 30, { weight: 900, color: RED }); ctx.beginPath(); ctx.moveTo(xs + 40, y0 - 60); ctx.lineTo(xs + 80, y0 - 128); ctx.stroke(); ctx.restore(); }
      text(ctx, "< kurang dari    > lebih dari", 960, 700, 30, { align: "center", weight: 800, color: C.ink2 });
    },

    // ---------- 2. empat tag ----------
    ketik_h1(ctx, b, l) {
      const a = A(b);
      typing(ctx, b, l, 0, ADD_H1, (c, g, r) => {
        steps(c, "LANGKAH", ["Klik di dalam body.", "Ketik <h1>Setor Sampah</h1>"], r.done ? 2 : 1);
        if (l > a * 0.55) note(c, WIN.y + 280, 250, "h1 = JUDUL UTAMA", (x, y) => { text(c, "Setor Sampah", x + 24, y + 130, 44, { weight: 700, color: "#000", fit: PW - 48 }); text(c, "tampil besar dan tebal", x + 24, y + 190, 22, { weight: 700, color: C.ink2 }); });
      }, { speed: 0.5 });
    },
    ketik_p(ctx, b, l) {
      const a = A(b);
      typing(ctx, b, l, 1, ADD_P, (c, g, r) => {
        steps(c, "LANGKAH", ["Tekan Enter di akhir baris h1.", "Ketik <p>, kalimatnya, </p>"], r.done ? 2 : 1);
        if (l > a * 0.5) note(c, WIN.y + 300, 220, "p = PARAGRAF", (x, y) => para(c, "Teks biasa. Paragraf baru selalu dimulai di baris baru.", x + 24, y + 96, 23, PW - 48, { weight: 700, lh: 1.35 }));
      }, { speed: 0.62 });
    },
    ketik_img(ctx, b, l) {
      const a = A(b);
      typing(ctx, b, l, 2, ADD_IMG, (c, g, r) => {
        steps(c, "LANGKAH", ["Ketik <img src=\"setor.png\"", "Tambahkan alt=\"…\" lalu >"], r.done ? 2 : r.caret.line > 9 ? 1 : 0);
        if (r.done) note(c, WIN.y + 260, 360, "DUA ATRIBUT", (x, y) => {
          c.fillStyle = "#E7F1FB"; rr(c, x + 16, y + 66, PW - 32, 100, 12); c.fill(); codeChip(c, "src", x + 34, y + 104, 26); text(c, "= nama file gambar", x + 90, y + 104, 22, { weight: 800 }); text(c, "setor.png", x + 34, y + 146, 22, { weight: 700, color: C.ink2 });
          if (l > a * 0.6) { c.fillStyle = "#FFF3D6"; rr(c, x + 16, y + 180, PW - 32, 100, 12); c.fill(); codeChip(c, "alt", x + 34, y + 218, 26); text(c, "= keterangan gambar", x + 90, y + 218, 22, { weight: 800 }); text(c, "untuk yang tidak bisa melihat", x + 34, y + 260, 20, { weight: 700, color: C.ink2 }); }
          text(c, "img tidak punya tag penutup.", x + 24, y + 330, 20, { weight: 700, color: C.ink2 }); });
      }, { speed: 0.42, mark: () => [{ line: 9, from: 7, to: 22, color: BLUE }, ...(l > a * 0.6 ? [{ line: 10, from: 7, to: 64, color: C.accent }] : [])] });
    },
    ketik_a(ctx, b, l) {
      const a = A(b);
      typing(ctx, b, l, 4, ADD_A, (c, g, r) => {
        steps(c, "LANGKAH", ["Ketik <p>, lalu <a href=\"…\">", "Ketik teks link, lalu </a>", "Tutup dengan </p>"], r.done ? 3 : r.caret.line >= 13 ? 2 : (r.caret.line === 12 && r.caret.col > 40) ? 1 : 0);
        if (r.done) note(c, WIN.y + 330, 250, "a = LINK", (x, y) => { codeChip(c, "href", x + 24, y + 96, 26); text(c, "= alamat tujuan", x + 100, y + 96, 22, { weight: 800 });
          c.font = "400 26px 'Liberation Serif', serif"; c.fillStyle = "#0000EE"; c.textAlign = "left"; c.fillText("Kunjungi Bank Sampah", x + 24, y + 170); c.fillRect(x + 24, y + 174, c.measureText("Kunjungi Bank Sampah").width, 2);
          text(c, "teks yang diklik", x + 24, y + 214, 21, { weight: 700, color: C.ink2 }); });
      }, { speed: 0.45, mark: () => [{ line: 12, from: 12, to: 40, color: BLUE }, ...(l > a * 0.65 ? [{ line: 12, from: 41, to: 61, color: C.accent }] : [])] });
    },

    // ---------- 3. simpan dan buka ----------
    simpan(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [0.3, 0.8, 0.5, 1, 1.6, 1, 1.2], S = W.seq(l, span, ds);
      const saved = S.at(6) && S.p(6) > 0.2, dlg = S.at(2) && !saved;
      HK.editor(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { lines: CODE, file: saved ? "index.html" : null, dirty: !saved });
      if (dlg) { ctx.fillStyle = "rgba(31,42,51,0.3)"; rr(ctx, WIN.x, WIN.y, WIN.w, WIN.h, 16); ctx.fill(); }
      const cx = WIN.x + WIN.w / 2, dy = WIN.y + 160;
      const d0 = (() => { ctx.save(); ctx.globalAlpha = 0; const r = HK.saveDialog(ctx, cx, dy, {}); ctx.restore(); return r; })();
      if (dlg) HK.saveDialog(ctx, cx, dy, { folder: S.at(3) && S.p(3) > 0.6 ? "web-setor-sampah" : "Dokumen", folderHot: S.i === 3, name: S.at(4) ? W.typed("index.html", S.p(4) / 0.85) : "Tanpa judul.txt", nameMark: S.i === 4 && S.p(4) < 0.08 ? [0, 15] : null, nameFocus: S.i >= 4, caret: blink(l), press: S.i === 5 && S.u > 0.6 ? (S.u - 0.6) / 0.4 : 0 });
      if (S.i === 1) L.keys(ctx, PX + PW / 2, 700, ["Ctrl", "S"], { press: S.u, align: "center", size: 30 });
      const p = W.path(l, span, [{ x: 900, y: 650, d: 0.3 }, { x: 900, y: 650, d: 0.8 }, { x: 900, y: 650, d: 0.5 }, { x: d0.folder.cx, y: d0.folder.cy + 6, d: 1, click: true }, { x: d0.name.cx, y: d0.name.cy + 6, d: 1.6, click: true }, { x: d0.btn.cx, y: d0.btn.cy + 6, d: 1, click: true }, { x: d0.btn.cx + 60, y: d0.btn.cy + 80, d: 1.2 }], { x: 900, y: 650 });
      if (S.at(2)) L.cursor(ctx, p.x, p.y, { click: p.click });
      steps(ctx, "LANGKAH", ["Tekan Ctrl + S.", "Pilih folder web-setor-sampah.", "Nama file: index.html", "Klik Simpan."], S.i <= 2 ? 0 : S.i === 3 ? 1 : S.i === 4 ? 2 : S.n >= 6 ? 4 : 3);
      if (saved) note(ctx, WIN.y + 420, 180, null, (x, y) => para(ctx, "Tab editor kini bernama index.html.", x + 24, y + 70, 25, PW - 48, { weight: 800, lh: 1.3 }), { fill: C.goodBg, stroke: C.goodBg });
    },
    buka(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [0.3, 1, 0.7, 4], S = W.seq(l, span, ds);
      const open = S.at(2) && S.p(2) > 0.4;
      if (!open) { const g = HK.files(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { path: "Dokumen  ›  web-setor-sampah", items: [{ name: "index.html", kind: "html", sel: S.at(1) && S.p(1) > 0.5 }, { name: "setor.png", kind: "png" }] });
        const it = g.item[0]; const p = W.path(l, span * 1.6 / 6, [{ x: 900, y: 650, d: 0.3 }, { x: it.cx, y: it.cy + 6, d: 0.65, click: true }, { x: it.cx, y: it.cy + 6, d: 0.35, click: true }, { x: it.cx, y: it.cy + 6, d: 0.6 }], { x: 900, y: 650 });
        L.cursor(ctx, p.x, p.y, { click: p.click }); if (S.at(1)) text(ctx, "double click", it.cx, it.cy + 120, 24, { align: "center", weight: 900, color: C.accentDark }); }
      else { const lo = clamp((S.p(2) - 0.4) / 0.6, 0, 1); const bg = HK.browser(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { loading: S.i === 2 ? lo : 0 });
        ctx.save(); ctx.globalAlpha = S.i === 2 ? lo : 1; const g = HK.page(ctx, bg, { ...PAGE, scale: 1.15 }); ctx.restore();
        const t = S.at(3) ? S.p(3) : 0; const tags = [["h1", bg.y + 50], ["p", bg.y + 120], ["img", bg.y + 250], ["a", g.link ? g.link.cy : bg.y + 420]];
        tags.forEach(([k, y], i) => { if (t < 0.1 + i * 0.15 || inShort(ctx)) return; ctx.fillStyle = C.accent; rr(ctx, bg.x + bg.w - 150, y - 26, 110, 46, 23); ctx.fill(); LK.mono(ctx, 24, 700); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText("<" + k + ">", bg.x + bg.w - 95, y + 6); });
        // judul tab berasal dari <title>
        if (t > 0.75) L.callout(ctx, bg.x + 600, bg.y + 24, "judul tab berasal dari <title>", inShort(ctx) ? null : bg.x + 220, inShort(ctx) ? null : WIN.y + 28, { size: 22 }); }
      steps(ctx, "LANGKAH", ["Buka folder web-setor-sampah.", "Double click index.html.", "Halaman terbuka di browser."], S.i === 0 ? 0 : S.i <= 2 && !open ? 1 : 3);
      if (open) note(ctx, WIN.y + 330, 340, "URUTAN TAMPIL", (x, y) => { ["h1: judul", "p: paragraf", "img: gambar", "a: link"].forEach((s, i) => { const on = S.at(3) && S.p(3) > 0.1 + i * 0.15; ctx.globalAlpha = on ? 1 : 0.25; text(ctx, (i + 1) + ".  " + s, x + 30, y + 100 + i * 58, 26, { weight: 800 }); ctx.globalAlpha = 1; }); });
    },
    link_hover(ctx, b, l) {
      const a = A(b), span = a * 0.9;
      const bg = HK.browser(ctx, WIN.x, WIN.y, WIN.w, WIN.h, {});
      const g0 = (() => { ctx.save(); ctx.globalAlpha = 0; const r = HK.page(ctx, bg, { ...PAGE, scale: 1.15 }); ctx.restore(); return r; })();
      const lk = g0.link, p = W.path(l, span, [{ x: 900, y: 420, d: 0.3 }, { x: lk.cx, y: lk.cy + 4, d: 1.2 }, { x: lk.cx + 10, y: lk.cy + 4, d: 3 }], { x: 900, y: 420 });
      const over = p.x > lk.x && p.x < lk.x + lk.w && p.y > lk.y && p.y < lk.y + lk.h + 6;
      HK.page(ctx, bg, { ...PAGE, scale: 1.15, hover: over, status: over ? "https://banksampah.example" : null });
      if (over) hand(ctx, p.x, p.y); else L.cursor(ctx, p.x, p.y, {});
      note(ctx, WIN.y, 330, "SAAT DI ATAS LINK", (x, y) => { ctx.globalAlpha = over ? 1 : 0.3; hand(ctx, x + 50, y + 90); text(ctx, "pointer jadi tangan", x + 100, y + 120, 24, { weight: 800 });
        ctx.fillStyle = "#F1F4F6"; rr(ctx, x + 24, y + 180, PW - 48, 40, 6); ctx.fill(); text(ctx, "https://banksampah.example", x + 36, y + 207, 19, { weight: 600, color: C.ink2, fit: PW - 70 }); text(ctx, "alamat tujuan, pojok kiri bawah", x + 24, y + 260, 21, { weight: 700, color: C.ink2 }); ctx.globalAlpha = 1; });
      if (over && l > a * 0.6) note(ctx, WIN.y + 350, 170, null, (x, y) => para(ctx, "Periksa alamatnya sebelum mengklik.", x + 24, y + 70, 25, PW - 48, { weight: 800, lh: 1.3 }), { fill: "#FFF3D6", stroke: "#FFF3D6" });
    },

    // ---------- 4. ubah dan muat ulang ----------
    ubah(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [0.3, 0.9, 0.5, 2.6, 0.8, 1.2], S = W.seq(l, span, ds);
      let lines = CODE, caret = null, dirty = false;
      if (S.at(2)) { const t = S.at(3) ? W.typed(P2, S.p(3) / 0.95) : ""; lines = [...CODE.slice(0, 8), "  <p>Catat setoran sampah kelasmu, lalu lihat poinnya bertambah.", "     " + t + "</p>", ...CODE.slice(9)]; caret = { line: 9, col: 5 + t.length }; dirty = true; }
      else if (S.at(1) && S.p(1) > 0.6) caret = { line: 8, col: 5 + P1.length };
      const saved = S.at(4) && S.p(4) > 0.5; if (saved) dirty = false;
      const g = HK.editor(ctx, ED.x, ED.y, ED.w, ED.h, { lines, caret, blink: blink(l) || S.i === 3, file: "index.html", dirty, size: 20, add: S.at(2) ? [9] : [] });
      const bg = HK.browser(ctx, BR.x, BR.y, BR.w, BR.h, {}); HK.page(ctx, bg, PAGE);
      const at = g.at(8, 5 + P1.length);
      const p = W.path(l, span, [{ x: 700, y: 700, d: 0.3 }, { x: at.x + 2, y: at.y + 16, d: 0.9, click: true }, { x: at.x + 40, y: at.y + 90, d: 5.1 }], { x: 700, y: 700 });
      L.cursor(ctx, p.x, p.y, { click: p.click, kind: "text" });
      if (S.i === 2) L.keys(ctx, ED.x + ED.w / 2, 690, ["Enter"], { press: S.u, align: "center", size: 30 });
      if (S.i === 4) L.keys(ctx, ED.x + ED.w / 2, 690, ["Ctrl", "S"], { press: S.u, align: "center", size: 30 });
      if (S.at(5)) L.callout(ctx, BR.x + 60, BR.y + 520, "Browser belum berubah.", null, null, { color: RED, fill: "#FFFFFF", size: 26 });
    },
    muat_ulang(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [0.3, 1, 0.5, 2.2, 3], S = W.seq(l, span, ds);
      HK.editor(ctx, ED.x, ED.y, ED.w, ED.h, { lines: CODE2, file: "index.html", size: 20 });
      const pb = (() => { ctx.save(); ctx.globalAlpha = 0; const r = HK.browser(ctx, BR.x, BR.y, BR.w, BR.h, {}); ctx.restore(); return r; })();
      const fresh = S.at(2) && S.p(2) > 0.5;
      const bg = HK.browser(ctx, BR.x, BR.y, BR.w, BR.h, { reloadHot: S.i === 1 && S.u > 0.5, loading: S.i === 2 ? S.u : 0 });
      const full = P1 + " " + P2;
      HK.page(ctx, bg, { ...PAGE, p: [fresh ? full : P1], mark: fresh && S.i <= 3 ? [P1.length + 1, full.length] : null });
      const p = W.path(l, span, [{ x: 1400, y: 600, d: 0.3 }, { x: pb.reload.cx, y: pb.reload.cy + 6, d: 1, click: true }, { x: pb.reload.cx + 520, y: pb.reload.cy + 50, d: 5.7 }], { x: 1400, y: 600 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
      if (S.i === 1) L.keys(ctx, BR.x + BR.w / 2, 690, ["F5"], { press: S.u, align: "center", size: 30 });
      if (S.at(4)) { const u = fade(l, (span * 4 / 7)); ctx.save(); ctx.globalAlpha = u; card(ctx, BR.x + 40, BR.y + 470, BR.w - 80, 200, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 18 });
        [["ubah", 0], ["simpan", 1], ["muat ulang", 2]].forEach(([s, i]) => { const cx = BR.x + 150 + i * 240; ctx.fillStyle = "#FFFFFF"; rr(ctx, cx - 95, BR.y + 530, 190, 70, 35); ctx.fill(); text(ctx, s, cx, BR.y + 575, 26, { align: "center", weight: 900, color: C.accentDark });
          if (i < 2) text(ctx, "→", cx + 120, BR.y + 577, 32, { align: "center", weight: 900, color: C.accentDark }); });
        text(ctx, "ulangi setiap kali mengubah", BR.x + BR.w / 2, BR.y + 640, 22, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); }
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 280, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 290, 245, 20, 70, 6); ctx.fill(); rr(ctx, 330, 245, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 268, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 430, 316, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 380 + i * 104, 900, 88, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 436 + i * 104, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 435 + i * 104, 27, { weight: 700, fit: 790 }); });
      card(ctx, 1170, 380, 540, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "Folder proyekmu", 1200, 424, 24, { weight: 900, color: C.ink2 });
      [["index.html", "</>"], ["foto-produk.png", "▣"]].forEach(([s, ic], i) => { text(ctx, ic, 1220, 480 + i * 50, 24, { weight: 900, color: "#1C6BB0" }); text(ctx, s, 1270, 480 + i * 50, 24, { weight: 700 }); });
      ["<h1>…</h1>", "<p>…</p>", "<img src=\"…\" alt=\"…\">", "<a href=\"…\">…</a>"].forEach((s, i) => codeChip(ctx, s, 1210, 600 + i * 44, 22));
    },

    // ---------- 5. kesalahan ----------
    salah_tutup(ctx, b, l) {
      const a = A(b), fix = l > a * 0.62, reload = l > a * 0.75;
      const lines = [...CODE]; if (!fix) lines[7] = "  <h1>Setor Sampah";
      HK.editor(ctx, ED.x, ED.y, ED.w, ED.h, { lines, file: "index.html", size: 20, err: fix ? [] : [7], add: fix ? [7] : [], mark: fix ? [{ line: 7, from: 18, to: 23, color: GREEN }] : [{ line: 7, from: 2, to: 6, color: RED }] });
      const bg = HK.browser(ctx, BR.x, BR.y, BR.w, BR.h, { loading: fix && !reload ? (l - a * 0.62) / (a * 0.13) : 0 });
      HK.page(ctx, bg, { ...PAGE, h1Open: !reload });
      L.callout(ctx, ED.x + 520, ED.y + 120, fix ? "✓ </h1> ditambahkan" : "✗ </h1> terlupa", null, null, { color: fix ? GREEN : RED, fill: "#FFFFFF", size: 26 });
      if (!reload) L.callout(ctx, BR.x + 300, BR.y + 560, "paragraf ikut jadi judul", null, null, { color: RED, fill: "#FFFFFF", size: 24 });
    },
    salah_file(ctx, b, l) {
      const a = A(b), fix = l > a * 0.66, reload = l > a * 0.78;
      const lines = [...CODE]; if (!fix) lines[9] = "  <img src=\"setor.jpg\"";
      HK.editor(ctx, ED.x, ED.y, ED.w, ED.h, { lines, file: "index.html", size: 20, err: fix ? [] : [9], add: fix ? [9] : [], mark: [{ line: 9, from: 12, to: 21, color: fix ? GREEN : RED }] });
      card(ctx, ED.x + 560, ED.y + 520, 340, 150, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 14 });
      text(ctx, "Isi folder:", ED.x + 584, ED.y + 560, 21, { weight: 800, color: C.ink2 }); HK.setorImg(ctx, ED.x + 584, ED.y + 578, 56, 36); text(ctx, "setor.png", ED.x + 654, ED.y + 604, 23, { weight: 800, color: GREEN });
      text(ctx, "</>  index.html", ED.x + 584, ED.y + 650, 21, { weight: 700, color: C.ink2 });
      const bg = HK.browser(ctx, BR.x, BR.y, BR.w, BR.h, { loading: fix && !reload ? (l - a * 0.66) / (a * 0.12) : 0 });
      HK.page(ctx, bg, { ...PAGE, img: reload ? "ok" : "broken" });
      if (!reload && l > a * 0.4) L.callout(ctx, BR.x + 40, BR.y + 400, "hanya alt text yang tampil", null, null, { color: RED, fill: "#FFFFFF", size: 24 });
    },
    salah_alt(ctx, b, l) {
      const a = A(b), fix = l > a * 0.62;
      const lines = fix ? [...CODE] : [...CODE.slice(0, 9), "  <img src=\"setor.png\">", ...CODE.slice(11)];
      HK.editor(ctx, ED.x, ED.y, ED.w, ED.h, { lines, file: "index.html", size: 20, err: fix ? [] : [9], add: fix ? [10] : [] });
      const bg = HK.browser(ctx, BR.x, BR.y, BR.w, BR.h, {}); HK.page(ctx, bg, PAGE);
      // pembaca layar
      const y = BR.y + 450; card(ctx, BR.x + 30, y, BR.w - 60, 220, { fill: fix ? "#F2FAF4" : "#FDF1F0", stroke: fix ? GREEN : RED, lw: 3, r: 18 });
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(BR.x + 70, y + 60); ctx.lineTo(BR.x + 84, y + 60); ctx.lineTo(BR.x + 104, y + 42); ctx.lineTo(BR.x + 104, y + 102); ctx.lineTo(BR.x + 84, y + 84); ctx.lineTo(BR.x + 70, y + 84); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 4; [16, 30].forEach(r => { ctx.beginPath(); ctx.arc(BR.x + 108, y + 72, r, -0.7, 0.7); ctx.stroke(); });
      text(ctx, "Pembaca layar:", BR.x + 160, y + 58, 22, { weight: 800, color: C.ink2 });
      para(ctx, fix ? "“Gambar: " + ALT + ".”" : "“Gambar.”", BR.x + 160, y + 102, 26, BR.w - 230, { weight: 800, lh: 1.3, color: fix ? GREEN : RED });
      if (!fix && l > a * 0.3) text(ctx, "isinya apa?", BR.x + 160, y + 180, 24, { weight: 800, color: RED });
    },
    periksa(ctx, b, l) {
      const a = A(b), items = ["Setiap tag sudah ditutup", "Gambar muncul", "Gambar punya alt", "Link ke alamat yang benar"];
      const on = i => l > a * (0.15 + i * 0.18);
      const bg = HK.browser(ctx, WIN.x, WIN.y, WIN.w, WIN.h, {}); HK.page(ctx, bg, { ...PAGE, scale: 1.15, status: on(3) ? "https://banksampah.example" : null, hover: on(3) });
      const y0 = WIN.y; card(ctx, PX, y0, PW, 90 + items.length * 96, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HALAMANMU", PX + PW / 2, y0 + 48, 24, { align: "center", weight: 900, color: C.accentDark });
      items.forEach((k, i) => { const y = y0 + 74 + i * 96, ok = on(i); ctx.fillStyle = ok ? C.goodBg : "#F4F6F5"; rr(ctx, PX + 18, y, PW - 36, 80, 12); ctx.fill();
        para(ctx, k, PX + 36, y + 34, 23, PW - 110, { weight: 700, lh: 1.2 }); text(ctx, ok ? "✓" : "?", PX + PW - 40, y + 51, 30, { align: "center", weight: 900, color: ok ? GREEN : C.ink2 }); });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F12.6", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Latihan halaman web", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f126", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "alt text dan link yang jelas", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Buat halaman web untuk produk proyekmu, uji ke tiga orang, lalu perbaiki satu hal.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
