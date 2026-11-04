/* Layar grafik: pembantu gambar grafik generik untuk video simulasi (S04, S06, S32, ...). Muat setelah kiko-core.js dan layar.js:
     "engine": ["../../_alat/kiko-core.js", "../../_alat/layar.js", "../../_alat/layar_grafik.js", "scenes.js"]
   Pemilik: kelompok S03/S04. Kelompok lain hanya memakai; tambahan fungsi lewat pemilik.

   API (Kiko.grafik = G):
   G.chart(ctx, x, y, w, h, spec) -> geo     objek grafik lengkap (kotak putih, judul, subjudul, judul sumbu, plot, legenda)
     spec.type      "batang" (batang tegak) | "garis" | "lingkaran" | "titik" (sebar)
     spec.labels    ["Bakso", ...] kategori sumbu datar (batang/garis) atau potongan (lingkaran); untuk "titik": nilai x (angka)
     spec.series    [{ name, values: [..], color }]  (satu seri cukup: spec.values + spec.color)
     spec.title, spec.subtitle, spec.xTitle, spec.yTitle   teks; kosong = tidak digambar. spec.ph = {title: "Judul grafik"} teks abu-abu bila kosong
     spec.yMin, spec.yMax, spec.yStep   sumbu tegak; yMin bawaan = min(0, data) (grafik jujur), yMax/yStep otomatis (G.nice)
     spec.dataLabels  true = angka di atas batang/titik; spec.dec = jumlah desimal (koma Indonesia); spec.unit = akhiran label data
     spec.legend    true = legenda (otomatis untuk lingkaran dan >1 seri); spec.percent (lingkaran) = tampilkan persen
     spec.trend     true = garis tren lurus putus-putus (regresi linear) untuk "garis"/"titik"; spec.trendColor
     spec.grow      0..1 animasi muncul (batang tumbuh, garis tergambar, lingkaran berputar); spec.hi = indeks yang disorot
     spec.sel       true = grafik terpilih (bingkai biru + gagang); spec.s = skala huruf (bawaan 1)
     geo: { box, plot {x,y,w,h}, yOf(v), xOf(i), bar(i, si) {x,y,w,h}, pt(i, si) {x,y}, pie {cx,cy,r}, ticks [..], title {x,y}, yAxis {x,y}, xAxis {x,y} }
   G.icon(ctx, type, x, y, s, color)          ikon kecil jenis grafik (kotak s×s) untuk menu dan panel
   G.panel(ctx, x, y, w, h, st) -> geo       panel "Pengaturan grafik": st.tabs ["Penyiapan","Sesuaikan"], st.tab, st.title,
     st.rows: [{ kind: "dropdown", label, value, icon, open, items: [{label, icon}], hi }, { kind: "field", label, value, focus, caret },
               { kind: "toggle", label, on }, { kind: "section", label, open }, { kind: "pair", label, a: {label, value, focus}, b: {...} }]
     geo: { tab(name) {x,y}, row(label) {x,y,w,h, box: {x,y,w,h}, item(i) {x,y}, a, b} } untuk sasaran pointer
   G.nice(min, max, n) -> {min, max, step}  skala sumbu yang rapi;  G.fmt(v, dec) -> "3,2" (format Indonesia)
   G.PAL                                     palet seri (batang/lingkaran), sama dengan Kiko.C bila ada */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, ease, clamp, lerp } = H;
  const G = {};
  const BLUE = "#1A73C8", GRID = "#E3E9ED", AXIS = "#8A99A3", INK = C.ink, INK2 = C.ink2;
  G.PAL = ["#2E7E9A", "#F2B134", "#2E9E5B", "#D9443B", "#7A5AA6", "#5B6B76", "#8FD0E6"];

  G.fmt = (v, dec = 0) => Number(v).toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  G.nice = function (min, max, n = 5) {
    if (max <= min) max = min + 1;
    const raw = (max - min) / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
    const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
    return { min: Math.floor(min / step + 1e-9) * step, max: Math.ceil(max / step - 1e-9) * step, step };
  };
  const decOf = step => { const s = String(+step.toFixed(6)); return s.includes(".") ? s.split(".")[1].length : 0; };

  // ---------- ikon jenis grafik ----------
  G.icon = function (ctx, type, x, y, s, color) {
    const c = color || "#2E7E9A"; ctx.save(); ctx.translate(x, y); const u = s / 24;
    ctx.strokeStyle = "#9AA8B1"; ctx.lineWidth = 1.5 * u; ctx.beginPath(); ctx.moveTo(3 * u, 3 * u); ctx.lineTo(3 * u, 21 * u); ctx.lineTo(22 * u, 21 * u); ctx.stroke();
    ctx.fillStyle = c; ctx.strokeStyle = c;
    if (type === "batang") { [[6, 10], [11, 5], [16, 13]].forEach(([bx, by]) => ctx.fillRect(bx * u, by * u, 4 * u, (20 - by) * u)); }
    else if (type === "garis") { ctx.lineWidth = 2.5 * u; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(5 * u, 16 * u); ctx.lineTo(10 * u, 10 * u); ctx.lineTo(15 * u, 13 * u); ctx.lineTo(21 * u, 5 * u); ctx.stroke(); }
    else if (type === "lingkaran") { ctx.beginPath(); ctx.moveTo(13 * u, 12 * u); ctx.arc(13 * u, 12 * u, 8.5 * u, -Math.PI / 2, Math.PI * 0.75); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#F2B134"; ctx.beginPath(); ctx.moveTo(13 * u, 12 * u); ctx.arc(13 * u, 12 * u, 8.5 * u, Math.PI * 0.75, Math.PI * 1.5); ctx.closePath(); ctx.fill(); }
    else if (type === "titik") { [[7, 16], [10, 12], [14, 13], [17, 8], [20, 6]].forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px * u, py * u, 1.9 * u, 0, Math.PI * 2); ctx.fill(); }); }
    ctx.restore();
  };

  // ---------- grafik ----------
  G.chart = function (ctx, x, y, w, h, spec = {}) {
    const s = spec.s || 1, type = spec.type || "batang", grow = spec.grow == null ? 1 : clamp(spec.grow, 0, 1);
    const series = spec.series || [{ name: spec.name || "", values: spec.values || [], color: spec.color }];
    const labels = spec.labels || [];
    // kotak
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.12)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 3; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.restore();
    ctx.strokeStyle = spec.sel ? BLUE : "#D3DCE2"; ctx.lineWidth = spec.sel ? 3 : 1.5; ctx.strokeRect(x, y, w, h);
    if (spec.sel) [[0, 0], [0.5, 0], [1, 0], [0, 0.5], [1, 0.5], [0, 1], [0.5, 1], [1, 1]].forEach(([a, b]) => { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + a * w - 6, y + b * h - 6, 12, 12); ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.strokeRect(x + a * w - 6, y + b * h - 6, 12, 12); });
    const geo = { box: { x, y, w, h } };
    // judul
    let top = y + 22 * s;
    const ttl = spec.title || (spec.ph && spec.ph.title), ttlPh = !spec.title && spec.ph && spec.ph.title;
    if (ttl) { text(ctx, ttl, x + w / 2, top + 26 * s, 28 * s, { align: "center", weight: 800, color: ttlPh ? "#A9B6BE" : INK, fit: w - 40 }); geo.title = { x: x + w / 2, y: top + 14 * s }; top += 40 * s; }
    if (spec.subtitle) { text(ctx, spec.subtitle, x + w / 2, top + 18 * s, 19 * s, { align: "center", weight: 600, color: INK2, fit: w - 40 }); top += 30 * s; }
    if (!ttl && !spec.subtitle) top += 6 * s;
    const pie = type === "lingkaran", showLegend = spec.legend != null ? spec.legend : (pie || series.length > 1);
    // area legenda (kanan) untuk lingkaran; bawah untuk banyak seri
    let right = x + w - 24 * s, bottom = y + h - 18 * s;
    if (showLegend && pie) right = x + w - Math.min(w * 0.42, 230 * s);
    if (showLegend && !pie) bottom -= 36 * s;
    if (pie) {
      const vals = series[0].values, tot = vals.reduce((a, b) => a + b, 0) || 1;
      const cx = (x + right) / 2 + 6 * s, cy = (top + bottom) / 2, r = Math.max(20, Math.min(right - x - 50 * s, bottom - top - 16 * s) / 2);
      geo.pie = { cx, cy, r };
      let a0 = -Math.PI / 2; const end = -Math.PI / 2 + grow * Math.PI * 2;
      vals.forEach((v, i) => { const a1 = a0 + v / tot * Math.PI * 2, e = Math.min(a1, end); if (e > a0) {
          const col = (spec.colors && spec.colors[i]) || G.PAL[i % G.PAL.length]; const off = spec.hi === i ? 10 * s : 0, mid = (a0 + e) / 2;
          ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx + Math.cos(mid) * off, cy + Math.sin(mid) * off); ctx.arc(cx + Math.cos(mid) * off, cy + Math.sin(mid) * off, r, a0, e); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.stroke();
          if (e >= a1 - 1e-6 && (spec.percent || spec.dataLabels) && v / tot > 0.04) { const lr = r * 0.64, lx = cx + Math.cos(mid) * (lr + off), ly = cy + Math.sin(mid) * (lr + off);
            const lab = spec.percent ? G.fmt(Math.round(v / tot * 100)) + "%" : G.fmt(v, spec.dec || 0);
            text(ctx, lab, lx, ly + 8 * s, 22 * s, { align: "center", weight: 900, color: "#FFFFFF" }); } }
        a0 = a1; });
      if (showLegend) { const lx = right + 16 * s; let ly = cy - labels.length * 19 * s;
        labels.forEach((lab, i) => { ctx.fillStyle = (spec.colors && spec.colors[i]) || G.PAL[i % G.PAL.length]; rr(ctx, lx, ly + 6 * s, 20 * s, 20 * s, 4); ctx.fill();
          text(ctx, lab, lx + 30 * s, ly + 23 * s, 20 * s, { weight: 700, color: INK, fit: x + w - lx - 40 * s }); ly += 38 * s; }); }
      return geo;
    }
    // sumbu tegak
    const all = series.flatMap(sr => sr.values).filter(v => v != null);
    const dMin = Math.min(...all), dMax = Math.max(...all);
    const lo = spec.yMin != null ? spec.yMin : Math.min(0, dMin);
    let sc = G.nice(lo, spec.yMax != null ? spec.yMax : dMax + (dMax - lo) * 0.08, spec.ticks || 5);
    if (spec.yMin != null) sc.min = spec.yMin; if (spec.yMax != null) sc.max = spec.yMax; if (spec.yStep) sc.step = spec.yStep;
    const dec = spec.tickDec != null ? spec.tickDec : decOf(sc.step);
    ctx.font = `600 ${19 * s}px Inter`; let tw = 0; for (let v = sc.min; v <= sc.max + 1e-9; v += sc.step) tw = Math.max(tw, ctx.measureText(G.fmt(v, dec)).width);
    let left = x + 20 * s + tw + 12 * s; if (spec.yTitle) left += 36 * s;
    const catH = (type === "titik" ? 30 : 36) * s; bottom -= catH; if (spec.xTitle) bottom -= 34 * s;
    const plot = { x: left, y: top + 10 * s, w: right - left, h: bottom - top - 10 * s }; geo.plot = plot;
    const yOf = v => plot.y + plot.h - (v - sc.min) / (sc.max - sc.min) * plot.h; geo.yOf = yOf; geo.ticks = [];
    for (let v = sc.min; v <= sc.max + 1e-9; v += sc.step) { const yy = yOf(v); geo.ticks.push({ v, y: yy });
      ctx.strokeStyle = Math.abs(v - sc.min) < 1e-9 ? AXIS : GRID; ctx.lineWidth = Math.abs(v - sc.min) < 1e-9 ? 2 : 1.2; ctx.beginPath(); ctx.moveTo(plot.x, yy); ctx.lineTo(plot.x + plot.w, yy); ctx.stroke();
      text(ctx, G.fmt(v, dec), plot.x - 10 * s, yy + 7 * s, 19 * s, { align: "right", weight: 600, color: INK2 }); }
    geo.yAxis = { x: plot.x - 10 * s - tw / 2, y: plot.y + plot.h - 10 * s };
    if (spec.yTitle) { ctx.save(); ctx.translate(x + 26 * s, plot.y + plot.h / 2); ctx.rotate(-Math.PI / 2); text(ctx, spec.yTitle, 0, 0, 20 * s, { align: "center", weight: 800, color: INK, fit: plot.h }); ctx.restore(); }
    // sumbu datar
    const n = type === "titik" ? 0 : labels.length;
    let xOf; if (type === "titik") { const xs = labels.length ? labels : series[0].values.map((_, i) => i + 1); const xsc = G.nice(spec.xMin != null ? spec.xMin : Math.min(...xs), spec.xMax != null ? spec.xMax : Math.max(...xs), 5);
      xOf = v => plot.x + (v - xsc.min) / (xsc.max - xsc.min) * plot.w; geo.xs = xs;
      for (let v = xsc.min; v <= xsc.max + 1e-9; v += xsc.step) text(ctx, G.fmt(v, decOf(xsc.step)), xOf(v), plot.y + plot.h + 26 * s, 19 * s, { align: "center", weight: 600, color: INK2 }); }
    else { const bw = plot.w / Math.max(1, n); xOf = i => plot.x + bw * (i + 0.5);
      labels.forEach((lab, i) => text(ctx, String(lab), xOf(i), plot.y + plot.h + 28 * s, 20 * s, { align: "center", weight: 700, color: spec.hi === i ? INK : INK2, fit: bw - 6 })); }
    geo.xOf = xOf; geo.xAxis = { x: plot.x + plot.w / 2, y: plot.y + plot.h + 20 * s };
    if (spec.xTitle) text(ctx, spec.xTitle, plot.x + plot.w / 2, plot.y + plot.h + catH + 26 * s, 20 * s, { align: "center", weight: 800, color: INK, fit: plot.w });
    const base = yOf(Math.max(sc.min, Math.min(0, sc.max)));
    ctx.save(); ctx.beginPath(); ctx.rect(plot.x - 2, plot.y - 30 * s, plot.w + 4, plot.h + 30 * s + 1); ctx.clip();
    if (type === "batang") {
      const bw = plot.w / Math.max(1, n), gw = bw * 0.62, k = series.length, one = gw / k;
      geo.bar = (i, si = 0) => { const v = series[si].values[i]; const bx = xOf(i) - gw / 2 + one * si; const ytop = yOf(v); return { x: bx, y: Math.min(ytop, base), w: one, h: Math.abs(base - ytop) }; };
      series.forEach((sr, si) => sr.values.forEach((v, i) => { if (v == null) return; const g = ease(clamp(grow * 1.25 - i * 0.06, 0, 1)); const b = geo.bar(i, si);
        const hh = b.h * g; const col = sr.color || G.PAL[si % G.PAL.length];
        ctx.fillStyle = spec.hi != null && spec.hi !== i ? "#B9C7CF" : col; ctx.fillRect(b.x + 2, base - hh, b.w - 4, hh);
        if (spec.dataLabels && g > 0.98) text(ctx, G.fmt(v, spec.dec || 0) + (spec.unit || ""), b.x + b.w / 2, base - hh - 10 * s, 21 * s, { align: "center", weight: 800, color: INK }); }));
    } else {
      geo.pt = (i, si = 0) => ({ x: type === "titik" ? xOf(geo.xs[i]) : xOf(i), y: yOf(series[si].values[i]) });
      series.forEach((sr, si) => { const col = sr.color || G.PAL[si % G.PAL.length]; const pts = sr.values.map((v, i) => geo.pt(i, si));
        const xmax = plot.x + plot.w * grow;
        if (type === "garis") { ctx.strokeStyle = col; ctx.lineWidth = 4.5 * s; ctx.lineJoin = "round"; ctx.beginPath();
          pts.forEach((p, i) => { if (i === 0) { ctx.moveTo(p.x, p.y); return; } const q = pts[i - 1]; if (q.x >= xmax) return; if (p.x <= xmax) ctx.lineTo(p.x, p.y); else { const u = (xmax - q.x) / (p.x - q.x); ctx.lineTo(xmax, lerp(q.y, p.y, u)); } }); ctx.stroke(); }
        pts.forEach((p, i) => { if (p.x > xmax + 1) return; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(p.x, p.y, (type === "titik" ? 8 : 7) * s, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, (type === "titik" ? 6.5 : 5) * s, 0, Math.PI * 2); ctx.fill();
          if (spec.dataLabels) text(ctx, G.fmt(sr.values[i], spec.dec || 0) + (spec.unit || ""), p.x, p.y - 16 * s, 20 * s, { align: "center", weight: 800, color: INK }); });
        if (spec.trend && grow >= 1) { const xs = type === "titik" ? geo.xs : sr.values.map((_, i) => i), ys = sr.values, m = xs.length;
          const mx = xs.reduce((a, b) => a + b, 0) / m, my = ys.reduce((a, b) => a + b, 0) / m;
          const sl = xs.reduce((a, xv, i) => a + (xv - mx) * (ys[i] - my), 0) / (xs.reduce((a, xv) => a + (xv - mx) * (xv - mx), 0) || 1), ic = my - sl * mx;
          const X0 = type === "titik" ? Math.min(...xs) : 0, X1 = type === "titik" ? (spec.trendTo != null ? spec.trendTo : Math.max(...xs)) : m - 1;
          const px = v => type === "titik" ? xOf(v) : xOf(v);
          geo.trend = { slope: sl, intercept: ic };
          ctx.strokeStyle = spec.trendColor || "#D9443B"; ctx.lineWidth = 3 * s; ctx.setLineDash([12 * s, 8 * s]); ctx.beginPath(); ctx.moveTo(px(X0), yOf(sl * X0 + ic)); ctx.lineTo(px(X1), yOf(sl * X1 + ic)); ctx.stroke(); ctx.setLineDash([]); } });
    }
    ctx.restore();
    if (showLegend && !pie) { let lx = plot.x; series.forEach((sr, si) => { ctx.fillStyle = sr.color || G.PAL[si % G.PAL.length]; rr(ctx, lx, y + h - 46 * s, 18 * s, 18 * s, 4); ctx.fill();
      text(ctx, sr.name || "", lx + 26 * s, y + h - 31 * s, 19 * s, { weight: 700, color: INK }); ctx.font = `700 ${19 * s}px Inter`; lx += ctx.measureText(sr.name || "").width + 60 * s; }); }
    return geo;
  };

  // ---------- panel pengaturan grafik ----------
  G.panel = function (ctx, x, y, w, h, st = {}) {
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.strokeStyle = "#D3DCE2"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.stroke();
    text(ctx, st.title || "Pengaturan grafik", x + 20, y + 36, 23, { weight: 800, color: INK });
    const tabs = st.tabs || ["Penyiapan", "Sesuaikan"]; const tabPos = {}; let tx = x + 20;
    tabs.forEach(t => { ctx.font = "700 21px Inter"; const tw = ctx.measureText(t).width; const on = t === (st.tab || tabs[0]);
      text(ctx, t, tx, y + 80, 21, { weight: 700, color: on ? BLUE : INK2 }); if (on) { ctx.fillStyle = BLUE; ctx.fillRect(tx, y + 92, tw, 4); }
      tabPos[t] = { x: tx + tw / 2, y: y + 74 }; tx += tw + 34; });
    ctx.fillStyle = "#E1E7EB"; ctx.fillRect(x, y + 96, w, 2);
    const geo = { tab: t => tabPos[t], rows: {} }; geo.row = l => geo.rows[l];
    let yy = y + 110; const iw = w - 40; let overlay = null;
    (st.rows || []).forEach(r => {
      if (r.kind === "section") { ctx.fillStyle = r.on ? "#F2F7FC" : "#F7F9FA"; ctx.fillRect(x + 1, yy - 4, w - 2, 44); text(ctx, (r.open === false ? "▸ " : "▾ ") + r.label, x + 20, yy + 26, 21, { weight: 800, color: INK }); geo.rows[r.label] = { x: x + 20, y: yy, w: iw, h: 40, cx: x + w / 2, cy: yy + 18 }; yy += 46; return; }
      if (r.kind === "toggle") { const on = !!r.on; text(ctx, r.label, x + 20, yy + 28, 21, { weight: 700, color: INK });
        const bx = x + w - 76; ctx.fillStyle = on ? BLUE : "#C9D4DB"; rr(ctx, bx, yy + 8, 52, 28, 14); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(on ? bx + 38 : bx + 14, yy + 22, 11, 0, Math.PI * 2); ctx.fill();
        if (r.hot) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, x + 10, yy - 2, w - 20, 48, 10); ctx.stroke(); }
        geo.rows[r.label] = { x: x + 20, y: yy, w: iw, h: 44, cx: bx + 26, cy: yy + 22 }; yy += 50; return; }
      text(ctx, r.label, x + 20, yy + 20, 19, { weight: 700, color: INK2 });
      if (r.kind === "pair") { const hw = (iw - 16) / 2; const g2 = {};
        [["a", x + 20], ["b", x + 20 + hw + 16]].forEach(([k, bx]) => { const f = r[k] || {}; text(ctx, f.label || "", bx, yy + 46, 18, { weight: 600, color: INK2 });
          ctx.fillStyle = "#FFFFFF"; rr(ctx, bx, yy + 54, hw, 46, 8); ctx.fill(); ctx.strokeStyle = f.focus ? BLUE : "#C9D4DB"; ctx.lineWidth = f.focus ? 3 : 2; rr(ctx, bx, yy + 54, hw, 46, 8); ctx.stroke();
          text(ctx, f.value == null ? "" : String(f.value), bx + 14, yy + 85, 22, { weight: 700, color: f.auto ? "#A9B6BE" : INK });
          if (f.caret) { ctx.font = "700 22px Inter"; const cw = ctx.measureText(String(f.value || "")).width; ctx.fillStyle = INK; ctx.fillRect(bx + 16 + cw, yy + 64, 2.5, 26); }
          if (f.hot) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, bx - 5, yy + 49, hw + 10, 56, 10); ctx.stroke(); }
          g2[k] = { x: bx, y: yy + 54, w: hw, h: 46, cx: bx + hw / 2, cy: yy + 77 }; });
        geo.rows[r.label] = { x: x + 20, y: yy, w: iw, h: 104, ...g2 }; yy += 110; return; }
      const box = { x: x + 20, y: yy + 28, w: iw, h: 44 };
      ctx.fillStyle = "#FFFFFF"; rr(ctx, box.x, box.y, box.w, box.h, 8); ctx.fill(); ctx.strokeStyle = r.focus || r.open ? BLUE : "#C9D4DB"; ctx.lineWidth = r.focus || r.open ? 3 : 2; rr(ctx, box.x, box.y, box.w, box.h, 8); ctx.stroke();
      let vx = box.x + 14; if (r.icon) { G.icon(ctx, r.icon, box.x + 10, box.y + 8, 28); vx += 36; }
      const val = r.value == null ? "" : String(r.value), ph = !val && r.ph;
      // isi kotak: teks panjang digeser (yang terlihat ujungnya) saat diketik, dipotong saat tidak aktif
      const avail = box.x + box.w - (r.kind === "dropdown" ? 40 : 12) - vx; ctx.font = "700 22px Inter"; const tw = ctx.measureText(val || r.ph || "").width;
      ctx.save(); ctx.beginPath(); ctx.rect(vx - 2, box.y, avail + 4, box.h); ctx.clip();
      const tx0 = tw > avail && (r.focus || r.caret) ? vx + avail - tw - 4 : vx;
      text(ctx, val || r.ph || "", tx0, box.y + 30, 22, { weight: 700, color: ph ? "#A9B6BE" : INK });
      if (r.caret) { const cw = ctx.measureText(val).width; ctx.fillStyle = INK; ctx.fillRect(tx0 + cw + 2, box.y + 8, 2.5, 28); }
      ctx.restore();
      if (r.kind === "dropdown") text(ctx, "▾", box.x + box.w - 22, box.y + 30, 22, { align: "center", weight: 800, color: INK2 });
      if (r.hot) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, box.x - 5, box.y - 5, box.w + 10, box.h + 10, 10); ctx.stroke(); }
      const rowGeo = { x: x + 20, y: yy, w: iw, h: 84, box, cx: box.x + box.w / 2, cy: box.y + box.h / 2 };
      if (r.kind === "dropdown" && r.items) { rowGeo.item = i => ({ x: box.x + box.w * 0.6, y: box.y + box.h + 8 + i * 50 + 25 }); if (r.open) overlay = { r, box }; }
      geo.rows[r.label] = rowGeo; yy += 84;
    });
    if (overlay) { const { r, box } = overlay; const ih = 50, lh = 16 + r.items.length * ih;
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 5; ctx.fillStyle = "#FFFFFF"; rr(ctx, box.x, box.y + box.h + 4, box.w, lh, 10); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, box.x, box.y + box.h + 4, box.w, lh, 10); ctx.stroke();
      r.items.forEach((it, i) => { const iy = box.y + box.h + 12 + i * ih; const on = r.hi === i || r.hi === it.label;
        if (on) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(box.x + 4, iy, box.w - 8, ih - 2); }
        if (it.icon) G.icon(ctx, it.icon, box.x + 14, iy + 9, 30);
        text(ctx, it.label, box.x + (it.icon ? 56 : 16), iy + 33, 22, { weight: on ? 800 : 600, color: on ? BLUE : INK }); }); }
    return geo;
  };

  K.grafik = G;
})(typeof window !== "undefined" ? window : globalThis);
