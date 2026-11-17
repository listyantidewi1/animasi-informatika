import './style.css';
import { hitungPatungan } from './hitung.js';
import { KUNCI_DRAFT, KUNCI_RIWAYAT, muatDraf, muatRiwayat, tulis } from './penyimpanan.js';
import { buatTeksRingkasan } from './ringkasan.js';

// Semua uang disimpan sebagai rupiah bulat (integer).
const state = {
  menu: [], // { nama, harga, pemakan: [nama orang] }
  orang: [], // nama
};

// Mengakses localStorage sendiri bisa melempar galat kalau diblokir.
const simpanan = (() => {
  try {
    return window.localStorage;
  } catch {
    return { getItem: () => null, setItem: () => {} };
  }
})();

const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID');

document.querySelector('#app').innerHTML = `
  <main>
    <h1>Patungan</h1>
    <p class="slogan">Bagi tagihan makan bareng, adil sampai rupiah terakhir.</p>
    <p id="pesan-simpanan" class="galat" role="status" hidden></p>

    <section>
      <h2>Menu</h2>
      <ul id="daftar-menu"></ul>
      <form id="form-menu">
        <input name="nama" placeholder="Nama menu" required autocomplete="off" />
        <input name="harga" type="text" inputmode="numeric" pattern="[0-9.]*" placeholder="Harga (Rp)" required autocomplete="off" />
        <button type="submit">Tambah menu</button>
      </form>
    </section>

    <section>
      <h2>Orang</h2>
      <ul id="daftar-orang"></ul>
      <form id="form-orang">
        <input name="nama" placeholder="Nama orang" required autocomplete="off" />
        <button type="submit">Tambah orang</button>
      </form>
    </section>

    <section>
      <h2>Voucher, service, pajak</h2>
      <form id="form-hitung">
        <label>Nama tempat
          <input name="tempat" placeholder="Mis. Warung Bu Tini" autocomplete="off" />
        </label>
        <label>Ditalangi oleh
          <select name="penalang"></select>
        </label>
        <label>Voucher (Rp)
          <input name="voucher" type="number" inputmode="numeric" min="0" step="1" value="0" />
        </label>
        <label>Service (%)
          <input name="service" type="number" inputmode="decimal" min="0" step="any" value="0" />
        </label>
        <label>Pajak (%)
          <input name="pajak" type="number" inputmode="decimal" min="0" step="any" value="0" />
        </label>
      </form>
      <div id="hasil" aria-live="polite"></div>
    </section>

    <section>
      <h2>Riwayat</h2>
      <ul id="daftar-riwayat"></ul>
    </section>
  </main>
  <div class="bar-bawah">
    <button type="submit" form="form-hitung" class="utama">Hitung</button>
  </div>
`;

const ulMenu = document.querySelector('#daftar-menu');
const ulOrang = document.querySelector('#daftar-orang');
const divHasil = document.querySelector('#hasil');
const ulRiwayat = document.querySelector('#daftar-riwayat');
const formHitung = document.querySelector('#form-hitung');

// Muat struk yang sedang diisi dari sesi sebelumnya. Data rusak dilewati.
const draf = muatDraf(simpanan);
state.orang = draf.orang;
state.menu = draf.menu;
for (const k of ['tempat', 'voucher', 'service', 'pajak']) {
  if (draf[k] !== undefined) formHitung[k].value = draf[k];
}

const dimuat = muatRiwayat(simpanan);
let riwayat = dimuat.entri;
const rusak = dimuat.dilewati + draf.dilewati;
if (rusak > 0) {
  const pesan = document.querySelector('#pesan-simpanan');
  pesan.textContent = `${rusak} data tersimpan rusak dan dilewati.`;
  pesan.hidden = false;
}
let sudahDisimpan = false; // cegah riwayat ganda kalau Hitung ditekan berulang

function simpanDraf() {
  tulis(simpanan, KUNCI_DRAFT, {
    menu: state.menu,
    orang: state.orang,
    tempat: formHitung.tempat.value,
    voucher: formHitung.voucher.value,
    service: formHitung.service.value,
    pajak: formHitung.pajak.value,
  });
}

function tampilRiwayat() {
  ulRiwayat.replaceChildren(
    ...riwayat
      .slice()
      .reverse()
      .map((r) => {
        const li = document.createElement('li');
        const kiri = document.createElement('span');
        const tanggal = new Date(r.tanggal).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        kiri.textContent = `${r.tempat || 'Tanpa nama'} · ${tanggal}`;
        const kanan = document.createElement('span');
        kanan.textContent = rupiah(r.total);
        li.append(kiri, kanan);
        return li;
      }),
  );
  if (riwayat.length === 0) {
    const kosong = document.createElement('li');
    kosong.textContent = 'Belum ada riwayat';
    ulRiwayat.append(kosong);
  }
}

