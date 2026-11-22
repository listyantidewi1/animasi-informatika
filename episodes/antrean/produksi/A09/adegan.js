// A09 Layar real time dan suara
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
const layarHP = (label, info, warna = '#0f172a') => (c, x, y, w, h) => {
  K.text(c, label, x + w / 2, y + 150, {size: Math.min(64, w / 4.2), weight: 900, align: 'center', color: warna});
  K.text(c, info, x + w / 2, y + 240, {size: 24, weight: 700, align: 'center', color: '#475569', maxW: w - 30}); };
const stopwatch = (c, x, y, r, p, teks) => { c.strokeStyle = '#334155'; c.lineWidth = 14; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  c.strokeStyle = C.lime; c.beginPath(); c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); c.stroke();
  K.rrect(c, x - 22, y - r - 40, 44, 26, 6, '#334155'); K.text(c, teks, x, y + 4, {size: 52, weight: 900, align: 'center', mono: true}); };
AD.janji3detik = (c, t, D) => {
  K.bg(c); K.judul(c, 'Janji dari bab 1', t, C.lime, 'Kriteria terima');
  K.rrect(c, 140, 230, 1640, 110, 20, 'rgba(163,230,53,.07)', C.lime, 3);
  K.text(c, 'Posisi di HP berubah < 3 detik setelah petugas memanggil, tanpa refresh', 960, 286, {size: 38, weight: 800, align: 'center'});
  const g = t > D * .45; K.hp(c, 420, 400, 300, 560, layarHP('A-003', g ? 'Posisi 1, sekitar 0 menit' : 'Posisi 2, sekitar 10 menit'));
  const q = K.clamp(S(t, D * .3, D * .45)); stopwatch(c, 1200, 680, 170, q, (q * 0.04).toFixed(2) + ' s');
  if (g) K.text(c, 'tanpa refresh', 1200, 920, {size: 36, weight: 800, align: 'center', color: C.lime, alpha: O(S(t, D * .5, D * .6))});
};
AD.tigaCara = (c, t, D) => {
  K.bg(c); K.judul(c, 'Bagaimana server memberi kabar?', t, C.sky, 'HTTP selalu dimulai oleh browser');
  const kol = [['Polling', 'bertanya terus', C.amber], ['SSE', 'siaran satu arah', C.lime], ['WebSocket', 'telepon dua arah', C.violet]];
  kol.forEach(([n, s, w], i) => { const p = O(S(t, .3 + i * D * .3, .9 + i * D * .3)); if (p <= 0) return; const x = 140 + i * 560;
    c.save(); c.globalAlpha = p; K.rrect(c, x, 250, 520, 640, 24, 'rgba(255,255,255,.03)', w, 4);
    K.text(c, n, x + 260, 310, {size: 46, weight: 900, align: 'center', color: w}); K.text(c, s, x + 260, 360, {size: 28, weight: 700, align: 'center', color: C.redup});
    const bx = x + 90, sx = x + 430, y0 = 470;
    K.rrect(c, bx - 60, y0 - 50, 120, 100, 14, '#1e293b', '#64748b', 3); K.text(c, 'browser', bx, y0 + 80, {size: 22, weight: 700, align: 'center', color: C.redup});
    K.serverKotak(c, sx, y0 + 60, .45, '');
    K.text(c, 'server', sx, y0 + 150, {size: 22, weight: 700, align: 'center', color: C.redup});
    if (i === 0) { for (let k = 0; k < 4; k++) { const ph = ((t * .9 + k * .25) % 1); K.arrow(c, bx + 70, 610 + k * 60, sx - 70, 610 + k * 60, C.amber, 4, 1, 14);
        K.text(c, k === 3 ? 'ada baru?' : 'sudah sampai?', (bx + sx) / 2, 596 + k * 60, {size: 20, weight: 700, align: 'center', color: C.amber, alpha: .5 + .5 * Math.sin(ph * 6)}); } }
    if (i === 1) { c.strokeStyle = '#475569'; c.lineWidth = 6; c.beginPath(); c.moveTo(bx + 70, y0); c.lineTo(sx - 70, y0); c.stroke();
      for (let k = 0; k < 3; k++) { const ph = ((t * .5 + k / 3) % 1); const xx = K.lerp(sx - 80, bx + 80, ph); K.rrect(c, xx - 26, y0 - 16, 52, 32, 8, C.lime); }
      K.text(c, 'satu sambungan, server bicara kapan saja', x + 260, 720, {size: 24, weight: 700, align: 'center', maxW: 460}); }
    if (i === 2) { K.arrow(c, bx + 70, y0 - 20, sx - 70, y0 - 20, C.violet, 5, 1, 16); K.arrow(c, sx - 70, y0 + 20, bx + 70, y0 + 20, C.violet, 5, 1, 16);
      K.text(c, 'dua pihak terus berbicara', x + 260, 720, {size: 24, weight: 700, align: 'center'}); }
    c.restore(); });
};
AD.pilihSSE = (c, t, D) => {
  K.bg(c); K.judul(c, 'Kita pilih SSE', t, C.lime);
  const alasan = ['Kabar hanya mengalir dari server ke layar', 'Petugas menekan tombol lewat request biasa', 'Sudah ada di semua browser', 'Menyambung ulang sendiri kalau terputus', 'Berjalan di atas HTTP biasa'];
  alasan.forEach((a, i) => { const p = O(S(t, .4 + i * D * .1, .9 + i * D * .1)); if (p <= 0) return;
    K.centang(c, 190, 300 + i * 100, 44, p); K.text(c, a, 250, 300 + i * 100, {size: 38, weight: 700, alpha: p}); });
  const q = O(S(t, D * .72, D * .8)); if (q > 0) { K.rrect(c, 140, 830, 1640, 110, 20, 'rgba(167,139,250,.08)', C.violet, 3, q);
    K.text(c, 'WebSocket lebih cocok untuk chat atau game: kedua pihak terus berbicara', 960, 886, {size: 34, weight: 800, align: 'center', color: C.violet, alpha: q}); }
};
AD.pipaSiaran = (c, t, D) => {
  K.bg(c); K.judul(c, 'siaran.js', t, C.lime, 'Semua layar yang mendengarkan disimpan di sebuah Set');
  K.serverKotak(c, 360, 560, 1);
  K.rrect(c, 600, 380, 300, 300, 20, '#0d1222', C.lime, 3); K.text(c, 'pendengar = Set', 750, 420, {size: 26, weight: 800, align: 'center', mono: true, color: C.lime});
  const layar = [['TV', 'tv'], ['HP 1', 'hp'], ['HP 2', 'hp']], keluar = t > D * .75;
  layar.forEach(([n, j], i) => { const p = O(S(t, .4 + i * .5, 1 + i * .5)); if (p <= 0) return; const y = 330 + i * 200, x = 1400;
    const pergi = i === 2 && keluar, a = pergi ? 1 - O(S(t, D * .75, D * .85)) : p; if (a <= 0) return;
    c.save(); c.globalAlpha = a; K.rrect(c, 640, 470 + i * 60, 220, 44, 10, '#1e293b'); K.text(c, 'res ' + n, 750, 493 + i * 60, {size: 22, weight: 700, align: 'center', mono: true});
    c.strokeStyle = C.lime; c.lineWidth = 4; c.setLineDash([12, 8]); c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(900, 492 + i * 60); c.lineTo(x - 20, y + 60); c.stroke(); c.setLineDash([]);
    if (j === 'tv') { K.rrect(c, x, y, 280, 150, 12, '#0b1736', '#94a3b8', 4); K.text(c, 'A-012', x + 140, y + 76, {size: 52, weight: 900, align: 'center'}); }
    else K.hp(c, x + 90, y - 10, 100, 170, () => {});
    K.text(c, n, x + 140, y + 185, {size: 22, weight: 700, align: 'center', color: C.redup}); c.restore(); });
  if (keluar) K.text(c, "req.on('close'): hapus dari Set", 1100, 960, {size: 32, weight: 800, align: 'center', mono: true, color: C.amber, alpha: O(S(t, D * .78, D * .85))});
  const p0 = O(S(t, D * .2, D * .3)); if (p0 > 0) K.text(c, 'Content-Type: text/event-stream (jawaban tidak pernah ditutup)', 960, 990, {size: 28, weight: 700, align: 'center', mono: true, color: C.sky, alpha: p0 * (keluar ? 0 : 1)});
};
AD.formatPesan = (c, t, D) => {
  K.bg(c); K.judul(c, 'Pesan SSE hanyalah teks', t, C.lime);
  K.rrect(c, 240, 260, 1000, 330, 22, '#0d1222', '#334155', 3);
  const baris = [['event: panggil', C.amber, 'jenis kabar'], ['data: {"label":"A-012","loket":"Loket 2"}', C.sky, 'isi dalam JSON'], ['', C.teks, 'baris kosong = pesan selesai']];
  baris.forEach(([s, w, k], i) => { const p = O(S(t, .4 + i * D * .15, 1 + i * D * .15)); if (p <= 0) return; const y = 330 + i * 90;
    if (i === 2) { c.save(); c.globalAlpha = p; c.strokeStyle = C.redup; c.setLineDash([8, 8]); c.strokeRect(280, y - 30, 900, 60); c.setLineDash([]); c.restore(); }
    K.text(c, s, 290, y, {size: 36, weight: 700, mono: true, color: w, alpha: p}); K.arrow(c, 1260, y, 1340, y, '#64748b', 4, p, 12); K.text(c, k, 1360, y, {size: 32, weight: 700, alpha: p}); });
  const q = O(S(t, D * .6, D * .7)); if (q > 0) { c.save(); c.globalAlpha = q;
    const ph = (t % 2.5) / 2.5; c.fillStyle = C.coral; c.beginPath(); c.arc(330, 790, 26 + 8 * Math.sin(ph * Math.PI * 2), 0, 7); c.fill();
    K.text(c, ': detak', 400, 780, {size: 36, weight: 800, mono: true, color: C.coral}); K.text(c, 'setiap 25 detik, supaya sambungan diam tidak diputus di tengah jalan', 400, 840, {size: 30, weight: 700, color: C.redup}); c.restore(); }
};
AD.urutanCommit = (c, t, D) => {
  K.bg(c); K.judul(c, 'Kapan menyiarkan?', t, C.amber, 'Selalu setelah COMMIT');
  const jalur = (y, langkah, warna, p) => { langkah.forEach(([s, w], i) => { const q = O(S(p, i * .25, i * .25 + .2)); if (q <= 0) return; const x = 260 + i * 400;
      K.rrect(c, x, y, 340, 90, 16, 'rgba(255,255,255,.04)', w, 3, q); K.text(c, s, x + 170, y + 46, {size: 30, weight: 800, align: 'center', mono: true, color: w, alpha: q});
      if (i) K.arrow(c, x - 70, y + 45, x - 10, y + 45, '#64748b', 4, q, 12); }); };
  K.text(c, 'Salah', 140, 330, {size: 34, weight: 900, color: C.coral});
  jalur(290, [['BEGIN', C.redup], ['siarkan()', C.amber], ['ROLLBACK', C.coral], ['TV: A-012 ?!', C.coral]], C.coral, S(t, .4, D * .45));
  const p2 = O(S(t, D * .48, D * .55)); if (p2 > 0) { K.text(c, 'Benar', 140, 600, {size: 34, weight: 900, color: C.lime, alpha: p2});
    jalur(560, [['BEGIN', C.redup], ['UPDATE ...', C.sky], ['COMMIT', C.lime], ['siarkan()', C.lime]], C.lime, S(t, D * .5, D * .85)); }
  const q = O(S(t, D * .4, D * .48)); if (q > 0) K.text(c, 'TV sudah memanggil nomor yang tidak pernah dipanggil', 960, 450, {size: 30, weight: 800, align: 'center', color: C.coral, alpha: q});
};
AD.tandaFetch = (c, t, D) => {
  K.bg(c); K.judul(c, 'Di browser: new EventSource', t, C.sky, 'Kabar hanya tanda; datanya diambil dengan fetch');
  K.kode(c, ["const sumber = new EventSource('/api/siaran');", "sumber.addEventListener('antrean', muat);"], 140, 240, {size: 32, w: 1200});
  K.serverKotak(c, 300, 720, .8);
  const p1 = O(S(t, D * .3, D * .38)); const x = K.lerp(420, 1200, K.ease(S(t, D * .3, D * .45)));
  if (p1 > 0) { K.rrect(c, x - 90, 560, 180, 50, 25, C.amber); K.text(c, "'antrean'", x, 586, {size: 24, weight: 900, align: 'center', mono: true, color: '#0e1424'}); }
  K.hp(c, 1300, 440, 240, 460, layarHP('A-003', t > D * .75 ? 'Posisi 1' : 'Posisi 2'));
  const p2 = O(S(t, D * .5, D * .6)); if (p2 > 0) { c.save(); c.globalAlpha = p2; c.setLineDash([12, 8]); K.arrow(c, 1290, 780, 440, 780, C.sky, 5, 1, 16); c.setLineDash([]);
    K.text(c, "fetch('/api/tiket/<kode>')", 860, 830, {size: 28, weight: 800, align: 'center', mono: true, color: C.sky}); c.restore(); }
  const p3 = O(S(t, D * .65, D * .75)); if (p3 > 0) K.arrow(c, 440, 700, 1290, 700, C.lime, 5, p3, 16);
};
AD.ejaNomor = (c, t, D) => {
  K.bg(c); K.judul(c, 'speechSynthesis', t, C.violet, 'Fitur suara bawaan browser');
  K.rrect(c, 680, 270, 560, 200, 26, '#0b1736', '#94a3b8', 5); K.text(c, 'A-012', 960, 372, {size: 110, weight: 900, align: 'center'});
  const gel = (x, y, s, w, p, benar) => { if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, x, y, 620, 120, 60, 'rgba(255,255,255,.05)', w, 4);
    K.text(c, s, x + 310, y + 62, {size: 40, weight: 800, align: 'center', color: w}); benar ? K.centang(c, x + 310, y + 180, 60, 1) : K.coret(c, x + 30, y + 60, x + 590, y + 60, 1); c.restore(); };
  gel(220, 560, '"A, nol satu dua"', C.coral, O(S(t, D * .2, D * .3)), false);
  gel(1080, 560, '"A, dua belas"', C.lime, O(S(t, D * .4, D * .5)), true);
  const q = O(S(t, D * .6, D * .7)); if (q > 0) K.text(c, "kalimat.lang = 'id-ID'", 960, 920, {size: 38, weight: 800, align: 'center', mono: true, color: C.violet, alpha: q});
};
AD.tombolSuara = (c, t, D) => {
  K.bg(c); K.judul(c, 'Aturan autoplay', t, C.amber, 'Tidak ada suara sebelum pengguna mengklik sesuatu');
  K.rrect(c, 260, 260, 1400, 640, 24, '#0b1736', '#94a3b8', 5);
  const klik = t > D * .6, sp = (x, y, on) => { c.fillStyle = on ? C.lime : '#64748b'; c.beginPath(); c.moveTo(x, y - 20); c.lineTo(x + 24, y - 20); c.lineTo(x + 54, y - 46); c.lineTo(x + 54, y + 46); c.lineTo(x + 24, y + 20); c.lineTo(x, y + 20); c.fill();
    c.strokeStyle = on ? C.lime : C.coral; c.lineWidth = 6; c.beginPath(); if (on) { c.arc(x + 60, y, 40, -.8, .8); c.stroke(); c.beginPath(); c.arc(x + 60, y, 70, -.8, .8); } else { c.moveTo(x + 76, y - 30); c.lineTo(x + 136, y + 30); c.moveTo(x + 136, y - 30); c.lineTo(x + 76, y + 30); } c.stroke(); };
  sp(860, 560, klik);
  const p = O(S(t, D * .1, D * .2)); if (p > 0 && t < D * .45) { K.rrect(c, 340, 300, 380, 200, 16, 'rgba(255,107,107,.12)', C.coral, 3); K.text(c, 'IKLAN', 530, 380, {size: 50, weight: 900, align: 'center', color: C.coral, alpha: p}); K.text(c, 'tidak boleh berbunyi sendiri', 530, 450, {size: 24, weight: 700, align: 'center', alpha: p}); }
  if (t > D * .35 && !klik) { K.rrect(c, 1260, 300, 340, 80, 14, '#e2e8f0'); K.text(c, 'Aktifkan suara', 1430, 341, {size: 30, weight: 800, align: 'center', color: '#0f172a'}); }
  if (t > D * .45 && t < D * .62) { const q = K.ease(S(t, D * .45, D * .58)); c.fillStyle = '#fff'; c.beginPath(); const mx = K.lerp(1000, 1430, q), my = K.lerp(700, 345, q); c.moveTo(mx, my); c.lineTo(mx + 14, my + 40); c.lineTo(mx + 34, my + 32); c.fill(); }
  if (klik) K.text(c, 'Ditekan sekali saat bengkel buka', 960, 820, {size: 38, weight: 800, align: 'center', color: C.lime, alpha: O(S(t, D * .62, D * .72))});
};
AD.wifiPutus = (c, t, D) => {
  K.bg(c); K.judul(c, 'Wi-Fi putus sebentar', t, C.coral, 'Jangan pernah menganggap semua kabar pasti sampai');
  const y = 520, x0 = 160, x1 = 1760, q = K.clamp(S(t, .3, D * .7)), xn = K.lerp(x0, x1, q);
  const putusA = 620, putusB = 1080;
  c.lineWidth = 10; c.lineCap = 'round';
  c.strokeStyle = C.lime; c.beginPath(); c.moveTo(x0, y); c.lineTo(Math.min(xn, putusA), y); c.stroke();
  if (xn > putusA) { c.strokeStyle = C.coral; c.setLineDash([10, 18]); c.beginPath(); c.moveTo(putusA, y); c.lineTo(Math.min(xn, putusB), y); c.stroke(); c.setLineDash([]);
    K.text(c, 'putus', (putusA + putusB) / 2, y + 60, {size: 30, weight: 800, align: 'center', color: C.coral}); }
  if (xn > 820) { K.rrect(c, 720, 330, 240, 60, 12, 'rgba(255,176,32,.2)', C.amber, 3); K.text(c, 'panggil A-013', 840, 361, {size: 22, weight: 800, align: 'center', mono: true, color: C.amber});
    K.coret(c, 730, 360, 950, 360, O(S(t, D * .32, D * .38))); K.text(c, 'tidak sampai', 840, 420, {size: 24, weight: 700, align: 'center', color: C.coral}); }
  if (xn > putusB) { c.strokeStyle = C.lime; c.beginPath(); c.moveTo(putusB, y); c.lineTo(xn, y); c.stroke();
    K.text(c, '3 detik → sambung ulang', putusB, y - 60, {size: 28, weight: 800, align: 'center', color: C.lime}); }
  if (xn > 1300) { K.rrect(c, 1160, 600, 580, 130, 18, 'rgba(56,189,248,.1)', C.sky, 3); K.text(c, 'onopen → fetch keadaan terbaru', 1450, 650, {size: 26, weight: 800, align: 'center', mono: true, color: C.sky});
    K.text(c, 'A-013 tetap muncul', 1450, 700, {size: 26, weight: 800, align: 'center', color: C.lime}); }
};
const KODE = ["// layar TV", "setInterval(async () => {", "  const res = await fetch('/api/antrean');", "  const data = await res.json();", "  document.getElementById('nomor').textContent = data.label;", "}, 100);"];
AD.cekAI09 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  K.text(c, 'Perintah: "buatkan layar TV antrean yang update otomatis"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  K.kode(c, KODE, 140, 310, {size: 30, w: 1400, chars: Math.floor(260 * S(t, .8, 3.5))});
  K.pikirkan(c, t, D, 1660, 900);
};
AD.hitungRequest = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t, C.lime); K.text(c, 'Setiap 100 ms = 10 request per detik per layar', 140, 200, {size: 40, weight: 900, color: C.coral});
  const n = Math.min(30, Math.floor(30 * K.clamp(S(t, .5, D * .35))));
  for (let i = 0; i < 30; i++) { if (i >= n) break; const x = 160 + (i % 10) * 82, y = 290 + Math.floor(i / 10) * 150; K.hp(c, x, y, 62, 120, () => {}); }
  const p = O(S(t, D * .35, D * .45)); if (p > 0) { c.save(); c.globalAlpha = p; K.text(c, '30 HP × 10', 1040, 380, {size: 50, weight: 900});
    K.text(c, '= 300 request/detik', 1040, 470, {size: 60, weight: 900, color: C.coral}); K.text(c, 'masing-masing menjalankan query', 1040, 540, {size: 30, weight: 700, color: C.redup});
    K.text(c, 'padahal hampir selalu tidak ada yang berubah', 1040, 590, {size: 30, weight: 700, color: C.redup}); c.restore(); }
  const q = O(S(t, D * .65, D * .75)); if (q > 0) { K.rrect(c, 160, 800, 1600, 120, 22, 'rgba(163,230,53,.08)', C.lime, 3, q);
    K.text(c, 'SSE: tidak ada kejadian = 0 request', 960, 862, {size: 44, weight: 900, align: 'center', color: C.lime, alpha: q}); }
};
})();
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
AD.serverDiam = (c, t, D) => {
  K.bg(c); K.judul(c, 'Server hanya bisa menjawab', t, C.sky, 'HTTP selalu dimulai oleh browser');
  K.serverKotak(c, 1400, 560, 1.1);
  K.rrect(c, 260, 380, 420, 240, 16, '#0b1736', '#94a3b8', 5); K.text(c, 'A-011', 470, 500, {size: 90, weight: 900, align: 'center'}); K.text(c, 'Layar TV', 470, 660, {size: 30, weight: 700, align: 'center', color: C.redup});
  const p = O(S(t, D * .2, D * .3)); if (p > 0) { K.rrect(c, 1180, 250, 440, 90, 45, 'rgba(255,176,32,.12)', C.amber, 3); K.text(c, 'A-012 baru dipanggil!', 1400, 296, {size: 32, weight: 800, align: 'center', color: C.amber, alpha: p}); }
  const q = O(S(t, D * .4, D * .5)); if (q > 0) { c.save(); c.globalAlpha = q; c.setLineDash([16, 12]); K.arrow(c, 1220, 520, 720, 520, '#64748b', 5, 1, 18); c.setLineDash([]);
    K.coret(c, 900, 470, 1040, 570, O(S(t, D * .5, D * .58))); c.restore(); }
  const r = O(S(t, D * .65, D * .75)); if (r > 0) K.text(c, 'Bagaimana server memberi tahu layar TV?', 960, 900, {size: 42, weight: 900, align: 'center', alpha: r});
};
})();
