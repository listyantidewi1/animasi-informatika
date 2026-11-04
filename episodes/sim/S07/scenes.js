/* S07 Simulasi praktik: dokumen rapi (Judul 1, Judul 2, daftar bernomor, gambar, keterangan) lalu simpan sebagai PDF.
   Jendela aplikasi di kiri (x 110–1410, y 122–822), panel langkah dan label di kanan (x 1450–1820). Isi panduan rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, D = K.dok;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 }, PX = 1450, PW = 370;
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";

  // ---------- isi panduan (rekaan) ----------
  const T = {
    h1: "Aman di Internet", h2: "Bab 1: Kata Sandi yang Aman",
    p: "Kata sandi adalah kunci akunmu. Sandi yang kuat sulit ditebak orang lain, tetapi tetap mudah kamu ingat.",
    ol: ["Pilih tiga kata acak yang mudah kamu ingat.", "Gabungkan, lalu tambahkan angka dan simbol.", "Jangan memakai sandi yang sama di akun lain."],
    p2: "Jangan memakai sandi seperti ini:", ul: ["tanggal lahirmu", "namamu sendiri", "123456 atau qwerty"],
    cap: "Gambar 1. Sandi yang kuat melindungi akunmu.", h2b: "Bab 2: Mencari Informasi yang Jitu"
  };
  const PARTS = [["h1", 1, { t: "h1", s: T.h1 }], ["h2", 2, { t: "h2", s: T.h2 }], ["p", 3, { t: "p", s: T.p }], ["ol", 4, { t: "ol", items: T.ol }],
    ["p2", 5, { t: "p", s: T.p2 }], ["ul", 5, { t: "ul", items: T.ul }], ["img", 6, { t: "img", kind: "gembok", wf: 0.5, ratio: 0.62, label: "gembok.png" }],
    ["cap", 7, { t: "cap", s: T.cap }], ["h2b", 8, { t: "h2", s: T.h2b }]];
  // doc(k, mod): blok dokumen sampai tahap k; mod[nama] menimpa sifat blok; mod.add = blok tambahan di akhir
  function doc(k, mod = {}) {
    const out = []; PARTS.forEach(([n, need, b]) => { if (k >= need) out.push({ ...b, ...(mod[n] || {}) }); });
    return out.concat(mod.add || []);
  }
  function app(ctx, opt = {}) { return D.docApp(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { outline: true, ...opt }); }
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.9);
  const ptr = (ctx, p, kind) => L.cursor(ctx, p.x, p.y, { click: p.click, down: p.down, kind });
  const keys = (ctx, k, press) => L.keys(ctx, 1635, 700, [].concat(k), { press, align: "center", size: 30 });
  const steps = (ctx, items, n, title) => D.steps(ctx, PX, 122, PW, title || "LANGKAH", items, n);
  const blink = l => Math.floor(l * 2.2) % 2 === 0;
  const styleItem = (g, i) => ({ x: g.tool("style").x + 140, y: g.tool("style").y + 44 + 7 + i * 58 + 29 });
  const lineOf = (g, i, dx = 0.4) => { const r = g.blocks[i]; return { x: r.x + r.w * dx, y: r.y + (r.textH ? Math.min(r.textH, 50) / 2 + (r.ty - r.y - r.size * 0.95) : r.h / 2) }; };

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["memberi judul dengan gaya Judul", "membuat daftar bernomor", "menyisipkan dan merapikan gambar", "menyimpan sebagai PDF"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 800, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      // dokumen kecil + lencana PDF
      ctx.save(); ctx.beginPath(); ctx.rect(1150, 250, 420, 480); ctx.clip();
      D.docPages(ctx, 1170, 260, 380, doc(7), { z: 0.5 }); ctx.restore();
      ctx.fillStyle = RED; rr(ctx, 1480, 600, 150, 90, 14); ctx.fill(); text(ctx, "PDF", 1555, 660, 44, { align: "center", weight: 900, color: "#FFFFFF" });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SIMULASI INI MELENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 330, 300, 600, 330, { fill: C.bg2, r: 22 });
      text(ctx, "D7.8", 630, 380, 56, { align: "center", weight: 900, color: C.kiko }); para(ctx, "Proyek: Panduan Digital untuk Adik Kelas", 630, 440, 34, 520, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "tiga bab: aturan, contoh, gambar", 630, 590, 26, { align: "center", weight: 600, color: C.ink2 });
      card(ctx, 990, 300, 600, 330, { fill: "#FFF9E0", r: 22 }); text(ctx, "Siapkan", 1290, 370, 34, { align: "center", weight: 900 });
      ["isi bab dari timmu", "satu gambar per bab", "aplikasi dokumen apa pun"].forEach((s, i) => { text(ctx, "•  " + s, 1060, 440 + i * 56, 30, { weight: 700 }); });
      kiko(ctx, 1640, 720, 100, 0, { wave: l });
    },
    kenal_layar(ctx, b, l) {
      const g = app(ctx, { blocks: [{ t: "p", s: "", caret: blink(l) }] }); const a = b.audio || b.dur;
      if (l > a * 0.12) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, WIN.x + 8, WIN.y + 48, 600, 36, 8); ctx.stroke(); L.callout(ctx, PX, 170, "Bilah menu", WIN.x + 600, WIN.y + 66); }
      if (l > a * 0.35) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, WIN.x + 8, WIN.y + 88, 1000, 50, 8); ctx.stroke(); L.callout(ctx, PX, 300, "Bilah alat", WIN.x + 1008, WIN.y + 112); }
      if (l > a * 0.6) { L.callout(ctx, PX, 440, "Halaman: tempat menulis", g.page.x + g.page.w - 20, g.page.y + 160); }
    },
    kenal_gaya(ctx, b, l) {
      const sp = spanOf(b), S = D.seq(l, sp, [1.2, 1, 3]); const open = S.at(2);
      const g = app(ctx, { blocks: [{ t: "p", s: "", caret: blink(l) }], hot: S.i >= 1 && !open ? "style" : null, styleOpen: open });
      const st = g.tool("style");
      if (l > sp * 0.08) L.callout(ctx, PX, 170, "Kotak gaya", st.x + st.w, st.cy);
      if (open) { D.styleList(ctx, st.x, st.y + 44, null, "Teks normal"); L.callout(ctx, PX, 330, "Judul 1 dan Judul 2 untuk judul bab", st.x + 290, st.y + 44 + 7 + 58 * 1.5); }
      ptr(ctx, D.path(l, sp, [{ x: 760, y: 560, d: 1.2 }, { x: st.cx, y: st.cy, d: 1, click: true }, { x: st.cx, y: st.cy + 4, d: 3 }], { x: 760, y: 560 }));
    },
    judul1(ctx, b, l) {
      const sp = spanOf(b), ds = [3.2, 1, 1, 1.4, 1], S = D.seq(l, sp, ds);
      const done = S.p(3) >= 0.6, open = !done && (S.i === 3 || (S.i === 2 && S.u >= 0.6));
      const blk = done ? { t: "h1", s: T.h1 } : { t: "p", s: T.h1, typed: T.h1.length * clamp(S.p(0) / 0.9, 0, 1), caret: S.i < 1 ? true : blink(l) };
      const g = app(ctx, { blocks: [blk], style: done ? "Judul 1" : "Teks normal", size: done ? 20 : 11, styleOpen: open, hot: open ? "style" : null });
      const st = g.tool("style"); if (open) D.styleList(ctx, st.x, st.y + 44, S.i === 3 ? 1 : null, "Teks normal");
      steps(ctx, ["Ketik: Aman di Internet.", "Klik baris itu.", "Kotak gaya → Judul 1."], S.i === 0 ? 0 : S.i === 1 ? 1 : done ? 3 : 2);
      if (done && S.i >= 4) L.callout(ctx, PX, 420, "Gaya Judul 1: besar dan tebal", g.blocks[0].x + 380, g.blocks[0].y + 30);
      const ln = lineOf(g, 0, 0.3), it = styleItem(g, 1);
      ptr(ctx, D.path(l, sp, [{ x: 900, y: 640, d: ds[0] }, { ...ln, d: ds[1], click: true }, { x: st.cx, y: st.cy, d: ds[2], click: true }, { ...it, d: ds[3], click: true }, { ...it, d: ds[4] }], { x: 900, y: 640 }));
    },
    judul2(ctx, b, l) {
      const sp = spanOf(b), ds = [0.7, 3.4, 1, 1.4, 1.2], S = D.seq(l, sp, ds);
      const done = S.p(3) >= 0.6, open = !done && (S.i === 3 || (S.i === 2 && S.u >= 0.6));
      const add = S.at(0) && S.p(0) > 0.45 ? [done ? { t: "h2", s: T.h2 } : { t: "p", s: T.h2, typed: T.h2.length * clamp(S.p(1) / 0.9, 0, 1), caret: S.i <= 1 || blink(l) }] : [];
      const blocks = doc(1, { add }); if (!add.length) blocks[0].caret = true;
      const g = app(ctx, { blocks, style: done ? "Judul 2" : S.p(0) > 0.45 ? "Teks normal" : "Judul 1", size: done ? 15 : S.p(0) > 0.45 ? 11 : 20, styleOpen: open, hot: open ? "style" : null });
      const st = g.tool("style"); if (open) D.styleList(ctx, st.x, st.y + 44, S.i === 3 ? 2 : null, "Teks normal");
      if (S.i === 0) keys(ctx, "Enter", S.u);
      steps(ctx, ["Tekan Enter.", "Ketik nama bab.", "Kotak gaya → Judul 2."], S.i === 0 ? 0 : S.i === 1 ? 1 : done ? 3 : 2);
      if (done && S.i >= 4) L.callout(ctx, PX, 420, "Judul 2: subjudul, sedikit lebih kecil", g.blocks[1].x + 520, g.blocks[1].y + 40);
      const ln = g.blocks[1] ? lineOf(g, 1, 0.3) : { x: 800, y: 470 }, it = styleItem(g, 2);
      ptr(ctx, D.path(l, sp, [{ x: 960, y: 650, d: ds[0] + ds[1] }, { x: st.cx, y: st.cy, d: ds[2], click: true }, { ...it, d: ds[3], click: true }, { ...it, d: ds[4] }], { x: 960, y: 650 }));
    },
    paragraf(ctx, b, l) {
      const sp = spanOf(b), ds = [0.8, 4.2, 0.8], S = D.seq(l, sp, ds); const on = S.p(0) > 0.45;
      const add = on ? [{ t: "p", s: T.p, typed: T.p.length * clamp(S.p(1) / 0.92, 0, 1), caret: S.i <= 1 || blink(l) }] : [];
      const blocks = doc(2, { add }); if (!on) blocks[1].caret = true;
      const g = app(ctx, { blocks, style: on ? "Teks normal" : "Judul 2", size: on ? 11 : 15, hot: on && S.i <= 1 && S.p(1) < 0.35 ? "style" : null });
      if (S.i === 0) keys(ctx, "Enter", S.u);
      steps(ctx, ["Tekan Enter.", "Gaya kembali: Teks normal.", "Tulis paragraf pendek."], S.i === 0 ? 0 : S.p(1) < 0.35 ? 1 : S.i === 1 ? 2 : 3);
      if (on && S.p(1) < 0.6) L.callout(ctx, PX, 420, "Kembali ke Teks normal", g.tool("style").x + 196, g.tool("style").cy);
    },
    kerangka(ctx, b, l) {
      const a = b.audio || b.dur; const g = app(ctx, { blocks: doc(3), outlineHot: l > a * 0.08 && l < a * 0.55 });
      if (l > a * 0.08) L.callout(ctx, PX, 170, "Kerangka dokumen: daftar judulmu", 380, 380, { maxW: 330 });
      if (l > a * 0.5) {
        const y = 400, h = 250; card(ctx, PX, y, PW, h, { fill: "#FFFFFF", stroke: GREEN, lw: 3, r: 18 });
        text(ctx, "Daftar isi otomatis", PX + 24, y + 46, 25, { weight: 900, color: GREEN });
        [["Aman di Internet", 0], ["Bab 1: Kata Sandi yang Aman", 1]].forEach(([s, lv], i) => { const yy = y + 110 + i * 56;
          text(ctx, s, PX + 24 + lv * 22, yy, lv ? 21 : 23, { weight: lv ? 600 : 800, color: "#1A5FA8", fit: 290 - lv * 22 }); text(ctx, "1", PX + PW - 24, yy, 21, { align: "right", weight: 700, color: C.ink2 }); });
        text(ctx, "Diambil dari gaya judul.", PX + 24, y + 222, 21, { weight: 600, color: C.ink2 });
      }
    },
    nomor_ketik(ctx, b, l) {
      const sp = spanOf(b), ds = [0.7, 3.6, 1.2, 1.2], S = D.seq(l, sp, ds); const on = S.p(0) > 0.45, listed = S.p(2) >= 0.6;
      const add = on ? [listed ? { t: "ol", items: [T.ol[0]], caret: blink(l) } : { t: "p", s: T.ol[0], typed: T.ol[0].length * clamp(S.p(1) / 0.9, 0, 1), caret: S.i <= 1 || blink(l) }] : [];
      const blocks = doc(3, { add }); if (!on) blocks[2].caret = true;
      const g = app(ctx, { blocks, on: { ol: listed }, hot: S.i === 2 && !listed ? "ol" : null });
      if (S.i === 0) keys(ctx, "Enter", S.u);
      steps(ctx, ["Tekan Enter.", "Ketik langkah pertama.", "Klik tombol daftar bernomor."], S.i === 0 ? 0 : S.i === 1 ? 1 : listed ? 3 : 2);
      const olb = g.tool("ol"); if (S.at(2)) L.callout(ctx, PX, 400, "Daftar bernomor", olb.cx, olb.y + olb.h);
      ptr(ctx, D.path(l, sp, [{ x: 1000, y: 700, d: ds[0] + ds[1] }, { x: olb.cx, y: olb.cy, d: ds[2], click: true }, { x: olb.cx + 4, y: olb.cy + 6, d: ds[3] }], { x: 1000, y: 700 }));
    },
    nomor_enter(ctx, b, l) {
      const sp = spanOf(b), ds = [0.6, 2.6, 0.6, 2.6, 1], S = D.seq(l, sp, ds);
      let n = 1; if (S.p(0) > 0.45) n = 1.001 + clamp(S.p(1) / 0.9, 0, 0.999); if (S.p(2) > 0.45) n = 2.001 + clamp(S.p(3) / 0.9, 0, 0.999); if (S.at(4)) n = 3;
      const g = app(ctx, { blocks: doc(3, { add: [{ t: "ol", items: T.ol, typed: n, caret: S.i < 4 || blink(l) }] }), on: { ol: true } });
      if (S.i === 0) keys(ctx, "Enter", S.u); if (S.i === 2) keys(ctx, "Enter", S.u);
      steps(ctx, ["Tekan Enter: muncul angka 2.", "Ketik langkah kedua.", "Enter, lalu langkah ketiga."], S.i === 0 ? 0 : S.i === 1 ? 1 : S.i < 4 ? 2 : 3);
      if (S.at(1)) { const r = g.blocks[3].items[1]; if (r) L.callout(ctx, PX, 420, "Nomornya muncul sendiri", r.x + 14, r.y + 18); }
    },
    poin(ctx, b, l) {
      const sp = spanOf(b), ds = [0.5, 1.6, 0.5, 1, 2.6, 1.6], S = D.seq(l, sp, ds);
      const on = S.p(0) > 0.45, onUl = S.p(3) >= 0.6, scroll = 150 * ease(clamp(S.p(1) * 1.2, 0, 1));
      const add = []; if (on) add.push({ t: "p", s: T.p2, typed: T.p2.length * clamp(S.p(1) / 0.9, 0, 1), caret: S.i === 1 });
      if (S.p(2) > 0.45) add.push(onUl ? { t: "ul", items: T.ul, typed: 0.001 + clamp(S.p(4) / 0.9, 0, 1) * 2.999, caret: S.i <= 4 || blink(l) } : { t: "p", s: "", caret: true });
      const g = app(ctx, { blocks: doc(4, { add }), scroll, on: { ul: onUl }, hot: S.i === 3 && !onUl ? "ul" : null });
      if (S.i === 0 || S.i === 2) keys(ctx, "Enter", S.u);
      const ulb = g.tool("ul");
      if (S.i < 5) steps(ctx, ["Ketik: Jangan memakai sandi seperti ini.", "Klik tombol daftar berpoin.", "Ketik contohnya."], S.i <= 2 ? 0 : S.i === 3 ? 1 : S.i === 4 ? 2 : 3);
      else {
        const box = (y, col, bg, h1, s) => { card(ctx, PX, y, PW, 150, { fill: bg, stroke: col, lw: 3, r: 18 }); text(ctx, h1, PX + 24, y + 50, 27, { weight: 900, color: col }); para(ctx, s, PX + 24, y + 96, 23, PW - 48, { weight: 700, lh: 1.25 }); };
        box(150, BLUE, "#E7F1FB", "1. 2. 3.  Bernomor", "untuk langkah yang berurutan"); box(330, GREEN, "#F2FAF4", "•  Berpoin", "untuk daftar yang urutannya tidak penting");
      }
      ptr(ctx, D.path(l, sp, [{ x: 1000, y: 700, d: ds[0] + ds[1] + ds[2] }, { x: ulb.cx, y: ulb.cy, d: ds[3], click: true }, { x: ulb.cx + 6, y: ulb.cy + 8, d: ds[4] + ds[5] }], { x: 1000, y: 700 }));
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 300, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 262, 22, 76, 6); ctx.fill(); rr(ctx, 340, 262, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 280, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 330, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 420 + i * 110, 820, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 476 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 476 + i * 110, 28, { weight: 700, fit: 710 }); });
      card(ctx, 1110, 360, 560, 440, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Hasil yang dituju", 1140, 402, 24, { weight: 900, color: C.ink2 });
      ctx.save(); ctx.beginPath(); ctx.rect(1112, 420, 556, 370); ctx.clip(); ctx.fillStyle = D.UI.work; ctx.fillRect(1112, 420, 556, 370);
      D.docPages(ctx, 1170, 436, 440, doc(4), { z: 440 / 760 }); ctx.restore();
    },
    gambar_sisip(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 1, 1, 1, 1.6, 1, 0.8], S = D.seq(l, sp, ds);
      const inserted = S.at(6);
      const add = inserted ? [] : [{ t: "p", s: "", caret: S.at(1) || blink(l) }];
      const blocks = inserted ? doc(5, { add: [{ t: "img", kind: "gembok", wf: 1, ratio: 0.75, label: "gembok.png", sel: true }] }) : doc(5, { add });
      const menuOpen = S.i >= 1 && S.i <= 3;
      const g = app(ctx, { blocks, scroll: 150, menuOn: menuOpen ? "Sisipkan" : null });
      const mp = g.menu("Sisipkan"); let m1 = null, m2 = null, dlg = null;
      if (menuOpen) { m1 = D.menu(ctx, mp.x - 40, WIN.y + 88, [{ s: "Gambar", sub: true }, "Tabel", "Daftar isi", "Garis horizontal", "Nomor halaman"], { hi: S.i >= 2 ? 0 : null, w: 290 });
        if (S.i >= 2) { const it = m1.item(0); m2 = D.menu(ctx, it.x + 286, it.y - 6, ["Unggah dari komputer", "Ambil dari kamera"], { hi: S.i === 3 && S.u > 0.4 ? 0 : null, w: 320 }); } }
      if (S.i >= 4 && S.i <= 5) { // dialog pilih gambar
        const dx = 330, dy = 250, a = D.dialog(ctx, dx, dy, 860, 470, "Pilih gambar", { dim: WIN });
        text(ctx, "▤  Proyek Panduan 7B", a.x, a.y + 30, 24, { weight: 700, color: C.ink2 });
        const files = [["gembok", "gembok.png"], ["cari", "cari.png"], ["grup", "grup-kelas.png"]];
        dlg = files.map(([k, n], i) => { const fx = a.x + i * 260, fy = a.y + 56; const on = i === 0 && (S.i > 4 || S.u > 0.55);
          if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, fx - 8, fy - 8, 246, 216, 12); ctx.fill(); }
          D.pic(ctx, fx, fy, 230, 150, k, { r: 8 }); text(ctx, n, fx + 115, fy + 188, 22, { align: "center", weight: 700, color: on ? BLUE : C.ink }); return { x: fx + 115, y: fy + 75 }; });
        const ok = D.btn(ctx, dx + 860 - 236, dy + 470 - 82, 200, 56, "Buka", { primary: true, press: S.i === 5 && S.u > 0.6 }); dlg.ok = ok;
      }
      if (inserted) L.callout(ctx, PX, 430, "Gambar masuk, tetapi terlalu besar", 1000, 760, { maxW: 330 });
      steps(ctx, ["Klik di bawah daftar.", "Sisipkan → Gambar.", "Unggah dari komputer.", "Pilih gambar, lalu Buka."], S.i === 0 ? 0 : S.i <= 2 ? 1 : S.i === 3 ? 2 : S.i <= 5 ? 3 : 4);
      const below = { x: 700, y: g.blocks[g.blocks.length - 1].y + 20 };
      const pts = [{ ...below, d: ds[0], click: true }, { x: mp.x, y: mp.y, d: ds[1], click: true }, { x: mp.x + 20, y: WIN.y + 88 + 6 + 23, d: ds[2] }, { x: mp.x + 360, y: WIN.y + 88 + 23 + 6, d: ds[3], click: true },
        { x: dlg ? dlg[0].x : 520, y: dlg ? dlg[0].y : 420, d: ds[4], click: true }, { x: dlg ? dlg.ok.cx : 1050, y: dlg ? dlg.ok.cy : 690, d: ds[5], click: true }, { x: 1100, y: 720, d: ds[6] }];
      ptr(ctx, D.path(l, sp, pts, { x: 1000, y: 700 }));
    },
    gambar_besar(ctx, b, l) {
      const sp = spanOf(b), ds = [2.2, 1.6, 1.2, 1.4], S = D.seq(l, sp, ds); const sel = S.p(2) >= 0.6;
      const scroll = lerp(80, 400, ease(clamp(l / (sp * 0.45), 0, 1)));
      const g = app(ctx, { blocks: doc(5, { add: [{ t: "img", kind: "gembok", wf: 1, ratio: 0.75, label: "gembok.png", sel }] }), pageW: 470, scroll });
      const im = g.blocks[g.blocks.length - 1].img, p1 = g.pages[0], lastTxt = g.blocks[g.blocks.length - 2];
      if (S.at(1)) { const gy = lastTxt.y + lastTxt.h + 10, gh = p1.y + p1.h - gy - 10; if (gh > 30) { ctx.save(); ctx.beginPath(); ctx.rect(WIN.x, 262, WIN.w, 560); ctx.clip(); ctx.fillStyle = "rgba(217,68,59,0.10)"; ctx.fillRect(p1.x + 20, gy, p1.w - 40, gh); ctx.strokeStyle = RED; ctx.setLineDash([8, 6]); ctx.lineWidth = 2.5; ctx.strokeRect(p1.x + 20, gy, p1.w - 40, gh); ctx.setLineDash([]); ctx.restore(); }
        L.callout(ctx, PX, 170, "Ruang kosong di halaman 1", p1.x + p1.w - 30, clamp(gy + gh / 2, 280, 800), { color: RED, fill: "#FDF1F0", maxW: 330 }); }
      if (S.at(1)) L.callout(ctx, PX, 330, "Gambar pindah ke halaman 2", im.x + im.w - 20, clamp(im.y + 40, 280, 800), { color: RED, fill: "#FDF1F0", maxW: 330 });
      if (sel) L.callout(ctx, PX, 490, "Klik gambar: titik-titik di tepinya muncul", im.x + im.w, clamp(im.y + im.h, 280, 810), { maxW: 330 });
      ptr(ctx, D.path(l, sp, [{ x: 1200, y: 700, d: ds[0] + ds[1] }, { x: im.x + im.w * 0.5, y: clamp(im.y + im.h * 0.45, 280, 800), d: ds[2], click: true }, { x: im.x + im.w * 0.55, y: clamp(im.y + im.h * 0.5, 280, 800), d: ds[3] }], { x: 1200, y: 700 }));
    },
    gambar_sudut(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 2.6, 0.6, 1.6], S = D.seq(l, sp, ds); const released = S.p(2) >= 0.3;
      const scroll = released ? lerp(400, 160, ease(clamp(S.p(3) * 1.6, 0, 1))) : 400;
      const g = app(ctx, { blocks: doc(5, { add: [{ t: "img", kind: "gembok", wf: released ? 0.5 : 1, ratio: 0.75, label: "gembok.png", sel: true, hot: released ? null : "br" }] }), pageW: 470, scroll });
      const im = g.blocks[g.blocks.length - 1].img;
      const f = released ? 0.5 : lerp(1, 0.5, ease(clamp(S.p(1) / 0.9, 0, 1)));
      let corner = { x: im.x + im.w, y: im.y + im.h };
      if (!released) { const gw = im.w * f, gh = im.h * f; corner = { x: im.x + gw, y: im.y + gh }; if (S.at(1)) { ctx.save(); ctx.beginPath(); ctx.rect(WIN.x, 262, WIN.w, 560); ctx.clip(); ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.setLineDash([10, 7]); ctx.strokeRect(im.x, im.y, gw, gh); ctx.setLineDash([]); ctx.restore(); } }
      // perbandingan: titik sisi vs titik sudut
      const cmpY = 150; card(ctx, PX, cmpY, PW, 330, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "Titik sisi", PX + 92, cmpY + 44, 23, { align: "center", weight: 900, color: RED }); text(ctx, "Titik sudut", PX + 278, cmpY + 44, 23, { align: "center", weight: 900, color: GREEN });
      ctx.save(); ctx.translate(PX + 52, cmpY + 90); ctx.scale(0.6, 1.45); D.pic(ctx, 0, 0, 140, 105, "gembok", { r: 6 }); ctx.restore(); D.pic(ctx, PX + 208, cmpY + 120, 140, 105, "gembok", { r: 6 });
      text(ctx, "✗ gepeng", PX + 92, cmpY + 290, 24, { align: "center", weight: 800, color: RED }); text(ctx, "✓ tetap rapi", PX + 278, cmpY + 290, 24, { align: "center", weight: 800, color: GREEN });
      if (released && S.p(3) > 0.4) L.callout(ctx, PX, 530, "Muat lagi di halaman 1", im.x + im.w, clamp(im.y + im.h / 2, 280, 800), { fill: C.goodBg, color: GREEN });
      const p0 = { x: im.x + im.w, y: im.y + im.h }, at = D.path(l, sp, [{ x: p0.x, y: clamp(p0.y, 280, 810), d: ds[0] }, { x: corner.x, y: clamp(corner.y, 280, 810), d: ds[1], down: true }, { x: corner.x + 30, y: clamp(corner.y + 20, 280, 810), d: ds[2] + ds[3] }], { x: 1150, y: 700 });
      if (!released && S.at(1)) { at.x = corner.x; at.y = clamp(corner.y, 280, 810); at.down = true; }
      ptr(ctx, at);
    },
    keterangan(ctx, b, l) {
      const sp = spanOf(b), ds = [0.8, 3.2, 1, 1, 1], S = D.seq(l, sp, ds);
      const typed = T.cap.length * clamp(S.p(1) / 0.9, 0, 1), center = S.p(2) >= 0.6, ital = S.p(3) >= 0.6;
      const cap = S.at(1) ? (ital ? { t: "cap", s: T.cap, caret: blink(l) } : { t: "p", s: T.cap, typed, center, caret: S.i <= 1 || blink(l) }) : { t: "p", s: "", caret: true };
      const g = app(ctx, { blocks: doc(5, { add: [{ t: "img", kind: "gembok", wf: 0.5, ratio: 0.62, label: "gembok.png" }, cap] }), scroll: 420, on: { center, italic: ital }, hot: S.i === 2 && !center ? "center" : S.i === 3 && !ital ? "italic" : null });
      steps(ctx, ["Klik di bawah gambar.", "Ketik keterangannya.", "Klik rata tengah.", "Klik miring."], S.i === 0 ? 0 : S.i === 1 ? 1 : S.i === 2 && !center ? 2 : S.i <= 3 && !ital ? 3 : 4);
      const cb = g.tool("center"), ib = g.tool("italic"), cr = g.blocks[g.blocks.length - 1];
      if (ital && S.at(4)) L.callout(ctx, PX, 430, "Keterangan: kecil, miring, di tengah", cr.x + cr.w / 2 + 150, cr.y + 14, { maxW: 330 });
      ptr(ctx, D.path(l, sp, [{ x: cr.x + cr.w / 2, y: cr.y + 16, d: ds[0], click: true }, { x: cr.x + cr.w / 2 + 40, y: cr.y + 60, d: ds[1] }, { x: cb.cx, y: cb.cy, d: ds[2], click: true }, { x: ib.cx, y: ib.cy, d: ds[3], click: true }, { x: ib.cx + 10, y: ib.cy + 30, d: ds[4] }], { x: 1000, y: 700 }));
    },
    nama_file(ctx, b, l) {
      const sp = spanOf(b), ds = [1.2, 3.4, 0.8, 1], S = D.seq(l, sp, ds); const name = "Panduan Aman Internet 7B"; const done = S.p(2) > 0.45;
      const g = app(ctx, { blocks: doc(8), title: done ? "Dokumen — " + name : "Dokumen — Tanpa judul" });
      const tx = WIN.x + WIN.w / 2;
      if (!done && S.p(0) >= 0.6) { ctx.fillStyle = "#FFFFFF"; rr(ctx, tx - 300, WIN.y + 6, 600, 36, 6); ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 3; rr(ctx, tx - 300, WIN.y + 6, 600, 36, 6); ctx.stroke();
        const s = D.typed(name, S.p(1) / 0.9); text(ctx, s, tx - 284, WIN.y + 33, 22, { weight: 700 }); if (S.i <= 1 || blink(l)) { ctx.font = "700 22px Inter"; ctx.fillStyle = C.ink; ctx.fillRect(tx - 282 + ctx.measureText(s).width, WIN.y + 12, 2.5, 24); } }
      else if (!done) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, tx - 190, WIN.y + 6, 380, 36, 6); ctx.stroke(); }
      if (S.i === 2) keys(ctx, "Enter", S.u);
      steps(ctx, ["Klik tulisan Tanpa judul.", "Ketik nama yang jelas.", "Tekan Enter."], S.i === 0 ? 0 : S.i === 1 ? 1 : done ? 3 : 2);
      if (done) L.callout(ctx, PX, 430, "Nama jelas: mudah dicari di antara banyak file", tx + 260, WIN.y + 24, { maxW: 330 });
      L.callout(ctx, PX, 600, "Di aplikasi lain, nama diberikan saat menyimpan file.", null, null, { fill: "#E7F1FB", color: BLUE, size: 22, maxW: 330 });
      ptr(ctx, D.path(l, sp, [{ x: tx + 30, y: WIN.y + 26, d: ds[0], click: true }, { x: tx + 60, y: WIN.y + 90, d: ds[1] + ds[2] + ds[3] }], { x: 900, y: 600 }));
    },
    unduh_pdf(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 1.2, 1.4, 1, 1.4], S = D.seq(l, sp, ds); const name = "Panduan Aman Internet 7B";
      const open = S.i >= 1 && S.i <= 3;
      const g = app(ctx, { blocks: doc(8), title: "Dokumen — " + name, menuOn: open ? "File" : null });
      const mp = g.menu("File"); let pdfPt = { x: 700, y: 500 };
      if (open) { const m1 = D.menu(ctx, WIN.x + 16, WIN.y + 88, ["Baru", "Buka", "Buat salinan", { s: "Unduh", sub: true, sep: true }, "Ganti nama", "Cetak"], { hi: S.i >= 2 ? 3 : null, w: 300 });
        if (S.i >= 2) { const it = m1.item(3); const m2 = D.menu(ctx, it.x + 296, it.y - 6, ["Dokumen (.docx)", "Dokumen terbuka (.odt)", "Dokumen PDF (.pdf)", "Teks biasa (.txt)"], { hi: S.i === 3 || S.u > 0.6 ? 2 : null, w: 360 }); pdfPt = m2.item(2); } }
      steps(ctx, ["Klik menu File.", "Pilih Unduh.", "Pilih Dokumen PDF (.pdf)."], S.i === 0 ? 0 : S.i === 1 ? 1 : S.i <= 3 ? 2 : 3);
      if (S.at(3)) L.callout(ctx, PX, 400, "Di aplikasi lain: File → Simpan sebagai → jenis PDF, atau File → Ekspor → PDF.", null, null, { fill: "#E7F1FB", color: BLUE, size: 23, maxW: 330 });
      const it3 = { x: WIN.x + 130, y: WIN.y + 88 + 6 + 12 + 3 * 46 + 23 };
      ptr(ctx, D.path(l, sp, [{ x: mp.x, y: mp.y, d: ds[0], click: true }, { x: WIN.x + 100, y: WIN.y + 88 + 30, d: 0.0001 }, { ...it3, d: ds[1] }, { x: it3.x + 320, y: it3.y + 6 + 2 * 46, d: ds[2], click: true }, { x: pdfPt.cx || it3.x + 360, y: pdfPt.cy || it3.y + 98, d: ds[3] }, { x: 900, y: 640, d: ds[4] }], { x: 800, y: 560 }));
    },
    dialog_pdf(ctx, b, l) {
      const sp = spanOf(b), ds = [1, 1.2, 1, 1.6, 1.6], S = D.seq(l, sp, ds); const name = "Panduan Aman Internet 7B";
      const g = app(ctx, { blocks: doc(8), title: "Dokumen — " + name });
      const saved = S.p(2) >= 0.6, folder = S.p(1) >= 0.6 ? "Proyek Panduan 7B" : "Unduhan";
      let d = null;
      if (!saved) { d = D.saveDialog(ctx, 300, 230, { title: "Simpan sebagai PDF", name: name + ".pdf", folder, folderHi: S.i <= 1, press: S.i === 2 && S.u > 0.5, dim: WIN });
        if (S.i === 1 && S.u < 0.6) D.menu(ctx, d.folder.x, d.folder.y + d.folder.h + 4, ["Unduhan", "Dokumen", "Proyek Panduan 7B"], { hi: S.u > 0.3 ? 2 : null, w: 400 }); }
      else { const ty = WIN.y + WIN.h - 96; ctx.fillStyle = "#2B3A44"; rr(ctx, WIN.x + 200, ty, 900, 70, 14); ctx.fill(); text(ctx, "✓  " + name + ".pdf tersimpan di Proyek Panduan 7B", WIN.x + 650, ty + 45, 24, { align: "center", weight: 700, color: "#FFFFFF", fit: 860 }); }
      steps(ctx, ["Pilih folder proyek timmu.", "Klik Simpan."], S.i <= 1 ? 0 : saved ? 2 : 1);
      if (S.at(3)) { const y = 330; card(ctx, PX, y, PW, 280, { fill: "#FFFFFF", stroke: GREEN, lw: 3, r: 18 }); text(ctx, "Mengapa PDF?", PX + 24, y + 48, 26, { weight: 900, color: GREEN });
        [["hp", "Tampil sama di HP dan komputer mana pun"], ["gembok", "Isinya tidak mudah berubah"]].forEach(([ic, s], i) => { D.icon(ctx, ic, PX + 46, y + 110 + i * 92, 40, GREEN); para(ctx, s, PX + 84, y + 102 + i * 92, 23, PW - 104, { weight: 700, lh: 1.2 }); }); }
      const fp = d ? d.folder : { cx: 700, cy: 450 }, ok = d ? d.ok : { cx: 1000, cy: 610 };
      ptr(ctx, D.path(l, sp, [{ x: fp.cx, y: fp.cy, d: ds[0], click: true }, { x: fp.x ? fp.x + 200 : 700, y: fp.y ? fp.y + fp.h + 4 + 6 + 2 * 46 + 23 : 560, d: ds[1], click: true }, { x: ok.cx, y: ok.cy, d: ds[2], click: true }, { x: ok.cx + 40, y: ok.cy + 60, d: ds[3] + ds[4] }], { x: 900, y: 700 }));
    },
    periksa_pdf(ctx, b, l) {
      const sp = spanOf(b), a = b.audio || b.dur; const scroll = lerp(0, 560, ease(clamp((l - a * 0.15) / (a * 0.6), 0, 1)));
      D.viewer(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { name: "Panduan Aman Internet 7B.pdf", blocks: doc(8), pageW: 700, scroll, pageNo: scroll > 520 ? 1 : 1, pageN: 1 });
      const n = l < a * 0.2 ? 0 : l < a * 0.4 ? 1 : l < a * 0.6 ? 2 : l < a * 0.8 ? 3 : 4;
      D.steps(ctx, PX, 150, PW, "PERIKSA PDF-MU", ["Judul dan subjudul jelas.", "Nomor langkah 1 sampai 3.", "Gambar dan keterangannya.", "Tidak ada teks terpotong."], n);
    },
    salah_judul(ctx, b, l) {
      const sp = spanOf(b), ds = [1.2, 1, 2.4, 2], S = D.seq(l, sp, ds); const clicked = S.p(1) >= 0.6;
      const g = app(ctx, { blocks: doc(8, { h2b: { t: "fake", pt: 15, caret: clicked && blink(l) } }), scroll: 470, title: "Dokumen — Panduan Aman Internet 7B", style: clicked ? "Teks normal" : "Teks normal", size: clicked ? 15 : 11, on: { bold: clicked }, hot: S.at(2) ? "style" : null });
      const fr = g.blocks[g.blocks.length - 1];
      ctx.strokeStyle = RED; ctx.lineWidth = 3; rr(ctx, fr.x - 10, fr.y + 6, fr.w + 20, 50, 8); ctx.stroke();
      L.callout(ctx, PX, 170, "Ditebalkan dan diperbesar…", fr.x + fr.w - 40, fr.y + 30, { color: RED, fill: "#FDF1F0" });
      if (S.at(2)) L.callout(ctx, PX, 330, "…tetapi gayanya Teks normal", g.tool("style").x + 196, g.tool("style").cy, { color: RED, fill: "#FDF1F0" });
      if (S.at(3)) L.callout(ctx, PX, 490, "Mirip judul, padahal bukan judul.", null, null, { size: 24 });
      ptr(ctx, D.path(l, sp, [{ x: 1000, y: 650, d: ds[0] }, { x: fr.x + 200, y: fr.y + 32, d: ds[1], click: true }, { x: fr.x + 220, y: fr.y + 70, d: ds[2] + ds[3] }], { x: 1000, y: 650 }));
    },
    salah_judul_fix(ctx, b, l) {
      const sp = spanOf(b), ds = [2.4, 0.8, 1, 1.4, 1.6], S = D.seq(l, sp, ds); const done = S.p(3) >= 0.6, open = !done && (S.i === 3 || (S.i === 2 && S.u >= 0.6));
      const g = app(ctx, { blocks: doc(8, { h2b: done ? {} : { t: "fake", pt: 15 } }), scroll: 470, title: "Dokumen — Panduan Aman Internet 7B", style: done ? "Judul 2" : "Teks normal", size: 15, styleOpen: open, hot: open ? "style" : null, outlineHot: !done && S.i === 0, outlineHi: done ? 2 : null });
      const st = g.tool("style"); if (open) D.styleList(ctx, st.x, st.y + 44, S.i === 3 ? 2 : null, "Teks normal");
      // daftar isi otomatis
      const y = 150, ok = done; card(ctx, PX, y, PW, 300, { fill: "#FFFFFF", stroke: ok ? GREEN : RED, lw: 3, r: 18 }); text(ctx, "Daftar isi", PX + 24, y + 46, 26, { weight: 900, color: ok ? GREEN : RED });
      const items = [["Aman di Internet", 0], ["Bab 1: Kata Sandi yang Aman", 1]].concat(ok ? [["Bab 2: Mencari Informasi yang Jitu", 1]] : []);
      items.forEach(([s, lv], i) => text(ctx, s, PX + 24 + lv * 22, y + 104 + i * 52, lv ? 21 : 23, { weight: lv ? 600 : 800, color: i === 2 ? GREEN : "#1A5FA8", fit: 300 }));
      if (!ok) text(ctx, "Bab 2 tidak ada!", PX + 24, y + 260, 24, { weight: 900, color: RED }); else text(ctx, "✓ Bab 2 sudah masuk", PX + 24, y + 260, 24, { weight: 900, color: GREEN });
      if (!ok && S.i === 0) L.callout(ctx, 128, 600, "Kerangka juga tanpa Bab 2", 250, 418, { color: RED, fill: "#FDF1F0", size: 22, maxW: 220 });
      D.steps(ctx, PX, 480, PW, "PERBAIKAN", ["Klik baris Bab 2.", "Kotak gaya → Judul 2."], S.i <= 1 ? 0 : done ? 2 : 1);
      const fr = g.blocks[g.blocks.length - 1], it = styleItem(g, 2);
      ptr(ctx, D.path(l, sp, [{ x: 1000, y: 650, d: ds[0] }, { x: fr.x + 200, y: fr.y + 32, d: ds[1], click: true }, { x: st.cx, y: st.cy, d: ds[2], click: true }, { ...it, d: ds[3], click: true }, { x: it.x + 20, y: it.y + 40, d: ds[4] }], { x: 1000, y: 650 }));
    },
    salah_gambar(ctx, b, l) {
      const a = b.audio || b.dur; card(ctx, 160, 140, 1600, 680);
      text(ctx, "KESALAHAN 2: GAMBAR SEBESAR SATU HALAMAN", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      const mini = (x, ok, wf, ratio) => { ctx.save(); ctx.beginPath(); ctx.rect(x, 240, 700, 470); ctx.clip(); ctx.fillStyle = D.UI.work; ctx.fillRect(x, 240, 700, 470);
        const res = D.docPages(ctx, ok ? x + 200 : x + 30, 262, 300, doc(8, { img: { wf, ratio } }), { z: 300 / 760, gap: 20, side: true }); ctx.restore();
        ctx.strokeStyle = ok ? GREEN : RED; ctx.lineWidth = 4; rr(ctx, x, 240, 700, 470, 16); ctx.stroke(); return res; };
      const r1 = mini(220, false, 1, 1.25); text(ctx, "✗ 2 halaman, teks dan gambar terpisah", 570, 770, 30, { align: "center", weight: 900, color: RED });
      if (l > a * 0.55) { mini(1000, true, 0.5, 0.62); text(ctx, "✓ 1 halaman, muat bersama", 1350, 770, 30, { align: "center", weight: 900, color: GREEN });  }
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D7.8", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "perencana proyek dan rubrik", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d78", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "isi bersama timmu", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Rapikan bab panduan timmu dengan gaya judul, daftar bernomor, dan satu gambar, lalu kirim PDF-nya.", 1310, 420, 30, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
