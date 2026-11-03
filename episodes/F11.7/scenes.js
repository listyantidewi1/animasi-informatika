/* Adegan episode F11.7: Model Jaringan dan Pengiriman Data. Gaya diagram Fase F. Muat setelah kiko-core.js, kiko-devices.js, jaringan.js, lapisan.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, J = K.jaringan, Lp = K.lapisan, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const HOPS_LAN = [["HP Sinta", "📱"], ["titik akses Wi-Fi", "📶"], ["switch lab", "🔀"], ["laptop Dito", "💻"]];
  const HOPS_NET = [["HP Sinta", "📱"], ["router sekolah", "📡"], ["penyedia internet", "🏢"], ["router antarkota", "🔀"], ["router benua lain", "🔀"], ["server", "🗄️"]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 260, 560, 160, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 2.0, 4);
      [["🕸️", "topologi", "bentuk sambungan"], ["🤝", "klien–server & P2P", "peran perangkat"], ["✉️", "lapisan TCP/IP", "surat berlapis amplop"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 500 + i * 420; card(ctx, x, 280, 400, 300, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 200, 380, 64, { align: "center" }); para(ctx, t, x + 200, 450, 28, 370, { align: "center", weight: 900 }); text(ctx, s, x + 200, 520, 22, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) banner(ctx, "dari HP Sinta ke laptop Dito, lalu ke server jauh", 640, 1000);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D9.2", "Jaringan Lokal dan Internet"], ["E.3", "Keamanan Akun dan Jaringan Dasar"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_amplop(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MAIN DULU: SURAT BERLAPIS AMPLOP", 215);
      const n = reveal(l, 1.5, 1.9, 6);
      Lp.envelope(ctx, 560, 500, clamp(n - 1, 0, 3));
      [["pesan", "isi surat", Lp.LAYERS[0][2]], ["amplop kecil: nama aplikasi", "untuk aplikasi Chat", Lp.LAYERS[0][2]], ["amplop sedang: nomor pintu", "port 8080", Lp.LAYERS[1][2]], ["amplop besar: alamat rumah", "alamat IP", Lp.LAYERS[2][2]], ["tas kurir: jalur", "kabel atau Wi-Fi", Lp.LAYERS[3][2]]].forEach(([t, s, col], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1000, 270 + i * 84, 680, 72, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 12 }); ctx.fillStyle = col; rr(ctx, 1000, 270 + i * 84, 12, 72, 6); ctx.fill(); text(ctx, t, 1030, 300 + i * 84, 22, { weight: 900 }); text(ctx, s, 1030, 328 + i * 84, 17, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 6) label(ctx, "penerima membuka lapis demi lapis: enkapsulasi", 960, 720, { size: 26 });
    },
    unplugged_benang(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "TOPOLOGI DENGAN BENANG: GUNTING SATU, SIAPA TERPUTUS?", 215);
      const n = reveal(l, 1.5, 2.4, 5);
      Lp.topo(ctx, 520, 480, "star", { cut: n >= 3 ? 1 : null, label: "bintang: satu di tengah", scale: 1.1 });
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.25; Lp.topo(ctx, 1380, 480, "mesh", { cut: n >= 4 ? 0 : null, label: "mesh: semua saling terhubung", scale: 1.1 }); ctx.restore();
      if (n >= 5) label(ctx, "bintang: satu murid terputus; mesh: tidak ada yang terputus", 960, 720, { size: 26 });
    },
    topologi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "TOPOLOGI: BENTUK SAMBUNGAN", 215);
      const n = reveal(l, 1.5, 2.6, 4);
      [["bus", "bus · satu kabel bersama", "murah; putus satu, putus semua", 1], ["star", "bintang · semua ke satu switch", "mudah dikelola; switch mati, semua mati", 1], ["mesh", "mesh · saling terhubung", "tahan putus; mahal", 2]].forEach(([k, t, s, cut], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const cx = 440 + i * 520; card(ctx, cx - 250, 270, 500, 420, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 16 }); Lp.topo(ctx, cx, 440, k, { cut: n >= 4 ? cut : null, scale: 0.75 }); text(ctx, t, cx, 580, 22, { align: "center", weight: 900 }); para(ctx, s, cx, 615, 18, 460, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) label(ctx, "✂ satu kabel putus: lihat siapa yang ✕", 960, 735, { size: 24 });
    },
    pohon_sekolah(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "JARINGAN SEKOLAH: POHON DARI LAB-LAB BINTANG", 215);
      const n = reveal(l, 1.5, 2.4, 5);
      J.cloud(ctx, 960, 290, 60, "ISP", { size: 20 });
      J.cable(ctx, [[960, 330], [960, 380]]); J.router(ctx, 960, 400, 60, { label: "router sekolah" });
      J.cable(ctx, [[960, 420], [960, 470]]); card(ctx, 880, 470, 160, 44, { fill: "#2F3B45", r: 8 }); text(ctx, "switch gedung", 960, 498, 16, { align: "center", weight: 900, color: "#fff" });
      ["Lab 1", "Lab 2", "Perpustakaan", "Ruang guru"].forEach((lab, i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; const cx = 420 + i * 360; J.cable(ctx, [[960, 514], [cx, 560], [cx, 590]]); card(ctx, cx - 70, 590, 140, 40, { fill: "#4A5A66", r: 8 }); text(ctx, "switch " + lab, cx, 616, 14, { align: "center", weight: 900, color: "#fff" }); [-100, -33, 33, 100].forEach(dx => { J.cable(ctx, [[cx, 630], [cx + dx, 670]]); J.laptop(ctx, cx + dx, 700, 44); }); ctx.restore(); });
      if (n >= 5) label(ctx, "bertingkat: gangguan di satu lab tidak menjalar", 960, 770, { size: 24 });
    },
    klien_server(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "KLIEN MEMINTA, SERVER MELAYANI", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      J.server(ctx, 1300, 440, 160, 220, { label: "server web", tick: Math.floor(l * 3) });
      [[400, 340, "📱 HP-mu"], [400, 500, "💻 laptop Dito"], [400, 660, "📱 HP Sinta"]].forEach(([x, y, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, x - 120, y - 30, 260, 60, { fill: "#fff", stroke: C.kiko, lw: 3, r: 12 }); text(ctx, t, x + 10, y + 9, 22, { align: "center", weight: 900 }); J.cable(ctx, [[x + 140, y], [1220, 440]], { color: "#B7C4CC" }); ctx.restore(); });
      if (n >= 2) { J.packet(ctx, 700, 395, 1, { color: C.accent }); text(ctx, "minta: GET /jadwal", 700, 360, 18, { align: "center", weight: 900, color: C.accentDark }); }
      if (n >= 3) { J.packet(ctx, 980, 405, 1, { color: C.good }); text(ctx, "layani: halaman jadwal", 980, 460, 18, { align: "center", weight: 900, color: C.good }); }
      if (n >= 4) { card(ctx, 1500, 320, 200, 250, { fill: C.bg2, r: 12 }); ["web", "email", "gim daring", "streaming"].forEach((s, i) => text(ctx, "• " + s, 1520, 360 + i * 44, 20, { weight: 800 })); }
      if (n >= 5) { card(ctx, 240, 740, 1440, 0, {}); label(ctx, "terpusat, mudah dikelola", 500, 760, { size: 22, color: C.good }); label(ctx, "server padam: semua klien terhenti", 1300, 760, { size: 22, color: C.bad }); }
    },
    p2p(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "PEER-TO-PEER: SEMUA SETARA", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      const P = [[560, 330], [1360, 330], [560, 620], [1360, 620], [960, 475]];
      [[0, 1], [0, 2], [1, 3], [2, 3], [0, 4], [1, 4], [2, 4], [3, 4]].forEach(([a, b2]) => J.cable(ctx, [P[a], P[b2]], { color: "#B7C4CC" }));
      P.forEach(([x, y], i) => { card(ctx, x - 90, y - 30, 180, 60, { fill: "#fff", stroke: C.kiko, lw: 3, r: 12 }); text(ctx, ["📱 HP A", "💻 laptop B", "📱 HP C", "💻 laptop D", "📱 HP E"][i], x, y + 9, 20, { align: "center", weight: 900 }); });
      if (n >= 2) { const u = (l % 2) / 2; const [px, py] = J.along([P[0], P[4]], u); J.packet(ctx, px, py - 40, 1, { color: C.accent }); const [qx, qy] = J.along([P[3], P[1]], u); J.packet(ctx, qx, qy - 40, 1, { color: C.good }); }
      if (n >= 3) { card(ctx, 240, 700, 560, 60, { fill: C.goodBg, stroke: C.good, lw: 2, r: 10 }); text(ctx, "✓ tahan: tidak ada pusat yang bisa padam", 520, 738, 20, { align: "center", weight: 900, color: C.good }); }
      if (n >= 4) { card(ctx, 1120, 700, 560, 60, { fill: C.badBg, stroke: C.bad, lw: 2, r: 10 }); text(ctx, "✕ sulit dikendalikan dan diamankan", 1400, 738, 20, { align: "center", weight: 900, color: C.bad }); }
      if (n >= 5) label(ctx, "berbagi file langsung · panggilan video langsung", 960, 280, { size: 22, color: C.ink2 });
    },
    lapisan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "EMPAT LAPISAN TCP/IP", 215);
      const n = reveal(l, 1.5, 2.2, 5);
      Lp.stack(ctx, 240, 270, 700, Math.min(4, n), { active: Math.min(3, n - 1) });
      const ex = [["HTTP: GET /foto.jpg", "pesan dan aturannya"], ["segmen no. 1, 2, 3… → port 8080", "pecah, beri nomor, tandai aplikasi"], ["dari 10.0.3.5 ke 10.0.3.12", "alamat dan jalur"], ["sinyal Wi-Fi / listrik di kabel", "bit menjadi gelombang"]];
      ex.forEach(([t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1000, 270 + i * 90, 680, 80, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, t, 1024, 305 + i * 90, 22, { weight: 900, color: Lp.LAYERS[i][2] }); text(ctx, s, 1024, 334 + i * 90, 17, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 5) label(ctx, "tiap lapisan hanya mengurus urusannya", 960, 690, { size: 26 });
    },
    enkapsulasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ENKAPSULASI: DIBUNGKUS TURUN, DIBUKA NAIK", 215);
      const n = reveal(l, 1.5, 1.6, 8);
      const k = n <= 4 ? clamp(n - 1, 0, 3) : clamp(8 - n, 0, 3);
      text(ctx, n <= 4 ? "pengirim: turun, tiap lapisan menambah header" : "penerima: naik, tiap header dibuka", 960, 290, 26, { align: "center", weight: 900, color: n <= 4 ? C.kiko : C.good });
      Lp.packet(ctx, 520, 340, k, { hw: 160, dw: 420, h: 70 });
      Lp.LAYERS.forEach(([nm, s, col], i) => { const on = n <= 4 ? i === n - 1 : i === 8 - n; ctx.save(); if (!on) ctx.globalAlpha = 0.45; card(ctx, 240 + i * 370, 460, 340, 110, { fill: on ? "#FFF3D6" : "#fff", stroke: col, lw: on ? 6 : 3, r: 12 }); text(ctx, nm, 410 + i * 370, 500, 24, { align: "center", weight: 900, color: col }); text(ctx, ["isi pesan", "+ port, nomor urut", "+ alamat IP", "+ alamat MAC"][i], 410 + i * 370, 540, 18, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      arrowIcon(ctx, n <= 4 ? "right" : "left", 960, 620, 44, C.accent);
      if (n >= 8) label(ctx, "amplop tidak perlu tahu isi surat: tiap lapisan mandiri", 960, 700, { size: 26 });
    },
    paket_lokal(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "PERJALANAN DI JARINGAN LOKAL", 215);
      const n = reveal(l, 1.5, 1.4, 9);
      Lp.hops(ctx, 320, 380, 1280, HOPS_LAN, n >= 2 ? clamp((n - 2) * 0.6, 0, 3) : null);
      [["alamat MAC", "switch meneruskan ke kartu jaringan laptop Dito", Lp.LAYERS[3][2]], ["alamat IP lokal 10.0.3.12", "menunjuk laptop Dito di jaringan sekolah", Lp.LAYERS[2][2]], ["port 8080", "menunjuk aplikasi penerima di laptop itu", Lp.LAYERS[1][2]]].forEach(([t, s, col], i) => { ctx.save(); if (n < i + 5) ctx.globalAlpha = 0.2; card(ctx, 240 + i * 490, 520, 460, 110, { fill: n === i + 5 ? "#FFF3D6" : C.bg2, stroke: col, lw: 3, r: 12 }); text(ctx, t, 264 + i * 490, 560, 22, { weight: 900, color: col }); para(ctx, s, 264 + i * 490, 592, 17, 420, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 9) label(ctx, "foto dipecah menjadi paket-paket bernomor", 960, 700, { size: 26 });
    },
    paket_internet(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "KE INTERNET: LOMPAT DARI ROUTER KE ROUTER", 215);
      const n = reveal(l, 1.5, 1.4, 10);
      Lp.hops(ctx, 280, 380, 1360, HOPS_NET, n >= 2 ? clamp((n - 2) * 0.8, 0, 5) : null);
      if (n >= 3) { card(ctx, 420, 470, 420, 70, { fill: "#FFF3D6", stroke: C.accent, lw: 2, r: 10 }); text(ctx, "NAT: 10.0.3.5 → alamat publik sekolah", 630, 513, 18, { align: "center", weight: 900, color: C.accentDark }); }
      if (n >= 7) { card(ctx, 240, 580, 700, 130, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "paket no. 3 hilang di tengah jalan", 590, 625, 22, { align: "center", weight: 900, color: C.bad }); text(ctx, "tidak ada tanda terima untuk no. 3", 590, 660, 18, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 8) { arrowIcon(ctx, "right", 970, 645, 40, C.good); card(ctx, 1020, 580, 660, 130, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "TCP mengirim ulang no. 3", 1350, 625, 22, { align: "center", weight: 900, color: C.good }); text(ctx, "aplikasi tidak perlu tahu", 1350, 660, 18, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 10) label(ctx, "ping: bolak-balik berapa ms · traceroute: lewat router mana saja", 960, 745, { size: 22 });
    },
    praktik_kirim(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "KIRIM DATA SUNGGUHAN: DUA LAPTOP, SATU WI-FI", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      J.laptop(ctx, 400, 460, 180); J.ipTag(ctx, 400, 580, "10.0.3.5", { w: 160 }); J.laptop(ctx, 1520, 460, 180); J.ipTag(ctx, 1520, 580, "10.0.3.12", { w: 160 }); J.router(ctx, 960, 300, 70, { label: "titik akses Wi-Fi" }); J.waves(ctx, 960, 300, 40, 3, { alpha: 0.4 });
      [["1. lihat alamat IP", "ipconfig / ifconfig"], ["2. ping 10.0.3.12", "balasan: 4 ms, 0% hilang"], ["3. jalankan server kecil", "python -m http.server 8000"], ["4. teman membuka di browser", "http://10.0.3.5:8000"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; card(ctx, 620, 380 + i * 80, 680, 68, { fill: n === i + 2 ? "#FFF3D6" : "#1F2A33", stroke: n === i + 2 ? C.accent : undefined, lw: 3, r: 10 }); text(ctx, t, 644, 408 + i * 80, 20, { weight: 900, color: n === i + 2 ? C.ink : "#8FD0E6" }); text(ctx, s, 644, 434 + i * 80, 17, { weight: 800, color: n === i + 2 ? C.ink2 : "#fff" }); ctx.restore(); });
      if (n >= 6) label(ctx, "klien–server buatanmu sendiri", 960, 740, { size: 26 });
    },
    aturan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ATURAN MAIN DI JARINGAN", 215);
      const n = reveal(l, 1.5, 2.6, 4);
      [["✅", "hanya jaringan yang diizinkan guru", "lab atau hotspot kelas, bukan jaringan orang lain"], ["🚫", "tidak memindai atau menyadap", "perangkat orang lain bukan bahan percobaan"], ["🔌", "matikan server setelah selesai", "pintu yang terbuka adalah tanggung jawabmu"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 240 + i * 490; card(ctx, x, 280, 460, 320, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 230, 370, 60, { align: "center" }); para(ctx, t, x + 230, 435, 24, 420, { align: "center", weight: 900 }); para(ctx, s, x + 230, 510, 19, 420, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) banner(ctx, "memahami jaringan adalah tanggung jawab; keamanannya di episode berikutnya", 650, 1300, { size: 26 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pembungkus paket", "susun header tiap lapisan", (x, y) => { ctx.save(); ctx.translate(x - 230, y - 100); ctx.scale(0.6, 0.6); Lp.packet(ctx, 0, 0, 3, { hw: 150, dw: 300, h: 70 }); ctx.restore(); Lp.stack(ctx, x - 220, y - 20, 440, 4, { h: 36 }); }],
        ["Penghubung topologi", "pilih bentuk, putuskan kabel", (x, y) => Lp.topo(ctx, x, y - 20, "star", { cut: 2, scale: 0.6 })],
        ["Pelacak lompatan", "ikuti paket dari HP ke server", (x, y) => Lp.hops(ctx, x - 200, y - 40, 400, [["HP", "📱"], ["router", "📡"], ["ISP", "🏢"], ["server", "🗄️"]], 1.5)]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); para(ctx, t2, x - 160, 386, 20, 400, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu ping dan server web kecil di lab", 960, 820, 26, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
