/* Pembantu gambar perangkat untuk D7.0: monitor, mouse, pointer, keyboard, HP, jari, ikon file/folder, jendela.
   Semua digambar dengan kode (tanpa aset unduhan). Muat setelah ../_alat/kiko-core.js; dipakai scenes.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, ease, clamp, lerp } = H;
  const D = {};
  const SCREEN_BG = "#F4F8FB", BEZEL = "#2B3A46", BEZEL2 = "#1A262F", SEL = "rgba(46,126,154,0.22)";

  // ---------- komputer ----------
  // monitor di atas meja; mengembalikan kotak layar {x,y,w,h}
  D.monitor = function (ctx, x, y, w, h) {
    ctx.fillStyle = BEZEL; rr(ctx, x - 18, y - 18, w + 36, h + 36, 22); ctx.fill();
    ctx.fillStyle = SCREEN_BG; rr(ctx, x, y, w, h, 10); ctx.fill();
    // kaki dan meja
    ctx.fillStyle = BEZEL2; rr(ctx, x + w / 2 - 40, y + h + 18, 80, 36, 8); ctx.fill(); rr(ctx, x + w / 2 - 140, y + h + 50, 280, 16, 8); ctx.fill();
    ctx.fillStyle = C.tableTop; rr(ctx, x - 80, y + h + 66, w + 160, 22, 8); ctx.fill();
    return { x, y, w, h };
  };
  // panah pointer
  D.pointer = function (ctx, x, y, s = 34, color = C.ink) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.strokeStyle = "#fff"; ctx.lineWidth = s * 0.08; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, s); ctx.lineTo(s * 0.27, s * 0.78); ctx.lineTo(s * 0.45, s * 1.15); ctx.lineTo(s * 0.62, s * 1.07); ctx.lineTo(s * 0.45, s * 0.7); ctx.lineTo(s * 0.75, s * 0.7); ctx.closePath();
    ctx.fill(); ctx.stroke(); ctx.restore();
  };
  // mouse tampak atas; opt.left / opt.right = tombol ditekan; opt.label = tulis "kiri/kanan"
  D.mouse = function (ctx, cx, cy, s, opt = {}) {
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.beginPath(); ctx.ellipse(0, s * 0.62, s * 0.5, s * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    // kabel
    ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(0, -s * 0.6); ctx.quadraticCurveTo(0, -s * 1.0, s * 0.5, -s * 1.1); ctx.stroke();
    // badan
    ctx.fillStyle = "#E8EEF2"; rr(ctx, -s * 0.42, -s * 0.62, s * 0.84, s * 1.24, s * 0.4); ctx.fill(); ctx.strokeStyle = "#A9B7C0"; ctx.lineWidth = s * 0.04; ctx.stroke();
    // dua tombol
    const btn = (side, on) => { ctx.fillStyle = on ? C.accent : "#F7FAFC"; ctx.beginPath(); const sx = side === "left" ? -1 : 1;
      ctx.moveTo(sx * s * 0.03, -s * 0.6); ctx.lineTo(sx * s * 0.03, -s * 0.1); ctx.lineTo(sx * s * 0.4, -s * 0.1); ctx.lineTo(sx * s * 0.4, -s * 0.28); ctx.quadraticCurveTo(sx * s * 0.4, -s * 0.6, sx * s * 0.1, -s * 0.6); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#A9B7C0"; ctx.lineWidth = s * 0.03; ctx.stroke(); };
    btn("left", opt.left); btn("right", opt.right);
    ctx.fillStyle = "#A9B7C0"; rr(ctx, -s * 0.04, -s * 0.5, s * 0.08, s * 0.26, s * 0.04); ctx.fill(); // roda
    ctx.restore();
    if (opt.label) { text(ctx, "kiri", cx - s * 0.22, cy - s * 0.72, 26, { align: "center", color: opt.left ? C.accentDark : C.ink2, weight: 800 }); text(ctx, "kanan", cx + s * 0.22, cy - s * 0.72, 26, { align: "center", color: opt.right ? C.accentDark : C.ink2, weight: 800 }); }
  };
  // riak "klik" di sekitar titik
  D.ripple = function (ctx, x, y, u, color = C.accent) { if (u <= 0 || u >= 1) return; ctx.strokeStyle = color; ctx.globalAlpha = 1 - u; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 12 + u * 60, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; };

  // ---------- ikon file & folder ----------
  const KIND = { folder: "#F2B134", foto: "#5FA8D3", tulisan: "#7B8B95", lagu: "#8E6BBF", video: "#D9443B" };
  D.fileIcon = function (ctx, cx, cy, s, kind, opt = {}) {
    ctx.save(); ctx.translate(cx, cy);
    if (opt.selected) { ctx.fillStyle = SEL; rr(ctx, -s * 0.62, -s * 0.62, s * 1.24, s * 1.24 + (opt.name ? s * 0.5 : 0), s * 0.14); ctx.fill(); }
    if (kind === "folder") {
      ctx.fillStyle = "#D99A1B"; rr(ctx, -s * 0.5, -s * 0.32, s * 0.45, s * 0.2, s * 0.06); ctx.fill();
      ctx.fillStyle = opt.open ? "#F7C860" : KIND.folder; rr(ctx, -s * 0.5, -s * 0.22, s, s * 0.7, s * 0.08); ctx.fill();
      if (opt.open) { ctx.fillStyle = "#D99A1B"; rr(ctx, -s * 0.46, -s * 0.02, s * 0.92, s * 0.5, s * 0.08); ctx.fill(); }
    } else {
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = s * 0.05;
      ctx.beginPath(); ctx.moveTo(-s * 0.36, -s * 0.5); ctx.lineTo(s * 0.12, -s * 0.5); ctx.lineTo(s * 0.36, -s * 0.26); ctx.lineTo(s * 0.36, s * 0.5); ctx.lineTo(-s * 0.36, s * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = KIND[kind] || KIND.tulisan;
      if (kind === "foto") { rr(ctx, -s * 0.26, -s * 0.2, s * 0.52, s * 0.44, s * 0.04); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.08, s * 0.06, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * 0.26, s * 0.24); ctx.lineTo(-s * 0.06, s * 0.02); ctx.lineTo(s * 0.06, s * 0.14); ctx.lineTo(s * 0.14, s * 0.06); ctx.lineTo(s * 0.26, s * 0.24); ctx.closePath(); ctx.fill(); }
      else if (kind === "lagu") { ctx.beginPath(); ctx.arc(-s * 0.1, s * 0.22, s * 0.1, 0, Math.PI * 2); ctx.arc(s * 0.16, s * 0.16, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.lineWidth = s * 0.06; ctx.strokeStyle = KIND.lagu; ctx.beginPath(); ctx.moveTo(0, s * 0.2); ctx.lineTo(0, -s * 0.2); ctx.lineTo(s * 0.26, -s * 0.26); ctx.lineTo(s * 0.26, s * 0.14); ctx.stroke(); }
      else if (kind === "video") { rr(ctx, -s * 0.26, -s * 0.16, s * 0.52, s * 0.4, s * 0.04); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(-s * 0.06, -s * 0.04); ctx.lineTo(s * 0.12, s * 0.04); ctx.lineTo(-s * 0.06, s * 0.12); ctx.closePath(); ctx.fill(); }
      else { for (let i = 0; i < 4; i++) { rr(ctx, -s * 0.22, -s * 0.14 + i * s * 0.14, s * (i === 3 ? 0.26 : 0.44), s * 0.06, s * 0.03); ctx.fill(); } }
    }
    ctx.restore();
    if (opt.name) { const lines = wrap(ctx, opt.name, opt.size || 24, 700, s * 1.6); lines.slice(0, 2).forEach((ln, i) => text(ctx, ln, cx, cy + s * 0.78 + i * (opt.size || 24) * 1.15, opt.size || 24, { align: "center", weight: 700, color: opt.color || C.ink })); }
  };
  D.KIND = KIND;

  // jendela aplikasi (file manager / editor) di dalam layar; mengembalikan area isi
  D.windowFrame = function (ctx, x, y, w, h, title, opt = {}) {
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, w, 54, 14); ctx.fill(); ctx.fillRect(x, y + 30, w, 24);
    ["#E0655C", "#F2B134", "#2E9E5B"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 26 + i * 26, y + 27, 8, 0, Math.PI * 2); ctx.fill(); });
    if (title) text(ctx, title, x + w / 2, y + 36, 24, { align: "center", color: C.ink2, weight: 800 });
    if (opt.path) { ctx.fillStyle = "#F4F8FB"; rr(ctx, x + 16, y + 66, w - 32, 44, 10); ctx.fill(); text(ctx, opt.path, x + 32, y + 96, 24, { color: C.ink2, weight: 700 }); }
    return { x: x + 16, y: y + (opt.path ? 124 : 70), w: w - 32, h: h - (opt.path ? 140 : 86) };
  };
  // kotak teks dengan kursor berkedip; opt.cursor = posisi karakter (bawaan akhir)
  D.textBox = function (ctx, x, y, w, h, lines, tt, opt = {}) {
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = opt.stroke || "#C9D4DB"; ctx.lineWidth = 3; ctx.stroke();
    const size = opt.size || 48, lh = size * 1.4;
    lines.forEach((ln, i) => text(ctx, ln, x + 28, y + 24 + size + i * lh, size, { weight: 700, color: opt.color || C.ink }));
    if (opt.cursor !== false) {
      const li = lines.length - 1, s = lines[li] || ""; ctx.font = `700 ${size}px ${K.FONT}`; const cw = ctx.measureText(s).width;
      if (Math.floor(tt * 2.5) % 2 === 0 || opt.cursorOn) { ctx.fillStyle = C.kiko; ctx.fillRect(x + 30 + cw, y + 22 + li * lh, 5, size * 1.15); }
      return [x + 32 + cw, y + 22 + li * lh + size * 0.6];
    }
  };

  // ---------- keyboard ----------
  const ROWS = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], ["A", "S", "D", "F", "G", "H", "J", "K", "L"], ["Z", "X", "C", "V", "B", "N", "M"]];
  // keyboard sederhana: 3 baris huruf + Shift, Spasi, Backspace, Enter. opt.pressed = [tombol], opt.glow = [tombol] disorot lembut
  D.keyboard = function (ctx, x, y, w, opt = {}) {
    const key = w / 11.6, gap = key * 0.12, k = key - gap, h = k * 4 + gap * 5;
    ctx.fillStyle = BEZEL; rr(ctx, x - 16, y - 16, w + 32, h + 32, 22); ctx.fill();
    const pressed = opt.pressed || [], glow = opt.glow || [];
    const draw = (kx, ky, kw, label, small) => {
      const on = pressed.includes(label), soft = glow.includes(label);
      ctx.fillStyle = on ? C.accent : soft ? "#FFF3D6" : "#F7FAFC"; rr(ctx, kx, ky + (on ? 4 : 0), kw, k - (on ? 4 : 0), 10); ctx.fill();
      ctx.strokeStyle = on ? C.accentDark : soft ? C.accent : "#B7C4CC"; ctx.lineWidth = on || soft ? 4 : 2; ctx.stroke();
      text(ctx, label, kx + kw / 2, ky + k / 2 + (small ? 9 : 12), small ? 24 : 32, { align: "center", weight: 800, color: on ? "#fff" : C.ink });
    };
    ROWS.forEach((row, r) => { const off = r === 0 ? 0 : r === 1 ? key * 0.35 : key * 0.85; row.forEach((lab, i) => draw(x + gap + off + i * key, y + gap + r * key, k, lab)); });
    draw(x + gap + key * 0.85 + 7 * key + gap, y + gap + 2 * key, key * 2.4 - gap, "Backspace", true);
    draw(x + gap, y + gap + 3 * key, key * 1.9 - gap, "Shift", true);
    draw(x + gap + key * 1.9, y + gap + 3 * key, key * 6.2 - gap, "Spasi", true);
    draw(x + gap + key * 8.1, y + gap + 3 * key, key * 2.3 - gap, "Enter", true);
    draw(x + gap + key * 0.35 + 9 * key, y + gap + 1 * key, key * 1.9 - gap, "Enter", true);
    return { x, y, w, h };
  };

  // ---------- HP & jari ----------
  // HP tegak; mengembalikan kotak layar
  D.phone = function (ctx, cx, cy, w, h) {
    ctx.fillStyle = BEZEL; rr(ctx, cx - w / 2 - 14, cy - h / 2 - 22, w + 28, h + 44, 40); ctx.fill();
    ctx.fillStyle = SCREEN_BG; rr(ctx, cx - w / 2, cy - h / 2, w, h, 26); ctx.fill();
    ctx.fillStyle = BEZEL2; rr(ctx, cx - 40, cy - h / 2 + 8, 80, 12, 6); ctx.fill();
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  };
  // kisi ikon aplikasi generik di layar HP; mengembalikan posisi tiap ikon
  const APPS = [["Kamera", "#2E7E9A"], ["Galeri", "#5FA8D3"], ["Pesan", "#2E9E5B"], ["Musik", "#8E6BBF"], ["Kalkulator", "#7B8B95"], ["Peta", "#F2B134"], ["Catatan", "#E0A23B"], ["Jam", "#D9443B"], ["Cuaca", "#4C9BE0"]];
  D.appGrid = function (ctx, sc, opt = {}) {
    const cols = 3, cell = sc.w / cols, out = [];
    APPS.forEach(([name, col], i) => {
      const r = Math.floor(i / cols), c = i % cols; const ax = sc.x + cell * c + cell / 2, ay = sc.y + 90 + r * (cell + 26);
      const on = opt.active === name; const sz = cell * 0.56 * (on && opt.scale ? opt.scale : 1);
      ctx.fillStyle = col; rr(ctx, ax - sz / 2, ay - sz / 2, sz, sz, sz * 0.24); ctx.fill();
      if (on) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; ctx.stroke(); }
      text(ctx, name, ax, ay + sz / 2 + 26, 20, { align: "center", weight: 700, color: C.ink2 });
      out.push({ name, x: ax, y: ay });
    });
    return out;
  };
  // ujung jari yang menyentuh layar di (x,y); opt.press = sedang menekan (riak); opt.second = jari kedua
  D.finger = function (ctx, x, y, opt = {}) {
    const s = opt.s || 46;
    ctx.save(); ctx.translate(x, y); ctx.rotate(opt.angle !== undefined ? opt.angle : 0.5);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(0, s * 0.25, s * 0.7, s * 0.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.skin; rr(ctx, -s * 0.5, -s * 0.3, s, s * 3.2, s * 0.5); ctx.fill();
    ctx.fillStyle = "#F7D9BE"; ctx.beginPath(); ctx.ellipse(0, s * 0.1, s * 0.3, s * 0.42, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    if (opt.press) { ctx.fillStyle = "rgba(46,126,154,0.25)"; ctx.beginPath(); ctx.arc(x, y, s * 0.8, 0, Math.PI * 2); ctx.fill(); }
  };
  // menu konteks (klik kanan / tekan lama)
  D.menu = function (ctx, x, y, items, opt = {}) {
    const w = opt.w || 300, rowH = 52; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, rowH * items.length + 16, 12); ctx.fill(); ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    items.forEach((it, i) => { if (opt.active === i) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 8, y + 8 + i * rowH, w - 16, rowH, 8); ctx.fill(); } text(ctx, it, x + 24, y + 8 + i * rowH + 36, 28, { weight: 700 }); });
  };
  // kartu keterangan kecil di kanan/bawah adegan
  D.note = function (ctx, x, y, w, s, opt = {}) { card(ctx, x, y, w, opt.h || 96, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, x + w / 2, y + (opt.h || 96) / 2 + 14, opt.size || 36, { align: "center", weight: 900, color: opt.color || C.ink }); };

  K.devices = D;
})(typeof window !== "undefined" ? window : globalThis);