function tampil() {
  ulMenu.replaceChildren(
    ...state.menu.map((m) => {
      const li = document.createElement('li');
      const nama = document.createElement('span');
      nama.textContent = m.nama;
      const harga = document.createElement('span');
      harga.textContent = rupiah(m.harga);
      const baris = document.createElement('div');
      baris.className = 'baris';
      baris.append(nama, harga);

      // Ketuk nama orang untuk menandai/melepas pemakan menu ini.
      const pilihan = document.createElement('div');
      pilihan.className = 'pilihan';
      for (const orang of state.orang) {
        const tombol = document.createElement('button');
        tombol.type = 'button';
        tombol.className = 'chip';
        tombol.textContent = orang;
        tombol.setAttribute('aria-pressed', String(m.pemakan.includes(orang)));
        tombol.addEventListener('click', () => {
          const i = m.pemakan.indexOf(orang);
          if (i >= 0) m.pemakan.splice(i, 1);
          else m.pemakan.push(orang);
          tampil();
        });
        pilihan.append(tombol);
      }
      li.append(baris, pilihan);
      return li;
    }),
  );
  ulOrang.replaceChildren(
    ...state.orang.map((n) => {
      const li = document.createElement('li');
      li.textContent = n;
      return li;
    }),
  );
  // Pilihan penalang mengikuti daftar orang; pilihan lama dipertahankan kalau masih ada.
  const pilihanPenalang = formHitung.penalang;
  const terpilih = pilihanPenalang.value;
  pilihanPenalang.replaceChildren(
    new Option('Pilih orang', ''),
    ...state.orang.map((n) => new Option(n, n)),
  );
  pilihanPenalang.value = state.orang.includes(terpilih) ? terpilih : '';
  // Hasil lama tidak berlaku lagi kalau data berubah.
  divHasil.replaceChildren();
  sudahDisimpan = false;
  simpanDraf();
}

formHitung.addEventListener('input', () => {
  sudahDisimpan = false;
  simpanDraf();
});

function tampilkanPesan(teks, kelas) {
  const p = document.createElement('p');
  p.className = kelas;
  p.textContent = teks;
  divHasil.replaceChildren(p);
}

// Pesan di bawah hasil, tanpa menghapus hasil yang sedang tampil.
function pesanBagikan(teks) {
  divHasil.querySelector('.pesan-bagikan')?.remove();
  const p = document.createElement('p');
  p.className = 'galat pesan-bagikan';
  p.textContent = teks;
  divHasil.append(p);
}

// Web Share API kalau ada; kalau tidak, buka WhatsApp dengan teksnya.
async function bagikanRingkasan(data) {
  if (!data.penalang) {
    pesanBagikan('Pilih dulu siapa yang menalangi');
    return;
  }
  const text = buatTeksRingkasan(data);
  if (navigator.share) {
    try {
      await navigator.share({ text });
    } catch (err) {
      // Pengguna menutup lembar bagikan: bukan galat.
      if (err.name !== 'AbortError') pesanBagikan('Gagal membagikan ringkasan');
    }
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

// Kotak harga: tampilkan titik ribuan saat mengetik (50300 -> 50.300).
document.querySelector('#form-menu').harga.addEventListener('input', (e) => {
  const angka = e.target.value.replace(/\D/g, '');
  e.target.value = angka ? Number(angka).toLocaleString('id-ID') : '';
});

document.querySelector('#form-menu').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const nama = f.nama.value.trim();
  const harga = Number(f.harga.value.replace(/\D/g, ''));
  if (!nama || !Number.isFinite(harga) || harga < 0) return;
  state.menu.push({ nama, harga, pemakan: [] });
  f.reset();
  f.nama.focus();
  tampil();
});

document.querySelector('#form-orang').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const nama = f.nama.value.trim();
  if (!nama) return;
  state.orang.push(nama);
  f.reset();
  f.nama.focus();
  tampil();
});

document.querySelector('#form-hitung').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  try {
    const hasil = hitungPatungan({
      voucher: Math.round(Number(f.voucher.value) || 0),
      service: Number(f.service.value) || 0,
      pajak: Number(f.pajak.value) || 0,
      menu: state.menu,
    });
    const ul = document.createElement('ul');
    for (const [orang, bagian] of Object.entries(hasil.bagian)) {
      const li = document.createElement('li');
      const nama = document.createElement('span');
      nama.textContent = orang;
      const jumlah = document.createElement('span');
      jumlah.textContent = rupiah(bagian);
      li.append(nama, jumlah);
      ul.append(li);
    }
    const ringkas = document.createElement('p');
    ringkas.textContent = `Total struk ${rupiah(hasil.total)}. Kelebihan ${rupiah(hasil.kelebihan)}.`;
    const bagikan = document.createElement('button');
    bagikan.type = 'button';
    bagikan.textContent = 'Bagikan';
    const tempat = f.tempat.value.trim();
    const tanggal = new Date();
    bagikan.addEventListener('click', () =>
      bagikanRingkasan({ tempat, tanggal, ...hasil, penalang: f.penalang.value }),
    );
    divHasil.replaceChildren(ul, ringkas, bagikan);

    if (!sudahDisimpan) {
      riwayat.push({
        tanggal: new Date().toISOString(),
        tempat: f.tempat.value.trim(),
        total: hasil.total,
        kelebihan: hasil.kelebihan,
        bagian: hasil.bagian,
      });
      tulis(simpanan, KUNCI_RIWAYAT, riwayat);
      sudahDisimpan = true;
      tampilRiwayat();
    }
  } catch (err) {
    tampilkanPesan(err.message, 'galat');
  }
  // Gulirkan ke hasil (atau pesan galat) supaya pengguna tahu tombol bekerja.
  divHasil.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

tampil();
tampilRiwayat();

// PWA: daftarkan service worker hanya pada build produksi (bukan saat `vite dev`).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}
