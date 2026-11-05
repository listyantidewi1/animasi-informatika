/* T24 DNS: buku telepon internet — adegan khusus. Nama situs rekaan; alamat IP dari blok dokumentasi 203.0.113.x dan 198.51.100.x. */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, bip, bubble, rnd, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const SITE = "kantinsehat.example", IP = "203.0.113.25";
  const BOOK = [["bukuresep.example", "198.51.100.4"], ["jadwalangkot.example", "198.51.100.17"], [SITE, IP], ["tokobuku.example", "203.0.113.8"], ["warungmaya.example", "203.0.113.41"]];

  // jendela browser generik: bilah alamat + isi
  function browser(ctx, x, y, w, h, url, opt = {}) {
    card(ctx, x, y, w, h, { fill: C.panel, stroke: opt.stroke || C.line, lw: 4, r: 24 });
    ctx.fillStyle = C.panel2; rr(ctx, x, y, w, 90, 24); ctx.fill(); ctx.fillRect(x, y + 60, w, 30);
    [C.bad, C.kuning, C.good].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 34 + i * 30, y + 45, 10, 0, Math.PI * 2); ctx.fill(); });
    card(ctx, x + 130, y + 18, w - 160, 54, { fill: C.bg, r: 27 });
    text(ctx, url, x + 160, y + 56, 34, { weight: 800, color: C.ink, fit: w - 220 });
  }
  function server(ctx, cx, cy, s) {
    card(ctx, cx - s * 0.5, cy - s * 0.6, s, s * 1.2, { fill: C.panel2, r: 16, stroke: C.line, lw: 4 });
    for (let i = 0; i < 4; i++) { ctx.fillStyle = C.ink2; rr(ctx, cx - s * 0.38, cy - s * 0.48 + i * s * 0.27, s * 0.76, s * 0.17, 6); ctx.fill();
      ctx.fillStyle = C.tosca; ctx.beginPath(); ctx.arc(cx + s * 0.28, cy - s * 0.395 + i * s * 0.27, s * 0.04, 0, Math.PI * 2); ctx.fill(); }
  }
  function phonebook(ctx, cx, cy, s) {
    card(ctx, cx - s * 0.45, cy - s * 0.55, s * 0.9, s * 1.1, { fill: C.kuning, r: 18 });
    ctx.fillStyle = "#C9A21F"; rr(ctx, cx - s * 0.45, cy - s * 0.55, s * 0.14, s * 1.1, 10); ctx.fill();
    text(ctx, "DNS", cx + s * 0.06, cy + s * 0.12, s * 0.3, { align: "center", weight: 900, color: C.bg });
  }

  Object.assign(T.SCENES, {
    // di bawah kait: nama situs diterjemahkan menjadi angka
    t24_kait(ctx, b, l, t, TL, A) {
      const y = A.y + 10;
      browser(ctx, 80, y, 800, 200, SITE);
      const u = ph(b, l, 0.25, 0.5);
      if (u > 0) { arrow(ctx, 480, y + 220, 480, y + 220 + 90 * u, C.ink2, 12, 34); }
      const un = pop(b, l, 0.3);
      if (un > 0) { ctx.save(); ctx.translate(480, y + 400); ctx.scale(un, un); card(ctx, -360, -70, 720, 140, { fill: C.bg, stroke: C.kuning, lw: 6, r: 28 });
        text(ctx, IP, 0, 26, 72, { align: "center", weight: 900, color: C.kuning }); ctx.restore(); }
      const by = y + 500; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(220, A.bot - by - 10), { mood: cue(b, l, "lalu") > 0 ? "think" : "wow", t });
    },

    // browser bertanya ke DNS (buku telepon)
    t24_tanya(ctx, b, l, t, TL, A) {
      const y = A.y + 20, typed = Math.min(SITE.length, Math.floor(Math.max(0, cue(b, l, "mengetik")) * 12));
      browser(ctx, 80, y, 800, 200, SITE.slice(0, typed) + (typed < SITE.length && (l * 2) % 1 < 0.5 ? "|" : ""));
      const ud = pop(b, l, "DNS");
      if (ud > 0) { ctx.save(); ctx.translate(680, y + 600); ctx.scale(ud, ud); phonebook(ctx, 0, 0, 300); ctx.restore(); }
      const uq = pop(b, l, "bertanya");
      if (uq > 0) { ctx.save(); ctx.globalAlpha = clamp(uq, 0, 1); bubble(ctx, "Alamat " + SITE + " berapa?", 80, y + 400, 640, 44, { em: [SITE], tailX: 240 }); ctx.restore(); }
      const ub = pop(b, l, "buku telepon");
      if (ub > 0 && y + 840 < A.bot) { ctx.save(); ctx.translate(480, y + 840); ctx.scale(ub, ub); pill(ctx, "DNS = buku telepon internet", 0, 0, 44, { fill: C.kuning }); ctx.restore(); }
      bip(ctx, 260, y + 620, 220, { mood: "think", t, look: [1, 0] });
    },

    // DNS mencari di daftarnya, lalu menjawab
    t24_cari(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y = A.y + 10, rowH = 92;
      card(ctx, x, y, w, 110 + rowH * BOOK.length, { fill: "#FFF6D6", r: 28 });
      phonebook(ctx, x + 70, y + 60, 90);
      text(ctx, "Daftar DNS", x + 140, y + 76, 46, { weight: 900, color: C.bg });
      const scan = clamp(cue(b, l, "mencari") / 1.2, 0, 1), found = cue(b, l, "lalu") > 0;
      BOOK.forEach(([n, ip], i) => {
        const ry = y + 110 + i * rowH, hit = i === 2, on = found ? hit : Math.floor(scan * 3) === i && scan < 1;
        if (on || (found && hit)) card(ctx, x + 16, ry + 4, w - 32, rowH - 8, { fill: hit && found ? C.good : "rgba(77,163,255,0.35)", r: 16 });
        text(ctx, n, x + 40, ry + 60, 40, { weight: 800, color: C.bg, fit: 360 });
        text(ctx, ip, x + w - 40, ry + 60, 40, { align: "right", weight: 900, color: hit && found ? C.bg : "#4A5288", fit: 330 });
      });
      const ua = pop(b, l, "alamat IP"), ay = y + 110 + rowH * BOOK.length + 70;
      if (ua > 0) { ctx.save(); ctx.globalAlpha = clamp(ua, 0, 1); bubble(ctx, "Alamatnya " + IP, 330, ay + 110, 520, 42, { em: [IP], tailX: 760, fill: C.kuning }); ctx.restore(); }
      if (A.bot - ay > 260) bip(ctx, 200, ay + 140, 180, { mood: ua > 0 ? "happy" : "think", t });
    },

    // browser menghubungi server, halaman termuat
    t24_muat(ctx, b, l, t, TL, A) {
      const y = A.y + 10;
      server(ctx, 480, y + 110, 150);
      text(ctx, IP, 480, y + 240, 40, { align: "center", weight: 900, color: C.kuning });
      const uc = ph(b, l, "menghubungi", 0.6), by0 = y + 380;
      if (uc > 0) { ctx.save(); ctx.strokeStyle = C.tosca; ctx.lineWidth = 8; ctx.setLineDash([16, 14]); ctx.lineDashOffset = -l * 60; ctx.beginPath(); ctx.moveTo(480, y + 260); ctx.lineTo(480, y + 260 + (by0 - y - 260) * uc); ctx.stroke(); ctx.restore(); }
      browser(ctx, 80, by0, 800, Math.min(560, A.bot - by0 - 10), SITE);
      const k = ph(b, l, "memuat", 1.0), cx0 = 120, cw = 720, top = by0 + 120;
      // isi halaman muncul bertahap
      if (k > 0) {
        ctx.save(); ctx.globalAlpha = clamp(k * 3, 0, 1); card(ctx, cx0, top, cw, 110, { fill: C.tosca, r: 16 }); text(ctx, "Kantin Sehat", cx0 + 30, top + 72, 52, { weight: 900, color: C.bg }); ctx.restore();
        [["Nasi sayur", "Rp8.000"], ["Bubur ayam", "Rp7.000"], ["Jus jambu", "Rp5.000"]].forEach(([m, p], i) => {
          const u = clamp(k * 3 - 0.6 - i * 0.6, 0, 1); if (u <= 0) return; const ry = top + 140 + i * 90;
          if (ry + 70 > by0 + Math.min(560, A.bot - by0 - 10)) return;
          ctx.save(); ctx.globalAlpha = u; card(ctx, cx0, ry, cw, 74, { fill: C.panel2, r: 14 });
          text(ctx, m, cx0 + 30, ry + 50, 38, { weight: 800, color: C.ink }); text(ctx, p, cx0 + cw - 30, ry + 50, 38, { align: "right", weight: 900, color: C.kuning }); ctx.restore();
        });
      } else if (uc > 0) { // memutar tanda memuat
        ctx.save(); ctx.strokeStyle = C.ink2; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(480, by0 + 260, 50, l * 6, l * 6 + 4.2); ctx.stroke(); ctx.restore();
      }
    },

    // jawaban disimpan sementara: kunjungan berikutnya lewat jalan pintas
    t24_simpan(ctx, b, l, t, TL, A) {
      const y = A.y + 20;
      // catatan browser
      card(ctx, 80, y, 800, 240, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "Catatan sementara di HP-mu", 120, y + 66, 40, { weight: 800, color: C.ink2, fit: 720 });
      const us = ph(b, l, "disimpan", 0.5);
      if (us > 0) { ctx.save(); ctx.globalAlpha = us; ctx.translate((1 - us) * 300, 0); card(ctx, 120, y + 100, 720, 100, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 });
        text(ctx, SITE, 150, y + 166, 34, { weight: 800, color: C.ink }); text(ctx, IP, 810, y + 166, 34, { align: "right", weight: 900, color: C.kuning }); ctx.restore(); }
      // dua jalur: lama (lewat DNS) dan cepat (langsung)
      const ly = y + 330, uk = ph(b, l, "kunjungan", 0.5);
      if (uk > 0) {
        ctx.save(); ctx.globalAlpha = uk;
        text(ctx, "Kunjungan berikutnya", 80, ly, 44, { weight: 900, color: C.kuning });
        phonebook(ctx, 480, ly + 170, 140); ctx.globalAlpha = uk * 0.5;
        ctx.strokeStyle = C.mute; ctx.lineWidth = 8; ctx.setLineDash([12, 12]); ctx.beginPath(); ctx.moveTo(180, ly + 300); ctx.quadraticCurveTo(480, ly + 20, 780, ly + 300); ctx.stroke(); ctx.setLineDash([]);
        ctx.globalAlpha = uk; ctx.strokeStyle = C.bad; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(420, ly + 110); ctx.lineTo(540, ly + 230); ctx.moveTo(540, ly + 110); ctx.lineTo(420, ly + 230); ctx.stroke();
        ctx.restore();
        const k = clamp(cue(b, l, "lebih cepat") / 0.5, 0, 1);
        bip(ctx, 160, ly + 330, 130, { mood: "happy", t });
        server(ctx, 800, ly + 320, 110);
        arrow(ctx, 230, ly + 330, lerp(240, 730, ease(k)), ly + 330, C.tosca, 12, 36);
        if (k >= 1 && ly + 460 < A.bot) { const u = pop(b, l, "lebih cepat", 0.4); ctx.save(); ctx.translate(480, ly + 440); ctx.scale(u, u); pill(ctx, "Langsung, lebih cepat!", 0, 0, 44, { fill: C.tosca }); ctx.restore(); }
      }
    }
  });
})();
