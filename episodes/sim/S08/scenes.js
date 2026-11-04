/* S08 Simulasi praktik: membuat slide yang jelas (satu ide per slide, huruf ≥ 24 pt, kontras, gambar yang mendukung).
   Jendela aplikasi di kiri (x 110–1410, y 122–822), panel langkah dan label di kanan (x 1450–1820). Isi presentasi rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, D = K.dok;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 }, PX = 1450, PW = 370;
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";

  // ---------- isi presentasi (rekaan) ----------
  const SL = [
    { layout: "judul", title: "Aman di Internet", sub: "Tim 7B untuk adik kelas 6" },
    { layout: "isi_gambar", title: "Sandi yang Kuat", bullets: ["Tiga kata acak", "Tambah angka dan simbol", "Jangan dipakai ulang"], img: { kind: "gembok" } },
    { layout: "isi_gambar", title: "Cari dengan Jitu", bullets: ["Pakai kata kunci", "Cek dua sumber"], img: { kind: "cari" } },
    { layout: "isi_gambar", title: "Sopan di Grup Kelas", bullets: ["Pikir sebelum kirim", "Jangan sebar foto teman"], img: { kind: "grup" } },
    { layout: "isi", title: "Ingat Tiga Hal", bullets: ["Sandi kuat", "Cari dengan jitu", "Sopan di grup"] },
    { layout: "akhir", title: "Terima kasih!", sub: "Ada pertanyaan?" }
  ];
  const DENSE = { layout: "padat", title: "Keamanan Internet dan Berbagai Hal Penting yang Harus Diperhatikan oleh Semua Murid", titlePt: 26, bodyPt: 14,
    colors: ["#1F2A33", "#D9443B", "#2E7E9A", "#B57A12"],
    para: ["Kata sandi adalah kunci akun, jadi kata sandi harus dibuat sekuat mungkin dan tidak boleh mudah ditebak oleh orang lain.",
      "Gunakan gabungan tiga kata acak, lalu tambahkan angka dan simbol supaya lebih sulit ditebak.",
      "Jangan memakai tanggal lahir, nama sendiri, atau angka berurutan seperti 123456 sebagai kata sandi.",
      "Satu kata sandi sebaiknya dipakai untuk satu akun saja, jangan dipakai ulang untuk akun yang lain.",
      "Saat mencari informasi, pakailah kata kunci yang tepat dan jangan langsung percaya pada hasil pertama.",
      "Bandingkan setidaknya dua sumber yang berbeda sebelum kamu menyebarkan informasi kepada teman.",
      "Di grup kelas, pikirkan dulu apakah pesanmu sopan dan bermanfaat sebelum menekan tombol kirim.",
      "Jangan menyebarkan foto teman tanpa izin, karena hal itu bisa membuat temanmu malu atau sedih.",
      "Kalau ada pesan yang membuatmu tidak nyaman, ceritakan kepada guru atau orang tua."] };
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.9);
  const ptr = (ctx, p, kind) => L.cursor(ctx, p.x, p.y, { click: p.click, down: p.down, kind });
  const keys = (ctx, k, press, x = 1635, y = 700) => L.keys(ctx, x, y, [].concat(k), { press, align: "center", size: 30 });
  const steps = (ctx, items, n, title, y) => D.steps(ctx, PX, y || 122, PW, title || "LANGKAH", items, n);
  const blink = l => Math.floor(l * 2.2) % 2 === 0;
  function app(ctx, opt = {}) { return D.slideApp(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: "Slide — Aman di Internet", ...opt }); }
  const isi = (mod = {}) => ({ layout: "isi", title: SL[1].title, bullets: SL[1].bullets, bodyPt: 18, ...mod });

  // ruang kelas dilihat dari bangku belakang: layar di dinding depan, meja dan kepala murid di depan kita
  function room(ctx, x, y, w, h, spec, opt = {}) {
    ctx.save(); rr(ctx, x, y, w, h, 22); ctx.clip();
    ctx.fillStyle = "#F1ECE2"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#D9CDB8"; ctx.fillRect(x, y + h * 0.62, w, h * 0.38);           // lantai
    ctx.fillStyle = "#C9BBA3"; ctx.fillRect(x, y + h * 0.62, w, 6);
    const sw = opt.sw || w * 0.36, sh = sw * 9 / 16, sx = x + (w - sw) / 2, sy = y + h * 0.1;
    ctx.fillStyle = "#3A4650"; ctx.fillRect(sx - 10, sy - 10, sw + 20, sh + 20);
    ctx.save(); if (opt.blur) ctx.filter = `blur(${opt.blur}px)`; D.slide(ctx, sx, sy, sw, sh, spec, { lw: 0.5 }); ctx.restore();
    ctx.fillStyle = "#8D7A5E"; ctx.fillRect(x + w * 0.16, y + h * 0.56, w * 0.68, 12);  // meja guru
    // deretan meja + kepala murid (dari belakang)
    [[0.68, 0.55, 5], [0.8, 0.75, 4], [0.95, 1, 3]].forEach(([fy, sc, n]) => {
      const rowY = y + h * fy, dw = w * 0.17 * sc, gap = (w - n * dw) / (n + 1);
      for (let i = 0; i < n; i++) { const dx = x + gap + i * (dw + gap);
        ctx.fillStyle = ["#2B2118", "#3B2A1E", "#1F1A16"][i % 3]; ctx.beginPath(); ctx.ellipse(dx + dw / 2, rowY - 34 * sc, 30 * sc, 36 * sc, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; rr(ctx, dx + dw / 2 - 44 * sc, rowY - 6 * sc, 88 * sc, 60 * sc, 18 * sc); ctx.fill();
        ctx.fillStyle = "#A9825A"; ctx.fillRect(dx, rowY + 30 * sc, dw, 16 * sc); }
    });
    ctx.restore();
    ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 22); ctx.stroke();
    return { x: sx, y: sy, w: sw, h: sh };
  }
  function thumbMark(ctx, x, y, ok, s) { text(ctx, (ok ? "✓ " : "✗ ") + s, x, y, 28, { align: "center", weight: 900, color: ok ? GREEN : RED }); }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menyusun satu ide per slide", "memilih ukuran huruf ≥ 24 pt", "memakai warna yang kontras", "menambah gambar yang mendukung"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      ctx.fillStyle = "#3A4650"; ctx.fillRect(1100, 300, 560, 335); D.slide(ctx, 1110, 310, 540, 304, SL[1]);
      text(ctx, "aplikasi slide apa pun", 1380, 700, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "DIPAKAI DI EPISODE", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      [["D7.8", "Panduan Digital untuk Adik Kelas"], ["D8.6", "Cek Data, Cek Fakta"], ["D9.6", "Proyek Akhir Fase D"]].forEach(([c, t], i) => {
        const x = 250 + i * 480; card(ctx, x, 300, 440, 300, { fill: i === 0 ? C.bg2 : "#F2F6F4", r: 22 });
        text(ctx, c, x + 220, 380, 56, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 220, 450, 32, 380, { align: "center", weight: 800, lh: 1.2 });
      });
      text(ctx, "Siapkan kerangka slide timmu.", 960, 690, 30, { align: "center", weight: 700, color: C.ink2 });
      kiko(ctx, 1660, 720, 100, 0, { wave: l });
    },
    rencana(ctx, b, l) {
      const a = b.audio || b.dur; card(ctx, 160, 140, 1600, 680);
      text(ctx, "KERANGKA SLIDE: SATU IDE = SATU SLIDE", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      const ideas = ["Judul: Aman di Internet", "Sandi yang kuat", "Cari dengan jitu", "Sopan di grup kelas", "Ingat tiga hal", "Terima kasih"];
      ideas.forEach((s, i) => { const u = ease((l - a * 0.12 - i * a * 0.1) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        const x = 260 + (i % 3) * 480, y = 260 + Math.floor(i / 3) * 260; ctx.fillStyle = i % 2 ? "#FFF6D9" : "#E7F4EC"; rr(ctx, x, y, 420, 220, 16); ctx.fill();
        ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 3; rr(ctx, x, y, 420, 220, 16); ctx.stroke();
        text(ctx, "Slide " + (i + 1), x + 26, y + 50, 26, { weight: 900, color: C.kiko }); para(ctx, s, x + 26, y + 112, 34, 370, { weight: 800, lh: 1.2 }); ctx.globalAlpha = 1; });
    },
    kenal_slide(ctx, b, l) {
      const a = b.audio || b.dur; const g = app(ctx, { slides: [{ layout: "judul", ph: true, sub: "" }], cur: 0, title: "Slide — Tanpa judul" });
      if (l > a * 0.12) L.callout(ctx, PX, 200, "Daftar slide", g.thumbs[0].x + g.thumbs[0].w, g.thumbs[0].cy);
      if (l > a * 0.38) L.callout(ctx, PX, 340, "Slide yang sedang diedit", g.stage.x + g.stage.w - 30, g.stage.y + 60);
      if (l > a * 0.66) { const t = g.tool("layout"); L.callout(ctx, PX, 480, "Tata letak: susunan isi slide", t.x + t.w, t.cy); }
    },
    slide_judul(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 2.6, 1, 2.8, 0.8], S = D.seq(l, sp, ds);
      const tN = S.p(0) >= 0.6 ? SL[0].title.length * clamp(S.p(1) / 0.9, 0, 1) : 0, sN = S.p(2) >= 0.6 ? SL[0].sub.length * clamp(S.p(3) / 0.9, 0, 1) : 0;
      const sp0 = { layout: "judul", title: SL[0].title, sub: SL[0].sub, ph: true, typed: { title: tN, body: sN }, caret: S.i <= 1 && S.p(0) >= 0.6 ? "title" : S.i >= 2 && S.p(2) >= 0.6 && (S.i < 4 || blink(l)) ? "sub" : null };
      const g = app(ctx, { slides: [sp0], cur: 0, size: S.i >= 2 ? 28 : 54 });
      steps(ctx, ["Klik kotak judul.", "Ketik: Aman di Internet.", "Klik kotak subjudul.", "Ketik subjudulnya."], S.i === 0 ? 0 : S.i === 1 ? 1 : S.i === 2 ? 2 : S.i === 3 ? 3 : 4);
      const tr = g.els.title || { cx: 860, cy: 450 }, sr = g.els.sub || { cx: 860, cy: 560 };
      ptr(ctx, D.path(l, sp, [{ x: tr.cx + 120, y: tr.cy, d: ds[0], click: true }, { x: tr.cx + 160, y: tr.cy + 50, d: ds[1] }, { x: sr.cx + 100, y: sr.cy, d: ds[2], click: true }, { x: sr.cx + 140, y: sr.cy + 50, d: ds[3] + ds[4] }], { x: 1100, y: 700 }));
    },
    slide_baru(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 1.4, 2.8, 0.8], S = D.seq(l, sp, ds);
      const added = S.p(1) >= 0.6, menu = S.p(0) >= 0.6 && !added;
      const tN = SL[1].title.length * clamp(S.p(2) / 0.9, 0, 1);
      const slides = added ? [SL[0], { layout: "isi", title: SL[1].title, ph: true, typed: { title: tN }, caret: S.i < 3 || blink(l) ? "title" : null }] : [SL[0]];
      const g = app(ctx, { slides, cur: added ? 1 : 0, hot: menu ? "add" : null, size: 40 });
      const ad = g.tool("add"); let it = { cx: 700, cy: 450 };
      if (menu) { const m = D.layoutMenu(ctx, ad.x, ad.y + 46, S.i === 1 && S.u > 0.2 ? 1 : null); it = m.item(1); }
      else if (!added) { it = { cx: ad.x + 395, cy: ad.y + 46 + 16 + 65 }; }
      steps(ctx, ["Klik + Slide baru.", "Pilih Judul dan isi.", "Ketik judul singkat."], S.i === 0 ? 0 : S.i === 1 && !added ? 1 : S.i <= 2 ? 2 : 3);
      if (added && S.at(3)) L.callout(ctx, PX, 420, "Judul singkat: 2–4 kata", g.els.title.x + 360, g.els.title.cy);
      const tr = g.els.title || { cx: 800, cy: 330 };
      ptr(ctx, D.path(l, sp, [{ x: ad.cx, y: ad.cy, d: ds[0], click: true }, { x: it.cx, y: it.cy, d: ds[1], click: true }, { x: tr.cx + 200, y: (tr.cy || 330) + 40, d: ds[2] + ds[3] }], { x: 900, y: 650 }));
    },
    slide_poin(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 4.2, 1.2], S = D.seq(l, sp, ds); const total = SL[1].bullets.join("").length;
      const on = S.p(0) >= 0.6; const n = on ? total * clamp(S.p(1) / 0.92, 0, 1) : 0;
      const slide = isi({ ph: true, bullets: n > 0 ? SL[1].bullets : [], typed: { body: n }, caret: on && (S.i < 2 || blink(l)) ? "body" : null });
      const g = app(ctx, { slides: [SL[0], slide], cur: 1, size: 18 });
      steps(ctx, ["Klik kotak isi.", "Ketik poin pendek, Enter tiap poin."], S.i === 0 ? 0 : S.i === 1 ? 1 : 2);
      if (S.at(2)) L.callout(ctx, PX, 330, "Beberapa kata saja, bukan kalimat panjang", g.stage.x + 520, g.stage.y + 210, { maxW: 330 });
      const br = g.els.body || { cx: 800, cy: 500 };
      ptr(ctx, D.path(l, sp, [{ x: br.x ? br.x + 200 : 800, y: br.y ? br.y + 40 : 470, d: ds[0], click: true }, { x: 1200, y: 760, d: ds[1] + ds[2] }], { x: 1100, y: 700 }));
    },
    ukuran(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 1, 1.4, 2.6], S = D.seq(l, sp, ds);
      const sel = S.p(0) >= 0.6, open = S.p(1) >= 0.6 && S.p(2) < 0.6, big = S.p(2) >= 0.6;
      const g = app(ctx, { slides: [SL[0], isi({ bodyPt: big ? 28 : 18, sel: sel ? "body" : null })], cur: 1, size: sel ? (big ? 28 : 18) : 40, hot: S.i === 1 || open ? "size" : null });
      const sz = g.tool("size"); let it = { cx: sz.cx, cy: sz.cy + 200 };
      if (open) { const m = D.menu(ctx, sz.x, sz.y + 44, ["12", "14", "18", "24", "28", "32", "40"], { hi: S.u > 0.4 ? 4 : null, w: 120 }); it = m.item(4); }
      else if (!big) it = { cx: sz.x + 60, cy: sz.y + 44 + 6 + 4 * 46 + 23 };
      steps(ctx, ["Klik kotak isi.", "Buka ukuran huruf.", "Pilih 28."], S.i === 0 ? 0 : S.i === 1 ? 1 : !big ? 2 : 3);
      if (S.at(3)) { const y = 380; card(ctx, PX, y, PW, 250, { fill: "#FFFFFF", stroke: GREEN, lw: 3, r: 18 }); text(ctx, "UKURAN HURUF", PX + 24, y + 46, 24, { weight: 900, color: GREEN });
        [["Judul", "36–44 pt"], ["Isi", "paling kecil 24 pt"], ["Kita pakai", "28 pt"]].forEach(([k, v], i) => { text(ctx, k, PX + 24, y + 104 + i * 50, 24, { weight: 700, color: C.ink2 }); text(ctx, v, PX + PW - 24, y + 104 + i * 50, 25, { align: "right", weight: 900 }); }); }
      const br = g.els.body || { x: 800, y: 470 };
      ptr(ctx, D.path(l, sp, [{ x: br.x + 160, y: br.y + 30, d: ds[0], click: true }, { x: sz.cx, y: sz.cy, d: ds[1], click: true }, { x: it.cx, y: it.cy, d: ds[2], click: true }, { x: it.cx + 30, y: it.cy + 60, d: ds[3] }], { x: 1100, y: 700 }));
    },
    gambar(ctx, b, l) {
      const sp = spanOf(b), ds = [1.2, 2.4, 1, 1.6], S = D.seq(l, sp, ds);
      const dlg = S.p(0) >= 0.6 && S.p(2) < 0.6, done = S.p(2) >= 0.6;
      const slide = done ? { ...SL[1], sel: "img" } : isi({ bodyPt: 28 });
      const g = app(ctx, { slides: [SL[0], slide], cur: 1, hot: S.i === 0 ? "img" : null });
      const ib = g.tool("img"); let f0 = { cx: 600, cy: 440 }, okb = { cx: 1050, cy: 690 };
      if (dlg) { const dx = 330, dy = 250, a = D.dialog(ctx, dx, dy, 860, 470, "Sisipkan gambar", { dim: WIN });
        text(ctx, "▤  Proyek Panduan 7B", a.x, a.y + 30, 24, { weight: 700, color: C.ink2 });
        [["gembok", "gembok.png"], ["cari", "cari.png"], ["pemandangan", "gunung.png"]].forEach(([k, nm], i) => { const fx = a.x + i * 260, fy = a.y + 56, on = i === 0 && S.p(1) > 0.6;
          if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, fx - 8, fy - 8, 246, 216, 12); ctx.fill(); }
          D.pic(ctx, fx, fy, 230, 150, k, { r: 8 }); text(ctx, nm, fx + 115, fy + 188, 22, { align: "center", weight: 700, color: on ? BLUE : C.ink }); if (i === 0) f0 = { cx: fx + 115, cy: fy + 75 }; });
        okb = D.btn(ctx, dx + 860 - 236, dy + 470 - 82, 200, 56, "Sisipkan", { primary: true, press: S.i === 2 && S.u > 0.5 }); }
      steps(ctx, ["Klik ikon gambar.", "Pilih gambar gembok.", "Klik Sisipkan."], S.i === 0 ? 0 : S.i === 1 ? 1 : !done ? 2 : 3);
      if (done && S.at(3)) L.callout(ctx, PX, 420, "Gambar sesuai ide slide", g.els.img.x + g.els.img.w, g.els.img.cy);
      ptr(ctx, D.path(l, sp, [{ x: ib.cx, y: ib.cy, d: ds[0], click: true }, { x: f0.cx, y: f0.cy, d: ds[1], click: true }, { x: okb.cx, y: okb.cy, d: ds[2], click: true }, { x: 1150, y: 760, d: ds[3] }], { x: 1000, y: 650 }));
    },
    hiasan(ctx, b, l) {
      const a = b.audio || b.dur; card(ctx, 160, 140, 1600, 680);
      text(ctx, "GAMBAR: MENDUKUNG ATAU HIASAN?", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      D.slide(ctx, 230, 270, 680, 383, { ...SL[1], img: { kind: "pemandangan" } }); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.strokeRect(225, 265, 690, 393);
      thumbMark(ctx, 570, 720, false, "hiasan: mengalihkan perhatian");
      if (l > a * 0.45) { D.slide(ctx, 1010, 270, 680, 383, SL[1]); ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.strokeRect(1005, 265, 690, 393); thumbMark(ctx, 1350, 720, true, "mendukung ide slide"); }
    },
    kontras(ctx, b, l) {
      const a = b.audio || b.dur; card(ctx, 160, 140, 1600, 680);
      text(ctx, "KONTRAS WARNA", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      const big = { titlePt: 56, bodyPt: 40 }; const v = [[{ ...SL[4], ...big, ink: "#F2E27D", accent: "#F6D96B", titleColor: "#F2E27D" }, false, "kuning muda di putih"],
        [{ ...SL[4], ...big }, true, "gelap di latar terang"], [{ ...SL[4], ...big, bg: "#1F3A4A", ink: "#FFFFFF", accent: "#F2B134" }, true, "terang di latar gelap"]];
      v.forEach(([sp, ok, s], i) => { if (l < a * [0.05, 0.45, 0.65][i]) return; const x = 210 + i * 510; D.slide(ctx, x, 290, 480, 270, sp);
        ctx.strokeStyle = ok ? GREEN : RED; ctx.lineWidth = 5; ctx.strokeRect(x - 5, 285, 490, 280); thumbMark(ctx, x + 240, 630, ok, s); });
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 300, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 262, 22, 76, 6); ctx.fill(); rr(ctx, 340, 262, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 280, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 330, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 420 + i * 110, 820, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 476 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 476 + i * 110, 28, { weight: 700, fit: 710 }); });
      card(ctx, 1110, 400, 580, 380, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Hasil yang dituju", 1140, 442, 24, { weight: 900, color: C.ink2 });
      D.slide(ctx, 1140, 470, 520, 293, SL[1]);
    },
    padat(ctx, b, l) {
      const a = b.audio || b.dur; const g = app(ctx, { slides: [SL[0], DENSE], cur: 1, size: 14 });
      if (l > a * 0.15) L.callout(ctx, PX, 170, "Banyak kalimat panjang", g.stage.x + g.stage.w - 40, g.stage.y + 200, { color: RED, fill: "#FDF1F0" });
      if (l > a * 0.45) L.callout(ctx, PX, 290, "Huruf 14 pt", g.tool("size").x + 70, g.tool("size").cy, { color: RED, fill: "#FDF1F0" });
      if (l > a * 0.65) L.callout(ctx, PX, 410, "Empat warna sekaligus", g.stage.x + g.stage.w - 60, g.stage.y + 330, { color: RED, fill: "#FDF1F0" });
    },
    belakang(ctx, b, l) {
      const a = b.audio || b.dur; const z = 1 + 0.06 * ease(clamp(l / a, 0, 1));
      ctx.save(); ctx.translate(960, 470); ctx.scale(z, z); ctx.translate(-960, -470); room(ctx, 160, 130, 1600, 700, DENSE, { sw: 560, blur: 1.9 }); ctx.restore();
      card(ctx, 190, 150, 430, 64, { fill: "#FFFFFF", r: 14 }); text(ctx, "Dari bangku paling belakang", 405, 192, 26, { align: "center", weight: 800 });
      if (l > a * 0.5) L.callout(ctx, 1330, 170, "Tidak terbaca!", 1220, 250, { color: RED, fill: "#FDF1F0" });
    },
    perbaikan(ctx, b, l) {
      const a = b.audio || b.dur; card(ctx, 160, 140, 1600, 680);
      text(ctx, "PERBAIKAN SLIDE PADAT", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      D.slide(ctx, 200, 250, 500, 281, { ...DENSE, marks: l > a * 0.1 ? [1, 3, 4, 6] : [] }); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.strokeRect(196, 246, 508, 289); thumbMark(ctx, 450, 580, false, "sebelum");
      // kata kunci disorot
      if (l > a * 0.3) { H.arrowIcon(ctx, "east", 780, 400, 70, C.accentDark); D.slide(ctx, 860, 250, 420, 236, SL[1]); D.slide(ctx, 860, 506, 420, 236, SL[2]);
        ctx.strokeStyle = GREEN; ctx.lineWidth = 4; ctx.strokeRect(856, 246, 428, 500); thumbMark(ctx, 1070, 790, true, "sesudah: dua slide"); }
      const items = ["Ambil kata kuncinya.", "Pecah jadi dua slide.", "Huruf 28 pt.", "Satu warna untuk teks.", "Satu gambar."];
      const n = Math.floor(clamp((l - a * 0.12) / (a * 0.72), 0, 1) * 5.01);
      D.steps(ctx, 1320, 250, 400, "LANGKAH", items, n);
    },
    belakang_rapi(ctx, b, l) {
      room(ctx, 160, 130, 1600, 700, SL[1], { sw: 560, blur: 1.2 });
      card(ctx, 190, 150, 430, 64, { fill: "#FFFFFF", r: 14 }); text(ctx, "Dari bangku paling belakang", 405, 192, 26, { align: "center", weight: 800 });
      if (l > (b.audio || b.dur) * 0.3) L.callout(ctx, 1330, 170, "Terbaca jelas", 1220, 250, { color: GREEN, fill: C.goodBg });
    },
    susun(ctx, b, l) {
      const a = b.audio || b.dur; const cur = clamp(Math.floor(l / (a * 0.9) * 6), 0, 5);
      const g = app(ctx, { slides: SL, cur, size: 28 });
      D.steps(ctx, PX, 122, PW, "ENAM SLIDE", ["Judul", "Sandi yang kuat", "Cari dengan jitu", "Sopan di grup kelas", "Ingat tiga hal", "Terima kasih"], cur);
      ptr(ctx, { x: g.thumbs[cur].x + 120, y: g.thumbs[cur].y + 60, click: (l / (a * 0.9) * 6) % 1 < 0.35 ? ((l / (a * 0.9) * 6) % 1) / 0.35 : 0 });
    },
    tampil(ctx, b, l) {
      const a = b.audio || b.dur, t1 = a * 0.22;
      if (l < t1) { const g = app(ctx, { slides: SL, cur: 0, hot: "play" }); const pb = g.tool("play");
        ptr(ctx, D.path(l, t1, [{ x: pb.cx, y: pb.cy, d: 1, click: true }], { x: 900, y: 600 })); steps(ctx, ["Klik ▶ Tampilkan."], 0); return; }
      const u = (l - t1) / (a * 0.95 - t1); const k = clamp(Math.floor(u * 4), 0, 3);
      ctx.fillStyle = "#11171C"; ctx.fillRect(0, 0, 1920, 1080);
      D.slide(ctx, 280, 40, 1360, 765, SL[Math.min(k, 3)], { lw: 0 });
      const ph = (u * 4) % 1;
      if (k < 3 && u < 0.99) keys(ctx, "→", ph, 140, 420); else keys(ctx, "Esc", clamp((u - 0.75) * 4, 0, 1), 140, 420);
      text(ctx, k < 3 ? "maju" : "keluar", 140, 520, 26, { align: "center", weight: 700, color: "#C9D4DB" });
    },
    uji(ctx, b, l) {
      const a = b.audio || b.dur; room(ctx, 110, 122, 1300, 700, SL[4], { sw: 480, blur: 0.8 });
      card(ctx, 140, 142, 430, 64, { fill: "#FFFFFF", r: 14 }); text(ctx, "Dari bangku paling belakang", 355, 184, 26, { align: "center", weight: 800 });
      const n = Math.floor(clamp((l - a * 0.25) / (a * 0.6), 0, 1) * 4.01);
      D.steps(ctx, PX, 122, PW, "UJI DARI BELAKANG", ["Semua tulisan terbaca.", "Satu ide per slide.", "Warna kontras.", "Gambar mendukung isi."], n);
      kiko(ctx, 1640, 720, 90, 0, { wave: l });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D7.8", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "kerangka slide untuk timmu", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d78", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "satu ide per slide", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Isi kerangka slide timmu, buat enam slidenya, lalu uji dari bangku paling belakang.", 1310, 420, 30, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
