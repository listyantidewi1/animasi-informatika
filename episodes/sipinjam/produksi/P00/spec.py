NAMA = "P00_pembuka"
REKAMAN = ["web_ai", "../P11/web", "../P09/web"]
B = "/home/user/pinjam/bahan/"
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def WA(a, b, **k): return dict(k='rek', r='web_ai', a=a, b=b, **k)
def W11(a, b, **k): return dict(k='rek', r='../P11/web', a=a, b=b, **k)
def W9(a, b, **k): return dict(k='rek', r='../P09/web', a=a, b=b, **k)
HP = dict(img3=B + 'hp_rafi_sebelum.png', img4=B + 'hp_nadia_sebelum.png', img5=B + 'hp_rafi_sesudah.png', img6=B + 'hp_nadia_sesudah.png')
BEATS = {
 1: [A('pembuka', a=dict(img1=B + 'lap_jadi_dipinjam.png', img2=B + 'hp_jadi_alat.png', **HP))],
 2: [A('hpLayar', min=7, a=dict(judul='SiPinjam', sub='Peminjaman alat lab SMK Nusa Bakti', img=B + 'hp_jadi_alat_penuh.png', gulir=[1, 6], item=[
        dict(k=0, d=.6, judul='Siswa', isi='Memilih alat dan mengajukan pinjaman dari HP.', warna='#38bdf8'),
        dict(k=1, d=3.0, judul='Petugas lab', isi='Menyetujui, menerima pengembalian, denda dihitung otomatis.', warna='#2dd4bf'),
        dict(k=1, d=4.0, judul='Kepala lab', isi='Mengelola alat dan akun, mencetak laporan.', warna='#a78bfa')])),
     W11('setujui', 'dipinjam', kalimat=2, maks=3.5), W11('dipinjam', 'terima', maks=3.5), W9('daftar', 'tambah', kalimat=3, maks=3.5), W11('laporan', 'laporan_akhir', maks=3.5), A('sepuluhSatu', kalimat=4, min=8)],
 3: [A('duaHP', min=14, a=dict(img1=HP['img3'], img2=HP['img4'], img3=HP['img5'], img4=HP['img6'], tanpaJanji=1, kTk=2, dTk=4.2, kTb=3)), WA('mulai', 'dipinjam', kalimat=4, maks=4.5), WA('dipinjam', 'akhir', kalimat=5)],
 4: [A('race', a=dict(judul='Kodenya tidak error, logikanya terlihat benar', w=dict(langkah=1, mulai=[2, 0], rafi=[2, 1.5], nadia=[2, 3.0], cukup=[2, 5.0], catat=[2, 6.5], nama=3),
        nama='Tidak muncul saat kamu mencobanya sendirian', ket='Kesalahan ini baru muncul ketika aplikasinya benar-benar dipakai banyak orang.'))],
 5: [A('poin', a=dict(judul='AI itu asisten, bukan pemeriksa', warna='#f472b6', kol=3, tinggi=400, item=[
        dict(k=0, d=.8, besar='AI', judul='Asisten yang sangat rajin', isi='Mengerjakan persis apa yang kamu minta.'),
        dict(k=1, besar='?', judul='"Aman saat dipakai bersamaan"', isi='Tidak diminta, jadi tidak dipikirkan.'),
        dict(k=2, besar='Kamu', judul='Tahu apa yang perlu diperiksa', isi='Video ini melatihmu menjadi orang itu.')]))],
 6: [A('peta13')],
 7: [A('poin', tambah=2, a=dict(judul='Di setiap bab: segmen Cek kerjaan AI', warna='#f472b6', kol=2, tinggi=300, item=[
        dict(k=1, d=.5, besar='1', judul='Kode yang lazim ditulis AI', isi='Hasil dari perintah yang singkat.'),
        dict(k=1, d=5.5, besar='2', judul='Kamu mencari masalahnya', isi='Sebelum aku membuktikannya sungguhan.'),
        dict(k=2, besar='10 : 1', judul='10 permintaan bersamaan, 1 peminjam?', isi='Bagaimana caranya?', warna='#ffb020'),
        dict(k=3, besar='Bab 5', judul='Jawabannya di sana', isi='Fondasinya kita bangun mulai sekarang.', warna='#a3e635')]))],
}
