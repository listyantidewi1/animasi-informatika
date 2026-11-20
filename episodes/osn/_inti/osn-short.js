/* Short vertikal seri OSN-K (1080x1920). Beat short dengan "src" meminjam adegan beat induk (waktu lokal sama, karena MP3-nya sama);
   "crop" = [x, y, w, h] daerah bingkai induk yang ditampilkan. Adegan khusus: hitung (hitung mundur), ajak (ke video lengkap). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const { rr, text, para, wrap, chip, ap, clamp, speechEnd } = H;
  const SW = 1080, SH = 1920, AREA = [20, 350, 1040, 720];   // daerah adegan: x, y, w, h
  function bg(ctx) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, SW, SH); ctx.fillStyle = C.grid; for (let x = 0; x < SW; x += 40) ctx.fillRect(x, 0, 1, SH); for (let y = 0; y < SH; y += 40) ctx.fillRect(0, y, SW, 1); }
  function drawShort(ctx, off, t, TL, PTL) {
    const b = Kiko.beatAt(TL, t); const l = t - b.start; const octx = off.getContext("2d");
    bg(ctx);
    text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", SW / 2, 96, 30, { mono: true, weight: 700, color: C.green, align: "center", ls: 3 });
    text(ctx, TL.hook[0], SW / 2, 200, 66, { disp: true, weight: 800, align: "center", fit: 980 });
    text(ctx, TL.hook[1], SW / 2, 285, 66, { disp: true, weight: 800, align: "center", color: C.red, fit: 980 });
    if (b.src) {
      const pb = PTL.beats.find(x => x.id === b.src);
      Kiko.draw(octx, pb.start + Math.min(l, pb.dur - 0.02), PTL, { subtitles: false, top: false });
      const [cx, cy, cw, ch] = b.crop || [160, 100, 1600, 760];
      const s = Math.min(AREA[2] / cw, AREA[3] / ch), dw = cw * s, dh = ch * s, dx = (SW - dw) / 2, dy = AREA[1] + (AREA[3] - dh) / 2;
      ctx.save(); rr(ctx, dx - 4, dy - 4, dw + 8, dh + 8, 18); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
      rr(ctx, dx, dy, dw, dh, 14); ctx.clip(); ctx.drawImage(off, cx, cy, cw, ch, dx, dy, dw, dh); ctx.restore();
    } else if (b.scene === "hitung") {
      const N = b.countdown || 5, left = Math.max(0, N - Math.max(0, l - 0.3)), s = Math.ceil(left - 1e-6);
      text(ctx, "PAUSE VIDEONYA", SW / 2, 470, 34, { mono: true, weight: 700, color: C.red, align: "center", ls: 5 });
      para(ctx, "Bisakah kamu memecahkan ini?", SW / 2, 600, 84, 900, { disp: true, weight: 800, align: "center", lh: 1.1 });
      text(ctx, "00:0" + s, SW / 2, 980, 200, { mono: true, weight: 800, color: C.green, align: "center" });
      ctx.fillStyle = C.line; rr(ctx, 140, 1050, 800, 16, 8); ctx.fill(); ctx.fillStyle = C.red; rr(ctx, 140, 1050, 800 * clamp((l - 0.3) / N, 0, 1), 16, 8); ctx.fill();
      para(ctx, TL.tanya || "Paling sedikit berapa kali menimbang agar 100% yakin label mana yang palsu?", SW / 2, 1180, 44, 920, { weight: 800, align: "center", lh: 1.3 });
    } else if (b.scene === "ajak") {
      const u = ap(l, 0.2);
      ctx.save(); ctx.globalAlpha = u;
      text(ctx, "JAWABAN DAN CARANYA", SW / 2, 480, 34, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "ada di video lengkap", SW / 2, 560, 52, { weight: 800, align: "center" });
      rr(ctx, 110, 620, 860, 300, 20); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.green; ctx.stroke();
      const aj = TL.ajak || ["Koin Palsu", "Soal OSN-K Informatika SMA"];
      text(ctx, aj[0], SW / 2, 740, 88, { disp: true, weight: 800, align: "center", fit: 800 });
      text(ctx, aj[1], SW / 2, 820, 40, { weight: 700, align: "center", color: C.mut });
      text(ctx, "Bedah Soal OSN-K Informatika", SW / 2, 880, 30, { mono: true, weight: 700, align: "center", color: C.green });
      ctx.restore();
      const v = ap(l, 1.2); ctx.save(); ctx.globalAlpha = v; text(ctx, "↓  ketuk video terkait di bawah", SW / 2, 1010, 38, { weight: 800, align: "center", color: C.red }); ctx.restore();
    }
    // kartu narasi
    if (b.text) {
      const lines = wrap(ctx, b.text, 42, 600, 900); const h = 40 + lines.length * 42 * 1.32; const y0 = 1100;
      ctx.save(); rr(ctx, 60, y0, SW - 120, h, 12); ctx.fillStyle = "rgba(255,252,244,0.97)"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.stroke();
      ctx.fillStyle = C.green; ctx.fillRect(60, y0, 8, h); const lead = (b.speech || b.start) - b.start; ctx.fillRect(60, y0 + h - 5, (SW - 120) * clamp((l - lead) / b.audio, 0, 1), 5);
      lines.forEach((ln, i) => text(ctx, ln, 100, y0 + 20 + 42 + i * 42 * 1.32 - 6, 42, { weight: 600 }));
      ctx.restore();
    }
    // kredit soal (selalu tampil, di atas daerah antarmuka Shorts)
    const o = TL.osn; text(ctx, TL.kredit || `Soal: OSN-K ${o.tahun} · ${o.jenjang} · No. ${o.nomor} · disusun TOKI · digambar ulang`, SW / 2, 1640, 24, { mono: true, weight: 600, color: C.mut, align: "center", fit: 980 });
  }
  Kiko.drawShort = drawShort;
})();
