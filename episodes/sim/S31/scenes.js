/* S31 Simulasi praktik: mengunggah karya dengan lisensi Creative Commons di situs arsip rekaan "Arsip Karya" (arsipkarya.example).
   Jendela browser x 110–1410 (y 122–822), panel kanan x 1450–1820. Pembantu situs, gambar karya, dan Slide ada di arsip.js (K.arsip).
   Semua nama, karya, dan alamat rekaan. Lencana lisensi berupa teks, bukan logo resmi. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, W = K.web, AR = K.arsip;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const PX = 1450, PW = 370;
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";
  const A = b => b.audio || b.dur;
  const SP = b => A(b) * 0.9;
  const inShort = ctx => !!(ctx.canvas && ctx.canvas.isConnected === false);
  const callout = (ctx, x, y, s, tx, ty, o) => L.callout(ctx, x, y, s, inShort(ctx) ? null : tx, inShort(ctx) ? null : ty, o);
  const SINTA = AR.WORKS.sinta, GUN = AR.WORKS.gunungan;
  const DESC = SINTA.desc, TAGS = SINTA.tags;

  // ---------- bingkai browser ----------
  function browser(ctx, url, tab, opt = {}) {
    return W.browser(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { tabs: [tab || "Arsip Karya"], url, canBack: true, ...opt });
  }
  // pointer + tombol keyboard
  function ptr(ctx, P, key) {
    if (P) L.cursor(ctx, P.x, P.y, { click: P.click });
    if (key) L.keys(ctx, PX + PW / 2, 760, key.keys, { press: key.press, align: "center", size: 30 });
  }
  const run = (l, span, pts) => ({ S: W.seq(l, span, pts.map(p => p.d || 1)), P: W.path(l, span, pts) });
  const stepN = (S, marks) => marks.filter(k => S.n > k).length;

  // ---------- halaman situs ----------
  function home(ctx, area, st = {}) {
    const g = AR.site(ctx, area, st); const b = g.body;
    W.clip(ctx, b, () => {
      text(ctx, "Arsip karya budaya pelajar", b.x + 60, b.y + 78, 38, { weight: 900, color: C.ink });
      text(ctx, "Simpan, bagikan, dan pakai karya dengan lisensi yang jelas.", b.x + 60, b.y + 118, 23, { weight: 600, color: C.ink2 });
      text(ctx, "Karya terbaru", b.x + 60, b.y + 178, 22, { weight: 800, color: C.ink2 });
      ["kelir", "gunungan", "kawung", "golek"].forEach((k, i) => { const x = b.x + 60 + i * 300; ctx.fillStyle = "#EEF2F5"; rr(ctx, x, b.y + 196, 270, 300, 12); ctx.fill();
        AR.art(ctx, AR.WORKS[k].art, x + 45, b.y + 200, 180, 240); text(ctx, AR.WORKS[k].title, x + 14, b.y + 470, 18, { weight: 700, color: C.ink, fit: 242 }); });
    });
    return g;
  }
  // langkah 1: kotak upload atau file yang sudah di-upload
  const DZ = { x: 300, y: 380, w: 920, h: 400 };
  function step1(ctx, area, st = {}) {
    const g = AR.site(ctx, area, { hot: null }); AR.wizard(ctx, area, 0);
    if (!st.file) { const d = AR.dropZone(ctx, DZ.x, DZ.y, DZ.w, DZ.h, { press: st.press, hot: st.hot }); return { ...g, pick: d.pick }; }
    const u = st.up == null ? 1 : st.up;
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 150, 376, 1220, 300, 16); ctx.fill(); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 2; rr(ctx, 150, 376, 1220, 300, 16); ctx.stroke();
    ctx.save(); ctx.globalAlpha = u >= 1 ? 1 : 0.25; AR.poster(ctx, 180, 396, 195, 260); ctx.restore();
    text(ctx, "poster-cublak-cublak-suweng.png", 410, 450, 28, { weight: 800, color: C.ink });
    text(ctx, "Gambar PNG · 2,4 MB", 410, 490, 22, { weight: 600, color: C.ink2 });
    W.progress(ctx, 410, 530, 640, u, { color: u >= 1 ? GREEN : BLUE });
    text(ctx, u >= 1 ? "✓ Upload selesai" : `Meng-upload… ${Math.round(u * 100)}%`, 410, 596, 24, { weight: 800, color: u >= 1 ? GREEN : BLUE });
    const next = AR.btn(ctx, 1170, 712, 200, 52, "Lanjut ›", { press: st.press, disabled: u < 1 });
    return { ...g, next };
  }
  // langkah 2: metadata
  const MF = { title: { x: 400, y: 362, w: 970 }, by: { x: 400, y: 462, w: 470 }, date: { x: 900, y: 462, w: 470 }, desc: { x: 400, y: 562, w: 970 }, tags: { x: 400, y: 690, w: 970 } };
  const fieldC = k => ({ x: MF[k].x + Math.min(260, MF[k].w * 0.4), y: MF[k].y + 32 + (k === "desc" ? 42 : 28) });
  function leftThumb(ctx, st) {
    AR.poster(ctx, 150, 372, 200, 267);
    text(ctx, "poster-cublak-…-suweng.png", 250, 664, 16, { align: "center", weight: 600, color: C.ink2, fit: 200 });
    return AR.btn(ctx, 150, 714, 200, 52, st.back ? "‹ Kembali" : "Lanjut ›", { press: st.press });
  }
  function step2(ctx, area, st = {}) {
    const g = AR.site(ctx, area, {}); AR.wizard(ctx, area, 1);
    const next = leftThumb(ctx, st); const cur = st.focus, car = Math.floor((st.t || 0) * 2.4) % 2 === 0;
    W.field(ctx, MF.title.x, MF.title.y, MF.title.w, { label: "Judul *", value: st.title, placeholder: "Judul karya", focus: cur === "title", caret: cur === "title" && car, mark: st.markTitle ? [0, (st.title || "").length] : null });
    W.field(ctx, MF.by.x, MF.by.y, MF.by.w, { label: "Pembuat *", value: st.by, placeholder: "Nama pembuat", focus: cur === "by", caret: cur === "by" && car });
    W.field(ctx, MF.date.x, MF.date.y, MF.date.w, { label: "Tanggal dibuat *", value: st.date, placeholder: "hh/bb/tttt", focus: cur === "date" });
    AR.textarea(ctx, MF.desc.x, MF.desc.y, MF.desc.w, st.desc, { focus: cur === "desc", caret: car });
    AR.tags(ctx, MF.tags.x, MF.tags.y, MF.tags.w, st.tags || [], { focus: cur === "tags", caret: car, typing: st.typing, newest: (st.tags || []).length - 1, pop: st.pop });
    let cal = null; if (st.cal) cal = AR.calendar(ctx, MF.date.x, MF.date.y + 94, st.cal);
    return { ...g, next, cal };
  }
  // langkah 3: lisensi
  function step3(ctx, area, st = {}) {
    const g = AR.site(ctx, area, {}); AR.wizard(ctx, area, 2);
    AR.poster(ctx, 150, 372, 200, 267); text(ctx, SINTA.title, 250, 664, 15, { align: "center", weight: 700, color: C.ink2, fit: 210 });
    const lic = AR.licList(ctx, 400, 358, 970, { sel: st.sel, hi: st.hi });
    const cb = W.checkbox(ctx, 400, 748, "Saya pembuat karya ini atau sudah mendapat izin pembuatnya.", !!st.check, { size: 24, focus: st.cbHot });
    const pub = AR.btn(ctx, 1170, 736, 200, 52, "Terbitkan", { kind: "good", press: st.press, disabled: !st.check });
    return { ...g, lic, cb, pub };
  }
  const metaDone = { title: SINTA.title, by: SINTA.by, date: "12 Okt 2026", desc: DESC, tags: TAGS };

  // ---------- panel kanan ----------
  function panelCard(ctx, title, h, y0) { const y = y0 || WIN.y; card(ctx, PX, y, PW, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, title, PX + 24, y + 44, 23, { weight: 900, color: C.accentDark, fit: PW - 48 }); return y + 70; }
  function miniSlide(ctx, x, y, w, caption, opt = {}) {
    const h = w * 9 / 16, u = w / 330; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    text(ctx, opt.title || "Dolanan di Kampungku", x + 14 * u, y + 30 * u, 17 * u, { weight: 900, color: C.ink, fit: w * 0.55 });
    for (let i = 0; i < 3; i++) { ctx.fillStyle = "#DCE3E8"; rr(ctx, x + 14 * u, y + (50 + i * 22) * u, (150 - i * 20) * u, 9 * u, 4 * u); ctx.fill(); }
    const iw = 90 * u, ih = 120 * u, ix = x + w - iw - 40 * u, iy = y + 14 * u;
    AR.art(ctx, opt.art || "poster", ix, iy, iw, ih);
    if (caption) { const cs = Math.max(16, 11 * u); ctx.font = `700 ${cs}px Inter`; const lines = H.wrap(ctx, caption, cs, 700, w - 24); lines.slice(0, 2).forEach((ln, i) => text(ctx, ln, x + w / 2, y + h - (lines.length > 1 ? 1.9 : 0.7) * cs + i * cs * 1.25, cs, { align: "center", weight: 700, color: opt.capColor || C.ink2 })); }
    return { x, y, w, h, img: { x: ix, y: iy, w: iw, h: ih } };
  }
  function shirt(ctx, x, y, s) {
    ctx.fillStyle = "#E8EEF2"; ctx.beginPath(); ctx.moveTo(x - 0.5 * s, y - 0.4 * s); ctx.lineTo(x - 0.2 * s, y - 0.55 * s); ctx.lineTo(x + 0.2 * s, y - 0.55 * s); ctx.lineTo(x + 0.5 * s, y - 0.4 * s);
    ctx.lineTo(x + 0.42 * s, y - 0.18 * s); ctx.lineTo(x + 0.3 * s, y - 0.24 * s); ctx.lineTo(x + 0.3 * s, y + 0.5 * s); ctx.lineTo(x - 0.3 * s, y + 0.5 * s); ctx.lineTo(x - 0.3 * s, y - 0.24 * s); ctx.lineTo(x - 0.42 * s, y - 0.18 * s); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; ctx.stroke(); AR.poster(ctx, x - 0.17 * s, y - 0.3 * s, 0.34 * s, 0.45 * s);
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 236, 30, { weight: 900, color: C.accentDark });
      const items = [["1", "Upload karya"], ["2", "Isi metadata"], ["3", "Pilih lisensi"], ["4", "Tulis atribusi"]];
      items.forEach(([n, s], i) => { const u = ease((l - 0.5 - i * 0.7) / 0.5); if (u <= 0) return; const x = 240 + i * 370, y = 280; ctx.globalAlpha = u;
        card(ctx, x, y, 330, 420, { fill: C.bg2, r: 22 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 44, y + 46, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, n, x + 44, y + 57, 30, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, s, x + 84, y + 57, 30, { weight: 900, fit: 230 });
        if (i === 0) { AR.poster(ctx, x + 95, y + 100, 140, 187); ctx.strokeStyle = BLUE; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 165, y + 380); ctx.lineTo(x + 165, y + 310); ctx.moveTo(x + 140, y + 334); ctx.lineTo(x + 165, y + 308); ctx.lineTo(x + 190, y + 334); ctx.stroke(); ctx.lineCap = "butt"; }
        if (i === 1) ["Judul", "Pembuat", "Tanggal", "Deskripsi", "Kata kunci"].forEach((t, j) => { ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 30, y + 104 + j * 58, 270, 46, 10); ctx.fill(); text(ctx, t, x + 48, y + 135 + j * 58, 22, { weight: 700, color: C.ink2 }); });
        if (i === 2) ["CC BY", "CC BY-SA", "CC BY-NC"].forEach((c, j) => AR.badge(ctx, x + 60, y + 120 + j * 90, c, { size: 30 }));
        if (i === 3) { [["T", "Judul"], ["A", "Pembuat"], ["S", "Sumber"], ["L", "Lisensi"]].forEach(([c, t], j) => { text(ctx, c, x + 70, y + 150 + j * 66, 44, { align: "center", weight: 900, color: C.kiko }); text(ctx, t, x + 110, y + 146 + j * 66, 26, { weight: 800 }); }); }
        ctx.globalAlpha = 1; });
      kiko(ctx, 1690, 760, 80, 0, { wave: l });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 330, 290, 620, 300, { fill: C.bg2, r: 22 });
      text(ctx, "E.9", 640, 380, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Proyek: Digitalisasi Budaya Lokal", 640, 440, 32, 560, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "Bagian 2: hak cipta, lisensi, atribusi", 640, 556, 24, { align: "center", weight: 600, color: C.ink2 });
      card(ctx, 1000, 290, 590, 300, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
      text(ctx, "Di simulasi ini", 1295, 345, 28, { align: "center", weight: 900, color: C.ink2 });
      ["situs arsip karya", "lisensi Creative Commons", "atribusi untuk slide"].forEach((s, i) => { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(1070, 404 + i * 58, 12, 0, Math.PI * 2); ctx.fill(); text(ctx, s, 1100, 414 + i * 58, 28, { weight: 700 }); });
      if (l > A(b) * 0.55) { card(ctx, 420, 630, 1080, 70, { fill: "#FFF3D6", r: 14 }); text(ctx, "Semua situs, nama, dan karya di video ini hanyalah contoh rekaan.", 960, 676, 28, { align: "center", weight: 800, color: C.accentDark, fit: 1040 }); }
      kiko(ctx, 1660, 730, 90, 0, { wave: l });
    },
    hak_cipta(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      AR.poster(ctx, 260, 180, 420, 560);
      const u = ease((l - 0.8) / 0.6);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.translate(600, 640); ctx.rotate(-0.12); ctx.scale(lerp(1.6, 1, u), lerp(1.6, 1, u));
        ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.beginPath(); ctx.arc(0, 0, 88, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.stroke();
        text(ctx, "©", 0, 6, 70, { align: "center", weight: 900, color: RED }); text(ctx, "Sinta", 0, 52, 24, { align: "center", weight: 900, color: RED }); ctx.restore(); }
      text(ctx, "HAK CIPTA LAHIR OTOMATIS", 780, 240, 34, { weight: 900, color: C.accentDark });
      text(ctx, "saat karya dibuat, tanpa didaftarkan", 780, 288, 28, { weight: 700, color: C.ink2 });
      text(ctx, "Tanpa izin Sinta, orang lain tidak boleh:", 780, 380, 28, { weight: 800 });
      ["menyalin", "mengubah", "menyebarkan"].forEach((s, i) => { const v = ease((l - a * 0.3 - i * 0.5) / 0.4); if (v <= 0) return; ctx.globalAlpha = v;
        card(ctx, 780, 410 + i * 86, 560, 70, { fill: "#FDF1F0", r: 14 }); text(ctx, "✗", 820, 456 + i * 86, 34, { align: "center", weight: 900, color: RED }); text(ctx, s, 860, 456 + i * 86, 30, { weight: 800 }); ctx.globalAlpha = 1; });
      if (l > a * 0.72) { card(ctx, 780, 680, 760, 76, { fill: C.goodBg, r: 14 }); text(ctx, "Boleh, kalau Sinta memberi izin.", 810, 730, 30, { weight: 900, color: GREEN }); }
    },
    lisensi_kenal(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "TANPA LISENSI", 520, 210, 30, { align: "center", weight: 900, color: RED });
      text(ctx, "DENGAN LISENSI", 1300, 210, 30, { align: "center", weight: 900, color: GREEN });
      ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(910, 190); ctx.lineTo(910, 790); ctx.stroke();
      // Sinta dikerumuni permintaan izin
      ctx.fillStyle = "#7A5AA6"; ctx.beginPath(); ctx.arc(520, 560, 60, 0, Math.PI * 2); ctx.fill(); text(ctx, "S", 520, 580, 56, { align: "center", weight: 900, color: "#FFFFFF" }); text(ctx, "Sinta", 520, 660, 26, { align: "center", weight: 800 });
      const asks = [["Bu Guru", 250, 280], ["Kelas 10C", 560, 290], ["OSIS", 270, 420], ["Raka", 640, 420], ["Sanggar", 250, 720], ["Toko kaos", 650, 720]];
      asks.forEach(([who, x, y], i) => { const v = ease((l - 0.4 - i * 0.45) / 0.3); if (v <= 0) return; ctx.globalAlpha = v * (l > a * 0.55 ? 0.45 : 1);
        card(ctx, x - 20, y - 46, 270, 74, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 16 }); text(ctx, who + ":", x, y - 18, 19, { weight: 800, color: C.ink2 }); text(ctx, "Boleh kupakai?", x, y + 12, 23, { weight: 800 }); ctx.globalAlpha = 1; });
      const v = ease((l - a * 0.5) / 0.5);
      if (v > 0) { ctx.globalAlpha = v; AR.poster(ctx, 990, 260, 270, 360); AR.badge(ctx, 990, 640, "CC BY-SA", { size: 26 });
        text(ctx, "Aturannya tertulis", 1300, 290, 26, { weight: 800, color: C.ink2 }); text(ctx, "di samping karya:", 1300, 324, 26, { weight: 800, color: C.ink2 });
        AR.rules(ctx, 1300, 360, 380, "CC BY-SA"); text(ctx, "Wajib: sebut pembuat", 1300, 560, 24, { weight: 800, color: C.accentDark });
        text(ctx, "Tidak perlu bertanya", 1300, 640, 26, { weight: 900, color: GREEN }); text(ctx, "satu per satu.", 1300, 676, 26, { weight: 900, color: GREEN }); ctx.globalAlpha = 1; }
    },
    buka_situs(ctx, b, l) {
      const span = SP(b), url = "arsipkarya.example";
      const pts = [{ x: 900, y: 600, d: 0.3 }, { x: 600, y: 202, d: 0.8, click: true }, { x: 600, y: 202, d: 1.5 }, { x: 600, y: 202, d: 0.6 }, { x: 600, y: 202, d: 0.8 }, { x: 1245, y: 262, d: 1.2, click: true }, { x: 1245, y: 262, d: 0.8 }];
      const { S, P } = run(l, span, pts);
      const typedUrl = S.at(2) ? W.typed(url, S.p(2) / 0.9) : "", entered = S.at(3) && S.p(3) > 0.5;
      const bg = browser(ctx, entered ? url : typedUrl, entered ? "Arsip Karya" : "Tab baru", { urlFocus: S.at(1) && !entered && S.p(1) > 0.55, caret: true, loading: S.i === 4 ? S.p(4) : 0, canBack: false });
      if (entered && (S.i > 4 || S.p(4) > 0.4)) home(ctx, bg, { hot: S.i >= 5 && S.p(5) > 0.5 ? "upload" : null, press: S.i === 5 ? (S.p(5) - 0.55) / 0.45 : 0 });
      else W.clip(ctx, bg, () => { text(ctx, "Tab baru", bg.x + bg.w / 2, bg.y + 260, 30, { align: "center", weight: 700, color: "#B7C4CC" }); });
      AR.steps(ctx, PX, WIN.y, PW, "LANGKAH", ["Ketik arsipkarya.example di bilah alamat", "Pastikan kamu sudah login", "Klik Upload karya"], stepN(S, [2, 4, 5]));
      ptr(ctx, P, S.i === 3 ? { keys: ["Enter"], press: S.u } : null);
    },
    pilih_file(ctx, b, l) {
      const span = SP(b);
      const pts = [{ x: 1245, y: 262, d: 0.3 }, { x: 760, y: 630, d: 1.1, click: true }, { x: 450, y: 530, d: 1.1, click: true }, { x: 665, y: 464, d: 1.1, click: true }, { x: 1098, y: 713, d: 1.0, click: true }, { x: 1098, y: 713, d: 0.6 }];
      const { S, P } = run(l, span, pts);
      const bg = browser(ctx, "arsipkarya.example/upload", "Upload karya", { dim: S.i >= 2 || (S.i === 1 && S.p(1) > 0.8) ? (S.i === 5 ? 1 - S.p(5) : 1) : 0 });
      step1(ctx, bg, { hot: S.i === 1 && S.p(1) > 0.4, press: S.i === 1 ? (S.p(1) - 0.55) / 0.45 : 0 });
      if ((S.i === 1 && S.p(1) > 0.8) || (S.i >= 2 && S.i < 5)) {
        const folder = S.i > 2 || (S.i === 2 && S.p(2) > 0.6) ? 3 : null, file = S.i > 3 || (S.i === 3 && S.p(3) > 0.6) ? 0 : null;
        AR.fileDialog(ctx, 350, 290, { folder, file, press: S.i === 4 ? (S.p(4) - 0.55) / 0.45 : 0 });
      }
      AR.steps(ctx, PX, WIN.y, PW, "LANGKAH", ["Klik Pilih file", "Buka folder Proyek Budaya", "Klik file posternya", "Klik Buka"], stepN(S, [1, 2, 3, 4]));
      ptr(ctx, P);
    },
    upload_jalan(ctx, b, l) {
      const a = A(b), up = clamp(l / (a * 0.35), 0, 1);
      const bg = browser(ctx, "arsipkarya.example/upload", "Upload karya");
      step1(ctx, bg, { file: true, up });
      if (l > a * 0.4) W.banner(ctx, 150, 700, 980, "Upload hanya karya buatanmu sendiri atau karya yang sudah mendapat izin pembuatnya.", "warn");
      const y = panelCard(ctx, "BOLEH DI-UPLOAD?", 420);
      [["✓", "Karya buatanmu sendiri", GREEN], ["✓", "Karya dengan izin tertulis pembuatnya", GREEN], ["✗", "Gambar orang lain tanpa izin", RED]].forEach(([m, s, c], i) => {
        const v = ease((l - a * 0.45 - i * 0.6) / 0.4); if (v <= 0) return; ctx.globalAlpha = v;
        ctx.fillStyle = c === GREEN ? C.goodBg : "#FBE1DF"; rr(ctx, PX + 18, y + i * 108, PW - 36, 94, 12); ctx.fill();
        text(ctx, m, PX + 48, y + i * 108 + 58, 34, { align: "center", weight: 900, color: c }); para(ctx, s, PX + 80, y + i * 108 + 40, 23, PW - 120, { weight: 800, lh: 1.2 }); ctx.globalAlpha = 1; });
    },
    meta_judul(ctx, b, l) {
      const span = SP(b), T = SINTA.title, BY = SINTA.by;
      const pts = [{ x: 1000, y: 650, d: 0.2 }, { x: 1270, y: 738, d: 1.0, click: true }, { x: 1270, y: 738, d: 0.3 }, { ...fieldC("title"), d: 0.9, click: true }, { ...fieldC("title"), d: 2.4 }, { ...fieldC("by"), d: 0.9, click: true }, { ...fieldC("by"), d: 1.3 }, { ...fieldC("by"), d: 0.5 }];
      const { S, P } = run(l, span, pts);
      const bg = browser(ctx, "arsipkarya.example/upload", "Upload karya");
      if (S.i <= 1) step1(ctx, bg, { file: true, press: S.i === 1 ? (S.p(1) - 0.55) / 0.45 : 0 });
      else { const focus = S.i >= 5 && S.p(5) > 0.55 ? "by" : S.i >= 3 && (S.i > 3 || S.p(3) > 0.55) ? "title" : null;
        step2(ctx, bg, { t: l, focus, title: S.at(4) ? W.typed(T, S.p(4) / 0.95) : "", by: S.at(6) ? W.typed(BY, S.p(6) / 0.95) : "" }); }
      AR.steps(ctx, PX, WIN.y, PW, "METADATA", ["Judul", "Pembuat", "Tanggal dibuat", "Deskripsi", "Kata kunci"], stepN(S, [4, 6]));
      ptr(ctx, P);
    },
    meta_tanggal(ctx, b, l) {
      const span = SP(b); const c = fieldC("date");
      const pts = [{ ...fieldC("by"), d: 0.2 }, { ...c, d: 0.9, click: true }, { x: 930, y: 462 + 94 + 102 + 38 * 2 - 6, d: 1.0, click: true }, { ...fieldC("desc"), d: 0.9, click: true }, { ...fieldC("desc"), d: 3.2 }, { ...fieldC("desc"), d: 0.4 }];
      const { S, P } = run(l, span, pts);
      const calOpen = S.i === 2 || (S.i === 1 && S.p(1) > 0.6), picked = S.i > 2 || (S.i === 2 && S.p(2) > 0.7);
      const bg = browser(ctx, "arsipkarya.example/upload", "Upload karya");
      step2(ctx, bg, { t: l, title: SINTA.title, by: SINTA.by, date: picked ? "12 Okt 2026" : "", focus: S.i >= 3 && (S.i > 3 || S.p(3) > 0.55) ? "desc" : calOpen ? "date" : null,
        desc: S.at(4) ? W.typed(DESC, S.p(4) / 0.95) : "", cal: calOpen ? { hi: 12, sel: picked ? 12 : null } : null });
      AR.steps(ctx, PX, WIN.y, PW, "METADATA", ["Judul", "Pembuat", "Tanggal dibuat", "Deskripsi", "Kata kunci"], 2 + stepN(S, [2, 4]));
      ptr(ctx, P);
    },
    meta_kunci(ctx, b, l) {
      const span = SP(b), c = fieldC("tags");
      const plan = [{ ...fieldC("desc"), d: 0.2 }, { ...c, d: 0.8, click: true }];
      TAGS.forEach(t => { plan.push({ ...c, d: 0.25 + t.length * 0.05, type: t }); plan.push({ ...c, d: 0.45, key: true }); });
      plan.push({ ...c, d: 0.6 });
      const { S, P } = run(l, span, plan);
      const tags = []; let typing = "", key = null, pop = 1;
      plan.forEach((p, i) => { if (!S.at(i)) return; const u = S.p(i);
        if (p.type) { if (u < 1) typing = W.typed(p.type, u / 0.9); }
        if (p.key) { const t = plan[i - 1].type; if (u < 0.45) typing = t; else { tags.push(t); pop = (u - 0.45) / 0.3; } if (u < 1) key = { keys: ["Enter"], press: u }; } });
      const bg = browser(ctx, "arsipkarya.example/upload", "Upload karya");
      step2(ctx, bg, { t: l, ...metaDone, tags, typing, pop, focus: S.i >= 1 && (S.i > 1 || S.p(1) > 0.55) ? "tags" : null });
      AR.steps(ctx, PX, WIN.y, PW, "METADATA", ["Judul", "Pembuat", "Tanggal dibuat", "Deskripsi", "Kata kunci"], tags.length >= 4 ? 5 : 4);
      ptr(ctx, P, key);
    },
    lis_by(ctx, b, l) {
      const span = SP(b);
      const pts = [{ ...fieldC("tags"), d: 0.2 }, { x: 250, y: 740, d: 0.9, click: true }, { x: 250, y: 740, d: 0.3 }, { x: 760, y: 433, d: 1.0 }, { x: 760, y: 433, d: 3 }];
      const { S, P } = run(l, span, pts);
      const bg = browser(ctx, "arsipkarya.example/upload", "Upload karya");
      if (S.i <= 1) step2(ctx, bg, { t: l, ...metaDone, press: S.i === 1 ? (S.p(1) - 0.55) / 0.45 : 0 });
      else step3(ctx, bg, { hi: S.i >= 3 && S.p(3) > 0.5 || S.i > 3 ? "CC BY" : null });
      if (S.i >= 3) {
        const y = panelCard(ctx, "CC BY · CONTOH", 690);
        text(ctx, "Guru memakai postermu", PX + 24, y + 4, 22, { weight: 700, color: C.ink2 });
        miniSlide(ctx, PX + 20, y + 22, 330, "Poster: Sinta, Tim 10A · CC BY", { capColor: GREEN });
        AR.rules(ctx, PX + 20, y + 230, PW - 40, "CC BY");
        card(ctx, PX + 20, y + 394, PW - 40, 70, { fill: "#FFF3D6", r: 12 }); text(ctx, "Wajib: sebut pembuat", PX + PW / 2, y + 438, 24, { align: "center", weight: 900, color: C.accentDark });
      }
      ptr(ctx, P);
    },
    lis_sa(ctx, b, l) {
      const a = A(b), span = SP(b); const P = W.path(l, span, [{ x: 760, y: 433, d: 0.2 }, { x: 760, y: 517, d: 1 }, { x: 760, y: 517, d: 3 }]);
      const bg = browser(ctx, "arsipkarya.example/upload", "Upload karya");
      step3(ctx, bg, { hi: "CC BY-SA" });
      const y = panelCard(ctx, "CC BY-SA · CONTOH", 690);
      AR.poster(ctx, PX + 28, y + 10, 130, 173); AR.badge(ctx, PX + 28, y + 196, "CC BY-SA", { size: 16 });
      const v = ease((l - a * 0.3) / 0.5);
      ctx.globalAlpha = v; ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(PX + 168, y + 96); ctx.lineTo(PX + 200, y + 96); ctx.stroke();
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(PX + 210, y + 96); ctx.lineTo(PX + 196, y + 86); ctx.lineTo(PX + 196, y + 106); ctx.fill();
      AR.poster(ctx, PX + 214, y + 10, 130, 173, { jawa: true }); AR.badge(ctx, PX + 214, y + 196, "CC BY-SA", { size: 16 });
      text(ctx, "asli", PX + 93, y + 256, 20, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "terjemahan", PX + 279, y + 256, 20, { align: "center", weight: 700, color: C.ink2 }); ctx.globalAlpha = 1;
      AR.rules(ctx, PX + 20, y + 280, PW - 40, "CC BY-SA");
      card(ctx, PX + 20, y + 444, PW - 40, 100, { fill: "#FFF3D6", r: 12 }); text(ctx, "Wajib: sebut pembuat,", PX + PW / 2, y + 484, 23, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "turunan pakai CC BY-SA", PX + PW / 2, y + 520, 23, { align: "center", weight: 900, color: C.accentDark });
      ptr(ctx, P);
    },
    lis_nc(ctx, b, l) {
      const a = A(b), span = SP(b); const P = W.path(l, span, [{ x: 760, y: 517, d: 0.2 }, { x: 760, y: 601, d: 1 }, { x: 760, y: 601, d: 3 }]);
      const bg = browser(ctx, "arsipkarya.example/upload", "Upload karya");
      step3(ctx, bg, { hi: "CC BY-NC" });
      const y = panelCard(ctx, "CC BY-NC · CONTOH", 690);
      // pameran sekolah
      ctx.fillStyle = C.goodBg; rr(ctx, PX + 18, y, PW - 36, 150, 14); ctx.fill();
      ctx.strokeStyle = "#8C6A43"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(PX + 70, y + 140); ctx.lineTo(PX + 95, y + 20); ctx.lineTo(PX + 120, y + 140); ctx.stroke();
      AR.poster(ctx, PX + 56, y + 18, 78, 104);
      text(ctx, "✓", PX + 170, y + 64, 36, { weight: 900, color: GREEN }); text(ctx, "Pameran", PX + 210, y + 62, 24, { weight: 800 }); text(ctx, "sekolah", PX + 210, y + 92, 24, { weight: 800 });
      const v = ease((l - a * 0.35) / 0.5); ctx.globalAlpha = v;
      ctx.fillStyle = "#FBE1DF"; rr(ctx, PX + 18, y + 164, PW - 36, 150, 14); ctx.fill(); shirt(ctx, PX + 95, y + 240, 120);
      text(ctx, "✗", PX + 170, y + 228, 36, { weight: 900, color: RED }); text(ctx, "Kaos untuk", PX + 210, y + 226, 24, { weight: 800 }); text(ctx, "dijual", PX + 210, y + 256, 24, { weight: 800 });
      ctx.fillStyle = "#FFFFFF"; rr(ctx, PX + 206, y + 270, 128, 32, 8); ctx.fill(); text(ctx, "Rp85.000", PX + 270, y + 294, 20, { align: "center", weight: 900, color: RED });
      ctx.globalAlpha = 1;
      AR.rules(ctx, PX + 20, y + 330, PW - 40, "CC BY-NC");
      ptr(ctx, P);
    },
    lis_pilih(ctx, b, l) {
      const span = SP(b);
      const pts = [{ x: 760, y: 601, d: 0.2 }, { x: 432, y: 517, d: 1.0, click: true }, { x: 412, y: 760, d: 1.0, click: true }, { x: 1270, y: 762, d: 1.0, click: true }, { x: 1270, y: 762, d: 0.8 }];
      const { S, P } = run(l, span, pts);
      const bg = browser(ctx, "arsipkarya.example/upload", "Upload karya", { loading: S.i === 4 ? S.p(4) : 0 });
      const sel = S.i > 1 || (S.i === 1 && S.p(1) > 0.6) ? "CC BY-SA" : null, check = S.i > 2 || (S.i === 2 && S.p(2) > 0.6);
      step3(ctx, bg, { sel, check, press: S.i === 3 ? (S.p(3) - 0.55) / 0.45 : 0 });
      AR.steps(ctx, PX, WIN.y, PW, "LANGKAH", ["Pilih CC BY-SA", "Centang pernyataan", "Klik Terbitkan"], stepN(S, [1, 2, 3]));
      ptr(ctx, P);
    },
    terbit(ctx, b, l) {
      const a = A(b), span = SP(b);
      const bg = browser(ctx, "arsipkarya.example/karya/3051", SINTA.title);
      const keys = ["title", "by", "date", "tags", "lic"], k = Math.floor(clamp((l - a * 0.12) / (a * 0.78), 0, 0.999) * 5);
      const g = AR.workPage(ctx, bg, "sinta", { mark: l > a * 0.12 ? keys[k] : null });
      if (l < 3) { ctx.globalAlpha = 1 - clamp((l - 2.4) / 0.6, 0, 1); ctx.fillStyle = GREEN; rr(ctx, g.img.x + 10, g.img.y + g.img.h - 64, g.img.w - 20, 50, 25); ctx.fill();
        text(ctx, "✓ Karya diterbitkan", g.img.x + g.img.w / 2, g.img.y + g.img.h - 31, 21, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.globalAlpha = 1; }
      const y = panelCard(ctx, "HALAMAN KARYA", 470);
      ["Judul", "Pembuat", "Tanggal", "Kata kunci", "Lisensi"].forEach((s, i) => { const on = l > a * 0.12 && i <= k; ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, PX + 18, y + i * 76, PW - 36, 62, 12); ctx.fill();
        text(ctx, s, PX + 40, y + i * 76 + 40, 24, { weight: 800 }); text(ctx, on ? "✓" : "", PX + PW - 48, y + i * 76 + 42, 30, { align: "center", weight: 900, color: GREEN }); });
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 280, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 290, 245, 20, 70, 6); ctx.fill(); rr(ctx, 330, 245, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 268, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 430, 316, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 380 + i * 112, 860, 92, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 438 + i * 112, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 437 + i * 112, 27, { weight: 700, fit: 750 }); });
      card(ctx, 1130, 370, 580, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "Contoh catatan Dito", 1160, 414, 24, { weight: 900, color: C.ink2 });
      [["Judul", "Foto Warung Kopi Pak Darto"], ["Pembuat", "Dito, Tim 10A"], ["Tanggal", "3 Nov 2026"], ["Deskripsi", "Warung dekat sekolah, pagi hari."], ["Kata kunci", "warung, kopi, kampung"], ["Lisensi", "CC BY-NC: tidak untuk dijual"]].forEach(([k, v], i) => {
        const y = 436 + i * 56; ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(1160, y, 520, 56);
        text(ctx, k, 1176, y + 36, 21, { weight: 800, color: C.ink2 }); text(ctx, v, 1300, y + 36, 21, { weight: 700, fit: 370, color: i === 5 ? BLUE : C.ink }); });
    },
    cari_karya(ctx, b, l) {
      const span = SP(b);
      const pts = [{ x: 900, y: 600, d: 0.2 }, { x: 650, y: 262, d: 0.9, click: true }, { x: 650, y: 262, d: 1.0 }, { x: 650, y: 262, d: 0.5 }, { x: 650, y: 262, d: 0.8 }, { x: 340, y: 520, d: 1.2, click: true }, { x: 340, y: 520, d: 0.6 }];
      const { S, P } = run(l, span, pts);
      const q = S.at(2) ? W.typed("wayang", S.p(2) / 0.9) : "", entered = S.at(3) && S.p(3) > 0.5;
      const bg = browser(ctx, entered ? "arsipkarya.example/cari?q=wayang" : "arsipkarya.example", entered ? "wayang - Arsip Karya" : "Arsip Karya", { loading: S.i === 4 ? S.p(4) : 0 });
      if (entered && (S.i > 4 || S.p(4) > 0.3)) AR.results(ctx, bg, ["gunungan", "kelir", "golek"], { query: "wayang", alpha: S.i > 4 ? 1 : ease((S.p(4) - 0.3) / 0.7), hi: S.i >= 5 && S.p(5) > 0.5 ? 0 : null });
      else home(ctx, bg, { user: "Dito", query: q, focus: S.at(1) && S.p(1) > 0.55, caret: Math.floor(l * 2.4) % 2 === 0 });
      AR.steps(ctx, PX, WIN.y, PW, "LANGKAH", ["Klik kotak pencarian", "Ketik wayang, tekan Enter", "Klik hasil pertama"], stepN(S, [1, 3, 5]));
      ptr(ctx, P, S.i === 3 ? { keys: ["Enter"], press: S.u } : null);
    },
    baca_lisensi(ctx, b, l) {
      const a = A(b), span = SP(b);
      const P = W.path(l, span, [{ x: 340, y: 520, d: 0.2 }, { x: 690, y: 735, d: 1.0 }, { x: 690, y: 735, d: 1.2 }, { x: 900, y: 650, d: 1.0 }, { x: 900, y: 650, d: 2 }]);
      const bg = browser(ctx, "arsipkarya.example/karya/2187", GUN.title);
      const onLic = l > span * (3.2 / 5.4);
      const g = AR.workPage(ctx, bg, "gunungan", { user: "Dito", free: true, mark: onLic ? "lic" : l > span * 0.2 ? "dl" : null });
      if (l > span * 0.3 && !onLic) callout(ctx, 1000, 770, "Tunggu! Baca lisensinya dulu.", null, null, { color: C.accentDark, fill: "#FFF3D6", size: 24 });
      if (onLic) {
        const y = panelCard(ctx, "CC BY ARTINYA", 420);
        AR.rules(ctx, PX + 20, y, PW - 40, "CC BY");
        card(ctx, PX + 20, y + 166, PW - 40, 110, { fill: "#FFF3D6", r: 12 }); text(ctx, "Wajib: tulis", PX + PW / 2, y + 210, 24, { align: "center", weight: 900, color: C.accentDark });
        text(ctx, "atribusinya", PX + PW / 2, y + 246, 24, { align: "center", weight: 900, color: C.accentDark });
      }
      ptr(ctx, P);
    },
    tasl(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "ATRIBUSI YANG BENAR: T · A · S · L", 960, 214, 34, { align: "center", weight: 900, color: C.accentDark });
      const cols = [["T", "Title", "Judul", GUN.title], ["A", "Author", "Pembuat", GUN.by], ["S", "Source", "Sumber", "arsipkarya.example/karya/2187"], ["L", "License", "Lisensi", "CC BY"]];
      cols.forEach(([c, en, id, v], i) => { const u = ease((l - 0.5 - i * a * 0.12) / 0.4); if (u <= 0) return; const x = 220 + i * 380; ctx.globalAlpha = u;
        card(ctx, x, 260, 350, 330, { fill: C.bg2, r: 20 });
        text(ctx, c, x + 175, 370, 96, { align: "center", weight: 900, color: C.kiko });
        text(ctx, en, x + 175, 420, 26, { align: "center", weight: 700, color: C.ink2 }); text(ctx, id, x + 175, 466, 34, { align: "center", weight: 900 });
        ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 20, 500, 310, 64, 12); ctx.fill(); text(ctx, v, x + 175, 542, 22, { align: "center", weight: 800, color: BLUE, fit: 290 }); ctx.globalAlpha = 1; });
      if (l > a * 0.68) { card(ctx, 220, 630, 1480, 110, { fill: "#FFFFFF", stroke: GREEN, lw: 4, r: 16 }); text(ctx, "Contoh:", 250, 696, 26, { weight: 900, color: GREEN });
        text(ctx, AR.attr("gunungan"), 370, 696, 27, { weight: 800, fit: 1300 }); }
    },
    tempel_atribusi(ctx, b, l) {
      const a = A(b), span = SP(b), cut = span * 0.36;
      if (l < cut) {
        const P = W.path(l, cut, [{ x: 900, y: 650, d: 0.3 }, { x: 1000, y: 712, d: 1.0, click: true }, { x: 1000, y: 712, d: 0.8 }]);
        const bg = browser(ctx, "arsipkarya.example/karya/2187", GUN.title);
        const copied = l > cut * (0.3 + 0.55 * 1 / 2.1) + cut * 0.2;
        const g = AR.workPage(ctx, bg, "gunungan", { user: "Dito", free: true, copied, mark: "attr", press: { attr: P.i === 1 ? P.click : 0 } });
        if (copied) { ctx.fillStyle = "#26323B"; rr(ctx, g.img.x + 10, g.img.y + g.img.h - 64, g.img.w - 20, 50, 25); ctx.fill(); text(ctx, "✓ Atribusi disalin", g.img.x + g.img.w / 2, g.img.y + g.img.h - 31, 21, { align: "center", weight: 800, color: "#FFFFFF" }); }
        AR.steps(ctx, PX, WIN.y, PW, "LANGKAH", ["Klik Salin atribusi", "Klik di bawah foto", "Tekan Ctrl+V", "Dipotong? Tulis keterangan"], copied ? 1 : 0);
        ptr(ctx, P);
        return;
      }
      const l2 = l - cut, s2 = span - cut;
      const S = W.seq(l2, s2, [0.9, 0.9, 1.4, 1.6]);
      const P = W.path(l2, s2, [{ x: 1000, y: 712, d: 0.9, click: false }, { x: 1080, y: 650, d: 0.9, click: true }, { x: 1080, y: 650, d: 1.4 }, { x: 1300, y: 520, d: 1.6 }]);
      const pasted = S.i > 2 || (S.i === 2 && S.p(2) > 0.4), crop = S.i === 3 && S.p(3) > 0.15;
      const cap = AR.attr("gunungan") + (crop ? " · dipotong dari aslinya" : "");
      AR.slideApp(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { caption: pasted ? cap : "", typed: 1, capMark: pasted });
      AR.steps(ctx, PX, WIN.y, PW, "LANGKAH", ["Klik Salin atribusi", "Klik di bawah foto", "Tekan Ctrl+V", "Dipotong? Tulis keterangan"], 1 + stepN(S, [1, 2, 3]));
      ptr(ctx, P, S.i === 2 && S.p(2) < 0.8 ? { keys: ["Ctrl", "V"], press: S.p(2) / 0.8 } : null);
    },
    salah_atribusi(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "KESALAHAN 1: GAMBAR TANPA ATRIBUSI", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 220, 250, 720, 540, { fill: "#FDF1F0", stroke: RED, lw: 4, r: 20 }); text(ctx, "✗ tanpa atribusi", 580, 302, 30, { align: "center", weight: 900, color: RED });
      miniSlide(ctx, 260, 340, 640, "", { title: "Gunungan dalam Wayang", art: "gunungan" });
      callout(ctx, 400, 750, "Siapa pembuatnya? Dari mana?", null, null, { color: RED, fill: "#FFFFFF", size: 24 });
      if (l > a * 0.5) { card(ctx, 980, 250, 720, 540, { fill: "#F2FAF4", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "✓ dengan atribusi", 1340, 302, 30, { align: "center", weight: 900, color: GREEN });
        miniSlide(ctx, 1020, 340, 640, AR.attr("gunungan"), { title: "Gunungan dalam Wayang", art: "gunungan", capColor: C.ink });
        text(ctx, "Judul · Pembuat · Sumber · Lisensi", 1340, 750, 24, { align: "center", weight: 800, color: GREEN }); }
    },
    salah_gratis(ctx, b, l) {
      const a = A(b), span = SP(b);
      const P = W.path(l, span, [{ x: 900, y: 600, d: 0.2 }, { x: 690, y: 735, d: 1.0 }, { x: 690, y: 735, d: 1.2 }, { x: 900, y: 650, d: 1.0 }, { x: 900, y: 650, d: 2 }]);
      const bg = browser(ctx, "arsipkarya.example/karya/1904", AR.WORKS.kawung.title);
      const onLic = l > span * (3.2 / 5.4);
      AR.workPage(ctx, bg, "kawung", { user: "Dito", free: true, mark: onLic ? "lic" : l > span * 0.2 ? "dl" : null });
      if (l > span * 0.25 && !onLic) callout(ctx, 980, 790, "Bisa di-download ≠ boleh dipakai", null, null, { color: RED, fill: "#FFFFFF", size: 24 });
      if (onLic) { const y = panelCard(ctx, "YANG BISA KAMU LAKUKAN", 470);
        ["Minta izin tertulis kepada pembuatnya", "Cari karya lain berlisensi CC", "Foto atau buat sendiri"].forEach((s, i) => { const v = ease((l - span * 0.62 - i * 0.6) / 0.4); if (v <= 0) return; ctx.globalAlpha = v;
          ctx.fillStyle = C.goodBg; rr(ctx, PX + 18, y + i * 124, PW - 36, 108, 12); ctx.fill(); text(ctx, String(i + 1), PX + 46, y + i * 124 + 64, 30, { align: "center", weight: 900, color: GREEN });
          para(ctx, s, PX + 80, y + i * 124 + 46, 23, PW - 120, { weight: 800, lh: 1.25 }); ctx.globalAlpha = 1; }); }
      ptr(ctx, P);
    },
    periksa(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "PERIKSA HASILMU", 960, 214, 34, { align: "center", weight: 900, color: C.accentDark });
      const cols = [["Karyamu", ["Judul yang jelas", "Pembuat dan tanggal", "Deskripsi dan kata kunci", "Lisensi yang dipilih"]], ["Karya orang lain", ["Lisensinya dibaca dulu", "Atribusi: T · A · S · L", "Keterangan bila diubah", "Tanpa lisensi? Minta izin"]]];
      cols.forEach(([h, items], c) => { const x = 240 + c * 740; card(ctx, x, 250, 700, 520, { fill: C.bg2, r: 20 }); text(ctx, h, x + 350, 306, 32, { align: "center", weight: 900 });
        items.forEach((s, i) => { const on = l > a * (0.12 + (c * 4 + i) * 0.09); const y = 340 + i * 102; ctx.fillStyle = on ? C.goodBg : "#FFFFFF"; rr(ctx, x + 30, y, 640, 84, 14); ctx.fill();
          text(ctx, s, x + 60, y + 53, 28, { weight: 800 }); text(ctx, on ? "✓" : "?", x + 630, y + 56, 34, { align: "center", weight: 900, color: on ? GREEN : C.ink2 }); }); });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan E.9", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Pemilih lisensi", 620, 414, 28, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "Penyusun atribusi", 620, 452, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 340, 500, 560, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/e9", 620, 546, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "jawab, lalu periksa petunjuknya", 620, 636, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Buka slide tugasmu yang terakhir. Beri atribusi lengkap pada setiap gambar yang bukan buatanmu.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
