// Menggambar ikon Patungan dengan kode, tanpa library dan tanpa alat luar.
// Bentuk didefinisikan sekali, lalu ditulis sebagai SVG dan digambar ulang
// piksel demi piksel menjadi PNG (zlib bawaan Node).
// Jalankan: node scripts/buat-ikon.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const HIJAU = [10, 125, 79]; // #0a7d4f
const PUTIH = [255, 255, 255];
const P = 256; // pusat pada kanvas 512
const R = 130; // jari-jari piring (isi tetap di zona aman maskable)
const SUDUT = [0, 120, 240]; // tiga irisan = "patungan"

// Titik ujung garis pembagi irisan (0° = atas).
const ujung = (d) => {
  const rad = ((d - 90) * Math.PI) / 180;
  return [P + R * Math.cos(rad), P + R * Math.sin(rad)];
};

// ---------- SVG ----------
function buatSvg() {
  const garis = SUDUT.map((d) => {
    const [x, y] = ujung(d);
    return `<line x1="${P}" y1="${P}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0a7d4f"/>
  <circle cx="${P}" cy="${P}" r="${R + 24}" fill="none" stroke="#fff" stroke-width="12" opacity="0.5"/>
  <circle cx="${P}" cy="${P}" r="${R}" fill="#fff"/>
  <g stroke="#0a7d4f" stroke-width="14" stroke-linecap="round">${garis}</g>
  <circle cx="${P}" cy="${P}" r="26" fill="#0a7d4f"/>
</svg>
`;
}

// ---------- Raster ----------
const jarakKeRuas = (x, y, [ax, ay], [bx, by]) => {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
};

// Warna satu titik (koordinat kanvas 512), dilapis dari bawah ke atas.
function warnaTitik(x, y) {
  let w = HIJAU;
  const dp = Math.hypot(x - P, y - P);
  if (Math.abs(dp - (R + 24)) <= 6) w = w.map((c, i) => (c + PUTIH[i]) / 2); // cincin 50%
  if (dp <= R) w = PUTIH; // piring
  if (dp <= R && SUDUT.some((d) => jarakKeRuas(x, y, [P, P], ujung(d)) <= 7)) w = HIJAU; // garis irisan
  if (dp <= 26) w = HIJAU; // titik tengah
  return w;
}

function buatPixel(ukuran) {
  const skala = 512 / ukuran;
  const ss = 4; // supersampling 4x4 agar tepi halus
  const data = Buffer.alloc(ukuran * ukuran * 3);
  for (let py = 0; py < ukuran; py++) {
    for (let px = 0; px < ukuran; px++) {
      const jumlah = [0, 0, 0];
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const w = warnaTitik((px + (sx + 0.5) / ss) * skala, (py + (sy + 0.5) / ss) * skala);
          for (let k = 0; k < 3; k++) jumlah[k] += w[k];
        }
      }
      for (let k = 0; k < 3; k++) data[(py * ukuran + px) * 3 + k] = Math.round(jumlah[k] / (ss * ss));
    }
  }
  return data;
}

// ---------- Penulis PNG ----------
const tabelCrc = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = tabelCrc[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const potong = (jenis, isi) => {
  const panjang = Buffer.alloc(4); panjang.writeUInt32BE(isi.length);
  const badan = Buffer.concat([Buffer.from(jenis, 'ascii'), isi]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(badan));
  return Buffer.concat([panjang, badan, crc]);
};
function buatPng(ukuran) {
  const rgb = buatPixel(ukuran);
  const baris = Buffer.alloc((ukuran * 3 + 1) * ukuran); // tiap baris diawali byte filter 0
  for (let y = 0; y < ukuran; y++) rgb.copy(baris, y * (ukuran * 3 + 1) + 1, y * ukuran * 3, (y + 1) * ukuran * 3);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ukuran, 0); ihdr.writeUInt32BE(ukuran, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8 bit, RGB
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    potong('IHDR', ihdr), potong('IDAT', deflateSync(baris, { level: 9 })), potong('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/ikon', { recursive: true });
writeFileSync('public/ikon/ikon.svg', buatSvg());
for (const u of [192, 512]) writeFileSync(`public/ikon/ikon-${u}.png`, buatPng(u));
console.log('Ikon dibuat di public/ikon/');
