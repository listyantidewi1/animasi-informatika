/* Layar kode: pembantu gambar bersama untuk simulasi pemrograman (episodes/sim/...). Muat setelah kiko-core.js dan layar.js.
   Semua tampilan generik (tanpa logo, warna, atau tata letak merek): editor kode bernomor baris dengan sorotan sintaks Python,
   notebook di browser ("Colab" hanya disebut di narasi), sel kode dengan tombol ▶ bulat, output, kotak input untuk input(),
   pesan error ala traceback, dan jendela Terminal (gelap) atau Shell (terang). Dimiliki kelompok kerja S20/S21/S24.

   API: const LK = Kiko.layarKode;
   ---------------------------------------------------------------------------------------------------------------------------
   LK.MONO                         font monospace ("JetBrains Mono", DejaVu Sans Mono, Liberation Mono, monospace)
   LK.T, LK.TD                     tema terang (editor/notebook) dan gelap (terminal): warna sintaks, latar, garis
   LK.mono(ctx, size, weight)      pasang font monospace; mengembalikan lebar satu huruf
   LK.monoText(ctx, s, x, y, cw)   tulis teks monospace huruf demi huruf (tanpa ligatur: <= tetap dua huruf, bukan ≤)
   LK.tokens(line)                 -> [{s, k}]  k: kw | bi (fungsi bawaan) | str | num | com | op | fn (nama setelah def) | txt
   LK.code(ctx, x, y, lines, opt)  baris kode berwarna tanpa bingkai. lines: ["teks", ...] atau [{t, hl, err, dim}]
       opt: size 24 · lh (1,55×size) · w (lebar sorotan) · nums true|false|angka awal · hl [i] · err i · dim [i]
            caret {line, col} · blink true/false (kursor tampil) · marks [{line, from, to, color}] garis bergelombang
            boxes [{line, from, to, color}] kotak penanda · clipW (potong teks lebih lebar dari ini)
       -> geo {x, y, x0 (awal teks), cw, lh, size, n, w, h, bottom, top(i), base(i), at(line, col) -> {x, y}}
   LK.typed(lines, u)              ketik bertahap (u 0..1 atas semua huruf; spasi awal baris = indentasi otomatis, langsung muncul)
       -> {lines, caret: {line, col}, done}
   LK.insert(base, at, add, u)     sisipkan baris baru add[] sebelum baris ke-at dari base[], diketik bertahap -> {lines, caret, done}
   LK.typeStr(s, u)                potongan string yang sudah diketik
   LK.editor(ctx, x, y, w, h, opt) panel editor putih bernomor baris (opt.lines + opsi LK.code; opt.tab = nama file di tab) -> geo
   LK.notebook(ctx, x, y, w, h, opt) jendela browser berisi notebook generik.
       opt: address (teks bilah alamat) · addressCaret · page: "notebook" | "blank" (bawaan notebook)
            name (nama notebook, mis. "Untitled0.ipynb") · nameEdit {text, caret} · status: "" | "menyambung" | "tersambung"
            menuOn (nama menu yang terbuka) · compact (tanpa bilah alamat dan menu; lebih banyak ruang untuk sel)
            files {items: ["sample_data/", "hujan.csv"], hl: i, upHover: bool} panel file di kiri · railOn: "files"
       -> {x, y, w, h (area isi sel), menu: {File: {x, y, w}}, plus: {kode: {x,y}, teks: {x,y}}, name: {x,y},
           address: {x, y, w}, rail: {files: {x,y}}, upload: {x,y}, fileItem(i) -> {x,y,w,h}, status: {x,y}}
   LK.menu(ctx, x, y, items, opt)  daftar menu tarik-turun. items: ["Baru", "-", ...] ("-" = garis); opt.hl index, opt.w, opt.size
       -> {item(i) -> {x, y, w, h, cx, cy}, h}
   LK.cell(ctx, x, y, w, opt)      sel kode notebook. opt: lines · caret · blink · hl · err · size (22) · nums (true)
            active (bingkai fokus) · run: "idle" | "ready" | "hover" | "running" | "done" · count (angka [n]) · spin (0..1)
            out: item output (lihat LK.output) · minLines (tinggi minimum kode, baris)
       -> {x, y, w, h, bottom, play: {x, y, r}, code: geo LK.code, out: hasil LK.output (y, h, err, input, lines)}
   LK.cellHeight(ctx, w, opt)      tinggi sel tanpa menggambar
   LK.textCell(ctx, x, y, w, opt)  sel teks (Markdown). opt.lines (mentah, mode edit, dengan caret) atau opt.rendered true
            (# judul tebal besar, ## subjudul, - butir, `kode` monospace) -> {h, bottom}
   LK.output(ctx, x, y, w, items, opt) output di bawah sel. Item: "teks" | {t, k: "ok"|"bad"|"note"|"muted"}
            | {k: "in", t: prompt, v: jawaban, active (kotak input aktif), caret} | {err: objek error, lihat LK.error}
       opt: size (20) · dry (hanya mengukur) -> {h, y, lines: [y baseline], input: {x,y,w,h} | null, err: geo error | null}
   LK.error(ctx, x, y, w, e, opt)  kotak traceback. e = {name: "NameError", msg: "name 'nma' is not defined",
            kind: "runtime" | "syntax", line: 2, ctx: [[1, "nama = ..."], [2, "print(nma)"]] (baris konteks; yang = line diberi ---->;
            [no, teks, true] memaksa panah; [null, "<ipython-input-1> in baca_data(nama_file)"] = baris lokasi untuk traceback berlapis),
            code: "print(\"Halo)" + col (untuk syntax: baris kode dan posisi ^), file: "<ipython-input-1>"}
       -> {h, nameBox, lineBox, lastBox, lastNameBox, arrowBox (panah terakhir), arrows [semua panah], codeBox} (kotak {x,y,w,h} untuk sorotan)
   LK.terminal(ctx, x, y, w, h, opt) jendela Terminal. opt: title ("Terminal") · theme "dark" | "light" (Shell)
            prompt ("siswa@lab:~$ ") · lines: ["out", {k: "cmd"|"out"|"err"|"ok"|"note", t, prompt}] · typing: {t, u, prompt}
            caret · size (24) · menus (untuk tema terang, mis. Shell IDLE) -> {x, y, w, h, lineY(i), last}
   LK.focus(ctx, box, opt)         bingkai sorotan oranye berdenyut di sekitar kotak {x,y,w,h}; opt.t (waktu untuk denyut), opt.color
   LK.pointer(ctx, l, span, path, opt) pointer mouse mengikuti titik-titik path [{at: 0..1 (tiba pada fraksi span), x, y,
            click: bool, kind: "arrow"|"text"}]; gerak ±0,6 detik sebelum tiba; klik berdenyut 0,45 detik setelah tiba -> {x, y}
   LK.steps(ctx, title, items, n, opt) panel langkah di kanan (x 1450, lebar 370) sama dengan S02; langkah ke-n sedang dikerjakan
   LK.phase(l, span, a, b)         kemajuan 0..1 antara fraksi a dan b dari span (untuk menyusun aksi berurutan)
   LK.clip(ctx, box, fn)           gambar fn() terpotong di dalam box (mis. isi notebook yang digulir)
   LK.icons.folder/upload/doc(ctx, x, y, s, warna)  ikon garis sederhana
   Pola gulir: h = LK.cellHeight(ctx, w, opt); geser sel ke atas sebesar kelebihan tingginya di dalam LK.clip (lihat cellFit di sim/S21).
*/
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar;
  const { rr, text, ease, clamp, lerp } = H;
  const LK = {};
  LK.MONO = "'JetBrains Mono', 'DejaVu Sans Mono', 'Liberation Mono', monospace";
  LK.T = { bg: "#FFFFFF", cell: "#F6F8F9", line: "#DDE5EA", gutter: "#9AA8B1", ink: "#1F2A33", kw: "#8B3DB5", bi: "#1C6BB0",
           str: "#B4442C", num: "#16825D", com: "#7F8C95", op: "#3D4B55", fn: "#9A5B00", hl: "rgba(242,177,52,0.24)",
           errBg: "#FDECEA", errInk: "#C62828", errBar: "#E25B52", ok: "#2E9E5B", focus: "#7AA7D9", out: "#1F2A33", muted: "#6B7B86" };
  LK.TD = { bg: "#1D242A", bar: "#2B343B", ink: "#DCE5EC", prompt: "#86D993", path: "#7FB8F0", err: "#FF8A80", ok: "#86D993",
            note: "#9AA8B1", caret: "#DCE5EC" };
  const KW = new Set(["False", "None", "True", "and", "as", "assert", "break", "class", "continue", "def", "del", "elif", "else",
    "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "not", "or", "pass", "raise", "return",
    "try", "while", "with", "yield"]);
  const BI = new Set(["print", "input", "int", "float", "str", "len", "range", "list", "dict", "set", "open", "min", "max", "sum",
    "sorted", "round", "abs", "type", "bool", "enumerate", "zip", "tuple"]);

  LK.mono = function (ctx, size, weight = 500) { ctx.font = `${weight} ${size}px ${LK.MONO}`; return ctx.measureText("M").width; };
  // teks monospace huruf demi huruf: posisi tepat di kisi dan tanpa ligatur font (<= tetap tampil dua huruf, bukan ≤)
  LK.monoText = function (ctx, s, x, y, cw) { const w = cw || ctx.measureText("M").width; ctx.textAlign = "left"; for (let i = 0; i < s.length; i++) if (s[i] !== " ") ctx.fillText(s[i], x + i * w, y); };

  // ---------- tokenisasi Python sederhana ----------
  LK.tokens = function (line) {
    const out = []; let i = 0, prevKw = "";
    const push = (s, k) => { if (s) out.push({ s, k }); };
    while (i < line.length) {
      const ch = line[i];
      if (ch === "#") { push(line.slice(i), "com"); break; }
      if (ch === '"' || ch === "'") { let j = i + 1; while (j < line.length && line[j] !== ch) { if (line[j] === "\\") j++; j++; } push(line.slice(i, j + 1), "str"); i = j + 1; continue; }
      if (/[0-9]/.test(ch) && !/[A-Za-z_0-9]/.test(line[i - 1] || "")) { let j = i; while (j < line.length && /[0-9._]/.test(line[j])) j++; push(line.slice(i, j), "num"); i = j; continue; }
      if (/[A-Za-z_]/.test(ch)) { let j = i; while (j < line.length && /[A-Za-z_0-9]/.test(line[j])) j++; const w = line.slice(i, j);
        const k = KW.has(w) ? "kw" : prevKw === "def" ? "fn" : (BI.has(w) && line[j] === "(") ? "bi" : "txt"; push(w, k); prevKw = KW.has(w) ? w : ""; i = j; continue; }
      if (ch === " ") { let j = i; while (j < line.length && line[j] === " ") j++; push(line.slice(i, j), "txt"); i = j; continue; }
      push(ch, "op"); i++;
    }
    return out;
  };
  const colOf = (k, T) => ({ kw: T.kw, bi: T.bi, str: T.str, num: T.num, com: T.com, op: T.op, fn: T.fn }[k] || T.ink);

  // ---------- baris kode ----------
  LK.code = function (ctx, x, y, lines, opt = {}) {
    const T = opt.theme || LK.T, size = opt.size || 24, lh = opt.lh || Math.round(size * 1.55);
    const L0 = lines.map(v => typeof v === "string" ? { t: v } : v);
    const nums = opt.nums !== false, start = typeof opt.nums === "number" ? opt.nums : 1;
    const numW = nums ? (opt.numW || Math.round(size * 1.9)) : 0; const x0 = x + numW + (nums ? Math.round(size * 0.7) : 0);
    const cw = LK.mono(ctx, size); const w = opt.w || (x0 - x + cw * Math.max(20, ...L0.map(v => v.t.length)) + 20);
    const top = i => y + i * lh, base = i => y + i * lh + lh * 0.68;
    L0.forEach((v, i) => {
      const hl = v.hl || (opt.hl || []).includes(i), err = v.err || opt.err === i;
      if (err) { ctx.fillStyle = T.errBg; ctx.fillRect(x, top(i), w, lh); ctx.fillStyle = T.errBar; ctx.fillRect(x, top(i), 5, lh); }
      else if (hl) { ctx.fillStyle = T.hl; ctx.fillRect(x, top(i), w, lh); }
    });
    (opt.boxes || []).forEach(b => { ctx.strokeStyle = b.color || C.accent; ctx.lineWidth = 3; rr(ctx, x0 + b.from * cw - 4, top(b.line) + 3, (b.to - b.from) * cw + 8, lh - 6, 6); ctx.stroke(); });
    L0.forEach((v, i) => {
      const dim = v.dim || (opt.dim || []).includes(i);
      if (nums) { LK.mono(ctx, size * 0.82, 500); ctx.fillStyle = T.gutter; ctx.textAlign = "right"; ctx.textBaseline = "alphabetic"; ctx.fillText(String(start + i), x + numW, base(i)); }
      ctx.save(); if (opt.clipW) { ctx.beginPath(); ctx.rect(x0 - 2, top(i), opt.clipW, lh); ctx.clip(); }
      if (dim) ctx.globalAlpha = 0.35;
      let col = 0; LK.tokens(v.t).forEach(tk => {
        LK.mono(ctx, size, tk.k === "kw" ? 700 : 500); ctx.fillStyle = colOf(tk.k, T); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        if (tk.k === "com") ctx.font = `italic 500 ${size}px ${LK.MONO}`;
        if (tk.s.trim()) LK.monoText(ctx, tk.s, x0 + col * cw, base(i), cw); col += tk.s.length;
      });
      ctx.restore();
    });
    (opt.marks || []).forEach(m => { const yy = base(m.line) + size * 0.28; ctx.strokeStyle = m.color || T.errInk; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let px = x0 + m.from * cw, k = 0; px <= x0 + m.to * cw; px += 5, k++) { const yv = yy + (k % 2 ? 3 : -1); k === 0 ? ctx.moveTo(px, yv) : ctx.lineTo(px, yv); } ctx.stroke(); });
    if (opt.caret && opt.blink !== false) { const c = opt.caret; ctx.fillStyle = T.caret || T.ink; ctx.fillRect(x0 + c.col * cw, top(c.line) + lh * 0.14, 2.5, lh * 0.72); }
    return { x, y, x0, cw, lh, size, n: L0.length, w, h: L0.length * lh, bottom: y + L0.length * lh, top, base,
             at: (line, col) => ({ x: x0 + col * cw, y: top(line) + lh / 2 }) };
  };

  // ---------- mengetik bertahap ----------
  LK.typeStr = (s, u) => s.slice(0, Math.round(s.length * clamp(u, 0, 1)));
  LK.typed = function (lines, u) {
    const lead = s => s.length - s.trimStart().length;
    const total = lines.reduce((a, s) => a + s.trimStart().length + 1, 0) - 1;
    let n = Math.round(clamp(u, 0, 1) * total); const out = [];
    for (let i = 0; i < lines.length; i++) {
      const s = lines[i], ld = lead(s), body = s.length - ld;
      if (n >= body) { out.push(s); n -= body; if (i === lines.length - 1) return { lines: out, caret: { line: i, col: s.length }, done: true };
        if (n === 0) return { lines: out, caret: { line: i, col: s.length }, done: false }; n -= 1; continue; }
      out.push(s.slice(0, ld + n)); return { lines: out, caret: { line: i, col: ld + n }, done: false };
    }
    return { lines: out, caret: { line: Math.max(0, out.length - 1), col: (out[out.length - 1] || "").length }, done: true };
  };
  LK.insert = function (base, at, add, u) {
    const r = LK.typed(add, u); const lines = base.slice(0, at).concat(r.lines, base.slice(at));
    return { lines, caret: { line: at + r.caret.line, col: r.caret.col }, done: r.done };
  };

  // ---------- editor ----------
  LK.editor = function (ctx, x, y, w, h, opt = {}) {
    ctx.fillStyle = LK.T.bg; ctx.fillRect(x, y, w, h);
    let yy = y;
    if (opt.tab) { ctx.fillStyle = "#EEF2F5"; ctx.fillRect(x, y, w, 44); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + 12, y + 6, Math.min(360, w - 24), 38);
      text(ctx, opt.tab, x + 30, y + 32, 20, { weight: 700, color: LK.T.op }); yy += 44; }
    ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, yy, Math.round((opt.size || 24) * 2.5), y + h - yy);
    return LK.code(ctx, x + 6, yy + 12, opt.lines || [], { ...opt, w: w - 12 });
  };

  // ---------- menu tarik-turun ----------
  LK.menu = function (ctx, x, y, items, opt = {}) {
    const size = opt.size || 23, rh = Math.round(size * 1.9), w = opt.w || 300;
    const hh = items.reduce((a, s) => a + (s === "-" ? 14 : rh), 0) + 16;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.2)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, hh, 10); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1.5; rr(ctx, x, y, w, hh, 10); ctx.stroke();
    const pos = []; let yy = y + 8;
    items.forEach((s, i) => {
      if (s === "-") { ctx.fillStyle = "#E1E7EB"; ctx.fillRect(x + 12, yy + 6, w - 24, 2); pos.push(null); yy += 14; return; }
      const [label, key] = s.split("|"); const on = opt.hl === i;
      if (on) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(x + 4, yy, w - 8, rh); }
      text(ctx, label, x + 22, yy + rh / 2 + size * 0.36, size, { weight: 600, color: on ? "#1A5FA8" : C.ink });
      if (key) text(ctx, key, x + w - 18, yy + rh / 2 + size * 0.36, size * 0.85, { align: "right", weight: 600, color: "#7F8C95" });
      pos.push({ x: x + 4, y: yy, w: w - 8, h: rh, cx: x + w / 2, cy: yy + rh / 2 }); yy += rh;
    });
    return { item: i => pos[i], h: hh };
  };

  // ---------- notebook di browser ----------
  function folderIcon(ctx, x, y, s, color) { ctx.fillStyle = color; rr(ctx, x, y + s * 0.18, s, s * 0.7, s * 0.1); ctx.fill(); rr(ctx, x, y + s * 0.06, s * 0.45, s * 0.3, s * 0.08); ctx.fill(); }
  function uploadIcon(ctx, x, y, s, color) { ctx.strokeStyle = color; ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(x, y + s * 0.6); ctx.lineTo(x, y + s); ctx.lineTo(x + s, y + s); ctx.lineTo(x + s, y + s * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + s / 2, y + s * 0.72); ctx.lineTo(x + s / 2, y + s * 0.05); ctx.moveTo(x + s * 0.24, y + s * 0.3); ctx.lineTo(x + s / 2, y + s * 0.05); ctx.lineTo(x + s * 0.76, y + s * 0.3); ctx.stroke(); }
  function docIcon(ctx, x, y, s, color) { ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s * 0.62, y); ctx.lineTo(x + s * 0.8, y + s * 0.2); ctx.lineTo(x + s * 0.8, y + s); ctx.lineTo(x, y + s); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let k = 0; k < 3; k++) { ctx.fillStyle = color; ctx.fillRect(x + s * 0.14, y + s * (0.38 + k * 0.18), s * 0.5, 2.2); } }
  LK.icons = { folder: folderIcon, upload: uploadIcon, doc: docIcon };

  LK.notebook = function (ctx, x, y, w, h, opt = {}) {
    const area = L.window(ctx, x, y, w, h, { title: opt.title || "Browser" });
    let cy = area.y; const geo = { menu: {}, plus: {}, rail: {} };
    ctx.save(); rr(ctx, x, y, w, h, 16); ctx.clip();
    if (!opt.compact) { // bilah alamat
      ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, cy, w, 54);
      ["‹", "›", "↻"].forEach((g, i) => text(ctx, g, x + 30 + i * 40, cy + 37, g === "↻" ? 26 : 34, { align: "center", weight: 700, color: "#7F8C95" }));
      const ax = x + 150, aw = w - 180; ctx.fillStyle = "#FFFFFF"; rr(ctx, ax, cy + 9, aw, 36, 18); ctx.fill(); ctx.strokeStyle = opt.addressCaret != null ? "#7AA7D9" : "#D3DCE2"; ctx.lineWidth = 2; rr(ctx, ax, cy + 9, aw, 36, 18); ctx.stroke();
      const adr = opt.address || ""; text(ctx, adr, ax + 22, cy + 35, 21, { weight: 600, color: C.ink });
      if (opt.addressCaret) { ctx.font = `600 21px ${K.FONT}`; ctx.fillStyle = C.ink; ctx.fillRect(ax + 24 + ctx.measureText(adr).width, cy + 15, 2.2, 24); }
      geo.address = { x: ax, y: cy + 27, w: aw }; cy += 54;
      ctx.fillStyle = "#DDE5EA"; ctx.fillRect(x, cy - 1.5, w, 1.5);
    }
    if (opt.page === "blank") { ctx.restore(); return { x, y: cy, w, h: y + h - cy, ...geo }; }
    // kepala notebook: ikon, nama, status
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, cy, w, 56);
    docIcon(ctx, x + 24, cy + 12, 32, C.kiko);
    const nm = opt.nameEdit ? opt.nameEdit.text : (opt.name || "Untitled0.ipynb");
    if (opt.nameEdit) { ctx.font = `700 25px ${K.FONT}`; const nw = Math.max(260, ctx.measureText(nm).width + 30); ctx.strokeStyle = "#7AA7D9"; ctx.lineWidth = 2.5; rr(ctx, x + 66, cy + 9, nw, 40, 6); ctx.stroke(); }
    text(ctx, nm, x + 78, cy + 38, 25, { weight: 700, color: C.ink });
    if (opt.nameEdit && opt.nameEdit.caret) { ctx.font = `700 25px ${K.FONT}`; ctx.fillStyle = C.ink; ctx.fillRect(x + 80 + ctx.measureText(nm).width, cy + 15, 2.4, 28); }
    geo.name = { x: x + 150, y: cy + 30 };
    const st = opt.status || ""; const sx = x + w - 30;
    if (st) { const lab = st === "menyambung" ? "Menyambungkan…" : st === "tersambung" ? "Tersambung" : st; ctx.font = `700 20px ${K.FONT}`; const sw = ctx.measureText(lab).width + 54;
      ctx.fillStyle = st === "tersambung" ? "#E6F4EA" : "#F4F6F8"; rr(ctx, sx - sw, cy + 12, sw, 34, 17); ctx.fill();
      ctx.fillStyle = st === "tersambung" ? C.good : C.accent; ctx.beginPath(); ctx.arc(sx - sw + 20, cy + 29, 7, 0, Math.PI * 2); ctx.fill();
      text(ctx, lab, sx - sw + 36, cy + 36, 20, { weight: 700, color: st === "tersambung" ? C.good : C.ink2 }); geo.status = { x: sx - sw / 2, y: cy + 29 }; }
    cy += 56;
    if (!opt.compact) { // menu + tombol tambah sel
      const menus = opt.menus || ["File", "Edit", "Lihat", "Sisipkan", "Runtime", "Alat", "Bantuan"]; let mx = x + 70;
      menus.forEach(m => { ctx.font = `600 21px ${K.FONT}`; const mw = ctx.measureText(m).width + 22; const on = opt.menuOn === m;
        if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, mx - 6, cy + 2, mw, 30, 6); ctx.fill(); }
        text(ctx, m, mx + 5, cy + 24, 21, { weight: 600, color: on ? "#1A5FA8" : "#3D4B55" }); geo.menu[m] = { x: mx + mw / 2 - 6, y: cy + 17, x0: mx - 6, w: mw }; mx += mw + 4; });
      cy += 36;
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, cy, w, 44);
      [["+ Kode", "kode"], ["+ Teks", "teks"]].forEach(([s, k], i) => { const bx = x + 70 + i * 130; ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1.5; rr(ctx, bx, cy + 6, 116, 32, 8); ctx.stroke();
        text(ctx, s, bx + 58, cy + 29, 20, { align: "center", weight: 700, color: "#3D4B55" }); geo.plus[k] = { x: bx + 58, y: cy + 22 }; });
      cy += 44;
    }
    ctx.fillStyle = "#DDE5EA"; ctx.fillRect(x, cy, w, 1.5);
    // rel ikon kiri
    const railW = 52; ctx.fillStyle = "#F7F9FA"; ctx.fillRect(x, cy + 1.5, railW, y + h - cy - 1.5); ctx.fillStyle = "#E4EAEE"; ctx.fillRect(x + railW, cy + 1.5, 1.5, y + h - cy);
    const railY = cy + 34;
    [["☰", "toc"], ["⌕", "cari"], ["{x}", "var"], ["files", "files"]].forEach(([g, k], i) => { const ry = railY + i * 58, on = opt.railOn === k || (k === "files" && opt.files);
      if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, x + 6, ry - 22, 40, 44, 8); ctx.fill(); }
      if (g === "files") folderIcon(ctx, x + 13, ry - 13, 26, on ? "#1A5FA8" : "#7F8C95");
      else text(ctx, g, x + railW / 2, ry + 9, g.length > 1 ? 17 : 24, { align: "center", weight: 800, color: "#7F8C95" });
      geo.rail[k] = { x: x + railW / 2, y: ry }; });
    let cx = x + railW + 1.5;
    if (opt.files) { // panel file
      const fw = opt.files.w || 330, f = opt.files; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(cx, cy + 1.5, fw, y + h - cy);
      ctx.fillStyle = "#E4EAEE"; ctx.fillRect(cx + fw, cy + 1.5, 1.5, y + h - cy);
      text(ctx, "File", cx + 20, cy + 40, 23, { weight: 800, color: C.ink });
      const ux = cx + 22, uy = cy + 58; if (f.upHover) { ctx.fillStyle = "#DCE9F7"; rr(ctx, ux - 8, uy - 6, 42, 40, 8); ctx.fill(); }
      uploadIcon(ctx, ux + 2, uy + 2, 22, f.upHover ? "#1A5FA8" : "#5B6B76"); geo.upload = { x: ux + 13, y: uy + 14 };
      folderIcon(ctx, ux + 52, uy + 4, 24, "#9AA8B1"); text(ctx, "↻", ux + 112, uy + 23, 24, { align: "center", weight: 700, color: "#5B6B76" });
      const items = f.items || ["sample_data/"]; geo.fileItem = i => ({ x: cx + 8, y: uy + 52 + i * 44, w: fw - 16, h: 40 });
      items.forEach((s, i) => { const r = geo.fileItem(i), dir = s.endsWith("/"); if (f.hl === i) { ctx.fillStyle = f.hlColor || "#DCE9F7"; rr(ctx, r.x, r.y, r.w, r.h, 8); ctx.fill(); }
        if (dir) folderIcon(ctx, r.x + 14, r.y + 8, 24, "#9AA8B1"); else docIcon(ctx, r.x + 16, r.y + 7, 24, "#5B6B76");
        text(ctx, dir ? s.slice(0, -1) : s, r.x + 52, r.y + 28, 21, { weight: 600, color: C.ink }); });
      if (f.note) { ctx.font = `600 18px ${K.FONT}`; const lines = H.wrap(ctx, f.note, 18, 600, fw - 40); const ny = y + h - 24 - lines.length * 24;
        ctx.fillStyle = "#FFF8E5"; rr(ctx, cx + 10, ny - 30, fw - 20, lines.length * 24 + 24, 8); ctx.fill(); lines.forEach((ln, i) => text(ctx, ln, cx + 22, ny - 6 + i * 24, 18, { weight: 600, color: "#7A5A12" })); }
      cx += fw + 1.5;
    }
    ctx.restore();
    return { x: cx, y: cy + 1.5, w: x + w - cx, h: y + h - cy - 1.5, ...geo };
  };

  // ---------- output ----------
  LK.output = function (ctx, x, y, w, items, opt = {}) {
    const size = opt.size || 20, lh = Math.round(size * 1.5), dry = !!opt.dry; let yy = y + 8; const res = { y, lines: [], input: null, err: null };
    (items || []).forEach(it => {
      const o = typeof it === "string" ? { t: it } : it;
      if (o.err) { const e = LK.error(ctx, x, yy + 2, w, o.err, { size, dry }); if (!res.err) res.err = { ...e, y: yy + 2 }; yy += e.h + 8; return; }
      const base = yy + lh * 0.72; res.lines.push(base);
      if (o.k === "in") {
        const cw = LK.mono(ctx, size); const pw = o.t.length * cw;
        if (!dry) { LK.mono(ctx, size); ctx.fillStyle = LK.T.out; ctx.textBaseline = "alphabetic"; LK.monoText(ctx, o.t, x, base, cw); }
        if (o.active) { const bx = x + pw + 4, bw = Math.min(360, w - pw - 20); if (!dry) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(bx, yy + 2, bw, lh - 2); ctx.strokeStyle = "#7AA7D9"; ctx.lineWidth = 2; ctx.strokeRect(bx, yy + 2, bw, lh - 2);
            LK.mono(ctx, size); ctx.fillStyle = LK.T.out; LK.monoText(ctx, o.v || "", bx + 8, base, cw); if (o.caret !== false) ctx.fillRect(bx + 9 + (o.v || "").length * cw, yy + 6, 2.2, lh - 10); }
          res.input = { x: bx, y: yy + 2, w: bw, h: lh - 2 }; }
        else if (!dry && o.v) { LK.mono(ctx, size, 700); ctx.fillStyle = LK.T.bi; LK.monoText(ctx, o.v, x + pw, base, cw); }
        yy += lh + (o.active ? 4 : 0); return;
      }
      if (!dry) { LK.mono(ctx, size, o.k === "bad" || o.k === "ok" ? 700 : 500); if (o.k === "note") ctx.font = `italic 500 ${size}px ${LK.MONO}`;
        ctx.fillStyle = { ok: LK.T.ok, bad: LK.T.errInk, note: LK.T.muted, muted: LK.T.muted }[o.k] || LK.T.out; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.save(); ctx.beginPath(); ctx.rect(x, yy, w, lh); ctx.clip(); LK.monoText(ctx, o.t, x, base); ctx.restore(); }
      yy += lh;
    });
    res.h = (items && items.length) ? yy - y + 6 : 0; return res;
  };

  // ---------- pesan error ----------
  LK.error = function (ctx, x, y, w, e, opt = {}) {
    const size = opt.size || 20, lh = Math.round(size * 1.5), dry = !!opt.dry, cw = LK.mono(ctx, size);
    const rows = []; // [teks, jenis]
    if (e.kind === "syntax") {
      rows.push([`  File "${e.file || "<ipython-input-1>"}", line ${e.line}`, "file"]); rows.push(["    " + (e.code || ""), "code"]);
      rows.push(["    " + " ".repeat(e.col || 0) + (e.carets || "^"), "caret"]);
    } else {
      rows.push([e.name, "head"]);
      (e.ctx || []).forEach(([no, s, arrow]) => { if (no == null) { rows.push([s, "where"]); return; } const ar = arrow != null ? arrow : no === e.line;
        rows.push([(ar ? "----> " : "      ") + no + " " + s, ar ? "arrow" : "ctx"]); });
      rows.push(["", "blank"]);
    }
    rows.push([e.name + (e.msg != null && e.msg !== "" ? ": " + e.msg : ":"), "last"]);
    const h = rows.length * lh + 20; const geo = { h };
    if (!dry) { ctx.fillStyle = LK.T.errBg; ctx.fillRect(x - 6, y, w + 6, h); ctx.fillStyle = LK.T.errBar; ctx.fillRect(x - 6, y, 4, h); }
    rows.forEach(([s, k], i) => {
      const base = y + 10 + i * lh + lh * 0.72, ty = y + 10 + i * lh; const draw = (str, xx, color, wt = 500) => { if (dry) return; LK.mono(ctx, size, wt); ctx.fillStyle = color; ctx.textBaseline = "alphabetic"; LK.monoText(ctx, str, xx, base, cw); };
      if (k === "head") { draw(s, x + 6, LK.T.errInk, 800); if (!dry) { text(ctx, "Traceback (most recent call last)", x + w - 16, base, size * 0.9, { align: "right", weight: 600, color: "#9A6B66" }); }
        geo.nameBox = { x: x, y: ty, w: s.length * cw + 12, h: lh }; }
      else if (k === "file") { const pre = s.slice(0, s.lastIndexOf("line")); draw(pre, x + 6, LK.T.muted); draw(s.slice(pre.length), x + 6 + pre.length * cw, LK.T.ok, 800);
        geo.lineBox = { x: x + pre.length * cw, y: ty, w: (s.length - pre.length) * cw + 12, h: lh }; }
      else if (k === "code") { draw(s, x + 6, LK.T.ink); geo.codeBox = { x: x, y: ty, w: s.length * cw + 12, h: lh }; }
      else if (k === "caret") draw(s, x + 6, LK.T.errInk, 800);
      else if (k === "arrow") { const m = s.match(/^(-*> )(\d+)/); draw(m[1], x + 6, LK.T.ok, 800); draw(m[2], x + 6 + m[1].length * cw, LK.T.ok, 800); draw(s.slice(m[0].length), x + 6 + m[0].length * cw, LK.T.ink);
        geo.arrowBox = { x: x, y: ty, w: s.length * cw + 12, h: lh }; geo.lineBox = { x: x, y: ty, w: m[0].length * cw + 10, h: lh }; (geo.arrows = geo.arrows || []).push(geo.arrowBox); }
      else if (k === "ctx") draw(s, x + 6, LK.T.muted);
      else if (k === "where") draw(s, x + 6, "#2F7C8F", 600);
      else if (k === "last") { draw(e.name, x + 6, LK.T.errInk, 800); draw(s.slice(e.name.length), x + 6 + e.name.length * cw, LK.T.ink, 600);
        geo.lastBox = { x: x, y: ty, w: Math.min(w, s.length * cw + 12), h: lh }; geo.lastNameBox = { x: x, y: ty, w: e.name.length * cw + 12, h: lh };
        if (!geo.nameBox) geo.nameBox = geo.lastNameBox; }
    });
    return geo;
  };

  // ---------- sel kode ----------
  const CELL = { pad: 14, playW: 72 };
  LK.cellHeight = function (ctx, w, opt = {}) {
    const size = opt.size || 22, lh = Math.round(size * 1.55), n = Math.max(opt.minLines || 1, (opt.lines || []).length);
    const codeH = n * lh + CELL.pad * 2; const o = opt.out && opt.out.length ? LK.output(ctx, 0, 0, w - CELL.playW - 20, opt.out, { size: opt.outSize || size * 0.92, dry: true }).h : 0;
    return codeH + (o ? o + 8 : 0);
  };
  LK.cell = function (ctx, x, y, w, opt = {}) {
    const size = opt.size || 22, lh = Math.round(size * 1.55), n = Math.max(opt.minLines || 1, (opt.lines || []).length);
    const codeH = n * lh + CELL.pad * 2, cx = x + CELL.playW;
    const outSize = opt.outSize || size * 0.92;
    const oH = opt.out && opt.out.length ? LK.output(ctx, 0, 0, w - CELL.playW - 20, opt.out, { size: outSize, dry: true }).h : 0;
    const h = codeH + (oH ? oH + 8 : 0);
    if (opt.active) { ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.16)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 3; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = LK.T.cell; rr(ctx, cx, y, w - CELL.playW, codeH, 8); ctx.fill();
    ctx.strokeStyle = opt.active ? LK.T.focus : "#E1E7EB"; ctx.lineWidth = opt.active ? 2.5 : 1.5; rr(ctx, cx, y, w - CELL.playW, codeH, 8); ctx.stroke();
    const code = LK.code(ctx, cx + 4, y + CELL.pad, opt.lines || [], { size, lh, nums: opt.nums !== false ? (typeof opt.nums === "number" ? opt.nums : true) : false, w: w - CELL.playW - 8,
      hl: opt.hl, err: opt.err, dim: opt.dim, caret: opt.caret, blink: opt.blink, marks: opt.marks, boxes: opt.boxes, clipW: w - CELL.playW - 80 });
    // tombol jalankan
    const px = x + CELL.playW / 2, py = y + CELL.pad + lh / 2, r = 21, run = opt.run || "idle";
    if (run === "done" && opt.count != null) { text(ctx, `[${opt.count}]`, px, py + 8, 20, { align: "center", weight: 700, color: "#7F8C95" }); }
    else if (run === "running") { ctx.strokeStyle = "#D3DCE2"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.stroke();
      const a = (opt.spin || 0) * Math.PI * 2; ctx.strokeStyle = "#1A73C8"; ctx.beginPath(); ctx.arc(px, py, r, a, a + Math.PI * 0.6); ctx.stroke();
      ctx.fillStyle = "#3D4B55"; ctx.fillRect(px - 7, py - 7, 14, 14); }
    else { const strong = run === "ready" || run === "hover"; ctx.fillStyle = strong ? (run === "hover" ? "#2B3A44" : "#4A5A66") : "#C3CDD3"; ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(px - 6, py - 10); ctx.lineTo(px + 11, py); ctx.lineTo(px - 6, py + 10); ctx.closePath(); ctx.fill(); }
    let out = null;
    if (oH) { const oy = y + codeH + 4; out = LK.output(ctx, cx + 16, oy, w - CELL.playW - 28, opt.out, { size: outSize }); out.y = oy; }
    return { x, y, w, h, bottom: y + h, play: { x: px, y: py, r }, code, out, codeBottom: y + codeH };
  };

  // ---------- sel teks (Markdown) ----------
  LK.textCell = function (ctx, x, y, w, opt = {}) {
    const lines = opt.lines || [];
    if (!opt.rendered) {
      const size = opt.size || 21, lh = Math.round(size * 1.55), h = Math.max(1, lines.length) * lh + 28, cx = x + CELL.playW;
      ctx.fillStyle = "#FFFFFF"; rr(ctx, cx, y, w - CELL.playW, h, 8); ctx.fill(); ctx.strokeStyle = opt.active ? LK.T.focus : "#E1E7EB"; ctx.lineWidth = opt.active ? 2.5 : 1.5; rr(ctx, cx, y, w - CELL.playW, h, 8); ctx.stroke();
      const cw = LK.mono(ctx, size);
      lines.forEach((s, i) => { const base = y + 14 + i * lh + lh * 0.7; LK.mono(ctx, size, s.startsWith("#") ? 700 : 500); ctx.fillStyle = s.startsWith("#") ? "#1C6BB0" : s.startsWith("- ") ? "#3D4B55" : LK.T.ink; ctx.textBaseline = "alphabetic"; LK.monoText(ctx, s, cx + 18, base, cw); });
      if (opt.caret && opt.blink !== false) { const c = opt.caret; ctx.fillStyle = LK.T.ink; ctx.fillRect(cx + 18 + c.col * cw, y + 14 + c.line * lh + lh * 0.14, 2.5, lh * 0.72); }
      return { h, bottom: y + h };
    }
    let yy = y + 10; const cx = x + CELL.playW + 18;
    lines.forEach(s => {
      if (s.startsWith("# ")) { text(ctx, s.slice(2), cx, yy + 40, 36, { weight: 800 }); yy += 56; }
      else if (s.startsWith("## ")) { text(ctx, s.slice(3), cx, yy + 32, 27, { weight: 800 }); yy += 44; }
      else if (s === "") yy += 12;
      else { const bullet = s.startsWith("- "), body = bullet ? s.slice(2) : s; let px = cx + (bullet ? 30 : 0);
        if (bullet) { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx + 10, yy + 22, 4.5, 0, Math.PI * 2); ctx.fill(); }
        body.split("`").forEach((part, k) => { if (!part) return; if (k % 2) { const cw = LK.mono(ctx, 20); const pw = part.length * cw + 12; ctx.fillStyle = "#EEF2F5"; rr(ctx, px, yy + 6, pw, 30, 5); ctx.fill(); LK.mono(ctx, 20); ctx.fillStyle = "#B4442C"; LK.monoText(ctx, part, px + 6, yy + 28, cw); px += pw + 2; }
          else { text(ctx, part, px, yy + 29, 22, { weight: 500 }); ctx.font = `500 22px ${K.FONT}`; px += ctx.measureText(part).width; } });
        yy += 38; }
    });
    return { h: yy - y + 8, bottom: yy + 8 };
  };

  // ---------- terminal / shell ----------
  LK.terminal = function (ctx, x, y, w, h, opt = {}) {
    const light = opt.theme === "light", T = LK.TD, size = opt.size || 24, lh = Math.round(size * 1.5);
    let area;
    if (light) area = L.window(ctx, x, y, w, h, { title: opt.title || "Shell", menus: opt.menus });
    else { ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = T.bg; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, x, y, w, h, 16); ctx.clip(); ctx.fillStyle = T.bar; ctx.fillRect(x, y, w, 46);
      ["#E5675F", "#F2B134", "#4CB46A"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 28 + i * 26, y + 23, 8, 0, Math.PI * 2); ctx.fill(); });
      text(ctx, opt.title || "Terminal", x + w / 2, y + 31, 22, { align: "center", weight: 700, color: "#C9D4DB" }); ctx.restore(); area = { x, y: y + 46, w, h: h - 46 }; }
    const prompt = opt.prompt != null ? opt.prompt : (light ? ">>> " : "siswa@lab:~$ ");
    const rows = (opt.lines || []).map(v => typeof v === "string" ? { k: "out", t: v } : v);
    if (opt.typing) rows.push({ k: "cmd", t: LK.typeStr(opt.typing.t, opt.typing.u), prompt: opt.typing.prompt, typing: true });
    else if (opt.caret) rows.push({ k: "cmd", t: "", typing: true });
    const maxRows = Math.floor((area.h - 24) / lh); const first = Math.max(0, rows.length - maxRows);
    const cw = LK.mono(ctx, size); const ink = light ? LK.T.ink : T.ink;
    ctx.save(); ctx.beginPath(); ctx.rect(area.x, area.y, area.w, area.h); ctx.clip();
    const lineY = []; let last = null;
    rows.slice(first).forEach((r, i) => {
      const base = area.y + 18 + i * lh + lh * 0.7, x0 = area.x + 22; lineY.push(base);
      const put = (s, xx, color, wt = 500) => { LK.mono(ctx, size, wt); ctx.fillStyle = color; ctx.textBaseline = "alphabetic"; LK.monoText(ctx, s, xx, base, cw); };
      if (r.k === "cmd") { const p = r.prompt != null ? r.prompt : prompt; let px = x0;
        if (!light && p.includes(":")) { const a = p.indexOf(":"); put(p.slice(0, a), px, T.prompt, 700); px += a * cw; put(":", px, ink); px += cw; const rest = p.slice(a + 1); const d = rest.search(/[$#>]/); put(rest.slice(0, d), px, T.path, 700); px += d * cw; put(rest.slice(d), px, ink); px += (rest.length - d) * cw; }
        else { put(p, px, light ? "#8B3DB5" : T.prompt, 700); px += p.length * cw; }
        put(r.t, px, ink, 600); last = { x: px + r.t.length * cw, y: base };
        if (r.typing && opt.blink !== false) { ctx.fillStyle = light ? LK.T.ink : T.caret; ctx.fillRect(px + r.t.length * cw + 1, base - size * 0.82, size * 0.55, size * 1.02); } }
      else put(r.t, x0, { err: light ? LK.T.errInk : T.err, ok: light ? LK.T.ok : T.ok, note: light ? LK.T.muted : T.note }[r.k] || (light ? (r.k === "out" ? "#1C3F8C" : ink) : ink), r.k === "err" || r.k === "ok" ? 700 : 500);
    });
    ctx.restore();
    return { ...area, lineY: i => lineY[i], last, cw, lh };
  };

  // ---------- sorotan, pointer, langkah ----------
  LK.focus = function (ctx, box, opt = {}) {
    const p = opt.t != null ? 0.5 + 0.5 * Math.sin(opt.t * 5) : 1, pad = opt.pad != null ? opt.pad : 6;
    ctx.strokeStyle = opt.color || C.accent; ctx.lineWidth = 4 + 2 * p; rr(ctx, box.x - pad, box.y - pad, box.w + pad * 2, box.h + pad * 2, 10); ctx.stroke();
  };
  LK.pointer = function (ctx, l, span, path, opt = {}) {
    if (!path || !path.length) return null; const f = l / span, mv = (opt.mv || 0.6) / span;
    let p = { x: path[0].x, y: path[0].y }, click = 0, kind = path[0].kind || "arrow";
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1], b = path[i]; if (f < b.at - Math.min(mv, b.at - (a.at || 0))) break;
      const st = b.at - Math.min(mv, b.at - (a.at || 0)); const u = ease(clamp((f - st) / Math.max(1e-6, b.at - st), 0, 1));
      p = { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) }; kind = b.kind || "arrow";
      if (b.click && f >= b.at) { const c = (f - b.at) * span / 0.45; click = c < 1 ? clamp(c, 0.01, 0.99) : 0; } else click = 0;
    }
    if (opt.draw !== false) L.cursor(ctx, p.x, p.y, { kind, click, down: opt.down });
    return p;
  };
  LK.steps = function (ctx, title, items, n, opt = {}) {
    const x = opt.x || 1450, y = opt.y || 122, w = opt.w || 370; let hh = 70; const GREEN = C.good;
    const rows = items.map(s => H.wrap(ctx, s, 23, 700, w - 86)); rows.forEach(lines => hh += lines.length * 30 + 22);
    H.card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
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
  };
  LK.phase = (l, span, a, b) => clamp((l / span - a) / Math.max(1e-6, b - a), 0, 1);
  LK.clip = function (ctx, box, fn) { ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip(); fn(); ctx.restore(); };

  K.layarKode = LK;
})(typeof window !== "undefined" ? window : globalThis);
