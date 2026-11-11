/* Kiko Short: penyusun frame vertikal 1080x1920 untuk YouTube Shorts.
   Adegan episode tetap digambar di kanvas 1920x1080 (tak terlihat), lalu bagian pentingnya (beat.crops: [[x, y, w, h], ...])
   ditumpuk di tengah layar vertikal. Atas: pertanyaan kait (TL.hook) yang terus tampil; bawah: teks narasi besar + garis baca.
   Waktu adegan dimampatkan: beat.src_dur (durasi beat asal di episode) dibagi durasi beat Short, supaya animasinya selesai.
   Zona aman Shorts: kolom tombol di kanan (x > ~950, y 900–1500) dan keterangan di bawah (y > ~1580) dibiarkan kosong dari teks. */
(function (global) {
  const K = global.Kiko, C = K.C, { rr, text, wrap, para, kiko, card, clamp, ease } = K.helpers;
  const SW = 1080, SH = 1920;
  const IMG_TOP = 420, IMG_BOT = 1230, IMG_W = 1000;

  // pertanyaan kait: 70 px (2 baris) atau 58 px bila perlu 3 baris; mengembalikan batas bawahnya
  function hookBand(ctx, TL, t) {
    text(ctx, (TL.label || "Informatika") + " · " + TL.episode, 60, 96, 30, { color: C.ink2, weight: 700 });
    ctx.fillStyle = C.bg2; ctx.fillRect(0, 120, SW, 8); ctx.fillStyle = C.accent; ctx.fillRect(0, 120, SW * (TL.bar_full ? 1 : clamp(t / TL.total, 0, 1)), 8);
    let size = 70, lines = wrap(ctx, TL.hook, size, 900, 940);
    if (lines.length > 2) { size = 58; lines = wrap(ctx, TL.hook, size, 900, 960); }
    const y0 = 170 + (lines.length < 3 ? 40 : 0);
    lines.slice(0, 3).forEach((ln, i) => text(ctx, ln, SW / 2, y0 + size + i * size * 1.18, size, { align: "center", weight: 900, color: C.ink }));
    return y0 + size + (lines.length - 1) * size * 1.18 + 20;
  }

  // tumpukan potongan adegan: tiap potongan dilebarkan ke IMG_W, lalu semua diperkecil bersama bila terlalu tinggi
  // tumpukan potongan adegan: tiap potongan dilebarkan ke IMG_W (paling besar 1,6× agar tidak buram), lalu semua diperkecil bersama bila terlalu tinggi
  function crops(ctx, off, list, top, bot) {
    const gap = 56, ws = list.map(([, , w]) => Math.min(IMG_W, w * 1.6)), hs = list.map(([, , w, h], i) => h * ws[i] / w);
    const gaps = gap * (list.length - 1), sum = hs.reduce((a, b) => a + b, 0);
    const s = Math.min(1, (bot - top - gaps) / sum);
    let y = top + ((bot - top) - (sum * s + gaps)) / 2;
    list.forEach(([x, cy, w, h], i) => {
      const dw = ws[i] * s, dh = hs[i] * s, dx = (SW - dw) / 2;
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.12)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6;
      ctx.fillStyle = "#fff"; rr(ctx, dx - 16, y - 16, dw + 32, dh + 32, 26); ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, dx - 16, y - 16, dw + 32, dh + 32, 26); ctx.clip();
      ctx.drawImage(off, x, cy, w, h, dx, y, dw, dh); ctx.restore();
      y += dh + gap;
    });
  }

  // kotak narasi: tingginya mengikuti jumlah baris, dasarnya tidak melewati y 1590 (keterangan Shorts di bawahnya)
  function narrationBox(ctx, b) {
    let size = 50, lines = wrap(ctx, b.text, size, 700, 860);
    if (lines.length > 4) { size = 44; lines = wrap(ctx, b.text, size, 700, 860); }
    const h = lines.length * size * 1.3 + 48;
    return { size, lines, h, y0: Math.min(1268, 1590 - h) };
  }
  function narration(ctx, b, l, nb) {
    const { size, lines, h, y0 } = nb;
    ctx.fillStyle = "rgba(31,42,51,0.94)"; rr(ctx, 50, y0, 900, h, 24); ctx.fill();
    const frac = clamp(l / b.audio, 0, 1); ctx.fillStyle = C.accent; rr(ctx, 50, y0 + h - 9, 900 * frac, 9, 4); ctx.fill();
    lines.forEach((ln, i) => text(ctx, ln, 500, y0 + 24 + size + i * size * 1.3, size, { align: "center", color: C.subText, weight: 700 }));
  }

  // adegan khusus Short (digambar langsung di kanvas vertikal, di area gambar)
  const VSCENES = {
    short_cta(ctx, b, l, TL) {
      const u = ease(l / 0.6);
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, 70, IMG_TOP + 10, 940, 800, { fill: "#fff", r: 30 });
      text(ctx, TL.cta_heading || "TONTON EPISODE LENGKAPNYA", SW / 2, IMG_TOP + 100, 34, { align: "center", weight: 900, color: C.accentDark });
      para(ctx, TL.full_title, SW / 2, IMG_TOP + 180, 50, 820, { align: "center", weight: 900, lh: 1.2 });
      card(ctx, 130, IMG_TOP + 400, 820, 150, { fill: C.bg2, r: 22 });
      text(ctx, "latihan interaktif:", SW / 2, IMG_TOP + 458, 30, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, TL.link, SW / 2, IMG_TOP + 515, 40, { align: "center", weight: 900, color: C.kikoDark });
      ctx.restore();
      kiko(ctx, SW / 2, IMG_TOP + 650, 120, 0, { wave: l });
    },
    // penutup versi TikTok: ajakan subscribe channel YouTube (tombol digambar sendiri, bukan logo). Ruang aman TikTok:
    // teks penting di x < 900 pada y 900–1500. TL.channel bawaan "youtube.com/@iTeachSWE"; b.tap = detik ketukan tombol.
    tiktok_subscribe(ctx, b, l, TL) {
      const u = ease(l / 0.5), top = IMG_TOP + 10;
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, 70, top, 940, 740, { fill: "#fff", r: 30 });
      text(ctx, "PEMBAHASAN LENGKAPNYA ADA DI YOUTUBE", SW / 2, top + 90, 34, { align: "center", weight: 900, color: C.accentDark });
      para(ctx, TL.full_title || "", SW / 2, top + 165, 44, 820, { align: "center", weight: 900, lh: 1.2 });
      card(ctx, 120, top + 300, 840, 120, { fill: C.bg2, r: 22 });
      text(ctx, TL.channel || "youtube.com/@iTeachSWE", SW / 2, top + 378, 52, { align: "center", weight: 900, color: C.kikoDark });
      ctx.restore();
      // tombol SUBSCRIBE: muncul, berdenyut, lalu "diketuk" jari (lingkaran putih) menjadi SUBSCRIBED
      const ub = ease((l - 0.8) / 0.4), tap = l - (b.tap || 4.5), by = top + 545;
      if (ub > 0) {
        const pulse = 1 + 0.035 * Math.sin(l * 6), pressed = tap > 0 && tap < 0.25 ? 0.93 : 1, done = tap > 0.12;
        ctx.save(); ctx.translate(470, by); ctx.scale(ub * pulse * pressed, ub * pulse * pressed);
        card(ctx, -270, -62, 540, 124, { fill: done ? C.muted : C.bad, r: 62 });
        text(ctx, done ? "SUBSCRIBED" : "SUBSCRIBE", 30, 18, 50, { align: "center", weight: 900, color: "#fff" });
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(-215, 20); ctx.quadraticCurveTo(-212, -28, -188, -28); ctx.quadraticCurveTo(-164, -28, -161, 20); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.arc(-188, 28, 8, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-222, 16, 68, 7);
        ctx.restore();
        if (tap > 0 && tap < 0.9) { ctx.save(); ctx.strokeStyle = C.ink; ctx.globalAlpha = 1 - tap / 0.9; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(600, by + 18, 28 + tap * 110, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        if (tap > -0.6 && tap < 1.2) { ctx.save(); ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.strokeStyle = C.ink2; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(600 + Math.max(0, -tap) * 110, by + 18 + Math.max(0, -tap) * 150, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore(); }
      }
      kiko(ctx, 830, top + 600, 130, 0, { wave: l });
    }
  };

  function drawShort(ctx, off, t, TL) {
    const b = K.beatAt(TL, t), l = t - b.start;
    const octx = off.getContext("2d");
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, SW, SH);
    const top = Math.max(IMG_TOP, hookBand(ctx, TL, t) + 40);
    const nb = narrationBox(ctx, b), bot = Math.min(IMG_BOT, nb.y0 - 38);
    if (VSCENES[b.scene]) VSCENES[b.scene](ctx, b, l, TL);
    else {
      octx.save(); octx.setTransform(1, 0, 0, 1, 0, 0); octx.fillStyle = "#fff"; octx.fillRect(0, 0, K.W, K.H);
      const sl = l * (b.src_dur ? b.src_dur / b.dur : 1) + (b.at || 0);
      const fn = K.SCENES[b.scene]; if (fn) fn(octx, { ...b, id: b.src || b.id, audio: b.src_audio || b.audio, dur: b.src_dur || b.dur }, sl, t, TL);  // adegan yang memakai b.audio/b.dur untuk tempo melihat durasi beat asalnya
      octx.restore();
      crops(ctx, off, b.crops || [[120, 150, 1680, 740]], top, b.note ? bot - 60 : bot);
      if (b.note) text(ctx, b.note, SW / 2, bot - 8, 30, { align: "center", weight: 800, color: C.bad });
    }
    narration(ctx, b, l, nb);
    ctx.restore();
    return b;
  }

  K.drawShort = K.drawShortDok || drawShort; K.SW = SW; K.SH = SH;   // dokumenter: tampilan malam dari short_dok.js (dimuat sebagai mesin induk)
})(typeof window !== "undefined" ? window : globalThis);
