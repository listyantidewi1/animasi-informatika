// T09 Kipas otomatis: input-proses-output, setup/loop, keputusan HIGH/LOW, dari simulator ke alat sungguhan
K.esp = (c, x, y, s, warna = K.C.violet) => { // papan ESP32 sederhana, (x,y) = pusat, s = tinggi
  const w = s * .55, h = s;
  K.rrect(c, x - w / 2, y - h / 2, w, h, s * .04, '#141414', warna, 4);
  K.rrect(c, x - w * .36, y - h * .44, w * .72, h * .36, s * .02, '#b9bec8');
  K.text(c, 'ESP32', x, y - h * .27, {size: s * .09, weight: 800, align: 'center', color: '#3a3f4a'});
  for (let i = 0; i < 12; i++) { const yy = y - h * .4 + i * h * .075; c.fillStyle = '#f5c518';
    c.beginPath(); c.arc(x - w / 2 + s * .04, yy, s * .016, 0, 7); c.fill(); c.beginPath(); c.arc(x + w / 2 - s * .04, yy, s * .016, 0, 7); c.fill(); }
  K.rrect(c, x - w * .14, y + h * .38, w * .28, h * .1, s * .01, '#9aa0aa');
};
K.wifi = (c, x, y, s, p, warna) => { if (p <= 0) return; c.save(); c.strokeStyle = warna; c.lineWidth = s * .08; c.lineCap = 'round';
  for (let i = 1; i <= 3; i++) { c.globalAlpha = K.clamp(p * 3 - (i - 1)); c.beginPath(); c.arc(x, y, s * .22 * i, -Math.PI * .75, -Math.PI * .25); c.stroke(); }
  c.globalAlpha = p; c.fillStyle = warna; c.beginPath(); c.arc(x, y, s * .06, 0, 7); c.fill(); c.restore(); };
K.kipas = (c, x, y, r, rot, warna, nyala) => { // baling-baling kipas
  c.save(); c.translate(x, y); c.strokeStyle = warna; c.lineWidth = r * .06; c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke();
  c.rotate(rot); c.fillStyle = nyala ? warna : '#5b6684';
  for (let i = 0; i < 3; i++) { c.rotate(Math.PI * 2 / 3); c.beginPath(); c.ellipse(0, -r * .48, r * .2, r * .42, 0, 0, 7); c.fill(); }
  c.beginPath(); c.arc(0, 0, r * .14, 0, 7); c.fillStyle = '#eef2fb'; c.fill(); c.restore(); };
K.termo = (c, x, y, h, suhu, batas) => { // termometer: (x,y) = pusat bola bawah, rentang 20..40
  const lw = h * .12, f = K.clamp((suhu - 20) / 20), atas = y - h;
  K.rrect(c, x - lw / 2, atas, lw, h, lw / 2, '#16203a', K.C.garis, 4);
  const panas = suhu > (batas ?? 99); c.fillStyle = panas ? K.C.coral : K.C.sky;
  c.fillRect(x - lw * .22, y - (h - lw) * f - lw * .2, lw * .44, (h - lw) * f + lw * .2);
  c.beginPath(); c.arc(x, y, lw * .9, 0, 7); c.fill();
  for (let v = 20; v <= 40; v += 5) { const yy = y - lw * .2 - (h - lw) * (v - 20) / 20; c.fillStyle = K.C.redup; c.fillRect(x + lw * .6, yy - 1, lw * .4, 3);
    K.text(c, String(v), x + lw * 1.2, yy, {size: h * .055, weight: 700, color: K.C.redup}); }
  if (batas !== undefined) { const yy = y - lw * .2 - (h - lw) * (batas - 20) / 20; c.save(); c.setLineDash([12, 10]); c.strokeStyle = K.C.amber; c.lineWidth = 4;
    c.beginPath(); c.moveTo(x - lw * 2.4, yy); c.lineTo(x + lw * .55, yy); c.stroke(); c.restore();
    K.text(c, 'BATAS', x - lw * 2.6, yy, {size: h * .06, weight: 800, align: 'right', color: K.C.amber}); }
};
K.lcd = (c, x, y, w, l1, l2) => { const h = w * .36; K.rrect(c, x, y, w, h, 10, '#0b7a3e'); K.rrect(c, x + w * .05, y + h * .14, w * .9, h * .72, 8, '#9fd21b');
  K.text(c, l1, x + w * .09, y + h * .35, {size: w * .085, weight: 700, mono: true, color: '#1a2a06'}); K.text(c, l2, x + w * .09, y + h * .65, {size: w * .085, weight: 700, mono: true, color: '#1a2a06'}); };
