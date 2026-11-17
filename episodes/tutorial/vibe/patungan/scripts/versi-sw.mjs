// Dijalankan otomatis setelah `vite build` (lihat package.json).
// Mengganti penanda __VERSI__ di dist/sw.js dengan hash isi semua berkas build.
// Isi berubah -> versi berubah -> sw.js berubah -> browser memasang worker baru
// dan menghapus cache lama. Isi sama -> versi sama (build ulang tanpa perubahan aman).
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const SW = join(DIST, 'sw.js');

// Daftar semua berkas di dist (kecuali sw.js sendiri), urut tetap agar hash stabil.
const berkas = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? berkas(join(dir, e.name)) : [join(dir, e.name)],
  );

const hash = createHash('sha256');
for (const f of berkas(DIST).filter((f) => f !== SW).sort()) {
  hash.update(relative(DIST, f));
  hash.update(readFileSync(f));
}
const versi = hash.digest('hex').slice(0, 8);

const sumber = readFileSync(SW, 'utf8');
// Ganti tepat pada baris deklarasinya (kata __VERSI__ juga muncul di komentar).
const baris = "const VERSI = '__VERSI__';";
if (!sumber.includes(baris)) throw new Error(`Baris ${baris} tidak ada di sw.js`);
writeFileSync(SW, sumber.replace(baris, `const VERSI = '${versi}';`));
console.log(`sw.js: VERSI = ${versi}`);
