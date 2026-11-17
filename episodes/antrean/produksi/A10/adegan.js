// A10 Halaman pelanggan, petugas, dan TV
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
const muka = (judul, warna) => (c, x, y, w, h) => { K.rrect(c, x, y, w, 40, 0, '#1d4ed8'); K.text(c, judul, x + 12, y + 21, {size: 15, weight: 800, color: '#fff'}); };
AD.empatHalaman = (c, t, D) => {
  K.bg(c); K.judul(c, 'Empat halaman', t, C.sky, 'HTML, CSS, dan JavaScript murni');
  const hal = [['Ambil nomor', 'pelanggan', C.sky], ['Status tiket', 'pelanggan', C.teal], ['Layar petugas', 'petugas loket', C.amber], ['Layar TV', 'ruang tunggu', C.violet]];
  hal.forEach(([n, s, w], i) => { const p = O(S(t, .3 + i * D * .12, .9 + i * D * .12)); if (p <= 0) return; const x = 150 + i * 420;
    c.save(); c.globalAlpha = p;
    if (i < 2) { K.hp(c, x + 90, 300, 220, 420, (c, X, Y, W, H) => { K.rrect(c, X, Y, W, 40, 0, '#1d4ed8');
        if (i === 0) for (let k = 0; k < 3; k++) K.rrect(c, X + 14, Y + 70 + k * 70, W - 28, 54, 10, '#2563eb');
        else { K.text(c, 'A-003', X + W / 2, Y + 140, {size: 46, weight: 900, align: 'center', color: '#1d4ed8'}); K.rrect(c, X + 14, Y + 190, W - 28, 40, 8, '#dbeafe'); } }); }
    else if (i === 2) { K.rrect(c, x, 360, 380, 250, 12, '#f1f5f9', '#94a3b8', 6); K.rrect(c, x + 20, 380, 200, 210, 8, '#fff'); K.text(c, 'B-001', x + 120, 450, {size: 40, weight: 900, align: 'center', color: '#1d4ed8'});
      K.rrect(c, x + 36, 500, 168, 40, 8, '#15803d'); for (let k = 0; k < 4; k++) K.rrect(c, x + 240, 390 + k * 46, 120, 34, 6, '#e2e8f0'); c.fillStyle = '#94a3b8'; c.fillRect(x + 150, 610, 80, 40); c.fillRect(x + 100, 650, 180, 12); }
    else { K.rrect(c, x - 10, 340, 400, 260, 14, '#0b1736', '#94a3b8', 6); K.rrect(c, x + 10, 360, 240, 220, 12, '#1d4ed8'); K.text(c, 'A-012', x + 130, 470, {size: 58, weight: 900, align: 'center'});
      for (let k = 0; k < 3; k++) K.rrect(c, x + 265, 365 + k * 60, 105, 46, 8, '#13224d'); c.fillStyle = '#94a3b8'; c.fillRect(x + 170, 600, 40, 50); }
    K.text(c, n, x + 190, 790, {size: 36, weight: 900, align: 'center', color: w}); K.text(c, s, x + 190, 840, {size: 26, weight: 700, align: 'center', color: C.redup}); c.restore(); });
};
AD.mobileFirst = (c, t, D) => {
  K.bg(c); K.judul(c, 'Layar kecil dulu', t, C.teal, 'Pelanggan membuka dari HP setelah memindai QR');
  const tanpa = t < D * .45;
  K.hp(c, 200, 270, 300, 580, (c, x, y, w, h) => { const s = tanpa ? .45 : 1; K.rrect(c, x, y, w, 50 * s, 0, '#1d4ed8');
    for (let k = 0; k < 3; k++) K.rrect(c, x + 16 * s, y + (70 + k * 80) * s, (w - 32) * (tanpa ? .5 : 1), 60 * s, 10 * s, '#2563eb');
    K.text(c, 'Ganti oli cepat', x + 30, y + 100 * s, {size: 22 * s, weight: 800, color: '#fff'}); });
  K.text(c, tanpa ? 'tanpa meta viewport: semuanya mengecil' : 'dengan meta viewport', 350, 900, {size: 26, weight: 800, align: 'center', color: tanpa ? C.coral : C.lime});
  const p = O(S(t, D * .35, D * .45)); if (p > 0) { c.save(); c.globalAlpha = p; K.kode(c, ['<meta name="viewport"', '      content="width=device-width, initial-scale=1">'], 640, 300, {size: 30, w: 1100}); c.restore(); }
  const q = O(S(t, D * .55, D * .65)); if (q > 0) { c.save(); c.globalAlpha = q;
    K.rrect(c, 700, 560, 500, 110, 18, '#2563eb'); K.text(c, 'Ambil nomor', 950, 616, {size: 40, weight: 800, align: 'center', color: '#fff'});
    c.strokeStyle = C.amber; c.lineWidth = 3; c.beginPath(); c.moveTo(1230, 560); c.lineTo(1230, 670); c.stroke(); K.text(c, '≥ 48 px', 1250, 616, {size: 34, weight: 900, color: C.amber});
    c.fillStyle = '#f5c39b'; c.beginPath(); c.ellipse(1000, 720, 46, 70, -.4, 0, 7); c.fill(); K.text(c, 'mudah ditekan jempol', 1440, 740, {size: 30, weight: 700, color: C.redup}); c.restore(); }
  const r = O(S(t, D * .8, D * .88)); if (r > 0) K.text(c, 'Diperiksa dengan mode perangkat di DevTools', 1200, 900, {size: 32, weight: 800, align: 'center', color: C.sky, alpha: r});
};
AD.apiBungkus = (c, t, D) => {
  K.bg(c); K.judul(c, 'Fungsi api()', t, C.sky, 'Membungkus fetch dan memeriksa res.ok');
  const p1 = O(S(t, .3, .9)); K.rrect(c, 140, 270, 760, 360, 22, 'rgba(255,107,107,.05)', C.coral, 3); K.text(c, 'fetch biasa', 520, 320, {size: 34, weight: 900, align: 'center', color: C.coral, alpha: p1});
  K.text(c, 'server menjawab 404', 520, 420, {size: 34, weight: 700, align: 'center', mono: true, alpha: p1}); K.text(c, 'fetch tetap "berhasil"', 520, 500, {size: 34, weight: 800, align: 'center', alpha: p1});
  K.text(c, 'halaman diam saja', 520, 570, {size: 30, weight: 700, align: 'center', color: C.redup, alpha: p1});
  const p2 = O(S(t, D * .35, D * .45)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 1020, 270, 760, 360, 22, 'rgba(163,230,53,.05)', C.lime, 3);
    K.text(c, 'api()', 1400, 320, {size: 34, weight: 900, align: 'center', mono: true, color: C.lime});
    K.text(c, 'if (!res.ok)', 1400, 420, {size: 34, weight: 700, align: 'center', mono: true});
    K.text(c, "throw new Error(data.error)", 1400, 500, {size: 30, weight: 700, align: 'center', mono: true, color: C.amber});
    K.text(c, '"Tiket tidak ditemukan"', 1400, 570, {size: 30, weight: 800, align: 'center', color: C.lime}); c.restore(); }
  const q = O(S(t, D * .7, D * .78)); if (q > 0) K.text(c, 'Ingat bab 4: memeriksa status code adalah tugas kita', 960, 760, {size: 38, weight: 800, align: 'center', alpha: q});
};
AD.teksAman = (c, t, D) => {
  K.bg(c); K.judul(c, 'Fungsi el()', t, C.lime, 'Isinya selalu lewat textContent');
  K.kode(c, ["el('b', '', '<i>Dina</i>')"], 140, 270, {size: 36, w: 900});
  K.rrect(c, 140, 460, 1640, 140, 20, '#f8fafc'); K.text(c, '<i>Dina</i>', 200, 530, {size: 48, weight: 800, mono: true, color: '#0f172a'});
  K.text(c, 'ditampilkan apa adanya, sebagai teks biasa', 960, 700, {size: 38, weight: 800, align: 'center', color: C.lime, alpha: O(S(t, D * .3, D * .4))});
  const q = O(S(t, D * .6, D * .7)); if (q > 0) K.text(c, 'Alasannya ada di segmen cek kerjaan AI', 960, 820, {size: 32, weight: 700, align: 'center', color: C.redup, alpha: q});
};
AD.duaKlik = (c, t, D) => {
  K.bg(c); K.judul(c, 'Apa yang bisa salah?', t, C.coral, 'Sinyal lemah, request butuh beberapa detik');
  const tombol = (x, y, teks, w) => { K.rrect(c, x, y, 360, 80, 14, w); K.text(c, teks, x + 180, y + 41, {size: 28, weight: 800, align: 'center', color: '#fff'}); };
  K.hp(c, 200, 260, 300, 560, (c, x, y, w, h) => { const sabar = t > D * .2 && t < D * .5;
    K.rrect(c, x + 20, y + 120, w - 40, 70, 12, '#2563eb'); K.text(c, 'Ganti oli cepat', x + w / 2, y + 156, {size: 22, weight: 800, align: 'center', color: '#fff'});
    if (sabar) K.text(c, '…', x + w / 2, y + 260, {size: 60, weight: 900, align: 'center', color: '#94a3b8'}); });
  [D * .15, D * .32].forEach((tt, i) => { if (t > tt && t < tt + .6) { c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(350, 416, 34, 0, 7); c.fill(); }
    const p = O(S(t, tt + 1, tt + 1.6)); if (p > 0) K.tiketKertas(c, 820 + i * 330, 440, 'A-00' + (i + 5), {w: 260, h: 160, alpha: p}); });
  const p = O(S(t, D * .45, D * .52)); if (p > 0) K.text(c, 'dua nomor untuk satu orang', 985, 600, {size: 34, weight: 900, align: 'center', color: C.coral, alpha: p});
  const q = O(S(t, D * .62, D * .7)); if (q > 0) { c.save(); c.globalAlpha = q; K.kode(c, ['tombol.disabled = true;', "pesan.textContent = 'Sedang mengambil nomor…';"], 700, 700, {size: 30, w: 1080}); K.centang(c, 1820, 740, 50, 1); c.restore(); }
};
AD.tanpaKosong = (c, t, D) => {
  K.bg(c); K.judul(c, 'Jangan pernah layar kosong', t, C.amber);
  const isi = [['', C.coral, 0], ['Koneksi terputus, mencoba lagi…', C.amber, 1], ['Tiket tidak ditemukan', C.sky, 2]];
  isi.forEach(([s, w, i]) => { const p = O(S(t, .3 + i * D * .25, .9 + i * D * .25)); if (p <= 0) return; const x = 260 + i * 520;
    c.save(); c.globalAlpha = p; K.hp(c, x, 280, 280, 520, (c, X, Y, W, H) => { K.rrect(c, X, Y, W, 40, 0, '#1d4ed8');
      if (i === 1) { K.rrect(c, X, Y + 40, W, 40, 0, '#fee2e2'); K.text(c, s, X + W / 2, Y + 61, {size: 15, weight: 800, align: 'center', color: '#b91c1c'}); K.text(c, 'A-003', X + W / 2, Y + 180, {size: 48, weight: 900, align: 'center', color: '#1d4ed8'}); }
      if (i === 2) { K.text(c, s, X + W / 2, Y + 150, {size: 20, weight: 800, align: 'center', color: '#b91c1c'}); K.rrect(c, X + 20, Y + 200, W - 40, 56, 12, '#1d4ed8'); K.text(c, 'Ambil nomor baru', X + W / 2, Y + 229, {size: 18, weight: 800, align: 'center', color: '#fff'}); } });
    if (i === 0) K.coret(c, x + 20, 300, x + 260, 780, 1);
    K.text(c, ['layar kosong', 'beri tahu', 'beri jalan keluar'][i], x + 140, 870, {size: 30, weight: 800, align: 'center', color: w}); c.restore(); });
};
AD.devtoolsTiga = (c, t, D) => {
  K.bg(c); K.judul(c, 'Saat sesuatu tidak berjalan', t, C.sky, 'Buka DevTools dulu, sebelum bertanya');
  const tab = [['Console', 'error JavaScript dan barisnya', C.coral], ['Network', 'request yang gagal dan jawaban server', C.amber], ['Elements', 'coba CSS langsung', C.lime]];
  tab.forEach(([n, s, w], i) => { const p = O(S(t, .3 + i * D * .22, .9 + i * D * .22)); if (p <= 0) return; const x = 140 + i * 560;
    c.save(); c.globalAlpha = p; K.rrect(c, x, 260, 520, 520, 18, '#f8fafc', '#cbd5e1', 2); K.rrect(c, x, 260, 520, 50, 0, '#e2e8f0');
    K.text(c, n, x + 30, 286, {size: 24, weight: 800, color: '#0f172a'}); c.fillStyle = w; c.fillRect(x + 22, 306, K.lebar(c, n, 24, 800) + 16, 4);
    if (i === 0) { K.rrect(c, x + 20, 340, 480, 70, 6, '#fee2e2'); K.text(c, "TypeError: t is undefined", x + 36, 366, {size: 20, weight: 700, mono: true, color: '#b91c1c'}); K.text(c, 'tiket.html:42', x + 36, 394, {size: 18, weight: 600, mono: true, color: '#64748b'}); }
    if (i === 1) [['tiket/abc', '404'], ['siaran', '200'], ['layanan', '200']].forEach(([a, b], k) => { K.text(c, a, x + 30, 360 + k * 50, {size: 22, weight: 600, mono: true, color: b === '404' ? '#b91c1c' : '#0f172a'}); K.text(c, b, x + 420, 360 + k * 50, {size: 22, weight: 700, mono: true, color: b === '404' ? '#b91c1c' : '#15803d'}); });
    if (i === 2) { K.text(c, '.nomor {', x + 30, 360, {size: 22, weight: 600, mono: true, color: '#0f172a'}); K.text(c, '  font-size: 96px;', x + 30, 395, {size: 22, weight: 600, mono: true, color: '#1d4ed8'}); K.text(c, '}', x + 30, 430, {size: 22, weight: 600, mono: true, color: '#0f172a'}); }
    K.text(c, s, x + 260, 720, {size: 26, weight: 700, align: 'center', color: '#334155', maxW: 460}); c.restore(); });
  const q = O(S(t, D * .8, D * .88)); if (q > 0) K.text(c, 'Lihat ketiganya sebelum bertanya ke orang lain, atau ke AI', 960, 880, {size: 36, weight: 800, align: 'center', alpha: q});
};
const KODE = ["// layar TV, saat pelanggan booking dipanggil", "const sambutan = document.getElementById('sambutan');", "sambutan.innerHTML = 'Selamat datang, ' + booking.name + '!';"];
AD.cekAI10 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  K.text(c, 'Perintah: "tampilkan nama pelanggan booking di layar TV saat dipanggil"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  K.kode(c, KODE, 140, 310, {size: 30, w: 1640, chars: Math.floor(200 * S(t, .8, 3))});
  K.pikirkan(c, t, D, 1660, 900);
};
AD.xss = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t, C.lime); K.text(c, 'Nama diketik oleh siapa saja', 140, 200, {size: 40, weight: 900, color: C.coral});
  K.rrect(c, 140, 260, 1000, 90, 14, '#f1f5f9'); K.text(c, 'Nama:', 170, 306, {size: 28, weight: 700, color: '#475569'});
  K.text(c, '<h1>BENGKEL TUTUP</h1><script>…</script>', 270, 306, {size: 28, weight: 800, mono: true, color: '#b91c1c'});
  const p = O(S(t, D * .25, D * .35)); if (p > 0) { c.save(); c.globalAlpha = p; K.text(c, 'innerHTML', 400, 450, {size: 34, weight: 800, mono: true, color: C.coral});
    K.rrect(c, 140, 490, 780, 300, 18, '#0b1736', '#94a3b8', 5); K.text(c, 'BENGKEL TUTUP', 530, 640, {size: 76, weight: 900, align: 'center', color: '#ef4444'});
    K.text(c, 'XSS: kode ikut berjalan di layar TV', 530, 840, {size: 28, weight: 800, align: 'center', color: C.coral}); c.restore(); }
  const q = O(S(t, D * .6, D * .7)); if (q > 0) { c.save(); c.globalAlpha = q; K.text(c, 'textContent', 1220, 450, {size: 34, weight: 800, mono: true, color: C.lime});
    K.rrect(c, 1000, 490, 780, 300, 18, '#0b1736', '#94a3b8', 5); K.text(c, 'Selamat datang,', 1390, 590, {size: 34, weight: 700, align: 'center'});
    K.text(c, '<h1>BENGKEL TUTUP</h1>…', 1390, 650, {size: 26, weight: 700, align: 'center', mono: true, color: '#cbd5e1'});
    K.text(c, 'hanya teks biasa', 1390, 840, {size: 28, weight: 800, align: 'center', color: C.lime}); c.restore(); }
};
})();