K.sensor = (c, x, y, s) => { const w = s * .62; K.rrect(c, x - w / 2, y - s / 2, w, s * .8, s * .08, '#f2f4f8', '#9aa6c4', 3);
  c.beginPath(); c.arc(x, y - s * .34, s * .1, 0, 7); c.strokeStyle = '#9aa6c4'; c.lineWidth = 3; c.stroke();
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) K.rrect(c, x - w * .3 + j * w * .22, y - s * .16 + i * s * .12, w * .16, s * .08, 3, null, '#9aa6c4', 2);
  for (let i = 0; i < 3; i++) { c.fillStyle = '#c0c6d4'; c.fillRect(x - w * .2 + i * w * .2 - 3, y + s * .3, 6, s * .2); } };
Object.assign(K.adegan, {
  ipo(c, t, D) {
    K.bg(c); K.judul(c, 'Input, proses, output', t, K.C.teal, 'Tiga bagian di setiap alat IoT');
    const kol = [{x: 360, w: K.C.sky, j: 'INPUT', s: 'sensor suhu DHT22', a: .08}, {x: 960, w: K.C.violet, j: 'PROSES', s: 'otak: ESP32', a: .3}, {x: 1560, w: K.C.amber, j: 'OUTPUT', s: 'layar LCD dan kipas', a: .5}];
    kol.forEach((k, i) => { const p = K.out(K.seg(t, D * k.a, D * k.a + .8)); if (p <= 0) return;
      K.panel(c, k.x - 250, 230, 500, 640, p, k.w); c.save(); c.globalAlpha = p;
      K.text(c, k.j, k.x, 300, {size: 48, weight: 800, align: 'center', color: k.w});
      if (i === 0) { K.sensor(c, k.x, 530, 260); K.termo(c, k.x + 160, 640, 220, 26 + 4 * Math.sin(t)); }
      if (i === 1) K.esp(c, k.x, 540, 340);
      if (i === 2) { K.lcd(c, k.x - 200, 380, 400, 'Suhu: 31.0 C', 'Kipas: NYALA'); K.kipas(c, k.x, 650, 90, t * 9, K.C.amber, true); }
      K.text(c, k.s, k.x, 820, {size: 32, weight: 700, align: 'center', color: K.C.redup}); c.restore(); });
    const pa = K.out(K.seg(t, D * .3, D * .38)), pb = K.out(K.seg(t, D * .5, D * .58));
    K.arrow(c, 620, 550, 700, 550, K.C.teks, 6, pa); K.arrow(c, 1220, 550, 1300, 550, K.C.teks, 6, pb);
    if (pa >= 1) { const q = (t * .6) % 1; c.fillStyle = K.C.sky; c.beginPath(); c.arc(K.lerp(620, 700, q), 550, 9, 0, 7); c.fill(); }
    if (pb >= 1) { const q = (t * .6 + .5) % 1; c.fillStyle = K.C.amber; c.beginPath(); c.arc(K.lerp(1220, 1300, q), 550, 9, 0, 7); c.fill(); }
    const pw = K.out(K.seg(t, D * .78, D * .9)); if (pw > 0) { K.wifi(c, 1130, 420, 110, pw, K.C.teal); K.text(c, 'WiFi → internet', 960, 960, {size: 40, weight: 800, align: 'center', color: K.C.teal, alpha: pw}); }
  },
  setuploop(c, t, D) {
    K.bg(c); K.judul(c, 'setup() dan loop()', t, K.C.violet, 'Sekali di awal, lalu berulang terus');
    const p1 = K.out(K.seg(t, .4, 1.2)); K.panel(c, 140, 260, 560, 600, p1, K.C.sky);
    c.save(); c.globalAlpha = p1; K.text(c, 'setup()', 420, 340, {size: 52, weight: 800, mono: true, align: 'center', color: K.C.sky});
    K.text(c, 'dijalankan 1 kali', 420, 410, {size: 32, weight: 700, align: 'center', color: K.C.redup});
    ['siapkan sensor', 'nyalakan layar', 'atur pin kipas'].forEach((s, i) => { const q = K.out(K.seg(t, D * .12 + i * .7, D * .12 + i * .7 + .5));
      K.rrect(c, 200, 470 + i * 110, 440, 84, 16, '#16203a', K.C.garis, 3); K.text(c, s, 240, 512 + i * 110, {size: 34, weight: 700});
      if (q > 0) K.text(c, '✓', 600, 512 + i * 110, {size: 40, weight: 800, align: 'center', color: K.C.lime, alpha: q}); }); c.restore();
    const p2 = K.out(K.seg(t, D * .35, D * .45)); if (p2 <= 0) return;
    K.arrow(c, 720, 560, 860, 560, K.C.teks, 6, p2);
    K.panel(c, 880, 260, 900, 600, p2, K.C.violet); c.save(); c.globalAlpha = p2;
    K.text(c, 'loop()', 1330, 340, {size: 52, weight: 800, mono: true, align: 'center', color: K.C.violet});
    const cx = 1330, cy = 610, R = 190, st = [['baca suhu', K.C.sky], ['putuskan', K.C.violet], ['tampilkan', K.C.amber]];
    c.strokeStyle = K.C.garis; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke();
    const jalan = Math.max(0, t - D * .45), ang = jalan * 1.6 - Math.PI / 2;
    st.forEach(([s, w], i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 3, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      const d = Math.abs(((ang - a) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI), akt = d < .5;
      K.rrect(c, x - 130, y - 38, 260, 76, 38, akt ? w : '#16203a', w, 4); K.text(c, s, x, y + 1, {size: 32, weight: 800, align: 'center', color: akt ? '#141a2c' : K.C.teks}); });
    c.fillStyle = K.C.teks; c.beginPath(); c.arc(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, 14, 0, 7); c.fill();
    K.text(c, 'putaran ke-' + (1 + Math.floor(jalan * 1.6 / (Math.PI * 2))), cx, cy, {size: 34, weight: 700, align: 'center', color: K.C.redup}); c.restore();
  },
  keputusan(c, t, D) {
    K.bg(c); K.judul(c, 'Mengambil keputusan', t, K.C.amber, 'if (suhu > BATAS) ... else ...');
    const p = K.out(K.seg(t, .4, 1.2)); c.save(); c.globalAlpha = p;
    const u = K.seg(t, D * .2, D * .75), suhu = 26 + 8 * Math.sin(Math.PI * u), panas = suhu > 30;
    K.termo(c, 300, 820, 520, suhu, 30); K.text(c, suhu.toFixed(1) + ' °C', 300, 920, {size: 48, weight: 800, mono: true, align: 'center', color: panas ? K.C.coral : K.C.sky});
    // belah ketupat
    const dx = 820, dy = 560; c.beginPath(); c.moveTo(dx, dy - 150); c.lineTo(dx + 230, dy); c.lineTo(dx, dy + 150); c.lineTo(dx - 230, dy); c.closePath();
    c.fillStyle = '#2a2440'; c.fill(); c.strokeStyle = K.C.amber; c.lineWidth = 5; c.stroke();
    K.text(c, 'suhu > BATAS ?', dx, dy, {size: 36, weight: 800, mono: true, align: 'center'});
    K.arrow(c, 460, 560, 580, 560, K.C.teks, 6, 1);
    K.path(c, [[dx + 230, dy], [1130, dy], [1130, 380], [1220, 380]], panas ? K.C.lime : K.C.garis, 6, 1);
    K.path(c, [[dx, dy + 150], [dx, 800], [1220, 800]], panas ? K.C.garis : K.C.sky, 6, 1);
    K.text(c, 'ya', 1060, dy - 30, {size: 32, weight: 800, color: K.C.lime}); K.text(c, 'tidak', dx + 20, 720, {size: 32, weight: 800, color: K.C.sky});
    K.rrect(c, 1220, 320, 300, 120, 20, panas ? 'rgba(163,230,53,.18)' : '#16203a', panas ? K.C.lime : K.C.garis, 4);
    K.text(c, 'HIGH', 1370, 360, {size: 44, weight: 800, mono: true, align: 'center', color: K.C.lime}); K.text(c, 'listrik mengalir', 1370, 412, {size: 26, weight: 700, align: 'center', color: K.C.redup});
    K.rrect(c, 1220, 740, 300, 120, 20, !panas ? 'rgba(96,165,250,.16)' : '#16203a', !panas ? K.C.sky : K.C.garis, 4);
    K.text(c, 'LOW', 1370, 780, {size: 44, weight: 800, mono: true, align: 'center', color: K.C.sky}); K.text(c, 'listrik berhenti', 1370, 832, {size: 26, weight: 700, align: 'center', color: K.C.redup});
    K.kipas(c, 1690, 580, 120, panas ? t * 12 : 0.3, panas ? K.C.lime : K.C.redup, panas);
    K.text(c, panas ? 'kipas NYALA' : 'kipas MATI', 1690, 760, {size: 36, weight: 800, align: 'center', color: panas ? K.C.lime : K.C.redup}); c.restore();
  },
  alatnyata(c, t, D) {
    K.bg(c); K.judul(c, 'Dari simulator ke alat sungguhan', t, K.C.teal, 'Kode yang sama, papan yang nyata');
    const p1 = K.out(K.seg(t, .4, 1.2)), p2 = K.out(K.seg(t, D * .22, D * .32)), p3 = K.out(K.seg(t, D * .5, D * .6)), p4 = K.out(K.seg(t, D * .78, D * .88));
    c.save(); c.globalAlpha = p1; // laptop
    K.rrect(c, 120, 420, 320, 210, 14, '#16203a', K.C.garis, 5); K.kode(c, ['loop() {', '  ...', '}'], 150, 450, {size: 24}); K.rrect(c, 90, 630, 380, 26, 10, K.C.garis);
    K.text(c, 'laptop', 280, 700, {size: 30, weight: 700, align: 'center', color: K.C.redup});
    K.path(c, [[470, 560], [600, 560]], K.C.teks, 6, 1); K.text(c, 'USB', 535, 525, {size: 28, weight: 800, align: 'center', color: K.C.teks});
    K.esp(c, 720, 560, 280); c.restore();
    if (p2 > 0) { c.save(); c.globalAlpha = p2; K.path(c, [[810, 600], [960, 600]], K.C.amber, 6, p2);
      K.rrect(c, 960, 520, 210, 160, 16, '#1d3b8a', K.C.sky, 4); K.text(c, 'relay', 1065, 600, {size: 38, weight: 800, align: 'center'});
      K.path(c, [[1170, 600], [1290, 600]], K.C.coral, 8, p2); K.text(c, 'saklar yang dikendalikan pin', 1065, 730, {size: 26, weight: 700, align: 'center', color: K.C.redup});
      const on = t > D * .32; K.kipas(c, 1420, 560, 120, on ? t * 12 : 0, on ? K.C.lime : K.C.redup, on); c.fillStyle = '#5b6684'; c.fillRect(1412, 680, 16, 140); K.rrect(c, 1340, 815, 160, 26, 10, '#5b6684');
      K.text(c, 'kipas asli', 1420, 880, {size: 30, weight: 700, align: 'center', color: K.C.redup}); c.restore(); }
    if (p3 > 0) { K.wifi(c, 720, 380, 130, p3, K.C.teal); c.save(); c.globalAlpha = p3;
      K.rrect(c, 1620, 300, 200, 380, 30, '#0d1222', K.C.garis, 6); K.text(c, 'Suhu', 1720, 400, {size: 30, weight: 700, align: 'center', color: K.C.redup});
      K.text(c, '31.2°C', 1720, 460, {size: 46, weight: 800, align: 'center', color: K.C.coral}); K.rrect(c, 1650, 530, 140, 64, 32, K.C.lime);
      K.text(c, 'NYALA', 1720, 563, {size: 28, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
      const q = (t * .5) % 1; for (let i = 0; i < 3; i++) { const qq = (q + i / 3) % 1; c.fillStyle = K.C.teal; c.globalAlpha = p3 * (1 - qq);
        c.beginPath(); c.arc(K.lerp(800, 1610, qq), K.lerp(360, 360, qq) - Math.sin(qq * Math.PI) * 120, 10, 0, 7); c.fill(); } c.globalAlpha = 1; }
    if (p4 > 0) { K.rrect(c, K.W / 2 - 420, 930, 840, 90, 45, 'rgba(45,212,191,.15)', K.C.teal, 4);
      K.text(c, 'Internet of Things (IoT)', K.W / 2, 976, {size: 46, weight: 800, align: 'center', color: K.C.teal, alpha: p4}); }
  },
});
K.ikonIPO = (c, x, y, s, w) => { [-1, 0, 1].forEach(i => K.rrect(c, x + i * s * .36 - s * .12, y - s * .12, s * .24, s * .24, s * .04, null, w, s * .04));
  K.arrow(c, x - s * .22, y, x - s * .14, y, w, s * .03, 1, s * .06); K.arrow(c, x + s * .14, y, x + s * .22, y, w, s * .03, 1, s * .06); };
K.ikonKipas = (c, x, y, s, w) => K.kipas(c, x, y, s * .36, .4, w, true);
K.ikonTermo = (c, x, y, s, w) => { K.sensor(c, x, y, s * .7); };
