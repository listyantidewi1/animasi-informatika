/* S27 pembantu gambar khusus: aplikasi formulir daring generik ("Formulir") di dalam browser.
   Beranda, penyunting (kartu judul, kartu pertanyaan, menu tipe, bilah alat samping), pratinjau sebagai responden,
   ringkasan respons dengan diagram batang. Tampilan netral (warna aksen biru baja), tanpa meniru merek mana pun.
   Dimuat setelah layar_web.js; API: Kiko.form (const F = K.form). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, W = K.web, UI = K.web.UI;
  const { rr, text, ease, clamp, lerp } = H;
  const F = {};
  const ACC = "#3D6F8E", ACC2 = "#E3EDF3", BG = "#EEF1F4", RED = "#D9443B";
  F.ACC = ACC; F.BG = BG;
  const meas = (ctx, s, size, weight = 600) => { ctx.font = `${weight} ${size}px ${K.FONT}`; return ctx.measureText(s).width; };
  F.meas = meas;
  F.TYPES = [["Jawaban singkat", "short"], ["Paragraf", "para"], "-", ["Pilihan ganda", "radio"], ["Kotak centang", "check"], ["Dropdown", "drop"], "-", ["Tanggal", "date"], ["Angka", "num"]];
  F.typeName = k => (F.TYPES.find(t => t !== "-" && t[1] === k) || ["?"])[0];
  const OPT = k => k === "radio" || k === "check" || k === "drop";

  // ---------- ikon tipe ----------
  F.icon = function (ctx, kind, cx, cy, s, color, on) {
    const c = color || UI.ink2; ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = Math.max(2, s * 0.11); ctx.lineCap = "round"; ctx.lineJoin = "round";
    const ln = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(cx + x1 * s, cy + y1 * s); ctx.lineTo(cx + x2 * s, cy + y2 * s); ctx.stroke(); };
    switch (kind) {
      case "short": ln(-0.4, -0.12, 0.4, -0.12); ln(-0.4, 0.16, 0.1, 0.16); break;
      case "para": [-0.3, -0.1, 0.1, 0.3].forEach((yy, i) => ln(-0.4, yy, i === 3 ? 0.1 : 0.4, yy)); break;
      case "radio": ctx.beginPath(); ctx.arc(cx, cy, s * 0.38, 0, Math.PI * 2); ctx.stroke(); if (on !== false) { ctx.beginPath(); ctx.arc(cx, cy, s * 0.18, 0, Math.PI * 2); ctx.fill(); } break;
      case "check": rr(ctx, cx - s * 0.38, cy - s * 0.38, s * 0.76, s * 0.76, s * 0.1); if (on) { ctx.fill(); ctx.strokeStyle = "#FFFFFF"; } ctx.stroke(); if (on !== false) { ln(-0.2, 0.0, -0.04, 0.17); ln(-0.04, 0.17, 0.22, -0.16); } break;
      case "drop": ctx.beginPath(); ctx.arc(cx, cy, s * 0.4, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - s * 0.18, cy - s * 0.06); ctx.lineTo(cx + s * 0.18, cy - s * 0.06); ctx.lineTo(cx, cy + s * 0.14); ctx.closePath(); ctx.fill(); break;
      case "date": rr(ctx, cx - s * 0.4, cy - s * 0.32, s * 0.8, s * 0.72, s * 0.08); ctx.stroke(); ln(-0.4, -0.08, 0.4, -0.08); ln(-0.2, -0.44, -0.2, -0.22); ln(0.2, -0.44, 0.2, -0.22);
        ctx.fillRect(cx - s * 0.2, cy + s * 0.06, s * 0.14, s * 0.12); break;
      case "num": ctx.restore(); text(ctx, "123", cx, cy + s * 0.17, s * 0.46, { align: "center", weight: 900, color: c }); return;
      case "eye": ctx.beginPath(); ctx.moveTo(cx - s * 0.45, cy); ctx.quadraticCurveTo(cx, cy - s * 0.42, cx + s * 0.45, cy); ctx.quadraticCurveTo(cx, cy + s * 0.42, cx - s * 0.45, cy); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, s * 0.13, 0, Math.PI * 2); ctx.fill(); break;
      case "trash": rr(ctx, cx - s * 0.26, cy - s * 0.22, s * 0.52, s * 0.62, s * 0.06); ctx.stroke(); ln(-0.36, -0.28, 0.36, -0.28); ln(-0.1, -0.4, 0.1, -0.4); break;
      case "copy": rr(ctx, cx - s * 0.32, cy - s * 0.2, s * 0.5, s * 0.56, s * 0.06); ctx.stroke(); rr(ctx, cx - s * 0.14, cy - s * 0.38, s * 0.5, s * 0.56, s * 0.06); ctx.stroke(); break;
      case "plus": ctx.beginPath(); ctx.arc(cx, cy, s * 0.4, 0, Math.PI * 2); ctx.stroke(); ln(-0.2, 0, 0.2, 0); ln(0, -0.2, 0, 0.2); break;
      case "grid": rr(ctx, cx - s * 0.36, cy - s * 0.36, s * 0.72, s * 0.72, s * 0.08); ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ln(-0.36, -0.08, 0.36, -0.08); ln(-0.36, 0.14, 0.36, 0.14); ln(-0.08, -0.08, -0.08, 0.36); break;
      case "text": ctx.restore(); text(ctx, "Tt", cx, cy + s * 0.2, s * 0.56, { align: "center", weight: 900, color: c }); return;
    }
    ctx.restore();
  };
  F.formIcon = function (ctx, x, y, s) {
    ctx.fillStyle = ACC; rr(ctx, x, y, s * 0.8, s, s * 0.12); ctx.fill(); ctx.fillStyle = "#FFFFFF";
    [0.3, 0.52, 0.74].forEach(yy => { ctx.beginPath(); ctx.arc(x + s * 0.22, y + s * yy, s * 0.06, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x + s * 0.34, y + s * yy - s * 0.035, s * 0.3, s * 0.07); });
  };

  // ---------- bilah aplikasi + tab ----------
  F.app = function (ctx, a, st = {}) {
    const g = {};
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(a.x, a.y, a.w, 104);
    F.formIcon(ctx, a.x + 28, a.y + 12, 36);
    text(ctx, "Formulir", a.x + 72, a.y + 39, 24, { weight: 900, color: UI.ink });
    if (st.title) text(ctx, "·  " + st.title, a.x + 72 + meas(ctx, "Formulir", 24, 900) + 12, a.y + 39, 21, { weight: 600, color: UI.ink2 });
    const ex = a.x + a.w - 210, ey = a.y + 30; if (st.eyeHot) { ctx.fillStyle = ACC2; ctx.beginPath(); ctx.arc(ex, ey, 24, 0, Math.PI * 2); ctx.fill(); }
    F.icon(ctx, "eye", ex, ey, 34, UI.ink2); g.eye = { cx: ex, cy: ey };
    ctx.fillStyle = ACC; rr(ctx, a.x + a.w - 150, a.y + 10, 120, 42, 21); ctx.fill(); text(ctx, "Kirim", a.x + a.w - 90, a.y + 38, 20, { align: "center", weight: 800, color: "#FFFFFF" });
    const tabs = ["Pertanyaan", "Respons" + (st.count != null ? "  " + st.count : "")]; const on = st.tab || 0;
    const tw = tabs.map(t => meas(ctx, t, 21, 700)); let tx = a.x + a.w / 2 - (tw[0] + tw[1] + 50) / 2; g.tabs = [];
    tabs.forEach((t, i) => { text(ctx, t, tx, a.y + 90, 21, { weight: i === on ? 800 : 600, color: i === on ? ACC : UI.ink2 }); if (i === on) { ctx.fillStyle = ACC; rr(ctx, tx, a.y + 99, tw[i], 5, 2); ctx.fill(); }
      g.tabs.push({ x: tx, y: a.y + 66, w: tw[i], h: 34, cx: tx + tw[i] / 2, cy: a.y + 82 }); tx += tw[i] + 50; });
    ctx.fillStyle = UI.line; ctx.fillRect(a.x, a.y + 103, a.w, 1.5);
    ctx.fillStyle = BG; ctx.fillRect(a.x, a.y + 104, a.w, a.h - 104);
    g.body = { x: a.x, y: a.y + 104, w: a.w, h: a.h - 104 };
    return g;
  };

  // ---------- ukuran kartu ----------
  const nOpts = q => (q.options || []).length;
  F.bodyH = q => OPT(q.type) ? (nOpts(q) + (q.other ? 1 : 0) + (q.noAdd ? 0 : 1)) * 44 + 4 : q.type === "num" ? 46 + (q.limit ? 58 : 0) : q.type === "date" ? 58 : 46;
  F.qH = (q, active) => active ? 24 + 56 + 22 + F.bodyH(q) + 18 + 64 : 64 + (OPT(q.type) ? Math.min(nOpts(q), 3) * 32 + (nOpts(q) > 3 ? 26 : 0) : 32) + 20;
  F.CW = 760;
  F.editorScroll = function (a, st) {
    const bodyH = a.h - 104; let y = 18 + (st.titleH || 150) + 14, top = 0, bot = 0;
    (st.qs || []).forEach((q, i) => { const h = F.qH(q, i === st.active); if (i === st.active) { top = y; bot = y + h; } y += h + 14; });
    if (st.active == null) return 0;
    return Math.max(0, bot + 24 - bodyH);
  };

  // ---------- kartu pertanyaan ----------
  function qCard(ctx, x, y, w, q, active, st) {
    const h = F.qH(q, active), g = { x, y, w, h };
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.08)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.restore();
    if (q.flash) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, x, y, w, h, 10); ctx.stroke(); }
    if (!active) {
      text(ctx, q.title || "Pertanyaan", x + 28, y + 44, 22, { weight: 700, color: UI.ink, fit: w - 80 });
      if (q.required) text(ctx, "*", x + 34 + meas(ctx, q.title || "Pertanyaan", 22, 700), y + 44, 24, { weight: 800, color: RED });
      let yy = y + 82;
      if (OPT(q.type)) { (q.options || []).slice(0, 3).forEach((o, k) => { if (q.type === "drop") text(ctx, (k + 1) + ".", x + 40, yy, 18, { weight: 700, color: UI.ink3 }); else F.icon(ctx, q.type, x + 42, yy - 6, 20, UI.ink3, false);
          text(ctx, o, x + 66, yy, 18, { weight: 600, color: UI.ink2 }); yy += 32; }); if (nOpts(q) > 3) text(ctx, "…", x + 66, yy - 6, 18, { weight: 700, color: UI.ink3 }); }
      else text(ctx, { short: "Teks jawaban singkat", para: "Teks jawaban panjang", date: "Hari, bulan, tahun", num: "Angka" }[q.type] || "", x + 40, yy, 18, { weight: 600, color: UI.ink3 });
      return g;
    }
    ctx.fillStyle = UI.focus; ctx.save(); rr(ctx, x, y, w, h, 10); ctx.clip(); ctx.fillRect(x, y, 7, h); ctx.restore();
    // judul pertanyaan
    const tw = w - 56 - 280, tx = x + 28, ty = y + 24;
    ctx.fillStyle = "#F1F4F6"; ctx.fillRect(tx, ty, tw, 56); ctx.fillStyle = st.titleEdit ? ACC : "#9AA8B1"; ctx.fillRect(tx, ty + 54, tw, st.titleEdit ? 3 : 1.5);
    const qt = q.title == null ? "" : q.title;
    if (qt) text(ctx, qt, tx + 16, ty + 36, 23, { weight: 600, color: UI.ink }); else text(ctx, "Pertanyaan", tx + 16, ty + 36, 23, { weight: 500, color: UI.ink3 });
    if (st.titleEdit && st.caret) { ctx.fillStyle = UI.ink; ctx.fillRect(tx + 18 + (qt ? meas(ctx, qt, 23, 600) : 0), ty + 14, 2.5, 30); }
    g.titleBox = { x: tx, y: ty, w: tw, h: 56, cx: tx + tw / 2, cy: ty + 28 };
    // menu tipe
    const sx = x + w - 28 - 260, sw = 260;
    ctx.fillStyle = st.typeHot ? ACC2 : "#FFFFFF"; rr(ctx, sx, ty, sw, 56, 8); ctx.fill(); ctx.strokeStyle = st.typeHot ? ACC : UI.frame; ctx.lineWidth = st.typeHot ? 3 : 2; rr(ctx, sx, ty, sw, 56, 8); ctx.stroke();
    F.icon(ctx, q.type, sx + 30, ty + 28, 26, UI.ink2, true); text(ctx, F.typeName(q.type), sx + 58, ty + 36, 21, { weight: 700, color: UI.ink, fit: sw - 100 });
    W.icon(ctx, "caret", sx + sw - 26, ty + 30, 20, UI.ink2);
    g.typeBox = { x: sx, y: ty, w: sw, h: 56, cx: sx + sw / 2, cy: ty + 28 };
    // isi
    let yy = ty + 56 + 22; g.opt = [];
    if (OPT(q.type)) {
      (q.options || []).forEach((o, k) => {
        if (q.type === "drop") text(ctx, (k + 1) + ".", x + 40, yy + 29, 21, { weight: 700, color: UI.ink2 }); else F.icon(ctx, q.type, x + 46, yy + 22, 24, "#8A99A3", false);
        text(ctx, o, x + 76, yy + 29, 21, { weight: 600, color: UI.ink });
        if (st.editOpt === k) { ctx.fillStyle = ACC; ctx.fillRect(x + 72, yy + 38, Math.max(200, meas(ctx, o, 21, 600) + 20), 2.5); if (st.caret) { ctx.fillStyle = UI.ink; ctx.fillRect(x + 78 + meas(ctx, o, 21, 600), yy + 8, 2.5, 28); } }
        g.opt.push({ x: x + 76, y: yy, cx: x + 160, cy: yy + 22 }); yy += 44; });
      if (q.other) { F.icon(ctx, q.type, x + 46, yy + 22, 24, "#8A99A3", false); text(ctx, "Lainnya…", x + 76, yy + 29, 21, { weight: 600, color: UI.ink2 }); ctx.setLineDash([4, 5]); ctx.strokeStyle = "#9AA8B1"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 180, yy + 34); ctx.lineTo(x + 420, yy + 34); ctx.stroke(); ctx.setLineDash([]); yy += 44; }
      if (!q.noAdd) {
        if (q.type === "drop") text(ctx, (nOpts(q) + 1) + ".", x + 40, yy + 29, 21, { weight: 700, color: UI.ink3 }); else F.icon(ctx, q.type, x + 46, yy + 22, 24, "#C9D4DB", false);
        text(ctx, "Tambahkan opsi", x + 76, yy + 29, 21, { weight: 600, color: UI.ink3 }); g.addOpt = { cx: x + 150, cy: yy + 22 };
        if (q.type !== "drop" && !q.other) { const ox = x + 76 + meas(ctx, "Tambahkan opsi", 21, 600) + 10; text(ctx, "atau", ox, yy + 29, 21, { weight: 600, color: UI.ink3 });
          const lx = ox + meas(ctx, "atau ", 21, 600) + 4, lt = "tambahkan \"Lainnya\""; if (st.otherHot) { ctx.fillStyle = ACC2; rr(ctx, lx - 6, yy + 4, meas(ctx, lt, 21, 700) + 12, 34, 6); ctx.fill(); }
          text(ctx, lt, lx, yy + 29, 21, { weight: 700, color: UI.focus }); g.other = { cx: lx + meas(ctx, lt, 21, 700) / 2, cy: yy + 22 }; }
        yy += 44; }
    } else if (q.type === "date") {
      ctx.strokeStyle = "#9AA8B1"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 40, yy + 40); ctx.lineTo(x + 330, yy + 40); ctx.stroke();
      text(ctx, "Hari, bulan, tahun", x + 40, yy + 30, 20, { weight: 600, color: UI.ink3 }); F.icon(ctx, "date", x + 310, yy + 22, 26, UI.ink3); yy += 58;
    } else if (q.type === "num") {
      ctx.setLineDash([4, 5]); ctx.strokeStyle = "#9AA8B1"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 40, yy + 38); ctx.lineTo(x + 330, yy + 38); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "Angka", x + 40, yy + 28, 20, { weight: 600, color: UI.ink3 }); yy += 46;
      if (q.limit) { ctx.fillStyle = "#F4F7F9"; rr(ctx, x + 28, yy, w - 56, 50, 8); ctx.fill();
        text(ctx, "Batas: antara", x + 46, yy + 33, 21, { weight: 700, color: UI.ink }); let bx = x + 46 + meas(ctx, "Batas: antara", 21, 700) + 14; g.lim = [];
        q.limit.forEach((v, i) => { ctx.fillStyle = "#FFFFFF"; rr(ctx, bx, yy + 8, 80, 34, 6); ctx.fill(); ctx.strokeStyle = st.limEdit === i ? ACC : UI.frame; ctx.lineWidth = st.limEdit === i ? 3 : 1.5; rr(ctx, bx, yy + 8, 80, 34, 6); ctx.stroke();
          text(ctx, v, bx + 14, yy + 33, 21, { weight: 700, color: UI.ink }); g.lim.push({ cx: bx + 40, cy: yy + 25 }); bx += 80; if (!i) { text(ctx, "dan", bx + 12, yy + 33, 21, { weight: 700, color: UI.ink }); bx += meas(ctx, "dan", 21, 700) + 24; } });
        yy += 58; }
    } else {
      ctx.setLineDash([4, 5]); ctx.strokeStyle = "#9AA8B1"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 40, yy + 38); ctx.lineTo(x + 330, yy + 38); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, q.type === "para" ? "Teks jawaban panjang" : "Teks jawaban singkat", x + 40, yy + 28, 20, { weight: 600, color: UI.ink3 }); yy += 46;
    }
    // bilah bawah
    const by = y + h - 64; ctx.fillStyle = UI.line; ctx.fillRect(x + 28, by, w - 56, 1.5);
    const rx = x + w - 28; const tgx = rx - 64;
    W.toggle(ctx, tgx, by + 18, q.required == null ? 0 : (q.required === true ? 1 : q.required), {});
    text(ctx, "Wajib", tgx - 14, by + 40, 21, { align: "right", weight: 700, color: UI.ink });
    ctx.fillStyle = UI.line; ctx.fillRect(tgx - 100, by + 16, 1.5, 34);
    F.icon(ctx, "trash", tgx - 140, by + 33, 28, UI.ink2); F.icon(ctx, "copy", tgx - 196, by + 33, 28, UI.ink2);
    g.req = { cx: tgx + 26, cy: by + 32 };
    if (st.reqHot) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, tgx - 90, by + 8, 172, 50, 12); ctx.stroke(); }
    return g;
  }

  // ---------- penyunting ----------
  // st: title, desc, titleEdit ("title" | "desc"), caret, qs [{title, type, options, required (0..1), other, limit}], active, scroll,
  //     q: {titleEdit, typeHot, editOpt, reqHot, otherHot, limEdit} untuk kartu aktif, menu: {hi} (menu tipe terbuka), plusHot
  F.editor = function (ctx, a, st = {}) {
    const g = F.app(ctx, a, { title: st.title || "Formulir tanpa judul", eyeHot: st.eyeHot, count: st.count });
    const b = g.body, w = F.CW, x = b.x + 200;
    const scroll = st.scroll == null ? F.editorScroll(a, st) : st.scroll;
    W.clip(ctx, b, () => {
      let y = b.y + 18 - scroll;
      // kartu judul
      const th = 150;
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.08)"; ctx.shadowBlur = 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, th, 10); ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, x, y, w, th, 10); ctx.clip(); ctx.fillStyle = ACC; ctx.fillRect(x, y, w, 10); if (st.active == null && st.titleCardOn) { ctx.fillStyle = UI.focus; ctx.fillRect(x, y, 7, th); } ctx.restore();
      const t = st.title || "", te = st.titleEdit;
      if (te === "title") { ctx.fillStyle = ACC; ctx.fillRect(x + 28, y + 76, w - 56, 3); }
      text(ctx, t || "Formulir tanpa judul", x + 28, y + 66, 36, { weight: 800, color: t ? UI.ink : UI.ink3 });
      if (te === "title" && st.caret) { ctx.fillStyle = UI.ink; ctx.fillRect(x + 30 + meas(ctx, t || "", 36, 800), y + 32, 3, 42); }
      if (te === "desc") { ctx.fillStyle = ACC; ctx.fillRect(x + 28, y + 128, w - 56, 2.5); }
      text(ctx, st.desc || "Keterangan formulir", x + 28, y + 118, 21, { weight: 600, color: st.desc ? UI.ink2 : UI.ink3, fit: w - 60 });
      if (te === "desc" && st.caret) { ctx.fillStyle = UI.ink; ctx.fillRect(x + 30 + meas(ctx, st.desc || "", 21, 600), y + 98, 2.5, 26); }
      g.titleBox = { x: x + 28, y: y + 30, w: 400, h: 50, cx: x + 200, cy: y + 54 }; g.descBox = { cx: x + 200, cy: y + 112 };
      y += th + 14; g.q = [];
      (st.qs || []).forEach((q, i) => { const on = i === st.active; const qg = qCard(ctx, x, y, w, q, on, on ? (st.q || {}) : {}); g.q.push(qg); y += qg.h + 14; });
      // bilah alat samping, sejajar kartu aktif
      const ac = st.active != null ? g.q[st.active] : { y: b.y + 18 - scroll };
      const sy = clamp(ac.y, b.y + 10, b.y + b.h - 170), sx = x + w + 18;
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.1)"; ctx.shadowBlur = 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, sx, sy, 56, 160, 10); ctx.fill(); ctx.restore();
      if (st.plusHot) { ctx.fillStyle = ACC2; ctx.beginPath(); ctx.arc(sx + 28, sy + 32, 22, 0, Math.PI * 2); ctx.fill(); }
      F.icon(ctx, "plus", sx + 28, sy + 32, 32, UI.ink2); F.icon(ctx, "text", sx + 28, sy + 82, 30, UI.ink2); F.icon(ctx, "short", sx + 28, sy + 128, 30, UI.ink2);
      g.plus = { cx: sx + 28, cy: sy + 32 };
      // menu tipe
      if (st.menu && st.active != null) {
        const tb = g.q[st.active].typeBox, ih = 48; let mh = 12; F.TYPES.forEach(t => mh += t === "-" ? 14 : ih);
        let my = tb.y - 6; if (my + mh > b.y + b.h - 6) my = b.y + b.h - 6 - mh;
        ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, tb.x - 10, my, 290, mh, 10); ctx.fill(); ctx.restore();
        let yy = my + 6; g.menuItem = {};
        F.TYPES.forEach(t => { if (t === "-") { ctx.fillStyle = UI.line; ctx.fillRect(tb.x, yy + 6, 270, 2); yy += 14; return; }
          const hi = st.menu.hi === t[1], cur = st.qs[st.active].type === t[1]; if (hi || cur) { ctx.fillStyle = hi ? "#DCE9F7" : "#F1F4F6"; ctx.fillRect(tb.x - 6, yy, 282, ih); }
          F.icon(ctx, t[1], tb.x + 22, yy + ih / 2, 24, hi ? UI.focus : UI.ink2, true); text(ctx, t[0], tb.x + 50, yy + ih / 2 + 7, 21, { weight: hi ? 800 : 600, color: hi ? UI.focus : UI.ink });
          g.menuItem[t[1]] = { cx: tb.x + 120, cy: yy + ih / 2 }; yy += ih; });
      }
    });
    return g;
  };

  // ---------- beranda aplikasi ----------
  F.home = function (ctx, a, st = {}) {
    const g = F.app(ctx, a, {}); const b = g.body;
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(b.x, b.y, b.w, b.h);
    text(ctx, "Mulai formulir baru", b.x + 120, b.y + 52, 24, { weight: 800, color: UI.ink });
    const tiles = [["Formulir kosong", "plus"], ["Pendaftaran acara", "short"], ["Survei kepuasan", "radio"], ["Daftar hadir", "check"]];
    g.tile = [];
    tiles.forEach(([s, ic], i) => { const tx = b.x + 120 + i * 270, ty = b.y + 76;
      ctx.fillStyle = "#FFFFFF"; rr(ctx, tx, ty, 240, 180, 10); ctx.fill(); ctx.strokeStyle = st.hot === i ? ACC : UI.frame; ctx.lineWidth = st.hot === i ? 4 : 2; rr(ctx, tx, ty, 240, 180, 10); ctx.stroke();
      if (i === 0) { ctx.strokeStyle = ACC; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(tx + 120, ty + 50); ctx.lineTo(tx + 120, ty + 130); ctx.moveTo(tx + 80, ty + 90); ctx.lineTo(tx + 160, ty + 90); ctx.stroke(); }
      else { ctx.fillStyle = ACC2; ctx.fillRect(tx + 2, ty + 2, 236, 30); for (let k = 0; k < 3; k++) { F.icon(ctx, ic, tx + 40, ty + 66 + k * 36, 20, "#9AA8B1", false); ctx.fillStyle = "#DCE3E8"; rr(ctx, tx + 62, ty + 60 + k * 36, 120, 12, 6); ctx.fill(); } }
      text(ctx, s, tx, ty + 214, 21, { weight: 700, color: UI.ink }); g.tile.push({ cx: tx + 120, cy: ty + 90 }); });
    text(ctx, "Formulir terbaru", b.x + 120, b.y + 360, 22, { weight: 800, color: UI.ink });
    [["Survei Kantin Sehat", "diubah 2 Okt"], ["Daftar Hadir Rapat OSIS", "diubah 14 Sep"]].forEach(([s, d], i) => { const yy = b.y + 380 + i * 60;
      ctx.fillStyle = "#F6F8F9"; rr(ctx, b.x + 120, yy, 900, 50, 8); ctx.fill(); F.formIcon(ctx, b.x + 136, yy + 9, 32); text(ctx, s, b.x + 180, yy + 33, 20, { weight: 700, color: UI.ink }); text(ctx, d, b.x + 1000, yy + 33, 18, { align: "right", weight: 600, color: UI.ink3 }); });
    return g;
  };

  // ---------- pratinjau (tampilan responden) ----------
  // st.vals: {i: nilai}, st.err: {i: pesan}, st.focus: i, st.open: i (dropdown terbuka), st.hi, st.scroll, st.submitHot
  F.ansH = q => (OPT(q.type) && q.type !== "drop") ? nOpts(q) * 44 + 8 : q.type === "drop" ? 64 : 60;
  F.pvH = (q, err) => 66 + F.ansH(q) + (err ? 40 : 0) + 18;
  F.preview = function (ctx, a, st = {}) {
    const g = {}; const qs = st.qs || [], w = 820, x = a.x + (a.w - w) / 2;
    ctx.fillStyle = BG; ctx.fillRect(a.x, a.y, a.w, a.h);
    W.clip(ctx, a, () => {
      let y = a.y + 20 - (st.scroll || 0);
      ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, 170, 10); ctx.fill(); ctx.save(); rr(ctx, x, y, w, 170, 10); ctx.clip(); ctx.fillStyle = ACC; ctx.fillRect(x, y, w, 10); ctx.restore();
      text(ctx, st.title || "", x + 30, y + 66, 36, { weight: 800, color: UI.ink }); text(ctx, st.desc || "", x + 30, y + 106, 20, { weight: 600, color: UI.ink2, fit: w - 60 });
      ctx.fillStyle = UI.line; ctx.fillRect(x, y + 124, w, 1.5); text(ctx, "* Menunjukkan pertanyaan yang wajib diisi", x + 30, y + 154, 18, { weight: 600, color: RED });
      y += 184; g.q = [];
      qs.forEach((q, i) => { const err = (st.err || {})[i], h = F.pvH(q, err), v = (st.vals || {})[i], qg = { y };
        ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 10); ctx.fill(); if (err) { ctx.strokeStyle = RED; ctx.lineWidth = 2.5; rr(ctx, x, y, w, h, 10); ctx.stroke(); }
        text(ctx, q.title, x + 30, y + 44, 22, { weight: 700, color: UI.ink }); if (q.required) text(ctx, "*", x + 36 + meas(ctx, q.title, 22, 700), y + 44, 24, { weight: 800, color: RED });
        let yy = y + 66;
        if (q.type === "short" || q.type === "num" || q.type === "para") { const fw = 380, foc = st.focus === i;
          if (v) text(ctx, v, x + 30, yy + 30, 22, { weight: 600, color: UI.ink }); else text(ctx, "Jawabanmu", x + 30, yy + 30, 21, { weight: 500, color: UI.ink3 });
          if (foc && st.caret) { ctx.fillStyle = UI.ink; ctx.fillRect(x + 32 + (v ? meas(ctx, v, 22, 600) : 0), yy + 8, 2.5, 28); }
          ctx.fillStyle = err ? RED : foc ? ACC : "#9AA8B1"; ctx.fillRect(x + 30, yy + 42, fw, foc || err ? 3 : 1.5); qg.field = { cx: x + 30 + fw / 2, cy: yy + 24 }; }
        else if (q.type === "drop") { ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 30, yy, 240, 50, 8); ctx.fill(); ctx.strokeStyle = st.open === i ? ACC : UI.frame; ctx.lineWidth = 2; rr(ctx, x + 30, yy, 240, 50, 8); ctx.stroke();
          text(ctx, v || "Pilih", x + 48, yy + 33, 21, { weight: v ? 700 : 500, color: v ? UI.ink : UI.ink2 }); W.icon(ctx, "caret", x + 246, yy + 26, 20, UI.ink2); qg.drop = { cx: x + 150, cy: yy + 25, y: yy + 50, x: x + 30 }; }
        else if (q.type === "date") { ctx.fillStyle = "#F4F7F9"; rr(ctx, x + 30, yy, 260, 50, 8); ctx.fill(); text(ctx, v || "hh/bb/tttt", x + 48, yy + 33, 21, { weight: 600, color: v ? UI.ink : UI.ink3 }); F.icon(ctx, "date", x + 262, yy + 25, 24, UI.ink2); }
        else { qg.opt = []; (q.options || []).forEach((o, k) => { const on = Array.isArray(v) ? v.includes(o) : v === o;
            if (q.type === "radio") { ctx.strokeStyle = on ? ACC : "#8A99A3"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x + 46, yy + 20, 13, 0, Math.PI * 2); ctx.stroke(); if (on) { ctx.fillStyle = ACC; ctx.beginPath(); ctx.arc(x + 46, yy + 20, 7, 0, Math.PI * 2); ctx.fill(); } }
            else { ctx.fillStyle = on ? ACC : "#FFFFFF"; rr(ctx, x + 33, yy + 7, 26, 26, 4); ctx.fill(); ctx.strokeStyle = on ? ACC : "#8A99A3"; ctx.lineWidth = 2.5; rr(ctx, x + 33, yy + 7, 26, 26, 4); ctx.stroke();
              if (on) { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 39, yy + 20); ctx.lineTo(x + 44, yy + 26); ctx.lineTo(x + 54, yy + 13); ctx.stroke(); } }
            text(ctx, o, x + 74, yy + 28, 21, { weight: 600, color: UI.ink }); qg.opt.push({ cx: x + 46, cy: yy + 20 }); yy += 44; }); }
        if (err) { W.icon(ctx, "warn", x + 42, y + h - 34, 20, RED); text(ctx, err, x + 62, y + h - 26, 19, { weight: 700, color: RED }); }
        g.q.push(qg); y += h + 14; });
      ctx.fillStyle = st.submitHot ? "#2E5872" : ACC; rr(ctx, x, y + 6, 130, 50, 8); ctx.fill(); text(ctx, "Kirim", x + 65, y + 39, 22, { align: "center", weight: 800, color: "#FFFFFF" });
      text(ctx, "Kosongkan formulir", x + w, y + 38, 20, { align: "right", weight: 700, color: ACC }); g.submit = { cx: x + 65, cy: y + 31 };
      g.bottom = y + 70;
      // dropdown terbuka
      if (st.open != null && g.q[st.open] && g.q[st.open].drop) { const d = g.q[st.open].drop, q = qs[st.open], ih = 44;
        ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 18; ctx.fillStyle = "#FFFFFF"; rr(ctx, d.x, d.y + 4, 240, q.options.length * ih + 12, 8); ctx.fill(); ctx.restore();
        d.item = []; q.options.forEach((o, k) => { const iy = d.y + 10 + k * ih; if (st.hi === k) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(d.x + 4, iy, 232, ih); }
          text(ctx, o, d.x + 22, iy + 29, 21, { weight: st.hi === k ? 800 : 600, color: UI.ink }); d.item.push({ cx: d.x + 100, cy: iy + 22 }); }); }
    });
    g.contentH = (() => { let y = 184; qs.forEach((q, i) => { y += F.pvH(q, (st.err || {})[i]) + 14; }); return y + 120; })();
    return g;
  };
  // posisi atas kartu pratinjau ke-i (untuk menghitung gulir)
  F.pvTop = (qs, i, err = {}) => { let y = 20 + 184; for (let k = 0; k < i; k++) y += F.pvH(qs[k], err[k]) + 14; return y; };

  // ---------- ringkasan respons ----------
  F.bars = function (ctx, x, y, w, title, rows, u, opt = {}) {
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, opt.h || 330, 10); ctx.fill();
    text(ctx, title, x + 24, y + 42, 22, { weight: 800, color: UI.ink }); text(ctx, opt.sub || "24 jawaban", x + 24, y + 70, 17, { weight: 600, color: UI.ink3 });
    const max = Math.max(...rows.map(r => r[1])), lw = opt.lw || 110, bw = w - lw - 80, rh = opt.rh || 40;
    rows.forEach(([s, n], i) => { const yy = y + 92 + i * rh; text(ctx, s, x + 24, yy + 24, 19, { weight: 700, color: UI.ink, fit: lw - 10 });
      const ww = bw * n / max * clamp(u, 0, 1); ctx.fillStyle = opt.color || ACC; rr(ctx, x + 24 + lw, yy + 6, Math.max(4, ww), rh - 14, 5); ctx.fill();
      if (u > 0.9) text(ctx, String(n), x + 34 + lw + ww, yy + 25, 18, { weight: 800, color: UI.ink2 }); });
  };

  K.form = F;
})(typeof window !== "undefined" ? window : globalThis);
