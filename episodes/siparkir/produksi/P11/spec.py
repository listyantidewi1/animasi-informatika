NAMA = "P11_pengujian"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["test('halaman admin bisa dibuka', function () {", "    $admin = User::where('role', 'admin')->first();", "", "    $this->actingAs($admin)->get('/admin/tarif')->assertOk();", "});"]
BEATS = {
 1: [A('kartuBab', min=5, a=dict(bab='BAB 11', judul='Pengujian', sub='Satu perintah memeriksa seluruh aplikasi', lapis='semua')),
     A('poin', kalimat=1, a=dict(judul='Feature test: menguji dari luar', sub='Seperti pengguna sungguhan', warna='#a3e635', kol=3, tinggi=320, item=[
        dict(k=2, d=4.0, besar='1', judul='Membuka alamat', isi='Misalnya /admin/tarif.'),
        dict(k=2, d=5.4, besar='2', judul='Mengirim form', isi='Misalnya plat dan jenis kendaraan.'),
        dict(k=2, d=6.8, besar='3', judul='Memeriksa jawabannya', isi='Boleh, ditolak, atau dialihkan.')]))],
 2: [R('b02', 'b02_xml'), R('b02_xml', 'b02_pest', kalimat=1), R('b02_pest', 'b02_use', kalimat=3, maks=2), R('b02_use', 'b02_akhir'), E('b03', 'b03_atas', 9)],
 3: [R('b03_atas', 'b03_before'), R('b03_before', 'b03_acting', kalimat=1), R('b03_acting', 'b03_with', kalimat=2), R('b03_with', 'b03_lain', kalimat=4), R('b03_lain', 'b03_akhir', kalimat=5), E('b04', 'b04_atas', 9)],
 4: [R('b04_atas', 'b04_masuk'), R('b04_masuk', 'b04_keluar', kalimat=1), R('b04_keluar', 'b04_harap', kalimat=2), R('b04_harap', 'b04_lain', kalimat=3), R('b04_lain', 'b04_akhir', kalimat=4)],
 5: [R('b05', 'b05_hijau', maks=1.5), R('b05_hijau', 'b05_rute', kalimat=1), R('b05_rute', 'b05_hapus', kalimat=2), R('b05_hapus', 'b05_test2', kalimat=3, maks=1.5), R('b05_test2', 'b05_merah', kalimat=4, maks=1.5), R('b05_merah', 'b05_pulih', kalimat=5), R('b05_pulih', 'b05_akhir', kalimat=6, maks=2.5)],
 6: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan test untuk halaman admin', kode=KODE, size=30, w=1560, ket='Test ini hijau.', ketK=2))],
 7: [A('masalahAI', a=dict(kode=KODE, size=26, w=1640, masalah=[
        dict(k=1, judul='Hanya memeriksa bahwa admin bisa masuk', isi='Tidak ada satu pun pemeriksaan untuk orang yang seharusnya ditolak.', sorot=[3]),
        dict(k=2, judul='Penjaganya hilang, test tetap hijau', isi='Admin tetap bisa masuk. Petugas sekarang juga bisa, dan tidak ada yang tahu.', sorot=[3]),
        dict(k=3, judul='Test yang baik memeriksa yang seharusnya ditolak', isi='Bukan hanya hal yang seharusnya berhasil.', sorot=[], warna='#a3e635')])),
     R('b07_commit', 'b07_commit_akhir', kalimat=4, maks=1.5),
     A('tantangan', kalimat=5, min=9, a=dict(tantangan='Tulis test yang memastikan tarif tidak bisa diisi angka negatif.', berikut='Bab 12: Online'))],
}
