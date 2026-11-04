/* S01 Simulasi praktik: folder dan file di laptop (pengelola file generik "File", aplikasi "Dokumen") dan di HP (aplikasi "File").
   Laptop: jendela di kiri (x 110–1410, y 122–822), panel langkah di kanan (x 1450–1820). HP: memakai Kiko.hp + bantu.js.
   Semua nama file, folder, dan isi rekaan. Istilah mengikuti D7.0 (double click, klik kanan, drag, save, search, tekan lama). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, HP = K.hp, B = K.bantu;
  const { rr, text, para, card, kiko, kid, ease, clamp, lerp, wrap } = H;
  const { BLUE, RED, GREEN, ORANGE } = B;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 }, TB = WIN.y + 46, BODY = TB + 60, SIDE = 230;
  const MAIN = { x: WIN.x + SIDE, y: BODY, w: WIN.w - SIDE, h: WIN.y + WIN.h - 34 - BODY };
  const SEL = "rgba(26,115,200,0.14)", SELLINE = "#1A73C8";

  // ---------- ikon file ----------
  function fileIcon(ctx, k, cx, cy, s, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha = opt.alpha;
    if (k === "folder") {
      ctx.fillStyle = "#D99A2B"; rr(ctx, cx - s * 0.5, cy - s * 0.36, s * 0.42, s * 0.2, s * 0.06); ctx.fill();
      ctx.fillStyle = "#E8AE3C"; rr(ctx, cx - s * 0.5, cy - s * 0.26, s, s * 0.62, s * 0.08); ctx.fill();
      ctx.fillStyle = opt.open ? "#FFD978" : "#F6C653"; rr(ctx, cx - s * 0.5, cy - s * 0.14, s, s * 0.5, s * 0.08); ctx.fill();
    } else {
      const w = s * 0.72, h = s * 0.9, x = cx - w / 2, y = cy - h / 2, f = s * 0.22;
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.quadraticCurveTo(x, y, x + 6, y); ctx.lineTo(x + w - f, y); ctx.lineTo(x + w, y + f); ctx.lineTo(x + w, y + h - 6);
      ctx.quadraticCurveTo(x + w, y + h, x + w - 6, y + h); ctx.lineTo(x + 6, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - 6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#9FB0BC"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#DCE5EB"; ctx.beginPath(); ctx.moveTo(x + w - f, y); ctx.lineTo(x + w - f, y + f); ctx.lineTo(x + w, y + f); ctx.closePath(); ctx.fill(); ctx.stroke();
      const col = { doc: "#2F6FC0", img: "#2E9E5B", music: "#8E6BBF", pdf: "#D9443B" }[k] || "#5B6B76";
      if (k === "doc") { ctx.fillStyle = col; for (let i = 0; i < 4; i++) ctx.fillRect(x + w * 0.16, y + h * (0.34 + i * 0.13), w * (i === 3 ? 0.4 : 0.66), Math.max(2, s * 0.04)); }
      else if (k === "img") { ctx.fillStyle = "#CFEBDD"; ctx.fillRect(x + w * 0.12, y + h * 0.3, w * 0.76, h * 0.5); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x + w * 0.12, y + h * 0.8); ctx.lineTo(x + w * 0.42, y + h * 0.48); ctx.lineTo(x + w * 0.6, y + h * 0.66); ctx.lineTo(x + w * 0.72, y + h * 0.56); ctx.lineTo(x + w * 0.88, y + h * 0.8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#F2B134"; ctx.beginPath(); ctx.arc(x + w * 0.7, y + h * 0.4, s * 0.06, 0, Math.PI * 2); ctx.fill(); }
      else if (k === "music") { HP.icon(ctx, "music", cx, cy + h * 0.08, s * 0.42, col); }
      else if (k === "pdf") { ctx.fillStyle = col; rr(ctx, x - s * 0.06, y + h * 0.5, w * 0.8, h * 0.26, 4); ctx.fill(); text(ctx, "PDF", x - s * 0.06 + w * 0.4, y + h * 0.69, Math.max(10, s * 0.17), { align: "center", weight: 900, color: "#FFFFFF" }); }
    }
    ctx.restore();
  }

  // ---------- data (rekaan) ----------
  const ROOTS = ["Desktop", "Dokumen", "Download", "Gambar", "Musik", "Video"];
  const FILES0 = [{ n: "Laporan IPA", k: "doc" }, { n: "asdf", k: "doc" }, { n: "foto kelas", k: "img" }, { n: "Ringkasan Sejarah", k: "doc" }, { n: "lagu pramuka", k: "music" }, { n: "denah kelas", k: "img" }];
  // tahap isi folder Dokumen: awal → folder (Folder baru) → named → renamed → moved
  function dokItems(stage) {
    const order = ["awal", "folder", "named", "renamed", "moved"], k = order.indexOf(stage);
    const out = FILES0.map(f => ({ ...f }));
    if (k >= 3) out[1].n = "Jadwal Piket 7A";
    if (k >= 4) out.splice(1, 1);
    if (k >= 1) out.unshift({ n: k >= 2 ? "Tugas Sekolah" : "Folder baru", k: "folder" });
    return out;
  }
  const VIEWS = {
    root: { addr: ["Laptop"], side: -1, items: () => ROOTS.map(n => ({ n, k: "folder" })) },
    dok: { addr: ["Laptop", "Dokumen"], side: 1 },
    tugas: { addr: ["Laptop", "Dokumen", "Tugas Sekolah"], side: 1, items: st => [{ n: "Jadwal Piket 7A", k: "doc" }].concat(st.puisi ? [{ n: "Puisi Ibu Dito", k: "doc" }] : []) }
  };

  // ---------- geometri jendela File ----------
  const G = {
    back: { x: WIN.x + 34, y: TB + 30 }, fwd: { x: WIN.x + 78, y: TB + 30 },
    addr: { x: WIN.x + 112, y: TB + 10, w: 760, h: 40 }, search: { x: WIN.x + 890, y: TB + 10, w: 390, h: 40 },
    side: i => ({ x: WIN.x + 14, y: BODY + 56 + i * 52, w: SIDE - 28, h: 44, cx: WIN.x + 110, cy: BODY + 78 + i * 52 }),
    tile: i => { const x = MAIN.x + 28 + (i % 6) * 172, y = MAIN.y + 22 + Math.floor(i / 6) * 196; return { x, y, w: 160, h: 180, cx: x + 80, cy: y + 66 }; },
    empty: { x: MAIN.x + 760, y: MAIN.y + 430 }
  };
  // jendela File. st: view, stage, sel (indeks), edit {i, text, all}, drop (indeks folder tujuan), hide (indeks), search {q, focus}, results, backHl, puisi
  function fm(ctx, st = {}) {
    const V = VIEWS[st.view || "dok"], items = st.items || (V.items ? V.items(st) : dokItems(st.stage || "awal"));
    const title = st.results ? "File — Hasil pencarian" : "File — " + V.addr[V.addr.length - 1];
    const area = L.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title });
    // bilah alat: kembali, maju, alamat, search
    if (st.backHl) { ctx.fillStyle = "#FFF3D6"; ctx.beginPath(); ctx.arc(G.back.x, G.back.y, 22, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; ctx.stroke(); }
    HP.icon(ctx, "back", G.back.x, G.back.y, 26, C.ink); ctx.save(); ctx.translate(G.fwd.x, G.fwd.y); ctx.scale(-1, 1); HP.icon(ctx, "back", 0, 0, 26, "#A9B6BE"); ctx.restore();
    const A = G.addr; ctx.fillStyle = "#F4F7F9"; rr(ctx, A.x, A.y, A.w, A.h, 10); ctx.fill(); ctx.strokeStyle = st.addrHl ? C.accent : "#D5DEE4"; ctx.lineWidth = st.addrHl ? 3 : 1.5; rr(ctx, A.x, A.y, A.w, A.h, 10); ctx.stroke();
    fileIcon(ctx, "folder", A.x + 24, A.y + 21, 24);
    const crumbs = st.results ? ["Hasil pencarian: " + st.search.q] : V.addr;
    let ax = A.x + 46; crumbs.forEach((c, i) => { text(ctx, c, ax, A.y + 28, 21, { weight: i === crumbs.length - 1 ? 800 : 600, color: i === crumbs.length - 1 ? C.ink : C.ink2 }); ctx.font = "700 21px Inter"; ax += ctx.measureText(c).width + 10;
      if (i < crumbs.length - 1) { text(ctx, "›", ax, A.y + 28, 22, { weight: 800, color: "#8A99A3" }); ax += 22; } });
    const S = G.search, sq = st.search || {}; ctx.fillStyle = "#FFFFFF"; rr(ctx, S.x, S.y, S.w, S.h, 20); ctx.fill(); ctx.strokeStyle = sq.focus ? BLUE : "#D5DEE4"; ctx.lineWidth = sq.focus ? 3 : 1.5; rr(ctx, S.x, S.y, S.w, S.h, 20); ctx.stroke();
    HP.icon(ctx, "search", S.x + 26, S.y + 20, 20, "#5B6B76");
    text(ctx, sq.q || "Cari di " + V.addr[V.addr.length - 1], S.x + 48, S.y + 27, 20, { weight: sq.q ? 700 : 500, color: sq.q ? C.ink : "#8A99A3" });
    if (sq.focus && sq.caret) { ctx.font = "700 20px Inter"; ctx.fillStyle = C.ink; ctx.fillRect(S.x + 50 + (sq.q ? ctx.measureText(sq.q).width : 0), S.y + 9, 2, 22); }
    ctx.fillStyle = "#DDE5EA"; ctx.fillRect(WIN.x, BODY - 1, WIN.w, 1.5);
    // daftar tempat
    ctx.fillStyle = "#F6F8FA"; ctx.fillRect(WIN.x + 1, BODY, SIDE - 1, WIN.y + WIN.h - BODY - 16);
    text(ctx, "Laptop", WIN.x + 26, BODY + 36, 19, { weight: 800, color: "#8A99A3" });
    ROOTS.forEach((n, i) => { const r = G.side(i), on = !st.results && V.side === i;
      if (on || st.sideHl === i) { ctx.fillStyle = st.sideHl === i ? "#FFF3D6" : "#DCE9F7"; rr(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill(); }
      fileIcon(ctx, "folder", r.x + 26, r.y + 23, 26); text(ctx, n, r.x + 52, r.y + 30, 21, { weight: on ? 800 : 600, color: on ? BLUE : C.ink }); });
    ctx.fillStyle = "#DDE5EA"; ctx.fillRect(MAIN.x, BODY, 1.5, MAIN.h + 34);
    // isi
    if (st.results) {
      text(ctx, "Nama", MAIN.x + 40, MAIN.y + 44, 19, { weight: 800, color: "#8A99A3" }); text(ctx, "Lokasi", MAIN.x + 520, MAIN.y + 44, 19, { weight: 800, color: "#8A99A3" });
      st.results.forEach((r, i) => { const y = MAIN.y + 64 + i * 76;
        if (st.sel === i) { ctx.fillStyle = SEL; rr(ctx, MAIN.x + 20, y, MAIN.w - 40, 66, 10); ctx.fill(); ctx.strokeStyle = SELLINE; ctx.lineWidth = 2; rr(ctx, MAIN.x + 20, y, MAIN.w - 40, 66, 10); ctx.stroke(); }
        fileIcon(ctx, r.k, MAIN.x + 62, y + 33, 44); text(ctx, r.n, MAIN.x + 100, y + 42, 24, { weight: 800 });
        text(ctx, r.loc, MAIN.x + 520, y + 42, 22, { weight: 700, color: r.hl ? GREEN : C.ink2 }); });
    } else items.forEach((it, i) => {
      if (st.hide === i) return; const g = G.tile(i);
      if (st.sel === i || st.drop === i) { ctx.fillStyle = st.drop === i ? "rgba(242,177,52,0.28)" : SEL; rr(ctx, g.x, g.y, g.w, g.h, 14); ctx.fill(); ctx.strokeStyle = st.drop === i ? C.accent : SELLINE; ctx.lineWidth = 2.5; rr(ctx, g.x, g.y, g.w, g.h, 14); ctx.stroke(); }
      fileIcon(ctx, it.k, g.cx, g.cy, 92, { open: st.drop === i });
      if (st.edit && st.edit.i === i) {
        const s = st.edit.text; ctx.font = "700 20px Inter"; const tw = Math.max(40, ctx.measureText(s).width);
        const bw = Math.min(176, tw + 20), bx = g.cx - bw / 2, by = g.y + 120; ctx.fillStyle = "#FFFFFF"; rr(ctx, bx, by, bw, 36, 6); ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5; rr(ctx, bx, by, bw, 36, 6); ctx.stroke();
        const fs = tw > 156 ? 20 * 156 / tw : 20, w2 = Math.min(tw, 156);
        if (st.edit.all) { ctx.fillStyle = BLUE; ctx.fillRect(g.cx - w2 / 2 - 2, by + 6, w2 + 4, 24); }
        text(ctx, s, g.cx, by + 25, fs, { align: "center", weight: 700, color: st.edit.all ? "#FFFFFF" : C.ink });
        if (!st.edit.all) { ctx.fillStyle = C.ink; ctx.fillRect(g.cx + w2 / 2 + 2, by + 7, 2, 22); }
      } else { const lines = wrap(ctx, it.n, 20, 700, 150).slice(0, 2); lines.forEach((ln, j) => text(ctx, ln, g.cx, g.y + 140 + j * 24, 20, { align: "center", weight: 700, color: C.ink })); }
    });
    const n = st.results ? st.results.length : items.length - (st.hide != null ? 1 : 0);
    text(ctx, n + " item", MAIN.x + 24, WIN.y + WIN.h - 12, 18, { weight: 700, color: "#8A99A3" });
    return area;
  }
  // menu klik kanan. items: ["Baru ›", …]; hl: indeks; sub: {at: indeks, items, hl}
  const MENU_W = 270, MENU_RH = 46;
  const menuRow = (x, y, i) => ({ x, y: y + 8 + i * MENU_RH, w: MENU_W, h: MENU_RH, cx: x + 90, cy: y + 8 + i * MENU_RH + MENU_RH / 2 });
  function menu(ctx, x, y, items, opt = {}) {
    const h = 16 + items.length * MENU_RH, u = opt.u == null ? 1 : ease(clamp(opt.u, 0, 1)); if (u <= 0) return;
    ctx.save(); ctx.globalAlpha = u; ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, MENU_W, h, 12); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = "#D5DEE4"; ctx.lineWidth = 1.5; rr(ctx, x, y, MENU_W, h, 12); ctx.stroke();
    items.forEach((s, i) => { const r = menuRow(x, y, i), sub = s.endsWith("›"), lab = sub ? s.slice(0, -1).trim() : s;
      if (opt.hl === i) { ctx.fillStyle = "#DCE9F7"; rr(ctx, x + 6, r.y + 2, MENU_W - 12, MENU_RH - 4, 8); ctx.fill(); }
      text(ctx, lab, x + 24, r.y + 31, 22, { weight: opt.hl === i ? 800 : 600, color: opt.hl === i ? BLUE : C.ink });
      if (sub) text(ctx, "›", x + MENU_W - 24, r.y + 31, 24, { align: "right", weight: 800, color: C.ink2 }); });
    ctx.restore();
  }
  // gesture: label kecil di dekat pointer (klik kanan, double click, drag)
  function gest(ctx, R, steps) { const s = steps[R.i]; if (!R.ptr || !s || !s.lbl || R.u < 0.35 || R.u >= 1) return; B.tag(ctx, R.ptr.x + 34, R.ptr.y + 40, s.lbl, { fill: C.ink, size: 22 }); }
  function cursor(ctx, R, opt = {}) { if (R.ptr) L.cursor(ctx, R.ptr.x, R.ptr.y, { click: R.click, down: opt.down }); }
  function keys(ctx, R) { if (R.key) L.keys(ctx, WIN.x + WIN.w / 2, 700, R.key.keys, { press: R.key.press, align: "center", size: 34 }); }
  const tileP = (i, dy = 0) => { const g = G.tile(i); return [g.cx + 10, g.cy + 10 + dy]; };

  // ---------- layar laptop (desktop + bilah tugas) ----------
  const TASK = [["Browser", "globe", "#5B6B76"], ["File", "folder", "#E0A23B"], ["Dokumen", "mail", "#2F6FC0"], ["Lembar Kerja", "apps", "#2E9E5B"]];
  const taskIcon = i => ({ x: WIN.x + WIN.w / 2 - 150 + i * 100, y: WIN.y + WIN.h - 40 });
  function desktop(ctx, opt = {}) {
    ctx.save(); rr(ctx, WIN.x, WIN.y, WIN.w, WIN.h, 16); ctx.clip();
    const g = ctx.createLinearGradient(0, WIN.y, 0, WIN.y + WIN.h); g.addColorStop(0, "#BFDCE8"); g.addColorStop(1, "#DCEBDD"); ctx.fillStyle = g; ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fillRect(WIN.x, WIN.y + WIN.h - 80, WIN.w, 80);
    TASK.forEach(([n, ic, col], i) => { const p = taskIcon(i); if (opt.hl === i) { ctx.fillStyle = "rgba(242,177,52,0.5)"; rr(ctx, p.x - 36, p.y - 36, 72, 72, 18); ctx.fill(); }
      if (i === 1 || i === 2) { ctx.fillStyle = "#FFFFFF"; rr(ctx, p.x - 28, p.y - 28, 56, 56, 14); ctx.fill(); fileIcon(ctx, i === 1 ? "folder" : "doc", p.x, p.y + 2, 44); }
      else HP.appIcon(ctx, p.x, p.y, 56, col, ic); });
    text(ctx, "10.40", WIN.x + WIN.w - 30, WIN.y + WIN.h - 32, 22, { align: "right", weight: 700, color: C.ink2 });
    ctx.restore(); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, WIN.x, WIN.y, WIN.w, WIN.h, 16); ctx.stroke();
  }

  // ---------- aplikasi Dokumen (pengolah kata) ----------
  const POEM = ["Ibu", "Ibu, kau bangun sebelum matahari,", "menyiapkan nasi dan senyum pagi.", "Tanganmu hangat seperti teh manis,", "doamu menemaniku ke sekolah."];
  function docApp(ctx, st = {}) {
    const area = L.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: (st.name || "Dokumen tanpa judul") + " — Dokumen", menus: ["File", "Edit", "Tampilan", "Sisipkan", "Format"], menuOn: st.menuOn, tools: ["B", "I", "U", "≡"] });
    ctx.fillStyle = "#E9EEF1"; ctx.fillRect(area.x + 1, area.y + 1, area.w - 2, area.h - 18);
    const px = WIN.x + 330, pw = 640; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(px, area.y + 24, pw, area.h - 40);
    const lines = POEM.concat(st.extra ? [st.extra] : []);
    lines.forEach((s, i) => text(ctx, s, px + 60, area.y + 90 + i * 50 + (i ? 16 : 0), i ? 26 : 34, { weight: i ? 600 : 900, color: C.ink }));
    if (st.status) { const a = st.statusU == null ? 1 : st.statusU; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.goodBg; rr(ctx, WIN.x + WIN.w - 280, WIN.y + WIN.h - 60, 250, 42, 21); ctx.fill();
      HP.icon(ctx, "check", WIN.x + WIN.w - 254, WIN.y + WIN.h - 39, 18, GREEN); text(ctx, st.status, WIN.x + WIN.w - 232, WIN.y + WIN.h - 32, 20, { weight: 800, color: GREEN }); ctx.restore(); }
    if (st.fileMenu) menu(ctx, WIN.x + 16, WIN.y + 88, FILE_MENU, { hl: st.fileHl, u: st.fileMenu });
    return area;
  }
  const FILE_MENU = ["Baru", "Buka…", "Simpan", "Simpan Sebagai…", "Cetak…"];
  const FILE_M = { x: WIN.x + 44, y: WIN.y + 66 };
  // kotak Simpan Sebagai. st: loc ("Download" | "Dokumen" | "Tugas Sekolah"), name, nameAll, caret, sideHl, rowHl, saveHl
  const DLG = { x: 300, y: 196, w: 940, h: 590 };
  const DLG_SIDE = ["Desktop", "Dokumen", "Download", "Gambar"];
  const DLG_LOC = { Download: { addr: ["Download"], rows: [["Formulir Lomba", "pdf"], ["stiker lucu", "img"]] },
    Dokumen: { addr: ["Dokumen"], rows: [["Tugas Sekolah", "folder"], ["Laporan IPA", "doc"], ["foto kelas", "img"], ["Ringkasan Sejarah", "doc"]] },
    "Tugas Sekolah": { addr: ["Dokumen", "Tugas Sekolah"], rows: [["Jadwal Piket 7A", "doc"]] } };
  const DG = { side: i => ({ x: DLG.x + 16, y: DLG.y + 130 + i * 50, w: 196, h: 44, cx: DLG.x + 100, cy: DLG.y + 152 + i * 50 }),
    row: i => ({ x: DLG.x + 240, y: DLG.y + 116 + i * 56, w: DLG.w - 260, h: 50, cx: DLG.x + 420, cy: DLG.y + 141 + i * 56 }),
    name: { x: DLG.x + 220, y: DLG.y + DLG.h - 128, w: 560, h: 50 }, save: { x: DLG.x + DLG.w - 200, y: DLG.y + DLG.h - 66, w: 170, h: 48 }, cancel: { x: DLG.x + DLG.w - 384, y: DLG.y + DLG.h - 66, w: 170, h: 48 } };
  function saveDlg(ctx, st = {}) {
    ctx.fillStyle = "rgba(15,22,28,0.35)"; rr(ctx, WIN.x, WIN.y, WIN.w, WIN.h, 16); ctx.fill();
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.3)"; ctx.shadowBlur = 30; ctx.fillStyle = "#FFFFFF"; rr(ctx, DLG.x, DLG.y, DLG.w, DLG.h, 16); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#EEF2F5"; rr(ctx, DLG.x, DLG.y, DLG.w, 50, 16); ctx.fill(); ctx.fillRect(DLG.x, DLG.y + 30, DLG.w, 20);
    text(ctx, "Simpan Sebagai", DLG.x + DLG.w / 2, DLG.y + 34, 22, { align: "center", weight: 800, color: "#3D4B55" });
    const loc = DLG_LOC[st.loc || "Download"];
    ctx.fillStyle = st.addrHl ? "#FFF3D6" : "#F4F7F9"; rr(ctx, DLG.x + 20, DLG.y + 62, DLG.w - 40, 42, 10); ctx.fill(); if (st.addrHl) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, DLG.x + 20, DLG.y + 62, DLG.w - 40, 42, 10); ctx.stroke(); }
    text(ctx, "Simpan di:", DLG.x + 40, DLG.y + 91, 20, { weight: 700, color: C.ink2 });
    let ax = DLG.x + 150; loc.addr.forEach((c, i) => { fileIcon(ctx, "folder", ax + 12, DLG.y + 83, 22); text(ctx, c, ax + 30, DLG.y + 91, 21, { weight: 800 }); ctx.font = "800 21px Inter"; ax += ctx.measureText(c).width + 44; if (i < loc.addr.length - 1) text(ctx, "›", ax - 10, DLG.y + 91, 22, { weight: 800, color: "#8A99A3" }); });
    ctx.fillStyle = "#F6F8FA"; ctx.fillRect(DLG.x + 1, DLG.y + 114, 224, DLG.h - 268);
    DLG_SIDE.forEach((n, i) => { const r = DG.side(i), on = (st.loc === "Tugas Sekolah" ? "Dokumen" : st.loc || "Download") === n;
      if (on || st.sideHl === i) { ctx.fillStyle = st.sideHl === i ? "#FFF3D6" : "#DCE9F7"; rr(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill(); }
      fileIcon(ctx, "folder", r.x + 24, r.y + 23, 24); text(ctx, n, r.x + 48, r.y + 30, 20, { weight: on ? 800 : 600, color: on ? BLUE : C.ink }); });
    loc.rows.forEach(([n, k], i) => { const r = DG.row(i), dim = k !== "folder";
      if (st.rowHl === i) { ctx.fillStyle = SEL; rr(ctx, r.x, r.y, r.w, r.h, 8); ctx.fill(); }
      ctx.save(); if (dim) ctx.globalAlpha = 0.45; fileIcon(ctx, k, r.x + 30, r.y + 25, 32); text(ctx, n, r.x + 62, r.y + 33, 22, { weight: 700 }); ctx.restore(); });
    ctx.fillStyle = "#DDE5EA"; ctx.fillRect(DLG.x, DLG.y + DLG.h - 152, DLG.w, 1.5);
    text(ctx, "Nama file:", DLG.x + 40, DG.name.y + 33, 22, { weight: 800 });
    const N = DG.name; ctx.fillStyle = "#FFFFFF"; rr(ctx, N.x, N.y, N.w, N.h, 10); ctx.fill(); ctx.strokeStyle = st.nameFocus ? BLUE : "#C9D4DB"; ctx.lineWidth = st.nameFocus ? 3 : 2; rr(ctx, N.x, N.y, N.w, N.h, 10); ctx.stroke();
    const nm = st.name == null ? "Dokumen tanpa judul" : st.name; ctx.font = "700 23px Inter"; const nw = ctx.measureText(nm).width;
    if (st.nameAll) { ctx.fillStyle = BLUE; ctx.fillRect(N.x + 16, N.y + 10, nw + 6, 30); }
    text(ctx, nm, N.x + 19, N.y + 33, 23, { weight: 700, color: st.nameAll ? "#FFFFFF" : C.ink });
    if (st.caret) { ctx.fillStyle = C.ink; ctx.fillRect(N.x + 21 + nw, N.y + 11, 2.5, 28); }
    HP.button(ctx, DG.cancel.x, DG.cancel.y, DG.cancel.w, DG.cancel.h, "Batal", { outline: true, r: 10, size: 21 });
    HP.button(ctx, DG.save.x, DG.save.y, DG.save.w, DG.save.h, "Simpan", { r: 10, size: 21, hl: st.saveHl });
  }
  const ctr = r => [r.x + r.w / 2, r.y + r.h / 2];

  // ---------- HP: aplikasi File ----------
  const CAT = [["Gambar", "photo", GREEN, "128"], ["Video", "camera", "#2E7E9A", "12"], ["Download", "download", BLUE, "9"], ["Dokumen", "folder", ORANGE, "15"]];
  const catBox = i => ({ x: 16 + (i % 2) * 172, y: 154 + Math.floor(i / 2) * 98, w: 156, h: 86 });
  function fHome(c, o = {}) {
    HP.header(c, "File", { action: "search" });
    text(c, "KATEGORI", 22, 136, 16, { weight: 800, color: "#5B6B76" });
    CAT.forEach(([n, ic, col, cnt], i) => { const b = catBox(i); c.fillStyle = o.hl === i ? "#FFF3D6" : "#FFFFFF"; rr(c, b.x, b.y, b.w, b.h, 16); c.fill();
      if (o.hl === i) { c.strokeStyle = C.accent; c.lineWidth = 2.5; rr(c, b.x, b.y, b.w, b.h, 16); c.stroke(); }
      c.fillStyle = col; c.beginPath(); c.arc(b.x + 32, b.y + 43, 20, 0, Math.PI * 2); c.fill(); HP.icon(c, ic, b.x + 32, b.y + 43, 22, "#FFFFFF");
      text(c, n, b.x + 62, b.y + 40, 19, { weight: 800, fit: 90 }); text(c, cnt + " file", b.x + 62, b.y + 64, 15, { weight: 600, color: "#5B6B76" }); });
    text(c, "PENYIMPANAN", 22, 380, 16, { weight: 800, color: "#5B6B76" });
    return HP.list(c, [{ label: "Penyimpanan HP", sub: "40 GB dari 64 GB terpakai", icon: "phone", arrow: true, hl: o.store }, { label: "Folder Kamera", sub: "Foto dan video dari kamera", icon: "camera", arrow: true, hl: o.cam }], { y: 394 });
  }
  const PHOTOS = ["#9CC9E0", "#F2C98A", "#A8D5B5", "#E8A9A0", "#C3B5E0", "#F0D58C", "#9FD0C8", "#D8B79A", "#B9CFE8"];
  function photo(c, x, y, s, i) { c.fillStyle = PHOTOS[i % PHOTOS.length]; rr(c, x, y, s, s, 8); c.fill(); c.fillStyle = "rgba(255,255,255,0.7)"; c.beginPath(); c.arc(x + s * 0.7, y + s * 0.3, s * 0.1, 0, Math.PI * 2); c.fill();
    c.fillStyle = "rgba(31,42,51,0.25)"; c.beginPath(); c.moveTo(x, y + s); c.lineTo(x + s * 0.4, y + s * 0.5); c.lineTo(x + s * 0.65, y + s * 0.75); c.lineTo(x + s * 0.8, y + s * 0.6); c.lineTo(x + s, y + s); c.closePath(); c.fill(); }
  function photoGrid(c, y0, n, title) { if (title) text(c, title, 20, y0 + 6, 17, { weight: 800, color: "#5B6B76" }); for (let i = 0; i < n; i++) photo(c, 14 + (i % 3) * 112, y0 + 22 + Math.floor(i / 3) * 112, 104, i); }
  function camFolder(c) { HP.header(c, "Kamera", { back: true, action: "more" }); text(c, "Penyimpanan HP › DCIM › Kamera", 20, 132, 15, { weight: 700, color: BLUE }); photoGrid(c, 146, 9, "9 foto"); }
  function galeri(c) { c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, HP.W, HP.H); text(c, "Galeri", 22, 84, 28, { weight: 900 }); text(c, "Foto", 22, 128, 18, { weight: 800, color: BLUE }); text(c, "Album", 90, 128, 18, { weight: 700, color: "#8A99A3" }); photoGrid(c, 146, 9, "Hari ini"); }
  const DL = (o = {}) => [{ label: "Jadwal Ujian.pdf", app: { color: RED, letter: "P" }, sub: "Hari ini · 210 KB", radio: o.sel ? o.pick : undefined, hl: o.hl },
    { label: "Formulir Lomba.pdf", app: { color: RED, letter: "P" }, sub: "Kemarin · 180 KB", radio: o.sel ? false : undefined },
    { label: "stiker lucu.jpg", app: { color: GREEN, icon: "photo" }, sub: "2 hari lalu · 90 KB", radio: o.sel ? false : undefined },
    { label: "Materi IPA bab 3.pdf", app: { color: RED, letter: "P" }, sub: "Senin · 1,2 MB", radio: o.sel ? false : undefined }];
  function dlPage(c, o = {}) {
    if (o.sel) { HP.header(c, "1 dipilih", { back: true }); } else HP.header(c, "Download", { back: true, action: "more" });
    text(c, "Penyimpanan HP › Download", 20, 132, 15, { weight: 700, color: BLUE });
    const rows = HP.list(c, (o.moved ? DL(o).slice(1) : DL(o)), { y: 146 });
    if (o.sel) { c.fillStyle = "#FFFFFF"; c.fillRect(0, 630, HP.W, 82); c.fillStyle = "#E3E9EE"; c.fillRect(0, 630, HP.W, 1.5);
      [["Pindahkan", "folder"], ["Salin", "apps"], ["Bagikan", "chat"], ["Hapus", "trash"]].forEach(([s, ic], i) => { const x = 45 + i * 90, hl = o.actHl === i;
        if (hl) { c.fillStyle = "#FFF3D6"; rr(c, x - 40, 636, 80, 70, 12); c.fill(); }
        HP.icon(c, ic, x, 660, 24, i === 3 ? RED : C.ink); text(c, s, x, 694, 14, { align: "center", weight: 700, color: i === 3 ? RED : C.ink, fit: 82 }); }); }
    return rows;
  }
  const DOKF = (o = {}) => [{ label: "Pramuka", app: { color: "#E8AE3C", icon: "folder" }, sub: "6 file" }, { label: "Resep Ibu", app: { color: "#E8AE3C", icon: "folder" }, sub: "3 file" }]
    .concat(o.sekolah ? [{ label: "Sekolah", app: { color: "#E8AE3C", icon: "folder" }, sub: o.n ? o.n + " file" : "Kosong", hl: o.hl }] : []);
  function dokPage(c, o = {}) {
    HP.header(c, o.pick ? "Pindahkan ke" : "Dokumen", { back: true, action: o.pick ? null : "more" });
    text(c, "Penyimpanan HP › Dokumen", 20, 132, 15, { weight: 700, color: BLUE });
    const rows = HP.list(c, DOKF(o), { y: 146 });
    if (o.pick) { c.fillStyle = "#FFFFFF"; c.fillRect(0, 622, HP.W, 90); HP.button(c, 30, 640, 300, 54, "Pindahkan ke sini", { fill: o.dim ? "#9FB6CC" : BLUE, hl: o.btnHl }); }
    else { c.fillStyle = BLUE; c.beginPath(); c.arc(300, 640, 32, 0, Math.PI * 2); c.fill(); HP.icon(c, "plus", 300, 640, 26, "#FFFFFF");
      if (o.fabHl) { c.strokeStyle = C.accent; c.lineWidth = 4; c.beginPath(); c.arc(300, 640, 38, 0, Math.PI * 2); c.stroke(); } }
    return rows;
  }
  function sekolahPage(c, o = {}) { HP.header(c, o.pick ? "Pindahkan ke" : "Sekolah", { back: true });
    text(c, "Penyimpanan HP › Dokumen › Sekolah", 20, 132, 15, { weight: 700, color: BLUE });
    if (o.has) HP.list(c, [{ label: "Jadwal Ujian.pdf", app: { color: RED, letter: "P" }, sub: "Hari ini · 210 KB", hl: true }], { y: 146 });
    else text(c, "Folder ini kosong", 180, 300, 19, { align: "center", weight: 700, color: "#8A99A3" });
    if (o.pick) { c.fillStyle = "#FFFFFF"; c.fillRect(0, 622, HP.W, 90); HP.button(c, 30, 640, 300, 54, "Pindahkan ke sini", { hl: o.btnHl }); } }
  function newFolderDlg(c, name, o = {}) {
    const d = HP.dialog(c, { title: "Folder baru", body: " ", buttons: ["Batal", "Buat"], hl: o.ok ? 1 : null, u: o.u });
    if (!d.box) return d; const bx = d.box, fy = bx.y + 74;
    c.fillStyle = "#FFFFFF"; rr(c, bx.x + 24, fy, bx.w - 48, 46, 10); c.fill(); c.strokeStyle = BLUE; c.lineWidth = 2.5; rr(c, bx.x + 24, fy, bx.w - 48, 46, 10); c.stroke();
    text(c, name || "Nama folder", bx.x + 40, fy + 30, 20, { weight: name ? 700 : 500, color: name ? C.ink : "#8A99A3" });
    if (o.caret) { c.font = "700 20px Inter"; c.fillStyle = C.ink; c.fillRect(bx.x + 42 + (name ? c.measureText(name).width : 0), fy + 10, 2, 26); }
    return d;
  }
  const NFD = () => B.measure(m => newFolderDlg(m, "", {}));

  // ---------- adegan ----------
  B.art.tujuan = (ctx, l) => { ctx.save(); ctx.translate(1130, 230); fileIcon(ctx, "folder", 150, 130, 220); fileIcon(ctx, "doc", 40, 360, 100); fileIcon(ctx, "img", 150, 370, 100); fileIcon(ctx, "music", 260, 360, 100); ctx.restore();
    B.phone(ctx, c => fHome(c), { cx: 1600, cy: 480, h: 560 }); };
  B.art.coba = (ctx, l) => { fileIcon(ctx, "folder", 1460, 420, 260); B.tag(ctx, 1460, 560, "Kelas 7A", { align: "center", size: 30, fill: C.kiko }); };
  B.art.periksa = (ctx, l) => { ctx.save(); ctx.translate(30, 170); ctx.scale(0.64, 0.64); ctx.translate(-WIN.x, -WIN.y); fm(ctx, { view: "tugas", puisi: true, sel: 1 }); ctx.restore(); };

  Object.assign(K.SCENES, {
    fm_buka(ctx, b, l) {
      const span = B.spanOf(b), p = taskIcon(1);
      const ST = [{ to: [900, 500], d: 0.6 }, { to: [p.x + 6, p.y + 6], d: 1 }, { to: [p.x + 6, p.y + 6], click: true, set: { open: true }, d: 0.8, lbl: "klik" }, { anim: "grow", d: 0.8 }, { wait: 1, d: 1.6 }];
      const R = HP.run({}, ST, l, span);
      desktop(ctx, { hl: R.i >= 1 && !R.st.open ? 1 : null });
      if (R.st.open) { const g = ease(R.st.grow == null ? 0 : R.st.grow); ctx.save(); ctx.globalAlpha = Math.min(1, g * 1.5);
        ctx.translate(lerp(p.x, WIN.x + WIN.w / 2, g), lerp(p.y, WIN.y + WIN.h / 2, g)); ctx.scale(lerp(0.1, 1, g), lerp(0.1, 1, g)); ctx.translate(-(WIN.x + WIN.w / 2), -(WIN.y + WIN.h / 2));
        fm(ctx, { view: "root" }); ctx.restore(); }
      cursor(ctx, R); gest(ctx, R, ST);
      const y = B.steps(ctx, "LANGKAH", ["Cari ikon map kuning di bawah layar.", "Klik ikon itu satu kali."], B.stepAt(l, span, [0.3, 0.6]));
      if (!R.st.open) { L.callout(ctx, 1050, 520, "Pengelola file", p.x, p.y - 34, { size: 26 }); }
      else B.notes(ctx, y, [B.tip("Di laptop lain namanya bisa berbeda, tetapi ikonnya mirip: map kuning.")]);
    },
    fm_kenal(ctx, b, l) {
      const a = b.audio || b.dur, k = l > a * 0.72 ? 2 : l > a * 0.42 ? 1 : l > a * 0.08 ? 0 : -1;
      fm(ctx, { view: "root" });
      const AREAS = [[WIN.x + 6, BODY + 6, SIDE - 12, 372], [MAIN.x + 10, MAIN.y + 8, MAIN.w - 20, 230], [G.addr.x - 6, G.addr.y - 6, G.addr.w + 12, G.addr.h + 12]];
      const NAMES = ["Daftar tempat", "Isi tempat yang dibuka", "Alamat: kamu sedang di mana"];
      AREAS.forEach(([x, y, w, h], i) => { if (i > k) return; const on = i === k;
        ctx.strokeStyle = on ? C.accent : "rgba(242,177,52,0.45)"; ctx.lineWidth = on ? 5 : 3; rr(ctx, x, y, w, h, 12); ctx.stroke();
        const bx = i === 2 ? x + w - 10 : x + w - 18, by = i === 2 ? y + h / 2 : y + 22;
        ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(bx, by, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), bx, by + 8, 22, { align: "center", weight: 900, color: "#FFFFFF" }); });
      card(ctx, 1450, 122, 370, 70 + 3 * 84, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "BAGIAN JENDELA", 1474, 166, 24, { weight: 900, color: C.accentDark });
      NAMES.forEach((s, i) => { const y = 196 + i * 84, on = i <= k; if (i === k) { ctx.fillStyle = "#FFF3D6"; rr(ctx, 1460, y - 6, 350, 74, 10); ctx.fill(); }
        ctx.fillStyle = on ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(1490, y + 30, 18, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 1490, y + 38, 20, { align: "center", weight: 900, color: "#FFFFFF" });
        const lines = wrap(ctx, s, 23, 800, 280); lines.forEach((ln, j) => text(ctx, ln, 1522, y + 38 - (lines.length - 1) * 14 + j * 28, 23, { weight: 800, color: on ? C.ink : "#8A99A3" })); });
    },
    fm_double(ctx, b, l) {
      const span = B.spanOf(b), d = tileP(1);
      const ST = [{ to: [900, 650], d: 0.4 }, { to: d, d: 0.9 }, { to: d, click: true, set: { sel: 1 }, d: 0.45, lbl: "double click" }, { to: d, click: true, set: { view: "dok", sel: null }, d: 0.45, lbl: "double click" }, { wait: 1, d: 1 },
        { to: [G.back.x + 6, G.back.y + 8], set: { backHl: true }, d: 1.2 }, { wait: 1, d: 1.2 }];
      const R = HP.run({ view: "root" }, ST, l, span), st = R.st;
      fm(ctx, { view: st.view, stage: "awal", sel: st.sel, backHl: st.backHl && R.i >= 6 });
      cursor(ctx, R); gest(ctx, R, ST);
      if (R.i >= 6) B.tag(ctx, G.back.x + 30, G.back.y + 36, "Kembali", { fill: C.ink });
      const y = B.steps(ctx, "LANGKAH", ["Arahkan pointer ke folder Dokumen.", "Double click: klik dua kali dengan cepat.", "Panah kiri atas: kembali."], B.stepAt(l, span, [0.2, 0.5, 0.75]));
      if (st.view === "dok") B.notes(ctx, y, [B.ok("Folder Dokumen terbuka.")]);
    },
    folder_baru(ctx, b, l) {
      const span = B.spanOf(b), E = G.empty, mx = E.x - 330, my = E.y - 240, sub = { x: mx + MENU_W - 6, y: my + 8 + 2 * MENU_RH - 8 };
      const ST = [{ to: [700, 700], d: 0.3 }, { to: [E.x, E.y], d: 0.9 }, { to: [E.x, E.y], click: true, set: { menu: 1 }, d: 0.7, lbl: "klik kanan" }, { wait: 1, d: 0.4 },
        { to: ctr(menuRow(mx, my, 2)), set: { hl: 2 }, d: 0.8 }, { set: { sub: true }, d: 0.3 }, { to: [sub.x + 40, menuRow(sub.x, sub.y, 0).cy], d: 0.8 },
        { to: [sub.x + 40, menuRow(sub.x, sub.y, 0).cy], click: true, set: { done: true }, d: 0.7, lbl: "klik" }, { wait: 1, d: 1.2 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      fm(ctx, { view: "dok", stage: st.done ? "folder" : "awal", sel: st.done ? 0 : null, edit: st.done ? { i: 0, text: "Folder baru", all: true } : null });
      if (st.menu && !st.done) { menu(ctx, mx, my, ["Tampilan ›", "Urutkan ›", "Baru ›", "Tempel", "Properti"], { hl: st.hl });
        if (st.sub) menu(ctx, sub.x, sub.y, ["Folder", "Dokumen", "Lembar Kerja"], { hl: R.i >= 6 ? 0 : null }); }
      cursor(ctx, R); gest(ctx, R, ST);
      const y = B.steps(ctx, "LANGKAH", ["Klik kanan di bagian yang kosong.", "Pilih Baru.", "Pilih Folder."], B.stepAt(l, span, [0.3, 0.55, 0.8]));
      if (B.after(b, l, 0.4)) B.notes(ctx, y, [B.tip("Di laptop lain: Folder baru, atau Buat folder.")]);
    },
    folder_nama(ctx, b, l) {
      const span = B.spanOf(b);
      const ST = [{ wait: 1, d: 1.4 }, { type: "Tugas Sekolah", field: "nm", d: 2 }, { wait: 1, d: 0.4 }, { key: ["Enter"], d: 0.8 }, { set: { done: true }, d: 0.1 }, { wait: 1, d: 1.3 }];
      const R = HP.run({}, ST, l, span), st = R.st, typing = st.nm != null;
      fm(ctx, { view: "dok", stage: st.done ? "named" : "folder", sel: 0, edit: st.done ? null : { i: 0, text: typing ? st.nm : "Folder baru", all: !typing } });
      keys(ctx, R);
      const g = G.tile(0); if (!typing) L.callout(ctx, g.x + 150, g.y + 230, "Nama tersorot biru: langsung ketik", g.cx, g.y + 138, { size: 24 });
      const y = B.steps(ctx, "LANGKAH", ["Ketik nama folder.", "Tekan Enter."], B.stepAt(l, span, [0.25, 0.7]));
      if (st.done) B.notes(ctx, y, [B.ok("Folder Tugas Sekolah sudah jadi.")]);
    },
    ganti_nama(ctx, b, l) {
      const span = B.spanOf(b), t = tileP(2), g = G.tile(2), mx = g.cx + 30, my = g.cy + 20;
      const ST = [{ to: [900, 700], d: 0.2 }, { to: t, d: 0.7 }, { to: t, click: true, set: { menu: 1, sel: 2 }, d: 0.6, lbl: "klik kanan" }, { to: ctr(menuRow(mx, my, 3)), set: { hl: 3 }, d: 0.7 },
        { to: ctr(menuRow(mx, my, 3)), click: true, set: { edit: true, menu: 0 }, d: 0.6 }, { wait: 1, d: 0.3 }, { type: "Jadwal Piket 7A", field: "nm", d: 1.8 }, { key: ["Enter"], d: 0.7 }, { set: { done: true }, d: 0.1 }, { wait: 1, d: 0.8 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      fm(ctx, { view: "dok", stage: st.done ? "renamed" : "named", sel: st.sel, edit: st.edit && !st.done ? { i: 2, text: st.nm != null ? st.nm : "asdf", all: st.nm == null } : null });
      if (st.menu) menu(ctx, mx, my, ["Buka", "Salin", "Potong", "Ganti nama", "Hapus", "Properti"], { hl: st.hl });
      cursor(ctx, R); gest(ctx, R, ST); keys(ctx, R);
      const y = B.steps(ctx, "LANGKAH", ["Klik kanan file asdf.", "Pilih Ganti nama.", "Ketik nama baru, tekan Enter."], B.stepAt(l, span, [0.2, 0.45, 0.62]));
      B.notes(ctx, y, [st.done ? B.ok("Nama baru menjelaskan isinya.") : B.warn("asdf: isinya apa, ya?")]);
    },
    drag_file(ctx, b, l) {
      const span = B.spanOf(b), f = tileP(2), tg = tileP(0, -6);
      const ST = [{ to: [900, 700], d: 0.2 }, { to: f, d: 0.8 }, { set: { down: true }, d: 0.5 }, { to: tg, d: 2, lbl: "drag" }, { wait: 1, d: 0.6 }, { set: { down: false, done: true }, d: 0.2 }, { wait: 1, d: 1.2 }];
      const R = HP.run({}, ST, l, span), st = R.st, p = R.ptr || { x: 0, y: 0 }, g0 = G.tile(0);
      const over = st.down && p.x > g0.x && p.x < g0.x + g0.w && p.y > g0.y && p.y < g0.y + g0.h;
      fm(ctx, { view: "dok", stage: st.done ? "moved" : "renamed", sel: st.down ? 2 : null, drop: over ? 0 : null });
      if (st.down) { const moving = Math.hypot(p.x - f[0], p.y - f[1]) > 10; if (moving) { fileIcon(ctx, "doc", p.x - 20, p.y - 30, 80, { alpha: 0.75 }); }
        if (over) B.tag(ctx, p.x + 30, p.y + 44, "Pindahkan ke Tugas Sekolah", { fill: BLUE }); }
      cursor(ctx, R, { down: st.down }); if (!over) gest(ctx, R, ST);
      const y = B.steps(ctx, "LANGKAH", ["Tekan dan tahan tombol kiri pada file.", "Geser ke folder Tugas Sekolah.", "Lepaskan saat folder tersorot."], B.stepAt(l, span, [0.25, 0.4, 0.75]));
      if (st.done) B.notes(ctx, y, [B.ok("File sudah pindah ke dalam folder.")]);
    },
    drag_cek(ctx, b, l) {
      const span = B.spanOf(b), d = tileP(0);
      const ST = [{ wait: 1, d: 1.2 }, { to: d, d: 0.8 }, { to: d, click: true, d: 0.4, lbl: "double click" }, { to: d, click: true, set: { view: "tugas" }, d: 0.4, lbl: "double click" }, { wait: 1, d: 2 }];
      const R = HP.run({ view: "dok" }, ST, l, span);
      fm(ctx, { view: R.st.view, stage: "moved", sel: R.st.view === "tugas" ? 0 : null });
      cursor(ctx, R); gest(ctx, R, ST);
      const y = B.steps(ctx, "PERIKSA", ["File hilang dari Dokumen.", "Buka folder Tugas Sekolah.", "File ada di dalamnya."], B.stepAt(l, span, [0.2, 0.5, 0.8]));
      if (R.st.view === "tugas") L.callout(ctx, 900, 560, "Alamat: Laptop › Dokumen › Tugas Sekolah", G.addr.x + 500, G.addr.y + 40, { size: 24, maxW: 460 });
    },
    simpan_menu(ctx, b, l) {
      const span = B.spanOf(b), m = menuRow(WIN.x + 16, WIN.y + 88, 3);
      const ST = [{ to: [800, 600], d: 0.8 }, { to: [FILE_M.x, FILE_M.y], d: 1 }, { to: [FILE_M.x, FILE_M.y], click: true, set: { fm: 1 }, d: 0.6, lbl: "klik" }, { to: [m.x + 120, m.cy], d: 0.9 }, { to: [m.x + 120, m.cy], click: true, set: { dlg: true }, d: 0.6, lbl: "klik" }, { wait: 1, d: 1 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      docApp(ctx, { menuOn: st.fm && !st.dlg ? "File" : null, fileMenu: st.fm && !st.dlg ? 1 : 0, fileHl: R.i >= 3 ? 3 : null });
      if (st.dlg) saveDlg(ctx, {});
      cursor(ctx, R); gest(ctx, R, ST);
      const y = B.steps(ctx, "LANGKAH", ["Klik menu File.", "Pilih Simpan Sebagai."], B.stepAt(l, span, [0.4, 0.75]));
      B.notes(ctx, y, [B.tip("Simpan Sebagai dipakai saat menyimpan pertama kali atau dengan nama baru.")]);
    },
    simpan_lokasi(ctx, b, l) {
      const span = B.spanOf(b), sd = DG.side(1), r0 = DG.row(0);
      const ST = [{ to: [700, 500], d: 0.3 }, { wait: 1, d: 0.9, set: { addrHl: true } }, { to: [sd.cx, sd.cy], set: { addrHl: false }, d: 0.9 }, { to: [sd.cx, sd.cy], click: true, set: { loc: "Dokumen" }, d: 0.6, lbl: "klik" },
        { to: [r0.cx, r0.cy], d: 0.8 }, { to: [r0.cx, r0.cy], click: true, set: { rowHl: 0 }, d: 0.4, lbl: "double click" }, { to: [r0.cx, r0.cy], click: true, set: { loc: "Tugas Sekolah", rowHl: null }, d: 0.4, lbl: "double click" }, { wait: 1, d: 0.6, set: { addrHl: true } }];
      const R = HP.run({ loc: "Download" }, ST, l, span), st = R.st;
      docApp(ctx, {}); saveDlg(ctx, { loc: st.loc, rowHl: st.rowHl, addrHl: st.addrHl });
      cursor(ctx, R); gest(ctx, R, ST);
      const y = B.steps(ctx, "PERTANYAAN 1: DI MANA?", ["Lihat baris Simpan di.", "Klik Dokumen di kiri.", "Double click Tugas Sekolah."], B.stepAt(l, span, [0.25, 0.45, 0.85]));
      if (R.i < 2) B.notes(ctx, y, [B.warn("Sekarang: Download. Bukan tempat yang kita mau.")]);
      else if (st.loc === "Tugas Sekolah") B.notes(ctx, y, [B.ok("Simpan di: Dokumen › Tugas Sekolah")]);
    },
    simpan_nama(ctx, b, l) {
      const span = B.spanOf(b), N = DG.name;
      const ST = [{ to: [N.x + 200, N.y + 25], d: 0.9 }, { to: [N.x + 200, N.y + 25], click: true, set: { focus: true, all: true }, d: 0.6, lbl: "klik" }, { wait: 1, d: 0.3 }, { type: "Puisi Ibu Dito", field: "nm", d: 1.8 },
        { to: ctr(DG.save), d: 0.8 }, { to: ctr(DG.save), click: true, set: { saved: true }, d: 0.6, lbl: "klik" }, { wait: 1, d: 1.6 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      docApp(ctx, { name: st.saved ? "Puisi Ibu Dito" : null });
      if (!st.saved) saveDlg(ctx, { loc: "Tugas Sekolah", name: st.nm != null ? st.nm : "Dokumen tanpa judul", nameAll: st.all && st.nm == null, nameFocus: st.focus, caret: st.nm != null, saveHl: R.i >= 4 });
      else L.callout(ctx, 760, 300, "Judul jendela berubah", WIN.x + WIN.w / 2, WIN.y + 26, { size: 26 });
      cursor(ctx, R); gest(ctx, R, ST);
      const y = B.steps(ctx, "PERTANYAAN 2: NAMANYA?", ["Klik kotak Nama file.", "Ketik Puisi Ibu Dito.", "Klik Simpan."], B.stepAt(l, span, [0.2, 0.5, 0.75]));
      if (st.saved) B.notes(ctx, y, [B.ok("Tersimpan di Dokumen › Tugas Sekolah.")]);
    },
    simpan_lagi(ctx, b, l) {
      const span = B.spanOf(b), extra = "Terima kasih, Ibu.";
      const ST = [{ wait: 1, d: 0.4 }, { type: extra, field: "ex", d: 1.6 }, { wait: 1, d: 0.3 }, { key: ["Ctrl", "S"], d: 1.2 }, { anim: "toast", d: 1.4 }, { wait: 1, d: 0.8 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      docApp(ctx, { name: "Puisi Ibu Dito", extra: st.ex, status: st.toast != null ? "Tersimpan 10.42" : null, statusU: st.toast != null ? Math.min(1, st.toast * 3) : 1 });
      if (R.key) L.keys(ctx, WIN.x + WIN.w / 2, 600, R.key.keys, { press: R.key.press, align: "center", size: 40 });
      const y = B.steps(ctx, "SERING-SERING SAVE", ["Tambah tulisan.", "Tekan Ctrl dan S bersamaan.", "Tersimpan di tempat yang sama."], B.stepAt(l, span, [0.1, 0.45, 0.7]));
      B.notes(ctx, y, [B.tip("Di laptop Mac: tombol Command dan S.")]);
    },
    cari(ctx, b, l) {
      const span = B.spanOf(b), S = G.search;
      const ST = [{ to: [900, 600], d: 0.3 }, { to: [S.x + 200, S.y + 22], d: 0.9 }, { to: [S.x + 200, S.y + 22], click: true, set: { focus: true }, d: 0.6, lbl: "klik" }, { type: "puisi", field: "q", d: 1.4 }, { key: ["Enter"], d: 0.8 }, { set: { res: true }, d: 0.1 }, { wait: 1, d: 1 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      fm(ctx, { view: "root", search: { q: st.q || "", focus: st.focus, caret: st.focus && !st.res }, results: st.res ? RESULTS : null });
      cursor(ctx, R); gest(ctx, R, ST); keys(ctx, R);
      const y = B.steps(ctx, "LANGKAH", ["Klik kotak search.", "Ketik sebagian nama: puisi.", "Tekan Enter."], B.stepAt(l, span, [0.3, 0.55, 0.8]));
      B.notes(ctx, y, [B.tip("Cari dari Laptop supaya semua folder ikut diperiksa.")]);
    },
    cari_hasil(ctx, b, l) {
      const span = B.spanOf(b), rp = [MAIN.x + 260, MAIN.y + 100];
      const ST = [{ wait: 1, d: 1.6 }, { to: rp, d: 0.9 }, { to: rp, click: true, set: { sel: 0 }, d: 0.45, lbl: "double click" }, { to: rp, click: true, set: { open: true }, d: 0.45, lbl: "double click" }, { wait: 1, d: 1.6 }];
      const R = HP.run({ pointer: { x: 1000, y: 700 } }, ST, l, span), st = R.st;
      if (st.open) docApp(ctx, { name: "Puisi Ibu Dito", extra: "Terima kasih, Ibu." });
      else fm(ctx, { view: "root", search: { q: "puisi" }, results: RESULTS.map((r, i) => ({ ...r, hl: i === 0 && B.after(b, l, 0.25) })), sel: st.sel });
      cursor(ctx, R); gest(ctx, R, ST);
      if (!st.open && B.after(b, l, 0.25)) L.callout(ctx, 860, 520, "Lokasinya: Dokumen › Tugas Sekolah", MAIN.x + 640, MAIN.y + 100, { size: 24, maxW: 440 });
      B.steps(ctx, "HASIL", ["Lihat nama dan lokasinya.", "Double click untuk membuka."], B.stepAt(l, span, [0.3, 0.8]));
    },
    // ---------- HP ----------
    hp_file(ctx, b, l) {
      const span = B.spanOf(b), a = b.audio || b.dur, hl = l > a * 0.35 ? (l > a * 0.7 ? 3 : l > a * 0.52 ? 2 : 0) : null;
      const R = HP.run({ scr: "home" }, [{ wait: 1, d: 0.3 }, { tap: [180 + 90, 354], set: { scr: "file" }, d: 1 }, { wait: 1, d: 3 }], l, span);
      const HOME = [{ name: "Kamera", color: "#2E7E9A", icon: "camera" }, { name: "Galeri", color: "#5FA8D3", icon: "photo" }, { name: "Obrolan", color: "#4C9BE0", icon: "chat" }, { name: "Browser", color: "#5B6B76", icon: "globe" },
        { name: "Pengaturan", color: "#5B6B76", icon: "gear" }, { name: "Toko Aplikasi", color: GREEN, icon: "store" }, { name: "File", color: "#E0A23B", icon: "folder" }, { name: "Kalkulator", color: "#7B8B95", icon: "calc" }];
      const draw = c => { if (R.st.scr === "home") HP.home(c, HOME, { hl: "File" }); else fHome(c, { hl }); B.tapDraw(c, R); };
      B.show(ctx, draw, R.st.scr === "home" ? { u: 0, v: 290, w: 360, h: 130 } : { u: 0, v: 110, w: 360, h: 250 });
      const y = B.steps(ctx, "APLIKASI FILE", ["Tap ikon map: File.", "Kategori: Gambar, Download, Dokumen.", "Penyimpanan HP: semua folder."], B.stepAt(l, span, [0.25, 0.5, 0.85]));
      B.notes(ctx, y, [B.tip("Di HP lain: Pengelola File, atau File Saya.")]);
    },
    hp_galeri(ctx, b, l) {
      B.phone(ctx, c => camFolder(c), { cx: 520, cy: 500, h: 610 });
      if (B.after(b, l, 0.35)) { B.phone(ctx, c => galeri(c), { cx: 1080, cy: 500, h: 610 });
        ctx.strokeStyle = C.accent; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(720, 470); ctx.lineTo(870, 470); ctx.stroke(); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(880, 470); ctx.lineTo(858, 454); ctx.lineTo(858, 486); ctx.fill();
        B.tag(ctx, 795, 420, "foto yang sama", { align: "center", fill: C.ink }); }
      B.tag(ctx, 520, 132, "Aplikasi File: folder Kamera", { align: "center", fill: "#E0A23B" }); if (B.after(b, l, 0.35)) B.tag(ctx, 1080, 132, "Aplikasi Galeri", { align: "center", fill: "#5FA8D3" });
      B.notes(ctx, 100, [{ s: "Setiap foto adalah satu file." }, B.after(b, l, 0.6) && B.ok("Galeri hanya menampilkan file foto.")]);
    },
    hp_download(ctx, b, l) {
      const span = B.spanOf(b), R = HP.run({ scr: "file" }, [{ wait: 1, d: 0.6 }, { tap: [catBox(2).x + 78, catBox(2).y + 43], set: { scr: "dl" }, d: 1 }, { wait: 1, d: 2.4 }], l, span);
      const draw = c => { if (R.st.scr === "file") fHome(c, { hl: R.i >= 1 ? 2 : null }); else dlPage(c, { hl: B.after(b, l, 0.6) }); B.tapDraw(c, R); };
      B.show(ctx, draw, R.st.scr === "file" ? { u: 0, v: 130, w: 360, h: 230 } : { u: 0, v: 110, w: 360, h: 250 });
      const y = B.steps(ctx, "LANGKAH", ["Tap Download.", "Temukan Jadwal Ujian."], B.stepAt(l, span, [0.3, 0.6]));
      B.notes(ctx, y, [B.tip("File dari browser dan grup kelas biasanya masuk ke sini.")]);
    },
    hp_folder(ctx, b, l) {
      const span = B.spanOf(b), d = NFD(), ok = d.buttons[1];
      const ST = [{ wait: 1, d: 0.4 }, { tap: [300, 640], set: { dlg: true }, d: 1 }, { wait: 1, d: 0.3 }, { type: "Sekolah", field: "nm", d: 1.4 }, { tap: [ok.cx, ok.cy], set: { done: true }, d: 1 }, { wait: 1, d: 1.6 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      const draw = c => { dokPage(c, { sekolah: st.done, hl: st.done, fabHl: R.i === 1 }); if (st.dlg && !st.done) newFolderDlg(c, st.nm || "", { caret: true, ok: R.i >= 4 }); B.tapDraw(c, R); };
      const src = st.dlg && !st.done ? { u: 0, v: d.box.y - 10, w: 360, h: d.box.h + 20 } : st.done ? { u: 0, v: 110, w: 360, h: 300 } : { u: 120, v: 560, w: 240, h: 150 };
      B.show(ctx, draw, src);
      const y = B.steps(ctx, "LANGKAH", ["Buka Dokumen, tap tanda tambah.", "Ketik nama: Sekolah.", "Tap Buat."], B.stepAt(l, span, [0.25, 0.55, 0.75]));
      if (st.done) B.notes(ctx, y, [B.ok("Folder Sekolah sudah jadi.")]);
    },
    hp_pindah(ctx, b, l) {
      const span = B.spanOf(b), rows = B.rowsOf(DL({ sel: true }), { y: 146 }), dr = B.rowsOf(DOKF({ sekolah: true }), { y: 146 });
      const ST = [{ tap: B.tapRow(rows, 0), set: { sel: true }, d: 1.2, lbl: "tekan lama" }, { wait: 1, d: 0.2 }, { tap: [45, 668], set: { scr: "pick" }, d: 0.9 }, { tap: B.tapRow(dr, 2), set: { scr: "sek" }, d: 0.9 }, { tap: [180, 667], set: { scr: "done" }, d: 0.9 }, { wait: 1, d: 1.2 }];
      const R = HP.run({ scr: "dl" }, ST, l, span), st = R.st;
      const draw = c => {
        if (st.scr === "dl") dlPage(c, { sel: st.sel, pick: true, hl: true, actHl: R.i === 2 ? 0 : null });
        else if (st.scr === "pick") dokPage(c, { pick: true, sekolah: true, hl: R.i === 3, dim: true });
        else if (st.scr === "sek") sekolahPage(c, { pick: true, btnHl: R.i === 4 });
        else sekolahPage(c, { has: true });
        if (R.tap) HP.tap(c, R.tap.x, R.tap.y, R.i === 0 ? Math.min(R.tap.u, 0.44) : R.tap.u, { r: R.i === 0 ? 24 + R.u * 8 : 24 });
      };
      const src = st.scr === "dl" ? (st.sel ? { u: 0, v: 610, w: 360, h: 102 } : { u: 0, v: 100, w: 360, h: 200 }) : st.scr === "pick" ? { u: 0, v: 110, w: 360, h: 270 } : st.scr === "sek" ? { u: 0, v: 560, w: 360, h: 150 } : { u: 0, v: 100, w: 360, h: 160 };
      const { ph } = B.show(ctx, draw, src);
      if (R.i === 0 && R.u > 0.3) { const p = ph.at(150, rows[0].cy); B.tag(ctx, p.x + 40, p.y + 30, "tekan lama", { fill: C.ink }); }
      const y = B.steps(ctx, "LANGKAH", ["Tekan lama Jadwal Ujian.", "Tap Pindahkan.", "Buka folder Sekolah.", "Tap Pindahkan ke sini."], B.stepAt(l, span, [0.2, 0.36, 0.52, 0.7]));
      if (st.scr === "done") B.notes(ctx, y, [B.ok("Jadwal Ujian sekarang di Dokumen › Sekolah.")]);
    },
    // ---------- periksa: kesalahan ----------
    salah_lokasi(ctx, b, l) {
      const span = B.spanOf(b), sv = ctr(DG.save);
      const ST = [{ to: [800, 500], d: 0.3 }, { to: sv, d: 0.8 }, { to: sv, click: true, set: { saved: true }, d: 0.6, lbl: "langsung klik" }, { wait: 1, d: 1.2 }, { set: { back: true }, d: 0.1 }, { wait: 1, d: 2 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      ctx.save(); ctx.translate(110, 122); ctx.scale(0.62, 0.62); ctx.translate(-110, -122);
      docApp(ctx, { name: st.saved ? "Laporan Pramuka" : null }); if (!st.saved || st.back) saveDlg(ctx, { loc: "Download", name: "Laporan Pramuka", addrHl: st.back });
      if (R.ptr) L.cursor(ctx, R.ptr.x, R.ptr.y, { click: R.click, size: 2 }); ctx.restore();
      card(ctx, 960, 140, 860, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 1: TIDAK MELIHAT FOLDERNYA", 1390, 200, 26, { align: "center", weight: 900, color: RED, fit: 820 });
      B.badge(ctx, 990, 240, false, "Langsung klik Simpan. File masuk ke Download, bukan ke folder tugas.", { w: 800, h: 110, size: 26 });
      if (st.back) B.badge(ctx, 990, 370, true, "Sebelum klik Simpan, baca baris Simpan di.", { w: 800, h: 90, size: 26 });
      if (B.after(b, l, 0.8)) B.badge(ctx, 990, 480, true, "Sudah telanjur? Cari namanya, lalu drag ke folder yang benar.", { w: 800, h: 110, size: 26 });
      const lx = 110 + (DLG.x - 110) * 0.62, ly = 122 + (DLG.y + 62 - 122) * 0.62;
      if (st.back) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, lx + 6, ly - 4, (DLG.w - 40) * 0.62 + 8, 42 * 0.62 + 8, 10); ctx.stroke(); }
    },
    salah_lambat(ctx, b, l) {
      const span = B.spanOf(b), d = tileP(0);
      const ST = [{ to: [700, 700], d: 0.2 }, { to: d, d: 0.7 }, { to: d, click: true, set: { sel: 0 }, d: 0.6, lbl: "klik…" }, { wait: 1, d: 0.5 }, { set: { edit: true }, d: 0.1, lbl: "…klik" }, { wait: 1, d: 1 },
        { key: ["Esc"], d: 0.8 }, { set: { edit: false }, d: 0.1 }, { to: d, click: true, d: 0.35, lbl: "double click" }, { to: d, click: true, set: { open: true }, d: 0.35, lbl: "double click" }, { wait: 1, d: 1.2 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      ctx.save(); ctx.translate(110, 122); ctx.scale(0.62, 0.62); ctx.translate(-110, -122);
      fm(ctx, { view: st.open ? "tugas" : "dok", stage: "moved", sel: st.open ? null : st.sel, edit: st.edit ? { i: 0, text: "Tugas Sekolah", all: true } : null, puisi: true });
      if (R.ptr) L.cursor(ctx, R.ptr.x, R.ptr.y, { click: R.click, size: 2 }); ctx.restore();
      if (R.ptr && steps_lbl(ST, R)) B.tag(ctx, 110 + (R.ptr.x - 110) * 0.62 + 30, 122 + (R.ptr.y - 122) * 0.62 + 40, steps_lbl(ST, R), { fill: C.ink });
      if (R.key) L.keys(ctx, 520, 600, R.key.keys, { press: R.key.press, align: "center", size: 36 });
      card(ctx, 960, 140, 860, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 2: DOUBLE CLICK TERLALU LAMBAT", 1390, 200, 26, { align: "center", weight: 900, color: RED, fit: 820 });
      if (R.i >= 4) B.badge(ctx, 990, 240, false, "Dua klik yang lambat: nama folder malah bisa diganti.", { w: 800, h: 100, size: 26 });
      if (R.i >= 6) B.badge(ctx, 990, 360, true, "Tekan Esc supaya namanya tidak berubah.", { w: 800, h: 90, size: 26 });
      if (R.i >= 8) B.badge(ctx, 990, 470, true, "Klik dua kali lebih cepat: folder terbuka.", { w: 800, h: 90, size: 26 });
    },
    // ---------- penutup ----------
    hp_tutup(ctx, b, l) {}
  });
  function steps_lbl(ST, R) { const s = ST[R.i]; return s && s.lbl && R.u >= 0.2 && R.u < 1 ? s.lbl : (R.i === 5 && R.u < 0.8 ? "…klik" : null); }
  const RESULTS = [{ n: "Puisi Ibu Dito", k: "doc", loc: "Dokumen › Tugas Sekolah" }, { n: "contoh puisi", k: "pdf", loc: "Download" }];
})(typeof window !== "undefined" ? window : globalThis);
