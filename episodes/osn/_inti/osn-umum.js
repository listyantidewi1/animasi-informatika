/* Adegan umum seri OSN-K (dipakai mulai ON03). Isi diambil dari kunci naskah:
   osn.sumber [{tahun, nomor:[..], judul}], coba {soal: [baris1, baris2]}, kredit [[judul, keterangan], ...], berikut "judul episode berikutnya",
   alur [[judul, keterangan] x3], kunci [[label, judul, jawaban] ...] untuk adegan skor.
   Pembantu tambahan di Kiko.U: fadeIn, bigNote, note, heading. */
(function () {
  const { C } = Kiko; const H = Kiko.helpers;
  const { rr, text, para, panel, label, chip, arrow, clamp, ap, at, speechEnd } = H;
  function fadeIn(ctx, u, fn) { if (u <= 0) return; ctx.save(); ctx.globalAlpha *= Math.min(1, u); fn(); ctx.restore(); }
  function bigNote(ctx, s, x, y, size, u, o = {}) { fadeIn(ctx, u, () => text(ctx, s, x, y + (1 - u) * 14, size, { disp: true, weight: 800, align: o.align || "center", color: o.color || C.ink, fit: o.fit })); }
  function note(ctx, s, x, y, size, u, o = {}) { fadeIn(ctx, u, () => text(ctx, s, x, y, size, { weight: o.weight || 700, align: o.align || "center", color: o.color || C.ink, mono: o.mono, fit: o.fit })); }
  function heading(ctx, small, big, u = 1, y = 170) {
    fadeIn(ctx, u, () => { label(ctx, small, 960, y, { align: "center" }); text(ctx, big, 960, y + 78, 64, { disp: true, weight: 800, align: "center", fit: 1700 }); });
  }
  Kiko.U = { fadeIn, bigNote, note, heading };

  Object.assign(Kiko.SCENES, {
    tahap(ctx, b, l) {
      const tAd = at(b, "adalah"), tK = at(b, "kabupaten"), tB = at(b, "babak"), tP = at(b, "provinsi"), tN = at(b, "nasional", 2);
      fadeIn(ctx, clamp((tAd - l) / 0.4, 0, 1), () => { text(ctx, "Selamat datang di", 960, 400, 40, { weight: 700, align: "center", color: C.mut }); text(ctx, "Bedah Soal OSN-K Informatika", 960, 500, 80, { disp: true, weight: 800, align: "center", fit: 1700 }); });
      heading(ctx, "// TAHAP OLIMPIADE SAINS NASIONAL", "OSN-K = tingkat kabupaten/kota", ap(l, tAd), 170);
      [["OSN-K", "Kabupaten/Kota", tK], ["OSN-P", "Provinsi", tP], ["OSN", "Nasional", tN]].forEach(([a, s, t0], i) => {
        const x = 480 + i * 480, u = ap(l, t0 - 0.3); if (u <= 0) return;
        fadeIn(ctx, u, () => {
          const first = i === 0;
          panel(ctx, x - 190, 330, 380, 260, { stroke: first ? C.green : C.line, lw: first ? 5 : 2, fill: first ? "#F1F6EC" : C.panel });
          text(ctx, a, x, 450, 72, { mono: true, weight: 800, align: "center", color: first ? C.green : C.ink });
          text(ctx, s, x, 530, 34, { weight: 700, align: "center", color: C.mut });
          if (i < 2) arrow(ctx, x + 200, 460, x + 280, 460, { color: C.mut, u: ap(l, t0 + 0.2) });
        });
      });
      fadeIn(ctx, ap(l, tB - 0.2), () => chip(ctx, "BABAK PERTAMA", 480, 620, { size: 26, color: C.white, fill: C.red, stroke: C.red, center: true }));
    },
    sumber(ctx, b, l, t, TL) {
      const o = TL.osn, src = o.sumber || [{ tahun: o.tahun, nomor: [o.nomor], judul: o.judul }];
      const tN = at(b, "nomor"), tJ = at(b, "jenjang"), tT = at(b, "Tim");
      heading(ctx, "// SUMBER SOAL", src.length > 1 ? "Soal dari dua tahun" : "“" + src[0].judul + "”", 1, 160);
      const w = src.length > 1 ? 860 : 1100;
      src.forEach((s, k) => {
        const x = src.length > 1 ? 200 + k * 920 : 410;
        fadeIn(ctx, ap(l, 0.3 + k * 0.5), () => {
          panel(ctx, x, 300, w, 300, {}); text(ctx, "OSN-K Informatika " + s.tahun, x + 40, 370, 40, { disp: true, weight: 800 });
          let cx = x + 40; s.nomor.forEach((n, i) => { const u = ap(l, tN + i * 0.4); const ww = chip(ctx, "No. " + n, cx, 420, { size: 40, color: C.red, stroke: C.red, lw: 3, alpha: Math.max(0.001, u) }); cx += ww + 20; });
          fadeIn(ctx, ap(l, tJ - 0.3), () => text(ctx, "Jenjang SMA · Tingkat Kabupaten/Kota", x + 40, 565, 30, { weight: 700, color: C.mut }));
        });
      });
      fadeIn(ctx, ap(l, tT - 0.3), () => text(ctx, "Penyusun: Tim Olimpiade Komputer Indonesia (TOKI)", 960, 690, 36, { weight: 800, align: "center", color: C.green }));
    },
    alur(ctx, b, l, t, TL) {
      const S = TL.alur || [["Pahami soal", "baca aturannya pelan-pelan"], ["Coba dulu", "pause, kerjakan sendiri"], ["Bahas bersama", "langkah demi langkah"]];
      const T = TL.alurKeys ? TL.alurKeys.map(([w, n]) => at(b, w, n || 1)) : [0.4, Math.max(1.2, speechEnd(b) * 0.4), Math.max(2, speechEnd(b) * 0.7)];
      heading(ctx, "// CARA KITA BELAJAR", TL.alurJudul || "Setiap soal, tiga langkah", 1, 170);
      S.forEach(([a, s], i) => {
        const x = 420 + i * 540, u = ap(l, T[i]); if (u <= 0) return;
        fadeIn(ctx, u, () => {
          panel(ctx, x - 230, 300, 460, 340, { stroke: i === 1 ? C.red : C.line, lw: i === 1 ? 4 : 2 });
          ctx.beginPath(); ctx.arc(x, 390, 50, 0, Math.PI * 2); ctx.fillStyle = i === 1 ? C.red : C.green; ctx.fill();
          text(ctx, String(i + 1), x, 412, 56, { mono: true, weight: 800, align: "center", color: C.white });
          text(ctx, a, x, 520, 48, { disp: true, weight: 800, align: "center", fit: 420 });
          text(ctx, s, x, 585, 28, { weight: 600, align: "center", color: C.mut, fit: 420 });
          if (i < 2) arrow(ctx, x + 240, 470, x + 300, 470, { color: C.mut });
        });
      });
    },
    coba(ctx, b, l, t, TL) {
      const tE = speechEnd(b) + 0.2, N = b.countdown || 8;
      text(ctx, "SOAL " + b.soal + " · PAUSE VIDEONYA", 960, 230, 32, { mono: true, weight: 700, color: C.red, align: "center", ls: 6 });
      text(ctx, "Bisakah kamu memecahkan ini?", 960, 360, 104, { disp: true, weight: 800, align: "center", fit: 1700 });
      const left = l < tE ? N : Math.max(0, N - (l - tE)); const s = Math.ceil(left - 1e-6);
      text(ctx, "00:" + String(s).padStart(2, "0"), 960, 590, 190, { mono: true, weight: 800, color: C.green, align: "center" });
      ctx.fillStyle = C.line; rr(ctx, 360, 670, 1200, 16, 8); ctx.fill();
      ctx.fillStyle = C.red; rr(ctx, 360, 670, 1200 * clamp((l - tE) / N, 0, 1), 16, 8); ctx.fill();
      const R = (TL.coba || {})[b.soal];
      if (R && l > tE - 0.2) fadeIn(ctx, ap(l, tE), () => {
        text(ctx, R[0], 960, 790, 30, { mono: true, weight: 600, color: C.mut, align: "center", fit: 1700 });
        text(ctx, R[1], 960, 860, 44, { weight: 800, align: "center", fit: 1700 });
      });
    },
    skor(ctx, b, l, t, TL) {
      const K = TL.kunci || []; const n = K.length; const w = Math.min(520, 1640 / n - 40);
      label(ctx, "// KUNCI JAWABAN", 960, 150, { align: "center" });
      K.forEach(([lab, jud, ans, key, kn], i) => {
        const x = 960 + (i - (n - 1) / 2) * (w + 40); const tA = key ? at(b, key, kn || 1) : 0.5 + i;
        panel(ctx, x - w / 2, 200, w, 380, { stroke: l > tA ? C.green : C.line, lw: l > tA ? 4 : 2 });
        text(ctx, lab, x, 252, 24, { mono: true, weight: 800, align: "center", color: C.green, ls: 2 });
        text(ctx, jud, x, 302, 30, { weight: 800, align: "center", fit: w - 40 });
        fadeIn(ctx, ap(l, tA - 0.1), () => text(ctx, ans, x, 480, ans.length > 8 ? 34 : 80, { mono: true, weight: 800, align: "center", color: C.red, fit: w - 30 }));
      });
    },
    kredit(ctx, b, l, t, TL) {
      const tT = at(b, "Terima"); const R = TL.kredit || [];
      fadeIn(ctx, ap(l, 0.2), () => {
        panel(ctx, 260, 120, 1400, 660, {}); label(ctx, "// KREDIT SOAL", 320, 190);
        R.forEach(([j, s], i) => fadeIn(ctx, ap(l, 0.3 + i * 0.3), () => {
          if (R.length === 1) { text(ctx, j, 320, 300, 76, { disp: true, weight: 800, fit: 1280 }); text(ctx, s, 320, 380, 34, { weight: 700, fit: 1280 }); }
          else { text(ctx, j, 320, 270 + i * 80, 40, { disp: true, weight: 800, fit: 640 }); text(ctx, s, 1000, 268 + i * 80, 28, { mono: true, weight: 600, color: C.mut, fit: 620 }); }
        }));
        text(ctx, "Tingkat Kabupaten/Kota", 320, R.length === 1 ? 440 : 590, 30, { weight: 600, color: C.mut });
      });
      fadeIn(ctx, ap(l, tT - 0.2), () => {
        text(ctx, "Penyusun: Tim Olimpiade Komputer Indonesia (TOKI)", 320, 660, 36, { weight: 800, color: C.green, fit: 1300 });
        text(ctx, "Naskah soal: osn.toki.id  ·  Gambar soal digambar ulang untuk video ini.", 320, 725, 26, { weight: 600, color: C.mut, fit: 1300 });
      });
    },
    akhir(ctx, b, l, t, TL) {
      const tK = at(b, "komentar"), tJ = at(b, "Sampai");
      fadeIn(ctx, ap(l, 0.3), () => {
        text(ctx, "BERLATIH SOAL LAIN", 960, 180, 30, { mono: true, weight: 700, align: "center", color: C.green, ls: 4 });
        chip(ctx, "tlx.toki.id", 960, 215, { size: 72, color: C.ink, stroke: C.green, lw: 4, center: true, px: 40, py: 20 });
      });
      if (TL.ajakan) fadeIn(ctx, ap(l, tK - 0.5), () => text(ctx, TL.ajakan, 960, 420, 40, { weight: 800, align: "center", color: C.red, fit: 1600 }));
      fadeIn(ctx, ap(l, tJ - 0.3), () => {
        panel(ctx, 460, 480, 1000, 250, { stroke: C.line });
        label(ctx, TL.berikutLabel || "// BERIKUTNYA DI SERI INI", 960, 545, { align: "center" });
        para(ctx, TL.berikut || "Soal OSN-K berikutnya", 960, 625, 52, 900, { disp: true, weight: 800, align: "center", lh: 1.15 });
      });
    }
  });
})();
