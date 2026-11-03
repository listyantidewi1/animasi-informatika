/* Adegan episode D9.5: Produksi dan Diseminasi Konten Digital. Muat setelah kiko-core.js, kiko-devices.js, empati.js, proyek.js, konten.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Em = K.empati, Pr = K.proyek, Kt = K.konten, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const STAGES = [["📝", "Rencana", "untuk siapa, pesan apa, bentuk apa"], ["🎬", "Produksi", "rekam dan sunting dengan HP"], ["📢", "Diseminasi", "sebarkan dengan jujur dan aman"]];
  const FRAMES = [
    ["Kait", (ctx, cx, cy, s) => Kt.pile(ctx, cx, cy + 10, s * 0.5), "Tumpukan sampah bercampur di kantin."],
    ["Masalah", (ctx, cx, cy, s) => { kid(ctx, cx, cy + 10, s * 0.4); text(ctx, "😓", cx + s * 0.25, cy - s * 0.1, s * 0.25, { align: "center" }); }, "Petugas kesulitan memilahnya."],
    ["Langkah 1", (ctx, cx, cy, s) => Kt.bins(ctx, cx, cy, s * 0.26, { n: 1 }), "Hijau: sisa makanan."],
    ["Langkah 2", (ctx, cx, cy, s) => Kt.bins(ctx, cx, cy, s * 0.26, { n: 2 }), "Kuning: plastik dan kertas."],
    ["Langkah 3", (ctx, cx, cy, s) => Kt.bins(ctx, cx, cy, s * 0.26, { n: 3 }), "Merah: baterai dan benda tajam."],
    ["Ajakan", (ctx, cx, cy, s) => { kid(ctx, cx - s * 0.15, cy + 10, s * 0.38, { point: true }); text(ctx, "✓", cx + s * 0.25, cy, s * 0.4, { align: "center", weight: 900, color: C.good }); }, "Mulai hari ini, pilah dulu baru buang."]];
  const drawBoard = (ctx, x, y, w, h, n, hl) => FRAMES.forEach(([t, d, c], i) => Kt.frame(ctx, x + (i % 3) * (w / 3 + 14), y + Math.floor(i / 3) * (h / 2 + 14), w / 3, h / 2, i + 1, t, d, c, { dim: i >= n, on: i === hl, color: i === 0 ? C.accentDark : i === 5 ? C.good : C.kiko }));

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const n = reveal(l, 2.5, 1.2, 3);
      STAGES.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 620 + i * 380; card(ctx, x, 270, 350, 300, { fill: C.bg2, r: 20 }); text(ctx, ic, x + 175, 380, 72, { align: "center" }); text(ctx, (i + 1) + ". " + t, x + 175, 450, 30, { align: "center", weight: 900 }); para(ctx, s, x + 175, 500, 22, 310, { align: "center", color: C.ink2, weight: 700 }); if (i < 2) arrowIcon(ctx, "right", x + 365, 420, 26, C.ink2); ctx.restore(); });
      if (l > 1 && l < 2.5) label(ctx, "🍳 rencana → memasak → menyajikan", 1190, 650);
      if (n >= 3) banner(ctx, "seperti memasak: rencana, masak, sajikan", 640, 900);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.8", "Proyek: Panduan Digital untuk Adik Kelas"], ["D9.4", "Data Pribadi, Identitas Digital, dan Kesadaran Penuh"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 30, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_pitch(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: TIGA PULUH DETIK UNTUK IDEMU");
      [[520, 640, "long"], [760, 700, null], [1000, 700, "long"], [1240, 640, null]].forEach(([x, y, hair], i) => kid(ctx, x, y, 150, { hair, point: i === 0 }));
      const h = bubble(ctx, 560, 420, 560, "Untuk adik kelas tujuh. Pesannya: pilah sampah jadi tiga. Bentuknya: video satu menit.", 26, { tailX: 600 });
      const sec = clamp(30 - Math.floor(l * 2.2), 0, 30);
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(1480, 420, 90, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(1480, 420, 70, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (sec / 30)); ctx.stroke(); text(ctx, sec + " dt", 1480, 432, 34, { align: "center", weight: 900, color: "#fff" });
      ["untuk siapa", "pesan apa", "bentuk apa"].forEach((t, i) => { card(ctx, 1340 + 0, 540 + i * 70, 280, 56, { fill: C.bg2, r: 12 }); text(ctx, (i + 1) + ". " + t, 1480, 577 + i * 70, 24, { align: "center", weight: 900 }); });
    },
    unplugged_storyboard(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "KERTAS DILIPAT MENJADI ENAM KOTAK");
      ctx.fillStyle = "#FFF9E0"; rr(ctx, 360, 280, 1200, 440, 10); ctx.fill(); ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 4; rr(ctx, 360, 280, 1200, 440, 10); ctx.stroke();
      ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(760, 280); ctx.lineTo(760, 720); ctx.moveTo(1160, 280); ctx.lineTo(1160, 720); ctx.moveTo(360, 500); ctx.lineTo(1560, 500); ctx.stroke(); ctx.setLineDash([]);
      const n = reveal(l, 1.5, 1.1, 6);
      FRAMES.forEach(([t, d, c], i) => { if (i >= n) return; const x = 360 + (i % 3) * 400, y = 280 + Math.floor(i / 3) * 220; text(ctx, (i + 1) + ". " + t, x + 16, y + 34, 22, { weight: 900, color: C.kiko }); d(ctx, x + 200, y + 110, 150); text(ctx, c.length > 30 ? c.slice(0, 28) + "…" : c, x + 200, y + 200, 18, { align: "center", weight: 700, color: C.ink2 }); });
      if (n >= 6) label(ctx, "film di atas kertas, sebelum kamera menyala", 960, 790, { size: 26 });
    },

    tiga_tanya(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TAHAP 1 · RENCANA: TIGA PERTANYAAN");
      const qs = [["Untuk siapa?", "👧 adik kelas tujuh", "penonton menentukan bahasa dan bentuk"], ["Pesan apa?", "🗑️ sampah dipilah jadi tiga", "satu pesan saja, jangan lima"], ["Bentuk apa?", "🎬 video satu menit", "atau poster, infografik, rekaman suara"]];
      const n = reveal(l, 2.0, 2.4, 3);
      qs.forEach(([q, a, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 220 + i * 500; card(ctx, x, 290, 460, 400, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 5, r: 18 }); text(ctx, q, x + 230, 360, 36, { align: "center", weight: 900 }); card(ctx, x + 30, 400, 400, 90, { fill: "#fff", stroke: "#C9D4DB", lw: 3, r: 14 }); text(ctx, a, x + 230, 456, 26, { align: "center", weight: 800 }); para(ctx, s, x + 230, 560, 22, 400, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) label(ctx, "jawabannya menentukan semuanya", 960, 740);
    },
    storyboard(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "STORYBOARD ENAM KOTAK", 215);
      const n = reveal(l, 1.2, 1.6, 6);
      drawBoard(ctx, 300, 250, 1320, 500, n, n - 1);
    },
    produksi_alat(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TAHAP 2 · PRODUKSI: HP SUDAH CUKUP");
      Kt.recPhone(ctx, 420, 530, 280, 440, { rec: l > 1, time: "00:" + String(Math.floor(l) % 60).padStart(2, "0"), subject: (ctx, sc) => { Kt.bins(ctx, sc.x + sc.w / 2, sc.y + sc.h / 2 - 20, 30, { label: false }); } });
      Kt.stand(ctx, 420, 770, 50);
      const tips = [["cahaya dari depan", (x, y) => { Kt.light(ctx, x, y, 60, { t: l }); kid(ctx, x + 130, y + 10, 70); }, "bukan dari belakang: wajah jadi gelap"], ["suara jelas", (x, y) => Kt.mic(ctx, x + 60, y, 60, { waves: true }), "tempat sepi, dekat dengan sumber suara"], ["gambar stabil", (x, y) => { D.phone(ctx, x + 60, y, 60, 100); Kt.stand(ctx, x + 60, y + 60, 26); }, "sandarkan HP atau pakai tumpuan"]];
      const n = reveal(l, 3.0, 2.0, 3);
      tips.forEach(([t, d, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 290 + i * 150; card(ctx, 700, y, 1000, 130, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 5, r: 16 }); d(760, y + 65); text(ctx, (i + 1) + ". " + t, 960, y + 58, 30, { weight: 900 }); text(ctx, s, 960, y + 96, 22, { weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    produksi_sunting(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SUNTING: POTONG, TAMBAH TEKS, PAKAI ASET YANG BOLEH", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      Kt.editor(ctx, 260, 250, 1400, 460, [{ w: 150, label: "kait" }, { w: 110, label: "salah ucap", cut: n >= 1 }, { w: 170, label: "masalah" }, { w: 220, label: "tiga langkah" }, { w: 130, label: "ajakan" }], { text: n >= 2 ? "PILAH JADI TIGA" : null, music: n >= 3 ? "musik bebas lisensi (sumber dicantumkan)" : "lagu populer dari internet", musicBad: n < 3, assets: n >= 3 ? [["musik buatan sendiri", true], ["gambar berlisensi bebas", true], ["foto hasil pencarian tanpa izin", false], ["lagu populer tanpa izin", false]] : [] });
      if (n >= 4) label(ctx, "karya orang lain ada pemiliknya: minta izin atau pakai yang bebas", 960, 755, { size: 26 });
    },

    cek_tayang(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SEBELUM TAYANG: PERIKSA EMPAT HAL");
      const n = reveal(l, 1.5, 2.3, 4);
      Kt.checklist(ctx, 300, 280, 1000, [["Faktanya benar? Angka dan nama sudah dicek.", n > 0], ["Orang yang tampil sudah mengizinkan?", n > 1], ["Tidak ada data pribadi yang bocor: nama lengkap, alamat, nomor HP.", n > 2], ["Bahasanya sopan dan jelas?", n > 3]], { n, rowH: 108 });
      kiko(ctx, 1560, 560, 180, 0, { mood: n >= 4 ? "happy" : "flat" });
      if (n >= 4) label(ctx, "empat centang, baru tayang", 1560, 740, { size: 26, color: C.good });
    },
    judul_jujur(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "JUDUL DAN SAMPUL YANG JUJUR", 215);
      const n = reveal(l, 1.0, 3.5, 2);
      if (n >= 1) Kt.thumb(ctx, 240, 260, 640, 400, "RAHASIA yang tidak ingin kamu tahu!!!", { bait: true });
      if (n >= 2) Kt.thumb(ctx, 1040, 260, 640, 400, "Tiga Langkah Memilah Sampah di Kantin", {});
      if (n >= 1) text(ctx, "menipu, merusak kepercayaan", 560, 700, 24, { align: "center", weight: 900, color: C.bad });
      if (n >= 2) text(ctx, "menyebut isinya, penonton tepat", 1360, 700, 24, { align: "center", weight: 900, color: C.good });
      if (l > 9) label(ctx, "judul jujur mendatangkan penonton yang memang membutuhkannya", 960, 760, { size: 26 });
    },
    saluran(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TAHAP 3 · DISEMINASI: SALURAN SESUAI PENONTON");
      const ch = [["💬", "Grup kelas", "teman sekelas"], ["📋", "Mading digital / kanal sekolah", "seluruh warga sekolah"], ["🏫", "Akun resmi sekolah", "umum, di luar sekolah"]];
      const n = reveal(l, 2.0, 2.0, 3);
      ch.forEach(([ic, t, a], i) => Kt.channel(ctx, 220 + i * 500, 280, 460, 260, ic, t, a, { dim: i >= n, on: i === n - 1 }));
      if (l > 9) { card(ctx, 340, 590, 1240, 110, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 }); text(ctx, "✕ akun pribadimu", 500, 655, 30, { weight: 900, color: C.bad }); text(ctx, "✓ akun kelas atau akun sekolah: pesan sampai, datamu aman", 800, 655, 24, { weight: 800, color: C.ink }); }
    },
    tanggapi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SETELAH TAYANG: BACA, BALAS, RALAT, UKUR");
      const msgs = [{ who: "Rani", text: "Videonya jelas! Adikku langsung paham.", mood: "happy" }, { who: "Bayu", text: "Eh, angka 40 kg per hari itu salah, data sekolah bilang 25 kg." }, { who: "Aku", text: "Terima kasih, Bayu! Betul, kami ralat: 25 kg per hari. Sudah kami tulis di keterangan video.", tone: "good" }];
      Em.chat(ctx, 220, 280, 820, 440, "Komentar video", msgs, { n: reveal(l, 1.0, 2.6, 3) });
      const n = reveal(l, 8.5, 1.5, 2);
      [["👀", "120 kali ditonton"], ["✅", "pesannya sampai? tanya tiga penonton"]].forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1100, 300 + i * 150, 600, 120, { fill: C.bg2, r: 16 }); text(ctx, ic, 1160, 375 + i * 150, 44, { align: "center" }); para(ctx, t, 1210, 360 + i * 150, 26, 470, { weight: 900 }); ctx.restore(); });
      if (n >= 2) label(ctx, "ralat yang jujur menambah kepercayaan", 1400, 640, { size: 26, color: C.good });
    },
    tanggung_jawab(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "KONTEN YANG KAMU SEBARKAN JADI JEJAK DIGITAL");
      // pohon sebaran
      const pts = [[400, 330], [300, 460], [500, 460], [240, 590], [360, 590], [460, 590], [560, 590]];
      pts.forEach(([x, y], i) => { if (i > 0) { const p = pts[Math.floor((i - 1) / 2)]; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(x, y); ctx.stroke(); } ctx.fillStyle = i === 0 ? C.kiko : "#7B8B95"; ctx.beginPath(); ctx.arc(x, y, i === 0 ? 34 : 24, 0, Math.PI * 2); ctx.fill(); });
      text(ctx, "dibagikan ulang siapa saja", 400, 670, 22, { align: "center", weight: 800, color: C.ink2 });
      const dont = [["🖼️", "menyebarkan karya orang lain tanpa izin"], ["✂️", "memotong video sehingga maknanya berubah"], ["❓", "menyebarkan yang belum kamu periksa"]];
      const n = reveal(l, 3.5, 1.8, 3);
      dont.forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 290 + i * 135; card(ctx, 720, y, 980, 115, { fill: C.badBg, stroke: C.bad, lw: 3, r: 16 }); text(ctx, "✕", 770, y + 75, 40, { align: "center", weight: 900, color: C.bad }); text(ctx, ic, 830, y + 72, 36, { align: "center" }); para(ctx, t, 880, y + 50, 26, 800, { weight: 900 }); ctx.restore(); });
      if (n >= 3) label(ctx, "penyebar ikut bertanggung jawab", 1210, 740, { size: 26, color: C.bad });
    },
    label_karya(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TANDAI KARYAMU, SEBUT SUMBERMU", 215);
      const n = reveal(l, 1.2, 1.6, 6);
      Kt.credit(ctx, 460, 260, 1000, 420, [["Tiga Langkah Memilah Sampah di Kantin", true], ["Tim 9B · SMP Nusa Bangsa · 2026", true], ["Boleh dibagikan dengan menyebut sumber", false], ["Musik: buatan Dito (gitar)", false], ["Gambar: karya tim; ikon berlisensi bebas", false], ["Data: catatan petugas kebersihan sekolah, Oktober 2026", false]], { n });
      if (n >= 6) label(ctx, "penonton tahu pembuatnya, pemilik aset dihargai", 960, 740, { size: 26, color: C.good });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Rencana dan storyboard", "tiga pertanyaan, enam kotak", (x, y) => { for (let i = 0; i < 6; i++) { const fx = x - 190 + (i % 3) * 130, fy = y - 80 + Math.floor(i / 3) * 100; card(ctx, fx, fy, 118, 88, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 8 }); text(ctx, String(i + 1), fx + 12, fy + 26, 18, { weight: 900, color: C.kiko }); FRAMES[i][1](ctx, fx + 65, fy + 50, 60); } }],
        ["Daftar periksa", "siap tayang atau belum?", (x, y) => Kt.checklist(ctx, x - 200, y - 100, 400, [["fakta dicek", true], ["izin orang yang tampil", true], ["nomor HP tampil", false]], { rowH: 66 })],
        ["Saluran dan tanggapan", "pilih saluran, balas komentar", (x, y) => { [["💬", "grup kelas"], ["📋", "kanal sekolah"]].forEach(([ic, t], i) => { card(ctx, x - 200 + i * 205, y - 100, 195, 80, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, ic + " " + t, x - 102 + i * 205, y - 52, 20, { align: "center", weight: 900 }); }); card(ctx, x - 200, y, 400, 70, { fill: C.goodBg, stroke: C.good, lw: 2, r: 10 }); text(ctx, "\"Terima kasih, kami ralat.\"", x, y + 42, 20, { align: "center", weight: 900, color: C.good }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu buat satu konten sungguhan bersama kelompokmu", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
