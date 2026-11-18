# Metadata YouTube: Vibe Coding Patungan

## Judul
Vibe Coding yang Benar: Membuat Aplikasi Patungan Sampai Jadi (Claude Code)

## Judul Short
AI bikin aplikasi patungan. Di mana salahnya? #shorts

## Deskripsi (1491 karakter)
```
Kita membuat aplikasi patungan untuk HP bersama asisten AI, dari folder kosong sampai terpasang di layar HP dan tetap jalan tanpa internet. Fokusnya bukan sekadar menyuruh AI, tetapi memastikan kode AI benar: spek satu halaman, prompt kecil, membaca kode, tes dari hitungan manual, dan commit sebagai titik aman.

Semua kesalahan di video ini benar-benar terjadi saat direkam: hasil yang tersembunyi di bawah layar, riwayat lama yang membuat tombol Hitung gagal, cache service worker yang menahan versi lama, dan voucher yang membuat semua bagian minus.

Alat: Vite + JavaScript murni, Vitest, PWA (manifest + service worker tanpa plugin), Claude Code sebagai asisten AI. Cara yang sama bisa dipakai dengan Gemini CLI, GitHub Copilot, atau Cursor.
Catatan: lembar Bagikan di HP pada bab "Kirim ke WhatsApp" adalah tiruan untuk perekaman; teks ringkasannya asli dari aplikasi.
Alamat 192.168.1.23 di bab "Prompt pertama" hanya contoh alamat Wi-Fi rumah; alamat di laptopmu akan berbeda.

Kode akhir: https://github.com/listyantidewi1/patungan

Chapter
0:00 Kait
1:22 Vibe coding yang benar
4:21 Spek satu halaman
9:53 Siapkan proyek
11:54 Prompt pertama: kerangka
17:07 Logika inti dan tes
24:16 Rasa aplikasi HP
27:33 Simpan offline
31:25 Kirim ke WhatsApp
33:49 Jadikan aplikasi
39:26 Cek kerjaan AI
43:45 Terbitkan
45:05 Penutup

Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#vibecoding #pwa #javascript
```

