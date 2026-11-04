/* K01 Simulasi konsep: RAM dan penyimpanan saat listrik padam (gambar perangkat dari kiko-devices.js dan D7.2/komputer.js).
   Kiri: monitor dengan aplikasi "Dokumen" generik (layar x 170–970, y 240–660); lajur atas (y 130–205): jam dan status listrik.
   Kanan (x 1040–1800): "di dalam komputer": RAM (papan hijau berisi halaman yang sedang dikerjakan atau kotak aplikasi) dan
   PENYIMPANAN (hard disk + daftar file). Semua gambar di atas y 830. Waktu kejadian diambil dari posisi kata di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, M = K.komp;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const GREEN_PCB = "#2E6B4F", GOLD = "#E0B04B";
  const lead = b => b.speech != null && b.start != null ? b.speech - b.start : 0.4;
  const at = (b, s) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * (b.audio || b.dur); };
  const DITO = ["Kunjungan ke Museum", "Kelas 7B pergi ke museum kota.", "Kami melihat komputer kuno.", "Ukurannya sebesar satu kamar!"];
  const SINTA = ["Laporan Kebun Sekolah", "Kami menanam cabai dan tomat.", "Tomat tumbuh paling cepat.", "Besok kami menyiramnya lagi."];
  const LIBUR = ["Cerita Liburan", "Aku pergi ke rumah nenek.", "Kami naik angkot ke pasar.", "Nenek membeli ikan segar.", "Sorenya kami memasak bersama."];
  const BASE_FILES = [{ name: "Foto liburan", kind: "foto", note: "kemarin" }, { name: "Aplikasi Dokumen", kind: "folder", note: "terpasang" }];
  const APPS = [["Dokumen", 1, "#7B8B95"], ["Musik", 1, "#8E6BBF"], ["Browser 12 tab", 3, "#2E7E9A"], ["Game", 3, "#D9443B"], ["Pengedit Foto", 2, "#2E9E5B"]];
  const RAMC = [1420, 350], DISKC = [1150, 660];

  // ---------- bagian gambar ----------
  function topStrip(ctx, s) {
    if (s.clock) text(ctx, "pukul " + s.clock, 190, 186, 32, { weight: 900, color: C.ink2 });
    if (s.speed != null) { // meteran kecepatan (variasi RAM penuh)
      text(ctx, "kecepatan:", 190, 186, 28, { weight: 800, color: C.ink2 });
      ctx.fillStyle = "#DDE5EA"; rr(ctx, 350, 160, 260, 32, 16); ctx.fill();
      const col = s.speed > 0.6 ? C.good : s.speed > 0.35 ? C.accent : C.bad; ctx.fillStyle = col; rr(ctx, 350, 160, 260 * s.speed, 32, 16); ctx.fill();
      text(ctx, s.speed > 0.6 ? "cepat" : s.speed > 0.35 ? "mulai berat" : "lambat", 630, 186, 28, { weight: 900, color: col });
    }
    const on = s.power !== false;
    card(ctx, 790, 146, 190, 54, { fill: on ? C.goodBg : C.badBg, stroke: on ? C.good : C.bad, lw: 3, r: 27 });
    text(ctx, on ? "⚡ listrik nyala" : "✕ listrik padam", 885, 182, 24, { align: "center", weight: 900, color: on ? C.good : C.bad });
    if (s.ask && s.speed == null) { const p = 1 + 0.08 * Math.sin((s.l || 0) * 5); text(ctx, "lalu listrik padam", 560, 184, 28, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "?", 740, 190, 52 * p, { align: "center", weight: 900, color: C.accentDark }); }
  }
  function screen(ctx, s) {
    const sc = D.monitor(ctx, 170, 240, 800, 420);
    if (s.power === false) {
      ctx.fillStyle = "#121A20"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 10); ctx.fill();
      if (s.offFlash) { ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - s.offFlash)})`; rr(ctx, sc.x, sc.y, sc.w, sc.h, 10); ctx.fill(); }
      text(ctx, "layar mati", sc.x + sc.w / 2, sc.y + sc.h / 2 + 12, 32, { align: "center", weight: 800, color: "#3A4A56" });
      return sc;
    }
    if (s.screen === "apps") { appsScreen(ctx, sc, s); return sc; }
    if (s.screen === "desktop") {
      const a = D.windowFrame(ctx, sc.x + 20, sc.y + 18, sc.w - 40, sc.h - 36, "Folder Tugas");
      const fs = (s.files || []).filter(f => f.kind === "tulisan");
      if (!fs.length) { text(ctx, "(folder kosong)", a.x + a.w / 2, a.y + 120, 34, { align: "center", weight: 800, color: C.muted }); if (s.desktopNote) text(ctx, s.desktopNote, a.x + a.w / 2, a.y + 180, 28, { align: "center", weight: 800, color: C.bad }); }
      fs.forEach((f, i) => D.fileIcon(ctx, a.x + 110 + i * 200, a.y + 90, 80, "tulisan", { name: f.name, selected: s.openSel }));
      return sc;
    }
    // jendela Dokumen
    const a = D.windowFrame(ctx, sc.x + 20, sc.y + 18, sc.w - 40, sc.h - 36, (s.title || "Laporan") + " — Dokumen");
    if (s.badge) { const ok = s.badge === "tersimpan"; card(ctx, a.x, a.y + a.h - 22, 230, 36, { fill: ok ? C.goodBg : "#FFF3D6", r: 18 }); text(ctx, ok ? "✓ tersimpan" : "● belum disimpan", a.x + 115, a.y + a.h + 4, 21, { align: "center", weight: 900, color: ok ? C.good : C.accentDark }); }
    (s.lines || []).forEach((ln, i) => {
      const y = a.y + 30 + i * 46, t = ln.t.slice(0, ln.n == null ? ln.t.length : ln.n);
      if (ln.st === "new") { ctx.fillStyle = "#FFF3D6"; rr(ctx, a.x + 8, y - 30, a.w - 16, 42, 8); ctx.fill(); }
      if (ln.st === "lost") { ctx.save(); ctx.globalAlpha = 0.45; }
      text(ctx, t, a.x + 20, y, i === 0 ? 30 : 28, { weight: i === 0 ? 900 : 700, color: ln.st === "lost" ? C.bad : C.ink });
      if (ln.st === "lost") { ctx.restore(); ctx.font = `700 28px ${K.FONT}`; const w = ctx.measureText(t).width; ctx.strokeStyle = C.bad; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(a.x + 16, y - 9); ctx.lineTo(a.x + 24 + w, y - 9); ctx.stroke(); text(ctx, "hilang", a.x + 40 + w, y, 24, { weight: 900, color: C.bad }); }
    });
    const li = (s.lines || []).length - 1;
    if (s.cursor && li >= 0) { const ln = s.lines[li], t = ln.t.slice(0, ln.n == null ? ln.t.length : ln.n); ctx.font = `700 28px ${K.FONT}`; if (Math.floor((s.l || 0) * 2.5) % 2 === 0) { ctx.fillStyle = C.kiko; ctx.fillRect(a.x + 22 + ctx.measureText(t).width, a.y + 30 + li * 46 - 26, 4, 32); } }
    if (s.status) text(ctx, s.status, a.x + a.w - 10, a.y + a.h + 6, 22, { align: "right", weight: 800, color: s.statusColor || C.ink2 });
    if (s.dialog) { card(ctx, sc.x + 120, sc.y + 230, sc.w - 240, 120, { fill: "#FFFFFF", stroke: C.kiko, lw: 4, r: 16 }); para(ctx, s.dialog, sc.x + sc.w / 2, sc.y + 278, 26, sc.w - 290, { align: "center", weight: 800, lh: 1.25 }); }
    return sc;
  }
  function appsScreen(ctx, sc, s) {
    ctx.fillStyle = "#DCE9F2"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 10); ctx.fill();
    const open = s.open || [];
    open.forEach((nm, i) => { const ap = APPS.find(a => a[0] === nm); const a = D.windowFrame(ctx, sc.x + 30 + i * 60, sc.y + 24 + i * 42, 470, 230, nm); ctx.fillStyle = ap[2]; ctx.globalAlpha = 0.25; rr(ctx, a.x, a.y, a.w, a.h - 10, 8); ctx.fill(); ctx.globalAlpha = 1; });
    // dok aplikasi di bawah layar
    ctx.fillStyle = "rgba(31,42,51,0.8)"; rr(ctx, sc.x + 60, sc.y + sc.h - 62, sc.w - 120, 52, 14); ctx.fill();
    APPS.forEach((ap, i) => { const x = sc.x + 100 + i * 130, on = open.includes(ap[0]); ctx.fillStyle = ap[2]; rr(ctx, x - 20, sc.y + sc.h - 54, 40, 36, 8); ctx.fill(); if (on) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, sc.y + sc.h - 12, 4, 0, Math.PI * 2); ctx.fill(); } text(ctx, ap[0].split(" ")[0], x + 26, sc.y + sc.h - 30, 18, { weight: 800, color: "#fff" }); });
    if (s.slow) { const cx = sc.x + sc.w - 120, cy = sc.y + 150; ctx.save(); ctx.translate(cx, cy); ctx.rotate((s.l || 0) * 4); ctx.strokeStyle = C.accentDark; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 1.4); ctx.stroke(); ctx.restore(); text(ctx, "tunggu…", cx, cy + 86, 28, { align: "center", weight: 900, color: C.accentDark }); }
  }
  function ramPanel(ctx, s) {
    text(ctx, "RAM", 1070, 232, 30, { weight: 900, color: C.ink }); text(ctx, s.slots ? "memori sementara" : "memori sementara: cepat, hilang saat listrik padam", 1150, 232, 22, { weight: 700, color: C.ink2 });
    const x = 1070, y = 248, w = 700, h = 210;
    ctx.fillStyle = GREEN_PCB; rr(ctx, x, y, w, h, 14); ctx.fill();
    ctx.fillStyle = GOLD; for (let i = 0; i < 20; i++) ctx.fillRect(x + 20 + i * 33, y + h - 12, 22, 12);
    if (s.ramFlash) { ctx.fillStyle = `rgba(217,68,59,${0.7 * (1 - s.ramFlash)})`; rr(ctx, x, y, w, h, 14); ctx.fill(); }
    if (s.slots) { ramSlots(ctx, x, y, s); return; }
    const page = s.ram;
    if (!page || !page.length || s.power === false) { text(ctx, s.power === false ? "kosong: isinya terhapus" : "kosong", x + w / 2, y + h / 2 + 8, 32, { align: "center", weight: 900, color: "#CFE3D8" }); return; }
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 24, y + 18, w - 48, h - 50, 10); ctx.fill();
    page.forEach((ln, i) => { if (i > 4) return; const t = ln.t.slice(0, ln.n == null ? ln.t.length : ln.n); if (ln.st === "new") { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 32, y + 26 + i * 27, w - 64, 26); } text(ctx, t, x + 40, y + 46 + i * 27, i === 0 ? 22 : 20, { weight: i === 0 ? 900 : 700, color: C.ink }); });
  }
  function ramSlots(ctx, x, y, s) {
    const cw = 160, chh = 78; let k = 0;
    for (let i = 0; i < 8; i++) { const r = Math.floor(i / 4), c = i % 4; ctx.fillStyle = "#24543E"; rr(ctx, x + 22 + c * (cw + 8), y + 18 + r * (chh + 10), cw, chh, 8); ctx.fill(); }
    (s.slots || []).forEach(([nm, n, alpha]) => {
      const ap = APPS.find(a => a[0] === nm);
      for (let j = 0; j < n; j++) { const i = k++; if (i >= 8) return; const r = Math.floor(i / 4), c = i % 4; ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = ap[2]; rr(ctx, x + 22 + c * (cw + 8), y + 18 + r * (chh + 10), cw, chh, 8); ctx.fill(); text(ctx, nm, x + 22 + c * (cw + 8) + cw / 2, y + 18 + r * (chh + 10) + chh / 2 + 8, 20, { align: "center", weight: 900, color: "#fff", fit: cw - 10 }); ctx.restore(); }
    });
    const used = (s.slots || []).reduce((a, b) => a + b[1] * (b[2] == null ? 1 : b[2]), 0);
    text(ctx, used >= 8 ? "RAM PENUH" : "terpakai " + Math.round(used) + " dari 8", 1770, 232, 24, { align: "right", weight: 900, color: used >= 8 ? C.bad : C.ink2 });
  }
  function diskPanel(ctx, s) {
    text(ctx, "PENYIMPANAN", 1070, 512, 30, { weight: 900, color: C.ink }); text(ctx, "tetap ada walau listrik padam", 1310, 512, 22, { weight: 700, color: C.ink2 });
    card(ctx, 1070, 528, 700, 290, { fill: "#F2F5F7", stroke: "#C9D4DB", lw: 3, r: 16 });
    M.disk(ctx, DISKC[0], DISKC[1], 100, {}); text(ctx, "hard disk / SSD", DISKC[0], DISKC[1] + 95, 22, { align: "center", weight: 800, color: C.ink2 });
    (s.files || []).forEach((f, i) => {
      const y = 556 + i * 62; ctx.save(); if (f.alpha != null) ctx.globalAlpha = f.alpha;
      if (f.hl) { ctx.fillStyle = f.hl; rr(ctx, 1240, y, 510, 56, 10); ctx.fill(); }
      D.fileIcon(ctx, 1272, y + 28, 40, f.kind || "tulisan", {}); text(ctx, f.name, 1306, y + 36, 26, { weight: 800, fit: 260 }); if (f.note) text(ctx, f.note, 1740, y + 36, 22, { align: "right", weight: 700, color: f.noteColor || C.ink2 });
      ctx.restore();
    });
    if (s.swap) { // pindahan sementara saat RAM penuh
      card(ctx, 1250, 740, 500, 66, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 });
      text(ctx, "pindahan dari RAM (lambat)", 1270, 782, 22, { weight: 900, color: C.accentDark });
      s.swap.forEach(([nm, alpha], i) => { const ap = APPS.find(a => a[0] === nm); ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = ap[2]; rr(ctx, 1590 + i * 76, 750, 66, 46, 8); ctx.fill(); ctx.restore(); });
    }
  }
  function fly(ctx, from, to, u, label) {
    if (u <= 0 || u >= 1) return; const e = ease(u), x = lerp(from[0], to[0], e), y = lerp(from[1], to[1], e) - Math.sin(e * Math.PI) * 60;
    ctx.strokeStyle = "rgba(242,177,52,0.6)"; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "rgba(242,177,52,0.35)"; ctx.beginPath(); ctx.arc(x, y, 50, 0, Math.PI * 2); ctx.fill();
    D.fileIcon(ctx, x, y, 60, "tulisan", {}); if (label) text(ctx, label, x, y - 50, 24, { align: "center", weight: 900, color: C.accentDark });
  }
  function comp(ctx, s) {
    topStrip(ctx, s); screen(ctx, s);
    card(ctx, 1040, 130, 760, 700, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
    text(ctx, "DI DALAM KOMPUTER", 1420, 180, 28, { align: "center", weight: 900, color: C.accentDark });
    ramPanel(ctx, s); diskPanel(ctx, s);
    if (s.fly) fly(ctx, s.fly[0], s.fly[1], s.fly[2], s.fly[3]);
    if (s.power === false && s.offFlash != null && s.offFlash < 1) { ctx.fillStyle = `rgba(18,26,32,${0.35 * (1 - s.offFlash)})`; ctx.fillRect(0, 106, 1920, 734); }
  }
  // baris dokumen yang sedang diketik: lines[] muncul satu per satu antara t0 dan t1
  function typed(arr, l, t0, t1, opt = {}) {
    const n = arr.length, out = [];
    for (let i = 0; i < n; i++) { const a = t0 + (t1 - t0) * i / n, d = (t1 - t0) / n; if (l < a && !(opt.pre && i < opt.pre)) break; const f = opt.pre && i < opt.pre ? 1 : clamp((l - a) / (d * 0.85), 0, 1); out.push({ t: arr[i], n: Math.round(arr[i].length * f), st: opt.st && opt.st(i) }); }
    return out;
  }
  const files = (extra) => (extra || []).concat(BASE_FILES);

  // keadaan awal tiap variasi (untuk adegan tanya/tebak)
  function startState(v, l) {
    if (v === 1) return { clock: "10.30", title: "Kunjungan ke Museum", badge: "belum", lines: DITO.map(t => ({ t })), ram: DITO.map(t => ({ t })), files: files(), cursor: true, l };
    if (v === 2) return { clock: "10.00", title: "Laporan Kebun Sekolah", badge: "belum", lines: SINTA.slice(0, 3).map(t => ({ t })), ram: SINTA.slice(0, 3).map(t => ({ t })), files: files(), cursor: true, l };
    if (v === 3) return { clock: "10.00", title: "Cerita Liburan", badge: "tersimpan", status: "simpan otomatis: nyala", statusColor: C.good, lines: LIBUR.slice(0, 1).map(t => ({ t })), ram: LIBUR.slice(0, 1).map(t => ({ t })), files: files([{ name: "Cerita Liburan", note: "10.00" }]), cursor: true, l };
    return { speed: 1, screen: "apps", open: ["Dokumen", "Musik"], slots: [["Dokumen", 1], ["Musik", 1]], files: files([{ name: "Laporan Kebun", note: "tersimpan" }]), l };
  }

  Object.assign(K.SCENES, {
    k1_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["membedakan isi RAM dan penyimpanan", "menebak apa yang hilang saat listrik padam", "memakai Simpan dan autosave dengan tepat", "mengatasi komputer yang lambat"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 860, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      M.ram(ctx, 1220, 320, 420, 100, { cells: ["H", "A", "L", "O"] }); M.disk(ctx, 1430, 590, 110, {}); text(ctx, "PENYIMPANAN", 1430, 700, 26, { align: "center", weight: 900, color: C.ink2 });
    },
    k1_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SIMULASI INI MELENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 420, 290, 1080, 330, { fill: C.bg2, r: 22 });
      text(ctx, "Episode D7.2", 960, 380, 60, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Mengenal Komputer: Perjalanan Satu Ketukan", 960, 450, 38, { align: "center", weight: 800 });
      text(ctx, "segmen Penyimpanan: RAM sementara, penyimpanan tetap", 960, 530, 28, { align: "center", weight: 700, color: C.ink2 });
      kiko(ctx, 1640, 700, 110, 0, { wave: l });
    },
    k1_alur(ctx, b, l) {
      const t1 = at(b, "membuka aplikasi"), t2 = at(b, "Yang kamu ketik"), t3 = at(b, "menekan Simpan"), a = b.audio || b.dur;
      const appIn = clamp((l - t1) / 1.4, 0, 1), saveU = clamp((l - t3 - 0.6) / 1.4, 0, 1);
      const lines = l < t2 ? [] : typed(DITO.slice(0, 3), l, t2, t3 - 0.2);
      const s = { clock: "09.00", title: "Kunjungan ke Museum", badge: l < t2 ? null : saveU >= 1 ? "tersimpan" : "belum", lines, ram: lines, cursor: l > t2, l,
        files: files(saveU >= 1 ? [{ name: "Kunjungan ke Museum", note: "baru disimpan", hl: C.goodBg }] : []) };
      if (l < t2) { s.screen = "desktop"; s.files = files(); }
      if (appIn > 0 && appIn < 1) s.fly = [DISKC, RAMC, appIn, "aplikasi dibuka"];
      if (saveU > 0 && saveU < 1) s.fly = [RAMC, [1500, 590], saveU, "Simpan"];
      comp(ctx, s);
      if (l > t1 && l < t2) { ctx.fillStyle = "#FFFFFF"; rr(ctx, 1094, 266, 652, 160, 10); ctx.fill(); text(ctx, "aplikasi Dokumen", 1420, 360, 32, { align: "center", weight: 900, color: C.ink2 }); }
    },
    k1_pilah(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      card(ctx, 160, 170, 780, 630, { fill: "#E6F2EC", stroke: GREEN_PCB, lw: 4, r: 22 }); card(ctx, 980, 170, 780, 630, { fill: "#F2F5F7", stroke: "#8EA1AD", lw: 4, r: 22 });
      text(ctx, "RAM: sedang dikerjakan", 550, 230, 34, { align: "center", weight: 900, color: GREEN_PCB }); text(ctx, "PENYIMPANAN: sudah tersimpan", 1370, 230, 34, { align: "center", weight: 900, color: C.ink2 });
      const items = [["laporan yang sedang diketik", 0, "tulisan", "laporan yang sedang"], ["game yang sedang dimainkan", 0, "video", "game"], ["file yang sudah disimpan", 1, "tulisan", "File yang sudah"], ["foto di galeri", 1, "foto", "foto"], ["aplikasi yang terpasang", 1, "folder", "aplikasi ada"]];
      const cnt = [0, 0];
      items.forEach(([s, side, kind, cue]) => { const t0 = at(b, cue); const k = cnt[side]++; if (l < t0) return; const u = ease((l - t0) / 0.5); const x = side ? 1020 : 200, y = 290 + k * 120; ctx.save(); ctx.globalAlpha = u; card(ctx, x, y, 700, 96, { fill: "#FFFFFF", r: 16 }); D.fileIcon(ctx, x + 60, y + 48, 56, kind, {}); text(ctx, s, x + 110, y + 58, 30, { weight: 800 }); ctx.restore(); });
    },
    k1_tanya(ctx, b, l) {
      const s = startState(b.v, l); s.ask = true; comp(ctx, s);
    },
    k1_tebak(ctx, b, l) {
      const s = startState(b.v, l); comp(ctx, s);
      card(ctx, 1040, 130, 760, 700, { fill: "#FFFFFF", stroke: C.accent, lw: 5, r: 22 });
      text(ctx, "TEBAK DULU", 1420, 196, 34, { align: "center", weight: 900, color: C.accentDark });
      b.options.forEach((o, i) => { const y = 240 + i * 140; card(ctx, 1080, y, 680, 116, { fill: C.bg2, r: 18 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(1136, y + 58, 30, 0, Math.PI * 2); ctx.fill(); text(ctx, "ABC"[i], 1136, y + 71, 34, { align: "center", weight: 900, color: "#fff" }); text(ctx, o, 1190, y + 70, 34, { weight: 800, fit: 550 }); });
      const frac = clamp(l / b.dur, 0, 1); ctx.lineWidth = 12; ctx.strokeStyle = "#D7E2DC"; ctx.beginPath(); ctx.arc(1420, 720, 36, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1420, 720, 36, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    },
    k1_v1(ctx, b, l) {
      const tT = at(b, "Dito mengetik"), tR = at(b, "hanya ada di RAM"), tO = at(b, "Listrik padam"), tN = at(b, "Saat komputer menyala");
      if (l < tO) { const lines = typed(DITO, l, tT, tR + 0.8, { pre: 2 }); comp(ctx, { clock: "10.30", title: "Kunjungan ke Museum", badge: "belum", lines, ram: lines, files: files(), cursor: true, l }); if (l > tR) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; rr(ctx, 1064, 242, 712, 222, 16); ctx.stroke(); } return; }
      if (l < tN) { comp(ctx, { power: false, offFlash: clamp((l - tO) / 0.8, 0, 1), ramFlash: clamp((l - tO) / 1.2, 0, 1), files: files(), clock: "10.30" }); return; }
      comp(ctx, { screen: "desktop", files: files(), desktopNote: l > tN + 1.2 ? "laporan Dito tidak ada" : null, ram: [], clock: "10.45" });
      if (l > tN + 1.2) { ctx.strokeStyle = C.bad; ctx.lineWidth = 6; rr(ctx, 1064, 522, 712, 302, 18); ctx.stroke(); text(ctx, "tidak ada file laporan", 1500, 800, 24, { align: "center", weight: 900, color: C.bad }); }
    },
    k1_v1h(ctx, b, l) {
      comp(ctx, { screen: "desktop", files: files(), desktopNote: "laporan Dito tidak ada", ram: [], clock: "10.45" });
      card(ctx, 200, 690, 760, 120, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); para(ctx, "belum disalin ke penyimpanan = hilang", 580, 742, 30, 700, { align: "center", weight: 900, color: C.bad });
    },
    k1_v2(ctx, b, l) {
      const tS = at(b, "menekan Simpan"), tA = at(b, "menambah"), tO = at(b, "Listrik padam");
      const saveU = clamp((l - tS - 0.3) / 1.4, 0, 1), saved = saveU >= 1;
      const savedFile = saved ? [{ name: "Laporan Kebun Sekolah", note: "3 kalimat, 10.00", hl: l < tA + 0.5 ? C.goodBg : null }] : [];
      if (l < tO) {
        let lines = SINTA.slice(0, 3).map(t => ({ t }));
        if (l > tA) { const f = clamp((l - tA) / ((tO - tA) * 0.8), 0, 1); lines = lines.concat([{ t: SINTA[3], n: Math.round(SINTA[3].length * f), st: "new" }]); }
        comp(ctx, { clock: l > tA ? "10.03" : "10.00", title: "Laporan Kebun Sekolah", badge: saved && l < tA ? "tersimpan" : "belum", lines, ram: lines, files: files(savedFile), cursor: true, l, fly: saveU > 0 && saveU < 1 ? [RAMC, [1500, 590], saveU, "Simpan"] : null });
        if (l > tS && l < tS + 1.6) { card(ctx, 330, 580, 300, 64, { fill: "#2B3A46", r: 14 }); text(ctx, "Ctrl + S", 480, 624, 32, { align: "center", weight: 900, color: "#fff" }); }
        return;
      }
      comp(ctx, { power: false, offFlash: clamp((l - tO) / 0.8, 0, 1), ramFlash: clamp((l - tO) / 1.2, 0, 1), files: files([{ name: "Laporan Kebun Sekolah", note: "3 kalimat, 10.00" }]), clock: "10.04" });
    },
    k1_v2h(ctx, b, l) {
      const tC = at(b, "menyalinnya"), tH = at(b, "jadi hanya");
      const u = clamp((l - tC) / 1.4, 0, 1);
      const lines = u < 1 ? [] : SINTA.slice(0, 3).map(t => ({ t })).concat(l > tH ? [{ t: SINTA[3], st: "lost" }] : []);
      comp(ctx, { clock: "10.20", title: "Laporan Kebun Sekolah", badge: u >= 1 ? "tersimpan" : null, screen: u > 0 ? "doc" : "desktop", lines, ram: u >= 1 ? SINTA.slice(0, 3).map(t => ({ t })) : [], files: files([{ name: "Laporan Kebun Sekolah", note: "3 kalimat, 10.00", hl: u > 0 && u < 1 ? "#FFF3D6" : null }]), fly: u > 0 && u < 1 ? [[1500, 590], RAMC, u, "dibuka"] : null, l });
    },
    k1_autosave(ctx, b, l) {
      const a = b.audio || b.dur, T = 1.6; // tiap ±1,6 detik di layar = dua menit simpan otomatis
      const k = Math.floor(l / T), f = (l % T) / T, n = clamp(1 + Math.floor(l / (T / 2)), 1, LIBUR.length);
      const lines = LIBUR.slice(0, n).map(t => ({ t })), saving = f < 0.35 && k > 0;
      const mins = 2 * Math.min(k, 4);
      comp(ctx, { clock: "10.0" + Math.min(9, Math.floor(l / T * 2)), title: "Cerita Liburan", badge: "tersimpan", status: saving ? "menyimpan…" : "tersimpan otomatis pukul 10.0" + mins, statusColor: C.good, lines, ram: lines, files: files([{ name: "Cerita Liburan", note: "otomatis, 10.0" + mins, hl: saving ? C.goodBg : null }]), cursor: true, l, fly: saving ? [RAMC, [1500, 590], f / 0.35, "otomatis"] : null });
    },
    k1_v3(ctx, b, l) {
      const tS = at(b, "Setiap dua menit"), tO = at(b, "listrik padam"), tR = at(b, "Tulisan satu menit");
      const m = l < tS ? 0 : clamp((l - tS) / (tO - tS) * 5, 0, 5); // menit 0..5
      const n = clamp(1 + Math.floor(m + 0.5), 1, 5);
      const lastSave = m >= 4 ? 4 : m >= 2 ? 2 : 0;
      const lines = LIBUR.slice(0, n).map((t, i) => ({ t, st: i >= lastSave + 1 && i >= 1 && lastSave > 0 && i > lastSave ? "new" : undefined }));
      // garis waktu di lajur atas
      const timeline = () => { const x0 = 430, w = 320; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, 170); ctx.lineTo(x0 + w, 170); ctx.stroke();
        [0, 2, 4].forEach(mm => { ctx.fillStyle = m >= mm ? C.good : "#B7C4CC"; ctx.beginPath(); ctx.arc(x0 + mm / 5 * w, 170, 10, 0, Math.PI * 2); ctx.fill(); text(ctx, "simpan", x0 + mm / 5 * w, 204, 18, { align: "center", weight: 800, color: C.good }); });
        ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(x0 + m / 5 * w, 170, 8, 0, Math.PI * 2); ctx.fill(); };
      const saving = (m >= 2 && m < 2.4) || (m >= 4 && m < 4.4);
      if (l < tO) {
        comp(ctx, { clock: "10.0" + Math.floor(m), title: "Cerita Liburan", badge: "tersimpan", status: saving ? "menyimpan…" : "tersimpan otomatis pukul 10.0" + lastSave, statusColor: C.good, lines, ram: lines, files: files([{ name: "Cerita Liburan", note: "otomatis, 10.0" + lastSave, hl: saving ? C.goodBg : null }]), cursor: true, l, fly: saving ? [RAMC, [1500, 590], ((m % 2) / 0.4), "otomatis"] : null });
      } else {
        comp(ctx, { power: false, offFlash: clamp((l - tO) / 0.8, 0, 1), ramFlash: clamp((l - tO) / 1.2, 0, 1), files: files([{ name: "Cerita Liburan", note: "otomatis, 10.04" }]), clock: "10.05" });
        if (l > tR) { card(ctx, 1080, 300, 680, 110, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 }); text(ctx, "hilang: “" + LIBUR[4] + "”", 1420, 366, 26, { align: "center", weight: 900, color: C.bad, fit: 640 }); }
      }
      timeline();
    },
    k1_v3h(ctx, b, l) {
      const tK = at(b, "Ctrl");
      const lines = LIBUR.slice(0, 4).map(t => ({ t })).concat([{ t: LIBUR[4], st: "lost" }]);
      comp(ctx, { clock: "10.20", title: "Cerita Liburan (dipulihkan)", badge: "tersimpan", lines: l > 1.5 ? lines : LIBUR.slice(0, 4).map(t => ({ t })), ram: LIBUR.slice(0, 4).map(t => ({ t })), files: files([{ name: "Cerita Liburan", note: "otomatis, 10.04", hl: C.goodBg }]), status: "versi dipulihkan: pukul 10.04", statusColor: C.kiko, l });
      if (l > tK) { const keys = [["Ctrl", 150], ["S", 90]]; let x = 330; card(ctx, 200, 690, 760, 120, { fill: "#FFFFFF", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "biasakan:", 230, 762, 28, { weight: 900, color: C.accentDark });
        keys.forEach(([k, w], i) => { const press = Math.floor((l - tK) * 1.5) % 2 === 0; ctx.fillStyle = press ? C.accent : "#F7FAFC"; rr(ctx, x + 60, 712 + (press ? 3 : 0), w, 74, 12); ctx.fill(); ctx.strokeStyle = "#8EA1AD"; ctx.lineWidth = 3; ctx.stroke(); text(ctx, k, x + 60 + w / 2, 760, 34, { align: "center", weight: 900 }); if (!i) text(ctx, "+", x + 60 + w + 30, 762, 40, { align: "center", weight: 900, color: C.ink2 }); x += w + 60; });
        text(ctx, "= Simpan", 760, 762, 32, { weight: 900, color: C.good }); }
    },
    k1_v4q(ctx, b, l) {
      const s = startState(4, l); s.ask = true; comp(ctx, s);
      const names = ["Game", "Browser 12 tab", "Pengedit Foto"]; names.forEach((nm, i) => { const t0 = at(b, nm.split(" ")[0].replace("Pengedit", "pengedit").replace("Game", "game").replace("Browser", "browser")); if (l < t0) return; const ap = APPS.find(a => a[0] === nm); card(ctx, 1092 + i * 225, 360, 210, 56, { fill: ap[2], r: 10 }); text(ctx, "+ " + nm, 1197 + i * 225, 396, 22, { align: "center", weight: 900, color: "#fff", fit: 196 }); });
    },
    k1_v4(ctx, b, l) {
      const t0 = at(b, "Setiap aplikasi"), tF = at(b, "Saat RAM penuh"), tM = at(b, "memindahkan"), tL = at(b, "sehingga");
      const extra = ["Game", "Browser 12 tab", "Pengedit Foto"], step = (tF - t0) / 3;
      const open = ["Dokumen", "Musik"], slots = [["Dokumen", 1], ["Musik", 1]];
      extra.forEach((nm, i) => { const ts = t0 + i * step; if (l < ts) return; open.push(nm); slots.push([nm, APPS.find(a => a[0] === nm)[1], clamp((l - ts) / 0.6, 0, 1)]); });
      const sw = clamp((l - tM) / 1.2, 0, 1);
      if (sw > 0) { slots[0][2] = 1 - sw; slots[1][2] = 1 - sw; }
      const used = slots.reduce((a, s) => a + s[1] * (s[2] == null ? 1 : s[2]), 0);
      const speed = l < tM ? clamp(1 - Math.max(0, used - 4) * 0.12, 0.45, 1) : lerp(0.45, 0.15, clamp((l - tM) / 1.5, 0, 1));
      // saat dipindah, kotak aplikasi lain bergeser maju (digambar ulang tanpa yang dipindah)
      const shown = sw >= 1 ? slots.slice(2) : slots;
      comp(ctx, { screen: "apps", open, slots: shown.length && sw >= 1 ? shown.concat([]) : shown, speed, slow: l > tL, files: files([{ name: "Laporan Kebun", note: "tersimpan" }]), swap: sw > 0 ? [["Dokumen", sw], ["Musik", sw]] : null, l });
      if (sw > 0 && sw < 1) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(1170, 300); ctx.lineTo(1620, 760); ctx.stroke(); ctx.setLineDash([]); }
    },
    k1_v4h(ctx, b, l) {
      const tC = at(b, "Tutup aplikasi"), tK = at(b, "maka tempat"), tF = at(b, "File di penyimpanan");
      const close = clamp((l - tC - 0.3) / 1.0, 0, 1), back = clamp((l - tK) / 1.2, 0, 1);
      const open = ["Musik", "Dokumen", "Pengedit Foto"].concat(close < 1 ? ["Browser 12 tab", "Game"] : []);
      const slots = [["Pengedit Foto", 2]]; if (close < 1) slots.push(["Browser 12 tab", 3, 1 - close], ["Game", 3, 1 - close]);
      const slots2 = back > 0 ? [["Dokumen", 1, back], ["Musik", 1, back]].concat(slots) : slots;
      const speed = lerp(0.15, 1, clamp((l - tK) / 1.5, 0, 1));
      comp(ctx, { screen: "apps", open: close < 1 ? open : ["Dokumen", "Musik", "Pengedit Foto"], slots: slots2, speed, slow: l < tK, files: files([{ name: "Laporan Kebun", note: l > tF ? "aman ✓" : "tersimpan", noteColor: l > tF ? C.good : null, hl: l > tF ? C.goodBg : null }]).map(f => l > tF ? { ...f, note: "aman ✓", noteColor: C.good, hl: C.goodBg } : f), swap: back < 1 ? [["Dokumen", 1 - back], ["Musik", 1 - back]] : null, l });
      if (l > tC && close < 1) { card(ctx, 600, 560, 320, 70, { fill: C.bad, r: 14 }); text(ctx, "✕ tutup Game dan Browser", 760, 604, 22, { align: "center", weight: 900, color: "#fff" }); }
    },
    k1_latihan(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "COBA SENDIRI DI HALAMAN LATIHAN", 960, 192, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 200, 230, 780, 570, { fill: C.bg, stroke: "#B7C4CC", lw: 3, r: 20 });
      card(ctx, 220, 248, 740, 50, { fill: "#fff", r: 10 }); text(ctx, "belajar-informatika.vercel.app/d72", 590, 282, 24, { align: "center", weight: 800, color: C.kikoDark });
      const lv = l > at(b, "Urutkan") ? 1 : 0;
      ["1 Kelompokkan alat", "2 Urutkan perjalanan", "3 Hardware/software"].forEach((s, i) => { card(ctx, 222 + i * 248, 314, 238, 50, { fill: i === lv ? C.accent : "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, s, 341 + i * 248, 347, 20, { align: "center", weight: 900, fit: 226 }); });
      if (lv === 0) {
        [["RAM", "Proses"], ["hard disk", "Penyimpanan"], ["kartu memori", "Penyimpanan"], ["keyboard", "Input"]].forEach(([a, g], i) => { const y = 390 + i * 96; card(ctx, 240, y, 300, 76, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 12 }); text(ctx, a, 390, y + 48, 28, { align: "center", weight: 800 }); text(ctx, "→", 590, y + 50, 34, { align: "center", weight: 900, color: C.ink2 }); card(ctx, 640, y, 300, 76, { fill: l > 1 + i * 0.8 ? C.goodBg : C.bg2, r: 12 }); text(ctx, g, 790, y + 48, 28, { align: "center", weight: 800, color: l > 1 + i * 0.8 ? C.good : C.ink2 }); });
      } else {
        ["Dito menekan tombol H", "Prosesor membaca kode", "Huruf H ditaruh di RAM", "Layar menampilkan H", "Simpan: file ke hard disk"].forEach((s, i) => { const y = 386 + i * 80; card(ctx, 240, y, 700, 66, { fill: i === 4 ? C.goodBg : "#fff", stroke: "#B7C4CC", lw: 2, r: 12 }); text(ctx, (i + 1) + ". " + s, 270, y + 43, 26, { weight: 800 }); text(ctx, "▲▼", 900, y + 43, 22, { align: "right", weight: 900, color: C.ink2 }); });
      }
      card(ctx, 1040, 260, 700, 330, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1390, 330, 34, { align: "center", weight: 900 });
      para(ctx, "Di rumah, buka beberapa aplikasi di HP satu per satu. Catat kapan HP mulai lambat, lalu tutup aplikasi yang tidak dipakai dan bandingkan.", 1390, 390, 30, 620, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1680, 730, 90, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
