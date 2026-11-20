NAMA = "P12_uji"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
KODE = ["masuk('rafi');", "$t = token('rafi', '/peminjam/index.php');", "",
        "$r = buka('rafi', '/peminjam/ajukan.php', [", "    'csrf' => $t, 'alat_id' => $laptop, 'jumlah' => 1, 'hari' => 2,", "]);", "",
        "uji('Rafi bisa meminjam laptop', str_contains($r[1], 'Pengajuan terkirim'));"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 12', judul='Pengujian', sub='Lima skenario, satu perintah', lapis='semua'))],
 2: [A('poin', a=dict(judul='Lima skenario uji', sub='Setiap skenario punya jalur yang berhasil dan jalur yang seharusnya gagal', warna='#a3e635', kol=5, tinggi=420, sj=32, si=24, item=[
        dict(k=2, judul='1  Login', isi='sandi benar, sandi salah, akun nonaktif'), dict(k=3, judul='2  Tambah alat', isi='kode kembar, isian kosong'), dict(k=4, judul='3  Pinjam', isi='termasuk saat stok habis'),
        dict(k=5, judul='4  Kembali', isi='denda, tepat di hari jatuh tempo'), dict(k=6, judul='5  Hak akses', isi='membuka halaman milik peran lain')]))],
 3: [R('b03', 'b03_uji', kalimat=0, maks=10), R('b03_uji', 'b03_buka', kalimat=1), R('b03_buka', 'b03_salin', kalimat=2), R('b03_salin', 'b03_akhir', kalimat=4)],
 4: [R('b04', 'b04_awal', kalimat=1), R('b04_awal', 'b04_telat', kalimat=2), R('b04_telat', 'b04_akhir', kalimat=3)],
 5: [R('b05', 'b05_multi', kalimat=1), R('b05_multi', 'b05_syarat', kalimat=2), R('b05_syarat', 'b05_akhir', kalimat=3)],
 6: [R('b06', 'b06_jalan', kalimat=0), R('b06_jalan', 'b06_akhir', maks=1.3)],
 7: [R('b07', 'b07_jalan', kalimat=0, maks=3), R('b07_jalan', 'b07_gagal_akhir', kalimat=2, maks=2.2), R('b07_balik', 'b07_akhir', kalimat=3, asli=True, speed=5.6, db=-5.5), R('b07_akhir', 'b07_akhir', da=-5.5, db=-3.0, ekor=True)],
 8: [A('cekAI', tambah=3.5, a=dict(perintah='buat uji otomatis untuk fitur pinjam', kode=KODE, size=28, w=1560))],
 9: [A('poin', min=22, a=dict(judul='Yang tidak diuji', sub='Uji buatan AI hanya mencoba jalur yang berhasil', warna='#ff6b6b', kol=4, tinggi=300, sj=34, item=[
        dict(k=1, d=.4, judul='Stok habis'), dict(k=1, d=2.0, judul='Jumlah nol'), dict(k=1, d=3.6, judul='Dua orang bersamaan'), dict(k=1, d=5.6, judul='Meminjam tanpa login')])), R('b09_commit', 'b09_akhir', kalimat=4, maks=2.5), A('lanjut', kalimat=5, min=14, a=dict(selesai='Lima skenario uji, 21 pemeriksaan, satu perintah.', berikut='Bab 13: Online'))],
}
