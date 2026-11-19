const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto('file:///home/user/antre/akhir/thumb_src/th.html'); await p.waitForTimeout(500); await p.screenshot({ path: 'thumbnail.png' }); await b.close(); })();
