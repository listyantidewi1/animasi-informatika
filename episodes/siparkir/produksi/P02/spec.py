NAMA = "P02_kebutuhan"
REKAMAN = []
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
KODE = ["function hitungBiaya($jamMasuk, $jamKeluar)", "{", "    $jam = ceil(($jamKeluar - $jamMasuk) / 3600);", "    $tarifPerJam = 2000;", "", "    return $jam * $tarifPerJam;", "}"]
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 2', judul='Kebutuhan', sub='Belum ada kode. Kita mengobrol dulu dengan pemakainya.', lapis='kebutuhan'))],
 2: [A('buRatna')], 3: [A('tarif')], 4: [A('kelonggaran')], 5: [A('tigaContoh')], 6: [A('pakJoko')],
 7: [A('poin', a=dict(judul='Tiga peran', warna='#a78bfa', sub='Setiap peran hanya boleh membuka halamannya sendiri', kol=3, tinggi=420, item=[
        dict(k=1, besar='Petugas', judul='Pak Joko dan Mas Agus', isi='Mencatat kendaraan masuk dan keluar.'),
        dict(k=2, besar='Admin', judul='Bu Sinta, tata usaha', isi='Mengelola tarif, area, kendaraan, dan akun pengguna.'),
        dict(k=3, besar='Owner', judul='Bu Ratna, pengelola', isi='Hanya melihat rekap pendapatan.')]))],
 8: [A('poin', a=dict(judul='Yang sengaja tidak kita buat', warna='#ff6b6b', sub='Versi pertama harus selesai dulu', kol=3, tinggi=300, item=[
        dict(k=1, d=0.2, judul='Kartu langganan', isi='belum', warna='#ff6b6b'), dict(k=1, d=1.8, judul='Pembayaran nontunai', isi='belum', warna='#ff6b6b'), dict(k=1, d=3.4, judul='Palang otomatis', isi='belum', warna='#ff6b6b')]))],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan fungsi untuk menghitung biaya parkir', kode=KODE, size=32, w=1400))],
 10: [A('masalahAI', a=dict(kode=KODE, size=28, w=1640, masalah=[
        dict(k=0, judul='Angka 2.000 itu dikarang', isi='Tidak ada yang memberi tahu AI berapa tarif parkir di sekolah ini.', sorot=[3]),
        dict(k=1, judul='Tiga aturan Bu Ratna tidak ada', isi='Jam pertama lebih mahal, batas harian, dan kelonggaran lima menit.', sorot=[2, 5]),
        dict(k=2, judul='Motor dan mobil disamakan', isi='Fungsinya bahkan tidak menerima jenis kendaraan.', sorot=[0])],
        tantangan=dict(k=4, tantangan='Tanyakan aturan tarif parkir di sekolah atau di pasar dekat rumahmu, lalu tulis tiga contoh hitungannya.', berikut='Bab 3: Merancang database')))],
}
