const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const U = 'http://localhost:8000';
  async function login(pg, e) { await pg.goto(U + '/masuk'); await pg.fill('input[name=email]', e); await pg.fill('input[name=password]', 'rahasia123'); await pg.click('button.tombol'); await pg.waitForTimeout(800); }
  const c1 = await b.newContext({ viewport: { width: 1180, height: 760 }, deviceScaleFactor: 2 }); const p1 = await c1.newPage();
  await login(p1, 'hendra@nusabakti.test'); await p1.goto(U + '/kelola'); await p1.waitForTimeout(500); await p1.screenshot({ path: 'kelola.png' });
  const c2 = await b.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 3, isMobile: true }); const p2 = await c2.newPage();
  await login(p2, 'lina@nusabakti.test'); await p2.goto(U + '/laporan/' + process.argv[2]); await p2.waitForTimeout(800); await p2.screenshot({ path: 'hp.png' });
  await p2.evaluate(() => window.scrollTo(0, 330)); await p2.waitForTimeout(300); await p2.screenshot({ path: 'hp2.png' });
  await b.close();
})();
