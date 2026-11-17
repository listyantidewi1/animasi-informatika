// A12 Online dengan Docker dan HTTPS
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
const gembok = (c, x, y, s, w) => { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = w; c.lineWidth = 8; c.beginPath(); c.arc(0, -18, 20, Math.PI, 0); c.stroke();
  K.rrect(c, -30, -18, 60, 46, 8, w); c.restore(); };
const laptop = (c, x, y, s = 1) => { c.save(); c.translate(x, y); c.scale(s, s); K.rrect(c, -150, -110, 300, 190, 12, '#1e293b', '#94a3b8', 5); c.fillStyle = '#94a3b8'; c.fillRect(-190, 80, 380, 18); c.restore(); };
const dunia = (c, x, y, r, w) => { c.strokeStyle = w; c.lineWidth = 4; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); c.beginPath(); c.ellipse(x, y, r * .45, r, 0, 0, 7); c.stroke();
  c.beginPath(); c.moveTo(x - r, y); c.lineTo(x + r, y); c.stroke(); };
AD.keluarLaptop = (c, t, D) => {
  K.bg(c); K.judul(c, 'Keluar dari laptop', t, C.lime, 'Bab terakhir');
  laptop(c, 340, 560); K.text(c, 'localhost:3000', 340, 520, {size: 26, weight: 700, align: 'center', mono: true, color: C.redup});
  const p = O(S(t, D * .2, D * .35)); if (p > 0) { K.arrow(c, 560, 540, 780, 540, C.lime, 5, p, 16); c.save(); c.globalAlpha = p; dunia(c, 960, 540, 140, C.sky); c.restore(); }
  const q = O(S(t, D * .4, D * .55)); if (q > 0) { K.arrow(c, 1130, 540, 1330, 540, C.lime, 5, q, 16); c.save(); c.globalAlpha = q;
    K.hp(c, 1400, 330, 240, 460, (c, x, y, w, h) => { K.rrect(c, x + 10, y + 16, w - 20, 34, 8, '#e2e8f0'); gembok(c, x + 30, y + 36, .3, '#15803d');
      K.text(c, 'antre.bengkel…', x + 48, y + 34, {size: 15, weight: 700, color: '#334155'}); K.text(c, 'B-004', x + w / 2, y + 180, {size: 50, weight: 900, align: 'center', color: '#1d4ed8'}); }); c.restore(); }
  const r = O(S(t, D * .7, D * .8)); if (r > 0) K.text(c, 'Dipindai dari QR, dibuka dari HP siapa saja, lewat HTTPS', 960, 900, {size: 36, weight: 800, align: 'center', alpha: r});
};
AD.arsitekturVPS = (c, t, D) => {
  K.bg(c); K.judul(c, 'Server di internet (VPS)', t, C.sky, 'Domain → alamat IP → tiga bagian di dalam server');
  const p0 = O(S(t, .3, .9)); K.rrect(c, 120, 440, 330, 100, 16, 'rgba(56,189,248,.08)', C.sky, 3); K.text(c, 'antre.bengkel…', 285, 478, {size: 26, weight: 800, align: 'center', mono: true, alpha: p0}); K.text(c, '→ 203.0.113.7', 285, 512, {size: 24, weight: 700, align: 'center', mono: true, color: C.redup, alpha: p0});
  K.rrect(c, 520, 260, 1280, 500, 26, 'rgba(255,255,255,.02)', '#475569', 4); K.text(c, 'VPS', 560, 300, {size: 30, weight: 900, color: C.redup});
  const kot = [['Nginx', 'pintu depan', C.amber, 600], ['Node.js', 'aplikasi kita', C.lime, 1000], ['PostgreSQL', 'data', C.violet, 1400]];
  kot.forEach(([n, s, w, x], i) => { const p = O(S(t, D * (.2 + i * .15), D * (.27 + i * .15))); if (p <= 0) return;
    c.save(); c.globalAlpha = p; K.rrect(c, x, 410, 320, 160, 20, '#0d1222', w, 4); K.text(c, n, x + 160, 470, {size: 38, weight: 900, align: 'center', color: w}); K.text(c, s, x + 160, 520, {size: 26, weight: 700, align: 'center', color: C.redup});
    K.arrow(c, x - 80, 490, x - 6, 490, '#94a3b8', 4, 1, 14); c.restore(); });
  const q = O(S(t, D * .75, D * .82)); if (q > 0) { gembok(c, 1560, 640, .7, C.violet); K.text(c, 'tertutup dari internet', 1560, 720, {size: 24, weight: 700, align: 'center', color: C.violet, alpha: q}); }
};
AD.envRahasia = (c, t, D) => {
  K.bg(c); K.judul(c, 'Rahasia di environment variable', t, C.amber);
  const berkas = (x, y, nama, isi, w, p, coret) => { if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, x, y, 620, 260, 18, '#0d1222', w, 3);
    K.text(c, nama, x + 30, y + 44, {size: 32, weight: 900, mono: true, color: w}); isi.forEach((s, i) => K.text(c, s, x + 30, y + 110 + i * 46, {size: 26, weight: 600, mono: true})); c.restore(); };
  berkas(160, 280, '.env', ['DB_PASSWORD=9f3c…', 'SESSION_SECRET=a71e…', 'ALAMAT_PUBLIK=https://…'], C.coral, O(S(t, .3, .9)));
  berkas(1140, 280, '.env.example', ['DB_PASSWORD=', 'SESSION_SECRET=', 'ALAMAT_PUBLIK=https://…'], C.lime, O(S(t, D * .45, D * .55)));
  const p = O(S(t, D * .2, D * .3)); if (p > 0) { K.rrect(c, 160, 600, 620, 90, 16, 'rgba(255,107,107,.08)', C.coral, 3); K.text(c, '.gitignore: tidak pernah masuk Git', 470, 646, {size: 28, weight: 800, align: 'center', color: C.coral, alpha: p}); }
  const q = O(S(t, D * .6, D * .7)); if (q > 0) { K.rrect(c, 1140, 600, 620, 90, 16, 'rgba(163,230,53,.08)', C.lime, 3); K.text(c, 'masuk Git: hanya nama variabel', 1450, 646, {size: 28, weight: 800, align: 'center', color: C.lime, alpha: q}); }
};
AD.lapisanDocker = (c, t, D) => {
  K.bg(c); K.judul(c, 'Dockerfile', t, C.sky, 'Resep: berjalan sama persis di laptop dan di server');
  const lap = [['FROM node:22-alpine', C.sky], ['COPY package*.json ./', C.violet], ['RUN npm ci --omit=dev', C.violet], ['COPY . .', C.lime], ['USER node', C.amber]];
  lap.forEach(([s, w], i) => { const p = O(S(t, .3 + i * D * .1, .8 + i * D * .1)); if (p <= 0) return; const y = 820 - i * 110;
    K.rrect(c, 200, y, 760, 90, 14, 'rgba(255,255,255,.04)', w, 3); K.text(c, s, 240, y + 46, {size: 32, weight: 800, mono: true, color: w, alpha: p}); });
  const q = O(S(t, D * .6, D * .7)); if (q > 0) { c.save(); c.globalAlpha = q; K.text(c, 'kode berubah?', 1100, 755, {size: 30, weight: 800, color: C.lime});
    K.text(c, 'hanya lapisan ini dibangun ulang', 1100, 800, {size: 28, weight: 700, color: C.redup});
    K.text(c, 'npm ci memakai cache', 1100, 630, {size: 30, weight: 800, color: C.violet}); c.restore(); }
  const r = O(S(t, D * .82, D * .9)); if (r > 0) K.text(c, 'dijalankan sebagai pengguna node, bukan root', 1100, 380, {size: 28, weight: 800, color: C.amber, alpha: r});
};
AD.composeTiga = (c, t, D) => {
  K.bg(c); K.judul(c, 'Docker Compose', t, C.violet, 'Tiga layanan dalam satu berkas');
  const kot = [['db', 'postgres:16', C.violet, 1360], ['app', 'build: .', C.lime, 820], ['nginx', 'port 80, 443', C.amber, 280]];
  kot.forEach(([n, s, w, x], i) => { const p = O(S(t, .3 + i * D * .15, .9 + i * D * .15)); if (p <= 0) return;
    c.save(); c.globalAlpha = p; K.rrect(c, x, 330, 300, 200, 20, '#0d1222', w, 4); K.text(c, n, x + 150, 410, {size: 46, weight: 900, align: 'center', mono: true, color: w}); K.text(c, s, x + 150, 470, {size: 26, weight: 700, align: 'center', mono: true, color: C.redup}); c.restore(); });
  const p = O(S(t, D * .5, D * .6)); if (p > 0) { c.save(); c.globalAlpha = p;
    c.fillStyle = C.violet; c.beginPath(); c.ellipse(1510, 680, 120, 30, 0, 0, 7); c.fill(); K.text(c, 'volume: data-db', 1510, 750, {size: 26, weight: 800, align: 'center', mono: true, color: C.violet});
    K.text(c, 'data tetap ada saat container dibuat ulang', 1510, 790, {size: 22, weight: 700, align: 'center', color: C.redup}); c.restore(); }
  const q = O(S(t, D * .65, D * .75)); if (q > 0) { K.arrow(c, 1350, 430, 1130, 430, C.lime, 4, q, 14); K.text(c, 'menunggu db siap', 1240, 400, {size: 22, weight: 700, align: 'center', color: C.lime, alpha: q}); }
  const r = O(S(t, D * .82, D * .9)); if (r > 0) K.text(c, 'schema.sql dijalankan otomatis saat database pertama kali dibuat', 960, 900, {size: 30, weight: 800, align: 'center', alpha: r});
};
AD.proxyBalik = (c, t, D) => {
  K.bg(c); K.judul(c, 'Nginx sebagai reverse proxy', t, C.amber);
  dunia(c, 260, 520, 110, C.sky); K.text(c, 'internet', 260, 680, {size: 28, weight: 700, align: 'center', color: C.redup});
  K.rrect(c, 640, 420, 360, 200, 20, '#0d1222', C.amber, 4); K.text(c, 'Nginx :443', 820, 520, {size: 38, weight: 900, align: 'center', mono: true, color: C.amber});
  K.rrect(c, 1340, 420, 380, 200, 20, '#0d1222', C.lime, 4); K.text(c, 'app :3000', 1530, 520, {size: 38, weight: 900, align: 'center', mono: true, color: C.lime});
  K.arrow(c, 390, 520, 630, 520, C.sky, 5, O(S(t, .4, 1.2)), 16); K.arrow(c, 1010, 520, 1330, 520, C.amber, 5, O(S(t, D * .25, D * .35)), 16);
  const p = O(S(t, D * .35, D * .45)); if (p > 0) K.text(c, 'X-Forwarded-Proto: https', 1170, 400, {size: 24, weight: 800, align: 'center', mono: true, color: C.amber, alpha: p});
  const q = O(S(t, D * .55, D * .65)); if (q > 0) { c.save(); c.globalAlpha = q; K.kode(c, ["app.set('trust proxy', 1);", "cookie: { secure: true, ... }"], 1100, 700, {size: 30, w: 680}); c.restore(); }
};
AD.httpsWifi = (c, t, D) => {
  K.bg(c); K.judul(c, 'Kenapa HTTPS wajib?', t, C.coral, 'Wi-Fi bengkel dipakai bersama');
  const aman = t > D * .5;
  laptop(c, 300, 560, .8); K.serverKotak(c, 1620, 600, .8);
  c.strokeStyle = aman ? C.lime : '#64748b'; c.lineWidth = 6; c.setLineDash(aman ? [] : [14, 10]); c.beginPath(); c.moveTo(440, 540); c.lineTo(1480, 540); c.stroke(); c.setLineDash([]);
  const x = K.lerp(460, 1440, ((t * .35) % 1));
  K.rrect(c, x - 130, 500, 260, 70, 12, aman ? '#14532d' : '#f8fafc'); K.text(c, aman ? 'x8#Qz!@p…' : 'password=rahasia123', x, 536, {size: 20, weight: 800, align: 'center', mono: true, color: aman ? C.lime : '#b91c1c'});
  K.orang(c, 960, 900, 200, '#475569'); K.text(c, aman ? '???' : 'password=rahasia123', 960, 700, {size: 26, weight: 800, align: 'center', mono: true, color: aman ? C.redup : C.coral});
  if (aman) { gembok(c, 960, 430, 1, C.lime); K.text(c, "Gratis dari Let's Encrypt dengan certbot, diperpanjang otomatis", 960, 980, {size: 30, weight: 800, align: 'center', color: C.lime, alpha: O(S(t, D * .6, D * .7))}); }
};
AD.backupMalam = (c, t, D) => {
  K.bg(c); K.judul(c, 'Backup setiap malam', t, C.violet, 'pg_dump, simpan tujuh hari, salin ke luar server');
  for (let i = 0; i < 7; i++) { const p = O(S(t, .3 + i * .25, .6 + i * .25)); if (p <= 0) continue; K.rrect(c, 160 + i * 150, 300, 120, 150, 12, 'rgba(167,139,250,.1)', C.violet, 3); K.text(c, ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i], 220 + i * 150, 380, {size: 28, weight: 800, align: 'center', alpha: p}); }
  const p = O(S(t, D * .3, D * .4)); if (p > 0) { K.arrow(c, 1240, 375, 1420, 375, C.violet, 5, p, 16); c.save(); c.globalAlpha = p; dunia(c, 1560, 375, 90, C.sky); K.text(c, 'di luar server', 1560, 510, {size: 26, weight: 700, align: 'center', color: C.redup}); c.restore(); }
  const q = O(S(t, D * .55, D * .65)); if (q > 0) { K.rrect(c, 160, 620, 1600, 170, 22, 'rgba(255,176,32,.08)', C.amber, 4);
    K.text(c, 'Langkah yang paling sering dilupakan: coba pulihkan', 960, 680, {size: 38, weight: 900, align: 'center', color: C.amber, alpha: q});
    K.text(c, 'Backup yang belum pernah dicoba dipulihkan belum bisa disebut backup', 960, 740, {size: 30, weight: 700, align: 'center', alpha: q}); }
};
AD.alurUpdate = (c, t, D) => {
  K.bg(c); K.judul(c, 'Saat ada perbaikan', t, C.lime);
  const lang = [['laptop', 'git commit && git push', C.sky], ['server', 'git pull', C.amber], ['server', 'docker compose up -d --build', C.lime]];
  lang.forEach(([a, b, w], i) => { const p = O(S(t, .3 + i * D * .2, .9 + i * D * .2)); if (p <= 0) return; const y = 280 + i * 170;
    c.save(); c.globalAlpha = p; K.text(c, a, 200, y + 50, {size: 30, weight: 800, color: C.redup}); K.rrect(c, 400, y, 1100, 100, 16, '#0d1222', w, 3); K.text(c, '$ ' + b, 440, y + 52, {size: 34, weight: 800, mono: true, color: w});
    if (i) K.arrow(c, 950, y - 60, 950, y - 10, '#64748b', 4, 1, 12); c.restore(); });
  const q = O(S(t, D * .72, D * .8)); if (q > 0) K.text(c, 'Container app dibuat ulang; data di volume database tetap utuh', 960, 860, {size: 34, weight: 800, align: 'center', alpha: q});
};
const KODE = ["  app:", "    build: .", "    environment:", "      DATABASE_URL: postgres://postgres:bengkel2026@db/antrean", "      SESSION_SECRET: majujaya-rahasia-banget", "", "# nginx-ai.conf", "location / {", "  proxy_pass http://app:3000;", "}"];
AD.cekAI12 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  K.text(c, 'Perintah: "buatkan docker compose dan Nginx untuk aplikasi ini"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  K.kode(c, KODE, 140, 310, {size: 28, w: 1300, chars: Math.floor(320 * S(t, .8, 3.5))});
  const p = O(S(t, D * .45, D * .55)); if (p > 0) { K.text(c, 'Dua masalah: satu di layar TV, satu di GitHub', 140, 900, {size: 34, weight: 800, color: C.amber, alpha: p}); }
  K.pikirkan(c, t, D, 1660, 900);
};
AD.bufferNginx = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t, C.lime); K.text(c, 'Masalah 1: layar TV berhenti berubah', 140, 200, {size: 40, weight: 900, color: C.coral});
  K.serverKotak(c, 260, 520, .8); K.rrect(c, 760, 400, 400, 260, 20, '#0d1222', C.amber, 4); K.text(c, 'Nginx', 960, 440, {size: 32, weight: 900, align: 'center', color: C.amber});
  K.rrect(c, 1480, 420, 300, 200, 14, '#0b1736', '#94a3b8', 5); K.text(c, 'A-011', 1630, 525, {size: 56, weight: 900, align: 'center'});
  const n = Math.min(4, Math.floor(t / (D * .1))); for (let i = 0; i < n; i++) K.rrect(c, 800 + (i % 2) * 170, 480 + Math.floor(i / 2) * 70, 150, 50, 10, C.amber);
  K.arrow(c, 400, 530, 750, 530, '#94a3b8', 4, 1, 14); c.save(); c.setLineDash([12, 10]); K.arrow(c, 1170, 530, 1470, 530, '#475569', 4, 1, 14); c.restore(); K.coret(c, 1260, 490, 1380, 570, O(S(t, D * .3, D * .38)));
  K.text(c, 'kabar ditahan di buffer', 960, 700, {size: 28, weight: 800, align: 'center', color: C.coral, alpha: O(S(t, D * .25, D * .35))});
  const q = O(S(t, D * .55, D * .65)); if (q > 0) { c.save(); c.globalAlpha = q; K.kode(c, ["location /api/siaran { proxy_buffering off; ... }", "// atau dari server (bab 9):", "'X-Accel-Buffering': 'no'"], 140, 780, {size: 30, w: 1200}); K.centang(c, 1400, 860, 56, 1); c.restore(); }
};
AD.rahasiaBocor = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t, C.lime); K.text(c, 'Masalah 2: rahasia ikut ter-commit ke repo publik', 140, 200, {size: 40, weight: 900, color: C.coral});
  K.rrect(c, 140, 270, 860, 300, 18, '#0d1222', '#475569', 3); K.text(c, 'github.com/…/siantre · compose.yaml', 170, 310, {size: 24, weight: 700, mono: true, color: C.redup});
  K.text(c, 'SESSION_SECRET: majujaya-rahasia-banget', 170, 400, {size: 28, weight: 800, mono: true, color: C.coral}); K.text(c, 'POSTGRES_PASSWORD: bengkel2026', 170, 460, {size: 28, weight: 800, mono: true, color: C.coral});
  const p = O(S(t, D * .2, D * .3)); if (p > 0) { c.save(); c.globalAlpha = p; K.orang(c, 1320, 560, 200, '#475569'); K.text(c, 'program pemindai: ketemu dalam hitungan menit', 1320, 640, {size: 26, weight: 800, align: 'center', color: C.coral}); c.restore(); }
  const q = O(S(t, D * .45, D * .55)); if (q > 0) { c.save(); c.globalAlpha = q; K.text(c, 'menghapus commit tidak cukup: masih ada di riwayat Git', 140, 720, {size: 30, weight: 800, color: C.amber}); c.restore(); }
  const r = O(S(t, D * .7, D * .8)); if (r > 0) { K.rrect(c, 140, 790, 1640, 110, 20, 'rgba(163,230,53,.08)', C.lime, 3); K.text(c, 'Satu-satunya jalan: ganti kuncinya, lalu pindahkan ke .env', 960, 846, {size: 36, weight: 900, align: 'center', color: C.lime, alpha: r}); }
};
const DAFTAR = ['Nomor unik dijaga database?', 'Ada kunci, bukan hanya transaksi?', 'Status code-nya jujur?', 'Input divalidasi?', 'Data dibuka dengan kode acak, bukan id?', 'Nama ditampilkan sebagai teks?', 'Test-nya bisa gagal?', 'Tidak ada rahasia di dalam kode?'];
AD.daftarPeriksa = (c, t, D) => {
  K.bg(c); K.judul(c, 'Daftar periksa kode dari AI', t, C.lime, 'Unduh versi lengkapnya dari tautan di deskripsi');
  DAFTAR.forEach((s, i) => { const p = O(S(t, D * (.08 + i * .1), D * (.13 + i * .1))); if (p <= 0) return; const x = 160 + (i % 2) * 820, y = 290 + Math.floor(i / 2) * 150;
    K.rrect(c, x, y, 780, 110, 18, 'rgba(163,230,53,.05)', C.lime, 3); K.centang(c, x + 60, y + 55, 44, p); K.text(c, s, x + 110, y + 56, {size: 30, weight: 800, alpha: p, maxW: 660}); });
};
AD.penutup = (c, t, D) => {
  K.bg(c); const p = O(S(t, .3, 1.2));
  K.text(c, 'AI boleh mengetik,', 960, 360, {size: 76, weight: 900, align: 'center', alpha: p});
  K.text(c, 'kamu yang bertanggung jawab.', 960, 460, {size: 76, weight: 900, align: 'center', color: C.lime, alpha: O(S(t, 1.2, 2))});
  const q = O(S(t, D * .4, D * .5)); if (q > 0) { c.save(); c.globalAlpha = q; [['React / Vue', C.sky], ['Notifikasi WhatsApp', C.lime], ['Kode lengkap di GitHub', C.amber]].forEach(([s, w], i) => {
      K.rrect(c, 250 + i * 490, 620, 440, 100, 50, 'rgba(255,255,255,.04)', w, 3); K.text(c, s, 470 + i * 490, 671, {size: 32, weight: 800, align: 'center', color: w}); }); c.restore(); }
  const r = O(S(t, D * .75, D * .85)); if (r > 0) K.text(c, 'Selamat membangun!', 960, 880, {size: 56, weight: 900, align: 'center', color: C.amber, alpha: r});
};
})();
