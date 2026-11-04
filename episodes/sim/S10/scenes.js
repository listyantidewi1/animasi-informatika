/* S10 Simulasi praktik: membaca lateral dan pencarian gambar terbalik di browser generik.
   Jendela browser di kiri (x 110–1410, y 122–822), panel kanan (x 1450–1820) untuk langkah dan catatan.
   Semua akun, situs, dan kabar rekaan (.example). Memakai layar.js + layar_web.js + gambar.js (Kiko.s10). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, W = K.web, G = K.s10;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";
  const PX = 1450, PW = 370;
  const A = b => b.audio || b.dur;
  const inShort = ctx => !!(ctx.canvas && ctx.canvas.isConnected === false);
  const callout = (ctx, x, y, s, tx, ty, o) => L.callout(ctx, x, y, s, inShort(ctx) ? null : tx, inShort(ctx) ? null : ty, o);
  const fade = (l, t0, d = 0.4) => ease(clamp((l - t0) / d, 0, 1));

  // ---------- tab dan halaman ----------
  const T = {
    feed: { title: "Linimasa", icon: "user" },
    site: { title: "Banjir Setinggi Pinggang…", icon: "home" },
    situs: { title: "kabarkilat.example - Cari" },
    klaim: { title: "banjir Jalan Melati - Cari" },
    gambar: { title: "Hasil gambar - Cari" },
    baru: { title: "Tab baru" },
    cari: { title: "Cari" }
  };
  function browser(ctx, opt) { return W.browser(ctx, WIN.x, WIN.y, WIN.w, WIN.h, opt); }
  function probeBrowser(ctx, opt) { ctx.save(); ctx.globalAlpha = 0; const g = browser(ctx, opt); ctx.restore(); return g; }
  const R = {
    self: { title: "Kabar Kilat: Portal Berita Paling Terpercaya", url: "kabarkilat.example", snippet: "Berita *viral* tercepat setiap hari. Ikuti kami supaya tidak ketinggalan kabar." },
    cek: { title: "Cek Fakta: Kabar Kilat Sering Memakai Foto Lama", url: "cekfakta.example › kabar-kilat", date: "21 Okt 2026", snippet: "Kami menemukan tujuh unggahan *Kabar Kilat* yang memakai foto dari kejadian bertahun-tahun lalu." },
    dir: { title: "kabarkilat.example: Info Pemilik Situs", url: "direktorisitus.example › kabarkilat", snippet: "Situs didaftarkan *tiga minggu lalu*. Tidak ada nama redaksi, alamat kantor, atau kontak." },
    kilat: { title: "Banjir Setinggi Pinggang di Jalan Melati, Sekolah Diliburkan!", url: "kabarkilat.example › viral", date: "4 Nov 2026", snippet: "VIRAL!!! Pagi ini *Jalan Melati* terendam *banjir* setinggi pinggang." },
    heboh: { title: "Banjir Lagi? Sekolah Libur Semua!", url: "infoheboh.example › heboh", date: "4 Nov 2026", snippet: "Warganet ramai membagikan foto *banjir* di *Jalan Melati*. Benarkah?" },
    koran: { title: "Jalan Melati Pagi Ini Kering, Foto Banjir yang Beredar Keliru", url: "korancontoh.example › kota", date: "4 Nov 2026", snippet: "Wartawan kami mendatangi *Jalan Melati* pukul tujuh pagi. Jalan kering dan warga beraktivitas seperti biasa." },
    disdik: { title: "Dinas Pendidikan: Sekolah Tetap Masuk Seperti Biasa", url: "disdik.kotacontoh.example › info", date: "4 Nov 2026", snippet: "Tidak ada libur sekolah hari ini. Kabar libur karena *banjir* di media sosial tidak benar." },
    radio: { title: "Cuaca Kota Contoh Cerah Berawan Sepanjang Pagi", url: "radiocontoh.example › cuaca", date: "4 Nov 2026", snippet: "Tidak ada hujan lebat sejak kemarin malam di seluruh Kota Contoh." }
  };
  const RES_SITUS = [R.self, R.cek, R.dir], RES_SEMUA = [R.kilat, R.koran, R.heboh], RES_BERITA = [R.koran, R.disdik, R.radio];

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
  const stepAt = (l, span, marks) => { let n = 0; marks.forEach((m, i) => { if (l >= m * span) n = i + 1; }); return n; };
  // catatan bertanda: items [[teks, "bad"|"good"]], n = jumlah yang sudah tampil
  function notes(ctx, title, items, n, y0, o = {}) {
    const x = o.x || PX, y = y0 || WIN.y, w = o.w || PW; let hh = 74;
    const rows = items.map(([s]) => H.wrap(ctx, s, 23, 700, w - 90)); rows.forEach(lines => hh += lines.length * 30 + 30);
    card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: o.stroke || "#D7E2DC", lw: 3, r: 18 });
    text(ctx, title, x + 24, y + 46, 24, { weight: 900, color: C.accentDark, fit: w - 40 });
    let yy = y + 76;
    rows.forEach((lines, i) => {
      const kind = items[i][1], col = kind === "good" ? GREEN : RED, bg = kind === "good" ? C.goodBg : C.badBg;
      const u = clamp(n - i, 0, 1); if (u <= 0) { yy += lines.length * 30 + 30; return; }
      ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = bg; rr(ctx, x + 12, yy - 6, w - 24, lines.length * 30 + 20, 10); ctx.fill();
      text(ctx, kind === "good" ? "✓" : "✗", x + 38, yy + 22, 26, { align: "center", weight: 900, color: col });
      lines.forEach((ln, j) => text(ctx, ln, x + 64, yy + 22 + j * 30, 23, { weight: 700, color: C.ink }));
      ctx.restore(); yy += lines.length * 30 + 30;
    });
    return y + hh;
  }

  // ---------- adegan bersama ----------
  // halaman hasil pencarian di tab baru
  function searchTab(ctx, tabs, tab, url, st) {
    const bg = browser(ctx, { tabs, tab, url });
    const g = W.searchPage(ctx, bg, { engine: "Cari", ...st }); g.browser = bg; return g;
  }
  // posisi tab "Berita" di halaman hasil (sama dengan perhitungan layar_web.js)
  function tabX(ctx, bg, k, active) {
    let px = bg.x + 150 + 6; const names = ["Semua", "Gambar", "Berita", "Video"];
    for (let i = 0; i < k; i++) px += G.meas(ctx, names[i], 20, i === active ? 800 : 600) + 34;
    return px + G.meas(ctx, names[k], 20, k === active ? 800 : 600) / 2;
  }
  function stopSign(ctx, cx, cy, r) {
    ctx.fillStyle = RED; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * 0.07; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; ctx.lineTo(cx + r * 0.88 * Math.cos(a), cy + r * 0.88 * Math.sin(a)); } ctx.closePath(); ctx.stroke();
    text(ctx, "STOP", cx, cy + r * 0.2, r * 0.52, { align: "center", weight: 900, color: "#FFFFFF" });
  }
  function clock(ctx, cx, cy, r, mins, color) {
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = color + "33"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r - 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * mins / 60); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); const a = -Math.PI / 2 + Math.PI * 2 * mins / 60; ctx.lineTo(cx + (r - 14) * Math.cos(a), cy + (r - 14) * Math.sin(a)); ctx.stroke();
  }
  function miniPage(ctx, x, y, w, h, o = {}) {
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.strokeStyle = o.stroke || "#C9D4DB"; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 12); ctx.stroke();
    ctx.save(); rr(ctx, x, y, w, h, 12); ctx.clip(); ctx.fillStyle = o.head || "#3D5361"; ctx.fillRect(x, y, w, 34); ctx.restore();
    if (o.label) text(ctx, o.label, x + 14, y + 24, 17, { weight: 800, color: "#FFFFFF", fit: w - 24 });
    const n = o.lines || Math.floor((h - 60) / 22);
    for (let i = 0; i < n; i++) { ctx.fillStyle = "#DCE3E8"; rr(ctx, x + 14, y + 50 + i * 22, (w - 28) * (i % 4 === 3 ? 0.55 : 0.9 - (i % 3) * 0.08), 10, 5); ctx.fill(); }
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      const u1 = fade(l, 0.4, 0.5), u2 = fade(l, A(b) * 0.5, 0.5);
      ctx.save(); ctx.globalAlpha = u1; card(ctx, 240, 280, 690, 470, { fill: C.bg2, r: 22 });
      text(ctx, "1. Membaca lateral", 585, 340, 36, { align: "center", weight: 900, color: C.kikoDark });
      miniPage(ctx, 290, 390, 200, 250, { label: "kabarkilat…", head: "#B8433A" });
      ["Periksa fakta", "Berita lain", "Info situs"].forEach((s, i) => { const yy = 380 + i * 96; ctx.strokeStyle = C.kiko; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500, 515); ctx.lineTo(600, yy + 38); ctx.stroke();
        card(ctx, 610, yy, 280, 76, { fill: "#FFFFFF", r: 14 }); W.icon(ctx, "search", 644, yy + 38, 24, BLUE); text(ctx, s, 670, yy + 46, 24, { weight: 800 }); });
      text(ctx, "tab baru: tanya sumber lain", 585, 712, 26, { align: "center", weight: 700, color: C.ink2 });
      ctx.restore();
      ctx.save(); ctx.globalAlpha = u2; card(ctx, 990, 280, 690, 470, { fill: C.bg2, r: 22 });
      text(ctx, "2. Pencarian gambar terbalik", 1335, 340, 34, { align: "center", weight: 900, color: C.kikoDark });
      G.photo(ctx, 1030, 400, 240, 150, { r: 10 });
      ctx.strokeStyle = C.kiko; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1285, 475); ctx.lineTo(1345, 475); ctx.stroke(); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.moveTo(1360, 475); ctx.lineTo(1340, 462); ctx.lineTo(1340, 488); ctx.fill();
      [["4 Nov 2026", C.ink2], ["8 Jan 2024", C.ink2], ["14 Mar 2019", GREEN]].forEach(([d, c], i) => { card(ctx, 1375, 392 + i * 58, 270, 48, { fill: "#FFFFFF", r: 10 }); text(ctx, d, 1395, 425 + i * 58, 24, { weight: 800, color: c }); });
      text(ctx, "asal foto = tanggal paling lama", 1335, 712, 26, { align: "center", weight: 700, color: C.ink2 });
      ctx.restore();
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      [["D8.4", "Menilai Informasi dan Ekosistem Pers Digital", "empat pertanyaan menilai kabar"], ["E.4", "Mencari, Memeriksa, Membaca Lateral", "membaca lateral"], ["F11.4", "Riset Digital dan Verifikasi Konten", "jejak foto"]].forEach(([c, t, s], i) => {
        const x = 230 + i * 500; card(ctx, x, 290, 460, 300, { fill: C.bg2, r: 22 });
        text(ctx, c, x + 230, 370, 54, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 230, 430, 28, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 562, 24, { align: "center", weight: 600, color: C.ink2 });
      });
      if (l > A(b) * 0.55) { card(ctx, 380, 630, 1160, 70, { fill: "#FFF3D6", r: 14 }); text(ctx, "Semua akun, situs, dan kabar di video ini hanyalah contoh rekaan.", 960, 676, 28, { align: "center", weight: 800, color: C.accentDark }); }
      kiko(ctx, 1660, 730, 90, 0, { wave: l });
    },

    // ---------- 1. kabar viral ----------
    feed(ctx, b, l) {
      const a = A(b), on = k => l > a * k;
      const hl = [];
      if (on(0.25)) { hl.push([0, 0, 8, "rgba(217,68,59,0.28)"]); hl.push([1, 50, 51, "rgba(217,68,59,0.28)"]); }
      if (on(0.45)) hl.push([2, 0, 26, "rgba(217,68,59,0.28)"]);
      const bg = browser(ctx, { tabs: [T.feed], url: "linimasa.example/beranda" });
      const g = G.feed(ctx, bg, { hl });
      notes(ctx, "TANDA PERLU DIPERIKSA", [["Penuh tanda seru", "bad"], ["Menyuruh cepat membagikan", "bad"], ["Tidak menyebut siapa yang melihat", "bad"]],
        (on(0.25) ? 1 : 0) + (on(0.45) ? 1 : 0) + (on(0.66) ? 1 : 0));
      if (on(0.66)) { const sp = g.line(1); callout(ctx, sp.x + 150, g.photo.y + 40, "Siapa yang melihat? Tidak disebut.", sp.x + 260, sp.y + 26, { color: RED, fill: "#FBE1DF", size: 24 }); }
    },
    feed_stop(ctx, b, l) {
      const a = A(b), span = a * 0.9;
      const bg = browser(ctx, { tabs: [T.feed], url: "linimasa.example/beranda" });
      const g0 = (() => { ctx.save(); ctx.globalAlpha = 0; const r = G.feed(ctx, bg, {}); ctx.restore(); return r; })();
      const near = l > span * 0.3 && l < span * 0.62;
      const g = G.feed(ctx, bg, { shareHot: l > a * 0.08 });
      // panel: jumlah dibagikan + tanda berhenti
      card(ctx, PX, WIN.y, PW, 196, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "DIBAGIKAN", PX + 24, WIN.y + 42, 22, { weight: 900, color: C.accentDark });
      text(ctx, "12.000", PX + PW / 2, WIN.y + 122, 64, { align: "center", weight: 900, color: RED });
      text(ctx, "orang", PX + PW / 2, WIN.y + 166, 22, { align: "center", weight: 700, color: C.ink2 });
      if (l > a * 0.3) { const u = fade(l, a * 0.3); ctx.save(); ctx.globalAlpha = u;
        card(ctx, PX, WIN.y + 220, PW, 140, { fill: "#FBE1DF", r: 18 }); para(ctx, "Banyak yang membagikan bukan bukti.", PX + PW / 2, WIN.y + 278, 27, PW - 50, { align: "center", weight: 900, color: RED, lh: 1.25 }); ctx.restore(); }
      if (l > a * 0.55) { const u = fade(l, a * 0.55); ctx.save(); ctx.globalAlpha = u;
        card(ctx, PX, WIN.y + 384, PW, 316, { fill: "#FFFFFF", stroke: RED, lw: 4, r: 18 }); stopSign(ctx, PX + PW / 2, WIN.y + 494, 80);
        text(ctx, "Berhenti dulu,", PX + PW / 2, WIN.y + 624, 28, { align: "center", weight: 900 }); text(ctx, "lalu periksa.", PX + PW / 2, WIN.y + 662, 28, { align: "center", weight: 900 }); ctx.restore(); }
      const s = g0.share; const p = W.path(l, span, [{ x: 1000, y: 640, d: 0.3 }, { x: s.cx + 20, y: s.cy + 6, d: 1 }, { x: s.cx + 20, y: s.cy + 6, d: 1 }, { x: g0.link.cx + 160, y: g0.link.cy + 4, d: 1.2 }, { x: g0.link.cx + 160, y: g0.link.cy + 4, d: 1 }], { x: 1000, y: 640 });
      if (near) callout(ctx, s.x - 40, s.y - 92, "Tahan dulu!", null, null, { color: RED, fill: "#FFFFFF", size: 28 });
      L.cursor(ctx, p.x, p.y, {});
    },

    // ---------- 2. membaca lateral ----------
    situs(ctx, b, l) {
      const a = A(b), span = a * 0.9, S = W.seq(l, span, [0.3, 1, 0.5, 2.2, 1, 2.5]);
      const opened = S.at(2);
      const tabs = opened ? [T.feed, { title: "Kabar Kilat", icon: "home" }] : [T.feed];
      const bg = browser(ctx, { tabs, tab: opened ? 1 : 0, url: opened ? "kabarkilat.example/viral/banjir-jalan-melati" : "linimasa.example/beranda", loading: S.i === 2 ? S.u : 0 });
      let ptrTo = null, click = 0;
      if (!opened || (S.i === 2 && S.u < 0.3)) {
        const g = G.feed(ctx, bg, { linkHot: S.at(1) && S.p(1) > 0.5 });
        const p = W.path(l, span * 1.3 / 7.5, [{ x: g.link.cx + 160, y: g.link.cy + 4, d: 0.3 }, { x: g.link.cx + 40, y: g.link.cy + 4, d: 1, click: true }]); ptrTo = p; click = p.click;
      } else {
        const site = W.page(ctx, bg, { site: "KABAR KILAT", head: "#B8433A", nav: ["Beranda", "Viral", "Tentang Kami"], title: "Banjir Setinggi Pinggang di Jalan Melati, Sekolah Diliburkan!", meta: "Oleh Admin · 4 Nov 2026", body: [] });
        W.clip(ctx, bg, () => {
          G.photo(ctx, site.body.x, site.body.y, 400, 250, { r: 10 });
          for (let i = 0; i < 9; i++) { ctx.fillStyle = "#DCE3E8"; rr(ctx, site.body.x + 430, site.body.y + 8 + i * 28, 520 * (i % 4 === 3 ? 0.6 : 0.95 - (i % 3) * 0.06), 12, 6); ctx.fill(); }
        });
        const nw = G.meas(ctx, "Tentang Kami", 19, 700), nav = { x: bg.x + bg.w - 36 - nw, cx: bg.x + bg.w - 36 - nw / 2, cy: bg.y + 34 };
        const p = W.path(l - span * (0.3 + 1 + 0.5 + 2.2) / 7.5, span * 1 / 7.5, [{ x: nav.cx, y: nav.cy + 6, d: 1, click: true }], { x: bg.x + 700, y: bg.y + 330 });
        if (S.at(4)) { ptrTo = p; click = p.click; ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(nav.x - 10, bg.y + 14, nw + 20, 36); }
        if (S.at(5)) { const u = ease(S.p(5) / 0.2); ctx.save(); ctx.globalAlpha = u;
          const ox = bg.x + 560, oy = bg.y + 80; ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 24; ctx.fillStyle = "#FFFFFF"; rr(ctx, ox, oy, 700, 300, 16); ctx.fill(); ctx.restore();
          text(ctx, "Tentang Kami", ox + 36, oy + 62, 32, { weight: 900, color: W.UI.ink });
          const s1 = "Kabar Kilat adalah portal berita", s2 = "paling terpercaya dan paling cepat.";
          text(ctx, s1, ox + 36, oy + 124, 27, { weight: 600, color: W.UI.ink2 });
          if (S.p(5) > 0.35) { ctx.fillStyle = W.UI.mark; rr(ctx, ox + 30, oy + 140, G.meas(ctx, "paling terpercaya", 27, 800) + 12, 40, 6); ctx.fill(); }
          W.rich(ctx, "*paling terpercaya* dan *paling cepat*.", ox + 36, oy + 170, 27, 640, { color: W.UI.ink2 });
          text(ctx, "Semua berita kami 100% benar!", ox + 36, oy + 216, 27, { weight: 600, color: W.UI.ink2 });
          text(ctx, "Kontak: lewat pesan langsung saja.", ox + 36, oy + 262, 22, { weight: 600, color: W.UI.ink3 });
          ctx.restore();
          notes(ctx, "TENTANG KAMI", [["Ditulis oleh situs itu sendiri", "bad"], ["Tidak ada nama redaksi", "bad"]], S.p(5) > 0.3 ? 1 + (S.p(5) > 0.6 ? 1 : 0) : 0);
        }
      }
      if (ptrTo) L.cursor(ctx, ptrTo.x, ptrTo.y, { click });
    },
    vertikal(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      // vertikal
      card(ctx, 220, 180, 700, 600, { fill: "#FDF1F0", r: 20 });
      text(ctx, "MEMBACA VERTIKAL", 570, 236, 34, { align: "center", weight: 900, color: RED });
      miniPage(ctx, 420, 270, 230, 380, { label: "kabarkilat…", head: "#B8433A", lines: 14 });
      const u = ease(clamp(l / (a * 0.3), 0, 1));
      ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(700, 300); ctx.lineTo(700, 300 + 320 * u); ctx.stroke();
      ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(700, 640 * u + 300 * (1 - u) + 10); ctx.lineTo(684, 300 + 320 * u - 8); ctx.lineTo(716, 300 + 320 * u - 8); ctx.fill();
      text(ctx, "hanya membaca situs itu", 570, 702, 28, { align: "center", weight: 800 });
      text(ctx, "✗ situs pasti memuji dirinya", 570, 748, 26, { align: "center", weight: 800, color: RED });
      // lateral
      if (l > a * 0.48) {
        const v = fade(l, a * 0.48, 0.5); ctx.save(); ctx.globalAlpha = v;
        card(ctx, 1000, 180, 700, 600, { fill: "#F2FAF4", r: 20 });
        text(ctx, "MEMBACA LATERAL", 1350, 236, 34, { align: "center", weight: 900, color: GREEN });
        miniPage(ctx, 1040, 330, 200, 280, { label: "kabarkilat…", head: "#B8433A", lines: 10 });
        ["Periksa fakta", "Berita lain", "Info situs"].forEach((s, i) => { const w = ease(clamp((l - a * 0.6 - i * a * 0.08) / 0.4, 0, 1)), yy = 290 + i * 120;
          ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1250, 470); ctx.lineTo(lerp(1250, 1380, w), lerp(470, yy + 45, w)); ctx.stroke();
          if (w > 0.9) { card(ctx, 1390, yy, 280, 90, { fill: "#FFFFFF", r: 14, stroke: "#B9DEC5", lw: 3 }); text(ctx, "tab baru", 1414, yy + 32, 18, { weight: 800, color: C.ink2 }); W.icon(ctx, "search", 1424, yy + 62, 22, BLUE); text(ctx, s, 1448, yy + 70, 26, { weight: 800 }); } });
        text(ctx, "buka tab baru, tanya sumber lain", 1350, 702, 28, { align: "center", weight: 800 });
        text(ctx, "✓ cara pemeriksa fakta", 1350, 748, 26, { align: "center", weight: 800, color: GREEN });
        ctx.restore();
      }
    },
    tab_baru(ctx, b, l) {
      const a = A(b), span = a * 0.9, S = W.seq(l, span, [0.3, 1, 0.4, 2.2, 0.8, 1.6]);
      const q = "kabarkilat.example", added = S.at(2) || (S.i === 1 && S.u > 0.6), entered = S.at(4) && S.p(4) >= 0.45;
      const tabs0 = [T.feed, { title: "Kabar Kilat", icon: "home" }];
      const pb = probeBrowser(ctx, { tabs: tabs0, tab: 1 });
      let g;
      if (!added) { const bg = browser(ctx, { tabs: tabs0, tab: 1, url: "kabarkilat.example/viral/banjir-jalan-melati" }); W.page(ctx, bg, { site: "KABAR KILAT", head: "#B8433A", nav: ["Beranda", "Viral", "Tentang Kami"], title: "Banjir Setinggi Pinggang di Jalan Melati, Sekolah Diliburkan!", meta: "Oleh Admin · 4 Nov 2026", body: 6 }); }
      else if (!entered) { const bg = browser(ctx, { tabs: [...tabs0, T.baru], tab: 2, url: "" }); g = W.searchPage(ctx, bg, { home: true, query: W.typed(q, S.p(3) / 0.95), focus: true, caret: Math.floor(l * 2.4) % 2 === 0 }); }
      else { const since = (S.p(4) - 0.45) * span * 0.8 / 6.3 + S.p(5) * span * 1.6 / 6.3;
        g = searchTab(ctx, [...tabs0, T.situs], 2, "cari.example/search?q=kabarkilat.example", { query: q, count: "Sekitar 1.150 hasil (0,32 detik)", results: since < 0.3 ? [] : RES_SITUS.map(r => ({ ...r, alpha: ease((since - 0.3) / 0.4) })) });
        if (since < 0.5) { ctx.fillStyle = BLUE; ctx.fillRect(WIN.x, WIN.y + 105, WIN.w * since / 0.5, 3); } }
      steps(ctx, "LANGKAH", ["Klik tanda + di samping tab.", "Ketik nama situsnya.", "Tekan Enter."], S.i <= 1 ? 0 : S.i <= 3 ? 1 : S.n >= 5 ? 3 : 2);
      // pintasan keyboard
      card(ctx, PX, WIN.y + 350, PW, 170, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "atau tekan", PX + PW / 2, WIN.y + 396, 22, { align: "center", weight: 800, color: C.ink2 });
      L.keys(ctx, PX + PW / 2, WIN.y + 420, ["Ctrl", "T"], { press: S.i === 1 ? S.u : 0, align: "center", size: 28 });
      if (S.i === 4 && S.p(4) < 1) L.keys(ctx, PX + PW / 2, 700, ["Enter"], { press: S.p(4), align: "center", size: 30 });
      if (S.i <= 1) { const p = W.path(l, span * 1.3 / 6.3, [{ x: 900, y: 500, d: 0.3 }, { x: pb.newTab.cx + 4, y: pb.newTab.cy + 6, d: 1, click: true }], { x: 900, y: 500 }); L.cursor(ctx, p.x, p.y, { click: p.click }); }
    },
    hasil_situs(ctx, b, l) {
      const a = A(b), m = [null, l > a * 0.12 ? "good" : null, l > a * 0.5 ? "good" : null];
      const g = searchTab(ctx, [T.feed, { title: "Kabar Kilat", icon: "home" }, T.situs], 2, "cari.example/search?q=kabarkilat.example",
        { query: "kabarkilat.example", count: "Sekitar 1.150 hasil (0,32 detik)", results: RES_SITUS.map((r, i) => ({ ...r, mark: i === 0 ? (l > a * 0.1 ? "dim" : null) : m[i] })) });
      if (l > a * 0.2) notes(ctx, "SIAPA SUMBERNYA?", [["Sering memakai foto lama", "bad"], ["Baru dibuat tiga minggu lalu", "bad"], ["Tanpa nama redaksi", "bad"]], (l > a * 0.25 ? 1 : 0) + (l > a * 0.6 ? 1 : 0) + (l > a * 0.8 ? 1 : 0));
      if (l > a * 0.1 && l < a * 0.45) { const r0 = g.result(0); callout(ctx, r0.x + 520, r0.y + 52, "kata situs itu sendiri", null, null, { size: 22, fill: "#FFFFFF" }); }
    },
    hasil_klaim(ctx, b, l) {
      const a = A(b), span = a * 0.9, S = W.seq(l, span, [0.4, 0.7, 1.6, 0.6, 1, 4]);
      const q = "banjir Jalan Melati", tabs = [T.feed, { title: "Kabar Kilat", icon: "home" }, S.at(4) ? T.klaim : T.situs];
      const typing = S.at(2), entered = S.at(3) && S.p(3) >= 0.45, berita = S.at(5) || (S.i === 4 && S.u > 0.6);
      const st = !entered ? { query: typing ? W.typed(q, S.p(2) / 0.95) : (S.at(1) && S.p(1) > 0.6 ? "" : "kabarkilat.example"), focus: S.at(1) && S.p(1) > 0.6, caret: true, count: "Sekitar 1.150 hasil (0,32 detik)", results: RES_SITUS.map(r => ({ ...r, alpha: 0.35 })) }
        : !berita ? { query: q, count: "Sekitar 2.430 hasil (0,35 detik)", results: RES_SEMUA }
        : { query: q, tab: 2, count: "Sekitar 640 hasil (0,29 detik)", results: RES_BERITA.map((r, i) => ({ ...r, mark: (i === 0 && l > a * 0.55) || (i === 1 && l > a * 0.75) ? "good" : null })) };
      const g = searchTab(ctx, tabs, 2, "cari.example/search?q=" + (entered ? q.replace(/ /g, "+") : "kabarkilat.example"), st);
      if (l > a * 0.5) notes(ctx, "APA KATA SUMBER LAIN?", [["Koran Contoh: Jalan Melati kering", "good"], ["Dinas Pendidikan: sekolah tetap masuk", "good"]], (l > a * 0.58 ? 1 : 0) + (l > a * 0.78 ? 1 : 0));
      if (S.i === 3 && S.p(3) < 1) L.keys(ctx, PX + PW / 2, 700, ["Enter"], { press: S.p(3), align: "center", size: 30 });
      const bx = g.box, bt = { x: tabX(ctx, g.browser, 2, 0), y: g.tabsY - 6 };
      const p = W.path(l, span, [{ x: 900, y: 600, d: 0.4 }, { x: bx.x + 400, y: bx.cy + 4, d: 0.7, click: true }, { x: bx.x + 400, y: bx.cy + 30, d: 1.6 }, { x: bx.x + 400, y: bx.cy + 40, d: 0.6 }, { x: bt.x, y: bt.y + 4, d: 1, click: true }, { x: bt.x + 300, y: bt.y + 240, d: 4 }], { x: 900, y: 600 });
      if (S.i <= 4 || S.u < 0.3) L.cursor(ctx, p.x, p.y, { click: p.click, kind: S.i >= 1 && S.i <= 3 ? "text" : "arrow" });
    },

    // ---------- 3. klik kanan: cari gambar ----------
    klik_kanan(ctx, b, l) {
      const a = A(b), span = a * 0.82, S = W.seq(l, span, [0.3, 0.9, 0.3, 1.1, 0.4, 1.0, 0.5, 1.5]);
      const back = S.at(2), menuOpen = S.at(4) && !(S.i === 7 && S.p(7) > 0.15), opened = S.i === 7 && S.p(7) > 0.15;
      const tabs = [T.feed, { title: "Kabar Kilat", icon: "home" }, T.klaim, ...(opened ? [T.gambar] : [])];
      const tab = opened ? 3 : back ? 0 : 2;
      const pb = probeBrowser(ctx, { tabs: [T.feed, { title: "Kabar Kilat", icon: "home" }, T.klaim], tab: 2 });
      const bg = browser(ctx, { tabs, tab, url: opened ? "cari.example/gambar?src=linimasa.example" : back ? "linimasa.example/beranda" : "cari.example/search?q=banjir+Jalan+Melati", loading: opened ? clamp((S.p(7) - 0.15) / 0.3, 0, 1) : 0 });
      let g0 = null;
      if (opened) G.imagePage(ctx, bg, { alpha: clamp((S.p(7) - 0.3) / 0.5, 0, 1) });
      else if (back) g0 = G.feed(ctx, bg, { photoHot: S.at(3) && S.p(3) > 0.55 });
      else W.searchPage(ctx, bg, { engine: "Cari", query: "banjir Jalan Melati", tab: 2, count: "Sekitar 640 hasil (0,29 detik)", results: RES_BERITA });
      const ph = g0 ? g0.photo : { cx: 760, cy: 400 };
      const mx = ph.cx + 40, my = ph.cy - 60;
      let menu = null;
      if (menuOpen && g0) menu = G.ctxMenu(ctx, mx, my, { hi: S.at(5) && S.p(5) > 0.5 ? 5 : null });
      const t0 = pb.tab(0), it = { cx: mx + 160, cy: my + 6 + 4 * 46 + 14 + 23 };
      const p = W.path(l, span, [{ x: 900, y: 560, d: 0.3 }, { x: t0.cx, y: t0.cy + 6, d: 0.9, click: true }, { x: t0.cx, y: t0.cy + 6, d: 0.3 }, { x: ph.cx + 40, y: ph.cy - 60, d: 1.1, click: true }, { x: ph.cx + 40, y: ph.cy - 60, d: 0.4 }, { x: it.cx, y: it.cy + 4, d: 1.0 }, { x: it.cx, y: it.cy + 4, d: 0.5, click: true }, { x: it.cx + 40, y: it.cy + 40, d: 1.5 }], { x: 900, y: 560 });
      if (!opened) L.cursor(ctx, p.x, p.y, { click: p.click });
      steps(ctx, "LANGKAH", ["Klik tab Linimasa.", "Klik kanan fotonya.", "Pilih Cari gambar."], S.i <= 1 ? 0 : S.i <= 3 ? 1 : S.n >= 7 ? 3 : 2);
      // mouse dengan tombol kanan menyala
      const mxp = PX + 110, myp = WIN.y + 360, hot = S.i === 3 && S.p(3) > 0.55;
      card(ctx, PX, WIN.y + 330, PW, 210, { fill: "#FFFFFF", stroke: hot ? C.accent : "#D7E2DC", lw: 3, r: 18 });
      ctx.fillStyle = "#EEF2F5"; rr(ctx, mxp - 50, myp, 100, 150, 50); ctx.fill(); ctx.strokeStyle = "#8A99A3"; ctx.lineWidth = 3; rr(ctx, mxp - 50, myp, 100, 150, 50); ctx.stroke();
      ctx.fillStyle = hot || S.i >= 3 ? C.accent : "#D5DEE4"; ctx.beginPath(); ctx.moveTo(mxp + 2, myp + 3); ctx.lineTo(mxp + 2, myp + 62); ctx.lineTo(mxp + 47, myp + 62); ctx.arcTo(mxp + 47, myp + 3, mxp + 2, myp + 3, 44); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#8A99A3"; ctx.beginPath(); ctx.moveTo(mxp, myp); ctx.lineTo(mxp, myp + 62); ctx.moveTo(mxp - 50, myp + 62); ctx.lineTo(mxp + 50, myp + 62); ctx.stroke();
      text(ctx, "klik", PX + 260, WIN.y + 430, 30, { align: "center", weight: 900 }); text(ctx, "kanan", PX + 260, WIN.y + 468, 30, { align: "center", weight: 900 });
      card(ctx, PX, WIN.y + 560, PW, 140, { fill: "#FFF3D6", r: 18 });
      para(ctx, "Di browser lain, menu ini bernama Telusuri gambar.", PX + 24, WIN.y + 604, 23, PW - 48, { weight: 700, lh: 1.3 });
    },
    hasil_gambar(ctx, b, l) {
      const a = A(b), tabs = [T.feed, { title: "Kabar Kilat", icon: "home" }, T.klaim, T.gambar];
      const bg = browser(ctx, { tabs, tab: 3, url: "cari.example/gambar?src=linimasa.example" });
      const g = G.imagePage(ctx, bg, { alpha: clamp(0.4 + l / 1.2, 0, 1), dateMark: l > a * 0.72 ? [0, 1, 2, 3] : [] });
      if (l > a * 0.12 && l < a * 0.6) { const q = g.query; ctx.strokeStyle = C.accent; ctx.lineWidth = 6; rr(ctx, q.x - 6, q.y - 6, q.w + 12, q.h + 12, 14); ctx.stroke(); }
      card(ctx, PX, WIN.y, PW, 576, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "MENCARI DENGAN", PX + 24, WIN.y + 46, 24, { weight: 900, color: C.accentDark });
      ctx.fillStyle = "#EEF2F5"; rr(ctx, PX + 24, WIN.y + 70, PW - 48, 64, 12); ctx.fill(); text(ctx, "kata", PX + 50, WIN.y + 112, 26, { weight: 800, color: C.ink2 });
      text(ctx, "→ halaman berisi kata", PX + 116, WIN.y + 112, 22, { weight: 700, color: C.ink2, fit: PW - 150 });
      const u = fade(l, a * 0.25);
      ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = "#FFF3D6"; rr(ctx, PX + 24, WIN.y + 150, PW - 48, 400, 12); ctx.fill();
      text(ctx, "gambar", PX + 46, WIN.y + 196, 28, { weight: 900, color: C.accentDark });
      G.photo(ctx, PX + 46, WIN.y + 214, 130, 82, { r: 8 });
      text(ctx, "↓", PX + 111, WIN.y + 340, 36, { align: "center", weight: 900, color: C.accentDark });
      para(ctx, "halaman lain yang memuat foto yang sama", PX + 46, WIN.y + 390, 23, PW - 92, { weight: 800, lh: 1.25 });
      if (l > a * 0.72) para(ctx, "+ tanggalnya", PX + 46, WIN.y + 500, 26, PW - 92, { weight: 900, color: C.accentDark });
      ctx.restore();
    },
    foto_lama(ctx, b, l) {
      const a = A(b), span = a * 0.85, S = W.seq(l, span, [0.3, 0.8, 0.8, 0.8, 0.8, 0.6, 2.6]);
      const tabs = [T.feed, { title: "Kabar Kilat", icon: "home" }, T.klaim, T.gambar];
      const bg = browser(ctx, { tabs, tab: 3, url: "cari.example/gambar?src=linimasa.example" });
      const seen = [0, 1, 2, 3].filter(k => S.at(k + 1) && S.p(k + 1) > 0.5), found = S.at(5);
      const g = G.imagePage(ctx, bg, { dateMark: seen, good: found ? 3 : null, badge: found ? { i: 3, s: "PALING LAMA" } : null });
      const pts = [0, 1, 2, 3].map(k => { const d = g.page(k).date; return { x: d.x + d.w + 26, y: d.cy + 8, d: 0.8 }; });
      const p = W.path(l, span, [{ x: 900, y: 360, d: 0.3 }, ...pts, { x: pts[3].x, y: pts[3].y, d: 0.6 }, { x: pts[3].x + 260, y: pts[3].y + 70, d: 2.6 }], { x: 900, y: 360 });
      L.cursor(ctx, p.x, p.y, {});
      // panel: tanggal berurutan
      card(ctx, PX, WIN.y, PW, 360, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "BACA TANGGALNYA", PX + 24, WIN.y + 46, 24, { weight: 900, color: C.accentDark });
      G.PAGES.forEach((pg, k) => { const y = WIN.y + 76 + k * 68, on = seen.includes(k); if (!on) return; const old = k === 3 && found;
        ctx.fillStyle = old ? C.goodBg : "#F4F6F5"; rr(ctx, PX + 16, y, PW - 32, 56, 10); ctx.fill();
        text(ctx, pg.date, PX + 34, y + 37, 25, { weight: 900, color: old ? GREEN : C.ink }); text(ctx, pg.url.replace(".example", ""), PX + PW - 30, y + 36, 19, { align: "right", weight: 700, color: C.ink2 }); });
      if (found) { const u = fade(l, span * 5.1 / 7.7, 0.5); ctx.save(); ctx.globalAlpha = u;
        card(ctx, PX, WIN.y + 384, PW, 316, { fill: C.goodBg, r: 18 });
        text(ctx, "ASAL FOTO", PX + 24, WIN.y + 430, 24, { weight: 900, color: GREEN });
        text(ctx, "Arsip Foto", PX + 24, WIN.y + 480, 30, { weight: 900 }); text(ctx, "14 Maret 2019", PX + 24, WIN.y + 524, 30, { weight: 900 });
        para(ctx, "Keterangan: banjir di Kota Damai", PX + 24, WIN.y + 580, 25, PW - 48, { weight: 700, lh: 1.3 }); ctx.restore(); }
    },
    bandingkan(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "FOTO YANG SAMA, CERITA YANG BERBEDA", 960, 210, 34, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 220, 250, 680, 470, { fill: "#FDF1F0", stroke: RED, lw: 4, r: 20 });
      G.avatar(ctx, 262, 296, 22, "kilat"); text(ctx, "Kabar Kilat · 4 Nov 2026", 296, 305, 26, { weight: 800 });
      G.photo(ctx, 260, 330, 600, 300, { r: 12 });
      text(ctx, "“Pagi ini, Jalan Melati…”", 560, 684, 30, { align: "center", weight: 900, color: RED });
      if (l > a * 0.2) { const u = fade(l, a * 0.2); ctx.save(); ctx.globalAlpha = u;
        card(ctx, 1020, 250, 680, 470, { fill: "#F2FAF4", stroke: GREEN, lw: 4, r: 20 });
        text(ctx, "Arsip Foto · 14 Mar 2019", 1060, 305, 26, { weight: 800 });
        G.photo(ctx, 1060, 330, 600, 300, { r: 12 });
        text(ctx, "“Banjir di Kota Damai”", 1360, 684, 30, { align: "center", weight: 900, color: GREEN });
        ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(960, 480, 46, 0, Math.PI * 2); ctx.fill(); text(ctx, "=", 960, 500, 56, { align: "center", weight: 900, color: "#FFFFFF" });
        ctx.restore(); }
      if (l > a * 0.5) { const u = fade(l, a * 0.5); ctx.save(); ctx.globalAlpha = u;
        card(ctx, 420, 738, 1080, 62, { fill: "#FFF3D6", r: 14 }); text(ctx, "Foto lama dipakai ulang untuk kabar rekaan.", 960, 780, 30, { align: "center", weight: 900, color: C.accentDark }); ctx.restore(); }
    },

    // ---------- 4. unggah gambar ----------
    unggah(ctx, b, l) {
      const a = A(b), span = a * 0.9, S = W.seq(l, span, [0.3, 1, 1, 0.4, 1, 0.4, 1, 1, 1.4]);
      const img = S.at(2), dialog = S.at(3) && !S.at(5), picker = S.at(5) && !S.at(8), done = S.at(8);
      const bg = browser(ctx, { tabs: [T.feed, T.cari], tab: 1, url: done ? "cari.example/gambar?src=foto-banjir.jpg" : img ? "cari.example/gambar" : "cari.example", dim: dialog || picker ? 1 : 0, loading: done ? clamp(S.p(8) / 0.4, 0, 1) : 0 });
      let hg;
      if (done) G.imagePage(ctx, bg, { alpha: clamp((S.p(8) - 0.2) / 0.5, 0, 1) });
      else { ctx.save(); hg = G.home(ctx, bg, { img, camHot: S.i === 2 && S.u > 0.5 }); ctx.restore(); }
      const hg0 = (() => { ctx.save(); ctx.globalAlpha = 0; const r = G.home(ctx, bg, { img: true }); ctx.restore(); return r; })();
      let dg = null, fp = null;
      if (dialog || picker) { ctx.save(); if (picker) ctx.globalAlpha = 0.6; dg = G.uploadDialog(ctx, bg.x + bg.w / 2, bg.y + 110, { press: S.i === 4 && S.u > 0.6 ? (S.u - 0.6) / 0.4 : 0 }); ctx.restore(); }
      const dg0 = (() => { ctx.save(); ctx.globalAlpha = 0; const r = G.uploadDialog(ctx, bg.x + bg.w / 2, bg.y + 110, {}); ctx.restore(); return r; })();
      const fpX = bg.x + bg.w / 2 - 330, fpY = bg.y + 90;
      if (picker) fp = G.filePicker(ctx, fpX, fpY, { sel: S.at(6) && S.p(6) > 0.6 ? 0 : null, press: S.i === 7 && S.u > 0.6 ? (S.u - 0.6) / 0.4 : 0 });
      const fp0 = (() => { ctx.save(); ctx.globalAlpha = 0; const r = G.filePicker(ctx, fpX, fpY, { sel: 0 }); ctx.restore(); return r; })();
      const gm = hg0.gambar, cam = hg0.camera, up = dg0.btn, f0 = fp0.item(0), op = fp0.open;
      const p = W.path(l, span, [{ x: 900, y: 600, d: 0.3 }, { x: gm.cx, y: gm.cy + 6, d: 1, click: true }, { x: cam.cx, y: cam.cy + 6, d: 1, click: true }, { x: cam.cx, y: cam.cy + 6, d: 0.4 }, { x: up.cx, y: up.cy + 6, d: 1, click: true }, { x: up.cx, y: up.cy + 6, d: 0.4 }, { x: f0.cx, y: f0.cy + 6, d: 1, click: true }, { x: op.cx, y: op.cy + 6, d: 1, click: true }, { x: op.cx + 60, y: op.cy + 60, d: 1.4 }], { x: 900, y: 600 });
      if (!done) L.cursor(ctx, p.x, p.y, { click: p.click });
      steps(ctx, "LANGKAH", ["Klik Gambar.", "Klik ikon kamera.", "Klik Unggah file.", "Pilih fotonya, lalu klik Buka."], S.i <= 1 ? 0 : S.i <= 2 ? 1 : S.i <= 4 ? 2 : S.n >= 8 ? 4 : 3);
      if (S.at(2)) { card(ctx, PX, WIN.y + 470, PW, 230, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); G.camera(ctx, PX + 70, WIN.y + 540, 64, BLUE);
        para(ctx, "ikon kamera = cari dengan gambar", PX + 130, WIN.y + 530, 23, PW - 150, { weight: 800, lh: 1.25 });
        para(ctx, "Foto bisa dari download atau screenshot.", PX + 24, WIN.y + 630, 21, PW - 48, { weight: 600, color: C.ink2, lh: 1.3 }); }
    },
    unggah_hp(ctx, b, l) {
      const a = A(b);
      card(ctx, 160, 140, 1600, 680);
      // HP 1: tekan lama
      const s1 = G.phone(ctx, 220, 160, 340, 640);
      text(ctx, "Linimasa", s1.x + 24, s1.y + 70, 24, { weight: 900, color: W.UI.ink });
      G.avatar(ctx, s1.x + 40, s1.y + 112, 18, "kilat"); text(ctx, "Kabar Kilat", s1.x + 66, s1.y + 119, 19, { weight: 800, color: W.UI.ink });
      text(ctx, "VIRAL!!! Jalan Melati banjir…", s1.x + 20, s1.y + 160, 18, { weight: 600, color: W.UI.ink });
      G.photo(ctx, s1.x + 16, s1.y + 180, s1.w - 32, 190, { r: 8 });
      const press = clamp((l - a * 0.08) / (a * 0.25), 0, 1), menu = l > a * 0.33;
      if (press > 0 && press < 1) { ctx.fillStyle = `rgba(242,177,52,${0.25 + 0.3 * press})`; ctx.beginPath(); ctx.arc(s1.x + s1.w / 2, s1.y + 280, 16 + 34 * press, 0, Math.PI * 2); ctx.fill(); }
      if (!menu) { ctx.fillStyle = "rgba(31,42,51,0.55)"; ctx.beginPath(); ctx.arc(s1.x + s1.w / 2 + 6, s1.y + 300, 22, 0, Math.PI * 2); ctx.fill(); }
      if (menu) { ctx.fillStyle = "rgba(31,42,51,0.35)"; rr(ctx, s1.x, s1.y, s1.w, s1.h, 30); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; rr(ctx, s1.x, s1.y + s1.h - 230, s1.w, 230, 26); ctx.fill();
        ["Simpan gambar", "Bagikan gambar", "Cari gambar"].forEach((s, i) => { const yy = s1.y + s1.h - 200 + i * 62, hi = i === 2 && l > a * 0.45;
          if (hi) { ctx.fillStyle = "#DCE9F7"; rr(ctx, s1.x + 12, yy - 6, s1.w - 24, 54, 10); ctx.fill(); }
          W.icon(ctx, i === 2 ? "search" : i === 0 ? "check" : "fwd", s1.x + 40, yy + 21, 22, hi ? BLUE : W.UI.ink2); text(ctx, s, s1.x + 70, yy + 29, 23, { weight: hi ? 800 : 600, color: hi ? BLUE : W.UI.ink }); }); }
      card(ctx, 590, 300, 330, 230, { fill: C.bg2, r: 18 }); text(ctx, "1", 630, 360, 44, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Tekan lama fotonya, lalu pilih Cari gambar.", 662, 350, 26, 240, { weight: 800, lh: 1.25 });
      // HP 2: simpan lalu unggah
      if (l > a * 0.55) { const u = fade(l, a * 0.55, 0.5); ctx.save(); ctx.globalAlpha = u;
        const s2 = G.phone(ctx, 990, 160, 340, 640);
        text(ctx, "Cari", s2.x + s2.w / 2, s2.y + 120, 44, { align: "center", weight: 900, color: W.UI.ink });
        ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = W.UI.frame; ctx.lineWidth = 2; rr(ctx, s2.x + 20, s2.y + 150, s2.w - 40, 52, 26); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#DCE9F7"; ctx.beginPath(); ctx.arc(s2.x + s2.w - 50, s2.y + 176, 22, 0, Math.PI * 2); ctx.fill(); G.camera(ctx, s2.x + s2.w - 50, s2.y + 176, 28, BLUE);
        text(ctx, "Galeri", s2.x + 24, s2.y + 260, 22, { weight: 800, color: W.UI.ink });
        for (let i = 0; i < 6; i++) { const gx = s2.x + 20 + (i % 3) * 98, gy = s2.y + 280 + Math.floor(i / 3) * 98;
          if (i === 0) { G.photo(ctx, gx, gy, 90, 90, { r: 6, stroke: C.accent, lw: 5 }); } else { ctx.fillStyle = ["#E3EBF0", "#DCE9E2", "#F1E6D6", "#E7E0F0", "#E3EBF0"][i - 1]; rr(ctx, gx, gy, 90, 90, 6); ctx.fill(); } }
        card(ctx, 1360, 300, 360, 230, { fill: C.bg2, r: 18 }); text(ctx, "2", 1400, 360, 44, { align: "center", weight: 900, color: C.kiko });
        para(ctx, "Tidak ada menunya? Simpan foto, lalu unggah lewat ikon kamera.", 1432, 350, 24, 270, { weight: 800, lh: 1.25 });
        ctx.restore(); }
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 280, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 290, 245, 20, 70, 6); ctx.fill(); rr(ctx, 330, 245, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 268, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 430, 316, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 380 + i * 104, 900, 88, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 436 + i * 104, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 435 + i * 104, 27, { weight: 700, fit: 790 }); });
      card(ctx, 1170, 380, 540, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "Catat seperti ini", 1200, 424, 24, { weight: 900, color: C.ink2 });
      [["Tanggal paling lama", "14 Mar 2019"], ["Situs", "arsipfoto.example"], ["Keterangan asli", "Kota Damai"], ["Siapa sumbernya?", "situs baru"], ["Kata sumber lain", "tidak banjir"]].forEach(([k, v], i) => {
        const y = 450 + i * 62; ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(1200, y, 480, 62);
        text(ctx, k, 1216, y + 39, 22, { weight: 700, color: C.ink2 }); text(ctx, v, 1664, y + 39, 22, { align: "right", weight: 800, fit: 220 }); });
    },

    // ---------- 5. kesimpulan ----------
    putusan(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "KESIMPULAN DITO", 960, 210, 34, { align: "center", weight: 900, color: C.accentDark });
      [["Siapa sumbernya?", "Situs baru, tanpa redaksi, sering memakai foto lama."], ["Apa kata sumber lain?", "Koran dan dinas pendidikan: tidak banjir, sekolah masuk."], ["Dari mana fotonya?", "Arsip Foto, 14 Maret 2019, Kota Damai."]].forEach(([q, s], i) => {
        const u = fade(l, a * (0.12 + i * 0.2)); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; const x = 220 + i * 500;
        card(ctx, x, 250, 470, 330, { fill: C.bg2, r: 20 }); text(ctx, q, x + 235, 310, 30, { align: "center", weight: 900, color: C.kikoDark, fit: 430 });
        para(ctx, s, x + 235, 380, 29, 400, { align: "center", weight: 700, lh: 1.3 }); ctx.restore(); });
      if (l > a * 0.78) { const u = ease((l - a * 0.78) / 0.35); ctx.save(); ctx.translate(960, 680); ctx.rotate(-0.05); ctx.scale(1.4 - 0.4 * u, 1.4 - 0.4 * u); ctx.globalAlpha = u;
        ctx.strokeStyle = RED; ctx.lineWidth = 8; rr(ctx, -200, -55, 400, 110, 16); ctx.stroke(); text(ctx, "KELIRU", 0, 26, 76, { align: "center", weight: 900, color: RED }); ctx.restore(); }
    },
    grup(ctx, b, l) {
      const a = A(b), span = a * 0.9;
      card(ctx, 160, 140, 1600, 680);
      const s = G.phone(ctx, 300, 150, 560, 660);
      ctx.save(); rr(ctx, s.x, s.y, s.w, s.h, 30); ctx.clip(); ctx.fillStyle = "#EEF3EF"; ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.fillStyle = C.kikoDark; ctx.fillRect(s.x, s.y, s.w, 88); text(ctx, "Grup Kelas 8B", s.x + 30, s.y + 62, 26, { weight: 900, color: "#FFFFFF" }); text(ctx, "32 anggota", s.x + s.w - 30, s.y + 62, 18, { align: "right", weight: 600, color: "#CFE3EA" });
      let y = s.y + 104; const bw = s.w - 40;
      // pesan Raka: meneruskan unggahan
      ctx.fillStyle = "#FFFFFF"; rr(ctx, s.x + 20, y, 380, 196, 16); ctx.fill(); ctx.strokeStyle = W.UI.line; ctx.lineWidth = 1.5; rr(ctx, s.x + 20, y, 380, 196, 16); ctx.stroke();
      text(ctx, "Raka", s.x + 36, y + 28, 17, { weight: 800, color: "#7B5EA7" }); text(ctx, "Diteruskan", s.x + 90, y + 28, 15, { weight: 600, color: W.UI.ink3 });
      G.photo(ctx, s.x + 36, y + 42, 120, 76, { r: 6 }); text(ctx, "VIRAL!!! Jalan Melati", s.x + 166, y + 68, 17, { weight: 700, color: W.UI.ink }); text(ctx, "banjir, sekolah libur!", s.x + 166, y + 92, 17, { weight: 700, color: W.UI.ink });
      text(ctx, "Asyik, besok libur!", s.x + 36, y + 160, 21, { weight: 600, color: W.UI.ink }); y += 212;
      const msg = "Teman-teman, kabar ini keliru. Fotonya foto lama dari tahun 2019 di Kota Damai, dan Dinas Pendidikan bilang sekolah tetap masuk. Ini beritanya: korancontoh.example/jalan-melati";
      const tu = clamp((l - span * 0.08) / (span * 0.55), 0, 1);
      if (tu > 0) y += G.bubble(ctx, s.x + 20, y, bw, W.typed(msg, tu), { me: true, size: 20, caret: tu < 1 }) + 14;
      if (l > span * 0.8) G.bubble(ctx, s.x + 20, y, bw, "Oh iya, terima kasih, Dito!", { name: "Sinta", nameColor: GREEN, size: 20 });
      ctx.restore();
      notes(ctx, "CARA MEMBALAS", [["Sopan, tanpa mengejek", "good"], ["Sertakan link sumber", "good"], ["Jangan ikut membagikan kabarnya", "good"]], (l > a * 0.15 ? 1 : 0) + (l > a * 0.45 ? 1 : 0) + (l > a * 0.7 ? 1 : 0), 250, { stroke: "#B9DEC5", x: 960, w: 620 });
    },

    // ---------- 6. kesalahan ----------
    salah_vertikal(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "KESALAHAN 1: MEMBACA SITUS ITU SAJA", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 220, 250, 720, 540, { fill: "#FDF1F0", stroke: RED, lw: 4, r: 20 }); text(ctx, "✗ lama di satu situs", 580, 300, 30, { align: "center", weight: 900, color: RED });
      const sc = clamp(l / (a * 0.6), 0, 1); ctx.save(); ctx.beginPath(); ctx.rect(260, 330, 330, 420); ctx.clip(); miniPage(ctx, 280, 340 - sc * 260, 290, 680, { label: "kabarkilat…", head: "#B8433A", lines: 28 }); ctx.restore();
      clock(ctx, 760, 450, 80, 15 * sc + 1, RED); text(ctx, Math.round(15 * sc + 1) + " menit", 760, 580, 30, { align: "center", weight: 900, color: RED });
      para(ctx, "makin terbawa ceritanya", 760, 640, 26, 300, { align: "center", weight: 800, lh: 1.25 });
      if (l > a * 0.5) { const u = fade(l, a * 0.5); ctx.save(); ctx.globalAlpha = u;
        card(ctx, 980, 250, 720, 540, { fill: "#F2FAF4", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "✓ cepat keluar, buka tab baru", 1340, 300, 30, { align: "center", weight: 900, color: GREEN });
        ["Periksa fakta", "Berita lain", "Info situs"].forEach((s, i) => { card(ctx, 1020, 350 + i * 110, 330, 86, { fill: "#FFFFFF", r: 14, stroke: "#B9DEC5", lw: 3 }); W.icon(ctx, "search", 1056, 393 + i * 110, 24, BLUE); text(ctx, s, 1082, 402 + i * 110, 26, { weight: 800 }); });
        clock(ctx, 1530, 450, 80, 2, GREEN); text(ctx, "2 menit", 1530, 580, 30, { align: "center", weight: 900, color: GREEN });
        para(ctx, "tahu siapa sumbernya", 1530, 640, 26, 300, { align: "center", weight: 800, lh: 1.25 });
        ctx.restore(); }
    },
    salah_atas(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "KESALAHAN 2: MENGANGGAP HASIL TERATAS SEBAGAI ASAL", 960, 210, 30, { align: "center", weight: 900, color: C.accentDark });
      const list = (x, mark) => G.PAGES.forEach((pg, k) => { const y = 340 + k * 96;
        const hot = mark(k); if (hot) { ctx.fillStyle = hot === "bad" ? C.badBg : C.goodBg; rr(ctx, x - 10, y - 10, 640, 84, 12); ctx.fill(); }
        G.photo(ctx, x, y, 100, 64, { r: 6 }); text(ctx, pg.url, x + 120, y + 26, 22, { weight: 700, color: W.UI.url }); text(ctx, pg.date, x + 120, y + 58, 24, { weight: 900, color: hot === "good" ? GREEN : C.ink }); });
      card(ctx, 220, 250, 720, 540, { fill: "#FDF1F0", stroke: RED, lw: 4, r: 20 }); text(ctx, "✗ yang paling atas", 580, 300, 30, { align: "center", weight: 900, color: RED });
      list(260, k => k === 0 ? "bad" : null); callout(ctx, 600, 330, "Ini asalnya?", null, null, { color: RED, fill: "#FFFFFF", size: 26 });
      text(ctx, "paling atas = sering paling baru", 580, 760, 24, { align: "center", weight: 800, color: RED });
      if (l > a * 0.45) { const u = fade(l, a * 0.45); ctx.save(); ctx.globalAlpha = u;
        card(ctx, 980, 250, 720, 540, { fill: "#F2FAF4", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "✓ baca tanggal satu per satu", 1340, 300, 30, { align: "center", weight: 900, color: GREEN });
        list(1020, k => k === 3 && l > a * 0.7 ? "good" : null); if (l > a * 0.7) callout(ctx, 1420, 618, "paling lama", null, null, { color: GREEN, fill: "#FFFFFF", size: 26 });
        text(ctx, "paling lama = paling dekat dengan asal", 1340, 760, 24, { align: "center", weight: 800, color: GREEN });
        ctx.restore(); }
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D8.4", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Nilai empat kabar", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d84", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "sumber, bukti, waktu, sumber lain", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Bersama gurumu, periksa satu kabar yang sedang ramai: buka tab baru, lalu cari asal fotonya.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
