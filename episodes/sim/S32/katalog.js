/* S32 pembantu khusus: toko komputer rekaan "KomputerKita" (komputerkita.example) di dalam W.browser: gambar laptop, katalog,
   halaman detail dengan tabel spesifikasi bertanda ✓/✗, daftar kebutuhan pengguna, dan panel langkah. Semua merek, harga, dan angka rekaan.
   Memakai layar.js + layar_web.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, W = K.web, UI = W.UI;
  const { rr, text, ease, clamp } = H;
  const KT = {};
  const BLUE = UI.focus, RED = UI.bad, GREEN = UI.good, NAVY = "#23394D";
  const F = (w, s) => `${w} ${s}px ${K.FONT}`;
  const meas = (ctx, s, size, weight = 600) => { ctx.font = F(weight, size); return ctx.measureText(s).width; };

  KT.ROWS = [["cpu", "Prosesor"], ["ram", "RAM"], ["disk", "Penyimpanan"], ["gpu", "Kartu grafis"], ["screen", "Layar"], ["bat", "Baterai"], ["kg", "Berat"], ["war", "Garansi"]];
  KT.L = {
    nusa: { name: "Nusa Lite 14", price: 5400000, color: "#7D8C96", short: ["4 GB RAM", "HDD 1 TB", "14 inci"],
      spec: { cpu: "4 inti, 2,4 GHz", ram: "4 GB", disk: "HDD 1 TB", gpu: "bawaan", screen: "14 inci, 1366 × 768", bat: "hingga 5 jam", kg: "1,9 kg", war: "1 tahun" },
      mark: { ram: "bad", disk: "bad", bat: "bad", war: "bad" } },
    bima: { name: "Bima 14", price: 8800000, color: "#2E7E9A", short: ["16 GB RAM", "SSD 512 GB", "14 inci"],
      spec: { cpu: "6 inti, 3,0 GHz", ram: "16 GB", disk: "SSD 512 GB", gpu: "bawaan", screen: "14 inci, 1920 × 1080", bat: "hingga 10 jam", kg: "1,4 kg", war: "2 tahun" },
      mark: { ram: "ok", disk: "ok", bat: "ok", kg: "ok", war: "ok" } },
    kirana: { name: "Kirana 15 Gaming", price: 15900000, color: "#B8342A", gaming: true, short: ["16 GB RAM", "SSD 1 TB", "kartu grafis 8 GB"],
      spec: { cpu: "8 inti, 4,2 GHz", ram: "16 GB", disk: "SSD 1 TB", gpu: "terpisah, 8 GB", screen: "15,6 inci, 165 Hz", bat: "hingga 4 jam", kg: "2,4 kg", war: "1 tahun" },
      mark: { ram: "ok", disk: "ok", gpu: "warn", bat: "bad", kg: "bad", war: "bad" } }
  };
  KT.rp = n => "Rp" + W.num(n);

  // gambar laptop terbuka (pusat bawah engsel di cx, cy), s = lebar
  KT.laptop = function (ctx, cx, cy, s, color, gaming) {
    const w = s, h = s * 0.62;
    ctx.fillStyle = "#2F3E48"; rr(ctx, cx - w / 2, cy - h, w, h, s * 0.04); ctx.fill();
    const g = ctx.createLinearGradient(cx - w / 2, cy - h, cx + w / 2, cy); g.addColorStop(0, gaming ? "#3B1D2A" : "#CFE6F0"); g.addColorStop(1, gaming ? "#7A2333" : "#8FC3D8");
    ctx.fillStyle = g; ctx.fillRect(cx - w / 2 + s * 0.04, cy - h + s * 0.04, w - s * 0.08, h - s * 0.08);
    if (gaming) { ctx.strokeStyle = "#FF6B5A"; ctx.lineWidth = s * 0.012; ctx.beginPath(); ctx.moveTo(cx - w * 0.3, cy - h * 0.3); ctx.lineTo(cx, cy - h * 0.7); ctx.lineTo(cx + w * 0.3, cy - h * 0.3); ctx.stroke(); }
    else { ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fillRect(cx - w * 0.36, cy - h * 0.78, w * 0.4, s * 0.03); ctx.fillRect(cx - w * 0.36, cy - h * 0.66, w * 0.55, s * 0.025); ctx.fillRect(cx - w * 0.36, cy - h * 0.58, w * 0.48, s * 0.025); }
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(cx - w * 0.56, cy + s * 0.06); ctx.lineTo(cx + w * 0.56, cy + s * 0.06); ctx.lineTo(cx + w * 0.5, cy); ctx.lineTo(cx - w * 0.5, cy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(cx - w * 0.1, cy + s * 0.01, w * 0.2, s * 0.02);
  };

  // kerangka situs toko. → body {x, y, w, h}
  KT.site = function (ctx, area) {
    const x = area.x, y = area.y, w = area.w;
    ctx.fillStyle = NAVY; ctx.fillRect(x, y, w, 64);
    ctx.fillStyle = "#F2B134"; ctx.beginPath(); ctx.arc(x + 46, y + 32, 16, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = NAVY; ctx.fillRect(x + 38, y + 26, 16, 10);
    text(ctx, "KomputerKita", x + 74, y + 42, 26, { weight: 900, color: "#FFFFFF" });
    ["Laptop", "Komputer meja", "Aksesori"].forEach((s, i) => text(ctx, s, x + 330 + i * 150, y + 40, 20, { weight: i ? 600 : 900, color: i ? "#C9D6E2" : "#FFFFFF" }));
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x + w - 330, y + 12, 250, 40, 20); ctx.fill(); W.icon(ctx, "search", x + w - 304, y + 32, 20, UI.ink2);
    text(ctx, "Cari produk…", x + w - 282, y + 40, 19, { weight: 500, color: UI.ink3 });
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + w - 58, y + 22); ctx.lineTo(x + w - 52, y + 22); ctx.lineTo(x + w - 46, y + 40); ctx.lineTo(x + w - 28, y + 40); ctx.lineTo(x + w - 24, y + 28); ctx.lineTo(x + w - 50, y + 28); ctx.stroke();
    return { x, y: y + 64, w, h: area.h - 64 };
  };
  // katalog tiga laptop. st.hi: indeks kartu disorot, st.press: denyut tombol. → {card(i), btn(i)}
  KT.ORDER = ["nusa", "bima", "kirana"];
  KT.catalog = function (ctx, area, st = {}) {
    const b = KT.site(ctx, area), geo = { card: [], btn: [] };
    text(ctx, "Laptop · 14–16 inci", b.x + 40, b.y + 44, 24, { weight: 900, color: UI.ink });
    text(ctx, "Urutkan: harga terendah ▾", b.x + b.w - 40, b.y + 44, 19, { align: "right", weight: 700, color: UI.ink2 });
    KT.ORDER.forEach((k, i) => { const d = KT.L[k], x = b.x + 40 + i * 413, y = b.y + 66, w = 393, h = 440, hi = st.hi === i;
      ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = hi ? C.accent : UI.line; ctx.lineWidth = hi ? 4 : 2; rr(ctx, x, y, w, h, 14); ctx.stroke();
      ctx.fillStyle = "#F1F4F6"; rr(ctx, x + 12, y + 12, w - 24, 170, 10); ctx.fill(); KT.laptop(ctx, x + w / 2, y + 152, 190, d.color, d.gaming);
      text(ctx, d.name, x + 22, y + 226, 27, { weight: 900, color: UI.ink });
      d.short.forEach((s, j) => text(ctx, "• " + s, x + 22, y + 262 + j * 30, 20, { weight: 600, color: UI.ink2 }));
      text(ctx, KT.rp(d.price), x + 22, y + 374, 29, { weight: 900, color: k === "kirana" ? RED : NAVY });
      const bt = W.button(ctx, x + 22, y + 388, w - 44, 44, "Lihat detail", { kind: "secondary", size: 20, press: st.press && hi ? st.press : 0 });
      geo.card.push({ x, y, w, h }); geo.btn.push(bt); });
    return geo;
  };
  // halaman detail: st.hi (kunci baris disorot), st.marks (true: tampilkan tanda; atau jumlah baris yang sudah dinilai), st.back (denyut tombol Kembali)
  KT.detail = function (ctx, area, key, st = {}) {
    const b = KT.site(ctx, area), d = KT.L[key], geo = {};
    text(ctx, "‹ Kembali ke katalog", b.x + 40, b.y + 40, 20, { weight: 800, color: st.backHot ? C.accentDark : BLUE });
    geo.back = { x: b.x + 40, y: b.y + 18, cx: b.x + 130, cy: b.y + 33 };
    ctx.fillStyle = "#F1F4F6"; rr(ctx, b.x + 40, b.y + 66, 400, 250, 12); ctx.fill(); KT.laptop(ctx, b.x + 240, b.y + 260, 260, d.color, d.gaming);
    text(ctx, d.name, b.x + 40, b.y + 368, 32, { weight: 900, color: UI.ink, fit: 400 });
    text(ctx, KT.rp(d.price), b.x + 40, b.y + 414, 32, { weight: 900, color: st.priceBad ? RED : NAVY });
    if (st.priceBad) { ctx.strokeStyle = RED; ctx.lineWidth = 3; rr(ctx, b.x + 32, b.y + 382, meas(ctx, KT.rp(d.price), 32, 900) + 16, 44, 8); ctx.stroke(); }
    text(ctx, "Stok tersedia · Garansi resmi", b.x + 40, b.y + 452, 19, { weight: 600, color: UI.ink3 });
    // tabel spesifikasi
    const tx = b.x + 490, tw = b.x + b.w - 40 - tx, ty = b.y + 26, rh = 56;
    text(ctx, "Spesifikasi", tx, ty + 24, 24, { weight: 900, color: UI.ink });
    const n = st.marks === true ? 99 : (st.marks || 0);
    KT.ROWS.forEach(([k, lab], i) => { const y = ty + 44 + i * rh, m = i < n ? d.mark[k] : null, hi = st.hi === k;
      ctx.fillStyle = hi ? "#FFF3D6" : m === "bad" ? "#FDF1F0" : m === "ok" ? "#F2FAF4" : m === "warn" ? "#FFF8E8" : i % 2 ? "#FFFFFF" : "#F6F8F9"; ctx.fillRect(tx, y, tw, rh);
      if (hi) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.strokeRect(tx + 1.5, y + 1.5, tw - 3, rh - 3); }
      text(ctx, lab, tx + 20, y + 37, 22, { weight: 700, color: UI.ink2 });
      text(ctx, d.spec[k], tx + 250, y + 37, 24, { weight: 800, color: m === "bad" ? RED : UI.ink, fit: tw - 320 });
      if (m) text(ctx, m === "ok" ? "✓" : m === "bad" ? "✗" : "!", tx + tw - 34, y + 39, 30, { align: "center", weight: 900, color: m === "ok" ? GREEN : m === "bad" ? RED : UI.warn });
      geo[k] = { x: tx, y, w: tw, h: rh, cx: tx + tw / 2, cy: y + rh / 2 }; });
    ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; ctx.strokeRect(tx, ty + 44, tw, rh * KT.ROWS.length);
    return geo;
  };

  // daftar kebutuhan Bu Rina dengan tanda ✓/✗ per laptop (marks: {ram: "ok"|"bad", ...})
  KT.NEEDS = [["ram", "RAM ≥ 8 GB (16 lebih baik)"], ["disk", "Penyimpanan SSD"], ["bat", "Baterai ≥ 8 jam"], ["war", "Garansi ≥ 2 tahun"], ["fund", "Dana Rp13 juta / 5 tahun"]];
  KT.needs = function (ctx, x, y, w, opt = {}) {
    const marks = opt.marks || {}, hh = 80 + KT.NEEDS.length * 70;
    H.card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, opt.title || "KEBUTUHAN BU RINA", x + 24, y + 44, 23, { weight: 900, color: C.accentDark, fit: w - 48 });
    KT.NEEDS.forEach(([k, s], i) => { const yy = y + 66 + i * 70, m = marks[k];
      ctx.fillStyle = m === "ok" ? C.goodBg : m === "bad" ? "#FBE1DF" : "#F4F6F5"; rr(ctx, x + 14, yy, w - 28, 60, 10); ctx.fill();
      text(ctx, s, x + 30, yy + 38, 20, { weight: 800, color: C.ink, fit: w - 110 });
      if (m) text(ctx, m === "ok" ? "✓" : "✗", x + w - 42, yy + 41, 30, { align: "center", weight: 900, color: m === "ok" ? GREEN : RED }); });
    return y + hh;
  };
  // panel langkah bernomor (sama dengan S09)
  KT.steps = function (ctx, x, y, w, title, items, n) {
    let hh = 70; const rows = items.map(s => H.wrap(ctx, s, 23, 700, w - 86)); rows.forEach(lines => hh += lines.length * 30 + 22);
    H.card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, title, x + 24, y + 44, 24, { weight: 900, color: C.accentDark });
    let yy = y + 74;
    rows.forEach((lines, i) => { const done = i < n, now = i === n;
      if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 10, yy - 8, w - 20, lines.length * 30 + 16, 10); ctx.fill(); }
      ctx.fillStyle = done ? GREEN : now ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(x + 36, yy + 13, 14, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 36, yy + 21, 18, { align: "center", weight: 900, color: "#FFFFFF" });
      lines.forEach((ln, j) => text(ctx, ln, x + 62, yy + 22 + j * 30, 23, { weight: 700, color: done ? C.ink2 : C.ink }));
      yy += lines.length * 30 + 22; });
    return y + hh;
  };

  K.katalog = KT;
})(typeof window !== "undefined" ? window : globalThis);
