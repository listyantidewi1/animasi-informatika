# Daftar periksa: jangan langsung percaya hasil AI

AI adalah asisten yang rajin, tetapi ia hanya mengerjakan apa yang diminta. Empat belas hal ini berasal dari pembuka dan segmen *Cek kerjaan AI* di setiap bab video SiPinjam. Pakai sebagai daftar periksa setiap kali kamu menerima kode dari AI.

| Bab | Yang lazim ditulis AI | Akibatnya | Yang diperiksa |
|---|---|---|---|
| Pembuka | Membaca stok, memeriksa, lalu mengurangi, tanpa kunci | Dua permintaan bersamaan sama-sama berhasil, satu alat dipinjam dua orang | Transaksi dan `SELECT ... FOR UPDATE` |
| 1 | Koneksi sebagai `root` dengan kata sandi kosong, ditulis di dalam kode | Kalau dibobol, semua database ikut terbuka, dan kata sandi ikut ke GitHub | Pengguna database khusus dengan hak secukupnya, kata sandi di `.env` |
| 2 | Langsung menulis kode tanpa bertanya aturannya | Pinjaman langsung disetujui, tidak ada denda | Tulis aturannya dulu, baru minta kodenya |
| 3 | `FLOAT` untuk uang, `VARCHAR` untuk tanggal | Jumlah uang meleset, tanggal diurutkan seperti kata | `DECIMAL` untuk uang, `DATE` untuk tanggal |
| 4 | `ON DELETE CASCADE` supaya menghapus tidak error | Menghapus satu kategori ikut menghapus alat dan riwayatnya | Biarkan foreign key menolak penghapusan |
| 5 | Prosedur tanpa transaksi, denda memakai selisih hari ditambah satu | Data tersimpan setengah, tepat waktu ikut didenda | `START TRANSACTION`, handler dengan `ROLLBACK`, uji tepat di batas |
| 6 | Trigger yang mengubah tabel pemicunya sendiri | Error 1442, semua perubahan pada tabel itu gagal | Hitung saat menampilkan, bukan dengan trigger |
| 7 | Ketikan pengguna disambung langsung ke string SQL | SQL injection: login tanpa kata sandi | Prepared statement untuk setiap nilai dari luar |
| 8 | Menu admin disembunyikan, halamannya hanya memeriksa "sudah login" | Siapa pun yang tahu alamatnya bisa membuka halaman admin | Setiap halaman memeriksa perannya sendiri |
| 9 | Menghapus riwayat lebih dulu supaya tombol hapus tidak error, daftar tanpa `LIMIT` | Laporan lama berkurang diam-diam, halaman membeku setelah data banyak | Nonaktifkan, jangan hapus. Selalu beri batas |
| 10 | Tautan `batalkan?id=...` tanpa memeriksa pemilik | Siapa pun bisa membatalkan pinjaman orang lain | Periksa pemilik dan status, ubah data lewat POST dengan token CSRF |
| 11 | Query di dalam perulangan | Ribuan query untuk satu halaman (N+1) | Satu query dengan `JOIN` |
| 12 | Uji yang hanya mencoba jalur berhasil | Lulus uji, tetapi gagal saat stok habis atau dipakai bersamaan | Uji juga cara-cara menggagalkannya |
| 13 | `root` server menunjuk ke folder proyek, debug menyala | Berkas `.env` bisa diunduh siapa pun | `root` ke `public`, `APP_DEBUG=false` |
