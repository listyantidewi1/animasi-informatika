NAMA = "P08_masuk_keluar"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["public function store(Request $request)", "{", "    $sudahAda = Parkir::where('plat', $request->plat)", "        ->where('status', 'masuk')", "        ->exists();", "", "    if ($sudahAda) {", "        return back()->with('error', 'Kendaraan sudah di dalam.');", "    }", "", "    Parkir::create(['plat' => $request->plat, 'status' => 'masuk']);", "}"]
BEATS = {
 1: [A('kartuBab', min=5, a=dict(bab='BAB 8', judul='Kendaraan masuk dan keluar', sub='Halaman yang dipakai Pak Joko sepanjang hari', lapis='server')),
     A('poin', kalimat=2, a=dict(judul='Di akhir bab ini', warna='#38bdf8', kol=3, tinggi=340, item=[
        dict(k=2, d=1.0, besar='Masuk', judul='Catat kendaraan masuk', isi='Plat dan jenis, lalu tiket muncul.'),
        dict(k=2, d=3.6, besar='Cari', judul='Nomor tiket atau plat', isi='Menemukan lagi kendaraan yang sedang parkir.'),
        dict(k=2, d=6.2, besar='Keluar', judul='Biaya dihitung otomatis', isi='Memakai rumus dari bab 7.')]))],
 2: [R('b02', 'b02_ketik', maks=1.3), R('b02_ketik', 'b02_dua', maks=6), R('b02_dua', 'b02_count', kalimat=1), R('b02_count', 'b02_akhir', kalimat=2), E('b03', 'b03_rapi', 8)],
 3: [R('b03_rapi', 'b03_plat'), R('b03_plat', 'b03_trans', kalimat=1), R('b03_trans', 'b03_akhir', kalimat=2)],
 4: [R('b04_first', 'b04_area'), R('b04_area', 'b04_kunci', kalimat=2), R('b04_kunci', 'b04_akhir', kalimat=3), A('kunci', kalimat=5, min=11, a=dict(k=5))],
 5: [R('b05_cek', 'b05_buat'), R('b05_buat', 'b05_akhir', kalimat=3), E('b06', 'b06_form', 9)],
 6: [R('b06_form', 'b06_keluar'), R('b06_keluar', 'b06_server', kalimat=2), R('b06_server', 'b06_simpan', kalimat=3), R('b06_simpan', 'b06_model', kalimat=4), R('b06_model', 'b06_akhir', kalimat=5)],
 7: [R('b07', 'b07_routes', maks=1.3), R('b07_routes', 'b07_rsorot', maks=7), R('b07_rsorot', 'b07_akhir'), W('b07', 'b07_plat', kalimat=1), W('b07_plat', 'b07_tiket', kalimat=2, maks=1.5), W('b07_tiket', 'b07_akhir', kalimat=3)],
 8: [W('b08', 'b08_tolak', maks=1.5), W('b08_tolak', 'b08_akhir', kalimat=1), R('b08_mysql', 'b08_ketik', kalimat=3, maks=3), R('b08_ketik', 'b08_error', maks=1.5), R('b08_error', 'b08_akhir', kalimat=4)],
 9: [W('b09', 'b09_cari'), W('b09_cari', 'b09_biaya', kalimat=1, maks=1.5), W('b09_biaya', 'b09_keluar', kalimat=2), W('b09_keluar', 'b09_akhir', kalimat=3, maks=1.3)],
 10: [A('hpLayar', min=20, a=dict(img='/home/user/parkir/P08/hp.png', sub='Petugas memakai aplikasi ini dari HP', item=[
        dict(k=1, judul='php artisan serve --host=0.0.0.0', mono=True, isi='Server mau menerima sambungan dari perangkat lain.'),
        dict(k=1, d=7.5, judul='http://192.168.1.10:8000', mono=True, isi='Buka alamat IP laptopmu dari HP yang tersambung ke Wi-Fi yang sama.', warna='#38bdf8')],
        repo=dict(k=2, ket='Langkah lengkap: README, bagian "Mencoba dari HP"')))],
 11: [A('cekAI', tambah=3.5, a=dict(perintah='pastikan kendaraan tidak bisa masuk dua kali', kode=KODE, size=27, w=1500))],
 12: [A('balapan', min=30, a=dict(k1=1, k2=2, k3=3)), R('b12_commit', 'b12_commit_akhir', kalimat=4, maks=1.5),
      A('tantangan', kalimat=5, min=9, a=dict(tantangan='Tambahkan tombol untuk membatalkan transaksi yang salah ketik, lalu catat pembatalannya di log.', berikut='Bab 9: Tiket dan struk'))],
}
