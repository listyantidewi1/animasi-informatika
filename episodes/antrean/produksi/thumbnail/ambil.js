const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const base = 'http://localhost:3000';
  const tv = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
  const ptv = await tv.newPage(); await ptv.goto(base + '/tv.html'); await ptv.waitForTimeout(800);
  await ptv.click('#suara');
  const pet = await b.newContext();
  const pp = await pet.newPage(); await pp.goto(base + '/petugas.html');
  const out = await pp.evaluate(async () => {
    const j = (u, o) => fetch(u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(o || {}) }).then(async r => [r.status, await r.json()]);
    const a = await j('/api/login', { username: 'dina', password: 'rahasia123' });
    const res = [a];
    for (let i = 0; i < 3; i++) { res.push(await j('/api/loket/1/panggil')); await new Promise(r => setTimeout(r, 700)); }
    res.push(await j('/api/tiket', { service_id: 1 }));
    return res;
  });
  console.log(JSON.stringify(out));
  await ptv.waitForTimeout(2500);
  await ptv.screenshot({ path: 'tv.png' });
  const tk = out[out.length - 1][1];
  const hp = await b.newContext({ viewport: { width: 400, height: 780 }, deviceScaleFactor: 3, isMobile: true });
  const ph = await hp.newPage(); await ph.goto(base + '/tiket.html?kode=' + (tk.public_code || tk.kode || tk.code)); await ph.waitForTimeout(1500);
  await ph.screenshot({ path: 'hp.png' });
  await b.close();
})();
