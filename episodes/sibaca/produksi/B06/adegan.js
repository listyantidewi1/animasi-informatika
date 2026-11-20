// B06 React pertama
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b2: komponen, JSX, state
AD.komponenState = (c, t, D, a) => { K.bg(c); K.judul(c, 'Tiga kata penting di React', t, C.sky);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6), t7 = kt(a, 7);
  ['<Header />', '<Katalog />', '<KartuBuku />', '<KartuBuku />', '<Tombol />'].forEach((s, i) => { const p = muncul(t, .5 + i * .35); if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, 140 + i * 330, 190, 310, 76, 16, 'rgba(56,189,248,.1)', C.sky, 3); K.text(c, s, 295 + i * 330, 229, {size: 28, weight: 800, align: 'center', mono: true}); c.restore(); });
  K.text(c, 'Halaman = susunan komponen', 140, 310, {size: 28, weight: 700, color: C.redup, alpha: muncul(t, 1.2)});
  const kode = ['function Tombol() {', '  const [hitung, setHitung] = useState(0)', '  return <button onClick={() => setHitung(hitung + 1)}>Hitung: {hitung}</button>', '}'];
  const p1 = muncul(t, t1); if (p1 <= 0) return; c.save(); c.globalAlpha = p1;
  const sorot = t >= t3 ? [1] : t >= t2 ? [2] : [0, 3]; K.kode(c, kode, 140, 350, {size: 30, w: 1640, sorot, pSorot: 1});
  const ket = t >= t3 ? ['state', 'data yang diingat komponen', C.amber] : t >= t2 ? ['JSX', 'tulisan mirip HTML di dalam JavaScript', C.lime] : ['komponen', 'fungsi yang mengembalikan tampilan', C.sky];
  K.text(c, ket[0], 140, 640, {size: 54, weight: 900, color: ket[2]}); K.text(c, ket[1], 140 + K.lebar(c, ket[0], 54, 900) + 30, 644, {size: 34, weight: 700});
  c.restore();
  const p4 = muncul(t, t4); if (p4 <= 0) return; c.save(); c.globalAlpha = p4;
  const n = t < t5 + 1.0 ? 0 : Math.min(3, 1 + Math.floor((t - t5 - 1.0) / 1.8)), baru = t >= t5 + 1.0 ? K.seg((t - t5 - 1.0) % 1.8, 0, .5) : 1;
  K.rrect(c, 140, 740, 440, 220, 22, '#18213c', C.amber, 5); K.text(c, 'state', 360, 790, {size: 28, weight: 700, align: 'center', color: C.redup}); K.text(c, 'hitung = ' + n, 360, 870, {size: 52, weight: 900, align: 'center', mono: true, color: C.amber});
  K.arrow(c, 600, 850, 860, 850, C.teks, 6, muncul(t, t5)); K.text(c, 'React menggambar', 730, 892, {size: 23, weight: 800, align: 'center', alpha: muncul(t, t5)}); K.text(c, 'ulang', 730, 922, {size: 23, weight: 800, align: 'center', alpha: muncul(t, t5)});
  K.rrect(c, 880, 740, 440, 220, 22, '#f8fafc', '#cbd5e1', 4); K.text(c, 'tampilan', 1100, 790, {size: 28, weight: 700, align: 'center', color: '#64748b'});
  K.rrect(c, 960, 826, 280, 84, 16, baru < 1 ? '#fde68a' : '#e0e7ff', '#6366f1', 4); K.text(c, 'Hitung: ' + n, 1100, 870, {size: 36, weight: 800, align: 'center', color: '#1e1b4b'});
  const p6 = muncul(t, t6); if (p6 > 0) { c.globalAlpha = p4 * p6; K.text(c, 'Kita mengubah datanya.', 1380, 820, {size: 36, weight: 900, color: C.lime}); K.text(c, 'Tampilan mengikuti.', 1380, 880, {size: 36, weight: 900, color: C.lime, alpha: muncul(t, t7)}); }
  c.restore(); };
})();
