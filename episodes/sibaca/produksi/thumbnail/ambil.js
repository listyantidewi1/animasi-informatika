const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  for (const n of ['t1', 't2', 't3']) { await p.goto('file:///home/user/baca/thumbnail/' + n + '.html'); await p.waitForTimeout(500); await p.screenshot({ path: '/home/user/baca/thumbnail/thumbnail_' + n.slice(1) + '.png' }); }
  await b.close(); })();
