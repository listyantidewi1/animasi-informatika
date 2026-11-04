/* S29 pembantu gambar khusus: editor kode dengan sorotan sintaks HTML, tampilan halaman HTML di browser (gaya bawaan browser:
   huruf serif, tanpa CSS), gambar setor.png rekaan, pengelola file, dialog Simpan sebagai, dan pembaca layar.
   Dimuat setelah layar_web.js dan layar_kode.js (hanya memakai LK.mono / LK.MONO). API: Kiko.s29 (const HK = K.s29). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, W = K.web, UI = K.web.UI, LK = K.layarKode;
  const { rr, text, ease, clamp, lerp } = H;
  const HK = {};
  const SERIF = "'Liberation Serif', 'DejaVu Serif', Georgia, serif";
  const COL = { tag: "#1C6BB0", attr: "#9A5B00", val: "#B4442C", punct: "#7F8C95", doc: "#7F8C95", text: "#1F2A33" };
  HK.COL = COL;
  const meas = (ctx, s, size, weight = 600) => { ctx.font = `${weight} ${size}px ${K.FONT}`; return ctx.measureText(s).width; };
  HK.meas = meas;

  // ---------- kode ----------
  HK.CODE = [
    "<!DOCTYPE html>",
    "<html lang=\"id\">",
    "<head>",
    "  <meta charset=\"utf-8\">",
    "  <title>Setor Sampah</title>",
    "</head>",
    "<body>",
    "  <h1>Setor Sampah</h1>",
    "  <p>Catat setoran sampah kelasmu, lalu lihat poinnya bertambah.</p>",
    "  <img src=\"setor.png\"",
    "       alt=\"Layar aplikasi Setor Sampah dengan poin tiap kelas\">",
    "  <p>",
    "    <a href=\"https://banksampah.example\">Kunjungi Bank Sampah</a>",
    "  </p>",
    "</body>",
    "</html>"
  ];
  HK.SKEL = [...HK.CODE.slice(0, 7), "  ", "</body>", "</html>"];
  // tokenizer HTML lintas baris: [[{s, k}], ...]
  HK.tokens = function (lines) {
    let inTag = false, tagName = false; const out = [];
    lines.forEach(line => {
      const toks = []; let i = 0; const push = (s, k) => { if (s) toks.push({ s, k }); };
      while (i < line.length) {
        const c = line[i];
        if (!inTag) {
          if (line.startsWith("<!", i)) { const j = line.indexOf(">", i); const e = j < 0 ? line.length : j + 1; push(line.slice(i, e), "doc"); i = e; continue; }
          if (c === "<") { const close = line[i + 1] === "/"; push(close ? "</" : "<", "punct"); i += close ? 2 : 1; inTag = true; tagName = true; continue; }
          let j = line.indexOf("<", i); if (j < 0) j = line.length; push(line.slice(i, j), "text"); i = j; continue;
        }
        if (c === ">") { push(">", "punct"); i++; inTag = false; continue; }
        if (c === " ") { let j = i; while (line[j] === " ") j++; push(line.slice(i, j), "text"); i = j; tagName = false; continue; }
        if (c === "=") { push("=", "punct"); i++; continue; }
        if (c === "\"") { let j = line.indexOf("\"", i + 1); j = j < 0 ? line.length : j + 1; push(line.slice(i, j), "val"); i = j; continue; }
        let j = i; while (j < line.length && /[A-Za-z0-9\-]/.test(line[j])) j++; if (j === i) j = i + 1;
        push(line.slice(i, j), tagName ? "tag" : "attr"); tagName = false; i = j;
      }
      out.push(toks);
    });
    return out;
  };

  // ---------- jendela editor kode ----------
  // opt: lines, size (24), file ("index.html" | null = "Tanpa judul"), dirty, caret {line, col}, blink, hl [baris], err [baris],
  //      add [baris yang baru (hijau)], mark [{line, from, to, color}] kotak penanda
  HK.editor = function (ctx, x, y, w, h, opt = {}) {
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.18)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 16); ctx.clip();
    ctx.fillStyle = "#EEF2F5"; ctx.fillRect(x, y, w, 46);
    ["#E5675F", "#F2B134", "#4CB46A"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 28 + i * 26, y + 23, 8, 0, Math.PI * 2); ctx.fill(); });
    text(ctx, "Editor Kode", x + w / 2, y + 31, 22, { align: "center", weight: 700, color: "#3D4B55" });
    ctx.fillStyle = "#F7F9FA"; ctx.fillRect(x, y + 46, w, 44);
    const tab = opt.file || "Tanpa judul"; const tw = meas(ctx, tab, 20, 700) + 70;
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + 12, y + 52, tw, 38); ctx.fillStyle = "#1A73C8"; ctx.fillRect(x + 12, y + 52, tw, 3);
    text(ctx, tab, x + 30, y + 78, 20, { weight: 700, color: "#3D4B55" });
    if (opt.dirty) { ctx.fillStyle = "#3D4B55"; ctx.beginPath(); ctx.arc(x + tw - 10, y + 71, 6, 0, Math.PI * 2); ctx.fill(); } else W.icon(ctx, "cross", x + tw - 10, y + 71, 13, "#8A99A3");
    const size = opt.size || 24, lh = Math.round(size * 1.5), cw = LK.mono(ctx, size, 500), gw = Math.round(size * 2.4), top = y + 90;
    ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, top, gw, h - 90);
    const lines = opt.lines || [], toks = HK.tokens(lines), x0 = x + gw + 14, y0 = top + 14;
    const at = (ln, col) => ({ x: x0 + col * cw, y: y0 + ln * lh });
    lines.forEach((line, i) => {
      const yy = y0 + i * lh;
      if ((opt.hl || []).includes(i)) { ctx.fillStyle = "rgba(242,177,52,0.22)"; ctx.fillRect(x + gw, yy, w - gw, lh); }
      if ((opt.add || []).includes(i)) { ctx.fillStyle = "rgba(46,158,91,0.14)"; ctx.fillRect(x + gw, yy, w - gw, lh); }
      if ((opt.err || []).includes(i)) { ctx.fillStyle = "rgba(217,68,59,0.12)"; ctx.fillRect(x + gw, yy, w - gw, lh); }
      LK.mono(ctx, size * 0.8, 500); ctx.fillStyle = "#9AA8B1"; ctx.textAlign = "right"; ctx.fillText(String(i + 1), x + gw - 10, yy + lh * 0.7);
      LK.mono(ctx, size, 500); let col = 0;
      toks[i].forEach(t => { ctx.fillStyle = COL[t.k] || COL.text; LK.monoText(ctx, t.s, x0 + col * cw, yy + lh * 0.7, cw); col += t.s.length; });
    });
    (opt.mark || []).forEach(m => { const a = at(m.line, m.from); ctx.strokeStyle = m.color || "#D9443B"; ctx.lineWidth = 3; rr(ctx, a.x - 3, a.y + 2, (m.to - m.from) * cw + 6, lh - 4, 6); ctx.stroke(); });
    if (opt.caret && opt.blink !== false) { const a = at(opt.caret.line, opt.caret.col); ctx.fillStyle = "#1F2A33"; ctx.fillRect(a.x, a.y + lh * 0.14, 2.5, lh * 0.72); }
    ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 16); ctx.stroke();
    return { at, cw, lh, size, x0, y0, bottom: y0 + lines.length * lh };
  };

  // ---------- gambar setor.png ----------
  HK.setorImg = function (ctx, x, y, w, h) {
    ctx.save(); rr(ctx, x, y, w, h, 8); ctx.clip(); ctx.translate(x, y); ctx.scale(w / 320, h / 200);
    ctx.fillStyle = "#F3F7F2"; ctx.fillRect(0, 0, 320, 200);
    ctx.fillStyle = "#2E8B57"; ctx.fillRect(0, 0, 320, 40);
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(22, 12); ctx.lineTo(34, 12); ctx.lineTo(32, 30); ctx.lineTo(24, 30); ctx.closePath(); ctx.fill(); ctx.fillRect(20, 9, 16, 3);
    text(ctx, "Setor Sampah", 46, 27, 16, { weight: 800, color: "#FFFFFF" });
    text(ctx, "Poin minggu ini", 16, 62, 12, { weight: 700, color: "#4A5A66" });
    [["XII-1", 120, "#2E8B57"], ["XII-2", 95, "#4FA36E"], ["XII-3", 70, "#7DBB8F"], ["XII-4", 45, "#A8D2B3"]].forEach(([k, n, c], i) => { const yy = 76 + i * 28;
      text(ctx, k, 16, yy + 15, 12, { weight: 700, color: "#1F2A33" }); ctx.fillStyle = c; rr(ctx, 64, yy + 3, 200 * n / 120, 16, 4); ctx.fill(); text(ctx, String(n), 70 + 200 * n / 120, yy + 15, 11, { weight: 800, color: "#1F2A33" }); });
    ctx.restore();
  };
  HK.brokenImg = function (ctx, x, y, alt, size) {
    ctx.strokeStyle = "#8A99A3"; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, 22, 26); ctx.fillStyle = "#C9D4DB"; ctx.beginPath(); ctx.moveTo(x + 3, y + 22); ctx.lineTo(x + 10, y + 12); ctx.lineTo(x + 16, y + 20); ctx.lineTo(x + 19, y + 16); ctx.lineTo(x + 19, y + 22); ctx.fill();
    ctx.strokeStyle = "#D9443B"; ctx.beginPath(); ctx.moveTo(x - 2, y + 10); ctx.lineTo(x + 24, y + 16); ctx.stroke();
    ctx.font = `400 ${size}px ${SERIF}`; ctx.fillStyle = "#1F2A33"; ctx.textAlign = "left"; ctx.fillText(alt, x + 30, y + 21);
  };

  // ---------- halaman HTML di browser (gaya bawaan) ----------
  // st: h1, p ([baris]), h1Open (judul tidak ditutup), img: "ok" | "broken" | null, alt, link, hover, scale (1)
  HK.page = function (ctx, a, st = {}) {
    const s = st.scale || 1, px = a.x + 22 * s, maxW = a.w - 44 * s; const geo = {};
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(a.x, a.y, a.w, a.h);
    return W.clip(ctx, a, () => {
      let y = a.y + 22 * s;
      const big = (str) => { const lines = wrapSerif(ctx, str, 40 * s, maxW, 700); ctx.fillStyle = "#000000"; ctx.textAlign = "left";
        lines.forEach(ln => { y += 46 * s; ctx.font = `700 ${40 * s}px ${SERIF}`; ctx.fillText(ln, px, y); }); y += 22 * s; };
      const para = (str, mk) => { const lines = wrapSerif(ctx, str, 22 * s, maxW); let off = 0;
        lines.forEach(ln => { y += 28 * s; ctx.font = `400 ${22 * s}px ${SERIF}`;
          if (mk) { const a0 = Math.max(mk[0], off), a1 = Math.min(mk[1], off + ln.length); if (a1 > a0) { const xa = ctx.measureText(ln.slice(0, a0 - off)).width, xb = ctx.measureText(ln.slice(0, a1 - off)).width; ctx.fillStyle = "rgba(242,177,52,0.45)"; ctx.fillRect(px + xa - 2, y - 21 * s, xb - xa + 4, 28 * s); } }
          ctx.fillStyle = "#000000"; ctx.fillText(ln, px, y); off += ln.length + 1; }); y += 18 * s; };
      if (st.h1 != null) { if (st.h1Open) { big(st.h1); (st.p || []).forEach(p => big(p)); } else { big(st.h1); geo.h1 = { y }; (st.p || []).forEach((p, i) => para(p, i === 0 ? st.mark : null)); } }
      if (st.img === "ok") { geo.img = { x: px, y: y + 4 * s, w: 300 * s, h: 188 * s }; HK.setorImg(ctx, px, y + 4 * s, 300 * s, 188 * s); y += 200 * s; }
      else if (st.img === "broken") { geo.img = { x: px, y: y + 4 * s }; HK.brokenImg(ctx, px, y + 4 * s, st.alt || "", 22 * s); y += 40 * s; }
      if (st.link) { y += 30 * s; ctx.font = `400 ${22 * s}px ${SERIF}`; const lw = ctx.measureText(st.link).width; ctx.fillStyle = st.hover ? "#5A2BAF" : "#0000EE"; ctx.fillText(st.link, px, y);
        ctx.fillRect(px, y + 3 * s, lw, 1.6 * s); geo.link = { x: px, y: y - 22 * s, w: lw, h: 28 * s, cx: px + lw / 2, cy: y - 7 * s }; }
      if (st.status) { ctx.font = `500 ${17}px ${K.FONT}`; const tw = ctx.measureText(st.status).width + 24; ctx.fillStyle = "#F1F4F6"; ctx.fillRect(a.x, a.y + a.h - 32, tw, 32); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1; ctx.strokeRect(a.x, a.y + a.h - 32, tw, 32);
        ctx.fillStyle = "#3D4B55"; ctx.fillText(st.status, a.x + 12, a.y + a.h - 10); geo.status = { x: a.x, y: a.y + a.h - 32, w: tw, h: 32 }; }
      geo.bottom = y; return geo;
    });
  };
  function wrapSerif(ctx, s, size, maxW, weight = 400) {
    ctx.font = `${weight} ${size}px ${SERIF}`; const words = s.split(" "), lines = []; let cur = "";
    words.forEach(w => { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }); if (cur) lines.push(cur); return lines;
  }
  // browser untuk file lokal: bilah alamat menampilkan "File" alih-alih gembok
  HK.browser = function (ctx, x, y, w, h, opt = {}) {
    const bg = W.browser(ctx, x, y, w, h, { tabs: [{ title: opt.tab || "Setor Sampah", icon: "home" }], url: opt.url || "file:///…/web-setor-sampah/index.html", ...opt });
    const u = bg.url; ctx.fillStyle = "#F1F4F6"; ctx.fillRect(u.x + 10, u.y + 4, u.tx - u.x - 14, u.h - 8);
    if (opt.reloadHot) { ctx.fillStyle = "#DCE9F7"; ctx.beginPath(); ctx.arc(bg.reload.cx, bg.reload.cy, 20, 0, Math.PI * 2); ctx.fill(); W.icon(ctx, "reload", bg.reload.cx, bg.reload.cy, 24, "#1A73C8"); }
    ctx.fillStyle = "#F1F4F6"; ctx.fillRect(u.x + 10, u.y + 4, 34, u.h - 8);
    ctx.strokeStyle = "#5B6B76"; ctx.lineWidth = 2; rr(ctx, u.x + 18, u.cy - 10, 15, 20, 3); ctx.stroke();
    return bg;
  };

  // ---------- pengelola file ----------
  // items: [{name, kind: "folder" | "png" | "html", sel, hot, typing}]
  HK.files = function (ctx, x, y, w, h, opt = {}) {
    const area = K.layar.window(ctx, x, y, w, h, { title: "File" });
    ctx.fillStyle = "#F7F9FA"; ctx.fillRect(area.x, area.y, 220, area.h);
    ["Desktop", "Dokumen", "Unduhan", "Gambar"].forEach((s, i) => { const on = s === (opt.side || "Dokumen"); if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, area.x + 10, area.y + 16 + i * 50, 200, 42, 8); ctx.fill(); }
      text(ctx, s, area.x + 30, area.y + 44 + i * 50, 21, { weight: on ? 800 : 600, color: on ? "#1A73C8" : "#3D4B55" }); });
    text(ctx, opt.path || "Dokumen", area.x + 250, area.y + 44, 22, { weight: 800, color: "#3D4B55" });
    ctx.fillStyle = "#DDE5EA"; ctx.fillRect(area.x + 240, area.y + 62, area.w - 260, 1.5);
    const g = { item: [] };
    (opt.items || []).forEach((it, i) => { const ix = area.x + 260 + i * 190, iy = area.y + 90;
      if (it.sel) { ctx.fillStyle = "#DCE9F7"; rr(ctx, ix - 10, iy - 10, 170, 190, 12); ctx.fill(); }
      if (it.kind === "folder") { ctx.fillStyle = "#F2C14E"; rr(ctx, ix + 20, iy + 20, 110, 80, 8); ctx.fill(); ctx.fillStyle = "#E0A92B"; rr(ctx, ix + 20, iy + 12, 50, 20, 6); ctx.fill(); ctx.fillStyle = "#F7D27A"; rr(ctx, ix + 20, iy + 34, 110, 66, 8); ctx.fill(); }
      else if (it.kind === "png") HK.setorImg(ctx, ix + 10, iy + 20, 130, 82);
      else { ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#8A99A3"; ctx.lineWidth = 2; rr(ctx, ix + 40, iy + 10, 72, 96, 8); ctx.fill(); ctx.stroke(); text(ctx, "</>", ix + 76, iy + 70, 24, { align: "center", weight: 900, color: "#1C6BB0" }); }
      const nm = it.name + (it.typing ? "|" : ""); text(ctx, nm, ix + 75, iy + 140, 19, { align: "center", weight: 700, color: "#1F2A33", fit: 170 });
      if (it.typing != null) { ctx.strokeStyle = "#1A73C8"; ctx.lineWidth = 2; ctx.strokeRect(ix - 4, iy + 118, 158, 32); }
      g.item.push({ cx: ix + 75, cy: iy + 60 }); });
    g.area = area; return g;
  };
  // dialog "Simpan sebagai"
  HK.saveDialog = function (ctx, cx, y, opt = {}) {
    const w = 700, h = 330, x = cx - w / 2;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.3)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 8; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 14); ctx.clip(); ctx.fillStyle = "#EEF2F5"; ctx.fillRect(x, y, w, 50); ctx.restore();
    text(ctx, "Simpan sebagai", x + w / 2, y + 33, 22, { align: "center", weight: 800, color: "#1F2A33" });
    text(ctx, "Folder:", x + 30, y + 98, 21, { weight: 700, color: "#5B6B76" });
    ctx.fillStyle = opt.folderHot ? "#DCE9F7" : "#F1F4F6"; rr(ctx, x + 130, y + 72, 400, 40, 8); ctx.fill();
    ctx.fillStyle = "#F2C14E"; rr(ctx, x + 144, y + 82, 26, 20, 4); ctx.fill(); text(ctx, opt.folder || "Dokumen", x + 182, y + 99, 21, { weight: 700, color: "#1F2A33" });
    text(ctx, "setor.png", x + 182, y + 148, 19, { weight: 600, color: "#8A99A3" }); HK.setorImg(ctx, x + 136, y + 130, 36, 24);
    text(ctx, "Nama file:", x + 30, y + 218, 21, { weight: 700, color: "#5B6B76" });
    const f = W.field(ctx, x + 150, y + 190, 400, { value: opt.name || "", focus: opt.nameFocus, caret: opt.caret, h: 48, size: 22, mark: opt.nameMark });
    const btn = W.button(ctx, x + w - 180, y + h - 70, 150, 48, "Simpan", { press: opt.press || 0, size: 21 });
    W.button(ctx, x + w - 350, y + h - 70, 150, 48, "Batal", { kind: "secondary", size: 21 });
    return { name: f, btn: btn || { cx: x + w - 105, cy: y + h - 46 }, folder: { cx: x + 330, cy: y + 92 } };
  };

  K.s29 = HK;
})(typeof window !== "undefined" ? window : globalThis);
