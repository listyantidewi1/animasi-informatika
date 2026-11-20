NAMA = "P06_admin"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["// app/Http/Controllers/UserController.php", "public function update(Request $request, User $user)", "{", "    $user->update($request->all());", "    return back();", "}", "", "// app/Models/User.php", "protected $fillable = ['name', 'email', 'password', 'role'];"]
BEATS = {
 1: [A('kartuBab', min=5, a=dict(bab='BAB 6', judul='Halaman admin', sub='Area, tarif, kendaraan, pengguna, dan log aktivitas', lapis='server')), A('crud', kalimat=1)],
 2: [R('b02', 'b02_cmd'), R('b02_cmd', 'b02_tujuh', kalimat=1, maks=1.3), R('b02_tujuh', 'b02_routes', kalimat=2), R('b02_routes', 'b02_resource', kalimat=3, maks=3), R('b02_resource', 'b02_except'),
     R('b02_except', 'b02_list', kalimat=4), R('b02_list', 'b02_akhir', kalimat=5, maks=1.3), E('b03', 'b03_index', 8)],
 3: [R('b03_index', 'b03_store'), R('b03_store', 'b03_periksa', kalimat=1), R('b03_periksa', 'b03_aturan', kalimat=2), R('b03_aturan', 'b03_gagal', kalimat=3), R('b03_gagal', 'b03_simpan', kalimat=4), R('b03_simpan', 'b03_akhir', kalimat=5)],
 4: [R('b04_update', 'b04_hapus'), R('b04_hapus', 'b04_akhir', kalimat=2), E('b05_form', 'b05_form_akhir', 7)],
 5: [R('b05', 'b05_old'), R('b05_old', 'b05_err', kalimat=1), R('b05_err', 'b05_err_akhir', kalimat=3), W('b05_en', 'b05_en_akhir', kalimat=4), R('b05_lang', 'b05_env', kalimat=5), R('b05_env', 'b05_akhir', maks=1.5), W('b05_id', 'b05_id_akhir')],
 6: [A('poin', a=dict(judul='Tiga halaman lain: salin dari GitHub', sub='Polanya sama dengan halaman area', warna='#38bdf8', kol=3, tinggi=330, item=[
        dict(k=0, d=1.0, besar='Tarif', judul='RateController', isi='Hanya daftar dan ubah.', mono=False),
        dict(k=0, d=1.8, besar='Kendaraan', judul='VehicleController', isi='Daftar, cari plat, dan ubah.'),
        dict(k=0, d=2.6, besar='Pengguna', judul='UserController', isi='Tambah, ubah, hapus, dan peran.')], repo=dict(k=1, ket='Folder app/Http/Controllers/Admin dan resources/views/admin'))),
     R('b06_uc', 'b06_fill', kalimat=2), R('b06_fill', 'b06_role', kalimat=3), R('b06_role', 'b06_uc_akhir', kalimat=4), E('b06_routes', 'b06_akhir', 2)],
 7: [R('b07', 'b07_tiga', maks=1.7), R('b07_tiga', 'b07_catat', kalimat=4), R('b07_catat', 'b07_akhir', kalimat=5)],
 8: [R('b08', 'b08_use', maks=12), R('b08_use', 'b08_akhir'), W('b08', 'b08_ubah', kalimat=1), W('b08_ubah', 'b08_log', kalimat=2, maks=2.5), W('b08_log', 'b08_tabel', kalimat=3), W('b08_tabel', 'b08_akhir', kalimat=4)],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan fungsi untuk mengubah data pengguna', kode=KODE, size=28, w=1500))],
 10: [A('masalahAI', a=dict(kode=KODE, size=23, w=1640, masalah=[
        dict(k=0, judul='all() mengambil semua isian yang dikirim', isi='Termasuk isian yang tidak ada di form kita.', sorot=[3]),
        dict(k=1, judul='Tambahkan role=admin, lalu ia menjadi admin', isi='Cukup lewat alat pengembang di browser. Nama serangannya: mass assignment.', sorot=[8]),
        dict(k=3, judul='Dua penangkal, kita pakai keduanya', isi='Ambil hanya hasil validasi. Kolom role tidak pernah masuk Fillable.', sorot=[], warna='#a3e635')])),
      R('b10_commit', 'b10_commit_akhir', kalimat=5, maks=1.5),
      A('tantangan', kalimat=6, min=9, a=dict(tantangan='Buat halaman supaya pengguna bisa mengganti kata sandinya sendiri.', berikut='Bab 7: Rumus tarif'))],
}