## Komentar tersemat: semua prompt (5167 karakter)
```
Semua prompt yang diketik di video ini, berurutan:

1. 
Buat kerangka proyek Vite dengan JavaScript murni di folder ini.
Cukup satu layar: daftar menu yang bisa ditambah (nama menu dan harga dalam rupiah)
dan daftar nama orang yang bisa ditambah.
Belum perlu menghitung apa pun. Tampilan untuk layar HP lebar 360 px.

2. 
Commit semua perubahan dengan pesan: Kerangka: input menu dan orang

3. 
Pasang Vitest. Buat berkas src/hitung.test.js berisi satu tes
untuk fungsi hitungPatungan(struk) di src/hitung.js.
Pakai contoh di SPEK.md bagian 6. Angka yang diharapkan:
Andi 50300, Bela 50300, Citra 47100, Dimas 39700, kelebihan 290.
Jangan buat fungsinya dulu.

4. 
Sekarang buat fungsi hitungPatungan di src/hitung.js sampai tes lulus.
Ikuti aturan hitung di SPEK.md bagian 5.

5. 
Tambahkan tiga tes ini ke src/hitung.test.js, lalu perbaiki fungsinya sampai semua tes lulus.
1. Tiga orang berbagi satu menu Rp10000 tanpa voucher, service, pajak: masing-masing 3400, kelebihan 200.
2. Struk tanpa voucher, service, dan pajak: hasil sama dengan porsi pesanan (Andi 47500, Bela 47500, Citra 44500, Dimas 37500).
3. Menu tanpa pemakan: lempar error dengan pesan "Ada menu yang belum dipilih pemakannya" (SPEK.md aturan 6).
Jangan mengubah angka yang diharapkan di tes.

6. 
Sambungkan hitungPatungan ke layar: setiap menu bisa dipilih pemakannya dengan mengetuk nama orang,
ada isian voucher, service (%), dan pajak (%), lalu tombol Hitung menampilkan bagian tiap orang dan kelebihannya.
Kalau fungsi melempar error, tampilkan pesannya.

7. 
Semua tes sudah lulus dan hasilnya sudah saya cek di HP. Commit semua perubahan dengan pesan "Hitung patungan + tes".

8. 
Perbaiki tampilan untuk HP yang dipegang satu tangan:
- tombol utama "Hitung" menempel di bawah layar,
- semua tombol minimal 48 px,
- kotak harga membuka papan ketik angka di HP,
- harga ditampilkan dengan titik ribuan (50.300).
Jangan mengubah src/hitung.js.

9. 
Saya cek di HP: setelah tombol Hitung diketuk, layar tidak berubah karena hasilnya ada jauh di bawah.
Pengguna bisa mengira tombolnya tidak jalan. Setelah dihitung, gulirkan layar ke hasil.
Jangan mengubah src/hitung.js.

10. 
Sudah saya cek di HP. Commit dengan pesan "Tampilan nyaman untuk satu tangan".

11. 
Simpan struk yang sedang diisi ke localStorage setiap kali ada perubahan,
dan muat lagi saat aplikasi dibuka.
Tambahkan daftar riwayat: struk yang sudah dihitung disimpan dengan tanggal dan nama tempat.

12. 
Saya sengaja merusak data di localStorage. Teks yang bukan JSON aman.
Tapi riwayat dari versi lama (entri tanpa total) membuat tombol Hitung menampilkan
"Cannot read properties of undefined (reading 'toLocaleString')".
Kalau data di localStorage tidak bisa dibaca, jangan sampai aplikasi berhenti.
Lewati entri yang rusak dan tampilkan pesan singkat. Tambahkan tesnya.
Jangan mengubah src/hitung.js.

13. 
Sudah saya cek di HP dengan data rusak. Commit dengan pesan "Simpan offline dan riwayat".

14. 
Tambahkan tombol "Bagikan" yang mengirim ringkasan dengan format persis seperti contoh ini:

Patungan Kafe Senja, 17 Nov
Total struk Rp187.110 (ditalangi Andi)

Bela  Rp50.300
Citra Rp47.100
Dimas Rp39.700

Bagian Andi Rp50.300. Kelebihan Rp290 karena pembulatan ke atas.
Transfer ke Andi ya.

Pakai Web Share API kalau tersedia. Kalau tidak tersedia, buka link wa.me dengan teks itu.
Buat fungsi pembuat teksnya terpisah dan beri tes.

15. 
Teksnya sudah saya cek, sama persis dengan contoh. Commit dengan pesan "Bagikan ringkasan ke WhatsApp".

16. 
Jadikan aplikasi ini PWA tanpa plugin:
- public/manifest.webmanifest dengan nama "Patungan", warna tema, dan ikon,
- ikon 192 px dan 512 px yang digambar dengan kode (SVG lalu PNG), bukan diunduh,
- public/sw.js yang menyimpan semua berkas di cache dengan nama berversi,
  dan menghapus cache lama saat versi berganti.
Jelaskan setiap bagian sw.js dengan komentar singkat.

17. 
Tambahkan satu kalimat kecil di bawah judul: "Bagi tagihan makan bareng, adil sampai rupiah terakhir."

18. 
Saya build ulang setelah menambah kalimat itu, tapi browser tetap menampilkan versi lama.
Di DevTools, cache masih patungan-v1 dan isinya berkas build yang lama.
VERSI di sw.js harus dinaikkan manual, dan itu mudah lupa.
Buat VERSI berubah otomatis di setiap build, tanpa plugin dan tanpa library baru.

19. 
Sudah saya cek di DevTools: versi baru muncul dan cache lama terhapus.
Commit semua perubahan dengan pesan "PWA: manifest, ikon, service worker".

20. 
Saya mencoba angka aneh di HP dan menemukan dua masalah:
1. Struk contoh dengan voucher 999999 membuat semua bagian minus (Andi Rp-255.000, total Rp-950.564).
2. Struk yang semua menunya Rp0 membuat bagian Andi Rp-∞.
Jadikan dua kasus ini tes dulu dan pastikan tesnya merah. Lalu perbaiki:
voucher paling besar sama dengan subtotal, dan struk dengan subtotal 0 menghasilkan bagian 0.
Jangan mengubah angka yang diharapkan di tes lama.

21. 
Tunjukkan fungsi, variabel, atau berkas yang tidak dipakai di mana pun di proyek ini.
Jangan dihapus dulu, tunjukkan saja beserta buktinya.

22. 
Buang yang benar-benar tidak dipakai, jalankan tes,
lalu commit semua perubahan dengan pesan "Perbaikan dari pemeriksaan akhir".
```

## Tag
vibe coding, vibe coding aplikasi android, bikin aplikasi dengan AI, cara membuat PWA, claude code tutorial indonesia, aplikasi split bill, aplikasi patungan, javascript, vite, vitest, service worker

## Deskripsi Short
```
AI membuat aplikasi patungan, semua tesnya lulus, lalu voucher 999999 membuat semua orang "dibayar". Yang menarik: AI sudah memperingatkan masalah ini sejak awal. Video lengkap (47 menit): Vibe Coding yang Benar, membuat aplikasi Patungan sampai jadi, di kanal ini.
Subscribe: https://www.youtube.com/@iTeachSWE
#vibecoding #shorts
```

## Durasi
Video 47:20 (1920x1080, 30 fps, suara Cahaya, subtitel .srt). Short 1:13 (1080x1920).
