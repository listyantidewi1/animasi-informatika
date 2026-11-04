/* T32 Kenapa aplikasi senter minta izin kontak? — adegan khusus. Nama aplikasi, kontak, dan data rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;

  // HP digambar sendiri: badan gelap, layar di dalamnya; mengembalikan kotak layar {x, y, w, h}
  function phone(ctx, x, y, w, h, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#05071A", stroke: opt.stroke || C.line, lw: 6, r: w * 0.13, glow: opt.glow });
    const s = { x: x + w * 0.05, y: y + w * 0.12, w: w * 0.9, h: h - w * 0.2 };
    card(ctx, s.x, s.y, s.w, s.h, { fill: opt.screen || C.bg2, r: w * 0.08 });
    ctx.fillStyle = "#2A3170"; rr(ctx, x + w / 2 - w * 0.12, y + w * 0.045, w * 0.24, w * 0.035, w * 0.02); ctx.fill();
    return s;
  }
  // ikon izin: kamera, lokasi, mikrofon, kontak, lampu
  function ikon(ctx, kind, cx, cy, s, col) {
    ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = s * 0.09; ctx.lineCap = "round";
    if (kind === "kamera") {
      rr(ctx, -s * 0.42, -s * 0.24, s * 0.84, s * 0.56, s * 0.1); ctx.fill(); rr(ctx, -s * 0.16, -s * 0.36, s * 0.32, s * 0.16, s * 0.05); ctx.fill();
      ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(0, s * 0.04, s * 0.17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, s * 0.04, s * 0.09, 0, Math.PI * 2); ctx.fill();
    } else if (kind === "lokasi") {
      ctx.beginPath(); ctx.arc(0, -s * 0.12, s * 0.27, Math.PI * 0.85, Math.PI * 0.15); ctx.lineTo(0, s * 0.42); ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(0, -s * 0.12, s * 0.11, 0, Math.PI * 2); ctx.fill();
    } else if (kind === "mikrofon") {
      rr(ctx, -s * 0.13, -s * 0.42, s * 0.26, s * 0.5, s * 0.13); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -s * 0.06, s * 0.24, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, s * 0.18); ctx.lineTo(0, s * 0.36); ctx.moveTo(-s * 0.15, s * 0.38); ctx.lineTo(s * 0.15, s * 0.38); ctx.stroke();
    } else if (kind === "kontak") {
      ctx.beginPath(); ctx.arc(0, -s * 0.16, s * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, s * 0.3, s * 0.34, s * 0.22, 0, Math.PI, 0); ctx.fill();
    } else if (kind === "lampu") {
      ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.42); ctx.lineTo(s * 0.22, -s * 0.42); ctx.lineTo(s * 0.04, -s * 0.04); ctx.lineTo(s * 0.24, -s * 0.04);
      ctx.lineTo(-s * 0.14, s * 0.44); ctx.lineTo(0, s * 0.06); ctx.lineTo(-s * 0.22, s * 0.06); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  // layar aplikasi senter: tombol bulat besar yang memancarkan cahaya
  function senterApp(ctx, s, t, on) {
    text(ctx, "Senter Terang", s.x + s.w / 2, s.y + 60, Math.min(40, s.w * 0.11), { align: "center", weight: 800, color: C.ink, fit: s.w - 30 });
    const cx = s.x + s.w / 2, cy = s.y + s.h * 0.5, r = s.w * 0.26;
    if (on) { const g = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 2.2); g.addColorStop(0, "rgba(255,210,63,0.55)"); g.addColorStop(1, "rgba(255,210,63,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = on ? C.kuning : C.panel2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ikon(ctx, "lampu", cx, cy, r * 1.1, on ? C.bg : C.ink2);
  }
  // kotak dialog izin di atas layar; tekan = 0..1 (tombol Tolak tertekan)
  function dialog(ctx, s, u, kind, label, tekan) {
    if (u <= 0) return;
    ctx.save(); ctx.fillStyle = `rgba(5,7,26,${0.6 * clamp(u, 0, 1)})`; rr(ctx, s.x, s.y, s.w, s.h, 20); ctx.fill();
    const w = s.w - 30, h = Math.min(330, s.h * 0.62), x = s.x + 15, y = s.y + s.h - h - 20;
    ctx.translate(0, (1 - u) * 80); ctx.globalAlpha = clamp(u, 0, 1);
    card(ctx, x, y, w, h, { fill: "#F2F4FF", r: 26 });
    ikon(ctx, kind, x + w / 2, y + 52, 58, C.biru);
    const fs = Math.min(30, w * 0.085), ls = T.helpers.wrap(ctx, label, fs, 800, w - 40);
    ls.forEach((ln, i) => text(ctx, ln, x + w / 2, y + 120 + i * fs * 1.25, fs, { align: "center", weight: 800, color: C.bg }));
    const by = y + h - 82, bw = (w - 45) / 2;
    card(ctx, x + 15, by, bw, 64, { fill: tekan > 0 ? C.bad : "#DDE2FF", r: 32 });
    text(ctx, "Tolak", x + 15 + bw / 2, by + 43, fs, { align: "center", weight: 900, color: tekan > 0 ? C.ink : C.bg });
    card(ctx, x + 30 + bw, by, bw, 64, { fill: C.biru, r: 32 });
    text(ctx, "Izinkan", x + 30 + bw * 1.5, by + 43, fs, { align: "center", weight: 900, color: C.ink });
    ctx.restore();
    return { tolakX: x + 15 + bw / 2, tolakY: by + 32 };
  }
  const KONTAK = ["Ayah", "Bu Rina", "Dimas", "Kak Sela", "Om Jaka"];

  Object.assign(T.SCENES, {
    // kait: aplikasi senter menyala, lalu muncul permintaan izin kontak; Bip curiga
    t32_senter(ctx, b, l, t, TL, A) {
      const h = Math.min(640, A.h - 10), w = h * 0.52, x = 160, y = A.y + (A.h - h) / 2;
      const s = phone(ctx, x, y, w, h, { glow: "rgba(255,210,63,0.25)" });
      senterApp(ctx, s, t, l > 0.3);
      const u = pop(b, l, "lalu"), q = pop(b, l, "kontakmu");
      dialog(ctx, s, u, "kontak", "Izinkan Senter Terang membaca kontak?", 0);
      bip(ctx, 690, A.y + A.h * 0.55, Math.min(260, A.h * 0.42), { mood: u > 0 ? "think" : "happy", t, look: [-0.8, 0.2] });
      if (q > 0) { ctx.save(); ctx.translate(760, A.y + A.h * 0.2); ctx.scale(q, q); ctx.rotate(0.1);
        text(ctx, "?!", 0, 0, 130, { align: "center", weight: 900, color: C.pink, shadow: true }); ctx.restore(); }
    },
    // tiap izin = satu pintu: empat ikon di sekitar HP, pintunya terbuka saat disebut
    t32_pintu(ctx, b, l, t, TL, A) {
      const cx = 480, cy = A.y + A.h * 0.5, h = Math.min(500, A.h * 0.52), w = h * 0.52;
      const s = phone(ctx, cx - w / 2, cy - h / 2, w, h);
      text(ctx, "Datamu", cx, s.y + s.h / 2 + 14, 40, { align: "center", weight: 900, color: C.kuning });
      const items = [["kamera", "Kamera", -1, -1, C.biru], ["lokasi", "Lokasi", 1, -1, C.pink], ["mikrofon", "Mikrofon", -1, 1, C.tosca], ["kontak", "Kontak", 1, 1, C.kuning]];
      items.forEach(([k, lab, sx, sy, col], i) => {
        const u = pop(b, l, k === "kontak" ? "daftar kontak" : k); if (u <= 0) return;
        const ix = cx + sx * 300, iy = cy + sy * (h * 0.5 + 10);
        // garis aliran data dari HP ke pintu
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.setLineDash([14, 14]); ctx.lineDashOffset = -l * 60;
        ctx.beginPath(); ctx.moveTo(cx + sx * w * 0.3, cy + sy * h * 0.3); ctx.lineTo(ix - sx * 70, iy - sy * 50); ctx.stroke(); ctx.restore();
        // pintu: kusen dan daun pintu yang mengayun terbuka
        ctx.save(); ctx.translate(ix, iy); ctx.scale(u, u);
        card(ctx, -85, -110, 170, 220, { fill: C.panel, stroke: col, lw: 6, r: 18 });
        ikon(ctx, k, 0, -10, 90, col);
        const open = ease((cue(b, l, k === "kontak" ? "daftar kontak" : k) - 0.2) / 0.5);
        ctx.fillStyle = C.panel2; ctx.beginPath(); ctx.moveTo(-80, -105); ctx.lineTo(-80 + 160 * (1 - open * 0.8), -105 + open * 18);
        ctx.lineTo(-80 + 160 * (1 - open * 0.8), 105 - open * 18); ctx.lineTo(-80, 105); ctx.closePath(); ctx.fill();
        ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(-80 + 160 * (1 - open * 0.8) - 20, 0, 9, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        if (u > 0.5) text(ctx, lab, ix, iy + 150, 36, { align: "center", weight: 800, color: C.ink });
      });
    },
    // izin berlebihan: daftar kontak terbang ke pengumpul data, lalu dicap DIJUAL
    t32_bocor(ctx, b, l, t, TL, A) {
      const h = Math.min(560, A.h * 0.6), w = h * 0.52, x = A.x, y = A.y + 40;
      const s = phone(ctx, x, y, w, h);
      text(ctx, "Kontak", s.x + 24, s.y + 52, 34, { weight: 900, color: C.ink });
      KONTAK.forEach((n, i) => {
        const yy = s.y + 80 + i * ((s.h - 100) / KONTAK.length);
        ctx.fillStyle = [C.pink, C.biru, C.tosca, C.kuning, C.pink][i]; ctx.beginPath(); ctx.arc(s.x + 40, yy + 30, 20, 0, Math.PI * 2); ctx.fill();
        text(ctx, n, s.x + 72, yy + 41, 30, { weight: 700, color: C.ink, fit: s.w - 90 });
      });
      // pengumpul data: tumpukan silinder di kanan
      const dx = 720, dy = A.y + 190, ud = pop(b, l, "mengumpulkan");
      if (ud > 0) {
        ctx.save(); ctx.translate(dx, dy); ctx.scale(ud, ud);
        for (let k = 2; k >= 0; k--) {
          const yy = k * 70;
          ctx.fillStyle = C.panel2; ctx.fillRect(-110, yy, 220, 60); ctx.beginPath(); ctx.ellipse(0, yy + 60, 110, 28, 0, 0, Math.PI); ctx.fill();
          ctx.fillStyle = C.line; ctx.beginPath(); ctx.ellipse(0, yy, 110, 28, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        text(ctx, "Pengumpul data", dx, dy + 290, 34, { align: "center", weight: 800, color: C.ink2 });
        // kartu kontak terbang dari HP ke pengumpul
        for (let i = 0; i < 8; i++) {
          const k = ((cue(b, l, "mengumpulkan") * 0.9 + i * 0.22) % 1.6) / 1.6;
          if (cue(b, l, "mengumpulkan") < i * 0.18) continue;
          const px = lerp(x + w + 10, dx - 60, k), py = lerp(y + 120 + (i % 4) * 90, dy + 80, k) - Math.sin(k * Math.PI) * 120;
          ctx.save(); ctx.globalAlpha = 1 - k * 0.6; card(ctx, px - 48, py - 26, 96, 52, { fill: C.panel, stroke: [C.pink, C.biru, C.tosca, C.kuning][i % 4], lw: 4, r: 12 });
          ctx.fillStyle = [C.pink, C.biru, C.tosca, C.kuning][i % 4]; ctx.beginPath(); ctx.arc(px - 22, py, 12, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = C.ink2; ctx.fillRect(px - 4, py - 6, 40, 10); ctx.restore();
        }
      }
      const uj = pop(b, l, "menjualnya");
      if (uj > 0) {
        ctx.save(); ctx.translate(dx - 10, dy + 410); ctx.rotate(-0.12); ctx.scale(uj, uj);
        card(ctx, -150, -55, 300, 110, { fill: C.bad, r: 20 });
        text(ctx, "DIJUAL!", 0, 26, 70, { align: "center", weight: 900, color: C.ink }); ctx.restore();
      }
      const bs = Math.min(200, A.bot - (y + h) - 20); if (bs > 80) bip(ctx, x + w / 2, A.bot - bs / 2 - 10, bs, { mood: uj > 0 ? "sad" : "wow", t });
    },
    // cocokkan izin dengan fungsi aplikasi: tabel tiga baris dengan centang/silang
    t32_cocok(ctx, b, l, t, TL, A) {
      text(ctx, "Aplikasi", A.x + 30, A.y + 60, 40, { weight: 800, color: C.ink2 });
      text(ctx, "Minta izin", A.x + 360, A.y + 60, 40, { weight: 800, color: C.ink2 });
      text(ctx, "Wajar?", A.x + 800, A.y + 60, 40, { weight: 800, color: C.ink2, align: "right" });
      const rows = [["Senter", "lampu", "Lampu kilat", true, "cocokkan"], ["Peta", "lokasi", "Lokasi", true, "peta"], ["Senter", "kontak", "Kontak", false, "senter tidak"]];
      const rh = Math.min(230, (A.h - 120) / 3 - 20);
      rows.forEach(([app, k, lab, ok, cu], i) => {
        const u = pop(b, l, cu); if (u <= 0) return;
        const y = A.y + 100 + i * (rh + 24);
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - u) * -80, 0);
        card(ctx, A.x, y, 820, rh, { fill: ok ? C.panel : C.badBg, stroke: ok ? C.line : C.bad, lw: 4 });
        // ikon aplikasi kecil
        card(ctx, A.x + 30, y + rh / 2 - 45, 90, 90, { fill: app === "Peta" ? C.tosca : C.kuning, r: 22 });
        ikon(ctx, app === "Peta" ? "lokasi" : "lampu", A.x + 75, y + rh / 2, 60, C.bg);
        text(ctx, app, A.x + 140, y + rh / 2 + 16, 44, { weight: 900, color: C.ink });
        ikon(ctx, k, A.x + 400, y + rh / 2, 70, ok ? C.biru : C.bad);
        text(ctx, lab, A.x + 450, y + rh / 2 + 14, 38, { weight: 800, color: C.ink, fit: 220 });
        const uc = pop(b, l, cu, 0.5);
        ctx.fillStyle = ok ? C.good : C.bad; ctx.beginPath(); ctx.arc(A.x + 750, y + rh / 2, 44 * clamp(uc, 0, 1.2), 0, Math.PI * 2); ctx.fill();
        if (ok) check(ctx, A.x + 750, y + rh / 2, 50, C.bg); else cross(ctx, A.x + 750, y + rh / 2, 50, C.bg);
        ctx.restore();
      });
    },
    // tekan Tolak, lalu cabut izin di Pengaturan
    t32_tolak(ctx, b, l, t, TL, A) {
      const h = Math.min(820, A.h - 20), w = h * 0.55, x = 480 - w / 2 - 120, y = A.y + (A.h - h) / 2;
      const s = phone(ctx, x, y, w, h);
      const toSet = cue(b, l, "izin yang") > 0;
      if (!toSet) {
        senterApp(ctx, s, t, true);
        const pressed = cue(b, l, "tolak") > 0.25;
        const d = dialog(ctx, s, pressed ? 1 - ease((cue(b, l, "tolak") - 0.5) / 0.3) : 1, "kontak", "Izinkan Senter Terang membaca kontak?", pressed ? 1 : 0);
        if (d) {   // jari mendekat ke tombol Tolak
          const k = ease(cue(b, l, "tolak") / 0.25 + 1), fx = lerp(x + w + 60, d.tolakX, k), fy = lerp(y + h + 40, d.tolakY, k);
          ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(fx, fy, 30, 0, Math.PI * 2); ctx.fill();
        }
      } else {
        const fs = Math.min(36, s.w * 0.08);
        text(ctx, "Pengaturan", s.x + 24, s.y + 60, fs * 1.2, { weight: 900, color: C.ink });
        text(ctx, "Aplikasi › Senter Terang › Izin", s.x + 24, s.y + 104, fs * 0.7, { weight: 700, color: C.ink2, fit: s.w - 40 });
        const off = ph(b, l, "dicabut", 0.35);
        [["kontak", "Kontak", true], ["lokasi", "Lokasi", true], ["kamera", "Kamera", false]].forEach(([k, lab, on], i) => {
          const yy = s.y + 150 + i * 120;
          card(ctx, s.x + 14, yy, s.w - 28, 100, { fill: C.panel, r: 20 });
          ikon(ctx, k, s.x + 60, yy + 50, 50, C.ink2);
          text(ctx, lab, s.x + 100, yy + 62, fs, { weight: 800, color: C.ink });
          const v = on ? 1 - off : 0, tx = s.x + s.w - 120;
          card(ctx, tx, yy + 28, 90, 46, { fill: v > 0.5 ? C.good : C.mute, r: 23 });
          ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(tx + 23 + 44 * v, yy + 51, 18, 0, Math.PI * 2); ctx.fill();
        });
      }
      const ok = pop(b, l, "dicabut");
      bip(ctx, 790, A.y + A.h * 0.5, Math.min(220, A.h * 0.3), { mood: ok > 0 ? "happy" : "think", t, look: [-0.8, 0] });
      if (ok > 0) { ctx.save(); ctx.translate(790, A.y + A.h * 0.5 - 200); ctx.scale(ok, ok); ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(0, 0, 60, 0, Math.PI * 2); ctx.fill(); check(ctx, 0, 0, 66, C.bg); ctx.restore(); }
    }
  });
})();
