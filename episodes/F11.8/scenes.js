/* Adegan episode F11.8: Troubleshooting dan Keamanan Lanjut Jaringan. Gaya diagram Fase F. Semua alamat dan skenario fiktif.
   Muat setelah kiko-core.js, kiko-devices.js, jaringan.js, lapisan.js, detektif.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, J = K.jaringan, Lp = K.lapisan, Dt = K.detektif, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const RULES = [["izinkan", "443", "mana saja"], ["izinkan", "22", "laptop admin (10.0.1.2)"], ["tolak", "semua", "mana saja"]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 260, 560, 160, 0, { mood: "think" });
      const n = reveal(l, 1.5, 2.2, 3);
      [["🕵️", "detektif jaringan", "uji dari bawah ke atas; pilih uji yang membelah dua penyebab"], ["🛡️", "keamanan lanjut", "firewall per port, enkripsi di jalur, VPN sebagai terowongan"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 560 + i * 560; card(ctx, x, 280, 520, 320, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 260, 380, 64, { align: "center" }); text(ctx, t, x + 260, 450, 30, { align: "center", weight: 900 }); para(ctx, s, x + 260, 500, 21, 460, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) banner(ctx, "“internetnya mati!” — dari mana mulai memeriksa?", 660, 1000);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["F11.7", "Model Jaringan dan Pengiriman Data"], ["E.3", "Keamanan Akun dan Jaringan Dasar"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_tebak_rusak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MAIN DULU: TEBAK MATA RANTAI YANG RUSAK", 215);
      const n = reveal(l, 1.5, 2.2, 5);
      const status = []; if (n >= 2) status[3] = "ok"; if (n >= 3) status[4] = "bad";
      Dt.chain(ctx, 300, 340, 1320, status, { broken: 4, reveal: n >= 4 });
      [["“Apakah ping ke router berhasil?”", "ya ✓ → kabel, IP, router sehat"], ["“Apakah ping ke internet berhasil?”", "tidak ✕ → tersangka: sambungan internet"]].forEach(([q, a], i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; card(ctx, 300 + i * 680, 470, 640, 110, { fill: C.bg2, r: 14 }); text(ctx, q, 324 + i * 680, 512, 22, { weight: 900 }); text(ctx, a, 324 + i * 680, 550, 19, { weight: 800, color: i ? C.bad : C.good }); ctx.restore(); });
      if (n >= 5) label(ctx, "uji yang tepat, lebih sedikit pertanyaan: pilih uji yang membelah dua", 960, 680, { size: 26 });
    },
    unplugged_sandi_amplop(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "TIGA KURIR YANG BOLEH MENGINTIP", 215);
      const n = reveal(l, 1.5, 2.4, 5);
      [["kelompok 1: pesan apa adanya", "“kata sandi lab: Mawar123”", "kurir membaca semuanya", true], ["kelompok 2: diacak dengan kunci", "“ndwd vdqgl odev: Pdzdu456”", "kurir hanya melihat acak", false]].forEach(([t, msg, sees, bad], i) => { ctx.save(); if (n < i + 1) ctx.globalAlpha = 0.2; const y = 280 + i * 220; text(ctx, t, 240, y, 24, { weight: 900, color: bad ? C.bad : C.good }); card(ctx, 240, y + 16, 520, 70, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 12 }); text(ctx, msg, 500, y + 60, 22, { align: "center", weight: 900 }); [0, 1, 2].forEach(k => { text(ctx, "🚶", 860 + k * 160, y + 60, 40, { align: "center" }); }); if (n >= i + 2) Dt.eye(ctx, 1480, y + 20, sees, { bad }); ctx.restore(); });
      if (n >= 5) banner(ctx, "jalur terbuka lawan jalur terenkripsi: kuncinya hanya di dua ujung", 700, 1200, { size: 28 });
    },
    rantai(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "KONEKSI ADALAH RANTAI", 215);
      const n = reveal(l, 1.5, 1.4, 9);
      const shown = Math.min(7, n); ctx.save(); Dt.chain(ctx, 300, 360, 1320, [], { broken: 5, reveal: n >= 9 }); ctx.restore();
      if (n < 7) { ctx.fillStyle = "rgba(246,248,247,0.85)"; ctx.fillRect(300 + shown * 220 - 60, 280, 1500, 200); }
      [["DNS", "menerjemahkan nama situs menjadi alamat IP"], ["router", "pintu keluar jaringan lokal ke internet"], ["alamat IP", "diberikan router lewat DHCP"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 8 && n < 9) ctx.globalAlpha = n >= 7 ? 1 : 0.2; card(ctx, 300 + i * 450, 500, 420, 90, { fill: C.bg2, r: 12 }); text(ctx, t, 324 + i * 450, 538, 22, { weight: 900, color: C.kiko }); text(ctx, s, 324 + i * 450, 568, 17, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 9) label(ctx, "satu mata rantai putus terasa seperti “internet mati”", 960, 680, { size: 26 });
    },
    bawah_ke_atas(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "PERIKSA DARI BAWAH KE ATAS, JANGAN LOMPAT", 215);
      const n = reveal(l, 1.5, 1.7, 7);
      const steps = [["1", "lampu kabel / sinyal Wi-Fi", "menyala? tersambung?"], ["2", "ipconfig", "dapat IP? bukan 169.254.x.x?"], ["3", "ping router", "10.0.3.1 menjawab?"], ["4", "ping alamat internet", "misalnya 203.0.113.1"], ["5", "nslookup situs", "nama → alamat?"], ["6", "aplikasi / browser", "baru periksa aplikasinya"]];
      steps.forEach(([no, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 620 - i * 60; card(ctx, 240 + i * 40, y, 760 - i * 40, 52, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 10 }); text(ctx, no + ". " + t, 264 + i * 40, y + 34, 21, { weight: 900 }); ctx.restore(); });
      Dt.terminal(ctx, 1060, 280, 620, [["ipconfig", "cmd"], ["IPv4: 10.0.3.5", n >= 2 ? "ok" : "out"], ["Gateway: 10.0.3.1", "out"], ["ping 10.0.3.1", "cmd"], ["balasan 2 ms, 0% hilang", n >= 3 ? "ok" : "out"], ["ping 203.0.113.1", "cmd"], ["waktu habis, 100% hilang", n >= 4 ? "err" : "out"]], { n: n >= 4 ? 7 : n >= 3 ? 5 : n >= 2 ? 3 : 0 });
      if (n >= 7) label(ctx, "berhenti di langkah yang gagal: itu tersangkamu", 1370, 620, { size: 24 });
    },
    belah_dua(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "PILIH UJI YANG MEMBELAH DUA", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      const status = []; if (n >= 2) { [1, 2, 3, 4].forEach(i => status[i] = "ok"); }
      Dt.chain(ctx, 300, 340, 1320, status, { broken: 5, reveal: n >= 4 });
      if (n >= 1) { card(ctx, 300, 460, 640, 90, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "ping 203.0.113.1 → berhasil", 620, 500, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "situs tetap tidak terbuka", 620, 532, 18, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 3) { card(ctx, 980, 460, 640, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "empat tersangka dihapus sekaligus", 1300, 500, 24, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "tersisa: DNS atau aplikasi", 1300, 532, 18, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 5) Dt.terminal(ctx, 300, 580, 640, [["nslookup sekolahku.example", "cmd"], ["server tidak menjawab", "err"]], {});
      if (n >= 6) label(ctx, "satu uji, empat tersangka gugur", 1300, 650, { size: 28 });
    },
    alat(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "EMPAT ALAT DETEKTIF", 215);
      const n = reveal(l, 1.5, 2.6, 4);
      [["ping", [["ping 10.0.3.1", "cmd"], ["balasan 2 ms, 0% hilang", "ok"]], "tujuan menjawab? berapa ms? berapa % hilang?"], ["ipconfig / ifconfig", [["ipconfig", "cmd"], ["IPv4 10.0.3.5 · gateway 10.0.3.1 · DNS 10.0.3.1", "out"]], "alamat IP, gateway, DNS"], ["traceroute", [["traceroute 203.0.113.1", "cmd"], ["1 10.0.3.1 · 2 * * * (berhenti)", "err"]], "di router mana paket berhenti"], ["nslookup", [["nslookup sekolahku.example", "cmd"], ["alamat: 203.0.113.40", "ok"]], "nama bisa diterjemahkan?"]].forEach(([t, lines, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 240 + (i % 2) * 740, y = 270 + Math.floor(i / 2) * 230; text(ctx, t, x, y, 24, { weight: 900, color: i === n - 1 ? C.accentDark : C.kiko }); Dt.terminal(ctx, x, y + 12, 700, lines, { title: t.toUpperCase() }); text(ctx, s, x, y + 150, 18, { weight: 800, color: C.ink2 }); ctx.restore(); });
    },
    firewall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "FIREWALL: SATPAM DI PINTU JARINGAN", 215);
      const n = reveal(l, 1.5, 1.8, 7);
      J.cloud(ctx, 330, 420, 70, "internet", { size: 22 }); card(ctx, 560, 300, 160, 260, { fill: "#2F3B45", r: 14 }); text(ctx, "🛡️", 640, 400, 54, { align: "center" }); text(ctx, "FIREWALL", 640, 450, 20, { align: "center", weight: 900, color: "#fff" }); J.cable(ctx, [[420, 420], [560, 420]], { color: "#B7C4CC" }); J.cable(ctx, [[720, 420], [860, 420]], { color: "#B7C4CC" }); J.laptop(ctx, 940, 430, 120); text(ctx, "jaringan sekolah", 940, 520, 18, { align: "center", weight: 800, color: C.ink2 });
      Dt.firewall(ctx, 1080, 290, 600, RULES, { n: Math.min(3, Math.max(0, n - 1)), hit: n >= 5 ? (n >= 6 ? 2 : 0) : null });
      if (n >= 5) Dt.packetCard(ctx, 240, 600, n >= 6 ? "3389" : "443", "mana saja", n >= 6 ? "tolak" : "izinkan");
      if (n >= 7) label(ctx, "yang tidak ada di daftar: tolak", 1380, 560, { size: 26 });
    },
    aturan_firewall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ATURAN DIBACA DARI ATAS: YANG PERTAMA COCOK DIPAKAI", 215);
      const n = reveal(l, 1.5, 1.8, 7);
      const pk = [["443", "HP tamu (10.0.9.7)", 0, "izinkan"], ["22", "laptop admin (10.0.1.2)", 1, "izinkan"], ["22", "HP tamu (10.0.9.7)", 2, "tolak"]]; const k = clamp(n - 2, 0, 3); const cur = k > 0 ? pk[k - 1] : null;
      Dt.firewall(ctx, 240, 280, 900, RULES, { hit: cur ? cur[2] : null });
      pk.forEach((p, i) => { ctx.save(); if (i >= k) ctx.globalAlpha = 0.2; Dt.packetCard(ctx, 1200, 280 + i * 120, p[0], p[1], i < k ? p[3] : null); ctx.restore(); });
      if (n >= 6) { card(ctx, 240, 520, 820, 100, { fill: C.bg2, r: 12 }); text(ctx, "firewall ada di router sekolah dan di laptopmu sendiri", 650, 560, 22, { align: "center", weight: 900 }); text(ctx, "port terbuka tanpa alasan = pintu yang lupa dikunci", 650, 595, 20, { align: "center", weight: 800, color: C.bad }); }
      if (n >= 7) label(ctx, "firewall tidak bertanya: ia memutuskan dari daftar", 960, 700, { size: 26 });
    },
    enkripsi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ENKRIPSI DI JALUR: HTTPS DAN WPA", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      J.laptop(ctx, 340, 440, 160); text(ctx, "browser", 340, 530, 20, { align: "center", weight: 800, color: C.ink2 }); J.server(ctx, 1560, 430, 140, 200, { label: "server HTTPS" });
      J.cable(ctx, [[430, 440], [1490, 440]], { color: "#B7C4CC" });
      if (n >= 2) { Dt.lock(ctx, 560, 440, 40, true); Dt.lock(ctx, 1340, 440, 40, true); text(ctx, "TLS: diacak di sini", 560, 500, 18, { align: "center", weight: 900, color: C.good }); text(ctx, "dibuka di sini", 1340, 500, 18, { align: "center", weight: 900, color: C.good }); }
      if (n >= 3) { ["x7Q#k9…", "p2!mZ4…", "Lw8$vR…"].forEach((s, i) => text(ctx, s, 760 + i * 160, 420, 20, { align: "center", weight: 900, color: C.ink2 })); Dt.eye(ctx, 960, 300, "penyadap: hanya huruf acak", {}); }
      if (n >= 4) { card(ctx, 240, 580, 680, 110, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "🔒 gembok di browser = HTTPS", 580, 625, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "isi terenkripsi; tujuan tetap terlihat", 580, 660, 18, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 5) { card(ctx, 1000, 580, 680, 110, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "📶 WPA2 / WPA3 di Wi-Fi", 1340, 625, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "gelombang udara diacak dengan sandi Wi-Fi", 1340, 660, 18, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 6) label(ctx, "dua kunci: gembok browser dan sandi Wi-Fi yang kuat", 960, 745, { size: 24 });
    },
    vpn(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "VPN: TEROWONGAN, BUKAN JUBAH GAIB", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      J.phoneSmall(ctx, 300, 440, 120); text(ctx, "HP-mu di Wi-Fi kafe", 300, 530, 18, { align: "center", weight: 800, color: C.ink2 });
      J.router(ctx, 640, 440, 60, { label: "Wi-Fi kafe" }); J.server(ctx, 1120, 430, 120, 170, { label: "server VPN" }); J.server(ctx, 1600, 430, 120, 170, { label: "situs tujuan" });
      J.cable(ctx, [[1180, 440], [1540, 440]], { color: "#B7C4CC" });
      if (n >= 2) Dt.tunnel(ctx, 360, 1060, 440, { u: (l % 2) / 2, label: "terowongan terenkripsi" });
      if (n >= 3) Dt.eye(ctx, 640, 300, "pemilik Wi-Fi: hanya terowongan", {});
      if (n >= 4) { card(ctx, 240, 580, 680, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "penyedia VPN melihat lalu lintasmu", 580, 625, 22, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "pilih yang terpercaya; sekolah sering menyediakannya", 580, 660, 17, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 5) { card(ctx, 1000, 580, 680, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "situs tetap mengenali akunmu", 1340, 625, 22, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "VPN menyembunyikan jalur, bukan identitas login", 1340, 660, 17, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 6) label(ctx, "di Wi-Fi publik: VPN, HTTPS, dan jangan masuk akun penting", 960, 745, { size: 24 });
    },
    daftar_periksa(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "DAFTAR PERIKSA JARINGAN SEKOLAH", 215);
      const n = reveal(l, 1.5, 1.7, 8);
      Dt.checklist(ctx, 240, 270, 820, [["ganti kata sandi bawaan router", "admin/admin → sandi kuat"], ["perbarui firmware", "tambal celah"], ["WPA3 atau WPA2", "bukan WEP / terbuka"], ["pisahkan jaringan tamu dari lab", "VLAN / SSID tamu"], ["tutup port yang tak dipakai", "firewall"], ["aktifkan log", "buku tamu"], ["simpan catatan konfigurasi", "untuk admin berikutnya"]], Math.min(7, n), { rh: 62 });
      if (n >= 2) { const rows = [["kata sandi admin", "diganti", n >= 2], ["firmware", "terbaru", n >= 3], ["enkripsi Wi-Fi", "WPA3", n >= 4], ["jaringan tamu", "terpisah", n >= 5], ["port terbuka", "443 saja", n >= 6], ["log", "aktif", n >= 7]]; card(ctx, 1120, 280, 560, 60 + rows.length * 56, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); text(ctx, "Pengaturan router · 10.0.3.1", 1140, 318, 18, { weight: 900, color: C.ink2 }); rows.forEach(([lab, val, ok], i) => { const ry = 350 + i * 56; ctx.fillStyle = ok ? C.good : "#B7C4CC"; ctx.beginPath(); ctx.arc(1150, ry + 10, 10, 0, Math.PI * 2); ctx.fill(); text(ctx, lab, 1175, ry + 17, 19, { weight: 900 }); text(ctx, ok ? val : "…", 1660, ry + 17, 18, { align: "right", weight: 800, color: ok ? C.good : C.ink2 }); }); }
      if (n >= 8) label(ctx, "keamanan adalah kebiasaan, bukan sekali pasang", 960, 745, { size: 26 });
    },
    log(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LOG ROUTER: BUKU TAMU JARINGAN", 215);
      const n = reveal(l, 1.5, 1.6, 8);
      Dt.log(ctx, 240, 270, 1000, [["03/11 07:02  10.0.3.5  → 203.0.113.40:443  izinkan", false], ["03/11 07:03  10.0.3.7  → 203.0.113.40:443  izinkan", false], ["03/11 07:05  10.0.9.7  → 10.0.3.1:22      TOLAK", true], ["03/11 07:05  10.0.9.7  → 10.0.3.1:22      TOLAK", true], ["03/11 07:05  10.0.9.7  → 10.0.3.1:22      TOLAK", true], ["03/11 07:06  10.0.3.5  → 10.0.3.1:53       izinkan", false]], Math.min(6, n));
      if (n >= 5) { card(ctx, 1280, 280, 400, 160, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "⚠ pola mencurigakan", 1480, 325, 22, { align: "center", weight: 900, color: C.bad }); para(ctx, "HP tamu mencoba port 22 berulang kali: firewall menolak, log mencatat", 1480, 365, 18, 360, { align: "center", weight: 800 }); }
      if (n >= 7) { card(ctx, 1280, 470, 400, 150, { fill: C.bg2, r: 14 }); para(ctx, "baca log rutin, bukan hanya saat bermasalah", 1480, 520, 22, 360, { align: "center", weight: 900 }); }
      if (n >= 8) banner(ctx, "semua uji hanya di jaringan yang kamu kelola atau diizinkan", 690, 1100, { size: 28 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Detektif jaringan", "pilih uji, persempit penyebab", (x, y) => { ctx.save(); ctx.translate(x - 230, y - 120); ctx.scale(0.5, 0.5); Dt.chain(ctx, 40, 80, 840, { 3: "ok", 4: "bad" }, { broken: 4, reveal: true }); ctx.restore(); Dt.terminal(ctx, x - 220, y + 10, 440, [["ping 10.0.3.1", "cmd"], ["balasan 2 ms", "ok"]], {}); }],
        ["Penjaga firewall", "paket mana yang lolos?", (x, y) => { ctx.save(); ctx.translate(x - 230, y - 120); ctx.scale(0.62, 0.62); Dt.firewall(ctx, 0, 0, 740, RULES, { hit: 2 }); ctx.restore(); Dt.packetCard(ctx, x - 220, y + 50, "22", "HP tamu", "tolak"); }],
        ["Audit router", "temuan → tindakan", (x, y) => Dt.checklist(ctx, x - 220, y - 110, 440, [["sandi bawaan", "ganti"], ["WEP", "→ WPA3"], ["port 3389 terbuka", "tutup"], ["log mati", "aktifkan"]], 4, { rh: 54 })]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); para(ctx, t2, x - 160, 386, 20, 380, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu ping, ipconfig, traceroute, nslookup di lab dengan izin guru", 960, 745, 24, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
