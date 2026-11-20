NAMA = "B02_kebutuhan"
REKAMAN = []
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
KAI = ["CREATE TABLE buku (", "  id INT AUTO_INCREMENT PRIMARY KEY,", "  judul VARCHAR(200),", "  penulis VARCHAR(100),", "  stok INT", ");"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 2', judul='Kebutuhan', sub='Bertanya dulu, baru menulis kode', lapis='kebutuhan'))],
 2: [A('obrolan', a=dict(judul='Mengobrol dengan Bu Ratih', sub='Petugas perpustakaan SMK Nusa Bakti', tokoh='ratih',
        balon=[dict(k=1, teks='Peminjaman masih saya catat di buku tulis.'), dict(k=2, teks='Buku ini masih di rak, atau sedang dipinjam? Saya sering tidak tahu.'), dict(k=3, teks='Mencari siapa yang terlambat, saya harus membolak-balik halaman.'), dict(k=4, teks='Siswa datang ke sini hanya untuk bertanya, bukunya ada atau tidak.')],
        catatan=[dict(k=1, d=1.5, teks='Peminjaman tercatat di aplikasi, bukan di buku tulis'), dict(k=2, d=2.5, teks='Tahu buku mana yang tersedia dan mana yang dipinjam'), dict(k=3, d=2.5, teks='Tahu siapa yang terlambat mengembalikan'), dict(k=4, d=2.5, teks='Siswa bisa memeriksa ketersediaan buku dari HP')]))],
 3: [A('tanpaInternet')],
 4: [A('poin', a=dict(judul='Aturan peminjaman', warna='#ffb020', kol=3, item=[
        dict(k=1, besar='3 buku', judul='Paling banyak per siswa'), dict(k=1, d=2.6, besar='7 hari', judul='Lama satu peminjaman'), dict(k=2, besar='Rp0', judul='Tidak ada denda'),
        dict(k=3, judul='Masih memegang buku terlambat?', isi='Tidak boleh meminjam lagi sampai buku itu kembali.', warna='#ff6b6b'), dict(k=4, judul='Mendaftar sendiri dari HP', isi='Akun baru aktif setelah disetujui Bu Ratih.', warna='#a78bfa')]))],
 5: [A('duaPeran')],
 6: [A('poin', a=dict(judul='Pencarian buku', warna='#38bdf8', kol=3, item=[
        dict(k=0, d=1.5, judul='Judul atau penulis', isi='diketik di kotak cari'), dict(k=0, d=4.0, judul='Kategori', isi='dipilih dari daftar'), dict(k=0, d=5.5, judul='Hanya yang tersedia', isi='satu kotak centang'),
        dict(k=1, besar='± 500 judul', judul='Koleksi perpustakaan', warna='#ffb020'), dict(k=2, judul='Tidak dikirim sekaligus ke HP', isi='Server hanya mengirim yang diminta.', warna='#ff6b6b')]))],
 7: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan tabel untuk aplikasi perpustakaan', kode=KAI, size=36, w=1100))],
 8: [A('tidakDitanya'), A('lanjut', kalimat=6, min=12, a=dict(selesai='Daftar kebutuhan dari Bu Ratih sudah jelas. Belum ada kode, belum ada commit.', tanya='Bagaimana menyimpan tiga buku berjudul sama, supaya masing-masing bisa dilacak?', berikut='Bab 3: Merancang database'))],
}
