/* T03 Chat-mu dipecah jadi paket-paket kecil — adegan khusus. Nama dan pesan rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, cue, cueAt, ph, pop } = T.helpers;
  const PARTS = ["Besok", "kerja kelompok", "jam 3,", "ya?"], MSG = "Besok kerja kelompok jam 3, ya?";
  const COL = [C.kuning, C.pink, C.tosca, C.biru];

  // paket kecil: kotak berwarna dengan nomor; opt.label = isi teks di bawah nomor
  function packet(ctx, i, x, y, s, opt = {}) {
    card(ctx, x - s / 2, y - s / 2, s, s, { fill: COL[i], r: s * 0.22 });
    ctx.strokeStyle = "rgba(11,14,42,0.35)"; ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(x - s / 2, y - s * 0.12); ctx.lineTo(x + s / 2, y - s * 0.12); ctx.stroke();
    text(ctx, String(i + 1), x, y + s * 0.32, s * 0.42, { align: "center", weight: 900, color: C.bg });
  }
  function chatBubble(ctx, s, x, y, w, alpha) {
    ctx.save(); ctx.globalAlpha = alpha;
    card(ctx, x, y, w, 120, { fill: C.biru, r: 40 });
    text(ctx, s, x + w / 2, y + 78, 50, { align: "center", weight: 800, color: C.ink, fit: w - 50 }); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: gelembung chat pecah menjadi empat paket
    t03_chat(ctx, b, l, t, TL, A) {
      const y = A.y + 30, split = ease((l - 0.9) / 0.6);
      chatBubble(ctx, MSG, 120, y, 720, 1 - split);
      if (split > 0) PARTS.forEach((p, i) => {
        const x0 = 230 + i * 165, x1 = 170 + i * 205, y1 = y + 170 + (i % 2) * 120 + Math.sin(l * 4 + i) * 10;
        packet(ctx, i, lerp(x0, x1, split), lerp(y + 60, y1, split), lerp(60, 130, split));
      });
      if (A.h > 420) bip(ctx, 480, A.bot - 110, Math.min(200, A.h - 380), { mood: "wow", t });
    },
    // tiap paket diberi label: alamat tujuan dan nomor urut
    t03_label(ctx, b, l, t, TL, A) {
      const ch = Math.min(170, (A.h - 60) / 4 - 20), ua = ph(b, l, "alamat"), un = ph(b, l, "nomor urut");
      PARTS.forEach((p, i) => {
        const u = pop(b, l, i * 0.05); if (u <= 0) return;
        const y = A.y + 20 + i * (ch + 20);
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - u) * -100, 0);
        card(ctx, A.x, y, 820, ch, { fill: C.panel, stroke: COL[i], lw: 5, r: 24 });
        text(ctx, "“" + p + "”", A.x + 40, y + ch / 2 + 18, 50, { weight: 800, color: C.ink, fit: 380 });
        if (ua > 0) { ctx.save(); ctx.globalAlpha = ua; card(ctx, A.x + 440, y + 18, 230, ch - 36, { fill: C.bg2, r: 16 });
          text(ctx, "ke:", A.x + 460, y + ch / 2 - 8, 28, { weight: 700, color: C.ink2 }); text(ctx, "HP Rara", A.x + 460, y + ch / 2 + 32, 40, { weight: 900, color: C.ink }); ctx.restore(); }
        if (un > 0) { ctx.save(); ctx.globalAlpha = un; ctx.fillStyle = COL[i]; ctx.beginPath(); ctx.arc(A.x + 740, y + ch / 2, 50 * back(un), 0, Math.PI * 2); ctx.fill();
          text(ctx, (i + 1) + "/4", A.x + 740, y + ch / 2 + 15, 40, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
        ctx.restore();
      });
    },
    // paket melompat antar-router lewat jalur berbeda; tiba dengan urutan 3, 1, 4, 2
    t03_rute(ctx, b, l, t, TL, A) {
      const top = A.y + 70, bot = A.bot - 70, mid = (top + bot) / 2, h = bot - top;
      const N = { S: [480, top], a: [200, top + h * 0.3], b: [480, top + h * 0.3], c: [760, top + h * 0.3], d: [260, top + h * 0.7], e: [700, top + h * 0.7], R: [480, bot] };
      const E = [["S", "a"], ["S", "b"], ["S", "c"], ["a", "d"], ["b", "d"], ["b", "e"], ["c", "e"], ["a", "b"], ["d", "R"], ["e", "R"], ["d", "e"]];
      ctx.strokeStyle = C.line; ctx.lineWidth = 8; ctx.beginPath(); E.forEach(([p, q]) => { ctx.moveTo(...N[p]); ctx.lineTo(...N[q]); }); ctx.stroke();
      const routers = ["a", "b", "c", "d", "e"];
      routers.forEach(k => { const [x, y] = N[k]; card(ctx, x - 60, y - 34, 120, 68, { fill: C.panel2, stroke: C.biru, lw: 4, r: 14 });
        for (let j = 0; j < 3; j++) { ctx.fillStyle = (Math.floor(t * 4) + j + k.charCodeAt(0)) % 3 ? C.tosca : C.bg; ctx.beginPath(); ctx.arc(x - 28 + j * 28, y + 12, 7, 0, Math.PI * 2); ctx.fill(); } });
      const ur = pop(b, l, "router"); if (ur > 0) { ctx.save(); ctx.translate(N.c[0], N.c[1] - 80); ctx.scale(ur, ur); pill(ctx, "router", 0, 0, 36, { fill: C.biru, color: C.ink }); ctx.restore(); }
      card(ctx, N.S[0] - 130, N.S[1] - 46, 260, 92, { fill: C.panel, stroke: C.kuning, lw: 4, r: 22 }); text(ctx, "HP-mu", N.S[0], N.S[1] + 16, 44, { align: "center", weight: 900 });
      card(ctx, N.R[0] - 150, N.R[1] - 46, 300, 92, { fill: C.panel, stroke: C.tosca, lw: 4, r: 22 }); text(ctx, "HP Rara", N.R[0], N.R[1] + 16, 44, { align: "center", weight: 900 });
      const paths = [["S", "a", "d", "R"], ["S", "c", "e", "d", "R"], ["S", "b", "e", "R"], ["S", "a", "b", "d", "R"]];
      const start = [0, 0.3, 0.6, 0.9], dur = [2.6, 3.4, 1.6, 2.2], t0 = cueAt(b, 0.05);
      paths.forEach((p, i) => {
        const u = clamp((l - t0 - start[i]) / dur[i], 0, 1); if (l - t0 - start[i] < 0) return;
        const seg = Math.min(p.length - 2, Math.floor(u * (p.length - 1))), f = u * (p.length - 1) - seg;
        const [x1, y1] = N[p[seg]], [x2, y2] = N[p[seg + 1]];
        packet(ctx, i, lerp(x1, x2, f) + (u >= 1 ? ([1, 3, 0, 2][i] - 1.5) * 70 : 0), lerp(y1, y2, f) + (u >= 1 ? -85 : 0), 64);
      });
    },
    // tiba acak (3, 1, 4, 2), lalu disusun 1, 2, 3, 4 menjadi pesan utuh
    t03_susun(ctx, b, l, t, TL, A) {
      const arr = [2, 0, 3, 1], k = ease(cue(b, l, "disusun") / 0.9), y = A.y + 160;
      text(ctx, k < 0.5 ? "Urutan tiba" : "Disusun sesuai nomor", 480, A.y + 60, 50, { align: "center", weight: 900, color: k < 0.5 ? C.bad : C.good });
      arr.forEach((p, slot) => {
        const u = pop(b, l, 0.02 + slot * 0.06); if (u <= 0) return;
        const x = lerp(180 + slot * 200, 180 + p * 200, k), yy = y + 100 - Math.sin(k * Math.PI) * 120;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); packet(ctx, p, x, yy, 150); ctx.restore();
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1) * (1 - k); text(ctx, "tiba ke-" + (slot + 1), 180 + slot * 200, y + 230, 30, { align: "center", weight: 700, color: C.ink2 }); ctx.restore();
      });
      const um = pop(b, l, cueFrac(b, "nomor urut") + 0.04);
      if (um > 0) {
        ctx.save(); ctx.translate(480, y + 400); ctx.scale(um, um);
        card(ctx, -380, -70, 760, 140, { fill: C.biru, r: 44 });
        text(ctx, MSG, 0, 18, 50, { align: "center", weight: 800, color: C.ink, fit: 700 }); ctx.restore();
        check(ctx, 480, y + 560, 90 * clamp(um, 0, 1), C.good);
      }
    },
    // paket 3 hilang, tanda terima hanya untuk 1, 2, 4; paket 3 dikirim ulang
    t03_hilang(ctx, b, l, t, TL, A) {
      const top = A.y + 60, bot = A.bot - 70, lanes = [210, 370, 530, 690], tSend = cueAt(b, 0.02), lost = 2;
      card(ctx, 90, top - 50, 720, 96, { fill: C.panel, stroke: C.kuning, lw: 4, r: 22 }); text(ctx, "Pengirim", 130, top + 14, 44, { weight: 900 });
      card(ctx, 90, bot - 50, 720, 96, { fill: C.panel, stroke: C.tosca, lw: 4, r: 22 }); text(ctx, "Penerima", 450, bot + 14, 44, { align: "center", weight: 900 });
      const tAck = cueAt(b, "tanda terima") - 0.4, tRe = cueAt(b, "dikirim ulang");
      lanes.forEach((x, i) => {
        const u = clamp((l - tSend - i * 0.15) / 1.4, 0, 1);
        if (l < tSend + i * 0.15) return;
        const y = lerp(top + 90, bot - 90, ease(u));
        if (i === lost) {
          if (u < 0.5) packet(ctx, i, x, y, 70);
          else if (u < 1 || l < tRe) { const k = ease((u - 0.5) / 0.3); ctx.save(); ctx.globalAlpha = 1 - 0.7 * k; packet(ctx, i, x, lerp(top + 90, bot - 90, 0.5), 70); ctx.restore(); cross(ctx, x, lerp(top + 90, bot - 90, 0.5), 90 * k, C.bad);
            if (k > 0.5) text(ctx, "hilang", x, lerp(top + 90, bot - 90, 0.5) + 90, 36, { align: "center", weight: 900, color: C.bad }); }
          const r = clamp((l - tRe) / 1.2, 0, 1);
          if (l >= tRe) { packet(ctx, i, x, lerp(top + 90, bot - 90, ease(r)), 70); if (r < 1) text(ctx, "kirim ulang", x + 60, lerp(top + 90, bot - 90, ease(r)) + 12, 34, { weight: 900, color: C.kuning }); else check(ctx, x, bot - 170, 60, C.good); }
        } else {
          packet(ctx, i, x, y, 70);
          const a = clamp((l - tAck - i * 0.1) / 1.0, 0, 1);
          if (l > tAck + i * 0.1) { const yy = lerp(bot - 160, top + 90, ease(a)); check(ctx, x, yy, 50, C.good); }
        }
      });
      const ua = ph(b, l, "tanda terima");
      if (ua > 0) { ctx.save(); ctx.globalAlpha = ua; text(ctx, "✓ = tanda terima", 780, top + 12, 36, { align: "right", weight: 800, color: C.good }); ctx.restore(); }
    }
  });
  function cueFrac(b, w) { const i = b.text.toLowerCase().indexOf(w); return i < 0 ? 0 : i / b.text.length; }
})();
