# Spek: Patungan

## 1. Masalah
Setelah makan bareng, menghitung bagian tiap orang itu lama dan sering salah,
terutama karena pajak, service, voucher, dan menu yang dimakan bersama.

## 2. Pengguna
Satu orang yang menalangi pembayaran. Memakai HP dengan satu tangan,
di kafe yang sinyalnya mungkin jelek.
- Tampilan nyaman di layar HP.
- Tombol mudah dijangkau jempol.
- Tetap jalan tanpa internet.

## 3. Fitur wajib
- Masukkan menu dan harganya.
- Pilih siapa saja yang memakan setiap menu (satu menu boleh dibagi beberapa orang).
- Masukkan voucher (rupiah), service (persen), dan pajak (persen).
- Tampilkan berapa yang harus dibayar setiap orang.
- Kirim ringkasan ke WhatsApp.
- Simpan riwayat patungan di HP.

## 4. Sengaja tidak dibuat
- Login atau akun.
- Server atau database online.
- Memindai struk dengan kamera.
- Menghubungkan ke rekening bank.

## 5. Aturan hitung
1. Voucher dikurangkan dulu dari subtotal.
2. Service dihitung dari subtotal setelah voucher.
3. Pajak dihitung dari (subtotal setelah voucher + service).
4. Voucher, service, dan pajak dibagi sebanding dengan porsi pesanan setiap orang.
5. Semua uang dalam rupiah bulat. Bagian setiap orang dibulatkan KE ATAS
   ke kelipatan Rp100, supaya yang menalangi tidak rugi. Kelebihannya ditampilkan.
6. Kalau ada menu yang belum dipilih pemakannya, jangan menghitung.
   Tampilkan pesan: "Ada menu yang belum dipilih pemakannya".

## 6. Contoh yang dihitung manual
Andi menalangi. Service 5%, pajak 10%, voucher Rp15.000.

| Menu | Harga | Dimakan oleh |
|---|---|---|
| Nasi goreng spesial | 32000 | Andi |
| Mie ayam bakso | 28000 | Bela |
| Ayam geprek | 25000 | Citra |
| Kentang goreng | 30000 | Andi, Bela, Citra, Dimas |
| Es teh manis (2 gelas) | 16000 | Andi, Dimas |
| Kopi susu | 22000 | Dimas |
| Pisang bakar | 24000 | Bela, Citra |

Subtotal 177000, setelah voucher 162000, service 8100, pajak 17010, total struk 187110.

| Orang | Porsi pesanan | Bagian tepat | Dibulatkan |
|---|---|---|---|
| Andi | 47500 | 50213,14 | 50300 |
| Bela | 47500 | 50213,14 | 50300 |
| Citra | 44500 | 47041,78 | 47100 |
| Dimas | 37500 | 39641,95 | 39700 |
| Jumlah | 177000 | 187110 | 187400 (lebih 290) |
