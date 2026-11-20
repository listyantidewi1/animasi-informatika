NAMA = "B11_uji_backup"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ["# crontab: dijalankan setiap malam pukul 23.00", "0 23 * * *  mysqldump -u root sibaca > /home/ratih/sibaca/backup/backup.sql"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 11', judul='Uji, backup, dan panduan', sub='Supaya aplikasinya tetap benar, datanya aman, dan Bu Ratih bisa memakainya', lapis='semua'))],
 2: [A('aturanBesar', min=7, a=dict(kecil='Test', teks='Kode yang memeriksa kode.', sub='Setiap jebakan dari segmen Cek kerjaan AI bisa dijadikan test.', warna='#a3e635')),
     R('b02', 'b02_node', kalimat=1, maks=11), R('b02_node', 'b02_bantu', kalimat=2), R('b02_bantu', 'b02_akhir', kalimat=3), E('b03', 'b03_satu', 4.5)],
 3: [R('b03_satu', 'b03_dua', kalimat=1), R('b03_dua', 'b03_tiga', kalimat=2), R('b03_tiga', 'b03_empat', kalimat=3), R('b03_empat', 'b03_assert', kalimat=4), R('b03_assert', 'b03_akhir', kalimat=5)],
 4: [R('b04', 'b04_jalan', maks=6), R('b04_jalan', 'b04_lulus', kalimat=1, maks=2), R('b04_lulus', 'b04_tiap', kalimat=2), R('b04_tiap', 'b04_akhir', kalimat=3)],
 5: [R('b05', 'b05_opsi', maks=1.6), R('b05_opsi', 'b05_isi', kalimat=2), R('b05_isi', 'b05_pulih', kalimat=3, maks=2.8), R('b05_pulih', 'b05_akhir', kalimat=4, maks=1.6), E('b05_ignore', 'b05_ignore_akhir', 2.5)],
 6: [A('flashdisk')],
 7: [R('b07', 'b07_pagi', maks=3.2), R('b07_pagi', 'b07_akhir', kalimat=2), A('dariGitHub', bg=True, kalimat=3, min=5, a=dict(ket='PANDUAN.md ada di GitHub, sesuaikan dengan sekolahmu'))],
 8: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan backup otomatis untuk database', kode=KAI, size=32, w=1640))],
 9: [A('masalahAI', a=dict(kode=KAI, size=30, w=1640, masalah=[
        dict(k=0, judul='Cadangannya tinggal di laptop yang sama', isi='Kalau laptopnya rusak atau hilang, cadangannya ikut hilang.', sorot=[1]),
        dict(k=1, judul='Nama berkasnya selalu sama', isi='Cadangan malam ini menimpa cadangan kemarin, termasuk saat datanya sudah salah.', sorot=[1]),
        dict(k=3, judul='Tidak pernah dicoba dipulihkan', isi='Belum tentu berkas itu bisa dipakai saat dibutuhkan.', sorot=[])])),
     R('b09_commit', 'b09_akhir', kalimat=4, maks=2.5)],
 10: [A('poin', min=9, a=dict(judul='Yang sudah kamu bangun', warna='#a3e635', kol=3, tinggi=300, item=[
        dict(k=1, d=0.3, besar='React', judul='Tampilan di browser HP'), dict(k=1, d=1.2, besar='Express', judul='Server dan aturannya', warna='#a3e635'), dict(k=1, d=2.0, besar='MySQL', judul='Empat tabel, dengan transaksi', warna='#2dd4bf'),
        dict(k=1, d=4.5, judul='Dari memasang alat', isi='Node.js, MySQL, Git, VS Code'), dict(k=1, d=5.5, judul='sampai berjalan tanpa internet', isi='dibuka dari HP lewat WiFi lokal', warna='#38bdf8'), dict(k=1, d=6.5, judul='dengan uji, backup, dan panduan', isi='siap diserahkan kepada pemakainya', warna='#a78bfa')])),
      A('sebelasJebakan', kalimat=2, min=17),
      A('tantangan', kalimat=6, min=10, a=dict(tantangan='Tambahkan fitur perpanjangan. Satu pinjaman boleh diperpanjang satu kali selama tujuh hari, dan aturannya harus dijaga di server.')),
      A('berikutnya', kalimat=8, min=12)],
}
