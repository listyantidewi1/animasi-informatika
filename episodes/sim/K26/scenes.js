/* K26 Simulasi konsep: perjalanan satu pembayaran QRIS di Kedai Sari (fiktif) dan kebiasaan memeriksa: nama merchant sebelum PIN,
   menutupi layar saat mengetik PIN, notifikasi resmi di aplikasi sendiri (bukan gambar bukti bayar), dan tidak membuka tautan
   pembayaran dari pesan tak dikenal. Fokus pada pemeriksaan, bukan cara menipu. Aplikasi "Dompet Digital" rekaan, tanpa merek.
   Memakai pembantu F12.5 (K.bayar: kode mirip QR, dudukan QR kasir) dan D9.2 (K.jaringan: server).
   Adegan baru berawalan k26_ (video) dan k26s_ (Short, area 40–1040 × 20–810).
   Kunci beat: step (1/2 untuk k26_jalan), v (variasi), pilih (pilihan tebakan), cues (awal tiap langkah). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, J = K.jaringan, Bx = K.bayar, D = K.devices;
  const { rr, text, para, card, kiko, kid, ease, clamp, lerp } = H;
  const TEAL = "#2E7E9A";

  // ---------- waktu ----------
  const A = b => b.audio || b.dur;
  const lead = b => (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * A(b); };
  function cues(b, n, def) {
    if (b.cues && b.cues.length >= n && b.cues.every(c => b.text.indexOf(c) >= 0)) return b.cues.slice(0, n).map(c => at(b, c));
    const fr = b.fr || def; return Array.from({ length: n }, (_, i) => lead(b) + (fr[i] != null ? fr[i] : 0.2 + 0.6 * i / n) * A(b));
  }
  const stepOf = (c, l) => c.filter(t => l >= t).length;

  // ---------- pembantu gambar ----------
  const heading = (ctx, s, y = 205) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 900, fit: 1600 });
  const banner = (ctx, s, y, opt = {}) => { const w = opt.w || 1300; card(ctx, 960 - w / 2, y, w, 72, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 3, r: 16 }); text(ctx, s, 960, y + 47, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 40 }); };
  const chip = (ctx, s, cx, cy, opt = {}) => { ctx.font = `900 ${opt.size || 20}px Inter`; const w = opt.w || ctx.measureText(s).width + 28, h = opt.h || (opt.size || 20) + 16; card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: opt.fill || C.goodBg, stroke: opt.stroke, lw: 2, r: h / 2 }); text(ctx, s, cx, cy + (opt.size || 20) * 0.36, opt.size || 20, { align: "center", weight: 900, color: opt.color || C.good }); return w; };
  function thinking(ctx, x, y, l, dur) {
    const frac = clamp(l / Math.max(1, dur), 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    text(ctx, "?", x, y + 14, 40, { align: "center", weight: 900, color: C.accentDark });
  }
  function arrow(ctx, x1, y1, x2, y2, col, lw = 5) {
    const a = Math.atan2(y2 - y1, x2 - x1), hs = lw * 3.2;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * hs * 0.8, y2 - Math.sin(a) * hs * 0.8); ctx.stroke(); ctx.lineCap = "butt";
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - Math.cos(a - 0.45) * hs, y2 - Math.sin(a - 0.45) * hs); ctx.lineTo(x2 - Math.cos(a + 0.45) * hs, y2 - Math.sin(a + 0.45) * hs); ctx.closePath(); ctx.fill();
  }
  function tap(ctx, x, y, u) { if (u <= 0 || u >= 1) return; ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(x, y, 12 + 30 * u, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = "rgba(242,177,52,0.5)"; ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill(); }
  // tangan yang menutupi (dari bawah)
  function hand(ctx, x, y, w) {
    ctx.save(); ctx.fillStyle = C.skin || "#E8B996"; ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = 3;
    rr(ctx, x, y + w * 0.25, w, w * 0.75, w * 0.22); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 4; i++) { rr(ctx, x + w * 0.06 + i * w * 0.23, y + (i === 0 || i === 3 ? w * 0.08 : 0), w * 0.2, w * 0.5, w * 0.1); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  // aplikasi dompet rekaan di HP: layar 300×540 satuan, skala s
  function wallet(ctx, cx, cy, s, scr, o = {}) {
    const W = 300, Hh = 540; const sc = D.phone(ctx, cx, cy, W * s, Hh * s);
    ctx.save(); ctx.translate(sc.x, sc.y); ctx.scale(s, s); ctx.save(); rr(ctx, 0, 0, W, Hh, 26); ctx.clip();
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, Hh);
    const P = {};
    if (scr === "home") {
      ctx.fillStyle = "#DCE8EE"; ctx.fillRect(0, 0, W, Hh); text(ctx, "12.05", W / 2, 90, 44, { align: "center", weight: 800, color: "#1F2A33" });
      const apps = [["Kamera", "#7A8C99", "📷"], ["Pesan", "#3B9A5B", "💬"], ["Galeri", "#C77D2E", "🖼️"], ["Dompet Digital", TEAL, "👛"], ["Peta", "#5B7BC9", "🗺️"], ["Musik", "#B05BA8", "🎵"]];
      apps.forEach(([n, col, ic], i) => { const x = 30 + (i % 3) * 90, y = 170 + Math.floor(i / 3) * 120; const hl = o.app === n; if (hl) { ctx.fillStyle = "rgba(242,177,52,0.45)"; rr(ctx, x - 8, y - 8, 76, 76, 20); ctx.fill(); } ctx.fillStyle = col; rr(ctx, x, y, 60, 60, 16); ctx.fill(); text(ctx, ic, x + 30, y + 41, 28, { align: "center" }); text(ctx, n, x + 30, y + 84, 12, { align: "center", weight: 800, fit: 86 }); if (n === "Dompet Digital") P.app = [x + 30, y + 30]; });
    } else {
      ctx.fillStyle = TEAL; ctx.fillRect(0, 0, W, 60); text(ctx, o.title || "Dompet Digital", W / 2, 40, 22, { align: "center", weight: 900, color: "#fff" });
      if (scr === "pindai") {
        ctx.fillStyle = "#1A242B"; ctx.fillRect(0, 60, W, Hh - 60);
        const bs = 200, x0 = (W - bs) / 2, y0 = 140; Bx.qr(ctx, x0 + 30, y0 + 30, 140, o.seed || 7);
        ctx.strokeStyle = "#7FD3F0"; ctx.lineWidth = 6; [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(x0 + a * bs + (a ? -34 : 34), y0 + b * bs); ctx.lineTo(x0 + a * bs, y0 + b * bs); ctx.lineTo(x0 + a * bs, y0 + b * bs + (b ? -34 : 34)); ctx.stroke(); });
        if (o.scan != null) { const yy = y0 + 10 + (bs - 20) * (0.5 - 0.5 * Math.cos(o.scan * Math.PI * 2)); ctx.fillStyle = "rgba(127,211,240,0.85)"; ctx.fillRect(x0 + 8, yy, bs - 16, 4); }
        text(ctx, "arahkan ke kode QR", W / 2, y0 + bs + 50, 18, { align: "center", weight: 800, color: "#E8F0F4" });
      } else if (scr === "konfirmasi") {
        text(ctx, "bayar ke", W / 2, 110, 18, { align: "center", weight: 800, color: C.ink2 });
        card(ctx, 20, 126, W - 40, 72, { fill: o.warn ? C.badBg : "#FFF3D6", stroke: o.warn ? C.bad : C.accent, lw: 4, r: 12 }); text(ctx, o.nama || "Kedai Sari", W / 2, 172, 26, { align: "center", weight: 900, color: o.warn ? C.bad : C.ink, fit: W - 70 });
        text(ctx, "nominal", W / 2, 240, 18, { align: "center", weight: 800, color: C.ink2 }); text(ctx, o.nominal || "Rp15.000", W / 2, 290, 40, { align: "center", weight: 900 });
        const by = Hh - 96; card(ctx, 24, by, 116, 56, { fill: o.tap === "batal" ? "#FFF3D6" : "#fff", stroke: o.tap === "batal" ? C.accent : TEAL, lw: 3, r: 14 }); text(ctx, "Batal", 82, by + 37, 22, { align: "center", weight: 900, color: TEAL });
        ctx.fillStyle = TEAL; rr(ctx, 156, by, 120, 56, 14); ctx.fill(); text(ctx, "Bayar", 216, by + 37, 22, { align: "center", weight: 900, color: "#fff" });
        P.batal = [82, by + 28]; P.bayar = [216, by + 28];
      } else if (scr === "pin") {
        text(ctx, "masukkan PIN", W / 2, 112, 22, { align: "center", weight: 900 });
        for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(W / 2 - 75 + i * 30, 152, 9, 0, Math.PI * 2); ctx.fillStyle = i < (o.n || 0) ? TEAL : "#DCE6EC"; ctx.fill(); }
        for (let k = 0; k < 12; k++) { const lab = k < 9 ? String(k + 1) : k === 10 ? "0" : ""; if (!lab) continue; const bx = 45 + (k % 3) * 75 + 30, by = 220 + Math.floor(k / 3) * 70 + 30; const on = o.press === lab;
          ctx.fillStyle = on ? "#FFD27A" : "#EEF3F6"; ctx.beginPath(); ctx.arc(bx, by, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, lab, bx, by + 10, 24, { align: "center", weight: 800 }); P["k" + lab] = [bx, by]; }
        if (o.cover) hand(ctx, 10, 230, 280);
      } else if (scr === "berhasil") {
        ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(W / 2, 170, 56, 0, Math.PI * 2); ctx.fill(); text(ctx, "✓", W / 2, 192, 64, { align: "center", weight: 900, color: "#fff" });
        text(ctx, "pembayaran berhasil", W / 2, 270, 22, { align: "center", weight: 900 }); text(ctx, (o.nama || "Kedai Sari") + " · " + (o.nominal || "Rp15.000"), W / 2, 306, 18, { align: "center", weight: 800, color: C.ink2 });
        if (o.label) text(ctx, o.label, W / 2, 360, 16, { align: "center", weight: 800, color: C.bad });
      } else if (scr === "riwayat") {
        text(ctx, o.head || "Riwayat transaksi", 20, 100, 20, { weight: 900 }); if (o.sub) text(ctx, o.sub, 20, 126, 15, { weight: 700, color: C.ink2 });
        (o.rows || []).forEach(([t, n, amt, st], i) => { const y = 146 + i * 76, hl = o.hl === i; card(ctx, 14, y, W - 28, 66, { fill: hl ? C.goodBg : "#F4F8FB", stroke: hl ? C.good : "#DCE6EC", lw: hl ? 4 : 2, r: 12 });
          text(ctx, n, 28, y + 28, 18, { weight: 900, fit: 160 }); text(ctx, t + " · " + st, 28, y + 52, 14, { weight: 700, color: st === "berhasil" ? C.good : C.ink2 }); text(ctx, amt, W - 26, y + 40, 18, { align: "right", weight: 900 }); });
        if (o.empty) { card(ctx, 14, 146 + (o.rows || []).length * 76, W - 28, 66, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, o.empty, W / 2, 146 + (o.rows || []).length * 76 + 41, 16, { align: "center", weight: 900, color: C.bad, fit: W - 50 }); }
      }
    }
    if (o.notif) { const u = ease(clamp(o.notif.u == null ? 1 : o.notif.u, 0, 1)), y = lerp(-110, 8, u); ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 14; card(ctx, 10, y, W - 20, 96, { fill: "#fff", r: 16 }); ctx.restore(); ctx.fillStyle = TEAL; rr(ctx, 22, y + 14, 30, 30, 8); ctx.fill(); text(ctx, "🔔", 37, y + 36, 16, { align: "center" }); text(ctx, o.notif.title, 62, y + 34, 16, { weight: 900, fit: W - 90 }); para(ctx, o.notif.body, 22, y + 62, 14, W - 44, { weight: 700, color: C.ink2, lh: 1.15 }); }
    ctx.restore();
    if (o.tapAt && P[o.tapAt.k]) tap(ctx, P[o.tapAt.k][0], P[o.tapAt.k][1], o.tapAt.u);
    ctx.restore();
    const out = {}; Object.keys(P).forEach(k => out[k] = [sc.x + P[k][0] * s, sc.y + P[k][1] * s]); return out;
  }
  function bank(ctx, cx, cy, s, label) {
    ctx.fillStyle = "#5B7086"; ctx.beginPath(); ctx.moveTo(cx - s * 0.7, cy - s * 0.25); ctx.lineTo(cx, cy - s * 0.65); ctx.lineTo(cx + s * 0.7, cy - s * 0.25); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#DDE6EC"; ctx.fillRect(cx - s * 0.62, cy - s * 0.22, s * 1.24, s * 0.66); ctx.fillStyle = "#5B7086"; for (let i = 0; i < 4; i++) ctx.fillRect(cx - s * 0.5 + i * s * 0.32, cy - s * 0.16, s * 0.12, s * 0.52); ctx.fillRect(cx - s * 0.7, cy + s * 0.44, s * 1.4, s * 0.1);
    if (label) text(ctx, label, cx, cy + s * 0.9, 22, { align: "center", weight: 900 });
  }
  const NODES = [[300, "HP Dito", "pembeli"], [760, "server penyedia", "Dompet Digital"], [1200, "bank Kedai Sari", "penerbit merchant"], [1620, "HP kasir", "Kedai Sari"]];
  // diagram perjalanan: st = {pin: 0..1, toServer: 0..1, check: n, toBank: 0..1, credit: bool, notif: 0..1}
  function journey(ctx, st, l, o = {}) {
    const y = o.y || 420, S = o.s || 1;
    // garis
    for (let i = 0; i < 3; i++) { ctx.strokeStyle = "#CFDCD5"; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(NODES[i][0] + 120, y); ctx.lineTo(NODES[i + 1][0] - 120, y); ctx.stroke(); ctx.setLineDash([]); }
    // HP Dito
    wallet(ctx, NODES[0][0], y, o.ps || 0.72, st.notif > 0 || st.toServer >= 1 ? "berhasil" : "pin", { n: Math.round((st.pin || 0) * 6), cover: (st.pin || 0) > 0 && (st.toServer || 0) < 1, notif: st.notif > 0 ? { title: "Pembayaran berhasil", body: "Rp15.000 ke Kedai Sari", u: st.notif } : null });
    // server
    J.server(ctx, NODES[1][0], y, 120, 170, { label: false });
    if (st.check >= 1) chip(ctx, "PIN ✓", NODES[1][0], y - 140, { size: 22, w: 140 }); if (st.check >= 2) chip(ctx, "saldo ✓", NODES[1][0], y - 96, { size: 22, w: 140 });
    bank(ctx, NODES[2][0], y, 150);
    if (st.credit) chip(ctx, "saldo Kedai Sari +Rp15.000", NODES[2][0], y - 140, { size: 22 });
    wallet(ctx, NODES[3][0], y, o.ps || 0.72, "riwayat", { title: "Dompet Digital · Merchant", head: "Kedai Sari", sub: "masuk hari ini", rows: st.notif > 0.5 ? [["12.05", "dari Dito", "+Rp15.000", "berhasil"]] : [], hl: st.notif > 0.5 ? 0 : null, notif: st.notif > 0 ? { title: "Uang masuk Rp15.000", body: "Pembayaran QRIS dari Dito", u: st.notif } : null });
    NODES.forEach(([x, n, sub]) => { text(ctx, n, x, y + 238, 24, { align: "center", weight: 900 }); text(ctx, sub, x, y + 266, 19, { align: "center", weight: 700, color: C.ink2 }); });
    // paket uang
    const pk = (x, yy) => { card(ctx, x - 70, yy - 26, 140, 52, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 26 }); text(ctx, "Rp15.000", x, yy + 8, 22, { align: "center", weight: 900, color: C.accentDark }); };
    if (st.toServer > 0 && st.toServer < 1) pk(lerp(NODES[0][0] + 110, NODES[1][0] - 80, ease(st.toServer)), y - 8);
    if (st.notif > 0.3) { chip(ctx, "🔔 Rp15.000 ke Kedai Sari: berhasil", 560, y + 150, { size: 21, fill: "#fff", stroke: TEAL, color: TEAL }); chip(ctx, "🔔 uang masuk Rp15.000", 1430, y + 150, { size: 21, fill: "#fff", stroke: TEAL, color: TEAL }); }
    if (st.toBank > 0 && st.toBank < 1) pk(lerp(NODES[1][0] + 80, NODES[2][0] - 100, ease(st.toBank)), y - 8);
  }

  Object.assign(K.SCENES, {
    k26_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 240, 235, 30, { weight: 900, color: C.accentDark });
      ["menjelaskan perjalanan satu pembayaran QRIS", "membaca nama merchant sebelum PIN", "memeriksa notifikasi resmi di aplikasi"].forEach((s, i) => {
        const u = ease((l - 0.5 - i * 0.9) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 240, 280 + i * 110, 900, 88, { fill: C.bg2, r: 16 }); text(ctx, "✓", 280, 338 + i * 110, 36, { weight: 900, color: C.good }); text(ctx, s, 330, 336 + i * 110, 30, { weight: 800, fit: 790 }); ctx.globalAlpha = 1;
      });
      Bx.stand(ctx, 1300, 290, "Kedai Sari");
    },
    k26_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 620, 400, { fill: C.bg2, r: 22 });
      text(ctx, "F12.5", 570, 390, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Transaksi Digital yang Aman", 570, 460, 36, 540, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "kelas XII", 570, 650, 26, { align: "center", weight: 700, color: C.ink2 });
      const n = clamp(Math.floor((l - 0.8) / 0.7) + 1, 0, 3);
      [["▦", "QRIS", "satu kode untuk banyak aplikasi"], ["👛", "dompet digital", "aplikasi penyimpan saldo"], ["🔢", "PIN", "kunci saldomu, hanya kamu yang tahu"]].forEach(([ic, t, e], i) => {
        if (i >= n) return; const y = 300 + i * 130; card(ctx, 960, y, 640, 112, { fill: "#fff", stroke: "#CFDCD5", lw: 3, r: 16 });
        text(ctx, ic, 1010, y + 72, 42, { align: "center", weight: 900, color: C.kiko }); text(ctx, t, 1060, y + 48, 30, { weight: 900, color: C.kiko }); text(ctx, e, 1060, y + 86, 24, { weight: 700, color: C.ink2, fit: 520 });
      });
      kiko(ctx, 1680, 760, 90, 0, { wave: l });
    },
    k26_pindai(ctx, b, l) {
      const c = cues(b, 3, [0.3, 0.5, 0.75]), k = stepOf(c, l);
      card(ctx, 120, 150, 1680, 670); heading(ctx, "LANGKAH 1: PINDAI, LALU BACA LAYARNYA", 200);
      Bx.stand(ctx, 230, 300, "Kedai Sari");
      text(ctx, "meja kasir Kedai Sari", 360, 680, 22, { align: "center", weight: 800, color: C.ink2 });
      card(ctx, 230, 700, 260, 80, { fill: "#FFFDF5", stroke: "#D9CFA8", lw: 2, r: 10 }); text(ctx, "es teh + roti", 360, 732, 20, { align: "center", weight: 800 }); text(ctx, "total Rp15.000", 360, 764, 22, { align: "center", weight: 900 });
      const scr = k === 0 ? "home" : k === 1 ? "pindai" : "konfirmasi";
      if (k === 1) { arrow(ctx, 520, 470, 740, 470, "#7FD3F0", 6); }
      const P = wallet(ctx, 960, 515, 0.88, scr, { app: "Dompet Digital", scan: k === 1 ? (l - c[1]) / 1.4 : null, tapAt: k === 0 ? null : k === 1 && l - c[0] < 1.2 ? null : null });
      if (k >= 1 && l - c[0] < 0.9 && scr !== "home") { /* transisi */ }
      if (k >= 2) {
        const u = ease(clamp((l - c[2]) / 0.6, 0, 1)); ctx.save(); ctx.globalAlpha = u;
        arrow(ctx, 1260, 330, 1140, 330, C.accent, 5); card(ctx, 1280, 280, 440, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, "nama merchant", 1300, 320, 22, { weight: 900, color: C.accentDark }); text(ctx, "Kedai Sari: cocok ✓", 1300, 365, 28, { weight: 900, color: C.good });
        arrow(ctx, 1260, 470, 1140, 470, C.accent, 5); card(ctx, 1280, 420, 440, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, "nominal", 1300, 460, 22, { weight: 900, color: C.accentDark }); text(ctx, "Rp15.000: cocok ✓", 1300, 505, 28, { weight: 900, color: C.good });
        ctx.restore();
      }
    },
    k26_jalan(ctx, b, l) {
      const c = cues(b, 3, [0.15, 0.45, 0.75]), k = stepOf(c, l);
      card(ctx, 120, 150, 1680, 670); heading(ctx, b.step === 2 ? "LANGKAH 3: KE BANK PENJUAL, LALU NOTIFIKASI" : "LANGKAH 2: PIN, LALU KE SERVER PENYEDIA DOMPET", 200);
      let st;
      if (b.step === 1) st = { pin: k >= 1 ? clamp((l - c[0]) / 1.6, 0, 1) : 0, toServer: k >= 2 ? clamp((l - c[1]) / 1.2, 0, 1) : 0, check: k >= 3 ? clamp(Math.floor((l - c[2]) / 0.8) + 1, 0, 2) : 0, toBank: 0, credit: false, notif: 0 };
      else st = { pin: 1, toServer: 1, check: 2, toBank: k >= 1 ? clamp((l - c[0]) / 1.2, 0, 1) : 0, credit: k >= 2, notif: k >= 3 ? clamp((l - c[2]) / 0.8, 0, 1) : 0 };
      journey(ctx, st, l, { y: 450 });
      const L = b.step === 1 ? ["Dito memasukkan PIN sambil menutupi layar.", "Permintaan bayar dikirim ke server penyedia dompet.", "Server memeriksa PIN dan saldo Dito."] : ["Server meneruskan pembayaran ke bank Kedai Sari.", "Bank menambah saldo Kedai Sari.", "Notifikasi resmi masuk ke HP Dito dan HP kasir."];
      const now = Math.max(0, k - 1); card(ctx, 260, 742, 1400, 62, { fill: k ? "#FFF3D6" : C.bg2, r: 14 }); text(ctx, k ? (k) + ". " + L[now] : "…", 960, 783, 28, { align: "center", weight: 900, fit: 1360 });
      if (b.step === 2 && l > A(b) * 0.88) chip(ctx, "⏱ semuanya dalam beberapa detik", 960, 245, { size: 22, fill: "#fff", stroke: C.kiko, color: C.kiko });
    },
    k26_tanya(ctx, b, l) {
      const v = b.v; card(ctx, 120, 150, 1680, 670);
      const H2 = { 1: "VARIASI 1 · NAMA MERCHANT BERBEDA", 2: "VARIASI 2 · PIN DI ANTREAN RAMAI", 3: "VARIASI 3 · GAMBAR BUKTI BAYAR", 4: "VARIASI 4 · TAUTAN DARI PESAN" };
      heading(ctx, H2[v]);
      if (v === 1) {
        Bx.stand(ctx, 300, 290, "Kedai Sari"); text(ctx, "meja kasir yang sama", 430, 670, 22, { align: "center", weight: 800, color: C.ink2 });
        wallet(ctx, 960, 518, 0.86, "konfirmasi", { nama: "? ? ?", nominal: "Rp15.000" });
        card(ctx, 1240, 300, 460, 240, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 18 }); para(ctx, "Nominalnya benar, tetapi nama merchant-nya bukan Kedai Sari.", 1470, 370, 28, 410, { align: "center", weight: 900, color: C.accentDark, lh: 1.25 });
      } else if (v === 2) {
        kid(ctx, 620, 470, 130, {}); text(ctx, "Dito", 620, 640, 24, { align: "center", weight: 900 });
        kid(ctx, 360, 450, 120, { hair: "long" }); kid(ctx, 200, 470, 115, {}); text(ctx, "antrean di belakang", 290, 640, 22, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, "👀", 420, 330, 44, { align: "center" }); arrow(ctx, 450, 330, 640, 400, "#B7C4CC", 4);
        wallet(ctx, 1060, 518, 0.86, "pin", { n: 2 });
        card(ctx, 1320, 330, 400, 200, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 18 }); para(ctx, "Dito mengetik PIN tanpa menutupi layar.", 1520, 400, 28, 360, { align: "center", weight: 900, color: C.accentDark, lh: 1.25 });
      } else if (v === 3) {
        wallet(ctx, 520, 518, 0.86, "berhasil", { label: "gambar di HP pembeli" }); text(ctx, "HP pembeli", 520, 806, 24, { align: "center", weight: 900 });
        wallet(ctx, 1240, 518, 0.86, "riwayat", { title: "Dompet Digital · Merchant", head: "Kedai Sari", sub: "masuk hari ini", rows: [["11.47", "dari Sinta", "+Rp12.000", "berhasil"]] }); text(ctx, "HP kasir", 1240, 806, 24, { align: "center", weight: 900 });
        text(ctx, "?", 880, 480, 120, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "tidak ada notifikasi baru", 1240, 240, 22, { align: "center", weight: 800, color: C.bad });
      } else {
        card(ctx, 220, 260, 700, 330, { fill: "#EAF2EE", r: 18 }); text(ctx, "Pesan · +62 8xx-xxxx (tak dikenal)", 250, 300, 22, { weight: 900, color: C.ink2 });
        card(ctx, 250, 320, 640, 240, { fill: "#fff", stroke: C.bad, lw: 3, r: 16 }); para(ctx, "Tagihan Kedai Sari belum lunas. Bayar sekarang lewat tautan ini:", 270, 362, 26, 600, { weight: 800, lh: 1.25 });
        text(ctx, "bayar-tagihan.example/ks", 270, 500, 26, { weight: 800, color: "#2A6FB0" }); ctx.strokeStyle = "#2A6FB0"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(270, 506); ctx.lineTo(590, 506); ctx.stroke();
        wallet(ctx, 1240, 518, 0.86, "home", { app: "Dompet Digital" }); text(ctx, "aplikasi resmi di HP Dito", 1240, 806, 22, { align: "center", weight: 900, color: C.kiko });
        arrow(ctx, 960, 470, 1060, 470, C.kiko, 5);
      }
      if (!b.pilih) { const Q = { 1: "Apa yang sebaiknya Dito lakukan?", 2: "Apa yang bisa terjadi pada PIN-nya?", 3: "Apakah uangnya sudah pasti masuk?", 4: "Apa yang tercatat di aplikasi resmi?" }; text(ctx, Q[v], v === 3 || v === 4 ? 560 : 960, 785, 30, { align: "center", weight: 900, color: C.accentDark }); }
    },
    k26_tebak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670);
      ctx.save(); ctx.beginPath(); ctx.rect(120, 150, 1680, 556); ctx.clip(); ctx.translate(960, 150); ctx.scale(0.82, 0.82); ctx.translate(-960, -150); K.SCENES.k26_tanya(ctx, b, 5); ctx.restore();
      const n = b.pilih.length, w = 400, g = 24, x0 = 960 - (n * w + (n - 1) * g) / 2;
      b.pilih.forEach((s, i) => { card(ctx, x0 + i * (w + g), 718, w, 70, { fill: "#fff", stroke: C.kiko, lw: 3, r: 35 }); text(ctx, "ABC"[i] + ". " + s, x0 + i * (w + g) + w / 2, 763, 27, { align: "center", weight: 900, color: C.kikoDark, fit: w - 30 }); });
      thinking(ctx, 1730, 215, l, b.dur);
    },
    k26_stiker(ctx, b, l) {
      const c = cues(b, 3, [0.1, 0.4, 0.65]), k = stepOf(c, l);
      card(ctx, 120, 150, 1680, 670); heading(ctx, "NAMA MERCHANT TIDAK COCOK: BATALKAN", 200);
      // dudukan: stiker terkelupas saat kasir memeriksa
      const peel = k >= 3 ? ease(clamp((l - c[2]) / 1.2, 0, 1)) : 0;
      Bx.stand(ctx, 230, 290, "Kedai Sari");
      ctx.save(); ctx.translate(370 + peel * 260, 455 - peel * 40); ctx.rotate(-0.06 + peel * 0.25); ctx.fillStyle = "#FFFDF5"; ctx.fillRect(-100, -100, 200, 200); ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.strokeRect(-100, -100, 200, 200); ctx.setLineDash([]); Bx.qr(ctx, -85, -85, 170, 31, { col: "#3A2A1A" }); ctx.restore();
      if (peel >= 1) { chip(ctx, "stiker kode lain", 630, 300, { size: 22, fill: C.badBg, stroke: C.bad, color: C.bad }); chip(ctx, "kode asli Kedai Sari", 360, 680, { size: 22 }); }
      const P = wallet(ctx, 1060, 518, 0.86, k >= 2 && l - c[1] > 0.9 ? "home" : "konfirmasi", { nama: "Pulsa Murah 88", nominal: "Rp15.000", warn: true, tap: k >= 2 ? "batal" : null, tapAt: k >= 2 ? { k: "batal", u: clamp((l - c[1]) / 0.9, 0, 1) } : null });
      if (k >= 1 && (k < 2 || l - c[1] <= 0.9)) { card(ctx, 1330, 300, 400, 120, { fill: C.badBg, stroke: C.bad, lw: 3, r: 16 }); text(ctx, "bukan Kedai Sari!", 1530, 372, 30, { align: "center", weight: 900, color: C.bad }); }
      if (k >= 2 && l - c[1] > 0.9) { card(ctx, 1330, 300, 400, 100, { fill: C.goodBg, stroke: C.good, lw: 3, r: 16 }); text(ctx, "dibatalkan: uang aman", 1530, 362, 28, { align: "center", weight: 900, color: C.good }); }
      if (k >= 2) { kid(ctx, 1530, 560, 90, { hair: "long" }); card(ctx, 1330, 670, 400, 90, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 16 }); text(ctx, k >= 3 ? "“Nanti kami lepas, ya.”" : "“Kak, namanya beda.”", 1530, 725, 24, { align: "center", weight: 800, fit: 370 }); }
    },
    k26_pin(ctx, b, l) {
      const c = cues(b, 2, [0.1, 0.55]), k = stepOf(c, l);
      card(ctx, 120, 150, 1680, 670); heading(ctx, "PIN: DITUTUPI ATAU TIDAK?", 200);
      const digits = "4", seq = ["2", "7", "0", "5", "9", "1"];
      [[0, "TANPA DITUTUPI", false], [1, "DENGAN TANGAN MENUTUPI", true]].forEach(([i, t, cov]) => {
        const x0 = 160 + i * 820, on = k >= i + 1; ctx.save(); if (!on) ctx.globalAlpha = 0.25;
        card(ctx, x0, 240, 780, 560, { fill: cov ? C.goodBg : C.badBg, r: 20 }); text(ctx, t, x0 + 390, 285, 28, { align: "center", weight: 900, color: cov ? C.good : C.bad });
        const tt = on ? l - c[i] : 0, idx = clamp(Math.floor(tt / 0.6), 0, 6), press = idx < 6 && on ? seq[idx] : null;
        wallet(ctx, x0 + 230, 530, 0.78, "pin", { n: on ? idx : 0, press: cov ? null : press, cover: cov && on });
        text(ctx, "👀", x0 + 560, 380, 54, { align: "center" }); text(ctx, "orang di belakang", x0 + 560, 430, 20, { align: "center", weight: 800, color: C.ink2 });
        card(ctx, x0 + 430, 460, 300, 120, { fill: "#fff", stroke: cov ? C.good : C.bad, lw: 3, r: 14 }); text(ctx, "yang terlihat:", x0 + 580, 495, 18, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, cov ? "punggung tangan" : seq.slice(0, on ? idx : 0).join(" ") || "…", x0 + 580, 552, cov ? 26 : 38, { align: "center", weight: 900, color: cov ? C.good : C.bad, fit: 280 });
        text(ctx, cov ? "✓ PIN tetap rahasia" : "✕ PIN bisa diingat orang lain", x0 + 580, 640, 24, { align: "center", weight: 900, color: cov ? C.good : C.bad, fit: 330 });
        ctx.restore();
      });
    },
    k26_bukti(ctx, b, l) {
      const c = cues(b, 3, [0.1, 0.4, 0.7]), k = stepOf(c, l);
      card(ctx, 120, 150, 1680, 670); heading(ctx, "KASIR MEMERIKSA APLIKASINYA SENDIRI", 200);
      wallet(ctx, 420, 518, 0.86, "berhasil", { label: "gambar di HP pembeli" }); text(ctx, "HP pembeli", 420, 806, 24, { align: "center", weight: 900 });
      if (k >= 1) chip(ctx, "hanya gambar", 420, 250, { size: 22, fill: "#FFF3D6", stroke: C.accent, color: C.accentDark });
      const rows = [["11.47", "dari Sinta", "+Rp12.000", "berhasil"], ["11.52", "dari Rani", "+Rp8.000", "berhasil"]];
      wallet(ctx, 1100, 518, 0.86, "riwayat", { title: "Dompet Digital · Merchant", head: "Kedai Sari", sub: "masuk hari ini", rows, empty: k >= 2 ? "tidak ada Rp15.000 dari pembeli ini" : null }); text(ctx, "HP kasir", 1100, 806, 24, { align: "center", weight: 900 });
      if (k >= 1) { kid(ctx, 1540, 470, 100, { hair: "long" }); text(ctx, "kasir", 1540, 600, 22, { align: "center", weight: 900 }); }
      if (k >= 3) { card(ctx, 1360, 630, 380, 120, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 16 }); para(ctx, "“Coba periksa aplikasimu lagi, ya.”", 1550, 680, 24, 340, { align: "center", weight: 800, lh: 1.2 }); }
    },
    k26_tautan(ctx, b, l) {
      const c = cues(b, 3, [0.05, 0.35, 0.65]), k = stepOf(c, l);
      card(ctx, 120, 150, 1680, 670); heading(ctx, "PERIKSA LEWAT APLIKASI RESMI, BUKAN TAUTAN", 200);
      card(ctx, 180, 260, 620, 300, { fill: "#EAF2EE", r: 18 }); text(ctx, "Pesan · nomor tak dikenal", 210, 300, 22, { weight: 900, color: C.ink2 });
      card(ctx, 210, 320, 560, 210, { fill: "#fff", stroke: C.bad, lw: 3, r: 16 }); para(ctx, "Tagihan Kedai Sari belum lunas. Bayar lewat tautan ini:", 230, 360, 24, 520, { weight: 800, lh: 1.25 });
      text(ctx, "bayar-tagihan.example/ks", 230, 480, 24, { weight: 800, color: "#2A6FB0" });
      if (k >= 1) { ctx.strokeStyle = C.bad; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(220, 470); ctx.lineTo(560, 470); ctx.stroke(); chip(ctx, "✕ tidak dibuka", 490, 600, { size: 26, fill: C.badBg, stroke: C.bad, color: C.bad }); }
      const scr = k >= 3 ? "riwayat" : "home";
      wallet(ctx, 1080, 518, 0.86, scr, { app: "Dompet Digital", head: "Riwayat transaksi", rows: [["Kemarin 12.05", "Kedai Sari", "−Rp15.000", "berhasil"], ["Kemarin 07.10", "Koperasi Sekolah", "−Rp12.000", "berhasil"]], hl: k >= 3 ? 0 : null, tapAt: k === 2 ? { k: "app", u: clamp((l - c[1]) / 0.9, 0, 1) } : null });
      text(ctx, "aplikasi dibuka dari layar utama", 1080, 806, 22, { align: "center", weight: 900, color: C.kiko });
      if (k >= 3) { card(ctx, 1330, 330, 400, 150, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 }); para(ctx, "Kedai Sari Rp15.000 sudah tercatat berhasil", 1530, 390, 28, 360, { align: "center", weight: 900, color: C.good, lh: 1.2 }); }
    },
    k26_banding(ctx, b, l) {
      const v = b.v, a = A(b);
      card(ctx, 120, 150, 1680, 670);
      const item = (x, y, w, ic, s, ok, show) => { if (!show) return; card(ctx, x, y, w, 100, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? C.good : C.bad, lw: 4, r: 18 }); text(ctx, ic, x + 50, y + 66, 40, { align: "center", weight: 900, color: ok ? C.good : C.bad }); text(ctx, s, x + 100, y + 62, 30, { weight: 900, color: ok ? C.good : C.bad, fit: w - 130 }); };
      if (v === 1) {
        heading(ctx, "DUA PILIHAN, DUA AKHIR");
        item(220, 260, 1480, "✕", "Langsung bayar → uang masuk ke pemilik stiker, bukan Kedai Sari.", false, l > lead(b));
        item(220, 390, 1480, "✓", "Baca nama merchant → berbeda? Batalkan, lalu tanyakan kasir.", true, l > at(b, "Jadi, baca"));
        if (l > at(b, "Kalau namanya")) banner(ctx, "nama merchant = ke mana uangmu pergi", 560, { w: 1000 });
      } else if (v === 2) {
        heading(ctx, "MENJAGA PIN");
        item(220, 260, 1480, "🖐", "Tutupi layar saat mengetik PIN.", true, l > lead(b));
        item(220, 390, 1480, "🎂", "Jangan memakai tanggal lahir sebagai PIN.", true, l > at(b, "jangan memakai"));
        item(220, 520, 1480, "🔁", "PIN pernah terlihat orang lain? Segera ganti PIN di aplikasi.", true, l > at(b, "Kalau PIN"));
      } else if (v === 3) {
        heading(ctx, "BUKTI YANG BISA DIPERCAYA");
        item(220, 260, 1480, "✕", "Gambar bukti bayar: bisa keliru atau disunting.", false, l > lead(b));
        item(220, 390, 1480, "✓", "Notifikasi resmi di aplikasi sendiri.", true, l > at(b, "Yang bisa"));
        item(220, 520, 1480, "✓", "Dito memeriksa riwayat di aplikasinya, bukan hanya layar berhasil.", true, l > at(b, "Dito juga"));
      } else {
        heading(ctx, "PESAN BERISI TAUTAN PEMBAYARAN");
        item(220, 260, 1480, "✕", "Jangan membuka tautan pembayaran dari pesan tak dikenal.", false, l > at(b, "Jangan membuka"));
        item(220, 390, 1480, "✓", "Periksa tagihan lewat aplikasi resmi atau langsung ke penjual.", true, l > at(b, "Periksa tagihan"));
        item(220, 520, 1480, "✓", "Blokir dan laporkan nomor itu.", true, l > at(b, "lalu blokir"));
      }
      if (l > a * 0.9 && v !== 1) banner(ctx, v === 2 ? "PIN = kunci saldo" : v === 3 ? "percayai notifikasi resmi, bukan gambar" : "tautan dari pesan tak dikenal: tidak perlu dibuka", 680, { w: 1100 });
    },
    k26_latihan(ctx, b, l) {
      const a = A(b), t = [a * 0.1, a * 0.32];
      const hp = { custom: (ctx, x, y, w) => {
        text(ctx, "Giliran 1 dari 5", x, y + 12, 11, { weight: 800, color: C.ink2 }); y += 20;
        para(ctx, "Kamu belanja di Kedai Sari, totalnya Rp15.000. Kamu sudah memindai kodenya.", x, y + 14, 12.5, w, { weight: 700, lh: 1.3 }); y += 44;
        const hx = x + 40, hw = w - 80; ctx.fillStyle = "#fff"; rr(ctx, hx, y, hw, 150, 14); ctx.fill(); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = TEAL; rr(ctx, hx, y, hw, 28, 14); ctx.fill(); ctx.fillRect(hx, y + 14, hw, 14); text(ctx, "Dompet Digital", hx + hw / 2, y + 19, 12, { align: "center", weight: 900, color: "#fff" });
        text(ctx, "bayar ke", hx + hw / 2, y + 48, 11, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "Kedai Sari", hx + hw / 2, y + 72, 18, { align: "center", weight: 900 });
        text(ctx, "nominal", hx + hw / 2, y + 98, 11, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "Rp15.000", hx + hw / 2, y + 128, 22, { align: "center", weight: 900 });
        return y + 160; } };
      K.halaman(ctx, 250, 190, 1.15, { url: "belajar-informatika.vercel.app/f125", judul: "Simulasi kasir, detektif pesan, penyusun 2FA",
        rows: [{ tabs: ["1 Simulasi kasir QRIS", "2 Detektif pesan", "3 Penyusun 2FA"], on: -1 },
          { task: "Lima transaksi. Baca nama dan nominal di layar, lalu putuskan: bayar atau batalkan." },
          hp, { buttons: ["Bayar", "Batalkan"], cols: 2, on: -1 }],
        taps: [[0, 0, t[0]], [3, 0, t[1]]] }, l, { h: 560 });
      const n = l < t[0] ? 0 : l < t[1] ? 1 : l < a * 0.55 ? 2 : 3;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN F12.5", ["Klik 1 Simulasi kasir QRIS.", "Baca nama dan nominal, lalu pilih Bayar atau Batalkan.", "Selesaikan kelima transaksi."], n);
      card(ctx, 840, 540, 880, 230, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 585, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Saat jajan, baca nama merchant dan nominal sebelum memasukkan PIN.", 870, 630, 28, 820, { weight: 700, lh: 1.3 });
    },

    // ---------- Short (area 40–1040 × 20–810) ----------
    k26s_pindai(ctx, b, l) {
      const c = cues(b, 3, [0.1, 0.35, 0.6]), k = stepOf(c, l);
      Bx.stand(ctx, 70, 120, "Kedai Sari");
      wallet(ctx, 560, 410, 1.28, k >= 2 ? "konfirmasi" : "pindai", { scan: k === 1 ? (l - c[1]) / 1.4 : null });
      if (k >= 2) { card(ctx, 760, 150, 270, 250, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); para(ctx, "nama merchant dan nominal: cocok?", 895, 230, 32, 240, { align: "center", weight: 900, color: C.accentDark, lh: 1.2 }); }
    },
    k26s_jalan(ctx, b, l) {
      const c = cues(b, 3, [0.1, 0.4, 0.7]), k = stepOf(c, l);
      const st = { pin: 1, toServer: 1, check: 2, toBank: k >= 2 ? clamp((l - c[1]) / 1.2, 0, 1) : 0, credit: k >= 2 && l - c[1] > 1.2, notif: k >= 3 ? clamp((l - c[2]) / 0.8, 0, 1) : 0 };
      // dua baris: HP Dito → server → bank (atas), notifikasi kedua HP (bawah)
      J.server(ctx, 300, 170, 110, 160, { label: false }); text(ctx, "server penyedia", 300, 290, 30, { align: "center", weight: 900 });
      bank(ctx, 770, 170, 150); text(ctx, "bank Kedai Sari", 770, 290, 30, { align: "center", weight: 900 });
      ctx.strokeStyle = "#CFDCD5"; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(380, 170); ctx.lineTo(670, 170); ctx.stroke(); ctx.setLineDash([]);
      if (st.toBank > 0 && st.toBank < 1) { const x = lerp(400, 660, ease(st.toBank)); card(ctx, x - 80, 140, 160, 56, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 28 }); text(ctx, "Rp15.000", x, 178, 26, { align: "center", weight: 900, color: C.accentDark }); }
      if (st.credit) chip(ctx, "+Rp15.000", 770, 60, { size: 28 });
      wallet(ctx, 280, 590, 0.68, "berhasil", { notif: st.notif > 0 ? { title: "Pembayaran berhasil", body: "Rp15.000 ke Kedai Sari", u: st.notif } : null }); text(ctx, "HP Dito", 480, 600, 30, { weight: 900 });
      wallet(ctx, 800, 590, 0.68, "riwayat", { title: "Merchant", head: "Kedai Sari", rows: st.notif > 0.5 ? [["12.05", "dari Dito", "+Rp15.000", "berhasil"]] : [], hl: 0, notif: st.notif > 0 ? { title: "Uang masuk Rp15.000", body: "Pembayaran QRIS dari Dito", u: st.notif } : null }); text(ctx, "HP kasir", 600, 600, 30, { weight: 900 });
    },
    k26s_stiker(ctx, b, l) {
      const c = cues(b, 3, [0.1, 0.45, 0.75]), k = stepOf(c, l);
      wallet(ctx, 300, 400, 1.3, k >= 2 && l - c[1] > 0.9 ? "home" : "konfirmasi", { nama: "Pulsa Murah 88", warn: true, tap: k >= 2 ? "batal" : null, tapAt: k >= 2 ? { k: "batal", u: clamp((l - c[1]) / 0.9, 0, 1) } : null });
      card(ctx, 560, 120, 460, 170, { fill: C.badBg, stroke: C.bad, lw: 4, r: 20 }); para(ctx, "Di Kedai Sari, tetapi namanya Pulsa Murah 88", 790, 190, 32, 420, { align: "center", weight: 900, color: C.bad, lh: 1.2 });
      if (k >= 2) { card(ctx, 560, 330, 460, 150, { fill: C.goodBg, stroke: C.good, lw: 4, r: 20 }); para(ctx, "Tekan Batal, lalu tanyakan kasir", 790, 395, 34, 420, { align: "center", weight: 900, color: C.good, lh: 1.2 }); }
      if (k >= 3) { Bx.stand(ctx, 660, 500, "Kedai Sari", { palsu: true }); }
    },
    k26s_tautan(ctx, b, l) {
      const c = cues(b, 3, [0.05, 0.35, 0.6]), k = stepOf(c, l);
      card(ctx, 60, 40, 960, 250, { fill: "#EAF2EE", r: 20 }); text(ctx, "Pesan · nomor tak dikenal", 90, 88, 28, { weight: 900, color: C.ink2 });
      para(ctx, "Tagihan Kedai Sari belum lunas. Bayar lewat tautan ini:", 90, 140, 32, 900, { weight: 800, lh: 1.2 }); text(ctx, "bayar-tagihan.example/ks", 90, 258, 32, { weight: 800, color: "#2A6FB0" });
      if (k >= 2) { ctx.strokeStyle = C.bad; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(80, 248); ctx.lineTo(520, 248); ctx.stroke(); chip(ctx, "✕ jangan dibuka", 800, 250, { size: 30, fill: C.badBg, stroke: C.bad, color: C.bad }); }
      wallet(ctx, 300, 560, 0.85, k >= 3 ? "riwayat" : "home", { app: "Dompet Digital", rows: [["Kemarin 12.05", "Kedai Sari", "−Rp15.000", "berhasil"]], hl: 0 });
      if (k >= 3) { card(ctx, 540, 420, 480, 220, { fill: C.goodBg, stroke: C.good, lw: 4, r: 20 }); para(ctx, "Cek riwayat di aplikasi resmi: sudah lunas", 780, 490, 34, 440, { align: "center", weight: 900, color: C.good, lh: 1.2 }); }
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
