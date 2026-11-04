/* T02 Komputer cuma kenal 0 dan 1. Kok bisa menampilkan foto? — adegan khusus.
   "Foto" contoh: potret Bip 32x32 piksel yang dihitung dengan kode (tanpa gambar unduhan). */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, bip, ease, clamp, lerp, back, rnd, fmt, cue, ph, pop } = T.helpers;
  const N = 32;
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  // potret Bip: warna [r, g, b] untuk tiap piksel
  const IMG = (() => {
    const out = [], d = (x, y, cx, cy) => Math.hypot(x - cx, y - cy);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const x = i + 0.5, y = j + 0.5;
      let c = [77 + j * 3, 120 + j * 2, 230 - j];                                               // langit biru, makin bawah makin terang
      if (j >= 27) c = [255, 210, 63];                                                           // lantai kuning
      if (Math.hypot((x - 16) / 13, (y - 19) / 11.5) < 1) {                                       // badan
        const sh = clamp(1 - Math.hypot(x - 11, y - 13) / 16, 0, 1);
        c = [Math.round(lerp(14, 143, sh * sh) + 20 * sh), Math.round(lerp(156, 245, sh)), Math.round(lerp(136, 227, sh))];
      }
      if (Math.abs(x - 16) < 0.6 && y > 4 && y < 8.5) c = [14, 156, 136];                         // antena
      if (d(x, y, 16, 3.5) < 1.9) c = [255, 210, 63];
      for (const ex of [11, 21]) {                                                               // mata
        if (Math.hypot((x - ex) / 2.8, (y - 17) / 3.3) < 1) c = [255, 255, 255];
        if (d(x, y, ex + 0.5, 17.6) < 1.5) c = [11, 14, 42];
      }
      for (const cx of [7, 25]) if (Math.hypot((x - cx) / 2, (y - 22.5) / 1.1) < 1) c = [255, 120, 175];  // pipi
      if (y > 23 && y < 24.6 && Math.abs(x - 16) < 2.4 && Math.abs(x - 16) > 0) c = [11, 14, 42];          // mulut
      out.push(c);
    }
    return out;
  })();
  const rgb = c => `rgb(${c[0]},${c[1]},${c[2]})`;
  const PICK = [13, 18];                                                  // piksel yang diperbesar (badan Bip)
  const PC = IMG[PICK[1] * N + PICK[0]];

  // menggambar potret; z = perbesaran di sekitar piksel PICK; grid = 0..1 garis kotak
  function portrait(ctx, x, y, S, z, grid, reveal) {
    ctx.save(); rr(ctx, x, y, S, S, 24); ctx.clip();
    ctx.fillStyle = C.bg; ctx.fillRect(x, y, S, S);
    const cs = S / N * z, fx = (PICK[0] + 0.5) / N, fy = (PICK[1] + 0.5) / N;
    // titik pusat perbesaran bergeser dari tengah gambar ke piksel PICK
    const k = clamp((z - 1) / 2, 0, 1), cx = lerp(0.5, fx, k), cy = lerp(0.5, fy, k);
    const X0 = x + S / 2 - cx * N * cs, Y0 = y + S / 2 - cy * N * cs;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const px = X0 + i * cs, py = Y0 + j * cs;
      if (px > x + S || py > y + S || px + cs < x || py + cs < y) continue;
      if (reveal !== undefined && (j * N + i) / (N * N) > reveal) { ctx.fillStyle = (i + j) % 2 ? "#141A45" : "#1B2257"; ctx.fillRect(px, py, cs + 0.5, cs + 0.5); continue; }
      ctx.fillStyle = rgb(IMG[j * N + i]); ctx.fillRect(px, py, cs + 0.5, cs + 0.5);
    }
    if (grid > 0) {
      ctx.strokeStyle = `rgba(11,14,42,${0.7 * grid})`; ctx.lineWidth = Math.max(1, cs * 0.04); ctx.beginPath();
      for (let i = 0; i <= N; i++) { ctx.moveTo(X0 + i * cs, Y0); ctx.lineTo(X0 + i * cs, Y0 + N * cs); ctx.moveTo(X0, Y0 + i * cs); ctx.lineTo(X0 + N * cs, Y0 + i * cs); }
      ctx.stroke();
    }
    ctx.restore();
    return { X0, Y0, cs };
  }

  Object.assign(T.SCENES, {
    // di bawah kait: deretan 0 dan 1 mengalir masuk ke bingkai foto
    t02_art(ctx, b, l, t, TL, A) {
      const S = Math.min(440, A.h - 20), x = 540 - S / 2 + 120, y = A.y + (A.h - S) / 2;
      for (let r = 0; r < 7; r++) {
        let s = ""; for (let k = 0; k < 8; k++) s += rnd(r * 31 + k + Math.floor(t * 8 + r) * 7) > 0.5 ? "1" : "0";
        const u = ph(b, l, 0.02 + r * 0.04, 0.3); if (u <= 0) continue;
        ctx.save(); ctx.globalAlpha = u; text(ctx, s, x - 40 - (1 - u) * 80, y + 60 + r * (S - 60) / 6, 40, { align: "right", weight: 800, color: r % 2 ? C.tosca : C.kuning }); ctx.restore();
      }
      arrow(ctx, x - 30, y + S / 2, x - 4, y + S / 2, C.ink, 8, 24);
      card(ctx, x - 10, y - 10, S + 20, S + 20, { fill: C.ink, r: 30 });
      portrait(ctx, x, y, S, 1, 0, ease(l / 1.4));
    },
    // perbesar terus sampai tampak kotak-kotak piksel
    t02_zoom(ctx, b, l, t, TL, A) {
      const S = Math.min(800, A.h - 120), x = 480 - S / 2, y = A.y + 10;
      const z = lerp(1, 6, ease(cue(b, l, "perbesar") / Math.max(1, cueTo(b, "kotak") - cueTo(b, "perbesar"))));
      card(ctx, x - 10, y - 10, S + 20, S + 20, { fill: C.ink, r: 30 });
      const g = portrait(ctx, x, y, S, z, clamp((z - 3) / 3, 0, 1));
      text(ctx, "×" + z.toFixed(1).replace(".", ","), x + 30, y + 70, 48, { weight: 900, color: C.ink, shadow: true });
      const u = pop(b, l, "piksel");
      if (u > 0) {
        const px = g.X0 + PICK[0] * g.cs, py = g.Y0 + PICK[1] * g.cs;
        ctx.save(); ctx.strokeStyle = C.kuning; ctx.lineWidth = 10; ctx.globalAlpha = clamp(u, 0, 1); ctx.strokeRect(px, py, g.cs, g.cs); ctx.restore();
        ctx.save(); ctx.translate(480, y + S + 60); ctx.scale(u, u); pill(ctx, "1 kotak = 1 piksel", 0, 0, 44, { fill: C.kuning }); ctx.restore();
      }
    },
    // satu piksel = tiga angka merah, hijau, biru
    t02_rgb(ctx, b, l, t, TL, A) {
      const u = pop(b, l, 0);
      ctx.save(); ctx.translate(480, A.y + 170); ctx.scale(u, u);
      card(ctx, -150, -150, 300, 300, { fill: rgb(PC), r: 24, stroke: C.kuning, lw: 10 }); ctx.restore();
      text(ctx, "1 piksel", 480, A.y + 380, 44, { align: "center", weight: 800, color: C.ink2 });
      ["#FF5A5F", "#3BE38A", C.biru].forEach((col, i) => {                 // tiga angka: tiga titik warna muncul satu per satu
        const k = pop(b, l, (cueTo(b, "tiga") - cueTo(b, 0)) / (b.audio || 1) + i * 0.04, 0.35); if (k <= 0) return;
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(700 + i * 70, A.y + 170, 26 * k, 0, Math.PI * 2); ctx.fill();
      });
      [["Merah", PC[0], "#FF5A5F", "merah"], ["Hijau", PC[1], "#3BE38A", "hijau"], ["Biru", PC[2], C.biru, "biru"]].forEach(([nm, v, col, w], i) => {
        const k = ph(b, l, w, 0.5); if (k <= 0) return;
        const y = A.y + 450 + i * 140;
        ctx.save(); ctx.globalAlpha = k;
        text(ctx, nm, 90, y + 50, 46, { weight: 900, color: col });
        card(ctx, 290, y + 8, 460, 56, { fill: C.panel, r: 28 }); card(ctx, 290, y + 8, Math.max(56, 460 * v / 255 * k), 56, { fill: col, r: 28 });
        text(ctx, String(Math.round(v * k)), 860, y + 54, 54, { weight: 900, color: C.ink, align: "right" });
        ctx.restore();
      });
    },
    // satu angka = delapan digit 0 dan 1
    t02_bit(ctx, b, l, t, TL, A) {
      const v = PC[1], bits = v.toString(2).padStart(8, "0");
      text(ctx, "Hijau = " + v, 480, A.y + 90, 70, { align: "center", weight: 900, color: "#3BE38A" });
      const w = 96, gap = 8, x0 = 480 - (8 * w + 7 * gap) / 2, y = A.y + 170;
      for (let i = 0; i < 8; i++) {
        const u = pop(b, l, (cueTo(b, "delapan") - cueTo(b, 0)) / (b.audio || 1) + i * 0.035, 0.35);
        const x = x0 + i * (w + gap), on = bits[i] === "1";
        card(ctx, x, y, w, 130, { fill: u > 0 && on ? C.kuning : C.panel, stroke: C.line, lw: 3, r: 18 });
        if (u > 0) { ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); text(ctx, bits[i], x + w / 2, y + 95, 76, { align: "center", weight: 900, color: on ? C.bg : C.ink }); ctx.restore(); }
        text(ctx, String(2 ** (7 - i)), x + w / 2, y + 180, 30, { align: "center", weight: 700, color: C.mute });
      }
      const u2 = pop(b, l, "256");
      if (u2 > 0) {
        ctx.save(); ctx.globalAlpha = clamp(u2, 0, 1);
        text(ctx, "2×2×2×2×2×2×2×2", 480, y + 300, 52, { align: "center", weight: 800, color: C.ink2 });
        ctx.translate(480, y + 450); ctx.scale(u2, u2); text(ctx, "= 256 tingkat", 0, 0, 92, { align: "center", weight: 900, color: C.kuning, shadow: true });
        ctx.restore();
        text(ctx, "dari 0 sampai 255", 480, y + 530, 42, { align: "center", weight: 700, color: C.ink2 });
      }
    },
    // campuran tiga warna cahaya -> lebih dari 16 juta warna
    t02_campur(ctx, b, l, t, TL, A) {
      const m = 1 - ease(cue(b, l, 0) / 1.2), cx = 480, cy = A.y + 220, r = 140;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      [["#FF2020", -Math.PI / 2], ["#20FF20", Math.PI / 6], ["#2040FF", Math.PI * 5 / 6]].forEach(([col, a]) => {
        const d = 80 + m * 110; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
      const u = pop(b, l, "lebih dari");
      if (u > 0) {
        const k = ease(cue(b, l, "lebih dari") / 1.2);
        ctx.save(); ctx.translate(540, cy + 340); ctx.scale(0.6 + 0.4 * u, 0.6 + 0.4 * u);
        text(ctx, fmt(16777216 * k), 0, 0, 150, { align: "center", weight: 900, color: C.kuning, fit: 960, shadow: true }); ctx.restore();
        text(ctx, "warna", 480, cy + 430, 56, { align: "center", weight: 900, color: C.ink });
        text(ctx, "256 × 256 × 256", 480, cy + 510, 44, { align: "center", weight: 700, color: C.ink2 });
      }
    },
    // foto utuh tersusun dari deretan 0 dan 1
    t02_foto(ctx, b, l, t, TL, A) {
      const S = Math.min(520, A.h - 260), pw = S + 60, ph_ = S + 220, x = 480 - pw / 2, y = A.y + 20;
      card(ctx, x, y, pw, ph_, { fill: "#05061A", stroke: C.line, lw: 8, r: 56 });
      card(ctx, x + pw / 2 - 60, y + 26, 120, 18, { fill: C.panel2, r: 9 });
      const rev = ease(cue(b, l, 0) / ((b.audio || 4) * 0.55));
      portrait(ctx, x + 30, y + 110, S, 1, 0, rev);
      // deretan bit masuk dari kiri ke HP
      for (let r = 0; r < 4; r++) {
        let s = ""; for (let k = 0; k < 8; k++) s += rnd(r * 17 + k + Math.floor(t * 10) * 3) > 0.5 ? "1" : "0";
        ctx.save(); ctx.globalAlpha = (1 - rev) * 0.9; text(ctx, s, x + 30 + ((t * 300 + r * 160) % (S - 120)), y + 160 + r * 120, 40, { weight: 900, color: C.kuning, shadow: true }); ctx.restore();
      }
      const u = pop(b, l, "jutaan");
      if (u > 0) { ctx.save(); ctx.translate(480, y + ph_ + 70); ctx.scale(u, u); pill(ctx, "foto 12 MP = 12.000.000 piksel", 0, 0, 40, { fill: C.kuning }); ctx.restore(); }
    }
  });
  function cueTo(b, f) { return T.helpers.cueAt(b, f); }
})();
