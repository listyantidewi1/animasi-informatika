/* S17 Simulasi praktik: mengamankan router Wi-Fi di rumah lewat halaman admin router generik (layar_web.js).
   Jendela browser di kiri (x 110–1410, y 122–822), panel kanan (x 1450–1820). Router, alamat, nama Wi-Fi, dan sandi rekaan
   (stiker sama dengan episode E.3: RUMAH-KITA-12 / 12345678 / admin). Tanpa merek atau model router sungguhan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, W = K.web;
  const { rr, text, para, card, kiko, kid, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B";
  const PX = 1450, PW = 370;
  const SEC_ITEMS = ["Terbuka (tanpa sandi)", "WEP (lama)", "WPA2-Personal", "WPA2/WPA3-Personal", "WPA3-Personal"], SEC_OK = SEC_ITEMS[3];
  const NEWPASS = "pisang-goreng-hangat-27", ADMIN_NEW = "••••••••••••••••••••••", GUEST_PASS = "jeruk-manis-tamu-8";
  const DEVICES = [{ name: "HP Ayah", kind: "hp", ip: "192.168.1.20" }, { name: "HP Ibu", kind: "hp", ip: "192.168.1.21" }, { name: "Laptop Dito", kind: "laptop", ip: "192.168.1.22" },
    { name: "TV ruang tamu", kind: "tv", ip: "192.168.1.23" }, { name: "Printer", kind: "printer", ip: "192.168.1.24" }];
  const STICKER = [["Wi-Fi", "RUMAH-KITA-12"], ["Sandi Wi-Fi", "12345678"], ["Halaman admin", "192.168.1.1"], ["Pengguna", "admin"], ["Sandi admin", "admin"]];
  const DEF = { adminNew: false, sec: SEC_ITEMS[1], wpass: "12345678", ssid: "RUMAH-KITA-12", guest: false, gname: "", gpass: "", iso: false };
  const DONE = { adminNew: true, sec: SEC_OK, wpass: NEWPASS, ssid: "rumah-biru", guest: true, gname: "rumah-biru-tamu", gpass: GUEST_PASS, iso: true };
  const WARN = "Sandi admin masih bawaan pabrik. Segera ganti di menu Sistem.";
  const A = b => b.audio || b.dur;
  const weak = s => s === SEC_ITEMS[0] || s === SEC_ITEMS[1];
  const P = (r, fx = 0.55, fy = 0.6) => ({ x: r.x + r.w * fx, y: r.y + r.h * fy });
  const strength = s => !s ? 0 : s.length < 9 ? 0 : s.length < 12 ? 1 : s.length < 16 ? 2 : s.length < 20 ? 3 : 4;

  // ---------- browser + halaman router ----------
  function browser(ctx, o = {}) {
    return W.browser(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { tabs: [{ title: o.tab || "Router", icon: o.tab === "Tab baru" ? "search" : "wifi" }], url: o.url != null ? o.url : "192.168.1.1", secure: o.secure != null ? o.secure : false,
      urlFocus: o.urlFocus, caret: o.urlFocus, loading: o.loading, canBack: o.canBack !== false });
  }
  // o: {menu, s (pengaturan), warn, warnKind, sub, f (isi kolom), open, hi, tog, devices, dirty, press, apply, done}
  function admin(ctx, o = {}) {
    const s = { ...DEF, ...(o.s || {}) };
    const bg = browser(ctx, { loading: o.loading });
    const ra = W.routerAdmin(ctx, bg, { active: o.menu || "Status", warn: o.warn, warnKind: o.warnKind });
    const c = ra.content; const ctl = {};
    W.clip(ctx, bg, () => {
      const fn = { "Status": pStatus, "Sistem": pSistem, "Keamanan": pKeamanan, "Wi-Fi": pWifi, "Jaringan Tamu": pTamu }[o.menu || "Status"];
      Object.assign(ctl, fn(ctx, c, s, o) || {});
      if (["Keamanan", "Wi-Fi", "Jaringan Tamu"].includes(o.menu)) ctl.save = footer(ctx, c, o.dirty, o.press);
      if (o.apply != null) applying(ctx, bg, o.apply);
    });
    return { bg, ra, c, ctl, menu: ra.menu };
  }
  function probe(ctx, fn) { ctx.save(); ctx.globalAlpha = 0; const g = fn(); ctx.restore(); return g; }
  function footer(ctx, c, dirty, press) {
    const y = WIN.y + WIN.h - 78; ctx.strokeStyle = W.UI.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(c.x - 36, y - 10); ctx.lineTo(c.x + c.w + 36, y - 10); ctx.stroke();
    if (dirty) { W.icon(ctx, "warn", c.x + 12, y + 26, 22, W.UI.warn); text(ctx, "Ada perubahan yang belum disimpan.", c.x + 34, y + 34, 21, { weight: 700, color: W.UI.warn }); }
    return W.button(ctx, c.x + c.w - 300, y, 300, 54, "Simpan dan Terapkan", { press, kind: dirty ? "primary" : "secondary" });
  }
  function applying(ctx, bg, u) {
    ctx.fillStyle = "rgba(31,42,51,0.35)"; ctx.fillRect(bg.x, bg.y, bg.w, bg.h);
    const w = 620, h = 230, x = bg.x + (bg.w - w) / 2, y = bg.y + (bg.h - h) / 2;
    card(ctx, x, y, w, h, { fill: "#FFFFFF", r: 16 });
    text(ctx, u < 1 ? "Menerapkan pengaturan…" : "Pengaturan tersimpan", x + 40, y + 62, 28, { weight: 900, color: u < 1 ? C.ink : GREEN });
    W.progress(ctx, x + 40, y + 110, w - 80, u, { color: u < 1 ? BLUE : GREEN });
    text(ctx, u < 1 ? "Wi-Fi terputus sebentar, lalu menyala lagi." : "Sambungkan ulang perangkat ke rumah-biru.", x + 40, y + 172, 22, { weight: 700, color: C.ink2 });
  }
  function pStatus(ctx, c, s, o) {
    const items = [["Internet", "Tersambung", GREEN], ["Nama Wi-Fi", s.ssid, C.ink], ["Keamanan", s.sec.replace("-Personal", ""), weak(s.sec) ? RED : GREEN]];
    const cw = (c.w - 32) / 3;
    items.forEach(([k, v, col], i) => { const x = c.x + i * (cw + 16); card(ctx, x, c.y, cw, 84, { fill: "#FFFFFF", stroke: "#DDE5EA", lw: 2, r: 12 });
      text(ctx, k, x + 18, c.y + 30, 18, { weight: 700, color: W.UI.ink3 }); text(ctx, v, x + 18, c.y + 66, 25, { weight: 900, color: col, fit: cw - 30 }); });
    const list = o.devices || DEVICES;
    W.devices(ctx, c.x, c.y + 104, c.w, list, { rh: 50 });
    return {};
  }
  const SUBS = ["Info", "Sandi Admin", "Pembaruan", "Mulai Ulang"];
  function pSistem(ctx, c, s, o) {
    const ctl = {}; let x = c.x; const sub = o.sub || "Info";
    SUBS.forEach(t => { const on = t === sub; ctx.font = `${on ? 800 : 600} 22px Inter`; const w = ctx.measureText(t).width;
      text(ctx, t, x, c.y + 30, 22, { weight: on ? 800 : 600, color: on ? BLUE : W.UI.ink2 }); if (on) { ctx.fillStyle = BLUE; ctx.fillRect(x, c.y + 42, w, 4); }
      ctl["sub_" + t] = { x: x - 8, y: c.y, w: w + 16, h: 46, cx: x + w / 2, cy: c.y + 22 }; x += w + 44; });
    ctx.strokeStyle = W.UI.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(c.x, c.y + 46); ctx.lineTo(c.x + c.w, c.y + 46); ctx.stroke();
    const y0 = c.y + 70;
    if (sub === "Info") {
      [["Nama perangkat", "Router Rumah"], ["Versi firmware", "1.0.3"], ["Waktu aktif", "12 hari 4 jam"], ["Alamat admin", "192.168.1.1"]].forEach(([k, v], i) => {
        text(ctx, k, c.x, y0 + 30 + i * 56, 22, { weight: 700, color: W.UI.ink2 }); text(ctx, v, c.x + 300, y0 + 30 + i * 56, 22, { weight: 800, color: C.ink }); });
    } else if (sub === "Sandi Admin") {
      const f = o.f || {};
      ctl.old = W.field(ctx, c.x, y0, 460, { label: "Sandi lama", value: f.old || "", password: true, focus: f.focus === "old", caret: true, h: 52 });
      ctl.nw = W.field(ctx, c.x, y0 + 96, 460, { label: "Sandi baru", value: f.nw || "", password: true, focus: f.focus === "nw", caret: true, h: 52 });
      ctl.nw2 = W.field(ctx, c.x, y0 + 192, 460, { label: "Ulangi sandi baru", value: f.nw2 || "", password: true, focus: f.focus === "nw2", caret: true, h: 52, ok: f.nw2 && f.nw2.length === (f.nw || "").length });
      if (f.nw) W.meter(ctx, c.x + 500, y0 + 140, 400, strength(f.nw));
      ctl.btn = W.button(ctx, c.x + 500, y0 + 224, 200, 52, "Simpan", { press: o.press, disabled: !(f.nw2 && f.nw2.length === (f.nw || "").length) });
    }
    return ctl;
  }
  function pKeamanan(ctx, c, s, o) {
    const ctl = {};
    W.row(ctx, c, c.y - 4, "Jenis keamanan", { h: 84 });
    const x = W.row(ctx, c, c.y + 84, "Sandi Wi-Fi", { h: 150, sub: "minimal 12 karakter" });
    const f = o.f || {};
    ctl.pass = W.field(ctx, x, c.y + 96, 470, { value: f.wpass != null ? f.wpass : s.wpass, show: true, password: true, focus: f.focus === "pass", caret: true, h: 52, mark: f.mark });
    W.meter(ctx, x, c.y + 166, 470, strength(f.wpass != null ? f.wpass : s.wpass));
    if (weak(s.sec) && !o.open) W.banner(ctx, c.x, c.y + 260, c.w, s.sec === SEC_ITEMS[1] ? "WEP adalah cara lama dan sudah tidak aman. Pilih WPA2 atau WPA3." : "Terbuka berarti siapa pun bisa tersambung tanpa sandi.", "bad");
    ctl.sel = W.select(ctx, x, c.y + 10, 470, s.sec, { open: o.open, items: SEC_ITEMS, hi: o.hi, sel: SEC_ITEMS.indexOf(s.sec), warn: [0, 1], bad: weak(s.sec) });
    return ctl;
  }
  function pWifi(ctx, c, s, o) {
    const ctl = {}, f = o.f || {};
    let x = W.row(ctx, c, c.y - 4, "Wi-Fi", { h: 76 }); W.toggle(ctx, x, c.y + 16, true, { label: "Menyala" });
    x = W.row(ctx, c, c.y + 76, "Nama Wi-Fi (SSID)", { h: 150, sub: "terlihat oleh tetangga" });
    ctl.ssid = W.field(ctx, x, c.y + 90, 470, { value: f.ssid != null ? f.ssid : s.ssid, focus: f.focus === "ssid", caret: true, h: 52, mark: f.mark, ok: f.ok, hint: f.ok ? "Nama netral: tidak menyebut siapa atau di mana." : null });
    x = W.row(ctx, c, c.y + 226, "Pita frekuensi", { h: 76 }); text(ctx, "2,4 GHz dan 5 GHz", x, c.y + 262, 22, { weight: 700, color: W.UI.ink2 });
    return ctl;
  }
  function pTamu(ctx, c, s, o) {
    const ctl = {}, f = o.f || {}; const tog = o.tog != null ? o.tog : s.guest ? 1 : 0;
    let x = W.row(ctx, c, c.y - 4, "Jaringan tamu", { h: 72 }); ctl.tog = W.toggle(ctx, x, c.y + 14, tog, { label: tog > 0.5 ? "Menyala" : "Mati" });
    if (tog > 0.5) {
      x = W.row(ctx, c, c.y + 68, "Nama jaringan tamu", { h: 76 }); ctl.name = W.field(ctx, x, c.y + 80, 470, { value: f.gname != null ? f.gname : s.gname, placeholder: "ketik nama", focus: f.focus === "name", caret: true, h: 50 });
      x = W.row(ctx, c, c.y + 144, "Keamanan", { h: 76 }); W.select(ctx, x, c.y + 156, 470, SEC_OK, { h: 50 });
      x = W.row(ctx, c, c.y + 220, "Sandi tamu", { h: 76 }); ctl.pass = W.field(ctx, x, c.y + 232, 470, { value: f.gpass != null ? f.gpass : s.gpass, password: true, focus: f.focus === "pass", caret: true, h: 50 });
      ctl.iso = W.checkbox(ctx, c.x, c.y + 318, "Pisahkan dari jaringan utama: tamu tidak bisa melihat perangkat keluarga", f.iso != null ? f.iso : s.iso, { size: 26 });
    } else text(ctx, "Nyalakan untuk membuat Wi-Fi terpisah bagi tamu dan perangkat pintar.", c.x, c.y + 120, 22, { weight: 600, color: W.UI.ink2 });
    return ctl;
  }

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
  function note(ctx, y, title, lines, opt = {}) {
    const h = 64 + lines.length * 32; card(ctx, PX, y, PW, h, { fill: opt.fill || "#FFFFFF", stroke: opt.stroke || "#D7E2DC", lw: 3, r: 16 });
    text(ctx, title, PX + 22, y + 40, 22, { weight: 900, color: opt.color || C.accentDark });
    lines.forEach((s, i) => { const t = typeof s === "string" ? { s } : s; text(ctx, t.s, PX + 22, y + 74 + i * 32, 21, { weight: 700, color: t.color || C.ink, fit: PW - 44 });
      if (t.strike) { ctx.font = "700 21px Inter"; const w = Math.min(PW - 44, ctx.measureText(t.s).width); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(PX + 18, y + 67 + i * 32); ctx.lineTo(PX + 26 + w, y + 67 + i * 32); ctx.stroke(); } });
    return y + h;
  }
  function keys(ctx, k, u) { if (k && u > 0 && u < 1) L.keys(ctx, PX + PW / 2, 712, k, { press: u, align: "center", size: 30 }); }
  const cursor = (ctx, p, kind) => L.cursor(ctx, p.x, p.y, { click: p.click, kind });
  const typed = W.typed;
  // detik sejak kemajuan langkah k melewati batas a (untuk animasi muat)
  const since = (S, k, a, span, ds) => { const unit = span / ds.reduce((x, y) => x + y, 0); if (!S.at(k) || S.p(k) < a) return -1; let t = (S.p(k) - a) * ds[k] * unit; for (let j = k + 1; j < ds.length; j++) t += S.p(j) * ds[j] * unit; return t; };
  // kartu perbandingan salah/benar
  function compare(ctx, title, left, right, showRight) {
    card(ctx, 160, 140, 1600, 680);
    text(ctx, title, 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
    const box = (x, ok, d) => { card(ctx, x, 250, 720, 540, { fill: ok ? "#F2FAF4" : "#FDF1F0", stroke: ok ? GREEN : RED, lw: 4, r: 20 });
      text(ctx, d.head, x + 360, 300, 30, { align: "center", weight: 900, color: ok ? GREEN : RED }); d.draw(ctx, x, 330); };
    box(220, false, left); if (showRight) box(980, true, right);
  }
  // HP generik dengan daftar Wi-Fi
  function phone(ctx, x, y, o = {}) {
    const w = 360, h = 660; ctx.fillStyle = "#26323B"; rr(ctx, x, y, w, h, 46); ctx.fill(); ctx.fillStyle = "#F4F7F9"; rr(ctx, x + 14, y + 14, w - 28, h - 28, 34); ctx.fill();
    ctx.fillStyle = "#26323B"; rr(ctx, x + w / 2 - 50, y + 24, 100, 22, 11); ctx.fill();
    const sx = x + 34, sw = w - 68; text(ctx, "Wi-Fi", sx, y + 106, 34, { weight: 900, color: C.ink }); W.toggle(ctx, x + w - 100, y + 80, true);
    text(ctx, "JARINGAN TERSEDIA", sx, y + 156, 17, { weight: 800, color: W.UI.ink3 });
    const items = []; (o.nets || []).forEach((n, i) => { const iy = y + 172 + i * 70; const hi = o.hi === i;
      card(ctx, sx - 10, iy, sw + 20, 62, { fill: hi ? "#DCE9F7" : "#FFFFFF", r: 12 });
      W.icon(ctx, "wifi", sx + 18, iy + 30, 28, n.on ? GREEN : W.UI.ink2); text(ctx, n.name, sx + 46, iy + (n.on ? 30 : 39), 22, { weight: 800, color: C.ink, fit: sw - 90 });
      if (n.on) text(ctx, "Tersambung", sx + 46, iy + 52, 16, { weight: 800, color: GREEN });
      W.icon(ctx, "lock", sx + sw - 6, iy + 31, 18, W.UI.ink3); items.push({ x: sx - 10, y: iy, w: sw + 20, h: 62 }); });
    if (o.dialog) { const dy = y + 380; ctx.fillStyle = "rgba(31,42,51,0.3)"; rr(ctx, x + 14, y + 14, w - 28, h - 28, 34); ctx.fill();
      card(ctx, sx - 14, dy, sw + 28, 230, { fill: "#FFFFFF", r: 18 }); text(ctx, "Sandi untuk rumah-biru", sx + 4, dy + 44, 21, { weight: 900, color: C.ink, fit: sw });
      W.field(ctx, sx + 4, dy + 66, sw - 8, { value: o.dialog.pass || "", password: true, focus: true, caret: true, h: 52 });
      items.btn = W.button(ctx, sx + sw - 170, dy + 150, 170, 52, "Hubungkan", { press: o.dialog.press }); }
    return { items, w, h };
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["mengganti sandi admin router", "memilih WPA2 atau WPA3", "mengganti nama dan sandi Wi-Fi", "membuat jaringan tamu"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1; });
      W.routerBox(ctx, 1320, 540, 150, { blink: l });
      ctx.save(); ctx.translate(1660 - 1560, 220 - 300); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(1560, 300); ctx.lineTo(1640, 330); ctx.lineTo(1640, 400); ctx.quadraticCurveTo(1640, 450, 1560, 480); ctx.quadraticCurveTo(1480, 450, 1480, 400); ctx.lineTo(1480, 330); ctx.closePath(); ctx.fill();
      W.icon(ctx, "check", 1560, 392, 70, "#FFFFFF"); ctx.restore();
      text(ctx, "router di rumahmu", 1320, 700, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      [["D9.2", "Jaringan Lokal dan Internet", "router, Wi-Fi, alamat IP"], ["E.3", "Keamanan Akun dan Jaringan Dasar", "sandi admin, WPA2/WPA3"], ["F11.8", "Troubleshooting dan Keamanan Lanjut", "enkripsi dan jaringan tamu"]].forEach(([c, t, s], i) => {
        const x = 230 + i * 500; card(ctx, x, 280, 460, 280, { fill: C.bg2, r: 22 });
        text(ctx, c, x + 230, 355, 54, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 230, 415, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 530, 24, { align: "center", weight: 600, color: C.ink2 }); });
      if (l > A(b) * 0.55) { card(ctx, 330, 600, 1040, 150, { fill: "#FFF3D6", r: 18 });
        kid(ctx, 440, 655, 52, {}); kid(ctx, 540, 640, 66, { hairColor: "#4A3A2A" });
        text(ctx, "Kerjakan bersama orang tua.", 640, 665, 34, { weight: 900, color: C.accentDark }); text(ctx, "Router dipakai seluruh keluarga.", 640, 710, 26, { weight: 700, color: C.ink2 }); }
      kiko(ctx, 1600, 690, 90, 0, { wave: l });
    },
    stiker(ctx, b, l) {
      const a = A(b); card(ctx, 160, 140, 1600, 680);
      text(ctx, "STIKER DI BAWAH ROUTER", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      W.routerBox(ctx, 520, 330, 170, { flip: true }); text(ctx, "router dibalik", 520, 450, 22, { align: "center", weight: 700, color: C.ink2 });
      ctx.fillStyle = "#FFFDF4"; rr(ctx, 560, 300, 110, 60, 6); ctx.fill(); ctx.strokeStyle = "#C9B98A"; ctx.lineWidth = 2; rr(ctx, 560, 300, 110, 60, 6); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(670, 300); ctx.lineTo(960, 250); ctx.moveTo(670, 360); ctx.lineTo(960, 626); ctx.stroke(); ctx.setLineDash([]);
      const hi = l < a * 0.25 ? null : l < a * 0.45 ? 2 : l < a * 0.62 ? 3 : 4;
      W.sticker(ctx, 960, 240, 700, STICKER, { title: "ROUTER RUMAH · contoh", size: 34, hi, kw: 330 });
      if (l > a * 0.7) { card(ctx, 240, 520, 600, 220, { fill: "#FBE1DF", r: 18 }); W.icon(ctx, "warn", 290, 580, 40, RED);
        para(ctx, "Sandi bawaan seperti ini sama di banyak router. Ganti setelah masuk.", 330, 580, 28, 480, { weight: 800, lh: 1.3 }); }
    },
    alamat(ctx, b, l) {
      const span = A(b) * 0.9, ds = [0.4, 1, 3.4, 0.8, 1.4], S = W.seq(l, span, ds);
      const t = since(S, 3, 0.45, span, ds);
      const url = typed("192.168.1.1", S.p(2) / 0.9);
      if (t < 0.4) { const bg = browser(ctx, { tab: "Tab baru", url: S.at(1) && S.p(1) > 0.6 ? url : "", secure: true, urlFocus: S.at(1) && S.p(1) > 0.6, loading: t >= 0 ? t / 0.5 : 0, canBack: false });
        text(ctx, "Tab baru", bg.x + bg.w / 2, bg.y + 260, 40, { align: "center", weight: 800, color: "#C9D4DB" }); }
      else { const bg = browser(ctx, { loading: t < 0.5 ? t / 0.5 : 0 }); W.routerLogin(ctx, bg, {}); }
      const n = S.n >= 4 ? 3 : S.i <= 1 ? 0 : S.i === 2 ? 1 : 2;
      steps(ctx, "LANGKAH", ["Klik bilah alamat.", "Ketik 192.168.1.1", "Tekan Enter."], n);
      W.sticker(ctx, PX, 400, PW, [["Halaman admin", "192.168.1.1"], ["Pengguna", "admin"], ["Sandi admin", "admin"]], { title: "DARI STIKER", size: 24, hi: 0, kw: 190 });
      if (t > 1) L.callout(ctx, PX, 640, "Tanda Tidak aman di bilah alamat wajar untuk halaman router di rumah.", null, null, { size: 21, maxW: 330, fill: "#F4F6F5", color: "#9AAFA6" });
      const urlP = { x: 700, y: WIN.y + 86 };
      const p = W.path(l, span, [{ x: 900, y: 600, d: 0.4 }, { ...urlP, d: 1, click: true }, { ...urlP, d: 5.6 }], { x: 900, y: 600 });
      if (t < 0) cursor(ctx, p, S.at(1) && S.p(1) > 0.6 ? "text" : "arrow");
      if (S.i === 3) keys(ctx, ["Enter"], S.p(3));
    },
    login(ctx, b, l) {
      const span = A(b) * 0.9, ds = [0.3, 0.9, 1, 0.9, 1, 0.9, 0.9], S = W.seq(l, span, ds);
      const g = probe(ctx, () => W.routerLogin(ctx, browser(ctx, {}), {}));
      const t = since(S, 5, 0.6, span, ds);
      const focus = S.at(3) && S.p(3) > 0.6 ? "pass" : S.at(1) && S.p(1) > 0.6 ? "user" : null;
      if (t < 0.4) { const bg = browser(ctx, { loading: t >= 0 ? t / 0.5 : 0 }); W.routerLogin(ctx, bg, { user: typed("admin", S.p(2) / 0.9), pass: typed("admin", S.p(4) / 0.9), focus: t >= 0 ? null : focus, caret: true, press: S.i === 5 ? S.p(5) : 0 }); }
      else admin(ctx, { warn: WARN, loading: t < 0.5 ? t / 0.5 : 0 });
      steps(ctx, "LANGKAH", ["Nama pengguna: admin", "Sandi: admin (dari stiker)", "Klik Masuk."], S.i <= 2 ? 0 : S.i <= 4 ? 1 : S.n >= 6 ? 3 : 2);
      if (t < 0.4) W.sticker(ctx, PX, 430, PW, [["Pengguna", "admin"], ["Sandi admin", "admin"]], { title: "DARI STIKER", size: 24, hi: S.i <= 2 ? 0 : 1, kw: 190 });
      const p = W.path(l, span, [{ x: 900, y: 700, d: 0.3 }, { ...P(g.user), d: 0.9, click: true }, { ...P(g.user), d: 1 }, { ...P(g.pass), d: 0.9, click: true }, { ...P(g.pass), d: 1 }, { ...P(g.btn), d: 0.9, click: true }, { ...P(g.btn), d: 0.9 }], { x: 900, y: 700 });
      if (t < 0.4) cursor(ctx, p, focus && S.i !== 5 && S.i !== 3 ? "text" : "arrow");
    },
    dasbor(ctx, b, l) {
      const a = A(b), g = admin(ctx, { warn: WARN });
      const k = Math.floor((l - a * 0.22) / (a * 0.1));
      if (k >= 0 && k < 5) { const r = g.menu(W.ROUTER_MENU[k]); ctx.strokeStyle = C.accent; ctx.lineWidth = 5; rr(ctx, r.x + 6, r.y + 2, r.w - 12, r.h - 4, 10); ctx.stroke(); }
      steps(ctx, "MENU ROUTER", ["Status: ringkasan", "Wi-Fi: nama Wi-Fi", "Keamanan: jenis dan sandi", "Jaringan Tamu", "Sistem: sandi admin"], clamp(k, 0, 5));
      if (l > a * 0.75) L.callout(ctx, PX, 640, "Di router lain, menu bisa bernama Wireless, Security, atau Advanced.", null, null, { size: 21, maxW: 330, fill: "#F4F6F5", color: "#9AAFA6" });
    },
    admin_buka(ctx, b, l) {
      const span = A(b) * 0.9, ds = [1.8, 1.2, 0.6, 1.2, 1], S = W.seq(l, span, ds);
      const g0 = probe(ctx, () => admin(ctx, { warn: WARN, menu: "Sistem" }));
      const menu = S.at(1) && S.p(1) > 0.6 ? "Sistem" : "Status", sub = S.at(3) && S.p(3) > 0.6 ? "Sandi Admin" : "Info";
      const g = admin(ctx, { warn: WARN, menu, sub });
      if (S.i === 0) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; rr(ctx, g.c.x - 42, WIN.y + 108 + 78, g.c.w + 72, 66, 12); ctx.stroke(); L.callout(ctx, PX, 470, "Peringatan: sandi admin masih bawaan", g.c.x + g.c.w + 30, WIN.y + 108 + 110, { maxW: 320, color: RED, fill: "#FBE1DF" }); }
      steps(ctx, "LANGKAH", ["Baca peringatannya.", "Klik menu Sistem.", "Pilih Sandi Admin."], S.i === 0 ? 0 : S.i <= 2 ? 1 : S.n >= 4 ? 3 : 2);
      const p = W.path(l, span, [{ x: 900, y: 700, d: 1.8 }, { ...P(g0.menu("Sistem"), 0.45), d: 1.2, click: true }, { ...P(g0.menu("Sistem"), 0.45), d: 0.6 }, { ...P(g0.ctl["sub_Sandi Admin"]), d: 1.2, click: true }, { x: 900, y: 720, d: 1 }]);
      cursor(ctx, p);
    },
    admin_ketik(ctx, b, l) {
      const span = A(b) * 0.9, ds = [0.8, 1, 0.8, 2.2, 0.8, 2.2, 1], S = W.seq(l, span, ds);
      const g = probe(ctx, () => admin(ctx, { warn: WARN, menu: "Sistem", sub: "Sandi Admin" }));
      const focus = S.i >= 5 || (S.i === 4 && S.p(4) > 0.6) ? "nw2" : S.i >= 3 || (S.i === 2 && S.p(2) > 0.6) ? "nw" : S.p(0) > 0.6 || S.i >= 1 ? "old" : null;
      const f = { old: typed("admin", S.p(1) / 0.9), nw: typed(ADMIN_NEW, S.p(3) / 0.9), nw2: typed(ADMIN_NEW, S.p(5) / 0.9), focus };
      admin(ctx, { warn: WARN, menu: "Sistem", sub: "Sandi Admin", f });
      steps(ctx, "LANGKAH", ["Sandi lama: admin", "Sandi baru: frasa panjang", "Ulangi sandi baru."], S.i <= 1 ? 0 : S.i <= 3 ? 1 : S.n >= 6 ? 3 : 2);
      note(ctx, 470, "SANDI ADMIN YANG BAIK", ["frasa panjang, 4 kata atau lebih", "bukan nama atau tanggal lahir", "dicatat di tempat aman", "bersama orang tua"]);
      const p = W.path(l, span, [{ ...P(g.ctl.old, 0.8), d: 0.8, click: true }, { ...P(g.ctl.old, 0.8), d: 1 }, { ...P(g.ctl.nw, 0.8), d: 0.8, click: true }, { ...P(g.ctl.nw, 0.8), d: 2.2 }, { ...P(g.ctl.nw2, 0.8), d: 0.8, click: true }, { ...P(g.ctl.nw2, 0.8), d: 3.2 }], { x: 900, y: 720 });
      cursor(ctx, p, "text");
    },
    admin_simpan(ctx, b, l) {
      const span = A(b) * 0.9, ds = [1, 1.6, 1, 1.2, 1, 2], S = W.seq(l, span, ds);
      const f = { old: "admin", nw: ADMIN_NEW, nw2: ADMIN_NEW };
      const g = probe(ctx, () => admin(ctx, { warn: WARN, menu: "Sistem", sub: "Sandi Admin", f }));
      const gl = probe(ctx, () => W.routerLogin(ctx, browser(ctx, {}), {}));
      let p;
      if (S.i <= 1) { const saved = S.i === 1 || S.p(0) > 0.6; admin(ctx, { warn: saved ? "Sandi admin berhasil diganti. Silakan masuk lagi dengan sandi baru." : WARN, warnKind: saved ? "good" : "warn", menu: "Sistem", sub: "Sandi Admin", f, press: S.i === 0 ? S.p(0) : 0 });
        p = W.path(l, span, [{ ...P(g.ctl.btn), d: 1, click: true }, { ...P(g.ctl.btn), d: 1.6 }], { x: 900, y: 720 }); }
      else if (S.i <= 4) { const bg = browser(ctx, {}); W.routerLogin(ctx, bg, { user: "admin", pass: typed(ADMIN_NEW, S.p(3) / 0.9), focus: S.i === 4 ? null : "pass", caret: true, press: S.i === 4 ? S.p(4) : 0 });
        p = W.path(l, span, [{ x: 900, y: 720, d: 2.6 }, { ...P(gl.pass), d: 1, click: true }, { ...P(gl.pass), d: 1.2 }, { ...P(gl.btn), d: 1, click: true }]); }
      else { admin(ctx, {}); L.callout(ctx, PX, 470, "Peringatan sandi bawaan sudah hilang.", null, null, { color: GREEN, fill: C.goodBg, maxW: 320 }); }
      steps(ctx, "LANGKAH", ["Klik Simpan.", "Masuk lagi dengan sandi baru.", "Peringatan hilang."], S.i <= 1 ? 0 : S.i <= 4 ? 1 : 3);
      if (p) cursor(ctx, p, S.i === 2 || S.i === 3 ? "text" : "arrow");
    },
    keamanan_buka(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [0.6, 1.2, 3], S = W.seq(l, span, ds);
      const g0 = probe(ctx, () => admin(ctx, {}));
      const on = S.at(1) && S.p(1) > 0.6;
      const g = admin(ctx, { menu: on ? "Keamanan" : "Status" });
      steps(ctx, "LANGKAH", ["Klik menu Keamanan.", "Lihat jenis keamanan."], on ? (l > a * 0.6 ? 2 : 1) : 0);
      if (on && l > a * 0.45) L.callout(ctx, PX, 400, "WEP: cara lama, mudah dibobol", g.ctl.sel.x + g.ctl.sel.w, g.ctl.sel.cy, { color: RED, fill: "#FBE1DF", maxW: 320 });
      const p = W.path(l, span, [{ x: 900, y: 720, d: 0.6 }, { ...P(g0.menu("Keamanan"), 0.45), d: 1.2, click: true }, { x: 1000, y: 740, d: 3 }]);
      cursor(ctx, p);
    },
    keamanan_pilih(ctx, b, l) {
      const span = A(b) * 0.9, ds = [1, 1.6, 0.8, 1, 1.2, 1.2], S = W.seq(l, span, ds);
      const g0 = probe(ctx, () => admin(ctx, { menu: "Keamanan", open: true }));
      const open = (S.p(0) > 0.6 || S.i >= 1) && !(S.i >= 4 && S.p(4) > 0.6) && S.i < 5;
      const picked = (S.i === 4 && S.p(4) > 0.6) || S.i >= 5;
      const hi = S.i === 1 ? 0 : S.i === 2 ? 1 : S.i >= 3 ? 3 : null;
      const g = admin(ctx, { menu: "Keamanan", open, hi, s: { sec: picked ? SEC_OK : DEF.sec }, dirty: picked });
      steps(ctx, "LANGKAH", ["Klik kotak pilihan.", "Jangan Terbuka atau WEP.", "Pilih WPA2/WPA3-Personal."], S.i === 0 ? 0 : S.i <= 2 ? 1 : picked ? 3 : 2);
      if (open && S.i === 1) L.callout(ctx, PX, 420, "✗ Terbuka: tanpa sandi", g0.ctl.sel.item(0).x + g0.ctl.sel.w, g0.ctl.sel.item(0).cy, { color: RED, fill: "#FBE1DF", maxW: 320 });
      if (open && S.i === 2) L.callout(ctx, PX, 420, "✗ WEP: lama, mudah dibobol", g0.ctl.sel.item(1).x + g0.ctl.sel.w, g0.ctl.sel.item(1).cy, { color: RED, fill: "#FBE1DF", maxW: 320 });
      if (picked) L.callout(ctx, PX, 420, "✓ WPA2/WPA3: HP lama dan baru bisa tersambung", g.ctl.sel.x + g.ctl.sel.w, g.ctl.sel.cy, { color: GREEN, fill: C.goodBg, maxW: 320 });
      const it = i => P(g0.ctl.sel.item(i), 0.4);
      const p = W.path(l, span, [{ ...P(g0.ctl.sel, 0.85), d: 1, click: true }, { ...it(0), d: 1.6 }, { ...it(1), d: 0.8 }, { ...it(3), d: 1 }, { ...it(3), d: 1.2, click: true }, { x: 1000, y: 740, d: 1.2 }], { x: 900, y: 720 });
      cursor(ctx, p);
    },
    sandi_wifi(ctx, b, l) {
      const span = A(b) * 0.9, ds = [1, 1, 3.2, 1.6], S = W.seq(l, span, ds);
      const s = { sec: SEC_OK };
      const g0 = probe(ctx, () => admin(ctx, { menu: "Keamanan", s }));
      const focus = S.p(0) > 0.6 || S.i >= 1;
      const sel = S.i === 1 && S.p(1) > 0.3;
      const wpass = S.i >= 2 ? typed(NEWPASS, S.p(2) / 0.9) : "12345678";
      admin(ctx, { menu: "Keamanan", s, f: { wpass: S.i >= 2 && !wpass ? "" : wpass, focus: focus ? "pass" : null, mark: sel ? [0, 8] : null }, dirty: true });
      steps(ctx, "LANGKAH", ["Klik kolom Sandi Wi-Fi.", "Tekan Ctrl+A untuk memilih semua.", "Ketik frasa panjang baru."], S.i === 0 ? 0 : S.i === 1 ? 1 : S.n >= 3 ? 3 : 2);
      if (S.i >= 3) L.callout(ctx, PX, 520, "23 karakter: sangat kuat", g0.ctl.pass.x + g0.ctl.pass.w, g0.ctl.pass.cy + 60, { color: GREEN, fill: C.goodBg, maxW: 320 });
      if (S.i === 1) keys(ctx, ["Ctrl", "A"], S.p(1));
      const p = W.path(l, span, [{ ...P(g0.ctl.pass, 0.7), d: 1, click: true }, { ...P(g0.ctl.pass, 0.7), d: 5.8 }], { x: 900, y: 720 });
      cursor(ctx, p, "text");
    },
    nama_wifi(ctx, b, l) {
      const a = A(b), span = a * 0.9, S = W.seq(l, span, [0.6, 1.2, 3]);
      const g0 = probe(ctx, () => admin(ctx, { menu: "Keamanan" }));
      const on = S.at(1) && S.p(1) > 0.6, dirty = true, s = { sec: SEC_OK, wpass: NEWPASS };
      const g = admin(ctx, { menu: on ? "Wi-Fi" : "Keamanan", s, dirty });
      steps(ctx, "LANGKAH", ["Klik menu Wi-Fi.", "Lihat Nama Wi-Fi (SSID)."], on ? (l > a * 0.5 ? 2 : 1) : 0);
      if (l > a * 0.45) note(ctx, 380, "JANGAN SEPERTI INI", [{ s: "Keluarga_Pratama_Jl_Mawar12", strike: true }, { s: "Rumah No 7 Pak Budi", strike: true }, { s: "Kos Melati Kamar 3", strike: true }], { stroke: RED, color: RED });
      const p = W.path(l, span, [{ x: 900, y: 720, d: 0.6 }, { ...P(g0.menu("Wi-Fi"), 0.45), d: 1.2, click: true }, { x: 1000, y: 740, d: 3 }]);
      cursor(ctx, p);
    },
    nama_ketik(ctx, b, l) {
      const span = A(b) * 0.9, ds = [1, 1, 2, 2], S = W.seq(l, span, ds), s = { sec: SEC_OK, wpass: NEWPASS };
      const g0 = probe(ctx, () => admin(ctx, { menu: "Wi-Fi", s }));
      const focus = S.p(0) > 0.6 || S.i >= 1;
      const ssid = S.i >= 2 ? typed("rumah-biru", S.p(2) / 0.9) : "RUMAH-KITA-12";
      admin(ctx, { menu: "Wi-Fi", s, f: { ssid, focus: focus && S.i < 3 ? "ssid" : null, mark: S.i === 1 && S.p(1) > 0.3 ? [0, 13] : null, ok: S.i >= 3 }, dirty: true });
      steps(ctx, "LANGKAH", ["Klik kolom nama.", "Ctrl+A, lalu hapus nama lama.", "Ketik rumah-biru."], S.i === 0 ? 0 : S.i === 1 ? 1 : S.n >= 3 ? 3 : 2);
      if (S.i === 1) keys(ctx, ["Ctrl", "A"], S.p(1));
      if (S.i >= 3) note(ctx, 420, "NAMA YANG NETRAL", [{ s: "rumah-biru", color: GREEN }, "tidak menyebut siapa pemiliknya", "tidak menyebut di mana rumahnya"], { stroke: GREEN, color: GREEN });
      const p = W.path(l, span, [{ ...P(g0.ctl.ssid, 0.7), d: 1, click: true }, { ...P(g0.ctl.ssid, 0.7), d: 5 }], { x: 900, y: 720 });
      cursor(ctx, p, "text");
    },
    tamu_buka(ctx, b, l) {
      const a = A(b), span = a * 0.9, S = W.seq(l, span, [0.6, 1.2, 3]), s = { ...DONE, guest: false, gname: "", gpass: "", iso: false };
      const g0 = probe(ctx, () => admin(ctx, { menu: "Wi-Fi", s }));
      const on = S.at(1) && S.p(1) > 0.6;
      admin(ctx, { menu: on ? "Jaringan Tamu" : "Wi-Fi", s, dirty: true });
      steps(ctx, "LANGKAH", ["Klik menu Jaringan Tamu."], on ? 1 : 0);
      if (l > a * 0.35) { // diagram jaringan utama vs tamu
        const y = 270; card(ctx, PX, y, PW, 520, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
        const grp = (yy, title, col, items) => { card(ctx, PX + 20, yy, PW - 40, 200, { fill: col === GREEN ? "#F2FAF4" : "#EEF4FB", stroke: col, lw: 3, r: 14 });
          text(ctx, title, PX + 40, yy + 38, 22, { weight: 900, color: col }); items.forEach(([k, n], i) => { W.icon(ctx, k, PX + 64 + i * 96, yy + 100, 44, C.ink2); text(ctx, n, PX + 64 + i * 96, yy + 160, 17, { align: "center", weight: 700, color: C.ink2 }); }); };
        grp(y + 24, "rumah-biru: keluarga", GREEN, [["laptop", "laptop"], ["hp", "HP Ayah"], ["printer", "printer"]]);
        ctx.fillStyle = "#9AA8B1"; for (let i = 0; i < 6; i++) rr(ctx, PX + 30 + i * 54, y + 238, 46, 18, 4), ctx.fill();
        W.icon(ctx, "lock", PX + PW / 2, y + 247, 30, RED);
        grp(y + 280, "rumah-biru-tamu", BLUE, [["hp", "HP tamu"], ["tv", "TV pintar"], ["kamera", "kamera"]]);
      }
      const p = W.path(l, span, [{ x: 900, y: 720, d: 0.6 }, { ...P(g0.menu("Jaringan Tamu"), 0.45), d: 1.2, click: true }, { x: 1000, y: 740, d: 3 }]);
      cursor(ctx, p);
    },
    tamu_atur(ctx, b, l) {
      const span = A(b) * 0.9, ds = [1, 0.9, 1.8, 0.9, 1.8, 1, 0.8], S = W.seq(l, span, ds), s = { ...DONE, guest: false, gname: "", gpass: "", iso: false };
      const g0 = probe(ctx, () => admin(ctx, { menu: "Jaringan Tamu", s, tog: 1 }));
      const tog = S.i === 0 ? clamp((S.p(0) - 0.6) / 0.3, 0, 1) : 1;
      const f = { gname: typed("rumah-biru-tamu", S.p(2) / 0.9), gpass: typed(GUEST_PASS, S.p(4) / 0.9), iso: S.i >= 5 && (S.i > 5 || S.p(5) > 0.6),
        focus: S.i >= 3 && (S.i > 3 || S.p(3) > 0.6) && S.i < 5 ? "pass" : S.i >= 1 && (S.i > 1 || S.p(1) > 0.6) && S.i < 3 ? "name" : null };
      admin(ctx, { menu: "Jaringan Tamu", s, tog, f, dirty: true });
      steps(ctx, "LANGKAH", ["Nyalakan sakelar.", "Nama: rumah-biru-tamu", "Buat sandi tamu.", "Centang Pisahkan."], S.i === 0 ? 0 : S.i <= 2 ? 1 : S.i <= 4 ? 2 : S.n >= 6 ? 4 : 3);
      const c = g0.ctl;
      const p = W.path(l, span, [{ ...P(c.tog, 0.5), d: 1, click: true }, { ...P(c.name, 0.7), d: 0.9, click: true }, { ...P(c.name, 0.7), d: 1.8 }, { ...P(c.pass, 0.7), d: 0.9, click: true }, { ...P(c.pass, 0.7), d: 1.8 }, { x: c.iso.cx, y: c.iso.cy + 4, d: 1, click: true }, { x: 1000, y: 750, d: 0.8 }], { x: 900, y: 720 });
      cursor(ctx, p, f.focus ? "text" : "arrow");
    },
    simpan(ctx, b, l) {
      const span = A(b) * 0.9, ds = [1.2, 3, 1.6], S = W.seq(l, span, ds), s = { ...DONE };
      const g0 = probe(ctx, () => admin(ctx, { menu: "Jaringan Tamu", s, dirty: true }));
      const clicked = S.at(1) || S.p(0) > 0.6;
      const apply = !clicked ? null : S.i === 0 ? 0 : S.i === 1 ? S.p(1) : 1;
      admin(ctx, { menu: "Jaringan Tamu", s, dirty: !clicked, press: S.i === 0 ? S.p(0) : 0, apply });
      steps(ctx, "LANGKAH", ["Klik Simpan dan Terapkan.", "Tunggu sampai selesai.", "Wi-Fi menyala lagi."], !clicked ? 0 : S.i === 1 ? 1 : 3);
      W.routerBox(ctx, PX + PW / 2, 560, 110, { lamps: [true, true, S.i !== 1, true], blink: S.i === 1 ? null : null });
      text(ctx, S.i === 1 ? "lampu Wi-Fi padam sebentar" : apply === 1 ? "Wi-Fi menyala lagi" : "", PX + PW / 2, 680, 22, { align: "center", weight: 700, color: C.ink2 });
      if (S.i === 0) { const p = W.path(l, span, [{ ...P(g0.ctl.save), d: 1.2, click: true }], { x: 900, y: 600 }); cursor(ctx, p); }
    },
    sambung(ctx, b, l) {
      const a = A(b), span = a * 0.9, ds = [1.6, 1, 2, 1, 1.4], S = W.seq(l, span, ds);
      card(ctx, 160, 140, 1600, 680);
      const nets = [{ name: "rumah-biru" }, { name: "rumah-biru-tamu" }, { name: "WARKOP-SEBERANG" }, { name: "Tetangga-5G" }];
      const done = S.i === 4 || (S.i === 3 && S.p(3) > 0.6);
      if (done) nets[0].on = true;
      const dialog = S.i >= 2 && !done ? { pass: typed("•".repeat(NEWPASS.length), S.p(2) / 0.9), press: S.i === 3 ? S.p(3) : 0 } : null;
      const ph = phone(ctx, 780, 150, { nets, hi: S.i === 1 ? 0 : null, dialog });
      // catatan kiri
      card(ctx, 220, 220, 500, 210, { fill: "#FBE1DF", r: 18 }); text(ctx, "Wi-Fi lama", 250, 270, 26, { weight: 900, color: RED });
      text(ctx, "RUMAH-KITA-12", 250, 330, 34, { weight: 900, color: C.ink2 }); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(244, 318); ctx.lineTo(530, 318); ctx.stroke();
      text(ctx, "sudah tidak ada di daftar", 250, 390, 24, { weight: 700, color: C.ink2 });
      card(ctx, 220, 470, 500, 230, { fill: C.goodBg, r: 18 }); text(ctx, "Wi-Fi baru", 250, 520, 26, { weight: 900, color: GREEN });
      text(ctx, "rumah-biru", 250, 580, 34, { weight: 900, color: C.ink }); text(ctx, "sandi Wi-Fi yang baru", 250, 640, 24, { weight: 700, color: C.ink2 });
      steps(ctx, "DI SETIAP PERANGKAT", ["Buka daftar Wi-Fi.", "Pilih rumah-biru.", "Ketik sandi baru.", "Klik Hubungkan."], S.i === 0 ? 0 : S.i === 1 ? 1 : S.i === 2 ? 2 : done ? 4 : 3, 180);
      const it = ph.items[0];
      const p = W.path(l, span, [{ x: 1100, y: 700, d: 1.6 }, { ...P(it, 0.5), d: 1, click: true }, { x: 1010, y: 610, d: 2 }, { x: 1040, y: 680, d: 1, click: true }, { x: 1080, y: 760, d: 1.4 }], { x: 1100, y: 700 });
      cursor(ctx, p);
    },
    perangkat(ctx, b, l) {
      const a = A(b), k = clamp(Math.floor((l - a * 0.1) / (a * 0.13)), 0, 5);
      const devices = DEVICES.map((d, i) => ({ ...d, on: i < k, net: i < k ? "rumah-biru" : "Terputus", hi: i === k - 1 ? "good" : null }));
      admin(ctx, { s: DONE, devices });
      steps(ctx, "SAMBUNG ULANG", DEVICES.map(d => d.name), k);
      if (k >= 5) L.callout(ctx, PX, 690, "Semua tersambung lagi", null, null, { color: GREEN, fill: C.goodBg });
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 280, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 290, 245, 20, 70, 6); ctx.fill(); rr(ctx, 330, 245, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 268, 44, { weight: 900, color: C.accentDark }); text(ctx, "Bersama orang tua. Hentikan video, kerjakan, lalu putar lagi.", 430, 316, 28, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 380 + i * 104, 900, 88, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 436 + i * 104, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 435 + i * 104, 27, { weight: 700, fit: 790 }); });
      card(ctx, 1170, 380, 540, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "Belum bisa di rumah?", 1200, 430, 26, { weight: 900, color: C.ink });
      para(ctx, "Pakai latihan Atur router fiktif di halaman episode E.3:", 1200, 480, 24, 480, { weight: 700, lh: 1.3, color: C.ink2 });
      card(ctx, 1200, 560, 480, 64, { fill: C.bg2, r: 12 }); text(ctx, "belajar-informatika.vercel.app/e3", 1440, 601, 24, { align: "center", weight: 800, color: C.kikoDark });
      W.routerBox(ctx, 1440, 710, 70, { labels: false });
    },
    salah_simpan(ctx, b, l) {
      const a = A(b);
      compare(ctx, "KESALAHAN 1: LUPA MENYIMPAN", { head: "✗ tab ditutup sebelum Simpan", draw: (ctx, x, y) => {
        text(ctx, "Setelah dibuka lagi:", x + 40, y + 30, 24, { weight: 700, color: C.ink2 });
        [["Keamanan", "WEP (lama)"], ["Nama Wi-Fi", "RUMAH-KITA-12"], ["Jaringan tamu", "Mati"]].forEach(([k, v], i) => { text(ctx, k, x + 40, y + 90 + i * 64, 26, { weight: 700 }); text(ctx, v, x + 680, y + 90 + i * 64, 26, { align: "right", weight: 900, color: RED }); });
        L.callout(ctx, x + 40, y + 300, "Semua perubahan hilang.", null, null, { color: RED, fill: "#FFFFFF", size: 26 }); } },
      { head: "✓ klik Simpan dan Terapkan", draw: (ctx, x, y) => {
        text(ctx, "Setelah dibuka lagi:", x + 40, y + 30, 24, { weight: 700, color: C.ink2 });
        [["Keamanan", "WPA2/WPA3"], ["Nama Wi-Fi", "rumah-biru"], ["Jaringan tamu", "Menyala"]].forEach(([k, v], i) => { text(ctx, k, x + 40, y + 90 + i * 64, 26, { weight: 700 }); text(ctx, v, x + 680, y + 90 + i * 64, 26, { align: "right", weight: 900, color: GREEN }); });
        W.button(ctx, x + 40, y + 300, 320, 56, "Simpan dan Terapkan", {}); } }, l > a * 0.5);
    },
    salah_sambung(ctx, b, l) {
      const a = A(b);
      compare(ctx, "KESALAHAN 2: PERANGKAT BELUM DISAMBUNG ULANG", { head: "✗ masih memakai sandi lama", draw: (ctx, x, y) => {
        W.devices(ctx, x + 30, y + 10, 660, [{ name: "HP Dito", kind: "hp", on: true, net: "rumah-biru" }, { name: "TV ruang tamu", kind: "tv", on: false, net: "Gagal tersambung" }, { name: "Printer", kind: "printer", on: false, net: "Gagal tersambung" }], { rh: 64 });
        L.callout(ctx, x + 40, y + 300, "TV dan printer belum tahu sandi baru.", null, null, { color: RED, fill: "#FFFFFF", size: 24 }); } },
      { head: "✓ disambung ulang satu per satu", draw: (ctx, x, y) => {
        W.devices(ctx, x + 30, y + 10, 660, [{ name: "HP Dito", kind: "hp", on: true, net: "rumah-biru" }, { name: "TV ruang tamu", kind: "tv", on: true, net: "rumah-biru" }, { name: "Printer", kind: "printer", on: true, net: "rumah-biru" }], { rh: 64 });
        L.callout(ctx, x + 40, y + 300, "Pilih rumah-biru, ketik sandi baru.", null, null, { color: GREEN, fill: "#FFFFFF", size: 24 }); } }, l > a * 0.55);
    },
    salah_lemah(ctx, b, l) {
      const a = A(b);
      compare(ctx, "KESALAHAN 3: SANDI LEMAH", { head: "✗ mudah ditebak", draw: (ctx, x, y) => {
        ["admin123", "17082010", "rumahbiru"].forEach((s, i) => { const yy = y + 20 + i * 110; text(ctx, s, x + 40, yy + 30, 30, { weight: 900 }); W.meter(ctx, x + 300, yy + 10, 360, i === 2 ? 1 : 0); });
        text(ctx, "sandi bawaan, tanggal lahir, nama rumah", x + 40, y + 360, 22, { weight: 700, color: RED }); } },
      { head: "✓ frasa panjang", draw: (ctx, x, y) => {
        text(ctx, NEWPASS, x + 40, y + 50, 34, { weight: 900, color: GREEN }); W.meter(ctx, x + 40, y + 80, 640, 4);
        para(ctx, "Empat kata atau lebih yang mudah diingat keluarga. Jangan dibagikan di grup.", x + 40, y + 200, 26, 640, { weight: 700, lh: 1.35 }); } }, l > a * 0.55);
    },
    periksa(ctx, b, l) {
      const a = A(b), items = ["Sandi admin baru", "WPA2/WPA3", "Nama Wi-Fi netral", "Jaringan tamu menyala", "Perangkat tersambung"];
      admin(ctx, { s: DONE, devices: DEVICES.map(d => ({ ...d, net: "rumah-biru" })) });
      const y0 = WIN.y; card(ctx, PX, y0, PW, 90 + items.length * 84, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILNYA", PX + PW / 2, y0 + 48, 24, { align: "center", weight: 900, color: C.accentDark });
      items.forEach((k, i) => { const y = y0 + 72 + i * 84, ok = l > a * (0.15 + i * 0.13); ctx.fillStyle = ok ? C.goodBg : "#F4F6F5"; rr(ctx, PX + 18, y, PW - 36, 70, 12); ctx.fill();
        text(ctx, k, PX + 36, y + 44, 23, { weight: 700, fit: PW - 110 }); text(ctx, ok ? "✓" : "?", PX + PW - 40, y + 46, 30, { align: "center", weight: 900, color: ok ? GREEN : C.ink2 }); });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan D9.2", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Cari yang putus", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/d92", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "cek dari yang terdekat", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Bersama orang tua, periksa pengaturan router rumahmu. Catat yang sudah aman, tanpa menuliskan sandi apa pun.", 1310, 420, 29, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
