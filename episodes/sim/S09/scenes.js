/* S09 Simulasi praktik: mencari lebih tepat dengan operator pencarian di browser generik (mesin pencari rekaan "Cari").
   Jendela browser di kiri (x 110–1410, y 122–822), panel kanan (x 1450–1820): jumlah hasil di atas, langkah di bawahnya.
   Semua situs, judul, dan angka rekaan; domain .example atau pola contoh (kota-contoh.go.id). Memakai layar.js + layar_web.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, W = K.web;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";
  const PX = 1450, PW = 370;
  // Short: adegan digambar di kanvas tak terlihat lalu dipotong; garis penunjuk dari panel kanan tidak ikut digambar supaya tidak memotong gambar
  const inShort = ctx => !!(ctx.canvas && ctx.canvas.isConnected === false);
  const callout = (ctx, x, y, s, tx, ty, o) => L.callout(ctx, x, y, s, inShort(ctx) ? null : tx, inShort(ctx) ? null : ty, o);

  // ---------- hasil pencarian rekaan ----------
  const R = {
    toko: { title: "Jual Plastik Kemasan Kantin Murah, Bebas Ongkir", url: "tokokemasan.example › plastik-kantin", snippet: "Plastik kemasan untuk *kantin* dan warung. Gratis ongkir, *bebas* pilih ukuran, stok *plastik* selalu ada." },
    resep: { title: "Resep Jajanan Kantin yang Laris Dijual", url: "dapurrumah.example › resep › jajanan", snippet: "Lima resep jajanan *kantin* yang dibungkus *plastik* supaya awet dan *bebas* repot saat dijual." },
    berita: { title: "Sekolah Kami Memulai Kantin Bebas Plastik", url: "kabarsekolah.example › 2026 › kantin", date: "14 Feb 2026", snippet: "Sejak Januari, *kantin bebas plastik* meminta murid membawa wadah dan botol minum sendiri." },
    toko2: { title: "Jual Paket Kantin Bebas Plastik: Sedotan Bambu dan Wadah", url: "tokohijau.example › paket-kantin", snippet: "Perlengkapan *kantin bebas plastik* harga grosir. Kami jual sedotan bambu, wadah, dan gelas." },
    video: { title: "Video: Lima Langkah Menuju Kantin Bebas Plastik", url: "videoku.example › tonton", date: "3 Sep 2025", snippet: "Tips memulai *kantin bebas plastik* bersama pedagang dan murid, dari wadah sampai tempat sampah." },
    pemkot: { title: "Empat Puluh Sekolah Mulai Menerapkan Kantin Bebas Plastik", url: "kota-contoh.go.id › berita", date: "2 Okt 2026", snippet: "Dinas lingkungan hidup mendampingi empat puluh sekolah menerapkan *kantin bebas plastik*." },
    lama: { title: "Program Kantin Bebas Plastik Tahun 2018", type: "PDF", url: "kota-contoh.go.id › arsip › program-2018.pdf", date: "9 Jul 2018", snippet: "Dokumen program *kantin bebas plastik* tahun 2018 untuk sekolah dasar." },
    panduan: { title: "Panduan Kantin Bebas Plastik untuk Sekolah", type: "PDF", url: "dlh.kota-contoh.go.id › panduan-kantin.pdf", date: "20 Agu 2026", snippet: "Langkah menerapkan *kantin bebas plastik*: wadah sendiri, isi ulang air minum, dan pemilahan sampah." },
    laporan: { title: "Laporan Sampah Plastik Kantin Sekolah 2026", type: "PDF", url: "kab-contoh.go.id › laporan-2026.pdf", date: "11 Mar 2026", snippet: "Hasil enam bulan *kantin bebas plastik*: sampah plastik kantin turun hampir separuhnya." },
    lembar: { title: "Lembar Kerja Murid: Audit Sampah Kantin", type: "PDF", url: "dlh.kab-contoh.go.id › audit-kantin.pdf", date: "5 Des 2025", snippet: "Formulir untuk menghitung sampah di *kantin bebas plastik* selama satu minggu." }
  };
  const PH = '"kantin bebas plastik"';
  const ST = [
    { q: "kantin bebas plastik", n: 3120000, s: "0,41", res: [R.toko, R.resep, R.berita, R.toko2], add: "kata kunci biasa" },
    { q: PH, n: 48600, s: "0,38", res: [R.toko2, R.berita, R.video], add: "+ tanda kutip" },
    { q: PH + " -jual", n: 21300, s: "0,36", res: [R.berita, R.pemkot, R.video], add: "+ -jual" },
    { q: PH + " -jual site:go.id", n: 1240, s: "0,31", res: [R.pemkot, R.lama, R.panduan], add: "+ site:go.id" },
    { q: PH + " -jual site:go.id filetype:pdf", n: 86, s: "0,27", res: [R.lama, R.panduan, R.laporan], add: "+ filetype:pdf" },
    { q: PH + " -jual site:go.id filetype:pdf", n: 12, s: "0,22", res: [R.panduan, R.laporan, R.lembar], add: "+ Setahun terakhir", time: "Setahun terakhir" }
  ];
  const countText = k => (ST[k].n >= 100 ? "Sekitar " : "") + `${W.num(ST[k].n)} hasil (${ST[k].s} detik)`;
  const stage = (k, extra = {}) => ({ query: ST[k].q, count: countText(k), results: ST[k].res, tools: k >= 5, time: ST[k].time, snipLines: k >= 5 ? 1 : 2, ...extra });

  // ---------- bingkai: browser + halaman hasil ----------
  function app(ctx, st = {}, bopt = {}) {
    const q = st.query || "";
    const bg = W.browser(ctx, WIN.x, WIN.y, WIN.w, WIN.h, {
      tabs: [st.home || !q ? "Cari" : q + " - Cari"], url: st.home ? "cari.example" : "cari.example/search?q=" + (st.urlQ != null ? st.urlQ : q).replace(/ /g, "+"),
      loading: st.loading, canBack: !st.home, ...bopt });
    const g = W.searchPage(ctx, bg, { engine: "Cari", ...st });
    g.browser = bg; return g;
  }
  function probe(ctx, st) { ctx.save(); ctx.globalAlpha = 0; const g = app(ctx, st); ctx.restore(); return g; }
  // jumlah hasil (panel kanan atas), dengan animasi turun secara logaritmik
  function counter(ctx, n, opt = {}) {
    const y = WIN.y; card(ctx, PX, y, PW, 196, { fill: "#FFFFFF", stroke: opt.hot ? C.accent : "#D7E2DC", lw: 3, r: 18 });
    text(ctx, "JUMLAH HASIL", PX + 24, y + 42, 22, { weight: 900, color: C.accentDark });
    text(ctx, W.num(n), PX + PW / 2, y + 122, 64, { align: "center", weight: 900, color: opt.hot ? C.accentDark : C.ink, fit: PW - 40 });
    text(ctx, opt.note || "hasil", PX + PW / 2, y + 166, 22, { align: "center", weight: 700, color: C.ink2 });
  }
  const logLerp = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), ease(clamp(u, 0, 1))));
  // panel langkah (sama dengan S02): judul + daftar langkah, langkah ke-n sedang dikerjakan
  function steps(ctx, title, items, n, y0) {
    const x = PX, y = y0 || WIN.y + 220, w = PW; let hh = 70;
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

  // ---------- penerjemah langkah di kotak pencarian ----------
  // plan: [{click: "start" | "end" | "box" | {x, y}}, {type: "teks"} (disisipkan di posisi kursor), {key: "Enter", enter: k}, {pt: {x, y}}, {wait}]
  function run(ctx, b, l, k0, plan, o = {}) {
    const span = Math.max(3, (b.audio || b.dur) * (o.speed || 0.9));
    const ds = plan.map(p => p.d || 1), unit = span / ds.reduce((a, c) => a + c, 0);
    const S = W.seq(l, span, ds);
    let q = o.q0 != null ? o.q0 : ST[k0].q, caretAt = null, focus = false, mark = o.mark0 || null, stg = k0, key = null, since = -1, ptr = o.from || { x: 1000, y: 640 }, click = 0;
    for (let i = 0; i <= S.i; i++) {
      const p = plan[i], u = S.p(i);
      if (since >= 0) since += u * ds[i] * unit;
      if (p.click || p.pt) {
        const gq = probe(ctx, stage(stg, { query: q })).box;
        const tg = p.pt || p.click;
        const to = tg === "start" ? { x: gq.at(0) - 2, y: gq.cy + 4 } : tg === "end" ? { x: gq.end + 8, y: gq.cy + 4 } : tg === "box" ? { x: gq.x + gq.w * 0.55, y: gq.cy + 4 } : tg;
        const m = ease(clamp(u / 0.6, 0, 1)); ptr = { x: lerp(ptr.x, to.x, m), y: lerp(ptr.y, to.y, m) };
        if (p.click && u >= 0.6) { focus = true; caretAt = tg === "start" ? 0 : null; click = u < 1 ? (u - 0.6) / 0.4 : 0; }
      }
      if (p.type != null) {
        const n = Math.round(p.type.length * clamp(u / 0.9, 0, 1)), part = p.type.slice(0, n), at = caretAt == null ? q.length : caretAt;
        q = q.slice(0, at) + part + q.slice(at); if (caretAt != null) caretAt += n;
        const skip = p.type.startsWith(" ") && n > 0 ? 1 : 0; mark = n > skip ? [at + skip, at + n] : mark;
        if (o.keepMarks && mark) o.marks = (o.marks || []).concat([mark]);
      }
      if (p.key) { key = u < 1 ? { keys: [p.key], press: u } : null; if (p.enter != null && u >= 0.45) { stg = p.enter; focus = false; caretAt = null; since = (u - 0.45) * ds[i] * unit; } }
    }
    const st = stage(stg, { query: q, focus, caret: focus && (Math.floor(l * 2.2) % 2 === 0 || true), caretAt, mark });
    if (stg !== k0) { // hasil baru dimuat
      st.loading = since < 0.5 ? since / 0.5 : 0;
      if (since < 0.4) Object.assign(st, { results: ST[k0].res, count: countText(k0), tools: k0 >= 5, time: ST[k0].time, snipLines: k0 >= 5 ? 1 : 2 });
      else st.results = st.results.map(r => ({ ...r, alpha: ease((since - 0.4) / 0.4) }));
    }
    if (!plan.some(p => p.click || p.pt)) ptr = null;
    return { st, ptr, click, key, stg, since, span };
  }
  function show(ctx, P, opt = {}) {
    if (P.ptr) L.cursor(ctx, P.ptr.x, P.ptr.y, { kind: opt.kind || (P.st && P.st.focus ? "text" : "arrow"), click: P.click });
    if (P.key) L.keys(ctx, PX + PW / 2, 700, P.key.keys, { press: P.key.press, align: "center", size: 30 });
  }
  // adegan mengetik: kotak pencarian + panel jumlah + langkah
  function act(ctx, b, l, k0, plan, panel, o = {}) {
    const P = run(ctx, b, l, k0, plan, o);
    const g = app(ctx, P.st);
    const n = P.stg !== k0 && P.since >= 0.4 ? logLerp(ST[k0].n, ST[P.stg].n, (P.since - 0.4) / 1.2) : ST[k0].n;
    counter(ctx, n, { hot: P.stg !== k0 });
    if (panel) steps(ctx, panel.title || "LANGKAH", panel.items, stepAt(l, P.span, panel.marks));
    if (o.after) o.after(ctx, g, P, l);
    show(ctx, P, o);
    return { g, P };
  }
  // halaman hasil diam + panel jumlah beranimasi dari tahap sebelumnya
  function resultScene(ctx, b, l, k, extra = {}, o = {}) {
    const g = app(ctx, stage(k, extra));
    const n = o.from != null ? logLerp(ST[o.from].n, ST[k].n, l / 1.4) : ST[k].n;
    counter(ctx, n, { hot: (o.from != null || o.hot) && l < 2.5 });
    return g;
  }
  const A = b => b.audio || b.dur;
  const qEnd = k => [ST[k - 1].q.length + 1, ST[k].q.length];  // bagian query yang baru ditambahkan

  // kartu kecil kotak pencarian (untuk perbandingan benar/salah)
  function miniBox(ctx, x, y, w, q, opt = {}) {
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, 60, 30); ctx.fill(); ctx.strokeStyle = opt.color || "#C9D4DB"; ctx.lineWidth = 3; rr(ctx, x, y, w, 60, 30); ctx.stroke();
    const size = opt.size || 25; ctx.font = `600 ${size}px Inter`;
    if (opt.hl) { const a = ctx.measureText(q.slice(0, opt.hl[0])).width, c = ctx.measureText(q.slice(0, opt.hl[1])).width; const hx = x + 24 + (a + c) / 2; ctx.fillStyle = opt.hlColor || "rgba(217,68,59,0.35)"; rr(ctx, hx - 11, y + 10, 22, 40, 6); ctx.fill();
      ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(hx, y + 52); ctx.lineTo(hx - 9, y + 66); ctx.lineTo(hx + 9, y + 66); ctx.closePath(); ctx.fill(); text(ctx, "spasi", hx, y + 90, 22, { align: "center", weight: 900, color: RED }); }
    text(ctx, q, x + 24, y + 39, size, { weight: 600, color: C.ink, fit: w - 48 });
    W.icon(ctx, "search", x + w - 32, y + 30, 24, BLUE);
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA MEMAKAI:", 260, 240, 30, { weight: 900, color: C.accentDark });
      [['"…"', "tanda kutip: frasa persis"], ["-kata", "tanda minus: buang kata"], ["site:", "batasi jenis situs"], ["filetype:", "batasi jenis file"], ["Alat", "pilih rentang waktu"]].forEach(([op, s], i) => {
        const u = ease((l - 0.6 - i * 0.6) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 96, 820, 80, { fill: C.bg2, r: 16 });
        ctx.fillStyle = "#FFFFFF"; rr(ctx, 280, 292 + i * 96, 170, 56, 10); ctx.fill(); text(ctx, op, 365, 330 + i * 96, 28, { align: "center", weight: 900, color: BLUE });
        text(ctx, s, 480, 331 + i * 96, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      // corong: jutaan → belasan
      const u = ease((l - 1.5) / 2.5);
      ctx.fillStyle = "#E7F1FB"; ctx.beginPath(); ctx.moveTo(1200, 300); ctx.lineTo(1640, 300); ctx.lineTo(1470, 600); ctx.lineTo(1370, 600); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#9CC2EA"; ctx.lineWidth = 3; ctx.stroke();
      text(ctx, "3.120.000", 1420, 280, 40, { align: "center", weight: 900, color: C.ink2 });
      for (let i = 0; i < 30; i++) { const keep = i % 6 === 0, x0 = 1230 + ((i * 53) % 380), y0 = 318 + ((i * 29) % 90);
        const x1 = keep ? 1380 + (i / 6) * 16 : lerp(x0, 1420, 0.6), y1 = keep ? 572 : lerp(y0, 560, 0.6);
        ctx.globalAlpha = keep ? 1 : 1 - clamp(u * 1.6, 0, 1); ctx.fillStyle = keep ? GREEN : "#B7C4CC";
        ctx.beginPath(); ctx.arc(lerp(x0, x1, u), lerp(y0, y1, u), 8, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
      if (u > 0.9) { text(ctx, "12 hasil yang tepat", 1420, 660, 36, { align: "center", weight: 900, color: GREEN }); }
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      [["D7.4", "Mesin Pencari", "kata kunci dan tanda kutip"], ["E.4", "Mencari, Memeriksa, Membaca Lateral", "operator pencarian"], ["F11.4", "Riset Digital dan Verifikasi Konten", "query untuk riset"]].forEach(([c, t, s], i) => {
        const x = 230 + i * 500; card(ctx, x, 290, 460, 300, { fill: C.bg2, r: 22 });
        text(ctx, c, x + 230, 370, 54, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 230, 430, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 560, 24, { align: "center", weight: 600, color: C.ink2 });
      });
      if (l > A(b) * 0.6) { card(ctx, 420, 630, 1080, 70, { fill: "#FFF3D6", r: 14 }); text(ctx, "Semua situs dan angka di video ini hanyalah contoh rekaan.", 960, 676, 28, { align: "center", weight: 800, color: C.accentDark }); }
      kiko(ctx, 1660, 730, 90, 0, { wave: l });
    },
    cari_awal(ctx, b, l) {
      const span = A(b) * 0.9, S = W.seq(l, span, [0.4, 1, 2.2, 0.9, 1.2]);
      const q = W.typed(ST[0].q, S.p(2) / 0.92), entered = S.at(3) && S.p(3) >= 0.45;
      const since = entered ? (S.p(3) - 0.45) * span * 0.9 / 5.7 + S.p(4) * span * 1.2 / 5.7 : -1;
      let g;
      if (!entered || since < 0.35) g = app(ctx, { home: true, query: q, focus: S.at(1) && S.p(1) > 0.6, caret: true, loading: entered ? since / 0.5 : 0 });
      else g = app(ctx, stage(0, { results: ST[0].res.map(r => ({ ...r, alpha: ease((since - 0.35) / 0.4) })), loading: since < 0.5 ? since / 0.5 : 0 }));
      const shown = entered && since >= 0.35; counter(ctx, shown ? ST[0].n : 0, { note: shown ? "hasil" : "belum mencari", hot: shown });
      steps(ctx, "LANGKAH", ["Klik kotak pencarian.", "Ketik: kantin bebas plastik", "Tekan Enter."], S.n >= 4 ? 3 : S.i <= 1 ? 0 : S.i === 2 ? 1 : 2);
      const box = { x: WIN.x + 270 + 380 * 0.5, y: WIN.y + 108 + 592 * 0.38 + 26 };
      const p = W.path(l, span, [{ x: 1000, y: 680, d: 0.4 }, { x: box.x, y: box.y, d: 1, click: true }, { x: box.x, y: box.y, d: 4.3 }], { x: 1000, y: 680 });
      if (!entered) L.cursor(ctx, p.x, p.y, { click: p.click });
      if (S.i === 3 && S.p(3) < 1) L.keys(ctx, PX + PW / 2, 700, ["Enter"], { press: S.p(3), align: "center", size: 30 });
    },
    hasil_awal(ctx, b, l) {
      const a = A(b), g = resultScene(ctx, b, l, 0, { countMark: l > a * 0.15 });
      if (l > a * 0.15) callout(ctx, PX, 420, "Sekitar tiga juta hasil", g.count.cx + 160, g.count.cy, {});
      if (l > a * 0.5) {
        card(ctx, PX, 540, PW, 250, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
        text(ctx, "Tanpa operator:", PX + 24, 584, 24, { weight: 900, color: C.ink2 });
        ["kantin", "bebas", "plastik"].forEach((w, i) => { ctx.fillStyle = "#E7F1FB"; rr(ctx, PX + 24 + i * 112, 606, 102, 44, 10); ctx.fill(); text(ctx, w, PX + 75 + i * 112, 636, 22, { align: "center", weight: 800, color: BLUE }); });
        para(ctx, "Halaman yang memuat sebagian kata juga ikut muncul.", PX + 24, 694, 22, PW - 48, { weight: 700, lh: 1.3 });
      }
    },
    hasil_campur(ctx, b, l) {
      const a = A(b), marks = [l > a * 0.12 ? "bad" : null, l > a * 0.3 ? "bad" : null, l > a * 0.55 ? "good" : null];
      const g = resultScene(ctx, b, l, 0, { results: ST[0].res.map((r, i) => ({ ...r, mark: marks[i] })) });
      if (marks[0]) callout(ctx, PX, 360, "Toko plastik kemasan", g.result(0).x + 700, g.result(0).y + 14, { color: RED, fill: "#FBE1DF" });
      if (marks[1]) callout(ctx, PX, 480, "Resep jajanan", g.result(1).x + 560, g.result(1).y + 14, { color: RED, fill: "#FBE1DF" });
      if (marks[2]) callout(ctx, PX, 600, "✓ Yang dicari Sinta", g.result(2).x + 620, g.result(2).y + 14, { color: GREEN, fill: C.goodBg });
    },
    operator_kenal(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "OPERATOR PENCARIAN", 960, 215, 34, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "ditulis di kotak pencarian, bersama kata kuncinya", 960, 262, 26, { align: "center", weight: 700, color: C.ink2 });
      const rows = [['"kantin bebas plastik"', "frasa persis, berurutan"], ["-jual", "buang halaman yang memuat kata ini"], ["site:go.id", "hanya dari jenis situs tertentu"], ["filetype:pdf", "hanya file jenis tertentu"], ["Alat → Waktu", "hanya terbitan rentang waktu tertentu"]];
      rows.forEach(([op, s], i) => { const u = ease((l - a * 0.25 - i * a * 0.12) / 0.4); if (u <= 0) return; ctx.globalAlpha = u; const y = 300 + i * 98;
        card(ctx, 260, y, 1400, 82, { fill: C.bg2, r: 16 }); ctx.fillStyle = "#FFFFFF"; rr(ctx, 280, y + 12, 470, 58, 10); ctx.fill();
        text(ctx, op, 515, y + 51, 30, { align: "center", weight: 900, color: BLUE }); text(ctx, s, 790, y + 52, 30, { weight: 800 }); ctx.globalAlpha = 1; });
    },
    kutip_ketik(ctx, b, l) {
      act(ctx, b, l, 0, [{ wait: 1, d: 0.3 }, { click: "start", d: 1.1 }, { type: '"', d: 0.5 }, { click: "end", d: 1.1 }, { type: '"', d: 0.5 }, { key: "Enter", enter: 1, d: 0.8 }, { wait: 1, d: 1.2 }],
        { items: ["Klik di depan kata kantin.", "Ketik tanda kutip.", "Klik di akhir, ketik tanda kutip.", "Tekan Enter."], marks: [0.26, 0.33, 0.62, 0.8] });
    },
    kutip_hasil(ctx, b, l) {
      const a = A(b), g = resultScene(ctx, b, l, 1, { mark: [0, PH.length], countMark: l < a * 0.45 }, { hot: true });
      if (l > a * 0.12) callout(ctx, PX, 330, "3.120.000 → 48.600", g.count.cx + 150, g.count.cy);
      if (l > a * 0.5) { const r = g.result(1); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, r.x - 10, r.y + 60, 820, 64, 10); ctx.stroke(); callout(ctx, PX, 520, "Frasanya persis berurutan dan ditebalkan", r.x + 820, r.y + 92, { maxW: 320 }); }
    },
    kutip_toko(ctx, b, l) {
      const a = A(b), g = resultScene(ctx, b, l, 1, { results: ST[1].res.map((r, i) => ({ ...r, mark: i === 0 && l > a * 0.1 ? "bad" : null })) });
      if (l > a * 0.1) { const r = g.result(0); ctx.fillStyle = "rgba(217,68,59,0.18)"; rr(ctx, r.x + 2, r.y + 2, 60, 28, 6); ctx.fill(); callout(ctx, PX, 340, "Masih ada toko: kata jual", r.x + 30, r.y + 18, { color: RED, fill: "#FBE1DF", maxW: 320 }); }
      if (l > a * 0.55) callout(ctx, PX, 520, "Tidak diperlukan untuk tugas", null, null, { fill: "#F4F6F5", color: "#9AAFA6", maxW: 320 });
    },
    minus_ketik(ctx, b, l) {
      act(ctx, b, l, 1, [{ wait: 1, d: 0.4 }, { click: "end", d: 1.2 }, { type: " -jual", d: 1.6 }, { wait: 1, d: 2 }],
        { items: ["Klik di akhir query.", "Ketik spasi, lalu -jual.", "Minus menempel pada kata."], marks: [0.3, 0.65, 1] },
        { after: (ctx, g, P, ll) => { if (ll > P.span * 0.68) { const x0 = g.box.at(PH.length + 1), x1 = g.box.at(PH.length + 6);
            const zx = 1000, zy = 450; L.zoom(ctx, (x0 + x1) / 2, g.box.cy, 2.4, () => { ctx.fillStyle = "#FFFFFF"; rr(ctx, x0 - 20, g.box.y + 6, x1 - x0 + 40, g.box.h - 12, 10); ctx.fill(); text(ctx, "-jual", x0, g.box.ty, 24, { weight: 600, color: C.ink }); }, zx, zy);
            ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, zx - (x1 - x0) * 1.2 - 48, zy - 70, (x1 - x0) * 2.4 + 96, 140, 18); ctx.stroke();
            callout(ctx, PX, 610, "Tanpa spasi antara - dan jual", zx + (x1 - x0) * 1.2 + 48, zy, { maxW: 320 }); } } });
    },
    minus_hasil(ctx, b, l) {
      const a = A(b);
      if (l < a * 0.4) { // Enter, lalu toko dicoret
        act(ctx, b, l, 1, [{ key: "Enter", enter: 1, d: 0.8 }, { wait: 1, d: 1.6 }], null, { q0: ST[2].q, mark0: qEnd(2), speed: 0.4,
          after: (ctx, g, P, ll) => { const r = g.result(0); const u = ease((ll - a * 0.1) / (a * 0.2)); if (u > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(r.x - 8, r.y + 18); ctx.lineTo(r.x - 8 + 790 * u, r.y + 18); ctx.stroke(); callout(ctx, PX, 340, "Memuat kata jual: dibuang", r.x + 400, r.y + 18, { color: RED, fill: "#FBE1DF", maxW: 320 }); } } });
        return;
      }
      const g = resultScene(ctx, b, l, 2, { mark: qEnd(2), countMark: true }, { from: 1 });
      callout(ctx, PX, 330, "48.600 → 21.300", g.count.cx + 150, g.count.cy);
      callout(ctx, PX, 470, "Artikel dan berita naik ke atas", g.result(0).x + 600, g.result(0).y + 14, { color: GREEN, fill: C.goodBg, maxW: 320 });
    },
    site_ketik(ctx, b, l) {
      act(ctx, b, l, 2, [{ wait: 1, d: 0.3 }, { click: "end", d: 1 }, { type: " site:go.id", d: 2.4 }, { wait: 1, d: 1.6 }],
        { items: ["Klik di akhir query.", "Ketik spasi, lalu site:go.id", "Tanpa spasi setelah titik dua."], marks: [0.25, 0.72, 1] },
        { after: (ctx, g, P, ll) => { if (ll > P.span * 0.72) callout(ctx, PX, 610, "site:go.id menempel, tanpa spasi", g.box.end - 60, g.box.y + g.box.h, { maxW: 320 }); } });
    },
    site_hasil(ctx, b, l) {
      const a = A(b);
      if (l < a * 0.2) { act(ctx, b, l, 2, [{ key: "Enter", enter: 3, d: 0.8 }, { wait: 1, d: 0.6 }], null, { q0: ST[3].q, mark0: qEnd(3), speed: 0.2 }); return; }
      const g = resultScene(ctx, b, l, 3, { mark: qEnd(3), countMark: l < a * 0.5 }, { from: 2 });
      callout(ctx, PX, 330, "21.300 → 1.240", g.count.cx + 150, g.count.cy);
      if (l > a * 0.35) [0, 1, 2].forEach(i => { const r = g.result(i); if (!r || r.y + 50 > 820) return; ctx.font = "600 19px Inter"; const uw = ctx.measureText(ST[3].res[i].url.split(" ›")[0]).width; ctx.strokeStyle = GREEN; ctx.lineWidth = 3; rr(ctx, r.x - 6, r.y + 34, uw + 12, 30, 6); ctx.stroke(); });
      if (l > a * 0.35) callout(ctx, PX, 450, "Semua berakhiran go.id: situs pemerintah", g.result(0).x + 260, g.result(0).y + 50, { color: GREEN, fill: C.goodBg, maxW: 320 });
      if (l > a * 0.7) callout(ctx, PX, 610, "site:sch.id → situs sekolah", null, null, { fill: "#E7F1FB", color: BLUE, maxW: 320 });
    },
    file_ketik(ctx, b, l) {
      act(ctx, b, l, 3, [{ wait: 1, d: 0.3 }, { click: "end", d: 1 }, { type: " filetype:pdf", d: 2.6 }, { wait: 1, d: 1.8 }],
        { items: ["Klik di akhir query.", "Ketik spasi, lalu filetype:pdf", "Tanpa spasi setelah titik dua."], marks: [0.22, 0.7, 1] });
    },
    file_hasil(ctx, b, l) {
      const a = A(b);
      if (l < a * 0.2) { act(ctx, b, l, 3, [{ key: "Enter", enter: 4, d: 0.8 }, { wait: 1, d: 0.6 }], null, { q0: ST[4].q, mark0: qEnd(4), speed: 0.2 }); return; }
      const g = resultScene(ctx, b, l, 4, { mark: qEnd(4), countMark: l < a * 0.5 }, { from: 3 });
      callout(ctx, PX, 330, "1.240 → 86", g.count.cx + 150, g.count.cy);
      if (l > a * 0.35) { [0, 1, 2].forEach(i => { const r = g.result(i); if (!r || r.y + 30 > 820) return; ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, r.x - 4, r.y, 58, 30, 6); ctx.stroke(); });
        callout(ctx, PX, 450, "Setiap hasil bertanda PDF", g.result(1).x + 30, g.result(1).y + 2, { maxW: 320 }); }
      if (l > a * 0.65) callout(ctx, PX, 570, "Klik untuk membaca atau download", null, null, { fill: "#E7F1FB", color: BLUE, maxW: 320 });
    },
    waktu_buka(ctx, b, l) {
      const a = A(b), span = a * 0.9, S = W.seq(l, span, [1.6, 1.1, 1.3, 1.6]);
      const g0 = probe(ctx, stage(4, { tools: true, time: "Kapan saja" }));
      const tools = S.at(1) && S.p(1) > 0.6, open = S.at(2) && S.p(2) > 0.6;
      const st = stage(4, { tools, time: "Kapan saja", timeOpen: open, results: ST[4].res.map((r, i) => ({ ...r, mark: i === 0 ? "bad" : null })), snipLines: tools ? 1 : 2 });
      const g = app(ctx, st); counter(ctx, ST[4].n);
      steps(ctx, "LANGKAH", ["Klik Alat.", "Klik Waktu: Kapan saja.", "Daftar pilihan waktu muncul."], S.i === 0 ? 0 : S.i === 1 ? 0 : S.i === 2 ? 1 : 3);
      if (S.i === 0) { const r = g.result(0); callout(ctx, PX, 450, "Masih ada terbitan 2018", r.x + 30, r.y + 80, { color: RED, fill: "#FBE1DF", maxW: 320 }); }
      if (open) callout(ctx, PX, 600, "Di aplikasi lain, menu ini bernama Filter atau Tanggal.", null, null, { size: 22, fill: "#F4F6F5", color: "#9AAFA6", maxW: 320 });
      const p = W.path(l, span, [{ x: 1000, y: 700, d: 1.6 }, { x: g0.tools.cx, y: g0.tools.cy + 6, d: 1.1, click: true }, { x: g0.timeBtn.cx, y: g0.timeBtn.cy + 6, d: 1.3, click: true }, { x: g0.timeBtn.cx + 30, y: g0.timeBtn.cy + 60, d: 1.6 }], { x: 1000, y: 700 });
      L.cursor(ctx, p.x, p.y, { click: p.click });
    },
    waktu_pilih(ctx, b, l) {
      const a = A(b), span = a * 0.9, S = W.seq(l, span, [1.2, 1.2, 3]);
      const g0 = probe(ctx, stage(4, { tools: true, time: "Kapan saja", timeOpen: true }));
      const picked = S.at(1) && S.p(1) > 0.6, since = picked ? (S.p(1) - 0.6) * span * 1.2 / 5.4 + S.p(2) * span * 3 / 5.4 : -1;
      let st;
      if (!picked) st = stage(4, { tools: true, time: "Kapan saja", timeOpen: true, timeHi: S.i === 1 || S.p(0) > 0.6 ? 4 : null, snipLines: 1 });
      else if (since < 0.4) st = stage(4, { tools: true, time: "Setahun terakhir", snipLines: 1, loading: since / 0.5 });
      else st = stage(5, { results: ST[5].res.map(r => ({ ...r, alpha: ease((since - 0.4) / 0.4) })), loading: since < 0.5 ? since / 0.5 : 0 });
      const g = app(ctx, st);
      counter(ctx, picked && since >= 0.4 ? logLerp(ST[4].n, ST[5].n, (since - 0.4) / 1.2) : ST[4].n, { hot: picked });
      steps(ctx, "LANGKAH", ["Pilih Setahun terakhir.", "Hasil lama hilang."], picked ? (since > 1.5 ? 2 : 1) : 0);
      if (picked && since > 1.6) { callout(ctx, PX, 600, "86 → 12, semuanya terbit setahun ini", g.count.cx + 120, g.count.cy, { maxW: 320 }); }
      const it = g0.timeItem(4);
      const p = W.path(l, span, [{ x: g0.timeBtn.cx + 30, y: g0.timeBtn.cy + 60, d: 0.3 }, { x: it.cx, y: it.cy + 6, d: 0.9 }, { x: it.cx, y: it.cy + 6, d: 1.2, click: true }, { x: 1000, y: 720, d: 3 }]);
      L.cursor(ctx, p.x, p.y, { click: p.click });
    },
    bandingkan(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "SETIAP OPERATOR MENYARING LAGI", 960, 210, 34, { align: "center", weight: 900, color: C.accentDark });
      const max = Math.log10(ST[0].n);
      ST.forEach((s, i) => { const u = ease((l - 0.5 - i * a * 0.09) / 0.6); if (u <= 0) return; const y = 260 + i * 88;
        ctx.globalAlpha = u; text(ctx, s.add, 230, y + 46, 30, { weight: 800, color: i === 0 ? C.ink2 : BLUE });
        const bw = 820 * Math.max(0.06, Math.log10(s.n) / max) * u; ctx.fillStyle = i === ST.length - 1 ? GREEN : i === 0 ? "#B7C4CC" : "#9CC2EA"; rr(ctx, 560, y + 14, bw, 46, 10); ctx.fill();
        text(ctx, W.num(s.n), 560 + bw + 20, y + 48, 32, { weight: 900, color: i === ST.length - 1 ? GREEN : C.ink }); ctx.globalAlpha = 1; });
      text(ctx, "panjang batang: skala logaritmik", 1700, 790, 20, { align: "right", weight: 600, color: C.ink2 });
      kiko(ctx, 1640, 700, 80, 0, { wave: l });
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 280, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 290, 245, 20, 70, 6); ctx.fill(); rr(ctx, 330, 245, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 268, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 430, 316, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 380 + i * 104, 900, 88, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 436 + i * 104, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 435 + i * 104, 27, { weight: 700, fit: 790 }); });
      card(ctx, 1170, 380, 540, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "Catat seperti ini", 1200, 424, 24, { weight: 900, color: C.ink2 });
      [["kata kunci biasa", "3.120.000"], ["+ tanda kutip", "48.600"], ["+ -jual", "21.300"], ["+ site:go.id", "1.240"], ["+ filetype:pdf", "86"], ["+ Setahun terakhir", "12"]].forEach(([k, v], i) => {
        const y = 450 + i * 52; ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(1200, y, 480, 52);
        text(ctx, k, 1216, y + 34, 23, { weight: 700, color: i ? BLUE : C.ink }); text(ctx, v, 1664, y + 34, 23, { align: "right", weight: 800 }); });
    },
    salah_site(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "KESALAHAN 1: SPASI SETELAH TITIK DUA", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      const wrong = PH + " site: go.id", right = PH + " site:go.id";
      card(ctx, 220, 250, 720, 540, { fill: "#FDF1F0", stroke: RED, lw: 4, r: 20 }); text(ctx, "✗ dengan spasi", 580, 300, 30, { align: "center", weight: 900, color: RED });
      miniBox(ctx, 250, 330, 660, wrong, { color: RED, hl: [wrong.indexOf(":") + 1, wrong.indexOf(":") + 2], size: 24 });
      text(ctx, "Sekitar 51.200 hasil", 690, 430, 22, { weight: 700, color: C.ink2 });
      W.result(ctx, 270, 460, 620, { ...R.toko2, mark: "bad" }, 1); W.result(ctx, 270, 590, 620, R.video, 1);
      callout(ctx, 330, 700, "site dianggap kata biasa", null, null, { color: RED, fill: "#FFFFFF", size: 24 });
      if (l > a * 0.5) {
        card(ctx, 980, 250, 720, 540, { fill: "#F2FAF4", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "✓ tanpa spasi", 1340, 300, 30, { align: "center", weight: 900, color: GREEN });
        miniBox(ctx, 1010, 330, 660, right, { color: GREEN, size: 24 });
        text(ctx, "Sekitar 1.300 hasil", 1030, 430, 22, { weight: 700, color: C.ink2 });
        W.result(ctx, 1030, 460, 620, { ...R.pemkot, mark: "good" }, 1); W.result(ctx, 1030, 590, 620, R.panduan, 1);
        callout(ctx, 1090, 700, "semua dari situs go.id", null, null, { color: GREEN, fill: "#FFFFFF", size: 24 });
      }
    },
    salah_minus(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "KESALAHAN 2: TANDA MINUS BERSPASI", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      const wrong = PH + " - jual", right = PH + " -jual";
      card(ctx, 220, 250, 720, 540, { fill: "#FDF1F0", stroke: RED, lw: 4, r: 20 }); text(ctx, "✗ minus berspasi", 580, 300, 30, { align: "center", weight: 900, color: RED });
      miniBox(ctx, 250, 330, 660, wrong, { color: RED, hl: [wrong.indexOf("- ") + 1, wrong.indexOf("- ") + 2] });
      text(ctx, "Sekitar 48.600 hasil", 690, 430, 22, { weight: 700, color: C.ink2 });
      W.result(ctx, 270, 460, 620, { ...R.toko2, mark: "bad" }, 1); W.result(ctx, 270, 590, 620, R.berita, 1);
      callout(ctx, 330, 700, "minus diabaikan: toko muncul", null, null, { color: RED, fill: "#FFFFFF", size: 24 });
      if (l > a * 0.5) {
        card(ctx, 980, 250, 720, 540, { fill: "#F2FAF4", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "✓ minus menempel", 1340, 300, 30, { align: "center", weight: 900, color: GREEN });
        miniBox(ctx, 1010, 330, 660, right, { color: GREEN });
        text(ctx, "Sekitar 21.300 hasil", 1030, 430, 22, { weight: 700, color: C.ink2 });
        W.result(ctx, 1030, 460, 620, { ...R.berita, mark: "good" }, 1); W.result(ctx, 1030, 590, 620, R.pemkot, 1);
        callout(ctx, 1090, 700, "toko hilang dari daftar", null, null, { color: GREEN, fill: "#FFFFFF", size: 24 });
      }
    },
    kosong(ctx, b, l) {
      const a = A(b), span = a * 0.9, S = W.seq(l, span, [1.6, 1, 1, 2.4]);
      const g0 = probe(ctx, stage(5, { time: "24 jam terakhir", timeOpen: true }));
      const fixed = S.at(2) && S.p(2) > 0.6;
      const since = fixed ? (S.p(2) - 0.6) * span / 6 + S.p(3) * span * 2.4 / 6 : -1;
      let st;
      if (!fixed) st = stage(5, { time: "24 jam terakhir", results: [], count: "0 hasil", empty: "Tidak ada hasil yang cocok.", timeOpen: S.at(1) && S.p(1) > 0.6, timeHi: 4 });
      else st = stage(5, { results: ST[5].res.map(r => ({ ...r, alpha: ease((since - 0.3) / 0.4) })), loading: since < 0.5 ? since / 0.5 : 0 });
      const g = app(ctx, st);
      counter(ctx, fixed && since > 0.3 ? 12 : 0, { hot: fixed });
      steps(ctx, "JIKA HASIL KOSONG", ["Cari operator yang terlalu ketat.", "Longgarkan atau hapus satu.", "Cari lagi."], S.i === 0 ? 0 : S.i < 3 ? 1 : 3);
      if (S.i === 0) callout(ctx, PX, 640, "Terlalu ketat: 24 jam terakhir", g0.timeBtn.x + g0.timeBtn.w, g0.timeBtn.cy, { color: RED, fill: "#FBE1DF", maxW: 320 });
      const it = g0.timeItem(4);
      const p = W.path(l, span, [{ x: 1000, y: 700, d: 1.6 }, { x: g0.timeBtn.cx, y: g0.timeBtn.cy + 6, d: 1, click: true }, { x: it.cx, y: it.cy + 6, d: 1, click: true }, { x: 1000, y: 720, d: 2.4 }]);
      L.cursor(ctx, p.x, p.y, { click: p.click });
    },
    periksa(ctx, b, l) {
      const a = A(b), items = ["Frasa muncul persis", "Tidak ada kata jual", "Alamat go.id, file PDF", "Terbit setahun terakhir"];
      const on = i => l > a * (0.2 + i * 0.16);
      const g = app(ctx, stage(5, { mark: on(0) ? [0, PH.length] : null, results: ST[5].res.map(r => ({ ...r, mark: on(3) ? "good" : null })) }));
      counter(ctx, 12, { note: "hasil yang tepat" });
      const y0 = WIN.y + 220; card(ctx, PX, y0, PW, 90 + items.length * 88, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILMU", PX + PW / 2, y0 + 48, 24, { align: "center", weight: 900, color: C.accentDark });
      items.forEach((k, i) => { const y = y0 + 74 + i * 88, ok = on(i); ctx.fillStyle = ok ? C.goodBg : "#F4F6F5"; rr(ctx, PX + 18, y, PW - 36, 72, 12); ctx.fill();
        text(ctx, k, PX + 36, y + 45, 23, { weight: 700, fit: PW - 110 }); text(ctx, ok ? "✓" : "?", PX + PW - 40, y + 47, 30, { align: "center", weight: 900, color: ok ? GREEN : C.ink2 }); });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D7.4", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Susun kata kunci", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d74", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "pilih kata yang spesifik, lalu periksa", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Cari satu sumber untuk tugas sekolahmu dengan minimal dua operator. Catat query dan alamatnya.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
