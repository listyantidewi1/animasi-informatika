/* Pembantu gambar F11.2: kamus pseudocode→Python, pseudocode dan Python berdampingan dengan baris sepasang,
   kartu tipe data, pemeriksaan cabang if/elif/else, kartu PRIMM. Gaya diagram Fase F. Muat setelah kiko-core.js, kode.js, py.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, clamp } = H;
  const T = {};
  T.DICT = [["BACA x", "x = input()"], ["TULIS x", "print(x)"], ["x ← 5", "x = 5"], ["JIKA … MAKA", "if …:"], ["LAINNYA", "else:"], ["UNTUK tiap x dalam d", "for x in d:"], ["SELAMA …", "while …:"], ["FUNGSI f(a)", "def f(a):"], ["KEMBALIKAN x", "return x"]];
  // kamus dua kolom; n = jumlah baris yang sudah tampil, hl = baris disorot
  T.dict = function (ctx, x, y, w, rows, opt = {}) {
    const rh = opt.rh || 46, n = opt.n == null ? rows.length : opt.n;
    card(ctx, x, y, w, rh * (rows.length + 1) + 10, { fill: "#FFFDF5", stroke: "#E0B04B", lw: 3, r: 12 });
    ctx.fillStyle = "#FFF3D6"; rr(ctx, x, y, w, rh, 12); ctx.fill(); ctx.fillRect(x, y + rh / 2, w, rh / 2);
    text(ctx, "pseudocode", x + 20, y + rh / 2 + 8, 20, { weight: 900, color: C.ink2 }); text(ctx, "Python", x + w / 2 + 20, y + rh / 2 + 8, 20, { weight: 900, color: C.ink2 });
    ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w / 2, y + rh); ctx.lineTo(x + w / 2, y + rh * (rows.length + 1)); ctx.stroke();
    rows.forEach(([a, b], i) => { const ry = y + rh * (i + 1); if (i >= n) return; if (opt.hl === i) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 2, ry, w - 4, rh); } text(ctx, a, x + 20, ry + rh / 2 + 8, opt.size || 22, { weight: 800, color: C.kiko }); text(ctx, b, x + w / 2 + 20, ry + rh / 2 + 8, opt.size || 22, { weight: 800, color: "#1F2A33" }); ctx.strokeStyle = "#F0E2B8"; ctx.beginPath(); ctx.moveTo(x + 8, ry + rh); ctx.lineTo(x + w - 8, ry + rh); ctx.stroke(); });
  };
  // berdampingan: ps = baris pseudocode [{t,ind}], py = baris python [{t}], pairs = [[iPs, iPy], ...]; opt.hl = indeks pasangan disorot
  T.side = function (ctx, x, y, ps, py, opt = {}) {
    const rh = opt.rh || 50, size = opt.size || 22, wl = opt.wl || 740, wr = opt.wr || 720, gap = opt.gap || 40;
    const pair = opt.pairs && opt.hl != null ? opt.pairs[opt.hl] : null;
    K.kode.code(ctx, x, y, wl, ps.map((p, i) => ({ ...p, hl: pair && pair[0] === i })), { rh, size });
    K.py.code(ctx, x + wl + gap, y, wr, py.map((p, i) => ({ ...p, hl: pair && pair[1] === i })), { rh, size });
    if (pair) { const y1 = y + 50 + pair[0] * rh + rh / 2, y2 = y + 50 + pair[1] * rh + rh / 2; ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + wl + 4, y1); ctx.lineTo(x + wl + gap - 4, y2); ctx.stroke(); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x + wl + gap - 4, y2, 7, 0, Math.PI * 2); ctx.fill(); }
    return 50 + rh * Math.max(ps.length, py.length);
  };
  T.TYPES = [["int", "integer: bilangan bulat", "17, -3", "#2E7E9A"], ["float", "float: bilangan pecahan", "3.5", "#8E6BBF"], ["str", "string: teks", "\"Sinta\"", "#2E9E5B"], ["bool", "boolean: benar-salah", "True, False", "#B57A12"]];
  T.typeCards = function (ctx, x, y, w, n, opt = {}) {
    const cw = (w - 3 * 20) / 4; T.TYPES.forEach(([nm, id, ex, col], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const cx = x + i * (cw + 20); card(ctx, cx, y, cw, 130, { fill: "#fff", stroke: col, lw: opt.on === i ? 6 : 3, r: 14 }); ctx.fillStyle = col; rr(ctx, cx, y, cw, 42, 14); ctx.fill(); ctx.fillRect(cx, y + 21, cw, 21); text(ctx, nm, cx + cw / 2, y + 30, 24, { align: "center", weight: 900, color: "#fff" }); text(ctx, id, cx + cw / 2, y + 76, 20, { align: "center", weight: 800, color: C.ink2 }); text(ctx, ex, cx + cw / 2, y + 110, 22, { align: "center", weight: 900 }); ctx.restore(); });
  };
  // kotak nilai bertipe di memori: {name, value, type, warn}
  T.cell = function (ctx, x, y, w, v) {
    const col = (T.TYPES.find(t => t[0] === v.type) || [0, 0, 0, "#4A5A66"])[3];
    card(ctx, x, y, w, 110, { fill: v.warn ? C.badBg : v.changed ? "#FFF3D6" : "#fff", stroke: v.warn ? C.bad : v.changed ? C.accent : col, lw: 4, r: 12 });
    text(ctx, v.name, x + 14, y + 30, 20, { weight: 800, color: C.ink2 }); ctx.fillStyle = col; rr(ctx, x + w - 74, y + 10, 64, 28, 8); ctx.fill(); text(ctx, v.type, x + w - 42, y + 30, 16, { align: "center", weight: 900, color: "#fff" });
    text(ctx, v.value == null ? "–" : String(v.value), x + w / 2, y + 84, 30, { align: "center", weight: 900, color: v.warn ? C.bad : C.ink });
  };
  // pemeriksaan cabang: conds = [[teks kondisi, hasil benar/salah/null]], step = berapa kondisi sudah diperiksa, taken = indeks cabang yang dijalankan
  T.branchCheck = function (ctx, x, y, w, conds, step, taken) {
    conds.forEach(([t, ok], i) => { const ry = y + i * 86; const checked = i < step; const run = taken === i; const skip = checked && !run && taken != null && i > taken;
      ctx.save(); if (taken != null && i > taken) ctx.globalAlpha = 0.25;
      card(ctx, x, ry, w, 70, { fill: run ? C.goodBg : checked ? C.bg2 : "#fff", stroke: run ? C.good : checked ? "#B7C4CC" : "#D7E2DC", lw: run ? 5 : 3, r: 12 });
      text(ctx, t, x + 20, ry + 44, 24, { weight: 900, color: "#1F2A33" });
      if (checked && ok != null) text(ctx, ok ? "✓ benar, jalankan" : "✕ salah, lewati", x + w - 20, ry + 44, 22, { align: "right", weight: 900, color: ok ? C.good : C.bad });
      ctx.restore(); });
  };
  T.PRIMM = [["P", "Predict · Tebak", "tulis dugaan output"], ["R", "Run · Jalankan", "bandingkan dengan dugaan"], ["I", "Investigate · Selidiki", "ubah satu angka, lihat bedanya"], ["M", "Modify · Ubah", "tambah satu fitur kecil"], ["M", "Make · Buat", "program versimu sendiri"]];
  T.primm = function (ctx, x, y, n, opt = {}) {
    const w = opt.w || 300; T.PRIMM.forEach(([ltr, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const cx = x + i * (w + 20); const [en, id] = t.split(" · "); card(ctx, cx, y, w, 200, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 16 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(cx + 44, y + 50, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, ltr, cx + 44, y + 61, 30, { align: "center", weight: 900, color: "#fff" }); text(ctx, en, cx + 86, y + 44, 22, { weight: 900 }); text(ctx, id || "", cx + 86, y + 74, 20, { weight: 800, color: C.kiko }); para(ctx, s, cx + 20, y + 125, 22, w - 40, { weight: 700, color: C.ink2 }); ctx.restore(); });
  };
  K.terjemah = T;
})(typeof window !== "undefined" ? window : globalThis);
