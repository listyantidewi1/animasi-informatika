NAMA = "P02_kebutuhan"
REKAMAN = []
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
KODE = ['// pinjam.php', '$sql = "INSERT INTO peminjaman (pengguna_id, alat_id, jumlah, status)', "        VALUES (?, ?, ?, 'disetujui')\";", '', '// kembali.php', '$sql = "UPDATE peminjaman SET status = \'dikembalikan\' WHERE id = ?";']
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 2', judul='Kebutuhan', sub='Bertanya dulu, baru menulis kode', lapis='kebutuhan'))],
 2: [A('bukuTulis', tambah=1.5)],
 3: [A('alur', tambah=1.5, a=dict(judul='Alur peminjaman, langkah demi langkah', warna='#38bdf8', langkah=[
        dict(k=1, siapa='Siswa', judul='Mengajukan pinjaman', isi='Menyebut alat, jumlah, dan berapa hari.'),
        dict(k=2, siapa='Pak Yusuf', judul='Menyetujui atau menolak'),
        dict(k=3, siapa='Siswa', judul='Mengambil alat di lab', isi='Kalau disetujui.'),
        dict(k=4, siapa='Pak Yusuf', judul='Mencatat tanggal kembali', isi='Saat alat kembali.'),
        dict(k=5, siapa='Terlambat?', judul='Denda Rp2.000', isi='Per hari, untuk setiap alat.')]))],
 4: [A('tanyaJawab', tambah=1.5, a=dict(judul='Pertanyaan yang jarang terpikir', warna='#f472b6', tj=[
        dict(kq=1, q='Sejak kapan alat dianggap tidak tersedia?', ka=2, j='Sejak diajukan', kb=3, b='Kalau ditolak atau dibatalkan, alatnya tersedia lagi.'),
        dict(kq=4, q='Berapa lama paling lama?', nq=1, ka=5, j='Tujuh hari'),
        dict(kq=6, q='Kembali tepat di hari jatuh tempo, kena denda?', ka=7, j='Tidak', kb=7, b='Denda baru dihitung mulai hari berikutnya.')]))],
 5: [A('poin', tambah=1.5, a=dict(judul='Tiga peran', warna='#a78bfa', kol=3, tinggi=460, item=[
        dict(k=1, besar='Peminjam', judul='Siswa dan guru', isi='Melihat alat, mengajukan pinjaman, membatalkan pengajuannya sendiri.', warna='#38bdf8'),
        dict(k=2, besar='Petugas', judul='Pak Yusuf', isi='Menyetujui, menerima pengembalian, mencetak laporan.', warna='#2dd4bf'),
        dict(k=3, besar='Admin', judul='Bu Sari, kepala lab', isi='Mengelola alat, kategori, dan akun, serta melihat log aktivitas.', warna='#a78bfa')]))],
 6: [A('aturan', tambah=2, a=dict(k=[1, 2, 3, 4], kaki=dict(k=5, teks='Terlalu penting untuk dititipkan pada halaman PHP: kita taruh di dalam database.')))],
 7: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan aplikasi peminjaman alat sekolah', kode=KODE, size=30, w=1500, ket='Pinjaman langsung disetujui, dan tidak ada denda sama sekali.', ketK=2))],
 8: [A('masalahAI', a=dict(kode=KODE, size=28, w=1640, masalah=[
        dict(k=0, judul='AI tidak salah, ia menebak', isi='Ia tidak tahu aturan lab ini, dan tebakannya terlihat masuk akal.', sorot=[2]),
        dict(k=2, judul='Aturan hanya didapat dengan bertanya', isi='Persetujuan petugas dan denda datang dari Pak Yusuf, bukan dari kode.', sorot=[], warna='#38bdf8'),
        dict(k=3, judul='Tulis aturannya dulu, baru minta kodenya', isi='Persis seperti daftar empat aturan kita tadi.', sorot=[], warna='#a3e635')])),
     A('lanjut', kalimat=4, min=9, a=dict(selesai='Alur, tiga peran, dan empat aturan sudah tertulis.', berikut='Bab 3: Merancang database'))],
}
