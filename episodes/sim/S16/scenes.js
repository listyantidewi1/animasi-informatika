/* S16 Simulasi praktik: pengelola tugas generik di laptop dan menu Memori di HP (memakai layar.js, layar_hp.js, bantu.js).
   Laptop: jendela di kiri (x 110–1410, y 122–822), panel langkah di kanan. HP: HP besar di kiri, lup di tengah.
   Konsep dari E.2: proses, giliran prosesor (CPU %), wilayah RAM (memori). Semua angka dan nama aplikasi rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, HP = K.hp, B = K.bantu;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const { BLUE, RED, GREEN, ORANGE } = B;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };

  // ---------- data rekaan ----------
  const APPS = [{ n: "Browser (12 tab)", ic: "globe", col: "#5B6B76", cpu: 18, mem: 2140 }, { n: "Editor Foto", ic: "photo", col: "#5FA8D3", cpu: 4, mem: 690 },
    { n: "Lembar Kerja", ic: "apps", col: GREEN, cpu: 61, mem: 1380, hang: true }, { n: "Musik", ic: "music", col: "#8E6BBF", cpu: 1, mem: 180 }, { n: "Obrolan", ic: "chat", col: "#4C9BE0", cpu: 2, mem: 320 }];
  const SYS = [{ n: "Sistem", ic: "gear", col: "#7B8B95", cpu: 3, mem: 210 }, { n: "Layanan jaringan", ic: "wifi", col: "#7B8B95", cpu: 1, mem: 40 }, { n: "Antarmuka desktop", ic: "apps", col: "#7B8B95", cpu: 2, mem: 150 }];
  const fmtMem = m => m >= 1000 ? (Math.floor(m / 1000) + "." + String(m % 1000).padStart(3, "0")) + " MB" : m + " MB";

  // ---------- jendela Pengelola Tugas ----------
  const COL = { name: WIN.x + 30, status: WIN.x + 560, cpu: WIN.x + 1010, mem: WIN.x + 1260 };
  const HEAD_Y = WIN.y + 46 + 50, ROW0 = HEAD_Y + 84, RH = 44;
  // st: sort ("mem"), sel (nama), ended (Lembar Kerja diakhiri), hl ("cpu"|"mem"|"status"|"name"|"total"), sysHl, btnHl, dlg {name, u, hl}, memHl (judul kolom)
  function rowsOf(st) {
    let apps = APPS.filter(a => !(st.ended && a.hang)); if (st.sort === "mem") apps = apps.slice().sort((a, b) => b.mem - a.mem);
    const out = []; let y = ROW0;
    out.push({ group: "Aplikasi (" + apps.length + ")", y }); y += 40;
    apps.forEach(a => { out.push({ ...a, y }); y += RH; });
    y += 8; out.push({ group: "Proses sistem (" + SYS.length + ")", y }); y += 40;
    SYS.forEach(a => { out.push({ ...a, y, sys: true }); y += RH; });
    return out;
  }
  const rowY = (st, name) => { const r = rowsOf(st).find(r => r.n === name); return r ? r.y + RH / 2 : 0; };
  function heat(v, max) { const u = clamp(v / max, 0, 1); return `rgba(242,177,52,${0.08 + u * 0.55})`; }
  function tm(ctx, st = {}) {
    const area = L.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: "Pengelola Tugas" });
    const ty = WIN.y + 46; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(WIN.x + 1, ty, WIN.w - 2, 48);
    let tx = WIN.x + 30; ["Proses", "Kinerja", "Riwayat aplikasi", "Startup"].forEach((s, i) => { ctx.font = "700 21px Inter"; const w = ctx.measureText(s).width;
      text(ctx, s, tx, ty + 32, 21, { weight: i === 0 ? 800 : 600, color: i === 0 ? BLUE : "#5B6B76" }); if (i === 0) { ctx.fillStyle = BLUE; ctx.fillRect(tx, ty + 42, w, 4); } tx += w + 40; });
    ctx.fillStyle = "#DDE5EA"; ctx.fillRect(WIN.x, ty + 48, WIN.w, 1.5);
    const tot = st.ended ? { cpu: 31, mem: 72 } : { cpu: 92, mem: 89 };
    // judul kolom
    const hy = HEAD_Y; if (st.hl === "total") { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(COL.cpu - 150, hy + 2, 410, 76); }
    if (st.memHl) { ctx.fillStyle = "#FFF3D6"; rr(ctx, COL.mem - 150, hy + 4, 160, 72, 8); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, COL.mem - 150, hy + 4, 160, 72, 8); ctx.stroke(); }
    text(ctx, "Nama", COL.name + 4, hy + 66, 20, { weight: 800, color: "#5B6B76" }); text(ctx, "Status", COL.status, hy + 66, 20, { weight: 800, color: "#5B6B76" });
    text(ctx, tot.cpu + "%", COL.cpu, hy + 36, 30, { align: "right", weight: 900, color: tot.cpu > 80 ? RED : C.ink }); text(ctx, "CPU", COL.cpu, hy + 66, 20, { align: "right", weight: 800, color: "#5B6B76" });
    text(ctx, tot.mem + "%", COL.mem, hy + 36, 30, { align: "right", weight: 900, color: tot.mem > 80 ? RED : C.ink }); text(ctx, "Memori" + (st.sort === "mem" ? " ▼" : ""), COL.mem, hy + 66, 20, { align: "right", weight: 800, color: st.sort === "mem" ? BLUE : "#5B6B76" });
    ctx.fillStyle = "#DDE5EA"; ctx.fillRect(WIN.x, hy + 80, WIN.w, 1.5);
    // baris
    ctx.save(); ctx.beginPath(); ctx.rect(WIN.x, hy + 82, WIN.w, WIN.y + WIN.h - 70 - hy - 82); ctx.clip();
    rowsOf(st).forEach(r => {
      if (r.group) { ctx.fillStyle = "#F6F8FA"; ctx.fillRect(WIN.x + 1, r.y, WIN.w - 2, 36); text(ctx, r.group, COL.name, r.y + 26, 19, { weight: 800, color: r.group.startsWith("Proses") && st.sysHl ? C.accentDark : "#5B6B76" }); return; }
      const sel = st.sel === r.n, sysOn = r.sys && st.sysHl;
      if (sel) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(WIN.x + 1, r.y, WIN.w - 2, RH); }
      else if (sysOn) { ctx.fillStyle = "#FFF6E0"; ctx.fillRect(WIN.x + 1, r.y, WIN.w - 2, RH); }
      ctx.fillStyle = heat(r.cpu, 70); ctx.fillRect(COL.cpu - 150, r.y + 1, 160, RH - 2); ctx.fillStyle = heat(r.mem, 2400); ctx.fillRect(COL.mem - 150, r.y + 1, 160, RH - 2);
      HP.appIcon(ctx, COL.name + 18, r.y + RH / 2, 30, r.col, r.ic); text(ctx, r.n, COL.name + 46, r.y + RH / 2 + 8, 22, { weight: 700 });
      if (r.hang && !st.ended) text(ctx, "Tidak merespons", COL.status, r.y + RH / 2 + 8, 21, { weight: 800, color: RED });
      text(ctx, r.cpu + "%", COL.cpu, r.y + RH / 2 + 8, 22, { align: "right", weight: 700 }); text(ctx, fmtMem(r.mem), COL.mem, r.y + RH / 2 + 8, 22, { align: "right", weight: 700 });
      ctx.fillStyle = "#EEF2F5"; ctx.fillRect(WIN.x, r.y + RH - 1, WIN.w, 1);
    });
    ctx.restore();
    // sorotan kolom
    const colBox = { cpu: [COL.cpu - 150, 160], mem: [COL.mem - 150, 160], status: [COL.status - 10, 240], name: [COL.name - 6, 500] }[st.hl];
    if (colBox) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, colBox[0], hy + 4, colBox[1], WIN.y + WIN.h - 76 - hy, 10); ctx.stroke(); }
    // bilah bawah
    const fy = WIN.y + WIN.h - 66; ctx.fillStyle = "#F6F8FA"; ctx.fillRect(WIN.x + 1, fy, WIN.w - 2, 50); ctx.fillStyle = "#DDE5EA"; ctx.fillRect(WIN.x, fy, WIN.w, 1.5);
    text(ctx, "Memori: " + (st.ended ? "5,8" : "7,1") + " dari 8 GB", WIN.x + 30, fy + 34, 20, { weight: 700, color: "#5B6B76" });
    HP.button(ctx, WIN.x + WIN.w - 230, fy + 6, 200, 42, "Akhiri tugas", { fill: st.sel ? BLUE : "#B9C4CC", r: 10, size: 20, hl: st.btnHl });
    if (st.dlg) warnDlg(ctx, st.dlg);
  }
  const TM_BTN = { x: WIN.x + WIN.w - 130, y: WIN.y + WIN.h - 39 };
  const WD = { x: 410, y: 300, w: 700, h: 300 };
  function warnDlg(ctx, d) {
    const u = ease(clamp(d.u == null ? 1 : d.u, 0, 1)); ctx.save(); ctx.globalAlpha = u;
    ctx.fillStyle = "rgba(15,22,28,0.35)"; rr(ctx, WIN.x, WIN.y, WIN.w, WIN.h, 16); ctx.fill();
    ctx.shadowColor = "rgba(31,42,51,0.3)"; ctx.shadowBlur = 30; ctx.fillStyle = "#FFFFFF"; rr(ctx, WD.x, WD.y, WD.w, WD.h, 16); ctx.fill(); ctx.shadowBlur = 0;
    HP.icon(ctx, "warning", WD.x + 56, WD.y + 64, 44, ORANGE);
    text(ctx, "Akhiri " + d.name + "?", WD.x + 100, WD.y + 76, 28, { weight: 900 });
    para(ctx, "Proses ini bagian dari sistem. Kalau diakhiri, laptop bisa tidak stabil atau berhenti bekerja, dan data yang belum disimpan hilang.", WD.x + 100, WD.y + 118, 22, WD.w - 140, { weight: 600, color: C.ink2, lh: 1.3 });
    HP.button(ctx, WD.x + WD.w - 440, WD.y + WD.h - 74, 200, 50, "Akhiri proses", { outline: true, ink: RED, r: 10, size: 21 });
    HP.button(ctx, WD.x + WD.w - 220, WD.y + WD.h - 74, 190, 50, "Batal", { r: 10, size: 21, hl: d.hl });
    ctx.restore();
  }
  const WD_CANCEL = { x: WD.x + WD.w - 125, y: WD.y + WD.h - 49 };
  // Lembar Kerja yang macet
  function frozen(ctx, opt = {}) {
    const area = L.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: "Laporan Kas Kelas — Lembar Kerja" + (opt.hang ? " (Tidak merespons)" : ""), menus: ["File", "Edit", "Tampilan", "Sisipkan", "Format", "Data"], tools: true });
    L.sheet(ctx, { x: area.x + 14, y: area.y }, { cols: 6, rows: 8, rh: 46, cw: 190, active: "B4", cells: { A1: "Bulan", B1: "Masuk", C1: "Keluar", D1: "Saldo", A2: "Juli", B2: 150000, C2: 40000, D2: 110000, A3: "Agustus", B3: 150000, C3: 95000, D3: 165000, A4: "September", B4: 150000 } });
    if (opt.hang) { ctx.fillStyle = "rgba(255,255,255,0.55)"; rr(ctx, WIN.x, WIN.y + 46, WIN.w, WIN.h - 46, 0); ctx.fill(); }
  }
  function busy(ctx, x, y, t) { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = BLUE; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(x, y, 18, t * 6, t * 6 + 4); ctx.stroke(); ctx.lineCap = "butt"; }
  function keysAt(ctx, R, y = 690) { if (R.key) L.keys(ctx, WIN.x + WIN.w / 2, y, R.key.keys, { press: R.key.press, align: "center", size: 36 }); }
  function cursor(ctx, R) { if (R.ptr) L.cursor(ctx, R.ptr.x, R.ptr.y, { click: R.click }); }

  // ---------- HP: Pengaturan › Memori ----------
  const ROOT = [{ label: "Wi-Fi dan jaringan", icon: "wifi" }, { label: "Baterai", icon: "battery" }, { label: "Penyimpanan", icon: "folder" }, { label: "Memori (RAM)", icon: "info" }, { label: "Aplikasi", icon: "apps" }, { label: "Tentang HP", icon: "phone" }];
  function rootPage(c, hl) { HP.header(c, "Pengaturan"); HP.search(c, 112, ""); return HP.list(c, ROOT.map((r, i) => ({ ...r, hl: hl === i })), { y: 176 }); }
  const MEM_APPS = [{ label: "Balap Liar", app: { color: "#8E6BBF", icon: "game" }, value: "1,2 GB", k: "balap" }, { label: "Sistem HP", icon: "gear", value: "1,1 GB", sub: "Proses sistem", k: "sys" },
    { label: "Browser", app: { color: "#5B6B76", icon: "globe" }, value: "820 MB" }, { label: "Obrolan", app: { color: "#4C9BE0", icon: "chat" }, value: "540 MB" }, { label: "Kamera", app: { color: "#2E7E9A", icon: "camera" }, value: "310 MB" }];
  function memPage(c, o = {}) {
    HP.header(c, "Memori (RAM)", { back: true });
    const used = o.used || 4.6; c.fillStyle = o.topHl ? "#FFF3D6" : "#FFFFFF"; rr(c, 12, 116, 336, 150, 18); c.fill();
    if (o.topHl) { c.strokeStyle = C.accent; c.lineWidth = 2.5; rr(c, 12, 116, 336, 150, 18); c.stroke(); }
    text(c, String(used).replace(".", ",") + " GB", 32, 168, 38, { weight: 900, color: used > 4 ? ORANGE : GREEN }); text(c, "dari 6 GB dipakai", 32, 196, 17, { weight: 700, color: "#5B6B76" });
    HP.progress(c, 32, 214, 296, used / 6, { h: 14, color: used > 4 ? ORANGE : GREEN }); text(c, "Rata-rata 3 jam terakhir", 32, 252, 14, { weight: 600, color: "#8A99A3" });
    text(c, "PEMAKAIAN OLEH APLIKASI", 22, 296, 15, { weight: 800, color: "#5B6B76" });
    const items = MEM_APPS.filter(a => !(o.stopped && a.k === "balap")).map(a => ({ ...a, hl: o.hl === a.k, valueColor: a.k === "balap" ? ORANGE : undefined }));
    return HP.list(c, items, { y: 308 });
  }
  const MEM_ROWS = () => B.rowsOf(MEM_APPS, { y: 308 });
  function appInfo(c, o = {}) {
    HP.header(c, "Info aplikasi", { back: true }); HP.appIcon(c, 180, 170, 76, "#8E6BBF", "game");
    text(c, "Balap Liar", 180, 246, 24, { align: "center", weight: 800 }); text(c, "Memakai 1,2 GB RAM", 180, 272, 16, { align: "center", weight: 700, color: ORANGE });
    [["Buka", "globe", BLUE], ["Uninstal", "trash", RED], ["Paksa berhenti", "close", BLUE]].forEach(([s, ic, col], i) => { const x = 30 + i * 104, hl = o.hl === i;
      c.fillStyle = hl ? "#FFF3D6" : "#FFFFFF"; rr(c, x, 296, 92, 84, 16); c.fill(); if (hl) { c.strokeStyle = C.accent; c.lineWidth = 2.5; rr(c, x, 296, 92, 84, 16); c.stroke(); }
      HP.icon(c, ic, x + 46, 326, 24, col); text(c, s, x + 46, 364, 15, { align: "center", weight: 800, color: col, fit: 86 }); });
    HP.list(c, [{ label: "Memori", sub: "1,2 GB rata-rata", arrow: true }, { label: "Baterai", sub: "18% sejak diisi penuh", arrow: true }], { y: 396 });
    if (o.dlg) return HP.dialog(c, { title: "Paksa berhenti?", body: "Aplikasi bisa bermasalah, dan progres yang belum disimpan bisa hilang.", buttons: ["Batal", "OK"], hl: o.ok ? 1 : null, u: o.dlg });
  }
  const PAKSA = () => B.measure(m => appInfo(m, { dlg: 1 })).buttons[1];
  function recents(c, o = {}) {
    c.fillStyle = "#3B4852"; c.fillRect(0, 0, HP.W, HP.H);
    const cards = [["Balap Liar", "#8E6BBF", "game"], ["Browser", "#5B6B76", "globe"], ["Obrolan", "#4C9BE0", "chat"]];
    cards.forEach(([n, col, ic], i) => { const k = o.closed || 0; if (i < Math.floor(k)) return; const dy = i === Math.floor(k) ? -(k % 1) * 500 : 0, x = 40 + (i - Math.floor(k)) * 40, y = 130 + (i - Math.floor(k)) * 26 + dy;
      c.save(); c.globalAlpha = 1 - Math.min(1, -dy / 400); c.fillStyle = "#FFFFFF"; rr(c, x, y, 240, 420, 18); c.fill(); HP.appIcon(c, x + 26, y - 18, 28, col, ic); text(c, n, x + 48, y - 10, 16, { weight: 800, color: "#FFFFFF" });
      c.fillStyle = col; c.globalAlpha *= 0.25; c.fillRect(x + 12, y + 14, 216, 120); c.restore(); });
    HP.button(c, 110, 620, 140, 44, "Tutup semua", { fill: "#FFFFFF", ink: C.ink, r: 22, size: 17, hl: o.allHl });
  }

  // ---------- adegan ----------
  B.art.tujuan = (ctx, l) => { ctx.save(); ctx.translate(1180, 250); ctx.scale(0.42, 0.42); ctx.translate(-WIN.x, -WIN.y); tm(ctx, { hl: "total" }); ctx.restore(); B.phone(ctx, c => memPage(c, {}), { cx: 1610, cy: 560, h: 460 }); };
  B.art.coba = (ctx, l) => { L.keys(ctx, 1460, 380, ["Ctrl", "Shift", "Esc"], { align: "center", size: 34 }); B.phone(ctx, c => memPage(c, {}), { cx: 1460, cy: 640, h: 300 }); };
  B.art.periksa = (ctx, l) => { ctx.save(); ctx.translate(30, 170); ctx.scale(0.64, 0.64); ctx.translate(-WIN.x, -WIN.y); tm(ctx, { sort: "mem", ended: true, hl: "mem" }); ctx.restore(); };

  Object.assign(K.SCENES, {
    tm_buka(ctx, b, l) {
      const span = B.spanOf(b);
      const ST = [{ to: [700, 520], d: 0.6 }, { to: [900, 600], click: true, d: 0.7 }, { to: [760, 440], click: true, d: 0.7 }, { wait: 1, d: 0.6 }, { key: ["Ctrl", "Shift", "Esc"], d: 1.4 }, { set: { tm: true }, d: 0.1 }, { anim: "grow", d: 0.6 }, { wait: 1, d: 1.2 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      if (!st.tm) { frozen(ctx, { hang: R.i >= 1 }); if (R.ptr) { if (R.i >= 1) busy(ctx, R.ptr.x + 30, R.ptr.y + 30, l); L.cursor(ctx, R.ptr.x, R.ptr.y, { click: R.click }); } }
      else { frozen(ctx, { hang: true }); const g = ease(st.grow == null ? 1 : st.grow); ctx.save(); ctx.globalAlpha = g; ctx.translate(760, 470); ctx.scale(0.85 + 0.15 * g, 0.85 + 0.15 * g); ctx.translate(-760, -470); tm(ctx, {}); ctx.restore(); }
      keysAt(ctx, R, 420);
      const y = B.steps(ctx, "LANGKAH", ["Aplikasi tidak merespons.", "Tekan Ctrl + Shift + Esc bersamaan.", "Pengelola Tugas terbuka."], B.stepAt(l, span, [0.1, 0.42, 0.62]));
      B.notes(ctx, y, [B.after(b, l, 0.5) && B.tip("Cara lain: klik kanan bilah tugas, lalu Pengelola tugas. Di laptop Mac: Monitor Aktivitas.")]);
    },
    tm_baca(ctx, b, l) {
      const a = b.audio || b.dur, k = l > a * 0.78 ? "total" : l > a * 0.62 ? "mem" : l > a * 0.47 ? "cpu" : l > a * 0.33 ? "status" : l > a * 0.18 ? "name" : null;
      tm(ctx, { hl: k });
      const items = [["name", "Nama proses"], ["status", "Status"], ["cpu", "CPU"], ["mem", "Memori"], ["total", "Angka atas: total"]];
      card(ctx, 1450, 122, 370, 70 + items.length * 62, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "TAB PROSES", 1474, 166, 24, { weight: 900, color: C.accentDark });
      items.forEach(([key, s], i) => { const on = items.findIndex(x => x[0] === k) >= i, y = 190 + i * 62; if (key === k) { ctx.fillStyle = "#FFF3D6"; rr(ctx, 1460, y - 4, 350, 54, 10); ctx.fill(); }
        ctx.fillStyle = on ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(1490, y + 23, 16, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 1490, y + 30, 18, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, s, 1520, y + 31, 23, { weight: 800, color: on ? C.ink : "#8A99A3" }); });
    },
    tm_arti(ctx, b, l) {
      const a = b.audio || b.dur, memOn = l > a * 0.55, y = rowY({}, "Lembar Kerja");
      tm(ctx, { hl: memOn ? "mem" : "cpu", sel: null });
      ctx.strokeStyle = RED; ctx.lineWidth = 4; rr(ctx, WIN.x + 6, y - RH / 2 + 2, WIN.w - 12, RH - 4, 8); ctx.stroke();
      card(ctx, 1450, 122, 370, 300, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "INGAT E.2", 1474, 166, 24, { weight: 900, color: C.accentDark });
      // giliran prosesor: lingkaran irisan
      const cx = 1540, cy = 290, r = 70; const parts = [[0.61, RED, "Lembar Kerja"], [0.18, "#5B6B76", ""], [0.13, "#C9D4DB", ""]]; let a0 = -Math.PI / 2;
      parts.forEach(([f, col]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a0 + f * Math.PI * 2); ctx.closePath(); ctx.fill(); a0 += f * Math.PI * 2; });
      ctx.fillStyle = "#EEF2F5"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, -Math.PI / 2 + Math.PI * 2); ctx.closePath(); ctx.fill();
      text(ctx, "Giliran prosesor", 1630, 250, 21, { weight: 800 }); para(ctx, "61% untuk Lembar Kerja", 1630, 284, 21, 170, { weight: 700, color: RED, lh: 1.2 });
      if (memOn) { card(ctx, 1450, 440, 370, 230, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "Wilayah RAM (8 GB)", 1474, 482, 21, { weight: 800 });
        const segs = [[2140, "#5B6B76"], [1380, RED], [690, "#5FA8D3"], [320, "#4C9BE0"], [180, "#8E6BBF"], [400, "#7B8B95"], [2000, "#7B8B95"]]; let x = 1474;
        segs.forEach(([m, col], i) => { const w = m / 8000 * 322; ctx.fillStyle = col; ctx.globalAlpha = i === 6 ? 0.35 : 1; ctx.fillRect(x, 500, w - 2, 50); x += w; }); ctx.globalAlpha = 1;
        ctx.fillStyle = "#EEF2F5"; ctx.fillRect(x, 500, 1474 + 322 - x, 50);
        para(ctx, "Tiap proses punya wilayahnya sendiri. Lembar Kerja: 1.380 MB.", 1474, 590, 20, 330, { weight: 700, lh: 1.25 }); }
    },
    tm_urut(ctx, b, l) {
      const span = B.spanOf(b), mh = [COL.mem - 60, HEAD_Y + 62];
      const ST = [{ to: [900, 700], d: 0.4 }, { to: mh, d: 1 }, { to: mh, click: true, set: { sort: "mem" }, d: 0.8 }, { wait: 1, d: 2.4 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      tm(ctx, { sort: st.sort, memHl: R.i >= 1 && !st.sort });
      if (st.sort) { const y1 = rowY({ sort: "mem" }, "Browser (12 tab)"); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, WIN.x + 6, y1 - RH / 2 + 2, WIN.w - 12, RH * 2 - 4, 8); ctx.stroke(); }
      cursor(ctx, R);
      const y = B.steps(ctx, "LANGKAH", ["Klik judul kolom Memori.", "Lihat baris paling atas."], B.stepAt(l, span, [0.4, 0.6]));
      if (st.sort) B.notes(ctx, y, [{ s: "Terbesar: Browser 12 tab, lalu Lembar Kerja." }, B.tip("Klik sekali lagi untuk urutan sebaliknya.")]);
    },
    tm_macet(ctx, b, l) {
      const a = b.audio || b.dur, wait = l > a * 0.5, y = rowY({ sort: "mem" }, "Lembar Kerja");
      tm(ctx, { sort: "mem", hl: wait ? null : "status" });
      ctx.strokeStyle = RED; ctx.lineWidth = 4; rr(ctx, WIN.x + 6, y - RH / 2 + 2, WIN.w - 12, RH - 4, 8); ctx.stroke();
      const yy = B.steps(ctx, "SEBELUM MENUTUP", ["Status: Tidak merespons.", "CPU tinggi: 61%.", "Tunggu sekitar satu menit."], wait ? (l > a * 0.92 ? 3 : 2) : l > a * 0.3 ? 1 : 0);
      if (wait) { const u = clamp((l - a * 0.5) / (a * 0.45), 0, 1); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(1560, yy + 110, 64, 0, Math.PI * 2); ctx.fill(); HP.ring(ctx, 1560, yy + 110, 54, 1 - u, BLUE);
        text(ctx, Math.round(60 * (1 - u)) + " dtk", 1560, yy + 118, 22, { align: "center", weight: 900 }); text(ctx, "beri waktu", 1700, yy + 120, 22, { align: "center", weight: 700, color: C.ink2 }); }
    },
    tm_akhiri(ctx, b, l) {
      const span = B.spanOf(b), y = rowY({ sort: "mem" }, "Lembar Kerja");
      const ST = [{ to: [700, 760], d: 0.3 }, { to: [COL.name + 200, y], d: 0.9 }, { to: [COL.name + 200, y], click: true, set: { sel: "Lembar Kerja" }, d: 0.7 }, { to: [TM_BTN.x, TM_BTN.y], d: 1 }, { to: [TM_BTN.x, TM_BTN.y], click: true, set: { ended: true }, d: 0.8 }, { wait: 1, d: 1 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      tm(ctx, { sort: "mem", sel: st.ended ? null : st.sel, ended: st.ended, btnHl: R.i >= 3 && !st.ended });
      cursor(ctx, R);
      const yy = B.steps(ctx, "LANGKAH", ["Klik baris Lembar Kerja.", "Klik Akhiri tugas."], B.stepAt(l, span, [0.35, 0.75]));
      B.notes(ctx, yy, [B.warn("Bagian yang belum disimpan bisa hilang.")]);
    },
    tm_hasil(ctx, b, l) {
      const a = b.audio || b.dur; tm(ctx, { sort: "mem", ended: true, hl: "total" });
      card(ctx, 1450, 122, 370, 330, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "SEBELUM → SESUDAH", 1474, 166, 24, { weight: 900, color: C.accentDark });
      [["CPU", 92, 31, 0.15], ["Memori", 89, 72, 0.45]].forEach(([n, b0, b1, f], i) => { const y = 200 + i * 120, on = l > a * f; text(ctx, n, 1474, y + 24, 23, { weight: 800 });
        text(ctx, b0 + "%", 1474, y + 74, 34, { weight: 900, color: RED }); text(ctx, "→", 1600, y + 74, 34, { align: "center", weight: 900, color: C.ink2 }); if (on) text(ctx, b1 + "%", 1660, y + 74, 34, { weight: 900, color: GREEN }); });
      if (B.after(b, l, 0.75)) B.notes(ctx, 450, [B.ok("Laptop kembali lancar.")]);
    },
    tm_sistem(ctx, b, l) {
      tm(ctx, { sort: "mem", ended: true, sysHl: B.after(b, l, 0.15) });
      const y = B.steps(ctx, "PROSES SISTEM", ["Sistem", "Layanan jaringan", "Antarmuka desktop"], 3, {});
      B.notes(ctx, y, [B.after(b, l, 0.5) && B.warn("Menjalankan laptop itu sendiri. Jangan diakhiri.")]);
    },
    tm_peringatan(ctx, b, l) {
      const span = B.spanOf(b), y = rowY({ sort: "mem", ended: true }, "Antarmuka desktop");
      const ST = [{ to: [COL.name + 200, y], d: 0.8 }, { to: [COL.name + 200, y], click: true, set: { sel: "Antarmuka desktop" }, d: 0.6 }, { to: [TM_BTN.x, TM_BTN.y], d: 0.8 }, { to: [TM_BTN.x, TM_BTN.y], click: true, set: { dlg: true }, d: 0.6 }, { wait: 1, d: 1.4 },
        { to: [WD_CANCEL.x, WD_CANCEL.y], d: 0.8 }, { to: [WD_CANCEL.x, WD_CANCEL.y], click: true, set: { dlg: false, sel: null }, d: 0.6 }, { wait: 1, d: 0.8 }];
      const R = HP.run({ pointer: { x: 800, y: 700 } }, ST, l, span), st = R.st;
      tm(ctx, { sort: "mem", ended: true, sel: st.sel, sysHl: true, dlg: st.dlg ? { name: "Antarmuka desktop", hl: R.i >= 5 } : null });
      cursor(ctx, R);
      const yy = B.steps(ctx, "KALAU TERLANJUR", ["Muncul peringatan.", "Pilih Batal."], B.stepAt(l, span, [0.45, 0.85]));
      B.notes(ctx, yy, [B.ok("Akhiri tugas hanya untuk aplikasi yang kamu kenal.")]);
    },
    hp_memori(ctx, b, l) {
      const span = B.spanOf(b), rows = B.rowsOf(ROOT, { y: 176 });
      const R = HP.run({ scr: "root" }, [{ wait: 1, d: 0.6 }, { tap: B.tapRow(rows, 3), set: { scr: "mem" }, d: 1 }, { wait: 1, d: 2.6 }], l, span);
      const draw = c => { if (R.st.scr === "root") rootPage(c, R.i >= 1 ? 3 : null); else memPage(c, { topHl: B.after(b, l, 0.5) }); B.tapDraw(c, R); };
      B.show(ctx, draw, R.st.scr === "root" ? { u: 0, v: 300, w: 360, h: 200 } : { u: 0, v: 104, w: 360, h: 170 });
      const y = B.steps(ctx, "LANGKAH", ["Buka Pengaturan.", "Tap Memori (RAM).", "Baca RAM yang terpakai."], B.stepAt(l, span, [0.15, 0.4, 0.7]));
      B.notes(ctx, y, [B.tip("Di HP lain: Perawatan perangkat, lalu Memori.")]);
    },
    hp_daftar(ctx, b, l) {
      const hl = B.after(b, l, 0.35) ? "balap" : null;
      B.show(ctx, c => memPage(c, { hl }), { u: 0, v: 284, w: 360, h: 260 });
      const y = B.steps(ctx, "PEMAKAIAN MEMORI", ["Baca daftar dari atas.", "Mana yang tidak dipakai?"], hl ? 2 : 1);
      B.notes(ctx, y, [hl && B.warn("Balap Liar: 1,2 GB, padahal tidak dimainkan."), B.after(b, l, 0.65) && { s: "Sistem HP termasuk proses sistem: biarkan." }]);
    },
    hp_paksa(ctx, b, l) {
      const span = B.spanOf(b), rows = MEM_ROWS(), ok = PAKSA();
      const ST = [{ tap: B.tapRow(rows, 0), set: { scr: "info" }, d: 1 }, { wait: 1, d: 0.3 }, { tap: [238, 338], set: { dlg: 1 }, d: 1 }, { tap: [ok.cx, ok.cy], set: { scr: "mem2" }, d: 1 }, { wait: 1, d: 0.4 }, { anim: "drop", d: 1 }, { wait: 1, d: 0.8 }];
      const R = HP.run({ scr: "mem" }, ST, l, span), st = R.st;
      const used = st.scr === "mem2" ? lerp(4.6, 3.4, ease(st.drop || 0)) : 4.6;
      const draw = c => { if (st.scr === "mem") memPage(c, { hl: "balap" }); else if (st.scr === "info") appInfo(c, { hl: 2, dlg: st.dlg, ok: R.i >= 3 }); else memPage(c, { stopped: true, used: Math.round(used * 10) / 10 }); B.tapDraw(c, R); };
      const src = st.scr === "mem" ? { u: 0, v: 290, w: 360, h: 170 } : st.scr === "info" ? (st.dlg ? { u: 0, v: 250, w: 360, h: 250 } : { u: 0, v: 140, w: 360, h: 250 }) : { u: 0, v: 104, w: 360, h: 170 };
      B.show(ctx, draw, src);
      const y = B.steps(ctx, "LANGKAH", ["Tap Balap Liar.", "Tap Paksa berhenti.", "Tap OK."], B.stepAt(l, span, [0.15, 0.35, 0.55]));
      if (st.scr === "mem2") B.notes(ctx, y, [B.ok("RAM terpakai: 4,6 → 3,4 GB")]);
    },
    salah_sistem(ctx, b, l) {
      const a = b.audio || b.dur, gone = clamp((l - a * 0.3) / (a * 0.15), 0, 1);
      card(ctx, 960, 140, 860, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 1: MENGAKHIRI PROSES YANG TIDAK DIKENAL", 1390, 200, 25, { align: "center", weight: 900, color: RED, fit: 820 });
      // layar laptop kecil: bilah tugas dan ikon menghilang
      const X = 120, Y = 220, W = 800, Hh = 460; ctx.save(); rr(ctx, X, Y, W, Hh, 14); ctx.clip();
      const g = ctx.createLinearGradient(0, Y, 0, Y + Hh); g.addColorStop(0, "#BFDCE8"); g.addColorStop(1, "#DCEBDD"); ctx.fillStyle = g; ctx.fillRect(X, Y, W, Hh);
      ctx.globalAlpha = 1 - gone; ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fillRect(X, Y + Hh - 60, W, 60);
      [["globe", "#5B6B76"], ["folder", "#E0A23B"], ["apps", GREEN], ["chat", "#4C9BE0"]].forEach(([ic, col], i) => HP.appIcon(ctx, X + W / 2 - 120 + i * 80, Y + Hh - 30, 42, col, ic));
      [["folder", "Dokumen"], ["trash", "Sampah"]].forEach(([ic, s], i) => { HP.appIcon(ctx, X + 60, Y + 60 + i * 100, 50, "#E0A23B", ic); text(ctx, s, X + 60, Y + 110 + i * 100, 16, { align: "center", weight: 700 }); });
      ctx.restore(); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 3; rr(ctx, X, Y, W, Hh, 14); ctx.stroke();
      B.tag(ctx, X + W / 2, Y - 50, gone > 0.5 ? "Bilah tugas dan ikon hilang" : "Akhiri: Antarmuka desktop", { align: "center", fill: gone > 0.5 ? RED : C.ink });
      if (l > a * 0.3) B.badge(ctx, 990, 240, false, "Antarmuka desktop diakhiri: bilah tugas dan ikon menghilang.", { w: 800, h: 100, size: 26 });
      if (l > a * 0.62) B.badge(ctx, 990, 360, true, "Mulai ulang laptop untuk memulihkannya.", { w: 800, h: 90, size: 26 });
      if (l > a * 0.8) B.badge(ctx, 990, 470, true, "Tidak kenal nama prosesnya? Biarkan saja.", { w: 800, h: 90, size: 26 });
    },
    salah_paksa(ctx, b, l) {
      const span = B.spanOf(b);
      const ST = [{ wait: 1, d: 0.4 }, { tap: [180, 642], set: { n: 1 }, d: 0.6 }, { anim: "closed3", d: 0.8 }, { wait: 1, d: 0.4 }, { set: { reopen: true }, d: 0.1 }, { anim: "load", d: 2 }, { wait: 1, d: 1 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      card(ctx, 960, 140, 860, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 2: MENUTUP PAKSA SEMUA, SETIAP SAAT", 1390, 200, 25, { align: "center", weight: 900, color: RED, fit: 820 });
      const draw = c => { if (!st.reopen) recents(c, { closed: (st.closed3 || 0) * 3, allHl: R.i === 1 });
        else { c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, HP.W, HP.H); HP.appIcon(c, 180, 300, 90, "#4C9BE0", "chat"); text(c, "Memuat Obrolan…", 180, 400, 20, { align: "center", weight: 800 }); HP.progress(c, 70, 430, 220, st.load || 0, { h: 10 }); }
        B.tapDraw(c, R); };
      B.phone(ctx, draw, { cx: 560, cy: 474, dark: !st.reopen });
      if (R.i >= 2) B.badge(ctx, 990, 240, false, "Semua aplikasi ditutup, padahal sebentar lagi dibuka lagi.", { w: 800, h: 100, size: 26 });
      if (st.reopen) B.badge(ctx, 990, 360, false, "Saat dibuka lagi, aplikasi dimuat dari awal: lebih lambat.", { w: 800, h: 100, size: 26 });
      if (B.after(b, l, 0.78)) B.badge(ctx, 990, 480, true, "Tutup paksa hanya aplikasi yang macet atau boros.", { w: 800, h: 90, size: 26 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
