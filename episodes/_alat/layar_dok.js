/* Layar Dok: pembantu gambar bersama untuk simulasi pengolah dokumen, slide presentasi, dan kanvas infografik
   (S07, S08, S30; boleh dipakai simulasi lain). Pemilik: kelompok S07/S08/S30.
   Muat setelah kiko-core.js dan layar.js:
     "engine": ["../../_alat/kiko-core.js", "../../_alat/layar.js", "../../_alat/layar_dok.js", "scenes.js"]
   Semua tampilan generik ("Dokumen", "Slide", "Desain", "Penampil PDF"): tanpa logo, warna khas, atau tata letak yang meniru merek.
   Nama menu memakai nama yang lazim (File, Sisipkan, Format). Kanvas 1920×1080.

   ===== API: Kiko.dok (di adegan: const D = K.dok) =====
   Umum
     D.seq(l, span, ds)                 pembagi waktu: ds = durasi relatif tiap langkah → {i, u, p(k) 0..1, at(k)}
     D.path(l, span, pts, from)         pointer melewati titik [{x, y, d, click, down}] → {x, y, click, down, i} (gambar dengan L.cursor)
     D.typed(s, u)                      potongan s yang sudah "diketik" pada kemajuan u
     D.steps(ctx, x, y, w, title, items, n) panel langkah bernomor (langkah ke-n sedang dikerjakan; sebelum n dicentang) → y bawah
     D.UI                               warna antarmuka (select, work = latar area kerja, page, line, …)
     D.txt(ctx, s, x, y, size, opt)     seperti H.text, plus opt.italic
     D.menuPos(ctx, winX, menus, name)  titik tengah nama menu di bilah menu L.window → {x, y} (y relatif: tambahkan winY)
     D.menu(ctx, x, y, items, opt)      menu tarik-turun. items: "Teks" | {s, sub (panah ▸), key ("Ctrl+S"), sep (garis di atasnya), dim}
                                        opt.hi = indeks tersorot, opt.w (bawaan 300). → {item(i): {x, y, w, h, cx, cy}, w, h}
     D.btn(ctx, x, y, w, h, s, opt)     tombol. opt.primary, opt.press (lebih gelap), opt.size. → kotak {x, y, w, h, cx, cy}
     D.dialog(ctx, x, y, w, h, title, opt) kotak dialog; opt.dim = {x, y, w, h} area yang digelapkan dulu. → area isi {x, y, w, h}
     D.saveDialog(ctx, x, y, opt)       dialog "Simpan/Unduh": opt.title, name (teks), caret, folder, type ("Dokumen PDF (.pdf)"),
                                        typeHi (sorot kolom jenis), press (tombol ditekan), btn ("Simpan"). → {name, folder, type, ok} kotak
     D.selBox(ctx, x, y, w, h, opt)     bingkai pilihan biru dengan 8 gagang (opt.handles=false: tanpa gagang; opt.hot = "br" gagang menyala)
     D.icon(ctx, kind, cx, cy, s, color) ikon garis sederhana. kind: gembok, kaca, chat, botol, daur, hp, koin, sampah, daun, centang,
                                        silang, jam, orang, kalender, timbangan, grafik, bintang, buku, perisai, info, panah, gambar
     D.pic(ctx, x, y, w, h, kind, opt)  "foto/ilustrasi" berbingkai yang digambar dengan kode. kind: gembok, cari, grup, botol, kelas,
                                        poin, pemandangan (bawaan). opt.r (sudut), opt.label (nama file kecil di pojok)
   Dokumen (pengolah dokumen)
     D.STYLES                           ["Teks normal", "Judul 1", "Judul 2", "Judul 3"]
     D.docApp(ctx, x, y, w, h, opt) → {area, page, blocks, pages, tool(k), menuY}
         opt.title ("Dokumen — Tanpa judul"), menuOn, style (isi kotak gaya, bawaan "Teks normal"), size (ukuran huruf, bawaan 11),
         on {bold, italic, ul, ol, center} (tombol aktif), hot (kunci tombol yang disorot kuning),
         outline (true: panel "Kerangka dokumen" di kiri, daftar diambil dari blok h1/h2/h3), pageW (bawaan 760), scroll (px),
         blocks (lihat di bawah), caret (true: kursor di akhir blok yang punya typed/caret).
         tool(k): kotak tombol; k = style, size, bold, italic, under, ul, ol, left, center, img, link.
     D.docPages(ctx, x, y, pw, blocks, opt) menggambar halaman (bisa lebih dari satu; blok yang tidak muat pindah ke halaman berikutnya).
         Dipakai docApp dan viewer; bisa dipakai sendiri (mis. kertas kecil). opt.z (skala), opt.gap, opt.side (halaman berjajar ke kanan).
         → {blocks: [{x, y, w, h, items: [kotak baris daftar], img: {x, y, w, h}}], pages: [{x, y, w, h}]}
     Blok: {t: "h1"|"h2"|"h3"|"p"|"fake" (tebal-besar tetapi Teks normal; opt pt), s, typed (jumlah huruf tampil), caret,
            sel (sorotan biru), mark (bingkai kuning), alpha, color, bold, center}
           {t: "ol"|"ul", items: ["…"], typed: jumlah item tampil (boleh pecahan: item terakhir sedang diketik), sel, mark}
           {t: "img", kind, wf (lebar relatif lebar teks, 0..1), ratio (tinggi/lebar), sel (gagang), hot, label}
           {t: "cap", s} keterangan gambar (kecil, miring, rata tengah)
           {t: "toc", items: [{s, lvl, page}]} daftar isi otomatis · {t: "gap", h}
     D.outline(ctx, x, y, w, h, heads, opt) panel kerangka: heads = [{s, lvl}], opt.hi = indeks tersorot
     D.styleList(ctx, x, y, hi, cur)    daftar gaya terbuka di bawah kotak gaya → {item(i)}
     D.viewer(ctx, x, y, w, h, opt)     jendela "Penampil PDF": opt.name, blocks, pageW, scroll, pageNo, pageN, zoom (teks "100%")
                                        → {area, pages, blocks}
   Slide
     D.slideApp(ctx, x, y, w, h, opt) → {thumbs: [kotak], stage {x, y, w, h}, els (kotak isi slide aktif), tool(k)}
         opt.title, menuOn, slides [spec], cur (indeks slide aktif), size (ukuran huruf), on {bold}, hot (kunci tombol disorot),
         show (tombol Tampilkan disorot). tool(k): k = add (Slide baru), layout (Tata letak), size, bold, color, img, play.
     D.slide(ctx, x, y, w, h, spec, opt) menggambar satu slide di sembarang ukuran; 1 pt = h/540 px. → {title, sub, body, items, img, num}
         spec.layout: "judul" | "isi" | "isi_gambar" | "gambar" | "angka" | "padat" | "akhir" | "kosong"
         spec.title, sub, bullets [], img {kind, label}, num, cap, para (teks panjang untuk "padat"), colors [warna tiap poin],
         titlePt (40; "judul": 54), bodyPt (28), bg, ink, accent, band (garis aksen, bawaan true), ph (tampilkan placeholder kosong),
         typed {title: n, body: n} (jumlah huruf tampil), caret ("title" | "body"), sel ("title" | "body" | "img")
     D.layoutMenu(ctx, x, y, hi)        pilihan tata letak bergambar (Judul, Judul dan isi, Judul dan gambar, Kosong) → {item(i)}
     D.SLIDE_LAYOUTS                    nama-nama tata letak di menu
   Kanvas infografik
     D.canvasApp(ctx, x, y, w, h, opt) → {page, area, panel(i), swatch(i), tool(k)}
         opt.title ("Desain — Tanpa judul"), menuOn, panelHi (indeks alat kiri tersorot), size, swatches [warna], swatchOn,
         ratio (tinggi/lebar halaman, bawaan 4/3), els (elemen D.info), sel (id elemen terpilih), guides, margin, bg (warna halaman)
         Alat kiri: Teks, Bentuk, Ikon, Gambar, Grafik. tool(k): k = size, bold, align.
     D.info(ctx, page, els, opt)        menggambar elemen di halaman berukuran desain 600 × (600·ratio) satuan. → {id: kotak px}
         el: {t: "text", id, x, y (garis dasar), s, size, weight, color, align, maxW (bungkus), lh, typed, alpha}
             {t: "rect", x, y, w, h, fill, r, stroke, lw} · {t: "circle", x, y, rad, fill} · {t: "line", x, y, x2, y2, color, lw, dash}
             {t: "icon", kind, x, y (pusat), s, color, bg (lingkaran latar)} · {t: "pic", kind, x, y, w, h}
         opt.sel = id (bingkai pilihan), opt.guides = [{x} | {y}] garis bantu merah muda, opt.margin = satuan (garis tepi putus-putus)
*/
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar;
  const { rr, text, ease, clamp, lerp } = H;
  const FONT = "Inter, 'Segoe UI', Roboto, Arial, sans-serif";
  const D = {};
  const UI = { select: "#1A73C8", selectBg: "rgba(26,115,200,0.16)", work: "#E7ECEF", page: "#FFFFFF", line: "#D5DEE3",
               ink: "#1F2A33", ink2: "#5B6B76", tool: "#3D4B55", hot: "#F2B134", hotBg: "#FFF3D6", onBg: "#DCE9F7", pdf: "#56626A" };
  D.UI = UI;

  // ---------- teks ----------
  function font(size, weight, italic) { return `${italic ? "italic " : ""}${weight || 600} ${size}px ${FONT}`; }
  D.txt = function (ctx, s, x, y, size, opt = {}) {
    ctx.font = font(size, opt.weight, opt.italic); ctx.fillStyle = opt.color || UI.ink; ctx.textAlign = opt.align || "left"; ctx.textBaseline = "alphabetic"; ctx.fillText(s, x, y);
  };
  function wrapF(ctx, s, size, weight, maxW, italic) {
    ctx.font = font(size, weight, italic); const out = []; let cur = "";
    String(s).split(" ").forEach(w => { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
    if (cur) out.push(cur); return out;
  }
  const measure = (ctx, s, size, weight, italic) => { ctx.font = font(size, weight, italic); return ctx.measureText(s).width; };
  const box = (x, y, w, h) => ({ x, y, w, h, cx: x + w / 2, cy: y + h / 2 });

  // ---------- waktu, pointer, panel langkah ----------
  // D.seq(l, span, ds): ds = durasi relatif tiap langkah → {i, u, p(k), at(k)}; D.path(l, span, pts, from): pointer melewati titik
  // pts = [{x, y, d, click, down}] → {x, y, click, down, i}; D.typed(s, u): potongan teks; D.steps(ctx, x, y, w, title, items, n): panel langkah
  D.seq = function (l, span, ds) {
    const tot = ds.reduce((a, b) => a + b, 0); let t0 = 0; const st = ds.map(d => { const a = t0; t0 += d; return [a / tot * span, d / tot * span]; });
    const p = k => clamp((l - st[k][0]) / st[k][1], 0, 1); let i = 0; st.forEach(([a], k) => { if (l >= a) i = k; });
    return { i, u: p(i), p, at: k => l >= st[k][0] };
  };
  D.path = function (l, span, pts, from) {
    const S = D.seq(l, span, pts.map(q => q.d || 1)); let prev = from || pts[0];
    for (let k = 0; k < pts.length; k++) { const q = pts[k], u = S.p(k);
      if (k === S.i || (k === pts.length - 1 && u >= 1)) { const m = ease(clamp(u / 0.6, 0, 1)); const click = q.click && u >= 0.6 && u < 1 ? (u - 0.6) / 0.4 : 0;
        return { x: lerp(prev.x, q.x, m), y: lerp(prev.y, q.y, m), click, down: !!q.down && u > 0.1, i: k }; }
      prev = q; }
    return { x: prev.x, y: prev.y, click: 0, down: false, i: pts.length - 1 };
  };
  D.typed = (s, u) => s.slice(0, Math.round(s.length * clamp(u, 0, 1)));
  D.steps = function (ctx, x, y, w, title, items, n, opt = {}) {
    const rows = items.map(s => wrapF(ctx, s, 23, 700, w - 86)); let hh = 70; rows.forEach(ls => hh += ls.length * 30 + 22);
    H.card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, title, x + 24, y + 44, 24, { weight: 900, color: C.accentDark }); let yy = y + 74;
    rows.forEach((ls, i) => { const done = i < n, now = i === n;
      if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 10, yy - 8, w - 20, ls.length * 30 + 16, 10); ctx.fill(); }
      ctx.fillStyle = done ? C.good : now ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(x + 36, yy + 13, 14, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 36, yy + 21, 18, { align: "center", weight: 900, color: "#FFFFFF" });
      ls.forEach((ln, j) => text(ctx, ln, x + 62, yy + 22 + j * 30, 23, { weight: 700, color: done ? C.ink2 : C.ink })); yy += ls.length * 30 + 22; });
    return y + hh;
  };

  // ---------- menu, tombol, dialog ----------
  D.menuPos = function (ctx, winX, menus, name) {
    let mx = winX + 24; for (const m of menus) { ctx.font = "600 21px Inter"; const mw = ctx.measureText(m).width + 24; if (m === name) return { x: mx + mw / 2 - 8, y: 46 + 20 }; mx += mw + 6; }
    return { x: winX + 40, y: 66 };
  };
  D.menu = function (ctx, x, y, items, opt = {}) {
    const w = opt.w || 300, rh = 46; let h = 12; items.forEach(it => { if (it && it.sep) h += 12; h += rh; });
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 10); ctx.stroke();
    const rects = []; let yy = y + 6;
    items.forEach((it, i) => {
      const o = typeof it === "string" ? { s: it } : it;
      if (o.sep) { ctx.fillStyle = "#E1E7EB"; ctx.fillRect(x + 10, yy + 5, w - 20, 2); yy += 12; }
      const on = opt.hi === i;
      if (on) { ctx.fillStyle = UI.onBg; rr(ctx, x + 5, yy, w - 10, rh, 6); ctx.fill(); }
      D.txt(ctx, o.s, x + 22, yy + 31, 23, { weight: on ? 700 : 600, color: o.dim ? "#A3B0B8" : on ? UI.select : UI.ink });
      if (o.key) D.txt(ctx, o.key, x + w - 20, yy + 31, 19, { align: "right", weight: 600, color: "#8A99A3" });
      if (o.sub) D.txt(ctx, "▸", x + w - 24, yy + 31, 22, { align: "right", weight: 800, color: on ? UI.select : "#8A99A3" });
      rects.push(box(x, yy, w, rh)); yy += rh;
    });
    return { item: i => rects[i], w, h };
  };
  D.btn = function (ctx, x, y, w, h, s, opt = {}) {
    const p = opt.primary; ctx.fillStyle = p ? (opt.press ? "#155FA6" : UI.select) : (opt.press ? "#E3EAEF" : "#FFFFFF"); rr(ctx, x, y, w, h, 10); ctx.fill();
    if (!p) { ctx.strokeStyle = opt.hot ? UI.hot : "#C9D4DB"; ctx.lineWidth = opt.hot ? 4 : 2; rr(ctx, x, y, w, h, 10); ctx.stroke(); }
    D.txt(ctx, s, x + w / 2, y + h / 2 + (opt.size || 24) * 0.36, opt.size || 24, { align: "center", weight: 800, color: p ? "#FFFFFF" : UI.ink });
    return box(x, y, w, h);
  };
  D.dialog = function (ctx, x, y, w, h, title, opt = {}) {
    if (opt.dim) { ctx.fillStyle = "rgba(31,42,51,0.28)"; ctx.fillRect(opt.dim.x, opt.dim.y, opt.dim.w, opt.dim.h); }
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.3)"; ctx.shadowBlur = 34; ctx.shadowOffsetY = 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 16); ctx.stroke();
    D.txt(ctx, title, x + 36, y + 56, 30, { weight: 900 });
    return { x: x + 36, y: y + 80, w: w - 72, h: h - 100 };
  };
  function field(ctx, x, y, w, label, value, opt = {}) {
    D.txt(ctx, label, x, y, 22, { weight: 700, color: UI.ink2 });
    const fy = y + 12, fh = 56; ctx.fillStyle = opt.fill || "#FFFFFF"; rr(ctx, x, fy, w, fh, 8); ctx.fill();
    ctx.strokeStyle = opt.hot ? UI.hot : opt.focus ? UI.select : "#C9D4DB"; ctx.lineWidth = opt.hot || opt.focus ? 3 : 2; rr(ctx, x, fy, w, fh, 8); ctx.stroke();
    D.txt(ctx, value, x + 18, fy + 37, 26, { weight: 700 });
    if (opt.caret) { const tw = measure(ctx, value, 26, 700); ctx.fillStyle = UI.ink; ctx.fillRect(x + 20 + tw, fy + 12, 2.5, 32); }
    if (opt.drop) D.txt(ctx, "▾", x + w - 22, fy + 37, 24, { align: "right", weight: 800, color: UI.ink2 });
    return box(x, fy, w, fh);
  }
  D.saveDialog = function (ctx, x, y, opt = {}) {
    const w = opt.w || 820, h = 440; const a = D.dialog(ctx, x, y, w, h, opt.title || "Simpan sebagai", { dim: opt.dim });
    const name = field(ctx, a.x, a.y + 14, a.w, "Nama file", opt.name || "", { focus: opt.caret, caret: opt.caret, hot: opt.nameHi });
    const folder = field(ctx, a.x, a.y + 110, a.w, "Folder", "▤  " + (opt.folder || "Dokumen"), { fill: "#F4F7F9", drop: true, hot: opt.folderHi });
    const type = field(ctx, a.x, a.y + 206, a.w, "Jenis file", opt.type || "Dokumen PDF (.pdf)", { fill: "#F4F7F9", drop: true, hot: opt.typeHi });
    const ok = D.btn(ctx, x + w - 236, y + h - 82, 200, 56, opt.btn || "Simpan", { primary: true, press: opt.press });
    D.btn(ctx, x + w - 456, y + h - 82, 200, 56, "Batal");
    return { name, folder, type, ok };
  };

  // ---------- bingkai pilihan ----------
  D.selBox = function (ctx, x, y, w, h, opt = {}) {
    ctx.strokeStyle = opt.color || UI.select; ctx.lineWidth = opt.lw || 2.5; ctx.setLineDash(opt.dash ? [8, 6] : []); ctx.strokeRect(x, y, w, h); ctx.setLineDash([]);
    if (opt.handles === false) return;
    const pts = { tl: [x, y], tc: [x + w / 2, y], tr: [x + w, y], ml: [x, y + h / 2], mr: [x + w, y + h / 2], bl: [x, y + h], bc: [x + w / 2, y + h], br: [x + w, y + h] };
    Object.entries(pts).forEach(([k, [px, py]]) => { const s = opt.hot === k ? 18 : 12; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(px - s / 2, py - s / 2, s, s); ctx.strokeStyle = opt.hot === k ? UI.hot : (opt.color || UI.select); ctx.lineWidth = opt.hot === k ? 4 : 2.5; ctx.strokeRect(px - s / 2, py - s / 2, s, s); });
  };

  // ---------- ikon ----------
  D.icon = function (ctx, kind, cx, cy, s, color) {
    const c = color || UI.tool; ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = Math.max(2, s * 0.09); ctx.lineCap = "round"; ctx.lineJoin = "round";
    const r = s / 2; const circ = (x, y, rad, fill) => { ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); fill ? ctx.fill() : ctx.stroke(); };
    const line = (...p) => { ctx.beginPath(); ctx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]); ctx.stroke(); };
    switch (kind) {
      case "gembok": rr(ctx, -r * 0.7, -r * 0.1, r * 1.4, r * 1.0, r * 0.18); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -r * 0.1, r * 0.45, Math.PI, 0); ctx.stroke(); circ(0, r * 0.32, r * 0.13, true); line(0, r * 0.38, 0, r * 0.6); break;
      case "kaca": circ(-r * 0.15, -r * 0.15, r * 0.55); ctx.lineWidth *= 1.4; line(r * 0.25, r * 0.25, r * 0.8, r * 0.8); break;
      case "chat": rr(ctx, -r * 0.9, -r * 0.8, r * 1.2, r * 0.85, r * 0.2); ctx.stroke(); line(-r * 0.6, r * 0.05, -r * 0.7, r * 0.35, -r * 0.35, r * 0.05);
        rr(ctx, -r * 0.1, -r * 0.2, r * 1.0, r * 0.75, r * 0.2); ctx.stroke(); line(r * 0.6, r * 0.55, r * 0.7, r * 0.85, r * 0.4, r * 0.55); break;
      case "botol": ctx.beginPath(); ctx.moveTo(-r * 0.15, -r * 0.95); ctx.lineTo(r * 0.15, -r * 0.95); ctx.lineTo(r * 0.15, -r * 0.65); ctx.quadraticCurveTo(r * 0.45, -r * 0.45, r * 0.45, -r * 0.15);
        ctx.lineTo(r * 0.45, r * 0.9); ctx.lineTo(-r * 0.45, r * 0.9); ctx.lineTo(-r * 0.45, -r * 0.15); ctx.quadraticCurveTo(-r * 0.45, -r * 0.45, -r * 0.15, -r * 0.65); ctx.closePath(); ctx.stroke(); line(-r * 0.45, r * 0.15, r * 0.45, r * 0.15); line(-r * 0.45, r * 0.5, r * 0.45, r * 0.5); break;
      case "daur": for (let k = 0; k < 3; k++) { ctx.save(); ctx.rotate(k * Math.PI * 2 / 3); ctx.beginPath(); ctx.arc(0, 0, r * 0.7, -Math.PI * 0.45, Math.PI * 0.05); ctx.stroke();
          const ax = r * 0.7 * Math.cos(Math.PI * 0.05), ay = r * 0.7 * Math.sin(Math.PI * 0.05); line(ax - r * 0.22, ay - r * 0.05, ax, ay, ax + r * 0.08, ay - r * 0.24); ctx.restore(); } break;
      case "hp": rr(ctx, -r * 0.5, -r * 0.9, r * 1.0, r * 1.8, r * 0.18); ctx.stroke(); line(-r * 0.15, r * 0.65, r * 0.15, r * 0.65); break;
      case "koin": circ(0, 0, r * 0.8); circ(0, 0, r * 0.55); ctx.font = `900 ${Math.round(s * 0.42)}px Inter`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("P", 0, r * 0.03); ctx.textBaseline = "alphabetic"; break;
      case "sampah": line(-r * 0.75, -r * 0.55, r * 0.75, -r * 0.55); line(-r * 0.25, -r * 0.55, -r * 0.2, -r * 0.8, r * 0.2, -r * 0.8, r * 0.25, -r * 0.55);
        ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.4); ctx.lineTo(-r * 0.45, r * 0.85); ctx.lineTo(r * 0.45, r * 0.85); ctx.lineTo(r * 0.6, -r * 0.4); ctx.stroke(); line(-r * 0.15, -r * 0.2, -r * 0.1, r * 0.6); line(r * 0.15, -r * 0.2, r * 0.1, r * 0.6); break;
      case "daun": ctx.beginPath(); ctx.moveTo(-r * 0.7, r * 0.7); ctx.quadraticCurveTo(-r * 0.8, -r * 0.7, r * 0.75, -r * 0.75); ctx.quadraticCurveTo(r * 0.7, r * 0.75, -r * 0.7, r * 0.7); ctx.stroke(); line(-r * 0.7, r * 0.7, r * 0.3, -r * 0.3); break;
      case "centang": circ(0, 0, r * 0.85); line(-r * 0.4, 0, -r * 0.1, r * 0.3, r * 0.45, -r * 0.3); break;
      case "silang": circ(0, 0, r * 0.85); line(-r * 0.32, -r * 0.32, r * 0.32, r * 0.32); line(r * 0.32, -r * 0.32, -r * 0.32, r * 0.32); break;
      case "jam": circ(0, 0, r * 0.85); line(0, -r * 0.5, 0, 0, r * 0.35, r * 0.2); break;
      case "orang": circ(0, -r * 0.4, r * 0.32); ctx.beginPath(); ctx.arc(0, r * 0.75, r * 0.65, Math.PI, 0); ctx.stroke(); break;
      case "kalender": rr(ctx, -r * 0.8, -r * 0.65, r * 1.6, r * 1.45, r * 0.15); ctx.stroke(); line(-r * 0.8, -r * 0.25, r * 0.8, -r * 0.25); line(-r * 0.4, -r * 0.85, -r * 0.4, -r * 0.5); line(r * 0.4, -r * 0.85, r * 0.4, -r * 0.5);
        for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) circ(-r * 0.4 + i * r * 0.4, r * 0.1 + j * r * 0.35, r * 0.07, true); break;
      case "timbangan": line(-r * 0.8, r * 0.8, r * 0.8, r * 0.8); rr(ctx, -r * 0.6, -r * 0.1, r * 1.2, r * 0.9, r * 0.1); ctx.stroke(); circ(0, r * 0.35, r * 0.25); line(0, r * 0.35, r * 0.12, r * 0.22); line(-r * 0.7, -r * 0.3, r * 0.7, -r * 0.3); break;
      case "grafik": line(-r * 0.85, -r * 0.85, -r * 0.85, r * 0.8, r * 0.85, r * 0.8); [[-0.55, 0.3], [-0.15, -0.1], [0.25, -0.45], [0.65, -0.7]].forEach(([bx, by]) => { ctx.fillRect(bx * r - r * 0.13, by * r, r * 0.26, r * 0.8 - by * r); }); break;
      case "bintang": ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.38 : r * 0.88; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); } ctx.closePath(); ctx.stroke(); break;
      case "buku": ctx.beginPath(); ctx.moveTo(0, -r * 0.5); ctx.quadraticCurveTo(-r * 0.4, -r * 0.75, -r * 0.85, -r * 0.6); ctx.lineTo(-r * 0.85, r * 0.65); ctx.quadraticCurveTo(-r * 0.4, r * 0.5, 0, r * 0.75);
        ctx.quadraticCurveTo(r * 0.4, r * 0.5, r * 0.85, r * 0.65); ctx.lineTo(r * 0.85, -r * 0.6); ctx.quadraticCurveTo(r * 0.4, -r * 0.75, 0, -r * 0.5); ctx.stroke(); line(0, -r * 0.5, 0, r * 0.75); break;
      case "perisai": ctx.beginPath(); ctx.moveTo(0, -r * 0.85); ctx.lineTo(r * 0.7, -r * 0.55); ctx.quadraticCurveTo(r * 0.7, r * 0.5, 0, r * 0.9); ctx.quadraticCurveTo(-r * 0.7, r * 0.5, -r * 0.7, -r * 0.55); ctx.closePath(); ctx.stroke(); line(-r * 0.28, 0, -r * 0.05, r * 0.25, r * 0.32, -r * 0.2); break;
      case "info": circ(0, 0, r * 0.85); circ(0, -r * 0.38, r * 0.08, true); line(0, -r * 0.1, 0, r * 0.45); break;
      case "panah": line(-r * 0.75, 0, r * 0.7, 0); line(r * 0.3, -r * 0.4, r * 0.75, 0, r * 0.3, r * 0.4); break;
      case "gambar": rr(ctx, -r * 0.85, -r * 0.65, r * 1.7, r * 1.3, r * 0.12); ctx.stroke(); line(-r * 0.7, r * 0.5, -r * 0.2, -r * 0.05, r * 0.1, r * 0.25, r * 0.35, 0, r * 0.7, r * 0.5); circ(r * 0.4, -r * 0.3, r * 0.12, true); break;
      default: circ(0, 0, r * 0.8);
    }
    ctx.restore();
  };

  // ---------- ilustrasi berbingkai ----------
  D.pic = function (ctx, x, y, w, h, kind, opt = {}) {
    const rad = opt.r != null ? opt.r : Math.min(w, h) * 0.06;
    const bgs = { gembok: "#DCEBF7", cari: "#E8F0E4", grup: "#F6E9D9", botol: "#DFF1EA", kelas: "#EFE8F6", poin: "#FFF1D2", pemandangan: "#DDEFF7" };
    ctx.save(); rr(ctx, x, y, w, h, rad); ctx.clip();
    ctx.fillStyle = bgs[kind] || bgs.pemandangan; ctx.fillRect(x, y, w, h);
    const cx = x + w / 2, cy = y + h / 2, s = Math.min(w, h);
    if (kind === "gembok") {
      ctx.fillStyle = "#2B3A44"; rr(ctx, cx - s * 0.2, cy - s * 0.38, s * 0.4, s * 0.76, s * 0.05); ctx.fill(); ctx.fillStyle = "#FFFFFF"; rr(ctx, cx - s * 0.17, cy - s * 0.32, s * 0.34, s * 0.62, s * 0.03); ctx.fill();
      ctx.fillStyle = "#E7EEF3"; rr(ctx, cx - s * 0.13, cy + s * 0.02, s * 0.26, s * 0.08, s * 0.02); ctx.fill();
      for (let i = 0; i < 6; i++) { ctx.fillStyle = "#2B3A44"; ctx.beginPath(); ctx.arc(cx - s * 0.09 + i * s * 0.036, cy + s * 0.06, s * 0.011, 0, Math.PI * 2); ctx.fill(); }
      D.icon(ctx, "gembok", cx, cy - s * 0.12, s * 0.2, "#1A73C8");
      ctx.fillStyle = "#2E9E5B"; rr(ctx, cx - s * 0.1, cy + s * 0.15, s * 0.2, s * 0.06, s * 0.02); ctx.fill();
      D.icon(ctx, "perisai", x + w * 0.16, y + h * 0.26, s * 0.18, "#2E7E9A"); D.icon(ctx, "bintang", x + w * 0.84, y + h * 0.74, s * 0.14, "#F2B134");
    } else if (kind === "cari") {
      ctx.fillStyle = "#FFFFFF"; rr(ctx, x + w * 0.12, cy - s * 0.09, w * 0.76, s * 0.18, s * 0.09); ctx.fill(); ctx.strokeStyle = "#B9C7CF"; ctx.lineWidth = Math.max(2, s * 0.012); ctx.stroke();
      D.icon(ctx, "kaca", x + w * 0.12 + s * 0.12, cy, s * 0.11, "#4A5A66"); ctx.fillStyle = "#C9D4DB"; rr(ctx, x + w * 0.12 + s * 0.22, cy - s * 0.015, w * 0.4, s * 0.03, 3); ctx.fill();
      [0, 1].forEach(i => { ctx.fillStyle = "#FFFFFF"; rr(ctx, x + w * 0.12, cy + s * 0.15 + i * s * 0.13, w * 0.6, s * 0.09, 6); ctx.fill(); });
    } else if (kind === "grup") {
      const b = (bx, by, bw, col) => { ctx.fillStyle = col; rr(ctx, bx, by, bw, s * 0.13, s * 0.05); ctx.fill(); };
      b(x + w * 0.1, y + h * 0.18, w * 0.5, "#FFFFFF"); b(x + w * 0.38, y + h * 0.42, w * 0.5, "#CFEFD9"); b(x + w * 0.1, y + h * 0.66, w * 0.42, "#FFFFFF");
      D.icon(ctx, "chat", x + w * 0.82, y + h * 0.22, s * 0.18, "#B57A12");
    } else if (kind === "botol") {
      ctx.fillStyle = "#2E9E5B"; rr(ctx, cx + s * 0.08, cy - s * 0.12, s * 0.3, s * 0.42, s * 0.03); ctx.fill(); ctx.fillStyle = "#257F49"; ctx.fillRect(cx + s * 0.05, cy - s * 0.17, s * 0.36, s * 0.07);
      D.icon(ctx, "daur", cx + s * 0.23, cy + s * 0.1, s * 0.2, "#FFFFFF");
      [[-0.32, 0.1, -0.3], [-0.18, 0.14, 0.25], [-0.05, 0.2, -0.1]].forEach(([dx, dy, a]) => { ctx.save(); ctx.translate(cx + dx * s, cy + dy * s); ctx.rotate(a); ctx.fillStyle = "rgba(120,190,230,0.75)"; rr(ctx, -s * 0.05, -s * 0.16, s * 0.1, s * 0.3, s * 0.03); ctx.fill(); ctx.fillStyle = "#1A73C8"; ctx.fillRect(-s * 0.025, -s * 0.2, s * 0.05, s * 0.05); ctx.restore(); });
    } else if (kind === "kelas") {
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(cx - s * 0.36, y + h * 0.12, s * 0.72, s * 0.3);
      for (let i = 0; i < 4; i++) { const px = x + w * (0.2 + i * 0.2); ctx.fillStyle = ["#F1C9A5", "#C98A57", "#F1C9A5", "#C98A57"][i]; ctx.beginPath(); ctx.arc(px, y + h * 0.66, s * 0.07, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2F4E7D"; rr(ctx, px - s * 0.09, y + h * 0.74, s * 0.18, s * 0.2, s * 0.05); ctx.fill(); }
    } else if (kind === "poin") {
      D.icon(ctx, "hp", cx - s * 0.12, cy, s * 0.5, "#2B3A44"); D.icon(ctx, "koin", cx + s * 0.2, cy - s * 0.08, s * 0.28, "#B57A12"); D.icon(ctx, "koin", cx + s * 0.27, cy + s * 0.16, s * 0.22, "#B57A12");
    } else {
      ctx.fillStyle = "#F2B134"; ctx.beginPath(); ctx.arc(x + w * 0.75, y + h * 0.3, s * 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#7FB98F"; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w * 0.35, y + h * 0.45); ctx.lineTo(x + w * 0.6, y + h * 0.8); ctx.lineTo(x + w * 0.78, y + h * 0.6); ctx.lineTo(x + w, y + h * 0.9); ctx.lineTo(x + w, y + h); ctx.fill();
    }
    ctx.restore();
    if (opt.label) { const fs = Math.max(14, Math.round(s * 0.06)); ctx.font = font(fs, 700); const tw = ctx.measureText(opt.label).width; ctx.fillStyle = "rgba(255,255,255,0.85)"; rr(ctx, x + 8, y + h - fs - 18, tw + 16, fs + 10, 6); ctx.fill(); D.txt(ctx, opt.label, x + 16, y + h - 16, fs, { weight: 700, color: UI.ink2 }); }
  };

  // ---------- pengolah dokumen ----------
  D.STYLES = ["Teks normal", "Judul 1", "Judul 2", "Judul 3"];
  const PT = { h1: 20, h2: 15, h3: 13, p: 11, cap: 9.5 };
  function blockText(b) { const s = b.s || ""; return b.typed != null ? s.slice(0, Math.max(0, Math.round(b.typed))) : s; }
  D.docPages = function (ctx, x0, y0, pw, blocks, opt = {}) {
    const z = opt.z || pw / 760, px = pt => pt * 2.2 * z, mx = 72 * z, top = 66 * z, bottom = 70 * z, ph = pw * 1.414, gap = opt.gap || 30 * z;
    const tw = pw - mx * 2; const pages = []; const rects = [];
    let x0p = x0;
    const newPage = () => { const n = pages.length, py = opt.side ? y0 : y0 + n * (ph + gap); x0p = opt.side ? x0 + n * (pw + gap) : x0; const pg = { x: x0p, y: py, w: pw, h: ph }; pages.push(pg);
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.16)"; ctx.shadowBlur = 16 * z + 4; ctx.shadowOffsetY = 4; ctx.fillStyle = UI.page; ctx.fillRect(x0p, py, pw, ph); ctx.restore();
      ctx.strokeStyle = "#D5DEE3"; ctx.lineWidth = 1; ctx.strokeRect(x0p, py, pw, ph); return py + top; };
    // ukur dulu tinggi tiap blok (agar bisa pindah halaman), lalu gambar
    const meas = blocks.map(b => {
      if (b.t === "gap") return { h: (b.h || 20) * z };
      if (b.t === "img") { const w = tw * (b.wf || 0.6), h = w * (b.ratio || 0.62); return { h: h + 14 * z, w, ih: h }; }
      if (b.t === "toc") return { h: px(13) * 1.6 + (b.items || []).length * px(11) * 1.7 + 18 * z };
      if (b.t === "ol" || b.t === "ul") { const size = px(PT.p); let hh = 0; const lines = (b.items || []).map(s => { const ls = wrapF(ctx, s, size, 500, tw - 44 * z); hh += ls.length * size * 1.45 + 6 * z; return ls; }); return { h: hh + 12 * z, lines, size }; }
      const kind = b.t === "fake" ? "fake" : b.t; const pt = b.t === "fake" ? (b.pt || 20) : (PT[kind] || 11);
      const size = px(pt), weight = (kind === "h1" || kind === "h2" || kind === "h3" || b.t === "fake" || b.bold) ? 800 : 500, italic = kind === "cap";
      const lines = wrapF(ctx, b.s || " ", size, weight, tw, italic); const lh = size * (kind === "p" ? 1.45 : 1.25);
      const before = kind === "h1" ? 0 : kind === "h2" ? 14 * z : kind === "h3" ? 10 * z : 0, after = kind === "h1" ? 20 * z : kind === "h2" ? 10 * z : kind === "cap" ? 18 * z : 14 * z;
      return { h: before + lines.length * lh + after, size, weight, italic, lh, before, lines };
    });
    let yy = newPage(), py0 = pages[0].y;
    blocks.forEach((b, i) => {
      const m = meas[i]; const pageBottom = pages[pages.length - 1].y + ph - bottom;
      if (yy + m.h > pageBottom && yy > pages[pages.length - 1].y + top + 1) yy = newPage();
      const r = { x: x0p + mx, y: yy, w: tw, h: m.h, items: [] };
      ctx.save(); if (b.alpha != null) ctx.globalAlpha = clamp(b.alpha, 0, 1);
      if (b.t === "img") {
        const ix = b.center === false ? x0p + mx : x0p + mx + (tw - m.w) / 2; r.img = { x: ix, y: yy, w: m.w, h: m.ih };
        D.pic(ctx, ix, yy, m.w, m.ih, b.kind || "pemandangan", { r: 6 * z, label: b.label });
        if (b.sel) D.selBox(ctx, ix, yy, m.w, m.ih, { hot: b.hot });
      } else if (b.t === "toc") {
        const s1 = px(13), s2 = px(11);
        D.txt(ctx, "Daftar isi", x0p + mx, yy + s1, s1, { weight: 800 });
        (b.items || []).forEach((it, k) => { const ty = yy + s1 * 1.6 + (k + 1) * s2 * 1.7 - s2 * 0.4; const ix = x0p + mx + (it.lvl > 1 ? 30 * z : 0);
          D.txt(ctx, it.s, ix, ty, s2, { weight: it.lvl > 1 ? 500 : 700, color: "#1A5FA8" });
          const w1 = measure(ctx, it.s, s2, it.lvl > 1 ? 500 : 700); ctx.fillStyle = "#9AA8B1"; for (let dx = ix + w1 + 10 * z; dx < x0p + mx + tw - 30 * z; dx += 9 * z) ctx.fillRect(dx, ty - 2, 2.5 * z, 2.5 * z);
          D.txt(ctx, String(it.page || 1), x0p + mx + tw, ty, s2, { align: "right", weight: 600, color: UI.ink2 }); r.items.push({ x: ix, y: ty - s2, w: tw, h: s2 * 1.4 }); });
        if (b.mark) { ctx.strokeStyle = UI.hot; ctx.lineWidth = 4; rr(ctx, r.x - 10 * z, r.y - 6 * z, r.w + 20 * z, r.h, 8); ctx.stroke(); }
      } else if (b.t === "ol" || b.t === "ul") {
        const n = b.typed != null ? b.typed : (b.items || []).length; let ly = yy + 4 * z;
        (b.items || []).forEach((s, k) => {
          if (k >= Math.ceil(n - 1e-6)) return;
          const partial = clamp(n - k, 0, 1); const ls = m.lines[k];
          const shownAll = partial >= 1 ? ls : wrapF(ctx, s.slice(0, Math.round(s.length * partial)), m.size, 500, tw - 44 * z);
          const ih = ls.length * m.size * 1.45;
          if (b.sel) { ctx.fillStyle = UI.selectBg; ctx.fillRect(x0p + mx - 4, ly, tw + 8, ih); }
          D.txt(ctx, b.t === "ol" ? (k + 1) + "." : "•", x0p + mx + 8 * z, ly + m.size * 1.08, m.size, { weight: 600, color: b.t === "ol" ? UI.ink : UI.ink2 });
          shownAll.forEach((ln, j) => D.txt(ctx, ln, x0p + mx + 44 * z, ly + m.size * 1.08 + j * m.size * 1.45, m.size, { weight: 500 }));
          if (b.caret && k === Math.ceil(n) - 1 && opt.caret !== false) { const last = shownAll[shownAll.length - 1] || ""; const cw = measure(ctx, last, m.size, 500); ctx.fillStyle = UI.ink; ctx.fillRect(x0p + mx + 46 * z + cw, ly + (shownAll.length - 1) * m.size * 1.45 + m.size * 0.1, 2.5, m.size * 1.15); }
          r.items.push({ x: x0p + mx, y: ly, w: tw, h: ih }); ly += ih + 6 * z;
        });
        if (b.mark) { ctx.strokeStyle = UI.hot; ctx.lineWidth = 4; rr(ctx, r.x - 10 * z, r.y - 4 * z, r.w + 20 * z, r.h, 8); ctx.stroke(); }
      } else if (b.t !== "gap") {
        const s = blockText(b); const lines = s ? wrapF(ctx, s, m.size, m.weight, tw, m.italic) : [""];
        const center = b.center || b.t === "cap"; const color = b.color || (b.t === "cap" ? UI.ink2 : b.t === "h2" || b.t === "h3" ? "#21455A" : UI.ink);
        const ty0 = yy + m.before + m.size * 1.0;
        if (b.sel) { lines.forEach((ln, j) => { const lw = measure(ctx, ln, m.size, m.weight, m.italic); const lx = center ? x0p + mx + (tw - lw) / 2 : x0p + mx; ctx.fillStyle = UI.selectBg; ctx.fillRect(lx - 3, ty0 - m.size * 0.95 + j * m.lh, lw + 6, m.size * 1.25); }); }
        lines.forEach((ln, j) => D.txt(ctx, ln, center ? x0p + mx + tw / 2 : x0p + mx, ty0 + j * m.lh, m.size, { weight: m.weight, italic: m.italic, color, align: center ? "center" : "left" }));
        if (b.caret && opt.caret !== false) { const last = lines[lines.length - 1]; const lw = measure(ctx, last, m.size, m.weight, m.italic); const cx = center ? x0p + mx + tw / 2 + lw / 2 + 3 : x0p + mx + lw + 3; ctx.fillStyle = UI.ink; ctx.fillRect(cx, ty0 - m.size * 0.9 + (lines.length - 1) * m.lh, 2.5, m.size * 1.1); }
        r.textH = lines.length * m.lh; r.ty = ty0; r.size = m.size;
        if (b.mark) { ctx.strokeStyle = UI.hot; ctx.lineWidth = 4; rr(ctx, r.x - 10 * z, yy + m.before - 6 * z, r.w + 20 * z, lines.length * m.lh + 16 * z, 8); ctx.stroke(); }
      }
      ctx.restore();
      rects.push(r); yy += m.h;
    });
    return { blocks: rects, pages, z };
  };
  D.outline = function (ctx, x, y, w, h, heads, opt = {}) {
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.strokeStyle = opt.hot ? UI.hot : "#D5DEE3"; ctx.lineWidth = opt.hot ? 4 : 2; rr(ctx, x, y, w, h, 12); ctx.stroke();
    D.txt(ctx, opt.title || "Kerangka dokumen", x + 18, y + 36, 20, { weight: 800, color: UI.ink2 });
    ctx.fillStyle = "#E1E7EB"; ctx.fillRect(x + 14, y + 52, w - 28, 2);
    if (!heads.length) { wrapF(ctx, "Judul yang kamu buat akan muncul di sini.", 19, 500, w - 36).forEach((ln, i) => D.txt(ctx, ln, x + 18, y + 86 + i * 26, 19, { weight: 500, color: "#8A99A3" })); return []; }
    const rows = [];
    heads.forEach((hd, i) => { const yy = y + 66 + i * 44; const ix = x + 18 + (hd.lvl - 1) * 20; const on = opt.hi === i;
      if (on) { ctx.fillStyle = UI.onBg; rr(ctx, x + 8, yy, w - 16, 38, 6); ctx.fill(); }
      ctx.save(); ctx.beginPath(); ctx.rect(x + 8, yy, w - 16, 38); ctx.clip();
      const fs = hd.lvl > 1 ? 19 : 20, fw = hd.lvl > 1 ? 600 : 800, maxW = x + w - 14 - ix; let s = hd.s;
      if (measure(ctx, s, fs, fw) > maxW) { while (s.length > 3 && measure(ctx, s + "…", fs, fw) > maxW) s = s.slice(0, -1); s = s.trimEnd() + "…"; }
      D.txt(ctx, s, ix, yy + 26, fs, { weight: fw, color: on ? UI.select : UI.ink }); ctx.restore(); rows.push(box(x + 8, yy, w - 16, 38)); });
    return rows;
  };
  D.styleList = function (ctx, x, y, hi, cur) {
    const items = [["Teks normal", 22, 500], ["Judul 1", 32, 800], ["Judul 2", 27, 800], ["Judul 3", 23, 800]]; const w = 290, rh = 58, h = items.length * rh + 14;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 10); ctx.stroke(); const rects = [];
    items.forEach(([s, size, weight], i) => { const yy = y + 7 + i * rh; if (hi === i) { ctx.fillStyle = UI.onBg; rr(ctx, x + 5, yy, w - 10, rh, 6); ctx.fill(); }
      if (cur === s) D.txt(ctx, "✓", x + 22, yy + 38, 22, { weight: 900, color: UI.select });
      D.txt(ctx, s, x + 50, yy + rh / 2 + size * 0.36, size, { weight, color: hi === i ? UI.select : UI.ink }); rects.push(box(x, yy, w, rh)); });
    return { item: i => rects[i] };
  };
  function toolbarBtn(ctx, bx, by, bw, label, opt) {
    if (opt.on) { ctx.fillStyle = UI.onBg; rr(ctx, bx, by, bw, 38, 7); ctx.fill(); }
    if (opt.hot) { ctx.fillStyle = UI.hotBg; rr(ctx, bx - 3, by - 3, bw + 6, 44, 8); ctx.fill(); ctx.strokeStyle = UI.hot; ctx.lineWidth = 3; rr(ctx, bx - 3, by - 3, bw + 6, 44, 8); ctx.stroke(); }
    if (typeof label === "function") label(bx + bw / 2, by + 19); else D.txt(ctx, label, bx + bw / 2, by + 27, 22, { align: "center", weight: 800, color: opt.on ? UI.select : UI.tool, italic: opt.italic });
    if (opt.under) { ctx.fillStyle = UI.tool; ctx.fillRect(bx + bw / 2 - 8, by + 31, 16, 2.5); }
    return box(bx, by, bw, 38);
  }
  function listIcon(ctx, cx, cy, numbered, color) {
    for (let i = 0; i < 3; i++) { const y = cy - 10 + i * 10; ctx.fillStyle = color;
      if (numbered) { ctx.font = "800 10px Inter"; ctx.textAlign = "center"; ctx.fillText(String(i + 1), cx - 10, y + 4); } else { ctx.beginPath(); ctx.arc(cx - 10, y, 2.6, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillRect(cx - 3, y - 1.5, 16, 3); }
  }
  function alignIcon(ctx, cx, cy, center, color) { ctx.fillStyle = color; [18, 12, 18, 12].forEach((w, i) => ctx.fillRect(center ? cx - w / 2 : cx - 9, cy - 9 + i * 6, w, 2.5)); }
  function dropBox(ctx, x, y, w, s, opt = {}) {
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, 38, 7); ctx.fill(); ctx.strokeStyle = opt.hot ? UI.hot : opt.open ? UI.select : "#C9D4DB"; ctx.lineWidth = opt.hot ? 4 : 2; rr(ctx, x, y, w, 38, 7); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(x + 4, y, w - 30, 38); ctx.clip(); D.txt(ctx, s, x + 14, y + 27, 21, { weight: 700 }); ctx.restore();
    D.txt(ctx, "▾", x + w - 12, y + 26, 18, { align: "right", weight: 800, color: UI.ink2 }); return box(x, y, w, 38);
  }
  const sep = (ctx, x, y) => { ctx.fillStyle = "#D5DEE3"; ctx.fillRect(x, y + 4, 2, 30); };
  D.docApp = function (ctx, x, y, w, h, opt = {}) {
    const menus = ["File", "Edit", "Tampilan", "Sisipkan", "Format", "Alat"];
    const area0 = L.window(ctx, x, y, w, h, { title: opt.title || "Dokumen — Tanpa judul", menus, menuOn: opt.menuOn });
    const ty = area0.y, on = opt.on || {}, hot = opt.hot; ctx.fillStyle = "#F7F9FA"; ctx.fillRect(x + 1, ty, w - 2, 54);
    const T = {}; let bx = x + 18; const by = ty + 8;
    T.style = dropBox(ctx, bx, by, 196, opt.style || "Teks normal", { hot: hot === "style", open: opt.styleOpen }); bx += 208;
    T.size = dropBox(ctx, bx, by, 70, String(opt.size || 11), { hot: hot === "size" }); bx += 82; sep(ctx, bx, by); bx += 12;
    T.bold = toolbarBtn(ctx, bx, by, 40, "B", { on: on.bold, hot: hot === "bold" }); bx += 44;
    T.italic = toolbarBtn(ctx, bx, by, 40, "I", { on: on.italic, hot: hot === "italic", italic: true }); bx += 44;
    T.under = toolbarBtn(ctx, bx, by, 40, "U", { on: on.under, hot: hot === "under", under: true }); bx += 50; sep(ctx, bx, by); bx += 12;
    T.ul = toolbarBtn(ctx, bx, by, 44, (cx, cy) => listIcon(ctx, cx, cy, false, on.ul ? UI.select : UI.tool), { on: on.ul, hot: hot === "ul" }); bx += 48;
    T.ol = toolbarBtn(ctx, bx, by, 44, (cx, cy) => listIcon(ctx, cx, cy, true, on.ol ? UI.select : UI.tool), { on: on.ol, hot: hot === "ol" }); bx += 54; sep(ctx, bx, by); bx += 12;
    T.left = toolbarBtn(ctx, bx, by, 40, (cx, cy) => alignIcon(ctx, cx, cy, false, UI.tool), { on: on.left, hot: hot === "left" }); bx += 44;
    T.center = toolbarBtn(ctx, bx, by, 40, (cx, cy) => alignIcon(ctx, cx, cy, true, on.center ? UI.select : UI.tool), { on: on.center, hot: hot === "center" }); bx += 50; sep(ctx, bx, by); bx += 12;
    T.img = toolbarBtn(ctx, bx, by, 44, (cx, cy) => D.icon(ctx, "gambar", cx, cy, 26, UI.tool), { hot: hot === "img" }); bx += 48;
    ctx.fillStyle = UI.line; ctx.fillRect(x + 1, ty + 53, w - 2, 1.5);
    const area = { x: x + 1, y: ty + 54, w: w - 2, h: y + h - ty - 55 };
    ctx.save(); rr(ctx, x + 1, area.y, w - 2, area.h - 1, 14); ctx.clip(); ctx.fillStyle = UI.work; ctx.fillRect(area.x, area.y, area.w, area.h);
    const pw = opt.pageW || 760, ol = opt.outline, olW = 250;
    const pX = ol ? area.x + olW + 30 + (area.w - olW - 30 - pw) / 2 : area.x + (area.w - pw) / 2;
    const res = D.docPages(ctx, pX, area.y + 26 - (opt.scroll || 0), pw, opt.blocks || [], { caret: opt.caret });
    let rows = [];
    if (ol) { const heads = (opt.blocks || []).filter(b => /^h[123]$/.test(b.t) && (b.typed == null || b.typed > 0)).map(b => ({ s: blockText(b), lvl: +b.t[1] }));
      rows = D.outline(ctx, area.x + 16, area.y + 18, olW, Math.min(area.h - 36, 120 + Math.max(1, heads.length) * 44), heads, { hi: opt.outlineHi, hot: opt.outlineHot }); }
    ctx.restore();
    return { area, page: res.pages[0], pages: res.pages, blocks: res.blocks, tool: k => T[k], outlineRows: rows, menu: name => { const p = D.menuPos(ctx, x, menus, name); return { x: p.x, y: y + p.y }; } };
  };
  D.viewer = function (ctx, x, y, w, h, opt = {}) {
    const a0 = L.window(ctx, x, y, w, h, { title: "Penampil PDF — " + (opt.name || "dokumen.pdf") });
    ctx.fillStyle = "#3F4A51"; ctx.fillRect(x + 1, a0.y, w - 2, 50);
    D.txt(ctx, opt.name || "dokumen.pdf", x + 24, a0.y + 33, 21, { weight: 700, color: "#FFFFFF" });
    D.txt(ctx, `${opt.pageNo || 1} / ${opt.pageN || 1}`, x + w / 2, a0.y + 33, 22, { align: "center", weight: 800, color: "#FFFFFF" });
    D.txt(ctx, "−   " + (opt.zoom || "100%") + "   +", x + w - 30, a0.y + 33, 21, { align: "right", weight: 700, color: "#DDE5EA" });
    const area = { x: x + 1, y: a0.y + 50, w: w - 2, h: y + h - a0.y - 51 };
    ctx.save(); rr(ctx, x + 1, area.y, w - 2, area.h - 1, 14); ctx.clip(); ctx.fillStyle = UI.pdf; ctx.fillRect(area.x, area.y, area.w, area.h);
    const pw = opt.pageW || 700; const res = D.docPages(ctx, area.x + (area.w - pw) / 2, area.y + 24 - (opt.scroll || 0), pw, (opt.blocks || []).map(b => ({ ...b, sel: false, caret: false, hot: null })), { caret: false });
    ctx.restore();
    return { area, pages: res.pages, blocks: res.blocks };
  };

  // ---------- slide ----------
  D.SLIDE_LAYOUTS = ["Judul", "Judul dan isi", "Judul dan gambar", "Kosong"];
  function shown(s, n) { s = s || ""; return n != null ? s.slice(0, Math.max(0, Math.round(n))) : s; }
  D.slide = function (ctx, x, y, w, h, spec = {}, opt = {}) {
    const k = h / 540, P = pt => pt * k, ink = spec.ink || "#1F2A33", acc = spec.accent || "#2E7E9A", bg = spec.bg || "#FFFFFF"; const R = {};
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = bg; ctx.fillRect(x, y, w, h);
    const lay = spec.layout || "isi", ty = spec.typed || {}, ph = spec.ph;
    const caretAt = (lines, lx, ly, size, weight, lh, align) => { const last = lines[lines.length - 1] || ""; const lw = measure(ctx, last, size, weight); ctx.fillStyle = ink; ctx.fillRect(align === "center" ? lx + lw / 2 + 3 : lx + lw + 3, ly + (lines.length - 1) * lh - size * 0.85, Math.max(2, 2.5 * k), size * 1.05); };
    const placeholder = (bx, by, bw, bh, s, size) => { ctx.strokeStyle = "#AEBBC3"; ctx.lineWidth = Math.max(1.5, 2 * k); ctx.setLineDash([8 * k, 6 * k]); ctx.strokeRect(bx, by, bw, bh); ctx.setLineDash([]); D.txt(ctx, s, bx + bw / 2, by + bh / 2 + size * 0.35, size, { align: "center", weight: 600, color: "#93A2AB" }); };
    const titleBlock = (bx, by, bw, size, align) => {
      const s = shown(spec.title, ty.title); const lines = s ? wrapF(ctx, s, size, 800, bw) : [];
      if (!lines.length && ph) { placeholder(bx, by - size * 0.2, bw, size * 1.7, "Klik untuk menambah judul", P(24)); R.title = box(bx, by - size * 0.2, bw, size * 1.7); return size * 1.7; }
      lines.forEach((ln, i) => D.txt(ctx, ln, align === "center" ? bx + bw / 2 : bx, by + size * 0.95 + i * size * 1.15, size, { weight: 800, color: spec.titleColor || ink, align: align || "left" }));
      if (spec.caret === "title") caretAt(lines.length ? lines : [""], align === "center" ? bx + bw / 2 : bx, by + size * 0.95, size, 800, size * 1.15, align);
      const th = Math.max(1, lines.length) * size * 1.15; R.title = box(bx, by, bw, th + size * 0.2); return th;
    };
    const bullets = (bx, by, bw, bh) => {
      const size = P(spec.bodyPt || 28); const items = spec.bullets || []; let yy = by; R.items = [];
      let left = ty.body != null ? ty.body : Infinity;
      if (!items.length && ph) { placeholder(bx, by, bw, bh, "Klik untuk menambah teks", P(20)); R.body = box(bx, by, bw, bh); return; }
      items.forEach((s0, i) => { if (left <= 0 && i > 0) return; const s = left < s0.length ? s0.slice(0, Math.max(0, Math.round(left))) : s0; left -= s0.length;
        const lines = wrapF(ctx, s0, size, 600, bw - size * 1.3).map(() => "");
        const real = wrapF(ctx, s || " ", size, 600, bw - size * 1.3); const col = (spec.colors && spec.colors[i]) || ink;
        ctx.fillStyle = (spec.colors && spec.colors[i]) || acc; ctx.beginPath(); ctx.arc(bx + size * 0.35, yy + size * 0.62, size * 0.16, 0, Math.PI * 2); ctx.fill();
        real.forEach((ln, j) => D.txt(ctx, ln, bx + size * 1.0, yy + size * 0.95 + j * size * 1.25, size, { weight: 600, color: col }));
        if (spec.caret === "body" && (left <= 0 || i === items.length - 1)) caretAt(real, bx + size * 1.0, yy + size * 0.95, size, 600, size * 1.25);
        const ih = Math.max(lines.length, real.length) * size * 1.25; R.items.push(box(bx, yy, bw, ih)); yy += ih + size * 0.5; });
      R.body = box(bx, by, bw, Math.max(yy - by, size * 1.3));
    };
    const band = () => { if (spec.band !== false) { ctx.fillStyle = acc; ctx.fillRect(x, y, w, P(10)); } };
    const img = (bx, by, bw, bh) => { if (spec.img) { D.pic(ctx, bx, by, bw, bh, spec.img.kind, { r: P(10), label: spec.img.label }); R.img = box(bx, by, bw, bh); } else if (ph) { placeholder(bx, by, bw, bh, "Klik untuk menambah gambar", P(20)); R.img = box(bx, by, bw, bh); } };
    if (lay === "judul" || lay === "akhir") {
      ctx.fillStyle = acc; ctx.fillRect(x, y + h - P(70), w, P(70)); band();
      const ts = P(spec.titlePt || 54); const tw = w - P(140);
      const lines = wrapF(ctx, shown(spec.title, ty.title) || " ", ts, 800, tw); const top = y + h * 0.36 - (lines.length - 1) * ts * 0.6;
      titleBlock(x + P(70), top, tw, ts, "center");
      if (spec.sub != null || ph) { const ss = P(spec.subPt || 28), s = shown(spec.sub, ty.body); const sy = top + lines.length * ts * 1.15 + P(30);
        if (!s && ph) { placeholder(x + P(170), sy, w - P(340), ss * 1.8, "Klik untuk menambah subjudul", P(20)); R.sub = box(x + P(170), sy, w - P(340), ss * 1.8); }
        else { D.txt(ctx, s, x + w / 2, sy + ss, ss, { align: "center", weight: 600, color: spec.subColor || "#4A5A66" }); if (spec.caret === "sub") caretAt([s], x + w / 2, sy + ss, ss, 600, 0, "center"); R.sub = box(x + P(170), sy, w - P(340), ss * 1.4); } }
    } else if (lay === "kosong") { band(); }
    else {
      band(); const ts = P(spec.titlePt || 40); const th = titleBlock(x + P(56), y + P(40), w - P(112), ts);
      const by = y + P(40) + Math.max(th, ts * 1.15) + P(28), bh = y + h - P(36) - by;
      if (lay === "isi") bullets(x + P(60), by, w - P(120), bh);
      else if (lay === "isi_gambar") { bullets(x + P(60), by, w * 0.52 - P(60), bh); img(x + w * 0.56, by, w * 0.44 - P(56), Math.min(bh, (w * 0.44 - P(56)) * 0.85)); }
      else if (lay === "gambar") { const iw = Math.min(w - P(200), (bh - (spec.cap ? P(50) : 0)) / 0.62); img(x + (w - iw) / 2, by, iw, iw * 0.62); if (spec.cap) D.txt(ctx, spec.cap, x + w / 2, by + iw * 0.62 + P(36), P(spec.bodyPt || 24), { align: "center", weight: 600, color: "#4A5A66" }); }
      else if (lay === "angka") { const ns = P(spec.numPt || 120); D.txt(ctx, spec.num || "", x + w / 2, by + ns * 0.9, ns, { align: "center", weight: 900, color: acc }); R.num = box(x + w / 2 - ns * 1.5, by, ns * 3, ns);
        if (spec.cap) D.txt(ctx, spec.cap, x + w / 2, by + ns * 0.9 + P(56), P(spec.bodyPt || 28), { align: "center", weight: 600, color: ink }); }
      else if (lay === "padat") { const size = P(spec.bodyPt || 14); let yy = by; (spec.para || []).forEach((s, i) => { const col = (spec.colors && spec.colors[i % spec.colors.length]) || ink;
          wrapF(ctx, s, size, 500, w - P(120)).forEach(ln => { D.txt(ctx, ln, x + P(60), yy + size, size, { weight: 500, color: col }); yy += size * 1.3; }); yy += size * 0.3; });
        if (spec.img) img(x + w - P(150), y + P(26), P(110), P(70)); R.body = box(x + P(60), by, w - P(120), yy - by); }
    }
    if (spec.sel && R[spec.sel]) { const q = R[spec.sel]; D.selBox(ctx, q.x - P(8), q.y - P(6), q.w + P(16), q.h + P(12), { handles: spec.sel === "img", hot: spec.hot }); }
    ctx.restore();
    ctx.strokeStyle = opt.border || "#C9D4DB"; ctx.lineWidth = opt.lw || 1.5; ctx.strokeRect(x, y, w, h);
    return R;
  };
  D.layoutMenu = function (ctx, x, y, hi) {
    const w = 560, h = 300; ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 12); ctx.stroke(); const rects = [];
    const specs = [{ layout: "judul", title: "Judul", sub: "subjudul", band: false }, { layout: "isi", title: "Judul", bullets: ["poin", "poin"], band: false }, { layout: "isi_gambar", title: "Judul", bullets: ["poin"], img: { kind: "pemandangan" }, band: false }, { layout: "kosong", band: false }];
    specs.forEach((sp, i) => { const cx = x + 20 + (i % 2) * 270, cy = y + 16 + Math.floor(i / 2) * 142; if (hi === i) { ctx.fillStyle = UI.onBg; rr(ctx, cx - 6, cy - 6, 262, 136, 8); ctx.fill(); }
      D.slide(ctx, cx + 30, cy, 190, 107, { ...sp, accent: "#9AA8B1", ink: "#5B6B76", titlePt: sp.layout === "judul" ? 70 : 60, bodyPt: 50, subPt: 46 }, { border: hi === i ? UI.select : "#C9D4DB", lw: hi === i ? 3 : 1.5 });
      D.txt(ctx, D.SLIDE_LAYOUTS[i], cx + 125, cy + 126, 17, { align: "center", weight: 700, color: hi === i ? UI.select : UI.ink2 }); rects.push(box(cx, cy, 250, 130)); });
    return { item: i => rects[i] };
  };
  D.slideApp = function (ctx, x, y, w, h, opt = {}) {
    const menus = ["File", "Edit", "Tampilan", "Sisipkan", "Format", "Slide"];
    const a0 = L.window(ctx, x, y, w, h, { title: opt.title || "Slide — Tanpa judul", menus, menuOn: opt.menuOn });
    const ty = a0.y, hot = opt.hot, on = opt.on || {}; ctx.fillStyle = "#F7F9FA"; ctx.fillRect(x + 1, ty, w - 2, 54);
    const T = {}; let bx = x + 18; const by = ty + 8;
    T.add = toolbarBtn(ctx, bx, by, 150, "+ Slide baru", { hot: hot === "add" }); bx += 160;
    T.layout = toolbarBtn(ctx, bx, by, 150, "Tata letak ▾", { hot: hot === "layout" }); bx += 162; sep(ctx, bx, by); bx += 12;
    T.size = dropBox(ctx, bx, by, 70, String(opt.size || 28), { hot: hot === "size" }); bx += 82;
    T.bold = toolbarBtn(ctx, bx, by, 40, "B", { on: on.bold, hot: hot === "bold" }); bx += 44;
    T.color = toolbarBtn(ctx, bx, by, 44, (cx, cy) => { D.txt(ctx, "A", cx, cy + 6, 22, { align: "center", weight: 800, color: UI.tool }); ctx.fillStyle = opt.colorBar || "#1F2A33"; ctx.fillRect(cx - 12, cy + 10, 24, 5); }, { hot: hot === "color" }); bx += 54; sep(ctx, bx, by); bx += 12;
    T.img = toolbarBtn(ctx, bx, by, 44, (cx, cy) => D.icon(ctx, "gambar", cx, cy, 26, UI.tool), { hot: hot === "img" }); bx += 48;
    T.play = D.btn(ctx, x + w - 190, by, 170, 38, "▶ Tampilkan", { hot: hot === "play", size: 20 });
    ctx.fillStyle = UI.line; ctx.fillRect(x + 1, ty + 53, w - 2, 1.5);
    const area = { x: x + 1, y: ty + 54, w: w - 2, h: y + h - ty - 55 };
    ctx.save(); rr(ctx, x + 1, area.y, w - 2, area.h - 1, 14); ctx.clip(); ctx.fillStyle = UI.work; ctx.fillRect(area.x, area.y, area.w, area.h);
    // daftar slide di kiri
    const pw = 200; ctx.fillStyle = "#F4F7F9"; ctx.fillRect(area.x, area.y, pw, area.h); ctx.fillStyle = UI.line; ctx.fillRect(area.x + pw, area.y, 1.5, area.h);
    const slides = opt.slides || [], cur = opt.cur || 0, thumbs = []; const tw = 144, th = 81, gap = Math.min(16, (area.h - 16 - slides.length * th) / Math.max(1, slides.length));
    slides.forEach((sp, i) => { const tx = area.x + 42, tyy = area.y + 10 + i * (th + gap) - (opt.thumbScroll || 0);
      D.txt(ctx, String(i + 1), area.x + 20, tyy + 24, 17, { align: "center", weight: 700, color: i === cur ? UI.select : UI.ink2 });
      if (i === cur) { ctx.strokeStyle = UI.select; ctx.lineWidth = 4; rr(ctx, tx - 4, tyy - 4, tw + 8, th + 8, 6); ctx.stroke(); }
      ctx.save(); if (sp && sp.alpha != null) ctx.globalAlpha = sp.alpha; D.slide(ctx, tx, tyy, tw, th, sp || {}, { lw: 1 }); ctx.restore(); thumbs.push(box(tx, tyy, tw, th)); });
    // slide besar
    const sw = Math.min(area.w - pw - 50, (area.h - 24) * 16 / 9), sh = sw * 9 / 16; const stage = { x: area.x + pw + (area.w - pw - sw) / 2, y: area.y + (area.h - sh) / 2, w: sw, h: sh };
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.16)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(stage.x, stage.y, sw, sh); ctx.restore();
    const els = D.slide(ctx, stage.x, stage.y, sw, sh, slides[cur] || { layout: "kosong" });
    ctx.restore();
    return { thumbs, stage, els, area, tool: k => T[k], menu: name => { const p = D.menuPos(ctx, x, menus, name); return { x: p.x, y: y + p.y }; } };
  };

  // ---------- kanvas infografik ----------
  D.info = function (ctx, page, els, opt = {}) {
    const k = page.w / 600, out = {};
    ctx.save(); ctx.beginPath(); ctx.rect(page.x, page.y, page.w, page.h); ctx.clip();
    const X = v => page.x + v * k, Y = v => page.y + v * k;
    if (opt.margin) { ctx.strokeStyle = "rgba(214,51,132,0.55)"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]); ctx.strokeRect(X(opt.margin), Y(opt.margin), page.w - 2 * opt.margin * k, page.h - 2 * opt.margin * k); ctx.setLineDash([]); }
    els.forEach(e => {
      if (!e) return; ctx.save(); if (e.alpha != null) ctx.globalAlpha = clamp(e.alpha, 0, 1);
      const dx = e.dx || 0, dy = e.dy || 0; let r = null;
      if (e.t === "rect") { ctx.fillStyle = e.fill || "#EEE"; rr(ctx, X(e.x + dx), Y(e.y + dy), e.w * k, e.h * k, (e.r || 0) * k); ctx.fill(); if (e.stroke) { ctx.strokeStyle = e.stroke; ctx.lineWidth = (e.lw || 2) * k; ctx.stroke(); } r = box(X(e.x + dx), Y(e.y + dy), e.w * k, e.h * k); }
      else if (e.t === "circle") { ctx.fillStyle = e.fill || "#EEE"; ctx.beginPath(); ctx.arc(X(e.x + dx), Y(e.y + dy), e.rad * k, 0, Math.PI * 2); ctx.fill(); r = box(X(e.x + dx - e.rad), Y(e.y + dy - e.rad), 2 * e.rad * k, 2 * e.rad * k); }
      else if (e.t === "line") { ctx.strokeStyle = e.color || "#999"; ctx.lineWidth = (e.lw || 2) * k; if (e.dash) ctx.setLineDash([6 * k, 5 * k]); ctx.beginPath(); ctx.moveTo(X(e.x + dx), Y(e.y + dy)); ctx.lineTo(X(e.x2 + dx), Y(e.y2 + dy)); ctx.stroke(); ctx.setLineDash([]); }
      else if (e.t === "icon") { if (e.bg) { ctx.fillStyle = e.bg; ctx.beginPath(); ctx.arc(X(e.x + dx), Y(e.y + dy), e.s * 0.62 * k, 0, Math.PI * 2); ctx.fill(); } D.icon(ctx, e.kind, X(e.x + dx), Y(e.y + dy), e.s * k, e.color); r = box(X(e.x + dx - e.s * 0.62), Y(e.y + dy - e.s * 0.62), e.s * 1.24 * k, e.s * 1.24 * k); }
      else if (e.t === "pic") { D.pic(ctx, X(e.x + dx), Y(e.y + dy), e.w * k, e.h * k, e.kind, { r: (e.r || 10) * k }); r = box(X(e.x + dx), Y(e.y + dy), e.w * k, e.h * k); }
      else if (e.t === "text") {
        const size = e.size * k, weight = e.weight || 700, s = e.typed != null ? e.s.slice(0, Math.max(0, Math.round(e.typed))) : e.s;
        const lines = e.maxW ? wrapF(ctx, s || " ", size, weight, e.maxW * k, e.italic) : [s]; const lh = size * (e.lh || 1.2);
        const ax = X(e.x + dx), ay = Y(e.y + dy);
        lines.forEach((ln, i) => D.txt(ctx, ln, ax, ay + i * lh, size, { weight, color: e.color || UI.ink, align: e.align || "left", italic: e.italic }));
        if (e.caret) { const lw = measure(ctx, lines[lines.length - 1], size, weight, e.italic); const cx = e.align === "center" ? ax + lw / 2 + 3 : ax + lw + 3; ctx.fillStyle = UI.ink; ctx.fillRect(cx, ay + (lines.length - 1) * lh - size * 0.85, 2.5, size); }
        const full = e.maxW ? wrapF(ctx, e.s, size, weight, e.maxW * k, e.italic) : [e.s]; const mw = Math.max(...full.map(ln => measure(ctx, ln, size, weight, e.italic)));
        const bw = e.maxW && e.align !== "center" ? Math.max(mw, 10) : mw; const bx = e.align === "center" ? ax - bw / 2 : e.align === "right" ? ax - bw : ax;
        r = box(bx, ay - size * 0.95, bw, size * 0.95 + (full.length - 1) * lh + size * 0.3);
      }
      ctx.restore(); if (e.id && r) out[e.id] = r;
    });
    (opt.guides || []).forEach(g => { ctx.strokeStyle = "#D63384"; ctx.lineWidth = 2; ctx.beginPath(); if (g.x != null) { ctx.moveTo(X(g.x), page.y); ctx.lineTo(X(g.x), page.y + page.h); } else { ctx.moveTo(page.x, Y(g.y)); ctx.lineTo(page.x + page.w, Y(g.y)); } ctx.stroke(); });
    ctx.restore();
    if (opt.sel && out[opt.sel]) { const q = out[opt.sel]; D.selBox(ctx, q.x - 8, q.y - 6, q.w + 16, q.h + 12, { hot: opt.hot }); }
    return out;
  };
  D.canvasApp = function (ctx, x, y, w, h, opt = {}) {
    const menus = ["File", "Edit", "Tampilan", "Sisipkan", "Atur"];
    const a0 = L.window(ctx, x, y, w, h, { title: opt.title || "Desain — Tanpa judul", menus, menuOn: opt.menuOn });
    const ty = a0.y, hot = opt.hot, on = opt.on || {}; ctx.fillStyle = "#F7F9FA"; ctx.fillRect(x + 1, ty, w - 2, 54);
    const T = {}; let bx = x + 150; const by = ty + 8;
    T.size = dropBox(ctx, bx, by, 80, String(opt.size || 24), { hot: hot === "size" }); bx += 92;
    T.bold = toolbarBtn(ctx, bx, by, 40, "B", { on: on.bold, hot: hot === "bold" }); bx += 44;
    T.align = toolbarBtn(ctx, bx, by, 40, (cx, cy) => alignIcon(ctx, cx, cy, true, UI.tool), { hot: hot === "align" }); bx += 50; sep(ctx, bx, by); bx += 14;
    D.txt(ctx, "Warna", bx, by + 26, 19, { weight: 700, color: UI.ink2 }); bx += 66;
    const sw = opt.swatches || ["#1F2A33", "#2E9E5B", "#F2B134", "#FFFFFF"]; const swR = [];
    sw.forEach((c, i) => { const cx = bx + 18 + i * 44; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, by + 19, 15, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = opt.swatchOn === i ? UI.select : "#AEBBC3"; ctx.lineWidth = opt.swatchOn === i ? 4 : 1.5; ctx.stroke(); swR.push(box(cx - 18, by, 36, 38)); });
    ctx.fillStyle = UI.line; ctx.fillRect(x + 1, ty + 53, w - 2, 1.5);
    const area = { x: x + 1, y: ty + 54, w: w - 2, h: y + h - ty - 55 };
    ctx.save(); rr(ctx, x + 1, area.y, w - 2, area.h - 1, 14); ctx.clip(); ctx.fillStyle = UI.work; ctx.fillRect(area.x, area.y, area.w, area.h);
    // panel alat di kiri (juga menutupi bagian kiri bilah alat)
    const pw = 128; ctx.fillStyle = "#F4F7F9"; ctx.fillRect(area.x, area.y, pw, area.h); ctx.fillStyle = UI.line; ctx.fillRect(area.x + pw, area.y, 1.5, area.h);
    const tools = [["Teks", null], ["Bentuk", null], ["Ikon", "bintang"], ["Gambar", "gambar"], ["Grafik", "grafik"]]; const pr = [];
    tools.forEach(([s, ic], i) => { const yy = area.y + 14 + i * 92; const onp = opt.panelHi === i;
      if (onp) { ctx.fillStyle = UI.hotBg; rr(ctx, area.x + 10, yy, pw - 20, 82, 10); ctx.fill(); ctx.strokeStyle = UI.hot; ctx.lineWidth = 3; rr(ctx, area.x + 10, yy, pw - 20, 82, 10); ctx.stroke(); }
      const cx = area.x + pw / 2, cy = yy + 32;
      if (s === "Teks") D.txt(ctx, "T", cx, cy + 12, 34, { align: "center", weight: 900, color: UI.tool });
      else if (s === "Bentuk") { ctx.strokeStyle = UI.tool; ctx.lineWidth = 3; ctx.strokeRect(cx - 18, cy - 12, 22, 22); ctx.beginPath(); ctx.arc(cx + 8, cy + 4, 12, 0, Math.PI * 2); ctx.stroke(); }
      else D.icon(ctx, ic, cx, cy, 34, UI.tool);
      D.txt(ctx, s, cx, yy + 72, 18, { align: "center", weight: 700, color: onp ? UI.ink : UI.ink2 }); pr.push(box(area.x + 10, yy, pw - 20, 82)); });
    const ratio = opt.ratio || 4 / 3; const ph = area.h - 36, pW = ph / ratio;
    const page = { x: area.x + pw + (area.w - pw - pW) / 2, y: area.y + 18, w: pW, h: ph };
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.18)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4; ctx.fillStyle = opt.bg || "#FFFFFF"; ctx.fillRect(page.x, page.y, page.w, page.h); ctx.restore();
    const ids = D.info(ctx, page, opt.els || [], { sel: opt.sel, guides: opt.guides, margin: opt.margin, hot: opt.selHot });
    ctx.restore();
    ctx.fillStyle = "#F7F9FA"; ctx.fillRect(x + 1, ty, 140, 53);
    return { page, area, ids, panel: i => pr[i], swatch: i => swR[i], tool: k => T[k], menu: name => { const p = D.menuPos(ctx, x, menus, name); return { x: p.x, y: y + p.y }; } };
  };

  K.dok = D;
})(typeof window !== "undefined" ? window : globalThis);
