/* Layar Web: pembantu gambar bersama untuk simulasi yang memakai browser, halaman web, formulir, dan halaman admin router
   (S09, S17; dipakai juga S10, S27, S29, S31, S07, S08, S30, S11). Pemilik: kelompok S09/S17.
   Muat setelah kiko-core.js dan layar.js:
     "engine": ["../../_alat/kiko-core.js", "../../_alat/layar.js", "../../_alat/layar_web.js", "scenes.js"]
   Semua tampilan generik: tanpa logo, warna khas, atau tata letak yang meniru merek tertentu. Situs rekaan memakai domain .example,
   IP memakai 192.168.x.x / 10.x.x.x. Ukuran huruf dirancang untuk kanvas 1920×1080 (terbaca juga saat dipotong untuk Short).

   ===== API: Kiko.web (di adegan: const W = K.web) =====
   Waktu dan pointer (dipakai di adegan beraksi; l = detik lokal beat, span = lama aksi, biasanya (b.audio || b.dur) * 0.9):
     W.seq(l, span, ds)            ds = durasi relatif tiap langkah [1, 2, 1]; → {i: langkah sekarang, u: kemajuan langkah itu 0..1,
                                   p(k): kemajuan langkah k 0..1, at(k): true bila langkah k sudah dimulai, n: jumlah langkah selesai}
     W.path(l, span, pts, from)    pointer bergerak ke tiap titik berurutan. pts = [{x, y, d, click, down}] (d relatif, bawaan 1;
                                   click: denyut klik di akhir gerak; down: tombol ditahan selama langkah itu). from = posisi awal.
                                   → {x, y, click (0..1 atau 0), down, i}. Gambar dengan K.layar.cursor(ctx, p.x, p.y, {click: p.click}).
     W.typed(s, u)                 potongan s yang sudah "diketik" pada kemajuan u (0..1).
     W.num(n)                      3120000 → "3.120.000" (format Indonesia).
   Jendela browser:
     W.browser(ctx, x, y, w, h, opt) → {x, y, w, h (area isi halaman), url: {x, y, w, h, cx, cy}, tab(i), back, fwd, reload, newTab}
         opt.tabs: ["Judul", ...] (bawaan ["Tab baru"]), opt.tab: indeks tab aktif, opt.url: "cari.example/…" (tanpa https://),
         opt.secure: true (gembok, bawaan) | false ("Tidak aman"), opt.urlFocus, opt.caret, opt.urlSel (alamat tersorot),
         opt.urlMark: [awal, akhir] bagian alamat yang disorot kuning, opt.loading: 0..1 (garis muat di bawah bilah alamat),
         opt.canBack, opt.canFwd, opt.bg (warna isi, bawaan putih), opt.dim (0..1, isi digelapkan untuk dialog).
         Isi halaman digambar pemanggil di area yang dikembalikan; pakai W.clip(ctx, area, fn) supaya tidak meluber.
     W.clip(ctx, area, fn)         gambar fn() terpotong di dalam area {x, y, w, h}.
   Halaman hasil pencarian (mesin pencari rekaan, nama bawaan "Cari"):
     W.searchPage(ctx, area, st) → {box (+ box.at(i): x huruf ke-i query, box.end), btn, tabsY, tools, timeBtn, timeItem(i), result(i), count, bottom}
         st.engine ("Cari"), st.query, st.focus, st.caret, st.caretAt (indeks posisi kursor, bawaan akhir), st.mark [awal, akhir] (sorot kuning di query), st.home (halaman awal: kotak di tengah),
         st.tab (indeks tab "Semua/Gambar/Berita/Video"), st.tools (bilah alat terbuka), st.time (teks pilihan waktu, bawaan "Kapan saja"),
         st.timeOpen (menu waktu terbuka), st.timeHi (indeks pilihan yang disorot), st.count (teks jumlah hasil, mis. "Sekitar 3.120.000 hasil (0,41 detik)"),
         st.countMark (sorot kuning pada baris jumlah), st.results [hasil], st.snipLines (baris cuplikan, bawaan 2), st.empty (pesan bila results kosong), st.scroll (px).
       hasil = {title, url, snippet ("teks dengan *kata tebal*"), date ("12 Mar 2026"), type ("PDF"), ad (label Iklan),
                mark ("good" | "bad" | "dim"), alpha (0..1), strike (coret, untuk hasil yang dibuang)}
     W.result(ctx, x, y, w, r, snipLines) → tinggi satu hasil (dipakai searchPage; bisa dipakai sendiri, mis. kartu perbandingan).
     W.TIME_ITEMS                  ["Kapan saja", "24 jam terakhir", "Seminggu terakhir", "Sebulan terakhir", "Setahun terakhir"]
   Halaman web generik:
     W.page(ctx, area, st) → {head, title, body, bottom}: st.site (nama situs di kepala), st.nav ["Beranda", ...], st.head (warna kepala netral),
         st.title, st.meta ("Oleh … · 3 Nov 2026"), st.body (["paragraf", ...] atau angka = jumlah baris abu-abu), st.img ({label, h}), st.size.
   Formulir (semua mengembalikan kotaknya {x, y, w, h, cx, cy}):
     W.field(ctx, x, y, w, opt)    kolom teks. opt.label (di atas), value, placeholder, password (titik-titik), show (sandi terlihat; ikon mata),
                                   focus, caret, error (pesan merah), ok (bingkai hijau), hint (teks kecil abu-abu), h (bawaan 56), size (bawaan 24),
                                   mark [awal, akhir] sorot kuning, disabled.
     W.button(ctx, x, y, w, h, label, opt)   opt.kind "primary" (bawaan) | "secondary" | "danger" | "good", press (0..1 denyut), disabled, size.
     W.checkbox(ctx, x, y, label, on, opt)   opt.size (bawaan 24), maxW (label dilipat), focus.
     W.radio(ctx, x, y, label, on, opt)      sama dengan checkbox.
     W.toggle(ctx, x, y, on, opt)            sakelar; on boleh pecahan 0..1 untuk animasi; opt.label di kanan.
     W.select(ctx, x, y, w, value, opt) → {x, y, w, h, cx, cy, item(i)}   pilihan dropdown. opt.label, open, items [...], hi (disorot),
                                   sel (terpilih, diberi ✓), warn [indeks yang ditandai merah, mis. pilihan tidak aman], h, size.
     W.banner(ctx, x, y, w, msg, kind) → tinggi   kind "info" | "warn" | "bad" | "good".
     W.meter(ctx, x, y, w, level)  kekuatan sandi 0..4 → "Sangat lemah", "Lemah", "Sedang", "Kuat", "Sangat kuat".
     W.progress(ctx, x, y, w, u, opt)        garis kemajuan; opt.label di atasnya.
     W.rich(ctx, s, x, y, size, maxW, opt) → tinggi   teks berlipat dengan *tebal*; opt.lines (maks baris, sisanya "…"), lh, color, weight, boldColor.
   Router (halaman admin generik; menu W.ROUTER_MENU = ["Status", "Wi-Fi", "Keamanan", "Jaringan Tamu", "Sistem"]):
     W.routerLogin(ctx, area, st) → {user, pass, btn}   st.user, st.pass, st.focus ("user" | "pass"), st.caret, st.error, st.name ("Router"), st.press.
     W.routerAdmin(ctx, area, st) → {menu(nama), content {x, y, w, h}, logout}   st.active (nama menu), st.name, st.warn (pesan peringatan di atas isi),
                                   st.user ("admin"). Isi halaman digambar pemanggil di content; pakai W.row untuk baris pengaturan.
     W.row(ctx, c, y, label, opt) → x kontrol   baris pengaturan: label di kiri (lebar opt.lw, bawaan 300), garis pemisah; kontrol digambar pemanggil.
     W.devices(ctx, x, y, w, list, opt) → tinggi   daftar perangkat tersambung: list [{name, kind: "hp"|"laptop"|"tv"|"printer"|"kamera", ip, on, net}].
     W.routerBox(ctx, cx, cy, s, opt)        router fisik generik (kotak + dua antena + lampu). opt.lamps [true, ...], opt.blink (detik), opt.flip (sisi bawah + stiker).
     W.sticker(ctx, x, y, w, rows, opt) → tinggi   stiker label: rows [["Wi-Fi", "RUMAH-KITA-12"], ...]; opt.hi (indeks baris disorot), opt.title, opt.size.
   Ikon kecil: W.icon(ctx, kind, cx, cy, s, color)  kind "lock" | "unlock" | "search" | "back" | "fwd" | "reload" | "eye" | "eyeOff" | "wifi" |
                                   "caret" | "check" | "cross" | "warn" | "plus" | "hp" | "laptop" | "tv" | "printer" | "kamera" | "pdf" | "user" | "gear" | "home".
*/
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, ease, clamp, lerp } = H;
  const W = {};
  const UI = {
    frame: "#C9D4DB", chrome: "#E9EEF2", tabOn: "#FFFFFF", ink: "#26323B", ink2: "#5B6B76", ink3: "#8A99A3", line: "#DDE5EA",
    link: "#1A56B8", url: "#1E7A3C", focus: "#1A73C8", focusBg: "#E7F1FB", mark: "rgba(242,177,52,0.42)", field: "#FFFFFF",
    good: "#2E9E5B", bad: "#D9443B", warn: "#C07A0C", warnBg: "#FFF3D6", badBg: "#FBE1DF", goodBg: "#DDF3E4", infoBg: "#E7F1FB",
    side: "#2F3E48", sideOn: "#46606F", sideInk: "#DCE6EC"
  };
  W.UI = UI;
  const F = (w, s) => `${w} ${s}px ${K.FONT}`;
  const measure = (ctx, s, size, weight = 600) => { ctx.font = F(weight, size); return ctx.measureText(s).width; };

  // ---------- waktu & pointer ----------
  W.seq = function (l, span, ds) {
    const tot = ds.reduce((a, b) => a + b, 0), unit = span / tot; const ends = []; let acc = 0;
    ds.forEach(d => { acc += d * unit; ends.push(acc); });
    const p = k => clamp((l - (k ? ends[k - 1] : 0)) / (ds[k] * unit), 0, 1);
    let i = ends.findIndex(e => l < e); if (i < 0) i = ds.length - 1;
    return { i, u: p(i), p, at: k => l >= (k ? ends[k - 1] : 0), n: ends.filter(e => l >= e).length };
  };
  W.path = function (l, span, pts, from) {
    const S = W.seq(l, span, pts.map(q => q.d || 1)); let cur = from || { x: pts[0].x, y: pts[0].y };
    for (let k = 0; k < S.i; k++) cur = { x: pts[k].x, y: pts[k].y };
    const q = pts[S.i], u = S.u, m = ease(clamp(u / 0.55, 0, 1));
    const click = q.click && u > 0.55 && u < 1 ? clamp((u - 0.55) / 0.45, 0, 0.99) : 0;
    return { x: lerp(cur.x, q.x, m), y: lerp(cur.y, q.y, m), click, down: !!q.down && u > 0.1, i: S.i };
  };
  W.typed = (s, u) => s.slice(0, Math.round(s.length * clamp(u, 0, 1)));
  W.num = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  W.clip = function (ctx, a, fn) { ctx.save(); ctx.beginPath(); ctx.rect(a.x, a.y, a.w, a.h); ctx.clip(); const r = fn(); ctx.restore(); return r; };

  // ---------- ikon ----------
  W.icon = function (ctx, kind, cx, cy, s, color) {
    const c = color || UI.ink2; ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = Math.max(2, s * 0.12); ctx.lineCap = "round"; ctx.lineJoin = "round";
    const L = (pts, close) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x * s, y * s) : ctx.moveTo(x * s, y * s)); if (close) ctx.closePath(); ctx.stroke(); };
    switch (kind) {
      case "lock": case "unlock":
        rr(ctx, -0.38 * s, -0.05 * s, 0.76 * s, 0.55 * s, 0.1 * s); ctx.fill();
        ctx.beginPath(); if (kind === "lock") ctx.arc(0, -0.08 * s, 0.24 * s, Math.PI, 0); else ctx.arc(0.3 * s, -0.12 * s, 0.24 * s, Math.PI, -0.2);
        ctx.stroke(); break;
      case "search": ctx.beginPath(); ctx.arc(-0.08 * s, -0.08 * s, 0.3 * s, 0, Math.PI * 2); ctx.stroke(); L([[0.14, 0.14], [0.42, 0.42]]); break;
      case "back": L([[0.38, 0], [-0.38, 0]]); L([[-0.05, -0.32], [-0.38, 0], [-0.05, 0.32]]); break;
      case "fwd": L([[-0.38, 0], [0.38, 0]]); L([[0.05, -0.32], [0.38, 0], [0.05, 0.32]]); break;
      case "reload": ctx.beginPath(); ctx.arc(0, 0, 0.34 * s, -Math.PI * 0.35, Math.PI * 1.45); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0.42 * s, -0.42 * s); ctx.lineTo(0.3 * s, -0.08 * s); ctx.lineTo(0.02 * s, -0.3 * s); ctx.closePath(); ctx.fill(); break;
      case "eye": case "eyeOff": ctx.beginPath(); ctx.moveTo(-0.45 * s, 0); ctx.quadraticCurveTo(0, -0.42 * s, 0.45 * s, 0); ctx.quadraticCurveTo(0, 0.42 * s, -0.45 * s, 0); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 0.12 * s, 0, Math.PI * 2); ctx.fill(); if (kind === "eyeOff") L([[-0.4, 0.36], [0.4, -0.36]]); break;
      case "wifi": [0.42, 0.28, 0.14].forEach(r => { ctx.beginPath(); ctx.arc(0, 0.3 * s, r * s, -Math.PI * 0.78, -Math.PI * 0.22); ctx.stroke(); });
        ctx.beginPath(); ctx.arc(0, 0.3 * s, 0.05 * s, 0, Math.PI * 2); ctx.fill(); break;
      case "caret": ctx.beginPath(); ctx.moveTo(-0.3 * s, -0.12 * s); ctx.lineTo(0.3 * s, -0.12 * s); ctx.lineTo(0, 0.2 * s); ctx.closePath(); ctx.fill(); break;
      case "check": L([[-0.32, 0.02], [-0.08, 0.26], [0.36, -0.26]]); break;
      case "cross": L([[-0.28, -0.28], [0.28, 0.28]]); L([[0.28, -0.28], [-0.28, 0.28]]); break;
      case "plus": L([[-0.3, 0], [0.3, 0]]); L([[0, -0.3], [0, 0.3]]); break;
      case "warn": ctx.beginPath(); ctx.moveTo(0, -0.42 * s); ctx.lineTo(0.46 * s, 0.38 * s); ctx.lineTo(-0.46 * s, 0.38 * s); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-0.04 * s, -0.16 * s, 0.08 * s, 0.32 * s); ctx.fillRect(-0.04 * s, 0.22 * s, 0.08 * s, 0.08 * s); break;
      case "hp": rr(ctx, -0.22 * s, -0.42 * s, 0.44 * s, 0.84 * s, 0.08 * s); ctx.stroke(); L([[-0.06, 0.32], [0.06, 0.32]]); break;
      case "laptop": rr(ctx, -0.34 * s, -0.32 * s, 0.68 * s, 0.46 * s, 0.05 * s); ctx.stroke(); L([[-0.46, 0.28], [0.46, 0.28]]); break;
      case "tv": rr(ctx, -0.44 * s, -0.32 * s, 0.88 * s, 0.56 * s, 0.05 * s); ctx.stroke(); L([[-0.18, 0.38], [0.18, 0.38]]); break;
      case "printer": rr(ctx, -0.42 * s, -0.12 * s, 0.84 * s, 0.38 * s, 0.06 * s); ctx.stroke(); L([[-0.24, -0.12], [-0.24, -0.4], [0.24, -0.4], [0.24, -0.12]]); L([[-0.24, 0.12], [0.24, 0.12]]); break;
      case "kamera": ctx.beginPath(); ctx.arc(0, -0.04 * s, 0.3 * s, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -0.04 * s, 0.1 * s, 0, Math.PI * 2); ctx.fill(); L([[-0.24, 0.42], [0.24, 0.42]]); break;
      case "pdf": rr(ctx, -0.3 * s, -0.4 * s, 0.6 * s, 0.8 * s, 0.06 * s); ctx.stroke(); ctx.restore(); text(ctx, "PDF", cx, cy + s * 0.12, s * 0.3, { align: "center", weight: 900, color: c }); return;
      case "user": ctx.beginPath(); ctx.arc(0, -0.16 * s, 0.17 * s, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0.42 * s, 0.32 * s, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); break;
      case "gear": ctx.beginPath(); ctx.arc(0, 0, 0.2 * s, 0, Math.PI * 2); ctx.stroke(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; L([[0.26 * Math.cos(a), 0.26 * Math.sin(a)], [0.4 * Math.cos(a), 0.4 * Math.sin(a)]]); } break;
      case "home": L([[-0.4, 0], [0, -0.36], [0.4, 0]]); L([[-0.28, -0.08], [-0.28, 0.36], [0.28, 0.36], [0.28, -0.08]]); break;
    }
    ctx.restore();
  };

  // ---------- teks berlipat dengan *tebal* ----------
  W.rich = function (ctx, s, x, y, size, maxW, opt = {}) {
    const weight = opt.weight || 500, bw = opt.boldWeight || 800, lh = size * (opt.lh || 1.35);
    const toks = []; String(s).split(/(\*[^*]+\*)/).forEach(part => { if (!part) return; const bold = part.startsWith("*") && part.endsWith("*") && part.length > 2;
      (bold ? part.slice(1, -1) : part).split(/(\s+)/).forEach(w => { if (w) toks.push({ w, bold }); }); });
    const lines = [[]]; let lw = 0;
    toks.forEach(t => { const tw = measure(ctx, t.w, size, t.bold ? bw : weight); const sp = /^\s+$/.test(t.w);
      if (!sp && lw + tw > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; }
      if (sp && lw === 0) return; lines[lines.length - 1].push({ ...t, tw }); lw += tw; });
    const max = opt.lines || 99; const shown = lines.slice(0, max);
    shown.forEach((ln, i) => { let px = x; const last = i === max - 1 && lines.length > max;
      ln.forEach((t, j) => { if (last && px + t.tw > x + maxW - 30) return; ctx.font = F(t.bold ? bw : weight, size); ctx.fillStyle = t.bold ? (opt.boldColor || opt.color || UI.ink) : (opt.color || UI.ink2);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.fillText(t.w, px, y + i * lh); px += t.tw; });
      if (last) text(ctx, "…", px, y + i * lh, size, { weight, color: opt.color || UI.ink2 }); });
    return shown.length * lh;
  };

  // sorotan kuning di bawah sebagian teks satu baris
  function markRange(ctx, s, x, y, size, weight, range) {
    if (!range) return; const a = measure(ctx, s.slice(0, range[0]), size, weight), b = measure(ctx, s.slice(0, range[1]), size, weight);
    if (b > a) { ctx.fillStyle = UI.mark; rr(ctx, x + a - 3, y - size * 0.95, b - a + 6, size * 1.3, 5); ctx.fill(); }
  }

  // ---------- jendela browser ----------
  W.browser = function (ctx, x, y, w, h, opt = {}) {
    const TAB = 50, BAR = 58;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.18)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
    ctx.fillStyle = opt.bg || "#FFFFFF"; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 16); ctx.clip();
    ctx.fillStyle = UI.chrome; ctx.fillRect(x, y, w, TAB);
    ["#E5675F", "#F2B134", "#4CB46A"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 26 + i * 24, y + TAB / 2, 7.5, 0, Math.PI * 2); ctx.fill(); });
    const tabs = (opt.tabs || ["Tab baru"]).map(t => typeof t === "string" ? { title: t } : t), on = opt.tab || 0;
    const tw = Math.min(300, (w - 180) / Math.max(1, tabs.length)); const tabRects = [];
    tabs.forEach((t, i) => { const tx = x + 108 + i * tw; tabRects.push({ x: tx, y: y + 8, w: tw - 6, h: TAB - 8, cx: tx + tw / 2, cy: y + TAB / 2 + 4 });
      if (i === on) { ctx.fillStyle = UI.tabOn; rr(ctx, tx, y + 8, tw - 6, TAB, 12); ctx.fill(); }
      else if (i !== on - 1) { ctx.fillStyle = "#C9D4DB"; ctx.fillRect(tx + tw - 7, y + 18, 2, TAB - 26); }
      W.icon(ctx, t.icon || "search", tx + 22, y + TAB / 2 + 4, 18, i === on ? UI.ink2 : UI.ink3);
      ctx.save(); ctx.beginPath(); ctx.rect(tx + 38, y, tw - 76, TAB); ctx.clip();
      text(ctx, t.title, tx + 40, y + TAB / 2 + 11, 19, { weight: i === on ? 700 : 600, color: i === on ? UI.ink : UI.ink2 }); ctx.restore();
      W.icon(ctx, "cross", tx + tw - 28, y + TAB / 2 + 4, 14, UI.ink3); });
    const nt = { x: x + 108 + tabs.length * tw + 6, y: y + 12, w: 32, h: 32 }; nt.cx = nt.x + 16; nt.cy = nt.y + 18;
    W.icon(ctx, "plus", nt.cx, nt.cy, 22, UI.ink2);
    // bilah alat
    const by = y + TAB; ctx.fillStyle = UI.tabOn; ctx.fillRect(x, by, w, BAR);
    const btn = (k, i, en) => { const cx = x + 32 + i * 46, cy = by + BAR / 2; W.icon(ctx, k, cx, cy, 24, en ? UI.ink2 : "#BFCAD1"); return { x: cx - 18, y: cy - 18, w: 36, h: 36, cx, cy }; };
    const back = btn("back", 0, opt.canBack !== false), fwd = btn("fwd", 1, !!opt.canFwd), reload = btn("reload", 2, true);
    const ux = x + 160, uw = w - 190, uy = by + 9, uh = BAR - 18;
    ctx.fillStyle = opt.urlFocus ? "#FFFFFF" : "#F1F4F6"; rr(ctx, ux, uy, uw, uh, uh / 2); ctx.fill();
    if (opt.urlFocus) { ctx.strokeStyle = UI.focus; ctx.lineWidth = 3; rr(ctx, ux, uy, uw, uh, uh / 2); ctx.stroke(); }
    const secure = opt.secure !== false; let tx0 = ux + 22;
    if (!opt.urlFocus || !opt.url) {
      if (secure) { W.icon(ctx, "lock", ux + 26, uy + uh / 2, 20, UI.ink2); tx0 = ux + 46; }
      else { W.icon(ctx, "warn", ux + 26, uy + uh / 2, 20, UI.bad); text(ctx, "Tidak aman", ux + 44, uy + uh / 2 + 7, 19, { weight: 700, color: UI.bad }); tx0 = ux + 44 + measure(ctx, "Tidak aman", 19, 700) + 14; }
    }
    const url = opt.url || ""; const us = 22;
    if (opt.urlSel && url) { ctx.fillStyle = "#BFD8F3"; ctx.fillRect(tx0 - 2, uy + 7, measure(ctx, url, us, 600) + 4, uh - 14); }
    markRange(ctx, url, tx0, uy + uh / 2 + 8, us, 600, opt.urlMark);
    ctx.save(); ctx.beginPath(); ctx.rect(tx0 - 4, uy, uw - (tx0 - ux) - 10, uh); ctx.clip();
    if (url) text(ctx, url, tx0, uy + uh / 2 + 8, us, { weight: 600, color: UI.ink });
    else if (opt.urlFocus) text(ctx, "Cari atau ketik alamat", tx0, uy + uh / 2 + 8, us, { weight: 500, color: UI.ink3 });
    if (opt.urlFocus && opt.caret) { const cw = url ? measure(ctx, url, us, 600) : 0; ctx.fillStyle = UI.ink; ctx.fillRect(tx0 + cw + 2, uy + 8, 2.5, uh - 16); }
    ctx.restore();
    if (opt.loading > 0 && opt.loading < 1) { ctx.fillStyle = UI.focus; ctx.fillRect(x, by + BAR - 3, w * opt.loading, 3); }
    ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, by + BAR); ctx.lineTo(x + w, by + BAR); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = UI.frame; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 16); ctx.stroke();
    const area = { x, y: by + BAR, w, h: y + h - by - BAR };
    if (opt.dim) { ctx.save(); rr(ctx, x, y, w, h, 16); ctx.clip(); ctx.fillStyle = `rgba(31,42,51,${0.3 * opt.dim})`; ctx.fillRect(x, y, w, h); ctx.restore(); }
    return { ...area, url: { x: ux, y: uy, w: uw, h: uh, cx: ux + uw / 2, cy: uy + uh / 2, tx: tx0 }, tab: i => tabRects[i], back, fwd, reload, newTab: nt };
  };

  // ---------- hasil pencarian ----------
  W.TIME_ITEMS = ["Kapan saja", "24 jam terakhir", "Seminggu terakhir", "Sebulan terakhir", "Setahun terakhir"];
  W.result = function (ctx, x, y, w, r, snipLines) {
    ctx.save(); ctx.globalAlpha *= r.alpha == null ? 1 : r.alpha;
    if (r.mark === "dim") ctx.globalAlpha *= 0.35;
    let hh = 0;
    const ts = 27; let tx = x;
    if (r.ad) { ctx.font = F(800, 17); const aw = ctx.measureText("Iklan").width + 16; ctx.strokeStyle = UI.ink; ctx.lineWidth = 1.5; rr(ctx, x, y + 2, aw, 24, 5); ctx.stroke(); text(ctx, "Iklan", x + 8, y + 20, 17, { weight: 800, color: UI.ink }); tx = x + aw + 10; }
    if (r.type) { ctx.fillStyle = "#EEF2F5"; ctx.font = F(800, 16); const pw = ctx.measureText(r.type).width + 14; rr(ctx, tx, y + 3, pw, 22, 5); ctx.fill(); text(ctx, r.type, tx + 7, y + 20, 16, { weight: 800, color: UI.ink2 }); tx += pw + 10; }
    ctx.save(); ctx.beginPath(); ctx.rect(x, y - 6, w, 40); ctx.clip();
    let tt = r.title; if (measure(ctx, tt, ts, 700) > w - (tx - x)) { while (tt.length > 4 && measure(ctx, tt + "…", ts, 700) > w - (tx - x)) tt = tt.slice(0, -1); tt = tt.trimEnd() + "…"; }
    text(ctx, tt, tx, y + 23, ts, { weight: 700, color: UI.link }); ctx.restore();
    hh += 35;
    text(ctx, r.url, x, y + hh + 19, 20, { weight: 600, color: UI.url }); hh += 30;
    if (r.snippet) hh += W.rich(ctx, r.snippet, x, y + hh + 19, 21, w, { lines: snipLines || 2, lh: 1.38, color: UI.ink2, boldColor: UI.ink });
    ctx.restore();
    if (r.strike) { ctx.strokeStyle = UI.bad; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 6, y + 18); ctx.lineTo(x + Math.min(w, measure(ctx, r.title, ts, 700) + (tx - x)) + 6, y + 18); ctx.stroke(); }
    if (r.mark === "good" || r.mark === "bad") { const c = r.mark === "good" ? UI.good : UI.bad; ctx.fillStyle = c; ctx.fillRect(x - 22, y, 6, hh + 8); }
    return hh + 22;
  };
  // tanggal sebagai bagian cuplikan: "12 Mar 2026 — teks…" (tanggal abu-abu tebal)
  function withDate(r) { return r.date ? { ...r, snippet: `${r.date} — ${r.snippet || ""}` } : r; }

  W.searchPage = function (ctx, area, st = {}) {
    const x = area.x, y = area.y, w = area.w; const name = st.engine || "Cari";
    return W.clip(ctx, area, () => {
      const geo = {};
      if (st.home) { // halaman awal: nama + kotak di tengah
        const cy = y + area.h * 0.38; text(ctx, name, x + w / 2, cy - 60, 64, { align: "center", weight: 900, color: UI.ink });
        const bw = Math.min(760, w - 160), bx = x + (w - bw) / 2; geo.box = box(ctx, bx, cy - 10, bw, 60, st); geo.btn = { cx: bx + bw - 30, cy: cy + 20 }; return geo;
      }
      // kepala: nama mesin + kotak pencarian
      const hy = y + 18; text(ctx, name, x + 36, hy + 39, 36, { weight: 900, color: UI.ink });
      const bx = x + 150, bw = Math.min(820, w - 200); geo.box = box(ctx, bx, hy, bw, 54, st); geo.btn = { cx: bx + bw - 30, cy: hy + 27, x: bx + bw - 56, y: hy, w: 56, h: 54 };
      // tab + Alat
      const ty = hy + 88; let px = bx + 6; geo.tabsY = ty;
      ["Semua", "Gambar", "Berita", "Video"].forEach((t, i) => { const on = (st.tab || 0) === i; text(ctx, t, px, ty, 20, { weight: on ? 800 : 600, color: on ? UI.focus : UI.ink2 });
        const tw = measure(ctx, t, 20, on ? 800 : 600); if (on) { ctx.fillStyle = UI.focus; ctx.fillRect(px, ty + 10, tw, 3); } px += tw + 34; });
      const toolsX = px + 20; text(ctx, "Alat", toolsX, ty, 20, { weight: st.tools ? 800 : 600, color: st.tools ? UI.ink : UI.ink2 });
      geo.tools = { x: toolsX - 10, y: ty - 26, w: 64, h: 38, cx: toolsX + 20, cy: ty - 7 };
      ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, ty + 14); ctx.lineTo(x + w, ty + 14); ctx.stroke();
      let ry = ty + 42;
      if (st.tools) { // bilah alat: pilihan waktu
        const tl = "Waktu: " + (st.time || "Kapan saja"); const tw = measure(ctx, tl, 20, 700) + 48; const on = (st.time || "Kapan saja") !== "Kapan saja";
        ctx.fillStyle = on ? UI.focusBg : "#F1F4F6"; rr(ctx, bx, ty + 24, tw, 38, 19); ctx.fill(); if (on) { ctx.strokeStyle = UI.focus; ctx.lineWidth = 2; rr(ctx, bx, ty + 24, tw, 38, 19); ctx.stroke(); }
        text(ctx, tl, bx + 16, ty + 50, 20, { weight: 700, color: on ? UI.focus : UI.ink }); W.icon(ctx, "caret", bx + tw - 20, ty + 44, 18, on ? UI.focus : UI.ink2);
        geo.timeBtn = { x: bx, y: ty + 24, w: tw, h: 38, cx: bx + tw / 2, cy: ty + 43 };
        ry += 50;
      }
      // jumlah hasil
      if (st.count) { if (st.countMark) { ctx.fillStyle = UI.mark; rr(ctx, bx - 6, ry - 24, measure(ctx, st.count, 19, 600) + 12, 32, 6); ctx.fill(); }
        text(ctx, st.count, bx, ry, 19, { weight: 600, color: UI.ink2 }); geo.count = { x: bx, y: ry - 20, cx: bx + measure(ctx, st.count, 19, 600) / 2, cy: ry - 6 }; }
      ry += 20 - (st.scroll || 0);
      const rs = st.results || []; const rw = Math.min(860, w - bx + x - 60); const rects = [];
      if (!rs.length && st.empty) { text(ctx, st.empty, bx, ry + 40, 24, { weight: 700, color: UI.ink }); text(ctx, "Coba kata kunci lain atau kurangi operatornya.", bx, ry + 80, 20, { weight: 500, color: UI.ink2 }); }
      rs.forEach(r => { const h = W.result(ctx, bx, ry + 12, rw, withDate(r), st.snipLines); rects.push({ x: bx, y: ry + 12, w: rw, h, cx: bx + 120, cy: ry + 30 }); ry += h; });
      geo.result = i => rects[i]; geo.bottom = ry;
      // menu waktu (di atas segalanya)
      if (st.tools && st.timeOpen && geo.timeBtn) { const mx = bx, my = geo.timeBtn.y + 46, mw = 300, ih = 46;
        ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.2)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, mx, my, mw, W.TIME_ITEMS.length * ih + 16, 10); ctx.fill(); ctx.restore();
        ctx.strokeStyle = UI.frame; ctx.lineWidth = 1.5; rr(ctx, mx, my, mw, W.TIME_ITEMS.length * ih + 16, 10); ctx.stroke();
        const items = []; W.TIME_ITEMS.forEach((t, i) => { const iy = my + 8 + i * ih; const hi = st.timeHi === i, sel = (st.time || "Kapan saja") === t;
          if (hi) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(mx + 4, iy, mw - 8, ih); }
          if (sel) W.icon(ctx, "check", mx + 26, iy + ih / 2, 20, UI.focus);
          text(ctx, t, mx + 48, iy + ih / 2 + 7, 20, { weight: hi || sel ? 700 : 600, color: hi ? UI.focus : UI.ink }); items.push({ x: mx, y: iy, w: mw, h: ih, cx: mx + 140, cy: iy + ih / 2 }); });
        geo.timeItem = i => items[i]; }
      return geo;
    });
  };
  // kotak pencarian dengan sorotan bagian query
  function box(ctx, bx, by, bw, bh, st) {
    ctx.fillStyle = "#FFFFFF"; rr(ctx, bx, by, bw, bh, bh / 2); ctx.fill();
    ctx.strokeStyle = st.focus ? UI.focus : UI.frame; ctx.lineWidth = st.focus ? 3 : 2; rr(ctx, bx, by, bw, bh, bh / 2); ctx.stroke();
    const q = st.query || "", size = 24, tx = bx + 26, ty = by + bh / 2 + 9;
    ctx.save(); ctx.beginPath(); ctx.rect(bx + 12, by, bw - 76, bh); ctx.clip();
    markRange(ctx, q, tx, ty, size, 600, st.mark);
    if (q) text(ctx, q, tx, ty, size, { weight: 600, color: UI.ink }); else if (!st.focus) text(ctx, "Ketik kata kunci", tx, ty, size, { weight: 500, color: UI.ink3 });
    if (st.focus && st.caret) { const cw = measure(ctx, st.caretAt == null ? q : q.slice(0, st.caretAt), size, 600); ctx.fillStyle = UI.ink; ctx.fillRect(tx + cw + (st.caretAt === 0 ? -3 : 2), by + 12, 2.5, bh - 24); }
    ctx.restore();
    ctx.fillStyle = UI.line; ctx.fillRect(bx + bw - 62, by + 12, 2, bh - 24);
    W.icon(ctx, "search", bx + bw - 30, by + bh / 2, 26, UI.focus);
    return { x: bx, y: by, w: bw, h: bh, cx: bx + bw / 2, cy: by + bh / 2, tx, ty, end: tx + measure(ctx, q, size, 600), at: i => tx + measure(ctx, q.slice(0, i), size, 600) };
  }

  // ---------- halaman web generik ----------
  W.page = function (ctx, area, st = {}) {
    return W.clip(ctx, area, () => {
      const x = area.x, y = area.y, w = area.w, size = st.size || 22; const geo = {};
      ctx.fillStyle = st.head || "#3D5361"; ctx.fillRect(x, y, w, 64); geo.head = { x, y, w, h: 64 };
      text(ctx, st.site || "situs.example", x + 36, y + 42, 26, { weight: 900, color: "#FFFFFF" });
      let nx = x + w - 36; (st.nav || []).slice().reverse().forEach(n => { const nw = measure(ctx, n, 19, 700); nx -= nw; text(ctx, n, nx, y + 40, 19, { weight: 700, color: "#E3EBF0" }); nx -= 28; });
      let cy = y + 116; const cx = x + 60, cw = Math.min(w - 120, 980);
      if (st.title) { ctx.font = F(900, 36); const lines = H.wrap(ctx, st.title, 36, 900, cw); lines.forEach((ln, i) => text(ctx, ln, cx, cy + i * 44, 36, { weight: 900, color: UI.ink })); geo.title = { x: cx, y: cy - 36, w: cw, h: lines.length * 44 }; cy += lines.length * 44 + 4; }
      if (st.meta) { text(ctx, st.meta, cx, cy + 6, 19, { weight: 600, color: UI.ink3 }); cy += 40; }
      if (st.img) { const ih = st.img.h || 180; ctx.fillStyle = "#E3EBF0"; rr(ctx, cx, cy, cw, ih, 12); ctx.fill();
        ctx.fillStyle = "#C9D6DE"; ctx.beginPath(); ctx.moveTo(cx + 40, cy + ih - 20); ctx.lineTo(cx + 200, cy + 50); ctx.lineTo(cx + 330, cy + ih - 20); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + cw - 90, cy + 60, 30, 0, Math.PI * 2); ctx.fill();
        if (st.img.label) text(ctx, st.img.label, cx + cw / 2, cy + ih / 2 + 8, 22, { align: "center", weight: 700, color: UI.ink2 }); cy += ih + 24; }
      geo.body = { x: cx, y: cy, w: cw };
      if (Array.isArray(st.body)) st.body.forEach(p => { cy += W.rich(ctx, p, cx, cy + size, size, cw, { lh: 1.45, color: UI.ink2, boldColor: UI.ink }) + size * 0.6; });
      else for (let i = 0; i < (st.body || 6); i++) { ctx.fillStyle = "#DCE3E8"; rr(ctx, cx, cy + i * 30, cw * (i % 4 === 3 ? 0.55 : 0.92 - (i % 3) * 0.06), 12, 6); ctx.fill(); }
      geo.bottom = cy; return geo;
    });
  };

  // ---------- formulir ----------
  W.field = function (ctx, x, y, w, opt = {}) {
    const h = opt.h || 56, size = opt.size || 24; let fy = y;
    if (opt.label) { text(ctx, opt.label, x, y + 20, 20, { weight: 700, color: UI.ink2 }); fy = y + 32; }
    ctx.fillStyle = opt.disabled ? "#F1F4F6" : UI.field; rr(ctx, x, fy, w, h, 10); ctx.fill();
    const stroke = opt.error ? UI.bad : opt.ok ? UI.good : opt.focus ? UI.focus : UI.frame;
    ctx.strokeStyle = stroke; ctx.lineWidth = opt.focus || opt.error || opt.ok ? 3 : 2; rr(ctx, x, fy, w, h, 10); ctx.stroke();
    const v = opt.value || ""; const hide = opt.password && !opt.show; const shown = hide ? "•".repeat(v.length) : v;
    const tx = x + 18, ty = fy + h / 2 + size * 0.36;
    ctx.save(); ctx.beginPath(); ctx.rect(x + 8, fy, w - (opt.password ? 60 : 16), h); ctx.clip();
    if (!hide) markRange(ctx, shown, tx, ty, size, 600, opt.mark);
    if (v) text(ctx, shown, tx, ty, hide ? size + 4 : size, { weight: 600, color: opt.disabled ? UI.ink3 : UI.ink });
    else if (opt.placeholder) text(ctx, opt.placeholder, tx, ty, size, { weight: 500, color: UI.ink3 });
    const cw = v ? measure(ctx, shown, hide ? size + 4 : size, 600) : 0;
    if (opt.focus && opt.caret) { ctx.fillStyle = UI.ink; ctx.fillRect(tx + cw + 2, fy + 12, 2.5, h - 24); }
    ctx.restore();
    if (opt.password) W.icon(ctx, opt.show ? "eye" : "eyeOff", x + w - 30, fy + h / 2, 24, UI.ink2);
    let by = fy + h;
    if (opt.error) { W.icon(ctx, "warn", x + 12, by + 22, 18, UI.bad); text(ctx, opt.error, x + 30, by + 29, 19, { weight: 700, color: UI.bad }); by += 36; }
    else if (opt.hint) { text(ctx, opt.hint, x, by + 28, 18, { weight: 500, color: UI.ink3 }); by += 34; }
    return { x, y: fy, w, h, cx: x + w / 2, cy: fy + h / 2, end: tx + cw, bottom: by, eye: { cx: x + w - 30, cy: fy + h / 2 } };
  };
  W.button = function (ctx, x, y, w, h, label, opt = {}) {
    const kind = opt.kind || "primary", size = opt.size || 22;
    const pal = { primary: [UI.focus, "#FFFFFF", null], secondary: ["#FFFFFF", UI.ink, UI.frame], danger: [UI.bad, "#FFFFFF", null], good: [UI.good, "#FFFFFF", null] }[kind];
    const p = opt.press > 0 && opt.press < 1 ? Math.sin(opt.press * Math.PI) : 0;
    ctx.save(); if (opt.disabled) ctx.globalAlpha *= 0.45;
    ctx.fillStyle = pal[0]; rr(ctx, x, y + p * 2, w, h, 10); ctx.fill(); if (p) { ctx.fillStyle = "rgba(0,0,0,0.12)"; rr(ctx, x, y + p * 2, w, h, 10); ctx.fill(); }
    if (pal[2]) { ctx.strokeStyle = pal[2]; ctx.lineWidth = 2; rr(ctx, x, y + p * 2, w, h, 10); ctx.stroke(); }
    text(ctx, label, x + w / 2, y + p * 2 + h / 2 + size * 0.36, size, { align: "center", weight: 800, color: pal[1], fit: w - 16 });
    ctx.restore();
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  };
  function choice(ctx, x, y, label, on, opt, round) {
    const s = opt.size || 24; const u = typeof on === "number" ? on : on ? 1 : 0;
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = u > 0.5 ? UI.focus : "#8A99A3"; ctx.lineWidth = 2.5;
    if (round) { ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); if (u > 0) { ctx.fillStyle = UI.focus; ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s * 0.26 * u, 0, Math.PI * 2); ctx.fill(); } }
    else { if (u > 0.5) ctx.fillStyle = UI.focus; rr(ctx, x, y, s, s, 5); ctx.fill(); ctx.stroke(); if (u > 0.5) W.icon(ctx, "check", x + s / 2, y + s / 2, s * 0.9, "#FFFFFF"); }
    if (opt.focus) { ctx.strokeStyle = "rgba(26,115,200,0.35)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s * 0.85, 0, Math.PI * 2); ctx.stroke(); }
    let lh = s; if (label) { const lines = opt.maxW ? H.wrap(ctx, label, s * 0.9, 600, opt.maxW) : [label]; lines.forEach((ln, i) => text(ctx, ln, x + s + 14, y + s * 0.8 + i * s * 1.15, s * 0.9, { weight: 600, color: UI.ink })); lh = Math.max(s, lines.length * s * 1.15); }
    return { x, y, w: s + 14 + (label ? measure(ctx, label, s * 0.9, 600) : 0), h: lh, cx: x + s / 2, cy: y + s / 2 };
  }
  W.checkbox = (ctx, x, y, label, on, opt = {}) => choice(ctx, x, y, label, on, opt, false);
  W.radio = (ctx, x, y, label, on, opt = {}) => choice(ctx, x, y, label, on, opt, true);
  W.toggle = function (ctx, x, y, on, opt = {}) {
    const u = typeof on === "number" ? clamp(on, 0, 1) : on ? 1 : 0, w = 64, h = 34;
    ctx.fillStyle = u > 0.5 ? UI.good : "#B7C4CC"; rr(ctx, x, y, w, h, h / 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x + h / 2 + (w - h) * u, y + h / 2, h / 2 - 4, 0, Math.PI * 2); ctx.fill();
    if (opt.label) text(ctx, opt.label, x + w + 14, y + h / 2 + 8, 22, { weight: 700, color: u > 0.5 ? UI.good : UI.ink2 });
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  };
  W.select = function (ctx, x, y, w, value, opt = {}) {
    const h = opt.h || 54, size = opt.size || 22; let fy = y;
    if (opt.label) { text(ctx, opt.label, x, y + 20, 20, { weight: 700, color: UI.ink2 }); fy = y + 32; }
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, fy, w, h, 10); ctx.fill(); ctx.strokeStyle = opt.open || opt.focus ? UI.focus : opt.bad ? UI.bad : UI.frame; ctx.lineWidth = opt.open || opt.focus || opt.bad ? 3 : 2; rr(ctx, x, fy, w, h, 10); ctx.stroke();
    text(ctx, value || "", x + 18, fy + h / 2 + size * 0.36, size, { weight: 700, color: opt.bad ? UI.bad : UI.ink, fit: w - 70 });
    W.icon(ctx, "caret", x + w - 28, fy + h / 2 + 2, 20, UI.ink2);
    const items = [];
    if (opt.open && opt.items) { const ih = 50, my = fy + h + 6, mh = opt.items.length * ih + 12;
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, my, w, mh, 10); ctx.fill(); ctx.restore();
      ctx.strokeStyle = UI.frame; ctx.lineWidth = 1.5; rr(ctx, x, my, w, mh, 10); ctx.stroke();
      opt.items.forEach((it, i) => { const iy = my + 6 + i * ih; const hi = opt.hi === i, warn = (opt.warn || []).includes(i);
        if (hi) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(x + 4, iy, w - 8, ih); }
        if (opt.sel === i) W.icon(ctx, "check", x + 24, iy + ih / 2, 20, UI.focus);
        text(ctx, it, x + 46, iy + ih / 2 + size * 0.36, size, { weight: hi ? 800 : 600, color: warn ? UI.bad : hi ? UI.focus : UI.ink, fit: w - 60 });
        items.push({ x, y: iy, w, h: ih, cx: x + Math.min(w / 2, 200), cy: iy + ih / 2 }); }); }
    return { x, y: fy, w, h, cx: x + w / 2, cy: fy + h / 2, item: i => items[i] };
  };
  W.banner = function (ctx, x, y, w, msg, kind = "info") {
    const pal = { info: [UI.infoBg, UI.focus, "check"], warn: [UI.warnBg, UI.warn, "warn"], bad: [UI.badBg, UI.bad, "warn"], good: [UI.goodBg, UI.good, "check"] }[kind];
    ctx.font = F(700, 21); const lines = H.wrap(ctx, msg, 21, 700, w - 76); const h = lines.length * 28 + 26;
    ctx.fillStyle = pal[0]; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.fillStyle = pal[1]; rr(ctx, x, y, 6, h, 3); ctx.fill();
    W.icon(ctx, pal[2], x + 32, y + h / 2, 24, pal[1]);
    lines.forEach((ln, i) => text(ctx, ln, x + 58, y + 34 + i * 28, 21, { weight: 700, color: UI.ink }));
    return h;
  };
  W.METER = ["Sangat lemah", "Lemah", "Sedang", "Kuat", "Sangat kuat"];
  W.meter = function (ctx, x, y, w, level) {
    const lv = clamp(Math.round(level), 0, 4), cols = [UI.bad, UI.bad, "#E0A21B", UI.good, UI.good], seg = (w - 4 * 8) / 5;
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i <= lv ? cols[lv] : "#DDE5EA"; rr(ctx, x + i * (seg + 8), y, seg, 10, 5); ctx.fill(); }
    text(ctx, "Kekuatan sandi: " + W.METER[lv], x, y + 38, 19, { weight: 800, color: cols[lv] });
  };
  W.progress = function (ctx, x, y, w, u, opt = {}) {
    if (opt.label) text(ctx, opt.label, x, y - 12, 20, { weight: 700, color: UI.ink2 });
    ctx.fillStyle = "#DDE5EA"; rr(ctx, x, y, w, 14, 7); ctx.fill(); ctx.fillStyle = opt.color || UI.focus; rr(ctx, x, y, Math.max(14, w * clamp(u, 0, 1)), 14, 7); ctx.fill();
  };

  // ---------- router ----------
  W.ROUTER_MENU = ["Status", "Wi-Fi", "Keamanan", "Jaringan Tamu", "Sistem"];
  const MENU_ICON = { "Status": "home", "Wi-Fi": "wifi", "Keamanan": "lock", "Jaringan Tamu": "user", "Sistem": "gear" };
  W.routerLogin = function (ctx, area, st = {}) {
    return W.clip(ctx, area, () => {
      ctx.fillStyle = "#EEF2F5"; ctx.fillRect(area.x, area.y, area.w, area.h);
      const cw = 520, ch = 420, cx = area.x + (area.w - cw) / 2, cy = area.y + (area.h - ch) / 2;
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.14)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, cx, cy, cw, ch, 16); ctx.fill(); ctx.restore();
      W.icon(ctx, "wifi", cx + 50, cy + 52, 40, UI.side); text(ctx, st.name || "Router", cx + 84, cy + 62, 30, { weight: 900, color: UI.ink });
      text(ctx, "Masuk ke halaman admin", cx + 40, cy + 108, 21, { weight: 600, color: UI.ink2 });
      const user = W.field(ctx, cx + 40, cy + 124, cw - 80, { label: "Nama pengguna", value: st.user, focus: st.focus === "user", caret: st.caret, h: 52 });
      const pass = W.field(ctx, cx + 40, cy + 214, cw - 80, { label: "Sandi", value: st.pass, password: true, focus: st.focus === "pass", caret: st.caret, h: 52, error: st.error });
      const btn = W.button(ctx, cx + 40, cy + ch - 84, cw - 80, 54, "Masuk", { press: st.press });
      return { user, pass, btn };
    });
  };
  W.routerAdmin = function (ctx, area, st = {}) {
    return W.clip(ctx, area, () => {
      const x = area.x, y = area.y, sw = 270, act = st.active || "Status";
      ctx.fillStyle = "#F4F7F9"; ctx.fillRect(x, y, area.w, area.h);
      ctx.fillStyle = UI.side; ctx.fillRect(x, y, sw, area.h);
      W.icon(ctx, "wifi", x + 40, y + 42, 32, "#FFFFFF"); text(ctx, st.name || "Router", x + 66, y + 50, 26, { weight: 900, color: "#FFFFFF" });
      const items = {};
      W.ROUTER_MENU.forEach((m, i) => { const iy = y + 92 + i * 62, on = m === act;
        if (on) { ctx.fillStyle = UI.sideOn; ctx.fillRect(x, iy, sw, 56); ctx.fillStyle = "#F2B134"; ctx.fillRect(x, iy, 6, 56); }
        W.icon(ctx, MENU_ICON[m], x + 40, iy + 28, 24, on ? "#FFFFFF" : UI.sideInk);
        text(ctx, m, x + 70, iy + 36, 22, { weight: on ? 800 : 600, color: on ? "#FFFFFF" : UI.sideInk }); items[m] = { x, y: iy, w: sw, h: 56, cx: x + 130, cy: iy + 28 }; });
      // kepala isi
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + sw, y, area.w - sw, 64); ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + sw, y + 64); ctx.lineTo(x + area.w, y + 64); ctx.stroke();
      text(ctx, act, x + sw + 36, y + 43, 28, { weight: 900, color: UI.ink });
      const uw = measure(ctx, "Keluar", 20, 700); text(ctx, "Keluar", x + area.w - 30 - uw, y + 41, 20, { weight: 700, color: UI.focus });
      W.icon(ctx, "user", x + area.w - 60 - uw, y + 34, 24, UI.ink2); text(ctx, st.user || "admin", x + area.w - 76 - uw, y + 41, 20, { align: "right", weight: 600, color: UI.ink2 });
      let cy = y + 84;
      if (st.warn) cy += W.banner(ctx, x + sw + 30, cy, area.w - sw - 60, st.warn, st.warnKind || "warn") + 16;
      return { menu: m => items[m], content: { x: x + sw + 36, y: cy, w: area.w - sw - 72, h: y + area.h - cy }, logout: { cx: x + area.w - 30 - uw / 2, cy: y + 34 } };
    });
  };
  W.row = function (ctx, c, y, label, opt = {}) {
    const lw = opt.lw || 300; text(ctx, label, c.x, y + (opt.dy || 36), 22, { weight: 700, color: UI.ink });
    if (opt.sub) text(ctx, opt.sub, c.x, y + (opt.dy || 36) + 26, 17, { weight: 500, color: UI.ink3 });
    if (opt.line !== false) { ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(c.x, y + (opt.h || 76)); ctx.lineTo(c.x + c.w, y + (opt.h || 76)); ctx.stroke(); }
    return c.x + lw;
  };
  W.devices = function (ctx, x, y, w, list, opt = {}) {
    const rh = opt.rh || 58;
    text(ctx, "Perangkat", x + 64, y + 22, 18, { weight: 800, color: UI.ink3 }); text(ctx, "Alamat IP", x + w * 0.52, y + 22, 18, { weight: 800, color: UI.ink3 }); text(ctx, "Status", x + w - 20, y + 22, 18, { align: "right", weight: 800, color: UI.ink3 });
    list.forEach((d, i) => { const ry = y + 36 + i * rh; ctx.save(); ctx.globalAlpha *= d.alpha == null ? 1 : d.alpha;
      if (d.hi) { ctx.fillStyle = d.hi === "bad" ? UI.badBg : UI.goodBg; rr(ctx, x, ry + 4, w, rh - 8, 10); ctx.fill(); }
      W.icon(ctx, d.kind || "hp", x + 32, ry + rh / 2, 30, UI.ink2);
      text(ctx, d.name, x + 64, ry + rh / 2 + 8, 22, { weight: 700, color: UI.ink, fit: w * 0.5 - 70 });
      text(ctx, d.ip || "—", x + w * 0.52, ry + rh / 2 + 8, 21, { weight: 600, color: UI.ink2 });
      const on = d.on !== false, st = on ? (d.net || "Tersambung") : (d.net || "Terputus"); ctx.fillStyle = on ? UI.good : "#B7C4CC"; ctx.beginPath(); ctx.arc(x + w - 36 - measure(ctx, st, 20, 700), ry + rh / 2, 7, 0, Math.PI * 2); ctx.fill();
      text(ctx, st, x + w - 20, ry + rh / 2 + 8, 20, { align: "right", weight: 700, color: on ? UI.good : UI.ink3 });
      ctx.strokeStyle = UI.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, ry + rh); ctx.lineTo(x + w, ry + rh); ctx.stroke(); ctx.restore(); });
    return 36 + list.length * rh;
  };
  W.routerBox = function (ctx, cx, cy, s, opt = {}) {
    const w = s * 2.2, h = s * 0.62;
    ctx.save();
    if (!opt.flip) { ctx.strokeStyle = "#3B4A54"; ctx.lineWidth = s * 0.07; ctx.lineCap = "round";
      [[-0.75, -0.25], [0.75, 0.25]].forEach(([dx, tilt]) => { ctx.beginPath(); ctx.moveTo(cx + dx * s, cy - h / 2); ctx.lineTo(cx + dx * s + tilt * s, cy - h / 2 - s * 0.85); ctx.stroke(); }); }
    ctx.fillStyle = opt.flip ? "#D5DDE2" : "#F4F6F7"; rr(ctx, cx - w / 2, cy - h / 2, w, h, s * 0.12); ctx.fill(); ctx.strokeStyle = "#9AA8B1"; ctx.lineWidth = 3; rr(ctx, cx - w / 2, cy - h / 2, w, h, s * 0.12); ctx.stroke();
    if (!opt.flip) { const lamps = opt.lamps || [true, true, true, true]; const labels = ["Daya", "Internet", "Wi-Fi", "LAN"];
      lamps.forEach((on, i) => { const lx = cx - w / 2 + s * 0.4 + i * (w - s * 0.8) / (lamps.length - 1), ly = cy - h * 0.08;
        const blink = opt.blink != null && i === 2 ? (Math.floor(opt.blink * 4) % 2 === 0) : true;
        ctx.fillStyle = on && blink ? "#3CCB6B" : "#B7C4CC"; ctx.beginPath(); ctx.arc(lx, ly, s * 0.07, 0, Math.PI * 2); ctx.fill();
        if (opt.labels !== false) text(ctx, labels[i] || "", lx, ly + s * 0.25, Math.max(14, s * 0.13), { align: "center", weight: 700, color: UI.ink2 }); }); }
    else { for (let i = 0; i < 6; i++) { ctx.fillStyle = "#B9C5CC"; rr(ctx, cx - w / 2 + s * 0.15, cy - h / 2 + s * 0.08 + i * s * 0.08, s * 0.35, s * 0.03, 2); ctx.fill(); } }
    ctx.restore();
    return { w, h };
  };
  W.sticker = function (ctx, x, y, w, rows, opt = {}) {
    const size = opt.size || 24, rh = size * 1.75, top = opt.title ? size * 2.1 : size * 0.7, h = top + rows.length * rh + size * 0.5;
    ctx.fillStyle = "#FFFDF4"; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.strokeStyle = "#C9B98A"; ctx.lineWidth = 2.5; rr(ctx, x, y, w, h, 10); ctx.stroke();
    if (opt.title) { text(ctx, opt.title, x + 20, y + size * 1.45, size * 0.85, { weight: 900, color: UI.ink2 }); ctx.strokeStyle = "#E3D9B5"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 14, y + top - size * 0.2); ctx.lineTo(x + w - 14, y + top - size * 0.2); ctx.stroke(); }
    rows.forEach(([k, v], i) => { const ry = y + top + i * rh; const hi = opt.hi === i || (Array.isArray(opt.hi) && opt.hi.includes(i));
      if (hi) { ctx.fillStyle = UI.mark; rr(ctx, x + 8, ry + 2, w - 16, rh - 4, 6); ctx.fill(); }
      text(ctx, k, x + 20, ry + rh * 0.66, size * 0.8, { weight: 700, color: UI.ink2 }); text(ctx, v, x + (opt.kw || w * 0.42), ry + rh * 0.66, size, { weight: 800, color: UI.ink, fit: w - (opt.kw || w * 0.42) - 16 }); });
    return h;
  };

  K.web = W;
})(typeof window !== "undefined" ? window : globalThis);
