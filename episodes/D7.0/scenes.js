/* Adegan episode D7.0 bagian a: pembuka, cek diri, mouse, keyboard (+ layar sentuh, awal bagian b).
   Muat setelah ../_alat/kiko-core.js dan devices.js. Bagian b lainnya ada di scenes-b.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, rr, ease, clamp, lerp } = H;
  const cyc = (l, period, start = 0) => ((Math.max(0, l - start)) % period);   // waktu di dalam siklus ulang
  const between = (u, a, b) => u >= a && u < b;

  // ---------- pembuka & cek diri ----------
  Object.assign(SCENES, {
    prereq_none(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TIDAK ADA SYARAT", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode pertama kelas VII", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Belum pernah pegang komputer? Episode ini memang untukmu.", 960, 500, 40, { align: "center", weight: 700, color: C.ink2 });
      ["Mouse", "Keyboard", "Touch screen", "File & folder"].forEach((s, i) => { card(ctx, 330 + i * 320, 580, 290, 120, { fill: C.bg2 }); text(ctx, s, 475 + i * 320, 652, 34, { align: "center", weight: 800 }); });
      kiko(ctx, 1560, 300, 120, 0, { wave: l });
    },
    selfcheck(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "CEK DIRI DULU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 800 });
      para(ctx, "Mana yang sudah pernah kamu lakukan?", 960, 350, 64, 1460, { align: "center", weight: 900, lh: 1.15 });
      text(ctx, "Hitung dalam hati. Tidak perlu ditulis, tidak dinilai.", 960, 480, 36, { align: "center", color: C.ink2, weight: 600 });
      kiko(ctx, 960, 680, 200, 0, { wave: l, mood: "happy" });
    },
    selfcheck_list(ctx, b, l) {
      card(ctx, 160, 140, 1600, 760);
      text(ctx, "CEK DIRI DULU", 960, 220, 34, { align: "center", color: C.accentDark, weight: 800 });
      const items = ["Menyalakan komputer", "Menggerakkan mouse", "Mengetik namamu", "Membuka folder", "Menyimpan file"];
      const show = b.id === "cek3" ? 5 : clamp(Math.floor((l - 0.6) / 1.3) + 1, 0, 5);
      items.forEach((s, i) => {
        if (i >= show) return; const y = 270 + i * 104;
        card(ctx, 380, y, 1160, 86, { fill: C.bg2 });
        ctx.strokeStyle = C.kiko; ctx.lineWidth = 5; rr(ctx, 410, y + 18, 50, 50, 10); ctx.stroke();
        text(ctx, "?", 435, y + 56, 34, { align: "center", color: C.kiko, weight: 900 });
        text(ctx, s, 500, y + 58, 40, { weight: 800 });
      });
      if (b.id === "cek3" && l > 1.5) { card(ctx, 480, 800, 960, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "Bukan ulangan. Ini peta belajarmu.", 960, 852, 36, { align: "center", weight: 900 }); }
    },
    devices_around(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "DI SEKITAR KITA", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const show = clamp(Math.floor((l - 0.6) / 1.6) + 1, 1, 3);
      // 1: kasir warung dengan HP
      if (show >= 1) { card(ctx, 180, 280, 500, 560, { fill: C.bg2 }); D.phone(ctx, 430, 500, 150, 280); ctx.fillStyle = C.ink; text(ctx, "Bakso  10.000", 430, 470, 22, { align: "center", weight: 800, color: C.ink }); text(ctx, "Es teh   3.000", 430, 505, 22, { align: "center", weight: 800, color: C.ink }); text(ctx, "Total  13.000", 430, 560, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "Kasir warung", 430, 740, 32, { align: "center", weight: 800 }); text(ctx, "mencatat di HP", 430, 785, 28, { align: "center", color: C.ink2, weight: 600 }); }
      // 2: perpustakaan dengan komputer
      if (show >= 2) { card(ctx, 710, 280, 500, 560, { fill: C.bg2 }); const sc = D.monitor(ctx, 800, 360, 320, 200); text(ctx, "Cari buku:", sc.x + 20, sc.y + 50, 22, { weight: 700, color: C.ink2 }); ctx.fillStyle = "#fff"; rr(ctx, sc.x + 20, sc.y + 70, 280, 44, 8); ctx.fill(); ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; ctx.stroke(); text(ctx, "Laskar Pelangi", sc.x + 32, sc.y + 101, 24, { weight: 700 }); text(ctx, "Rak B-3  ✓", sc.x + 20, sc.y + 160, 24, { weight: 800, color: C.good }); text(ctx, "Perpustakaan", 960, 740, 32, { align: "center", weight: 800 }); text(ctx, "memakai komputer", 960, 785, 28, { align: "center", color: C.ink2, weight: 600 }); }
      // 3: kamu (Dito & Sinta) belajar dua-duanya
      if (show >= 3) { card(ctx, 1240, 280, 500, 560, { fill: C.bg2 }); kid(ctx, 1400, 520, 150, { point: true }); kid(ctx, 1580, 520, 150, { hair: "long" }); text(ctx, "Kamu", 1490, 740, 32, { align: "center", weight: 800 }); text(ctx, "belajar cara memakainya", 1490, 785, 28, { align: "center", color: C.ink2, weight: 600 }); }
    }
  });

  // ---------- mouse ----------
  const ICONS = [{ kind: "folder", name: "Tugas", x: 330, y: 330 }, { kind: "foto", name: "foto pramuka", x: 560, y: 330 }, { kind: "tulisan", name: "Puisi Ibu", x: 790, y: 330 }, { kind: "folder", name: "Foto", x: 330, y: 560 }];
  // layar + ikon desktop; st: {selected, open, menuAt, drag:{i,x,y}, hide:[i]}
  function desktop(ctx, st = {}) {
    const sc = D.monitor(ctx, 170, 170, 880, 560);
    ICONS.forEach((ic, i) => { if (st.hide && st.hide.includes(i)) return; D.fileIcon(ctx, ic.x, ic.y, 90, ic.kind, { name: ic.name, selected: st.selected === i, open: st.openFolder === i }); });
    if (st.drag) { const ic = ICONS[st.drag.i]; D.fileIcon(ctx, st.drag.x, st.drag.y, 90, ic.kind, { name: ic.name, selected: true }); }
    if (st.open) { const win = D.windowFrame(ctx, 300, 230, 620, 420, "Tugas", { path: "Dokumen › Tugas" }); [["tulisan", "Puisi Ibu"], ["tulisan", "PR Matematika"], ["foto", "denah kelas"]].forEach(([k, n], i) => D.fileIcon(ctx, win.x + 90 + i * 180, win.y + 90, 80, k, { name: n, size: 22 })); }
    if (st.menuAt) D.menu(ctx, st.menuAt[0], st.menuAt[1], ["Buka", "Ganti nama", "Salin", "Hapus"], { active: st.menuActive });
    return sc;
  }
  function mouseScene(ctx, b, l, st, mouse, note) {
    desktop(ctx, st);
    if (st.pointer) D.pointer(ctx, st.pointer[0], st.pointer[1], 36);
    D.mouse(ctx, 1420 + (mouse.dx || 0), 520 + (mouse.dy || 0), 220, { left: mouse.left, right: mouse.right, label: true });
    if (mouse.ripple !== undefined && st.pointer) D.ripple(ctx, st.pointer[0] + 4, st.pointer[1] + 4, mouse.ripple);
    if (note) D.note(ctx, 1110, 740, 660, note, { size: 34 });
  }
  Object.assign(SCENES, {
    mouse_intro(ctx, b, l) {
      desktop(ctx, { pointer: [600, 430] }); D.pointer(ctx, 600, 430, 36);
      kid(ctx, 1230, 600, 180, { point: true }); text(ctx, "Dito", 1230, 830, 30, { align: "center", color: C.ink2, weight: 700 });
      D.mouse(ctx, 1560, 540, 190, { label: true });
      D.note(ctx, 1380, 740, 400, "mouse (tetikus)", { size: 34 });
    },
    mouse_move(ctx, b, l) {
      const u = Math.max(0, l - 0.8); const dx = 60 * Math.sin(u * 1.3), dy = 35 * Math.cos(u * 0.9);
      mouseScene(ctx, b, l, { pointer: [600 + dx * 4.5, 430 + dy * 4.5] }, { dx, dy }, "mouse bergerak → pointer ikut bergerak");
    },
    mouse_click(ctx, b, l) {
      const u = cyc(l, 3.2, 0.6); const pressed = between(u, 1.0, 1.35), sel = u >= 1.0;
      mouseScene(ctx, b, l, { pointer: [345, 345], selected: sel ? 0 : undefined }, { left: pressed, ripple: (u - 1.0) / 0.7 }, "klik = memilih");
      if (sel) text(ctx, "klik!", 420, 290, 36, { color: C.accentDark, weight: 900 });
    },
    mouse_double(ctx, b, l) {
      const u = cyc(l, 4.2, 0.6); const p1 = between(u, 1.0, 1.18), p2 = between(u, 1.32, 1.5), open = u >= 1.6;
      mouseScene(ctx, b, l, { pointer: open ? [700, 300] : [345, 345], selected: u >= 1.0 && !open ? 0 : undefined, openFolder: open ? 0 : undefined, open }, { left: p1 || p2, ripple: p1 ? (u - 1.0) / 0.4 : p2 ? (u - 1.32) / 0.4 : 1 }, "double click = membuka");
      if (u >= 1.0 && !open) text(ctx, "klik-klik!", 440, 290, 36, { color: C.accentDark, weight: 900 });
    },
    mouse_right(ctx, b, l) {
      const u = cyc(l, 3.8, 0.6); const pressed = between(u, 1.0, 1.35), menu = u >= 1.15;
      mouseScene(ctx, b, l, { pointer: [575, 345], selected: menu ? 1 : undefined, menuAt: menu ? [600, 370] : null, menuActive: u > 2.2 ? 0 : -1 }, { right: pressed, ripple: (u - 1.0) / 0.7 }, "klik kanan = menu pilihan");
    },
    mouse_drag(ctx, b, l) {
      const u = cyc(l, 5.0, 0.6); const from = [560, 330], to = [330, 560];
      const k = u < 1.2 ? 0 : u < 3.0 ? ease((u - 1.2) / 1.8) : 1; const held = between(u, 0.9, 3.3);
      const x = lerp(from[0], to[0], k), y = lerp(from[1], to[1], k) - Math.sin(k * Math.PI) * 40;
      const st = { pointer: [x + 15, y + 15], hide: [1], drag: u < 3.3 ? { i: 1, x, y } : null };
      desktop(ctx, st);
      if (u >= 3.3) { D.fileIcon(ctx, 330, 560, 90, "folder", { name: "Foto", open: true }); D.fileIcon(ctx, 400, 540, 56, "foto", {}); }
      D.pointer(ctx, x + 15, y + 15, 36);
      D.mouse(ctx, 1420 + (held ? (x - from[0]) * 0.15 : 0), 520 + (held ? (y - from[1]) * 0.15 : 0), 220, { left: held, label: true });
      D.note(ctx, 1110, 740, 660, held ? "tekan, tahan, geser…" : u >= 3.3 ? "lepas: pindah!" : "drag = memindahkan", { size: 34 });
    },
    mouse_summary(ctx, b, l) {
      const items = [["KLIK", "memilih", { left: true }], ["DOUBLE CLICK", "membuka", { left: true, twice: true }], ["KLIK KANAN", "melihat pilihan", { right: true }], ["DRAG", "memindahkan", { left: true, move: true }]];
      const show = clamp(Math.floor((l - 0.8) / 1.3) + 1, 1, 4);
      items.forEach(([t1, t2, m], i) => {
        if (i >= show) return; const x = 150 + i * 420;
        card(ctx, x, 200, 390, 560, { stroke: "#D7E2DC", lw: 3 });
        D.mouse(ctx, x + 195, 400, 140, { left: m.left, right: m.right });
        if (m.twice) text(ctx, "×2", x + 300, 330, 44, { color: C.accentDark, weight: 900 });
        if (m.move) { ctx.strokeStyle = C.accentDark; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 290, 420); ctx.lineTo(x + 360, 360); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 330, 352); ctx.lineTo(x + 364, 356); ctx.lineTo(x + 360, 390); ctx.stroke(); }
        text(ctx, t1, x + 195, 600, 36, { align: "center", weight: 900 });
        text(ctx, t2, x + 195, 660, 34, { align: "center", weight: 700, color: C.ink2 });
      });
    }
  });

  // ---------- keyboard ----------
  function kbScene(ctx, b, l, lines, st = {}) {
    const boxH = st.twoLines ? 170 : 130;
    const cur = D.textBox(ctx, 260, 160, 1400, boxH, lines, l, { size: st.twoLines ? 44 : 56, cursorOn: st.cursorOn });
    const kw = st.twoLines ? 1180 : 1300;
    const kb = D.keyboard(ctx, 960 - kw / 2, 160 + boxH + 40, kw, { pressed: st.pressed || [], glow: st.glow || [] });
    if (st.note) text(ctx, st.note, 960, kb.y + kb.h + 52, 34, { align: "center", color: C.accentDark, weight: 800 });
    return cur;
  }
  const LETTERS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  // mengetik kata huruf demi huruf mulai detik t0, satu huruf tiap `step` detik; mengembalikan {typed, key}
  function typing(word, l, t0, step = 0.8) {
    const n = clamp(Math.floor((l - t0) / step) + 1, 0, word.length); const inStep = (l - t0) % step;
    const key = n > 0 && n <= word.length && inStep < 0.35 && l >= t0 ? word[n - 1].toUpperCase() : null;
    return { typed: word.slice(0, n), key, done: n >= word.length };
  }
  Object.assign(SCENES, {
    kb_intro(ctx, b, l) { kbScene(ctx, b, l, [""], { glow: l > 1.5 ? LETTERS : [], note: "keyboard (papan ketik) — mulai dari tombol huruf" }); },
    kb_type(ctx, b, l) { const ty = typing("dito", l, 1.0, 0.9); kbScene(ctx, b, l, [ty.typed], { pressed: ty.key ? [ty.key] : [], note: ty.done ? "satu tombol = satu huruf" : "" }); },
    kb_shift(ctx, b, l) {
      const shift = l >= 1.5 && l < 3.6, dKey = between(l, 2.5, 2.9), big = l >= 2.6;
      kbScene(ctx, b, l, [big ? "Dito" : "dito"], { pressed: [shift ? "Shift" : null, dKey ? "D" : null].filter(Boolean), glow: ["Shift"], note: big ? "Shift + D = D besar" : shift ? "tahan Shift…" : "" });
    },
    kb_space(ctx, b, l) {
      const sp = between(l, 1.2, 1.6); const ty = typing("Sinta", l, 2.0, 0.5); const line = l < 1.4 ? "Dito" : "Dito " + ty.typed;
      kbScene(ctx, b, l, [line], { pressed: sp ? ["Spasi"] : ty.key ? [ty.key] : [], glow: ["Spasi"], note: ty.done ? "tanpa Spasi: DitoSinta ✕   dengan Spasi: Dito Sinta ✓" : sp ? "Spasi = jarak" : "" });
    },
    kb_backspace(ctx, b, l) {
      const p1 = between(l, 2.5, 2.9), p2 = between(l, 4.0, 4.4); const line = l < 2.6 ? "Sintaa" : l < 4.1 ? "Sinta" : "Sint";
      const cur = kbScene(ctx, b, l, [line], { pressed: p1 || p2 ? ["Backspace"] : [], glow: ["Backspace"], cursorOn: l < 2.5, note: l >= 2.6 ? "Backspace = hapus 1 huruf di kiri kursor" : "" });
      if (l < 2.5 && cur) { text(ctx, "kursor", cur[0] + 40, cur[1] - 60, 30, { color: C.kiko, weight: 900 }); ctx.strokeStyle = C.kiko; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cur[0] + 60, cur[1] - 50); ctx.lineTo(cur[0] + 10, cur[1] - 10); ctx.stroke(); }
    },
    kb_enter(ctx, b, l) {
      const en = between(l, 1.2, 1.6); const ty = typing("Sinta", l, 2.2, 0.5);
      const lines = l < 1.4 ? ["Dito"] : ["Dito", ty.typed];
      kbScene(ctx, b, l, lines, { twoLines: true, pressed: en ? ["Enter"] : ty.key ? [ty.key] : [], glow: ["Enter"], note: l >= 1.4 ? "Enter = baris baru" : "" });
    },
    kb_summary(ctx, b, l) {
      const items = [["Shift", "huruf besar", "a → A"], ["Spasi", "jarak antar kata", "Dito Sinta"], ["Backspace", "hapus ke kiri", "Sintaa → Sinta"], ["Enter", "baris baru", "↵"]];
      const show = clamp(Math.floor((l - 0.8) / 1.3) + 1, 1, 4);
      items.forEach(([k, t2, ex], i) => {
        if (i >= show) return; const x = 150 + i * 420;
        card(ctx, x, 200, 390, 560, { stroke: "#D7E2DC", lw: 3 });
        ctx.fillStyle = "#F7FAFC"; rr(ctx, x + 55, 260, 280, 120, 16); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.stroke();
        text(ctx, k, x + 195, 335, 40, { align: "center", weight: 900 });
        text(ctx, t2, x + 195, 480, 36, { align: "center", weight: 800 });
        text(ctx, ex, x + 195, 600, 36, { align: "center", weight: 700, color: C.ink2 });
      });
    }
  });

  // ---------- touch screen ----------
  const PHOTO_COLORS = ["#8FD0E6", "#F2B134", "#2E9E5B", "#D9443B", "#8E6BBF", "#5FA8D3", "#C98A57", "#9AAFA6", "#F1C9A5", "#2E7E9A", "#DDF3E4", "#FBE1DF"];
  function gallery(ctx, sc, opt = {}) {
    ctx.save(); ctx.beginPath(); rr(ctx, sc.x, sc.y, sc.w, sc.h, 26); ctx.clip();
    text(ctx, "Galeri", sc.x + sc.w / 2, sc.y + 60 - (opt.scroll || 0) * 0, 28, { align: "center", weight: 900, color: C.ink2 });
    const cell = (sc.w - 40) / 3, off = opt.scroll || 0;
    for (let i = 0; i < 24; i++) { const r = Math.floor(i / 3), c = i % 3; const px = sc.x + 20 + c * cell, py = sc.y + 90 + r * cell - off; ctx.fillStyle = PHOTO_COLORS[(i * 5 + r) % PHOTO_COLORS.length]; rr(ctx, px + 4, py + 4, cell - 8, cell - 8, 10); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.arc(px + cell * 0.3, py + cell * 0.32, cell * 0.1, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function touchScene(ctx, b, l, drawScreen, note, pair) {
    const sc = D.phone(ctx, 520, 520, 380, 700);
    drawScreen(sc);
    if (note) D.note(ctx, 1000, 330, 760, note, { size: 40, h: 110 });
    if (pair) { card(ctx, 1000, 480, 760, 200, { fill: C.bg2 }); text(ctx, pair[0], 1200, 560, 32, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "=", 1380, 600, 60, { align: "center", weight: 900, color: C.accentDark }); text(ctx, pair[1], 1560, 560, 32, { align: "center", weight: 800, color: C.ink2 }); D.mouse(ctx, 1200, 640, 70, pair[2] || {}); D.finger(ctx, 1560, 610, { s: 22, press: true }); }
    return sc;
  }
  Object.assign(SCENES, {
    touch_intro(ctx, b, l) {
      touchScene(ctx, b, l, sc => { D.appGrid(ctx, sc); const u = Math.max(0, l - 0.6); D.finger(ctx, 520 + 90 * Math.sin(u * 1.1), 450 + 60 * Math.cos(u * 0.8), { s: 46 }); }, "touch screen (layar sentuh)");
      text(ctx, "jari = pointer", 1380, 560, 40, { align: "center", weight: 900, color: C.ink2 });
      text(ctx, "tidak ada mouse", 1380, 620, 34, { align: "center", weight: 700, color: C.ink2 });
    },
    touch_tap(ctx, b, l) {
      const u = cyc(l, 3.6, 0.6); const press = between(u, 1.0, 1.25), opened = u >= 1.35;
      touchScene(ctx, b, l, sc => { if (opened) gallery(ctx, sc); else D.appGrid(ctx, sc, { active: u >= 1.0 ? "Galeri" : null }); if (!opened) D.finger(ctx, 520, 413, { s: 46, press }); if (press) D.ripple(ctx, 520, 413, (u - 1.0) / 0.5); }, "tap (ketuk) = klik", ["klik", "tap", { left: true }]);
    },
    touch_hold(ctx, b, l) {
      const u = cyc(l, 4.2, 0.6); const press = between(u, 1.0, 2.4), menu = u >= 2.0;
      touchScene(ctx, b, l, sc => { D.appGrid(ctx, sc, { active: u >= 1.0 ? "Galeri" : null }); if (press) { ctx.strokeStyle = C.accent; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(520, 413, 62, -Math.PI / 2, -Math.PI / 2 + clamp((u - 1.0) / 1.0, 0, 1) * Math.PI * 2); ctx.stroke(); } D.finger(ctx, 520, 413, { s: 46, press }); if (menu) D.menu(ctx, 560, 440, ["Buka", "Pindahkan", "Hapus"], { w: 240 }); }, "tekan lama (long press)", ["klik kanan", "tekan lama", { right: true }]);
    },
    touch_swipe(ctx, b, l) {
      const u = cyc(l, 4.4, 0.6); const k = u < 1.0 ? 0 : u < 2.6 ? ease((u - 1.0) / 1.6) : 1; const press = between(u, 0.8, 2.8);
      touchScene(ctx, b, l, sc => { gallery(ctx, sc, { scroll: k * 300 }); D.finger(ctx, 520, 760 - k * 300, { s: 46, press }); }, "swipe (geser) ke atas = scroll", ["drag", "tahan lalu geser", { left: true }]);
    },
    touch_pinch(ctx, b, l) {
      const u = cyc(l, 4.4, 0.6); const k = u < 1.0 ? 0 : u < 2.6 ? ease((u - 1.0) / 1.6) : u < 3.4 ? 1 : 1 - ease((u - 3.4) / 1.0);
      touchScene(ctx, b, l, sc => {
        ctx.save(); ctx.beginPath(); rr(ctx, sc.x, sc.y, sc.w, sc.h, 26); ctx.clip();
        const s = 1 + 0.9 * k, w = 300 * s, h = 220 * s; ctx.fillStyle = "#8FD0E6"; rr(ctx, 520 - w / 2, 520 - h / 2, w, h, 14); ctx.fill();
        ctx.fillStyle = "#2E9E5B"; ctx.beginPath(); ctx.moveTo(520 - w / 2, 520 + h / 2); ctx.lineTo(520 - w * 0.1, 520 - h * 0.1); ctx.lineTo(520 + w * 0.15, 520 + h * 0.2); ctx.lineTo(520 + w * 0.3, 520 + h * 0.05); ctx.lineTo(520 + w / 2, 520 + h / 2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(520 + w * 0.3, 520 - h * 0.28, 22 * s, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        const d = 40 + 90 * k; D.finger(ctx, 520 - d, 540, { s: 40, press: k > 0 && k < 1, angle: 0.9 }); D.finger(ctx, 520 + d, 540, { s: 40, press: k > 0 && k < 1, angle: 0.1 });
      }, "pinch (cubit) = zoom");
      text(ctx, k > 0.5 ? "merenggang → membesar" : "merapat → mengecil", 1380, 560, 36, { align: "center", weight: 900, color: C.ink2 });
    },
    touch_vs_mouse(ctx, b, l) {
      card(ctx, 160, 140, 1600, 760);
      text(ctx, "KOMPUTER", 560, 230, 34, { align: "center", color: C.ink2, weight: 900 }); text(ctx, "HP", 1360, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const rows = [["klik", "tap", { left: true }], ["klik kanan", "tekan lama", { right: true }], ["drag", "tahan lalu geser", { left: true }]];
      const show = clamp(Math.floor((l - 0.8) / 1.5) + 1, 1, 3);
      rows.forEach(([a, c, m], i) => {
        if (i >= show) return; const y = 300 + i * 160;
        card(ctx, 240, y, 640, 130, { fill: C.bg2 }); D.mouse(ctx, 330, y + 65, 70, m); text(ctx, a, 600, y + 80, 40, { align: "center", weight: 900 });
        text(ctx, "=", 960, y + 85, 64, { align: "center", weight: 900, color: C.accentDark });
        card(ctx, 1040, y, 640, 130, { fill: C.bg2 }); D.finger(ctx, 1130, y + 55, { s: 24, press: true }); text(ctx, c, 1400, y + 80, 40, { align: "center", weight: 900 });
      });
      if (show >= 3 && l > 5.5) { card(ctx, 480, 790, 960, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "Alatnya beda, maksudnya sama.", 960, 842, 36, { align: "center", weight: 900 }); }
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
