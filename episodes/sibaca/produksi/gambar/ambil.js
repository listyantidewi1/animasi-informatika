// Tangkapan layar aplikasi jadi (HP dan laptop) untuk adegan pembuka, thumbnail, dan README.
const { chromium } = require('playwright');
const U = 'http://localhost:3000', G = '/home/user/baca/gambar/';
(async () => {
  const b = await chromium.launch();
  const hp = await b.newContext({ viewport: { width: 400, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await hp.newPage(); await p.goto(U); await p.waitForTimeout(600);
  const s = async (n) => { await p.waitForTimeout(500); await p.screenshot({ path: G + 'hp_' + n + '.png' }); };
  await s('masuk'); await p.fill('input', '2425102'); await p.fill('input[type=password]', 'rahasia123'); await s('masuk_isi');
  await p.click('button'); await p.waitForTimeout(600); await s('katalog');
  await p.fill('input', 'bumi'); await p.waitForTimeout(500); await s('cari');
  await p.click('li:first-child button'); await s('pinjam');
  await p.click('text=Pinjamanku'); await s('pinjamanku');
  const d = await b.newContext({ viewport: { width: 1180, height: 740 }, deviceScaleFactor: 2 }); const q = await d.newPage(); await q.goto(U);
  await q.fill('input', 'petugas'); await q.fill('input[type=password]', 'rahasia123'); await q.click('button'); await q.waitForTimeout(700);
  await q.screenshot({ path: G + 'pc_katalog.png' });
  await q.click('text=Peminjaman'); await q.waitForTimeout(600); await q.screenshot({ path: G + 'pc_peminjaman.png' });
  await q.click('text=Anggota'); await q.waitForTimeout(600); await q.screenshot({ path: G + 'pc_anggota.png' });
  await b.close();
})();
