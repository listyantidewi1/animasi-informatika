/* Layar: pembantu gambar bersama untuk video simulasi (episodes/sim/...).
   Aplikasi generik digambar dengan kode, tanpa logo atau tampilan merek: jendela aplikasi, lembar kerja (bilah rumus + kisi sel),
   pointer mouse dengan efek klik, tombol keyboard, label penunjuk, pembesaran, dan penerjemah "aksi" (klik, ketik, tekan tombol)
   supaya satu adegan bisa memperagakan beberapa langkah berurutan. Muat setelah kiko-core.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, ease, clamp, lerp } = H;
  const L = {};
  const UI = { frame: "#C9D4DB", bar: "#EEF2F5", menuInk: "#3D4B55", grid: "#DDE5EA", head: "#EEF2F5", headInk: "#5B6B76",
               select: "#1A73C8", selectBg: "rgba(26,115,200,0.10)", formula: "#1F5A6E", window: "#FFFFFF" };
  L.UI = UI;

  // ---------- jendela aplikasi ----------
  // opt: title, menus [..], tools (true = deretan ikon sederhana). Mengembalikan area isi {x, y, w, h}.
  L.window = function (ctx, x, y, w, h, opt = {}) {
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.18)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
    ctx.fillStyle = UI.window; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.restore();
    ctx.strokeStyle = UI.frame; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 16); ctx.stroke();
    ctx.save(); rr(ctx, x, y, w, h, 16); ctx.clip();
    ctx.fillStyle = UI.bar; ctx.fillRect(x, y, w, 46);
    ["#E5675F", "#F2B134", "#4CB46A"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 28 + i * 26, y + 23, 8, 0, Math.PI * 2); ctx.fill(); });
    text(ctx, opt.title || "Aplikasi", x + w / 2, y + 31, 22, { align: "center", weight: 700, color: UI.menuInk });
    let cy = y + 46;
    if (opt.menus) {
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, cy, w, 40);
      let mx = x + 24; opt.menus.forEach((m, i) => {
        const on = opt.menuOn === m; ctx.font = `600 21px Inter`; const mw = ctx.measureText(m).width + 24;
        if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, mx - 8, cy + 5, mw, 30, 6); ctx.fill(); }
        text(ctx, m, mx + 4, cy + 27, 21, { weight: 600, color: on ? UI.select : UI.menuInk }); mx += mw + 6;
      });
      cy += 40;
    }
    if (opt.tools) {
      ctx.fillStyle = "#F7F9FA"; ctx.fillRect(x, cy, w, 44);
      const icons = opt.tools === true ? ["💾", "↶", "↷", "B", "I", "Σ", "%"] : opt.tools;
      icons.forEach((ic, i) => { const bx = x + 20 + i * 52; ctx.fillStyle = "#FFFFFF"; rr(ctx, bx, cy + 6, 40, 32, 6); ctx.fill(); ctx.strokeStyle = "#E1E7EB"; ctx.lineWidth = 1.5; rr(ctx, bx, cy + 6, 40, 32, 6); ctx.stroke();
        text(ctx, ic, bx + 20, cy + 29, ic.length > 1 ? 18 : 20, { align: "center", weight: 800, color: UI.menuInk }); });
      cy += 44;
    }
    ctx.strokeStyle = UI.grid; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x + w, cy); ctx.stroke();
    ctx.restore();
    return { x, y: cy, w, h: y + h - cy };
  };

  // ---------- lembar kerja ----------
  const COLS = "ABCDEFGHIJ";
  L.col = c => COLS.indexOf(c);
  // st: { cells: {A1: {v, f?}} | {A1: "teks"}, active: "B3", edit: {addr, text} (sedang diketik), range: ["B2","B6"] (sorotan rentang),
  //       copy: ["D2","D6"] (bingkai putus-putus), changed: [alamat] (hijau sesaat), cols: 6, rows: 8, cw: 190 | {A: 170, ...}, rh: 50,
  //       showFormulas: false, handleHover: false }
  // Mengembalikan geometri: {cell(addr), handle(addr), nameBox, fx, bottom}
  L.sheet = function (ctx, area, st = {}) {
    const x = area.x, y = area.y, cols = st.cols || 6, rows = st.rows || 8, rh = st.rh || 50, hw = 60;
    const cwOf = c => typeof st.cw === "object" ? (st.cw[COLS[c]] || 180) : (st.cw || 180);
    const colX = c => { let px = x + hw; for (let i = 0; i < c; i++) px += cwOf(i); return px; };
    const gridW = colX(cols) - x;
    // bilah rumus
    const fy = y + 10; const active = st.edit ? st.edit.addr : st.active;
    const cell0 = active && L.get(st.cells, active);
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 12, fy, 120, 48, 8); ctx.fill(); ctx.strokeStyle = UI.frame; ctx.lineWidth = 2; rr(ctx, x + 12, fy, 120, 48, 8); ctx.stroke();
    text(ctx, active || "", x + 72, fy + 33, 24, { align: "center", weight: 800, color: UI.menuInk });
    const fxW = Math.max(400, gridW - 150);
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 144, fy, fxW, 48, 8); ctx.fill(); ctx.strokeStyle = st.fxFocus ? UI.select : UI.frame; ctx.lineWidth = st.fxFocus ? 3 : 2; rr(ctx, x + 144, fy, fxW, 48, 8); ctx.stroke();
    text(ctx, "fx", x + 162, fy + 32, 21, { weight: 800, color: "#8A99A3" }); ctx.fillStyle = UI.grid; ctx.fillRect(x + 196, fy + 10, 2, 28);
    const fxText = st.edit ? st.edit.text : (cell0 ? (cell0.f || L.show(cell0.v)) : "");
    text(ctx, fxText, x + 212, fy + 33, 25, { weight: 700, color: (st.edit ? st.edit.text : cell0 && cell0.f) && String(fxText).startsWith("=") ? UI.formula : C.ink });
    if (st.edit && st.caret) { ctx.font = "700 25px Inter"; const cw = ctx.measureText(st.edit.text).width; ctx.fillStyle = C.ink; ctx.fillRect(x + 214 + cw, fy + 11, 2.5, 27); }
    // kisi
    const gy = fy + 66; const H0 = rh * (rows + 1);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, gy, gridW, H0);
    ctx.fillStyle = UI.head; ctx.fillRect(x, gy, gridW, rh); ctx.fillRect(x, gy, hw, H0);
    const ac = active ? { c: L.col(active[0]), r: parseInt(active.slice(1)) } : null;
    for (let c = 0; c < cols; c++) {
      if (ac && ac.c === c) { ctx.fillStyle = "#D5E3F3"; ctx.fillRect(colX(c), gy, cwOf(c), rh); }
      text(ctx, COLS[c], colX(c) + cwOf(c) / 2, gy + rh / 2 + 8, 22, { align: "center", weight: 700, color: ac && ac.c === c ? UI.select : UI.headInk });
    }
    for (let r = 1; r <= rows; r++) {
      if (ac && ac.r === r) { ctx.fillStyle = "#D5E3F3"; ctx.fillRect(x, gy + rh * r, hw, rh); }
      text(ctx, String(r), x + hw / 2, gy + rh * r + rh / 2 + 8, 22, { align: "center", weight: 700, color: ac && ac.r === r ? UI.select : UI.headInk });
    }
    const geo = {
      cell(addr) { const c = L.col(addr[0]), r = parseInt(addr.slice(1)); const cx = colX(c), cy = gy + rh * r; return { x: cx, y: cy, w: cwOf(c), h: rh, cx: cx + cwOf(c) / 2, cy: cy + rh / 2 }; },
      handle(addr) { const q = this.cell(addr); return { x: q.x + q.w - 1, y: q.y + q.h - 1 }; },
      colLine(c) { return { x: colX(c), y: gy + rh / 2 }; },
      nameBox: { x: x + 72, y: fy + 24 }, fx: { x: x + 212, y: fy + 24 }, bottom: gy + H0, right: x + gridW, top: gy
    };
    // sorotan rentang
    if (st.range) { const a = geo.cell(st.range[0]), b = geo.cell(st.range[1]); ctx.fillStyle = UI.selectBg; ctx.fillRect(a.x, a.y, b.x + b.w - a.x, b.y + b.h - a.y); }
    (st.changed || []).forEach(addr => { const q = geo.cell(addr); ctx.fillStyle = C.goodBg; ctx.fillRect(q.x + 1, q.y + 1, q.w - 2, q.h - 2); });
    (st.marks || []).forEach(([addr, color]) => { const q = geo.cell(addr); ctx.fillStyle = color; ctx.fillRect(q.x + 1, q.y + 1, q.w - 2, q.h - 2); });
    // garis kisi
    ctx.strokeStyle = UI.grid; ctx.lineWidth = 1.5;
    for (let r = 0; r <= rows + 1; r++) { ctx.beginPath(); ctx.moveTo(x, gy + rh * r); ctx.lineTo(x + gridW, gy + rh * r); ctx.stroke(); }
    for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(colX(c), gy); ctx.lineTo(colX(c), gy + H0); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + H0); ctx.stroke();
    // isi sel
    Object.keys(st.cells || {}).forEach(addr => {
      const c = L.col(addr[0]), r = parseInt(addr.slice(1)); if (c < 0 || c >= cols || r < 1 || r > rows) return;
      if (st.edit && st.edit.addr === addr) return;
      const v = L.get(st.cells, addr); const q = geo.cell(addr);
      const shown = st.showFormulas && v.f ? v.f : L.show(v.v);
      const isNum = typeof v.v === "number" && !(st.showFormulas && v.f);
      let shownFit = shown; if (isNum) { ctx.font = "600 25px Inter"; if (ctx.measureText(shown).width > q.w - 20) shownFit = "#".repeat(Math.max(2, Math.floor((q.w - 20) / 16))); }
      ctx.save(); ctx.beginPath(); ctx.rect(q.x + 2, q.y, q.w - 4, q.h); ctx.clip();
      text(ctx, shownFit, isNum ? q.x + q.w - 14 : q.x + 12, q.y + q.h / 2 + 9, 25, { align: isNum ? "right" : "left", weight: v.bold ? 800 : 600, color: v.color || ((st.changed || []).includes(addr) ? C.good : C.ink) });
      ctx.restore();
    });
    // sel yang sedang diketik
    if (st.edit) { const q = geo.cell(st.edit.addr); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(q.x + 2, q.y + 2, q.w - 4, q.h - 4);
      const isF = String(st.edit.text).startsWith("=");
      text(ctx, st.edit.text, q.x + 12, q.y + q.h / 2 + 9, 25, { weight: 600, color: isF ? UI.formula : C.ink });
      if (st.caret) { ctx.font = "600 25px Inter"; const w = ctx.measureText(st.edit.text).width; ctx.fillStyle = C.ink; ctx.fillRect(q.x + 14 + w, q.y + 11, 2.5, q.h - 22); } }
    // rujukan rumus berwarna saat mengetik rumus
    (st.refs || []).forEach(([addr, color]) => { const q = geo.cell(addr); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.strokeRect(q.x + 2, q.y + 2, q.w - 4, q.h - 4); });
    // bingkai salin putus-putus
    if (st.copy) { const a = geo.cell(st.copy[0]), b = geo.cell(st.copy[1]); ctx.strokeStyle = UI.select; ctx.lineWidth = 3; ctx.setLineDash([10, 7]); ctx.lineDashOffset = -(st.dash || 0); ctx.strokeRect(a.x + 2, a.y + 2, b.x + b.w - a.x - 4, b.y + b.h - a.y - 4); ctx.setLineDash([]); }
    // sel aktif + gagang isi
    if (active && !st.edit) { const q = geo.cell(active); const q2 = st.selTo ? geo.cell(st.selTo) : q;
      ctx.strokeStyle = UI.select; ctx.lineWidth = 4; ctx.strokeRect(q.x + 1, q.y + 1, q2.x + q2.w - q.x - 2, q2.y + q2.h - q.y - 2);
      const hx = q2.x + q2.w - 1, hy = q2.y + q2.h - 1; const s = st.handleHover ? 13 : 10;
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(hx - s / 2 - 2, hy - s / 2 - 2, s + 4, s + 4); ctx.fillStyle = UI.select; ctx.fillRect(hx - s / 2, hy - s / 2, s, s); }
    else if (st.edit) { const q = geo.cell(st.edit.addr); ctx.strokeStyle = UI.select; ctx.lineWidth = 4; ctx.strokeRect(q.x + 1, q.y + 1, q.w - 2, q.h - 2); }
    return geo;
  };
  L.get = (cells, addr) => { const v = (cells || {})[addr]; return v == null ? { v: "" } : (typeof v === "object" ? v : { v }); };
  L.show = v => typeof v === "number" ? (Number.isInteger(v) ? String(v) : v.toLocaleString("id-ID", { maximumFractionDigits: 2 })) : (v == null ? "" : String(v));

  // ---------- pointer mouse ----------
  // kind: "arrow" | "plus" (tanda tambah tipis gagang isi) | "text"; click: 0..1 (efek denyut), down: tombol ditahan
  L.cursor = function (ctx, x, y, opt = {}) {
    const kind = opt.kind || "arrow";
    if (opt.click > 0 && opt.click < 1) { const u = opt.click; ctx.strokeStyle = `rgba(242,177,52,${1 - u})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, 12 + u * 34, 0, Math.PI * 2); ctx.stroke(); }
    if (opt.down) { ctx.fillStyle = "rgba(242,177,52,0.35)"; ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill(); }
    ctx.save(); ctx.translate(x, y);
    if (kind === "plus") {
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.moveTo(0, -16); ctx.lineTo(0, 16); ctx.stroke();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(15, 0); ctx.moveTo(0, -15); ctx.lineTo(0, 15); ctx.stroke();
    } else if (kind === "text") {
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(0, 16); ctx.stroke();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-6, -16); ctx.lineTo(6, -16); ctx.moveTo(0, -16); ctx.lineTo(0, 16); ctx.moveTo(-6, 16); ctx.lineTo(6, 16); ctx.stroke();
    } else {
      const s = opt.size || 1.25; ctx.scale(s, s);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.lineTo(8, 23); ctx.lineTo(13, 35); ctx.lineTo(18, 33); ctx.lineTo(13, 21); ctx.lineTo(23, 21); ctx.closePath();
      ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.stroke();
    }
    ctx.restore();
  };

  // ---------- tombol keyboard ----------
  // keys: ["Enter"] atau ["Ctrl", "S"]; press: 0..1 (tombol tertekan di tengahnya)
  L.keys = function (ctx, x, y, keys, opt = {}) {
    const size = opt.size || 30; let px = x;
    const ws = keys.map(k => { ctx.font = `800 ${size}px Inter`; return Math.max(size * 2.1, ctx.measureText(k).width + size * 1.2); });
    const total = ws.reduce((a, b) => a + b, 0) + (keys.length - 1) * 46;
    if (opt.align === "center") px = x - total / 2;
    const down = opt.press > 0.15 && opt.press < 0.75;
    keys.forEach((k, i) => {
      const w = ws[i], h = size * 2.1, dy = down ? 5 : 0;
      ctx.fillStyle = "#A9B6BE"; rr(ctx, px, y + 6, w, h, 12); ctx.fill();
      ctx.fillStyle = down ? "#FFF3D6" : "#FFFFFF"; rr(ctx, px, y + dy, w, h, 12); ctx.fill(); ctx.strokeStyle = down ? C.accent : "#9AA8B1"; ctx.lineWidth = 2.5; rr(ctx, px, y + dy, w, h, 12); ctx.stroke();
      text(ctx, k, px + w / 2, y + dy + h / 2 + size * 0.36, size, { align: "center", weight: 800, color: C.ink });
      px += w; if (i < keys.length - 1) { text(ctx, "+", px + 23, y + h / 2 + size * 0.36, size, { align: "center", weight: 900, color: C.ink2 }); px += 46; }
    });
    return total;
  };

  // ---------- label penunjuk ----------
  // label kotak dengan garis ke titik (tx, ty)
  L.callout = function (ctx, x, y, s, tx, ty, opt = {}) {
    const size = opt.size || 26; ctx.font = `800 ${size}px Inter`; const lines = H.wrap(ctx, s, size, 800, opt.maxW || 420);
    const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 36, h = lines.length * size * 1.25 + 26;
    if (tx != null) { ctx.strokeStyle = opt.color || C.accentDark; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + w / 2, y + h / 2); ctx.lineTo(tx, ty); ctx.stroke(); ctx.fillStyle = opt.color || C.accentDark; ctx.beginPath(); ctx.arc(tx, ty, 7, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = opt.fill || "#FFF3D6"; rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.strokeStyle = opt.color || C.accent; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 12); ctx.stroke();
    lines.forEach((ln, i) => text(ctx, ln, x + 18, y + 13 + size + i * size * 1.25, size, { weight: 800, color: opt.ink || C.ink }));
    return { w, h };
  };

  // ---------- pembesaran ----------
  // zoom(ctx, px, py, s, fn): gambar fn() dengan pembesaran s berpusat di (px, py) yang dipindah ke (qx, qy)
  L.zoom = function (ctx, px, py, s, fn, qx = px, qy = py) {
    ctx.save(); ctx.translate(qx, qy); ctx.scale(s, s); ctx.translate(-px, -py); fn(); ctx.restore();
  };

  // ---------- penerjemah aksi ----------
  // steps: daftar aksi berurutan, masing-masing punya durasi relatif "d" (dibagi rata ke "span" detik):
  //   {move: "B3"} pointer bergerak ke tengah sel · {click: "B3"} klik (memilih sel) · {type: "Bakso", to: "A1"} mengetik ke sel
  //   {key: "Tab"|"Enter", commit: true} tombol: menyimpan ketikan, pilihan pindah · {set: {A1: ...}} ubah isi sel langsung
  //   {drag: ["D2", "D6"]} drag gagang isi · {wait: 1}
  // Hasil: state lembar kerja + posisi pointer + tombol yang sedang tampil, untuk waktu lokal l.
  L.play = function (base, steps, l, span, geoFn) {
    const st = { cells: { ...(base.cells || {}) }, active: base.active, edit: null, caret: true, copy: null, refs: [], range: null, changed: [] };
    const total = steps.reduce((a, s) => a + (s.d || 1), 0); const unit = span / total;
    let t0 = 0, ptr = base.pointer ? { ...base.pointer } : null, key = null, click = 0, kind = "arrow", down = false;
    for (const s of steps) {
      const d = (s.d || 1) * unit, u = clamp((l - t0) / d, 0, 1); if (l < t0) break;
      const target = a => geoFn().cell(a);
      if (s.move || s.click) { const q = target(s.move || s.click); const to = { x: q.x + q.w * 0.62, y: q.y + q.h * 0.6 }; const from = ptr || to; const m = ease(clamp(u / 0.6, 0, 1)); ptr = { x: lerp(from.x, to.x, m), y: lerp(from.y, to.y, m) }; kind = "arrow";
        if (s.tap && u >= 0.6 && u < 1) click = clamp((u - 0.6) / 0.4, 0, 0.99);
        if (s.click && u >= 0.6) { click = clamp((u - 0.6) / 0.4, 0, 0.99); st.active = s.click; if (st.edit) { st.cells[st.edit.addr] = s.editValue || st.edit.text; st.edit = null; } } if (u >= 1) click = 0; }
      if (s.type != null) { const addr = s.to || st.active; const n = Math.round(s.type.length * clamp(u / 0.9, 0, 1)); st.edit = { addr, text: (s.prefix || "") + s.type.slice(0, n) }; st.active = addr; st.caret = Math.floor(l * 2.2) % 2 === 0 || u < 1;
        if (s.refs) st.refs = s.refs.filter(r => n >= r[2]).map(r => [r[0], r[1]]); }
      if (s.key) { key = u < 1 ? { keys: [].concat(s.key), press: u } : null; if (u >= 0.45 && s.commit && st.edit) { st.cells[st.edit.addr] = s.value != null ? s.value : st.edit.text; st.edit = null; st.refs = []; st.active = s.next || st.active; } }
      if (s.set && u >= 0.5) { Object.assign(st.cells, s.set); if (s.flash) st.changed = Object.keys(s.set); }
      if (s.drag) { const g = geoFn(); const a = g.handle(s.drag[0]), b = g.handle(s.drag[1]); kind = "plus";
        const from = ptr || a; const m1 = ease(clamp(u / 0.25, 0, 1)); const m2 = ease(clamp((u - 0.3) / 0.55, 0, 1));
        ptr = u < 0.3 ? { x: lerp(from.x, a.x, m1), y: lerp(from.y, a.y, m1) } : { x: lerp(a.x, b.x, m2), y: lerp(a.y, b.y, m2) }; down = u >= 0.25 && u < 0.88;
        st.active = s.drag[0]; if (down) { st.dragTo = u < 0.3 ? s.drag[0] : (m2 > 0.98 ? s.drag[1] : null); st.dragFrac = m2; st.dragSpan = s.drag; }
        if (u >= 0.88) { Object.assign(st.cells, s.fill || {}); st.selTo = s.drag[1]; st.changed = Object.keys(s.fill || {}); } }
      if (s.hover) { const g = geoFn(); const h = g.handle(s.hover); const from = ptr || h; const m = ease(clamp(u / 0.7, 0, 1)); ptr = { x: lerp(from.x, h.x, m), y: lerp(from.y, h.y, m) }; kind = u > 0.7 ? "plus" : "arrow"; st.handleHover = u > 0.7; }
      if (s.select) { st.active = s.select[0]; st.selTo = s.select[1]; }
      if (s.state) Object.assign(st, s.state);
      t0 += d;
    }
    if (st.selTo && st.selTo === st.active) st.selTo = null;
    return { st, ptr, key, click, kind, down };
  };

  K.layar = L;
})(typeof window !== "undefined" ? window : globalThis);
