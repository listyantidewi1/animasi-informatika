/* S19 Simulasi praktik: berbagi halaman lewat server web kecil Python (python -m http.server) di laptop Windows.
   Tata letak tunggal: jendela Terminal/Browser di kiri (x 110–1410, y 122–822) + panel kanan (x 1450–1820).
   Tata letak ganda: laptop Dito (Terminal, x 110–870) dan laptop Sinta (Browser, x 900–1820), y 142–822, label di atasnya.
   Keluaran Terminal meniru format asli cmd dan http.server (diuji dengan python3 -m http.server). Semua nama, alamat IP
   (192.168.1.x), dan data rekaan. Muat setelah kiko-core.js, layar.js, layar_kode.js, layar_web.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, LK = K.layarKode, W = K.web;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const LEFT = { x: 110, y: 142, w: 760, h: 680 }, RIGHT = { x: 900, y: 142, w: 920, h: 680 };
  const GREEN = C.good, RED = "#D9443B", BLUE = "#1A73C8", AMBER = C.accentDark;
  const SZ = 26, SZ2 = 16;
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const ph = LK.phase;
  const blinkAt = l => Math.floor(l * 2.2) % 2 === 0;
  const stepAt = (f, marks) => { let n = 0; marks.forEach((m, i) => { if (f >= m) n = i + 1; }); return n; };

  // ---------- isi Terminal (format Windows cmd + http.server) ----------
  const P0 = "C:\\Users\\siswa>", PD = "C:\\Users\\siswa\\Desktop\\halaman-kelas>", PDOC = "C:\\Users\\siswa\\Documents>";
  const CD = "cd Desktop\\halaman-kelas", SRV = "python -m http.server 8000", SRV1 = "python -m http.server 8001";
  const cmd = (t, p) => ({ k: "cmd", t, prompt: p });
  const DIR = [" Volume in drive C has no label.", " Directory of C:\\Users\\siswa\\Desktop\\halaman-kelas", "",
    "04/11/2026  09:10    <DIR>          .", "04/11/2026  09:10    <DIR>          ..",
    "04/11/2026  09:08             1.284 index.html", "               1 File(s)          1.284 bytes", ""];
  const SERV = "Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...";
  const SERV1 = "Serving HTTP on 0.0.0.0 port 8001 (http://0.0.0.0:8001/) ...";
  const LOG = (ip, tm) => [`${ip} - - [04/Nov/2026 ${tm}] "GET / HTTP/1.1" 200 -`, `${ip} - - [04/Nov/2026 ${tm}] code 404, message File not found`,
    `${ip} - - [04/Nov/2026 ${tm}] "GET /favicon.ico HTTP/1.1" 404 -`];
  const LOGL = LOG("127.0.0.1", "09:15:02"), LOGS = LOG("192.168.1.31", "09:21:40");
  let listRows = [];
  const IPC = ["", "Windows IP Configuration", "", "Wireless LAN adapter Wi-Fi:", "",
    "   IPv4 Address. . . . . . . . . . . : 192.168.1.23", "   Subnet Mask . . . . . . . . . . . : 255.255.255.0",
    "   Default Gateway . . . . . . . . . : 192.168.1.1", ""];
  const STOP = ["", "Keyboard interrupt received, exiting."];
  const ERRPORT = [{ k: "err", t: "Traceback (most recent call last):" }, { k: "err", t: "  ..." },
    { k: "err", t: "OSError: [WinError 10048] Only one usage of each socket address" }, { k: "err", t: "(protocol/network address/port) is normally permitted" }, ""];
  const HIST_SRV = [cmd(SRV, PD), SERV];          // riwayat setelah server menyala
  const LIST_DOC = ["halaman-kelas/", "foto-keluarga.jpg", "nilai-rapor.xlsx", "tugas-sejarah.docx", "catatan-pribadi.txt"];

  // Terminal dengan sesi: perintah diketik pada fraksi [t0, t1], Enter, keluaran muncul baris demi baris [t1, t2].
  // seq: [{c, p (prompt), np (prompt sesudahnya), out, t0, t1, t2, hold (server: tidak kembali ke prompt)}]
  function sesi(f, seq, before = [], p0 = P0) {
    const rows = before.slice(); let prompt = p0, enter = 0;
    for (const s of seq) {
      const p = s.p || prompt;
      if (f < s.t0) return { rows, typing: { t: s.c, u: 0, prompt: p }, enter, prompt: p };
      if (f < s.t1) { enter = clamp((f - (s.t1 - 0.03)) / 0.06, 0, 1); return { rows, typing: { t: s.c, u: (f - s.t0) / Math.max(1e-6, (s.t1 - s.t0) * 0.85), prompt: p }, enter, prompt: p }; }
      rows.push(cmd(s.c, p)); const ue = (f - (s.t1 - 0.03)) / 0.06; if (ue < 1) enter = clamp(ue, 0, 1);
      const out = s.out || []; const n = s.t2 == null ? out.length : Math.floor(clamp((f - s.t1) / Math.max(1e-6, s.t2 - s.t1), 0, 1) * out.length + 0.999);
      out.slice(0, n).forEach(o => rows.push(o));
      if (n < out.length || s.hold) return { rows, typing: null, enter, busy: true, prompt: p };
      prompt = s.np || p;
    }
    return { rows, typing: null, enter, prompt };
  }
  // gambar Terminal; g.box(i, c0, c1) = kotak huruf c0..c1 pada baris ke-i (kolom dihitung dari awal baris, termasuk prompt)
  function term(ctx, st, l, win = WIN, opt = {}) {
    const size = opt.size || SZ;
    const g = LK.terminal(ctx, win.x, win.y, win.w, win.h, { title: opt.title || "Terminal (cmd)", prompt: st.prompt || P0, size,
      lines: st.rows, typing: st.typing, caret: !st.typing && !st.busy && !opt.noCaret, blink: blinkAt(l) });
    const nAll = st.rows.length + ((st.typing || (!st.busy && !opt.noCaret)) ? 1 : 0), maxRows = Math.floor((g.h - 24) / g.lh), first = Math.max(0, nAll - maxRows);
    g.first = first;
    g.box = (i, c0, c1) => { const vi = i - first; const top = g.y + 18 + vi * g.lh; return { x: g.x + 22 + c0 * g.cw - 4, y: top + 2, w: (c1 - c0) * g.cw + 8, h: g.lh - 2 }; };
    g.vis = i => i - first >= 0;
    g.str = i => { const r = st.rows[i]; if (r == null) return ""; return typeof r === "string" ? r : (r.k === "cmd" ? (r.prompt || "") + r.t : r.t); };
    g.find = (i, s) => { const t = g.str(i), a = t.indexOf(s); return a < 0 ? null : g.box(i, a, a + s.length); };
    return g;
  }
  function keys(ctx, k, u, x = 1250, y = 735) { if (u > 0 && u < 1) L.keys(ctx, x, y, k, { press: u, align: "center", size: 30 }); }
  function call(ctx, y, s, tx, ty, opt = {}) { return L.callout(ctx, opt.x || 1450, y, s, tx, ty, { size: 24, maxW: 320, ...opt }); }
  function tag(ctx, x, y, s, color) { ctx.font = `800 22px ${K.FONT}`; const w = ctx.measureText(s).width + 32; ctx.fillStyle = color; rr(ctx, x, y, w, 36, 18); ctx.fill(); text(ctx, s, x + 16, y + 26, 22, { weight: 800, color: "#FFFFFF" }); return w; }
  const tags = ctx => { tag(ctx, LEFT.x, 96, "Laptop Dito · server", C.kikoDark); tag(ctx, RIGHT.x, 96, "Laptop Sinta · klien", "#7A4FA8"); };

  // ---------- halaman web (index.html, daftar file, galat) ----------
  const PIKET = [["Senin", "Dito, Sinta"], ["Selasa", "Rina, Bayu"], ["Rabu", "Andi, Putri"], ["Kamis", "Joko, Lala"], ["Jumat", "Wati, Yoga"]];
  function jadwal(ctx, a, s = 1, u = 1) {
    ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); const x = a.x + 44 * s; let y = a.y + 66 * s;
    text(ctx, "Jadwal Piket Kelas XI-2", x, y, 40 * s, { weight: 900 });
    text(ctx, "Datang 15 menit sebelum bel. Jangan lupa menyapu kolong meja!", x, y + 44 * s, 21 * s, { weight: 600, color: C.ink2, fit: a.w - 88 * s });
    const tw = Math.min(a.w - 88 * s, 640 * s), rh = 50 * s, ty = y + 78 * s;
    ctx.fillStyle = "#2E7E9A"; ctx.fillRect(x, ty, tw, rh);
    text(ctx, "Hari", x + 20 * s, ty + rh * 0.66, 22 * s, { weight: 800, color: "#FFFFFF" }); text(ctx, "Petugas", x + tw * 0.36, ty + rh * 0.66, 22 * s, { weight: 800, color: "#FFFFFF" });
    PIKET.forEach(([d, n], i) => { const yy = ty + rh * (i + 1); ctx.fillStyle = i % 2 ? "#F1F6F8" : "#FFFFFF"; ctx.fillRect(x, yy, tw, rh);
      text(ctx, d, x + 20 * s, yy + rh * 0.66, 22 * s, { weight: 700 }); text(ctx, n, x + tw * 0.36, yy + rh * 0.66, 22 * s, { weight: 600 }); });
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1.5; ctx.strokeRect(x, ty, tw, rh * 6); ctx.restore();
    return { x, y: ty, w: tw, h: rh * 6 };
  }
  function listing(ctx, a, items, s = 1, opt = {}) {
    const x = a.x + 36 * s; let y = a.y + 62 * s;
    text(ctx, "Directory listing for /", x, y, 36 * s, { weight: 800 });
    ctx.fillStyle = "#9AA8B1"; ctx.fillRect(x, y + 22 * s, a.w - 72 * s, 2); y += 72 * s; const rows = [];
    items.forEach((it, i) => { const yy = y + i * 46 * s; const bad = opt.bad && opt.bad.includes(i);
      if (bad) { ctx.fillStyle = "#FDECEA"; rr(ctx, x - 8 * s, yy - 30 * s, Math.min(a.w - 72 * s, 520 * s), 42 * s, 8); ctx.fill(); }
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x + 14 * s, yy - 8 * s, 4 * s, 0, Math.PI * 2); ctx.fill();
      text(ctx, it, x + 34 * s, yy, 24 * s, { weight: 600, color: "#1A56B8" }); ctx.font = `600 ${24 * s}px ${K.FONT}`; const w = ctx.measureText(it).width;
      ctx.fillStyle = "#1A56B8"; ctx.fillRect(x + 34 * s, yy + 4 * s, w, 1.6); rows.push({ x: x + 34 * s, y: yy - 26 * s, w, h: 34 * s }); });
    ctx.fillStyle = "#9AA8B1"; ctx.fillRect(x, y + items.length * 46 * s - 10 * s, a.w - 72 * s, 2);
    return rows;
  }
  function gagal(ctx, a, judul, detail, s = 1) {
    const x = a.x + 70 * s, y = a.y + 120 * s;
    ctx.strokeStyle = "#8A99A3"; ctx.lineWidth = 4 * s; rr(ctx, x, y - 40 * s, 56 * s, 70 * s, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 14 * s, y + 4 * s); ctx.lineTo(x + 42 * s, y + 4 * s); ctx.stroke();
    ctx.fillStyle = "#8A99A3"; ctx.beginPath(); ctx.arc(x + 18 * s, y - 14 * s, 4 * s, 0, 7); ctx.arc(x + 38 * s, y - 14 * s, 4 * s, 0, 7); ctx.fill();
    text(ctx, judul, x, y + 90 * s, 34 * s, { weight: 800, fit: a.w - 140 * s });
    para(ctx, detail, x, y + 140 * s, 23 * s, a.w - 140 * s, { weight: 600, color: C.ink2, lh: 1.3 });
  }
  function browser(ctx, win, st, l) {
    const g = W.browser(ctx, win.x, win.y, win.w, win.h, { tabs: [st.tab || "Tab baru"], url: st.url, urlFocus: st.focus, caret: st.focus && blinkAt(l), secure: false, loading: st.loading, canBack: false });
    W.clip(ctx, g, () => { if (st.draw) st.draw(g); });
    return g;
  }
  // laptop sederhana: layar (isi digambar fn) + alas
  function laptop(ctx, cx, cy, w, opt = {}) {
    const h = w * 0.62, x = cx - w / 2, y = cy - h;
    ctx.fillStyle = "#33414B"; rr(ctx, x, y, w, h, 12); ctx.fill();
    ctx.fillStyle = opt.screen || "#FFFFFF"; rr(ctx, x + 10, y + 10, w - 20, h - 20, 6); ctx.fill();
    if (opt.fn) { ctx.save(); ctx.beginPath(); ctx.rect(x + 10, y + 10, w - 20, h - 20); ctx.clip(); opt.fn(x + 10, y + 10, w - 20, h - 20); ctx.restore(); }
    ctx.fillStyle = "#5B6B76"; ctx.beginPath(); ctx.moveTo(x - 24, cy + 4); ctx.lineTo(x + w + 24, cy + 4); ctx.lineTo(x + w + 6, cy + 26); ctx.lineTo(x - 6, cy + 26); ctx.closePath(); ctx.fill();
    if (opt.label) text(ctx, opt.label, cx, cy + 66, 28, { align: "center", weight: 900, color: opt.color || C.ink });
    if (opt.sub) { LK.mono(ctx, 22, 700); ctx.fillStyle = opt.color || C.ink2; ctx.textAlign = "center"; ctx.fillText(opt.sub, cx, cy + 102); ctx.textAlign = "left"; }
  }
  const miniPage = (x, y, w, h) => { const ctx = miniPage.ctx; ctx.fillStyle = "#2E7E9A"; ctx.fillRect(x + 14, y + 16, w * 0.6, 12);
    for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? "#E4EEF2" : "#CFE1E8"; ctx.fillRect(x + 14, y + 40 + i * 16, w - 28, 14); } };
  function packet(ctx, x, y, s, color) { ctx.fillStyle = color; rr(ctx, x - 70, y - 24, 140, 48, 12); ctx.fill(); text(ctx, s, x, y + 9, 24, { align: "center", weight: 800, color: "#FFFFFF" }); }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: AMBER });
      ["menyiapkan folder khusus", "menyalakan server: satu perintah", "membuka dari laptop teman", "mematikannya dengan aman"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 720, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      miniPage.ctx = ctx;
      laptop(ctx, 1170, 520, 250, { fn: miniPage, label: "Laptop Dito", sub: "server" });
      laptop(ctx, 1530, 520, 250, { fn: miniPage, label: "Laptop Sinta", sub: "klien" });
      W.icon(ctx, "wifi", 1350, 230, 60, C.kiko); text(ctx, "Wi-Fi kelas yang sama", 1350, 300, 24, { align: "center", weight: 800, color: C.ink2 });
      const u = (l * 0.5) % 1; ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(lerp(1460, 1240, u), 330, 9, 0, 7); ctx.fill();
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "YANG DILENGKAPI DAN DIBUTUHKAN", 960, 240, 32, { align: "center", weight: 900, color: AMBER });
      [["F11.7", "Model Jaringan dan Pengiriman Data", "klien dan server"], ["S18", "Perintah Jaringan di Terminal", "ipconfig dan alamat IP"], ["Python", "Sudah terpasang di laptop", "versi 3 apa saja"]].forEach(([c, t, s], i) => {
        const x = 240 + i * 490; card(ctx, x, 300, 460, 320, { fill: i === 2 ? "#F4F6F5" : C.bg2, r: 22 });
        text(ctx, c, x + 230, 380, 54, { align: "center", weight: 900, color: i === 2 ? C.ink2 : C.kiko }); para(ctx, t, x + 230, 445, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 585, 24, { align: "center", weight: 600, color: C.ink2 });
      });
      kiko(ctx, 1660, 730, 100, 0, { wave: l });
    },

    folder(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const inside = f > 0.3;
      const a = L.window(ctx, 110, 122, 880, 560, { title: "File" });
      ctx.fillStyle = "#F7F9FA"; ctx.fillRect(a.x, a.y, a.w, 56); rr(ctx, a.x + 20, a.y + 10, a.w - 40, 36, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill();
      text(ctx, inside ? "Desktop  ›  halaman-kelas" : "Desktop", a.x + 40, a.y + 36, 22, { weight: 700, color: C.ink2 });
      const items = inside ? [["index.html", "doc", "1 KB · halaman web"]] : [["halaman-kelas", "folder", "folder"], ["tugas-kimia.docx", "doc", "dokumen"], ["foto-liburan.jpg", "doc", "gambar"]];
      items.forEach(([n, ic, d], i) => { const y = a.y + 80 + i * 70; const hl = (!inside && i === 0 && f > 0.12) || (inside && f > 0.42);
        if (hl) { ctx.fillStyle = "#DCE9F7"; rr(ctx, a.x + 16, y, a.w - 32, 60, 10); ctx.fill(); }
        LK.icons[ic](ctx, a.x + 40, y + 12, 36, ic === "folder" ? "#C9921B" : "#3D6F8C"); text(ctx, n, a.x + 100, y + 40, 26, { weight: 700 }); text(ctx, d, a.x + a.w - 40, y + 40, 21, { align: "right", weight: 600, color: C.ink2 }); });
      if (inside) {
        call(ctx, 520, "Folder khusus: hanya file yang mau dibagikan.", a.x + 300, a.y + 115, { x: 300, maxW: 560, fill: C.goodBg, color: GREEN });
        // isi index.html
        const cx = 1040, cy = 122; card(ctx, cx, cy, 780, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
        text(ctx, "Isi index.html", cx + 24, cy + 42, 24, { weight: 900, color: AMBER });
        const src = ["<!DOCTYPE html>", "<html>", "<body>", "  <h1>Jadwal Piket Kelas XI-2</h1>", "  <table> ... </table>", "</body>", "</html>"];
        LK.mono(ctx, 23, 600); src.forEach((s, i) => { ctx.fillStyle = i === 3 ? "#1C6BB0" : "#3D4B55"; LK.monoText(ctx, s, cx + 30, cy + 96 + i * 42); });
        if (f > 0.55) { card(ctx, cx, 580, 780, 150, { fill: "#FFF9E0", r: 16 }); para(ctx, "Nama index.html itu penting: server membukanya otomatis sebagai halaman utama.", cx + 30, 630, 25, 720, { weight: 700, lh: 1.3 }); }
      }
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 760 }, { at: 0.12, x: a.x + 200, y: a.y + 110 }, { at: 0.24, x: a.x + 200, y: a.y + 110, click: true }, { at: 0.42, x: a.x + 210, y: a.y + 112 }]);
    },
    cd_folder(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: CD, p: P0, np: PD, t0: 0.08, t1: 0.6 }]);
      const g = term(ctx, st, l);
      keys(ctx, ["Enter"], st.enter);
      if (f > 0.64) { const bx = g.box(1, 0, PD.length - 1); LK.focus(ctx, bx, { t: l, pad: 2 }); call(ctx, 500, "Prompt berubah: sekarang di folder halaman-kelas.", bx.x + bx.w, bx.y + bx.h / 2, { fill: C.goodBg, color: GREEN }); }
      LK.steps(ctx, "LANGKAH", ["Buka Terminal (cmd).", "Ketik cd Desktop\\halaman-kelas", "Tekan Enter."], stepAt(f, [0.06, 0.58, 0.66]));
    },
    dir_folder(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: "dir", out: DIR, t0: 0.06, t1: 0.2, t2: 0.4 }], [cmd(CD, P0)], PD);
      const g = term(ctx, st, l);
      keys(ctx, ["Enter"], st.enter);
      if (f > 0.45) { const bx = g.find(7, "index.html"); if (bx) { LK.focus(ctx, bx, { t: l, color: GREEN }); call(ctx, 360, "index.html ada di sini. Folder benar ✓", bx.x + bx.w, bx.y + bx.h / 2, { fill: C.goodBg, color: GREEN }); } }
      LK.steps(ctx, "LANGKAH", ["Ketik dir, lalu Enter.", "Cari index.html."], stepAt(f, [0.2, 0.5]), { y: 560 });
    },

    ketik_server(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: SRV, t0: 0.06, t1: 0.95 }], [cmd(CD, P0), cmd("dir", PD)].concat(DIR), PD);
      const g = term(ctx, st, l);
      const parts = [["python", "jalankan Python", 0.3], ["-m http.server", "modul server web", 0.48], ["8000", "nomor port, seperti nomor pintu", 0.72]];
      const row = st.rows.length; const base = PD.length;
      card(ctx, 1450, 122, 370, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "ARTI PERINTAH", 1474, 166, 24, { weight: 900, color: AMBER });
      parts.forEach(([p, s, at], i) => { const on = f > at; ctx.globalAlpha = on ? 1 : 0.3; const y = 200 + i * 112;
        LK.mono(ctx, 24, 700); ctx.fillStyle = [BLUE, "#8B3DB5", GREEN][i]; LK.monoText(ctx, p, 1474, y + 28); para(ctx, s, 1474, y + 66, 22, 330, { weight: 700, lh: 1.2 }); ctx.globalAlpha = 1;
        if (on && f < 0.97) { const a = SRV.indexOf(p); const bx = g.box(row, base + a, base + a + p.length); if (g.vis(row)) { ctx.strokeStyle = [BLUE, "#8B3DB5", GREEN][i]; ctx.lineWidth = 3; rr(ctx, bx.x, bx.y, bx.w, bx.h, 6); ctx.stroke(); } } });
    },
    server_jalan(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: SRV, out: [SERV], t0: 0, t1: 0.1, t2: 0.14, hold: true }], [cmd(CD, P0), cmd("dir", PD)].concat(DIR), PD);
      const g = term(ctx, st, l);
      keys(ctx, ["Enter"], st.enter);
      const i = st.rows.length - 1;
      if (f > 0.18 && typeof st.rows[i] === "string") { const bx = g.find(i, "Serving HTTP"); LK.focus(ctx, bx, { t: l, color: GREEN });
        call(ctx, 700, "Server menyala dan menunggu permintaan.", bx.x + bx.w / 2, bx.y + bx.h, { x: 300, maxW: 600, fill: C.goodBg, color: GREEN }); }
      if (f > 0.5) { card(ctx, 1450, 122, 370, 200, { fill: "#FDECEA", r: 18 }); text(ctx, "JANGAN DITUTUP", 1474, 166, 24, { weight: 900, color: RED });
        para(ctx, "Tidak ada prompt baru: Terminal sedang dipakai server.", 1474, 208, 22, 330, { weight: 700, lh: 1.25 }); }
      if (f > 0.7) { text(ctx, "0.0.0.0 berarti menerima dari", 1474, 380, 20, { weight: 700, color: C.ink2 }); text(ctx, "semua alamat laptop ini.", 1474, 408, 20, { weight: 700, color: C.ink2 }); text(ctx, "Di laptop lain bisa tertulis ::", 1474, 448, 20, { weight: 700, color: C.ink2 }); }
    },
    firewall(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      term(ctx, { rows: [cmd(CD, P0), cmd("dir", PD)].concat(DIR, HIST_SRV), busy: true, prompt: PD }, l);
      ctx.fillStyle = "rgba(31,42,51,0.35)"; ctx.fillRect(110, 122, 1300, 700);
      const a = L.window(ctx, 300, 190, 920, 560, { title: "Peringatan Keamanan" });
      W.icon(ctx, "warn", a.x + 70, a.y + 64, 56, "#C07A0C");
      text(ctx, "Firewall memblokir sebagian fitur python.", a.x + 130, a.y + 60, 28, { weight: 800 });
      text(ctx, "Izinkan python berkomunikasi di jaringan berikut:", a.x + 130, a.y + 100, 23, { weight: 600, color: C.ink2 });
      const on1 = f > 0.3;
      const c1 = W.checkbox(ctx, a.x + 130, a.y + 170, "Jaringan privat, misalnya di rumah atau sekolah", on1, { size: 25 });
      const c2 = W.checkbox(ctx, a.x + 130, a.y + 240, "Jaringan publik, misalnya di kafe atau bandara", false, { size: 25 });
      if (f > 0.55) { text(ctx, "✗ jangan dicentang", a.x + 170, a.y + 296, 22, { weight: 800, color: RED }); }
      const press = clamp((f - 0.8) / 0.08, 0, 1);
      const btn = W.button(ctx, a.x + a.w - 470, a.y + a.h - 100, 230, 60, "Izinkan akses", { press });
      W.button(ctx, a.x + a.w - 220, a.y + a.h - 100, 180, 60, "Batal", { kind: "secondary" });
      if (on1) call(ctx, 640, "Cukup sekali, saat server pertama kali dinyalakan.", null, null, { x: 1450, y: 640, maxW: 330, size: 22 });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 790 }, { at: 0.28, x: a.x + 144, y: a.y + 162, click: true }, { at: 0.55, x: a.x + 144, y: a.y + 232 }, { at: 0.8, x: btn.x + 115, y: btn.y + 30, click: true }]);
      LK.steps(ctx, "LANGKAH", ["Centang Jaringan privat.", "Biarkan Jaringan publik kosong.", "Klik Izinkan akses."], stepAt(f, [0.3, 0.6, 0.82]));
    },
    buka_localhost(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const typed = W.typed("localhost:8000", ph(l, sp, 0.12, 0.38));
      const loaded = f > 0.55, loading = f > 0.45 && !loaded ? (f - 0.45) / 0.1 : 0;
      const g = browser(ctx, WIN, { tab: loaded ? "Jadwal Piket XI-2" : "Tab baru", url: f < 0.12 ? "" : typed, focus: f < 0.45, loading, draw: loaded ? a => jadwal(ctx, a, 1, (f - 0.55) / 0.06) : null }, l);
      keys(ctx, ["Enter"], clamp((f - 0.39) / 0.07, 0, 1));
      if (f > 0.5 && f < 0.8) call(ctx, 520, "localhost = komputer ini sendiri", g.url.x + 300, g.url.cy + 16, { x: 1450 });
      if (f > 0.8) call(ctx, 520, "Halaman dari folder halaman-kelas tampil.", g.x + 500, g.y + 140, { x: 1450, fill: C.goodBg, color: GREEN });
      LK.steps(ctx, "LANGKAH", ["Buka browser.", "Ketik localhost:8000", "Tekan Enter."], stepAt(f, [0.1, 0.39, 0.46]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.1, x: g.url.x + 200, y: g.url.cy, click: true, kind: "text" }, { at: 0.5, x: 1200, y: 700 }]);
    },
    log_get(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const rows = HIST_SRV.concat(f > 0.06 ? LOGL : []);
      const g = term(ctx, { rows, busy: true, prompt: PD }, l, WIN, { size: 24 });
      const i = 2, s = g.str(i);
      card(ctx, 1450, 122, 370, 470, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "MEMBACA LOG", 1474, 166, 24, { weight: 900, color: AMBER });
      const parts = [["127.0.0.1", "yang meminta: komputer ini", BLUE, 0.18], ["GET /", "minta halaman utama", "#8B3DB5", 0.42], ["200", "berhasil dikirim", GREEN, 0.62]];
      parts.forEach(([p, d, col, at], k) => { const on = f > at; ctx.globalAlpha = on ? 1 : 0.3; const y = 200 + k * 124;
        LK.mono(ctx, 26, 800); ctx.fillStyle = col; LK.monoText(ctx, p, 1474, y + 28); para(ctx, d, 1474, y + 68, 22, 330, { weight: 700, lh: 1.2 }); ctx.globalAlpha = 1;
        if (on && f > 0.06) { const a = p === "200" ? s.indexOf(" 200 ") + 1 : s.indexOf(p); const bx = g.box(i, a, a + p.length); ctx.strokeStyle = col; ctx.lineWidth = 3.5; rr(ctx, bx.x, bx.y, bx.w, bx.h, 6); ctx.stroke(); } });
    },
    log_404(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const g = term(ctx, { rows: HIST_SRV.concat(LOGL), busy: true, prompt: PD }, l, WIN, { size: 24 });
      if (f < 0.55) { const bx = g.box(3, 0, g.str(4).length); const by = g.box(4, 0, g.str(4).length); const box = { x: bx.x, y: bx.y, w: by.w, h: by.y + by.h - bx.y };
        LK.focus(ctx, box, { t: l, color: AMBER }); call(ctx, 160, "404 favicon.ico: browser mencari ikon kecil. Wajar.", null, null, { x: 1450, maxW: 330 }); }
      else {
        card(ctx, 1450, 122, 370, 380, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "DI BILAH ALAMAT", 1474, 166, 24, { weight: 900, color: AMBER });
        ctx.fillStyle = "#F1F4F6"; rr(ctx, 1470, 196, 330, 52, 26); ctx.fill(); W.icon(ctx, "warn", 1496, 222, 20, RED); text(ctx, "Tidak aman", 1514, 230, 20, { weight: 700, color: RED }); text(ctx, "localhost:8000", 1640, 230, 20, { weight: 600, fit: 150 });
        para(ctx, "http tidak dienkripsi. Bagikan hanya isi yang memang boleh dilihat teman, jangan data rahasia.", 1474, 300, 22, 330, { weight: 700, lh: 1.3 });
      }
    },

    ipconfig(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      term(ctx, { rows: HIST_SRV.concat(LOGL), busy: true, prompt: PD }, l, WIN, { size: 22 });
      ctx.fillStyle = "rgba(31,42,51,0.25)"; ctx.fillRect(110, 122, 1300, 700);
      const W2 = { x: 170, y: 190, w: 1200, h: 620 };
      const st = sesi(f, [{ c: "ipconfig", out: IPC, t0: 0.2, t1: 0.5, t2: 0.62 }]);
      const g = term(ctx, st, l, W2, { title: "Terminal 2 (cmd)", size: 25 });
      keys(ctx, ["Enter"], st.enter, 1100, 760);
      if (f > 0.66) { const bx = g.find(6, "IPv4 Address"); if (bx) { LK.focus(ctx, bx, { t: l }); } }
      if (f < 0.2) call(ctx, 300, "Terminal pertama sedang dipakai server, jadi buka jendela baru.", null, null, { x: 1450, maxW: 330 });
      LK.steps(ctx, "LANGKAH", ["Buka Terminal kedua.", "Ketik ipconfig, Enter.", "Cari IPv4 Address."], stepAt(f, [0.18, 0.52, 0.66]), { y: 470 });
    },
    alamat_ip(ctx, b, l) {
      const A = b.audio || b.dur;
      const g = term(ctx, { rows: [cmd("ipconfig", P0)].concat(IPC), prompt: P0 }, l, { x: 110, y: 122, w: 1000, h: 420 }, { title: "Terminal 2 (cmd)", size: 22 });
      const bx = g.find(6, "192.168.1.23"); if (bx) LK.focus(ctx, bx, { t: l, color: GREEN });
      // alamat lengkap
      const u = clamp((l - A * 0.45) / (A * 0.2), 0, 1);
      card(ctx, 110, 580, 1000, 230, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "ALAMAT UNTUK TEMAN", 140, 624, 24, { weight: 900, color: AMBER });
      const segs = [["http://", C.ink2, "protokol"], ["192.168.1.23", GREEN, "alamat IP laptop Dito"], [":8000", BLUE, "port"]];
      let x = 150; LK.mono(ctx, 46, 800); const cw = ctx.measureText("M").width;
      segs.forEach(([s, col, d], k) => { const show = k === 1 || u > (k === 0 ? 0.2 : 0.6); if (!show) { x += s.length * cw; return; } LK.mono(ctx, 46, 800); ctx.fillStyle = col; LK.monoText(ctx, s, x, 700, cw);
        text(ctx, d, x + s.length * cw / 2, 760, 21, { align: "center", weight: 700, color: col }); x += s.length * cw; });
      // pesan grup kelas
      if (l > A * 0.6) { card(ctx, 1170, 300, 650, 300, { fill: "#E9F5EE", r: 22 }); text(ctx, "Grup Kelas XI-2", 1200, 350, 26, { weight: 900 });
        card(ctx, 1200, 380, 590, 180, { fill: "#FFFFFF", r: 16 }); text(ctx, "Dito", 1224, 418, 22, { weight: 900, color: C.kiko });
        para(ctx, "Jadwal piket bisa dibuka di http://192.168.1.23:8000 ya, asal pakai Wi-Fi kelas.", 1224, 456, 23, 545, { weight: 600, lh: 1.3 }); }
    },
    teman_buka(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      tags(ctx);
      const loaded = f > 0.55;
      term(ctx, { rows: HIST_SRV.concat(LOGL, loaded ? LOGS : []), busy: true, prompt: PD }, l, LEFT, { size: SZ2 });
      const typed = W.typed("192.168.1.23:8000", ph(l, sp, 0.12, 0.42));
      const loading = f > 0.45 && !loaded ? (f - 0.45) / 0.1 : 0;
      const g = browser(ctx, RIGHT, { tab: loaded ? "Jadwal Piket XI-2" : "Tab baru", url: f < 0.12 ? "" : typed, focus: f < 0.45, loading, draw: loaded ? a => jadwal(ctx, a, 0.82, (f - 0.55) / 0.06) : null }, l);
      keys(ctx, ["Enter"], clamp((f - 0.42) / 0.06, 0, 1), 1360, 760);
      if (f < 0.12) { card(ctx, 960, 400, 800, 120, { fill: "#E7F1FB", r: 16 }); W.icon(ctx, "wifi", 1010, 460, 40, BLUE); text(ctx, "Tersambung: WIFI-KELAS-XI2", 1050, 470, 28, { weight: 800, color: BLUE }); }
      LK.pointer(ctx, l, sp, [{ at: 0, x: 1400, y: 700 }, { at: 0.1, x: g.url.x + 250, y: g.url.cy, click: true, kind: "text" }, { at: 0.6, x: 1700, y: 760 }]);
    },
    klien_server(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 110, 122, 1710, 440, { fill: "#FFFFFF", r: 22 });
      miniPage.ctx = ctx;
      laptop(ctx, 400, 380, 280, { fn: miniPage, label: "Laptop Sinta · klien", sub: "192.168.1.31", color: "#7A4FA8" });
      laptop(ctx, 1520, 380, 280, { fn: (x, y, w, h) => { ctx.fillStyle = "#1D242A"; ctx.fillRect(x, y, w, h); LK.mono(ctx, 12, 600); ctx.fillStyle = "#86D993"; for (let i = 0; i < 5; i++) ctx.fillRect(x + 10, y + 14 + i * 22, w * (0.5 + 0.08 * (i % 3)), 6); }, label: "Laptop Dito · server", sub: "192.168.1.23:8000", color: C.kikoDark });
      W.routerBox(ctx, 960, 300, 70, { lamps: [true, true, true], blink: l }); text(ctx, "router Wi-Fi", 960, 380, 24, { align: "center", weight: 800, color: C.ink2 });
      const cyc = 4.4, u = (l % cyc) / cyc;
      if (u < 0.45) { const v = u / 0.45; packet(ctx, lerp(560, 1360, v), 240, "GET /", "#7A4FA8"); }
      else if (u > 0.5 && u < 0.95) { const v = (u - 0.5) / 0.45; packet(ctx, lerp(1360, 560, v), 330, "200 + halaman", GREEN); }
      const g = term(ctx, { rows: HIST_SRV.concat(LOGL, LOGS), busy: true, prompt: PD }, l, { x: 110, y: 590, w: 1710, h: 232 }, { size: 22, title: "Terminal laptop Dito" });
      if (l > A * 0.15) { const bx = g.find(5, "192.168.1.31"); if (bx) LK.focus(ctx, bx, { t: l, color: "#7A4FA8" }); }
      if (l > A * 0.15) { const bx = g.find(5, " 200 "); if (bx) LK.focus(ctx, bx, { t: l + 1, color: GREEN }); }
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 300, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 262, 22, 76, 6); ctx.fill(); rr(ctx, 340, 262, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 280, 44, { weight: 900, color: AMBER }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 330, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 250, 420 + i * 110, 820, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 296, 476 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 340, 476 + i * 110, 28, { weight: 700, fit: 710 }); });
      LK.terminal(ctx, 1110, 380, 600, 380, { size: 17, lines: [cmd("dir", "halaman-kelas>"), "  ...  index.html", cmd(SRV, "halaman-kelas>"), "Serving HTTP on 0.0.0.0 port 8000 ...", '192.168.1.31 ... "GET / HTTP/1.1" 200 -'], caret: false, title: "Hasil yang dituju" });
    },
    periksa(ctx, b, l) {
      const A = b.audio || b.dur;
      tags(ctx);
      const g = term(ctx, { rows: HIST_SRV.concat(LOGL, LOGS), busy: true, prompt: PD }, l, LEFT, { size: SZ2 });
      browser(ctx, RIGHT, { tab: "Jadwal Piket XI-2", url: "192.168.1.23:8000", draw: a => jadwal(ctx, a, 0.82) }, l);
      if (l > A * 0.1) { const bx = g.find(5, "192.168.1.31"); LK.focus(ctx, bx, { t: l, color: GREEN }); const b2 = g.find(5, " 200 "); LK.focus(ctx, b2, { t: l, color: GREEN });
        call(ctx, 520, "Alamat laptop teman + 200 = berhasil ✓", bx.x + 40, bx.y + bx.h, { x: 170, maxW: 600, fill: C.goodBg, color: GREEN }); }
      if (l > A * 0.55) call(ctx, 620, "Halaman sama dengan di laptopmu ✓", 1300, 400, { x: 1180, maxW: 560, fill: C.goodBg, color: GREEN });
    },

    daftar_file(ctx, b, l) {
      const A = b.audio || b.dur;
      const g = browser(ctx, WIN, { tab: "Directory listing for /", url: "192.168.1.23:8000", draw: a => { listRows = listing(ctx, a, LIST_DOC, 1, { bad: l > A * 0.45 ? [1, 2, 4] : [] }); } }, l);
      const rows = listRows;
      if (l > A * 0.45 && rows[2]) call(ctx, 300, "File pribadi ikut terlihat dan bisa di-download!", rows[2].x + rows[2].w + 10, rows[2].y + 18, { fill: "#FDECEA", color: RED });
      card(ctx, 1450, 560, 370, 250, { fill: "#FFF9E0", r: 18 }); text(ctx, "INGAT", 1474, 604, 24, { weight: 900, color: AMBER });
      para(ctx, "Server membagikan SEMUA isi folder tempat ia dinyalakan.", 1474, 646, 23, 330, { weight: 800, lh: 1.3 });
    },
    tiga_aturan(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "TIGA ATURAN BERBAGI", 960, 220, 34, { align: "center", weight: 900, color: AMBER });
      const R = [["wifi", "Jaringan sekolah atau rumah", "dengan izin guru atau orang tua; bukan Wi-Fi publik"], ["folder", "Folder khusus saja", "isinya hanya file yang boleh dilihat teman"], ["stop", "Matikan setelah selesai", "Ctrl + C di jendela Terminal server"]];
      R.forEach(([ic, t, s], i) => { const on = l > A * (0.14 + i * 0.24); ctx.globalAlpha = on ? 1 : 0.2; const x = 230 + i * 500;
        card(ctx, x, 280, 460, 420, { fill: C.bg2, r: 22 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 230, 380, 62, 0, 7); ctx.fill();
        if (ic === "wifi") W.icon(ctx, "wifi", x + 230, 384, 64, "#FFFFFF");
        else if (ic === "folder") LK.icons.folder(ctx, x + 196, 350, 70, "#FFFFFF");
        else { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(x + 230, 386, 30, -1.1, Math.PI + 1.1); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 230, 340); ctx.lineTo(x + 230, 380); ctx.stroke(); }
        text(ctx, String(i + 1), x + 40, 330, 40, { weight: 900, color: C.kiko });
        para(ctx, t, x + 230, 500, 30, 400, { align: "center", weight: 900, lh: 1.2 }); para(ctx, s, x + 230, 600, 23, 390, { align: "center", weight: 600, color: C.ink2, lh: 1.3 }); ctx.globalAlpha = 1; });
    },
    ctrl_c(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const stopped = f > 0.55;
      const rows = HIST_SRV.concat(LOGL, LOGS, stopped ? STOP : []);
      const g = term(ctx, { rows, busy: !stopped, prompt: PD }, l, WIN, { size: 24 });
      keys(ctx, ["Ctrl", "C"], clamp((f - 0.42) / 0.14, 0, 1), 1250, 735);
      if (f > 0.62) { const i = rows.length - 1; const bx = g.find(i, "Keyboard interrupt received"); if (bx) { LK.focus(ctx, bx, { t: l, color: GREEN }); call(ctx, 660, "Server mati.", bx.x + 120, bx.y + bx.h, { x: 200, fill: C.goodBg, color: GREEN }); } }
      if (f > 0.8) call(ctx, 660, "Prompt kembali: Terminal siap menerima perintah lagi.", g.x + 22 + PD.length * g.cw + 10, g.y + 18 + (rows.length - g.first + 1) * g.lh - 4, { x: 700, maxW: 560 });
      LK.steps(ctx, "LANGKAH", ["Klik jendela Terminal server.", "Tekan Ctrl + C.", "Prompt kembali."], stepAt(f, [0.26, 0.56, 0.8]), { y: 590 });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 1300, y: 780 }, { at: 0.24, x: 900, y: 600, click: true }, { at: 0.6, x: 1000, y: 760 }]);
    },
    server_mati(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      tags(ctx);
      term(ctx, { rows: HIST_SRV.concat(LOGL, LOGS, STOP), prompt: PD }, l, LEFT, { size: SZ2 });
      const err = f > 0.32, loading = f > 0.16 && !err ? (f - 0.16) / 0.16 : 0;
      const g = browser(ctx, RIGHT, { tab: err ? "192.168.1.23" : "Jadwal Piket XI-2", url: "192.168.1.23:8000", loading,
        draw: a => { if (err) gagal(ctx, a, "Situs ini tidak dapat dijangkau", "192.168.1.23 menolak untuk tersambung. Tidak ada server yang menyala di alamat dan port itu.", 0.95); else jadwal(ctx, a, 0.82); } }, l);
      LK.pointer(ctx, l, sp, [{ at: 0, x: 1400, y: 600 }, { at: 0.14, x: g.reload.cx, y: g.reload.cy, click: true }, { at: 0.5, x: 1500, y: 760 }]);
      if (f > 0.5) call(ctx, 640, "Tidak ada lagi yang melayani permintaan.", null, null, { x: 960, maxW: 820, fill: "#FDECEA", color: RED });
    },

    port_dipakai(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: SRV, out: ERRPORT, t0: 0, t1: 0.06, t2: 0.12 }, { c: SRV1, out: [SERV1], t0: 0.66, t1: 0.86, t2: 0.88, hold: true }], [cmd(CD, P0)], PD);
      const g = term(ctx, st, l, WIN, { size: 24 });
      keys(ctx, ["Enter"], st.enter);
      if (f > 0.14 && f < 0.66) { const bx = g.find(4, "OSError: [WinError 10048]"); if (bx) { LK.focus(ctx, bx, { t: l, color: RED }); call(ctx, 160, "Port 8000 masih dipakai server lain.", bx.x + bx.w, bx.y + bx.h / 2, { fill: "#FDECEA", color: RED }); } }
      if (f > 0.9) { const i = st.rows.length - 1; const bx = g.find(i, "port 8001"); if (bx) { LK.focus(ctx, bx, { t: l, color: GREEN }); } }
      card(ctx, 1450, 400, 370, 330, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "PERBAIKAN", 1474, 444, 24, { weight: 900, color: GREEN });
      para(ctx, "Ctrl + C di jendela server lama, atau pakai port lain: 8001.", 1474, 488, 22, 330, { weight: 700, lh: 1.3 });
      if (f > 0.66) { para(ctx, "Alamat untuk teman ikut berubah:", 1474, 612, 21, 330, { weight: 700, color: C.ink2 }); LK.mono(ctx, 21, 800); ctx.fillStyle = BLUE; LK.monoText(ctx, "192.168.1.23:8001", 1474, 680); }
    },
    firewall_blokir(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      tags(ctx);
      const g0 = term(ctx, { rows: HIST_SRV.concat(LOGL), busy: true, prompt: PD }, l, LEFT, { size: SZ2 });
      const err = f > 0.4;
      browser(ctx, RIGHT, { tab: err ? "192.168.1.23" : "Memuat…", url: "192.168.1.23:8000", loading: err ? 0 : 0.15 + 0.5 * (f / 0.4),
        draw: a => { if (err) gagal(ctx, a, "Situs ini tidak dapat dijangkau", "192.168.1.23 terlalu lama merespons.", 0.95);
          else { const cx = a.x + a.w / 2, cy = a.y + 220; ctx.strokeStyle = "#1A73C8"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(cx, cy, 40, l * 5, l * 5 + 4.2); ctx.stroke(); } } }, l);
      if (f > 0.25) call(ctx, 420, "Log tetap kosong: permintaan Sinta tidak sampai.", 400, g0.y + 18 + 6 * g0.lh, { x: 160, maxW: 640, fill: "#FDECEA", color: RED });
      if (f > 0.6) { card(ctx, 940, 560, 840, 230, { fill: C.goodBg, r: 18 }); text(ctx, "PERBAIKAN", 970, 604, 24, { weight: 900, color: GREEN });
        para(ctx, "Izinkan python di Jaringan privat, dan pastikan Wi-Fi di laptopmu diatur sebagai jaringan privat. Minta bantuan guru bila perlu.", 970, 646, 23, 780, { weight: 700, lh: 1.3 }); }
    },
    salah_folder(ctx, b, l) {
      const A = b.audio || b.dur;
      tags(ctx);
      const g = term(ctx, { rows: [cmd(SRV, PDOC), SERV, '192.168.1.31 - - [04/Nov/2026 09:30:12] "GET / HTTP/1.1" 200 -'], busy: true, prompt: PDOC }, l, LEFT, { size: SZ2 });
      browser(ctx, RIGHT, { tab: "Directory listing for /", url: "192.168.1.23:8000", draw: a => listing(ctx, a, LIST_DOC, 0.9) }, l);
      if (l > A * 0.55) { const bx = g.find(0, "Documents"); LK.focus(ctx, bx, { t: l, color: RED }); call(ctx, 440, "Prompt: Documents, bukan halaman-kelas.", bx.x + bx.w / 2, bx.y + bx.h, { x: 170, maxW: 600, fill: "#FDECEA", color: RED }); }
      if (l > A * 0.3) call(ctx, 620, "Daftar file, bukan jadwal piket.", 1250, 296, { x: 1100, maxW: 600, fill: "#FDECEA", color: RED });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: AMBER });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F11.7", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "pelacak lompatan paket", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f117", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "ikuti paket dari HP sampai ke server", 620, 600, 23, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Dengan izin guru, bagikan halaman buatanmu ke teman, lalu catat log-nya.", 1310, 420, 29, 540, { align: "center", weight: 700, lh: 1.3 });
      LK.mono(ctx, 19, 700); ctx.fillStyle = C.ink; LK.monoText(ctx, '192.168.1.31 "GET / HTTP/1.1" 200', 1100, 610);
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
