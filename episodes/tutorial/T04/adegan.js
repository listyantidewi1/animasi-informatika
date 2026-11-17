// T04 Website Profil Diri: HTML dan CSS
K.token = (line) => { // pewarnaan HTML + CSS sederhana
  const out = []; const re = /(<\/?[a-zA-Z0-9!]+|\/?>|"[^"]*"?|[a-z-]+(?==)|[a-z-]+(?=\s*:)|\b\d+(?:px|%)?\b|#[0-9a-fA-F]{3,6}|\s+|[{};:=]|[^\s<>"{};:=]+|.)/g; let m;
  while ((m = re.exec(line))) { const s = m[0]; let col = '#e6e9f2';
    if (/^<\/?[a-zA-Z!]/.test(s) || /^\/?>$/.test(s)) col = '#60a5fa';
    else if (s[0] === '"') col = '#f9a07a';
    else if (/^[a-z-]+$/.test(s) && /=/.test(line.slice(m.index + s.length, m.index + s.length + 1))) col = '#c792ea';
    else if (/^[a-z-]+$/.test(s) && /^\s*:/.test(line.slice(m.index + s.length))) col = '#c792ea';
    else if (/^\d/.test(s) || /^#[0-9a-f]/i.test(s)) col = '#b5e48c';
    else if (/^[{};:=]$/.test(s)) col = '#ffcb6b';
    out.push([s, col]); }
  return out;
};
K.ikonTag = (c, x, y, s, w) => K.text(c, '</>', x, y, {size: s * .5, weight: 800, align: 'center', mono: true, color: w});
K.ikonKuas = (c, x, y, s, w) => { c.save(); c.translate(x, y); c.rotate(-.6); K.rrect(c, -s * .07, -s * .45, s * .14, s * .5, s * .05, w); K.rrect(c, -s * .13, s * .05, s * .26, s * .12, s * .03, '#cbd5e1'); c.fillStyle = w; c.beginPath(); c.moveTo(-s * .13, s * .17); c.quadraticCurveTo(0, s * .5, s * .13, s * .17); c.fill(); c.restore(); };
K.ikonBrowser = (c, x, y, s, w) => { K.rrect(c, x - s * .45, y - s * .34, s * .9, s * .68, s * .06, null, w, s * .05); c.fillStyle = w; c.fillRect(x - s * .45, y - s * .34, s * .9, s * .14); [0, 1, 2].forEach(i => { c.fillStyle = '#121829'; c.beginPath(); c.arc(x - s * .36 + i * s * .09, y - s * .27, s * .025, 0, 7); c.fill(); }); };
K.ikonSarang = (c, x, y, s, w) => { [0.45, 0.3, 0.15].forEach((k, i) => K.rrect(c, x - s * k, y - s * k * .8, s * k * 2, s * k * 1.6, s * .04, null, w, s * .04)); };
// halaman browser tiruan kecil
K.halaman = (c, x, y, w, h, isi) => {
  K.rrect(c, x, y, w, h, 16, '#ffffff', '#cbd5e1', 2); c.fillStyle = '#e8ecf3'; c.fillRect(x + 2, y + 2, w - 4, 44);
  ['#ff6b6b', '#ffb020', '#a3e635'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(x + 26 + i * 24, y + 24, 7, 0, 7); c.fill(); });
  K.rrect(c, x + 110, y + 10, w - 140, 26, 13, '#ffffff'); K.text(c, 'index.html', x + 128, y + 24, {size: 17, color: '#64748b'});
  if (isi) isi(x, y + 46);
};
K.kotakModel = (c, x, y, w, h, p, o = {}) => { // p: 0..4 lapisan muncul
  const s = o.skala || 1, m = 60 * s, b = 8 * s, pd = 56 * s;
  const a = i => K.out(K.clamp(p - i));
  if (p > 3) { c.save(); c.globalAlpha = a(3); c.setLineDash([14 * s, 10 * s]); K.rrect(c, x, y, w, h, 10, 'rgba(255,176,32,.12)', K.C.amber, 3); c.setLineDash([]); c.restore(); }
  if (p > 2) { c.save(); c.globalAlpha = a(2); K.rrect(c, x + m, y + m, w - 2 * m, h - 2 * m, 18 * s, K.C.coral); c.restore(); }
  if (p > 1) { c.save(); c.globalAlpha = a(1); K.rrect(c, x + m + b, y + m + b, w - 2 * m - 2 * b, h - 2 * m - 2 * b, 12 * s, '#1d6f68'); c.restore(); }
  if (p > 0) { c.save(); c.globalAlpha = a(0); const ix = x + m + b + pd, iy = y + m + b + pd, iw = w - 2 * (m + b + pd), ih = h - 2 * (m + b + pd);
    K.rrect(c, ix, iy, iw, ih, 6, '#f8fafc'); K.text(c, o.isi || 'Halo, aku Raka', ix + iw / 2, iy + ih / 2, {size: 40 * s, weight: 800, align: 'center', color: '#0f766e'}); c.restore(); }
  return {m, b, pd};
};
Object.assign(K.adegan, {
  tag(c, t, D) {
    K.bg(c); K.judul(c, 'HTML memberi label pada isi', t, K.C.sky, 'Tag pembuka dan tag penutup');
    const cy = 470, p1 = K.out(K.seg(t, .5, 1.5)), p2 = K.ease(K.seg(t, D * .42, D * .42 + 1.4)), p3 = K.ease(K.seg(t, D * .7, D * .7 + 1.6));
    const isi = 'Halo, aku Raka', wi = K.lebar(c, isi, 56, 600), gap = 22;
    const wo = K.lebar(c, '<h1>', 56, 700, true), wc = K.lebar(c, '</h1>', 56, 700, true);
    const tot = wo + wi + wc + 2 * gap, x0 = (K.W - tot) / 2;
    c.save(); c.globalAlpha = p1 * (1 - p3 * .0); K.text(c, isi, x0 + wo + gap, cy, {size: 56, weight: 600}); c.restore();
    if (p2 > 0) {
      const xo = K.lerp(x0 - 300, x0, p2), xc = K.lerp(x0 + tot + 300 - wc, x0 + tot - wc, p2);
      c.save(); c.globalAlpha = p2;
      K.rrect(c, xo - 12, cy - 44, wo + 24, 88, 14, 'rgba(96,165,250,.18)', K.C.sky, 3); K.text(c, '<h1>', xo, cy, {size: 56, weight: 700, mono: true, color: K.C.sky});
      K.rrect(c, xc - 12, cy - 44, wc + 24, 88, 14, 'rgba(96,165,250,.18)', K.C.sky, 3); K.text(c, '</h1>', xc, cy, {size: 56, weight: 700, mono: true, color: K.C.sky});
      K.text(c, 'tag pembuka', xo + wo / 2, cy + 90, {size: 28, weight: 700, align: 'center', color: K.C.redup});
      K.text(c, 'tag penutup', xc + wc / 2, cy + 90, {size: 28, weight: 700, align: 'center', color: K.C.redup});
      const ps = K.seg(t, D * .55, D * .6); if (ps > 0) { const cw = K.lebar(c, '<', 56, 700, true); c.save(); c.globalAlpha = ps; K.rrect(c, xc + cw - 4, cy - 38, K.lebar(c, '/', 56, 700, true) + 8, 76, 8, null, K.C.coral, 4);
        K.arrow(c, xc + cw + 14, cy - 140, xc + cw + 14, cy - 50, K.C.coral, 5, 1, 16); K.text(c, 'garis miring', xc + cw + 14, cy - 165, {size: 30, weight: 800, align: 'center', color: K.C.coral}); c.restore(); }
      c.restore();
    }
    if (p3 > 0) { c.save(); c.globalAlpha = p3; K.arrow(c, K.W / 2, 640, K.W / 2, 700, K.C.teal, 6, 1);
      K.halaman(c, 560, 720, 800, 260, (x, y) => { K.text(c, isi, x + 40, y + 70, {size: K.lerp(30, 64, p3), weight: 800, color: '#0f172a'}); K.text(c, 'Di browser, isi berlabel h1 tampil sebagai judul.', x + 40, y + 150, {size: 24, color: '#475569'}); });
      c.restore(); }
  },
  sarang(c, t, D) {
    K.bg(c); K.judul(c, 'Kotak di dalam kotak', t, K.C.violet, 'Tag bisa berada di dalam tag lain');
    const L = ['<body>', '    <h1>Halo, aku Raka</h1>', '    <p>Aku kelas 8.</p>', '    <ul>', '        <li>Menggambar</li>', '        <li>Bulu tangkis</li>', '    </ul>', '</body>'];
    const n = Math.floor(K.clamp(t / (D * .45)) * L.length + .999);
    K.kode(c, L.slice(0, Math.max(1, n)).concat(Array(L.length - Math.max(1, n)).fill('')), 100, 220, {size: 30, w: 760});
    const bx = 980, by = 220, a = i => K.out(K.seg(t, (D * .45) * i / L.length, (D * .45) * i / L.length + .8));
    c.save(); c.globalAlpha = a(0); K.rrect(c, bx, by, 840, 660, 18, 'rgba(96,165,250,.08)', K.C.sky, 4); K.text(c, 'body', bx + 24, by + 34, {size: 28, weight: 800, mono: true, color: K.C.sky}); c.restore();
    c.save(); c.globalAlpha = a(1); K.rrect(c, bx + 40, by + 70, 760, 90, 12, 'rgba(255,176,32,.12)', K.C.amber, 3); K.text(c, 'h1', bx + 60, by + 115, {size: 26, weight: 800, mono: true, color: K.C.amber}); K.text(c, 'Halo, aku Raka', bx + 120, by + 115, {size: 32, weight: 800}); c.restore();
    c.save(); c.globalAlpha = a(2); K.rrect(c, bx + 40, by + 180, 760, 80, 12, 'rgba(45,212,191,.12)', K.C.teal, 3); K.text(c, 'p', bx + 60, by + 220, {size: 26, weight: 800, mono: true, color: K.C.teal}); K.text(c, 'Aku kelas 8.', bx + 120, by + 220, {size: 28}); c.restore();
    c.save(); c.globalAlpha = a(3); K.rrect(c, bx + 40, by + 280, 760, 330, 12, 'rgba(167,139,250,.12)', K.C.violet, 3); K.text(c, 'ul', bx + 60, by + 315, {size: 26, weight: 800, mono: true, color: K.C.violet}); c.restore();
    [4, 5].forEach((k, i) => { c.save(); c.globalAlpha = a(k); K.rrect(c, bx + 90, by + 350 + i * 120, 660, 96, 10, 'rgba(163,230,53,.12)', K.C.lime, 3); K.text(c, 'li', bx + 110, by + 398 + i * 120, {size: 26, weight: 800, mono: true, color: K.C.lime}); K.text(c, ['Menggambar', 'Bulu tangkis'][i], bx + 170, by + 398 + i * 120, {size: 28}); c.restore(); });
    const q = K.seg(t, D * .62, D * .95);
    if (q > 0) { const urut = [[5, 'li', by + 518], [6, 'ul', by + 600], [7, 'body', by + 650]];
      urut.forEach(([ln, nama, yy], i) => { const pp = K.out(K.seg(q, i / 3, i / 3 + .25)); if (pp <= 0) return; c.save(); c.globalAlpha = pp;
        K.rrect(c, 70, 220 + 25 + 30 * 1.55 * ln + 2, 36, 40, 8, K.C.coral); K.text(c, String(i + 1), 88, 220 + 25 + 30 * 1.55 * ln + 23, {size: 24, weight: 800, align: 'center', color: '#121829'}); c.restore(); });
      K.text(c, 'Tutup yang paling dalam lebih dulu', 480, 940, {size: 34, weight: 800, align: 'center', color: K.C.coral, alpha: K.out(q * 3)}); }
  },
  css(c, t, D) {
    K.bg(c); K.judul(c, 'CSS mengatur tampilan', t, K.C.pink, 'HTML itu kerangka, CSS itu cat dan tata letaknya');
    const p = K.ease(K.seg(t, D * .2, D * .2 + 2.2)), hx = 300, hy = 300;
    const rumah = (x, y, s, warna) => {
      c.save(); c.translate(x, y); c.scale(s, s);
      if (warna) { c.fillStyle = '#f59e0b'; c.fillRect(0, 160, 420, 260); c.fillStyle = '#ef4444'; c.beginPath(); c.moveTo(-30, 170); c.lineTo(210, 20); c.lineTo(450, 170); c.fill();
        c.fillStyle = '#7c2d12'; c.fillRect(170, 280, 80, 140); c.fillStyle = '#7dd3fc'; c.fillRect(50, 220, 90, 70); c.fillRect(280, 220, 90, 70); c.fillStyle = '#16a34a'; c.fillRect(-60, 420, 540, 18); }
      else { c.strokeStyle = '#94a3b8'; c.lineWidth = 5; c.setLineDash([12, 8]); c.strokeRect(0, 160, 420, 260); c.beginPath(); c.moveTo(-30, 170); c.lineTo(210, 20); c.lineTo(450, 170); c.stroke();
        c.strokeRect(170, 280, 80, 140); c.strokeRect(50, 220, 90, 70); c.strokeRect(280, 220, 90, 70); c.setLineDash([]); }
      c.restore(); };
    const s = K.lerp(1, .8, K.ease(K.seg(t, D * .5, D * .5 + 1.2))), dx = K.lerp(0, -120, K.ease(K.seg(t, D * .5, D * .5 + 1.2)));
    c.save(); c.globalAlpha = 1 - p; rumah(hx + dx, hy, s, false); c.restore();
    c.save(); c.globalAlpha = p; rumah(hx + dx, hy, s, true); c.restore();
    K.text(c, p < .5 ? 'HTML: kerangka' : 'HTML + CSS', hx + dx + 210 * s, hy + 480 * s, {size: 34, weight: 800, align: 'center', color: p < .5 ? '#94a3b8' : K.C.pink});
    const q = K.seg(t, D * .5, D * .5 + 1.2);
    if (q > 0) {
      const parts = [['h1', K.C.sky, 'selector', 'bagian mana'], [' { ', '#ffcb6b'], ['color', K.C.violet, 'properti', 'apa yang diubah'], [': ', '#ffcb6b'], ['teal', K.C.teal, 'nilai', 'menjadi apa'], ['; }', '#ffcb6b']];
      let x = 900; const y = 520; c.save(); c.globalAlpha = K.out(q);
      parts.forEach(([s_, col, lab, sub], i) => { const w = K.lebar(c, s_, 70, 700, true); K.text(c, s_, x, y, {size: 70, weight: 700, mono: true, color: col});
        if (lab) { const k = [0, 0, 1, 0, 2][i], pp = K.out(K.seg(t, D * .62 + k * D * .09, D * .62 + k * D * .09 + .8));
          if (pp > 0) { c.save(); c.globalAlpha = pp; c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y + 55); c.lineTo(x, y + 70); c.lineTo(x + w, y + 70); c.lineTo(x + w, y + 55); c.stroke();
            K.text(c, lab, x + w / 2, y + 115, {size: 36, weight: 800, align: 'center', color: col}); K.text(c, sub, x + w / 2, y + 160, {size: 26, weight: 600, align: 'center', color: K.C.redup}); c.restore(); } }
        x += w; });
      c.restore(); }
  },
  kotak(c, t, D) {
    K.bg(c); K.judul(c, 'Setiap elemen adalah kotak', t, K.C.teal, 'Isi, padding, border, dan margin');
    const tl = [D * .08, D * .28, D * .55, D * .72], p = tl.reduce((s, a, i) => s + K.seg(t, a, a + .9), 0);
    const x = 200, y = 230, w = 900, h = 620; const g = K.kotakModel(c, x, y, w, h, p);
    const lab = [['isi', '#f8fafc', y + h / 2, 'teks atau gambar'], ['padding', K.C.teal, y + g.m + g.b + g.pd / 2, 'jarak isi ke pinggir (busa di dalam kardus)'], ['border', K.C.coral, y + g.m + g.b / 2, 'garis pinggir kotak'], ['margin', K.C.amber, y + g.m / 2, 'jarak ke kotak lain']];
    const ax = [x + w - (g.m + g.b + g.pd) - 80, x + w - (g.m + g.b + g.pd / 2), x + w - (g.m + g.b / 2), x + w - g.m / 2], LY = [560, 400, 680, 800];
    lab.forEach(([n, col, yy, sub], i) => { const pp = K.out(K.seg(t, tl[i] + .3, tl[i] + 1.1)); if (pp <= 0) return; c.save(); c.globalAlpha = pp;
      const ly = LY[i]; c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(ax[i], ly); c.lineTo(1180, ly); c.stroke();
      c.fillStyle = col; c.strokeStyle = '#121829'; c.lineWidth = 3; c.beginPath(); c.arc(ax[i], ly, 9, 0, 7); c.fill(); c.stroke();
      K.text(c, n, 1200, ly - 10, {size: 44, weight: 800, mono: true, color: col}); K.text(c, sub, 1200, ly + 34, {size: 26, weight: 600, color: K.C.redup, maxW: 680}); c.restore(); });
  },
  g_srcHref(c, t, D, a, r) {
    const p = K.out(K.seg(t, 1, 2)); c.save(); c.globalAlpha = p;
    const cx1 = r.x + r.w * .25, cx2 = r.x + r.w * .72, y = r.y + 40;
    K.text(c, 'src', cx1, y, {size: 40, weight: 800, mono: true, align: 'center', color: K.C.violet}); K.text(c, 'alamat file gambar', cx1, y + 46, {size: 28, align: 'center', color: K.C.redup});
    K.rrect(c, cx1 - 90, y + 90, 180, 180, 90, '#7dd3c0'); c.fillStyle = '#f1c39b'; c.beginPath(); c.arc(cx1, y + 170, 46, 0, 7); c.fill(); c.fillStyle = '#2b2118'; c.beginPath(); c.arc(cx1, y + 160, 48, Math.PI, 0); c.fill();
    c.fillStyle = '#f59e0b'; c.beginPath(); c.arc(cx1, y + 290, 70, Math.PI * 1.15, Math.PI * 1.85); c.fill();
    K.text(c, 'raka.png', cx1, y + 300, {size: 26, weight: 700, mono: true, align: 'center', color: K.C.teks});
    K.text(c, 'href', cx2, y, {size: 40, weight: 800, mono: true, align: 'center', color: K.C.violet}); K.text(c, 'alamat tujuan saat link diklik', cx2, y + 46, {size: 28, align: 'center', color: K.C.redup});
    K.text(c, 'Tempat aku belajar', cx2 - 200, y + 150, {size: 32, weight: 600, color: K.C.sky}); c.fillStyle = K.C.sky; c.fillRect(cx2 - 200, y + 172, K.lebar(c, 'Tempat aku belajar', 32, 600), 3);
    K.arrow(c, cx2 + 130, y + 150, cx2 + 230, y + 150, K.C.teal, 5, K.out(K.seg(t, 2, 3)));
    K.ikonBrowser(c, cx2 + 320, y + 160, 150, K.C.teal);
    c.restore();
  },
  g_kartu(c, t, D, a, r) {
    const p = K.seg(t, .8, D * .7) * 4; const w = Math.min(760, r.w * .55), h = r.h;
    K.kotakModel(c, r.x + 40, r.y, w, h, p, {skala: .6, isi: 'kartu profil'});
    const items = [['padding: 24px', K.C.teal, 'jarak di dalam kartu'], ['border-radius: 16px', K.C.coral, 'sudut melengkung'], ['max-width: 400px', K.C.sky, 'lebar paling besar'], ['margin: 40px auto', K.C.amber, 'jarak luar, kartu ke tengah']];
    items.forEach(([k, col, sub], i) => { const pp = K.out(K.seg(t, 1 + i * D * .15, 1.8 + i * D * .15)); if (pp <= 0) return; c.save(); c.globalAlpha = pp;
      K.text(c, k, r.x + w + 120, r.y + 30 + i * (h / 4), {size: 32, weight: 700, mono: true, color: col}); K.text(c, sub, r.x + w + 120, r.y + 70 + i * (h / 4), {size: 24, color: K.C.redup}); c.restore(); });
  },
});
