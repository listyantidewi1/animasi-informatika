/* Adegan episode D9.2: Jaringan Lokal dan Internet. Muat setelah kiko-core.js, kiko-devices.js, jaringan.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, J = K.jaringan, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  // peta perjalanan lengkap (dipakai beberapa adegan): posisi simpul
  const NODES = { hp1: [260, 560], wifi: [520, 400], router: [780, 560], isp: [1100, 400], server: [1500, 560], hp2: [260, 700] };
  const PATH_GO = [NODES.hp1, NODES.wifi, NODES.router, NODES.isp, NODES.server];
  const PATH_BACK = [NODES.server, NODES.isp, NODES.router, NODES.wifi, NODES.hp2];
  function journey(ctx, opt = {}) {
    const n = opt.n == null ? 5 : opt.n;
    J.cable(ctx, [NODES.router, NODES.isp, NODES.server], { color: "#7B8B95", lw: 8 });
    J.cable(ctx, [NODES.hp1, NODES.wifi, NODES.router], { color: "#B7C4CC", dash: true }); J.cable(ctx, [NODES.hp2, NODES.wifi], { color: "#B7C4CC", dash: true });
    const dim = (i) => { ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.2; };
    dim(0); J.phoneSmall(ctx, NODES.hp1[0], NODES.hp1[1], 110, { label: "HP Sinta" }); ctx.restore();
    dim(1); J.waves(ctx, NODES.wifi[0], NODES.wifi[1] + 30, 18, 3); text(ctx, "Wi-Fi", NODES.wifi[0], NODES.wifi[1] + 70, 22, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
    dim(2); J.router(ctx, NODES.router[0], NODES.router[1], 110, { alert: opt.alert }); ctx.restore();
    dim(3); J.cloud(ctx, NODES.isp[0], NODES.isp[1], 90, "ISP", { size: 30 }); ctx.restore();
    dim(4); J.server(ctx, NODES.server[0], NODES.server[1], 120, 200, { tick: opt.tick }); ctx.restore();
    if (opt.hp2 !== false) { J.phoneSmall(ctx, NODES.hp2[0], NODES.hp2[1], 110, { label: "HP Dito" }); }
  }

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      journey(ctx, { n: 5, tick: Math.floor(l) });
      const u = clamp(l / 7, 0, 1); const p = u < 0.5 ? J.along(PATH_GO, u * 2) : J.along(PATH_BACK, (u - 0.5) * 2); J.packet(ctx, p[0], p[1], null, { color: u < 0.5 ? C.accent : C.good });
      if (l > 7.5) banner(ctx, "pulang pergi ratusan kilometer, kurang dari sedetik", 760, 1000, { size: 30 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D7.2", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Mengenal Komputer: Perjalanan Satu Ketukan", 960, 500, 44, { align: "center", weight: 700, color: C.ink2 });
      ["Input, proses, output", "Penyimpanan", "Perangkat lunak"].forEach((s, i) => { card(ctx, 420 + i * 380, 580, 340, 120, { fill: C.bg2 }); text(ctx, s, 590 + i * 380, 652, 28, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_letter(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER: SURAT YANG DIPOTONG", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      card(ctx, 220, 300, 420, 300, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 10 }); for (let i = 0; i < 7; i++) { ctx.fillStyle = "#D7C9A0"; rr(ctx, 250, 340 + i * 32, 360 * (0.6 + ((i * 7) % 4) * 0.1), 10, 5); ctx.fill(); } text(ctx, "pesan panjang", 430, 640, 24, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 1.5, 1.2, 3);
      if (n >= 1) arrowIcon(ctx, "right", 720, 450, 50, C.ink2);
      for (let i = 0; i < n; i++) { card(ctx, 820 + i * 220, 330 + (i % 2) * 20, 180, 220, { fill: "#FFF9E0", stroke: C.accent, lw: 4, r: 10 }); text(ctx, String(i + 1), 910 + i * 220, 400 + (i % 2) * 20, 60, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "ke: meja Dito", 910 + i * 220, 500 + (i % 2) * 20, 20, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 3) { for (let i = 0; i < 3; i++) kid(ctx, 870 + i * 220, 700, 70, { hair: i % 2 ? "long" : undefined }); label(ctx, "tiga teman, tiga jalan", 1130, 800, { size: 26, color: C.ink2 }); }
    },
    unplugged_assemble(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 360, 540, 170, {}); text(ctx, "meja Dito", 360, 790, 26, { align: "center", weight: 800, color: C.ink2 });
      const order = [2, 3, 1]; const n = reveal(l, 0.8, 1.0, 3);
      order.slice(0, n).forEach((k, i) => { card(ctx, 600 + i * 160, 320, 130, 160, { fill: "#FFF9E0", stroke: C.accent, lw: 3, r: 10 }); text(ctx, String(k), 665 + i * 160, 420, 50, { align: "center", weight: 900, color: C.accentDark }); });
      if (n >= 3) text(ctx, "datang tidak urut: 2, 3, 1", 840, 530, 26, { align: "center", weight: 900, color: C.bad });
      if (l > 4.5) { arrowIcon(ctx, "right", 1120, 400, 50, C.ink2); [1, 2, 3].forEach((k, i) => { card(ctx, 1200 + i * 160, 320, 130, 160, { fill: C.goodBg, stroke: C.good, lw: 3, r: 10 }); text(ctx, String(k), 1265 + i * 160, 420, 50, { align: "center", weight: 900, color: C.good }); }); text(ctx, "disusun lagi lewat nomornya", 1440, 530, 26, { align: "center", weight: 900, color: C.good }); }
      if (l > 7.5) banner(ctx, "dipotong jadi paket, diantar lewat jalan berbeda, disusun lagi", 745, 1100, { size: 30 });
    },

    lan_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "JARINGAN LOKAL (LAN): PERANGKAT DI SATU TEMPAT", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); rr(ctx, 260, 280, 1400, 480, 30); ctx.stroke(); ctx.setLineDash([]); text(ctx, "gedung sekolah", 320, 320, 24, { weight: 800, color: C.ink2 });
      const n = reveal(l, 0.8, 0.8, 5);
      J.router(ctx, 960, 520, 120, { label: "router" });
      const dev = [[480, 430, "lab 1", (x, y) => J.laptop(ctx, x, y, 110)], [480, 650, "lab 2", (x, y) => J.laptop(ctx, x, y, 110)], [1440, 430, "printer", (x, y) => J.printer(ctx, x, y, 110)], [1440, 650, "HP guru", (x, y) => J.phoneSmall(ctx, x, y, 90)], [960, 660, "HP Sinta", (x, y) => J.phoneSmall(ctx, x, y, 90)]];
      dev.slice(0, n).forEach(([x, y, lab, draw]) => { J.cable(ctx, [[x, y], [960, 520]], { color: "#B7C4CC", dash: true }); draw(x, y); text(ctx, lab, x, y + 90, 22, { align: "center", weight: 800, color: C.ink2 }); });
      if (n >= 5) label(ctx, "saling berkirim data tanpa keluar gedung", 1300, 320, { size: 24, color: C.ink2 });
    },
    wired_wireless(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      card(ctx, 200, 240, 740, 460, { fill: C.bg2 }); text(ctx, "KABEL", 570, 300, 32, { align: "center", weight: 900, color: C.kiko });
      J.laptop(ctx, 380, 460, 140); J.cable(ctx, [[450, 480], [700, 480]], { color: C.kiko, lw: 8 }); J.router(ctx, 760, 480, 110, { label: false });
      ["✓ lebih cepat dan stabil", "✓ dipakai komputer lab", "✕ tidak bisa dibawa jalan"].forEach((s, i) => text(ctx, s, 240, 590 + i * 36, 24, { weight: 800, color: s[0] === "✓" ? C.good : C.bad }));
      if (l > 3) { card(ctx, 980, 240, 740, 460, { fill: C.bg2 }); text(ctx, "NIRKABEL (Wi-Fi)", 1350, 300, 32, { align: "center", weight: 900, color: C.accentDark }); J.phoneSmall(ctx, 1120, 470, 110); J.waves(ctx, 1350, 520, 24, 4, { color: C.accent }); J.router(ctx, 1560, 480, 110, { label: "titik akses" }); ["✓ praktis: HP, laptop", "✓ lewat gelombang radio", "✕ makin jauh makin lemah"].forEach((s, i) => text(ctx, s, 1020, 590 + i * 36, 24, { weight: 800, color: s[0] === "✓" ? C.good : C.bad })); }
      if (l > 7) banner(ctx, "dua cara, satu jaringan yang sama", 745, 800);
    },

    ip_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "ALAMAT IP: NOMOR RUMAH UNTUK PERANGKAT", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.0, 4);
      const dev = [[400, 460, "HP Sinta", "192.168.1.20", (x, y) => J.phoneSmall(ctx, x, y, 100)], [700, 460, "laptop", "192.168.1.21", (x, y) => J.laptop(ctx, x, y, 120)], [1000, 460, "printer", "192.168.1.22", (x, y) => J.printer(ctx, x, y, 120)], [1300, 460, "HP Dito", "192.168.1.23", (x, y) => J.phoneSmall(ctx, x, y, 100)]];
      dev.forEach(([x, y, lab, ip, draw], i) => { ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.2; draw(x, y); text(ctx, lab, x, y + 90, 22, { align: "center", weight: 800, color: C.ink2 }); J.ipTag(ctx, x, y + 130, ip, {}); ctx.restore(); });
      if (n >= 4) { text(ctx, "jalan yang sama: 192.168.1", 1540, 450, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "nomor rumah: 20, 21, 22, 23", 1540, 490, 24, { align: "center", weight: 900, color: C.accentDark }); }
      if (l > 6.5) label(ctx, "empat angka dipisah titik: alamat tiap perangkat", 960, 690, { size: 28 });
    },
    router_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      J.router(ctx, 760, 520, 160, { label: "router" });
      [[400, 380, "HP"], [400, 660, "laptop"], [1100, 380, "printer"]].forEach(([x, y, lab]) => { J.cable(ctx, [[x, y], [760, 520]], { color: "#B7C4CC", dash: true }); if (lab === "laptop") J.laptop(ctx, x, y, 100); else if (lab === "printer") J.printer(ctx, x, y, 100); else J.phoneSmall(ctx, x, y, 90); });
      const n = reveal(l, 1.0, 1.6, 3);
      ["membagi alamat IP", "mengatur lalu lintas data", "pintu keluar ke internet"].forEach((s, i) => { if (i < n) { card(ctx, 1220, 300 + i * 120, 480, 96, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, (i + 1) + ". " + s, 1250, 358 + i * 120, 26, { weight: 900 }); } });
      if (n >= 3) { J.cable(ctx, [[760, 560], [760, 760], [1140, 760]], { color: C.kiko, lw: 8 }); arrowIcon(ctx, "right", 1180, 760, 40, C.kiko); text(ctx, "ke luar rumah", 1300, 770, 26, { weight: 900, color: C.kiko }); }
    },

    isp_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      J.house(ctx, 340, 600, 220, 160, "rumah Sinta"); J.router(ctx, 340, 540, 80, { label: false });
      const n = reveal(l, 1.0, 1.6, 3);
      if (n >= 1) { J.cable(ctx, [[450, 540], [700, 540]], { color: C.kiko, lw: 8 }); J.tower(ctx, 700, 600, 160); text(ctx, "kabel / sinyal seluler", 560, 500, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 2) { J.cloud(ctx, 1000, 500, 110, "ISP", { size: 34 }); text(ctx, "penyedia internet", 1000, 640, 24, { align: "center", weight: 800, color: C.ink2 }); J.cable(ctx, [[720, 540], [880, 520]], { color: C.kiko, lw: 8 }); }
      if (n >= 3) { J.cable(ctx, [[1120, 520], [1400, 520]], { color: C.kiko, lw: 8 }); J.house(ctx, 1500, 600, 200, 150, "kota lain"); ctx.strokeStyle = "#5FA8D3"; ctx.lineWidth = 6; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(1000, 620); ctx.quadraticCurveTo(1250, 760, 1500, 640); ctx.stroke(); ctx.setLineDash([]); text(ctx, "kabel bawah laut ke pulau lain", 1250, 760, 22, { align: "center", weight: 800, color: "#2E7E9A" }); }
      if (l > 6.5) banner(ctx, "ISP: jaringan besar yang menyambungkan kota demi kota", 745, 1000, { size: 30 });
    },
    internet_map(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "INTERNET = JARINGAN DARI BANYAK JARINGAN", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const N = [[400, 400, "LAN rumah"], [400, 680, "LAN sekolah"], [800, 540, "ISP A"], [1150, 400, "ISP B"], [1150, 680, "pusat data"], [1500, 540, "LAN kantor"]];
      const E = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5], [0, 3]];
      const busy = l > 4 ? 2 : -1;
      E.forEach(([a, b2], i) => J.cable(ctx, [N[a].slice(0, 2), N[b2].slice(0, 2)], { color: i === busy ? C.bad : "#B7C4CC", lw: i === busy ? 10 : 6 }));
      N.forEach(([x, y, lab]) => J.cloud(ctx, x, y, 80, lab, { size: 20 }));
      if (l > 1.5) label(ctx, "tidak ada satu pusat", 960, 300, { size: 28 });
      if (l > 4) { const u = ((l - 4) % 3) / 3; const path = [N[0], N[3], N[4]].map(p => p.slice(0, 2)); const p = J.along(path, u); J.packet(ctx, p[0], p[1], null, {}); text(ctx, "jalan padat → paket lewat jalan lain", 960, 790, 26, { align: "center", weight: 900, color: C.good }); }
    },

    server_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "SERVER: KOMPUTER BESAR DI PUSAT DATA", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      for (let i = 0; i < 4; i++) J.server(ctx, 420 + i * 150, 500, 120, 300, { label: false, tick: Math.floor(l * 2) + i });
      text(ctx, "menyala 24 jam, dijaga, didinginkan", 645, 700, 24, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 1.5, 1.4, 3);
      ["menyimpan foto, pesan, halaman web", "menerima paket dari Sinta", "mengirim paket baru ke HP Dito"].forEach((s, i) => { if (i < n) { card(ctx, 1080, 300 + i * 120, 620, 96, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, (i + 1) + ". " + s, 1110, 358 + i * 120, 26, { weight: 900 }); } });
      if (n >= 3) { const u = ((l - 5) % 2) / 2; J.packet(ctx, lerp(1000, 820, u), 560, null, { color: C.good }); }
    },
    round_trip(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      journey(ctx, { n: 5, tick: Math.floor(l) });
      const u = clamp(l / 8, 0, 1); const go = u < 0.5; const p = go ? J.along(PATH_GO, u * 2) : J.along(PATH_BACK, (u - 0.5) * 2); J.packet(ctx, p[0], p[1], null, { color: go ? C.accent : C.good });
      const steps = ["HP Sinta", "Wi-Fi", "router", "ISP", "server", "ISP", "router", "Wi-Fi", "HP Dito"]; const k = Math.min(8, Math.floor(u * 8.99));
      steps.forEach((s, i) => text(ctx, s + (i < 8 ? " →" : ""), 240 + i * 170, 290, 20, { weight: i === k ? 900 : 700, color: i === k ? C.accentDark : C.ink2 }));
      if (l > 8) banner(ctx, "pulang pergi dalam sedetik, walau semeja", 745, 900);
    },

    packets(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "SATU FOTO = RIBUAN PAKET KECIL", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      ctx.fillStyle = "#DCEBF2"; rr(ctx, 220, 300, 260, 200, 10); ctx.fill(); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(400, 350, 24, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2E9E5B"; ctx.beginPath(); ctx.moveTo(224, 496); ctx.lineTo(330, 380); ctx.lineTo(476, 496); ctx.closePath(); ctx.fill(); text(ctx, "foto Sinta", 350, 540, 24, { align: "center", weight: 800, color: C.ink2 });
      arrowIcon(ctx, "right", 540, 400, 44, C.ink2);
      const n = reveal(l, 1.0, 0.5, 6);
      for (let i = 0; i < n; i++) { J.packet(ctx, 660 + i * 70, 400, i + 1, {}); }
      if (n >= 6) { text(ctx, "nomor urut + alamat tujuan", 835, 460, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (l > 4.5) { const order = [3, 1, 6, 2, 5, 4]; order.forEach((k, i) => J.packet(ctx, 1180 + i * 70, 400, k, { color: C.ink2 })); text(ctx, "tiba tidak urut", 1355, 460, 22, { align: "center", weight: 800, color: C.bad }); }
      if (l > 6.5) { for (let i = 0; i < 6; i++) J.packet(ctx, 1180 + i * 70, 560, i + 1, { color: C.good }); text(ctx, "HP penerima menyusunnya kembali", 1355, 620, 22, { align: "center", weight: 900, color: C.good }); }
      if (l > 8) banner(ctx, "paket boleh lewat jalan berbeda, hasilnya tetap utuh", 745, 1000, { size: 30 });
    },
    troubleshoot(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "INTERNET PUTUS? CEK DARI YANG TERDEKAT", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.5, 3);
      const steps = [["1. sinyal Wi-Fi di HP", "tersambung? seberapa kuat?", (x, y) => { J.phoneSmall(ctx, x, y, 90); J.waves(ctx, x + 70, y + 10, 14, 3); }], ["2. lampu router", "menyala hijau semua? ada yang merah?", (x, y) => J.router(ctx, x, y, 100, { alert: true, label: false })], ["3. sambungan ke ISP", "kabel longgar? gangguan dari ISP?", (x, y) => { J.cloud(ctx, x, y, 50, "ISP", { size: 20 }); }]];
      steps.forEach(([t, s, draw], i) => { if (i < n) { card(ctx, 200 + i * 520, 290, 480, 320, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 16 }); draw(440 + i * 520, 400); text(ctx, t, 440 + i * 520, 500, 26, { align: "center", weight: 900 }); para(ctx, s, 440 + i * 520, 545, 22, 420, { align: "center", weight: 700, color: C.ink2, lh: 1.3 }); } });
      if (n >= 3) label(ctx, "matikan dan nyalakan router: semua sambungan dimulai ulang", 960, 680, { size: 26 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Susun perjalanan pesan", "HP, Wi-Fi, router, ISP, server", (x, y) => { ["HP", "Wi-Fi", "router", "ISP", "server"].forEach((s, i) => { card(ctx, x - 210 + i * 86, y - 40, 78, 50, { fill: "#fff", stroke: "#CFDCD5", lw: 3, r: 10 }); text(ctx, s, x - 171 + i * 86, y - 8, 16, { align: "center", weight: 900 }); }); }],
        ["Simulasi paket", "tiba tidak urut, susun lagi", (x, y) => { [3, 1, 2].forEach((k, i) => J.packet(ctx, x - 80 + i * 70, y - 40, k, {})); [1, 2, 3].forEach((k, i) => J.packet(ctx, x - 80 + i * 70, y + 30, k, { color: C.good })); }],
        ["Cari yang putus", "dari gejalanya", (x, y) => { J.router(ctx, x, y - 20, 100, { alert: true, label: false }); text(ctx, "lampu merah?", x, y + 60, 22, { align: "center", weight: 900, color: C.bad }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 630, 26, { align: "center", weight: 900 }); text(ctx, t2, x, 668, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu temukan router di rumah atau sekolahmu", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
